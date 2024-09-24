import{aY as L,A as P,as as re,ad as ce,e as H,b as R,f as y,d as z,aZ as $e,a_ as ze,i as X,ah as D,ab as de,l as $,aT as Me,ai as ue,t as s,aj as je,aU as J,aV as Ne,ak as Ie,aW as Ae,a6 as Q,ae as K,j as U,q as E,w as Ee,a$ as Le,aP as De,b0 as V,b1 as ee,aR as fe,ag as oe}from"./DY8a-ZKd.js";import{a as _e}from"./Bu-pt3WF.js";import{k as he}from"./HiGXOwLp.js";import{c as He,N as Ke,a as Ue}from"./am2YDH60.js";import{u as Ve,g as qe,a as _,r as te,c as N}from"./16KSqgTs.js";import{d as We,m as Ye}from"./B3lKar70.js";import{r as T}from"./mFdQiocv.js";import{B as ne}from"./fCZmJS8P.js";import{N as Xe}from"./BtU0ExOh.js";import{o as q,a as W,m as ve,b as Ze,d as Ge,p as Je,g as Qe,S as eo,F as oo,e as to,k as Y,f as no,h as io,z as so,L as ao,i as lo}from"./ChfFxwq3.js";import{u as ro,a as co}from"./CH9-tfMs.js";import{f as uo}from"./B1WHqRSd.js";import{i as ge,h as me,a as fo}from"./BP3lKFEZ.js";import{e as ho}from"./DsSU6HIH.js";const M=P(null);function ie(e){if(e.clientX>0||e.clientY>0)M.value={x:e.clientX,y:e.clientY};else{const{target:i}=e;if(i instanceof Element){const{left:t,top:l,width:m,height:u}=i.getBoundingClientRect();t>0||l>0?M.value={x:t+m/2,y:l+u/2}:M.value={x:0,y:0}}else M.value=null}}let I=0,se=!0;function vo(){if(!ge)return L(P(null));I===0&&q("click",document,ie,!0);const e=()=>{I+=1};return se&&(se=me())?(re(e),ce(()=>{I-=1,I===0&&W("click",document,ie,!0)})):e(),L(M)}const go=P(void 0);let A=0;function ae(){go.value=Date.now()}let le=!0;function mo(e){if(!ge)return L(P(!1));const i=P(!1);let t=null;function l(){t!==null&&window.clearTimeout(t)}function m(){l(),i.value=!0,t=window.setTimeout(()=>{i.value=!1},e)}A===0&&q("click",window,ae,!0);const u=()=>{A+=1,q("click",window,m,!0)};return le&&(le=me())?(re(u),ce(()=>{A-=1,A===0&&W("click",window,ae,!0),W("click",window,m,!0),l()})):u(),L(i)}const Z={icon:Function,type:{type:String,default:"default"},title:[String,Function],closable:{type:Boolean,default:!0},negativeText:String,positiveText:String,positiveButtonProps:Object,negativeButtonProps:Object,content:[String,Function],action:Function,showIcon:{type:Boolean,default:!0},loading:Boolean,bordered:Boolean,iconPlacement:String,titleClass:[String,Array],titleStyle:[String,Object],contentClass:[String,Array],contentStyle:[String,Object],actionClass:[String,Array],actionStyle:[String,Object],onPositiveClick:Function,onNegativeClick:Function,onClose:Function},po=he(Z),bo=H([R("dialog",`
 --n-icon-margin: var(--n-icon-margin-top) var(--n-icon-margin-right) var(--n-icon-margin-bottom) var(--n-icon-margin-left);
 word-break: break-word;
 line-height: var(--n-line-height);
 position: relative;
 background: var(--n-color);
 color: var(--n-text-color);
 box-sizing: border-box;
 margin: auto;
 border-radius: var(--n-border-radius);
 padding: var(--n-padding);
 transition: 
 border-color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 `,[y("icon",{color:"var(--n-icon-color)"}),z("bordered",{border:"var(--n-border)"}),z("icon-top",[y("close",{margin:"var(--n-close-margin)"}),y("icon",{margin:"var(--n-icon-margin)"}),y("content",{textAlign:"center"}),y("title",{justifyContent:"center"}),y("action",{justifyContent:"center"})]),z("icon-left",[y("icon",{margin:"var(--n-icon-margin)"}),z("closable",[y("title",`
 padding-right: calc(var(--n-close-size) + 6px);
 `)])]),y("close",`
 position: absolute;
 right: 0;
 top: 0;
 margin: var(--n-close-margin);
 transition:
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 z-index: 1;
 `),y("content",`
 font-size: var(--n-font-size);
 margin: var(--n-content-margin);
 position: relative;
 word-break: break-word;
 `,[z("last","margin-bottom: 0;")]),y("action",`
 display: flex;
 justify-content: flex-end;
 `,[H("> *:not(:last-child)",`
 margin-right: var(--n-action-space);
 `)]),y("icon",`
 font-size: var(--n-icon-size);
 transition: color .3s var(--n-bezier);
 `),y("title",`
 transition: color .3s var(--n-bezier);
 display: flex;
 align-items: center;
 font-size: var(--n-title-font-size);
 font-weight: var(--n-title-font-weight);
 color: var(--n-title-text-color);
 `),R("dialog-icon-container",`
 display: flex;
 justify-content: center;
 `)]),$e(R("dialog",`
 width: 446px;
 max-width: calc(100vw - 32px);
 `)),R("dialog",[ze(`
 width: 446px;
 max-width: calc(100vw - 32px);
 `)])]),Co={default:()=>s(J,null),info:()=>s(J,null),success:()=>s(Ne,null),warning:()=>s(Ie,null),error:()=>s(Ae,null)},yo=X({name:"Dialog",alias:["NimbusConfirmCard","Confirm"],props:Object.assign(Object.assign({},D.props),Z),setup(e){const{mergedComponentPropsRef:i,mergedClsPrefixRef:t,inlineThemeDisabled:l,mergedRtlRef:m}=de(e),u=Ve("Dialog",m,t),c=$(()=>{var f,h;const{iconPlacement:C}=e;return C||((h=(f=i==null?void 0:i.value)===null||f===void 0?void 0:f.Dialog)===null||h===void 0?void 0:h.iconPlacement)||"left"});function p(f){const{onPositiveClick:h}=e;h&&h(f)}function b(f){const{onNegativeClick:h}=e;h&&h(f)}function w(){const{onClose:f}=e;f&&f()}const x=D("Dialog","-dialog",bo,We,e,t),B=$(()=>{const{type:f}=e,h=c.value,{common:{cubicBezierEaseInOut:C},self:{fontSize:a,lineHeight:v,border:r,titleTextColor:O,textColor:S,color:g,closeBorderRadius:o,closeColorHover:n,closeColorPressed:k,closeIconColor:F,closeIconColorHover:pe,closeIconColorPressed:be,closeIconSize:Ce,borderRadius:ye,titleFontWeight:ke,titleFontSize:Pe,padding:we,iconSize:xe,actionSpace:Be,contentMargin:Se,closeSize:Re,[h==="top"?"iconMarginIconTop":"iconMargin"]:Oe,[h==="top"?"closeMarginIconTop":"closeMargin"]:Fe,[Me("iconColor",f)]:Te}}=x.value,j=qe(Oe);return{"--n-font-size":a,"--n-icon-color":Te,"--n-bezier":C,"--n-close-margin":Fe,"--n-icon-margin-top":j.top,"--n-icon-margin-right":j.right,"--n-icon-margin-bottom":j.bottom,"--n-icon-margin-left":j.left,"--n-icon-size":xe,"--n-close-size":Re,"--n-close-icon-size":Ce,"--n-close-border-radius":o,"--n-close-color-hover":n,"--n-close-color-pressed":k,"--n-close-icon-color":F,"--n-close-icon-color-hover":pe,"--n-close-icon-color-pressed":be,"--n-color":g,"--n-text-color":S,"--n-border-radius":ye,"--n-padding":we,"--n-line-height":v,"--n-border":r,"--n-content-margin":Se,"--n-title-font-size":Pe,"--n-title-font-weight":ke,"--n-title-text-color":O,"--n-action-space":Be}}),d=l?ue("dialog",$(()=>`${e.type[0]}${c.value[0]}`),B,e):void 0;return{mergedClsPrefix:t,rtlEnabled:u,mergedIconPlacement:c,mergedTheme:x,handlePositiveClick:p,handleNegativeClick:b,handleCloseClick:w,cssVars:l?void 0:B,themeClass:d==null?void 0:d.themeClass,onRender:d==null?void 0:d.onRender}},render(){var e;const{bordered:i,mergedIconPlacement:t,cssVars:l,closable:m,showIcon:u,title:c,content:p,action:b,negativeText:w,positiveText:x,positiveButtonProps:B,negativeButtonProps:d,handlePositiveClick:f,handleNegativeClick:h,mergedTheme:C,loading:a,type:v,mergedClsPrefix:r}=this;(e=this.onRender)===null||e===void 0||e.call(this);const O=u?s(je,{clsPrefix:r,class:`${r}-dialog__icon`},{default:()=>_(this.$slots.icon,g=>g||(this.icon?T(this.icon):Co[this.type]()))}):null,S=_(this.$slots.action,g=>g||x||w||b?s("div",{class:[`${r}-dialog__action`,this.actionClass],style:this.actionStyle},g||(b?[T(b)]:[this.negativeText&&s(ne,Object.assign({theme:C.peers.Button,themeOverrides:C.peerOverrides.Button,ghost:!0,size:"small",onClick:h},d),{default:()=>T(this.negativeText)}),this.positiveText&&s(ne,Object.assign({theme:C.peers.Button,themeOverrides:C.peerOverrides.Button,size:"small",type:v==="default"?"primary":v,disabled:a,loading:a,onClick:f},B),{default:()=>T(this.positiveText)})])):null);return s("div",{class:[`${r}-dialog`,this.themeClass,this.closable&&`${r}-dialog--closable`,`${r}-dialog--icon-${t}`,i&&`${r}-dialog--bordered`,this.rtlEnabled&&`${r}-dialog--rtl`],style:l,role:"dialog"},m?_(this.$slots.close,g=>{const o=[`${r}-dialog__close`,this.rtlEnabled&&`${r}-dialog--rtl`];return g?s("div",{class:o},g):s(Xe,{clsPrefix:r,class:o,onClick:this.handleCloseClick})}):null,u&&t==="top"?s("div",{class:`${r}-dialog-icon-container`},O):null,s("div",{class:[`${r}-dialog__title`,this.titleClass],style:this.titleStyle},u&&t==="left"?O:null,te(this.$slots.header,()=>[T(c)])),s("div",{class:[`${r}-dialog__content`,S?"":`${r}-dialog__content--last`,this.contentClass],style:this.contentStyle},te(this.$slots.default,()=>[T(p)])),S)}}),G=Object.assign(Object.assign({},He),Z),ko=he(G),Po=X({name:"ModalBody",inheritAttrs:!1,props:Object.assign(Object.assign({show:{type:Boolean,required:!0},preset:String,displayDirective:{type:String,required:!0},trapFocus:{type:Boolean,default:!0},autoFocus:{type:Boolean,default:!0},blockScroll:Boolean},G),{renderMask:Function,onClickoutside:Function,onBeforeLeave:{type:Function,required:!0},onAfterLeave:{type:Function,required:!0},onPositiveClick:{type:Function,required:!0},onNegativeClick:{type:Function,required:!0},onClose:{type:Function,required:!0},onAfterEnter:Function,onEsc:Function}),setup(e){const i=P(null),t=P(null),l=P(e.show),m=P(null),u=P(null);Q(K(e,"show"),a=>{a&&(l.value=!0)}),ro($(()=>e.blockScroll&&l.value));const c=U(ve);function p(){if(c.transformOriginRef.value==="center")return"";const{value:a}=m,{value:v}=u;if(a===null||v===null)return"";if(t.value){const r=t.value.containerScrollTop;return`${a}px ${v+r}px`}return""}function b(a){if(c.transformOriginRef.value==="center")return;const v=c.getMousePosition();if(!v||!t.value)return;const r=t.value.containerScrollTop,{offsetLeft:O,offsetTop:S}=a;if(v){const g=v.y,o=v.x;m.value=-(O-o),u.value=-(S-g-r)}a.style.transformOrigin=p()}function w(a){oe(()=>{b(a)})}function x(a){a.style.transformOrigin=p(),e.onBeforeLeave()}function B(){l.value=!1,m.value=null,u.value=null,e.onAfterLeave()}function d(){const{onClose:a}=e;a&&a()}function f(){e.onNegativeClick()}function h(){e.onPositiveClick()}const C=P(null);return Q(C,a=>{a&&oe(()=>{const v=a.el;v&&i.value!==v&&(i.value=v)})}),E(Ze,i),E(Ge,null),E(Je,null),{mergedTheme:c.mergedThemeRef,appear:c.appearRef,isMounted:c.isMountedRef,mergedClsPrefix:c.mergedClsPrefixRef,bodyRef:i,scrollbarRef:t,displayed:l,childNodeRef:C,handlePositiveClick:h,handleNegativeClick:f,handleCloseClick:d,handleAfterLeave:B,handleBeforeLeave:x,handleEnter:w}},render(){const{$slots:e,$attrs:i,handleEnter:t,handleAfterLeave:l,handleBeforeLeave:m,preset:u,mergedClsPrefix:c}=this;let p=null;if(!u){if(p=Qe(e),!p){Ee("modal","default slot is empty");return}p=Le(p),p.props=De({class:`${c}-modal`},i,p.props||{})}return this.displayDirective==="show"||this.displayed||this.show?V(s("div",{role:"none",class:`${c}-modal-body-wrapper`},s(eo,{ref:"scrollbarRef",theme:this.mergedTheme.peers.Scrollbar,themeOverrides:this.mergedTheme.peerOverrides.Scrollbar,contentClass:`${c}-modal-scroll-content`},{default:()=>{var b;return[(b=this.renderMask)===null||b===void 0?void 0:b.call(this),s(oo,{disabled:!this.trapFocus,active:this.show,onEsc:this.onEsc,autoFocus:this.autoFocus},{default:()=>{var w;return s(fe,{name:"fade-in-scale-up-transition",appear:(w=this.appear)!==null&&w!==void 0?w:this.isMounted,onEnter:t,onAfterEnter:this.onAfterEnter,onAfterLeave:l,onBeforeLeave:m},{default:()=>{const x=[[ee,this.show]],{onClickoutside:B}=this;return B&&x.push([to,this.onClickoutside,void 0,{capture:!0}]),V(this.preset==="confirm"||this.preset==="dialog"?s(yo,Object.assign({},this.$attrs,{class:[`${c}-modal`,this.$attrs.class],ref:"bodyRef",theme:this.mergedTheme.peers.Dialog,themeOverrides:this.mergedTheme.peerOverrides.Dialog},Y(this.$props,po),{"aria-modal":"true"}),e):this.preset==="card"?s(Ke,Object.assign({},this.$attrs,{ref:"bodyRef",class:[`${c}-modal`,this.$attrs.class],theme:this.mergedTheme.peers.Card,themeOverrides:this.mergedTheme.peerOverrides.Card},Y(this.$props,Ue),{"aria-modal":"true",role:"dialog"}),e):this.childNodeRef=p,x)}})}})]}})),[[ee,this.displayDirective==="if"||this.displayed||this.show]]):null}}),wo=H([R("modal-container",`
 position: fixed;
 left: 0;
 top: 0;
 height: 0;
 width: 0;
 display: flex;
 `),R("modal-mask",`
 position: fixed;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 background-color: rgba(0, 0, 0, .4);
 `,[no({enterDuration:".25s",leaveDuration:".25s",enterCubicBezier:"var(--n-bezier-ease-out)",leaveCubicBezier:"var(--n-bezier-ease-out)"})]),R("modal-body-wrapper",`
 position: fixed;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 overflow: visible;
 `,[R("modal-scroll-content",`
 min-height: 100%;
 display: flex;
 position: relative;
 `)]),R("modal",`
 position: relative;
 align-self: center;
 color: var(--n-text-color);
 margin: auto;
 box-shadow: var(--n-box-shadow);
 `,[uo({duration:".25s",enterScale:".5"})])]),xo=Object.assign(Object.assign(Object.assign(Object.assign({},D.props),{show:Boolean,unstableShowMask:{type:Boolean,default:!0},maskClosable:{type:Boolean,default:!0},preset:String,to:[String,Object],displayDirective:{type:String,default:"if"},transformOrigin:{type:String,default:"mouse"},zIndex:Number,autoFocus:{type:Boolean,default:!0},trapFocus:{type:Boolean,default:!0},closeOnEsc:{type:Boolean,default:!0},blockScroll:{type:Boolean,default:!0}}),G),{onEsc:Function,"onUpdate:show":[Function,Array],onUpdateShow:[Function,Array],onAfterEnter:Function,onBeforeLeave:Function,onAfterLeave:Function,onClose:Function,onPositiveClick:Function,onNegativeClick:Function,onMaskClick:Function,internalDialog:Boolean,internalModal:Boolean,internalAppear:{type:Boolean,default:void 0},overlayStyle:[String,Object],onBeforeHide:Function,onAfterHide:Function,onHide:Function}),Lo=X({name:"Modal",inheritAttrs:!1,props:xo,setup(e){const i=P(null),{mergedClsPrefixRef:t,namespaceRef:l,inlineThemeDisabled:m}=de(e),u=D("Modal","-modal",wo,Ye,e,t),c=mo(64),p=vo(),b=fo(),w=e.internalDialog?U(_e,null):null,x=e.internalModal?U(io,null):null,B=co();function d(o){const{onUpdateShow:n,"onUpdate:show":k,onHide:F}=e;n&&N(n,o),k&&N(k,o),F&&!o&&F(o)}function f(){const{onClose:o}=e;o?Promise.resolve(o()).then(n=>{n!==!1&&d(!1)}):d(!1)}function h(){const{onPositiveClick:o}=e;o?Promise.resolve(o()).then(n=>{n!==!1&&d(!1)}):d(!1)}function C(){const{onNegativeClick:o}=e;o?Promise.resolve(o()).then(n=>{n!==!1&&d(!1)}):d(!1)}function a(){const{onBeforeLeave:o,onBeforeHide:n}=e;o&&N(o),n&&n()}function v(){const{onAfterLeave:o,onAfterHide:n}=e;o&&N(o),n&&n()}function r(o){var n;const{onMaskClick:k}=e;k&&k(o),e.maskClosable&&!((n=i.value)===null||n===void 0)&&n.contains(lo(o))&&d(!1)}function O(o){var n;(n=e.onEsc)===null||n===void 0||n.call(e),e.show&&e.closeOnEsc&&ho(o)&&(B.value||d(!1))}E(ve,{getMousePosition:()=>{const o=w||x;if(o){const{clickedRef:n,clickedPositionRef:k}=o;if(n.value&&k.value)return k.value}return c.value?p.value:null},mergedClsPrefixRef:t,mergedThemeRef:u,isMountedRef:b,appearRef:K(e,"internalAppear"),transformOriginRef:K(e,"transformOrigin")});const S=$(()=>{const{common:{cubicBezierEaseOut:o},self:{boxShadow:n,color:k,textColor:F}}=u.value;return{"--n-bezier-ease-out":o,"--n-box-shadow":n,"--n-color":k,"--n-text-color":F}}),g=m?ue("theme-class",void 0,S,e):void 0;return{mergedClsPrefix:t,namespace:l,isMounted:b,containerRef:i,presetProps:$(()=>Y(e,ko)),handleEsc:O,handleAfterLeave:v,handleClickoutside:r,handleBeforeLeave:a,doUpdateShow:d,handleNegativeClick:C,handlePositiveClick:h,handleCloseClick:f,cssVars:m?void 0:S,themeClass:g==null?void 0:g.themeClass,onRender:g==null?void 0:g.onRender}},render(){const{mergedClsPrefix:e}=this;return s(ao,{to:this.to,show:this.show},{default:()=>{var i;(i=this.onRender)===null||i===void 0||i.call(this);const{unstableShowMask:t}=this;return V(s("div",{role:"none",ref:"containerRef",class:[`${e}-modal-container`,this.themeClass,this.namespace],style:this.cssVars},s(Po,Object.assign({style:this.overlayStyle},this.$attrs,{ref:"bodyWrapper",displayDirective:this.displayDirective,show:this.show,preset:this.preset,autoFocus:this.autoFocus,trapFocus:this.trapFocus,blockScroll:this.blockScroll},this.presetProps,{onEsc:this.handleEsc,onClose:this.handleCloseClick,onNegativeClick:this.handleNegativeClick,onPositiveClick:this.handlePositiveClick,onBeforeLeave:this.handleBeforeLeave,onAfterEnter:this.onAfterEnter,onAfterLeave:this.handleAfterLeave,onClickoutside:t?void 0:this.handleClickoutside,renderMask:t?()=>{var l;return s(fe,{name:"fade-in-transition",key:"mask",appear:(l=this.internalAppear)!==null&&l!==void 0?l:this.isMounted},{default:()=>this.show?s("div",{"aria-hidden":!0,ref:"containerRef",class:`${e}-modal-mask`,onClick:this.handleClickoutside}):null})}:void 0}),this.$slots)),[[so,{zIndex:this.zIndex,enabled:this.show}]])}})}});export{Lo as N,yo as a,po as b,vo as c,Z as d,mo as u};
