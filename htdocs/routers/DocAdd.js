KISP.route('DocAdd', function (require, module) {
    var KISP = require('KISP');
    var $String = KISP.require('String');

    return {
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
