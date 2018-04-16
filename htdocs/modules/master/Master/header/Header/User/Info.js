
KISP.panel('/Master/Header/User/Info', function (require, module, panel) {
    var $ = require('$');
    var KISP = require('KISP');


    panel.on('init', function () {
        function show () {
            //避免上次的隐藏动画还没结束又开始显示动画
            if (panel.$.hasClass('hover')) { 
                return;
            }

            panel.$.addClass('hover');
            panel.$.find('[data-id="menus"]').fadeIn();

        }

        function hide () {
            panel.$.find('[data-id="menus"]').fadeOut(function () {
                panel.$.removeClass('hover');
            });
        }

        panel.$.hover(show, hide);


        panel.$.on('click', '[data-cmd="logout"]', function () {
            panel.fire('logout');
        });


    });


    panel.on('render', function (user) {
  
        panel.fill({
            'name': user.name,
            'number': user.number,
        });
    });










});




