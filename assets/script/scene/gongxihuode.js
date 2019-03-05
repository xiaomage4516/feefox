//使用方法  加载这个gongxihuode预制物后调用setRewardData(parameter),parameter例子("1000_1001_100"); 1000:代表货币走货币表 1001：货币id 100：个数
cc.Class({
    extends: cc.Component,

    properties: {
        reward_point:{
            default:[],
            type: cc.Node
        },
        daoju_model:{
            default:null,
            type: cc.Prefab
        },
    },

    onLoad:function () {

    },

    start: function() {

    },
    setRewardData: function (arr_reward) {
        if(!arr_reward){
            return;
        }
        if(arr_reward){
            var _reward = arr_reward.split("|");
            for(var i= 0; i < _reward.length; i++) {
                var obj = _reward[i].split("_");//"2000_2_1"2000代表读取道具表 2第二条 1个数
                var reward_type = obj[0];//奖励类型
                var reward_id = obj[1];//奖励id
                var rewardNum = obj[2];//奖励num
                var rewardData = {};
                reward_id = reward_id < 0 ? 1 : reward_id;
                if (reward_type == 2000) {//读取消耗品表
                    rewardData[reward_id] = config.getPropModelInfoByPropId(reward_id);

                } else if (reward_type == 1000) {//读取货币表
                    rewardData[reward_id] = config.getRewardTabelItemById(reward_id);

                }

                var node = cc.instantiate(this.daoju_model);
                if (_reward.length <= 1) {
                    node.setPosition(cc.p(i * 170, node.getPosition().y));

                } else {
                    node.setPosition(cc.p(-140 + i * 170, node.getPosition().y));
                }

                if (rewardNum * 1 <= 1) {

                    var reward_name = node.getChildByName("reward_name");
                    reward_name.setPosition(cc.p(reward_name.getPosition().x, reward_name.getPosition().y - 2));
                }

                var spr_node = node.getChildByName("reward_tu").getComponent(cc.Sprite);

                if (reward_type == 2000) {

                    var reward_name =  node.getChildByName("reward_name");

                    reward_name.getComponent(cc.Label).string = rewardData[reward_id].prop_name + " X"+ rewardNum;

                    util.loadSprite("hall/bag/prop/" + rewardData[reward_id].prop_img, spr_node);

                } else if (reward_type == 1000) {

                    node.getChildByName("reward_name").getComponent(cc.Label).string = rewardData[reward_id].awards_dec + " X"+rewardNum;

                    if (reward_id == 1001) {//豆子

                        util.loadSprite("hall/shop/bean/" + rewardData[reward_id].icon_name, spr_node);

                    } else if (reward_id == 1002) {//钻石

                        util.loadSprite("hall/shop/zuan/" + rewardData[reward_id].icon_name, spr_node);

                    }

                }

                this.node.addChild(node);

            }

        }

    },
    getTaskRwardInfoFromId: function (reward_id) {

        if(!this.rewardTabel){
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
    onBtnClose: function () {
        audioUtils.playClickSoundEffect();
        this.node.destroy();
    },

});
