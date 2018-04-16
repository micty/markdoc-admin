/**
* 
*/
define('DataBase/Refer', function (require, module, exports) {
    
    var File = require('File');


    return {
        init: function (file, fields) {

            //初始化外键所关联的子节点文件。
            var all = File.exists(file) ? File.readJSON(file) || {} : {};

            fields.forEach(function (field) {
                var name = field.name;

                if (field.refer) {
                    all[name] = all[name] || {}; //初始化容器。
                }
                else {
                    delete all[name];
                }
            });

            File.writeJSON(file, all);
        },
    };

});





