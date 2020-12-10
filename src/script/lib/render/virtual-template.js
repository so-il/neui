
var _ = require('./util');
var svd = require('./virtual-dom/virtual-dom');
var toDom = require('./todom');
var diff = svd.diff;
var patch = svd.patch;


function makeTemplateClass (compileFn) {
  function VirtualTemplate (data) {
    this.data = data;
    var domAndVdom = this.makeVirtualDOM();
    this.vdom = domAndVdom.vdom;
    this.dom = domAndVdom.dom;
    this.isDirty = false;
    this.flushCallbacks = [];
  }

  _.extend(VirtualTemplate.prototype, {
    compileFn: compileFn,
    setData: setData,
    makeVirtualDOM: makeVirtualDOM,
    flush: flush
  });

  return VirtualTemplate;
}

function setData(data, isSync) {
  _.extend(this.data, data);
  if (typeof isSync === 'boolean' && isSync) {
    this.flush();
  } else if (!this.isDirty) {
    this.isDirty = true;
    var self = this;
    // cache all data change, and only refresh dom before browser's repainting
    _.nextTick(function () {
      self.flush();
    });
  }
  if (typeof isSync === 'function') {
    var callback = isSync;
    this.flushCallbacks.push(callback);
  }
}

function flush() {
  // run virtual-dom algorithm
  var newVdom = this.makeVirtualDOM().vdom;
  var patches = diff(this.vdom, newVdom);
  patch(this.dom, patches);
  this.vdom = newVdom;
  this.isDirty = false;
  var callbacks = this.flushCallbacks;
  for (var i = 0, len = callbacks.length; i < len; i++) {
    if (callbacks[i]) {
      callbacks[i]();
    }
  }
  this.flushCallbacks = [];
}

function makeVirtualDOM() {
  var node = this.compileFn(this.data);
  if(_.isArray(node)){
    node={
      tag:'div',
      attrs:[],
      children:node
    }
  }
  return {
    dom:toDom(node),
    vdom:toVirtualDOM(node)
  }
}

function toVirtualDOM(node) {
  var tagName = node.tag.toLowerCase();
  var props ={};
  var children = [];
  node.attrs.forEach(function(a,i){
    if(a.value){
      props[a.name]=a.value;
    }
  });
  node.children.forEach(function (c, i) {
    if(c){
      if(c.tag){
        children.push(toVirtualDOM(c));
      }else{
        children.push(c);
      }
    }
  });
  return svd.el(tagName, props, children);
}

module.exports = function (compileFn) {
  return  makeTemplateClass(compileFn);
}