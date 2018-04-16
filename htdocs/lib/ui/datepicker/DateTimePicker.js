
/**
* 日期时间选择器类。
*/
define('DateTimePicker', function (require, module, exports) {

    var $ = require('$');
    var KISP = require('KISP');
    var $Object = KISP.require('Object');
    var Emitter = KISP.require('Emitter');
    var $String = KISP.require('String');
    var Defaults = require('Defaults');

    var mapper = new Map();


    //调用原始控件的方法
    function invoke(self, name, $argumetns) {
        var args = Array.from($argumetns);
        var meta = mapper.get(self);
        var $this = meta.$;

        args = [name].concat(args);

        return $this.datetimepicker.apply($this, args);
    }



    /**
    * 构造函数。
    */
    function DateTimePicker(selector, config) {

        // 重载 NumberField( config )
        if ($Object.isPlain(selector)) {
            config = selector;
            selector = config.selector;
            delete config.selector;     //删除，避免对原始造成不可知的副作用
        }


        config = Defaults.clone(module, config);

        var options = Object.assign({}, config);
        var emitter = new Emitter(this);
        var id = $String.random();

        var meta = {
            'id': id,
            '$': null,
            'txt': null,
            'emitter': emitter,
            'selector': selector,
            'options': options,
            'disabled': false,
            'this': this,
        };

        mapper.set(this, meta);

    }



    DateTimePicker.prototype = { //实例方法
        constructor: DateTimePicker,

        id: '',
        $: null,

        render: function (options) {
            var meta = mapper.get(this);
            var emitter = meta.emitter;
            var self = this;

            meta.$ = this.$ = $(meta.selector);
            meta.txt = meta.$.get(0);

            meta.$.datetimepicker(meta.options);

            meta.$.on({
                'focus': function () {
                    this.select();
                },
                'change': function () {
                    var value = this.value;
                    meta.value = value;
                    console.log(value);

                    emitter.fire('change', [value]);
                },
                'click': function () {
                    meta.this.show();
                },
            });

            if (options) {
                var value = options.value;
                value && meta.$.val(value);
            }

        },

        on: function (name, fn) {
            var meta = mapper.get(this);
            meta.emitter.on(...arguments);
        },

        remove: function () {
            invoke(this, 'remove', arguments);
        },

        show: function () {
            invoke(this, 'show', arguments);
        },

        hide: function () {
            invoke(this, 'hide', arguments);
        },

        update: function () {
            invoke(this, 'update', arguments);
        },

        setStartDate: function () {
            invoke(this, 'setStartDate', arguments);
        },

        setEndDate: function () {
            invoke(this, 'setEndDate', arguments);
        },

        setDaysOfWeekDisabled: function () {
            invoke(this, 'setDaysOfWeekDisabled', arguments);
        },

        destroy: function () {
            var meta = mapper.get(this);

            //已销毁。
            if (!meta) {
                return;
            }

            meta.emitter.destroy();
            meta.$.off();
           

            mapper.delete(this);

        },

        set: function (key, value) {
            var meta = mapper.get(this);
            var txt = meta.txt;

            switch (key) {
                case 'disabled':
                    value = !!value;
                    meta.disabled = value;
                    txt.disabled = value;
                    break;
                case 'value':
                    meta.$.val(value);
                    break;
            }

        },

        get: function (key) {
            var meta = mapper.get(this);

            switch (key) {
                case 'disabled':
                    return meta[key];
            }

        },
    };



    return DateTimePicker;



});

