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
 * @param {string} path
 * @return {*}
 */
FileStorage.prototype.get = function( path ){
    var keys = path.split( '.' ),
        data = this.data,
        key,
        i = 0;

    while ( i < keys.length ){
        key = keys[i];
        if ( data[key] == null )
            return undefined;
        data = data[key];
        i++;
    }
	return data;
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
        i = 0;

    while ( i < keys.length - 1 ){
        if ( data[key] == null )
            data[key] = {};
        data = data[key];
        i++;
        key = keys[i];
    }
    data[key] = value;
};
