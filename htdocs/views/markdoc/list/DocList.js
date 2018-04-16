
KISP.view('/DocList', function (require, module, view) {
    var KISP = require('KISP');
    var API = module.require('API');
    var GridView = module.require('GridView');
  


    view.on('init', function () {
        
        API.on('success', {
            'get': function (data) {

                GridView.render(data);

            },
            'delete': function () {
                API.get({
                    'pageNo': 1,
                    'pageSize': 20,
                });
            },
        });

        GridView.on({
            'change': function (no, size) {
                API.get({
                    'pageNo': no,
                    'pageSize': size,
                });
            },
            'edit': function (item) {
                view.fire('edit', [item]);
            },

            'delete': function (item) {
                API.delete(item.id);
            },

        });
    });


    /**
    * 渲染内容。
    */
    view.on('render', function () {

        API.get({
            'pageNo': 1,
            'pageSize': 20,
        });

    });



});
