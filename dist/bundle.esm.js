import{createRenderer as e,combineRules as t}from"fela";import{renderToMarkup as r,rehydrate as n,render as s}from"fela-dom";import o from"fela-plugin-embedded";import i from"fela-plugin-prefixer";import f from"fela-plugin-fallback-value";import c from"fela-plugin-unit";const a=(()=>{try{return(e=>"object"==typeof e)(window)}catch(e){return!1}})(),l={method:"f",defStyles:void 0,plugins:[],enhancers:[],preset:{unit:[]},ssr:!1},p=Object.freeze({f:"function",o:"object",s:"string"}),u=(()=>{const e=e=>()=>e,t=e=>e;return(r,n)=>{switch(typeof n){case p.f:return[n];case p.o:return[e(n)];case p.s:return((e,t)=>t.split(/[,\s\t]+/g).map(t=>((e,t)=>e?e[t]||e[(e=>e.replace(/-(\w)/gu,(e,t)=>t.toUpperCase()))(t)]:{})(e,t)))(r,n).reduce((e,t)=>(e.push(...u(r,t)),e),[]);default:return[t]}}})();class d{get mixin(){return Object.freeze(this._mixin)}get style(){return r(this.renderer)}constructor(r={}){const d=Object.assign({},l,r),{method:m,ssr:h,preset:g,plugins:y,enhancers:b}=d,O=function(e,t){var r={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&t.indexOf(n)<0&&(r[n]=e[n]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var s=0;for(n=Object.getOwnPropertySymbols(e);s<n.length;s++)t.indexOf(n[s])<0&&(r[n[s]]=e[n[s]])}return r}(d,["method","ssr","preset","plugins","enhancers"]),j=Object.assign({},l.preset,g||{});if(r.fdef)throw new Error("fela-vue: Change deprecated `fdef` to `defStyles`!");this.renderer=e(Object.assign({},O,{enhancers:b,plugins:[o(),i(),f(),c(...j.unit),...y]}));const{renderer:w}=this,v=r.defStyles;let x,S;switch(typeof v){case p.o:[x,S]=[v.key,v.value];break;case p.f:[x,S]=["fdef",v]}a&&(h?n(w):s(w)),this._mixin={methods:{[m](e,r={}){return w.renderRule(t(...u(this.style,e)),r)}},computed:v?{[x](){return S(this)}}:{}}}}export{d as Renderer};
