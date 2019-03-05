// 等待

cc.Class({
    extends: cc.Component,

    properties: {
    },

    start () {

    },

    onBtnSwallow () {
        
    },

    show (delay) {
        if (!this.node.active) {
            this.node.active = true;

            let light = cc.find("bg/light", this.node);
            light.getComponent(cc.Animation).play("light");
            let dice = cc.find("bg/dice", this.node);
            dice.getComponent(cc.Animation).play("dice");
        }

        if (delay) {
            this.node.runAction(
                cc.sequence(
                    cc.delayTime(delay),
                    cc.callFunc(function () {
                        this.hide();
                    }, this)
                )
            );
        }
    },
    hide () {
        if (this.node.active) {
            this.node.active = false;

            let light = cc.find("bg/light", this.node);
            light.getComponent(cc.Animation).stop("light");
            let dice = cc.find("bg/dice", this.node);
            dice.getComponent(cc.Animation).stop("dice");
        }
    },

});
