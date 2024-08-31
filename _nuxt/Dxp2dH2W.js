import{f as K,r as z,cP as bt,B as l,c8 as ct,aA as ye,cv as ft,D as Y,aM as pt,F as ut,bX as r,c4 as n,bW as u,c6 as W,c5 as vt,bY as ht,bZ as we,dQ as gt,E as Q,aN as ee,i as xt,b0 as mt,bq as B,bK as yt,ce as E,bO as wt,bH as St,Z as Ct,a6 as Rt}from"./BxjnDFbc.js";import{N as zt,g as U,u as $t,r as ue,c as G,h as Tt}from"./DMIDmvrD.js";import{A as Pt}from"./COe4agG7.js";import{r as Wt}from"./Bw1zOFyj.js";import{N as _t}from"./BzcuLD3P.js";import{o as At}from"./DbnPTcif.js";import{u as ve}from"./CH9LAfVN.js";import{f as te,u as Lt,V as ae}from"./CNubMyRl.js";import{t as re}from"./DIlBW_jV.js";import{c as Bt,a as he,o as Et}from"./DHE-aM53.js";const jt=he(".v-x-scroll",{overflow:"auto",scrollbarWidth:"none"},[he("&::-webkit-scrollbar",{width:0,height:0})]),kt=K({name:"XScroll",props:{disabled:Boolean,onScroll:Function},setup(){const e=z(null);function s(d){!(d.currentTarget.offsetWidth<d.currentTarget.scrollWidth)||d.deltaY===0||(d.currentTarget.scrollLeft+=d.deltaY+d.deltaX,d.preventDefault())}const c=bt();return jt.mount({id:"vueuc/x-scroll",head:!0,anchorMetaName:Bt,ssr:c}),Object.assign({selfRef:e,handleWheel:s},{scrollTo(...d){var m;(m=e.value)===null||m===void 0||m.scrollTo(...d)}})},render(){return l("div",{ref:"selfRef",onScroll:this.onScroll,onWheel:this.disabled?void 0:this.handleWheel,class:"v-x-scroll"},this.$slots)}}),se=ct("n-tabs"),Se={tab:[String,Number,Object,Function],name:{type:[String,Number],required:!0},disabled:Boolean,displayDirective:{type:String,default:"if"},closable:{type:Boolean,default:void 0},tabProps:Object,label:[String,Number,Object,Function]},qt=K({__TAB_PANE__:!0,name:"TabPane",alias:["TabPanel"],props:Se,setup(e){const s=ye(se,null);return s||ft("tab-pane","`n-tab-pane` must be placed inside `n-tabs`."),{style:s.paneStyleRef,class:s.paneClassRef,mergedClsPrefix:s.mergedClsPrefixRef}},render(){return l("div",{class:[`${this.mergedClsPrefix}-tab-pane`,this.class],style:this.style},this.$slots)}}),Ht=Object.assign({internalLeftPadded:Boolean,internalAddable:Boolean,internalCreatedByPane:Boolean},At(Se,["displayDirective"])),ne=K({__TAB__:!0,inheritAttrs:!1,name:"Tab",props:Ht,setup(e){const{mergedClsPrefixRef:s,valueRef:c,typeRef:y,closableRef:d,tabStyleRef:m,addTabStyleRef:v,tabClassRef:w,addTabClassRef:S,tabChangeIdRef:h,onBeforeLeaveRef:f,triggerRef:j,handleAdd:A,activateTab:g,handleClose:C}=ye(se);return{trigger:j,mergedClosable:Y(()=>{if(e.internalAddable)return!1;const{closable:x}=e;return x===void 0?d.value:x}),style:m,addStyle:v,tabClass:w,addTabClass:S,clsPrefix:s,value:c,type:y,handleClose(x){x.stopPropagation(),!e.disabled&&C(e.name)},activateTab(){if(e.disabled)return;if(e.internalAddable){A();return}const{name:x}=e,T=++h.id;if(x!==c.value){const{value:L}=f;L?Promise.resolve(L(e.name,c.value)).then($=>{$&&h.id===T&&g(x)}):g(x)}}}},render(){const{internalAddable:e,clsPrefix:s,name:c,disabled:y,label:d,tab:m,value:v,mergedClosable:w,trigger:S,$slots:{default:h}}=this,f=d??m;return l("div",{class:`${s}-tabs-tab-wrapper`},this.internalLeftPadded?l("div",{class:`${s}-tabs-tab-pad`}):null,l("div",Object.assign({key:c,"data-name":c,"data-disabled":y?!0:void 0},pt({class:[`${s}-tabs-tab`,v===c&&`${s}-tabs-tab--active`,y&&`${s}-tabs-tab--disabled`,w&&`${s}-tabs-tab--closable`,e&&`${s}-tabs-tab--addable`,e?this.addTabClass:this.tabClass],onClick:S==="click"?this.activateTab:void 0,onMouseenter:S==="hover"?this.activateTab:void 0,style:e?this.addStyle:this.style},this.internalCreatedByPane?this.tabProps||{}:this.$attrs)),l("span",{class:`${s}-tabs-tab__label`},e?l(ut,null,l("div",{class:`${s}-tabs-tab__height-placeholder`}," "),l(zt,{clsPrefix:s},{default:()=>l(Pt,null)})):h?h():typeof f=="object"?f:Wt(f??c)),w&&this.type==="card"?l(_t,{clsPrefix:s,class:`${s}-tabs-tab__close`,onClick:this.handleClose,disabled:y}):null))}}),Ot=r("tabs",`
 box-sizing: border-box;
 width: 100%;
 display: flex;
 flex-direction: column;
 transition:
 background-color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
`,[n("segment-type",[r("tabs-rail",[u("&.transition-disabled",[r("tabs-capsule",`
 transition: none;
 `)])])]),n("top",[r("tab-pane",`
 padding: var(--n-pane-padding-top) var(--n-pane-padding-right) var(--n-pane-padding-bottom) var(--n-pane-padding-left);
 `)]),n("left",[r("tab-pane",`
 padding: var(--n-pane-padding-right) var(--n-pane-padding-bottom) var(--n-pane-padding-left) var(--n-pane-padding-top);
 `)]),n("left, right",`
 flex-direction: row;
 `,[r("tabs-bar",`
 width: 2px;
 right: 0;
 transition:
 top .2s var(--n-bezier),
 max-height .2s var(--n-bezier),
 background-color .3s var(--n-bezier);
 `),r("tabs-tab",`
 padding: var(--n-tab-padding-vertical); 
 `)]),n("right",`
 flex-direction: row-reverse;
 `,[r("tab-pane",`
 padding: var(--n-pane-padding-left) var(--n-pane-padding-top) var(--n-pane-padding-right) var(--n-pane-padding-bottom);
 `),r("tabs-bar",`
 left: 0;
 `)]),n("bottom",`
 flex-direction: column-reverse;
 justify-content: flex-end;
 `,[r("tab-pane",`
 padding: var(--n-pane-padding-bottom) var(--n-pane-padding-right) var(--n-pane-padding-top) var(--n-pane-padding-left);
 `),r("tabs-bar",`
 top: 0;
 `)]),r("tabs-rail",`
 position: relative;
 padding: 3px;
 border-radius: var(--n-tab-border-radius);
 width: 100%;
 background-color: var(--n-color-segment);
 transition: background-color .3s var(--n-bezier);
 display: flex;
 align-items: center;
 `,[r("tabs-capsule",`
 border-radius: var(--n-tab-border-radius);
 position: absolute;
 pointer-events: none;
 background-color: var(--n-tab-color-segment);
 box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .08);
 transition: transform 0.3s var(--n-bezier);
 `),r("tabs-tab-wrapper",`
 flex-basis: 0;
 flex-grow: 1;
 display: flex;
 align-items: center;
 justify-content: center;
 `,[r("tabs-tab",`
 overflow: hidden;
 border-radius: var(--n-tab-border-radius);
 width: 100%;
 display: flex;
 align-items: center;
 justify-content: center;
 `,[n("active",`
 font-weight: var(--n-font-weight-strong);
 color: var(--n-tab-text-color-active);
 `),u("&:hover",`
 color: var(--n-tab-text-color-hover);
 `)])])]),n("flex",[r("tabs-nav",`
 width: 100%;
 position: relative;
 `,[r("tabs-wrapper",`
 width: 100%;
 `,[r("tabs-tab",`
 margin-right: 0;
 `)])])]),r("tabs-nav",`
 box-sizing: border-box;
 line-height: 1.5;
 display: flex;
 transition: border-color .3s var(--n-bezier);
 `,[W("prefix, suffix",`
 display: flex;
 align-items: center;
 `),W("prefix","padding-right: 16px;"),W("suffix","padding-left: 16px;")]),n("top, bottom",[r("tabs-nav-scroll-wrapper",[u("&::before",`
 top: 0;
 bottom: 0;
 left: 0;
 width: 20px;
 `),u("&::after",`
 top: 0;
 bottom: 0;
 right: 0;
 width: 20px;
 `),n("shadow-start",[u("&::before",`
 box-shadow: inset 10px 0 8px -8px rgba(0, 0, 0, .12);
 `)]),n("shadow-end",[u("&::after",`
 box-shadow: inset -10px 0 8px -8px rgba(0, 0, 0, .12);
 `)])])]),n("left, right",[r("tabs-nav-scroll-content",`
 flex-direction: column;
 `),r("tabs-nav-scroll-wrapper",[u("&::before",`
 top: 0;
 left: 0;
 right: 0;
 height: 20px;
 `),u("&::after",`
 bottom: 0;
 left: 0;
 right: 0;
 height: 20px;
 `),n("shadow-start",[u("&::before",`
 box-shadow: inset 0 10px 8px -8px rgba(0, 0, 0, .12);
 `)]),n("shadow-end",[u("&::after",`
 box-shadow: inset 0 -10px 8px -8px rgba(0, 0, 0, .12);
 `)])])]),r("tabs-nav-scroll-wrapper",`
 flex: 1;
 position: relative;
 overflow: hidden;
 `,[r("tabs-nav-y-scroll",`
 height: 100%;
 width: 100%;
 overflow-y: auto; 
 scrollbar-width: none;
 `,[u("&::-webkit-scrollbar",`
 width: 0;
 height: 0;
 `)]),u("&::before, &::after",`
 transition: box-shadow .3s var(--n-bezier);
 pointer-events: none;
 content: "";
 position: absolute;
 z-index: 1;
 `)]),r("tabs-nav-scroll-content",`
 display: flex;
 position: relative;
 min-width: 100%;
 min-height: 100%;
 width: fit-content;
 box-sizing: border-box;
 `),r("tabs-wrapper",`
 display: inline-flex;
 flex-wrap: nowrap;
 position: relative;
 `),r("tabs-tab-wrapper",`
 display: flex;
 flex-wrap: nowrap;
 flex-shrink: 0;
 flex-grow: 0;
 `),r("tabs-tab",`
 cursor: pointer;
 white-space: nowrap;
 flex-wrap: nowrap;
 display: inline-flex;
 align-items: center;
 color: var(--n-tab-text-color);
 font-size: var(--n-tab-font-size);
 background-clip: padding-box;
 padding: var(--n-tab-padding);
 transition:
 box-shadow .3s var(--n-bezier),
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 `,[n("disabled",{cursor:"not-allowed"}),W("close",`
 margin-left: 6px;
 transition:
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 `),W("label",`
 display: flex;
 align-items: center;
 z-index: 1;
 `)]),r("tabs-bar",`
 position: absolute;
 bottom: 0;
 height: 2px;
 border-radius: 1px;
 background-color: var(--n-bar-color);
 transition:
 left .2s var(--n-bezier),
 max-width .2s var(--n-bezier),
 opacity .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 `,[u("&.transition-disabled",`
 transition: none;
 `),n("disabled",`
 background-color: var(--n-tab-text-color-disabled)
 `)]),r("tabs-pane-wrapper",`
 position: relative;
 overflow: hidden;
 transition: max-height .2s var(--n-bezier);
 `),r("tab-pane",`
 color: var(--n-pane-text-color);
 width: 100%;
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 opacity .2s var(--n-bezier);
 left: 0;
 right: 0;
 top: 0;
 `,[u("&.next-transition-leave-active, &.prev-transition-leave-active, &.next-transition-enter-active, &.prev-transition-enter-active",`
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 transform .2s var(--n-bezier),
 opacity .2s var(--n-bezier);
 `),u("&.next-transition-leave-active, &.prev-transition-leave-active",`
 position: absolute;
 `),u("&.next-transition-enter-from, &.prev-transition-leave-to",`
 transform: translateX(32px);
 opacity: 0;
 `),u("&.next-transition-leave-to, &.prev-transition-enter-from",`
 transform: translateX(-32px);
 opacity: 0;
 `),u("&.next-transition-leave-from, &.next-transition-enter-to, &.prev-transition-leave-from, &.prev-transition-enter-to",`
 transform: translateX(0);
 opacity: 1;
 `)]),r("tabs-tab-pad",`
 box-sizing: border-box;
 width: var(--n-tab-gap);
 flex-grow: 0;
 flex-shrink: 0;
 `),n("line-type, bar-type",[r("tabs-tab",`
 font-weight: var(--n-tab-font-weight);
 box-sizing: border-box;
 vertical-align: bottom;
 `,[u("&:hover",{color:"var(--n-tab-text-color-hover)"}),n("active",`
 color: var(--n-tab-text-color-active);
 font-weight: var(--n-tab-font-weight-active);
 `),n("disabled",{color:"var(--n-tab-text-color-disabled)"})])]),r("tabs-nav",[n("line-type",[n("top",[W("prefix, suffix",`
 border-bottom: 1px solid var(--n-tab-border-color);
 `),r("tabs-nav-scroll-content",`
 border-bottom: 1px solid var(--n-tab-border-color);
 `),r("tabs-bar",`
 bottom: -1px;
 `)]),n("left",[W("prefix, suffix",`
 border-right: 1px solid var(--n-tab-border-color);
 `),r("tabs-nav-scroll-content",`
 border-right: 1px solid var(--n-tab-border-color);
 `),r("tabs-bar",`
 right: -1px;
 `)]),n("right",[W("prefix, suffix",`
 border-left: 1px solid var(--n-tab-border-color);
 `),r("tabs-nav-scroll-content",`
 border-left: 1px solid var(--n-tab-border-color);
 `),r("tabs-bar",`
 left: -1px;
 `)]),n("bottom",[W("prefix, suffix",`
 border-top: 1px solid var(--n-tab-border-color);
 `),r("tabs-nav-scroll-content",`
 border-top: 1px solid var(--n-tab-border-color);
 `),r("tabs-bar",`
 top: -1px;
 `)]),W("prefix, suffix",`
 transition: border-color .3s var(--n-bezier);
 `),r("tabs-nav-scroll-content",`
 transition: border-color .3s var(--n-bezier);
 `),r("tabs-bar",`
 border-radius: 0;
 `)]),n("card-type",[W("prefix, suffix",`
 transition: border-color .3s var(--n-bezier);
 border-bottom: 1px solid var(--n-tab-border-color);
 `),r("tabs-pad",`
 flex-grow: 1;
 transition: border-color .3s var(--n-bezier);
 `),r("tabs-tab-pad",`
 transition: border-color .3s var(--n-bezier);
 `),r("tabs-tab",`
 font-weight: var(--n-tab-font-weight);
 border: 1px solid var(--n-tab-border-color);
 background-color: var(--n-tab-color);
 box-sizing: border-box;
 position: relative;
 vertical-align: bottom;
 display: flex;
 justify-content: space-between;
 font-size: var(--n-tab-font-size);
 color: var(--n-tab-text-color);
 `,[n("addable",`
 padding-left: 8px;
 padding-right: 8px;
 font-size: 16px;
 `,[W("height-placeholder",`
 width: 0;
 font-size: var(--n-tab-font-size);
 `),vt("disabled",[u("&:hover",`
 color: var(--n-tab-text-color-hover);
 `)])]),n("closable","padding-right: 8px;"),n("active",`
 background-color: #0000;
 font-weight: var(--n-tab-font-weight-active);
 color: var(--n-tab-text-color-active);
 `),n("disabled","color: var(--n-tab-text-color-disabled);")]),r("tabs-scroll-padding","border-bottom: 1px solid var(--n-tab-border-color);")]),n("left, right",[r("tabs-wrapper",`
 flex-direction: column;
 `,[r("tabs-tab-wrapper",`
 flex-direction: column;
 `,[r("tabs-tab-pad",`
 height: var(--n-tab-gap-vertical);
 width: 100%;
 `)])])]),n("top",[n("card-type",[r("tabs-tab",`
 border-top-left-radius: var(--n-tab-border-radius);
 border-top-right-radius: var(--n-tab-border-radius);
 `,[n("active",`
 border-bottom: 1px solid #0000;
 `)]),r("tabs-tab-pad",`
 border-bottom: 1px solid var(--n-tab-border-color);
 `),r("tabs-pad",`
 border-bottom: 1px solid var(--n-tab-border-color);
 `)])]),n("left",[n("card-type",[r("tabs-tab",`
 border-top-left-radius: var(--n-tab-border-radius);
 border-bottom-left-radius: var(--n-tab-border-radius);
 `,[n("active",`
 border-right: 1px solid #0000;
 `)]),r("tabs-tab-pad",`
 border-right: 1px solid var(--n-tab-border-color);
 `),r("tabs-pad",`
 border-right: 1px solid var(--n-tab-border-color);
 `)])]),n("right",[n("card-type",[r("tabs-tab",`
 border-top-right-radius: var(--n-tab-border-radius);
 border-bottom-right-radius: var(--n-tab-border-radius);
 `,[n("active",`
 border-left: 1px solid #0000;
 `)]),r("tabs-tab-pad",`
 border-left: 1px solid var(--n-tab-border-color);
 `),r("tabs-pad",`
 border-left: 1px solid var(--n-tab-border-color);
 `)])]),n("bottom",[n("card-type",[r("tabs-tab",`
 border-bottom-left-radius: var(--n-tab-border-radius);
 border-bottom-right-radius: var(--n-tab-border-radius);
 `,[n("active",`
 border-top: 1px solid #0000;
 `)]),r("tabs-tab-pad",`
 border-top: 1px solid var(--n-tab-border-color);
 `),r("tabs-pad",`
 border-top: 1px solid var(--n-tab-border-color);
 `)])])])]),Ft=Object.assign(Object.assign({},we.props),{value:[String,Number],defaultValue:[String,Number],trigger:{type:String,default:"click"},type:{type:String,default:"bar"},closable:Boolean,justifyContent:String,size:{type:String,default:"medium"},placement:{type:String,default:"top"},tabStyle:[String,Object],tabClass:String,addTabStyle:[String,Object],addTabClass:String,barWidth:Number,paneClass:String,paneStyle:[String,Object],paneWrapperClass:String,paneWrapperStyle:[String,Object],addable:[Boolean,Object],tabsPadding:{type:Number,default:0},animated:Boolean,onBeforeLeave:Function,onAdd:Function,"onUpdate:value":[Function,Array],onUpdateValue:[Function,Array],onClose:[Function,Array],labelSize:String,activeName:[String,Number],onActiveNameChange:[Function,Array]}),Zt=K({name:"Tabs",props:Ft,setup(e,{slots:s}){var c,y,d,m;const{mergedClsPrefixRef:v,inlineThemeDisabled:w}=ht(e),S=we("Tabs","-tabs",Ot,gt,e,v),h=z(null),f=z(null),j=z(null),A=z(null),g=z(null),C=z(null),x=z(!0),T=z(!0),L=ve(e,["labelSize","size"]),$=ve(e,["activeName","value"]),D=z((y=(c=$.value)!==null&&c!==void 0?c:e.defaultValue)!==null&&y!==void 0?y:s.default?(m=(d=te(s.default())[0])===null||d===void 0?void 0:d.props)===null||m===void 0?void 0:m.name:null),P=Lt($,D),b={id:0},R=Y(()=>{if(!(!e.justifyContent||e.type==="card"))return{display:"flex",justifyContent:e.justifyContent}});Q(P,()=>{b.id=0,M(),le()});function k(){var t;const{value:a}=P;return a===null?null:(t=h.value)===null||t===void 0?void 0:t.querySelector(`[data-name="${a}"]`)}function Ce(t){if(e.type==="card")return;const{value:a}=f;if(!a)return;const o=a.style.opacity==="0";if(t){const i=`${v.value}-tabs-bar--disabled`,{barWidth:p,placement:_}=e;if(t.dataset.disabled==="true"?a.classList.add(i):a.classList.remove(i),["top","bottom"].includes(_)){if(ie(["top","maxHeight","height"]),typeof p=="number"&&t.offsetWidth>=p){const O=Math.floor((t.offsetWidth-p)/2)+t.offsetLeft;a.style.left=`${O}px`,a.style.maxWidth=`${p}px`}else a.style.left=`${t.offsetLeft}px`,a.style.maxWidth=`${t.offsetWidth}px`;a.style.width="8192px",o&&(a.style.transition="none"),a.offsetWidth,o&&(a.style.transition="",a.style.opacity="1")}else{if(ie(["left","maxWidth","width"]),typeof p=="number"&&t.offsetHeight>=p){const O=Math.floor((t.offsetHeight-p)/2)+t.offsetTop;a.style.top=`${O}px`,a.style.maxHeight=`${p}px`}else a.style.top=`${t.offsetTop}px`,a.style.maxHeight=`${t.offsetHeight}px`;a.style.height="8192px",o&&(a.style.transition="none"),a.offsetHeight,o&&(a.style.transition="",a.style.opacity="1")}}}function Re(){if(e.type==="card")return;const{value:t}=f;t&&(t.style.opacity="0")}function ie(t){const{value:a}=f;if(a)for(const o of t)a.style[o]=""}function M(){if(e.type==="card")return;const t=k();t?Ce(t):Re()}function le(){var t;const a=(t=g.value)===null||t===void 0?void 0:t.$el;if(!a)return;const o=k();if(!o)return;const{scrollLeft:i,offsetWidth:p}=a,{offsetLeft:_,offsetWidth:O}=o;i>_?a.scrollTo({top:0,left:_,behavior:"smooth"}):_+O>i+p&&a.scrollTo({top:0,left:_+O-p,behavior:"smooth"})}const N=z(null);let q=0,H=null;function ze(t){const a=N.value;if(a){q=t.getBoundingClientRect().height;const o=`${q}px`,i=()=>{a.style.height=o,a.style.maxHeight=o};H?(i(),H(),H=null):H=i}}function $e(t){const a=N.value;if(a){const o=t.getBoundingClientRect().height,i=()=>{document.body.offsetHeight,a.style.maxHeight=`${o}px`,a.style.height=`${Math.max(q,o)}px`};H?(H(),H=null,i()):H=i}}function Te(){const t=N.value;if(t){t.style.maxHeight="",t.style.height="";const{paneWrapperStyle:a}=e;if(typeof a=="string")t.style.cssText=a;else if(a){const{maxHeight:o,height:i}=a;o!==void 0&&(t.style.maxHeight=o),i!==void 0&&(t.style.height=i)}}}const de={value:[]},be=z("next");function Pe(t){const a=P.value;let o="next";for(const i of de.value){if(i===a)break;if(i===t){o="prev";break}}be.value=o,We(t)}function We(t){const{onActiveNameChange:a,onUpdateValue:o,"onUpdate:value":i}=e;a&&G(a,t),o&&G(o,t),i&&G(i,t),D.value=t}function _e(t){const{onClose:a}=e;a&&G(a,t)}function ce(){const{value:t}=f;if(!t)return;const a="transition-disabled";t.classList.add(a),M(),t.classList.remove(a)}const F=z(null);function Z({transitionDisabled:t}){const a=h.value;if(!a)return;t&&a.classList.add("transition-disabled");const o=k();o&&F.value&&(F.value.style.width=`${o.offsetWidth}px`,F.value.style.height=`${o.offsetHeight}px`,F.value.style.transform=`translateX(${o.offsetLeft-Tt(getComputedStyle(a).paddingLeft)}px)`,t&&F.value.offsetWidth),t&&a.classList.remove("transition-disabled")}Q([P],()=>{e.type==="segment"&&ee(()=>{Z({transitionDisabled:!1})})}),xt(()=>{e.type==="segment"&&Z({transitionDisabled:!0})});let fe=0;function Ae(t){var a;if(t.contentRect.width===0&&t.contentRect.height===0||fe===t.contentRect.width)return;fe=t.contentRect.width;const{type:o}=e;if((o==="line"||o==="bar")&&ce(),o!=="segment"){const{placement:i}=e;J((i==="top"||i==="bottom"?(a=g.value)===null||a===void 0?void 0:a.$el:C.value)||null)}}const Le=re(Ae,64);Q([()=>e.justifyContent,()=>e.size],()=>{ee(()=>{const{type:t}=e;(t==="line"||t==="bar")&&ce()})});const V=z(!1);function Be(t){var a;const{target:o,contentRect:{width:i}}=t,p=o.parentElement.offsetWidth;if(!V.value)p<i&&(V.value=!0);else{const{value:_}=A;if(!_)return;p-i>_.$el.offsetWidth&&(V.value=!1)}J(((a=g.value)===null||a===void 0?void 0:a.$el)||null)}const Ee=re(Be,64);function je(){const{onAdd:t}=e;t&&t(),ee(()=>{const a=k(),{value:o}=g;!a||!o||o.scrollTo({left:a.offsetLeft,top:0,behavior:"smooth"})})}function J(t){if(!t)return;const{placement:a}=e;if(a==="top"||a==="bottom"){const{scrollLeft:o,scrollWidth:i,offsetWidth:p}=t;x.value=o<=0,T.value=o+p>=i}else{const{scrollTop:o,scrollHeight:i,offsetHeight:p}=t;x.value=o<=0,T.value=o+p>=i}}const ke=re(t=>{J(t.target)},64);mt(se,{triggerRef:B(e,"trigger"),tabStyleRef:B(e,"tabStyle"),tabClassRef:B(e,"tabClass"),addTabStyleRef:B(e,"addTabStyle"),addTabClassRef:B(e,"addTabClass"),paneClassRef:B(e,"paneClass"),paneStyleRef:B(e,"paneStyle"),mergedClsPrefixRef:v,typeRef:B(e,"type"),closableRef:B(e,"closable"),valueRef:P,tabChangeIdRef:b,onBeforeLeaveRef:B(e,"onBeforeLeave"),activateTab:Pe,handleClose:_e,handleAdd:je}),Et(()=>{M(),le()}),yt(()=>{const{value:t}=j;if(!t)return;const{value:a}=v,o=`${a}-tabs-nav-scroll-wrapper--shadow-start`,i=`${a}-tabs-nav-scroll-wrapper--shadow-end`;x.value?t.classList.remove(o):t.classList.add(o),T.value?t.classList.remove(i):t.classList.add(i)});const He={syncBarPosition:()=>{M()}},Oe=()=>{Z({transitionDisabled:!0})},pe=Y(()=>{const{value:t}=L,{type:a}=e,o={card:"Card",bar:"Bar",line:"Line",segment:"Segment"}[a],i=`${t}${o}`,{self:{barColor:p,closeIconColor:_,closeIconColorHover:O,closeIconColorPressed:Fe,tabColor:Ie,tabBorderColor:De,paneTextColor:Me,tabFontWeight:Ne,tabBorderRadius:Ve,tabFontWeightActive:Xe,colorSegment:Ue,fontWeightStrong:Ge,tabColorSegment:Ye,closeSize:Ke,closeIconSize:qe,closeColorHover:Ze,closeColorPressed:Je,closeBorderRadius:Qe,[E("panePadding",t)]:X,[E("tabPadding",i)]:et,[E("tabPaddingVertical",i)]:tt,[E("tabGap",i)]:at,[E("tabGap",`${i}Vertical`)]:rt,[E("tabTextColor",a)]:ot,[E("tabTextColorActive",a)]:nt,[E("tabTextColorHover",a)]:st,[E("tabTextColorDisabled",a)]:it,[E("tabFontSize",t)]:lt},common:{cubicBezierEaseInOut:dt}}=S.value;return{"--n-bezier":dt,"--n-color-segment":Ue,"--n-bar-color":p,"--n-tab-font-size":lt,"--n-tab-text-color":ot,"--n-tab-text-color-active":nt,"--n-tab-text-color-disabled":it,"--n-tab-text-color-hover":st,"--n-pane-text-color":Me,"--n-tab-border-color":De,"--n-tab-border-radius":Ve,"--n-close-size":Ke,"--n-close-icon-size":qe,"--n-close-color-hover":Ze,"--n-close-color-pressed":Je,"--n-close-border-radius":Qe,"--n-close-icon-color":_,"--n-close-icon-color-hover":O,"--n-close-icon-color-pressed":Fe,"--n-tab-color":Ie,"--n-tab-font-weight":Ne,"--n-tab-font-weight-active":Xe,"--n-tab-padding":et,"--n-tab-padding-vertical":tt,"--n-tab-gap":at,"--n-tab-gap-vertical":rt,"--n-pane-padding-left":U(X,"left"),"--n-pane-padding-right":U(X,"right"),"--n-pane-padding-top":U(X,"top"),"--n-pane-padding-bottom":U(X,"bottom"),"--n-font-weight-strong":Ge,"--n-tab-color-segment":Ye}}),I=w?$t("tabs",Y(()=>`${L.value[0]}${e.type[0]}`),pe,e):void 0;return Object.assign({mergedClsPrefix:v,mergedValue:P,renderedNames:new Set,segmentCapsuleElRef:F,tabsPaneWrapperRef:N,tabsElRef:h,barElRef:f,addTabInstRef:A,xScrollInstRef:g,scrollWrapperElRef:j,addTabFixed:V,tabWrapperStyle:R,handleNavResize:Le,mergedSize:L,handleScroll:ke,handleTabsResize:Ee,cssVars:w?void 0:pe,themeClass:I==null?void 0:I.themeClass,animationDirection:be,renderNameListRef:de,yScrollElRef:C,handleSegmentResize:Oe,onAnimationBeforeLeave:ze,onAnimationEnter:$e,onAnimationAfterEnter:Te,onRender:I==null?void 0:I.onRender},He)},render(){const{mergedClsPrefix:e,type:s,placement:c,addTabFixed:y,addable:d,mergedSize:m,renderNameListRef:v,onRender:w,paneWrapperClass:S,paneWrapperStyle:h,$slots:{default:f,prefix:j,suffix:A}}=this;w==null||w();const g=f?te(f()).filter(b=>b.type.__TAB_PANE__===!0):[],C=f?te(f()).filter(b=>b.type.__TAB__===!0):[],x=!C.length,T=s==="card",L=s==="segment",$=!T&&!L&&this.justifyContent;v.value=[];const D=()=>{const b=l("div",{style:this.tabWrapperStyle,class:[`${e}-tabs-wrapper`]},$?null:l("div",{class:`${e}-tabs-scroll-padding`,style:{width:`${this.tabsPadding}px`}}),x?g.map((R,k)=>(v.value.push(R.props.name),oe(l(ne,Object.assign({},R.props,{internalCreatedByPane:!0,internalLeftPadded:k!==0&&(!$||$==="center"||$==="start"||$==="end")}),R.children?{default:R.children.tab}:void 0)))):C.map((R,k)=>(v.value.push(R.props.name),oe(k!==0&&!$?me(R):R))),!y&&d&&T?xe(d,(x?g.length:C.length)!==0):null,$?null:l("div",{class:`${e}-tabs-scroll-padding`,style:{width:`${this.tabsPadding}px`}}));return l("div",{ref:"tabsElRef",class:`${e}-tabs-nav-scroll-content`},T&&d?l(ae,{onResize:this.handleTabsResize},{default:()=>b}):b,T?l("div",{class:`${e}-tabs-pad`}):null,T?null:l("div",{ref:"barElRef",class:`${e}-tabs-bar`}))},P=L?"top":c;return l("div",{class:[`${e}-tabs`,this.themeClass,`${e}-tabs--${s}-type`,`${e}-tabs--${m}-size`,$&&`${e}-tabs--flex`,`${e}-tabs--${P}`],style:this.cssVars},l("div",{class:[`${e}-tabs-nav--${s}-type`,`${e}-tabs-nav--${P}`,`${e}-tabs-nav`]},ue(j,b=>b&&l("div",{class:`${e}-tabs-nav__prefix`},b)),L?l(ae,{onResize:this.handleSegmentResize},{default:()=>l("div",{class:`${e}-tabs-rail`,ref:"tabsElRef"},l("div",{class:`${e}-tabs-capsule`,ref:"segmentCapsuleElRef"},l("div",{class:`${e}-tabs-wrapper`},l("div",{class:`${e}-tabs-tab`}))),x?g.map((b,R)=>(v.value.push(b.props.name),l(ne,Object.assign({},b.props,{internalCreatedByPane:!0,internalLeftPadded:R!==0}),b.children?{default:b.children.tab}:void 0))):C.map((b,R)=>(v.value.push(b.props.name),R===0?b:me(b))))}):l(ae,{onResize:this.handleNavResize},{default:()=>l("div",{class:`${e}-tabs-nav-scroll-wrapper`,ref:"scrollWrapperElRef"},["top","bottom"].includes(P)?l(kt,{ref:"xScrollInstRef",onScroll:this.handleScroll},{default:D}):l("div",{class:`${e}-tabs-nav-y-scroll`,onScroll:this.handleScroll,ref:"yScrollElRef"},D()))}),y&&d&&T?xe(d,!0):null,ue(A,b=>b&&l("div",{class:`${e}-tabs-nav__suffix`},b))),x&&(this.animated&&(P==="top"||P==="bottom")?l("div",{ref:"tabsPaneWrapperRef",style:h,class:[`${e}-tabs-pane-wrapper`,S]},ge(g,this.mergedValue,this.renderedNames,this.onAnimationBeforeLeave,this.onAnimationEnter,this.onAnimationAfterEnter,this.animationDirection)):ge(g,this.mergedValue,this.renderedNames)))}});function ge(e,s,c,y,d,m,v){const w=[];return e.forEach(S=>{const{name:h,displayDirective:f,"display-directive":j}=S.props,A=C=>f===C||j===C,g=s===h;if(S.key!==void 0&&(S.key=h),g||A("show")||A("show:lazy")&&c.has(h)){c.has(h)||c.add(h);const C=!A("if");w.push(C?wt(S,[[St,g]]):S)}}),v?l(Ct,{name:`${v}-transition`,onBeforeLeave:y,onEnter:d,onAfterEnter:m},{default:()=>w}):w}function xe(e,s){return l(ne,{ref:"addTabInstRef",key:"__addable",name:"__addable",internalCreatedByPane:!0,internalAddable:!0,internalLeftPadded:s,disabled:typeof e=="object"&&e.disabled})}function me(e){const s=Rt(e);return s.props?s.props.internalLeftPadded=!0:s.props={internalLeftPadded:!0},s}function oe(e){return Array.isArray(e.dynamicProps)?e.dynamicProps.includes("internalLeftPadded")||e.dynamicProps.push("internalLeftPadded"):e.dynamicProps=["internalLeftPadded"],e}export{qt as N,Zt as a};
