/*!
 * neui v1.0.0 (https://neui.nelabs.cn/)
 * Copyright 2018 ethan.gor
 * Licensed under the MIT license
 */

"use strict";(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

/****************************************************************** 
 * @dom
 * Description:dom操作辅助
 *******************************************************************/
var dom = require('./lib/dom');
module.exports=dom;
},{"./lib/dom":2}],2:[function(require,module,exports){

/********************* define *********************/
var Dom = function (arr) {
    var _this = this,
        i = 0;
    // Create array-like object
    for (i = 0; i < arr.length; i++) {
        _this[i] = arr[i];
    }
    _this.length = arr.length;
    // Return collection with methods

    return $(this);
};

var $ = function (selector, context) {
    var arr = [],
        i = 0;
    if (selector && !context) {
        if (selector instanceof Dom) {
            return selector;
        }
    }

    if (isFunction(selector)) {
        return $(document).ready(selector);
    }

    if (selector) {
        // String
        if (typeof selector === 'string') {
            var els, tempParent, html;
            selector = html = selector.trim();
            if (html.indexOf('<') >= 0 && html.indexOf('>') >= 0) {
                var toCreate = 'div';
                if (html.indexOf('<li') === 0) {
                    toCreate = 'ul';
                }
                if (html.indexOf('<tr') === 0) {
                    toCreate = 'tbody';
                }
                if (html.indexOf('<td') === 0 || html.indexOf('<th') === 0) {
                    toCreate = 'tr';
                }
                if (html.indexOf('<tbody') === 0) {
                    toCreate = 'table';
                }
                if (html.indexOf('<option') === 0) {
                    toCreate = 'select';
                }
                tempParent = document.createElement(toCreate);
                tempParent.innerHTML = html;
                for (i = 0; i < tempParent.childNodes.length; i++) {
                    arr.push(tempParent.childNodes[i]);
                }
            } else {
                if (!context && selector[0] === '#' && !selector.match(/[ .<>:~]/)) {
                    // Pure ID selector
                    els = [document.getElementById(selector.split('#')[1])];
                } else {
                    if (context instanceof Dom) {
                        context = context[0];
                    }
                    // Other selectors
                    els = (context || document).querySelectorAll(selector);

                }
                for (i = 0; i < els.length; i++) {
                    if (els[i]) {
                        arr.push(els[i]);
                    }
                }
            }
        }
        // Node/element
        else if (selector.nodeType || selector === window || selector === document) {
            arr.push(selector);
        }
        //Array of elements or instance of Dom
        else if (selector.length > 0 && selector[0].nodeType) {
            for (i = 0; i < selector.length; i++) {
                arr.push(selector[i]);
            }
        } else if (isArray(selector)) {
            arr = selector;
        }
    }
    return new Dom(arr);
};
// Link to prototype
$.fn = Dom.prototype;


/********************* common *********************/
function isFunction(value) {
    return typeof value === "function";
}

function isObject(obj) {
    return typeof obj === "object";
}

function isPlainObject(obj) {
    return isObject(obj) && obj !== null && obj !== obj.window && Object.getPrototypeOf(obj) == Object.prototype;
}

function isArray(arr) {
    return Object.prototype.toString.apply(arr) === '[object Array]';
}

function likeArray(obj) {
    return typeof obj.length == 'number';
}

function camelize(str) {
    return str.replace(/-+(.)?/g, function (match, chr) {
        return chr ? chr.toUpperCase() : '';
    });
}

function each(obj, callback) {
    var i, prop;

    if (!isObject(obj) || !callback) {
        return;
    }

    if (isArray(obj) || obj instanceof Dom) {
        // Array
        for (i = 0; i < obj.length; i++) {
            if (callback.call(obj[i], i, obj[i]) === false) {
                break;
            }
        }
    } else {
        // Object
        for (prop in obj) {
            if (obj.hasOwnProperty(prop) && prop !== 'length') {
                if (callback.call(obj[prop], prop, obj[prop]) === false) {
                    break;
                }
            }
        }
    }

    return this;
}

function extend(target, source, deep) {
    for (var key in source) {
        if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
            if (isPlainObject(source[key]) && !isPlainObject(target[key]) || isArray(source[key]) && !isArray(target[key])) {
                target[key] = {};
            }
            extend(target[key], source[key], deep);
        } else if (source[key] !== undefined) {
            target[key] = source[key];
        }
    }
}

function unique(arr) {
    var unique = [];
    for (var i = 0; i < arr.length; i++) {
        if (unique.indexOf(arr[i]) === -1) {
            unique.push(arr[i]);
        }
    }
    return unique;
};

function dasherize(str) {
    return str.replace(/::/g, '/')
        .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
        .replace(/([a-z\d])([A-Z])/g, '$1_$2')
        .replace(/_/g, '-')
        .toLowerCase();
}

function maybeAddPx(name, value) {
    var cssNumber = {
        'column-count': 1,
        'columns': 1,
        'font-weight': 1,
        'line-height': 1,
        'opacity': 1,
        'z-index': 1,
        'zoom': 1
    };
    return (typeof value == "number" && !cssNumber[dasherize(name)]) ? value + "px" : value;
}

/********************* prototype *********************/
$.fn.ready = function (callback) {
    if (/complete|loaded|interactive/.test(document.readyState) && document.body) {
        callback($);
    } else {
        document.addEventListener('DOMContentLoaded', function () {
            callback($);
        }, false);
    }
    return this;
}

$.fn.concat = [].concat

$.fn.empty = function () {
    return this.each(function () {
        this.innerHTML = '';
    });
}

$.fn.map = function (fn) {
    return $($.map(this, function (el, i) {
        return fn.call(el, i, el);
    }));
}

$.fn.slice = function () {
    return $(Array.prototype.slice.apply(this, arguments));
}

// Classes and attriutes
// NOTE: element.classList attribure is not supported on android 2.3!!!
$.fn.addClass = function (className) {
    if (typeof className === 'undefined') {
        return this;
    }

    var classes = className.split(' ');

    for (var i = 0; i < classes.length; i++) {
        for (var j = 0; j < this.length; j++) {
            if (typeof this[j].classList !== 'undefined' && classes[i] !== '') {
                this[j].classList.add(classes[i]);
            }
        }
    }
    return this;
}

$.fn.removeClass = function (className) {
    var classes = className.split(' ');
    for (var i = 0; i < classes.length; i++) {
        for (var j = 0; j < this.length; j++) {
            if (typeof this[j].classList !== 'undefined' && classes[i] !== '') {
                this[j].classList.remove(classes[i]);
            }
        }
    }
    return this;
}

$.fn.hasClass = function (className) {
    return this[0] ? this[0].classList.contains(className) : false;
}

$.fn.toggleClass = function (className) {
    var classes = className.split(' ');
    for (var i = 0; i < classes.length; i++) {
        for (var j = 0; j < this.length; j++) {
            if (typeof this[j].classList !== 'undefined') {
                this[j].classList.toggle(classes[i]);
            }
        }
    }
    return this;
}

$.fn.closest = function (selector, context) {
    var node = this[0],
        collection = false;

    if (isObject(selector)) {
        collection = $(selector);
    }
    while (node && !(collection ? collection.indexOf(node) >= 0 : $.matches(node, selector))) {
        node = node !== context && node.nodeType !== node.DOCUMENT_NODE && node.parentNode;
    }

    return $(node);
}

$.fn.attr = function (attrs, value) {
    var attr;

    if (arguments.length === 1 && typeof attrs === 'string' && this.length) {
        // Get attr
        attr = this[0].getAttribute(attrs);
        return this[0] && (attr || attr === '') ? attr : undefined;
    } else {
        // Set attrs
        for (var i = 0; i < this.length; i++) {
            if (arguments.length === 2) {
                // String
                this[i].setAttribute(attrs, value);
            } else {
                // Object
                for (var attrName in attrs) {
                    this[i][attrName] = attrs[attrName];
                    this[i].setAttribute(attrName, attrs[attrName]);
                }
            }
        }
        return this;
    }
}

$.fn.removeAttr = function (attr) {
    for (var i = 0; i < this.length; i++) {
        this[i].removeAttribute(attr);
    }
    return this;
}

$.fn.prop = function (props, value) {
    var propMap = {
        'readonly': 'readOnly'
    };
    props = propMap[props] || props;
    if (arguments.length === 1 && typeof props === 'string') {
        // Get prop
        return this[0] ? this[0][props] : undefined;
    } else {
        // Set props
        for (var i = 0; i < this.length; i++) {
            this[i][props] = value;
        }
        return this;
    }
}

$.fn.val = function (value) {
    if (typeof value === 'undefined') {
        if (this.length && this[0].multiple) {
            return $.map(this.find('option:checked'), function (v) {
                return v.value;
            });
        }
        return this[0] ? this[0].value : undefined;
    }

    if (this.length && this[0].multiple) {
        each(this[0].options, function () {
            this.selected = value.indexOf(this.value) != -1;
        });
    } else {
        for (var i = 0; i < this.length; i++) {
            this[i].value = value;
        }
    }

    return this;
}

//Events
$.fn.on = function (eventName, targetSelector, listener, capture) {
    var events = eventName.split(' '),
        i, j;

    function handleLiveEvent(e) {
        var k,
            parents,
            target = e.target;

        if ($(target).is(targetSelector)) {
            listener.call(target, e);
        } else {
            parents = $(target).parents();
            for (k = 0; k < parents.length; k++) {
                if ($(parents[k]).is(targetSelector)) {
                    listener.call(parents[k], e);
                }
            }
        }
    }

    function handleNamespaces(elm, name, listener, capture) {
        var namespace = name.split('.');

        if (!elm.DomNameSpaces) {
            elm.DomNameSpaces = [];
        }

        elm.DomNameSpaces.push({
            namespace: namespace[1],
            event: namespace[0],
            listener: listener,
            capture: capture
        });

        elm.addEventListener(namespace[0], listener, capture);
    }

    for (i = 0; i < this.length; i++) {
        if (isFunction(targetSelector) || targetSelector === false) {
            // Usual events
            if (isFunction(targetSelector)) {
                listener = arguments[1];
                capture = arguments[2] || false;
            }
            for (j = 0; j < events.length; j++) {
                // check for namespaces
                if (events[j].indexOf('.') != -1) {
                    handleNamespaces(this[i], events[j], listener, capture);
                } else {
                    this[i].addEventListener(events[j], listener, capture);
                }
            }
        } else {
            // Live events
            for (j = 0; j < events.length; j++) {
                if (!this[i].DomLiveListeners) {
                    this[i].DomLiveListeners = [];
                }

                this[i].DomLiveListeners.push({
                    listener: listener,
                    liveListener: handleLiveEvent
                });

                if (events[j].indexOf('.') != -1) {
                    handleNamespaces(this[i], events[j], handleLiveEvent, capture);
                } else {
                    this[i].addEventListener(events[j], handleLiveEvent, capture);
                }
            }
        }
    }
    return this;
}

$.fn.off = function (eventName, targetSelector, listener, capture) {
    var events,
        i, j, k,
        that = this;

    function removeEvents(event) {
        var i, j,
            item,
            parts = event.split('.'),
            name = parts[0],
            ns = parts[1];

        for (i = 0; i < that.length; ++i) {
            if (that[i].DomNameSpaces) {
                for (j = 0; j < that[i].DomNameSpaces.length; ++j) {
                    item = that[i].DomNameSpaces[j];

                    if (item.namespace == ns && (item.event == name || !name)) {
                        that[i].removeEventListener(item.event, item.listener, item.capture);
                        item.removed = true;
                    }
                }
                // remove the events from the DomNameSpaces array
                for (j = that[i].DomNameSpaces.length - 1; j >= 0; --j) {
                    if (that[i].DomNameSpaces[j].removed) {
                        that[i].DomNameSpaces.splice(j, 1);
                    }
                }
            }
        }
    }

    events = eventName.split(' ');

    for (i = 0; i < events.length; i++) {
        for (j = 0; j < this.length; j++) {
            if (isFunction(targetSelector) || targetSelector === false) {
                // Usual events
                if (isFunction(targetSelector)) {
                    listener = arguments[1];
                    capture = arguments[2] || false;
                }

                if (events[i].indexOf('.') === 0) { // remove namespace events
                    removeEvents(events[i].substr(1), listener, capture);
                } else {
                    this[j].removeEventListener(events[i], listener, capture);
                }
            } else {
                // Live event
                if (this[j].DomLiveListeners) {
                    for (k = 0; k < this[j].DomLiveListeners.length; k++) {
                        if (this[j].DomLiveListeners[k].listener === listener) {
                            this[j].removeEventListener(events[i], this[j].DomLiveListeners[k].liveListener, capture);
                        }
                    }
                }
                if (this[j].DomNameSpaces && this[j].DomNameSpaces.length && events[i]) {
                    removeEvents(events[i]);
                }
            }
        }
    }

    return this;
}

$.fn.trigger = function (eventName, eventData) {
    var events = eventName.split(' ');
    for (var i = 0; i < events.length; i++) {
        for (var j = 0; j < this.length; j++) {
            var evt;
            try {
                evt = new CustomEvent(events[i], {
                    detail: eventData,
                    bubbles: true,
                    cancelable: true
                });
            } catch (e) {
                evt = document.createEvent('Event');
                evt.initEvent(events[i], true, true);
                evt.detail = eventData;
            }
            this[j].dispatchEvent(evt);
        }
    }
    return this;
}

// Sizing/styles
$.fn.width = function (dim) {
    if (dim !== undefined) {
        return this.css('width', dim);
    }

    if (this[0] === window) {
        return window.innerWidth;
    } else if (this[0] === document) {
        return document.documentElement.scrollWidth;
    } else {
        return this.length > 0 ? parseFloat(this.css('width')) : null;
    }
}

$.fn.height = function (dim) {
    if (dim !== undefined) {
        return this.css('height', dim);
    }

    if (this[0] === window) {
        return window.innerHeight;
    } else if (this[0] === document) {
        var body = document.body,
            html = document.documentElement;

        return Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
    } else {
        return this.length > 0 ? parseFloat(this.css('height')) : null;
    }
}

$.fn.outerWidth = function (includeMargins) {
    if (this.length > 0) {
        if (includeMargins) {
            var styles = this.styles();
            return this[0].offsetWidth + parseFloat(styles.getPropertyValue('margin-right')) + parseFloat(styles.getPropertyValue('margin-left'));
        } else {
            return this[0].offsetWidth;
        }
    }
}

$.fn.outerHeight = function (includeMargins) {
    if (this.length > 0) {
        if (includeMargins) {
            var styles = this.styles();
            return this[0].offsetHeight + parseFloat(styles.getPropertyValue('margin-top')) + parseFloat(styles.getPropertyValue('margin-bottom'));
        } else {
            return this[0].offsetHeight;
        }
    }
}

$.fn.innerWidth = function () {
    var elm = this;
    if (this.length > 0) {
        if (this[0].innerWidth) {
            return this[0].innerWidth;
        } else {
            var size = this[0].offsetWidth,
                sides = ['left', 'right'];

            sides.forEach(function (side) {
                size -= parseInt(elm.css(camelize('border-' + side + '-width')) || 0, 10);
            });
            return size;
        }
    }
}

$.fn.innerHeight = function () {
    var elm = this;
    if (this.length > 0) {
        if (this[0].innerHeight) {
            return this[0].innerHeight;
        } else {
            var size = this[0].offsetHeight,
                sides = ['top', 'bottom'];

            sides.forEach(function (side) {
                size -= parseInt(elm.css(camelize('border-' + side + '-width')) || 0, 10);
            });

            return size;
        }
    }
}

$.fn.offset = function () {
    if (this.length > 0) {
        var el = this[0],
            box = el.getBoundingClientRect(),
            body = document.body,
            clientTop = el.clientTop || body.clientTop || 0,
            clientLeft = el.clientLeft || body.clientLeft || 0,
            scrollTop = window.pageYOffset || el.scrollTop,
            scrollLeft = window.pageXOffset || el.scrollLeft;

        return {
            top: box.top + scrollTop - clientTop,
            left: box.left + scrollLeft - clientLeft
        };
    }
}

$.fn.hide = function () {
    for (var i = 0; i < this.length; i++) {
        this[i].style.display = 'none';
    }
    return this;
}

$.fn.show = function () {
    for (var i = 0; i < this.length; i++) {
        this[i].style.display == "none" && (this[i].style.display = 'block');

        if (this[i].style.getPropertyValue("display") == "none") {
            this[i].style.display = 'block';
        }
    }

    return this;
}

$.fn.clone = function () {
    return this.map(function () {
        return this.cloneNode(true);
    });
}

$.fn.styles = function () {
    return this[0] ? window.getComputedStyle(this[0], null) : undefined;
}

$.fn.css = function (property, value) {
    var computedStyle,
        i,
        key,
        props,
        element = this[0],
        css = '';

    if (arguments.length < 2) {
        if (!element) {
            return;
        }
        computedStyle = getComputedStyle(element, '');
        if (typeof property === 'string') {
            return element.style[property] || computedStyle.getPropertyValue(property);
        } else if (isArray(property)) {
            props = {};
            each(property, function (_, prop) {
                props[prop] = (element.style[prop] || computedStyle.getPropertyValue(prop));
            });
            return props;
        }
    }

    if (typeof property === 'string') {
        if (!value && value !== 0) {
            this.each(function () {
                this.style.removeProperty(dasherize(property));
            });
        } else {
            css = dasherize(property) + ":" + maybeAddPx(property, value);
        }
    } else {
        for (key in property) {
            if (!property[key] && property[key] !== 0) {
                for (i = 0; i < this.length; i++) {
                    this[i].style.removeProperty(dasherize(key));
                }
            } else {
                css += dasherize(key) + ':' + maybeAddPx(key, property[key]) + ';';
            }
        }
    }

    return this.each(function () {
        this.style.cssText += ';' + css;
    });
}

$.fn.each = function (callback) {
    for (var i = 0; i < this.length; i++) {
        if (callback.apply(this[i], [i, this[i]]) === false) {
            break;
        }
    }
    return this;
}

$.fn.filter = function (callback) {
    var matchedItems = [];

    for (var i = 0; i < this.length; i++) {
        if (isFunction(callback)) {
            if (callback.call(this[i], i, this[i])) {
                matchedItems.push(this[i]);
            }
        } else if ($.matches(this[i], callback)) {
            matchedItems.push(this[i]);
        }
    }

    return new Dom(matchedItems);
}

$.fn.html = function (html) {
    if (typeof html === 'undefined') {
        return this[0] ? this[0].innerHTML : undefined;
    } else {
        this.empty();
        for (var i = 0; i < this.length; i++) {
            this[i].innerHTML = html;
        }
        return this;
    }
}

$.fn.text = function (text) {
    if (typeof text === 'undefined') {
        return this[0] ? this[0].textContent.trim() : null;
    } else {
        for (var i = 0; i < this.length; i++) {
            this[i].textContent = text;
        }
        return this;
    }
}

$.fn.is = function (selector) {
    return this.length > 0 && $.matches(this[0], selector);
}

$.fn.not = function (selector) {
    var nodes = [];
    if (isFunction(selector) && selector.call !== undefined) {
        this.each(function (idx) {
            if (!selector.call(this, idx)) {
                nodes.push(this);
            }
        });
    } else {
        var excludes = typeof selector == 'string' ? this.filter(selector) : (likeArray(selector) && isFunction(selector.item)) ? Array.prototype.slice.call(selector) : $(selector);

        if (isObject(excludes)) {
            excludes = $.map(excludes, function (el) {
                return el;
            });
        }

        this.each(function (i, el) {
            if (excludes.indexOf(el) < 0) {
                nodes.push(el);
            }
        });
    }

    return $(nodes);
}

$.fn.indexOf = function (el) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] === el) {
            return i;
        }
    }
}

$.fn.index = function (element) {
    return element ? this.indexOf($(element)[0]) : this.parent().children().indexOf(this[0]);
}

$.fn.get = function (idx) {
    return idx === undefined ? Array.prototype.slice.call(this) : this[idx >= 0 ? idx : idx + this.length];
}

$.fn.eq = function (index) {
    if (typeof index === 'undefined') {
        return this;
    }
    var length = this.length,
        returnIndex;

    if (index > length - 1) {
        return new Dom([]);
    }
    if (index < 0) {
        returnIndex = length + index;
        return returnIndex < 0 ? new Dom([]) : new Dom([this[returnIndex]]);
    }
    return new Dom([this[index]]);
}

$.fn.append = function (newChild) {
    var i, j;
    for (i = 0; i < this.length; i++) {
        if (typeof newChild === 'string') {
            var tempDiv = document.createElement('div');
            tempDiv.innerHTML = newChild;
            while (tempDiv.firstChild) {
                this[i].appendChild(tempDiv.firstChild);
            }
        } else if (newChild instanceof Dom) {
            for (j = 0; j < newChild.length; j++) {
                this[i].appendChild(newChild[j]);
            }
        } else {
            this[i].appendChild(newChild);
        }
    }
    return this;
}

$.fn.appendTo = function (parent) {
    $(parent).append(this);
    return this;
}

$.fn.prepend = function (newChild) {
    var i, j;
    for (i = 0; i < this.length; i++) {
        if (typeof newChild === 'string') {
            var tempDiv = document.createElement('div');
            tempDiv.innerHTML = newChild;
            for (j = tempDiv.childNodes.length - 1; j >= 0; j--) {
                this[i].insertBefore(tempDiv.childNodes[j], this[i].childNodes[0]);
            }
            // this[i].insertAdjacentHTML('afterbegin', newChild);
        } else if (newChild instanceof Dom) {
            for (j = 0; j < newChild.length; j++) {
                this[i].insertBefore(newChild[j], this[i].childNodes[0]);
            }
        } else {
            this[i].insertBefore(newChild, this[i].childNodes[0]);
        }
    }
    return this;
}

$.fn.prependTo = function (parent) {
    $(parent).prepend(this);
    return this;
}

$.fn.insertBefore = function (selector) {
    var before = $(selector);

    for (var i = 0; i < this.length; i++) {
        if (before.length === 1) {
            before[0].parentNode.insertBefore(this[i], before[0]);
        } else if (before.length > 1) {
            for (var j = 0; j < before.length; j++) {
                before[j].parentNode.insertBefore(this[i].cloneNode(true), before[j]);
            }
        }
    }
    return this;
}

$.fn.insertAfter = function (selector) {
    var after = $(selector);
    for (var i = 0; i < this.length; i++) {
        if (after.length === 1) {
            after[0].parentNode.insertBefore(this[i], after[0].nextSibling);
        } else if (after.length > 1) {
            for (var j = 0; j < after.length; j++) {
                after[j].parentNode.insertBefore(this[i].cloneNode(true), after[j].nextSibling);
            }
        }
    }

    return this;
}

$.fn.next = function (selector) {
    if (this.length > 0) {
        if (selector) {
            if (this[0].nextElementSibling && $(this[0].nextElementSibling).is(selector)) {
                return new Dom([this[0].nextElementSibling]);
            } else {
                return new Dom([]);
            }
        } else {
            if (this[0].nextElementSibling) {
                return new Dom([this[0].nextElementSibling]);
            } else {
                return new Dom([]);
            }
        }
    } else {
        return new Dom([]);
    }
}

$.fn.nextAll = function (selector) {
    var nextEls = [],
        el = this[0];

    if (!el) {
        return new Dom([]);
    }
    while (el.nextElementSibling) {
        var next = el.nextElementSibling;
        if (selector) {
            if ($(next).is(selector)) {
                nextEls.push(next);
            }
        } else {
            nextEls.push(next);
        }
        el = next;
    }
    return new Dom(nextEls);
}

$.fn.prev = function (selector) {
    if (this.length > 0) {
        if (selector) {
            if (this[0].previousElementSibling && $(this[0].previousElementSibling).is(selector)) {
                return new Dom([this[0].previousElementSibling]);
            } else {
                return new Dom([]);
            }
        } else {
            if (this[0].previousElementSibling) {
                return new Dom([this[0].previousElementSibling]);
            } else {
                return new Dom([]);
            }
        }
    } else {
        return new Dom([]);
    }
}

$.fn.prevAll = function (selector) {
    var prevEls = [];
    var el = this[0];
    if (!el) {
        return new Dom([]);
    }
    while (el.previousElementSibling) {
        var prev = el.previousElementSibling;
        if (selector) {
            if ($(prev).is(selector)) {
                prevEls.push(prev);
            }
        } else {
            prevEls.push(prev);
        }
        el = prev;
    }
    return new Dom(prevEls);
}

$.fn.parent = function (selector) {
    var parents = [];
    for (var i = 0; i < this.length; i++) {
        if (this[i].parentNode !== null) {
            if (selector) {
                if ($(this[i].parentNode).is(selector)) {
                    parents.push(this[i].parentNode);
                }
            } else {
                parents.push(this[i].parentNode);
            }
        }
    }
    return $(unique(parents));
}

$.fn.parents = function (selector) {
    var parents = [];
    for (var i = 0; i < this.length; i++) {
        var parent = this[i].parentNode;
        while (parent) {
            if (selector) {
                if ($(parent).is(selector)) {
                    parents.push(parent);
                }
            } else {
                parents.push(parent);
            }
            parent = parent.parentNode;
        }
    }
    return $(unique(parents));
}

$.fn.find = function (selector) {
    var foundElements = [];
    for (var i = 0; i < this.length; i++) {
        var found = this[i].querySelectorAll(selector);
        for (var j = 0; j < found.length; j++) {
            foundElements.push(found[j]);
        }
    }
    return new Dom(foundElements);
}

$.fn.children = function (selector) {
    var children = [];
    for (var i = 0; i < this.length; i++) {
        var childNodes = this[i].childNodes;

        for (var j = 0; j < childNodes.length; j++) {
            if (!selector) {
                if (childNodes[j].nodeType === 1) {
                    children.push(childNodes[j]);
                }
            } else {
                if (childNodes[j].nodeType === 1 && $(childNodes[j]).is(selector)) {
                    children.push(childNodes[j]);
                }
            }
        }
    }

    return new Dom(unique(children));
}

$.fn.remove = function () {
    for (var i = 0; i < this.length; i++) {
        if (this[i].parentNode) {
            this[i].parentNode.removeChild(this[i]);
        }
    }
    return this;
}

$.fn.add = function () {
    var dom = this;
    var i, j;
    for (i = 0; i < arguments.length; i++) {
        var toAdd = $(arguments[i]);
        for (j = 0; j < toAdd.length; j++) {
            dom[dom.length] = toAdd[j];
            dom.length++;
        }
    }
    return dom;
}

$.fn.before = function (elm) {
    $(elm).insertBefore(this);
    return this;
}

$.fn.after = function (elm) {
    $(elm).insertAfter(this);
    return this;
}

$.fn.scrollTop = function (value) {
    if (!this.length) {
        return;
    }
    var hasScrollTop = 'scrollTop' in this[0];

    if (value === undefined) {
        return hasScrollTop ? this[0].scrollTop : this[0].pageYOffset;
    }
    return this.each(hasScrollTop ? function () {
        this.scrollTop = value;
    } : function () {
        this.scrollTo(this.scrollX, value);
    });
}

