
/**
*
* 带输入文本框的下拉列表组件。
*/
define('CheckList', function (require, module) {
    var KISP = require('KISP');
    var $ = require('$');
    var Defaults = require('Defaults');

    var Emitter = KISP.require('Emitter');
    var $Array = KISP.require('Array');
    var $String = KISP.require('String');
    var $Object = KISP.require('Object');

    var Input = module.require('Input');
    var Masker = module.require('Masker');
    var Meta = module.require('Meta');
    var Table = module.require('Table');
    var Template = module.require('Template');

    var mapper = new Map();


    function CheckList(config) {
      
        config = Defaults.clone(module, config);

        var emitter = new Emitter(this);

        var meta = Meta.create(config, {
            'emitter': emitter,
        
            'this': this,
        });

  
        mapper.set(this, meta);

        Object.assign(this, {
            'id': meta.id,
            '$': meta.$,
            'meta': meta,
        });


      
    }



    CheckList.prototype = { //实例方法
        constructor: CheckList,

        id: '',
        $: null,

        /**
        * 
        */
        render: function (list) {
            var meta = mapper.get(this);
            var tpl = meta.tpl = Template.create(meta);
            var html = tpl.fill(meta);

            meta.$ = this.$ = $(meta.container);
            meta.$.html(html);
            meta.$.addClass(meta.cssClass);
        
            var table = meta.table = Table.create(meta);
            table.render();

            meta.txt = Input.create(meta);
            meta.masker = Masker.create(meta);

            meta.$table = $('#' + meta.tableId);
            meta.$txt = $(meta.txt);

            list && this.fill(list);
        },


        /**
        * 填充下拉列表部分。
        * 已重载 fill(list);
        * 已重载 fill(list, fn);
        * 如果指定了处理函数或过滤，则进处数据的处理转换或过滤。
        */
        fill: function (list, fn) {
            var meta = mapper.get(this);

            list = $Array.map(list, function (item, index) {
                if (!fn) {
                    return item;
                }

                var value = fn.call(meta.this, item, index);

                return value === false ? null :
                    typeof value == 'object' ? value : item;
            });
           
            meta.table.fill(list);
            meta.emitter.fire('fill', [list]);
        },




        


 
        /**
        * 设置指定的属性。
        * 已重载 set(obj); 批量设置的情况。
        * 已重载 set(key, value); 单个设置的情况。
        */
        set: function (key, value) {
            var obj = $Object.isPlain(key) ? key : { [key]: value, };
            var meta = mapper.get(this);

            $Object.each(obj, function (key, value) {
                switch (key) {
                    case 'text':
                        meta.txt.value = value;
                        break;

                    case 'disabled':
                        value = !!value;
                        meta.txt.disabled = meta.disabled = value;
                        break;
                }
            });
        },

        get: function (key) {
            var meta = mapper.get(this);
            var rows = meta.table.get('rows');

            if (!key) {
                var checks = $Array.map(rows, function (row) {
                    var item = row.data;
                    return item.checked ? item : null;
                });

                return checks;
            }


            switch (key) {
                case 'text':
                case 'disabled':
                    return meta[key];

                case 'length':
                    return rows.length;
            }

        },

        /**
        * 重置。
        */
        reset: function () {
            var meta = mapper.get(this);
            var rows = meta.table.get('rows');

            //清空所选项。
            rows.map(function (row) {
                var item = row.data;

                if (!item.checked) {
                    return;
                }

                item.checked = false;
                $(row.element).removeClass('on');
            });

            this.set('text', '');

            meta.emitter.fire('reset');
        },

        /**
        * 给本控件实例绑定事件。
        */
        on: function () {
            var meta = mapper.get(this);
            meta.emitter.on(...arguments);
        },

        /**
        * 销毁本控件实例。
        */
        destroy: function () {
            var meta = mapper.get(this);

            //已销毁。
            if (!meta) {
                return;
            }

            meta.emitter.destroy();
            meta.table.destroy();
            meta.masker.destroy();
            meta.tpl.destroy();


            meta.$ = null;
            meta.txt = null;
            meta.this = null;
            meta.$txt = null;
            meta.$table = null;
            meta.masker = null;


            mapper.delete(this);
        },
    };


    return CheckList;

});

