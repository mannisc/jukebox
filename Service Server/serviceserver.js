var express = require("express"),
    app = express(),
    port = 3005;

var httpsHandler = require('./httpsHandler');

var cheerio = require('cheerio');


app.get("/", function (req, res) {


    //res.header('Access-Control-Allow-Origin', "*");
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);


    var isDidYouMeanRequest = (typeof req.query.dum != "undefined" );
    if (isDidYouMeanRequest) {
        var term = req.query.dum;

        var download = function (urlPath) {


            httpsHandler.downloadFile("www.google.de", urlPath, function (content) {
                if (content) {
                    $ = cheerio.load(content);
                    if (content.toLowerCase().search("302 moved") != -1) {
                        download($("a").attr("href").replace("https://","").replace("www.google.com","").replace("www.google.de",""));
                    }
                    else {
                        var correctTerm = $('a.spell').text();

                        if (!(correctTerm && correctTerm.trim() != ""))
                            correctTerm = $("#_FQd a").text();

                        function getFormattedDate() {
                            var date = new Date();
                            return date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear() + "  " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
                        }

                        console.log(getFormattedDate() + " : " + term + " -> " + correctTerm)

                        res.send(correctTerm);
                    }
                }
            })

        }

        download("/search?q=" + encodeURIComponent(term))


    }
    else
        res.send('');


});


console.log("Service server listening at http://localhost:" + port);
app.listen(port);