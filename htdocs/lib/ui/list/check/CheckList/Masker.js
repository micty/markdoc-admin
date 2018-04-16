
define('CheckList/Masker', function (require, module, exports) {
    var KISP = require('KISP');
    var $ = require('$');



    return {
        create: function (meta) {

            var masker = KISP.create('Mask', {
                'volatile': true, //易消失。
                'opacity': meta.mask,
                'container': meta.dialog,
                'position': 'absolute',     //这里用回绝对定位。
            });


            masker.on({
                'show': function () {
                    meta.$.addClass('on');
                    meta.visible = true;

                    meta.adjust();
                    meta.$table.get(0).scrollIntoViewIfNeeded(); //在对话框环境中，可能会给遮挡住了。

                },

                'hide': function () {
                    meta.$.removeClass('on');
                    meta.visible = false;
                },
               
            });


            return masker;

        },

    };
});