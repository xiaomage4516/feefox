
cc.Class({
    extends: cc.Component,

    properties: {
        editbox:{
            default: null,
            type: cc.EditBox
        },
        success_label:{
            default: null,
            type: cc.Node
        },
        success_label_pos:null,//记录位置
        success_action_complete :null//动作是否完成
    },

     onLoad :function() {
         this.success_label_pos = this.success_label.getPosition();
         this.success_action_complete = false;
     },
     onBtnClose: function () {
         this.node.destroy();
     },
     start:function() {

     },
     onBtnSend:function(){
         var that = this;
         if(this.success_action_complete){
            return;
         }
         if(this.editbox.string == ""){
             that.success_label.active = true;
             that.success_label.getChildByName("success").getComponent(cc.Label).string = "请输入内容！"
             that.runActionLabel(that.success_label);
             return;
         }
        util.log("send == "+this.editbox.string);

        util.getFanKuiStatus(
            this.editbox.string,
            function(respJsonInfo){
                if(respJsonInfo["code"] == "0"){
                    util.log("FanKui成功 +=== "+ respJsonInfo['msg']);
                    var msg = JSON.parse(respJsonInfo['msg']);
                    that.success_label.active = true;
                    that.success_label.getChildByName("success").getComponent(cc.Label).string = "消息发送成功"
                    that.runActionLabel(that.success_label);
                }else{
                    that.success_label.active = true;
                    that.success_label.getChildByName("success").getComponent(cc.Label).string = "消息发送失败！！"

                    that.runActionLabel(that.success_label);
                }
            },
            null,null);
        
    },
    runActionLabel: function (target) {
        var that = this;
        target.runAction(cc.sequence(
            cc.callFunc(function () {
                that.success_action_complete = true;
            }),
           cc.moveBy(0.2,0,30),
            cc.delayTime(0.5),
            cc.callFunc(function () {
                target.active = false;
                target.setPosition(that.success_label_pos);
                that.success_action_complete = false;
            },target)

        ));
    }

});
