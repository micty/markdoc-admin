
define('ImageViewer', function (require, module, exports) {
    var KISP = require('KISP');
    var $ = require('$');
    var Defaults = require('Defaults');

    var $String = KISP.require('String');
    var Emitter = KISP.require('Emitter');
    var Mask = KISP.require('Mask');

    var Template = module.require('Template');
    var Events = module.require('Events');
    var Drager = module.require('Drager');
    var Size = module.require('Size');

    var mapper = new Map();


    function ImageViewer(config) {

        config = Defaults.clone(module, config);

        var emitter = new Emitter(this);
        var id = 'ImageViewer-' + $String.random(4);

        var meta = {
            'src': config.src,
            'cssClass': config.cssClass || '',
            'style': config.style || '',
            'width': config.width,
            'height': config.height,
            'alt': config.alt || '',
            'z-index': config['z-index'] || 1026,
            'volatile': typeof config.volatile == 'boolean' ? config.volatile : true,   //易消失

            'mask': true,
            'emitter': emitter,
            'masker': null,

            'id': id,

            'isClick': true,    //区别点击和拖动事件，否则在设置易消失后拖动图片也会使该组件隐藏
            'rendered': false,  //是否已渲染过了。
            'visible': false,   //记录当前组件是否已显示
            '$': null,          //$(this)，内部使用的一个 jQuery 对象。
            'this': this,
            '$img': null,
        };

        mapper.set(this, meta);

        this.id = id;
        this.$ = meta.$;
        this.$img = meta.$img;
    }


    ImageViewer.prototype = {
        constructor: ImageViewer,

        id: '',
        $: null,
        $img: null,

        render: function (options) {
            if (!options.src) {
                return
            }
            var self = this;

            var img = new Image();
            img.src = options.src;
            Events.set(0, 0);//每次创建新实例后初始化图片宽高

            img.addEventListener('load', function () {

                var size = Size.get(this);
                var width = size.width;
                var height = size.height;

                options = options || {};

                var meta = mapper.get(self);

                var emitter = meta.emitter;

                if (meta.rendered) { //已渲染过。
                    self.set(options);
                    self.show();
                    emitter.fire('render', [options]);
                    return;
                }

                //首次渲染。

                Object.assign(meta, {
                    'src': options.src || meta.src,
                    'width': options.width || width,
                    'height': options.height || height,
                    'cssClass': options.cssClass || meta.cssClass,
                    'style': options.style || meta.style,
                    'z-index': options['z-index'] || meta['z-index'],
                    'volatile': typeof options.volatile == 'boolean' ? options.volatile : true,
                });


                var html = Template.fill({
                    'id': meta.id,
                    'src': meta.src,
                    'cssClass': meta.cssClass,
                    'style': meta.style,
                    'width': meta.width,
                    'height': meta.height,
                    'alt': meta.alt,
                    'z-index': meta['z-index'],
                });

                $(document.body).prepend(html);
                meta.rendered = true;           //更改状态。

                self.$ = meta.$ = $('#' + meta.id);
                self.$img = meta.$img = $('#' + meta.id + '-img');

                self.$img.css({
                    'margin-left': (window.innerWidth - parseFloat(self.$img.css('width'))) / 2,
                    'margin-top': (window.innerHeight - parseFloat(self.$img.css('height'))) / 2,
                });


                if (meta.mask) {
                    meta.masker = new Mask({
                        'z-index': meta['z-index'] - 1,
                    });
                }
                Drager.set(meta.id, meta);

                Events.bind(meta);
                self.show();

                emitter.fire('first-render', [options]);
                emitter.fire('render', [options]);

            });


        },

        /**
        * 显示本组件。
        */
        show: function () {
            var meta = mapper.get(this);

            //尚未渲染或已是可见状态。
            if (!meta.rendered || meta.visible) {
                return;
            }

            var masker = meta.masker;
            if (masker) {
                var mask = Mask.filter(meta.mask);
                masker.show(mask);
            }

            meta.$.show();
            meta.visible = true;
            meta.emitter.fire('show');

        },

        /**
        * 关闭本组件(仅隐藏)。
        */
        close: function () {
            var meta = mapper.get(this);

            //尚未渲染或已是隐藏状态。
            if (!meta.rendered || !meta.visible) {
                return;
            }

            var emitter = meta.emitter;

            var masker = meta.masker;

            masker && masker.hide();
            meta.$.hide();
            meta.visible = false;
            emitter.fire('close');
        },

        set: function (options) {
            var meta = mapper.get(this);
            meta.$img.hide();
            var img = new Image();
            img.src = options.src;

            img.addEventListener('load', function () {

                var size = Size.get(this);
                var width = size.width;
                var height = size.height;

                meta.$img.css({
                    'margin-left': (window.innerWidth - width) / 2,
                    'margin-top': (window.innerHeight - height) / 2,
                });

                for (var key in options) {
                    switch (key) {
                        case 'src':
                            meta.src = options[key];
                            meta.$img.attr('src', options[key]).css({
                                width: width,
                                height: height,
                            });
                            meta.$img.show();
                            break;
                        case 'width':
                            meta.width = options[key];
                            meta.$img.css('width', options[key]);
                            break;
                        case 'height':
                            meta.height = options[key];
                            meta.$img.css('height', options[key]);
                            break;
                        case 'alt':
                            meta.alt = options[key];
                            meta.$img.attr('alt', options[key]);
                            break;
                        case 'cssClass':
                            meta.cssClass = options[key];
                            meta.$img.attr('class', options[key]);
                            break;
                        case 'style':
                            meta.style = options[key];
                            var width = meta.$img.css('width');
                            var height = meta.$img.css('height');
                            var style = 'width:' + width + ';height:' + height + ';' + options[key];
                            meta.$img.attr('style', style);
                            break;
                        case 'z-index':
                            meta['z-index'] = options[key] || meta['z-index'];
                            pic.css('z-index', meta['z-index']);
                            break
                        case 'volatile':
                            if (typeof options[key] == 'boolean') {
                                meta.volatile = options[key]
                            }
                            else {
                                meta.volatile = true;
                            }
                            break;
                    }
                }
                //Events.bind(meta);
                Events.set(width, height);
            });


        },


        on: function (name, fn) {
            var meta = mapper.get(this);
            var emitter = meta.emitter;
            var args = Array.from(arguments);
            emitter.on(args);
        },

        destroy: function () {
            var meta = mapper.get(this);
            meta.emitter.destroy();
            mapper.delete(this);
            Drager.remove(meta.id);
        },
    }


    return ImageViewer;
});