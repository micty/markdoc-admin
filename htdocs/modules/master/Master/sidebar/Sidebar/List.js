

KISP.panel('/Master/Sidebar/List', function (require, module, panel) {
    var KISP = require('KISP');
    var $ = require('$');
    var $String = KISP.require('String');
    var Template = KISP.require('Template');

    var list = [];
    var tabs = null;

    panel.on('init', function () {

        tabs = KISP.create('Tabs', {
            container: panel.$,
            selector: '>li',
            activedClass: 'on',
        });

      
        panel.$.on('click', '[data-index]', function () {
            var li = this;
            var index = +li.getAttribute('data-index');
            var item = list[index];

            tabs.active(index);

            panel.fire('item', [item]);

        });

    });




    panel.on('render', function (data) {

        list = data;


        panel.fill(list, function (item, index) {
            item.id = item.view;    //这里以 view 作为 id，需要具有唯一性。
            item.index = index;


            return {
                'index': index,
                'name': item.name,
                'icon': item.icon,
                'class': item.border ? 'group' : '',
            };
        });


    });



    


    return {
        active: function (item) {
            var index = item.index;

            if (typeof index != 'number') {
                index = -1;
            }

            tabs.active(index);
        },

        get: function (view) {
            var item = list.find(function (item, index) {
                return item.view === view;
            });

            return item;
        },

    };

});