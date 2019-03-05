var GameConfig = {

    // GameScene
    PLAYER_MAX : 4,
    // 操作
    OP_CHI : 1,
    OP_PENG : 2,
    OP_GANG : 3,
    OP_HU : 4,
    OP_PASS : 5,
    OP_TING : 6,
    // 操作按钮数量
    OP_SP_NUMBER : 5,

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

    // GamePlayer
    // 牌垛0 手牌1 牌组2 出牌3 牌堆4 结算5
    // 牌垛
    // 牌垛最大数量
    LEFT_MAX : 13,
    // 牌垛中心与容器中心偏移
    LEFT_SHIFT : [
        {
            x : 0,
            y : -250,
        },
        {
            x : -200,
            y : 0,
        },
        {
            x : 0,
            y : 250,
        },
        {
            x : 200,
            y : 0,
        },
    ],
    // 手牌
    // 最多手牌数
    HAND_MAX : 13,
    // 手牌zorder
    HAND_ZORDER : [
        [12,11,10,9,8,7,6,5,4,3,2,1,0,13],
        [1,2,3,4,5,6,7,8,9,10,11,12,13,0],
        [1,2,3,4,5,6,7,8,9,10,11,12,13,0],
        [12,11,10,9,8,7,6,5,4,3,2,1,0,13],
    ],
    // 摸牌和手牌的距离
    HAND_SPACE : [30, 20, 25, 20],
    // 手牌中心与容器中心偏移
    HAND_SHIFT : [
        {
            x : 0,
            y : -330,
        },
        {
            x : -200,
            y : 20,
        },
        {
            x : -38,
            y : 300,
        },
        {
            x : 200,
            y : 20,
        },
    ],
    // 手牌选中位移
    HAND_SELECT : 40,
    // 出牌
    // 出牌中心与轮盘中心偏移
    OUT_SHIFT : [
        {
            x : 0,
            y : -100,
        },
        {
            x : 150,
            y : 0,
        },
        {
            x : 0,
            y : 100,
        },
        {
            x : -150,
            y : 0,
        },
    ],
    // 牌堆
    // 牌堆最大数量
    TABLE_MAX : 28,
    // 每行摆几张牌
    TABLE_NUMBER : [8, 8, 8, 8],
    // 牌堆每层摆几行
    TABLE_LINE : [3, 3, 3, 3],
    // 牌堆与轮盘距离
    TABLE_SPACE : [30, 140, 30, 140],

    // 碰牌ZORDER，左中右
    PENG_ZORDER : [
        [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [9, 10, 11],
        ],
        [
            [11, 10, 9],
            [8, 7, 6],
            [5, 4, 3],
            [2, 1, 0],
        ],
        [
            [2, 1, 0],
            [5, 4, 3],
            [8, 7, 6],
            [11, 10, 9],
        ],
        [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [9, 10, 11],
        ],
    ],
    // 杠牌ZORDER，左中右上
    GANG_ZORDER : [
        [
            [0, 1, 2, 12],
            [3, 4, 5, 13],
            [6, 7, 8, 14],
            [9, 10, 11, 15],
        ],
        [
            [11, 10, 9, 15],
            [8, 7, 6, 14],
            [5, 4, 3, 13],
            [2, 1, 0, 12],
        ],
        [
            [2, 1, 0, 12],
            [5, 4, 3, 13],
            [8, 7, 6, 14],
            [11, 10, 9, 15],
        ],
        [
            [0, 1, 2, 12],
            [3, 4, 5, 13],
            [6, 7, 8, 14],
            [9, 10, 11, 15],
        ],
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
                    res : 13,
                    cardScale : 0.95,
                    valueRes : 2,
                    valueRotation : 270,
                },
                // 反面
                {
                    res : 14,
                    cardScale : 0.95,
                    valueRes : 2,
                    valueRotation : 270,
                },
            ],
        ],
        // 玩家2
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
                    res : 9,
                    cardScale : 1,
                    valueRes : 1,
                    valueRotation : 0,
                },
                // 反面
                {
                    res : 10,
                    cardScale : 1,
                    valueRes : 1,
                    valueRotation : 0,
                },
            ],
            // 牌组
            [
                // 正面
                {
                    res : 11,
                    cardScale : 0.8,
                    valueRes : 2,
                    valueRotation : 0,
                },
                // 反面
                {
                    res : 12,
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
                    res : 11,
                    cardScale : 0.95,
                    valueRes : 2,
                    valueRotation : 0,
                },
                // 反面
                {
                    res : 12,
                    cardScale : 0.95,
                    valueRes : 2,
                    valueRotation : 0,
                },
            ],
        ],
        // 玩家3
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
                    res : 15,
                    cardScale : 0.95,
                    valueRes : 2,
                    valueRotation : 90,
                },
                // 反面
                {
                    res : 16,
                    cardScale : 0.95,
                    valueRes : 2,
                    valueRotation : 90,
                },
            ],
        ],
    ],
    // 牌尺寸
    RES_SIZE : [{},
        {
            // 1 玩家0手牌正
            length : 19,
            width : 85,
            height : 104,
            scaleX : 0.92,
            scaleY : 0.92,
        },
        {
            // 2 玩家0手牌反
            length : 19,
            width : 85,
            height : 104,
            scaleX : 0.92,
            scaleY : 0.92,
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
            width : 36,
            height : 15,
            scaleX : 0.38,
            scaleY : 0.47,
        },
        {
            // 8
            length : 57,
            width : 36,
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
            width : 46,
            height : 14,
            scaleX : 0.5,
            scaleY : 0.5,
        },
        {
            // 12
            length : 55,
            width : 46,
            height : 14,
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
            width : 36,
            height : 15,
            scaleX : 0.38,
            scaleY : 0.47,
        },
        {
            // 18，癞子牌的方向，牌同8
            length : 57,
            width : 36,
            height : 15,
            scaleX : 0.38,
            scaleY : 0.47,
        },
    ],

    // 根据屏幕尺寸校正牌尺寸
    resizeCard : function(realWidth) {
        if (this.resizeFlag) {
            // 已经校正过
            return;
        }
        else {
            this.resizeFlag = true;
        }
        let designWidth = 1334;
        // 获取当前屏幕的实际分辨率
        if (realWidth >= designWidth) {
            return;
        }
        // 保持比例缩放
        let scale = ((this.RES_SIZE[1].width*this.HAND_MAX + this.HAND_SPACE[0])/designWidth*realWidth - this.HAND_SPACE[0])/this.HAND_MAX/this.RES_SIZE[1].width;

        // 0号玩家
        let scale_0 = scale;
        // 手牌1
        this.CARD_RES[0][1][0].cardScale *= scale_0;
        this.CARD_RES[0][1][1].cardScale *= scale_0;
        // 牌组2
        this.CARD_RES[0][2][0].cardScale *= scale_0;
        this.CARD_RES[0][2][1].cardScale *= scale_0;
        // 出牌3
        // this.CARD_RES[0][3][0].cardScale *= scale_0;
        // this.CARD_RES[0][3][1].cardScale *= scale_0;
        // 结算5
        this.CARD_RES[0][5][0].cardScale *= scale_0;
        this.CARD_RES[0][5][1].cardScale *= scale_0;

        // 1号玩家
        let scale_1 = scale;
        // 出牌3
        // this.CARD_RES[1][3][0].cardScale *= scale_1;
        // this.CARD_RES[1][3][1].cardScale *= scale_1;

        // 2号玩家
        let scale_2 = scale;
        // 手牌1
        this.CARD_RES[2][1][0].cardScale *= scale_2;
        this.CARD_RES[2][1][1].cardScale *= scale_2;
        // 牌组2
        this.CARD_RES[2][2][0].cardScale *= scale_2;
        this.CARD_RES[2][2][1].cardScale *= scale_2;
        // 出牌3
        // this.CARD_RES[2][3][0].cardScale *= scale_2;
        // this.CARD_RES[2][3][1].cardScale *= scale_2;
        // 结算5
        this.CARD_RES[2][5][0].cardScale *= scale_2;
        this.CARD_RES[2][5][1].cardScale *= scale_2;

        // 3号玩家
        let scale_3 = scale;
        // 出牌3
        // this.CARD_RES[3][3][0].cardScale *= scale_3;
        // this.CARD_RES[3][3][1].cardScale *= scale_3;
    },
};

module.exports = GameConfig;