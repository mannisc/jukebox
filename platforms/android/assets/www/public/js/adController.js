/**
 * adController.
 *
 * >>Description<<
 *
 * @author Manfred
 * @date 04.08.14 - 22:17
 * @copyright munichDev UG
 */



var adController = function () {
};


adController.init = function () {

    adController.mode =  (Math.random() > 0.5);

    if (adController.mode) {
        $(".chitikaAd").hide();
    } else {
        $(".exoClickAd").hide();
    }


    //Detect Adblock
    var checkAdblock = function () {
        if ($(".sideinfo iframe").length == 0) {  //$(".sideinfo .adsbygoogle").children().length == 0 //google adsense
            $(".sideinfo .blocked").show();
        } else
            $(".sideinfo .blocked").hide();
    }


    var reloadAdblock = function () {
        if (adController.mode) {
            $('.infoRightReload iframe').removeClass("fadeincomplete2s")
            $('.infoRightReload iframe').hide();

            $('.infoPopupReload iframe').attr('src', $('.infoPopupReload iframe').attr('src'));

            $('.infoRightReload iframe').attr('src', $('.infoRightReload iframe').attr('src'));

            $('.infoRightReload iframe').addClass("fadeincomplete2s")
            $('.infoRightReload iframe').show();
        }

        setTimeout(checkAdblock, 3000);
        setTimeout(reloadAdblock, 150000);
    }
    setTimeout(reloadAdblock, 40000);

}
