
/****************************************************************** 
 * @page
*******************************************************************/

(function (Ne) {
    //fn 
    function __togglePage(page_in, animate_type) {
        //exec nav-pane toggle 
        var is_reverse = false, page_out = null;

        Ne._.toArray(document.querySelectorAll('[ne-role="page"]')).forEach(function (page, index) {
            if (page.classList.contains('active')) {
                page_out = page;
            }
            if (page == page_in) {
                is_reverse = false;
                return false;
            }
            if (page == page_out) {
                is_reverse = true;
                return false;
            }
        });

        if (page_in != page_out) {
            animate_type = animate_type || page_in.getAttribute('ne-animate') || 'slidecover';
            Ne.dom.toggleView(page_in, page_out, is_reverse, animate_type);
        }
    }
     
    //define
    Ne.component('page', {
        props: {
            toggle: function () {
                __togglePage(this);
            }
        }
    });
})(Ne);