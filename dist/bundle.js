"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var fela=require("fela"),felaDom=require("fela-dom");function unwrapExports(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}function createCommonjsModule(e,r){return e(r={exports:{}},r.exports),r.exports}var arrayReduce_1=createCommonjsModule(function(e,r){Object.defineProperty(r,"__esModule",{value:!0}),r.default=function(e,r,t){for(var n=0,o=e.length;n<o;++n)t=r(t,e[n],n,o,e);return t}}),arrayReduce=unwrapExports(arrayReduce_1),isobject=function(e){return null!=e&&"object"==typeof e&&!1===Array.isArray(e)},_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};function _objectWithoutProperties(e,r){var t={};for(var n in e)r.indexOf(n)>=0||Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t}function renderFontFace(e,r){var t=e.fontFamily,n=e.src,o=_objectWithoutProperties(e,["fontFamily","src"]);if("string"==typeof t&&Array.isArray(n))return r.renderFont(t,n,o)}function embedded(e,r,t){var n=function(n){var o=e[n];"fontFace"===n&&"object"===(void 0===o?"undefined":_typeof(o))?(Array.isArray(o)?e.fontFamily=arrayReduce(o,function(e,r){var n=renderFontFace(r,t);return n&&-1===e.indexOf(n)&&e.push(n),e},[]).join(","):e.fontFamily=renderFontFace(o,t),delete e.fontFace):"animationName"===n&&"object"===(void 0===o?"undefined":_typeof(o))?Array.isArray(o)?e[n]=o.map(function(e){return t.renderKeyframe(function(){return e})}).join(","):e[n]=t.renderKeyframe(function(){return o}):isobject(o)&&embedded(o,r,t)};for(var o in e)n(o);return e}var embedded$1=function(){return embedded};function capitalizeString(e){return e.charAt(0).toUpperCase()+e.slice(1)}function prefixProperty(e,r,t){if(e.hasOwnProperty(r)){for(var n={},o=e[r],i=capitalizeString(r),a=Object.keys(t),s=0;s<a.length;s++){var l=a[s];if(l===r)for(var u=0;u<o.length;u++)n[o[u]+i]=t[r];n[l]=t[l]}return n}return t}function prefixValue(e,r,t,n,o){for(var i=0,a=e.length;i<a;++i){var s=e[i](r,t,n,o);if(s)return s}}function addIfNew(e,r){-1===e.indexOf(r)&&e.push(r)}function addNewValuesOnly(e,r){if(Array.isArray(r))for(var t=0,n=r.length;t<n;++t)addIfNew(e,r[t]);else addIfNew(e,r)}function isObject(e){return e instanceof Object&&!Array.isArray(e)}function createPrefixer(e){var r=e.prefixMap,t=e.plugins;return function e(n){for(var o in n){var i=n[o];if(isObject(i))n[o]=e(i);else if(Array.isArray(i)){for(var a=[],s=0,l=i.length;s<l;++s){addNewValuesOnly(a,prefixValue(t,o,i[s],n,r)||i[s])}a.length>0&&(n[o]=a)}else{var u=prefixValue(t,o,i,n,r);u&&(n[o]=u),n=prefixProperty(r,o,n)}}return n}}var w=["Webkit"],m=["Moz"],ms=["ms"],wm=["Webkit","Moz"],wms=["Webkit","ms"],wmms=["Webkit","Moz","ms"],data={plugins:[],prefixMap:{appearance:wm,textEmphasisPosition:w,textEmphasis:w,textEmphasisStyle:w,textEmphasisColor:w,boxDecorationBreak:w,maskImage:w,maskMode:w,maskRepeat:w,maskPosition:w,maskClip:w,maskOrigin:w,maskSize:w,maskComposite:w,mask:w,maskBorderSource:w,maskBorderMode:w,maskBorderSlice:w,maskBorderWidth:w,maskBorderOutset:w,maskBorderRepeat:w,maskBorder:w,maskType:w,textDecorationStyle:w,textDecorationSkip:w,textDecorationLine:w,textDecorationColor:w,userSelect:wmms,backdropFilter:w,fontKerning:w,scrollSnapType:wms,scrollSnapPointsX:wms,scrollSnapPointsY:wms,scrollSnapDestination:wms,scrollSnapCoordinate:wms,clipPath:w,shapeImageThreshold:w,shapeImageMargin:w,shapeImageOutside:w,filter:w,hyphens:wms,flowInto:wms,flowFrom:wms,breakBefore:wms,breakAfter:wms,breakInside:wms,regionFragment:wms,writingMode:wms,textOrientation:w,tabSize:m,fontFeatureSettings:w,columnCount:w,columnFill:w,columnGap:w,columnRule:w,columnRuleColor:w,columnRuleStyle:w,columnRuleWidth:w,columns:w,columnSpan:w,columnWidth:w,wrapFlow:ms,wrapThrough:ms,wrapMargin:ms,gridTemplateColumns:ms,gridTemplateRows:ms,gridTemplateAreas:ms,gridTemplate:ms,gridAutoColumns:ms,gridAutoRows:ms,gridAutoFlow:ms,grid:ms,gridRowStart:ms,gridColumnStart:ms,gridRowEnd:ms,gridRow:ms,gridColumn:ms,gridColumnEnd:ms,gridColumnGap:ms,gridRowGap:ms,gridArea:ms,gridGap:ms,textSizeAdjust:wms}};function backgroundClip(e,r){if("string"==typeof r&&"text"===r)return["-webkit-text","text"]}var prefixes=["-webkit-","-moz-",""],values={"zoom-in":!0,"zoom-out":!0,grab:!0,grabbing:!0};function cursor(e,r){if("cursor"===e&&values.hasOwnProperty(r))return prefixes.map(function(e){return e+r})}var isPrefixedValue_1=createCommonjsModule(function(e,r){Object.defineProperty(r,"__esModule",{value:!0}),r.default=function(e){return"string"==typeof e&&t.test(e)};var t=/-webkit-|-moz-|-ms-/;e.exports=r.default}),isPrefixedValue=unwrapExports(isPrefixedValue_1),prefixes$1=["-webkit-",""];function crossFade(e,r){if("string"==typeof r&&!isPrefixedValue(r)&&r.indexOf("cross-fade(")>-1)return prefixes$1.map(function(e){return r.replace(/cross-fade\(/g,e+"cross-fade(")})}var prefixes$2=["-webkit-",""];function filter(e,r){if("string"==typeof r&&!isPrefixedValue(r)&&r.indexOf("filter(")>-1)return prefixes$2.map(function(e){return r.replace(/filter\(/g,e+"filter(")})}var values$1={flex:["-webkit-box","-moz-box","-ms-flexbox","-webkit-flex","flex"],"inline-flex":["-webkit-inline-box","-moz-inline-box","-ms-inline-flexbox","-webkit-inline-flex","inline-flex"]};function flex(e,r){if("display"===e&&values$1.hasOwnProperty(r))return values$1[r]}var alternativeValues={"space-around":"justify","space-between":"justify","flex-start":"start","flex-end":"end","wrap-reverse":"multiple",wrap:"multiple"},alternativeProps={alignItems:"WebkitBoxAlign",justifyContent:"WebkitBoxPack",flexWrap:"WebkitBoxLines",flexGrow:"WebkitBoxFlex"};function flexboxOld(e,r,t){"flexDirection"===e&&"string"==typeof r&&(r.indexOf("column")>-1?t.WebkitBoxOrient="vertical":t.WebkitBoxOrient="horizontal",r.indexOf("reverse")>-1?t.WebkitBoxDirection="reverse":t.WebkitBoxDirection="normal"),alternativeProps.hasOwnProperty(e)&&(t[alternativeProps[e]]=alternativeValues[r]||r)}var prefixes$3=["-webkit-","-moz-",""],values$2=/linear-gradient|radial-gradient|repeating-linear-gradient|repeating-radial-gradient/gi;function gradient(e,r){if("string"==typeof r&&!isPrefixedValue(r)&&values$2.test(r))return prefixes$3.map(function(e){return r.replace(values$2,function(r){return e+r})})}var prefixes$4=["-webkit-",""];function imageSet(e,r){if("string"==typeof r&&!isPrefixedValue(r)&&r.indexOf("image-set(")>-1)return prefixes$4.map(function(e){return r.replace(/image-set\(/g,e+"image-set(")})}var alternativeProps$1={marginBlockStart:["WebkitMarginBefore"],marginBlockEnd:["WebkitMarginAfter"],marginInlineStart:["WebkitMarginStart","MozMarginStart"],marginInlineEnd:["WebkitMarginEnd","MozMarginEnd"],paddingBlockStart:["WebkitPaddingBefore"],paddingBlockEnd:["WebkitPaddingAfter"],paddingInlineStart:["WebkitPaddingStart","MozPaddingStart"],paddingInlineEnd:["WebkitPaddingEnd","MozPaddingEnd"],borderBlockStart:["WebkitBorderBefore"],borderBlockStartColor:["WebkitBorderBeforeColor"],borderBlockStartStyle:["WebkitBorderBeforeStyle"],borderBlockStartWidth:["WebkitBorderBeforeWidth"],borderBlockEnd:["WebkitBorderAfter"],borderBlockEndColor:["WebkitBorderAfterColor"],borderBlockEndStyle:["WebkitBorderAfterStyle"],borderBlockEndWidth:["WebkitBorderAfterWidth"],borderInlineStart:["WebkitBorderStart","MozBorderStart"],borderInlineStartColor:["WebkitBorderStartColor","MozBorderStartColor"],borderInlineStartStyle:["WebkitBorderStartStyle","MozBorderStartStyle"],borderInlineStartWidth:["WebkitBorderStartWidth","MozBorderStartWidth"],borderInlineEnd:["WebkitBorderEnd","MozBorderEnd"],borderInlineEndColor:["WebkitBorderEndColor","MozBorderEndColor"],borderInlineEndStyle:["WebkitBorderEndStyle","MozBorderEndStyle"],borderInlineEndWidth:["WebkitBorderEndWidth","MozBorderEndWidth"]};function logical(e,r,t){if(Object.prototype.hasOwnProperty.call(alternativeProps$1,e))for(var n=alternativeProps$1[e],o=0,i=n.length;o<i;++o)t[n[o]]=r}function position(e,r){if("position"===e&&"sticky"===r)return["-webkit-sticky","sticky"]}var prefixes$5=["-webkit-","-moz-",""],properties={maxHeight:!0,maxWidth:!0,width:!0,height:!0,columnWidth:!0,minWidth:!0,minHeight:!0},values$3={"min-content":!0,"max-content":!0,"fill-available":!0,"fit-content":!0,"contain-floats":!0};function sizing(e,r){if(properties.hasOwnProperty(e)&&values$3.hasOwnProperty(r))return prefixes$5.map(function(e){return e+r})}var uppercasePattern=/[A-Z]/g,msPattern=/^ms-/,cache={};function toHyphenLower(e){return"-"+e.toLowerCase()}function hyphenateStyleName(e){if(cache.hasOwnProperty(e))return cache[e];var r=e.replace(uppercasePattern,toHyphenLower);return cache[e]=msPattern.test(r)?"-"+r:r}var hyphenateProperty_1=createCommonjsModule(function(e,r){Object.defineProperty(r,"__esModule",{value:!0}),r.default=function(e){return(0,n.default)(e)};var t,n=(t=hyphenateStyleName)&&t.__esModule?t:{default:t};e.exports=r.default}),hyphenateProperty=unwrapExports(hyphenateProperty_1),properties$1={transition:!0,transitionProperty:!0,WebkitTransition:!0,WebkitTransitionProperty:!0,MozTransition:!0,MozTransitionProperty:!0},prefixMapping={Webkit:"-webkit-",Moz:"-moz-",ms:"-ms-"};function prefixValue$1(e,r){if(isPrefixedValue(e))return e;for(var t=e.split(/,(?![^()]*(?:\([^()]*\))?\))/g),n=0,o=t.length;n<o;++n){var i=t[n],a=[i];for(var s in r){var l=hyphenateProperty(s);if(i.indexOf(l)>-1&&"order"!==l)for(var u=r[s],f=0,d=u.length;f<d;++f)a.unshift(i.replace(l,prefixMapping[u[f]]+l))}t[n]=a.join(",")}return t.join(",")}function transition(e,r,t,n){if("string"==typeof r&&properties$1.hasOwnProperty(e)){var o=prefixValue$1(r,n),i=o.split(/,(?![^()]*(?:\([^()]*\))?\))/g).filter(function(e){return!/-moz-|-ms-/.test(e)}).join(",");if(e.indexOf("Webkit")>-1)return i;var a=o.split(/,(?![^()]*(?:\([^()]*\))?\))/g).filter(function(e){return!/-webkit-|-ms-/.test(e)}).join(",");return e.indexOf("Moz")>-1?a:(t["Webkit"+capitalizeString(e)]=i,t["Moz"+capitalizeString(e)]=a,o)}}var plugins=[backgroundClip,crossFade,cursor,filter,flexboxOld,gradient,imageSet,logical,position,sizing,transition,flex],prefix=createPrefixer({prefixMap:data.prefixMap,plugins:plugins}),hyphenateProperty_1$1=createCommonjsModule(function(e,r){Object.defineProperty(r,"__esModule",{value:!0}),r.default=function(e){return(0,n.default)(e)};var t,n=(t=hyphenateStyleName)&&t.__esModule?t:{default:t};e.exports=r.default});unwrapExports(hyphenateProperty_1$1);var cssifyDeclaration_1=createCommonjsModule(function(e,r){Object.defineProperty(r,"__esModule",{value:!0}),r.default=function(e,r){return(0,n.default)(e)+":"+r};var t,n=(t=hyphenateProperty_1$1)&&t.__esModule?t:{default:t};e.exports=r.default});unwrapExports(cssifyDeclaration_1);var cssifyObject_1=createCommonjsModule(function(e,r){Object.defineProperty(r,"__esModule",{value:!0}),r.default=function(e){var r="";for(var t in e){var o=e[t];"string"!=typeof o&&"number"!=typeof o||(r&&(r+=";"),r+=(0,n.default)(t,o))}return r};var t,n=(t=cssifyDeclaration_1)&&t.__esModule?t:{default:t};e.exports=r.default}),cssifyObject=unwrapExports(cssifyObject_1),objectReduce=createCommonjsModule(function(e,r){Object.defineProperty(r,"__esModule",{value:!0}),r.default=function(e,r,t){for(var n in e)t=r(t,e[n],n,e);return t}}),objectReduce$1=unwrapExports(objectReduce),resolveArrayValue_1=createCommonjsModule(function(e,r){Object.defineProperty(r,"__esModule",{value:!0}),r.default=function(e,r){var t=(0,n.default)(e);return r.join(";"+t+":")};var t,n=(t=hyphenateProperty_1$1)&&t.__esModule?t:{default:t};e.exports=r.default}),resolveArrayValue=unwrapExports(resolveArrayValue_1);function resolveFallbackValues(e){for(var r in e){var t=e[r];Array.isArray(t)?e[r]=resolveArrayValue(r,t):isobject(t)&&"fontFace"!==r&&(e[r]=resolveFallbackValues(t))}return e}var fallbackValue=function(){return resolveFallbackValues};function _defineProperty(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}var resolveFallbackValues$1=fallbackValue();function addVendorPrefixes(e){return objectReduce$1(e,function(r,t,n){if(isobject(t))r[n]=addVendorPrefixes(t);else{var o=prefix(_defineProperty({},n,e[n])),i=Object.keys(o),a=i[0],s=o[a];if(1===i.length)r[a]=s;else{delete o[a];var l=cssifyObject(resolveFallbackValues$1(o));r[a]=s+";"+l}}return r},{})}var prefixer=function(){return addVendorPrefixes},isUnitlessProperty_1=createCommonjsModule(function(e,r){Object.defineProperty(r,"__esModule",{value:!0}),r.default=function(e){return o.hasOwnProperty(e)};var t,n=(t=hyphenateProperty_1$1)&&t.__esModule?t:{default:t};var o={borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,fontWeight:!0,lineHeight:!0,opacity:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},i=["animationIterationCount","boxFlex","boxFlexGroup","boxOrdinalGroup","columnCount","flex","flexGrow","flexPositive","flexShrink","flexNegative","flexOrder","gridRow","gridColumn","order","lineClamp"],a=["Webkit","ms","Moz","O"];function s(e,r){return e+r.charAt(0).toUpperCase()+r.slice(1)}for(var l=0,u=i.length;l<u;++l){var f=i[l];o[f]=!0;for(var d=0,p=a.length;d<p;++d)o[s(a[d],f)]=!0}for(var c in o)o[(0,n.default)(c)]=!0;e.exports=r.default}),defaultIsUnitlessProperty=unwrapExports(isUnitlessProperty_1),_typeof$1="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};function addUnitIfNeeded(e,r,t){var n=void 0===r?"undefined":_typeof$1(r);return("number"===n||"string"===n&&r==parseFloat(r))&&0!=r&&(r+=t),r}function addUnit(e,r,t,n){var o=function(o){if(!n(o)){var i=e[o],a=t[o]||r;isobject(i)?e[o]=addUnit(i,r,t,n):Array.isArray(i)?e[o]=i.map(function(e){return addUnitIfNeeded(o,e,a)}):e[o]=addUnitIfNeeded(o,i,a)}};for(var i in e)o(i);return e}function unit(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"px",r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},t=arguments.length>2&&void 0!==arguments[2]?arguments[2]:defaultIsUnitlessProperty;return function(n){return addUnit(n,e,r,t)}}const isBrowser=require("is-browser"),defaultOpts={method:"f",defStyles:void 0,plugins:[],preset:{unit:[]},ssr:!1};class Renderer{get mixin(){return Object.freeze(this._mixin)}get style(){return felaDom.renderToMarkup(this.renderer)}constructor(e={}){const{method:r,ssr:t,plugins:n}=Object.assign({},defaultOpts,e),o=Object.assign({},defaultOpts.preset,e.preset||{});if(e.fdef)throw new Error("fela-vue: Change deprecated `fdef` to `defStyles`!");this.renderer=fela.createRenderer({plugins:[embedded$1(),prefixer(),fallbackValue(),unit(...o.unit),...n]});const{renderer:i}=this,a=e.defStyles;let s,l;a&&([s,l]={object:[a.key,a.value],function:["fdef",a]}[typeof a]),isBrowser&&(t?felaDom.rehydrate(i):felaDom.render(i)),this._mixin={methods:{[r](e,r={}){const t={function:e,object:()=>e,string:(()=>{const r=this.style&&this.style[e];return{function:r,object:()=>r}[typeof r]||(e=>e)})()}[typeof e];return i.renderRule(t,r)}},computed:a?{[s](){return l(this)}}:{}}}}exports.Renderer=Renderer;
