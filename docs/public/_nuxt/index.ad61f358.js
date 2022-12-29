import{h as d,f as z,p as x,m as a,K as O,a as I,w as A,L as $}from"./entry.328b861b.js";import{r as E,a as M,b as T}from"./Space.59a4ec5d.js";const _=E("close",d("svg",{viewBox:"0 0 12 12",version:"1.1",xmlns:"http://www.w3.org/2000/svg","aria-hidden":!0},d("g",{stroke:"none","stroke-width":"1",fill:"none","fill-rule":"evenodd"},d("g",{fill:"currentColor","fill-rule":"nonzero"},d("path",{d:"M2.08859116,2.2156945 L2.14644661,2.14644661 C2.32001296,1.97288026 2.58943736,1.95359511 2.7843055,2.08859116 L2.85355339,2.14644661 L6,5.293 L9.14644661,2.14644661 C9.34170876,1.95118446 9.65829124,1.95118446 9.85355339,2.14644661 C10.0488155,2.34170876 10.0488155,2.65829124 9.85355339,2.85355339 L6.707,6 L9.85355339,9.14644661 C10.0271197,9.32001296 10.0464049,9.58943736 9.91140884,9.7843055 L9.85355339,9.85355339 C9.67998704,10.0271197 9.41056264,10.0464049 9.2156945,9.91140884 L9.14644661,9.85355339 L6,6.707 L2.85355339,9.85355339 C2.65829124,10.0488155 2.34170876,10.0488155 2.14644661,9.85355339 C1.95118446,9.65829124 1.95118446,9.34170876 2.14644661,9.14644661 L5.293,6 L2.14644661,2.85355339 C1.97288026,2.67998704 1.95359511,2.41056264 2.08859116,2.2156945 L2.14644661,2.14644661 L2.08859116,2.2156945 Z"}))))),h=z("base-close",`
 display: flex;
 align-items: center;
 justify-content: center;
 cursor: pointer;
 background-color: transparent;
 color: var(--n-close-icon-color);
 border-radius: var(--n-close-border-radius);
 height: var(--n-close-size);
 width: var(--n-close-size);
 font-size: var(--n-close-icon-size);
 outline: none;
 border: none;
 position: relative;
 padding: 0;
`,[x("absolute",`
 height: var(--n-close-icon-size);
 width: var(--n-close-icon-size);
 `),a("&::before",`
 content: "";
 position: absolute;
 width: var(--n-close-size);
 height: var(--n-close-size);
 left: 50%;
 top: 50%;
 transform: translateY(-50%) translateX(-50%);
 transition: inherit;
 border-radius: inherit;
 `),O("disabled",[a("&:hover",`
 color: var(--n-close-icon-color-hover);
 `),a("&:hover::before",`
 background-color: var(--n-close-color-hover);
 `),a("&:focus::before",`
 background-color: var(--n-close-color-hover);
 `),a("&:active",`
 color: var(--n-close-icon-color-pressed);
 `),a("&:active::before",`
 background-color: var(--n-close-color-pressed);
 `)]),x("disabled",`
 cursor: not-allowed;
 color: var(--n-close-icon-color-disabled);
 background-color: transparent;
 `),x("round",[a("&::before",`
 border-radius: 50%;
 `)])]),N=I({name:"BaseClose",props:{isButtonTag:{type:Boolean,default:!0},clsPrefix:{type:String,required:!0},disabled:{type:Boolean,default:void 0},focusable:{type:Boolean,default:!0},round:Boolean,onClick:Function,absolute:Boolean},setup(c){return M("-base-close",h,A(c,"clsPrefix")),()=>{const{clsPrefix:u,disabled:l,absolute:m,round:w,isButtonTag:g}=c;return d(g?"button":"div",{type:g?"button":void 0,tabindex:l||!c.focusable?-1:0,"aria-disabled":l,"aria-label":"close",role:g?void 0:"button",disabled:l,class:[`${u}-base-close`,m&&`${u}-base-close--absolute`,l&&`${u}-base-close--disabled`,w&&`${u}-base-close--round`],onMousedown:L=>{c.focusable||L.preventDefault()},onClick:c.onClick},d(T,{clsPrefix:u},{default:()=>d(_,null)}))}}});var k={exports:{}};(function(c){(function(u,l){c.exports=l()})($,function(){var u=Object.prototype.toString;function l(i,t){return i==null?!1:Object.prototype.hasOwnProperty.call(i,t)}function m(i){if(!i||f(i)&&i.length===0)return!0;if(typeof i!="string"){for(var t in i)if(l(i,t))return!1;return!0}return!1}function w(i){return u.call(i)}function g(i){return typeof i=="object"&&w(i)==="[object Object]"}var f=Array.isArray||function(i){return u.call(i)==="[object Array]"};function L(i){return typeof i=="boolean"||w(i)==="[object Boolean]"}function p(i){var t=parseInt(i);return t.toString()===i?t:i}function B(i){i=i||{};var t=function(n){return Object.keys(t).reduce(function(e,r){return r==="create"||typeof t[r]=="function"&&(e[r]=t[r].bind(t,n)),e},{})},v;i.includeInheritedProps?v=function(){return!0}:v=function(n,e){return typeof e=="number"&&Array.isArray(n)||l(n,e)};function S(n,e){if(v(n,e))return n[e]}var y;i.includeInheritedProps?y=function(n,e){typeof e!="string"&&typeof e!="number"&&(e=String(e));var r=S(n,e);if(e==="__proto__"||e==="prototype"||e==="constructor"&&typeof r=="function")throw new Error("For security reasons, object's magic properties cannot be set");return r}:y=function(n,e){return S(n,e)};function C(n,e,r,o){if(typeof e=="number"&&(e=[e]),!e||e.length===0)return n;if(typeof e=="string")return C(n,e.split(".").map(p),r,o);var s=e[0],b=y(n,s);return e.length===1?((b===void 0||!o)&&(n[s]=r),b):(b===void 0&&(typeof e[1]=="number"?n[s]=[]:n[s]={}),C(n[s],e.slice(1),r,o))}return t.has=function(n,e){if(typeof e=="number"?e=[e]:typeof e=="string"&&(e=e.split(".")),!e||e.length===0)return!!n;for(var r=0;r<e.length;r++){var o=p(e[r]);if(typeof o=="number"&&f(n)&&o<n.length||(i.includeInheritedProps?o in Object(n):l(n,o)))n=n[o];else return!1}return!0},t.ensureExists=function(n,e,r){return C(n,e,r,!0)},t.set=function(n,e,r,o){return C(n,e,r,o)},t.insert=function(n,e,r,o){var s=t.get(n,e);o=~~o,f(s)||(s=[],t.set(n,e,s)),s.splice(o,0,r)},t.empty=function(n,e){if(!m(e)&&n!=null){var r,o;if(!!(r=t.get(n,e))){if(typeof r=="string")return t.set(n,e,"");if(L(r))return t.set(n,e,!1);if(typeof r=="number")return t.set(n,e,0);if(f(r))r.length=0;else if(g(r))for(o in r)v(r,o)&&delete r[o];else return t.set(n,e,null)}}},t.push=function(n,e){var r=t.get(n,e);f(r)||(r=[],t.set(n,e,r)),r.push.apply(r,Array.prototype.slice.call(arguments,2))},t.coalesce=function(n,e,r){for(var o,s=0,b=e.length;s<b;s++)if((o=t.get(n,e[s]))!==void 0)return o;return r},t.get=function(n,e,r){if(typeof e=="number"&&(e=[e]),!e||e.length===0)return n;if(n==null)return r;if(typeof e=="string")return t.get(n,e.split("."),r);var o=p(e[0]),s=y(n,o);return s===void 0?r:e.length===1?s:t.get(n[o],e.slice(1),r)},t.del=function(e,r){if(typeof r=="number"&&(r=[r]),e==null||m(r))return e;if(typeof r=="string")return t.del(e,r.split("."));var o=p(r[0]);if(y(e,o),!v(e,o))return e;if(r.length===1)f(e)?e.splice(o,1):delete e[o];else return t.del(e[o],r.slice(1));return e},t}var P=B();return P.create=B,P.withInheritedProps=B({includeInheritedProps:!0}),P})})(k);const q=k.exports;export{N,q as o};
