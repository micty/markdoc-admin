

define('/FileList/Tree/Main/Data', function (require, module, exports) {

    var KISP = require('KISP');
    var $String = KISP.require('String');
    var $Object = KISP.require('Object');


    
    /**
    * 根据给定的目录名，递归搜索子目录和文件列表，组装成符合菜单树的数据结构。
    *   dir: '',            //要组装的目录名称。
    *   options = {
    *       dir$files: {},  //某个目录对应的文件列表（仅当前层级，不包括子目录的）。
    *       dir$dirs: {},   //某个目录对应的子目录列表（仅当前层级，不包括子目录的）。
    *   };
    */
    function make(options, dir) {
        var dir$files = options.dir$files;
        var dir$dirs = options.dir$dirs;

        var dirs = dir$dirs[dir];

        var list = dirs.map(function (item) {
            var sdir = dir ? dir + '/' + item : item;
            var list = make(options, sdir); //递归。
            var files = dir$files[sdir];

            files = files.map(function (file) {
                var name = sdir + '/' + file; //完整名称。

                return {
                    'name': file,
                    'id': name,
                    'data': {
                        'type': 'file',
                        'name': name,       
                        'parent': sdir,
                    },
                };
            });

            list = [...list, ...files];

            //为了让空目录能以文件夹的图标展示（组件设计如此），需要增加一个虚拟的指示文件。
            //同时在父模块里转发它的点击到该虚拟文件的父目录中。
            if (!list.length) {
                list.push({
                    'name': '(空目录)',
                    'id': sdir + '/', 
                    'data': {
                        'type': 'file',
                        'name': '',
                        'parent': sdir,
                    },
                });
            }


            return {
                'name': item,
                'id': sdir,
                'data': {
                    'type': 'dir',
                    'name': sdir,   //完整名称。
                    'parent': dir,  //
                },
                'list': list,
            };
        });



        return list;
    }

    return {
        /**
        * 把 JSON 数据转成树节点列表，用于展示成菜单树。
        */
        toTree: function (options) {
            var root = '';
            var list = make(options, root);

            //加上根目录的文件列表。
            var files = options.dir$files[root];

            files = files.map(function (file) {

                return {
                    'name': file,
                    'id': file,
                    'data': {
                        'type': 'file',
                        'name': file,
                        'parent': root,
                    },
                };
            });

            list = [...list, ...files];

            //如 options.root = '../../markdoc/htdocs/data'; 则 name = 'data';
            var name = options.root.split('/').slice(-1)[0]; //取最后一个目录名。 暂时没用到。

            return [
                {
                    'name': '$',
                    'id': 'root',
                    'open': true,
                    'foldable': false,
                    'data': {
                        'type': 'dir',
                        'name': '',
                    },
                    'list': list,
                },
            ];
        },

     
    };


});