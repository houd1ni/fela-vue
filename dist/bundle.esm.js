import{createRenderer as e,combineRules as t}from"fela";import{rehydrate as r,render as n,renderToMarkup as s}from"fela-dom";import o from"fela-plugin-embedded";import i from"fela-plugin-prefixer";import l from"fela-plugin-fallback-value";import u from"fela-plugin-unit";import{curry as c,compose as a,replace as f,equals as p,fromPairs as h,map as d,split as m,join as g,filter as y,not as b,type as w,tap as v,bind as $,pickBy as x,unary as O,complement as j,isEmpty as _,isNil as k,toPairs as N,when as P,both as S,length as z,identity as E,always as A,last as C,forEach as T,trim as F}from"ramda";var R=function(e,t){return(R=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])})(e,t)};function U(e,t){function r(){this.constructor=e}R(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)}var W=function(){return(W=Object.assign||function(e){for(var t,r=1,n=arguments.length;r<n;r++)for(var s in t=arguments[r])Object.prototype.hasOwnProperty.call(t,s)&&(e[s]=t[s]);return e}).apply(this,arguments)};function G(e){return null!=e&&"object"==typeof e&&!0===e["@@functional/placeholder"]}function H(e,t){return Object.prototype.hasOwnProperty.call(t,e)}var I,L=function(e){return function t(r){return 0===arguments.length||G(r)?t:e.apply(this,arguments)}}((function(e){var t=[];for(var r in e)H(r,e)&&(t[t.length]=[r,e[r]]);return t})),Z=c((function(e,t){for(var r,n=null,s=null,o=0;o<t.length;o++)r=t[o],e.includes(r)?n&&(s=o):(null==n&&(n=o),s=null);return t.slice(n||0,s||t.length)})),q=(a(f(/&/g,"\\&"),String),c((function(e,t){var r=t.search(e);return~r?[t.slice(0,r),t.slice(r+1)]:[t]}))),B=(a((function(e){var t=e[0],r=t[0],n=t[1],s=e.slice(1);return{name:r,value:n,attrs:p(s,[null])?{}:h(s)}}),d(a((function(e){var t=e[0],r=e[1];return t?[t,!r||decodeURIComponent(r)]:null}),q(/=/))),m(/; ?/g)),a(g("; "),y(a(b,p("Null"),w)),d((function(e){var t=e[0],r=e[1];return null===r?null:!0===r?t:t+"="+r})),(function(e){var t=e.name,r=e.value,n=e.attrs;return[[t,r]].concat(L(n))})),Z("/"),c((function(e,t){return W({},t,{headers:W({},t.headers,e)})})),I=function(e,t,r){return function(e,t,r,n){return new(r||(r=Promise))((function(s,o){function i(e){try{u(n.next(e))}catch(e){o(e)}}function l(e){try{u(n.throw(e))}catch(e){o(e)}}function u(e){e.done?s(e.value):new r((function(t){t(e.value)})).then(i,l)}u((n=n.apply(e,t||[])).next())}))}(null,void 0,void 0,(function(){return function(e,t){var r,n,s,o,i={label:0,sent:function(){if(1&s[0])throw s[1];return s[1]},trys:[],ops:[]};return o={next:l(0),throw:l(1),return:l(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function l(o){return function(l){return function(o){if(r)throw new TypeError("Generator is already executing.");for(;i;)try{if(r=1,n&&(s=2&o[0]?n.return:o[0]?n.throw||((s=n.return)&&s.call(n),0):n.next)&&!(s=s.call(n,o[1])).done)return s;switch(n=0,s&&(o=[2&o[0],s.value]),o[0]){case 0:case 1:s=o;break;case 4:return i.label++,{value:o[1],done:!1};case 5:i.label++,n=o[1],o=[0];continue;case 7:o=i.ops.pop(),i.trys.pop();continue;default:if(!(s=(s=i.trys).length>0&&s[s.length-1])&&(6===o[0]||2===o[0])){i=0;continue}if(3===o[0]&&(!s||o[1]>s[0]&&o[1]<s[3])){i.label=o[1];break}if(6===o[0]&&i.label<s[1]){i.label=s[1],s=o;break}if(s&&i.label<s[2]){i.label=s[2],i.ops.push(o);break}s[2]&&i.ops.pop(),i.trys.pop();continue}o=t.call(e,i)}catch(e){o=[6,e],n=0}finally{r=s=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,l])}}}(this,(function(n){switch(n.label){case 0:return r<t.length?[4,e(t[r])]:[3,3];case 1:return n.sent(),[4,I(e,t,++r)];case 2:n.sent(),n.label=3;case 3:return[2]}}))}))},c((function(e,t){return I(e,t,0)})),c((function(e,t){return Promise.all(t.map(e))})),v($(console.log,console)),a(x,O,j)(_)),D=(c((function(e,t){return a(h,y(j(k)),d((function(t){var r=t[0],n=t[1];return null===e[r]?null:[e[r]||r,n]})),N)(t)})),function(){function e(e){this.pattern=/never/,this.name="Fetch",this.response=e}return Object.defineProperty(e.prototype,"type",{get:function(){return this.name.toLowerCase()},enumerable:!0,configurable:!0}),e.prototype.is=function(e){return this.pattern.test(String(e))},e.prototype.try=function(){var e=this.response;if(this.is(e.status))throw new Error("HTTP "+this.name+" error: status is "+e.status)},e}());(function(e){function t(t){var r=e.call(this,t)||this;return r.pattern=/4\d[13]/,r.name="Access",r.try(),r}U(t,e)})(D),function(e){function t(t){var r=e.call(this,t)||this;return r.pattern=/5\d\d/,r.name="Server",r.try(),r}U(t,e)}(D);const J=Object.freeze({}),K=Object.freeze({f:"function",o:"object",s:"string"}),M=e=>e.replace(/-(\w)/gu,(e,t)=>t.toUpperCase()),Q=e=>{let t,r=!1;return()=>r?t:(r=!0,t=e())},V=(()=>{const e=/url\(.*?\)/g,t=/[,:;]/g;return r=>r.replace(e,e=>e.replace(t,e=>`\\${e}`))})(),X=P(j(k),f(/([^\\])\\([^\\])/g,"$1$2")),Y=S(j(_),j(k)),ee=a(p("Object"),w),te=(e,t)=>{for(let r in t)ee(e[r])&&ee(t[r])?te(e[r],t[r]):e[r]=t[r];return e},re=(()=>{try{return ee(window)}catch{return!1}})(),ne=(e,t)=>e[t]||e[M(t)],se=(e,t,r,n)=>{switch(t||(t=J),typeof r){case K.f:return[e=>r(e,n)];case K.o:return[A(r)];case K.s:return((e,t,r)=>r.split(/[,\s\t]+/g).map(r=>ne(t,r)||ne(e(),r)||J))(e,t,r).reduce((r,s)=>(r.push(...se(e,t,s,n)),r),[]);default:return[E]}};class oe{constructor(e){this.rules={};const t=e.match(/^\.[\w-_]+/);this.s={className:t?t[0].slice(1):null,modifier:t?e.slice(t[0].length)||null:e}}get complex(){return null!==this.s.className&&null!==this.s.modifier}serialize(){const{className:e,modifier:t}=this.s;return(e?`.${e}`:"")+(t||"")}}const ie=(e,t=0)=>{const r={};let n,s,o,i,l;for(l in e.rules)(n=e.rules[l])instanceof oe?(s=n.complex?n.s.className:n.serialize(),o=0==t&&"."==s[0]?s.slice(1):"."==s[0]?`& ${s}`:s,i=n.complex?{[n.s.modifier]:ie(n,t+1)}:ie(n,t+1),r[o]?te(r[o],i):r[o]=i):r[l]=n;return r};class le{constructor(){this.path=[],this.path.push([new oe("__root")])}get out(){return ie(this.path[0][0])}get depth(){return this.path.length}add(e){const t=C(this.path),r=[];for(const n of e){const e=new oe(n);for(const n of t){const t=e.serialize(),s=n.rules[t];r.push(s||e),s||(n.rules[t]=e)}}this.path.push(r)}merge(e,t){if(Y(t)&&Y(e))for(const r of C(this.path))r.rules[e]=t}pop(){return this.path.pop()}}const ue=(()=>{const e=/^([\w-]+)(: *| +)(.*)$/,t=/^(([\|~\$@>\*\.:&\(\)\^="\-\[\]]+).*[ ,]*)+:?$/,r=/\s*,\s*/g,n=/(.*):$/;return(s,o,i)=>{let l;switch(!0){case"{"==o:s.add(i);break;case"}"==o:s.pop();break;case null!=(l=e.exec(o)):s.merge(X(M(l[1])),P(isNaN,X,(e=>{switch(e){case"undefined":case"":return;case"null":return null;default:return isNaN(+e)?e:+e}})(l[3])));break;case null!=(l=t.exec(o)):i.splice(0),i.push(...o.split(r).map(e=>e.replace(n,"$1")))}}})(),ce=c(([e,t],r)=>{let n,s,o=r.length,i=e.length,l=0,u=[];for(n=0;n<o;n++)switch(r.slice(n,n+i)){case e:n+=i-1,0==l&&(s=n),l++;break;case t:if(n+=i-1,0==--l)u.push([s,n]);else if(l<0)throw new Error("fela-vue literal: unbalanced delimeter in functional expression !")}return u}),ae=a(g("\n"),d(e=>{const t=[];let r=0;for(let[n,s]of ce(["[","]"],e))t.push(e.slice(r,n),`\${${e.slice(n+1,s).replace(/(\W|^)\$([a-zA-Z_]+)\b/g,"$1$$ps.$2").replace(/(\W|^)@(.+?)\b/g,"$1$t.$2")}}`),r=s+1;return t.push(e.slice(r)),t.join("")})),fe=e=>{const t=[];let r,n,s,o=0,i=[];for(r of e)if(o>0)switch(r){case"{":o++,i[i.length-1]+=r;break;case"}":if(1==--o){const e=new Function("$t,css,$ps",`return css\`\n                ${ae(i)}\n              \``);t.push([s,(t,r)=>e(r,he,t)]),o=0,i.splice(0)}else i[i.length-1]+=r;break;default:i.push(r)}else~(n=r.indexOf("=>"))?(o=1,s=r.slice(0,n).trim().replace(/^\./,"")):t.push(r);return t},pe=(()=>{const e=["\n","\r",";"],t=t=>e.includes(t),r=/(([\s^]+?\/\/.*$)|\/\*(.|[\n\r])*?\*\/)/gm;return n=>{const s=new le,o=[];return a(()=>s.out,T(e=>{if("Array"==w(e))s.merge(e[0],e[1]);else if(e&&ue(s,e,o),s.depth<1)throw new Error("lit-css parse error: unbalanced {} braces !")}),fe,y(j(_)),d(F),(e=>t=>{const r=d(z,e),n=[];let s,o,i=0,l=e.length,u=t.length;for(s=0;s<u;s++)for(o=0;o<l;o++)t.slice(s,s+r[o])===e[o]&&"\\"!==t[s-1]&&(n.push(t.slice(i,s)),i=(s+=r[o]-1)+1);return i!==t.length-1&&n.push(t.slice(i)),n})(e),f(/(\{|\})/g,(e,r,n,s)=>(t(s[n-1])||(r=";"+r),t(s[n+1])||(r+=";"),r)),V,f(r,""))(n)}})(),he=(()=>(e,...t)=>pe(((e,t)=>e.reduce((e,r,n)=>e+r+(t.length>n?t[n]:""),""))(e,t)))(),de={method:"f",defStyles:void 0,plugins:[],enhancers:[],preset:{unit:[]},ssr:!1};class me{constructor(s={}){const{method:c,ssr:a,preset:f,plugins:p,enhancers:h,...d}={...de,...s},m={...de.preset,...f||{}};if(s.fdef)throw new Error("fela-vue: Change deprecated `fdef` to `defStyles`!");this.renderer=e({...d,enhancers:h,plugins:[o(),i(),l(),u(...m.unit),...p]});const{renderer:g}=this,y=s.defStyles;let b,w;switch(typeof y){case K.o:[b,w]=[y.key,y.value];break;case K.f:[b,w]=["fdef",y]}re&&(a?r(g):n(g)),this._mixin=B({methods:{[c](e,r={}){return g.renderRule(t(...se(Q(()=>w?w(this):J),this.style,e,this)),r)||void 0}},computed:y?{[b](){return w(this)}}:""})}get mixin(){return Object.freeze(this._mixin)}get style(){return s(this.renderer)}}export{me as Renderer,he as css};