$.fn.scrollLeft = function (value) {
    if (!this.length) {
        return;
    }
    var hasScrollLeft = 'scrollLeft' in this[0];

    if (value === undefined) {
        return hasScrollLeft ? this[0].scrollLeft : this[0].pageXOffset;
    }
    return this.each(hasScrollLeft ? function () {
        this.scrollLeft = value;
    } : function () {
        this.scrollTo(value, this.scrollY);
    });
}

$.fn.contents = function () {
    return this.map(function (i, v) {
        return Array.prototype.slice.call(v.childNodes);
    });
}

$.fn.nextUntil = function (selector) {
    var n = this,
        array = [];

    while (n.length && !n.filter(selector).length) {
        array.push(n[0]);
        n = n.next();
    }

    return $(array);
}

$.fn.prevUntil = function (selector) {
    var n = this,
        array = [];

    while (n.length && !$(n).filter(selector).length) {
        array.push(n[0]);
        n = n.prev();
    }

    return $(array);
}

$.fn.detach = function () {
    return this.remove();
}


/********************* utils *********************/

$.map = function (elements, callback) {
    var value, values = [],
        i, key;
    if (likeArray(elements)) {
        for (i = 0; i < elements.length; i++) {
            value = callback(elements[i], i);
            if (value !== null) {
                values.push(value);
            }
        }
    } else {
        for (key in elements) {
            value = callback(elements[key], key);
            if (value !== null) {
                values.push(value);
            }
        }
    }

    return values.length > 0 ? $.fn.concat.apply([], values) : values;
};

$.matches = function (element, selector) {
    if (!selector || !element || element.nodeType !== 1) {
        return false;
    }

    var matchesSelector = element.matchesSelector || element.webkitMatchesSelector || element.mozMatchesSelector || element.msMatchesSelector;

    return matchesSelector.call(element, selector);

};

//浏览器引擎判断
$.isTrident = navigator.userAgent.indexOf('Trident') > -1; //IE内核
$.isPresto = navigator.userAgent.indexOf('Presto') > -1; //opera内核 
$.isGecko = navigator.userAgent.indexOf('Gecko') > -1 && navigator.userAgent.indexOf('KHTML') == -1; //火狐内核
$.isMobile = !!navigator.userAgent.match(/WebKit.*Mobile.*/); //是否为移动终端
$.isIOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
$.isAndroid = navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Linux') > -1; //android终端或uc浏览器
$.isIPhone = navigator.userAgent.indexOf('iPhone') > -1; //是否为iPhone或者QQHD浏览器
$.isIPad = navigator.userAgent.indexOf('iPad') > -1; //是否iPad
$.isWebApp = navigator.userAgent.indexOf('Safari') == -1; //是否应用程序，没有头部与底部
$.isWebkit = 'webkitTransform' in document.body.style;
$.isTouchDevice = 'ontouchstart' in window;

//获取浏览器支持的transform关键词
$.transformProperty = 'webkitTransform' in document.body.style ? 'webkitTransform' : 'mozTransform' in document.body.style ? 'mozTransform' : 'msTransform' in document.body.style ? 'msTransform' : 'transform';
$.transitionEndEvent = $.transformProperty === 'webkitTransform' ? 'webkitTransitionEnd' : 'transitionend';
$.localstoragesupported = ('localStorage' in window) && ('JSON' in window);
$.raf = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
    window.setTimeout(callback, 16)
};

//渲染字符串为dom
$.render = function (htmlstr) {
    var el = document.createElement('div');
    el.innerHTML = htmlstr;
    var res;
    if (el.children.length > 1) {
        res = document.createDocumentFragment();
        Array.prototype.slice.call(el.children).forEach(function (n) {
            res.appendChild(n);
        });
    } else {
        res = el.children[0];
    }
    return res;
}

//url操作
$.url = {
    getParameter: function (key, url) {
        var searchStr = url != undefined ? url.substring(url.indexOf('?') + 1) : window.location.search.substring(1)
        return this.parameterToObject(searchStr)[key]
    },
    parameterToObject: function (searchStr) {
        var paramObj = {}
        searchStr.split('&').forEach(function (part) {
            var arr_part = part.split('=')
            if (arr_part.length > 1) {
                paramObj[arr_part[0]] = decodeURIComponent(arr_part[1])
            }
        })
        return paramObj
    },
    parameterToStr: function (parameter) {
        var res = ''
        for (var i in parameter) {
            res += i + '=' + parameter[i] + '&'
        }
        return res.substring(0, res.length - 1)
    },
    parse: function (url) {
        var a = document.createElement('a');
        a.href = url;
        return a;
    }
}

//延迟执行函数
$.debounce = function (handler, target, delay) {
    target.__temp_timeout && clearTimeout(target.__temp_timeout);
    target.__temp_timeout = setTimeout(function () {
        delete target.__temp_timeout;
        handler();
    }, delay);
}

//切换视图
$.toggleView = function (view_in, view_out, is_reverse, animate_type) {
    var view_out_aniCls = ['ne-animate-out', 'ne-animate-' + animate_type, is_reverse ? 'ne-animate-reverse' : ''].join(' '),
        view_in_aniCls = ['ne-animate-in', 'ne-animate-' + animate_type, is_reverse ? 'ne-animate-reverse' : ''].join(' '),
        view_out_customCls = function (customCls) {
            view_out && Array.prototype.slice.call(view_out.classList).forEach(function (cls) {
                cls != 'active' && cls.indexOf('ne-animate-') == -1 && customCls.push(cls);
            });
            return customCls.join(' ');
        }([]),
        view_in_customCls = function (customCls) {
            view_in && Array.prototype.slice.call(view_in.classList).forEach(function (cls) {
                cls != 'active' && cls.indexOf('ne-animate-') == -1 && customCls.push(cls);
            });
            return customCls.join(' ');
        }([]);

    if (view_out) {
        view_out.className = view_out_customCls + ' ' + view_out_aniCls;
        Ne.dom.debounce(function () {
            view_out.className = view_out_customCls;
            view_out.onhide && view_out.onhide();
        }, view_out, 600);
    }
    if (view_in) {
        view_in.className = view_in_customCls + ' ' + view_in_aniCls + ' ' + 'active';
        Ne.dom.debounce(function () {
            view_in.className = view_in_customCls + ' ' + 'active';
            view_in.onshow && view_in.onshow();
        }, view_in, 600);
    }
}

$.animateShow = function (target) {
    target.classList.remove('ne-animate-hide');
    target.classList.add('ne-animate-show');
}

$.animateHide = function (target) {
    target.classList.remove('ne-animate-show');
    target.classList.add('ne-animate-hide');
    $.debounce(function () {
        target.classList.remove('ne-animate-hide');
    }, target, 500);
}

