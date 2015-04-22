/**
 * httpHandler.
 *
 * >>Description<<
 *
 * @author Manfred
 * @date 04.05.14 - 17:11
 * @copyright munichDev UG
 */



var httpHandler = function () {
}

httpHandler.http = require('http');


httpHandler.downloadFile = function (host, path, callback,port,encoding) {


     if(!encoding)
         encoding   = "utf8";

    var options = {
        host: host,

        path: path
    };

    if(port)
     options.port = port;

    var req = httpHandler.http.request(options, function (response) {


        response.setEncoding(encoding);

        var str = '';
        //another chunk of data has been recieved, so append it to `str`
        response.on('data', function (chunk) {
            str += chunk;
        });

        //the whole response has been recieved, so we just print it out here
        response.on('end', function () {
            if (callback)
                callback(str)
        });

    });

    req.on('error', function (error) {
        if (callback)
            callback("")
    });

    req.end();

}


module.exports = httpHandler;
