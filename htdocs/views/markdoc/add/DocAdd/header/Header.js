

KISP.panel('/DocAdd/Header', function (require, module, panel) {
    var KISP = require('KISP');
    var $Date = KISP.require('Date');
    var Table = module.require('Table');
    var Validater = module.require('Validater');

    var $name = panel.$.find('[data-id="name"]');

    panel.on('init', function () {
        
        panel.$.on('click', '[data-cmd]', function (event) {
            var cmd = this.getAttribute('data-cmd');

            //针对 editor 的。
            if (cmd.startsWith('editor=')) {
                cmd = cmd.split('=')[1];
                panel.fire('editor', [cmd]);
                return;
            }
           

            var $this = $(this);
            var type = this.getAttribute('data-type');
            var args = [];

            //针对 data-type="on" 的。
            if (type == 'on') {
                $this.toggleClass('on');

                var on = $this.hasClass('on');
                args.push(on);
            }

            panel.fire(cmd, args);


        });

        panel.$.on('click', '[data-id="table"]', function () {
            Table.render();
        });


        panel.$.on('click', '[data-id="demo"]', function () {
            var file = $name.val();
            panel.fire('demo', [file]);
        });

        panel.$.on('click', '[data-id="outline"]', function () {
            panel.fire('outline', []);
        });
    

        Table.on({
            'add': function (data) {
                panel.fire('table', [data]);
            },
        });

      
    });



    /**
    * 渲染。
    *   options = {
    *       id: '',     //文件 id。
    *       mode: '',   //模式，只能是 `edit` 或 `new`,
    *       ext: '',    //可选，后缀名。 主要针对 json 文件显示相应的按钮。
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
        panel.$.toggleClass('json', opt.ext == '.json');

    });


    return {
        saved: function (saved) {
            if (saved === null) {
                panel.$.find('[data-id="saved"] span').html('已保存');
                panel.$.addClass('saved');
                return;
            }

            if (saved) {
                var time = $Date.format(new Date(), 'HH:mm:ss');
                panel.$.addClass('saved');
                panel.$.find('[data-id="saved"] span').html('已保存 [' + time + ']');
            }
            else {
                panel.$.removeClass('saved');
            }
        },

        get: function () {
            return Validater.check($name);
        },
    };


});
