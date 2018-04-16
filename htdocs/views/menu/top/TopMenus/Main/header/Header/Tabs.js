

KISP.panel('/TopMenus/Main/Header/Tabs', function (require, module, panel) {

    var KISP = require('KISP');
    var $String = KISP.require('String');


    var list = [
        { name: '向导视图', cmd: 'guide', class: '', icon: 'eye', },
        { name: '源码视图', cmd: 'code', class: '', icon: 'code', },
        { name: '保存', cmd: 'save', class: 'save', icon: 'save', },
    ];

    var tabs = null;



    panel.on('init', function () {
        tabs = KISP.create('Tabs', {
            container: panel.$.get(0),
            activedClass: 'on',
            eventName: 'click',
            selector: '>li:lt(' + (list.length - 1) + ')', //排除最后一个 `保存`。
        });

        tabs.on('change', function (item, index) {
            item = list[index];
            panel.fire('cmd', [item.cmd]);
        });

        panel.$.on('click', '[data-index]', function () {
            var index = +this.getAttribute('data-index');
            var item = list[index];
            var cmd = item.cmd;

            if (cmd == 'save') {
                panel.fire('cmd', [cmd]);
            }

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
                'icon': item.icon,
                'class': item.class,
            };
        });


        tabs.active(index);

    });


});