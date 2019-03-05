// 游戏扑克数据类，挂载在每张扑克上，设置麻将的扑克和显示

cc.Class({
    extends: cc.Component,

    properties: {
        index : null,
        type : null,
        side : null,

        cardScale : null,
        valueRes : null,
        valueScaleX : null,
        valueScaleY : null,
        valueRotation : null,
    },

    setCardData (cardRes, resSize) {
        this.cardScale = cardRes.cardScale;
        this.valueRes = cardRes.valueRes;
        this.valueScaleX = resSize.scaleX;
        this.valueScaleY = resSize.scaleY;
        this.valueRotation = cardRes.valueRotation;
    },

});
