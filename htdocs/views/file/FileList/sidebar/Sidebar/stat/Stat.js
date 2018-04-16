

KISP.panel('/FileList/Sidebar/Stat', function (require, module, panel) {
    var KISP = require('KISP');
    var File = require('File');
    var $Date = KISP.require('Date');
    var Types = module.require('Types');


    panel.on('init', function () {
        var type$desc = {
            'dir': '目录',
            'file': '文件',
        };

        panel.template({
            '': function (data) {
                var table = this.fill('table', data);
                return table;
            },

            'table': {
                '': function (data) {
                    var stat = data.stat;
                    var type = data.type;
                    var desc = type == 'dir' ? '目录' : data.ext.slice(1) + ' 文件';
                    var birthtime = $Date.stringify(stat.birthtime);
                    var mtime = $Date.stringify(stat.mtime);
                    var size = File.getSizeDesc(stat.size);

                    var types = Types.get(data.list);
                    types = this.fill('type', types);

                    return {
                        'sname': data.name.split('/').slice(-1)[0],
                        'name': data.name,
                        'ext': data.ext,
                        'md5': data.md5,
                        'size': size.value,
                        'sizeDesc': size.desc,
                        'birthtime': birthtime,
                        'mtime': mtime,
                        'type': desc,
                        'types': types,
                    };
                },

                'type': function (item, index) {
                    return {
                        'name': item.name,
                        'value': item.value,
                        'desc': item.desc || '',
                        'class': item.class || '',
                    };

                },
            },
        });
    });




    panel.on('render', function (data) {

        panel.fill(data);

        panel.$.toggleClass('dir', data.type == 'dir');
    });





});
