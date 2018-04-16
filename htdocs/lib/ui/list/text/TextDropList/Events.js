
define('TextDropList/Events', function (require, module, exports) {
    var KISP = require('KISP');
    var $ = require('$');



    return {
        bind: function (meta) {
            var emitter = meta.emitter;
            var txt = '#' + meta.txtId;
            var isHover = false;

            var mask = KISP.create('Mask', {
                'volatile': true, //易消失。
                'opacity': meta.mask,
                'container': meta.dialog,
            });


            mask.on({
                'hide': function () {
                    var text = meta.text;
                    var custom = meta.custom;
                    var item = meta.currentItem;

                    meta.actived = false;
                    emitter.fire('blur');

                    if (!text ||    //空输入。
                        custom ||   //允许自定义。    
                        item        //已选中某一项。
                        ) {

                        meta.$.removeClass('on');
                        return;
                    }

                    //不允许自定义
                    $(txt).addClass('error');
                    emitter.fire('error', ['custom', '配置设定了不允许自定义输入。 请从列表中选择一项。']);
                    return false;

                },
                'show': function () {

                    meta.$.addClass('on');
                    meta.actived = true;

                    var $ul = $('#' + meta.ulId);
                    var item = meta.currentItem;


                    //滚动到所选中的项，让它出现在可视区域内。
                    if (item) {
                        var li = '[data-index="' + item.index + '"]';
                       
                        li = $ul.find(li).get(0);
                        li.scrollIntoViewIfNeeded();
                    }

                    

                    ////自动调整向下或向下弹出列表。
                    //var top = $(txt).offset().top;
                    //var height = $ul.height();
                    //var total = window.innerHeight;
                    //var up = top + height > total;

                    //$ul.toggleClass('up', up);


                    emitter.fire('focus');
                },
            });


            var compositing = false; //针对中文输入法，为 true 表示正在输入而未选中汉字。


            function change(txt) {

                $(txt).removeClass('error');

                var list = meta.list;
                var text = $(txt).val();

                if (text == meta.text) {
                    return;
                }

                meta.text = text;
                emitter.fire('change', [text, list]);
            }


            //文本输入框中的事件。
            meta.$.delegate(txt, {
                'click': function () {
                    if (meta.actived || meta.disabled) {
                        return;
                    }

                    mask.show();
                },
                'focus': function () {
                    if (meta.actived || meta.disabled) {
                        return;
                    }

                    mask.show();
                },
                'blur': function () {
                    if (!isHover) {
                        mask.hide();
                    }
                },
                'input': function () {
                    if (!compositing) {
                        change(this);
                    }
                },
                'compositionstart': function (event) {
                    compositing = true;
                },
                'compositionend': function (event) {
                    compositing = false;
                    change(this);
                },
            });



            //点击列表中的某一项时。
            meta.$.delegate('[data-index]', {
                'click': function (event) {
                    var li = this;
                    var index = +li.getAttribute('data-index');
                    var item = meta.list[index];

                    if (item.disabled) {
                        return;
                    }

                    //用于传递到业务层，以识别是手动选中触发的。
                    meta.event = event;
                    meta.this.select(index);
                    meta.event = null;


                    //让视觉上有个选中的效果。
                    setTimeout(function () {
                        mask.hide();
                    }, 50);

                },
                'mouseover': function () {
                    isHover = true;
                },

                'mouseout': function () {
                    isHover = false;
                },

            });

        },

    };
});