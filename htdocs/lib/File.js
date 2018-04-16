

define('File', function (require, module, exports) {
    var KISP = require('KISP');
    var Query = KISP.require('Query');

    var host = KISP.config('API').url;
    var uri = host + 'upload';
    var noop = function () { };





    return {
        /**
        * 上传文件。
        *   options = {
        *       file: File,         //必选，DOM 节点中的 input[type="file"] 元素中获取到的对象。
        *       dir: '',            //可选，要存储的目录名。 如 `a/b/c/`，必须以 `/` 结束。
        *       name: '',           //可选，文件名。 如果不指定，则使用原始文件名。
        *       done: function,     //可选，上传完成后的回调。
        *   };
        */
        upload: function (options) {
            var User = require('User');
            var token = User.get('token');

            var url = Query.add(uri, 'token', token);
            var dir = options.dir || '';
            var file = options.file;
            var name = options.name || file.name; //如果不指定，则使用原始文件名。
            var dest = dir ? dir + '/' + name : name;
            var done = options.done || noop;

            var xhr = new XMLHttpRequest();
            var form = new FormData();
          

            form.append('file', file);
            form.append('name', dest);

            xhr.open('post', url, true);


            //上传进度。  
            xhr.upload.addEventListener('progress', function (result) {
                if (!result.lengthComputable) {
                    return;
                }

                var percent = result.loaded / result.total * 100;

                percent = percent.toFixed(2);

                console.log(percent + '%');

            }, false);


            //状态变化。
            xhr.addEventListener("readystatechange", function() {  
               
                //进行中。
                if (xhr.readyState != 4) {
                    return;
                }

                //已完成。
                if (xhr.status != 200) {
                    return done();
                }

                var json = JSON.parse(xhr.response) || {};
                var data = json.code == 200 ? json.data : null;


                //在前端增加一个字段给业务层。
                if (data) {
                    data.host = host;
                }

                done(data);
               
            });

            xhr.send(form); //开始上传  

        },

        /**
        * 获取文件大小的描述。
        */
        getSizeDesc: function (size) {
            if (!size) {
                return { 'value': 0, 'desc': '', };
            }

            if (size < 1024) {
                return { 'value': size, 'desc': 'B', };
            }

            size = size / 1024; //KB

            if (size < 1024) {
                size = Math.ceil(size);
                return { 'value': size, 'desc': 'KB', };
            }


            size = size / 1024; //MB

            if (size < 1024) {
                size = size.toFixed(2);

                if (size.endsWith('0')) { //如 19.x0
                    size = size.slice(0, -1);
                }

                if (size.endsWith('0')) { //如 19.0
                    size = size.slice(0, -2);
                }

                return { 'value': size, 'desc': 'MB', };
            }



            size = size / 1024; //GB

            size = size.toFixed(2);

            if (size.endsWith('0')) { //如 19.x0
                size = size.slice(0, -1);
            }

            if (size.endsWith('0')) { //如 19.0
                size = size.slice(0, -2);
            }


            return { 'value': size, 'desc': 'GB', };

        },

    };

});






