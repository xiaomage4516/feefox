require("netbase");

require("Bzip2");

var network = (function () {

    var client = null;

    var isConnected = false;
    var listenerMap = {};

    var msgQueue = [];
    var timer = null;

    var disconnectCb = null;

    var isStop = false;
    var excepts = [];

    function clearMsgs() {
        msgQueue = [];
        isStop = false;
    }

    function stop(e) { //e [] 内容如果为多个值的数组则对应的icode的网络消息暂停处理直到 调用 start 。如果e传 [] 则所有的网络消息暂停处理直到 start
        excepts = e || [];
        isStop = true;
    }

    function start() {
        excepts = [];
        isStop = false;
    }

    function trace (count) {
        var caller = arguments.callee.caller;
        var i = 0;
        count = count || 10;
        util.log("***----------------------------------------  ** " + (i + 1));
        while (caller && i < count) {
            util.log(caller.toString());
            caller = caller.caller;
            i++;
            util.log("***---------------------------------------- ** " + (i + 1));
        }
    }

    function update() {
        while (msgQueue.length > 0) {
            var obj = msgQueue[0];
            if (isStop && (excepts.indexOf(obj.code) >= 0||excepts.length==0))
                return;
            if (listenerMap[obj.code]) {
                msgQueue.shift();
                util.log("recv012: " + JSON.stringify(obj));
                if (!cc.sys.isNative)
                    listenerMap[obj.code](obj.data, obj.errorCode || 0);
                else {
                    try {
                        listenerMap[obj.code](obj.data, obj.errorCode || 0);
                    } catch (e) {
                        if (typeof e === 'string') {
                            util.log("state5  "+e);
                        }
                        else {
                            //util.log("state6  "+"xy: "+obj.code+"filename: "+ e.filename+"lineNum: "+ e.lineNumber+"message: "+e.message+"stack: "+e.stack+"json1: "+JSON.stringify(obj));
                        }
                    }
                }
            }
            else{
                msgQueue.shift();//add by majiangfan
                util.log("recv eee: " + obj.code);
            }
            break;
        }
    }

    function onConnectSuccess() {
        util.log("onConnect");
        isConnected = true;
        timer = setInterval(update, 20);
    }

    function onConnectFailure() {
        util.log("onConnectFailure");
        isConnected = false;
    }

    function onConnectionLost(responseObject) {
        util.log("onConnectionLost");
        clearInterval(timer);
        clearMsgs();
        if (responseObject.errorCode !== 0) {
            util.log("onConnectionLost:"+responseObject.errorMessage);
        }
        isConnected = false;
        if (disconnectCb)
            disconnectCb();
    }

    function onMessageArrived(message) {
        var bytes = message.payloadBytes;

        var a = parseInt(bytes[0]), b = parseInt(bytes[1]);
        var len = a * 256 + b;

        var arr = [];
        for (var j = 2; j < 2 + len; j++)
            arr.push(bytes[j]);

        var str = null;
        try {
            str = bzip2.simple(bzip2.array(arr));
        } catch (e) {

        }

        str = str || String.fromCharCode.apply(null, arr);
        str = str.trim();
        str = str.replace(/'/g, "\"");
        try {
            var obj = JSON.parse(str);
            util.log("network receive json");
            msgQueue.push(obj);
        } catch (e) {
            util.log(str);
            util.log(e);
        }

        if (!obj) {
            var arr = [];
            for (var i = a; i <= b; i++)
                arr.push(bytes[i]);
            var str = String.fromCharCode.apply(null, arr);
            util.log('can not parse: ' + str);
        }
    }

    function recv(obj) {
        msgQueue.push(obj);
    }
    function recv_Client(str) {
        str = str.trim();
        str = str.replace(/'/g, "\"");
        var obj = JSON.parse(str);
        msgQueue.push(obj);
    }
   // network.recv_Client("{'code':'100001','data':{'msage':'abcdefg'}}");
    function addListener(code, cb) {
        listenerMap[code] = cb;
    }

    function removeListener(code) {
        delete listenerMap[code];
    }

    function removeListeners(arr) {
        for (var i = 0; i < arr.length; i++)
            delete listenerMap[arr[i]];
    }

    function send(code, data) {
        if (!isConnected) {
            util.log("已断开连接");
            return;
        }
        var obj = {};
        obj.code = code;
        obj.data = data || {};
        if (gameData.uid)
            obj.uid = gameData.uid;
        // if(gameData.appId){ //sunlin
        //     obj.data.app_id = gameData.appId;
        // }else{
        //     gameData.appId = obj.data.app_id = "henan";
        // }
        client.subscribe("n");
        var message = new Paho.MQTT.Message(JSON.stringify(obj));
        message.destinationName = "n";
        client.send(message);

        util.log("send: " + JSON.stringify(obj));
    }

    var connect = function(params) {
        var url = params.serverUrl;
        var clientId = params.openId;
        var successCB = params.successCB;
        var failureCB = params.failureCB;
        if (isConnected) {
            util.log("network already connect " + url);
            if (successCB) {
                successCB();
            }
            return;
        }

        util.log("network-->connect " + url);
        client = new Paho.MQTT.Client(url, clientId);
        client.onConnectionLost = onConnectionLost;
        client.onMessageArrived = onMessageArrived;
        //服务器断点超时时间
        var m_keepAliveInterval = 8;
        if(gameData.DYKJChannel && ( gameData.DYKJChannel).indexOf("ceshi")>-1){
            m_keepAliveInterval=50000;
        }
        client.connect({
            timeout: 4,
            mqttVersion: 3,
            keepAliveInterval: m_keepAliveInterval,
            onSuccess: function() {
                util.log("network-->connect " + url + " success");
                onConnectSuccess();
                if (successCB)
                    successCB();
            }
            , onFailure: function () {
                util.log("network-->connect " + url + " failure");
                onConnectFailure();
                if (failureCB)
                    failureCB();
            }
        });
    };

    var getLastPingInterval = function () {
        if (isConnected)
            return client.getLastPingInterval();
        else
            return 16888;
    };

    var disconnect = function () {
        //util.log("network--->disconnect");

        if (client) {
            client.disconnect();
        }
        onConnectionLost({errorCode : 0});
        util.log("disconnect");
        isConnected = false;
        listenerMap = {};
        excepts = {};
        timer = null;
        client = null;
    };

    var setOnDisconnectListener = function (cb) {
        disconnectCb = cb;
    };

    var isConnecting = function () {
        return isConnected;
    };

    return {
        connect: connect
        , disconnect: disconnect
        , setOnDisconnectListener: setOnDisconnectListener
        , addListener: addListener
        , removeListener: removeListener
        , removeListeners: removeListeners
        , send: send
        , recv: recv
        , recv_Client:recv_Client
        , clearMsgs: clearMsgs
        , stop: stop
        , start: start
        , getLastPingInterval: getLastPingInterval
        , onConnectSuccess: onConnectSuccess
        , isConnecting : isConnecting
    }

})();

window.network = network;