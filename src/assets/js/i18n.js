/**
 * Vue 国际化 v0.2.4
 * @author Junjie.Bai
 *
 * i18n  返回一个 VueI18n 的实例对象，扩展了几个方法。
 *
 * 方法：
 * - getLang             获取当前语言。
 * - setLang             设置当前语言。
 * - getAllLang          获取全部语言对象。
 * - setAllLang          设置全部语言对象。
 * - getLangType         获取当前语言类型。
 * - setLangType         设置当前语言类型。
 * - config              设置配置对象。
 * - on                  注册事件监听。
 * - off                 移除事件监听。
 *
 * 事件：
 * - requireLangDone  新语言包加载完成时触发该事件，并将该语言类型作为参数传入。
 * - requireLangFail  新语言包加载失败时触发该事件，并将该语言类型作为参数传入。
 * - change           语言变更后触发该事件，并将当前语言类型作为参数传入。
 * - ready            第一种语言准备好时触发该事件，并将当前语言类型作为参数传入。
 */
import Vue from 'vue';
import VueI18n from 'vue-i18n';
Vue.use(VueI18n);

import VueResource from 'vue-resource';
Vue.use(VueResource);

// 定义事件 callback 集合
let callbackSet = {
        'requireLangDone': [], // 请求一种语言完成时的回调
        'requireLangFail': [], // 请求一种语言失败时的回调
        'change': [], // 语言变更时的回调
        'ready': []  // 第一种语言准备好时的回调
    },

    cfg = {
        // paths 语言包路径配置对象
        // {
        //     'zh-CN': 'language/zh-CN.json'
        // }
        paths: {},

        // 设置 http 请求的默认配置选项。
        http: {},

        // 语言类型是否大小写敏感
        caseSensitive: false
    },

    isReady = false,

    i18n = extend(new VueI18n(), {
        getLang,
        setLang,
        getAllLang,
        setAllLang,
        getLangType,
        setLangType,
        config,
        on,
        off
    });

config({
    http: {
        method: 'get',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }
});

// 返回对象中相同的语言类型 key
function checkLangType(langType, obj) {
    if (cfg.caseSensitive) {
        return obj[langType] ? langType : false;
    } {
        let reg = new RegExp('^' + langType + '$', 'i');
        for (langType in obj) {
            if (reg.test(langType)) {
                return langType;
            }
        }
        return false;
    }
}

// 执行指定事件类型的 callback
// 并将第二个参数及之后参数传递给 callback
function execCallbak(type) {
    let args = Array.prototype.slice.call(arguments, 1);
    callbackSet[type].concat().forEach(function(cb) {
        cb.apply(i18n, args);
    });
}

/**
 * 获取当前语言
 * @param  {String}        key  可选。传入语言 key
 * @return {String|Object}      返回当前语言类型下 key 的对应值。如果没有传参，则返回当前语言字典对象。
 */
function getLang(key) {
    let langType = isReady ? i18n.locale : cfg.defLangType;
    let langDict = i18n.messages[langType];
    if (key === undefined) {
        return extend(true, {}, langDict);
    } else if (langDict) {
        let returnValue;
        if (returnValue = langDict[key]) {
            return returnValue;
        } else if (returnValue = eval('langDict.' + key)) {
            return returnValue;
        }
    }
    return key;
}

/**
 * 设置当前语言
 * @param {String|Object} key    传入语言 key。如果传入的是对象，则会将该对象与当前语言字典对象合并，此时第二个参数 value 会被忽略。
 * @param {String|Object} value  传入 key 对应的 value。
 */
function setLang(key, value) {
    let langType = isReady ? i18n.locale : cfg.defLangType;
    if (!langType) return;

    let langDict;
    if (typeof key === 'object') {
        langDict = key;
    } else {
        langDict = {};
        langDict[key] = value;
    }

    i18n.messages[langType] = extend(true, i18n.messages[langType], langDict);

    return i18n;
}

/**
 * 获取全部语言对象
 * @param  {String} langType  可选。传入语言类型
 * @return {Object}           返回当前语言类型对应的语言对象。如果没有传参，则返回包含所有语言对象的集合。
 */
function getAllLang(langType) {
    return langType === undefined ?
        extend(true, {}, i18n.messages) :
        extend(true, {}, i18n.messages[checkLangType(langType, i18n.messages)]);
}

/**
 * 设置全部语言对象
 * @param {String|Object} langType  传入语言类型。如果传入的是对象，则会将该对象与包含所有语言字典对象的集合合并，此时第二个参数 langDict 会被忽略。
 * @param {Object}        langDict  传入语言字典对象。
 */
function setAllLang(langType, langDict) {
    let newLangSet,
        langTypeExsit;

    if (typeof langType === 'object') {
        newLangSet = langType;
    } else if (typeof langType === 'string') {
        newLangSet = {};
        newLangSet[langType] = langDict;
    } else {
        return i18n;
    }

    for (langType in newLangSet) {
        if (!(langTypeExsit = checkLangType(langType, i18n.messages))) {
            langTypeExsit = langType;
        }
        i18n.messages[langTypeExsit] = extend(i18n.messages[langTypeExsit], newLangSet[langType]);
    }

    return i18n;
}

/**
 * 获取当前语言类型
 * @return {String} 返回当前语言类型
 */
