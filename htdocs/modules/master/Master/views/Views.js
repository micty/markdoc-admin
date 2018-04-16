

KISP.panel('/Master/Views', function (require, module, panel) {
    var KISP = require('KISP');
    var Package = KISP.require('Package');

    var current = null; //当前激活的视图模块对象。
    var name$view = {};
    var name$bind = {};
    var view$args = new Map();
    var view$opt = new Map();


    //获取指定名称的视图，并执行一些初始化操作。
    function get(name, opt) {
        var view = name$view[name];

        if (view) {
            return view;
        }


        var values = panel.fire('require', [name]);
        view = values[0];

        if (!view) {
            return;
        }


        name$view[name] = view;
        view$opt.set(view, opt);

        if (!name$bind[name]) {
            name$bind[name] = true;

            //接收来自 view 内部触发的事件。
            //即以下事件是 view 内部业务层的代码触发的。
            view.on('close', function () {

                delete name$view[name];
                view$args.delete(view);

                var args = [...arguments];
                panel.fire('close', args);
            });

            view.on('title', function (title) {
                var opt = view$opt.get(view);
                opt.title = title;
                panel.fire('title', [opt.id, title]);
            });

            view.on('refresh', function () {

                var args = view$args.get(view) || [];
                view.render(...args);

            });

            view.on('fullscreen', function () {
                panel.fire('fullscreen');
            });
        }

        return view;
    }


    //激活指定的视图，用 render 或 show 的方式。
    function active(view, opt) {
        var args = opt.args || [];
        var render = opt.render;

        current && current.hide();
        current = view;


        //try{
            if (render) {
                view$args.set(view, args);
                view.render(...args);
            }
            else {
                view.show();
            }

            panel.fire('active', [opt]);
        //}
        //catch (ex) {
        //    panel.fire('error', [opt, ex]);
        //}
    }



    var exports = {
        /**
        * 打开指定的视图。
        * @param {String} name 要打开的视图名称。
        * @param {Array} [args] 要传递给目标视图的参数数组。
        * @param {boolean} [render] 是否强制刷新。 
        *   如果指定为 true，则调用目标视图的 render() 方法；否则调用 show() 方法。
        *   如果不指定或指定为 false，则根据视图是否已打开自动指定。
        */
        'open': function (name, options) {
            var opt = options || {};
            var args = opt.args || [];

            opt = {
                'name': name,
                'args': args,
                'render': name$view[name] ? opt.render : true,  //如果之前未打开过或已关闭，则强制刷新。
                'title': opt.title,
                'id': opt.id || '',
            };



            var view = get(name, opt);

            //已加载过，或者是同步方式存在的。
            if (view) {
                active(view, opt);
                return;
            }


            //尝试以异步方式去加载。
            Package.load(name, function (pack) {
                if (!pack) {
                    console.warn('不存在视图 ' + name + ' 对应的 package 文件。');
                    panel.fire('404', [opt]);
                    return;
                }

                //要先添加 html 内容。
                var html = pack['html'];
                if (html) {
                    panel.$.append(html.content);
                }

                //再去加载 js 模块。
                var view = get(name, opt);

                if (!view) {
                    console.warn('无法获取到视图: ' + name);
                    panel.fire('404', [opt]);
                    return;
                }

                active(view, opt);

            });


        },

        /**
        * 关闭指定名称的视图，并传递一些参数。
        */
        'close': function (name, args) {
            var view = name$view[name];
            if (!view) {
                return;
            }

            //目标视图中有阻止关闭的，或需要确认关闭的，则先取消关闭。
            //调用 view.close(); 会触发 view 内部的 `close` 事件，从而执行 view 内部的业务代码。
            //目标视图通过调用 view.on('close', function() { return false; }); 通过返回 false 即可阻止关闭。
            var values = view.close(...args);

            if (values.includes(false)) {
                return false;
            }

            view$args.delete(view);

            delete name$view[name];
        },

        /**
        * 刷新指定的或当前视图。
        */
        'refresh': function (view) {

            view = view || current;

            if (typeof view == 'string') {
                var values = panel.fire('require', [view]);
                view = values[0];
            }

            if (!view) {
                return;
            }

            //目标视图中有阻止刷新的，或需要确认的，则先取消。
            //调用 view.refresh(); 会触发 view 内部的 `refresh` 事件，从而执行 view 内部的业务代码。
            //目标视图通过调用 view.on('refresh', function() { return false; }); 通过返回 false 即可阻止刷新。
            var args = view$args.get(view) || [];
            var values = view.refresh(...args);

            if (values.includes(false)) {
                return false;
            }

            view.render(...args);
        },
    };

    return exports;

});