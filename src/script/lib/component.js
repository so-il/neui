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