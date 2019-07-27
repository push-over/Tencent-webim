//聊天页面增加一条消息

function addMsg (msg, prepend) {
    var isSelfSend, fromAccount, fromAccountNick, fromAccountImage, sessType, subType;


    //获取会话类型，目前只支持群聊
    //webim.SESSION_TYPE.GROUP-群聊，
    //webim.SESSION_TYPE.C2C-私聊，
    sessType = msg.getSession().type();

    isSelfSend = msg.getIsSend(); //消息是否为自己发的

    fromAccount = msg.getFromAccount();
    if (!fromAccount) {
        return;
    }
    if (isSelfSend) { //如果是自己发的消息
        if (loginInfo.identifierNick) {
            fromAccountNick = loginInfo.identifierNick;
        } else {
            fromAccountNick = fromAccount;
        }
        //获取头像
        if (loginInfo.headurl) {
            fromAccountImage = loginInfo.headurl;
        } else {
            fromAccountImage = friendHeadUrl;
        }
    } else { //如果别人发的消息
        var key = webim.SESSION_TYPE.C2C + "_" + fromAccount;
        var info = infoMap[key];
        if (info && info.name) {
            fromAccountNick = info.name;
        } else if (msg.getFromAccountNick()) {
            fromAccountNick = msg.getFromAccountNick();
        } else {
            fromAccountNick = fromAccount;
        }
        //获取头像
        if (info && info.image) {
            fromAccountImage = info.image;
        } else if (msg.fromAccountHeadurl) {
            fromAccountImage = msg.fromAccountHeadurl;
        } else {
            fromAccountImage = friendHeadUrl;
        }
    }

    var onemsg = document.createElement("div");
    if (msg.sending) {
        onemsg.id = "id_" + msg.random;
        //发送中
        var spinner = document.createElement("div");
        spinner.className = "spinner";
        spinner.innerHTML = '<div class="bounce1"></div> <div class="bounce2"></div> <div class="bounce3"></div>';
        onemsg.appendChild(spinner);
    } else {
        $("#id_" + msg.random).remove();
    }

    onemsg.className = "onemsg";
    var msghead = document.createElement("p");
    var msgbody = document.createElement("p");
    var msgPre = document.createElement("pre");
    msghead.className = "msghead";
    msgbody.className = "msgbody";

    onemsg.style.clear = "both";

    if (isSelfSend) {
        onemsg.style.float = "right";
        msgbody.style.textAlign = 'right'
        //昵称  消息时间
        msghead.innerHTML = webim.Tool.formatText2Html(webim.Tool.formatTimeStamp(msg.getTime()) + "&nbsp;&nbsp;" + fromAccountNick) + "&nbsp;&nbsp;" + "<img class='headurlClass' src='" + fromAccountImage + "'>";
    }

    //如果是发给自己的消息
    if (!isSelfSend) {
        msghead.style.color = "blue";
        onemsg.style.float = "left";
        //昵称  消息时间
        msghead.innerHTML = "<img class='headurlClass' src='" + fromAccountImage + "'>" + "&nbsp;&nbsp;" + webim.Tool.formatText2Html(fromAccountNick + "&nbsp;&nbsp;" + webim.Tool.formatTimeStamp(msg.getTime()));
    }

    //解析消息

    //获取消息子类型
    //会话类型为群聊时，子类型为：webim.GROUP_MSG_SUB_TYPE
    //会话类型为私聊时，子类型为：webim.C2C_MSG_SUB_TYPE
    // subType = msg.getSubType();

    msgPre.innerHTML = convertMsgtoHtml(msg);

    msgbody.appendChild(msgPre);

    onemsg.appendChild(msghead);
    onemsg.appendChild(msgbody);
    //消息列表
    var msgflow = document.getElementsByClassName("msgflow")[0];
    if (prepend) {
        //300ms后,等待图片加载完，滚动条自动滚动到底部
        msgflow.insertBefore(onemsg, msgflow.firstChild);
        if (msgflow.scrollTop == 0) {
            setTimeout(function () {
                msgflow.scrollTop = 0;
            }, 300);
        }
    } else {
        msgflow.appendChild(onemsg);
        //300ms后,等待图片加载完，滚动条自动滚动到底部
        setTimeout(function () {
            msgflow.scrollTop = msgflow.scrollHeight;
        }, 300);
    }


}
//把消息转换成Html

function convertMsgtoHtml (msg) {
    var html = "",
        elems, elem, type, content;
    elems = msg.getElems(); //获取消息包含的元素数组
    var count = elems.length;
    for (var i = 0; i < count; i++) {
        elem = elems[i];
        type = elem.getType(); //获取元素类型

        content = elem.getContent(); //获取元素对象

        var eleHtml = convertTextMsgToHtml(content);
        //转义，防XSS
        html += webim.Tool.formatText2Html(eleHtml);

    }
    return html;
}

//解析文本消息元素

function convertTextMsgToHtml (content) {
    return content.getText();
}