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
import axios from 'axios';
import BaseEventObject from 'base-event-object';
import cloneDeep from 'lodash/cloneDeep';
import merge from 'lodash/merge';
import set from 'lodash/set';
import get from 'lodash/get';

Vue.use(VueI18n);

class I18n extends VueI18n {
    constructor(options) {
        super(options)
    }

    // 返回对象中相同的语言类型 key
    checkLangType(langType, obj) {
        if (this._config.caseSensitive) {
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
    getLang(key) {
        let langType = this._isReady ? this.locale : '';
        let langDict = this.messages[langType];

        if (key === undefined) {
            return cloneDeep(langDict);
        } else if (langDict) {
            let returnValue;
            if (returnValue = langDict[key]) {
                return returnValue;
            } else if (returnValue = get(langDict, key)) {
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
    setLang(key, value) {
        let langType = this._isReady ? this.locale : '';
        if (!langType) return;

        let langDict;
        if (typeof key === 'object') {
            langDict = key;
        } else {
            langDict = {};
            set(langDict, key, value);
        }

        this.mergeLocaleMessage(langType, langDict);

        return this;
    }

    /**
     * 获取全部语言对象
     * @param  {String} langType  可选。传入语言类型
     * @return {Object}           返回当前语言类型对应的语言对象。如果没有传参，则返回包含所有语言对象的集合。
     */
    getAllLang(langType) {
        return langType === undefined ?
            cloneDeep(this.messages) :
            cloneDeep(this.messages[this.checkLangType(langType, this.messages)]);
    }

    /**
     * 设置全部语言对象
     * @param {String|Object} langType  传入语言类型。如果传入的是对象，则会将该对象与包含所有语言字典对象的集合合并，此时第二个参数 langDict 会被忽略。
     * @param {Object}        langDict  传入语言字典对象。
     */
    setAllLang(langType, langDict) {
        let newLangSet,
            langTypeExsit;

        if (typeof langType === 'object') {
            newLangSet = langType;
        } else if (typeof langType === 'string') {
            newLangSet = {};
            newLangSet[langType] = langDict;
        } else {
            return this;
        }

        for (langType in newLangSet) {
            if (!(langTypeExsit = this.checkLangType(langType, this.messages))) {
                langTypeExsit = langType;
            }
            this.setLocaleMessage(langTypeExsit, Object.assign(this.messages[langTypeExsit], newLangSet[langType]));
        }

        return this;
    }

    /**
     * 获取当前语言类型
     * @return {String} 返回当前语言类型
     */
    getLangType() {
        return this._isReady ? this.locale : '';
    }

    /**
     * 设置当前语言类型（必须应用启动后才可以使用）
     * @param  {String}        langType 需要设置的当前语言类型
     * @return {Promise}                返回一个 Promise 对象。Promise 对象 resolve 时，表示语言设置成功，并会将当前语言类型作为参数传入。
     */
    setLangType(langType) {
        let langTypeExsit;
        if (langTypeExsit = this.checkLangType(langType, this.messages)) {
            langType = langTypeExsit;
        }

        let promise = new Promise((resolve, reject) => {

            if (this._isReady && langType === this.locale) return resolve();

            if (langTypeExsit) {
                this.locale = langType;
                return resolve();

            } else if (langTypeExsit = this.checkLangType(langType, this._config.paths)) {
                let options = merge({}, this._config.http, { url: this._config.paths[langTypeExsit] });

                axios(options)
                    .then(res => {
                        if (res.status === 200) {
                            return res.data;
                        } else {
                            return Promise.reject();
                        }
                    })
                    .then(json => {
                        this.setLocaleMessage(langType, json);
                        this.locale = langType;

                        if (!this._isReady) {
                            this._isReady = true;
                            this.emit('ready', langType);
                        }

                        this.emit('requireLangDone', langType);
                        resolve('requireLangDone');
                    })
                    .catch(err => {
                        this.emit('requireLangFail', langType);
                        reject('requireLangFail');
                    });
            }
        });

        promise.then(() => {
            this.emit('change', langType);
        });

        return promise;
    }

    /**
     * 获取语言转换器
     * @param  {String}   path  传入语言 key 的父级路径
     * @return {Function}       返回一个转换函数，功能和 i18n.t 相同，但不需要再输入父级路径
     */
    getT(path) {
        return (...args) => {
            const key = args.shift();
            args.unshift(path + '.' + key);
            return this.t(...args);
        };
    }

    /**
     * 设置配置对象
     * @param {Object} config 配置对象
     */
    config(config) {
        if (config) merge(this._config, config);
        this.fallbackLocale = this._config.fallbackLocale;
        return this;
    }
}

export function createI18n() {
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

    const i18n = Object.assign(new I18n(), eventObject);

    i18n._config = {
        fallbackLocale: null,

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

    i18n._isReady = false;

    i18n.config({
        http: {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }
    });

    return i18n;
}

export default createI18n()
