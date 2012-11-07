/**
 * @author Marenin Alexander
 * October 2012
 */

var express = require( 'express' ),
    http = require( 'http' ),
    path = require( 'path' ),
    util = require( './lib/util.js' ),
    FileStorage = require( './lib/FileStorage.js' ),
    route = {
        INDEX: '/',
        LOGIN: '/login',
        LOGOUT: '/logout',
        ARTICLES: '/articles/:id',
        ARTICLE_NEW: '/article',
        ARTICLE_EDIT: '/article/:id'
    };


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
    app.use( express.logger('dev') );
    app.use( express.bodyParser() );
    app.use( express.cookieParser('keyboard dog') );
    app.use( express.session({
        key: 'sid',
        cookie: { maxAge: 6*3600*1000 } // 6 hours
    }));
    app.use( express.methodOverride() );
    app.use( app.router );
    app.use( '/static/', express.static(path.join(__dirname, 'public')) );
});

app.configure( 'development', function(){
    app.use( express.errorHandler() );
});


// ROUTES
var articles = app.get( 'storage' ).get( 'articles' ) || {};

app.get( route.ARTICLES, function( req, res ){
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


app.get( route.ARTICLE_NEW, function( req, res ){
    var user = req.session.user;
    if ( user )
        res.render( 'article_edit', {
            title: '',
            id: '',
            date: '',
            author: '',
            content: ''
        });
    else
        res.redirect( route.LOGIN );
});


app.post( route.ARTICLE_NEW, (function(){
    function isValid( name ){
        return this[name] && this[name].length > 0;
    }

    return function( req, res ){
        var params = req.body,
            fields = [ 'id', 'title', 'date', 'author', 'content' ],
            valid = fields.every( isValid, params ),
            storage = app.get( 'storage' );

        if ( valid ){
            if ( storage.get('articles.' + params.id) )
                params.errorMessage = 'Article with this id already exists';
            else
                app.get( 'storage' ).set( 'articles.' + params.id, {
                    title: params.title,
                    date: params.date,
                    content: params.content,
                    author: params.author,
                    comments: []
                });
        }
        else
            params.errorMessage = 'Not valid input parameters, please fill in all fields';
        res.render( 'article_edit', params );
    }
})());


app.get( route.ARTICLE_EDIT, function( req, res ){
    var article = app.get( 'storage' ).get( 'articles.'+ req.params.id );

    if ( !req.session.user )
        res.redirect( route.LOGIN );

    else if ( article )
        res.render( 'article_edit', {
            title: article.title,
            id: req.params.id,
            date: article.date,
            author: article.author,
            content: article.content
        });

    else
        res.render( 'article_edit', {
            title: '',
            id: '',
            date: '',
            author: '',
            content: '',
            errorMessage: 'Article with this id is not exists'
        });
});


app.get( route.LOGIN, function( req, res ){
    var session = req.session,
        referrer = req.get( 'Referrer' ) || route.INDEX;

    if ( session.user )
        res.redirect( referrer );
    else {
        session.loginReferrer = referrer;
        res.render( 'login', {
            title: 'Login'
        });
    }
});


app.post( route.LOGIN, function( req, res ){
    var login = req.body.login,
        password = req.body.password,
        user = app.get( 'storage' ).get( 'users' )[login],
        referrer = req.session.loginReferrer || route.INDEX;

    if ( user && user.password === password ){
        delete req.session.loginReferrer;
        req.session.user = user;
        res.redirect( referrer );
    }
    else
        res.render( 'login', {
            title: 'Login',
            wrong: true,
            login: login
        });
});


app.get( route.LOGOUT, function( req, res ){
    delete req.session.user;
    res.redirect( route.INDEX );
});


app.get( route.INDEX, (function(){
    var counter = app.get( 'storage' ).get( 'visits' ) || 0;

    return function( req, res ){
        res.render( 'index', {
            title: 'Alexander Marenin',
            articles: articles,
            visits: ++counter
        });
    };
})());


// SERVER
http.createServer( app ).listen( app.get('port'), function(){
    console.log( "Express server listening on port " + app.get('port') );
});
