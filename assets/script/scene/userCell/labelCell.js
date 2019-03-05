cc.Class({
    extends: require('viewCell'),

    properties: {
        //按钮  在1秒内只能点一次
        lastClickTime : 0,
    },

    // use this for initialization
    onLoad: function () {

    },
    init: function (i, data, reload, group) {
        if (i >= data.array.length) {
            return;
        }
        this._target = data.target;
        // this._data = data.array[i];
        // this.index.string = index;
        // this.group.string = group.toString();
        // util.log("dataPHB ========="+JSON.stringify(data.array));
        //util.log("dataPHB ========="+JSON.stringify(phbMsg.array.winCountTop50[0]));
        var data = data.array[i];
        var node = this.node;
        node.idx = i;
        node.playerId = data["playerId"];
        //名字
        cc.find("phb_name",node).getComponent(cc.Label).string = data["nickName"];
        //头像
        var head = cc.find("phb_head",node);
        sdk.getPlayerHead(data["headImageUrl"], head, function (node) {
                        node.active = true;
                    });
        // head.runAction(
        //     cc.sequence(
        //         cc.delayTime(i*1 + 2),
        //         cc.callFunc(function () {
        //             sdk.getPlayerHead(data["headImageUrl"], head, function (node) {
        //                 node.active = true;
        //             });
        //         }, this)
        //     )
        // );
        
        if ( this._target.btnLeft.active === true) {
            //胜局数
            cc.find("phb_number",node).getComponent(cc.Label).string = "总胜局 "+data["winCount"];
        }else if (this._target.btnRight.active === true) {
            cc.find("phb_number",node).getComponent(cc.Label).string = "金豆 "+ util.showNum3(parseInt(data["happyBeans"]));
        }
       
        //段位图标
        // util.log("PHB左边WinTop50  经验值： == " + data["winCountTop50"][i]["rankXp"]);
        util.updataGrade(data["rankXp"],function(data,duan,xing,name){
            util.loadSprite("hall/grade/jiangbei"+duan, cc.find("gradePic",node));
        });
        if(i <= 2){
            cc.find("first_pic",node).active = true;
            cc.find("label",node).active = false;
            util.loadSprite("hall/paiming_"+parseInt(i+1), cc.find("first_pic",node));
        }else{
            cc.find("first_pic",node).active = false;
            cc.find("label",node).active = true;
            cc.find("label",node).getComponent(cc.Label).string = parseInt(i+1).toString();
        }
    },
    clicked: function () {
        var nowTime = (new Date()).getTime();
        var timeInterval = (nowTime - this.lastClickTime)/1000;
        if (this.lastClickTime === 0 || timeInterval > 1) {
            audioUtils.playClickSoundEffect();
            var idx = this.node.idx;
            util.log("点击了第 " + this.node.idx + " 个cell")
            var playerId = this.node.playerId;
        
            var self = this._target;
            util.loadPrefab("userInfo",function(data){
                var userInfoNode = cc.instantiate(data);
                util.getInfoStatus(
                    playerId,
                    function(respJsonInfo){
                        if(respJsonInfo["code"] == "0"){
                            if(util.isNodeExist(self.node,"userInfoNode")){//防止多次触摸
                                return;
                            }
                            util.log("Info成功 +=== "+ respJsonInfo['msg']);
                            var msg = JSON.parse(respJsonInfo['msg']);
                            userInfoNode.getComponent("userInfoScene").setUserInfoData(msg);
                            userInfoNode.getComponent("userInfoScene").setBg(1);
                            userInfoNode.setName("userInfoNode");
                            self.node.addChild(userInfoNode);
                        }else if(respJsonInfo["code"] == "0"){
                            util.log("getInfoStatus === 0 ");
                        }else{
                            util.log("getInfoStatus === 2 ");
                        }
                    },
                null,null);
            });
            this.lastClickTime = nowTime;
        }
    }
});
