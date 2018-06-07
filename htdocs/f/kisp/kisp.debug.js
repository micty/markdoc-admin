/*
* pc - KISP JavaScript Library
* name: pc 
* version: 0.0.1
* build: 2018-04-20 10:23:57
* files: 124(122)
*    partial/begin.js
*    base/Module.js
*    base/ModuleManager.js
*    base/InnerModules.js
*    core/KISP.js
*    core/Defaults.js
*    core/Config.js
*    $/Object.js
*    $/Array.js
*    browser/Router.js
*    api/Proxy.js
*    defaults/common/api/Proxy.js
*    $/Fn.js
*    $/Math.js
*    $/Script.js
*    $/String.js
*    $/JSON.js
*    browser/Url.js
*    defaults/common/excore/Url.js
*    api/Proxy/Url.js
*    $/Query.js
*    browser/App.js
*    defaults/common/browser/App.js
*    browser/Loader.js
*    defaults/common/excore/Loader.js
*    $/StyleSheet.js
*    browser/Loader/Url.js
*    core/Module.js
*    defaults/common/core/Module.js
*    $/Tasks.js
*    $/Emitter.js
*    $/Tree.js
*    browser/Package.js
*    defaults/common/browser/Package.js
*    ui/Loading.js
*    defaults/common/ui/Loading.js
*    config/pc/Loading.js
*    excore/RandomId.js
*    ui/Style.js
*    ui/Mask.js
*    defaults/common/ui/Mask.js
*    config/pc/Mask.js
*    ui/Mask/Sample.html.js
*    ui/Mask/Style.js
*    ui/Loading/Sample.js
*    ui/Loading/Style.js
*    ui/Loading/Presettings.js
*    browser/Package/Loader.js
*    browser/App/Nav.js
*    defaults/common/browser/App/Nav.js
*    browser/Navigator.js
*    $/Hash.js
*    ui/Alert.js
*    defaults/common/ui/Alert.js
*    config/pc/Alert.js
*    ui/Alert/Dialog.js
*    ui/Dialog.js
*    defaults/common/ui/Dialog.js
*    config/pc/Dialog.js
*    excore/Mapper.js
*    ui/Dialog/Sample.js
*    ui/Dialog/Style.js
*    ui/Dialog/Renderer.js
*    mobile/Scroller.js
*    lib/IScroll.js
*    mobile/Scroller/pull.js
*    ui/Alert/Sample.html.js
*    ui/Confirm.js
*    defaults/common/ui/Confirm.js
*    lib/$.js
*    ui/View.js
*    defaults/common/ui/View.js
*    ui/Panel.js
*    defaults/common/ui/Panel.js
*    ui/Template.js
*    defaults/common/ui/Template.js
*    api/SSH.API.js
*    defaults/common/api/SSH.API.js
*    api/SSH.js
*    defaults/common/api/SSH.js
*    api/API.js
*    defaults/common/api/API.js
*    api/API/Ajax.js
*    api/SSH/Server.js
*    defaults/common/api/SSH/Server.js
*    $/Date.js
*    browser/SessionStorage.js
*    defaults/common/browser/SessionStorage.js
*    browser/Storage.js
*    browser/LocalStorage.js
*    defaults/common/browser/LocalStorage.js
*    crypto/MD5.js
*    api/SSH/Server/Config.js
*    defaults/common/api/SSH/Server/Config.js
*    api/SSH/Ajax.js
*    api/SSH.API/Ajax.js
*    ui/Toast.js
*    defaults/common/ui/Toast.js
*    ui/Toast/Renderer.js
*    ui/Toast/Sample.js
*    ui/Toast/Style.js
*    third/CloudHome.js
*    third/CloudHome.API.js
*    defaults/common/third-party/CloudHome.API.js
*    third/CloudHome.Title.js
*    third/CloudHome/Native.js
*    ui/Tabs.js
*    defaults/common/ui/Tabs.js
*    config/pc/Tabs.js
*    ui/Tabs/Helper.js
*    ui/NoData.js
*    defaults/common/ui/NoData.js
*    ui/NoData/Renderer.js
*    ui/NoData/Sample.html.js
*    ui/NoData/Style.js
*    third/ImageReader.js
*    defaults/common/third-party/ImageReader.js
*    third/ImageReader/Renderer.js
*    $/Escape.js
*    mobile/NumberPad/Sample.html.js
*    ui/Dialog/Sample/iOS.html.js
*    ui/Loading/Sample/iOS.html.js
*    ui/Toast/Sample/font-awesome.html.js
*    partial/end.js
*/

