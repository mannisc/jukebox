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

chartsHandler.unknownData = "unknown";

chartsHandler.update = function (http, apiKey, maxPages, callback) {
    chartsHandler.fs = require('fs');

    chartsHandler.http = http;
    chartsHandler.apiKey = apiKey;
    chartsHandler.actPage = 1;
    chartsHandler.maxPages = maxPages;

    chartsHandler.tracks = [];

    chartsHandler.charttrends = {};

    chartsHandler.downloadFiles("", callback, true);
}

chartsHandler.getSongArtist = function (song) {
    var artist = chartsHandler.unknownData + "-id:" + Date.now();
    if (!song)
        return  artist;
    if (song.artist) {
        if (song.artist.name)
            artist = song.artist.name;
        else if (song.artist)
            artist = song.artist;
    }
    return artist;
}

chartsHandler.downloadFiles = function (content, callback, start) {


    if (!start) {
        if (content && content.trim() != "") {
            var tracks = JSON.parse(content)
            if (tracks && tracks.tracks && tracks.tracks.track)
                chartsHandler.tracks = chartsHandler.tracks.concat(tracks.tracks.track);
            else {
                console.log("LAST.FM DOWN -----------------------------------------------------")
                console.log(JSON.stringify(tracks))

                return;

            }
        } else {
            console.log("LAST.FM DOWN -----------------------------------------------------")
            console.log(content)

            return;
        }
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

            /*  Conver old chart trend file
             for (var i = 0; i < chartsHandler.tracks.length; i++) {
             var song = chartsHandler.tracks[i];
             var songKey = chartsHandler.getSongArtist(song) + "-" + song.name + "-" + song.duration;
             oldCharttrend[songKey] ={trend:oldCharttrend[songKey]}
             }
             */

            //New songs in Charts
            var countChanges = 0;

            var index = 0;
            for (var i = 0; i < chartsHandler.tracks.length; i++) {


                var song = chartsHandler.tracks[i];

                var songKey = chartsHandler.getSongArtist(song) + "-" + song.name + "-" + song.duration;

                var trend;

                //Already existed
                if(oldCharttrend[songKey]) {
                    if (oldCharttrend[songKey].index < i + 1) {//Loser
                        trend = 2;

                    } else if (oldCharttrend[songKey].index > i + 1) { //Winner
                        trend = 0;

                    } else {//Same
                        trend = 1;
                    }
                }else  //New
                 trend = 3;


                if (trend == 1) {
                    if (oldCharttrend[songKey] != undefined && oldCharttrend[songKey].trend >= 0)
                        trend = oldCharttrend[songKey].trend;
                    else
                        trend = 3;
                } else {
                    countChanges++;
                }

                //Create new Chart Entry
                chartsHandler.charttrends[songKey] = {};
                chartsHandler.charttrends[songKey].trend = trend;
                chartsHandler.charttrends[songKey].index = index + 1;
                chartsHandler.charttrends[songKey].duration = song.duration;

                chartsHandler.charttrends[songKey].cached = true;

                if (oldCharttrend[songKey] == undefined) {
                    chartsHandler.charttrends[songKey].artist = chartsHandler.getSongArtist(song);
                    chartsHandler.charttrends[songKey].name = song.name;
                } else {
                    chartsHandler.charttrends[songKey].artist = oldCharttrend[songKey].artist;
                    chartsHandler.charttrends[songKey].name = oldCharttrend[songKey].name
                    chartsHandler.charttrends[songKey].hidden = oldCharttrend[songKey].hidden

                }

                chartsHandler.charttrends[songKey].origArtist = chartsHandler.getSongArtist(song);
                chartsHandler.charttrends[songKey].origName = song.name;

                //Copy changed names
                song.trend = trend;

                delete song.artist;
                song.artist = chartsHandler.charttrends[songKey].artist;
                song.name = chartsHandler.charttrends[songKey].name;

                //Save the date it was found
                if (!song.date && song.trend == 3) {
                    song.date = +new Date();
                }

                //Already existed and song was hidden
                if(oldCharttrend[songKey]&&oldCharttrend[songKey].hidden) {
                    chartsHandler.tracks.splice(i, 1);
                    i--;
                    console.log("hide song: "+song.name)
                }

                index++;
            }

            chartsHandler.fs.writeFileSync("charttrends.txt", JSON.stringify(chartsHandler.charttrends));

            if (true || new Date().getDay() == 0) {
                chartsHandler.fs.writeFileSync("Sicherung/charttrends_Sicherung_" + new Date().getTime() + ".txt", JSON.stringify(chartsHandler.charttrends));
            }
            // chartsHandler.fs.createReadStream("charttrends.txt").pipe(chartsHandler.fs.createWriteStream("charttrends_backup.txt"));


        }
        if (callback)
            callback(chartsHandler.tracks, countChanges, chartsHandler.charttrends);

    }


}


module.exports = chartsHandler;
