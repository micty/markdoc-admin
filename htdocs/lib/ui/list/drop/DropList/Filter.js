
//默认过滤器。

define('DropList/Filter', function (require, module, exports) {
    var KISP = require('KISP');
    var $ = require('$');



    function find(item, keys, keyword) {
        var len = keys.length;

        for (var i = 0; i < len; i++) {
            var key = keys[i];
            var ignoreCase = false; //是否忽略大小写。

            // { name: '', ignoreCase: true }
            if (typeof key == 'object') {
                var opt = key;

                key = opt.name;
                ignoreCase = opt.ignoreCase;
            }


            var value = item[key];

            if (typeof value == 'number') {
                value = String(value);
            }

            //搜索下一个字段值。
            if (typeof value != 'string') {
                continue;
            }
            
            //指定了不区分大小写。
            if (ignoreCase) {
                value = value.toLowerCase();
                keyword = keyword.toLowerCase();
            }

            //已找到。
            if (value.includes(keyword)) {
                return true;
            }
        }

        //如果没找到，必须明确返回 false。
        return false;
    }




    return {
        bind: function (meta) {
            var filters = meta.filters;

            meta.this.on('change', function (keyword) {

                this.fill(meta.list, keyword, function (item, index) {

                    //不需要过滤时，则只高亮关键词。
                    if (!filters) {
                        return true;
                    }

                    return find(item, filters, keyword);

                });

              
            });

        },

    };
});