/**
 * @author Marenin Alex
 * August 2012
 */

module.exports = {

	/**
	 * Simple classy single parent inheritance
	 * @param {Function?} Parent
	 * @param {Object} proto
	 */
	declare: (function(){
		function base(){
			var descendant = arguments.callee.caller,
				args = descendant.arguments,
				ancestor = descendant.ancestor;
			ancestor && ancestor.apply( this, args );
		}

		function mixin( dest, source, Parent ){
			for ( var k in source ) if ( source.hasOwnProperty(k) ){
				dest[k] = source[k];
				if ( Parent && isFn(dest[k]) && isFn(Parent.prototype[k]) )
					dest[k].ancestor = Parent.prototype[k];
			}
		}

		function isFn( val ){
			return typeof val === 'function';
		}

		return function( Parent, prototype ){
			function Tmp(){}
			function Ctor(){
				if ( typeof this.init === 'function' )
					this.init.apply( this, arguments );
			}

			if ( typeof Parent === 'function' ){
				Tmp.prototype = Parent.prototype;
				Ctor.prototype = new Tmp;
			}

			mixin( Ctor.prototype, prototype, Parent );
			Ctor.prototype.constructor = Ctor;
			Ctor.prototype.base = base;

			return Ctor;
		}
	})()
};