;( function (
    global, 

    top,
    parent,
    window, 
    document,
    location,
    navigator,
    localStorage,
    sessionStorage,
    console,
    history,
    setTimeout,
    setInterval,

    

    Array, 
    Boolean,
    Date,
    Error,
    Function,
    JSON,
    Map,
    Math,
    Number,
    Object,
    RegExp,
    String,
    
   
    $,

    undefined
) {


/**
* 用于工厂函数 
*   factory(require, module, exports) { }
* 中的第二个参数 `module` 的构造器。
*/
var Module = (function () {

    var mapper = new Map();

    function Module(config) {

        var id = config.id;
        var module = config.module;
        var seperator = config.seperator;
        var parent = config.parent;


        //暴露给外部的属性。
        Object.assign(this, {
            'id': id,
            'name': id.split(seperator).slice(-1)[0],   //短名称。
            'seperator': seperator,
            'exports': config.exports,
            'count': module.count,
            'parent': parent ? parent.mod : null,
        });


        //内部方法使用的字段。
        //安全起见，不使用暴露的那份，防止调用方恶意去改。
        var meta = {
            'id': id,
            'seperator': seperator,
            'emitter': module.emitter,
            'mm': config.mm,
        };

        mapper.set(this, meta);
    }

    //实例方法。
    Module.prototype = {
        constructor: Module,

        /**
        * 加载当前模块指定名称的直接下级模块。
        * @param {string} name 直接下级模块的短名称。
        */
        require: function (name) {
            var meta = mapper.get(this);
            var seperator = meta.seperator;

            if (name.includes(seperator)) {
                throw new Error('不允许跨级加载模块: ' + name);
            }

            var full = meta.id + seperator + name;
            var M = meta.mm.require(full);
            return M;
        },

        /**
        * 在当前模块上绑定事件。
        */
        on: function () {
            var meta = mapper.get(this);
            var emitter = meta.emitter;

            emitter && emitter.on(...arguments);
        },

        /**
        * 在首次 require 指定直接子模块时，绑定该模块上指定的事件。
        */
        bind: function (name, events) {
            var self = this;
            var name$events = {};

            if (typeof name == 'string') {   //单个绑定。
                name$events[name] = events;
            }
            else { // name 为 {}， 多个模块的批量绑定。
                name$events = name;
            }


            Object.keys(name$events).forEach(function (name) {
                var events = name$events[name];

                var fn = (typeof events == 'function') ? events : function (M) {
                    M.on(events);
                };

                self.on('require', name, fn);
            });
            

        },

        /**
        * 异步加载指定的直接子模块并执行回调函数。
        * 该方法会先尝试用同步方式加载子模块，如果成功则直接调用回调函数；否则使用异步方式加载。
        * 一旦加载成功，在第二次及以后都会使用同步方式。
        * @param {string} name 要加载的子模块名称。
        * @param {string|Object} [container] 加载到的子模块的 html 内容需要附加到的容器(jQuery选择器)。
        *   只有指定了该参数，并且加载到的 html 内容不为空才会附加到容器。
        * @param {function} fn 加载成功后要执行的回调函数。
        *   该函数会接收一个参数: 加载到的子模块实例。
        */
        load: function (name, container, fn) {

            //重载 load(name, fn);
            if (typeof container == 'function') {
                fn = container;
                container = null;
            }

            var M = this.require(name);
            if (M) {
                fn && fn(M);
                return;
            }

            var self = this;
            var meta = mapper.get(this);
            var full = meta.id + meta.seperator + name;

            var Package = InnerModules.require('Package');


            Package.load(full, function (pack) {

                var item = pack['html'];
                if (container && item && item.content) {
                    var $ = InnerModules.require('$');
                    $(container).append(item.content);
                }


                var M = self.require(name);

                if (!M) {
                    throw new Error('不存在名为 ' + name + ' 的子模块');
                }

                fn && fn(M);

            });
        },

        /**
        * 加载指定的子模块并调用 render 方法，可向其传递一些参数。
        * @param {string} name 要加载的子模块名称。
        * @return {Object} 返回加载到的子模块实例。
        */
        render: function (name, arg0, arg1, argN) {
            var args = [].slice.call(arguments, 1);
            var M = this.require(name);
            if (!M) {
                throw new Error('不存在名为 ' + name + ' 的子模块。');
            }

            M.render.apply(M, args);
            return M;
        },

    };


    return Module;

})();

/**
* CMD 模块管理器类。
* @class
*/
var ModuleManager = (function (Module) {

    var mapper = new Map();


    //构造器。
    function ModuleManager(config) {

        var self = this;

        config = Object.assign({
            seperator: '/',
            repeated: false,
            cross: false,
            Emitter: null,

            //用于 factory(require, module, exports){ } 中的第一个参数 `require`，加载公共模块。
            require: function (id) {
                return self.require(id, !meta.cross);
            },

        }, config);


        var require = config.require;

        //提供快捷方式去加载并 new 一个指定模块构造器的实例。
        require.new = function (id) {
            var M = require(id);
            if (typeof M != 'function') {
                return null;
            }

            var args = [].slice.call(arguments, 1);
            args = [null].concat(args);
            return new (M.bind.apply(M, args));
        };
        

        var Emitter = config.Emitter;
        var emitter = Emitter ? new Emitter(this) : null;

        var meta = {
            'id$module': {},
            'seperator': config.seperator,  //父子模块命名中的分隔符，如 `User/Login/API`。
            'repeated': config.repeated,    //是否允许重复定义模块。
            'cross': config.cross,          //是否允许跨级加载模块。
            'require': config.require,      //自定义加载公共模块的方法。
            'Emitter': Emitter,             //事件管理器构造器。
            'emitter': emitter,             //用于加载全部模块时触发相应的事件管理器实例。
        };

        mapper.set(this, meta);


        //监听子级模块的首次加载事件。
        this.on('require', function (id, mod, exports) {
            var id$module = meta.id$module;

            //触发本级模块的事件。
            var module = id$module[id];
            var emitter = module.emitter;
            emitter && emitter.fire('require', [exports]);

            //说明是直接导出对象。
            if (!mod) {
                return;
            }

            var name = mod.name;    //短名称。

            //顶级模块。
            if (name == id) {
                return;
            }

            //子级模块。
            //取它的父模块的事件管理器。
            var module = id$module[mod.parent.id];
            var emitter = module.emitter;
            emitter && emitter.fire('require', name, [exports]);

        });
    }


    //实例方法
    ModuleManager.prototype = /**@lends ModuleManager#*/ {
        constructor: ModuleManager,

        /**
        * 定义指定名称的模块。
        * @param {string} id 模块的名称。
        * @param {Object|function} factory 模块的导出函数或对象。
        */
        define: function (id, factory) {
            var meta = mapper.get(this);
            var id$module = meta.id$module;
            var repeated = meta.repeated;

            if (!repeated && id$module[id]) {
                throw new Error('配置设定了不允许定义重复的模块: 已存在名为 "' + id + '" 的模块');
            }


            var Emitter = meta.Emitter;
            var emitter = Emitter ? new Emitter(this) : null;
            if (emitter) {
                emitter.id = 'emitter-' + id;
            }

            id$module[id] = {
                'factory': factory, //工厂函数或导出对象
                'exports': null,    //这个值在 require 后可能会给改写
                'required': false,  //指示是否已经 require 过
                'count': 0,         //require 的次数统计
                'mod': null,        //用来存放 require 时产生的中间结果
                'emitter': emitter, //
            };
        },

        /**
        * 加载指定的模块。
        * @param {string} id 模块的名称。
        * @param {boolean} noCross 是否禁用跨级调用。 
        *   当指定为 true 时，则禁用跨级调用。 否则，默认允许跨级调用。
        * @return 返回指定的模块的导出对象。
        */
        require: function (id, noCross) {
            if (typeof id != 'string') {
                throw new Error('参数 id 的类型必须为 string: ' + (typeof id));
            }

            var meta = mapper.get(this);
            var seperator = meta.seperator;

            if (noCross && id.includes(seperator)) {
                throw new Error('参数明确指定了不允许跨级加载模块: ' + id);
            }


            var id$module = meta.id$module;
            var module = id$module[id];
            if (!module) { //不存在该模块
                return;
            }

            module.count++;

            //已经加载过了。
            if (module.required) {
                return module.exports;
            }


            //首次加载。
            var emitter = meta.emitter;
            module.required = true; //更改标志，指示已经 require 过一次。

            var factory = module.factory;
            if (typeof factory != 'function') { //非工厂函数，则直接导出
                module.exports = factory;
                emitter && emitter.fire('require', [id, null, factory]);
                return factory;
            }


            //factory 是个工厂函数
            var self = this;
            var exports = {};

            var parent = null;
            var names = id.split(seperator);

            if (names.length > 1) {
                var parentId = names.slice(0, -1).join(seperator);
                parent = id$module[parentId];
            }



            var mod = module.mod = new Module({
                'id': id,
                'seperator': seperator,
                'exports': exports,
                'module': module,
                'parent': parent,
                'mm': this,
            });


            //调用工厂函数获得导出对象。
            exports = factory(meta.require, mod, exports);

            if (exports === undefined) {    //没有通过 return 来返回值，
                exports = mod.exports;      //则要导出的值只能在 mod.exports 里
            }

            module.exports = exports;
            emitter && emitter.fire('require', [id, mod, exports]);
            return exports;
        },

        on: function (name, fn) {
            var meta = mapper.get(this);
            var emitter = meta.emitter;
            var args = Array.from(arguments);
            emitter && emitter.on(args);
        },


        /**
        * 销毁本实例。
        */
        destroy: function () {
            mapper.delete(this);
        },
    };


    return ModuleManager;

})(Module);


//内部使用的模块管理器。
var InnerModules = (function (ModuleManager) {

    //内部使用的模块管理器。
    var mm = new ModuleManager({
        cross: true,    //用于跨级加载，如配置文件。
    });

    var id$exposed = {};


    return {
        define: mm.define.bind(mm),
        require: mm.require.bind(mm),

        /**
        * 绑定到指定模块的指定方法。
        * @param {string} id 模块的名称(id)。
        * @param {string} name 模块的方法名称。
        * @param {Object|boolean} context 绑定的方法执行时的上下文，即 this 变量的指向。
            如果传入 true，则表示当前要绑定的模块本身。
        * @return {function} 返回绑定后的方法。
        */
        bind: function (id, name, context) {
            return function () {
                var M = mm.require(id);
                var args = Array.from(arguments);

                context = context === true ? M : context;
                context = context || null;

                return M[name].apply(context, args);
            };
        },


        expose: function (id, exposed) {

            //批量 set 为 true。
            if (Array.isArray(id)) {
                id.forEach(function (id) {
                    id$exposed[id] = true;
                });

                return;
            }

            //批量 set 为指定的 {}。
            if (typeof id == 'object') {
                var obj = id;

                Object.keys(obj).forEach(function (id) {
                    id$exposed[id] = obj[id];
                });
                return;
            }

            //单个 set。
            if (arguments.length == 2) {
                return id$exposed[id] = exposed;
            }

            //单个 get。

            return true; //test...........

            return id$exposed[id];
        },

    };

})(ModuleManager);

var define = InnerModules.define;    //内部使用的 define。



/**
* KISP 框架命名空间
* @namespace
* @name KISP
*/
define('KISP', function (require, module, exports) {

    var cfg = null; //for data


    module.exports = exports = /**@lends KISP*/ {

        /**
        * 名称。 (由 packer 自动插入)
        */
        name: 'pc',

        /**
        * 版本号。 (由 packer 自动插入)
        */
        version: '0.0.1',

        /**
        * 类型号。 (由 packer 自动插入)
        * 值为 'debug' 或 'min'。
        */
        edition: /**{edition*/'debug'/**edition}*/,


        /**
        * 加载 KISP 框架内公开的模块。
        * @param {string} id 模块的名称(id)。
        * @return {Object} 返回模块的导出对象。
        * @example
        *   var API = KISP.require('API');    
        */
        require: function (id) {
            return InnerModules.expose(id) ? require(id) : null;
        },


        /**
        * 加载 KISP 框架内公开的模块，并创建它的一个实例。
        * @param {string} id 模块的名称(id)
        * @param {Object} config 要创建实例时的配置参数。
        * @return {Object} 返回该模块所创建的实例。
        * @example
        *   var api = KISP.create('API', {});  
        *   //相当于
        *   var API = KISP.require('API');
        *   var api = new API({});
        */
        create: require.new,



        /**
        * 获取或设置 KISP 内部模块的默认配置。
        * @function
        * @example
        *   KISP.config({});    
        */
        config: InnerModules.bind('Defaults', 'config'),

        /**
       * 给上层业务端提供存取配置数据的方法。
       * 已重载成 get 和 set 两种方式。 
       * 字符串中的 {~} 表示站头的根地址；{@} 表示使用的文件版本 debug 或 min。
       * @param {string} name 要存储的数据的名称。
       * @param value 要存储的数据的值，可以是任何类型。
       *   当不提供此参数时，则为 get 操作；否则为 set 操作。
       */
        data: InnerModules.bind('Defaults', 'data'),


        route: InnerModules.bind('Router', 'set'),

        /**
        * 响应一个代理请求。
        * 相当于 Proxy.response() 的别名。
        * @function
        * @example
        *   KISP.proxy({
                code: 200,
                msg: 'ok',
                data: {},
            });    
        */
        proxy: InnerModules.bind('Proxy', 'response'),

        /**
        * 初始化执行环境，并启动应用程序。
        * 该方法会预先定义一些公共模块，然后定义一个匿名模块并启动它。
        * @param {function} factory 工厂函数，即启动函数。
        */
        launch: InnerModules.bind('App', 'launch'),

        /**
        * 弹出 alert 虚拟窗口。
        * @param {string|Object} text 要显示的消息文本。
            如果指定为一个对象，则先调用 JSON.string(text, null, 4) 得到字符串再进行显示。
        */
        alert: InnerModules.bind('Alert', 'show'),


        /**
        * 弹出 confirm 虚拟窗口。
        * @param {string} text 要显示的消息文本。
        * @param {function} 点击确定按钮后要执行的回调函数。
        */
        confirm: InnerModules.bind('Confirm', 'show'),

        /**
        * 用 KISP 标准的方法定义一个 View 视图实例。
        */
        view: InnerModules.bind('View', 'define'),

        /**
        * 用 KISP 标准的方法定义一个 Panel 面板实例。
        */
        panel: InnerModules.bind('Panel', 'define'),
        
    };
});

/**
* KISP 内部模块使用的默认配置管理器。
* @namespace
* @name Defaults
*/
define('Defaults', function (require, module, exports) {

    var $Object = require('Object');

    var cfg = null;     //
    var data = null;    //
    var name$used = {}; // { 模块名: 已经使用了默认配置 }



    //使用默认配置
    function use(name) {
        if (name$used[name]) {
            return;
        }

        var defaults = require(name + '.defaults');
        var config = require(name + '.config');
        var data = $Object.extendDeeply({}, defaults, config);

        cfg = cfg || require.new('Config');
        cfg.set(name, data);

        name$used[name] = true;
    }




    module.exports = exports = /**@lends Defaults*/ {

        set: function (name, config) {

            if (typeof name == 'object') {
                //批量设置: set({...})
                $Object.each(name, function (name, config) {
                    use(name);
                    cfg.set(name, config);
                });
            }
            else {
                //单个设置 set(name, config)
                use(name);
                cfg.set(name, config);
            }
        },

        get: function (name) {
            use(name);
            return cfg.get(name);
        },


        clone: function (name, target, target1, targetN) {

            var config = exports.get(name);

            var args = [].slice.call(arguments, 1);
            args = [{}, config].concat(args);

            return $Object.extendDeeply.apply(null, args);
        },

        /**
        * 获取或设置 KISP 内部模块的默认配置。
        * @function
        * @example
        *   KISP.config({});    
        */
        config: function (name, value) {

            //get(name)
            if (arguments.length == 1 && typeof name == 'string') {
                return exports.get(name);
            }

            //set
            exports.set(name, value);
        },


        /**
       * 给上层业务端提供存取配置数据的方法。
       * 已重载成 get 和 set 两种方式。 
       * 字符串中的 {~} 表示站头的根地址；{@} 表示使用的文件版本 debug 或 min。
       * @param {string} name 要存储的数据的名称。
       * @param value 要存储的数据的值，可以是任何类型。
       *   当不提供此参数时，则为 get 操作；否则为 set 操作。
       */
        data: function (name, value) {

            data = data || require.new('Config');

            //get(name)
            if (arguments.length == 1 && typeof name == 'string') {
                return data.get(name);
            }

            //set
            data.set(name, value);
        },
    };

});

/**
* 配置工具类。
* @class
* @name Config
*/
define('Config', function (require, module,  exports) {

    var $Object = require('Object');
    var mapper = new Map();


    /**
    * 构造器。
    */
    function Config() {
        var meta = {
            'name$data': {},
        };

        mapper.set(this, meta);
    }


    //实例方法
    Config.prototype = /**@lends Config#*/ {
        constructor: Config,

        /**
        * 设置指定模块的默认配置。
        * 已重载 set({...})，因此可以批量设置。
        * @param {string} name 要设置的模块的名称。
        * @param {Object} data 要设置的默认配置对象。
        */
        set: function (name, data) {

            var meta = mapper.get(this);
            var name$data = meta.name$data;

            //批量设置: set({...})
            if (typeof name == 'object') {
                $Object.each(name, function (name, data) {
                    setItem(name, data);
                });
            }
            else {
                //单个设置 set(name, data)
                setItem(name, data);
            }
            

            //内部共用方法，设置单个模块的默认配置对象。
            function setItem(name, data) {

                //首次设置
                if (!(name in name$data)) {
                    name$data[name] = data;
                    return;
                }

                var old = name$data[name];

                if ($Object.isPlain(old)) { //纯对象
                    $Object.extendDeeply(old, data); //则合并
                }
                else { //其他的，则重设
                    name$data[name] = data;
                }
            }

        },



        /**
        * 获取指定模块名称的默认配置。
        * @param {string|object} name 要获取的模块的名称。
        * @return {Object} 返回该模块的默认配置对象。
        */
        get: function (name) {
            var meta = mapper.get(this);
            var name$data = meta.name$data;
            var data = name$data[name];
            return data;
        },

        /**
        * 获取并克隆指定模块名称的默认配置。
        * @param {string} name 要获取的模块的名称。
        * @param {Object} [target] 需要合并的对象。
        *   如果需要提供额外的合并成员，可指定此参数。
        * @return {Object} 返回该模块的默认配置对象的克隆版本。
        */
        clone: function (name, target, target1, targetN) {
            var data = this.get(name);

            var args = [].slice.call(arguments, 1);
            args = [{}, data].concat(args);

            return $Object.extendDeeply.apply(null, args);

        },

    };


    return Config;
});


/**
* 对象工具
* @namespace
* @name Object
*/
define('Object', function (require, module, exports) {



    module.exports = exports = /**@lends Object */ {

        extend: Object.assign,

        /**
        * 用多个对象深度扩展一个对象。
        */
        extendDeeply: function (target, obj1, obj2) {

            var isPlain = exports.isPlain;


            function copy(A, B) {
                A = A || {};

                for (var key in B) {
                    var target = B[key];
                    var source = A[key];

                    if (isPlain(target)) {
                        if (isPlain(source)) {
                            source = copy({}, source);
                        }
                        else {
                            source = {};
                        }

                        target = copy(source, target);
                    }
               
                    A[key] = target;
                }

                return A;
            }


            //针对最常用的情况作优化
            if (obj1 && typeof obj1 == 'object') {
                target = copy(target, obj1);
            }

            if (obj2 && typeof obj2 == 'object') {
                target = copy(target, obj2);
            }

            var startIndex = 3;
            var len = arguments.length;
            if (startIndex >= len) { //已处理完所有参数
                return target;
            }

            //更多的情况
            for (var i = startIndex; i < len; i++) {
                var objI = arguments[i];
                target = copy(target, objI);
            }

            return target;

        },

        /**
        * 检测对象是否是空对象(不包含任何属性)。
        * 该方法既检测对象本身的属性，也检测从原型继承的属性(因此没有使用 hasOwnProperty )。
        * 该实现为 jQuery 的版本。
        * @param {Object} obj 要进行检测的对象，可以是任何类型
        * @return {boolean} 一个检测结果，如果为空对象则返回 true；否则返回 false
        * @example
            $Object.isEmpty({});      //true
            
            function Person(){ }
            Person.prototype.name = 'abc';
            var p = new Person();
            $Object.isEmpty( p );   //false
        */
        isEmpty: function (obj) {
            for (var name in obj) {
                return false;
            }

            return true;
        },

        /**
        * 检测一个对象是否是纯粹的对象（通过 "{}" 或者 "new Object" 创建的）。
        * 该实现为 jQuery 的版本。
        * @param {Object} obj 要进行检测的对象，可以是任何类型
        * @return {boolean} 一个检测结果，如果为纯粹的对象则返回 true；否则返回 false
        * @example
            $Object.isPlain( {} );             //true
            $Object.isPlain( {a: 1, b: {} } );  //true
            
            function Person(){ }
            var p = new Person();
            $Object.isPlain( p );   //false
        */
        isPlain: function (obj) {
            if (!obj || typeof obj != 'object' /*|| obj.nodeType || exports.isWindow(obj) */) {
                return false;
            }

            var hasOwnProperty = Object.prototype.hasOwnProperty;
            var constructor = obj.constructor;

            try {
                // Not own constructor property must be Object
                if (constructor &&
                    !hasOwnProperty.call(obj, "constructor") &&
                    !hasOwnProperty.call(constructor.prototype, "isPrototypeOf")) {
                    return false;
                }
            }
            catch (e) {
                // IE8,9 Will throw exceptions on certain host objects #9897
                return false;
            }

            // Own properties are enumerated firstly, so to speed up,
            // if last one is own, then all properties are own.
            var key;
            for (key in obj) {
            }

            return key === undefined || hasOwnProperty.call(obj, key);
        },



        /**
        * 把一个对象的键/值对深层次地扁平化成一个数组。
        * @param {Object} obj 要进行线性化的纯对象。
        * @return {Array} 返回一个线性化表示的一维数组。
        *   数组的每项都为一个 { keys: [], value: ... } 的结构。
        * @example
            var list = $Object.flat({
	            name: {
	                a: 1,
                    b: 2,
                    c: {
	                    aa: 11,
                        bb: 22
                    }
                },
                tag: {
	                a: 'a0',
                    b: 'b0'
                },
                id: 1000
            });
            console.dir(list);
            //得到: 
            [
                { keys: ['name', 'a'], value: 1 },
                { keys: ['name', 'b'], value: 2 },
                { keys: ['name', 'c', 'aa'], value: 11 },
                { keys: ['name', 'c', 'bb'], value: 22 },
                { keys: ['tag', 'a'], value: 'a0' },
                { keys: ['tag', 'b'], value: 'b0' },
                { keys: ['id'], value: 1000 },
            ]
        */
        flat: function (obj) {

            var isPlain = exports.isPlain;

            var list = [];
            if (!obj || !isPlain(obj)) {
                return list;
            }


            var keys = [];

            /**
            * @inner
            * 内部使用的迭代函数。
            * @param {Object} obj 要进行迭代的对象。
            * @param {number} level 用来跟踪当前迭代键值所处的层次深度，辅助用的。
            */
            function each(obj, level) {

                for (var key in obj) {

                    var value = obj[key];

                    keys = keys.slice(0, level);
                    keys.push(key);

                    if (isPlain(value)) {   //还是一个纯对象
                        each(value, level + 1);     //递归处理
                        continue;
                    }

                    //叶子结点
                    list.push({
                        'keys': keys,
                        'value': value
                    });
                }
            }

            each(obj, 0);

            return list;

        },

        /**
        * 对一个对象进行迭代。
        * 该方法可以代替 for in 的语句。
        * 只有在回调函数中明确返回 false 才停止循环。
        * @param {Object} obj 要进行迭代处理的对象
        * @param {function} fn 要进行迭代处理的回调函数，该函数中会接收到当前对象迭代的到 key 和 value 作为参数
        * @param {boolean} [isDeep=false] 
            指示是否要进行深层次的迭代，如果是，请指定 true；
            否则请指定 false 或不指定。默认为 false，即浅迭代
        * @example
            var obj = {
                a: 1, 
                b: 2, 
                c: {
                    A: 11, 
                    B: 22
                } 
            };

            $Object.each(obj, function(key, value) {
                console.log(key, ': ', value);
            }, true);
        输出：
            a: 1,
            b: 2,
            c: { A: 11, B: 22},
            A: 11,
            B: 22
        */
        each: function (obj, fn, isDeep) {

            var each = arguments.callee;

            for (var key in obj) {
                var value = obj[key];

                // 只有在 fn 中明确返回 false 才停止循环
                if (fn(key, value) === false) {
                    break;
                }

                //指定了深迭代，并且当前 value 为非 null 的对象
                if (isDeep === true && value && typeof value == 'object') {
                    each(value, fn, true); //递归
                }

            }
        },

        /**
        * 对象映射转换器，返回一个新的对象。
        * @param {Object} obj 要进行迭代处理的对象
        * @param {function} fn 要进行迭代处理的回调函数，该函数中会接收到当前对象迭代的到 key 和 value 作为参数
        * @param {boolean} [isDeep=false] 指示是否要进行深层次的迭代。
            如果是，请指定 true；
            否则请指定 false 或不指定。
            默认为 false，即浅迭代
        * @return {Object} 返回一个新的对象，key 仍为原来的 key，value 由回调函数得到
        * @example
            var obj = {a: 1, b: 2, c: {A: 11, B: 22} };
            var obj2 = $Object.map(obj, function(key, value) {
                return value * 100;
            }, true);
            console.dir(obj2);
        结果：
            obj2 = {a: 100, b: 200, c: {A: 1100, B: 2200}};
        */
        map: function (obj, fn, isDeep) {
            var map = arguments.callee; //引用自身，用于递归
            var isPlain = exports.isPlain;

            var target = {};

            for (var key in obj) {
                var value = obj[key];

                if (isDeep && isPlain(value)) { //指定了深迭代，并且当前 value 为纯对象
                    target[key] = map(value, fn, isDeep); //递归
                }
                else {
                    target[key] = fn(key, value);
                }
            }

            return target;
        },




        
        /**
        * 用指定的键和值组合生成一个对象，支持批量操作。
        * @param {string|number|boolean|Array} key 生成对象所用的键。
            当是数组时，表示批量操作，格式必须是二元组。
        * @param value 生成对象所用的值。
        * @return {Object} 返回一个生成后的对象。
        * @example
    
            //单个操作
            var obj = $Object.make('a', 1);
            console.dir(obj); //得到 obj = { a: 1 };
    
            //批量操作
            var obj = $Object.make( 
                ['a', 1], 
                ['b', 2], 
                ['c', 3]
            );
            console.dir(obj); //得到 obj = { a: 1, b: 2, c: 3};
        */
        make: function (key, value) {


            var obj = {};

            if (Array.isArray(key)) {
                Array.from(arguments).forEach(function (pair, index) {
                    obj[pair[0]] = pair[1];
                });
            }
            else {
                obj[key] = value;
            }

            return obj;
        },


        /**
        * 对一个对象进行成员过滤，返回一个过滤后的新对象。
        * 该方法可以以某个模板对指定对象进行成员拷贝。
        * @param {Object} src 要进行拷贝的对象，即数据来源。
        * @param {Array|Object|string} samples 要拷贝的成员列表(模板)。
        * @return {Object} 返回一个过滤后的新对象。
        * @example
            var src = {
                a: 100,
                b: 200,
                c: 300,
                d: 400
            };
    
            var samples = {
                a: 1,
                b: 2
            };
    
            //或 samples = ['a', 'b'];
    
            var obj = $Object.filter(src, samples);
            console.dir(obj); //得到 obj = { a: 100, b: 200 }; 只保留 samples 中指定的成员，其他的去掉.
        */
        filter: function (src, samples) {

            var $Array = require('Array');

            var obj = {};

            if (Array.isArray(samples)) {
                samples.forEach(function (key, index) {
                    if (key in src) {
                        obj[key] = src[key];
                    }
                });
            }
            else if (exports.isPlain(samples)) {
                exports.each(samples, function (key, value) {

                    if (key in src) {
                        obj[key] = src[key];
                    }
                });
            }
            else if (typeof samples == 'string') {
                var key = samples;
                if (key in src) {
                    obj[key] = src[key];
                }

            }
            else {
                throw new Error('无法识别参数 samples 的类型');
            }


            return obj;
        },

        /**
        * 删除对象中指定的成员，返回一个新对象。
        * 指定的成员可以以单个的方式指定，也可以以数组的方式指定(批量)。
        * @param {Object} obj 要进行处理的对象。
        * @param {String|Array|Object} keys 要删除的成员名称，可以是单个，也可以是批量。
        * @return {Object} 返回一个被删除相应成员后的新对象。
        * @example
            var obj = {
                a: 1, 
                b: 2, 
                c: 3
            };
    
            var o = $Object.remove(obj, ['a', 'c']); //移除成员 a 和 c 
            console.dir(o); //得到 o = { b: 2 };
    
            o = $Object.remove(obj, {a: 1, b: 2});
            console.dir(o); //得到 o = { c: 3 };
        */
        remove: function (obj, keys) {
            var target = Object.assign({}, obj); //浅拷贝一份

            if (typeof keys == 'string') {
                delete target[keys];
            }
            else if (Array.isArray(keys)) {
                for (var i = 0, len = keys.length; i < len; i++) {
                    delete target[keys[i]];
                }
            }
            else {
                for (var key in keys) {
                    delete target[key];
                }
            }

            return target;
        },
    };

});



/**
* 数组工具。
* @namespace
* @name Array
*/
define('Array', function (require, module, exports) {


    module.exports = exports = /**@lends Array*/ {


        /**
        * 对数组进行迭代。 
        * 对数组中的每个元素执行指定的操作。
        * 可以指定为深层次的)
        * @param {Array} array 要进行迭代的数组。
        * @param {function} fn 要执行处理的回调函数，会接受到当前元素和其索引作为参数。
        *   只有在 fn 中明确返回 false 才停止循环(相当于 break)。
        * @param {boolean} [isDeep=false] 指定是否进行深层次迭代。
            如果要进行深层次迭代，即对数组元素为数组继续迭代的，请指定 true；否则为浅迭代。
        * @return {Array} 返回当前数组。
        * @example
            $Array.each([0, 1, 2, ['a', 'b']], function(item, index) {
                console.log(index + ': ' + item);
            }, true);
        */
        each: function (array, fn, isDeep) {

            var each = arguments.callee; //引用自身，用于递归

            for (var i = 0, len = array.length; i < len; i++) {

                var item = array[i];

                if (isDeep && (item instanceof Array)) { //指定了深层次迭代
                    each(item, fn, true);
                }
                else {
                    var value = fn(item, i);
                    if (value === false) {
                        break;
                    }
                }
            }

            return array;
        },


        /**
        * 把一个数组中的元素转换到另一个数组中，返回一个新的数组。
        * @param {Array} array 要进行转换的数组。
        * @param {function} fn 转换函数。
            该转换函数会为每个数组元素调用，它会接收到两个参数：当前迭代的数组元素和该元素的索引。
        * 转换函数可以返回转换后的值，有两个特殊值影响到迭代行为：
        *   null：忽略当前数组元素，即该元素在新的数组中不存在对应的项（相当于 continue）；
        *   undefined：忽略当前数组元素到最后一个元素（相当于break）；
        * @param {boolean} [isDeep=false] 指定是否进行深层次迭代。
            如果要进行深层次迭代，即对数组元素为数组继续迭代的，请指定 true；否则为浅迭代。
        * @return {Array} 返回一个转换后的新数组。
        */
        map: function (array, fn, isDeep) {

            var map = arguments.callee; //引用自身，用于递归
            var a = [];
            var value;

            for (var i = 0, len = array.length; i < len; i++) {
                var item = array[i];

                if (isDeep && (item instanceof Array)) {
                    value = map(item, fn, true); // 此时的 value 是一个 []
                }
                else {
                    value = fn(item, i);

                    if (value === null) {
                        continue;
                    }

                    if (value === undefined) { //注意，当回调函数 fn 不返回值时，迭代会给停止掉
                        break;
                    }
                }

                a.push(value);
            }

            return a;
        },

        /**
        * 将一个数组中的元素转换到另一个数组中，并且保留所有的元素，返回一个新数组。
        * 作为参数的转换函数会为每个数组元素调用，并把当前元素和索引作为参数传给转换函数。
        * 该方法与 map 的区别在于本方法会保留所有的元素，而不管它的返回是什么。
        * @param {Array} array 要进行转换的数组。
        * @param {function} fn 转换函数。
            该转换函数会为每个数组元素调用，它会接收到两个参数：当前迭代的数组元素和该元素的索引。
        * 转换函数可以返回转换后的值，有两个特殊值影响到迭代行为：
        * @param {boolean} [isDeep=false] 指定是否进行深层次迭代。
            如果要进行深层次迭代，即对数组元素为数组继续迭代的，请指定 true；否则为浅迭代。
        * @return {Array} 返回一个转换后的新数组。
        */
        keep: function (array, fn, isDeep) {

            var keep = arguments.callee; //引用自身，用于递归
            var a = [];

            for (var i = 0, len = array.length; i < len; i++) {
                var item = array[i];

                var value = isDeep && (item instanceof Array) ?
                        keep(item, fn, true) :
                        fn(item, i);

                a.push(value);
            }

            return a;
        },

        /**
        * 使用过滤函数过滤数组元素，返回一个新数组。
        * 此函数至少传递两个参数：待过滤数组和过滤函数。过滤函数必须返回 true 以保留元素或 false 以删除元素。
        * 转换函数可以返回转换后的值：
        * @param {Array} array 要进行转换的数组。
        * @param {function} fn 转换函数。
            该转换函数会为每个数组元素调用，它会接收到两个参数：当前迭代的数组元素和该元素的索引。
        * 转换函数可以返回转换后的值，有两个特殊值影响到迭代行为：
        * @param {boolean} [isDeep=false] 指定是否进行深层次迭代。
            如果要进行深层次迭代，即对数组元素为数组继续迭代的，请指定 true；否则为浅迭代。
        * @return {Array} 返回一个过滤后的新数组。
        */
        grep: function (array, fn, isDeep) {

            var grep = arguments.callee; //引用自身，用于递归
            var a = [];

            for (var i = 0, len = array.length; i < len; i++) {
                var item = array[i];

                if (isDeep && (item instanceof Array)) {
                    item = grep(item, fn, true);
                    a.push(item);
                }
                else {
                    var value = fn(item, i);
                    if (value === true) {
                        a.push(item);
                    }
                }
            }

            return a;
        },



        /**
        * 用滑动窗口的方式创建分组，即把转成二维数组。返回一个二维数组。
        * 可以指定窗口大小和步长。步长默认为1。
        */
        slide: function (array, windowSize, stepSize) {
            if (windowSize >= array.length) { //只够创建一组
                return [array];
            }

            stepSize = stepSize || 1;

            var groups = [];

            for (var i = 0, len = array.length; i < len; i = i + stepSize) {
                var end = i + windowSize;

                groups.push(array.slice(i, end));

                if (end >= len) {
                    break; //已达到最后一组
                }
            }

            return groups;
        },

        /**
        * 创建分组，即把转成二维数组。返回一个二维数组。
        * 当指定第三个参数为 true 时，可在最后一组向右对齐数据。
        */
        group: function (array, size, isPadRight) {
            var groups = exports.slide(array, size, size);

            if (isPadRight === true) {
                groups[groups.length - 1] = array.slice(-size); //右对齐最后一组
            }

            return groups;
        },


        /**
        * 对一个数组的所有元素进行求和。
        * 已重载 sum(array, fn)、sum(array)、sum(array, ignoreNaN)、sum(array, ignoreNaN, key)。
        * @param {Array} array 要进行求和的数组。
        * @param {boolean} [ignoreNaN=false] 指示是否忽略掉值为 NaN 的项。
            如果要忽略掉值为 NaN 的项，请指定为 true；否则为 false 或不指定。
        * @param {string} [key] 要读取的项的成员的键名称。
        *   如果指定第三个参数时，将读取数组元素中的对应的成员，该使用方式主要用于由 json 组成的的数组中。
        * @return {Number} 返回数组所有元素之和。
        * @example
            var a = [1, 2, 3, 4];
            var sum = $Array.sum(a); //得到 10
            //又如
            var a = [
                { value: 1 },
                { value: NaN },
                { value: 3 },
                { value: 4 },
            ];
            var sum = $Array.sum(a, true, 'value'); //得到 8
    
        */
        sum: function (array, ignoreNaN, key) {
            var sum = 0;

            //重载 sum(array, fn);
            if (typeof ignoreNaN == 'function') {
                var fn = ignoreNaN;

                exports.each(array, function (item, index) {

                    var value = fn(item, index);

                    if (typeof value != 'number') {
                        throw new Error('第 ' + index + ' 个元素的返回值不是数字');
                    }

                    sum += value;
                });

                return sum;
            }



            var hasKey = !(key === undefined);

            for (var i = 0, len = array.length; i < len; i++) {
                var value = hasKey ? array[i][key] : array[i];

                if (isNaN(value)) {
                    if (ignoreNaN === true) {
                        continue;
                    }
                    else {
                        throw new Error('第 ' + i + ' 个元素的值为 NaN');
                    }
                }
                else {
                    sum += Number(value); //可以处理 string
                }
            }

            return sum;
        },



        /**
        * 产生一个区间为 [start, end) 的半开区间的数组。
        * @param {number} start 半开区间的开始值。
        * @param {number} end 半开区间的结束值。
        * @param {number} [step=1] 填充的步长，默认值为 1。可以指定为负数。
        * @param {function} [fn] 转换函数。 会收到当前项和索引值作为参数。
        * @return {Array} 返回一个递增（减）的数组。
        *   当 start 与 end 相等时，返回一个空数组。
        * @example
            $Array.pad(2, 5); //产生一个从2到5的数组，步长为1，结果为[2, 3, 4, 5]
            $Array.pad(1, 9, 2); //产生一个从1到9的数组，步长为2，结果为[1, 3, 5, 7]
            $Array.pad(5, 2, -1); //产生一个从5到2的数组，步长为-1，结果为[5, 4, 3]
            //得到 [10, 20, 30]
            $Array.pad(1, 3, function (item, index) {
                return item * 10;
            });
        */
        pad: function (start, end, step, fn) {
            if (start == end) {
                return [];
            }

            if (typeof step == 'function') { // 重载 pad(start, end, fn)
                fn = step;
                step = 1;
            }
            else {
                step = Math.abs(step || 1);
            }


            var a = [];
            var index = 0;

            if (start < end) { //升序
                for (var i = start; i < end; i += step) {
                    var item = fn ? fn(i, index) : i;
                    a.push(item);
                    index++;
                }
            }
            else { //降序
                for (var i = start; i > end; i -= step) {
                    var item = fn ? fn(i, index) : i;
                    a.push(item);
                    index++;
                }
            }

            return a;

        },

    };

});
/**
* 路由
* @namespace
* @name Router
*/
define('Router', function (require, module, exports) {

    var name$fn = {};

    return {

        'set': function (name, fn) {
            if (name$fn[name]) {
                throw new Error('重复定义路由器: ' + name);
            }

            name$fn[name] = fn;
        },

        'get': function (require, module, nav) {

            var all = {};

            for (var name in name$fn) {
                var fn = name$fn[name];

                if (typeof fn == 'function') {
                    fn = fn(require, module, nav);
                }

                all[name] = fn;
            }

            return all;
        },
    };

   

});


/**
* 把请求后台接口代理到本地的工具类。
* @namespace
* @name Proxy
*/
define('Proxy', function (require, module,  exports) {

    var Defaults = require('Defaults');
    var Fn = require('Fn');
    
    var current = null;     //当前请求到的代理文件的响应结果 factory



    //模拟一个网络的随机延迟时间去执行一个回调函数
    function delay(fn) {

        var defaults = Defaults.get(module.id); //默认配置
        var delay = defaults.delay;
        var args = [].slice.call(arguments, 1); //提取 fn 后面的参数

        Fn.delay(delay, fn, args);

    }




    /**
    * 加载指定的 js 代理文件。
    * 注意：加载完 js 代理文件后，会先执行 js 代理文件的逻辑，再触发 onload 事件。
    * 经过试验发现，并发加载多个 js 文件，也会严格地按上述顺序对应的进行。
    */
    function loadJS(file, config) {

        var Url = module.require('Url');
        var url = Url.get(file);

        var Script = require('Script');
        Script.load(url, function () {

            var factory = current;
            current = null;

            if (typeof factory == 'function') {
                factory = factory(config.data, config);
            }

            done(factory, config);

        });
    }

    /**
    * 加载指定的 json 代理文件。
    */
    function loadJSON(file, config) {

        var Url = module.require('Url');
        var url = Url.get(file);

        var xhr = new XMLHttpRequest();
        xhr.open('get', url, true);

        xhr.onreadystatechange = function () {

            if (xhr.readyState != 4) {
                return;
            }

            if (xhr.status != 200) {
                delay(config.error);
                return;
            }

            var JSON = require('JSON');
            var json = JSON.parse(xhr.responseText);
            done(json, config);
        };

        xhr.send(null);
    }


    //加载完成后，根据状态分发事件。
    function done(json, config) {
        if (!json) {
            delay(config.error);
            return;
        }

        var successCode = config.successCode;
        var field = config.field;
        var code = json[field.code];

        if (code == successCode) { // 成功
            var data = json[field.data] || {};
            delay(config.success, data, json);
        }
        else { //失败
            var msg = json[field.msg] || '';
            delay(config.fail, code, msg, json);
        }
    }




    module.exports = exports = /**@lends Proxy*/ {

        /**
        * 发起代理请求。
        * @param {string} file 代理响应的文件地址。
        * @param {Object} config 配置对象。
        */
        request: function (file, config) {
     
            var Url = require('Url');

            if (Url.isExt(file, '.js')) { // 映射的响应是一个 js 文件
                loadJS(file, config);
                return;
            }

            if (Url.isExt(file, '.json')) {
                loadJSON(file, config);
                return;
            }

            throw new Error('不支持参数 file 的文件类型: ' + file);
        },

        /**
        * 响应代理请求。
        * 可以生成很复杂的动态数据，并根据提交的参数进行处理，具有真正模拟后台逻辑的能力。
        * 该方法仅用在代理响应文件中，且在调用之前必须先调用 request 方法。
        * 已重载 response(json)的情况。
        * @param {function|Object} factory 响应的处理函数或 json 对象。
        *   当传进来的 factory 为处理函数时，该函数会接收到两个参数：factory(data, config)。 其中：
        *   data 为发起 get 或 post 请求时最终的 data 字段；
        *   config 为发起 get 或 post 请求时全部的配置字段。
        */
        response: function (factory) {

            //var type = typeof factory;
            //var isValid = type == 'function' || type == 'object' && factory;

            //if (!isValid) {
            //    throw new Error('参数 factory 只能是函数或非空对象');
            //}
                
            current = factory;
        },

    };
});
/**
* Proxy 模块的默认配置
* @name Proxy.defaults
*/
define('Proxy.defaults', /**@lends Proxy.defaults*/ {
    /**
    * 加载代理响应文件的起始位置(或目录)。
    */
    base: '',

    /**
    * 为模拟真实网络环境而随机延迟的时间。
    * 格式为 { min: 500, max: 3000 }。
    * 当指定为 false 时，则禁用延迟。
    */
    delay: {
        /**
        * 随机延迟的最小毫秒数。
        */
        min: 500,
        /**
        * 随机延迟的最大毫秒数。
        */
        max: 3000
    },
});



/**
* 函数工具类
* @namespace
* @name Fn
*/
define('Fn', function (require, module, exports) {

    module.exports = exports = /**@lends Fn*/ {

        /**
        * 用一个的随机延迟时间去执行一个回调函数，并传递一些参数。
        * @param {Object} delay 延迟配置对象。
            如 {min: 500, max: 2000}，当不需要延迟时，则应为 null。
        * @param {function} fn 要延迟执行的函数。
        * @param {Array} [args] 要传递的参数数组。
        * @return {number} 返回 setTimeout 的结果。
        *   如果没有启用延迟，则不返回值。
        */
        delay: function (delay, fn, args) {
            if (!fn) {
                return;
            }


            if (delay === false || delay == null) { //不启用延迟
                fn.apply(null, args);
                return;
            }

            var $Math = require('Math');

            var timeout = typeof delay == 'number' ? delay :
                    $Math.randomInt(delay.min, delay.max);

            return setTimeout(function () {
                fn.apply(null, args);

            }, timeout);
        },

        
    };

});

/**
* 数学工具类
* @namespace
* @name Math
*/
define('Math', function (require, module, exports) {

    module.exports = exports = /**@lends Math*/ {

        /**
        * 产生指定闭区间的随机整数。
        * @param {number} [minValue=0] 闭区间的左端值。
            当只指定一个参数时，minValue 默认为 0；
        * @param {number} [maxValue] 闭区间的右端值。
        * @return 返回一个整数。<br />
            当不指定任何参数时，则用 Math.random() 产生一个已移除了小数点的随机整数。
        * @example
            $Math.randomInt(100, 200); //产生一个区间为 [100, 200] 的随机整数。
            $Math.randomInt(100); //产生一个区间为 [0, 200] 的随机整数。
            $Math.randomInt(); //产生一个随机整数。
        */
        randomInt: function (minValue, maxValue) {

            var len = arguments.length;

            if (len == 0) { //重载 Math.randomInt()
                //先称除小数点，再去掉所有前导的 0，最后转为 number
                return Number(String(Math.random()).replace('.', '').replace(/^0*/g, ''));
            }

            if (len == 1) { //重载 Math.randomInt(maxValue)
                maxValue = minValue;    
                minValue = 0;
            }

            var count = maxValue - minValue + 1;
            return Math.floor(Math.random() * count + minValue);
        },

        /**
        * 圆形求模方法。
        * 即用圆形链表的方式滑动一个数，返回一个新的数。
        * 即可正可负的双方向求模。
        * 可指定圆形链表的长度(size) 和滑动的步长(step)，滑动步长的正负号指示了滑动方向
        */
        slide: function (index, size, step) {
            step = step || 1; //步长默认为1

            index += step;
            if (index >= 0) {
                return index % size;
            }

            return (size - (Math.abs(index) % size)) % size;
        },

        /**
        * 下一个求模数
        */
        next: function (index, size) {
            return exports.slide(index, size, 1);
        },

        /**
        * 上一个求模数
        */
        previous: function (index, size, step) {
            return exports.slide(index, size, -1);
        },


        /**
        * 把一个含有百分号的字符串解析成等值的小数。
        * @param {string} v 要解析的参数。
            期望得到 string 类型，实际可传任何类型。
        * @return {Number} 返回一个小数。
            只有参数是字符串，并且去掉前后空格后以百分号结尾才会进行转换；否则直接返回参数。
            如果解析失败，则返回 NaN。
        */
        parsePercent: function (v) {
            if (typeof v != 'string') {
                return v;
            }

            var s = v.trim();

            if (s.slide(-1) != '%') {
                return v;
            }

            return parseFloat(s) / 100;
           
        }

    };

});

/**
* Script 脚本工具
* @namespace
* @name Script
*/
define('Script', function (require, module, exports) {

    var $String = require('String');
    var $Object = require('Object');

    var defaults = {
        url: '',
        id: '',
        charset: 'utf-8',
        document: window.document,
        onload: null
    };


    /**
    * 加载单个
    * @inner
    */
    function loadItem(url, charset, document, onload) {

        var id;

        if (typeof url == 'object') { //传入的是一个 {} 
            var config = url;

            id = config.id;
            url = config.url;
            charset = config.charset;
            document = config.document;
            onload = config.onload;
        }


        var script = document.createElement('script');

        if (onload) { //指定了回调函数，则设置它
            if (script.readyState) { //IE
                /**@ignore*/
                script.onreadystatechange = function () {

                    var readyState = script.readyState;

                    if (readyState == 'loaded' || readyState == 'complete') {
                        script.onreadystatechange = null; //避免重复执行回调
                        onload();
                    }
                };
            }
            else { //标准
                script.onload = onload;
            }

        }

        script.src = url;

        if (charset) {
            script.charset = charset;
        }

        if (id) {
            script.id = id;
        }

        document.head.appendChild(script);
    }

    /**
    * 顺序加载批量
    * @inner
    */
    function loadList(urls, charset, document, fn) {

        if (urls.length == 0) {
            fn && fn();
            return;
        }



        var index = 0;

        (function () {

            var next = arguments.callee;
            var url = urls[index];

            loadItem(url, charset, document, function () {
                index++;

                if (index < urls.length) {
                    next();
                }
                else {
                    fn && fn();
                }
            });

        })();


    }




    

    module.exports = exports = /**@lends Script*/ {

        /**
        * 跨浏览器动态加载 JS 文件，并在加载完成后执行指定的回调函数。
        * @param {string|Array} params.url 
            要加载的 JS 文件的 url 地址，如果要批量加载，则为一个地址数组。
        * @param {string} [params.charset="utf-8"] 
            要加载的 JS 文件的字符编码，默认为 utf-8。
        * @param {Document} [params.document=window.document] 
            要加载的 JS 文件的上下文环境的 document，默认为当前窗口的 document 对象。
        * @param {function} [params.onload] 
            加载成功后的回调函数。
        * @example
            Script.load({
                url: 'a.js',
                charset: 'utf-8',
                document: document,
                id: 'myScript',
                onload: function (){ }
            });

            Script.load('a.js', 'utf-8', document, function(){});
            Script.load('a.js', 'utf-8', function(){});
            Script.load('a.js', document, function(){});
            Script.load('a.js', function(){});

            //批量加载
            Script.load(['a.js', 'b.js'], function(){});
        */
        load: function (params) {


            var obj = Object.assign({}, defaults); //复制一份

            //注意，params 有可能是个数组，不能用 typeof 为 'object'
            if ($Object.isPlain(params)) { //纯对象 {}
                Object.assign(obj, params);
            }
            else {
                obj.url = params;

                switch (typeof arguments[1]) {
                    case 'string':
                        obj.charset = arguments[1];
                        break;
                    case 'object':
                        obj.document = arguments[1];
                        break;
                    case 'function':
                        obj.onload = arguments[1];
                        break;
                }

                switch (typeof arguments[2]) {
                    case 'object':
                        obj.document = arguments[2];
                        break;
                    case 'function':
                        obj.onload = arguments[2];
                        break;
                }

                if (arguments[3]) {
                    obj.onload = arguments[3];
                }
            }

            var url = obj.url;

            if (typeof url == 'string') {
                loadItem(obj);
            }
            else if (url instanceof Array) {
                loadList(url, obj.charset, obj.document, obj.onload);
            }
            else {
                throw new Error('参数 params.url 必须为 string 或 string 的数组');
            }

        },


    };

});




/**
* 字符串工具类。
* @namespace
* @name String
*/
define('String', function (require, module, exports) {

    module.exports = exports = /**@lends String */ {

        /**
        * 用指定的值去填充一个字符串。
        * 当不指定字符串的填充标记时，则默认为 {}。
        * @param {String} string 要进行格式填充的字符串模板。
        * @param {Object} obj 要填充的键值对的对象。
        * @return 返回一个用值去填充后的字符串。
        * @example
            $String.format('{id}{type}', {id: 1, type: 'app'});
            $String.format('{2}{0}{1}', 'a', 'b', 'c');
        */
        format: function (string, obj) {
            var s = string;
            var replaceAll = exports.replaceAll;

            if (typeof obj == 'object') {
                for (var key in obj) {
                    var value = obj[key];

                    if (Array.isArray(value)) {
                        value = value.join('');
                    }

                    s = replaceAll(s, '{' + key + '}', value);
                }
            }
            else {
                var args = [].slice.call(arguments, 1);
                for (var i = 0, len = args.length; i < len; i++) {
                    var value = args[i];

                    if (Array.isArray(value)) {
                        value = value.join('');
                    }

                    s = replaceAll(s, '{' + i + '}', value);
                }
            }

            return s;
        },



        /**
        * 对字符串进行全局替换。
        * @param {String} target 要进行替换的目标字符串。
        * @param {String} src 要进行替换的子串，旧值。
        * @param {String} dest 要进行替换的新子串，新值。
        * @return {String} 返回一个替换后的字符串。
        * @example
            $String.replaceAll('abcdeabc', 'bc', 'BC') //结果为 aBCdeBC
        */
        replaceAll: function (target, src, dest) {
            return target.split(src).join(dest);
        },


        /**
        * 对字符串进行区间内的替换。
        * 该方法会把整个区间替换成新的字符串，包括区间标记。
        * @param {String} string 要进行替换的目标字符串。
        * @param {String} startTag 区间的开始标记。
        * @param {String} endTag 区间的结束标记
        * @param {String} newString 要进行替换的新子串，新值。
        * @return {String} 返回一个替换后的字符串。<br />
        *   当不存在开始标记或结束标记时，都会不进行任何处理而直接返回原字符串。
        * @example
            $String.replaceBetween('hello #--world--# this is #--good--#', '#--', '--#', 'javascript') 
            //结果为 'hello javascript this is javascript'
        */
        replaceBetween: function (string, startTag, endTag, newString) {
            var startIndex = string.indexOf(startTag);
            if (startIndex < 0) {
                return string;
            }

            //从开始标记之后位置的开始算起
            var endIndex = string.indexOf(endTag, startIndex + startTag.length);
            if (endIndex < 0) {
                return string;
            }

            var prefix = string.slice(0, startIndex);
            var suffix = string.slice(endIndex + endTag.length);

            return prefix + newString + suffix;
        },


        /**
        * 右对齐此实例中的字符，在左边用指定的 Unicode 字符填充以达到指定的总长度。
        * 当指定的总长度小实际长度时，将从右边开始算起，做截断处理，以达到指定的总长度。
        * @param {String} string 要进行填充对齐的字符串。
        * @param {Number} totalWidth 填充后要达到的总长度。
        * @param {String} paddingChar 用来填充的模板字符串。
        * @return {String} 返回一个经过填充对齐后的新字符串。
        * @example
            $String.padLeft('1234', 6, '0'); //结果为 '001234'，右对齐，从左边填充 '0'
            $String.padLeft('1234', 2, '0'); //结果为 '34'，右对齐，从左边开始截断
        */
        padLeft: function (string, totalWidth, paddingChar) {
            string = String(string); //转成字符串

            var len = string.length;
            if (totalWidth <= len) { //需要的长度短于实际长度，做截断处理
                return string.substr(-totalWidth); //从后面算起
            }

            paddingChar = paddingChar || ' ';

            var arr = [];
            arr.length = totalWidth - len + 1;

            return arr.join(paddingChar) + string;
        },


        /**
        * 左对齐此字符串中的字符，在右边用指定的 Unicode 字符填充以达到指定的总长度。
        * 当指定的总长度小实际长度时，将从左边开始算起，做截断处理，以达到指定的总长度。
        * @param {String} string 要进行填充对齐的字符串。
        * @param {Number} totalWidth 填充后要达到的总长度。
        * @param {String} paddingChar 用来填充的模板字符串。
        * @return {String} 返回一个经过填充对齐后的新字符串。
        * @example
            $String.padLeft('1234', 6, '0'); //结果为 '123400'，左对齐，从右边填充 '0'
            $String.padLeft('1234', 2, '0'); //结果为 '12'，左对齐，从右边开始截断
        */
        padRight: function (string, totalWidth, paddingChar) {
            string = String(string); //转成字符串

            var len = string.length;
            if (len >= totalWidth) {
                return string.substring(0, totalWidth);
            }

            paddingChar = paddingChar || ' ';

            var arr = [];
            arr.length = totalWidth - len + 1;


            return string + arr.join(paddingChar);
        },

        /**
        * 获取位于两个标记子串之间的子字符串。
        * @param {String} string 要进行获取的大串。
        * @param {String} beginTag 区间的开始标记。
        * @param {String} endTag 区间的结束标记。
        * @return {String} 返回一个子字符串。当获取不能结果时，统一返回空字符串。
        * @example
            $String.between('abc{!hello!} world', '{!', '!}'); //结果为 'hello' 
        */
        between: function (string, beginTag, endTag) {
            var startIndex = string.indexOf(beginTag);
            if (startIndex < 0) {
                return '';
            }

            startIndex += beginTag.length;

            var endIndex = string.indexOf(endTag, startIndex);
            if (endIndex < 0) {
                return '';
            }

            return string.substr(startIndex, endIndex - startIndex);
        },

        /**
        * 产生指定格式或长度的随机字符串。
        * @param {string|int} [formater=12] 随机字符串的格式，或者长度（默认为12个字符）。
            格式中的每个随机字符用 'x' 来占位，如 'xxxx-1x2x-xx'
        * @return {string} 返回一个指定长度的随机字符串。
        * @example
            $String.random();      //返回一个 12 位的随机字符串
            $String.random(64);    //返回一个 64 位的随机字符串
            $String.random('xxxx-你好xx-xx'); //类似 'A3EA-你好B4-DC'
        */
        random: function (formater) {
            if (formater === undefined) {
                formater = 12;
            }

            //如果传入的是数字，则生成一个指定长度的格式字符串 'xxxxx...'
            if (typeof formater == 'number') {
                var size = formater + 1;
                if (size < 0) {
                    size = 0;
                }
                formater = [];
                formater.length = size;
                formater = formater.join('x');
            }

            return formater.replace(/x/g, function (c) {
                var r = Math.random() * 16 | 0;
                return r.toString(16);
            }).toUpperCase();
        },


        //---------------转换部分 -----------------------------------------------------

        /**
        * 把一个字符串转成骆驼命名法。。
        * 如 'font-size' 转成 'fontSize'。
        * @param {String} string 要进行转换的字符串。
        * @return 返回一个骆驼命名法的新字符串。
        * @example
            $String.toCamelCase('background-item-color') //结果为 'backgroundItemColor'
        */
        toCamelCase: function (string) {
            var rmsPrefix = /^-ms-/;
            var rdashAlpha = /-([a-z]|[0-9])/ig;

            return string.replace(rmsPrefix, 'ms-').replace(rdashAlpha, function (all, letter) {
                return letter.toString().toUpperCase();
            });

            /* 下面的是 mootool 的实现
            return string.replace(/-\D/g, function(match) {
                return match.charAt(1).toUpperCase();
            });
            */
        },

        /**
        * 把一个字符串转成短线连接法。
        * 如 fontSize 转成 font-size
        * @param {String} string 要进行转换的字符串。
        * @return 返回一个用短线连接起来的新字符串。
        * @example
            $String.toHyphenate('backgroundItemColor') //结果为 'background-item-color'
        */
        toHyphenate: function (string) {
            return string.replace(/[A-Z]/g, function (match) {
                return ('-' + match.charAt(0).toLowerCase());
            });
        },

        /**
        * 把一个字符串转成 UTF8 编码。
        * @param {String} string 要进行编码的字符串。
        * @return {String} 返回一个 UTF8 编码的新字符串。
        * @example
            $String.toUtf8('你好'); //结果为 ''
        */
        toUtf8: function (string) {

            var $Array = require('Array');
            var a = [];

            $Array.each(string.split(''), function (ch, index) {
                var code = ch.charCodeAt(0);
                if (code < 0x80) {
                    a.push(code);
                }
                else if (code < 0x800) {
                    a.push(((code & 0x7C0) >> 6) | 0xC0);
                    a.push((code & 0x3F) | 0x80);
                }
                else {
                    a.push(((code & 0xF000) >> 12) | 0xE0);
                    a.push(((code & 0x0FC0) >> 6) | 0x80);
                    a.push(((code & 0x3F)) | 0x80);
                }
            });

            return '%' + $Array.keep(a, function (item, index) {
                return item.toString(16);
            }).join('%');
        },


        /**
        * 把一个字符串转成等价的值。
        * 主要是把字符串形式的 0|1|true|false|null|undefined|NaN 转成原来的数据值。
        * 当参数不是字符串或不是上述值之一时，则直接返回该参数，不作转换。
        * @param {Object} value 要进行转换的值，可以是任何类型。
        * @return {Object} 返回一个等价的值。
        * @example
            $String.toValue('NaN') //NaN
            $String.toValue('null') //null
            $String.toValue('true') //true
            $String.toValue('false') //false
            $String.toValue({}) //不作转换，直接原样返回
        */
        toValue: function (value) {
            if (typeof value != 'string') { //拦截非字符串类型的参数
                return value;
            }

            var maps = {
                //'0': 0,
                //'1': 1,
                'true': true,
                'false': false,
                'null': null,
                'undefined': undefined,
                'NaN': NaN
            };

            return value in maps ? maps[value] : value;

        },

        //---------------分裂和提取部分 -----------------------------------------------------

        /**
        * 对一个字符串进行多层次分裂，返回一个多维数组。
        * @param {String} string 要进行分裂的字符串。
        * @param {Array} separators 分隔符列表数组。
        * @return {Array} 返回一个多维数组，该数组的维数，跟指定的分隔符 separators 的长度一致。
        * @example
            var string = 'a=1&b=2|a=100&b=200;a=111&b=222|a=10000&b=20000';
            var separators = [';', '|', '&', '='];
            var a = $String.split(string, separators);
            //结果 a 为
            a = 
            [                           // ';' 分裂的结果
                [                       // '|'分裂的结果
                    [                   // '&'分裂的结果
                        ['a', '1'],     // '='分裂的结果
                        ['b', '2']
                    ],
                    [
                        ['a', '100'],
                        ['b', '200']
                    ]
                ],
                [
                    [
                        ['a', '111'],
                        ['b', '222']
                    ],
                    [
                        ['a', '10000'],
                        ['b', '20000']
                    ]
                ]
            ];
        * 
        */
        split: function (string, separators) {

            var $Array = require('Array');

            var list = String(string).split(separators[0]);

            for (var i = 1, len = separators.length; i < len; i++) {
                list = fn(list, separators[i], i);
            }

            return list;


            //一个内部方法
            function fn(list, separator, dimension) {
                dimension--;

                return $Array.map(list, function (item, index) {

                    return dimension == 0 ?
                            String(item).split(separator) :
                            fn(item, separator, dimension); //递归
                });
            }


        },


       

      
        /**
        * 对一个字符串进行多层级模板解析，返回一个带有多个子名称的模板。
        * @param {string} text 要进行解析的模板字符串。
        * @param {Array} tags 多层级模板中使用的标记。
        * @return {Object} 返回一个带有多个子名称的模板。
        */
        getTemplates: function (text, tags) {

            var item0 = tags[0];

            //缓存一下，以提高 for 中的性能
            var between = exports.between;
            var replaceBetween = exports.replaceBetween;


            var samples = {};

            //先处理最外层，把大字符串提取出来。 因为内层的可能在总字符串 text 中同名
            var s = between(text, item0.begin, item0.end);

            //倒序处理子模板。 注意: 最外层的不在里面处理
            tags = tags.slice(1).reverse();

            tags.forEach(function (item, index) {

                var name = item.name || index;
                var begin = item.begin;
                var end = item.end;

                var fn = item.fn;

                var sample = between(s, begin, end);

                if ('outer' in item) { //指定了 outer
                    s = replaceBetween(s, begin, end, item.outer);
                }

                if (fn) { //指定了处理函数
                    sample = fn(sample, item);
                }

                samples[name] = sample;

            });

            var fn = item0.fn;
            if (fn) { //指定了处理函数
                s = fn(s, item0);
            }

            samples[item0.name] = s; //所有的子模板处理完后，就是最外层的结果

            return samples;

        },

        /**
        * 获取一个字符串的字节长度。
        * 普通字符的字节长度为 1；中文等字符的字节长度为 2。
        * @param {string} s 要进行解析的字符串。
        * @return {Number} 返回参数字符串的字节长度。
        */
        getByteLength: function (s) {
            if (!s) {
                return 0;
            }

            return s.toString().replace(/[\u0100-\uffff]/g, '  ').length;
        },


    };




});







/**
* JSON 工具类
* @class
* @name JSON
*/
define('JSON', function (require, module,  exports) {

    var JSON = window.JSON;

    module.exports = exports = /**@lends JSON*/ {


        /**
        * 把一个 JSON 字符串数据解析成对象。
        */
        parse: function (content) {

            try {
                var obj = JSON.parse(content);
                return obj;
            }
            catch (ex) {
                console.warn('使用原生的 JSON.parse() 方法无法解析:', content);
            }


            try {
                //这种方法是 jQuery 的实现，有问题。
                //content = content.replace(/^(\r\n)+/g, ' ');
                //return (new Function('return ' + content))();

                //下面这方法安全、可靠些。
                //包装多一层匿名立即执行函数。
                var js = [
                    'return (function () { ',
                    '   var obj = ' + content + ';', //因为 return 的换行问题，这里用一个 obj 变量再返回 obj 会安全很多。
                    '   return obj;',
                    '})();',

                ].join('\r\n');

                var fn = new Function(js);
                var obj = fn();

                return obj;
            }
            catch (ex) {
                console.warn('使用 new Function() 方法无法解析:', content);
            }

            return null;

        },

        /**
        * 把一个对象解析成 JSON 字符串。
        */
        stringify: function () {
            return JSON.stringify(...arguments);
        },
    };

});




/**
* 当前页面的 Url 工具类
* @namespace
* @name Url
*/
define('Url', function (require, module, exports) {

 
    var $String = require('String');

    var root = '';  //网站的根地址。
    var url = '';   //kisp.debug.js 或 kisp.min.js 文件所在的地址。
    var dir = '';   //kisp.debug.js 或 kisp.min.js 文件所在的目录。



    module.exports = exports = /**@lends Url*/ {

        /**
        * 获取当前 web 站点的根目录。
        */
        root: function () {
            if (root) {
                return root;
            }

            var Defaults = require('Defaults');
            var defaults = Defaults.get(module.id); //默认配置
            root = defaults.root;

            if (typeof root == 'function') {
                root = root();
            }

            //确保以 '/' 结尾。
            if (root.slice(-1) != '/') {
                root += '/';
            }

            return root;
        },

        /**
        * 获取 KISP 框架文件所对应的 url 地址目录。
        */
        dir: function () {
            if (dir) {
                return dir;
            }

            var url = exports.get();
            dir = url.split('/').slice(0, -1).join('/') + '/';
            return dir;
        },

        /**
        * 获取 KISP 框架文件所对应的 url 地址。
        */
        get: function () {
            if (url) {
                return url;
            }


            var KISP = require('KISP');
            var Defaults = require('Defaults');
            var defaults = Defaults.get(module.id); //默认配置
            var id = defaults.id;
            var script = null;

            if (id) {
                script = document.getElementById(id);
            }

            if (!script) {
                var file = 'kisp.' + KISP.edition + '.js';
                var list = document.querySelectorAll('script');

                script = Array.from(list).find(function (script) {
                    var src = script.src.split('?')[0];
                    return src.endsWith(file);
                });
            }

            url = script.src.split('?')[0];
            return url;

        },

        /**
        * 获取 url 的主体部分，即去掉 query 和 hash 后的部分。
        */
        main: function (url) {
            url = url.split('#')[0];
            url = url.split('?')[0];

            return url;
        },


        /**
       * 检查给定的 url 是否为完整的 url。
       * 即是否以 'http://' 或 'https://' 开头。
       * @param {string} url 要检查的 url。
       */
        isFull: function (url) {
            if (typeof url != 'string') {
                return false;
            }

            return url.startsWith('http://') ||
                url.startsWith('https://');
        },


        /**
        * 检测指定的 url 是否为特定的扩展名类型的文件。
        * @param {string} url 要检测的文件名。
        * @param {string} ext 要检测的扩展名，以 "." 开始。
        * @return {boolean} 如果该文件名以指定的扩展名结尾，则返回 true；否则返回 false。
        * @example 
            Url.is('a/b/c/login.JSON', '.json'); //返回 true
        */
        isExt: function (url, ext) {

            if (typeof url != 'string' || typeof ext != 'string') {
                return false;
            }

            url = exports.main(url);

            return url.slice(0 - ext.length).toLowerCase() == ext.toLowerCase();
        },




        resolve: function (baseUrl /* ...urls */) {
            var len = arguments.length;
            if (len == 0) {
                throw new Error('resolveUrl requires at least one argument; got none.');
            }

            var base = document.createElement('base');
            base.href = baseUrl;

            if (len == 1) {
                return base.href;
            }


            var head = document.head;
            head.insertBefore(base, head.firstChild);

            var url = '';
            var a = document.createElement('a');
            

            for (var i = 1; i < len; i++) {
                a.href = arguments[i];
                url = a.href;
                base.href = url;
            }

            head.removeChild(base);

            return url;
        }
        
    };

});

/**
* Url 模块的默认配置。
* @name Url.defaults
*/
define('Url.defaults',  {

    //注意：这里取当前页面的路径作为根地址，只适用于当前页面在根目录的情况。
    //IE10 及以下 location.origin 不存在
    root: location.protocol + '//' + location.host +
            location.pathname.split('/').slice(0, -1).join('/') + '/',

    id: 'script-KISP',

});

/**
*
*/
define('Proxy/Url', function (require, module, exports) {

 
    var Defaults = require('Defaults');
    var Query = require('Query');
    var Url = require('Url');


    function get(url) {

        //绝对地址
        if (Url.isFull(url)) {
            return url;
        }
            

        //相对地址

        var defaults = Defaults.get(module.parent.id); //默认配置
        var base = defaults.base;

        if (Url.isFull(base)) {
            return base + url;
        }


        var root = Url.root();
        if (url.slice(0, 1) != '/') {
            root = root + base;
        }

        return root + url;
    }





    return {
        'get': function (url) {
            url = get(url);

            //增加随机查询字符串，确保拿到最新的
            return Query.random(url); 
        },
    };


});

/**
* Query 工具类
* @namespace
* @name Query
*/
define('Query', function (require, module, exports) {

    var $Object = require('Object');


    module.exports = exports = /**@lends Query */ {


        /**
        * 把 url 中的查询字符串解析为等价结构的 Object 对象。
        * @param {string} url 要进行解析的查询字符串。
        * @param {boolean} [isShallow=false] 指示是否使用浅层次进行解析。
            当显式指定 isShallow 参数为 true 时，则使用浅层次来解析(只解析一层，不进行递归解析)；
            否则(默认)使用深层次解析。
        * @param {boolean} [isCompatible=false] 指示是否使用兼容模式进行解码。
            当指定 isCompatible 参数为 true 时，将使用 unescape 来编码；
            否则(默认)使用 decodeURIComponent。
        * @return {Object} 返回一个包含键值对的 Object 对象。
            当参数 url 非法时，返回空对象 {}。
        * @example
            var url = 'a=1&b=2&c=A%3D100%26B%3D200';
            var obj = Query.parse(url);
        得到 obj = {a: 1, b:2, c: {A: 100, B: 200}};
        */
        parse: function (url, isShallow, isCompatible) {

            if (!url || typeof url != 'string') {
                return {}; //这里不要返回 null，免得外部调用出错
            }

            var $String = require('String');

            var decode = isCompatible ? unescape : decodeURIComponent;  //解码方法，默认用后者
            var isDeep = !isShallow;    //深层次解析，为了语义上更好理解，换个名称
            var toValue = $String.toValue; //缓存一下方法，以提高循环中的性能


            var obj = {};

            url.split('&').map(function (item) {
                var pair = item.split('=');
                var name = decode(pair[0]);
                var value = pair[1];

                if (pair.length > 1) {
                    value = decode(value);

                    //深层次解析
                    if (isDeep && value.indexOf('=') > 0) { //还出现=号，说明还需要进一层次解码
                        value = exports.parse(value); //递归调用
                    }
                    else { //处理一下字符串类型的 0|1|true|false|null|undefined|NaN
                        value = toValue(value); //还原常用的数据类型
                    }
                }

                var existed = name in obj;

                if (!existed) {
                    obj[name] = value;
                    return;
                }


                //支持重复名称，如果有则放到一个数组里。
                var old = obj[name];

                if (old instanceof Array) {
                    old.push(value);
                }
                else {
                    obj[name] = [old, value];
                }

            });



            return obj;
        },

        /**
        * 把一个对象编码成等价结构的 url 查询字符串。
        * @param {Object} obj 要进行编码的对象
        * @param {boolean} [isCompatible=false] 
            指定是否要使用兼容模式进行编码。
            当需要使用 escape 进行编码时，请指定 true；
            否则要使用 encodeURIComponent 进行编码，请指定 false 或不指定。
        * @return {string} 返回一个经过编码的 url 查询字符串
        * @example
            var obj = {
                a: 1,
                b: 2,
                c: { A: 100, B: 200 },
                d: null,
                e: undefined,
                f: ['a', 'b', 'c']
            };
            var s = Query.stringify(obj);
            console.log(s); 
            //结果 a=1&b=2&c=A%3D100%26B%3D200&d=null&e=undefined&f=%5Ba%2C%20b%5D
        */
        stringify: function (obj, isCompatible) {

            if (obj == null) {     // null 或 undefined
                return String(obj);
            }

            switch (typeof obj) {
                case 'string':
                case 'number':
                case 'boolean':
                    return obj;
            }

            if (obj instanceof String || obj instanceof Number || obj instanceof Boolean || obj instanceof Date) {
                return obj.valueOf();
            }

            if (Array.isArray(obj)) {
                return '[' + obj.join(', ') + ']';
            }

            var encode = isCompatible ? escape : encodeURIComponent;
            var pairs = [];



            $Object.each(obj, function (key, value) {
                key = encode(key);

                if (value === undefined) {
                    pairs.push(key);
                    return;
                }

                value = exports.stringify(value);
                value = encode(value);

                pairs.push(key + '=' + value);

            });


            return pairs.join('&');

        },


        /**
        * 获取指定 url 的查询字符串中指定的键所对应的值。
        * 已重载 get(url, key, ignoreCase);
        * 已重载 get(location, key, ignoreCase);
        * 已重载 get(window, key, ignoreCase);
        * @param {string} url 要进行获取的 url 字符串。
        * @param {string} [key] 要检索的键。
        * @param {boolean} [ignoreCase=false] 是否忽略参数 key 的大小写。 默认区分大小写。
            如果要忽略 key 的大小写，请指定为 true；否则不指定或指定为 false。
            当指定为 true 时，将优先检索完全匹配的键所对应的项；若没找到然后再忽略大小写去检索。
        * @retun {string|Object|undefined} 返回一个查询字符串值。
            当不指定参数 key 时，则获取全部查询字符串，返回一个等价的 Object 对象。
            当指定参数 key 为一个空字符串，则获取全部查询字符串，返回一个 string 类型值。
        * @example
            Query.get('http://test.com?a=1&b=2#hash', 'a');  //返回 '1'
            Query.get('http://test.com?a=1&b=2#hash', 'c');  //返回 undefined
            Query.get('http://test.com?a=1&A=2#hash', 'A');  //返回 2
            Query.get('http://test.com?a=1&b=2#hash', 'A', true);//返回 1
            Query.get('http://test.com?a=1&b=2#hash', '');   //返回 'a=1&b=2'
            Query.get('http://test.com?a=1&b=2#hash');       //返回 {a: '1', b: '2'}
            Query.get('http://test.com?a=&b=');              //返回 {a: '', b: ''}
            Query.get('http://test.com?a&b');                //返回 {a: '', b: ''}
            Query.get('http://test.com?a', 'a');             //返回 ''
        */
        get: function (url, key, ignoreCase) {

            //重载 get(location, key, ignoreCase)
            //重载 get(window, key, ignoreCase)
            if (typeof url == 'object') {
                url = ('href' in url) ? url.href :  //location
                    url.location.href;              //window
            }

            var beginIndex = url.indexOf('?');
            if (beginIndex < 0) { //不存在查询字符串
                return;
            }

            var endIndex = url.indexOf('#');
            if (endIndex < 0) {
                endIndex = url.length;
            }

            var qs = url.slice(beginIndex + 1, endIndex);
            if (key === '') { //获取全部查询字符串的 string 类型
                return decodeURIComponent(qs);
            }


            var obj = exports.parse(qs);

            if (key === undefined) { //未指定键，获取整个 Object 对象
                return obj;
            }

            if (!ignoreCase || key in obj) { //区分大小写或有完全匹配的键
                return obj[key];
            }

            //以下是不区分大小写
            key = key.toString().toLowerCase();

            for (var name in obj) {
                if (name.toLowerCase() == key) {
                    return obj[name];
                }
            }

        },



        /**
        * 给指定的 url 添加一个查询字符串。
        * 注意，该方法会保留之前的查询字符串，并且覆盖同名的查询字符串。
        * @param {string} url 组装前的 url。
        * @param {string|Object} key 要添加的查询字符串的键。
            当传入一个 Object 对象时，会对键值对进行递归组合编码成查询字符串。
        * @param {string} [value] 要添加的查询字符串的值。
        * @retun {string} 返回组装后的新的 url。
        * @example
            //返回 'http://test.com?a=1&b=2&c=3#hash'
            Query.add('http://test.com?a=1&b=2#hash', 'c', 3);  
            
            //返回 'http://test.com?a=3&b=2&d=4#hash'
            Query.add('http://test.com?a=1&b=2#hash', {a: 3, d: 4});  
        */
        add: function (url, key, value) {


            var qs = exports.get(url) || {}; //先取出原来的

            if (typeof key == 'object') {
                Object.assign(qs, key);
            }
            else {
                qs[key] = value;
            }


            //过滤掉值为 null 的项
            var obj = {};

            for (var key in qs) {
                var value = qs[key];

                if (value === null) {
                    continue;
                }
                else {
                    obj[key] = value;
                }

            }

            return exports.set(url, obj);


        },


        /**
        * 给指定的 url 添加一个随机查询字符串。
        * 注意，该方法会保留之前的查询字符串，并且添加一个键名为随机字符串而值为空字符串的查询字符串。
        * @param {string} url 组装前的 url。
        * @param {number} [len] 随机键的长度。
        * @retun {string} 返回组装后的新的 url。
        * @example
            //返回值类似 'http://test.com?a=1&b=2&7A8CEBAFC6B4=#hash'
            Query.random('http://test.com?a=1&b=2#hash');  
            
            //返回值类似 'http://test.com?a=1&b=2&7A8CE=#hash' 
            Query.random('http://test.com?a=1&b=2#hash', 5); //随机键的长度为 5
    
        */
        random: function (url, len) {
            var $String = require('String');
            var key = $String.random(len);
            return exports.add(url, key, undefined);
        },



        /**
        * 把指定的 url 和查询字符串组装成一个新的 url。
        * 注意，该方法会删除之前的查询字符串。
        * @param {string} url 组装前的 url。
        * @param {string|Object} key 要设置的查询字符串的键。
            当传入一个 Object 对象时，会对键值对进行递归组合编码成查询字符串。
        * @param {string} [value] 要添加的查询字符串的值。
        * @retun {string} 返回组装后的新的 url。
        * @example
            //返回 'http://test.com?c=3#hash'
            Query.set('http://test.com?a=1&b=2#hash', 'c', 3);  
            
            //返回 'http://test.com?a=3&d=4#hash'
            Query.set('http://test.com?a=1&b=2#hash', {a: 3, d: 4});  
        */
        set: function (url, key, value) {

            var location = null;

            if (typeof url == 'object') {
                if ('href' in url) {    
                    location = url;         //location
                }
                else {      
                    location = url.location; //window
                }
                url = location.href;
            }


            var type = typeof key;
            var isValueType = (/^(string|number|boolean)$/).test(type);

            var qs = '';

            //set(url, qs);
            if (arguments.length == 2 && isValueType) { 
                qs = encodeURIComponent(key);
            }
            else {
                var obj = type == 'object' ? key : $Object.make(key, value);
                qs = exports.stringify(obj);
            }



            var hasQuery = url.indexOf('?') > -1;
            var hasHash = url.indexOf('#') > -1;
            var a;

            if (hasQuery && hasHash) {
                a = url.split(/\?|#/g);
                return a[0] + '?' + qs + '#' + a[2];
            }

            if (hasQuery) {
                a = url.split('?');
                return a[0] + '?' + qs;
            }

            if (hasHash) {
                a = url.split('#');
                return a[0] + '?' + qs + '#' + a[1];
            }

            url = url + '?' + qs;

            //设置整个 location.href 会刷新
            if (location) {
                location.href = url;
            }

            return url;


        },

        /**
        * 判断指定的 url 是否包含特定名称的查询字符串。
        * @param {string} url 要检查的 url。
        * @param {string} [key] 要提取的查询字符串的键。
        * @param {boolean} [ignoreCase=false] 是否忽略参数 key 的大小写，默认区分大小写。
            如果要忽略 key 的大小写，请指定为 true；否则不指定或指定为 false。
            当指定为 true 时，将优先检索完全匹配的键所对应的项；若没找到然后再忽略大小写去检索。
        * @retun {boolean} 如果 url 中包含该名称的查询字符串，则返回 true；否则返回 false。
        * @example
            Query.has('http://test.com?a=1&b=2#hash', 'a');  //返回 true
            Query.has('http://test.com?a=1&b=2#hash', 'b');  //返回 true
            Query.has('http://test.com?a=1&b=2#hash', 'c');  //返回 false
            Query.has('http://test.com?a=1&b=2#hash', 'A', true); //返回 true
            Query.has('http://test.com?a=1&b=2#hash');       //返回 true
        */
        has: function (url, key, ignoreCase) {

            //重载 has(location, key, ignoreCase)
            //重载 has(window, key, ignoreCase)
            if (typeof url == 'object') {
                url = ('href' in url) ? url.href :  //location
                    url.location.href;              //window
            }

            var obj = exports.get(url); //获取全部查询字符串的 Object 形式

            if (!obj) {
                return false;
            }

            if (!key) { //不指定名称，
                return !$Object.isEmpty(obj); //只要有数据，就为 true
            }

            if (key in obj) { //找到完全匹配的
                return true;
            }

            if (ignoreCase) { //明确指定了忽略大小写

                key = key.toString().toLowerCase();
                for (var name in obj) {
                    if (name.toLowerCase() == key) {
                        return true;
                    }
                }
            }

            //区分大小写，但没找到
            return false;

        },

        /**
        * 对查询字符串中的值部分进行转换过滤。
        * 如 `http://www.test.com/?a=XXX`，其中 `XXX` 就是要过滤的部分。
        * @return {String}
        */
        escape: function (string) {
            var s = String(string);
            return escape(s).replace(/\+/g, "%2B");
        },


    };

});



/**
* App 启动类。 
* @class
* @name App
*/
define('App', function (require, module, exports) {

    var $String = require('String');
    var Defaults = require('Defaults');

    var defaults = Defaults.get(module.id);
    var id$defined = {};



    function ready(fn) {
        var Loader = require('Loader');
        var Module = require('Module'); //对外给页面提供的模块管理器。
        var define = Module.define;

        Loader.preload(function (ids) {

            $ = window.jQuery;  //$ 是大闭包里的参数。

            ids.forEach(function (id) {
                if (id$defined[id]) {
                    return;
                }

                define(id, function () {
                    return window[id];
                });

                id$defined[id] = true;
            });

            if (!id$defined['$']) {

                

                define('$', function () {
                    return $;
                });

                id$defined['$'] = true;
            }

            fn && fn();
        });
    }


    /**
    * 使用普通版来启动应用。
    */
    function normal($require, $module, nav) {

        //后退时触发
        nav.on('back', function (current, target) {
            document.activeElement.blur(); // 关闭输入法
            current = $module.require(current);
            target = $module.require(target);
            current.hide();
            target.show();
        });

        //跳转到目标视图之前触发，先隐藏当前视图
        nav.on('before-to', function (current, target) {
            current = $module.require(current);
            current.hide();
        });

        //统一绑定视图跳转动作，在调用 nav.to(...) 时会给触发
        nav.on('to', function (name, arg0, arg1, argN) {
            var args = [].slice.call(arguments, 1);
            var M = $module.require(name);
            M.render.apply(M, args);
        });

    }


    module.exports = exports = /**@lends App#*/ {


        /**
        * 初始化执行环境，创建导航管理器和相应的 UI 组件，并启动应用程序。
        * @param {function} factory 工厂函数，即启动函数。
        */
        launch: function (factory) {
          
            ready(function () {

                var Module = require('Module'); //对外给页面提供的模块管理器。
                var define = Module.define;
                var name = defaults.name;

                define(name, function ($require, $module) {
                    var Nav = module.require('Nav');
                    var nav = Nav.create($module);

                    

                        normal($require, $module, nav);   //不使用动画

                    


                    var Router = require('Router');
                    var routers = Router.get($require, $module, nav);
                    $module.bind(routers);

                    factory && factory($require, $module, nav);

                });

                Module.require(name); //启动

            });
        },

    };



});

/**
* App 模块的默认配置
* @name App.defaults
*/
define('App.defaults', /**@lends App.defaults*/ {
    name: '',
    animated: true,
});


/**
* 第三方库文件动态加载器。
* @namespace
* @name Loader
*/
define('Loader', function (require, module, exports) {
    
    var Script = require('Script');
    var StyleSheet = require('StyleSheet');
    var Defaults = require('Defaults');

    var Url = module.require('Url');
    var defaults = Defaults.get(module.id);



    return {

        preload: function (fn) {

            var preload = defaults.preload;
            var urls = Url.group(preload, defaults.vars);

            StyleSheet.load(urls.css, function () {
                Script.load(urls.js, function () {
                    var keys = Object.keys(preload);
                    fn && fn(keys);
                });
            });


        },

        lazyload: function (keys, fn) {
            var lazyload = defaults.lazyload;
            var vars = defaults.vars;

            if (!Array.isArray(keys)) {
                keys = [keys];
            }

            var urls = [];

            keys.forEach(function (key) {
                var list = lazyload[key];
                if (!list) {
                    throw new Error('不存在名为 ' + key + ' 的 lazyload 配置。');
                }

                urls = urls.concat(list);
            });

            urls = Url.group(urls, vars);


            StyleSheet.load(urls.css, function () {
                Script.load(urls.js, function () {

                    var modules = keys.map(function (key) {
                        return window[key];
                    });

                    fn && fn.apply(null, modules);
                });
            });
        },

        load: function (urls, fn) {
            urls = Url.group(urls, defaults.vars);

            StyleSheet.load(urls.css, function () {
                Script.load(urls.js, function () {
                    fn && fn();
                });
            });
        },

    };

});


/**
* Loader 模块的默认配置。
* @name Loader.defaults
*/
define('Loader.defaults', function (require, module, exports) {

    var KISP = require('KISP');
    var Url = require('Url');


    return {
        vars: {
            'version': KISP.version,
            'edition': KISP.edition,
            'dir': Url.dir(),
            'root': Url.root(),
        },

        preload: {
            KISP: ['{dir}kisp.{edition}.css'],
            jQuery: ['{dir}jquery/jquery-2.1.1.{edition}.js'],
        },

        lazyload: {

        },

    };
});



/**
* StyleSheet 样式类工具
* @namespace
* @name StyleSheet
*/
define('StyleSheet', function (require, module, exports) {

    var iframe;
    var iframeDoc;



    var defaults = {
        url: '',
        id: '',
        charset: 'utf-8',
        document: window.document,
        onload: null,
    };



    /**
    * 加载单个文件。 
    * @inner
    */
    function loadItem(url, charset, document, onload) {

        var id;

        if (typeof url == 'object') { //传入的是一个 {} 
            var config = url;

            id = config.id;
            url = config.url;
            charset = config.charset;
            document = config.document;
            onload = config.onload;
        }


        var link = document.createElement('link');

        

        if (onload) { //指定了回调函数，则设置它

            if (link.readyState) { //IE

                link.onreadystatechange = function () {

                    var readyState = link.readyState;

                    if (readyState == 'loaded' || readyState == 'complete') {
                        link.onreadystatechange = null; //避免重复执行回调
                        onload();
                    }
                };
            }
            else { //标准
                link.onload = onload;
            }

        }


        link.href = url;
        link.rel = 'stylesheet';

        if (charset) {
            link.charset = charset;
        }

        if (id) {
            link.id = id;
        }

      
        document.head.appendChild(link);
    }

    /**
    * 顺序加载批量
    * @inner
    */
    function loadList(urls, charset, document, fn) {

        if (urls.length == 0) {
            fn && fn();
            return;
        }


        var index = 0;

        (function () {
            var next = arguments.callee;
            var url = urls[index];

            loadItem(url, charset, document, function () {

                index++;

                if (index < urls.length) {
                    next();
                }
                else {
                    fn && fn();
                }
            });

        })();


    }




    module.exports = exports = /**@lends Style */ {

        /**
        * 跨浏览器动态加载 JS 文件，并在加载完成后执行指定的回调函数。
        * @memberOf MiniQuery.Script
        * @param {string|Array} params.url 
            要加载的 JS 文件的 url 地址，如果要批量加载，则为一个地址数组。
        * @param {string} [params.charset="utf-8"] 
            要加载的 JS 文件的字符编码，默认为 utf-8。
        * @param {Document} [params.document=window.document] 
            要加载的 JS 文件的上下文环境的 document，默认为当前窗口的 document 对象。
        * @param {function} [params.onload] 
            加载成功后的回调函数。
        * @example
            Style.load({
                url: 'a.css',
                charset: 'utf-8',
                document: document,
                id: 'myScript',
                onload: function (){ }
            });

            Style.load('a.css', 'utf-8', document, function(){});
            Style.load('a.css', 'utf-8', function(){});
            Style.load('a.css', document, function(){});
            Style.load('a.css', function(){});

            //批量加载
            Style.load(['a.css', 'b.css'], function(){});
        */
        load: function (params) {

            var $Object = require('Object');

            var obj = Object.assign({}, defaults); //复制一份

            //注意，params 有可能是个数组，不能用 typeof 为 'object'
            if ($Object.isPlain(params)) { //纯对象 {}
                Object.assign(obj, params);
            }
            else {

                obj.url = params;

                switch (typeof arguments[1]) {
                    case 'string':
                        obj.charset = arguments[1];
                        break;
                    case 'object':
                        obj.document = arguments[1];
                        break;
                    case 'function':
                        obj.onload = arguments[1];
                        break;
                }

                switch (typeof arguments[2]) {
                    case 'object':
                        obj.document = arguments[2];
                        break;
                    case 'function':
                        obj.onload = arguments[2];
                        break;
                }

                if (arguments[3]) {
                    obj.onload = arguments[3];
                }
            }




            var url = obj.url;

            if (typeof url == 'string') {
                loadItem(obj);
            }
            else if (url instanceof Array) {
                loadList(url, obj.charset, obj.document, obj.onload);
            }
            else {
                throw new Error('参数 params.url 必须为 string 或 string 的数组');
            }
        },

       
    };

});



/**
* 第三方库文件动态加载器。
* @namespace
* @name Loader/Url
*/
define('Loader/Url', function (require, module, exports) {
    
    var $Object = require('Object');
    var $String = require('String');
    var Url = require('Url');

    var url$loaded = {};


    //检查指定的 url 资源是否已加载过。
    function check(url) {
        url = Url.resolve(url); //解析成绝对地址。
        url = Url.main(url);    //取主体部分。

        if (url$loaded[url]) {
            return true;
        }


        var tag = '';
        var key = '';

        if (Url.isExt(url, '.js')) {
            tag = 'script';
            key = 'src';
        }
        else if (Url.isExt(url, '.css')) {
            tag = 'link';
            key = 'href';
        }
        else {
            throw new Error('无法识别的 url 类型: ' + url);
        }

        var list = document.querySelectorAll(tag);

        var item = Array.from(list).find(function (item) {
            var file = item[key];
            return Url.main(file) == url;
        });

        if (!item) {
            return false;
        }

        url$loaded[url] = true;
        return true;
    }
 



    return {

        //把 urls 按 css 和 js 归类。
        group: function (data, vars) {

            if (typeof data == 'string') {
                data = [data];
            }

            //方便下面统一处理。
            if (Array.isArray(data)) {
                data = $Object.make('', data);
            }

            var cssUrls = [];
            var jsUrls = [];



            $Object.each(data, function (key, urls) {
                if (!Array.isArray(urls)) {
                    urls = [urls];
                }

                urls.forEach(function (url) {
                    url = $String.format(url, vars);

                    if (check(url)) {
                        return;
                    }

                    if (Url.isExt(url, '.js')) {
                        jsUrls.push(url);
                    }
                    else if (Url.isExt(url, '.css')) {
                        cssUrls.push(url);
                    }
                    else {
                        throw new Error('不支持该类型的 url 预加载: ' + url);
                    }
                });
            });

            return {
                'css': cssUrls,
                'js': jsUrls,
            };

        },

    };

});


/**
* 对外提供的页面级别的模块管理器。
* @namespace
* @name Module
*/
define('Module', function (require, module, exports) {

    var Defaults = require('Defaults');
    var Emitter = require('Emitter');


    var defaults = Defaults.clone(module.id, {

        'Emitter': Emitter,

        //对外给业务层用于加载顶级模块。
        //用于工厂函数 factory(require, module, exports){ } 中的第一个参数 `require`。
        'require': function (id, fn) {
            if (typeof id != 'string') {
                throw new Error('参数 id 的类型必须为 string。');
            }

            var len = arguments.length;

            //同步方式。
            //require(id)
            if (len == 1) {
                return mm.require(id, !defaults.cross);
            }


            //异步方式。
            //重载 require(id0, id1, ..., idN, fn) 的方式。
            var args = Array.from(arguments);
            var ids = args.slice(0, -1); //最后一个是 fn。
            fn = args[len - 1];


            var Package = require('Package');
            var tasks = require.new('Tasks', ids);

            tasks.on({
                'each': function (id, index, done) {
                    Package.load(id, function () {
                        var M = mm.require(id, defaults.cross);
                        done(M);
                    });

                },
                'all': function (values) {
                    fn && fn.apply(null, values);
                },
            });

            tasks.parallel();

        },

    });


    //对外给业务层使用的模块管理器。
    var mm = new ModuleManager(defaults);


    return /**@lends Module*/ {

        /**
        * 定义指定名称的模块。
        * @function
        * @param {string} id 模块的名称。
        * @param {Object|function} factory 模块的导出函数或对象。
        */
        'define': mm.define.bind(mm),

        /**
        * 加载指定的模块。
        * @function
        * @param {string} id 模块的名称。
        * @return 返回指定的模块。
        */
        'require': mm.require.bind(mm),
    };

});

/**
* Module 模块的默认配置
* @name Module.defaults
*/
define('Module.defaults', /**@lends Module.defaults*/ {
    seperator: '/',     //私有模块的分隔符
    cross: false,       //不允许跨级调用
    repeated: false,    //不允许重复定义同名的模块
});



/**
* 多任务处理工具类。
* @namesapce
* @name Tasks
*/
define('Tasks', function (require, module,  exports) {

    var Emitter = require('Emitter');
    var mapper = new Map();


    function Tasks(list) {
        var meta = {
            'emitter': new Emitter(this),
            'list': list,
        };

        mapper.set(this, meta);
    }


    Tasks.prototype = {
        constructor: Tasks,


        parallel: function () {
            var meta = mapper.get(this);
            var list = meta.list;
            var emitter = meta.emitter;
            var len = list.length;

            if (len == 0) {
                emitter.fire('all', []);
                return;
            }

            var values = new Array(len);
            var dones = new Array(len);
            var count = len;

            list.forEach(function (item, index) {

                //done(index) 是异步调用，要多一层闭包。
                (function (index) { 
                    
                    emitter.fire('each', [item, index, function (value) {

                        values[index] = value; //需要收集的值，由调用者传入。
                        dones[index] = true;
                        count--;

                        //单纯记录计数不够安全，因为调用者可能会恶意多次调用 done()。
                        if (count > 0) { //性能优化
                            return;
                        }

                        //安全起见，检查每项的完成状态
                        for (var i = 0; i < len; i++) {
                            if (!dones[i]) {
                                return;
                            }
                        }

                        //至此，全部项都已完成。
                        emitter.fire('all', [values]);

                    }]);

                })(index);
            });



        },

        serial: function () {
            var meta = mapper.get(this);
            var list = meta.list;
            var emitter = meta.emitter;
            var len = list.length;

            if (len == 0) {
                emitter.fire('all', []);
                return;
            }


            var values = new Array(len);


            function process(index) {
                var item = list[index];

                emitter.fire('each', [item, index, function (value) {
                    values[index] = value; //需要收集的值，由调用者传入。
                    index++;

                    if (index < len) {
                        process(index);
                    }
                    else {
                        emitter.fire('all', [values]);
                    }
                }]);
            }

            process(0);

        },

        on: function () {
            var meta = mapper.get(this);
            var emitter = meta.emitter;
            var args = Array.from(arguments);
            emitter.on(args);
        },

    };



    Object.assign(Tasks, {


    });


    return Tasks;





    //var tasks = new Tasks([]);

    //tasks.on('each', function (item, index, done) {

    //});

    //tasks.on('all', function (values) {

    //});


    //tasks.parallel();



});

/**
* 自定义多级事件类。
* @class
* @name Emitter
*/
define('Emitter', function (require, module, exports) {
    var $Object = require('Object');
    var Tree = require('Tree');

    var mapper = new Map();


    /**
    * 构造器。
    * @param {Object} [context=null] 事件处理函数中的 this 上下文对象。
    *   如果不指定，则默认为 null。
    */
    function Emitter(context) {

        var meta = {
            'context': context,
            'tree': new Tree(),
        };

        mapper.set(this, meta);

    }

    //实例方法
    Emitter.prototype = /**@lends Emitter.prototype */ {
        constructor: Emitter,

        /**
        * 绑定指定名称的事件处理函数。
        * 已重载 on({...});
        * 已重载 on(name0, name1, ..., nameN, {...});
        * 已重载 on(name0, name1, ..., nameN, fn);
        * 已重载 on(args); 主要是为了方便调用方快速重绑定自己的 on() 方法。
        * 已重载 on(names, fn); 把多个事件名称绑定到同一个回调函数。
        * @param {string} name 要绑定的事件名称。
        * @param {function} fn 事件处理函数。 
            在处理函数内部， this 指向构造器参数 context 对象。
        * @example
            var emitter = new Emitter();
            emitter.on('click', function () {});
        */
        on: function (name, fn) {

            //重载 on([]); 分两种情况。
            if (Array.isArray(name)) {
                if (fn) { //重载 on(names, fn); 把多个事件名称绑定到同一个回调函数。
                    name.map(function (name) {
                        this.on(name, fn);
                    }, this);
                }
                else {  //重载 on(args); 主要是为了方便调用方快速重绑定自己的 on() 方法。
                    this.on(...name);
                }

                return;
            }


            var meta = mapper.get(this);
            var tree = meta.tree;
            var args = Array.from(arguments);

            //重载 on(name0, name1, ..., nameN, {...}) 的情况。
            //先尝试找到 {} 所在的位置。
            var index = args.findIndex(function (item, index) {
                return typeof item == 'object';
            });

            if (index >= 0) {
                var obj = args[index];              //{} 部分。
                var names = args.slice(0, index);   //前缀部分 [name0, name1, ..., nameN]。
                var list = $Object.flat(obj);       //{} 部分扁平化。

                list.forEach(function (item, index) {
                    var keys = names.concat(item.keys); //完整路径。

                    var node = tree.get(keys) || {
                        'list': [],         //本节点的回调列表。
                        'count': 0,         //本节点触发的次数计数。
                    };

                    node.list.push(item.value);
                    tree.set(keys, node);
                });

                return;
            }


            //重载 on(name0, name1, ..., nameN, fn) 的情况。
            //尝试找到回调函数 fn 所在的位置。
            var index = args.findIndex(function (item, index) {
                return typeof item == 'function';
            });

            if (index < 0) {
                throw new Error('参数中必须指定一个回调函数');
            }

            fn = args[index]; //回调函数

            var names = args.slice(0, index); //前面的都当作是名称

            //过滤掉空串。
            names = names.filter(function (key) {
                return !!key;
            });

            var node = tree.get(names) || {
                'list': [],         //本节点的回调列表。
                'count': 0,         //本节点触发的次数计数。
                'enabled': true,    //当为 false 时，表示本节点的回调被禁用。
                'spreaded': true,   //当为 false 时，表示子节点的回调被禁用。
            };

            node.list.push(fn);
            tree.set(names, node);
        },



        /**
        * 解除绑定指定名称的事件处理函数。
        * 已重载 off() 的情况。
        * 已重载 off(name0, name1, ..., nameN, {...}) 的情况。
        * 已重载 off(name0, name1, ..., nameN, fn) 的情况。
        * 已重载 off(name0, name1, ..., nameN) 的情况。
        * @param {string} [name] 要解除绑定的事件名称。
            如果不指定该参数，则移除所有的事件。
            如果指定了该参数，其类型必须为 string，否则会抛出异常。
        * @param {function} [fn] 要解除绑定事件处理函数。
            如果不指定，则移除 name 所关联的所有事件。
        */
        off: function (name, fn) {
            var meta = mapper.get(this);
            var tree = meta.tree;
            var args = Array.from(arguments);

            //未指定事件名，则移除所有的事件。
            if (args.length == 0) {
                tree.clear();
                return;
            }

            //多名称情况: off(name0, name1, ..., nameN, {});
            //先尝试找到 {} 所在的位置。
            var index = args.findIndex(function (item, index) {
                return typeof item == 'object';
            });

            if (index >= 0) {
                var obj = args[index];              //{} 对象。
                var names = args.slice(0, index);   //前缀部分 [name0, name1, ..., nameN]。
                var list = $Object.flat(obj);       //{} 对象部分扁平化。

                list.forEach(function (item, index) {
                    var keys = names.concat(item.keys); //完整路径。
                    var node = tree.get(keys);          //该路径对应的节点。
                    
                    //不存在该路径对应的节点。
                    if (!node) {
                        return;
                    }

                    //存在该路径对应的节点，但事件列表为空。
                    var list = node.list;
                    if (!list || !list.length) {
                        return;
                    }

                    var fn = item.value;
                    node.list = list.filter(function (item) {
                        return item !== fn;
                    });
                });
                return;
            }


            //重载 off(name0, name1, ..., nameN, fn) 的情况。
            //先尝试找到回调函数所在的位置。
            var index = args.findIndex(function (item, index) {
                return typeof item == 'function';
            });

            //未指定处理函数，则假定在边界之外。
            if (index < 0) {
                index = args.length;
            }

            fn = args[index]; //回调函数。

            var names = args.slice(0, index); //前面的都当作是名称。
            var node = tree.get(names);

            //不存在该路径对应的节点。
            if (!node) {
                return;
            }

            //存在该路径对应的节点，但事件列表为空。
            var list = node.list;
            if (!list || !list.length) {
                return;
            }

            if (fn) {
                node.list = list.filter(function (item, index) {
                    return item !== fn;
                });
            }
            else { //未指定处理函数，则清空列表
                list.length = 0;
            }

        },



        /**
        * 已重载。
        * 触发指定名称的事件，并可向事件处理函数传递一些参数。
        * @return {Array} 返回所有事件处理函数的返回值所组成的一个数组。
        * @example
            var emitter = new Emitter();
            emitter.on('click', 'name', function (a, b) {
                console.log(a, b);
            });
            emitter.fire('click', 'name', [100, 200]);
        */
        fire: function (name, params) {
            var meta = mapper.get(this);
            var tree = meta.tree;
            var context = meta.context;
            var args = Array.from(arguments);

            var index = args.findIndex(function (item, index) {
                return Array.isArray(item);
            });

            if (index < 0) {
                index = args.length;
            }

            var names = args.slice(0, index);
            var node = tree.get(names);
            var returns = [];

            if (!node) { //不存在该事件名对应的节点。
                return returns;
            }

            params = args[index] || [];
            node.count++;

            node.list.forEach(function (fn, index) {
                //让 fn 内的 this 指向 context，并收集返回值。
                var value = fn.apply(context, params);
                returns.push(value);
            });

            return returns;

        },

        /**
        * 设置指定的属性为指定的值。
        * 如可以在触发事件前动态改变 context 值。
        */
        set: function (key, value) {
            var meta = mapper.get(this);

            switch (key) {
                case 'context':
                    meta[key] = value;
                    break;

                default:
                    throw new Error('不支持设置属性: ' + key);
            }

        },


        /**
        * 销毁本实例对象。
        */
        destroy: function () {
            var meta = mapper.get(this);
            meta.tree.destroy();
            mapper.delete(this);
        },


    };

    
    return Emitter;

});
/**
* 树形结构的存储类。
* @class
* @name Tree
*/
define('Tree', function (require, module, exports) {

    var mapper = new Map();


    /**
    * 构造器。
    */
    function Tree() {

        var meta = {
            'key$node': {},
            'count': 0,
        };

        mapper.set(this, meta);

    }


    //获取指定节点下指定路径的节点
    function getNode(key$node, keys) {

        var lastIndex = keys.length - 1;

        for (var index = 0; index <= lastIndex; index++) {

            var key = keys[index];
            var node = key$node[key];

            if (!node || index == lastIndex) { //不存在了，或是最后一项了
                return node || null;
            }

            key$node = node.key$node; //准备下一轮迭代
        }
    }


    //实例方法
    Tree.prototype = /**@lends Tree.prototype */{
        constructor: Tree,

        /**
        * 设置指定节点上的值。
        * 如果不存在该节点，则先创建，然后存储值到上面；否则直接改写原来的值为指定的值。
        * 已重载 set(key0, key1, ..., keyN, value) 的情况。
        * @param {Array} keys 节点路径数组。
        * @param value 要设置的值。
        * @example
            tree.set(['path', 'to'], 123);
            tree.set('path', 'to', 123); //跟上面的等价
        */
        set: function (keys, value) {
            //重载 set(key0, key1, ..., keyN, value) 的情况。
            if (!Array.isArray(keys)) {
                var args = Array.from(arguments);
                keys = args.slice(0, -1);

                
                value = args.slice(-1)[0];  //参数中的最后一个即为 value
            }

            //过滤掉空串。
            keys = keys.filter(function (key) {
                return !!String(key);
            });

            if (!keys.length) {
                throw new Error('过滤后的节点 key 为空数组。');
            }



            var meta = mapper.get(this);
            var key$node = meta.key$node;
            var lastIndex = keys.length - 1;
            var node = null;
           

            keys.forEach(function (key, index) {
                node = key$node[key];

                if (!node) {
                    meta.count++;

                    node = key$node[key] = {
                        'key$node': {},         //子节点的容器对象。
                        'parent': key$node,     //指向父节点，方便后续处理。
                        'key': key,             //当前的 key，方便后续处理。
                        //'value': undefined,     //会有一个这样的字段，但先不创建。
                    };
                }

                if (index < lastIndex) {
                    key$node = node.key$node; //准备下一轮迭代
                }
                else { //最后一项
                    node.value = value;
                }
            });

            
        },



        /**
        * 获取指定路径的节点上的值。
        * @return 返回该节点上的值。 如果不存在该节点，则返回 undefined。
        * @example
            tree.get('path', 'to'); //获取路径为 'path' -> 'to' 的节点上存储的值。
        */
        get: function (keys) {
            //重载 get(key0, key1, ..., keyN) 的情况
            if (!(Array.isArray(keys))) {
                keys = Array.from(arguments);
            }

            //过滤掉空串。
            keys = keys.filter(function (key) {
                return !!String(key);
            });

            if (!keys.length) {
                throw new Error('过滤后的节点 key 为空数组。');
            }



            var meta = mapper.get(this);
            var key$node = meta.key$node;

            var node = getNode(key$node, keys);
            return node ? node.value : undefined;
        },



        /**
        * 清空全部节点及数据。
        */
        clear: function () {
            var meta = mapper.get(this);
            meta.key$node = {};
            meta.count = 0;
        },

        /**
        * 删除指定节点上的值。
        */
        remove: function (keys) {

            //重载 remove(key0, key1, ..., keyN) 的情况
            if (!(Array.isArray(keys))) {
                keys = [...arguments];
            }

            //过滤掉空串。
            keys = keys.filter(function (key) {
                return !!String(key);
            });

            if (!keys.length) {
                throw new Error('过滤后的节点 key 为空数组。');
            }

            var meta = mapper.get(this);
            var key$node = meta.key$node;
            var node = getNode(key$node, keys);

            if (!node) { //不存在该节点
                return;
            }


            var $Object = require('Object');
            var obj = node.key$node;                //子节点

            if (!obj || $Object.isEmpty(obj)) {    //不存在子节点
                meta.count--;
                delete node.parent[node.key];       //删除整个节点自身，节省内存
            }
            else {
                delete node.value; //删除值
            }
        },

        /**
        * 销毁。
        */
        destroy: function () {
            mapper.delete(this);
        },

    };


    return Tree;


});









/**
* 包资源加载器。
* @namespace
* @name Package
*/
define('Package', function (require, module, exports) {

    var Defaults = require('Defaults');
    var Loader = module.require('Loader');

    var defaults = Defaults.clone(module.id);
    var packages = null;    //所有需要异步加载的包的总配置。
    var loading = null;     //加载中 Loading 的实例。
    var name$pack = {};     //分包加载成功后的结果缓存。




    //加载总的包文件。
    function get(name, fn) {

        if (packages) {
            fn && fn(packages[name]);
            return;
        }

        //说明不存在总配置文件。
        if (packages === false) {
            fn && fn();
            return;
        }


        //首次加载总的 json 文件。

        var Query = require('Query');
        var Url = require('Url');

        var url = Url.root() + defaults.url;
        var query = defaults.query;

        if (typeof query == 'string') {
            query = Query.parse(query);
        }

        if (query) {
            url = Query.add(url, query);
        }

        if (defaults.random) {
            url = Query.random(url, 4);
        }
       

        $.ajax({
            type: 'get',
            dataType: 'json',
            url: url,

            error: function () {
                packages = false;   //显示指定为 false，表示已尝试加载过了。
                fn && fn();
            },

            success: function (json) {
                packages = json;
                fn && fn(json[name]);
            },
        });

    }


    



    return /**@lends Package*/{

        /**
        * 加载指定名称的包资源，并在加载完成后执行一个回调。
        * @param {string} name 包资源的名称。
        * @param {function} fn 加载完成后要执行的回调。
            该回调函数会接收到一个包资源的数据对象。
        */
        load: function (name, fn) {

            //优化使用内存中的缓存。
            var pack = name$pack[name];
            if (pack || pack === null) {
                fn && fn(pack);
                return;
            }


            var load = defaults.load || {};
            var begin = load.begin;
            var end = load.end;

            if (begin) {
                loading = begin(require, loading);
            }


            get(name, function (data) {

                //不存在该配置节点。
                if (!data) {
                    name$pack[name] = null; //显式填充一个值，用于下次再加载时直接使用。
                    end && end(require, loading);

                    fn && fn();
                    return;
                }


                //首次加载，找到对应的配置节点，加载它所指定的资源文件。
                Loader.load(data, function (pack) {

                    name$pack[name] = pack;
                    end && end(require, loading);

                    fn && fn(pack);

                });

            });

        },
    };



});

/**
* Package 模块的默认配置
* @name Package.defaults
*/
define('Package.defaults', /**@lends Package.defaults*/ {


    /**
    * 总包的 url 地址，相对于网站的根地址。
    */
    url: 'packages/all.json',

    /**
    * 是否在总包的 url 地址上加上随机 query 串以刷新缓存。
    */
    random: true,

    /**
    * 总包 url 地址的 query 部分，应该由自动化工具写入相应的 MD5 值。
    * 如果指定，则带在 url 的 query 部分。
    */
    query: null,

    /**
    * 加载总包或分包时的进度提示。
    */
    load: {
        /**
        * 开始加载时总包或分包时的提示函数。
        * @param {function} require 用于加载 KISP 内部模板的 require 方法。
        * @param {Object} loading 上一次创建出来的 Loading 实例。
        */
        begin: function (require, loading) {
            if (!loading) {
                var Loading = require('Loading');
                loading = new Loading();
            }
            
            loading.show();
            return loading;
        },

        /**
        * 结束加载时总包或分包时的提示函数。
        * @param {function} require 用于加载 KISP 内部模板的 require 方法。
        * @param {Object} loading 上一次创建出来的 Loading 实例。
        */
        end: function (require, loading) {
            loading.hide();
        },
    },

});


/**
* 加载中提示组件
* @class
* @name Loading
*/
define('Loading', function (require, module, exports) {

    var $String = require('String');
    var Emitter = require('Emitter');
    var Defaults = require('Defaults');
    var RandomId = require('RandomId');

    //子模块
    var Sample = module.require('Sample');
    var Style = module.require('Style');
    var Presettings = module.require('Presettings');

    var mapper = new Map();



    function render(style) {

        var meta = mapper.get(this);

        var id = meta.id;
        var sample = meta.sample;

        var Style = require('Style');

        var html = $String.format(sample, {
            'id': id,
            'text-id': meta.textId,
            'text': meta.text,
            'style': Style.stringify(style),
            'cssClass': meta.cssClass,
        });

        var container = meta.container;
        if (meta.append) {
            $(container).append(html);
        }
        else {
            $(container).prepend(html);
        }

        var div = document.getElementById(id);
        meta.div = div;

        return div;

    }


   

    /**
    * 构造器。
    * @constructor
    */
    function Loading(config) {

    
        var presetting = config ? Presettings[config.presetting] : null;
        config = Defaults.clone(module.id, presetting, config);


        var emitter = new Emitter(this);

        var cssClass = config.cssClass;
        if (cssClass instanceof Array) {
            cssClass = cssClass.join(' ');
        }

        var text = config.text;
        if (!text && text !== 0) { // 0 除外
            cssClass += ' NoText'; //注意，前面要有个空格
        }

        //向后兼容。
        cssClass = cssClass.split(' ').map(function (item, index) {
            if (item == 'same-line') {
                console.warn('类名 "same-line" 已过时，请使用 "SameLine"');
                return 'SameLine';
            }

            return item;
        }).join(' ');


        var prefix = config.prefix;
        var suffix = config.suffix;

        var meta = {
            'id': RandomId.get(prefix, suffix),
            'textId': RandomId.get(prefix, 'text-', suffix),
            'container': config.container,
            'prepend': config.prepend,
            'div': null,
            'sample': Sample.get(config.sample), //加载相应的 HTML 模板
            'text': text,
            'emitter': emitter,
            'mask': config.mask,
            'masker': null, // Mask 的实例，重复使用
            'style': Style.get(config),
            'showTime': 0, //开始显示时的时间点
            'cssClass': cssClass,
            'append': config.append,
        };

        mapper.set(this, meta);

    }


    //实例方法
    Loading.prototype = /**@lends Loading#*/ {
        constructor: Loading,

        /**
       * 渲染本组件。
       * 该方法会创建 DOM 节点，并且绑定事件，但没有调用 show()。
       */
        render: function () {
            
        },

        /**
        * 显示本组件。
        */
        show: function (text, config) {


            if (typeof text == 'object') { //重载 show(config)
                config = text;
                text = config.text;
            }

            config = config || {};


            var meta = mapper.get(this);
            var div = meta.div;
            var style = Style.get(meta.style, config);


            if (!div) { //首次 render
                div = render.call(this, style);
            }
            

            //在高版本的 iOS 上，样式必须重新设置，否则 background、top、bottom 
            // 的样式会不生效，至今也没有查出原因
            //else if(config) { //只有指定了 config，才有可能指定 style
            //  $(div).css(style);
            //}

            //用下面这种，相当于重复设置，但可以避免上述问题!!!
            $(div).css(style);

            var Mask = require('Mask');
            var mask = Mask.filter(meta.mask, config.mask);
            var masker = meta.masker;

            //指定了启用 mask 层
            if (mask) {
                if (!masker) {
                    masker = meta.masker = new Mask({
                        'container': meta.container,
                    });
                }

                masker.show(mask);
            }
            else {
                if (masker) { //之前已经创建了，并且可能是显示的。
                    masker.hide();
                }
            }


            if (text !== undefined && text != meta.text) {
                document.getElementById(meta.textId).innerHTML = text;
                meta.text = text;
            }

            meta.showTime = Date.now(); //记录开始显示的时间点

            $(div).show();
            meta.emitter.fire('show');


            var duration = config.duration;
            if (duration) {
                var self = this;
                setTimeout(function () {
                    self.hide();
                }, duration);
            }

        },

        /**
        * 隐藏本组件。
        * @param {number} [lastTime] 需要持续显示的时间。
        */
        hide: function (lastTime) {
            var meta = mapper.get(this);
            var div = meta.div;

            if (!div) {
                return;
            }
            
            if (!lastTime) { //未指定要持续显示的时间，则立即隐藏
                hide();
                return;
            }

            var now = Date.now();
            var showTime = meta.showTime;

            var useTime = now - showTime;       //已经显示的时间
            var leftTime = lastTime - useTime;  //剩余时间

            if (leftTime > 0) {
                setTimeout(hide, leftTime);
            }
            else { //立即隐藏
                hide();
            }

            //内部方法
            function hide() {
                var masker = meta.masker;
                if (masker) {
                    masker.hide();
                }
                meta.showTime = 0;
                $(div).hide();
                meta.emitter.fire('hide');
            }

        },

        /**
        * 移除本组件对应的 DOM 节点。
        */
        remove: function () {

            var meta = mapper.get(this);
            var div = meta.div;

            if (!div) {
                return;
            }


            var masker = meta.masker;
            if (masker) {
                masker.remove();
            }

            //reset
            meta.div = null;
            meta.masker = null;
            meta.hasBind = false;

            $(div).off();

            document.body.removeChild(div);
            meta.emitter.fire('remove');

        },

        set: function (key, value) {
            var meta = mapper.get(this);

            switch (key) {
                case 'text':
                    meta.text = value;
                    $('#' + meta.textId).html(value);
                    break;

                default:
                    throw new Error('暂不支持设置名为` ' + key +  '` 的属性。');
            }

        },

        /**
        * 绑定事件。
        */
        on: function (name, fn) {
            var meta = mapper.get(this);
            var emitter = meta.emitter;

            var args = [].slice.call(arguments, 0);
            emitter.on.apply(emitter, args);
        },

        /**
        * 销毁本组件
        */
        destroy: function () {
            var meta = mapper.get(this);
            var emitter = meta.emitter;

            this.remove();
            emitter.destroy();

            mapper.remove(this);
        },

    };

    return Loading;

});

/**
* Loading 模块的默认配置
* @name Loading.defaults
*/
define('Loading.defaults', /**@lends Loading.defaults*/ {
    
    /**
    * 生成的 id 的前缀。
    */
    prefix: 'KISP-Loading-',

    /**
    * 生成的 id 的随机后缀的长度。
    */
    suffix: 4,

    /**
    * 加载中时要显示的文本。
    */
    text: '处理中...',

    /**
    * 是否启用 mask 层。
    */
    mask: false,

    /**
    * 组件用到的 html 模板。
    * 默认为 'iOS'。 业务层不需要关注该字段。
    */
    sample: 'iOS',

    /**
    * 组件用到的 css 类名。
    */
    cssClass: '',

    /**
    * 组件添加到的容器。
    * 默认为 document.body。
    */
    container: document.body,

    /**
    * 把组件添加到容器的方式，是否使用追加的方式。
    * 默认用 prepend 的方式。
    */
    append: false,

    //默认样式
    'background': 'rgba(0, 0, 0, 0.7)',
    'border-radius': 10,
    'bottom': 'initial',
    'color': '#fff',
    'font-size': '15px',
    'height': 102,
    'left': '50%',
    'right': 'initial',
    'top': '50%',
    'width': 120,

    /**
    * 组件的 css 样式 z-index 值。
    */
    'z-index': 1024,
});

/**
* Loading 模块的默认配置
* @name Loading.config
*/
define('Loading.config', /**@lends Loading.config*/ {
    //PC 端的用 fixed定位。
    position: 'fixed',
});


/**
* RandomId 工具类
* @name RandomId
*/
define('RandomId', function (require, module, exports) {

    var $String = require('String');

    module.exports = exports = /**@lends RandomId*/ {

        /**
        * 
        */
        get: function (item0, item1, item2, itemN) {

            var list = Array.from(arguments);

            list = list.map(function (item, index) {

                if (typeof item == 'number') {
                    return $String.random(item).toLowerCase();
                }

                return item;
            });

            return list.join('');
        },

        
    };

});



/**
* Style 工具类
* @class
* @name Style
*/
define('Style', function (require, module,  exports) {

    var $Object = require('Object');


    //内部函数
    function getPixel(v) {

        var type = typeof v;

        if (type == 'number' || (/^\d+$/g).test(v)) { //数字或字符串形式的数字
            return v + 'px';
        }

        return v;
    }


   


    var pix_fields = [
        'border',
        'border-radius',
        'border-bottom-width',
        'border-left-width',
        'border-right-width',
        'border-top-width',
        'border-width',
        'bottom',
        'font-size',
        'height',
        'left',
        'letter-spacing',
        'line-height',
        'margin',
        'margin-bottom',
        'margin-left',
        'margin-right',
        'margin-top',
        'padding',
        'padding-bottom',
        'padding-left',
        'padding-right',
        'padding-top',
        'right',
        'top',
        'width',
    ];






    module.exports = exports = /**@lends Style*/ {

        /**
        * 像素化。
        */
        pixelize: function (style, key) {

            //重载 getPixel(value) 
            if (typeof style != 'object') {
                return getPixel(style);
            }


            // 批量操作: pixelize(style, keys);
            if (key instanceof Array) {

                key.forEach(function (key, index) {

                    var value = style[key];
                    if (value == null) { // null|undefined
                        return; //continue
                    }

                    style[key] = getPixel(value);
                });
            }
            else { //单个操作
                var value = style[key];
                if (value != null) { // null|undefined
                    style[key] = getPixel(value);
                }
            }

            return style;
        },

        checkUnit: function (value, unit) {
            return typeof value == 'string' &&
                value.slice(0 - unit.length) == unit;
        },


        filter: function (items, keys) {

            //重载 filter(obj, keys)
            if (!Array.isArray(items)) {
                items = [items];
            }

            var list = items.map(function (item, index) {
                if (!item || typeof item != 'object') {
                    return null;
                }

                item = $Object.filter(item, keys);
                return item;
            });

            //合并多个到一个新的 {}
            list = [{}].concat(list);

            var style = Object.assign.apply(null, list);
            style = exports.pixelize(style, pix_fields);

            return style;
        },


        parse: function (style) {


        },

        stringify: function (style, replacer, spaces) {

            if (!style) {
                return '';
            }

            if (typeof replacer == 'number') { //重载 stringify(style, spaces);
                spaces = replacer;
                replacer = null;
            }

            var a = [];

            $Object.each(style, function (key, value) {
                
                value = replacer ? replacer(key, value) : value;

                if (value === undefined) { //扔掉值为 undefined 的项
                    return; // continue;
                }

                var s = key + ': ' + value;
                if (spaces) {
                    s = new Array(spaces + 1).join(' ') + s; //产生前导空格
                }

                a.push(s);

            });

            if (a.length == 0) {
                return '';
            }


            return spaces ? a.join(';\n') + ';\n' :
                a.join(';') + ';';
        },


        parsePercent: function (percent, total) {

            percent = parseInt(percent) / 100;
            return percent * total + 'px';

        },


    };



   
});



/**
* 遮罩层
* @class
* @name Mask
*/
define('Mask', function (require, module, exports) {

    var Emitter = require('Emitter');
    var $String = require('String');
    var Defaults = require('Defaults');
    var RandomId = require('RandomId');

    var Sample = module.require('Sample');
    var Style = module.require('Style');


    var mapper = new Map();


    /**
    * 构造器。
    * @constructor
    */
    function Mask(config) {


        config = Defaults.clone(module.id, config);

        var prefix = config.prefix;
        var suffix = config.suffix;

        var emitter = new Emitter(this);

        var meta = {
            'id': RandomId.get(prefix, suffix),
            'div': null, //jQuery 包装对象
            'sample': Sample,
            'volatile': config.volatile,
            'emitter': emitter,
            'style': Style.get(config),
            'showTime': 0, //开始显示时的时间点
            'container': config.container,
            'duration': config.duration,
            'append': config.append,
            'eventName': config.eventName,
        };

        mapper.set(this, meta);

    }


    Mask.prototype = /**@lends Mask#*/ {
        constructor: Mask,

        /**
        * $(div) 的快捷方式。
        */
        $: null,

        /**
        * 渲染本组件。
        * 该方法会创建 DOM 节点，并且绑定事件，但没有调用 show()。
        */
        render: function () {
            var meta = mapper.get(this);

            //已经渲染过了
            if (meta.div) {
                return;
            }

            //首次渲染
            var id = meta.id;
            var sample = meta.sample;
            var eventName = meta.eventName;

            var html = $String.format(sample, {
                'id': id,
            });


            var container = $(meta.container);
            if (meta.append) {
                container.append(html);
            }
            else {
                container.prepend(html);
            }

            var div = meta.div = $('#' + id);

            //暴露一个 jQuery 对象给外面使用。 但为了安全起见，内部不使用这个对象。
            this.$ = div;

            var style = Style.get(meta.style);
            div.css(style);

     

            if (meta.volatile) { //指定了易消失，即点击 mask 层就隐藏

                var self = this;

                var fn = function () {
                    var confirmed = self.hide();
                    if (confirmed === false) {
                        return;
                    }

                    //先备份原来的 opacity
                    var opacity = div.css('opacity');

                    //显示一个完全透明的层 200ms，防止点透。
                    //并且禁用事件，避免触发 show 事件。
                    self.show({
                        opacity: 0,
                        quiet: true,
                    });

                    setTimeout(function () {
                        div.css('opacity', opacity).hide();
                    }, 200);
                };


                if (eventName == 'touch') {
                    div.touch(fn);
                }
                else {
                    div.on(eventName, fn);
                }
            }


        },

        /**
        * 显示遮罩层。
        */
        show: function (config) {

            //重载 show(duration);
            if (typeof config == 'number') { 
                config = { 'duration': config, };
            }


            var meta = mapper.get(this);
            var emitter = meta.emitter;

            this.render();

            var div = meta.div;
            var quiet = false;  //是否禁用事件。

            if (config) {

                var style = Style.get(meta.style, config);
                div.css(style);
                quiet = config.quiet;
            }

            meta.showTime = new Date(); //记录开始显示的时间点
            div.show();

            if (!quiet) {
                emitter.fire('show');
            }


            var duration = config && ('duration' in config) ?
                    config.duration :
                    meta.duration;

            if (duration) {
                var self = this;

                setTimeout(function () {
                    self.hide();
                }, duration);
            }

        },

        /**
        * 隐藏遮罩层。
        * @param {number} [lastTime] 需要持续显示的时间。
        */
        hide: function (lastTime) {
            var meta = mapper.get(this);
            var div = meta.div;

            if (!div) {
                return;
            }

            if (!lastTime) {
                return hide();
            }


            var now = new Date();
            var showTime = meta.showTime;

            var useTime = now - showTime;
            var leftTime = lastTime - useTime;

            if (leftTime > 0) {
                setTimeout(hide, leftTime);
            }



            function hide() {
                var values = meta.emitter.fire('hide');
                var confirmed = values.slice(-1)[0];

                if (confirmed === false) {
                    return false;
                }

                meta.showTime = 0;
                div.hide();
            }

        },

        /**
        * 移除遮罩层。
        */
        remove: function () {

            var meta = mapper.get(this);
            var div = meta.div;

            if (!div) {
                return;
            }

            //reset
            meta.div = null;

            div.off();

            div = div.get(0); //拆除 jQuery 包装。
            div.parentNode.removeChild(div);
            meta.emitter.fire('remove');

        },

        /**
        * 绑定事件。
        */
        on: function (name, fn) {
            var meta = mapper.get(this);
            var emitter = meta.emitter;

            var args = [].slice.call(arguments, 0);
            emitter.on.apply(emitter, args);
        },

        /**
        * 销毁本组件
        */
        destroy: function () {
            var meta = mapper.get(this);

            this.remove();

            meta.emitter.destroy();

            mapper.delete(this);
        },

    };


    //静态方法
    Object.assign(Mask, /**@lends Mask*/{

        filter: function (defaults, config) {

            if (typeof defaults == 'number') { //透明度
                defaults = { 'opacity': defaults };
            }

            if (typeof config == 'number') { //透明度
                config = { 'opacity': config };
            }


            var type = typeof defaults;

            if (type == 'object' && typeof config == 'object') {
                return Object.assign({}, defaults, config);
            }

            //禁用 mask
            if (config === false) {
                return null;
            }

            //显式指定使用 mask，如果 defaults 没有，则显式分配一个
            if (config === true) {
                return !defaults || type != 'object' ? {} : defaults;
            }


            //未指定，则使用默认配置指定的，有或没有
            if (config === undefined) {
                return type == 'object' ? defaults :
                    defaults ? {} : null;
            }

            return typeof config == 'object' ? config :
                config ? {} : null;
        },

    });

    return Mask;

});

/**
* Mask 模块的默认配置
* @name Mask.defaults
*/
define('Mask.defaults', /**@lends Mask.defaults*/ {
    
    /**
    * 生成的 id 的前缀。
    */
    prefix: 'KISP-Mask-',

    /**
    * 生成的 id 的随机后缀的长度。
    */
    suffix: 4,

    /**
    * 指定是否易消失，即点击 mask 层就是否隐藏/移除。
    * 可取值为: true|false|"hide"|"remove"，默认为 false，即不易消失。
    */
    volatile: false,

    /**
    * 组件添加到的容器。
    * 默认为 document.body。
    */
    container: document.body,

    /**
    * 把组件添加到容器的方式，是否使用追加的方式。
    * 默认用 prepend 的方式。
    */
    append: false,

    /**
    * 点击时需要用到的事件名。
    */
    eventName: '',

    /**
    * 需要持续显示的毫秒数。
    * 指定为 0 或不指定则表示一直显示。
    */
    duration: 0,

    /**
    * 组件的 css 样式 z-index 值。
    */
    'top': 0,

    /**
    * 组件的 css 样式 bottom 值。
    */
    'bottom': 0,

    /**
    * 组件的 css 样式 opacity 值。
    */
    'opacity': 0.5,

    /**
    * 组件的 css 样式 background 值。
    */
    'background': '#000',

    /**
    * 组件的 css 样式 z-index 值。
    */
    'z-index': 1024,
});

/**
* Mask 模块的默认配置
* @name Mask.config
*/
define('Mask.config', /**@lends Mask.config*/ {
    
    
    //PC 端的用 fixed 定位。
    position: 'fixed',

    /**
    * 点击时需要用到的事件名。
    */
    eventName: 'click',

});

/*
* Mask/Sample
* 由 auto-packer 生成，来源: ../build/pc/0.0.1/src/ui/Mask/Sample.html
*/
define('Mask/Sample', [
    '<div id="{id}" class="KISP Mask" style="display: none;"></div>',
].join('\n'));

/**
*
*/
define('Mask/Style', function (require, module, exports) {
    
    var Style = require('Style');
    

    function getMargin(v) {

        var type = typeof v;

        if (type == 'number') {
            return (0 - v / 2) + 'px';
        }

        if (type == 'string' && v.slice(-2) == 'px') {
            v = parseInt(v);
            return (0 - v / 2) + 'px';
        }

        return '0px';
    }



    function get(item0, item1, itemN) {

        var list = [].slice.call(arguments);

        var style = Style.filter(list, [
            'opacity',
            'top',
            'bottom',
            'background',
            'z-index',
            'position',
        ]);


        return style;

    }


    return {
        get: get,
    };


});


/**
*
*/
define('Loading/Sample', function (require, module, exports) {
    
    var name$sample = {};


    function get(name) {
        var sample = name$sample[name];
        if (sample) {
            return sample;
        }

        sample = module.require(name);
        name$sample[name] = sample;
        return sample;
    }



    return {
        get: get,
    };


});


/**
* 
*/
define('Loading/Style', function (require, module, exports) {

    var Style = require('Style');
    

    function getMargin(v) {

        var type = typeof v;

        if (type == 'number') {
            return (0 - v / 2) + 'px';
        }

        if (type == 'string' && v.slice(-2) == 'px') {
            v = parseInt(v);
            return (0 - v / 2) + 'px';
        }

        return '0px';
    }



    function get(item0, item1, itemN) {

        var list = [].slice.call(arguments);

        var style = Style.filter(list, [
            'background',
            'border-radius',
            'bottom',
            'color',
            'font-size',
            'height',
            'left',
            'margin-top',
            'right',
            'top',
            'width',
            'z-index',
            'position',
        ]);

        ////优先使用 bottom 而非 top
        //if (style['bottom'] != 'initial') {
        //    style['top'] = 'initial';
        //}

        ////优先使用 right 而非 left
        //if (style['right'] != 'initial') {
        //    style['left'] = 'initial';
        //}

        //根据宽度计算 margin-left，使用居中
        style['margin-left'] = getMargin(style.width);

        if (style['margin-top'] === undefined) { //未指定
            style['margin-top'] = getMargin(style.height);
        }




        return style;


    }


    return {
        get: get,
    };


});


/**
* Loading 的预设配置。
*/
define('Loading/Presettings', {

    fullscreen: {
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        'font-size': 15,
        'margin-top': 0,
        'margin-left': 0,
        'margin-right': 0,
        'margin-bottom': 0,
        'border-radius': 0,
    },

    'scroller.pulldown': {
        sample: 'iOS',
        cssClass: 'SameLine',
        text: '加载中...',
        background: 'none',
        color: '#000',
        height: 26,
        width: '100%',
        left: 0,
        top: 0,
        bottom: 'initial',
        right: 'initial',
        'font-size': 15,
        'margin-top': 0,
        'border-radius': 0,
    },

    'scroller.pullup': {
        sample: 'iOS',
        cssClass: 'SameLine',
        text: '加载中...',
        background: 'none',
        color: '#000',
        height: 26,
        width: '100%',
        top: 'initial',
        right: 'initial',
        left: 0,
        bottom: 0,
        'font-size': 15,
        'margin-top': 0,
        'border-radius': 0,
    },

    

});


define('Package/Loader', function (require, module, exports) {


    var $Object = require('Object');


    var loader = {
        'css': loadCss,
        'html': loadHtml,
        'js': loadJs,
    };

    function loadCss(url, fn) {
        var link = document.createElement('link');
        link.rel = 'stylesheet';

        link.onload = function () {
            fn && fn();
        };

        link.onerror = function () {
            throw new Error('css 文件加载失败: ' + url);
        };

        link.href = url;
        document.head.appendChild(link);
    }

    function loadHtml(url, fn) {

        $.ajax({
            type: 'get',
            url: url,
            dataType: 'html',
            cache: true,            //不需要加随机数。
            error: function (ajax, msg, error) {
                throw error;
            },
            success: function (content, msg, ajax) {
                fn && fn(content);
            },
        });
    }

    function loadJs(url, fn) {
        $.ajax({
            type: 'get',
            url: url,
            dataType: 'script',
            cache: true,            //不需要加随机数。
            error: function (ajax, msg, error) {
                throw error;
            },
            success: function (content, msg, ajax) {
                fn && fn(content);
            },
        });
    }



    function checkReady(obj, fn) {

        for (var type in obj) {
            var item = obj[type];

            if (!item.ready) {
                return;
            }
        }
    
        fn && fn(obj);
    }


    
    



    return {

        /**
        * 并行的去加载全部资源。
        */
        'load': function (data, fn) {

            var obj = {};
            var Url = require('Url');
            var root = Url.root();

            $Object.each(loader, function (type, load) {
                var url = data[type];
                if (!url) {
                    return;
                }
          
                
                url = root + url;

                obj[type] = {
                    'url': url,
                    'ready': false,
                    'content': '',
                };
            });



            //并行去加载。
            $Object.each(obj, function (type, item) {

                var url = item.url;
                var load = loader[type]; //对应的 load 方法。

                load(url, function (content) {

                    item.ready = true;
                    item.content = content || '';

                    checkReady(obj, fn);
                });
            });

        },
    };



});


/**
*
*/
define('App/Nav', function (require, module, exports) {

    var Navigator = require('Navigator');
    var $String = require('String');
    var Defaults = require('Defaults');
    var Emitter = require('Emitter');


    function create($module) {

        var defaults = Defaults.clone(module.id);

        var nav = new Navigator({
            'hash': defaults.hash,
        });

        var emitter = new Emitter(nav);


        //重写
        var to = nav.to;
        var on = nav.on;

        nav.to = function (name, arg0, argN) {
            var args = Array.from(arguments);

            //已加载过，或者是同步方式存在的。
            var M = $module.require(name);
            if (M) {
                to.apply(nav, args);
                return;
            }


            //尝试以异步方式去加载。
            var Package = require('Package');

            Package.load(name, function (pack) {
                if (!pack) {
                    emitter.fire('404', args);
                    throw new Error('不存在名为 ' + name + ' 的分包配置数据。');
                }

                var item = pack['html'];
                if (item) {
                    $(defaults.container).append(item.content);
                }

                var M = $module.require(name);
                if (!M) {
                    emitter.fire('404', args);
                    throw new Error('不存在名为 ' + name + ' 的视图');
                }

                to.apply(nav, args);
            });
        };


        nav.on = function (name, fn) {
            if (name == '404') {
                emitter.on(name, fn);
                return;
            }

            var args = Array.from(arguments);
            on.apply(nav, args);
        };


        return nav;
    }




    return {
        'create': create,
    };



});

/**
* App/Nav 模块的默认配置
* @name Nav.defaults
*/
define('App/Nav.defaults', function (require, module, exports) {

    var $String = require('String');

    return /**@lends App/Nav.defaults*/ {

        /**
        * 以异步方式加载到的 html 要附加到的容器。
        * 仅针对独立打包的情况。
        */
        container: 'body',


        hash: function (current) {
            //为了让 url 中的 hash 可读性更好，有助于快速定位到相应的视图模块。
            return current + '-' + $String.random(4);
        },
    }

});

/**
* 状态导航器
* @class
* @name Navigator
*/
define('Navigator', function (require, module,  exports) {

    var $String = require('String');
    var Emitter = require('Emitter');
    var Hash = require('Hash');

    var mapper = new Map();


    /**
    * 创建一个视图导航管理器。
    * @param {Object} config，配置参数对象，其中字段：
    * @param {function} [config.hash]  hash 的生成规则。

    */
    function Navigator(config) {

        var emitter = new Emitter(this);
        var self = this;
        var hash = config.hash;

        var meta = {
            'emitter': emitter,
            'statcks': [],
            'quiet': false,
            'hash': hash,
        };

        mapper.set(this, meta);


        //则监听 hash 的变化
        hash && Hash.onchange(window, function (hash, old) {
            if (meta.quiet) { //说明是 to() 方法中引起的 hash 变化或刻意不想引起，忽略。
                meta.quiet = false;     
            }
            else {
                self.back();
            }
        });

    }

    //实例方法
    Navigator.prototype = /**@lends Navigator#*/ {
        constructor: Navigator,

        /**
        * 绑定事件。
        */
        on: function (name, fn) {
            var meta = mapper.get(this);
            var emitter = meta.emitter;

            var args = Array.from(arguments);
            emitter.on.apply(emitter, args);
        },


        /**
        * 跳转到指定的视图，并传递一些参数。
        */
        to: function (target, argN) {

            var meta = mapper.get(this);
            var emitter = meta.emitter;
            var statcks = meta.statcks;
            var args = Array.from(arguments);
            var current = statcks.slice(-1)[0]; //取得最后一个

            if (current) {
                emitter.fire('before-to', [current, target]); //总事件
            }

            statcks.push(target);
            emitter.fire('to', args);   //触发总的事件
            meta.quiet = true;          //前进时会导致 hash 发生变化，设置此标志告诉到 hash-change 事件

            var hash = meta.hash;

            if (typeof hash == 'function') {
                hash = hash.call(this, target);
            }

            if (hash) {
                Hash.set(window, hash);
            }
           
        },


        /**
        * 后退。
        * 已重载 back(false)，即只后退一步，并且不触发事件。 
        * 默认是触发事件的。
        * 采用不触发事件模式，是为了适应某些场景。
        * @param {Number} count 要后退的步数。 
            默认为 1，如果要一次性后退 n 步，请指定一个大于 0 的整型。
        */
        back: function (count) {

            var fireEvent = true;

            if (count === false) { //重载 back(false)，不触发事件。
                fireEvent = false;
            }

            count = count || 1;

            if (count < 0) {
                throw new Error('要后退的步数必须大于 0');
            }

            var meta = mapper.get(this);
            var statcks = meta.statcks;
            var currentIndex = statcks.length - 1;      //当前视图在最后一项
            var targetIndex = currentIndex - count;     //目标视图索引

            if (targetIndex < 0 ) {
                return; //直接忽略，不抛出异常。 因为实际场景中，用户可能会一直后退。
            }


            var current = statcks[currentIndex];
            var target = statcks[targetIndex];

            statcks.splice(targetIndex + 1); //删除目标视图后面的

            if (fireEvent) {
                var emitter = meta.emitter;
                emitter.fire('back', [current, target]);
            }

            return target; //把当前视图返回去，业务层可能会用到。
        },


        /**
        * 获取堆栈历史中指定索引值的视图。
        * @param {Number} index 要获取的视图的索引值。
        *   从 0 开始，如果指定为0或正数，则从左边开始获取。
        *   如果指定为负数，则从右边开始获取。
        *   因为当此视图为 -1，倒数第二个为 -2，依次类推。
        */
        get: function (index) {
            var meta = mapper.get(this);
            var statcks = meta.statcks;
            var len = statcks.length;

            if (index < 0) {
                index = index + len;
            }

            return statcks[index];
        },

    };



    return Navigator;

});



/**
* Hash 工具类
* @namespace
* @name Hash
*/
define('Hash', function (require, module, exports) {

    var $Object = require('Object');

    var emitter = null; //绑定指定 window 的 hashchange 事件。
    var mapper = null;  //用来记录某个 window 是否已绑定了 hashchange 事件。


    module.exports = exports = /**@lends Hash */ {

        /**
        * 获取指定 url 的 hash 中指定的键所对应的值。
        * @param {string} url 要进行获取的 url 字符串。
        * @param {string} [key] 要检索的键。
        * @param {boolean} [ignoreCase=false] 是否忽略参数 key 的大小写。 默认区分大小写。
            如果要忽略 key 的大小写，请指定为 true；否则不指定或指定为 false。
            当指定为 true 时，将优先检索完全匹配的键所对应的项；若没找到然后再忽略大小写去检索。
        * @retun {string|Object|undefined} 返回一个查询字符串值。
            当不指定参数 key 时，则获取全部 hash 值，对其进行 unescape 解码，
            然后返回一个等价的 Object 对象。
            当指定参数 key 为一个空字符串，则获取全部 hash (不解码)，返回一个 string 类型值。
        * @example
            Hash.get('http://test.com?query#a%3D1%26b%3D2', 'a');  //返回 '1'
            Hash.get('http://test.com?query#a%3D1%26b%3D2', 'c');  //返回 undefined
            Hash.get('http://test.com?query#a%3D1%26A%3D2', 'A');  //返回 2
            Hash.get('http://test.com?query#a%3D1%26b%3D2', 'A', true);//返回 1
            Hash.get('http://test.com?query#a%3D1%26b%3D2', '');   //返回 'a%3D1%26b%3D2'
            Hash.get('http://test.com?query#a%3D1%26b%3D2');       //返回 {a: '1', b: '2'}
            Hash.get('http://test.com?query#a%3D%26b%3D');         //返回 {a: '', b: ''}
            Hash.get('http://test.com??query#a%26b');              //返回 {a: '', b: ''}
            Hash.get('http://test.com?query#a', 'a');              //返回 ''
        */
        get: function (url, key, ignoreCase) {

            //重载 get(location, key, ignoreCase)
            //重载 get(window, key, ignoreCase)
            if (typeof url == 'object') {
                url = ('href' in url) ? url.href :  //location
                    url.location.href;              //window
            }


            var beginIndex = url.indexOf('#');
            if (beginIndex < 0) { //不存在查询字符串
                return;
            }

            var endIndex = url.length;

            var hash = url.slice(beginIndex + 1, endIndex);
            hash = unescape(hash); //解码

            if (key === '') { //获取全部 hash 的 string 类型
                return hash;
            }

            

            var Query = require('Query');
            var obj = Query.parse(hash);

            if (key === undefined) { //未指定键，获取整个 Object 对象
                return obj;
            }

            if (!ignoreCase || key in obj) { //区分大小写或有完全匹配的键
                return obj[key];
            }


            //以下是不区分大小写
            key = key.toString().toLowerCase();

            for (var name in obj) {
                if (name.toLowerCase() == key) {
                    return obj[name];
                }
            }
        },
        /**
        * 把指定的 hash 设置到指定的 url 上。
        * 该方法会对 hash 进行 escape 编码，再设置到 url 上，以避免 hash 破坏原有的 url。
        * 同时原有的 hash 会移除掉而替换成新的。
        * @param {string} url 要设置的 url 字符串。
        * @param {string|number|boolean|Object} key 要设置的 hash 的键。
            当传入一个 Object 对象时，会对键值对进行递归编码成查询字符串， 然后用 escape 编码来设置 hash 。
            当传入的是一个 string|number|boolean 类型，并且不传入第三个参数， 则直接用 escape 编码来设置 hash 。
        * @param {string} [value] 要添加的 hash 的值。
        * @retun {string} 返回组装后的新的 url 字符串。
        * @example
            //返回 'http://test.com?#a%3D1'
            Hash.set('http://test.com', 'a', 1);  
            
            //返回 'http://test.com?query#a%3D3%26d%3D4'
            Hash.set('http://test.com?query#a%3D1%26b%3D2', {a: 3, d: 4});  
    
            //返回 'http://test.com?query#a%3D3%26d%3D4'
            Hash.set('http://test.com?query#a%3D1%26b%3D2', 'a=3&b=4'); 
            
        */
        set: function (url, key, value) {

            var location = null;

            if (typeof url == 'object') {
                if ('href' in url) {
                    location = url;         //location
                }
                else {
                    location = url.location; //window
                }
                url = location.href;
            }



            var type = typeof key;
            var isValueType = (/^(string|number|boolean)$/).test(type);


            var hash = '';

            if (arguments.length == 2 && isValueType) {
                hash = String(key);
            }
            else {
                var Query = require('Query');
                var obj = type == 'object' ? key : $Object.make(key, value);
                hash = Query.stringify(obj);
            }


            hash = escape(hash); //要进行编码，避免破坏原有的 url

            var index = url.lastIndexOf('#');
            if (index > -1) {
                url = url.slice(0, index);
            }

            url = url + '#' + hash;

            if (location) {
                location.hash = hash; //不要设置整个 location.href，否则会刷新
            }

            return url;

        },



        /**
        * 判断指定的 url 是否包含特定名称的 hash。
        * @param {string} url 要检查的 url。
        * @param {string} [key] 要提取的查询字符串的键。
        * @param {boolean} [ignoreCase=false] 是否忽略参数 key 的大小写，默认区分大小写。
            如果要忽略 key 的大小写，请指定为 true；否则不指定或指定为 false。
            当指定为 true 时，将优先检索完全匹配的键所对应的项；若没找到然后再忽略大小写去检索。
        * @retun {boolean} 如果 url 中包含该名称的查询字符串，则返回 true；否则返回 false。
        * @example
            Hash.has('http://test.com?a=1&b=2#hash', 'a');  //返回 true
            Hash.has('http://test.com?a=1&b=2#hash', 'b');  //返回 true
            Hash.has('http://test.com?a=1&b=2#hash', 'c');  //返回 false
            Hash.has('http://test.com?a=1&b=2#hash', 'A', true); //返回 true
            Hash.has('http://test.com?a=1&b=2#hash');       //返回 true
        */
        has: function (url, key, ignoreCase) {

            //重载 has(location, key, ignoreCase)
            //重载 has(window, key, ignoreCase)
            if (typeof url == 'object') {
                url = ('href' in url) ? url.href :  //location
                    url.location.href;              //window
            }


            var obj = exports.get(url); //获取全部 hash 字符串的 Object 形式

            if (!obj) {
                return false;
            }


            if (!key) { //不指定名称，
                return !$Object.isEmpty(obj); //只要有数据，就为 true
            }

            if (key in obj) { //找到完全匹配的
                return true;
            }


            if (ignoreCase) { //明确指定了忽略大小写

                key = key.toString().toLowerCase();

                for (var name in obj) {
                    if (name.toLowerCase() == key) {
                        return true;
                    }
                }
            }

            //区分大小写，但没找到
            return false;

        },


        /**
        * 监听指定窗口 url 的 hash 变化，并触发一个回调函数。
        * @param {Window} window 要监听的 window 窗口。
        * @param {function} fn 当监听窗口的 hash 发生变化时，要触发的回调函数。
        *   该回调函数会接收到两个参数：newHash 和 oldHash，当前的 hash 值和旧的 hash 值。
        *   注意，newHash 和 oldHash 都去掉了 '#' 号而直接保留 hash 值。
        *   如果 oldHash 不存在，则为 null。
        *   该回调函数内部的 this 指向监听的窗口。
        * @param {boolean} [immediate=false] 指示初始时当窗口中存在 hash 时是否要立即执行回调函数。
            初始时当窗口中存在 hash 时，如果要立即执行回调函数，请指定该参数为 true；
            否则不指定或指定为 false。
        * @example
            Hash.onchange(top, function (newHash, oldHash) {
                console.log('new hash: ' + newHash);
                console.log('old hash: ' + oldHash);
                console.log(this === top); //true
            });
        */
        onchange: function (window, fn, immediate) {

            if (!emitter) { //首次绑定
                var Emitter = require('Emitter');
                emitter = new Emitter();
            }

            emitter.on('change', fn);

            var location = window.location;
            var hash = exports.get(window, '');

            if (hash && immediate) { //如果有 hash，并且指定了要立即触发，则立即触发
                fn.call(window, hash, null); //不要用 fire，因为可能会影响之前绑定的
            }

            if (!mapper) { //首次绑定
                mapper = new Map();
            }

            if (mapper.get(window)) { // window 所对应的窗口已绑定 hashchange
                return;
            }

            // window 所对应的窗口首次绑定 hashchange
            window.onhashchange = function () {
                var oldHash = hash;
                hash = exports.get(window, '');
                emitter.fire('change', [hash, oldHash]);
            };

            mapper.set(window, true);
        },

    };

});


/**
* alert 对话框
* @namespace
* @name Alert
* @private
*/
define('Alert', function (require, module, exports) {

    var $String = require('String');
    var Dialog = module.require('Dialog');



    /**
    * 显示一个 alert 对话框。 
    * 支持多次调用，会将多次调用加进队列，在显示完上一次后进行下一次的显示。
    */
    function show(text, text1, textN, fn) {

        //重载 get(obj); 以方便程序员调试查看 json 对象。
        if (typeof text == 'object') {
            var Sample = module.require('Sample');
            text = JSON.stringify(text, null, 4);
            text = $String.format(Sample, { 'text': text, });
        }

        var args = [].slice.call(arguments, 1);

        //在参数列表中找到的第一个函数当作是回调函数，并忽略后面的参数。
        var index = args.findIndex(function (item, index) {
            return typeof item == 'function';
        });

        if (index >= 0) { //找到回调函数
            fn = args[index];
            args = args.slice(0, index); //回调函数前面的都当作是要显示的文本
        }
        else {
            fn = null;
        }

        args = [text].concat(args);
        text = $String.format.apply(null, args);



        Dialog.add(text, fn);
    }




    return {
        show: show,
    };

});

/**
* Alert 模块的默认配置
* @name Alert.defaults
*/
define('Alert.defaults', /**@lends Alert.defaults*/ {
    button: '确定',
    volatile: false,
    mask: true,
    autoClosed: true,
    width: '80%',
    'z-index': 99999,

});

/**
* Alert 模块的默认配置
* @name Alert.config
*/
define('Alert.config', /**@lends Alert.config*/ {
    width: 450,

});

define('Alert/Dialog', function (require, module, exports) {

    var $String = require('String');
    var Defaults = require('Defaults');

    var dialog = null;
    var visible = false;
    var list = [];
    var activeElement = null;   //上次获得焦点的元素。
    var showFrom = 13;          //记录一下是否由于按下回车键导致的显示。

    //创建对话框
    function create() {

        var config = Defaults.clone('Alert');

        var Dialog = require('Dialog');
        var dialog = new Dialog({
            'cssClass': 'Alert',
            'volatile': config.volatile,
            'mask': config.mask,
            'autoClosed': config.autoClosed,
            'width': config.width,
            'z-index': config['z-index'],
            'buttons': [
               {
                   name: 'ok',
                   text: config.button,
               },
            ],
        });


        dialog.on('button', 'ok', function () {
            var fn = dialog.data('fn');
            fn && fn();
        });


        dialog.on({
            'show': function () {
                visible = true;

                showFrom = showFrom == 13 ? 'enter' : '';
                activeElement = document.activeElement;
                activeElement.blur();
            },

            'hide': function () {
                visible = false;
                var obj = list.shift();
                if (obj) {
                    render(obj.text, obj.fn);
                }

                //activeElement && activeElement.focus();
                activeElement = null;
                showFrom = '';
            },
        });

        //响应回车键
        $(document).on({
            'keydown': function (event) {
                showFrom = event.keyCode;
            },
            'keyup': function (event) {

                var invalid =
                        event.keyCode != 13 ||  //不是回车键。
                        !visible ||             //已是隐藏，避免再次触发。
                        showFrom == 'enter';    //由于之前按下回车键导致的显示。

                if (invalid) {
                    return;
                }

                dialog.hide();

                var fn = dialog.data('fn');
                fn && fn();
            },
        });



        return dialog;

    }






    //根据文本来计算高度，大概值，并不要求很准确。
    function getHeightByLength(text) {

        text = String(text);
        var len = $String.getByteLength(text);
        var h = Math.max(len, 125);
        var max = document.documentElement.clientHeight;

        if (h >= max * 0.8) {
            h = '80%';
        }

        return h;
    }

    //根据文本来计算高度，大概值，并不要求很准确。
    function getHeightByLines(text) {

        text = String(text);
        var lines = text.split('\n');
        //debugger
        var h = lines.length * 25 + 60;
        var max = document.documentElement.clientHeight;

        if (h >= max * 0.8) {
            h = '80%';
        }

        return h;
    }

    function getHeight(text) {
        var h0 = getHeightByLength(text);
        var h1 = getHeightByLines(text);
        var h = Math.max(h0, h1);
        return h;

    }


    function render(text, fn) {

        var height = getHeight(text);

        dialog = dialog || create();

        dialog.data('fn', fn);
        dialog.set('text', text);
        dialog.set('height', height);

        dialog.show();

    }


    function add(text, fn) {

        //首次显示，或之前显示的已经给隐藏了，立即显示出来。
        if (!visible) {
            render(text, fn);
            return;
        }

        //已经是显示的，加到队列里进行排队。
        list.push({
            'text': text,
            'fn': fn,
        });
    }


    //add(0, function () { });
    //add(1, function () { });
    //add(2, function () { });


    return {
        add: add,
    };

});
/**
* 对话框组件
* @class
* @name Dialog
*/
define('Dialog', function (require, module, exports) {

    var $Object = require('Object');
    var Emitter = require('Emitter');
    var Defaults = require('Defaults');
    var RandomId = require('RandomId');

    //子模块
    var Sample = module.require('Sample');
    var Style = module.require('Style');
    var Renderer = module.require('Renderer');

    var mapper = require('Mapper');


    /**
    * 构造器。
    * @constructor
    */
    function Dialog(config) {

        config = Defaults.clone(module.id, config);

        var emitter = new Emitter(this);

        var cssClass = config.cssClass;
        if (cssClass instanceof Array) {
            cssClass = cssClass.join(' ');
        }

        var buttons = config.buttons;
        var eventName = config.eventName;

        var prefix = config.prefix;
        var suffix = config.suffix;

        var meta = {
            'id': RandomId.get(prefix, suffix),
            'articleId': RandomId.get(prefix, 'article-', suffix),
            'contentId': RandomId.get(prefix, 'content-', suffix),
            'footerId': RandomId.get(prefix, 'footer-', suffix),
            'div': null,
            'scrollable': config.scrollable,
            'scroller': null,
            'scrollerConfig': config['scroller'],
            'eventName': eventName,
            'title': config.title,
            'text': config.text,
            'buttons': buttons,
            'samples': Sample.get(config.sample),//加载相应的 HTML 模板
            'emitter': emitter,
            'mask': config.mask,
            'masker': null,                     // Mask 的实例，重复使用
            'layer': null,                      //用来防止点透用的透明层，
            'cssClass': cssClass,
            'style': Style.get(config),
            'autoClosed': config.autoClosed,    //点击任何一个按钮后是否自动关闭组件
            'visible': false,                   //记录当前组件是否已显示
            'volatile': config.volatile,
            'zIndex': config['z-index'],        //生成透明层时要用到
            'data': {},                         //供 this.data() 方法使用
            'stopHide': false,                  //避免 masker 和 self 的 hide 死循环。
            'width': config.width,
            'height': config.height,

        };

        mapper.set(this, meta);


        //预绑定事件
        if (buttons && buttons.length > 0) {
            buttons.forEach(function (item, index) {
                var fn = item.fn;
                if (!fn) {
                    return;
                }

                var name = item.name || String(index);
                //这两个已废弃，建议使用 #2
                emitter.on(eventName, 'button', name, fn);

                //#2 建议使用
                emitter.on('button', name, fn);
            });
        }

        //当宽度或高度指定了百分比，需要监听窗口的大小变化，以使组件大小相适应
       
        $(window).on('resize', function () {
            var style = $Object.filter(meta, ['width', 'height']);
            style = Style.get(style);

            $(meta.div).css(style);
        });

        
    }


    //实例方法
    Dialog.prototype = /**@lends Dialog#*/ {
        constructor: Dialog,

        /**
        * $(container) 的快捷方式。
        */
        $: null,

        /**
        * 渲染本组件。
        * 该方法会创建 DOM 节点，并且绑定事件，但没有调用 show()。
        */
        render: function () {
            var meta = mapper.get(this);
            var div = meta.div;

            //已经渲染过了
            if (div) {
                return;
            }

            div = meta.div = Renderer.render(meta, this);
            $(div).hide(); //先隐藏

            var Mask = require('Mask');
            var zIndex = meta.zIndex;

            meta.masker = new Mask({
                'z-index': zIndex - 1,
                'volatile': meta.volatile,
            });

            meta.masker.on('show', function () {
                meta.stopHide = false; //重置，避免多次调用 dialog.show() 后的 masker 层无法隐藏。
            });

            if (meta.volatile) {
                var self = this;
                meta.masker.on('hide', function () {
                    if (meta.stopHide) {
                        meta.stopHide = false;
                    }
                    else {
                        meta.stopHide = true;
                        self.hide();
                    }
                });
            }

            //防止点透
            meta.layer = new Mask({
                opacity: 0,
                'z-index': zIndex + 1,
            });
        },

        /**
        * 显示本组件。
        */
        show: function (mask) {
            var meta = mapper.get(this);
            var emitter = meta.emitter;

            this.render();


            var Mask = require('Mask');
            mask = Mask.filter(meta.mask, mask);

            //指定了启用 mask 层
            if (mask) {
                meta.masker.show(mask);
            }
            else {
                masker.hide();
            }

            meta.layer.show({ duration: 200 });

            //这个不能放在 setTimeout 里，因为外面可能已经调用了 set('height') 等改变了
            $(meta.div).css(meta.style);


            //这里要用异步稍微延迟一下，不然会跟 layer 的 show 几乎是同时的
            setTimeout(function () {
                $(meta.div).show();
               
            }, 0);

            //事件触发不能延迟，否则可能会导致业务层绑定的 show 事件也延迟，带会一系列问题。
            meta.visible = true;
            emitter && emitter.fire('show'); //外面可能已经调用了 destroy() 而导致 emitter 不可用。
        },

        /**
        * 隐藏本组件。
        * @param {number} [lastTime] 需要持续显示的时间。
        */
        hide: function () {
            var meta = mapper.get(this);
            var div = meta.div;

            if (!div || !meta.visible) {
                return;
            }

            var masker = meta.masker;
            if (masker) {
                if (meta.stopHide) {
                    meta.stopHide = false;
                }
                else {
                    meta.stopHide = true;
                    masker.hide();
                }
            }

            $(div).hide();
            meta.visible = false;
            meta.emitter.fire('hide');

        },

        /**
        * 移除本组件对应的 DOM 节点。
        */
        remove: function () {

            var meta = mapper.get(this);
            var div = meta.div;

            if (!div) {
                return;
            }


            var masker = meta.masker;
            if (masker) {
                masker.remove();
            }

            var layer = meta.layer;
            if (layer) {
                layer.remove();
            }

            //reset
            meta.div = null;
            meta.masker = null;
            meta.layer = null;
            meta.visible = false;

            $(div).off();

            div.parentNode.removeChild(div);
            meta.emitter.fire('remove');

        },

        /**
        * 绑定事件。
        */
        on: function (name, fn) {
            var meta = mapper.get(this);
            var emitter = meta.emitter;

            var args = [].slice.call(arguments, 0);
            emitter.on.apply(emitter, args);
        },

        /**
        * 销毁本组件
        */
        destroy: function () {
            var meta = mapper.get(this);
            if (!meta) {
                throw new Error('该实例已给销毁，无法再次调用 destroy 方法。');
            }

            var emitter = meta.emitter;
            var scroller = meta.scroller;

            this.remove();
            emitter.destroy();
            scroller && scroller.destroy(); //在 PC 端为 null

            mapper.delete(this);
        },

        /**
        * 设置指定的属性。
        * @param {string} name 要设置的属性的名称。 目前支持的字段有： 
            'text',
            'height',
            'width',
        * @param value 要设置的属性的值，可以是任何类型。
        */
        set: function (name, value) {

            var meta = mapper.get(this);
            var scroller = meta.scroller;

            this.render();

            switch (name) {
                case 'text':
                    $('#' + meta.contentId).html(value);
                    scroller && scroller.refresh(200);
                    break;

                case 'height':
                case 'width':
                    var obj = {};
                    obj[name] = meta[name] = value;
                    obj = Style.get(obj);
                    Object.assign(meta.style, obj); //回写，避免调用 show 时又给重置
                    $(meta.div).css(obj);
                    scroller && scroller.refresh(300);
                    break;

                default:
                    throw new Error('目前不支持设置属性: ' + name);
            }


        },

        /**
        * 获取或设置自定义数据。 
        * 已重载 data()、 data(key)、data(obj)、data(key, value)。
        * 在跨函数中传递数据时会比较方便。
        * @param {string|Object} key 要获取或设置的数据的名称(键)。
            当指定为一个纯对象 {} 时，则表示批量设置。
            当指定为字符串或可以转为字符串的类型时，则表示获取指定名称的数据。
        * @param value 要设置的数据的值。 只有显式提供该参数，才表示设置。
        * @return 返回获取到的或设置进来的值。
        */
        data: function (key, value) {
            var meta = mapper.get(this);
            var data = meta.data;

            var len = arguments.length;
            if (len == 0) { //获取全部
                return data;
            }

            //重载 data(obj); 批量设置
            if ($Object.isPlain(key)) {
                Object.assign(data, key);
                return key;
            }

            //get(key)
            if (len == 1) {
                return data[key];
            }

            //set(key, value)
            data[key] = value;
            return value;

        },


    };

    return Dialog;

});

/**
* Dialog 模块的默认配置
* @name Dialog.defaults
*/
define('Dialog.defaults', /**@lends Dialog.defaults*/ {

    /**
    * 生成的 id 的前缀。
    */
    prefix: 'KISP-Dialog-',

    /**
    * 生成的 id 的随机后缀的长度。
    */
    suffix: 4,

    /**
    * 是否启用 mask 层。
    */
    mask: true,

    /**
    * 点击按钮后是否自动关闭组件。
    * 可取值为: true|false，默认为 true，即自动关闭。
    */
    autoClosed: true,

    /**
    * 指定是否易消失，即点击 mask 层就是否隐藏/移除。
    * 可取值为: true|false，默认为不易消失。
    */
    volatile: false,

    /**
    * 组件的标题文本。
    */
    title: '',

    /**
    * 组件的内容文本。
    */
    text: '',

    /**
    * 组件的 css 样式 z-index 值。
    */
    'z-index': 1024,

    /**
    * 组件用到的 html 模板。
    * 默认为 'iOS'。 业务层不需要关注该字段。
    */
    sample: 'iOS',

    /**
    * 组件用到的 css 类名。
    */
    cssClass: '',

    /**
    * 点击按钮时需要用到的事件名。
    */
    eventName: '',

    /**
    * 组件宽度。
    * 可以指定为百分比的字符串，或指定具体的数值（单位为像素），
    */
    width: '80%',

    /**
    * 组件高度。
    * 可以指定为百分比的字符串，或指定具体的数值（单位为像素），
    */
    height: '50%',

    /**
    * 按钮数组。
    */
    buttons: [],


});

/**
* Dialog 模块的默认配置
* @name Dialog.config
*/
define('Dialog.config', /**@lends Dialog.config*/ {


    /**
    * 内容区是否可滚动。
    * PC 端用不可滚动。
    */
    scrollable: false,

    /**
    * 针对滚动器的配置。
    * PC 端。
    */
    scroller: null,

    /**
    * 点击按钮时需要用到的事件名。
    * PC 端。
    */
    eventName: 'click',

    //PC 端的用 fixed定位。
    position: 'fixed',

    width: 600,


});


/**
* 针对有继承关系的类提供同一个的 mapper 实例容器。
* @namespace
* @name Mapper
*/
define('Mapper', function (require, module, exports) {
    var mapper = new Map();
    return mapper;

});


define('Dialog/Sample', function (require, module, exports) {
    
    var $String = require('String');

    //去掉多余的换行和空格
    function trim(s) {
        return s.replace(/\n|\r|\r\n/g, ' ')
                .replace(/\s+/g, ' ');
    }


    function get(name) {

        var sample = module.require(name);
        var samples = $String.getTemplates(sample, [
            {
                name: 'div',
                begin: '#--div.begin--#',
                end: '#--div.end--#',
                fn: trim,
            },
            {
                name: 'header',
                begin: '#--header.begin--#',
                end: '#--header.end--#',
                outer: '{header}',
                fn: trim,
            },
            {
                name: 'footer',
                begin: '#--footer.begin--#',
                end: '#--footer.end--#',
                outer: '{footer}',
                fn: trim,
            },
            {
                name: 'button',
                begin: '#--button.begin--#',
                end: '#--button.end--#',
                outer: '{buttons}',
                fn: trim,
            },
        ]);

        return samples;
    }





    return {
        get: get,
    };


});


/**
* 
*/
define('Dialog/Style', function (require, module, exports) {

    var Style = require('Style');
    

    function getMargin(v) {

        var type = typeof v;

        if (type == 'number') {
            return (0 - v / 2) + 'px';
        }

        if (type == 'string' && v.slice(-2) == 'px') {
            v = parseInt(v);
            return (0 - v / 2) + 'px';
        }

    }



    function get(config) {

        var style = Style.filter(config, [
            'background',
            'border',
            'border-radius',
            'height',
            'width',
            'z-index',
            'position',
        ]);

        if ('width' in style) {
            var width = style.width;

            if (typeof width != 'number') {
                var maxWidth = document.documentElement.clientWidth;
                if (Style.checkUnit(width, '%')) {
                    style.width = Style.parsePercent(width, maxWidth);
                }
                else if (!width) {
                    style.width = maxWidth * 0.8 + 'px';
                }
            }
        }


        if ('height' in style) {
            var height = style.height;

            if (typeof height != 'number') {
                var maxHeight = document.documentElement.clientHeight;
                if (Style.checkUnit(height, '%')) {
                    style.height = Style.parsePercent(height, maxHeight);
                }
                else if (!height) {
                    style.height = maxHeight * 0.8 + 'px';
                }
            }
        }

       
        

        

        //根据宽度计算 margin-left 和 margin-top，使其居中

        var v = getMargin(style.width);
        if (v) {
            style['margin-left'] = v;
        }

        v = getMargin(style.height);
        if (v) {
            style['margin-top'] = v;
        }

        return style;


    }




    

    return {
        get: get,
    };


});


/**
*
*/
define('Dialog/Renderer', function (require, module, exports) {

    var $String = require('String');
    var Style = require('Style');
    

    function getStyle(item) {

        if (!item) {
            return '';
        }

        var style = Style.filter(item, [
            'border-bottom',
            'color',
            'font-size',
            'font-weight',
            'width',
        ]);

        style = Style.stringify(style);
        return style;
    }

    


    function render(meta, dialog) {

        var buttons = meta.buttons || [];
        var emitter = meta.emitter;
        var id = meta.id;
        var articleId = meta.articleId;
        var footerId = meta.footerId;
        var style = meta.style;
        var samples = meta.samples;



        var title = meta.title;

        //标准化成一个 object
        if (title && typeof title != 'object') {
            title = { 'text': title || '', };
        }
 

        var html = $String.format(samples['div'], {
            'id': id,
            'article-id': articleId,
            'content-id': meta.contentId,
            'cssClass': meta.cssClass,
            'style': Style.stringify(style),
            'text': meta.text,
            'text-height': parseInt(style.height) - 44 * 2 - 2,
            'no-header': title ? '' : 'no-header',              //针对无标题时
            'no-footer': buttons.length > 0 ? '' : 'no-footer', //针对无按钮时

            'header': (function (title) {
                if (!title) {
                    return '';
                }

                return $String.format(samples['header'], {
                    'style': getStyle(title),
                    'title': title.text,
                });

            })(title),

            'footer': (function (buttons) {
                var count = buttons.length;
                if (!count) {
                    return '';
                }

                return $String.format(samples['footer'], {
                    'id': footerId,
                    'count': count,
                    'buttons': buttons.map(function (item, index) {

                        if (typeof item == 'string') {
                            buttons[index] = item = {
                                'text': item,
                            };
                        }

                        return $String.format(samples['button'], {
                            'index': index,
                            'text': item.text,
                            'style': getStyle(item),
                        });

                    }).join(''),
                });

            })(buttons),
        });


        $(document.body).prepend(html);



        var eventName = meta.eventName;

        var article = $('#' + articleId);

        if (eventName == 'touch') {
            article.touch(function () {
                emitter.fire('touch-main');
            });
        }
        else {
            article.on(eventName, function () {
                emitter.fire(eventName + '-main');
            });
        }

        //指定了可滚动
        if (meta.scrollable) {
            var Scroller = require('Scroller');
            var scroller = new Scroller(article.get(0), meta.scrollerConfig);
            meta.scroller = scroller;
        }



        //底部按钮组
        var footer = $('#' + footerId);
        if (buttons.length > 0) { //有按钮时才绑定

            if (eventName == 'touch') { //移动端的，特殊处理
                footer.touch('[data-index]', fn, 'pressed');
            }
            else { // PC 端
                footer.on(eventName, '[data-index]', fn);

                footer.on('mousedown', '[data-index]', function (event) {
                    var button = this;
                    $(button).addClass('pressed');
                });


                footer.on('mouseup mouseout', '[data-index]', function (event) {

                    var button = this;
                    $(button).removeClass('pressed');
                });
            }

            function fn(event) {
                var button = this;
                var index = +button.getAttribute('data-index');
                var item = buttons[index];
                var name = item.name || String(index);


                //这两个已废弃，建议使用 #2
                emitter.fire('click', 'button', name, [item, index]);
                emitter.fire('click', 'button', [item, index]);

                //#2 建议使用
                emitter.fire('button', name, [item, index]);
                emitter.fire('button', [item, index]);

                // item.autoClosed 优先级高于 meta.autoClosed
                var autoClosed = item.autoClosed;
                if (autoClosed === undefined) {
                    autoClosed = meta.autoClosed;
                }

                if (autoClosed) {
                    dialog.hide();
                }

            }
        }
        

        var div = document.getElementById(id);

        //暴露一个 jQuery 对象给外面使用。 但为了安全起见，内部不使用这个对象。
        dialog.$ = $(div);

        return div;

    }


    return {

        render: render,
    };

});


/**
* 移动端滚动器。
* 对 iScroll 组件的进一步封装。
* @class
* @name Scroller
*/
define('Scroller', function (require, module,  exports) {
    
    var Emitter = require('Emitter');
    var $Object = require('Object');
    var Defaults = require('Defaults');
    var Style = require('Style');

    var mapper = new Map();




    //阻止原生的 touchmove 事件
    document.addEventListener('touchmove', function (e) {
        e.preventDefault();
    }, {
        passive: false,
    });


    /**
    * 滚动器构造函数。
    */
    function Scroller(el, config) {

        //重载 Scroller(config)
        if ($Object.isPlain(el)) {
            config = el;
            el = config.el;
        }


        config = Defaults.clone(module.id, config);

        //过滤出 iScroll 的所用到的字段
        var obj = $Object.filter(config, [
            'scrollbars',
            'shrinkScrollbars',
            'preventDefault',
            'probeType',
        ]);
        

        var IScroll = require('IScroll');
        var scroller = new IScroll(el, obj);


        var style = Style.filter(config, [
            'top',
            'left',
            'right',
            'bottom',
            'width',
        ]);


        $(el).addClass('KISP Scroller').css(style);


        var emitter = new Emitter(this);

        //jQuery 包装后的滚动条的数组。
        var indicators = scroller.indicators || [];

        indicators = indicators.map(function (item, index) {
            item = $(item.indicator);
            item.hide();
            return item;
        });


        var meta = {
            'emitter': emitter,
            'scroller': scroller,
            'enabled': config.enabled,
            'indicators': indicators,
            'pulldown': {},
            'pullup': {},
            'hasBindPull': false, //是否已绑定 pull 中要用到的事件
            'el': el,

        };

        mapper.set(this, meta);

        
        //判断是否有滚动条。
        function hasScrollBar() {
            var hasX = scroller.hasHorizontalScroll;
            var hasY = scroller.hasVerticalScroll;
            var len = indicators.length;

            return (len == 1 && (hasX || hasY)) ||
                (len == 2 && (hasX && hasY));
        }


        scroller.on('scroll', function () {
            if (!this.hasVerticalScroll) {
                this._translate(0, (this.distY * 0.5) >> 0);
            }
        });

        var timeoutId = null;
        var isScrolling = false;

        //按下并开始滚动时触发
        scroller.on('scrollStart', function () {
            isScrolling = true;
            clearTimeout(timeoutId);
            if (!hasScrollBar()) {
                return;
            }

            indicators.forEach(function (item, index) {
                item.css('opacity', 1); // for zepto
                item.show();
            });
        });

        scroller.on('scrollEnd', function () {
            isScrolling = false;

            //当第一个 scrollEnd 中的 fadeOut 还没执行完就又开始第二个 beforeScrollStart 时，
            //就会有时间先后的竞争关系。 这会导致第二个 beforeScrollStart 中的 show 失效
            timeoutId = setTimeout(function () {
                if (!hasScrollBar()) {
                    return;
                }

                indicators.forEach(function (item, index) {
                    //在 zepto 中没有 fadeOut 方法，因此是补充实现的
                    item.fadeOut('fast', function () {
                        if (isScrolling) {
                            item.css('opacity', 1); // for zepto
                            item.show();
                        }
                    });
                });
            }, 100);
        });



        if (!config.enabled) {
            this.disable();
        }
    }


    //实例方法
    Scroller.prototype = /**@lends Scroller#*/ {
        constructor: Scroller,

        /**
        * 监听事件。
        */
        on: function (name, fn) {

            var meta = mapper.get(this);
            var emitter = meta.emitter;
            var scroller = meta.scroller;

            var args = [].slice.call(arguments, 0);
            emitter.on.apply(emitter, args);

        },

        /**
        * 刷新。
        */
        refresh: function (delay) {

            var meta = mapper.get(this);
            var scroller = meta.scroller;
            var indicators = meta.indicators;
            var args = [].slice.call(arguments, 1);

            var Fn = require('Fn');

            Fn.delay(delay, function () {
                scroller.refresh.apply(scroller, args);

                //隐藏全部滚动条
                indicators.forEach(function (item, index) {
                    item.hide();
                });
            });
            

        },

        /**
        * 重置。
        */
        reset: function () {
            var meta = mapper.get(this);
            var scroller = meta.scroller;
            scroller.isWaitingForManualReset = false;
            scroller.resetPosition(scroller.options.bounceTime);
        },

        /**
        * 监控下拉动作。
        * @param {number} min 开始时的 y 值。
        * @param {number} max 结束时的 y 值。
        */
        pulldown: function (min, max) {
            var meta = mapper.get(this);
            meta.pulldown = {
                'min': min,
                'max': max,
            };

            if (!meta.hasBindPull) {
                var pull = module.require('pull');
                pull(meta);
                meta.hasBindPull = true;
            }

        },


        /**
        * 监控上拉动作。
        * @param {number} min 开始时的 y 值。
        * @param {number} max 结束时的 y 值。
        */
        pullup: function (min, max) {

            var meta = mapper.get(this);

            meta.pullup = {
                'min': min,
                'max': max,
            };

            if (!meta.hasBindPull) {
                var pull = module.require('pull');
                pull(meta);
                meta.hasBindPull = true;
            }
        },

        /**
        * 滚动到距离顶部的指定位置。
        * @param {number} y 相对于顶部的距离。
        */
        to: function (y) {

            var meta = mapper.get(this);
            var scroller = meta.scroller;
            var options = scroller.options;

            scroller.scrollTo(0, y, options.bounceTime, options.bounceEasing);
        },

        /**
        * 滚动到距离底部的指定位置。
        * @param {number} y 相对于底部的距离。
        */
        toBottom: function (y) {

            var meta = mapper.get(this);
            var scroller = meta.scroller;
            var options = scroller.options;
            var maxScrollY = scroller.maxScrollY;

            y = maxScrollY - y;

            scroller.scrollTo(0, y, options.bounceTime, options.bounceEasing);
        },

        /**
        * 启用本组件。
        */
        enable: function () {
            var meta = mapper.get(this);
            meta.enabled = true;

            var scroller = meta.scroller;
            scroller.enable();
        },

        /**
        * 禁用本组件。
        */
        disable: function () {
            var meta = mapper.get(this);
            meta.enabled = false;

            var scroller = meta.scroller;
            scroller.disable();
        },

        /**
        * 切换启用或禁用。
        * @param {boolean} [needEnabled] 显示指定是否启用。 
            如果不指定则根据组件的当前状态进行切换。
        */
        toggleEnable: function (needEnabled) {
            var meta = mapper.get(this);
            var enabled = meta.enabled;

            if (arguments.length == 0) { //重载 toggleEnable()

                if (enabled) {
                    this.disable();
                }
                else {
                    this.enable();
                }

            }
            else { //toggleEnable(needEnabled)

                if (enabled && !needEnabled) {
                    this.disable();
                }
                else if (!enabled && needEnabled) {
                    this.enable();
                }
            }
        },


        /**
        * 销毁本实例对象。
        */
        destroy: function () {
            var meta = mapper.get(this);

            var scroller = meta.scroller;
            scroller.destroy();

            var emitter = meta.emitter;
            emitter.destroy();

            mapper.remove(this);
        },

        /**
        * 获取原生 scroller 实例的属性值。
        * @param {string} key 要获取的属性名称。
        * @return 返回原生 scroller 实例指定的属性值。
        */
        get: function (key) {

            var meta = mapper.get(this);
            var scroller = meta.scroller;

            return scroller[key];
        },

        /**
        * 调用原生 scroller 实例的方法(call 方式)。
        * @param {string} name 要调用的方法名称。
        * @param arg0 要传递的第一个参数。
        * @param arg1 要传递的第二个参数。
        */
        invoke: function (name, arg0, arg1) {

            var meta = mapper.get(this);
            var scroller = meta.scroller;
            var args = [].slice.call(arguments, 1);

            return scroller[name].apply(scroller, args);
        },


    };


    return Scroller;


});




define('IScroll', function (require, module, exports) {

    return window.IScroll || null;

});

/**
* 监听下拉或上拉动作。
*/
define('Scroller/pull', function (require, module,  exports) {

    return function (meta) {

        //state 采用 3 bit 来表示 2-1-0，最多只有一个位为 1， 因此有 000、001、010、100 四种情况。
        //即对应的值为 0、1、2、4，采用与操作即可判断第几位为 1，这样可提高 scroll 中函数的性能。
        var state = 0;

        var isUp = false;
        var name = 'pulldown';
        var min = 0;
        var max = 0;

        var emitter = meta.emitter;
        var scroller = meta.scroller;

        scroller.on('scrollStart', function () {
            state = 0;

            var directionY = this.directionY;
            var distY = this.distY;

            //当 directionY 为 0 时，判断 distY; 
            //否则直接判断 directionY，1: 下拉;  -1: 下拉
            isUp = directionY == 0 ? distY < 0 : directionY > 0;

            name = isUp ? 'pullup' : 'pulldown';
            this.isWaitingForManualReset = false;

            //根据拉动的方向，重新设置正确的环境变量
            if (isUp) {
                // 上拉时 maxScrollY 可能发生了变化，比如上拉加载更多，
                // 填充了更多的数据，需要重新计算
                var maxScrollY = scroller.maxScrollY; //负值
                var pullup = meta.pullup;
                min = pullup.min - maxScrollY; //正值
                max = pullup.max - maxScrollY; //正值
            }
            else {
                var pulldown = meta.pulldown;
                min = pulldown.min; //正值
                max = pulldown.max; //正值
            }
            
        });


        //该事件会给频繁触发，要注意性能控制
        scroller.on('scroll', function () {

            var y = this.y;

            if (isUp) {
                y = -y; //取成正值，容易理解
            }

            if (y < min) {  //( , min)
                if ((state & 1) == 0) {     // xx0
                    state = 1;              // 001
                    emitter.fire(name, 'start');
                }
            }
            else if (min <= y && y < max) { //[min, max]
                if ((state & 2) == 0) {     // x0x
                    state = 2;              // 010
                    emitter.fire(name, 'enter');
                }
            }
            else if (y >= max) { // [max, )
                if ((state & 4) == 0) {     // 0xx
                    state = 4;              // 100
                    emitter.fire(name, 'reach');
                }
            }
        });

        scroller.on('beforeScrollEnd', function () {

            if ((state & 4) == 4) { // 1xx
                this.isWaitingForManualReset = true;
                emitter.fire(name, 'release');
            }
            else {
                emitter.fire(name, 'start');
            }
        });

    };


});


/*
* Alert/Sample
* 由 auto-packer 生成，来源: ../build/pc/0.0.1/src/ui/Alert/Sample.html
*/
define('Alert/Sample', [
    '<pre class="JSON">{text}</pre>',
].join('\n'));
/**
* 简单的 confirm 弹出层对话框。
* @namespace
* @name Confirm
*/
define('Confirm', function (require, module, exports) {
    var Defaults = require('Defaults');
    var Dialog = require('Dialog');
    var $ = require('$');


    return {
        'show': function (text, fn) {
            var config = Defaults.clone(module.id);
            var dialog = new Dialog(config);
            var activeElement = null; //上次获得焦点的元素。

            fn && dialog.on('button', 'ok', fn);

      

            dialog.on('show', function () {
                activeElement = document.activeElement;
                activeElement.blur(); //让原获得焦点的元素失焦。

                dialog.$.find('footer button').get(0).focus();

            });

            dialog.on('hide', function () {
                dialog.destroy();

                activeElement && activeElement.focus();
                activeElement = null;
            });
          


            dialog.set('text', text);
            dialog.show();
        },
    };



});

/**
* Confirm 模块的默认配置
* @name Confirm.defaults
*/
define('Confirm.defaults', /**@lends Confirm.defaults*/ {

    /**
    * 组件高度。
    * 可以指定为百分比的字符串，或指定具体的数值（单位为像素），
    */
    height: 140,
    cssClass: 'Confirm',
    autoClose: true,
    'z-index': 99999,
    buttons: [
        { text: '确定', name: 'ok', color: 'red', },
        { text: '取消', },
    ],


});



define('$', function (require, module, exports) {

    return window.jQuery || null;

});
/**
* 视图组件
* @class
* @name View
*/
define('View', function (require, module, exports) {

    var $String = require('String');
    var $Object = require('Object');
    var Module = require('Module');
    var Defaults = require('Defaults');

    var defaults = Defaults.get(module.id);

    /**
    * 构造器。
    * @constructor
    */
    function View(container, config) {

        config = Defaults.clone(module.id, config);
        config = $Object.remove(config, ['container']); // container 是静态属性。

        var Panel = require('Panel');
        var panel = new Panel(container, config);

        var background = config.background;
        if (background) {
            panel.$.css('background', background);
        }

        return panel;

    }



    return Object.assign(View, {

        /**
        * 提供一种按标准方法定义视图的方式。
        */
        define: function (id, factory) {

            Module.define(id, function (require, module, exports) {

                var container = $String.format(defaults.container, { 'id': id });
                var view = new View(container);

                exports = factory(require, module, view);
                exports = view.wrap(exports);

                return exports;
            });

        },
    });


});

/**
* View 模块的默认配置
* @name View.defaults
*/
define('View.defaults', /**@lends View.defaults*/ {
    background: false, //禁用背景色。
    container: '[data-view="{id}"]',
});

/**
* 面板组件
* @class
* @name Panel
*/
define('Panel', function (require, module, exports) {

    var $Object = require('Object');
    var Emitter = require('Emitter');
    var Defaults = require('Defaults');
    var $String = require('String');
    var Module = require('Module');


    var defaults = Defaults.get(module.id);
    var mapper = new Map();

    /**
    * 构造器。
    * @constructor
    */
    function Panel(container, config) {
        //重载 { 'container': container, ... }
        if ($Object.isPlain(container)) {
            config = container;
            container = config['container'];
            delete config['container'];
        }

        config = Defaults.clone(module.id, config);


        var meta = {
            'emitter': new Emitter(this),   //内部使用的事件管理器。
            '$emitter': new Emitter(),      //供外部用的事件管理器。
            'rendered': false,              //是否已渲染过。
            'show': config.show,            //是否在组件 render 后自动调用 show() 方法以进行显示。
            'cssClass': config.cssClass,    //
            'visible': false,               //当前组件是否可见。
            'byRender': false,              //记录 show 事件是否由 render() 触发的。
            'tpl': null,                    //模板填充的 Template 实例。
            '$': $(container),              //
            'panel': null,                  //缓存调用 this.wrap() 后的返回结果。
            'this': this,
        };

        mapper.set(this, meta);

        //暴露一个 jQuery 对象给外面使用。 
        //但为了安全起见，内部不使用这个对象。
        this.$ = meta.$;

        
        //关联的容器节点发了移动，重新绑定。
        //在给对话框中填内容时会用到。
        meta.$.on('DOMNodeRemovedFromDocument', function () {
            //console.log(meta.$.selector);
            var selector = meta.$.selector;

            if (typeof selector == 'string') {
                meta.this.set('$', selector);
            }
        });

    }


    //实例方法
    Panel.prototype = /**@lends Panel#*/ {
        constructor: Panel,

        /**
        * $(container) 的快捷方式。
        */
        $: null,

        /**
        * 显示本组件。
        */
        show: function () {
            var meta = mapper.get(this);
            var emitter = meta.emitter;

            var args = [].slice.call(arguments);
            meta.$.show.apply(meta.$, args);

            meta.visible = true;

            var byRender = meta.byRender;
            meta.byRender = false; //重置

            emitter.fire('show', [byRender]);

        },

        /**
        * 隐藏本组件。
        */
        hide: function () {
            var meta = mapper.get(this);
            var emitter = meta.emitter;

            var args = [].slice.call(arguments);
            meta.$.hide.apply(meta.$, args);

            meta.visible = false;
            emitter.fire('hide');

        },

        /**
        * 切换显示或隐藏本组件。
        */
        toggle: function (needShow) {
            var meta = mapper.get(this);
            var visible = meta.visible;

            if (arguments.length == 0) { //重载 toggle()
                if (visible) {
                    this.hide();
                }
                else {
                    this.show();
                }
            }
            else {
                if (visible && !needShow) {
                    this.hide();
                }
                else if (!visible && needShow) {
                    this.show();
                }
            }

            //返回更改后的可见状态。
            return meta.visible;

        },

        /**
        * 设置模板填充的规则，为模板填充进行预处理。
        */
        template: function (process) {
            var meta = mapper.get(this);
            var tpl = meta.tpl;

            if (!tpl) {
                var Template = require('Template');
                tpl = meta.tpl = new Template(meta.$);
            }

            if (process) {
                var args = Array.from(arguments);
                tpl.process.apply(tpl, args);
            }

            //返回给外面，可能要用到。
            //通过 panel.template() 即可取得 tpl。
            return tpl;
        },


        /**
        * 对本组件进行模板填充。
        * @param {Object|Array} 要填充的数据，可以是对象或数组。
        * @param {function} [fn] 当要填充的数据是一个数组时，需要进行迭代转换的处理函数。
        *   调用该函数，可以把一个数组转换成一个新的数组。
        */
        fill: function (data, fn) {

            this.template(); //确保 meta.tpl 存在

            var meta = mapper.get(this);
            var emitter = meta.emitter;
            var tpl = meta.tpl;

            tpl.render(data, fn);

            var values = emitter.fire('fill', [data]);
            return values;
        },


        /**
        * 渲染。
        */
        render: function () {
            var meta = mapper.get(this);
            var emitter = meta.emitter;
            var cssClass = meta.cssClass;
            var args = Array.from(arguments);

            if (!meta.rendered) { //首次 render
                emitter.fire('init', args);
            }

            emitter.fire('before-render', args);
            meta.$.addClass(cssClass);

            emitter.fire('render', args);
            meta.rendered = true;

            if (meta.show) {
                meta.byRender = true;
                this.show();
            }

            emitter.fire('after-render', args);
        },

        /**
        * 刷新，会触发 refresh 事件。
        */
        refresh: function () {
            var meta = mapper.get(this);
            var emitter = meta.emitter;
            var args = [].slice.call(arguments);
            var values = emitter.fire('refresh', args);
            return values;

        },

        close: function () {
            var meta = mapper.get(this);
            var emitter = meta.emitter;
            var args = [].slice.call(arguments);
            var values = emitter.fire('close', args);
            return values;
        },

        /**
        * 重置，会触发 reset 事件。
        */
        reset: function () {
            var meta = mapper.get(this);
            var emitter = meta.emitter;
            var args = [].slice.call(arguments);
            var values = emitter.fire('reset', args);
            return values;

        },

        /**
        * 获取一个状态，该状态表示本组件是否为显示状态。
        */
        visible: function () {
            var meta = mapper.get(this);
            return meta.visible;
        },

        /**
        * 获取一个状态，该状态表示本组件是否已渲染过。
        */
        rendered: function () {
            var meta = mapper.get(this);
            return meta.rendered;
        },

    

        /**
        * 销毁本组件
        */
        destroy: function () {
            var meta = mapper.get(this);
            meta.emitter.destroy();
            meta.$emitter.destroy();
            meta.$.off();

            mapper.delete(this);
        },

        /**
        * 绑定事件。
        */
        on: function (name, fn) {
            var meta = mapper.get(this);
            meta.emitter.on(...arguments);
        },

        /**
        * 解除绑定事件。
        */
        off: function (name, fn) {
            var meta = mapper.get(this);
            meta.emitter.off(...arguments);
        },

        /**
        * 触发外部的事件。
        */
        fire: function (name, args) {
            var meta = mapper.get(this);
            var $emitter = meta.$emitter;
            var args = [].slice.call(arguments, 0);
            var values = $emitter.fire.apply($emitter, args);

            return values;
        },


        /**
        * 包装一个新对象，使其拥有当前实例的部分成员和新对象的成员。
        * @param {Object} [obj] 要需要包装的对象。 
            如果不指定，则只包装当前实例对象。
        * @return {Object} 返回一个由当前实例的部分成员和要包装对象的成员组成的新对象。
        * @example
            var panel = KISP.create('Panel');
            var obj = panel.wrap();
            obj.show();

            var obj1 = panel.wrap({ a: 100 });
            console.log(obj1.a);
        */
        wrap: function (obj) {
            var meta = mapper.get(this);
            var panel = meta.panel;

            if (panel) {
                return panel;
            }


            panel = {
                //重写 on，让事件绑定到外部的事件管理器上，
                //而不是 this 内部使用的 emitter。
                'on': meta.$emitter.on.bind(meta.$emitter),
                'off': meta.$emitter.off.bind(meta.$emitter),
            };

            //忽略的成员。
            var ignores = new Set([
                'constructor',
                'fire',
                'on',
                'off',
                'wrap',
            ]);


            for (var key in this) {
                if (ignores.has(key)) {
                    continue;
                }

                var value = this[key];

                //实例方法静态化
                if (typeof value == 'function') {
                    value = value.bind(this); 
                }

                panel[key] = value;
            }

            panel = meta.panel = obj ? Object.assign(panel, obj) : panel;
            return panel;
        },

        /**
        * 传播指定模块的事件列表。
        */
        propagate: function (M, names) {
            var meta = mapper.get(this);

            names.forEach(function (name) {

                M.on(name, function () {
                    var args = Array.from(arguments);
                    meta.this.fire(name, args);
                });
            });



        },

        /**
        * 设置指定的属性。
        * 已重载批量设置的情况 set(obj);
        * @param {string} key 要设置的属性的名称。 目前支持的字段有： 
            'show', 'cssClass',
        * @param value 要设置的属性的值，可以是任何类型。
        */
        set: function (key, value) {

            //重载 set({...}); 批量设置的情况。
            if ($Object.isPlain(key)) {
              
                $Object.each(key, function (key, value) {
                    meta.this.set(key, value);
                });
                return;
            }

            var meta = mapper.get(this);

            switch (key) {
                case 'show':
                case 'cssClass':

                //提供一个重置的机会，以便可以再次触发 init。 
                //这是高级用法，针对特殊场景。
                //背景：在 set('$') 更新容器后，原 init 事件中绑定的逻辑，
                //如果用到了 panel.$.on() 之类的，则会失效，
                //因此在 set('$') 后再调一下 set('rendered', false)，可以让 init 事件有机会再次触发。
                case 'rendered': 

                    meta[key] = value;
                    break;

                //更新容器。
                case '$':
                case 'container':
                    value = value || meta.$.selector;

                    //先解除绑定事件。
                    if (meta.$) {
                        meta.$.off();
                    }

                    this.$ = meta.$ = $(value);

                    //同时更新导出对象的 $ 字段。
                    var panel = meta.panel;
                    if (panel) {
                        panel.$ = meta.$;
                    }
                    break;

                default:
                    throw new Error('目前不支持设置属性: ' + key);
            }

        },



    };

    return Object.assign(Panel, {

        /**
        * 提供一种按标准方法定义面板的方式。
        */
        define: function (id, factory) {

            Module.define(id, function (require, module, exports) {

                var container = $String.format(defaults.container, { 'id': id });
                var panel = new Panel(container);

                exports = factory(require, module, panel);
                exports = panel.wrap(exports);

                return exports;
            });

        },
    });

});

/**
* Panel 模块的默认配置
* @name Panel.defaults
*/
define('Panel.defaults', /**@lends Panel.defaults*/ {
    container: '[data-panel="{id}"]',

    /**
    * 是否在组件 render 后自动调用 show() 方法以进行显示。
    */
    show: true,

    /**
    * 组件用到的 css 类名。
    */
    cssClass: '',

});


/**
* 模板填充类。
*/
define('Template', function (require, module, exports) {
    var $String = require('String');
    var $Object = require('Object');
    var Emitter = require('Emitter');

    var mapper = new Map();

    /**
    * 构造器。
    */
    function Template(selector) {
        var node = $(selector).get(0); //包装、拆装，可以让入参多样化。

        if (!node) {
            if (selector instanceof $) {
                selector = selector.selector;
            }

            throw new Error('不存在节点: ' + selector);
        }

        var isTPL = node.tagName.toLowerCase() == 'template'; //判断是否为 <template> 模板节点。
        var name = isTPL ? node.getAttribute('name') : '';
        var el = isTPL ? node.content : node;
        var tpls = el.querySelectorAll('template'); //下级实例列表。
        var sample = node.innerHTML;
        var name$tpl = {};
        var emitter = new Emitter(this);
        var self = this;


        tpls = Array.from(tpls).map(function (node) {
            var tpl = new Template(node);
            var name = tpl.get('name');

            if (name$tpl[name]) {
                throw new Error('同一级下已存在名为 `' + name + '` 的模板。');
            }

            name$tpl[name] = tpl;

            //顺便替换掉子模板在父模板中的内容。
            var outerHTML = tpl.get('outerHTML');
            var placeholder = tpl.get('placeholder');

            if (placeholder) {
                placeholder = '{' + placeholder + '}';
            }

            sample = sample.replace(outerHTML, placeholder);

            tpl.on('process', function () {
                var args = Array.from(arguments);
                emitter.fire('process', args);
            });

            tpl.parent = self; //设置父实例。

            return tpl;
        });

        if (sample.includes('<!--') &&
            sample.includes('-->')) {
            sample = $String.between(sample, '<!--', '-->');
        }

        var placeholder = node.getAttribute('placeholder');

        var meta = {
            'name': name || '',
            'placeholder': placeholder || '',
            'innerHTML': node.innerHTML,
            'outerHTML': node.outerHTML,
            'sample': sample,               //
            'name$tpl': name$tpl,           //命名的下级实例映射，方便按名称读取。
            'tpls': tpls,                   //下级实例列表。
            'node': isTPL ? null : node,    //为了能及时释放子模板中对应的 <template> 节点实例，这里只记录顶级模板节点。
            'emitter': emitter,
            'this': this,

            //默认处理函数。
            'process': function (data) {
                return data;
            },
        };

        mapper.set(this, meta);

        Object.assign(this, {
            'id': $String.random(),
            'parent': null,
            'meta': meta,
        });

    }





    Template.prototype = {
        constructor: Template,

        id: '',

        parent: null,

        get: function (key) {
            var meta = mapper.get(this);
            return meta[key];
        },

        /**
        * 获取指定名称(或由多个名称组成的路径)节点所对应的下级 Template 实例。
        */
        template: function (name) {
            var tpl = this;
            var names = Array.isArray(name) ? name : Array.from(arguments);

            names.map(function (name) {
                var name$tpl = tpl.get('name$tpl');
                tpl = name$tpl[name];
            });

            return tpl;
        },

        /**
        * 获取指定名称(或由多个名称组成的路径)节点所对应的下级 sample 模板。
        */
        sample: function (name) {
            var tpl = this.template(...arguments);
            var sample = tpl.get('sample');
            return sample;
        },


        /**
        * 对当前模板进行填充，并用填充后的 html 字符串渲染当前节点。
        */
        render: function (data, process) {
            if (process) {
                this.process(process);
            }

            var meta = mapper.get(this);
            var node = meta.node;
            var html = this.fill(data);

            if (node) {
                node.innerHTML = html;
            }

            return html;
        },

        /**
        * 对当前模板及子模板(如果有)进行填充。
        * 已重载 fill(data);
        * 已重载 fill(data0, data1, ..., dataN);
        * 已重载 fill(name0, name1, ..., nameN, data, data1, ..., dataN);
        * @return {string} 返回填充后的 html 字符串。
        */
        fill: function (data) {
            //重载 fill(name0, name1, ..., nameN, data, data1, ..., dataN);
            //即一步到位填充指定路径的子模板。
            //找出 data 在参数列表中所在的位置。
            var args = Array.from(arguments);

            var index = args.findIndex(function (item) {
                return Array.isArray(item) || $Object.isPlain(item);
            });

            if (index > 0) {
                var names = args.slice(0, index);   //子模板名称列表，[name0, name1, ..., nameN]
                var tpl = this.template(names);

                if (!tpl) {
                    throw new Error('不存在路径为 ' + names.join('.') + ' 的模板节点，请检查 html 模板树。');
                }

                var params = args.slice(index); // [data, data1, ..., dataN]
                var html = tpl.fill(...params);

                return html;
            }
           
            if (index < 0) {
                throw new Error('填充模板时必须指定数据为一个数组或纯对象。');
            }

      
            
            var meta = mapper.get(this);


            //这里不要缓存 sampel，应该实时去获取 meta.sample，
            //因为它可能在 process 函数中给使用者调用了 this.fix() 更改了。
            //var sample = meta.sample; !!!

            var params = args.slice(1); //余下的参数。

            //单个纯对象形式。
            if (!Array.isArray(data)) {
                meta.emitter.fire('process', args);
                data = meta.process.apply(meta.this, args); //调用处理器获得填充数据。


                //处理器已直接返回 html 内容，则不需要用模板去填充。
                if (typeof data == 'string') { 
                    return data;
                }

                var html = $String.format(meta.sample, data);
                return html;
            }

            //传进来的是一个数组，则迭代每一项去填充。
            var htmls = data.map(function (item, index) {
                var args = [item, index, ...params];
                meta.emitter.fire('process', args);

                var data = meta.process.apply(meta.this, args);


                //处理器已直接返回 html 内容，则不需要用模板去填充。
                if (typeof data == 'string') { 
                    return data;
                }

                if (!data) {
                    return ''; //这里要返回空串。
                }

                var html = $String.format(meta.sample, data);
                return html;
            });

            return htmls.join('');
        },

        /**
        * 设置模板填充的处理规则。
        */
        process: function (process) {
            var meta = mapper.get(this);

            //重载 process(fn); 设置当前实例的 process 处理函数。
            if (typeof process == 'function') {
                meta.process = process;
                return;
            }

            //查找处理器所在的位置。
            var args = Array.from(arguments);
            var index = args.findIndex(function (item) {
                return typeof item == 'function' || $Object.isPlain(item);
            });

            if (index < 0) {
                throw new Error('模板节点 `' + meta.name + '` 缺少处理器。');
            }


            //前面存在前缀名称，则跟后面的处理器合并为一个完整对象，方便后续统一处理。
            //如 process('A', 'B', process); 则合并为 { A: { B: process } };
            if (index > 0) {
                process = {};

                var keys = args.slice(0, index);
                var item = args[index];
                var maxIndex = index - 1; //判断是否为最后一个

                keys.map(function (key, no) {
                    process[key] = no < maxIndex ? {} : item;
                });
            }



            var name$tpl = meta.name$tpl;

            $Object.each(process, function (name, process) {
                if (!name) { // 空键节点
                    meta.process = process;
                    return;
                }

                var tpl = name$tpl[name];

                if (!tpl) {
                    console.warn('不存在模板节点: `' + name + '`');
                    return;
                }

                tpl.process(process);
            });

        },

        /**
        * 修正模板中指定的占位符。
        * 因为模板中的 html 给 DOM 解析和处理后，没有等号的占位符属性会给替换成有空值的属性值。
        * 如 `<img {test} />` 经过 DOM 解析后会变成 `<img {test}="" />`，这并不是我们想要的结果。
        * 因此我们需要手动修正以替换回我们写模板时的结果。
        */
        fix: function (keys) {
            var meta = mapper.get(this);
            var sample = meta.sample;

            keys = Array.isArray(keys) ? keys : [keys];

            keys.map(function (key) {
                var target = '{' + key + '}';
                var old = target + '=""';
                sample = sample.split(old).join(target);
            });

            meta.sample = sample;
        },

        on: function (name, fn) {
            var meta = mapper.get(this);
            var emitter = meta.emitter;
            var args = Array.from(arguments);
            emitter.on(args);
        },

        destroy: function () {
            var meta = mapper.get(this);
            if (!meta) {
                return;
            }

            var emitter = meta.emitter;
            var tpls = meta.tpls;

            tpls.map(function (tpl) {
                tpl.destroy();
            });

            emitter.destroy();
            mapper.delete(this);

        },
    };


    //静态方法。
    return Object.assign(Template, {

        fill: function (node, data, process) {
            var tpl = mapper.get(node);

            if (!tpl) {
                tpl = new Template(node);
                mapper.set(node, tpl);
            }
           
            tpl.render(data, process);
        },

        parse: function (html) {

            var tpl = document.createElement('template');
            tpl.innerHTML = html;

            tpl = new Template(tpl);
            return tpl;

        },
    });



});

/**
* Template 模块的默认配置
* @name Template.defaults
*/
define('Template.defaults', /**@lends Template.defaults*/ {

    /**
    * 模板最外层的标记。
    */
    root: {
        /**
        * 模板最外层的起始标记。
        */
        begin: '<!--',

        /**
        * 模板最外层的结束标记。
        */
        end: '-->',
    },

    /**
    * 子模板的标记。
    */
    item: {
        /**
        * 子模板的起始标记。
        */
        begin: '#--{name}.begin--#',

        /**
        * 子模板的结束标记。
        */
        end: '#--{name}.end--#',
    },

    /**
    * 生成子模板的随机占位串的长度。
    * 业务层不需要关注该属性。
    */
    outer: 64,

});


/**
* SSH.API 类
* @class
* @name SSH.API
* @augments SSH
*/
define('SSH.API', function (require, module, exports) {

    var $Object = require('Object');
    var Emitter = require('Emitter');
    var Defaults = require('Defaults');
    var SSH = require('SSH');

    var Fn = require('Fn');

    var mapper = require('Mapper');     //用于容纳所有 SSHAPI 实例的 meta 数据
    var $emitter = new Emitter(SSHAPI); //针对类的，而不是实例的。

    /**
    * SSHAPI 构造器。
    * @param {string} name 后台接口的名称。 简短名称，且不包括后缀。
    * @param {Object} [config] 配置对象。
    */
    function SSHAPI(name, config) {

        name = name || '';
        config = Defaults.clone(module.id, config);

        var prefix = config.prefix;
        var emitter = new Emitter(this);
        var successCode = config.successCode;

        var proxy = config.proxy;
        //支持简写，代理的文件名跟 API 的名称一致。
        switch (proxy) {
            case true:
                proxy = name + '.js';
                break;
            case '.json':
            case '.js':
                proxy = name + proxy;
                break;
        }


        //过滤出属于 SSH 的配置成员
        //这里使用过滤 + 复制的方式进行成员选取。
        var ssh = Object.assign($Object.filter(config, [
            'prefix',
            'eid',
            'openid',
            'serialize',
            'timeout',

            //可选的
            'appid',
            'netid',
            'pubacckey',
            'timestamp',
            'nonce',
            'pubaccid',



        ]), {
            'proxy': proxy,
        });


        var ajax = {
            'name': name,
            'successCode': successCode,
            'field': config.field,
            'data': config.data,

            'ssh': Object.assign(ssh, config.ssh), //再合并针对 ssh 的

            success: function (data, json, xhr) { //成功
                fireEvent('success', [data, json, xhr]);
            },

            fail: function (code, msg, json, xhr) { //失败
                fireEvent('fail', [code, msg, json, xhr]);
            },

            error: function (code, msg, json, xhr) { //错误

                //为了让业务层能知道 SSH 层发生了 fail，通过判断 json 是否为空即可。
                //当 http 协议层连接错误，则 code, msg, json 三个参数都为 undefined。
                msg = msg || config.msg;

                fireEvent('error', [code, msg, json, xhr]);
            },

            timeout: function (xhr) {
                fireEvent('timeout', [xhr]);
            },

            abort: function () {
                emitter.fire('abort');
            },

            //存在多个产品实例 (netid) 时触发。
            servers: function (list) {
                //触发类的事件，而不是实例的。
                $emitter.fire('servers', [list]);
            },
        };


        var meta = {
            'ajax': ajax,
            'status': '',
            'args': [],
            'emitter': emitter,
            'ssh': null,            //缓存创建出来的 ssh 对象。
            'fireEvent': fireEvent, //这里要设置进去，因为继续了 API 的关系。
        };

        mapper.set(this, meta);




        //内部共用函数
        function fireEvent(status, args, emitter) {

            meta.ssh = null;    //请求已完成，针对 abort() 方法。

            status = meta.status = status || meta.status;
            args = meta.args = args || meta.args;
            emitter = emitter || meta.emitter;


            emitter.fire('response', args); //最先触发

            //进一步触发具体 code 对应的事件
            if (status == 'success') {
                emitter.fire('code', successCode, args);
            }
            else if (status == 'fail') {
                emitter.fire('code', args[0], args.slice(1)); //错误码不在参数里
            }

            var xhr = args.slice(-1)[0]; //args[args.length - 1]
            if (xhr) { //在 Proxy 的响应中 xhr 为 null
                emitter.fire('status', xhr.status, args);
            }

            emitter.fire(status, args); //触发命名的分类事件，如 success、fail、error
            emitter.fire('done', args); //触发总事件

        }

    }


    //实例方法
    SSHAPI.prototype = Object.assign(new SSH(), /**@lends SSH.API#*/ {

        constructor: SSHAPI,

        //避免调到父类的 get 方法，显式地抛出异常有助于发现错误。
        get: function () {
            throw new Error(module.id + ' 不支持 get 方式的请求');
        },

        /**
        * 发起网络 post 请求。
        * 请求完成后会最先触发相应的事件。
        * @param {Object} [data] POST 请求的数据对象。
        * @return {SSHAPI} 返回当前 SSHAPI 的实例 this，因此进一步可用于链式调用。
        */
        post: function (data) {

            var meta = mapper.get(this);
            var emitter = meta.emitter;
            var ajax = meta.ajax;

            var obj = Object.assign({}, ajax, {
                'data': data || ajax.data || {},
            });

            emitter.fire('request', ['post', obj.data]);

            var Ajax = module.require('Ajax');
            meta.ssh = Ajax.post(obj);

            return this;

        },

        /**
        * 取消当前已发起但未完成的请求。
        * 只有已发起了请求但未完成，才会执行取消操作，并会触发 abort 事件。
        */
        abort: function () {
            var meta = mapper.get(this);
            var ssh = meta.ssh;
            if (!ssh) {
                return;
            }

            ssh.abort();
        },
    });




    //静态成员
    return Object.assign(SSHAPI, { /**@lends SSHAPI*/

        /**
        * 当存在多个产品实例(NetID)时，设置需要使用的项。
        */
        'setServer': function (item) {
            SSH.setServer(item);
        },

        'on': $emitter.on.bind($emitter),
    });

});


/**
* SSH.API 模块的默认配置
* @name SSH.API.defaults
*/
define('SSH.API.defaults', /**@lends SSH.API.defaults*/ {
    
    //解析 SSH 返回的 json 中的字段

    /**
    * 成功的状态码。 
    * 只有状态码为该值是才表示成功，其它的均表示失败。
    */
    successCode: 200,

    /**
    * 字段映射。
    */
    field: {
        /**
        * 状态码。
        */
        code: 'Result',
        /**
        * 消息。
        */
        msg: 'ErrMsg',
        /**
        * 主体数据。
        */
        data: 'Data',
    },

    // SSH 需要用到的。
    //下面这些字段在使用时会优先级会高于 SSH 节点中的

    /**
    * 代理配置。
    */
    proxy: null,

    /**
    * 接口名称中的前缀部分。
    * 主要针对一个轻应用中有公共前缀部分的批量接口，设置了公共前缀部分，后续的调用只用后部分简短名称即可。
    */
    prefix: '',

    /**
    * 请求超时的最大值(毫秒)。
    * 0 表示由浏览器控制，代码层面不控制。
    */
    timeout: 0,

    //必选的

    /**
    * 企业号。 必选。
    */
    eid: '',

    /**
    * openid。 必选。
    */
    openid: '',

    //可选的

    /**
    * appid。 可选的。
    */
    appid: '',

    /**
    * netid。 可选的。
    */
    netid: '',

    /**
    * pubacckey。 可选的。
    */
    pubacckey: '',

    /**
    * timestamp。 可选的。
    */
    timestamp: '',

    /**
    * nonce。 可选的。
    */
    nonce: '',

    /**
    * pubaccid。 可选的。
    */
    pubaccid: '',

    /**
    * 要发送的数据。 可选的。
    */
    data: null,

    /**
    * 当 http 协议层发送错误时的默认错误消息文本。
    */
    msg: '网络繁忙，请稍候再试',
});


/**
* SSH 类。
* @class
* @name SSH
* @augments API
*/
define('SSH', function (require, module, exports) {

    var $Object = require('Object');
    var Emitter = require('Emitter');
    var Defaults = require('Defaults');
    var API = require('API');

    var mapper = require('Mapper'); //这里要用有继承关系的 Mapper

    /**
    * SSH 构造器。
    * @param {string} name 后台接口的名称。 
        简短名称，且不包括后缀。
    * @param {Object} [config] 配置对象。
    */
    function SSH(name, config) {

        name = name || '';
        config = Defaults.clone(module.id, config);

        var emitter = new Emitter(this);
        var successCode = config.successCode;
        var proxy = config.proxy;

        //先过滤出(已存在的)指定成员。
        var ajax = $Object.filter(config, [
            'ext',
            'successCode',
            'field',

            'prefix',
            'serialize',
            'timeout',

            //必选的
            'eid',
            'openid',

            //可选的
            'appid',
            'netid',
            'pubacckey',
            'timestamp',
            'nonce',
            'pubaccid',
            'data',

            //临时方案，给新版授权使用。
            'url',
            'form',

        ]);

        //再复制。 
        ajax = Object.assign(ajax, {
            'name': name,
            'proxy': proxy,



            success: function (data, json, xhr) { //成功
                fireEvent('success', [data, json, xhr]);
            },

            fail: function (code, msg, json, xhr) { //失败
                fireEvent('fail', [code, msg, json, xhr]);
            },

            error: function (xhr) { //错误
                fireEvent('error', [xhr]);
            },

            //timeout字段已用来设置时间了，这里换个名称。
            ontimeout: function (xhr) {
                fireEvent('timeout', [xhr]);
            },

            abort: function () {
                emitter.fire('abort');
            },

        });



        var meta = {
            'ajax': ajax,
            'console': config.console,
            'status': '',
            'args': [],
            'emitter': emitter,
            'api': null,            //缓存创建出来的 api 对象。
            'fireEvent': fireEvent, //这里要设置进去，因为继续了 API 的关系。
        };

        mapper.set(this, meta);


        //内部共用函数
        function fireEvent(status, args, emitter) {

            meta.api = null; //请求已完成，针对 abort() 方法。

            status = meta.status = status || meta.status;
            args = meta.args = args || meta.args;
            emitter = emitter || meta.emitter;

            emitter.fire('response', args); //最先触发


            //进一步触发具体 code 对应的事件
            if (status == 'success') {
                emitter.fire('code', successCode, args);
            }
            else if (status == 'fail') {
                emitter.fire('code', args[0], args.slice(1)); //错误码不在参数里
            }

            var xhr = args.slice(-1)[0]; //args[args.length - 1]
            if (xhr) { //在 Proxy 的响应中 xhr 为 null
                emitter.fire('status', xhr.status, args);
            }

            emitter.fire(status, args); //触发命名的分类事件，如 success、fail、error
            emitter.fire('done', args); //触发总事件

        }

    }

    //实例方法
    SSH.prototype = Object.assign(new API(), /**@lends SSH#*/ {

        constructor: SSH,

        /**
        * 发起网络 POST 请求。
        * 请求完成后会最先触发相应的事件。
        * @param {Object} [data] POST 请求的数据对象。
        * @param {Object} [query] 查询字符串的数据对象。
        *   该数据会给序列化成查询字符串，并且通过 form-data 发送出去。
        * @return {SSH} 返回当前 SSH 的实例 this，因此进一步可用于链式调用。
        */
        post: function (data) {

            var meta = mapper.get(this);
            var emitter = meta.emitter;
            var ajax = meta.ajax;
 
            emitter.fire('request', ['post', data || ajax.data]);


            var Server = module.require('Server');


            Server.get({
                data: {
                    'eid': ajax.eid,
                    'appid': ajax.appid,
                    'netid': ajax.netid,
                },
                success: function (server) { //成功

                    var obj = Object.assign({}, ajax, {
                        'data': data || ajax.data,

                        //来自 Server 的
                        'secret': server['secret'],
                        'version': server['version'],
                        'fromTag': server['fromTag'],
                        'url': server['url'],
                        'netid': server['netid'],
                    });


                    //临时方案，给新版授权使用。
                    if (ajax.url) {
                        obj.url = ajax.url;
                    }


                    //为了便于查看调用的 API 名称和 CustData 而打印到控制台。
                    if (meta.console) {
                        //var fullname = ajax.prefix + ajax.name; //api 的完整名称
                        //console.log(fullname, obj.data);

                        var msg = '%c' + ajax.prefix + '%c' + ajax.name;
                        var s0 = 'color:#61a7e5;';
                        //var s1 = 'color:#138df9;font-weight:bold;';
                        var s1 = 'color:#138df9;';

                        console.log(msg, s0, s1, obj.data);
                    }

                    var Ajax = module.require('Ajax');
                    meta.api = Ajax.post(obj);

                },
                fail: function (code, msg, json, xhr) {

                    if (code == 302) { //存在多个 netid
                        var list = json['NetIDList'] || [];
                        emitter.fire('servers', [list, json, xhr]);
                        return;
                    }

                    var fail = ajax.fail;
                    fail && fail(code, msg, json, xhr);
                },

                error: ajax.error,

            });


            return this;

        },

        /**
        * 取消当前已发起但未完成的请求。
        * 只有已发起了请求但未完成，才会执行取消操作，并会触发 abort 事件。
        */
        abort: function () {
            var meta = mapper.get(this);
            var api = meta.api;
            if (!api) {
                return;
            }

            api.abort();
        },

    });

    //静态成员
    return Object.assign(SSH, { /**@lends SSH*/

        /**
        * 当存在多个产品实例(NetID)时，设置需要使用的项。
        */
        'setServer': function (item) {
            var Server = module.require('Server');
            Server.set(item);
        },
    });




});


/**
* SSH 模块的默认配置
* @name SSH.defaults
*/
define('SSH.defaults', /**@lends SSH.defaults*/ {

    /**
    * API 接口 Url 的后缀部分。
    * 针对那些如 '.do'、'.aspx' 等有后缀名的接口比较实用。
    * 这里固定为空字符串，业务层不需要关注该字段。
    */
    ext: '',

    /**
    * 成功的状态码。 
    * 只有状态码为该值是才表示成功，其它的均表示失败。
    */
    successCode: 200,

    /**
    * 字段映射。
    */
    field: {
        /**
        * 状态码。
        */
        code: 'Result',
        /**
        * 消息。
        */
        msg: 'ErrMsg',
        /**
        * 主体数据。
        */
        data: 'DataJson',
    },

    /**
    * 代理配置。
    */
    proxy: null,

    /**
    * 接口名称中的前缀部分。
    * 主要针对一个轻应用中有公共前缀部分的批量接口，设置了公共前缀部分，后续的调用只用后部分简短名称即可。
    */
    prefix: '',

    //必选的

    /**
    * 企业号。 必选。
    */
    eid: '',

    /**
    * openid。 必选。
    */
    openid: '',

    //可选的

    /**
    * appid。 可选的。
    */
    appid: '',

    /**
    * netid。 可选的。
    */
    netid: '',

    /**
    * pubacckey。 可选的。
    */
    pubacckey: '',

    /**
    * timestamp。 可选的。
    */
    timestamp: '',

    /**
    * nonce。 可选的。
    */
    nonce: '',

    /**
    * pubaccid。 可选的。
    */
    pubaccid: '',

    /**
    * 要发送的数据。 可选的。
    */
    data: null,

    /**
    * 是否用 console 把 CustData 打印出来。
    * 由于 CustData 给编码了成字符串，为了便于查看原始对象结构而打印到控制台。
    */
    console: true,

    /**
    * 请求超时的最大值(毫秒)。
    * 0 表示由浏览器控制，代码层面不控制。
    */
    timeout: 0,

});


/**
* 后台 API 接口请求类。
* @class
* @name API
*/
define('API', function (require, module, exports) {

    var Emitter = require('Emitter');
    var Defaults = require('Defaults');
    var Fn = require('Fn');

    var mapper = require('Mapper'); //这里要用有继承关系的 Mapper



    /**
    * API 构造器。
    * @param {string} name 后台接口的名称。 简短名称，且不包括后缀。
    * @param {Object} [config] 配置对象。
    */
    function API(name, config) {

        //重载 API(config);
        if (typeof name == 'object') {
            config = name;
            name = '';
        }

        name = name || '';
        config = Defaults.clone(module.id, config);


        var emitter = new Emitter(this);
        var successCode = config.successCode;
        var proxy = config.proxy;

        //支持简写，代理的文件名跟 API 的名称一致。
        switch (proxy) {
            case true:
                proxy = name + '.js';
                break;
            case '.json':
            case '.js':
                proxy = name + proxy;
                break;
        }


        

        //发起 ajax 请求所需要的配置对象。
        var ajax = {
            'name': name,
            'data': config.data,
            'query': config.query,

            'url': config.url,
            'prefix': config.prefix,
            'ext': config.ext,
            'random': config.random,

            'successCode': successCode,
            'field': config.field,
            'proxy': proxy,
            'serialize': config.serialize,
            'timeout': config.timeout,

            success: function (data, json, xhr) { //成功
                fireEvent('success', [data, json, xhr]);
            },

            fail: function (code, msg, json, xhr) { //失败
                fireEvent('fail', [code, msg, json, xhr]);
            },

            error: function (xhr) { //错误
                if (meta.aborted) { //避免因手动调用了 abort() 而导致触发 error 事件。
                    meta.aborted = false; //归位
                    return;
                }

                fireEvent('error', [xhr]);
            },

            ontimeout: function (xhr) { //超时，自定义的
                fireEvent('timeout', [xhr]);
            },
        };


        var meta = {
            'ajax': ajax,
            'status': '',
            'args': [],
            'emitter': emitter,
            'xhr': null,            //缓存创建出来的 xhr 对象。
            'aborted': false,       //指示是否已调用了 abort()。
            'fireEvent': fireEvent, 
        };

        mapper.set(this, meta);


        //内部共用函数
        function fireEvent(status, args, emitter) {

            status = meta.status = status || meta.status;
            args = meta.args = args || meta.args;
            emitter = emitter || meta.emitter;

            Fn.delay(config.delay, function () {

                meta.xhr = null; //请求已完成，针对 abort() 方法。

                emitter.fire('response', args); //最先触发

                //进一步触发具体 code 对应的事件
                if (status == 'success') {
                    emitter.fire('code', successCode, args);
                }
                else if (status == 'fail') {
                    emitter.fire('code', args[0], args);
                }

                var xhr = args.slice(-1)[0]; //args[args.length - 1]
                if (xhr) { //在 Proxy 的响应中 xhr 为 null
                    emitter.fire('status', xhr.status, args);
                }

                emitter.fire(status, args); //触发命名的分类事件，如 success|fail|error|timeout
                emitter.fire('done', args); //触发总事件
            });
        }

     
    }



    //实例方法
    API.prototype = /**@lends API#*/ {
        constructor: API,

        /**
        * 发起网络 GET 请求。
        * 请求完成后会最先触发相应的事件。
        * @param {Object} [data] 请求的数据对象。
        *   该数据会给序列化成查询字符串以拼接到 url 中。
        * @example
            var api = new API('test');
            api.get({ name: 'micty' });
        */
        get: function (data) {

            var meta = mapper.get(this);
            var emitter = meta.emitter;

            meta.aborted = false; //归位

            var obj = Object.assign({}, meta.ajax);
            if (data) {
                obj.data = data;
            }

            data = obj.data;  //这里用 obj.data
           
            emitter.fire('request', 'get', [data]);
            emitter.fire('request', ['get', data]); 

            

            var Ajax = module.require('Ajax');
            meta.xhr = Ajax.get(obj);
        },

        /**
        * 发起网络 POST 请求。
        * 请求完成后会最先触发相应的事件。
        * @param {Object} [data] POST 请求的数据对象。
        * @param {Object} [query] 查询字符串的数据对象。
        *   该数据会给序列化成查询字符串，并且通过 form-data 发送出去。
        * @return {API} 返回当前 API 的实例 this，因此进一步可用于链式调用。
        */
        post: function (data, query) {

            var meta = mapper.get(this);
            var emitter = meta.emitter;
            var ajax = meta.ajax;

            meta.aborted = false; //归位

            var obj = Object.assign({}, ajax, {
                'data': data || ajax.data,
                'query': query || ajax.query,
            });

            data = obj.data;    //这里用 obj.data
            query = obj.query;  //这里用 obj.query

            emitter.fire('request', 'post', [data, query]);
            emitter.fire('request', ['post', data, query]);

            var Ajax = module.require('Ajax');
            meta.xhr = Ajax.post(obj);

            return this;

        },

        /**
        * 取消当前已发起但未完成的请求。
        * 只有已发起了请求但未完成，才会执行取消操作，并会触发 abort 事件。
        */
        abort: function () {
            var meta = mapper.get(this);
            var xhr = meta.xhr;
            if (!xhr) {
                return;
            }

            meta.aborted = true;        //先设置状态
            xhr.abort();                //会触发 ajax.error 事件。
            meta.emitter.fire('abort'); //
        },
        

        /**
        * 绑定事件。
        * 已重载 on({...}，因此支持批量绑定。
        * @param {string} name 事件名称。
        * @param {function} fn 回调函数。
        * @return {API} 返回当前 API 的实例 this，因此进一步可用于链式调用。
        */
        on: function (name, fn) {

            var meta = mapper.get(this);
            var emitter = meta.emitter;

            var args = [].slice.call(arguments, 0);
            emitter.on.apply(emitter, args);

            var status = meta.status;

            if (status) { //请求已完成，立即触发
                var emt = new Emitter(this); //使用临时的事件触发器。
                emt.on.apply(emt, args);
                meta.fireEvent(status, meta.args, emt);
                emt.destroy();
            }

            return this;

        },

       

        /**
        * 销毁本实例对象。
        */
        destroy: function () {
            var meta = mapper.get(this);
            var emitter = meta.emitter;
            emitter.destroy();

            mapper.delete(this);
        },
    };


    return API;

});


/**
* API 模块的默认配置
* @name API.defaults
*/
define('API.defaults', /**@lends API.defaults*/ {
    /**
    * 成功的状态码。 
    * 只有状态码为该值是才表示成功，其它的均表示失败。
    */
    successCode: 200,

    /**
    * 字段映射。
    */
    field: {
        /**
        * 状态码。
        */
        code: 'code',
        /**
        * 消息。
        */
        msg: 'msg',
        /**
        * 主体数据。
        */
        data: 'data',
    },

    /**
    * 代理配置。
    */
    proxy: null,

    /**
    * 随机延迟时间，更真实模拟实际网络环境。
    * 可指定为 false，或如 { min: 500, max: 2000 } 的格式。
    */
    delay: false,

    /**
    * 在 url 中增加一个随机 key，以解决缓存问题。
    * 当指定为 false 时，则禁用。
    */
    random: true,

    /**
    * API 接口 Url 的主体部分。
    */
    url: '',

    /**
    * API 接口 Url 的前缀部分。
    */
    prefix: '',

    /**
    * API 接口 Url 的后缀部分。
    * 针对那些如 '.do'、'.aspx' 等有后缀名的接口比较实用。
    */
    ext: '',

    /**
    * 要发送的数据。 可选的。
    * 当发送方式为 get 时，该数据将会给序列化成查询字符串并附加到 url 查询参数中。
    * 当发送方式为 post 时，会用在表单中。
    */
    data: null,

    /**
    * 要发送的查询参数，仅当发送方式为 post 时有效 (可选的)。
    * 当发送方式为 post 时，该数据将会给序列化成查询字符串并附加到 url 查询参数中。
    */
    query: null,

    /**
    * 请求超时的最大值(毫秒)。
    * 0 表示由浏览器控制，代码层面不控制。
    */
    timeout: 0,


    /**
    * 把请求时的 data 中的第一级子对象进行序列化的方法。
    * @param {string} key 要进行处理的子对象的键。
    * @param {Object} value 要进行处理的子对象的值对象。
    * @return {string} 返回该子对象序列化的字符串。
    */
    serialize: function (key, value) {
        var json = JSON.stringify(value);
        return encodeURIComponent(json);
    },

});


/**
*
*/
define('API/Ajax', function (require, module, exports) {

    var $Object = require('Object');
    var $String = require('String');
    var Query = require('Query');

    //[XMLHttpRequest 增强功能](https://technet.microsoft.com/zh-cn/office/hh673569)
    //[XMLHttpRequest2 新技巧](http://www.html5rocks.com/zh/tutorials/file/xhr2/)
    //[XMLHttpRequest Level 2 使用指南](http://kb.cnblogs.com/page/157047/)

    /**
    * 发起 ajax 网络请求(核心方法)。
    * @param {string} method 网络请求的方式：'get' 或 'post'。
    * @param {Object} config 配置对象。 其中：
    * @param {string} config.name 后台接口的名称，会用在 url 中。
    * @param {Object} [config.url] 请求的 url 地址。
    * @param {Object} [config.ext] 要用在 url 中的后缀。
    * @param {Object} [config.data] 要发送的数据。
        该数据会给序列化成查询字符串，然后：
        当 method 为 'get' 时，数据拼接在 url 中。
        当 method 为 'post' 时，数据放在 form-data 表单中。
    * @param {Object} [config.query] 要发送的查询字符串数据。
        该字段仅在 method 为 'post' 时可用。
    * @param {number||string} [config.successCode] 指示请求成功时的代码。
    * @param {Object} [config.field] 响应中的映射字段。
    * @param {function} [config.success] 请成功时的回调。
    * @param {function} [config.fail] 请失败时的回调。
    * @param {function} [config.error] 请错误时的回调。
    * @return {XMLHTTPRequest} 返回 xhr 对象。
        如果使用的是代理，则返回 null。
    */
    function request(method, config) {

        var proxy = config.proxy;
        if (proxy) { //使用了代理
            var Proxy = require('Proxy');
            Proxy.request(proxy, config);
            return null;
        }

        //完整的 url
        var url = [
            config.url,
            config.prefix,
            config.name,
            config.ext,
        ].join('');


        var data = config.data || null; // null 可能会在 xhr.send(data) 里用到
        if (data) {

            var serialize = config.serialize; //对子对象进行序列化的方法

            data = $Object.map(data, function (key, value) {
                if (typeof value == 'object' && value) { //子对象编码成 JSON 字符串
                    return serialize(key, value);
                }

                //其他的
                return value; //原样返回
            });
        }


        if (method == 'post') {
            var query = config.query;
            if (query) {
                url = Query.add(url, query);
            }
            if (data) {
                data = Query.stringify(data);
            }
        }
        else if (data) { // 'get'
            url = Query.add(url, data);
            data = null; //要发送的数据已附加到 url 参数上
        }


        //增加一个随机字段，以使缓存失效
        var random = config.random;
        if (random) {
            random = $String.random(4);
            url = Query.add(url, random);
        }
      

        //同时启动超时器和发起请求，让它们去竞争。
       
        var isTimeout = false; //指示是否已超时
        var tid = null;
        var timeout = config.timeout || 0;

        if (timeout > 0) {
            tid = setTimeout(function () {
                isTimeout = true;
                xhr.abort(); //取消当前响应，关闭连接并且结束任何未决的网络活动。

                var fn = config.ontimeout;
                fn && fn(xhr);

            }, timeout);
        }


        var xhr = new XMLHttpRequest();
        xhr.open(method, url, true);

        xhr.onreadystatechange = function () {

            if (isTimeout || xhr.readyState != 4) {
                return;
            }


            clearTimeout(tid);

            var successCode = config.successCode;
            var fnError = config.error;

            if (xhr.status != 200) {
                fnError && fnError(xhr);
                return;
            }

            var JSON = require('JSON');
            var json = JSON.parse(xhr.responseText);
            if (!json) {
                fnError && fnError(xhr);
                return;
            }

            var field = config.field;

            var code = json[field.code];
            if (code == successCode) {

                var fnSuccess = config.success;
                var data = field.data in json ? json[field.data] : {};

                fnSuccess && fnSuccess(data, json, xhr);
            }
            else {
                var fnFail = config.fail;
                fnFail && fnFail(code, json[field.msg], json, xhr);
            }
        };

        if (method == 'post') {
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        }

        xhr.send(data);


        return xhr;
    }






    return /**@lends Ajax*/ {

        get: function (config) {
            return request('get', config);
        },

        post: function (config) {
            return request('post', config);
        },
    };

    

});



/**
* SSH/Server
* @class
*/
define('SSH/Server', function (require, module, exports) {

    var $Date = require('Date');
    var $String = require('String');
    var Defaults = require('Defaults');

    var defaults = Defaults.get(module.id);
    var storage = null;
    var args = null;

    var current = {
        config: null,   //缓存 `Server/Config` 中的 get() 结果。
        server: null,   //缓存当前的 server 信息。
    };

    function getStorage() {

        //已经创建过了
        if (storage || storage === false) { 
            return storage;
        }


        //首次创建
        var cache = defaults.cache;
        if (cache == 'session' || cache == 'local') {

            //为了让自动化工具分析出依赖，这里要用完整的字符串常量作为 require() 的第一个参数。
            var Storage = cache == 'session' ?
                    require('SessionStorage') :
                    require('LocalStorage');

            storage = new Storage(module.id, {
                name: 'KISP',
            });
        }
        else {
            storage = false; //这里不能用 null，以表示创建过了。
        }


        return storage;


    }


    function ajax(data, config, fnSuccess, fnFail, fnError) {

        config = config || {
            url: '',
            secret: '',
            key: '',
            route: '',
            version: '',
            fromTag: '',
        };

        var API = require('API');
        var MD5 = require('MD5');

        var eid = data['eid'];
        var netid = data['netid'];
        var secret = config['secret'];

        var timestamp = $Date.format(new Date(), 'yyyy-MM-dd HH:mm:ss');   //时间戳。
        var random = $String.random(16);                                   //16位随机数。
        var sign = MD5.encrypt(eid, secret, timestamp, random);             //签名。


        var defaults = Defaults.clone(module.id, {
            'url': config.url,
            //proxy: 'server.json',
        });

        var api = new API('', defaults);

        api.get({
            'EID': eid,
            'AppID': data['appid'],
            'NetID': netid,
            'AccKey': config['key'],
            'Timestamp': timestamp,
            'State': random,
            'Sign': sign,
        });


        api.on('success', function (data, json, xhr) {

            var server = current.server = {
                'AppSecret': json['AppSecret'],
                'ServerUrl': json['ServerUrl'],
                'NetID': json['NetID'] || netid,
            };

            use(config, server, fnSuccess);

        });

        api.on('fail', function (code, msg, json, xhr) {
            fnFail && fnFail(code, msg, json);
        });

        api.on('error', function (xhr) {
            fnError && fnError();
        });

    }



    function use(config, server, fn) {
        var Url = require('Url');
        var url = server['ServerUrl'] || '';

        if (!Url.isFull(url)) {
            url = 'http://' + url;
        }

        //当前真实的 netid 值，使用空字符串是为了兼容以前的写法，避免用到 undefined。
        var netid = server['NetID'] || '';   

        var data = {
            'secret': server['AppSecret'],
            'version': config['version'],
            'fromTag': config['fromTag'],
            'url': url + config['route'],   //类似 'http://120.132.144.214/Webapi/Router'
            'netid': netid,   
        };

        args = [data];

        var storage = getStorage();
        if (storage) {
            storage.set('args', args);
        }

        fn && fn.apply(null, args);
    }



    //
    return {
        /**
        * 获取服务器信息。
        */
        'get': function get(options) {

            var data = options.data;
            var fnSuccess = options.success;
            var fnFail = options.fail;
            var fnError = options.error;

            var cache = defaults.cache;

            if (cache && args) { //只有启用缓存时才从内存中读取。
                fnSuccess.apply(null, args);
                return;
            }

            //可能页面刷新了，导致内存中的不存在，才判断 SessionStorage 或 LocalStroage 中的
            var storage = getStorage();
            if (storage) {
                args = storage.get('args');
                if (args) {
                    fnSuccess.apply(null, args);
                    return;
                }
            }


            var Config = module.require('Config');
            Config.get(function (config) {

                if (!config) {
                    fnError && fnError();
                    return;
                }

                current.config = config;

                var server = current.server;
                if (server) {
                    use(config, server, fnSuccess);
                    return;
                }


                ajax(data, config, fnSuccess, fnFail, fnError);

            });
        },

        /**
        * 当存在多个 NetID 时，需要手动选择并设置所使用的项。
        */
        'set': function (server) {

            current.server = server;

            var config = current.config;
            if (config) {
                use(config, server);
            }
        },
    };


});


/**
* SSH/Server 模块的默认配置
* @name SSH/Server.defaults
*/
define('SSH/Server.defaults', /**@lends SSH/Server.defaults*/ {
    ext: '',
    successCode: 200,
    field: {
        code: 'Result',
        msg: 'ErrMsg',
        data: 'Data',
    },

    /**
    * 是否启用缓存。
    * 可取的值为 false|true|'session'|'local'
    */
    cache: 'session',
});


/**
* 日期时间工具
* @namespace
* @name Date
*/
define('Date', function (require, module, exports) {

    var delta = 0; //用于存放参考时间(如服务器时间)和本地时间的差值。


    function getDateItem(s) {
        var now = new Date();

        var separator =
                s.indexOf('.') > 0 ? '.' :
                s.indexOf('-') > 0 ? '-' :
                s.indexOf('/') > 0 ? '/' :
                s.indexOf('_') > 0 ? '_' : null;

        if (!separator) {
            return null;
        }

        var ps = s.split(separator);

        return {
            'yyyy': ps[0],
            'MM': ps[1] || 0,
            'dd': ps[2] || 1
        };
    }

    function getTimeItem(s) {
        var separator = s.indexOf(':') > 0 ? ':' : null;
        if (!separator) {
            return null;
        }

        var ps = s.split(separator);

        return {
            'HH': ps[0] || 0,
            'mm': ps[1] || 0,
            'ss': ps[2] || 0
        };
    }


    module.exports = exports = /**@lends Date */ {

        /**
        * 把参数 value 解析成等价的日期时间实例。
        * @param {Date|string} value 要进行解析的参数，可接受的类型为：
        *   1.Date 实例
        *   2.string 字符串，包括调用 Date 实例的 toString 方法得到的字符串；也包括以下格式: 
                yyyy-MM-dd
                yyyy.MM.dd
                yyyy/MM/dd
                yyyy_MM_dd
                HH:mm:ss
                yyyy-MM-dd HH:mm:ss
                yyyy.MM.dd HH:mm:ss
                yyyy/MM/dd HH:mm:ss
                yyyy_MM_dd HH:mm:ss
        * @return 返回一个日期时间的实例。
            如果解析失败，则返回 null。
        * @example
            $Date.parse('2013-04-29 09:31:20');
        */
        parse: function (value) {

            //标准方式
            var date = new Date(value);

            if (!isNaN(date)) {
                return date;
            }


            if (typeof value != 'string') {
                return null;
            }


            /*
             自定义方式：
                yyyy-MM-dd
                yyyy.MM.dd
                yyyy/MM/dd
                yyyy_MM_dd
                HH:mm:ss
                yyyy-MM-dd HH:mm:ss
                yyyy.MM.dd HH:mm:ss
                yyyy/MM/dd HH:mm:ss
                yyyy_MM_dd HH:mm:ss
                    
            */

            var parts = value.split(' ');
            var left = parts[0];

            if (!left) {
                return null;
            }

            //冒号只能用在时间的部分，而不能用在日期部分
            var date = left.indexOf(':') > 0 ? null : left;
            var time = date ? (parts[1] || null) : date;

            if (!date && !time) { //既没指定日期部分，也没指定时间部分
                return null;
            }


            if (date && time) {
                var d = getDateItem(date);
                var t = getTimeItem(time);
                return new Date(d.yyyy, d.MM - 1, d.dd, t.HH, t.mm, t.ss);
            }

            if (date) {
                var d = getDateItem(date);
                return new Date(d.yyyy, d.MM - 1, d.dd);
            }

            if (time) {
                var now = new Date();
                var t = getTimeItem(time);
                return new Date(now.getFullYear(), now.getMonth(), now.getDate(), t.HH, t.mm, t.ss);
            }
            
        },

        /**
        * 把日期时间格式化指定格式的字符串。
        * 已重载 format(formatter)。
        * @param {Date} datetime 要进行格式化的日期时间。
        *   如果不指定，则默认为当前时间，即 new Date()。
        * @param {string} formater 格式化的字符串。 其中保留的占位符有：
            'yyyy': 4位数年份
            'yy': 2位数年份
            'MM': 2位数的月份(01-12)
            'M': 1位数的月份(1-12)
            'dddd': '星期日|一|二|三|四|五|六'
            'dd': 2位数的日份(01-31)
            'd': 1位数的日份(1-31)
            'HH': 24小时制的2位数小时数(00-23)
            'H': 24小时制的1位数小时数(0-23)
            'hh': 12小时制的2位数小时数(00-12)
            'h': 12小时制的1位数小时数(0-12)
            'mm': 2位数的分钟数(00-59)
            'm': 1位数的分钟数(0-59)
            'ss': 2位数的秒钟数(00-59)
            's': 1位数的秒数(0-59)
            'tt': 上午：'AM'；下午: 'PM'
            't': 上午：'A'；下午: 'P'
            'TT': 上午： '上午'； 下午: '下午'
            'T': 上午： '上'； 下午: '下'
        * @return {string} 返回一个格式化的字符串。
        * @example
            //返回当前时间的格式字符串，类似 '2013年4月29日 9:21:59 星期一'
            $Date.format(new Date(), 'yyyy年M月d日 h:m:s dddd')
            $Date.format('yyyy年M月d日 h:m:s dddd')
        */
        format: function (datetime, formater) {

            //重载 format(formater);
            if (arguments.length == 1) {
                formater = datetime;
                datetime = new Date();
            }
            else {
                datetime = exports.parse(datetime);
            }



            var $String = require('String');

            var year = datetime.getFullYear();
            var month = datetime.getMonth() + 1;
            var date = datetime.getDate();
            var hour = datetime.getHours();
            var minute = datetime.getMinutes();
            var second = datetime.getSeconds();

            var padLeft = function (value, length) {
                return $String.padLeft(value, length, '0');
            };


            var isAM = hour <= 12;

            //这里不要用 {} 来映射，因为 for in 的顺序不确定
            var maps = [
                ['yyyy', padLeft(year, 4)],
                ['yy', String(year).slice(2)],
                ['MM', padLeft(month, 2)],
                ['M', month],
                ['dddd', '星期' + ('日一二三四五六'.charAt(datetime.getDay()))],
                ['dd', padLeft(date, 2)],
                ['d', date],
                ['HH', padLeft(hour, 2)],
                ['H', hour],
                ['hh', padLeft(isAM ? hour : hour - 12, 2)],
                ['h', isAM ? hour : hour - 12],
                ['mm', padLeft(minute, 2)],
                ['m', minute],
                ['ss', padLeft(second, 2)],
                ['s', second],
                ['tt', isAM ? 'AM' : 'PM'],
                ['t', isAM ? 'A' : 'P'],
                ['TT', isAM ? '上午' : '下午'],
                ['T', isAM ? '上' : '下']
            ];


            var s = formater;
            var replaceAll = $String.replaceAll;

            for (var i = 0, len = maps.length; i < len; i++) {
                var item = maps[i];
                s = replaceAll(s, item[0], item[1]);
            }

            return s;
        },


        /**
        * 将指定的毫秒数加到指定的 Date 上。
        * 此方法不更改参数 datetime 的值，而是返回一个新的 Date，其值是此运算的结果。
        * @param {Date} datetime 要进行操作的日期时间。
        * @param {Number} value 要增加/减少的毫秒数。 
            可以为正数，也可以为负数。
        * @param {string} [formater] 可选的，对结果进行格式化的字符串。 
        * @return {Date|string} 返回一个新的日期实例或字符串值。
            如果指定了参数 formater，则进行格式化，返回格式化后的字符串值；
            否则返回 Date 的实例对象。
        * @example
            $Date.addMilliseconds(new Date(), 2000); //给当前时间加上2000毫秒
        */
        add: function (datetime, value, formater) {
            datetime = exports.parse(datetime);

            var ms = datetime.getMilliseconds();
            var dt = new Date(datetime);//新建一个副本，避免修改参数

            dt.setMilliseconds(ms + value);

            if (formater) {
                dt = exports.format(dt, formater);
            }

            return dt;
        },

        /**
        * 将指定的秒数加到指定的 Date 实例上。
        * @param {Date} datetime 要进行操作的日期时间实例。
        * @param {Number} value 要增加/减少的秒数。可以为正数，也可以为负数。
        * @param {string} [formater] 可选的，对结果进行格式化的字符串。 
        * @return {Date} 返回一个新的日期实例。
            此方法不更改参数 datetime 的值。而是返回一个新的 Date，其值是此运算的结果。
        * @example
            $Date.addSeconds(new Date(), 90); //给当前时间加上90秒
        */
        addSeconds: function (datetime, value, formater) {
            return exports.add(datetime, value * 1000, formater);
        },

        /**
        * 将指定的分钟数加到指定的 Date 实例上。
        * @param {Date} datetime 要进行操作的日期时间实例。
        * @param {Number} value 要增加/减少的分钟数。可以为正数，也可以为负数。
        * @param {string} [formater] 可选的，对结果进行格式化的字符串。 
        * @return {Date} 返回一个新的日期实例。
            此方法不更改参数 datetime 的值。而是返回一个新的 Date，其值是此运算的结果。
        * @example
            $Date.addMinutes(new Date(), 90); //给当前时间加上90分钟
        */
        addMinutes: function (datetime, value, formater) {
            return exports.addSeconds(datetime, value * 60, formater);
        },

        /**
        * 将指定的小时数加到指定的 Date 实例上。
        * @param {Date} datetime 要进行操作的日期时间实例。
        * @param {Number} value 要增加/减少的小时数。可以为正数，也可以为负数。
        * @return {Date} 返回一个新的日期实例。
            此方法不更改参数 datetime 的值。而是返回一个新的 Date，其值是此运算的结果。
        * @example
            $Date.addHours(new Date(), 35); //给当前时间加上35小时
        */
        addHours: function (datetime, value, formater) {
            return exports.addMinutes(datetime, value * 60, formater);
        },


        /**
        * 将指定的天数加到指定的 Date 实例上。
        * @param {Date} datetime 要进行操作的日期时间实例。
        * @param {Number} value 要增加/减少的天数。可以为正数，也可以为负数。
        * @return {Date} 返回一个新的日期实例。。
            此方法不更改参数 datetime 的值。而是返回一个新的 Date，其值是此运算的结果。
        * @example
            $Date.addDays(new Date(), 35); //给当前时间加上35天
        */
        addDays: function (datetime, value, formater) {
            return exports.addHours(datetime, value * 24, formater);
        },

        /**
        * 将指定的周数加到指定的 Date 实例上。
        * @param {Date} datetime 要进行操作的日期时间实例。
        * @param {Number} value 要增加/减少的周数。可以为正数，也可以为负数。
        * @return {Date} 返回一个新的日期实例。
            此方法不更改参数 datetime 的值。 而是返回一个新的 Date，其值是此运算的结果。
        * @example
            $Date.addWeeks(new Date(), 3); //给当前时间加上3周
        */
        addWeeks: function (datetime, value, formater) {
            return exports.addDays(datetime, value * 7, formater);
        },

        /**
        * 将指定的月份数加到指定的 Date 实例上。
        * @param {Date} datetime 要进行操作的日期时间实例。
        * @param {Number} value 要增加/减少的月份数。可以为正数，也可以为负数。
        * @return {Date} 返回一个新的日期实例。
            此方法不更改参数 datetime 的值。而是返回一个新的 Date，其值是此运算的结果。
        * @example
            $Date.addMonths(new Date(), 15); //给当前时间加上15个月
        */
        addMonths: function (datetime, value, formater) {
            datetime = exports.parse(datetime);

            var dt = new Date(datetime);//新建一个副本，避免修改参数
            var old = datetime.getMonth();

            dt.setMonth(old + value);

            if (formater) {
                dt = exports.format(dt, formater);
            }

            return dt;
        },


        /**
        * 将指定的年份数加到指定的 Date 实例上。
        * @param {Date} datetime 要进行操作的日期时间实例。
        * @param {Number} value 要增加/减少的年份数。可以为正数，也可以为负数。
        * @return {Date} 返回一个新的日期实例。
            此方法不更改参数 datetime 的值。 而是返回一个新的 Date，其值是此运算的结果。
        * @example
            $Date.addYear(new Date(), 5); //假如当前时间是2013年，则返回的日期实例的年份为2018
        */
        addYears: function (datetime, value, formater) {
            return exports.addMonths(datetime, value * 12, formater);
        },

       


        /**
        * 设置一个参考时间在本地的初始值，随着时间的流逝，参考时间也会同步增长。
        * 如用来设置服务器时间在本地的初始值。
        */
        set: function (datetime) {
            var dt = exports.parse(datetime);

            if (!dt) {
                throw new Error('无法识别的日期时间格式: ' + datetime);
            }

            delta = dt - Date.now();
        },

        /**
        * 获取之前设置的参考时间。
        */
        get: function (formater) {
            var dt = new Date();

            if (delta != 0) {
                dt = exports.add(dt, delta);
            }
         

            if (formater) {
                dt = exports.format(dt, formater);
            }

            return dt;
        },

        /**
        * 转换成最常用的字符串格式 `yyyy-MM-dd HH:mm:ss`。
        * 如 `2018-04-16 09:26:59`
        */
        stringify: function (datetime) {
            return exports.format(datetime, 'yyyy-MM-dd HH:mm:ss');
        },
    };

});

/**
* 会话存储工具类
* @class
* @name SessionStorage
*/
define('SessionStorage', function (require, module, exports) {

    var Storage = require('Storage');
    var Defaults = require('Defaults');

    var storage = Storage('session');
    var mapper = new Map();
    var skey = 'KISP.SessionStorage.B81138B047FC';
    var name$app = storage.get(skey) || {}; //针对全部应用的



    function SessionStorage(id, config) {

        config = Defaults.clone(module.id, config);

        var name = config.name;
        if (!name) {
            throw new Error('请先配置 ' + module.id + ' 模块的 name 字段');
        }

        var app = name$app[name];

        if (!app) { //针对该应用的首次分配
            app = name$app[name] = {};
        }

        var meta = {
            'id': id,
            'data': app[id],
            'app': app,
        };

        mapper.set(this, meta);

    }



    SessionStorage.prototype = {
        constructor: SessionStorage,

        /**
        * 设置一对键值。
        * 已重载 set(obj); 批量设置。
        * 已重载 set(key, value); 单个设置。
        * @param {string} key 要进行设置的键名称。
        * @param value 要进行设置的值，可以是任何类型。
        */
        set: function (key, value) {

            var meta = mapper.get(this);
            var data = meta.data;
            var app = meta.app;
            var id = meta.id;

            //针对该实例的首次分配，或者因为调用了 clear() 而给清空了
            if (!data) {
                data = app[id] = meta.data = {};
            }

            if (typeof key == 'object') { //重载 set({...}); 批量设置的情况
                Object.assign(data, key);
            }
            else { //单个设置
                data[key] = value;
            }

            storage.set(skey, name$app); //保存全部

        },

        /**
        * 根据给定的键获取关联的值。
        * 已重载 get() 获取全部的情况。
        * @param {string} [key] 要进行获取的键名称。
        * @return 返回该键所关联的值。
        */
        get: function (key) {
            var meta = mapper.get(this);
            var data = meta.data;

            if (!data) {
                return;
            }

            //重载 get(); 获取全部的情况
            if (arguments.length == 0) {
                return data;
            }

            return data[key];
        },

        /**
        * 移除给定的键所关联的项。
        * @param {string} key 要进行移除的键名称。
        */
        remove: function (key) {

            var meta = mapper.get(this);
            var data = meta.data;

            if (!data) {
                return;
            }

            delete data[key];

            storage.set(skey, name$app); //保存全部

        },

        /**
        * 清空所有项。
        */
        clear: function () {
            var meta = mapper.get(this);
            var id = meta.id;
            var app = meta.app;

            delete app[id];
            meta.data = null;

            storage.set(skey, name$app); //保存全部
        },

    };

    //同时提供底层通用的静态方法。
    return Object.assign(SessionStorage, storage);




});





/**
* SessionStorage 模块的默认配置
* @name SessionStorage.defaults
*/
define('SessionStorage.defaults', /**@lends SessionStorage.defaults*/ {
    /**
    * 应用的名称。
    * 设定后即可创建与获取在该名称下的本地存储，从而避免跟其它应用的冲突。
    */
    name: '',
});


/**
* 存储工具类。
* @namespace
* @name Storage
*/
define('Storage', function (require, module, exports) {

    var type$exports = {};


    //type 为 `session` 或 `local`
    return function (type) {

        var exports = type$exports[type];
        if (exports) {
            return exports;
        }


        var name = type + 'Storage';
        var storage = window[name];
        if (!storage) {
            throw new Error('window 中不存在 ' + name + ' 存储对象。');
        }


        var id = 'KISP.' + name;
        var all = storage.getItem(id) || null;

        all = JSON.parse(all) || {};


        return type$exports[type] = {

            /**
            * 设置一对键值。
            * @param {string} key 要进行设置的键名称。
            * @param value 要进行设置的值，可以是任何类型。
            */
            set: function (key, value) {

                all[key] = value;

                var json = JSON.stringify(all);
                storage.setItem(id, json);

            },

            /**
            * 根据给定的键获取关联的值。
            * @param {string} key 要进行获取的键名称。
            * @return 返回该键所关联的值。
            */
            get: function (key) {
                return all[key];
            },

            /**
            * 移除给定的键所关联的项。
            * @param {string} key 要进行移除的键名称。
            */
            remove: function (key) {
                delete all[key];
                var json = JSON.stringify(all);
                storage.setItem(id, json);
            },

            /**
            * 清空所有项。
            */
            clear: function () {
                all = {};
                var json = JSON.stringify(all);
                storage.setItem(id, json);
            },

        };

    };



});






/**
* 本地存储工具类
* @namespace
* @name LocalStorage
*/
define('LocalStorage', function (require, module, exports) {
    var Storage = require('Storage');
    var Defaults = require('Defaults');

    var storage = Storage('local');
    var mapper = new Map();
    var skey = 'KISP.LocalStorage.B81138B047FC';
    var name$app = storage.get(skey) || {}; //针对全部应用的



    function LocalStorage(id, config) {

        config = Defaults.clone(module.id, config);

        var name = config.name;
        if (!name) {
            throw new Error('请先配置 ' + module.id + ' 模块的 name 字段');
        }

        var app = name$app[name];

        if (!app) { //针对该应用的首次分配
            app = name$app[name] = {};
        }

        var meta = {
            'id': id,
            'data': app[id],
            'app': app,
        };

        mapper.set(this, meta);

    }



    LocalStorage.prototype = {
        constructor: LocalStorage,

        /**
        * 设置一对键值。
        * 已重载 set(obj) 批量设置的情况。
        * @param {string} key 要进行设置的键名称。
        * @param value 要进行设置的值，可以是任何类型。
        */
        set: function (key, value) {

            var meta = mapper.get(this);
            var data = meta.data;
            var app = meta.app;
            var id = meta.id;

            //针对该实例的首次分配，或者因为调用了 clear() 而给清空了
            if (!data) {
                data = app[id] = meta.data = {};
            }

            if (typeof key == 'object') { //重载 set({...}); 批量设置的情况
                Object.assign(data, key);
            }
            else { //单个设置
                data[key] = value;
            }

            storage.set(skey, name$app); //保存全部

        },

        /**
        * 根据给定的键获取关联的值。
        * 已重载 get() 获取全部的情况。
        * @param {string} [key] 要进行获取的键名称。
        * @return 返回该键所关联的值。
        */
        get: function (key) {
            var meta = mapper.get(this);
            var data = meta.data;

            if (!data) {
                return;
            }

            //重载 get(); 获取全部的情况
            if (arguments.length == 0) {
                return data;
            }

            return data[key];
        },

        /**
        * 移除给定的键所关联的项。
        * @param {string} key 要进行移除的键名称。
        */
        remove: function (key) {

            var meta = mapper.get(this);
            var data = meta.data;

            if (!data) {
                return;
            }

            delete data[key];

            storage.set(skey, name$app); //保存全部

        },

        /**
        * 清空所有项。
        */
        clear: function () {
            var meta = mapper.get(this);
            var id = meta.id;
            var app = meta.app;

            delete app[id];
            meta.data = null;

            storage.set(skey, name$app); //保存全部
        },

    };

    //同时提供底层通用的静态方法。
    return Object.assign(LocalStorage, storage);

});


/**
* LocalStorage 模块的默认配置
* @name LocalStorage.defaults
*/
define('LocalStorage.defaults', /**@lends LocalStorage.defaults*/ {
    /**
    * 应用的名称。
    * 设定后即可创建与获取在该名称下的本地存储，从而避免跟其它应用的冲突。
    */
    name: '',
});



define('MD5', function (require, module,  exports) {

    /*md5 生成算法*/
    var hexcase = 0;
    var chrsz = 8;


    function core_md5(x, len) {

        x[len >> 5] |= 0x80 << ((len) % 32);
        x[(((len + 64) >>> 9) << 4) + 14] = len;

        var a = 1732584193;
        var b = -271733879;
        var c = -1732584194;
        var d = 271733878;

        for (var i = 0; i < x.length; i += 16) {
            var olda = a;
            var oldb = b;
            var oldc = c;
            var oldd = d;

            a = md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
            d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
            c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
            b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
            a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
            d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
            c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
            b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
            a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
            d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
            c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
            b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
            a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
            d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
            c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
            b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);

            a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
            d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
            c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
            b = md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
            a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
            d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
            c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
            b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
            a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
            d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
            c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
            b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
            a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
            d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
            c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
            b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);

            a = md5_hh(a, b, c, d, x[i + 5], 4, -378558);
            d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
            c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
            b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
            a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
            d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
            c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
            b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
            a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
            d = md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
            c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
            b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
            a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
            d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
            c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
            b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651);

            a = md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
            d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
            c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
            b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
            a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
            d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
            c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
            b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
            a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
            d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
            c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
            b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
            a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
            d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
            c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
            b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551);

            a = safe_add(a, olda);
            b = safe_add(b, oldb);
            c = safe_add(c, oldc);
            d = safe_add(d, oldd);
        }
        return Array(a, b, c, d);
    }
    function md5_cmn(q, a, b, x, s, t) {
        return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b);
    }
    function md5_ff(a, b, c, d, x, s, t) {
        return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
    }
    function md5_gg(a, b, c, d, x, s, t) {
        return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
    }
    function md5_hh(a, b, c, d, x, s, t) {
        return md5_cmn(b ^ c ^ d, a, b, x, s, t);
    }
    function md5_ii(a, b, c, d, x, s, t) {
        return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
    }
    function safe_add(x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    }
    function bit_rol(num, cnt) {
        return (num << cnt) | (num >>> (32 - cnt));
    }
    function str2binl(str) {
        var bin = Array();
        var mask = (1 << chrsz) - 1;
        for (var i = 0; i < str.length * chrsz; i += chrsz) {
            bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (i % 32);
        }
        return bin;
    }
    function binl2hex(binarray) {
        var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
        var str = "";
        for (var i = 0; i < binarray.length * 4; i++) {
            str += hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8 + 4)) & 0xF) + hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8)) & 0xF);
        }
        return str;
    }



    return {

        //md5加密主方法
        encrypt: function (s) {

            if (arguments.length > 1) {
                s = [].slice.call(arguments).join('');
            }

            return binl2hex(core_md5(str2binl(s), s.length * chrsz));
        }

    };

});


