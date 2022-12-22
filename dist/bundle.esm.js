import{when as e,complement as t,isNil as s,replace as r,both as n,isEmpty as o,compose as i,equals as l,type as c,map as a,ifElse as u,identity as f,prop as p,toPairs as d,length as h,last as m,qmergeDeep as g,fromPairs as w,reverse as b,curry as $,join as y,forEach as C,filter as v,trim as x,always as S}from"pepka";import{createRenderer as N,combineRules as _}from"fela";import{renderToMarkup as k,rehydrate as j,render as z}from"fela-dom";import O from"fela-plugin-embedded";import A from"fela-plugin-prefixer";import E from"fela-plugin-fallback-value";import P from"fela-plugin-unit";const R=Object.freeze({}),W=Object.freeze({f:"function",o:"object",s:"string"}),q=e=>e.replace(/-(\w)/gu,((e,t)=>t.toUpperCase())),B=(()=>{const e=/url\(.*?\)/g,t=/[,:;]/g;return s=>s.replace(e,(e=>e.replace(t,(e=>`\\${e}`))))})(),F=e(t(s),r(/([^\\])\\([^\\])/g,"$1$2")),L=n(t(o),t(s));i(l("Object"),c);const U=i(l("Window"),c),Z=(()=>{try{return U(window)}catch{return!1}})(),D=a(u(i(l("Function"),c),f,p("default"))),G=(e,t)=>i(a((([e,s])=>((e,t,s)=>s(...e[t]||[]))(t,e,s))),d,D)(e);class H{s;rules={};__selector__=!0;get complex(){return null!==this.s.className&&null!==this.s.modifier}static isSelector(e){return Boolean(e&&e.__selector__)}serialize(){const{className:e,modifier:t}=this.s;return(e?`.${e}`:"")+(t||"")}findClass(e,t=this){if(t.s.className===e)return t;for(const s in t.rules){const r=t.rules[s];if(H.isSelector(r)){const t=r.findClass(e);if(t)return t}}return null}constructor(e){const t=e.match(/^\.[\w-_]+/);this.s={className:t?t[0].slice(1):null,modifier:t?e.slice(t[0].length)||null:e}}}const I=(e,t=0)=>{const s={};let r,n,o,i,l;for(l in e.rules)r=e.rules[l],H.isSelector(r)?(n=r.complex?r.s.className:r.serialize(),o=0==t&&"."==n[0]?n.slice(1):"."==n[0]?`& ${n}`:n,i=r.complex?{[r.s.modifier]:I(r,t+1)}:I(r,t+1),s[o]?g(s[o],i):s[o]=i):s[l]=r;return s};class J{path=[];get out(){return I(this.path[0][0])}get depth(){return this.path.length}add(e){const t=m(this.path),s=[];for(const r of e){const e=new H(r);for(const r of t){const t=e.serialize(),n=r.rules[t];s.push(n||e),n||(r.rules[t]=e)}}this.path.push(s)}merge(e,t){if(L(t)&&L(e))for(const s of m(this.path))s.rules[e]=t}findClass(e){for(const t of this.path)for(const s of t){const t=s.findClass(e);if(t)return t}return null}pop(){return this.path.pop()}constructor(){this.path.push([new H("__root")])}}const K="\ntop flex grid overflow transform transition-duration max-height\nmargin margin-top margin-left margin-bottom margin-right justify-content\nborder width height border-radius background bottom position align-items\ncenter bottom absolute relative float right opacity z-index min-width\nmin-height border-top border-bottom filter fixed padding left color\nfont-weight font-size none hidden auto display\n".replace(/\s+/g,",").split(/[, ]/g).filter(Boolean);let M=0;const Q=e=>{M=0;const{compose:t,fromPairs:s,map:r,reverse:n,toPairs:o}=e,i=t(s,r((e=>[e,"a"+M++])))(K);return{dic:i,dicRev:t(s,r(n),o)(i)}};let T=!1;const V=e=>T=e,X=Q({compose:i,fromPairs:w,map:a,reverse:b,toPairs:d}),Y=(()=>{const t=/^([\w-]+)(: *| +)(.*)$/,s=/^(([\|~\$@>\*\.:&\(\)\^="\-\[\]]+).*[ ,]*)+:?$/,r=/\.\.\.(\S*)$/,n=/\s*,\s*/g,o=/(.*):$/,i=e((()=>T),(e=>X.dicRev[e]||e));return(l,c,a)=>{let u;switch(!0){case"{"==c:l.add(a);break;case"}"==c:l.pop();break;case null!==(u=r.exec(c)):const f=l.findClass(u[1]);if(f)for(const e in f.rules)l.merge(e,f.rules[e]);break;case null!==(u=t.exec(c)):l.merge(F(q(i(u[1]))),e(isNaN,F,(e=>{switch(e){case"undefined":case"":return;case"null":return null;default:return isNaN(+e)?e:+e}})(i(u[3]))));break;case null!==(u=s.exec(c)):a.splice(0),a.push(...c.split(n).map((e=>e.replace(o,"$1"))))}}})(),ee=$((([e,t],s)=>{let r,n,o=s.length,i=e.length,l=0,c=[];for(r=0;r<o;r++)switch(s.slice(r,r+i)){case e:r+=i-1,0==l&&(n=r),l++;break;case t:if(r+=i-1,l--,0==l)c.push([n,r]);else if(l<0)throw new Error("fela-vue literal: unbalanced delimeter in functional expression !")}return c})),te=i(y("\n"),a((e=>{const t=[];let s=0;for(let[r,n]of ee(["[","]"],e))t.push(e.slice(s,r),`\${${e.slice(r+1,n).replace(/(\W|^)\$([a-zA-Z_]+)\b/g,"$1$$ps.$2").replace(/(\W|^)@(.+?)\b/g,"$1$t.$2")}}`),s=n+1;return t.push(e.slice(s)),t.join("")}))),se=e=>t=>{const s=[];let r,n,o,i=0,l=[];for(r of t)if(i>0)switch(r){case"{":i++,l[l.length-1]+=r;break;case"}":if(1==--i){if(e){const e=`($ps, $t) => css\`${te(l)}\``;s.push([o,e])}else{const e=new Function("$t,css,$ps",`return css\`\n                ${te(l)}\n              \``);s.push([o,(t,s)=>e(s,ce,t)])}i=0,l.splice(0)}else l[l.length-1]+=r;break;default:l.push(r)}else n=r.indexOf("=>"),~n?(i=1,o=r.slice(0,n).trim().replace(/^\./,"")):s.push(r);return s},re=(()=>{const e=["\n","\r",";"],s=t=>e.includes(t),n=/(([\s^]+?\/\/.*$)|\/\*(.|[\n\r])*?\*\/)/gm;return(l,u=!1)=>{const f=new J,p=[];return i((()=>f.out),C((e=>{if("Array"==c(e))f.merge(e[0],e[1]);else if(e&&Y(f,e,p),f.depth<1)throw new Error("lit-css parse error: unbalanced {} braces !")})),se(u),v(t(o)),a(x),(d=e,e=>{const t=a(h,d),s=[];let r,n,o=0,i=d.length,l=e.length;for(r=0;r<l;r++)for(n=0;n<i;n++)e.slice(r,r+t[n])===d[n]&&"\\"!==e[r-1]&&(s.push(e.slice(o,r)),r+=t[n]-1,o=r+1);return o!==e.length-1&&s.push(e.slice(o)),s}),r(/(\{|\})/g,((e,t,r,n)=>(s(n[r-1])||(t=";"+t),s(n[r+1])||(t+=";"),t))),B,r(n,""))(l);var d}})(),ne=(e,t)=>e[t]||e[q(t)],oe=(e,t,s,r)=>{switch(t||(t=R),typeof s){case W.f:return[s.name,[e=>s(e,r)]];case W.o:return[s.className,[S(s)]];case W.s:const n=((e,t,s)=>s.split(/[,\s\t]+/g).map((s=>[s,ne(t,s)||ne(e(),s)||R])))(e,t,s),o=[],i=[];for(const[s,l]of n)o.push(s),i.push(...oe(e,t,l,r)[1]);return[o.join("_"),i];default:return["",[f]]}},ie=function(e,t){if(!s(window)&&!s(window.document))for(const s in e){const r=e[s],n=[];for(const e in r){const t=r[e];"Object"==c(t)?this.setClasses(t,document.querySelectorAll(s+e)):n.push([e,t])}if(n.length){const e=(0,this.renderClasses)(null,w(n)).split(" ");(t||document.querySelectorAll(s)).forEach((t=>t.classList.add(...e)))}}},le=e=>(t,...s)=>re(((e,t)=>e.reduce(((e,s,r)=>e+s+(t.length>r?t[r]:"")),""))(t,s),e),ce=le(!1),ae=le(!0),ue={method:"f",defStyles:void 0,plugins:[],enhancers:[],preset:{unit:[]},ssr:!1};class fe{static devClassNames=!1;renderer;_mixin;renderClasses;styl;get mixin(){return Object.freeze(this._mixin)}get style(){return k(this.renderer)}setClasses=ie;constructor(e={}){const{method:t,ssr:s,preset:r,plugins:n,enhancers:o,...l}=((e,t={})=>i(w,a((([e,s])=>{switch(c(s)){case"Array":return[e,[...s,...t[e]||[]]];case"Object":return[e,{...s,...t[e]||{}}];default:return[e,t[e]||s]}})),d)(e))(ue,e),u={...ue.preset,...r||{}},p=this;if(e.fdef)throw new Error("fela-vue: Change deprecated `fdef` to `defStyles`!");this.renderer=N({...l,enhancers:o,plugins:G([P,O,A,E,...n],{0:u.unit})});const{renderer:h}=this,m=e.defStyles;let g,b;switch(typeof m){case W.o:[g,b]=[m.key,m.value];break;case W.f:[g,b]=["fdef",m]}Z&&(s?j(h):z(h)),this.renderClasses=(e,t,s={})=>{const[r,n]=oe((e=>{let t,s=!1;return()=>s?t:(s=!0,t=e())})((()=>b?b(this):R)),e,t,this);return h.renderRule(((e,t,s)=>{if(s&&t&&"anonymous"!==t)return{[t]:(t,s)=>e(t,s)}[t];return e})(_(...n),r,fe.devClassNames),s)||void 0},this.styl=e=>(...t)=>this.renderClasses(e,...t),this._mixin=v(f,{methods:{[t]:function(...e){return p.renderClasses.call(this,this.style,...e)}},computed:m&&{[g](){return b(this)}}})}}class pe extends fe{static get devClassNames(){return fe.devClassNames}static set devClassNames(e){fe.devClassNames=e}f;fdef;getCSS(){return e=>{const t={style:e,fdef:this.fdef};return(e,s)=>this.f.call(t,e,s)}}getLiteralCSS(){const e=this.getCSS();return(...t)=>e(ce(...t))}constructor(e={}){super(e);const t=this.mixin;this.f=t.methods.f,this.fdef="function"==typeof e.defStyles?t.computed.fdef:e.defStyles&&t.computed[e.defStyles.key]}}let de=null;const he=function(){return{name:"fela-vue-compression",async transform(e){const t=await import("pepka");de||(de=Q(t));const s=((e,t)=>{const{compose:s,replace:r}=t;return s(r(/[\n\r]{2,}|(?:;\s)/g,"\n"),r(/(^|\r|\n)+[\t ]+/g,"$1"),r(/(^|\r|\n|;|{)\s*([a-z-]+)[ :][\t ]*?:?[\t ]*?([^;\r\n]+)/g,((t,s,r,n)=>s+(r&&n?`${e.dic[r]||r}:${e.dic[n]||n};`:r?t.replace(r,e.dic[r]||r):n?t.replace(r,e.dic[n]||n):t))))})(de,t);let r=e;try{r=e.replace(/css\`((.|\s)*?)\`/g,((e,t)=>`css\`${s(t)}\``))}catch(e){console.warn(e)}return{code:r,map:null}}}};export{fe as Renderer,pe as SvelteRenderer,ae as __specialcss,ce as css,he as rollupCSSCompression,V as setCompression};
