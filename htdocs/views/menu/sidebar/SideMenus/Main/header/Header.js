

KISP.panel('/SideMenus/Main/Header', function (require, module, panel) {

    var KISP = require('KISP');

    var Path = module.require('Path');
    var Tabs = module.require('Tabs');
   


    panel.on('init', function () {

        Tabs.on('cmd', function (cmd, fromRender) {
            panel.fire(cmd, [fromRender]);
        });


    });



    /**
    * 渲染。
    *   options = {
    *       file: '',       //文件路径。
    *       index: 0,       //要激活的页签序号。
    *   };
    */
    panel.on('render', function (options) {

        Tabs.render(options.index);

        Path.render({
            'file': options.file,
            'mode': options.mode,
        });
    });


    return {
        get: function () {
            return Path.get();
        },
    };

});