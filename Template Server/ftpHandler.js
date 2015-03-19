/**
 * ftpHandler.
 *
 * >>Description<<
 *
 * @author Manfred
 * @date 04.05.14 - 16:44
 * @copyright munichDev UG
 */


var ftpHandler = function(){
}


ftpHandler.connect = function(connectionProps,callback){
    var Client = require('ftp');
    ftpHandler.fs = require('fs');
    ftpHandler.client = new Client();
    ftpHandler.connected  = false;
    ftpHandler.client.connect(connectionProps);
    ftpHandler.client.on('ready', function() {
        ftpHandler.connected  = true;

        if(callback)
            callback();
    });
}

ftpHandler.downloadFile = function(fileRemote, fileLocal, callback){
    if( ftpHandler.connected) {
        ftpHandler.client.get(fileRemote, function(err, stream) {
            stream.once('close', function() {  });
            stream.pipe(ftpHandler.fs.createWriteStream(fileLocal));
            if(callback)
                callback();
        });
    }
}

ftpHandler.uploadFile = function(fileRemote, fileLocal, callback){

    if( ftpHandler.connected) {
        ftpHandler.client.put(fileLocal, fileRemote, function(err) {
            if(callback)
                callback();
        });
    }
}



ftpHandler.disconnect  = function(){
    ftpHandler.connected = 0;
    ftpHandler.client.end();
}







module.exports = ftpHandler;
