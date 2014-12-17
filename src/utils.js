/**
 * utils
 */

/*global matchesSelector: false */

( function( window ) {

'use strict';

var U = {};

// ----- extend ----- //

// extends objects
U.extend = function( a, b ) {
  for ( var prop in b ) {
    a[ prop ] = b[ prop ];
  }
  return a;
};

// ----- isArray ----- //
  
var objToString = Object.prototype.toString;
U.isArray = function( obj ) {
  return objToString.call( obj ) === '[object Array]';
};

// ----- makeArray ----- //

// turn element or nodeList into an array
U.makeArray = function( obj ) {
  var ary = [];
  if ( U.isArray( obj ) ) {
    // use object if already an array
    ary = obj;
  } else if ( obj && typeof obj.length === 'number' ) {
    // convert nodeList to array
    for ( var i=0, len = obj.length; i < len; i++ ) {
      ary.push( obj[i] );
    }
  } else {
    // array of single index
    ary.push( obj );
  }
  return ary;
};

// ----- indexOf ----- //

// index of helper cause IE8
U.indexOf = Array.prototype.indexOf ? function( ary, obj ) {
    return ary.indexOf( obj );
  } : function( ary, obj ) {
    for ( var i=0, len = ary.length; i < len; i++ ) {
      if ( ary[i] === obj ) {
        return i;
      }
    }
    return -1;
  };

// ----- removeFrom ----- //

U.removeFrom = function( obj, ary ) {
  var index = U.indexOf( ary, obj );
  if ( index !== -1 ) {
    ary.splice( index, 1 );
  }
};

// ----- isElement ----- //

// http://stackoverflow.com/a/384380/182183
U.isElement = ( typeof HTMLElement === 'function' || typeof HTMLElement === 'object' ) ?
  function isElementDOM2( obj ) {
    return obj instanceof HTMLElement;
  } :
  function isElementQuirky( obj ) {
    return obj && typeof obj === 'object' &&
      obj.nodeType === 1 && typeof obj.nodeName === 'string';
  };

// ----- filterFindElements ----- //

U.filterFindElements = function( elems, selector ) {
  // make array of elems
  elems = U.makeArray( elems );
  var ffElems = [];

  for ( var i=0, len = elems.length; i < len; i++ ) {
    var elem = elems[i];
    // check that elem is an actual element
    if ( !U.isElement( elem ) ) {
      continue;
    }
    // filter & find items if we have a selector
    if ( selector ) {
      // filter siblings
      if ( matchesSelector( elem, selector ) ) {
        ffElems.push( elem );
      }
      // find children
      var childElems = elem.querySelectorAll( selector );
      // concat childElems to filterFound array
      for ( var j=0, jLen = childElems.length; j < jLen; j++ ) {
        ffElems.push( childElems[j] );
      }
    } else {
      ffElems.push( elem );
    }
  }

  return ffElems;
};

// ----- debounceMethod ----- //

U.debounceMethod = function( _class, methodName, threshold ) {
  // original method
  var method = _class.prototype[ methodName ];
  var timeoutName = methodName + 'Timeout';

  _class.prototype[ methodName ] = function() {
    var timeout = this[ timeoutName ];
    if ( timeout ) {
      clearTimeout( timeout );
    }
    var args = arguments;

    var _this = this;
    this[ timeoutName ] = setTimeout( function() {
      method.apply( _this, args );
      delete _this[ timeoutName ];
    }, threshold || 100 );
  };
};

// -----  ----- //

window.utils = U;

})( window );
