

define('TableResizer.v2/Fields', function (require, module) {

    var $ = require('$');
    var Template = KISP.require('Template');
    var $Array = KISP.require('Array');
    var $String = KISP.require('String');



    return {
        normalize: function (list) {
            list = list.map(function (field, index) {
                field = Object.assign({}, field); //安全起见，避免多实例中互相影响。

                var visible = ('visible' in field) ? field.visible : true;  //如果不指定则默认为 true。
                var width = visible ? field.width || 0 : 0;

                field.visible = !!visible;
                field.dragable = field.dragable === false ? false : true; //只有显式指定了为 false 才禁用。

                field.width = field.width || 0;

                return field;

            });

            return list;
        },

        sum: function (list) {
            var sum = 0;

            list = list.map(function (field, index) {
                if (!field.visible) {
                    return;
                }

                sum += field.width;
            });

            return sum;
        },

    };

});

