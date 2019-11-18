function _isPlaceholder(a) {
       return a != null && typeof a === 'object' && a['@@functional/placeholder'] === true;
}

/**
 * Optimized internal one-arity curry function.
 *
 * @private
 * @category Function
 * @param {Function} fn The function to curry.
 * @return {Function} The curried function.
 */
function _curry1(fn) {
  return function f1(a) {
    if (arguments.length === 0 || _isPlaceholder(a)) {
      return f1;
    } else {
      return fn.apply(this, arguments);
    }
  };
}

/**
 * Optimized internal two-arity curry function.
 *
 * @private
 * @category Function
 * @param {Function} fn The function to curry.
 * @return {Function} The curried function.
 */
function _curry2(fn) {
  return function f2(a, b) {
    switch (arguments.length) {
      case 0:
        return f2;
      case 1:
        return _isPlaceholder(a) ? f2 : _curry1(function (_b) {
          return fn(a, _b);
        });
      default:
        return _isPlaceholder(a) && _isPlaceholder(b) ? f2 : _isPlaceholder(a) ? _curry1(function (_a) {
          return fn(_a, b);
        }) : _isPlaceholder(b) ? _curry1(function (_b) {
          return fn(a, _b);
        }) : fn(a, b);
    }
  };
}

/**
 * Private `concat` function to merge two array-like objects.
 *
 * @private
 * @param {Array|Arguments} [set1=[]] An array-like object.
 * @param {Array|Arguments} [set2=[]] An array-like object.
 * @return {Array} A new, merged array.
 * @example
 *
 *      _concat([4, 5, 6], [1, 2, 3]); //=> [4, 5, 6, 1, 2, 3]
 */
function _concat(set1, set2) {
  set1 = set1 || [];
  set2 = set2 || [];
  var idx;
  var len1 = set1.length;
  var len2 = set2.length;
  var result = [];

  idx = 0;
  while (idx < len1) {
    result[result.length] = set1[idx];
    idx += 1;
  }
  idx = 0;
  while (idx < len2) {
    result[result.length] = set2[idx];
    idx += 1;
  }
  return result;
}

function _arity(n, fn) {
  /* eslint-disable no-unused-vars */
  switch (n) {
    case 0:
      return function () {
        return fn.apply(this, arguments);
      };
    case 1:
      return function (a0) {
        return fn.apply(this, arguments);
      };
    case 2:
      return function (a0, a1) {
        return fn.apply(this, arguments);
      };
    case 3:
      return function (a0, a1, a2) {
        return fn.apply(this, arguments);
      };
    case 4:
      return function (a0, a1, a2, a3) {
        return fn.apply(this, arguments);
      };
    case 5:
      return function (a0, a1, a2, a3, a4) {
        return fn.apply(this, arguments);
      };
    case 6:
      return function (a0, a1, a2, a3, a4, a5) {
        return fn.apply(this, arguments);
      };
    case 7:
      return function (a0, a1, a2, a3, a4, a5, a6) {
        return fn.apply(this, arguments);
      };
    case 8:
      return function (a0, a1, a2, a3, a4, a5, a6, a7) {
        return fn.apply(this, arguments);
      };
    case 9:
      return function (a0, a1, a2, a3, a4, a5, a6, a7, a8) {
        return fn.apply(this, arguments);
      };
    case 10:
      return function (a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
        return fn.apply(this, arguments);
      };
    default:
      throw new Error('First argument to _arity must be a non-negative integer no greater than ten');
  }
}

/**
 * Internal curryN function.
 *
 * @private
 * @category Function
 * @param {Number} length The arity of the curried function.
 * @param {Array} received An array of arguments received thus far.
 * @param {Function} fn The function to curry.
 * @return {Function} The curried function.
 */
function _curryN(length, received, fn) {
  return function () {
    var combined = [];
    var argsIdx = 0;
    var left = length;
    var combinedIdx = 0;
    while (combinedIdx < received.length || argsIdx < arguments.length) {
      var result;
      if (combinedIdx < received.length && (!_isPlaceholder(received[combinedIdx]) || argsIdx >= arguments.length)) {
        result = received[combinedIdx];
      } else {
        result = arguments[argsIdx];
        argsIdx += 1;
      }
      combined[combinedIdx] = result;
      if (!_isPlaceholder(result)) {
        left -= 1;
      }
      combinedIdx += 1;
    }
    return left <= 0 ? fn.apply(this, combined) : _arity(left, _curryN(length, combined, fn));
  };
}

/**
 * Returns a curried equivalent of the provided function, with the specified
 * arity. The curried function has two unusual capabilities. First, its
 * arguments needn't be provided one at a time. If `g` is `R.curryN(3, f)`, the
 * following are equivalent:
 *
 *   - `g(1)(2)(3)`
 *   - `g(1)(2, 3)`
 *   - `g(1, 2)(3)`
 *   - `g(1, 2, 3)`
 *
 * Secondly, the special placeholder value [`R.__`](#__) may be used to specify
 * "gaps", allowing partial application of any combination of arguments,
 * regardless of their positions. If `g` is as above and `_` is [`R.__`](#__),
 * the following are equivalent:
 *
 *   - `g(1, 2, 3)`
 *   - `g(_, 2, 3)(1)`
 *   - `g(_, _, 3)(1)(2)`
 *   - `g(_, _, 3)(1, 2)`
 *   - `g(_, 2)(1)(3)`
 *   - `g(_, 2)(1, 3)`
 *   - `g(_, 2)(_, 3)(1)`
 *
 * @func
 * @memberOf R
 * @since v0.5.0
 * @category Function
 * @sig Number -> (* -> a) -> (* -> a)
 * @param {Number} length The arity for the returned function.
 * @param {Function} fn The function to curry.
 * @return {Function} A new, curried function.
 * @see R.curry
 * @example
 *
 *      const sumArgs = (...args) => R.sum(args);
 *
 *      const curriedAddFourNumbers = R.curryN(4, sumArgs);
 *      const f = curriedAddFourNumbers(1, 2);
 *      const g = f(3);
 *      g(4); //=> 10
 */
var curryN = /*#__PURE__*/_curry2(function curryN(length, fn) {
  if (length === 1) {
    return _curry1(fn);
  }
  return _arity(length, _curryN(length, [], fn));
});

/**
 * Optimized internal three-arity curry function.
 *
 * @private
 * @category Function
 * @param {Function} fn The function to curry.
 * @return {Function} The curried function.
 */
function _curry3(fn) {
  return function f3(a, b, c) {
    switch (arguments.length) {
      case 0:
        return f3;
      case 1:
        return _isPlaceholder(a) ? f3 : _curry2(function (_b, _c) {
          return fn(a, _b, _c);
        });
      case 2:
        return _isPlaceholder(a) && _isPlaceholder(b) ? f3 : _isPlaceholder(a) ? _curry2(function (_a, _c) {
          return fn(_a, b, _c);
        }) : _isPlaceholder(b) ? _curry2(function (_b, _c) {
          return fn(a, _b, _c);
        }) : _curry1(function (_c) {
          return fn(a, b, _c);
        });
      default:
        return _isPlaceholder(a) && _isPlaceholder(b) && _isPlaceholder(c) ? f3 : _isPlaceholder(a) && _isPlaceholder(b) ? _curry2(function (_a, _b) {
          return fn(_a, _b, c);
        }) : _isPlaceholder(a) && _isPlaceholder(c) ? _curry2(function (_a, _c) {
          return fn(_a, b, _c);
        }) : _isPlaceholder(b) && _isPlaceholder(c) ? _curry2(function (_b, _c) {
          return fn(a, _b, _c);
        }) : _isPlaceholder(a) ? _curry1(function (_a) {
          return fn(_a, b, c);
        }) : _isPlaceholder(b) ? _curry1(function (_b) {
          return fn(a, _b, c);
        }) : _isPlaceholder(c) ? _curry1(function (_c) {
          return fn(a, b, _c);
        }) : fn(a, b, c);
    }
  };
}

/**
 * Tests whether or not an object is an array.
 *
 * @private
 * @param {*} val The object to test.
 * @return {Boolean} `true` if `val` is an array, `false` otherwise.
 * @example
 *
 *      _isArray([]); //=> true
 *      _isArray(null); //=> false
 *      _isArray({}); //=> false
 */
var _isArray = Array.isArray || function _isArray(val) {
  return val != null && val.length >= 0 && Object.prototype.toString.call(val) === '[object Array]';
};

function _isTransformer(obj) {
  return obj != null && typeof obj['@@transducer/step'] === 'function';
}

/**
 * Returns a function that dispatches with different strategies based on the
 * object in list position (last argument). If it is an array, executes [fn].
 * Otherwise, if it has a function with one of the given method names, it will
 * execute that function (functor case). Otherwise, if it is a transformer,
 * uses transducer [xf] to return a new transformer (transducer case).
 * Otherwise, it will default to executing [fn].
 *
 * @private
 * @param {Array} methodNames properties to check for a custom implementation
 * @param {Function} xf transducer to initialize if object is transformer
 * @param {Function} fn default ramda implementation
 * @return {Function} A function that dispatches on object in list position
 */
function _dispatchable(methodNames, xf, fn) {
  return function () {
    if (arguments.length === 0) {
      return fn();
    }
    var args = Array.prototype.slice.call(arguments, 0);
    var obj = args.pop();
    if (!_isArray(obj)) {
      var idx = 0;
      while (idx < methodNames.length) {
        if (typeof obj[methodNames[idx]] === 'function') {
          return obj[methodNames[idx]].apply(obj, args);
        }
        idx += 1;
      }
      if (_isTransformer(obj)) {
        var transducer = xf.apply(null, args);
        return transducer(obj);
      }
    }
    return fn.apply(this, arguments);
  };
}

var _xfBase = {
  init: function () {
    return this.xf['@@transducer/init']();
  },
  result: function (result) {
    return this.xf['@@transducer/result'](result);
  }
};

function _map(fn, functor) {
  var idx = 0;
  var len = functor.length;
  var result = Array(len);
  while (idx < len) {
    result[idx] = fn(functor[idx]);
    idx += 1;
  }
  return result;
}

function _isString(x) {
  return Object.prototype.toString.call(x) === '[object String]';
}

/**
 * Tests whether or not an object is similar to an array.
 *
 * @private
 * @category Type
 * @category List
 * @sig * -> Boolean
 * @param {*} x The object to test.
 * @return {Boolean} `true` if `x` has a numeric length property and extreme indices defined; `false` otherwise.
 * @example
 *
 *      _isArrayLike([]); //=> true
 *      _isArrayLike(true); //=> false
 *      _isArrayLike({}); //=> false
 *      _isArrayLike({length: 10}); //=> false
 *      _isArrayLike({0: 'zero', 9: 'nine', length: 10}); //=> true
 */
var _isArrayLike = /*#__PURE__*/_curry1(function isArrayLike(x) {
  if (_isArray(x)) {
    return true;
  }
  if (!x) {
    return false;
  }
  if (typeof x !== 'object') {
    return false;
  }
  if (_isString(x)) {
    return false;
  }
  if (x.nodeType === 1) {
    return !!x.length;
  }
  if (x.length === 0) {
    return true;
  }
  if (x.length > 0) {
    return x.hasOwnProperty(0) && x.hasOwnProperty(x.length - 1);
  }
  return false;
});

var XWrap = /*#__PURE__*/function () {
  function XWrap(fn) {
    this.f = fn;
  }
  XWrap.prototype['@@transducer/init'] = function () {
    throw new Error('init not implemented on XWrap');
  };
  XWrap.prototype['@@transducer/result'] = function (acc) {
    return acc;
  };
  XWrap.prototype['@@transducer/step'] = function (acc, x) {
    return this.f(acc, x);
  };

  return XWrap;
}();

function _xwrap(fn) {
  return new XWrap(fn);
}

/**
 * Creates a function that is bound to a context.
 * Note: `R.bind` does not provide the additional argument-binding capabilities of
 * [Function.prototype.bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind).
 *
 * @func
 * @memberOf R
 * @since v0.6.0
 * @category Function
 * @category Object
 * @sig (* -> *) -> {*} -> (* -> *)
 * @param {Function} fn The function to bind to context
 * @param {Object} thisObj The context to bind `fn` to
 * @return {Function} A function that will execute in the context of `thisObj`.
 * @see R.partial
 * @example
 *
 *      const log = R.bind(console.log, console);
 *      R.pipe(R.assoc('a', 2), R.tap(log), R.assoc('a', 3))({a: 1}); //=> {a: 3}
 *      // logs {a: 2}
 * @symb R.bind(f, o)(a, b) = f.call(o, a, b)
 */
var bind = /*#__PURE__*/_curry2(function bind(fn, thisObj) {
  return _arity(fn.length, function () {
    return fn.apply(thisObj, arguments);
  });
});

function _arrayReduce(xf, acc, list) {
  var idx = 0;
  var len = list.length;
  while (idx < len) {
    acc = xf['@@transducer/step'](acc, list[idx]);
    if (acc && acc['@@transducer/reduced']) {
      acc = acc['@@transducer/value'];
      break;
    }
    idx += 1;
  }
  return xf['@@transducer/result'](acc);
}

function _iterableReduce(xf, acc, iter) {
  var step = iter.next();
  while (!step.done) {
    acc = xf['@@transducer/step'](acc, step.value);
    if (acc && acc['@@transducer/reduced']) {
      acc = acc['@@transducer/value'];
      break;
    }
    step = iter.next();
  }
  return xf['@@transducer/result'](acc);
}

function _methodReduce(xf, acc, obj, methodName) {
  return xf['@@transducer/result'](obj[methodName](bind(xf['@@transducer/step'], xf), acc));
}

var symIterator = typeof Symbol !== 'undefined' ? Symbol.iterator : '@@iterator';

function _reduce(fn, acc, list) {
  if (typeof fn === 'function') {
    fn = _xwrap(fn);
  }
  if (_isArrayLike(list)) {
    return _arrayReduce(fn, acc, list);
  }
  if (typeof list['fantasy-land/reduce'] === 'function') {
    return _methodReduce(fn, acc, list, 'fantasy-land/reduce');
  }
  if (list[symIterator] != null) {
    return _iterableReduce(fn, acc, list[symIterator]());
  }
  if (typeof list.next === 'function') {
    return _iterableReduce(fn, acc, list);
  }
  if (typeof list.reduce === 'function') {
    return _methodReduce(fn, acc, list, 'reduce');
  }

  throw new TypeError('reduce: list must be array or iterable');
}

var XMap = /*#__PURE__*/function () {
  function XMap(f, xf) {
    this.xf = xf;
    this.f = f;
  }
  XMap.prototype['@@transducer/init'] = _xfBase.init;
  XMap.prototype['@@transducer/result'] = _xfBase.result;
  XMap.prototype['@@transducer/step'] = function (result, input) {
    return this.xf['@@transducer/step'](result, this.f(input));
  };

  return XMap;
}();

var _xmap = /*#__PURE__*/_curry2(function _xmap(f, xf) {
  return new XMap(f, xf);
});

function _has(prop, obj) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

var toString = Object.prototype.toString;
var _isArguments = /*#__PURE__*/function () {
  return toString.call(arguments) === '[object Arguments]' ? function _isArguments(x) {
    return toString.call(x) === '[object Arguments]';
  } : function _isArguments(x) {
    return _has('callee', x);
  };
}();

