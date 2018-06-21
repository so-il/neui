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