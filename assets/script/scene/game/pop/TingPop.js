// 听牌提示弹窗

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

    refresh (tingData, swallow) {
        let tingCnt = tingData.length;
        // 计算scrollview大小，最多显示7.5个
        let itemWidth = 100;
        let outerWidth = (tingCnt > 7) ? 7.5*itemWidth : tingCnt*itemWidth;
        let innerWidth = tingCnt*itemWidth;

        cc.find("ting_bg", this.node).width = outerWidth + 154;
        cc.find("ting_bg/ting_card", this.node).width = outerWidth;
        cc.find("ting_bg/ting_card/view", this.node).width = outerWidth;

        let content = cc.find("ting_bg/ting_card/view/content", this.node);
        content.stopAllActions();
        content.width = innerWidth;
        content.x = -outerWidth/2;
        // 设置滑动
        // let scrollView = cc.find("ting_bg/ting_card", this.node).getComponent(cc.ScrollView);
        // if (tingCnt > 7) {
            // scrollView.elastic = true;
        // }
        // else {
            // scrollView.elastic = false;   
        // }
        // 删除以前的节点
        content.removeAllChildren();
        // 循环创建牌
        let totalCnt = 0;
        for (let i = 0; i < tingCnt; i++) {
            let cardData = tingData[i];

            let card = this.game.players[0].createCard(0, 1, 0);
            this.game.players[0].setCardValue(card, cardData[0]);
            card.scaleX = 0.7;
            card.scaleY = 0.7;
            card.x = (i + 0.5)*itemWidth;
            card.y = 15;
            card.getComponent(cc.Button).enabled = false;
            content.addChild(card);

            util.loadSprite("game/ting/"+cardData[2], cc.find("ting_count/count", card));
            card.getChildByName("ting_count").active = true;
            totalCnt += cardData[2];

            let cardTimes = new cc.Node();
            cardTimes.y = -95;
            cardTimes.color = new cc.Color(148, 89, 26, config.maxOpacity);
            cardTimes.addComponent(cc.Label);
            cardTimes.getComponent(cc.Label).string = ""+cardData[1]+"倍";
            cardTimes.getComponent(cc.Label).fontSize = 30;
            card.addChild(cardTimes);
        }
        cc.find("ting_bg/ting_number/number", this.node).getComponent(cc.Label).string = ""+totalCnt;

        // 底层吞噬
        if (swallow) {
            this.node.getChildByName("swallow").active = true;
        }
        else {
            this.node.getChildByName("swallow").active = false;
        }
        
        this.show();
    },

    onBtnSwallow (event, custom) {
        this.hide();
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
