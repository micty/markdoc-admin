/**
 * 批量管理多个下拉列表组件的集合。
 */
define('DropListSet.v2', function(require, module, exports) {
    var KISP = require('KISP');
    var $Object = KISP.require('Object');
    var Emitter = KISP.require('Emitter');
    var Defaults = require('Defaults');
    var Table = require('Table');

    var DropList = module.require('DropList');

    var mapper = new Map();

    function DropListSet(config) {

        config = Defaults.clone(module, config);

        var emitter = new Emitter(this);

        var meta = {
            'custom': config.custom,
            'readonly': config.readonly,
            'empty': config.empty,
            'columns': config.columns,
            'field': config.field,
            'filters': config.filters,
            'order': config.order,

            'emitter': emitter,
            'list': null, //
            'ctrls': [], //所有生成的 ctrl 组件列表。
            'id$ctrl': new Map(), //记录外部使用的 id 对应于 ctrl 实例。
            'ctrl$info': new Map(), //记录 ctrl 实例对应的元数据。
        };

        mapper.set(this, meta);

    }



    DropListSet.prototype = {
        constructor: DropListSet,

        /**
         * 创建并添加一个文本下拉列表组件实例到集合中。
         */
        add: function(options) {
            var meta = mapper.get(this);
            var ctrl = DropList.create(meta, options);

            var id = options.id || ctrl.id;
            var list = options.list || meta.list;
            var cell = options.cell;

            var info = {
                'id': id, //该 ctrl 对应的 id。
                'item': options.item, //该 ctrl 对应的选中的项。
                'data': options.data, //该 ctrl 对应的自定义数据。
                'disabled': options.disabled, //是否禁用了组件。
                'list': list, //该 ctrl 对应的列表数据。
                'ctrl': ctrl, //方便代码调用，引用自身对应的实例。
                'cell': cell, //专门针对表格中的批量使用。
                'event': null, //手动选中后的事件对象。
            };

            meta.ctrl$info.set(ctrl, info);
            meta.id$ctrl.set(id, ctrl); // id 对应的 ctrl 实例。
            meta.ctrls.push(ctrl);

            if (Table.isCell(cell)) {
                cell.ctrl = ctrl;
                cell.data.info = info;
            }

            if (list || options.render) { //有列表，或者指定了立即渲染。
                ctrl.render(list);
            }

            return ctrl;
        },


        /**
         * 迭代集合中的每一项并执行回调函数。
         */
        each: function(fn) {
            var meta = mapper.get(this);

            fn && meta.ctrls.map(function(ctrl) {
                var info = meta.ctrl$info.get(ctrl);

                fn(ctrl, info);
            });
        },

        /**
         * 渲染集合中的所有组件实例。
         */
        render: function() {
            var meta = mapper.get(this);
            var list = [];

            this.each(function(ctrl, info) {
                info.item && list.push(info);
                ctrl.render();
            });

            return list;
        },


        /**
         * 给指定的或全部的实例填充列表。
         * 已重载 fill(list); 填充全部实例。
         * 已重载 fill(id, list); 填充指定的部实例。
         */
        fill: function(id, list) {
            //重载 fill(list);
            if (Array.isArray(id)) {
                list = id;
                id = null;
            }

            var meta = mapper.get(this);

            if (id) {
                var ctrl = this.get(id);
                //ctrl.reset();       //避免上次的影响。
                ctrl.fill(list);
            } else {
                meta.list = list;

                this.each(function(ctrl, info) {
                    ctrl.fill(list);
                });
            }

        },

        /**
         * 从集合中移除指定 id 的项。
         */
        remove: function(id) {
            var ctrl = this.get(id);

            if (!ctrl) {
                return;
            }


            var meta = mapper.get(this);

            var index = meta.ctrls.findIndex(function(item) {
                return item === ctrl;
            });

            meta.ctrls.splice(index, 1);
            meta.ctrl$info.delete(ctrl);
            meta.id$ctrl.delete(id);
        },

        /**
         * 设置指定的或全部的下拉列表的选中项。
         */
        select: function(id, item) {
            if (id) {
                var ctrl = this.get(id);
                ctrl && ctrl.select(item);
                return;
            }


            this.each(function(ctrl, info) {
                var item = info.item;

                item && ctrl.select(item);
            });
        },

        /**
         * 重置指定的或全部的实例。
         * 已重载 reset(); 
         * 已重载 reset(id);
         */
        reset: function(id) {
            if (id) {
                var ctrl = this.get(id);
                ctrl && ctrl.reset();
                return;
            }

            this.each(function(ctrl, info) {
                ctrl.reset();
            });
        },

        /**
         * 获取指定 id 的实例。
         */
        get: function(id) {
            var meta = mapper.get(this);
            var ctrl = meta.id$ctrl.get(id);

            if (!ctrl) {
                console.warn('集合中不存 id 为 ' + id + ' 的项。');
            }

            return ctrl;
        },

        /**
         * 绑定事件。
         */
        on: function() {
            var meta = mapper.get(this);
            meta.emitter.on(...arguments);
        },

        /**
         * 销毁集合中的子组件和当前组件。
         */
        destroy: function() {
            var meta = mapper.get(this);

            meta.ctrls.map(function(ctrl) {
                ctrl.destroy();
            });

            meta.ctrls.splice(0); //清空数组。
            meta.ctrl$info.clear();
            meta.id$ctrl.clear();
            meta.emitter.destroy();

            mapper.delete(this);
        },

    };

    return DropListSet;




});