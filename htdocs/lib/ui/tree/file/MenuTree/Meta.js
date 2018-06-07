
/**
* 
*/
define('FileTree/Meta', function (require, module, exports) {

    var $ = require('$');
    var KISP = require('KISP');
    var $String = KISP.require('String');

    //向上追溯指定节点的所有父节点直到根节点，迭代执行指定的回调函数。
    function trace(node, fn) {
        var parent = node.parent;

        if (!parent || !fn) {
            return;
        }

        fn(parent);
        trace(parent, fn);
    }



    return {

        create: function (config, others) {


            var meta = {
                'id': $String.random(),
                'container': config.container,

                '$': null,
                'this': null,
                'emitter': null,
                'tpl': null,

                'list': null,       //填充后的数据结果，带有额外字段的。
                'current': null,    //当前激活的项。

                'id$item': {},      //id 作为主键关联到项。
                'eid$item': {},     //eid 作为主键关联到项。 (dom 元素 id) 

                /**
                * 初始化：分配 id 和关联 parent 等。
                * item 保留了以下字段：
                *   item = {
                *       name: '',       //必选，节点名称，在 UI 上展示的文本。
                *       id: '',         //可选，节点的唯一 id，用于数据访问。 业务层如果不指定，则使用自动创建的随机 id。
                *       eid: '',        //内部创建的。 用于 UI 上的 DOM 元素 id，内部自动创建的随机 id。
                *       parent: null,   //内部创建的。 父级节点。 
                *       open: false,    //针对目录节点，是否打开。 如果指定为 true，则会在填充后打开，以及打开所有的父节点。
                *       foldable: false,//针对目录节点，是否允许折叠，即是否允许点击后收起（关闭）。
                *       level: 0,       //当前菜单的层级。 顶级的是 0，依次类推。
                *       list: [],       //可选，针对目录节点，下级节点列表。 
                *       icons: [        //可选，鼠标 hover 在菜单项时，出现在菜单项右边的图标列表。
                *           {
                *               icon: '',   //图标 css 类名。
                *           },
                *       ],      
                *   };
                */
                'init': function (item) {
                    var id = item.id;   //用于数据节点的 id。
                    var eid = '';       //用于 DOM 元素的 id。
                    var list = item.list = item.list || [];  //不管有没有子节点，为处理方便，这里统一分配一个数组。
                    var parent = item.parent;
                    var level = parent ? parent.level + 1 : 0;


                    if (!id) { //未指定 item.id，则 eid 和 id 相同。
                        id = eid = item.id = item.eid = $String.random();
                    }
                    else { //指定了 item.id，则 eid 独立。
                        eid = item.eid = $String.random();
                    }

                    item.level = level;
                    meta.id$item[id] = item;
                    meta.eid$item[eid] = item;

                    list.map(function (node) {
                        node.parent = item;    //分配 `parent` 字段。
                    });

                    
                },

                /**
                * 打开指定的节点和它的所有父节点。
                * 已重载 open(item); 
                * 已重载 oepn(id);
                */
                'open': function (item, open) {

                    if (typeof item == 'string') {
                        var id = item;
                        item = meta.id$item[id];

                        if (!item) {
                            throw new Error('不存在 id 为 ' + id + ' 的节点。');
                        }
                    }

                    //如果指定了状态，则顺便更改当前节点的。
                    if (typeof open == 'boolean') {
                        item.open = open;
                    }


                    //向父节点追溯，更改 open 状态。
                    //即：只要当前节点是打开状态，则它所有的父节点都要设置为打开状态。
                    trace(item, function (parent) {
                        if (item.open) {
                            parent.open = item.open;
                        }
                    });

                    return item;
                   
                },

                'fill': function (list) {
                    list = list || meta.list;

                    var html = meta.tpl.fill({ 'list': list, });

                    meta.$.html(html);
                    meta.list = list;

                },

            };


            Object.assign(meta, others);



            return meta;
           
        },


    };
    
});


