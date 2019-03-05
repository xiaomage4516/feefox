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
        btnLeft:cc.Node,
        btnCenter:cc.Node,
        btnRight:cc.Node,
        btnLeft_1:cc.Node,
        btnCenter_1:cc.Node,
        btnRight_1:cc.Node,
        leftNode:cc.Node,
        centerNode:cc.Node,
        rightNode:cc.Node,
        _rewardData:null,
        _duijushu:null,
        _scrollArray:[],

        _leftContent:null,
        _leftItemTemp:null,
    },

    onLoad:function () {
        this.isClick("center");

        this._leftContent = cc.find("leftList/mailList/view/content",this.node);
        this._leftItemTemp = this._leftContent.children[0];
        this._leftContent.removeChild(this._leftItemTemp);

        this._duijushu = this._rewardData["list"].length;
        //房间玩法界面
        this.initRight();
        //总分排名界面
        this.initCenter();
        //战绩流水
        this.initLeft(this._rewardData["list"]);
    },
    setRecordData:function(data){
        this._rewardData = data;//一条的数据
    },
    //初始化右边 房间玩法界面
    initRight:function(){
        cc.find("wanfa",this.rightNode).getComponent(cc.Label).string = this._rewardData["playType"];
        cc.find("moshi",this.rightNode).getComponent(cc.Label).string = this._rewardData["gameId"];
        cc.find("fanxing",this.rightNode).getComponent(cc.Label).string = this._rewardData["fanxing"];
    },
    //初始化中间 总分排名界面
    initCenter:function(){
         //排序
        var by = function(name){
            return function(o, p){
              var a, b;
              if (typeof o === "object" && typeof p === "object" && o && p){
                  a = o[name];
                  b = p[name];
                  if (a === b) {return 0;}
                  if(typeof a === typeof b) {
                     return a < b ? 1 : -1;
                  }
                  return typeof a < typeof b ? 1 : -1;
              }
              else {
                throw ("error");
              }
            }
        }
        // util.log("排序前 ：  == "+this._rewardData["roomPlayerInfoModelList"][0].playerId);
        // util.log("排序前 ：  == "+this._rewardData["roomPlayerInfoModelList"][1].playerId);
        // util.log("排序前 ：  == "+this._rewardData["roomPlayerInfoModelList"][2].playerId);
        // util.log("排序前 ：  == "+this._rewardData["roomPlayerInfoModelList"][3].playerId);
        this._rewardData["roomPlayerInfoModelList"].sort(by("totoleScore"));
        // util.log("排序h ：  == "+this._rewardData["roomPlayerInfoModelList"][0].playerId);
        // util.log("排序h ：  == "+this._rewardData["roomPlayerInfoModelList"][1].playerId);
        // util.log("排序h ：  == "+this._rewardData["roomPlayerInfoModelList"][2].playerId);
        // util.log("排序h ：  == "+this._rewardData["roomPlayerInfoModelList"][3].playerId);
       
        //显示房主
        // util.log("房主ID ==  "+this._rewardData["ownerId"]);
        // util.log("其他id1 ==  "+this._rewardData["roomPlayerInfoModelList"][0].playerId);
        // util.log("其他id2 ==  "+this._rewardData["roomPlayerInfoModelList"][1].playerId);
        // util.log("其他id3 ==  "+this._rewardData["roomPlayerInfoModelList"][2].playerId);
        // util.log("其他id4 ==  "+this._rewardData["roomPlayerInfoModelList"][3].playerId);
        
        for(var j = 0;j<this._rewardData["roomPlayerInfoModelList"].length;j++){
            var itemNode = cc.find("mailList/view/content/leftItem"+parseInt(j+1),this.centerNode);
            itemNode.active = true;
            cc.find("person1/duiju",itemNode).getComponent(cc.Label).string = this._duijushu;
            cc.find("person1/name",itemNode).getComponent(cc.Label).string = this._rewardData["roomPlayerInfoModelList"][j].playerName;
            cc.find("person1/shengju",itemNode).getComponent(cc.Label).string = this._rewardData["roomPlayerInfoModelList"][j].totoleWinCount;
            cc.find("person1/leijiNum",itemNode).getComponent(cc.Label).string = this._rewardData["roomPlayerInfoModelList"][j].totoleScore;
            if(this._rewardData["ownerId"] == this._rewardData["roomPlayerInfoModelList"][j].playerId){
                cc.find("owner",itemNode).active = true;
            }else{
                cc.find("owner",itemNode).active = false;
            }
            sdk.getPlayerHead(this._rewardData["roomPlayerInfoModelList"][j].playerImg, cc.find("person1/defaultHead",itemNode), function (node) {
                node.active = true;
            })
        }
        
        
    },
    //初始化左边战绩流水界面
    initLeft:function(data){

        for(var i = 0; i < data.length; ++i ){
            var node = this.getLeftItem(i);
            cc.find("paimingditu/id",node).getComponent(cc.Label).string = i+1;
            cc.find("perNode/person1/name",node).getComponent(cc.Label).string = data[i]["playerName1"];
            cc.find("perNode/person2/name",node).getComponent(cc.Label).string = data[i]["playerName2"];
            cc.find("perNode/person3/name",node).getComponent(cc.Label).string = data[i]["playerName3"];
            if(this._rewardData.mapId == config.HENAN_PAODEKUAI){
                cc.find("perNode/person4/name",node).active = false;
            }else{
                cc.find("perNode/person4/name",node).active = true;
                cc.find("perNode/person4/name",node).getComponent(cc.Label).string = data[i]["playerName4"];
            }
            

            cc.find("perNode/person1/score",node).getComponent(cc.Label).string = data[i]["score1"];
            cc.find("perNode/person2/score",node).getComponent(cc.Label).string = data[i]["score2"];
            cc.find("perNode/person3/score",node).getComponent(cc.Label).string = data[i]["score3"];
            if(this._rewardData.mapId == config.HENAN_PAODEKUAI){
                cc.find("perNode/person4/score",node).active = false;
            }else{
                cc.find("perNode/person4/score",node).active = true;
                cc.find("perNode/person4/score",node).getComponent(cc.Label).string = data[i]["score4"];
            }
            


            
            let head1 = cc.find("perNode/person1/defaultHead",node);
            head1.runAction(
                cc.sequence(
                    cc.delayTime(i*1 + 2),
                    cc.callFunc(function () {
                        sdk.getPlayerHead(this._rewardData["playerImg1"], head1, function (node) {
                            node.active = true;
                            util.log("head111111111111  + i == "+i);
                        });
                    }, this)
                )
            );
            let head2 = cc.find("perNode/person2/defaultHead",node);
            head2.runAction(
                cc.sequence(
                    cc.delayTime(i*1 + 2),
                    cc.callFunc(function () {
                        sdk.getPlayerHead(this._rewardData["playerImg2"], head2, function (node) {
                            node.active = true;
                            util.log("head22222222222  + i == "+i);
                        });
                    }, this)
                )
            );
            let head3 = cc.find("perNode/person3/defaultHead",node);
            head3.runAction(
                cc.sequence(
                    cc.delayTime(i*1 + 2),
                    cc.callFunc(function () {
                        sdk.getPlayerHead(this._rewardData["playerImg3"], head3, function (node) {
                            node.active = true;
                            util.log("head3333333333333  + i == "+i);
                        });
                    }, this)
                )
            );
            let head4 = cc.find("perNode/person4/defaultHead",node);
            if(this._rewardData.mapId == config.HENAN_PAODEKUAI){
                cc.find("perNode/person4/touxiangkuang",node).active = false;
                head4.active = false;
            }else{
                cc.find("perNode/person4/touxiangkuang",node).active = true;
                head4.active = true;
                head4.runAction(
                    cc.sequence(
                        cc.delayTime(i*1 + 2),
                        cc.callFunc(function () {
                            sdk.getPlayerHead(this._rewardData["playerImg4"], head4, function (node) {
                                node.active = true;
                                util.log("head4444444444444  + i == "+i);
                            });
                        }, this)
                    )
                );
            }  
        }
    },
    getLeftItem:function(index){
        var leftContent = this._leftContent;
        if(leftContent.childrenCount > index){//已经添加过了
            return leftContent.children[index];
        }
        
        var node = cc.instantiate(this._leftItemTemp);
        leftContent.addChild(node);
        return node;
    },
    onBtnLeft:function(){
        audioUtils.playClickSoundEffect();
        this.isClick("left");  
    },
    onBtnCenter:function(){
        audioUtils.playClickSoundEffect();
        this.isClick("center");  
    },
    onBtnRight:function(){
        audioUtils.playClickSoundEffect();
        this.isClick("right"); 
    },
    isClick:function(str){
        this.btnLeft.active = str == "left"?true:false;
        this.btnLeft_1.active = str == "left"?false:true;
        this.leftNode.active = str == "left"?true:false;

        this.btnCenter.active = str == "center"?true:false;
        this.btnCenter_1.active = str == "center"?false:true;
        this.centerNode.active = str == "center"?true:false;

        this.btnRight.active = str == "right"?true:false;
        this.btnRight_1.active = str == "right"?false:true;
        this.rightNode.active = str == "right"?true:false;
    },
    onBtnClose:function(){
        audioUtils.playCloseSoundEffect();
        // this.node.removeFromParent(false);
        this.node.destroy();
    },
    start () {

    },

    // update (dt) {},
});
