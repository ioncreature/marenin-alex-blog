var express = require( 'express' ),
	routes = require( './routes' ),
	http = require( 'http' ),
	path = require( 'path' );

var app = express();

app.configure( function(){
	app.set( 'port', 3000 );
	app.set( 'views', __dirname + '/views' );
	app.set( 'view engine', 'jade' );
	app.use( express.favicon() );
	app.use( express.logger( 'dev' ) );
	app.use( express.bodyParser() );
	app.use( express.methodOverride() );
	app.use( app.router );
	app.use( express.static(path.join(__dirname, 'public')) );
} );

app.configure( 'development', function(){
	app.use( express.errorHandler() );
});


// ROUTES

app.get( '/article/:id', function( req, res ){
	res.render( 'article_get', { title: 'Header ololo: ' + req.params.id });
});

app.get( '/', routes.index );


// SERVER

http.createServer( app ).listen( app.get( 'port' ), function(){
	console.log( "Express server listening on port " + app.get( 'port' ) );
});
