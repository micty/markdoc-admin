

KISP.panel('/DocAdd/Header', function (require, module, panel) {
    var KISP = require('KISP');
    var Table = module.require('Table');

    var $name = panel.$.find('[data-id="name"]');


    panel.on('init', function () {
        
        panel.$.on('click', '[data-cmd]', function (event) {
            var cmd = this.getAttribute('data-cmd');

            //针对 editor 的。
            if (cmd.startsWith('editor=')) {
                cmd = cmd.split('=')[1];
                panel.fire('editor', [cmd]);
            }
            else {
                panel.fire(cmd);
            }


        });

        panel.$.on('click', '[data-id="table"]', function () {
            Table.render();
        });


        Table.on({
            'add': function (data) {
                panel.fire('table', [data]);
            },
        });


        panel.$.on('click', '[data-id="outline"]', function () {
            panel.fire('outline', []);

        });


       
      
    });



    /**
    * 渲染。
    *   options = {
    *       id: '',     //文件 id。
    *       mode: '',   //模式，只能是 `edit` 或 `new`,
    *   };
    */
    panel.on('render', function (options) {
        var opt = options || {
            id: '',
            mode: 'new',
        };

        var isEdit = opt.mode == 'edit';
        var id = opt.id;
     
        $name.val(id);

        $name.attr({
            'disabled': isEdit,
            'title': isEdit ? '这是一个已存在的文件，不允许编辑其路径。' : '',
        });

        panel.$.toggleClass('edit-mode', isEdit);

    });


    return {
        get: function () {
            var name = $name.val();

            if (!name) {
                $name.focus();
                return;
            }

            function error(msg) {
                KISP.alert(msg, function () {
                    $name.focus();
                });
            }



            var file = name.replace(/\\/g, '/'); //把所有的 '\' 替换成 '/'。

            if (file.includes('../')) {
                return error('不能引用到父目录中去。');
            }

            if (file.includes('./')) {
                return error('不能使用相对路径。');
            }

            if (file.startsWith('.')) {
                return error('文件路径非法。');
            }

            if (!file.includes('.')) {
                return error('文件名必须包含后缀名。');
            }

            if( file.includes('..') ||
                file.includes(':') ||
                file.includes('*') ||
                file.includes('?') ||
                file.includes('"') ||
                file.includes('<') ||
                file.includes('>') ||
                file.includes('|') ||
                file.includes('//') ||
                file.includes(' ') ||
                file.includes('./')) {

                return error('文件路径非法。');
            }

            var allows = [
                '.md',
                '.txt',
                '.json',
                '.js',
                '.css',
                '.html',
            ];

            var ext = file.split('.').slice(-1)[0];
            ext = '.' + ext.toLowerCase();

            if (!allows.includes(ext)) {
                return error('不能使用后缀名: ' + ext);
            }


            return file;
        },
    };


});
