"use strict";function _interopDefault(e){return e&&"object"==typeof e&&"default"in e?e.default:e}Object.defineProperty(exports,"__esModule",{value:!0});var fela=require("fela"),felaDom=require("fela-dom"),embedded=_interopDefault(require("fela-plugin-embedded")),prefixer=_interopDefault(require("fela-plugin-prefixer")),fallback=_interopDefault(require("fela-plugin-fallback-value")),unit=_interopDefault(require("fela-plugin-unit"));const e=e=>typeof e,r=e=>null===e,t=t=>"number"==e(t),n=(e,t,r)=>t.length+r.length<e.length?(...r)=>n(e,[...t,...r],r):e(...t,...r),l=e=>(...t)=>n(e,t,[]),c=l((t,s)=>{if("object"==e(t)&&"object"==e(s)){if(r(t)||r(s))return t===s;for(let e of[t,s])for(let r in e)if(!c(t[r],s[r]))return!1}return t===s}),a=l((e,t,r,s)=>e(s)?t(s):r(s)),s=l((e,t,r)=>a(e,t,j,r)),u=(...e)=>t=>{for(let r=f(e)-1;r>-1;r--)t=e[r](t);return t},o=e=>l((t,r)=>e(r,t)),i=e=>r(e)||(e=>void 0===e)(e),f=e=>e.length,b=e=>()=>e,j=e=>e,h=e=>e.trim(),y=e=>e[0],g=e=>e[e.length-1],O=e=>t=>!e(t),m=e=>Object.entries(e),v=l((e,r,s)=>s.slice(e,t(r)?r:1/0)),N=l((e,t,r)=>({...r,[e]:t})),k=l((e,t)=>t[e]),P=l((e,t,r)=>a(f,u(a(i,b(e),r=>P(e,v(1,null,t),r)),o(k)(r),y),b(r))(t)),x=P(void 0),C=t=>{switch(e(t)){case"object":switch(D(t)){case"Null":return t;case"Array":return q(C,t);case"Object":const e={};for(let r in t)e[r]=C(t[r]);return e}default:return t}},E=l((e,t,r)=>r.reduce(e,C(t))),S=e=>E((e,t)=>N(...t,e),{},e),U=l((e,t)=>t.join(e)),q=l((e,t)=>t.map(e)),z=l((e,t)=>t.forEach(e)),B=l((e,t,r)=>t(r)&&e(r)),D=t=>{const s=e(t);return"object"==s?(e=>Array.isArray(e))(t)?"Array":r(t)?"Null":"Object":s[0].toUpperCase()+s.slice(1)},F=u(c("Object"),D),G=e=>{switch(D(e)){case"String":return""==e;case"Array":return 0==f(e);case"Null":return!1;case"Object":return 0==f(Object.keys(e));default:return!1}},H=l((e,t,r)=>r.replace(e,t)),I=l((e,t)=>a(u(c("Array"),D),t=>t.filter(e),u(S,I(([t,r])=>e(r,t)),m))(t)),emptyObject=Object.freeze({}),types=Object.freeze({f:"function",o:"object",s:"string"}),camelify=e=>e.replace(/-(\w)/gu,(e,t)=>t.toUpperCase()),memoize=e=>{let t,r=!1;return()=>r?t:(r=!0,t=e())},splitNonEscaped=e=>t=>{const r=q(f,e),s=[];let n,l,c=0,i=e.length,a=t.length;for(n=0;n<a;n++)for(l=0;l<i;l++)t.slice(n,n+r[l])===e[l]&&"\\"!==t[n-1]&&(s.push(t.slice(c,n)),n+=r[l]-1,c=n+1);return c!==t.length-1&&s.push(t.slice(c)),s},escape=(()=>{const e=/url\(.*?\)/g,t=/[,:;]/g;return r=>r.replace(e,e=>e.replace(t,e=>`\\${e}`))})(),unescape=s(O(i),H(/([^\\])\\([^\\])/g,"$1$2")),valuable=B(O(G),O(i)),join=(e,t)=>e.reduce((e,r,s)=>e+r+(t.length>s?t[s]:""),""),isObject=u(c("Object"),D),deepMerge=(e,t)=>{for(let r in t)isObject(e[r])&&isObject(t[r])?deepMerge(e[r],t[r]):e[r]=t[r];return e},isBrowser=(()=>{try{return isObject(window)}catch{return!1}})(),pickStyle=(e,t)=>e[t]||e[camelify(t)],pickStyles=(e,t,r)=>r.split(/[,\s\t]+/g).map(r=>pickStyle(t,r)||pickStyle(e(),r)||emptyObject),getRules=(e,t,r,s)=>{switch(t||(t=emptyObject),typeof r){case types.f:return[e=>r(e,s)];case types.o:return[b(r)];case types.s:return pickStyles(e,t,r).reduce((r,n)=>(r.push(...getRules(e,t,n,s)),r),[]);default:return[j]}};class Selector{constructor(e){this.rules={};const t=e.match(/^\.[\w-_]+/);this.s={className:t?t[0].slice(1):null,modifier:t?e.slice(t[0].length)||null:e}}get complex(){return null!==this.s.className&&null!==this.s.modifier}serialize(){const{className:e,modifier:t}=this.s;return(e?`.${e}`:"")+(t||"")}}const extractRules=(e,t=0)=>{const r={};let s,n,l,c,i;for(i in e.rules)s=e.rules[i],s instanceof Selector?(n=s.serialize(),l=0!=t&&"."==n[0]?`& ${n}`:n,c=s.complex?{[s.s.modifier]:extractRules(s,t+1)}:extractRules(s,t+1),console.log("Setting newRules.className",{key:l,newRules:c}),c.className=l,r[l]?deepMerge(r[l],c):r[l]=c):(console.log("Setting o.className",{tmp:s,o:r}),r.className=s,r[i]=s);return r};class Levels{constructor(){this.path=[],this.path.push([new Selector("__root")])}get out(){return extractRules(this.path[0][0])}get depth(){return this.path.length}add(e){const t=g(this.path),r=[];for(const s of e){const e=new Selector(s);for(const s of t){const t=e.serialize(),n=s.rules[t];r.push(n||e),n||(s.rules[t]=e)}}this.path.push(r)}merge(e,t){if(valuable(t)&&valuable(e))for(const r of g(this.path))r.rules[e]=t}pop(){return this.path.pop()}}const analyseLine=(()=>{const e=/^([\w-]+)(: *| +)(.*)$/,t=/^(([\|~\$@>\*\.:&\(\)\^="\-\[\]]+).*[ ,]*)+:?$/,r=/\s*,\s*/g,n=/(.*):$/;return(l,c,i)=>{let a;switch(!0){case"{"==c:l.add(i);break;case"}"==c:l.pop();break;case null!=(a=e.exec(c)):l.merge(unescape(camelify(a[1])),s(isNaN,unescape,(e=>{switch(e){case"undefined":case"":return;case"null":return null;default:return isNaN(+e)?e:+e}})(a[3])));break;case null!=(a=t.exec(c)):i.splice(0),i.push(...c.split(r).map(e=>e.replace(n,"$1")))}}})();class SvelteRenderer{constructor(e={}){const t=new Renderer(e).mixin;this.f=t.methods.f,this.fdef="function"==typeof e.defStyles?t.computed.fdef:e.defStyles&&t.computed[e.defStyles.key]}getCSS(){return e=>{const t={style:e,fdef:this.fdef};return(e,r)=>this.f.call(t,e,r)}}getLiteralCSS(){return(...e)=>{const t={style:css(...e),fdef:this.fdef};return(e,r)=>this.f.call(t,e,r)}}}const mergeProps=(e,t={})=>u(S,q(([e,r])=>{switch(D(r)){case"Array":return[e,[...r,...t[e]||[]]];case"Object":return[e,{...r,...t[e]||{}}];default:return[e,t[e]||r]}}),m)(e),defaultOpts={method:"f",defStyles:void 0,plugins:[],enhancers:[],preset:{unit:[]},ssr:!1};class Renderer{constructor(e={}){const{method:t,ssr:r,preset:s,plugins:n,enhancers:l,...c}=mergeProps(defaultOpts,e),i={...defaultOpts.preset,...s||{}};if(e.fdef)throw new Error("fela-vue: Change deprecated `fdef` to `defStyles`!");this.renderer=fela.createRenderer({...c,enhancers:l,plugins:[embedded(),prefixer(),fallback(),unit(...i.unit),...n]});const{renderer:a}=this,u=e.defStyles;let o,f;switch(typeof u){case types.o:[o,f]=[u.key,u.value];break;case types.f:[o,f]=["fdef",u]}isBrowser&&(r?felaDom.rehydrate(a):felaDom.render(a)),this._mixin=I(j,{methods:{[t](e,t={}){return a.renderRule(fela.combineRules(...getRules(memoize(()=>f?f(this):emptyObject),this.style,e,this)),t)||void 0}},computed:u&&{[o](){return f(this)}}})}get mixin(){return Object.freeze(this._mixin)}get style(){return felaDom.renderToMarkup(this.renderer)}}const errorString="fela-vue literal: unbalanced delimeter in functional expression !",findEntries=l(([e,t],r)=>{let s,n,l=r.length,c=e.length,i=0,a=[];for(s=0;s<l;s++)switch(r.slice(s,s+c)){case e:s+=c-1,0==i&&(n=s),i++;break;case t:if(s+=c-1,i--,0==i)a.push([n,s]);else if(i<0)throw new Error(errorString)}return a}),injectExpressions=e=>{const t=[];let r=0;for(let[s,n]of findEntries(["[","]"],e))t.push(e.slice(r,s),`\${${e.slice(s+1,n).replace(/(\W|^)\$([a-zA-Z_]+)\b/g,"$1$$ps.$2").replace(/(\W|^)@(.+?)\b/g,"$1$t.$2")}}`),r=n+1;return t.push(e.slice(r)),t.join("")},intoExpression=u(U("\n"),q(injectExpressions)),createFunctions=e=>{const t=[];let r,s,n,l=0,c=[];for(r of e)if(l>0)switch(r){case"{":l++,c[c.length-1]+=r;break;case"}":if(1==--l){const e=new Function("$t,css,$ps",`return css\`\n                ${intoExpression(c)}\n              \``);t.push([n,(t,r)=>e(r,css,t)]),l=0,c.splice(0)}else c[c.length-1]+=r;break;default:c.push(r)}else s=r.indexOf("=>"),~s?(l=1,n=r.slice(0,s).trim().replace(/^\./,"")):t.push(r);return t},parse=(()=>{const e=["\n","\r",";"],t=t=>e.includes(t),r=/(([\s^]+?\/\/.*$)|\/\*(.|[\n\r])*?\*\/)/gm;return s=>{const n=new Levels,l=[];return u(()=>n.out,z(e=>{if("Array"==D(e))n.merge(e[0],e[1]);else if(e&&analyseLine(n,e,l),n.depth<1)throw new Error("lit-css parse error: unbalanced {} braces !")}),createFunctions,I(O(G)),q(h),splitNonEscaped(e),H(/(\{|\})/g,(e,r,s,n)=>(t(n[s-1])||(r=";"+r),t(n[s+1])||(r+=";"),r)),escape,H(r,""))(s)}})(),css=(()=>(e,...t)=>parse(join(e,t)))(),mergeProps$1=(e,t={})=>u(S,q(([e,r])=>{switch(D(r)){case"Array":return[e,[...r,...t[e]||[]]];case"Object":return[e,{...r,...t[e]||{}}];default:return[e,t[e]||r]}}),m)(e),defaultOpts$1={method:"f",defStyles:void 0,plugins:[],enhancers:[],preset:{unit:[]},ssr:!1};class Renderer$1{constructor(e={}){const{method:t,ssr:r,preset:s,plugins:n,enhancers:l,...c}=mergeProps$1(defaultOpts$1,e),i={...defaultOpts$1.preset,...s||{}};if(e.fdef)throw new Error("fela-vue: Change deprecated `fdef` to `defStyles`!");this.renderer=fela.createRenderer({...c,enhancers:l,plugins:[embedded(),prefixer(),fallback(),unit(...i.unit),...n]});const{renderer:a}=this,u=e.defStyles;let o,f;switch(typeof u){case types.o:[o,f]=[u.key,u.value];break;case types.f:[o,f]=["fdef",u]}isBrowser&&(r?felaDom.rehydrate(a):felaDom.render(a)),this._mixin=I(j,{methods:{[t](e,t={}){return a.renderRule(fela.combineRules(...getRules(memoize(()=>f?f(this):emptyObject),this.style,e,this)),t)||void 0}},computed:u&&{[o](){return f(this)}}})}get mixin(){return Object.freeze(this._mixin)}get style(){return felaDom.renderToMarkup(this.renderer)}}exports.Renderer=Renderer$1,exports.SvelteRenderer=SvelteRenderer,exports.css=css;
