/**
 * viewController.
 *
 * >>Description<<
 *
 * @author Manfred
 * @date 05.06.14 - 00:14
 * @copyright munichDev UG
 */


var viewController = function () {

};

viewController.buttonActive = -1;


viewController.init = function () {

    setTimeout(function(){ //available after 10 seconds
        $("#searchinput").focus(function () {
            var that = $(this);
            window.setTimeout(function () {
                if ($(".ui-popup-active, .ui-popup-container.pop.in").length == 0)
                    that.select();
            }, 100);
        });
    },10000)


    $("#searchinput").on("input", function () {

        if( searchController.showMode == 5)
            searchController.backShowMode();


        $("#searchlist .iScrollPlayIndicator").hide();
        $("#searchlist .iScrollScrollUpIndicator").hide();

        switch (searchController.buttonActive) {
            case 0:
                searchController.startSearch();
                break;
            case 1:
                searchController.filterMusic();
                break;
            case 2:
                searchController.filterMusic();
                break;
        }
    })

    $("#controlbar .ui-input-clear").click(function () {

        switch (searchController.buttonActive) {
            case 0://Search
                searchController.startSearch();//Show Populars
                break;
            case 1://Suggestions
                searchController.removeFilterSongs();
                break;
            case 2://Explore

                break;
            default:

                break;
        }
    })


    searchController.activateButton(0, true);

    if (!urlParams.search || urlParams.search == "") {
        setTimeout(function () {
            searchController.startSearch()
        }, 500)

    }

    setTimeout(function () {
        uiController.searchListScroll.refresh();
    }, 150)

    searchController.scrollUpIndicator = $('<div class="iScrollScrollUpIndicator fadeincomplete" style="display:none;"></div>');
    $("#searchlist .iScrollVerticalScrollbar").prepend(searchController.scrollUpIndicator);

    searchController.scrollUpIndicator.click(function () {
        uiController.searchListScroll.scrollTo(0, 0, 200);
    });


    searchController.playIndicator = $('<div class="iScrollPlayIndicator fadeincomplete" style="display:none;"></div>');


    searchController.playIndicator.appendTo("#searchlist .iScrollVerticalScrollbar");
    searchController.playIndicator.click(function () {
        uiController.searchListScroll.scrollToElement(".loadedsong", 700);
    });


}


searchController.activateButton = function (index, noAnimation) {
    if (searchController.buttonActive == index)
        return;

    //Unload actions for views
    if (searchController.buttonActive == 0) {
        searchController.searchSongsString = $("#searchinput").val();
    }
    //Explore
    if (searchController.buttonActive == 2 && index != 2) {
        searchController.hideExplore();
    }


    searchController.buttonActive = index;
    searchController.emptySearchList(true);
    console.log("XXXXXXXääääääääääääääääääääääääääääääääääääää")
    $("#searchlist .iScrollPlayIndicator").hide();
    $("#searchlist .iScrollScrollUpIndicator").hide();


    var input = $("#searchinput").parent();
    var oIndex = input.data("button");
    if (oIndex) {
        var oButton = $("#searchbutton" + oIndex).parent();
        oButton.show();
        var width = oButton.width();
        oButton.removeClass("animated");
        oButton.css("width", input.width());

        setTimeout(function () {
            oButton.addClass("animated");
            oButton.css("width", width)

        }, 50)
    }
    input.data("button", index + 1);

    var button = $("#searchbutton" + (index + 1)).parent();

    input.removeClass("animated");
    if (!noAnimation)
        input.css("width", button.width());
    setTimeout(function () {
        if (!noAnimation)
            input.addClass("animated");

        input.css("width", "");
        setTimeout(function () {
            input.find("input").focus();
        }, 500)

        uiController.toggleSearchButton(index + 1);

    }, 60)

    switch (index) {
        case 0:
            $("#searchinput").val(searchController.searchSongsString);
            $(input).insertAfter(button).find("input").attr("placeholder", "Search Songs and Playlists");
            break;
        /*case 1:
         $("#searchinput").val("");
         $(input).insertAfter(button).find("input").attr("placeholder", "Filter Popular Songs");
         break; */
        case 1:
            $("#searchinput").val("");
            $(input).insertAfter(button).find("input").attr("placeholder", "Filter Songs");
            break;
        case 2:
            $("#searchinput").val("");
            $(input).insertAfter(button).find("input").attr("placeholder", "Search Content");
            break;
        case 3:
            $("#searchinput").val("");
            $(input).insertAfter(button).find("input").attr("placeholder", "Search Playlists");
            break;
    }


    button.hide();
}