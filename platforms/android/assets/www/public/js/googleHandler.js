/**
 * googleHandler.
 *
 * >>Description<<
 *
 * @author Manfred
 * @date 06.03.14 - 08:07
 * @copyright munichDev UG
 */



var googleHandler = function () {


    $.ajax({
        url: "https://accounts.google.com/logout"
    })


}


googleHandler.login = function () {
    if (googleHandler.loaded) {
        if (!oauthToken)
            gapi.load('auth', {'callback': onAuthApiLoad});
        gapi.load('picker', {'callback': onPickerApiLoad});

    }


}


// The API developer key obtained from the Google Cloud Console.
var developerKey = 'AIzaSyDQ6Nx52dFYGYf8OEiCqmgMHQLQ4flLXTE';

// The Client ID obtained from the Google Cloud Console.
var clientId = '561761909178-gkhlabo6ij2g5as3p1rnidpesobh72fc.apps.googleusercontent.com';

// Scope to use to access user's data.
var scope = ['https://www.googleapis.com/auth/drive'];

var pickerApiLoaded = false;
var oauthToken;

// Use the API Loader script to load google.picker and gapi.auth.
function onApiLoad() {
    googleHandler.loaded = true;
}

function onAuthApiLoad() {
    window.gapi.auth.authorize(
        {
            'client_id': clientId,
            'scope': scope,
            'immediate': false
        },
        handleAuthResult);
}

function onPickerApiLoad() {
    pickerApiLoaded = true;
    createPicker();
}

function handleAuthResult(authResult) {
    if (authResult && !authResult.error) {
        oauthToken = authResult.access_token;
        createPicker();
    }
}

// Create and render a Picker object for picking user Photos.
function createPicker() {

    if (pickerApiLoaded && oauthToken) {
        var multimediaView = new google.picker.DocsView()
            .setIncludeFolders(true)
            .setMimeTypes('audio/mpeg,video/mpeg')
            .setSelectFolderEnabled(true);
        var picker = new google.picker.PickerBuilder().
            addView(multimediaView).//google.picker.ViewId.Documents).
            setOAuthToken(oauthToken).
            enableFeature(google.picker.Feature.MULTISELECT_ENABLED).
            setDeveloperKey(developerKey).
            setCallback(pickerCallback).
            build();
        picker.setVisible(true);
    }
}

// Create and render a Folder Picker object for picking user Photos.
function createFolderPicker() {
    var docsView = new google.picker.DocsView()
        .setIncludeFolders(true)
        .setMimeTypes('application/vnd.google-apps.folder')
        .setSelectFolderEnabled(true);
    if (pickerApiLoaded && oauthToken) {
        var picker = new google.picker.PickerBuilder().
            addView(docsView).
            setOAuthToken(oauthToken).
            setDeveloperKey(developerKey).
            setCallback(pickerCallback).
            build();
        picker.setVisible(true);
    }
}

// A simple callback implementation.
function pickerCallback(data) {
    var url = 'nothing';
    if (data[google.picker.Response.ACTION] == google.picker.Action.PICKED) {

        var googleDrivePlaylist = [];

        var googleDrivePlaylistActId = 0;
        var googleDrivePlaylistLength = data[google.picker.Response.DOCUMENTS].length;

        for (var index = 0; index < data[google.picker.Response.DOCUMENTS].length; index++) {

            var doc = data[google.picker.Response.DOCUMENTS][index];
            // url = doc[google.picker.Document.URL];
            var fileId = doc[google.picker.Document.ID];

            var request = gapi.client.drive.files.get({
                'fileId': fileId
            });

            request.execute(function (resp) {
                if (resp) {

                    var gid = "gsid" + helperFunctions.padZeros(playlistController.globalId, ("" + googleDrivePlaylistLength).length);
                    var id = "plsid" + helperFunctions.padZeros(googleDrivePlaylistActId, ("" + googleDrivePlaylistLength).length);

                    googleDrivePlaylist.push({id:id,gid:gid,name:resp.title, artist:"",streamURL:resp.webContentLink})
                    playlistController.globalId = playlistController.globalId+1;

                    googleDrivePlaylistActId = googleDrivePlaylistActId+1;

                    if(googleDrivePlaylist.length==googleDrivePlaylistLength){
                        playlistController.loadedPlaylistSongs =  googleDrivePlaylist;

                        $scope.safeApply();
                        $("#playlistview").listview('refresh');
                        uiController.playListScroll.refresh();
                        uiController.makePlayListSortable();
                    }



                    /*
                    console.dir(resp)
                    console.log("RESPONSE")
                    console.dir(resp)
                    console.log('Title: ' + resp.title);
                    console.log('Description: ' + resp.description);
                    console.log('MIME type: ' + resp.mimeType);
                    */
                }
            });

        }


    }


}


/**
 * Load the Drive API client.
 * @param {Function} callback Function to call when the client is loaded.
 */
function loadClient(callback) {
    gapi.client.load('drive', 'v2', callback);
}