// 游戏测试类

var GameTest = function() {
    if (!config.test_flag) {
        return;
    }

    // 强制返回提示
    if (0) {
        this.onNetPlayerBackNotice({content : "111111"});
    }

    // 骰子
    if (0) {
        this.gameType.actGod({
            detail : {
                data : {
                    laizi_id : 1,
                    laizifan : 1,
                    paiArr : [1,1,1,1],
                }
            }
        });
    }

    // 相同ip
    if (0) {
        let data = {
            "ip": [
                ["234234", "56756", "金德水", "苑绮山"]
            ],
            "gps": []
        };
        this.setSameIpPop(data);
    }
    // 好友退出
    if (0) {
        this.setFriendExitPop(true);
    }

    // 杠分现结
    if (0) {
        this.node.runAction(cc.sequence(cc.delayTime(3), cc.callFunc(function(){
            this.onNetPlayerEnter({
                max_player_cnt : 4,
                playerNum : 4,
                gameKind : config.KIND_MATE,
                players : [
                    {
                        uid : "1",
                        nickname : "1",
                        headimgurl : "111",
                    },
                    {
                        uid : "2",
                        nickname : "2",
                        headimgurl : "222",
                    },
                    {
                        uid : "3",
                        nickname : "3",
                        headimgurl : "333",
                    },
                    {
                        uid : "4",
                        nickname : "4",
                        headimgurl : "444",
                    },
                ],
            });
        }, this)))
        
        this.pos = {
            "1" : 0,
            "2" : 1,
            "3" : 2,
            "4" : 3,
        };
        this.setGangScore({
            "1" : 123,
            "2" : 456,
            "3" : 789,
            "4" : -100,
        });
    }

    // 托管
    if (0) {
        gameData.uid = "11111111";
        gameData.kindId = config.KIND_MATE;
        this.players[0].setHandCard([1,1,1,1,1,1,1,1,1,1,1,1,1], 13);
        let data = {};
        data.tuoguan = {};
        data.tuoguan[gameData.uid] = true;
        this.onNetPlayerAuto(data);
    }

    // 模拟消息
    if (0) {
        gameData.uid = "100754";
        this.pos = {};
        this.pos["100754"] = 0;
        gameData.mapId = config.HENAN_TUIDAOHU;
        gameData.kindId = config.KIND_MATE;
        let data1 = {"room_id":100068,"app_id":6,"mapid":1001,"map_name":"","jinbi":false,"max_player_cnt":4,"owner":"","players":[{"uid":"109382","nickname":"一二三四","sex":0,"headImage":"defaultHead","score":0,"ip":"192.168.199.21","ready":1,"pos":0,"loc":"","locCN":"","locUpdTime":0},{"uid":"104198","nickname":"一二三四","sex":0,"headImage":"defaultHead","score":0,"ip":"192.168.199.46","ready":1,"pos":1,"loc":"","locCN":"","locUpdTime":0},{"uid":"101237","nickname":"1357","sex":0,"headImage":"defaultHead","score":0,"ip":"192.168.199.21","ready":1,"pos":2,"loc":"","locCN":"","locUpdTime":0},{"uid":"105307","nickname":"76576","sex":0,"headImage":"defaultHead","score":0,"ip":"192.168.199.46","ready":1,"pos":3,"loc":"","locCN":"","locUpdTime":0}],"daikai_player":null,"desp":"%E6%8E%A8%E5%80%92%E8%83%A1%2C4%E4%BA%BA%E7%8E%A9%2C%E6%8A%A5%E5%90%AC%2C%E5%B8%A6%E9%A3%8E%2C%E8%87%AA%E6%91%B8%E8%83%A1%2C0%E5%BC%A0%2C%E5%B9%B3%E8%83%A1","isDaiKai":false,"isClubOwner":false,"playerNum":4,"firstUid":"109382","gameKind":2};
        let data2 = {"totalPaisCnt":136,"room_id":100068,"mapId":1001,"uid":"104198","left_round":0,"paiArr":[5,5,10,10,10,11,11,11,12,12,12,16,17],"zhuang_uid":"104198","lianzhuang":1,"fengquan":0,"laizi_id":18,"laizifan":17,"cur_round":0,"touzi1":3,"touzi2":4};
        let data3 = {"room_id":100068,"tishi":{"16":[[15,2,4]],"17":[[5,2,2],[16,2,2]]}};
        let data4 = {"room_id":100075,"uid":"100754","is_ting":false,"pai_id":29,"left":65,"pai_arr":[30,15,14,24,31,21,17,3,7,14,33,23,23],"left_sec":10,"ts":1524141447031};
        
        this.node.runAction(
            cc.sequence(
                cc.callFunc(function () {
                    this.onNetPlayerEnter(data1);
                }, this),
                cc.delayTime(2),
                cc.callFunc(function () {
                    this.onNetGameStart(data2);
                }, this),
                cc.delayTime(5),
                cc.callFunc(function () {
                    this.onNetGameTingTip(data3);
                }, this),
                cc.delayTime(1),
                cc.callFunc(function () {
                    this.pos["100754"] = 0;
                    this.onNetGameExtraCard(data4);
                }, this)
            )
        );
    }

    // 牌堆
    if (0) {
        if (!this.testCount) {
            this.testCount = 0;
            this.onNetPlayerEnter({
                max_player_cnt : 4,
                players : [
                    {
                        uid : "1",
                        nickname : "1",
                        headimgurl : "111",
                    },
                    {
                        uid : "2",
                        nickname : "2",
                        headimgurl : "222",
                    },
                    {
                        uid : "3",
                        nickname : "3",
                        headimgurl : "333",
                    },
                    {
                        uid : "4",
                        nickname : "4",
                        headimgurl : "444",
                    },
                ],
            });
        }
        this.testCount++;
        if (this.testCount >= 35*4) {
            return;
        }
        var pai_arr = [1,1,1,1,1,1,1,1,1,1,1,1,1];
        var that = this;

        {
            let player = this.players[this.testCount%4];
            player.setHandCard(pai_arr, 13);
            player.setExtraCard(true, this.testCount);
            player.node.runAction(
                cc.sequence(
                    cc.delayTime(1),
                    cc.callFunc(function () {
                        player.OutCard(this.testCount, 13, function () {
                            GameTest.call(that);
                        });
                    }, this)
                )
            );
        }
    }

    // 结算
    if (0) {
        gameData.uid = "100039";
        gameData.mapId = config.HENAN_TUIDAOHU;
        gameData.kindId = config.KIND_MATE;
        let data1 = {"room_id":100068,"app_id":6,"mapid":1001,"map_name":"","jinbi":false,"max_player_cnt":4,"owner":"","players":[{"uid":"101476","nickname":"1236","sex":0,"headImage":"defaultHead","score":0,"ip":"192.168.199.21","ready":1,"pos":0,"loc":"","locCN":"","locUpdTime":0},{"uid":"101334","nickname":"5354","sex":0,"headImage":"defaultHead","score":0,"ip":"192.168.199.46","ready":1,"pos":1,"loc":"","locCN":"","locUpdTime":0},{"uid":"101471","nickname":"1357","sex":0,"headImage":"defaultHead","score":0,"ip":"192.168.199.21","ready":1,"pos":2,"loc":"","locCN":"","locUpdTime":0},{"uid":"100896","nickname":"76576","sex":0,"headImage":"defaultHead","score":0,"ip":"192.168.199.46","ready":1,"pos":3,"loc":"","locCN":"","locUpdTime":0}],"daikai_player":null,"desp":"%E6%8E%A8%E5%80%92%E8%83%A1%2C4%E4%BA%BA%E7%8E%A9%2C%E6%8A%A5%E5%90%AC%2C%E5%B8%A6%E9%A3%8E%2C%E8%87%AA%E6%91%B8%E8%83%A1%2C0%E5%BC%A0%2C%E5%B9%B3%E8%83%A1","isDaiKai":false,"isClubOwner":false,"playerNum":4,"firstUid":"109382","gameKind":2};
        
        let data2 = {"room_id":100509,"curRoundStatus":true,"map_id":1001,"map_name":"","is_daikai":false,"cur_round":1,"total_round":1,"ts":1524240323,"hu_pai_id":18,"laizi":18,"laizi2":0,"zhuang":"100874","hu_type":1,"dianpao_uid":"","players":[{"uid":"101759","name":"%E5%88%AA%E8%92%A2%E3%82%9D%E9%90%B9%E5%91%BF","headImage":"http://qmby.feefoxes.com/qipaiweb/mahenan/headimg/1346.png","headFrame":"7","hu":false,"score":-90000,"fan":0,"gang_score":-10000,"total_score":-56000,"pai_arr":[1,2,3,3,3,3,4,4,5,7,8,18,18],"dui_arr":[],"text_arr":[{"%E6%9A%97%E6%9D%A0":-1},{"%E8%87%AA%E6%91%B8":-2},{"%E4%B8%83%E5%AF%B9":-2},{"%E6%B8%85%E4%B8%80%E8%89%B2":-2}],"rankXp":450},{"uid":"100039","name":"112233","headImage":"http://qmby.feefoxes.com/qipaiweb/mahenan/headimg/1119.png","headFrame":"7","hu":false,"score":-90000,"fan":0,"gang_score":-10000,"total_score":252000,"pai_arr":[5,6,7,10,11,12,13,14,15,15,15,15,18],"dui_arr":[],"text_arr":[{"%E6%9A%97%E6%9D%A0":-1},{"%E8%87%AA%E6%91%B8":-2},{"%E4%B8%83%E5%AF%B9":-2},{"%E6%B8%85%E4%B8%80%E8%89%B2":-2}],"rankXp":60656},{"uid":"100874","name":"%E6%98%9F%E6%B2%B3","headImage":"http://qmby.feefoxes.com/qipaiweb/mahenan/headimg/1123.png","headFrame":"7","hu":false,"score":-50000,"fan":0,"gang_score":30000,"total_score":72000,"pai_arr":[1,2,3,13,14,15,21,21,18,18],"dui_arr":[{"pai_arr":[22,22,22],"type":4,"from_uid":"100874","peng_fromuid":""}],"text_arr":[{"%E6%9A%97%E6%9D%A0":1},{"%E8%87%AA%E6%91%B8":-2},{"%E4%B8%83%E5%AF%B9":-2},{"%E6%B8%85%E4%B8%80%E8%89%B2":-2}],"rankXp":450},{"uid":"101734","name":"%E4%BB%96%E8%85%90%E6%9C%BD%E5%B9%B4%E8%8F%AF%EF%BC%8A","headImage":"http://qmby.feefoxes.com/qipaiweb/mahenan/headimg/1559.png","headFrame":"7","hu":true,"score":230000,"fan":8,"gang_score":-10000,"total_score":312000,"pai_arr":[1,1,4,4,4,4,6,6,7,7,8,8,9,18],"dui_arr":[],"text_arr":[{"%E6%9A%97%E6%9D%A0":-1},{"%E8%87%AA%E6%91%B8":2},{"%E4%B8%83%E5%AF%B9":2},{"%E6%B8%85%E4%B8%80%E8%89%B2":2}],"rankXp":450}],"is_last":true};
        this.pos = {};
        gameData.gameGradeXP = 59078;
        this.node.runAction(
            cc.sequence(
                cc.callFunc(function () {
                    this.onNetPlayerEnter(data1);
                }, this),
                cc.delayTime(4),
                cc.callFunc(function () {
                    this.pos["100039"] = 0;
                    this.pos["100874"] = 1;
                    this.pos["101759"] = 2;
                    this.pos["101734"] = 3;
                    this.setMateResultPop(data2);
                }, this),
            )
        );
    }

    // 牌垛手牌动作
    if (0) {
        this.onNetPlayerEnter({
            max_player_cnt : 4,
            players : [
                {
                    uid : 1,
                    nickname : "1",
                    headimgurl : "111",
                },
                {
                    uid : 2,
                    nickname : "2",
                    headimgurl : "222",
                },
                {
                    uid : 3,
                    nickname : "3",
                    headimgurl : "333",
                },
                {
                    uid : 4,
                    nickname : "4",
                    headimgurl : "444",
                },
            ],
        });
        this.players[0].actShowLeftCard();
        this.players[1].actShowLeftCard();
        this.players[2].actShowLeftCard();
        this.players[3].actShowLeftCard();
        this.node.runAction(
            cc.sequence(
                cc.delayTime(3),
                cc.callFunc(function(){
                    this.players[0].setHandCard([1,2,10,11,12,13,13,13,13,20,31,32,32], 13);
                    this.players[0].setExtraCard(true, 34);
                    this.players[0].actShowHandCard();

                    this.players[1].setHandCard([1,2,10,11,12,13,13,13,13,20,31,32,32], 13);
                    this.players[1].setExtraCard(true, 34);
                    this.players[1].actShowHandCard();

                    this.players[2].setHandCard([1,2,10,11,12,13,13,13,13,20,31,32,32], 13);
                    this.players[2].setExtraCard(true, 34);
                    this.players[2].actShowHandCard();

                    this.players[3].setHandCard([1,2,10,11,12,13,13,13,13,20,31,32,32], 13);
                    this.players[3].setExtraCard(true, 34);
                    this.players[3].actShowHandCard();
                }, this)
            )
        );

        for (var i = 0; i < 4; i++) {
            this.players[i].actPlayerMove();
        }
    }

    // 牌组
    if (0) {
        for (var i = 0; i < 4; i++) {
            this.players[i].initGame();
            this.players[i].node.active = true;
            this.players[i].info = {"nickname" : "111", "happybeans" : 100};
            this.players[i].refreshInfoUI();
            this.players[i].setPengCard(false, 1, 1);
            this.players[i].setPengCard(false, 2, 2);
            this.players[i].setPengCard(false, 2, 2);
            this.players[i].setPengCard(false, 2, 2);
        }
    }

    // 操作动画
    if (0) {
        for (let i = 0; i < 4; i++) {
            let player = this.players[i];
            player.initGame();
            player.node.active = true;
            player.info = {"nickname" : "111", "happybeans" : 100};
            player.refreshInfoUI();
        }
        for (let i = 0; i < 1000; i++) {
            let index = i%4;
            let op = Math.floor(i/4) + 1;
            op = op%3;

            let player = this.players[index];
            player.node.runAction(
                cc.sequence(
                    cc.delayTime((op-1)*3),
                    cc.callFunc(function () {
                        player.setOpAnim(op);
                    }, this)
                )
            );
        }
    }

    // 开场动画
    if (0) {
        this.actStartAnim({detail : {data : {roomprice : 0}}});
    }

    // 音效
    if (0) {
        let player = this.players[0];
        audioUtils.sfxVolume = 10;
        let delay = 0;
        player.node.runAction(
            cc.sequence(
                cc.callFunc(function () {
                    player.playOpEffect("chi", 0);
                }, this),
                cc.delayTime(1),
                cc.callFunc(function () {
                    player.playOpEffect("chi", 1);
                }, this),
                cc.delayTime(1),
                cc.callFunc(function () {
                    player.playOpEffect("peng", 0);
                }, this),
                cc.delayTime(1),
                cc.callFunc(function () {
                    player.playOpEffect("peng", 1);
                }, this),
                cc.delayTime(1),
                cc.callFunc(function () {
                    player.playOpEffect("gang", 0);
                }, this),
                cc.delayTime(1),
                cc.callFunc(function () {
                    player.playOpEffect("gang", 1);
                }, this),
                cc.delayTime(1),
                cc.callFunc(function () {
                    player.playOpEffect("angang", 0);
                }, this),
                cc.delayTime(1),
                cc.callFunc(function () {
                    player.playOpEffect("angang", 1);
                }, this),
                cc.delayTime(1),
                cc.callFunc(function () {
                    player.playOpEffect("hu", 0);
                }, this),
                cc.delayTime(1),
                cc.callFunc(function () {
                    player.playOpEffect("hu", 1);
                }, this),
            )
        )
        delay += 10;
        for (let i = 0; i < 34; i++) {
            player.node.runAction(
                cc.sequence(
                    cc.delayTime(delay++),
                    cc.callFunc(function () {
                        player.playOutEffect(i + 1, 0);
                    }, this)
                )
            )
        }
        for (let i = 0; i < 34; i++) {
            player.node.runAction(
                cc.sequence(
                    cc.delayTime(delay++),
                    cc.callFunc(function () {
                        player.playOutEffect(i + 1, 1);
                    }, this)
                )
            )
        }
    }

    // 手牌
    if (0) {
        let data = [1,2,3,4,5,6,7,8,9,10,11,12,13];
        for (let i = 0; i < data.length; i++) {
            data[i] += 21;
        }
        for (var i = 0; i < 4; i++) {
            this.players[i].initGame();
            this.players[i].node.active = true;
            this.players[i].info = {"nickname" : "111", "happybeans" : 100};
            this.players[i].refreshInfoUI();
            this.players[i].setHandCard(data, 13);
            this.players[i].setExtraCard(true, 28);
        }
    }

    // 多选操作弹窗
    if (0) {
        this.onNetPlayerEnter({
            max_player_cnt : 4,
            players : [
                {
                    uid : "1",
                    nickname : "1",
                    headimgurl : "111",
                    headFrame : "1",
                },
                {
                    uid : "2",
                    nickname : "2",
                    headimgurl : "222",
                    headFrame : "2",
                },
                {
                    uid : "3",
                    nickname : "3",
                    headimgurl : "333",
                    headFrame : "3",
                },
                {
                    uid : "4",
                    nickname : "4",
                    headimgurl : "444",
                    headFrame : "7",
                },
            ],
        });
        this.onNetGameOpTip({
            uid : gameData.uid,
            pai_id : [
                [
                    [1, 2, 3, 4],
                    [1, 2, 3],
                    [1, 3],
                ],
                [
                    [1, 2, 3, 4],
                    [1, 2, 3],
                    [1, 3],
                ],
            ],
            op : [1,1,1,],
        });
    }

    // 断线重连
    if (0) {
        for (var i = 0; i < 4; i++) {
            this.players[i].initGame();
        }
        gameData.uid = "102405";
        let data = {"code":3006,"data":{"room_id":100304,"ownerid":"107866","playerNum":4,"cur_round":2,"max_player_cnt":4,"app_id":6,"mapid":1001,"room_status":2,"desp":"%E6%8E%A8%E5%80%92%E8%83%A1%2C4%E4%BA%BA%E7%8E%A9%2C4%E5%B1%80(%E6%88%BF%E5%8D%A1x3)%2C0%E5%BC%A0%2C%E5%B9%B3%E8%83%A1","zhuang_uid":"107866","lianzhuang":2,"laizi_id":18,"left_round":1,"turn_uid":"107866","fengquan":0,"has_chu":false,"left_pai_num":69,"players":[{"uid":"107866","nickname":"42245","sex":0,"headimgurl":"defaultHead","score":7,"happybeans":1013,"ip":"192.168.199.46","ready":0,"pos":0,"loc":"","locCN":"","locUpdTime":0,"tuoguan":false,"isOffline":false},{"uid":"100788","nickname":"13546","sex":0,"headimgurl":"defaultHead","score":-2,"happybeans":996,"ip":"192.168.199.175","ready":1,"pos":1,"loc":"","locCN":"","locUpdTime":0,"tuoguan":false,"isOffline":false},{"uid":"105371","nickname":"4567","sex":0,"headimgurl":"defaultHead","score":-2,"happybeans":996,"ip":"192.168.199.81","ready":1,"pos":2,"loc":"","locCN":"","locUpdTime":0,"tuoguan":false,"isOffline":false},{"uid":"102131","nickname":"768768","sex":0,"headimgurl":"defaultHead","score":-3,"happybeans":995,"ip":"192.168.199.46","ready":0,"pos":3,"loc":"","locCN":"","locUpdTime":0,"tuoguan":false,"isOffline":false}],"daikai_player":null,"player_pai":[{"uid":"107866","is_ready":false,"is_ting":false,"ting_chu":0,"cur_pai_num":14,"pai_arr":[3,4,5,6,7,8,10,10,12,12,12,15,16,14],"hua_arr":[],"liang_pai_arr":[],"used_pai_arr":[],"dui_arr":[],"tingpai":{},"lastmopaiid":14},{"uid":"100788","is_ready":true,"is_ting":false,"ting_chu":0,"cur_pai_num":13,"pai_arr":[5,6,7,10,11,12,13,14,15,16,16,17,18],"hua_arr":[],"liang_pai_arr":[],"used_pai_arr":[],"dui_arr":[],"tingpai":{},"lastmopaiid":0},{"uid":"105371","is_ready":true,"is_ting":false,"ting_chu":0,"cur_pai_num":13,"pai_arr":[1,2,3,13,14,15,21,21,22,22,22,23,24],"hua_arr":[],"liang_pai_arr":[],"used_pai_arr":[],"dui_arr":[],"tingpai":{},"lastmopaiid":0},{"uid":"102131","is_ready":false,"is_ting":false,"ting_chu":0,"cur_pai_num":13,"pai_arr":[8,7,4,4,4,8,18,9,6,6,6,7,17],"hua_arr":[],"liang_pai_arr":[],"used_pai_arr":[],"dui_arr":[],"tingpai":{},"lastmopaiid":14}],"firstUid":"107866","gameKind":1,"gameLevel":0}};

        this.onNetPlayerReconnect(data.data);
    }

    // 解散
    if (0) {
        let data1 = {"code":3009,"data":{"room_id":100075,"is_jiesan":0,"left_sec":158,"arr":[{"uid":"103111","name":"23525","headUrl":"defaultHead","is_accept":1},{"uid":"107967","name":"45234","headUrl":"defaultHead","is_accept":1},{"uid":"108254","name":"123124","headUrl":"defaultHead","is_accept":-1},{"uid":"102439","name":"25234","headUrl":"defaultHead","is_accept":-1}]}};
        let data2 = {"code":3009,"data":{"room_id":100075,"is_jiesan":1,"left_sec":153,"arr":[{"uid":"103111","name":"23525","headUrl":"defaultHead","is_accept":1},{"uid":"107967","name":"45234","headUrl":"defaultHead","is_accept":1},{"uid":"102439","name":"25234","headUrl":"defaultHead","is_accept":1},{"uid":"108254","name":"123124","headUrl":"defaultHead","is_accept":-1}]}};
        // this.onNetPlayerDismiss(data1.data);
        this.node.runAction(cc.sequence(cc.delayTime(5),cc.callFunc(function(){this.onNetPlayerDismiss(data1.data)},this)));
    }

    // 操作
    if (0) {
        this.setOp([1,1,1,1,1]);
    }

    // 匹配玩家动作
    if (0) {
        gameData.uid = "104198";
        gameData.mapId = config.HENAN_TUIDAOHU;
        gameData.kindId = config.KIND_MATE;
        let data1 = {"room_id":100068,"app_id":6,"mapid":1001,"map_name":"","jinbi":false,"max_player_cnt":4,"owner":"","players":[{"uid":"109382","nickname":"1236","sex":0,"headimgurl":"defaultHead","score":0,"ip":"192.168.199.21","ready":1,"pos":0,"loc":"","locCN":"","locUpdTime":0},{"uid":"104198","nickname":"5354","sex":0,"headimgurl":"defaultHead","score":0,"ip":"192.168.199.46","ready":1,"pos":1,"loc":"","locCN":"","locUpdTime":0},{"uid":"101237","nickname":"1357","sex":0,"headimgurl":"defaultHead","score":0,"ip":"192.168.199.21","ready":1,"pos":2,"loc":"","locCN":"","locUpdTime":0},{"uid":"105307","nickname":"76576","sex":0,"headimgurl":"defaultHead","score":0,"ip":"192.168.199.46","ready":1,"pos":3,"loc":"","locCN":"","locUpdTime":0}],"daikai_player":null,"desp":"%E6%8E%A8%E5%80%92%E8%83%A1%2C4%E4%BA%BA%E7%8E%A9%2C%E6%8A%A5%E5%90%AC%2C%E5%B8%A6%E9%A3%8E%2C%E8%87%AA%E6%91%B8%E8%83%A1%2C0%E5%BC%A0%2C%E5%B9%B3%E8%83%A1","isDaiKai":false,"isClubOwner":false,"playerNum":4,"firstUid":"109382","gameKind":2};
        this.onNetPlayerEnter(data1);
    }
};

module.exports = GameTest;