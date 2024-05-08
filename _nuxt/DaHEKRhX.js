import{ai as A,r as E,aD as V,a7 as z,c2 as q,bO as me,z as ge,aV as ve,b3 as P,bT as W,bL as L,j as s,X as K,aP as we,c0 as i,cV as D,c1 as f,c9 as y,cb as k,c3 as G,dT as pe,bt as _,cP as ye}from"./bOr_GTnX.js";import{l as U,a as Se,d as ze,p as $e,b as Ce,F as xe,j as X,z as Be,L as ke}from"./bCtqIfGU.js";import{b as Ee,u as Re,c as x}from"./CCKL6qZc.js";import{S as J,f as Te,i as Oe,u as Y}from"./ukkFwBbq.js";import{u as Fe,a as He}from"./BimhSwkD.js";import{e as Me}from"./DsSU6HIH.js";import{N as Pe}from"./j6ysTES8.js";const De=A({name:"NDrawerContent",inheritAttrs:!1,props:{blockScroll:Boolean,show:{type:Boolean,default:void 0},displayDirective:{type:String,required:!0},placement:{type:String,required:!0},contentClass:String,contentStyle:[Object,String],nativeScrollbar:{type:Boolean,required:!0},scrollbarProps:Object,trapFocus:{type:Boolean,default:!0},autoFocus:{type:Boolean,default:!0},showMask:{type:[Boolean,String],required:!0},maxWidth:Number,maxHeight:Number,minWidth:Number,minHeight:Number,resizable:Boolean,onClickoutside:Function,onAfterLeave:Function,onAfterEnter:Function,onEsc:Function},setup(e){const t=E(!!e.show),r=E(null),v=V(U);let b=0,S="",c=null;const w=E(!1),p=E(!1),$=z(()=>e.placement==="top"||e.placement==="bottom"),{mergedClsPrefixRef:R,mergedRtlRef:T}=q(e),O=Ee("Drawer",T,R),B=n=>{p.value=!0,b=$.value?n.clientY:n.clientX,S=document.body.style.cursor,document.body.style.cursor=$.value?"ns-resize":"ew-resize",document.body.addEventListener("mousemove",H),document.body.addEventListener("mouseleave",o),document.body.addEventListener("mouseup",h)},m=()=>{c!==null&&(window.clearTimeout(c),c=null),p.value?w.value=!0:c=window.setTimeout(()=>{w.value=!0},300)},M=()=>{c!==null&&(window.clearTimeout(c),c=null),w.value=!1},{doUpdateHeight:I,doUpdateWidth:j}=v,N=n=>{const{maxWidth:l}=e;if(l&&n>l)return l;const{minWidth:u}=e;return u&&n<u?u:n},F=n=>{const{maxHeight:l}=e;if(l&&n>l)return l;const{minHeight:u}=e;return u&&n<u?u:n},H=n=>{var l,u;if(p.value)if($.value){let g=((l=r.value)===null||l===void 0?void 0:l.offsetHeight)||0;const C=b-n.clientY;g+=e.placement==="bottom"?C:-C,g=F(g),I(g),b=n.clientY}else{let g=((u=r.value)===null||u===void 0?void 0:u.offsetWidth)||0;const C=b-n.clientX;g+=e.placement==="right"?C:-C,g=N(g),j(g),b=n.clientX}},h=()=>{p.value&&(b=0,p.value=!1,document.body.style.cursor=S,document.body.removeEventListener("mousemove",H),document.body.removeEventListener("mouseup",h),document.body.removeEventListener("mouseleave",o))},o=h;me(()=>{e.show&&(t.value=!0)}),ge(()=>e.show,n=>{n||h()}),ve(()=>{h()});const a=z(()=>{const{show:n}=e,l=[[L,n]];return e.showMask||l.push([Se,e.onClickoutside,void 0,{capture:!0}]),l});function d(){var n;t.value=!1,(n=e.onAfterLeave)===null||n===void 0||n.call(e)}return Fe(z(()=>e.blockScroll&&t.value)),P(ze,r),P($e,null),P(Ce,null),{bodyRef:r,rtlEnabled:O,mergedClsPrefix:v.mergedClsPrefixRef,isMounted:v.isMountedRef,mergedTheme:v.mergedThemeRef,displayed:t,transitionName:z(()=>({right:"slide-in-from-right-transition",left:"slide-in-from-left-transition",top:"slide-in-from-top-transition",bottom:"slide-in-from-bottom-transition"})[e.placement]),handleAfterLeave:d,bodyDirectives:a,handleMousedownResizeTrigger:B,handleMouseenterResizeTrigger:m,handleMouseleaveResizeTrigger:M,isDragging:p,isHoverOnResizeTrigger:w}},render(){const{$slots:e,mergedClsPrefix:t}=this;return this.displayDirective==="show"||this.displayed||this.show?W(s("div",{role:"none"},s(xe,{disabled:!this.showMask||!this.trapFocus,active:this.show,autoFocus:this.autoFocus,onEsc:this.onEsc},{default:()=>s(K,{name:this.transitionName,appear:this.isMounted,onAfterEnter:this.onAfterEnter,onAfterLeave:this.handleAfterLeave},{default:()=>W(s("div",we(this.$attrs,{role:"dialog",ref:"bodyRef","aria-modal":"true",class:[`${t}-drawer`,this.rtlEnabled&&`${t}-drawer--rtl`,`${t}-drawer--${this.placement}-placement`,this.isDragging&&`${t}-drawer--unselectable`,this.nativeScrollbar&&`${t}-drawer--native-scrollbar`]}),[this.resizable?s("div",{class:[`${t}-drawer__resize-trigger`,(this.isDragging||this.isHoverOnResizeTrigger)&&`${t}-drawer__resize-trigger--hover`],onMouseenter:this.handleMouseenterResizeTrigger,onMouseleave:this.handleMouseleaveResizeTrigger,onMousedown:this.handleMousedownResizeTrigger}):null,this.nativeScrollbar?s("div",{class:[`${t}-drawer-content-wrapper`,this.contentClass],style:this.contentStyle,role:"none"},e):s(J,Object.assign({},this.scrollbarProps,{contentStyle:this.contentStyle,contentClass:[`${t}-drawer-content-wrapper`,this.contentClass],theme:this.mergedTheme.peers.Scrollbar,themeOverrides:this.mergedTheme.peerOverrides.Scrollbar}),e)]),this.bodyDirectives)})})),[[L,this.displayDirective==="if"||this.displayed||this.show]]):null}}),{cubicBezierEaseIn:Ie,cubicBezierEaseOut:je}=D;function Ne({duration:e="0.3s",leaveDuration:t="0.2s",name:r="slide-in-from-right"}={}){return[i(`&.${r}-transition-leave-active`,{transition:`transform ${t} ${Ie}`}),i(`&.${r}-transition-enter-active`,{transition:`transform ${e} ${je}`}),i(`&.${r}-transition-enter-to`,{transform:"translateX(0)"}),i(`&.${r}-transition-enter-from`,{transform:"translateX(100%)"}),i(`&.${r}-transition-leave-from`,{transform:"translateX(0)"}),i(`&.${r}-transition-leave-to`,{transform:"translateX(100%)"})]}const{cubicBezierEaseIn:We,cubicBezierEaseOut:Ae}=D;function Ue({duration:e="0.3s",leaveDuration:t="0.2s",name:r="slide-in-from-left"}={}){return[i(`&.${r}-transition-leave-active`,{transition:`transform ${t} ${We}`}),i(`&.${r}-transition-enter-active`,{transition:`transform ${e} ${Ae}`}),i(`&.${r}-transition-enter-to`,{transform:"translateX(0)"}),i(`&.${r}-transition-enter-from`,{transform:"translateX(-100%)"}),i(`&.${r}-transition-leave-from`,{transform:"translateX(0)"}),i(`&.${r}-transition-leave-to`,{transform:"translateX(-100%)"})]}const{cubicBezierEaseIn:Le,cubicBezierEaseOut:_e}=D;function Xe({duration:e="0.3s",leaveDuration:t="0.2s",name:r="slide-in-from-top"}={}){return[i(`&.${r}-transition-leave-active`,{transition:`transform ${t} ${Le}`}),i(`&.${r}-transition-enter-active`,{transition:`transform ${e} ${_e}`}),i(`&.${r}-transition-enter-to`,{transform:"translateY(0)"}),i(`&.${r}-transition-enter-from`,{transform:"translateY(-100%)"}),i(`&.${r}-transition-leave-from`,{transform:"translateY(0)"}),i(`&.${r}-transition-leave-to`,{transform:"translateY(-100%)"})]}const{cubicBezierEaseIn:Ye,cubicBezierEaseOut:Ve}=D;function qe({duration:e="0.3s",leaveDuration:t="0.2s",name:r="slide-in-from-bottom"}={}){return[i(`&.${r}-transition-leave-active`,{transition:`transform ${t} ${Ye}`}),i(`&.${r}-transition-enter-active`,{transition:`transform ${e} ${Ve}`}),i(`&.${r}-transition-enter-to`,{transform:"translateY(0)"}),i(`&.${r}-transition-enter-from`,{transform:"translateY(100%)"}),i(`&.${r}-transition-leave-from`,{transform:"translateY(0)"}),i(`&.${r}-transition-leave-to`,{transform:"translateY(100%)"})]}const Ke=i([f("drawer",`
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
 `,[Ne(),Ue(),Xe(),qe(),y("unselectable",`
 user-select: none; 
 -webkit-user-select: none;
 `),y("native-scrollbar",[f("drawer-content-wrapper",`
 overflow: auto;
 height: 100%;
 `)]),k("resize-trigger",`
 position: absolute;
 background-color: #0000;
 transition: background-color .3s var(--n-bezier);
 `,[y("hover",`
 background-color: var(--n-resize-trigger-color-hover);
 `)]),f("drawer-content-wrapper",`
 box-sizing: border-box;
 `),f("drawer-content",`
 height: 100%;
 display: flex;
 flex-direction: column;
 `,[y("native-scrollbar",[f("drawer-body-content-wrapper",`
 height: 100%;
 overflow: auto;
 `)]),f("drawer-body",`
 flex: 1 0 0;
 overflow: hidden;
 `),f("drawer-body-content-wrapper",`
 box-sizing: border-box;
 padding: var(--n-body-padding);
 `),f("drawer-header",`
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
 `)]),f("drawer-footer",`
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
 `)])]),i("body",[i(">",[f("drawer-container",`
 position: fixed;
 `)])]),f("drawer-container",`
 position: relative;
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 pointer-events: none;
 `,[i("> *",`
 pointer-events: all;
 `)]),f("drawer-mask",`
 background-color: rgba(0, 0, 0, .3);
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 `,[y("invisible",`
 background-color: rgba(0, 0, 0, 0)
 `),Te({enterDuration:"0.2s",leaveDuration:"0.2s",enterCubicBezier:"var(--n-bezier-in)",leaveCubicBezier:"var(--n-bezier-out)"})])]),Ge=Object.assign(Object.assign({},G.props),{show:Boolean,width:[Number,String],height:[Number,String],placement:{type:String,default:"right"},maskClosable:{type:Boolean,default:!0},showMask:{type:[Boolean,String],default:!0},to:[String,Object],displayDirective:{type:String,default:"if"},nativeScrollbar:{type:Boolean,default:!0},zIndex:Number,onMaskClick:Function,scrollbarProps:Object,contentClass:String,contentStyle:[Object,String],trapFocus:{type:Boolean,default:!0},onEsc:Function,autoFocus:{type:Boolean,default:!0},closeOnEsc:{type:Boolean,default:!0},blockScroll:{type:Boolean,default:!0},maxWidth:Number,maxHeight:Number,minWidth:Number,minHeight:Number,resizable:Boolean,defaultWidth:{type:[Number,String],default:251},defaultHeight:{type:[Number,String],default:251},onUpdateWidth:[Function,Array],onUpdateHeight:[Function,Array],"onUpdate:width":[Function,Array],"onUpdate:height":[Function,Array],"onUpdate:show":[Function,Array],onUpdateShow:[Function,Array],onAfterEnter:Function,onAfterLeave:Function,drawerStyle:[String,Object],drawerClass:String,target:null,onShow:Function,onHide:Function}),it=A({name:"Drawer",inheritAttrs:!1,props:Ge,setup(e){const{mergedClsPrefixRef:t,namespaceRef:r,inlineThemeDisabled:v}=q(e),b=Oe(),S=G("Drawer","-drawer",Ke,pe,e,t),c=E(e.defaultWidth),w=E(e.defaultHeight),p=Y(_(e,"width"),c),$=Y(_(e,"height"),w),R=z(()=>{const{placement:o}=e;return o==="top"||o==="bottom"?"":X(p.value)}),T=z(()=>{const{placement:o}=e;return o==="left"||o==="right"?"":X($.value)}),O=o=>{const{onUpdateWidth:a,"onUpdate:width":d}=e;a&&x(a,o),d&&x(d,o),c.value=o},B=o=>{const{onUpdateHeight:a,"onUpdate:width":d}=e;a&&x(a,o),d&&x(d,o),w.value=o},m=z(()=>[{width:R.value,height:T.value},e.drawerStyle||""]);function M(o){const{onMaskClick:a,maskClosable:d}=e;d&&F(!1),a&&a(o)}function I(o){M(o)}const j=He();function N(o){var a;(a=e.onEsc)===null||a===void 0||a.call(e),e.show&&e.closeOnEsc&&Me(o)&&!j.value&&F(!1)}function F(o){const{onHide:a,onUpdateShow:d,"onUpdate:show":n}=e;d&&x(d,o),n&&x(n,o),a&&!o&&x(a,o)}P(U,{isMountedRef:b,mergedThemeRef:S,mergedClsPrefixRef:t,doUpdateShow:F,doUpdateHeight:B,doUpdateWidth:O});const H=z(()=>{const{common:{cubicBezierEaseInOut:o,cubicBezierEaseIn:a,cubicBezierEaseOut:d},self:{color:n,textColor:l,boxShadow:u,lineHeight:g,headerPadding:C,footerPadding:Q,borderRadius:Z,bodyPadding:ee,titleFontSize:te,titleTextColor:re,titleFontWeight:oe,headerBorderBottom:ne,footerBorderTop:ie,closeIconColor:se,closeIconColorHover:ae,closeIconColorPressed:le,closeColorHover:de,closeColorPressed:ce,closeIconSize:ue,closeSize:he,closeBorderRadius:fe,resizableTriggerColorHover:be}}=S.value;return{"--n-line-height":g,"--n-color":n,"--n-border-radius":Z,"--n-text-color":l,"--n-box-shadow":u,"--n-bezier":o,"--n-bezier-out":d,"--n-bezier-in":a,"--n-header-padding":C,"--n-body-padding":ee,"--n-footer-padding":Q,"--n-title-text-color":re,"--n-title-font-size":te,"--n-title-font-weight":oe,"--n-header-border-bottom":ne,"--n-footer-border-top":ie,"--n-close-icon-color":se,"--n-close-icon-color-hover":ae,"--n-close-icon-color-pressed":le,"--n-close-size":he,"--n-close-color-hover":de,"--n-close-color-pressed":ce,"--n-close-icon-size":ue,"--n-close-border-radius":fe,"--n-resize-trigger-color-hover":be}}),h=v?Re("drawer",void 0,H,e):void 0;return{mergedClsPrefix:t,namespace:r,mergedBodyStyle:m,handleOutsideClick:I,handleMaskClick:M,handleEsc:N,mergedTheme:S,cssVars:v?void 0:H,themeClass:h==null?void 0:h.themeClass,onRender:h==null?void 0:h.onRender,isMounted:b}},render(){const{mergedClsPrefix:e}=this;return s(ke,{to:this.to,show:this.show},{default:()=>{var t;return(t=this.onRender)===null||t===void 0||t.call(this),W(s("div",{class:[`${e}-drawer-container`,this.namespace,this.themeClass],style:this.cssVars,role:"none"},this.showMask?s(K,{name:"fade-in-transition",appear:this.isMounted},{default:()=>this.show?s("div",{"aria-hidden":!0,class:[`${e}-drawer-mask`,this.showMask==="transparent"&&`${e}-drawer-mask--invisible`],onClick:this.handleMaskClick}):null}):null,s(De,Object.assign({},this.$attrs,{class:[this.drawerClass,this.$attrs.class],style:[this.mergedBodyStyle,this.$attrs.style],blockScroll:this.blockScroll,contentStyle:this.contentStyle,contentClass:this.contentClass,placement:this.placement,scrollbarProps:this.scrollbarProps,show:this.show,displayDirective:this.displayDirective,nativeScrollbar:this.nativeScrollbar,onAfterEnter:this.onAfterEnter,onAfterLeave:this.onAfterLeave,trapFocus:this.trapFocus,autoFocus:this.autoFocus,resizable:this.resizable,maxHeight:this.maxHeight,minHeight:this.minHeight,maxWidth:this.maxWidth,minWidth:this.minWidth,showMask:this.showMask,onEsc:this.handleEsc,onClickoutside:this.handleOutsideClick}),this.$slots)),[[Be,{zIndex:this.zIndex,enabled:this.show}]])}})}}),Je={title:String,headerClass:String,headerStyle:[Object,String],footerClass:String,footerStyle:[Object,String],bodyClass:String,bodyStyle:[Object,String],bodyContentClass:String,bodyContentStyle:[Object,String],nativeScrollbar:{type:Boolean,default:!0},scrollbarProps:Object,closable:Boolean},st=A({name:"DrawerContent",props:Je,setup(){const e=V(U,null);e||ye("drawer-content","`n-drawer-content` must be placed inside `n-drawer`.");const{doUpdateShow:t}=e;function r(){t(!1)}return{handleCloseClick:r,mergedTheme:e.mergedThemeRef,mergedClsPrefix:e.mergedClsPrefixRef}},render(){const{title:e,mergedClsPrefix:t,nativeScrollbar:r,mergedTheme:v,bodyClass:b,bodyStyle:S,bodyContentClass:c,bodyContentStyle:w,headerClass:p,headerStyle:$,footerClass:R,footerStyle:T,scrollbarProps:O,closable:B,$slots:m}=this;return s("div",{role:"none",class:[`${t}-drawer-content`,r&&`${t}-drawer-content--native-scrollbar`]},m.header||e||B?s("div",{class:[`${t}-drawer-header`,p],style:$,role:"none"},s("div",{class:`${t}-drawer-header__main`,role:"heading","aria-level":"1"},m.header!==void 0?m.header():e),B&&s(Pe,{onClick:this.handleCloseClick,clsPrefix:t,class:`${t}-drawer-header__close`,absolute:!0})):null,r?s("div",{class:[`${t}-drawer-body`,b],style:S,role:"none"},s("div",{class:[`${t}-drawer-body-content-wrapper`,c],style:w,role:"none"},m)):s(J,Object.assign({themeOverrides:v.peerOverrides.Scrollbar,theme:v.peers.Scrollbar},O,{class:`${t}-drawer-body`,contentClass:[`${t}-drawer-body-content-wrapper`,c],contentStyle:w}),m),m.footer?s("div",{class:[`${t}-drawer-footer`,R],style:T,role:"none"},m.footer()):null)}});export{st as N,it as a};
