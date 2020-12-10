window.Ne = window.Ne || {};
var Ne=window.Ne;
Ne.touch=require('./lib/touch');
Ne.render=require('./lib/render/index');
Ne.motion=require('./lib/motion/index');
Ne.dom=require('./lib/dom/index');
Ne._=require('./lib/type');
Ne.component = require('./lib/component');
Ne.acts = Ne.component.acts;

function _triggerAction(target,action,sender,args) {
    var actions = target && Ne.component.acts(target);
    args.sender=sender;
    return actions && actions[action] && actions[action](args);
}

function _queryCmdSender(el,tag) {
    return el.getAttribute(tag)?el:el.parentElement ? _queryCmdSender(el.parentElement,tag):null;
}

function _queryCmdTarget(el, role) {
    return role.substring(0,1)==='#'?document.querySelector(role)
    :el.getAttribute('ne-role') ==role||el.tagName.toLowerCase()==role
    ? el: el.parentElement ? _queryCmdTarget(el.parentElement, role):null;
}

function cmd(cmdline,sender,event){
    var _temp=cmdline.split(':'),
        target=_queryCmdTarget(sender, _temp[1]),
        action=_temp[0];
    return _triggerAction(target,action,sender,event);
}

function initUI(){
    Array.prototype.slice.call(document.querySelectorAll('[ne-role="page"]')).forEach(function (page, index) {
        page.setAttribute('data-url',location.href);
        Ne.component.init(page);
    });
}

function onTap(event) {
    var target=event.target || event.touches[0];
    target = _queryCmdSender(target,'ne-tap');
    if (target) {
        event.preventDefault && event.preventDefault();
        event.stopPropagation && event.stopPropagation();
        cmd(target.getAttribute('ne-tap'),target,event);
    }
}

function onSwipe(event) {
    var target = event.target || event.touches[0];
    target = _queryCmdSender(target,'ne-swipeable');
    if (target) {
        event.preventDefault && event.preventDefault();
        event.stopPropagation && event.stopPropagation();
        _triggerAction(target,'onswipe',target,event);
    }
}

function onInput(event) {
    var target = event.target || event.touches[0];
    if(target){
        _triggerAction(target,'oninput',target,event);
    }
}

//add globe eventlistener   
document.addEventListener('input', onInput);
document.addEventListener('click', onTap);
Ne.touch && Ne.touch.on(document, 'swipe', onSwipe);
Ne.dom(function(){
    //init ui
    initUI();
})
