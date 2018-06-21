
/****************************************************************** 
 * @list
*******************************************************************/

(function (Ne) {
    //fn
    function _remove(target){
        target.style.height = target.offsetHeight+'px';
        setTimeout(function(){
            target.style.height ='0px';
            target.classList.add('ne-animate-remove');
            Ne.dom.debounce(function(){
                target.parentElement.removeChild(target);
            },target.parentElement,250);
        },50);
    }

    function _hideActions(target){
        target.__temp_keep && Ne.motion.move({
            el:  target.querySelector('.ne-cell'),
            x: 0,
            y: 0,
            duration: 300,
            timingFunction:'Cubic-easeOut',
            callback:function(){
                delete target.__temp_keep;
            }
        });
    }

    function _showActions(target,keep){
        var el_actions = target.querySelector('.ne-listitem-actions'+(keep=='left'?'.keepleft':':not(.keepleft)'));
        el_actions && Ne.motion.move({
            el: target.querySelector('.ne-cell'),
            x: (keep=='left'?1:-1)*el_actions.offsetWidth,
            y: 0,
            duration: 300,
            timingFunction:'Cubic-easeOut',
            callback:function(){
                target.__temp_keep=keep;
            }
        });
    }


    //define
    Ne.component('li', {
        props: {
            onswipe:function (event) {
                if(event.direction=='left'||event.direction=='right'){
                    if(this.__temp_keep){
                       this.__temp_keep==event.direction && _hideActions(this);
                    }else{
                       _showActions(this,event.direction=='left'?'right':'left');
                    }
                } 
            },
            regain:function(){
                _hideActions(this);
            },
            actions:function(direction){
                direction=direction||'right';
                _showActions(this,direction);
            },
            remove:function(){
               _remove(this);
            }
        }
    });

})(Ne);