
/**
* 构建生产环境的代码。 使用命令:
*
* 单页应用模式:
*   node build                      //使用 `dist` 方案的配置构建网站。
*   node build dist                 //使用 `dist` 方案的配置构建网站。
*   node build dist open            //使用 `dist` 方案的配置构建网站。 完成后，以本机 ip 作为 host，打开网站页面。
*   node build dist open localhost  //使用 `dist` 方案的配置构建网站。 完成后，以 `localhost` 作为 host，打开网站页面。
*   node build open                 //使用 `dist` 方案的配置构建网站。 完成后，以本机 ip 作为 host，打开网站页面。
*   node build open localhost       //使用 `dist` 方案的配置构建网站。 完成后，以 `localhost` 作为 host，打开网站页面。
*   node build open .               //使用 `dist` 方案的配置构建网站。 完成后，以 `localhost` 作为 host，打开网站页面。
*   node build qr                   //使用 `dist` 方案的配置构建网站。 完成后，以本机 ip 作为 host，打开网站对应的二维码页面，以获取二维码。
*   node build qr 450               //使用 `dist` 方案的配置构建网站。 完成后，以本机 ip 作为 host，打开网站对应的二维码页面，以获取二维码(450 像素)。
*   node build dist qr              //使用 `dist` 方案的配置构建网站。 完成后，以本机 ip 作为 host，打开网站对应的二维码页面，以获取二维码。
*   node build dist qr 450          //使用 `dist` 方案的配置构建网站。 完成后，以本机 ip 作为 host，打开网站对应的二维码页面，以获取二维码(450 像素)。
*
* 独立打包模式:
*   node build pack                     //使用独立打包的方式，使用 `dist` 方案的配置构建网站。
*   node build pack dist                //使用独立打包的方式，使用 `dist` 方案的配置构建网站。
*   node build pack dist open           //使用独立打包的方式，使用 `dist` 方案的配置构建网站。 完成后，以本机 ip 作为 host，打开网站页面。
*   node build pack dist open localhost //使用独立打包的方式，使用 `dist` 方案的配置构建网站。 完成后，以 `localhost` 作为 host，打开网站页面。
*   node build pack open                //使用独立打包的方式，使用 `dist` 方案的配置构建网站。 完成后，以本机 ip 作为 host，打开网站页面。
*   node build pack open localhost      //使用独立打包的方式，使用 `dist` 方案的配置构建网站。 完成后，以 `localhost` 作为 host，打开网站页面。
*   node build pack qr                  //使用独立打包的方式，使用 `dist` 方案的配置构建网站。 完成后，以本机 ip 作为 host，打开网站对应的二维码页面，以获取二维码。
*   node build pack qr 450              //使用独立打包的方式，使用 `dist` 方案的配置构建网站。 完成后，以本机 ip 作为 host，打开网站对应的二维码页面，以获取二维码(450 像素)。
*   node build pack dist qr             //使用独立打包的方式，使用 `dist` 方案的配置构建网站。 完成后，以本机 ip 作为 host，打开网站对应的二维码页面，以获取二维码。
*   node build pack dist qr 450         //使用独立打包的方式，使用 `dist` 方案的配置构建网站。 完成后，以本机 ip 作为 host，打开网站对应的二维码页面，以获取二维码(450 像素)。
*/




start();


function start() {
    var master = require('web-master');

    /**
    * 解析命令行的参数。
    *   args = {
    *       pack: false,    //是否使用了 `pack` 选项。　如果是则使用独立打包的方式。
    *       level: '',      //构建要使用的配置方案的名称。 默认为 `dist`。
    *       action: '',     //编译完成后要执行的动作。 如 `open` 或 `qr`。
    *       value: '',      //要传递给 action 的值。 如 `localhost`、`450`。
    *   };
    */
    var args = master.getArgs('build');

    //加载用于 new WebSite(defaults) 创建站点时的配置参数。
    var defaults = require('./config/defaults.js');

    //加载用于 website.build(options) 进行监控的配置参数。
    var options = require('./config/build.' + args.level + '.js');  //如 `build.dist.js`。


    //加载用于独立打包时的配置参数。
    if (args.pack) {
        var pack = require('./config/defaults.pack.js');
        Object.assign(defaults.packages, pack.packages);

        pack = require('./config/build.' + args.level + '.pack.js'); //如 `build.dist.pack.js`。
        Object.assign(options, pack);
    }


  
    master.build({
        'args': args,
        'defaults': defaults,
        'options': options,

        'done': function (require, module, exports) {
            console.log('ooooOOOOoooo');

        },
    });


}







