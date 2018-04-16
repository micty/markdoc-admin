


define('FileList/Uploader', function (require, module, exports) {
    var $ = require('$');
    var Directory = require('Directory');
    var File = require('File');
    var Path = require('Path');
    var fs = require('fs');
    
    var multer = require("multer");



    return {

        /**
        * 创建一个上传器。
        *   options = {
        *       dir: '',
        *       
        *   };
        */
        create: function (options) {

            var dir = options.dir;

            var storage = multer.diskStorage({

                'destination': function (req, file, done) {
                    done(null, dir);
                },

                'filename': function (req, file, done) {

                    var name = req.body.name || file.originalname;

                    done(null, name);

                },
            })


            var uploader = multer({
                'storage': storage,
            });

            return uploader;

        },


   

    };

    
});
