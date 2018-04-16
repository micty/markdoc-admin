

KISP.panel('/FileList/Dialog/Content', function (require, module, panel) {

    var KISP = require('KISP');
    var File = module.require('File');;
    var $name = null;


    panel.on('init', function () {

        panel.template({
            '': function (data) {
                var names = this.fill('names', data);
                var isAdd = data.cmd == 'add';
                var types = isAdd ? this.fill('types', {}) : '';

                return {
                    'names': names,
                    'types': types,
                };
            },

            'names': function (data) {
                var item = data.item;
                var parent = item.parent;

                if (data.cmd == 'add') {
                    return {
                        'parent': !item.parent ? '' : item.id + '/',
                        'name': '',
                    };
                }

                return {
                    'parent': !parent.parent ? '' : parent.id,
                    'name': item.name,
                };
            },

            'types': function () {
                return {};
            },

        });

        File.on({
            'change': function (file) {
                panel.fire('select', [file]);
                $name.val(file.name);
            },
        });


        panel.$.on('click', '[type="radio"]', function () {
            var type = this.value;
            var isFile = type == 'file';

            File.toggle(isFile);
            panel.fire('type', [type]);

        });

      
        
    });

    panel.on('render', function (data) {
        panel.fill(data);

        File.render();

        $name = panel.$.find('[data-id="name"]');
        $name.focus();

    });



    return{
        get: function () {
            var name = $name.val().replace(/\\/g, '/'); //把 `\` 统一换成 `/`，以方便处理。
            var type = panel.$.find('[type="radio"]:checked').val();

            name = File.check(name);

            if (!name) {
                $name.focus();
                $name.addClass('warn');
                $name.get(0).select();

                setTimeout(function () {
                    $name.removeClass('warn');
                }, 100);

                return;
            }

            return {
                'name': name,
                'type': type,
            };
        },
    }

});






