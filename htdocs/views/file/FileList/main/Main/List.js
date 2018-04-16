

define('/FileList/Main/List', function (require, module, exports) {
    var KISP = require('KISP');
    var $Date = KISP.require('Date');

    var images = [
        '.png',
        '.jpg',
        '.jpeg',
        '.gif',
        '.bmp',
    ];



    return {
        /**
        * 从列表数据中过滤出类型下拉列表。
        */
        getTypes: function (list) {
            var hasDir = false;
            var hasImage = false;
            var hasFile = false;
            var exts = new Set();

            list.forEach(function (item, index) {
                var type = item.type;

                if (type == 'dir') {
                    hasDir = true;
                    return;
                }

                //安全起见。 
                if (type != 'file') {
                    return;
                }

                //type == 'file';
                hasFile = true;

                var ext = item.ext.toLowerCase();
                exts.add(ext);

                if (images.includes(ext)) {
                    hasImage = true;
                }

            });



            //后缀名的用数组。
            var items = [{ id: '0', name: '全部', value: '', }];


            hasDir && items.push({ id: '1', name: '目录', value: 'dir', });
            hasFile && items.push({ id: '3', name: '文件', value: 'file', });
            hasImage && items.push({ id: '2', name: '图片', value: images, });


            [...exts].forEach(function (ext, index) {
                var id = index + 4 + '';
                var name = ext.slice(1) + ' 文件';

                items.push({ 'id': id, 'name': name, 'value': [ext, ], });

            });


            return items;
        },

        /**
        * 从列表数据中过滤出指定条件的子集。
        */
        filter: function (list, filter) {
            if (!filter) {
                return list;
            }

            var type = filter.type;
            var beginDate = filter.beginDate;
            var endDate = filter.endDate;
            var name = filter.name || '';
            var dir = filter.dir; // dir 可能为 '' 或 false，两者意义不同。

            //可以排除掉 undefined、''、[] 等。
            if (type && type.length > 0) {
                if (typeof type == 'string') { //如 'dir'、'file'。
                    list = list.filter(function (item) {
                        return item.type == type;
                    });
                }
                else if (Array.isArray(type)) { //此时为后缀名的数组。
                    list = list.filter(function (item) {
                        if (item.type != 'file') { //目录的不用参与。
                            return false;
                        }

                        var ext = item.ext.toLowerCase();
                        return type.includes(ext);
                    });
                }
            }

            if (name) {
                list = list.filter(function (item) {
                    return item.name.includes(name);
                });
            }


            if (beginDate) {
                beginDate = $Date.parse(beginDate);
           
                list = list.filter(function (item) {
                    return beginDate <= item.stat.birthtimeMs;
                });
            }
            
            if (endDate) {
                endDate = $Date.parse(endDate);

                list = list.filter(function (item) {
                    return endDate >= item.stat.birthtimeMs;
                });
            }

            //注意，根目录的 id 为空字符串。
            if (typeof dir == 'string') {

                list = list.filter(function (item) {
                    var name = item.name;

                    //根目录的。
                    if (!dir) {
                        return !name.includes('/');
                    }

                    //其它目录的。
                    var suffix = item.name.slice(dir.length + 1);
                    return !suffix.includes('/');

                });
            }



            return list;



        },

    };

});
