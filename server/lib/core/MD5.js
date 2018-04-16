

/**
* MD5工具类。
* @namespace
* @name MD5
*/
define('MD5', function (require, module, exports) {

    var crypto = require('crypto');


    return exports = /**@lends MD5*/ {

        /**
        * 计算指定内容的 MD5 值。
        * @param {string} content 要计算的字符串内容。 
            如果传入的不是字符串，则会转成 JSON 字符串再进行计算。
        * @param {number} len 要对计算结果即 MD5 值进行截取的长度。
            当不指定时，则全部返回(32 位)。
        * @return {string} 返回一个 32 位(或指定长度)的 MD5 字符串。
        */
        get: function (content, len) {

            if (typeof content != 'string') {
                content = JSON.stringify(content) || '';
            }

            var md5 = crypto.createHash('md5');
            md5 = md5.update(content).digest('hex');

            if (typeof len == 'number') {
                md5 = md5.slice(0, len);
            }

            md5 = md5.toUpperCase();

            return md5;
        },


        /**
        * 读取指定文件的内容并计算 MD5 值。
        */
        read: function (file, len) {
            var File = require('File');
            var content = File.read(file);
            var md5 = exports.get(content, len);

            return md5;
        },

    };

});
