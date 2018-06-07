

define('FileList', function (require, module, exports) {
    var File = require('File');
    var MD5 = require('MD5');
    var Path = require('Path');
    var Directory = require('Directory');
    var fs = require('fs');
    var List = module.require('List');

    var root = '';



    //检查指定的路径是否为图片。
    function checkIsImage(src) {
        var ext = Path.ext(src);
        ext = ext.toLowerCase(); //统一转成小写。

        var list = [
            '.png',
            '.jpg',
            '.jpeg',
            '.gif',
            '.bmp',
        ];

        return list.includes(ext);
    }


    /**
    * 读取指定文件或目录的信息。
    */
    function read(id) {
        var src = root + id;

        //不存在该文件或目录。
        if (!File.exists(src)) {
            return;
        }

        var stat = fs.statSync(src);
        var isFile = !stat.isDirectory();

        var data = {
            'name': id.startsWith('/') ? id : '/' + id, //确保以 `/` 开头。
            'stat': stat,
            'type': isFile ? 'file' : 'dir',
        };

        if (isFile) {
            var md5 = MD5.get(content);
            var ext = Path.ext(src);
            var isImage = checkIsImage(src);
            var content = isImage ? '' : File.read(src);

            
            Object.assign(data, {
                'ext': ext,
                'md5': md5,
                'content': content,
                'isImage': isImage,
            });
        }
        else {
            var list = List.stat(src, root);

            Object.assign(data, {
                'list': list,
            });
        }

        return data;
    }



    return {

        config: function (data) {
            root = data.dir;
        },


        /**
        * 获取全部文件和目录列表。
        */
        get: function (req, res) {
            try {
                var data = List.get(root);
                var cwd = process.cwd();

                data.root = Path.relative(cwd, root);

                res.success(data);
            }
            catch (ex) {
                res.error(ex);
            }
        },

        /**
        * 读取指定的文件。
        *   query: {
        *       id: '', //文件路径。
        *   },
        */
        read: function (req, res) {
            var id = req.query.id || '';

            try {
                
                var data = read(id);
                if (data) {
                    res.success(data);
                }
                else {
                    res.none({ 'id': id, });
                }
            }
            catch (ex) {
                res.error(ex);
            }
        },

        /**
        * 写入。
        *   body.data = {
        *       id: '',                 //文件 id，即文件路径。
        *       mode: 'new' | 'edit',   //模式，是新增还是编辑。
        *       content: '',            //文件内容。
        *   };
        */
        write: function (req, res) {
            var item = req.body.data;
            var id = item.id;

            if (!id) {
                res.empty('id');
                return;
            }

            try {
                var src = root + id;
                var existed = File.exists(src);
                var mode = item.mode;

                if (mode == 'new' && existed) {
                    res.send({
                        code: 301,
                        msg: '无法新增已存在的文件: ' + id,
                    });
                    return;
                }

                if (mode == 'edit' && !existed) {
                    res.send({
                        code: 404,
                        msg: '无法编辑不存在的文件: ' + id,
                    });
                    return;
                }

                File.write(src, item.content);

                var data = read(id);
                res.success(data);
               
            }
            catch (ex) {
                res.error(ex);
            }
        },

        /**
        * 重命名文件或目录。
        *   body.data = {
        *       id: '',     //源文件或目录名称。
        *       dest: '',   //目标文件或目录名称。
        *   };
        */
        rename: function (req, res) {
            var data = req.body.data;
            var id = data.id;
            var dest = data.dest;

            if (!id) {
                res.empty('id');
                return;
            }

            if (!dest) {
                res.empty('dest');
                return;
            }

            try {
                var src = root + id;
                var sdest = root + dest;

                var stat = fs.statSync(src);
                var isDir = stat.isDirectory();


                if (isDir) {
                    Directory.rename(src, sdest);
                }
                else {
                    File.rename(src, sdest);
                }

                res.success({
                    'id': id,
                    'dest': dest,
                });
            }
            catch (ex) {
                res.error(ex);
            }
        },

        /**
        * 新增一个文件或目录。
        *   body.data = {
        *       id: '',                 //要增加的文件或目录名称。
        *       type: 'file' | 'dir',   //类型，文件或目录。
        *   };
        */
        add: function (req, res) {
            var data = req.body.data;
            var id = data.id;
            var type = data.type;

            if (!id) {
                res.empty('id');
                return;
            }

            try {
                var src = root + id;

                if (File.exists(src)) {
                    res.send({
                        code: '304',
                        msg: '已存在: ' + id,
                    });
                    return;
                }

                if (type == 'file') {
                    if (Path.isJSON(src)) {
                        File.writeJSON(src, {});
                    }
                    else {
                        File.write(src, '');
                    }
                }
                else {
                    src = src + '/'; //创建目录的，要以 '/' 结尾。
                    Directory.create(src);
                }

                res.success({
                    'id': id,
                });
            }
            catch (ex) {
                res.error(ex);
            }
        },


        /**
        * 删除一个文件或目录。
        *   body.data = {
        *       id: '',                 //要删除的文件或目录名称。
        *       type: 'file' | 'dir',   //类型，文件或目录。
        *   };
        */
        delete: function (req, res) {
            var data = req.body.data;
            var id = data.id;
            var type = data.type;

            if (!id) {
                res.empty('id');
                return;
            }

            try {
                var src = root + id;

                if (!File.exists(src)) {
                    res.send({
                        code: '404',
                        msg: '不存在: ' + id,
                    });
                    return;
                }

                if (type == 'file') {
                    File.delete(src);
                }
                else {
                    Directory.delete(src);
                }

                res.success({
                    'id': id,
                });
            }
            catch (ex) {
                res.error(ex);
            }
        },

        /**
        * 上传。
        */
        upload: function (req, res) {
            console.log(req.body);
            console.log(req.files);

            var file = req.files['file'].path;
            

            res.success({
                'file': file,
            });
        },

    };


});