/**
*
*/
define('SSH/Server/Config', function (require, module, exports) {

    var Emitter = require('Emitter');
    var Defaults = require('Defaults');

    var json = null;
    var storage = null;


    function getStorage() {

        if (storage !== null) { //说明已经创建过了
            return storage;
        }

        //首次创建
        var defaults = Defaults.get(module.id);
        var cache = defaults.cache;


        if (cache == 'session' || cache == 'local') {

            //为了让自动化工具分析出依赖，这里要用完整的字符串常量作为 require() 的第一个参数。
            var Storage = cache == 'session' ?
                    require('SessionStorage') :
                    require('LocalStorage');

            storage = new Storage(module.id, {
                name: 'KISP',
            });

            return storage;
        }


        storage = false; //这里不能用 null，以表示创建过了。
        return storage;

        
    }



    function ajax(fn) {

        var defaults = Defaults.get(module.id);
        var url = defaults.url;

        $.getJSON(url, function (data) {

            try {
                var host = defaults.host || data['kisplusServerS']; //优先使用用户指定的 host。
                var path = data['kisplusAppsecret'];

                json = {
                    'version': data['ver'],
                    'fromTag': data['fromtag'],
                    'key': data['AccKey'],
                    'secret': data['AccSecret'],
                    'host': host,
                    'path': path,
                    'route': data['kisplusApiRouter'],
                    'url': host + path,
                };

                var storage = getStorage();
                if (storage) {
                    storage.set(json);
                }
            }
            catch (ex) {
                json = null;
            }

            fn && fn(json);

            if (!defaults.cache) {
                json = null;
            }

        });
    }


    



    return {

        'get': function (fn) {

            var defaults = Defaults.get(module.id);
            var cache = defaults.cache;


            if (cache && json) { //只有启用缓存时才从内存中读。
                fn(json);
                return;
            }

            var storage = getStorage();
            if (storage) {
                json = storage.get();

                if (json) {
                    fn(json);
                    return;
                }
            }


            ajax(fn);

        },
    };


});


