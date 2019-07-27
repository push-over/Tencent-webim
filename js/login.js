function webimLogin (successCB, errorCB) {
    webim.login(
        loginInfo, listeners, options,
        function (resp) {
            successCB && successCB(resp);
            loginInfo.identifierNick = resp.identifierNick; //设置当前用户昵称
            loginInfo.headurl = resp.headurl; //设置当前用户头像
            initDemoApp();
        },
        function (err) {
            alert(err.ErrorInfo);
            errorCB && errorCB(err);
        }
    );
}
