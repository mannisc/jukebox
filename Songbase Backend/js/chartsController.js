/**
 * index.js
 *
 *
 * @author
 * @date 15.04.15 - 19:27
 * @copyright
 */

var chartController;

// A $( document ).ready() block.
$(document).ready(function () {

    chartController = new ChartController();
    chartController.init();

});


ChartController = function () {

    this.chartTrends = null;
    this.chartTrendsArray = null;

    var that = this;

    /**
     * Init the Chartcontroller
     */
    this.init = function () {

        $.ajax({url: "data/chartTrends.txt", success: function (chartTrendsJSON) {

            that.chartTrends = JSON.parse(chartTrendsJSON);

            console.dir(that.chartTrends);

            that.chartTrendsArray = [];

            for (var p in that.chartTrends) {
                if (that.chartTrends.hasOwnProperty(p)) {
                    that.chartTrendsArray[that.chartTrends[p].index - 1] = that.chartTrends[p];
                }
            }

            console.dir(that.chartTrendsArray);

            var popularSongList = $("#popularSongList")
            for (var i = 0; i < that.chartTrendsArray.length; i++) {
                var song = that.chartTrendsArray[i];
                console.log(song);
                var editSongElement = $('<a  class="list-group-item" ><span class="badge">just now</span><i class="fa fa-fw fa-music"></i> <div class="contenteditableInline popularSongName" contenteditable="true">' + song.name + '</div> - <div  class="contenteditableInline popularSongArtist" contenteditable="true">' + song.artist + '</div></a>')

                popularSongList.append(editSongElement);

                var onClick = function (editSongElement, song) {
                    console.log(editSongElement.find(".contenteditableInline").length)
                    editSongElement.find(".popularSongName")[0].addEventListener("input", function () {

                        var songKey = song.origArtist + "-" + song.origName + "-" + song.duration;
                        that.chartTrends[songKey].name = $(this).text();
                        that.chartTrendsArray[that.chartTrends[p].index - 1] = that.chartTrends[p];


                    }, false);

                    editSongElement.find(".popularSongArtist")[0].addEventListener("input", function () {

                        var songKey = song.origArtist + "-" + song.origName + "-" + song.duration;
                        that.chartTrends[songKey].artist = $(this).text();
                        that.chartTrendsArray[that.chartTrends[p].index - 1] = that.chartTrends[p];



                    }, false);

                }
                onClick(editSongElement, song);

            }

            console.dir(that.chartTrendsArray);
        }});


        $("#updatePopularSongs").click(function(){

            that.updatePopularSong()
        });


    }


    this.updatePopularSong = function () {


        $.ajax({
            url: "http://h2406563.stratoserver.net:3005/admin/",
            method: "POST",
            data: {
                chartTrendsJSON: JSON.stringify(that.chartTrends)
            },
            success: function (data) {
                alert(data)
            },

            error: function () {
                $('#info').html('<p>An error has occurred</p>');
            }
        })


    }

};
