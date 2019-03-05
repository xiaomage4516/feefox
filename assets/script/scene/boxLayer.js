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
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        buyLayer:cc.Node,
        // openLayer:cc.Node,
        btnBuy:cc.Node,
        centerNode:cc.Node,

        headImg: {
            default: null,
            type: cc.Sprite
        },
        headImgFrame: {
            default: null,
            type: cc.Sprite
        },

        guangAnim:cc.Animation,
        guangAnim2:cc.Animation,

        anim:cc.Animation,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.buyLayer.active = true;
        // this.openLayer.active = false;

        //
        if(gameData.canvasWidth/gameData.canvasHeight<1.5){//按照平板4:3来处理
            this.centerNode.scale = 0.8;
        }else if(gameData.canvasWidth/gameData.canvasHeight<1.64){
            this.centerNode.scale = 0.85;
        } 
        //

        // this.guangAnim2.stop("box_guang2");
        // this.guangAnim2.play("box_guang2");

        //
        sdk.getPlayerHead(gameData.headimgurl, this.headImg.node);

        if (gameData.playHeadFrame) {
            util.loadSprite("hall/bag/prop/"+gameData.playHeadFrame, this.headImgFrame.node);
        }
        //
        this.playBoxAnim();
    },
    playBoxAnim:function(){
        this.anim.stop("boxAnim");
        this.anim.play("boxAnim");
    },
    onBtnOpen:function(){
        audioUtils.playClickSoundEffect();
        this.buyLayer.active = true;
        // this.openLayer.active = false;
        this.guangAnim.stop("box_guang");
        this.guangAnim.play("box_guang");
    },
    onBtnClose:function(){
        audioUtils.playCloseSoundEffect();
        // if (this.buyLayer.active) {
            this.buyLayer.active = false;
            // this.openLayer.active = false;
            // return;
        // }

        this.guangAnim.stop("box_guang");
        // this.guangAnim2.stop("box_guang2");
        // this.node.removeFromParent(false);
        this.node.destroy();
    },
    onBtnBuy:function(){//
        audioUtils.playClickSoundEffect();
        util.log("buy");
        var self = this;
        util.loadPrefab("gongxihuode",function(data){
            

        // var arr_reward = "2-1001/150000";//
        // gongxihuode_node.getComponent("gongxihuode").setRewardData(arr_reward);
        // gameData.gameBean += 150000;
            // gameData.firstRecharge = 1;//调用接口 告诉服务器 买成功
        // self.node.parent.emit('setPlayerInfo');
        // self.btnBuy.active = false;


            

            //幸运宝箱商品ID 还没有 先设置成 5 （10000  金豆）
            //幸运宝箱ID已经配置为17  modify by wuHaiTao 
            sdk.payPurchase(17, 1, function (openId, openKey) {
                util.getBuyBoxStatus({
                    openId : openId,
                    openKey : openKey,
                    callBack : function(respJsonInfo){
                        if(respJsonInfo["code"] == "0"){
                            util.log("BuyBox成功 +=== "+ respJsonInfo['msg']);
                            var msg = JSON.parse(respJsonInfo['msg']);
                            
                            if(msg["playerMoney"]["happyBeans"] == gameData.gameBean){//没有到账

                            }else if(msg["playerMoney"]["happyBeans"] > gameData.gameBean){//到账
                                gameData.firstRecharge = msg["playerDynamicInfo"]["firstRecharge"];
                                gameData.gameBean = msg["playerMoney"]["happyBeans"];
                                if(gameData.hallNode){
                                    gameData.hallNode.emit('setPlayerInfo');
                                    var gongxihuode_node = cc.instantiate(data);
                                    gameData.hallNode.addChild(gongxihuode_node);
                                    var arr_reward = "1000_1001_150000";
                                    gongxihuode_node.getComponent("gongxihuode").setRewardData(arr_reward);
                                }
                                self.guangAnim.stop("box_guang");
                                self.node.destroy();
                                // self.btnBuy.active = false;
                            }
                            
                            // gameData.firstRecharge = msg["playerDynamicInfo"]["firstRecharge"];
                            // self.node.parent.emit('setPlayerInfo');
                            // self.btnBuy.active = false;
                        }else if(respJsonInfo["code"] == "0"){
                            util.log("getBuyBoxStatus === 0 ");
                        }else{
                            util.log("getBuyBoxStatus ===  "+respJsonInfo["code"]);
                        }
                    },
                });
            });
            
            
        });
    },
    start () {

    },

    // update (dt) {},
});
