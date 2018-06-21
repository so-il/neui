
/****************************************************************** 
 * @actionsheet
*******************************************************************/

(function (Ne) {
    //define
    Ne.component('actionsheet', {
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