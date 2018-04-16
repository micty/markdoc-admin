
KISP.view('/MenuTree.demo', function (require, module, view) {

    var KISP = require('KISP');


    view.on('init', function () {

    });




    view.on('render', function () {
    
        var MenuTree = require('MenuTree.v2');
        var list = require('data.demo.MenuTree');

        var tree = new MenuTree({
            'container': view.$.find('[data-id="ctn"]'),
        });

        tree.on({
            'fill': function (list) {
                console.log(list);
            },

            //点击某一项时触发。
            'item': function (item) {
                console.log(item);
            },

            //展开复合节点时触发。
            'open': function (item) {
                console.log(item);
            },

            //关闭复合节点时触发。
            'close': function (item) {
                console.log(item);
            },

            'icon': function (icon, item) {
                console.log(icon, item);
            },
        });

        tree.render(list);


        var count = 0;

        //双击。
        $(document.body).on('dblclick', function () {
           
            view.fire('title', ['标题-' + (++count) ]);


            var node = {
                name: 'test-abc',
                id: 'test-abc',
                //open: true,
                list: [
                    { name: 'aaa', },
                    { name: 'bbb', },
                    { name: 'ccc', },

                    {
                        name: 'dir',
                        id: 'dir',
                        open: true,
                        list: [
                            { name: 'file', id: 'file', },
                            { name: '222', },
                        ],

                    }
                ],

            };

            tree.insert(node, 'test-item');


            setTimeout(function () {
                tree.close('test-abc');

                setTimeout(function () {
                    tree.open('file');

                }, 2000);

            }, 2000);

           
        });




    });


    


});