/**
 * accountController.
 *
 * >>Description<<
 *
 * @author Manfred
 * @date 07.03.14 - 02:11
 */


var accountController = function () {

};
accountController.loginToken = "";
accountController.loggedIn   = false;
accountController.userName   = "";
accountController.showregisterpopup = false;

accountController.logout = function(){
    $.ajax({
        timeout: 30000,
        url: preferences.serverURL + "?logout=" + accountController.loginToken,
        success: function (data) {
        }
    })
    accountController.loggedIn   = false;
    $('#popupLogin').popup('close');
    uiController.styleTopButtons();
    $scope.safeApply();
    uiController.styleTopButtons();
    setTimeout(function(){
        btn.addClass("animated");
    },500)
}

accountController.signIn = function(){
    var send = function (email, pw) {
        pw    = rsaController.rsa.encrypt(pw);
        var username = email;
        email = rsaController.rsa.encrypt(email);
        $.ajax({
            timeout: 30000,
            url: preferences.serverURL + "?login=" + email + "&pw=" +pw,
            success: function (data) {
                if(data!=""){
                    accountController.loggedIn=true;
                    accountController.loginToken = data;
                    accountController.userName =username;
                    var btn = $('#header .ui-btn.animated').removeClass("animated");
                    $('#popupLogin').popup('close');
                    uiController.styleTopButtons();
                    $scope.safeApply();
                    uiController.styleTopButtons();
                    setTimeout(function(){
                        btn.addClass("animated");
                    },500)

                }
                else
                {
                    uiController.toast("Error: Please check your login data.", 1500);
                }
            },
            error: function () {
                uiController.toast("Sorry, it is not possible to login at the moment.", 1500);

            }
        })
    }
    var email =  $("#signinuser").val();
    var pw    =  $("#signinpw").val();
    if(email.length>5 && pw.length > 3){
        send(email,pw);
    }
    else
    {
        uiController.toast("Error: Please check your login data.", 1500);
    }


}

accountController.register = function(){
    var send = function (email, pw) {
        pw    = rsaController.rsa.encrypt(pw);
        var username = email;
        email = rsaController.rsa.encrypt(email);
        $.ajax({
            timeout: 30000,
            url: preferences.serverURL + "?register=" + email + "&pw=" +pw,
            success: function (data) {
                if(data!=""){
                    accountController.loggedIn=true;
                    accountController.loginToken = data;
                    accountController.userName =username;
                    var btn = $('#header .ui-btn.animated').removeClass("animated");
                    $('#popupLogin').popup('close');
                    uiController.styleTopButtons();
                    $scope.safeApply();
                    uiController.styleTopButtons();
                    setTimeout(function(){
                     btn.addClass("animated");
                    },500)
                  }
                else
                {
                    uiController.toast("Error: Please check your data.", 1500);
                }
            } ,
            error: function () {
                uiController.toast("Sorry, it is not possible to register at the moment.", 1500);
            }
        })
    }
    var email =  $("#signinuser").val();
    var pw    =  $("#signinpw").val();
    var pwc   =  $("#signinpwc").val();
    if(pw==pwc && email.length>5 && pw.length > 3){
         send(email,pw);
    }
    else
    {
        uiController.toast("Error: Please check your data.", 1500);
    }


}

accountController.savePlaylist = function(name,data){
    if(accountController.loggedIn){

    }
}

accountController.loadPlaylists = function(){
    if(accountController.loggedIn){

    }
}