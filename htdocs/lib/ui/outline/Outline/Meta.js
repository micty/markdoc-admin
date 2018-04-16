
/**
* 
*/
define('Outline/Meta', function (require, module, exports) {
    var $ = require('$');
    var $String = KISP.require('String');


    return {

        create: function (config, others) {
           
            var meta = {
                'id': $String.random(),         //实例 id。
                'container': config.container,
                'this': null,                   //方便内部引用自身的实例。
                'emitter': null,                //事件驱动器。
                '$': null,                      //$(container);
                'tpl': null,                    //模板 Template 实例。
                'list': null,                   //当前填充的列表数据 []。
            };


            Object.assign(meta, others);
           

            return meta;
           
        },

    };
    
});


