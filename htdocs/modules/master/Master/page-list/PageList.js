

KISP.panel('/Master/PageList', function (require, module, panel) {
    var KISP = require('KISP');
    var Tabs = KISP.require('Tabs');
    var $String = KISP.require('String');

    var List = module.require('List');
    var Mask = module.require('Mask');



    panel.on('init', function () {

        var div = panel.$.find('>div');

        panel.$.on('click', '>i', function () {
            Mask.toggle();
        });

        panel.$.on('click', '[data-cmd="clear"]', function () {
            panel.fire('clear');
        });
      
        panel.$.on('click', '[data-cmd="refresh"]', function () {
            panel.fire('refresh');
        });

        Mask.on({
            'hide': function () {
                div.slideUp('fast');
                panel.$.removeClass('show');
            },
            'show': function () {
                div.slideDown('fast');
                panel.$.addClass('show');
            },
        });

        panel.propagate(List, ['active', 'close']);

    });

    


    panel.on('render', function (list) {
        List.render(list);
        Mask.render();

        panel.fire('render', [list]);
    });



    return {
        active: List.active,
    };


});