// cover IE < 9 keys issues
var hasEnumBug = ! /*#__PURE__*/{ toString: null }.propertyIsEnumerable('toString');
var nonEnumerableProps = ['constructor', 'valueOf', 'isPrototypeOf', 'toString', 'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];
// Safari bug
var hasArgsEnumBug = /*#__PURE__*/function () {

  return arguments.propertyIsEnumerable('length');
}();

var contains = function contains(list, item) {
  var idx = 0;
  while (idx < list.length) {
    if (list[idx] === item) {
      return true;
    }
    idx += 1;
  }
  return false;
};

/**
 * Returns a list containing the names of all the enumerable own properties of
 * the supplied object.
 * Note that the order of the output array is not guaranteed to be consistent
 * across different JS platforms.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Object
 * @sig {k: v} -> [k]
 * @param {Object} obj The object to extract properties from
 * @return {Array} An array of the object's own properties.
 * @see R.keysIn, R.values
 * @example
 *
 *      R.keys({a: 1, b: 2, c: 3}); //=> ['a', 'b', 'c']
 */
var keys = typeof Object.keys === 'function' && !hasArgsEnumBug ? /*#__PURE__*/_curry1(function keys(obj) {
  return Object(obj) !== obj ? [] : Object.keys(obj);
}) : /*#__PURE__*/_curry1(function keys(obj) {
  if (Object(obj) !== obj) {
    return [];
  }
  var prop, nIdx;
  var ks = [];
  var checkArgsLength = hasArgsEnumBug && _isArguments(obj);
  for (prop in obj) {
    if (_has(prop, obj) && (!checkArgsLength || prop !== 'length')) {
      ks[ks.length] = prop;
    }
  }
  if (hasEnumBug) {
    nIdx = nonEnumerableProps.length - 1;
    while (nIdx >= 0) {
      prop = nonEnumerableProps[nIdx];
      if (_has(prop, obj) && !contains(ks, prop)) {
        ks[ks.length] = prop;
      }
      nIdx -= 1;
    }
  }
  return ks;
});

/**
 * Takes a function and
 * a [functor](https://github.com/fantasyland/fantasy-land#functor),
 * applies the function to each of the functor's values, and returns
 * a functor of the same shape.
 *
 * Ramda provides suitable `map` implementations for `Array` and `Object`,
 * so this function may be applied to `[1, 2, 3]` or `{x: 1, y: 2, z: 3}`.
 *
 * Dispatches to the `map` method of the second argument, if present.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * Also treats functions as functors and will compose them together.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig Functor f => (a -> b) -> f a -> f b
 * @param {Function} fn The function to be called on every element of the input `list`.
 * @param {Array} list The list to be iterated over.
 * @return {Array} The new list.
 * @see R.transduce, R.addIndex
 * @example
 *
 *      const double = x => x * 2;
 *
 *      R.map(double, [1, 2, 3]); //=> [2, 4, 6]
 *
 *      R.map(double, {x: 1, y: 2, z: 3}); //=> {x: 2, y: 4, z: 6}
 * @symb R.map(f, [a, b]) = [f(a), f(b)]
 * @symb R.map(f, { x: a, y: b }) = { x: f(a), y: f(b) }
 * @symb R.map(f, functor_o) = functor_o.map(f)
 */
var map = /*#__PURE__*/_curry2( /*#__PURE__*/_dispatchable(['fantasy-land/map', 'map'], _xmap, function map(fn, functor) {
  switch (Object.prototype.toString.call(functor)) {
    case '[object Function]':
      return curryN(functor.length, function () {
        return fn.call(this, functor.apply(this, arguments));
      });
    case '[object Object]':
      return _reduce(function (acc, key) {
        acc[key] = fn(functor[key]);
        return acc;
      }, {}, keys(functor));
    default:
      return _map(fn, functor);
  }
}));

/**
 * Returns a single item by iterating through the list, successively calling
 * the iterator function and passing it an accumulator value and the current
 * value from the array, and then passing the result to the next call.
 *
 * The iterator function receives two values: *(acc, value)*. It may use
 * [`R.reduced`](#reduced) to shortcut the iteration.
 *
 * The arguments' order of [`reduceRight`](#reduceRight)'s iterator function
 * is *(value, acc)*.
 *
 * Note: `R.reduce` does not skip deleted or unassigned indices (sparse
 * arrays), unlike the native `Array.prototype.reduce` method. For more details
 * on this behavior, see:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce#Description
 *
 * Dispatches to the `reduce` method of the third argument, if present. When
 * doing so, it is up to the user to handle the [`R.reduced`](#reduced)
 * shortcuting, as this is not implemented by `reduce`.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig ((a, b) -> a) -> a -> [b] -> a
 * @param {Function} fn The iterator function. Receives two values, the accumulator and the
 *        current element from the array.
 * @param {*} acc The accumulator value.
 * @param {Array} list The list to iterate over.
 * @return {*} The final, accumulated value.
 * @see R.reduced, R.addIndex, R.reduceRight
 * @example
 *
 *      R.reduce(R.subtract, 0, [1, 2, 3, 4]) // => ((((0 - 1) - 2) - 3) - 4) = -10
 *      //          -               -10
 *      //         / \              / \
 *      //        -   4           -6   4
 *      //       / \              / \
 *      //      -   3   ==>     -3   3
 *      //     / \              / \
 *      //    -   2           -1   2
 *      //   / \              / \
 *      //  0   1            0   1
 *
 * @symb R.reduce(f, a, [b, c, d]) = f(f(f(a, b), c), d)
 */
var reduce = /*#__PURE__*/_curry3(_reduce);

/**
 * Returns a function that always returns the given value. Note that for
 * non-primitives the value returned is a reference to the original value.
 *
 * This function is known as `const`, `constant`, or `K` (for K combinator) in
 * other languages and libraries.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Function
 * @sig a -> (* -> a)
 * @param {*} val The value to wrap in a function
 * @return {Function} A Function :: * -> val.
 * @example
 *
 *      const t = R.always('Tee');
 *      t(); //=> 'Tee'
 */
var always = /*#__PURE__*/_curry1(function always(val) {
  return function () {
    return val;
  };
});

/**
 * Returns `true` if both arguments are `true`; `false` otherwise.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Logic
 * @sig a -> b -> a | b
 * @param {Any} a
 * @param {Any} b
 * @return {Any} the first argument if it is falsy, otherwise the second argument.
 * @see R.both
 * @example
 *
 *      R.and(true, true); //=> true
 *      R.and(true, false); //=> false
 *      R.and(false, true); //=> false
 *      R.and(false, false); //=> false
 */
var and = /*#__PURE__*/_curry2(function and(a, b) {
  return a && b;
});

/**
 * ap applies a list of functions to a list of values.
 *
 * Dispatches to the `ap` method of the second argument, if present. Also
 * treats curried functions as applicatives.
 *
 * @func
 * @memberOf R
 * @since v0.3.0
 * @category Function
 * @sig [a -> b] -> [a] -> [b]
 * @sig Apply f => f (a -> b) -> f a -> f b
 * @sig (r -> a -> b) -> (r -> a) -> (r -> b)
 * @param {*} applyF
 * @param {*} applyX
 * @return {*}
 * @example
 *
 *      R.ap([R.multiply(2), R.add(3)], [1,2,3]); //=> [2, 4, 6, 4, 5, 6]
 *      R.ap([R.concat('tasty '), R.toUpper], ['pizza', 'salad']); //=> ["tasty pizza", "tasty salad", "PIZZA", "SALAD"]
 *
 *      // R.ap can also be used as S combinator
 *      // when only two functions are passed
 *      R.ap(R.concat, R.toUpper)('Ramda') //=> 'RamdaRAMDA'
 * @symb R.ap([f, g], [a, b]) = [f(a), f(b), g(a), g(b)]
 */
var ap = /*#__PURE__*/_curry2(function ap(applyF, applyX) {
  return typeof applyX['fantasy-land/ap'] === 'function' ? applyX['fantasy-land/ap'](applyF) : typeof applyF.ap === 'function' ? applyF.ap(applyX) : typeof applyF === 'function' ? function (x) {
    return applyF(x)(applyX(x));
  } : _reduce(function (acc, f) {
    return _concat(acc, map(f, applyX));
  }, [], applyF);
});

/**
 * Checks if the input value is `null` or `undefined`.
 *
 * @func
 * @memberOf R
 * @since v0.9.0
 * @category Type
 * @sig * -> Boolean
 * @param {*} x The value to test.
 * @return {Boolean} `true` if `x` is `undefined` or `null`, otherwise `false`.
 * @example
 *
 *      R.isNil(null); //=> true
 *      R.isNil(undefined); //=> true
 *      R.isNil(0); //=> false
 *      R.isNil([]); //=> false
 */
var isNil = /*#__PURE__*/_curry1(function isNil(x) {
  return x == null;
});

function _isFunction(x) {
  return Object.prototype.toString.call(x) === '[object Function]';
}

/**
 * "lifts" a function to be the specified arity, so that it may "map over" that
 * many lists, Functions or other objects that satisfy the [FantasyLand Apply spec](https://github.com/fantasyland/fantasy-land#apply).
 *
 * @func
 * @memberOf R
 * @since v0.7.0
 * @category Function
 * @sig Number -> (*... -> *) -> ([*]... -> [*])
 * @param {Function} fn The function to lift into higher context
 * @return {Function} The lifted function.
 * @see R.lift, R.ap
 * @example
 *
 *      const madd3 = R.liftN(3, (...args) => R.sum(args));
 *      madd3([1,2,3], [1,2,3], [1]); //=> [3, 4, 5, 4, 5, 6, 5, 6, 7]
 */
var liftN = /*#__PURE__*/_curry2(function liftN(arity, fn) {
  var lifted = curryN(arity, fn);
  return curryN(arity, function () {
    return _reduce(ap, map(lifted, arguments[0]), Array.prototype.slice.call(arguments, 1));
  });
});

/**
 * "lifts" a function of arity > 1 so that it may "map over" a list, Function or other
 * object that satisfies the [FantasyLand Apply spec](https://github.com/fantasyland/fantasy-land#apply).
 *
 * @func
 * @memberOf R
 * @since v0.7.0
 * @category Function
 * @sig (*... -> *) -> ([*]... -> [*])
 * @param {Function} fn The function to lift into higher context
 * @return {Function} The lifted function.
 * @see R.liftN
 * @example
 *
 *      const madd3 = R.lift((a, b, c) => a + b + c);
 *
 *      madd3([1,2,3], [1,2,3], [1]); //=> [3, 4, 5, 4, 5, 6, 5, 6, 7]
 *
 *      const madd5 = R.lift((a, b, c, d, e) => a + b + c + d + e);
 *
 *      madd5([1,2], [3], [4, 5], [6], [7, 8]); //=> [21, 22, 22, 23, 22, 23, 23, 24]
 */
var lift = /*#__PURE__*/_curry1(function lift(fn) {
  return liftN(fn.length, fn);
});

/**
 * A function which calls the two provided functions and returns the `&&`
 * of the results.
 * It returns the result of the first function if it is false-y and the result
 * of the second function otherwise. Note that this is short-circuited,
 * meaning that the second function will not be invoked if the first returns a
 * false-y value.
 *
 * In addition to functions, `R.both` also accepts any fantasy-land compatible
 * applicative functor.
 *
 * @func
 * @memberOf R
 * @since v0.12.0
 * @category Logic
 * @sig (*... -> Boolean) -> (*... -> Boolean) -> (*... -> Boolean)
 * @param {Function} f A predicate
 * @param {Function} g Another predicate
 * @return {Function} a function that applies its arguments to `f` and `g` and `&&`s their outputs together.
 * @see R.and
 * @example
 *
 *      const gt10 = R.gt(R.__, 10)
 *      const lt20 = R.lt(R.__, 20)
 *      const f = R.both(gt10, lt20);
 *      f(15); //=> true
 *      f(30); //=> false
 *
 *      R.both(Maybe.Just(false), Maybe.Just(55)); // => Maybe.Just(false)
 *      R.both([false, false, 'a'], [11]); //=> [false, false, 11]
 */
var both = /*#__PURE__*/_curry2(function both(f, g) {
  return _isFunction(f) ? function _both() {
    return f.apply(this, arguments) && g.apply(this, arguments);
  } : lift(and)(f, g);
});

/**
 * Gives a single-word string description of the (native) type of a value,
 * returning such answers as 'Object', 'Number', 'Array', or 'Null'. Does not
 * attempt to distinguish user Object types any further, reporting them all as
 * 'Object'.
 *
 * @func
 * @memberOf R
 * @since v0.8.0
 * @category Type
 * @sig (* -> {*}) -> String
 * @param {*} val The value to test
 * @return {String}
 * @example
 *
 *      R.type({}); //=> "Object"
 *      R.type(1); //=> "Number"
 *      R.type(false); //=> "Boolean"
 *      R.type('s'); //=> "String"
 *      R.type(null); //=> "Null"
 *      R.type([]); //=> "Array"
 *      R.type(/[A-z]/); //=> "RegExp"
 *      R.type(() => {}); //=> "Function"
 *      R.type(undefined); //=> "Undefined"
 */
var type = /*#__PURE__*/_curry1(function type(val) {
  return val === null ? 'Null' : val === undefined ? 'Undefined' : Object.prototype.toString.call(val).slice(8, -1);
});

/**
 * A function that returns the `!` of its argument. It will return `true` when
 * passed false-y value, and `false` when passed a truth-y one.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Logic
 * @sig * -> Boolean
 * @param {*} a any value
 * @return {Boolean} the logical inverse of passed argument.
 * @see R.complement
 * @example
 *
 *      R.not(true); //=> false
 *      R.not(false); //=> true
 *      R.not(0); //=> true
 *      R.not(1); //=> false
 */
var not = /*#__PURE__*/_curry1(function not(a) {
  return !a;
});

/**
 * Takes a function `f` and returns a function `g` such that if called with the same arguments
 * when `f` returns a "truthy" value, `g` returns `false` and when `f` returns a "falsy" value `g` returns `true`.
 *
 * `R.complement` may be applied to any functor
 *
 * @func
 * @memberOf R
 * @since v0.12.0
 * @category Logic
 * @sig (*... -> *) -> (*... -> Boolean)
 * @param {Function} f
 * @return {Function}
 * @see R.not
 * @example
 *
 *      const isNotNil = R.complement(R.isNil);
 *      isNil(null); //=> true
 *      isNotNil(null); //=> false
 *      isNil(7); //=> false
 *      isNotNil(7); //=> true
 */
var complement = /*#__PURE__*/lift(not);

function _pipe(f, g) {
  return function () {
    return g.call(this, f.apply(this, arguments));
  };
}

/**
 * This checks whether a function has a [methodname] function. If it isn't an
 * array it will execute that function otherwise it will default to the ramda
 * implementation.
 *
 * @private
 * @param {Function} fn ramda implemtation
 * @param {String} methodname property to check for a custom implementation
 * @return {Object} Whatever the return value of the method is.
 */
function _checkForMethod(methodname, fn) {
  return function () {
    var length = arguments.length;
    if (length === 0) {
      return fn();
    }
    var obj = arguments[length - 1];
    return _isArray(obj) || typeof obj[methodname] !== 'function' ? fn.apply(this, arguments) : obj[methodname].apply(obj, Array.prototype.slice.call(arguments, 0, length - 1));
  };
}

/**
 * Returns the elements of the given list or string (or object with a `slice`
 * method) from `fromIndex` (inclusive) to `toIndex` (exclusive).
 *
 * Dispatches to the `slice` method of the third argument, if present.
 *
 * @func
 * @memberOf R
 * @since v0.1.4
 * @category List
 * @sig Number -> Number -> [a] -> [a]
 * @sig Number -> Number -> String -> String
 * @param {Number} fromIndex The start index (inclusive).
 * @param {Number} toIndex The end index (exclusive).
 * @param {*} list
 * @return {*}
 * @example
 *
 *      R.slice(1, 3, ['a', 'b', 'c', 'd']);        //=> ['b', 'c']
 *      R.slice(1, Infinity, ['a', 'b', 'c', 'd']); //=> ['b', 'c', 'd']
 *      R.slice(0, -1, ['a', 'b', 'c', 'd']);       //=> ['a', 'b', 'c']
 *      R.slice(-3, -1, ['a', 'b', 'c', 'd']);      //=> ['b', 'c']
 *      R.slice(0, 3, 'ramda');                     //=> 'ram'
 */
var slice = /*#__PURE__*/_curry3( /*#__PURE__*/_checkForMethod('slice', function slice(fromIndex, toIndex, list) {
  return Array.prototype.slice.call(list, fromIndex, toIndex);
}));

/**
 * Returns all but the first element of the given list or string (or object
 * with a `tail` method).
 *
 * Dispatches to the `slice` method of the first argument, if present.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig [a] -> [a]
 * @sig String -> String
 * @param {*} list
 * @return {*}
 * @see R.head, R.init, R.last
 * @example
 *
 *      R.tail([1, 2, 3]);  //=> [2, 3]
 *      R.tail([1, 2]);     //=> [2]
 *      R.tail([1]);        //=> []
 *      R.tail([]);         //=> []
 *
 *      R.tail('abc');  //=> 'bc'
 *      R.tail('ab');   //=> 'b'
 *      R.tail('a');    //=> ''
 *      R.tail('');     //=> ''
 */
var tail = /*#__PURE__*/_curry1( /*#__PURE__*/_checkForMethod('tail', /*#__PURE__*/slice(1, Infinity)));

/**
 * Performs left-to-right function composition. The leftmost function may have
 * any arity; the remaining functions must be unary.
 *
 * In some libraries this function is named `sequence`.
 *
 * **Note:** The result of pipe is not automatically curried.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Function
 * @sig (((a, b, ..., n) -> o), (o -> p), ..., (x -> y), (y -> z)) -> ((a, b, ..., n) -> z)
 * @param {...Function} functions
 * @return {Function}
 * @see R.compose
 * @example
 *
 *      const f = R.pipe(Math.pow, R.negate, R.inc);
 *
 *      f(3, 4); // -(3^4) + 1
 * @symb R.pipe(f, g, h)(a, b) = h(g(f(a, b)))
 */
function pipe() {
  if (arguments.length === 0) {
    throw new Error('pipe requires at least one argument');
  }
  return _arity(arguments[0].length, reduce(_pipe, arguments[0], tail(arguments)));
}

/**
 * Returns a new list or string with the elements or characters in reverse
 * order.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig [a] -> [a]
 * @sig String -> String
 * @param {Array|String} list
 * @return {Array|String}
 * @example
 *
 *      R.reverse([1, 2, 3]);  //=> [3, 2, 1]
 *      R.reverse([1, 2]);     //=> [2, 1]
 *      R.reverse([1]);        //=> [1]
 *      R.reverse([]);         //=> []
 *
 *      R.reverse('abc');      //=> 'cba'
 *      R.reverse('ab');       //=> 'ba'
 *      R.reverse('a');        //=> 'a'
 *      R.reverse('');         //=> ''
 */
var reverse = /*#__PURE__*/_curry1(function reverse(list) {
  return _isString(list) ? list.split('').reverse().join('') : Array.prototype.slice.call(list, 0).reverse();
});

/**
 * Performs right-to-left function composition. The rightmost function may have
 * any arity; the remaining functions must be unary.
 *
 * **Note:** The result of compose is not automatically curried.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Function
 * @sig ((y -> z), (x -> y), ..., (o -> p), ((a, b, ..., n) -> o)) -> ((a, b, ..., n) -> z)
 * @param {...Function} ...functions The functions to compose
 * @return {Function}
 * @see R.pipe
 * @example
 *
 *      const classyGreeting = (firstName, lastName) => "The name's " + lastName + ", " + firstName + " " + lastName
 *      const yellGreeting = R.compose(R.toUpper, classyGreeting);
 *      yellGreeting('James', 'Bond'); //=> "THE NAME'S BOND, JAMES BOND"
 *
 *      R.compose(Math.abs, R.add(1), R.multiply(2))(-4) //=> 7
 *
 * @symb R.compose(f, g, h)(a, b) = f(g(h(a, b)))
 */
function compose() {
  if (arguments.length === 0) {
    throw new Error('compose requires at least one argument');
  }
  return pipe.apply(this, reverse(arguments));
}

/**
 * Returns the nth element of the given list or string. If n is negative the
 * element at index length + n is returned.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig Number -> [a] -> a | Undefined
 * @sig Number -> String -> String
 * @param {Number} offset
 * @param {*} list
 * @return {*}
 * @example
 *
 *      const list = ['foo', 'bar', 'baz', 'quux'];
 *      R.nth(1, list); //=> 'bar'
 *      R.nth(-1, list); //=> 'quux'
 *      R.nth(-99, list); //=> undefined
 *
 *      R.nth(2, 'abc'); //=> 'c'
 *      R.nth(3, 'abc'); //=> ''
 * @symb R.nth(-1, [a, b, c]) = c
 * @symb R.nth(0, [a, b, c]) = a
 * @symb R.nth(1, [a, b, c]) = b
 */
var nth = /*#__PURE__*/_curry2(function nth(offset, list) {
  var idx = offset < 0 ? list.length + offset : offset;
  return _isString(list) ? list.charAt(idx) : list[idx];
});

function _identity(x) {
  return x;
}

/**
 * A function that does nothing but return the parameter supplied to it. Good
 * as a default or placeholder function.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Function
 * @sig a -> a
 * @param {*} x The value to return.
 * @return {*} The input value, `x`.
 * @example
 *
 *      R.identity(1); //=> 1
 *
 *      const obj = {};
 *      R.identity(obj) === obj; //=> true
 * @symb R.identity(a) = a
 */
var identity = /*#__PURE__*/_curry1(_identity);

function _arrayFromIterator(iter) {
  var list = [];
  var next;
  while (!(next = iter.next()).done) {
    list.push(next.value);
  }
  return list;
}

function _includesWith(pred, x, list) {
  var idx = 0;
  var len = list.length;

  while (idx < len) {
    if (pred(x, list[idx])) {
      return true;
    }
    idx += 1;
  }
  return false;
}

function _functionName(f) {
  // String(x => x) evaluates to "x => x", so the pattern may not match.
  var match = String(f).match(/^function (\w*)/);
  return match == null ? '' : match[1];
}

// Based on https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
function _objectIs(a, b) {
  // SameValue algorithm
  if (a === b) {
    // Steps 1-5, 7-10
    // Steps 6.b-6.e: +0 != -0
    return a !== 0 || 1 / a === 1 / b;
  } else {
    // Step 6.a: NaN == NaN
    return a !== a && b !== b;
  }
}

var _objectIs$1 = typeof Object.is === 'function' ? Object.is : _objectIs;

/**
 * private _uniqContentEquals function.
 * That function is checking equality of 2 iterator contents with 2 assumptions
 * - iterators lengths are the same
 * - iterators values are unique
 *
 * false-positive result will be returned for comparision of, e.g.
 * - [1,2,3] and [1,2,3,4]
 * - [1,1,1] and [1,2,3]
 * */

function _uniqContentEquals(aIterator, bIterator, stackA, stackB) {
  var a = _arrayFromIterator(aIterator);
  var b = _arrayFromIterator(bIterator);

  function eq(_a, _b) {
    return _equals(_a, _b, stackA.slice(), stackB.slice());
  }

  // if *a* array contains any element that is not included in *b*
  return !_includesWith(function (b, aItem) {
    return !_includesWith(eq, aItem, b);
  }, b, a);
}

function _equals(a, b, stackA, stackB) {
  if (_objectIs$1(a, b)) {
    return true;
  }

  var typeA = type(a);

  if (typeA !== type(b)) {
    return false;
  }

  if (a == null || b == null) {
    return false;
  }

  if (typeof a['fantasy-land/equals'] === 'function' || typeof b['fantasy-land/equals'] === 'function') {
    return typeof a['fantasy-land/equals'] === 'function' && a['fantasy-land/equals'](b) && typeof b['fantasy-land/equals'] === 'function' && b['fantasy-land/equals'](a);
  }

  if (typeof a.equals === 'function' || typeof b.equals === 'function') {
    return typeof a.equals === 'function' && a.equals(b) && typeof b.equals === 'function' && b.equals(a);
  }

  switch (typeA) {
    case 'Arguments':
    case 'Array':
    case 'Object':
      if (typeof a.constructor === 'function' && _functionName(a.constructor) === 'Promise') {
        return a === b;
      }
      break;
    case 'Boolean':
    case 'Number':
    case 'String':
      if (!(typeof a === typeof b && _objectIs$1(a.valueOf(), b.valueOf()))) {
        return false;
      }
      break;
    case 'Date':
      if (!_objectIs$1(a.valueOf(), b.valueOf())) {
        return false;
      }
      break;
    case 'Error':
      return a.name === b.name && a.message === b.message;
    case 'RegExp':
      if (!(a.source === b.source && a.global === b.global && a.ignoreCase === b.ignoreCase && a.multiline === b.multiline && a.sticky === b.sticky && a.unicode === b.unicode)) {
        return false;
      }
      break;
  }

  var idx = stackA.length - 1;
  while (idx >= 0) {
    if (stackA[idx] === a) {
      return stackB[idx] === b;
    }
    idx -= 1;
  }

  switch (typeA) {
    case 'Map':
      if (a.size !== b.size) {
        return false;
      }

      return _uniqContentEquals(a.entries(), b.entries(), stackA.concat([a]), stackB.concat([b]));
    case 'Set':
      if (a.size !== b.size) {
        return false;
      }

      return _uniqContentEquals(a.values(), b.values(), stackA.concat([a]), stackB.concat([b]));
    case 'Arguments':
    case 'Array':
    case 'Object':
    case 'Boolean':
    case 'Number':
    case 'String':
    case 'Date':
    case 'Error':
    case 'RegExp':
    case 'Int8Array':
    case 'Uint8Array':
    case 'Uint8ClampedArray':
    case 'Int16Array':
    case 'Uint16Array':
    case 'Int32Array':
    case 'Uint32Array':
    case 'Float32Array':
    case 'Float64Array':
    case 'ArrayBuffer':
      break;
    default:
      // Values of other types are only equal if identical.
      return false;
  }

  var keysA = keys(a);
  if (keysA.length !== keys(b).length) {
    return false;
  }

  var extendedStackA = stackA.concat([a]);
  var extendedStackB = stackB.concat([b]);

  idx = keysA.length - 1;
  while (idx >= 0) {
    var key = keysA[idx];
    if (!(_has(key, b) && _equals(b[key], a[key], extendedStackA, extendedStackB))) {
      return false;
    }
    idx -= 1;
  }
  return true;
}

/**
 * Returns `true` if its arguments are equivalent, `false` otherwise. Handles
 * cyclical data structures.
 *
 * Dispatches symmetrically to the `equals` methods of both arguments, if
 * present.
 *
 * @func
 * @memberOf R
 * @since v0.15.0
 * @category Relation
 * @sig a -> b -> Boolean
 * @param {*} a
 * @param {*} b
 * @return {Boolean}
 * @example
 *
 *      R.equals(1, 1); //=> true
 *      R.equals(1, '1'); //=> false
 *      R.equals([1, 2, 3], [1, 2, 3]); //=> true
 *
 *      const a = {}; a.v = a;
 *      const b = {}; b.v = b;
 *      R.equals(a, b); //=> true
 */
var equals = /*#__PURE__*/_curry2(function equals(a, b) {
  return _equals(a, b, [], []);
});

function _isObject(x) {
  return Object.prototype.toString.call(x) === '[object Object]';
}

/**
 * Returns the last element of the given list or string.
 *
 * @func
 * @memberOf R
 * @since v0.1.4
 * @category List
 * @sig [a] -> a | Undefined
 * @sig String -> String
 * @param {*} list
 * @return {*}
 * @see R.init, R.head, R.tail
 * @example
 *
 *      R.last(['fi', 'fo', 'fum']); //=> 'fum'
 *      R.last([]); //=> undefined
 *
 *      R.last('abc'); //=> 'c'
 *      R.last(''); //=> ''
 */
var last = /*#__PURE__*/nth(-1);

/**
 * Returns the empty value of its argument's type. Ramda defines the empty
 * value of Array (`[]`), Object (`{}`), String (`''`), and Arguments. Other
 * types are supported if they define `<Type>.empty`,
 * `<Type>.prototype.empty` or implement the
 * [FantasyLand Monoid spec](https://github.com/fantasyland/fantasy-land#monoid).
 *
 * Dispatches to the `empty` method of the first argument, if present.
 *
 * @func
 * @memberOf R
 * @since v0.3.0
 * @category Function
 * @sig a -> a
 * @param {*} x
 * @return {*}
 * @example
 *
 *      R.empty(Just(42));      //=> Nothing()
 *      R.empty([1, 2, 3]);     //=> []
 *      R.empty('unicorns');    //=> ''
 *      R.empty({x: 1, y: 2});  //=> {}
 */
var empty = /*#__PURE__*/_curry1(function empty(x) {
  return x != null && typeof x['fantasy-land/empty'] === 'function' ? x['fantasy-land/empty']() : x != null && x.constructor != null && typeof x.constructor['fantasy-land/empty'] === 'function' ? x.constructor['fantasy-land/empty']() : x != null && typeof x.empty === 'function' ? x.empty() : x != null && x.constructor != null && typeof x.constructor.empty === 'function' ? x.constructor.empty() : _isArray(x) ? [] : _isString(x) ? '' : _isObject(x) ? {} : _isArguments(x) ? function () {
    return arguments;
  }() : void 0 // else
  ;
});

/**
 * Iterate over an input `list`, calling a provided function `fn` for each
 * element in the list.
 *
 * `fn` receives one argument: *(value)*.
 *
 * Note: `R.forEach` does not skip deleted or unassigned indices (sparse
 * arrays), unlike the native `Array.prototype.forEach` method. For more
 * details on this behavior, see:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach#Description
 *
 * Also note that, unlike `Array.prototype.forEach`, Ramda's `forEach` returns
 * the original array. In some libraries this function is named `each`.
 *
 * Dispatches to the `forEach` method of the second argument, if present.
 *
 * @func
 * @memberOf R
 * @since v0.1.1
 * @category List
 * @sig (a -> *) -> [a] -> [a]
 * @param {Function} fn The function to invoke. Receives one argument, `value`.
 * @param {Array} list The list to iterate over.
 * @return {Array} The original list.
 * @see R.addIndex
 * @example
 *
 *      const printXPlusFive = x => console.log(x + 5);
 *      R.forEach(printXPlusFive, [1, 2, 3]); //=> [1, 2, 3]
 *      // logs 6
 *      // logs 7
 *      // logs 8
 * @symb R.forEach(f, [a, b, c]) = [a, b, c]
 */
var forEach = /*#__PURE__*/_curry2( /*#__PURE__*/_checkForMethod('forEach', function forEach(fn, list) {
  var len = list.length;
  var idx = 0;
  while (idx < len) {
    fn(list[idx]);
    idx += 1;
  }
  return list;
}));

/**
 * Returns `true` if the given value is its type's empty value; `false`
 * otherwise.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Logic
 * @sig a -> Boolean
 * @param {*} x
 * @return {Boolean}
 * @see R.empty
 * @example
 *
 *      R.isEmpty([1, 2, 3]);   //=> false
 *      R.isEmpty([]);          //=> true
 *      R.isEmpty('');          //=> true
 *      R.isEmpty(null);        //=> false
 *      R.isEmpty({});          //=> true
 *      R.isEmpty({length: 0}); //=> false
 */
var isEmpty = /*#__PURE__*/_curry1(function isEmpty(x) {
  return x != null && equals(x, empty(x));
});

function _isNumber(x) {
  return Object.prototype.toString.call(x) === '[object Number]';
}

/**
 * Returns the number of elements in the array by returning `list.length`.
 *
 * @func
 * @memberOf R
 * @since v0.3.0
 * @category List
 * @sig [a] -> Number
 * @param {Array} list The array to inspect.
 * @return {Number} The length of the array.
 * @example
 *
 *      R.length([]); //=> 0
 *      R.length([1, 2, 3]); //=> 3
 */
var length = /*#__PURE__*/_curry1(function length(list) {
  return list != null && _isNumber(list.length) ? list.length : NaN;
});

/**
 * Replace a substring or regex match in a string with a replacement.
 *
 * The first two parameters correspond to the parameters of the
 * `String.prototype.replace()` function, so the second parameter can also be a
 * function.
 *
 * @func
 * @memberOf R
 * @since v0.7.0
 * @category String
 * @sig RegExp|String -> String -> String -> String
 * @param {RegExp|String} pattern A regular expression or a substring to match.
 * @param {String} replacement The string to replace the matches with.
 * @param {String} str The String to do the search and replacement in.
 * @return {String} The result.
 * @example
 *
 *      R.replace('foo', 'bar', 'foo foo foo'); //=> 'bar foo foo'
 *      R.replace(/foo/, 'bar', 'foo foo foo'); //=> 'bar foo foo'
 *
 *      // Use the "g" (global) flag to replace all occurrences:
 *      R.replace(/foo/g, 'bar', 'foo foo foo'); //=> 'bar bar bar'
 */
var replace = /*#__PURE__*/_curry3(function replace(regex, replacement, str) {
  return str.replace(regex, replacement);
});

/**
 * Tests the final argument by passing it to the given predicate function. If
 * the predicate is satisfied, the function will return the result of calling
 * the `whenTrueFn` function with the same argument. If the predicate is not
 * satisfied, the argument is returned as is.
 *
 * @func
 * @memberOf R
 * @since v0.18.0
 * @category Logic
 * @sig (a -> Boolean) -> (a -> a) -> a -> a
 * @param {Function} pred       A predicate function
 * @param {Function} whenTrueFn A function to invoke when the `condition`
 *                              evaluates to a truthy value.
 * @param {*}        x          An object to test with the `pred` function and
 *                              pass to `whenTrueFn` if necessary.
 * @return {*} Either `x` or the result of applying `x` to `whenTrueFn`.
 * @see R.ifElse, R.unless, R.cond
 * @example
 *
 *      // truncate :: String -> String
 *      const truncate = R.when(
 *        R.propSatisfies(R.gt(R.__, 10), 'length'),
 *        R.pipe(R.take(10), R.append('…'), R.join(''))
 *      );
 *      truncate('12345');         //=> '12345'
 *      truncate('0123456789ABC'); //=> '0123456789…'
 */
var when = /*#__PURE__*/_curry3(function when(pred, whenTrueFn, x) {
  return pred(x) ? whenTrueFn(x) : x;
});

var camelify = function (str) { return str.replace(/-(\w)/gu, function (_s, l) { return l.toUpperCase(); }); };
var memoize = function (fn) {
    var cache;
    var cached = false;
    return function () { return cached ? cache : (cached = true, cache = fn()); };
};
var splitNonEscaped = function (delims) { return function (str) {
    var delims_lns = map(length, delims);
    var out = [];
    var i, j, last_index = 0, delims_count = delims.length, str_len = str.length;
    for (i = 0; i < str_len; i++) {
        for (j = 0; j < delims_count; j++) {
            if (str.slice(i, i + delims_lns[j]) === delims[j]
                && str[i - 1] !== '\\') {
                out.push(str.slice(last_index, i));
                i += delims_lns[j] - 1;
                last_index = i + 1;
            }
        }
    }
    if (last_index !== str.length - 1) {
        out.push(str.slice(last_index));
    }
    return out;
}; };
var escape = (function () {
    var patternRE = /url\(.*?\)/g;
    var signsRE = /[,:;]/g;
    return function (v) {
        return v.replace(patternRE, function (v) {
            return v.replace(signsRE, function (s) { return "\\" + s; });
        });
    };
})();
var unescape = when(complement(isNil), replace(/([^\\])\\([^\\])/g, '$1$2'));
var valuable = both(complement(isEmpty), complement(isNil));
var join = function (strings, values) {
    return strings.reduce(function (accum, str, i) {
        return accum + str + values[i];
    }, '');
};
var isObject = compose(equals('Object'), type);
var deepMerge = function (o1, o2) {
    for (var k in o2) {
        if (isObject(o1[k]) && isObject(o2[k])) {
            deepMerge(o1[k], o2[k]);
        }
        else {
            o1[k] = o2[k];
        }
    }
    return o1;
};

var Selector = /** @class */ (function () {
    function Selector(selector) {
        this.rules = {};
        var cls = selector.match(/\.[\w-_]+/);
        this.s = {
            className: cls ? cls[0].slice(1) : null,
            modifier: cls ? selector.slice(cls[0].length) || null : selector
        };
    }
    Object.defineProperty(Selector.prototype, "complex", {
        get: function () {
            return this.s.className !== null && this.s.modifier !== null;
        },
        enumerable: true,
        configurable: true
    });
    Selector.prototype.serialize = function () {
        var _a = this.s, className = _a.className, modifier = _a.modifier;
        return (className ? "." + className : '') + (modifier || '');
    };
    return Selector;
}());

var extractRules = function (s, depth) {
    var _a;
    if (depth === void 0) { depth = 0; }
    var o = {};
    var tmp, full, key, newRules, k;
    for (k in s.rules) {
        tmp = s.rules[k];
        if (tmp instanceof Selector) {
            full = tmp.complex ? tmp.s.className : tmp.serialize();
            key = (depth == 0 && full[0] == '.')
                ? full.slice(1)
                : full[0] == '.' ? "& " + full : full;
            newRules = tmp.complex
                ? (_a = {}, _a[tmp.s.modifier] = extractRules(tmp, depth + 1), _a) : extractRules(tmp, depth + 1);
            if (o[key]) {
                deepMerge(o[key], newRules);
            }
            else {
                o[key] = newRules;
            }
        }
        else {
            o[k] = tmp;
        }
    }
    return o;
};
/** Keeps the structure of CSS to navigate and change the tree. */
var Levels = /** @class */ (function () {
    function Levels() {
        this.path = [];
        this.path.push([new Selector('__root')]);
    }
    Object.defineProperty(Levels.prototype, "out", {
        get: function () {
            return extractRules(this.path[0][0]);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Levels.prototype, "depth", {
        get: function () {
            return this.path.length;
        },
        enumerable: true,
        configurable: true
    });
    Levels.prototype.add = function (selectors) {
        var curSelectors = last(this.path);
        var newCurs = [];
        for (var _i = 0, selectors_1 = selectors; _i < selectors_1.length; _i++) {
            var rawSel = selectors_1[_i];
            var sel = new Selector(rawSel);
            for (var _a = 0, curSelectors_1 = curSelectors; _a < curSelectors_1.length; _a++) {
                var curSel = curSelectors_1[_a];
                var fullSelector = sel.serialize();
                var old = curSel.rules[fullSelector];
                newCurs.push(old || sel);
                if (!old) {
                    curSel.rules[fullSelector] = sel;
                }
            }
        }
        this.path.push(newCurs);
    };
    Levels.prototype.merge = function (k, v) {
        if (valuable(v) && valuable(k)) {
            for (var _i = 0, _a = last(this.path); _i < _a.length; _i++) {
                var o = _a[_i];
                o.rules[k] = v;
            }
        }
    };
    Levels.prototype.pop = function () {
        return this.path.pop();
    };
    return Levels;
}());

var analyseLine = (function () {
    var ruleRE = /^([\w-]+)(: *| +)(.*)$/;
    var selectorRE = /^(([\|~\$@>\*\.:&\(\)\^="\-\[\]]+).*[ ,]*)+:?$/;
    var delimRE = /\s*,\s*/g;
    var trailingColonRE = /(.*):$/;
    var getValue = function (value) {
        switch (value) {
            case 'undefined':
            case '': return undefined;
            case 'null': return null;
            default: return isNaN(+value) ? value : +value;
        }
    };
    return function (levels, line, names) {
        var groups;
        switch (true) {
            case line == '{':
                levels.add(names);
                break;
            case line == '}':
                levels.pop();
                break;
            case (groups = ruleRE.exec(line)) != null:
                levels.merge(unescape(camelify(groups[1])), when(isNaN, unescape, getValue(groups[3])));
                break;
            case (groups = selectorRE.exec(line)) != null:
                names.splice(0);
                names.push.apply(names, line.split(delimRE).map(function (selector) {
                    return selector.replace(trailingColonRE, '$1');
                }));
                break;
        }
    };
})();

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

/* eslint-disable no-var, prefer-template */
var uppercasePattern = /[A-Z]/g;
var msPattern = /^ms-/;
var cache = {};

function toHyphenLower(match) {
  return '-' + match.toLowerCase()
}

function hyphenateStyleName(name) {
  if (cache.hasOwnProperty(name)) {
    return cache[name]
  }

  var hName = name.replace(uppercasePattern, toHyphenLower);
  return (cache[name] = msPattern.test(hName) ? '-' + hName : hName)
}

var hyphenateProperty_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = hyphenateProperty;



var _hyphenateStyleName2 = _interopRequireDefault(hyphenateStyleName);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function hyphenateProperty(property) {
  return (0, _hyphenateStyleName2.default)(property);
}
module.exports = exports['default'];
});

unwrapExports(hyphenateProperty_1);

var cssifyDeclaration_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = cssifyDeclaration;



var _hyphenateProperty2 = _interopRequireDefault(hyphenateProperty_1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function cssifyDeclaration(property, value) {
  return (0, _hyphenateProperty2.default)(property) + ':' + value;
}
module.exports = exports['default'];
});

var cssifyDeclaration = unwrapExports(cssifyDeclaration_1);

var arrayEach_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = arrayEach;
function arrayEach(arr, iterator) {
  for (var i = 0, len = arr.length; i < len; ++i) {
    iterator(arr[i], i, len, arr);
  }
}
});

var arrayEach = unwrapExports(arrayEach_1);

/*!
 * isobject <https://github.com/jonschlinkert/isobject>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

var isobject = function isObject(val) {
  return val != null && typeof val === 'object' && Array.isArray(val) === false;
};

var arrayReduce_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = arrayReduce;
function arrayReduce(arr, reducer, initialValue) {
  for (var i = 0, len = arr.length; i < len; ++i) {
    initialValue = reducer(initialValue, arr[i], i, len, arr);
  }

  return initialValue;
}
});

var arrayReduce = unwrapExports(arrayReduce_1);

function applyKeysInOrder(order) {
  var initialValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  return arrayReduce(order, function (mediaMap, query) {
    mediaMap[query] = initialValue;
    return mediaMap;
  }, {});
}

var objectReduce = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = objectReducer;
function objectReducer(obj, reducer, initialValue) {
  for (var key in obj) {
    initialValue = reducer(initialValue, obj[key], key, obj);
  }

  return initialValue;
}
});

var objectReduce$1 = unwrapExports(objectReduce);

function generateCSSRule(selector, cssDeclaration) {
  return selector + "{" + cssDeclaration + "}";
}

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function insertAtIndex(arr, el, index) {
  return [].concat(_toConsumableArray(arr.slice(0, index)), [el], _toConsumableArray(arr.slice(index, arr.length)));
}

function _toConsumableArray$1(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// TODO: we can further improve this one
function objectSortByScore(obj, getScore) {
  var sortedKeys = objectReduce$1(obj, function (resultSortedKeys, value, key) {
    var index = resultSortedKeys.findIndex(function (el) {
      return getScore(obj[el], el) > getScore(value, key);
    });

    if (index !== -1) {
      return insertAtIndex(resultSortedKeys, key, index);
    }

    return [].concat(_toConsumableArray$1(resultSortedKeys), [key]);
  }, []);

  return arrayReduce(sortedKeys, function (sortedObj, key) {
    sortedObj[key] = obj[key];
    return sortedObj;
  }, {});
}

function getRuleScore() {
  var ruleOrder = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var pseudo = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  if (ruleOrder.length === 0 || pseudo.length === 0) {
    return 0;
  }

  return ruleOrder.indexOf(ruleOrder.find(function (regex) {
    return pseudo.match(regex) !== null;
  })) + 1;
}

var RULE_TYPE = 'RULE';
var KEYFRAME_TYPE = 'KEYFRAME';
var FONT_TYPE = 'FONT';
var STATIC_TYPE = 'STATIC';
var CLEAR_TYPE = 'CLEAR';

var _handlers;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var handlers = (_handlers = {}, _defineProperty(_handlers, RULE_TYPE, function (cluster, _ref) {
  var selector = _ref.selector,
      declaration = _ref.declaration,
      support = _ref.support,
      media = _ref.media;

  var cssRule = generateCSSRule(selector, declaration);

  if (support) {
    if (media) {
      if (!cluster.supportMediaRules[media]) {
        cluster.supportMediaRules[media] = {};
      }

      if (!cluster.supportMediaRules[media][support]) {
        cluster.supportMediaRules[media][support] = '';
      }

      cluster.supportMediaRules[media][support] += cssRule;
    } else {
      if (!cluster.supportRules[support]) {
        cluster.supportRules[support] = '';
      }

      cluster.supportRules[support] += cssRule;
    }
  } else if (media) {
    if (!cluster.mediaRules[media]) {
      cluster.mediaRules[media] = '';
    }

    cluster.mediaRules[media] += cssRule;
  } else {
    cluster.rules += cssRule;
  }
}), _defineProperty(_handlers, FONT_TYPE, function (cluster, _ref2) {
  var fontFace = _ref2.fontFace;

  cluster.fontFaces += fontFace;
}), _defineProperty(_handlers, KEYFRAME_TYPE, function (cluster, _ref3) {
  var keyframe = _ref3.keyframe;

  cluster.keyframes += keyframe;
}), _defineProperty(_handlers, STATIC_TYPE, function (cluster, _ref4) {
  var css = _ref4.css,
      selector = _ref4.selector;

  if (selector) {
    cluster.statics += generateCSSRule(selector, css);
  } else {
    cluster.statics += css;
  }
}), _handlers);

function clusterCache(cache) {
  var mediaQueryOrder = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var supportQueryOrder = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  var ruleOrder = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];

  var sortedCache = objectSortByScore(cache, function (value) {
    return getRuleScore(ruleOrder, value.pseudo);
  });

  var mediaRules = applyKeysInOrder(mediaQueryOrder);
  var supportRules = applyKeysInOrder(supportQueryOrder);

  var supportMediaRules = arrayReduce(mediaQueryOrder, function (resultSupportRules, media) {
    resultSupportRules[media] = applyKeysInOrder(supportQueryOrder);
    return resultSupportRules;
  }, applyKeysInOrder(mediaQueryOrder, {}));

  return objectReduce$1(sortedCache, function (cluster, entry) {
    var handler = handlers[entry.type];

    if (handler) {
      handler(cluster, entry);
    }

    return cluster;
  }, {
    mediaRules: mediaRules,
    supportRules: supportRules,
    supportMediaRules: supportMediaRules,
    fontFaces: '',
    statics: '',
    keyframes: '',
    rules: ''
  });
}

function generateCSSSupportRule(support, cssRules) {
  return "@supports " + support + "{" + cssRules + "}";
}

function cssifySupportRules(supportRules) {
  return objectReduce$1(supportRules, function (css, cssRules, support) {
    if (cssRules.length > 0) {
      css += generateCSSSupportRule(support, cssRules);
    }

    return css;
  }, '');
}

function generateCombinedMediaQuery(currentMediaQuery, nestedMediaQuery) {
  if (currentMediaQuery.length === 0) {
    return nestedMediaQuery;
  }

  return currentMediaQuery + " and " + nestedMediaQuery;
}

function generateCSSSelector(className) {
  var pseudo = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  return '.' + className + pseudo;
}

function isMediaQuery(property) {
  return property.substr(0, 6) === '@media';
}

var regex = /^(:|\[|>|&)/;

function isNestedSelector(property) {
  return regex.test(property);
}

function isSupport(property) {
  return property.substr(0, 9) === '@supports';
}

function isUndefinedValue(value) {
  return value === undefined || value === null || typeof value === 'string' && value.match(/(undefined|null)/) !== null;
}

function normalizeNestedProperty(nestedProperty) {
  if (nestedProperty.charAt(0) === '&') {
    return nestedProperty.slice(1);
  }

  return nestedProperty;
}

function processStyleWithPlugins(renderer, style, type) {
  var props = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  if (renderer.plugins.length > 0) {
    return arrayReduce(renderer.plugins, function (processedStyle, plugin) {
      return plugin(processedStyle, type, renderer, props);
    }, style);
  }

  return style;
}

var sheetMap = {
  fontFaces: FONT_TYPE,
  statics: STATIC_TYPE,
  keyframes: KEYFRAME_TYPE,
  rules: RULE_TYPE
};

var cssifyObject_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = cssifyObject;



var _cssifyDeclaration2 = _interopRequireDefault(cssifyDeclaration_1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function cssifyObject(style) {
  var css = '';

  for (var property in style) {
    var value = style[property];
    if (typeof value !== 'string' && typeof value !== 'number') {
      continue;
    }

    // prevents the semicolon after
    // the last rule declaration
    if (css) {
      css += ';';
    }

    css += (0, _cssifyDeclaration2.default)(property, value);
  }

  return css;
}
module.exports = exports['default'];
});

var cssifyObject = unwrapExports(cssifyObject_1);

function cssifyFontFace(fontFace) {
  return '@font-face{' + cssifyObject(fontFace) + '}';
}

function cssifyKeyframe(frames, animationName) {
  var prefixes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [''];

  var keyframe = objectReduce$1(frames, function (css, frame, percentage) {
    return '' + css + percentage + '{' + cssifyObject(frame) + '}';
  }, '');

  return arrayReduce(prefixes, function (cssKeyframe, prefix) {
    return cssKeyframe + '@' + prefix + 'keyframes ' + animationName + '{' + keyframe + '}';
  }, '');
}

function minifyCSSString(style) {
  return style.replace(/\s{2,}/g, '');
}

function cssifyStaticStyle(staticStyle, renderer) {
  if (typeof staticStyle === 'string') {
    return minifyCSSString(staticStyle);
  }

  var processedStaticStyle = processStyleWithPlugins(renderer, staticStyle, STATIC_TYPE);

  return cssifyObject(processedStaticStyle);
}

function generateAnimationName(id) {
  var rendererId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  return rendererId + 'k' + id;
}

var chars = 'abcdefghijklmnopqrstuvwxyz';
var charLength = chars.length;

function generateUniqueClassName(id) {
  var className = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  if (id <= charLength) {
    return chars[id - 1] + className;
  }

  // Bitwise floor as safari performs much faster
  // https://jsperf.com/math-floor-vs-math-round-vs-parseint/55
  return generateUniqueClassName(id / charLength | 0, chars[id % charLength] + className);
}

function generateClassName(getId) {
  var filterClassName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {
    return true;
  };

  var startId = getId();
  var generatedClassName = generateUniqueClassName(startId);

  if (!filterClassName(generatedClassName)) {
    return generateClassName(getId, filterClassName);
  }

  return generatedClassName;
}

function isBase64(property) {
  return property.substr(0, 5) === 'data:';
}

function getFontUrl(src) {
  if (isBase64(src)) {
    return src;
  }

  return '\'' + src + '\'';
}

var formats = {
  '.woff': 'woff',
  '.woff2': 'woff2',
  '.eot': 'embedded-opentype',
  '.ttf': 'truetype',
  '.otf': 'opentype',
  '.svg': 'svg',
  '.svgz': 'svg'
};

var base64Formats = {
  'image/svg+xml': 'svg',
  'application/x-font-woff': 'woff',
  'application/font-woff': 'woff',
  'application/x-font-woff2': 'woff2',
  'application/font-woff2': 'woff2',
  'font/woff2': 'woff2',
  'application/octet-stream': 'truetype',
  'application/x-font-ttf': 'truetype',
  'application/x-font-truetype': 'truetype',
  'application/x-font-opentype': 'opentype',
  'application/vnd.ms-fontobject': 'embedded-opentype',
  'application/font-sfnt': 'sfnt'
};

function getFontFormat(src) {
  if (isBase64(src)) {
    var mime = '';
    for (var i = 5;; i++) {
      // 'data:'.length === 5
      var c = src.charAt(i);

      if (c === ';' || c === ',') {
        break;
      }

      mime += c;
    }

    var fmt = base64Formats[mime];
    if (fmt) {
      return fmt;
    }

    console.warn('A invalid base64 font was used. Please use one of the following mime type: ' + Object.keys(base64Formats).join(', ') + '.');
  } else {
    var extension = '';
    for (var _i = src.length - 1;; _i--) {
      var _c = src.charAt(_i);

      if (_c === '.') {
        extension = _c + extension;
        break;
      }

      extension = _c + extension;
    }

    var _fmt = formats[extension];
    if (_fmt) {
      return _fmt;
    }

    console.warn('A invalid font-format was used in "' + src + '". Use one of these: ' + Object.keys(formats).join(', ') + '.');
  }
  return '';
}

function generateFontSource() {
  var files = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var fontLocals = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  var localSource = arrayReduce(fontLocals, function (src, local) {
    var localUrl = getFontUrl(local);
    return '{src} local(' + localUrl + '), ';
  }, '');

  return arrayReduce(files, function (src, fileSource, index) {
    var prefix = index > 0 ? ',' : '';
    var fileFormat = getFontFormat(fileSource);
    var fileUrl = getFontUrl(fileSource);

    return '' + src + prefix + 'url(' + fileUrl + ') format(\'' + fileFormat + '\')';
  }, localSource);
}

function generateStaticReference(style, selector) {
  if (typeof style === 'string') {
    return style;
  }

  if (selector) {
    return selector + JSON.stringify(style);
  }

  return '';
}

function getFontLocals(localAlias) {
  if (typeof localAlias === 'string') {
    return [localAlias];
  }

  if (Array.isArray(localAlias)) {
    return localAlias.slice();
  }

  return [];
}

function isSafeClassName(className) {
  return className.indexOf('ad') === -1;
}

function toCSSString(value) {
  if (value.charAt(0) === '"') {
    return value;
  }

  return '"' + value + '"';
}

var PREFIX_SYNTAX = /^[a-z_][a-z0-9-_]*$/gi;

function validateSelectorPrefix() {
  var selectorPrefix = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  if (selectorPrefix.length > 0 && selectorPrefix.match(PREFIX_SYNTAX) === null) {
    console.error('An invalid selectorPrefix (' + selectorPrefix + ') has been used to create a new Fela renderer.\nIt must only contain a-Z, 0-9, - and _ while it must start with either _ or a-Z.\nSee http://fela.js.org/docs/advanced/RendererConfiguration.html');
  }

  return selectorPrefix;
}

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function createRenderer() {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var renderer = {
    listeners: [],
    keyframePrefixes: config.keyframePrefixes || ['-webkit-', '-moz-'],
    plugins: config.plugins || [],
    mediaQueryOrder: config.mediaQueryOrder || [],
    supportQueryOrder: config.supportQueryOrder || [],
    ruleOrder: [/^:link/, /^:visited/, /^:hover/, /^:focus-within/, /^:focus/, /^:active/],

    rendererId: validateSelectorPrefix(config.rendererId),
    selectorPrefix: validateSelectorPrefix(config.selectorPrefix),
    filterClassName: config.filterClassName || isSafeClassName,
    devMode: config.devMode || false,

    uniqueRuleIdentifier: 0,
    uniqueKeyframeIdentifier: 0,

    nodes: {},
    scoreIndex: {},
    // use a flat cache object with pure string references
    // to achieve maximal lookup performance and memoization speed
    cache: {},

    getNextRuleIdentifier: function getNextRuleIdentifier() {
      return ++renderer.uniqueRuleIdentifier;
    },
    renderRule: function renderRule(rule) {
      var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return renderer._renderStyle(rule(props, renderer), props);
    },
    renderKeyframe: function renderKeyframe(keyframe) {
      var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var resolvedKeyframe = keyframe(props, renderer);
      var keyframeReference = JSON.stringify(resolvedKeyframe);

      if (!renderer.cache.hasOwnProperty(keyframeReference)) {
        // use another unique identifier to ensure minimal css markup
        var animationName = generateAnimationName(++renderer.uniqueKeyframeIdentifier, renderer.rendererId);

        var processedKeyframe = processStyleWithPlugins(renderer, resolvedKeyframe, KEYFRAME_TYPE, props);

        var cssKeyframe = cssifyKeyframe(processedKeyframe, animationName, renderer.keyframePrefixes);

        var change = {
          type: KEYFRAME_TYPE,
          keyframe: cssKeyframe,
          name: animationName
        };

        renderer.cache[keyframeReference] = change;
        renderer._emitChange(change);
      }

      return renderer.cache[keyframeReference].name;
    },
    renderFont: function renderFont(family, files) {
      var properties = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      var localAlias = properties.localAlias,
          otherProperties = _objectWithoutProperties(properties, ['localAlias']);

      var fontReference = family + JSON.stringify(properties);
      var fontLocals = getFontLocals(localAlias);

      if (!renderer.cache.hasOwnProperty(fontReference)) {
        var fontFamily = toCSSString(family);

        var fontFace = _extends({}, otherProperties, {
          src: generateFontSource(files, fontLocals),
          fontFamily: fontFamily
        });

        var cssFontFace = cssifyFontFace(fontFace);

        var change = {
          type: FONT_TYPE,
          fontFace: cssFontFace,
          fontFamily: fontFamily
        };

        renderer.cache[fontReference] = change;
        renderer._emitChange(change);
      }

      return renderer.cache[fontReference].fontFamily;
    },
    renderStatic: function renderStatic(staticStyle, selector) {
      var staticReference = generateStaticReference(staticStyle, selector);

      if (!renderer.cache.hasOwnProperty(staticReference)) {
        var cssDeclarations = cssifyStaticStyle(staticStyle, renderer);

        var change = {
          type: STATIC_TYPE,
          css: cssDeclarations,
          selector: selector
        };

        renderer.cache[staticReference] = change;
        renderer._emitChange(change);
      }
    },
    subscribe: function subscribe(callback) {
      renderer.listeners.push(callback);

      return {
        unsubscribe: function unsubscribe() {
          return renderer.listeners.splice(renderer.listeners.indexOf(callback), 1);
        }
      };
    },
    clear: function clear() {
      renderer.uniqueRuleIdentifier = 0;
      renderer.uniqueKeyframeIdentifier = 0;
      renderer.cache = {};

      renderer._emitChange({
        type: CLEAR_TYPE
      });
    },
    _renderStyle: function _renderStyle() {
      var style = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var processedStyle = processStyleWithPlugins(renderer, style, RULE_TYPE, props);

      return renderer._renderStyleToClassNames(processedStyle).slice(1);
    },
    _renderStyleToClassNames: function _renderStyleToClassNames(_ref) {
      var pseudo = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      var media = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
      var support = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';

      var _className = _ref._className,
          style = _objectWithoutProperties(_ref, ['_className']);

      var classNames = _className ? ' ' + _className : '';

      for (var property in style) {
        var value = style[property];

        if (isobject(value)) {
          if (isNestedSelector(property)) {
            classNames += renderer._renderStyleToClassNames(value, pseudo + normalizeNestedProperty(property), media, support);
          } else if (isMediaQuery(property)) {
            var combinedMediaQuery = generateCombinedMediaQuery(media, property.slice(6).trim());
            classNames += renderer._renderStyleToClassNames(value, pseudo, combinedMediaQuery, support);
          } else if (isSupport(property)) {
            var combinedSupport = generateCombinedMediaQuery(support, property.slice(9).trim());
            classNames += renderer._renderStyleToClassNames(value, pseudo, media, combinedSupport);
          } else {
            console.warn('The object key "' + property + '" is not a valid nested key in Fela. \nMaybe you forgot to add a plugin to resolve it? \nCheck http://fela.js.org/docs/basics/Rules.html#styleobject for more information.');
          }
        } else {
          var declarationReference = support + media + pseudo + property + value;

          if (!renderer.cache.hasOwnProperty(declarationReference)) {
            // we remove undefined values to enable
            // usage of optional props without side-effects
            if (isUndefinedValue(value)) {
              renderer.cache[declarationReference] = {
                className: ''
                /* eslint-disable no-continue */
              };continue;
              /* eslint-enable */
            }

            var className = renderer.selectorPrefix + generateClassName(renderer.getNextRuleIdentifier, renderer.filterClassName);

            var declaration = cssifyDeclaration(property, value);
            var selector = generateCSSSelector(className, pseudo);

            var change = {
              type: RULE_TYPE,
              className: className,
              selector: selector,
              declaration: declaration,
              pseudo: pseudo,
              media: media,
              support: support
            };

            renderer.cache[declarationReference] = change;
            renderer._emitChange(change);
          }

          var cachedClassName = renderer.cache[declarationReference].className;

          // only append if we got a class cached
          if (cachedClassName) {
            classNames += ' ' + cachedClassName;
          }
        }
      }

      return classNames;
    },
    _emitChange: function _emitChange(change) {
      arrayEach(renderer.listeners, function (listener) {
        return listener(change);
      });
    }
  };

  // initial setup
  renderer.keyframePrefixes.push('');

  if (config.enhancers) {
    arrayEach(config.enhancers, function (enhancer) {
      renderer = enhancer(renderer);
    });
  }

  return renderer;
}

