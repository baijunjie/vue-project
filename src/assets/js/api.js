let env = 'dev';

let host = {
    'default': 'http://localhost',
    'dev': 'http://localhost'
};

function getHost(alias) {
    alias = alias || env;
    return host[alias] ? host[alias] : host['default'];
}

export default {
    getUseList: getHost() + '/api/getUseList'
};