function getLangType() {
    return isReady ? i18n.locale : '';
}

/**
 * 设置当前语言类型（必须应用启动后才可以使用）
 * @param  {String}        langType 需要设置的当前语言类型
 * @return {Promise}                返回一个 Promise 对象。Promise 对象 resolve 时，表示语言设置成功，并会将当前语言类型作为参数传入。
 */
function setLangType(langType) {
    let langTypeExsit;
    if (langTypeExsit = checkLangType(langType, i18n.messages)) {
        langType = langTypeExsit;
    }

    let promise = new Promise(function(resolve, reject) {

        if (isReady && langType === i18n.locale) return resolve();

        if (i18n.messages[langType]) {
            i18n.locale = langType;
            return resolve();

        } else if (langTypeExsit = checkLangType(langType, cfg.paths)) {
            let options = extend(true, {}, cfg.http, { url: cfg.paths[langTypeExsit] });

            Vue.http(options)
                .then(function(res) {
                    if (res.status === 200) {
                        return res.json();
                    } else {
                        execCallbak('requireLangFail', langType);
                        reject('requireLangFail');
                    }
                })
                .then(function(json) {
                    execCallbak('requireLangDone', langType);

                    i18n.setLocaleMessage(langType, json);
                    i18n.locale = langType;

                    if (!isReady) {
                        isReady = true;
                        execCallbak('ready', langType);
                        delete callbackSet['ready'];
                    }

                    resolve('requireLangDone');
                })
                .catch(function(error) {
                    execCallbak('requireLangFail', langType);
                    reject('requireLangFail');
                });
        }
    });

    promise.then(function() {
        execCallbak('change', langType);
    });

    return promise;
}

/**
 * 设置配置对象
 * @param {Object} config 配置对象
 */
function config(config) {
    if (config) extend(true, cfg, config);
    return i18n;
}

/**
 * 注册事件监听
 * @param  {String}             type      事件类型。
 * @param  {Function}           callback  事件监听函数。
 * @return {Function|Undefined}           如果注册成功，则返回一个反注册函数，调用它可以取消监听。
 */
function on(type, callback) {
    // 如果已有一个语言准备好，并且事件类型为 'ready'，则立即执行 callback
    if (isReady && type === 'ready' && typeof callback === 'function') {
        callback.call(i18n, i18n.locale);
        return;
    }

    if (!callbackSet[type]) return;

    let cbArr = callbackSet[type];

    if (typeof callback === 'function' && cbArr.indexOf(callback) < 0) {
        cbArr.push(callback);
    }

    return function() {
        let index = cbArr.indexOf(callback);
        if (index >= 0) {
            cbArr.splice(index, 1);
        }
    };
}

/**
 * 移除事件监听
 * @param  {String}   type     可选。事件类型。
 *                             如果传入一个 Function，则会被当做事件监听函数来处理。
 * @param  {Function} callback 可选。事件监听函数。
 */
function off(type, callback) {
    let i,
        cbSet,
        typeStr = typeof type;

    if (typeStr === 'undefined') {
        for (i in callbackSet) {
            callbackSet[i].length = 0;
        }
        return;

    } else if (typeStr === 'function') {
        callback = type;
        cbSet = callbackSet;

    } else if (typeStr === 'string') {
        if (callbackSet[type]) {
            cbSet = {};
            cbSet[type] = callbackSet[type];
        } else {
            return;
        }

        if (callback === undefined) {
            cbSet[type].length = 0;
        }
    } else {
        return;
    }

    let cbArr, index;
    for (i in cbSet) {
        cbArr = cbSet[i];
        index = cbArr.indexOf(callback);
        if (index >= 0) {
            cbArr.splice(index, 1);
        }
    }
}

function extend() {
    let options, name, src, copy, copyIsArray, clone,
        target = arguments[0] || {},
        targetType = typeof target,
        toString = Object.prototype.toString,
        i = 1,
        length = arguments.length,
        deep = false;

    // 处理深拷贝
    if (targetType === 'boolean') {
        deep = target;

        // Skip the boolean and the target
        target = arguments[i] || {};
        targetType = typeof target;
        i++;
    }

    // Handle case when target is a string or something (possible in deep copy)
    if (targetType !== 'object' && targetType !== 'function') {
        target = {};
    }

    // 如果没有合并的对象，则表示 target 为合并对象，将 target 合并给当前函数的持有者
    if (i === length) {
        target = this;
        i--;
    }

    for (; i < length; i++) {

        // Only deal with non-null/undefined values
        if ((options = arguments[i]) != null) {

            // Extend the base object
            for (name in options) {
                src = target[name];
                copy = options[name];

                // 防止死循环
                if (target === copy) {
                    continue;
                }

                // 深拷贝对象或者数组
                if (deep && copy &&
                    (copyIsArray = toString.call(copy) === '[object Array]') ||
                    (toString.call(copy) === '[object Object]')) {

                    if (copyIsArray) {
                        copyIsArray = false;
                        src = src && (toString.call(src) === '[object Array]') ? src : [];

                    } else {
                        src = src && (toString.call(src) === '[object Object]') ? src : {};
                    }

                    target[name] = extend(deep, src, copy);


                } else if (copy !== undefined) { // 仅忽略未定义的值
                    target[name] = copy;
                }
            }
        }
    }

    // Return the modified object
    return target;
}

export default i18n;
