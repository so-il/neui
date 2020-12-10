var parser = require('./parser'),
    compiler = require('./compiler'),
    toDom = require('./todom');

function compile(tpl) {
    var AST = parser(tpl);
    var _render = compiler(AST);
    return function (data) {
        return toDom(_render(data));
    }
}

function render(tpl, data, container) {
    var el = compile(tpl)(data);
    container && container.appendChild(el);
    return el;
}

//exports
module.exports.compile = compile;
module.exports.render=render;