// 郑州麻将

var GameConfig = require("GameConfig");
var CommonType = require("CommonType");

cc.Class({
	properties : {
        godData : null,

        // 缓存的界面
        XiaPaoPop : null,
	},

	ctor () {
		util.log("ZhengZhouMaJiang");
        this.actGod = CommonType.actGod;
        this.setGodCard = CommonType.setGodCard;
        this.reconnectGaming = CommonType.reconnectGaming;
	},

    setGame (game) {
        this.game = game;
    },

	initType () {
        // 癞子牌
        this.setGodCard();
        // 下跑分
        for (var i = 0; i < 4; i++) {
            this.game.players[i].infoNode.getChildByName("xiapao").active = false;
        }
        this.setXiaPaoPop(false);
        this.game.unblockList[5001] = true;
	},

    initGame () {
        this.setGodCard();
    },


	// 添加事件监听
    addEvent () {
        // 定完庄家，选择下跑
        this.game.event.off("actZhuangOver", this.game.actPlayerHandCard, this.game);
        this.game.event.on("actZhuangOver", this.actXiaPao, this);
        // 选完下跑，显示手牌
        this.game.event.on("actXiaPaoOver", this.game.actPlayerHandCard, this.game);
        // 手牌显示完毕，开混
        this.game.event.off("actPlayerHandCardOver", this.game.actGameGoing, this.game);
        this.game.event.on("actPlayerHandCardOver", this.actGod, this);
        // 开混完毕
        this.game.event.on("actGodOver", this.game.actGameGoing, this.game);
    },

    addNetwork () {
        var that = this;
        network.addListener(5001, function (data) {
            util.log("5001 下跑结果 data="+JSON.stringify(data));
            that.actXiaPaoResult(data.playersPiao);
        });
    },


    // 特殊玩法
    actXiaPao (event) {
        this.godData = event.detail.data;
        this.setXiaPaoPop(true);
    },
    // 下跑结果
    actXiaPaoResult (data) {
        // 隐藏下跑
        this.setXiaPaoPop(false);
        let that = this;
        for (var i = 0; i < data.length; i++) {
            let index = this.game.pos[data[i].uid];
            this.game.players[index].actXiaPaoResult(data[i].piaocnt, function () {
                if (that.godData) {
                    that.game.event.emit("actXiaPaoOver", {data : that.godData});
                    that.godData = null;
                }
            });
        }
        //四个人下跑分都为0,没有下跑分的动作效果，直接执行接下来的操作
        if (data[0].piaocnt === 0 && data[1].piaocnt === 0 && data[2].piaocnt === 0 && data[3].piaocnt === 0) {
            if (that.godData) {
                that.game.event.emit("actXiaPaoOver", {data : that.godData});
                that.godData = null;
            }
        }
    },

    // 设置下跑显示
    setXiaPaoPop (flag) {
        if (flag) {
            if (!this.XiaPaoPop) {
                let that = this;
                util.loadGamePrefab("type/XiaPaoPop", function (perfab) {
                    if (!that.XiaPaoPop) {
                        let xiaPaoPop = cc.instantiate(perfab);
                        cc.find("pop/center", that.game.node).addChild(xiaPaoPop, GameConfig.POP_ZORDER["XiaPaoPop"]);
                        that.XiaPaoPop = xiaPaoPop.getComponent("XiaPaoPop");
                        that.XiaPaoPop.setGame(that.game);
                        that.XiaPaoPop.show();
                    }
                    else {
                        that.XiaPaoPop.show();
                    }
                });
            }
            else {
                this.XiaPaoPop.show();
            }
        }
        else {
            if (this.XiaPaoPop) {
                this.XiaPaoPop.hide();
            }
        }
    },

    

    removeListeners () {
        network.removeListeners(5001);
    },

    removeEvent () {
        // 定完庄家，选择下跑
        this.game.event.off("actZhuangOver", this.actXiaPao, this);
        // 选完下跑，显示手牌
        this.game.event.off("actXiaPaoOver", this.game.actPlayerHandCard, this.game);
        // 手牌显示完毕，开混
        this.game.event.off("actPlayerHandCardOver", this.actGod, this);
        // 开混完毕
        this.game.event.off("actGodOver", this.game.actGameGoing, this.game);
    },

    initAction () {
        this.setXiaPaoPop(false);
        CommonType.initAction.call(this);
    },

});