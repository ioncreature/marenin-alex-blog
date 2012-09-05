/**
 * @author Marenin Alex
 * August 2012
 */

module.exports = {

	/**
	 * Simple classy single parent inheritance
	 * @param {Function?} Parent
	 * @param {Object} prototype
	 */
	declare: (function( undef ){
		function base(){
			var descendant = arguments.callee.caller,
				args = arguments.length ? arguments : descendant.arguments,
				ancestor = descendant._class.Super.prototype[descendant._name];
			return isFn( ancestor ) ? ancestor.apply( this, args ) : undef;
		}

		function mixin( Ctor, source ){
			var prototype = Ctor.prototype,
				k;
			for ( k in source ) if ( source.hasOwnProperty(k) ){
				prototype[k] = source[k];
				if ( isFn(prototype[k]) ){
					prototype[k]._name = k;
					prototype[k]._class = Ctor;
				}
			}
		}

		function isFn( val ){
			return typeof val === 'function';
		}

		return function( Parent, prototype ){
			function Tmp(){}
			function Ctor(){
				if ( isFn(this.init) )
					this.init.apply( this, arguments );
			}

			if ( isFn(Parent) ){
				Tmp.prototype = Parent.prototype;
				Ctor.prototype = new Tmp;
				Ctor.Super = Parent;
			}

			mixin( Ctor, prototype );
			Ctor.prototype.constructor = Ctor;
			Ctor.prototype.base = base;

			return Ctor;
		}
	})()
};
