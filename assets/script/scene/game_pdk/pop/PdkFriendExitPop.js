// 好友局，退出弹窗

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

    // 再想想
    onBtnThinkTwice () {
        audioUtils.playClickSoundEffect();
        this.hide();
    },

    // 申请解散
    onBtnAskDismiss () {
        audioUtils.playClickSoundEffect();
        if (this.game && this.game.sendPlayerDismiss) {
            this.hide();
            this.game.sendPlayerDismiss();
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
