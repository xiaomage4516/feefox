// 托管

cc.Class({
    extends: cc.Component,

    properties: {
        game : null,
    },

    start () {

    },

    setGame (game) {
        this.game = game;
        // 设置宽度
        cc.find("bg", this.node).width = this.game.node.width;
    },

    // 取消托管
    onBtnCancelAuto (event, custom) {
        audioUtils.playClickSoundEffect();
        if (this.game) {
            this.game.sendPlayerAuto(false);
        }
        //取消托管时，玩家如果处于听牌状态，显示自动胡牌按钮
        if (this.game.tingData) {
            util.log("取消托管时听牌数据 = "+JSON.stringify(this.game.tingData));
            cc.find("button/right/auto_hupai", this.game.node).active = true;
        }
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
