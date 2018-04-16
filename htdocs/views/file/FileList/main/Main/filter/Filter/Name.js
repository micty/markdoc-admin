
/*
* 
*/
KISP.panel('/FileList/Main/Filter/Name', function (require, module, panel) {
    var KISP = require('KISP');
  
  
    /**
    * 初始化时触发。
    * 即首次 render 之前触发，且仅触发一次。
    * 适用于创建实例、绑定事件等只需要执行一次的操作。
    */
    panel.on('init', function () {
       

        panel.$.on('input', 'input', function () {
            console.log(this.value);

            panel.fire('change', [this.value]);
        });

    });



    /**
    * 渲染时触发。
    * 即外界显式调用 render() 时触发，且每次调用都会触发一次。
    * 外界传进来的参数会原样传到这里。
    */
    panel.on('render', function () {


    });




});



