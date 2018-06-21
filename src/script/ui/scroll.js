
/****************************************************************** 
 * @scroll
*******************************************************************/

(function (Ne) {
    function getOnScrollTop(target){
        if(target.onScrollTop){
            return target.onScrollTop;
        }else if(target.getAttribute('onscrolltop')){
            target.onScrollTop=window[target.getAttribute('onscrolltop')];
            return target.onScrollTop;
        }else{
            return null;
        }
    }

    function getOnScrollBottom(target){
        if(target.onScrollBottom){
            return target.onScrollBottom;
        }else if(target.getAttribute('onscrollbottom')){
            target.onScrollBottom=window[target.getAttribute('onscrollbottom')];
            return target.onScrollBottom;
        }else{
            return null;
        }
    }

    
    function handleLoadingControl(target, noMoreState, inloadmore) {
        var el_control = target.querySelector('.ne-scroll-loadingcontrol');
        target._inloadmore = inloadmore;
        el_control.classList[inloadmore?'remove':'add']('hidden');
        if (noMoreState) {
            target._noMoreState = noMoreState;
            el_control.innerHTML = '<span>没有更多了</span>';
            el_control.classList.remove('hidden');
        } else if(!el_control.querySelector('.ne-preloader')){
            el_control.innerHTML = '<i class="ne-preloader size-xx-large"></i>';
        }
    }


    //eventhandler 
    function _ev_scroll(event) {
        var target = event.currentTarget;
        if (!target._inloadmore && !target._noMoreState && (target.scrollTop + target.clientHeight) >= target.scrollHeight - 3) {
            //滑到底部
            var onScrollBottom=getOnScrollBottom(target);
            if (onScrollBottom) {
                handleLoadingControl(target, false, true);
                onScrollBottom(function (noMoreState) {
                    handleLoadingControl(target, noMoreState, false);
                }, event);
            }
        }
    }

    function _ev_onDragStart(event) {
        event.preventDefault();
        event.stopPropagation();
        var target = event.currentTarget;
        if (!target._inrefresh && event.y > 0 && target.scrollTop == 0 && getOnScrollTop(target)) {
            target._inrefresh = true;
            target.previousElementSibling.classList.remove('hidden');
            target.classList.add('ne-scroll-ondrag');
        }
    }

    function _ev_onDrag(event) {
        event.preventDefault();
        event.stopPropagation();
        var target = event.currentTarget;
        if (target._inrefresh) {
            target.style[Ne.dom.transformProperty] = "translate3d(0," + (event.y * .4) + "px,0)";
        }
    }

    function _ev_onDragEnd(event) {
        event.preventDefault();
        event.stopPropagation();
        var target = event.currentTarget;
        if (target._inrefresh) {
            target.classList.remove('ne-scroll-ondrag');
            target.style[Ne.dom.transformProperty] = "";
            if (event.y >= 150) {
                target.classList.add('ne-scroll-refreshing');
                target.onScrollTop(function () {
                    Ne.dom.debounce(function(){
                        target.classList.remove('ne-scroll-refreshing');
                        target.previousElementSibling.classList.add('hidden');
                        handleLoadingControl(target, false, false);
                        target._inrefresh = false;
                    },target,500);
                });
            } else {
                target._inrefresh = false;
            }
        }
    }

    //define
    Ne.component('scroll', {
        props: {
            init: function () {
                var _this = this;
                if (_this.isinit) {
                    return false;
                }
                _this.isinit=true;
                //loadmore
                if (getOnScrollBottom(this) && !_this.querySelector('.ne-scroll-loadingcontrol')) {
                    _this.appendChild(Ne.dom.render('<div class="ne-scroll-loadingcontrol hidden"><i class="ne-preloader size-xx-large"></i></div>'));
                }
                //refresh
                if (getOnScrollTop(this) && (!_this.previousElementSibling || !_this.previousElementSibling.classList.contains('ne-scroll-refreshcontrol'))) {
                    _this.parentElement.insertBefore(Ne.dom.render('<div class="ne-scroll-refreshcontrol hidden"><i class="ne-preloader size-xx-large"></i></div>'), _this);
                }
                _this.addEventListener('scroll', _ev_scroll);
                Ne.touch.on(_this, 'dragstart', _ev_onDragStart);
                Ne.touch.on(_this, 'drag', _ev_onDrag);
                Ne.touch.on(_this, 'dragend', _ev_onDragEnd);
            },
            reset: function () {
                this._noMoreState = false;
            }
        }
    });
})(Ne);