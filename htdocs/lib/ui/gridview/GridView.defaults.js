
define('GridView.defaults', {
    size: 20,
    all: null,          //全部列表数据数组。 如果指定该字段，则在组件内部进行分页。
  
    class: '',
    primaryKey: 'id',
    footer: true,       //是否显示 footer。

    sizes: [10, 20, 30, 40, 50],//可供选择的分页大小列表。

    check: {
        name: 'check',
        width: 43,
        class: 'check',
        dragable: false,
    },

    order: {
        name: 'order',
        width: 50,
        caption: '序号',
        global: true,       //true: 使用全局序号，即跟分页无关。 false: 使用局部序号，即每页的序号都是从 1 开始。
        dragable: true,
        class: 'order',
    },
});

