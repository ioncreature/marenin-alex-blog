/**
 * @author Marenin Alexander
 * November 2012
 */

module.exports = i18n;

function i18n( key ){
    return i18n.storage.get( key );
}

var FileStorage = require( './FileStorage' );

i18n.load = function( fileName ){
    i18n.storage = new FileStorage( fileName );
    i18n.storage.load();
};