var assignStyle_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = assignStyle;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function filterUniqueArray(arr) {
  return arr.filter(function (val, index) {
    return arr.lastIndexOf(val) === index;
  });
}

function assignStyle(base) {
  for (var _len = arguments.length, extendingStyles = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    extendingStyles[_key - 1] = arguments[_key];
  }

  for (var i = 0, len = extendingStyles.length; i < len; ++i) {
    var style = extendingStyles[i];

    for (var property in style) {
      var value = style[property];
      var baseValue = base[property];

      if (baseValue && value) {
        if (Array.isArray(baseValue)) {
          base[property] = filterUniqueArray(baseValue.concat(value));
          continue;
        }

        if (Array.isArray(value)) {
          base[property] = filterUniqueArray([baseValue].concat(_toConsumableArray(value)));
          continue;
        }

        if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
          base[property] = assignStyle({}, baseValue, value);
          continue;
        }
      }

      base[property] = value;
    }
  }

  return base;
}
module.exports = exports['default'];
});

var assignStyle = unwrapExports(assignStyle_1);

function _toConsumableArray$2(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function resolveRule(rule, props, renderer) {
  if (Array.isArray(rule)) {
    return resolveRule(combineRules.apply(undefined, _toConsumableArray$2(rule)), props, renderer);
  }

  if (typeof rule === 'function') {
    return rule(props, renderer);
  }

  return rule;
}

function combineRules() {
  for (var _len = arguments.length, rules = Array(_len), _key = 0; _key < _len; _key++) {
    rules[_key] = arguments[_key];
  }

  return function (props, renderer) {
    return arrayReduce(rules, function (style, rule) {
      return assignStyle(style, resolveRule(rule, props, renderer));
    }, {});
  };
}

var objectEach_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = objectEach;
function objectEach(obj, iterator) {
  for (var key in obj) {
    iterator(obj[key], key, obj);
  }
}
});

