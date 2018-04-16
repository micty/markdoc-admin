
define('DropList/Input', function (require, module, exports) {
    var KISP = require('KISP');
    var $ = require('$');


    //如果指定了
    function checkFocus(meta) {
        var field = meta.field;
        var item = meta.current.item;

        if (!field || !field.focus || !item) {
            return;
        }

     
        var text = meta.getValue(item.item, field.focus);

        meta.this.set('text', text);
        meta.this.select();
    }



    function checkBlur(meta) {
        var field = meta.field;
        var item = meta.current.item;

        if (!field || !field.text || !item) {
            return;
        }

        var text = meta.getValue(item.item, field.text);
        meta.this.set('text', text);
    }




    return {
        create: function (meta) {
            var txt = document.getElementById(meta.txtId);
            var $txt = $(txt);
            var compositing = false;            //针对中文输入法，为 true 表示正在输入而未选中汉字。



            //文本输入框中的事件。
            $txt.on({
                'focus': function () {
                    if (meta.disabled) {
                        return;
                    }

                    meta.masker.show();
                    checkFocus(meta);

                },

                'blur': function () {
                    if (meta.hovering) {
                        return;
                    }

                    meta.masker.hide();
                    checkBlur(meta);
                },

                'click': function (event) {
                  
                },


                'input': function () {
                    if (compositing) {
                        return;
                    }

                    meta.change();
                },

                'compositionstart': function (event) {
                    compositing = true;
                },

                'compositionend': function (event) {
                    compositing = false;
                    meta.change();
                },

                //针对键盘的向上键和向下键来移动、回车键来选取。
                'keydown': function (event) {
                    var keyCode = event.keyCode;
                    var current = meta.current;
                    var hover = current.hover; //row


                    //回车键。
                    if (keyCode == 13) {
                        current.event = event; //模拟手动选中。
                        hover && meta.this.select(hover.index);
                        txt.blur();
                        return;
                    }

                    //
                    var index = hover ? hover.index : -1;
                    var isUp = keyCode == 38;       //向上键。
                    var isDown = keyCode == 40;     //向下键。
                    var max = meta.length - 1;

                    if (isUp || isDown) {

                        index = isUp ? index - 1 : index + 1;

                        //使可以上下循环移动
                        if (index < 0) {
                            index = max;
                        }
                        else if (index > max) {
                            index = 0;
                        }


                        meta.this.hover(index);
                        event.preventDefault();
                    }




                },
            });

            return txt;
        },

    };
});