/**
* vimeoPlayer.
*
* >>Description<<
*
* @author Norbert
* @date 07.04.14 - 09:25
*/
var vimeoPlayer = function () {
};
vimeoPlayer.player    = null;
vimeoPlayer.active      = 0;
vimeoPlayer.vimeo = 0;
vimeoPlayer.vimeoVideoID = "";
vimeoPlayer.bufferedTime = 0;
vimeoPlayer.duration = 0;
vimeoPlayer.currentTime = 0;
vimeoPlayer.apiready = false;
vimeoPlayer.player = null;
vimeoPlayer.status = null;
vimeoPlayer.iframe = null;
window.dmAsyncInit = function()
{
}
/**
* Get VideoID of Dailymotion-Video
*/
/**
* Init Player
*/
vimeoPlayer.init = function () {
};
/**
* Set Progress in percentage
*/
vimeoPlayer.setProgressPercentage = function(percentage){
//Set progress in videoController
videoController.setProgressPercentage(percentage)
}
vimeoPlayer.eventListener = function () {};
vimeoPlayer.eventListener.apiready =  function(e)
{
if(vimeoPlayer.player){
if(e.target.src.search(vimeoPlayer.vimeoVideoID)>-1){
$(".mejs-time-buffering").hide();
$("#vimeoplayer").show();
$("#vimeoembedplayer").show();
vimeoPlayer.apiready = true;
vimeoPlayer.firstplay = true;
if(vimeoPlayer.startplay){
vimeoPlayer.play()
}
else if(vimeoPlayer.startpause){
videoController.playingSong();
vimeoPlayer.firstplay = false;
}
vimeoPlayer.startpause = false;
vimeoPlayer.startplay = false;
}
}
}
vimeoPlayer.eventListener.error = function(e)
{
if(vimeoPlayer.player){
vimeoPlayer.error();
}
}
vimeoPlayer.eventListener.play = function(e)
{
if(vimeoPlayer.player&&vimeoPlayer.firstplay){
videoController.playingSong();
vimeoPlayer.firstplay = false;
}
}
vimeoPlayer.eventListener.canplaythrough = function(e)
{
/*
if(e.target.src.search(vimeoPlayer.vimeoVideoID)>-1){
if(vimeoPlayer.player){
vimeoPlayer.player.play();
}
} */
}
vimeoPlayer.eventListener.durationchange = function(e)
{
if(vimeoPlayer.player){
vimeoPlayer.duration = e.target.duration;
// vimeoPlayer.updateDuration();
videoController.setMaxTime(vimeoPlayer.duration);
}
}
vimeoPlayer.eventListener.timeupdate = function(e)
{
if(vimeoPlayer.player){
vimeoPlayer.currentTime = e.target.currentTime;
//console.log("Progress DM: "+vimeoPlayer.currentTime)
videoController.setProgressTime(vimeoPlayer.currentTime);
}
}
vimeoPlayer.eventListener.progress = function(e)
{
if(vimeoPlayer.player){
if(e.target.src.search(vimeoPlayer.vimeoVideoID)>-1){
vimeoPlayer.bufferedTime = e.target.bufferedTime;
if(vimeoPlayer.duration>0){
videoController.setBufferedPercentage(vimeoPlayer.bufferedTime/vimeoPlayer.duration);
}
}
}
}
vimeoPlayer.eventListener.ended = function(e)
{
if(vimeoPlayer.player){
if(e.target.src.search(vimeoPlayer.vimeoVideoID)>-1){
vimeoPlayer.mediaEnded();
videoController.endedSong();
}
}
}
/**
* Load Player with Url before using
*/
vimeoPlayer.loadInit = function(){
vimeoPlayer.iframe = $('#vimeoplayerframe')[0];
vimeoPlayer.player = $f(vimeoPlayer.iframe);
vimeoPlayer.status = $('.status');
// When the player is ready, add listeners for pause, finish, and playProgress
vimeoPlayer.player.addEvent('ready', function() {
//  player.addEvent('pause', onPause);
//  player.addEvent('finish', onFinish);
//  player.addEvent('playProgress', onPlayProgress);
});
vimeoPlayer.player.api("play");
vimeoPlayer.apiready = true;
}
vimeoPlayer.load = function (url) {
console.dir("VIMEO LOAD: "+url);
vimeoPlayer.active = 1;
vimeoPlayer.bufferedTime = 0;
vimeoPlayer.duration = 0;
vimeoPlayer.currentTime = 0;
vimeoPlayer.apiready = false;
$.ajax({
url: "http://vimeo.com/api/oembed.json?url="+escape(url),
success: function (data) {
//$("#dailymotionPlayer").hide();
console.dir("VIMEO JSON")
console.dir(data)
var videoid = data.video_id;
if(videoid){
console.dir("VIMEO VideoID: "+videoid);
$("#vimeoplayer").remove();
$( "#vimeoembedplayer" ).append('<div id="vimeoplayer" ><iframe id="vimeoplayerframe" src="//player.vimeo.com/video/'+videoid+'?portrait=0&autoplay=1&badge=0&hd=1&title=0&byline=0" width="110%" height="110%" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div>' );
$('#vimeoplayerframe').load(vimeoPlayer.loadInit);
$("#vimeoPlayer").hide();
$("#vimeoembedplayer").show();
$("#vimeoplayer").addClass("iframeVideo").appendTo("#backgroundVideo");
}
},
error: function (xhr, ajaxOptions, thrownError) {
}
})
};
/**
* Unload Player after using
*/
vimeoPlayer.unload = function () {
vimeoPlayer.player.api("unload");
console.dir("UNLOAD! ");
vimeoPlayer.vimeoVideoID ="null";
vimeoPlayer.stop();
vimeoPlayer.active = 0;
$("#vimeoplayer").hide();
vimeoPlayer.apiready = false;
delete vimeoPlayer.player;
vimeoPlayer.player = null;
$("#vimeoplayer").remove();
$( "#vimeoembedplayer" ).append('<div id="vimeoplayer" ></div>' );
};
vimeoPlayer.setVolume = function (volume) {
if(vimeoPlayer.player && vimeoPlayer.apiready){
vimeoPlayer.player.api("setVolume",volume)
}
}
vimeoPlayer.play = function () {
if(vimeoPlayer.player ){
if(vimeoPlayer.apiready){
vimeoPlayer.player.api("play");
//vimeoPlayer.setVolume(videoController.volume);
}
else{
vimeoPlayer.startplay = true;
vimeoPlayer.startpause = false;
}
console.dir("PLAY: "+vimeoPlayer.vimeoVideoID);
}
}
vimeoPlayer.pause = function () {
if(vimeoPlayer.player){
if(vimeoPlayer.apiready)
vimeoPlayer.player.api("pause");
else{
vimeoPlayer.startplay = false;
vimeoPlayer.startpause = true;
}
console.dir("PAUSE: "+vimeoPlayer.vimeoVideoID);
}
}
vimeoPlayer.stop = function () {
if(vimeoPlayer.player && vimeoPlayer.apiready){
vimeoPlayer.player.api("pause");
vimeoPlayer.player.api("setCurrentTime",0);
}
}
vimeoPlayer.setProgressPercentage = function(percentage){
if(vimeoPlayer.player && vimeoPlayer.apiready){
vimeoPlayer.player.api("setCurrentTime",percentage* vimeoPlayer.duration);
}
}
vimeoPlayer.mediaEnded = function(){
videoController.endedSong();
mediaController.mediaEnded();
}
vimeoPlayer.error= function (){
if(vimeoPlayer.active == 1){
//TODO FEEDBACK AN SERVER!
//mediaController.playNextVersion();
}
}

