
module.exports = {

    //展示端的 data 目录。
    //dir: '../../demo/data/',              //针对发布后的。
    dir: '../../markdoc/htdocs/data/',      //本地开发用的。 


    //端口号。 
    //在政府的某些机子里，3001、3030端口会给屏蔽了。
    port: 8089,

    //超时时间，单位是毫秒。
    session: 60 * (60 * 1000),

    bodyParser: {
        json: {
            limit: '50mb',
        },

        urlencoded: {
            limit: '50mb',
            extended: true,
        },
    },

    api: {
        'FileList': {
            get: [
                'get',
                'read',
            ],
            post: [
               'add',
               'delete',
               'rename',
               'write',
               'upload',
            ],
        },


        'User': {
            get: [

            ],
            post: [
                'login',
            ],
        },
    },


};