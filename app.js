/**
 * @author Marenin Alexander
 * October 2012
 */

var express = require( 'express' ),
    http = require( 'http' ),
    path = require( 'path' ),
    util = require( './lib/util.js' ),
    marked = require( 'marked' ),
    FileStorage = require( './lib/FileStorage.js' ),
    route = {
        INDEX: '/',
        LOGIN: '/login',
        LOGOUT: '/logout',
        ARTICLES: '/articles/:id',
        ARTICLE_NEW: '/article',
        ARTICLE_EDIT: '/article/:id',
        TEST: '/test'
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

    util.mixin( app.locals, util.templateHelpers );
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
            date: article.date
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
            content: '',
            htmlContent: ''
        });
    else
        res.redirect( route.LOGIN );
});


app.post( route.ARTICLE_NEW, (function(){
    function isValid( name ){
        return this[name] && this[name].length > 0;
    }

    return function( req, res ){
        if ( !req.session.user )
            return res.redirect( route.LOGIN );

        var params = req.body,
            fields = [ 'id', 'title', 'author', 'content' ],
            valid = fields.every( isValid, params ),
            storage = app.get( 'storage' );

        if ( valid ){
            if ( storage.get('articles.' + params.id) )
                params.errorMessage = 'Article with this id already exists';
            else {
                storage.set( 'articles.' + params.id, {
                    title: params.title,
                    date: params.date || Date.now(),
                    content: params.content,
                    htmlContent: marked( params.content ),
                    author: params.author,
                    comments: []
                });
                storage.save();
            }
        }
        else
            params.errorMessage = 'Not valid input parameters, please fill in all fields';
        res.redirect( util.format(route.ARTICLE_EDIT, {id: params.id}) );
    }
})());

app.post( route.ARTICLE_EDIT, (function(){
    // TODO: here is some kind of duplicate logic, need to refactor
    function isValid( name ){
        return this[name] && this[name].length > 0;
    }

    return function( req, res ){
        if ( !req.session.user )
            return res.redirect( route.LOGIN );
        var params = req.body,
            id = req.params.id,
            fields = [ 'id', 'title', 'author', 'content' ],
            valid = fields.every( isValid, params ),
            storage = app.get( 'storage' ),
            articles = storage.get( 'articles' ),
            oldArticle = articles[id];

        if ( valid ){
            delete articles[id];

            storage.set( 'articles.' + params.id, {
                title: params.title,
                date: params.date || oldArticle.date,
                content: params.content,
                htmlContent: marked( params.content ),
                author: params.author,
                comments: oldArticle.comments
            });
            storage.save();
        }
        else
            params.errorMessage = 'Not valid input parameters, please fill in all fields';
        res.redirect( util.format(route.ARTICLE_EDIT, {id: params.id}) );
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
            content: article.content,
            htmlContent: article.htmlContent
        });

    else
        res.render( 'article_edit', {
            title: '',
            id: '',
            date: '',
            author: '',
            content: '',
            htmlContent: '',
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
            visits: ++counter,
            canEdit: !!req.session.user
        });
    };
})());

app.get( route.TEST, function( req, res ){
    var articles = app.get( 'storage' ).get( 'articles' );
    Object.keys( articles ).forEach( function( key ){
        articles[key].htmlContent = marked( articles[key].content );
    });
    app.get( 'storage' ).save();
    console.log( articles );
    res.end( 'Ok' );
});


// SERVER
http.createServer( app ).listen( app.get('port'), function(){
    console.log( "Express server listening on port " + app.get('port') );
});
