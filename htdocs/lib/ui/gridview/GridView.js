
/**
* 带有翻页、固定表头的列表表格展示器组件。
*/
define('GridView', function (require, module, exports) {
    var $ = require('$');
    var KISP = require('KISP');
    var Emitter = KISP.require('Emitter');
    var $Array = KISP.require('Array');
    var $String = KISP.require('String');
    var $Object = KISP.require('Object');
    var Defaults = require('Defaults');

    var Template = module.require('Template');
    var Table = module.require('Table');
    var Pager = module.require('Pager');
    var Resizer = module.require('Resizer');
    var Fields = module.require('Fields');
    var Check = module.require('Check');
    var Meta = module.require('Meta');


    var mapper = new Map();



    /**
    * 构造器。
    *   config = {
    *       container: '',      //必选，生成的组件要塞进去的容器，是一个 jQuery 选择器。
    *       size: 10,           //必选，正常模式下的分页大小，即每页多少条记录。
    *       no: 1,              //必选，当前的页码。
    *       total: 0,           //必选，总的记录数。 如果指定了 all 为一个数组，则取 all.length。
    *       primaryKey: '',     //必选，列表数据中项的主键的键名。 因为每个项中有很多字段，须指定哪个字段是主键，如 `id`。
    *       fields: [           //必选，表格列的字段数组。
    *           {
    *               name: '',       //必选，列的编程名称。
    *               caption: '',    //必选，列的标题，直接显示在表头上的。
    *               width: 0,       //必选，列的宽度。
    *               class: '',      //可选，列的 css 类名。 该列的所有单元格都会应用此类名。 
    *               dragable: true, //可选，是否允许该列拖曳来调整列宽。 默认为允许，只有指定为 false 才禁用拖曳。
    *               delegate: '',   //可选，要进一步监听的委托事件。 如 `[data-cmd]`。
    *           },
    *       ],
    *       footer: true,       //可选，是否显示 footer 部分。
    *       class: '',          //可选，组件的 css 类名。
    *       all: null | [],     //可选，全部列表数据数组。 如果指定该字段，则在组件内部进行分页。 默认为 null。
    *       check: true | {     //可选，是否启用复选框列。 可以指定为 true 或 false 或一个 {} 配置。
    *           name: 'check',      //
    *           width: 43,          //
    *           class: 'check',     //
    *       },   
    *       order: true | {     //可选，是否启用序号列。 可以指定为 true 或 false 或一个 {} 配置。
    *           name: 'order',      //
    *           width: 50,          //
    *           caption: '序号',    //
    *           global: true,       //true: 使用全局序号，即跟分页无关。 false: 使用局部序号，即每页的序号都是从 1 开始。
    *       },   
    *   };
    */
    function GridView(config) {
        config = Defaults.clone(module, config);

        var emitter = new Emitter(this);
        var fields = Fields.get(config);
        var width = config.width;

        if (width == 'auto') {
            width = Fields.sumWidth(fields) + 264;
        }

        var meta = Meta.create(config, {
            'emitter': emitter,         //
            'fields': fields,
            'width': width,
            'this': this,
            'checkItem': function (item, checked) {
                return Check.item(meta, item, checked);
            },
            'checkAll': function () {
                return Check.all(meta);
            },
        });
       
        mapper.set(this, meta);

        Object.assign(this, {
            'id': meta.id,
        });


        //全部列表数据数组。 
        //如果指定该字段，则在组件内部进行分页。
        if (meta.all) {
            this.on('pager', 'change', function (no, size) {
                //meta.all 可能会在 this.set() 中给改变。
                if (!meta.all) {
                    return;
                }

                var list = Pager.list(meta.all, no, size);
                this.fill(list);
            });
        }


    }



    //实例方法。
    GridView.prototype = {
        constructor: GridView,

        id: '',
        $: null,

        /**
        * 渲染。
        */
        render: function () {
            var meta = mapper.get(this);

            var tpl = meta.tpl = Template.create(meta);
            var html = tpl.fill(meta);

            meta.$ = this.$ = $(meta.container);
            meta.$.html(html);


            var table = meta.table = Table.create(meta);
            table.render();

            var resizer = meta.resizer = Resizer.create(meta);
            resizer.render();

            var pager = meta.pager = Pager.create(meta);
            pager.render();

            //切换显示已选模式和正常模式。
            meta.$.on('click', '#' + meta.counterId, function () {
                var selectedMode = meta.selectedMode = !meta.selectedMode;
                var list = selectedMode ? meta.this.get() : meta.oldList;

                $(this).toggleClass('selected-mode', selectedMode);
                meta.table.fill(list);

            });

        },

        /**
        * 填充指定的列表数据。
        */
        fill: function (list, fn) {
            var meta = mapper.get(this);

            if (fn) {
                list = $Array.map(list, fn);
            }

            meta.oldList = list;
            meta.table.fill(list);
            meta.emitter.fire('fill', [list]);
        },

        /**
        * 选中指定的项(多个)。
        */
        check: function (list) {
            var meta = mapper.get(this);

            list && list.forEach(function (item) {
                meta.checkItem(item, true);
            });

            meta.list && this.fill(meta.list);
        },


        /**
        * 清空所选。
        */
        clear: function () {
            var meta = mapper.get(this);
            var current = meta.current;
            if (!current.list.length) {
                return;
            }

            current.id$item = {};
            current.list = [];

            meta.table.column('check', function (cell) {
                cell.ctrl.removeClass('on');
            });

            $('#' + meta.checkAllId).removeClass('on');
            $('#' + meta.countId).html(0);

            meta.emitter.fire('clear');
        },

        /**
        * 设置属性。
        *   options = {
        *       all: null | [],     //
        *       no: 1,              //
        *       total: 0,           //
        *       size: 10,           //
        *   };
        */
        set: function (options) {
            var meta = mapper.get(this);
            var all = options.all;
            var page = $Object.filter(options, ['total', 'size', 'no']);

            if (!$Object.isEmpty(page)) {
                Object.assign(meta, page);
                meta.pager.render(page);
            }

            if (all) {
                meta.all = all;
            }
        },

        /**
        * 获取当前选中的列表数据。
        */
        get: function () {
            var meta = mapper.get(this);
            var list = meta.current.list || [];
            var id$item = meta.current.id$item;

            //映射回具体的记录。
            list = list.map(function (id) {
                return id$item[id];
            });

            return list;
        },

        /**
        * 跳转到指定的页码。
        */
        to: function (no) {
            var meta = mapper.get(this);
            meta.pager.to(no);
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
            meta.resizer.destroy();
            meta.table.destroy();
            meta.pager.destroy();
            meta.tpl.destroy();

            mapper.delete(this);

        },

        /**
        * 绑定事件。
        */
        on: function () {
            var meta = mapper.get(this);
            meta.emitter.on(...arguments);
        },

    };


    //同时提供静态成员。
    Object.assign(GridView, {});






    return GridView;

    
});


