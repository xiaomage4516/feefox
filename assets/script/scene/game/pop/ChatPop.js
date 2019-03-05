// 聊天弹窗

cc.Class({
    extends: cc.Component,

    properties: {
        game : null,
    },

    start () {

    },

    // 设置游戏组件
    setGame (game) {
        this.game = game;
    },

    // 选择标签页
    onBtnTab (event, custom) {
        audioUtils.playClickSoundEffect();
    },

    // 发送快捷语
    onBtnQuick (event, custom) {
        if (custom) {
            network.send(3008, {room_id: gameData.roomId, type: "quick", content: custom, sex: this.game.players[0].info.sex});
            this.hide();
        }
    },

    // 隐藏
    onBtnHide (event, custom) {
        this.hide();
    },

    onBtnSwallow (event, custom) {
        
    },

    // 显示快捷语
    onNetQuick (data) {
        if (!data) {
            return;
        }

        let playerIndex = [this.game.pos[data.uid]];
        let strings = [
            "快点啦，时间很宝贵的",
            "一路屁胡走向胜利",
            "上碰下自摸，大家要小心啊",
            "好汉不胡头三把",
            "先胡不算胡，后胡金满桌",
            "呀，打错了怎么办",
            "卡卡卡，卡的人火大啊",
            "很高兴能和大家一起打牌啊",
        ];
        let contentIndex = data.content*1;

        // 播放音效
        let url = "";
        if (data.sex === 0) {
            url = "resources/sound/game/man/mchat" + contentIndex + ".mp3";
        }
        else {
            url = "resources/sound/game/woman/wchat" + contentIndex + ".mp3";
        }
        util.log("Quick说话="+strings[contentIndex]);
        util.log("Quick音效="+url);
        audioUtils.playSFX(url);

        // 
        this.game.event.emit("chat_quick_"+playerIndex, {
          content: strings[contentIndex],
        });
    },

    // 显示
    show () {
        if (!this.node.active) {
            cc.find("swallow", this.node).active = false;
            this.node.x = -750;
            this.node.active = true;
            this.node.stopAllActions();
            this.node.runAction(
                cc.moveTo(0.3, 0, 0).easing(cc.easeOut(3.0))
            );
        }
    },

    // 隐藏
    hide () {
        if (this.node.active) {
            cc.find("swallow", this.node).active = true;
            this.node.stopAllActions();
            this.node.runAction(
                cc.sequence(
                    cc.moveTo(0.3, -750, 0).easing(cc.easeIn(3.0)),
                    cc.callFunc(function() {
                        this.node.active = false;
                    }, this)
                )
            );
        }
    },
});
