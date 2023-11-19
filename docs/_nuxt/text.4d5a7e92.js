import{a9 as O,m as S,f as R,a as T,k as P,i as g,b as C,h as a,X as V,T as _,p as m,an as j,l as E}from"./entry.965cbfb6.js";import{e as w,p as $}from"./Space.f818dfb9.js";import{u as H}from"./use-houdini.66c23f06.js";import{d as L}from"./Scrollbar.f1d32ba1.js";const A=e=>{const{heightSmall:r,heightMedium:s,heightLarge:t,borderRadius:o}=e;return{color:"#eee",colorEnd:"#ddd",borderRadius:o,heightSmall:r,heightMedium:s,heightLarge:t}},D={name:"Skeleton",common:O,self:A},M=S([R("skeleton",`
 height: 1em;
 width: 100%;
 transition: background-color .3s var(--n-bezier);
 transition:
 --n-color-start .3s var(--n-bezier),
 --n-color-end .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 animation: 2s skeleton-loading infinite cubic-bezier(0.36, 0, 0.64, 1);
 background-color: var(--n-color-start);
 `),S("@keyframes skeleton-loading",`
 0% {
 background: var(--n-color-start);
 }
 40% {
 background: var(--n-color-end);
 }
 80% {
 background: var(--n-color-start);
 }
 100% {
 background: var(--n-color-start);
 }
 `)]),F=Object.assign(Object.assign({},g.props),{text:Boolean,round:Boolean,circle:Boolean,height:[String,Number],width:[String,Number],size:String,repeat:{type:Number,default:1},animated:{type:Boolean,default:!0},sharp:{type:Boolean,default:!0}}),J=T({name:"Skeleton",inheritAttrs:!1,props:F,setup(e){H();const{mergedClsPrefixRef:r}=P(e),s=g("Skeleton","-skeleton",M,D,e,r);return{mergedClsPrefix:r,style:C(()=>{var t,o;const n=s.value,{common:{cubicBezierEaseInOut:h}}=n,l=n.self,{color:f,colorEnd:b,borderRadius:p}=l;let d;const{circle:c,sharp:v,round:x,width:i,height:u,size:z,text:B,animated:N}=e;z!==void 0&&(d=l[w("height",z)]);const y=c?(t=i!=null?i:u)!==null&&t!==void 0?t:d:i,k=(o=c&&i!=null?i:u)!==null&&o!==void 0?o:d;return{display:B?"inline-block":"",verticalAlign:B?"-0.125em":"",borderRadius:c?"50%":x?"4096px":v?"":p,width:typeof y=="number"?$(y):y,height:typeof k=="number"?$(k):k,animation:N?"":"none","--n-bezier":h,"--n-color-start":f,"--n-color-end":b}})}},render(){const{repeat:e,style:r,mergedClsPrefix:s,$attrs:t}=this,o=a("div",V({class:`${s}-skeleton`,style:r},t));return e>1?a(_,null,Array.apply(null,{length:e}).map(n=>[o,`
`])):o}}),I=R("text",`
 transition: color .3s var(--n-bezier);
 color: var(--n-text-color);
`,[m("strong",`
 font-weight: var(--n-font-weight-strong);
 `),m("italic",{fontStyle:"italic"}),m("underline",{textDecoration:"underline"}),m("code",`
 line-height: 1.4;
 display: inline-block;
 font-family: var(--n-font-famliy-mono);
 transition: 
 color .3s var(--n-bezier),
 border-color .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 box-sizing: border-box;
 padding: .05em .35em 0 .35em;
 border-radius: var(--n-code-border-radius);
 font-size: .9em;
 color: var(--n-code-text-color);
 background-color: var(--n-code-color);
 border: var(--n-code-border);
 `)]),K=Object.assign(Object.assign({},g.props),{code:Boolean,type:{type:String,default:"default"},delete:Boolean,strong:Boolean,italic:Boolean,underline:Boolean,depth:[String,Number],tag:String,as:{type:String,validator:()=>!0,default:void 0}}),Q=T({name:"Text",props:K,setup(e){const{mergedClsPrefixRef:r,inlineThemeDisabled:s}=P(e),t=g("Typography","-text",I,j,e,r),o=C(()=>{const{depth:h,type:l}=e,f=l==="default"?h===void 0?"textColor":`textColor${h}Depth`:w("textColor",l),{common:{fontWeightStrong:b,fontFamilyMono:p,cubicBezierEaseInOut:d},self:{codeTextColor:c,codeBorderRadius:v,codeColor:x,codeBorder:i,[f]:u}}=t.value;return{"--n-bezier":d,"--n-text-color":u,"--n-font-weight-strong":b,"--n-font-famliy-mono":p,"--n-code-border-radius":v,"--n-code-text-color":c,"--n-code-color":x,"--n-code-border":i}}),n=s?E("text",C(()=>`${e.type[0]}${e.depth||""}`),o,e):void 0;return{mergedClsPrefix:r,compitableTag:L(e,["as","tag"]),cssVars:s?void 0:o,themeClass:n==null?void 0:n.themeClass,onRender:n==null?void 0:n.onRender}},render(){var e,r,s;const{mergedClsPrefix:t}=this;(e=this.onRender)===null||e===void 0||e.call(this);const o=[`${t}-text`,this.themeClass,{[`${t}-text--code`]:this.code,[`${t}-text--delete`]:this.delete,[`${t}-text--strong`]:this.strong,[`${t}-text--italic`]:this.italic,[`${t}-text--underline`]:this.underline}],n=(s=(r=this.$slots).default)===null||s===void 0?void 0:s.call(r);return this.code?a("code",{class:o,style:this.cssVars},this.delete?a("del",null,n):n):this.delete?a("del",{class:o,style:this.cssVars},n):a(this.compitableTag||"span",{class:o,style:this.cssVars},n)}});export{Q as N,J as a};
