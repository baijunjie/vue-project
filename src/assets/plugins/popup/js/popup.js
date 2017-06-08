/*!
 * popup 弹出层插件 v1.1.0
 * (c) 2014-2017 Junjie.Bai
 * MIT Licensed.
 */
(function(root, factory) {
    'use strict';

    if (typeof module === 'object' && typeof exports === 'object') {
        module.exports = factory(require('jquery'));
    } else if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else {
        window.popup = factory(root.jQuery);
    }

}(this, function($) {
    'use strict';

    var $popupLayer,
        $mask,
        $doc = $(document),
        noop = function() {},
        globalOptions = {},
        // eventType = !!navigator.userAgent.match(/mobile/i) ? 'touchend' : 'click',
        eventType = 'click',
        initBeforeLoadCount = 0, // 是否开始 loading，只有该值大于 0 时才会弹出 loading
        popupLayerIsShow = false, // popupLayer 是否显示
        maskIsShow = false, // 遮罩层是否显示
        maskHolder = null, // 当前 mask 持有者的引用
        showList = [], // 显示列表
        alertQueue = [], // alert、confirm 的弹出队列
        loadQueue = [], // loading、done、fail 的弹出队列
        msgQueue = [], // message 的弹出队列
        boxPool = []; // box 对象池

    setGlobalOptions({
        alert: {
            title: '提示',
            text: '', // 文本 内容。
            html: '', // html 内容。
            htmlFrom: null, // 表示 html 的来源容器。
                            // 如果设置了来源容器，那么当弹出框关闭时，会将 html 内容放回来源容器。
            button: ['好'],
            className: '', // 为弹出对话框指定一个专有的类。
            globalClose: true, // 是否允许被全局关闭。
                            // 如果为 false，在使用 popup.colse() 时在没有明确传入 box 的情况下，不会被关闭。
            queue: true, // 是否加入弹出队列，如果为 false，则直接显示。
                        // alert、confirm 共享一个队列。
                        // loading、done、fail 共享一个队列。
                        // message 单独一个队列。
            mask: true, // 是否显示遮罩。
            showClose: false, // 是否显示关闭按钮。
            open: noop, // 打开前执行的回调
            beforeClose: noop, // 关闭前执行的回调
            close: noop, // 关闭后执行的回调
            in: { // 进入动画配置
                start: {
                    'scale': 1.5,
                    'opacity': 0
                },
                end: {
                    'scale': 1,
                    'opacity': 1
                },
                duration: 200,
                easing: ''
            },
            out: { // 移出动画配置
                start: {
                    'opacity': 1
                },
                end: {
                    'opacity': 0
                },
                duration: 200,
                easing: ''
            }
        },

        confirm: {
            title: '提示',
            text: '',
            html: '',
            htmlFrom: null,
            button: ['取消', '确定'],
            className: '',
            globalClose: true,
            queue: true,
            mask: true,
            showClose: false,
            open: noop,
            beforeClose: noop,
            close: noop,
            in: {
                start: {
                    'scale': 1.5,
                    'opacity': 0
                },
                end: {
                    'scale': 1,
                    'opacity': 1
                },
                duration: 200,
                easing: ''
            },
            out: {
                start: {
                    'opacity': 1
                },
                end: {
                    'opacity': 0
                },
                duration: 200,
                easing: ''
            }
        },

        loading: {
            text: '',
            className: '',
            globalClose: true,
            queue: true,
            mask: false,
            cover: false, // 是否遮盖页面。设置 false 后该 box 将不会阻挡鼠标与页面交互。
            open: noop,
            close: noop,
            in: {
                start: {
                    'opacity': 0
                },
                end: {
                    'opacity': 1
                },
                duration: 200,
                easing: ''
            },
            out: {
                start: {
                    'opacity': 1
                },
                end: {
                    'opacity': 0
                },
                duration: 200,
                easing: ''
            }
        },

        done: {
            text: '',
            className: '',
            clickClose: true, // 是否支持点击关闭。
            globalClose: true,
            queue: true,
            mask: false,
            cover: false,
            delay: 1000, // 存在延迟
            open: noop,
            close: noop,
            in: {
                start: {
                    'opacity': 0
                },
                end: {
                    'opacity': 1
                },
                duration: 200,
                easing: ''
            },
            out: {
                start: {
                    'opacity': 1
                },
                end: {
                    'opacity': 0
                },
                duration: 200,
                easing: ''
            }
        },

        fail: {
            text: '',
            className: '',
            clickClose: true,
            globalClose: true,
            queue: true,
            mask: false,
            cover: false,
            delay: 1000,
            open: noop,
            close: noop,
            in: {
                start: {
                    'opacity': 0
                },
                end: {
                    'opacity': 1
                },
                duration: 200,
                easing: ''
            },
            out: {
                start: {
                    'opacity': 1
                },
                end: {
                    'opacity': 0
                },
                duration: 200,
                easing: ''
            }
        },

        message: {
            text: '',
            className: '',
            clickClose: true,
            globalClose: true,
            queue: true,
            mask: false,
            cover: false,
            delay: 2000,
            open: noop,
            close: noop,
            in: {
                start: {
                    'opacity': 0
                },
                end: {
                    'opacity': 1
                },
                duration: 200,
                easing: ''
            },
            out: {
                start: {
                    'opacity': 1
                },
                end: {
                    'opacity': 0
                },
                duration: 200,
                easing: ''
            }
        }
    });

    setGlobalOptions({
        container: {
            template: '<div id="popupLayer"></div>'
        },

        alert: {
            /**
             * 模板必须包含以下标识类
             * popup-header
             * popup-header-text
             * popup-text
             * popup-html
             * popup-button
             * popup-button-text
             * popup-footer
             */
            template: '\
                <div class="popup-box popup-alert">\
                    <div class="popup-header popup-header-text"></div>\
                    <div class="popup-text"></div>\
                    <div class="popup-html"></div>\
                    <div class="popup-footer">\
                        <div class="popup-button">\
                            <span class="popup-button-text"></span>\
                        </div>\
                    </div>\
                    <div class="popup-close"></div>\
                </div>',
            factory: boxFactory
        },

        confirm: {
            /**
             * 模板必须包含以下标识类
             * popup-header
             * popup-header-text
             * popup-text
             * popup-html
             * popup-button
             * popup-button-text
             * popup-footer
             */
            template: '\
                <div class="popup-box popup-confirm">\
                    <div class="popup-header popup-header-text"></div>\
                    <div class="popup-text"></div>\
                    <div class="popup-html"></div>\
                    <div class="popup-footer">\
                        <div class="popup-button popup-button-left">\
                            <span class="popup-button-text"></span>\
                        </div>\
                        <div class="popup-button popup-button-right">\
                            <span class="popup-button-text"></span>\
                        </div>\
                    </div>\
                    <div class="popup-close"></div>\
                </div>',
            factory: boxFactory
        },

        loading: {
            /**
             * 模板必须包含以下标识类
             * popup-text
             */
            template: '\
                <div class="popup-box popup-loading">\
                    <div class="popup-icon"></div>\
                    <div class="popup-text"></div>\
                </div>',
            factory: boxFactory
        },

        done: {
            /**
             * 模板必须包含以下标识类
             * popup-text
             */
            template: '\
                <div class="popup-box popup-done">\
                    <div class="popup-icon"></div>\
                    <div class="popup-text"></div>\
                </div>',
            factory: boxFactory
        },

        fail: {
            /**
             * 模板必须包含以下标识类
             * popup-text
             */
            template: '\
                <div class="popup-box popup-fail">\
                    <div class="popup-icon"></div>\
                    <div class="popup-text"></div>\
                </div>',
            factory: boxFactory
        },

        message: {
            /**
             * 模板必须包含以下标识类
             * popup-text
             */
            template: '\
                <div class="popup-box popup-message">\
                    <div class="popup-text"></div>\
                </div>',
            factory: boxFactory
        }
    });

    /**
     * 默认 box 工厂函数
     * 在创建 Box 模板时执行，会将当前 Box 模板作字符串为参数传入。
     * @param  {String} template 模板作字符串
     * @return {Object}          工厂函数返回值为一个DOM元素，或者jQuery对象
     *                           如果是一个简单对象，则至少包含一个 dom 属性，用于指向模板创建出的 DOM 元素。该对象的其他属性将会被扩展到 Box 的实例对象上。
     */
    function boxFactory(template) {
        return $(template);
    }

    /**
     * 设置全局配置项
     * @param {String|Object} type    类型包含：container、alert、confirm、loading、done、fail、message
     *                                如果是一个对象，会被当做全局配置对象来处理。
     * @param {Object}        options 配置对象
     */
    function setGlobalOptions(type, options) {
        if (typeof type === 'string') {
            setOptions(type, options);
        } else if (typeof type === 'object') {
            options = type;
            for (type in options) {
                setOptions(type, options[type]);
            }
        }
    }

    function setOptions(type, options) {
        if (typeof options === 'object') {

            // 模板变更
            if (!globalOptions[type] || options.template !== globalOptions[type].template) {
                if (type === 'container') {
                    if ($popupLayer) {
                        $popupLayer.off();
                        $popupLayer.remove();
                    }

                    $popupLayer = $(options.template).hide().css({ 'position': 'relative', 'width': 0, 'height': 0 }).appendTo(document.body);
                    $mask = createWrap('popup-mask').css('pointer-events', 'none').hide().appendTo($popupLayer);

                    $popupLayer.on(eventType, '.popup-button', function() { // 确定
                        var $button = $(this),
                            box = $button.closest($popupLayer.children()).data('box');

                        if (box.closed) return;

                        var index = box.$box.find('.popup-button').index($button);

                        if (index >= 0) {
                            eventHandle(index + 1, this, box);
                        }
                    });

                    $popupLayer.on(eventType, '.popup-close', function() { // 关闭
                        var box = $(this).closest($popupLayer.children()).data('box');
                        if (box.closed) return;
                        eventHandle(0, this, box);
                    });
                } else {
                    // 将回收池中对应类型的 box 的 created 状态重置
                    var i = boxPool.length;
                    while (i--) {
                        if (boxPool[i].type === type) boxPool[i].created = false;
                    }
                }
            }
        }

        if (globalOptions[type]) {
            // 如果新配置中含有动画属性，则这里需要将全局配置对象中的先清空
            var props = ['in', 'out'],
                animationProps = ['start', 'end'];

            props.forEach(function(prop) {
                if (options[prop]) {
                    animationProps.forEach(function(animationProp) {
                        if (options[prop][animationProp]) {
                            delete globalOptions[type][prop][animationProp];
                        }
                    });
                }
            });
        }

        globalOptions[type] = $.extend(true, globalOptions[type], options);
    }

    function eventHandle(num, elem, box) {
        if (isFunc(box.options.beforeClose)) {
            box.options.beforeClose.call(box, num, elem, box.close);
        } else {
            box.close();
        }
    }

    function isFunc(func) {
        return typeof func === 'function' && func !== noop
    }

    function createWrap(className) {
        return $('<div>')
            .addClass(className)
            .css({
                'position': 'fixed',
                'left': 0,
                'right': 0,
                'top': 0,
                'bottom': 0,
                'z-index': 0,
                'z': 0
            });
    }

    // 判断对象是否为DOM
    function isDOM(dom) {
        return /^\[object HTML.*\]$/.test(Object.prototype.toString.call(dom));
    }

    // 判断对象是否为jQuery对象
    function isJQ(jq) {
        return jq instanceof $;
    }

    // 点击关闭显示列表中最顶层的一个可被点击关闭的 Box
    function clickClose() {
        var box,
            i = showList.length;
        while (i--) {
            box = showList[i];
            if (!box.closed && box.options.clickClose && box.type.match(/^(done|fail|message)$/)) {
                box.close();
                return;
            }
        }
    }

    // 加入显示列表
    function addShowList(box) {
        box.zIndex = showList.length;
        box.$wrap.css('z-index', box.zIndex);
        showList.push(box);
    }

    // 移出显示列表
    function removeShowList(box) {
        showList.splice(box.zIndex, 1);

        $.each(showList, function(i, box) {
            box.zIndex = i;
            box.$wrap.css('z-index', i);

            // 由于移出显示列表时，removeShowList 在 maskControl 之后执行，因此这里需要重新设置 mask 的 z-index
            if (box === maskHolder) {
                setMaskZIndex(i);
            }
        });
    }

    // 遮罩层控制
    // 传入一个 box
    // 如果该 box 持有 mask，且为打开状态，则将 mask 的 z-index 设为该 box 的 z-index
    // 如果该 box 持有 mask，且为关闭状态，则检查显示列表，在该 box 以下是否还有打开状态的 box 持有 mask，并进行设置
    function maskControl(box) {
        var zIndex,
            options = box.options;

        if (options.mask) {

            if (!box.closed) { // 持有 mask 的 box 进入显示列表时
                zIndex = box.zIndex;
                maskHolder = box;
            } else if (box === maskHolder) { // 持有 mask 的 box 中，最顶层的 box 移出显示列表时
                zIndex = -1;
                var i = box.zIndex;
                while(i--) {
                    box = showList[i];
                    if (!box.closed && box.options.mask) {
                        zIndex = box.zIndex;
                        maskHolder = box;
                        break;
                    }
                }
            }
        }

        if (zIndex === undefined) {
            return;
        } else if (zIndex >= 0) {
            setMaskZIndex(zIndex);

            if (!maskIsShow) {
                maskIsShow = true;
                $mask.stop().fadeIn(options.in.duration);
                curEffect.addMaskEffect();
            }
        } else if (maskIsShow) {
            maskIsShow = false;
            $mask.stop().fadeOut(options.out.duration);
            curEffect.removeMaskEffect();
            maskHolder = null;
        }
    }

    function setMaskZIndex(zIndex) {
        $mask.css('z-index', zIndex);
    }

    function getQueue(type) {
        if (type.match(/^(alert|confirm)$/)) {
            return alertQueue;
        } else if (type.match(/^(loading|done|fail)$/)) {
            return loadQueue;
        } else if (type === 'message') {
            return msgQueue;
        }
    }

    // 获取 loadingBox 在队列中的索引，如果不在队列中则返回 -1。
    function getLoadingBoxIndex(loadingBox) {
        var index = -1;

        if (loadingBox) {
            if (loadingBox.type === 'loading' && loadingBox.queue) {
                index = loadingBox.queue.indexOf(loadingBox);
            }
        } else {
            $.each(loadQueue, function(i, box) {
                if (box.type === 'loading') {
                    index = i;
                    return false;
                }
            });
        }

        return index;
    }

    function getBox(type, content, beforeClose) {
        var options = $.extend(true, {}, globalOptions[type]);
        delete options.open;
        delete options.close;

        if ($.isPlainObject(content)) {
            $.extend(true, options, content);
        } else if (content !== undefined) {
            options.text = content + '';
        }

        if (typeof beforeClose === 'function') {
            options.beforeClose = beforeClose;
        }

        if (typeof options.button === 'string') {
            options.button = $.map(options.button.split(','), function(n) {
                return $.trim(n);
            });
        }

        var box, b,
            i = boxPool.length;

        while (i--) {
            b = boxPool[i];
            if (b.type === type) {
                box = b;
                box.options = options;
                box.recycled = false;
                boxPool.splice(i, 1);
                break;
            }
        }

        if (!box) {
            box = new Box(type, options);
        }

        return box;
    }

    function Box(type, options) {
        this.type = type;
        this.options = options;

        // 确保无论函数持有者是谁，调用都不会出错
        for (var p in this) {
            if (typeof this[p] === 'function') {
                this[p] = $.proxy(this, p);
            }
        }
    }

    Box.prototype = {

        /**
         * 初始化
         * @param  {Number} index 可选。一个队列索引。如果当前 box 需要进入队列，那么将当前 box 放置在队列中该索引位置。
         */
        _init: function(index) {
            if (this.inited || this.recycled) return;
            this.inited = true;

            if (this.options.queue) {
                this.queue = getQueue(this.type);
            }

            if (!this.queue || !this.queue.length) {
                this._open();
            }

            if (this.queue) {
                if (index >= 0) {
                    this.queue.splice(index, 0, this);
                } else {
                    this.queue.push(this);
                }
            }
        },

        _create: function() {
            if (this.created || this.recycled) return;
            this.created = true;

            var $box,
                options = this.options,
                $wrap = createWrap('popup-wrap'),
                boxOrigin = options.factory(options.template);

            if (isJQ(boxOrigin)) {
                $box = boxOrigin;
            } else if (isDOM(boxOrigin)) {
                $box = $(boxOrigin);
            } else {
                $box = $(boxOrigin.dom);
                $.extend(this, boxOrigin);
            }

            $box.hide().appendTo($wrap);

            this.$container = $popupLayer;
            this.$wrap = $wrap;
            this.$box = $box;
        },

        _dataFill: function() {
            if (this.dataFilled || this.recycled) return;
            this.dataFilled = true;

            var type = this.type,
                options = this.options,
                $wrap = this.$wrap,
                $box = this.$box;

            $wrap.data('box', this);

            if (options.className) {
                $box.addClass(options.className);
            }

            var $boxText = $box.find('.popup-text');
            if (options.text) $boxText.html(options.text).show();
            else $boxText.hide();

            if (type.match(/^(alert|confirm)$/)) {

                var $boxClose = $box.find('.popup-close'),
                    $boxHeader = $box.find('.popup-header'),
                    $boxHtml = $box.find('.popup-html'),
                    $boxFooter = $box.find('.popup-footer');

                if (options.showClose) $boxClose.show();
                else $boxClose.hide();

                if (options.html) $boxHtml.html(options.html).show();
                else $boxHtml.hide();

                if (options.title) {
                    $box.find('.popup-header-text').html(options.title);
                    $boxHeader.show();
                } else {
                    $boxHeader.hide();
                }

                if (options.button) {
                    $box.find('.popup-button').each(function(i, elem) {
                        $('.popup-button-text', elem).html(options.button[i]);
                    });
                    $boxFooter.show();
                } else {
                    $boxFooter.hide();
                }
            }
        },

        _open: function() {
            if (this.opened || this.recycled) return;
            this.opened = true;

            if (!popupLayerIsShow) {
                popupLayerIsShow = true;
                $popupLayer.show();
                $doc.on(eventType, clickClose);
            }

            this._create();
            this._dataFill();

            var self = this,
                type = this.type,
                gOptions = globalOptions[type],
                options = this.options,
                queue = this.queue;

            if (!options.cover && type.match(/^(loading|done|fail|message)$/)) {
                this.$wrap.css('pointer-events', 'none');
            } else {
                document.activeElement && document.activeElement.blur();
            }

            addShowList(this);
            maskControl(this);
            this.$wrap.appendTo($popupLayer);
            this.$box.css('z', 0).css(options.in.start).show();

            try {
                if (isFunc(gOptions.open)) {
                    gOptions.open.call(this);
                }
                if (isFunc(options.open)) {
                    options.open.call(this);
                }
            } catch(err) {
                throw err;
            }

            this.$box.animate(options.in.end, options.in.duration, options.in.easing, function() {
                if (type.match(/^(done|fail|message)$/)) {
                    self.$box.delay(options.delay).queue(function(next) {
                        next();
                        self._close();
                    });
                }
            });

            if (queue && queue.lastBox) {
                queue.lastBox.$box.finish();
            }
        },

        _close: function() {
            if (this.closed || this.recycled) return;
            this.closed = true;

            maskControl(this);

            var self = this,
                options = this.options,
                queue = this.queue;

            if (queue) {
                queue.shift();
                if (queue.length) {
                    this._remove();
                    queue[0]._open();
                    return;
                }
                queue.lastBox = this;
            }

            this.$box
                .stop().stop()
                .css('pointer-events', 'none')
                .css(options.out.start)
                .animate(options.out.end, options.out.duration, options.out.easing, function() {
                    if (queue && queue.lastBox) {
                        queue.lastBox = null;
                    }
                    self._remove();
                });
        },

        _remove: function() {
            if (this.removed || this.recycled) return;
            this.removed = true;

            var gOptions = globalOptions[this.type],
                options = this.options;

            // 将回调中执行的错误报出，而非在回调的调用行报出错误
            try {
                if (isFunc(gOptions.close)) {
                    gOptions.close.call(this);
                }
                if (isFunc(options.close)) {
                    options.close.call(this);
                }
            } catch(err) {
                throw err;
            }

            if (options.htmlFrom && (isDOM(options.html) || isJQ(options.html))) {
                $(options.htmlFrom).append(options.html);
            }

            removeShowList(this);

            this.$wrap.remove();
            this.$wrap.css('pointer-events', '');
            this.$box.attr('style', '');
            if (options.className) {
                this.$box.removeClass(options.className);
            }

            this._recycle();

            if (!showList.length && !alertQueue.length && !loadQueue.length && !msgQueue.length) {
                popupLayerIsShow = false;
                $popupLayer.hide();
                $doc.off(eventType, clickClose);
            }
        },

        _recycle: function() {
            if (this.recycled) return;
            this.recycled = true;

            this.inited = false;
            this.opened = false;
            this.dataFilled = false;
            this.opened = false;
            this.closed = false;
            this.removed = false;
            this.queue = null;

            boxPool.push(this);
        },

        close: function() {
            if (this.closed || this.recycled) return;
            if (this.opened) {
                this._close();
            } else {
                if (this.queue) this.queue.splice(this.queue.indexOf(this), 1);
                this._recycle();
            }
        }
    }

    /**
     * 关闭 box
     * 如果指定一个 box 对象，则直接关闭该 box。
     * 如果指定一个类型，则优先关闭队列中最靠近尾部的同类型 box，否则关闭显示列表最靠近顶层的同类型 box。
     * 如果没有传参，则关闭全部的 box。但是不会关闭 globalClose 为 false 的 box。
     * @param  {Box|String} box 可选。一个 box 对象，或者 box 类型。
     */
    function close(box) {
        if (box instanceof Box) {
            box.close();
            return;
        }

        var i,
            type = box;

        if (!type) {
            initBeforeLoadCount = 0;

            $.each([alertQueue, loadQueue, msgQueue], function(index, queue) {
                i = queue.length;
                while (i--) {
                    box = queue[i];
                    if (box.options.globalClose) {
                        box.close();
                    }
                }
            });

            i = showList.length;
            while (i--) {
                box = showList[i];
                if (box.options.globalClose) {
                    box.close();
                }
            }

            return;
        }

        // 如果是 loading，首先检查是否有未初始化的 loading，如果有，直接关闭一个
        if (type === 'loading' && initBeforeLoadCount > 0) {
            initBeforeLoadCount--;
            return;
        }

        var queue = getQueue(type);

        // 检查弹出队列中是否存在，优先关闭队列末尾的同类型 box
        i = loadQueue.length;
        while (i--) {
            box = loadQueue[i];
            if (box.type === type && box.options.globalClose) {
                box.close();
                return;
            }
        }

        // 检查显示队列中是否存在，优先关闭显示列表中顶层的同类型 box
        i = showList.length;
        while (i--) {
            box = showList[i];
            if (!box.closed && box.type === type && box.options.globalClose) {
                box.close();
                return;
            }
        }
    }

    /**
     * alert 提示框
     * @param  {String|Object} content     文本内容，或者一个配置对象
     * @param  {Function}      beforeClose 可选。点击所有按钮后的回调。如果设置将会覆盖到配置对象的 beforeClose。
     * @return {Box}                       返回当前 box 对象，可以使用 box.close() 关闭当前 box。
     */
    function alert(content, beforeClose) {
        var box = getBox('alert', content, beforeClose);
        box._init();
        return box;
    }

    /**
     * confirm 选择框
     * @param  {String|Object} content     文本内容，或者一个配置对象
     * @param  {Function}      beforeClose 可选。点击所有按钮后的回调。如果设置将会覆盖到配置对象的 beforeClose。
     * @return {Box}                       返回当前 box 对象，可以使用 box.close() 关闭当前 box。
     */
    function confirm(content, beforeClose) {
        var box = getBox('confirm', content, beforeClose);
        box._init();
        return box;
    }

    /**
     * loading 开启
     * @param  {String|Object} content 文本内容，或者一个配置对象
     * @return {Box}                   返回当前 box 对象，可以使用 box.close() 关闭当前 box。
     */
    function loading(content) {
        var box = getBox('loading', content);

        initBeforeLoadCount++;
        // 如果在同一帧执行关闭 loading 的操作，则不显示 loading
        setTimeout(function() {
            if (initBeforeLoadCount > 0) {
                initBeforeLoadCount--;
                box._init();
            }
        });

        return box;
    }

    /**
     * loading 结束
     * @param  {Box} loadingBox 可选，一个 loading 类型的 box 对象，表示关闭该 loading。
     */
    function loaded(loadingBox) {
        if (loadingBox && loadingBox.type === 'loading') {
            loadingBox.close();
        } else {
            close('loading');
        }
    }

    /**
     * loading 完成
     * @param  {Box}           loadingBox 可选。一个 loading 类型的 box 对象，表示关闭该 loading。也可以直接传入 content，代表第二个参数。
     * @param  {String|Object} content    可选。文本内容，或者一个配置对象。
     * @return {Box}                      返回当前 box 对象，可以使用 box.close() 关闭当前 box。
     */
    function done(loadingBox, content) {
        if (!(loadingBox instanceof Box)) {
            content = loadingBox;
            loadingBox = undefined;
        }

        var box = getBox('done', content);
        // 异步调用时为了防止可被点击关闭的 Box 刚被打开时，又被冒泡到根节点的点击事件关闭。
        setTimeout(function() {
            var index = getLoadingBoxIndex(loadingBox);

            if (index < 0) {
                index = undefined;
            } else {
                index++;
            }

            box._init(index);
            loaded(loadingBox);
        });

        return box;
    }

    /**
     * loading 失败
     * @param  {Box}           loadingBox 可选，一个 loading 类型的 box 对象，表示关闭该 loading。也可以直接传入 content，代表第二个参数。
     * @param  {String|Object} content    可选，文本内容，或者一个配置对象。
     * @return {Box}                      返回当前 box 对象，可以使用 box.close() 关闭当前 box。
     */
    function fail(loadingBox, content) {
        if (!(loadingBox instanceof Box)) {
            content = loadingBox;
            loadingBox = undefined;
        }

        var box = getBox('fail', content);
        // 异步调用时为了防止可被点击关闭的 Box 刚被打开时，又被冒泡到根节点的点击事件关闭。
        setTimeout(function() {
            var index = getLoadingBoxIndex(loadingBox);

            if (index < 0) {
                index = undefined;
            } else {
                index++;
            }

            box._init(index);
            loaded(loadingBox);
        });

        return box;
    }

    /**
     * message 消息
     * @param  {String|Object} content 文本内容，或者一个配置对象。
     * @return {Box}                   返回当前 box 对象，可以使用 box.close() 关闭当前 box。
     */
    function message(content) {
        var box = getBox('message', content);
        // 异步调用时为了防止可被点击关闭的 Box 刚被打开时，又被冒泡到根节点的点击事件关闭。
        setTimeout(box._init);
        return box;
    }

    /**
     * 通过 popup 调用各种类型的弹出组件
     * @param  {Object} options 必须指明 type 属性，表示一个弹出组件类型
     * @return {Box}            返回当前 box 对象，可以使用 box.close() 关闭当前 box。
     */
    function popup(options) {
        return popup[options.type](options);
    }

    var effect = {
        // 正常效果
        'NORMAL': function() {
            return {
                addMaskEffect: noop,
                removeMaskEffect: noop,
                destroy: noop
            }
        },

        // 模糊效果
        'BLUR': function() {
            var $style = $('<style>')
                .text('\
                    body > :not(#popupLayer) {\
                        -webkit-filter: blur(4px);\
                    }\
                ');
            return {
                addMaskEffect: function() {
                    $style.appendTo(document.head);
                },
                removeMaskEffect: function() {
                    $style.detach();
                },
                destroy: function() {
                    $style.remove();
                    $style = null;
                }
            }
        }
    }

    setMaskEffect('NORMAL');

    var curEffect;
    function setMaskEffect(effectType) {
        if (!effect[effectType]) return;
        if (curEffect) curEffect.destroy();
        curEffect = effect[effectType]();
    }

    return $.extend(popup, {
        alert: alert,
        confirm: confirm,
        loading: loading,
        loaded: loaded,
        done: done,
        fail: fail,
        message: message,

        setGlobalOptions: setGlobalOptions,

        setMaskEffect: setMaskEffect,
        effect: effect,

        close: close
    });

}));