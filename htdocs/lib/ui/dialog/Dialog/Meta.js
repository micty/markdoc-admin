
define('Dialog/Meta', function (require, module, exports) {
    var KISP = require('KISP');
    var $ = require('$');
    var $String = KISP.require('String');






    return {
        create: function (config, others) {
            var id = 'Dialog-' + $String.random(4);
            var footer = config.footer;

            if (Array.isArray(footer)) {
                footer = {
                    'content': '',
                    'buttons': footer,
                };
            }
            else if (typeof footer == 'string') {
                footer = {
                    'content': footer,
                    'buttons': [],
                };
            }
            else {
                footer = footer || {};
            }


            var meta = {
                'dragable': config.dragable,
                'resizable': config.resizable,
                'cssClass': config.cssClass,
                'autoClose': config.autoClose,  //点击任何一个按钮后是否自动关闭组件
                'mask': config.mask,
                'z-index': config['z-index'],    //生成透明层时要用到
                'width': config.width,
                'height': config.height,
                'container': config.container,
                'title': config.title,
                'content': config.content,
                'footer': footer,
                'maxWidth': config.maxWidth,
                'minWidth': config.minWidth,
                'maxHeight': config.maxHeight,
                'minHeight': config.minHeight,
                'attributes': config.attributes,
                'masker': null,

                'id': id,
                'headerId': id + '-header',
                'contentId': id + '-content',
                'footerId': id + '-footer',
                'sizerId': id + '-sizer',

                'rendered': false,  //是否已渲染过了。
                'visible': false,   //记录当前组件是否已显示
                '$': null,          //$(this)，内部使用的一个 jQuery 对象。
                'this': this,
            };


            Object.assign(meta, others);


            return meta;


        },
    };
});