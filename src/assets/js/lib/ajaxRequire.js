(function(root, factory) {
	'use strict';

	if (typeof module === 'object' && typeof exports === 'object') {
		module.exports = factory(require('jquery'));
	} else if (typeof define === 'function' && define.amd) {
		define(['jquery'], factory);
	} else {
		root.bjj = root.bjj || {};
		root.bjj.ajaxRequire = factory(root.jQuery);
	}

}(this, function($) {
	'use strict';

	var ajax,
		returnValueSet = {}, // 以请求的 url 为 key, 缓存所有请求返回值的集合
		checkRequireDataSet = {}; // 以请求的 url 为 key, 值为所有依赖该 url 的请求在进行 checkRequireArray 时所需的变量集合所组成的数组

	/**
	 * ajax 请求队列
	 * @param  {String | Object | Array} reqArr         所有请求的 url 组成的数组。
	 *                                                  如果是单个请求，可直接传入 url 字符串。
	 *                                                  如果请求需要配置具体的 ajax 参数，则传入一个配置对象。对象参数详见 jQuery.ajax() 的参数文档。
	 *                                                  如果是多个请求，则传入这些请求 url 字符串或者 ajax 配置对象所组成的数组。
	 * @param  {Function}                callback       所有 Ajax 请求就绪后的回调
	 * @param  {Function}                errorCallback  Ajax 请求失败后的回调，会将 url 作为参数传入。如果该参数传入一个对象，则会被视为 globalParams。
	 * @param  {Object}                  globalParams   全局 Ajax 配置参数，默认应用在该次调用的所有 ajax 请求上，但会被每个 ajax 请求单独配置的参数覆盖。
	 */
	function ajaxRequire(reqArr, callback, errorCallback, globalParams) {
		if (!$.isArray(reqArr)) {
			reqArr = [reqArr];
		}

		if ($.isPlainObject(errorCallback)) {
			globalParams = errorCallback;
			errorCallback = null;
		}

		var returnValueArr = [],
			def = new $.Deferred();

		$.each(reqArr, function(i, url) {
			var params = $.extend({}, globalParams);

			if ($.isPlainObject(url)) {
				$.extend(params, url);
			} else {
				params.url = url;
			}

			url = composeUrl(params.url, params.data);

			if (params.cache !== false && returnValueSet[url]) {
				returnValueArr[i] = returnValueSet[url];
				delete reqArr[i];
				checkRequireArray(reqArr, returnValueArr, callback, def);
				return;
			}

			var checkRequireData = {
				index: i,
				reqArr: reqArr,
				returnValueArr: returnValueArr,
				callback: callback,
				errorCallback: errorCallback
			};

			if ($.isArray(checkRequireDataSet[url])) {
				// 检查请求集合中存在该 url，表示已经发出 ajax 请求
				// 这里只将需要检查的请求数据加入到集合中，然后返回
				checkRequireDataSet[url].push(checkRequireData);
				return;
			} else {
				// 检查请求集合中不存在该 url，表示还未发出 ajax 请求
				// 这里将需要检查的请求数据加入到集合中，然后开始 ajax 请求
				checkRequireDataSet[url] = [checkRequireData];
			}

			ajax(params, function(returnValue) {
				returnValueSet[url] = returnValue;

				$.each(checkRequireDataSet[url], function(i, data) {
					var index = data.index,
						reqArr = data.reqArr,
						returnValueArr = data.returnValueArr,
						callback = data.callback;

					returnValueArr[index] = returnValue;
					delete reqArr[index];

					checkRequireArray(reqArr, returnValueArr, callback, def);
				});

				delete checkRequireDataSet[url];
				return returnValue; // 传递给下一个then
			}, function() {
				$.each(checkRequireDataSet[url], function(i, data) {
					var errorCallback = data.errorCallback;
					errorCallback && errorCallback(url);
				});

				def.reject();
				delete checkRequireDataSet[url];
				throw new Error('"' + url + '" load fail!');
			});
		});

		return def;
	}

	// 用于修改 ajax 使用的方法
	ajaxRequire.ajax = function(func) {
		ajax = func;
	};

	function checkRequireArray(reqArr, returnValueArr, callback, def) {
		if ($.isEmptyObject(reqArr)) {
			callback.apply(null, returnValueArr);
			def.resolve.apply(null, returnValueArr);
		}
	}

	/**
	 * 将参数对象拼装进 url
	 * @param  {String} url   需要拼装的 url
	 * @param  {Object} param 参数对象
	 * @return {String}       返回拼装好的新 url
	 */
	function composeUrl(url, param) {
		if (typeof param !== 'object') return url;

		var paramArr = [];
		for (var key in param) {
			paramArr.push({
				'key': key,
				'value': param[key]
			});
		}

		// 根据 key 进行排序
		paramArr.sort(function(a, b) {
			var av = a['key'],
				bv = b['key'];
			return av.localeCompare(bv);
		});

		var paramStr = '';
		for (var i = 0, p; p = paramArr[i++];) {
			paramStr += '&' + p['key'] + '=' + p['value'];
		}

		if (url.indexOf('?') >= 0) {
			var lastChar = url.charAt(url.length - 1);
			if (lastChar === '&' || lastChar === '?') paramStr = paramStr.substr(1);
		} else {
			paramStr = '?' + paramStr.substr(1);
		}

		return url + paramStr;
	}


	// 默认使用 jQuery.ajax
	ajaxRequire.ajax(function(params, done, fail) {
		params = $.extend(params, {
			type: 'GET',
			dataType : 'json'
		});
		$.ajax(params).done(done).fail(fail);
	});

	return ajaxRequire;
}));