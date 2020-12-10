
//compiler:AST=>Render

var _ = require('./util');

function compileAttrs(attrs, container) {
    var code = '';
    code += 'var ' + container + '=[];';
    attrs.forEach(function (attr, i) {
        var name = attr.name;
        var value = '';
        if (attr.value.tag == 'expression') {
            value = attr.value.metas;
        } else {
            value = '"' + attr.value + '"';
        }
        code += container + '.push({name:"' + name + '",value:' + value + '});';
    });
    return code;
}

function compileNode(node, container, index) {
    var code = '';
    var attrsContainer = container + '_' + index + '_attrs';
    var childrenContainer = container + '_' + index + '_children';
    code += compileAttrs(node.attrs, attrsContainer);
    code += compileNodes(node.children, childrenContainer, true);
    code += container + '.push({tag:"' + node.tag + '",attrs:' + attrsContainer + ',children:' +
        childrenContainer +
        '});';
    return code;
}

function compileNodes(nodes, container, flag) {
    var code = '';
    if (flag) {
        code += 'var ' + container + ' = [];';
    }
    nodes.forEach(function (node, i) {
        if (node.type == 'js') {
            if (node.tag == 'each') {
                code += ' for (var ' + node.metas.index + ' in ' + node.metas.collection + ') {'
                code += 'var ' + node.metas.item + '=' + node.metas.collection + '[' + node.metas.index + '];';
                code += compileNodes(node.children, container);
                code += '};';
            } else if (node.tag == 'if' || (node.tag == 'else' && node.metas.expression)) {
                code += 'if (' + node.metas.expression + ') {';
                code += compileNodes(node.children, container);
                code += '}';
                if (node.alternate) {
                    code += 'else{';
                    code += compileNodes(node.alternate, container);
                    code += '}';
                }
            } else if (node.tag == 'else') {
                code += compileNodes(node.children, container);
            } else {
                code += container + '.push(' + node.metas + ');';
            }
        } else if (node.type == 'element') {
            code += compileNode(node, container, i);
        } else {
            code += container + '.push("' + node + '");';
        }
    });
    return code;
}

function compiler(AST) {
    AST = _.isArray(AST) ? AST : [AST];
    var code = '';
    code += compileNodes(AST, 'ns');
    code = 'var ns=[];with(__data){' + code + '}return ns;';
    code = new Function('__data', code);
    return code;
}

//exports
module.exports = compiler;