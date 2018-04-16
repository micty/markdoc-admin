

define('TableResizer.v2/Fields', function (require, module) {

    var $ = require('$');
    var Template = KISP.require('Template');
    var $Array = KISP.require('Array');
    var $String = KISP.require('String');



    return {
        normalize: function (list) {
            list = list.map(function (field, index) {
                field = Object.assign({}, field); //��ȫ����������ʵ���л���Ӱ�졣

                var visible = ('visible' in field) ? field.visible : true;  //�����ָ����Ĭ��Ϊ true��
                var width = visible ? field.width || 0 : 0;

                field.visible = !!visible;
                field.dragable = field.dragable === false ? false : true; //ֻ����ʽָ����Ϊ false �Ž��á�

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

