
define('ImageViewer/Drager', function (require, module, exports) {
    var KISP = require('KISP');
    var $ = require('$');



    var x = 0;              //鼠标按下时的 pageX 值。
    var y = 0;              //鼠标按下时的 pageY 值。
    var marginLeft = 0;
    var marginTop = 0;

    var cursor = '';        //鼠标按下时的 cursor 指针值。
    var body = document.body;

    var id$meta = {};
    var meta = null;
    var Meta = null;

    function stop(event) {
        body.style.cursor = cursor;
        event && event.preventDefault();
        meta = null;
    }


    $(body).on({
        'mousedown': function (event) {
            meta = id$meta[event.target.id];
            if (Meta) {
                Meta.isClick = true;
            }
            if (!meta) {
                return;
            }

            x = event.pageX;
            y = event.pageY;

            cursor = body.style.cursor;
            body.style.cursor = 'move';

            marginLeft = meta.$img.css('margin-left');
            marginTop = meta.$img.css('margin-top');
            marginLeft = parseInt(marginLeft);
            marginTop = parseInt(marginTop);

            //禁止选中文本
            window.getSelection().removeAllRanges();

        },

        'mousemove': function (event) {

            if (!meta) {
                return;
            }

            //鼠标左键按下去时， event.which 的值为 1。
            //拖曳 dialog 一直离开浏览器区域，松开鼠标，并不会触发 mouseup 事件。
            //然后鼠标再回到浏览器区域，mousemove 事件还是会继续触发，但 event.which 的值为 0。
            //这里，当 dialog 给拖曳到离开浏览器区域时，我们执行跟 mouseup 一样的逻辑。
            if (event.which != 1) {
                stop();
                return;
            }

            var dx = event.pageX - x;
            var dy = event.pageY - y;
            var left = marginLeft + dx;
            var top = marginTop + dy;

            var imgWidth = parseFloat(meta.$img.css('width'));
            var imgHeight = parseFloat(meta.$img.css('height'));

            //只有当图片的宽或高超出浏览器窗口尺寸图片才可以被拖动
            if (imgWidth > window.innerWidth || imgHeight > window.innerHeight) {
                meta.$img.css({
                    'margin-left': left,
                    'margin-top': top,
                });
            }
            if (dx != 0 || dy != 0) {
                meta.isClick = false;
            }

        },

        'mouseup': function (event) {
            stop(event);
            event.stopPropagation();
        },
    });





    return {

        set: function (id, meta) {
            Meta = id$meta[id + '-img'] = meta;
        },


        remove: function (id) {
            delete id$meta[id + '-img'];
        },

    };
});