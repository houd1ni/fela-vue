const e=Symbol("Placeholder"),r=r=>{let t=0;for(const n of r)n!==e&&t++;return t},t=(r,t)=>{const n=r.length,s=r.slice(),c=t.length;let o=c,u=0;for(;o&&u<n;u++)s[u]===e&&(s[u]=t[c-o],o--);for(u=n;o;u++,o--)s[u]=t[c-o];return s},n=(e,s,c)=>{const o=e.length-s.length-r(c);if(o<1)return e(...t(s,c));{const r=(...r)=>n(e,t(s,c),r);return r.$args_left=o,r}},s=e=>(...t)=>e.length>r(t)?n(e,[],t):e(...t),c=r=>function(t){return t===e?r:r(t)};function o(r){return function(t,n){const s=t===e,o=arguments.length;if(1===o&&s)throw new Error("Senseless placeholder usage.");return arguments.length>1?s?c((e=>r(e,n))):r(t,n):e=>r(t,e)}}function u(e){return s(e)}const a=void 0,l=1/0,i$1=e=>typeof e,f=e=>null===e,h=e=>"number"==i$1(e),b=e=>Array.isArray(e),g=e=>"function"===i$1(e),p={u:"U",b:"B",n:"N",s:"S",f:"F"},j=e=>{const r=i$1(e);return "object"===r?f(e)?"Null":e.constructor.name:p[r[0]]+r.slice(1)},m$1=o(((e,r)=>(r.push(e),r))),O=u(((e,r,t)=>t.reduce(e,r))),A=u(((e,r,t)=>{for(let n in t)switch(j(t[n])){case"Array":if(e>1&&"Array"===j(r[n]))switch(e){case 2:const s=r[n],c=t[n];for(const r in c)s[r]?A(e,s[r],c[r]):s[r]=c[r];break;case 3:r[n].push(...t[n]);}else r[n]=t[n];break;case"Object":if("Object"===j(r[n])){A(e,r[n],t[n]);break}default:r[n]=t[n];}return r})),S=A(1);A(2);A(3);const $=o(((e,r)=>{const t=j(e);if(t===j(r)&&("Object"===t||"Array"==t)){if(f(e)||f(r))return e===r;if(e===r)return !0;for(const t of [e,r])for(const n in t)if(!(t===r&&n in e||t===e&&n in r&&$(e[n],r[n])))return !1;return !0}return e===r})),B=s(((e,r,t,n)=>e(n)?r(n):t(n))),E=u(((e,r,t)=>B(e,r,Q,t))),U=(...r)=>(t=Symbol())=>{for(let n=K(r)-1;n>-1;n--)t=t===e?r[n]():r[n](t);return t},F=o(((e,r)=>r[e])),L=u(((e,r,t)=>t.slice(e,h(r)?r:l))),q=F(0);L(1,l);const D=o(((e,r)=>e+r)),H=e=>s(((r,t)=>e(t,r))),J=e=>f(e)||(e=>e===a)(e),K=e=>e.length,M=e=>()=>e,Q=e=>e,R=e=>e.trim(),T=e=>e[K(e)-1],V=e=>!e,W=e=>(...r)=>{const t=e(...r);return g(t)&&t.$args_left?W(t):V(t)},Z=e=>Object.entries(e),he=e=>U((r=>ze(((t,n,s)=>m$1(e[r-s],t)),[],e)),D(-1),K)(e),Se=u(((e,r,t)=>({...t,[e]:r}))),Pe=o(((e,r)=>r[e])),Ee=u(((e,r,t)=>B(K,(()=>J(t)?e:U(B(J,M(e),(t=>Ee(e,L(1,l,r),t))),H(Pe)(t),q)(r)),M(t),r)));Ee(a);const Ie=/^(.*?)(8|16|32|64)(Clamped)?Array$/,Le=(e,r=!1)=>{const t=j(e);switch(t){case"Null":case"String":case"Number":case"Boolean":case"Symbol":return e;case"Array":return r?[...e]:Qe(Le,e);case"Object":if(r)return {...e};const n={};for(let r in e)n[r]=Le(e[r]);return n;default:return Ie.test(t)?e.constructor.from(e):e}},ze=u(((e,r,t)=>O(e,Le(r),t))),Je=e=>ze(((e,r)=>Se(...r,e)),{},e),Me=o(((e,r)=>r.join(e))),Qe=o(((e,r)=>r.map(e))),Re=o(((e,r)=>r.forEach(e))),Te=u(((e,r,t)=>r(t)&&e(t))),Ve=e=>{switch(j(e)){case"String":case"Array":return 0==K(e);case"Object":for(const r in e)return !1;return !0;default:return null}},Xe=u(((e,r,t)=>t.replace(e,r))),Ye=o(((e,r)=>b(r)?r.filter(e):U(Je,Ye((([r,t])=>e(t,r))),Z)(r)));

const emptyObject = Object.freeze({});
const types = Object.freeze({ f: 'function', o: 'object', s: 'string' });
const camelify = (str) => str.replace(/-(\w)/gu, (_s, l) => l.toUpperCase());
const memoize = (fn) => {
    let cache;
    let cached = false;
    return () => cached ? cache : (cached = true, cache = fn());
};
const splitNonEscaped = (delims) => (str) => {
    const delims_lns = Qe(K, delims);
    const out = [];
    let i, j, last_index = 0, delims_count = delims.length, str_len = str.length;
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
};
const escape = (() => {
    const patternRE = /url\(.*?\)/g;
    const signsRE = /[,:;]/g;
    return (v) => v.replace(patternRE, (v) => v.replace(signsRE, (s) => `\\${s}`));
})();
const unescape = E(W(J), Xe(/([^\\])\\([^\\])/g, '$1$2'));
const valuable = Te(W(Ve), W(J));
const join = (strings, values) => strings.reduce((accum, str, i) => accum + str + (values.length > i ? values[i] : ''), '');
U($('Object'), j);
const isWindow = U($('Window'), j);
const tryNamedFn = (rule, name, useNamed) => {
    if (useNamed && name && name !== 'anonymous') {
        const tmpObj = {
            [name]: (props, renderer) => rule(props, renderer)
        };
        return tmpObj[name];
    }
    else
        return rule;
};
const isBrowser = (() => {
    try {
        return isWindow(window);
    }
    catch {
        return false;
    }
})();
const tryUnwrap = Qe(B(U($('Function'), j), Q, Pe('default')));
const callWith = (args, i, fn) => fn(...(args[i] || []));
const preparePlugins = (plugins, args) => U(Qe(([i, p]) => callWith(args, i, p)), Z, tryUnwrap)(plugins);

class Selector {
    s;
    rules = {};
    // @ts-disable-next it is being read in Selector.isSelector()
    __selector__ = true;
    get complex() {
        return this.s.className !== null && this.s.modifier !== null;
    }
    static isSelector(x) {
        return Boolean(x && x.__selector__);
    }
    serialize() {
        const { className, modifier } = this.s;
        return (className ? `.${className}` : '') + (modifier || '');
    }
    findClass(name, s = this) {
        if (s.s.className === name)
            return s;
        else
            for (const ruleName in s.rules) {
                const rule = s.rules[ruleName];
                if (Selector.isSelector(rule)) {
                    const res = rule.findClass(name);
                    if (res)
                        return res;
                }
            }
        return null;
    }
    constructor(selector) {
        const cls = selector.match(/^\.[\w-_]+/);
        this.s = {
            className: cls ? cls[0].slice(1) : null,
            modifier: cls ? selector.slice(cls[0].length) || null : selector
        };
    }
}

