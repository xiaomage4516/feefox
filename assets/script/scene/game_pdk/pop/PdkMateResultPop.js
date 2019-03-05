// 匹配   跑得快 ，小结算

cc.Class({
    extends: cc.Component,

    properties: {
        game : null,
        lastRoomId : null,//上一局的roomId
    },

    start () {

    },

    setGame (game) {
        this.game = game;
    },

    onBtnLeave (event, custom) {
        audioUtils.playClickSoundEffect();
        this.game.setBackBtn(true);
        if (this.game) {
            // this.game.backToHall();
            network.send(2201, {
                playerId: gameData.uid,
                mapId: gameData.mapId,//玩法ID 现在只做了两个，暂时写死
                piLevel: gameData.mateLevel,
                gameKind : config.KIND_MATE,
                app_id : gameData.appId,
                restart : true,
                roomId : this.lastRoomId
            });

        }
    },

    onBtnNext (event, custom) {
        audioUtils.playClickSoundEffect();
        // 匹配，下一局，初始化游戏
        util.log("111112gameData.roomId  ==  "+gameData.roomId);
        
        this.game.setBackBtn(false);
        if (this.game) {
            // network.send(2201, {
            //     playerId: gameData.uid,
            //     mapId: gameData.mapId,//玩法ID 现在只做了两个，暂时写死
            //     piLevel: gameData.mateLevel,
            //     gameKind : config.KIND_MATE,
            //     app_id : gameData.appId,
            //     restart : true,
            //     roomId : gameData.roomId
            // });
            network.send(2205, {  //继续下一局 
                playerId: gameData.uid,
                mapId: gameData.mapId,//玩法ID 现在只做了两个，暂时写死
                piLevel: gameData.mateLevel,
                gameKind : config.KIND_MATE,
                app_id : gameData.appId,
                restart : false,
                roomId : this.lastRoomId
            });

        }
    },

    onBtnBack (event, custom) {
        audioUtils.playClickSoundEffect();
        this.game.setBackBtn(true);
        // 好友，下一局，隐藏弹窗
        if (this.game) {
            this.game.setMateResultPop();
            cc.find("button/center/next", this.game.node).active = false;
        }
    },
    playXiaYuAnim(){
        util.log("xiayu-------------");
        audioUtils.playSFX("resources/sound/PdkGame/effect/lose.mp3");
        let xiayuNode = cc.find("popBg/loseNode/xiayuNode", this.node);

        let anim = xiayuNode.getChildByName("anim");
        util.loadGameAnim("pdkGame/anim/xiayu", function (data) {
            anim.active = true; 
            // anim.scaleX = 2;
            // anim.scaleY = 2;
            anim.getComponent(cc.Animation).addClip(data);
            anim.getComponent(cc.Animation).play("xiayu");
        });
        // anim.active = true;
        // anim.getComponent(cc.Animation).play("xiayu");
        xiayuNode.active = true;
    },
    playStarAnim(){
        util.log("star-------------");
        audioUtils.playSFX("resources/sound/PdkGame/effect/win.mp3");
        let starNode = cc.find("popBg/winNode/starNode", this.node);

        let anim = starNode.getChildByName("anim");
        util.loadGameAnim("pdkGame/anim/star", function (data) {
            anim.active = true; 
            // anim.scaleX = 2;
            // anim.scaleY = 2;
            anim.getComponent(cc.Animation).addClip(data);
            anim.getComponent(cc.Animation).play("star");
        });
        // anim.active = true;
        // anim.getComponent(cc.Animation).play("star");
        starNode.active = true;
    },

    refresh (data) {
        this.lastRoomId = gameData.roomId;

        for (let i = 0; i < data.players.length; i++) {
            let playerData = data.players[i];
            util.log("匹配uid == "+playerData.uid);
            let index = this.game.pos[playerData.uid];
            if(index == 0){
                util.log("index == 0         111111");
                util.log("playerData.score == "+playerData.score);
                if(playerData.score > 0){
                    cc.find("popBg/loseNode", this.node).active = false;
                    cc.find("popBg/winNode", this.node).active = true;
                    this.playStarAnim();
                    cc.find("popBg/winNode/number",this.node).getComponent(cc.Label).string = Math.abs(playerData.score).toString();
                    cc.find("popBg/winNode/yingpaiNum", this.node).getComponent(cc.Label).string = playerData.resultPaiNum;
                    if(index == 0){
                        if(playerData.fangfei == undefined || playerData.fangfei == 0){
                            cc.find("popBg/winNode/fangfei", this.node).active = false;
                        }else{
                            cc.find("popBg/winNode/fangfei", this.node).active = true;
                            cc.find("popBg/winNode/fangfei/label", this.node).getComponent(cc.Label).string = "-" + Math.abs(playerData.fangfei);
                        }
                    }
                }else{
                    cc.find("popBg/loseNode", this.node).active = true;
                    cc.find("popBg/winNode", this.node).active = false;
                    this.playXiaYuAnim();
                    cc.find("popBg/loseNode/number",this.node).getComponent(cc.Label).string = Math.abs(playerData.score).toString();
                    cc.find("popBg/loseNode/yingpaiNum", this.node).getComponent(cc.Label).string = playerData.resultPaiNum;
                }
                if(playerData.leftPaiNum == 0){//显示输牌还是赢牌
                    //赢牌
                    cc.find("popBg/shupaiTxt",this.node).getComponent(cc.Label).string = "赢牌";
                }else{
                    //输牌
                    cc.find("popBg/shupaiTxt",this.node).getComponent(cc.Label).string = "输牌";
                }
                //炸弹
                cc.find("popBg/common/zhadanNum", this.node).getComponent(cc.Label).string = playerData.bombs;
                
            }else{
                //玩家1
                //名字
                cc.find("popBg/common/player"+index+"/wanjia", this.node).getComponent(cc.Label).string = decodeURIComponent(playerData.name);
                //余牌
                cc.find("popBg/common/player"+index+"/yupai", this.node).getComponent(cc.Label).string = playerData.pai_arr.length;
                //炸弹
                cc.find("popBg/common/player"+index+"/zhadan", this.node).getComponent(cc.Label).string = playerData.bombs;
                //金豆
                if(playerData.score >= 0){
                    cc.find("popBg/common/player"+index+"/jindou", this.node).getComponent(cc.Label).string = Math.abs(playerData.score);    
                }else{
                    cc.find("popBg/common/player"+index+"/jindou", this.node).getComponent(cc.Label).string = "-" + Math.abs(playerData.score);
                }
                
                // cc.find("popBg/winNode/fangfei", this.node).active = false;
                
            }
        }
        this.show();
    },

    setGrade (jsonData, oldExp, newExp, winFlag) {
        let that = this;
        // 取数据
        let oldData = null;
        let oldFlag = false;
        let newData = null;
        let newFlag = false;
        let nxtData = null;
        for(let i = 0; i < jsonData.length; i++){
            if(!oldFlag && oldExp >= jsonData[i]['limmitdown']){
                oldData = jsonData[i];
            }else{
                oldFlag = true;
            }
            if(!newFlag && newExp >= jsonData[i]['limmitdown']){
                newData = jsonData[i];
            }else{
                newFlag = true;
                if (!nxtData) {
                    nxtData = jsonData[i];
                }
            }

            if (oldFlag && newFlag) {
                break;
            }
        }
        if (oldData && newData) {
            // 级别变化
            let changeGrade = parseInt(newData.id) - parseInt(oldData.id);

            // 设置星星
            let grade = cc.find("player_bg_0/grade", this.node);
            this.setStar(oldData.star);
            // 设置段位
            let name = cc.find("grade_name", grade);
            util.loadSprite("hall/grade/picName_"+oldData.duan, name);
            let icon = cc.find("grade_icon", grade);
            let expLabel = cc.find("exp_win", grade).getComponent(cc.Label);
            // 经验值
            if (winFlag) {
                cc.find("exp_win", grade).active = true;
                cc.find("exp_lose", grade).active = false;
                expLabel = cc.find("exp_win", grade).getComponent(cc.Label);
            }
            else {
                cc.find("exp_win", grade).active = false;
                cc.find("exp_lose", grade).active = true;
                expLabel = cc.find("exp_lose", grade).getComponent(cc.Label);
            }
            // 
            if (changeGrade === 0) {
                icon.scaleX = 0.7;
                icon.scaleY = 0.7;
                expLabel.string = this.getNumberString(newExp);
                util.loadSprite("hall/grade/picName_"+newData.duan, name);
                util.loadSprite("hall/grade/jiangbei"+newData.duan, icon);
            }
            else {
                icon.scaleX = 0;
                icon.scaleY = 0;
                expLabel.string = this.getNumberString(oldExp);
                util.loadSprite("hall/grade/jiangbei"+oldData.duan, icon, function () {
                    icon.runAction(
                        cc.sequence(
                            cc.scaleTo(0.5, 1),
                            cc.delayTime(0.5),
                            cc.callFunc(function () {
                                that.setStar(newData.star);
                                expLabel.string = that.getNumberString(newExp);
                                util.loadSprite("hall/grade/picName_"+newData.duan, name);
                                util.loadSprite("hall/grade/jiangbei"+newData.duan, icon, function () {
                                    icon.runAction(
                                        cc.scaleTo(0.5, 0.7)
                                    );
                                });
                            })
                        )
                    );
                });
            }
            // 光
            if (winFlag) {
                cc.find("grade_light", grade).active = true;
                cc.find("grade_light", grade).runAction(
                    cc.repeatForever(
                        cc.rotateBy(3, 360)
                    )
                );
            }
            else {
                cc.find("grade_light", grade).stopAllActions();
                cc.find("grade_light", grade).active = false;
            }

            // 进度条
            let oldPct = (parseInt(oldExp) - parseInt(oldData.limmitdown))/(parseInt(oldData.limmitup) - parseInt(oldData.limmitdown));
            let newPct = (parseInt(newExp) - parseInt(newData.limmitdown))/(parseInt(newData.limmitup) - parseInt(newData.limmitdown));
            if (winFlag) {
                // 升级
                cc.find("progress_win", grade).active = true;
                cc.find("progress_lose", grade).active = false;
                let progress = cc.find("progress_win", grade).getComponent(cc.ProgressBar);
                if (progress) {
                    progress.progress = newPct;
                    // let list = [];
                    // if (changeGrade > 0) {
                    //     list.push(cc.progressTo(0.5, 1));
                    //     for (let j = 1; j < changeGrade; j++) {
                    //         list.push(cc.progressTo(0, 0));
                    //         list.push(cc.progressTo(0.5, 1));
                    //     }
                    // }
                    // list.push(cc.progressTo(0.5, newPct));
                    // progress.node.stopAllActions();
                    // progress.node.runAction(cc.sequence(list));
                }
            }
            else {
                cc.find("progress_win", grade).active = false;
                cc.find("progress_lose", grade).active = true;
                let progress = cc.find("progress_lose", grade).getComponent("cc.ProgressBar");
                if (progress) {
                    progress.progress = newPct;
                    // let list = [];
                    // if (changeGrade < 0) {
                    //     list.push(cc.progressTo(0.5, 0));
                    //     for (let j = 1; j < -changeGrade; j++) {
                    //         list.push(cc.progressTo(0, 1));
                    //         list.push(cc.progressTo(0.5, 0));
                    //     }
                    // }
                    // list.push(cc.progressTo(0.5, newPct));
                    // progress.node.stopAllActions();
                    // progress.node.runAction(cc.sequence(list));
                }
            }
            // 下一级
            if (newData) {
                cc.find("next", grade).getComponent(cc.Label).string = "下一级： "+this.getNumberString(newData.limmitup);
            }
            this.show();
        }
    },

    setStar (star) {
        for (var i = 1; i <= star; i++) {
            cc.find("player_bg_0/grade/star_light_"+i, this.node).active = true;
            cc.find("player_bg_0/grade/star_dark_"+i, this.node).active = false;
        }
        for (; i <= 5; i++) {
            cc.find("player_bg_0/grade/star_light_"+i, this.node).active = false;
            cc.find("player_bg_0/grade/star_dark_"+i, this.node).active = true;
        }
    },

    getNumberString (number) {
        var string = ""+number;
        let length = string.length;
        let cnt = Math.floor((string.length - 1)/3);
        for (let i = 0; i < cnt; i++) {
            let index = length - 3*i - 4;
            string = string.substr(0, index+1)+","+string.substr(index+1, string.length);
        }
        return string;
    },

    show () {
        if (!this.node.active) {
            this.node.active = true;
        }
    },
    hide () {
        if (this.node.active) {
            this.node.active = false;
        }
    },
});