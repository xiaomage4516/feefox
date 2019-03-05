var ENUM_MJ = {
    TUIDAOHU:0,
    ZHENGZHOU:1,
    XINYANG:2
}
var rules_name = {0:"基本规则",1:"基本番型",2:"特殊规则",3:"游戏结算"};
cc.Class({
    extends: cc.Component,

    properties: {
        _leftItemTemp :null,
        _nowSelLeftBtn:null,//设置左边按钮显示那个按钮高亮的时候用了一下
        _leftBtnData:null,
        leftBtnPic:{
            default:[],
            type:cc.SpriteFrame
        },

        btn_left_content:{
            default:null,
            type: cc.Node
        },
        btn_right_content:{
            default:null,
            type: cc.Node
        },
        _nowClickBtnId:null,//当前点击左边按钮的ID
        //右边列表
        _rightBtnData:null,
        cur_content_index:null,
        rightContentLabel:{
            default:null,
            type:cc.Label
        },

    },

     onLoad:function() {
         var self = this;
         this._leftItemTemp = this.btn_left_content.children[0];
         this.btn_left_content.removeChild(this._leftItemTemp);

         //右边
         this._rightItemTemp = this.btn_right_content.children[0];
         this.btn_right_content.removeChild(this._rightItemTemp);
         util.loadJsonFile("json/GameAnnouncement_Common", function (data) {
             //左边数据
             //util.log( data );
             //util.log("左边按钮数量 ： " + data.length);
             self._leftBtnData = data;
             //util.log("左边按钮数量1 ： " + self._leftBtnData.length);
             //名字显示格式不对，可以在这里转格式；
             self._rightBtnData =  data;
             if(self._leftBtnData.length === 0){
                 self.btn_left_content.setVisible(false);
             }

             self._nowClickBtnId = 0;//默认点击的左边按钮ID为0

             if(self._rightBtnData.length == 0){
                 self._rightContent.setVisible(false);
             }

             self.cur_content_index = 0;
             self.initLeftBtnList(self._leftBtnData);
             self.initRightList(self._rightBtnData);

         });
     },
    // 初始化左边列表
    initLeftBtnList:function(data){
        this._nowSelLeftBtn = 0;

        for(var i = 0; i < data.length; ++i ){// data.length
            var node = this.createLeftItem(i);
            node.idx = i;
            node.setTag(data[i]["id"]);
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

        this.showRightContent(0,0);
    },
    //更新内容
    // 初始化右边列表
    initRightList:function(data){
        this.cur_content_index = 0;
        for(var i = 0; i < 4; ++i ){
            var node = this.createRightItem(i);
            node.idx = i;
            node.setTag(1000+i);
            //没有选中状态
            //但是有一个   是否是开放状态
            if(this.cur_content_index == i){//可以玩
                node.getChildByName("btn_right_0").active = true;
                node.getChildByName("btn_right_1").active = false;
            }else{//暂未开放
                node.getChildByName("btn_right_1").active = true;
                node.getChildByName("btn_right_0").active = false;
            }
            node.getChildByName("rules_name").getComponent(cc.Label).string = rules_name[i];
        }



        this.showRightContent(0,0);

    },
    //左边按钮点击回调，设置点击按钮高亮
    onLeftItemClicked:function(event){
        audioUtils.playClickSoundEffect();
        var idx = event.target.idx;
        this._nowClickBtnId = idx;
        //设置所有按钮为正常状态
        for(var j = 0; j < this._leftBtnData.length;++j){// this._leftBtnData.length
            var node1 = this.btn_left_content.getChildByTag(this._leftBtnData[j]["id"]);
            node1.getChildByName("btn_left_1").active = true;
            node1.getChildByName("btn_left_0").active = false;
        };
        //设置点击的按钮为高亮状态
        event.target.getChildByName("btn_left_0").active = true;
        event.target.getChildByName("btn_left_1").active = false;

        this.showRightContent(this._nowClickBtnId, this.cur_content_index);
    },
    //右边按钮点击回调
    onRightItemClicked:function(event){
        audioUtils.playClickSoundEffect();
        var idx = event.target.idx;
        this.cur_content_index = idx;

        //if(idx>3){//结算没配置
        //    idx =3;
        //}

        for(var j = 0; j < 4;++j){
            var node1 = this.btn_right_content.getChildByTag(1000+j);
            node1.getChildByName("btn_right_1").active = true;
            node1.getChildByName("btn_right_0").active = false;
        };
        //设置点击的按钮为高亮状态
        event.target.getChildByName("btn_right_0").active = true;
        event.target.getChildByName("btn_right_1").active = false;

        this.showRightContent(this._nowClickBtnId, idx)
    },
    //先怼上功能，迭代优化
    showRightContent: function (left_btn_index,right_btn_index) {
      switch (left_btn_index){
          case 0:
              switch (right_btn_index){ //选规则
                  case 0:
                      this.rightContentLabel.string = this._rightBtnData[left_btn_index]["ziwanfa"][0]["des1"];
                      break;
                  case 1:
                      this.rightContentLabel.string = this._rightBtnData[left_btn_index]["ziwanfa"][0]["des2"];
                      break;
                  case 2:
                      this.rightContentLabel.string = this._rightBtnData[left_btn_index]["ziwanfa"][0]["des3"];
                      break;
                  case 3:
                      this.rightContentLabel.string = this._rightBtnData[left_btn_index]["ziwanfa"][0]["des4"];
                      break;
              }
              break;
          case 1:
              switch (right_btn_index){
                  case 0:
                      this.rightContentLabel.string = this._rightBtnData[left_btn_index]["ziwanfa"][0]["des1"];
                      break;
                  case 1:
                      this.rightContentLabel.string = this._rightBtnData[left_btn_index]["ziwanfa"][0]["des2"];
                      break;
                  case 2:
                      this.rightContentLabel.string = this._rightBtnData[left_btn_index]["ziwanfa"][0]["des3"];
                      break;
                  case 3:
                      this.rightContentLabel.string = this._rightBtnData[left_btn_index]["ziwanfa"][0]["des4"];
                      break;
              }
                  break;
          case 2:
              switch (right_btn_index){
                  case 0:
                      this.rightContentLabel.string = this._rightBtnData[left_btn_index]["ziwanfa"][0]["des1"];
                      break;
                  case 1:
                      this.rightContentLabel.string = this._rightBtnData[left_btn_index]["ziwanfa"][0]["des2"];
                      break;
                  case 2:
                      this.rightContentLabel.string = this._rightBtnData[left_btn_index]["ziwanfa"][0]["des3"];
                      break;
                  case 3:
                      this.rightContentLabel.string = this._rightBtnData[left_btn_index]["ziwanfa"][0]["des4"];
                      break;
              }
              break;
      }
    },

    //添加左边按钮
    createLeftItem:function(index){
        var leftContent = this.btn_left_content;
        if(leftContent.childrenCount > index){//已经添加过了
            return leftContent.children[index];
        }
        var node = cc.instantiate(this._leftItemTemp);
        leftContent.addChild(node);
        return node;
    },
    //创建Right内容
    createRightItem: function (index) {
        var rightContent = this.btn_right_content;
        if(rightContent.childrenCount > index){//已经添加过了
            return rightContent.children[index];
        }
        var node = cc.instantiate(this._rightItemTemp);
        rightContent.addChild(node);
        return node;
    },
     start:function () {

     },
     onBtnClose: function () {
        audioUtils.playCloseSoundEffect();
        this.node.destroy();
     }

});
