import{createRenderer as e,combineRules as r}from"fela";import{renderToMarkup as t,rehydrate as n,render as i}from"fela-dom";import o from"fela-plugin-embedded";import u from"fela-plugin-prefixer";import f from"fela-plugin-fallback-value";import c from"fela-plugin-unit";var a=function(){return(a=Object.assign||function(e){for(var r,t=1,n=arguments.length;t<n;t++)for(var i in r=arguments[t])Object.prototype.hasOwnProperty.call(r,i)&&(e[i]=r[i]);return e}).apply(this,arguments)};var s,l,p=function(e){return e},d=function(e){return e.replace(/-(\w)/gu,function(e,r){return r.toUpperCase()})},h=function(e){var r,t=!1;return function(){return t?r:(t=!0,r=e())}},m=(s=/(}|([}^\n])*?\s*([\w-&#>*:]+)[:\s]+(.*?)([\n;]|{|(?=})|$))/g,function(e){for(var r=[],t=1;t<arguments.length;t++)r[t-1]=arguments[t];var n={},i=n,o=[];return function(e,r){for(var t=e.length,n="",i=0;i<t;i++)n+=e[i]+(null==r[i]?"":r[i]);return n}(e,r).replace(s,function(e,r,t,n,u,f,c,a){if("}"==t||"}"==r){if(!o.length)throw new Error("Bad rule: "+a);i=o.pop()}if("{"==f){o.push(i);var s={};i[d(n)]=s,i=s}if(n){var l=n.includes(":");if(u||l){if("."==n[0]&&(n=n.slice(1)),!u&&l){var p=n.split(":");n=p.slice(0,-1).join(":"),u=(h=p)[h.length-1]}else n=n.slice(0,-1);n&&u&&(i[d(n)]=isNaN(u)?u.trim():+u)}}var h;return""}),n}),v=Object.freeze({}),y=function(){try{return"object"==typeof window}catch(e){return!1}}(),g={method:"f",defStyles:void 0,plugins:[],enhancers:[],preset:{unit:[]},ssr:!1},b=Object.freeze({f:"function",o:"object",s:"string"}),O=(l=function(e,r){return e[r]||e[d(r)]},function(e,r,t){switch(r||(r=v),typeof t){case b.f:return[t];case b.o:return[(n=t,function(){return n})];case b.s:return function(e,r,t){return t.split(/[,\s\t]+/g).map(function(t){return l(r,t)||l(e(),t)||v})}(e,r,t).reduce(function(t,n){return t.push.apply(t,O(e,r,n)),t},[]);default:return[p]}var n}),w=function(){function s(t){var s,l,p,d;void 0===t&&(t={});var m=a({},g,t),w=m.method,j=m.ssr,x=m.preset,P=m.plugins,S=m.enhancers,k=function(e,r){var t={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&r.indexOf(n)<0&&(t[n]=e[n]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var i=0;for(n=Object.getOwnPropertySymbols(e);i<n.length;i++)r.indexOf(n[i])<0&&(t[n[i]]=e[n[i]])}return t}(m,["method","ssr","preset","plugins","enhancers"]),z=a({},g.preset,x||{});if(t.fdef)throw new Error("fela-vue: Change deprecated `fdef` to `defStyles`!");this.renderer=e(a({},k,{enhancers:S,plugins:[o(),u(),f(),c.apply(void 0,z.unit)].concat(P)}));var C,E,N=this.renderer,_=t.defStyles;switch(typeof _){case b.o:C=(s=[_.key,_.value])[0],E=s[1];break;case b.f:C=(l=["fdef",_])[0],E=l[1]}y&&(j?n(N):i(N)),this._mixin={methods:(p={},p[w]=function(e,t){var n=this;return void 0===t&&(t={}),N.renderRule(r.apply(void 0,O(h(function(){return E?E(n):v}),this.style,e)),t)},p),computed:_?(d={},d[C]=function(){return E(this)},d):{}}}return Object.defineProperty(s.prototype,"mixin",{get:function(){return Object.freeze(this._mixin)},enumerable:!0,configurable:!0}),Object.defineProperty(s.prototype,"style",{get:function(){return t(this.renderer)},enumerable:!0,configurable:!0}),s}();export{w as Renderer,m as css};
