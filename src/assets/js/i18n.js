/**
 * Vue 国际化 v0.3.1
 * @author Junjie.Bai
 *
 * i18n  返回一个 VueI18n 的实例对象，扩展了几个方法。
 *
 * 方法：
 * - getLang          获取当前语言。
 * - setLang          设置当前语言。
 * - getAllLang       获取全部语言对象。
 * - setAllLang       设置全部语言对象。
 * - getLangType      获取当前语言类型。
 * - setLangType      设置当前语言类型。
 * - getT             获取语言转换器。
 * - config           设置配置对象。
 * - on               注册事件监听。
 * - off              移除事件监听。
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

import BaseEventObject from 'base-event-object';

const eventObject = new BaseEventObject({
    events: [
        'requireLangDone', // 请求一种语言完成时的回调
        'requireLangFail', // 请求一种语言失败时的回调
        'change' // 语言变更时的回调
    ],
    onceEvents: [
        'ready' // 第一种语言准备好时的回调
    ]
});

const i18n = extend(new VueI18n(), {
    getLang,
    setLang,
    getAllLang,
    setAllLang,
    getLangType,
    setLangType,
    getT,
    config,
    ...eventObject
});

const cfg = {
    // paths 语言包路径配置对象
    // {
    //     'zh-CN': 'language/zh-CN.json'
    // }
    paths: {},

    // 设置 http 请求的默认配置选项。
    http: {},

    // 语言类型是否大小写敏感
    caseSensitive: false
};

let isReady = false;

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
    } else {
        let reg = new RegExp('^' + langType + '$', 'i');
        for (langType in obj) {
            if (reg.test(langType)) {
                return langType;
            }
        }
        return false;
    }
}

/**
 * 获取当前语言
 * @param  {String}        key  可选。传入语言 key
 * @return {String|Object}      返回当前语言类型下 key 的对应值。如果没有传参，则返回当前语言字典对象。
 */
function getLang(key) {
    let langType = isReady ? i18n.locale : '';
    let langDict = i18n.messages[langType];

    if (key === undefined) {
        return extend(true, {}, langDict);
    } else if (langDict) {
        let returnValue;
        if (returnValue = langDict[key]) {
            return returnValue;
        } else if (returnValue = getValue(langDict, key)) {
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
    let langType = isReady ? i18n.locale : '';
    if (!langType) return;

    let langDict;
    if (typeof key === 'object') {
        langDict = key;
    } else {
        langDict = {};
        setValue(langDict, key, value);
    }

    i18n.setLocaleMessage(langType, extend(true, i18n.messages[langType], langDict));

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
        i18n.setLocaleMessage(langTypeExsit, extend(i18n.messages[langTypeExsit], newLangSet[langType]));
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

        if (langTypeExsit) {
            i18n.locale = langType;
            return resolve();

        } else if (langTypeExsit = checkLangType(langType, cfg.paths)) {
            let options = extend(true, {}, cfg.http, { url: cfg.paths[langTypeExsit] });

            Vue.http(options)
                .then(function(res) {
                    if (res.status === 200) {
                        return res.json();
                    } else {
                        i18n.emit('requireLangFail', langType);
                        reject('requireLangFail');
                    }
                })
                .then(function(json) {
                    i18n.setLocaleMessage(langType, json);
                    i18n.locale = langType;

                    if (!isReady) {
                        isReady = true;
                        i18n.emit('ready', langType);
                    }

                    i18n.emit('requireLangDone', langType);
                    resolve('requireLangDone');
                })
                .catch(function(error) {
                    i18n.emit('requireLangFail', langType);
                    reject('requireLangFail');
                });
        }
    });

    promise.then(function() {
        i18n.emit('change', langType);
    });

    return promise;
}

/**
 * 获取语言转换器
 * @param  {String}   path  传入语言 key 的父级路径
 * @return {Function}       返回一个转换函数，功能和 i18n.t 相同，但不需要再输入父级路径
 */
function getT(path) {
    return function(key) {
        let args = Array.prototype.splice.call(arguments, 1);
        args.unshift(path + '.' + key);
        return i18n.t.apply(i18n, args);
    };
}

/**
 * 设置配置对象
 * @param {Object} config 配置对象
 */
function config(config) {
    if (config) extend(true, cfg, config);
    return i18n;
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

// 设置对象的值
// 例如：
//   setValue(obj, 'a.b.c', 100) => obj.a.b.c === 100
//   setValue(obj, '', { a: 100 }) => obj.a === 100
function setValue(obj, key, value) {
    if (!key) {
        if (typeof value === 'object') {
            $.extend(obj, value);
        }
        return;
    }

    var reg = /(\[[^\.]*)(\.+)([^\.]*\])/g, // 匹配 a.b['a.b'] 中的 ['a.b']
        reg2 = /(.+)\[(.+)\]/, // 匹配 a[b] 中的 a 和 b
        reg3 = /^['"](.+)['"]$/; // 匹配 'b' 中的 b

    key = key.replace(reg, function(x, $1, $2, $3) {
        return $1 + $2.replace(/\./g, '\n') + $3;
    });

    var lastObj = obj,
        arr = key.split('.');

    for (var i = 0, l = arr.length, n; n = arr[i++];) {
        n = n.replace(/\n/g, '.');
        var res = reg2.exec(n),
            prop = res ? res[1] : n;

        if (res) {
            var sub = res[2],
                res2 = reg3.exec(sub),
                sub = res2 ? res2[1] : sub,
                isArr = !res2 && sub == parseInt(sub);

            lastObj = lastObj[prop] = lastObj[prop] || (isArr ? [] : {});
            prop = sub;
        }

        if (i === l) {
            lastObj[prop] = value;
        } else {
            lastObj = lastObj[prop] = lastObj[prop] || {};
        }
    }
}

// 获取对象的值
// 例如：
//   getValue(obj, 'a.b.c') => 100
//   getValue(obj, '') => undefined
function getValue(obj, key) {
    if (!key) return undefined;
    try {
        return eval('obj' + (key.indexOf('[') === 0 ? '' : '.') + key);
    } catch(err) {
        return undefined;
    }
}

export default i18n;
