/**
* 
*/
define('DataBase/List', function (require, module, exports) {
    
    var File = require('File');


    return {
        //初始化索引列表文件。
        init: function (file) {

            if (!File.exists(file)) {
                File.writeJSON(file, []);
            }
        },
    };

});