/**
* SSH/Server/Config 模块的默认配置
* @name SSH/Server/Config.defaults
*/
define('SSH/Server/Config.defaults', /**@lends SSH/Server/Config.defaults*/ {

    url: 'http://mob.cmcloud.cn/kisplus/kisplusconfig.aspx?callback=?',

    /**
    * 是否启用缓存。
    * 可取的值为 false|true|'session'|'local'
    */
    cache: 'session',

    //默认使用服务器返回的(为 `http://kd.cmcloud.cn`)。
    //如果显式指定了该值，则忽略服务器返回的。
    host: '',
     

});


/**
*
*/
define('SSH/Ajax', function (require, module, exports) {

    var $Object = require('Object');
    var $Date = require('Date');
    var $String = require('String');
    var Query = require('Query');


    /**
    * 发起 ajax 网络请求(核心方法)。
    */
    function post(config) {
        var MD5 = require('MD5');


        //api 的完整名称
        var fullname = config['prefix'] + config['name'];

        var eid = config['eid'];
        var openid = config['openid'];

        var timestamp = $Date.get('yyyy-MM-dd HH:mm:ss');
        var random = $String.random(16); //16位随机数


        //临时方案，给新版授权使用。
        var form = config.form || {};
        var secret = form.secret || config.secret;

        form.Openid = form.Openid || openid;

        var data = {
            'EID': eid,
            'Openid': openid,
            'Method': fullname,
            'Timestamp': timestamp,
            'Ver': config['version'],
            'FromTag': config['fromTag'],
            'AppID': config['appid'],
            'NetID': config['netid'],

            'IsNewJson': 'Y',
            'IsEncrypt': 'N',

            //签名，值为 md5(EID + AppSecret + Method + Timetamp + State)
            'Sign': MD5.encrypt(eid, secret, fullname, timestamp, random),
            'State': random,
           
            'CustData': config['data'],
        };


        //临时方案，给新版授权使用。
        Object.assign(data, form);
        delete data.secret;



        var query = {
            //'eid': eid,
            //'openid': config['openid'],
            //'pubacckey': config['pubacckey'],
            //'timestamp': config['timestamp'],
            //'nonce': config['nonce'],
            //'pubaccid': config['pubaccid']
        };


        var API = require('API');

        var defaults = $Object.filter(config, [
            'ext',
            'successCode',
            'field',
            'url',
            'proxy',
            'serialize',
            'timeout',
        ]);

        //为方便抓包查看，把完整的名称放在首位。
        defaults.url = Query.add(defaults.url, fullname);




        //这里的 api 名称为空，因为它是固定 url 的，url 中不需要名称。
        //如 url = 'http://120.132.144.214/Webapi/Router'
        var api = new API('', defaults);


        //预绑定事件。
        var events = $Object.filter(config, [
            'success',
            'fail',
            'error',
            'abort',
        ]);

        // 'timeout' 字段已用来设置时间，这里要单独弄。
        events['timeout'] = config.ontimeout;
    

        api.on(events);

        


        api.post(data, query);

        return api;
    }




    return /**@lends Ajax*/ {
        'post': post,
    };

    

});