const extractRules = (s, depth = 0) => {
    const o = {};
    let tmp, full, key, newRules, k;
    for (k in s.rules) {
        tmp = s.rules[k];
        if (Selector.isSelector(tmp)) {
            tmp = tmp; // will get erased by minifier.
            full = tmp.complex ? tmp.s.className : tmp.serialize();
            key = (depth == 0 && full[0] == '.')
                ? full.slice(1)
                : full[0] == '.' ? `& ${full}` : full;
            newRules = tmp.complex
                ? { [tmp.s.modifier]: extractRules(tmp, depth + 1) }
                : extractRules(tmp, depth + 1);
            if (o[key])
                S(o[key], newRules);
            else
                o[key] = newRules;
        }
        else
            o[k] = tmp;
    }
    return o;
};
/** Keeps the structure of CSS to navigate and change the tree. */
class Levels {
    path = [];
    get out() {
        return extractRules(this.path[0][0]);
    }
    get depth() {
        return this.path.length;
    }
    add(selectors) {
        const curSelectors = T(this.path);
        const newCurs = [];
        for (const rawSel of selectors) {
            const sel = new Selector(rawSel);
            for (const curSel of curSelectors) {
                const fullSelector = sel.serialize();
                const old = curSel.rules[fullSelector];
                newCurs.push(old || sel);
                if (!old) {
                    curSel.rules[fullSelector] = sel;
                }
            }
        }
        this.path.push(newCurs);
    }
    merge(k, v) {
        if (valuable(v) && valuable(k)) {
            for (const o of T(this.path)) {
                o.rules[k] = v;
            }
        }
    }
    findClass(name) {
        for (const group of this.path)
            for (const s of group) {
                const res = s.findClass(name);
                if (res)
                    return res;
            }
        return null;
    }
    pop() {
        return this.path.pop();
    }
    constructor() {
        this.path.push([new Selector('__root')]);
    }
}

const rules = `
margin margin-left display padding left top color margin-top justify-content
border width height border-radius background bottom position align-items
center bottom top absolute relative float right opacity z-index min-width
margin-top margin-bottom min-height border-top border-bottom filter
transition-duration max-height overflow transform
`.replace(/\s+/g, ',').split(/[, ]/g).filter(Boolean);
// TODO: use generator from wspomisify.
let i = 0;
const compressRule = () => `a${i++}`;
const getDics = (pepka) => {
    i = 0;
    const { compose, fromPairs, map, reverse, toPairs } = pepka;
    const dic = compose(fromPairs, map((rule) => [rule, compressRule()]))(rules);
    const dicRev = compose(fromPairs, map(reverse), toPairs)(dic);
    return { dic, dicRev };
};

