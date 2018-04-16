

KISP.panel('/Master/Header', function (require, module, panel) {

    var KISP = require('KISP');
    var $ = require('$');
    var Query = KISP.require('Query');
    var $String = KISP.require('String');
    var Search = module.require('Search');
    var User = module.require('User');


    panel.on('init', function () {

        Search.on({
            'focus': function () {
                panel.$.addClass('focus');
            },

            'blur': function () {
                panel.$.removeClass('focus');
            },
            'submit': function (value) {
                panel.fire('search', [value]);
            },
        });

        User.on({
            'logout': function () {
                panel.fire('logout');
            },
        });
    });



    /**
    *   options = {
    *       user: {},   //登录后的用户信息。
    *   };
    */
    panel.on('render', function (options) {
        Search.render();
        User.render(options.user);

    });

});