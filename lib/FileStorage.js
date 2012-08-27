/**
 * @author Marenin Alex
 * August 2012
 */

var fs = require( 'fs' );


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
FileStorage.prototype.get = function( key ){
	return this.data[key];
};


/**
 * @param {string} key
 * @param {*} value
 * @return undefined
 */
FileStorage.prototype.set = function( key, value ){
	this.data[key] = value;
};

module.exports = FileStorage;
