// 具体游戏玩法通用类

var CommonType = {

    // 开混
    actGod : function(event) {
        let data = event.detail.data;
        if (data.laizi_id === 0) {
            // 没有癞子
            this.game.event.emit("actGodOver", {data : data});
            return;
        }
        // 设置癞子牌
        for (var i = 0; i < this.game.curPlayerNum; i++) {
            this.game.players[i].setGodValue(data.laizi_id);
        }
        var turn = cc.find("table/center/turn_bg", this.game.node);
        // 牌
        var card_0 = this.game.players[0].createCard(0, 2, 1);
        card_0.x = turn.x;
        card_0.y = turn.y - card_0.height/2;
        card_0.scaleX = 1.5;
        card_0.scaleY = 1.5;
        card_0.opacity = 0.8*config.maxOpacity;
        card_0.anchorY = 0;
        card_0.name = "actGod_card_0";
        cc.find("action/center", this.game.node).addChild(card_0, 2);

        var card_1 = this.game.players[0].createCard(0, 1, 0);
        this.game.players[0].setCardValue(card_1, data.laizifan);
        card_1.opacity = config.maxOpacity;
        card_1.anchorY = card_0.anchorY;
        card_1.active = false;
        card_1.getChildByName("value").anchorY = card_1.anchorY;
        card_1.getChildByName("value").y += 17;
        card_1.name = "actGod_card_1";
        cc.find("action/center", this.game.node).addChild(card_1, 3);

        var card_2 = this.game.players[0].createCard(0, 1, 0);
        this.game.players[0].setCardValue(card_2, data.laizi_id);
        card_2.x = card_1.x;
        card_2.y = card_1.y + 30;
        card_2.scaleX = 0.5;
        card_2.scaleY = 0.5;
        card_2.opacity = 0.3*config.maxOpacity;
        card_2.active = false;
        card_2.name = "actGod_card_2";
        cc.find("action/center", this.game.node).addChild(card_2, 5);

        var dstCard = cc.find("table/left/god_card_bg/card_s_f", this.game.node);
        var dest = dstCard.convertToWorldSpaceAR(cc.p(0, 0));
        dest = this.game.node.convertToNodeSpaceAR(dest);

        var god_1 = cc.find("action/center/god_1", this.game.node);
        god_1.x = card_2.x;
        god_1.y = card_2.y;
        god_1.scaleX = 3;
        god_1.scaleY = 3;
        god_1.setLocalZOrder(4);
        var anim_1 = god_1.getComponent(cc.Animation);
        anim_1.on('finished', function(){
            anim_1.node.active = false;
        }, this);

        var god_2 = cc.find("action/center/god_2", this.game.node);
        god_2.x = card_2.x;
        god_2.y = card_2.y;
        god_2.scaleX = 1.22;
        god_2.scaleY = 1.22;
        god_2.setLocalZOrder(6);
        var anim_2 = god_2.getComponent(cc.Animation);
        anim_2.on('finished', function(){
            anim_2.node.active = false;
        }, this);

        var ensure = cc.find("action/center/god_ensure", this.game.node);
        util.loadSprite("game/god_ensure_"+gameData.mapId, ensure);
        ensure.y = card_2.y - 150;
        ensure.scaleY = 0.5;
        ensure.active = false;

        // 缩小
        card_0.stopAllActions();
        card_0.runAction(
            cc.sequence(
                cc.spawn(
                    cc.scaleTo(5/25, 1, 1),
                    cc.fadeTo(5/25, config.maxOpacity)
                ),
                cc.scaleTo(7/25, 1, 0.8),
                cc.callFunc(function () {
                    // 牌1出场
                    card_1.x = card_0.x;
                    card_1.y = card_0.y;
                    card_1.scaleX = card_0.scaleX;
                    card_1.scaleY = card_0.scaleY;

                    card_1.active = true;
                    card_0.active = false;
                    // return;
                    card_1.runAction(
                        cc.sequence(
                            cc.scaleTo(3/25, 1, 1),
                            cc.delayTime(4/25),
                            cc.callFunc(function () {
                                anim_1.node.active = true;
                                anim_1.play("god_1");
                            }, this),
                            cc.delayTime(4/25),
                            cc.callFunc(function () {
                                // 牌2出场
                                audioUtils.playSFX("resources/sound/game/effect/god_show.mp3");
                                card_2.active = true;
                                card_2.runAction(
                                    cc.sequence(
                                        cc.spawn(
                                            cc.scaleTo(5/25, 1.3, 1.3),
                                            cc.fadeTo(5/25, config.maxOpacity)
                                        ),
                                        cc.callFunc(function () {
                                            anim_2.node.active = true;
                                            anim_2.play("god_2");
                                        }, this),
                                        cc.scaleTo(5/25, 1, 1),
                                        cc.delayTime(9/25),
                                        cc.callFunc(function () {
                                            ensure.active = false;
                                            audioUtils.playSFX("resources/sound/game/effect/god_move.mp3");
                                        }, this),
                                        cc.spawn(
                                            cc.moveTo(0.5, dest),
                                            cc.scaleTo(0.5, 0.4, 0.4)
                                        ),
                                        cc.callFunc(function () {
                                            this.setGodCard(data.laizi_id);
                                            // 设置癞子牌显示，排序
                                            for (var i = 0; i < this.game.curPlayerNum; i++) {
                                                this.game.players[i].setHandCard(data.paiArr, data.paiArr.length);
                                            }
                                            this.game.event.emit("actGodOver", {data : data});
                                        }, this),
                                        cc.removeSelf(),
                                    )
                                );
                                ensure.active = true;
                                ensure.runAction(
                                    cc.sequence(
                                        cc.scaleTo(6/25, 1, 1.2).easing(cc.easeOut(3.0)),
                                        cc.scaleTo(2/25, 1, 1)
                                    )
                                );
                            }, this),
                            cc.spawn(
                                cc.scaleTo(5/25, 0.5, 0.5),
                                cc.fadeTo(5/25, 0)
                            ),
                            cc.removeSelf(),
                        )
                    );
                }, this),
                cc.removeSelf(),
            )
        );
    },

    
    // 设置癞子牌
    setGodCard : function(value) {
        if (value) {
            // 添加癞子牌
            var godCardBg = cc.find("table/left/god_card_bg", this.game.node);
            this.game.players[0].setCardValue(godCardBg.getChildByName("card_s_f"), value);
            if (gameData.mapId === config.HENAN_TUIDAOHU) {
                godCardBg.getChildByName("card_god").getComponent(cc.Label).string = "癞子";
            }
            else if (gameData.mapId === config.HENAN_ZHENGZHOU) {
                godCardBg.getChildByName("card_god").getComponent(cc.Label).string = "混牌";
            }
            
            godCardBg.active = true;
        }
        else {
            // 隐藏癞子牌
            cc.find("table/left/god_card_bg", this.game.node).active = false;
        }
    },

    // 停止动作，初始化动作节点
    initAction : function() {
        {
            // 混牌动作
            let center = cc.find("action/center", this.game.node);
            let card_0 = center.getChildByName("actGod_card_0");
            if (card_0) {
                card_0.stopAllActions();
                card_0.removeFromParent();
            }
            let card_1 = center.getChildByName("actGod_card_1");
            if (card_1) {
                card_1.stopAllActions();
                card_1.removeFromParent();
            }
            let card_2 = center.getChildByName("actGod_card_2");
            if (card_2) {
                card_2.stopAllActions();
                card_2.removeFromParent();
            }
            let god_1 = cc.find("god_1", center);
            let anim_1 = god_1.getComponent(cc.Animation);
            anim_1.stop();
            god_1.active = false;
            let god_2 = cc.find("god_2", center);
            let anim_2 = god_2.getComponent(cc.Animation);
            anim_2.stop();
            god_2.active = false;
            var ensure = cc.find("god_ensure", center);
            ensure.active = false;
        }
    },

    reconnectGaming (data) {
        // 设置癞子牌
        for (var i = 0; i < this.game.curPlayerNum; i++) {
            this.game.players[i].setGodValue(data.laizi_id);
        }
        // 设置癞子
        this.setGodCard(data.laizi_id);
    },
};

module.exports = CommonType;