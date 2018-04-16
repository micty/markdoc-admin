/**
 * 数值型输入框类。
 * https://github.com/BobKnothe/autoNumeric
 */
define('NumberField', function(require, module, exports) {

    var $ = require('$');
    var KISP = require('KISP');
    var $Object = KISP.require('Object');
    var $String = KISP.require('String');
    var Emitter = KISP.require('Emitter');
    var Defaults = require('Defaults');
    var Config = module.require('Config');

    var mapper = new Map();



    /**
     * 构造函数。
     */
    function NumberField(selector, config) {

        // 重载 NumberField( config )
        if ($Object.isPlain(selector)) {
            config = selector;
            selector = config.selector;
            delete config.selector; //删除，避免对原始造成不可知的副作用
        }

        //selector = $(selector).selector;

        config = Defaults.clone(module, config);

        var options = Config.get(config);
        var id = $String.random();
        var emitter = new Emitter(this);

        var meta = {
            'selector': selector,
            'options': options,
            'emitter': emitter,
            'value': '', //值的原始形式。
            'id': id,
            '$': null,
            'disabled': false,
        };

        this.id = id;


        mapper.set(this, meta);

    }



    NumberField.prototype = { //实例方法
        constructor: NumberField,

        id: '',
        $: null,

        render: function() {
            var meta = mapper.get(this);
            var emitter = meta.emitter;
            var self = this;

            meta.$ = this.$ = $(meta.selector);
            meta.$.autoNumeric(meta.options);

            meta.$.on({
                'keyup': function(event) {
                    var value = self.get('value');
                    if (value == meta.value) {
                        return;
                    }

                    meta.value = value;
                    value = Number(value);
                    emitter.fire('keyup', [value, event]);
                },
                'change': function(event) {
                    var value = self.get('value');
                    if (value == meta.value) {
                        return;
                    }

                    meta.value = value;
                    value = Number(value);

                    emitter.fire('change', [value, event]);
                },
            });

        },

        init: function() {
            var meta = mapper.get(this);
            meta.$.autoNumeric('init', ...arguments);
        },



        update: function(options) {
            if (options) { //如果指定了，则需要转成原始控件的格式。
                arguments[0] = Config.get(options);
            }

            var meta = mapper.get(this);
            meta.$.autoNumeric('update', ...arguments);
        },



        set: function(key, value) {
            var meta = mapper.get(this);

            switch (key) {
                case 'value':
                    meta.$.autoNumeric('set', value);
                    meta.value = this.get('value');
                    break;

                case 'disabled':
                    value = !!value;
                    meta.disabled = value;
                    meta.$.attr('disabled', value);
                    break;
            }
        },

        get: function() {
            var meta = mapper.get(this);
            return meta.$.autoNumeric('get', ...arguments);
        },

        getString: function() {
            var meta = mapper.get(this);
            meta.$.autoNumeric('getString', ...arguments);
        },

        getArray: function() {
            var meta = mapper.get(this);
            meta.$.autoNumeric('getArray', ...arguments);
        },

        getSettings: function() {
            var meta = mapper.get(this);
            meta.$.autoNumeric('getSettings', ...arguments);
        },

        empty: function() {
            var meta = mapper.get(this);
            meta.$.val('');
        },

        on: function() {
            var meta = mapper.get(this);
            meta.emitter.on(...arguments);
        },

        destroy: function() {
            var meta = mapper.get(this);

            //已销毁。
            if (!meta) {
                return;
            }

            meta.$.autoNumeric('destroy', ...arguments);

            meta.emitter.destroy();
            mapper.delete(this);
        },
    };



    var input = null;
    var nf = null;
    var defaults = null;


    /**
     * 静态方法。
     */
    return Object.assign(NumberField, {

        create: function(el, options) {
            return new NumberField(el, options);
        },

        update: function(el, options) {
            var nf = new NumberField(el);
            nf.render();
            nf.update(options);
        },

        value: function(txt) {
            var nf = new NumberField(txt);
            nf.render();

            var value = nf.get();
            return Number(value);
        },

        text: function(value, options) {

            defaults = defaults || Defaults.clone(module);

            options = Object.assign(defaults, {
                min: '-9999999999999.99', //允许的最小值，必须用字符串
                currencySign: '', //这个是必须的，否则可能会受 money() 方法的影响。

            }, options);


            if (!input) {
                input = document.createElement('input');
                input.type = 'text';

                nf = new NumberField(input, options);
                nf.render();
            }


            input.value = value;
            nf.update(options);

            return input.value;
        },

        money: function(value, options) {

            options = Object.assign({}, options, {
                currencySign: '¥',
            });

            return NumberField.text(value, options);
        },

    });


});
