/****************************************************************** 
 * @range
 *******************************************************************/

(function (Ne) {
    //fn 
    function createVirtualRange(target) {
        var __min = target.getAttribute('min') || 0,
            __max = target.getAttribute('max') || 100,
            __value = target.getAttribute('value') || 0;

        var el_range = Ne.dom.render('<div class="ne-range">' +
                '<div class="ne-range-track"><span></span></div>' +
                '<div class="ne-range-thumb">' +
                '<div class="ne-range-tips"><span></span></div>' +
                '</div>' +
                '</div>'),
            el_range_track = el_range.querySelector('.ne-range-track'),
            el_range_thumb = el_range.querySelector('.ne-range-thumb'),
            el_range_tips = el_range_thumb.querySelector('.ne-range-tips');
        target.parentElement.appendChild(el_range);
        var __maxWidth = el_range_track.offsetWidth;
        var __thumbLeft = __value * __maxWidth / __max;
        el_range_thumb.__left = __thumbLeft - 20;
        el_range_track.querySelector('span').style.width = __thumbLeft + 'px';
        el_range_tips.querySelector('span').innerText = __value;
        Ne.motion.move({
            el: el_range_thumb,
            x: __thumbLeft,
            y: 0,
            duration: 0
        });

        Ne.touch.on(el_range_thumb, 'dragstart', function (event) {
            el_range_thumb.classList.add('ondrag');
        });
        Ne.touch.on(el_range_thumb, 'drag', function (event) {
            var _distanceX = el_range_thumb.__left + event.distanceX;
            _distanceX = _distanceX > 0 ? (_distanceX > __maxWidth ? __maxWidth : _distanceX) : 0;
            var __tovalue = Math.ceil(_distanceX * __max / __maxWidth);
            Ne.motion.move({
                el: el_range_thumb,
                x: _distanceX,
                y: 0,
                duration: 0
            });
            el_range_tips.querySelector('span').innerText = __tovalue;
            target.value = __tovalue;
            el_range_thumb._distanceX = _distanceX;
            el_range_track.querySelector('span').style.width = _distanceX + 'px';
        });
        Ne.touch.on(el_range_thumb, 'dragend', function (event) {
            el_range_thumb.classList.remove('ondrag');
            el_range_thumb.__left = el_range_thumb._distanceX;
            el_range_thumb._distanceX = 0;
        });
    }

    function showTip(target) {
        var el_tips = target.previousElementSibling;
        if (!el_tips || el_tips.classList == undefined || !el_tips.classList.contains('ne-range-tips')) {
            el_tips = Ne.dom.render('<div class="ne-range-tips"><span></span></div>');
            Ne.dom(el_tips).insertBefore(target);
        }
        el_tips.querySelector('span').innerText = target.value;
        var curval = target.value;
        var maxval = target.getAttribute('max') || 100;
        var move_x = curval * target.offsetWidth / maxval;
        if (curval > maxval / 2) {
            var move_x_offset = Ne.motion.timingFunction.Linear(curval - maxval / 2, 0, 1, maxval / 2) * 12;
            move_x -= move_x_offset;
        } else if (curval < maxval / 2) {
            var move_x_offset =12 - Ne.motion.timingFunction.Linear(curval, 0, 1, maxval / 2) * 12;;
            move_x += move_x_offset;
        }
        Ne.motion.move({
            el: el_tips,
            x: move_x,
            y: 0,
            duration: 0
        });
        el_tips.classList.add('visible');
        //el_tips._timing && clearTimeout(el_tips._timing);
        //el_tips._timing = setTimeout(function () {
        //el_tips.classList.remove('visible');
        //}, 1000);
    }

    //define
    Ne.component('range', {
        props: {
            oninput: function () {
                showTip(this);
            },
            createVirtualRange: function () {
                createVirtualRange(this);
            }
        }
    });
})(Ne);