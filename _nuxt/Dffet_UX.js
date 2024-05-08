import{c1 as m,c3 as s,ai as p,c2 as f,dE as b,a7 as v,j as g}from"./bOr_GTnX.js";import{u as h}from"./CCKL6qZc.js";import{j as c}from"./bCtqIfGU.js";const C=m("icon-wrapper",`
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 background-color: var(--n-color);
 display: inline-flex;
 align-items: center;
 justify-content: center;
 color: var(--n-icon-color);
`),z=Object.assign(Object.assign({},s.props),{size:{type:Number,default:24},borderRadius:{type:Number,default:6},color:String,iconColor:String}),w=p({name:"IconWrapper",props:z,setup(e,{slots:a}){const{mergedClsPrefixRef:i,inlineThemeDisabled:t}=f(e),l=s("IconWrapper","-icon-wrapper",C,b,e,i),r=v(()=>{const{common:{cubicBezierEaseInOut:n},self:{color:d,iconColor:u}}=l.value;return{"--n-bezier":n,"--n-color":d,"--n-icon-color":u}}),o=t?h("icon-wrapper",void 0,r,e):void 0;return()=>{const n=c(e.size);return o==null||o.onRender(),g("div",{class:[`${i.value}-icon-wrapper`,o==null?void 0:o.themeClass.value],style:[r==null?void 0:r.value,{height:n,width:n,borderRadius:c(e.borderRadius),backgroundColor:e.color,color:e.iconColor}]},a)}}});export{w as N};
