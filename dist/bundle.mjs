import{when as e,complement as t,isNil as r,replace as s,both as n,isEmpty as o,compose as i,equals as l,type as c,map as a,ifElse as u,identity as f,prop as d,toPairs as h,length as p,last as m,qmergeDeep as g,fromPairs as b,reverse as w,curry as y,join as $,forEach as x,filter as C,trim as v,always as S,qmap as N,qfilter as k,all as j,head as _,tail as O,slice as z,split as A,mergeShallow as E}from"pepka";import{createRenderer as P,combineRules as B}from"fela";import{renderToMarkup as q,rehydrate as F,render as M}from"fela-dom";import R from"fela-plugin-embedded";import W from"fela-plugin-prefixer";import L from"fela-plugin-fallback-value";import U from"fela-plugin-unit";const Z=Object.freeze({}),D=Object.freeze({f:"function",o:"object",s:"string"}),G=e=>e.replace(/-(\w)/gu,((e,t)=>t.toUpperCase())),H=(()=>{const e=/url\(.*?\)/g,t=/[,:;]/g;return r=>r.replace(e,(e=>e.replace(t,(e=>`\\${e}`))))})(),I=e(t(r),s(/([^\\])\\([^\\])/g,"$1$2")),J=n(t(o),t(r));i(l("Object"),c);const K=i(l("Window"),c),Q=(()=>{try{return K(window)}catch{return!1}})(),T=a(u(i(l("Function"),c),f,d("default"))),V=(e,t)=>i(a((([e,r])=>((e,t,r)=>r(...e[t]||[]))(t,e,r))),h,T)(e),X=/((\s+?\/\/.*$)|\/\*(.|[\n\r])*?\*\/)/gm,Y=/[\n\r]{2,}|(?:;\s)/g,ee=/(^|\r|\n)+[\t ]+/g,te=/[;\n\r]+/g,re=/(?:(}|{|]|)^[;\n\r ]+)|(?:[;\n\r ]+($|}|{|]))/g,se=/^([\w-]+)(: *| +)(.*)$/,ne=/(^|\r|\n|;|{)\s*([a-z-]+)[ :][\t ]*?:?[\t ]*?([^;\r\n]+)/g,oe=/^(([\|~\$@>\*\.:&\(\)\^="\-\[\]]+).*[ ,]*)+:?$/,ie=/^\.\.\.(\S*)$/,le=/\s*,\s*/g,ce=/(.*):$/,ae=/[.&]/;class ue{s;rules={};__selector__=!0;get complex(){return null!==this.s.className&&null!==this.s.modifier}static isSelector(e){return Boolean(e&&e.__selector__)}serialize(){const{className:e,modifier:t}=this.s;return(e?`.${e}`:"")+(t||"")}findClass(e,t=this){if(t.s.className===e)return t;for(const r in t.rules){const s=t.rules[r];if(ue.isSelector(s)){const t=s.findClass(e);if(t)return t}}return null}constructor(e){const t=e.match(/^\.[\w-_]+/);this.s={className:t?t[0].slice(1):null,modifier:t?e.slice(t[0].length)||null:e}}}const fe=(e,t=0)=>{const r={};let s,n,o,i,l;for(l in e.rules)s=e.rules[l],ue.isSelector(s)?(n=s.complex?s.s.className:s.serialize(),o=0==t&&"."==n[0]?n.slice(1):"."==n[0]?`& ${n}`:n,i=s.complex?{[s.s.modifier]:fe(s,t+1)}:fe(s,t+1),r[o]?g(r[o],i):r[o]=i):r[l]=s;return r};class de{path=[];get out(){return fe(this.path[0][0])}get depth(){return this.path.length}add(e){const t=m(this.path),r=[];for(const s of e){const e=new ue(s);for(const s of t){const t=e.serialize(),n=s.rules[t];r.push(n||e),n||(s.rules[t]=e)}}this.path.push(r)}merge(e,t){if(J(t)&&J(e))for(const r of m(this.path))r.rules[e]=t}findClass(e){for(const t of this.path)for(const r of t){const t=r.findClass(e);if(t)return t}return null}pop(){return this.path.pop()}constructor(){this.path.push([new ue("__root")])}}const he=Symbol("Placeholder"),pe=e=>{let t=0;for(const r of e)r!==he&&t++;return t},me=(e,t)=>{const r=e.length,s=e.slice(),n=t.length;let o=n,i=0;for(;o&&i<r;i++)s[i]===he&&(s[i]=t[n-o],o--);for(i=r;o;i++,o--)s[i]=t[n-o];return s},ge=(e,t,r)=>{const s=e.length-t.length-pe(r);if(s<1)return e(...me(t,r));{const n=(...s)=>ge(e,me(t,r),s);return n.$args_left=s,n}},be=e=>(...t)=>e.length>pe(t)?ge(e,[],t):e(...t),we=e=>function(t){return t===he?e:e(t)};function ye(e){return function(t,r){const s=t===he,n=arguments.length;if(1===n&&s)throw new Error("Senseless placeholder usage.");return arguments.length>1?s?we((t=>e(t,r))):e(t,r):r=>e(t,r)}}function $e(e){return be(e)}const xe=void 0,Ce=1/0,ve=e=>typeof e,Se=e=>null===e,Ne={u:"U",b:"B",n:"N",s:"S",f:"F"},ke=e=>{const t=ve(e);return"object"===t?Se(e)?"Null":e.constructor.name:Ne[t[0]]+t.slice(1)},je=ye(((e,t)=>(t.push(e),t))),_e=$e(((e,t,r)=>r.reduce(e,t))),Oe=$e(((e,t,r)=>{for(let s in r)switch(ke(r[s])){case"Array":if(e>1&&"Array"===ke(t[s]))switch(e){case 2:const n=t[s],o=r[s];for(const t in o)n[t]?Oe(e,n[t],o[t]):n[t]=o[t];break;case 3:t[s].push(...r[s])}else t[s]=r[s];break;case"Object":if("Object"===ke(t[s])){Oe(e,t[s],r[s]);break}default:t[s]=r[s]}return t}));Oe(1),Oe(2),Oe(3);const ze=ye(((e,t)=>{const r=ke(e);if(r===ke(t)&&("Object"===r||"Array"==r)){if(Se(e)||Se(t))return e===t;if(e===t)return!0;for(const r of[e,t])for(const s in r)if(!(r===t&&s in e||r===e&&s in t&&ze(e[s],t[s])))return!1;return!0}return e===t})),Ae=be(((e,t,r,s)=>e(s)?t(s):r(s))),Ee=(...e)=>(...t)=>{let r,s=!0;for(let n=Re(e)-1;n>-1;n--)s?(s=!1,r=e[n](...t)):r=r===he?e[n]():e[n](r);return r},Pe=ye(((e,t)=>t[e])),Be=ye(((e,t)=>{if((e=>"string"===ve(e))(t))return t.includes(e);for(const r of t)if(ze(r,e))return!0;return!1})),qe=$e(((e,t,r)=>r.slice(e,(e=>"number"==ve(e))(t)?t:Ce))),Fe=Pe(0);qe(1,Ce);const Me=e=>Se(e)||(e=>e===xe)(e),Re=e=>e.length,We=e=>()=>e,Le=ye(((e,t)=>t.split(e))),Ue=e=>_e(((e,t)=>Be(t,e)?e:je(t,e)),[],e),Ze=$e(((e,t,r)=>({...r,[e]:t}))),De=ye(((e,t)=>t[e])),Ge=$e(((e,t,r)=>Ae(Re,(()=>Me(r)?e:Ee(Ae(Me,We(e),(r=>Ge(e,qe(1,Ce,t),r))),(e=>ye(((t,r)=>e(r,t))))(De)(r),Fe)(t)),We(r),t)));Ge(xe);const He=/^(.*?)(8|16|32|64)(Clamped)?Array$/,Ie=(e,t=!1)=>{const r=ke(e);switch(r){case"Null":case"String":case"Number":case"Boolean":case"Symbol":return e;case"Array":return t?[...e]:Ke(Ee(Ie,((...e)=>e[0])),e);case"Object":if(t)return{...e};const s={};for(let t in e)s[t]=Ie(e[t]);return s;default:return He.test(r)?e.constructor.from(e):e}},Je=$e(((e,t,r)=>_e(e,Ie(t),r))),Ke=ye(((e,t)=>t.map(e))),{floor:Qe}=Math;let Te,Ve;const Xe=Ee((e=>Je(((e,t)=>Ze(...t,e)),{},e)),Ke(((e,t)=>[e,t])),Le(""));(e=>{if(!(e=>Ee(ze(Re(e)),Re,Ue,Le(""))(e))(e))throw new Error("Not all chars are unique!");Te=e,Ve=Te.length,Xe(Te)})("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ");const Ye="\ntop flex grid overflow transform transition-duration max-height 100%\nmargin margin-top margin-left margin-bottom margin-right justify-content\nborder width height left border-radius background bottom position align-items\ncenter bottom absolute relative float right opacity z-index min-width\nmin-height border-top border-bottom border-left border-right filter\nfont-weight font-size none hidden auto display block inline inline-block\npadding padding-top padding-bottom padding-left padding-right text-align\nflex-direction column box-shadow rotate content text-decoration\nfixed color space-between overflow-x overflow-y\n".replace(/\s+/g,",").split(/[, ]/g).filter(Boolean),et=()=>{let e=0;return()=>`a${(e=>{let t="";for(;e>0;)t=Te[e%Ve]+t,e=Qe(e/Ve);return t||"0"})(e++)}`},tt=e=>{const t=et(),{compose:r,fromPairs:s,map:n,reverse:o,toPairs:i}=e,l=r(s,n((e=>[e,t()])))(Ye);return{dic:l,dicRev:r(s,n(o),i)(l)}};let rt=!1;const st=e=>rt=e,nt=tt({compose:i,fromPairs:b,map:a,reverse:w,toPairs:h}),ot=(()=>{const t=se,r=oe,s=ie,n=le,o=ce,i=e((()=>rt),(e=>nt.dicRev[e]||e));return(l,c,a)=>{let u;switch(!0){case"{"==c:l.add(a);break;case"}"==c:l.pop();break;case null!==(u=s.exec(c)):const f=l.findClass(u[1]);if(f)for(const e in f.rules)l.merge(e,f.rules[e]);break;case null!==(u=t.exec(c)):l.merge(I(G(i(u[1]))),e(isNaN,I,(e=>{switch(e){case"undefined":case"false":case"":return;case"null":return null;default:return isNaN(+e)?e:+e}})(i(u[3]))));break;case null!==(u=r.exec(c)):a.splice(0),a.push(...c.split(n).map((e=>e.replace(o,"$1"))))}}})(),it=y((([e,t],r)=>{let s,n,o=r.length,i=e.length,l=0,c=[];for(s=0;s<o;s++)switch(r.slice(s,s+i)){case e:s+=i-1,0==l&&(n=s),l++;break;case t:if(s+=i-1,l--,0==l)c.push([n,s]);else if(l<0)throw new Error("fela-vue literal: unbalanced delimeter in functional expression !")}return c})),lt=i($("\n"),a((e=>{const t=[];let r=0;for(let[s,n]of it(["[","]"],e))t.push(e.slice(r,s),`\${${e.slice(s+1,n).replace(/(\W|^)\$([a-zA-Z_]+)\b/g,"$1$$ps.$2").replace(/(\W|^)@(.+?)\b/g,"$1$t.$2")}}`),r=n+1;return t.push(e.slice(r)),t.join("")}))),ct=e=>t=>{const r=[];let s,n,o,i=0,l=[];for(s of t)if(i>0)switch(s){case"{":i++,l[l.length-1]+=s;break;case"}":if(1==--i){if(e){const e=`($ps, $t) => css\`${lt(l)}\``;r.push([o,e])}else{const e=new Function("$t,css,$ps",`return css\`\n                ${lt(l)}\n              \``);r.push([o,(t,r)=>e(r,mt,t)])}i=0,l.splice(0)}else l[l.length-1]+=s;break;default:l.push(s)}else n=s.indexOf("=>"),~n?(i=1,o=s.slice(0,n).trim().replace(/^\./,"")):r.push(s);return r},at=(()=>{const e=["\n","\r",";"],r=t=>e.includes(t),n=X;return(l,u=!1)=>{const f=new de,d=[];return i((()=>f.out),x((e=>{if("Array"==c(e))f.merge(e[0],e[1]);else if(e&&ot(f,e,d),f.depth<1)throw new Error("lit-css parse error: unbalanced {} braces !")})),ct(u),C(t(o)),a(v),(h=e,e=>{const t=a(p,h),r=[];let s,n,o=0,i=h.length,l=e.length;for(s=0;s<l;s++)for(n=0;n<i;n++)e.slice(s,s+t[n])===h[n]&&"\\"!==e[s-1]&&(r.push(e.slice(o,s)),s+=t[n]-1,o=s+1);return o!==e.length-1&&r.push(e.slice(o)),r}),s(/(\{|\})/g,((e,t,s,n)=>(r(n[s-1])||(t=";"+t),r(n[s+1])||(t+=";"),t))),H,s(n,""))(l);var h}})(),ut=ae,ft=(e,t)=>e[t]||e[G(t)],dt=(e,t,r,s,n)=>{switch(t||(t=Z),typeof r){case D.f:return[r.name,[e=>r(e,n)]];case D.o:return[r.className,[S(r)]];case D.s:const o=((e,t,r,s,n)=>i(N((r=>[r,ft(t,r)||ft(e(),r)||Z])),N(m),k((e=>{if(p(e)<2)return!0;const t=m(e);let r,o,i;return j((e=>{if(o="!"===_(e),o&&(e=O(e)),r=s[e],!r)throw new Error(`[fela-vue] Class modifier with name ${e} not found.`);return i=r(t,n),o?!i:i}),z(0,-1,e))})),N(A(ut)),k((e=>""!==e)),A(/[,\s\t]+/g))(r))(e,t,r,s,n),l=[],c=[];for(const[r,i]of o)l.push(r),c.push(...dt(e,t,i,s,n)[1]);return[l.join("_"),c];default:return["",[f]]}},ht=function(e,t){if(Q)for(const r in e){const s=e[r],n=[];for(const e in s){const t=s[e];"Object"==c(t)?this.setClasses(t,document.querySelectorAll(r+e)):n.push([e,t])}if(n.length){const e=(0,this.renderClasses)(null,b(n)).split(" ");(t||document.querySelectorAll(r)).forEach((t=>t.classList.add(...e)))}}},pt=e=>(t,...r)=>at(((e,t)=>e.reduce(((e,r,s)=>e+r+(t.length>s?t[s]:"")),""))(t,r),e),mt=pt(!1),gt=pt(!0),bt={method:"f",defStyles:void 0,modifiers:{},plugins:[],enhancers:[],preset:{unit:[]},ssr:!1};class wt{static devClassNames=!1;renderer;_mixin;renderClasses;styl;get mixin(){return Object.freeze(this._mixin)}get style(){return q(this.renderer)}setClasses=ht;constructor(e={}){const{method:t,ssr:r,preset:s,plugins:n,enhancers:o,...l}=((e,t={})=>i(b,a((([e,r])=>{switch(c(r)){case"Array":return[e,[...r,...t[e]||[]]];case"Object":return[e,{...r,...t[e]||{}}];default:return[e,t[e]||r]}})),h)(e))(bt,e),u={...bt.preset,...s||{}},d=this;if(e.fdef)throw new Error("fela-vue: Change deprecated `fdef` to `defStyles`!");this.renderer=P({...l,enhancers:o,plugins:V([U,R,W,L,...n],{0:u.unit})});const{renderer:p}=this,m=e.defStyles;let g,w;switch(typeof m){case D.o:[g,w]=[m.key,m.value];break;case D.f:[g,w]=["fdef",m]}Q&&(r?F(p):M(p)),this.renderClasses=(t,r,s=Z,n)=>{const[o,i]=dt((e=>{let t,r=!1;return()=>r?t:(r=!0,t=e())})((()=>w?w(this):Z)),t,r,n?E(e.modifiers,n):e.modifiers,this);return p.renderRule(((e,t,r)=>{if(r&&t&&"anonymous"!==t)return{[t]:(t,r)=>e(t,r)}[t];return e})(B(...i),o,wt.devClassNames),s)||void 0},this.styl=(e,t)=>(r,s,n)=>this.renderClasses(e,r,s,n?E(t,n):t),this._mixin=C(f,{methods:{[t]:function(t,r,s){return d.renderClasses.call(this,this.style,t,r,s?E(e.modifiers,s):"styleMods"in this&&this.styleMods)}},computed:m&&{[g](){return w(this)}}})}}class yt extends wt{static get devClassNames(){return wt.devClassNames}static set devClassNames(e){wt.devClassNames=e}f;fdef;getCSS(){return e=>{const t={style:e,fdef:this.fdef};return(e,r)=>this.f.call(t,e,r)}}getLiteralCSS(){const e=this.getCSS();return(...t)=>e(mt(...t))}constructor(e={}){super(e);const t=this.mixin;this.f=t.methods.f,this.fdef="function"==typeof e.defStyles?t.computed.fdef:e.defStyles&&t.computed[e.defStyles.key]}}let $t=null;const xt=function(){return{name:"fela-vue-compression",async transform(e){const t=await import("pepka"),{compose:r,take:s}=t;$t||($t=tt(t));const n=((e,t)=>{const{compose:r,replace:s,trim:n}=t;return r(s(re,"$2"),s(te,";"),s(Y,"\n"),s(ee,"$1"),s(X,""),s(ne,((t,r,s,o)=>o?r+(s&&o?`${n(e.dic[s]||s)}:${n(e.dic[o]||o)};`:n(s?t.replace(s,e.dic[s]||s):o?t.replace(s,e.dic[o]||o):t)):"")))})($t,t);let o=e;try{o=e.replace(/css\`((.|\s)*?)\`/g,r((e=>`css\`${n(e)}\``),s(1)))}catch(e){console.warn(e)}return{code:o,map:null}}}};export{wt as Renderer,yt as SvelteRenderer,gt as __specialcss,mt as css,xt as rollupCSSCompression,st as setCompression};