var objectEach = unwrapExports(objectEach_1);

function getRuleScore$1(baseScore) {
  var media = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var mediaQueryOrder = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  if (media.length === 0) {
    return baseScore;
  }

  var mediaIndex = mediaQueryOrder.indexOf(media) + 1;
  if (mediaIndex) {
    return baseScore + mediaIndex * 2;
  }

  return 9999;
}

function calculateNodeScore(_ref, mediaQueryOrder) {
  var type = _ref.type,
      support = _ref.support,
      media = _ref.media;

  switch (type) {
    case FONT_TYPE:
      return 0;
    case STATIC_TYPE:
      return 1;
    case KEYFRAME_TYPE:
      return 2;
    case RULE_TYPE:
      return getRuleScore$1(support ? 4 : 3, media, mediaQueryOrder);
    default:
      // TODO: warning
      return 9999;
  }
}

function queryNode(_ref) {
  var type = _ref.type,
      media = _ref.media,
      support = _ref.support;
  var id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  var idQuery = id.length > 0 ? '[data-fela-id="' + id + '"]' : '';
  var mediaQuery = media ? '[media="' + media + '"]' : ':not([media])';
  var supportQuery = support ? '[data-fela-support="true"]' : ':not([data-fela-support="true"])';

  return document.querySelector('[data-fela-type="' + type + '"]' + idQuery + supportQuery + mediaQuery);
}

