
/**
* 记录当前的状态，包括选中的项、表格行等。
*/
define('DropList/Current', function (require, module, exports) {
    var KISP = require('KISP');
    var $ = require('$');




    var defaults = {
        'item': null,
        'row': null,
        'event': null,  //通过 UI 选中的会有相应的事件对象。
        'hover': null,  //hover row
        'keyword': '',  //关键词。
        'html': '',     //keyword 对应的 html。
    };



    return {
        create: function () {
            return Object.assign({}, defaults);
        },


        reset: function (meta, obj) {
            obj = obj || {};

            //var hover = obj.hover;

            ////说明要重置 hover 字段为 null，为避免丢失，
            ////则先清掉之前可能存在的 hover 样式。
            //if (!hover) {
            //    meta.this.hover(-1);
            //}

            Object.assign(meta.current, defaults, obj);

            meta.this.hover(0);
        },

    };
});