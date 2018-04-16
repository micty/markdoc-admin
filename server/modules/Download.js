

define('Download', function (require, module, exports) {
    var File = require('File');
    var MD5 = require('MD5');
    var Path = require('Path');
    var Directory = require('Directory');



    return {

        /**
        * 下载文件。
        *   options = {
        *       app: app,   //外面传进来的 var app = express();
        *       root: '',   //展示端的 data 目录。
        *       route: '',  //给前端请求的路由。 如 `/download`。
        *   };
        */
        get: function (options) {
            var app = options.app;
            var root = options.root;
            var dest = options.dest;
            var route = options.route;

            app.get(route, function (req, res, next) {
                var id = req.query.id;

                if (!id) {
                    res.send({
                        code: 201,
                        msg: '字段 id 不能为空。',
                    });
                    return;
                }

                var file = Path.join(root, id);

                if (!file.startsWith(root)) {
                    res.send({
                        code: 500,
                        msg: '文件路径超出目录范围的限制。',
                    });
                    return;
                }

                res.download(file);
            });
        },


    };
   

});