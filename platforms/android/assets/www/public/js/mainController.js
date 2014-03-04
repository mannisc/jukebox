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
    //Safe NG Apply, applies changed to the $scope model to the html dom
    $scope.safeApply = function () {
        var phase = this.$root.$$phase;
        if (phase != '$apply' && phase != '$digest') {
            this.$apply();
        }
    };



    //Bind Controllers
    $scope.mediaController = mediaController;
    $scope.uiController = uiController;
    $scope.searchController = searchController;
    $scope.playlistController = playlistController;


    //$scope.playlistsResults =  [{"name":"Supergeil","artist":"Subzonic","url":"http://www.last.fm/music/Subzonic/_/Supergeil","streamable":{"#text":"0","fulltrack":"0"},"listeners":"210","image":[{"#text":"http://userserve-ak.last.fm/serve/34s/32289987.jpg","size":"small"},{"#text":"http://userserve-ak.last.fm/serve/64s/32289987.jpg","size":"medium"},{"#text":"http://userserve-ak.last.fm/serve/126/32289987.jpg","size":"large"},{"#text":"http://userserve-ak.last.fm/serve/300x300/32289987.jpg","size":"extralarge"}],"mbid":"b90eb892-3426-45e5-91d1-4b02f5c9d320"},{"name":"Supergeil","artist":"Der Tourist","url":"http://www.last.fm/music/Der+Tourist/_/Supergeil","streamable":{"#text":"0","fulltrack":"0"},"listeners":"986","mbid":""},{"name":"Supergeil","artist":"Geile Tiere","url":"http://www.last.fm/music/Geile+Tiere/_/Supergeil","streamable":{"#text":"0","fulltrack":"0"},"listeners":"118","mbid":""},{"name":"Supergeil","artist":"The Opposites","url":"http://www.last.fm/music/The+Opposites/_/Supergeil","streamable":{"#text":"0","fulltrack":"0"},"listeners":"20","mbid":""},{"name":"A5 supergeil","artist":"Geile Tiere","url":"http://www.last.fm/music/+noredirect/Geile+Tiere/_/A5+supergeil","streamable":{"#text":"0","fulltrack":"0"},"listeners":"15","mbid":""},{"name":"Supergeil (Abendstern Remix)","artist":"Der Tourist","url":"http://www.last.fm/music/Der+Tourist/_/Supergeil+(Abendstern+Remix)","streamable":{"#text":"0","fulltrack":"0"},"listeners":"16","mbid":""},{"name":"Supergeil (Siriusmo Remix)","artist":"Der Tourist","url":"http://www.last.fm/music/Der+Tourist/_/Supergeil+(Siriusmo+Remix)","streamable":{"#text":"0","fulltrack":"0"},"listeners":"10","mbid":""},{"name":"Supergeil (feat. Friedrich Liechtenstein)","artist":"Der Tourist","url":"http://www.last.fm/music/Der+Tourist/_/Supergeil+(feat.+Friedrich+Liechtenstein)","streamable":{"#text":"0","fulltrack":"0"},"listeners":"401","mbid":""},{"name":"Supergeil","artist":"Der Tourist feat. Friedrich Liechtenstein","url":"http://www.last.fm/music/Der+Tourist+feat.+Friedrich+Liechtenstein/_/Supergeil","streamable":{"#text":"0","fulltrack":"0"},"listeners":"172","mbid":""},{"name":"Supergeil - Jan Driver Remix","artist":"Der Tourist","url":"http://www.last.fm/music/Der+Tourist/_/Supergeil+-+Jan+Driver+Remix","streamable":{"#text":"0","fulltrack":"0"},"listeners":"106","mbid":""},{"name":"Supergeil - Abendstern Remix","artist":"Der Tourist","url":"http://www.last.fm/music/Der+Tourist/_/Supergeil+-+Abendstern+Remix","streamable":{"#text":"0","fulltrack":"0"},"listeners":"112","mbid":""},{"name":"Supergeil (Jan Driver Remix)","artist":"Der Tourist","url":"http://www.last.fm/music/Der+Tourist/_/Supergeil+(Jan+Driver+Remix)","streamable":{"#text":"0","fulltrack":"0"},"listeners":"11","mbid":""},{"name":"supergeil klasse phantom durchfall mix 08","artist":"Tom maertens","url":"http://www.last.fm/music/Tom+maertens/_/supergeil+klasse+phantom+durchfall+mix+08","streamable":{"#text":"0","fulltrack":"0"},"listeners":"74","mbid":""},{"name":"Supergeil - Scorpio's Miami Brass Remix","artist":"Der Tourist","url":"http://www.last.fm/music/Der+Tourist/_/Supergeil+-+Scorpio%27s+Miami+Brass+Remix","streamable":{"#text":"0","fulltrack":"0"},"listeners":"147","mbid":""},{"name":"Supergeil (Siriusmo Remix) [feat. Friedrich Liechtenstein]","artist":"Der Tourist","url":"http://www.last.fm/music/Der+Tourist/_/Supergeil+(Siriusmo+Remix)+%5Bfeat.+Friedrich+Liechtenstein%5D","streamable":{"#text":"0","fulltrack":"0"},"listeners":"48","mbid":""},{"name":"The Opposites Big2 ft. Klopdokter - Supergeil","artist":"The Opposites","url":"http://www.last.fm/music/The+Opposites/_/The+Opposites+Big2+ft.+Klopdokter+-+Supergeil","streamable":{"#text":"0","fulltrack":"0"},"listeners":"9","mbid":""},{"name":"Der Tourist feat. Friedrich Liechtenstein - Supergeil","artist":"[unknown]","url":"http://www.last.fm/music/%5Bunknown%5D/_/Der+Tourist+feat.+Friedrich+Liechtenstein+-+Supergeil","streamable":{"#text":"0","fulltrack":"0"},"listeners":"7","mbid":""}];


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


}



