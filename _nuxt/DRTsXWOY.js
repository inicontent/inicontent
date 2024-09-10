import{i as A,A as E,j as q,l as $,a9 as V,aN as be,a2 as ge,ab as ve,q as D,at as W,au as L,t as s,av as K,as as we,e as i,c as P,b as h,d as y,f as k,af as G,ac as _,ag as pe,aD as ye}from"./CFZop9RU.js";import{r as U,e as Se,d as $e,p as ze,b as Ce,F as xe,S as J,f as Be,j as X,z as ke,L as Ee}from"./CXaRlF3j.js";import{u as Re}from"./vxBaO5E-.js";import{u as Te,a as Oe}from"./C-x6Iu6X.js";import{i as Fe}from"./C3M1WvbL.js";import{d as He}from"./DMligQNt.js";import{u as Y}from"./D2GkMi_I.js";import{c as B}from"./Cjrk4TDS.js";import{e as Me}from"./DsSU6HIH.js";import{N as De}from"./C3mGUiDb.js";const Pe=A({name:"NDrawerContent",inheritAttrs:!1,props:{blockScroll:Boolean,show:{type:Boolean,default:void 0},displayDirective:{type:String,required:!0},placement:{type:String,required:!0},contentClass:String,contentStyle:[Object,String],nativeScrollbar:{type:Boolean,required:!0},scrollbarProps:Object,trapFocus:{type:Boolean,default:!0},autoFocus:{type:Boolean,default:!0},showMask:{type:[Boolean,String],required:!0},maxWidth:Number,maxHeight:Number,minWidth:Number,minHeight:Number,resizable:Boolean,onClickoutside:Function,onAfterLeave:Function,onAfterEnter:Function,onEsc:Function},setup(e){const t=E(!!e.show),r=E(null),g=q(U);let f=0,S="",c=null;const v=E(!1),w=E(!1),z=$(()=>e.placement==="top"||e.placement==="bottom"),{mergedClsPrefixRef:R,mergedRtlRef:T}=V(e),O=Re("Drawer",T,R),C=o,m=n=>{w.value=!0,f=z.value?n.clientY:n.clientX,S=document.body.style.cursor,document.body.style.cursor=z.value?"ns-resize":"ew-resize",document.body.addEventListener("mousemove",p),document.body.addEventListener("mouseleave",C),document.body.addEventListener("mouseup",o)},H=()=>{c!==null&&(window.clearTimeout(c),c=null),w.value?v.value=!0:c=window.setTimeout(()=>{v.value=!0},300)},I=()=>{c!==null&&(window.clearTimeout(c),c=null),v.value=!1},{doUpdateHeight:N,doUpdateWidth:j}=g,F=n=>{const{maxWidth:l}=e;if(l&&n>l)return l;const{minWidth:u}=e;return u&&n<u?u:n},M=n=>{const{maxHeight:l}=e;if(l&&n>l)return l;const{minHeight:u}=e;return u&&n<u?u:n};function p(n){var l,u;if(w.value)if(z.value){let b=((l=r.value)===null||l===void 0?void 0:l.offsetHeight)||0;const x=f-n.clientY;b+=e.placement==="bottom"?x:-x,b=M(b),N(b),f=n.clientY}else{let b=((u=r.value)===null||u===void 0?void 0:u.offsetWidth)||0;const x=f-n.clientX;b+=e.placement==="right"?x:-x,b=F(b),j(b),f=n.clientX}}function o(){w.value&&(f=0,w.value=!1,document.body.style.cursor=S,document.body.removeEventListener("mousemove",p),document.body.removeEventListener("mouseup",o),document.body.removeEventListener("mouseleave",C))}be(()=>{e.show&&(t.value=!0)}),ge(()=>e.show,n=>{n||o()}),ve(()=>{o()});const a=$(()=>{const{show:n}=e,l=[[L,n]];return e.showMask||l.push([Se,e.onClickoutside,void 0,{capture:!0}]),l});function d(){var n;t.value=!1,(n=e.onAfterLeave)===null||n===void 0||n.call(e)}return Te($(()=>e.blockScroll&&t.value)),D($e,r),D(ze,null),D(Ce,null),{bodyRef:r,rtlEnabled:O,mergedClsPrefix:g.mergedClsPrefixRef,isMounted:g.isMountedRef,mergedTheme:g.mergedThemeRef,displayed:t,transitionName:$(()=>({right:"slide-in-from-right-transition",left:"slide-in-from-left-transition",top:"slide-in-from-top-transition",bottom:"slide-in-from-bottom-transition"})[e.placement]),handleAfterLeave:d,bodyDirectives:a,handleMousedownResizeTrigger:m,handleMouseenterResizeTrigger:H,handleMouseleaveResizeTrigger:I,isDragging:w,isHoverOnResizeTrigger:v}},render(){const{$slots:e,mergedClsPrefix:t}=this;return this.displayDirective==="show"||this.displayed||this.show?W(s("div",{role:"none"},s(xe,{disabled:!this.showMask||!this.trapFocus,active:this.show,autoFocus:this.autoFocus,onEsc:this.onEsc},{default:()=>s(K,{name:this.transitionName,appear:this.isMounted,onAfterEnter:this.onAfterEnter,onAfterLeave:this.handleAfterLeave},{default:()=>W(s("div",we(this.$attrs,{role:"dialog",ref:"bodyRef","aria-modal":"true",class:[`${t}-drawer`,this.rtlEnabled&&`${t}-drawer--rtl`,`${t}-drawer--${this.placement}-placement`,this.isDragging&&`${t}-drawer--unselectable`,this.nativeScrollbar&&`${t}-drawer--native-scrollbar`]}),[this.resizable?s("div",{class:[`${t}-drawer__resize-trigger`,(this.isDragging||this.isHoverOnResizeTrigger)&&`${t}-drawer__resize-trigger--hover`],onMouseenter:this.handleMouseenterResizeTrigger,onMouseleave:this.handleMouseleaveResizeTrigger,onMousedown:this.handleMousedownResizeTrigger}):null,this.nativeScrollbar?s("div",{class:[`${t}-drawer-content-wrapper`,this.contentClass],style:this.contentStyle,role:"none"},e):s(J,Object.assign({},this.scrollbarProps,{contentStyle:this.contentStyle,contentClass:[`${t}-drawer-content-wrapper`,this.contentClass],theme:this.mergedTheme.peers.Scrollbar,themeOverrides:this.mergedTheme.peerOverrides.Scrollbar}),e)]),this.bodyDirectives)})})),[[L,this.displayDirective==="if"||this.displayed||this.show]]):null}}),{cubicBezierEaseIn:Ie,cubicBezierEaseOut:Ne}=P;function je({duration:e="0.3s",leaveDuration:t="0.2s",name:r="slide-in-from-right"}={}){return[i(`&.${r}-transition-leave-active`,{transition:`transform ${t} ${Ie}`}),i(`&.${r}-transition-enter-active`,{transition:`transform ${e} ${Ne}`}),i(`&.${r}-transition-enter-to`,{transform:"translateX(0)"}),i(`&.${r}-transition-enter-from`,{transform:"translateX(100%)"}),i(`&.${r}-transition-leave-from`,{transform:"translateX(0)"}),i(`&.${r}-transition-leave-to`,{transform:"translateX(100%)"})]}const{cubicBezierEaseIn:We,cubicBezierEaseOut:Ae}=P;function Ue({duration:e="0.3s",leaveDuration:t="0.2s",name:r="slide-in-from-left"}={}){return[i(`&.${r}-transition-leave-active`,{transition:`transform ${t} ${We}`}),i(`&.${r}-transition-enter-active`,{transition:`transform ${e} ${Ae}`}),i(`&.${r}-transition-enter-to`,{transform:"translateX(0)"}),i(`&.${r}-transition-enter-from`,{transform:"translateX(-100%)"}),i(`&.${r}-transition-leave-from`,{transform:"translateX(0)"}),i(`&.${r}-transition-leave-to`,{transform:"translateX(-100%)"})]}const{cubicBezierEaseIn:Le,cubicBezierEaseOut:_e}=P;function Xe({duration:e="0.3s",leaveDuration:t="0.2s",name:r="slide-in-from-top"}={}){return[i(`&.${r}-transition-leave-active`,{transition:`transform ${t} ${Le}`}),i(`&.${r}-transition-enter-active`,{transition:`transform ${e} ${_e}`}),i(`&.${r}-transition-enter-to`,{transform:"translateY(0)"}),i(`&.${r}-transition-enter-from`,{transform:"translateY(-100%)"}),i(`&.${r}-transition-leave-from`,{transform:"translateY(0)"}),i(`&.${r}-transition-leave-to`,{transform:"translateY(-100%)"})]}const{cubicBezierEaseIn:Ye,cubicBezierEaseOut:qe}=P;function Ve({duration:e="0.3s",leaveDuration:t="0.2s",name:r="slide-in-from-bottom"}={}){return[i(`&.${r}-transition-leave-active`,{transition:`transform ${t} ${Ye}`}),i(`&.${r}-transition-enter-active`,{transition:`transform ${e} ${qe}`}),i(`&.${r}-transition-enter-to`,{transform:"translateY(0)"}),i(`&.${r}-transition-enter-from`,{transform:"translateY(100%)"}),i(`&.${r}-transition-leave-from`,{transform:"translateY(0)"}),i(`&.${r}-transition-leave-to`,{transform:"translateY(100%)"})]}const Ke=i([h("drawer",`
 word-break: break-word;
 line-height: var(--n-line-height);
 position: absolute;
 pointer-events: all;
 box-shadow: var(--n-box-shadow);
 transition:
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 background-color: var(--n-color);
 color: var(--n-text-color);
 box-sizing: border-box;
 `,[je(),Ue(),Xe(),Ve(),y("unselectable",`
 user-select: none; 
 -webkit-user-select: none;
 `),y("native-scrollbar",[h("drawer-content-wrapper",`
 overflow: auto;
 height: 100%;
 `)]),k("resize-trigger",`
 position: absolute;
 background-color: #0000;
 transition: background-color .3s var(--n-bezier);
 `,[y("hover",`
 background-color: var(--n-resize-trigger-color-hover);
 `)]),h("drawer-content-wrapper",`
 box-sizing: border-box;
 `),h("drawer-content",`
 height: 100%;
 display: flex;
 flex-direction: column;
 `,[y("native-scrollbar",[h("drawer-body-content-wrapper",`
 height: 100%;
 overflow: auto;
 `)]),h("drawer-body",`
 flex: 1 0 0;
 overflow: hidden;
 `),h("drawer-body-content-wrapper",`
 box-sizing: border-box;
 padding: var(--n-body-padding);
 `),h("drawer-header",`
 font-weight: var(--n-title-font-weight);
 line-height: 1;
 font-size: var(--n-title-font-size);
 color: var(--n-title-text-color);
 padding: var(--n-header-padding);
 transition: border .3s var(--n-bezier);
 border-bottom: 1px solid var(--n-divider-color);
 border-bottom: var(--n-header-border-bottom);
 display: flex;
 justify-content: space-between;
 align-items: center;
 `,[k("close",`
 margin-left: 6px;
 transition:
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 `)]),h("drawer-footer",`
 display: flex;
 justify-content: flex-end;
 border-top: var(--n-footer-border-top);
 transition: border .3s var(--n-bezier);
 padding: var(--n-footer-padding);
 `)]),y("right-placement",`
 top: 0;
 bottom: 0;
 right: 0;
 border-top-left-radius: var(--n-border-radius);
 border-bottom-left-radius: var(--n-border-radius);
 `,[k("resize-trigger",`
 width: 3px;
 height: 100%;
 top: 0;
 left: 0;
 transform: translateX(-1.5px);
 cursor: ew-resize;
 `)]),y("left-placement",`
 top: 0;
 bottom: 0;
 left: 0;
 border-top-right-radius: var(--n-border-radius);
 border-bottom-right-radius: var(--n-border-radius);
 `,[k("resize-trigger",`
 width: 3px;
 height: 100%;
 top: 0;
 right: 0;
 transform: translateX(1.5px);
 cursor: ew-resize;
 `)]),y("top-placement",`
 top: 0;
 left: 0;
 right: 0;
 border-bottom-left-radius: var(--n-border-radius);
 border-bottom-right-radius: var(--n-border-radius);
 `,[k("resize-trigger",`
 width: 100%;
 height: 3px;
 bottom: 0;
 left: 0;
 transform: translateY(1.5px);
 cursor: ns-resize;
 `)]),y("bottom-placement",`
 left: 0;
 bottom: 0;
 right: 0;
 border-top-left-radius: var(--n-border-radius);
 border-top-right-radius: var(--n-border-radius);
 `,[k("resize-trigger",`
 width: 100%;
 height: 3px;
 top: 0;
 left: 0;
 transform: translateY(-1.5px);
 cursor: ns-resize;
 `)])]),i("body",[i(">",[h("drawer-container",`
 position: fixed;
 `)])]),h("drawer-container",`
 position: relative;
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 pointer-events: none;
 `,[i("> *",`
 pointer-events: all;
 `)]),h("drawer-mask",`
 background-color: rgba(0, 0, 0, .3);
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 `,[y("invisible",`
 background-color: rgba(0, 0, 0, 0)
 `),Be({enterDuration:"0.2s",leaveDuration:"0.2s",enterCubicBezier:"var(--n-bezier-in)",leaveCubicBezier:"var(--n-bezier-out)"})])]),Ge=Object.assign(Object.assign({},G.props),{show:Boolean,width:[Number,String],height:[Number,String],placement:{type:String,default:"right"},maskClosable:{type:Boolean,default:!0},showMask:{type:[Boolean,String],default:!0},to:[String,Object],displayDirective:{type:String,default:"if"},nativeScrollbar:{type:Boolean,default:!0},zIndex:Number,onMaskClick:Function,scrollbarProps:Object,contentClass:String,contentStyle:[Object,String],trapFocus:{type:Boolean,default:!0},onEsc:Function,autoFocus:{type:Boolean,default:!0},closeOnEsc:{type:Boolean,default:!0},blockScroll:{type:Boolean,default:!0},maxWidth:Number,maxHeight:Number,minWidth:Number,minHeight:Number,resizable:Boolean,defaultWidth:{type:[Number,String],default:251},defaultHeight:{type:[Number,String],default:251},onUpdateWidth:[Function,Array],onUpdateHeight:[Function,Array],"onUpdate:width":[Function,Array],"onUpdate:height":[Function,Array],"onUpdate:show":[Function,Array],onUpdateShow:[Function,Array],onAfterEnter:Function,onAfterLeave:Function,drawerStyle:[String,Object],drawerClass:String,target:null,onShow:Function,onHide:Function}),lt=A({name:"Drawer",inheritAttrs:!1,props:Ge,setup(e){const{mergedClsPrefixRef:t,namespaceRef:r,inlineThemeDisabled:g}=V(e),f=Fe(),S=G("Drawer","-drawer",Ke,He,e,t),c=E(e.defaultWidth),v=E(e.defaultHeight),w=Y(_(e,"width"),c),z=Y(_(e,"height"),v),R=$(()=>{const{placement:o}=e;return o==="top"||o==="bottom"?"":X(w.value)}),T=$(()=>{const{placement:o}=e;return o==="left"||o==="right"?"":X(z.value)}),O=o=>{const{onUpdateWidth:a,"onUpdate:width":d}=e;a&&B(a,o),d&&B(d,o),c.value=o},C=o=>{const{onUpdateHeight:a,"onUpdate:width":d}=e;a&&B(a,o),d&&B(d,o),v.value=o},m=$(()=>[{width:R.value,height:T.value},e.drawerStyle||""]);function H(o){const{onMaskClick:a,maskClosable:d}=e;d&&F(!1),a&&a(o)}function I(o){H(o)}const N=Oe();function j(o){var a;(a=e.onEsc)===null||a===void 0||a.call(e),e.show&&e.closeOnEsc&&Me(o)&&(N.value||F(!1))}function F(o){const{onHide:a,onUpdateShow:d,"onUpdate:show":n}=e;d&&B(d,o),n&&B(n,o),a&&!o&&B(a,o)}D(U,{isMountedRef:f,mergedThemeRef:S,mergedClsPrefixRef:t,doUpdateShow:F,doUpdateHeight:C,doUpdateWidth:O});const M=$(()=>{const{common:{cubicBezierEaseInOut:o,cubicBezierEaseIn:a,cubicBezierEaseOut:d},self:{color:n,textColor:l,boxShadow:u,lineHeight:b,headerPadding:x,footerPadding:Q,borderRadius:Z,bodyPadding:ee,titleFontSize:te,titleTextColor:re,titleFontWeight:oe,headerBorderBottom:ne,footerBorderTop:ie,closeIconColor:se,closeIconColorHover:ae,closeIconColorPressed:le,closeColorHover:de,closeColorPressed:ce,closeIconSize:ue,closeSize:he,closeBorderRadius:fe,resizableTriggerColorHover:me}}=S.value;return{"--n-line-height":b,"--n-color":n,"--n-border-radius":Z,"--n-text-color":l,"--n-box-shadow":u,"--n-bezier":o,"--n-bezier-out":d,"--n-bezier-in":a,"--n-header-padding":x,"--n-body-padding":ee,"--n-footer-padding":Q,"--n-title-text-color":re,"--n-title-font-size":te,"--n-title-font-weight":oe,"--n-header-border-bottom":ne,"--n-footer-border-top":ie,"--n-close-icon-color":se,"--n-close-icon-color-hover":ae,"--n-close-icon-color-pressed":le,"--n-close-size":he,"--n-close-color-hover":de,"--n-close-color-pressed":ce,"--n-close-icon-size":ue,"--n-close-border-radius":fe,"--n-resize-trigger-color-hover":me}}),p=g?pe("drawer",void 0,M,e):void 0;return{mergedClsPrefix:t,namespace:r,mergedBodyStyle:m,handleOutsideClick:I,handleMaskClick:H,handleEsc:j,mergedTheme:S,cssVars:g?void 0:M,themeClass:p==null?void 0:p.themeClass,onRender:p==null?void 0:p.onRender,isMounted:f}},render(){const{mergedClsPrefix:e}=this;return s(Ee,{to:this.to,show:this.show},{default:()=>{var t;return(t=this.onRender)===null||t===void 0||t.call(this),W(s("div",{class:[`${e}-drawer-container`,this.namespace,this.themeClass],style:this.cssVars,role:"none"},this.showMask?s(K,{name:"fade-in-transition",appear:this.isMounted},{default:()=>this.show?s("div",{"aria-hidden":!0,class:[`${e}-drawer-mask`,this.showMask==="transparent"&&`${e}-drawer-mask--invisible`],onClick:this.handleMaskClick}):null}):null,s(Pe,Object.assign({},this.$attrs,{class:[this.drawerClass,this.$attrs.class],style:[this.mergedBodyStyle,this.$attrs.style],blockScroll:this.blockScroll,contentStyle:this.contentStyle,contentClass:this.contentClass,placement:this.placement,scrollbarProps:this.scrollbarProps,show:this.show,displayDirective:this.displayDirective,nativeScrollbar:this.nativeScrollbar,onAfterEnter:this.onAfterEnter,onAfterLeave:this.onAfterLeave,trapFocus:this.trapFocus,autoFocus:this.autoFocus,resizable:this.resizable,maxHeight:this.maxHeight,minHeight:this.minHeight,maxWidth:this.maxWidth,minWidth:this.minWidth,showMask:this.showMask,onEsc:this.handleEsc,onClickoutside:this.handleOutsideClick}),this.$slots)),[[ke,{zIndex:this.zIndex,enabled:this.show}]])}})}}),Je={title:String,headerClass:String,headerStyle:[Object,String],footerClass:String,footerStyle:[Object,String],bodyClass:String,bodyStyle:[Object,String],bodyContentClass:String,bodyContentStyle:[Object,String],nativeScrollbar:{type:Boolean,default:!0},scrollbarProps:Object,closable:Boolean},dt=A({name:"DrawerContent",props:Je,setup(){const e=q(U,null);e||ye("drawer-content","`n-drawer-content` must be placed inside `n-drawer`.");const{doUpdateShow:t}=e;function r(){t(!1)}return{handleCloseClick:r,mergedTheme:e.mergedThemeRef,mergedClsPrefix:e.mergedClsPrefixRef}},render(){const{title:e,mergedClsPrefix:t,nativeScrollbar:r,mergedTheme:g,bodyClass:f,bodyStyle:S,bodyContentClass:c,bodyContentStyle:v,headerClass:w,headerStyle:z,footerClass:R,footerStyle:T,scrollbarProps:O,closable:C,$slots:m}=this;return s("div",{role:"none",class:[`${t}-drawer-content`,r&&`${t}-drawer-content--native-scrollbar`]},m.header||e||C?s("div",{class:[`${t}-drawer-header`,w],style:z,role:"none"},s("div",{class:`${t}-drawer-header__main`,role:"heading","aria-level":"1"},m.header!==void 0?m.header():e),C&&s(De,{onClick:this.handleCloseClick,clsPrefix:t,class:`${t}-drawer-header__close`,absolute:!0})):null,r?s("div",{class:[`${t}-drawer-body`,f],style:S,role:"none"},s("div",{class:[`${t}-drawer-body-content-wrapper`,c],style:v,role:"none"},m)):s(J,Object.assign({themeOverrides:g.peerOverrides.Scrollbar,theme:g.peers.Scrollbar},O,{class:`${t}-drawer-body`,contentClass:[`${t}-drawer-body-content-wrapper`,c],contentStyle:v}),m),m.footer?s("div",{class:[`${t}-drawer-footer`,R],style:T,role:"none"},m.footer()):null)}});export{dt as N,lt as a};
