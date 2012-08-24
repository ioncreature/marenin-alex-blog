
/*
 * GET home page.
 */

var counter = 0;

exports.index = function(req, res){
	res.render('index', { title: 'Marenin Alexander' + ++counter });
};