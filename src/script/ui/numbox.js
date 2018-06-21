
/****************************************************************** 
 * @numbox
*******************************************************************/

(function (Ne) {
    //fn
    function setValue(target,handleType) {
        var el_input = target.querySelector('input'),
                    el_btn_minus = el_input.previousElementSibling,
                    el_btn_plus = el_input.nextElementSibling;
        var _val = Number(el_input.value),
            _val_step = Number(el_input.getAttribute('step')); 
        _val = handleType == 'minus' ? _val - _val_step : _val + _val_step;

        var _val_min = el_input.getAttribute('min'),
         _val_max = el_input.getAttribute('max');
        if (_val_min) {
            _val_min = Number(_val_min);
            _val = _val < _val_min ? _val_min : _val;
        }
        if (_val_max) {
            _val_max = Number(_val_max);
            _val = _val > _val_max ? _val_max : _val;
        }
        el_input.value = _val;
    }

    //define
    Ne.component('numbox', {
        props: {
            minus: function () {
                setValue(this, 'minus'); 
            },
            plus: function () {
                setValue(this, 'plus');
            }
        }
    });
})(Ne);