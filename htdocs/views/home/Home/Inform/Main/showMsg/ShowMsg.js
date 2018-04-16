

KISP.panel('/Home/Inform/Main/API/ShowMsg', function (require, module, panel) {

    var $ = require('$');
    var KISP = require('KISP');
    var Footer = module.require('Footer');
    var Content = module.require('Content');
    var Dialog = require('Dialog');
    var dialog = null;
    var result = null;

    panel.on('init', function () {

        dialog = Dialog.panel({
            title: '提示',
            container: panel,
            content: Content,
            footer: Footer,
            //width: 440,
            resizable: false,
        });

        dialog.on({
            'render': function (data) {
                Content.render(data);
                Footer.render();
            },
        });
       
        Footer.on({
            'ok': function () {
                dialog.close();
                if(result != -1){
                    panel.fire('sure');
                }
            },
        });
       
    });

   
    panel.on('render', function (data) {
        dialog.render(data);
        result = data.result;
    });


});

