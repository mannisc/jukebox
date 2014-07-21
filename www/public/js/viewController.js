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



viewController.views = [searchController,exploreController,myBaseController];

viewController.activeView = null;



/**
 * Init View Controller
 */
viewController.init = function () {

    //Init Views
    for (var i = 0; i < viewController.views.length; i++) {
        if( viewController.views[i].init)
         viewController.views[i].init();
    }


    //Select Full Text if focused, available after 10 seconds  after startup
    setTimeout(function(){
        $("#searchinput").focus(function () {
            var that = $(this);
            window.setTimeout(function () {
                if ($(".ui-popup-active, .ui-popup-container.pop.in").length == 0)
                    that.select();
            }, 100);
        });
    },10000);

    //  Text entered into input
    $("#searchinput").on("input", function () {
        viewController.activeView.onInput();
    })

    $("#controlbar .ui-input-clear").click(function () {

        viewController.activeView.onClear();

    })


    //Show search at startup
    viewController.activateView(searchController,true);

    //Show Start Results
    if (!urlParams.search || urlParams.search == "") {
        setTimeout(function () {
            viewController.activeView.onInput();
        }, 500)

    }

}

/**
 * Shows loading bar in input
 * @param show
 */
viewController.showLoading = function (show) {
    if (show){
        $(".ui-alt-icon.ui-icon-search, .ui-alt-icon .ui-icon-search, .ui-input-search").addClass("loading");
        $("#controlselecthorizontal .ui-btn.highlight").addClass("loading");

    }
    else  {
        $(".ui-alt-icon.ui-icon-search.loading, .ui-alt-icon .ui-icon-search.loading, .ui-input-search.loading").removeClass("loading");
        $("#controlselecthorizontal .ui-btn.loading").removeClass("loading");

    }

}

/**
 * Returns true if is active View
 * @param view
 * @returns {boolean}
 */
viewController.isActiveView = function(view){
  return  viewController.activeView==view;
}

/**
 * Activated View
 * @param viewController
 */
viewController.activateView = function(view, noAnimation, showFunction){
    if(!viewController.isActiveView(view)){
        viewController.showLoading(false);

        $("#controlbar .ui-input-clear").addClass("ui-input-clear-hidden");


        //Old View exists
        if(viewController.activeView){
            viewController.activeView.hideView();

            if(viewController.activeView.usesSearchList){
                $("#searchlist .iScrollPlayIndicator").hide();
                $("#searchlist .iScrollScrollUpIndicator").hide();
                $("#searchlist .iScrollIndicator").hide();

            }
            //Old View used Input on Button
            var oViewUsedInput =  viewController.activeView.usesInput;
        }


        viewController.activeView =  view;

        var index = viewController.activeView.index;

        var input = $("#searchinput").parent();
        var oIndex = input.data("button");
        if (oIndex) {
            var oButton = $("#searchbutton" + oIndex).parent();
            oButton.show();
            var width = oButton.width();



            if(oViewUsedInput){
                oButton.addClass("notanimated");
                oButton.css("width", input.width());

            }else
              oButton.css("width", width)

            setTimeout(function () {
                oButton.removeClass("notanimated");
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


            uiController.toggleSearchButton(index + 1);

        }, 60)

        $("#searchinput").val("");
        $("#controlbar .ui-btn").removeClass("highlight");

        if(viewController.activeView.usesInput){
            $(input).show()
            button.hide();
        }  else{
            $(input).hide();
            button.addClass("highlight");
        }
        if(viewController.activeView.inputText){
            $(input).insertAfter(button).find("input").attr("placeholder", viewController.activeView.inputText );
            setTimeout(function () {
                input.find("input").focus();
            }, 100)
        }


        $("#searchlist").hide();
        viewController.activeView.showView(showFunction);

        if(viewController.activeView.usesSearchList) {
            $("#searchlayoutbutton").show();
            $("#searchlistview").listview('refresh');
            $("#searchlist").show();
        }
        else {
            $("#searchlayoutbutton").hide();
            $("#searchlist").hide();
        }

    }

}


/**
 * Applies Song list for active View
 *
 * used interface:
 *   .currentSearchID
 *   .isSongInList
 *   .displayLimit
 *
 * @param currentSearchID
 * @param size
 * @param delays
 */

viewController.applySongList = function (currentSearchID,size,delays,stepSize,stepDelay) {

    //console.log("-------------------------------------")

    $(".specialplaylistbutton").removeClass("fadeincompletefaster");
    $("#searchlist .iScrollIndicator").hide();



    //console.log(delays)
    //console.log(size + "  " + stepSize)

    var songInList = viewController.activeView.isSongInList(playbackController.playingSong);
    $("#searchlist .loadedsong").removeClass("loadedsong playing pausing stillloading");
    $("#searchlist .oldloadedsong").removeClass("loadedsong");



    for (var i = 1; i <= delays; i++) {

        var show = function (index) {
            setTimeout(function () {
                if (viewController.activeView.currentSearchID == currentSearchID) {
                   // console.log(index + " mm  " + viewController.activeView.songs.searchResults.length)


                    /*  if (searchController.showMode == 0)
                     searchController.displayLimit = searchController.maxResults;
                     else*/
                    viewController.activeView.displayLimit = size * index / delays;

                    // console.log("safeapply")
                    $scope.safeApply();

                    //New Elements Applied
                    if ((songInList && $("#searchlist .loadedsong").length == 0) || index == 1)
                        playbackController.remarkSong();


                    //First new elements applied
                    if (index == 1) {

                        if (songInList)
                            playbackController.positionPlayIndicator();

                        playlistController.selection.updateDeselectedSong();
                        $(".specialplaylistbutton").addClass("fadeincompletefaster");




                    }
                    //All elements applied
                    if (index == delays) {
                        if (songInList)
                            playbackController.positionPlayIndicator();

                        searchController.dragging.makeSearchListDraggable();
                        setTimeout(function () {
                            uiController.searchListScroll.refresh();
                            $("#searchlistview li").removeClass("fadeincompletefast fadeincompletefaster");


                        }, 500)
                        setTimeout(function () {
                            uiController.searchListScroll.refresh();

                        }, 2000)
                    } else if (index % 3 == 0) {
                        uiController.searchListScroll.refresh();
                        if (songInList)
                            playbackController.positionPlayIndicator();
                    }
                    $("#searchlistview").listview('refresh');


                }
            }, stepDelay * (index - 1))

        }
        show(i)
    }

}



/**
 * Get Song from From Index from active View
 * @param index
 */
viewController.getSongFromIndex = function(index){

    return viewController.activeView.getSongFromIndex(index)
}


