import{bR as R,bS as L,cT as j,cD as C,c7 as x,bW as m,c3 as O,f as $,bY as y,r as g,bX as z,a$ as E,A as S,s as f}from"./DERJ1-ou.js";import{u as P}from"./BAWSh4kU.js";import{d as w,S as N}from"./SHbevw9V.js";function F(u){const{baseColor:e,textColor2:o,bodyColor:a,cardColor:i,dividerColor:l,actionColor:d,scrollbarColor:h,scrollbarColorHover:b,invertedColor:s}=u;return{textColor:o,textColorInverted:"#FFF",color:a,colorEmbedded:d,headerColor:i,headerColorInverted:s,footerColor:d,footerColorInverted:s,headerBorderColor:l,headerBorderColorInverted:s,footerBorderColor:l,footerBorderColorInverted:s,siderBorderColor:l,siderBorderColorInverted:s,siderColor:i,siderColorInverted:s,siderToggleButtonBorder:`1px solid ${l}`,siderToggleButtonColor:e,siderToggleButtonIconColor:o,siderToggleButtonIconColorInverted:o,siderToggleBarColor:C(a,h),siderToggleBarColorHover:C(a,b),__invertScrollbar:"true"}}const _=R({name:"Layout",common:L,peers:{Scrollbar:j},self:F}),X=x("n-layout-sider"),D={type:String,default:"static"},H=m("layout",`
 color: var(--n-text-color);
 background-color: var(--n-color);
 box-sizing: border-box;
 position: relative;
 z-index: auto;
 flex: auto;
 overflow: hidden;
 transition:
 box-shadow .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
`,[m("layout-scroll-container",`
 overflow-x: hidden;
 box-sizing: border-box;
 height: 100%;
 `),O("absolute-positioned",`
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 `)]),K={embedded:Boolean,position:D,nativeScrollbar:{type:Boolean,default:!0},scrollbarProps:Object,onScroll:Function,contentClass:String,contentStyle:{type:[String,Object],default:""},hasSider:Boolean,siderPlacement:{type:String,default:"left"}},V=x("n-layout");function p(u){return $({name:u?"LayoutContent":"Layout",props:Object.assign(Object.assign({},y.props),K),setup(e){const o=g(null),a=g(null),{mergedClsPrefixRef:i,inlineThemeDisabled:l}=z(e),d=y("Layout","-layout",H,_,e,i);function h(r,t){if(e.nativeScrollbar){const{value:n}=o;n&&(t===void 0?n.scrollTo(r):n.scrollTo(r,t))}else{const{value:n}=a;n&&n.scrollTo(r,t)}}E(V,e);let b=0,s=0;const T=r=>{var t;const n=r.target;b=n.scrollLeft,s=n.scrollTop,(t=e.onScroll)===null||t===void 0||t.call(e,r)};w(()=>{if(e.nativeScrollbar){const r=o.value;r&&(r.scrollTop=s,r.scrollLeft=b)}});const B={display:"flex",flexWrap:"nowrap",width:"100%",flexDirection:"row"},I={scrollTo:h},v=S(()=>{const{common:{cubicBezierEaseInOut:r},self:t}=d.value;return{"--n-bezier":r,"--n-color":e.embedded?t.colorEmbedded:t.color,"--n-text-color":t.textColor}}),c=l?P("layout",S(()=>e.embedded?"e":""),v,e):void 0;return Object.assign({mergedClsPrefix:i,scrollableElRef:o,scrollbarInstRef:a,hasSiderStyle:B,mergedTheme:d,handleNativeElScroll:T,cssVars:l?void 0:v,themeClass:c==null?void 0:c.themeClass,onRender:c==null?void 0:c.onRender},I)},render(){var e;const{mergedClsPrefix:o,hasSider:a}=this;(e=this.onRender)===null||e===void 0||e.call(this);const i=a?this.hasSiderStyle:void 0,l=[this.themeClass,u&&`${o}-layout-content`,`${o}-layout`,`${o}-layout--${this.position}-positioned`];return f("div",{class:l,style:this.cssVars},this.nativeScrollbar?f("div",{ref:"scrollableElRef",class:[`${o}-layout-scroll-container`,this.contentClass],style:[this.contentStyle,i],onScroll:this.handleNativeElScroll},this.$slots):f(N,Object.assign({},this.scrollbarProps,{onScroll:this.onScroll,ref:"scrollbarInstRef",theme:this.mergedTheme.peers.Scrollbar,themeOverrides:this.mergedTheme.peerOverrides.Scrollbar,contentClass:this.contentClass,contentStyle:[this.contentStyle,i]}),this.$slots))}})}const Y=p(!1),A=p(!0);export{Y as N,A as a,V as b,_ as c,X as l,D as p};
