//
cc.Class({
    extends: cc.Component,

    properties: {
	    logScrollView: {
            default: null,
            type: cc.ScrollView,
        },
        theOnlyOneLogLabel: {
	        default: null,
            type: cc.Label,
        }
    },

    ctor () {
        
    },

    onButtonClose () {
        //
        this.node.active = false;

    },

    appendLogLine (lineLog) {
        if (!this.theOnlyOneLogLabel) {
            cc.log("theOnlyOneLogLabel null, error log: " + lineLog);
            return;
        }
        //
        var curLogText = this.theOnlyOneLogLabel.string;
        curLogText += "\n";
        curLogText += lineLog;
        //
        var parentContent = this.theOnlyOneLogLabel.node.parent;
        parentContent.height += 28;
        var maxWidth = lineLog.length * 12;
        if (maxWidth > parentContent.width) {
            parentContent.width = maxWidth;
        }
        //
        this.theOnlyOneLogLabel.string = curLogText;
        //

    }

});