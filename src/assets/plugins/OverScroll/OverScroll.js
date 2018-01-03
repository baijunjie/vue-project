(function(root, factory) {
    'use strict';

    if (typeof module === 'object' && typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        root.OverScroll = factory();
    }

}(this, function() {
    'use strict';

    /**
     * 屏蔽页面整体的 Scroll，同时不影响其它子元素的 Scroll。
     * @param scroller {DOM|selector} DOM元素或者CSS选择器
     */
    function OverScroll(scroller) {
        if (!(this instanceof OverScroll)) {
            return new OverScroll(scroller);
        }

        this._init(scroller);
    }

    extend(OverScroll.prototype, {
        constructor: OverScroll,

        _init: function(scroller) {
            if (typeof scroller === 'string') {
                scroller = document.querySelectorAll(scroller);
            }

            if (typeof scroller === 'object' && scroller.length) {
                Array.prototype.forEach.call(scroller, function(el) {
                    arr.push(el);
                });
                this._scroller = arr;
            } else if (isDOM(scroller)) {
                this._scroller = [scroller];
            } else {
                throw new Error('scroller is not a HTML element!');
            }

            this._initProxy();
            this._addEvent();

            return this;
        },

        _addEvent: function() {
            var self = this;
            this._scroller.forEach(function(el) {
                el.addEventListener('touchstart', self._touchStart);
                el.addEventListener('touchmove', self._touchMove);
            });
            // 屏蔽页面的 touchmove 事件
            document.addEventListener('touchmove', self._docTouchMove);
        },

        _removeEvent: function() {
            var self = this;
            this._scroller.forEach(function(el) {
                el.removeEventListener('touchstart', self._touchStart);
                el.removeEventListener('touchmove', self._touchMove);
            });
            document.removeEventListener('touchmove', self._docTouchMove);
        },

        _touchStart: function(event) {
            var el = event.currentTarget,
                top = el.scrollTop,
                totalScroll = el.scrollHeight,
                currentScroll = top + el.offsetHeight;
            if (top === 0) {
                el.scrollTop = 1;
            } else if (currentScroll === totalScroll) {
                el.scrollTop = top - 1;
            }
        },

        _touchMove: function(event) {
            var scroll = isScroll(event.currentTarget);
            if (scroll.y) event._isScroller = true;
        },

        _docTouchMove: function(event){
            if(!event._isScroller) event.preventDefault();
        },

        // 确保无论函数持有者是谁，调用都不会出错
        _initProxy: function() {
            for (var p in this) {
                if (isFunction(this[p])) {
                    this[p] = proxy(this, p);
                }
            }
        },

        destroy: function() {
            this._removeEvent();

            // 清除所有属性
            for (var p in this) {
                delete this[p];
            }

            this.__proto__ = Object.prototype;
        }
    });

    function extend() {
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

    // 使用方法一：
    // 第一个参数为调用的方法
    // 第二个参数为该方法调用时 this 的引用对象，如果传入 null，则不会改变 this 的引用
    // 使用方法二：
    // 第一个参数为调用方法时 this 的引用对象，如果传入 null，则不会改变 this 的引用
    // 第二个参数为将要调用 this 引用对象的方法的名称字符串
    // 以上两种用法从第三个参数开始可以为调用函数传入若干个参数
    // 如果该函数本身就有默认参数，比如 .each() 方法会给函数传入两个参数，分别为索引号和对应的对象，那么通过代理设置的参数会插在原函数的参数前
    var guid = 0;
    function proxy(func, target) {
        if (typeof target === 'string') {
            var tmp = func[target];
            target = func;
            func = tmp;
        }

        if (typeof func !== 'function') {
            return undefined;
        }

        var slice = Array.prototype.slice,
            args = slice.call(arguments, 2),
            proxy = function() {
                return func.apply(target || this, args.concat(slice.call(arguments)));
            };

        proxy.guid = func.guid = func.guid || guid++;

        return proxy;
    }

    // 判断是否为函数
    function isFunction(func) {
        return typeof func === 'function';
    }

    // 判断对象是否为DOM
    function isDOM(dom) {
        return /^\[object HTML.*\]$/.test(Object.prototype.toString.call(dom));
    }

    // 判断元素是否含有滚动条
    function isScroll(el) {
        var overflow_x = getStyle(el, 'overflow-x'),
            overflow_y = getStyle(el, 'overflow-y');
        return {
            x: !!((el.offsetWidth < el.scrollWidth) && (overflow_x == 'auto' || overflow_x == 'scroll')),
            y: !!((el.offsetHeight < el.scrollHeight) && (overflow_y == 'auto' || overflow_y == 'scroll'))
        };
    }

    // 获取元素样式
    function getStyle(elem, pro) {
        elem = ('string' === typeof elem) ? document.getElementById(elem) : elem;
        if (!elem) return null;
        if (elem.style[pro]) { //内联
            return elem.style[pro];
        } else if (elem.currentStyle) { //IE
            return elem.currentStyle[pro];
        } else if (window.getComputedStyle) { //W3C标准
            var s = window.getComputedStyle(elem, null);
            return s[pro];
        } else if (document.defaultView && document.defaultView.getComputedStyle) { //FF,CHROME等
            pro = pro.replace(/([A-Z])/g, '-$1'); //如marginLeft转为margin-Left
            pro = pro.toLowerCase(); //再转为小写margin-left
            var s = document.defaultView.getComputedStyle(elem, '');
            return s && s.getPropertyValue(pro);
        } else return null;
    }

    return OverScroll;
}));
