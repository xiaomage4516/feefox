// 河南推倒胡

var CommonType = require("CommonType");

cc.Class({
	properties : {
        game : null,

        godData : null,
	},

	ctor () {
		util.log("HeNanTuiDaoHu");
        this.actGod = CommonType.actGod;
        this.setGodCard = CommonType.setGodCard;
        this.initAction = CommonType.initAction;
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
	},

    initGame () {
        this.setGodCard();
    },


	// 添加事件监听
    addEvent () {
        // 手牌显示完毕，开混
        this.game.event.off("actPlayerHandCardOver", this.game.actGameGoing, this.game);
        this.game.event.on("actPlayerHandCardOver", this.actGod, this);
        // 开混完毕
        this.game.event.on("actGodOver", this.game.actGameGoing, this.game);
    },

    removeEvent () {
        // 手牌显示完毕，开混
        this.game.event.off("actPlayerHandCardOver", this.actGod, this);
        // 开混完毕
        this.game.event.off("actGodOver", this.game.actGameGoing, this.game);
    },
});