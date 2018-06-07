

KISP.panel('/Master/Sidebar/Header', function (require, module, panel) {
    var KISP = require('KISP');
    var $ = require('$');
    var $String = KISP.require('String');
    var Storage = KISP.require('LocalStorage');

    var storage = null
    var visible = true;


    panel.on('init', function () {

        storage = new Storage(module.id);
        visible = storage.get('visible');

        if (visible === undefined) {
            visible = true;
        }

        panel.fire('toggle', [visible]);


        panel.$.on('click', function () {
            
            visible = !visible;

            storage.set('visible', visible);
            panel.fire('toggle', [visible]);

        });
    });




    panel.on('render', function () {
     
       

    });






});