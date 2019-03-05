cc.Class({
    extends: cc.Component,

    properties: {
        tips_content:cc.Label,
        tips_node:cc.Node
    },

    onLoad:function () {

    },
    setTip:function(str){
        this.tips_content.string = str;
    },
    start:function () {
        var callback = function () {
            this.node.destroy();
        };
        var action = cc.sequence(cc.moveBy(0.6,0,60),cc.delayTime(0.6),cc.hide(),cc.callFunc(callback,this));
        this.tips_node.runAction(action);
    },

});
