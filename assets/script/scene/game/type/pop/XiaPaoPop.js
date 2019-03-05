// 下跑

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

    // 点击下跑
    onBtnScore (event, custom) {
        audioUtils.playClickSoundEffect();
        if (custom === "score_1") {
            // 下跑选1
            this.hide();
            network.send(5001, {room_id: gameData.roomId, uid: gameData.uid, piaoCnt: 1});
        }
        else if (custom === "score_2") {
            // 下跑选2
            this.hide();
            network.send(5001, {room_id: gameData.roomId, uid: gameData.uid, piaoCnt: 2});
        }
        else if (custom === "score_4") {
            // 下跑选4
            this.hide();
            network.send(5001, {room_id: gameData.roomId, uid: gameData.uid, piaoCnt: 4});
        }
        else if (custom === "score_0") {
            // 下跑选过
            this.hide();
            network.send(5001, {room_id: gameData.roomId, uid: gameData.uid, piaoCnt: 0});
        }
    },

    onBtnSwallow (event, custom) {

    },

    show () {
        if (!this.node.active) {
            for (var i = 1; i < 5; i++) {
                var choice = this.node.getChildByName("xiapao_"+i);
                choice.x = this.game.centerX;
                choice.y = this.game.centerY;
                choice.runAction(
                    cc.moveTo(0.3, this.game.centerX + 100*i - 250, -145)
                );
            }
            this.node.active = true;
        }
    },
    hide () {
        if (this.node.active) {
            this.node.active = false;
        }
    },

});
