

KISP.panel('/Home/Inform/Main/API/ShowMsg/Footer', function (require, module, panel) {
    var MD5 = KISP.require('MD5')
    var passWord = null;
    var result = false;
    var Component = require('Component');

    panel.on('init', function () {
       
        panel.$.on('click', 'button[data-cmd]', function () {
            panel.fire('ok');
        });

    });

    panel.on('render', function () {

    });

    return {
       
    }
});





