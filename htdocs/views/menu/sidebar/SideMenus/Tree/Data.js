

define('/SideMenus/Tree/Data', function (require, module, exports) {

    var KISP = require('KISP');
    var $String = KISP.require('String');
    var Path = require('Path');




    return {
        /**
        * 把 JSON 数据转成树节点列表，用于展示成菜单树。
        * 与 toJSON() 是一个相反操作。
        *   options = {
        *       list: [],   //菜单列表。
        *       file: '',   //基准文件，以它所在的目录作为菜单项的基准目录。
        *   };
        */
        toTree: function (options) {
            var list = options.list;
            var baseFile = options.file;    //如 `house/permit/sidebar.json`。


            var groups = list.map(function (group) {
                var base = group.base || '';
                var ext = group.ext || '';
                var name = group.name || '';

                //二级菜单。
                var list = group.items || [];

                list = list.map(function (item) {
                    var file = item.file;
                    var path = base + file + ext;
                    var url = Path.join(baseFile, path);


                    return {
                        'id': item.id || $String.random(),
                        'name': item.name,
                        'icons': [],
                        'data': {
                            'name': item.name,
                            'file': file,
                            'path': path,
                            'url': url,
                            'base': baseFile,
                            'icon': item.icon,
                        },
                    };
                });

                //一级菜单。
                var item = {
                    'id': group.id || $String.random(),
                    'name': name,
                    'open': true,
                    'foldable': true,
                    'list': list,
                    'icons': [],
                    'data': {
                        'name': name,
                        'fold': group.fold || false,
                        'base': base,
                        'ext': ext,
                        'icon': group.icon,
                    },
                };

                return item;
            });

            //根节点，只有一项。
            var root = {
                id: 'root',
                name: '$',
                list: groups,
                icons: [],
                open: true,
                foldable: false,    //是否允许折叠，即是否允许点击后收起（关闭）。
                data: {

                },
            };

            return [root];
        },

        /**
        * 从菜单树的树节点列表中提取出 JSON 数据。 
        * 与 toTree() 是一个相反操作。
        */
        toJSON: function (list) {
            var root = list[0];

            var groups = root.list.map(function (item) {
                var data = item.data;
                var list = item.list || [];

                //一级菜单。
                var group = {
                    'name': data.name,
                    'fold': data.fold,
                    'base': data.base,
                    'ext': data.ext,
                    'icon': data.icon,
                    'items': [],
                };

                if (list.length) {

                    //二级菜单。
                    group.items = list.map(function (item) {
                        var data = item.data;

                        //二级菜单只需要这两个字段。
                        return {
                            'name': data.name,
                            'file': data.file,
                            'icon': data.icon,
                        };

                    });
                }

                return group;

            });

            return groups;
        },
    };


});