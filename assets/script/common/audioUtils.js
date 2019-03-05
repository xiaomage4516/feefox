// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        bgmAudioID:-1,
        bgmVolume:1.0,//音乐
        sfxVolume:1.0,//音效
        btn_close_sound:'',
        btn_click_sound:'',
        bgMain:-1,
        silence:-1,


    },
    ctor () {

        this.btn_click_sound = "resources/sound/other/ui_click.mp3";//普通点击按钮    
        this.btn_close_sound = "resources/sound/other/unclickable.mp3";//关闭按钮
    },
    //播放音乐
    playBGM:function(url){
        // if (this.bgmAudioID >= 0) {
            // cc.audioEngine.stop(this.bgmAudioID);
            // cc.audioEngine.stopAll();
            // this.bgmAudioID = -1;
        // }
        var audioUrl = cc.url.raw(url);
        util.log("audioUrl === " + audioUrl);

        //音量去查看gameData.musicStatue,没有默认为1
        // this.bgmAudioID = cc.audioEngine.playMusic(audioUrl,true,this.bgmVolume);
        // this.bgmAudioID = cc.audioEngine.play(audioUrl,true,this.bgmVolume);
        sdk.playMusic(audioUrl);
        util.log("bgmAudioID === " + this.bgmAudioID);
    },
    
    //播放音效
    playSFX(url){
        var audioUrl = cc.url.raw(url);
        if(this.sfxVolume > 0){
            var audioId = cc.audioEngine.play(audioUrl,false,this.sfxVolume);    
        }
    },
    //设置音效
    setSFXVolume:function(v){
        if(this.sfxVolume != v){
            this.sfxVolume = v;
        }
    },
    //设置音乐
    setBGMVolume:function(v){
        // util.log("panduan = bgmAudioID === " + this.bgmAudioID);
        // if(this.bgmAudioID >= 0){
        //     if(v > 0 && this.bgmVolume == 0){
        //         util.log("v > 0 === " + v );
        //         cc.audioEngine.resume(this.bgmAudioID);
        //     } else if (v == 0 && this.bgmVolume > 0) {
        //         util.log("else === " + v );
        //         cc.audioEngine.pause(this.bgmAudioID);
        //     }
        //     //cc.audioEngine.setVolume(this.bgmAudioID,this.bgmVolume);
        // }
        // util.log("setBGMVolume === " + v );
        // if(this.bgmVolume != v){
        //     util.log("setMusicVolume === " + v );
        //     this.bgmVolume = v;
        //     cc.audioEngine.setVolume(this.bgmAudioID,v);
        //     util.log("setVolume = bgmAudioID === " + this.bgmAudioID);
        // }
    },
    setChangeBgm:function(state){
        
        if(state == 1 && gameData.musicStatus == 2){//gameData.musicStatus 1 是开 2 是关
            // cc.audioEngine.stop(this.bgMain);
            // cc.audioEngine.stopAll();
            // this.bgMain = -1;
            sdk.stopMusic();
            var audioUrl = cc.url.raw(config.musicPath);
            sdk.playMusic(audioUrl);
            // this.bgMain = cc.audioEngine.playMusic(audioUrl,true,1.0);
            // this.bgMain = cc.audioEngine.play(audioUrl,true,1.0);
            
            util.log("点击切换按钮--背景音乐--有音乐--setChangeBgm   gameData.musicStatus == "+gameData.musicStatus);//点击之前的状态
        }else if(state == 0 && gameData.musicStatus == 1){
            // cc.audioEngine.stop(this.silence);
            // cc.audioEngine.stopAll();
            // this.silence = -1;
            if (config.platform !== "wechat") {
                sdk.stopMusic();
                var audioUrl = cc.url.raw(config.silencePath);
                sdk.playMusic(audioUrl);
            } else {
                sdk.pauseMusic();
            }
        
            // this.silence = cc.audioEngine.playMusic(audioUrl,true,1.0);
            // this.silence = cc.audioEngine.play(audioUrl,true,1.0);
            
            util.log("点击切换按钮--背景音乐--静音音乐--setChangeBgm  gameData.musicStatus == "+gameData.musicStatus);//点击之前的状态
        }
    },
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    playGameBgm () {
        return;
        // if (gameData.musicStatus) {
        //     audioUtils.playBGM("resources/sound/game/bgm.mp3");
        // }
    },

    start () {

    },

     //界面其他按钮effect
    playClickSoundEffect(){
        this.playSFX(this.btn_click_sound);
    },
    //关闭按钮
    playCloseSoundEffect(){
        this.playSFX(this.btn_close_sound);
    }
});
