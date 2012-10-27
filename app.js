/**
 * @author Marenin Alexander
 * October 2012
 */

var express = require( 'express' ),
	http = require( 'http' ),
	path = require( 'path' ),
	util = require( './lib/util.js' ),
	FileStorage = require( './lib/FileStorage.js' );


// CONFIGURE
var app = express();
app.configure( function(){
	app.set( 'port', 3000 );
	app.set( 'views', __dirname + '/views' );
	app.set( 'view engine', 'jade' );
	app.set( 'storage path', __dirname + '/storage/data.json' );
	app.use( express.favicon() );
	app.use( express.logger( 'dev' ) );
	app.use( express.bodyParser() );
	app.use( express.methodOverride() );
	app.use( app.router );
	app.use( express.static(path.join(__dirname, 'public')) );
});

app.configure( 'development', function(){
	app.use( express.errorHandler() );
});

var storage = new FileStorage( app.get('storage path') );
storage.load();


// ROUTES
var articles = storage.get( 'articles' ) || {};

app.get( '/article/:id', function( req, res ){
	var article = articles[req.params.id];

	res.render( 'article', {
		title: article.title,
		article: article,
		date: util.dateToYMD( article.date )
	});
});

app.get( '/', (function(){
	var counter = 0;

	return function( req, res ){
		res.render( 'index', {
			title: 'Marenin Alexander' + ++counter,
			articles: articles
		});
	};
})());


// SERVER
http.createServer( app ).listen( app.get('port'), function(){
	console.log( "Express server listening on port " + app.get('port') );
});
