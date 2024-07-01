import{i as y}from"./CfH0Rfnd.js";import{c0 as l,b$ as n,c9 as P,cb as u,ah as g,c2 as x,c1 as T,b2 as $,bs as j,a6 as p,j as v,cd as E,dM as I,r as S,k as _,b0 as w,aC as H}from"./iB-vctTS.js";import{u as N,d as M}from"./BIT3B5YX.js";const O=l("breadcrumb",`
 white-space: nowrap;
 cursor: default;
 line-height: var(--n-item-line-height);
`,[n("ul",`
 list-style: none;
 padding: 0;
 margin: 0;
 `),n("a",`
 color: inherit;
 text-decoration: inherit;
 `),l("breadcrumb-item",`
 font-size: var(--n-font-size);
 transition: color .3s var(--n-bezier);
 display: inline-flex;
 align-items: center;
 `,[l("icon",`
 font-size: 18px;
 vertical-align: -.2em;
 transition: color .3s var(--n-bezier);
 color: var(--n-item-text-color);
 `),n("&:not(:last-child)",[P("clickable",[u("link",`
 cursor: pointer;
 `,[n("&:hover",`
 background-color: var(--n-item-color-hover);
 `),n("&:active",`
 background-color: var(--n-item-color-pressed); 
 `)])])]),u("link",`
 padding: 4px;
 border-radius: var(--n-item-border-radius);
 transition:
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 color: var(--n-item-text-color);
 position: relative;
 `,[n("&:hover",`
 color: var(--n-item-text-color-hover);
 `,[l("icon",`
 color: var(--n-item-text-color-hover);
 `)]),n("&:active",`
 color: var(--n-item-text-color-pressed);
 `,[l("icon",`
 color: var(--n-item-text-color-pressed);
 `)])]),u("separator",`
 margin: 0 8px;
 color: var(--n-separator-color);
 transition: color .3s var(--n-bezier);
 user-select: none;
 -webkit-user-select: none;
 `),n("&:last-child",[u("link",`
 font-weight: var(--n-font-weight-active);
 cursor: unset;
 color: var(--n-item-text-color-active);
 `,[l("icon",`
 color: var(--n-item-text-color-active);
 `)]),u("separator",`
 display: none;
 `)])])]),C=E("n-breadcrumb"),V=Object.assign(Object.assign({},x.props),{separator:{type:String,default:"/"}}),q=g({name:"Breadcrumb",props:V,setup(e){const{mergedClsPrefixRef:o,inlineThemeDisabled:r}=T(e),s=x("Breadcrumb","-breadcrumb",O,I,e,o);$(C,{separatorRef:j(e,"separator"),mergedClsPrefixRef:o});const c=p(()=>{const{common:{cubicBezierEaseInOut:d},self:{separatorColor:m,itemTextColor:a,itemTextColorHover:i,itemTextColorPressed:b,itemTextColorActive:h,fontSize:f,fontWeightActive:k,itemBorderRadius:R,itemColorHover:B,itemColorPressed:z,itemLineHeight:L}}=s.value;return{"--n-font-size":f,"--n-bezier":d,"--n-item-text-color":a,"--n-item-text-color-hover":i,"--n-item-text-color-pressed":b,"--n-item-text-color-active":h,"--n-separator-color":m,"--n-item-color-hover":B,"--n-item-color-pressed":z,"--n-item-border-radius":R,"--n-font-weight-active":k,"--n-item-line-height":L}}),t=r?N("breadcrumb",void 0,c,e):void 0;return{mergedClsPrefix:o,cssVars:r?void 0:c,themeClass:t==null?void 0:t.themeClass,onRender:t==null?void 0:t.onRender}},render(){var e;return(e=this.onRender)===null||e===void 0||e.call(this),v("nav",{class:[`${this.mergedClsPrefix}-breadcrumb`,this.themeClass],style:this.cssVars,"aria-label":"Breadcrumb"},v("ul",null,this.$slots))}}),A=(e=y?window:null)=>{const o=()=>{const{hash:c,host:t,hostname:d,href:m,origin:a,pathname:i,port:b,protocol:h,search:f}=(e==null?void 0:e.location)||{};return{hash:c,host:t,hostname:d,href:m,origin:a,pathname:i,port:b,protocol:h,search:f}},r=()=>{s.value=o()},s=S(o());return _(()=>{e&&(e.addEventListener("popstate",r),e.addEventListener("hashchange",r))}),w(()=>{e&&(e.removeEventListener("popstate",r),e.removeEventListener("hashchange",r))}),s},K={separator:String,href:String,clickable:{type:Boolean,default:!0},onClick:Function},G=g({name:"BreadcrumbItem",props:K,setup(e,{slots:o}){const r=H(C,null);if(!r)return()=>null;const{separatorRef:s,mergedClsPrefixRef:c}=r,t=A(),d=p(()=>e.href?"a":"span"),m=p(()=>t.value.href===e.href?"location":null);return()=>{const{value:a}=c;return v("li",{class:[`${a}-breadcrumb-item`,e.clickable&&`${a}-breadcrumb-item--clickable`]},v(d.value,{class:`${a}-breadcrumb-item__link`,"aria-current":m.value,href:e.href,onClick:e.onClick},o),v("span",{class:`${a}-breadcrumb-item__separator`,"aria-hidden":"true"},M(o.separator,()=>{var i;return[(i=e.separator)!==null&&i!==void 0?i:s.value]})))}}});export{q as N,G as a};
