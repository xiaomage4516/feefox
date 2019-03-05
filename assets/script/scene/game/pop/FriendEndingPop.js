// 好友局，大结算

cc.Class({
    extends: cc.Component,

    properties: {
        game : null,
    },

    start () {

    },

    setGame (game) {
        this.game = game;
    },

    refresh (data) {
        // 排序
        data.players.sort(function (a, b) {
            return b.score - a.score;
        });
        for (var i = 0; i < data.players.length; i++) {
            let playerData = data.players[i];
            let playerItem = cc.find("popBg/item_"+i, this.node);

            if (playerData.uid === gameData.uid) {
                // 自己，背景2
                playerItem.getChildByName("bg_1").active = false;
                playerItem.getChildByName("bg_2").active = true;
            }
            else {
                playerItem.getChildByName("bg_1").active = true;
                playerItem.getChildByName("bg_2").active = false;
            }

            // rank
            if (i === 0) {
                // 第一名用图
                playerItem.getChildByName("rank_sp").active = true;
                playerItem.getChildByName("rank_label").active = false;
            }
            else {
                playerItem.getChildByName("rank_sp").active = false;
                playerItem.getChildByName("rank_label").active = true;
            }

            // head
            playerItem.getChildByName("frame").active = false;
            util.loadSprite("hall/bag/prop/"+playerData.headFrame, playerItem.getChildByName("frame"), function (node) {
                node.active = true;
            });
            playerItem.getChildByName("head").active = false;
            sdk.getPlayerHead(playerData.headImage, playerItem.getChildByName("head"), function (node) {
                node.active = true;
            });

            // name
            playerItem.getChildByName("name").getComponent(cc.Label).string = decodeURIComponent(playerData.nickname);

            // 房主
            if (playerData.uid === data.owner_id) {
                playerItem.getChildByName("owner").x = playerItem.getChildByName("name").x + playerItem.getChildByName("name").width + 200;
                playerItem.getChildByName("owner").active = true;
            }
            else {
                playerItem.getChildByName("owner").active = false;
            }

            // round_num
            playerItem.getChildByName("round_num").getComponent(cc.Label).string = ""+data.cur_round;

            // win_num
            playerItem.getChildByName("win_num").getComponent(cc.Label).string = ""+playerData.winRound;

            // total_num
            if (playerData.score > 0) {
                // 红色
                playerItem.getChildByName("total_num").color = new cc.Color(172, 0, 0, config.maxOpacity);
            }
            else {
                // 蓝色
                playerItem.getChildByName("total_num").color = new cc.Color(0, 125, 172, config.maxOpacity);
            }
            playerItem.getChildByName("total_num").getComponent(cc.Label).string = ""+playerData.score;

            playerItem.active = true;
        }
        for (; i < 4; i++) {
            cc.find("popBg/item_"+i, this.node).active = false;
        }

        this.show();
    },

    // 离开
    onBtnLeave () {
        audioUtils.playClickSoundEffect();
        if (this.game) {
            this.game.backToHall();
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
                    cc.scaleTo(0.05, 1)
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
