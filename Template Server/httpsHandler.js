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


httpsHandler.downloadFile = function (host, path, callback) {

    var options = {
        host: host,
        path: path
    };


    var req = httpsHandler.https.request(options, function (response) {
        var str = '';

        //another chunk of data has been recieved, so append it to `str`
        response.on('data', function (chunk) {
            str += chunk;
        });

        //the whole response has been recieved, so we just print it out here
        response.on('end', function () {
            if (callback)
                callback( str)
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
