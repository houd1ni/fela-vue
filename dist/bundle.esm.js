import{when as e,complement as s,isNil as t,replace as r,both as n,isEmpty as l,compose as i,equals as c,type as o,map as a,ifElse as u,identity as f,prop as h,toPairs as p,length as d,last as m,qmergeDeep as g,curry as $,join as w,forEach as b,filter as y,trim as C,always as x,fromPairs as N}from"pepka";import{createRenderer as S,combineRules as _}from"fela";import{renderToMarkup as v,rehydrate as k,render as j}from"fela-dom";import z from"fela-plugin-embedded";import O from"fela-plugin-prefixer";import A from"fela-plugin-fallback-value";import E from"fela-plugin-unit";const W=Object.freeze({}),F=Object.freeze({f:"function",o:"object",s:"string"}),B=e=>e.replace(/-(\w)/gu,((e,s)=>s.toUpperCase())),L=(()=>{const e=/url\(.*?\)/g,s=/[,:;]/g;return t=>t.replace(e,(e=>e.replace(s,(e=>`\\${e}`))))})(),R=e(s(t),r(/([^\\])\\([^\\])/g,"$1$2")),U=n(s(l),s(t));i(c("Object"),o);const Z=i(c("Window"),o),q=(()=>{try{return Z(window)}catch{return!1}})(),D=a(u(i(c("Function"),o),f,h("default"))),G=(e,s)=>i(a((([e,t])=>((e,s,t)=>t(...e[s]||[]))(s,e,t))),p,D)(e);class H{s;rules={};__selector__=!0;get complex(){return null!==this.s.className&&null!==this.s.modifier}static isSelector(e){return Boolean(e&&e.__selector__)}serialize(){const{className:e,modifier:s}=this.s;return(e?`.${e}`:"")+(s||"")}findClass(e,s=this){if(s.s.className===e)return s;for(const t in s.rules){const r=s.rules[t];if(H.isSelector(r)){const s=r.findClass(e);if(s)return s}}return null}constructor(e){const s=e.match(/^\.[\w-_]+/);this.s={className:s?s[0].slice(1):null,modifier:s?e.slice(s[0].length)||null:e}}}const I=(e,s=0)=>{const t={};let r,n,l,i,c;for(c in e.rules)r=e.rules[c],H.isSelector(r)?(n=r.complex?r.s.className:r.serialize(),l=0==s&&"."==n[0]?n.slice(1):"."==n[0]?`& ${n}`:n,i=r.complex?{[r.s.modifier]:I(r,s+1)}:I(r,s+1),t[l]?g(t[l],i):t[l]=i):t[c]=r;return t};class J{path=[];get out(){return I(this.path[0][0])}get depth(){return this.path.length}add(e){const s=m(this.path),t=[];for(const r of e){const e=new H(r);for(const r of s){const s=e.serialize(),n=r.rules[s];t.push(n||e),n||(r.rules[s]=e)}}this.path.push(t)}merge(e,s){if(U(s)&&U(e))for(const t of m(this.path))t.rules[e]=s}findClass(e){for(const s of this.path)for(const t of s){const s=t.findClass(e);if(s)return s}return null}pop(){return this.path.pop()}constructor(){this.path.push([new H("__root")])}}const K=(()=>{const s=/^([\w-]+)(: *| +)(.*)$/,t=/^(([\|~\$@>\*\.:&\(\)\^="\-\[\]]+).*[ ,]*)+:?$/,r=/\.\.\.(\S*)$/,n=/\s*,\s*/g,l=/(.*):$/;return(i,c,o)=>{let a;switch(!0){case"{"==c:i.add(o);break;case"}"==c:i.pop();break;case null!==(a=r.exec(c)):const u=i.findClass(a[1]);if(u)for(const e in u.rules)i.merge(e,u.rules[e]);break;case null!==(a=s.exec(c)):i.merge(R(B(a[1])),e(isNaN,R,(e=>{switch(e){case"undefined":case"":return;case"null":return null;default:return isNaN(+e)?e:+e}})(a[3])));break;case null!==(a=t.exec(c)):o.splice(0),o.push(...c.split(n).map((e=>e.replace(l,"$1"))))}}})(),M=$((([e,s],t)=>{let r,n,l=t.length,i=e.length,c=0,o=[];for(r=0;r<l;r++)switch(t.slice(r,r+i)){case e:r+=i-1,0==c&&(n=r),c++;break;case s:if(r+=i-1,c--,0==c)o.push([n,r]);else if(c<0)throw new Error("fela-vue literal: unbalanced delimeter in functional expression !")}return o})),P=i(w("\n"),a((e=>{const s=[];let t=0;for(let[r,n]of M(["[","]"],e))s.push(e.slice(t,r),`\${${e.slice(r+1,n).replace(/(\W|^)\$([a-zA-Z_]+)\b/g,"$1$$ps.$2").replace(/(\W|^)@(.+?)\b/g,"$1$t.$2")}}`),t=n+1;return s.push(e.slice(t)),s.join("")}))),Q=e=>{const s=[];let t,r,n,l=0,i=[];for(t of e)if(l>0)switch(t){case"{":l++,i[i.length-1]+=t;break;case"}":if(1==--l){const e=new Function("$t,css,$ps",`return css\`\n                ${P(i)}\n              \``);s.push([n,(s,t)=>e(t,V,s)]),l=0,i.splice(0)}else i[i.length-1]+=t;break;default:i.push(t)}else r=t.indexOf("=>"),~r?(l=1,n=t.slice(0,r).trim().replace(/^\./,"")):s.push(t);return s},T=(()=>{const e=["\n","\r",";"],t=s=>e.includes(s),n=/(([\s^]+?\/\/.*$)|\/\*(.|[\n\r])*?\*\/)/gm;return c=>{const u=new J,f=[];return i((()=>u.out),b((e=>{if("Array"==o(e))u.merge(e[0],e[1]);else if(e&&K(u,e,f),u.depth<1)throw new Error("lit-css parse error: unbalanced {} braces !")})),Q,y(s(l)),a(C),(h=e,e=>{const s=a(d,h),t=[];let r,n,l=0,i=h.length,c=e.length;for(r=0;r<c;r++)for(n=0;n<i;n++)e.slice(r,r+s[n])===h[n]&&"\\"!==e[r-1]&&(t.push(e.slice(l,r)),r+=s[n]-1,l=r+1);return l!==e.length-1&&t.push(e.slice(l)),t}),r(/(\{|\})/g,((e,s,r,n)=>(t(n[r-1])||(s=";"+s),t(n[r+1])||(s+=";"),s))),L,r(n,""))(c);var h}})(),V=(e,...s)=>T(((e,s)=>e.reduce(((e,t,r)=>e+t+(s.length>r?s[r]:"")),""))(e,s)),X=(e,s)=>e[s]||e[B(s)],Y=(e,s,t,r)=>{switch(s||(s=W),typeof t){case F.f:return[t.name,[e=>t(e,r)]];case F.o:return[t.className,[x(t)]];case F.s:const n=((e,s,t)=>t.split(/[,\s\t]+/g).map((t=>[t,X(s,t)||X(e(),t)||W])))(e,s,t),l=[],i=[];for(const[t,c]of n)l.push(t),i.push(...Y(e,s,c,r)[1]);return[l.join("_"),i];default:return["",[f]]}},ee={method:"f",defStyles:void 0,plugins:[],enhancers:[],preset:{unit:[]},ssr:!1};class se{static devClassNames=!1;renderer;_mixin;renderClasses;styl;get mixin(){return Object.freeze(this._mixin)}get style(){return v(this.renderer)}constructor(e={}){const{method:s,ssr:t,preset:r,plugins:n,enhancers:l,...c}=((e,s={})=>i(N,a((([e,t])=>{switch(o(t)){case"Array":return[e,[...t,...s[e]||[]]];case"Object":return[e,{...t,...s[e]||{}}];default:return[e,s[e]||t]}})),p)(e))(ee,e),u={...ee.preset,...r||{}},h=this;if(e.fdef)throw new Error("fela-vue: Change deprecated `fdef` to `defStyles`!");this.renderer=S({...c,enhancers:l,plugins:G([E,z,O,A,...n],{0:u.unit})});const{renderer:d}=this,m=e.defStyles;let g,$;switch(typeof m){case F.o:[g,$]=[m.key,m.value];break;case F.f:[g,$]=["fdef",m]}q&&(t?k(d):j(d)),this.renderClasses=function(e,s,t={}){const[r,n]=Y((e=>{let s,t=!1;return()=>t?s:(t=!0,s=e())})((()=>$?$(this):W)),e,s,this);return d.renderRule(((e,s,t)=>{if(t&&s&&"anonymous"!==s)return{[s]:(s,t)=>e(s,t)}[s];return e})(_(...n),r,se.devClassNames),t)||void 0},this.styl=e=>(...s)=>this.renderClasses(e,...s),this._mixin=y(f,{methods:{[s]:function(...e){return h.renderClasses.call(this,this.style,...e)}},computed:m&&{[g](){return $(this)}}})}}class te extends se{static get devClassNames(){return se.devClassNames}static set devClassNames(e){se.devClassNames=e}f;fdef;getCSS(){return e=>{const s={style:e,fdef:this.fdef};return(e,t)=>this.f.call(s,e,t)}}getLiteralCSS(){const e=this.getCSS();return(...s)=>e(V(...s))}constructor(e={}){super(e);const s=this.mixin;this.f=s.methods.f,this.fdef="function"==typeof e.defStyles?s.computed.fdef:e.defStyles&&s.computed[e.defStyles.key]}}export{se as Renderer,te as SvelteRenderer,V as css};
