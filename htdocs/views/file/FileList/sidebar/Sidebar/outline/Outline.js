

KISP.panel('/FileList/Sidebar/Outline', function (require, module, panel) {
    var KISP = require('KISP');
    var $String = KISP.require('String');
    var Outline = require('Outline');


    var outline = null;


    panel.set('show', false); //不要在 render 后自动显示。


    panel.on('init', function () {

        outline = new Outline({
            'container': panel.$,
        });

        outline.on({
            'item': function (item, index) {
                panel.fire('item', [item, index]);
            },
        });

        outline.render();
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
