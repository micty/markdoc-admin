

define('Upload', function (require, module, exports) {
    var File = require('File');
    var MD5 = require('MD5');
    var Path = require('Path');
    var Directory = require('Directory');
    var fs = require('fs');
    var multer = require("multer");


    return {
        /**
        *   options = {
        *       app: app,   //外面传进来的 var app = express();
        *       root: '',   //展示端的 data 目录。
        *       dest: '',   //上临时文件上传到的目录。 相对于 `dir` 字段。如 `upload/temp/`。
        *       route: '',  //给前端请求的路由。 如 `/upload`。
        *   };
        */
        post: function (options) {
            var app = options.app;
            var root = options.root;
            var dest = options.dest;
            var route = options.route;


            var uploader = multer({
                'dest': root + dest,
            });

            var filter = uploader.any();


            app.post(route, filter, function (req, res, next) {
                var body = req.body;
                var file = req.files[0];
                var src = file.path;
                var name = Path.normalize(body.name);
                var dest = root + name;


                //如果该目录出现随机串命名且不后缀的文件，
                //说明移动失败，可以删除该文件。

                try {
                    File.rename(src, dest); //上传成功后，移动到目标位置。

                    var base = Path.base(dest);
                    var ext = Path.ext(dest);
                    var dir = Path.dir(name);

                    res.send({
                        code: 200,
                        msg: 'ok',
                        data: {
                            'dest': name,
                            'name': base + ext,
                            'ext': ext,
                            'dir': dir,
                        },
                    });
                }
                catch (ex) {
                    console.log(ex);

                    File.delete(src);

                    res.send({
                        code: 304,
                        msg: ex.msg,
                    });
                }

            });
        },


    };
   

});