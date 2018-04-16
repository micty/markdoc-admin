
define('TableResizer.v2/Mouse', function (require, module, exports) {
    var KISP = require('KISP');
    var $ = require('$');

    var Emitter = KISP.require('Emitter');
    var Template = KISP.require('Template');
    var $Array = KISP.require('Array');


    var id$meta = {};       //
    var draging = false;    //表示鼠标左键是否已按下并还没释放。
    var tdWidth = 0;        //鼠标按下时的 td 宽度。
    var tableWidth = 0;
    var x = 0;              //鼠标按下时的 pageX 值。
    var cursor = '';        //鼠标按下时的 cursor 指针值。

    var id = '';            //鼠标按下时的 target 元素的 id 值。
    var mask = null;        //
    var $b = null;
    var tid = null;

    var body = document.body;


    function showMask() {
        clearTimeout(tid);

        mask = mask || KISP.create('Mask', {
            //opacity: 0.1,
            opacity: 0,
        });
        mask.show();
    }






    $(body).on({
       
        //开始按下鼠标左键。
        'mousedown': function (event) {
            id = event.target.id;

            var meta = id$meta[id];

            if (!meta) {
                return;
            }

            var index = meta.id$index[id];
            var field = meta.fields[index];
            var isLast = index == meta.fields.length - 1; //是否为最后一列。

            draging = true;
            x = event.pageX;
            cursor = body.style.cursor;
            body.style.cursor = 'w-resize';

            tdWidth = field.width;

            $b = $('#' + id + '>b');
            $b.addClass('on');
            $b.toggleClass('last', isLast);
            $b.html(tdWidth + 'px');

            tid = setTimeout(showMask, 200);
            
        },

        //按住鼠标左键进行移动。
        'mousemove': function (event) {
            if (!draging) {
                return;
            }

            var meta = id$meta[id];
            var dx = event.pageX - x;   //delta width
            var cw = tdWidth + dx;      //cell width

            if (cw < meta.minWidth) {   //单元格宽度不能小于指定的最小宽度。
                return;
            }
          

            showMask(); //发生了拖曳，立即显示 mask 层。

            var fields = meta.fields;
            var index = meta.id$index[id];
            var col = meta.cols[index];
            var tw = tableWidth = meta.width + dx;

            col.width = fields[index].width = cw;
            meta.$.width(tw);

            $b.html(cw + 'px');

            meta.emitter.fire('change', [{
                'index': index,
                'dx': dx,
                'tdWidth': cw,
                'width': tw,
                'fields': fields,
            }]);
        },

        //释放鼠标左键。
        'mouseup': function (event) {
            var meta = id$meta[id];
            if (!meta) {
                return;
            }

            meta.width = tableWidth;

            id = '';
            draging = false;

            body.style.cursor = cursor;
            clearTimeout(tid);
            mask && mask.hide();
            $b && $b.removeClass('on');
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