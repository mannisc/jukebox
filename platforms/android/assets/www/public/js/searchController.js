/** * searchController.
 *
 * >>Description<<
 *
 * @author Norbert
 * @date 03.03.14 - 13:58
 * @copyright  */


var searchController = function () {

};


searchController.initSearch=function(){


    searchController.search($("#searchinput").val());


}




searchController.search=function(searchString,callback){

    searchController.searchSongs(searchString,"","",callback);
}


searchController.searchSongs=function(searchString,title,artist,callbackSuccess){

    var list =[];

    //list.push({a:"b"})


    list.unshift();


    $.ajax({
        url:"http://ws.audioscrobbler.com/2.0/?method=track.search&track="+searchString+"&page=1&api_key=019c7bcfc5d37775d1e7f651d4c08e6f&format=json",
        success:function(data){

          if(data.results&&data.results.trackmatches){
              if(data.results.trackmatches=="↵"){
                    //TODO localhost anfragen
              }
              else
              {
                 console.dir(data.results);
                 if(callbackSuccess)
                   callbackSuccess(data.results.trackmatches);

              }

          }

        }
    })



}


/*
 var func = function(){
 alert(1000);
 }

 var func2 = function(){
 alert(1000);
 }
 var func3 = function(){
 alert(1000);
 }

 setTimeout(func,0)
 setTimeout(func2,0)
 setTimeout(func3,0)



 console.log("sfdsfsdfsf")
 console.dir(this)

 */