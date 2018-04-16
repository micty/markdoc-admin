
/**
* 
*/
define('MarkDoc/Image', function (require, module, exports) {
    var $ = require('$');
    var KISP = require('KISP');
    var $String = KISP.require('String');



    return {



        


        /**
        * 对非完整地址的图片进行地址补充。
        */
        format: function (el, url) {
            
            //不需要补充。
            if (!url) {
                return;
            }


            $(el).find('img').each(function () {
                var img = this;
                var src = img.getAttribute('src'); //要用这个方法，获取原始的值。 img.src 会返回完整的，不合要求。

                if (!src || src.startsWith('http://') || src.startsWith('https://')) {
                    return;
                }

                img.src = url + src;
            });

        },

    };
    
});


