
/**
* 
*/
define('MarkDoc/Meta', function (require, module, exports) {

    var $ = require('$');
    var $String = KISP.require('String');
    var Template = KISP.require('Template');

    var defaults = {
        code: {
            format: true,   //是否自动格式化（针对 JSON）。
            language: true, //是否显示语言类型标签。
            numbers: true,  //是否显示行号。
            foldable: true, //是否允许通过点击语言类型标签来切换折叠和展开代码区。
        },
        titles: {
            selector: 'h1,h2,h3,h4,h5,h6',
            foldable: true,                 //允许折叠。
        },
    };


    return {

        create: function (config, others) {
            var tpl = new Template('#tpl-MarkDoc');
            var code = Object.assign({}, defaults.code, config.code);
            var titles = Object.assign({}, defaults.titles, config.titles);
            var container = config.container;

            var meta = {
                'id': $String.random(),         //实例 id。
                'container': container,         //
                'code': {
                    'format': code.format,          //是否自动格式化。
                    'language': code.language,      //是否显示语言类型。
                    'numbers': code.numbers,        //是否显示行号。
                    'foldable': code.foldable,      //
                },

                'this': null,                   //方便内部引用自身的实例。
                'emitter': null,                //事件驱动器。
                '$': $(container),              //$(container);
                'tpl': tpl,                     //Template 实例。
                'bind': false,                  //是否已对 meta.$ 进行绑定事件。

                'outline': {
                    'visible': true,            //用于记录提纲的内容的显示或隐藏状态。
                },

                'current': {

                },

                'titles': {
                    'selector': titles.selector,
                    'foldable': titles.foldable,
                },

                'samples': {
                    'source': tpl.sample('source'),
                    'language': tpl.sample('language'),
                    'pre': tpl.sample('pre'),
                    'numbers': tpl.sample('numbers'),
                    'numbers.item': tpl.sample('numbers', 'item'),
                    'title': tpl.sample('title'),
                },

               
            };


            Object.assign(meta, others);
           

            return meta;
           
        },

    };
    
});


