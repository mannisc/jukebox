/**
 * templateHandler.
 *
 * >>Description<<
 *
 * @author Manfred
 * @date 04.05.14 - 18:07
 * @copyright munichDev UG
 */


var templateHandler = function () {
}




templateHandler.buildTemplate = function(templateText,templateProps) {

    if(templateProps&&templateProps.length>0){
        for (var i = 0; i < templateProps.length; i++) {
            var templateProp = templateProps[i];
            templateText = templateText.replace(templateProp.search,templateProp.replace)
        }
    }
    return  templateText;

}


module.exports = templateHandler;
