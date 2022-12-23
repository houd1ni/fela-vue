"use strict";var e=require("pepka"),s=require("fela"),t=require("fela-dom"),r=require("fela-plugin-embedded"),n=require("fela-plugin-prefixer"),i=require("fela-plugin-fallback-value"),o=require("fela-plugin-unit");const l=Object.freeze({}),c=Object.freeze({f:"function",o:"object",s:"string"}),a=e=>e.replace(/-(\w)/gu,((e,s)=>s.toUpperCase())),u=(()=>{const e=/url\(.*?\)/g,s=/[,:;]/g;return t=>t.replace(e,(e=>e.replace(s,(e=>`\\${e}`))))})(),p=e.when(e.complement(e.isNil),e.replace(/([^\\])\\([^\\])/g,"$1$2")),f=e.both(e.complement(e.isEmpty),e.complement(e.isNil));e.compose(e.equals("Object"),e.type);const d=e.compose(e.equals("Window"),e.type),h=(()=>{try{return d(window)}catch{return!1}})(),m=e.map(e.ifElse(e.compose(e.equals("Function"),e.type),e.identity,e.prop("default"))),g=(s,t)=>e.compose(e.map((([e,s])=>((e,s,t)=>t(...e[s]||[]))(t,e,s))),e.toPairs,m)(s),y=/((\s+?\/\/.*$)|\/\*(.|[\n\r])*?\*\/)/gm,b=/[\n\r]{2,}|(?:;\s)/g,w=/(^|\r|\n)+[\t ]+/g,$=/^([\w-]+)(: *| +)(.*)$/,C=/(^|\r|\n|;|{)\s*([a-z-]+)[ :][\t ]*?:?[\t ]*?([^;\r\n]+)/g,x=/^(([\|~\$@>\*\.:&\(\)\^="\-\[\]]+).*[ ,]*)+:?$/,v=/\.\.\.(\S*)$/,S=/\s*,\s*/g,N=/(.*):$/;class _{s;rules={};__selector__=!0;get complex(){return null!==this.s.className&&null!==this.s.modifier}static isSelector(e){return Boolean(e&&e.__selector__)}serialize(){const{className:e,modifier:s}=this.s;return(e?`.${e}`:"")+(s||"")}findClass(e,s=this){if(s.s.className===e)return s;for(const t in s.rules){const r=s.rules[t];if(_.isSelector(r)){const s=r.findClass(e);if(s)return s}}return null}constructor(e){const s=e.match(/^\.[\w-_]+/);this.s={className:s?s[0].slice(1):null,modifier:s?e.slice(s[0].length)||null:e}}}const k=(s,t=0)=>{const r={};let n,i,o,l,c;for(c in s.rules)n=s.rules[c],_.isSelector(n)?(i=n.complex?n.s.className:n.serialize(),o=0==t&&"."==i[0]?i.slice(1):"."==i[0]?`& ${i}`:i,l=n.complex?{[n.s.modifier]:k(n,t+1)}:k(n,t+1),r[o]?e.qmergeDeep(r[o],l):r[o]=l):r[c]=n;return r};class q{path=[];get out(){return k(this.path[0][0])}get depth(){return this.path.length}add(s){const t=e.last(this.path),r=[];for(const e of s){const s=new _(e);for(const e of t){const t=s.serialize(),n=e.rules[t];r.push(n||s),n||(e.rules[t]=s)}}this.path.push(r)}merge(s,t){if(f(t)&&f(s))for(const r of e.last(this.path))r.rules[s]=t}findClass(e){for(const s of this.path)for(const t of s){const s=t.findClass(e);if(s)return s}return null}pop(){return this.path.pop()}constructor(){this.path.push([new _("__root")])}}const j="\ntop flex grid overflow transform transition-duration max-height\nmargin margin-top margin-left margin-bottom margin-right justify-content\nborder width height border-radius background bottom position align-items\ncenter bottom absolute relative float right opacity z-index min-width\nmin-height border-top border-bottom filter fixed left color\nfont-weight font-size none hidden auto display block inline inline-block\npadding padding-top padding-bottom paddin-left padding-right\n".replace(/\s+/g,",").split(/[, ]/g).filter(Boolean);let z=0;const P=e=>{z=0;const{compose:s,fromPairs:t,map:r,reverse:n,toPairs:i}=e,o=s(t,r((e=>[e,"a"+z++])))(j);return{dic:o,dicRev:s(t,r(n),i)(o)}};let E=!1;const O=P({compose:e.compose,fromPairs:e.fromPairs,map:e.map,reverse:e.reverse,toPairs:e.toPairs}),R=(()=>{const s=$,t=x,r=v,n=S,i=N,o=e.when((()=>E),(e=>O.dicRev[e]||e));return(l,c,u)=>{let f;switch(!0){case"{"==c:l.add(u);break;case"}"==c:l.pop();break;case null!==(f=r.exec(c)):const d=l.findClass(f[1]);if(d)for(const e in d.rules)l.merge(e,d.rules[e]);break;case null!==(f=s.exec(c)):l.merge(p(a(o(f[1]))),e.when(isNaN,p,(e=>{switch(e){case"undefined":case"":return;case"null":return null;default:return isNaN(+e)?e:+e}})(o(f[3]))));break;case null!==(f=t.exec(c)):u.splice(0),u.push(...c.split(n).map((e=>e.replace(i,"$1"))))}}})(),A=e.curry((([e,s],t)=>{let r,n,i=t.length,o=e.length,l=0,c=[];for(r=0;r<i;r++)switch(t.slice(r,r+o)){case e:r+=o-1,0==l&&(n=r),l++;break;case s:if(r+=o-1,l--,0==l)c.push([n,r]);else if(l<0)throw new Error("fela-vue literal: unbalanced delimeter in functional expression !")}return c})),W=e.compose(e.join("\n"),e.map((e=>{const s=[];let t=0;for(let[r,n]of A(["[","]"],e))s.push(e.slice(t,r),`\${${e.slice(r+1,n).replace(/(\W|^)\$([a-zA-Z_]+)\b/g,"$1$$ps.$2").replace(/(\W|^)@(.+?)\b/g,"$1$t.$2")}}`),t=n+1;return s.push(e.slice(t)),s.join("")}))),B=e=>s=>{const t=[];let r,n,i,o=0,l=[];for(r of s)if(o>0)switch(r){case"{":o++,l[l.length-1]+=r;break;case"}":if(1==--o){if(e){const e=`($ps, $t) => css\`${W(l)}\``;t.push([i,e])}else{const e=new Function("$t,css,$ps",`return css\`\n                ${W(l)}\n              \``);t.push([i,(s,t)=>e(t,U,s)])}o=0,l.splice(0)}else l[l.length-1]+=r;break;default:l.push(r)}else n=r.indexOf("=>"),~n?(o=1,i=r.slice(0,n).trim().replace(/^\./,"")):t.push(r);return t},F=(()=>{const s=["\n","\r",";"],t=e=>s.includes(e),r=y;return(n,i=!1)=>{const o=new q,l=[];return e.compose((()=>o.out),e.forEach((s=>{if("Array"==e.type(s))o.merge(s[0],s[1]);else if(s&&R(o,s,l),o.depth<1)throw new Error("lit-css parse error: unbalanced {} braces !")})),B(i),e.filter(e.complement(e.isEmpty)),e.map(e.trim),(c=s,s=>{const t=e.map(e.length,c),r=[];let n,i,o=0,l=c.length,a=s.length;for(n=0;n<a;n++)for(i=0;i<l;i++)s.slice(n,n+t[i])===c[i]&&"\\"!==s[n-1]&&(r.push(s.slice(o,n)),n+=t[i]-1,o=n+1);return o!==s.length-1&&r.push(s.slice(o)),r}),e.replace(/(\{|\})/g,((e,s,r,n)=>(t(n[r-1])||(s=";"+s),t(n[r+1])||(s+=";"),s))),u,e.replace(r,""))(n);var c}})(),L=(e,s)=>e[s]||e[a(s)],D=(s,t,r,n)=>{switch(t||(t=l),typeof r){case c.f:return[r.name,[e=>r(e,n)]];case c.o:return[r.className,[e.always(r)]];case c.s:const i=((e,s,t)=>t.split(/[,\s\t]+/g).map((t=>[t,L(s,t)||L(e(),t)||l])))(s,t,r),o=[],a=[];for(const[e,r]of i)o.push(e),a.push(...D(s,t,r,n)[1]);return[o.join("_"),a];default:return["",[e.identity]]}},M=function(s,t){if(!e.isNil(window)&&!e.isNil(window.document))for(const r in s){const n=s[r],i=[];for(const s in n){const t=n[s];"Object"==e.type(t)?this.setClasses(t,document.querySelectorAll(r+s)):i.push([s,t])}if(i.length){const s=(0,this.renderClasses)(null,e.fromPairs(i)).split(" ");(t||document.querySelectorAll(r)).forEach((e=>e.classList.add(...s)))}}},T=e=>(s,...t)=>F(((e,s)=>e.reduce(((e,t,r)=>e+t+(s.length>r?s[r]:"")),""))(s,t),e),U=T(!1),Z=T(!0),G={method:"f",defStyles:void 0,plugins:[],enhancers:[],preset:{unit:[]},ssr:!1};class H{static devClassNames=!1;renderer;_mixin;renderClasses;styl;get mixin(){return Object.freeze(this._mixin)}get style(){return t.renderToMarkup(this.renderer)}setClasses=M;constructor(a={}){const{method:u,ssr:p,preset:f,plugins:d,enhancers:m,...y}=((s,t={})=>e.compose(e.fromPairs,e.map((([s,r])=>{switch(e.type(r)){case"Array":return[s,[...r,...t[s]||[]]];case"Object":return[s,{...r,...t[s]||{}}];default:return[s,t[s]||r]}})),e.toPairs)(s))(G,a),b={...G.preset,...f||{}},w=this;if(a.fdef)throw new Error("fela-vue: Change deprecated `fdef` to `defStyles`!");this.renderer=s.createRenderer({...y,enhancers:m,plugins:g([o,r,n,i,...d],{0:b.unit})});const{renderer:$}=this,C=a.defStyles;let x,v;switch(typeof C){case c.o:[x,v]=[C.key,C.value];break;case c.f:[x,v]=["fdef",C]}h&&(p?t.rehydrate($):t.render($)),this.renderClasses=(e,t,r={})=>{const[n,i]=D((e=>{let s,t=!1;return()=>t?s:(t=!0,s=e())})((()=>v?v(this):l)),e,t,this);return $.renderRule(((e,s,t)=>{if(t&&s&&"anonymous"!==s)return{[s]:(s,t)=>e(s,t)}[s];return e})(s.combineRules(...i),n,H.devClassNames),r)||void 0},this.styl=e=>(...s)=>this.renderClasses(e,...s),this._mixin=e.filter(e.identity,{methods:{[u]:function(...e){return w.renderClasses.call(this,this.style,...e)}},computed:C&&{[x](){return v(this)}}})}}let I=null;exports.Renderer=H,exports.SvelteRenderer=class extends H{static get devClassNames(){return H.devClassNames}static set devClassNames(e){H.devClassNames=e}f;fdef;getCSS(){return e=>{const s={style:e,fdef:this.fdef};return(e,t)=>this.f.call(s,e,t)}}getLiteralCSS(){const e=this.getCSS();return(...s)=>e(U(...s))}constructor(e={}){super(e);const s=this.mixin;this.f=s.methods.f,this.fdef="function"==typeof e.defStyles?s.computed.fdef:e.defStyles&&s.computed[e.defStyles.key]}},exports.__specialcss=Z,exports.css=U,exports.rollupCSSCompression=function(){return{name:"fela-vue-compression",async transform(e){const s=await import("pepka");I||(I=P(s));const t=((e,s)=>{const{compose:t,replace:r}=s,n=C,i=w,o=y;return t(r(b,"\n"),r(i,"$1"),r(o,""),r(n,((s,t,r,n)=>t+(r&&n?`${e.dic[r]||r}:${e.dic[n]||n};`:r?s.replace(r,e.dic[r]||r):n?s.replace(r,e.dic[n]||n):s))))})(I,s);let r=e;try{r=e.replace(/css\`((.|\s)*?)\`/g,((e,s)=>`css\`${t(s)}\``))}catch(e){console.warn(e)}return{code:r,map:null}}}},exports.setCompression=e=>E=e;
