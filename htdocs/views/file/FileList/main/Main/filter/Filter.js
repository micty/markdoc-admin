
/*
* 
*/
KISP.panel('/FileList/Main/Filter', function (require, module, panel) {
    var KISP = require('KISP');
    var Type = module.require('Type');
    var Dates = module.require('Dates');
    var Name = module.require('Name');
    var Dir = module.require('Dir');


    //当前选中的数据字段。
    var current = {
        type: '',
        beginDate: '',
        endDate: '',
        name: '',
        dir: false, //是否仅限当前目录。
    };


    /**
    * 初始化时触发。
    * 即首次 render 之前触发，且仅触发一次。
    * 适用于创建实例、绑定事件等只需要执行一次的操作。
    */
    panel.on('init', function () {

        var tid = null;

        function change(item) {
            Object.assign(current, item);

            //把短时间内的多次 change 合并成一次对外触发。
            clearTimeout(tid);

            tid = setTimeout(function () {
                var data = Object.assign({}, current);

                panel.fire('change', [data]);

            }, 100);
        }

        Type.on({
            'change': function (type) {
                change({'type': type, });
            },
        });


        Dates.on({
            'change': function (item) {
                change(item);
            },
        });

        Name.on({
            'change': function (name) {
                change({ 'name': name, });
            },
        });

        Dir.on({
            'change': function (checked) {
                change({'dir': checked, });
            },
        });


    });



    /**
    * 渲染时触发。
    * 即外界显式调用 render() 时触发，且每次调用都会触发一次。
    * 外界传进来的参数会原样传到这里。
    */
    panel.on('render', function (types) {


        Type.render(types);
        Dates.render();
        Name.render();
        Dir.render();


    });



});



