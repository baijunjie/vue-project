let env = process.env.NODE_ENV;

let host = {
    'default': 'http://localhost',
    'development': '/api',
    'production': 'http://live.xiaojiuwo.com'
};

function getHost(alias) {
    alias = alias || env;
    return host[alias] || host['default'];
}

export default {
    getHost,
    getLiveList: getHost() + '/api/live/index', // 直播列表
    getLiveDetail: getHost() + '/api/live/show', // 直播详情
    getSceneList: getHost() + '/api/scene/index', // 现场列表
    getSceneDetail: getHost() + '/api/scene/show', // 现场详情
    getToken: getHost() + '/api/user/imtoken' // 获取token
};
