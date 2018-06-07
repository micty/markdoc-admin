
var launch = require('./launch.js'); //define.js 的启动文件。
var config = require('./config.js'); //全局的配置文件。

//启动程序。
launch(function (require, module, exports) {
    var Router = require('Router');
    var Session = require('Session');
    var FileList = require('FileList');
    var Download = require('Download');
    var Upload = require('Upload');

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


    FileList.config(config);
    Session.setTimeout(config.session);


    
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
        //    req.url.startsWith('/download') ||
        //    Session.check(req, res);

        //if (!valid) {
        //    return;
        //}

        next();
    });


    Upload.post({
        'app': app,
        'root': config.dir,
        'dest': 'upload/temp/',
        'route': '/upload',
    });

    Download.get({
        'app': app,
        'root': config.dir,
        'route': '/download',
    });


    Router.all(app, config.api);

});