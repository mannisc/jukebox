/** * authController.
*
* >>Description<<
*
* @author Norbert
* @date 22.03.14 - 19:01
* @copyright  */
var authController = function () {
};
authController.init = function(){
authController.getToken();
}
authController.ip_token = "auth";
authController.clientip = "";
authController.extractToken = function(token){
//alert(token);
if(token=="init"){
authController.getToken();
}
else if(token=="wait"){
setTimeout(function () {
authController.getToken();
}, 10000);
}
else if(token=="down"){
uiController.toast("Sorry, the Songbase.fm server is not available at the moment!", 1500);
}
else if(token!=""){
mediaController.ip_token = "auth";
try {
eval(Base64.decode(token));
authController.clientip  = mediaController.ipaddress;
if(authController.clientip == ""){
mediaController.ip_token = "";
}
if(mediaController.ip_token == ""){
uiController.toast("Sorry, the Songbase.fm server is not available at the moment!", 1500);
}
authController.ip_token = mediaController.ip_token;
} catch (e) {
uiController.toast("Sorry, the Songbase.fm server is not available at the moment!", 1500);
}
}
}
authController.getToken = function (){
//alert("get TOKEN!")
$.ajax({
url: preferences.serverURL + "init.js?nocache="+Date.now(),
success: function (data) {
console.dir("TOKEN:")      ;
console.dir(data);
if(data.auth && data.auth=="true"){
authController.extractToken(data.token);
}
else{
uiController.toast("Sorry, the Songbase.fm server is not available at the moment!", 1500);
setTimeout(function () {
authController.getToken();
}, 15000);
}
},
error: function (xhr, ajaxOptions, thrownError) {
//    alert("error!");
uiController.toast("Sorry, the Songbase.fm server is not available at the moment!", 1500);
setTimeout(function () {
authController.getToken();
}, 30000);
}
})
}
/**
* Check if is authenticated, else retry with ajax function and extracted token
* @param data
* @param ajaxFunction
* @returns {boolean}
*/
authController.ensureAuthenticated = function(data,ajaxFunction){
if(data){
if (data.auth){
if(data.auth == "true") {
authController.extractToken(data.token);
if(ajaxFunction)
ajaxFunction()
return false;
}
else
return false;
}
else
return true;
}
return true;
}
var rsaController = function () {
};
rsaController.n="a0bb4bfeb95482f621562fa9f946528febc4a23f4aabbc029b4459ca68972ec2ca9e1341ab3282fc7bacabfc0fc48aeb18fe5c964563fdd0116afdd6cb24255158fbf48b2447864303cc18ee0a65b0ee6e660d8ad021d010bb27bccdb19140ee80d0b2a3883d62ca2943a64a02665a1c23e5c786081f6fdfe01b43aee80d917d";
rsaController.e="3";
rsaController.rsa = new RSAKey();
rsaController.rsa.setPublic(rsaController.n, rsaController.e);
rsaController.rsa.encryptUnlimited = function(text){
var maxLength = 110;
var rsaTextComplete = ""
for (var i = 0; i < Math.ceil(text.length/maxLength); i++) {
var actText =  text.slice(i*maxLength,(i+1)*maxLength)
var rsaText =  rsaController.rsa.encrypt(actText)
rsaTextComplete = rsaTextComplete +  rsaText;
}
return rsaTextComplete;
}

