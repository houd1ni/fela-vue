import{createRenderer as e,combineRules as t}from"fela";import{rehydrate as r,render as s,renderToMarkup as n}from"fela-dom";import l from"fela-plugin-embedded";import c from"fela-plugin-prefixer";import i from"fela-plugin-fallback-value";import o from"fela-plugin-unit";const u=e=>typeof e,a=e=>null===e,f=e=>"number"==u(e),h=(e,t,r)=>t.length+r.length<e.length?(...r)=>h(e,[...t,...r],r):e(...t,...r),p=e=>(...t)=>h(e,t,[]),d=p((e,t)=>{if("object"==u(e)&&"object"==u(t)){if(a(e)||a(t))return e===t;for(let r of[e,t])for(let s in r)if(!d(e[s],t[s]))return!1}return e===t}),m=p((e,t,r,s)=>e(s)?t(s):r(s)),g=p((e,t,r)=>m(e,t,j,r)),y=(...e)=>t=>{for(let r=w(e)-1;r>-1;r--)t=e[r](t);return t},b=e=>a(e)||(e=>void 0===e)(e),w=e=>e.length,$=e=>()=>e,j=e=>e,S=e=>e.trim(),x=e=>e[0],k=e=>e[e.length-1],N=e=>t=>!e(t),O=e=>Object.entries(e),v=p((e,t,r)=>r.slice(e,f(t)?t:1/0)),A=p((e,t,r)=>({...r,[e]:t})),z=p((e,t)=>t[e]),_=p((e,t,r)=>m(w,y(m(b,$(e),r=>_(e,v(1,null,t),r)),(e=>p((t,r)=>e(r,t)))(z)(r),x),$(r))(t)),C=(_(void 0),e=>{switch(u(e)){case"object":switch(Z(e)){case"Null":return e;case"Array":return W(C,e);case"Object":const t={};for(let r in e)t[r]=C(e[r]);return t}default:return e}}),E=p((e,t,r)=>r.reduce(e,C(t))),R=e=>E((e,t)=>A(...t,e),{},e),U=p((e,t)=>t.join(e)),W=p((e,t)=>t.map(e)),F=p((e,t)=>t.forEach(e)),L=p((e,t,r)=>t(r)&&e(r)),Z=e=>{const t=u(e);return"object"==t?(e=>Array.isArray(e))(e)?"Array":a(e)?"Null":"Object":t[0].toUpperCase()+t.slice(1)},q=(y(d("Object"),Z),e=>{switch(Z(e)){case"String":return""==e;case"Array":return 0==w(e);case"Null":return!1;case"Object":return 0==w(Object.keys(e));default:return!1}}),B=p((e,t,r)=>r.replace(e,t)),D=p((e,t)=>m(y(d("Array"),Z),t=>t.filter(e),y(R,D(([t,r])=>e(r,t)),O))(t)),G=Object.freeze({}),H=Object.freeze({f:"function",o:"object",s:"string"}),I=e=>e.replace(/-(\w)/gu,(e,t)=>t.toUpperCase()),J=e=>{let t,r=!1;return()=>r?t:(r=!0,t=e())},K=(()=>{const e=/url\(.*?\)/g,t=/[,:;]/g;return r=>r.replace(e,e=>e.replace(t,e=>`\\${e}`))})(),M=g(N(b),B(/([^\\])\\([^\\])/g,"$1$2")),P=L(N(q),N(b)),Q=y(d("Object"),Z),T=(e,t)=>{for(let r in t)Q(e[r])&&Q(t[r])?T(e[r],t[r]):e[r]=t[r];return e},V=(()=>{try{return Q(window)}catch{return!1}})(),X=(e,t)=>e[t]||e[I(t)],Y=(e,t,r,s)=>{switch(t||(t=G),typeof r){case H.f:return[e=>r(e,s)];case H.o:return[$(r)];case H.s:return((e,t,r)=>r.split(/[,\s\t]+/g).map(r=>X(t,r)||X(e(),r)||G))(e,t,r).reduce((r,n)=>(r.push(...Y(e,t,n,s)),r),[]);default:return[j]}};class ee{constructor(e){this.rules={};const t=e.match(/^\.[\w-_]+/);this.s={className:t?t[0].slice(1):null,modifier:t?e.slice(t[0].length)||null:e}}get complex(){return null!==this.s.className&&null!==this.s.modifier}serialize(){const{className:e,modifier:t}=this.s;return(e?`.${e}`:"")+(t||"")}}const te=(e,t=0)=>{const r={};let s,n,l,c,i;for(i in e.rules)s=e.rules[i],s instanceof ee?(n=s.serialize(),l=0!=t&&"."==n[0]?`& ${n}`:n,c=s.complex?{[s.s.modifier]:te(s,t+1)}:te(s,t+1),console.log("Setting newRules.className",{key:l,newRules:c}),c.className=l,r[l]?T(r[l],c):r[l]=c):(console.log("Setting o.className",{tmp:s,o:r}),r.className=s,r[i]=s);return r};class re{constructor(){this.path=[],this.path.push([new ee("__root")])}get out(){return te(this.path[0][0])}get depth(){return this.path.length}add(e){const t=k(this.path),r=[];for(const s of e){const e=new ee(s);for(const s of t){const t=e.serialize(),n=s.rules[t];r.push(n||e),n||(s.rules[t]=e)}}this.path.push(r)}merge(e,t){if(P(t)&&P(e))for(const r of k(this.path))r.rules[e]=t}pop(){return this.path.pop()}}const se=(()=>{const e=/^([\w-]+)(: *| +)(.*)$/,t=/^(([\|~\$@>\*\.:&\(\)\^="\-\[\]]+).*[ ,]*)+:?$/,r=/\s*,\s*/g,s=/(.*):$/;return(n,l,c)=>{let i;switch(!0){case"{"==l:n.add(c);break;case"}"==l:n.pop();break;case null!=(i=e.exec(l)):n.merge(M(I(i[1])),g(isNaN,M,(e=>{switch(e){case"undefined":case"":return;case"null":return null;default:return isNaN(+e)?e:+e}})(i[3])));break;case null!=(i=t.exec(l)):c.splice(0),c.push(...l.split(r).map(e=>e.replace(s,"$1")))}}})();class ne{constructor(e={}){const t=new ie(e).mixin;this.f=t.methods.f,this.fdef="function"==typeof e.defStyles?t.computed.fdef:e.defStyles&&t.computed[e.defStyles.key]}getCSS(){return e=>{const t={style:e,fdef:this.fdef};return(e,r)=>this.f.call(t,e,r)}}getLiteralCSS(){return(...e)=>{const t={style:he(...e),fdef:this.fdef};return(e,r)=>this.f.call(t,e,r)}}}const le=(e,t={})=>y(R,W(([e,r])=>{switch(Z(r)){case"Array":return[e,[...r,...t[e]||[]]];case"Object":return[e,{...r,...t[e]||{}}];default:return[e,t[e]||r]}}),O)(e),ce={method:"f",defStyles:void 0,plugins:[],enhancers:[],preset:{unit:[]},ssr:!1};class ie{constructor(n={}){const{method:u,ssr:a,preset:f,plugins:h,enhancers:p,...d}=le(ce,n),m={...ce.preset,...f||{}};if(n.fdef)throw new Error("fela-vue: Change deprecated `fdef` to `defStyles`!");this.renderer=e({...d,enhancers:p,plugins:[l(),c(),i(),o(...m.unit),...h]});const{renderer:g}=this,y=n.defStyles;let b,w;switch(typeof y){case H.o:[b,w]=[y.key,y.value];break;case H.f:[b,w]=["fdef",y]}V&&(a?r(g):s(g)),this._mixin=D(j,{methods:{[u](e,r={}){return g.renderRule(t(...Y(J(()=>w?w(this):G),this.style,e,this)),r)||void 0}},computed:y&&{[b](){return w(this)}}})}get mixin(){return Object.freeze(this._mixin)}get style(){return n(this.renderer)}}const oe=p(([e,t],r)=>{let s,n,l=r.length,c=e.length,i=0,o=[];for(s=0;s<l;s++)switch(r.slice(s,s+c)){case e:s+=c-1,0==i&&(n=s),i++;break;case t:if(s+=c-1,i--,0==i)o.push([n,s]);else if(i<0)throw new Error("fela-vue literal: unbalanced delimeter in functional expression !")}return o}),ue=y(U("\n"),W(e=>{const t=[];let r=0;for(let[s,n]of oe(["[","]"],e))t.push(e.slice(r,s),`\${${e.slice(s+1,n).replace(/(\W|^)\$([a-zA-Z_]+)\b/g,"$1$$ps.$2").replace(/(\W|^)@(.+?)\b/g,"$1$t.$2")}}`),r=n+1;return t.push(e.slice(r)),t.join("")})),ae=e=>{const t=[];let r,s,n,l=0,c=[];for(r of e)if(l>0)switch(r){case"{":l++,c[c.length-1]+=r;break;case"}":if(1==--l){const e=new Function("$t,css,$ps",`return css\`\n                ${ue(c)}\n              \``);t.push([n,(t,r)=>e(r,he,t)]),l=0,c.splice(0)}else c[c.length-1]+=r;break;default:c.push(r)}else s=r.indexOf("=>"),~s?(l=1,n=r.slice(0,s).trim().replace(/^\./,"")):t.push(r);return t},fe=(()=>{const e=["\n","\r",";"],t=t=>e.includes(t),r=/(([\s^]+?\/\/.*$)|\/\*(.|[\n\r])*?\*\/)/gm;return s=>{const n=new re,l=[];return y(()=>n.out,F(e=>{if("Array"==Z(e))n.merge(e[0],e[1]);else if(e&&se(n,e,l),n.depth<1)throw new Error("lit-css parse error: unbalanced {} braces !")}),ae,D(N(q)),W(S),(e=>t=>{const r=W(w,e),s=[];let n,l,c=0,i=e.length,o=t.length;for(n=0;n<o;n++)for(l=0;l<i;l++)t.slice(n,n+r[l])===e[l]&&"\\"!==t[n-1]&&(s.push(t.slice(c,n)),n+=r[l]-1,c=n+1);return c!==t.length-1&&s.push(t.slice(c)),s})(e),B(/(\{|\})/g,(e,r,s,n)=>(t(n[s-1])||(r=";"+r),t(n[s+1])||(r+=";"),r)),K,B(r,""))(s)}})(),he=(()=>(e,...t)=>fe(((e,t)=>e.reduce((e,r,s)=>e+r+(t.length>s?t[s]:""),""))(e,t)))(),pe=(e,t={})=>y(R,W(([e,r])=>{switch(Z(r)){case"Array":return[e,[...r,...t[e]||[]]];case"Object":return[e,{...r,...t[e]||{}}];default:return[e,t[e]||r]}}),O)(e),de={method:"f",defStyles:void 0,plugins:[],enhancers:[],preset:{unit:[]},ssr:!1};class me{constructor(n={}){const{method:u,ssr:a,preset:f,plugins:h,enhancers:p,...d}=pe(de,n),m={...de.preset,...f||{}};if(n.fdef)throw new Error("fela-vue: Change deprecated `fdef` to `defStyles`!");this.renderer=e({...d,enhancers:p,plugins:[l(),c(),i(),o(...m.unit),...h]});const{renderer:g}=this,y=n.defStyles;let b,w;switch(typeof y){case H.o:[b,w]=[y.key,y.value];break;case H.f:[b,w]=["fdef",y]}V&&(a?r(g):s(g)),this._mixin=D(j,{methods:{[u](e,r={}){return g.renderRule(t(...Y(J(()=>w?w(this):G),this.style,e,this)),r)||void 0}},computed:y&&{[b](){return w(this)}}})}get mixin(){return Object.freeze(this._mixin)}get style(){return n(this.renderer)}}export{me as Renderer,ne as SvelteRenderer,he as css};
