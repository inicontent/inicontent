import{a as V,C as S,ao as nt,h as i,x as ot,y as he,z as st,b as N,X as it,T as lt,f as r,p as c,m as x,q as A,K as dt,k as ct,i as ge,d3 as bt,O as K,v as ft,w as B,P as ut,l as vt,U as Y,a5 as pt,aq as ht,am as gt,ag as mt}from"./entry.965cbfb6.js";import{b as xt,g as G,d as de,f as M,e as W}from"./Space.f818dfb9.js";import{A as yt,o as wt}from"./Add.59e5c432.js";import{r as Ct}from"./Scrollbar.bdc26b9c.js";import{N as Rt}from"./index.32cff159.js";import{c as zt,b as ce,d as be,u as St,e as $t,V as fe}from"./Scrollbar.f1d32ba1.js";import{t as J}from"./throttle.20c33391.js";const Pt=ce(".v-x-scroll",{overflow:"auto",scrollbarWidth:"none"},[ce("&::-webkit-scrollbar",{width:0,height:0})]),Tt=V({name:"XScroll",props:{disabled:Boolean,onScroll:Function},setup(){const e=S(null);function n(l){!(l.currentTarget.offsetWidth<l.currentTarget.scrollWidth)||l.deltaY===0||(l.currentTarget.scrollLeft+=l.deltaY+l.deltaX,l.preventDefault())}const b=nt();return Pt.mount({id:"vueuc/x-scroll",head:!0,anchorMetaName:zt,ssr:b}),Object.assign({selfRef:e,handleWheel:n},{scrollTo(...l){var g;(g=e.value)===null||g===void 0||g.scrollTo(...l)}})},render(){return i("div",{ref:"selfRef",onScroll:this.onScroll,onWheel:this.disabled?void 0:this.handleWheel,class:"v-x-scroll"},this.$slots)}}),ee=ot("n-tabs"),me={tab:[String,Number,Object,Function],name:{type:[String,Number],required:!0},disabled:Boolean,displayDirective:{type:String,default:"if"},closable:{type:Boolean,default:void 0},tabProps:Object,label:[String,Number,Object,Function]},Ht=V({__TAB_PANE__:!0,name:"TabPane",alias:["TabPanel"],props:me,setup(e){const n=he(ee,null);return n||st("tab-pane","`n-tab-pane` must be placed inside `n-tabs`."),{style:n.paneStyleRef,class:n.paneClassRef,mergedClsPrefix:n.mergedClsPrefixRef}},render(){return i("div",{class:[`${this.mergedClsPrefix}-tab-pane`,this.class],style:this.style},this.$slots)}}),Wt=Object.assign({internalLeftPadded:Boolean,internalAddable:Boolean,internalCreatedByPane:Boolean},wt(me,["displayDirective"])),Z=V({__TAB__:!0,inheritAttrs:!1,name:"Tab",props:Wt,setup(e){const{mergedClsPrefixRef:n,valueRef:b,typeRef:y,closableRef:l,tabStyleRef:g,tabChangeIdRef:u,onBeforeLeaveRef:w,triggerRef:m,handleAdd:C,activateTab:z,handleClose:p}=he(ee);return{trigger:m,mergedClosable:N(()=>{if(e.internalAddable)return!1;const{closable:f}=e;return f===void 0?l.value:f}),style:g,clsPrefix:n,value:b,type:y,handleClose(f){f.stopPropagation(),!e.disabled&&p(e.name)},activateTab(){if(e.disabled)return;if(e.internalAddable){C();return}const{name:f}=e,R=++u.id;if(f!==b.value){const{value:h}=w;h?Promise.resolve(h(e.name,b.value)).then(L=>{L&&u.id===R&&z(f)}):z(f)}}}},render(){const{internalAddable:e,clsPrefix:n,name:b,disabled:y,label:l,tab:g,value:u,mergedClosable:w,style:m,trigger:C,$slots:{default:z}}=this,p=l!=null?l:g;return i("div",{class:`${n}-tabs-tab-wrapper`},this.internalLeftPadded?i("div",{class:`${n}-tabs-tab-pad`}):null,i("div",Object.assign({key:b,"data-name":b,"data-disabled":y?!0:void 0},it({class:[`${n}-tabs-tab`,u===b&&`${n}-tabs-tab--active`,y&&`${n}-tabs-tab--disabled`,w&&`${n}-tabs-tab--closable`,e&&`${n}-tabs-tab--addable`],onClick:C==="click"?this.activateTab:void 0,onMouseenter:C==="hover"?this.activateTab:void 0,style:e?void 0:m},this.internalCreatedByPane?this.tabProps||{}:this.$attrs)),i("span",{class:`${n}-tabs-tab__label`},e?i(lt,null,i("div",{class:`${n}-tabs-tab__height-placeholder`},"\xA0"),i(xt,{clsPrefix:n},{default:()=>i(yt,null)})):z?z():typeof p=="object"?p:Ct(p!=null?p:b)),w&&this.type==="card"?i(Rt,{clsPrefix:n,class:`${n}-tabs-tab__close`,onClick:this.handleClose,disabled:y}):null))}}),_t=r("tabs",`
 box-sizing: border-box;
 width: 100%;
 display: flex;
 flex-direction: column;
 transition:
 background-color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
`,[c("segment-type",[r("tabs-rail",[x("&.transition-disabled","color: red;",[r("tabs-tab",`
 transition: none;
 `)])])]),c("left, right",`
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
 `)]),c("right",`
 flex-direction: row-reverse;
 `,[r("tabs-bar",`
 left: 0;
 `)]),c("bottom",`
 flex-direction: column-reverse;
 justify-content: flex-end;
 `,[r("tabs-bar",`
 top: 0;
 `)]),r("tabs-rail",`
 padding: 3px;
 border-radius: var(--n-tab-border-radius);
 width: 100%;
 background-color: var(--n-color-segment);
 transition: background-color .3s var(--n-bezier);
 display: flex;
 align-items: center;
 `,[r("tabs-tab-wrapper",`
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
 `,[c("active",`
 font-weight: var(--n-font-weight-strong);
 color: var(--n-tab-text-color-active);
 background-color: var(--n-tab-color-segment);
 box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .08);
 `),x("&:hover",`
 color: var(--n-tab-text-color-hover);
 `)])])]),c("flex",[r("tabs-nav",{width:"100%"},[r("tabs-wrapper",{width:"100%"},[r("tabs-tab",{marginRight:0})])])]),r("tabs-nav",`
 box-sizing: border-box;
 line-height: 1.5;
 display: flex;
 transition: border-color .3s var(--n-bezier);
 `,[A("prefix, suffix",`
 display: flex;
 align-items: center;
 `),A("prefix","padding-right: 16px;"),A("suffix","padding-left: 16px;")]),r("tabs-nav-scroll-wrapper",`
 flex: 1;
 position: relative;
 overflow: hidden;
 `,[c("shadow-before",[x("&::before",`
 box-shadow: inset 10px 0 8px -8px rgba(0, 0, 0, .12);
 `)]),c("shadow-after",[x("&::after",`
 box-shadow: inset -10px 0 8px -8px rgba(0, 0, 0, .12);
 `)]),r("tabs-nav-y-scroll",`
 height: 100%;
 width: 100%;
 overflow-y: auto; 
 scrollbar-width: none;
 `,[x("&::-webkit-scrollbar",`
 width: 0;
 height: 0;
 `)]),x("&::before, &::after",`
 transition: box-shadow .3s var(--n-bezier);
 pointer-events: none;
 content: "";
 position: absolute;
 top: 0;
 bottom: 0;
 width: 20px;
 z-index: 1;
 `),x("&::before",`
 left: 0;
 `),x("&::after",`
 right: 0;
 `)]),r("tabs-nav-scroll-content",`
 display: flex;
 position: relative;
 min-width: 100%;
 width: fit-content;
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
 `,[c("disabled",{cursor:"not-allowed"}),A("close",`
 margin-left: 6px;
 transition:
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 `),A("label",`
 display: flex;
 align-items: center;
 `)]),r("tabs-bar",`
 position: absolute;
 bottom: 0;
 height: 2px;
 border-radius: 1px;
 background-color: var(--n-bar-color);
 transition:
 left .2s var(--n-bezier),
 max-width .2s var(--n-bezier),
 background-color .3s var(--n-bezier);
 `,[x("&.transition-disabled",`
 transition: none;
 `),c("disabled",`
 background-color: var(--n-tab-text-color-disabled)
 `)]),r("tabs-pane-wrapper",`
 position: relative;
 overflow: hidden;
 transition: max-height .2s var(--n-bezier);
 `),r("tab-pane",`
 color: var(--n-pane-text-color);
 width: 100%;
 padding: var(--n-pane-padding);
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 opacity .2s var(--n-bezier);
 left: 0;
 right: 0;
 top: 0;
 `,[x("&.next-transition-leave-active, &.prev-transition-leave-active, &.next-transition-enter-active, &.prev-transition-enter-active",`
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 transform .2s var(--n-bezier),
 opacity .2s var(--n-bezier);
 `),x("&.next-transition-leave-active, &.prev-transition-leave-active",`
 position: absolute;
 `),x("&.next-transition-enter-from, &.prev-transition-leave-to",`
 transform: translateX(32px);
 opacity: 0;
 `),x("&.next-transition-leave-to, &.prev-transition-enter-from",`
 transform: translateX(-32px);
 opacity: 0;
 `),x("&.next-transition-leave-from, &.next-transition-enter-to, &.prev-transition-leave-from, &.prev-transition-enter-to",`
 transform: translateX(0);
 opacity: 1;
 `)]),r("tabs-tab-pad",`
 width: var(--n-tab-gap);
 flex-grow: 0;
 flex-shrink: 0;
 `),c("line-type, bar-type",[r("tabs-tab",`
 font-weight: var(--n-tab-font-weight);
 box-sizing: border-box;
 vertical-align: bottom;
 `,[x("&:hover",{color:"var(--n-tab-text-color-hover)"}),c("active",`
 color: var(--n-tab-text-color-active);
 font-weight: var(--n-tab-font-weight-active);
 `),c("disabled",{color:"var(--n-tab-text-color-disabled)"})])]),r("tabs-nav",[c("line-type",[A("prefix, suffix",`
 transition: border-color .3s var(--n-bezier);
 border-bottom: 1px solid var(--n-tab-border-color);
 `),r("tabs-nav-scroll-content",`
 transition: border-color .3s var(--n-bezier);
 border-bottom: 1px solid var(--n-tab-border-color);
 `),r("tabs-bar",`
 border-radius: 0;
 bottom: -1px;
 `)]),c("card-type",[A("prefix, suffix",`
 transition: border-color .3s var(--n-bezier);
 border-bottom: 1px solid var(--n-tab-border-color);
 `),r("tabs-pad",`
 flex-grow: 1;
 transition: border-color .3s var(--n-bezier);
 border-bottom: 1px solid var(--n-tab-border-color);
 `),r("tabs-tab-pad",`
 transition: border-color .3s var(--n-bezier);
 border-bottom: 1px solid var(--n-tab-border-color);
 `),r("tabs-tab",`
 font-weight: var(--n-tab-font-weight);
 border: 1px solid var(--n-tab-border-color);
 border-top-left-radius: var(--n-tab-border-radius);
 border-top-right-radius: var(--n-tab-border-radius);
 background-color: var(--n-tab-color);
 box-sizing: border-box;
 position: relative;
 vertical-align: bottom;
 display: flex;
 justify-content: space-between;
 font-size: var(--n-tab-font-size);
 color: var(--n-tab-text-color);
 `,[c("addable",`
 padding-left: 8px;
 padding-right: 8px;
 font-size: 16px;
 `,[A("height-placeholder",`
 width: 0;
 font-size: var(--n-tab-font-size);
 `),dt("disabled",[x("&:hover",`
 color: var(--n-tab-text-color-hover);
 `)])]),c("closable","padding-right: 6px;"),c("active",`
 border-bottom: 1px solid #0000;
 background-color: #0000;
 font-weight: var(--n-tab-font-weight-active);
 color: var(--n-tab-text-color-active);
 `),c("disabled","color: var(--n-tab-text-color-disabled);")]),r("tabs-scroll-padding","border-bottom: 1px solid var(--n-tab-border-color);")]),c("left, right",[r("tabs-wrapper",`
 flex-direction: column;
 `,[r("tabs-tab-wrapper",`
 flex-direction: column;
 `,[r("tabs-tab-pad",`
 height: var(--n-tab-gap);
 width: 100%;
 `)])]),r("tabs-nav-scroll-content",`
 border-bottom: none;
 `)]),c("left",[r("tabs-nav-scroll-content",`
 box-sizing: border-box;
 border-right: 1px solid var(--n-tab-border-color);
 `)]),c("right",[r("tabs-nav-scroll-content",`
 border-left: 1px solid var(--n-tab-border-color);
 `)]),c("bottom",[r("tabs-nav-scroll-content",`
 border-top: 1px solid var(--n-tab-border-color);
 border-bottom: none;
 `)])])]),At=Object.assign(Object.assign({},ge.props),{value:[String,Number],defaultValue:[String,Number],trigger:{type:String,default:"click"},type:{type:String,default:"bar"},closable:Boolean,justifyContent:String,size:{type:String,default:"medium"},placement:{type:String,default:"top"},tabStyle:[String,Object],barWidth:Number,paneClass:String,paneStyle:[String,Object],addable:[Boolean,Object],tabsPadding:{type:Number,default:0},animated:Boolean,onBeforeLeave:Function,onAdd:Function,"onUpdate:value":[Function,Array],onUpdateValue:[Function,Array],onClose:[Function,Array],labelSize:String,activeName:[String,Number],onActiveNameChange:[Function,Array]}),It=V({name:"Tabs",props:At,setup(e,{slots:n}){var b,y,l,g;const{mergedClsPrefixRef:u,inlineThemeDisabled:w}=ct(e),m=ge("Tabs","-tabs",_t,bt,e,u),C=S(null),z=S(null),p=S(null),f=S(null),R=S(null),h=S(!0),L=S(!0),$=be(e,["labelSize","size"]),O=be(e,["activeName","value"]),d=S((y=(b=O.value)!==null&&b!==void 0?b:e.defaultValue)!==null&&y!==void 0?y:n.default?(g=(l=G(n.default())[0])===null||l===void 0?void 0:l.props)===null||g===void 0?void 0:g.name:null),v=St(O,d),k={id:0},xe=N(()=>{if(!(!e.justifyContent||e.type==="card"))return{display:"flex",justifyContent:e.justifyContent}});K(v,()=>{k.id=0,F(),ae()});function U(){var t;const{value:a}=v;return a===null?null:(t=C.value)===null||t===void 0?void 0:t.querySelector(`[data-name="${a}"]`)}function ye(t){if(e.type==="card")return;const{value:a}=z;if(!!a&&t){const o=`${u.value}-tabs-bar--disabled`,{barWidth:s,placement:T}=e;if(t.dataset.disabled==="true"?a.classList.add(o):a.classList.remove(o),["top","bottom"].includes(T)){if(te(["top","maxHeight","height"]),typeof s=="number"&&t.offsetWidth>=s){const P=Math.floor((t.offsetWidth-s)/2)+t.offsetLeft;a.style.left=`${P}px`,a.style.maxWidth=`${s}px`}else a.style.left=`${t.offsetLeft}px`,a.style.maxWidth=`${t.offsetWidth}px`;a.style.width="8192px",a.offsetWidth}else{if(te(["left","maxWidth","width"]),typeof s=="number"&&t.offsetHeight>=s){const P=Math.floor((t.offsetHeight-s)/2)+t.offsetTop;a.style.top=`${P}px`,a.style.maxHeight=`${s}px`}else a.style.top=`${t.offsetTop}px`,a.style.maxHeight=`${t.offsetHeight}px`;a.style.height="8192px",a.offsetHeight}}}function te(t){const{value:a}=z;if(!!a)for(const o of t)a.style[o]=""}function F(){if(e.type==="card")return;const t=U();t&&ye(t)}function ae(t){var a;const o=(a=R.value)===null||a===void 0?void 0:a.$el;if(!o)return;const s=U();if(!s)return;const{scrollLeft:T,offsetWidth:P}=o,{offsetLeft:E,offsetWidth:D}=s;T>E?o.scrollTo({top:0,left:E,behavior:"smooth"}):E+D>T+P&&o.scrollTo({top:0,left:E+D-P,behavior:"smooth"})}const H=S(null);let X=0,_=null;function we(t){const a=H.value;if(a){X=t.getBoundingClientRect().height;const o=`${X}px`,s=()=>{a.style.height=o,a.style.maxHeight=o};_?(s(),_(),_=null):_=s}}function Ce(t){const a=H.value;if(a){const o=t.getBoundingClientRect().height,s=()=>{document.body.offsetHeight,a.style.maxHeight=`${o}px`,a.style.height=`${Math.max(X,o)}px`};_?(_(),_=null,s()):_=s}}function Re(){const t=H.value;t&&(t.style.maxHeight="",t.style.height="")}const re={value:[]},ne=S("next");function ze(t){const a=v.value;let o="next";for(const s of re.value){if(s===a)break;if(s===t){o="prev";break}}ne.value=o,Se(t)}function Se(t){const{onActiveNameChange:a,onUpdateValue:o,"onUpdate:value":s}=e;a&&M(a,t),o&&M(o,t),s&&M(s,t),d.value=t}function $e(t){const{onClose:a}=e;a&&M(a,t)}function oe(){const{value:t}=z;if(!t)return;const a="transition-disabled";t.classList.add(a),F(),t.classList.remove(a)}let se=0;function Pe(t){var a;if(t.contentRect.width===0&&t.contentRect.height===0||se===t.contentRect.width)return;se=t.contentRect.width;const{type:o}=e;(o==="line"||o==="bar")&&oe(),o!=="segment"&&q((a=R.value)===null||a===void 0?void 0:a.$el)}const Te=J(Pe,64);K([()=>e.justifyContent,()=>e.size],()=>{Y(()=>{const{type:t}=e;(t==="line"||t==="bar")&&oe()})});const I=S(!1);function We(t){var a;const{target:o,contentRect:{width:s}}=t,T=o.parentElement.offsetWidth;if(!I.value)T<s&&(I.value=!0);else{const{value:P}=f;if(!P)return;T-s>P.$el.offsetWidth&&(I.value=!1)}q((a=R.value)===null||a===void 0?void 0:a.$el)}const _e=J(We,64);function Ae(){const{onAdd:t}=e;t&&t(),Y(()=>{const a=U(),{value:o}=R;!a||!o||o.scrollTo({left:a.offsetLeft,top:0,behavior:"smooth"})})}function q(t){if(!t)return;const{scrollLeft:a,scrollWidth:o,offsetWidth:s}=t;h.value=a<=0,L.value=a+s>=o}const Le=J(t=>{q(t.target)},64);ft(ee,{triggerRef:B(e,"trigger"),tabStyleRef:B(e,"tabStyle"),paneClassRef:B(e,"paneClass"),paneStyleRef:B(e,"paneStyle"),mergedClsPrefixRef:u,typeRef:B(e,"type"),closableRef:B(e,"closable"),valueRef:v,tabChangeIdRef:k,onBeforeLeaveRef:B(e,"onBeforeLeave"),activateTab:ze,handleClose:$e,handleAdd:Ae}),$t(()=>{F(),ae()}),ut(()=>{const{value:t}=p;if(!t||["left","right"].includes(e.placement))return;const{value:a}=u,o=`${a}-tabs-nav-scroll-wrapper--shadow-before`,s=`${a}-tabs-nav-scroll-wrapper--shadow-after`;h.value?t.classList.remove(o):t.classList.add(o),L.value?t.classList.remove(s):t.classList.add(s)});const ie=S(null);K(v,()=>{if(e.type==="segment"){const t=ie.value;t&&Y(()=>{t.classList.add("transition-disabled"),t.offsetWidth,t.classList.remove("transition-disabled")})}});const Be={syncBarPosition:()=>{F()}},le=N(()=>{const{value:t}=$,{type:a}=e,o={card:"Card",bar:"Bar",line:"Line",segment:"Segment"}[a],s=`${t}${o}`,{self:{barColor:T,closeIconColor:P,closeIconColorHover:E,closeIconColorPressed:D,tabColor:ke,tabBorderColor:je,paneTextColor:Ee,tabFontWeight:Oe,tabBorderRadius:Fe,tabFontWeightActive:He,colorSegment:Ie,fontWeightStrong:De,tabColorSegment:Me,closeSize:Ne,closeIconSize:Ve,closeColorHover:Ue,closeColorPressed:Xe,closeBorderRadius:qe,[W("panePadding",t)]:Ke,[W("tabPadding",s)]:Ye,[W("tabPaddingVertical",s)]:Ge,[W("tabGap",s)]:Je,[W("tabTextColor",a)]:Qe,[W("tabTextColorActive",a)]:Ze,[W("tabTextColorHover",a)]:et,[W("tabTextColorDisabled",a)]:tt,[W("tabFontSize",t)]:at},common:{cubicBezierEaseInOut:rt}}=m.value;return{"--n-bezier":rt,"--n-color-segment":Ie,"--n-bar-color":T,"--n-tab-font-size":at,"--n-tab-text-color":Qe,"--n-tab-text-color-active":Ze,"--n-tab-text-color-disabled":tt,"--n-tab-text-color-hover":et,"--n-pane-text-color":Ee,"--n-tab-border-color":je,"--n-tab-border-radius":Fe,"--n-close-size":Ne,"--n-close-icon-size":Ve,"--n-close-color-hover":Ue,"--n-close-color-pressed":Xe,"--n-close-border-radius":qe,"--n-close-icon-color":P,"--n-close-icon-color-hover":E,"--n-close-icon-color-pressed":D,"--n-tab-color":ke,"--n-tab-font-weight":Oe,"--n-tab-font-weight-active":He,"--n-tab-padding":Ye,"--n-tab-padding-vertical":Ge,"--n-tab-gap":Je,"--n-pane-padding":Ke,"--n-font-weight-strong":De,"--n-tab-color-segment":Me}}),j=w?vt("tabs",N(()=>`${$.value[0]}${e.type[0]}`),le,e):void 0;return Object.assign({mergedClsPrefix:u,mergedValue:v,renderedNames:new Set,tabsRailElRef:ie,tabsPaneWrapperRef:H,tabsElRef:C,barElRef:z,addTabInstRef:f,xScrollInstRef:R,scrollWrapperElRef:p,addTabFixed:I,tabWrapperStyle:xe,handleNavResize:Te,mergedSize:$,handleScroll:Le,handleTabsResize:_e,cssVars:w?void 0:le,themeClass:j==null?void 0:j.themeClass,animationDirection:ne,renderNameListRef:re,onAnimationBeforeLeave:we,onAnimationEnter:Ce,onAnimationAfterEnter:Re,onRender:j==null?void 0:j.onRender},Be)},render(){const{mergedClsPrefix:e,type:n,placement:b,addTabFixed:y,addable:l,mergedSize:g,renderNameListRef:u,onRender:w,$slots:{default:m,prefix:C,suffix:z}}=this;w==null||w();const p=m?G(m()).filter(d=>d.type.__TAB_PANE__===!0):[],f=m?G(m()).filter(d=>d.type.__TAB__===!0):[],R=!f.length,h=n==="card",L=n==="segment",$=!h&&!L&&this.justifyContent;u.value=[];const O=()=>{const d=i("div",{style:this.tabWrapperStyle,class:[`${e}-tabs-wrapper`]},$?null:i("div",{class:`${e}-tabs-scroll-padding`,style:{width:`${this.tabsPadding}px`}}),R?p.map((v,k)=>(u.value.push(v.props.name),Q(i(Z,Object.assign({},v.props,{internalCreatedByPane:!0,internalLeftPadded:k!==0&&(!$||$==="center"||$==="start"||$==="end")}),v.children?{default:v.children.tab}:void 0)))):f.map((v,k)=>(u.value.push(v.props.name),Q(k!==0&&!$?pe(v):v))),!y&&l&&h?ve(l,(R?p.length:f.length)!==0):null,$?null:i("div",{class:`${e}-tabs-scroll-padding`,style:{width:`${this.tabsPadding}px`}}));return i("div",{ref:"tabsElRef",class:`${e}-tabs-nav-scroll-content`},h&&l?i(fe,{onResize:this.handleTabsResize},{default:()=>d}):d,h?i("div",{class:`${e}-tabs-pad`}):null,h?null:i("div",{ref:"barElRef",class:`${e}-tabs-bar`}))};return i("div",{class:[`${e}-tabs`,this.themeClass,`${e}-tabs--${n}-type`,`${e}-tabs--${g}-size`,$&&`${e}-tabs--flex`,`${e}-tabs--${b}`],style:this.cssVars},i("div",{class:[`${e}-tabs-nav--${n}-type`,`${e}-tabs-nav--${b}`,`${e}-tabs-nav`]},de(C,d=>d&&i("div",{class:`${e}-tabs-nav__prefix`},d)),L?i("div",{class:`${e}-tabs-rail`,ref:"tabsRailElRef"},R?p.map((d,v)=>(u.value.push(d.props.name),i(Z,Object.assign({},d.props,{internalCreatedByPane:!0,internalLeftPadded:v!==0}),d.children?{default:d.children.tab}:void 0))):f.map((d,v)=>(u.value.push(d.props.name),v===0?d:pe(d)))):i(fe,{onResize:this.handleNavResize},{default:()=>i("div",{class:`${e}-tabs-nav-scroll-wrapper`,ref:"scrollWrapperElRef"},["top","bottom"].includes(b)?i(Tt,{ref:"xScrollInstRef",onScroll:this.handleScroll},{default:O}):i("div",{class:`${e}-tabs-nav-y-scroll`},O()))}),y&&l&&h?ve(l,!0):null,de(z,d=>d&&i("div",{class:`${e}-tabs-nav__suffix`},d))),R&&(this.animated?i("div",{ref:"tabsPaneWrapperRef",class:`${e}-tabs-pane-wrapper`},ue(p,this.mergedValue,this.renderedNames,this.onAnimationBeforeLeave,this.onAnimationEnter,this.onAnimationAfterEnter,this.animationDirection)):ue(p,this.mergedValue,this.renderedNames)))}});function ue(e,n,b,y,l,g,u){const w=[];return e.forEach(m=>{const{name:C,displayDirective:z,"display-directive":p}=m.props,f=h=>z===h||p===h,R=n===C;if(m.key!==void 0&&(m.key=C),R||f("show")||f("show:lazy")&&b.has(C)){b.has(C)||b.add(C);const h=!f("if");w.push(h?pt(m,[[mt,R]]):m)}}),u?i(ht,{name:`${u}-transition`,onBeforeLeave:y,onEnter:l,onAfterEnter:g},{default:()=>w}):w}function ve(e,n){return i(Z,{ref:"addTabInstRef",key:"__addable",name:"__addable",internalCreatedByPane:!0,internalAddable:!0,internalLeftPadded:n,disabled:typeof e=="object"&&e.disabled})}function pe(e){const n=gt(e);return n.props?n.props.internalLeftPadded=!0:n.props={internalLeftPadded:!0},n}function Q(e){return Array.isArray(e.dynamicProps)?e.dynamicProps.includes("internalLeftPadded")||e.dynamicProps.push("internalLeftPadded"):e.dynamicProps=["internalLeftPadded"],e}export{It as N,Ht as a};
