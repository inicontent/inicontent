import{b as m,af as s,i as p,a9 as f,l as b,ag as v,t as g}from"./GicmGKj6.js";import{i as h}from"./Di5MGdNS.js";import{f as a}from"./CJaYANHJ.js";const C=m("icon-wrapper",`
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 background-color: var(--n-color);
 display: inline-flex;
 align-items: center;
 justify-content: center;
 color: var(--n-icon-color);
`),z=Object.assign(Object.assign({},s.props),{size:{type:Number,default:24},borderRadius:{type:Number,default:6},color:String,iconColor:String}),W=p({name:"IconWrapper",props:z,setup(e,{slots:c}){const{mergedClsPrefixRef:i,inlineThemeDisabled:t}=f(e),l=s("IconWrapper","-icon-wrapper",C,h,e,i),r=b(()=>{const{common:{cubicBezierEaseInOut:n},self:{color:d,iconColor:u}}=l.value;return{"--n-bezier":n,"--n-color":d,"--n-icon-color":u}}),o=t?v("icon-wrapper",void 0,r,e):void 0;return()=>{const n=a(e.size);return o==null||o.onRender(),g("div",{class:[`${i.value}-icon-wrapper`,o==null?void 0:o.themeClass.value],style:[r==null?void 0:r.value,{height:n,width:n,borderRadius:a(e.borderRadius),backgroundColor:e.color,color:e.iconColor}]},c)}}});export{W as N};
