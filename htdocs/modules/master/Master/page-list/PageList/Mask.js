

define('/Master/PageList/Mask', function (require, module, exports) {
    var KISP = require('KISP');
    var Tabs = KISP.require('Tabs');
    var $String = KISP.require('String');
    var Emitter = KISP.require('Emitter');

    var panel = KISP.create('Panel');
    var mask = null;
    var visible = false;
   

    panel.on('init', function () {

        mask = KISP.create('Mask', {
            volatile: true, //易消失。
            //opacity: 0.04,
            opacity: 0,
            //'z-index': -1, //测试。
        });


        mask.on({
            'hide': function () {
                visible = false;
                panel.fire('hide');
            },
            'show': function () {
                visible = true;
                panel.fire('show');
            },
        });


    });






    panel.on('render', function () {
       
    });





    return panel.wrap({
        toggle: function () {
            if (!visible) {
                mask.show();
            }
            else {
                mask.hide();
            }
        },
    });
});