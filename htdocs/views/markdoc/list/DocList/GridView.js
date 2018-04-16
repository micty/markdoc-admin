
KISP.panel('/DocList/GridView', function (require, module, panel) {
    var KISP = require('KISP');
    var GridView = require('GridView');

    var gridview = null;
    var tpl = panel.template();

    panel.on('init', function () {
        gridview = new GridView({
            container: panel.$,
            primaryKey: 'id',
            check: true,
            order: true,
            class: '',

            fields: [
                { caption: '标题', name: 'title', width: 400, class: 'title', dragable: true, delegate: '[data-cmd]', },
                { caption: '文件', name: 'file', width: 200, class: 'file', dragable: true, },
                { caption: '指纹', name: 'md5', width: 300, class: 'md5', dragable: true, },
                { caption: '大小', name: 'size', width: 100, class: 'size', dragable: true, },
                { caption: '操作', name: 'operation', width: 300, class: 'operation', dragable: true, delegate: '[data-cmd]', },
            ],


        });

        gridview.on('page', {
            'change': function (no, size) {
                console.log(no, size);

                panel.fire('change', [no, size]);
            },
        });

        gridview.on('process', {
            'cell': {
                '': function (cell) {
                },

                'title': function (cell) {
                    var html = tpl.fill('title', {
                        'title': cell.row.data.title,
                    });

                    return html;
                },
                'operation': function (cell) {
                    var html = tpl.fill('operation', {});

                    return html;
                },
            },

        });

        gridview.on('click', {
            '': function () {

            },

            'row': function () {

            },

            'cell': {
                '': function () {

                },
                'title': {
                    '[data-cmd]': function (cell, event, target) {
                        var item = cell.row.data;
                        panel.fire('edit', [item]);
                    },
                },
                'operation': {
                    '': function (cell, event) {

                    },

                    '[data-cmd]': function (cell, event, target) {
                        var cmd = target.getAttribute('data-cmd');
                        var item = cell.row.data;
                        panel.fire(cmd, [item]);
                    },
                },
                
            },

        });



        gridview.render();


    });


    /**
    * 渲染内容。
    */
    panel.on('render', function (data) {
        gridview.set(data);
        gridview.fill(data.list);

    });



});
