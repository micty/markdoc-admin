
KISP.panel('/Home/Inform/Main/API/ShowMsg/Content', function (require, module, panel) {
    var KISP = require('KISP');
    var $ = require('$');
    var TableResizer = require('TableResizer');
    var Template = KISP.require('Template');
    panel.on('init', function () {


        panel.template({
            '': function (group, no) {
                var html = this.fill('content', group.item);
                return html;
            },

            'content':{
                '': function (item) {
                    return {
                        'message': item.details,
                        'status':item.result == 1 ? 'true' : 'false',
                    };
                },
            },
        });


    });

    panel.on('render', function (data) {
        panel.fill({'item':data});
    });

});