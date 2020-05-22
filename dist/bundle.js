"use strict";function e(e){return e&&"object"==typeof e&&"default"in e?e.default:e}Object.defineProperty(exports,"__esModule",{value:!0});var r=require("fela"),t=require("fela-dom"),s=e(require("fela-plugin-embedded")),n=e(require("fela-plugin-prefixer")),c=e(require("fela-plugin-fallback-value")),l=e(require("fela-plugin-unit"));const u=function(){},i=e=>{let r=0;for(const t of e)t!==u&&r++;return r},a=(e,r)=>{const t=e.length,s=e.slice(),n=r.length;let c=n,l=0;for(;c&&l<t;l++)s[l]===u&&(s[l]=r[n-c],c--);for(l=t;c;l++,c--)s[l]=r[n-c];return s},o=(e,r,t)=>{const s=e.length-r.length-i(t);if(s<1)return e(...a(r,t));{const n=(...s)=>o(e,a(r,t),s);return n.$args_left=s,n}},f=e=>(...r)=>e.length>i(r)?o(e,[],r):e(...r),h=e=>typeof e,p=e=>null===e,d=e=>"number"==h(e),g={u:"U",b:"B",n:"N",s:"S",f:"F"},m=e=>{const r=h(e);return"object"===r?p(e)?"Null":e.constructor.name:g[r[0]]+r.slice(1)},b=f((e,r,t)=>t.reduce(e,r)),y=f((e,r,t)=>{for(let s in t)switch(m(t[s])){case"Array":if(e>1&&"Array"===m(r[s]))switch(e){case 2:const n=r[s],c=t[s];for(const r in c)n[r]?y(e,n[r],c[r]):n[r]=c[r];break;case 3:r[s].push(...t[s])}else r[s]=t[s];break;case"Object":if("Object"===m(r[s])){y(e,r[s],t[s]);break}default:r[s]=t[s]}return r}),w=(y(1),y(2),y(3),f((e,r)=>{const t=m(e);if(t===m(r)&&("Object"===t||"Array"==t)){if(p(e)||p(r))return e===r;if(e===r)return!0;for(const t of[e,r])for(const s in t)if(!(t===r&&s in e||t===e&&s in r&&w(e[s],r[s])))return!1;return!0}return e===r})),$=f((e,r,t,s)=>e(s)?r(s):t(s)),v=f((e,r,t)=>$(e,r,A,t)),N=(...e)=>r=>{for(let t=O(e)-1;t>-1;t--)r=e[t](r);return r},j=f((e,r)=>r[e]),x=f((e,r,t)=>t.slice(e,d(r)?r:1/0)),S=j(0),k=(x(1,null),e=>p(e)||(e=>void 0===e)(e)),O=e=>e.length,C=e=>()=>e,A=e=>e,_=e=>e.trim(),z=e=>e[O(e)-1],q=e=>(...r)=>{const t=e(...r);return"function"===h(t)&&t.$args_left?q(t):!t},R=e=>Object.entries(e),E=f((e,r,t)=>({...t,[e]:r})),B=f((e,r)=>r[e]),W=f((e,r,t)=>$(O,()=>{return k(t)?e:N($(k,C(e),t=>W(e,x(1,null,r),t)),(s=B,f((e,r)=>s(r,e)))(t),S)(r);var s},C(t),r)),F=(W(void 0),/^(.*?)(8|16|32|64)(Clamped)?Array$/),M=e=>{const r=m(e);switch(r){case"Null":return e;case"Array":return T(M,e);case"Object":const t={};for(let r in e)t[r]=M(e[r]);return t;case"String":case"Number":case"Boolean":case"Symbol":return e;default:return F.test(r)?T(M,e):e}},U=f((e,r,t)=>b(e,M(r),t)),L=e=>U((e,r)=>E(...r,e),{},e),P=f((e,r)=>r.join(e)),T=f((e,r)=>r.map(e)),Z=f((e,r)=>r.forEach(e)),D=f((e,r,t)=>r(t)&&e(t)),G=e=>{switch(m(e)){case"String":case"Array":return 0==O(e);case"Object":for(const r in e)return!1;return!0;default:return null}},H=f((e,r,t)=>t.replace(e,r)),I=f((e,r)=>{return t=r,Array.isArray(t)?r.filter(e):N(L,I(([r,t])=>e(t,r)),R)(r);var t}),J=Object.freeze({}),K=Object.freeze({f:"function",o:"object",s:"string"}),Q=e=>e.replace(/-(\w)/gu,(e,r)=>r.toUpperCase()),V=(()=>{const e=/url\(.*?\)/g,r=/[,:;]/g;return t=>t.replace(e,e=>e.replace(r,e=>"\\"+e))})(),X=v(q(k),H(/([^\\])\\([^\\])/g,"$1$2")),Y=D(q(G),q(k)),ee=N(w("Object"),m),re=N(w("Window"),m),te=(e,r)=>{for(let t in r)ee(e[t])&&ee(r[t])?te(e[t],r[t]):e[t]=r[t];return e},se=(()=>{try{return re(window)}catch{return!1}})();class ne{constructor(e){this.rules={};const r=e.match(/^\.[\w-_]+/);this.s={className:r?r[0].slice(1):null,modifier:r?e.slice(r[0].length)||null:e}}get complex(){return null!==this.s.className&&null!==this.s.modifier}serialize(){const{className:e,modifier:r}=this.s;return(e?"."+e:"")+(r||"")}}const ce=(e,r=0)=>{const t={};let s,n,c,l,u;for(u in e.rules)s=e.rules[u],s instanceof ne?(n=s.complex?s.s.className:s.serialize(),c=0==r&&"."==n[0]?n.slice(1):"."==n[0]?"& "+n:n,l=s.complex?{[s.s.modifier]:ce(s,r+1)}:ce(s,r+1),t[c]?te(t[c],l):t[c]=l):t[u]=s;return t};class le{constructor(){this.path=[],this.path.push([new ne("__root")])}get out(){return ce(this.path[0][0])}get depth(){return this.path.length}add(e){const r=z(this.path),t=[];for(const s of e){const e=new ne(s);for(const s of r){const r=e.serialize(),n=s.rules[r];t.push(n||e),n||(s.rules[r]=e)}}this.path.push(t)}merge(e,r){if(Y(r)&&Y(e))for(const t of z(this.path))t.rules[e]=r}pop(){return this.path.pop()}}const ue=(()=>{const e=/^([\w-]+)(: *| +)(.*)$/,r=/^(([\|~\$@>\*\.:&\(\)\^="\-\[\]]+).*[ ,]*)+:?$/,t=/\s*,\s*/g,s=/(.*):$/;return(n,c,l)=>{let u;switch(!0){case"{"==c:n.add(l);break;case"}"==c:n.pop();break;case null!=(u=e.exec(c)):n.merge(X(Q(u[1])),v(isNaN,X,(e=>{switch(e){case"undefined":case"":return;case"null":return null;default:return isNaN(+e)?e:+e}})(u[3])));break;case null!=(u=r.exec(c)):l.splice(0),l.push(...c.split(t).map(e=>e.replace(s,"$1")))}}})(),ie=(e,r)=>e[r]||e[Q(r)],ae=(e,r,t,s)=>{switch(r||(r=J),typeof t){case K.f:return[t.name,[e=>t(e,s)]];case K.o:return[t.className,[C(t)]];case K.s:const n=((e,r,t)=>t.split(/[,\s\t]+/g).map(t=>[t,ie(r,t)||ie(e(),t)||J]))(e,r,t),c=[],l=[];for(const[t,u]of n)c.push(t),l.push(...ae(e,r,u,s)[1]);return[c.join("_"),l];default:return["",[A]]}},oe={method:"f",defStyles:void 0,plugins:[],enhancers:[],preset:{unit:[]},ssr:!1};let fe=(()=>{class e{constructor(u={}){const{method:i,ssr:a,preset:o,plugins:f,enhancers:h,...p}=((e,r={})=>N(L,T(([e,t])=>{switch(m(t)){case"Array":return[e,[...t,...r[e]||[]]];case"Object":return[e,{...t,...r[e]||{}}];default:return[e,r[e]||t]}}),R)(e))(oe,u),d={...oe.preset,...o||{}};if(u.fdef)throw new Error("fela-vue: Change deprecated `fdef` to `defStyles`!");this.renderer=r.createRenderer({...p,enhancers:h,plugins:[s(),n(),c(),l(...d.unit),...f]});const{renderer:g}=this,b=u.defStyles;let y,w;switch(typeof b){case K.o:[y,w]=[b.key,b.value];break;case K.f:[y,w]=["fdef",b]}console.log({isBrowser:se,ssr:a,renderer:g}),se&&(a?t.rehydrate(g):t.render(g)),this._mixin=I(A,{methods:{[i](t,s={}){const[n,c]=ae((e=>{let r,t=!1;return()=>t?r:(t=!0,r=e())})(()=>w?w(this):J),this.style,t,this);return g.renderRule(((e,r,t)=>{if(t&&r&&"anonymous"!==r){return{[r]:(r,t)=>e(r,t)}[r]}return e})(r.combineRules(...c),n,e.devClassNames),s)||void 0}},computed:b&&{[y](){return w(this)}}})}get mixin(){return Object.freeze(this._mixin)}get style(){return t.renderToMarkup(this.renderer)}}return e.devClassNames=!1,e})();const he=f(([e,r],t)=>{let s,n,c=t.length,l=e.length,u=0,i=[];for(s=0;s<c;s++)switch(t.slice(s,s+l)){case e:s+=l-1,0==u&&(n=s),u++;break;case r:if(s+=l-1,u--,0==u)i.push([n,s]);else if(u<0)throw new Error("fela-vue literal: unbalanced delimeter in functional expression !")}return i}),pe=N(P("\n"),T(e=>{const r=[];let t=0;for(let[s,n]of he(["[","]"],e))r.push(e.slice(t,s),`\${${e.slice(s+1,n).replace(/(\W|^)\$([a-zA-Z_]+)\b/g,"$1$$ps.$2").replace(/(\W|^)@(.+?)\b/g,"$1$t.$2")}}`),t=n+1;return r.push(e.slice(t)),r.join("")})),de=e=>{const r=[];let t,s,n,c=0,l=[];for(t of e)if(c>0)switch(t){case"{":c++,l[l.length-1]+=t;break;case"}":if(1==--c){const e=new Function("$t,css,$ps",`return css\`\n                ${pe(l)}\n              \``);r.push([n,(r,t)=>e(t,me,r)]),c=0,l.splice(0)}else l[l.length-1]+=t;break;default:l.push(t)}else s=t.indexOf("=>"),~s?(c=1,n=t.slice(0,s).trim().replace(/^\./,"")):r.push(t);return r},ge=(()=>{const e=["\n","\r",";"],r=r=>e.includes(r),t=/(([\s^]+?\/\/.*$)|\/\*(.|[\n\r])*?\*\/)/gm;return s=>{const n=new le,c=[];return N(()=>n.out,Z(e=>{if("Array"==m(e))n.merge(e[0],e[1]);else if(e&&ue(n,e,c),n.depth<1)throw new Error("lit-css parse error: unbalanced {} braces !")}),de,I(q(G)),T(_),(l=e,e=>{const r=T(O,l),t=[];let s,n,c=0,u=l.length,i=e.length;for(s=0;s<i;s++)for(n=0;n<u;n++)e.slice(s,s+r[n])===l[n]&&"\\"!==e[s-1]&&(t.push(e.slice(c,s)),s+=r[n]-1,c=s+1);return c!==e.length-1&&t.push(e.slice(c)),t}),H(/(\{|\})/g,(e,t,s,n)=>(r(n[s-1])||(t=";"+t),r(n[s+1])||(t+=";"),t)),V,H(t,""))(s);var l}})(),me=(e,...r)=>ge(((e,r)=>e.reduce((e,t,s)=>e+t+(r.length>s?r[s]:""),""))(e,r));exports.Renderer=fe,exports.SvelteRenderer=class extends fe{constructor(e={}){super(e);const r=this.mixin;this.f=r.methods.f,this.fdef="function"==typeof e.defStyles?r.computed.fdef:e.defStyles&&r.computed[e.defStyles.key]}static get devClassNames(){return fe.devClassNames}static set devClassNames(e){fe.devClassNames=e}getCSS(){return e=>{const r={style:e,fdef:this.fdef};return(e,t)=>this.f.call(r,e,t)}}getLiteralCSS(){const e=this.getCSS();return(...r)=>e(me(...r))}},exports.css=me;
