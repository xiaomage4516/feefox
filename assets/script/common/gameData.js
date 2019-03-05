// 游戏数据

cc.Class({
    extends: cc.Component,


    /**
     * gameData作为全局变量，
     * 存放player自己相关的动态数据
     * 而config作为全局变量，存放游戏的配置和一些静态数据表
     * 如果需要存放其他player的数据，再看放哪合适
     * */
    properties: {
        // 语言类型
        languageID : "henan",
        // 语音性别
        soundSex : null,
        // 静音打开
        silenceFlag : false,

        //
        needCheckSettings : false,

        // 麻将还是扑克
        appId : null,
        // 具体玩法，对应GameServer里的mapid，河南推到1001，郑州麻将1101，信阳麻将1201
        // 即为客户端配置里的子游戏玩法id
        mapId : null,
        // 场次类型，2匹配1好友3比赛
        kindId : null,
        // 匹配场场次
        mateLevel : null,
        // 房间id
        roomId : null,
        // 玩家选择的游戏类型
        selectMapId : null,


        // 玩家信息
        // 本游戏玩家id
        uid : null,
        // 微信玩家id
        openid : null,
        // 昵称
        nickname : null,
        // 性别
        sex : null,
        // 游戏豆
        gameBean : null,
        // 钻石
        gameDiamond : null,
        //头像框id (id 按照道具表里面的来)
        playHeadFrame : null,
        //段位提示红点
        isTipGrade : null,
        isTipTask : null,
        isTipMail_1 : null,//查看
        isTipMail_2 : null,//领奖
        isTipShare:null,//分享
        // 经验值
        gameGradeXP : null,
        gameGradeDuan : 1,//段位 1 2 3 4 5 6
        gameGradeXing : 1,//星星 1 2 3 4 5
        gameGradeName : "新手",//段位名字 新手 初段 中段 高段 大师 雀圣（根据表里面的来）
        //是否显示首充 0 显示   1 不显示
        firstRecharge : null,
        //今天是否可以签到
        isSign : null,
        //今天签第几天的
        isFirstLoginSign:false,
        nowSignNum : null,
        //玩家是否在房间内
        playerIsInRoom : null,
        //在线人数(是个数组)
        onlineNum : null,
        tuidaohuLevel1Num : null,//推倒胡初级场人数
        tuidaohuLevel2Num : null,//推倒胡中级场人数
        tuidaohuLevel3Num : null,//推倒胡高级场人数
        xinyangLevel1Num : null,//信阳初级场人数
        xinyangLevel2Num : null,//信阳中级场人数
        xinyangLevel3Num : null,//信阳高级场人数
        nanyangLevel1Num : null,//南阳初级场人数
        nanyangLevel2Num : null,//南阳中级场人数
        nanyangLevel3Num : null,//南阳高级场人数
        
        zhoukouLevel1Num : null,//周口初级场人数
        zhoukouLevel2Num : null,//周口中级场人数
        zhoukouLevel3Num : null,//周口高级场人数
        zhengzhouLevel1Num : null,//郑州初级场人数
        zhengzhouLevel2Num : null,//郑州中级场人数
        zhengzhouLevel3Num : null,//郑州高级场人数
        pdkLevel1NUm : null,//跑得快必出初级场人数
        pdkLevel2NUm : null,//跑得快必出中级场人数
        pdkLevel3NUm : null,//跑得快必出高级场人数
        pdkLevel4NUm : null,//跑得快非必出初级场人数
        pdkLevel5NUm : null,//跑得快非必出中级场人数
        pdkLevel6NUm : null,//跑得快非必出高级场人数

        //服务器返回的表数据，  房间底分由后端控制
        matchLevelData_houduan : [],

        // 省
        province : null,
        // 市
        city : null,
        // 县
        county : null,
        // 头像地址
        headimgurl : null,
        // 腾讯特权
        privilege : null,
        // 微信返回，同一个开发者账号下不同应用相同用户唯一
        unionid : null,
        // 登录类型
        loginType : null,

        // 服务器url
        serverUrl : null,
        // 服务器ip
        serverIp : null,
        // 服务器port
        serverPort : null,

        // 当前通信的hall svr http url
        hallSvrUrl: null,
        //
        // 登录大厅并且附带行动，0仅登录到大厅主页
        // 1登录大厅并且直接进入匹配场
        // 2登录大厅并且直接创建好友场房间
        // 3登录大厅并且直接加入好友场房间
        loginActionId : 0,
        //
        // 登录大厅的来源，默认0表示：非从手Q进入
        // 从手Q各种入口进入登录大厅，src含义取手Q文档里介绍的
        loginSrc: 0,
        //
        // 匹配场适用：0未选择场次，1低级场，2中级场，3高级场
        actionMatchingGameLvl: 0,
        //
        // 好友场适用：至少是6位数字的房间Id
        actionRoomId: 0,

        // 
        DYKJChannel : null,

        // 房卡数量，数组，三个值
        // 这个是GameServer适用的
        numOfCards : null,

        // ip
        ip : null,
        // 
        isNew : null,
        //音乐音效震动
        musicStatus : 1,
        effectStatus : 1,
        shakeStatus : 0,

        //根据这个flag显示邮件icon上的红点
        //未读或者未领取的邮件，都算NewMail
        //登录时拉取这个字段，或者，客户端在与大厅的
        //某些交互后知道服务器应该产生了新邮件，客户端自己把这个字段值1，引起玩家看见红点
        hasNewMailFlag : 0,
        //

        // 操作系统
        os : null,

        //实际分辨率
        canvasWidth : null,
        canvasHeight : null,
        //屏幕分辨率
        FrameWidth : null,
        FrameHeight : null,

        // 断线重连
        reconnectData : null,
        //大厅根节点
        hallNode : null,


        // 是否加载模糊背景
        blurLayer : null,

        //音乐handle
        musicHandle : null,

        rule : null,

        //好友局规则（总规则，包含左右的）
        rule_jushu : null,
        // （总规则，包含左右的）
        all_rule : null,
        isshowpdkbtn : true,
    },

    init () {
        this.blurLayer = {
            "activityLayer" : 0,
            "bagLayer" : 0,
            "boxLayer" : 0,
            "createRoom" : 0,
            "gradeLayer" : 0,
            "joinRoom" : 0,
            "mailLayer" : 0,
            "moreAreas" : 0,
            "moreField" : 0,
            "recordLayer" : 0,
            "setting" : 0,
            "shopLayer" : 0,
            "loaded" : 0,
        };
        // this.all_rule = [
        //         {rule_laizi : null},   //是否有癞子    0
        //         {}
        // ],
        this.all_rule = {
            rule_laizi :                 null,    //是否有癞子    
            rule_HZHG :                  null,    //荒庄荒杠        
            rule_guoshouhu :             null,    //过手胡
            rule_qixiaodui :             null,    //七小对翻倍
            rule_GSKS :                  null,    //杠上开花
            rule_gangpao :               null,    //杠跑
            rule_zimo :                  null,    //自摸
            rule_zhuangjia :             null,    //庄家加底
            rule_louhu :                 null,    //漏胡

            rule_youdabichu :            null,    //有大必出
            rule_shouchuxuanze :         null,    //首出选择
            rule_xiajuxianchu :          null,    //下局先出

            // rule_qigongzui :             null,    //七公嘴
            // rule_kun48 :                 null,    //十公嘴（四大嘴捆8小嘴）
            // rule_mantangpao :            null,    //满堂跑
            rule_zuitype :               null,    //嘴子类型（七公嘴  十公嘴    满堂跑）（互斥的用一个key来控制）
            rule_luan3feng :             null,    //乱三风
            rule_dahu :                  null,    //大胡
            rule_dazui :                 null,    //大嘴

            rule_gangdiliupai :          null,    //杠底留牌

        }
    
        /*
            name : 显示的规则名字
            value : 发送给服务器的值
            isMoRen : 是否默认选中
            posX : X坐标
            posY : Y坐标
            type : 复选框的类型
            isShow : 是否默认显示
            huchi : 多选按钮，之间只能有一个同时选中
            ruleKey : 规则名字(和all_rule 的 key )
            teyou :  选中A 规则，C规则一定显示,但不是一定选中（不是父子关系）
            yincang : 选中B 规则，D、E规则一定隐藏，（隐藏的规则发给服务器0，或者false） 
            chongtu : 选中A规则B规则要置灰，不能同时选中,但是可以同时都不选中
        */

        this.rule = {
            //推倒胡
            1001 : [
                //局数
                [
                    {
                        name : "4局",
                        value : 4,
                        isMoRen : true, 
                        posX : -183,
                        posY : 32,
                        type : 1,
                        isShow : true
                    },
                    {
                        name : "8局",
                        value : 8,
                        isMoRen : false, 
                        posX : 88,
                        posY : 32,
                        type : 1,
                        isShow : true
                    }
                ],
                //规则
                [
                    {
                        name : "癞子",
                        value : 1,
                        isMoRen : true, 
                        posX : -183,
                        posY : 30,
                        ruleKey : "rule_laizi",
                        huchi : [1],
                        teyou : [],
                        yincang : [],
                        chongtu : [],
                        type : 1,
                        isShow : true
                    },
                    {
                        name : "无癞子",
                        value : 0,
                        isMoRen : false, 
                        posX : 90,
                        posY : 30,
                        ruleKey : "rule_laizi",
                        huchi : [0],
                        teyou : [],
                        yincang : [],
                        chongtu : [],
                        type : 1,
                        isShow : true
                    },
                    {
                        name : "荒庄荒杠",
                        value : true,
                        isMoRen : false, 
                        posX : -183,
                        posY : -45,
                        ruleKey : "rule_HZHG",
                        huchi : [],
                        teyou : [],
                        yincang : [],
                        chongtu : [],
                        type : 2,
                        isShow : true
                    },
                    {
                        name : "过手胡",
                        value : true,
                        isMoRen : true, 
                        posX : 90,
                        posY : -45,
                        ruleKey : "rule_guoshouhu",
                        huchi : [],
                        teyou : [],
                        yincang : [],
                        chongtu : [],
                        type : 2,
                        isShow : true
                    },
                    {
                        name : "七小对",
                        value : true,
                        isMoRen : true, 
                        posX : -183,
                        posY : -118,
                        ruleKey : "rule_qixiaodui",
                        huchi : [],
                        teyou : [],
                        yincang : [],
                        chongtu : [],
                        type : 2,
                        isShow : true
                    },
                    {
                        name : "杠上开花",
                        value : true,
                        isMoRen : true, 
                        posX : 90,
                        posY : -118,
                        ruleKey : "rule_GSKS",
                        huchi : [],
                        teyou : [],
                        yincang : [],
                        chongtu : [],
                        type : 2,
                        isShow : true
                    },
                ],
                //虚线和名字
                [
                    {
                        name : "玩法："
                    }
                ]
            ],  
            //郑州
            1101 : [
                //局数
                [
                    {
                        name : "4局",
                        value : 4,
                        isMoRen : true, 
                        posX : -183,
                        posY : 32,
                        type : 1,
                        isShow : true
                    },
                    {
                        name : "8局",
                        value : 8,
                        isMoRen : false, 
                        posX : 88,
                        posY : 32,
                        type : 1,
                        isShow : true
                    }
                ],
                //规则
                [
                    {
                        name : "自摸胡",
                        value : true,
                        isMoRen : true, 
                        posX : -183,
                        posY : 30,
                        ruleKey : "rule_zimo",
                        huchi : [1],
                        teyou : [],
                        yincang : [],
                        chongtu : [],
                        type : 1,
                        isShow : true
                    },
                    {
                        name : "点炮胡",
                        value : false,
                        isMoRen : false, 
                        posX : 90,
                        posY : 30,
                        ruleKey : "rule_zimo",
                        huchi : [0],
                        teyou : [],
                        yincang : [],
                        chongtu : [],
                        type : 1,
                        isShow : true
                    },
                    {
                        name : "杠跑",
                        value : true,
                        isMoRen : false, 
                        posX : -183,
                        posY : -45,
                        ruleKey : "rule_gangpao",
                        huchi : [],
                        teyou : [],
                        yincang : [],
                        chongtu : [],
                        type : 2,
                        isShow : true
                    },
                    {
                        name : "庄家加底",
                        value : true,
                        isMoRen : true, 
                        posX : 90,
                        posY : -45,
                        ruleKey : "rule_zhuangjia",
                        huchi : [],
                        teyou : [],
                        yincang : [],
                        chongtu : [],
                        type : 2,
                        isShow : true
                    },
                    {
                        name : "漏胡",
                        value : true,
                        isMoRen : true, 
                        posX : -183,
                        posY : -118,
                        ruleKey : "rule_louhu",
                        huchi : [],
                        teyou : [],
                        yincang : [],
                        chongtu : [],
                        type : 2,
                        isShow : true
                    },
                    {
                        name : "荒庄荒杠",
                        value : true,
                        isMoRen : false, 
                        posX : 90,
                        posY : -118,
                        ruleKey : "rule_HZHG",
                        huchi : [],
                        teyou : [],
                        yincang : [],
                        chongtu : [],
                        type : 2,
                        isShow : true
                    },
                ],
                //虚线和名字
                [
                    {
                        name : "玩法："
                    }
                ]
            ],
            //跑得快
            100 : [
                //局数
                [
                    {
                        name : "3局跑",
                        value : 3,
                        isMoRen : false, 
                        posX : -183,
                        posY : 32,
                        type : 1,
                        isShow : true
                    },
                    {
                        name : "6局跑",
                        value : 6,
                        isMoRen : true,  
                        posX : 7,
                        posY : 32,
                        type : 1,
                        isShow : true
                    },
                    {
                        name : "9局跑",
                        value : 9,
                        isMoRen : false,  
                        posX : 197,
                        posY : 32,
                        type : 1,
                        isShow : true
                    }
                ],
                //规则
                [
                    {
                        name : "是",
                        value : true,
                        isMoRen : true, 
                        posX : -183,
                        posY : 30,
                        ruleKey : "rule_youdabichu",
                        huchi : [1],
                        teyou : [],
                        yincang : [],
                        chongtu : [],
                        type : 1,
                        isShow : true
                    },
                    {
                        name : "否",
                        value : false,
                        isMoRen : false, 
                        posX : 7,
                        posY : 30,
                        ruleKey : "rule_youdabichu",
                        huchi : [0],
                        teyou : [],
                        yincang : [],
                        chongtu : [],
                        type : 1,
                        isShow : true
                    },
                    {
                        name : "黑桃三",
                        value : 1,
                        isMoRen : true, 
                        posX : -183,
                        posY : -45,
                        ruleKey : "rule_shouchuxuanze",
                        huchi : [3,4],
                        teyou : [],
                        yincang : [],
                        chongtu : [],
                        type : 1,
                        isShow : true
                    },
                    {
                        name : "红桃三",
                        value : 2,
                        isMoRen : false, 
                        posX : 7,
                        posY : -45,
                        ruleKey : "rule_shouchuxuanze",
                        huchi : [2,4],
                        teyou : [],
                        yincang : [],
                        chongtu : [],
                        type : 1,
                        isShow : true
                    },
                    {
                        name : "方块三",
                        value : 3,
                        isMoRen : false, 
                        posX : 197,
                        posY : -45,
                        ruleKey : "rule_shouchuxuanze",
                        huchi : [2,3],
                        teyou : [],
                        yincang : [],
                        chongtu : [],
                        type : 1,
                        isShow : true
                    },
                    {
                        name : "3先出",
                        value : 1,
                        isMoRen : true, 
                        posX : -183,
                        posY : -118,
                        ruleKey : "rule_xiajuxianchu",
                        huchi : [6],
                        teyou : [],
                        yincang : [],
                        chongtu : [],
                        type : 1,
                        isShow : true
                    },
                    {
                        name : "赢家先出",
                        value : 2,
                        isMoRen : false, 
                        posX : 7,
                        posY : -118,
                        ruleKey : "rule_xiajuxianchu",
                        huchi : [5],
                        teyou : [],
                        yincang : [],
                        chongtu : [],
                        type : 1,
                        isShow : true
                    },
                ],
                //虚线和名字
                [
                    {
                        name : "有大必出："
                    },
                    {
                        name : "首出选择："
                    },
                    {
                        name : "下局先出："
                    }
                ]
            ],  
            //信阳
            1201 : [
                //局数
                [
                    {
                        name : "8局信阳",
                        value : 8,
                        isMoRen : true, 
                        posX : -183,
                        posY : 32,
                        type : 1,
                        isShow : true
                    },
                    {
                        name : "16局",
                        value : 16,
                        isMoRen : false, 
                        posX : 88,
                        posY : 32,
                        type : 1,
                        isShow : true
                    }
                ],
                //规则
                [
                    {
                        name : "七公嘴",
                        value : 1,
                        isMoRen : true, 
                        posX : -183,
                        posY : 30,
                        ruleKey : "rule_zuitype",
                        huchi : [1,2],
                        teyou : [5],
                        yincang : [6,7],
                        chongtu : [],
                        type : 1,
                        isShow : true
                    },
                    {
                        name : "十公嘴",
                        value : 2,
                        isMoRen : false, 
                        posX : 7,
                        posY : 30,
                        ruleKey : "rule_zuitype",
                        huchi : [0,2],
                        teyou : [6,7],
                        yincang : [5],
                        chongtu : [],
                        type : 1,
                        isShow : true
                    },
                    {
                        name : "满堂跑",
                        value : 3,
                        isMoRen : false, 
                        posX : 197,
                        posY : 30,
                        ruleKey : "rule_zuitype",
                        huchi : [0,1],
                        teyou : [6,7],
                        yincang : [5],
                        chongtu : [],
                        type : 1,
                        isShow : true
                    },
                    {
                        name : "点炮胡",
                        value : false,
                        isMoRen : true, 
                        posX : -183,
                        posY : -45,
                        ruleKey : "rule_zimo",
                        huchi : [],
                        teyou : [],
                        yincang : [],
                        chongtu : [],
                        type : 2,
                        isShow : true
                    },
                    {
                        name : "大胡",
                        value : true,
                        isMoRen : true, 
                        posX : 7,
                        posY : -45,
                        ruleKey : "rule_dahu",
                        huchi : [],
                        teyou : [],
                        yincang : [],
                        chongtu : [],
                        type : 2,
                        isShow : true
                    },
                    {
                        name : "乱三风",
                        value : true,
                        isMoRen : true, 
                        posX : 197,
                        posY : -45,
                        ruleKey : "rule_luan3feng",
                        huchi : [],
                        teyou : [],
                        yincang : [],
                        chongtu : [],
                        type : 2,
                        isShow : true
                    },
                    {
                        name : "大嘴2分",
                        value : 2,
                        isMoRen : true, 
                        posX : -183,
                        posY : -118,
                        ruleKey : "rule_dazui",
                        huchi : [7],
                        teyou : [],
                        yincang : [],
                        chongtu : [],
                        type : 1,
                        isShow : false
                    },
                    {
                        name : "大嘴5分",
                        value : 5,
                        isMoRen : false, 
                        posX : 7,
                        posY : -118,
                        ruleKey : "rule_dazui",
                        huchi : [6],
                        teyou : [],
                        yincang : [],
                        chongtu : [],
                        type : 1,
                        isShow : false
                    }
                ],
                //虚线和名字
                [
                    {
                        name : "玩法："
                    }
                ]
            ],
            //南阳
            1301 : [
                //局数
                [
                    {
                        name : "4局",
                        value : 4,
                        isMoRen : true, 
                        posX : -183,
                        posY : 32,
                        type : 1,
                        isShow : true
                    },
                    {
                        name : "8局",
                        value : 8,
                        isMoRen : false, 
                        posX : 88,
                        posY : 32,
                        type : 1,
                        isShow : true
                    }
                ],
                //规则
                [
                    {
                        name : "自摸胡",
                        value : true,
                        isMoRen : true, 
                        posX : -183,
                        posY : 30,
                        ruleKey : "rule_zimo",
                        huchi : [1],
                        teyou : [],
                        yincang : [],
                        chongtu : [],
                        type : 1,
                        isShow : true
                    },
                    {
                        name : "点炮胡",
                        value : false,
                        isMoRen : false, 
                        posX : 90,
                        posY : 30,
                        ruleKey : "rule_zimo",
                        huchi : [0],
                        teyou : [],
                        yincang : [],
                        chongtu : [],
                        type : 1,
                        isShow : true
                    },
                    {
                        name : "杠漂",
                        value : true,
                        isMoRen : false, 
                        posX : -183,
                        posY : -45,
                        ruleKey : "rule_gangpao",
                        huchi : [],
                        teyou : [],
                        yincang : [],
                        chongtu : [],
                        type : 2,
                        isShow : true
                    },
                    {
                        name : "庄家加底",
                        value : true,
                        isMoRen : true, 
                        posX : 90,
                        posY : -45,
                        ruleKey : "rule_zhuangjia",
                        huchi : [],
                        teyou : [],
                        yincang : [],
                        chongtu : [],
                        type : 2,
                        isShow : true
                    },
                    {
                        name : "漏胡",
                        value : true,
                        isMoRen : true, 
                        posX : -183,
                        posY : -118,
                        ruleKey : "rule_louhu",
                        huchi : [],
                        teyou : [],
                        yincang : [],
                        chongtu : [],
                        type : 2,
                        isShow : true
                    },
                    {
                        name : "荒庄荒杠",
                        value : true,
                        isMoRen : false, 
                        posX : 90,
                        posY : -118,
                        ruleKey : "rule_HZHG",
                        huchi : [],
                        teyou : [],
                        yincang : [],
                        chongtu : [],
                        type : 2,
                        isShow : true
                    },
                ],
                //虚线和名字
                [
                    {
                        name : "玩法："
                    }
                ]
            ],
            //周口
            1401 : [
                //局数
                [
                    {
                        name : "4局",
                        value : 4,
                        isMoRen : true, 
                        posX : -183,
                        posY : 32,
                        type : 1,
                        isShow : true
                    },
                    {
                        name : "8局",
                        value : 8,
                        isMoRen : false, 
                        posX : 88,
                        posY : 32,
                        type : 1,
                        isShow : true
                    }
                ],
                //规则
                [
                    {
                        name : "自摸胡",
                        value : true,
                        isMoRen : false, 
                        posX : -183,
                        posY : 30,
                        ruleKey : "rule_zimo",
                        huchi : [1],
                        teyou : [],
                        yincang : [],
                        chongtu : [],
                        type : 1,
                        isShow : true
                    },
                    {
                        name : "点炮胡",
                        value : false,
                        isMoRen : true, 
                        posX : 90,
                        posY : 30,
                        ruleKey : "rule_zimo",
                        huchi : [0],
                        teyou : [],
                        yincang : [],
                        chongtu : [],
                        type : 1,
                        isShow : true
                    },
                    {
                        name : "杠漂",
                        value : true,
                        isMoRen : false, 
                        posX : -183,
                        posY : -45,
                        ruleKey : "rule_gangpao",
                        huchi : [],
                        teyou : [],
                        yincang : [],
                        chongtu : [],
                        type : 2,
                        isShow : true
                    },
                    {
                        name : "杠底留牌",
                        value : true,
                        isMoRen : false, 
                        posX : 90,
                        posY : -45,
                        ruleKey : "rule_gangdiliupai",
                        huchi : [],
                        teyou : [],
                        yincang : [],
                        chongtu : [5],
                        type : 2,
                        isShow : true
                    },
                    {
                        name : "漏胡",
                        value : true,
                        isMoRen : true, 
                        posX : -183,
                        posY : -118,
                        ruleKey : "rule_louhu",
                        huchi : [],
                        teyou : [],
                        yincang : [],
                        chongtu : [],
                        type : 2,
                        isShow : true
                    },
                    {
                        name : "荒庄荒杠",
                        value : true,
                        isMoRen : false, 
                        posX : 90,
                        posY : -118,
                        ruleKey : "rule_HZHG",
                        huchi : [],
                        teyou : [],
                        yincang : [],
                        chongtu : [3],
                        type : 2,
                        isShow : true
                    },
                ],
                //虚线和名字
                [
                    {
                        name : "玩法："
                    }
                ]
            ],
            //商丘
            1501 : [
                //局数
                [
                    {
                        name : "4局商丘",
                        value : 4,
                        isMoRen : true, 
                        posX : -183,
                        posY : 32,
                        type : 1,
                        isShow : true
                    },
                    {
                        name : "8局",
                        value : 8,
                        isMoRen : false, 
                        posX : 88,
                        posY : 32,
                        type : 1,
                        isShow : true
                    }
                ],
                //规则
                [
                    {
                        name : "自摸胡",
                        value : true,
                        isMoRen : true, 
                        posX : -183,
                        posY : 30,
                        ruleKey : "rule_zimo",
                        huchi : [1],
                        teyou : [],
                        yincang : [],
                        chongtu : [],
                        type : 1,
                        isShow : true
                    },
                    {
                        name : "点炮胡",
                        value : false,
                        isMoRen : false, 
                        posX : 90,
                        posY : 30,
                        ruleKey : "rule_zimo",
                        huchi : [0],
                        teyou : [],
                        yincang : [],
                        chongtu : [],
                        type : 1,
                        isShow : true
                    },
                    {
                        name : "杠漂",
                        value : true,
                        isMoRen : false, 
                        posX : -183,
                        posY : -45,
                        ruleKey : "rule_gangpao",
                        huchi : [],
                        teyou : [],
                        yincang : [],
                        chongtu : [],
                        type : 2,
                        isShow : true
                    },
                    {
                        name : "庄家加底",
                        value : true,
                        isMoRen : true, 
                        posX : 90,
                        posY : -45,
                        ruleKey : "rule_zhuangjia",
                        huchi : [],
                        teyou : [],
                        yincang : [],
                        chongtu : [],
                        type : 2,
                        isShow : true
                    },
                    {
                        name : "漏胡",
                        value : true,
                        isMoRen : true, 
                        posX : -183,
                        posY : -118,
                        ruleKey : "rule_louhu",
                        huchi : [],
                        teyou : [],
                        yincang : [],
                        chongtu : [],
                        type : 2,
                        isShow : true
                    },
                    {
                        name : "荒庄荒杠",
                        value : true,
                        isMoRen : false, 
                        posX : 90,
                        posY : -118,
                        ruleKey : "rule_HZHG",
                        huchi : [],
                        teyou : [],
                        yincang : [],
                        chongtu : [],
                        type : 2,
                        isShow : true
                    },
                ],
                //虚线和名字
                [
                    {
                        name : "玩法："
                    }
                ]
            ],

            
        }
    },
});