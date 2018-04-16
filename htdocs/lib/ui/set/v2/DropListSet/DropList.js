define('DropListSet.v2/DropList', function(require, module, exports) {

    var DropList = require('DropList');



    return {

        /**
         * 创建一个下拉列表组件。
         */
        create: function(meta, options) {

            var ctrl = new DropList({
                'container': options.container,
                'disabled': options.disabled,
                'order': meta.order,
                'custom': meta.custom,
                'readonly': meta.readonly,
                'empty': meta.empty,
                'columns': meta.columns,
                'field': meta.field,
                'filters': meta.filters,

            });

            ctrl.on({
                'select': function(item, options) {
                    var info = meta.ctrl$info.get(this);

                    info.item = item;
                    info.event = options.event;
                    info.oldItem = options.oldItem;

                    meta.emitter.fire('select', [this, info]);
                },

                //清空所选。
                'empty': function() {
                    var info = meta.ctrl$info.get(this);

                    info.item = null;
                    info.event = null;
                    meta.emitter.fire('empty', [this, info]);
                },
                'error': function(type, msg) {
                    KISP.alert(msg);
                },
                'focus': function() {
                    var info = meta.ctrl$info.get(this);

                    meta.emitter.fire('focus', [this, info]);
                },
                'blur': function() {
                    var info = meta.ctrl$info.get(this);

                    meta.emitter.fire('blur', [this, info]);
                },

                'change': function(keyword) {
                    console.log(keyword);

                    var info = meta.ctrl$info.get(this);
                    meta.emitter.fire('change', [this, keyword, info]);
                },

                'fill': function(list) {
                    var info = meta.ctrl$info.get(this);
                    info.list = list;
                },

            });

            return ctrl;

        },



    };




});