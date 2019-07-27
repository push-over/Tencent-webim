//解决IE8之下document不支持getElementsByClassName方法
if (!document.getElementsByClassName) {
    document.getElementsByClassName = function (className, element) {
        var children = (element || document).getElementsByTagName('*');
        var elements = new Array();
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            var classNames = child.className.split(' ');
            for (var j = 0; j < classNames.length; j++) {
                if (classNames[j] == className) {
                    elements.push(child);
                    break;
                }
            }
        }
        return elements;
    };
}


//点击登录按钮(独立模式)
function independentModeLogin () {
    if ($("#login_account").val().length == 0) {
        alert('请输入帐号');
        return;
    }
    if ($("#login_pwd").val().length == 0) {
        alert('请输入UserSig');
        return;
    }
    if ($("#selToID").val().length == 0) {
        alert('请输入selToID');
        return;
    }
    loginInfo.identifier = $('#login_account').val();
    loginInfo.userSig = $('#login_pwd').val();
    selToID = $('#selToID').val();
    webimLogin(function () {
        $('#login_dialog').hide();
    }, function () { });
}

//初始化demo

function initDemoApp () {
    $("body").css("background-color", '#2f2f2f');
    $("#webim_demo").show();
    document.getElementById("p_my_face").src = loginInfo.headurl || './images/me.jpg';
    if (loginInfo.identifierNick) {
        document.getElementById("t_my_name").innerHTML = webim.Tool.formatText2Html(loginInfo.identifierNick);
    } else {
        document.getElementById("t_my_name").innerHTML = webim.Tool.formatText2Html(loginInfo.identifier);
    }
}