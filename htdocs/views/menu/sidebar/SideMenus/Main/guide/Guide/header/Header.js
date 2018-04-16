

KISP.panel('/SideMenus/Main/Guide/Header', function (require, module, panel) {

    var KISP = require('KISP');
    var $String = KISP.require('String');
    var $Object = KISP.require('Object');

   
    var $title = panel.$.find('[data-id="title"]');
    var $check = panel.$.find('[data-id="check"]');
    var checked = false;


    function toggleCheck(sw) {
        //重载 toggleCheck(); 未指定参数，则自动切换为反状态。
        if (sw === undefined) {
            sw = !checked;
        }

        checked = sw;
        $check.toggleClass('on', checked);
        $check.find('span').toggleClass('on', checked);
        panel.fire('check', [checked]);

    }




    panel.on('init', function () {

        $check.on('click', function () {
            toggleCheck();
        });

    });


    /**
    * 渲染。
    */
    panel.on('render', function (item) {
       
        if (item.level == 0) {
            $title.html('添加一级菜单项');
            toggleCheck(true);
            return;
        }

        if (item.level == 1) {
            $title.html('编辑一级菜单项');

            toggleCheck(true);
            return;
        }


        if (item.level == 2) {
            var text = item.id ? '编辑二级菜单项' : '添加二级菜单项';

            $title.html(text);
            toggleCheck(false);
            return;
        }
    });





});