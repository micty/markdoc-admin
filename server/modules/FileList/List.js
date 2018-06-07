


define('FileList/List', function (require, module, exports) {
    var $ = require('$');
    var Directory = require('Directory');
    var File = require('File');
    var Path = require('Path');
    var fs = require('fs');
    




    return {
        get: function (root) {
            var dir$files = {}; //某个目录对应的文件列表（仅当前层级，不包括子目录的）。
            var dir$dirs = {};  //某个目录对应的子目录列表（仅当前层级，不包括子目录的）。

            Directory.each(root, function (dir, files, dirs) {

                //文件列表，取成短名称。
                files = files.map(function (file) {
                    file = Path.relative(dir, file);

                    return file;
                });

                //子目录列表，取成短名称。
                dirs = dirs.map(function (sdir) {
                    sdir = Path.relative(dir, sdir);

                    return sdir;
                });

                //当前目录名，取成短名称。
                dir = Path.relative(root, dir);

                dir = '/' + dir;

                dir$files[dir] = files;
                dir$dirs[dir] = dirs;
            });

            return {
                'dir$files': dir$files,
                'dir$dirs': dir$dirs,
            };
        },

        /**
        * 
        */
        stat: function (src, root) {
            var list = [];

            Directory.each(src, function (dir, files, dirs) {
               
                files = files.map(function (file) {
                    var name = Path.relative(root, file);
                    var ext = Path.ext(file);

                    return {
                        'type': 'file',
                        'name': '/' + name,
                        'ext': ext,
                        'stat': fs.statSync(file),
                    };
                });


                dirs = dirs.map(function (sdir) {
                    var name = Path.relative(root, sdir);

                    return {
                        'type': 'dir',
                        'name': '/' + name,
                        'stat': fs.statSync(sdir),
                    };
                });
                
                list.push(...dirs, ...files);
            });


            return list;
        },
    };

    
});
