


/**
* 用户信息模块
*/
KISP.panel('/Master/Header/User', function (require, module, panel) {

    var $ = require('$');
    var KISP = require('KISP');
    var User = require('User');
    var Info = module.require('Info');
    var Message = module.require('Message');

    panel.on('init', function () {
        
        Info.on({
            'logout': function () {
                panel.fire('logout');
            },
        });

    });


    panel.on('render', function (user) {
  
        Info.render(user);
        Message.render({'count': 0, });
    });










});