/**
*
*/
define('SSH.API/Ajax', function (require, module, exports) {

    var $Object = require('Object');


    /**
    * 发起 ajax 网络请求(核心方法)。
    */
    function post(config) {
        
        var SSH = require('SSH');
        var ssh = new SSH(config.name, config.ssh);


        var fnSuccess = config.success;
        var fnFail = config.fail;
        var fnError = config.error;

        var field = config.field;

        ssh.on({
            //SSH 层请求成功了
            'success': function (json, root, xhr) { //此处 data 为 json， json 为 root

                if (!json) {
                    fnError && fnError(xhr);
                }

                var successCode = config.successCode;
                var code = json[field.code];

                if (code == successCode) {
                    fnSuccess && fnSuccess(json[field.data] || {}, json, xhr);
                }
                else {
                    fnFail && fnFail(code, json[field.msg], json, xhr);
                }
            },

            'fail': function (code, msg, json, xhr) {

                //为了让业务层能知道 SSH 层发生了 fail，通过判断 json 是否为空即可。
                fnError && fnError(code, msg, json, xhr); 
            },

            'error': function (xhr) {

                //当 http 协议层连接错误，则 code, msg, json 三个参数都为 undefined。
                fnError && fnError(undefined, undefined, undefined, xhr);
            },

            'timeout': config.timeout,
            'abort': config.abort,
            'servers': config.servers,
        });


        var data = config.data;

        ssh.post({

            'openid': config.ssh.openid,

            'Result': '',
            'ErrMsg': '',
            'AccountDB': '',
            'TotalPage': '',

            'CurrentPage': data['pageNo'],
            'ItemsOfPage': data['pageSize'],

            'Data': $Object.remove(data, [
                'pageNo',
                'pageSize'
            ]),
        });

        return ssh;
    }




    return /**@lends Ajax*/ {
        'post': post,
    };

    

});



