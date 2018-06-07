
/**
* 菜单树。
*/
define('FileTree', function (require, module, exports) {
    var $ = require('$');
    var KISP = require('KISP');
    var $String = KISP.require('String');
    var $Object = KISP.require('Object');
    var Defaults = require('Defaults');
    var Emitter = KISP.require('Emitter');

    var Events = module.require('Events');
    var Meta = module.require('Meta');
    var Template = module.require('Template');


    var mapper = new Map();


    function FileTree(config) {
        config = Defaults.clone(module, config);

        var emitter = new Emitter(this);

        var meta = Meta.create(config, {
            'this': this,
            'emitter': emitter,
        });

        mapper.set(this, meta);


        Object.assign(this, {
            'id': meta.id,
            '$': meta.$,
        });

    }




    FileTree.prototype = {
        constructor: FileTree,

        id: '',
        $: null,

        /**
        * 渲染组件。
        */
        render: function (list) {
            var meta = mapper.get(this);

            meta.$ = $(meta.container);
            meta.tpl = Template.create(meta);

            list && this.fill(list);
            
            meta.$.show();
            meta.$.addClass('FileTree-v2');
            Events.bind(meta);
        },


        /**
        * 填充列表数据。
        * 会触发 `fill` 事件。
        */
        fill: function (list) {
            var meta = mapper.get(this);
            var current = meta.current;

            //深拷贝，避免影响业务层数据，因为组件内部要添加 id 等额外的字段。
            list = JSON.stringify(list);
            list = JSON.parse(list);

            meta.list = list;
            meta.id$item = {};      //清空。
            meta.eid$item = {};     //

            this.each(meta.init);
            this.each(meta.open);

            meta.fill(list);

            //填充后，所有的 eid 可能会重新分配了。
            //如果之前已记录了当前激活的项，则需要根据 id 重新获取对应的项。
            //以便后续可以使用到正确 eid 等字段。
            if (current) {
                meta.current = this.get(current.id);
            }

            meta.emitter.fire('fill', [list]);
        },

        /**
        * 插入一个数据节点到指定位置。
        * 已重载 insert(item, parent, index);  //传入的 parent 是一个 item 对象。
        * 已重载 insert(item, id, index);      //传入的 parent 是一个 id 字符串。
        * 已重载 insert(item, index); 
        * 已重载 insert(item); 
        */
        insert: function (item, parent, index) {
            var meta = mapper.get(this);

            switch (typeof parent) {
                case 'string':   //重载 insert(item, id, index);
                    var pid = parent;
                    parent = meta.id$item[pid];

                    if (!parent) {
                        throw new Error('不存在 id 为 ' + pid + ' 的父节点。');
                    }
                    break;

                case 'number': //重载 insert(item, index); 
                    index = parent;
                    parent = null;
                    break;
            }

            parent = parent || null;
            item.parent = parent;
            meta.init(item);
            meta.open(item);

            FileTree.each(item.list, meta.init);
            FileTree.each(item.list, meta.open);

            var list = parent ? parent.list : meta.list;
            var length = list.length;

            if (index === undefined || index >= length) {
                list.push(item);
            }
            else {
                list.splice(index, 0, item);
            }

            meta.fill(); //重新填充。
            meta.emitter.fire('insert', [item]);

        },

        /**
        * 在当前已激话的菜单项后面插入一个数据节点。
        */
        add: function (item) {
            var meta = mapper.get(this);
            var parent = meta.current || null;

            this.insert(item, parent);
            meta.emitter.fire('add', [item]);
        },

        /**
        * 删除一个节点。
        * 已重载 delete(item);     //传入一个具体的 item，里面必须包含 id 字段。
        * 已重载 delete(id);       //传入一个 item 的 id 字符串。
        */
        delete: function (item) {
            var meta = mapper.get(this);
            var oItem = this.get(item);

            if (!oItem) {
                console.error('不存在该节点:', item);
                return;
            }


            var parent = oItem.parent;
            var list = parent ? parent.list : meta.list;

            var index = list.findIndex(function (item) {
                return item.id == oItem.id;
            });

            if (index < 0) {
                throw new Error('在该节点的同级节点列表中找不到自己。');
            }

            //从列表中删除该节点。
            list.splice(index, 1);
           
            delete meta.id$item[oItem.id];
            delete meta.eid$item[oItem.eid];

            //从主键中递归删除。
            FileTree.each(item.list, function (item) {
                delete meta.id$item[item.id];
                delete meta.eid$item[item.eid];
            });
           
            //删除的是当前激活的项。
            if (meta.current === oItem) {
                meta.current = null;
            }

            meta.fill();
            meta.emitter.fire('delete', [oItem]);
            
        },

        /**
        * 在同层级中移动指定的节点。
        * 已重载 move(item, step);     //传入一个具体的 item，里面必须包含 id 字段。
        * 已重载 move(id, step);       //传入一个 item 的 id 字符串。
        */
        move: function (item, step) {
            var meta = mapper.get(this);
            var oItem = this.get(item);

            if (!oItem) {
                console.error('不存在该节点:', item);
                return;
            }

            var parent = oItem.parent;
            var list = parent ? parent.list : meta.list;

            var index = list.findIndex(function (item) {
                return item.id == oItem.id;
            });

            if (index < 0) {
                throw new Error('在该节点的同级节点列表中找不到自己。');
            }

            //移动后的目标位置。 确保在 0 到 maxIndex 之间。
            //step 可为正，可为负。
            var targetIndex = index + step;
            var maxIndex = list.length - 1;

            targetIndex = Math.max(targetIndex, 0);
            targetIndex = Math.min(targetIndex, maxIndex);

            var targetItem = list[targetIndex];
            var srcItem = list[index];

            list[index] = targetItem;
            list[targetIndex] = srcItem;

            meta.fill();
            meta.emitter.fire('move', [oItem, step]);
            
        },

        /**
        * 打开指定的节点。
        * 这会连同它的所有父节点也一起打开。
        * 已重载 open(item);
        * 已重载 open(id);
        */
        open: function (item) {
            var meta = mapper.get(this);
            var oItem = this.get(item);

            if (!oItem) {
                throw new Error('不存在该节点');
            }
            
            meta.open(oItem, true);
            meta.fill();

            //是一个目录，则先假设是折叠的。
            if (oItem.list) {
                oItem.open = false;
            }

            $('#' + oItem.eid).trigger('click');

        },

        /**
        * 关闭指定的节点。
        * 采用模拟人工操作的方式进行关闭，不会影响父节点。
        * 已重载 close(item);
        * 已重载 close(id);
        */
        close: function (item) {
            var meta = mapper.get(this);
            var oItem = this.get(item);

            if (!oItem) {
                throw new Error('不存在该节点');
            }

            if (oItem.open) {
                $('#' + oItem.eid).trigger('click');
            }
        },



        /**
        * 迭代本实例的每个节点，执行指定的回调函数。
        */
        each: function (fn) {
            var meta = mapper.get(this);
            FileTree.each(meta.list, fn);
        },

        /**
        * 获取指定的节点或全部节点列表。
        * 已重载 get();        //获取全部节点列表。
        * 已重载 get(id);      //获取指定的节点。
        * 已重载 get(item);    //获取指定的节点。 item = { id, };
        */
        get: function (id) {
            var meta = mapper.get(this);

            if (!id) {
                return meta.list;
            }

            switch (typeof id) {
                case 'string':
                    return meta.id$item[id];

                case 'object':
                    var item = id;
                    id = item.id;

                    if (typeof id == 'string') {
                        return meta.id$item[id];
                    }

                    return meta.list.includes(item) ? item : null;

                default:
                    return null;
            }

        },

        /**
        * 更新指定的节点。
        *   item = {
        *       id: '',     //必选，节点的 id。
        *       name: '',   //必选，节点的文本名称。
        *       data: {},   //可选，节点的用户自定义数据。
        *   };
        */
        update: function (item) {
            var meta = mapper.get(this);
            var oItem = this.get(item);

            if (!oItem) {
                console.error('不存在该节点:', item);
            }

            oItem.data = item.data;
            oItem.name = item.name;

            $('#' + oItem.eid).html(item.name);
        },

        /**
        * 销毁。
        */
        destroy: function () {
            var meta = mapper.get(this);

            //已销毁。
            if (!meta) {
                return;
            }

            meta.emitter.destroy();
            meta.tpl.destroy();
            meta.$.off(); //这个要解除绑定。
            mapper.delete(this);
        },

        /**
        * 绑定事件。
        */
        on: function (name, fn) {
            var meta = mapper.get(this);
            meta.emitter.on(...arguments);
        },

    };




    //静态方法。
    Object.assign(FileTree, {

        /**
        * 用深度优先的方式迭代树结构的每个节点并执行回调函数。
        */
        each: function (list, fn) {
            if (!list || !fn) {
                return;
            }

            list.map(function (item, index) {
                fn(item, index);

                FileTree.each(item.list, fn);
            });

        },

        /**
        * 把指定的一维数组构建成一棵树的数据结构。
        */
        tree: function (list, options) {
            var field = options.field;
            var roots = [];     //所有的根节点。
            var id$item = {};   //以 id 作为主键的映射关系。

            list.map(function (item) {
                var id = item[field.id];
                var fname = field.name;
                var name = typeof fname == 'function' ? fname(item) : item[fname];

                id$item[id] = {
                    'name': name,
                    'item': item,
                };
            });

            list.map(function (sitem) {
                var id = sitem[field.id];
                var item = id$item[id];
                var pid = sitem[field.parentId];

                if (options.isRoot(sitem)) {
                    roots.push(item);
                    return;
                }


                var parent = id$item[pid];
                var list = parent.list = parent.list || [];
                list.push(item);
            });


            //$Object.each(id$item, function (id, item) {
            //    var pid = item.item[field.parentId];

            //});

            return roots;

        },

    });


    return FileTree;
});