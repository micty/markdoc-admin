

KISP.panel('/Master/PageList/List', function (require, module, panel) {
    var KISP = require('KISP');
    var $String = KISP.require('String');

    var list = [];
    var tabs = null;

    panel.on('init', function () {
        
        tabs = KISP.create('Tabs', {
            container: panel.$,
            selector: '>li',
            activedClass: 'on',
        });

        panel.$.on('click', '[data-cmd]', function (event) {

            event.stopPropagation();

            var li = this;
            var index = +li.getAttribute('data-index');
            var cmd = li.getAttribute('data-cmd');
            var item = list[index];

            tabs.active(index);
            panel.fire(cmd, [item, index]);

        });
    });




    panel.on('render', function (items) {
        
        list = items;

        panel.fill(list, function (item, index) {

            return {
                'index': index,
                'name': item.name,
            };
        });
       
    });


    return {
        active: function (index) {
            //debugger
            tabs.active(index);
        },
    };


});