/**
* 简易信息提示组件
* @class
* @name Toast
*/
define('Toast', function (require, module, exports) {
    

    var Emitter = require('Emitter');
    var Defaults = require('Defaults');
    var RandomId = require('RandomId');

    //子模块
    var Renderer = module.require('Renderer');
    var Sample = module.require('Sample');
    var Style = module.require('Style');

    var mapper = new Map();



    /**
    * 构造器。
    * @constructor
    */
    function Toast(config) {


        config = Defaults.clone(module.id, config);

        var emitter = new Emitter(this);

        var cssClass = config.cssClass;
        if (cssClass instanceof Array) {
            cssClass = cssClass.join(' ');
        }

        var text = config.text;
        if (!text && text !== 0) { // 0 除外
            cssClass += ' NoText'; //注意，前面要有个空格
        }
        else {
            cssClass += ' HasText';
        }

        var icon = config.icon;
        cssClass += icon ? ' HasIcon' : ' NoIcon';

        var prefix = config.prefix;
        var suffix = config.suffix;

        var meta = {

            'id': RandomId.get(prefix, suffix),
            'icon': icon,
            'iconId': RandomId.get(prefix, 'icon-', suffix),
            'textId': RandomId.get(prefix, 'text-', suffix),

            'div': null,
            'sample': Sample.get(config.sample), //加载相应的 HTML 模板
            'text': text,
            'emitter': emitter,
            'mask': config.mask,
            'masker': null, // Mask 的实例，重复使用
            'style': Style.get(config),
            'showTime': 0, //开始显示时的时间点
            'cssClass': cssClass,
            'duration': config.duration,
            'container': config.container,
            'append': config.append,
        };

        mapper.set(this, meta);

    }


    //实例方法
    Toast.prototype = /**@lends Toast#*/ {
        constructor: Toast,

        /**
        * 显示本组件。
        *   config = {
        *       mask: {},
        *       icon: '',
        *       duration: 0,    //持续显示的时间，单位是 ms。
        *   };
        */
        show: function (text, config) {

            var type = typeof text;
            
            if (type == 'object') { //重载 show(config)
                config = text;
                text = config.text;
            }
            
            config = config || {};

            var meta = mapper.get(this);
            var div = meta.div;


            var style = Style.get(meta.style, config);

            if (!div) { //首次 render
                div = Renderer.render(meta, style);
            }


            $(div).css(style);

            var Mask = require('Mask');
            var mask = Mask.filter(meta.mask, config.mask);
            var masker = meta.masker;

            //指定了启用 mask 层
            if (mask) {
                if (!masker) {
                    masker = new Mask();
                    meta.masker = masker;
                }
                masker.show(mask);
            }
            else {
                if (masker) { //之前已经创建了，并且可能是显示的。
                    masker.hide();
                }
            }


            if (text !== undefined && text != meta.text) {
                $('#' + meta.textId).html(text);
                meta.text = text;
                $(div).removeClass('NoText').addClass('HasText');
            }


            if ('icon' in config) {
                var icon = config.icon;
                if (icon) {
                    $(div).removeClass('NoIcon').addClass('HasIcon');

                    if (icon != meta.icon) {
                        $('#' + meta.iconId).removeClass('fa-' + meta.icon).addClass('fa-' + icon);
                        meta.icon = icon;
                    }
                }
                else {
                    $(div).removeClass('HasIcon').addClass('NoIcon');
                }
            }


            meta.showTime = new Date(); //记录开始显示的时间点

            $(div).show();
            meta.emitter.fire('show');

            //优先使用参数中的，当不存在时，再使用 meta 的 
            var duration = 'duration' in config ? config.duration : meta.duration;

            if (duration) {
                var self = this;
                setTimeout(function () {
                    self.hide();
                }, duration);
            }
        },

        /**
        * 隐藏本组件。
        * @param {number} [lastTime] 需要持续显示的时间。
        */
        hide: function (lastTime) {
            var meta = mapper.get(this);
            var div = meta.div;

            if (!div) {
                return;
            }

            if (!lastTime) { //未指定要持续显示的时间，则立即隐藏
                hide();
                return;
            }

            var now = new Date();
            var showTime = meta.showTime;

            var useTime = now - showTime;       //已经显示的时间
            var leftTime = lastTime - useTime;  //剩余时间

            if (leftTime > 0) {
                setTimeout(hide, leftTime);
            }
            else { //立即隐藏
                hide();
            }

            //内部方法
            function hide() {
                var masker = meta.masker;
                if (masker) {
                    masker.hide();
                }
                meta.showTime = 0;
       
                $(div).hide();
                meta.emitter.fire('hide');
            }

        },

        /**
        * 移除本组件对应的 DOM 节点。
        */
        remove: function () {

            var meta = mapper.get(this);
            var div = meta.div;

            if (!div) {
                return;
            }


            var masker = meta.masker;
            if (masker) {
                masker.remove();
            }

            //reset
            meta.div = null;
            meta.masker = null;
            meta.hasBind = false;

   
            $(div).off();

            document.body.removeChild(div);
            meta.emitter.fire('remove');

        },

        /**
        * 绑定事件。
        */
        on: function (name, fn) {
            var meta = mapper.get(this);
            var emitter = meta.emitter;

            var args = [].slice.call(arguments, 0);
            emitter.on.apply(emitter, args);
        },

        /**
        * 销毁本组件
        */
        destroy: function () {
            var meta = mapper.get(this);
            var emitter = meta.emitter;

            this.remove();
            emitter.destroy();

            mapper.remove(this);
        },

    };

    return Toast;

});

