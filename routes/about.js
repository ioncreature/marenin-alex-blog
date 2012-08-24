
/**
 * GET about page
 */

exports.about = function( req, res ){
	res.render( 'about', {
		title: 'About',
		ololo: 'trololo',
		aboutText: 'this is about text'
	});
};