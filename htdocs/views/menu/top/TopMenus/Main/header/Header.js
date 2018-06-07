

KISP.panel('/TopMenus/Main/Header', function (require, module, panel) {

    var KISP = require('KISP');

    var Tabs = module.require('Tabs');
    


    panel.on('init', function () {

        Tabs.on('cmd', function (cmd, fromRender) {
            panel.fire(cmd, [fromRender]);
        });


    });



    /**
    * 渲染。
    */
    panel.on('render', function () {

        Tabs.render(0);


    });


   

});