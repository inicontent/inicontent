import{bX as m,bZ as a,f as p,bY as b,dO as f,D as v,B as g}from"./b4y72k5A.js";import{u as h}from"./C1zJybjf.js";import{j as s}from"./CdkfcTkH.js";const C=m("icon-wrapper",`
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 background-color: var(--n-color);
 display: inline-flex;
 align-items: center;
 justify-content: center;
 color: var(--n-icon-color);
`),z=Object.assign(Object.assign({},a.props),{size:{type:Number,default:24},borderRadius:{type:Number,default:6},color:String,iconColor:String}),W=p({name:"IconWrapper",props:z,setup(e,{slots:c}){const{mergedClsPrefixRef:i,inlineThemeDisabled:t}=b(e),l=a("IconWrapper","-icon-wrapper",C,f,e,i),r=v(()=>{const{common:{cubicBezierEaseInOut:n},self:{color:d,iconColor:u}}=l.value;return{"--n-bezier":n,"--n-color":d,"--n-icon-color":u}}),o=t?h("icon-wrapper",void 0,r,e):void 0;return()=>{const n=s(e.size);return o==null||o.onRender(),g("div",{class:[`${i.value}-icon-wrapper`,o==null?void 0:o.themeClass.value],style:[r==null?void 0:r.value,{height:n,width:n,borderRadius:s(e.borderRadius),backgroundColor:e.color,color:e.iconColor}]},c)}}});export{W as N};
