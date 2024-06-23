import{ai as q,r as z,cL as bt,j as l,cd as ct,aD as we,cP as ft,a7 as K,aP as pt,P as ut,c1 as r,c9 as n,c0 as u,cb as W,ca as vt,c2 as ht,c3 as Se,dR as gt,z as ee,aQ as te,k as mt,b3 as xt,bt as B,bO as yt,ci as j,bT as wt,bL as St,Y as Ct,a5 as Rt}from"./CxnGVyhp.js";import{N as zt,g as G,u as Tt,r as ve,c as Y,h as $t}from"./Dk9DChTO.js";import{A as Pt}from"./74i2cIZi.js";import{r as Wt}from"./i7op4SKh.js";import{N as Lt}from"./7VV2SlMV.js";import{o as _t}from"./DbnPTcif.js";import{u as he}from"./H--Keu5V.js";import{c as ae,u as At,V as re}from"./CNETrRH7.js";import{t as oe}from"./C0H9CEn_.js";import{c as Bt,a as ge,o as jt}from"./YzvmRrfj.js";const Et=ge(".v-x-scroll",{overflow:"auto",scrollbarWidth:"none"},[ge("&::-webkit-scrollbar",{width:0,height:0})]),kt=q({name:"XScroll",props:{disabled:Boolean,onScroll:Function},setup(){const e=z(null);function s(d){!(d.currentTarget.offsetWidth<d.currentTarget.scrollWidth)||d.deltaY===0||(d.currentTarget.scrollLeft+=d.deltaY+d.deltaX,d.preventDefault())}const c=bt();return Et.mount({id:"vueuc/x-scroll",head:!0,anchorMetaName:Bt,ssr:c}),Object.assign({selfRef:e,handleWheel:s},{scrollTo(...d){var x;(x=e.value)===null||x===void 0||x.scrollTo(...d)}})},render(){return l("div",{ref:"selfRef",onScroll:this.onScroll,onWheel:this.disabled?void 0:this.handleWheel,class:"v-x-scroll"},this.$slots)}}),ie=ct("n-tabs"),Ce={tab:[String,Number,Object,Function],name:{type:[String,Number],required:!0},disabled:Boolean,displayDirective:{type:String,default:"if"},closable:{type:Boolean,default:void 0},tabProps:Object,label:[String,Number,Object,Function]},qt=q({__TAB_PANE__:!0,name:"TabPane",alias:["TabPanel"],props:Ce,setup(e){const s=we(ie,null);return s||ft("tab-pane","`n-tab-pane` must be placed inside `n-tabs`."),{style:s.paneStyleRef,class:s.paneClassRef,mergedClsPrefix:s.mergedClsPrefixRef}},render(){return l("div",{class:[`${this.mergedClsPrefix}-tab-pane`,this.class],style:this.style},this.$slots)}}),Ht=Object.assign({internalLeftPadded:Boolean,internalAddable:Boolean,internalCreatedByPane:Boolean},_t(Ce,["displayDirective"])),se=q({__TAB__:!0,inheritAttrs:!1,name:"Tab",props:Ht,setup(e){const{mergedClsPrefixRef:s,valueRef:c,typeRef:y,closableRef:d,tabStyleRef:x,addTabStyleRef:v,tabClassRef:w,addTabClassRef:S,tabChangeIdRef:h,onBeforeLeaveRef:f,triggerRef:k,handleAdd:L,activateTab:g,handleClose:C}=we(ie);return{trigger:k,mergedClosable:K(()=>{if(e.internalAddable)return!1;const{closable:m}=e;return m===void 0?d.value:m}),style:x,addStyle:v,tabClass:w,addTabClass:S,clsPrefix:s,value:c,type:y,handleClose(m){m.stopPropagation(),!e.disabled&&C(e.name)},activateTab(){if(e.disabled)return;if(e.internalAddable){L();return}const{name:m}=e,$=++h.id;if(m!==c.value){const{value:_}=f;_?Promise.resolve(_(e.name,c.value)).then(T=>{T&&h.id===$&&g(m)}):g(m)}}}},render(){const{internalAddable:e,clsPrefix:s,name:c,disabled:y,label:d,tab:x,value:v,mergedClosable:w,trigger:S,$slots:{default:h}}=this,f=d??x;return l("div",{class:`${s}-tabs-tab-wrapper`},this.internalLeftPadded?l("div",{class:`${s}-tabs-tab-pad`}):null,l("div",Object.assign({key:c,"data-name":c,"data-disabled":y?!0:void 0},pt({class:[`${s}-tabs-tab`,v===c&&`${s}-tabs-tab--active`,y&&`${s}-tabs-tab--disabled`,w&&`${s}-tabs-tab--closable`,e&&`${s}-tabs-tab--addable`,e?this.addTabClass:this.tabClass],onClick:S==="click"?this.activateTab:void 0,onMouseenter:S==="hover"?this.activateTab:void 0,style:e?this.addStyle:this.style},this.internalCreatedByPane?this.tabProps||{}:this.$attrs)),l("span",{class:`${s}-tabs-tab__label`},e?l(ut,null,l("div",{class:`${s}-tabs-tab__height-placeholder`}," "),l(zt,{clsPrefix:s},{default:()=>l(Pt,null)})):h?h():typeof f=="object"?f:Wt(f??c)),w&&this.type==="card"?l(Lt,{clsPrefix:s,class:`${s}-tabs-tab__close`,onClick:this.handleClose,disabled:y}):null))}}),Ot=r("tabs",`
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
 `)])])])]),Ft=Object.assign(Object.assign({},Se.props),{value:[String,Number],defaultValue:[String,Number],trigger:{type:String,default:"click"},type:{type:String,default:"bar"},closable:Boolean,justifyContent:String,size:{type:String,default:"medium"},placement:{type:String,default:"top"},tabStyle:[String,Object],tabClass:String,addTabStyle:[String,Object],addTabClass:String,barWidth:Number,paneClass:String,paneStyle:[String,Object],paneWrapperClass:String,paneWrapperStyle:[String,Object],addable:[Boolean,Object],tabsPadding:{type:Number,default:0},animated:Boolean,onBeforeLeave:Function,onAdd:Function,"onUpdate:value":[Function,Array],onUpdateValue:[Function,Array],onClose:[Function,Array],labelSize:String,activeName:[String,Number],onActiveNameChange:[Function,Array]}),Jt=q({name:"Tabs",props:Ft,setup(e,{slots:s}){var c,y,d,x;const{mergedClsPrefixRef:v,inlineThemeDisabled:w}=ht(e),S=Se("Tabs","-tabs",Ot,gt,e,v),h=z(null),f=z(null),k=z(null),L=z(null),g=z(null),C=z(null),m=z(!0),$=z(!0),_=he(e,["labelSize","size"]),T=he(e,["activeName","value"]),D=z((y=(c=T.value)!==null&&c!==void 0?c:e.defaultValue)!==null&&y!==void 0?y:s.default?(x=(d=ae(s.default())[0])===null||d===void 0?void 0:d.props)===null||x===void 0?void 0:x.name:null),P=At(T,D),b={id:0},R=K(()=>{if(!(!e.justifyContent||e.type==="card"))return{display:"flex",justifyContent:e.justifyContent}});ee(P,()=>{b.id=0,M(),de()});function H(){var a;const{value:t}=P;return t===null?null:(a=h.value)===null||a===void 0?void 0:a.querySelector(`[data-name="${t}"]`)}function Re(a){if(e.type==="card")return;const{value:t}=f;if(!t)return;const o=t.style.opacity==="0";if(a){const i=`${v.value}-tabs-bar--disabled`,{barWidth:p,placement:E}=e;if(a.dataset.disabled==="true"?t.classList.add(i):t.classList.remove(i),["top","bottom"].includes(E)){if(le(["top","maxHeight","height"]),typeof p=="number"&&a.offsetWidth>=p){const A=Math.floor((a.offsetWidth-p)/2)+a.offsetLeft;t.style.left=`${A}px`,t.style.maxWidth=`${p}px`}else t.style.left=`${a.offsetLeft}px`,t.style.maxWidth=`${a.offsetWidth}px`;t.style.width="8192px",o&&(t.style.transition="none"),t.offsetWidth,o&&(t.style.transition="",t.style.opacity="1")}else{if(le(["left","maxWidth","width"]),typeof p=="number"&&a.offsetHeight>=p){const A=Math.floor((a.offsetHeight-p)/2)+a.offsetTop;t.style.top=`${A}px`,t.style.maxHeight=`${p}px`}else t.style.top=`${a.offsetTop}px`,t.style.maxHeight=`${a.offsetHeight}px`;t.style.height="8192px",o&&(t.style.transition="none"),t.offsetHeight,o&&(t.style.transition="",t.style.opacity="1")}}}function ze(){if(e.type==="card")return;const{value:a}=f;a&&(a.style.opacity="0")}function le(a){const{value:t}=f;if(t)for(const o of a)t.style[o]=""}function M(){if(e.type==="card")return;const a=H();a?Re(a):ze()}function de(a){var t;const o=(t=g.value)===null||t===void 0?void 0:t.$el;if(!o)return;const i=H();if(!i)return;const{scrollLeft:p,offsetWidth:E}=o,{offsetLeft:A,offsetWidth:X}=i;p>A?o.scrollTo({top:0,left:A,behavior:"smooth"}):A+X>p+E&&o.scrollTo({top:0,left:A+X-E,behavior:"smooth"})}const N=z(null);let J=0,O=null;function Te(a){const t=N.value;if(t){J=a.getBoundingClientRect().height;const o=`${J}px`,i=()=>{t.style.height=o,t.style.maxHeight=o};O?(i(),O(),O=null):O=i}}function $e(a){const t=N.value;if(t){const o=a.getBoundingClientRect().height,i=()=>{document.body.offsetHeight,t.style.maxHeight=`${o}px`,t.style.height=`${Math.max(J,o)}px`};O?(O(),O=null,i()):O=i}}function Pe(){const a=N.value;if(a){a.style.maxHeight="",a.style.height="";const{paneWrapperStyle:t}=e;if(typeof t=="string")a.style.cssText=t;else if(t){const{maxHeight:o,height:i}=t;o!==void 0&&(a.style.maxHeight=o),i!==void 0&&(a.style.height=i)}}}const be={value:[]},ce=z("next");function We(a){const t=P.value;let o="next";for(const i of be.value){if(i===t)break;if(i===a){o="prev";break}}ce.value=o,Le(a)}function Le(a){const{onActiveNameChange:t,onUpdateValue:o,"onUpdate:value":i}=e;t&&Y(t,a),o&&Y(o,a),i&&Y(i,a),D.value=a}function _e(a){const{onClose:t}=e;t&&Y(t,a)}function fe(){const{value:a}=f;if(!a)return;const t="transition-disabled";a.classList.add(t),M(),a.classList.remove(t)}const F=z(null);function Q({transitionDisabled:a}){const t=h.value;if(!t)return;a&&t.classList.add("transition-disabled");const o=H();o&&F.value&&(F.value.style.width=`${o.offsetWidth}px`,F.value.style.height=`${o.offsetHeight}px`,F.value.style.transform=`translateX(${o.offsetLeft-$t(getComputedStyle(t).paddingLeft)}px)`,a&&F.value.offsetWidth),a&&t.classList.remove("transition-disabled")}ee([P],()=>{e.type==="segment"&&te(()=>{Q({transitionDisabled:!1})})}),mt(()=>{e.type==="segment"&&Q({transitionDisabled:!0})});let pe=0;function Ae(a){var t;if(a.contentRect.width===0&&a.contentRect.height===0||pe===a.contentRect.width)return;pe=a.contentRect.width;const{type:o}=e;if((o==="line"||o==="bar")&&fe(),o!=="segment"){const{placement:i}=e;Z((i==="top"||i==="bottom"?(t=g.value)===null||t===void 0?void 0:t.$el:C.value)||null)}}const Be=oe(Ae,64);ee([()=>e.justifyContent,()=>e.size],()=>{te(()=>{const{type:a}=e;(a==="line"||a==="bar")&&fe()})});const V=z(!1);function je(a){var t;const{target:o,contentRect:{width:i}}=a,p=o.parentElement.offsetWidth;if(!V.value)p<i&&(V.value=!0);else{const{value:E}=L;if(!E)return;p-i>E.$el.offsetWidth&&(V.value=!1)}Z(((t=g.value)===null||t===void 0?void 0:t.$el)||null)}const Ee=oe(je,64);function ke(){const{onAdd:a}=e;a&&a(),te(()=>{const t=H(),{value:o}=g;!t||!o||o.scrollTo({left:t.offsetLeft,top:0,behavior:"smooth"})})}function Z(a){if(!a)return;const{placement:t}=e;if(t==="top"||t==="bottom"){const{scrollLeft:o,scrollWidth:i,offsetWidth:p}=a;m.value=o<=0,$.value=o+p>=i}else{const{scrollTop:o,scrollHeight:i,offsetHeight:p}=a;m.value=o<=0,$.value=o+p>=i}}const He=oe(a=>{Z(a.target)},64);xt(ie,{triggerRef:B(e,"trigger"),tabStyleRef:B(e,"tabStyle"),tabClassRef:B(e,"tabClass"),addTabStyleRef:B(e,"addTabStyle"),addTabClassRef:B(e,"addTabClass"),paneClassRef:B(e,"paneClass"),paneStyleRef:B(e,"paneStyle"),mergedClsPrefixRef:v,typeRef:B(e,"type"),closableRef:B(e,"closable"),valueRef:P,tabChangeIdRef:b,onBeforeLeaveRef:B(e,"onBeforeLeave"),activateTab:We,handleClose:_e,handleAdd:ke}),jt(()=>{M(),de()}),yt(()=>{const{value:a}=k;if(!a)return;const{value:t}=v,o=`${t}-tabs-nav-scroll-wrapper--shadow-start`,i=`${t}-tabs-nav-scroll-wrapper--shadow-end`;m.value?a.classList.remove(o):a.classList.add(o),$.value?a.classList.remove(i):a.classList.add(i)});const Oe={syncBarPosition:()=>{M()}},Fe=()=>{Q({transitionDisabled:!0})},ue=K(()=>{const{value:a}=_,{type:t}=e,o={card:"Card",bar:"Bar",line:"Line",segment:"Segment"}[t],i=`${a}${o}`,{self:{barColor:p,closeIconColor:E,closeIconColorHover:A,closeIconColorPressed:X,tabColor:Ie,tabBorderColor:De,paneTextColor:Me,tabFontWeight:Ne,tabBorderRadius:Ve,tabFontWeightActive:Xe,colorSegment:Ue,fontWeightStrong:Ge,tabColorSegment:Ye,closeSize:Ke,closeIconSize:qe,closeColorHover:Je,closeColorPressed:Qe,closeBorderRadius:Ze,[j("panePadding",a)]:U,[j("tabPadding",i)]:et,[j("tabPaddingVertical",i)]:tt,[j("tabGap",i)]:at,[j("tabGap",`${i}Vertical`)]:rt,[j("tabTextColor",t)]:ot,[j("tabTextColorActive",t)]:nt,[j("tabTextColorHover",t)]:st,[j("tabTextColorDisabled",t)]:it,[j("tabFontSize",a)]:lt},common:{cubicBezierEaseInOut:dt}}=S.value;return{"--n-bezier":dt,"--n-color-segment":Ue,"--n-bar-color":p,"--n-tab-font-size":lt,"--n-tab-text-color":ot,"--n-tab-text-color-active":nt,"--n-tab-text-color-disabled":it,"--n-tab-text-color-hover":st,"--n-pane-text-color":Me,"--n-tab-border-color":De,"--n-tab-border-radius":Ve,"--n-close-size":Ke,"--n-close-icon-size":qe,"--n-close-color-hover":Je,"--n-close-color-pressed":Qe,"--n-close-border-radius":Ze,"--n-close-icon-color":E,"--n-close-icon-color-hover":A,"--n-close-icon-color-pressed":X,"--n-tab-color":Ie,"--n-tab-font-weight":Ne,"--n-tab-font-weight-active":Xe,"--n-tab-padding":et,"--n-tab-padding-vertical":tt,"--n-tab-gap":at,"--n-tab-gap-vertical":rt,"--n-pane-padding-left":G(U,"left"),"--n-pane-padding-right":G(U,"right"),"--n-pane-padding-top":G(U,"top"),"--n-pane-padding-bottom":G(U,"bottom"),"--n-font-weight-strong":Ge,"--n-tab-color-segment":Ye}}),I=w?Tt("tabs",K(()=>`${_.value[0]}${e.type[0]}`),ue,e):void 0;return Object.assign({mergedClsPrefix:v,mergedValue:P,renderedNames:new Set,segmentCapsuleElRef:F,tabsPaneWrapperRef:N,tabsElRef:h,barElRef:f,addTabInstRef:L,xScrollInstRef:g,scrollWrapperElRef:k,addTabFixed:V,tabWrapperStyle:R,handleNavResize:Be,mergedSize:_,handleScroll:He,handleTabsResize:Ee,cssVars:w?void 0:ue,themeClass:I==null?void 0:I.themeClass,animationDirection:ce,renderNameListRef:be,yScrollElRef:C,handleSegmentResize:Fe,onAnimationBeforeLeave:Te,onAnimationEnter:$e,onAnimationAfterEnter:Pe,onRender:I==null?void 0:I.onRender},Oe)},render(){const{mergedClsPrefix:e,type:s,placement:c,addTabFixed:y,addable:d,mergedSize:x,renderNameListRef:v,onRender:w,paneWrapperClass:S,paneWrapperStyle:h,$slots:{default:f,prefix:k,suffix:L}}=this;w==null||w();const g=f?ae(f()).filter(b=>b.type.__TAB_PANE__===!0):[],C=f?ae(f()).filter(b=>b.type.__TAB__===!0):[],m=!C.length,$=s==="card",_=s==="segment",T=!$&&!_&&this.justifyContent;v.value=[];const D=()=>{const b=l("div",{style:this.tabWrapperStyle,class:[`${e}-tabs-wrapper`]},T?null:l("div",{class:`${e}-tabs-scroll-padding`,style:{width:`${this.tabsPadding}px`}}),m?g.map((R,H)=>(v.value.push(R.props.name),ne(l(se,Object.assign({},R.props,{internalCreatedByPane:!0,internalLeftPadded:H!==0&&(!T||T==="center"||T==="start"||T==="end")}),R.children?{default:R.children.tab}:void 0)))):C.map((R,H)=>(v.value.push(R.props.name),ne(H!==0&&!T?ye(R):R))),!y&&d&&$?xe(d,(m?g.length:C.length)!==0):null,T?null:l("div",{class:`${e}-tabs-scroll-padding`,style:{width:`${this.tabsPadding}px`}}));return l("div",{ref:"tabsElRef",class:`${e}-tabs-nav-scroll-content`},$&&d?l(re,{onResize:this.handleTabsResize},{default:()=>b}):b,$?l("div",{class:`${e}-tabs-pad`}):null,$?null:l("div",{ref:"barElRef",class:`${e}-tabs-bar`}))},P=_?"top":c;return l("div",{class:[`${e}-tabs`,this.themeClass,`${e}-tabs--${s}-type`,`${e}-tabs--${x}-size`,T&&`${e}-tabs--flex`,`${e}-tabs--${P}`],style:this.cssVars},l("div",{class:[`${e}-tabs-nav--${s}-type`,`${e}-tabs-nav--${P}`,`${e}-tabs-nav`]},ve(k,b=>b&&l("div",{class:`${e}-tabs-nav__prefix`},b)),_?l(re,{onResize:this.handleSegmentResize},{default:()=>l("div",{class:`${e}-tabs-rail`,ref:"tabsElRef"},l("div",{class:`${e}-tabs-capsule`,ref:"segmentCapsuleElRef"},l("div",{class:`${e}-tabs-wrapper`},l("div",{class:`${e}-tabs-tab`}))),m?g.map((b,R)=>(v.value.push(b.props.name),l(se,Object.assign({},b.props,{internalCreatedByPane:!0,internalLeftPadded:R!==0}),b.children?{default:b.children.tab}:void 0))):C.map((b,R)=>(v.value.push(b.props.name),R===0?b:ye(b))))}):l(re,{onResize:this.handleNavResize},{default:()=>l("div",{class:`${e}-tabs-nav-scroll-wrapper`,ref:"scrollWrapperElRef"},["top","bottom"].includes(P)?l(kt,{ref:"xScrollInstRef",onScroll:this.handleScroll},{default:D}):l("div",{class:`${e}-tabs-nav-y-scroll`,onScroll:this.handleScroll,ref:"yScrollElRef"},D()))}),y&&d&&$?xe(d,!0):null,ve(L,b=>b&&l("div",{class:`${e}-tabs-nav__suffix`},b))),m&&(this.animated&&(P==="top"||P==="bottom")?l("div",{ref:"tabsPaneWrapperRef",style:h,class:[`${e}-tabs-pane-wrapper`,S]},me(g,this.mergedValue,this.renderedNames,this.onAnimationBeforeLeave,this.onAnimationEnter,this.onAnimationAfterEnter,this.animationDirection)):me(g,this.mergedValue,this.renderedNames)))}});function me(e,s,c,y,d,x,v){const w=[];return e.forEach(S=>{const{name:h,displayDirective:f,"display-directive":k}=S.props,L=C=>f===C||k===C,g=s===h;if(S.key!==void 0&&(S.key=h),g||L("show")||L("show:lazy")&&c.has(h)){c.has(h)||c.add(h);const C=!L("if");w.push(C?wt(S,[[St,g]]):S)}}),v?l(Ct,{name:`${v}-transition`,onBeforeLeave:y,onEnter:d,onAfterEnter:x},{default:()=>w}):w}function xe(e,s){return l(se,{ref:"addTabInstRef",key:"__addable",name:"__addable",internalCreatedByPane:!0,internalAddable:!0,internalLeftPadded:s,disabled:typeof e=="object"&&e.disabled})}function ye(e){const s=Rt(e);return s.props?s.props.internalLeftPadded=!0:s.props={internalLeftPadded:!0},s}function ne(e){return Array.isArray(e.dynamicProps)?e.dynamicProps.includes("internalLeftPadded")||e.dynamicProps.push("internalLeftPadded"):e.dynamicProps=["internalLeftPadded"],e}export{qt as N,Jt as a};
