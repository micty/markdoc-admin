
define('CheckList/Input', function (require, module, exports) {
    var KISP = require('KISP');
    var $ = require('$');



    return {
        create: function (meta) {
            var txt = document.getElementById(meta.txtId);
            var $txt = $(txt);



            //文本输入框中的事件。
            $txt.on({
                'focus': function () {
                    if (meta.disabled) {
                        return;
                    }

                    meta.masker.show();
                },

                'blur': function () {
                    if (meta.hovering) {
                        return;
                    }

                    meta.masker.hide();
                },
              
            });

            return txt;
        },

    };
});