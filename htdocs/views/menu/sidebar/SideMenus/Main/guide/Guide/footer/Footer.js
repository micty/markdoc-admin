

KISP.panel('/SideMenus/Main/Guide/Footer', function (require, module, panel) {

    var KISP = require('KISP');
    var Menus = module.require('Menus');



    panel.on('init', function () {
        Menus.on('cmd', function (item) {
            var args = item.args || [];

            panel.fire(item.cmd, args);
        });
    });

    /**
    * 渲染。
    */
    panel.on('render', function (item) {

        Menus.render();

        var level = item.level;
        var isAdd = level == 0 || (level == 2 && !item.id);

        panel.$.toggleClass('add', isAdd);

    });


});