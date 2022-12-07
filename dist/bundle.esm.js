import{when as e,complement as s,isNil as t,replace as r,both as n,isEmpty as l,compose as c,equals as i,type as o,map as a,length as u,last as f,curry as p,join as h,forEach as d,filter as m,trim as g,identity as w,always as $,fromPairs as b,toPairs as y}from"pepka";import{createRenderer as x,combineRules as N}from"fela";import{renderToMarkup as v,rehydrate as S,render as k}from"fela-dom";import C from"fela-plugin-embedded";import j from"fela-plugin-prefixer";import _ from"fela-plugin-fallback-value";import z from"fela-plugin-unit";const O=Object.freeze({}),A=Object.freeze({f:"function",o:"object",s:"string"}),E=e=>e.replace(/-(\w)/gu,((e,s)=>s.toUpperCase())),W=(()=>{const e=/url\(.*?\)/g,s=/[,:;]/g;return t=>t.replace(e,(e=>e.replace(s,(e=>`\\${e}`))))})(),B=e(s(t),r(/([^\\])\\([^\\])/g,"$1$2")),F=n(s(l),s(t)),L=c(i("Object"),o),R=c(i("Window"),o),U=(e,s)=>{for(let t in s)L(e[t])&&L(s[t])?U(e[t],s[t]):e[t]=s[t];return e},Z=(()=>{try{return R(window)}catch{return!1}})();class q{s;rules={};get complex(){return null!==this.s.className&&null!==this.s.modifier}serialize(){const{className:e,modifier:s}=this.s;return(e?`.${e}`:"")+(s||"")}constructor(e){const s=e.match(/^\.[\w-_]+/);this.s={className:s?s[0].slice(1):null,modifier:s?e.slice(s[0].length)||null:e}}}const D=(e,s=0)=>{const t={};let r,n,l,c,i;for(i in e.rules)r=e.rules[i],r instanceof q?(n=r.complex?r.s.className:r.serialize(),l=0==s&&"."==n[0]?n.slice(1):"."==n[0]?`& ${n}`:n,c=r.complex?{[r.s.modifier]:D(r,s+1)}:D(r,s+1),t[l]?U(t[l],c):t[l]=c):t[i]=r;return t};class G{path=[];get out(){return D(this.path[0][0])}get depth(){return this.path.length}add(e){const s=f(this.path),t=[];for(const r of e){const e=new q(r);for(const r of s){const s=e.serialize(),n=r.rules[s];t.push(n||e),n||(r.rules[s]=e)}}this.path.push(t)}merge(e,s){if(F(s)&&F(e))for(const t of f(this.path))t.rules[e]=s}pop(){return this.path.pop()}constructor(){this.path.push([new q("__root")])}}const H=(()=>{const s=/^([\w-]+)(: *| +)(.*)$/,t=/^(([\|~\$@>\*\.:&\(\)\^="\-\[\]]+).*[ ,]*)+:?$/,r=/\s*,\s*/g,n=/(.*):$/;return(l,c,i)=>{let o;switch(!0){case"{"==c:l.add(i);break;case"}"==c:l.pop();break;case null!=(o=s.exec(c)):l.merge(B(E(o[1])),e(isNaN,B,(e=>{switch(e){case"undefined":case"":return;case"null":return null;default:return isNaN(+e)?e:+e}})(o[3])));break;case null!=(o=t.exec(c)):i.splice(0),i.push(...c.split(r).map((e=>e.replace(n,"$1"))))}}})(),I=p((([e,s],t)=>{let r,n,l=t.length,c=e.length,i=0,o=[];for(r=0;r<l;r++)switch(t.slice(r,r+c)){case e:r+=c-1,0==i&&(n=r),i++;break;case s:if(r+=c-1,i--,0==i)o.push([n,r]);else if(i<0)throw new Error("fela-vue literal: unbalanced delimeter in functional expression !")}return o})),J=c(h("\n"),a((e=>{const s=[];let t=0;for(let[r,n]of I(["[","]"],e))s.push(e.slice(t,r),`\${${e.slice(r+1,n).replace(/(\W|^)\$([a-zA-Z_]+)\b/g,"$1$$ps.$2").replace(/(\W|^)@(.+?)\b/g,"$1$t.$2")}}`),t=n+1;return s.push(e.slice(t)),s.join("")}))),K=e=>{const s=[];let t,r,n,l=0,c=[];for(t of e)if(l>0)switch(t){case"{":l++,c[c.length-1]+=t;break;case"}":if(1==--l){const e=new Function("$t,css,$ps",`return css\`\n                ${J(c)}\n              \``);s.push([n,(s,t)=>e(t,P,s)]),l=0,c.splice(0)}else c[c.length-1]+=t;break;default:c.push(t)}else r=t.indexOf("=>"),~r?(l=1,n=t.slice(0,r).trim().replace(/^\./,"")):s.push(t);return s},M=(()=>{const e=["\n","\r",";"],t=s=>e.includes(s),n=/(([\s^]+?\/\/.*$)|\/\*(.|[\n\r])*?\*\/)/gm;return i=>{const f=new G,p=[];return c((()=>f.out),d((e=>{if("Array"==o(e))f.merge(e[0],e[1]);else if(e&&H(f,e,p),f.depth<1)throw new Error("lit-css parse error: unbalanced {} braces !")})),K,m(s(l)),a(g),(h=e,e=>{const s=a(u,h),t=[];let r,n,l=0,c=h.length,i=e.length;for(r=0;r<i;r++)for(n=0;n<c;n++)e.slice(r,r+s[n])===h[n]&&"\\"!==e[r-1]&&(t.push(e.slice(l,r)),r+=s[n]-1,l=r+1);return l!==e.length-1&&t.push(e.slice(l)),t}),r(/(\{|\})/g,((e,s,r,n)=>(t(n[r-1])||(s=";"+s),t(n[r+1])||(s+=";"),s))),W,r(n,""))(i);var h}})(),P=(e,...s)=>M(((e,s)=>e.reduce(((e,t,r)=>e+t+(s.length>r?s[r]:"")),""))(e,s)),Q=(e,s)=>e[s]||e[E(s)],T=(e,s,t,r)=>{switch(s||(s=O),typeof t){case A.f:return[t.name,[e=>t(e,r)]];case A.o:return[t.className,[$(t)]];case A.s:const n=((e,s,t)=>t.split(/[,\s\t]+/g).map((t=>[t,Q(s,t)||Q(e(),t)||O])))(e,s,t),l=[],c=[];for(const[t,i]of n)l.push(t),c.push(...T(e,s,i,r)[1]);return[l.join("_"),c];default:return["",[w]]}},V={method:"f",defStyles:void 0,plugins:[],enhancers:[],preset:{unit:[]},ssr:!1};class X{static devClassNames=!1;renderer;_mixin;get mixin(){return Object.freeze(this._mixin)}get style(){return v(this.renderer)}constructor(e={}){const{method:s,ssr:t,preset:r,plugins:n,enhancers:l,...i}=((e,s={})=>c(b,a((([e,t])=>{switch(o(t)){case"Array":return[e,[...t,...s[e]||[]]];case"Object":return[e,{...t,...s[e]||{}}];default:return[e,s[e]||t]}})),y)(e))(V,e),u={...V.preset,...r||{}};if(e.fdef)throw new Error("fela-vue: Change deprecated `fdef` to `defStyles`!");this.renderer=x({...i,enhancers:l,plugins:[C(),j(),_(),z(...u.unit),...n]});const{renderer:f}=this,p=e.defStyles;let h,d;switch(typeof p){case A.o:[h,d]=[p.key,p.value];break;case A.f:[h,d]=["fdef",p]}console.log({isBrowser:Z,ssr:t,renderer:f}),Z&&(t?S(f):k(f)),this._mixin=m(w,{methods:{[s](e,s={}){const[t,r]=T((e=>{let s,t=!1;return()=>t?s:(t=!0,s=e())})((()=>d?d(this):O)),this.style,e,this);return f.renderRule(((e,s,t)=>{if(t&&s&&"anonymous"!==s)return{[s]:(s,t)=>e(s,t)}[s];return e})(N(...r),t,X.devClassNames),s)||void 0}},computed:p&&{[h](){return d(this)}}})}}class Y extends X{static get devClassNames(){return X.devClassNames}static set devClassNames(e){X.devClassNames=e}f;fdef;getCSS(){return e=>{const s={style:e,fdef:this.fdef};return(e,t)=>this.f.call(s,e,t)}}getLiteralCSS(){const e=this.getCSS();return(...s)=>e(P(...s))}constructor(e={}){super(e);const s=this.mixin;this.f=s.methods.f,this.fdef="function"==typeof e.defStyles?s.computed.fdef:e.defStyles&&s.computed[e.defStyles.key]}}export{X as Renderer,Y as SvelteRenderer,P as css};
