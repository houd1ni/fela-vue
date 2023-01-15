import{when as e,complement as t,isNil as s,replace as r,both as n,isEmpty as i,compose as o,equals as l,type as c,map as a,ifElse as u,identity as f,prop as p,toPairs as d,length as h,last as m,qmergeDeep as g,fromPairs as b,reverse as $,curry as w,join as y,forEach as C,filter as x,trim as v,always as S}from"pepka";import{createRenderer as k,combineRules as N}from"fela";import{renderToMarkup as _,rehydrate as j,render as z}from"fela-dom";import O from"fela-plugin-embedded";import A from"fela-plugin-prefixer";import E from"fela-plugin-fallback-value";import P from"fela-plugin-unit";const R=Object.freeze({}),W=Object.freeze({f:"function",o:"object",s:"string"}),q=e=>e.replace(/-(\w)/gu,((e,t)=>t.toUpperCase())),B=(()=>{const e=/url\(.*?\)/g,t=/[,:;]/g;return s=>s.replace(e,(e=>e.replace(t,(e=>`\\${e}`))))})(),F=e(t(s),r(/([^\\])\\([^\\])/g,"$1$2")),L=n(t(i),t(s));o(l("Object"),c);const U=o(l("Window"),c),Z=(()=>{try{return U(window)}catch{return!1}})(),D=a(u(o(l("Function"),c),f,p("default"))),G=(e,t)=>o(a((([e,s])=>((e,t,s)=>s(...e[t]||[]))(t,e,s))),d,D)(e),H=/((\s+?\/\/.*$)|\/\*(.|[\n\r])*?\*\/)/gm,I=/[\n\r]{2,}|(?:;\s)/g,J=/(^|\r|\n)+[\t ]+/g,K=/[;\n\r]+/g,M=/(?:(}|{|]|)^[;\n\r ]+)|(?:[;\n\r ]+($|}|{|]))/g,Q=/^([\w-]+)(: *| +)(.*)$/,T=/(^|\r|\n|;|{)\s*([a-z-]+)[ :][\t ]*?:?[\t ]*?([^;\r\n]+)/g,V=/^(([\|~\$@>\*\.:&\(\)\^="\-\[\]]+).*[ ,]*)+:?$/,X=/^\.\.\.(\S*)$/,Y=/\s*,\s*/g,ee=/(.*):$/;class te{s;rules={};__selector__=!0;get complex(){return null!==this.s.className&&null!==this.s.modifier}static isSelector(e){return Boolean(e&&e.__selector__)}serialize(){const{className:e,modifier:t}=this.s;return(e?`.${e}`:"")+(t||"")}findClass(e,t=this){if(t.s.className===e)return t;for(const s in t.rules){const r=t.rules[s];if(te.isSelector(r)){const t=r.findClass(e);if(t)return t}}return null}constructor(e){const t=e.match(/^\.[\w-_]+/);this.s={className:t?t[0].slice(1):null,modifier:t?e.slice(t[0].length)||null:e}}}const se=(e,t=0)=>{const s={};let r,n,i,o,l;for(l in e.rules)r=e.rules[l],te.isSelector(r)?(n=r.complex?r.s.className:r.serialize(),i=0==t&&"."==n[0]?n.slice(1):"."==n[0]?`& ${n}`:n,o=r.complex?{[r.s.modifier]:se(r,t+1)}:se(r,t+1),s[i]?g(s[i],o):s[i]=o):s[l]=r;return s};class re{path=[];get out(){return se(this.path[0][0])}get depth(){return this.path.length}add(e){const t=m(this.path),s=[];for(const r of e){const e=new te(r);for(const r of t){const t=e.serialize(),n=r.rules[t];s.push(n||e),n||(r.rules[t]=e)}}this.path.push(s)}merge(e,t){if(L(t)&&L(e))for(const s of m(this.path))s.rules[e]=t}findClass(e){for(const t of this.path)for(const s of t){const t=s.findClass(e);if(t)return t}return null}pop(){return this.path.pop()}constructor(){this.path.push([new te("__root")])}}const ne="\ntop flex grid overflow transform transition-duration max-height\nmargin margin-top margin-left margin-bottom margin-right justify-content\nborder width height border-radius background bottom position align-items\ncenter bottom absolute relative float right opacity z-index min-width\nmin-height border-top border-bottom filter fixed left color space-between\nfont-weight font-size none hidden auto display block inline inline-block\npadding padding-top padding-bottom paddin-left padding-right text-align\nflex-direction column\n".replace(/\s+/g,",").split(/[, ]/g).filter(Boolean);let ie=0;const oe=e=>{ie=0;const{compose:t,fromPairs:s,map:r,reverse:n,toPairs:i}=e,o=t(s,r((e=>[e,"a"+ie++])))(ne);return{dic:o,dicRev:t(s,r(n),i)(o)}};let le=!1;const ce=e=>le=e,ae=oe({compose:o,fromPairs:b,map:a,reverse:$,toPairs:d}),ue=(()=>{const t=Q,s=V,r=X,n=Y,i=ee,o=e((()=>le),(e=>ae.dicRev[e]||e));return(l,c,a)=>{let u;switch(!0){case"{"==c:l.add(a);break;case"}"==c:l.pop();break;case null!==(u=r.exec(c)):const f=l.findClass(u[1]);if(f)for(const e in f.rules)l.merge(e,f.rules[e]);break;case null!==(u=t.exec(c)):l.merge(F(q(o(u[1]))),e(isNaN,F,(e=>{switch(e){case"undefined":case"false":case"":return;case"null":return null;default:return isNaN(+e)?e:+e}})(o(u[3]))));break;case null!==(u=s.exec(c)):a.splice(0),a.push(...c.split(n).map((e=>e.replace(i,"$1"))))}}})(),fe=w((([e,t],s)=>{let r,n,i=s.length,o=e.length,l=0,c=[];for(r=0;r<i;r++)switch(s.slice(r,r+o)){case e:r+=o-1,0==l&&(n=r),l++;break;case t:if(r+=o-1,l--,0==l)c.push([n,r]);else if(l<0)throw new Error("fela-vue literal: unbalanced delimeter in functional expression !")}return c})),pe=o(y("\n"),a((e=>{const t=[];let s=0;for(let[r,n]of fe(["[","]"],e))t.push(e.slice(s,r),`\${${e.slice(r+1,n).replace(/(\W|^)\$([a-zA-Z_]+)\b/g,"$1$$ps.$2").replace(/(\W|^)@(.+?)\b/g,"$1$t.$2")}}`),s=n+1;return t.push(e.slice(s)),t.join("")}))),de=e=>t=>{const s=[];let r,n,i,o=0,l=[];for(r of t)if(o>0)switch(r){case"{":o++,l[l.length-1]+=r;break;case"}":if(1==--o){if(e){const e=`($ps, $t) => css\`${pe(l)}\``;s.push([i,e])}else{const e=new Function("$t,css,$ps",`return css\`\n                ${pe(l)}\n              \``);s.push([i,(t,s)=>e(s,we,t)])}o=0,l.splice(0)}else l[l.length-1]+=r;break;default:l.push(r)}else n=r.indexOf("=>"),~n?(o=1,i=r.slice(0,n).trim().replace(/^\./,"")):s.push(r);return s},he=(()=>{const e=["\n","\r",";"],s=t=>e.includes(t),n=H;return(l,u=!1)=>{const f=new re,p=[];return o((()=>f.out),C((e=>{if("Array"==c(e))f.merge(e[0],e[1]);else if(e&&ue(f,e,p),f.depth<1)throw new Error("lit-css parse error: unbalanced {} braces !")})),de(u),x(t(i)),a(v),(d=e,e=>{const t=a(h,d),s=[];let r,n,i=0,o=d.length,l=e.length;for(r=0;r<l;r++)for(n=0;n<o;n++)e.slice(r,r+t[n])===d[n]&&"\\"!==e[r-1]&&(s.push(e.slice(i,r)),r+=t[n]-1,i=r+1);return i!==e.length-1&&s.push(e.slice(i)),s}),r(/(\{|\})/g,((e,t,r,n)=>(s(n[r-1])||(t=";"+t),s(n[r+1])||(t+=";"),t))),B,r(n,""))(l);var d}})(),me=(e,t)=>e[t]||e[q(t)],ge=(e,t,s,r)=>{switch(t||(t=R),typeof s){case W.f:return[s.name,[e=>s(e,r)]];case W.o:return[s.className,[S(s)]];case W.s:const n=((e,t,s)=>s.split(/[,\s\t]+/g).map((s=>[s,me(t,s)||me(e(),s)||R])))(e,t,s),i=[],o=[];for(const[s,l]of n)i.push(s),o.push(...ge(e,t,l,r)[1]);return[i.join("_"),o];default:return["",[f]]}},be=function(e,t){if(Z)for(const s in e){const r=e[s],n=[];for(const e in r){const t=r[e];"Object"==c(t)?this.setClasses(t,document.querySelectorAll(s+e)):n.push([e,t])}if(n.length){const e=(0,this.renderClasses)(null,b(n)).split(" ");(t||document.querySelectorAll(s)).forEach((t=>t.classList.add(...e)))}}},$e=e=>(t,...s)=>he(((e,t)=>e.reduce(((e,s,r)=>e+s+(t.length>r?t[r]:"")),""))(t,s),e),we=$e(!1),ye=$e(!0),Ce={method:"f",defStyles:void 0,plugins:[],enhancers:[],preset:{unit:[]},ssr:!1};class xe{static devClassNames=!1;renderer;_mixin;renderClasses;styl;get mixin(){return Object.freeze(this._mixin)}get style(){return _(this.renderer)}setClasses=be;constructor(e={}){const{method:t,ssr:s,preset:r,plugins:n,enhancers:i,...l}=((e,t={})=>o(b,a((([e,s])=>{switch(c(s)){case"Array":return[e,[...s,...t[e]||[]]];case"Object":return[e,{...s,...t[e]||{}}];default:return[e,t[e]||s]}})),d)(e))(Ce,e),u={...Ce.preset,...r||{}},p=this;if(e.fdef)throw new Error("fela-vue: Change deprecated `fdef` to `defStyles`!");this.renderer=k({...l,enhancers:i,plugins:G([P,O,A,E,...n],{0:u.unit})});const{renderer:h}=this,m=e.defStyles;let g,$;switch(typeof m){case W.o:[g,$]=[m.key,m.value];break;case W.f:[g,$]=["fdef",m]}Z&&(s?j(h):z(h)),this.renderClasses=(e,t,s={})=>{const[r,n]=ge((e=>{let t,s=!1;return()=>s?t:(s=!0,t=e())})((()=>$?$(this):R)),e,t,this);return h.renderRule(((e,t,s)=>{if(s&&t&&"anonymous"!==t)return{[t]:(t,s)=>e(t,s)}[t];return e})(N(...n),r,xe.devClassNames),s)||void 0},this.styl=e=>(...t)=>this.renderClasses(e,...t),this._mixin=x(f,{methods:{[t]:function(...e){return p.renderClasses.call(this,this.style,...e)}},computed:m&&{[g](){return $(this)}}})}}class ve extends xe{static get devClassNames(){return xe.devClassNames}static set devClassNames(e){xe.devClassNames=e}f;fdef;getCSS(){return e=>{const t={style:e,fdef:this.fdef};return(e,s)=>this.f.call(t,e,s)}}getLiteralCSS(){const e=this.getCSS();return(...t)=>e(we(...t))}constructor(e={}){super(e);const t=this.mixin;this.f=t.methods.f,this.fdef="function"==typeof e.defStyles?t.computed.fdef:e.defStyles&&t.computed[e.defStyles.key]}}let Se=null;const ke=function(){return{name:"fela-vue-compression",async transform(e){const t=await import("pepka"),{compose:s,take:r}=t;Se||(Se=oe(t));const n=((e,t)=>{const{compose:s,replace:r,trim:n}=t;return s(r(M,"$2"),r(K,";"),r(I,"\n"),r(J,"$1"),r(H,""),r(T,((t,s,r,i)=>i?s+(r&&i?`${n(e.dic[r]||r)}:${n(e.dic[i]||i)};`:n(r?t.replace(r,e.dic[r]||r):i?t.replace(r,e.dic[i]||i):t)):"")))})(Se,t);let i=e;try{i=e.replace(/css\`((.|\s)*?)\`/g,s((e=>`css\`${n(e)}\``),r(1)))}catch(e){console.warn(e)}return{code:i,map:null}}}};export{xe as Renderer,ve as SvelteRenderer,ye as __specialcss,we as css,ke as rollupCSSCompression,ce as setCompression};
