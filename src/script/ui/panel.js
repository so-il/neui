
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