function createNode(nodes, score, _ref) {
  var type = _ref.type,
      media = _ref.media,
      support = _ref.support;
  var id = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';

  var head = document.head || {};

  var node = document.createElement('style');
  node.setAttribute('data-fela-type', type);
  node.type = 'text/css';

  if (id.length > 0) {
    node.setAttribute('data-fela-id', id);
  }

  if (support) {
    node.setAttribute('data-fela-support', 'true');
  }

  if (media) {
    node.media = media;
  }

  // we calculate the most next bigger style node
  // to correctly inject the node just before it
  var moreSpecificReference = objectReduce$1(nodes, function (closest, currentNode, reference) {
    return currentNode.score > score && (!closest || nodes[closest].score > currentNode.score) ? reference : closest;
  }, undefined);

  if (moreSpecificReference) {
    head.insertBefore(node, nodes[moreSpecificReference].node);
  } else {
    head.appendChild(node);
  }

  return node;
}

function getReference(_ref) {
  var type = _ref.type,
      _ref$media = _ref.media,
      media = _ref$media === undefined ? '' : _ref$media,
      _ref$support = _ref.support,
      support = _ref$support === undefined ? '' : _ref$support;

  return type + media + support;
}

function getNodeFromCache(attributes, renderer) {
  var reference = getReference(attributes);

  if (!renderer.nodes[reference]) {
    var score = calculateNodeScore(attributes, renderer.mediaQueryOrder);
    var node = queryNode(attributes, renderer.rendererId) || createNode(renderer.nodes, score, attributes, renderer.rendererId);

    renderer.nodes[reference] = {
      node: node,
      score: score
    };
  }

  return renderer.nodes[reference].node;
}

