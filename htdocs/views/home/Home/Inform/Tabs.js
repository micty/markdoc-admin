

KISP.panel('/Home/Inform/Tabs', function (require, module, panel) {
    var $ = require('$');
    var KISP = require('KISP');
    var Emitter = KISP.require('Emitter');
    var emitter = new Emitter();
    var tabs = null;

    function render(index, count) {

        tabs = tabs || KISP.create('Tabs', {
            container: panel.$.selector,
            activedClass: 'on',
            repeated: false, //允许重复激活相同的项，否则再次进来时会无反应

            list: [
                { type: 1, text: '待办', number: count.item || 0, },
                //{ type: 2, text: '消息', },   //需求确认先屏蔽消息页签
                { type: 3, text: '交货预警', number: count.warn || 0, },
            ],

            change: function (item, index, data) {
                emitter.fire('change', [item, index, data]);
            },
        });

        tabs.active(index);

    }

    //总数变化
    function change(data) {

        if(data.type == 1){
            panel.$.find('span')[0].innerHTML = data.totalPage || 0;

        }
        else if(data.type == 3){
            panel.$.find('span')[1].innerHTML = data.totalPage || 0;
        }
    }


    function show() {

        if (!tabs) {
            return;
        }

        tabs.show();
    }

    function hide() {

        if (!tabs) {
            return;
        }

        tabs.hide();
    }

    return {
        render: render,
        show: show,
        hide: hide,
        change: change,
        on: emitter.on.bind(emitter),
    }

});
