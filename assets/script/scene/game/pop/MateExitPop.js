// 匹配场，退出弹窗

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

    // 取消
    onBtnCancel () {
        audioUtils.playClickSoundEffect();
        this.hide();
    },

    // 确定，托管
    onBtnEnsure () {
        audioUtils.playClickSoundEffect();
        if (this.game) {// && this.game.sendPlayerAuto) {
            // this.target.sendPlayerAuto(true);
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
