var express = require('express');
var app = express();

var ftpHandler = require('./ftpHandler');
var httpHandler = require('./httpHandler');
var chartsHandler = require('./chartsHandler');
var templateHandler = require('./templateHandler');


//Songbase FTP Properties
var ftpProperties = {
    host: "songbase.net",
    user: "u76604889",
    password: "songbasetwinners"
}


//This Callbacks should be called one after another


//Connect FTP
ftpHandler.connect(ftpProperties, onFTPConnection);

//Connected
function onFTPConnection() {
    console.log("FTP Connected")

    ftpHandler.downloadFile("/test/public/js/generatedData.template.js", "generatedData.template.js", onFTPDownloadTemplates)
}

//Templates Downloaded
function onFTPDownloadTemplates() {
    console.log("Templates Downloaded")

    chartsHandler.update(httpHandler, "019c7bcfc5d37775d1e7f651d4c08e6f", 6, onChartsUpdated);

}


//Charts Updated
function onChartsUpdated(tracks) {


    console.log("Charts Updated: " + tracks.length + " Tracks")


    var generatedDataTemplate = chartsHandler.fs.readFileSync("generatedData.template.js", "utf-8");

    if (generatedDataTemplate && generatedDataTemplate != "") {

        var templateProp = [
            {
                search: "insert_songcharts",
                replace: JSON.stringify(tracks)
            }
        ]

        var generatedData = templateHandler.buildTemplate(generatedDataTemplate, templateProp)
        chartsHandler.fs.writeFileSync("generatedData.js",generatedData);
        ftpHandler.uploadFile("/test/public/js/generatedData.js", "generatedData.js", onFTPUploadTemplates)

    }


}


function onFTPUploadTemplates() {

    console.log("Templates Uploaded")

}


/*
 app.get('/', function(req, res){
 res.send('Template Server');
 });

 app.listen(3000);



 */

//process.exit();









































