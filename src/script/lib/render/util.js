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