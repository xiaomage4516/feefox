cc.Class({
    extends: cc.Component,

    properties: {
        leftBtnNum:2,
        rightNode: {
            default: [],
            type: cc.Node
        },
        leftBtnPic: {
            default: [],
            type: cc.SpriteFrame
        },
        time_content:{
            default: null,
            type: cc.Label
        },
        reward_gonggao:{
            default: null,
            type: cc.Label
        },
        reward_Data: null,
        shard_data:null,
        yaoqing_layout:{
            default: null,
            type: cc.Node
        },
        btn_lingqujiangli:cc.Button,
        btn_fenxiang:cc.Button,
        btn_lingqujiangli_hui:cc.Button,
        time_node:cc.Node,
        times_count_label:cc.Label,
        lingquAndShare:null,//既能领取又能分享
        times_count:0,

        centerNode:cc.Node,
        anim:cc.Animation,

    },
    setShareData: function (data) {
        this.shard_data = data;
    },
    onLoad: function () {
        //
        if(gameData.canvasWidth/gameData.canvasHeight<1.5){//按照平板4:3来处理
            this.centerNode.scale = 0.8;
        }else if(gameData.canvasWidth/gameData.canvasHeight<1.64){
            this.centerNode.scale = 0.85;
        } 
        //
        this.lingquAndShare = 0;

        this.playActivityAnim();

        var self = this;
            //左边
        this._leftContent = cc.find("centerNode/center/leftList/view/content",this.node);
        this._leftItemTemp = this._leftContent.children[0];
        this._leftContent.removeChild(this._leftItemTemp);

        this.initLeftBtnList();
        this.initRightBtnList();

        this.reward_Data = config.ShareAwardTabel;
        this.updateRewardNum();

        this.btn_lingqujiangli = this.yaoqing_layout.getChildByName("btn_lingqujiangli");
        this.btn_fenxiang = this.yaoqing_layout.getChildByName("btn_fenxiang");
        this.btn_lingqujiangli_hui = this.yaoqing_layout.getChildByName("btn_lingqujiangli_hui");


        this.initButtonHandler(this.btn_lingqujiangli);
        this.initButtonHandler(this.btn_fenxiang);

        this.setTimeShow();
        var msg = JSON.parse(this.shard_data["msg"]);
        if(msg != undefined){
            this.times_count = msg["residueCount"] *1;//剩余分享次数
            this.setShareCount(this.times_count <=0 ? 0 :this.times_count);
        }


        util.loadSprite("hall/activity/gonggaotu", cc.find("centerNode/center/inveteNode/gonggao_layout/gonggao", this.node));
        util.loadSprite("hall/activity/ditu", cc.find("centerNode/center/noticeNode/yaoqing_layout/show_active_sprite", this.node));
    },
    playActivityAnim:function(){
        this.anim.stop("activityAnim");
        this.anim.play("activityAnim");
    },
    //设置次数文本
    setShareCount:function(count){

        this.times_count_label.string =  count * 1;
    },
    initButtonHandler:function(btn){
        util.addClickEvent(btn,this.node,"activityLayer","onBtnClicked");
    },
    onBtnClicked:function(event){
        audioUtils.playClickSoundEffect();
        if(event.target.name === "btn_fenxiang"){
            this.onBtnFenXiang();
        }
        if(event.target.name === "btn_lingqujiangli"){
            this.onBtnLingQu();
        }
    },
    start: function () {

    },
    // 初始化左边列表
    initLeftBtnList:function(){
        this._nowSelLeftBtn = 0;
        for(var i = 0; i < this.leftBtnNum; ++i ){
            var node = this.getLeftItem(i);
            node.idx = i;
            node.setTag(i);
            //默认进来选中第一个
            if(i == this._nowSelLeftBtn){
                node.getChildByName("btn_left_0").active = true;
                node.getChildByName("btn_left_1").active = false;
            }else{
                node.getChildByName("btn_left_0").active = false;
                node.getChildByName("btn_left_1").active = true;
            }
             node.getChildByName("txt_image").getComponent(cc.Sprite).spriteFrame = this.leftBtnPic[i];

        }
    },
    // 初始化右边边列表
    initRightBtnList:function(){
        // 右边的界面 放在一个数组中
        this.rightNode[0].active = true;
        for(var i = 1; i < this.leftBtnNum; ++i ){
            this.rightNode[i].active = false;
        }
        
    },
    //添加左边按钮
    getLeftItem:function(index){
        var leftContent = this._leftContent;
        // util.log("左index1234 == " + index);
        util.log("leftContent.childrenCount == " + leftContent.childrenCount);
        if(leftContent.childrenCount > index){//已经添加过了
            return leftContent.children[index];
        }
        //没有就用prefabs添加(这里没有用prefabs添加)
        var node = cc.instantiate(this._leftItemTemp);
        leftContent.addChild(node);
        return node;
    },
    //左边按钮点击回调，设置点击按钮高亮
    onLeftItemClicked:function(event){
        audioUtils.playClickSoundEffect();
        var idx = event.target.idx;
        util.log("点击按钮的IDX  == " + idx);
        //设置所有按钮为正常状态
        for(var j = 0; j < this.leftBtnNum;++j){
            var node1 = this._leftContent.getChildByTag(j);
            node1.getChildByName("btn_left_1").active = true;
            node1.getChildByName("btn_left_0").active = false;
        };
        //设置点击的按钮为高亮状态
        event.target.getChildByName("btn_left_0").active = true;
        event.target.getChildByName("btn_left_1").active = false;

        //更换右边界面
        for(var i = 0; i < this.leftBtnNum; ++i ){
            this.rightNode[i].active = false;
        }
        this.rightNode[idx].active = true
    },
    //更新reward
    getRewardNum: function () {
        var reward = this.reward_Data["happyBeans"].split("_");//1000_1001_4000
        var reward_num = reward[2];
        var str = this.reward_gonggao.string;
        str = str.replace("XXX",reward_num);
        return str;
    },
    updateRewardNum: function () {
        this.reward_gonggao.string = this.getRewardNum();
    },
    //设置时间倒计时
    setTimeShow: function () {
        this.lingquAndShare = 0;
        var code = this.shard_data['code'];
        if(code != 0 && !code){
            return ;
        }
        var showTime = function () {
            var serverTotimeData = JSON.parse(this.shard_data["msg"]);

            var serverTotime = serverTotimeData["CDTime"] * 1 ;
            if(serverTotime == undefined){
                serverTotime = 0;
            }
            var cdTime = this.reward_Data["cdTime"]*1 *60;
            this.createTime(serverTotime,cdTime);
        }.bind(this);

        switch (code){
            case -1:  //-1		游戏玩家id为空
            case -4: //-4		没有找到该玩家
            case -200://-200		每日分享奖励配置表读取失败
                break;
            case -210://-210		每日分享奖励CD时间未到（无可领取奖励）
                this.setRewardBtn(2);
                showTime();
                break;
            case -220://-220今日领取上限
                //只显示分享，不显示领取
                //隐藏时间
                this.setRewardBtn(3);
                break;
            case -240://-240	CDTime	可领取奖励  距离下次分享有CD
                //显示时间倒计时
                this.setRewardBtn(4);
                showTime();
                break;
            case -250: //-250		既可以领取又可以分享
                this.setRewardBtn(1);
                this.lingquAndShare = 1;
                break;
            case 0://0		可以分享
                this.setRewardBtn(1);
                break;
        }
    },

    //调用
    createTime : function(serverTotime,cdTime){
        var that = this;
        util.createShortTime(that,serverTotime,cdTime, function (data) {

            var time_content = that.time_node.getChildByName("time_content");
            
            if(time_content){
                time_content.getComponent(cc.Label).string = data;
            }
            
            //倒计时结束设置立即分享

            that.setRewardBtn(1);

        }, function (data) {

            var time_content = that.time_node.getChildByName("time_content");

            if(time_content){
                time_content.getComponent(cc.Label).string = data;
            }
            

        });
    },
    //设置领奖按钮状态
    setRewardBtn: function (state) {
     if(state == 0){//只显示领取，不显示倒计时

         this.btn_lingqujiangli.active = true;
         this.btn_fenxiang.active = false;
         this.btn_lingqujiangli_hui.active =false;
         this.time_node.active = false;

     }else if(state == 1){//显示立即分享，隐藏倒计时

         this.btn_lingqujiangli.active = false;
         this.btn_fenxiang.active = true;
         this.btn_lingqujiangli_hui.active =false;
         this.time_node.active = false;

     }else if(state == 2){//领取奖励按钮置灰，显示倒计时
         this.btn_lingqujiangli.active = false;
         this.btn_fenxiang.active = false;
         this.btn_lingqujiangli_hui.active =true;
         this.time_node.active = true;
     }else if(state == 3){//全部置灰
         this.btn_lingqujiangli.active = false;
         this.btn_fenxiang.active = true;
         this.btn_lingqujiangli_hui.active =false;
         this.time_node.active = false;
     }else if(state == 4){//显示领取按钮，显示倒计时
         this.btn_lingqujiangli.active = true;
         this.btn_fenxiang.active = false;
         this.btn_lingqujiangli_hui.active =false;
         this.time_node.active = true;
     }

    },
    //领取奖励
    onBtnLingQu: function () {
        var that = this;
        util.getShareReward(function (respJsonInfo) {
            if(respJsonInfo["code"] == 0){
                console.log("active award:",respJsonInfo);
                var msg =  JSON.parse(respJsonInfo["msg"]);

                gameData.gameBean = msg["playerMoney"]["happyBeans"];
                if(gameData.hallNode){
                    gameData.hallNode.emit('setPlayerInfo');
                }
                //请求刷新红点
                that.scheduleOnce(function() {

                    util.refreshAllRedStatus();

                }, 0.6);                

                util.loadPrefab("gongxihuode",function(data){

                    var gongxihuode_node = cc.instantiate(data);

                    that.node.addChild(gongxihuode_node);

                    var arr_reward = config.ShareAwardTabel["happyBeans"];

                    gongxihuode_node.getComponent("gongxihuode").setRewardData(arr_reward);

                    that.setRewardBtn(2);

                });

            }else if(respJsonInfo["code"] == -260){
                util.tip3(this.node,"奖励次数已上限！");
            }
        });


    },
    //立即分享
    onBtnFenXiang: function () {
        sdk.shareURl();
        var that = this;
        util.getShareAdd(function (respJsonInfo) {
            if(respJsonInfo["code"] == 0){

                //请求刷新红点
                
                that.scheduleOnce(function() {

                    util.refreshAllRedStatus(); 

                }, 0.6);
                //刷新任务
                that.node.parent.emit('taskProgressDataUpdate');//

                if(that.lingquAndShare == 1)
                    return;

                var cdTime = that.reward_Data["cdTime"]*1 * 60;
                var serverTotime = 0;
                that.createTime(serverTotime,cdTime);
                util.log("hunter---显示领取奖励按钮111");
                that.setRewardBtn(4);
                util.log("hunter---显示领取奖励按钮222");

                that.times_count--;

                if(that.times_count<=0){

                    that.times_count = 0;

                }
                that.setShareCount(that.times_count);
            }else if(respJsonInfo["code"] = -210){//每日分享奖励CD时间未到（新增失败）
                util.tip3(that.node,"每日分享奖励冷却时间未到");
            }else if(respJsonInfo["code"] = -220){//今日领取上限
                util.tip3(that.node,"今日分享次数达到上限");
            }

        });

    },
    onBtnClose:function(){
        audioUtils.playCloseSoundEffect();
        this.node.destroy();
    },

    // update (dt) {},
});
