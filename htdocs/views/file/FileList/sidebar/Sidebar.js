

KISP.panel('/FileList/Sidebar', function (require, module, panel) {
    var KISP = require('KISP');
    var $String = KISP.require('String');

    var Stat = module.require('Stat');
    var Operation = module.require('Operation');
    var Outline = module.require('Outline');
    var Tabs = module.require('Tabs');




    panel.on('init', function () {
        
        Tabs.on({
            'general': function () {
                Stat.show();
                Operation.show();
                Outline.hide();
            },

            'outline': function () {
                Stat.hide();
                Operation.hide();

                Outline.show();
            },

        });

        Operation.on({
            'cmd': function (cmd) {
                panel.fire('operation', cmd);
            },
        });

        Outline.on({
            'item': function (item, index) {
                panel.fire('outline', [item, index]);
            },
        });

     
       
    });



    /**
    * 渲染。
    */
    panel.on('render', function (data) {

        console.log(data);

        var detail = data.detail;
        var hasOutline = data.item.data.type == 'file' && !detail.isImage;

        Stat.render(detail);
        Operation.render(data);


        Tabs.render({
            'outline': hasOutline,
        });


    });

    return {
        outline: function (titles) {
            Outline.render(titles);
        },
    };


});