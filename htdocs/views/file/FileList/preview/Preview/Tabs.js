

KISP.panel('/FileList/Preview/Tabs', function (require, module, panel) {
    var KISP = require('KISP');
    var $String = KISP.require('String');


    var list = [
        { name: '预览', type: 'preview', },
        { name: '源码', type: 'source', },
    ];

    var currentIndex = 0;
    var tabs = null;


    panel.on('init', function () {
        tabs = KISP.create('Tabs', {
            container: panel.$.get(0),
            activedClass: 'on',
            eventName: 'click',
            selector: '>li',
            repeated: true, //这里要允许重复激活相同的项。
        });


        tabs.on('change', function (item, index) {
            currentIndex = index;
            item = list[index];
            panel.fire('change', [item.type]);
        });

       
    });

    /**
    * 渲染。
    */
    panel.on('render', function (index) {
        tabs.render(list, function (item, index) {
            return {
                'index': index,
                'name': item.name,
            };
        });

        if (typeof index == 'number') {
            currentIndex = index;
        }
        else {
            index = currentIndex;
        }

        tabs.active(index);

    });


});