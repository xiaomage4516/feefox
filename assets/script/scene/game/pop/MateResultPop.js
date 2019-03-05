// 好友，小结算

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
             
            // this.game.initGame();
            // this.game.sendPlayerReady(true);
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

    refresh (data) {
        util.log("x小结算-----gameData.roomId  ==  "+gameData.roomId);
        this.lastRoomId = gameData.roomId;


        let winFlag = true;
        let myHuData = null;
        let oldExp = 0;
        let newExp = 0;
        // 取玩家原来的段位积分
        if (data.oldPlayerRankXp) {
            oldExp = data.oldPlayerRankXp[gameData.uid];
        }
        // 设置玩家信息
        for (let i = 0; i < data.players.length; i++) {
            let playerData = data.players[i];
            let index = this.game.pos[playerData.uid];
            // 更新欢乐豆
            this.game.players[index].info.score = playerData.total_score;
            let playerBg = cc.find("player_bg_" + index, this.node);

            if (playerData.score >= 0) {
                cc.find("score_win/score", playerBg).getComponent(cc.Label).string = "" + Math.abs(playerData.score);
                cc.find("score_win", playerBg).active = true;
                cc.find("score_lose", playerBg).active = false;
                if(index == 0){
                    if(playerData.fangfei == undefined || playerData.fangfei == 0){
                        cc.find("score_win/fangfei", playerBg).active = false;
                    }else{
                        cc.find("score_win/fangfei", playerBg).active = true;
                        cc.find("score_win/fangfei/label", playerBg).getComponent(cc.Label).string = "-" + Math.abs(playerData.fangfei);
                    }
                }
                
            }
            else {
                if (index === 0) {
                    //  背景板
                    winFlag = false;
                }
                cc.find("score_lose/score", playerBg).getComponent(cc.Label).string = "" + Math.abs(playerData.score);
                cc.find("score_lose", playerBg).active = true;
                cc.find("score_win", playerBg).active = false;
            }

            cc.find("player_info_bg/zhuang", playerBg).active = false;
            cc.find("player_info_bg/nickname", playerBg).getComponent(cc.Label).string = decodeURIComponent(playerData.name);
            cc.find("player_info_bg/head/frame", playerBg).active = false;
            util.loadSprite("hall/bag/prop/"+playerData.headFrame, cc.find("player_info_bg/head/frame", playerBg), function (node) {
                node.active = true;
            });
            cc.find("player_info_bg/head/sp", playerBg).active = false;
            sdk.getPlayerHead(playerData.headImage, cc.find("player_info_bg/head/sp", playerBg), function (node) {
                node.active = true;
            });

            if (index === 0) {
                cc.find("player_info_bg/gold_num", playerBg).getComponent(cc.Label).string = util.showNum3(playerData.total_score);
                myHuData = playerData.text_arr;
                newExp = playerData.rankXp;
            }
        }

        // 设置庄家显示
        {
            let index = this.game.pos[data.zhuang];
            cc.find("player_bg_" + index + "/player_info_bg/zhuang", this.node).active = true;
        }
        

        // 设置我的胡牌倍数
        if (myHuData) {
            let itemCnt = myHuData.length;
            let plusColor = new cc.Color(157, 0, 0, config.maxOpacity);
            let reduceColor = new cc.Color(8, 63, 163, config.maxOpacity);
            // 创建胡牌的倍数
            let content = cc.find("player_bg_0/detail/view/content", this.node);
            let itemHeight = 58;
            content.height = itemHeight*itemCnt;
            // 删除以前的节点
            content.removeAllChildren();
            // 循环添加新的节点
            for (let j = 0; j < itemCnt; j++) {
                let item = new cc.Node();
                item.x = 0;
                item.y = -(j + 0.5)*itemHeight;
                content.addChild(item);

                let nameValue = Object.keys(myHuData[j])[0];
                let timesValue = myHuData[j][nameValue];

                let name = new cc.Node();
                name.anchorX = 0;
                name.x = -180;
                name.color = (timesValue >= 0) ? plusColor : reduceColor;
                name.addComponent(cc.Label);
                name.getComponent(cc.Label).string = decodeURIComponent(nameValue);
                name.getComponent(cc.Label).fontSize = 28;
                item.addChild(name);

                let times = new cc.Node();
                times.anchorX = 0;
                times.x = 110;
                times.color = (timesValue >= 0) ? plusColor : reduceColor;
                times.addComponent(cc.Label);
                times.getComponent(cc.Label).string = timesValue+"倍";
                times.getComponent(cc.Label).fontSize = 28;
                item.addChild(times);
            }
        }

        // 酱油提示
        if (!myHuData || myHuData.length === 0) {
            cc.find("player_bg_0/peace_tip", this.node).active = true;
        }
        else {
            cc.find("player_bg_0/peace_tip", this.node).active = false;
        }

        // 胜利失败
        if (winFlag) {
            cc.find("player_bg_0/bg_win", this.node).active = true;
            cc.find("player_bg_0/bg_lose", this.node).active = false;
            // audioUtils.playSFX("resources/sound/game/effect/win.mp3");
        }
        else {
            cc.find("player_bg_0/bg_win", this.node).active = false;
            cc.find("player_bg_0/bg_lose", this.node).active = true;
            // audioUtils.playSFX("resources/sound/game/effect/lose.mp3");
        }
        // 设置段位经验
        {
            if (config.updataGradeData) {
                this.setGrade(config.updataGradeData, oldExp, newExp, winFlag);
            }
            else {
                let that = this;
                util.loadJsonFile("json/GameRank_Common", function (data) {
                    config.updataGradeData = data;
                    if (config.updataGradeData) {
                        that.setGrade(config.updataGradeData, oldExp, newExp, winFlag);
                    }
                });
            }
        }
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