import{e as de,b as v,f as x,h as Ke,d as te,i as Xe,ah as Fe,ab as Ze,A as h,ae as ne,l as F,a6 as Oe,N as St,aJ as Rt,ai as et,t as r,a7 as Mt,ag as Pt,aQ as He,aG as It,bp as _t,aR as Bt}from"./DtwXQcKw.js";import{p as je,f as zt,c as $t,a as kt}from"./BMwUx3Op.js";import{f as At}from"./BchobC78.js";import{u as qe}from"./CLX7D053.js";import{u as Et}from"./Bn7Tj-VX.js";import{u as Dt}from"./DvfDEnO2.js";import{u as Vt}from"./D9DVsfIe.js";import{i as Wt}from"./CVtA2A93.js";import{u as Ue,B as jt,a as Lt,V as Nt}from"./Codpw64D.js";import{u as Ut,g as Ge,c as N}from"./Dzhi6kJb.js";import{i as Kt,a as Ht}from"./C6U16tc_.js";import{a as qt}from"./DwC-jnz1.js";import{W as Gt,c as Je,g as Jt}from"./D7-7OZS7.js";import{N as Le}from"./DG7oZ1Oy.js";import{V as Qe}from"./uVf42694.js";import{N as Qt}from"./D-ftpDwv.js";import{r as Ce}from"./BzwZr-mA.js";import{g as Ye}from"./Cz32yFEB.js";import{u as Yt,N as Xt}from"./D-T0dVO8.js";import{c as Zt}from"./KdGHD0sL.js";import{h as Ne}from"./CM8LO42l.js";import{m as en}from"./DsSU6HIH.js";const tn=de([v("base-selection",`
 --n-padding-single: var(--n-padding-single-top) var(--n-padding-single-right) var(--n-padding-single-bottom) var(--n-padding-single-left);
 --n-padding-multiple: var(--n-padding-multiple-top) var(--n-padding-multiple-right) var(--n-padding-multiple-bottom) var(--n-padding-multiple-left);
 position: relative;
 z-index: auto;
 box-shadow: none;
 width: 100%;
 max-width: 100%;
 display: inline-block;
 vertical-align: bottom;
 border-radius: var(--n-border-radius);
 min-height: var(--n-height);
 line-height: 1.5;
 font-size: var(--n-font-size);
 `,[v("base-loading",`
 color: var(--n-loading-color);
 `),v("base-selection-tags","min-height: var(--n-height);"),x("border, state-border",`
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 pointer-events: none;
 border: var(--n-border);
 border-radius: inherit;
 transition:
 box-shadow .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 `),x("state-border",`
 z-index: 1;
 border-color: #0000;
 `),v("base-suffix",`
 cursor: pointer;
 position: absolute;
 top: 50%;
 transform: translateY(-50%);
 right: 10px;
 `,[x("arrow",`
 font-size: var(--n-arrow-size);
 color: var(--n-arrow-color);
 transition: color .3s var(--n-bezier);
 `)]),v("base-selection-overlay",`
 display: flex;
 align-items: center;
 white-space: nowrap;
 pointer-events: none;
 position: absolute;
 top: 0;
 right: 0;
 bottom: 0;
 left: 0;
 padding: var(--n-padding-single);
 transition: color .3s var(--n-bezier);
 `,[x("wrapper",`
 flex-basis: 0;
 flex-grow: 1;
 overflow: hidden;
 text-overflow: ellipsis;
 `)]),v("base-selection-placeholder",`
 color: var(--n-placeholder-color);
 `,[x("inner",`
 max-width: 100%;
 overflow: hidden;
 `)]),v("base-selection-tags",`
 cursor: pointer;
 outline: none;
 box-sizing: border-box;
 position: relative;
 z-index: auto;
 display: flex;
 padding: var(--n-padding-multiple);
 flex-wrap: wrap;
 align-items: center;
 width: 100%;
 vertical-align: bottom;
 background-color: var(--n-color);
 border-radius: inherit;
 transition:
 color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 `),v("base-selection-label",`
 height: var(--n-height);
 display: inline-flex;
 width: 100%;
 vertical-align: bottom;
 cursor: pointer;
 outline: none;
 z-index: auto;
 box-sizing: border-box;
 position: relative;
 transition:
 color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 border-radius: inherit;
 background-color: var(--n-color);
 align-items: center;
 `,[v("base-selection-input",`
 font-size: inherit;
 line-height: inherit;
 outline: none;
 cursor: pointer;
 box-sizing: border-box;
 border:none;
 width: 100%;
 padding: var(--n-padding-single);
 background-color: #0000;
 color: var(--n-text-color);
 transition: color .3s var(--n-bezier);
 caret-color: var(--n-caret-color);
 `,[x("content",`
 text-overflow: ellipsis;
 overflow: hidden;
 white-space: nowrap; 
 `)]),x("render-label",`
 color: var(--n-text-color);
 `)]),Ke("disabled",[de("&:hover",[x("state-border",`
 box-shadow: var(--n-box-shadow-hover);
 border: var(--n-border-hover);
 `)]),te("focus",[x("state-border",`
 box-shadow: var(--n-box-shadow-focus);
 border: var(--n-border-focus);
 `)]),te("active",[x("state-border",`
 box-shadow: var(--n-box-shadow-active);
 border: var(--n-border-active);
 `),v("base-selection-label","background-color: var(--n-color-active);"),v("base-selection-tags","background-color: var(--n-color-active);")])]),te("disabled","cursor: not-allowed;",[x("arrow",`
 color: var(--n-arrow-color-disabled);
 `),v("base-selection-label",`
 cursor: not-allowed;
 background-color: var(--n-color-disabled);
 `,[v("base-selection-input",`
 cursor: not-allowed;
 color: var(--n-text-color-disabled);
 `),x("render-label",`
 color: var(--n-text-color-disabled);
 `)]),v("base-selection-tags",`
 cursor: not-allowed;
 background-color: var(--n-color-disabled);
 `),v("base-selection-placeholder",`
 cursor: not-allowed;
 color: var(--n-placeholder-color-disabled);
 `)]),v("base-selection-input-tag",`
 height: calc(var(--n-height) - 6px);
 line-height: calc(var(--n-height) - 6px);
 outline: none;
 display: none;
 position: relative;
 margin-bottom: 3px;
 max-width: 100%;
 vertical-align: bottom;
 `,[x("input",`
 font-size: inherit;
 font-family: inherit;
 min-width: 1px;
 padding: 0;
 background-color: #0000;
 outline: none;
 border: none;
 max-width: 100%;
 overflow: hidden;
 width: 1em;
 line-height: inherit;
 cursor: pointer;
 color: var(--n-text-color);
 caret-color: var(--n-caret-color);
 `),x("mirror",`
 position: absolute;
 left: 0;
 top: 0;
 white-space: pre;
 visibility: hidden;
 user-select: none;
 -webkit-user-select: none;
 opacity: 0;
 `)]),["warning","error"].map(e=>te(`${e}-status`,[x("state-border",`border: var(--n-border-${e});`),Ke("disabled",[de("&:hover",[x("state-border",`
 box-shadow: var(--n-box-shadow-hover-${e});
 border: var(--n-border-hover-${e});
 `)]),te("active",[x("state-border",`
 box-shadow: var(--n-box-shadow-active-${e});
 border: var(--n-border-active-${e});
 `),v("base-selection-label",`background-color: var(--n-color-active-${e});`),v("base-selection-tags",`background-color: var(--n-color-active-${e});`)]),te("focus",[x("state-border",`
 box-shadow: var(--n-box-shadow-focus-${e});
 border: var(--n-border-focus-${e});
 `)])])]))]),v("base-selection-popover",`
 margin-bottom: -3px;
 display: flex;
 flex-wrap: wrap;
 margin-right: -8px;
 `),v("base-selection-tag-wrapper",`
 max-width: 100%;
 display: inline-flex;
 padding: 0 7px 3px 0;
 `,[de("&:last-child","padding-right: 0;"),v("tag",`
 font-size: 14px;
 max-width: 100%;
 `,[x("content",`
 line-height: 1.25;
 text-overflow: ellipsis;
 overflow: hidden;
 `)])])]),nn=Xe({name:"InternalSelection",props:Object.assign(Object.assign({},Fe.props),{clsPrefix:{type:String,required:!0},bordered:{type:Boolean,default:void 0},active:Boolean,pattern:{type:String,default:""},placeholder:String,selectedOption:{type:Object,default:null},selectedOptions:{type:Array,default:null},labelField:{type:String,default:"label"},valueField:{type:String,default:"value"},multiple:Boolean,filterable:Boolean,clearable:Boolean,disabled:Boolean,size:{type:String,default:"medium"},loading:Boolean,autofocus:Boolean,showArrow:{type:Boolean,default:!0},inputProps:Object,focused:Boolean,renderTag:Function,onKeydown:Function,onClick:Function,onBlur:Function,onFocus:Function,onDeleteOption:Function,maxTagCount:[String,Number],ellipsisTagPopoverProps:Object,onClear:Function,onPatternInput:Function,onPatternFocus:Function,onPatternBlur:Function,renderLabel:Function,status:String,inlineThemeDisabled:Boolean,ignoreComposition:{type:Boolean,default:!0},onResize:Function}),setup(e){const{mergedClsPrefixRef:T,mergedRtlRef:z}=Ze(e),b=Ut("InternalSelection",z,T),f=h(null),S=h(null),$=h(null),i=h(null),k=h(null),M=h(null),O=h(null),I=h(null),y=h(null),C=h(null),A=h(!1),_=h(!1),W=h(!1),E=Fe("InternalSelection","-internal-selection",tn,Kt,e,ne(e,"clsPrefix")),B=F(()=>e.clearable&&!e.disabled&&(W.value||e.active)),P=F(()=>e.selectedOption?e.renderTag?e.renderTag({option:e.selectedOption,handleClose:()=>{}}):e.renderLabel?e.renderLabel(e.selectedOption,!0):Ce(e.selectedOption[e.labelField],e.selectedOption,!0):e.placeholder),R=F(()=>{const n=e.selectedOption;if(n)return n[e.labelField]}),p=F(()=>e.multiple?!!(Array.isArray(e.selectedOptions)&&e.selectedOptions.length):e.selectedOption!==null);function U(){var n;const{value:l}=f;if(l){const{value:g}=S;g&&(g.style.width=`${l.offsetWidth}px`,e.maxTagCount!=="responsive"&&((n=y.value)===null||n===void 0||n.sync({showAllItemsBeforeCalculate:!1})))}}function j(){const{value:n}=C;n&&(n.style.display="none")}function oe(){const{value:n}=C;n&&(n.style.display="inline-block")}Oe(ne(e,"active"),n=>{n||j()}),Oe(ne(e,"pattern"),()=>{e.multiple&&Pt(U)});function le(n){const{onFocus:l}=e;l&&l(n)}function K(n){const{onBlur:l}=e;l&&l(n)}function H(n){const{onDeleteOption:l}=e;l&&l(n)}function J(n){const{onClear:l}=e;l&&l(n)}function m(n){const{onPatternInput:l}=e;l&&l(n)}function ue(n){var l;(!n.relatedTarget||!(!((l=$.value)===null||l===void 0)&&l.contains(n.relatedTarget)))&&le(n)}function ce(n){var l;!((l=$.value)===null||l===void 0)&&l.contains(n.relatedTarget)||K(n)}function X(n){J(n)}function Te(){W.value=!0}function Z(){W.value=!1}function Se(n){!e.active||!e.filterable||n.target!==S.value&&n.preventDefault()}function Q(n){H(n)}const q=h(!1);function Re(n){if(n.key==="Backspace"&&!q.value&&!e.pattern.length){const{selectedOptions:l}=e;l!=null&&l.length&&Q(l[l.length-1])}}let ie=null;function Me(n){const{value:l}=f;if(l){const g=n.target.value;l.textContent=g,U()}e.ignoreComposition&&q.value?ie=n:m(n)}function Pe(){q.value=!0}function he(){q.value=!1,e.ignoreComposition&&m(ie),ie=null}function fe(n){var l;_.value=!0,(l=e.onPatternFocus)===null||l===void 0||l.call(e,n)}function Y(n){var l;_.value=!1,(l=e.onPatternBlur)===null||l===void 0||l.call(e,n)}function D(){var n,l;if(e.filterable)_.value=!1,(n=M.value)===null||n===void 0||n.blur(),(l=S.value)===null||l===void 0||l.blur();else if(e.multiple){const{value:g}=i;g==null||g.blur()}else{const{value:g}=k;g==null||g.blur()}}function ve(){var n,l,g;e.filterable?(_.value=!1,(n=M.value)===null||n===void 0||n.focus()):e.multiple?(l=i.value)===null||l===void 0||l.focus():(g=k.value)===null||g===void 0||g.focus()}function ee(){const{value:n}=S;n&&(oe(),n.focus())}function Ie(){const{value:n}=S;n&&n.blur()}function _e(n){const{value:l}=O;l&&l.setTextContent(`+${n}`)}function Be(){const{value:n}=I;return n}function ze(){return S.value}let ae=null;function re(){ae!==null&&window.clearTimeout(ae)}function $e(){e.active||(re(),ae=window.setTimeout(()=>{p.value&&(A.value=!0)},100))}function ke(){re()}function Ae(n){n||(re(),A.value=!1)}Oe(p,n=>{n||(A.value=!1)}),St(()=>{Rt(()=>{const n=M.value;n&&(e.disabled?n.removeAttribute("tabindex"):n.tabIndex=_.value?-1:0)})}),Yt($,e.onResize);const{inlineThemeDisabled:be}=e,se=F(()=>{const{size:n}=e,{common:{cubicBezierEaseInOut:l},self:{borderRadius:g,color:Ee,placeholderColor:De,textColor:ge,paddingSingle:pe,paddingMultiple:me,caretColor:Ve,colorDisabled:We,textColorDisabled:we,placeholderColorDisabled:G,colorActive:t,boxShadowFocus:o,boxShadowActive:a,boxShadowHover:c,border:d,borderFocus:s,borderHover:u,borderActive:w,arrowColor:L,arrowColorDisabled:tt,loadingColor:nt,colorActiveWarning:ot,boxShadowFocusWarning:lt,boxShadowActiveWarning:it,boxShadowHoverWarning:at,borderWarning:rt,borderFocusWarning:st,borderHoverWarning:dt,borderActiveWarning:ut,colorActiveError:ct,boxShadowFocusError:ht,boxShadowActiveError:ft,boxShadowHoverError:vt,borderError:bt,borderFocusError:gt,borderHoverError:pt,borderActiveError:mt,clearColor:wt,clearColorHover:xt,clearColorPressed:yt,clearSize:Ct,arrowSize:Ot,[He("height",n)]:Ft,[He("fontSize",n)]:Tt}}=E.value,xe=Ge(pe),ye=Ge(me);return{"--n-bezier":l,"--n-border":d,"--n-border-active":w,"--n-border-focus":s,"--n-border-hover":u,"--n-border-radius":g,"--n-box-shadow-active":a,"--n-box-shadow-focus":o,"--n-box-shadow-hover":c,"--n-caret-color":Ve,"--n-color":Ee,"--n-color-active":t,"--n-color-disabled":We,"--n-font-size":Tt,"--n-height":Ft,"--n-padding-single-top":xe.top,"--n-padding-multiple-top":ye.top,"--n-padding-single-right":xe.right,"--n-padding-multiple-right":ye.right,"--n-padding-single-left":xe.left,"--n-padding-multiple-left":ye.left,"--n-padding-single-bottom":xe.bottom,"--n-padding-multiple-bottom":ye.bottom,"--n-placeholder-color":De,"--n-placeholder-color-disabled":G,"--n-text-color":ge,"--n-text-color-disabled":we,"--n-arrow-color":L,"--n-arrow-color-disabled":tt,"--n-loading-color":nt,"--n-color-active-warning":ot,"--n-box-shadow-focus-warning":lt,"--n-box-shadow-active-warning":it,"--n-box-shadow-hover-warning":at,"--n-border-warning":rt,"--n-border-focus-warning":st,"--n-border-hover-warning":dt,"--n-border-active-warning":ut,"--n-color-active-error":ct,"--n-box-shadow-focus-error":ht,"--n-box-shadow-active-error":ft,"--n-box-shadow-hover-error":vt,"--n-border-error":bt,"--n-border-focus-error":gt,"--n-border-hover-error":pt,"--n-border-active-error":mt,"--n-clear-size":Ct,"--n-clear-color":wt,"--n-clear-color-hover":xt,"--n-clear-color-pressed":yt,"--n-arrow-size":Ot}}),V=be?et("internal-selection",F(()=>e.size[0]),se,e):void 0;return{mergedTheme:E,mergedClearable:B,mergedClsPrefix:T,rtlEnabled:b,patternInputFocused:_,filterablePlaceholder:P,label:R,selected:p,showTagsPanel:A,isComposing:q,counterRef:O,counterWrapperRef:I,patternInputMirrorRef:f,patternInputRef:S,selfRef:$,multipleElRef:i,singleElRef:k,patternInputWrapperRef:M,overflowRef:y,inputTagElRef:C,handleMouseDown:Se,handleFocusin:ue,handleClear:X,handleMouseEnter:Te,handleMouseLeave:Z,handleDeleteOption:Q,handlePatternKeyDown:Re,handlePatternInputInput:Me,handlePatternInputBlur:Y,handlePatternInputFocus:fe,handleMouseEnterCounter:$e,handleMouseLeaveCounter:ke,handleFocusout:ce,handleCompositionEnd:he,handleCompositionStart:Pe,onPopoverUpdateShow:Ae,focus:ve,focusInput:ee,blur:D,blurInput:Ie,updateCounter:_e,getCounter:Be,getTail:ze,renderLabel:e.renderLabel,cssVars:be?void 0:se,themeClass:V==null?void 0:V.themeClass,onRender:V==null?void 0:V.onRender}},render(){const{status:e,multiple:T,size:z,disabled:b,filterable:f,maxTagCount:S,bordered:$,clsPrefix:i,ellipsisTagPopoverProps:k,onRender:M,renderTag:O,renderLabel:I}=this;M==null||M();const y=S==="responsive",C=typeof S=="number",A=y||C,_=r(Gt,null,{default:()=>r(qt,{clsPrefix:i,loading:this.loading,showArrow:this.showArrow,showClear:this.mergedClearable&&this.selected,onClear:this.handleClear},{default:()=>{var E,B;return(B=(E=this.$slots).arrow)===null||B===void 0?void 0:B.call(E)}})});let W;if(T){const{labelField:E}=this,B=m=>r("div",{class:`${i}-base-selection-tag-wrapper`,key:m.value},O?O({option:m,handleClose:()=>{this.handleDeleteOption(m)}}):r(Le,{size:z,closable:!m.disabled,disabled:b,onClose:()=>{this.handleDeleteOption(m)},internalCloseIsButtonTag:!1,internalCloseFocusable:!1},{default:()=>I?I(m,!0):Ce(m[E],m,!0)})),P=()=>(C?this.selectedOptions.slice(0,S):this.selectedOptions).map(B),R=f?r("div",{class:`${i}-base-selection-input-tag`,ref:"inputTagElRef",key:"__input-tag__"},r("input",Object.assign({},this.inputProps,{ref:"patternInputRef",tabindex:-1,disabled:b,value:this.pattern,autofocus:this.autofocus,class:`${i}-base-selection-input-tag__input`,onBlur:this.handlePatternInputBlur,onFocus:this.handlePatternInputFocus,onKeydown:this.handlePatternKeyDown,onInput:this.handlePatternInputInput,onCompositionstart:this.handleCompositionStart,onCompositionend:this.handleCompositionEnd})),r("span",{ref:"patternInputMirrorRef",class:`${i}-base-selection-input-tag__mirror`},this.pattern)):null,p=y?()=>r("div",{class:`${i}-base-selection-tag-wrapper`,ref:"counterWrapperRef"},r(Le,{size:z,ref:"counterRef",onMouseenter:this.handleMouseEnterCounter,onMouseleave:this.handleMouseLeaveCounter,disabled:b})):void 0;let U;if(C){const m=this.selectedOptions.length-S;m>0&&(U=r("div",{class:`${i}-base-selection-tag-wrapper`,key:"__counter__"},r(Le,{size:z,ref:"counterRef",onMouseenter:this.handleMouseEnterCounter,disabled:b},{default:()=>`+${m}`})))}const j=y?f?r(Qe,{ref:"overflowRef",updateCounter:this.updateCounter,getCounter:this.getCounter,getTail:this.getTail,style:{width:"100%",display:"flex",overflow:"hidden"}},{default:P,counter:p,tail:()=>R}):r(Qe,{ref:"overflowRef",updateCounter:this.updateCounter,getCounter:this.getCounter,style:{width:"100%",display:"flex",overflow:"hidden"}},{default:P,counter:p}):C&&U?P().concat(U):P(),oe=A?()=>r("div",{class:`${i}-base-selection-popover`},y?P():this.selectedOptions.map(B)):void 0,le=A?Object.assign({show:this.showTagsPanel,trigger:"hover",overlap:!0,placement:"top",width:"trigger",onUpdateShow:this.onPopoverUpdateShow,theme:this.mergedTheme.peers.Popover,themeOverrides:this.mergedTheme.peerOverrides.Popover},k):null,H=(this.selected?!1:this.active?!this.pattern&&!this.isComposing:!0)?r("div",{class:`${i}-base-selection-placeholder ${i}-base-selection-overlay`},r("div",{class:`${i}-base-selection-placeholder__inner`},this.placeholder)):null,J=f?r("div",{ref:"patternInputWrapperRef",class:`${i}-base-selection-tags`},j,y?null:R,_):r("div",{ref:"multipleElRef",class:`${i}-base-selection-tags`,tabindex:b?void 0:0},j,_);W=r(Mt,null,A?r(Qt,Object.assign({},le,{scrollable:!0,style:"max-height: calc(var(--v-target-height) * 6.6);"}),{trigger:()=>J,default:oe}):J,H)}else if(f){const E=this.pattern||this.isComposing,B=this.active?!E:!this.selected,P=this.active?!1:this.selected;W=r("div",{ref:"patternInputWrapperRef",class:`${i}-base-selection-label`,title:this.patternInputFocused?void 0:Ye(this.label)},r("input",Object.assign({},this.inputProps,{ref:"patternInputRef",class:`${i}-base-selection-input`,value:this.active?this.pattern:"",placeholder:"",readonly:b,disabled:b,tabindex:-1,autofocus:this.autofocus,onFocus:this.handlePatternInputFocus,onBlur:this.handlePatternInputBlur,onInput:this.handlePatternInputInput,onCompositionstart:this.handleCompositionStart,onCompositionend:this.handleCompositionEnd})),P?r("div",{class:`${i}-base-selection-label__render-label ${i}-base-selection-overlay`,key:"input"},r("div",{class:`${i}-base-selection-overlay__wrapper`},O?O({option:this.selectedOption,handleClose:()=>{}}):I?I(this.selectedOption,!0):Ce(this.label,this.selectedOption,!0))):null,B?r("div",{class:`${i}-base-selection-placeholder ${i}-base-selection-overlay`,key:"placeholder"},r("div",{class:`${i}-base-selection-overlay__wrapper`},this.filterablePlaceholder)):null,_)}else W=r("div",{ref:"singleElRef",class:`${i}-base-selection-label`,tabindex:this.disabled?void 0:0},this.label!==void 0?r("div",{class:`${i}-base-selection-input`,title:Ye(this.label),key:"input"},r("div",{class:`${i}-base-selection-input__content`},O?O({option:this.selectedOption,handleClose:()=>{}}):I?I(this.selectedOption,!0):Ce(this.label,this.selectedOption,!0))):r("div",{class:`${i}-base-selection-placeholder ${i}-base-selection-overlay`,key:"placeholder"},r("div",{class:`${i}-base-selection-placeholder__inner`},this.placeholder)),_);return r("div",{ref:"selfRef",class:[`${i}-base-selection`,this.rtlEnabled&&`${i}-base-selection--rtl`,this.themeClass,e&&`${i}-base-selection--${e}-status`,{[`${i}-base-selection--active`]:this.active,[`${i}-base-selection--selected`]:this.selected||this.active&&this.pattern,[`${i}-base-selection--disabled`]:this.disabled,[`${i}-base-selection--multiple`]:this.multiple,[`${i}-base-selection--focus`]:this.focused}],style:this.cssVars,onClick:this.onClick,onMouseenter:this.handleMouseEnter,onMouseleave:this.handleMouseLeave,onKeydown:this.onKeydown,onFocusin:this.handleFocusin,onFocusout:this.handleFocusout,onMousedown:this.handleMouseDown},W,$?r("div",{class:`${i}-base-selection__border`}):null,$?r("div",{class:`${i}-base-selection__state-border`}):null)}}),on=de([v("select",`
 z-index: auto;
 outline: none;
 width: 100%;
 position: relative;
 `),v("select-menu",`
 margin: 4px 0;
 box-shadow: var(--n-menu-box-shadow);
 `,[At({originalTransition:"background-color .3s var(--n-bezier), box-shadow .3s var(--n-bezier)"})])]),ln=Object.assign(Object.assign({},Fe.props),{to:Ue.propTo,bordered:{type:Boolean,default:void 0},clearable:Boolean,clearFilterAfterSelect:{type:Boolean,default:!0},options:{type:Array,default:()=>[]},defaultValue:{type:[String,Number,Array],default:null},keyboard:{type:Boolean,default:!0},value:[String,Number,Array],placeholder:String,menuProps:Object,multiple:Boolean,size:String,filterable:Boolean,disabled:{type:Boolean,default:void 0},remote:Boolean,loading:Boolean,filter:Function,placement:{type:String,default:"bottom-start"},widthMode:{type:String,default:"trigger"},tag:Boolean,onCreate:Function,fallbackOption:{type:[Function,Boolean],default:void 0},show:{type:Boolean,default:void 0},showArrow:{type:Boolean,default:!0},maxTagCount:[Number,String],ellipsisTagPopoverProps:Object,consistentMenuWidth:{type:Boolean,default:!0},virtualScroll:{type:Boolean,default:!0},labelField:{type:String,default:"label"},valueField:{type:String,default:"value"},childrenField:{type:String,default:"children"},renderLabel:Function,renderOption:Function,renderTag:Function,"onUpdate:value":[Function,Array],inputProps:Object,nodeProps:Function,ignoreComposition:{type:Boolean,default:!0},showOnFocus:Boolean,onUpdateValue:[Function,Array],onBlur:[Function,Array],onClear:[Function,Array],onFocus:[Function,Array],onScroll:[Function,Array],onSearch:[Function,Array],onUpdateShow:[Function,Array],"onUpdate:show":[Function,Array],displayDirective:{type:String,default:"show"},resetMenuOnOptionsChange:{type:Boolean,default:!0},status:String,showCheckmark:{type:Boolean,default:!0},onChange:[Function,Array],items:Array}),Mn=Xe({name:"Select",props:ln,setup(e){const{mergedClsPrefixRef:T,mergedBorderedRef:z,namespaceRef:b,inlineThemeDisabled:f}=Ze(e),S=Fe("Select","-select",on,Ht,e,T),$=h(e.defaultValue),i=ne(e,"value"),k=qe(i,$),M=h(!1),O=h(""),I=Et(e,["items","options"]),y=h([]),C=h([]),A=F(()=>C.value.concat(y.value).concat(I.value)),_=F(()=>{const{filter:t}=e;if(t)return t;const{labelField:o,valueField:a}=e;return(c,d)=>{if(!d)return!1;const s=d[o];if(typeof s=="string")return je(c,s);const u=d[a];return typeof u=="string"?je(c,u):typeof u=="number"?je(c,String(u)):!1}}),W=F(()=>{if(e.remote)return I.value;{const{value:t}=A,{value:o}=O;return!o.length||!e.filterable?t:zt(t,_.value,o,e.childrenField)}}),E=F(()=>{const{valueField:t,childrenField:o}=e,a=kt(t,o);return Zt(W.value,a)}),B=F(()=>$t(A.value,e.valueField,e.childrenField)),P=h(!1),R=qe(ne(e,"show"),P),p=h(null),U=h(null),j=h(null),{localeRef:oe}=Dt("Select"),le=F(()=>{var t;return(t=e.placeholder)!==null&&t!==void 0?t:oe.value.placeholder}),K=[],H=h(new Map),J=F(()=>{const{fallbackOption:t}=e;if(t===void 0){const{labelField:o,valueField:a}=e;return c=>({[o]:String(c),[a]:c})}return t===!1?!1:o=>Object.assign(t(o),{value:o})});function m(t){const o=e.remote,{value:a}=H,{value:c}=B,{value:d}=J,s=[];return t.forEach(u=>{if(c.has(u))s.push(c.get(u));else if(o&&a.has(u))s.push(a.get(u));else if(d){const w=d(u);w&&s.push(w)}}),s}const ue=F(()=>{if(e.multiple){const{value:t}=k;return Array.isArray(t)?m(t):[]}return null}),ce=F(()=>{const{value:t}=k;return!e.multiple&&!Array.isArray(t)?t===null?null:m([t])[0]||null:null}),X=Vt(e),{mergedSizeRef:Te,mergedDisabledRef:Z,mergedStatusRef:Se}=X;function Q(t,o){const{onChange:a,"onUpdate:value":c,onUpdateValue:d}=e,{nTriggerFormChange:s,nTriggerFormInput:u}=X;a&&N(a,t,o),d&&N(d,t,o),c&&N(c,t,o),$.value=t,s(),u()}function q(t){const{onBlur:o}=e,{nTriggerFormBlur:a}=X;o&&N(o,t),a()}function Re(){const{onClear:t}=e;t&&N(t)}function ie(t){const{onFocus:o,showOnFocus:a}=e,{nTriggerFormFocus:c}=X;o&&N(o,t),c(),a&&Y()}function Me(t){const{onSearch:o}=e;o&&N(o,t)}function Pe(t){const{onScroll:o}=e;o&&N(o,t)}function he(){var t;const{remote:o,multiple:a}=e;if(o){const{value:c}=H;if(a){const{valueField:d}=e;(t=ue.value)===null||t===void 0||t.forEach(s=>{c.set(s[d],s)})}else{const d=ce.value;d&&c.set(d[e.valueField],d)}}}function fe(t){const{onUpdateShow:o,"onUpdate:show":a}=e;o&&N(o,t),a&&N(a,t),P.value=t}function Y(){Z.value||(fe(!0),P.value=!0,e.filterable&&me())}function D(){fe(!1)}function ve(){O.value="",C.value=K}const ee=h(!1);function Ie(){e.filterable&&(ee.value=!0)}function _e(){e.filterable&&(ee.value=!1,R.value||ve())}function Be(){Z.value||(R.value?e.filterable?me():D():Y())}function ze(t){var o,a;!((a=(o=j.value)===null||o===void 0?void 0:o.selfRef)===null||a===void 0)&&a.contains(t.relatedTarget)||(M.value=!1,q(t),D())}function ae(t){ie(t),M.value=!0}function re(){M.value=!0}function $e(t){var o;!((o=p.value)===null||o===void 0)&&o.$el.contains(t.relatedTarget)||(M.value=!1,q(t),D())}function ke(){var t;(t=p.value)===null||t===void 0||t.focus(),D()}function Ae(t){var o;R.value&&(!((o=p.value)===null||o===void 0)&&o.$el.contains(Jt(t))||D())}function be(t){if(!Array.isArray(t))return[];if(J.value)return Array.from(t);{const{remote:o}=e,{value:a}=B;if(o){const{value:c}=H;return t.filter(d=>a.has(d)||c.has(d))}else return t.filter(c=>a.has(c))}}function se(t){V(t.rawNode)}function V(t){if(Z.value)return;const{tag:o,remote:a,clearFilterAfterSelect:c,valueField:d}=e;if(o&&!a){const{value:s}=C,u=s[0]||null;if(u){const w=y.value;w.length?w.push(u):y.value=[u],C.value=K}}if(a&&H.value.set(t[d],t),e.multiple){const s=be(k.value),u=s.findIndex(w=>w===t[d]);if(~u){if(s.splice(u,1),o&&!a){const w=n(t[d]);~w&&(y.value.splice(w,1),c&&(O.value=""))}}else s.push(t[d]),c&&(O.value="");Q(s,m(s))}else{if(o&&!a){const s=n(t[d]);~s?y.value=[y.value[s]]:y.value=K}pe(),D(),Q(t[d],t)}}function n(t){return y.value.findIndex(a=>a[e.valueField]===t)}function l(t){R.value||Y();const{value:o}=t.target;O.value=o;const{tag:a,remote:c}=e;if(Me(o),a&&!c){if(!o){C.value=K;return}const{onCreate:d}=e,s=d?d(o):{[e.labelField]:o,[e.valueField]:o},{valueField:u,labelField:w}=e;I.value.some(L=>L[u]===s[u]||L[w]===s[w])||y.value.some(L=>L[u]===s[u]||L[w]===s[w])?C.value=K:C.value=[s]}}function g(t){t.stopPropagation();const{multiple:o}=e;!o&&e.filterable&&D(),Re(),o?Q([],[]):Q(null,null)}function Ee(t){!Ne(t,"action")&&!Ne(t,"empty")&&!Ne(t,"header")&&t.preventDefault()}function De(t){Pe(t)}function ge(t){var o,a,c,d,s;if(!e.keyboard){t.preventDefault();return}switch(t.key){case" ":if(e.filterable)break;t.preventDefault();case"Enter":if(!(!((o=p.value)===null||o===void 0)&&o.isComposing)){if(R.value){const u=(a=j.value)===null||a===void 0?void 0:a.getPendingTmNode();u?se(u):e.filterable||(D(),pe())}else if(Y(),e.tag&&ee.value){const u=C.value[0];if(u){const w=u[e.valueField],{value:L}=k;e.multiple&&Array.isArray(L)&&L.includes(w)||V(u)}}}t.preventDefault();break;case"ArrowUp":if(t.preventDefault(),e.loading)return;R.value&&((c=j.value)===null||c===void 0||c.prev());break;case"ArrowDown":if(t.preventDefault(),e.loading)return;R.value?(d=j.value)===null||d===void 0||d.next():Y();break;case"Escape":R.value&&(en(t),D()),(s=p.value)===null||s===void 0||s.focus();break}}function pe(){var t;(t=p.value)===null||t===void 0||t.focus()}function me(){var t;(t=p.value)===null||t===void 0||t.focusInput()}function Ve(){var t;R.value&&((t=U.value)===null||t===void 0||t.syncPosition())}he(),Oe(ne(e,"options"),he);const We={focus:()=>{var t;(t=p.value)===null||t===void 0||t.focus()},focusInput:()=>{var t;(t=p.value)===null||t===void 0||t.focusInput()},blur:()=>{var t;(t=p.value)===null||t===void 0||t.blur()},blurInput:()=>{var t;(t=p.value)===null||t===void 0||t.blurInput()}},we=F(()=>{const{self:{menuBoxShadow:t}}=S.value;return{"--n-menu-box-shadow":t}}),G=f?et("select",void 0,we,e):void 0;return Object.assign(Object.assign({},We),{mergedStatus:Se,mergedClsPrefix:T,mergedBordered:z,namespace:b,treeMate:E,isMounted:Wt(),triggerRef:p,menuRef:j,pattern:O,uncontrolledShow:P,mergedShow:R,adjustedTo:Ue(e),uncontrolledValue:$,mergedValue:k,followerRef:U,localizedPlaceholder:le,selectedOption:ce,selectedOptions:ue,mergedSize:Te,mergedDisabled:Z,focused:M,activeWithoutMenuOpen:ee,inlineThemeDisabled:f,onTriggerInputFocus:Ie,onTriggerInputBlur:_e,handleTriggerOrMenuResize:Ve,handleMenuFocus:re,handleMenuBlur:$e,handleMenuTabOut:ke,handleTriggerClick:Be,handleToggle:se,handleDeleteOption:V,handlePatternInput:l,handleClear:g,handleTriggerBlur:ze,handleTriggerFocus:ae,handleKeydown:ge,handleMenuAfterLeave:ve,handleMenuClickOutside:Ae,handleMenuScroll:De,handleMenuKeydown:ge,handleMenuMousedown:Ee,mergedTheme:S,cssVars:f?void 0:we,themeClass:G==null?void 0:G.themeClass,onRender:G==null?void 0:G.onRender})},render(){return r("div",{class:`${this.mergedClsPrefix}-select`},r(jt,null,{default:()=>[r(Lt,null,{default:()=>r(nn,{ref:"triggerRef",inlineThemeDisabled:this.inlineThemeDisabled,status:this.mergedStatus,inputProps:this.inputProps,clsPrefix:this.mergedClsPrefix,showArrow:this.showArrow,maxTagCount:this.maxTagCount,ellipsisTagPopoverProps:this.ellipsisTagPopoverProps,bordered:this.mergedBordered,active:this.activeWithoutMenuOpen||this.mergedShow,pattern:this.pattern,placeholder:this.localizedPlaceholder,selectedOption:this.selectedOption,selectedOptions:this.selectedOptions,multiple:this.multiple,renderTag:this.renderTag,renderLabel:this.renderLabel,filterable:this.filterable,clearable:this.clearable,disabled:this.mergedDisabled,size:this.mergedSize,theme:this.mergedTheme.peers.InternalSelection,labelField:this.labelField,valueField:this.valueField,themeOverrides:this.mergedTheme.peerOverrides.InternalSelection,loading:this.loading,focused:this.focused,onClick:this.handleTriggerClick,onDeleteOption:this.handleDeleteOption,onPatternInput:this.handlePatternInput,onClear:this.handleClear,onBlur:this.handleTriggerBlur,onFocus:this.handleTriggerFocus,onKeydown:this.handleKeydown,onPatternBlur:this.onTriggerInputBlur,onPatternFocus:this.onTriggerInputFocus,onResize:this.handleTriggerOrMenuResize,ignoreComposition:this.ignoreComposition},{arrow:()=>{var e,T;return[(T=(e=this.$slots).arrow)===null||T===void 0?void 0:T.call(e)]}})}),r(Nt,{ref:"followerRef",show:this.mergedShow,to:this.adjustedTo,teleportDisabled:this.adjustedTo===Ue.tdkey,containerClass:this.namespace,width:this.consistentMenuWidth?"target":void 0,minWidth:"target",placement:this.placement},{default:()=>r(It,{name:"fade-in-scale-up-transition",appear:this.isMounted,onAfterLeave:this.handleMenuAfterLeave},{default:()=>{var e,T,z;return this.mergedShow||this.displayDirective==="show"?((e=this.onRender)===null||e===void 0||e.call(this),_t(r(Xt,Object.assign({},this.menuProps,{ref:"menuRef",onResize:this.handleTriggerOrMenuResize,inlineThemeDisabled:this.inlineThemeDisabled,virtualScroll:this.consistentMenuWidth&&this.virtualScroll,class:[`${this.mergedClsPrefix}-select-menu`,this.themeClass,(T=this.menuProps)===null||T===void 0?void 0:T.class],clsPrefix:this.mergedClsPrefix,focusable:!0,labelField:this.labelField,valueField:this.valueField,autoPending:!0,nodeProps:this.nodeProps,theme:this.mergedTheme.peers.InternalSelectMenu,themeOverrides:this.mergedTheme.peerOverrides.InternalSelectMenu,treeMate:this.treeMate,multiple:this.multiple,size:"medium",renderOption:this.renderOption,renderLabel:this.renderLabel,value:this.mergedValue,style:[(z=this.menuProps)===null||z===void 0?void 0:z.style,this.cssVars],onToggle:this.handleToggle,onScroll:this.handleMenuScroll,onFocus:this.handleMenuFocus,onBlur:this.handleMenuBlur,onKeydown:this.handleMenuKeydown,onTabOut:this.handleMenuTabOut,onMousedown:this.handleMenuMousedown,show:this.mergedShow,showCheckmark:this.showCheckmark,resetMenuOnOptionsChange:this.resetMenuOnOptionsChange}),{empty:()=>{var b,f;return[(f=(b=this.$slots).empty)===null||f===void 0?void 0:f.call(b)]},header:()=>{var b,f;return[(f=(b=this.$slots).header)===null||f===void 0?void 0:f.call(b)]},action:()=>{var b,f;return[(f=(b=this.$slots).action)===null||f===void 0?void 0:f.call(b)]}}),this.displayDirective==="show"?[[Bt,this.mergedShow],[Je,this.handleMenuClickOutside,void 0,{capture:!0}]]:[[Je,this.handleMenuClickOutside,void 0,{capture:!0}]])):null}})})]}))}});export{Mn as N,nn as a};