var SELECTOR_PREFIX_REGEXP = /^[a-z0-9_-]*$/gi;


function getRehydrationIndex(renderer) {
  if (renderer.selectorPrefix.length === 0 || renderer.selectorPrefix.match(SELECTOR_PREFIX_REGEXP) !== null) {
    return renderer.uniqueRuleIdentifier;
  }

  return -1;
}

var _extends$1 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function renderToSheetList(renderer) {
  var cacheCluster = clusterCache(renderer.cache, renderer.mediaQueryOrder, renderer.supportQueryOrder, renderer.ruleOrder);

  var rehydrationIndex = getRehydrationIndex(renderer);

  var sheetList = objectReduce$1(sheetMap, function (list, type, key) {
    if (cacheCluster[key].length > 0) {
      list.push({
        css: cacheCluster[key],
        rehydration: rehydrationIndex,
        type: type
      });
    }

    return list;
  }, []);

  var support = cssifySupportRules(cacheCluster.supportRules);

  if (support) {
    sheetList.push({
      css: support,
      type: RULE_TYPE,
      rehydration: rehydrationIndex,
      support: true
    });
  }

  var mediaKeys = Object.keys(_extends$1({}, cacheCluster.supportMediaRules, cacheCluster.mediaRules));

  return arrayReduce(mediaKeys, function (list, media) {
    // basic media query rules
    if (cacheCluster.mediaRules[media] && cacheCluster.mediaRules[media].length > 0) {
      list.push({
        css: cacheCluster.mediaRules[media],
        type: RULE_TYPE,
        rehydration: rehydrationIndex,
        media: media
      });
    }

    // support media rules
    if (cacheCluster.supportMediaRules[media]) {
      var mediaSupport = cssifySupportRules(cacheCluster.supportMediaRules[media]);

      if (mediaSupport.length > 0) {
        list.push({
          css: mediaSupport,
          type: RULE_TYPE,
          rehydration: rehydrationIndex,
          support: true,
          media: media
        });
      }
    }

    return list;
  }, sheetList);
}

// This method is quite hacky and in-performant, but yet
// the most simple way to respect rule sorting even in devMode
function updateNodeInDevMode(renderer, node) {
  var sheetList = renderToSheetList(renderer);

  var media = node.getAttribute('media') || undefined;
  var support = node.getAttribute('data-fela-support') || undefined;

  var currentSheet = sheetList.find(function (sheet) {
    return sheet.type === RULE_TYPE && sheet.media === media && sheet.support === support;
  });

  if (currentSheet) {
    node.textContent = currentSheet.css;
  }
}

function insertRule(_ref, renderer, node) {
  var selector = _ref.selector,
      declaration = _ref.declaration,
      support = _ref.support,
      media = _ref.media,
      pseudo = _ref.pseudo;

  var nodeReference = media + support;
  // only use insertRule in production as browser devtools might have
  // weird behavior if used together with insertRule at runtime
  if (renderer.devMode) {
    updateNodeInDevMode(renderer, node);
    return;
  }

  try {
    var score = getRuleScore(renderer.ruleOrder, pseudo);
    var cssRules = node.sheet.cssRules;


    var index = cssRules.length;

    if (score === 0) {
      if (renderer.scoreIndex[nodeReference] === undefined) {
        index = 0;
      } else {
        index = renderer.scoreIndex[nodeReference] + 1;
      }
    } else {
      // we start iterating from the last score=0 entry
      // to corretly inject pseudo classes etc.
      var startIndex = renderer.scoreIndex[nodeReference] || 0;

      for (var i = startIndex, len = cssRules.length; i < len; ++i) {
        if (cssRules[i].score > score) {
          index = i;
          break;
        }
      }
    }

    var cssRule = generateCSSRule(selector, declaration);

    if (support.length > 0) {
      var cssSupportRule = generateCSSSupportRule(support, cssRule);
      node.sheet.insertRule(cssSupportRule, index);
    } else {
      node.sheet.insertRule(cssRule, index);
    }

    if (score === 0) {
      renderer.scoreIndex[nodeReference] = index;
    }

    cssRules[index].score = score;
  } catch (e) {
    // We're disabled these warnings due to false-positive errors with browser prefixes
    // See https://github.com/rofrischmann/fela/issues/634
    // console.warn(
    //   `An error occurred while inserting the rules into DOM.\n`,
    //   declaration.replace(/;/g, ';\n'),
    //   e
    // )
  }
}

function createSubscription(renderer) {
  return function (change) {
    if (change.type === CLEAR_TYPE) {
      objectEach(renderer.nodes, function (_ref) {
        var node = _ref.node;
        return node.parentNode.removeChild(node);
      });

      renderer.nodes = {};
      renderer.scoreIndex = {};
      return;
    }

    var node = getNodeFromCache(change, renderer);

    switch (change.type) {
      case KEYFRAME_TYPE:
        node.textContent += change.keyframe;
        break;
      case FONT_TYPE:
        node.textContent += change.fontFace;
        break;
      case STATIC_TYPE:
        node.textContent += change.selector ? generateCSSRule(change.selector, change.css) : change.css;
        break;
      case RULE_TYPE:
        insertRule(change, renderer, node);
        break;
    }
  };
}

function render(renderer) {
  if (!renderer.updateSubscription) {
    renderer.scoreIndex = {};
    renderer.nodes = {};

    renderer.updateSubscription = createSubscription(renderer);
    renderer.subscribe(renderer.updateSubscription);

    // simulate rendering to ensure all styles rendered prior to
    // calling FelaDOM.render are correctly injected as well
    objectEach(renderer.cache, renderer._emitChange);
  }
}

function extractSupportQuery(ruleSet) {
  return ruleSet.split('{')[0].slice(9).trim();
}

function generateCacheEntry(type, className, property, value) {
  var pseudo = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '';
  var media = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : '';
  var support = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : '';

  return {
    type: type,
    className: className,
    selector: generateCSSSelector(className, pseudo),
    declaration: property + ':' + value,
    pseudo: pseudo,
    media: media,
    support: support
  };
}

var camelCaseProperty_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = camelCaseProperty;
var dashRegex = /-([a-z])/g;
var msRegex = /^Ms/g;

function camelCaseProperty(property) {
  return property.replace(dashRegex, function (match) {
    return match[1].toUpperCase();
  }).replace(msRegex, 'ms');
}
module.exports = exports['default'];
});

var camelCaseProperty = unwrapExports(camelCaseProperty_1);

function generateDeclarationReference(property, value) {
  var pseudo = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var media = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
  var support = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '';

  return support + media + pseudo + camelCaseProperty(property) + value;
}

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var DECL_REGEX = /[.]([0-9a-z_-]+)([^{]+)?{([^:]+):([^}]+)}/gi;

function rehydrateRules(css) {
  var media = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var support = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var cache = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  var decl = void 0;

  // This excellent parsing implementation was originally taken from Styletron and modified to fit Fela
  // https://github.com/rtsao/styletron/blob/master/packages/styletron-client/src/index.js#L47
  /* eslint-disable no-unused-vars,no-cond-assign */
  while (decl = DECL_REGEX.exec(css)) {
    // $FlowFixMe
    var _decl = decl,
        _decl2 = _slicedToArray(_decl, 5),
        ruleSet = _decl2[0],
        className = _decl2[1],
        pseudo = _decl2[2],
        property = _decl2[3],
        value = _decl2[4];
    /* eslint-enable */

    var declarationReference = generateDeclarationReference(property, value, pseudo, media, support);

    cache[declarationReference] = generateCacheEntry(RULE_TYPE, className, property, value, pseudo, media, support);
  }

  return cache;
}

var _slicedToArray$1 = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var SUPPORT_REGEX = /@supports[^{]+\{([\s\S]+?})\s*}/gi;

function rehydrateSupportRules(css) {
  var media = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var cache = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var decl = void 0;

  // eslint-disable-next-line no-cond-assign
  while (decl = SUPPORT_REGEX.exec(css)) {
    var _decl = decl,
        _decl2 = _slicedToArray$1(_decl, 2),
        ruleSet = _decl2[0],
        cssRules = _decl2[1];

    var supportQuery = extractSupportQuery(ruleSet);
    rehydrateRules(cssRules, media, supportQuery, cache);
  }

  return cache;
}

var CLASSNAME_REGEX = /[.][a-z0-9_-]*/gi;

// rehydration (WIP)
// TODO: static, keyframe, font
function rehydrate(renderer) {
  render(renderer);

  var idQuery = renderer.rendererId.length > 0 ? '[data-fela-id="' + renderer.rendererId + '"]' : '';

  arrayEach(document.querySelectorAll('[data-fela-type]' + idQuery), function (node) {
    var rehydrationAttribute = node.getAttribute('data-fela-rehydration') || -1;
    var rehydrationIndex = renderer.uniqueRuleIdentifier || parseInt(rehydrationAttribute, 10);

    // skip rehydration if no rehydration index is set
    // this index is set to -1 if something blocks rehydration
    if (rehydrationIndex !== -1) {
      var type = node.getAttribute('data-fela-type') || '';
      var media = node.getAttribute('media') || '';
      var support = node.getAttribute('data-fela-support') || '';
      var css = node.textContent;

      renderer.uniqueRuleIdentifier = rehydrationIndex;

      var reference = type + media + support;
      renderer.nodes[reference] = {
        score: calculateNodeScore({ type: type, media: media, support: support }, renderer.mediaQueryOrder),
        node: node
      };

      if (type === RULE_TYPE) {
        if (support) {
          rehydrateSupportRules(css, media, renderer.cache);
        } else {
          rehydrateRules(css, media, '', renderer.cache);
        }

        // On Safari, style sheets with IE-specific media queries
        // can yield null for node.sheet
        // https://github.com/rofrischmann/fela/issues/431#issuecomment-423239591
        if (node.sheet && node.sheet.cssRules) {
          var nodeReference = media + support;

          arrayEach(node.sheet.cssRules, function (rule, index) {
            var selectorText = rule.conditionText ? rule.cssRules[0].selectorText : rule.selectorText;

            var score = getRuleScore(renderer.ruleOrder, selectorText.split(CLASSNAME_REGEX)[1]);

            if (score === 0) {
              renderer.scoreIndex[nodeReference] = index;
            }

            rule.score = score;
          });
        }
      }
    }
  });
}

