
/**
* 
*/
define('MarkDoc/Content', function (require, module, exports) {

    var $ = require('$');
    var KISP = require('KISP');
    var $String = KISP.require('String');

    var marked = window.marked;


    return {

        /**
        * 获取内容。
        *   options = {
        *       language: '',   //可选。 语言类型。 如果要使用源代码模式显示内容，则需要指定该字段。
        *       content: '',    //必选。 要填充的内容。
        *       process: function(content){ },
        *   };
        */
        get: function (meta, options) {
            var language = options.language;
            var content = options.content;
            var process = options.process;

            //html源文件要特殊处理。
            if (language == 'html' || language == 'htm') {
                language = '';

                content = [
                    '``` html',
                        content,
                    '```',
                ].join('\r\n');
            }


            if (language) {
                content = $String.format(meta.samples['pre'], {
                    'language': language,
                    'content': content,
                });

            }
            else {
                content = marked(content);

                if (process) {
                    content = process(content);
                }
            }

            return content;
        },


        
    };
    
});


