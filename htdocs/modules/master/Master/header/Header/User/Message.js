
KISP.panel('/Master/Header/User/Message', function (require, module, panel) {

    var $ = require('$');
    var KISP = require('KISP');

    panel.on('init', function () {
        

    });


    panel.on('render', function (data) {
        panel.fill({
            'count': data.count,
        });
    });





});




