
/****************************************************************** 
 * @popover
*******************************************************************/

(function (Ne) {
    //define
    Ne.component('popover', {
        props: {
            show: function (event) {
                var _this = this,
                    el_bubble = _this.querySelector('.ne-bubble'),
                    el_sender = event.sender,
                    alignCls = 'aligncenter',
                    directionCls = 'directionup',
                    screenwidth=window.screen.width,
                    screenheight=window.screen.height,
                    offsetleft = screenwidth / 2,
                    offsettop = screenheight / 2;

                if (el_sender && el_sender.style) {
                    offsetleft = Ne.dom(el_sender).offset().left + el_sender.offsetWidth / 2;
                    offsettop = Ne.dom(el_sender.offsetParent).offset().top + el_sender.offsetTop;
                    if (offsetleft < (screenwidth / 3)) {
                        alignCls = 'alignleft';
                    } else if (offsetleft > (screenwidth * 2 / 3)) {
                        alignCls = 'alignright';
                    }
                    if (offsettop > (screenheight / 2)) {
                        directionCls = 'directionup';
                    } else {
                        directionCls = 'directiondown';
                        offsettop += el_sender.offsetHeight;
                    }
                }

                //设置气泡方向
                ['ne-bubble-alignright', 'ne-bubble-alignleft', 'ne-bubble-aligncenter', 'ne-bubble-directionup', 'ne-bubble-directiondown'].forEach(function (item) {
                    el_bubble.classList.remove(item);
                });
                 
                el_bubble.classList.add('ne-bubble-' + alignCls);
                el_bubble.classList.add('ne-bubble-' + directionCls);

                //设置气泡位置
                _this.style.left = offsetleft + 'px';
                _this.style.top = offsettop + 'px';

                Ne.dom.animateShow(_this);
            },
            hide: function () {
                Ne.dom.animateHide(this);
            }
        }
    });
})(Ne);