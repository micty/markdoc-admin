KISP.route('FileList', function (require, module) {
    var KISP = require('KISP');
    var $String = KISP.require('String');
    var Master = module.require('Master');

    return {
        'edit': function (id) {
            Master.open('DocAdd', '写文档', [{
                'id': id,
            }]);
        },

        'use': function (data) {
            Master.open('DocAdd', '写文档', [{
                'content': data.content,
                'ext': data.ext,
            }]);
        },
        'sidebar': function (file) {

            Master.open('SideMenus', [file]);

        },

        'topmenu': function (file) {

            Master.open('TopMenus', [file]);
        },

        'demo': function (file) {
            var demo = KISP.data('demo');

            var url = $String.format(demo.file, {
                'url': demo.url,
                'file': file,
            });

            window.open(url);
        },
    };

});
