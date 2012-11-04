/**
 * @author Marenin Alex
 * August 2012
 */

var fs = require( 'fs' );

module.exports = FileStorage;

function FileStorage( path ){
	this.path = path;
	this.data = {};
}


FileStorage.prototype.load = function(){
	this.data = JSON.parse( fs.readFileSync(this.path, 'utf8') );
};


FileStorage.prototype.save = function(){
	fs.writeFileSync( this.path, JSON.stringify(this.data, null, '\t'), 'utf8' );
};


/**
 * @param {string} key
 * @return {*}
 */
FileStorage.prototype.get = function getKey( key ){
	return this.data[key];
};


/**
 * @param {string} path
 * @param {*} value
 * @return undefined
 */
FileStorage.prototype.set = function( path, value ){
    var keys = path.split( '.' ),
        key = keys[0],
        data = this.data,
        next,
        i;

    for ( i = 1; i < keys.length; i++ ){
        key = keys[i];
        if ( data[key] == null ){}
        else
            data = data[key];
    }

    data[key] = value;
//	this.data[path] = value;
};
