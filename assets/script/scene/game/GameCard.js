// 游戏麻将数据类，挂载在每张麻将上，设置麻将的属性和显示

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
