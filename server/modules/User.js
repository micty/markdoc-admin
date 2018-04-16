

define('User', function (require, module, exports) {
    var DataBase = require('DataBase');
    var Session = require('Session');

    var db = new DataBase('User', [
        { name: 'datetime', },
        { name: 'number', required: true, },
        { name: 'password', required: true, },
        { name: 'department', },
        { name: 'name', },
        { name: 'sex', },
        { name: 'phone', },
        { name: 'address', },
        { name: 'role', },

    ]);




    return {

        /**
        * 获取一条指定 id 的记录。
        */
        get: function (req, res) {
            var id = req.query.id;
            if (!id) {
                res.empty('id');
                return;
            }

            try {
                var item = db.get(id);
                if (item) {
                    res.success(item);
                }
                else {
                    res.none({ 'id': id });
                }
            }
            catch (ex) {
                res.error(ex);
            }
        },

        /**
        * 添加一条记录。
        */
        add: function (req, res) {
            var item = req.body.data;

            try {
                item = db.add(item);
                res.success(item);
            }
            catch (ex) {
                res.error(ex);
            }
        },

        /**
        * 更新一条指定 id 的记录。
        */
        update: function (req, res) {
            var item = req.body.data;
            var id = item.id;

            if (!id) {
                res.empty('id');
                return;
            }

            try {
                var data = db.update(item);
                if (data) {
                    res.success(data);
                }
                else {
                    res.none(item);
                }
            }
            catch (ex) {
                res.error(ex);
            }
        },

        /**
        * 删除一条指定 id 的记录。
        */
        remove: function (req, res) {
            var id = req.query.id;

            if (!id) {
                res.empty('id');
                return;
            }

            try {
                var item = db.remove(id);
                if (item) {
                    res.success(item);
                }
                else {
                    res.none({ 'id': id });
                }
            }
            catch (ex) {
                res.error(ex);
            }
        },

        /**
        * 读取列表。
        */
        list: function (req, res) {
            try {
                var list = db.list();
                res.success(list);
            }
            catch (ex) {
                res.error(ex);
            }
        },

        /**
        * 登录。
        */
        login: function (req, res) {
            var data = req.body;
            var number = data.number;
            var password = data.password;

            //针对超级管理员
            var isSuper =
                number == 'administrator' &&
                //password == '17c4520f6cfd1ab53d8745e84681eb49';   //`superadmin`
                //password == '4124bc0a9335c27f086f24ba207a4912';   //`aa`
                password == 'd41d8cd98f00b204e9800998ecf8427e';     //空串。

            
            if (isSuper) {
                var item = {
                    'number': number,
                    'name': "超级管理员",
                    'role': number,
                };

                item.token = Session.add(item);
                res.success(item);

                return;
            }


            try {
                var list = db.list();

                var item = list.find(function (item, index) {
                    return item.number == number &&
                        item.password == password;
                });

                if (!item) {
                    res.send({
                        code: 201,
                        msg: '用户名或密码错误',
                    });
                    return;
                }

                item.token = Session.add(item);
                res.success(item);
            }
            catch (ex) {
                res.error(ex);
            }
        },


    };


});