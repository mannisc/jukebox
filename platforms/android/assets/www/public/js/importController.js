/** * importController.
 *
 * >>Description<<
 *
 * @author Norbert
 * @date 04.04.14 - 01:13
 * @copyright  */

var importController = function () {
};

importController.importPlaylist = function(url){
    $.ajax({
        url: preferences.serverURL + "?importplaylist="+encodeURIComponent(url)+"&auth="+authController.ip_token,
        success: function (data) {
           console.dir("imported playlist:");
           console.dir(data);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.dir("imported playlist - error:");
            console.dir(xhr.responseText);
        }
    })
}