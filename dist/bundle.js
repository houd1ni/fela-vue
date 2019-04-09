"use strict";function _interopDefault(e){return e&&"object"==typeof e&&"default"in e?e.default:e}Object.defineProperty(exports,"__esModule",{value:!0});var fela=require("fela"),felaDom=require("fela-dom"),embedded=_interopDefault(require("fela-plugin-embedded")),prefixer=_interopDefault(require("fela-plugin-prefixer")),fallback=_interopDefault(require("fela-plugin-fallback-value")),unit=_interopDefault(require("fela-plugin-unit")),__assign=function(){return(__assign=Object.assign||function(e){for(var r,t=1,n=arguments.length;t<n;t++)for(var i in r=arguments[t])Object.prototype.hasOwnProperty.call(r,i)&&(e[i]=r[i]);return e}).apply(this,arguments)};function __rest(e,r){var t={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&r.indexOf(n)<0&&(t[n]=e[n]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var i=0;for(n=Object.getOwnPropertySymbols(e);i<n.length;i++)r.indexOf(n[i])<0&&(t[n[i]]=e[n[i]])}return t}var always=function(e){return function(){return e}},reflect=function(e){return e},camelify=function(e){return e.replace(/-(\w)/gu,function(e,r){return r.toUpperCase()})},last=function(e){return e[e.length-1]},memoize=function(e){var r,t=!1;return function(){return t?r:(t=!0,r=e())}},join=function(e,r){for(var t=e.length,n="",i=0;i<t;i++)n+=e[i]+(null==r[i]?"":r[i]);return n},analyseLine=function(){var e=/^([\w-]+)(: *| +)(.*)$/,r=/^(([@>\*\.:&\(\)\^="\-\[\]]+).*[ ,]*)+:?$/,t=/\s*,\s*/g,n=/(.*):[\n\r]/g;return function(i,u,a){var o,s=last(i);switch(!0){case"{"==u:var f={};a.forEach(function(e){return s[e]=f}),i.push(f);break;case"}"==u:i.pop();break;case null!=(o=e.exec(u)):s[camelify(o[1])]=isNaN(o[3])?o[3]:+o[3];break;case null!=(o=r.exec(u)):a.splice(0),a.push.apply(a,u.split(t).map(function(e){return"."==(e=e.replace(n,"$1"))[0]&&(e=i.length>1?"& "+e:e.slice(1)),e}))}}}(),css=function(){var e=["\n","\r",";"],r=function(r){return e.includes(r)},t=new RegExp("["+e.join("")+"]","g");return function(e){for(var n=[],i=1;i<arguments.length;i++)n[i-1]=arguments[i];var u={},a=[],o=[u];return join(e,n).replace(/(\{|\})/g,function(e,t,n,i){return r(i[n-1])||(t=";"+t),r(i[n+1])||(t+=";"),t}).split(t).forEach(function(e){if((e=e.trim())&&analyseLine(o,e,a),!o.length)throw new Error("lit-css parse error: unbalanced {} braces !")}),u}}(),isObject=function(e){return"object"==typeof e},emptyObject=Object.freeze({}),isBrowser=function(){try{return isObject(window)}catch(e){return!1}}(),defaultOpts={method:"f",defStyles:void 0,plugins:[],enhancers:[],preset:{unit:[]},ssr:!1},types=Object.freeze({f:"function",o:"object",s:"string"}),getRules=function(){var e=function(e,r){return e[r]||e[camelify(r)]};return function(r,t,n){switch(t||(t=emptyObject),typeof n){case types.f:return[n];case types.o:return[always(n)];case types.s:return function(r,t,n){return n.split(/[,\s\t]+/g).map(function(n){return e(t,n)||e(r(),n)||emptyObject})}(r,t,n).reduce(function(e,n){return e.push.apply(e,getRules(r,t,n)),e},[]);default:return[reflect]}}}(),Renderer=function(){function e(e){var r,t,n,i;void 0===e&&(e={});var u=__assign({},defaultOpts,e),a=u.method,o=u.ssr,s=u.preset,f=u.plugins,c=u.enhancers,l=__rest(u,["method","ssr","preset","plugins","enhancers"]),p=__assign({},defaultOpts.preset,s||{});if(e.fdef)throw new Error("fela-vue: Change deprecated `fdef` to `defStyles`!");this.renderer=fela.createRenderer(__assign({},l,{enhancers:c,plugins:[embedded(),prefixer(),fallback(),unit.apply(void 0,p.unit)].concat(f)}));var d,y,b=this.renderer,g=e.defStyles;switch(typeof g){case types.o:d=(r=[g.key,g.value])[0],y=r[1];break;case types.f:d=(t=["fdef",g])[0],y=t[1]}isBrowser&&(o?felaDom.rehydrate(b):felaDom.render(b)),this._mixin={methods:(n={},n[a]=function(e,r){var t=this;return void 0===r&&(r={}),b.renderRule(fela.combineRules.apply(void 0,getRules(memoize(function(){return y?y(t):emptyObject}),this.style,e)),r)||void 0},n),computed:g?(i={},i[d]=function(){return y(this)},i):{}}}return Object.defineProperty(e.prototype,"mixin",{get:function(){return Object.freeze(this._mixin)},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"style",{get:function(){return felaDom.renderToMarkup(this.renderer)},enumerable:!0,configurable:!0}),e}();exports.Renderer=Renderer,exports.css=css;
