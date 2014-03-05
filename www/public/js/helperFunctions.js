/**
 * helperFunctions.
 *
 * >>Description<<
 *
 * @author Manfred
 * @date 05.03.14 - 17:49
 * @copyright munichDev UG
 */

var helperFunctions = function () {

};



helperFunctions.padZeros = function(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}



