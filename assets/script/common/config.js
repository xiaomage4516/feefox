// 配置
cc.Class({
    extends: cc.Component,

    /**
     * gameData作为全局变量，
     * 存放player自己相关的动态数据
     * 而config作为全局变量，存放游戏的配置和一些静态数据表
     * 如果需要存放其他player的数据，再看放哪合适
     * */
    properties: {
        // 版本号
        version : 2019030401,
 

	    // 测试开关
	    test_flag : 0,
	    log_flag : 	0,
	    warn_flag : 0,
	    error_flag : 0,
        // 选服开关
        simulate_flag : 0,
        // 是否测试环境，sdk使用
        // platform : "debug",
        // platform : "qqplay",
        platform : "wechat",
        //
        forceConnectSelectGameSvr : false,
		//
		hallSvrs: [],
        gameSvrs: [],
		//

        //
        loginActionDefaultGameId : null,
        hallDefaulrSelGameId : null,//大厅界面默认的游戏玩法

        //1 河南麻将  2 跑得快  服务器以此来区分 appid appSecret
        wxType : 1,

		// 游戏玩法
        HENAN_TUIDAOHU : 1001,//推倒胡
        HENAN_ZHENGZHOU : 1101,//郑州
        HENAN_XINYANG : 1201,//信阳
        HENAN_NANYANG : 1301,//南阳
        HENAN_ZHOUKOU : 1401,//周口
        HENAN_SHANGQIU : 1501,//商城
        HENAN_YONGCHENG : 1502,//永城
        HENAN_PAODEKUAI : 100,//跑得快
        HENAN_ZHUMADIAN : 1601,//驻马店
        HENAN_XINXIANG : 1701,//新乡

        //麻将和扑克
        MAJIANG_ID : 6,
        PUKE_ID : 200,


        // 游戏类型
        KIND_MATE : 2,// 匹配
        KIND_FRIEND : 1,// 好友
        KIND_MATCH : 3,// 比赛

        //缓存表数据
        updataGradeData : null,//段位表
        gamechoiceData : null,//选择玩法表
        PropInfoData : null,//道具信息表
        rewardTabel : null,
        taskTabel : null,
        ShareAwardTabel : null,
        playerLevelData : null,//人物等级表
        Matchlevel_Common : null,
        gameShopData : null,//商店表

        // 苹果设备透明度255蓝屏
        maxOpacity : 254,

        //背景音乐路径
        musicPath : "resources/sound/bgMain.mp3",
        silencePath : "resources/sound/silence.mp3",
        btn_click_sound : "resources/sound/other/ui_click.mp3",//普通点击按钮    
        btn_close_sound : "resources/sound/other/unclickable.mp3",//关闭按钮
    },

    ctor () {
        //
        this.loginActionDefaultGameId = this.HENAN_TUIDAOHU;
        this.hallDefaulrSelGameId = this.HENAN_ZHENGZHOU;
        //
        this.hallSvrs = [
            "http://192.168.199.3:8080",       //idx0, hallsvrid 1002
            "http://192.168.199.83:8080",       //idx1, hallsvrid 1003
            "http://192.168.199.46:8080",       //idx2, hallsvrid 1001
            "http://192.168.199.36:8080",      //idx3, hallsvrid 1004
            "http://192.168.199.81:8080",       //idx4, hallsvrid 1005
            "https://hnqp.feefox.cn",       //idx5, hallsvrid 1001
        ];
        this.gameSvrs = [
            "ws://192.168.199.60:20000/mqtt",   //idx0, gamesvrid 2002
            "ws://192.168.199.46:21000/mqtt",   //idx1, gamesvrid 2003
            "ws://192.168.199.46:20000/mqtt",   //idx2, gamesvrid 2001
            "ws://192.168.199.36:20000/mqtt",  //idx3, gamesvrid 2004
            "ws://211.159.163.53:22000/mqtt",  //idx4, gamesvrid 2005
            "wss://hnqp.feefox.cn/wss/mqtt",   //idx5, gamesvrid 2001
        ];
    },

    /**
     *
     * loginActionId 得 gameKind
     * */
    getGameKindByLoginActionId:function (actionId) {
        //
        if (actionId == 1)
            return this.KIND_MATE;
        if (actionId == 2)
            return this.KIND_FRIEND;
        if (actionId == 3)
            return this.KIND_FRIEND;
        //
        return 0;
    },

    //

    //
    getPropModelInfoByPropId : function(propId) {
        //
        if (!this.PropInfoData) {
            return;
        }

        for (var i = 0; i < this.PropInfoData.length; ++i) {
            var item = this.PropInfoData[i];
            if (item.id == propId) {

                return item;
            }

        }

        return null;
        //
    },

    //
    getRewardTabelItemById : function(id) {
        //
        if (!this.rewardTabel) {
            return;
        }

        for (var i = 0; i < this.rewardTabel.length; ++i) {
            var item = this.rewardTabel[i];
            if (item.id == id) {

                return item;
            }

        }

        return null;
        //
    },

    //

});