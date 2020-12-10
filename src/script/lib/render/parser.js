
//parser:Tpl=>AST

var _ = require('./util');

function isSelfClosingTAG(tag) {
    var selfClosingTAGs = ['br', 'hr', 'img', 'input', 'link', 'meta', 'base', 'param', 'area', 'col',
        'command', 'embed', 'keygen', 'source', 'track', 'wbr'
    ];
    var flag=selfClosingTAGs.indexOf(tag) >= 0;
    return flag;
}

function parseJST(line) {
    var node = {
        type: 'js',
        tag: '',
        metas: {},
        children: []
    };
    var reg = /([^="\s\/]+)\s?(.+)?/g;
    var reg_each = /(.+)\sas\s(.+)\s(.+)$/g;
    var reg_if = /([^="\s\/]+)\s?(.+)?/g;
    var match = reg.exec(line);
    if (match && ['each', 'if', 'else'].indexOf(match[1]) != -1) {
        node.tag = match[1];
        switch (node.tag) {
            case 'if':
                node.metas.expression = match[2];
                break;
            case 'each':
                match = reg_each.exec(match[2]);
                node.metas.collection = match[1];
                node.metas.item = match[2];
                node.metas.index = match[3];
                break;
            case 'else':
                if (match[2] && match[2].length > 0) {
                    match = reg_if.exec(match[2]);
                    node.metas.expression = match[2];
                }
                break;
        }
    } else {
        node.tag = 'expression';
        node.metas = line;
    }
    return node;
}

function parseTAG(line) {
    var node = {
        type: 'element',
        tag: '',
        attrs: [],
        children: []
    };
    var firstBlankIndex = line.indexOf(' ');
    if (firstBlankIndex != -1) {
        node.tag = line.slice(0, firstBlankIndex).trim();
        line = line.slice(firstBlankIndex).trim();
        node.attrs = parseAttributes(line);
    } else {
        node.tag = line;
    }
    return node;
}

function parseAttrValue(text) {
    var reg_jst = /{([^}]+)}/g;
    var cursor_jst = 0;
    var match_jst;
    var res;
    while (match_jst = reg_jst.exec(text)) {
        var t = text.slice(cursor_jst, match_jst.index);
        var line_jst = match_jst[1];
        var node = parseJST(line_jst);
        var metas = node.metas;
        if (!res) {
            res = node;
            res.metas = '';
        }
        res.metas += res.metas.length > 0 ? '+' : '';
        res.metas += t.length > 0 ? "'" + t + "'" : '';
        res.metas += res.metas.length > 0 ? '+' : '';
        res.metas += metas;
        cursor_jst = match_jst.index + match_jst[0].length;
    }
    text = text.slice(cursor_jst);
    if (text.length > 0) {
        if (!res) {
            res = text;
        } else {
            res.metas += "+'" + text + "'";
        }
    }
    return res;
}

function parseAttributes(line) {
    var attrs = [];
    var reg = /([^="\s\/]+)((="([^"]+)")|(='([^']+)'))?/g;
    var match;
    while (match = reg.exec(line)) {
        var value = match[4] || match[6] || match[1];
        value = parseAttrValue(value);
        var attr = {
            type: 'attribute',
            name: match[1],
            value: value
        };
        attrs.push(attr);
    }
    return attrs;
}

function parseTpl(tpl) {
    var AST = [];
    var stack = [];
    stack.push(AST);

    var reg_tag = /<([^>]+)>/g;
    var cursor = 0;
    var match_tag = null;
    //parseTAG
    while (match_tag = reg_tag.exec(tpl)) {
        //parseJST
        var text = tpl.slice(cursor, match_tag.index).trim();
        if (text.length > 0) {
            var reg_jst = /{([^}]+)}/g;
            var cursor_jst = 0;
            var match_jst;
            while (match_jst = reg_jst.exec(text)) {
                var t = text.slice(cursor_jst, match_jst.index).trim();
                if (t.length > 0) {
                    var root = stack[stack.length - 1].children || stack[stack.length - 1];
                    root.push(t);
                }
                var line_jst = match_jst[1];
                if (line_jst.slice(0, 1) != "/") {
                    var node = parseJST(line_jst);
                    if (node.tag == 'else') {
                        var root = stack[stack.length - 1];
                        root.alternate = root.alternate || [];
                        root.alternate.push(node);
                    } else {
                        var root = stack[stack.length - 1].children || stack[stack.length - 1];
                        root.push(node);
                    }
                    if (node.tag != 'expression') {
                        stack.push(node);
                    }
                } else {
                    var root = stack.pop();
                    if (line_jst.slice(1) == 'if') {
                        while (root.tag != 'if') {
                            root = stack.pop();
                        }
                    }
                }
                cursor_jst = match_jst.index + match_jst[0].length;
            }
            text = text.slice(cursor_jst);
            if (text.length > 0) {
                var root = stack[stack.length - 1].children || stack[stack.length - 1];
                root.push(text);
            }
        }
        //
        var root = stack[stack.length - 1].children || stack[stack.length - 1];
        var line_tag = match_tag[1];
        if (line_tag.slice(0, 1) != "/") {
            var node = parseTAG(line_tag);
            root.push(node);
            if (!isSelfClosingTAG(node.tag)) {
                stack.push(node);
            }
        } else {
            stack.pop();
        }
        cursor = match_tag.index + match_tag[0].length;
    }
    return AST;
}

function parser(tpl) {
    var AST = parseTpl(tpl);
    AST = AST.length == 1 ? AST[0] : AST;
    return AST;
}

//exports
module.exports = parser;