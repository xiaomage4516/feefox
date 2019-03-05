var GamePDKConfig = {

    // GameScene
    PLAYER_MAX : 3,

    // 房间状态
    STATUS_MATCHING : 3,
    STATUS_WAITING : 0,
    STATUS_GOING : 1,
    STATUS_ENDING : 2,

    // 弹窗层级，默认0
    POP_ZORDER : {
        "ChatPop" : 0,
        "FriendEndingPop" : 0,
        "FriendDismissPop" : 0,
        "FriendExitPop" : 0,
        "MateExitPop" : 0,
        "SameIpPop" : 0,
        "AutoPop" : 0,
        "XiaPaoPop" : 0,
        "TingPop" : 0,
        "OpMultiPop" : 0,
    },

    // 牌垛最大数量
    LEFT_MAX : 16,
   // 牌垛中心与容器中心偏移
   LEFT_SHIFT : [
    {
        x : 0,
        y : 0,
    },
    {
        x : -100,
        y : 97,
    },
    {
        x : 100,
        y : 97,
    }
    ],
    // 手牌
    // 最多手牌数
    HAND_MAX : 16,
    //手牌弧度半径
    HAND_RADIUS : 1676,//1696
    //手牌圆心Y坐标
    HAND_Y : -1926,//1946
    // 手牌zorder
    HAND_ZORDER : [
        [15,14,13,12,11,10,9,8,7,6,5,4,3,2,1,0]
    ],
    // 小结算zorder
    Result_ZORDER : [
        [15,14,13,12,11,10,9,8,7,6,5,4,3,2,1,0],
        [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],
        [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],
    ],
    // 摸牌和手牌的距离
    HAND_SPACE : [30, 20, 25, 20],
    // 手牌中心与容器中心偏移
    HAND_SHIFT : [
        {
            x : 35,
            y : -240,
        }
    ],
    // 手牌选中位移
    HAND_SELECT : 40,
    // 出牌
    // 出牌中心与轮盘中心偏移
    OUT_SHIFT : [
        {
            x : 0,
            y : 80,
        },
        {
            x : 0,
            y : 80,
        },
        {
            x : 0,
            y : 80,
        },
    ],

    // 创建牌资源
    CARD_RES : [
        // 玩家0
        [
            // 牌垛
            [
                // 正面
                {
                    res : 11,
                    cardScale : 1,
                    valueRes : 2,
                    valueRotation : 0,
                },
                // 反面
                {
                    res : 12,
                    cardScale : 1,
                    valueRes : 2,
                    valueRotation : 0,
                },
            ],
            // 手牌
            [
                // 正面
                {
                    res : 1,
                    cardScale : 1,
                    valueRes : 1,
                    valueRotation : 0,
                },
                // 反面
                {
                    res : 2,
                    cardScale : 1,
                    valueRes : 1,
                    valueRotation : 0,
                },
            ],
            // 牌组
            [
                // 正面
                {
                    res : 3,
                    cardScale : 0.8,
                    valueRes : 2,
                    valueRotation : 0,
                },
                // 反面
                {
                    res : 4,
                    cardScale : 0.8,
                    valueRes : 2,
                    valueRotation : 0,
                },
            ],
            // 出牌
            [
                // 正面
                {
                    res : 1,
                    cardScale : 0.8,
                    valueRes : 1,
                    valueRotation : 0,
                },
                // 反面
                {
                    res : 2,
                    cardScale : 0.8,
                    valueRes : 1,
                    valueRotation : 0,
                },
            ],
            // 牌堆
            [
                // 正面
                {
                    res : 11,
                    cardScale : 1,
                    valueRes : 2,
                    valueRotation : 0,
                },
                // 反面
                {
                    res : 12,
                    cardScale : 1,
                    valueRes : 2,
                    valueRotation : 0,
                },
            ],
            // 结算
            [
                // 正面
                {
                    res : 3,
                    cardScale : 1,
                    valueRes : 2,
                    valueRotation : 0,
                },
                // 反面
                {
                    res : 4,
                    cardScale : 1,
                    valueRes : 2,
                    valueRotation : 0,
                },
            ],
        ],
        // 玩家1
        [
            // 牌垛
            [
                // 正面
                {
                    res : 7,
                    cardScale : 1,
                    valueRes : 2,
                    valueRotation : 270,
                },
                // 反面
                {
                    res : 8,
                    cardScale : 1,
                    valueRes : 2,
                    valueRotation : 270,
                },
            ],
            // 手牌
            [
                // 正面
                {
                    res : 5,
                    cardScale : 1,
                    valueRes : 1,
                    valueRotation : 0,
                },
                // 反面
                {
                    res : 6,
                    cardScale : 1,
                    valueRes : 1,
                    valueRotation : 0,
                },
            ],
            // 牌组
            [
                // 正面
                {
                    res : 13,
                    cardScale : 0.85,
                    valueRes : 2,
                    valueRotation : 270,
                },
                // 反面
                {
                    res : 14,
                    cardScale : 0.85,
                    valueRes : 2,
                    valueRotation : 270,
                },
            ],
            // 出牌
            [
                // 正面
                {
                    res : 1,
                    cardScale : 0.8,
                    valueRes : 1,
                    valueRotation : 0,
                },
                // 反面
                {
                    res : 2,
                    cardScale : 0.8,
                    valueRes : 1,
                    valueRotation : 0,
                },
            ],
            // 牌堆
            [
                // 正面
                {
                    res : 7,
                    cardScale : 1,
                    valueRes : 2,
                    valueRotation : 270,
                },
                // 反面
                {
                    res : 8,
                    cardScale : 1,
                    valueRes : 2,
                    valueRotation : 270,
                },
            ],
            // 结算
            [
                // 正面
                {
                    res : 3,
                    cardScale : 1,
                    valueRes : 2,
                    valueRotation : 0,
                },
                // 反面
                {
                    res : 4,
                    cardScale : 1,
                    valueRes : 2,
                    valueRotation : 0,
                },
            ],
        ],
        // 玩家2
        [
            // 牌垛
            [
                // 正面
                {
                    res : 17,
                    cardScale : 1,
                    valueRes : 2,
                    valueRotation : 90,
                },
                // 反面
                {
                    res : 18,
                    cardScale : 1,
                    valueRes : 2,
                    valueRotation : 90,
                },
            ],
            // 手牌
            [
                // 正面
                {
                    res : 6,
                    cardScale : 1,
                    valueRes : 1,
                    valueRotation : 0,
                },
                // 反面
                {
                    res : 5,
                    cardScale : 1,
                    valueRes : 1,
                    valueRotation : 0,
                },
            ],
            // 牌组
            [
                // 正面
                {
                    res : 15,
                    cardScale : 0.85,
                    valueRes : 2,
                    valueRotation : 90,
                },
                // 反面
                {
                    res : 16,
                    cardScale : 0.85,
                    valueRes : 2,
                    valueRotation : 90,
                },
            ],
            // 出牌
            [
                // 正面
                {
                    res : 1,
                    cardScale : 0.8,
                    valueRes : 1,
                    valueRotation : 0,
                },
                // 反面
                {
                    res : 2,
                    cardScale : 0.8,
                    valueRes : 1,
                    valueRotation : 0,
                },
            ],
            // 牌堆
            [
                // 正面
                {
                    res : 17,
                    cardScale : 1,
                    valueRes : 2,
                    valueRotation : 90,
                },
                // 反面
                {
                    res : 18,
                    cardScale : 1,
                    valueRes : 2,
                    valueRotation : 90,
                },
            ],
            // 结算
            [
                // 正面
                {
                    res : 3,
                    cardScale : 1,
                    valueRes : 2,
                    valueRotation : 0,
                },
                // 反面
                {
                    res : 4,
                    cardScale : 1,
                    valueRes : 2,
                    valueRotation : 0,
                },
            ],
        ]
    ],
    // 牌尺寸
    RES_SIZE : [{},
        {
            // 1 玩家0手牌正
            length : 19,
            width : 50,
            height : 104,
            scaleX : 1,
            scaleY : 1,
        },
        {
            // 2 玩家0手牌反
            length : 19,
            width : 50,
            height : 104,
            scaleX : 1,
            scaleY : 1,
        },
        {
            // 3
            length : 104,
            width : 85,
            height : 19,
            scaleX : 0.92,
            scaleY : 0.92,
        },
        {
            // 4
            length : 104,
            width : 85,
            height : 19,
            scaleX : 0.92,
            scaleY : 0.92,
        },
        {
            // 5
            length : 31,
            width : 30,
            height : 39,
            scaleX : 0.4,
            scaleY : 0.5,
        },
        {
            // 6
            length : 31,
            width : 30,
            height : 39,
            scaleX : 0.4,
            scaleY : 0.5,
        },
        {
            // 7
            length : 57,
            width : 0,//1号位置牌垛上下位置
            height : 15,
            scaleX : 0.38,
            scaleY : 0.47,
        },
        {
            // 8
            length : 57,
            width : 0,//1号位置牌垛上下位置
            height : 15,
            scaleX : 0.38,
            scaleY : 0.47,
        },
        {
            // 9
            length : 14,
            width : 46,
            height : 55,
            scaleX : 0.5,
            scaleY : 0.5,
        },
        {
            // 10
            length : 14,
            width : 46,
            height : 55,
            scaleX : 0.5,
            scaleY : 0.5,
        },
        {
            // 11
            length : 55,
            width : 1,//0号位置牌跺之间间距 x
            height : -1, // y
            scaleX : 0.5,
            scaleY : 0.5,
        },
        {
            // 12        
            length : 55,
            width : 1,//0号位置牌跺之间间距
            height : -1,
            scaleX : 0.5,
            scaleY : 0.5,
        },
        {
            // 13
            length : 51,
            width : 30,
            height : 12,
            scaleX : 0.35,
            scaleY : 0.4,
        },
        {
            // 14
            length : 51,
            width : 30,
            height : 12,
            scaleX : 0.35,
            scaleY : 0.4,
        },
        {
            // 15，癞子牌的方向，牌同13
            length : 51,
            width : 30,
            height : 12,
            scaleX : 0.35,
            scaleY : 0.4,
        },
        {
            // 16，癞子牌的方向，牌同14
            length : 51,
            width : 30,
            height : 12,
            scaleX : 0.35,
            scaleY : 0.4,
        },
        {
            // 17，癞子牌的方向，牌同7
            length : 57,
            width : 0,//1号位置牌垛上下位置
            height : 15,
            scaleX : 0.38,
            scaleY : 0.47,
        },
        {
            // 18，癞子牌的方向，牌同8
            length : 57,
            width : 0,//1号位置牌垛上下位置
            height : 15,
            scaleX : 0.38,
            scaleY : 0.47,
        },
    ],
    getCard : function (number) {
        var type = Math.floor(Math.floor(number / 13) + 0.5);
        var type1 = type + 1;
        var value = number - type * 13 + 1;
        var weight = value;
        if (type1 == 5)
            weight = value + 15;
        else if (value <= 2)
            weight = value + 13;
        var voice = weight;
        //A和2的音效是  1 2
        if (value == 1) voice = 1;
        if (value == 2) voice = 2;
        return {
            type: type1,
            value: value,
            number: number,
            name: type + "_" + value,
            weight: weight,
            voice: voice,
            changeToNumber: number % 13,
            isLaizi: false
        };
    },
};

module.exports = GamePDKConfig;