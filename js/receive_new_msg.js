//监听新消息事件
var msgList = [];
var dateStart = null;
var dateEnd = null;
//newMsgList 为新消息数组，结构为[Msg]
function onMsgNotify (newMsgList) {
    //console.warn(newMsgList);
    var sess, newMsg;
    //获取所有聊天会话
    var sessMap = webim.MsgStore.sessMap();

    for (var j in newMsgList) { //遍历新消息
        newMsg = newMsgList[j];

        if (!selToID) { //没有聊天对象, selToID 为全局变量，表示当前正在进行的聊天 id，当聊天类型为私聊时，该值为好友帐号，否则为群号。
            selToID = newMsg.getSession().id();
            selType = newMsg.getSession().type();
            selSess = newMsg.getSession();
            var headUrl;
            if (selType == webim.SESSION_TYPE.C2C) {
                headUrl = friendHeadUrl;
            } else {
                headUrl = groupHeadUrl;
            }
            addSess(selType, selToID, newMsg.getSession().name(), headUrl, 0, 'sesslist'); //新增一个对象
            setSelSessStyleOn(selToID);
        }
        if (newMsg.getSession().id() == selToID) { //为当前聊天对象的消息
            //在聊天窗体中新增一条消息
            //console.warn(newMsg);
            addMsg(newMsg);
        }
        msgList.push(newMsg.elems[0].content.text);
    }
    //消息已读上报，以及设置会话自动已读标记
    // webim.setAutoRead(selSess, true, true);

    for (var i in sessMap) {
        sess = sessMap[i];
        if (selToID != sess.id()) { //更新其他聊天对象的未读消息数
            if (!dateStart) {
                dateStart = new Date();
            }
            updateSessDiv(sess.type(), sess.id(), sess.name(), sess.unread());
            console.debug(sess.id(), sess.unread());
            dateEnd = new Date();
        }
    }
}