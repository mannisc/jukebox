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
    {name: "60's", action: function(){mediaController.loadGenre('60s')}},
    {name: "70's",action: function(){mediaController.loadGenre('70s')}},
    {name: "80's",action: function(){mediaController.loadGenre('80s')}},
    {name: "90's", action: function(){mediaController.loadGenre('90s')}},
    {name: "Alternative Rock", action: function(){mediaController.loadGenre('Alternative Rock')}},
    {name: "Ambient",action: function(){mediaController.loadGenre('Ambient')}},
    {name: "Bachata", action: function(){mediaController.loadGenre('Bachata')}},
    {name: "Chillout", action: function(){mediaController.loadGenre('Chillout')}},
    {name: "Classic Rock", action: function(){mediaController.loadGenre('Classic Rock')}},
    {name: "Classical", action: function(){mediaController.loadGenre('Classical')}},
    {name: "Country", action: function(){mediaController.loadGenre('Country')}},
    {name: "Cumbia", action: function(){mediaController.loadGenre('Cumbia')}},
    {name: "Dance", action: function(){mediaController.loadGenre('Dance')}},
    {name: "Electronic", action: function(){mediaController.loadGenre('Electronic')}},
    {name: "Hip Hop", action: function(){mediaController.loadGenre('Hip Hop')}},
    {name: "Indie Folk", action: function(){mediaController.loadGenre('Indie Folk')}},
    {name: "Indie Rock", action: function(){mediaController.loadGenre('Indie Rock')}},
    {name: "Jazz", action: function(){mediaController.loadGenre('Jazz')}},
    {name: "K-Pop", action: function(){mediaController.loadGenre('K-Pop')}},
    {name: "Pop", action: function(){mediaController.loadGenre('Pop')}},
    {name: "Rock", action: function(){mediaController.loadGenre('Rock')}},
    {name: "R&B", action: function(){mediaController.loadGenre('R&B')}},
    {name: "Reggae", action: function(){mediaController.loadGenre('Reggae')}},
    {name: "Samba", action: function(){mediaController.loadGenre('Samba')}},
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
    listenController.oldGridLayout = uiController.gridLayout;
    if(!uiController.gridLayout )
    uiController.toggleGridLayout();



    $("#searchinput").val("");

    setTimeout(function () {
        if (listenController.visible) {
            $scope.safeApply();
            $("#searchlistview").listview('refresh');
            uiController.searchListScroll.refresh();
            if (showFunction)
                showFunction();
        }
    }, 350);


}


/**
 * Hide View
 */
listenController.hideView = function () {

    if(listenController.oldGridLayout != uiController.gridLayout)
        uiController.toggleGridLayout();

    listenController.visible = false;
    $scope.safeApply();
    $("#searchlistview").listview('refresh');

}


