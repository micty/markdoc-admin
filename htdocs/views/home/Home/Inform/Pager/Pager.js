

KISP.panel('/Home/Inform/Pager', function (require, module, panel) {

    var Pager = require('Pager');
    var pager = null;

    panel.on('render', function (page) {

        pager && pager.destroy();

        pager = new Pager({
            container: panel.$.selector, //分页控件的容器
            //min: 2,         //总页数小于该值时，分页器会隐藏。 如果不指定，则一直显示。
            total: page.totalPage,     //总的记录数，应该从后台取得该值
            size: page.pageSize,       //每页的大小，即每页的记录数
        });

        var tid = null;

        pager.on({
            //翻页时会调用该方法，参数 no 是当前页码。
            'change': function (no,size) {

                if(no == page.pageNo && size == page.pageSize){
                    return;
                }
                //避免过快翻页而连续发起请求。
                clearTimeout(tid);

                tid = setTimeout(function () {
                    panel.fire('change', [no,size]);

                }, 300);

            },

            //控件发生错误时会调用该方法，比如输入的页码有错误时
            'error': function (msg) {
                KISP.alert(msg);
            },
        });

        pager.to(page.pageNo);
    });


});


