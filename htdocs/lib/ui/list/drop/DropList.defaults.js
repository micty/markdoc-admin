
define('DropList.defaults', {
    cssClass: 'DropList',
    tableClass: '',
    text: '',
    readonly: false,
    disabled: false,
    custom: false,
    order: false,            //是否自动增加一列作为序号列。
    empty: false,           //是否允许为空。
    mask: 0,
    dialog: document.body,
    columns: [],
    field: null,
    filters: true,
    container: null,

    tabIndex: '',
    maxLength: 0,           //0 表示不限制。
});

