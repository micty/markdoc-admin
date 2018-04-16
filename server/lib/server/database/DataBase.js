/**
* 
*/
define('DataBase', function (require, module, exports) {
    var $ = require('$');
    var $Date = $.require('Date');
    var $String = $.require('String');
    var Emitter = $.require('Emitter');

    var File = require('File');
    var Static = module.require('Static');

    var Field = module.require('Field');
    var List = module.require('List');
    var Map = module.require('Map');
    var Unique = module.require('Unique');
    var Refer = module.require('Refer');

    function now() {
        return $Date.format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    }

    var emitter = new Emitter(DataBase);
    var root = process.cwd() + '/data/';
    var name$db = {};



    /**
    * 构造器。
    * @param {string} name 数据库的名称。
    * @param {Array} fields 数据库的字段描述信息。
    */
    function DataBase(name, fields) {
        var isOuter = !!fields;             //判断是否为外面实例化的创建（通过指定 fields）。

        if (isOuter && name$db[name]) {
            throw new Error('已经存在名为 ' + name + ' 的 DataBase 实例');
        }

        //实体文件名。
        var dir = root + name + '/';
        dir = dir.split('\\').join('/');

        var field = dir + 'field.json';     //字段描述列表: fields
        var list = dir + 'list.json';       //id 索引列表: ids
        var map = dir + 'map.json';         //记录映射表: id$item
        var unique = dir + 'unique.json';   //一对一字段映射 id 表: fieldName$value$referId 
        var refer = dir + 'refer.json';     //外键所关联的子节点。



        fields = Field.init(field, fields);     //字段描述列表。 
        List.init(list);                        //初始化索引列表文件。
        Map.init(map);                          //初始化记录映射表文件。
        Unique.init(unique, fields);            //初始化一对一字段映射文件。
        Refer.init(refer, fields);              //初始化外键所关联的子节点文件。


        var meta = this.meta = {
            'emitter': new Emitter(this),

            'list': list,
            'map': map,
            'fields': fields,       //字段描述信息在创建后不会再变。
            'field': field,
            'unique': unique,
            'refer': refer,
        };


        if (isOuter) {
            var self = this;

            //关联外键
            fields.forEach(function (field) {
                var name = field.name;
                var refer = field.refer;    //关联的外键的数据库名称。
                if (!refer) {
                    return;
                }

                DataBase.on('create', refer, function (db) {
                    //级联删除所关联的下级节点。
                    db.on('remove', function (refers) {

                        var list = self.list();

                        refers.forEach(function (refer) {
                            var id = refer.id;

                            //在当前数据库表中找出所有关联到该外键的记录集。
                            var ids = list.filter(function (item) {
                                return item[name] == id;

                            }).map(function (item) {
                                return item.id;
                            });

                            self.remove(ids);
                        });
                    });
                });
            });

            emitter.fire('create', name, [this]);
            name$db[name] = this;
        }

    }




    //实例方法。
    DataBase.prototype = {
        constructor: DataBase,

        /**
        * 绑定事件。
        */
        on: function (name, fn) {
            var meta = this.meta;
            meta.emitter.on(...arguments);
        },

        /**
        * 获取一条指定 id 的记录。
        * @param {string} id 要获取的记录的 id 值。
        * @param {boolean} [refer=false] 是否获取关联的外键记录。
        *   默认为 false，即不获取。
        * @return {Object} 返回指定 id 的记录数据对象。
        */
        get: function (id, refer) {
            var meta = this.meta;
            var map = File.readJSON(meta.map);
            var values = map[id];

            if (!values) {
                return;
            }

            var item = { 'id': id };
            var fields = meta.fields;
            var refers = refer ? {} : null; //如果指定了要获取关联的外键记录，则分配一个 {}。

            fields.forEach(function (field, index) {
                var name = field.name;
                var value = values[index];
                var refer = field.refer;

                item[name] = value;

                //指定了要获取关联的外键，并且该字段是外键的。
                if (refers && refer) {
                    var db = DataBase.get(refer);

                    refers[name] = db.get(value, true);
                }
            });

            return refer ? {
                'item': item,
                'refer': refers,
            } : item;
        },

        /**
        * 获取全部或指定条件的记录列表。
        * @param {boolan} [refer=false] 是否获取关联的外键记录。 
        * @param {function} [filter=null] 过滤函数。 
        * @return {Array} 返回记录列表数组。
        */
        list: function (refer, filter) {
            //重载 list(filter);
            if (typeof refer == 'function') {
                filter = refer;
                refer = false;
            }

            var meta = this.meta;
            var map = File.readJSON(meta.map);
            var fields = meta.fields;
            var list = filter;

            if (Array.isArray(filter)) { //说明 filter 是 id 数组。
                filter = null;
            }
            else {
                list = File.readJSON(meta.list);
            }

            list = list.map(function (id) {
                var values = map[id];
                if (!values) {
                    return null;    //显式返回 null
                }

                var item = { 'id': id };
                var refers = refer ? {} : null;

                fields.forEach(function (field, index) {
                    var name = field.name;
                    var value = values[index];
                    var refer = field.refer;

                    item[name] = value;

                    //指定了要获取关联的外键，并且该字段是外键的。
                    if (refers && refer) {
                        var db = DataBase.get(refer);
                        refers[name] = db.get(value, true);
                    }
                });

                return refer ? {
                    'item': item,
                    'refer': refers,

                } : item;
            });

            //过滤条件为一个函数，则使用函数的过滤规则。
            if (typeof filter == 'function') {
                list = list.filter(filter);
            }

            return list;
        },

        /**
        * 获取指定页码和页大小的记录列表。
        * @param {number} pageNo 页码数值，从 1 开始。
        * @param {number} pageSize 页的大小，即每页记录的条数。
        * @param {function|Array} [filter] 过滤条件，可以是一个函数或记录的 id 数组。 
        *   如果指定，则先进行过滤再分页。
        * @return {object} 返回一个 { list: [], total: 123 } 的数据结构对象。
        */
        page: function (pageNo, pageSize, filter) {

            //安全起见。
            pageNo = Number(pageNo);
            pageSize = Number(pageSize);

            var meta = this.meta;
            var fields = meta.fields;

            var map = File.readJSON(meta.map);
            var list;

            if (Array.isArray(filter)) { //说明 filter 是 id 数组。
                list = filter;
                filter = null;
            }
            else {
                list = File.readJSON(meta.list);
            }


            var total = list.length;            //总记录数，在不过滤的条件下。
            var begin = (pageNo - 1) * pageSize;
            var end = begin + pageSize;

            //如果没有指定过滤条件，则先分页再拼接成完整记录以提升性能。
            if (!filter) {
                list = list.slice(begin, end);
            }

            //拼接成完整记录。
            list = list.map(function (id) {
                var values = map[id];
                if (!values) {
                    return null;    //显式返回 null
                }

                var item = { 'id': id };

                fields.forEach(function (field, index) {
                    item[field.name] = values[index];
                });

                return item;
            });

            //如果指定了过滤条件，则需要先拼接成完整记录并过滤后再分页。
            if (filter) {
                list = list.filter(filter);
                total = list.length;            //总记录数，以过滤后的为准。
                list = list.slice(begin, end);
            }

            return {
                'list': list,
                'total': total,
            };
        },

        /**
        * 移除一条或多条指定 id 的记录。
        * @param {string|Array} id 要移除的记录的 id 或其数组。
        * @return {Object|Array} 返回被移除的单条记录或其数组。
        */
        remove: function (id) {
            var meta = this.meta;
            var fields = meta.fields;

            var map = File.readJSON(meta.map);
            var list = File.readJSON(meta.list);
            var unique = File.readJSON(meta.unique);
            var refers = File.readJSON(meta.refer);

            var ids = Array.isArray(id) ? id : [id];

            //记录被修改的文件。
            var changed = {
                list: false,
                map: false,
                unique: false,
                refer: false,
            };

            var items = ids.map(function (id) {

                var index = list.indexOf(id);
                if (index >= 0) {
                    list.splice(index, 1);
                    changed.list = true;
                }

                var values = map[id];
                if (!values) {
                    return;
                }

                delete map[id];
                changed.map = true;

                var item = { 'id': id };

                fields.forEach(function (field, index) {
                    var value = values[index];
                    var name = field.name;

                    item[name] = value;

                    if (field.unique) {
                        delete unique[name][value];
                        changed.unique = true;
                    }

                    if (field.refer) {
                        var obj = refers[name];
                        var ids = obj[value];
                        if (ids) {
                            var k = ids.indexOf(id);
                            if (k >= 0) {
                                ids.splice(k, 1);
                                changed.refer = true;
                            }
                        }
                    }
                });

                return item;
            });

            changed.list && File.writeJSON(meta.list, list);
            changed.map && File.writeJSON(meta.map, map);
            changed.unique && File.writeJSON(meta.unique, unique);
            changed.refer && File.writeJSON(meta.refer, refers);

            //过滤掉空项。
            items = items.filter(function (item) {
                return !!item;
            });

            meta.emitter.fire('remove', [items]);

            return Array.isArray(id) ? items : items[0];
        },

        /**
        * 添加一条或多条记录。
        * 记录中如果指定了 id (datetime) 则使用它，否则自动分配一个新的 id (datetime)。
        * @param {Object} item 要添加的记录的数据对象或其数组。
        * @return {Object|Array} 返回被添加的单条记录或其数组。
        */
        add: function (item) {
            var meta = this.meta;
            var fields = meta.fields;

            var map = File.readJSON(meta.map);
            var list = File.readJSON(meta.list);
            var unique = File.readJSON(meta.unique);
            var refers = File.readJSON(meta.refer);


            var items = Array.isArray(item) ? item : [item];
            var errors = [];

            items = items.map(function (item) {
                var id = item.id || DataBase.newId();

                if (map[id]) {
                    errors.push('已存在 id 为 ' + id + ' 的记录。');
                    return;
                }

                item.id = id;
                item.datetime = item.datetime || now();
                list.push(id);

                //必须确保值的长度跟键的长度一致。
                map[id] = fields.map(function (field) {
                    var name = field.name;
                    var type = field.type;
                    var value = item[name];
                    var alias = '【' + (field.alias || name) + '】';

                    if (field.required) {
                        if (!(name in item)) {
                            errors.push('缺少字段 ' + name);
                            return;
                        }

                        if (type == 'string' && !value) {
                            errors.push('字段' + alias + '不能为空');
                            return;
                        }
                    }

                    if (field.unique) {
                        if (unique[name][value]) {
                            errors.push('已存在' + alias + '为' + value + '的记录');
                            return;
                        }

                        unique[name][value] = id;
                    }

                    var refer = field.refer;
                    if (refer) {
                        var db = DataBase.get(refer);
                        var referItem = db.get(value);
                        if (!referItem) {
                            //如：不存在关联的 landId 为 554SA76445BA 的 Land 记录。
                            errors.push('不存在关联的 ' + name + ' 为 ' + value + ' 的 ' + refer + ' 记录');
                            return;
                        }

                        var obj = refers[name];
                        var ids = obj[value];
                        if (!ids) {
                            obj[value] = ids = [];
                        }
                        var k = ids.indexOf(id);
                        if (k >= 0) {
                            //如：已存在 saleId 为 554SA76445BA 对应原 id 为 123456 的记录。
                            errors.push('已存在 ' + name + ' 为 ' + value + ' 对应的 id 为 ' + id + ' 记录');
                            return;
                        }
                        ids.push(id);
                    }

                    //存储时作数据转换。
                    switch (type) {
                        case 'string':
                            value = value == null ? '' : String(value); //把 null 和 undefined 转为 '' 。
                            break;
                        case 'number':
                            value = value == null ? 0 : Number(value);  //把 null 和 undefined 转为 0 。
                            break;
                        case 'boolean':
                            value = value ? value != 'false' : false;
                            break;
                    }

                    return value;
                });

                return item;
            });

            if (errors.length > 0) {
                throw new Error(errors.join('\n'));
            }

            File.writeJSON(meta.map, map);
            File.writeJSON(meta.list, list);
            File.writeJSON(meta.unique, unique);
            File.writeJSON(meta.refer, refers);

            meta.emitter.fire('add', [items]);

            return Array.isArray(item) ? items : items[0];

        },

        /**
        * 更新一条或多条指定 id 的记录。
        * @param {Object} item 要更新的记录的数据对象。
        * @return {Object|Array} 返回被更新的单条记录。
        */
        update: function (item) {
            var meta = this.meta;
            var map = File.readJSON(meta.map);

            var fields = meta.fields;
            var unique = File.readJSON(meta.unique);
            var refers = File.readJSON(meta.refer);

            var items = Array.isArray(item) ? item : [item];
            var errors = [];

            items = items.map(function (item) {
                var id = item.id;
                if (!id) {
                    errors.push('字段 id 不能为空。');
                    return;
                }

                var values = map[id];
                if (!values) {
                    errors.push('不存在 id 为 ' + id + ' 的记录。');
                    return;
                }

                fields.forEach(function (field, index) {
                    var name = field.name;
                    var alias = field.alias || name;
                    var oldValue = values[index];

                    if (!(name in item)) {
                        item[name] = oldValue; //取原来的值，为了返回给调用方。
                        return;
                    }

                    //以下的 value === item[name]，而不是原来的 oldValue。
                    var type = field.type;
                    var value = item[name];

                    if (field.required) {
                        if (type == 'string' && !value) {
                            errors.push('字段' + alias + '的值不能为空');
                            return;
                        }
                    }

                    if (value != oldValue) {

                        if (field.unique) {
                            var id2 = unique[name][value]; //关联的 id 值。
                            if (id2) {
                                //如: 已存在 landId 为 2250EA134178 的记录。
                                errors.push('已存在' + alias + '为 ' + value + ' 的记录， 其关联的 id 为' + id2);
                                return;
                            }

                            unique[name][value] = id;
                        }

                        if (field.refer) {
                            var obj = refers[name];
                            var ids = obj[oldValue]; //关联的 id 值。
                            if (ids) {
                                var k = ids.indexOf(id);
                                if (k >= 0) {
                                    ids.splice(k, 1);
                                }
                            }

                            ids = obj[value];
                            if (!ids) {
                                ids = obj[value] = [];
                            }

                            var k = ids.indexOf(id);
                            if (k >= 0) {
                                //如：已存在 saleId 为 554SA76445BA 对应原 id 为 123456 的记录。
                                errors.push('已存在 ' + name + ' 为 ' + value + ' 对应的 id 为 ' + id + ' 记录');
                                return;
                            }
                            ids.push(id);
                        }
                    }


                    //存储时作数据转换。
                    switch (type) {
                        case 'string':
                            value = String(value);
                            break;

                        case 'number':
                            value = Number(value);
                            break;

                        case 'boolean':
                            value = value == 'true';
                            break;
                    }

                    values[index] = value;
                });

                item.datetime = item.datetime || now();
                return item;

            });

            if (errors.length > 0) {
                throw new Error(errors.join('\n'));
            }

            File.writeJSON(meta.map, map);
            File.writeJSON(meta.unique, unique);
            File.writeJSON(meta.refer, refers);

            meta.emitter.fire('update', [item]);

            return Array.isArray(item) ? items : items[0];
        },

        /**
        * 统计指定条件的记录的数目。
        * 已重载 count(filter);
        * @param {boolan} [refer=false] 是否获取关联的外键记录。 
        * @param {function} [filter=null] 过滤函数。 
        */
        count: function (refer, filter) {
            //重载 count(filter);
            if (typeof refer == 'function') {
                filter = refer;
                refer = false;
            }

            var meta = this.meta;
            var list = File.readJSON(meta.list);

            if (!refer && !filter) {
                return list.length;
            }

            var map = File.readJSON(meta.map);
            var fields = meta.fields;

            list = list.map(function (id) {
                var values = map[id];
                if (!values) {
                    return null;    //显式返回 null
                }

                var item = { 'id': id };
                var refers = refer ? {} : null;

                fields.forEach(function (field, index) {
                    var name = field.name;
                    var value = values[index];
                    var refer = field.refer;

                    item[name] = value;

                    //指定了要获取关联的外键，并且该字段是外键的。
                    if (refers && refer) {
                        var db = DataBase.get(refer);
                        refers[name] = db.get(value, true);
                    }
                });

                return refer ? {
                    'item': item,
                    'refer': refers,

                } : item;
            });

            if (filter) {
                list = list.filter(filter);
            }

            return list.length;
        },

        /**
        * 获取指定条件的记录列表，然后以某个字段的值作为主键关联整条记录而得到一个映射集。
        * 已重载 map(key, refer);
        * 已重载 map(key, filter);
        * @param {string} key 一条记录中要作为主键的字段名称。 
        * @param {boolan} [refer=false] 是否获取关联的外键记录。 
        * @param {function} [filter=null] 过滤函数。 
        * @return {Object} 返回一个对象。
        */
        map: function (key, refer, filter) {
            //重载 map(key, filter);
            if (typeof refer == 'function') {
                filter = refer;
                refer = false;
            }

            var list = this.list(refer, filter);
            var id$item = {};

            list.forEach(function (item) {
                var id = refer ? item.item[key] : item[key];
                id$item[id] = item;
            });

            return id$item;
        },

        /**
        * 获取某个指定外键值所关联的记录列表。
        * @param {string} key 外键的字段名称。 
        * @param {string} key 外键的字段值。 
        * @param {boolan} [refer=false] 是否获取关联的外键记录。 
        * @return {Array} 返回一个数组。
        */
        refer: function (key, value, refer) {
            var meta = this.meta;
            var refers = File.readJSON(meta.refer);
            var obj = refers[key];
            if (!obj) {
                throw new Error(key + ' 不是外键');
            }

            var ids = obj[value] || [];
            var list = this.list(refer, ids);
            return list;
        },

        /**
        * 获取整个数据库文件所对应的 md5 值。
        * @return {string} 返回一个 32 位的 md5 字符串。
        */
        md5: function () {
            var MD5 = require('MD5');
            var meta = this.meta;
            var contents = [];

            for (var key in meta) {
                var item = meta[key];

                if (typeof item == 'string' && item.endsWith('.json')) {
                    item = File.read(item);
                    contents.push(item);
                }
            }

            var md5 = MD5.get(contents.join('\n'));
            return md5;
        },

    };



    //静态方法。
    Object.assign(DataBase, Static, {
        /**
        * 
        */
        on: function (action, name, fn) {
            //指定名称的数据库已经创建，立即触发回调函数。
            if (action == 'create') {   //外面绑定只能 on('create', name, fn) 的方式。
                var db = name$db[name];
                if (db) {
                    fn && fn(db);
                    return;
                }
            }

            //尚未创建，则先注册。
            var args = [].slice.call(arguments, 0);
            emitter.on.apply(emitter, args);
        },

        /**
        * 
        */
        get: function (name) {
            return name$db[name] || new DataBase(name);
        },
    });

    return DataBase;

});





