

KISP.panel('/FileList/Sidebar/Operation', function (require, module, panel) {
    var KISP = require('KISP');
    var $Date = KISP.require('Date');
    var JSON = KISP.require('JSON');


    panel.on('init', function () {
        panel.$.on('click', 'button', function () {
            var cmd = this.getAttribute('data-cmd');
           
            panel.fire('cmd', [cmd]);
        });
    });




    panel.on('render', function (options) {
        var item = options.item; //菜单树中的 item。
        var detail = options.detail;
        var cssClass = !item.parent ? 'root' : item.data.type;

        var isJSON = detail.type == 'file' && detail.ext.toLowerCase() == '.json';
        var isSideMenu = false; //尝试判断是否可以作为 sidebar 菜单列表。
        var isTopMenu = false;  //

        if (isJSON) {
            var json = JSON.parse(detail.content);

            isSideMenu = json && Array.isArray(json.groups);
            isTopMenu = json && json.header && Array.isArray(json.header.menus);
        }


        panel.$.removeClass('root dir file').addClass(cssClass);
        panel.$.toggleClass('image', !!detail.isImage);
        panel.$.toggleClass('side-menu', !!isSideMenu);
        panel.$.toggleClass('top-menu', !!isTopMenu);



    });





});