function createStyleTagMarkup(css, type) {
  var rendererId = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var media = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
  var rehydrationIndex = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : -1;
  var support = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;

  var idAttribute = rendererId.length > 0 ? ' data-fela-id="' + rendererId + '"' : '';
  var mediaAttribute = media.length > 0 ? ' media="' + media + '"' : '';
  var supportAttribute = support ? ' data-fela-support="true"' : '';

  return '<style type="text/css" data-fela-rehydration="' + rehydrationIndex + '" data-fela-type="' + type + '"' + idAttribute + supportAttribute + mediaAttribute + '>' + css + '</style>';
}

var _extends$2 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function renderToMarkup(renderer) {
  var cacheCluster = clusterCache(renderer.cache, renderer.mediaQueryOrder, renderer.supportQueryOrder, renderer.ruleOrder);

  var rehydrationIndex = getRehydrationIndex(renderer);

  var styleMarkup = objectReduce$1(sheetMap, function (markup, type, key) {
    if (cacheCluster[key].length > 0) {
      markup += createStyleTagMarkup(cacheCluster[key], type, renderer.rendererId, '', rehydrationIndex);
    }

    return markup;
  }, '');

  var support = cssifySupportRules(cacheCluster.supportRules);

  if (support) {
    styleMarkup += createStyleTagMarkup(support, RULE_TYPE, renderer.rendererId, '', rehydrationIndex, true);
  }

  var mediaKeys = Object.keys(_extends$2({}, cacheCluster.supportMediaRules, cacheCluster.mediaRules));

  return arrayReduce(mediaKeys, function (markup, media) {
    // basic media query rules
    if (cacheCluster.mediaRules[media] && cacheCluster.mediaRules[media].length > 0) {
      markup += createStyleTagMarkup(cacheCluster.mediaRules[media], RULE_TYPE, renderer.rendererId, media, rehydrationIndex);
    }

    // support media rules
    if (cacheCluster.supportMediaRules[media]) {
      var mediaSupport = cssifySupportRules(cacheCluster.supportMediaRules[media]);

      if (mediaSupport.length > 0) {
        markup += createStyleTagMarkup(mediaSupport, RULE_TYPE, renderer.rendererId, media, rehydrationIndex, true);
      }
    }

    return markup;
  }, styleMarkup);
}

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _objectWithoutProperties$1(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function renderFontFace(_ref, renderer) {
  var fontFamily = _ref.fontFamily,
      src = _ref.src,
      otherProps = _objectWithoutProperties$1(_ref, ['fontFamily', 'src']);

  if (typeof fontFamily === 'string' && Array.isArray(src)) {
    return renderer.renderFont(fontFamily, src, otherProps);
  }

  // TODO: warning - invalid font data
  return undefined;
}

function embedded(style, type, renderer) {
  var _loop = function _loop(property) {
    var value = style[property];

    if (property === 'fontFace' && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
      if (Array.isArray(value)) {
        style.fontFamily = arrayReduce(value, function (fontFamilyList, fontFace) {
          var fontFamily = renderFontFace(fontFace, renderer);

          if (fontFamily && fontFamilyList.indexOf(fontFamily) === -1) {
            fontFamilyList.push(fontFamily);
          }

          return fontFamilyList;
        }, []).join(',');
      } else {
        style.fontFamily = renderFontFace(value, renderer);
      }
      delete style.fontFace;
    } else if (property === 'animationName' && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
      if (Array.isArray(value)) {
        style[property] = value.map(function (frame) {
          return renderer.renderKeyframe(function () {
            return frame;
          });
        }).join(',');
      } else {
        style[property] = renderer.renderKeyframe(function () {
          return value;
        });
      }
    } else if (isobject(value)) {
      embedded(value, type, renderer);
    }
  };

  for (var property in style) {
    _loop(property);
  }

  return style;
}

var embedded$1 = (function () {
  return embedded;
});

function capitalizeString(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function prefixProperty(prefixProperties, property, style) {
  if (prefixProperties.hasOwnProperty(property)) {
    var newStyle = {};
    var requiredPrefixes = prefixProperties[property];
    var capitalizedProperty = capitalizeString(property);
    var keys = Object.keys(style);
    for (var i = 0; i < keys.length; i++) {
      var styleProperty = keys[i];
      if (styleProperty === property) {
        for (var j = 0; j < requiredPrefixes.length; j++) {
          newStyle[requiredPrefixes[j] + capitalizedProperty] = style[property];
        }
      }
      newStyle[styleProperty] = style[styleProperty];
    }
    return newStyle;
  }
  return style;
}

function prefixValue(plugins, property, value, style, metaData) {
  for (var i = 0, len = plugins.length; i < len; ++i) {
    var processedValue = plugins[i](property, value, style, metaData);

    // we can stop processing if a value is returned
    // as all plugin criteria are unique
    if (processedValue) {
      return processedValue;
    }
  }
}

function addIfNew(list, value) {
  if (list.indexOf(value) === -1) {
    list.push(value);
  }
}

function addNewValuesOnly(list, values) {
  if (Array.isArray(values)) {
    for (var i = 0, len = values.length; i < len; ++i) {
      addIfNew(list, values[i]);
    }
  } else {
    addIfNew(list, values);
  }
}

function isObject$1(value) {
  return value instanceof Object && !Array.isArray(value);
}

function createPrefixer(_ref) {
  var prefixMap = _ref.prefixMap,
      plugins = _ref.plugins;

  return function prefix(style) {
    for (var property in style) {
      var value = style[property];

      // handle nested objects
      if (isObject$1(value)) {
        style[property] = prefix(value);
        // handle array values
      } else if (Array.isArray(value)) {
        var combinedValue = [];

        for (var i = 0, len = value.length; i < len; ++i) {
          var processedValue = prefixValue(plugins, property, value[i], style, prefixMap);
          addNewValuesOnly(combinedValue, processedValue || value[i]);
        }

        // only modify the value if it was touched
        // by any plugin to prevent unnecessary mutations
        if (combinedValue.length > 0) {
          style[property] = combinedValue;
        }
      } else {
        var _processedValue = prefixValue(plugins, property, value, style, prefixMap);

        // only modify the value if it was touched
        // by any plugin to prevent unnecessary mutations
        if (_processedValue) {
          style[property] = _processedValue;
        }

        style = prefixProperty(prefixMap, property, style);
      }
    }

    return style;
  };
}

var w = ["Webkit"];
var m = ["Moz"];
var ms = ["ms"];
var wm = ["Webkit", "Moz"];
var wms = ["Webkit", "ms"];
var wmms = ["Webkit", "Moz", "ms"];

var data = {
  plugins: [],
  prefixMap: { "appearance": wm, "textEmphasisPosition": w, "textEmphasis": w, "textEmphasisStyle": w, "textEmphasisColor": w, "boxDecorationBreak": w, "maskImage": w, "maskMode": w, "maskRepeat": w, "maskPosition": w, "maskClip": w, "maskOrigin": w, "maskSize": w, "maskComposite": w, "mask": w, "maskBorderSource": w, "maskBorderMode": w, "maskBorderSlice": w, "maskBorderWidth": w, "maskBorderOutset": w, "maskBorderRepeat": w, "maskBorder": w, "maskType": w, "textDecorationStyle": w, "textDecorationSkip": w, "textDecorationLine": w, "textDecorationColor": w, "userSelect": wmms, "backdropFilter": w, "fontKerning": w, "scrollSnapType": wms, "scrollSnapPointsX": wms, "scrollSnapPointsY": wms, "scrollSnapDestination": wms, "scrollSnapCoordinate": wms, "clipPath": w, "shapeImageThreshold": w, "shapeImageMargin": w, "shapeImageOutside": w, "filter": w, "hyphens": wms, "flowInto": wms, "flowFrom": wms, "breakBefore": wms, "breakAfter": wms, "breakInside": wms, "regionFragment": wms, "writingMode": wms, "textOrientation": w, "tabSize": m, "fontFeatureSettings": w, "columnCount": w, "columnFill": w, "columnGap": w, "columnRule": w, "columnRuleColor": w, "columnRuleStyle": w, "columnRuleWidth": w, "columns": w, "columnSpan": w, "columnWidth": w, "wrapFlow": ms, "wrapThrough": ms, "wrapMargin": ms, "gridTemplateColumns": ms, "gridTemplateRows": ms, "gridTemplateAreas": ms, "gridTemplate": ms, "gridAutoColumns": ms, "gridAutoRows": ms, "gridAutoFlow": ms, "grid": ms, "gridRowStart": ms, "gridColumnStart": ms, "gridRowEnd": ms, "gridRow": ms, "gridColumn": ms, "gridColumnEnd": ms, "gridColumnGap": ms, "gridRowGap": ms, "gridArea": ms, "gridGap": ms, "textSizeAdjust": wms }
};

// https://developer.mozilla.org/en-US/docs/Web/CSS/background-clip#Browser_compatibility
function backgroundClip(property, value) {
  if (typeof value === 'string' && value === 'text') {
    return ['-webkit-text', 'text'];
  }
}

var prefixes = ['-webkit-', '-moz-', ''];

var values = {
  'zoom-in': true,
  'zoom-out': true,
  grab: true,
  grabbing: true
};

function cursor(property, value) {
  if (property === 'cursor' && values.hasOwnProperty(value)) {
    return prefixes.map(function (prefix) {
      return prefix + value;
    });
  }
}

var isPrefixedValue_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isPrefixedValue;
var regex = /-webkit-|-moz-|-ms-/;

function isPrefixedValue(value) {
  return typeof value === 'string' && regex.test(value);
}
module.exports = exports['default'];
});

var isPrefixedValue = unwrapExports(isPrefixedValue_1);

// http://caniuse.com/#search=cross-fade
var prefixes$1 = ['-webkit-', ''];

function crossFade(property, value) {
  if (typeof value === 'string' && !isPrefixedValue(value) && value.indexOf('cross-fade(') > -1) {
    return prefixes$1.map(function (prefix) {
      return value.replace(/cross-fade\(/g, prefix + 'cross-fade(');
    });
  }
}

// http://caniuse.com/#feat=css-filter-function
var prefixes$2 = ['-webkit-', ''];

function filter(property, value) {
  if (typeof value === 'string' && !isPrefixedValue(value) && value.indexOf('filter(') > -1) {
    return prefixes$2.map(function (prefix) {
      return value.replace(/filter\(/g, prefix + 'filter(');
    });
  }
}

var values$1 = {
  flex: ['-webkit-box', '-moz-box', '-ms-flexbox', '-webkit-flex', 'flex'],
  'inline-flex': ['-webkit-inline-box', '-moz-inline-box', '-ms-inline-flexbox', '-webkit-inline-flex', 'inline-flex']
};

function flex(property, value) {
  if (property === 'display' && values$1.hasOwnProperty(value)) {
    return values$1[value];
  }
}

var alternativeValues = {
  'space-around': 'justify',
  'space-between': 'justify',
  'flex-start': 'start',
  'flex-end': 'end',
  'wrap-reverse': 'multiple',
  wrap: 'multiple'
};

var alternativeProps = {
  alignItems: 'WebkitBoxAlign',
  justifyContent: 'WebkitBoxPack',
  flexWrap: 'WebkitBoxLines',
  flexGrow: 'WebkitBoxFlex'
};

function flexboxOld(property, value, style) {
  if (property === 'flexDirection' && typeof value === 'string') {
    if (value.indexOf('column') > -1) {
      style.WebkitBoxOrient = 'vertical';
    } else {
      style.WebkitBoxOrient = 'horizontal';
    }
    if (value.indexOf('reverse') > -1) {
      style.WebkitBoxDirection = 'reverse';
    } else {
      style.WebkitBoxDirection = 'normal';
    }
  }
  if (alternativeProps.hasOwnProperty(property)) {
    style[alternativeProps[property]] = alternativeValues[value] || value;
  }
}

var prefixes$3 = ['-webkit-', '-moz-', ''];
var values$2 = /linear-gradient|radial-gradient|repeating-linear-gradient|repeating-radial-gradient/gi;

function gradient(property, value) {
  if (typeof value === 'string' && !isPrefixedValue(value) && values$2.test(value)) {
    return prefixes$3.map(function (prefix) {
      return value.replace(values$2, function (grad) {
        return prefix + grad;
      });
    });
  }
}

// http://caniuse.com/#feat=css-image-set
var prefixes$4 = ['-webkit-', ''];

function imageSet(property, value) {
  if (typeof value === 'string' && !isPrefixedValue(value) && value.indexOf('image-set(') > -1) {
    return prefixes$4.map(function (prefix) {
      return value.replace(/image-set\(/g, prefix + 'image-set(');
    });
  }
}

var alternativeProps$1 = {
  marginBlockStart: ['WebkitMarginBefore'],
  marginBlockEnd: ['WebkitMarginAfter'],
  marginInlineStart: ['WebkitMarginStart', 'MozMarginStart'],
  marginInlineEnd: ['WebkitMarginEnd', 'MozMarginEnd'],
  paddingBlockStart: ['WebkitPaddingBefore'],
  paddingBlockEnd: ['WebkitPaddingAfter'],
  paddingInlineStart: ['WebkitPaddingStart', 'MozPaddingStart'],
  paddingInlineEnd: ['WebkitPaddingEnd', 'MozPaddingEnd'],
  borderBlockStart: ['WebkitBorderBefore'],
  borderBlockStartColor: ['WebkitBorderBeforeColor'],
  borderBlockStartStyle: ['WebkitBorderBeforeStyle'],
  borderBlockStartWidth: ['WebkitBorderBeforeWidth'],
  borderBlockEnd: ['WebkitBorderAfter'],
  borderBlockEndColor: ['WebkitBorderAfterColor'],
  borderBlockEndStyle: ['WebkitBorderAfterStyle'],
  borderBlockEndWidth: ['WebkitBorderAfterWidth'],
  borderInlineStart: ['WebkitBorderStart', 'MozBorderStart'],
  borderInlineStartColor: ['WebkitBorderStartColor', 'MozBorderStartColor'],
  borderInlineStartStyle: ['WebkitBorderStartStyle', 'MozBorderStartStyle'],
  borderInlineStartWidth: ['WebkitBorderStartWidth', 'MozBorderStartWidth'],
  borderInlineEnd: ['WebkitBorderEnd', 'MozBorderEnd'],
  borderInlineEndColor: ['WebkitBorderEndColor', 'MozBorderEndColor'],
  borderInlineEndStyle: ['WebkitBorderEndStyle', 'MozBorderEndStyle'],
  borderInlineEndWidth: ['WebkitBorderEndWidth', 'MozBorderEndWidth']
};

function logical(property, value, style) {
  if (Object.prototype.hasOwnProperty.call(alternativeProps$1, property)) {
    var alternativePropList = alternativeProps$1[property];
    for (var i = 0, len = alternativePropList.length; i < len; ++i) {
      style[alternativePropList[i]] = value;
    }
  }
}

function position(property, value) {
  if (property === 'position' && value === 'sticky') {
    return ['-webkit-sticky', 'sticky'];
  }
}

var prefixes$5 = ['-webkit-', '-moz-', ''];

var properties = {
  maxHeight: true,
  maxWidth: true,
  width: true,
  height: true,
  columnWidth: true,
  minWidth: true,
  minHeight: true
};
var values$3 = {
  'min-content': true,
  'max-content': true,
  'fill-available': true,
  'fit-content': true,
  'contain-floats': true
};

function sizing(property, value) {
  if (properties.hasOwnProperty(property) && values$3.hasOwnProperty(value)) {
    return prefixes$5.map(function (prefix) {
      return prefix + value;
    });
  }
}

var hyphenateProperty_1$1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = hyphenateProperty;



var _hyphenateStyleName2 = _interopRequireDefault(hyphenateStyleName);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function hyphenateProperty(property) {
  return (0, _hyphenateStyleName2.default)(property);
}
module.exports = exports['default'];
});

var hyphenateProperty = unwrapExports(hyphenateProperty_1$1);

var properties$1 = {
  transition: true,
  transitionProperty: true,
  WebkitTransition: true,
  WebkitTransitionProperty: true,
  MozTransition: true,
  MozTransitionProperty: true
};

var prefixMapping = {
  Webkit: '-webkit-',
  Moz: '-moz-',
  ms: '-ms-'
};

function prefixValue$1(value, propertyPrefixMap) {
  if (isPrefixedValue(value)) {
    return value;
  }

  // only split multi values, not cubic beziers
  var multipleValues = value.split(/,(?![^()]*(?:\([^()]*\))?\))/g);

  for (var i = 0, len = multipleValues.length; i < len; ++i) {
    var singleValue = multipleValues[i];
    var values = [singleValue];
    for (var property in propertyPrefixMap) {
      var dashCaseProperty = hyphenateProperty(property);

      if (singleValue.indexOf(dashCaseProperty) > -1 && dashCaseProperty !== 'order') {
        var prefixes = propertyPrefixMap[property];
        for (var j = 0, pLen = prefixes.length; j < pLen; ++j) {
          // join all prefixes and create a new value
          values.unshift(singleValue.replace(dashCaseProperty, prefixMapping[prefixes[j]] + dashCaseProperty));
        }
      }
    }

    multipleValues[i] = values.join(',');
  }

  return multipleValues.join(',');
}

