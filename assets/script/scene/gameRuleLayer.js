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
        basicRuleTxt:cc.Label,
        pettyRuleTxt:cc.Label,

        _ziwanfaData:null,
        _ruleData:null,

        _editTxt1:null,
        _editTxt2:null,
        _editTxt3:null,

        editBox1:cc.EditBox,
        editBox2:cc.EditBox,
        editBox3:cc.EditBox,

        toggle1:cc.Toggle,
        toggle2:cc.Toggle,
        toggle3:cc.Toggle,
        toggle4:cc.Toggle,
        toggle5:cc.Toggle,  

        _level : null,
        _mapId : null,
    },

    initScene:function (id,ziid,level,mapId) {
        util.log("id =====  "+ id);
        util.log("ziid =====  "+ ziid);

        this._level = level;
        this._mapId = mapId;

        var self = this;
        var doGetGc = function(data) {

            self._ziwanfaData = data[id-1]["ziwanfa"];
            for(var i = 0;i<self._ziwanfaData.length;i++){
                if(self._ziwanfaData[i].ziid == ziid){
                    self._ruleData = self._ziwanfaData[i];
                }
            }
            util.log("1234 ====  "+self._ruleData.name);
            //右边数据
            //默认右边显示第一个玩法的数据
            // util.log("右边按钮数量 ： " + data[0]["ziwanfa"].length);
            // util.log( data[0]["ziwanfa"] );
            // self._rightBtnData = data[0]["ziwanfa"];
            // util.log("右边按钮数量1 ： " + self._rightBtnData.length);

            // if(self._rightBtnData.length == 0){
            //     self._rightContent.setVisible(false);
            // }
            // self._nowClickBtnId = 0;//默认点击的左边按钮ID为0
            // self.initRightList(self._rightBtnData);
            self.isClick("left");
            self.initLeft();
            self.initCenter();
            self.initRight();
        };
        if (config.gamechoiceData) {
            doGetGc(config.gamechoiceData);
        }else{
            //进入界面初始化设置左边按钮数据 ， 和右边按钮数据（默认第一个玩法的），点击按钮后更新右边数据
            util.loadJsonFile("json/Gamechoice_Common", function (data) {
                config.gamechoiceData = data;
                if (config.gamechoiceData) {
                    doGetGc(config.gamechoiceData);
                    //
                }
            });
        }
        


    },
    
    //初始化右边 房间玩法界面
    initRight:function(){
        this.toggle1.isChecked = false;
        this.toggle2.isChecked = false;
        this.toggle3.isChecked = false;
        this.toggle4.isChecked = false;
        this.toggle5.isChecked = false;
    },
    //初始化中间 总分排名界面
    initCenter:function(){
        this.pettyRuleTxt.string = this._ruleData["des3"];
    },
    //初始化左边战绩流水界面
    initLeft:function(){
        this.basicRuleTxt.string = this._ruleData["des2"];
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
    //提交
    onBtnSubmit:function(){
        audioUtils.playClickSoundEffect();
        util.log("111   ===  "+ this._editTxt1);
        util.log("222   ===  "+ this._editTxt2);
        util.log("333   ===  "+ this._editTxt3);
        var key1 = "";
        var key2 = "";
        var key3 = "";
        var key4 = "";
        var key5 = "";
        if(this.toggle1.isChecked){
            if(this._editTxt1 == ""){//勾选但是没有输入文字
                key1 += "和我了解的玩法不同";
            }else{
                key1 += this._editTxt1;
            }
        }

        if(this.toggle2.isChecked){
            if(this._editTxt2 == ""){//勾选但是没有输入文字
                key2 += "有BUG";
            }else{
                key2 += this._editTxt2;
            }
        }

        if(this.toggle3.isChecked){
            key3 += "不会玩";
        }

        if(this.toggle4.isChecked){
            key4 += "底分太低不过瘾";
        }

        if(this.toggle5.isChecked){
            if(this._editTxt3 == ""){//勾选但是没有输入文字
                key5 += "其他";
            }else{
                key5 += this._editTxt3;
            }
        }


        var self = this;
        // util.log("self.level   ==  "+ self.level);
        // util.log("self.mapId   ==  "+ self.mapId);
        util.getSubmitStatus(
            key1,
            key2,
            key3,
            key4,
            key5,
            self._level,
            self._mapId,
            function(respJsonInfo){
                if(respJsonInfo["code"] == "0"){//可领取状态
                    util.tip({
                        node : self.node,
                        type : 2,
                        string : "提交成功",
                        leftCallback : null,
                        centerCallback : null,
                        rightCallback : null,
                        isShowLeftBtn : false,
                        isShowCenterBtn : true,
                        isShowRightBtn : false,
                    });
                    self.toggle1.isChecked = false;
                    self.toggle2.isChecked = false;
                    self.toggle3.isChecked = false;
                    self.toggle4.isChecked = false;
                    self.toggle5.isChecked = false;
                    self.editBox1.string = "";
                    self.editBox2.string = "";
                    self.editBox3.string = "";
                    self.editBox1.placeholder = "在此输入意见...（100字以内）";
                    self.editBox2.placeholder = "在此输入意见...（100字以内）";
                    self.editBox3.placeholder = "在此输入意见...（100字以内）";
                    
                    
                }
            },
        null,null);
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
    onBtnEditBegin1(){
        this.editBox1.placeholder = "";
    },
    onBtnEditChange1(text){
        if(text == ""){
            this.editBox1.placeholder = "在此输入意见...（100字以内）";
            this.toggle1.isChecked =false;
        }else{
            this.toggle1.isChecked = true;
        }
        util.log("ppppppp   ===  "+text);
        this._editTxt1 = text;
    },
    onBtnEditEnd1(){
        if(this.editBox1.string == ""){
            this.editBox1.placeholder = "在此输入意见...（100字以内）";
        }
    },
    onBtnEditRuturn1(){
        if(this.editBox1.string == ""){
            this.editBox1.placeholder = "在此输入意见...（100字以内）";
            this.toggle1.isChecked =false;
        }else{
            this.toggle1.isChecked = true;
        }
        util.log("ppppppp   ===  "+this.editBox1.string);
        this._editTxt1 = this.editBox1.string;
    },
    onBtnEditBegin2(){
        this.editBox2.placeholder = "";
    },
    onBtnEditChange2(text){
        if(text == ""){
            this.editBox2.placeholder = "在此输入意见...（100字以内）";
            this.toggle2.isChecked =false;
        }else{
            this.toggle2.isChecked = true;
        }
        util.log("ppppppp   ===  "+text);
        this._editTxt2 = text;
    },
    onBtnEditEnd2(){
        if(this.editBox2.string == ""){
            this.editBox2.placeholder = "在此输入意见...（100字以内）";
        }
    },
    onBtnEditRuturn2(){
        if(this.editBox2.string == ""){
            this.editBox2.placeholder = "在此输入意见...（100字以内）";
            this.toggle2.isChecked =false;
        }else{
            this.toggle2.isChecked = true;
        }
        util.log("ppppppp   ===  "+this.editBox2.string);
        this._editTxt2 = this.editBox2.string;
    },
    onBtnEditBegin3(){
        this.editBox3.placeholder = "";
    },
    onBtnEditChange3(text){
        if(text == ""){
            this.editBox3.placeholder = "在此输入意见...（100字以内）";
            this.toggle5.isChecked =false;
        }else{
            this.toggle5.isChecked = true;
        }
        util.log("ppppppp   ===  "+text);
        this._editTxt3 = text;
    },
    onBtnEditEnd3(){
        if(this.editBox3.string == ""){
            this.editBox3.placeholder = "在此输入意见...（100字以内）";
        }
    },
    onBtnEditRuturn3(){
        if(this.editBox3.string == ""){
            this.editBox3.placeholder = "在此输入意见...（100字以内）";
            this.toggle3.isChecked =false;
        }else{
            this.toggle3.isChecked = true;
        }
        util.log("ppppppp   ===  "+this.editBox3.string);
        this._editTxt3 = this.editBox3.string;
    },
    start () {

    },

    // update (dt) {},
});
