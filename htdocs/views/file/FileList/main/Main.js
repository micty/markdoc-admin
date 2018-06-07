
KISP.panel('/FileList/Main', function (require, module, panel) {
    var KISP = require('KISP');
    var Filter = module.require('Filter');
    var GridView = module.require('GridView');
    var List = module.require('List');

 

    var width = 638;

    var meta = {
        'list': [],
        'item': null,
    };



    panel.on('init', function () {
       
        Filter.on({
            'change': function (filter) {
                var id = filter.dir ? meta.item.id : false;

                filter = Object.assign({}, filter, {
                    'dir': id,
                });

                console.log(filter)

                items = List.filter(meta.list, filter);

                GridView.render(items, { 'keyword': filter.name });;

            },
        });

        GridView.on({
            'item': function (item) {
                panel.fire('item', [item]);
            },
        });

    });


    /**
    * 渲染内容。
    *   options = {
    *       list:  [],  //文件列表。
    *       item: {},   //当前菜单项。
    *   };
    */
    panel.on('render', function (options) {
        var list = meta.list = options.list;
        var types = List.getTypes(list);

        meta.item = options.item;
        Filter.render(types);


    });




    return {
        resize: function (dx) {
            if (dx === true) {
                width = panel.$.get(0).style.width;
                width = width.slice(12, -3);
                width = Number(width);
                return;
            }


            var w = width + dx;
            var calc = 'calc(100% - ' + w + 'px)';

            panel.$.css({
                'width': calc,
            });
           
        },
    };

});
