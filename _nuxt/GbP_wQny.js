import{ah as f,aC as y,cN as k,j as i,c0 as x,c9 as l,b$ as a,ca as R,bs as w}from"./iB-vctTS.js";import{t as L,a as $,N as B}from"./BIT3B5YX.js";function ie(e){return typeof e=="string"?e.endsWith("px")?Number(e.slice(0,e.length-2)):Number(e):e}function le(e){if(e!=null)return typeof e=="number"?`${e}px`:e.endsWith("px")?e:`${e}px`}function ce(e,n){const r=e.trim().split(/\s+/g),o={top:r[0]};switch(r.length){case 1:o.right=r[0],o.bottom=r[0],o.left=r[0];break;case 2:o.right=r[1],o.left=r[1],o.bottom=r[0];break;case 3:o.right=r[1],o.bottom=r[2],o.left=r[1];break;case 4:o.right=r[1],o.bottom=r[2],o.left=r[3];break;default:throw new Error("[seemly/getMargin]:"+e+" is not a valid value.")}return n===void 0?o:o[n]}function ue(e,n){const[r,o]=e.split(" ");return{row:r,col:o||r}}function M(e,n,r){var o=-1,t=e.length;n<0&&(n=-n>t?0:t+n),r=r>t?t:r,r<0&&(r+=t),t=n>r?0:r-n>>>0,n>>>=0;for(var s=Array(t);++o<t;)s[o]=e[o+n];return s}function S(e,n,r){var o=e.length;return r=r===void 0?o:r,!n&&r>=o?e:M(e,n,r)}var z="\\ud800-\\udfff",A="\\u0300-\\u036f",N="\\ufe20-\\ufe2f",j="\\u20d0-\\u20ff",T=A+N+j,P="\\ufe0e\\ufe0f",I="\\u200d",E=RegExp("["+I+z+T+P+"]");function d(e){return E.test(e)}function F(e){return e.split("")}var b="\\ud800-\\udfff",O="\\u0300-\\u036f",U="\\ufe20-\\ufe2f",W="\\u20d0-\\u20ff",G=O+U+W,H="\\ufe0e\\ufe0f",J="["+b+"]",c="["+G+"]",u="\\ud83c[\\udffb-\\udfff]",V="(?:"+c+"|"+u+")",g="[^"+b+"]",v="(?:\\ud83c[\\udde6-\\uddff]){2}",p="[\\ud800-\\udbff][\\udc00-\\udfff]",Z="\\u200d",h=V+"?",m="["+H+"]?",q="(?:"+Z+"(?:"+[g,v,p].join("|")+")"+m+h+")*",_=m+h+q,D="(?:"+[g+c+"?",c,v,p,J].join("|")+")",K=RegExp(u+"(?="+u+")|"+D+_,"g");function X(e){return e.match(K)||[]}function Y(e){return d(e)?X(e):F(e)}function Q(e){return function(n){n=L(n);var r=d(n)?Y(n):void 0,o=r?r[0]:n.charAt(0),t=r?S(r,1).join(""):n.slice(1);return o[e]()+t}}var ee=Q("toUpperCase");function re(e,n){return f({name:ee(e),setup(){var r;const o=(r=y(k,null))===null||r===void 0?void 0:r.mergedIconsRef;return()=>{var t;const s=(t=o==null?void 0:o.value)===null||t===void 0?void 0:t[e];return s?s():n}}})}const oe=re("close",i("svg",{viewBox:"0 0 12 12",version:"1.1",xmlns:"http://www.w3.org/2000/svg","aria-hidden":!0},i("g",{stroke:"none","stroke-width":"1",fill:"none","fill-rule":"evenodd"},i("g",{fill:"currentColor","fill-rule":"nonzero"},i("path",{d:"M2.08859116,2.2156945 L2.14644661,2.14644661 C2.32001296,1.97288026 2.58943736,1.95359511 2.7843055,2.08859116 L2.85355339,2.14644661 L6,5.293 L9.14644661,2.14644661 C9.34170876,1.95118446 9.65829124,1.95118446 9.85355339,2.14644661 C10.0488155,2.34170876 10.0488155,2.65829124 9.85355339,2.85355339 L6.707,6 L9.85355339,9.14644661 C10.0271197,9.32001296 10.0464049,9.58943736 9.91140884,9.7843055 L9.85355339,9.85355339 C9.67998704,10.0271197 9.41056264,10.0464049 9.2156945,9.91140884 L9.14644661,9.85355339 L6,6.707 L2.85355339,9.85355339 C2.65829124,10.0488155 2.34170876,10.0488155 2.14644661,9.85355339 C1.95118446,9.65829124 1.95118446,9.34170876 2.14644661,9.14644661 L5.293,6 L2.14644661,2.85355339 C1.97288026,2.67998704 1.95359511,2.41056264 2.08859116,2.2156945 L2.14644661,2.14644661 L2.08859116,2.2156945 Z"}))))),ne=x("base-close",`
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
`,[l("absolute",`
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
 `),R("disabled",[a("&:hover",`
 color: var(--n-close-icon-color-hover);
 `),a("&:hover::before",`
 background-color: var(--n-close-color-hover);
 `),a("&:focus::before",`
 background-color: var(--n-close-color-hover);
 `),a("&:active",`
 color: var(--n-close-icon-color-pressed);
 `),a("&:active::before",`
 background-color: var(--n-close-color-pressed);
 `)]),l("disabled",`
 cursor: not-allowed;
 color: var(--n-close-icon-color-disabled);
 background-color: transparent;
 `),l("round",[a("&::before",`
 border-radius: 50%;
 `)])]),fe=f({name:"BaseClose",props:{isButtonTag:{type:Boolean,default:!0},clsPrefix:{type:String,required:!0},disabled:{type:Boolean,default:void 0},focusable:{type:Boolean,default:!0},round:Boolean,onClick:Function,absolute:Boolean},setup(e){return $("-base-close",ne,w(e,"clsPrefix")),()=>{const{clsPrefix:n,disabled:r,absolute:o,round:t,isButtonTag:s}=e;return i(s?"button":"div",{type:s?"button":void 0,tabindex:r||!e.focusable?-1:0,"aria-disabled":r,"aria-label":"close",role:s?void 0:"button",disabled:r,class:[`${n}-base-close`,o&&`${n}-base-close--absolute`,r&&`${n}-base-close--disabled`,t&&`${n}-base-close--round`],onMousedown:C=>{e.focusable||C.preventDefault()},onClick:e.onClick},i(B,{clsPrefix:n},{default:()=>i(oe,null)}))}}});export{fe as N,ue as a,ie as d,ce as g,le as p,re as r};