let compression = false;
const setCompression = (to) => compression = to;
const dics = getDics({ compose: U, fromPairs: Je, map: Qe, reverse: he, toPairs: Z });
const analyseLine = (() => {
    const ruleRE = /^([\w-]+)(: *| +)(.*)$/;
    const selectorRE = /^(([\|~\$@>\*\.:&\(\)\^="\-\[\]]+).*[ ,]*)+:?$/;
    const spreadRE = /\.\.\.(\S*)$/;
    const delimRE = /\s*,\s*/g;
    const trailingColonRE = /(.*):$/;
    const decompress = E(() => compression, (s) => dics.dicRev[s] || s);
    const getValue = (value) => {
        switch (value) {
            case 'undefined':
            case '': return undefined;
            case 'null': return null;
            default: return isNaN(+value) ? value : +value;
        }
    };
    return (levels, line, names) => {
        let groups;
        switch (true) {
            case line == '{':
                levels.add(names);
                break;
            case line == '}':
                levels.pop();
                break;
            case (groups = spreadRE.exec(line)) !== null:
                const cls = levels.findClass(groups[1]);
                if (cls)
                    for (const name in cls.rules)
                        levels.merge(name, cls.rules[name]);
                break;
            case (groups = ruleRE.exec(line)) !== null:
                levels.merge(unescape(camelify(decompress(groups[1]))), E(isNaN, unescape, getValue(decompress(groups[3]))));
                break;
            case (groups = selectorRE.exec(line)) !== null:
                names.splice(0);
                names.push(...line.split(delimRE).map((selector) => selector.replace(trailingColonRE, '$1')));
                break;
        }
    };
})();

function getAugmentedNamespace(n) {
  var f = n.default;
	if (typeof f == "function") {
		var a = function a () {
			if (this instanceof a) {
				var args = [null];
				args.push.apply(args, arguments);
				var Ctor = Function.bind.apply(f, args);
				return new Ctor();
			}
			return f.apply(this, arguments);
		};
		a.prototype = f.prototype;
  } else a = {};
  Object.defineProperty(a, '__esModule', {value: true});
	Object.keys(n).forEach(function (k) {
		var d = Object.getOwnPropertyDescriptor(n, k);
		Object.defineProperty(a, k, d.get ? d : {
			enumerable: true,
			get: function () {
				return n[k];
			}
		});
	});
	return a;
}

var cssifyDeclaration$1 = {exports: {}};

var hyphenateProperty$2 = {exports: {}};

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

var hyphenateStyleName$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: hyphenateStyleName
});

var require$$0 = /*@__PURE__*/getAugmentedNamespace(hyphenateStyleName$1);

(function (module, exports) {

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = hyphenateProperty;

	var _hyphenateStyleName = require$$0;

	var _hyphenateStyleName2 = _interopRequireDefault(_hyphenateStyleName);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function hyphenateProperty(property) {
	  return (0, _hyphenateStyleName2.default)(property);
	}
	module.exports = exports['default'];
} (hyphenateProperty$2, hyphenateProperty$2.exports));

hyphenateProperty$2.exports.default;

(function (module, exports) {

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = cssifyDeclaration;

	var _hyphenateProperty = hyphenateProperty$2.exports;

	var _hyphenateProperty2 = _interopRequireDefault(_hyphenateProperty);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function cssifyDeclaration(property, value) {
	  return (0, _hyphenateProperty2.default)(property) + ':' + value;
	}
	module.exports = exports['default'];
} (cssifyDeclaration$1, cssifyDeclaration$1.exports));

var cssifyDeclaration = cssifyDeclaration$1.exports.default;

var arrayEach$3 = {};

Object.defineProperty(arrayEach$3, "__esModule", {
  value: true
});
var _default$3 = arrayEach$3.default = arrayEach$2;
function arrayEach$2(arr, iterator) {
  for (var i = 0, len = arr.length; i < len; ++i) {
    iterator(arr[i], i, len, arr);
  }
}

var isobject = {exports: {}};

/*!
 * isobject <https://github.com/jonschlinkert/isobject>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

(function (module) {

	module.exports = function isObject(val) {
	  return val != null && typeof val === 'object' && Array.isArray(val) === false;
	};
} (isobject));

var isPlainObject = isobject.exports.default;

var arrayReduce$4 = {};

Object.defineProperty(arrayReduce$4, "__esModule", {
  value: true
});
var _default$2 = arrayReduce$4.default = arrayReduce$3;
function arrayReduce$3(arr, reducer, initialValue) {
  for (var i = 0, len = arr.length; i < len; ++i) {
    initialValue = reducer(initialValue, arr[i], i, len, arr);
  }

  return initialValue;
}

function applyKeysInOrder(order) {
  var initialValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  return _default$2(order, function (mediaMap, query) {
    mediaMap[query] = initialValue;
    return mediaMap;
  }, {});
}

var objectReduce$2 = {};

Object.defineProperty(objectReduce$2, "__esModule", {
  value: true
});
var _default$1 = objectReduce$2.default = objectReducer$1;
function objectReducer$1(obj, reducer, initialValue) {
  for (var key in obj) {
    initialValue = reducer(initialValue, obj[key], key, obj);
  }

  return initialValue;
}

function generateCSSRule(selector, cssDeclaration) {
  return selector + "{" + cssDeclaration + "}";
}

function _toConsumableArray$2(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function insertAtIndex(arr, el, index) {
  return [].concat(_toConsumableArray$2(arr.slice(0, index)), [el], _toConsumableArray$2(arr.slice(index, arr.length)));
}

function _toConsumableArray$1(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// TODO: we can further improve this one
function objectSortByScore(obj, getScore) {
  var sortedKeys = _default$1(obj, function (resultSortedKeys, value, key) {
    var index = resultSortedKeys.findIndex(function (el) {
      return getScore(obj[el], el) > getScore(value, key);
    });

    if (index !== -1) {
      return insertAtIndex(resultSortedKeys, key, index);
    }

    return [].concat(_toConsumableArray$1(resultSortedKeys), [key]);
  }, []);

  return _default$2(sortedKeys, function (sortedObj, key) {
    sortedObj[key] = obj[key];
    return sortedObj;
  }, {});
}

function getRuleScore$1() {
  var ruleOrder = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var pseudo = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  if (ruleOrder.length === 0 || pseudo.length === 0) {
    return 0;
  }

  return ruleOrder.indexOf(ruleOrder.find(function (regex) {
    return pseudo.match(regex) !== null;
  })) + 1;
}

var RULE_TYPE$1 = 'RULE';
var KEYFRAME_TYPE = 'KEYFRAME';
var FONT_TYPE = 'FONT';
var STATIC_TYPE = 'STATIC';
var CLEAR_TYPE = 'CLEAR';

var _handlers;

function _defineProperty$2(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var handlers = (_handlers = {}, _defineProperty$2(_handlers, RULE_TYPE$1, function (cluster, _ref) {
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
}), _defineProperty$2(_handlers, FONT_TYPE, function (cluster, _ref2) {
  var fontFace = _ref2.fontFace;

  cluster.fontFaces += fontFace;
}), _defineProperty$2(_handlers, KEYFRAME_TYPE, function (cluster, _ref3) {
  var keyframe = _ref3.keyframe;

  cluster.keyframes += keyframe;
}), _defineProperty$2(_handlers, STATIC_TYPE, function (cluster, _ref4) {
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
    return getRuleScore$1(ruleOrder, value.pseudo);
  });

  var mediaRules = applyKeysInOrder(mediaQueryOrder);
  var supportRules = applyKeysInOrder(supportQueryOrder);

  var supportMediaRules = _default$2(mediaQueryOrder, function (resultSupportRules, media) {
    resultSupportRules[media] = applyKeysInOrder(supportQueryOrder);
    return resultSupportRules;
  }, applyKeysInOrder(mediaQueryOrder, {}));

  return _default$1(sortedCache, function (cluster, entry) {
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
  return _default$1(supportRules, function (css, cssRules, support) {
    if (cssRules.length > 0) {
      css += generateCSSSupportRule(support, cssRules);
    }

    return css;
  }, '');
}

function generateCombinedMediaQuery$1(currentMediaQuery, nestedMediaQuery) {
  if (currentMediaQuery.length === 0) {
    return nestedMediaQuery;
  }

  return currentMediaQuery + " and " + nestedMediaQuery;
}

function generateCSSSelector$1(className) {
  var pseudo = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  return '.' + className + pseudo;
}

function isMediaQuery$1(property) {
  return property.substr(0, 6) === '@media';
}

var regex$1 = /^(:|\[|>|&)/;

function isNestedSelector$1(property) {
  return regex$1.test(property);
}

function isSupport$1(property) {
  return property.substr(0, 9) === '@supports';
}

function isUndefinedValue$1(value) {
  return value === undefined || value === null || typeof value === 'string' && value.match(/(undefined|null)/) !== null;
}

function normalizeNestedProperty$1(nestedProperty) {
  if (nestedProperty.charAt(0) === '&') {
    return nestedProperty.slice(1);
  }

  return nestedProperty;
}

function processStyleWithPlugins$1(renderer, style, type) {
  var props = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  if (renderer.plugins.length > 0) {
    return _default$2(renderer.plugins, function (processedStyle, plugin) {
      return plugin(processedStyle, type, renderer, props);
    }, style);
  }

  return style;
}

var sheetMap = {
  fontFaces: FONT_TYPE,
  statics: STATIC_TYPE,
  keyframes: KEYFRAME_TYPE,
  rules: RULE_TYPE$1
};

var cssifyObject$1 = {exports: {}};

(function (module, exports) {

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = cssifyObject;

	var _cssifyDeclaration = cssifyDeclaration$1.exports;

	var _cssifyDeclaration2 = _interopRequireDefault(_cssifyDeclaration);

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
} (cssifyObject$1, cssifyObject$1.exports));

var cssifyObject = cssifyObject$1.exports.default;

function cssifyFontFace(fontFace) {
  return '@font-face{' + cssifyObject(fontFace) + '}';
}

function cssifyKeyframe(frames, animationName) {
  var prefixes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [''];

  var keyframe = _default$1(frames, function (css, frame, percentage) {
    return '' + css + percentage + '{' + cssifyObject(frame) + '}';
  }, '');

  return _default$2(prefixes, function (cssKeyframe, prefix) {
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

  var processedStaticStyle = processStyleWithPlugins$1(renderer, staticStyle, STATIC_TYPE);

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

  var localSource = _default$2(fontLocals, function (src, local) {
    var localUrl = getFontUrl(local);
    return '{src} local(' + localUrl + '), ';
  }, '');

  return _default$2(files, function (src, fileSource, index) {
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

var _extends$2 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties$2(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

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

        var processedKeyframe = processStyleWithPlugins$1(renderer, resolvedKeyframe, KEYFRAME_TYPE, props);

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
          otherProperties = _objectWithoutProperties$2(properties, ['localAlias']);

      var fontReference = family + JSON.stringify(properties);
      var fontLocals = getFontLocals(localAlias);

      if (!renderer.cache.hasOwnProperty(fontReference)) {
        var fontFamily = toCSSString(family);

        var fontFace = _extends$2({}, otherProperties, {
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

      var processedStyle = processStyleWithPlugins$1(renderer, style, RULE_TYPE$1, props);

      return renderer._renderStyleToClassNames(processedStyle).slice(1);
    },
    _renderStyleToClassNames: function _renderStyleToClassNames(_ref) {
      var pseudo = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      var media = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
      var support = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';

      var _className = _ref._className,
          style = _objectWithoutProperties$2(_ref, ['_className']);

      var classNames = _className ? ' ' + _className : '';

      for (var property in style) {
        var value = style[property];

        if (isPlainObject(value)) {
          if (isNestedSelector$1(property)) {
            classNames += renderer._renderStyleToClassNames(value, pseudo + normalizeNestedProperty$1(property), media, support);
          } else if (isMediaQuery$1(property)) {
            var combinedMediaQuery = generateCombinedMediaQuery$1(media, property.slice(6).trim());
            classNames += renderer._renderStyleToClassNames(value, pseudo, combinedMediaQuery, support);
          } else if (isSupport$1(property)) {
            var combinedSupport = generateCombinedMediaQuery$1(support, property.slice(9).trim());
            classNames += renderer._renderStyleToClassNames(value, pseudo, media, combinedSupport);
          } else {
            console.warn('The object key "' + property + '" is not a valid nested key in Fela. \nMaybe you forgot to add a plugin to resolve it? \nCheck http://fela.js.org/docs/basics/Rules.html#styleobject for more information.');
          }
        } else {
          var declarationReference = support + media + pseudo + property + value;

          if (!renderer.cache.hasOwnProperty(declarationReference)) {
            // we remove undefined values to enable
            // usage of optional props without side-effects
            if (isUndefinedValue$1(value)) {
              renderer.cache[declarationReference] = {
                className: ''
                /* eslint-disable no-continue */
              };continue;
              /* eslint-enable */
            }

            var className = renderer.selectorPrefix + generateClassName(renderer.getNextRuleIdentifier, renderer.filterClassName);

            var declaration = cssifyDeclaration(property, value);
            var selector = generateCSSSelector$1(className, pseudo);

            var change = {
              type: RULE_TYPE$1,
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
      _default$3(renderer.listeners, function (listener) {
        return listener(change);
      });
    }
  };

  // initial setup
  renderer.keyframePrefixes.push('');

  if (config.enhancers) {
    _default$3(config.enhancers, function (enhancer) {
      renderer = enhancer(renderer);
    });
  }

  return renderer;
}

