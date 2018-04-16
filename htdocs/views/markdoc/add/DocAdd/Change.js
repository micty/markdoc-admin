

define('/DocAdd/Change', function (require, module, exports) {

    var KISP = require('KISP');

    var msg = '当前编辑器中存在未保存的内容，是否继续加载新内容？';
    var toast = null;

    return {

        load: function (changed, done) {
            if (changed) {
                KISP.confirm(msg, done);
            }
            else {
                done();
            }
        },

        save: function (changed, done) {
            if (changed) {
                done();
                return;
            }


            toast = toast || KISP.create('Toast', {
                text: '已保存',
                duration: 1500,
                //mask: 0, //这里不要用 mask，免得在 show 时给点击一下。
            });

            toast.show();


        },

    };
    

});
