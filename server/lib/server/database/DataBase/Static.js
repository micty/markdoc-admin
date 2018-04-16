/**
* 
*/
define('DataBase/Static', function (require, module, exports) {
    var $ = require('$');
    var $Date = $.require('Date');
    var $String = $.require('String');
    var Emitter = $.require('Emitter');


    //静态方法。
    return {
        

        /**
        * 对一个列表进行分页。
        * @param {number} pageNo 页码数值，从 1 开始。
        * @param {number} pageSize 页的大小，即每页记录的条数。
        * @param {Array} list 要进行分页的列表数组。
        * @return {object} 返回一个 { list: [], total: 123 } 的数据结构对象。
        */
        page: function (pageNo, pageSize, list) {
            //安全起见。
            pageNo = Number(pageNo);                //页码数值，从 1 开始。
            pageSize = Number(pageSize);            //页的大小，即每页记录的条数。

            var total = list.length;                //总记录数，在不过滤的条件下。
            var begin = (pageNo - 1) * pageSize;    //开始索引。
            var end = begin + pageSize;             //结束索引。

            list = list.slice(begin, end);

            return {
                'list': list,
                'total': total,
            };
        },

        /**
        * 把列表按指定的主键建立起映射，以便可以通过主键一步到位访问。
        */
        map: function (list, key) {
            key = key || 'id';

            var id$item = {};

            list.forEach(function (item) {
                var id = item[key];

                id$item[id] = item;
            });

            return id$item;
        },

        /**
        * 对列表按某个键的值进行分组。
        */
        group: function (list, key, fn) {
            var value$items = {};

            list.forEach(function (item) {
                var value = item[key];
                var items = value$items[value];

                if (!items) {
                    items = value$items[value] = [];
                }

                items.push(item);
            });

            //指定了处理函数。
            if (fn) {
                var all = value$items;

                value$items = {};

                Object.keys(all).forEach(function (value) {
                    var items = all[value];
                    items = fn(value, items);

                    if (items === null) {
                        return;
                    }

                    value$items[value] = items;
                });
            }

            return value$items;
        },

        /**
        * 获取新的随机 id。
        */
        newId: function () {
            var id = $String.random();
            return id;
        },

    };
});





