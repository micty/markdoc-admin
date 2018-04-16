
/**
* 
*/
define('Path', function (require, module, exports) {
    var $ = require('$');
    var KISP = require('KISP');
    var $String = KISP.require('String');
    var Url = KISP.require('Url');

    var resolveUrl = require('resolveUrl');

    //网站的根目录。 如 `http://172.20.58.63/Studio/markdoc-admin/htdocs/`
    var root = Url.root(); 


    


    return {
        /**
        * 根据基准目录获取指定文件的实际路径。
        *   base: '',   //基准目录。 如 `house/permit/sidebar.json`，则有效部分为 `house/permit/`。
        *   file: '',   //要获取的文件。 如 `../docs/sale/test.md`。
        *   则计算后的结果为 `house/permit/sale/test.md`。
        */
        join: function (base, file) {
            if (!file) {
                return '';
            }

            var url = resolveUrl(...arguments);

            //解析后的 url 超出了网站根目录。
            if (!url.startsWith(root)) {
                return arguments[arguments.length - 1]; //原样返回最后一个。
            }

            //去掉根目录前缀部分。
            url = url.slice(root.length);

            return url;
        },
    };

});