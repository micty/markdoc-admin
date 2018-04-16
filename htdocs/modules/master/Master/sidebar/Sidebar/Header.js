

KISP.panel('/Master/Sidebar/Header', function (require, module, panel) {
    var KISP = require('KISP');
    var $ = require('$');
    var $String = KISP.require('String');



    


    panel.on('init', function () {

        panel.$.on('click', function () {
            
            panel.fire('toggle');

        });
    });




    panel.on('render', function () {
     
       

    });






});