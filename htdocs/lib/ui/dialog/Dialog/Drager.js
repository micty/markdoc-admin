
define('Dialog/Drager', function (require, module, exports) {
    var KISP = require('KISP');
    var $ = require('$');

    var Template = KISP.require('Template');




    var x = 0;              //��갴��ʱ�� pageX ֵ��
    var y = 0;              //��갴��ʱ�� pageY ֵ��
    var marginLeft = 0;
    var marginTop = 0;

    var cursor = '';        //��갴��ʱ�� cursor ָ��ֵ��
    var body = document.body;
    var masker = null;

    var id$meta = {};
    var meta = null;


    function stop(event) {
        body.style.cursor = cursor;
        meta && meta.$.removeClass('draging');
        masker && masker.hide();
        event && event.preventDefault();
        meta = null;
    }


    $(body).on({
        'mousedown': function (event) {
            meta = id$meta[event.target.id];

            if (!meta) {
                return;
            }

            x = event.pageX;
            y = event.pageY;

            cursor = body.style.cursor;
            body.style.cursor = 'move';

            marginLeft = meta.$.css('margin-left');
            marginTop = meta.$.css('margin-top');
            marginLeft = parseInt(marginLeft);
            marginTop = parseInt(marginTop);
            meta.$.addClass('draging');

            masker = masker || KISP.create('Mask', {
                opacity: 0.0,
                background: 'red',
                'z-index': 1025,
            });

            masker.show();

            //��ֹѡ���ı�
            window.getSelection().removeAllRanges();

        },

        'mousemove': function (event) {

            if (!meta) {
                return;
            }

            //����������ȥʱ�� event.which ��ֵΪ 1��
            //��ҷ dialog һֱ�뿪����������ɿ���꣬�����ᴥ�� mouseup �¼���
            //Ȼ������ٻص����������mousemove �¼����ǻ������������ event.which ��ֵΪ 0��
            //����� dialog ����ҷ���뿪���������ʱ������ִ�и� mouseup һ�����߼���
            if (event.which != 1) {
                stop();
                return;
            }

            var dx = event.pageX - x;
            var dy = event.pageY - y;
            var left = marginLeft + dx;
            var top = marginTop + dy;

            meta.$.css({
                'margin-left': left,
                'margin-top': top,
            });
        },

        'mouseup': function (event) {
            stop(event);
        },
    });





    return {

        set: function (id, meta) {
            id$meta[id] = meta;
        },


        remove: function (id) {
            delete id$meta[id];
        },

    };
});