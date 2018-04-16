

KISP.panel('/FileList/Tree/Resizer', function (require, module, panel) {
    var KISP = require('KISP');
    var $String = KISP.require('String');
    

    panel.on('init', function () {

        var draging = false;    //表示鼠标左键是否已按下并还没释放。
        var x = 0;              //鼠标按下时的 pageX 值。
        var cursor = '';        //鼠标按下时的 cursor 指针值。

        var mask = null;        //
        var tid = null;

        var body = document.body;
        var div = panel.$.get(0);




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
                if (event.target !== div) {
                    return;
                }
              
                draging = true;
                x = event.pageX;
                cursor = body.style.cursor;
                body.style.cursor = 'w-resize';

                tid = setTimeout(showMask, 200);
                panel.fire('start');

            },

            //按住鼠标左键进行移动。
            'mousemove': function (event) {
                if (!draging) {
                    return;
                }

                var dx = event.pageX - x;   //delta width

                showMask(); //发生了拖曳，立即显示 mask 层。

                panel.fire('change', [dx]);
            },

            //释放鼠标左键。
            'mouseup': function (event) {
                if (!draging) {
                    return;
                }

                draging = false;

                body.style.cursor = cursor;
                clearTimeout(tid);
                mask && mask.hide();
                panel.fire('stop');
               
            },


        });
    });


    /**
    * 渲染。
    *   options = {
    *   };
    */
    panel.on('render', function (options) {
       

        
    });

   


});