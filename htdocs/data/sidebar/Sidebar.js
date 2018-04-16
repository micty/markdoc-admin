

define('data.Sidebar', function (require, module, exports) {
    var KISP = require('KISP');

    var list = [
        { name: '文件资源管理', icon: 'folder-open', view: 'FileList', },
        { name: '顶部菜单管理', icon: 'heading', view: 'TopMenus', },
        { name: '侧边菜单管理', icon: 'list', view: 'SideMenus', },
        //{ name: '页头管理', icon: 'truck', view: '', },
        //{ name: '页脚管理', icon: 'credit-card', view: '', },
        //{ name: '文档管理', icon: 'th-large', view: 'DocList', },
        { name: '写文档', icon: 'edit', view: 'DocAdd', },
        { name: '帮助手册', icon: 'question-circle', view: 'DocHelp', },

        //{ name: '菜单树', icon: 'credit-card', view: 'MenuTree.demo', },


    ];


    return list;


});