/**
* Toast 模块的默认配置
* @name Toast.defaults
*/
define('Toast.defaults', /**@lends Toast.defaults*/ {
    
    /**
    * 生成的 id 的前缀。
    */
    prefix: 'KISP-Toast-',

    /**
    * 生成的 id 的随机后缀的长度。
    */
    suffix: 4,

    /**
    * 提示文本。
    */
    text: '',

    /**
    * 组件添加到的容器。
    * 默认为 document.body。
    */
    container: document.body,

    /**
    * 把组件添加到容器的方式，是否使用追加的方式。
    * 默认用 prepend 的方式。
    */
    append: false,

    /**
    * 是否启用 mask 层。
    */
    mask: false,

    /**
    * 组件用到的 html 模板。
    * 业务层不需要关注该字段。
    */
    sample: 'font-awesome',

    /**
    * 组件用到的 css 类名。
    */
    cssClass: '',

    /**
    * 用到的 font-awsome 的图标。
    */
    icon: 'check',

    /**
    * 显示的持续时间(毫秒)。
    * 0 表示一直显示。
    */
    duration: 0,

    //默认样式
});


/**
*
*/
define('Toast/Renderer', function (require, module, exports) {

    var $String = require('String');


    function render(meta, style) {

        var Style = require('Style');


        var id = meta.id;
        var sample = meta.sample;


        var html = $String.format(sample, {
            'id': id,
            'icon': meta.icon,
            'icon-id': meta.iconId,
            'text-id': meta.textId,
            'text': meta.text,
            'style': Style.stringify(style),
            'cssClass': meta.cssClass,
        });


        var container = meta.container;
        if (meta.append) {
            $(container).append(html);
        }
        else {
            $(container).prepend(html);
        }


        var div = document.getElementById(id);
        meta.div = div;

        return div;

    }

    return {

        render: render,
    };

});


