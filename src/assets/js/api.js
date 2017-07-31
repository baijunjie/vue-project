let env = process.env.NODE_ENV;

let host = {
    'default': 'http://localhost',
    'development': 'http://localhost',
    'production': 'http://localhost'
};

function getHost(alias) {
    alias = alias || env;
    return host[alias] || host['default'];
}

export default {
    getHost
};