
/****************************************************************** 
 * @input
*******************************************************************/

(function (Ne) {
    //fn
    function _clearable(target){
        var el_clearbtn = target.nextElementSibling;
        if (!el_clearbtn || !el_clearbtn.classList.contains('ne-input-icon')) {
            target.parentElement.classList.add('ne-input_withicon_right');
            el_clearbtn = Ne.dom.render('<i class="ne-icon-delete-f grey ne-input-icon"></i>');
            el_clearbtn.onclick = function () {
                target.value = '';
                el_clearbtn.style.display = 'none';
            }
            Ne.dom(el_clearbtn).insertAfter(target);
        } else {
            if (target.value != '') {
                el_clearbtn.style.display = 'block';
            } else {
                el_clearbtn.style.display = 'none';
            }
        }
    }

    //define
    Ne.component('input', {
        props: {
            oninput: function () {
                //clearable
                if (this.getAttribute('ne-clearable')) {
                    _clearable(this);
                }
            }
        }
    });
 
})(Ne);
