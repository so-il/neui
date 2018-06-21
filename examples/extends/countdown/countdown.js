
/****************************************************************** 
 * @countdown
*******************************************************************/
//µ¹¼ÆÊ±²å¼þ
;(function (Ne) { 
    var _DAYS = 24 * 60 * 60,
		_HOURS = 60 * 60,
		_MINUTES = 60;

    Ne.countdown = function (prop) {
        var options = Ne._.extend({
            callback: function () { },
            timestamp: 0
        }, prop);

        var el_clock = options.el, left, d, h, m, s, positions;
          
        ['Days', 'Hours', 'Minutes', 'Seconds'].forEach(function (item, index) {
            el_clock.appendChild(Ne.dom.render(
                '<span class="ne-countdown-' + item + '">\
                    <span class="position">0</span>\
				    <span class="position">0</span>\
                </span>'
                ));
            el_clock.appendChild(Ne.dom.render('<span class="ne-countdown-' + item + '-label"></span>'));
        });

        positions = Array.prototype.slice.call(el_clock.querySelectorAll('.position'));
       
        function tick() {

            // Time left
            left = Math.floor((options.timestamp - (new Date())) / 1000);

            if (left < 0) {
                left = 0;
            }

            // Number of days left
            d = Math.floor(left / _DAYS);
            updateDuo(0, 1, d);
            left -= d * _DAYS;

            // Number of hours left
            h = Math.floor(left / _HOURS);
            updateDuo(2, 3, h);
            left -= h * _HOURS;

            // Number of minutes left
            m = Math.floor(left / _MINUTES);
            updateDuo(4, 5, m);
            left -= m * _MINUTES;

            // Number of seconds left
            s = left;
            updateDuo(6, 7, s);
             
            options.callback(d, h, m, s);
            if (d === 0 && h === 0 && m === 0 && s === 0) {
                options.onEnd()
            } else {
                setTimeout(tick, 1000);
            }
        }
         
        function updateDuo(minor, major, value) { 
            positions[minor].innerText = Math.floor(value / 10) % 10;
            positions[major].innerText = value % 10;
        }

        options.onStart && options.onStart();
        tick();
    } 

})(Ne)