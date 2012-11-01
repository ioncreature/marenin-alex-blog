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
	app.set( 'storage path', path.join(__dirname, 'storage', 'data.json') );
	app.set( 'storage', new FileStorage(app.get('storage path')) );
    app.set( 'storage' ).load();

	app.use( express.favicon() );
	app.use( express.logger( 'dev' ) );
	app.use( express.bodyParser() );
	app.use( express.methodOverride() );
	app.use( app.router );
	app.use( '/public/', express.static(path.join(__dirname, 'public')) );
});

app.configure( 'development', function(){
	app.use( express.errorHandler() );
});


// ROUTES
var articles = app.get( 'storage' ).get( 'articles' ) || {};

app.get( '/article/:id', function( req, res ){
	var article = articles[req.params.id];

    if ( article )
        res.render( 'article', {
            title: article.title,
            article: article,
            date: util.dateToYMD( article.date )
        });
    else
        res.render( '404', {title: 'Not Found'} );
});

app.get( '/', (function(){
	var counter = app.get( 'storage' ).get( 'visits' ) || 0;

	return function( req, res ){
		res.render( 'index', {
            title: 'asd',
			articles: articles,
            visits: ++counter
		});
	};
})());


// SERVER
http.createServer( app ).listen( app.get('port'), function(){
	console.log( "Express server listening on port " + app.get('port') );
});