/**
*
*/
define('Toast/Sample', function (require, module, exports) {
    
    var name$sample = {};


    function get(name) {
        var sample = name$sample[name];
        if (sample) {
            return sample;
        }

        sample = module.require(name);
        name$sample[name] = sample;
        return sample;
    }



    return {
        get: get,
    };


});


/**
* 
*/
define('Toast/Style', function (require, module, exports) {

    var Style = require('Style');
    

    function getMargin(v) {

        var type = typeof v;

        if (type == 'number') {
            return (0 - v / 2) + 'px';
        }

        if (type == 'string' && v.slice(-2) == 'px') {
            v = parseInt(v);
            return (0 - v / 2) + 'px';
        }

    }



    function get(item0, item1, itemN) {

        var list = [].slice.call(arguments);

        var style = Style.filter(list, [
            'background',
            'border-radius',
            'bottom',
            'color',
            'font-size',
            'height',
            'left',
            'margin-top',
            'right',
            'top',
            'width',
            'z-index',
            'position',
        ]);


        //根据宽度计算 margin-left 和 margin-top，使用居中

        var v = getMargin(style.width);
        if (v) {
            style['margin-left'] = v;
        }

        v = getMargin(style.height);
        if (v) {
            style['margin-top'] = v;
        }

        return style;


    }


    return {
        get: get,
    };


});


/**
* 云之家环境相关的模块
* @namespace
* @name CloudHome
*/
define('CloudHome', function (require, module, exports) {

    var Query = require('Query');
    var Native = module.require('Native');


    module.exports = exports = /**@lends CloudHome*/ {

        invoke: Native.invoke,


        /**
        * 判断是否在云之家打开的。
        * 即判断当前环境是否支持云之家的 JSBridge。
        * @param {boolean} [strict=false] 是否使用云之家官方文档上的严格模式进行判断。
            默认只从 url 中判断是否包含有 ticket 字段。
            如果要使用严格模式，请指定为 true。
        * @param {boolean} 返回一个布尔值，指示是否在云之家环境打开的。
        */
        check: function (strict) {
            
            //详见：http://open.kdweibo.com/wiki/doku.php?id=jsbridge:%E4%BA%91%E4%B9%8B%E5%AE%B6jsbridge%E8%AF%B4%E6%98%8E%E6%96%87%E6%A1%A3
            //iOS：Qing/0.9.0;iPhone OS 9.1;Apple;iPhone7,1
            //Android：Qing/0.9.0;Android4.1.1;Xiaomi;MI 2 

            if (strict) {
                var reg = /Qing\/.*;(iPhone|Android).*/;
                return navigator.userAgent.match(reg) ? true : false;
            }
           

            //如 ?ticket=967cada703a6ca821790f048d55f1d32
            return !!Query.has(window, 'ticket'); //确保返回一个 bool 值。
        },

        
        /**
        * 关闭云之家打开的轻应用。
        */
        close: function () {
            Native.invoke('close');
        },


        /**
        * 分享到微信。
        * @param {Object} config 参数配置对象。 其中：
        * @param {string} title 标题。
        * @param {string} content 内容。
        * @param {string} icon 图标，base64 格式。
        * @param {string} url 链接地址。
        * @param {function} success 分享成功后的回调函数。
        * @param {function} fail 分享失败后的回调函数。
        */
        shareWechat: function (config) {

            var API = require('CloudHome.API');
            var api = new API('socialShare');

            var success = config.success;
            if (success) {
                api.on('success', success);
            }

            var fail = config.fail;
            if (fail) {
                api.on('fail', fail);
            }


            api.invoke({
                'shareWay': 'wechat',
                'shareType': 3,
                'shareContent': {
                    'title': config.title,
                    'description': config.content,
                    'thumbData': config.icon,
                    'webpageUrl': config.url,
                },
            });
        },

        /**
        * 设置页面标题。
        * @param {string|boolean} title 要设置的标题或者显示或隐藏的开关。
            如果不指定或指定为 true，则显示之前的标题。
            如果指定为 false，则隐藏标题。
            如果指定为字符串，则设置为指定的内容。
        */
        setTitle: function (title) {

            var Title = require('CloudHome.Title');

            if (title === true) {
                Title.show();
            }
            else if (title === false) {
                Title.hide();
            }
            else if (title  || title === '') {
                Title.set(title);
            }
            else {
                Title.show(); //显示之前的标题
            }
        },



    };

});

/**
* 云之家接口类
* @class
* @name CloudHome.API
*/
define('CloudHome.API', function (require, module, exports) {


    var Emitter = require('Emitter');
    var Defaults = require('Defaults');
    var Fn = require('Fn');
 
    var mapper = new Map();


    /**
    * API 构造器。
    * @param {string} name 后台接口的名称。 简短名称，且不包括后缀。
    * @param {Object} [config] 配置对象。
    */
    function API(name, config) {

        name = name || '';
        config = Defaults.clone(module.id, config);


        var emitter = new Emitter(this);
        var delay = config.delay;

        var meta = {
            'name': name,
            'field': config.field,
            'status': '',
            'args': [],
            'emitter': emitter,

            fireEvent: function (status, args, emitter) {

                status = meta.status = status || meta.status;
                args = meta.args = args || meta.args;
                emitter = emitter || meta.emitter;

                Fn.delay(delay, function () {

                    //触发具体 code 对应的事件
                    if (status == 'fail') {
                        emitter.fire('code', args[0], args);
                    }

                    emitter.fire(status, args); //触发命名的分类事件，如 success、fail、error
                    emitter.fire('done', args); //触发总事件
                });
            },
        };

        mapper.set(this, meta);

    }



    //实例方法
    API.prototype = /**@lends CloudHome.API#*/ {
        constructor: API,

        /**
        * 发起云之家 native 调用请求。
        * 请求完成后会最先触发相应的事件。
        * @param {Object} [data] 请求的数据对象。
        *   该数据会给序列化成查询字符串以拼接到 url 中。
        * @return {API} 返回当前 API 的实例 this，因此进一步可用于链式调用。
        * @example
            var api = new API('test');
            api.invoke({ name: 'micty' });
        */
        invoke: function (data) {

            var meta = mapper.get(this);
            var name = meta.name;
            var field = meta.field;

            var CloudHome = require('CloudHome');

            CloudHome.invoke(name, data, function (json) {

                //云之家返回的 success 字段竟然是字符串的 'true' 或 'false'
                var isSuccess = json[field.success];
                isSuccess = String(isSuccess).toLowerCase() == 'true';

                if (isSuccess) {
                    var data = json[field.data] || {};
                    meta.fireEvent('success', [data, json]);
                    return;
                }


                var code = json[field.code];
                var msg = json[field.msg];

                meta.fireEvent('fail', [code, msg, json]);

            });

            return this;
        },


        /**
        * 绑定事件。
        * 已重载 on({...}，因此支持批量绑定。
        * @param {string} name 事件名称。
        * @param {function} fn 回调函数。
        * @return {API} 返回当前 API 的实例 this，因此进一步可用于链式调用。
        */
        on: function (name, fn) {

            var meta = mapper.get(this);
            var emitter = meta.emitter;

            var args = [].slice.call(arguments, 0);
            emitter.on.apply(emitter, args);

            var status = meta.status;

            if (status) { //请求已完成，立即触发
                var emt = new Emitter(this); //使用临时的事件触发器。
                emt.on.apply(emt, args);
                meta.fireEvent(status, meta.args, emt);
                emt.destroy();
            }

            return this;

        },

        /**
        * 解除绑定事件。
        * 已重载 off({...}，因此支持批量解除绑定。
        * @param {string} [name] 事件名称。
        *   当不指定此参数时，则解除全部事件。
        * @param {function} [fn] 要解除绑定的回调函数。
        *   当不指定此参数时，则解除参数 name 所指定的类型的事件。
        * @return {API} 返回当前 API 的实例 this，因此进一步可用于链式调用。
        */
        off: function (name, fn) {

            var meta = mapper.get(this);
            var emitter = meta.emitter;

            var args = [].slice.call(arguments, 0);
            emitter.off.apply(emitter, args);

            return this;
        },

        /**
        * 销毁本实例对象。
        */
        destroy: function () {
            var meta = mapper.get(this);
            var emitter = meta.emitter;
            emitter.destroy();

            mapper.remove(this);
        },
    };


    return API;




});


/**
* CloudHome.API 模块的默认配置
* @name CloudHome.API.defaults
*/
define('CloudHome.API.defaults', /**@lends CloudHome.API.defaults*/ {
    
    field: {
        success: 'success',
        code: 'errorCode',
        msg: 'error',
        data: 'data',
    },

    delay: false, //格式为 { min: 500, max: 2000 }
});


/**
* 云之家环境的页面标题
* @namespace
* @name CloudHome.Title
*/
define('CloudHome.Title', function (require, module, exports) {

    var current = document.title;
    var isVisible = false;

    module.exports = exports = /**@lends CloudHome.Title*/ {

        /**
        * 设置页面标题。
        */
        set: function (title) {

            current = title;
            document.title = title;

            var CloudHome = require('CloudHome');
            CloudHome.invoke('setWebViewTitle', {
                'title': title
            });

            isVisible = true;
        },

        /**
        * 显示页面标题。
        */
        show: function () {
            exports.set(current);
        },

        /**
        * 隐藏页面标题。
        */
        hide: function () {
            current = document.title;
            var CloudHome = require('CloudHome');
            CloudHome.invoke('hideWebViewTitle');
            isVisible = false;
        },

        /**
        * 切换显示或隐藏页面标题。
        */
        toggle: function (needShow) {
            if (needShow) {
                exports.show();
            }
            else {
                exports.hide();
            }
        },

    };

});
/**
* 调用云之家 native 方法的模块。
*/
define('CloudHome/Native', function (require, module, exports) {

    var cid = 0;    //回调 id 计数器，递增
    var id$fn = {}; //回调列表


    //该方法给云之家 native 调用，名称必须为这个
    window.XuntongJSBridge = {

        /**
        * 处理云之家的回调。
        * 该方法给云之家 native 调用
        */
        'handleMessageFromXT': function (id, json) {

            var fn = id$fn[id];
            if (!fn) {
                return;
            }

            fn(json || {});
        },
    };



    return /**@lends CloudHome.Native*/ {

        /**
        * 调用云之家原生接口。
        * @param {string} name 要调用的原生接口的名称。
        * @param {Object} [data] 要传递的数据对象。
        * @param {function} fn 回调函数。 会接收到一个参数: json 对象
        */
        invoke: function (name, data, fn) {

            if (typeof data == 'function') { //重载 invoke(name, fn)
                fn = data;
                data = null;
            }

            data = JSON.stringify(data || {});
            data = encodeURIComponent(data);

            var id = fn ? ++cid : 0;
            if (id) {
                id$fn[id] = fn;
            }

            var url = ['xuntong', name, id, data].join(':');

            var iframe = document.createElement('iframe');

            // for some reason we need to set a non-empty size for the iOS6 simulator
            iframe.setAttribute('height', '1px');
            iframe.setAttribute('width', '1px');

            iframe.setAttribute('src', url);

            document.documentElement.appendChild(iframe);
            iframe.parentNode.removeChild(iframe);
            iframe = null;


        },
    };


});

/**
* 页签列表控件
* @class
* @name Tabs
*/
define('Tabs', function (require, module, exports) {

    var Emitter = require('Emitter');
    var $Object = require('Object');
    var Defaults = require('Defaults');


    //子模块
    var Helper = module.require('Helper');

    var mapper = new Map();


    /**
    * 构造器。
    * @constructor
    */
    function Tabs(container, config) {

        //重载 Tabs(config)
        if ($Object.isPlain(container)) {
            config = container;
            container = config.container;
        }

        config = Defaults.clone(module.id, config);

        var meta = {
            'emitter': new Emitter(this),
            'container': container, 

            'activedIndex': -1,
            'activedNode': null, 
            'activedClass': config.activedClass,
            'pressedClass': config.pressedClass,
            'repeated': config.repeated,
            'looped': config.looped,

            'eventName': config.eventName,
            'list': [],
            'indexKey': config.field['index'],
            'eventKey': config.field['event'],
            'nodes': null,
            'selector': config.selector,
            'change': null, //内部记录绑定的 change 事件处理函数，用于可解除绑定
            'old': null,
            'tpl': null,
        };

        mapper.set(this, meta);


        var list = config.list;
        if (list) {
            this.render(list);
        }

        var current = config.current;
        if (typeof current == 'number') {
            this.active(current);
        }

        var change = config.change;
        if (change) {
            this.on('change', change);
        }

    }




    Tabs.prototype = /**@lends Tabs#*/ {
        constructor: Tabs,

        /**
        * 设置模板填充的规则，为模板填充进行预处理。
        */
        template: function (process) {

            var meta = mapper.get(this);
            var tpl = meta.tpl;

            if (!tpl) {
                var Template = require('Template');
                var container = meta.container;
                tpl = meta.tpl = new Template(container);
            }

            if (process) {
                var args = Array.from(arguments);
                tpl.process.apply(tpl, args);
            }


        },

        render: function (list, fn) {

            var meta = mapper.get(this);
            var container = meta.container;

            if (list) {
                this.template(); //确保 meta.tpl 存在
                meta.tpl.render(list, fn);

                meta.list = list;

                //数据发生了变化
                meta.nodes = null; 
                meta.activedNode = null;
                meta.activedIndex = -1;
            }


            if (!meta.change) { //首次绑定事件

                var eventName = meta.eventName;
                var selector = meta.selector;
                var pressedClass = meta.pressedClass;

                var self = this;

                var change = meta.change = function (event) {
                    var index = Helper.getIndex(meta, this);
                    self.active(index);
                };

                
                    $(container).on(eventName, selector, change);

                

                //<for:pc>
                //console.log('for PC only');
                //</for:pc>
            }


        },

        /**
        * 激活指定的项。
        * @param {number} index 要激活的项的索引值。
        * @param {boolean} [quiet=false] 是否使用安静模式。 
            当指定为 true 时，则不会触发事件，这在某种场景下会用到。
            否则会触发事件(默认情况)。
        */
        active: function (index, quiet) {

            var meta = mapper.get(this);
            var list = meta.list;

            //重载其他情况
            if (typeof index != 'number') {
                index = Helper.findIndex(list, index, arguments[1]);
            }

            var activedIndex = meta.activedIndex;
            var isSame = index == activedIndex;

            //当前项已激活，并且配置指定了不允许激活重复的项
            if (isSame && !meta.repeated) {
                return;
            }

           

            var activedNode = meta.activedNode;

            if (!isSame) { //激活的项跟上次的不一样

                activedIndex = meta.activedIndex = index;
                var activedClass = meta.activedClass;
                
                if (activedNode) { //上次已激活过
                    $(activedNode).removeClass(activedClass);
                }

                activedNode = meta.activedNode = Helper.getNode(meta, index);
                $(activedNode).addClass(activedClass);
            }

            
            var emitter = meta.emitter;
            var item = list[index];

            var current = {
                'item': item,
                'index': index,
                'element': activedNode,
                //'event': event,
            };

            var old = meta.old;
            meta.old = current;


            if (quiet) { //显式指定了使用安静模式，则不触发事件。
                return;
            }


            var args = [item, index, current, old];

            emitter.fire('before-change', args);
            emitter.fire('change', index, args);

            //触发指定的事件名
            var eventKey = meta.eventKey;
            if (eventKey) {
                emitter.fire('change', String(item[eventKey]), args);
            }

            emitter.fire('change', args);


        },

        /**
        * 激活前一项。
        * @param {boolean} [quiet=false] 是否使用安静模式。 
            当指定为 true 时，则不会触发事件，这在某种场景下会用到。
            否则会触发事件(默认情况)。
        */
        previous: function (qiuet) {
            var meta = mapper.get(this);
            var list = meta.list;
            var looped = meta.looped;
            var index = meta.activedIndex;

            if (index == 0) {
                if (!looped) {
                    return;
                }

                index = list.length;
            }
          
            this.active(index - 1, qiuet);
        },

        /**
        * 激活后一项。
        * @param {boolean} [quiet=false] 是否使用安静模式。 
            当指定为 true 时，则不会触发事件，这在某种场景下会用到。
            否则会触发事件(默认情况)。
        */
        next: function (qiuet) {
            var meta = mapper.get(this);
            var list = meta.list;
            var looped = meta.looped;
            var index = meta.activedIndex;

            if (index == list.length - 1) {
                if (!looped) {
                    return;
                }

                index = -1;
            }

            this.active(index + 1, qiuet);
        },

        /**
        * 显示本组件。
        */
        show: function (config) {
            var meta = mapper.get(this);
            var container = meta.container;
            $(container).show();

        },

        /**
        * 隐藏本组件。
        * @param {number} [lastTime] 需要持续显示的时间。
        */
        hide: function (lastTime) {
            var meta = mapper.get(this);
            var container = meta.container;
            $(container).hide();

        },

        /**
        * 绑定事件。
        */
        on: function (name, fn) {
            var meta = mapper.get(this);
            var emitter = meta.emitter;

            var args = [].slice.call(arguments, 0);
            emitter.on.apply(emitter, args);
        },

        /**
        * 销毁本组件
        */
        destroy: function () {
            var meta = mapper.get(this);
            
            var emitter = meta.emitter;
            emitter.destroy();

            //移除 DOM 事件
            var container = meta.container;
            var eventName = meta.eventName;
            var selector = meta.selector;
            var change = meta.change;

            $(container).off(eventName, selector, change);

            mapper.delete(this);
        },

        /**
        * 获取当前实例激活的索引值。
        */
        getActivedIndex: function () {
            var meta = mapper.get(this);
            return meta.activedIndex;
        },


        /**
       * 重置当前实例到初始状态。
       */
        reset: function () {

            var meta = mapper.get(this);
            $(meta.container).find(meta.selector).removeClass(meta.activedClass);

            meta.activedIndex = -1;
        },


        remove: function (index) {

            var meta = mapper.get(this);
            var activedIndex = meta.activedIndex;

            if (index == activedIndex) { //移除的是当前的激活项
                this.reset();
                return;
            }

            meta.list.splice(index, 1);

            if (index < activedIndex) { //移除的是当前激活项之前的，则重新设置激活状态即可
                activedIndex--;
            }

            this.active(activedIndex, false);

        },
    };



    return Tabs;

});

/**
* Tabs 模块的默认配置
* @name Tabs.defaults
*/
define('Tabs.defaults', /**@lends Tabs.defaults*/ {
    
    /**
    * 创建实例后首先给激的项。
    */
    current: null,

    /**
    * 压下去时的样式的 css 类名。
    * 当 eventName = 'touch' 时有效。
    */
    pressedClass: '',

    /**
    * 项目给激活时的样式的 css 类名。
    */
    activedClass: '',

    /**
    * 要监听的事件名。
    */
    eventName: '',

    /**
    * 取得项目列表所需要用到的 jQuery 选择器。
    * 默认取直接子节点。
    */
    selector: '>*',

    /**
    * 是否允许重复激活相同的项。
    * 当指定为 true 时，方响应已给激活的项目的重新点击。
    */
    repeated: false,

    /**
    * 当调用 previous()、next() 激前/后一项时，是否启用循环模式。
    * 如果启用了循环模式时，则当达到第一项或最后一项时，则会从尾或头开始。
    */
    looped: false,


    /**
    * 字段映射。
    */
    field: {
        /**
        * 从 DOM 元素中取得项目列表中指定项的 index 的自定义字段名。 
        */
        index: 'data-index',

        /**
        * 当触发 change 事件时，需要同时触发对应的 item 上指定的事件名。
        * 例如当指定为 'name' 时，则在触发 change 事件时，会同时 item['name'] 对应的事件。 
        */
        event: '',
    },
});

/**
* Tabs 模块的默认配置
* @name Tabs.config
*/
define('Tabs.config', /**@lends Tabs.config*/ {
    /**
    * 要监听的事件名。
    */
    eventName: 'click',

});


/**
*
*/
define('Tabs/Helper', function (require, module, exports) {

    
    function getNodes(meta) {

        //取得子节点列表。 
        //每次都去取最新的列表，因为可能会动态添加了子节点。
        var nodes = meta.nodes = $(meta.container).find(meta.selector).toArray();

        return nodes;

    }


    function getIndex(meta, node) {

        var key = meta.indexKey;
        var index = node.getAttribute(key);

        if (index) { //字符串的，不用担心 '0' 这样的情况
            return +index;
        }

        //没有指定 index，则迭代搜索
        var nodes = getNodes(meta);
        return nodes.findIndex(function (item, index) {
            return item === node;
        });

    }

    function getNode(meta, index) {

        //取得子节点列表
        var nodes = getNodes(meta);
        return nodes[index];

    }


    function findIndex(list, key, value) {
        
        var type = typeof key;

        //findIndex(list, item)
        if (type == 'object') {
            return list.findIndex(function (item, index) {
                return key === item;
            });
        }

        //findIndex(list, key, value)
        if (type == 'string') {
            return list.findIndex(function (item, index) {
                return item[key] === value;
            });
        }

        //findIndex(list, fn)
        if (type == 'function') {
            return list.findIndex(list, key);
        }
        
        throw new Error('无法识别的参数 key: ' + type);

    }


    return {
        getIndex: getIndex,
        getNode: getNode,
        findIndex: findIndex,

    };

});


/**
* 无数据提示面板控件。
* @class
* @name NoData
*/
define('NoData', function (require, module, exports) {

    var $Object = require('Object');
    var Emitter = require('Emitter');
    var RandomId = require('RandomId');
    var Defaults = require('Defaults');

    var Renderer = module.require('Renderer');
    var Sample = module.require('Sample');
    var Style = module.require('Style');

    var mapper = new Map();



    /**
    * 构造函数。
    */
    function NoData(container, config) {

        //重载 NoData(config)
        if ($.Object.isPlain(container)) {
            config = container;
        }
        else {
            config.container = container;
        }


        config = Defaults.clone(module.id, config);


        var cssClass = config.cssClass;
        if (cssClass instanceof Array) {
            cssClass = cssClass.join(' ');
        }

        var prefix = config.prefix;
        var suffix = config.suffix;

        var meta = {
            'div': null,
            'top': config.top,
            'bottom': config.bottom,
            'icon': config.icon,
            'text': config.text,
            'emitter': new Emitter(this),
            'container': config.container,
            'append': config.append,

            'id': RandomId.get(prefix, suffix),
            'textId': RandomId.get(prefix, 'text-', suffix),
            'text': config.text,
            'cssClass': cssClass,
            'sample': Sample,
            'style': Style.get(config),
            'scrollable': config.scrollable,
            'pulldown': config.pulldown,
            'visible': false, //组件当前是否可见
        };

        mapper.set(this, meta);

    }


    //实例方法
    NoData.prototype = /**@lends NoData#*/ {
        constructor: NoData,

        show: function (text) {

            var meta = mapper.get(this);
            var div = meta.div;

            if (!div) { //首次 render
                div = Renderer.render(meta, { 'text': text, });
            }
            else {
                $('#' + meta.textId).html(text || meta.text);
            }

            meta.visible = true;
            $(div).show();
            meta.emitter.fire('show');

        },

        hide: function () {

            var meta = mapper.get(this);
            var div = meta.div;

            if (!div) {
                return;
            }

            meta.visible = false;
            $(div).hide();
            meta.emitter.fire('hide');
        },

        toggle: function (needShow) {

            //重载 toggle( [] )，方便直接传入一个数据列表数组
            if (needShow instanceof Array) {
                needShow = needShow.length == 0;
            }

            var meta = mapper.get(this);
            var visible = meta.visible;

            if (arguments.length == 0) { //重载 toggle()
                if (visible) {
                    this.hide();
                }
                else {
                    this.show();
                }
            }
            else {
                if (visible && !needShow) {
                    this.hide();
                }
                else if(!visible && needShow) {
                    this.show();
                }
            }

        },


        /**
        * 监听事件。
        */
        on: function (name, fn) {

            var meta = mapper.get(this);
            var emitter = meta.emitter;
            var scroller = meta.scroller;

            var args = [].slice.call(arguments, 0);
            emitter.on.apply(emitter, args);

        },


        /**
        * 销毁本实例对象。
        */
        destroy: function () {
            var meta = mapper.get(this);
            var scroller = meta.scroller;
            scroller.destroy();

            var emitter = meta.emitter;
            emitter.destroy();

            mapper.remove(this);
        },

        



    };


    return NoData;


});


/**
* NoData 模块的默认配置
* @name NoData.defaults
*/
define('NoData.defaults', /**@lends NoData.defaults*/ {
    
    /**
    * 生成的 id 的前缀。
    */
    prefix: 'KISP-NoData-',

    /**
    * 生成的 id 的随机后缀的长度。
    */
    suffix: 4,

    text: '暂无数据',

    /**
    * 组件用到的 css 类名。
    */
    cssClass: '',

    /**
    * 组件添加到的容器。
    * 默认为 document.body。
    */
    container: document.body,

    /**
    * 把组件添加到容器的方式，是否使用追加的方式。
    * 默认用 prepend 的方式。
    */
    append: false,

    /**
    * 是否可滚动。
    * 当可滚动时，会创建相应的 scroller。
    */
    scrollable: true,

    pulldown: null,

    ////默认样式
    //'bottom': 0,
    //'top': 0,
    //'z-index': 1024,
});


/**
*
*/
define('NoData/Renderer', function (require, module, exports) {


    var $String = require('String');
    var Style = require('Style');


    function render(meta, data) {


        var id = meta.id;
        var sample = meta.sample;
        var style = meta.style;

        var text = data.text || meta.text;

        var html = $String.format(sample, {
            'id': id,
            'text-id': meta.textId,
            'text': text,
            'style': Style.stringify(style),
            'cssClass': meta.cssClass,
        });

        var container = meta.container;

        if (meta.append) {
            $(container).append(html);
        }
        else {
            $(container).prepend(html);

        }


        var div = document.getElementById(id);
        meta.div = div;

        if (meta.scrollable) {

            var Scroller = require('Scroller');

            var scroller = new Scroller(div, {
                'top': meta.top,
                'bottom': meta.bottom,
            });

            var pulldown = meta.pulldown;
            if (pulldown) {
                scroller.pulldown(pulldown);
            }
        }

        return div;

    }


    return {

        render: render,
    };

});

/*
* NoData/Sample
* 由 auto-packer 生成，来源: ../build/pc/0.0.1/src/ui/NoData/Sample.html
*/
define('NoData/Sample', [
    '<div id="{id}" class="KISP NoData {cssClass}" style="{style}">',
    '    <ul>',
    '        <li class="Icon"></li>',
    '        <li id="{text-id}" class="Text">{text}</li>',
    '    </ul>',
    '</div>',
    '',
    '',
].join('\n'));

/**
*/
define('NoData/Style', function (require, module, exports) {
    var Style = require('Style');
    




    function get(item0, item1, itemN) {

        var list = [].slice.call(arguments);

        var style = Style.filter(list, [
            'background',
            'bottom',
            'color',
            'font-size',
            'top',
            'z-index',
        ]);


        return style;

    }


    return {
        get: get,
    };


});


/**
* 本地图片读取器。
* 兼容浏览器端和云之家端。
* @class
* @name ImageReader
*/
define('ImageReader', function (require, module, exports) {

    var $Object = require('Object');
    var Emitter = require('Emitter');
    var Defaults = require('Defaults');

    var Renderer = module.require('Renderer');

    var mapper = new Map();


    function ImageReader(input, config) {

        //重载 ImageReader(config)
        if ($Object.isPlain(input)) {
            config = input;
            input = config['el'];
            delete config['el'];
        }

        config = Defaults.clone(module.id, config);


        var meta = {
            'emitter': new Emitter(this),
            'input': input,
            'loading': config.loading,
        };

        mapper.set(this, meta);

    }



    ImageReader.prototype = /**@lends ImageReader*/{
        constructor: ImageReader,

        /**
        * 渲染。
        */
        render: function (data) {

            var meta = mapper.get(this);
            Renderer.render(meta, data);
        },

        /**
        * 绑定事件。
        * 已重载 on({...}，因此支持批量绑定。
        * @param {string} name 事件名称。
        * @param {function} fn 回调函数。
        */
        on: function (name, fn) {

            var meta = mapper.get(this);
            var emitter = meta.emitter;

            var args = [].slice.call(arguments, 0);
            emitter.on.apply(emitter, args);
        },

    };



    return ImageReader;

});
/**
* ImageReader 模块的默认配置
* @name ImageReader.defaults
*/
define('ImageReader.defaults', /**@lends ImageReader.defaults*/ {
    loading: '读取中...',
});



define('ImageReader/Renderer', function (require, module, exports) {


    //针对 PC 浏览端的
    function renderPC(meta) {

        var emitter = meta.emitter;
        var loading = meta.loading;

        if (loading === true) {
            loading = KISP.create('Loading', {
                text: '读取中...',
            });
        }
        else if (typeof loading == 'string') {
            loading = KISP.create('Loading', {
                text: loading,
            });
        }


        $(meta.input).on('change', function (event) {

            var input = this; //这样是安全的，因为外面传进来的可能是一个 jQuery 选择器。
            var img = input.files[0];

            if (!img) { //第一次选择了，但第二次未选择时，为空
                emitter.fire('cancel');
                return;
            }


            var type = img.type;
            if (type.indexOf('image/') != 0) {
                emitter.fire('fail', [201, '所选择的文件类型不是图片', { img: img }]);
                return;
            }


            var reader = new FileReader();

            reader.onload = function (e) {

                loading && loading.hide();

                var data = e.target.result;
                emitter.fire('success', [data]);
            };

            loading && loading.show();

            reader.readAsDataURL(img);

        });
    }






    //针对云之家内嵌浏览器端的
    function renderCH(meta, data) {

        var emitter = meta.emitter;

        $(meta.input).on('click', function (event) {

            event.preventDefault();

            var API = require('CloudHome.API');
            var api = new API('selectPic');

            api.on('success', function (data, json) {

                var ext;
                var base64;

                try {
                    ext = data.fileExt;
                    base64 = data.fileData.replace(/[\r\n]/g, '');
                }
                catch (ex) {
                    var msg = '无法读取图片，云之家接口有问题: ' + ex.message;
                    emitter.fire('fail', [500, msg, json]);
                    return;
                }


                var image = 'data:image/' + ext + ';base64,' + base64;
                emitter.fire('success', [image]);

            });


            api.on('fail', function (code, msg, json) {

                if (code == 1) { //取消选择照片
                    emitter.fire('cancel');
                    return;
                }

                emitter.fire('fail', [code, msg, json]);
            });

            //data = { type: 'camera'|'photo' }; 如果不传，则表示两者都选。
            api.invoke(data);

        });
      
    }


    //是否为云之家环境，只需要判断一次
    var isCloudHome;


    return {

        render: function (meta, data) {

            if (isCloudHome === undefined) { //未判断
                var CloudHome = require('CloudHome');
                isCloudHome = CloudHome.check();
            }

            if (isCloudHome) {
                renderCH(meta, data);
            }
            else {
                renderPC(meta);
            }
        },
    };

});


/**
* HTML 转码工具。
* @namespace
* @name Escape
*/
define('Escape', function (require, module, exports) {

    module.exports = exports = /**@lends Escape*/ {

        /**
        * 把用户产生的内容做转换，以便可以安全地放在 html 里展示。
        * @return {String}
        */
        html: function (string) {
            var s = String(string);
            var reg = /[&'"<>\/\\\-\x00-\x09\x0b-\x0c\x1f\x80-\xff]/g;

            s = s.replace(reg, function (r) {
                return "&#" + r.charCodeAt(0) + ";"
            });

            s = s.replace(/ /g, "&nbsp;");
            s = s.replace(/\r\n/g, "<br />");
            s = s.replace(/\n/g, "<br />");
            s = s.replace(/\r/g, "<br />");

            return s;
        },

        /**
        * 把用户产生的内容做转换，以便可以安全地放在节点的属性里展示。
        * @example 如 `<input value="XXX">`，`XXX` 就是要转换的部分。
        * @return {String}
        */
        attribute: function (string) {
            var s = String(string);
            var reg = /[&'"<>\/\\\-\x00-\x1f\x80-\xff]/g;

            return s.replace(reg, function (r) {
                return "&#" + r.charCodeAt(0) + ";"
            });
        },

        /**
        * 用做过滤直接放到 HTML 里 j s中的。
        * @return {String}
        */
        script: function (string) {
            var s = String(string);
            var reg = /[\\"']/g;

            s = s.replace(reg, function (r) {
                return "\\" + r;
            });

            s = s.replace(/%/g, "\\x25");
            s = s.replace(/\n/g, "\\n");
            s = s.replace(/\r/g, "\\r");
            s = s.replace(/\x01/g, "\\x01");

            return s;
        },

        /**
        * 对查询字符串中的值部分进行转换。
        * 如 `http://www.test.com/?a=XXX`，其中 `XXX` 就是要过滤的部分。
        * @return {String}
        */
        query: function (string) {
            var s = String(string);
            return escape(s).replace(/\+/g, "%2B");
        },

        /**
        * 用做过滤直接放到<a href="javascript:alert('XXX')">中的XXX
        * @return {String}
        */
        hrefScript: function (string) {
            var s = exports.escapeScript(string);

            s = s.replace(/%/g, "%25"); //escMiniUrl
            s = exports.escapeElementAttribute(s);
            return s;

        },

        /**
        * 用做过滤直接放到正则表达式中的。
        * @return {String}
        */
        regexp: function (string) {
            var s = String(string);
            var reg = /[\\\^\$\*\+\?\{\}\.\(\)\[\]]/g;

            return s.replace(reg, function (a, b) {
                return "\\" + a;
            });
        },

        
    };


});
/*
* NumberPad/Sample
* 由 auto-packer 生成，来源: ../build/pc/0.0.1/src/mobile/NumberPad/Sample.html
*/
define('NumberPad/Sample', [
    '',
    '<div id="{id}" class="KISP NumberPad {cssClass}" style="{style}">',
    '    <ul id="{header-id}" class="header {has-text}">',
    '        <li id="{text-id}" class="text">{text}</li>',
    '        <li id="{value-id}" class="value">{value}</li>',
    '        <li class="ok">',
    '            <span data-cmd="done">完成</span>',
    '        </li>',
    '    </ul>',
    '    <div class="main">',
    '        <ul>',
    '            <li><span data-key="1">1</span></li>',
    '            <li><span data-key="2">2</span></li>',
    '            <li><span data-key="3">3</span></li>',
    '        </ul>',
    '        <ul>',
    '            <li><span data-key="4">4</span></li>',
    '            <li><span data-key="5">5</span></li>',
    '            <li><span data-key="6">6</span></li>',
    '        </ul>',
    '        <ul>',
    '            <li><span data-key="7">7</span></li>',
    '            <li><span data-key="8">8</span></li>',
    '            <li><span data-key="9">9</span></li>',
    '        </ul>',
    '        <ul id="{footer-id}" class="special {no-point}">',
    '            <li class="key-point"><span data-key=".">.</span></li>',
    '            <li><span data-key="0" class="zero">0</span></li>',
    '            <li><span data-cmd="back" class="icon-back"></span></li>',
    '        </ul>',
    '    </div>',
    '</div>',
].join('\n'));
/*
* Dialog/Sample/iOS
* 由 auto-packer 生成，来源: ../build/pc/0.0.1/src/ui/Dialog/Sample/iOS.html
*/
define('Dialog/Sample/iOS', [
    '#--div.begin--#',
    '<div id="{id}" class="KISP Dialog {cssClass}" style="{style}">',
    '',
    '    #--header.begin--#',
    '    <header style="{style}">',
    '        {title}',
    '    </header>',
    '    #--header.end--#',
    '',
    '    <article id="{article-id}" class="{no-header} {no-footer}">',
    '        <div id="{content-id}">{text}</div>',
    '    </article>',
    '',
    '    #--footer.begin--#',
    '    <footer id="{id}" class="buttons-{count}">',
    '        #--button.begin--#',
    '        <button data-index="{index}" style="{style}">{text}</button>',
    '        #--button.end--#',
    '    </footer>',
    '    #--footer.end--#',
    '</div>',
    '#--div.end--#',
].join('\n'));
/*
* Loading/Sample/iOS
* 由 auto-packer 生成，来源: ../build/pc/0.0.1/src/ui/Loading/Sample/iOS.html
*/
define('Loading/Sample/iOS', [
    '<div id="{id}" class="KISP Loading-iOS {cssClass}" style="{style}">',
    '    <div class="Main">',
    '        <div class="Item-0"></div>',
    '        <div class="Item-1"></div>',
    '        <div class="Item-2"></div>',
    '        <div class="Item-3"></div>',
    '        <div class="Item-4"></div>',
    '        <div class="Item-5"></div>',
    '        <div class="Item-6"></div>',
    '        <div class="Item-7"></div>',
    '        <div class="Item-8"></div>',
    '        <div class="Item-9"></div>',
    '        <div class="Item-10"></div>',
    '        <div class="Item-11"></div>',
    '    </div>',
    '    <span id="{text-id}" class="Text">{text}</span>',
    '</div>',
].join('\n'));
/*
* Toast/Sample/font-awesome
* 由 auto-packer 生成，来源: ../build/pc/0.0.1/src/ui/Toast/Sample/font-awesome.html
*/
define('Toast/Sample/font-awesome', [
    '<div id="{id}" class="KISP Toast-font-awesome {cssClass}">',
    '    <div>',
    '        <i id="{icon-id}" class="fa fa-{icon}"></i>',
    '    </div>',
    '    <span id="{text-id}" class="Text">{text}</span>',
    '</div>',
].join('\n'));

(function(require){
    var KISP = require('KISP');
    var Module = require('Module');

    global.KISP = KISP;
    global.define = Module.define;  //这个 define 是对外的，跟内部用的 define 不是同一个。


})(InnerModules.require);




})(
    window,  // 在浏览器环境中

    top,
    parent,
    window, 
    document,
    location,
    navigator,
    localStorage,
    sessionStorage,
    console,
    history,
    setTimeout,
    setInterval,

    Array, 
    Boolean,
    Date,
    Error,
    Function,
    JSON,
    Map,
    Math,
    Number,
    Object,
    RegExp,
    String,

    window.jQuery,   //不要省略前面的 `window.`，因为这样即使 jQuery 不存在也不会报错。

    undefined
);
