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
		};
	})(),


    mixin: function( dest, source ){
        for ( var k in source ) if ( source.hasOwnProperty(k) )
            dest[k] = source[k];
        return dest;
    },

    /**
     * @param {string} route
     * @param {Object} data
     * @return string
     */
    format: function( route, data ){
        var placeholders = route.match( /:\w+/g ) || [],
            res = route,
            i;

        for ( i = 0; i < placeholders.length; i++ )
            res = res.replace( new RegExp(placeholders[i], 'g'), data[placeholders[i].substr(1)] );

        return res;
    },


    templateHelpers: {
        toDate: function( dateArg ){
            var date, d, m, y;
            if ( dateArg instanceof Date )
                date = dateArg;
            else
                date = new Date( dateArg );

            d = date.getDate();
            m = date.getMonth() + 1;
            y = date.getFullYear();
            return '' + y + '-' + (m <= 9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d) + ' ' + date.toTimeString();
        }
    }
};
