

define('/DocAdd/Editor/File', function (require, module, exports) {
    var KISP = require('KISP');
    var File = require('File');
    var $Date = KISP.require('Date');
    var $String = KISP.require('String');

    var loading = KISP.create('Loading', {
        mask: 0,
    });

    var toast = KISP.create('Toast', {
        duration: 1500,
        mask: 0,
    });



    return {

        /**
        * 上传粘贴板中的文件。
        *   file: File,         //必选，DOM 节点中的 input[type="file"] 元素中获取到的对象。
        *   done: function,     //可选，上传完成后的回调。
        */
        upload: function (file, done) {
            var now = new Date();
            var date = $Date.format(now, 'yyyy-MM-dd');
            var time = $Date.format(now, 'HHmmss');

            var dir = 'upload/paste/' + date + '/';
            var name = time + '-' + $String.random(4) + '.png';


            loading.show('上传中...');


            File.upload({
                'file': file,
                'dir': dir,
                'name': name,

                'done': function (data) {
                    loading.hide();

                    if (!data) {
                        KISP.alert('上传失败');
                        return;
                    }

                    var sample = '![]({dest})';
                    var md = $String.format(sample, data);

                    done && done(md, data);

                },
            });
        },

        /**
        * 
        */
        paste: function () {

        },
    };





});
