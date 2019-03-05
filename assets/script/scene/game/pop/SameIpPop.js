// 相同ip提示弹窗

cc.Class({
    extends: cc.Component,

    properties: {
    },

    start () {

    },

    refresh (data) {
        // <color=#49fff4>[蓝色]</color> <color=#ff0000>红色</color>
        let disHeight = 0;
        if (data.gps) {
            let disContent = cc.find("bg/disTip/disContent", this.node);
            let disString = "";
            
            if (data.gps.length > 0) {
                // 有数据
                for (let i = 0; i < data.gps.length; i++) {
                    let gpsData = data.gps[i];
                    disString += "<color=#49fff4>[" + decodeURIComponent(gpsData[0]) + "]</color>";
                    for (let j = 1; j < gpsData.length; j++) {
                        disString += " 与 <color=#49fff4>[" + decodeURIComponent(gpsData[j]) + "]</color>";
                    }
                    disString += "<color=#ff0000> 距离过近</color>\n";
                }
                disContent.getComponent("cc.RichText").string = disString;
                disHeight = disContent.height;
                cc.find("bg/disTip", this.node).active = true;
            }
            else {
                // 没有数据
                cc.find("bg/disTip", this.node).active = false;
            }
        }

        let ipHeight = 0;
        if (data.ip) {
            let ipContent = cc.find("bg/ipTip/ipContent", this.node);
            let ipString = "";
            
            if (data.ip.length > 0) {
                // 有数据
                for (let i = 0; i < data.ip.length; i++) {
                    let ipData = data.ip[i];
                    ipString += "<color=#49fff4>[" + decodeURIComponent(ipData[0]) + "]</color>";
                    for (let j = 1; j < ipData.length; j++) {
                        ipString += " 与 <color=#49fff4>[" + decodeURIComponent(ipData[j]) + "]</color>";
                    }
                    ipString += "<color=#ff0000> IP地址相同</color>\n";
                }
                ipContent.getComponent("cc.RichText").string = ipString;
                ipHeight = ipContent.height;
                cc.find("bg/ipTip", this.node).active = true;
            }
            else {
                // 没有数据
                cc.find("bg/ipTip", this.node).active = false;
            }
        }
        
        cc.find("bg/ipTip", this.node).y = cc.find("bg/disTip", this.node).y - disHeight;
        cc.find("bg", this.node).height = disHeight + ipHeight + 60;

        this.show();
    },

    show () {
        if (!this.node.active) {
            this.node.active = true;
            this.node.stopAllActions();
            this.node.runAction(
                cc.sequence(
                    cc.delayTime(5),
                    cc.callFunc(function () {
                        this.node.active = false;
                    }, this)
                )
            );
        }
    },
    hide () {
        if (this.node.active) {
            this.node.active = false;
        }
    },
});