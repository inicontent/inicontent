import{f as d,aA as R,cH as y,s as i,bW as k,c2 as t,bV as l,c3 as L,bp as w}from"./xEahERNa.js";import{t as x,a as B,N as S}from"./B9qM5nxZ.js";function $(e,r,o){var a=-1,n=e.length;r<0&&(r=-r>n?0:n+r),o=o>n?n:o,o<0&&(o+=n),n=r>o?0:o-r>>>0,r>>>=0;for(var s=Array(n);++a<n;)s[a]=e[a+r];return s}function z(e,r,o){var a=e.length;return o=o===void 0?a:o,!r&&o>=a?e:$(e,r,o)}var A="\\ud800-\\udfff",M="\\u0300-\\u036f",T="\\ufe20-\\ufe2f",j="\\u20d0-\\u20ff",N=M+T+j,P="\\ufe0e\\ufe0f",I="\\u200d",F=RegExp("["+I+A+N+P+"]");function f(e){return F.test(e)}function H(e){return e.split("")}var b="\\ud800-\\udfff",O="\\u0300-\\u036f",U="\\ufe20-\\ufe2f",V="\\u20d0-\\u20ff",E=O+U+V,J="\\ufe0e\\ufe0f",W="["+b+"]",c="["+E+"]",u="\\ud83c[\\udffb-\\udfff]",Z="(?:"+c+"|"+u+")",v="[^"+b+"]",g="(?:\\ud83c[\\udde6-\\uddff]){2}",h="[\\ud800-\\udbff][\\udc00-\\udfff]",q="\\u200d",p=Z+"?",C="["+J+"]?",_="(?:"+q+"(?:"+[v,g,h].join("|")+")"+C+p+")*",D=C+p+_,K="(?:"+[v+c+"?",c,g,h,W].join("|")+")",X=RegExp(u+"(?="+u+")|"+K+D,"g");function Y(e){return e.match(X)||[]}function G(e){return f(e)?Y(e):H(e)}function Q(e){return function(r){r=x(r);var o=f(r)?G(r):void 0,a=o?o[0]:r.charAt(0),n=o?z(o,1).join(""):r.slice(1);return a[e]()+n}}var ee=Q("toUpperCase");function oe(e,r){return d({name:ee(e),setup(){var o;const a=(o=R(y,null))===null||o===void 0?void 0:o.mergedIconsRef;return()=>{var n;const s=(n=a==null?void 0:a.value)===null||n===void 0?void 0:n[e];return s?s():r}}})}const re=oe("close",i("svg",{viewBox:"0 0 12 12",version:"1.1",xmlns:"http://www.w3.org/2000/svg","aria-hidden":!0},i("g",{stroke:"none","stroke-width":"1",fill:"none","fill-rule":"evenodd"},i("g",{fill:"currentColor","fill-rule":"nonzero"},i("path",{d:"M2.08859116,2.2156945 L2.14644661,2.14644661 C2.32001296,1.97288026 2.58943736,1.95359511 2.7843055,2.08859116 L2.85355339,2.14644661 L6,5.293 L9.14644661,2.14644661 C9.34170876,1.95118446 9.65829124,1.95118446 9.85355339,2.14644661 C10.0488155,2.34170876 10.0488155,2.65829124 9.85355339,2.85355339 L6.707,6 L9.85355339,9.14644661 C10.0271197,9.32001296 10.0464049,9.58943736 9.91140884,9.7843055 L9.85355339,9.85355339 C9.67998704,10.0271197 9.41056264,10.0464049 9.2156945,9.91140884 L9.14644661,9.85355339 L6,6.707 L2.85355339,9.85355339 C2.65829124,10.0488155 2.34170876,10.0488155 2.14644661,9.85355339 C1.95118446,9.65829124 1.95118446,9.34170876 2.14644661,9.14644661 L5.293,6 L2.14644661,2.85355339 C1.97288026,2.67998704 1.95359511,2.41056264 2.08859116,2.2156945 L2.14644661,2.14644661 L2.08859116,2.2156945 Z"}))))),ne=k("base-close",`
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
`,[t("absolute",`
 height: var(--n-close-icon-size);
 width: var(--n-close-icon-size);
 `),l("&::before",`
 content: "";
 position: absolute;
 width: var(--n-close-size);
 height: var(--n-close-size);
 left: 50%;
 top: 50%;
 transform: translateY(-50%) translateX(-50%);
 transition: inherit;
 border-radius: inherit;
 `),L("disabled",[l("&:hover",`
 color: var(--n-close-icon-color-hover);
 `),l("&:hover::before",`
 background-color: var(--n-close-color-hover);
 `),l("&:focus::before",`
 background-color: var(--n-close-color-hover);
 `),l("&:active",`
 color: var(--n-close-icon-color-pressed);
 `),l("&:active::before",`
 background-color: var(--n-close-color-pressed);
 `)]),t("disabled",`
 cursor: not-allowed;
 color: var(--n-close-icon-color-disabled);
 background-color: transparent;
 `),t("round",[l("&::before",`
 border-radius: 50%;
 `)])]),ie=d({name:"BaseClose",props:{isButtonTag:{type:Boolean,default:!0},clsPrefix:{type:String,required:!0},disabled:{type:Boolean,default:void 0},focusable:{type:Boolean,default:!0},round:Boolean,onClick:Function,absolute:Boolean},setup(e){return B("-base-close",ne,w(e,"clsPrefix")),()=>{const{clsPrefix:r,disabled:o,absolute:a,round:n,isButtonTag:s}=e;return i(s?"button":"div",{type:s?"button":void 0,tabindex:o||!e.focusable?-1:0,"aria-disabled":o,"aria-label":"close",role:s?void 0:"button",disabled:o,class:[`${r}-base-close`,a&&`${r}-base-close--absolute`,o&&`${r}-base-close--disabled`,n&&`${r}-base-close--round`],onMousedown:m=>{e.focusable||m.preventDefault()},onClick:e.onClick},i(S,{clsPrefix:r},{default:()=>i(re,null)}))}}});export{ie as N,oe as r};
