
define('DropList/Field', function (require, module, exports) {
    var KISP = require('KISP');
    var $ = require('$');



    function getValue(item, key) {
        return typeof key == 'function' ? key(item) : item[key];
    }




    return {
        map: function (field, list) {
            list = list || [];

            if (!field) {
                return list;
            }


            list = list.map(function (item) {
               
                var id = field.id ? getValue(item, field.id) : '';
                var title = field.title ? getValue(item, field.title) : '';

                return {
                    'id': id,
                    'title': title,
                    'item': item,
                    'disabled': false,
                };
            });

            return list;

        },


    };
});