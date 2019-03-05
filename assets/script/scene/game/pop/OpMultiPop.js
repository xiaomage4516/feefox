// 操作多选弹窗

var GameConfig = require("GameConfig");

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

    refresh (op, data) {
        let scale = 0.7;
        let cardWidth = this.game.players[0].getCardSize(0, 1, 0).width*scale;
        let totalWidth = 0;

        // 设置每个选择的内容
        for (let i = 0; i < data.length; i++) {
            let choiceBg = this.node.getChildByName("bg_"+i);
            choiceBg.x = totalWidth;
            // 删除以前的节点
            choiceBg.removeAllChildren();
            // 添加新的节点
            let choiceData = data[i];
            let cardCnt = choiceData.length;
            let choiceWidth = cardWidth*cardCnt;
            choiceBg.width = choiceWidth + 20*2;
            totalWidth += 7 + choiceBg.width;
            for (let j = 0; j < cardCnt; j++) {
                let card = this.game.players[0].createCard(0, 1, 0);
                this.game.players[0].setCardValue(card, choiceData[j]);
                card.scaleX = scale;
                card.scaleY = scale;
                card.x = 20 + (j + 0.5)*cardWidth;
                card.getComponent(cc.Button).enabled = false;
                choiceBg.addChild(card);
            }
        }

        // 设置每个选择的位置
        for (var i = 0; i < data.length; i++) {
            let choiceBg = this.node.getChildByName("bg_"+i);
            choiceBg.x += -totalWidth/2;
            choiceBg.active = true;
        }
        
        for (; i < 4; i++) {
            this.node.getChildByName("bg_"+i).active = false;
        }

        // 设置过的位置
        this.node.getChildByName("pass").x = totalWidth/2 + 50;
        
        this.show();
    },

    // 多选操作
    onBtnMultiOp (event, custom) {
        if (!this.game.curOp) {
            return;
        }
        else if (custom === "pass") {
            // 过
            this.game.setOpMultiPop();
            this.game.sendGameOp(GameConfig.OP_PASS, this.game.opCardValue[this.game.getOpIndex(this.game.curOp)][0]);
            this.game.curOp = null;
        }
        else {
            // 选择
            this.game.setOpMultiPop();
            this.game.sendGameOp(this.game.curOp, this.game.opCardValue[this.game.getOpIndex(this.game.curOp)][parseInt(custom)]);
            this.game.curOp = null;
        }
    },

    onBtnSwallow (event, custom) {

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
