/** * authController.
 *
 * >>Description<<
 *
 * @author Norbert
 * @date 22.03.14 - 19:01
 * @copyright  */
var authController = function () {

};

authController.init = function(){
    authController.getToken();
}

authController.ip_token = "auth";
authController.clientip = "";

authController.extractToken = function(token){
    if(token=="init"){
        authController.getToken();
    }
    else if(token=="wait"){
        setTimeout(function () {
            authController.getToken();
        }, 10000);
    }
    else if(token=="down"){
        uiController.toast("Sorry, the Songbase.fm server is not available at the moment!", 1500);
    }
    else if(token!=""){
        mediaController.ip_token = "auth";
        try {
            eval(Base64.decode(token));
            authController.clientip  = mediaController.ipaddress;
            if(authController.clientip == ""){
                mediaController.ip_token = "";
            }
            if(mediaController.ip_token == ""){
                uiController.toast("Sorry, the Songbase.fm server is not available at the moment!", 1500);
            }
            authController.ip_token = mediaController.ip_token;
        } catch (e) {
            uiController.toast("Sorry, the Songbase.fm server is not available at the moment!", 1500);
        }

    }
}

authController.getToken = function (){
    $.ajax({
        url: preferences.serverURL + "init.js",
        success: function (data) {
            console.dir("token");
            console.dir(data);
            if(data.auth && data.auth=="true"){
                authController.extractToken(data.token);
            }
            else{
                uiController.toast("Sorry, the Songbase.fm server is not available at the moment!", 1500);
                setTimeout(function () {
                    authController.getToken();
                }, 15000);

            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            uiController.toast("Sorry, the Songbase.fm server is not available at the moment!", 1500);
            setTimeout(function () {
                authController.getToken();
            }, 30000);
        }

    })
}