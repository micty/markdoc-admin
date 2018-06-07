

KISP.panel('/TopMenus/Main/Code', function (require, module, panel) {
    var KISP = require('KISP');
    var JSON = KISP.require('JSON');
    var Editor = module.require('Editor');
    var Preview = module.require('Preview');

    panel.on('init', function () {

        Editor.on({
            'scroll': function (info) {
                Preview.scroll(info);
            },
            'change': function (content) {
                Preview.render(content);

                var json = JSON.parse(content);
                panel.fire('change', [json]);
            },
            
        });

        Preview.on({
            'render': function (info) {

            },
            'scroll': function (info) {
                Editor.scroll(info);
            },
        });


    });



    panel.on('render', function (content) {
        if (typeof content == 'object') {
            content = JSON.stringify(content, null, 4);
        }

        Editor.render(content);
    });





});