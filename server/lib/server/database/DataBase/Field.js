/**
* 
*/
define('DataBase/Field', function (require, module, exports) {
    
    var File = require('File');

    return {
        init: function (file, list) {
            //字段描述列表。 
            if (list) {
                File.writeJSON(file, list);
            }
            else {
                list = File.exists(file) ? File.readJSON(file) || [] : [];
            }

            list.forEach(function (item) {
                item.type = item.type || 'string'; //默认为 string 类型。
            });

            return list;
        },
    };

});





