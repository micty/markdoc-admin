

define('CheckList/Template', function (require, module) {

    var $ = require('$');
    var Template = KISP.require('Template');
    var $Array = KISP.require('Array');
    var $String = KISP.require('String');




    return {

        create: function (meta) {

            var tpl = new Template('#tpl-CheckList');


            tpl.process({
                '': function () {

                    //因为原 html 中的 sample 给处理后 没有等号的属性值会给替换成有空值的属性值。
                    //如 {readonly} 会给替换成 {readonly}=""，这不是我们想要的。
                    //这里我们手动替换回来。
                    this.fix(['readonly', 'disabled', 'tabIndex']);

                    var tabIndex = meta.tabIndex;
                    tabIndex = tabIndex ? 'tabindex="' + tabIndex + '"' : '';

                    return {
                        'txtId': meta.txtId,
                        'tableId': meta.tableId,
                        'text': meta.text,
                        'readonly': meta.readonly ? 'readonly' : '',
                        'disabled': meta.disabled ? 'disabled' : '',
                        'tabindex': tabIndex,

                    };
                },


            });


            return tpl;
        },
    };



});

