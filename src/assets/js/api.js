let env = 'dev';

let host = {
    'default': 'http://localhost',
    'dev': 'http://localhost',
    'pro': 'http://localhost'
};

function getHost(alias) {
    alias = alias || env;
    return host[alias] || host['default'];
}

export default {
    getHost
};