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
     console.log("Started--------------------------")

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
        console.log("Finished--------------------------")

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

































