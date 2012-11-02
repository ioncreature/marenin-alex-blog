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

// TODO
module.exports = function( options ){
    var defaultLoc = options.defaultLocale,
        loc = options.locale || 'en',
        storage = options.storage,
        path = options.path,
        fs = new FileStorage

    function t( key ){}

    return function( req, res, next ){
        req.i18n =

        next();
    }
};