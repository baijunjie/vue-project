import Vue from 'vue';

/**
 * json 请求的 AJAX 封装
 * @param  {String|Object}                url  请求地址，或者是 AJAX 配置对象
 * @param  {String|Array|Object|Function} data 请求中携带的参数。如果是 Function 则表示请求成功的回调。
 * @param  {Function}                     func 请求成功回调
 * @return {jqXHR} 返回 jQuery 的 AJAX 延迟对象
 */
export function ajax(url, data, func) {
	var options;

	if ($.isPlainObject(url)) {
		options = url;
	} else {
		options = { url: url };
	}

    if ($.isFunction(data)) {
        options.success = data;
    } else if (data) {
        options.data = data;

        if ($.isFunction(func)) {
            options.success = func;
        }
    }

	options = $.extend({
		method: 'GET',
		dataType: 'json',
		contentType: 'application/json; charset=UTF-8',
		xhrFields: {
			withCredentials: true
		}
	}, options);

    if (options.method.match(/post|put|patch/i)) {
        try {
            options.data = JSON.stringify(options.data);
        } catch(err) {}
    }

	return $.ajax(options);
}

export function http(url, data, func) {
	var options;

	if ($.isPlainObject(url)) {
		options = url;
	} else {
		options = { url: url };
	}

    if ($.isFunction(data)) {
        options.success = data;
    } else if (data) {
        options.data = data;

        if ($.isFunction(func)) {
            options.success = func;
        }
    }

	if (!options.method && options.type) {
		options.method = options.type;
	}

	options = $.extend({
		method: 'GET',
		responseType: 'json',
		emulateJson: true,
		credentials: true
	}, options);

	if (options.method.match(/get/i)) {
		options.params = options.data;
	} else if (options.method.match(/post|put|patch/i)) {
		options.body = options.data;
	}

	return Vue.http(options).then(function(res) {
		options.success && options.success.call(this, res.data);
		return res.data;
	}).catch(function(e) {
		options.error && options.error.call(this, e.body);
		return e.body;
	});
}

// 强大 jQuery 对象扩展
export function extend() {
	var options, name, src, copy, copyIsArray,
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
                    ((copyIsArray = toString.call(copy) === '[object Array]') ||
                    (toString.call(copy) === '[object Object]'))) {

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


// 让隐藏DOM能够正确执行代码
const defaultDisplayMap = {};
export function hideAction(elems, func, target) {
	if (typeof elems !== 'object') {
		elems = [];
	}

	if (typeof elems.length === 'undefined') {
		elems = [elems];
	}

	var hideElems = [],
		hideElemsDisplay = [];

	for (var i = 0, elem; elem = elems[i++];) {

		while (elem instanceof HTMLElement) {

			var nodeName = elem.nodeName;

			if (!elem.getClientRects().length) {
				hideElems.push(elem);
				hideElemsDisplay.push(elem.style.display);

				var display = defaultDisplayMap[nodeName];
				if (!display) {
					var temp = document.createElement(nodeName);
					document.body.appendChild(temp);
					display = window.getComputedStyle(temp).display;
					temp.parentNode.removeChild(temp);

					if (display === 'none') display = 'block';
					defaultDisplayMap[nodeName] = display;
				}

				elem.style.display = display;
			}

			if (nodeName === 'BODY') break;
			elem = elem.parentNode;
		}
	}

	if (typeof(func) === 'function') func.call(target || this);

	var l = hideElems.length;
	while (l--) {
		hideElems.pop().style.display = hideElemsDisplay.pop();
	}
}

// 从数组中找到 key 值与 value 相同的对象，并返回
export function findSameValueOfObjectFromArray(arr, key, value) {
	let findItem;
	arr.some(item => {
		if (item[key] === value) {
			findItem = item;
			return true;
		}
	});
	return findItem;
}

// 将字符串替换为 <br/>
export function textWrapToHtml(text) {
    return typeof text === 'string' ? text.replace(/\n|\r/g, '<br/>') : '';
}

// 退出登录
export function logout() {
    removeStorage('userData');
    location.reload();
}

// 获取本地存储数据
export function getStorage(key) {
    let value = localStorage.getItem(key);
    try {
        value = JSON.parse(value);
    } catch(err) {}
    return value;
}
// 本地存储数据
export function setStorage(key, vlaue) {
    if (typeof vlaue === 'object') {
        vlaue = JSON.stringify(vlaue);
    }
    return localStorage.setItem(key, vlaue);
}
// 移除本地存储数据
export function removeStorage(key) {
    return localStorage.removeItem(key);
}

// Session timeout validate
export function sessionTimeoutValidate(key) {
    let validTime = 8.64e7;

    let data = getStorage(key);
    if (data &&
        data.createDate &&
        data.createDate + validTime > Date.now() ) {
        return data;
    } else {
        removeStorage(key);
        return null;
    }
}

// 打印log (用于过滤 vue 生成的 getter、setter)
export function log() {
	let args = [];
	Array.prototype.forEach.call(arguments, arg => {
		if (typeof arg === 'object') {
			args.push(extend(true, {}, arg));
		} else {
			args.push(arg);
		}
	});
	console.log.apply(console, args);
}

import ajaxRequire from 'ajax-require';
export { ajaxRequire };
