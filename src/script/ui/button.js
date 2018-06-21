
/****************************************************************** 
 * @button
*******************************************************************/

(function (Ne) {
    //define
    Ne.component('button', {
        props: {
            active: function () {
                this.classList.add('active');
            },
            quiet:function(){
                this.classList.remove('active');
            },
            disabled: function () {
                this.classList.add('disabled');
            },
            enable: function () {
                this.classList.remove('disabled');
            },
            showloading: function () {
                this.classList.add('ne-btn-loading');
            },
            hideloading: function () {
                this.classList.remove('ne-btn-loading');
            }
        }
    });
})(Ne);