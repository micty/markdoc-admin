
var launch = require('./launch.js'); //define.js 的启动文件。
var config = require('./config.js'); //全局的配置文件。

//启动程序。
launch(function (require, module, exports) {
    var $ = require('$');
    var $Object = $.require('Object');
    var Router = require('Router');
    var Session = require('Session');
    var FileList = require('FileList');

    var express = require('express');
    var bodyParser = require('body-parser');
    var cookieParser = require('cookie-parser');
    var compression = require('compression');
    var app = express();


    app.use(cookieParser());
    app.use(compression());                 //使用 gzip 压缩。
    app.use(express.static(config.dir));    //设置静态目录。    
    app.use(bodyParser.json(config.bodyParser.json));
    app.use(bodyParser.urlencoded(config.bodyParser.urlencoded));

    FileList.config({ 'dir': config.dir, });
    Session.set(config.session);

    
    app.listen(config.port, function () {
        var address = this.address();
        var host = address.address;
        var port = address.port;

        console.log('server listening at http://' + host + ':%s/', port);
    });


    app.use(function (req, res, next) {
        res.set({
            'Access-Control-Allow-Origin': '*',
        });

        //var valid =
        //    req.url.startsWith('/User.login?') ||
        //    req.url.startsWith('/upload') || 
        //    Session.check(req, res);

        //if (!valid) {
        //    return;
        //}

        next();
    });




    (function () {
        var multer = require("multer");

        var storage = multer.diskStorage({

            'destination': function (req, file, done) {
                console.log(req.body);


                var root = config.dir;
                var dir = req.body['dir'];
                var Path = require('Path');

                dir = Path.join(root, dir) + '/';

                done(null, dir);
            },

            'filename': function (req, file, done) {

                var name = req.body['name'] || file.originalname;

                done(null, name);
            }
        })

        var upload = multer({
            'storage': storage,
        });

        app.post('/upload', upload.any(), function (req, res, next) {
            console.log(req.body);
            console.log(req.file);
            console.log(req.files);

            res.send({
                code: 200,
                msg: 'ok',
                data: {

                },
            });

        });

    })();
   
   


    $Object.each(config.api, function (key, value) {
        Router.use(app, {
            'module': key,
            'get': value.get,
            'post': value.post,
        });
    });


  

});