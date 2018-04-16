
var launch = require('./launch.js');


launch(function (require, module, exports) {
    var $ = require('$');
    var Directory = require('Directory');
    var File = require('File');
    var fs = require('fs');
    var Path = require('Path');

    var root = 'E:/Studio/markdoc/htdocs/data/';
    var dir$files = {};
    var dir$dirs = {};

    Directory.each(root, function (dir, files, dirs) {
        files = files.map(function (file) {
            file = Path.relative(dir, file);
            return file;
        });

        dirs = dirs.map(function (sdir) {
            sdir = Path.relative(dir, sdir);
            return sdir;
        });


        dir = Path.relative(root, dir);

        //console.log(dir.yellow);
        //console.log(files);

        dir$files[dir] = files;
        dir$dirs[dir] = dirs;

    });

    File.writeJSON('./data/dir$files.json', dir$files);
    File.writeJSON('./data/dir$dirs.json', dir$dirs);

    //var files = Directory.getFiles(dir);
    //console.log(files);



    function make(dir) {
        var dirs = dir$dirs[dir];

        if (!dirs) {
            console.log(dir.red)
            return;
        }

        var list = dirs.map(function (item) {
            var sdir = dir ? dir + '/' + item : item;
            var list = make(sdir);
            var files = dir$files[sdir];

            files = files.map(function (file) {
                var name = sdir + '/' + file; //完整名称。

                return {
                    'name': file,
                    'id': name,
                    'data': {
                        'type': 'file',
                        'name': name,
                    },
                };
            });

            list = [...list, ...files];


            return {
                'name': item,
                'id': sdir,
                'data': {
                    'type': 'dir',
                    'name': sdir, //完整名称。
                },
                'list': list,
            };
        });

        return list;
    }


    var roots = make('');
    File.writeJSON('./data/roots.json', roots);




    return;

    var list = fs.readdirSync(root);
    console.log(list);
});
