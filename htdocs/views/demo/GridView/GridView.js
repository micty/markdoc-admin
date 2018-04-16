
KISP.view('/Demo.GridView', function (require, module, view) {
    var KISP = require('KISP');
    var GridView = require('GridView');

    var gridview = null;

    var all = [];


    view.on('init', function () {


        for (i = 0; i < 1000; i++) {
            all.push({
                'id': (1000 + i) + '',
                'aa': Math.random(),
                'bb': Math.random(),
                'cc': Math.random(),
            });
        }

        ////
        gridview = new GridView({
            container: view.$.find('>div'),
            primaryKey: 'id',
            size: 15,
            no: 2,

            fields: [
                { caption: 'a', name: 'aa', width: 120, class: 'column-a', dragable: false, },
                { caption: 'b', name: 'bb', width: 150, class: 'column-b', },
                { caption: 'c', name: 'cc', width: 140, class: 'column-c', },
            ],

            class: 'test-abc',
            all: all,

        });

        gridview.on('page', {
            'change': function (no, size) {
                console.log(no, size);
            },
        });

    });


    /**
    * 渲染内容。
    */
    view.on('render', function () {
        gridview.render();
    });



});
