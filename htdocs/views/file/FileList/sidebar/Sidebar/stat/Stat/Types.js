

define('/FileList/Sidebar/Stat/Types', function (require, module, exports) {
    var KISP = require('KISP');
    var File = require('File');

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
        get: function (list) {
            if (!list) {
                return [];
            }

            
            var type$count = {
                'dir': 0,
                'file': 0,
                'image': 0,
                'size': 0,
            };

            var ext$count = {};


            list.forEach(function (item, index) {
                var type = item.type;

                type$count[type]++;

                if (type == 'dir') {
                    return;
                }


                var ext = item.ext.toLowerCase();
               
                ext$count[ext] = (ext$count[ext] || 0) + 1;


                if (images.includes(ext)) {
                    type$count['image']++;
                }

                type$count['size'] += item.stat.size;

            });




            var items = [{ 'name': '全部', 'value': list.length, desc: '个', class: 'spliter', }];

            var size = type$count['size'];

            if (size) {
                size = File.getSizeDesc(size);
                items.push({ 'name': '大小', 'value': size.value, 'desc': size.desc, class: 'dir-size', });
            }

            type$count['dir'] && items.push({ 'name': '目录', 'value': type$count['dir'], desc: '个', });
            type$count['file'] && items.push({ 'name': '文件', 'value': type$count['file'], desc: '个', });
            type$count['image'] && items.push({ 'name': '图片', 'value': type$count['image'], desc: '个', });



            Object.keys(ext$count).forEach(function (ext, index) {
                var count = ext$count[ext];
                var name = ext.slice(1) + ' 文件';

                var cssClass = index == 0 ? 'spliter' : '';
                items.push({ 'name': name, 'value': count, desc: '个', class: cssClass, });

            });

            


            return items;
        },

        

    };

});
