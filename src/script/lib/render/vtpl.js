var parser = require('./parser'),
    compiler = require('./compiler'),
    vTemplate=require('./virtual-template');

function vtpl(tpl){
    var AST = parser(tpl);
    var _render = compiler(AST);
    return vTemplate(_render);
}

//exports
module.exports=vtpl;