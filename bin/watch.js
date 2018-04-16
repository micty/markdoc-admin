
/**
* 编译并进行监控。 使用命令:
*
* 单页应用模式:
*   node watch                  //编译并进行监控。
*   node watch open             //编译并进行监控。 完成后，以本机 ip 作为 host，打开网站页面。
*   node watch open localhost   //编译并进行监控。 完成后，以 `localhost` 作为 host，打开网站页面。
*   node watch open .           //`.` 等同于 `localhost`。
*   node watch qr               //编译并进行监控。 完成后，以本机 ip 作为 host，打开网站对应的二维码页面，以获取二维码。
*   node watch qr 450           //编译并进行监控。 完成后，以本机 ip 作为 host，打开网站对应的二维码页面，以获取二维码(450 像素)。
*
* 独立打包模式:
*   node watch pack                 //使用独立打包的方式，编译并进行监控。
*   node watch pack open            //使用独立打包的方式，编译并进行监控。 完成后，以本机 ip 作为 host，打开网站页面。
*   node watch pack open localhost  //使用独立打包的方式，编译并进行监控。 完成后，以 `localhost` 作为 host，打开网站页面。
*   node watch pack open .          //`.` 等同于 `localhost`。
*   node watch pack qr              //使用独立打包的方式，编译并进行监控。 完成后，以本机 ip 作为 host，打开网站对应的二维码页面，以获取二维码。
*   node watch pack qr 450          //使用独立打包的方式，编译并进行监控。 完成后，以本机 ip 作为 host，打开网站对应的二维码页面，以获取二维码(450 像素)。
*/

start();


function start() {
    var master = require('web-master');

    /**
    * 解析命令行的参数。
    *   args = {
    *       pack: false,    //是否使用了 `pack` 选项。　如果是则使用独立打包的方式。
    *       action: '',     //编译完成后要执行的动作。 如 `open` 或 `qr`。
    *       value: '',      //要传递给 action 的值。 如 `localhost`、`450`。
    *   };
    */
    var args = master.getArgs('watch');

    //加载用于 new WebSite(defaults) 创建站点时的配置参数。
    var defaults = require('./config/defaults.js');

    //加载用于 website.watch(options) 进行监控的配置参数。
    var options = require('./config/watch.js');


    //加载用于独立打包时的配置参数。
    if (args.pack) {
        var pack = require('./config/defaults.pack.js');
        Object.assign(defaults.packages, pack.packages);

        pack = require('./config/watch.pack.js');
        Object.assign(options, pack);
    }


    master.watch({
        'args': args,
        'defaults': defaults,
        'options': options,
        'done': function (require, module, exports) {
            console.log('...ooooOOOOoooo...'.bgMagenta);
        },
    });


}