// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        content :{
            default : null,
            type : cc.Node
        },
        useNode:{
            default:null,
            type: cc.Node
        },
        seeNode:{
            default:null,
            type: cc.Node
        },
        _propData:null,//表数据
        _propContent:null,
        _propItemTemp:null,

        _bagData:null,//查询获得的背包数据(不包含Buff)
        _bagBuffData:null,//查询获得的buff 数据
        _bagAllBuffData:[],// 补全后的Buff数据
        _clickItemData:null,
        _BuffNum:null,
        _isKong:null,

        _nowClickPropId:null,

        _propFlag:null,//当前道具是否可使用

        anim:cc.Animation,
        shipeiCenterNode:cc.Node,

    },

    onLoad:function () {
        //
        if(gameData.canvasWidth/gameData.canvasHeight<1.5){//按照平板4:3来处理
            this.shipeiCenterNode.scale = 0.8;
        }else if(gameData.canvasWidth/gameData.canvasHeight<1.64){
            this.shipeiCenterNode.scale = 0.85;
        } 
        //
        this._propContent = cc.find("centerNode/center/rightList/view/content",this.node);
        this._propItemTemp = this._propContent.children[0];
        this._propContent.removeChild(this._propItemTemp); 

        var self = this;
        this._BuffNum = 0;

        this.useNode.active = false;
        this.seeNode.active = false;

        this.playBagAnim();

        var doGetPr = function(data) {
            self._propData = data;
            //不是根据表来配置，是根据服务器的数据来显示
            if(!self._isKong){
                for(var i = 0; i < self._bagData.length; ++i ){
                    if(self._bagData[i]["useStatus"] == 0){//可以使用但未使用
                        self._bagAllBuffData[i] = "";
                    }else if(self._bagData[i]["useStatus"] == -1){//不可使用
                        self._bagAllBuffData[i] = "";
                    }else if(self._bagData[i]["useStatus"] == 2){//使用中
                        self._bagAllBuffData[i] = self._bagBuffData[self._BuffNum++];
                    }
                }
                self.initPropList(self._bagData,self._bagBuffData);
            }else{
                util.log("空空如也！");
            }
            
        };
        if (config.PropInfoData) {
            doGetPr(config.PropInfoData);
        }else{
            util.loadJsonFile("json/GamePropInfo_Common", function (data) {
                config.PropInfoData = data;
                if (config.PropInfoData) {
                    doGetPr(config.PropInfoData);
                    //
                }
            });
        }
    },
    playBagAnim:function(){
        this.anim.stop("bagAnim");
        this.anim.play("bagAnim");
    },
    setBagData:function(data){
        if(data["PileNum"] == 0){
            this._isKong = true;
            util.log("背包为空");
        }else{
            if(data["backPackAllPile"].length>0){
                this._bagData = data["backPackAllPile"];
                util.log("背包内道具数量 == " + this._bagData.length);
            }
            if(data["backPackAllBuff"].length>0){
                this._bagBuffData = data["backPackAllBuff"];
                util.log("背包内道具Buff数量 == " + this._bagBuffData.length);
            }
        } 
    },
    initPropList:function(data,buffData){
        var self = this;
        for(var i = 0; i < data.length; ++i ){
            var node = this.getPropItem(i);
            node.idx = i;
            // node.setTag(data[i]["id"]);

            util.log("propID === "+data[i]["propId"]);


            //名字
            cc.find("name",node).getComponent(cc.Label).string = this._propData[data[i]["propId"]-1]["prop_name"];
            //图标
            util.loadSprite("hall/bag/prop/"+this._propData[data[i]["propId"]-1]["prop_img"], cc.find("icon",node));
            //是否可叠加（是否显示x20）(默认不可叠加)
            if(data[i]["propNum"] == 1){
                cc.find("sum",node).active = false;
            }else{
                cc.find("sum",node).getComponent(cc.Label).string = "x"+data[i]["propNum"];
            }
            //是否显示使用按钮(使用状态)
            if(data[i]["useStatus"] == 0){//可以使用但未使用
                cc.find("btn_see",node).active = false;
                cc.find("btn_use",node).active = true;
                cc.find("huangdi",node).active = false;
                cc.find("des",node).active = false;
            }else if(data[i]["useStatus"] == -1){//不可使用
                cc.find("btn_see",node).active = true;
                cc.find("btn_use",node).active = false;
                cc.find("huangdi",node).active = false;
                cc.find("des",node).active = false;
            }else if(data[i]["useStatus"] == 2){//使用中
                cc.find("btn_see",node).active = true;
                cc.find("btn_use",node).active = false;
                cc.find("huangdi",node).active = true;
                cc.find("des",node).active = true;//等倒计时做好  大于一天不显示，小于一天的显示秒
            }

            //显示Buff
            if(data[i]["useStatus"] == 2){
                if(buffData && this._bagAllBuffData[i]["playerId"]){
                    if(this._propData[this._bagAllBuffData[i]["buffPropId"]-1]["effect_way"]==2 || this._propData[this._bagAllBuffData[i]["buffPropId"]-1]["effect_way"]==5  || this._propData[this._bagAllBuffData[i]["buffPropId"]-1]["effect_way"]==1){
                        var stringTime = this._bagAllBuffData[i]["startTime"].replace(/-/g, '/');
                        var startTimeTamp = Date.parse(new Date(stringTime));
                        if(this._propData[this._bagAllBuffData[i]["buffPropId"]-1]["effect_value"] > 0){//不是永久使用(包含期限头像框)
                            var jiangge_time = this._propData[this._bagAllBuffData[i]["buffPropId"]-1]["effect_value"] * 1;
                            var intervalTime = jiangge_time*1000;
                            var endTime = startTimeTamp + intervalTime;
                            var _nowtime = new Date().getTime();
                            var subTime = endTime - _nowtime;
                            var subTimeValue = subTime <= 0 ? 0 : subTime;
                            var allTime = Math.floor(subTimeValue/1000)
                            // var time = util.createCountdownTime(startTimeTamp,this._propData[this._bagAllBuffData[i]["buffPropId"]-1]["effect_value"]);
                            var time = "剩余时间: "+util.formatTimeDateStr(allTime*1000)
                            var timer = cc.find("des",node).getComponent(cc.Label);
                            timer.effect_way = this._propData[this._bagAllBuffData[i]["buffPropId"]-1]["effect_way"];
                            timer.allTime = allTime;
                            timer.unschedule();
                            if (allTime) {
                                timer.string = time;
                                timer.schedule(function () {

                                    var nextTime = --this.allTime;
                                    this.string = "剩余时间: "+util.formatTimeDateStr((nextTime)*1000);
                                    util.log("time22222222 ==== "+nextTime);
                                    if(nextTime == 0){
                                        cc.find("huangdi",node).active = false;
                                        this.string = "";
                                        // util.log("背包道具使用时间归0");
                                        if(this.effect_way==1){
                                            self.changeHeadFrame(7);
                                        }
                                        this.unschedule();
                                    }
                                    
                                }, 1, allTime-1);//allTime-1
                            }
                        }else if(this._propData[this._bagAllBuffData[i]["buffPropId"]-1]["effect_value"] == "-1"){
                        //永久
                            cc.find("des",node).getComponent(cc.Label).string = "永久";
                        }
                    }else if(this._propData[this._bagAllBuffData[i]["buffPropId"]-1]["effect_way"]==3 || this._propData[this._bagAllBuffData[i]["buffPropId"]-1]["effect_way"]==6){
                        cc.find("des",node).getComponent(cc.Label).string = "剩余" + parseInt(this._bagAllBuffData[i]["totalCount"] - this._bagAllBuffData[i]["progressCount"]) + "局";
                    }
                }
            }
        }
        
        
    },
    getPropItem:function(index){
        var propContent = this._propContent;
        if(propContent.childrenCount > index){//已经添加过了
            return propContent.children[index];
        }
        //
        var node = cc.instantiate(this._propItemTemp);
        propContent.addChild(node);
        return node;
    },
    onBtnUse:function(event){
        audioUtils.playClickSoundEffect();
        var self = this;
        var node = event.target.parent;
        var idx = event.target.parent.idx;
        util.log("dianji ： " + this._bagData.length);
        util.log("propId ： " + this._bagData[idx]["propId"]);
        util.log("dianji 2： " + this._bagData[idx]["propOnlyId"]);
        
        util.log("点击按钮的IDX  == " + idx)
        this.getPropIsCanUse(this._bagData[idx]["propId"],idx);
        
        
        // this.useNode.active = true;

        

        
    },
    getPropIsCanUse:function(propId,idx){
        if(propId == 1 || propId == 2 || propId == 7 || propId == 8){
            this._propFlag = true;
        }else{
            this._propFlag = true;
            for(var i = 0; i < this._bagData.length; ++i ){
                if(this._bagData[i]["useStatus"] == 2){//使用中
                    if(this._bagData[i]["propId"] == 3 && propId == 3){
                        this._propFlag = false;
                    }
                    if(this._bagData[i]["propId"] == 4 && propId == 4){
                        this._propFlag = false;
                    }
                    if(this._bagData[i]["propId"] == 5 && propId == 5){
                        this._propFlag = false;
                    }
                    if(this._bagData[i]["propId"] == 6 && propId == 6){
                        this._propFlag = false;
                    }
                }
            }
        }
        
        if(this._propFlag){
            cc.find("name",this.useNode).getComponent(cc.Label).string = this._propData[parseInt(propId)-1].prop_name;
            cc.find("des",this.useNode).getComponent(cc.Label).string = this._propData[parseInt(propId)-1].item_describe;

            //图标
            util.loadSprite("hall/bag/prop/"+this._propData[parseInt(propId)-1]["prop_img"], cc.find("icon",this.useNode));
            this.useNode.active = true;
            this._nowClickPropId = idx;
        }else{
            // util.tip(this.node, 2, "您正在使用该类型道具，等其效果结束后才可重新使用",null, null, null, false, true, false);
            util.tip({
                node : this.node,
                type : 2,
                string : "您正在使用该类型道具，等其效果结束后才可重新使用",
                leftCallback : null,
                centerCallback : null,
                rightCallback : null,
                isShowLeftBtn : false,
                isShowCenterBtn : true,
                isShowRightBtn : false
            });
        }
    },
    onBtnSee:function(event){
        audioUtils.playClickSoundEffect();
        util.log("btn_see");
        this.seeNode.active = true;
        var node = event.target.parent;
        var idx = event.target.parent.idx;
        util.log("dianji ： " + this._bagData.length);
        util.log("dianji1 ： " + this._bagData[idx]["propId"]);
        util.log("dianji 2： " + this._bagData[idx]["propOnlyId"]);
        
        util.log("点击按钮的IDX  == " + idx);

        // var node = cc.find("")
        //名字
        cc.find("name",this.seeNode).getComponent(cc.Label).string = this._propData[this._bagData[idx]["propId"]-1]["prop_name"];
        //图标
        util.loadSprite("hall/bag/prop/"+this._propData[this._bagData[idx]["propId"]-1]["prop_img"], cc.find("pic",this.seeNode));
        //type
        if(this._propData[this._bagData[idx]["propId"]-1]["prop_type"]==1){
            cc.find("type",this.seeNode).getComponent(cc.Label).string = "头像框";
        }else if(this._propData[this._bagData[idx]["propId"]-1]["prop_type"]==2){
            cc.find("type",this.seeNode).getComponent(cc.Label).string = "金豆增益卡";
        }else if(this._propData[this._bagData[idx]["propId"]-1]["prop_type"]==3){
            cc.find("type",this.seeNode).getComponent(cc.Label).string = "积分增益卡";
        }
        
        // usedes   prop_type
        if(this._bagData[idx]["useStatus"] == 2){
            if(this._propData[this._bagData[idx]["propId"]-1]["effect_way"]==2 || this._propData[this._bagData[idx]["propId"]-1]["effect_way"]==5){//
                if(this._bagBuffData && this._bagAllBuffData[idx]["playerId"]){
                    var stringTime = this._bagAllBuffData[idx]["startTime"].replace(/-/g, '/');
                    var startTimeTamp = Date.parse(new Date(stringTime));
                    var jiangge_time = this._propData[this._bagAllBuffData[idx]["buffPropId"]-1]["effect_value"] * 1;
                    var intervalTime = jiangge_time*1000;
                    var endTime = startTimeTamp + intervalTime;
                    var _nowtime = new Date().getTime();
                    var subTime = endTime - _nowtime;
                    var subTimeValue = subTime <= 0 ? 0 : subTime;
                    var allTime = Math.floor(subTimeValue/1000)
                    // var time = util.createCountdownTime(startTimeTamp,this._propData[this._bagAllBuffData[i]["buffPropId"]-1]["effect_value"]);
                    // var time = 
                    cc.find("usedes",this.seeNode).getComponent(cc.Label).string = "正在使用中剩余时间: "+util.formatTimeDateStr(allTime*1000)
                }
            }else if(this._propData[this._bagData[idx]["propId"]-1]["effect_way"]==3 || this._propData[this._bagData[idx]["propId"]-1]["effect_way"]==6){
                if(this._bagBuffData && this._bagAllBuffData[idx]["playerId"]){
                    cc.find("usedes",this.seeNode).getComponent(cc.Label).string = "正在使用中,剩余: " + parseInt(this._bagAllBuffData[idx]["totalCount"] - this._bagAllBuffData[idx]["progressCount"]) + "局";
                }  
            }else if(this._propData[this._bagData[idx]["propId"]-1]["effect_way"]==1){
                cc.find("usedes",this.seeNode).getComponent(cc.Label).string = "正在使用中";
            } 
        }
        //propId  
        cc.find("num",this.seeNode).getComponent(cc.Label).string = "x" + this._bagData[idx]["propNum"]; 
        // numdes
        cc.find("txtLayout/numdes",this.seeNode).getComponent(cc.Label).string = "拥有"+this._propData[this._bagData[idx]["propId"]-1]["prop_name"];
        cc.find("txtLayout/num",this.seeNode).getComponent(cc.Label).string = this._bagData[idx]["propNum"];

        // item_describe
        cc.find("des",this.seeNode).getComponent(cc.Label).string = "使用后"+this._propData[this._bagData[idx]["propId"]-1]["item_describe"]

    },
    onBtnSeeClose:function(){
        audioUtils.playCloseSoundEffect();
        this.seeNode.active = false;
    },
    onBtnQuxiao: function () {
        audioUtils.playClickSoundEffect();
        this.useNode.active = false;
    },
    onBtnQueDing: function (event) {
        audioUtils.playClickSoundEffect();
        var self = this;
        // var node = event.target.parent;
        var node = this._propContent.children[self._nowClickPropId];
        util.log("id ======= "+self._nowClickPropId);
        util.getBagUseStatus(
            self._bagData[self._nowClickPropId]["propId"],
            self._bagData[self._nowClickPropId]["propOnlyId"],
            function(respJsonInfo){
                if(respJsonInfo["code"] == "0"){
                    util.log("BagUse成功 +=== "+ respJsonInfo['msg']);
                    var msg = JSON.parse(respJsonInfo['msg']);
                    util.log("BagUse  === "+ msg);
                    //点击之后获取到的数据有  changeItem   withBuff，这里把changeItem更新到_bagData（服务器返回的背包数据）里面,把withBuff更新到_bagAllBuffData（补全后的Buff数据）
                    // util.log("000000000000 == "+self._bagData[self._nowClickPropId]["startUseTime"]);
                    if(msg["changeItem"]){
                        self._bagData[self._nowClickPropId] = msg["changeItem"];
                    }         

                    if(msg["withBuff"]){
                        self._bagAllBuffData[self._nowClickPropId] = msg["withBuff"];
                    }
                    // util.log("333333333333 == "+self._bagAllBuffData[self._nowClickPropId]["startTime"]);
                    // util.log("BagUse  === "+ msg["backPackAllPile"]);
                    //使用成功之后要改变这一个道具的状态
                    //是否显示使用按钮(使用状态)
                    if(msg["changeItem"]["useStatus"] == 0){//可以使用但未使用
                        cc.find("btn_see",node).active = false;
                        cc.find("btn_use",node).active = true;
                        cc.find("huangdi",node).active = false;
                        cc.find("des",node).active = false;
                    }else if(msg["changeItem"]["useStatus"] == -1){//不可使用
                        cc.find("btn_see",node).active = true;
                        cc.find("btn_use",node).active = false;
                        cc.find("huangdi",node).active = false;
                        cc.find("des",node).active = false;
                    }else if(msg["changeItem"]["useStatus"] == 2){//使用中
                        cc.find("btn_see",node).active = true;
                        cc.find("btn_use",node).active = false;
                        cc.find("huangdi",node).active = true;
                        // cc.find("des",node).getComponent(cc.Label).string = "开始时间:"+data[i]["startUseTime"];
                        cc.find("des",node).active = true;//等倒计时做好 
                    }
                    //显示Buff
                    util.log("idx ====  "+ self._nowClickPropId);
                    util.log("self._bagData[idx][\"effect_way\"] == " + self._propData[msg["changeItem"]["propId"]-1]["effect_way"]);
                    if(self._propData[msg["changeItem"]["propId"]-1]["effect_way"]==2 || self._propData[msg["changeItem"]["propId"]-1]["effect_way"]==5 || self._propData[msg["changeItem"]["propId"]-1]["effect_way"]==1){

                        var stringTime = msg["withBuff"]["startTime"].replace(/-/g, '/');
                        var startTimeTamp = Date.parse(new Date(stringTime));
                        // startTimeTamp = startTimeTamp/1000;//某个时间格式的时间戳
                        util.log("startTimeTamp  == "+startTimeTamp);
                        util.log("self._propData[idx][\"effect_value\"]  == "+self._propData[msg["changeItem"]["propId"]-1]["effect_value"]);
                        if(self._propData[msg["changeItem"]["propId"]-1]["effect_value"] > 0){
                            var jiangge_time = self._propData[msg["changeItem"]["propId"]-1]["effect_value"] * 1;
                            var intervalTime = jiangge_time*1000;
                            var endTime = startTimeTamp + intervalTime;
                            var _nowtime = new Date().getTime();
                            var subTime = endTime - _nowtime;
                            var subTimeValue = subTime <= 0 ? 0 : subTime;
                            var allTime = Math.floor(subTimeValue/1000)
                            util.log("time1111 ==== "+allTime);
                            var time = util.createCountdownTime(startTimeTamp,self._propData[msg["changeItem"]["propId"]-1]["effect_value"]);
                            util.log("time1234 ==== "+time);
                            var timer = cc.find("des",node).getComponent(cc.Label);
                            timer.unschedule();
                            if (allTime) {
                                timer.string = "剩余时间: "+time;
                                timer.schedule(function () {
                                    var nextTime = --allTime;
                                    timer.string = "剩余时间: "+util.formatTimeDateStr(nextTime*1000);
                                    util.log("time2222 ==== "+nextTime);
                                    if(nextTime == 0){
                                        cc.find("huangdi",node).active = false;
                                        this.string = "";
                                        if(self._propData[msg["changeItem"]["propId"]-1]["effect_way"]==1){
                                            self.changeHeadFrame(7);
                                        }
                                        // util.log("背包道具使用时间归0_shiyonganniu");
                                        timer.unschedule();
                                    }
                                }, 1, allTime-1);
                            }
                        }else if(self._propData[msg["changeItem"]["propId"]-1]["effect_value"] == "-1"){
                            //永久
                                cc.find("des",node).getComponent(cc.Label).string = "永久";
                            }
                    }else if(self._propData[msg["changeItem"]["propId"]-1]["effect_way"]==3 || self._propData[msg["changeItem"]["propId"]-1]["effect_way"]==6){
                        cc.find("des",node).getComponent(cc.Label).string = "剩余" + parseInt(msg["withBuff"]["totalCount"] - msg["withBuff"]["progressCount"]) + "局";
                    }
                    //更换头像框
                    self.changeHeadFrame(msg["changeItem"]["propId"]);
                    // for(var j = 0;j<self._propData.length;j++){
                    //     if(self._propData[j]["id"] == msg["changeItem"]["propId"]){
                    //         if(self._propData[j]["prop_type"] == 1){
                    //             gameData.playHeadFrame = msg["changeItem"]["propId"];
                    //             self.node.parent.getComponent("HallScene").setHeadFrame("hall/bag/prop/"+gameData.playHeadFrame);
                    //         }
                    //     }
                    // }

                }else if(respJsonInfo["code"] == "0"){
                    util.log("getBagUseStatus === 0 ");
                }else{
                    util.log("getBagUseStatus ===  "+ respJsonInfo["code"]);
                }
            },
        null,null);
       

        this.useNode.active = false;


    },
    changeHeadFrame:function(propId){
        var self = this;
        for(var j = 0;j<self._propData.length;j++){
            if(self._propData[j]["id"] == propId){
                if(self._propData[j]["prop_type"] == 1){
                    gameData.playHeadFrame = propId;
                    self.node.parent.getComponent("HallScene").setHeadFrame("hall/bag/prop/"+gameData.playHeadFrame);
                }
            }
        }
    },
    start:function(){

    },
    update:function(dt) {

    },
    onBtnClose:function(){
        audioUtils.playCloseSoundEffect();
        this.node.destroy();
        // util.tip(this.node, 2, "您正在使用该类型道具，等其效果结束后才可重新使用",null, null, null, false, true, false);
    },

});