function transition(property, value, style, propertyPrefixMap) {
  // also check for already prefixed transitions
  if (typeof value === 'string' && properties$1.hasOwnProperty(property)) {
    var outputValue = prefixValue$1(value, propertyPrefixMap);
    // if the property is already prefixed
    var webkitOutput = outputValue.split(/,(?![^()]*(?:\([^()]*\))?\))/g).filter(function (val) {
      return !/-moz-|-ms-/.test(val);
    }).join(',');

    if (property.indexOf('Webkit') > -1) {
      return webkitOutput;
    }

    var mozOutput = outputValue.split(/,(?![^()]*(?:\([^()]*\))?\))/g).filter(function (val) {
      return !/-webkit-|-ms-/.test(val);
    }).join(',');

    if (property.indexOf('Moz') > -1) {
      return mozOutput;
    }

    style['Webkit' + capitalizeString(property)] = webkitOutput;
    style['Moz' + capitalizeString(property)] = mozOutput;
    return outputValue;
  }
}

var plugins = [backgroundClip, crossFade, cursor, filter, flexboxOld, gradient, imageSet, logical, position, sizing, transition, flex];

var prefix = createPrefixer({
  prefixMap: data.prefixMap,
  plugins: plugins
});

var resolveArrayValue_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = resolveArrayValue;



var _hyphenateProperty2 = _interopRequireDefault(hyphenateProperty_1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function resolveArrayValue(property, value) {
  var hyphenatedProperty = (0, _hyphenateProperty2.default)(property);

  return value.join(';' + hyphenatedProperty + ':');
}
module.exports = exports['default'];
});

var resolveArrayValue = unwrapExports(resolveArrayValue_1);

function resolveFallbackValues(style) {
  for (var property in style) {
    var value = style[property];

    if (Array.isArray(value)) {
      style[property] = resolveArrayValue(property, value);
    } else if (isobject(value) && property !== 'fontFace') {
      style[property] = resolveFallbackValues(value);
    }
  }

  return style;
}

var fallback = (function () {
  return resolveFallbackValues;
});

function _defineProperty$1(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var resolveFallbackValues$1 = fallback();

function addVendorPrefixes(style) {
  return objectReduce$1(style, function (prefixedStyle, value, property) {
    if (isobject(value)) {
      prefixedStyle[property] = addVendorPrefixes(value);
    } else {
      var prefixedDeclaration = prefix(_defineProperty$1({}, property, style[property]));
      var styleKeys = Object.keys(prefixedDeclaration);

      var referenceProperty = styleKeys[0];
      var referenceValue = prefixedDeclaration[referenceProperty];

      if (styleKeys.length === 1) {
        prefixedStyle[referenceProperty] = referenceValue;
      } else {
        delete prefixedDeclaration[referenceProperty];
        var inlinedProperties = cssifyObject(resolveFallbackValues$1(prefixedDeclaration));

        prefixedStyle[referenceProperty] = referenceValue + ';' + inlinedProperties;
      }
    }

    return prefixedStyle;
  }, {});
}

var prefixer = (function () {
  return addVendorPrefixes;
});

var isUnitlessProperty_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isUnitlessProperty;



var _hyphenateProperty2 = _interopRequireDefault(hyphenateProperty_1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var unitlessProperties = {
  borderImageOutset: true,
  borderImageSlice: true,
  borderImageWidth: true,
  fontWeight: true,
  lineHeight: true,
  opacity: true,
  orphans: true,
  tabSize: true,
  widows: true,
  zIndex: true,
  zoom: true,
  // SVG-related properties
  fillOpacity: true,
  floodOpacity: true,
  stopOpacity: true,
  strokeDasharray: true,
  strokeDashoffset: true,
  strokeMiterlimit: true,
  strokeOpacity: true,
  strokeWidth: true
};


var prefixedUnitlessProperties = ['animationIterationCount', 'boxFlex', 'boxFlexGroup', 'boxOrdinalGroup', 'columnCount', 'flex', 'flexGrow', 'flexPositive', 'flexShrink', 'flexNegative', 'flexOrder', 'gridRow', 'gridColumn', 'order', 'lineClamp'];

var prefixes = ['Webkit', 'ms', 'Moz', 'O'];

function getPrefixedProperty(prefix, property) {
  return prefix + property.charAt(0).toUpperCase() + property.slice(1);
}

// add all prefixed properties to the unitless properties
for (var i = 0, len = prefixedUnitlessProperties.length; i < len; ++i) {
  var property = prefixedUnitlessProperties[i];
  unitlessProperties[property] = true;

  for (var j = 0, jLen = prefixes.length; j < jLen; ++j) {
    unitlessProperties[getPrefixedProperty(prefixes[j], property)] = true;
  }
}

// add all hypenated properties as well
for (var _property in unitlessProperties) {
  unitlessProperties[(0, _hyphenateProperty2.default)(_property)] = true;
}

function isUnitlessProperty(property) {
  return unitlessProperties.hasOwnProperty(property);
}
module.exports = exports['default'];
});

var defaultIsUnitlessProperty = unwrapExports(isUnitlessProperty_1);

var _typeof$1 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function addUnitIfNeeded(property, value, propertyUnit) {
  var valueType = typeof value === 'undefined' ? 'undefined' : _typeof$1(value);
  /* eslint-disable eqeqeq */
  if ((valueType === 'number' || valueType === 'string' && value == parseFloat(value)) && value != 0) {
    value += propertyUnit;
  }
  /* eslint-enable */
  return value;
}

function addUnit(style, defaultUnit, propertyMap, isUnitlessProperty) {
  var _loop = function _loop(property) {
    if (!isUnitlessProperty(property)) {
      var cssValue = style[property];
      var propertyUnit = propertyMap[property] || defaultUnit;

      if (isobject(cssValue)) {
        style[property] = addUnit(cssValue, defaultUnit, propertyMap, isUnitlessProperty);
      } else if (Array.isArray(cssValue)) {
        style[property] = cssValue.map(function (val) {
          return addUnitIfNeeded(property, val, propertyUnit);
        });
      } else {
        style[property] = addUnitIfNeeded(property, cssValue, propertyUnit);
      }
    }
  };

  for (var property in style) {
    _loop(property);
  }

  return style;
}

function unit() {
  var defaultUnit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'px';
  var propertyMap = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var isUnitlessProperty = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultIsUnitlessProperty;

  return function (style) {
    return addUnit(style, defaultUnit, propertyMap, isUnitlessProperty);
  };
}

var isObject$2 = function (a) { return typeof a == 'object'; };
var emptyObject = Object.freeze({});
var isBrowser = (function () {
    try {
        return isObject$2(window);
    }
    catch (_a) {
        return false;
    }
})();
var defaultOpts = {
    method: 'f',
    defStyles: undefined,
    plugins: [],
    enhancers: [],
    preset: { unit: [] },
    ssr: false
};
var types = Object.freeze({ f: 'function', o: 'object', s: 'string' });
var getRules = (function () {
    var pickStyle = function (style, name) {
        return style[name] || style[camelify(name)];
    };
    var pickStyles = function (getDefStyle, style, names) {
        return names.split(/[,\s\t]+/g).map(function (name) {
            return pickStyle(style, name) || pickStyle(getDefStyle(), name) || emptyObject;
        });
    };
    return function (getDefStyle, style, propsOrRule) {
        if (!style) {
            style = emptyObject;
        }
        switch (typeof propsOrRule) {
            case types.f:
                return [propsOrRule];
            case types.o:
                return [always(propsOrRule)];
            case types.s:
                return pickStyles(getDefStyle, style, propsOrRule).reduce(function (accum, rule) {
                    accum.push.apply(accum, getRules(getDefStyle, style, rule));
                    return accum;
                }, []);
            default:
                return [identity];
        }
    };
})();
var Renderer = /** @class */ (function () {
    function Renderer(opts) {
        var _a, _b, _c, _d;
        if (opts === void 0) { opts = {}; }
        var _e = __assign(__assign({}, defaultOpts), opts), method = _e.method, ssr = _e.ssr, preset = _e.preset, plugins = _e.plugins, enhancers = _e.enhancers, miscRenderOpts = __rest(_e, ["method", "ssr", "preset", "plugins", "enhancers"]);
        var presetConfig = __assign(__assign({}, defaultOpts.preset), (preset || {}));
        if (opts.fdef) {
            throw new Error('fela-vue: Change deprecated `fdef` to `defStyles`!');
        }
        // Fela renderer creation. 
        this.renderer = createRenderer(__assign(__assign({}, miscRenderOpts), { enhancers: enhancers, plugins: __spreadArrays([
                embedded$1(),
                prefixer(),
                fallback(),
                unit.apply(void 0, presetConfig.unit)
            ], plugins) }));
        var renderer = this.renderer;
        // Default styles.
        var fdef = opts.defStyles;
        var fdefKey, fdefValue;
        switch (typeof fdef) {
            case types.o:
                _a = [fdef.key, fdef.value], fdefKey = _a[0], fdefValue = _a[1];
                break;
            case types.f:
                _b = ['fdef', fdef], fdefKey = _b[0], fdefValue = _b[1];
                break;
        }
        // Fela mounting.
        if (isBrowser) {
            if (ssr) {
                rehydrate(renderer);
            }
            else {
                render(renderer);
            }
        }
        // Mixin creation.
        this._mixin = {
            methods: (_c = {},
                _c[method] = function (propsOrRule, props) {
                    var _this = this;
                    if (props === void 0) { props = {}; }
                    return renderer.renderRule(combineRules.apply(void 0, getRules(memoize(function () { return fdefValue ? fdefValue(_this) : emptyObject; }), this.style, propsOrRule)), props) || undefined;
                },
                _c),
            computed: fdef ? (_d = {},
                _d[fdefKey] = function () {
                    return fdefValue(this);
                },
                _d) : {}
        };
    }
    Object.defineProperty(Renderer.prototype, "mixin", {
        get: function () {
            return Object.freeze(this._mixin);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Renderer.prototype, "style", {
        get: function () {
            return renderToMarkup(this.renderer);
        },
        enumerable: true,
        configurable: true
    });
    return Renderer;
}());

// NEEDED in Function constructor below !
var createFunctions = function (lines) {
    var out = [];
    var line, arrowI, selector, balance = 0, accum = [];
    var _loop_1 = function () {
        if (balance > 0) {
            switch (line) {
                case '{':
                    balance++;
                    break;
                case '}':
                    if (--balance == 1) {
                        var gen_1 = new Function('_css,$', "return _css`\n                " + accum.join('\n')
                            .replace(/\[(.*?)\]/g, function (_, expr) { return '${' + expr.replace(/\b([a-zA-Z]+)\b/g, '$$.$1') + '}'; }) + "\n              `");
                        out.push([
                            selector,
                            function ($) { return gen_1(css, $); }
                        ]);
                        balance = 0;
                        accum.splice(0);
                    }
                    break;
                default:
                    accum.push(line);
            }
        }
        else {
            arrowI = line.indexOf('=>');
            if (~arrowI) {
                balance = 1;
                selector = line.slice(0, arrowI).trim().replace(/^\./, '');
            }
            else {
                out.push(line);
            }
        }
    };
    for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
        line = lines_1[_i];
        _loop_1();
    }
    return out;
};

var parse = (function () {
    var delimiters = ['\n', '\r', ';'];
    var isDelimiter = function (s) { return delimiters.includes(s); };
    var commentRE = /(([\s^]+?\/\/.*$)|\/\*(.|[\n\r])*?\*\/)/gm;
    return function (css) {
        var levels = new Levels();
        var names = []; // selector names, class names.
        return compose(function () { return levels.out; }, forEach(function (line) {
            if (type(line) == 'Array') {
                levels.merge(line[0], line[1]);
            }
            else {
                line = line.trim();
                if (line) {
                    analyseLine(levels, line, names);
                }
                if (levels.depth < 1) {
                    throw new Error('lit-css parse error: unbalanced {} braces !');
                }
            }
        }), createFunctions, splitNonEscaped(delimiters), replace(/(\{|\})/g, function (_, brace, offset, full) {
            if (!isDelimiter(full[offset - 1])) {
                brace = ';' + brace;
            }
            if (!isDelimiter(full[offset + 1])) {
                brace += ';';
            }
            return brace;
        }), escape, replace(commentRE, ''))(css);
    };
})();

var css = (function () {
    return function (strings) {
        var values = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            values[_i - 1] = arguments[_i];
        }
        return parse(join(strings, values));
    };
})();

window.css = css;
