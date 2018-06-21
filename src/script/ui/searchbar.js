/****************************************************************** 
 * @searchbar
 *******************************************************************/

(function (Ne) {
    //define
    Ne.component('searchbar', {
        props: {
            intype: function () {
                this.classList.add('typeing');
                var el_input = this.querySelector('input');
                el_input.focus();
            },
            outtype: function () {
                this.classList.remove('typeing');
                var el_input = this.querySelector('input');
                el_input.blur();
            }
        }
    });
})(Ne);