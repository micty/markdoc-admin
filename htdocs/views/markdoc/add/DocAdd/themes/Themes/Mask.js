

KISP.panel('/DocAdd/Themes/Mask', function (require, module, panel) {
    var KISP = require('KISP');

    var mask = null;
    var visible = false;
   

    panel.on('init', function () {
        mask = KISP.create('Mask', {
            volatile: true, //易消失。
            opacity: 0,
            //opacity: 0.04,

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



    return {
        toggle: function () {
            if (!visible) {
                mask.show();
            }
            else {
                mask.hide();
            }
        },
    };


});