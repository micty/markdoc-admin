/**
 * 
 */
define('/Home/Report/ECharts', function (require, module, exports) {

    var KISP = require('KISP');
    var panel = KISP.create('Panel');
    panel.on('init', function () {

    });

    panel.on('render', function (detail) {

        var elementDiv = detail.elementDiv;

        var list = detail.rptID;
        var echartdata = detail.echartdata;

        initEchart(elementDiv, list, echartdata);

        function initEchart(elementDom, rptID, echartdata) {
            var myEchart = echarts.init(elementDom); //初始化
            //var type = type ? type : '';
            switch (rptID) {
                case 'rpt10001': //销售订单统计表
                    echartdata.sort(function (a, b) {
                        return b.FAmount - a.FAmount;
                    });
                    if (echartdata.length > 5) echartdata = echartdata.slice(0, 5);

                    var list = {};
                    list.name = echartdata.map(function (item) {
                        return item.FName;
                    });
                    list.value = echartdata.map(function (item) {
                        var edata = accDiv(item.FAmount, 1000);
                        return edata;
                    });
                    list.Fname = '签订金额';
                    showBar(myEchart, list);
                    break;
                case 'rpt10006': //商品库存余额表
                    showPie(myEchart, echartdata);
                    break;
                case 'rpt10002': //销售（出库单）毛利润明细表
                    echartdata.sort(function (a, b) {
                        return b.FSaleProfit - a.FSaleProfit;
                    });
                    if (echartdata.length > 5) echartdata = echartdata.slice(0, 5);

                    var list = {};
                    list.name = echartdata.map(function (item) {
                        return item.FName;
                    });
                    list.value = echartdata.map(function (item) {
                        return item.FSaleProfit;
                    });
                    list.Fname = '出库数量';
                    showBar(myEchart, list);
                    break;
                case 'rpt10008': //采购订单执行情况表
                    echartdata.sort(function (a, b) {
                        return b.FAmount - a.FAmount;
                    });
                    if (echartdata.length > 5) echartdata = echartdata.slice(0, 5);

                    var list = {};
                    list.name = echartdata.map(function (item) {
                        return item.FName;
                    });
                    list.value = echartdata.map(function (item) {
                        return item.FAmount;
                    });
                    list.Fname = '签订金额';
                    showBar(myEchart, list);
                    break;
                default:
                    showBar(myEchart, echartdata);
                    break;

            }

            //var ecConfig = require('echarts/config');

            //myEchart.on('legendselectchanged', function () {
            //    debugger;
            //});
            //myEchart.on('mouseOver', function () {
            //    debugger;
            //});
            //myEchart.on('legendUnSelect', function () {
            //    debugger;
            //});
            //myEchart.on('legendSelect', function () {
            //    debugger;
            //});
            //myEchart.on('legendToggleSelect', function () {
            //    debugger;
            //});
            //myEchart.on('legendScroll', function () {
            //    debugger;
            //});

        }

        //myEchartBar.showLoading();
        //var timer = setTimeout(function () {
        //    myEchartBar.hideLoading();
        //},1000);



        function accDiv(a, b) {
            var c, d, e = 0,
                f = 0;
            try {
                e = a.toString().split(".")[1].length;
            } catch (g) {}
            try {
                f = b.toString().split(".")[1].length;
            } catch (g) {}
            return c = Number(a.toString().replace(".", "")), d = Number(b.toString().replace(".", "")), mul(c / d, Math.pow(10, f - e));
        }

        function mul(a, b) {
            var c = 0,
                d = a.toString(),
                e = b.toString();
            try {
                c += d.split(".")[1].length;
            } catch (f) {}
            try {
                c += e.split(".")[1].length;
            } catch (f) {}
            return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
        }



    });

    function getFiveNum(list) {
        list.sort(function (a, b) {
            return b.FUnitProfit - a.FUnitProfit;
        });

        if (list.length > 5) list.slice(0, 5);
        return list;
    }

    //饼状图
    function showPie(myEchart, list) {
        var arr = ['#61A7E5', '#009ECA', '#00B8EC', '#62CDC4', '#14C896', '#79D19B', '#BFD292', '#EACE7D', '#F6C25A', '#F8B778', '#F9A482', ' #F98239', '#F86857', '#F096C8', '#F082C8', '#D280F3', '#C864F1', '#AA78FA', '#968CF0', '#7896FA'];
        list = list.map(function (item, index) {
            return {
                value: item.FQty,
                name: item.FName,
                itemStyle: {
                    normal: {
                        color: arr[index],
                    },
                },
            }
        });
        var listName = list.map(function (item, index) {
            return item.name;
        });
        //list.pop();//bug ZYB-1351要求将“其他”项显示出来
        var optionsDiv = {
            backgroundColor: '#fff',
            textStyle: {
                normal: {
                    color: '#646464',
                }
            },

            tooltip: {
                trigger: 'item',
                formatter: "{b} </br>{c} ({d}%)",
                position: [10, 0],
                backgroundColor: 'rgba(40,50,60,0.75)',
                borderRadius: '4',
                textStyle: {
                    fontSize: 12,
                },
            },
            legend: {
                data: listName,
                show: true,
                bottom: 4,
                left: 'center',
                itemWidth: 10,
                itemHeight: 10,
                textStyle: {
                    fontSize: 9,
                    color: '#28323c',
                },
                formatter: function (name) {
                    return name.length > 4 ? name.substr(0, 3) + "..." : name; //四个字时则显示全部,五个字则显示三个字加...
                },
            },

            series: [{
                name: '库存余额',
                type: 'pie',
                radius: ['35%', '68%'],
                center: ['50%', '40%'],
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: false,
                        //position: 'center',
                        //formatter: function (obj) {
                        //    var name;

                        //    if (obj.name.length > 10) {
                        //        name = obj.name.substr(0, 5) + '\n' + obj.name.substr(5, 5) + "...";
                        //    } else if (obj.name.length > 5) {
                        //        name = obj.name.substr(0, 4) + '\n'+obj.name.substring(4);
                        //    } else {
                        //        name = obj.name;
                        //    }
                        //    return name;
                        //},
                    },
                    emphasis: {
                        show: false,
                    }
                },

                data: list,
            }],

        };
        myEchart.setOption(optionsDiv);
        window.onresize = myEchart.resize;
    }

    //柱状图
    function showBar(myEchart, list) {

        var optionsDiv = {
            backgroundColor: '#fff',
            textStyle: {
                normal: {
                    color: '#646464',
                }
            },
            itemStyle: {
                normal: {
                    color: '#F4C162',
                },
                emphasis: {

                }
            },
            tooltip: {
                trigger: 'axis',
                position: [10, 0],
            },
            legend: {
                data: [list.Fname],
                show: false,
            },
            grid: {
                show: true,
                top: '6%',
                bottom: '18%',
                left: '13%',
                right: '6%',
                borderColor: '#f7fafb',
                backgroundColor: '#f7fafb',
            },
            xAxis: {
                axisLabel: {
                    margin: '20',
                    formatter: function (val) {
                        return val.length > 4 ? val.substr(0, 3) + "..." : val;
                    }
                },
                axisLine: {
                    show: false,

                },
                axisTick: {
                    show: false,

                },

                type: 'category',
                data: list.name,

            },
            yAxis: {
                type: 'value',
                axisLine: {
                    show: false,

                },
                axisTick: {
                    show: false,

                },
                axisLabel: {
                    textStyle: {
                        color: '#969696',
                        baseline: 'bottom'
                    },
                },

                splitLine: {
                    lineStyle: {
                        type: 'dashed',
                        color: '#c8c2dc'
                    },
                },
            },
            series: [{
                name: list.Fname,
                type: 'bar',
                data: list.value,
            }, ],

        };
        myEchart.setOption(optionsDiv);
        window.onresize = myEchart.resize;
    }

    //折线图
    function showLine(myEchart, list) {
        var optionsDiv = {
            backgroundColor: '#fff',
            show: true,
            textStyle: {
                normal: {
                    color: '#646464',
                }
            },
            itemStyle: {
                normal: {
                    color: '#F4C162',
                },
                emphasis: {

                }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    lineStyle: {
                        color: '#ccc',
                    },
                },
            },

            legend: {
                data: ['出库数'],
                show: false,
            },
            grid: {
                show: true,
                top: '6%',
                bottom: '18%',
                left: '13%',
                right: '6%',
                borderColor: '#f7fafb',
                backgroundColor: '#f7fafb',
            },
            xAxis: {
                axisLabel: {
                    margin: '20',
                    formatter: function (val) {
                        return val.length > 4 ? val.substr(0, 3) + "..." : val;
                    }
                },
                type: 'category',
                data: ['笔记本主机', 'LED液晶', '鼠标', '电源线', '销售礼盒'],

                boundaryGap: false,
                axisLine: {
                    show: false,

                },
                axisTick: {
                    show: false,

                },
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    textStyle: {
                        color: '#969696',
                        baseline: 'bottom'
                    },
                },
                splitLine: {
                    lineStyle: {
                        type: 'dashed',
                        color: '#c8c2dc'
                    },
                },
                axisLine: {
                    show: false,

                },
                axisTick: {
                    show: false,

                },
            },
            series: [{
                name: '出库数',
                type: 'line',
                smooth: true,
                data: [300, 400, 360, 800, 90],
                areaStyle: {
                    normal: {
                        //color: '#f0f4f8',
                        opacity: '0.5',
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0,
                                color: '#F4C162', // 0% 处的颜色
                            }, {
                                offset: 1,
                                color: '#ffffff' // 100% 处的颜色
                            }],
                            globalCoord: false // 缺省为 false
                        }
                    }
                },
            }, ],

        };
        myEchart.setOption(optionsDiv);
        window.onresize = myEchart.resize;
    }

    return panel.wrap();

});
