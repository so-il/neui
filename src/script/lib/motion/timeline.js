
var __TIMING_FUNCTION=require('./timing-function');

function timingFunction(name) {
    name = name.split('-');
    if (name.length == 2) {
        return __TIMING_FUNCTION[name[0]][name[1]];
    } else {
        return __TIMING_FUNCTION[name[0]];
    }
}

function Timeline(option) {
    //向量起点
    this.origin = option.origin;
    //向量终点
    this.transition = option.transition;
    //规定动画完成一个周期所花费的秒或毫秒。默认是 1000。
    this.duration = option.duration || 1000;
    //规定动画何时开始。默认是 0。
    this.delay = option.delay || 0;
    //规定动画被播放的次数。默认是 1。
    this.iterationCount = option.iterationCount || 1;
    //规定动画是否在下一周期逆向地播放。默认是 "normal"。
    this.direction = 'normal';
    //规定动画的速度曲线。默认是 "Linear"。
    this.timingFunction = timingFunction(option.timingFunction ? option.timingFunction : 'Linear');
    //关键帧数(默认每秒24帧)
    this.keyframesLength = option.keyframesLength || Math.ceil(this.duration / 40);
    //关键帧时长
    this.keyframeSpan = Math.ceil(this.duration / this.keyframesLength);
    //关键帧回调
    this.keyframeFunction = option.keyframeFunction;
    //结束回调
    this.complete = option.complete;
}

Timeline.prototype.run = function (keyframeIndex) {
    var _this = this,
        transitionRes = [];
    keyframeIndex = keyframeIndex || 0;
    if (keyframeIndex >= _this.keyframesLength) {
        transitionRes = _this.transition;
    } else {
        _this.transition.forEach(function (item, index) {
            var _res = _this.timingFunction(keyframeIndex, 0, item - _this.origin[index], _this.keyframesLength);
            _res += _this.origin[index];
            transitionRes.push(Math.ceil(_res));
        });
    }
    transitionRes.push(keyframeIndex);
    _this.keyframeFunction.apply(_this, transitionRes);
    if (keyframeIndex < _this.keyframesLength) {
        keyframeIndex++;
        _this.timing = setTimeout(function () {
            _this.run.apply(_this, [keyframeIndex]);
        }, _this.keyframeSpan);
    } else {
        _this.complete && _this.complete();
    }
}

Timeline.prototype.stop = function () {
    clearTimeout(this.timing);
}

//exports
module.exports = Timeline;