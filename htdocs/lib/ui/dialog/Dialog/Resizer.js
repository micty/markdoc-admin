
define('Dialog/Resizer', function (require, module, exports) {
    var KISP = require('KISP');
    var $ = require('$');

    var Template = KISP.require('Template');



    var x = 0;              //鼠标按下时的 pageX 值。
    var y = 0;              //鼠标按下时的 pageY 值。
    var width = 0;
    var height = 0;

    var cursor = '';        //鼠标按下时的 cursor 指针值。
    var body = document.body;

    var id$meta = {};
    var meta = null;
    var header = null;
    var sizer = null;


    function stop(event) {
        body.style.cursor = cursor;
        event && event.preventDefault();
        header && header.removeClass('resizing');

        meta = null;
        header = null;
        sizer = null;
    }

    function setSizer(width, height) {
        var html = width + ' x ' + height;
        sizer.html(html);
    }


    $(body).on({
        'mousedown': function (event) {
            var target = event.target;
            var id = target.getAttribute('data-id');
            meta = id$meta[id];

            if (!meta) {
                return;
            }

            x = event.pageX;
            y = event.pageY;

            cursor = body.style.cursor;
            body.style.cursor = $(target).css('cursor');

            width = meta.$.css('width');
            height = meta.$.css('height');
            width = parseInt(width);
            height = parseInt(height);

            header = $('#' + meta.headerId);
            header.addClass('resizing');

            sizer = $('#' + meta.sizerId);
            setSizer(width, height);

            return false; //禁止选中文本
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

            var w = width + dx;
            var h = height + dy;

            var maxWidth = meta.maxWidth;
            if (maxWidth && w > maxWidth) {
                w = maxWidth;
            }

            var minWidth = meta.minWidth;
            if (minWidth && w < minWidth) {
                w = minWidth;
            }

            var maxHeight = meta.maxHeight;
            if (maxHeight && h > maxHeight) {
                h = maxHeight;
            }

            var minHeight = meta.minHeight;
            if (minHeight && h < minHeight) {
                h = minHeight;
            }


            meta.$.css({
                'width': w,
                'height': h,
            });

            setSizer(w, h);
        },

        'mouseup': function (event) {
            stop(event);
        },
    });





    return {
        set: function (id, meta) {
            id$meta[id] = meta;
        },

        remove: function (id) {
            delete id$meta[id];
        },

    };
});