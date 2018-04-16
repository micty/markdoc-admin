

KISP.panel('/TopMenus/Main/Guide/Footer/Menus', function (require, module, panel) {

    var KISP = require('KISP');
    

    var list = [
        { text: '添加', class: 'add', icon: 'plus', cmd: 'add', },
        { text: '更新', class: '', icon: 'save', cmd: 'update', },
        { text: '删除', class: 'delete', icon: 'remove', cmd: 'delete', },
        { text: '上移', class: '', icon: 'angle-up', cmd: 'move', args: [-1], },
        { text: '下移', class: '', icon: 'angle-down', cmd: 'move', args: [1], },
    ];


    panel.on('init', function () {
        panel.$.on('click', '>li', function (event) {
            var index = this.getAttribute('data-index');
            var item = list[index];

            panel.fire('cmd', [item]);

        });
    });

    /**
    * 渲染。
    */
    panel.on('render', function () {

        panel.fill(list, function (item, index) {

            return {
                'index': index,
                'text': item.text,
                'class': item.class || '',
                'icon': item.icon,
            };
        });

    });


});