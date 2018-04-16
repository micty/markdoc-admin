

KISP.panel('/Master/Header/Search', function (require, module, panel) {

    var $ = require('$');
    var KISP = require('KISP');




    panel.on('init', function () {

        var txt = panel.$.find('input').get(0);
        var submiting = false;


        panel.$.on('focusin', txt, function () {
            panel.fire('focus');
        });

        panel.$.on('focusout', txt, function () {
            if (submiting) {
                setTimeout(function () {
                    panel.fire('blur');
                }, 400);
            }
            else {
                panel.fire('blur');
            }
        });

        panel.$.on('keyup', txt, function (event) {
            if (event.keyCode == 13) {
                setTimeout(function () {
                    txt.blur();
                    panel.fire('submit', [txt.value]);
                }, 400);

            }
        });

        panel.$.on('click', 'button', function () {
            panel.fire('submit', [txt.value]);
        });

        panel.$.on('mouseover', 'button', function () {
            submiting = true;
        });

        panel.$.on('mouseleave', 'button', function () {
            submiting = false;
        });
     
    });


    panel.on('render', function () {
       
    });



});





