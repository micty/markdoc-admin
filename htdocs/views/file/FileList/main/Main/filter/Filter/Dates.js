
/*
* 
*/
KISP.panel('/FileList/Main/Filter/Dates', function (require, module, panel) {
    var KISP = require('KISP');
    var DateTimePicker = require('DateTimePicker');

    var dtpBegin = null;
    var dtpEnd = null;

    var current = {
        beginDate: '',
        endDate: '',
    };

    /**
    * 初始化时触发。
    * 即首次 render 之前触发，且仅触发一次。
    * 适用于创建实例、绑定事件等只需要执行一次的操作。
    */
    panel.on('init', function () {
       
        dtpBegin = new DateTimePicker({
            'selector': panel.$.find('input[name="begin"]'),
        });

        dtpEnd = new DateTimePicker({
            'selector': panel.$.find('input[name="end"]'),
        });

        dtpBegin.on('change', function (value) {
            current.beginDate = value;
            panel.fire('change', [current]);
        });


        dtpEnd.on('change', function (value) {
            current.endDate = value;
            panel.fire('change', [current]);
        });
    });



    /**
    * 渲染时触发。
    * 即外界显式调用 render() 时触发，且每次调用都会触发一次。
    * 外界传进来的参数会原样传到这里。
    */
    panel.on('render', function () {
        dtpBegin.render();
        dtpEnd.render();

    });




});



