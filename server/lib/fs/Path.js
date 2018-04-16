
/**
* 路径解析器。
*/
define('Path', function (require, module, exports) {
    var path = require('path');
    var $ = require('$');
    var $Array = $.require('Array');


    






    return exports = {

        /**
        * 进行标准化处理，以得到格式统一的路径。
        */
        normalize: function (file) {
            var isUrl = file.startsWith('http://') ||
                file.startsWith('https://') ||
                file.startsWith('//');                  //这个也是绝对地址。

     
            //以 http:// 等开头的 url，不要处理。
            if (!isUrl) {
                file = file.replace(/\\/g, '/');    //把 '\' 换成 '/'
                file = file.replace(/\/+/g, '/');   //把多个 '/' 合成一个
            }

            file = file.split('#')[0]; //去掉带 hash 部分的。
            file = file.split('?')[0]; //去掉带 query 部分的。

            return file;

        },

        /**
        * 合并多个路径，并格式化成标准形式，即以 `/` 作为目录的分隔符。
        */
        join: function join(file0, fileN) {
            var file = path.join(...arguments);
            file = exports.normalize(file);

            return file;
        },

        /**
        * 获取指定路径的所在目录。
        */
        dir: function (file) {
            var dir = path.dirname(file) + '/';
            dir = exports.normalize(dir);
            return dir;

        },

        /**
        * 获取指定路径的后缀名，包括 `.`，如 `.js`。
        */
        ext: function (file) {
            return path.extname(...arguments);
        },

        /**
        * 获取指定路径的基本名称。
        */
        base: function (file, ext) {
            ext = ext || path.extname(file);

            var name = path.basename(file, ext);
            return name;
        },

        /**
        * 获取相对路径。
        */
        relative: function (file0, fileN) {
            var file = path.relative(...arguments);
            file = exports.normalize(file);

            return file;
        },

        /**
        * 判断给定的路径是否为 `.json` 文件。
        */
        isJSON: function (file) {
            var ext = exports.ext(file);

            return ext.toLowerCase() == '.json';
        },
    };

});
