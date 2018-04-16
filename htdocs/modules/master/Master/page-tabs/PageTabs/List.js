

define('/Master/PageTabs/List', function (require, module, exports) {
    var List = require('List');

    var list = new List([
        {
            view: 'Home',
            id: 'Home',
            name: '首页',
            isHome: true,
        },
    ]);

    return list;

});