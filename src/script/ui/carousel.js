
/****************************************************************** 
 * @carousel
*******************************************************************/

(function (Ne) {
    //fn
    function _toggleController(carousel,Item_in){
        var el_controller = carousel.querySelector('[ne-role="carouselcontroller"]');
        if (el_controller) {
            var index=0;
            Ne._.toArray(Item_in.parentElement.children).forEach(function (n, i) {
                if (n == Item_in) {
                     index=i;
                     return false;
                }
            });
            Ne._.toArray(el_controller.querySelectorAll('[ne-role="carouselcontrol"]')).forEach(function (n, i) {
                n.classList[i == index ? 'add' : 'remove']('active');
            });
        }
    }

    function _toggleItem(carousel,direction) {
        if(carousel.item_curr){
            return false;
        }
        if(carousel.getAttribute('data-autoplay')=='true'){
            clearTimeout(carousel._timing);
            _autoplay(carousel);
        }
        var item_out= carousel.querySelector('.ne-carousel-item.active');
        var item_in=direction == 'next'?
                    (item_out.nextElementSibling || item_out.parentElement.children[0]):
                    (item_out.previousElementSibling || item_out.parentElement.children[item_out.parentElement.children.length - 1]);
        Ne.dom.toggleView(item_in, item_out, direction != 'next', item_in.getAttribute('ne-animate') || 'slide');
        _toggleController(carousel,item_in);
    }

    function _autoplay(_carousel, _time) {
        _time=_time||_carousel.getAttribute('data-interval')||3000;
        _carousel._timing = setTimeout(function () {
            _toggleItem(_carousel, 'next');
            _autoplay(_carousel, _time);
        }, _time);
    }
    
    function _ev_onDragStart(event) {
        event.preventDefault();
        event.stopPropagation();
        var carousel = event.currentTarget, move_x = event.x;
        carousel.item_curr = carousel.querySelector('.ne-carousel-item.active');
        carousel.item_next = carousel.item_curr.nextElementSibling || carousel.item_curr.parentElement.children[0];
        carousel.item_prev = carousel.item_curr.previousElementSibling || carousel.item_curr.parentElement.children[carousel.item_curr.parentElement.children.length - 1];
        carousel.item_prev.style[Ne.dom.transformProperty] = 'translate3d('+(-carousel.item_prev.offsetWidth)+'px,0,0)';
        carousel.item_next.style[Ne.dom.transformProperty] = 'translate3d('+(carousel.item_prev.offsetWidth)+'px,0,0)';
        carousel.item_prev.classList.add('block');
        carousel.item_next.classList.add('block');
    }

    function _ev_onDrag(event) {
        event.preventDefault();
        event.stopPropagation();
        var carousel = event.currentTarget, move_x = event.x;
        carousel.item_curr.style[Ne.dom.transformProperty] = 'translate3d('+move_x+'px,0,0)';
        carousel.item_prev.style[Ne.dom.transformProperty] = 'translate3d('+(-carousel.item_curr.offsetWidth+move_x)+'px,0,0)';
        carousel.item_next.style[Ne.dom.transformProperty] = 'translate3d('+(carousel.item_curr.offsetWidth+move_x)+'px,0,0)';
    }

    function _ev_onDragEnd(event) {
        event.preventDefault();
        event.stopPropagation();
        var carousel = event.currentTarget, move_x = event.x;
        move_x=carousel.item_curr.style[Ne.dom.transformProperty].match(/translate3d\(+[,px\d\.\-\s]+\)/g)[0].match(/([\-\d\.]+px)/g)[0];
        move_x=parseFloat(move_x.substring(0,move_x.length-2));
        var dir=move_x<0?-1:1;
        var timeline = new Ne.motion.timeline({
            duration: 350,
            origin:[move_x],
            transition: [dir * carousel.item_curr.offsetWidth],
            timingFunction: 'Cubic-easeOut',
            keyframeFunction:function (x) {
                carousel.item_curr.style[Ne.dom.transformProperty] = 'translate3d('+x+'px,0,0)';
                if(dir===-1){
                    carousel.item_next.style[Ne.dom.transformProperty] = 'translate3d('+(carousel.item_curr.offsetWidth+x)+'px,0,0)';
                }else{
                    carousel.item_prev.style[Ne.dom.transformProperty] = 'translate3d('+(-carousel.item_curr.offsetWidth+x)+'px,0,0)';
                }
            },
            complete: function () {
                if(dir===-1){
                    _toggleController(carousel,carousel.item_next);
                    carousel.item_next.classList.add('active');
                }else{
                     _toggleController(carousel,carousel.item_prev);
                     carousel.item_prev.classList.add('active');
                }
                carousel.item_curr.classList.remove('active'); 
                carousel.item_next.classList.remove('block');
                carousel.item_prev.classList.remove('block');
                carousel.item_curr.style[Ne.dom.transformProperty]="";
                carousel.item_next.style[Ne.dom.transformProperty]="";
                carousel.item_prev.style[Ne.dom.transformProperty]="";
                carousel.item_next=null;
                carousel.item_prev=null;
                carousel.item_curr=null;
            }
        });
        timeline.run();
    }

    //define
    Ne.component('carousel', {
        props: {
            init: function () {
                if(this.getAttribute('data-autoplay')=='true'){
                    _autoplay(this);
                }
                Ne.touch.on(this, 'dragstart', _ev_onDragStart);
                Ne.touch.on(this, 'drag', _ev_onDrag);
                Ne.touch.on(this, 'dragend', _ev_onDragEnd);
            },
            onswipe: function (event) {
                _toggleItem(this, event.direction=='left'?'next':'prev');
            },
            prev:function(){
                _toggleItem(this, 'prev');
            },
            next:function(){
                _toggleItem(this, 'next');
            }
        }
    });
})(Ne);