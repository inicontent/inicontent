import{i as ee,aS as ne,f as _,B as d,aA as oe,c7 as K,Y as Le,bX as x,c6 as z,c4 as M,bW as O,c5 as _e,bZ as G,bY as Ee,bq as b,bU as $e,r as B,D as k,E as U,b0 as W,aN as Ie,ce as T}from"./b4y72k5A.js";import{V as Ke,F as je}from"./BPu60EtY.js";import{i as H,c as De}from"./Cmd_S7K8.js";import{r as te}from"./C4bfTcd_.js";import{N as He,b as Ve,u as Ae,r as Y,d as qe,h as Ge,g as j}from"./C1zJybjf.js";import{f as Ue}from"./DKG9CMtQ.js";import{r as X}from"./DMzQWz3x.js";import{a as We}from"./xQnQeLtE.js";import{S as Ye}from"./CdkfcTkH.js";import{h as Z}from"./CM8LO42l.js";import{N as Xe}from"./CAiua2Oz.js";import{a as Ze}from"./KdGHD0sL.js";function D(e){const t=e.filter(i=>i!==void 0);if(t.length!==0)return t.length===1?t[0]:i=>{e.forEach(l=>{l&&l(i)})}}function Je(e,t){t&&(ee(()=>{const{value:i}=e;i&&X.registerHandler(i,t)}),ne(()=>{const{value:i}=e;i&&X.unregisterHandler(i)}))}const Qe=_({name:"Checkmark",render(){return d("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 16 16"},d("g",{fill:"none"},d("path",{d:"M14.046 3.486a.75.75 0 0 1-.032 1.06l-7.93 7.474a.85.85 0 0 1-1.188-.022l-2.68-2.72a.75.75 0 1 1 1.068-1.053l2.234 2.267l7.468-7.038a.75.75 0 0 1 1.06.032z",fill:"currentColor"})))}});function en(e,t){return d(Le,{name:"fade-in-scale-up-transition"},{default:()=>e?d(He,{clsPrefix:t,class:`${t}-base-select-option__check`},{default:()=>d(Qe)}):null})}const J=_({name:"NBaseSelectOption",props:{clsPrefix:{type:String,required:!0},tmNode:{type:Object,required:!0}},setup(e){const{valueRef:t,pendingTmNodeRef:i,multipleRef:l,valueSetRef:a,renderLabelRef:s,renderOptionRef:r,labelFieldRef:c,valueFieldRef:m,showCheckmarkRef:C,nodePropsRef:g,handleOptionClick:w,handleOptionMouseEnter:y}=oe(H),h=K(()=>{const{value:v}=i;return v?e.tmNode.key===v.key:!1});function u(v){const{tmNode:p}=e;p.disabled||w(v,p)}function R(v){const{tmNode:p}=e;p.disabled||y(v,p)}function E(v){const{tmNode:p}=e,{value:S}=h;p.disabled||S||y(v,p)}return{multiple:l,isGrouped:K(()=>{const{tmNode:v}=e,{parent:p}=v;return p&&p.rawNode.type==="group"}),showCheckmark:C,nodeProps:g,isPending:h,isSelected:K(()=>{const{value:v}=t,{value:p}=l;if(v===null)return!1;const S=e.tmNode.rawNode[m.value];if(p){const{value:$}=a;return $.has(S)}else return v===S}),labelField:c,renderLabel:s,renderOption:r,handleMouseMove:E,handleMouseEnter:R,handleClick:u}},render(){const{clsPrefix:e,tmNode:{rawNode:t},isSelected:i,isPending:l,isGrouped:a,showCheckmark:s,nodeProps:r,renderOption:c,renderLabel:m,handleClick:C,handleMouseEnter:g,handleMouseMove:w}=this,y=en(i,e),h=m?[m(t,i),s&&y]:[te(t[this.labelField],t,i),s&&y],u=r==null?void 0:r(t),R=d("div",Object.assign({},u,{class:[`${e}-base-select-option`,t.class,u==null?void 0:u.class,{[`${e}-base-select-option--disabled`]:t.disabled,[`${e}-base-select-option--selected`]:i,[`${e}-base-select-option--grouped`]:a,[`${e}-base-select-option--pending`]:l,[`${e}-base-select-option--show-checkmark`]:s}],style:[(u==null?void 0:u.style)||"",t.style||""],onClick:D([C,u==null?void 0:u.onClick]),onMouseenter:D([g,u==null?void 0:u.onMouseenter]),onMousemove:D([w,u==null?void 0:u.onMousemove])}),d("div",{class:`${e}-base-select-option__content`},h));return t.render?t.render({node:R,option:t,selected:i}):c?c({node:R,option:t,selected:i}):R}}),Q=_({name:"NBaseSelectGroupHeader",props:{clsPrefix:{type:String,required:!0},tmNode:{type:Object,required:!0}},setup(){const{renderLabelRef:e,renderOptionRef:t,labelFieldRef:i,nodePropsRef:l}=oe(H);return{labelField:i,nodeProps:l,renderLabel:e,renderOption:t}},render(){const{clsPrefix:e,renderLabel:t,renderOption:i,nodeProps:l,tmNode:{rawNode:a}}=this,s=l==null?void 0:l(a),r=t?t(a,!1):te(a[this.labelField],a,!1),c=d("div",Object.assign({},s,{class:[`${e}-base-select-group-header`,s==null?void 0:s.class]}),r);return a.render?a.render({node:c,option:a}):i?i({node:c,option:a,selected:!1}):c}}),nn=x("base-select-menu",`
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
 `,[z("content",`
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
 `),z("loading, empty",`
 display: flex;
 padding: 12px 32px;
 flex: 1;
 justify-content: center;
 `),z("loading",`
 color: var(--n-loading-color);
 font-size: var(--n-loading-size);
 `),z("header",`
 padding: 8px var(--n-option-padding-left);
 font-size: var(--n-option-font-size);
 transition: 
 color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 border-bottom: 1px solid var(--n-action-divider-color);
 color: var(--n-action-text-color);
 `),z("action",`
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
 `,[M("show-checkmark",`
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
 `),M("grouped",`
 padding-left: calc(var(--n-option-padding-left) * 1.5);
 `),M("pending",[O("&::before",`
 background-color: var(--n-option-color-pending);
 `)]),M("selected",`
 color: var(--n-option-text-color-active);
 `,[O("&::before",`
 background-color: var(--n-option-color-active);
 `),M("pending",[O("&::before",`
 background-color: var(--n-option-color-active-pending);
 `)])]),M("disabled",`
 cursor: not-allowed;
 `,[_e("selected",`
 color: var(--n-option-text-color-disabled);
 `),M("selected",`
 opacity: var(--n-option-opacity-disabled);
 `)]),z("check",`
 font-size: 16px;
 position: absolute;
 right: calc(var(--n-option-padding-right) - 4px);
 top: calc(50% - 7px);
 color: var(--n-option-check-color);
 transition: color .3s var(--n-bezier);
 `,[Ue({enterScale:"0.5"})])])]),gn=_({name:"InternalSelectMenu",props:Object.assign(Object.assign({},G.props),{clsPrefix:{type:String,required:!0},scrollable:{type:Boolean,default:!0},treeMate:{type:Object,required:!0},multiple:Boolean,size:{type:String,default:"medium"},value:{type:[String,Number,Array],default:null},autoPending:Boolean,virtualScroll:{type:Boolean,default:!0},show:{type:Boolean,default:!0},labelField:{type:String,default:"label"},valueField:{type:String,default:"value"},loading:Boolean,focusable:Boolean,renderLabel:Function,renderOption:Function,nodeProps:Function,showCheckmark:{type:Boolean,default:!0},onMousedown:Function,onScroll:Function,onFocus:Function,onBlur:Function,onKeyup:Function,onKeydown:Function,onTabOut:Function,onMouseenter:Function,onMouseleave:Function,onResize:Function,resetMenuOnOptionsChange:{type:Boolean,default:!0},inlineThemeDisabled:Boolean,onToggle:Function}),setup(e){const{mergedClsPrefixRef:t,mergedRtlRef:i}=Ee(e),l=Ve("InternalSelectMenu",i,t),a=G("InternalSelectMenu","-internal-select-menu",nn,$e,e,b(e,"clsPrefix")),s=B(null),r=B(null),c=B(null),m=k(()=>e.treeMate.getFlattenedNodes()),C=k(()=>Ze(m.value)),g=B(null);function w(){const{treeMate:n}=e;let o=null;const{value:f}=e;f===null?o=n.getFirstAvailableNode():(e.multiple?o=n.getNode((f||[])[(f||[]).length-1]):o=n.getNode(f),(!o||o.disabled)&&(o=n.getFirstAvailableNode())),P(o||null)}function y(){const{value:n}=g;n&&!e.treeMate.getNode(n.key)&&(g.value=null)}let h;U(()=>e.show,n=>{n?h=U(()=>e.treeMate,()=>{e.resetMenuOnOptionsChange?(e.autoPending?w():y(),Ie(V)):y()},{immediate:!0}):h==null||h()},{immediate:!0}),ne(()=>{h==null||h()});const u=k(()=>Ge(a.value.self[T("optionHeight",e.size)])),R=k(()=>j(a.value.self[T("padding",e.size)])),E=k(()=>e.multiple&&Array.isArray(e.value)?new Set(e.value):new Set),v=k(()=>{const n=m.value;return n&&n.length===0});function p(n){const{onToggle:o}=e;o&&o(n)}function S(n){const{onScroll:o}=e;o&&o(n)}function $(n){var o;(o=c.value)===null||o===void 0||o.sync(),S(n)}function re(){var n;(n=c.value)===null||n===void 0||n.sync()}function le(){const{value:n}=g;return n||null}function ae(n,o){o.disabled||P(o,!1)}function se(n,o){o.disabled||p(o)}function de(n){var o;Z(n,"action")||(o=e.onKeyup)===null||o===void 0||o.call(e,n)}function ce(n){var o;Z(n,"action")||(o=e.onKeydown)===null||o===void 0||o.call(e,n)}function ue(n){var o;(o=e.onMousedown)===null||o===void 0||o.call(e,n),!e.focusable&&n.preventDefault()}function fe(){const{value:n}=g;n&&P(n.getNext({loop:!0}),!0)}function ve(){const{value:n}=g;n&&P(n.getPrev({loop:!0}),!0)}function P(n,o=!1){g.value=n,o&&V()}function V(){var n,o;const f=g.value;if(!f)return;const F=C.value(f.key);F!==null&&(e.virtualScroll?(n=r.value)===null||n===void 0||n.scrollTo({index:F}):(o=c.value)===null||o===void 0||o.scrollTo({index:F,elSize:u.value}))}function pe(n){var o,f;!((o=s.value)===null||o===void 0)&&o.contains(n.target)&&((f=e.onFocus)===null||f===void 0||f.call(e,n))}function ge(n){var o,f;!((o=s.value)===null||o===void 0)&&o.contains(n.relatedTarget)||(f=e.onBlur)===null||f===void 0||f.call(e,n)}W(H,{handleOptionMouseEnter:ae,handleOptionClick:se,valueSetRef:E,pendingTmNodeRef:g,nodePropsRef:b(e,"nodeProps"),showCheckmarkRef:b(e,"showCheckmark"),multipleRef:b(e,"multiple"),valueRef:b(e,"value"),renderLabelRef:b(e,"renderLabel"),renderOptionRef:b(e,"renderOption"),labelFieldRef:b(e,"labelField"),valueFieldRef:b(e,"valueField")}),W(De,s),ee(()=>{const{value:n}=c;n&&n.sync()});const A=k(()=>{const{size:n}=e,{common:{cubicBezierEaseInOut:o},self:{height:f,borderRadius:F,color:me,groupHeaderTextColor:be,actionDividerColor:ye,optionTextColorPressed:xe,optionTextColor:ke,optionTextColorDisabled:Re,optionTextColorActive:Se,optionOpacityDisabled:Me,optionCheckColor:Ne,actionTextColor:ze,optionColorPending:Ce,optionColorActive:we,loadingColor:Pe,loadingSize:Fe,optionColorActivePending:Oe,[T("optionFontSize",n)]:Te,[T("optionHeight",n)]:Be,[T("optionPadding",n)]:I}}=a.value;return{"--n-height":f,"--n-action-divider-color":ye,"--n-action-text-color":ze,"--n-bezier":o,"--n-border-radius":F,"--n-color":me,"--n-option-font-size":Te,"--n-group-header-text-color":be,"--n-option-check-color":Ne,"--n-option-color-pending":Ce,"--n-option-color-active":we,"--n-option-color-active-pending":Oe,"--n-option-height":Be,"--n-option-opacity-disabled":Me,"--n-option-text-color":ke,"--n-option-text-color-active":Se,"--n-option-text-color-disabled":Re,"--n-option-text-color-pressed":xe,"--n-option-padding":I,"--n-option-padding-left":j(I,"left"),"--n-option-padding-right":j(I,"right"),"--n-loading-color":Pe,"--n-loading-size":Fe}}),{inlineThemeDisabled:q}=e,N=q?Ae("internal-select-menu",k(()=>e.size[0]),A,e):void 0,he={selfRef:s,next:fe,prev:ve,getPendingTmNode:le};return Je(s,e.onResize),Object.assign({mergedTheme:a,mergedClsPrefix:t,rtlEnabled:l,virtualListRef:r,scrollbarRef:c,itemSize:u,padding:R,flattenedNodes:m,empty:v,virtualListContainer(){const{value:n}=r;return n==null?void 0:n.listElRef},virtualListContent(){const{value:n}=r;return n==null?void 0:n.itemsElRef},doScroll:S,handleFocusin:pe,handleFocusout:ge,handleKeyUp:de,handleKeyDown:ce,handleMouseDown:ue,handleVirtualListResize:re,handleVirtualListScroll:$,cssVars:q?void 0:A,themeClass:N==null?void 0:N.themeClass,onRender:N==null?void 0:N.onRender},he)},render(){const{$slots:e,virtualScroll:t,clsPrefix:i,mergedTheme:l,themeClass:a,onRender:s}=this;return s==null||s(),d("div",{ref:"selfRef",tabindex:this.focusable?0:-1,class:[`${i}-base-select-menu`,this.rtlEnabled&&`${i}-base-select-menu--rtl`,a,this.multiple&&`${i}-base-select-menu--multiple`],style:this.cssVars,onFocusin:this.handleFocusin,onFocusout:this.handleFocusout,onKeyup:this.handleKeyUp,onKeydown:this.handleKeyDown,onMousedown:this.handleMouseDown,onMouseenter:this.onMouseenter,onMouseleave:this.onMouseleave},Y(e.header,r=>r&&d("div",{class:`${i}-base-select-menu__header`,"data-header":!0,key:"header"},r)),this.loading?d("div",{class:`${i}-base-select-menu__loading`},d(We,{clsPrefix:i,strokeWidth:20})):this.empty?d("div",{class:`${i}-base-select-menu__empty`,"data-empty":!0},qe(e.empty,()=>[d(Xe,{theme:l.peers.Empty,themeOverrides:l.peerOverrides.Empty})])):d(Ye,{ref:"scrollbarRef",theme:l.peers.Scrollbar,themeOverrides:l.peerOverrides.Scrollbar,scrollable:this.scrollable,container:t?this.virtualListContainer:void 0,content:t?this.virtualListContent:void 0,onScroll:t?void 0:this.doScroll},{default:()=>t?d(Ke,{ref:"virtualListRef",class:`${i}-virtual-list`,items:this.flattenedNodes,itemSize:this.itemSize,showScrollbar:!1,paddingTop:this.padding.top,paddingBottom:this.padding.bottom,onResize:this.handleVirtualListResize,onScroll:this.handleVirtualListScroll,itemResizable:!0},{default:({item:r})=>r.isGroup?d(Q,{key:r.key,clsPrefix:i,tmNode:r}):r.ignored?null:d(J,{clsPrefix:i,key:r.key,tmNode:r})}):d("div",{class:`${i}-base-select-menu-option-wrapper`,style:{paddingTop:this.padding.top,paddingBottom:this.padding.bottom}},this.flattenedNodes.map(r=>r.isGroup?d(Q,{key:r.key,clsPrefix:i,tmNode:r}):d(J,{clsPrefix:i,key:r.key,tmNode:r})))}),Y(e.action,r=>r&&[d("div",{class:`${i}-base-select-menu__action`,"data-action":!0,key:"action"},r),d(je,{onFocus:this.onTabOut,key:"focus-detector"})]))}});function L(e){return e.type==="group"}function ie(e){return e.type==="ignored"}function hn(e,t){try{return!!(1+t.toString().toLowerCase().indexOf(e.trim().toLowerCase()))}catch{return!1}}function mn(e,t){return{getIsGroup:L,getIgnored:ie,getKey(l){return L(l)?l.name||l.key||"key-required":l[e]},getChildren(l){return l[t]}}}function bn(e,t,i,l){if(!t)return e;function a(s){if(!Array.isArray(s))return[];const r=[];for(const c of s)if(L(c)){const m=a(c[l]);m.length&&r.push(Object.assign({},c,{[l]:m}))}else{if(ie(c))continue;t(i,c)&&r.push(c)}return r}return a(e)}function yn(e,t,i){const l=new Map;return e.forEach(a=>{L(a)?a[i].forEach(s=>{l.set(s[t],s)}):l.set(a[t],a)}),l}export{Qe as F,gn as N,mn as a,yn as c,bn as f,D as m,hn as p,Je as u};
