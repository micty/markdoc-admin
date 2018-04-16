

KISP.panel('/FileList/Dialog/Content/File', function (require, module, panel) {

    var KISP = require('KISP');

    panel.on('init', function () {

        panel.$.on('change', '[type="file"]', function () {

            var file = this.files[0];

            console.log('change', this.value);
            console.log(file);

            panel.fire('change', [file]);
        });
       

        
    });

    panel.on('render', function (data) {
       

    });




    return {

        /***/
        render: function (data) {
            console.log(data);

            panel.set('$'); //更新容器。
            panel.set('rendered', false); //可以再次触发 init。
            panel.render(data);
            panel.hide(); //
        },

        /**
        * 检查指定的文件名是否合法。
        */
        check: function (value) {
            value = value.replace(/\\/g, '/'); //把 `\` 统一换成 `/`，以方便处理。

            var invalid =
                !value ||
                value == '.' ||
                value.includes('..') ||
                value.includes(':') ||
                value.includes('*') ||
                value.includes('?') ||
                value.includes('"') ||
                value.includes('<') ||
                value.includes('>') ||
                value.includes('|') ||
                value.includes('//') ||
                value.includes(' ') ||
                value.includes('./');


            return invalid ? '' : value;


        },

    };

});