var assignStyle$1 = {exports: {}};

(function (module, exports) {

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
} (assignStyle$1, assignStyle$1.exports));

var assignStyle = assignStyle$1.exports.default;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function resolveRule(rule, props, renderer) {
  if (Array.isArray(rule)) {
    return resolveRule(combineRules.apply(undefined, _toConsumableArray(rule)), props, renderer);
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
    return _default$2(rules, function (style, rule) {
      return assignStyle(style, resolveRule(rule, props, renderer));
    }, {});
  };
}

var objectEach$3 = {};

Object.defineProperty(objectEach$3, "__esModule", {
  value: true
});
var _default = objectEach$3.default = objectEach$2;
function objectEach$2(obj, iterator) {
  for (var key in obj) {
    iterator(obj[key], key, obj);
  }
}

function getRuleScore(baseScore) {
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
    case RULE_TYPE$1:
      return getRuleScore(support ? 4 : 3, media, mediaQueryOrder);
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
  var moreSpecificReference = _default$1(nodes, function (closest, currentNode, reference) {
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

  var sheetList = _default$1(sheetMap, function (list, type, key) {
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
      type: RULE_TYPE$1,
      rehydration: rehydrationIndex,
      support: true
    });
  }

  var mediaKeys = Object.keys(_extends$1({}, cacheCluster.supportMediaRules, cacheCluster.mediaRules));

  return _default$2(mediaKeys, function (list, media) {
    // basic media query rules
    if (cacheCluster.mediaRules[media] && cacheCluster.mediaRules[media].length > 0) {
      list.push({
        css: cacheCluster.mediaRules[media],
        type: RULE_TYPE$1,
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
          type: RULE_TYPE$1,
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
    return sheet.type === RULE_TYPE$1 && sheet.media === media && sheet.support === support;
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
    var score = getRuleScore$1(renderer.ruleOrder, pseudo);
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
      _default(renderer.nodes, function (_ref) {
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
      case RULE_TYPE$1:
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
    _default(renderer.cache, renderer._emitChange);
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
    selector: generateCSSSelector$1(className, pseudo),
    declaration: property + ':' + value,
    pseudo: pseudo,
    media: media,
    support: support
  };
}

var camelCaseProperty$1 = {exports: {}};

(function (module, exports) {

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
} (camelCaseProperty$1, camelCaseProperty$1.exports));

var camelCaseProperty = camelCaseProperty$1.exports.default;

function generateDeclarationReference(property, value) {
  var pseudo = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var media = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
  var support = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '';

  return support + media + pseudo + camelCaseProperty(property) + value;
}

var _slicedToArray$1 = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

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
        _decl2 = _slicedToArray$1(_decl, 5);
        _decl2[0];
        var className = _decl2[1],
        pseudo = _decl2[2],
        property = _decl2[3],
        value = _decl2[4];
    /* eslint-enable */

    var declarationReference = generateDeclarationReference(property, value, pseudo, media, support);

    cache[declarationReference] = generateCacheEntry(RULE_TYPE$1, className, property, value, pseudo, media, support);
  }

  return cache;
}

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var SUPPORT_REGEX = /@supports[^{]+\{([\s\S]+?})\s*}/gi;

function rehydrateSupportRules(css) {
  var media = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var cache = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var decl = void 0;

  // eslint-disable-next-line no-cond-assign
  while (decl = SUPPORT_REGEX.exec(css)) {
    var _decl = decl,
        _decl2 = _slicedToArray(_decl, 2),
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

  _default$3(document.querySelectorAll('[data-fela-type]' + idQuery), function (node) {
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

      if (type === RULE_TYPE$1) {
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

          _default$3(node.sheet.cssRules, function (rule, index) {
            var selectorText = rule.conditionText ? rule.cssRules[0].selectorText : rule.selectorText;

            var score = getRuleScore$1(renderer.ruleOrder, selectorText.split(CLASSNAME_REGEX)[1]);

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

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function renderToMarkup(renderer) {
  var cacheCluster = clusterCache(renderer.cache, renderer.mediaQueryOrder, renderer.supportQueryOrder, renderer.ruleOrder);

  var rehydrationIndex = getRehydrationIndex(renderer);

  var styleMarkup = _default$1(sheetMap, function (markup, type, key) {
    if (cacheCluster[key].length > 0) {
      markup += createStyleTagMarkup(cacheCluster[key], type, renderer.rendererId, '', rehydrationIndex);
    }

    return markup;
  }, '');

  var support = cssifySupportRules(cacheCluster.supportRules);

  if (support) {
    styleMarkup += createStyleTagMarkup(support, RULE_TYPE$1, renderer.rendererId, '', rehydrationIndex, true);
  }

  var mediaKeys = Object.keys(_extends({}, cacheCluster.supportMediaRules, cacheCluster.mediaRules));

  return _default$2(mediaKeys, function (markup, media) {
    // basic media query rules
    if (cacheCluster.mediaRules[media] && cacheCluster.mediaRules[media].length > 0) {
      markup += createStyleTagMarkup(cacheCluster.mediaRules[media], RULE_TYPE$1, renderer.rendererId, media, rehydrationIndex);
    }

    // support media rules
    if (cacheCluster.supportMediaRules[media]) {
      var mediaSupport = cssifySupportRules(cacheCluster.supportMediaRules[media]);

      if (mediaSupport.length > 0) {
        markup += createStyleTagMarkup(mediaSupport, RULE_TYPE$1, renderer.rendererId, media, rehydrationIndex, true);
      }
    }

    return markup;
  }, styleMarkup);
}

var _typeof$2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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

    if (property === 'fontFace' && (typeof value === 'undefined' ? 'undefined' : _typeof$2(value)) === 'object') {
      if (Array.isArray(value)) {
        style.fontFamily = _default$2(value, function (fontFamilyList, fontFace) {
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
    } else if (property === 'animationName' && (typeof value === 'undefined' ? 'undefined' : _typeof$2(value)) === 'object') {
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
    } else if (isPlainObject(value)) {
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

function prefixValue$1(plugins, property, value, style, metaData) {
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

function isObject(value) {
  return value instanceof Object && !Array.isArray(value);
}

function createPrefixer(_ref) {
  var prefixMap = _ref.prefixMap,
      plugins = _ref.plugins;

  return function prefix(style) {
    for (var property in style) {
      var value = style[property];

      // handle nested objects
      if (isObject(value)) {
        style[property] = prefix(value);
        // handle array values
      } else if (Array.isArray(value)) {
        var combinedValue = [];

        for (var i = 0, len = value.length; i < len; ++i) {
          var processedValue = prefixValue$1(plugins, property, value[i], style, prefixMap);
          addNewValuesOnly(combinedValue, processedValue || value[i]);
        }

        // only modify the value if it was touched
        // by any plugin to prevent unnecessary mutations
        if (combinedValue.length > 0) {
          style[property] = combinedValue;
        }
      } else {
        var _processedValue = prefixValue$1(plugins, property, value, style, prefixMap);

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

var prefixes$5 = ['-webkit-', '-moz-', ''];

var values$3 = {
  'zoom-in': true,
  'zoom-out': true,
  grab: true,
  grabbing: true
};

function cursor(property, value) {
  if (property === 'cursor' && values$3.hasOwnProperty(value)) {
    return prefixes$5.map(function (prefix) {
      return prefix + value;
    });
  }
}

var isPrefixedValue$2 = {exports: {}};

(function (module, exports) {

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = isPrefixedValue;
	var regex = /-webkit-|-moz-|-ms-/;

	function isPrefixedValue(value) {
	  return typeof value === 'string' && regex.test(value);
	}
	module.exports = exports['default'];
} (isPrefixedValue$2, isPrefixedValue$2.exports));

var isPrefixedValue$1 = isPrefixedValue$2.exports.default;

// http://caniuse.com/#search=cross-fade
var prefixes$4 = ['-webkit-', ''];

function crossFade(property, value) {
  if (typeof value === 'string' && !isPrefixedValue$1(value) && value.indexOf('cross-fade(') > -1) {
    return prefixes$4.map(function (prefix) {
      return value.replace(/cross-fade\(/g, prefix + 'cross-fade(');
    });
  }
}

// http://caniuse.com/#feat=css-filter-function
var prefixes$3 = ['-webkit-', ''];

function filter(property, value) {
  if (typeof value === 'string' && !isPrefixedValue$1(value) && value.indexOf('filter(') > -1) {
    return prefixes$3.map(function (prefix) {
      return value.replace(/filter\(/g, prefix + 'filter(');
    });
  }
}

var values$2 = {
  flex: ['-webkit-box', '-moz-box', '-ms-flexbox', '-webkit-flex', 'flex'],
  'inline-flex': ['-webkit-inline-box', '-moz-inline-box', '-ms-inline-flexbox', '-webkit-inline-flex', 'inline-flex']
};

function flex(property, value) {
  if (property === 'display' && values$2.hasOwnProperty(value)) {
    return values$2[value];
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

var alternativeProps$1 = {
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
  if (alternativeProps$1.hasOwnProperty(property)) {
    style[alternativeProps$1[property]] = alternativeValues[value] || value;
  }
}

var prefixes$2 = ['-webkit-', '-moz-', ''];
var values$1 = /linear-gradient|radial-gradient|repeating-linear-gradient|repeating-radial-gradient/gi;

function gradient(property, value) {
  if (typeof value === 'string' && !isPrefixedValue$1(value) && values$1.test(value)) {
    return prefixes$2.map(function (prefix) {
      return value.replace(values$1, function (grad) {
        return prefix + grad;
      });
    });
  }
}

// http://caniuse.com/#feat=css-image-set
var prefixes$1 = ['-webkit-', ''];

function imageSet(property, value) {
  if (typeof value === 'string' && !isPrefixedValue$1(value) && value.indexOf('image-set(') > -1) {
    return prefixes$1.map(function (prefix) {
      return value.replace(/image-set\(/g, prefix + 'image-set(');
    });
  }
}

var alternativeProps = {
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
  if (Object.prototype.hasOwnProperty.call(alternativeProps, property)) {
    var alternativePropList = alternativeProps[property];
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

var prefixes = ['-webkit-', '-moz-', ''];

var properties$1 = {
  maxHeight: true,
  maxWidth: true,
  width: true,
  height: true,
  columnWidth: true,
  minWidth: true,
  minHeight: true
};
var values = {
  'min-content': true,
  'max-content': true,
  'fill-available': true,
  'fit-content': true,
  'contain-floats': true
};

function sizing(property, value) {
  if (properties$1.hasOwnProperty(property) && values.hasOwnProperty(value)) {
    return prefixes.map(function (prefix) {
      return prefix + value;
    });
  }
}

var hyphenateProperty$1 = {exports: {}};

(function (module, exports) {

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = hyphenateProperty;

	var _hyphenateStyleName = require$$0;

	var _hyphenateStyleName2 = _interopRequireDefault(_hyphenateStyleName);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function hyphenateProperty(property) {
	  return (0, _hyphenateStyleName2.default)(property);
	}
	module.exports = exports['default'];
} (hyphenateProperty$1, hyphenateProperty$1.exports));

var hyphenateProperty = hyphenateProperty$1.exports.default;

var properties = {
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

function prefixValue(value, propertyPrefixMap) {
  if (isPrefixedValue$1(value)) {
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
  if (typeof value === 'string' && properties.hasOwnProperty(property)) {
    var outputValue = prefixValue(value, propertyPrefixMap);
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

var resolveArrayValue$1 = {exports: {}};

(function (module, exports) {

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = resolveArrayValue;

	var _hyphenateProperty = hyphenateProperty$2.exports;

	var _hyphenateProperty2 = _interopRequireDefault(_hyphenateProperty);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function resolveArrayValue(property, value) {
	  var hyphenatedProperty = (0, _hyphenateProperty2.default)(property);

	  return value.join(';' + hyphenatedProperty + ':');
	}
	module.exports = exports['default'];
} (resolveArrayValue$1, resolveArrayValue$1.exports));

var resolveArrayValue = resolveArrayValue$1.exports.default;

function resolveFallbackValues$1(style) {
  for (var property in style) {
    var value = style[property];

    if (Array.isArray(value)) {
      style[property] = resolveArrayValue(property, value);
    } else if (isPlainObject(value) && property !== 'fontFace') {
      style[property] = resolveFallbackValues$1(value);
    }
  }

  return style;
}

var fallback = (function () {
  return resolveFallbackValues$1;
});

function _defineProperty$1(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var resolveFallbackValues = fallback();

function addVendorPrefixes(style) {
  return _default$1(style, function (prefixedStyle, value, property) {
    if (isPlainObject(value)) {
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
        var inlinedProperties = cssifyObject(resolveFallbackValues(prefixedDeclaration));

        prefixedStyle[referenceProperty] = referenceValue + ';' + inlinedProperties;
      }
    }

    return prefixedStyle;
  }, {});
}

var prefixer = (function () {
  return addVendorPrefixes;
});

var isUnitlessProperty = {exports: {}};

(function (module, exports) {

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = isUnitlessProperty;

	var _hyphenateProperty = hyphenateProperty$2.exports;

	var _hyphenateProperty2 = _interopRequireDefault(_hyphenateProperty);

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
} (isUnitlessProperty, isUnitlessProperty.exports));

var defaultIsUnitlessProperty = isUnitlessProperty.exports.default;

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

      if (isPlainObject(cssValue)) {
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

const pickStyle = (style, name) => {
    return style[name] || style[camelify(name)];
};
const pickStyles = (getDefStyle, style, names) => names.split(/[,\s\t]+/g).map((name) => [
    name,
    pickStyle(style, name) || pickStyle(getDefStyle(), name) || emptyObject
]);
const getRules = (getDefStyle, style, propsOrRule, context) => {
    if (!style) {
        style = emptyObject;
    }
    switch (typeof propsOrRule) {
        case types.f:
            return [
                propsOrRule.name,
                [(props) => propsOrRule(props, context)]
            ];
        case types.o:
            return [propsOrRule.className, [M(propsOrRule)]];
        case types.s:
            const styles = pickStyles(getDefStyle, style, propsOrRule);
            const names = [];
            const rules = [];
            for (const [name, rule] of styles) {
                names.push(name);
                rules.push(...getRules(getDefStyle, style, rule, context)[1]);
            }
            return [names.join('_'), rules];
        default:
            return ['', [Q]];
    }
};

const mergeProps = (defaults, opts = {}) => U(Je, Qe(([k, v]) => {
    switch (j(v)) {
        case 'Array': return [k, [...v, ...(opts[k] || [])]];
        case 'Object': return [k, { ...v, ...(opts[k] || {}) }];
        default: return [k, opts[k] || v];
    }
}), Z)(defaults);
const defaultOpts = {
    method: 'f',
    defStyles: undefined,
    plugins: [],
    enhancers: [],
    preset: { unit: [] },
    ssr: false
};
class Renderer {
    /** To use with fela-monolithic enhancer. */
    static devClassNames = false;
    renderer;
    _mixin;
    renderClasses;
    /** Vue Composition API endpoint. */
    styl;
    /** @returns Vue Options API mixin. */
    get mixin() {
        return Object.freeze(this._mixin);
    }
    /** @returns Entire css for SSR proposes. */
    get style() {
        return renderToMarkup(this.renderer);
    }
    constructor(opts = {}) {
        const { method, ssr, preset, plugins, enhancers, ...miscRenderOpts } = mergeProps(defaultOpts, opts);
        const presetConfig = { ...defaultOpts.preset, ...(preset || {}) };
        const thisRenderer = this;
        if (opts.fdef) {
            throw new Error('fela-vue: Change deprecated `fdef` to `defStyles`!');
        }
        // Fela renderer creation. 
        this.renderer = createRenderer({
            ...miscRenderOpts,
            enhancers,
            plugins: preparePlugins([
                unit,
                embedded$1,
                prefixer,
                fallback,
                ...plugins
            ], { 0: presetConfig.unit })
        });
        const { renderer } = this;
        // Default styles.
        const fdef = opts.defStyles;
        let fdefKey, fdefValue;
        switch (typeof fdef) {
            case types.o:
                [fdefKey, fdefValue] = [fdef.key, fdef.value];
                break;
            case types.f:
                [fdefKey, fdefValue] = ['fdef', fdef];
                break;
        }
        // Fela mounting.
        if (isBrowser)
            if (ssr)
                rehydrate(renderer);
            else
                render(renderer);
        this.renderClasses = function (stylesheet, propsOrRule, props = {}) {
            const [name, rules] = getRules(memoize(() => fdefValue ? fdefValue(this) : emptyObject), stylesheet, propsOrRule, this);
            return renderer.renderRule(tryNamedFn(combineRules(...rules), name, Renderer.devClassNames), props) || undefined;
        };
        // Should be bound to Renderer.
        this.styl = (stylesheet) => (...args) => this.renderClasses(stylesheet, ...args);
        // Mixin creation.
        this._mixin = Ye(Q, {
            methods: {
                /** propsOrRule: any, props?: AnyObject */
                [method]: function (...args) {
                    return thisRenderer.renderClasses
                        .call(this, this.style, ...args);
                }
            },
            computed: fdef && {
                [fdefKey]() {
                    return fdefValue(this);
                }
            }
        });
    }
}

class SvelteRenderer extends Renderer {
    static get devClassNames() {
        return Renderer.devClassNames;
    }
    /** To use with fela-monolithic enhancer. */
    static set devClassNames(x) {
        Renderer.devClassNames = x;
    }
    f;
    fdef;
    getCSS() {
        return (rules) => {
            const context = { style: rules, fdef: this.fdef };
            return (className, attrs) => this.f.call(context, className, attrs);
        };
    }
    getLiteralCSS() {
        const rulz = this.getCSS();
        return (...template) => rulz(css(...template));
    }
    constructor(opts = {}) {
        super(opts);
        const mixin = this.mixin;
        this.f = mixin.methods.f;
        this.fdef = typeof opts.defStyles == 'function'
            ? mixin.computed.fdef
            : opts.defStyles && mixin.computed[opts.defStyles.key];
    }
}

const errorString = 'fela-vue literal: unbalanced delimeter in functional expression !';
/** returns first and last indexes of entries themselves. */
const findEntries = s(([start, end], str) => {
    let i, startI, str_len = str.length, delim_len = start.length, balance = 0, entries = [];
    for (i = 0; i < str_len; i++) {
        switch (str.slice(i, i + delim_len)) {
            case start:
                i += delim_len - 1;
                if (balance == 0) {
                    startI = i;
                }
                balance++;
                break;
            case end:
                i += delim_len - 1;
                balance--;
                if (balance == 0) {
                    entries.push([startI, i]);
                }
                else if (balance < 0) {
                    throw new Error(errorString);
                }
        }
    }
    return entries;
});
const injectExpressions = (line) => {
    const accum = [];
    let lastI = 0;
    for (let [from, to] of findEntries(['[', ']'], line)) {
        accum.push(line.slice(lastI, from), `\${${line
            .slice(from + 1, to)
            .replace(/(\W|^)\$([a-zA-Z_]+)\b/g, '$1$$ps.$2')
            .replace(/(\W|^)@(.+?)\b/g, '$1$t.$2')}}`);
        lastI = to + 1;
    }
    accum.push(line.slice(lastI));
    return accum.join('');
};
const intoExpression = U(Me('\n'), Qe(injectExpressions));
const createFunctions = (aug) => (lines) => {
    const out = [];
    let line, arrowI, selector, balance = 0, accum = [];
    for (line of lines) {
        if (balance > 0) {
            switch (line) {
                case '{':
                    balance++;
                    accum[accum.length - 1] += line;
                    break;
                case '}':
                    if (--balance == 1) {
                        if (aug) {
                            const gen = `($ps, $t) => css\`${intoExpression(accum)}\``;
                            out.push([selector, gen]); // only for internal aug stuff.
                        }
                        else {
                            const gen = new Function('$t,css,$ps', `return css\`
                ${intoExpression(accum)}
              \``);
                            out.push([selector, (props, t) => gen(t, css, props)]);
                        }
                        balance = 0;
                        accum.splice(0);
                    }
                    else {
                        accum[accum.length - 1] += line;
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
    }
    return out;
};

const parse = (() => {
    const delimiters = ['\n', '\r', ';'];
    const isDelimiter = (s) => delimiters.includes(s);
    const commentRE = /(([\s^]+?\/\/.*$)|\/\*(.|[\n\r])*?\*\/)/gm;
    return (css, aug = false) => {
        const levels = new Levels();
        const names = []; // selector names, class names.
        return U(() => levels.out, Re((line) => {
            if (j(line) == 'Array')
                levels.merge(line[0], line[1]);
            else {
                if (line)
                    analyseLine(levels, line, names);
                if (levels.depth < 1)
                    throw new Error('lit-css parse error: unbalanced {} braces !');
            }
        }), createFunctions(aug), 
        // when(always(not(aug)), createFunctions),
        Ye(W(Ve)), Qe(R), splitNonEscaped(delimiters), Xe(/(\{|\})/g, (_, brace, offset, full) => {
            if (!isDelimiter(full[offset - 1]))
                brace = ';' + brace;
            if (!isDelimiter(full[offset + 1]))
                brace += ';';
            return brace;
        }), escape, Xe(commentRE, ''))(css);
    };
})();

// TODO: make this inside of a ww.
const _css = (aug) => {
    return (strings, ...values) => {
        return parse(join(strings, values), aug);
    };
};
const css = _css(false);
const __specialcss = _css(true);

var es = {};

var arrayEach$1 = {};

Object.defineProperty(arrayEach$1, "__esModule", {
  value: true
});
arrayEach$1.default = arrayEach;
function arrayEach(arr, iterator) {
  for (var i = 0, len = arr.length; i < len; ++i) {
    iterator(arr[i], i, len, arr);
  }
}

var arrayFilter$1 = {};

Object.defineProperty(arrayFilter$1, "__esModule", {
  value: true
});
arrayFilter$1.default = arrayFilter;
function arrayFilter(arr, filter) {
  var filteredArr = [];

  for (var i = 0, len = arr.length; i < len; ++i) {
    var value = arr[i];

    if (filter(value, i, len, arr)) {
      filteredArr.push(value);
    }
  }

  return filteredArr;
}

var arrayMap$1 = {};

Object.defineProperty(arrayMap$1, "__esModule", {
  value: true
});
arrayMap$1.default = arrayMap;
function arrayMap(arr, mapper) {
  var mappedArr = [];

  for (var i = 0, len = arr.length; i < len; ++i) {
    mappedArr.push(mapper(arr[i], i, len, arr));
  }

  return mappedArr;
}

var arrayReduce$2 = {};

Object.defineProperty(arrayReduce$2, "__esModule", {
  value: true
});
arrayReduce$2.default = arrayReduce$1;
function arrayReduce$1(arr, reducer, initialValue) {
  for (var i = 0, len = arr.length; i < len; ++i) {
    initialValue = reducer(initialValue, arr[i], i, len, arr);
  }

  return initialValue;
}

var objectEach$1 = {};

Object.defineProperty(objectEach$1, "__esModule", {
  value: true
});
objectEach$1.default = objectEach;
function objectEach(obj, iterator) {
  for (var key in obj) {
    iterator(obj[key], key, obj);
  }
}

var objectFilter$1 = {};

Object.defineProperty(objectFilter$1, "__esModule", {
  value: true
});
objectFilter$1.default = objectFilter;
function objectFilter(obj, filter) {
  var filteredObj = {};

  for (var key in obj) {
    var value = obj[key];

    if (filter(value, key, obj)) {
      filteredObj[key] = value;
    }
  }

  return filteredObj;
}

var objectFind$1 = {};

Object.defineProperty(objectFind$1, "__esModule", {
  value: true
});
objectFind$1.default = objectFind;
function objectFind(obj, query) {
  for (var key in obj) {
    if (query(obj[key], key, obj)) {
      return key;
    }
  }
}

var objectReduce$1 = {};

Object.defineProperty(objectReduce$1, "__esModule", {
  value: true
});
objectReduce$1.default = objectReducer;
function objectReducer(obj, reducer, initialValue) {
  for (var key in obj) {
    initialValue = reducer(initialValue, obj[key], key, obj);
  }

  return initialValue;
}

Object.defineProperty(es, "__esModule", {
  value: true
});
var objectReduce = es.objectReduce = es.objectFind = es.objectFilter = es.objectEach = arrayReduce = es.arrayReduce = es.arrayMap = es.arrayFilter = es.arrayEach = undefined;

var _arrayEach = arrayEach$1;

var _arrayEach2 = _interopRequireDefault(_arrayEach);

var _arrayFilter = arrayFilter$1;

var _arrayFilter2 = _interopRequireDefault(_arrayFilter);

var _arrayMap = arrayMap$1;

var _arrayMap2 = _interopRequireDefault(_arrayMap);

var _arrayReduce = arrayReduce$2;

var _arrayReduce2 = _interopRequireDefault(_arrayReduce);

var _objectEach = objectEach$1;

var _objectEach2 = _interopRequireDefault(_objectEach);

var _objectFilter = objectFilter$1;

var _objectFilter2 = _interopRequireDefault(_objectFilter);

var _objectFind = objectFind$1;

var _objectFind2 = _interopRequireDefault(_objectFind);

var _objectReduce = objectReduce$1;

var _objectReduce2 = _interopRequireDefault(_objectReduce);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

es.arrayEach = _arrayEach2.default;
es.arrayFilter = _arrayFilter2.default;
es.arrayMap = _arrayMap2.default;
var arrayReduce = es.arrayReduce = _arrayReduce2.default;
es.objectEach = _objectEach2.default;
es.objectFilter = _objectFilter2.default;
es.objectFind = _objectFind2.default;
objectReduce = es.objectReduce = _objectReduce2.default;

var lib = {exports: {}};

var isPrefixedProperty = {exports: {}};

(function (module, exports) {

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = isPrefixedProperty;
	var regex = /^(Webkit|Moz|O|ms)/;

	function isPrefixedProperty(property) {
	  return regex.test(property);
	}
	module.exports = exports["default"];
} (isPrefixedProperty, isPrefixedProperty.exports));

isPrefixedProperty.exports.default;

var isPrefixedValue = {exports: {}};

(function (module, exports) {

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = isPrefixedValue;
	var regex = /-webkit-|-moz-|-ms-/;

	function isPrefixedValue(value) {
	  return typeof value === 'string' && regex.test(value);
	}
	module.exports = exports['default'];
} (isPrefixedValue, isPrefixedValue.exports));

isPrefixedValue.exports.default;

var normalizeProperty = {exports: {}};

var unprefixProperty = {exports: {}};

(function (module, exports) {

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = unprefixProperty;
	var prefixRegex = /^(ms|Webkit|Moz|O)/;

	function unprefixProperty(property) {
	  var propertyWithoutPrefix = property.replace(prefixRegex, '');
	  return propertyWithoutPrefix.charAt(0).toLowerCase() + propertyWithoutPrefix.slice(1);
	}
	module.exports = exports['default'];
} (unprefixProperty, unprefixProperty.exports));

unprefixProperty.exports.default;

(function (module, exports) {

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = normalizeProperty;

	var _camelCaseProperty = camelCaseProperty$1.exports;

	var _camelCaseProperty2 = _interopRequireDefault(_camelCaseProperty);

	var _unprefixProperty = unprefixProperty.exports;

	var _unprefixProperty2 = _interopRequireDefault(_unprefixProperty);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function normalizeProperty(property) {
	  return (0, _unprefixProperty2.default)((0, _camelCaseProperty2.default)(property));
	}
	module.exports = exports['default'];
} (normalizeProperty, normalizeProperty.exports));

normalizeProperty.exports.default;

var unprefixValue = {exports: {}};

(function (module, exports) {

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = unprefixValue;
	var prefixRegex = /(-ms-|-webkit-|-moz-|-o-)/g;

	function unprefixValue(value) {
	  if (typeof value === 'string') {
	    return value.replace(prefixRegex, '');
	  }

	  return value;
	}
	module.exports = exports['default'];
} (unprefixValue, unprefixValue.exports));

unprefixValue.exports.default;

(function (module, exports) {

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _assignStyle = assignStyle$1.exports;

	var _assignStyle2 = _interopRequireDefault(_assignStyle);

	var _camelCaseProperty = camelCaseProperty$1.exports;

	var _camelCaseProperty2 = _interopRequireDefault(_camelCaseProperty);

	var _cssifyDeclaration = cssifyDeclaration$1.exports;

	var _cssifyDeclaration2 = _interopRequireDefault(_cssifyDeclaration);

	var _cssifyObject = cssifyObject$1.exports;

	var _cssifyObject2 = _interopRequireDefault(_cssifyObject);

	var _hyphenateProperty = hyphenateProperty$2.exports;

	var _hyphenateProperty2 = _interopRequireDefault(_hyphenateProperty);

	var _isPrefixedProperty = isPrefixedProperty.exports;

	var _isPrefixedProperty2 = _interopRequireDefault(_isPrefixedProperty);

	var _isPrefixedValue = isPrefixedValue.exports;

	var _isPrefixedValue2 = _interopRequireDefault(_isPrefixedValue);

	var _isUnitlessProperty = isUnitlessProperty.exports;

	var _isUnitlessProperty2 = _interopRequireDefault(_isUnitlessProperty);

	var _normalizeProperty = normalizeProperty.exports;

	var _normalizeProperty2 = _interopRequireDefault(_normalizeProperty);

	var _resolveArrayValue = resolveArrayValue$1.exports;

	var _resolveArrayValue2 = _interopRequireDefault(_resolveArrayValue);

	var _unprefixProperty = unprefixProperty.exports;

	var _unprefixProperty2 = _interopRequireDefault(_unprefixProperty);

	var _unprefixValue = unprefixValue.exports;

	var _unprefixValue2 = _interopRequireDefault(_unprefixValue);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = {
	  assignStyle: _assignStyle2.default,
	  camelCaseProperty: _camelCaseProperty2.default,
	  cssifyDeclaration: _cssifyDeclaration2.default,
	  cssifyObject: _cssifyObject2.default,
	  hyphenateProperty: _hyphenateProperty2.default,
	  isPrefixedProperty: _isPrefixedProperty2.default,
	  isPrefixedValue: _isPrefixedValue2.default,
	  isUnitlessProperty: _isUnitlessProperty2.default,
	  normalizeProperty: _normalizeProperty2.default,
	  resolveArrayValue: _resolveArrayValue2.default,
	  unprefixProperty: _unprefixProperty2.default,
	  unprefixValue: _unprefixValue2.default
	};
	module.exports = exports['default'];
} (lib, lib.exports));

lib.exports.default;

var RULE_TYPE = 'RULE';

function generateCombinedMediaQuery(currentMediaQuery, nestedMediaQuery) {
  if (currentMediaQuery.length === 0) {
    return nestedMediaQuery;
  }

  return "".concat(currentMediaQuery, " and ").concat(nestedMediaQuery);
}

function generateCSSSelector(className) {
  var pseudo = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var specificityPrefix = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var propertyPriority = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
  var classNameSelector = ".".concat(className).repeat(propertyPriority);
  return "".concat(specificityPrefix).concat(classNameSelector).concat(pseudo);
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

var FALSY_REGEX = /undefined|null/;
var URL_REGEX = /url/;
function isUndefinedValue(value) {
  return value === undefined || value === null || typeof value === 'string' && FALSY_REGEX.test(value) && !URL_REGEX.test(value);
}

function normalizeNestedProperty(nestedProperty) {
  if (nestedProperty.charAt(0) === '&') {
    return nestedProperty.substr(1);
  }

  return nestedProperty;
}

function processStyleWithPlugins(renderer, style, type) {
  var props = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var plugins = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : renderer.plugins;

  if (plugins.length > 0) {
    return arrayReduce(plugins, function (processedStyle, plugin) {
      return plugin(processedStyle, type, renderer, props);
    }, style);
  }

  return style;
}

var stringHash = {exports: {}};

(function (module) {

	function hash(str) {
	  var hash = 5381,
	      i    = str.length;

	  while(i) {
	    hash = (hash * 33) ^ str.charCodeAt(--i);
	  }

	  /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
	   * integers. Since we want the results to be always positive, convert the
	   * signed int to an unsigned by doing an unsigned bitshift. */
	  return hash >>> 0;
	}

	module.exports = hash;
} (stringHash));

var hash = stringHash.exports.default;

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
var collisionBuffer = {};
function generateUniqueHash() {
  var reference = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var result = _typeof(reference) === 'object' ? JSON.stringify(reference) : reference;
  var prevResult;

  do {
    prevResult = result;
    result = hash(prevResult).toString(36);
  } while (collisionBuffer[result] && collisionBuffer[result] !== prevResult);

  collisionBuffer[result] = prevResult;
  return "_".concat(result);
}

function generateMonolithicClassName(style) {
  var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  if (style.className) {
    var name = prefix + style.className;
    delete style.className;
    return name;
  }

  var hashedName = generateUniqueHash(style);
  return "".concat(prefix).concat(hashedName);
}

var _excluded = ["_className"];

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function useMonolithicRenderer(renderer) {
  var prettySelectors = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  renderer.prettySelectors = prettySelectors;

  renderer._renderStyleToCache = function (className, style) {
    var pseudo = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
    var media = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
    var support = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '';
    var ruleSet = objectReduce(style, function (ruleset, value, property) {
      if (isPlainObject(value)) {
        if (isNestedSelector(property)) {
          renderer._renderStyleToCache(className, value, pseudo + normalizeNestedProperty(property), media, support);
        } else if (isMediaQuery(property)) {
          var combinedMediaQuery = generateCombinedMediaQuery(media, property.slice(6).trim());

          renderer._renderStyleToCache(className, value, pseudo, combinedMediaQuery, support);
        } else if (isSupport(property)) {
          var combinedSupport = generateCombinedMediaQuery(support, property.slice(9).trim());

          renderer._renderStyleToCache(className, value, pseudo, media, combinedSupport);
        } else {
          console.warn("The object key \"".concat(property, "\" is not a valid nested key in Fela. \nMaybe you forgot to add a plugin to resolve it? \nCheck http://fela.js.org/docs/basics/Rules.html#styleobject for more information."));
        }
      } else if (!isUndefinedValue(value)) {
        ruleset[property] = value;
      }

      return ruleset;
    }, {});

    if (Object.keys(ruleSet).length > 0) {
      var css = lib.exports.cssifyObject(ruleSet);
      var selector = generateCSSSelector(className, pseudo, renderer.specificityPrefix);
      var change = {
        type: RULE_TYPE,
        className: className,
        selector: selector,
        declaration: css,
        media: media,
        pseudo: pseudo,
        support: support
      };
      var declarationReference = selector + media + support;
      renderer.cache[declarationReference] = change;

      renderer._emitChange(change);
    }
  };

  renderer._renderStyleToClassNames = function (_ref, rule) {
    var _className = _ref._className,
        style = _objectWithoutProperties(_ref, _excluded);

    if (Object.keys(style).length < 1) {
      return '';
    }

    var localRulePrefix = renderer.prettySelectors && (rule.ruleName || rule.name) ? "".concat(rule.ruleName || rule.name, "_") : '';
    var className = generateMonolithicClassName(style, (renderer.selectorPrefix || '') + (rule.selectorPrefix || localRulePrefix));

    if (!renderer.cache.hasOwnProperty(className)) {
      renderer._renderStyleToCache(className, style);

      renderer.cache[className] = {};
    }

    return (_className ? _className + ' ' : '') + className;
  };

  renderer.renderRule = function (rule) {
    var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return renderer._renderStyle(rule(props, renderer), props, rule);
  };

  renderer._renderStyle = function () {
    var style = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var rule = arguments.length > 2 ? arguments[2] : undefined;
    var processedStyle = processStyleWithPlugins(renderer, style, RULE_TYPE, props);
    return renderer._renderStyleToClassNames(processedStyle, rule || {});
  };

  renderer.subscribe(function (event) {
    if (event.type === 'REHYDRATATION_FINISHED') {
      // Repair cache for monolithic usage
      renderer.cache = Object.keys(renderer.cache).reduce(function (acc, key) {
        var item = renderer.cache[key];

        if (item.type === 'RULE') {
          return Object.assign(acc, _defineProperty({}, item.className + item.media + item.support, item));
        }

        return Object.assign(acc, _defineProperty({}, key, item));
      }, {});
    }
  });
  return renderer;
}

function monolithic() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return function (renderer) {
    return useMonolithicRenderer(renderer, options.prettySelectors);
  };
}

Renderer.devClassNames = true;
window.setCompression = setCompression;
window.css = css;
window.specialcss = __specialcss;
window.renderer = new Renderer({
    enhancers: [monolithic({ prettySelectors: true })]
});
window.svrenderer = new SvelteRenderer({
    enhancers: [monolithic({ prettySelectors: true })],
    defStyles: () => css `.red {color: red}`
});
window.scss = window.svrenderer.getLiteralCSS();