module.exports = $;
},{}],3:[function(require,module,exports){

/****************************************************************** 
 * @motion
 * Description:动效辅助
 *******************************************************************/
var timingFunction=require('./lib/timing-function');
var timeline = require('./lib/timeline');
var transform=require('./lib/transform');

module.exports=transform;
module.exports.timingFunction=timingFunction;
module.exports.timeline=timeline;
},{"./lib/timeline":4,"./lib/timing-function":5,"./lib/transform":6}],4:[function(require,module,exports){

var __TIMING_FUNCTION=require('./timing-function');

function timingFunction(name) {
    name = name.split('-');
    if (name.length == 2) {
        return __TIMING_FUNCTION[name[0]][name[1]];
    } else {
        return __TIMING_FUNCTION[name[0]];
    }
}

function Timeline(option) {
    //向量起点
    this.origin = option.origin;
    //向量终点
    this.transition = option.transition;
    //规定动画完成一个周期所花费的秒或毫秒。默认是 1000。
    this.duration = option.duration || 1000;
    //规定动画何时开始。默认是 0。
    this.delay = option.delay || 0;
    //规定动画被播放的次数。默认是 1。
    this.iterationCount = option.iterationCount || 1;
    //规定动画是否在下一周期逆向地播放。默认是 "normal"。
    this.direction = 'normal';
    //规定动画的速度曲线。默认是 "Linear"。
    this.timingFunction = timingFunction(option.timingFunction ? option.timingFunction : 'Linear');
    //关键帧数(默认每秒24帧)
    this.keyframesLength = option.keyframesLength || Math.ceil(this.duration / 40);
    //关键帧时长
    this.keyframeSpan = Math.ceil(this.duration / this.keyframesLength);
    //关键帧回调
    this.keyframeFunction = option.keyframeFunction;
    //结束回调
    this.complete = option.complete;
}

Timeline.prototype.run = function (keyframeIndex) {
    var _this = this,
        transitionRes = [];
    keyframeIndex = keyframeIndex || 0;
    if (keyframeIndex >= _this.keyframesLength) {
        transitionRes = _this.transition;
    } else {
        _this.transition.forEach(function (item, index) {
            var _res = _this.timingFunction(keyframeIndex, 0, item - _this.origin[index], _this.keyframesLength);
            _res += _this.origin[index];
            transitionRes.push(Math.ceil(_res));
        });
    }
    transitionRes.push(keyframeIndex);
    _this.keyframeFunction.apply(_this, transitionRes);
    if (keyframeIndex < _this.keyframesLength) {
        keyframeIndex++;
        _this.timing = setTimeout(function () {
            _this.run.apply(_this, [keyframeIndex]);
        }, _this.keyframeSpan);
    } else {
        _this.complete && _this.complete();
    }
}

Timeline.prototype.stop = function () {
    clearTimeout(this.timing);
}

//exports
module.exports = Timeline;
},{"./timing-function":5}],5:[function(require,module,exports){

//时序函数 timing function
/*
 * t: current time（当前时间）；
 * b: beginning value（初始值）；
 * c: change in value（变化量）；
 * d: duration（持续时间）。
 */
var __TIMING_FUNCTION = {
    Linear: function (t, b, c, d) {
        return c * t / d + b;
    },
    Quad: {
        easeIn: function (t, b, c, d) {
            return c * (t /= d) * t + b;
        },
        easeOut: function (t, b, c, d) {
            return -c * (t /= d) * (t - 2) + b;
        },
        easeInOut: function (t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t + b;
            return -c / 2 * ((--t) * (t - 2) - 1) + b;
        }
    },
    Cubic: {
        easeIn: function (t, b, c, d) {
            return c * (t /= d) * t * t + b;
        },
        easeOut: function (t, b, c, d) {
            return c * ((t = t / d - 1) * t * t + 1) + b;
        },
        easeInOut: function (t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
            return c / 2 * ((t -= 2) * t * t + 2) + b;
        }
    },
    Quart: {
        easeIn: function (t, b, c, d) {
            return c * (t /= d) * t * t * t + b;
        },
        easeOut: function (t, b, c, d) {
            return -c * ((t = t / d - 1) * t * t * t - 1) + b;
        },
        easeInOut: function (t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
            return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
        }
    },
    Quint: {
        easeIn: function (t, b, c, d) {
            return c * (t /= d) * t * t * t * t + b;
        },
        easeOut: function (t, b, c, d) {
            return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
        },
        easeInOut: function (t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
            return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
        }
    },
    Sine: {
        easeIn: function (t, b, c, d) {
            return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
        },
        easeOut: function (t, b, c, d) {
            return c * Math.sin(t / d * (Math.PI / 2)) + b;
        },
        easeInOut: function (t, b, c, d) {
            return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
        }
    },
    Expo: {
        easeIn: function (t, b, c, d) {
            return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
        },
        easeOut: function (t, b, c, d) {
            return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
        },
        easeInOut: function (t, b, c, d) {
            if (t == 0) return b;
            if (t == d) return b + c;
            if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
            return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
        }
    },
    Circ: {
        easeIn: function (t, b, c, d) {
            return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
        },
        easeOut: function (t, b, c, d) {
            return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
        },
        easeInOut: function (t, b, c, d) {
            if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
            return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
        }
    },
    Elastic: {
        easeIn: function (t, b, c, d, a, p) {
            var s;
            if (t == 0) return b;
            if ((t /= d) == 1) return b + c;
            if (typeof p == "undefined") p = d * .3;
            if (!a || a < Math.abs(c)) {
                s = p / 4;
                a = c;
            } else {
                s = p / (2 * Math.PI) * Math.asin(c / a);
            }
            return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        },
        easeOut: function (t, b, c, d, a, p) {
            var s;
            if (t == 0) return b;
            if ((t /= d) == 1) return b + c;
            if (typeof p == "undefined") p = d * .3;
            if (!a || a < Math.abs(c)) {
                a = c;
                s = p / 4;
            } else {
                s = p / (2 * Math.PI) * Math.asin(c / a);
            }
            return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
        },
        easeInOut: function (t, b, c, d, a, p) {
            var s;
            if (t == 0) return b;
            if ((t /= d / 2) == 2) return b + c;
            if (typeof p == "undefined") p = d * (.3 * 1.5);
            if (!a || a < Math.abs(c)) {
                a = c;
                s = p / 4;
            } else {
                s = p / (2 * Math.PI) * Math.asin(c / a);
            }
            if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
            return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
        }
    },
    Back: {
        easeIn: function (t, b, c, d, s) {
            if (typeof s == "undefined") s = 1.70158;
            return c * (t /= d) * t * ((s + 1) * t - s) + b;
        },
        easeOut: function (t, b, c, d, s) {
            if (typeof s == "undefined") s = 1.70158;
            return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
        },
        easeInOut: function (t, b, c, d, s) {
            if (typeof s == "undefined") s = 1.70158;
            if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
            return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
        }
    },
    Bounce: {
        easeIn: function (t, b, c, d) {
            return c - __TIMING_FUNCTION.Bounce.easeOut(d - t, 0, c, d) + b;
        },
        easeOut: function (t, b, c, d) {
            if ((t /= d) < (1 / 2.75)) {
                return c * (7.5625 * t * t) + b;
            } else if (t < (2 / 2.75)) {
                return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
            } else if (t < (2.5 / 2.75)) {
                return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
            } else {
                return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
            }
        },
        easeInOut: function (t, b, c, d) {
            if (t < d / 2) {
                return __TIMING_FUNCTION.Bounce.easeIn(t * 2, 0, c, d) * .5 + b;
            } else {
                return __TIMING_FUNCTION.Bounce.easeOut(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
            }
        }
    }
}

module.exports=__TIMING_FUNCTION;
},{}],6:[function(require,module,exports){

var Timeline=require('./timeline');
//transformProperty
var TRANSFORM_PROPERTY = 'webkitTransform' in document.body.style ?
    'webkitTransform' :
    'mozTransform' in document.body.style ? 'mozTransform' : 'msTransform' in document.body.style ? 'msTransform' : 'transform';
   
//移动
function move(option) {
    var keyframeFunction = function (x, y, z) {
        var _style_transform = option.el.style[TRANSFORM_PROPERTY];
        var _style_translate3d = 'translate3d(' + x + 'px,' + y + 'px,' + z + 'px)';
        if (_style_transform.indexOf('translate3d') < 0) {
            _style_transform += _style_translate3d;
        } else {
            _style_transform = _style_transform.replace(/translate3d\(+[,px\d\.\-\s]+\)/ig, _style_translate3d);
        }
        option.el.style[TRANSFORM_PROPERTY] = _style_transform;
    }
    if (option.duration != 0) {
        var defineobj = {
            duration: option.duration,
            origin: [0, 0, 0],
            transition: [option.x || 0, option.y || 0, option.z || 0],
            timingFunction: option.timingFunction,
            keyframeSpan: option.keyframeSpan,
            complete: function () {
                option.callback && option.callback();
            }
        };
        var _style_transform = option.el.style[TRANSFORM_PROPERTY];
        if (_style_transform.indexOf('translate3d') >= 0) {
            _style_transform.match(/translate3d\(+[,px\d\.\-\s]+\)/g)[0].match(/([\-\d\.]+px)/g).forEach(function (n, i) {
                defineobj.origin[i] = parseInt(n.substring(0, n.length - 2));
            });
        }
        defineobj.keyframeFunction = keyframeFunction;
        var _timeline = new Timeline(defineobj);
        _timeline.run();
        return _timeline;
    } else {
        keyframeFunction(option.x || 0, option.y || 0, option.z || 0);
        option.callback && option.callback();
        return true;
    }
}

//exports
module.exports = {
    move: move
}
},{"./timeline":4}],7:[function(require,module,exports){
/****************************************************************** 
 * @render
 * Description: living dom 模板渲染引擎
 *******************************************************************/
var render = require('./lib/render');
var vtpl = require('./lib/vtpl');

module.exports = render.render;
module.exports.compile = render.compile;
module.exports.vtpl = vtpl;
},{"./lib/render":10,"./lib/vtpl":19}],8:[function(require,module,exports){

//compiler:AST=>Render

var _ = require('./util');

function compileAttrs(attrs, container) {
    var code = '';
    code += 'var ' + container + '=[];';
    attrs.forEach(function (attr, i) {
        var name = attr.name;
        var value = '';
        if (attr.value.tag == 'expression') {
            value = attr.value.metas;
        } else {
            value = '"' + attr.value + '"';
        }
        code += container + '.push({name:"' + name + '",value:' + value + '});';
    });
    return code;
}

function compileNode(node, container, index) {
    var code = '';
    var attrsContainer = container + '_' + index + '_attrs';
    var childrenContainer = container + '_' + index + '_children';
    code += compileAttrs(node.attrs, attrsContainer);
    code += compileNodes(node.children, childrenContainer, true);
    code += container + '.push({tag:"' + node.tag + '",attrs:' + attrsContainer + ',children:' +
        childrenContainer +
        '});';
    return code;
}

function compileNodes(nodes, container, flag) {
    var code = '';
    if (flag) {
        code += 'var ' + container + ' = [];';
    }
    nodes.forEach(function (node, i) {
        if (node.type == 'js') {
            if (node.tag == 'each') {
                code += ' for (var ' + node.metas.index + ' in ' + node.metas.collection + ') {'
                code += 'var ' + node.metas.item + '=' + node.metas.collection + '[' + node.metas.index + '];';
                code += compileNodes(node.children, container);
                code += '};';
            } else if (node.tag == 'if' || (node.tag == 'else' && node.metas.expression)) {
                code += 'if (' + node.metas.expression + ') {';
                code += compileNodes(node.children, container);
                code += '}';
                if (node.alternate) {
                    code += 'else{';
                    code += compileNodes(node.alternate, container);
                    code += '}';
                }
            } else if (node.tag == 'else') {
                code += compileNodes(node.children, container);
            } else {
                code += container + '.push(' + node.metas + ');';
            }
        } else if (node.type == 'element') {
            code += compileNode(node, container, i);
        } else {
            code += container + '.push("' + node + '");';
        }
    });
    return code;
}

function compiler(AST) {
    AST = _.isArray(AST) ? AST : [AST];
    var code = '';
    code += compileNodes(AST, 'ns');
    code = 'var ns=[];with(__data){' + code + '}return ns;';
    code = new Function('__data', code);
    return code;
}

//exports
module.exports = compiler;
},{"./util":12}],9:[function(require,module,exports){

//parser:Tpl=>AST

var _ = require('./util');

function isSelfClosingTAG(tag) {
    var selfClosingTAGs = ['br', 'hr', 'img', 'input', 'link', 'meta', 'base', 'param', 'area', 'col',
        'command', 'embed', 'keygen', 'source', 'track', 'wbr'
    ];
    var flag=selfClosingTAGs.indexOf(tag) >= 0;
    return flag;
}

function parseJST(line) {
    var node = {
        type: 'js',
        tag: '',
        metas: {},
        children: []
    };
    var reg = /([^="\s\/]+)\s?(.+)?/g;
    var reg_each = /(.+)\sas\s(.+)\s(.+)$/g;
    var reg_if = /([^="\s\/]+)\s?(.+)?/g;
    var match = reg.exec(line);
    if (match && ['each', 'if', 'else'].indexOf(match[1]) != -1) {
        node.tag = match[1];
        switch (node.tag) {
            case 'if':
                node.metas.expression = match[2];
                break;
            case 'each':
                match = reg_each.exec(match[2]);
                node.metas.collection = match[1];
                node.metas.item = match[2];
                node.metas.index = match[3];
                break;
            case 'else':
                if (match[2] && match[2].length > 0) {
                    match = reg_if.exec(match[2]);
                    node.metas.expression = match[2];
                }
                break;
        }
    } else {
        node.tag = 'expression';
        node.metas = line;
    }
    return node;
}

function parseTAG(line) {
    var node = {
        type: 'element',
        tag: '',
        attrs: [],
        children: []
    };
    var firstBlankIndex = line.indexOf(' ');
    if (firstBlankIndex != -1) {
        node.tag = line.slice(0, firstBlankIndex).trim();
        line = line.slice(firstBlankIndex).trim();
        node.attrs = parseAttributes(line);
    } else {
        node.tag = line;
    }
    return node;
}

function parseAttrValue(text) {
    var reg_jst = /{([^}]+)}/g;
    var cursor_jst = 0;
    var match_jst;
    var res;
    while (match_jst = reg_jst.exec(text)) {
        var t = text.slice(cursor_jst, match_jst.index);
        var line_jst = match_jst[1];
        var node = parseJST(line_jst);
        var metas = node.metas;
        if (!res) {
            res = node;
            res.metas = '';
        }
        res.metas += res.metas.length > 0 ? '+' : '';
        res.metas += t.length > 0 ? "'" + t + "'" : '';
        res.metas += res.metas.length > 0 ? '+' : '';
        res.metas += metas;
        cursor_jst = match_jst.index + match_jst[0].length;
    }
    text = text.slice(cursor_jst);
    if (text.length > 0) {
        if (!res) {
            res = text;
        } else {
            res.metas += "+'" + text + "'";
        }
    }
    return res;
}

function parseAttributes(line) {
    var attrs = [];
    var reg = /([^="\s\/]+)((="([^"]+)")|(='([^']+)'))?/g;
    var match;
    while (match = reg.exec(line)) {
        var value = match[4] || match[6] || match[1];
        value = parseAttrValue(value);
        var attr = {
            type: 'attribute',
            name: match[1],
            value: value
        };
        attrs.push(attr);
    }
    return attrs;
}

function parseTpl(tpl) {
    var AST = [];
    var stack = [];
    stack.push(AST);

    var reg_tag = /<([^>]+)>/g;
    var cursor = 0;
    var match_tag = null;
    //parseTAG
    while (match_tag = reg_tag.exec(tpl)) {
        //parseJST
        var text = tpl.slice(cursor, match_tag.index).trim();
        if (text.length > 0) {
            var reg_jst = /{([^}]+)}/g;
            var cursor_jst = 0;
            var match_jst;
            while (match_jst = reg_jst.exec(text)) {
                var t = text.slice(cursor_jst, match_jst.index).trim();
                if (t.length > 0) {
                    var root = stack[stack.length - 1].children || stack[stack.length - 1];
                    root.push(t);
                }
                var line_jst = match_jst[1];
                if (line_jst.slice(0, 1) != "/") {
                    var node = parseJST(line_jst);
                    if (node.tag == 'else') {
                        var root = stack[stack.length - 1];
                        root.alternate = root.alternate || [];
                        root.alternate.push(node);
                    } else {
                        var root = stack[stack.length - 1].children || stack[stack.length - 1];
                        root.push(node);
                    }
                    if (node.tag != 'expression') {
                        stack.push(node);
                    }
                } else {
                    var root = stack.pop();
                    if (line_jst.slice(1) == 'if') {
                        while (root.tag != 'if') {
                            root = stack.pop();
                        }
                    }
                }
                cursor_jst = match_jst.index + match_jst[0].length;
            }
            text = text.slice(cursor_jst);
            if (text.length > 0) {
                var root = stack[stack.length - 1].children || stack[stack.length - 1];
                root.push(text);
            }
        }
        //
        var root = stack[stack.length - 1].children || stack[stack.length - 1];
        var line_tag = match_tag[1];
        if (line_tag.slice(0, 1) != "/") {
            var node = parseTAG(line_tag);
            root.push(node);
            if (!isSelfClosingTAG(node.tag)) {
                stack.push(node);
            }
        } else {
            stack.pop();
        }
        cursor = match_tag.index + match_tag[0].length;
    }
    return AST;
}

function parser(tpl) {
    var AST = parseTpl(tpl);
    AST = AST.length == 1 ? AST[0] : AST;
    return AST;
}

//exports
module.exports = parser;
},{"./util":12}],10:[function(require,module,exports){
var parser = require('./parser'),
    compiler = require('./compiler'),
    toDom = require('./todom');

function compile(tpl) {
    var AST = parser(tpl);
    var _render = compiler(AST);
    return function (data) {
        return toDom(_render(data));
    }
}

function render(tpl, data, container) {
    var el = compile(tpl)(data);
    container && container.appendChild(el);
    return el;
}

//exports
module.exports.compile = compile;
module.exports.render=render;
},{"./compiler":8,"./parser":9,"./todom":11}],11:[function(require,module,exports){
var _ = require('./util');

//Covert
//covert:node => DOM Element
function toElement(node) {
    var el = document.createElement(node.tag);
    node.attrs.forEach(function (attr) {
        if (_.isFunction(attr.value)) {
            el[attr.name] = attr.value;
        } else {
            attr.value && el.setAttribute(attr.name, attr.value);
        }
    });
    node.children.forEach(function (child) {
        if(child){
            if (!child.tag) {
                child = document.createTextNode(child);
            } else {
                child = toElement(child);
            }
            el.appendChild(child);
        }
    });
    return el;
}

//covert:nodelist => DOM Fragment
function toElements(nodelist) {
    var fragment = document.createDocumentFragment();
    nodelist.forEach(function (node) {
        fragment.appendChild(toElement(node));
    });
    return fragment;
}

function toDom(node) {
    node = _.isArray(node) && node.length == 1 ? node[0] : node;
    var dom = _.isArray(node) ? toElements(node) : toElement(node);
    return dom;
}

//exports
module.exports=toDom;
},{"./util":12}],12:[function(require,module,exports){
(function (process){
var _ = {}

//Util
_.type = function (obj) {
  return Object.prototype.toString.call(obj).replace(/\[object\s|\]/g, '')
}

_.isString = function isString (list) {
  return _.type(list) === 'String'
}

_.isArray = function (obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
}

_.isObject = function (obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
}

_.isFunction = function (obj) {
    return typeof obj == 'function' || false;
}

_.each = function each (array, fn) {
  for (var i = 0, len = array.length; i < len; i++) {
    fn(array[i], i)
  }
}

_.toArray = function toArray (listLike) {
  if (!listLike) {
    return []
  }

  var list = []

  for (var i = 0, len = listLike.length; i < len; i++) {
    list.push(listLike[i])
  }

  return list
}

_.setAttr = function setAttr (node, key, value) {
  switch (key) {
    case 'style':
      node.style.cssText = value
      break
    case 'value':
      var tagName = node.tagName || ''
      tagName = tagName.toLowerCase()
      if (
        tagName === 'input' || tagName === 'textarea'
      ) {
        node.value = value
      } else {
        // if it is not a input or textarea, use `setAttribute` to set
        node.setAttribute(key, value)
      }
      break
    default:
      node.setAttribute(key, value)
      break
  }
}

_.extend = function (dest, src) {
    for (var key in src) {
      if (src.hasOwnProperty(key)) {
        dest[key] = src[key]
      }
    }
    return dest
  }
  
  if (process.env.NODE_ENV) {
    _.nextTick = process.nextTick
  } else {
    var nextTick = window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame
  
    if (nextTick) {
      _.nextTick = function () {
        nextTick.apply(window, arguments)
      }
    } else {
      _.nextTick = function (func) {
        // for IE, setTimeout is a cool object instead of function
        // so you cannot simply use nextTick.apply
        setTimeout(func)
      }
    }
  }  

//exports
module.exports = _;
}).call(this,require('_process'))
},{"_process":22}],13:[function(require,module,exports){
var _ = require('../util')
var patch = require('./patch')
var listDiff = require('./listDiff').diff

function diff (oldTree, newTree) {
  var index = 0
  var patches = {}
  dfsWalk(oldTree, newTree, index, patches)
  return patches
}

function dfsWalk (oldNode, newNode, index, patches) {
  var currentPatch = []

  // Node is removed.
  if (newNode === null) {
    // Real DOM node will be removed when perform reordering, so has no needs to do anthings in here
  // TextNode content replacing
  } else if (_.isString(oldNode) && _.isString(newNode)) {
    if (newNode !== oldNode) {
      currentPatch.push({ type: patch.TEXT, content: newNode })
    }
  // Nodes are the same, diff old node's props and children
  } else if (
      oldNode.tagName === newNode.tagName &&
      oldNode.key === newNode.key
    ) {
    // Diff props
    var propsPatches = diffProps(oldNode, newNode)
    if (propsPatches) {
      currentPatch.push({ type: patch.PROPS, props: propsPatches })
    }
    // Diff children. If the node has a `ignore` property, do not diff children
    if (!isIgnoreChildren(newNode)) {
      diffChildren(
        oldNode.children,
        newNode.children,
        index,
        patches,
        currentPatch
      )
    }
  // Nodes are not the same, replace the old node with new node
  } else {
    currentPatch.push({ type: patch.REPLACE, node: newNode })
  }

  if (currentPatch.length) {
    patches[index] = currentPatch
  }
}

function diffChildren (oldChildren, newChildren, index, patches, currentPatch) {
  var diffs = listDiff(oldChildren, newChildren, 'key')
  newChildren = diffs.children

  if (diffs.moves.length) {
    var reorderPatch = { type: patch.REORDER, moves: diffs.moves }
    currentPatch.push(reorderPatch)
  }

  var leftNode = null
  var currentNodeIndex = index
  _.each(oldChildren, function (child, i) {
    var newChild = newChildren[i]
    currentNodeIndex = (leftNode && leftNode.count)
      ? currentNodeIndex + leftNode.count + 1
      : currentNodeIndex + 1
    dfsWalk(child, newChild, currentNodeIndex, patches)
    leftNode = child
  })
}

function diffProps (oldNode, newNode) {
  var count = 0
  var oldProps = oldNode.props
  var newProps = newNode.props

  var key, value
  var propsPatches = {}

  // Find out different properties
  for (key in oldProps) {
    value = oldProps[key]
    if (newProps[key] !== value) {
      count++
      propsPatches[key] = newProps[key]
    }
  }

  // Find out new property
  for (key in newProps) {
    value = newProps[key]
    if (!oldProps.hasOwnProperty(key)) {
      count++
      propsPatches[key] = newProps[key]
    }
  }

  // If properties all are identical
  if (count === 0) {
    return null
  }

  return propsPatches
}

function isIgnoreChildren (node) {
  return (node.props && node.props.hasOwnProperty('ignore'))
}

module.exports = diff
},{"../util":12,"./listDiff":15,"./patch":16}],14:[function(require,module,exports){
var _ = require('../util')

/**
 * Virtual-dom Element.
 * @param {String} tagName
 * @param {Object} props - Element's properties,
 *                       - using object to store key-value pair
 * @param {Array<Element|String>} - This element's children elements.
 *                                - Can be Element instance or just a piece plain text.
 */
function Element (tagName, props, children) {
  if (!(this instanceof Element)) {
    return new Element(tagName, props, children)
  }

  if (_.isArray(props)) {
    children = props
    props = {}
  }

  this.tagName = tagName
  this.props = props || {}
  this.children = children || []
  this.key = props
    ? props.key
    : void 666

  var count = 0

  _.each(this.children, function (child, i) {
    if (child instanceof Element) {
      count += child.count
    } else {
      children[i] = '' + child
    }
    count++
  })

  this.count = count
}

/**
 * Render the hold element tree.
 */
Element.prototype.render = function () {
  var el = document.createElement(this.tagName)
  var props = this.props

  for (var propName in props) {
    var propValue = props[propName]
    _.setAttr(el, propName, propValue)
  }

  _.each(this.children, function (child) {
    var childEl = (child instanceof Element)
      ? child.render()
      : document.createTextNode(child)
    el.appendChild(childEl)
  })

  return el
}

module.exports = Element
},{"../util":12}],15:[function(require,module,exports){
/**
 * Diff two list in O(N).
 * @param {Array} oldList - Original List
 * @param {Array} newList - List After certain insertions, removes, or moves
 * @return {Object} - {moves: <Array>}
 *                  - moves is a list of actions that telling how to remove and insert
 */
function diff (oldList, newList, key) {
  var oldMap = makeKeyIndexAndFree(oldList, key)
  var newMap = makeKeyIndexAndFree(newList, key)

  var newFree = newMap.free

  var oldKeyIndex = oldMap.keyIndex
  var newKeyIndex = newMap.keyIndex

  var moves = []

  // a simulate list to manipulate
  var children = []
  var i = 0
  var item
  var itemKey
  var freeIndex = 0

  // fist pass to check item in old list: if it's removed or not
  while (i < oldList.length) {
    item = oldList[i]
    itemKey = getItemKey(item, key)
    if (itemKey) {
      if (!newKeyIndex.hasOwnProperty(itemKey)) {
        children.push(null)
      } else {
        var newItemIndex = newKeyIndex[itemKey]
        children.push(newList[newItemIndex])
      }
    } else {
      var freeItem = newFree[freeIndex++]
      children.push(freeItem || null)
    }
    i++
  }

  var simulateList = children.slice(0)

  // remove items no longer exist
  i = 0
  while (i < simulateList.length) {
    if (simulateList[i] === null) {
      remove(i)
      removeSimulate(i)
    } else {
      i++
    }
  }

  // i is cursor pointing to a item in new list
  // j is cursor pointing to a item in simulateList
  var j = i = 0
  while (i < newList.length) {
    item = newList[i]
    itemKey = getItemKey(item, key)

    var simulateItem = simulateList[j]
    var simulateItemKey = getItemKey(simulateItem, key)

    if (simulateItem) {
      if (itemKey === simulateItemKey) {
        j++
      } else {
        // new item, just inesrt it
        if (!oldKeyIndex.hasOwnProperty(itemKey)) {
          insert(i, item)
        } else {
          // if remove current simulateItem make item in right place
          // then just remove it
          var nextItemKey = getItemKey(simulateList[j + 1], key)
          if (nextItemKey === itemKey) {
            remove(i)
            removeSimulate(j)
            j++ // after removing, current j is right, just jump to next one
          } else {
            // else insert item
            insert(i, item)
          }
        }
      }
    } else {
      insert(i, item)
    }

    i++
  }

  function remove (index) {
    var move = {index: index, type: 0}
    moves.push(move)
  }

  function insert (index, item) {
    var move = {index: index, item: item, type: 1}
    moves.push(move)
  }

  function removeSimulate (index) {
    simulateList.splice(index, 1)
  }

  return {
    moves: moves,
    children: children
  }
}

/**
 * Convert list to key-item keyIndex object.
 * @param {Array} list
 * @param {String|Function} key
 */
function makeKeyIndexAndFree (list, key) {
  var keyIndex = {}
  var free = []
  for (var i = 0, len = list.length; i < len; i++) {
    var item = list[i]
    var itemKey = getItemKey(item, key)
    if (itemKey) {
      keyIndex[itemKey] = i
    } else {
      free.push(item)
    }
  }
  return {
    keyIndex: keyIndex,
    free: free
  }
}

function getItemKey (item, key) {
  if (!item || !key) return void 666
  return typeof key === 'string'
    ? item[key]
    : key(item)
}

exports.makeKeyIndexAndFree = makeKeyIndexAndFree // exports for test
exports.diff = diff
},{}],16:[function(require,module,exports){

var _ = require('../util')

var REPLACE = 0
var REORDER = 1
var PROPS = 2
var TEXT = 3

function patch (node, patches) {
  var walker = {index: 0}
  dfsWalk(node, walker, patches)
}

function dfsWalk (node, walker, patches) {
  var currentPatches = patches[walker.index]

  var len = node.childNodes
    ? node.childNodes.length
    : 0
  for (var i = 0; i < len; i++) {
    var child = node.childNodes[i]
    walker.index++
    dfsWalk(child, walker, patches)
  }

  if (currentPatches) {
    applyPatches(node, currentPatches)
  }
}

function applyPatches (node, currentPatches) {
  _.each(currentPatches, function (currentPatch) {
    switch (currentPatch.type) {
      case REPLACE:
        var newNode = (typeof currentPatch.node === 'string')
          ? document.createTextNode(currentPatch.node)
          : currentPatch.node.render()
        node.parentNode.replaceChild(newNode, node)
        break
      case REORDER:
        reorderChildren(node, currentPatch.moves)
        break
      case PROPS:
        setProps(node, currentPatch.props)
        break
      case TEXT:
        if (node.textContent) {
          node.textContent = currentPatch.content
        } else {
          // fuck ie
          node.nodeValue = currentPatch.content
        }
        break
      default:
        throw new Error('Unknown patch type ' + currentPatch.type)
    }
  })
}

function setProps (node, props) {
  for (var key in props) {
    if (props[key] === void 666) {
      node.removeAttribute(key)
    } else {
      var value = props[key]
      _.setAttr(node, key, value)
    }
  }
}

function reorderChildren (node, moves) {
  var staticNodeList = _.toArray(node.childNodes)
  var maps = {}

  _.each(staticNodeList, function (node) {
    if (node.nodeType === 1) {
      var key = node.getAttribute('key')
      if (key) {
        maps[key] = node
      }
    }
  })

  _.each(moves, function (move) {
    var index = move.index
    if (move.type === 0) { // remove item
      if (staticNodeList[index] === node.childNodes[index]) { // maybe have been removed for inserting
        node.removeChild(node.childNodes[index])
      }
      staticNodeList.splice(index, 1)
    } else if (move.type === 1) { // insert item
      var insertNode = maps[move.item.key]
        ? maps[move.item.key] // reuse old item
        : (typeof move.item === 'object')
            ? move.item.render()
            : document.createTextNode(move.item)
      staticNodeList.splice(index, 0, insertNode)
      node.insertBefore(insertNode, node.childNodes[index] || null)
    }
  })
}

patch.REPLACE = REPLACE
patch.REORDER = REORDER
patch.PROPS = PROPS
patch.TEXT = TEXT

module.exports = patch
},{"../util":12}],17:[function(require,module,exports){
module.exports.el = require('./element')
module.exports.diff = require('./diff')
module.exports.patch = require('./patch')
},{"./diff":13,"./element":14,"./patch":16}],18:[function(require,module,exports){

var _ = require('./util');
var svd = require('./virtual-dom/virtual-dom');
var toDom = require('./todom');
var diff = svd.diff;
var patch = svd.patch;


function makeTemplateClass (compileFn) {
  function VirtualTemplate (data) {
    this.data = data;
    var domAndVdom = this.makeVirtualDOM();
    this.vdom = domAndVdom.vdom;
    this.dom = domAndVdom.dom;
    this.isDirty = false;
    this.flushCallbacks = [];
  }

  _.extend(VirtualTemplate.prototype, {
    compileFn: compileFn,
    setData: setData,
    makeVirtualDOM: makeVirtualDOM,
    flush: flush
  });

  return VirtualTemplate;
}

function setData(data, isSync) {
  _.extend(this.data, data);
  if (typeof isSync === 'boolean' && isSync) {
    this.flush();
  } else if (!this.isDirty) {
    this.isDirty = true;
    var self = this;
    // cache all data change, and only refresh dom before browser's repainting
    _.nextTick(function () {
      self.flush();
    });
  }
  if (typeof isSync === 'function') {
    var callback = isSync;
    this.flushCallbacks.push(callback);
  }
}

function flush() {
  // run virtual-dom algorithm
  var newVdom = this.makeVirtualDOM().vdom;
  var patches = diff(this.vdom, newVdom);
  patch(this.dom, patches);
  this.vdom = newVdom;
  this.isDirty = false;
  var callbacks = this.flushCallbacks;
  for (var i = 0, len = callbacks.length; i < len; i++) {
    if (callbacks[i]) {
      callbacks[i]();
    }
  }
  this.flushCallbacks = [];
}

function makeVirtualDOM() {
  var node = this.compileFn(this.data);
  if(_.isArray(node)){
    node={
      tag:'div',
      attrs:[],
      children:node
    }
  }
  return {
    dom:toDom(node),
    vdom:toVirtualDOM(node)
  }
}

function toVirtualDOM(node) {
  var tagName = node.tag.toLowerCase();
  var props ={};
  var children = [];
  node.attrs.forEach(function(a,i){
    if(a.value){
      props[a.name]=a.value;
    }
  });
  node.children.forEach(function (c, i) {
    if(c){
      if(c.tag){
        children.push(toVirtualDOM(c));
      }else{
        children.push(c);
      }
    }
  });
  return svd.el(tagName, props, children);
}

module.exports = function (compileFn) {
  return  makeTemplateClass(compileFn);
}
},{"./todom":11,"./util":12,"./virtual-dom/virtual-dom":17}],19:[function(require,module,exports){
var parser = require('./parser'),
    compiler = require('./compiler'),
    vTemplate=require('./virtual-template');

function vtpl(tpl){
    var AST = parser(tpl);
    var _render = compiler(AST);
    return vTemplate(_render);
}

//exports
module.exports=vtpl;
},{"./compiler":8,"./parser":9,"./virtual-template":18}],20:[function(require,module,exports){


/****************************************************************** 
 * @touch
 * Description:移动端手势识别辅助
 *******************************************************************/
var touch = require('./lib/touch');
module.exports=touch;
},{"./lib/touch":21}],21:[function(require,module,exports){

var utils = {};

utils.PCevts = {
    'touchstart': 'mousedown',
    'touchmove': 'mousemove',
    'touchend': 'mouseup',
    'touchcancel': 'mouseout'
};

utils.hasTouch = ('ontouchstart' in window);

utils.getType = function (obj) {
    return Object.prototype.toString.call(obj).match(/\s([a-z|A-Z]+)/)[1].toLowerCase();
};

utils.getSelector = function (el) {
    if (el.id) {
        return "#" + el.id;
    }
    if (el.className) {
        var cns = el.className.split(/\s+/);
        return "." + cns.join(".");
    } else if (el === document) {
        return "body";
    } else {
        return el.tagName.toLowerCase();
    }
};

utils.matchSelector = function (target, selector) {
    return target.webkitMatchesSelector(selector);
};

utils.getEventListeners = function (el) {
    return el.listeners;
};

utils.getPCevts = function (evt) {
    return this.PCevts[evt] || evt;
};

utils.forceReflow = function () {
    var tempDivID = "reflowDivBlock";
    var domTreeOpDiv = document.getElementById(tempDivID);
    if (!domTreeOpDiv) {
        domTreeOpDiv = document.createElement("div");
        domTreeOpDiv.id = tempDivID;
        document.body.appendChild(domTreeOpDiv);
    }
    var parentNode = domTreeOpDiv.parentNode;
    var nextSibling = domTreeOpDiv.nextSibling;
    parentNode.removeChild(domTreeOpDiv);
    parentNode.insertBefore(domTreeOpDiv, nextSibling);
};

utils.simpleClone = function (obj) {
    return Object.create(obj);
};

utils.getPosOfEvent = function (ev) {
    if (this.hasTouch) {
        var posi = [];
        var src = null;

        for (var t = 0, len = ev.touches.length; t < len; t++) {
            src = ev.touches[t];
            posi.push({
                x: src.pageX,
                y: src.pageY
            });
        }
        return posi;
    } else {
        return [{
            x: ev.pageX,
            y: ev.pageY
        }];
    }
};

utils.getDistance = function (pos1, pos2) {
    var x = pos2.x - pos1.x,
        y = pos2.y - pos1.y;
    return Math.sqrt((x * x) + (y * y));
};

utils.getFingers = function (ev) {
    return ev.touches ? ev.touches.length : 1;
};

utils.calScale = function (pstart, pmove) {
    if (pstart.length >= 2 && pmove.length >= 2) {
        var disStart = this.getDistance(pstart[1], pstart[0]);
        var disEnd = this.getDistance(pmove[1], pmove[0]);

        return disEnd / disStart;
    }
    return 1;
};

utils.getAngle = function (p1, p2) {
    return Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
};

utils.getAngle180 = function (p1, p2) {
    var agl = Math.atan((p2.y - p1.y) * -1 / (p2.x - p1.x)) * (180 / Math.PI);
    return (agl < 0 ? (agl + 180) : agl);
};

utils.getDirectionFromAngle = function (agl) {
    var directions = {
        up: agl < -45 && agl > -135,
        down: agl >= 45 && agl < 135,
        left: agl >= 135 || agl <= -135,
        right: agl >= -45 && agl <= 45
    };
    for (var key in directions) {
        if (directions[key]) return key;
    }
    return null;
};

utils.getXYByElement = function (el) {
    var left = 0,
        top = 0;

    while (el.offsetParent) {
        left += el.offsetLeft;
        top += el.offsetTop;
        el = el.offsetParent;
    }
    return {
        left: left,
        top: top
    };
};

utils.reset = function () {
    startEvent = moveEvent = endEvent = null;
    __tapped = __touchStart = startSwiping = startPinch = false;
    startDrag = false;
    pos = {};
    __rotation_single_finger = false;
};

utils.isTouchMove = function (ev) {
    return (ev.type === 'touchmove' || ev.type === 'mousemove');
};

utils.isTouchEnd = function (ev) {
    return (ev.type === 'touchend' || ev.type === 'mouseup' || ev.type === 'touchcancel');
};

utils.env = (function () {
    var os = {},
        ua = navigator.userAgent,
        android = ua.match(/(Android)[\s\/]+([\d\.]+)/),
        ios = ua.match(/(iPad|iPhone|iPod)\s+OS\s([\d_\.]+)/),
        wp = ua.match(/(Windows\s+Phone)\s([\d\.]+)/),
        isWebkit = /WebKit\/[\d.]+/i.test(ua),
        isSafari = ios ? (navigator.standalone ? isWebkit : (/Safari/i.test(ua) && !/CriOS/i.test(ua) && !/MQQBrowser/i.test(ua))) : false;
    if (android) {
        os.android = true;
        os.version = android[2];
    }
    if (ios) {
        os.ios = true;
        os.version = ios[2].replace(/_/g, '.');
        os.ios7 = /^7/.test(os.version);
        if (ios[1] === 'iPad') {
            os.ipad = true;
        } else if (ios[1] === 'iPhone') {
            os.iphone = true;
            os.iphone5 = screen.height == 568;
        } else if (ios[1] === 'iPod') {
            os.ipod = true;
        }
    }
    if (wp) {
        os.wp = true;
        os.version = wp[2];
        os.wp8 = /^8/.test(os.version);
    }
    if (isWebkit) {
        os.webkit = true;
    }
    if (isSafari) {
        os.safari = true;
    }
    return os;
})();

/** 底层事件绑定/代理支持  */
var engine = {
    proxyid: 0,
    proxies: [],
    trigger: function (el, evt, detail) {

        detail = detail || {};
        var e, opt = {
            bubbles: true,
            cancelable: true,
            detail: detail
        };

        try {
            if (typeof CustomEvent !== 'undefined') {
                e = new CustomEvent(evt, opt);
                if (el) {
                    el.dispatchEvent(e);
                }
            } else {
                e = document.createEvent("CustomEvent");
                e.initCustomEvent(evt, true, true, detail);
                if (el) {
                    el.dispatchEvent(e);
                }
            }
        } catch (ex) {
            console.warn("Touch.js is not supported by environment.");
        }
    },
    bind: function (el, evt, handler) {
        el.listeners = el.listeners || {};
        if (!el.listeners[evt]) {
            el.listeners[evt] = [handler];
        } else {
            el.listeners[evt].push(handler);
        }
        var proxy = function (e) {
            if (utils.env.ios7) {
                utils.forceReflow();
            }
            e.originEvent = e;
            for (var p in e.detail) {
                if (p !== 'type') {
                    e[p] = e.detail[p];
                }
            }
            e.startRotate = function () {
                __rotation_single_finger = true;
            };
            var returnValue = handler.call(e.target, e);
            if (typeof returnValue !== "undefined" && !returnValue) {
                e.stopPropagation();
                e.preventDefault();
            }
        };
        handler.proxy = handler.proxy || {};
        if (!handler.proxy[evt]) {
            handler.proxy[evt] = [this.proxyid++];
        } else {
            handler.proxy[evt].push(this.proxyid++);
        }
        this.proxies.push(proxy);
        if (el.addEventListener) {
            el.addEventListener(evt, proxy, false);
        }
    },
    unbind: function (el, evt, handler) {
        if (!handler) {
            var handlers = el.listeners[evt];
            if (handlers && handlers.length) {
                handlers.forEach(function (handler) {
                    el.removeEventListener(evt, handler, false);
                });
            }
        } else {
            var proxyids = handler.proxy[evt];
            if (proxyids && proxyids.length) {
                proxyids.forEach(function (proxyid) {
                    if (el.removeEventListener) {
                        el.removeEventListener(evt, engine.proxies[proxyid], false);
                    }
                });
            }
        }
    },
    delegate: function (el, evt, sel, handler) {
        var proxy = function (e) {
            var target, returnValue;
            e.originEvent = e;
            for (var p in e.detail) {
                if (p !== 'type') {
                    e[p] = e.detail[p];
                }
            }
            e.startRotate = function () {
                __rotation_single_finger = true;
            };
            var integrateSelector = utils.getSelector(el) + " " + sel;
            var match = utils.matchSelector(e.target, integrateSelector);
            var ischild = utils.matchSelector(e.target, integrateSelector + " " + e.target.nodeName);
            if (!match && ischild) {
                if (utils.env.ios7) {
                    utils.forceReflow();
                }
                target = e.target;
                while (!utils.matchSelector(target, integrateSelector)) {
                    target = target.parentNode;
                }
                returnValue = handler.call(e.target, e);
                if (typeof returnValue !== "undefined" && !returnValue) {
                    e.stopPropagation();
                    e.preventDefault();
                }
            } else {
                if (utils.env.ios7) {
                    utils.forceReflow();
                }
                if (match || ischild) {
                    returnValue = handler.call(e.target, e);
                    if (typeof returnValue !== "undefined" && !returnValue) {
                        e.stopPropagation();
                        e.preventDefault();
                    }
                }
            }
        };
        handler.proxy = handler.proxy || {};
        if (!handler.proxy[evt]) {
            handler.proxy[evt] = [this.proxyid++];
        } else {
            handler.proxy[evt].push(this.proxyid++);
        }
        this.proxies.push(proxy);
        el.listeners = el.listeners || {};
        if (!el.listeners[evt]) {
            el.listeners[evt] = [proxy];
        } else {
            el.listeners[evt].push(proxy);
        }
        if (el.addEventListener) {
            el.addEventListener(evt, proxy, false);
        }
    },
    undelegate: function (el, evt, sel, handler) {
        if (!handler) {
            var listeners = el.listeners[evt];
            listeners.forEach(function (proxy) {
                el.removeEventListener(evt, proxy, false);
            });
        } else {
            var proxyids = handler.proxy[evt];
            if (proxyids.length) {
                proxyids.forEach(function (proxyid) {
                    if (el.removeEventListener) {
                        el.removeEventListener(evt, engine.proxies[proxyid], false);
                    }
                });
            }
        }
    }
};

var config = {
    tap: true,
    doubleTap: true,
    tapMaxDistance: 10,
    hold: true,
    tapTime: 200,
    holdTime: 650,
    maxDoubleTapInterval: 300,
    swipe: true,
    swipeTime: 300,
    swipeMinDistance: 18,
    swipeFactor: 5,
    drag: true,
    pinch: true,
    minScaleRate: 0,
    minRotationAngle: 0
};

var smrEventList = {
    TOUCH_START: 'touchstart',
    TOUCH_MOVE: 'touchmove',
    TOUCH_END: 'touchend',
    TOUCH_CANCEL: 'touchcancel',
    MOUSE_DOWN: 'mousedown',
    MOUSE_MOVE: 'mousemove',
    MOUSE_UP: 'mouseup',
    CLICK: 'click',
    PINCH_START: 'pinchstart',
    PINCH_END: 'pinchend',
    PINCH: 'pinch',
    PINCH_IN: 'pinchin',
    PINCH_OUT: 'pinchout',
    ROTATION_LEFT: 'rotateleft',
    ROTATION_RIGHT: 'rotateright',
    ROTATION: 'rotate',
    SWIPE_START: 'swipestart',
    SWIPING: 'swiping',
    SWIPE_END: 'swipeend',
    SWIPE_LEFT: 'swipeleft',
    SWIPE_RIGHT: 'swiperight',
    SWIPE_UP: 'swipeup',
    SWIPE_DOWN: 'swipedown',
    SWIPE: 'swipe',
    DRAG: 'drag',
    DRAGSTART: 'dragstart',
    DRAGEND: 'dragend',
    HOLD: 'hold',
    TAP: 'tap',
    DOUBLE_TAP: 'doubletap'
};

/** 手势识别 */
var pos = {
    start: null,
    move: null,
    end: null
};

var startTime = 0;
var fingers = 0;
var startEvent = null;
var moveEvent = null;
var endEvent = null;
var startSwiping = false;
var startPinch = false;
var startDrag = false;

var __offset = {};
var __touchStart = false;
var __holdTimer = null;
var __tapped = false;
var __lastTapEndTime = null;
var __tapTimer = null;

var __scale_last_rate = 1;
var __rotation_single_finger = false;
var __rotation_single_start = [];
var __initial_angle = 0;
var __rotation = 0;

var __prev_tapped_end_time = 0;
var __prev_tapped_pos = null;

var gestures = {
    getAngleDiff: function (currentPos) {
        var diff = parseInt(__initial_angle - utils.getAngle180(currentPos[0], currentPos[1]), 10);
        var count = 0;

        while (Math.abs(diff - __rotation) > 90 && count++ < 50) {
            if (__rotation < 0) {
                diff -= 180;
            } else {
                diff += 180;
            }
        }
        __rotation = parseInt(diff, 10);
        return __rotation;
    },
    pinch: function (ev) {
        var el = ev.target;
        if (config.pinch) {
            if (!__touchStart) return;
            if (utils.getFingers(ev) < 2) {
                if (!utils.isTouchEnd(ev)) return;
            }
            var scale = utils.calScale(pos.start, pos.move);
            var rotation = this.getAngleDiff(pos.move);
            var eventObj = {
                type: '',
                originEvent: ev,
                scale: scale,
                rotation: rotation,
                direction: (rotation > 0 ? 'right' : 'left'),
                fingersCount: utils.getFingers(ev)
            };
            if (!startPinch) {
                startPinch = true;
                eventObj.fingerStatus = "start";
                engine.trigger(el, smrEventList.PINCH_START, eventObj);
            } else if (utils.isTouchMove(ev)) {
                eventObj.fingerStatus = "move";
                engine.trigger(el, smrEventList.PINCH, eventObj);
            } else if (utils.isTouchEnd(ev)) {
                eventObj.fingerStatus = "end";
                engine.trigger(el, smrEventList.PINCH_END, eventObj);
                utils.reset();
            }

            if (Math.abs(1 - scale) > config.minScaleRate) {
                var scaleEv = utils.simpleClone(eventObj);

                //手势放大, 触发pinchout事件
                var scale_diff = 0.00000000001; //防止touchend的scale与__scale_last_rate相等，不触发事件的情况。
                if (scale > __scale_last_rate) {
                    __scale_last_rate = scale - scale_diff;
                    engine.trigger(el, smrEventList.PINCH_OUT, scaleEv, false);
                } //手势缩小,触发pinchin事件
                else if (scale < __scale_last_rate) {
                    __scale_last_rate = scale + scale_diff;
                    engine.trigger(el, smrEventList.PINCH_IN, scaleEv, false);
                }

                if (utils.isTouchEnd(ev)) {
                    __scale_last_rate = 1;
                }
            }

            if (Math.abs(rotation) > config.minRotationAngle) {
                var rotationEv = utils.simpleClone(eventObj),
                    eventType;

                eventType = rotation > 0 ? smrEventList.ROTATION_RIGHT : smrEventList.ROTATION_LEFT;
                engine.trigger(el, eventType, rotationEv, false);
                engine.trigger(el, smrEventList.ROTATION, eventObj);
            }

        }
    },
    rotateSingleFinger: function (ev) {
        var el = ev.target;
        if (__rotation_single_finger && utils.getFingers(ev) < 2) {
            if (!pos.move) return;
            if (__rotation_single_start.length < 2) {
                var docOff = utils.getXYByElement(el);

                __rotation_single_start = [{
                        x: docOff.left + el.offsetWidth / 2,
                        y: docOff.top + el.offsetHeight / 2
                    },
                    pos.move[0]
                ];
                __initial_angle = parseInt(utils.getAngle180(__rotation_single_start[0], __rotation_single_start[1]), 10);
            }
            var move = [__rotation_single_start[0], pos.move[0]];
            var rotation = this.getAngleDiff(move);
            var eventObj = {
                type: '',
                originEvent: ev,
                rotation: rotation,
                direction: (rotation > 0 ? 'right' : 'left'),
                fingersCount: utils.getFingers(ev)
            };
            if (utils.isTouchMove(ev)) {
                eventObj.fingerStatus = "move";
            } else if (utils.isTouchEnd(ev) || ev.type === 'mouseout') {
                eventObj.fingerStatus = "end";
                engine.trigger(el, smrEventList.PINCH_END, eventObj);
                utils.reset();
            }
            var eventType = rotation > 0 ? smrEventList.ROTATION_RIGHT : smrEventList.ROTATION_LEFT;
            engine.trigger(el, eventType, eventObj);
            engine.trigger(el, smrEventList.ROTATION, eventObj);
        }
    },
    swipe: function (ev) {
        var el = ev.target;
        if (!__touchStart || !pos.move || utils.getFingers(ev) > 1) {
            return;
        }

        var now = Date.now();
        var touchTime = now - startTime;
        var distance = utils.getDistance(pos.start[0], pos.move[0]);
        var position = {
            x: pos.move[0].x - __offset.left,
            y: pos.move[0].y - __offset.top
        };
        var angle = utils.getAngle(pos.start[0], pos.move[0]);
        var direction = utils.getDirectionFromAngle(angle);
        var touchSecond = touchTime / 1000;
        var factor = ((10 - config.swipeFactor) * 10 * touchSecond * touchSecond);
        var eventObj = {
            type: smrEventList.SWIPE,
            originEvent: ev,
            position: position,
            direction: direction,
            distance: distance,
            distanceX: pos.move[0].x - pos.start[0].x,
            distanceY: pos.move[0].y - pos.start[0].y,
            x: pos.move[0].x - pos.start[0].x,
            y: pos.move[0].y - pos.start[0].y,
            angle: angle,
            duration: touchTime,
            fingersCount: utils.getFingers(ev),
            factor: factor
        };
        if (config.swipe) {
            var swipeTo = function () {
                var elt = smrEventList;
                switch (direction) {
                    case 'up':
                        engine.trigger(el, elt.SWIPE_UP, eventObj);
                        break;
                    case 'down':
                        engine.trigger(el, elt.SWIPE_DOWN, eventObj);
                        break;
                    case 'left':
                        engine.trigger(el, elt.SWIPE_LEFT, eventObj);
                        break;
                    case 'right':
                        engine.trigger(el, elt.SWIPE_RIGHT, eventObj);
                        break;
                }
            };

            if (!startSwiping) {
                eventObj.fingerStatus = eventObj.swipe = 'start';
                startSwiping = true;
                engine.trigger(el, smrEventList.SWIPE_START, eventObj);
            } else if (utils.isTouchMove(ev)) {
                eventObj.fingerStatus = eventObj.swipe = 'move';
                engine.trigger(el, smrEventList.SWIPING, eventObj);

                if (touchTime > config.swipeTime && touchTime < config.swipeTime + 50 && distance > config.swipeMinDistance) {
                    swipeTo();
                    engine.trigger(el, smrEventList.SWIPE, eventObj, false);
                }
            } else if (utils.isTouchEnd(ev) || ev.type === 'mouseout') {
                eventObj.fingerStatus = eventObj.swipe = 'end';
                engine.trigger(el, smrEventList.SWIPE_END, eventObj);

                if (config.swipeTime > touchTime && distance > config.swipeMinDistance) {
                    swipeTo();
                    engine.trigger(el, smrEventList.SWIPE, eventObj, false);
                }
            }
        }

        if (config.drag) {
            if (!startDrag) {
                eventObj.fingerStatus = eventObj.swipe = 'start';
                startDrag = true;
                engine.trigger(el, smrEventList.DRAGSTART, eventObj);
            } else if (utils.isTouchMove(ev)) {
                eventObj.fingerStatus = eventObj.swipe = 'move';
                engine.trigger(el, smrEventList.DRAG, eventObj);
            } else if (utils.isTouchEnd(ev)) {
                eventObj.fingerStatus = eventObj.swipe = 'end';
                engine.trigger(el, smrEventList.DRAGEND, eventObj);
            }

        }
    },
    tap: function (ev) {
        var el = ev.target;
        if (config.tap) {
            var now = Date.now();
            var touchTime = now - startTime;
            var distance = utils.getDistance(pos.start[0], pos.move ? pos.move[0] : pos.start[0]);

            clearTimeout(__holdTimer);
            var isDoubleTap = (function () {
                if (__prev_tapped_pos && config.doubleTap && (startTime - __prev_tapped_end_time) < config.maxDoubleTapInterval) {
                    var doubleDis = utils.getDistance(__prev_tapped_pos, pos.start[0]);
                    if (doubleDis < 16) return true;
                }
                return false;
            })();

            if (isDoubleTap) {
                clearTimeout(__tapTimer);
                engine.trigger(el, smrEventList.DOUBLE_TAP, {
                    type: smrEventList.DOUBLE_TAP,
                    originEvent: ev,
                    position: pos.start[0]
                });
                return;
            }

            if (config.tapMaxDistance < distance) return;

            if (config.holdTime > touchTime && utils.getFingers(ev) <= 1) {
                __tapped = true;
                __prev_tapped_end_time = now;
                __prev_tapped_pos = pos.start[0];
                __tapTimer = setTimeout(function () {
                        engine.trigger(el, smrEventList.TAP, {
                            type: smrEventList.TAP,
                            originEvent: ev,
                            fingersCount: utils.getFingers(ev),
                            position: __prev_tapped_pos
                        });
                    },
                    config.tapTime);
            }
        }
    },
    hold: function (ev) {
        var el = ev.target;
        if (config.hold) {
            clearTimeout(__holdTimer);

            __holdTimer = setTimeout(function () {
                    if (!pos.start) return;
                    var distance = utils.getDistance(pos.start[0], pos.move ? pos.move[0] : pos.start[0]);
                    if (config.tapMaxDistance < distance) return;

                    if (!__tapped) {
                        engine.trigger(el, "hold", {
                            type: 'hold',
                            originEvent: ev,
                            fingersCount: utils.getFingers(ev),
                            position: pos.start[0]
                        });
                    }
                },
                config.holdTime);
        }
    }
};

var handlerOriginEvent = function (ev) {

    var el = ev.target;
    switch (ev.type) {
        case 'touchstart':
        case 'mousedown':
            __rotation_single_start = [];
            __touchStart = true;
            if (!pos.start || pos.start.length < 2) {
                pos.start = utils.getPosOfEvent(ev);
            }
            if (utils.getFingers(ev) >= 2) {
                __initial_angle = parseInt(utils.getAngle180(pos.start[0], pos.start[1]), 10);
            }

            startTime = Date.now();
            startEvent = ev;
            __offset = {};

            var box = el.getBoundingClientRect();
            var docEl = document.documentElement;
            __offset = {
                top: box.top + (window.pageYOffset || docEl.scrollTop) - (docEl.clientTop || 0),
                left: box.left + (window.pageXOffset || docEl.scrollLeft) - (docEl.clientLeft || 0)
            };

            gestures.hold(ev);
            break;
        case 'touchmove':
        case 'mousemove':
            if (!__touchStart || !pos.start) return;
            pos.move = utils.getPosOfEvent(ev);
            if (utils.getFingers(ev) >= 2) {
                gestures.pinch(ev);
            } else if (__rotation_single_finger) {
                gestures.rotateSingleFinger(ev);
            } else {
                gestures.swipe(ev);
            }
            break;
        case 'touchend':
        case 'touchcancel':
        case 'mouseup':
        case 'mouseout':
            if (!__touchStart) return;
            endEvent = ev;

            if (startPinch) {
                gestures.pinch(ev);
            } else if (__rotation_single_finger) {
                gestures.rotateSingleFinger(ev);
            } else if (startSwiping) {
                gestures.swipe(ev);
            } else {
                gestures.tap(ev);
            }

            utils.reset();
            __initial_angle = 0;
            __rotation = 0;
            if (ev.touches && ev.touches.length === 1) {
                __touchStart = true;
                __rotation_single_finger = true;
            }
            break;
    }
};

var _on = function () {

    var evts, handler, evtMap, sel, args = arguments;
    if (args.length < 2 || args > 4) {
        return console.error("unexpected arguments!");
    }
    var els = utils.getType(args[0]) === 'string' ? document.querySelectorAll(args[0]) : args[0];
    els = els.length ? Array.prototype.slice.call(els) : [els];
    //事件绑定
    if (args.length === 3 && utils.getType(args[1]) === 'string') {
        evts = args[1].split(" ");
        handler = args[2];
        evts.forEach(function (evt) {
            if (!utils.hasTouch) {
                evt = utils.getPCevts(evt);
            }
            els.forEach(function (el) {
                engine.bind(el, evt, handler);
            });
        });
        return;
    }

    function evtMapDelegate(evt) {
        if (!utils.hasTouch) {
            evt = utils.getPCevts(evt);
        }
        els.forEach(function (el) {
            engine.delegate(el, evt, sel, evtMap[evt]);
        });
    }
    //mapEvent delegate
    if (args.length === 3 && utils.getType(args[1]) === 'object') {
        evtMap = args[1];
        sel = args[2];
        for (var evt1 in evtMap) {
            evtMapDelegate(evt1);
        }
        return;
    }

    function evtMapBind(evt) {
        if (!utils.hasTouch) {
            evt = utils.getPCevts(evt);
        }
        els.forEach(function (el) {
            engine.bind(el, evt, evtMap[evt]);
        });
    }

    //mapEvent bind
    if (args.length === 2 && utils.getType(args[1]) === 'object') {
        evtMap = args[1];
        for (var evt2 in evtMap) {
            evtMapBind(evt2);
        }
        return;
    }

    //兼容factor config
    if (args.length === 4 && utils.getType(args[2]) === "object") {
        evts = args[1].split(" ");
        handler = args[3];
        evts.forEach(function (evt) {
            if (!utils.hasTouch) {
                evt = utils.getPCevts(evt);
            }
            els.forEach(function (el) {
                engine.bind(el, evt, handler);
            });
        });
        return;
    }

    //事件代理
    if (args.length === 4) {
        var el = els[0];
        evts = args[1].split(" ");
        sel = args[2];
        handler = args[3];
        evts.forEach(function (evt) {
            if (!utils.hasTouch) {
                evt = utils.getPCevts(evt);
            }
            engine.delegate(el, evt, sel, handler);
        });
        return;
    }
};

var _off = function () {
    var evts, handler;
    var args = arguments;
    if (args.length < 1 || args.length > 4) {
        return console.error("unexpected arguments!");
    }
    var els = utils.getType(args[0]) === 'string' ? document.querySelectorAll(args[0]) : args[0];
    els = els.length ? Array.prototype.slice.call(els) : [els];

    if (args.length === 1 || args.length === 2) {
        els.forEach(function (el) {
            evts = args[1] ? args[1].split(" ") : Object.keys(el.listeners);
            if (evts.length) {
                evts.forEach(function (evt) {
                    if (!utils.hasTouch) {
                        evt = utils.getPCevts(evt);
                    }
                    engine.unbind(el, evt);
                    engine.undelegate(el, evt);
                });
            }
        });
        return;
    }

    if (args.length === 3 && utils.getType(args[2]) === 'function') {
        handler = args[2];
        els.forEach(function (el) {
            evts = args[1].split(" ");
            evts.forEach(function (evt) {
                if (!utils.hasTouch) {
                    evt = utils.getPCevts(evt);
                }
                engine.unbind(el, evt, handler);
            });
        });
        return;
    }

    if (args.length === 3 && utils.getType(args[2]) === 'string') {
        var sel = args[2];
        els.forEach(function (el) {
            evts = args[1].split(" ");
            evts.forEach(function (evt) {
                if (!utils.hasTouch) {
                    evt = utils.getPCevts(evt);
                }
                engine.undelegate(el, evt, sel);
            });
        });
        return;
    }

    if (args.length === 4) {
        handler = args[3];
        els.forEach(function (el) {
            evts = args[1].split(" ");
            evts.forEach(function (evt) {
                if (!utils.hasTouch) {
                    evt = utils.getPCevts(evt);
                }
                engine.undelegate(el, evt, sel, handler);
            });
        });
        return;
    }
};

var _dispatch = function (el, evt, detail) {
    var args = arguments;
    if (!utils.hasTouch) {
        evt = utils.getPCevts(evt);
    }
    var els = utils.getType(args[0]) === 'string' ? document.querySelectorAll(args[0]) : args[0];
    els = els.length ? Array.prototype.call(els) : [els];

    els.forEach(function (el) {
        engine.trigger(el, evt, detail);
    });
};

//init gesture
function init() {

    var mouseEvents = 'mouseup mousedown mousemove mouseout',
        touchEvents = 'touchstart touchmove touchend touchcancel';
    var bindingEvents = utils.hasTouch ? touchEvents : mouseEvents;

    bindingEvents.split(" ").forEach(function (evt) {
        document.addEventListener(evt, handlerOriginEvent, false);
    });
}

init();

//exports 
module.exports.on = module.exports.bind = module.exports.live = _on;
module.exports.off = module.exports.unbind = module.exports.die = _off;
module.exports.config = config;
module.exports.trigger = _dispatch;
},{}],22:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],23:[function(require,module,exports){
/****************************************************************** 
 * @component
 * Description:组件管理
 *******************************************************************/
var _ = require('./type');

function component(role, define) {
    define.role = role;
    if (component._define[role]) {
        component._define[role] = _.extend(component._define[role], define);
    } else {
        component._define[role] = define;
    }
}

function getDefine(el) {
    var _role = el.getAttribute('ne-role') || el.tagName.toLowerCase(),
        _define = component._define[_role];
    return _define || {};
}

component._define = {};

component.acts = function (selector) {
    function _props(el, props) {
        var _this = this;
        for (var i in props) {
            _this[i] = function (prop, el) {
                return function () {
                    return prop.apply(el, arguments);
                };
            }(props[i], el);
        }
    }
    selector = typeof selector === 'string' ? document.querySelector(selector) : selector;
    return new _props(selector, getDefine(selector).props || {});
}

component.init = function (el) {
    el = typeof el === 'string' ? document.querySelector(el) : el;
    var _define = getDefine(el),
        _props = _define.props || {};
    if (_props.init && !el.inited) {
        _props.init.apply(el);
        el.inited = true;
    }
    if (_define.role == 'page') {
        Array.prototype.slice.call(el.querySelectorAll('[ne-role]')).forEach(function (item) {
            component.init(item);
        });
    }
}

module.exports = component;
},{"./type":24}],24:[function(require,module,exports){

/****************************************************************** 
 * @type
 * Description:类型支持
 *******************************************************************/

var _ = {
    /*********** type check ***********/
    isBool: function (obj) {
        return obj === true || obj === false || Object.prototype.toString.call(obj) === '[object Boolean]'
    },

    isNumber: function (obj) {
        return typeof obj == 'number' || false
    },

    isString: function (obj) {
        return typeof (obj) == 'string' || false
    },

    isArray: function (obj) {
        return Object.prototype.toString.call(obj) === '[object Array]'
    },

    isObject: function (obj) {
        var type = typeof obj
        return type === 'function' || type === 'object' && !!obj
    },

    isPlainObject: function (obj) {
        return _.isObject(obj) && obj !== null && obj !== obj.window && Object.getPrototypeOf(obj) == Object.prototype;
    },

    isFunction: function (obj) {
        return typeof obj == 'function' || false
    },

    isNull: function (obj) {
        return obj === null
    },

    isUndefined: function (obj) {
        return obj === void 0
    },

    isNaN: function (obj) {
        return this.isNumber(obj) && isNaN(obj)
    },

    isMath: function (obj) {
        var flag = false
        if (obj.length != 0) {
            var reg = /^\d$/
            var r = obj.match(reg)
            if (r != null) {
                flag = true
            }
        }
        return flag
    },

    isDate: function (obj) {
        return obj instanceof Date
    },

    isRegExp: function (obj) {
        return toString.call(obj) === '[object RegExp]'
    },

    isElement: function (obj) {
        return !!(obj && obj.nodeType === 1)
    },

    /*********** type translate ***********/

    toArray: function (s) {
        try {
            return Array.prototype.slice.call(s);
        } catch (e) {
            var arr = [];
            for (var i = 0, len = s.length; i < len; i++) {
                arr[i] = s[i];
            }
            return arr;
        }
    },

    each: function (obj, callback) {
        var i, prop;

        if (!_.isObject(obj) || !callback) {
            return;
        }

        if (_.isArray(obj)) {
            // Array
            for (i = 0; i < obj.length; i++) {
                if (callback.call(obj[i], i, obj[i]) === false) {
                    break;
                }
            }
        } else {
            // Object
            for (prop in obj) {
                if (obj.hasOwnProperty(prop) && prop !== 'length') {
                    if (callback.call(obj[prop], prop, obj[prop]) === false) {
                        break;
                    }
                }
            }
        }
    },

    /*********** type Date Time ***********/

    toDate: function (timeStr) {
        if (!this.isString(timeStr)) {
            return new Date()
        }
        timeStr = timeStr.replace(/-/g, '/')
        return new Date(timeStr)
    },

    changeFormat: function (date, format) { //yyyy/MM/dd hh:mm:ss 
        date = this.isDate(date) ? date : this.toDate(date)
        var o = {
            'M+': date.getMonth() + 1, //month
            'd+': date.getDate(), //day
            'h+': date.getHours(), //hour
            'm+': date.getMinutes(), //minute
            's+': date.getSeconds(), //second
            'q+': Math.floor((date.getMonth() + 3) / 3), //quarter
            'S': date.getMilliseconds() //millisecond
        }
        if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
        for (var k in o)
            if (new RegExp('(' + k + ')').test(format))
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
        return format
    },


    /*********** handle object ***********/
    /*
    extend: function (obj) {
        for (var index = 1; index < arguments.length; index++) {
            var source = arguments[index];
            for (var key in source) {
                obj[key] = source[key];
            }
        }
        return obj;
    },
    */
   
    extend: function (target) {
        var extend=function (target, source, deep) {
            for (var key in source) {
                if (deep && (_.isPlainObject(source[key]) || _.isArray(source[key]))) {
                    if (_.isPlainObject(source[key]) && !_.isPlainObject(target[key]) || _.isArray(source[key]) && !_.isArray(target[key])) {
                        target[key] = {};
                    }
                    extend(target[key], source[key], deep);
                } else if (source[key] !== undefined) {
                    target[key] = source[key];
                }
            }
        };

        var deep,
            args = Array.prototype.slice.call(arguments, 1);

        if (typeof target == 'boolean') {
            deep = target;
            target = args.shift();
        }

        target = target || {};

        args.forEach(function (arg) {
            extend(target, arg, deep);
        });

        return target;
    },

    clone: function (Obj) {
        var buf
        if (Obj instanceof Array) {
            buf = []
            var i = Obj.length
            while (i--) {
                buf[i] = _.clone(Obj[i])
            }
            return buf
        } else if (Obj instanceof Object && typeof Obj != 'function') {
            buf = {}
            for (var k in Obj) {
                buf[k] = _.clone(Obj[k])
            }
            return buf
        } else {
            return Obj
        }
    },

    /*********** handle number ***********/

    //获取随机数
    random: function (min, max) {
        if (max == null) {
            max = min
            min = 0
        }
        return min + Math.floor(Math.random() * (max - min + 1))
    },

    decimal: function (num, v) { //对多位小数进行四舍五入
        v = Math.pow(10, v)
        return Math.round(num * v) / v
    }
}

module.exports= _;
},{}],25:[function(require,module,exports){
window.Ne = window.Ne || {};
var Ne=window.Ne;
Ne.touch=require('../../../NeTouch');
Ne.render=require('../../../NeRender');
Ne.motion=require('../../../NeMotion');
Ne.dom=require('../../../NeDom');
Ne._=require('./lib/type');
Ne.component = require('./lib/component');
Ne.acts = Ne.component.acts;

function _triggerAction(target,action,sender,args) {
    var actions = target && Ne.component.acts(target);
    args.sender=sender;
    return actions && actions[action] && actions[action](args);
}

function _queryCmdSender(el,tag) {
    return el.getAttribute(tag)?el:el.parentElement ? _queryCmdSender(el.parentElement,tag):null;
}

function _queryCmdTarget(el, role) {
    return role.substring(0,1)==='#'?document.querySelector(role)
    :el.getAttribute('ne-role') ==role||el.tagName.toLowerCase()==role
    ? el: el.parentElement ? _queryCmdTarget(el.parentElement, role):null;
}

function cmd(cmdline,sender,event){
    var _temp=cmdline.split(':'),
        target=_queryCmdTarget(sender, _temp[1]),
        action=_temp[0];
    return _triggerAction(target,action,sender,event);
}

function initUI(){
    Array.prototype.slice.call(document.querySelectorAll('[ne-role="page"]')).forEach(function (page, index) {
        page.setAttribute('data-url',location.href);
        Ne.component.init(page);
    });
}

function onTap(event) {
    var target=event.target || event.touches[0];
    target = _queryCmdSender(target,'ne-tap');
    if (target) {
        event.preventDefault && event.preventDefault();
        event.stopPropagation && event.stopPropagation();
        cmd(target.getAttribute('ne-tap'),target,event);
    }
}

function onSwipe(event) {
    var target = event.target || event.touches[0];
    target = _queryCmdSender(target,'ne-swipeable');
    if (target) {
        event.preventDefault && event.preventDefault();
        event.stopPropagation && event.stopPropagation();
        _triggerAction(target,'onswipe',target,event);
    }
}

function onInput(event) {
    var target = event.target || event.touches[0];
    if(target){
        _triggerAction(target,'oninput',target,event);
    }
}

//add globe eventlistener   
document.addEventListener('input', onInput);
document.addEventListener('click', onTap);
Ne.touch && Ne.touch.on(document, 'swipe', onSwipe);
Ne.dom(function(){
    //init ui
    initUI();
})

},{"../../../NeDom":1,"../../../NeMotion":3,"../../../NeRender":7,"../../../NeTouch":20,"./lib/component":23,"./lib/type":24}]},{},[25]);


/****************************************************************** 
 * @actionsheet
*******************************************************************/

(function (Ne) {
    //define
    Ne.component('actionsheet', {
        props: {
            show: function () {
                Ne.dom.animateShow(this);
            },
            hide: function () {
                Ne.dom.animateHide(this);
            }
        }
    });
})(Ne);

/****************************************************************** 
 * @button
*******************************************************************/

(function (Ne) {
    //define
    Ne.component('button', {
        props: {
            active: function () {
                this.classList.add('active');
            },
            quiet:function(){
                this.classList.remove('active');
            },
            disabled: function () {
                this.classList.add('disabled');
            },
            enable: function () {
                this.classList.remove('disabled');
            },
            showloading: function () {
                this.classList.add('ne-btn-loading');
            },
            hideloading: function () {
                this.classList.remove('ne-btn-loading');
            }
        }
    });
})(Ne);

/****************************************************************** 
 * @carousel
*******************************************************************/

(function (Ne) {
    //fn
    function _toggleController(carousel,Item_in){
        var el_controller = carousel.querySelector('[ne-role="carouselcontroller"]');
        if (el_controller) {
            var index=0;
            Ne._.toArray(Item_in.parentElement.children).forEach(function (n, i) {
                if (n == Item_in) {
                     index=i;
                     return false;
                }
            });
            Ne._.toArray(el_controller.querySelectorAll('[ne-role="carouselcontrol"]')).forEach(function (n, i) {
                n.classList[i == index ? 'add' : 'remove']('active');
            });
        }
    }

    function _toggleItem(carousel,direction) {
        if(carousel.item_curr){
            return false;
        }
        if(carousel.getAttribute('data-autoplay')=='true'){
            clearTimeout(carousel._timing);
            _autoplay(carousel);
        }
        var item_out= carousel.querySelector('.ne-carousel-item.active');
        var item_in=direction == 'next'?
                    (item_out.nextElementSibling || item_out.parentElement.children[0]):
                    (item_out.previousElementSibling || item_out.parentElement.children[item_out.parentElement.children.length - 1]);
        Ne.dom.toggleView(item_in, item_out, direction != 'next', item_in.getAttribute('ne-animate') || 'slide');
        _toggleController(carousel,item_in);
    }

    function _autoplay(_carousel, _time) {
        _time=_time||_carousel.getAttribute('data-interval')||3000;
        _carousel._timing = setTimeout(function () {
            _toggleItem(_carousel, 'next');
            _autoplay(_carousel, _time);
        }, _time);
    }
    
    function _ev_onDragStart(event) {
        event.preventDefault();
        event.stopPropagation();
        var carousel = event.currentTarget, move_x = event.x;
        carousel.item_curr = carousel.querySelector('.ne-carousel-item.active');
        carousel.item_next = carousel.item_curr.nextElementSibling || carousel.item_curr.parentElement.children[0];
        carousel.item_prev = carousel.item_curr.previousElementSibling || carousel.item_curr.parentElement.children[carousel.item_curr.parentElement.children.length - 1];
        carousel.item_prev.style[Ne.dom.transformProperty] = 'translate3d('+(-carousel.item_prev.offsetWidth)+'px,0,0)';
        carousel.item_next.style[Ne.dom.transformProperty] = 'translate3d('+(carousel.item_prev.offsetWidth)+'px,0,0)';
        carousel.item_prev.classList.add('block');
        carousel.item_next.classList.add('block');
    }

    function _ev_onDrag(event) {
        event.preventDefault();
        event.stopPropagation();
        var carousel = event.currentTarget, move_x = event.x;
        carousel.item_curr.style[Ne.dom.transformProperty] = 'translate3d('+move_x+'px,0,0)';
        carousel.item_prev.style[Ne.dom.transformProperty] = 'translate3d('+(-carousel.item_curr.offsetWidth+move_x)+'px,0,0)';
        carousel.item_next.style[Ne.dom.transformProperty] = 'translate3d('+(carousel.item_curr.offsetWidth+move_x)+'px,0,0)';
    }

    function _ev_onDragEnd(event) {
        event.preventDefault();
        event.stopPropagation();
        var carousel = event.currentTarget, move_x = event.x;
        move_x=carousel.item_curr.style[Ne.dom.transformProperty].match(/translate3d\(+[,px\d\.\-\s]+\)/g)[0].match(/([\-\d\.]+px)/g)[0];
        move_x=parseFloat(move_x.substring(0,move_x.length-2));
        var dir=move_x<0?-1:1;
        var timeline = new Ne.motion.timeline({
            duration: 350,
            origin:[move_x],
            transition: [dir * carousel.item_curr.offsetWidth],
            timingFunction: 'Cubic-easeOut',
            keyframeFunction:function (x) {
                carousel.item_curr.style[Ne.dom.transformProperty] = 'translate3d('+x+'px,0,0)';
                if(dir===-1){
                    carousel.item_next.style[Ne.dom.transformProperty] = 'translate3d('+(carousel.item_curr.offsetWidth+x)+'px,0,0)';
                }else{
                    carousel.item_prev.style[Ne.dom.transformProperty] = 'translate3d('+(-carousel.item_curr.offsetWidth+x)+'px,0,0)';
                }
            },
            complete: function () {
                if(dir===-1){
                    _toggleController(carousel,carousel.item_next);
                    carousel.item_next.classList.add('active');
                }else{
                     _toggleController(carousel,carousel.item_prev);
                     carousel.item_prev.classList.add('active');
                }
                carousel.item_curr.classList.remove('active'); 
                carousel.item_next.classList.remove('block');
                carousel.item_prev.classList.remove('block');
                carousel.item_curr.style[Ne.dom.transformProperty]="";
                carousel.item_next.style[Ne.dom.transformProperty]="";
                carousel.item_prev.style[Ne.dom.transformProperty]="";
                carousel.item_next=null;
                carousel.item_prev=null;
                carousel.item_curr=null;
            }
        });
        timeline.run();
    }

    //define
    Ne.component('carousel', {
        props: {
            init: function () {
                if(this.getAttribute('data-autoplay')=='true'){
                    _autoplay(this);
                }
                Ne.touch.on(this, 'dragstart', _ev_onDragStart);
                Ne.touch.on(this, 'drag', _ev_onDrag);
                Ne.touch.on(this, 'dragend', _ev_onDragEnd);
            },
            onswipe: function (event) {
                _toggleItem(this, event.direction=='left'?'next':'prev');
            },
            prev:function(){
                _toggleItem(this, 'prev');
            },
            next:function(){
                _toggleItem(this, 'next');
            }
        }
    });
})(Ne);
/****************************************************************** 
 * @dialog
 *******************************************************************/

(function (Ne) {
    //define
    Ne.component('dialog', {
        props: {
            show: function () {
                Ne.dom.animateShow(this);
            },
            hide: function () {
                Ne.dom.animateHide(this);
            }
        }
    });
})(Ne);


//Ne.dialog
(function (root, factory) {
    root.dialog = factory(root);
}(Ne, function (Ne) {
    //create
    function _create_dialog(data) {
        data.actions.forEach(function (item) {
            item.onclick = function (event) {
                var el_dialog = Ne.dom(event.currentTarget).parents('[ne-role="dialog"]')[0];
                Ne.acts(el_dialog).hide();
                setTimeout(function () {
                    el_dialog && el_dialog.parentElement.removeChild(el_dialog);
                }, 550);
                item.handler && item.handler(event);
            }
        });
        var ne_dialog = Ne.render(
            '<div class="ne-dialog" ne-role="dialog">' +
            '<div class="ne-mask"></div>' +
            '<div class="ne-dialog-container">' +
            '<div class="ne-dialog-{type}">' +
            '<div class="ne-dialog-header">' +
            '<strong>{title}</strong>' +
            '</div>' +
            '<div class="ne-dialog-body">{content}</div>' +
            '<div class="ne-dialog-footer">' +
            '{each actions as action i}' +
            '<div class="ne-action {(action.color||\'\')} {(action.focused?\'weight-bold\':\'\')}" onclick="{action.onclick}">{action.text}</div>' +
            '{/each}' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>', data, document.body);

        return ne_dialog;
    };

    function dialog(configObj) {
        var el = _create_dialog(configObj);
        var nedialog = Ne.acts(el);
        nedialog.show();
        return nedialog;
    }

    dialog.alert = function (title, content, callback) {
        return dialog({
            type: 'alert',
            title: title,
            content: content,
            actions: [{
                text: '确定',
                handler: function (event) {
                    callback && callback();
                }
            }]
        });
    };
    dialog.confirm = function (title, content, callback) {
        return dialog({
            type: 'confirm',
            title: title,
            content: content,
            actions: [{
                    text: '取消',
                    handler: function () {
                        callback && callback(false);
                    }
                },
                {
                    text: '确定',
                    focused: true,
                    handler: function (event) {
                        callback && callback(true);
                    }
                }
            ]
        });;
    };
    
    return dialog;
}));

/****************************************************************** 
 * @drawer
*******************************************************************/

(function (Ne) {
    //fn
    function _openDrawer(target) {
        var currentPage = document.querySelector('.ne-page.active') || document.querySelector('.ne-page');
        if (currentPage) {
            target.classList.add('ne-drawer-static');
            currentPage.classList.add('ne-page-opendrawer');
            if (target.classList.contains('ne-drawer-fromright')) {
                currentPage.classList.add('ne-page-opendrawer-fromright');
            }
        }
    }

    function _closeDrawer(target) {
        var currentPage = document.querySelector('.ne-page.active') || document.querySelector('.ne-page');
        if (currentPage) {
            currentPage.classList.remove('ne-page-opendrawer');
            currentPage.classList.remove('ne-page-opendrawer-fromright');
            currentPage.classList.add('ne-page-closedrawer');
            Ne.dom.debounce(function(){
                target.classList.remove('ne-drawer-static');
                currentPage.classList.remove('ne-page-closedrawer');
            },target,500);
        }
    }

    //define
    Ne.component('drawer', {
        props: {
            show: function () {
                Ne.dom.animateShow(this);
            },
            open: function () {
                _openDrawer(this);
            }, 
            hide: function () {
                if (this.classList.contains('ne-drawer-static')) {
                    _closeDrawer(this);
                } else {
                    Ne.dom.animateHide(this);
                }
            }
        }
    });
})(Ne);

/****************************************************************** 
 * @input
*******************************************************************/

(function (Ne) {
    //fn
    function _clearable(target){
        var el_clearbtn = target.nextElementSibling;
        if (!el_clearbtn || !el_clearbtn.classList.contains('ne-input-icon')) {
            target.parentElement.classList.add('ne-input_withicon_right');
            el_clearbtn = Ne.dom.render('<i class="ne-icon-delete-f grey ne-input-icon"></i>');
            el_clearbtn.onclick = function () {
                target.value = '';
                el_clearbtn.style.display = 'none';
            }
            Ne.dom(el_clearbtn).insertAfter(target);
        } else {
            if (target.value != '') {
                el_clearbtn.style.display = 'block';
            } else {
                el_clearbtn.style.display = 'none';
            }
        }
    }

    //define
    Ne.component('input', {
        props: {
            oninput: function () {
                //clearable
                if (this.getAttribute('ne-clearable')) {
                    _clearable(this);
                }
            }
        }
    });
 
})(Ne);


/****************************************************************** 
 * @list
*******************************************************************/

(function (Ne) {
    //fn
    function _remove(target){
        target.style.height = target.offsetHeight+'px';
        setTimeout(function(){
            target.style.height ='0px';
            target.classList.add('ne-animate-remove');
            Ne.dom.debounce(function(){
                target.parentElement.removeChild(target);
            },target.parentElement,250);
        },50);
    }

    function _hideActions(target){
        target.__temp_keep && Ne.motion.move({
            el:  target.querySelector('.ne-cell'),
            x: 0,
            y: 0,
            duration: 300,
            timingFunction:'Cubic-easeOut',
            callback:function(){
                delete target.__temp_keep;
            }
        });
    }

    function _showActions(target,keep){
        var el_actions = target.querySelector('.ne-listitem-actions'+(keep=='left'?'.keepleft':':not(.keepleft)'));
        el_actions && Ne.motion.move({
            el: target.querySelector('.ne-cell'),
            x: (keep=='left'?1:-1)*el_actions.offsetWidth,
            y: 0,
            duration: 300,
            timingFunction:'Cubic-easeOut',
            callback:function(){
                target.__temp_keep=keep;
            }
        });
    }


    //define
    Ne.component('li', {
        props: {
            onswipe:function (event) {
                if(event.direction=='left'||event.direction=='right'){
                    if(this.__temp_keep){
                       this.__temp_keep==event.direction && _hideActions(this);
                    }else{
                       _showActions(this,event.direction=='left'?'right':'left');
                    }
                } 
            },
            regain:function(){
                _hideActions(this);
            },
            actions:function(direction){
                direction=direction||'right';
                _showActions(this,direction);
            },
            remove:function(){
               _remove(this);
            }
        }
    });

})(Ne);

/****************************************************************** 
 * @numbox
*******************************************************************/

(function (Ne) {
    //fn
    function setValue(target,handleType) {
        var el_input = target.querySelector('input'),
                    el_btn_minus = el_input.previousElementSibling,
                    el_btn_plus = el_input.nextElementSibling;
        var _val = Number(el_input.value),
            _val_step = Number(el_input.getAttribute('step')); 
        _val = handleType == 'minus' ? _val - _val_step : _val + _val_step;

        var _val_min = el_input.getAttribute('min'),
         _val_max = el_input.getAttribute('max');
        if (_val_min) {
            _val_min = Number(_val_min);
            _val = _val < _val_min ? _val_min : _val;
        }
        if (_val_max) {
            _val_max = Number(_val_max);
            _val = _val > _val_max ? _val_max : _val;
        }
        el_input.value = _val;
    }

    //define
    Ne.component('numbox', {
        props: {
            minus: function () {
                setValue(this, 'minus'); 
            },
            plus: function () {
                setValue(this, 'plus');
            }
        }
    });
})(Ne);

/****************************************************************** 
 * @page
*******************************************************************/

(function (Ne) {
    //fn 
    function __togglePage(page_in, animate_type) {
        //exec nav-pane toggle 
        var is_reverse = false, page_out = null;

        Ne._.toArray(document.querySelectorAll('[ne-role="page"]')).forEach(function (page, index) {
            if (page.classList.contains('active')) {
                page_out = page;
            }
            if (page == page_in) {
                is_reverse = false;
                return false;
            }
            if (page == page_out) {
                is_reverse = true;
                return false;
            }
        });

        if (page_in != page_out) {
            animate_type = animate_type || page_in.getAttribute('ne-animate') || 'slidecover';
            Ne.dom.toggleView(page_in, page_out, is_reverse, animate_type);
        }
    }
     
    //define
    Ne.component('page', {
        props: {
            toggle: function () {
                __togglePage(this);
            }
        }
    });
})(Ne);

/****************************************************************** 
 * @panel
*******************************************************************/

(function (Ne) {
    //fn
    function _collapse(target, maxheight) {
        var el_panel_body = target.querySelector('.ne-panel-body');
        maxheight = maxheight || el_panel_body.getAttribute('data-maxheight')||0;
        el_panel_body.style.maxHeight = maxheight + 'px';
        target.classList.add('collapse');
    }

    function _expand(target) {
        var el_panel_body = target.querySelector('.ne-panel-body');
        el_panel_body.setAttribute('data-maxheight', el_panel_body.offsetHeight);
        el_panel_body.style.maxHeight = el_panel_body.scrollHeight+'px';
        target.classList.remove('collapse');
    }

    //define
    Ne.component('panel', {
        props: {
            expand: function () {
                _expand(this);
            },
            collapse: function () {
                _collapse(this);
            },
            toggle: function () {
                this.classList.contains('collapse')?_expand(this):_collapse(this);
            }
        }
    });
})(Ne);

/****************************************************************** 
 * @picker
 *******************************************************************/

(function (Ne) {
    var picker = {
        util: {
            prefix: function () {
                var _p;
                var testProps = function (props) {
                    var i;
                    for (i in props) {
                        if (document.createElement('modernizr').style[props[i]] !== undefined) {
                            return true;
                        }
                    }
                    return false;
                };
                ['Webkit', 'Moz', 'O', 'ms'].forEach(function (p) {
                    if (testProps([p + 'Transform'])) {
                        _p = '-' + p.toLowerCase() + '-';
                        return false;
                    }
                });
                return _p;
            }(),
            testTouch: function (e, elm) {
                if (e.type == 'touchstart') {
                    elm.setAttribute('data-touch', '1');
                } else if (elm.getAttribute('data-touch')) {
                    elm.removeAttribute('data-touch');
                    return false;
                }
                return true;
            },
            objectToArray: function (obj) {
                var arr = [],
                    i;

                for (i in obj) {
                    arr.push(obj[i]);
                }

                return arr;
            },
            arrayToObject: function (arr) {
                var obj = {},
                    i;

                if (arr) {
                    for (i = 0; i < arr.length; i++) {
                        obj[arr[i]] = arr[i];
                    }
                }

                return obj;
            },
            isNumeric: function (a) {
                return a - parseFloat(a) >= 0;
            },
            getCoord: function (e, c, page) {
                var ev = e.originalEvent || e,
                    prop = (page ? 'page' : 'client') + c;

                // Multi touch support
                if (ev.targetTouches && ev.targetTouches[0]) {
                    return ev.targetTouches[0][prop];
                }

                if (ev.changedTouches && ev.changedTouches[0]) {
                    return ev.changedTouches[0][prop];
                }

                return e[prop];
            },
            getPosition: function (t, vertical) {
                var style = getComputedStyle(t[0]),
                    matrix,
                    px;

                Ne._.each(['t', 'webkitT', 'MozT', 'OT', 'msT'], function (i, v) {
                    if (style[v + 'ransform'] !== undefined) {
                        matrix = style[v + 'ransform'];
                        return false;
                    }
                });
                matrix = matrix.split(')')[0].split(', ');
                px = vertical ? (matrix[13] || matrix[5]) : (matrix[12] || matrix[4]);


                return px;
            },
            constrain: function (val, min, max) {
                return Math.max(min, Math.min(val, max));
            },
            vibrate: function (time) {
                if ('vibrate' in navigator) {
                    navigator.vibrate(time || 50);
                }
            },
            datetime: {
                defaults: {
                    shortYearCutoff: "+10",
                    monthNames: "January,February,March,April,May,June,July,August,September,October,November,December".split(","),
                    monthNamesShort: "Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec".split(","),
                    dayNames: "Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday".split(","),
                    dayNamesShort: "Sun,Mon,Tue,Wed,Thu,Fri,Sat".split(","),
                    dayNamesMin: "S,M,T,W,T,F,S".split(","),
                    amText: "am",
                    pmText: "pm",
                    getYear: function (i) {
                        return i.getFullYear()
                    },
                    getMonth: function (i) {
                        return i.getMonth()
                    },
                    getDay: function (i) {
                        return i.getDate()
                    },
                    getDate: function (i, o, l, f, j, L, z) {
                        i = new Date(i, o, l, f || 0, j || 0, L || 0, z || 0);
                        23 == i.getHours() && 0 === (f || 0) && i.setHours(i.getHours() + 2);
                        return i
                    },
                    getMaxDayOfMonth: function (i, o) {
                        return 32 - (new Date(i, o, 32, 12)).getDate()
                    },
                    getWeekNumber: function (i) {
                        i = new Date(i);
                        i.setHours(0, 0, 0);
                        i.setDate(i.getDate() + 4 - (i.getDay() || 7));
                        var o = new Date(i.getFullYear(), 0, 1);
                        return Math.ceil(((i - o) / 864E5 + 1) / 7)
                    }
                },
                adjustedDate: function (i, o, l, f, j, L, z) {
                    i = new Date(i, o, l, f || 0, j || 0, L || 0, z || 0);
                    23 == i.getHours() && 0 === (f || 0) && i.setHours(i.getHours() + 2);
                    return i
                },
                formatDate: function (m, w, l) {
                    if (!w) return null;
                    var l = Ne._.extend({}, picker.util.datetime.defaults, l),
                        f = function (f) {
                            for (var e = 0; z + 1 < m.length && m.charAt(z + 1) == f;) e++, z++;
                            return e
                        },
                        j = function (i, e, d) {
                            e = "" + e;
                            if (f(i))
                                for (; e.length < d;) e = "0" + e;
                            return e
                        },
                        L = function (i, e, d, a) {
                            return f(i) ? a[e] : d[e]
                        },
                        z, t, r = "",
                        C = !1;

                    for (z = 0; z < m.length; z++)
                        if (C) "'" == m.charAt(z) && !f("'") ? C = !1 : r += m.charAt(z);
                        else switch (m.charAt(z)) {
                            case "d":
                                r += j("d", l.getDay(w), 2);
                                break;
                            case "D":
                                r += L("D", w.getDay(), l.dayNamesShort, l.dayNames);
                                break;
                            case "o":
                                r += j("o", (w.getTime() - (new Date(w.getFullYear(), 0, 0)).getTime()) / 864E5, 3);
                                break;
                            case "m":
                                r += j("m", l.getMonth(w) + 1, 2);
                                break;
                            case "M":
                                r += L("M", l.getMonth(w), l.monthNamesShort, l.monthNames);
                                break;
                            case "y":
                                t = l.getYear(w);
                                r += f("y") ? t : (10 > t % 100 ? "0" : "") + t % 100;
                                break;
                            case "h":
                                t = w.getHours();
                                r += j("h", 12 < t ? t - 12 : 0 === t ? 12 : t, 2);
                                break;
                            case "H":
                                r += j("H", w.getHours(), 2);
                                break;
                            case "i":
                                r += j("i", w.getMinutes(), 2);
                                break;
                            case "s":
                                r += j("s", w.getSeconds(), 2);
                                break;
                            case "a":
                                r += 11 < w.getHours() ? l.pmText : l.amText;
                                break;
                            case "A":
                                r += 11 < w.getHours() ? l.pmText.toUpperCase() : l.amText.toUpperCase();
                                break;
                            case "'":
                                f("'") ? r += "'" : C = !0;
                                break;
                            default:
                                r += m.charAt(z)
                        }
                    return r
                },
                parseDate: function (m, t, l) {
                    var l = Ne._.extend({}, picker.util.datetime.defaults, l),
                        f = l.defaultValue || new Date;
                    if (!m || !t) return f;
                    if (t.getTime) return t;
                    var t = "object" == typeof t ? t.toString() : t + "",
                        j = l.shortYearCutoff,
                        L = l.getYear(f),
                        z = l.getMonth(f) + 1,
                        N = l.getDay(f),
                        r = -1,
                        C = f.getHours(),
                        u = f.getMinutes(),
                        e = 0,
                        d = -1,
                        a = !1,
                        b = function (a) {
                            (a = V + 1 < m.length && m.charAt(V + 1) == a) && V++;
                            return a
                        },
                        c = function (a) {
                            b(a);
                            a = t.substr(H).match(RegExp("^\\d{1," + ("@" == a ? 14 : "!" == a ? 20 : "y" == a ? 4 : "o" == a ? 3 : 2) + "}"));
                            if (!a) return 0;
                            H += a[0].length;
                            return parseInt(a[0], 10)
                        },
                        A = function (a, c, d) {
                            a = b(a) ? d : c;
                            for (c = 0; c < a.length; c++)
                                if (t.substr(H, a[c].length).toLowerCase() == a[c].toLowerCase()) return H += a[c].length, c + 1;
                            return 0
                        },
                        H = 0,
                        V;
                    for (V = 0; V < m.length; V++)
                        if (a) "'" == m.charAt(V) && !b("'") ? a = !1 : H++;
                        else switch (m.charAt(V)) {
                            case "d":
                                N = c("d");
                                break;
                            case "D":
                                A("D", l.dayNamesShort, l.dayNames);
                                break;
                            case "o":
                                r = c("o");
                                break;
                            case "m":
                                z = c("m");
                                break;
                            case "M":
                                z = A("M", l.monthNamesShort, l.monthNames);
                                break;
                            case "y":
                                L = c("y");
                                break;
                            case "H":
                                C = c("H");
                                break;
                            case "h":
                                C = c("h");
                                break;
                            case "i":
                                u = c("i");
                                break;
                            case "s":
                                e = c("s");
                                break;
                            case "a":
                                d = A("a", [l.amText, l.pmText], [l.amText, l.pmText]) - 1;
                                break;
                            case "A":
                                d = A("A", [l.amText, l.pmText], [l.amText, l.pmText]) - 1;
                                break;
                            case "'":
                                b("'") ? H++ : a = !0;
                                break;
                            default:
                                H++
                        }
                    100 > L && (L += (new Date).getFullYear() - (new Date).getFullYear() % 100 + (L <= ("string" != typeof j ? j : (new Date).getFullYear() % 100 + parseInt(j, 10)) ? 0 : -100));
                    if (-1 < r) {
                        z = 1;
                        N = r;
                        do {
                            j = 32 - (new Date(L, z - 1, 32, 12)).getDate();
                            if (N <= j) break;
                            z++;
                            N -= j
                        } while (1)
                    }
                    C = l.getDate(L, z - 1, N, -1 == d ? C : d && 12 > C ? C + 12 : !d && 12 == C ? 0 : C, u, e);
                    return l.getYear(C) != L || l.getMonth(C) + 1 != z || l.getDay(C) != N ? f : C
                }
            }
        },
        presets: {
            scroller: {
                date: function (j) {
                    function l(a, b, c) {
                        return p[b] !== undefined && (a = +a[p[b]], !isNaN(a)) ? a : W[b] !== undefined ? W[b] : c !== undefined ? c : E[b](ba)
                    }

                    function N(a) {
                        return {
                            value: a,
                            display: (J.match(/yy/i) ? a : (a + "").substr(2, 2)) + (q.yearSuffix || "")
                        }
                    }

                    function r(a) {
                        return a
                    }

                    function C(a, b, c, d, e, f, g) {
                        b.push({
                            data: d,
                            label: c,
                            min: f,
                            max: g,
                            getIndex: e,
                            cssClass: a
                        })
                    }

                    function u(a, b, c, d) {
                        return Math.min(d, Math.floor(a / b) * b + c)
                    }

                    function e(a) {
                        if (null === a) return a;
                        var b = l(a, "y"),
                            c = l(a, "m"),
                            d = Math.min(l(a, "d"), q.getMaxDayOfMonth(b, c)),
                            e = l(a, "h", 0);
                        return q.getDate(b, c, d, l(a, "a", 0) ? e + 12 : e, l(a, "i", 0), l(a, "s", 0), l(a, "u", 0))
                    }

                    function d(b, c) {
                        var d, f, g = !1,
                            h = !1,
                            i = 0,
                            j = 0;
                        F = e(H(F));
                        P = e(H(P));
                        if (a(b)) return b;
                        b < F && (b = F);
                        b > P && (b = P);
                        f = d = b;
                        if (2 !== c)
                            for (g = a(d); !g && d < P;) d = new Date(d.getTime() + 864E5), g = a(d), i++;
                        if (1 !== c)
                            for (h = a(f); !h && f > F;) f = new Date(f.getTime() - 864E5), h = a(f), j++;
                        return 1 === c && g ? d : 2 === c && h ? f : j <= i && h ? f : d
                    }

                    function a(a) {
                        return a < F || a > P ? !1 : b(a, x) ? !0 : b(a, B) ? !1 : !0
                    }

                    function b(a, b) {
                        var c, d, e;
                        if (b)
                            for (d = 0; d < b.length; d++)
                                if (c = b[d], e = c + "", !c.start)
                                    if (c.getTime) {
                                        if (a.getFullYear() == c.getFullYear() && a.getMonth() == c.getMonth() && a.getDate() == c.getDate()) return !0
                                    } else if (e.match(/w/i)) {
                            if (e = +e.replace("w", ""), e == a.getDay()) return !0
                        } else if (e = e.split("/"), e[1]) {
                            if (e[0] - 1 == a.getMonth() && e[1] == a.getDate()) return !0
                        } else if (e[0] == a.getDate()) return !0;
                        return !1
                    }

                    function c(a, b, c, d, e, f, g) {
                        var h, i, j;
                        if (a)
                            for (h = 0; h < a.length; h++)
                                if (i = a[h], j = i + "", !i.start)
                                    if (i.getTime) q.getYear(i) == b && q.getMonth(i) == c && (f[q.getDay(i)] = g);
                                    else if (j.match(/w/i)) {
                            j = +j.replace("w", "");
                            for (s = j - d; s < e; s += 7) 0 <= s && (f[s + 1] = g)
                        } else j = j.split("/"), j[1] ? j[0] - 1 == c && (f[j[1]] = g) : f[j[0]] = g
                    }

                    function A(a, b, c, d, e, f, h, j, k) {
                        var B, l, n, p, m, o, r, s, y, x, w, z, A, J, aa, L, D, E, G = {},
                            C = {
                                h: X,
                                i: g,
                                s: U,
                                a: 1
                            },
                            F = q.getDate(e, f, h),
                            H = ["a", "h", "i", "s"];
                        a && (Ne._.each(a, function (a, b) {
                            if (b.start && (b.apply = !1, B = b.d, l = B + "", n = l.split("/"), B && (B.getTime && e == q.getYear(B) && f == q.getMonth(B) && h == q.getDay(B) || !l.match(/w/i) && (n[1] && h == n[1] && f == n[0] - 1 || !n[1] && h == n[0]) || l.match(/w/i) && F.getDay() == +l.replace("w", "")))) b.apply = !0, G[F] = !0
                        }), Ne._.each(a, function (a, d) {
                            J = A = 0;
                            w = v[c];
                            z = K[c];
                            r = o = !0;
                            aa = !1;
                            if (d.start && (d.apply || !d.d && !G[F])) {
                                p = d.start.split(":");
                                m = d.end.split(":");
                                for (x = 0; 3 > x; x++) p[x] === t && (p[x] = 0), m[x] === t && (m[x] = 59), p[x] = +p[x], m[x] = +m[x];
                                p.unshift(11 < p[0] ? 1 : 0);
                                m.unshift(11 < m[0] ? 1 : 0);
                                Y && (12 <= p[1] && (p[1] -= 12), 12 <= m[1] && (m[1] -= 12));
                                for (x = 0; x < b; x++)
                                    if (Z[x] !== t) {
                                        s = u(p[x], C[H[x]], v[H[x]], K[H[x]]);
                                        y = u(m[x], C[H[x]], v[H[x]], K[H[x]]);
                                        E = D = L = 0;
                                        Y && 1 == x && (L = p[0] ? 12 : 0, D = m[0] ? 12 : 0, E = Z[0] ? 12 : 0);
                                        o || (s = 0);
                                        r || (y = K[H[x]]);
                                        if ((o || r) && s + L < Z[x] + E && Z[x] + E < y + D) aa = !0;
                                        Z[x] != s && (o = !1);
                                        Z[x] != y && (r = !1)
                                    }
                                if (!k)
                                    for (x = b + 1; 4 > x; x++) 0 < p[x] && (A = C[c]), m[x] < K[H[x]] && (J = C[c]);
                                aa || (s = u(p[b], C[c], v[c], K[c]) + A, y = u(m[b], C[c], v[c], K[c]) - J, o && (w = s), (z = y + 1));
                                if (o || r || aa)
                                    for (x = w; x < z; x++) j[x] = !k
                            }
                        }))
                    }

                    function H(a, b) {
                        var c = [];
                        if (null === a || a === undefined) return a;
                        Ne._.each("y,m,d,a,h,i,s,u".split(","), function (d, e) {
                            p[e] !== undefined && (c[p[e]] = E[e](a));
                            b && (W[e] = E[e](a))
                        });
                        return c
                    }

                    function V(a) {
                        var b, c, d, e = [];
                        if (a) {
                            for (b = 0; b < a.length; b++)
                                if (c = a[b], c.start && c.start.getTime)
                                    for (d = new Date(c.start); d <= c.end;) e.push(w(d.getFullYear(), d.getMonth(), d.getDate())), d.setDate(d.getDate() + 1);
                                else e.push(c);
                            return e
                        }
                        return a
                    }

                    var n = Ne.dom(this),
                        D = {},
                        format;
                    if (n.is("input")) {
                        format = n.attr("data-format") ? n.attr("data-format") : null;
                        switch (n.attr("type")) {
                            case "date":
                                format = format || "yy-mm-dd";
                                break;
                            case "datetime":
                                format = format || "yy-mm-dd HH:ii:ss";
                                break;
                            case "datetime-local":
                                format = format || "yy-mm-dd HH:ii:ss";
                                break;
                            case "month":
                                format = format || "yy-mm";
                                D.dateOrder = "mmyy";
                                break;
                            case "time":
                                format = format || "HH:ii:ss"
                        }
                        var G = n.attr("min"),
                            n = n.attr("max");
                        G && (D.minDate = picker.util.datetime.parseDate(format, G));
                        n && (D.maxDate = picker.util.datetime.parseDate(format, n))
                    }
                    var k, s, O, da, v, K, R, G = Ne._.extend({}, j.settings),
                        q = Ne._.extend(j.settings, picker.util.datetime.defaults, {
                            startYear: (new Date).getFullYear() - 100,
                            endYear: (new Date).getFullYear() + 1,
                            separator: " ",
                            dateFormat: "mm/dd/yy",
                            dateDisplay: "MMddyy",
                            timeFormat: "hh:ii A",
                            dayText: "Day",
                            monthText: "Month",
                            yearText: "Year",
                            hourText: "Hours",
                            minuteText: "Minutes",
                            ampmText: "&nbsp;",
                            secText: "Seconds",
                            nowText: "Now"
                        }, D, G),
                        T = 0,
                        Z = [],
                        D = [],
                        Q = [],
                        p = {},
                        W = {},
                        E = {
                            y: function (a) {
                                return q.getYear(a)
                            },
                            m: function (a) {
                                return q.getMonth(a)
                            },
                            d: function (a) {
                                return q.getDay(a)
                            },
                            h: function (a) {
                                a = a.getHours();
                                a = Y && 12 <= a ? a - 12 : a;
                                return u(a, X, ja, ma)
                            },
                            i: function (a) {
                                return u(a.getMinutes(), g, ha, ga)
                            },
                            s: function (a) {
                                return u(a.getSeconds(), U, ia, S)
                            },
                            u: function (a) {
                                return a.getMilliseconds()
                            },
                            a: function (a) {
                                return h && 11 < a.getHours() ? 1 : 0
                            }
                        },
                        B = q.invalid,
                        x = q.valid,
                        G = q.preset,
                        aa = q.dateWheels || q.dateFormat,
                        J = q.dateWheels || q.dateDisplay,
                        y = q.timeWheels || q.timeFormat,
                        fa = J.match(/D/),
                        h = y.match(/a/i),
                        Y = y.match(/h/),
                        ea = "datetime" == G ? q.dateFormat + q.separator + q.timeFormat : "time" == G ? q.timeFormat : q.dateFormat,
                        ba = new Date,
                        n = q.steps || {},
                        X = n.hour || q.stepHour || 1,
                        g = n.minute || q.stepMinute || 1,
                        U = n.second || q.stepSecond || 1,
                        n = n.zeroBased,
                        F = q.min || q.minDate || picker.util.datetime.adjustedDate(q.startYear, 0, 1),
                        P = q.max || q.maxDate || picker.util.datetime.adjustedDate(q.endYear, 11, 31, 23, 59, 59),
                        ja = n ? 0 : F.getHours() % X,
                        ha = n ? 0 : F.getMinutes() % g,
                        ia = n ? 0 : F.getSeconds() % U,
                        ma = Math.floor(((Y ? 11 : 23) - ja) / X) * X + ja,
                        ga = Math.floor((59 - ha) / g) * g + ha,
                        S = Math.floor((59 - ha) / g) * g + ha;
                    format = format || ea;
                    if (G.match(/date/i)) {
                        Ne._.each(["y", "m", "d"], function (a, b) {
                            k = aa.search(RegExp(b, "i")); - 1 < k && Q.push({
                                o: k,
                                v: b
                            })
                        });
                        Q.sort(function (a, b) {
                            return a.o > b.o ? 1 : -1
                        });
                        Ne._.each(Q, function (a, b) {
                            p[b.v] = a
                        });
                        n = [];
                        for (s = 0; 3 > s; s++)
                            if (s == p.y) T++, C("ne-picker-datetime-whl-y", n, q.yearText, N, r, q.getYear(F), q.getYear(P));
                            else if (s == p.m) {
                            T++;
                            O = [];
                            for (k = 0; 12 > k; k++) R = J.replace(/[dy]/gi, "").replace(/mm/, (9 > k ? "0" + (k + 1) : k + 1) + (q.monthSuffix || "")).replace(/m/, k + 1 + (q.monthSuffix || "")), O.push({
                                value: k,
                                display: R.match(/MM/) ? R.replace(/MM/, '<span class="ne-picker-datetime-month">' + q.monthNames[k] + "</span>") : R.replace(/M/, '<span class="ne-picker-datetime-month">' + q.monthNamesShort[k] + "</span>")
                            });
                            C("ne-picker-datetime-whl-m", n, q.monthText, O)
                        } else if (s == p.d) {
                            T++;
                            O = [];
                            for (k = 1; 32 > k; k++) O.push({
                                value: k,
                                display: (J.match(/dd/i) && 10 > k ? "0" + k : k) + (q.daySuffix || "")
                            });
                            C("ne-picker-datetime-whl-d", n, q.dayText, O)
                        }
                        D.push(n)
                    }
                    if (G.match(/time/i)) {
                        da = !0;
                        Q = [];
                        Ne._.each(["h", "i", "s", "a"], function (a, b) {
                            a = y.search(RegExp(b, "i")); - 1 < a && Q.push({
                                o: a,
                                v: b
                            })
                        });
                        Q.sort(function (a, b) {
                            return a.o > b.o ? 1 : -1
                        });
                        Ne._.each(Q, function (a, b) {
                            p[b.v] = T + a
                        });
                        n = [];
                        for (s = T; s < T + 4; s++)
                            if (s == p.h) {
                                T++;
                                O = [];
                                for (k = ja; k < (Y ? 12 : 24); k += X) O.push({
                                    value: k,
                                    display: Y && 0 === k ? 12 : y.match(/hh/i) && 10 > k ? "0" + k : k
                                });
                                C("ne-picker-datetime-whl-h", n, q.hourText, O)
                            } else if (s == p.i) {
                            T++;
                            O = [];
                            for (k = ha; 60 > k; k += g) O.push({
                                value: k,
                                display: y.match(/ii/) && 10 > k ? "0" + k : k
                            });
                            C("ne-picker-datetime-whl-i", n, q.minuteText, O)
                        } else if (s == p.s) {
                            T++;
                            O = [];
                            for (k = ia; 60 > k; k += U) O.push({
                                value: k,
                                display: y.match(/ss/) && 10 > k ? "0" + k : k
                            });
                            C("ne-picker-datetime-whl-s", n, q.secText, O)
                        } else s == p.a && (T++, G = y.match(/A/), C("ne-picker-datetime-whl-a", n, q.ampmText, G ? [{
                            value: 0,
                            display: q.amText.toUpperCase()
                        }, {
                            value: 1,
                            display: q.pmText.toUpperCase()
                        }] : [{
                            value: 0,
                            display: q.amText
                        }, {
                            value: 1,
                            display: q.pmText
                        }]));
                        D.push(n)
                    }
                    j.getVal = function (a) {
                        return j._hasValue || a ? e(j.getArrayVal(a)) : null
                    };
                    j.setDate = function (a, b, c, d, e) {
                        j.setArrayVal(H(a), b, e, d, c)
                    };
                    j.getDate = j.getVal;
                    j.format = ea;
                    j.order = p;
                    B = V(B);
                    x = V(x);
                    v = {
                        y: F.getFullYear(),
                        m: 0,
                        d: 1,
                        h: ja,
                        i: ha,
                        s: ia,
                        a: 0
                    };
                    K = {
                        y: P.getFullYear(),
                        m: 11,
                        d: 31,
                        h: ma,
                        i: ga,
                        s: S,
                        a: 1
                    };
                    return {
                        compClass: "ne-picker-datetime",
                        wheels: D,
                        headerText: q.headerText ?
                            function () {
                                return picker.util.datetime.formatDate(ea, e(j.getArrayVal(!0)), q)
                            } : !1,
                        formatValue: function (a) {
                            return picker.util.datetime.formatDate(format, e(a), q)
                        },
                        parseValue: function (a) {
                            a || (W = {});
                            return H(a ? picker.util.datetime.parseDate(format, a, q) : q.defaultValue && q.defaultValue.getTime ? q.defaultValue : new Date, !!a && !!a.getTime)
                        },
                        validate: function (a) {
                            var b, f, g, h;
                            b = a.index;
                            var k = a.direction,
                                n = j.settings.wheels[0][p.d],
                                a = d(e(a.values), k),
                                m = H(a),
                                o = [],
                                a = {},
                                r = l(m, "y"),
                                s = l(m, "m"),
                                y = q.getMaxDayOfMonth(r, s),
                                u = !0,
                                w = !0;
                            Ne._.each("y,m,d,a,h,i,s".split(","), function (a, b) {
                                if (p[b] !== undefined) {
                                    var d = v[b],
                                        e = K[b],
                                        g = l(m, b);
                                    o[p[b]] = [];
                                    u && F && (d = E[b](F));
                                    w && P && (e = E[b](P));
                                    if (b != "y")
                                        for (f = v[b]; f <= K[b]; f++)(f < d || f > e) && o[p[b]].push(f);
                                    g < d && (g = d);
                                    g > e && (g = e);
                                    u && (u = g == d);
                                    w && (w = g == e);
                                    if (b == "d") {
                                        d = q.getDate(r, s, 1).getDay();
                                        e = {};
                                        c(B, r, s, d, y, e, 1);
                                        c(x, r, s, d, y, e, 0);
                                        Ne._.each(e, function (a, c) {
                                            c && o[p[b]].push(a)
                                        })
                                    }
                                }
                            });
                            da && Ne._.each(["a", "h", "i", "s"], function (a, b) {
                                var c = l(m, b),
                                    d = l(m, "d"),
                                    e = {};
                                p[b] !== undefined && (o[p[b]] = [], A(B, a, b, m, r, s, d, e, 0), A(x, a, b, m, r, s, d, e, 1), Ne._.each(e, function (a, c) {
                                    c && o[p[b]].push(a)
                                }), Z[a] = j.getValidValue(p[b], c, k, e))
                            });
                            if (n && (n._length !== y || fa && (b === t || b === p.y || b === p.m))) {
                                a[p.d] = n;
                                n.data = [];
                                for (b = 1; b <= y; b++) h = q.getDate(r, s, b).getDay(), g = J.replace(/[my]/gi, "").replace(/dd/, (10 > b ? "0" + b : b) + (q.daySuffix || "")).replace(/d/, b + (q.daySuffix || "")), n.data.push({
                                    value: b,
                                    display: g.match(/DD/) ? g.replace(/DD/, '<span class="ne-picker-datetime-day">' + q.dayNames[h] + "</span>") : g.replace(/D/, '<span class="ne-picker-datetime-day">' + q.dayNamesShort[h] + "</span>")
                                });
                                j._tempWheelArray[p.d] = m[p.d];
                                j.changeWheel(a)
                            }
                            return {
                                disabled: o,
                                valid: m
                            }
                        }
                    }
                },
                select: function (that) {
                    function j() {
                        var a, e, f, j, k, l = 0,
                            h = 0,
                            m = {};
                        n = {};
                        c = {};
                        V = [];
                        b = [];
                        invalid.length = 0;
                        !!settings.data ? Ne._.each(settings.data, function (d, i) {
                            j = i[settings.dataText];
                            k = i[settings.dataValue];
                            e = i[settings.dataGroup];
                            f = {
                                value: k,
                                text: j,
                                index: d
                            };
                            n[k] = f;
                            V.push(f);
                            grouplength && (m[e] === t ? (a = {
                                text: e,
                                value: h,
                                options: [],
                                index: h
                            }, c[h] = a, m[e] = h, b.push(a), h++) : a = c[m[e]], f.group = m[e], a.options.push(f));
                            i[settings.dataDisabled] && invalid.push(k)
                        }) : grouplength ? Ne.dom("optgroup", Elm).each(function (a) {
                            c[a] = {
                                text: this.label,
                                value: a,
                                options: [],
                                index: a
                            };
                            b.push(c[a]);
                            Ne.dom("option", this).each(function (b) {
                                f = {
                                    value: this.value,
                                    text: this.text,
                                    index: l++,
                                    group: a
                                };
                                n[this.value] = f;
                                V.push(f);
                                c[a].options.push(f);
                                this.disabled && invalid.push(this.value)
                            })
                        }) : Ne.dom("option", Elm).each(function (a) {
                            f = {
                                value: this.value,
                                text: this.text,
                                index: a
                            };
                            n[this.value] = f;
                            V.push(f);
                            this.disabled && invalid.push(this.value)
                        });
                        V.length && (d = V[0].value);
                        grouplength && (V = [], l = 0, Ne._.each(c, function (a, b) {
                            k = "__group" + a;
                            f = {
                                text: b.text,
                                value: k,
                                group: a,
                                index: l++,
                                cssClass: "ne-picker-select-group"
                            };
                            n[k] = f;
                            V.push(f);
                            invalid.push(f.value);
                            Ne._.each(b.options, function (a, b) {
                                b.index = l++;
                                V.push(b)
                            })
                        }))
                    }
                
                    function o(a, b, c) {
                        var d, e = [];
                        for (d = 0; d < a.length; d++) e.push({
                            value: a[d].value,
                            display: a[d].text,
                            cssClass: a[d].cssClass
                        });
                        return {
                            circular: !1,
                            multiple: b,
                            data: e,
                            label: c
                        }
                    }
                
                    function z() {
                        return o(V, isNumeric, "")
                    }
                
                    function N() {
                        var a, c = [
                            []
                        ];
                        grouplength && (a = o(b, !1, settings.groupLabel), c[A] = [a]);
                        a = z();
                        c[D] = [a];
                        return c
                    }
                
                    function r(b) {
                        isNumeric && (b && w(b) && (b = b.split(",")), Ne._.isArray(b) && (b = b[0]));
                        H = b === undefined || null === b || "" === b || !n[b] ? d : b;
                        grouplength && (a = n[H] ? n[H].group : null)
                    }
                
                    function u() {
                        var a = {};
                        a[D] = z();
                        visiable = !0;
                        that.changeWheel(a)
                    }
                
                    that.setVal = function (a, b, c, d, e) {
                        isNumeric && (a && w(a) && (a = a.split(",")), that._tempSelected[D] = m.arrayToObject(a), d || (that._selected[D] = m.arrayToObject(a)), a = a ? a[0] : null);
                        that.setVal(a, b, c, d, e)
                    };
                
                    that.getVal = function (a, b) {
                        var c;
                        c = isNumeric ? m.objectToArray(a ? that._tempSelected[D] : that._selected[D]) : (c = a ? that._tempWheelArray : that._hasValue ? that._wheelArray : null) ? settings.group && b ? c : c[D] : null;
                        return c
                    };
                    
                    that.refresh = function () {
                        var c = {};
                        j();
                        settings.wheels = N();
                        r(H);
                        c[D] = z();
                        that._tempWheelArray[D] = H;
                        grouplength && (c[A] = o(b, !1, settings.groupLabel), that._tempWheelArray[A] = a);
                        that._isVisible && that.changeWheel(c, 0, !0)
                    };
                
                    var e, d, a, b, c, A, H, V, n, D,
                        visiable,
                        Elm = Ne.dom(this),
                        settings = Ne._.extend(that.settings, {
                            invalid: [],
                            groupLabel: "",
                            dataText: "text",
                            dataValue: "value",
                            dataGroup: "group",
                            dataDisabled: "disabled"
                        }),
                        isNumeric = picker.util.isNumeric(settings.select) ? settings.select : "multiple" == settings.select || Elm.prop("multiple"),
                        grouplength = Ne.dom("optgroup", Elm).length,
                        invalid = [];
                
                    if (settings.invalid.length == 0) {
                        settings.invalid = invalid;
                    };
                    if (grouplength > 0) {
                        A = 0;
                        D = 1;
                    } else {
                        A = -1;
                        D = 0;
                    }
                    if (isNumeric) {
                        Elm.prop("multiple", !0);
                        that._selected[D] = {};
                        var elmVal = Elm.val() || [];
                        elmVal && w(elmVal) && (elmVal = elmVal.split(","));
                        that._selected[D] = m.arrayToObject(elmVal);
                    }
                
                    j();
                    r(Elm.val());
                    return {
                        headerText: false,
                        compClass: "ne-picker-select",
                        formatValue: function (a) {
                            var b, c = [];
                            if (isNumeric) {
                                for (b in that._tempSelected[D]) c.push(n[b] ? n[b].text : "");
                                return c.join(", ")
                            }
                            a = a[D];
                            return n[a] ? n[a].text : ""
                        },
                        parseValue: function (b) {
                            r(b === undefined ? Elm.val() : b);
                            return grouplength ? [a, H] : [H]
                        },
                        validate: function (a) {
                            var a = a.index,
                                b = [];
                            b[D] = settings.invalid;
                            visiable = false;
                            return {
                                disabled: b
                            }
                        },
                        onFill: function () {
                            var a = that.getVal();
                            //e.val(that._tempValue);
                            Elm.val(a)
                        },
                        onBeforeShow: function () {
                            if (isNumeric && settings.counter) settings.headerText = function () {
                                var a = 0;
                                Ne._.each(that._tempSelected[D], function () {
                                    a++
                                });
                                return (a > 1 ? settings.selectedPluralText || settings.selectedText : settings.selectedText).replace(/{count}/, a)
                            };
                            r(Elm.val());
                            that.settings.wheels = N();
                            visiable = true
                        },
                        onWheelGestureStart: function (a) {
                            if (a.index == A) settings.readonly = [false, true]
                        },
                        onWheelAnimationEnd: function (b) {
                            var d = that.getArrayVal(true);
                            if (b.index == A) {
                                if (d[A] != a) {
                                    a = d[A];
                                    H = c[a].options[0].value;
                                    d[D] = H;
                                    that.setArrayVal(d, false, false, true, 200);
                                }
                            } else if (b.index == D && d[D] != H) {
                                H = d[D];
                                if (grouplength && n[H].group != a) {
                                    a = n[H].group;
                                    d[A] = a;
                                    that.setArrayVal(d, false, false, true, 200)
                                }
                            }
                        }
                    }
                }
            }
        },
        classes: {
            ScrollView: function (el, settings) {
                var raf = window.requestAnimationFrame || function (x) {
                        x();
                    },
                    rafc = window.cancelAnimationFrame || function () {};
            
                var $btn,
                    btnTimer,
                    contSize,
                    diffX,
                    diffY,
                    diff,
                    dir,
                    easing,
                    elastic,
                    endX,
                    endY,
                    eventObj,
                    isBtn,
                    lastX,
                    maxScroll,
                    maxSnapScroll,
                    minScroll,
                    move,
                    moving,
                    nativeScroll,
                    rafID,
                    rafRunning,
                    scrolled,
                    scrollDebounce,
                    scrollTimer,
                    snap,
                    snapPoints,
                    startPos,
                    startTime,
                    startX,
                    startY,
                    style,
                    target,
                    transTimer,
                    vertical,
                    that = this,
                    currPos,
                    currSnap = 0,
                    currSnapDir = 1,
                    $elm = Ne.dom(el),
                    preset;
            
                function onStart(ev) {
            
                    that.trigger('onStart');
            
                    // Better performance if there are tap events on document
                    if (that.settings.stopProp) {
                        ev.stopPropagation();
                        ev.preventDefault();
                    }
            
                    if (that.settings.prevDef || ev.type == 'mousedown') {
                        // Prevent touch highlight and focus
                        // ev.preventDefault();
                    }
            
                    if (that.settings.readonly || (that.settings.lock && moving)) {
                        return;
                    }
            
                    if (picker.util.testTouch(ev, this) && !move) {
            
                        if ($btn) {
                            $btn.removeClass('ne-picker-btn-a');
                        }
            
                        // Highlight button
                        isBtn = false;
            
                        if (!moving) {
                            $btn = Ne.dom(ev.target).closest('.ne-picker-item', this);
            
                            if ($btn.length && !$btn.hasClass('ne-picker-btn-d')) {
                                isBtn = true;
                                btnTimer = setTimeout(function () {
                                    $btn.addClass('ne-picker-btn-a');
                                }, 100);
                            }
                        }
            
                        move = true;
                        scrolled = false;
                        nativeScroll = false;
            
                        that.scrolled = moving;
            
                        startX = picker.util.getCoord(ev, 'X');
                        startY = picker.util.getCoord(ev, 'Y');
                        endX = lastX = startX;
                        diffX = 0;
                        diffY = 0;
                        diff = 0;
            
                        startTime = new Date();
            
                        startPos = +picker.util.getPosition(target, vertical) || 0;
            
                        // Stop scrolling animation, 1ms is needed for Android 4.0
                        scroll(startPos, /(iphone|ipod|ipad)/i.test(navigator.userAgent) ? 0 : 1);
            
                        if (ev.type === 'mousedown') {
                            Ne.dom(document).on('mousemove', onMove).on('mouseup', onEnd);
                        }
                    }
                }
            
                function onMove(ev) {
                    if (move) {
                        if (that.settings.stopProp) {
                            ev.stopPropagation();
                        }
            
                        endX = picker.util.getCoord(ev, 'X');
                        endY = picker.util.getCoord(ev, 'Y');
                        diffX = endX - startX;
                        diffY = endY - startY;
                        diff = vertical ? diffY : diffX;
            
                        if (isBtn && (Math.abs(diffY) > 5 || Math.abs(diffX) > 5)) {
                            clearTimeout(btnTimer);
                            $btn.removeClass('ne-picker-btn-a');
                            isBtn = false;
                        }
            
                        if (that.scrolled || (!nativeScroll && Math.abs(diff) > 5)) {
            
                            if (!scrolled) {
                                that.trigger('onGestureStart', eventObj);
                            }
            
                            that.scrolled = scrolled = true;
            
                            if (!rafRunning) {
                                rafRunning = true;
                                rafID = raf(onMoving);
                            }
                        }
            
                        if (vertical || that.settings.scrollLock) {
                            // Always prevent native scroll, if vertical
                            //ev.preventDefault();
                        } else {
                            if (that.scrolled) {
                                // Prevent native scroll
                                //ev.preventDefault();
                            } else if (Math.abs(diffY) > 7) {
                                nativeScroll = true;
                                that.scrolled = true;
                                $elm.trigger('touchend');
                            }
                        }
                    }
                }
            
                function onMoving() {
                    //var time = new Date();
            
                    if (maxSnapScroll) {
                        diff = picker.util.constrain(diff, -snap * maxSnapScroll, snap * maxSnapScroll);
                    }
            
                    scroll(picker.util.constrain(startPos + diff, minScroll - elastic, maxScroll + elastic));
            
                    //if (that.settings.momentum) {
                    //    startTime = time;
                    //    lastX = endX;
                    //}
            
                    rafRunning = false;
                }
            
                function onEnd(ev) {
                    if (move) {
                        var speed,
                            time = new Date() - startTime;
            
                        // Better performance if there are tap events on document
                        if (that.settings.stopProp) {
                            ev.stopPropagation();
                        }
            
                        rafc(rafID);
                        rafRunning = false;
            
                        if (!nativeScroll && that.scrolled) {
                            // Calculate momentum distance
                            if (that.settings.momentum && time < 300) {
                                speed = diff / time;
                                //speed = Math.abs(lastX - endX) / time;
                                diff = Math.max(Math.abs(diff), (speed * speed) / that.settings.speedUnit) * (diff < 0 ? -1 : 1);
                            }
            
                            finalize(diff);
                        }
            
                        if (isBtn) {
                            clearTimeout(btnTimer);
                            $btn.addClass('ne-picker-btn-a');
                            setTimeout(function () {
                                $btn.removeClass('ne-picker-btn-a');
                            }, 100);
            
                            if (!nativeScroll && !that.scrolled) {
                                that.trigger('onBtnTap', {
                                    target: $btn[0]
                                });
                            }
                        }
            
                        // Detach document events
                        if (ev.type == 'mouseup') {
                            Ne.dom(document).off('mousemove', onMove).off('mouseup', onEnd);
                        }
            
                        move = false;
                    }
                }
            
                function onScroll(ev) {
                    ev = ev.originalEvent || ev;
            
                    diff = vertical ? ev.deltaY || ev.wheelDelta || ev.detail : ev.deltaX;
            
                    that.trigger('onStart');
            
                    if (that.settings.stopProp) {
                        ev.stopPropagation();
                    }
            
                    if (diff) {
            
                        ev.preventDefault();
            
                        if (that.settings.readonly) {
                            return;
                        }
            
                        diff = diff < 0 ? 20 : -20;
            
                        startPos = currPos;
            
                        if (!scrolled) {
                            eventObj = {
                                posX: vertical ? 0 : currPos,
                                posY: vertical ? currPos : 0,
                                originX: vertical ? 0 : startPos,
                                originY: vertical ? startPos : 0,
                                direction: diff > 0 ? (vertical ? 270 : 360) : (vertical ? 90 : 180)
                            };
                            that.trigger('onGestureStart', eventObj);
                        }
            
                        if (!rafRunning) {
                            rafRunning = true;
                            rafID = raf(onMoving);
                        }
            
                        scrolled = true;
            
                        clearTimeout(scrollDebounce);
                        scrollDebounce = setTimeout(function () {
                            rafc(rafID);
                            rafRunning = false;
                            scrolled = false;
            
                            finalize(diff);
                        }, 200);
                    }
                }
            
                function finalize(diff) {
                    var i,
                        time,
                        newPos;
            
                    // Limit scroll to snap size
                    if (maxSnapScroll) {
                        diff = picker.util.constrain(diff, -snap * maxSnapScroll, snap * maxSnapScroll);
                    }
            
                    // Calculate snap and limit between min and max
                    currSnap = Math.round((startPos + diff) / snap);
                    newPos = picker.util.constrain(currSnap * snap, minScroll, maxScroll);
            
                    // Snap to nearest element
                    if (snapPoints) {
                        if (diff < 0) {
                            for (i = snapPoints.length - 1; i >= 0; i--) {
                                if (Math.abs(newPos) + contSize >= snapPoints[i].breakpoint) {
                                    currSnap = i;
                                    currSnapDir = 2;
                                    newPos = snapPoints[i].snap2;
                                    break;
                                }
                            }
                        } else if (diff >= 0) {
                            for (i = 0; i < snapPoints.length; i++) {
                                if (Math.abs(newPos) <= snapPoints[i].breakpoint) {
                                    currSnap = i;
                                    currSnapDir = 1;
                                    newPos = snapPoints[i].snap1;
                                    break;
                                }
                            }
                        }
                        newPos = picker.util.constrain(newPos, minScroll, maxScroll);
                    }
            
                    time = that.settings.time || (currPos < minScroll || currPos > maxScroll ? 200 : Math.max(200, Math.abs(newPos - currPos) * that.settings.timeUnit));
            
                    eventObj.destinationX = vertical ? 0 : newPos;
                    eventObj.destinationY = vertical ? newPos : 0;
                    eventObj.duration = time;
                    eventObj.transitionTiming = easing;
            
                    that.trigger('onGestureEnd', eventObj);
            
                    // Scroll to the calculated position
                    scroll(newPos, time);
                }
            
                function scroll(pos, time, callback) {
                    var changed = pos != currPos,
                        anim = time > 1,
                        done = function () {
                            clearInterval(scrollTimer);
            
                            moving = false;
                            currPos = pos;
                            eventObj.posX = vertical ? 0 : pos;
                            eventObj.posY = vertical ? pos : 0;
            
                            if (changed) {
                                that.trigger('onMove', eventObj);
                            }
            
                            if (anim) {
                                //that.scrolled = false;
                                that.trigger('onAnimationEnd', eventObj);
                            }
            
                            if (callback) {
                                callback();
                            }
                        };
            
                    eventObj = {
                        posX: vertical ? 0 : currPos,
                        posY: vertical ? currPos : 0,
                        originX: vertical ? 0 : startPos,
                        originY: vertical ? startPos : 0,
                        direction: pos - currPos > 0 ? (vertical ? 270 : 360) : (vertical ? 90 : 180)
                    };
            
                    currPos = pos;
            
                    if (anim) {
                        eventObj.destinationX = vertical ? 0 : pos;
                        eventObj.destinationY = vertical ? pos : 0;
                        eventObj.duration = time;
                        eventObj.transitionTiming = easing;
            
                        that.trigger('onAnimationStart', eventObj);
                    }
                    var jsPrefix = picker.util.prefix.replace(/^\-/, '').replace(/\-$/, '').replace('moz', 'Moz');
                    style[jsPrefix + 'Transition'] = time ? picker.util.prefix + 'transform ' + Math.round(time) + 'ms ' + easing : '';
                    style[jsPrefix + 'Transform'] = 'translate3d(' + (vertical ? '0,' + pos + 'px,' : pos + 'px,' + '0,') + '0)';
            
                    if ((!changed && !moving) || !time || time <= 1) {
                        done();
                    } else if (time) {
                        moving = true;
            
                        clearInterval(scrollTimer);
                        scrollTimer = setInterval(function () {
                            var p = +picker.util.getPosition(target, vertical) || 0;
                            eventObj.posX = vertical ? 0 : p;
                            eventObj.posY = vertical ? p : 0;
                            that.trigger('onMove', eventObj);
                        }, 100);
            
                        clearTimeout(transTimer);
                        transTimer = setTimeout(function () {
                            done();
                            var jsPrefix = picker.util.prefix.replace(/^\-/, '').replace(/\-$/, '').replace('moz', 'Moz');
                            style[jsPrefix + 'Transition'] = '';
                        }, time);
                    }
                }
            
                /**
                 * Triggers an event
                 */
                that.trigger = function (name, ev) {
                    var ret;
                    if (that.settings[name]) { // Call preset event
                        ret = that.settings[name].call(el, ev || {}, that);
                    }
                    return ret;
                };
            
                /**
                 * Scroll to the given position or element
                 */
                that.scroll = function (pos, time, callback) {
                    // If position is not numeric, scroll to element
                    if (!picker.util.isNumeric(pos)) {
                        pos = Math.ceil((Ne.dom(pos, el).length ? Math.round(target.offset()[dir] - Ne.dom(pos, el).offset()[dir]) : currPos) / snap) * snap;
                    } else {
                        pos = Math.round(pos / snap) * snap;
                    }
            
                    currSnap = Math.round(pos / snap);
            
                    startPos = currPos;
            
                    scroll(picker.util.constrain(pos, minScroll, maxScroll), time, callback);
                };
            
                that.refresh = function (noScroll) {
                    var tempScroll;
            
                    contSize = that.settings.contSize === undefined ? vertical ? $elm.height() : $elm.width() : that.settings.contSize;
                    minScroll = that.settings.minScroll === undefined ? (vertical ? contSize - target.height() : contSize - target.width()) : that.settings.minScroll;
                    maxScroll = that.settings.maxScroll === undefined ? 0 : that.settings.maxScroll;
            
                    
                    if (typeof that.settings.snap === 'string') {
                        snapPoints = [];
                        target.find(that.settings.snap).each(function () {
                            var offset = vertical ? this.offsetTop : this.offsetLeft,
                                size = vertical ? this.offsetHeight : this.offsetWidth;
            
                            snapPoints.push({
                                breakpoint: offset + size / 2,
                                snap1: -offset,
                                snap2: contSize - offset - size
                            });
                        });
                    }
            
                    snap = picker.util.isNumeric(that.settings.snap) ? that.settings.snap : 1;
                    maxSnapScroll = that.settings.snap ? that.settings.maxSnapScroll : 0;
                    easing = that.settings.easing;
                    elastic = that.settings.elastic ? (picker.util.isNumeric(that.settings.snap) ? snap : (picker.util.isNumeric(that.settings.elastic) ? that.settings.elastic : 0)) : 0; // && that.settings.snap ? snap : 0;
            
                    if (currPos === undefined) {
                        currPos = that.settings.initialPos;
                        currSnap = Math.round(currPos / snap);
                    }
            
                    if (!noScroll) {
                        that.scroll(that.settings.snap ? (snapPoints ? snapPoints[currSnap]['snap' + currSnapDir] : (currSnap * snap)) : currPos);
                    }
                };
            
                that.scrolled = false;
                that.settings = {};
            
                // Create settings object
                Ne._.extend(that.settings, {
                    speedUnit: 0.0022,
                    timeUnit: 0.8,
                    //timeUnit: 3,
                    initialPos: 0,
                    axis: 'Y',
                    easing: 'ease-out',
                    //easing: 'cubic-bezier(0.190, 1.000, 0.220, 1.000)',
                    stopProp: true,
                    momentum: true,
                    mousewheel: true,
                    elastic: true
                }, settings);
            
                vertical = that.settings.axis == 'Y';
                dir = vertical ? 'top' : 'left';
                target = that.settings.moveElement || $elm.children().eq(0);
                style = target[0].style;
            
                that.refresh();
            
                $elm.on('touchstart mousedown', onStart)
                    .on('touchmove', onMove)
                    .on('touchend touchcancel', onEnd);
            
                if (that.settings.mousewheel) {
                    $elm.on('wheel mousewheel', onScroll);
                }
            
                el.addEventListener('click', function (ev) {
                    if (that.scrolled) {
                        that.scrolled = false;
                        ev.stopPropagation();
                        ev.preventDefault();
                    }
                }, true);
            },
            Scroller: function (el, settings) {
                var $elm = Ne.dom(el),
                    $markup,
                    that = this,
                    batchSize = 20,
                    tempWheelArray,
                    isValidating,
                    wheels = [],
                    wheelsMap = {};
            
                var _defaults = {
                    // Core
                    setText: '确定',
                    cancelText: '取消',
                    clearText: '明确',
                    selectedText: '{count} 选',
                    // Datetime component
                    dateFormat: 'yy/mm/dd',
                    dayNames: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
                    dayNamesShort: ['日', '一', '二', '三', '四', '五', '六'],
                    dayNamesMin: ['日', '一', '二', '三', '四', '五', '六'],
                    dayText: '日',
                    hourText: '时',
                    minuteText: '分',
                    monthNames: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                    monthNamesShort: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'],
                    monthText: '月',
                    secText: '秒',
                    timeFormat: 'HH:ii',
                    yearText: '年',
                    nowText: '当前',
                    pmText: '下午',
                    amText: '上午',
                    // Calendar component
                    dateText: '日',
                    timeText: '时间',
                    calendarText: '日历',
                    closeText: '关闭',
                    // Daterange component
                    fromText: '开始时间',
                    toText: '结束时间',
                    // Measurement components
                    wholeText: '合计',
                    fractionText: '分数',
                    unitText: '单位',
                    // Time / Timespan component
                    labels: ['年', '月', '日', '小时', '分钟', '秒', ''],
                    labelsShort: ['年', '月', '日', '点', '分', '秒', ''],
                    // Timer component
                    startText: '开始',
                    stopText: '停止',
                    resetText: '重置',
                    lapText: '圈',
                    hideText: '隐藏',
                    // Listview
                    backText: '背部',
                    undoText: '复原',
                    // Form
                    offText: '关闭',
                    onText: '开启',
                    groupLabel: "分组",
                    // Numpad
                    decimalSeparator: ',',
                    thousandsSeparator: ' ',
                    // Options
                    context: 'body',
                    disabled: false,
                    closeOnOverlayTap: true,
                    showOnFocus: false,
                    showOnTap: true,
                    display: 'center',
                    scrollLock: true,
                    tap: true,
                    btnClass: 'ne-btn',
                    btnWidth: true,
                    focusTrap: true,
                    focusOnClose: !/(iphone|ipod|ipad).* os 8_/i.test(navigator.userAgent), // Temporary for iOS8
                    // Options
                    minWidth: 80,
                    height: 40,
                    rows: 5,
                    multiline: 1,
                    delay: 300,
                    readonly: false,
                    showLabel: true,
                    //scroll3d: false,
                    wheels: [],
                    speedUnit: 0.0012,
                    timeUnit: 0.08,
                    validate: function () {},
                    formatValue: function (d) {
                        return d.join(' ');
                    },
                    parseValue: function (value, inst) {
                        var val = [],
                            ret = [],
                            i = 0,
                            found,
                            data;
            
                        if (value !== null && value !== undefined) {
                            val = (value + '').split(' ');
                        }
            
                        Ne._.each(inst.settings.wheels, function (j, wg) {
                            Ne._.each(wg, function (k, w) {
                                data = w.data;
                                // Default to first wheel value if not found
                                found = getItemValue(data[0]);
                                Ne._.each(data, function (l, item) {
                                    // Don't do strict comparison
                                    if (val[i] == getItemValue(item)) {
                                        found = getItemValue(item);
                                        return false;
                                    }
                                });
                                ret.push(found);
                                i++;
                            });
                        });
                        return ret;
                    }
                };
            
                function getIndex(wheel, val) {
                    return (wheel._array ? wheel._map[val] : wheel.getIndex(val)) || 0;
                }
            
                function getItem(wheel, i, def) {
                    var data = wheel.data;
            
                    if (i < wheel.min || i > wheel.max) {
                        return def;
                    }
                    return wheel._array ?
                        (wheel.circular ? Ne.dom(data).get(i % wheel._length) : data[i]) :
                        (Ne._.isFunction(data) ? data(i) : '');
                }
            
                function getItemValue(item) {
                    return Ne._.isPlainObject(item) ? (item.value !== undefined ? item.value : item.display) : item;
                }
            
                function getValue(wheel, i, def) {
                    return getItemValue(getItem(wheel, i, def));
                }
            
                function toggleItem(i, $selected) {
                    var wheel = wheels[i],
                        $item = $selected || wheel._$markup.find('.ne-picker-item[data-val="' + tempWheelArray[i] + '"]'),
                        idx = +$item.attr('data-index'),
                        val = getValue(wheel, idx),
                        selected = that._tempSelected[i],
                        maxSelect = picker.util.isNumeric(wheel.multiple) ? wheel.multiple : Infinity;
            
                    if (wheel.multiple && !wheel._disabled[val]) {
                        if (selected[val] !== undefined) {
                            $item.removeClass('ne-picker-item-selected').removeAttr('aria-selected');
                            delete selected[val];
                        } else if (picker.util.objectToArray(selected).length < maxSelect) {
                            $item.addClass('ne-picker-item-selected').attr('aria-selected', 'true');
                            selected[val] = val;
                        }
                        return true;
                    }
                }
            
                function step(index, direction) {
                    var wheel = wheels[index];
                    setWheelValue(wheel, index, wheel._current + direction, 200, direction == 1 ? 1 : 2);
                }
            
                function isReadOnly(i) {
                    return Ne._.isArray(that.settings.readonly) ? that.settings.readonly[i] : that.settings.readonly;
                }
            
                function initWheel(w, l, keep) {
                    var index = w._index - w._batch;
            
                    w.data = w.data || [];
                    w.key = w.key !== undefined ? w.key : l;
                    w.label = w.label !== undefined ? w.label : l;
            
                    w._map = {};
                    w._array = Ne._.isArray(w.data);
            
                    // Map keys to index
                    if (w._array) {
                        w._length = w.data.length;
                        Ne._.each(w.data, function (i, v) {
                            w._map[getItemValue(v)] = i;
                        });
                    }
            
                    w.circular = that.settings.circular === undefined ?
                        (w.circular === undefined ? (w._array && w._length > that.settings.rows) : w.circular) :
                        (Ne._.isArray(that.settings.circular) ? that.settings.circular[l] : that.settings.circular);
                    w.min = w._array ? (w.circular ? -Infinity : 0) : (w.min === undefined ? -Infinity : w.min);
                    w.max = w._array ? (w.circular ? Infinity : w._length - 1) : (w.max === undefined ? Infinity : w.max);
            
                    w._nr = l;
                    w._index = getIndex(w, tempWheelArray[l]);
                    w._disabled = {};
                    w._batch = 0;
                    w._current = w._index;
                    w._first = w._index - batchSize;  
                    w._last = w._index + batchSize;
                    w._offset = w._first;
            
                    if (keep) {
                        w._offset -= w._margin / that.settings.height + (w._index - index);
                        w._margin += (w._index - index) * that.settings.height;
                    } else {
                        w._margin = 0; //w._first * that.settings.height;
                    }
            
                    w._refresh = function (noScroll) {
                        Ne._.extend(w._scroller.settings, {
                            minScroll: -((w.multiple ? Math.max(0, w.max - that.settings.rows + 1) : w.max) - w._offset) * that.settings.height,
                            maxScroll: -(w.min - w._offset) * that.settings.height
                        });
            
                        w._scroller.refresh(noScroll);
                    };
            
                    wheelsMap[w.key] = w;
            
                    return w;
                }
            
                function generateItems(wheel, index, start, end) {
                    var i,
                        css,
                        item,
                        value,
                        text,
                        lbl,
                        selected,
                        html = '',
                        checked = that._tempSelected[index],
                        disabled = wheel._disabled || {};
            
                    for (i = start; i <= end; i++) {
                        item = getItem(wheel, i);
                        text = Ne._.isPlainObject(item) ? item.display : item;
                        value = item && item.value !== undefined ? item.value : text;
                        css = item && item.cssClass !== undefined ? item.cssClass : '';
                        lbl = item && item.label !== undefined ? item.label : '';
                        selected = value !== undefined && value == tempWheelArray[index] && !wheel.multiple;
            
                        // TODO: don't generate items with no value (use margin or placeholder instead)
                        html += '<div role="option" aria-selected="' + (checked[value] ? true : false) +
                            '" class="ne-picker-item ' + css + ' ' +
                            (selected ? 'ne-picker-item-selected ' : '') +
                            (checked[value] ? 'ne-picker-item-selected' : '') +
                            (value === undefined ? ' ne-picker-item-ph' : '') +
                            (disabled[value] ? ' ne-picker-item-inv ne-picker-btn-d' : '') +
                            '" data-index="' + i +
                            '" data-val="' + value + '"' +
                            (lbl ? ' aria-label="' + lbl + '"' : '') +
                            (selected ? ' aria-selected="true"' : '') +
                            ' style="height:' + that.settings.height + 'px;line-height:' + that.settings.height + 'px;">' +
                            (text === undefined ? '' : text) +
                            '</div>';
                    }
            
                    return html;
                }
            
                function formatHeader(v) {
                    var t = that.settings.headerText;
                    return t ? (typeof t === 'function' ? t.call(el, v) : t.replace(/\{value\}/i, v)) : '';
                }
            
                function infinite(wheel, i, pos) {
                    var index = Math.round(-pos / that.settings.height) + wheel._offset,
                        diff = index - wheel._current,
                        first = wheel._first,
                        last = wheel._last;
            
                    if (diff) {
                        wheel._first += diff;
                        wheel._last += diff;
            
                        wheel._current = index;
            
                        // Generate items
                        setTimeout(function () {
                            if (diff > 0) {
                                wheel._$markup.append(generateItems(wheel, i, Math.max(last + 1, first + diff), last + diff));
                                Ne.dom('.ne-picker-item', wheel._$markup).slice(0, Math.min(diff, last - first + 1)).remove();
             
                            } else if (diff < 0) {
                                wheel._$markup.prepend(generateItems(wheel, i, first + diff, Math.min(first - 1, last + diff)));
                                Ne.dom('.ne-picker-item', wheel._$markup).slice(Math.max(diff, first - last - 1)).remove();
             
                            }
            
                            wheel._margin += diff * that.settings.height;
                            wheel._$markup.css('margin-top', wheel._margin + 'px');
                        }, 10);
                    }
                }
            
                function getValid(index, val, dir, dis) {
                    var counter,
                        wheel = wheels[index],
                        disabled = dis || wheel._disabled,
                        idx = getIndex(wheel, val),
                        v1 = val,
                        v2 = val,
                        dist1 = 0,
                        dist2 = 0;
            
                    if (val === undefined) {
                        val = getValue(wheel, idx);
                    }
            
                    // TODO: what if all items are invalid
                    if (disabled[val]) {
                        counter = 0;
                        while (idx - dist1 >= wheel.min && disabled[v1] && counter < 100) {
                            counter++;
                            dist1++;
                            v1 = getValue(wheel, idx - dist1);
                        }
            
                        counter = 0;
                        while (idx + dist2 < wheel.max && disabled[v2] && counter < 100) {
                            counter++;
                            dist2++;
                            v2 = getValue(wheel, idx + dist2);
                        }
            
                        // If we have direction (+/- or mouse wheel), the distance does not count
                        if (((dist2 < dist1 && dist2 && dir !== 2) || !dist1 || (idx - dist1 < 0) || dir == 1) && !disabled[v2]) {
                            val = v2;
                        } else {
                            val = v1;
                        }
                    }
            
                    return val;
                }
            
                function scrollToPos(time, index, dir, manual) {
                    var diff,
                        idx,
                        offset,
                        ret,
                        v,
                        isVisible = that._isVisible;
            
                    isValidating = true;
                    ret = that.settings.validate.call(el, {
                        values: tempWheelArray.slice(0),
                        index: index,
                        direction: dir
                    }, that) || {};
                    isValidating = false;
            
                    if (ret.valid) {
                        that._tempWheelArray = tempWheelArray = ret.valid.slice(0);
                    }
            
                    that.trigger('onValidated');
            
                    Ne._.each(wheels, function (i, wheel) {
                        if (isVisible) {
                            // Enable all items
                            wheel._$markup.find('.ne-picker-item').removeClass('ne-picker-item-inv ne-picker-btn-d');
                        }
                        wheel._disabled = {};
            
                        // Disable invalid items
                        if (ret.disabled && ret.disabled[i]) {
                            Ne._.each(ret.disabled[i], function (j, v) {
                                wheel._disabled[v] = true;
                                if (isVisible) {
                                    wheel._$markup.find('.ne-picker-item[data-val="' + v + '"]').addClass('ne-picker-item-inv ne-picker-btn-d');
                                }
                            });
                        }
            
                        // Get closest valid value
                        tempWheelArray[i] = wheel.multiple ? tempWheelArray[i] : getValid(i, tempWheelArray[i], dir);
            
                        if (isVisible) {
                            if (!wheel.multiple || index === undefined) {
                                wheel._$markup
                                    .find('.ne-picker-item-selected')
                                    .removeClass('ne-picker-item-selected')
                                    .removeAttr('aria-selected');
                            }
            
                            if (wheel.multiple) {
                                // Add selected styling to selected elements in case of multiselect
                                if (index === undefined) {
                                    for (v in that._tempSelected[i]) {
                                        wheel._$markup
                                            .find('.ne-picker-item[data-val="' + v + '"]')
                                            .addClass('ne-picker-item-selected')
                                            .attr('aria-selected', 'true');
                                    }
                                }
                            } else {
                                // Mark element as aria selected
                                wheel._$markup
                                    .find('.ne-picker-item[data-val="' + tempWheelArray[i] + '"]')
                                    .addClass('ne-picker-item-selected')
                                    .attr('aria-selected', 'true');
                            }
            
                            // Get index of valid value
                            idx = getIndex(wheel, tempWheelArray[i]);
            
                            diff = idx - wheel._index + wheel._batch;
            
                            if (Math.abs(diff) > 2 * batchSize + 1) {
                                offset = diff + (2 * batchSize + 1) * (diff > 0 ? -1 : 1);
                                wheel._offset += offset;
                                wheel._margin -= offset * that.settings.height;
                                wheel._refresh();
                            }
            
                            wheel._index = idx + wheel._batch;
            
                            // Scroll to valid value
                            wheel._scroller.scroll(-(idx - wheel._offset + wheel._batch) * that.settings.height, (index === i || index === undefined) ? time : 200);
                        }
                    });
            
                    // Get formatted value
                    that._tempValue = that.settings.formatValue(tempWheelArray, that);
            
                    
            
                    if (manual) {
                        that.trigger('onChange', {
                            valueText: that._tempValue
                        });
                    }
                }
            
                function setWheelValue(wheel, i, idx, time, dir) {
                    // Get the value at the given index
                    var value = getValue(wheel, idx);
            
                    if (value !== undefined) {
                        tempWheelArray[i] = value;
            
                        // In case of circular wheels calculate the offset of the current batch
                        wheel._batch = wheel._array ? Math.floor(idx / wheel._length) * wheel._length : 0;
            
                        setTimeout(function () {
                            scrollToPos(time, i, dir, true);
                        }, 10);
                    }
                }
            
                function setValue(fill, change, time, noscroll, temp) {
                    if (!noscroll) {
                        scrollToPos(time);
                    }
            
                    if (!temp) {
                        that._wheelArray = tempWheelArray.slice(0);
                        that._selected = Ne._.extend(true, {}, that._tempSelected);
                    }
            
                    if (fill) {
                        if ($elm.is('input')) {
                            $elm.val(that._hasValue ? that._tempValue : '');
                        }
            
                        that.trigger('onFill', {
                            valueText: that._hasValue ? that._tempValue : '',
                            change: change
                        });
            
                        if (change) {
                            that._preventChange = true;
                            $elm.trigger('change');
                        }
                    }
                }
            
                that.trigger = function (name, ev) {
                    var ret;
                    if (that.settings[name]) { // Call preset event
                        ret = that.settings[name].call(el, ev || {}, that);
                    }
                    return ret;
                };
            
                that.show = function () {
            
                    // Parse value from input
                    var v = $elm.val() || '',
                        l = 0;
            
                    if (v !== '') {
                        that._hasValue = true;
                    }
            
                    that._tempWheelArray = tempWheelArray = that._hasValue && that._wheelArray ?
                        that._wheelArray.slice(0) :
                        that.settings.parseValue.call(el, v, that) || [];
            
                    that._tempSelected = Ne._.extend(true, {}, that._selected);
            
                    Ne._.each(that.settings.wheels, function (i, wg) {
                        Ne._.each(wg, function (j, w) { // Wheels
                            wheels[l] = initWheel(w, l);
                            l++;
                        });
                    });
            
                    setValue();
            
                    if (that.trigger('onBeforeShow') === false) {
                        return false;
                    }
            
                    // Hide virtual keyboard
                    if (Ne.dom(document.activeElement).is('input,textarea')) {
                        document.activeElement.blur();
                    }
            
                    // Create wheels containers
                    var htmlstr_content = '',
                        l = 0;
            
                    Ne._.each(that.settings.wheels, function (i, wg) {
                        htmlstr_content += '<div class="ne-picker-whl-group-c">' +
                            '<div class="ne-picker-whl-group ne-picker-label-v">';
                        Ne._.each(wg, function (j, w) { // Wheels
                            that._tempSelected[l] = Ne._.extend({}, that._selected[l]);
                            wheels[l] = initWheel(w, l);
                            var lbl = w.label !== undefined ? w.label : j;
                            htmlstr_content += '<div class="ne-picker-whl-w">' +
                                '<div class="ne-picker-whl-o"></div>' +
                                '<div class="ne-picker-whl-l" style="height:' + that.settings.height + 'px;margin-top:-' + (that.settings.height / 2 + (that.settings.selectedLineBorder || 0)) + 'px;"></div>' +
                                '<div aria-label="' + lbl + '" data-index="' + l + '" class="ne-picker-whl"' + ' style="height:' + (that.settings.rows * that.settings.height) + 'px;">' +
                                '<div class="ne-picker-label">' + lbl + '</div>' + // Wheel label
                                '<div class="ne-picker-whl-c" style="height:' + that.settings.height + 'px;margin-top:-' + (that.settings.height / 2 + 1) + 'px;">' +
                                '<div class="ne-picker-whl-sc">' +
                                generateItems(w, l, w._first, w._last) +
                                '</div>' +
                                '</div>' +
                                '</div>' +
                                '</div>';
                            l++;
                        });
                        htmlstr_content += '</div></div>';
                    });
                    var htmlstr_actionsheet =
                        '<div class="ne-actionsheet" ne-role="actionsheet">' +
                        '<div class="ne-mask"></div>' +
                        '<div class="ne-actionsheet-container">' +
                        '<div class="ne-picker ' + (that.settings.compClass || '') + '">' +
                        '<div class="ne-picker-toolbar ne-cell bg-light border-bottom">' +
                        '<div class="ne-cell-left"><button  class="ne-btn ne-btn-default ne-picker-cancelbtn  ne-picker-btn1">' + that.settings.cancelText + '</button></div>' +
                        '<div class="ne-cell-right"><button  class="ne-btn ne-btn-primary ne-picker-setbtn ne-picker-btn0">' + that.settings.setText + '</button></div>' +
                        '</div>' +
                        '<div class="ne-picker-container">' + htmlstr_content + '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>';
                    if(that.settings.containerType=='popover'){
                        htmlstr_actionsheet =
                        '<div class="ne-popover ne-popover-picker" ne-role="popover">' +
                        '<div class="ne-mask" ne-tap="hide:popover"></div>' +
                        '<div class="ne-bubble bg-light"><div class="ne-bubble-content w15">' +
                        '<div class="ne-picker ' + (that.settings.compClass || '') + '">' +
                        '<div class="ne-picker-toolbar ne-cell bg-light border-bottom">' +
                        '<div class="ne-cell-left"><button  class="ne-btn ne-btn-default ne-picker-cancelbtn  ne-picker-btn1">' + that.settings.cancelText + '</button></div>' +
                        '<div class="ne-cell-right"><button  class="ne-btn ne-btn-primary ne-picker-setbtn ne-picker-btn0">' + that.settings.setText + '</button></div>' +
                        '</div>' +
                        '<div class="ne-picker-container">' + htmlstr_content + '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>';
                    }
                    $markup = Ne.dom(htmlstr_actionsheet);
            
                    that._isVisible = true;
            
                    Ne.dom('.ne-picker-whl', $markup).each(function (i) {
                        var idx,
                            $wh = Ne.dom(this),
                            wheel = wheels[i];
            
                        wheel._$markup = Ne.dom('.ne-picker-whl-sc', this);
            
                        wheel._scroller = new picker.classes.ScrollView(this, {
                            mousewheel: that.settings.mousewheel,
                            moveElement: wheel._$markup,
                            initialPos: -(wheel._index - wheel._offset) * that.settings.height,
                            contSize: 0,
                            snap: that.settings.height,
                            minScroll: -((wheel.multiple ? Math.max(0, wheel.max - that.settings.rows + 1) : wheel.max) - wheel._offset) * that.settings.height,
                            maxScroll: -(wheel.min - wheel._offset) * that.settings.height,
                            maxSnapScroll: batchSize,
                            prevDef: true,
                            stopProp: true,
                            //timeUnit: 3,
                            //easing: 'cubic-bezier(0.190, 1.000, 0.220, 1.000)',
                            onStart: function (ev, inst) {
                                inst.settings.readonly = isReadOnly(i);
                            },
                            onGestureStart: function () {
                                $wh.addClass('ne-picker-whl-a ne-picker-whl-anim');
            
                                that.trigger('onWheelGestureStart', {
                                    index: i
                                });
                            },
                            onGestureEnd: function (ev) {
                                var dir = ev.direction == 90 ? 1 : 2,
                                    time = ev.duration,
                                    pos = ev.destinationY;
            
                                idx = Math.round(-pos / that.settings.height) + wheel._offset;
            
                                setWheelValue(wheel, i, idx, time, dir);
                            },
                            onAnimationStart: function () {
                                $wh.addClass('ne-picker-whl-anim');
                            },
                            onAnimationEnd: function () {
                                $wh.removeClass('ne-picker-whl-a ne-picker-whl-anim');
            
                                that.trigger('onWheelAnimationEnd', {
                                    index: i
                                });
                            },
                            onMove: function (ev) {
                                wheel._disabled[59] = true
                                infinite(wheel, i, ev.posY);
                            },
                            onBtnTap: function (ev) {
                                var $item = Ne.dom(ev.target),
                                    idx = +$item.attr('data-index');
            
                                // Select item on tap
                                if (toggleItem(i, $item)) {
                                    // Don't scroll, but trigger validation
                                    idx = wheel._current;
                                }
            
                                if (that.trigger('onItemTap', {
                                        target: $item[0],
                                        selected: $item.hasClass('ne-picker-itm-sel')
                                    }) !== false) {
                                    setWheelValue(wheel, i, idx, 200);
                                }
                            }
                        });
                    });
            
                    scrollToPos();
            
                    $markup[0].querySelector('.ne-picker-setbtn').onclick = function (ev) {
                        that._hasValue = true;
                        setValue(true, true, 0, true);
                        that.hide();
                    }
                    $markup[0].querySelector('.ne-picker-cancelbtn').onclick = function (ev) {
                        that.hide();
                    }
                    $markup[0].querySelector('.ne-mask').onclick = function (ev) {
                        that.hide();
                    }
            
                    // Show
                    // Enter / ESC  
                    $markup.appendTo(Ne.dom(that.settings.context));
                    Ne.acts($markup[0]).show({
                        sender:$elm[0]
                    });
                };
            
                that.hide = function () {
                    Ne.acts($markup[0]).hide();
                    setTimeout(function () {
                        $elm.off('.mbsc');
                        $markup.remove();
                        that = null;
                    }, 500);
                };
            
                that.setVal = function (val, fill, change, temp, time) {
                    that._hasValue = val !== null && val !== undefined;
                    that._tempWheelArray = tempWheelArray = Ne._.isArray(val) ? val.slice(0) : that.settings.parseValue.call(el, val, that) || [];
                    setValue(fill, change === undefined ? fill : change, time, false, temp);
                };
            
                that.getValidValue = getValid;
            
                that.setArrayVal = that.setVal;
            
                that.getArrayVal = function (temp) {
                    return temp ? that._tempWheelArray : that._wheelArray;
                };
            
                that.changeWheel = function (whls, time, manual) {
                    var i,
                        w;
            
                    Ne._.each(whls, function (key, wheel) {
                        w = wheelsMap[key];
                        i = w._nr;
                        // Check if wheel exists
                        if (w) {
                            Ne._.extend(w, wheel);
            
                            initWheel(w, i, true);
            
                            if (that._isVisible) {
                                w._$markup
                                    .html(generateItems(w, i, w._first, w._last))
                                    .css('margin-top', w._margin + 'px');
            
                                w._refresh(isValidating);
                            }
                        }
                    });
            
                    if (!isValidating) {
                        scrollToPos(time, undefined, undefined, manual);
                    }
                };
            
                that.init = function init() {
                    that.settings = {};
                    that._isVisible = false;
                    that._tempSelected = {};
                    that._selected = {};
            
                    // Create settings object
                    Ne._.extend(that.settings, _defaults, settings);
                    var __preset=settings.preset=='datetime'||settings.preset=='time'?'date':settings.preset;
                    __preset = picker.presets.scroller[__preset].call(el, that);
                    Ne._.extend(that.settings, __preset);
            
                    // Unbind all events (if re-init)
                    $elm.off('.mbsc');
            
                    $elm.on('mousedown.mbsc', function (ev) {
                        ev.preventDefault();
                    });
                }
            
                that.init();
            }
        }
    };


    function showDatePicker(target) {
        var __obj = {
            preset: target.getAttribute('data-type') || target.getAttribute('type')
        };
        if (target.getAttribute('data-invalid')) {
            __obj.invalid = JSON.parse(target.getAttribute('data-invalid'));
        }
        if (__obj.preset == 'date') {
            __obj.dateFormat = 'yy-mm-dd';
        }
        if (__obj.preset == 'datetime') {
            __obj.dateFormat = 'yy-mm-dd hh:ii:ss';
        }
        if (__obj.preset == 'month') {
            __obj.preset = 'date';
            __obj.dateFormat = 'yy-mm';
        }
        if (target.getAttribute('min')) {
            __obj.min = new Date(target.getAttribute('min'));
        }
        if (target.getAttribute('max')) {
            __obj.max = new Date(target.getAttribute('max'));
        }
        if(document.body.offsetWidth>800){
            __obj.containerType='popover';
        }
        var inst = new picker.classes.Scroller(target, __obj);
        inst.show();
        return inst;
    }

    function showSelectPicker(target) {
        var inst = new picker.classes.Scroller(target, {
            preset: 'select',
            label: target.getAttribute('aria-label') || '请选择'
        });

        inst.show();
        return inst;
    }

    //define
    Ne.component('picker', {
        props: {
            show: function () {
                if (this.tagName.toLowerCase() == 'select') {
                    return showSelectPicker(this);
                } else {
                    return showDatePicker(this);
                }
            }
        }
    });
})(Ne);

/****************************************************************** 
 * @popover
*******************************************************************/

(function (Ne) {
    //define
    Ne.component('popover', {
        props: {
            show: function (event) {
                var _this = this,
                    el_bubble = _this.querySelector('.ne-bubble'),
                    el_sender = event.sender,
                    alignCls = 'aligncenter',
                    directionCls = 'directionup',
                    screenwidth=window.screen.width,
                    screenheight=window.screen.height,
                    offsetleft = screenwidth / 2,
                    offsettop = screenheight / 2;

                if (el_sender && el_sender.style) {
                    offsetleft = Ne.dom(el_sender).offset().left + el_sender.offsetWidth / 2;
                    offsettop = Ne.dom(el_sender.offsetParent).offset().top + el_sender.offsetTop;
                    if (offsetleft < (screenwidth / 3)) {
                        alignCls = 'alignleft';
                    } else if (offsetleft > (screenwidth * 2 / 3)) {
                        alignCls = 'alignright';
                    }
                    if (offsettop > (screenheight / 2)) {
                        directionCls = 'directionup';
                    } else {
                        directionCls = 'directiondown';
                        offsettop += el_sender.offsetHeight;
                    }
                }

                //设置气泡方向
                ['ne-bubble-alignright', 'ne-bubble-alignleft', 'ne-bubble-aligncenter', 'ne-bubble-directionup', 'ne-bubble-directiondown'].forEach(function (item) {
                    el_bubble.classList.remove(item);
                });
                 
                el_bubble.classList.add('ne-bubble-' + alignCls);
                el_bubble.classList.add('ne-bubble-' + directionCls);

                //设置气泡位置
                _this.style.left = offsetleft + 'px';
                _this.style.top = offsettop + 'px';

                Ne.dom.animateShow(_this);
            },
            hide: function () {
                Ne.dom.animateHide(this);
            }
        }
    });
})(Ne);
/****************************************************************** 
 * @range
 *******************************************************************/

(function (Ne) {
    //fn 
    function createVirtualRange(target) {
        var __min = target.getAttribute('min') || 0,
            __max = target.getAttribute('max') || 100,
            __value = target.getAttribute('value') || 0;

        var el_range = Ne.dom.render('<div class="ne-range">' +
                '<div class="ne-range-track"><span></span></div>' +
                '<div class="ne-range-thumb">' +
                '<div class="ne-range-tips"><span></span></div>' +
                '</div>' +
                '</div>'),
            el_range_track = el_range.querySelector('.ne-range-track'),
            el_range_thumb = el_range.querySelector('.ne-range-thumb'),
            el_range_tips = el_range_thumb.querySelector('.ne-range-tips');
        target.parentElement.appendChild(el_range);
        var __maxWidth = el_range_track.offsetWidth;
        var __thumbLeft = __value * __maxWidth / __max;
        el_range_thumb.__left = __thumbLeft - 20;
        el_range_track.querySelector('span').style.width = __thumbLeft + 'px';
        el_range_tips.querySelector('span').innerText = __value;
        Ne.motion.move({
            el: el_range_thumb,
            x: __thumbLeft,
            y: 0,
            duration: 0
        });

        Ne.touch.on(el_range_thumb, 'dragstart', function (event) {
            el_range_thumb.classList.add('ondrag');
        });
        Ne.touch.on(el_range_thumb, 'drag', function (event) {
            var _distanceX = el_range_thumb.__left + event.distanceX;
            _distanceX = _distanceX > 0 ? (_distanceX > __maxWidth ? __maxWidth : _distanceX) : 0;
            var __tovalue = Math.ceil(_distanceX * __max / __maxWidth);
            Ne.motion.move({
                el: el_range_thumb,
                x: _distanceX,
                y: 0,
                duration: 0
            });
            el_range_tips.querySelector('span').innerText = __tovalue;
            target.value = __tovalue;
            el_range_thumb._distanceX = _distanceX;
            el_range_track.querySelector('span').style.width = _distanceX + 'px';
        });
        Ne.touch.on(el_range_thumb, 'dragend', function (event) {
            el_range_thumb.classList.remove('ondrag');
            el_range_thumb.__left = el_range_thumb._distanceX;
            el_range_thumb._distanceX = 0;
        });
    }

    function showTip(target) {
        var el_tips = target.previousElementSibling;
        if (!el_tips || el_tips.classList == undefined || !el_tips.classList.contains('ne-range-tips')) {
            el_tips = Ne.dom.render('<div class="ne-range-tips"><span></span></div>');
            Ne.dom(el_tips).insertBefore(target);
        }
        el_tips.querySelector('span').innerText = target.value;
        var curval = target.value;
        var maxval = target.getAttribute('max') || 100;
        var move_x = curval * target.offsetWidth / maxval;
        if (curval > maxval / 2) {
            var move_x_offset = Ne.motion.timingFunction.Linear(curval - maxval / 2, 0, 1, maxval / 2) * 12;
            move_x -= move_x_offset;
        } else if (curval < maxval / 2) {
            var move_x_offset =12 - Ne.motion.timingFunction.Linear(curval, 0, 1, maxval / 2) * 12;;
            move_x += move_x_offset;
        }
        Ne.motion.move({
            el: el_tips,
            x: move_x,
            y: 0,
            duration: 0
        });
        el_tips.classList.add('visible');
        //el_tips._timing && clearTimeout(el_tips._timing);
        //el_tips._timing = setTimeout(function () {
        //el_tips.classList.remove('visible');
        //}, 1000);
    }

    //define
    Ne.component('range', {
        props: {
            oninput: function () {
                showTip(this);
            },
            createVirtualRange: function () {
                createVirtualRange(this);
            }
        }
    });
})(Ne);

/****************************************************************** 
 * @scroll
*******************************************************************/

(function (Ne) {
    function getOnScrollTop(target){
        if(target.onScrollTop){
            return target.onScrollTop;
        }else if(target.getAttribute('onscrolltop')){
            target.onScrollTop=window[target.getAttribute('onscrolltop')];
            return target.onScrollTop;
        }else{
            return null;
        }
    }

    function getOnScrollBottom(target){
        if(target.onScrollBottom){
            return target.onScrollBottom;
        }else if(target.getAttribute('onscrollbottom')){
            target.onScrollBottom=window[target.getAttribute('onscrollbottom')];
            return target.onScrollBottom;
        }else{
            return null;
        }
    }

    
    function handleLoadingControl(target, noMoreState, inloadmore) {
        var el_control = target.querySelector('.ne-scroll-loadingcontrol');
        target._inloadmore = inloadmore;
        el_control.classList[inloadmore?'remove':'add']('hidden');
        if (noMoreState) {
            target._noMoreState = noMoreState;
            el_control.innerHTML = '<span>没有更多了</span>';
            el_control.classList.remove('hidden');
        } else if(!el_control.querySelector('.ne-preloader')){
            el_control.innerHTML = '<i class="ne-preloader size-xx-large"></i>';
        }
    }


    //eventhandler 
    function _ev_scroll(event) {
        var target = event.currentTarget;
        if (!target._inloadmore && !target._noMoreState && (target.scrollTop + target.clientHeight) >= target.scrollHeight - 3) {
            //滑到底部
            var onScrollBottom=getOnScrollBottom(target);
            if (onScrollBottom) {
                handleLoadingControl(target, false, true);
                onScrollBottom(function (noMoreState) {
                    handleLoadingControl(target, noMoreState, false);
                }, event);
            }
        }
    }

    function _ev_onDragStart(event) {
        event.preventDefault();
        event.stopPropagation();
        var target = event.currentTarget;
        if (!target._inrefresh && event.y > 0 && target.scrollTop == 0 && getOnScrollTop(target)) {
            target._inrefresh = true;
            target.previousElementSibling.classList.remove('hidden');
            target.classList.add('ne-scroll-ondrag');
        }
    }

    function _ev_onDrag(event) {
        event.preventDefault();
        event.stopPropagation();
        var target = event.currentTarget;
        if (target._inrefresh) {
            target.style[Ne.dom.transformProperty] = "translate3d(0," + (event.y * .4) + "px,0)";
        }
    }

    function _ev_onDragEnd(event) {
        event.preventDefault();
        event.stopPropagation();
        var target = event.currentTarget;
        if (target._inrefresh) {
            target.classList.remove('ne-scroll-ondrag');
            target.style[Ne.dom.transformProperty] = "";
            if (event.y >= 150) {
                target.classList.add('ne-scroll-refreshing');
                target.onScrollTop(function () {
                    Ne.dom.debounce(function(){
                        target.classList.remove('ne-scroll-refreshing');
                        target.previousElementSibling.classList.add('hidden');
                        handleLoadingControl(target, false, false);
                        target._inrefresh = false;
                    },target,500);
                });
            } else {
                target._inrefresh = false;
            }
        }
    }

    //define
    Ne.component('scroll', {
        props: {
            init: function () {
                var _this = this;
                if (_this.isinit) {
                    return false;
                }
                _this.isinit=true;
                //loadmore
                if (getOnScrollBottom(this) && !_this.querySelector('.ne-scroll-loadingcontrol')) {
                    _this.appendChild(Ne.dom.render('<div class="ne-scroll-loadingcontrol hidden"><i class="ne-preloader size-xx-large"></i></div>'));
                }
                //refresh
                if (getOnScrollTop(this) && (!_this.previousElementSibling || !_this.previousElementSibling.classList.contains('ne-scroll-refreshcontrol'))) {
                    _this.parentElement.insertBefore(Ne.dom.render('<div class="ne-scroll-refreshcontrol hidden"><i class="ne-preloader size-xx-large"></i></div>'), _this);
                }
                _this.addEventListener('scroll', _ev_scroll);
                Ne.touch.on(_this, 'dragstart', _ev_onDragStart);
                Ne.touch.on(_this, 'drag', _ev_onDrag);
                Ne.touch.on(_this, 'dragend', _ev_onDragEnd);
            },
            reset: function () {
                this._noMoreState = false;
            }
        }
    });
})(Ne);
/****************************************************************** 
 * @searchbar
 *******************************************************************/

(function (Ne) {
    //define
    Ne.component('searchbar', {
        props: {
            intype: function () {
                this.classList.add('typeing');
                var el_input = this.querySelector('input');
                el_input.focus();
            },
            outtype: function () {
                this.classList.remove('typeing');
                var el_input = this.querySelector('input');
                el_input.blur();
            }
        }
    });
})(Ne);

/****************************************************************** 
 * @select
*******************************************************************/

(function (Ne) {
    //define
    Ne.component('select', {
        props: {
            oninput: function (event) {
                  
            },
            show:function(){
                
            }
        }
    });
 
})(Ne);
/****************************************************************** 
 * @tab
 *******************************************************************/

(function (Ne) {
    function __toggleTab(el_tab) {
        //fn 
        var el_tablist = Ne.dom(el_tab).parents('[ne-role="tablist"]')[0],
            fn_scrollTabList = function (el_tablist, _start, x) {
                var _timeline = new Ne.motion.timeline({
                    duration: 300,
                    origin: [0],
                    transition: [x],
                    timingFunction: 'Quart-easeOut',
                    keyframeFunction: function (x) {
                        el_tablist.scrollLeft = _start + x;
                    }
                });
                _timeline.run();
            };

        //exec tab toggle
        Ne._.toArray(el_tablist.querySelectorAll('[ne-role="tab"]')).forEach(function (item, index) {
            var istargetTab = item == el_tab;
            item.classList[istargetTab ? 'add' : 'remove']('active');
            if (istargetTab) {
                var _transition = item.offsetLeft - item.offsetParent.scrollLeft;
                if (_transition < 0) {
                    fn_scrollTabList(el_tablist, el_tablist.scrollLeft, _transition);
                } else {
                    _transition = _transition + item.offsetWidth - item.offsetParent.offsetWidth;
                    _transition > 0 && fn_scrollTabList(el_tablist, el_tablist.scrollLeft, _transition);
                }
            }
        });
    }

    function __toggleTabPanel(tabpanel_in, animate_type) {
        //exec tab-pane toggle 
        var is_reverse = null,
            tabpanel_out = null;
        Ne._.toArray(tabpanel_in.parentElement.children).forEach(function (tabpanel, index) {
            if (tabpanel.getAttribute('ne-role') == 'tabpanel') {
                if (tabpanel.classList.contains('active')) {
                    tabpanel_out = tabpanel;
                }
                if (tabpanel == tabpanel_in) {
                    is_reverse = is_reverse || 'true';
                }
                if (tabpanel == tabpanel_out) {
                    is_reverse = is_reverse || 'false';
                }
            }
        });

        if (tabpanel_in != tabpanel_out) {
            Ne.dom.toggleView(tabpanel_in, tabpanel_out, (is_reverse == 'true' ? true : false), animate_type);
        }

        //exec tab toggle  
        Ne._.toArray(document.querySelectorAll('[ne-role="tab"]')).forEach(function (tab, index) {
            if (tab.getAttribute('ne-tap') == 'toggle:#' + tabpanel_in.id) {
                __toggleTab(tab);
            }
        });

    }

    //define
    Ne.component('tab', {
        props: {
            toggle: function () {
                __toggleTab(this);
            }
        }
    });

    Ne.component('tabpanel', {
        props: {
            toggle: function (animate_type) {
                var _target = this;
                animate_type = (Ne._.isString(animate_type) ? animate_type : null) || _target.getAttribute('ne-animate') || 'fade';
                __toggleTabPanel(_target, animate_type);
            },
            onswipe: function (event) {
                var _target = this;

                if (event.direction == 'left') {
                    if (_target.nextElementSibling && _target.nextElementSibling.getAttribute('ne-role') == 'tabpanel') {
                        __toggleTabPanel(_target.nextElementSibling, 'slide');
                    }
                } else if (event.direction == 'right') {
                    if (_target.previousElementSibling && _target.previousElementSibling.getAttribute('ne-role') == 'tabpanel') {
                        __toggleTabPanel(_target.previousElementSibling, 'slide');
                    }
                }
            }
        }
    });
})(Ne);

/****************************************************************** 
 * @textarea
*******************************************************************/

(function (Ne) {
    //define
    Ne.component('textarea', {
        props: {
            oninput: function () {
                var _this = this;
                if (_this.getAttribute('maxlength')) {
                    var el_count = _this.parentElement.querySelector('.ne-textarea-count');
                    if (el_count) {
                        var value = _this.tagName.toLowerCase() == 'textarea' ? _this.value : _this.innerText;
                        var maxlength = Number(_this.getAttribute('maxlength')),
                            currlength = value.length > maxlength ? maxlength : value.length;
                        el_count.innerText = currlength + '/' + maxlength;
                        if (value.length >= maxlength + 1) {
                            value = value.substring(0, value.length - 1);
                            if (_this.tagName.toLowerCase() == 'textarea') {
                                _this.value = value;
                            } else {
                                _this.innerText = value;
                            }
                        }
                    }
                }
            }
        }
    });
})(Ne);

/****************************************************************** 
 * @toast 
 *******************************************************************/

(function (Ne) {
    //define
    Ne.component('toast', {
        props: {
            show: function () {
                Ne.dom.animateShow(this);
            },
            hide: function () {
                Ne.dom.animateHide(this);
            }
        }
    });
})(Ne);


(function (root, factory) {
    root.toast = factory();
}(Ne, function () {

    function _create_toast(data, timeout, callback) {
        var el = Ne.render('<div class="ne-toast ne-toast-{type}" ne-role="toast">' +
            '<div class="ne-mask transparent"></div>' +
            '<div class="ne-toast-container">' +
            '<div class="ne-toast-msg">' +
            '<div class="ne-toast-icon">' +
            '<i class="{icon}"></i>' +
            '</div>' +
            '<div class="ne-toast-text {(text && text!=\'\'?\'\':\'none\')}">{text}</div>' +
            '</div>' +
            '</div>' +
            '</div>', data, document.body);
        var com_toast = Ne.acts(el);

        timeout = timeout || 2000;
        if (typeof timeout === 'function') {
            callback = arguments[1];
            timeout = 2000;
        }
        timeout > 0 && setTimeout(function () {
            com_toast.hide();
            callback && callback();
        }, timeout);
        return com_toast;
    }

    return {
        showLoading: function (text, timeout, callback) {
            var com_toast = _create_toast({
                type: 'loading',
                text: text || '',
                icon:'ne-preloader white size-double'
            }, timeout || -1, callback);
            com_toast.show();
            return com_toast;
        },
        showSuccess: function (text, timeout, callback) {
            var com_toast = _create_toast({
                type: 'success',
                text: text || 'success',
                icon: 'ne-icon-success size-double'
            }, timeout, callback);
            com_toast.show();
            return com_toast;
        },
        showError: function (text, timeout, callback) {
            var com_toast = _create_toast({
                type: 'error',
                text: text || 'error',
                icon: ''
            }, timeout, callback);
            com_toast.show();
            return com_toast;
        },
        hide: function () {
            Ne._.toArray(document.querySelectorAll('[ne-role="toast"]')).forEach(function (item, index) {
                if (item.classList.contains('ne-animate-show')) {
                    Ne.acts(item).hide();
                    Ne.dom.debounce(function () {
                        item.parentElement.removeChild(item);
                    }, item.parentElement, 350);
                }
            });
        }
    };
}));