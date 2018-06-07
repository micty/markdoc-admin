
var $ = require('defineJS');
var _require = require;             //node.js 原生的 require，备份一下。


/**
* 启动程序。
* 参数：
*   factory: fn,    //工厂函数。
*/
module.exports = function (factory) {
    $.config({
        'base': __dirname,
        'modules': [
            'lib/',
            'modules/',
        ],
    });

    $.launch(function (require, module, exports) {
        var Console = require('Console');
        console.log = Console.log;

        Console.config({
            file: 'console.log',
            timestamp: true,
        });

        factory && factory(require, module, exports);

    });
};


