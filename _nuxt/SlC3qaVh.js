import{i as y}from"./B2NL4HPj.js";import{bW as l,bV as i,c3 as P,c5 as u,f as g,bX as T,bY as x,a$ as I,bp as $,a7 as p,s as v,c7 as E,dI as S,r as _,i as j,aZ as w,aA as H}from"./BGV9FyjN.js";import{u as N,d as V}from"./Cp2dohlU.js";const A=l("breadcrumb",`
 white-space: nowrap;
 cursor: default;
 line-height: var(--n-item-line-height);
`,[i("ul",`
 list-style: none;
 padding: 0;
 margin: 0;
 `),i("a",`
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
 `),i("&:not(:last-child)",[P("clickable",[u("link",`
 cursor: pointer;
 `,[i("&:hover",`
 background-color: var(--n-item-color-hover);
 `),i("&:active",`
 background-color: var(--n-item-color-pressed); 
 `)])])]),u("link",`
 padding: 4px;
 border-radius: var(--n-item-border-radius);
 transition:
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 color: var(--n-item-text-color);
 position: relative;
 `,[i("&:hover",`
 color: var(--n-item-text-color-hover);
 `,[l("icon",`
 color: var(--n-item-text-color-hover);
 `)]),i("&:active",`
 color: var(--n-item-text-color-pressed);
 `,[l("icon",`
 color: var(--n-item-text-color-pressed);
 `)])]),u("separator",`
 margin: 0 8px;
 color: var(--n-separator-color);
 transition: color .3s var(--n-bezier);
 user-select: none;
 -webkit-user-select: none;
 `),i("&:last-child",[u("link",`
 font-weight: var(--n-font-weight-active);
 cursor: unset;
 color: var(--n-item-text-color-active);
 `,[l("icon",`
 color: var(--n-item-text-color-active);
 `)]),u("separator",`
 display: none;
 `)])])]),C=E("n-breadcrumb"),O=Object.assign(Object.assign({},x.props),{separator:{type:String,default:"/"}}),X=g({name:"Breadcrumb",props:O,setup(e){const{mergedClsPrefixRef:t,inlineThemeDisabled:o}=T(e),a=x("Breadcrumb","-breadcrumb",A,S,e,t);I(C,{separatorRef:$(e,"separator"),mergedClsPrefixRef:t});const c=p(()=>{const{common:{cubicBezierEaseInOut:d},self:{separatorColor:m,itemTextColor:n,itemTextColorHover:s,itemTextColorPressed:b,itemTextColorActive:h,fontSize:f,fontWeightActive:k,itemBorderRadius:R,itemColorHover:B,itemColorPressed:z,itemLineHeight:L}}=a.value;return{"--n-font-size":f,"--n-bezier":d,"--n-item-text-color":n,"--n-item-text-color-hover":s,"--n-item-text-color-pressed":b,"--n-item-text-color-active":h,"--n-separator-color":m,"--n-item-color-hover":B,"--n-item-color-pressed":z,"--n-item-border-radius":R,"--n-font-weight-active":k,"--n-item-line-height":L}}),r=o?N("breadcrumb",void 0,c,e):void 0;return{mergedClsPrefix:t,cssVars:o?void 0:c,themeClass:r==null?void 0:r.themeClass,onRender:r==null?void 0:r.onRender}},render(){var e;return(e=this.onRender)===null||e===void 0||e.call(this),v("nav",{class:[`${this.mergedClsPrefix}-breadcrumb`,this.themeClass],style:this.cssVars,"aria-label":"Breadcrumb"},v("ul",null,this.$slots))}});function K(e=y?window:null){const t=()=>{const{hash:c,host:r,hostname:d,href:m,origin:n,pathname:s,port:b,protocol:h,search:f}=(e==null?void 0:e.location)||{};return{hash:c,host:r,hostname:d,href:m,origin:n,pathname:s,port:b,protocol:h,search:f}},o=_(t()),a=()=>{o.value=t()};return j(()=>{e&&(e.addEventListener("popstate",a),e.addEventListener("hashchange",a))}),w(()=>{e&&(e.removeEventListener("popstate",a),e.removeEventListener("hashchange",a))}),o}const M={separator:String,href:String,clickable:{type:Boolean,default:!0},onClick:Function},Y=g({name:"BreadcrumbItem",props:M,setup(e,{slots:t}){const o=H(C,null);if(!o)return()=>null;const{separatorRef:a,mergedClsPrefixRef:c}=o,r=K(),d=p(()=>e.href?"a":"span"),m=p(()=>r.value.href===e.href?"location":null);return()=>{const{value:n}=c;return v("li",{class:[`${n}-breadcrumb-item`,e.clickable&&`${n}-breadcrumb-item--clickable`]},v(d.value,{class:`${n}-breadcrumb-item__link`,"aria-current":m.value,href:e.href,onClick:e.onClick},t),v("span",{class:`${n}-breadcrumb-item__separator`,"aria-hidden":"true"},V(t.separator,()=>{var s;return[(s=e.separator)!==null&&s!==void 0?s:a.value]})))}}});export{X as N,Y as a};
