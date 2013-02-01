/**
 * @author Marenin Alexander
 * February 2013
 */

module.exports = Observable;

const handlersPropertyName = '_observableHandlers';

function Observable(){}

/**
 *
 * @param {String} eventName
 * @param {Function} handler
 */
Observable.prototype.on = function( eventName, handler ){
    if ( !this.hasOwnProperty(handlersPropertyName) )
        Object.defineProperty( this, handlersPropertyName, {
            value: {},
            enumerable: false
        });

    var handlers = this[handlersPropertyName];

    if ( handlers[eventName] )
        handlers[eventName].push( handler );
    else
        handlers[eventName] = [handler];
};

/**
 * @param {String} eventName
 */
Observable.prototype.emit = function( eventName ){
    var handlers = this[handlersPropertyName] && this[handlersPropertyName][eventName],
        context = this;

    handlers && handlers.forEach( function( handler ){
        handler.call( context );
    });
};