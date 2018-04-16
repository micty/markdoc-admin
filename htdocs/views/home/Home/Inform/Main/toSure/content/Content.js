
KISP.panel('/Home/Inform/Main/API/ToSure/Content', function (require, module, panel) {
    var KISP = require('KISP');
    var $ = require('$');
    var TableResizer = require('TableResizer');
    var Template = KISP.require('Template');

    var resizer = null;
    var tableWidth = [];
    var tableSum = null;
    var keyWord = [];      //分条密码        销售出库单没有测试用
    var wholeWord = null;


    panel.on('init', function () {

        var haskeyWord = false;   //每行分录是否含有密码
        var classlist;
        var no;

        panel.template({
            '': function (group) {

                var html = this.fill('content', group);
                return html;
            },

            'content':{
                '': function (item) {
                    var text = item.Children.length == 0 ? 'no-table' : 'has-table';
                    var html = this.fill(text, item);
                    return html;
                },
                'no-table': function (item) {
                    return {
                        'message': item.ErrorMessages,
                    }
                },
                'has-table': {
                    '': function (items) {
                        var bodylist = [];
                        var headlist = [];
                        items.Children.forEach(function (item, index) {

                            if (item.ErrorCode == -2) {
                                headlist = item.ErrorMessages;
                            }
                            if (item.ErrorCode == -3) {
                                bodylist.push(item.ErrorMessages);
                            }

                            //设置密码控制
                            if (item.ErrorCode == -4) {
                                wholeWord = item.ErrorMessages;
                                panel.fire('hasWholeWord', [wholeWord]);
                            }

                            //文本靠左数字靠右对齐
                            if (item.ErrorCode == -5) {
                                classlist = item.ErrorMessages;
                            }

                        })
                        if (headlist[0] == '密码') {            //销售出库单没有分条价格密码控制，采购入库单没有总的价格密码控制
                            haskeyWord = true;
                        }
                        var headhtml = this.fill('head', headlist);
                        var bodyhtml = this.fill('body', bodylist);

                        return {
                            'message': items.ErrorMessages,
                            'index': items.no,
                            'head': headhtml,
                            'body': bodyhtml
                        };

                    },

                    'head': function (item,index) {

                        var type = classlist[index];
                        return {
                            'headitem': item,
                            'class': type == 0 ? 'center' : type == 1 ? 'right' : '',
                        };
                    },
                    'body': {
                        '': function (item) {
                            var td = this.fill('td', item);
                            return {
                                'td': td,
                            };
                        },
                        'td': {
                            '': function (item, index) {
                                no = index;
                                var type = haskeyWord && (index == 0) ? 'input' : 'default';

                                var tdhtml = this.fill(type, [item]);
                                return tdhtml;
                            },
                            'default': function (item) {
                                var type = classlist[no];
                                return {
                                    'bodyitem': item,
                                    'class': type == 0 ? 'center' : type == 1 ? 'right' : '',
                                };
                            },
                            'input': function (item,index) {
                                keyWord.push(item);
                                return {
                                    'index':index,
                                }
                            }
                        },
                    },
                },
            },

        });


    });
    function ResizeTable() {

        var tableSelector = panel.$.find('[data-cmd="table"]').selector;

        if (!resizer) {
            resizer = new TableResizer({
                table: tableSelector + ' table',
            });
        }

        resizer.render();
        resizer.on({
            'change': function (index, data) {
                tableSum = data.tableWidth;
                tableWidth[index] = data.tdWidth;
                //panel.fire('table-change', [data]);
            }
        });

    }

    panel.on('render', function (details) {
        panel.fill(details);
        ResizeTable();
    });

});