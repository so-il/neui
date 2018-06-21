
/****************************************************************** 
 * @lazyLoading
*******************************************************************/

(function (root, factory) {
    root.scrollLoading = factory();
}(window, function () {
    'use strict';

    var __extend = function (obj) {
        for (var index = 1; index < arguments.length ; index++) {
            var source = arguments[index];
            for (var key in source) {
                obj[key] = source[key];
            }
        }
        return obj;
    }
    var __scrollLoading = function (targets, options) {
        var defaults = {
            attr: "data-url",
            container: document.body,
            callback: function () { }
        };
        var params = __extend({}, defaults, options || {});
        params.cache = [];
        Array.prototype.slice.call(targets).forEach(function (item, index) {
            var node = item.nodeName.toLowerCase(), url = item.getAttribute(params["attr"]);
            //重组
            var data = {
                obj: item,
                tag: node,
                url: url
            };
            params.cache.push(data);
        });

        var callback = function (call) {
            if (typeof params.callback == 'function' || false) {
                params.callback.call(call);
            }

        };
        //动态显示数据
        var loading = function () {
            var contop;
            var contHeight = params.container.scrollHeight;
            if (window) {
                contop = document.body.scrollTop;
            } else {
                contop = params.container.offsetTop;
            }

            params.cache.forEach(function (data, i) {
                var o = data.obj, tag = data.tag, url = data.url, post, posb;

                if (o) {
                    post = o.offsetTop - contop, post + o.clientHeight;

                    if ((post >= 0 && post < contHeight) || (posb > 0 && posb <= contHeight)) {
                        if (url) {
                            //在浏览器窗口内
                            if (tag === "img") {
                                //图片，改变src
                                o.setAttribute("src", url);
                                callback(o);
                            }  
                        } else {
                            // 无地址，直接触发回调
                            callback(o);
                        }
                        data.obj = null;
                    }
                }
            });
        };

        //事件触发
        //加载完毕即执行
        loading();
        //滚动执行
        params.container.addEventListener('scroll', loading);
    };
    var exports = __scrollLoading;

    return exports;
}));

//scrollLoading(document.querySelectorAll('.ne-lazypic'), {
//    container: document.querySelector(".content"),
//    callback: function () {

//    }
//});