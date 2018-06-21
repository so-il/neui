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