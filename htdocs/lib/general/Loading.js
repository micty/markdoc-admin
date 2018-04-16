
/**
* 多个任务共用单实例的 loading。
* 设计这个主要是为了避免每个任务有自己的 loading 而叠加在一起。
*/
define('Loading', function (require, module, exports) {
    var KISP = require('KISP');
    var Emitter = KISP.require('Emitter');
    
    var loading = null;
    var visibile = false;
    var count = 0;



    return {
        show: function () {
            count++;

            if (visibile) {
                return;
            }

         
            loading = loading || KISP.create('Loading');
            loading.show();
            visibile = true;
        },

        hide: function () {

            if (!loading || !count || !visibile) {
                return;
            }

            count--;

            if (count > 0) {
                return;
            }


            loading.hide();
            visibile = false;
            count = 0;
        },
    };
});