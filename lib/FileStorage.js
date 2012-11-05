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
        key,
        data = this.data,
        i = 0;

    do {
        key = keys[i];
        if ( isLast(i) )
            data[key] = value;
        else if ( isObject(data[key]) )
            data = data[key];
        else if ( data[key] == null ){
            data[key] = {};
            data = data[key];
        }
        else
            data = data[key];
        i++;
    }
    while ( i < keys.length );
};
