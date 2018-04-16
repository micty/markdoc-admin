
KISP.route('TopMenus', function (require, module) {
    var KISP = require('KISP');
    var Master = module.require('Master');

    return {
        'file': function (file) {
            Master.open('FileList', [file]);
        },
    };

});
