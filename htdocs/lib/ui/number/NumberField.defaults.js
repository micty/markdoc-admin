define('NumberField.defaults', {
    groupSign: ',', //分组的分隔符号
    groupCount: 3, //分组的位数
    decimalSign: '.', //小数点的符号
    decimalKey: null, //输入小数点的代替键，一般不需要用到
    currencySign: '', //货币的符号，如 '$'|'¥'|'€' 之类的
    currencyPlace: 'left', //货币的符号所处的位置，前面或后面，取值: 'left'|'right'
    min: '0.00', //允许的最小值，必须用字符串
    max: '9999999999999.99', //允许的最大值，必须用字符串，且比 min 要大
    decimalCount: 2, //小数的位数
    round: 'S', //四舍五入
    padded: false, //是否用 "0" 填充小数位，取值: true|false
    bracket: null, //输入框失去焦点后，负数的代替展示括号，不指定则原样展示

    /** Displayed on empty string
     * 'empty', - input can be blank
     * 'zero', - displays zero
     * 'sign', - displays the currency sign
     */
    empty: 'empty', //输入框为空时的显示行为

    /** controls leading zero behavior
     * 'allow', - allows leading zeros to be entered. Zeros will be truncated when entering additional digits. On focusout zeros will be deleted.
     * 'deny', - allows only one leading zero on values less than one
     * 'keep', - allows leading zeros to be entered. on fousout zeros will be retained.
     */
    leadingZero: 'allow', //前缀 "0" 的展示行为

    formatted: true, //控制是否在页面就绪时自动格式化输入框的值，取值: true|false
});
