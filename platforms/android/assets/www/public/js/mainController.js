/***********************************************
 *  MainController.js
 *
 *  Controller (MVC) for all list elements using angular.js
 *
 *
 *  @author masch
 *  @date 25.10.13
 *  @copyright
 *
 *
 ***********************************************
 */


/**
 * The MainController of the App
 * @param $scope
 * @param $timeout
 * @constructor
 */
function MainController($scope,$compile) {

    window.$scope = $scope;
    window.$compile = $compile;


    $scope.appTitle = "Songbase.fm";



    //Safe NG Apply, applies changed to the $scope model to the html dom
    $scope.safeApply = function () {
        //console.dir(new Error().stack)
        var phase = this.$root.$$phase;
        if (phase != '$apply' && phase != '$digest') {
            this.$apply();
        }
    };


    $scope.debugObj = function(obj){

        /*console.log("''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''")
        console.dir(obj)
        console.log("''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''")
        */
        return obj;
    }


    $scope.alert = function(msg){
        alert("NG : "+msg);
    }



    //Bind Controllers
    $scope.mediaController    = mediaController;
    $scope.uiController       = uiController;

    $scope.viewController = viewController;

    $scope.searchController   = searchController;
    $scope.exploreController = exploreController;
    $scope.listenController = listenController;
    $scope.myBaseController = myBaseController;

    $scope.playlistController = playlistController;
    $scope.playbackController = playbackController;

    $scope.accountController  = accountController;
    $scope.optionsMenu  = optionsMenu;


    $scope.stopPropagation= function(event){
        event.stopPropagation();
        uiController.swipeTimer  = Date.now();
    }



    /*
    $scope.searchResults = [
        {id:Math.random()*10000000,coverUrl:"",displayName:"Pharrell Williams - Happy",artist:"Pharrell Williams",title:"Happy"} ,
        {id:Math.random()*10000000,coverUrl:"",displayName:"Pitbull - Timber",artist:"...",title:"..."} ,
        {id:Math.random()*10000000,coverUrl:"",displayName:"Avicii - Hey Brother",artist:"...s",title:"..."} ,
        {id:Math.random()*10000000,coverUrl:"",displayName:"Mr. Probz - Waves",artist:"...",title:"..."} ,
        {id:Math.random()*10000000,coverUrl:"",displayName:"Helene Fischer -  Atemlos durch die Nacht",artist:"...",title:"..."} ,
        {id:Math.random()*10000000,coverUrl:"",displayName:"I See Fire  Ed Sheeran ",artist:"...",title:"..."} ,
        {id:Math.random()*10000000,coverUrl:"",displayName:"Revolverheld - Ich lass für dich das Licht an ",artist:"...",title:"..."} ,
        {id:Math.random()*10000000,coverUrl:"",displayName:"Changes - Faul & Wad Ad vs. Pnau",artist:"...",title:"..."} ,
        {id:Math.random()*10000000,coverUrl:"",displayName:"Lily Allen - Hard Out Here ",artist:"...",title:"..."} ,
        {id:Math.random()*10000000,coverUrl:"",displayName:"Shakira feat. Rihanna - Can't Remember To Forget You",artist:"...",title:"..."} ,
        {id:Math.random()*10000000,coverUrl:"",displayName:"Pharrell Williams - Happy",artist:"Pharrell Williams",title:"Happy"} ,
        {id:Math.random()*10000000,coverUrl:"",displayName:"Pitbull - Timber",artist:"...",title:"..."} ,
        {id:Math.random()*10000000,coverUrl:"",displayName:"Avicii - Hey Brother",artist:"...s",title:"..."},
        {id:Math.random()*10000000,coverUrl:"",displayName:"Mr. Probz - Waves",artist:"...",title:"..."} ,
        {id:Math.random()*10000000,coverUrl:"",displayName:"Helene Fischer -  Atemlos durch die Nacht",artist:"...",title:"..."} ,
        {id:Math.random()*10000000,coverUrl:"",displayName:"I See Fire  Ed Sheeran ",artist:"...",title:"..."} ,
        {id:Math.random()*10000000,coverUrl:"",displayName:"Revolverheld - Ich lass für dich das Licht an ",artist:"...",title:"..."} ,
        {id:Math.random()*10000000,coverUrl:"",displayName:"Changes - Faul & Wad Ad vs. Pnau",artist:"...",title:"..."} ,
        {id:Math.random()*10000000,coverUrl:"",displayName:"Lily Allen - Hard Out Here ",artist:"...",title:"..."} ,
        {id:Math.random()*10000000,coverUrl:"",displayName:"Shakira feat. Rihanna - Can't Remember To Forget You",artist:"...",title:"..."} ,
        {id:Math.random()*10000000,coverUrl:"",displayName:"Pharrell Williams - Happy",artist:"Pharrell Williams",title:"Happy"} ,
        {id:Math.random()*10000000,coverUrl:"",displayName:"Pitbull - Timber",artist:"...",title:"..."} ,
        {id:Math.random()*10000000,coverUrl:"",displayName:"Avicii - Hey Brother",artist:"...s",title:"..."},
        {id:Math.random()*10000000,coverUrl:"",displayName:"Mr. Probz - Waves",artist:"...",title:"..."} ,
        {id:Math.random()*10000000,coverUrl:"",displayName:"Helene Fischer -  Atemlos durch die Nacht",artist:"...",title:"..."} ,
        {id:Math.random()*10000000,coverUrl:"",displayName:"I See Fire  Ed Sheeran ",artist:"...",title:"..."} ,
        {id:Math.random()*10000000,coverUrl:"",displayName:"Revolverheld - Ich lass für dich das Licht an ",artist:"...",title:"..."} ,
        {id:Math.random()*10000000,coverUrl:"",displayName:"Changes - Faul & Wad Ad vs. Pnau",artist:"...",title:"..."} ,
        {id:Math.random()*10000000,coverUrl:"",displayName:"Lily Allen - Hard Out Here ",artist:"...",title:"..."} ,
        {id:Math.random()*10000000,coverUrl:"",displayName:"Shakira feat. Rihanna - Can't Remember To Forget You",artist:"...",title:"..."} ,
        {id:Math.random()*10000000,coverUrl:"",displayName:"Pharrell Williams - Happy",artist:"Pharrell Williams",title:"Happy"} ,
        {id:Math.random()*10000000,coverUrl:"",displayName:"Pitbull - Timber",artist:"...",title:"..."} ,
        {id:Math.random()*10000000,coverUrl:"",displayName:"Avicii - Hey Brother",artist:"...s",title:"..."} ,
        {id:Math.random()*10000000,coverUrl:"",displayName:"Mr. Probz - Waves",artist:"...",title:"..."} ,
        {id:Math.random()*10000000,coverUrl:"",displayName:"Helene Fischer -  Atemlos durch die Nacht",artist:"...",title:"..."} ,
        {id:Math.random()*10000000,coverUrl:"",displayName:"I See Fire  Ed Sheeran ",artist:"...",title:"..."} ,
        {id:Math.random()*10000000,coverUrl:"",displayName:"Revolverheld - Ich lass für dich das Licht an ",artist:"...",title:"..."} ,
        {id:Math.random()*10000000,coverUrl:"",displayName:"Changes - Faul & Wad Ad vs. Pnau",artist:"...",title:"..."} ,
        {id:Math.random()*10000000,coverUrl:"",displayName:"Lily Allen - Hard Out Here ",artist:"...",title:"..."} ,
        {id:Math.random()*10000000,coverUrl:"",displayName:"Shakira feat. Rihanna - Can't Remember To Forget You",artist:"...",title:"..."}


    ]
          */

    $scope.loaded = true;
}



