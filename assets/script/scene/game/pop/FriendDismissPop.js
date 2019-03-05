// 好友局，解散弹窗

cc.Class({
    extends: cc.Component,

    properties: {
        game : null,

        roomId : null,
    },

    start () {

    },

    setGame (game) {
        this.game = game;
    },

    // 拒绝
    onBtnRefuse () {
        audioUtils.playClickSoundEffect();
        // this.node.active = false;
        network.send(3009, {room_id: this.roomId, is_accept: 0});
    },

    // 同意
    onBtnAgree () {
        audioUtils.playClickSoundEffect();
        network.send(3009, {room_id: this.roomId, is_accept: 1});
    },

    // 初始化界面
    refresh (data, pos) {
        this.roomId = data.room_id;

        {
            let timer = cc.find("popBg/btn_1/time", this.node).getComponent(cc.Label);
            timer.unscheduleAllCallbacks();
            let time = data.left_sec || 0;
            if (time) {
                timer.string = time;
                timer.schedule(function () {
                    this.string = --time;
                }, 1, time-1);
            }
            else {
                timer.string = "";
            }
        }
        {
            let timer = cc.find("popBg/tip_3", this.node).getComponent(cc.Label);
            timer.unscheduleAllCallbacks();
            let time = data.left_sec || 0;
            if (time) {
                timer.string = "("+time+")";
                timer.schedule(function () {
                    this.string = "("+(--time)+")";
                }, 1, time-1);
            }
            else {
                timer.string = "";
            }
        }

        var arr = data['arr'];
        if (data.is_jiesan === 1) {
            // 解散成功
            this.hide();
            let that = this;
            util.tip({
                node : this.game.node,
                type : 2,
                string : "解散成功",
                leftCallback : null,
                centerCallback : null,
                rightCallback : null,
                isShowLeftBtn : false,
                isShowCenterBtn : true,
                isShowRightBtn : false
            });
        }
        else if (data.is_jiesan === 2) {
            // 解散失败
            this.hide();
            util.tip({
                node : this.game.node,
                type : 2,
                string : "解散失败",
                leftCallback : null,
                centerCallback : null,
                rightCallback : null,
                isShowLeftBtn : false,
                isShowCenterBtn : true,
                isShowRightBtn : false
            });
        }
        else {
            // 未解散
            // 设置发起
            cc.find("popBg/tip_0", this.node).getComponent(cc.Label).string = "[" + decodeURIComponent(data.arr[0].name) + "] 发起投票解散对局！";
            for (let i = 0; i < data.arr.length; i++) {
                let playerData = data.arr[i];
                
                // 设置头像，状态
                let index = pos ? pos[playerData.uid] : i;
                let head = cc.find("popBg/head_"+index, this.node);
                head.getChildByName("frame").active = false;
                util.loadSprite("hall/bag/prop/"+playerData.headFrame, head.getChildByName("frame"), function (node) {
                    node.active = true;
                });
                head.getChildByName("head").active = false;
                sdk.getPlayerHead(playerData.headImage, head.getChildByName("head"), function (node) {
                    node.active = true;
                });
                if (playerData.is_accept === -1) {
                    // 未选择
                    head.getChildByName("agree").active = false;
                    head.getChildByName("selecting").active = true;
                    if (playerData.uid === gameData.uid) {
                        // 玩家自己
                        cc.find("popBg/btn_0", this.node).active = true;
                        cc.find("popBg/btn_1", this.node).active = true;
                        cc.find("popBg/tip_2", this.node).getComponent(cc.Label).string = "";
                        cc.find("popBg/tip_3", this.node).active = false;
                    }
                }
                else if (playerData.is_accept === 0) {
                    // 拒绝
                    util.loadSprite("game/exit/disagree", head.getChildByName("agree"));
                    head.getChildByName("agree").active = true;
                    head.getChildByName("selecting").active = false;
                    if (playerData.uid === gameData.uid) {
                        // 玩家自己
                        cc.find("popBg/btn_0", this.node).active = false;
                        cc.find("popBg/btn_1", this.node).active = false;
                        cc.find("popBg/tip_2", this.node).getComponent(cc.Label).string = "您已拒绝";
                        cc.find("popBg/tip_3", this.node).active = false;
                    }
                }
                else if (playerData.is_accept === 1) {
                    // 同意
                    util.loadSprite("game/exit/agree", head.getChildByName("agree"));
                    head.getChildByName("agree").active = true;
                    head.getChildByName("selecting").active = false;
                    if (playerData.uid === gameData.uid) {
                        // 玩家自己
                        cc.find("popBg/btn_0", this.node).active = false;
                        cc.find("popBg/btn_1", this.node).active = false;
                        cc.find("popBg/tip_2", this.node).getComponent(cc.Label).string = "您已同意，等待其他玩家投票";
                        cc.find("popBg/tip_3", this.node).active = true;
                    }
                }
            }
            this.show();
        }
    },

    // 吞噬
    onBtnSwallow () {

    },

    show () {
        if (!this.node.active) {
            let popBg = this.node.getChildByName("popBg");
            popBg.scaleX = 0;
            popBg.scaleY = 0;
            this.node.active = true;
            popBg.stopAllActions();
            popBg.runAction(
                cc.sequence(
                    cc.scaleTo(0.2, 1.2),
                    cc.scaleTo(0.05, 1),
                )
            );
        }
    },
    hide () {
        if (this.node.active) {
            this.node.active = false;
        }
    },
});
