var _ = require('./util');

//Covert
//covert:node => DOM Element
function toElement(node) {
    var el = document.createElement(node.tag);
    node.attrs.forEach(function (attr) {
        if (_.isFunction(attr.value)) {
            el[attr.name] = attr.value;
        } else {
            attr.value && el.setAttribute(attr.name, attr.value);
        }
    });
    node.children.forEach(function (child) {
        if(child){
            if (!child.tag) {
                child = document.createTextNode(child);
            } else {
                child = toElement(child);
            }
            el.appendChild(child);
        }
    });
    return el;
}

//covert:nodelist => DOM Fragment
function toElements(nodelist) {
    var fragment = document.createDocumentFragment();
    nodelist.forEach(function (node) {
        fragment.appendChild(toElement(node));
    });
    return fragment;
}

function toDom(node) {
    node = _.isArray(node) && node.length == 1 ? node[0] : node;
    var dom = _.isArray(node) ? toElements(node) : toElement(node);
    return dom;
}

//exports
module.exports=toDom;