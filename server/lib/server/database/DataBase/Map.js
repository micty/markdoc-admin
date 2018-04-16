/**
* 
*/
define('DataBase/Map', function (require, module, exports) {
    
    var File = require('File');


    return {
        //初始化记录映射表文件。
        init: function (file) {

            if (!File.exists(file)) {
                File.writeJSON(file, {});
            }
        },
    };

});





