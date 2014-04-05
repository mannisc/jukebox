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

var rsaController = function () {
};
rsaController.n="6e68b31d0b022f714527b8d3a73a8025e2af97548ea80385f9137a2ef74f1d8422c3d82b0d7973a02fe8f5c961cbf1ed06f457af1cd5575c2f83d305b0a14943";
rsaController.e="3";
rsaController.rsa = new RSAKey();
rsaController.rsa.setPublic(rsaController.n, rsaController.e);
