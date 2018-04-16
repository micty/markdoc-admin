

KISP.panel('/Master/Sidebar', function (require, module, panel) {
    var KISP = require('KISP');
    var $ = require('$');
    var Package = KISP.require('Package');

    var Header = module.require('Header');
    var List = module.require('List');
    var name = 'data.Sidebar';


    panel.on('init', function () {

        Header.on({
            'toggle': function () {
                panel.fire('toggle');
            },
        });

        List.on({
            'item': function (item) {
                panel.fire('item', [item]);
            },
        });

      
    });





    panel.on('render', function () {

        Package.load(name, function () {
            var list = require(name);

            Header.render();
            List.render(list);

            panel.fire('render', []);
        });

    });




    return {
        'active': List.active,
        'get': List.get,
    };

});