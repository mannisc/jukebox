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
    chartsHandler.chartindex = {};
    chartsHandler.charttrends = {};

    chartsHandler.downloadFiles("", callback,true);

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

chartsHandler.downloadFiles = function (content, callback,start) {


    if(!start) {
        if (content && content.trim() != "") {
            var tracks = JSON.parse(content)
            if (tracks && tracks.tracks && tracks.tracks.track)
                chartsHandler.tracks = chartsHandler.tracks.concat(tracks.tracks.track);
            else {
                console.log("LAST.FM DOWN -----------------------------------------------------")
                console.log(JSON.stringify(tracks))

                return;

            }
        }else{
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

        chartsHandler.fs.createReadStream("charttrends.txt").pipe(chartsHandler.fs.createWriteStream("charttrends_backup.txt"));
        var oldCharttrend = chartsHandler.fs.readFileSync("charttrends.txt");

        if (oldCharttrend && oldCharttrend != "") {

            oldCharttrend = JSON.parse(oldCharttrend);

            var oldChartindex = chartsHandler.fs.readFileSync("chartindex.txt");
            if (oldChartindex && oldChartindex != "") {

                oldChartindex = JSON.parse(oldChartindex);
                if (oldChartindex) {

                    //New songs in Charts
                    var countChanges=0;

                    for (var i = 0; i < chartsHandler.tracks.length; i++) {
                        var song = chartsHandler.tracks[i];

                        var trend = 3;  //New
                        
                        if (oldChartindex[chartsHandler.getSongArtist(song) + "-" + song.name + "-" + song.duration] < i + 1) {//Loser
                            trend = 2;
                           
                        } else if (oldChartindex[chartsHandler.getSongArtist(song) + "-" + song.name + "-" + song.duration] == i + 1) { //Same
                            trend = 1;
                            
                        } else if (oldChartindex[chartsHandler.getSongArtist(song) + "-" + song.name + "-" + song.duration] > i + 1) {//Winner
                            trend = 0;
                          
                        }

                       // console.log(song.name + "    "+oldCharttrend[chartsHandler.getSongArtist(song) + "-" + song.name + "-" + song.duration]+"   "+trend)

                       if(trend == 1) {
                           if( oldCharttrend[chartsHandler.getSongArtist(song) + "-" + song.name + "-" + song.duration]!=undefined&&oldCharttrend[chartsHandler.getSongArtist(song) + "-" + song.name + "-" + song.duration]>=0)
                               trend =  oldCharttrend[chartsHandler.getSongArtist(song) + "-" + song.name + "-" + song.duration]
                           else
                            trend = 3;
                       }else{
                           countChanges++;
                       }

					   
					   

                       chartsHandler.charttrends[chartsHandler.getSongArtist(song) + "-" + song.name + "-" + song.duration] = trend;

                       song.trend = trend;

                        //Save the date it was found
                        if(!song.date&&song.trend==3) {
                           song.date = +new Date();
                       }




                       chartsHandler.chartindex[chartsHandler.getSongArtist(song) + "-" + song.name + "-" + song.duration] = i + 1;



                    }
                    chartsHandler.fs.writeFileSync("charttrends.txt", JSON.stringify(chartsHandler.charttrends));
                    chartsHandler.fs.writeFileSync("chartindex.txt", JSON.stringify(chartsHandler.chartindex));

                    if(new Date().getDay()==0)
                     chartsHandler.fs.writeFileSync("chartindex_Sicherung.txt", JSON.stringify(chartsHandler.chartindex));



                }
            }
         }
        if (callback)
            callback(chartsHandler.tracks,countChanges)

    }


}


module.exports = chartsHandler;
