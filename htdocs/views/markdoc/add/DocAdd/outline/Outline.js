

KISP.panel('/DocAdd/Outline', function (require, module, panel) {
    var KISP = require('KISP');
    var $String = KISP.require('String');
    var Outline = require('Outline');

    var mask = null;
    var outline = null;


    panel.set('show', false); //不要在 render 后自动显示。


    panel.on('init', function () {

        mask = KISP.create('Mask', {
            volatile: true, //易消失。
            opacity: 0,
        });

        mask.on({
            'hide': function () {
                panel.hide();
            },
        });


        outline = new Outline({
            'container': panel.$.find('>div'),
        });

        outline.on({
            'item': function (item, index) {
                panel.fire('item', [item, index]);
            },
        });

        outline.render();

    });



    panel.on('show', function () {
        mask.show();
    });





    /**
    * 渲染。
    *   items = [
    *       {
    *           text: '',       //
    *           level: 1,       //
    *       },
    *   ];
    */
    panel.on('render', function (items) {

        outline.fill(items);

    });



});
