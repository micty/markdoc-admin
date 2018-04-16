
define('NumberField/Config', function (require, exports, module) {

    var KISP = require('KISP');
    var $Object = KISP.require('Object');

    var key$old = {
        groupSign: 'aSep',      //分组的分隔符号，默认为逗号 ","
        groupCount: 'dGroup',   //分组的位数，默认为 3
        decimalSign: 'aDec',    //小数点的符号，默认为点号 "."
        decimalKey: 'altDec',   //输入小数点的代替键，一般不需要用到
        currencySign: 'aSign',  //货币的符号
        currencyPlace: 'pSign', //货币的符号所处的位置，前面或后面，取值: "left"|"right"
        min: 'vMin',            //允许的最小值
        max: 'vMax',            //允许的最大值
        decimalCount: 'mDec',   //小数的位数，默认为 3
        round: 'mRound',        //四舍五入
        padded: 'aPad',         //是否用 "0" 填充小数位，取值: true|false
        bracket: 'nBracket',    //输入框失去焦点后，负数的展示括号
        empty: 'wEmpty',        //输入框为空时的显示行为
        leadingZero: 'lZero',   //前缀 "0" 的展示行为
        formatted: 'aForm',     //控制是否在页面就绪时自动格式化输入框的值
    };


    var key$defaults = {
        currencyPlace: {
            left: 'p', //前缀
            right: 's' //后缀
        },
    };





    //把配置对象归一化成原始控件所需要的格式


    return {
        get: function (config) {

            var target = {};

            $Object.each(config, function (key, value) {

                var old = key$old[key];

                if (!old) {
                    target[key] = value;
                    return;
                }

                var defaults = key$defaults[key];
                if (defaults) {
                    value = defaults[value];
                }

                target[old] = value;
            });

            return target;
        },
    };

   

});

