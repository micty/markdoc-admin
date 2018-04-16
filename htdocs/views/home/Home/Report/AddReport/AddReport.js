

KISP.panel('/Home/Report/AddReport', function (require, module, panel) {

    var KISP = require('KISP');
    var Dialog = require('Dialog');
    var Content = module.require('Content');

    var dialog = null;

    panel.on('init', function () {

        dialog = Dialog.panel({
            'title': '添加报表',
            'container': panel,
            'content': Content,
            'width': 428,
            'height': 428,

        });

        dialog.on({
            'render': function () {
                Content.render();
            },

        });

        Content.on({
            'add': function (list) {
                panel.fire('add', [list]);
                dialog.close();
            }
        });

     
    });

    panel.on('render', function () {
        dialog.render();

    });

});
