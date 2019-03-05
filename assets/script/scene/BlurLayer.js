// 模糊

cc.Class({
    extends: cc.Component,

    properties: {
        loaded : 0,
    },

    start () {
        let that = this;
        for (let i = 1; i <= 18; i++) {
            let name = i > 9 ? ""+i : "0"+i;
            let node = cc.find("bg/"+name, this.node);
            util.loadSprite("hall/blur/"+name, node, function () {
                that.loaded++;
                if (that.loaded === 18) {
                    // 加载完毕
                    cc.find("bg", that.node).active = true;
                }
            });
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
