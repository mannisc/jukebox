/**
 * httpHandler.
 *
 * >>Description<<
 *
 * @author Manfred
 * @date 04.05.14 - 17:11
 * @copyright munichDev UG
 */



var httpsHandler = function () {
}

httpsHandler.https = require('https');

httpsHandler.Iconv =  require('iconv-lite');

httpsHandler.downloadFile = function (host, path, callback) {

    var headers = {
        "accept-charset" : "utf-8"
    };

    var options = {
        host: host,
        path: path,
        headers: headers
    };


    var req = httpsHandler.https.request(options, function (response) {

        response.pipe(httpsHandler.Iconv.decodeStream('ISO-8859-1')).collect(function(err, decodedBody) {
            callback( httpsHandler.Iconv.encode(decodedBody, "utf8").toString());

        });

    });

    req.on('error', function (error) {
        console.log("ERROR "+error)
        if (callback)
            callback("")
    });

    req.end();

}


module.exports = httpsHandler;
