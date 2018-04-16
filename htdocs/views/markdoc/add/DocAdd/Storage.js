

define('/DocAdd/Storage', function (require, module, exports) {

    var KISP = require('KISP');
    var SessionStorage = KISP.require('SessionStorage');

    var storage = new SessionStorage(module.id);
    var key = 'cache';


    return {
        set: function (value) {
            storage.set(key, value);
        },

        get: function () {
            var value = storage.get(key);
            return value || '';

        },
    };


});
