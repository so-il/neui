
/****************************************************************** 
 * @textarea
*******************************************************************/

(function (Ne) {
    //define
    Ne.component('textarea', {
        props: {
            oninput: function () {
                var _this = this;
                if (_this.getAttribute('maxlength')) {
                    var el_count = _this.parentElement.querySelector('.ne-textarea-count');
                    if (el_count) {
                        var value = _this.tagName.toLowerCase() == 'textarea' ? _this.value : _this.innerText;
                        var maxlength = Number(_this.getAttribute('maxlength')),
                            currlength = value.length > maxlength ? maxlength : value.length;
                        el_count.innerText = currlength + '/' + maxlength;
                        if (value.length >= maxlength + 1) {
                            value = value.substring(0, value.length - 1);
                            if (_this.tagName.toLowerCase() == 'textarea') {
                                _this.value = value;
                            } else {
                                _this.innerText = value;
                            }
                        }
                    }
                }
            }
        }
    });
})(Ne);
