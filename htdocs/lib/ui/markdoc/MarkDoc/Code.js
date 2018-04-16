
/**
* 
*/
define('MarkDoc/Code', function (require, module, exports) {

    var $ = require('$');
    var KISP = require('KISP');
    var $String = KISP.require('String');
    var JSON = KISP.require('JSON');


    return {


        /**
        * 迭代指定 DOM 元素中的每个代码块。
        */
        each: function (el, fn) {
            $(el).find('code[data-language]').each(function (index) {
                var element = this;
                var content = element.innerText;
                var language = element.getAttribute('data-language');

                var item = {
                    'element': element,
                    'content': content,
                    'language': language,
                };

                fn(item, index);
            });
        },

        


        /**
        * 对代码区域进行格式化。
        */
        format: function (el) {
            var language = el.getAttribute('data-language');
     

            //尝试把 json 格式化一下
            if (language == 'json') {
                var text = el.innerText;
                var json = JSON.parse(text);

                if (json) {
                    json = window.JSON.stringify(json, null, 4);
                    el.innerHTML = json;
                }
            }

        },

        /**
        * 
        */
        language: function (meta, language) {
            var html = $String.format(meta.samples['language'], {
                'language': language,
                'foldable': meta.code.foldable ? 'foldable' : '',
            });

            return html
        },
        
        /**
        * 把整个代码区域和一些附加的 html 内容包裹起来。
        *   options = {
        *       element: DOM,   // `code` DOM 元素。
        *       language: '',   //语言标签的 html，或者为空串。
        *       numbers: '',    //行号的 html，或者为空串。
        *       height: '',     //高度。
        *   };
        */
        wrap: function (meta, options) {
            var $pre = $(options.element.parentNode);
            var html = options.language + options.numbers;

            $pre.wrap(meta.samples['source']);
            $pre.before(html);
            $pre.height(options.height); //设置高度，以撑开高度

            //根据最大的行号的数字串的长度设置 ul 的宽度和 pre 的 margin-left。
            var $ul = $pre.parent().find('>ul');
            var length = $ul.find('>li').length.toString().length; //最大的行号的数字串的长度
            var width = length * 10 + 15;

            $ul.css('width', width);
            $pre.css('margin-left', width);
          
        },
    };
    
});


