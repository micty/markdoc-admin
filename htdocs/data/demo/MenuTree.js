

define('data.demo.MenuTree', function (require, module, exports) {

    var icons = [
        { icon: 'edit', },
        { icon: 'delete', },
    ];

    var list = [
        {
            name: '图片',
            list: [
                {
                    name: '照片',
                    list: [
                        {
                            name: '2016年',
                            list: [
                                { name: '1月', },
                                { name: '2月', },
                            ],
                        },
                        {
                            name: '2017年',
                            id: 'test-item',
                            open: true,
                            list: [
                                { name: '1月', },
                                { name: '2月', },
                                { name: '3月', },
                                { name: '4月', },
                            ],
                        },
                    ],
                },
                {
                    name: '截图',
                },
                {
                    name: '原图',
                    list: [
                       { name: '广东省', },
                       { name: '海南省', },
                    ],
                },
            ],
        },
        {
            name: '视频',
            icons: icons,
            list: [
                { name: '自拍视频', },
                { name: '下载电影', },
            ],
        },
        {
            name: '文件A',
            icons: icons,
        },
        {
            name: '文件B',
        },
    ];



    return list;

});