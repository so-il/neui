
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