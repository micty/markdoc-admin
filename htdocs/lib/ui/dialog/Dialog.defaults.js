
define('Dialog.defaults', {
    cssClass: '',

    /**
    * 是否启用 mask 层。
    */
    mask: true,

    /**
    * 组件的标题文本。
    */
    title: '',

    /**
    * 组件的内容文本。
    */
    content: '',

    /**
    * 组件宽度（单位为像素）。
    */
    width: 0,

    /**
    * 组件高度（单位为像素）。
    */
    height: 0,

    'z-index': 1024,

    maxWidth: 0,
    maxHeight: 0,

    minWidth: 200,
    minHeight: 160,

    dragable: true,
    resizable: true,

    autoClose: true, //点击底部任一按钮时自动关闭组件。

    attributes: {},

    footer: {
        content: '',
        buttons: [],
    },
});

