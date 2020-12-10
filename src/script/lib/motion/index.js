
/****************************************************************** 
 * @motion
 * Description:动效辅助
 *******************************************************************/
var timingFunction=require('./timing-function');
var timeline = require('./timeline');
var transform=require('./transform');

module.exports=transform;
module.exports.timingFunction=timingFunction;
module.exports.timeline=timeline;