// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        
        _leftCallback:null,
        _rightCallback:null,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },
    setTip(name,price,headId,rightCallBack){
        util.log("1111111 == "+name);
        util.log("1111111 == "+price);
        util.log("1111111 == "+headId);
        cc.find("name",this.node).getComponent(cc.Label).string = name;
        util.loadSprite("hall/shop/bean/"+headId, cc.find("icon",this.node));
        //需要消耗多少钻石
        cc.find("price",this.node).getComponent(cc.Label).string = price;
        this._rightCallback = rightCallBack;
    },
    onBtnLeft:function(){
        audioUtils.playClickSoundEffect();
        util.log("left");
        if(this._leftCallback){
            this._leftCallback();
        }
        this.node.destroy();
    },
    onBtnRight:function(){
        audioUtils.playClickSoundEffect();
        util.log("right");
        if(this._rightCallback){
            this._rightCallback();
        }
        this.node.destroy();
    },

    // update (dt) {},
});
