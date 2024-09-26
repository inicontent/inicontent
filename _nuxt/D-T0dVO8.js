import{N as Z,ad as ee,i as _,t as r,j as ne,aj as Te,aG as Be,b as x,f as M,d as z,e as O,h as _e,ah as G,ab as Le,ae as m,A as B,l as k,a6 as q,q as U,ai as $e,ag as Ee,aQ as T}from"./DtwXQcKw.js";import{V as Ie,F as je}from"./fLrJgkqS.js";import{i as H,c as Ke}from"./Codpw64D.js";import{u as I}from"./BaqSRRLV.js";import{r as oe}from"./BzwZr-mA.js";import{f as He}from"./BchobC78.js";import{u as De,a as W,r as Ve,d as Ae,g as j}from"./Dzhi6kJb.js";import{i as Ge}from"./NRcK2wYB.js";import{r as Q}from"./CVtA2A93.js";import{a as qe}from"./D9DVsfIe.js";import{S as Ue}from"./D7-7OZS7.js";import{a as We}from"./KdGHD0sL.js";import{h as J}from"./CM8LO42l.js";import{N as Qe}from"./-6gg-L2F.js";function K(e){const i=e.filter(t=>t!==void 0);if(i.length!==0)return i.length===1?i[0]:t=>{e.forEach(s=>{s&&s(t)})}}function Je(e,i){i&&(Z(()=>{const{value:t}=e;t&&Q.registerHandler(t,i)}),ee(()=>{const{value:t}=e;t&&Q.unregisterHandler(t)}))}const Xe=_({name:"Checkmark",render(){return r("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 16 16"},r("g",{fill:"none"},r("path",{d:"M14.046 3.486a.75.75 0 0 1-.032 1.06l-7.93 7.474a.85.85 0 0 1-1.188-.022l-2.68-2.72a.75.75 0 1 1 1.068-1.053l2.234 2.267l7.468-7.038a.75.75 0 0 1 1.06.032z",fill:"currentColor"})))}});function Ye(e,i){return r(Be,{name:"fade-in-scale-up-transition"},{default:()=>e?r(Te,{clsPrefix:i,class:`${i}-base-select-option__check`},{default:()=>r(Xe)}):null})}const X=_({name:"NBaseSelectOption",props:{clsPrefix:{type:String,required:!0},tmNode:{type:Object,required:!0}},setup(e){const{valueRef:i,pendingTmNodeRef:t,multipleRef:s,valueSetRef:c,renderLabelRef:d,renderOptionRef:l,labelFieldRef:p,valueFieldRef:b,showCheckmarkRef:F,nodePropsRef:g,handleOptionClick:C,handleOptionMouseEnter:y}=ne(H),h=I(()=>{const{value:f}=t;return f?e.tmNode.key===f.key:!1});function a(f){const{tmNode:v}=e;v.disabled||C(f,v)}function R(f){const{tmNode:v}=e;v.disabled||y(f,v)}function L(f){const{tmNode:v}=e,{value:S}=h;v.disabled||S||y(f,v)}return{multiple:s,isGrouped:I(()=>{const{tmNode:f}=e,{parent:v}=f;return v&&v.rawNode.type==="group"}),showCheckmark:F,nodeProps:g,isPending:h,isSelected:I(()=>{const{value:f}=i,{value:v}=s;if(f===null)return!1;const S=e.tmNode.rawNode[b.value];if(v){const{value:$}=c;return $.has(S)}else return f===S}),labelField:p,renderLabel:d,renderOption:l,handleMouseMove:L,handleMouseEnter:R,handleClick:a}},render(){const{clsPrefix:e,tmNode:{rawNode:i},isSelected:t,isPending:s,isGrouped:c,showCheckmark:d,nodeProps:l,renderOption:p,renderLabel:b,handleClick:F,handleMouseEnter:g,handleMouseMove:C}=this,y=Ye(t,e),h=b?[b(i,t),d&&y]:[oe(i[this.labelField],i,t),d&&y],a=l==null?void 0:l(i),R=r("div",Object.assign({},a,{class:[`${e}-base-select-option`,i.class,a==null?void 0:a.class,{[`${e}-base-select-option--disabled`]:i.disabled,[`${e}-base-select-option--selected`]:t,[`${e}-base-select-option--grouped`]:c,[`${e}-base-select-option--pending`]:s,[`${e}-base-select-option--show-checkmark`]:d}],style:[(a==null?void 0:a.style)||"",i.style||""],onClick:K([F,a==null?void 0:a.onClick]),onMouseenter:K([g,a==null?void 0:a.onMouseenter]),onMousemove:K([C,a==null?void 0:a.onMousemove])}),r("div",{class:`${e}-base-select-option__content`},h));return i.render?i.render({node:R,option:i,selected:t}):p?p({node:R,option:i,selected:t}):R}}),Y=_({name:"NBaseSelectGroupHeader",props:{clsPrefix:{type:String,required:!0},tmNode:{type:Object,required:!0}},setup(){const{renderLabelRef:e,renderOptionRef:i,labelFieldRef:t,nodePropsRef:s}=ne(H);return{labelField:t,nodeProps:s,renderLabel:e,renderOption:i}},render(){const{clsPrefix:e,renderLabel:i,renderOption:t,nodeProps:s,tmNode:{rawNode:c}}=this,d=s==null?void 0:s(c),l=i?i(c,!1):oe(c[this.labelField],c,!1),p=r("div",Object.assign({},d,{class:[`${e}-base-select-group-header`,d==null?void 0:d.class]}),l);return c.render?c.render({node:p,option:c}):t?t({node:p,option:c,selected:!1}):p}}),Ze=x("base-select-menu",`
 line-height: 1.5;
 outline: none;
 z-index: 0;
 position: relative;
 border-radius: var(--n-border-radius);
 transition:
 background-color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier);
 background-color: var(--n-color);
`,[x("scrollbar",`
 max-height: var(--n-height);
 `),x("virtual-list",`
 max-height: var(--n-height);
 `),x("base-select-option",`
 min-height: var(--n-option-height);
 font-size: var(--n-option-font-size);
 display: flex;
 align-items: center;
 `,[M("content",`
 z-index: 1;
 white-space: nowrap;
 text-overflow: ellipsis;
 overflow: hidden;
 `)]),x("base-select-group-header",`
 min-height: var(--n-option-height);
 font-size: .93em;
 display: flex;
 align-items: center;
 `),x("base-select-menu-option-wrapper",`
 position: relative;
 width: 100%;
 `),M("loading, empty",`
 display: flex;
 padding: 12px 32px;
 flex: 1;
 justify-content: center;
 `),M("loading",`
 color: var(--n-loading-color);
 font-size: var(--n-loading-size);
 `),M("header",`
 padding: 8px var(--n-option-padding-left);
 font-size: var(--n-option-font-size);
 transition: 
 color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 border-bottom: 1px solid var(--n-action-divider-color);
 color: var(--n-action-text-color);
 `),M("action",`
 padding: 8px var(--n-option-padding-left);
 font-size: var(--n-option-font-size);
 transition: 
 color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 border-top: 1px solid var(--n-action-divider-color);
 color: var(--n-action-text-color);
 `),x("base-select-group-header",`
 position: relative;
 cursor: default;
 padding: var(--n-option-padding);
 color: var(--n-group-header-text-color);
 `),x("base-select-option",`
 cursor: pointer;
 position: relative;
 padding: var(--n-option-padding);
 transition:
 color .3s var(--n-bezier),
 opacity .3s var(--n-bezier);
 box-sizing: border-box;
 color: var(--n-option-text-color);
 opacity: 1;
 `,[z("show-checkmark",`
 padding-right: calc(var(--n-option-padding-right) + 20px);
 `),O("&::before",`
 content: "";
 position: absolute;
 left: 4px;
 right: 4px;
 top: 0;
 bottom: 0;
 border-radius: var(--n-border-radius);
 transition: background-color .3s var(--n-bezier);
 `),O("&:active",`
 color: var(--n-option-text-color-pressed);
 `),z("grouped",`
 padding-left: calc(var(--n-option-padding-left) * 1.5);
 `),z("pending",[O("&::before",`
 background-color: var(--n-option-color-pending);
 `)]),z("selected",`
 color: var(--n-option-text-color-active);
 `,[O("&::before",`
 background-color: var(--n-option-color-active);
 `),z("pending",[O("&::before",`
 background-color: var(--n-option-color-active-pending);
 `)])]),z("disabled",`
 cursor: not-allowed;
 `,[_e("selected",`
 color: var(--n-option-text-color-disabled);
 `),z("selected",`
 opacity: var(--n-option-opacity-disabled);
 `)]),M("check",`
 font-size: 16px;
 position: absolute;
 right: calc(var(--n-option-padding-right) - 4px);
 top: calc(50% - 7px);
 color: var(--n-option-check-color);
 transition: color .3s var(--n-bezier);
 `,[He({enterScale:"0.5"})])])]),gn=_({name:"InternalSelectMenu",props:Object.assign(Object.assign({},G.props),{clsPrefix:{type:String,required:!0},scrollable:{type:Boolean,default:!0},treeMate:{type:Object,required:!0},multiple:Boolean,size:{type:String,default:"medium"},value:{type:[String,Number,Array],default:null},autoPending:Boolean,virtualScroll:{type:Boolean,default:!0},show:{type:Boolean,default:!0},labelField:{type:String,default:"label"},valueField:{type:String,default:"value"},loading:Boolean,focusable:Boolean,renderLabel:Function,renderOption:Function,nodeProps:Function,showCheckmark:{type:Boolean,default:!0},onMousedown:Function,onScroll:Function,onFocus:Function,onBlur:Function,onKeyup:Function,onKeydown:Function,onTabOut:Function,onMouseenter:Function,onMouseleave:Function,onResize:Function,resetMenuOnOptionsChange:{type:Boolean,default:!0},inlineThemeDisabled:Boolean,onToggle:Function}),setup(e){const{mergedClsPrefixRef:i,mergedRtlRef:t}=Le(e),s=De("InternalSelectMenu",t,i),c=G("InternalSelectMenu","-internal-select-menu",Ze,Ge,e,m(e,"clsPrefix")),d=B(null),l=B(null),p=B(null),b=k(()=>e.treeMate.getFlattenedNodes()),F=k(()=>We(b.value)),g=B(null);function C(){const{treeMate:n}=e;let o=null;const{value:u}=e;u===null?o=n.getFirstAvailableNode():(e.multiple?o=n.getNode((u||[])[(u||[]).length-1]):o=n.getNode(u),(!o||o.disabled)&&(o=n.getFirstAvailableNode())),P(o||null)}function y(){const{value:n}=g;n&&!e.treeMate.getNode(n.key)&&(g.value=null)}let h;q(()=>e.show,n=>{n?h=q(()=>e.treeMate,()=>{e.resetMenuOnOptionsChange?(e.autoPending?C():y(),Ee(D)):y()},{immediate:!0}):h==null||h()},{immediate:!0}),ee(()=>{h==null||h()});const a=k(()=>Ae(c.value.self[T("optionHeight",e.size)])),R=k(()=>j(c.value.self[T("padding",e.size)])),L=k(()=>e.multiple&&Array.isArray(e.value)?new Set(e.value):new Set),f=k(()=>{const n=b.value;return n&&n.length===0});function v(n){const{onToggle:o}=e;o&&o(n)}function S(n){const{onScroll:o}=e;o&&o(n)}function $(n){var o;(o=p.value)===null||o===void 0||o.sync(),S(n)}function te(){var n;(n=p.value)===null||n===void 0||n.sync()}function ie(){const{value:n}=g;return n||null}function le(n,o){o.disabled||P(o,!1)}function re(n,o){o.disabled||v(o)}function ae(n){var o;J(n,"action")||(o=e.onKeyup)===null||o===void 0||o.call(e,n)}function se(n){var o;J(n,"action")||(o=e.onKeydown)===null||o===void 0||o.call(e,n)}function de(n){var o;(o=e.onMousedown)===null||o===void 0||o.call(e,n),!e.focusable&&n.preventDefault()}function ce(){const{value:n}=g;n&&P(n.getNext({loop:!0}),!0)}function ue(){const{value:n}=g;n&&P(n.getPrev({loop:!0}),!0)}function P(n,o=!1){g.value=n,o&&D()}function D(){var n,o;const u=g.value;if(!u)return;const w=F.value(u.key);w!==null&&(e.virtualScroll?(n=l.value)===null||n===void 0||n.scrollTo({index:w}):(o=p.value)===null||o===void 0||o.scrollTo({index:w,elSize:a.value}))}function fe(n){var o,u;!((o=d.value)===null||o===void 0)&&o.contains(n.target)&&((u=e.onFocus)===null||u===void 0||u.call(e,n))}function ve(n){var o,u;!((o=d.value)===null||o===void 0)&&o.contains(n.relatedTarget)||(u=e.onBlur)===null||u===void 0||u.call(e,n)}U(H,{handleOptionMouseEnter:le,handleOptionClick:re,valueSetRef:L,pendingTmNodeRef:g,nodePropsRef:m(e,"nodeProps"),showCheckmarkRef:m(e,"showCheckmark"),multipleRef:m(e,"multiple"),valueRef:m(e,"value"),renderLabelRef:m(e,"renderLabel"),renderOptionRef:m(e,"renderOption"),labelFieldRef:m(e,"labelField"),valueFieldRef:m(e,"valueField")}),U(Ke,d),Z(()=>{const{value:n}=p;n&&n.sync()});const V=k(()=>{const{size:n}=e,{common:{cubicBezierEaseInOut:o},self:{height:u,borderRadius:w,color:ge,groupHeaderTextColor:he,actionDividerColor:me,optionTextColorPressed:be,optionTextColor:ye,optionTextColorDisabled:xe,optionTextColorActive:ke,optionOpacityDisabled:Re,optionCheckColor:Se,actionTextColor:ze,optionColorPending:Ne,optionColorActive:Me,loadingColor:Fe,loadingSize:Ce,optionColorActivePending:Pe,[T("optionFontSize",n)]:we,[T("optionHeight",n)]:Oe,[T("optionPadding",n)]:E}}=c.value;return{"--n-height":u,"--n-action-divider-color":me,"--n-action-text-color":ze,"--n-bezier":o,"--n-border-radius":w,"--n-color":ge,"--n-option-font-size":we,"--n-group-header-text-color":he,"--n-option-check-color":Se,"--n-option-color-pending":Ne,"--n-option-color-active":Me,"--n-option-color-active-pending":Pe,"--n-option-height":Oe,"--n-option-opacity-disabled":Re,"--n-option-text-color":ye,"--n-option-text-color-active":ke,"--n-option-text-color-disabled":xe,"--n-option-text-color-pressed":be,"--n-option-padding":E,"--n-option-padding-left":j(E,"left"),"--n-option-padding-right":j(E,"right"),"--n-loading-color":Fe,"--n-loading-size":Ce}}),{inlineThemeDisabled:A}=e,N=A?$e("internal-select-menu",k(()=>e.size[0]),V,e):void 0,pe={selfRef:d,next:ce,prev:ue,getPendingTmNode:ie};return Je(d,e.onResize),Object.assign({mergedTheme:c,mergedClsPrefix:i,rtlEnabled:s,virtualListRef:l,scrollbarRef:p,itemSize:a,padding:R,flattenedNodes:b,empty:f,virtualListContainer(){const{value:n}=l;return n==null?void 0:n.listElRef},virtualListContent(){const{value:n}=l;return n==null?void 0:n.itemsElRef},doScroll:S,handleFocusin:fe,handleFocusout:ve,handleKeyUp:ae,handleKeyDown:se,handleMouseDown:de,handleVirtualListResize:te,handleVirtualListScroll:$,cssVars:A?void 0:V,themeClass:N==null?void 0:N.themeClass,onRender:N==null?void 0:N.onRender},pe)},render(){const{$slots:e,virtualScroll:i,clsPrefix:t,mergedTheme:s,themeClass:c,onRender:d}=this;return d==null||d(),r("div",{ref:"selfRef",tabindex:this.focusable?0:-1,class:[`${t}-base-select-menu`,this.rtlEnabled&&`${t}-base-select-menu--rtl`,c,this.multiple&&`${t}-base-select-menu--multiple`],style:this.cssVars,onFocusin:this.handleFocusin,onFocusout:this.handleFocusout,onKeyup:this.handleKeyUp,onKeydown:this.handleKeyDown,onMousedown:this.handleMouseDown,onMouseenter:this.onMouseenter,onMouseleave:this.onMouseleave},W(e.header,l=>l&&r("div",{class:`${t}-base-select-menu__header`,"data-header":!0,key:"header"},l)),this.loading?r("div",{class:`${t}-base-select-menu__loading`},r(qe,{clsPrefix:t,strokeWidth:20})):this.empty?r("div",{class:`${t}-base-select-menu__empty`,"data-empty":!0},Ve(e.empty,()=>[r(Qe,{theme:s.peers.Empty,themeOverrides:s.peerOverrides.Empty})])):r(Ue,{ref:"scrollbarRef",theme:s.peers.Scrollbar,themeOverrides:s.peerOverrides.Scrollbar,scrollable:this.scrollable,container:i?this.virtualListContainer:void 0,content:i?this.virtualListContent:void 0,onScroll:i?void 0:this.doScroll},{default:()=>i?r(Ie,{ref:"virtualListRef",class:`${t}-virtual-list`,items:this.flattenedNodes,itemSize:this.itemSize,showScrollbar:!1,paddingTop:this.padding.top,paddingBottom:this.padding.bottom,onResize:this.handleVirtualListResize,onScroll:this.handleVirtualListScroll,itemResizable:!0},{default:({item:l})=>l.isGroup?r(Y,{key:l.key,clsPrefix:t,tmNode:l}):l.ignored?null:r(X,{clsPrefix:t,key:l.key,tmNode:l})}):r("div",{class:`${t}-base-select-menu-option-wrapper`,style:{paddingTop:this.padding.top,paddingBottom:this.padding.bottom}},this.flattenedNodes.map(l=>l.isGroup?r(Y,{key:l.key,clsPrefix:t,tmNode:l}):r(X,{clsPrefix:t,key:l.key,tmNode:l})))}),W(e.action,l=>l&&[r("div",{class:`${t}-base-select-menu__action`,"data-action":!0,key:"action"},l),r(je,{onFocus:this.onTabOut,key:"focus-detector"})]))}});export{Xe as F,gn as N,K as m,Je as u};
