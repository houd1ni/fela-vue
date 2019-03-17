import{createRenderer as e,combineRules as r}from"fela";import{renderToMarkup as t,rehydrate as n,render as o}from"fela-dom";import i from"fela-plugin-embedded";import f from"fela-plugin-prefixer";import u from"fela-plugin-fallback-value";import c from"fela-plugin-unit";var a=function(){return(a=Object.assign||function(e){for(var r,t=1,n=arguments.length;t<n;t++)for(var o in r=arguments[t])Object.prototype.hasOwnProperty.call(r,o)&&(e[o]=r[o]);return e}).apply(this,arguments)};var l,s,p=function(e){return e},d=function(e){return e.replace(/-(\w)/gu,function(e,r){return r.toUpperCase()})},h=(l=/([}^\n])*?\s*([\w->*:]+)[:\s]+(.*?)([\n;]|{|(?=})|$)/g,function(e){for(var r=[],t=1;t<arguments.length;t++)r[t-1]=arguments[t];var n,o={},i=o;return function(e,r){for(var t=e.length,n="",o=0;o<t;o++)n+=e[o]+(null==r[o]?"":r[o]);return n}(e,r).replace(l,function(e,r,t,o,f,u,c){if("}"==r){if(!n)throw new Error("Bad rule: "+c);i=n,n=null}if("{"==f){n=i;var a={};i[d(t)]=a,i=a}var l,s=t.includes(":");if(o||s){if(!o&&s){var p=t.split(":");t=p.slice(0,-1).join(":"),o=(l=p)[l.length-1]}else t=t.slice(0,-1);t&&o&&(i[d(t)]=isNaN(o)?o.trim():+o)}return""}),o}),m=function(){try{return"object"==typeof window}catch(e){return!1}}(),y={method:"f",defStyles:void 0,plugins:[],enhancers:[],preset:{unit:[]},ssr:!1},g=Object.freeze({f:"function",o:"object",s:"string"}),v=(s=function(e,r){return r.split(/[,\s\t]+/g).map(function(r){return function(e,r){return e?e[r]||e[d(r)]:{}}(e,r)})},function(e,r){switch(typeof r){case g.f:return[r];case g.o:return[(t=r,function(){return t})];case g.s:return s(e,r).reduce(function(r,t){return r.push.apply(r,v(e,t)),r},[]);default:return[p]}var t}),b=function(){function l(t){var l,s,p,d;void 0===t&&(t={});var h=a({},y,t),b=h.method,O=h.ssr,w=h.preset,j=h.plugins,x=h.enhancers,P=function(e,r){var t={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&r.indexOf(n)<0&&(t[n]=e[n]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var o=0;for(n=Object.getOwnPropertySymbols(e);o<n.length;o++)r.indexOf(n[o])<0&&(t[n[o]]=e[n[o]])}return t}(h,["method","ssr","preset","plugins","enhancers"]),S=a({},y.preset,w||{});if(t.fdef)throw new Error("fela-vue: Change deprecated `fdef` to `defStyles`!");this.renderer=e(a({},P,{enhancers:x,plugins:[i(),f(),u(),c.apply(void 0,S.unit)].concat(j)}));var k,z,C=this.renderer,E=t.defStyles;switch(typeof E){case g.o:k=(l=[E.key,E.value])[0],z=l[1];break;case g.f:k=(s=["fdef",E])[0],z=s[1]}m&&(O?n(C):o(C)),this._mixin={methods:(p={},p[b]=function(e,t){return void 0===t&&(t={}),C.renderRule(r.apply(void 0,v(this.style,e)),t)},p),computed:E?(d={},d[k]=function(){return z(this)},d):{}}}return Object.defineProperty(l.prototype,"mixin",{get:function(){return Object.freeze(this._mixin)},enumerable:!0,configurable:!0}),Object.defineProperty(l.prototype,"style",{get:function(){return t(this.renderer)},enumerable:!0,configurable:!0}),l}();export{b as Renderer,h as css};
