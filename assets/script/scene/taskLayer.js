
var taskTabel = {};
var rewardTabel ={};
cc.Class({
    extends: cc.Component,

    properties: {
        renwuLayer:cc.Node,
        task_data : null,
        TotalTaskData:null,
        taskItem:{
            default:null,
            type:cc.Prefab
        },
        taskContent:null,
        anim:cc.Animation,
        shipeiCenterNode:cc.Node,
    },

    onLoad:function(){
        //
        if(gameData.canvasWidth/gameData.canvasHeight<1.5){//按照平板4:3来处理
            this.shipeiCenterNode.scale = 0.8;
        }else if(gameData.canvasWidth/gameData.canvasHeight<1.64){
            this.shipeiCenterNode.scale = 0.85;
        } 
        //
        //重置表结构
        for(var i = 0 ;i < config.taskTabel.length ;i++) {
             taskTabel[i+1]= config.taskTabel[i];

        }
        for(var i = 0;i < config.rewardTabel.length ;i++) {
            rewardTabel[config.rewardTabel[i].id]= config.rewardTabel[i];
        }
        this.taskContent = cc.find("centerNode/center/taskList/view/content",this.node);

        this.node.on("taskProgressDataUpdate", this.onDataUpdateRefreshUI, this);

        this.node.active = false;//will not call start function
        this.playTaskAnim();
    },
    playTaskAnim:function(){
        this.anim.stop("taskAnim");
        this.anim.play("taskAnim");
    },
    onDestroy:function () {
        this.node.off("taskProgressDataUpdate", this.onDataUpdateRefreshUI, this);
    },
    
    onDataUpdateRefreshUI:function (event) {

        util.log("onDataUpdateRefreshUI");
        var self = this;
        util.getTaskStatus(
            function(respJsonInfo){
                if(respJsonInfo["code"] == "0"){
                    //util.log("任务成功 +=== "+ respJsonInfo['msg']);
                    var msg = JSON.parse(respJsonInfo['msg']);
                    util.log("task  === "+ msg);

                    if (self.taskContent && self.taskContent.children.length > 0) {

                        self.taskContent.removeAllChildren();
                    }

                    self.setTaskData(msg);

                } else {
                    util.log("getTaskStatus error code:"+respJsonInfo["code"]);
                }
            },
            null,
            null
        );

    },

    //任务类型筛选 指定显示任务条目
    siftTaskList: function (task_data) {

        var taskData = task_data["queryPlayerAllTask"];
        var typeShareCountTargetId = task_data.typeShareCountTargetId;
        var typeWinCountTargetId = task_data.typeWinCountTargetId;
        var typeConsumeDiamondCountTargetId = task_data.typeConsumeDiamondCountTargetId;
        var typeTotalCountTargetId = task_data.typeTotalCountTargetId;
        var queryPlayerAllTask = {};

        var msg_arr = [];
        var mytypeTotalCountTargetId,mytypeWinCountTargetId,mytypeConsumeDiamondCountTargetId,mytypeShareCountTargetId;
        if(taskData.length > 0){
            var data = this.filterTaskData(taskData,1,mytypeTotalCountTargetId,typeTotalCountTargetId);
            msg_arr.push(data);
            var data = this.filterTaskData(taskData,2,mytypeWinCountTargetId,typeWinCountTargetId);
            msg_arr.push(data);
            var data =this.filterTaskData(taskData,3,mytypeConsumeDiamondCountTargetId,typeConsumeDiamondCountTargetId);
            msg_arr.push(data);
            var data = this.filterTaskData(taskData,4,mytypeShareCountTargetId,typeShareCountTargetId);
            msg_arr.push(data);
        }

        return msg_arr;

    },
    //
    filterTaskData:function(taskData,task_type,myCountTargetId,typeCountTargetId){
         for(var i=0;i < taskData.length; i++) {
                //var data = ;
                if(taskData[i].task_type == task_type){
                    //判断取第几条
                    if(taskData[i].taskStatus == 1) {
                        myCountTargetId = taskData[i].taskId;
                        if (myCountTargetId <= typeCountTargetId * 1) {

                            return taskData[i];

                            break;
                        }
                    }else if(typeCountTargetId == taskData[i].taskId){
                            return taskData[i];
                            break;
                        }

                }
            }
    },
    onBtnClose:function(){
        audioUtils.playCloseSoundEffect();
        this.node.destroy();
    },
    onBtnSwallow:function(){
        
    },

    start:function() {
        /**
         * onLoad后active true才触发start
         * */

    },
    setTaskData:function(data){
        this.TotalTaskData = data;
        this.task_data = this.siftTaskList(this.TotalTaskData);
        this.initTaskList();
    },
    initTaskList: function () {

        if(this.task_data){
            this.sortTask();
          if(this.task_data.length > 0){
              for(var i=0;i < this.task_data.length; i++){

                  var node = this.taskPrefab(this.task_data[i],i);

                  this.updateTaskDes(node,i);

                  this.updateTaskIcon(node,i);

                  var total_value = this.getTaskInfoFromTaskId(this.task_data[i].taskId).task_parameter;

                  this.updateTaskProgress(node,this.task_data[i].taskCount,total_value  * 1);

                  this.updateTaskBtn(node,this.task_data[i].taskStatus);

                  this.taskContent.addChild(node,i);
              }
          }
        }
    },
    //查找下条任务id
    getNextTaskId: function (cur_task_id) {
        var task_data = this.getTaskInfoFromTaskId(cur_task_id);
        if(task_data.next_id != cur_task_id && task_data.next_id == 0){//当前任务就是最后一条
            return  cur_task_id ;
        }else if(task_data.next_id != cur_task_id && task_data.next_id != 0){//下一条任务
            return task_data.next_id;
        }
    },
    //查找下条任务数据
    getTaskData: function (task_id) {
        var taskData = this.TotalTaskData["queryPlayerAllTask"];
        if(taskData.length > 0){
            for(var i=0;i < taskData.length; i++){
               if(task_id*1 == taskData[i].taskId*1){
                     return taskData[i];
               }
            }
        }
    },
    //任务排序 0 未完成 1 可领取 2 已完成
    sortTask: function (data) {
        if(!data){
            data = this.task_data;
        }
        data.sort(function (a,b) {
           if(a.taskStatus == 2 || b.taskStatus == 2){
               return a.taskStatus*1 - b.taskStatus*1;
           }
          return b.taskStatus*1 - a.taskStatus*1;
        });

    },
    //取得指定Item预制物
    taskPrefab: function (data,i) {

        var taskNode = cc.instantiate(this.taskItem);

        taskNode.idx = i;

        this.btn_lingqu = taskNode.getChildByName("btn_lingqu");

        this.btnHandler(this.btn_lingqu);

        this.btn_quwancheng = taskNode.getChildByName("btn_quwancheng");

        this.btnHandler(this.btn_quwancheng);

        return taskNode;
    },
    btnHandler:function(btn){
        util.addClickEvent(btn,this.node,"taskLayer","onBtnClicked");
    },
    onBtnClicked:function(event){
        audioUtils.playClickSoundEffect();
        var sceneName = cc.director.getScene().name;
        var isInGaming = false;
        if (sceneName == "game") {
            isInGaming = true;
        }

        if(event.target.name == "btn_quwancheng"){
            var index =  event.target.parent.idx;
            var task_type = this.task_data[index].task_type * 1;
            var self = this;

            if (task_type == 1 || task_type == 2) {
                if (isInGaming) {

                    // util.tip(this.node, 2, "正在游戏打牌中！上碰下自摸，先打北不后悔再打南不输钱。",
                    //     null, null, null, false, true, false);
                    util.tip({
                        node : this.node,
                        type : 2,
                        string : "正在游戏打牌中！上碰下自摸，先打北不后悔再打南不输钱。",
                        leftCallback : null,
                        centerCallback : null,
                        rightCallback : null,
                        isShowLeftBtn : false,
                        isShowCenterBtn : true,
                        isShowRightBtn : false
                    });
                    return;
                }
            }

            switch (task_type){
                case 1:{
                    gameData.mapId = config.HENAN_TUIDAOHU;
                    util.loadPrefab("moreField",function(data){
                        if(util.isNodeExist(self.node,"moreField")){
                            return;
                        }
                        var moreField = cc.instantiate(data);
                        moreField.getComponent("moreFieldLayer").initScene(gameData.mapId);
                        moreField.setName("moreField");
                        self.node.addChild(moreField);
                    });
                }
                    break;
                case 2:{
                    gameData.mapId = config.HENAN_TUIDAOHU;
                    util.loadPrefab("moreField",function(data){
                        if(util.isNodeExist(self.node,"moreField")){
                            return;
                        }
                        var moreField = cc.instantiate(data);
                        moreField.getComponent("moreFieldLayer").initScene(gameData.mapId);
                        moreField.setName("moreField");
                        self.node.addChild(moreField);
                    });
                }
                    break;
                case 3:{
                    var self = this;
                    util.loadPrefab("shopLayer",function(data){
                        if(util.isNodeExist(self.node,"shopLayer")){
                            return;
                        }
                        var shopLayer = cc.instantiate(data);
                        shopLayer.getComponent("shopLayer").setfirstLayer("bean");
                        shopLayer.setName("shopLayer");
                        self.node.addChild(shopLayer);
                    });
                }
                    break;
                case 4:{
                    var self = this;
                    util.loadPrefab("activityLayer",function(data){
                        var activityLayer = cc.instantiate(data);

                        util.getShareStatus(function (respJsonInfo) {
                            if(respJsonInfo["code"] == 0){
                                if(util.isNodeExist(self.node,"activityLayer")){
                                    return;
                                }
                                util.log("getShareStatus:"+respJsonInfo["code"]);
                                
                                activityLayer.getComponent("activityLayer").setShareData(respJsonInfo);
                                activityLayer.setName("activityLayer");
                                self.node.addChild(activityLayer);
                            }else{
                                util.log("getShareStatus-0---:"+respJsonInfo["code"]);
                            }
                        });

                    });
                }
                    break;
            }


        }else if(event.target.name == "btn_lingqu"){
            var self = this;
            var index =  event.target.parent.idx;
            var taskId = this.task_data[index].taskId;
            var taskOnlyId = this.task_data[index].taskOnlyId;

            util.getTaskRewardStatus(taskId,taskOnlyId, function (respJsonInfo) {
                if(respJsonInfo["code"] == "0"){
                    console.log("领取奖励", respJsonInfo['msg']);

                    var reward_data = JSON.parse(respJsonInfo['msg']);
                    var award = reward_data['resultAward'];
                    var task = reward_data['resultTask'];
                    var playerMoney = reward_data['playerMoney'];
                    //
                    //TODO 领取货币增加的动画
                    if (playerMoney) {

                        gameData.gameBean = playerMoney["happyBeans"];
                        gameData.gameDiamond = playerMoney["diamond"];
                        self.node.parent.emit('setPlayerInfo');
                    }
                    //

                    var nextId =self.getNextTaskId(task["taskId"]);
                    var next_data = self.getTaskData(nextId);

                    util.loadPrefab("gongxihuode",function(data){
                        var task_node = cc.instantiate(data);
                        self.node.addChild(task_node);
                        task_node.getComponent("gongxihuode").setRewardData(award);
                        next_data.taskCount = task.taskCount;
                        if(next_data.taskId == task["taskId"]){
                            ////0 今日未完成未领取 1 今日已完成可领取 2 今日已完成并且已领取
                            next_data.taskStatus = 2;
                        }else {
                            //next_data.taskStatus = next_data.taskStatus;
                        }

                        console.log("next_data",next_data);
                        self.refreshTaskItem(next_data,index);
                        self.refreshTaskRed();

                    });

                }else{
                    util.log("getTaskRewardStatus:"+respJsonInfo["code"]);
                }

            });
        }
    },
    //返回指定item
    getTaskItemFromIndex: function (index) {
        var mailContent = this.taskContent;
        if(mailContent){
            return mailContent.children[index];
        }
    },
    //任务描述
    updateTaskDes: function (node,index,data) {
        if(node){

            if(!data){
                data = this.task_data[index];
            }
            var _data = this.getTaskInfoFromTaskId(data.taskId);
            node.getChildByName("task_des").getComponent(cc.Label).string = String(_data.task_describe);//任务描述
            node.getChildByName("task_reward_des").getComponent(cc.Label).string = String(_data.task_reward_des);//任务描述

        }

    },
    //任务图标显示
    updateTaskIcon: function (node,index,data) {
        if (node) {
            if (!data) {
                data = this.task_data[index];
            }
            var _data = this.getTaskInfoFromTaskId(data.taskId);
            var task_icon = node.getChildByName("task_icon").getComponent(cc.Sprite);
            util.loadSprite("hall/sign/jinbi/" + _data.task_icon, task_icon);

        }
        
    },
    //任务进度
    updateTaskProgress: function (node,count,total) {

       var progress_node = node.getChildByName("progress_node").getChildByName("task_jindu").getComponent(cc.ProgressBar);
       if(!progress_node){
           console.log("progress not:",progress_node);
           return;
        }
        count = count*1;
        total = total*1;

        var percentage = (count / total) * 1;
        if(percentage >= 1){
            percentage = 1;
        }

        progress_node.progress = percentage;

        node.getChildByName("prrgress_value").getComponent(cc.Label).string = count +"/"+ total;

    },
    //任务按钮状态
    updateTaskBtn: function (node,state) {

        if(node){

            if(state== 0){//显示查看

                node.getChildByName("btn_quwancheng").active = true;
                node.getChildByName("btn_lingqu").active = false;

            }else if(state == 1){
                node.getChildByName("btn_quwancheng").active = false;
                node.getChildByName("btn_lingqu").active = true;

            }else if(state == 2){

                node.getChildByName("btn_quwancheng").active = false;
                node.getChildByName("btn_lingqu").active = false;
                node.getChildByName("yiwancheng").active = true;
            }
        }
    },
    //获取Task表每条数据
    getTaskInfoFromTaskId: function (task_id) {
        //加载任务表
        if(!taskTabel){
          console.log("taskTabel not exist");
            return;
        }
        for(var key in taskTabel){
            var task_data = taskTabel[key];
            if(task_data.id == task_id){
                return task_data;
            }

        }
    },
    //获取Reward表每条数据
    getTaskRwardInfoFromId: function (reward_id) {

        if(!rewardTabel){
            console.log("rewardTabel not exist");
            return;
        }
        for(var key in rewardTabel){
            var task_reward_data = rewardTabel[key];
            if(task_reward_data.id == reward_id){
                return task_reward_data;
            }
        }
    },
    //已完成时刷新列表
    refreshTaskItem: function (data,index) {
        var node = this.getTaskItemFromIndex(index);

        if(!node){
           console.log("task item not exist!!");
           return;
        }
        this.task_data[index] = data;
        this.updateTaskDes(node,index,data);
        this.updateTaskIcon(node,index,data);
        this.updateTaskProgress(node,data.taskCount,this.getTaskInfoFromTaskId(data.taskId).task_parameter);
        this.updateTaskBtn(node,data.taskStatus);

        if(this.task_data[index].taskStatus == 2){//完成了刷新任务表
            if(this.taskContent.children.length > 0){
                this.taskContent.removeAllChildren();
                this.initTaskList();
            }

       }
    },

    onBtnReceive:function(){
        audioUtils.playClickSoundEffect();
        var that = this;
        util.getReceiveMailStatus();
    },

    // 游戏界面不需要显示背景图，只显示阴影
    setBg : function (type) {
        if (type === 1) {
            // 显示模糊背景
            // this.node.getChildByName("ditu").active = true;
            this.node.getChildByName("colorBg").active = true;
        }
        else if (type === 2) {
            // 显示阴影
            // this.node.getChildByName("ditu").active = false;
            this.node.getChildByName("colorBg").active = true;
        }
        
        this.node.active = true;
    
    },
    //刷新任务红点
    refreshTaskRed: function () {

        util.log("refreshRed"+JSON.stringify(this.task_data));
        for(var key in this.task_data){
            var data = this.task_data[key];
            if(data.taskStatus == 1 ){//其中一个是0 显示红点
                gameData.isTipTask = 1;
                if(gameData.hallNode){
                    gameData.hallNode.emit('setPlayerInfo');
                }
                break;
            }else {//隐藏红点
                gameData.isTipTask = 0;
                if(gameData.hallNode){
                    gameData.hallNode.emit('setPlayerInfo');
                }

            }
        }
    },
});
