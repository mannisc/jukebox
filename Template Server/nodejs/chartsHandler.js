/**
 * chartsHandler.
 *
 * >>Description<<
 *
 * @author Manfred
 * @date 04.05.14 - 17:23
 * @copyright munichDev UG
 */

var chartsHandler = function () {
}

chartsHandler.unknownData = "unknown"

chartsHandler.update = function (http, apiKey, maxPages, callback) {
    chartsHandler.fs = require('fs');

    chartsHandler.http = http;
    chartsHandler.apiKey = apiKey;
    chartsHandler.actPage = 1;
    chartsHandler.maxPages = maxPages;

    chartsHandler.tracks = [];
    chartsHandler.chartindex = {};
    chartsHandler.charttrends = {};

    chartsHandler.downloadFiles("", callback);

}


chartsHandler.getSongArtist = function (song) {
    var artist = chartsHandler.unknownData + "-id:" + Date.now();
    if (!song)
        return  artist
    if (song.artist) {
        if (song.artist.name)
            artist = song.artist.name;
        else if (song.artist)
            artist = song.artist;
    }
    return artist;
}

chartsHandler.downloadFiles = function (content, callback) {
    if (content && content != "") {
        var tracks = JSON.parse(content)
        if (tracks && tracks.tracks && tracks.tracks.track)
            chartsHandler.tracks = chartsHandler.tracks.concat(tracks.tracks.track);
    }

    if (chartsHandler.actPage <= chartsHandler.maxPages) {
        chartsHandler.http.downloadFile("ws.audioscrobbler.com", "/2.0/?method=chart.gettoptracks&page=" + chartsHandler.actPage + "&api_key=" + chartsHandler.apiKey + "&format=json", function (content) {
            chartsHandler.downloadFiles(content, callback)
        })
        chartsHandler.actPage = chartsHandler.actPage + 1;


    } else {


        var oldCharttrend = chartsHandler.fs.readFileSync("charttrends.txt");
        if (oldCharttrend && oldCharttrend != "") {

            oldCharttrend = JSON.parse(oldCharttrend);

            var oldChartindex = chartsHandler.fs.readFileSync("chartindex.txt");
            if (oldChartindex && oldChartindex != "") {

                oldChartindex = JSON.parse(oldChartindex);
                if (oldChartindex) {

                    for (var i = 0; i < chartsHandler.tracks.length; i++) {
                        var song = chartsHandler.tracks[i];

                        var trend = 3;
                        //Winner
                        if (oldChartindex[chartsHandler.getSongArtist(song) + "-" + song.name + "-" + song.duration] < i + 1) {
                            trend = 0;
                            //Same
                        } else if (oldChartindex[chartsHandler.getSongArtist(song) + "-" + song.name + "-" + song.duration] == i + 1) {
                            trend = 1;
                            //Loser
                        } else if (oldChartindex[chartsHandler.getSongArtist(song) + "-" + song.name + "-" + song.duration] > i + 1) {
                            trend = 2;
                            //New
                        }





                       if(trend == 1) {
                           if(oldCharttrend[chartsHandler.getSongArtist(song) + "-" + song.name + "-" + song.duration])
                               trend =  oldCharttrend[chartsHandler.getSongArtist(song) + "-" + song.name + "-" + song.duration]
                           else
                            trend = 3;
                       }

                       chartsHandler.charttrends[chartsHandler.getSongArtist(song) + "-" + song.name + "-" + song.duration] = trend;

                       song.trend = trend;

                       chartsHandler.chartindex[chartsHandler.getSongArtist(song) + "-" + song.name + "-" + song.duration] = i + 1;



                    }

                    chartsHandler.fs.writeFileSync("charttrends.txt", JSON.stringify(chartsHandler.charttrends));
                    chartsHandler.fs.writeFileSync("chartindex.txt", JSON.stringify(chartsHandler.chartindex));

                }
            }
         }
        if (callback)
            callback(chartsHandler.tracks)

    }


}


module.exports = chartsHandler;
