

KISP.panel('/DocAdd/Themes', function (require, module, panel) {

    var KISP = require('KISP');
    var List = module.require('List');
    var Mask = module.require('Mask');
   


    panel.set('show', false);

    panel.on('init', function () {
        Mask.on({
            'show': function () {
                panel.$.addClass('show');
                List.slide(true);

            },

            'hide': function () {
                List.slide(false);
                panel.$.removeClass('show');
            },
        });

        List.on({
            'item': function (item) {
                panel.fire('item', [item.name]);
            },
        });
    });



    panel.on('render', function (index) {
        List.render(index);
        Mask.render();

    });


    return {
        toggle: function () {
            Mask.toggle();
        },
    };

    

});
