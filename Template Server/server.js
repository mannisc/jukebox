var express = require('express');
var app = express();


var ftpHandler = require('./ftpHandler');
var httpHandler = require('./httpHandler');
var httpsHandler = require('./httpsHandler');

var chartsHandler = require('./chartsHandler');
var templateHandler = require('./templateHandler');

var countUpdates = 0;
var maxChartsResults = 100;
var ip_token = "iamadmin";

//Songbase FTP Properties

var serverURL =   "h2406563.stratoserver.net";


var ftpProperties = {
    host: serverURL,//"songbase.net",
    user: "Administrator",// "u76604889",
    password: "hUFEvt9m",//"songbasetwinners"
    port: 21
}


//This Callbacks should be called one after another


//httpsHandler.downloadFile("imgflip.com", "/ajax_get_video_from_url?url=http%3A%2F%2Fpdl.vimeocdn.com%2F59403%2F899%2F244700956.mp4%3Ftoken2%3D1400940393_37731d9fa33fe73f8f3ae7c89814f0b0%26aksessionid%3D13fef841d0cedf61&ran=yMo52KSHA3Agkurei5dBpvLQNGEuvY3k&getImg=1", onExploreReady)
//httpsHandler.downloadFile("imgflip.com", "/terms", onExploreReady)


startChartsUpdate();


//---------------------------------------------------------------------------------------------


function startChartsUpdate() {

//Connect FTP
    ftpHandler.connect(ftpProperties, onFTPConnection);
}


//Connected
function onFTPConnection() {
    console.log("Started--------------------------")

    console.log("FTP Connected")

    ftpHandler.downloadFile("/public/js/generatedData.template.js", "generatedData.template.js", onFTPDownloadTemplates)
}

//Templates Downloaded
function onFTPDownloadTemplates() {
    console.log("Templates Downloaded")

    chartsHandler.update(httpHandler, "019c7bcfc5d37775d1e7f651d4c08e6f", 10, onChartsUpdated);

}


//Charts Updated
function onChartsUpdated(tracks, countNewUpdates) {

    countUpdates = countNewUpdates;
    console.log("Charts: " + tracks.length + " Tracks")
    console.log(countUpdates + " Updates");

    if (countNewUpdates > 0) {

        var generatedDataTemplate = chartsHandler.fs.readFileSync("generatedData.template.js", "utf-8");

        if (generatedDataTemplate && generatedDataTemplate != "") {

            var templateProp = [
                {
                    search: "insert_songcharts",
                    replace: JSON.stringify(tracks)
                }
            ]

            var generatedData = templateHandler.buildTemplate(generatedDataTemplate, templateProp)
            chartsHandler.fs.writeFileSync("generatedData.js", generatedData);
            ftpHandler.uploadFile("/public/js/generatedData.js", "generatedData.js", onFTPUploadTemplates)

        }

    }


    setTimeout(function () {
        bufferCharts(tracks)
    }, 1000);


}


function onFTPUploadTemplates() {

    console.log("Templates Uploaded")


    //Write Server Stats
    console.log("Write Server Stats")
    chartsHandler.fs.appendFileSync("Server Status.txt", "Last Update: " + new Date().toUTCString() + " - Updates: " + countUpdates + "\r\n");


    console.log("Finished--------------------------")


}


function bufferCharts(tracks) {
    console.log("");
    console.log("");
    console.log("Buffering Tracks: "+tracks.length);

    for (var i = 0; i < tracks.length; i++) {

        var bufferSongIndex = function (index) {
            setTimeout(function () {
                bufferSong(tracks[index], index == maxChartsResults - 1)
            }, 5000 * index);
        }
        bufferSongIndex(i);
    }


}


function bufferSong(track, endProcess) {


    console.log("Track: "+track.name);

   // console.log("h2406563.stratoserver.net:3001?reloadversions=" + track.artist.name + "&duration=&title=" + track.name + "&auth=" + ip_token);

    httpHandler.downloadFile(serverURL, "?reloadversions=" + encodeURIComponent(track.artist.name) + "&duration=&title=" + encodeURIComponent(track.name) + "&auth=" + ip_token, function (content) {
        console.log("Response Length: " + content.length+"   (" + content.substring(0,45)+" ...)");
    }, 3001);


    if (endProcess)
        setTimeout(function () {
            process.exit(0);
        }, 10000);

}


/*
 app.get('/', function(req, res){

 res.send('Template Server');

 });

 app.listen(3000);


 */


//process.exit();

/*

 https = require('https');

 input_token ="CAAGpituCO0IBAMZCK6u6ZBnLeQzovMS511tZBtjZACi5W23NnDOKySVmKhxRZCABlwLn0Cbpgxmqq1Qw4B7ARVW75Le1wwdYbZBSJoh4hTqeFBtpebILUzyqY3ZBUwZBBpPZBQc3WwX6EikzLJMtGpSubqIsCQpJQ8jwlrkMVV5hZC4YLQl6QvuNI5J4nlmPD7GVEZD","userID":"1418105149","expiresIn":4775,"signedRequest":"yQFBH9FM68lFyOWMojX9t0s7jp8cALLNoe5Ko-UM2kc.eyJhbGdvcml0aG0iOiJITUFDLVNIQTI1NiIsImNvZGUiOiJBUURybS0wZFlUbHVFNm8wNnVYZVNneUZsTmZDaEhfTWplZGJJWFkxdTV4b1pMQW12NjdiMTFoNS15bVZfcHRwM1dQVHYtZ2xMd0ZvM25paHEwSmdDVDh3SHJNZnBUT0tNWGdyQnRTR2ptY3J3ZWJraDlyYm1BZ2pkanBfTDdnUlpQTFk2R051VnQ0Q0NkZnhjdDFzaVl0ZVQtSTZzWWRJc1lWNm1XUWJkNWpoUy1YNl9kN2RraWFmb0dFb1JhX1FUajBHTlY5ZXZ6a0RFTDdMX0l3ZWFNN2hHY0t6THpCVmNUZVZNQ0tKd2tSVFFJdWQyQUtra3NuSEVuNDRpNlhVekxlS1hiWnNMYVpCcTV2OHdzZ1dOdGVQeVVNbFNNQnpzTHpyR2dydGYwTTh3VUZNdmJPclFUZFRzbVZmYV9yai1kNCIsImlzc3VlZF9hdCI6MTM5OTU2MzYyNSwidXNlcl9pZCI6IjE0MTgxMDUxNDkifQ"
 acces_token="467888830036802|0f51310af234012a68fa6104538e69ac";

 var options = {
 host: "graph.facebook.com",
 path: "debug_token?input_token="+input_token+"&access_token="+acces_token
 };



 var req = https.request(options, function (response) {
 var str = '';

 //another chunk of data has been recieved, so append it to `str`
 response.on('data', function (chunk) {
 str += chunk;
 });

 //the whole response has been recieved, so we just print it out here
 response.on('end', function () {
 console.log("!!!!!! "+str)
 });
 });

 req.on('error', function (error) {

 });

 req.end();




 */

































