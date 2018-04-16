

KISP.panel('/SideMenus/Main/Header/Path', function (require, module, panel) {

    var KISP = require('KISP');
    var $String = KISP.require('String');
    var $file = panel.$.find('[data-id="file"]');


    panel.on('init', function () {

        panel.$.on('click', '[data-cmd]', function (event) {
            var cmd = this.getAttribute('data-cmd');

            panel.fire(cmd);

        });


    });




    /**
    * 渲染。
    *   options = {
    *       file: '',
    *       mode: 'edit' | 'new',
    *   };
    */
    panel.on('render', function (options) {
        var file = options.file;
        var isEdit = options.mode == 'edit';

        panel.$.toggleClass('edit-mode', isEdit);

        $file.attr({
            'disabled': isEdit,
            'title': '这是一个已存在的文件，不允许编辑其路径。',
        });

        $file.val(file);

    });


    return {
        get: function () {
            var file = $file.val();

            if (!file) {
                $file.focus();
                return;
            }

            file = file.replace(/\\/g, '/'); //把所有的 '\' 替换成 '/'。

            if (file.includes('../')) {
                KISP.alert('不能引用到父目录中去', function () {
                    $file.focus();
                });

                return;
            }

            if (file.includes('./')) {
                KISP.alert('不能使用相对路径', function () {
                    $file.focus();
                });

                return;
            }

            if (file.startsWith('.')) {
                KISP.alert('文件路径非法', function () {
                    $file.focus();
                });

                return;
            }

            return file;
        },
    };

});