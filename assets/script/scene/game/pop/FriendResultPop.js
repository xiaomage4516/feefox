// 好友，小结算

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

    onBtnLeave (event, custom) {
        audioUtils.playClickSoundEffect();
        // 显示大结算
        this.game.setFriendEndingPop();
        this.node.stopAllActions();
        this.node.runAction(
            cc.sequence(
                cc.delayTime(10),
                cc.callFunc(function () {
                    if (this.game) {
                        this.game.backToHall();
                    }
                }, this)
            )
        );
    },

    onBtnNext (event, custom) {
        audioUtils.playClickSoundEffect();
        // 好友，下一局，隐藏弹窗
        if (this.game) {
            this.game.initGame();
            this.game.sendPlayerReady(true);
        }
    },

    onBtnBack (event, custom) {
        audioUtils.playClickSoundEffect();
        // 好友，下一局，隐藏弹窗
        if (this.game) {
            this.game.setFriendResultPop();
            cc.find("button/center/ready", this.game.node).active = true;
        }
    },

    refresh (data) {
        let myHuData = null;
        // 设置玩家信息
        for (let i = 0; i < data.players.length; i++) {
            let playerData = data.players[i];
            let index = this.game.pos[playerData.uid];
            // 更新分数
            this.game.players[index].info.score = playerData.total_score;
            // this.game.players[index].infoNode.getChildByName("gold_num").getComponent(cc.Label).string = util.showNum3(playerData.total_score);
            this.game.players[index].infoNode.getChildByName("gold_num").getComponent(cc.Label).string = playerData.total_score;           
           let playerBg = cc.find("popBg/player_bg_" + index, this.node);

            if (playerData.score >= 0) {
                let score = "" + Math.abs(playerData.score);
                if (index === 0) {
                    //  背景板 
                    cc.find("score_win/score_score", playerBg).x = 310 + 30*score.length;
                    playerBg.getChildByName("bg_win").active = true;
                    playerBg.getChildByName("bg_lose").active = false;
                    // audioUtils.playSFX("resources/sound/game/effect/win.mp3");
                }
                else {
                    cc.find("score_win/score_score", playerBg).x = 79 + 25*score.length;
                }
                cc.find("score_win/score", playerBg).getComponent(cc.Label).string = score;
                cc.find("score_win", playerBg).active = true;
                cc.find("score_lose", playerBg).active = false;
            }
            else {
                let score = "" + Math.abs(playerData.score);
                if (index === 0) {
                    //  背景板
                    cc.find("score_lose/score_score", playerBg).x = 310 + 30*score.length;
                    playerBg.getChildByName("bg_win").active = false;
                    playerBg.getChildByName("bg_lose").active = true;
                    // audioUtils.playSFX("resources/sound/game/effect/lose.mp3");
                }
                else {
                    cc.find("score_lose/score_score", playerBg).x = 79 + 25*score.length;
                }
                cc.find("score_lose/score", playerBg).getComponent(cc.Label).string = score;
                cc.find("score_lose", playerBg).active = true;
                cc.find("score_win", playerBg).active = false;
            }

            cc.find("player_info_bg/zhuang", playerBg).active = false;
            cc.find("player_info_bg/head/owner", playerBg).active = false;
            cc.find("player_info_bg/nickname", playerBg).getComponent(cc.Label).string = decodeURIComponent(playerData.name);
            
            cc.find("player_info_bg/head/frame", playerBg).active = false;
            util.loadSprite("hall/bag/prop/"+playerData.headFrame, cc.find("player_info_bg/head/frame", playerBg), function (node) {
                node.active = true;
            });
            cc.find("player_info_bg/head/sp", playerBg).active = false;
            sdk.getPlayerHead(playerData.headImage, cc.find("player_info_bg/head/sp", playerBg), function (node) {
                node.active = true;
            });

            if (index === 0) {
                myHuData = playerData.text_arr;
            }
        }

        // 设置庄家显示
        {
            let index = this.game.pos[data.zhuang];
            cc.find("popBg/player_bg_" + index + "/player_info_bg/zhuang", this.node).active = true;
        }

        // 设置房主显示
        {
            let index = this.game.pos[data.zhuang];
            cc.find("popBg/player_bg_" + index + "/player_info_bg/head/owner", this.node).active = true;
        }
        

        // 设置我的胡牌倍数
        if (myHuData) {
            let itemCnt = myHuData.length;
            let plusColor = new cc.Color(157, 0, 0, config.maxOpacity);
            let reduceColor = new cc.Color(8, 63, 163, config.maxOpacity);
            // 创建胡牌的倍数
            let content = cc.find("popBg/player_bg_0/detail/view/content", this.node);
            let itemHeight = 58;
            content.height = itemHeight*itemCnt;
            // 删除以前的节点
            content.removeAllChildren();
            // 循环添加新的节点
            for (let j = 0; j < itemCnt; j++) {
                let item = new cc.Node();
                item.x = 0;
                item.y = -(j + 0.5)*itemHeight;
                content.addChild(item);

                let nameValue = Object.keys(myHuData[j])[0];
                let timesValue = myHuData[j][nameValue];

                let name = new cc.Node();
                name.anchorX = 0;
                name.x = -180;
                name.color = (timesValue >= 0) ? plusColor : reduceColor;
                name.addComponent(cc.Label);
                name.getComponent(cc.Label).string = decodeURIComponent(nameValue);
                name.getComponent(cc.Label).fontSize = 28;
                item.addChild(name);

                let times = new cc.Node();
                times.anchorX = 0;
                times.x = 110;
                times.color = (timesValue >= 0) ? plusColor : reduceColor;
                times.addComponent(cc.Label);
                times.getComponent(cc.Label).string = timesValue+"倍";
                times.getComponent(cc.Label).fontSize = 28;
                item.addChild(times);
            }
        }

        // 设置按钮
        if (data.cur_round === data.total_round || data.hu_type === 3) {
            // 最后一局或者解散
            cc.find("popBg/btn_blue", this.node).active = true;
            cc.find("popBg/btn_yellow", this.node).active = false;

            cc.find("popBg/result_back", this.node).active = false;
        }
        else {
            cc.find("popBg/btn_blue", this.node).active = false;
            cc.find("popBg/btn_yellow", this.node).active = true;

            // cc.find("popBg/result_back", this.node).active = true;
        }

        this.show();
    },

    show () {
        if (!this.node.active) {
            this.node.active = true;
        }
    },
    hide () {
        if (this.node.active) {
            this.node.active = false;
        }
    },
});
