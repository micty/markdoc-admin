
/**
* 
*/
define('GridView/Pager', function (require, module, exports) {
    var $ = require('$');
    var KISP = require('KISP');
    var Emitter = KISP.require('Emitter');
    var $Array = KISP.require('Array');
    var $String = KISP.require('String');
    var $Object = KISP.require('Object');

    var Pager = require('Pager');

 


    return {

        create: function (meta) {
            var pager = new Pager({
                'container': '#' + meta.pagerId,    //分页控件的容器
                'total': meta.total,                //总的记录数，应该从后台取得该值。
                'size': meta.size,                  //每页的大小，即每页的记录数。
                'sizes': meta.sizes,
                //'min': 2,                           //总页数小于该值时，分页器会隐藏。 如果不指定，则一直显示。
            });


            pager.on({
                //翻页时会调用该方法，参数 no 是当前页码。
                //前端应根据当前页码去拉后台数据。
                'change': function (no, size) {
                    meta.no = no;
                    meta.size = size;
                    meta.selectedMode = false;  //翻页后重置为正常模式。
                    meta.emitter.fire('page', 'change', [no, size]);
                },

                //控件发生错误时会调用该方法，比如输入的页码有错误时
                'error': function (msg) {
                    meta.emitter.fire('page', 'error', [msg]);
                },
            });

            return pager;
           
        },

        /**
        * 从总列表中截取指定分页的列表数据。
        */
        list: function (all, no, size) {
            var begin = (no - 1) * size;
            var end = begin + size;
            var list = all.slice(begin, end);

            return list;
        },
    };
    
});


