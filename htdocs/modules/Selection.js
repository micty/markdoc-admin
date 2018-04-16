
/**
* 改善页面中的文本选中，让用户可以很方便地通过单击来取消选中。
*/
define('/Selection', function (require, module, exports) {
    var KISP = require('KISP');
    var bind = false;

    var ignored = {
        1: true,        //只监听鼠标左键。
        'INPUT': true,
        'TEXTAREA': true,
    };


    function checkIgnored(event) {
        return ignored[event.which] || ignored[event.target.tagName];
    }


    return {
        render: function () {
            if (bind) {
                return;
            }

            bind = true;

            //
            var x = 0;
            var y = 0;


            $(document.body).on({
                'mousedown': function (event) {
                    if (checkIgnored(event)) {     //只监听鼠标左键。
                        return;
                    }
                

                    x = event.pageX;
                    y = event.pageY;
                },

                'mouseup': function (event) {
                    if (checkIgnored(event)) {     //只监听鼠标左键。
                        return;
                    }

                    //在同一个坐标完成了一个鼠标左键的点击，则取消选中。
                    if (event.pageX == x && event.pageY == y) {
                        document.getSelection().empty();
                    }
                },
            });
        },

    };

});