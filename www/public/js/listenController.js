/**
 * listenController.
 *
 * >>Description<<
 *
 * @author Manfred
 * @date 21.07.14 - 10:13
 * @copyright munichDev UG
 */





var listenController = function () {

};


listenController.genres = function () {

};


listenController.genres.genre = [
    {name: "60's", action: function(){mediaController.loadGenre(this.name)}},
    {name: "70's",action: function(){mediaController.loadGenre(this.name)}},
    {name: "80's",action: function(){mediaController.loadGenre(this.name)}},
    {name: "Alternative Rock", action: function(){mediaController.loadGenre(this.name)}},
    {name: "Ambient",action: function(){mediaController.loadGenre(this.name)}},
    {name: "Bachata", action: function(){mediaController.loadGenre(this.name)}},
    {name: "Chillout", action: function(){mediaController.loadGenre(this.name)}},
    {name: "Classic Rock", action: function(){mediaController.loadGenre(this.name)}},
    {name: "Classical", action: function(){mediaController.loadGenre(this.name)}},
    {name: "Country", action: function(){mediaController.loadGenre(this.name)}},
    {name: "Cumbia", action: function(){mediaController.loadGenre(this.name)}},
    {name: "Dance", action: function(){mediaController.loadGenre(this.name)}},
    {name: "Electronic", action: function(){mediaController.loadGenre(this.name)}},
    {name: "Hip Hop", action: function(){mediaController.loadGenre(this.name)}},
    {name: "Indie Folk", action: function(){mediaController.loadGenre(this.name)}},
    {name: "Indie Rock", action: function(){mediaController.loadGenre(this.name)}},
    {name: "Jazz", action: function(){mediaController.loadGenre(this.name)}},
    {name: "K-Pop", action: function(){mediaController.loadGenre(this.name)}},
    {name: "Pop", action: function(){mediaController.loadGenre(this.name)}},
    {name: "Rock", action:  function(){mediaController.loadGenre(this.name)}},
    {name: "R&B", action: function(){mediaController.loadGenre(this.name)}},
    {name: "Reggae", action: function(){mediaController.loadGenre(this.name)}},
    {name: "Samba", action: function(){mediaController.loadGenre(this.name)}}
];


listenController.usesSearchList = true;

listenController.index = 2;


/**
 *  Show View
 */
listenController.showView = function (showFunction) {
    uiController.searchListScroll.scrollTo(0, 0, 0);

    listenController.visible = true;

    //Set Layout to grid
    //listenController.oldGridLayout = uiController.gridLayout;
    //if(!uiController.gridLayout )
   // uiController.toggleGridLayout();
    viewController.showLoading(true);

    $("#searchinput").val("");
    $("#searchlistview").hide();

    setTimeout(function () {
        if (listenController.visible) {
            $scope.safeApply();
            $("#searchlistview").listview('refresh');
            uiController.searchListScroll.refresh();

            $("#searchlistview").show();

            if (showFunction)
                showFunction();
            setTimeout(function () {
                if(listenController.visible)
                    viewController.showLoading(false);
                uiController.searchListScroll.refresh();

            } ,500);

        }
    }, 350);


}


/**
 * Hide View
 */
listenController.hideView = function () {

    //if(listenController.oldGridLayout != uiController.gridLayout)
    //    uiController.toggleGridLayout();

    listenController.visible = false;
    $scope.safeApply();
    $("#searchlistview").listview('refresh');

}


