/** * rsaController.
 *
 * >>Description<<
 *
 * @author Norbert
 * @date 13.03.14 - 20:01
 * @copyright  */

var rsaController = function () {
};
rsaController.n="6e68b31d0b022f714527b8d3a73a8025e2af97548ea80385f9137a2ef74f1d8422c3d82b0d7973a02fe8f5c961cbf1ed06f457af1cd5575c2f83d305b0a14943";
rsaController.e="3";
rsaController.rsa = new RSAKey();
rsaController.rsa.setPublic(rsaController.n, rsaController.e);