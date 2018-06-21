
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