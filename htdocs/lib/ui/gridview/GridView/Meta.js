
/**
* 
*/
define('GridView/Meta', function (require, module, exports) {
    var $ = require('$');
    var KISP = require('KISP');
    var Emitter = KISP.require('Emitter');
    var $Array = KISP.require('Array');
    var $String = KISP.require('String');
    var $Object = KISP.require('Object');



    return {
        /**
        * 
        */
        create: function (config, others) {
            //全部列表数据数组。 如果指定该字段，则在组件内部进行分页。
            var all = config.all; 
            var total = all ? all.length : config.total;

            var meta = {
                //dom 节点中用到的 id，方便快速获取对应的 dom 节点。
                //一旦生成后，不会再变。 采用随机 id，可防止 id 冲突。
                'id': $String.random(),
                'pagerId': $String.random(),
                'tableId': $String.random(),
                'headerId': $String.random(),
                'counterId': $String.random(),
                'countId': $String.random(),
                'checkAllId': $String.random(),

                '$': null,              //jQuery 实例 $(container)。
                'table': null,          //Table 组件实例
                'pager': null,          //Pager 组件实例。
                'tpl': null,            //Template 组件实例。
                'resizer': null,        //Resizer 组件实例。
                'checkItem': null,      //是一个函数。 这里先占位。
                'checkAll': null,       //是一个函数。 这里先占位。

                'all': all,             //全部列表数据数组。 如果指定该字段，则在组件内部进行分页。
                'total': total,         //总记录数。 用于计算分页。

                'container': config.container,      //容器。
                'class': config.class,              //


                'no': config.no,                    //当前的页码。
                'size': config.size,                //正常模式下的分页大小。
                'sizes': config.sizes,              //可供选择的页码列表。

                'check': config.check,              //是否启用复选框列。 可以指定为 true 或一个 {} 配置。
                'order': config.order,              //是否启用序号列。 可以指定为 true 或一个 {} 配置。
                'primaryKey': config.primaryKey,    //主键的键名。 如 `id`。
                'footer': !!config.footer,          //是否显示 footer。 确保是一个 boolean。

                'list': [],                         //当前填充到 UI 中的数据。
                'oldList': null,                    //用于切换到已选模式之前，备份 meta.list 的数据，以便用于切换回正常模式。
                'selectedMode': false,              //表示是否处于已选模式，如果是，则列表中显示的是已选的数据。

                //选中的信息。
                'current': {
                    'list': [],         //记录选中的项的 id 集合。
                    'id$item': {},      //记录选中的项的 id 与 项的关系。
                },




            };

            Object.assign(meta, others);

            return meta;
           
        },


    };
    
});


