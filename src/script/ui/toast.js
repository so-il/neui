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