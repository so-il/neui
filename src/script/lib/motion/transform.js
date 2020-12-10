
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