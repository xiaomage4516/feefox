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
        
        beiban_xia:cc.Node,
        leftBtn:cc.Node,
        centerBtn:cc.Node,
        rightBtn:cc.Node,
        closeBtn:cc.Node,
        image:cc.Node,
        biaotou:cc.Node,
        
        _leftCallback:null,
        _centerCallback:null,
        _rightCallback:null,

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {},
    setTip:function(type,str,leftCallback,centerCallback,rightCallback,isShowLeftBtn,isShowCenterBtn,isShowRightBtn){
        // util.log("type11 == "+type);
        if(type == 1){//敬请期待
            this.beiban_xia.active = false;
            this.biaotou.active = false;
            cc.find("label",this.node).active = false;
            this.image.active = true;
        }else if(type == 2){
            if(isShowLeftBtn || isShowCenterBtn || isShowRightBtn){
                this.beiban_xia.active = true;
            }
            this.leftBtn.active = isShowLeftBtn;
            this.centerBtn.active = isShowCenterBtn;
            this.rightBtn.active = isShowRightBtn;
            this.biaotou.active = false;
            this.closeBtn.active = false;

            cc.find("label",this.node).active = true;
            cc.find("label",this.node).getComponent(cc.Label).string = str;
            this.image.active = false;
            if(leftCallback){
                this._leftCallback = leftCallback;
            }
            if(centerCallback){
                this._centerCallback = centerCallback;
            }
            if(rightCallback){
                this._rightCallback = rightCallback;
            }
            
        }
    },
    onBtnLeft:function(){
        audioUtils.playClickSoundEffect();
        util.log("left");
        if(this._leftCallback){
            this._leftCallback();
        }
        this.node.destroy();
    },
    onBtnCenter:function(){
        audioUtils.playClickSoundEffect();
        util.log("left1");
        if(this._centerCallback){
            this._centerCallback();
        }
        this.node.destroy();
    },
    onBtnRight:function(){
        audioUtils.playClickSoundEffect();
        util.log("left2");
        if(this._rightCallback){
            this._rightCallback();
        }
        this.node.destroy();
    },
    onBtnClose:function(){
        audioUtils.playClickSoundEffect();
        this.node.destroy();
    },
    start () {

    },

    // update (dt) {},
});
