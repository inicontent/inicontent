import{ax as L,u as R,a as C,ad as x,b as m,d as j,i as O,af as y,A as g,a9 as z,q as E,l as S,ag as P,t as f}from"./CFZop9RU.js";import{b as $}from"./CMSvwZa9.js";import{q as w,S as N}from"./CXaRlF3j.js";function F(u){const{baseColor:e,textColor2:o,bodyColor:a,cardColor:i,dividerColor:l,actionColor:d,scrollbarColor:b,scrollbarColorHover:h,invertedColor:s}=u;return{textColor:o,textColorInverted:"#FFF",color:a,colorEmbedded:d,headerColor:i,headerColorInverted:s,footerColor:d,footerColorInverted:s,headerBorderColor:l,headerBorderColorInverted:s,footerBorderColor:l,footerBorderColorInverted:s,siderBorderColor:l,siderBorderColorInverted:s,siderColor:i,siderColorInverted:s,siderToggleButtonBorder:`1px solid ${l}`,siderToggleButtonColor:e,siderToggleButtonIconColor:o,siderToggleButtonIconColorInverted:o,siderToggleBarColor:C(a,b),siderToggleBarColorHover:C(a,h),__invertScrollbar:"true"}}const _=L({name:"Layout",common:R,peers:{Scrollbar:$},self:F}),A=x("n-layout-sider"),H={type:String,default:"static"},K=m("layout",`
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
 `),j("absolute-positioned",`
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 `)]),V={embedded:Boolean,position:H,nativeScrollbar:{type:Boolean,default:!0},scrollbarProps:Object,onScroll:Function,contentClass:String,contentStyle:{type:[String,Object],default:""},hasSider:Boolean,siderPlacement:{type:String,default:"left"}},k=x("n-layout");function p(u){return O({name:u?"LayoutContent":"Layout",props:Object.assign(Object.assign({},y.props),V),setup(e){const o=g(null),a=g(null),{mergedClsPrefixRef:i,inlineThemeDisabled:l}=z(e),d=y("Layout","-layout",K,_,e,i);function b(r,t){if(e.nativeScrollbar){const{value:n}=o;n&&(t===void 0?n.scrollTo(r):n.scrollTo(r,t))}else{const{value:n}=a;n&&n.scrollTo(r,t)}}E(k,e);let h=0,s=0;const T=r=>{var t;const n=r.target;h=n.scrollLeft,s=n.scrollTop,(t=e.onScroll)===null||t===void 0||t.call(e,r)};w(()=>{if(e.nativeScrollbar){const r=o.value;r&&(r.scrollTop=s,r.scrollLeft=h)}});const B={display:"flex",flexWrap:"nowrap",width:"100%",flexDirection:"row"},I={scrollTo:b},v=S(()=>{const{common:{cubicBezierEaseInOut:r},self:t}=d.value;return{"--n-bezier":r,"--n-color":e.embedded?t.colorEmbedded:t.color,"--n-text-color":t.textColor}}),c=l?P("layout",S(()=>e.embedded?"e":""),v,e):void 0;return Object.assign({mergedClsPrefix:i,scrollableElRef:o,scrollbarInstRef:a,hasSiderStyle:B,mergedTheme:d,handleNativeElScroll:T,cssVars:l?void 0:v,themeClass:c==null?void 0:c.themeClass,onRender:c==null?void 0:c.onRender},I)},render(){var e;const{mergedClsPrefix:o,hasSider:a}=this;(e=this.onRender)===null||e===void 0||e.call(this);const i=a?this.hasSiderStyle:void 0,l=[this.themeClass,u&&`${o}-layout-content`,`${o}-layout`,`${o}-layout--${this.position}-positioned`];return f("div",{class:l,style:this.cssVars},this.nativeScrollbar?f("div",{ref:"scrollableElRef",class:[`${o}-layout-scroll-container`,this.contentClass],style:[this.contentStyle,i],onScroll:this.handleNativeElScroll},this.$slots):f(N,Object.assign({},this.scrollbarProps,{onScroll:this.onScroll,ref:"scrollbarInstRef",theme:this.mergedTheme.peers.Scrollbar,themeOverrides:this.mergedTheme.peerOverrides.Scrollbar,contentClass:this.contentClass,contentStyle:[this.contentStyle,i]}),this.$slots))}})}const W=p(!1),X=p(!0);export{X as N,W as a,k as b,A as c,_ as l,H as p};
