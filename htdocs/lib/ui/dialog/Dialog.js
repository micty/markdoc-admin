
define('Dialog', function (require, module, exports) {
    var KISP = require('KISP');
    var $ = require('$');
    var Defaults = require('Defaults');

    var $String = KISP.require('String');
    var Emitter = KISP.require('Emitter');
    var Mask = KISP.require('Mask');

    var Meta = module.require('Meta');
    var Template = module.require('Template');
    var Drager = module.require('Drager');
    var Resizer = module.require('Resizer');
    var Style = module.require('Style');
    var Events = module.require('Events');

    var mapper = new Map();




    function Dialog(config) {

        config = Defaults.clone(module, config);

        var emitter = new Emitter(this);

        var meta = Meta.create(config, {
            'this': this,
            'emitter': emitter,
        });

        mapper.set(this, meta);

        this.id = meta.id;
        this.$ = meta.$;

    }




    Dialog.prototype = {
        constructor: Dialog,

        id: '',
        $: null,

        render: function (options) {
            options = options || {};

            var meta = mapper.get(this);
            var emitter = meta.emitter;

            if (meta.rendered) { //已渲染过。
                this.set(options);
                this.show();
                emitter.fire('render', [options]);
                return;
            }

            //首次渲染。
            var title = meta.title = options.title || meta.title;
            var content = meta.content = options.content || meta.content;
            var footer = meta.footer = options.footer || meta.footer;
            var style = Style.get(meta);
            var headerId = meta.headerId;

            var html = Template.fill({
                'id': meta.id,
                'headerId': headerId,
                'contentId': meta.contentId,
                'footerId': meta.footerId,
                'sizerId': meta.sizerId,
                'cssClass': meta.cssClass,
                'resizable': meta.resizable,
                'attributes': meta.attributes,
                'style': style,
                'title': title,
                'content': content,
                'footer': footer,
            });

            $(document.body).prepend(html);
            meta.rendered = true;           //更改状态。

            this.$ = meta.$ = $('#' + meta.id);  //
            meta.$.toggleClass('auto-size', !meta.width || !meta.height);
            

            if (meta.mask) {
                meta.masker = new Mask({
                    'z-index': meta['z-index'] - 1,
                });
            }

            if (meta.dragable) {
                Drager.set(headerId, meta);
            }

            if (meta.resizable) {
                Resizer.set(meta.id, meta);
            }

            Events.bind(meta);
            this.show();

            emitter.fire('first-render', [options]);
            emitter.fire('render', [options]);
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
                var mask = Mask.normalize(meta.mask);
                masker.show(mask);
            }

            meta.$.show();
            meta.visible = true;
            meta.emitter.fire('show');

        },

        /**
        * 关闭本组件(仅隐藏)。
        */
        close: function (sure) {
            var meta = mapper.get(this);

            //尚未渲染或已是隐藏状态。
            if (!meta.rendered || !meta.visible) {
                return;
            }

            var emitter = meta.emitter;

            if (!sure) {
                var values = emitter.fire('before-close');
                sure = values.slice(-1)[0];
                if (sure === false) { //只有在事件中明确返回 false 才取消关闭。
                    return;
                }
            }
            

            var masker = meta.masker;

            masker && masker.hide();
            meta.$.hide();
            meta.visible = false;
            emitter.fire('close');
        },




        set: function (key, value) {
            var data = typeof key == 'object' ? key : { [key]: value, };
            var meta = mapper.get(this);

            var key$tpl = {
                title: 'header',
                content: 'content',
                footer: 'footer',
            };


            for (key in data) {
                var tpl = key$tpl[key];
                
                if (tpl) {
                    var html = Template.fill(tpl, data);
                    var sid = meta[tpl + 'Id']; //headerId、contentId、footerId。

                    $('#' + sid).html(html);

                    continue;
                }


                value = data[key];

                switch (key) {
                    case 'width':
                    case 'height':
                        meta.$.css(key, value);
                        break;
                }
            }

        },


        on: function (name, fn) {
            var meta = mapper.get(this);
            var emitter = meta.emitter;
            var args = Array.from(arguments);
            emitter.on(args);
        },

        destroy: function () {
            var meta = mapper.get(this);

            //已销毁。
            if (!meta) {
                return;
            }

            meta.emitter.destroy();
            meta.masker.destroy();
            meta.$.off();

            var div = meta.$.get(0);
            div.parentNode.removeChild(div);

            Drager.remove(meta.headerId);
            Resizer.remove(meta.id);
        },
    };


    //静态方法。
    Object.assign(Dialog, {

        /**
        * 根据创建好的 panel 对应去填充对话框中相应的区域，同时会保留原 panel 中原有的逻辑和事件等。
        * 以使用户可以以熟悉的模块化方式去操纵对话框中的内容， 如模板填充、事件绑定等。
        */
        panel: function (options) {
            var Content = options.content;
            var Container = options.container;
            var Footer = options.footer; //可能是一个数组或 DOM 节点。

            var content = Content.$.get(0);
            var container = Container.$.get(0);
            var footer = Footer && !Array.isArray(Footer) ? Footer.$.get(0) : null; //DOM 节点。

            var attributes = {};

             Array.from(container.attributes).map(function (item) {
                var name = item.name;
                if (name == 'class') {
                    return;
                }

                attributes[name] = item.value;
            });


            var config = Object.assign({}, options, {
                'content': content.outerHTML,
                'cssClass': container.className,
                'attributes': attributes,
            });

            config['footer'] = footer ? footer.outerHTML : Footer;

           

            var dialog = new Dialog(config);

            dialog.on({
                'first-render': function () {
                    //删除 panel 中对应原先的 DOM 节点，
                    //在 KISP 内部会让相应的 panel 重新绑定到新的 DOM 节点。
                    container.parentNode.removeChild(container);
                    content.parentNode.removeChild(content);

                    footer && footer.parentNode.removeChild(footer);
                },
            });

            return dialog;

        },
    });



    return Dialog;
});