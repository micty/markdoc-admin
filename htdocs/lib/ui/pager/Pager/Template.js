

define('Pager/Template', function (require, module) {

    var $ = require('$');
    var Template = KISP.require('Template');
    var $Array = KISP.require('Array');

    var tpl = new Template('#tpl-Pager');


    tpl.process({
        '': function (data) {
            var no = data.no;
            var count = data.count;

            var regions = this.fill('region', data.regions, no);
            var sizes = this.fill('size', data.sizes, data.size);

            return {
                'regions': regions,
                'sizes': sizes,

                'count': data.count,
                'total': data.total,
                'ulId': data.ulId,
                'txtId': data.txtId,
                'sizerId': data.sizerId,
                'toNo': data.toNo,

                'first-disabled-class': no == Math.min(1, count) ? 'disabled' : '',
                'final-disabled-class': no == count ? 'disabled' : '',
                'jump-disabled-class': count == 0 ? 'disabled' : '',
            };
        },

        'region': {
            '': function (region, index, no) {
                var from = region.from;
                var to = region.to;
                var items = $Array.pad(from, to + 1);

                items = this.fill('item', items, no);

                var more = region.more || '';
                if (more) {
                    more = this.fill('more', {});
                }

                var html = items + more;
                return html;
                
            },

            'item': function (no, index, cno) {
                var active = no == cno ? 'active' : '';

                return {
                    'no': no,
                    'active': active,
                };
            },

            'more': function (data) {
                return data;
            },
        },

        'size': function (item, index, size) {
            this.fix('selected');

            return {
                'value': item,
                'selected': item == size ? 'selected="selected"' : '',
            };
        },

    });



    return tpl;



});

