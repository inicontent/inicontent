import{f as M,s as c,bW as a,c2 as z,c4 as i,bV as C,bY as X,aA as K,r as $,bp as J,A as y,a$ as U,bX as fe,c6 as le,F as Oe,c5 as te,c3 as G,bJ as he,dC as Me}from"./xEahERNa.js";import{N as be,u as xe,c as F}from"./B9qM5nxZ.js";import{C as _e}from"./Bp_N7X0e.js";import{l as Ce,p as $e,b as Be,c as Le}from"./BeN9aP7I.js";import{u as re,d as Ke,S as je,N as Ve,V as Ue}from"./B0QP0tT1.js";import{i as Q,k as ee,j as De}from"./FpMhCtPb.js";import{r as V}from"./Bf3K2dna.js";import{N as Ge}from"./CbBuwt4R.js";import{N as qe}from"./Ba_0JW1y.js";import{k as ae}from"./HiGXOwLp.js";import{f as Ye}from"./CNt5qD_t.js";import{u as We}from"./CuQvGAkU.js";import{V as Xe}from"./DkZipOsz.js";import{c as oe}from"./DXruQSCb.js";const Je=M({name:"ChevronDownFilled",render(){return c("svg",{viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg"},c("path",{d:"M3.20041 5.73966C3.48226 5.43613 3.95681 5.41856 4.26034 5.70041L8 9.22652L11.7397 5.70041C12.0432 5.41856 12.5177 5.43613 12.7996 5.73966C13.0815 6.0432 13.0639 6.51775 12.7603 6.7996L8.51034 10.7996C8.22258 11.0668 7.77743 11.0668 7.48967 10.7996L3.23966 6.7996C2.93613 6.51775 2.91856 6.0432 3.20041 5.73966Z",fill:"currentColor"}))}}),Ze=a("layout-sider",`
 flex-shrink: 0;
 box-sizing: border-box;
 position: relative;
 z-index: 1;
 color: var(--n-text-color);
 transition:
 color .3s var(--n-bezier),
 border-color .3s var(--n-bezier),
 min-width .3s var(--n-bezier),
 max-width .3s var(--n-bezier),
 transform .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 background-color: var(--n-color);
 display: flex;
 justify-content: flex-end;
`,[z("bordered",[i("border",`
 content: "";
 position: absolute;
 top: 0;
 bottom: 0;
 width: 1px;
 background-color: var(--n-border-color);
 transition: background-color .3s var(--n-bezier);
 `)]),i("left-placement",[z("bordered",[i("border",`
 right: 0;
 `)])]),z("right-placement",`
 justify-content: flex-start;
 `,[z("bordered",[i("border",`
 left: 0;
 `)]),z("collapsed",[a("layout-toggle-button",[a("base-icon",`
 transform: rotate(180deg);
 `)]),a("layout-toggle-bar",[C("&:hover",[i("top",{transform:"rotate(-12deg) scale(1.15) translateY(-2px)"}),i("bottom",{transform:"rotate(12deg) scale(1.15) translateY(2px)"})])])]),a("layout-toggle-button",`
 left: 0;
 transform: translateX(-50%) translateY(-50%);
 `,[a("base-icon",`
 transform: rotate(0);
 `)]),a("layout-toggle-bar",`
 left: -28px;
 transform: rotate(180deg);
 `,[C("&:hover",[i("top",{transform:"rotate(12deg) scale(1.15) translateY(-2px)"}),i("bottom",{transform:"rotate(-12deg) scale(1.15) translateY(2px)"})])])]),z("collapsed",[a("layout-toggle-bar",[C("&:hover",[i("top",{transform:"rotate(-12deg) scale(1.15) translateY(-2px)"}),i("bottom",{transform:"rotate(12deg) scale(1.15) translateY(2px)"})])]),a("layout-toggle-button",[a("base-icon",`
 transform: rotate(0);
 `)])]),a("layout-toggle-button",`
 transition:
 color .3s var(--n-bezier),
 right .3s var(--n-bezier),
 left .3s var(--n-bezier),
 border-color .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 cursor: pointer;
 width: 24px;
 height: 24px;
 position: absolute;
 top: 50%;
 right: 0;
 border-radius: 50%;
 display: flex;
 align-items: center;
 justify-content: center;
 font-size: 18px;
 color: var(--n-toggle-button-icon-color);
 border: var(--n-toggle-button-border);
 background-color: var(--n-toggle-button-color);
 box-shadow: 0 2px 4px 0px rgba(0, 0, 0, .06);
 transform: translateX(50%) translateY(-50%);
 z-index: 1;
 `,[a("base-icon",`
 transition: transform .3s var(--n-bezier);
 transform: rotate(180deg);
 `)]),a("layout-toggle-bar",`
 cursor: pointer;
 height: 72px;
 width: 32px;
 position: absolute;
 top: calc(50% - 36px);
 right: -28px;
 `,[i("top, bottom",`
 position: absolute;
 width: 4px;
 border-radius: 2px;
 height: 38px;
 left: 14px;
 transition: 
 background-color .3s var(--n-bezier),
 transform .3s var(--n-bezier);
 `),i("bottom",`
 position: absolute;
 top: 34px;
 `),C("&:hover",[i("top",{transform:"rotate(12deg) scale(1.15) translateY(-2px)"}),i("bottom",{transform:"rotate(-12deg) scale(1.15) translateY(2px)"})]),i("top, bottom",{backgroundColor:"var(--n-toggle-bar-color)"}),C("&:hover",[i("top, bottom",{backgroundColor:"var(--n-toggle-bar-color-hover)"})])]),i("border",`
 position: absolute;
 top: 0;
 right: 0;
 bottom: 0;
 width: 1px;
 transition: background-color .3s var(--n-bezier);
 `),a("layout-sider-scroll-container",`
 flex-grow: 1;
 flex-shrink: 0;
 box-sizing: border-box;
 height: 100%;
 opacity: 0;
 transition: opacity .3s var(--n-bezier);
 max-width: 100%;
 `),z("show-content",[a("layout-sider-scroll-container",{opacity:1})]),z("absolute-positioned",`
 position: absolute;
 left: 0;
 top: 0;
 bottom: 0;
 `)]),Qe=M({name:"LayoutToggleButton",props:{clsPrefix:{type:String,required:!0},onClick:Function},render(){const{clsPrefix:e}=this;return c("div",{class:`${e}-layout-toggle-button`,onClick:this.onClick},c(be,{clsPrefix:e},{default:()=>c(_e,null)}))}}),eo=M({props:{clsPrefix:{type:String,required:!0},onClick:Function},render(){const{clsPrefix:e}=this;return c("div",{onClick:this.onClick,class:`${e}-layout-toggle-bar`},c("div",{class:`${e}-layout-toggle-bar__top`}),c("div",{class:`${e}-layout-toggle-bar__bottom`}))}}),oo={position:$e,bordered:Boolean,collapsedWidth:{type:Number,default:48},width:{type:[Number,String],default:272},contentClass:String,contentStyle:{type:[String,Object],default:""},collapseMode:{type:String,default:"transform"},collapsed:{type:Boolean,default:void 0},defaultCollapsed:Boolean,showCollapsedContent:{type:Boolean,default:!0},showTrigger:{type:[Boolean,String],default:!1},nativeScrollbar:{type:Boolean,default:!0},inverted:Boolean,scrollbarProps:Object,triggerClass:String,triggerStyle:[String,Object],collapsedTriggerClass:String,collapsedTriggerStyle:[String,Object],"onUpdate:collapsed":[Function,Array],onUpdateCollapsed:[Function,Array],onAfterEnter:Function,onAfterLeave:Function,onExpand:[Function,Array],onCollapse:[Function,Array],onScroll:Function},Ro=M({name:"LayoutSider",props:Object.assign(Object.assign({},X.props),oo),setup(e){const n=K(Be),r=$(null),d=$(null),s=$(e.defaultCollapsed),u=re(J(e,"collapsed"),s),m=y(()=>Q(u.value?e.collapsedWidth:e.width)),g=y(()=>e.collapseMode!=="transform"?{}:{minWidth:Q(e.width)}),h=y(()=>n?n.siderPlacement:"left");function R(w,b){if(e.nativeScrollbar){const{value:x}=r;x&&(b===void 0?x.scrollTo(w):x.scrollTo(w,b))}else{const{value:x}=d;x&&x.scrollTo(w,b)}}function k(){const{"onUpdate:collapsed":w,onUpdateCollapsed:b,onExpand:x,onCollapse:L}=e,{value:_}=u;b&&F(b,!_),w&&F(w,!_),s.value=!_,_?x&&F(x):L&&F(L)}let S=0,p=0;const N=w=>{var b;const x=w.target;S=x.scrollLeft,p=x.scrollTop,(b=e.onScroll)===null||b===void 0||b.call(e,w)};Ke(()=>{if(e.nativeScrollbar){const w=r.value;w&&(w.scrollTop=p,w.scrollLeft=S)}}),U(Ce,{collapsedRef:u,collapseModeRef:J(e,"collapseMode")});const{mergedClsPrefixRef:A,inlineThemeDisabled:P}=fe(e),H=X("Layout","-layout-sider",Ze,Le,e,A);function O(w){var b,x;w.propertyName==="max-width"&&(u.value?(b=e.onAfterLeave)===null||b===void 0||b.call(e):(x=e.onAfterEnter)===null||x===void 0||x.call(e))}const D={scrollTo:R},B=y(()=>{const{common:{cubicBezierEaseInOut:w},self:b}=H.value,{siderToggleButtonColor:x,siderToggleButtonBorder:L,siderToggleBarColor:_,siderToggleBarColorHover:Z}=b,T={"--n-bezier":w,"--n-toggle-button-color":x,"--n-toggle-button-border":L,"--n-toggle-bar-color":_,"--n-toggle-bar-color-hover":Z};return e.inverted?(T["--n-color"]=b.siderColorInverted,T["--n-text-color"]=b.textColorInverted,T["--n-border-color"]=b.siderBorderColorInverted,T["--n-toggle-button-icon-color"]=b.siderToggleButtonIconColorInverted,T.__invertScrollbar=b.__invertScrollbar):(T["--n-color"]=b.siderColor,T["--n-text-color"]=b.textColor,T["--n-border-color"]=b.siderBorderColor,T["--n-toggle-button-icon-color"]=b.siderToggleButtonIconColor),T}),E=P?xe("layout-sider",y(()=>e.inverted?"a":"b"),B,e):void 0;return Object.assign({scrollableElRef:r,scrollbarInstRef:d,mergedClsPrefix:A,mergedTheme:H,styleMaxWidth:m,mergedCollapsed:u,scrollContainerStyle:g,siderPlacement:h,handleNativeElScroll:N,handleTransitionend:O,handleTriggerClick:k,inlineThemeDisabled:P,cssVars:B,themeClass:E==null?void 0:E.themeClass,onRender:E==null?void 0:E.onRender},D)},render(){var e;const{mergedClsPrefix:n,mergedCollapsed:r,showTrigger:d}=this;return(e=this.onRender)===null||e===void 0||e.call(this),c("aside",{class:[`${n}-layout-sider`,this.themeClass,`${n}-layout-sider--${this.position}-positioned`,`${n}-layout-sider--${this.siderPlacement}-placement`,this.bordered&&`${n}-layout-sider--bordered`,r&&`${n}-layout-sider--collapsed`,(!r||this.showCollapsedContent)&&`${n}-layout-sider--show-content`],onTransitionend:this.handleTransitionend,style:[this.inlineThemeDisabled?void 0:this.cssVars,{maxWidth:this.styleMaxWidth,width:Q(this.width)}]},this.nativeScrollbar?c("div",{class:[`${n}-layout-sider-scroll-container`,this.contentClass],onScroll:this.handleNativeElScroll,style:[this.scrollContainerStyle,{overflow:"auto"},this.contentStyle],ref:"scrollableElRef"},this.$slots):c(je,Object.assign({},this.scrollbarProps,{onScroll:this.onScroll,ref:"scrollbarInstRef",style:this.scrollContainerStyle,contentStyle:this.contentStyle,contentClass:this.contentClass,theme:this.mergedTheme.peers.Scrollbar,themeOverrides:this.mergedTheme.peerOverrides.Scrollbar,builtinThemeOverrides:this.inverted&&this.cssVars.__invertScrollbar==="true"?{colorHover:"rgba(255, 255, 255, .4)",color:"rgba(255, 255, 255, .3)"}:void 0}),this.$slots),d?d==="bar"?c(eo,{clsPrefix:n,class:r?this.collapsedTriggerClass:this.triggerClass,style:r?this.collapsedTriggerStyle:this.triggerStyle,onClick:this.handleTriggerClick}):c(Qe,{clsPrefix:n,class:r?this.collapsedTriggerClass:this.triggerClass,style:r?this.collapsedTriggerStyle:this.triggerStyle,onClick:this.handleTriggerClick}):null,this.bordered?c("div",{class:`${n}-layout-sider__border`}):null)}}),q=le("n-menu"),ce=le("n-submenu"),de=le("n-menu-item-group"),W=8;function se(e){const n=K(q),{props:r,mergedCollapsedRef:d}=n,s=K(ce,null),u=K(de,null),m=y(()=>r.mode==="horizontal"),g=y(()=>m.value?r.dropdownPlacement:"tmNodes"in e?"right-start":"right"),h=y(()=>{var p;return Math.max((p=r.collapsedIconSize)!==null&&p!==void 0?p:r.iconSize,r.iconSize)}),R=y(()=>{var p;return!m.value&&e.root&&d.value&&(p=r.collapsedIconSize)!==null&&p!==void 0?p:r.iconSize}),k=y(()=>{if(m.value)return;const{collapsedWidth:p,indent:N,rootIndent:A}=r,{root:P,isGroup:H}=e,O=A===void 0?N:A;return P?d.value?p/2-h.value/2:O:u&&typeof u.paddingLeftRef.value=="number"?N/2+u.paddingLeftRef.value:s&&typeof s.paddingLeftRef.value=="number"?(H?N/2:N)+s.paddingLeftRef.value:0}),S=y(()=>{const{collapsedWidth:p,indent:N,rootIndent:A}=r,{value:P}=h,{root:H}=e;return m.value||!H||!d.value?W:(A===void 0?N:A)+P+W-(p+P)/2});return{dropdownPlacement:g,activeIconSize:R,maxIconSize:h,paddingLeft:k,iconMarginRight:S,NMenu:n,NSubmenu:s}}const ue={internalKey:{type:[String,Number],required:!0},root:Boolean,isGroup:Boolean,level:{type:Number,required:!0},title:[String,Function],extra:[String,Function]},ye=Object.assign(Object.assign({},ue),{tmNode:{type:Object,required:!0},tmNodes:{type:Array,required:!0}}),to=M({name:"MenuOptionGroup",props:ye,setup(e){U(ce,null);const n=se(e);U(de,{paddingLeftRef:n.paddingLeft});const{mergedClsPrefixRef:r,props:d}=K(q);return function(){const{value:s}=r,u=n.paddingLeft.value,{nodeProps:m}=d,g=m==null?void 0:m(e.tmNode.rawNode);return c("div",{class:`${s}-menu-item-group`,role:"group"},c("div",Object.assign({},g,{class:[`${s}-menu-item-group-title`,g==null?void 0:g.class],style:[(g==null?void 0:g.style)||"",u!==void 0?`padding-left: ${u}px;`:""]}),V(e.title),e.extra?c(Oe,null," ",V(e.extra)):null),c("div",null,e.tmNodes.map(h=>ve(h,d))))}}}),ze=M({name:"MenuOptionContent",props:{collapsed:Boolean,disabled:Boolean,title:[String,Function],icon:Function,extra:[String,Function],showArrow:Boolean,childActive:Boolean,hover:Boolean,paddingLeft:Number,selected:Boolean,maxIconSize:{type:Number,required:!0},activeIconSize:{type:Number,required:!0},iconMarginRight:{type:Number,required:!0},clsPrefix:{type:String,required:!0},onClick:Function,tmNode:{type:Object,required:!0},isEllipsisPlaceholder:Boolean},setup(e){const{props:n}=K(q);return{menuProps:n,style:y(()=>{const{paddingLeft:r}=e;return{paddingLeft:r&&`${r}px`}}),iconStyle:y(()=>{const{maxIconSize:r,activeIconSize:d,iconMarginRight:s}=e;return{width:`${r}px`,height:`${r}px`,fontSize:`${d}px`,marginRight:`${s}px`}})}},render(){const{clsPrefix:e,tmNode:n,menuProps:{renderIcon:r,renderLabel:d,renderExtra:s,expandIcon:u}}=this,m=r?r(n.rawNode):V(this.icon);return c("div",{onClick:g=>{var h;(h=this.onClick)===null||h===void 0||h.call(this,g)},role:"none",class:[`${e}-menu-item-content`,{[`${e}-menu-item-content--selected`]:this.selected,[`${e}-menu-item-content--collapsed`]:this.collapsed,[`${e}-menu-item-content--child-active`]:this.childActive,[`${e}-menu-item-content--disabled`]:this.disabled,[`${e}-menu-item-content--hover`]:this.hover}],style:this.style},m&&c("div",{class:`${e}-menu-item-content__icon`,style:this.iconStyle,role:"none"},[m]),c("div",{class:`${e}-menu-item-content-header`,role:"none"},this.isEllipsisPlaceholder?this.title:d?d(n.rawNode):V(this.title),this.extra||s?c("span",{class:`${e}-menu-item-content-header__extra`}," ",s?s(n.rawNode):V(this.extra)):null),this.showArrow?c(be,{ariaHidden:!0,class:`${e}-menu-item-content__arrow`,clsPrefix:e},{default:()=>u?u(n.rawNode):c(Je,null)}):null)}}),Ie=Object.assign(Object.assign({},ue),{rawNodes:{type:Array,default:()=>[]},tmNodes:{type:Array,default:()=>[]},tmNode:{type:Object,required:!0},disabled:Boolean,icon:Function,onClick:Function,domId:String,virtualChildActive:{type:Boolean,default:void 0},isEllipsisPlaceholder:Boolean}),ne=M({name:"Submenu",props:Ie,setup(e){const n=se(e),{NMenu:r,NSubmenu:d}=n,{props:s,mergedCollapsedRef:u,mergedThemeRef:m}=r,g=y(()=>{const{disabled:p}=e;return d!=null&&d.mergedDisabledRef.value||s.disabled?!0:p}),h=$(!1);U(ce,{paddingLeftRef:n.paddingLeft,mergedDisabledRef:g}),U(de,null);function R(){const{onClick:p}=e;p&&p()}function k(){g.value||(u.value||r.toggleExpand(e.internalKey),R())}function S(p){h.value=p}return{menuProps:s,mergedTheme:m,doSelect:r.doSelect,inverted:r.invertedRef,isHorizontal:r.isHorizontalRef,mergedClsPrefix:r.mergedClsPrefixRef,maxIconSize:n.maxIconSize,activeIconSize:n.activeIconSize,iconMarginRight:n.iconMarginRight,dropdownPlacement:n.dropdownPlacement,dropdownShow:h,paddingLeft:n.paddingLeft,mergedDisabled:g,mergedValue:r.mergedValueRef,childActive:te(()=>{var p;return(p=e.virtualChildActive)!==null&&p!==void 0?p:r.activePathRef.value.includes(e.internalKey)}),collapsed:y(()=>s.mode==="horizontal"?!1:u.value?!0:!r.mergedExpandedKeysRef.value.includes(e.internalKey)),dropdownEnabled:y(()=>!g.value&&(s.mode==="horizontal"||u.value)),handlePopoverShowChange:S,handleClick:k}},render(){var e;const{mergedClsPrefix:n,menuProps:{renderIcon:r,renderLabel:d}}=this,s=()=>{const{isHorizontal:m,paddingLeft:g,collapsed:h,mergedDisabled:R,maxIconSize:k,activeIconSize:S,title:p,childActive:N,icon:A,handleClick:P,menuProps:{nodeProps:H},dropdownShow:O,iconMarginRight:D,tmNode:B,mergedClsPrefix:E,isEllipsisPlaceholder:w,extra:b}=this,x=H==null?void 0:H(B.rawNode);return c("div",Object.assign({},x,{class:[`${E}-menu-item`,x==null?void 0:x.class],role:"menuitem"}),c(ze,{tmNode:B,paddingLeft:g,collapsed:h,disabled:R,iconMarginRight:D,maxIconSize:k,activeIconSize:S,title:p,extra:b,showArrow:!m,childActive:N,clsPrefix:E,icon:A,hover:O,onClick:P,isEllipsisPlaceholder:w}))},u=()=>c(Ve,null,{default:()=>{const{tmNodes:m,collapsed:g}=this;return g?null:c("div",{class:`${n}-submenu-children`,role:"menu"},m.map(h=>ve(h,this.menuProps)))}});return this.root?c(Ge,Object.assign({size:"large",trigger:"hover"},(e=this.menuProps)===null||e===void 0?void 0:e.dropdownProps,{themeOverrides:this.mergedTheme.peerOverrides.Dropdown,theme:this.mergedTheme.peers.Dropdown,builtinThemeOverrides:{fontSizeLarge:"14px",optionIconSizeLarge:"18px"},value:this.mergedValue,disabled:!this.dropdownEnabled,placement:this.dropdownPlacement,keyField:this.menuProps.keyField,labelField:this.menuProps.labelField,childrenField:this.menuProps.childrenField,onUpdateShow:this.handlePopoverShowChange,options:this.rawNodes,onSelect:this.doSelect,inverted:this.inverted,renderIcon:r,renderLabel:d}),{default:()=>c("div",{class:`${n}-submenu`,role:"menu","aria-expanded":!this.collapsed,id:this.domId},s(),this.isHorizontal?null:u())}):c("div",{class:`${n}-submenu`,role:"menu","aria-expanded":!this.collapsed,id:this.domId},s(),u())}}),we=Object.assign(Object.assign({},ue),{tmNode:{type:Object,required:!0},disabled:Boolean,icon:Function,onClick:Function}),ro=M({name:"MenuOption",props:we,setup(e){const n=se(e),{NSubmenu:r,NMenu:d}=n,{props:s,mergedClsPrefixRef:u,mergedCollapsedRef:m}=d,g=r?r.mergedDisabledRef:{value:!1},h=y(()=>g.value||e.disabled);function R(S){const{onClick:p}=e;p&&p(S)}function k(S){h.value||(d.doSelect(e.internalKey,e.tmNode.rawNode),R(S))}return{mergedClsPrefix:u,dropdownPlacement:n.dropdownPlacement,paddingLeft:n.paddingLeft,iconMarginRight:n.iconMarginRight,maxIconSize:n.maxIconSize,activeIconSize:n.activeIconSize,mergedTheme:d.mergedThemeRef,menuProps:s,dropdownEnabled:te(()=>e.root&&m.value&&s.mode!=="horizontal"&&!h.value),selected:te(()=>d.mergedValueRef.value===e.internalKey),mergedDisabled:h,handleClick:k}},render(){const{mergedClsPrefix:e,mergedTheme:n,tmNode:r,menuProps:{renderLabel:d,nodeProps:s}}=this,u=s==null?void 0:s(r.rawNode);return c("div",Object.assign({},u,{role:"menuitem",class:[`${e}-menu-item`,u==null?void 0:u.class]}),c(qe,{theme:n.peers.Tooltip,themeOverrides:n.peerOverrides.Tooltip,trigger:"hover",placement:this.dropdownPlacement,disabled:!this.dropdownEnabled||this.title===void 0,internalExtraClass:["menu-tooltip"]},{default:()=>d?d(r.rawNode):V(this.title),trigger:()=>c(ze,{tmNode:r,clsPrefix:e,paddingLeft:this.paddingLeft,iconMarginRight:this.iconMarginRight,maxIconSize:this.maxIconSize,activeIconSize:this.activeIconSize,selected:this.selected,title:this.title,extra:this.extra,disabled:this.mergedDisabled,icon:this.icon,onClick:this.handleClick})}))}}),no=M({name:"MenuDivider",setup(){const e=K(q),{mergedClsPrefixRef:n,isHorizontalRef:r}=e;return()=>r.value?null:c("div",{class:`${n.value}-menu-divider`})}}),io=ae(ye),lo=ae(we),ao=ae(Ie);function ie(e){return e.type==="divider"||e.type==="render"}function co(e){return e.type==="divider"}function ve(e,n){const{rawNode:r}=e,{show:d}=r;if(d===!1)return null;if(ie(r))return co(r)?c(no,Object.assign({key:e.key},r.props)):null;const{labelField:s}=n,{key:u,level:m,isGroup:g}=e,h=Object.assign(Object.assign({},r),{title:r.title||r[s],extra:r.titleExtra||r.extra,key:u,internalKey:u,level:m,root:m===0,isGroup:g});return e.children?e.isGroup?c(to,ee(h,io,{tmNode:e,tmNodes:e.children,key:u})):c(ne,ee(h,ao,{key:u,rawNodes:r[n.childrenField],tmNodes:e.children,tmNode:e})):c(ro,ee(h,lo,{key:u,tmNode:e}))}const pe=[C("&::before","background-color: var(--n-item-color-hover);"),i("arrow",`
 color: var(--n-arrow-color-hover);
 `),i("icon",`
 color: var(--n-item-icon-color-hover);
 `),a("menu-item-content-header",`
 color: var(--n-item-text-color-hover);
 `,[C("a",`
 color: var(--n-item-text-color-hover);
 `),i("extra",`
 color: var(--n-item-text-color-hover);
 `)])],ge=[i("icon",`
 color: var(--n-item-icon-color-hover-horizontal);
 `),a("menu-item-content-header",`
 color: var(--n-item-text-color-hover-horizontal);
 `,[C("a",`
 color: var(--n-item-text-color-hover-horizontal);
 `),i("extra",`
 color: var(--n-item-text-color-hover-horizontal);
 `)])],so=C([a("menu",`
 background-color: var(--n-color);
 color: var(--n-item-text-color);
 overflow: hidden;
 transition: background-color .3s var(--n-bezier);
 box-sizing: border-box;
 font-size: var(--n-font-size);
 padding-bottom: 6px;
 `,[z("horizontal",`
 max-width: 100%;
 width: 100%;
 display: flex;
 overflow: hidden;
 padding-bottom: 0;
 `,[a("submenu","margin: 0;"),a("menu-item","margin: 0;"),a("menu-item-content",`
 padding: 0 20px;
 border-bottom: 2px solid #0000;
 `,[C("&::before","display: none;"),z("selected","border-bottom: 2px solid var(--n-border-color-horizontal)")]),a("menu-item-content",[z("selected",[i("icon","color: var(--n-item-icon-color-active-horizontal);"),a("menu-item-content-header",`
 color: var(--n-item-text-color-active-horizontal);
 `,[C("a","color: var(--n-item-text-color-active-horizontal);"),i("extra","color: var(--n-item-text-color-active-horizontal);")])]),z("child-active",`
 border-bottom: 2px solid var(--n-border-color-horizontal);
 `,[a("menu-item-content-header",`
 color: var(--n-item-text-color-child-active-horizontal);
 `,[C("a",`
 color: var(--n-item-text-color-child-active-horizontal);
 `),i("extra",`
 color: var(--n-item-text-color-child-active-horizontal);
 `)]),i("icon",`
 color: var(--n-item-icon-color-child-active-horizontal);
 `)]),G("disabled",[G("selected, child-active",[C("&:focus-within",ge)]),z("selected",[j(null,[i("icon","color: var(--n-item-icon-color-active-hover-horizontal);"),a("menu-item-content-header",`
 color: var(--n-item-text-color-active-hover-horizontal);
 `,[C("a","color: var(--n-item-text-color-active-hover-horizontal);"),i("extra","color: var(--n-item-text-color-active-hover-horizontal);")])])]),z("child-active",[j(null,[i("icon","color: var(--n-item-icon-color-child-active-hover-horizontal);"),a("menu-item-content-header",`
 color: var(--n-item-text-color-child-active-hover-horizontal);
 `,[C("a","color: var(--n-item-text-color-child-active-hover-horizontal);"),i("extra","color: var(--n-item-text-color-child-active-hover-horizontal);")])])]),j("border-bottom: 2px solid var(--n-border-color-horizontal);",ge)]),a("menu-item-content-header",[C("a","color: var(--n-item-text-color-horizontal);")])])]),G("responsive",[a("menu-item-content-header",`
 overflow: hidden;
 text-overflow: ellipsis;
 `)]),z("collapsed",[a("menu-item-content",[z("selected",[C("&::before",`
 background-color: var(--n-item-color-active-collapsed) !important;
 `)]),a("menu-item-content-header","opacity: 0;"),i("arrow","opacity: 0;"),i("icon","color: var(--n-item-icon-color-collapsed);")])]),a("menu-item",`
 height: var(--n-item-height);
 margin-top: 6px;
 position: relative;
 `),a("menu-item-content",`
 box-sizing: border-box;
 line-height: 1.75;
 height: 100%;
 display: grid;
 grid-template-areas: "icon content arrow";
 grid-template-columns: auto 1fr auto;
 align-items: center;
 cursor: pointer;
 position: relative;
 padding-right: 18px;
 transition:
 background-color .3s var(--n-bezier),
 padding-left .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 `,[C("> *","z-index: 1;"),C("&::before",`
 z-index: auto;
 content: "";
 background-color: #0000;
 position: absolute;
 left: 8px;
 right: 8px;
 top: 0;
 bottom: 0;
 pointer-events: none;
 border-radius: var(--n-border-radius);
 transition: background-color .3s var(--n-bezier);
 `),z("disabled",`
 opacity: .45;
 cursor: not-allowed;
 `),z("collapsed",[i("arrow","transform: rotate(0);")]),z("selected",[C("&::before","background-color: var(--n-item-color-active);"),i("arrow","color: var(--n-arrow-color-active);"),i("icon","color: var(--n-item-icon-color-active);"),a("menu-item-content-header",`
 color: var(--n-item-text-color-active);
 `,[C("a","color: var(--n-item-text-color-active);"),i("extra","color: var(--n-item-text-color-active);")])]),z("child-active",[a("menu-item-content-header",`
 color: var(--n-item-text-color-child-active);
 `,[C("a",`
 color: var(--n-item-text-color-child-active);
 `),i("extra",`
 color: var(--n-item-text-color-child-active);
 `)]),i("arrow",`
 color: var(--n-arrow-color-child-active);
 `),i("icon",`
 color: var(--n-item-icon-color-child-active);
 `)]),G("disabled",[G("selected, child-active",[C("&:focus-within",pe)]),z("selected",[j(null,[i("arrow","color: var(--n-arrow-color-active-hover);"),i("icon","color: var(--n-item-icon-color-active-hover);"),a("menu-item-content-header",`
 color: var(--n-item-text-color-active-hover);
 `,[C("a","color: var(--n-item-text-color-active-hover);"),i("extra","color: var(--n-item-text-color-active-hover);")])])]),z("child-active",[j(null,[i("arrow","color: var(--n-arrow-color-child-active-hover);"),i("icon","color: var(--n-item-icon-color-child-active-hover);"),a("menu-item-content-header",`
 color: var(--n-item-text-color-child-active-hover);
 `,[C("a","color: var(--n-item-text-color-child-active-hover);"),i("extra","color: var(--n-item-text-color-child-active-hover);")])])]),z("selected",[j(null,[C("&::before","background-color: var(--n-item-color-active-hover);")])]),j(null,pe)]),i("icon",`
 grid-area: icon;
 color: var(--n-item-icon-color);
 transition:
 color .3s var(--n-bezier),
 font-size .3s var(--n-bezier),
 margin-right .3s var(--n-bezier);
 box-sizing: content-box;
 display: inline-flex;
 align-items: center;
 justify-content: center;
 `),i("arrow",`
 grid-area: arrow;
 font-size: 16px;
 color: var(--n-arrow-color);
 transform: rotate(180deg);
 opacity: 1;
 transition:
 color .3s var(--n-bezier),
 transform 0.2s var(--n-bezier),
 opacity 0.2s var(--n-bezier);
 `),a("menu-item-content-header",`
 grid-area: content;
 transition:
 color .3s var(--n-bezier),
 opacity .3s var(--n-bezier);
 opacity: 1;
 white-space: nowrap;
 color: var(--n-item-text-color);
 `,[C("a",`
 outline: none;
 text-decoration: none;
 transition: color .3s var(--n-bezier);
 color: var(--n-item-text-color);
 `,[C("&::before",`
 content: "";
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 `)]),i("extra",`
 font-size: .93em;
 color: var(--n-group-text-color);
 transition: color .3s var(--n-bezier);
 `)])]),a("submenu",`
 cursor: pointer;
 position: relative;
 margin-top: 6px;
 `,[a("menu-item-content",`
 height: var(--n-item-height);
 `),a("submenu-children",`
 overflow: hidden;
 padding: 0;
 `,[Ye({duration:".2s"})])]),a("menu-item-group",[a("menu-item-group-title",`
 margin-top: 6px;
 color: var(--n-group-text-color);
 cursor: default;
 font-size: .93em;
 height: 36px;
 display: flex;
 align-items: center;
 transition:
 padding-left .3s var(--n-bezier),
 color .3s var(--n-bezier);
 `)])]),a("menu-tooltip",[C("a",`
 color: inherit;
 text-decoration: none;
 `)]),a("menu-divider",`
 transition: background-color .3s var(--n-bezier);
 background-color: var(--n-divider-color);
 height: 1px;
 margin: 6px 18px;
 `)]);function j(e,n){return[z("hover",e,n),C("&:hover",e,n)]}const uo=Object.assign(Object.assign({},X.props),{options:{type:Array,default:()=>[]},collapsed:{type:Boolean,default:void 0},collapsedWidth:{type:Number,default:48},iconSize:{type:Number,default:20},collapsedIconSize:{type:Number,default:24},rootIndent:Number,indent:{type:Number,default:32},labelField:{type:String,default:"label"},keyField:{type:String,default:"key"},childrenField:{type:String,default:"children"},disabledField:{type:String,default:"disabled"},defaultExpandAll:Boolean,defaultExpandedKeys:Array,expandedKeys:Array,value:[String,Number],defaultValue:{type:[String,Number],default:null},mode:{type:String,default:"vertical"},watchProps:{type:Array,default:void 0},disabled:Boolean,show:{type:Boolean,default:!0},inverted:Boolean,"onUpdate:expandedKeys":[Function,Array],onUpdateExpandedKeys:[Function,Array],onUpdateValue:[Function,Array],"onUpdate:value":[Function,Array],expandIcon:Function,renderIcon:Function,renderLabel:Function,renderExtra:Function,dropdownProps:Object,accordion:Boolean,nodeProps:Function,dropdownPlacement:{type:String,default:"bottom"},responsive:Boolean,items:Array,onOpenNamesChange:[Function,Array],onSelect:[Function,Array],onExpandedNamesChange:[Function,Array],expandedNames:Array,defaultExpandedNames:Array}),Po=M({name:"Menu",props:uo,setup(e){const{mergedClsPrefixRef:n,inlineThemeDisabled:r}=fe(e),d=X("Menu","-menu",so,Me,e,n),s=K(Ce,null),u=y(()=>{var l;const{collapsed:f}=e;if(f!==void 0)return f;if(s){const{collapseModeRef:o,collapsedRef:v}=s;if(o.value==="width")return(l=v.value)!==null&&l!==void 0?l:!1}return!1}),m=y(()=>{const{keyField:l,childrenField:f,disabledField:o}=e;return oe(e.items||e.options,{getIgnored(v){return ie(v)},getChildren(v){return v[f]},getDisabled(v){return v[o]},getKey(v){var I;return(I=v[l])!==null&&I!==void 0?I:v.name}})}),g=y(()=>new Set(m.value.treeNodes.map(l=>l.key))),{watchProps:h}=e,R=$(null);h!=null&&h.includes("defaultValue")?he(()=>{R.value=e.defaultValue}):R.value=e.defaultValue;const k=J(e,"value"),S=re(k,R),p=$([]),N=()=>{p.value=e.defaultExpandAll?m.value.getNonLeafKeys():e.defaultExpandedNames||e.defaultExpandedKeys||m.value.getPath(S.value,{includeSelf:!1}).keyPath};h!=null&&h.includes("defaultExpandedKeys")?he(N):N();const A=We(e,["expandedNames","expandedKeys"]),P=re(A,p),H=y(()=>m.value.treeNodes),O=y(()=>m.value.getPath(S.value).keyPath);U(q,{props:e,mergedCollapsedRef:u,mergedThemeRef:d,mergedValueRef:S,mergedExpandedKeysRef:P,activePathRef:O,mergedClsPrefixRef:n,isHorizontalRef:y(()=>e.mode==="horizontal"),invertedRef:J(e,"inverted"),doSelect:D,toggleExpand:E});function D(l,f){const{"onUpdate:value":o,onUpdateValue:v,onSelect:I}=e;v&&F(v,l,f),o&&F(o,l,f),I&&F(I,l,f),R.value=l}function B(l){const{"onUpdate:expandedKeys":f,onUpdateExpandedKeys:o,onExpandedNamesChange:v,onOpenNamesChange:I}=e;f&&F(f,l),o&&F(o,l),v&&F(v,l),I&&F(I,l),p.value=l}function E(l){const f=Array.from(P.value),o=f.findIndex(v=>v===l);if(~o)f.splice(o,1);else{if(e.accordion&&g.value.has(l)){const v=f.findIndex(I=>g.value.has(I));v>-1&&f.splice(v,1)}f.push(l)}B(f)}const w=l=>{const f=m.value.getPath(l??S.value,{includeSelf:!1}).keyPath;if(!f.length)return;const o=Array.from(P.value),v=new Set([...o,...f]);e.accordion&&g.value.forEach(I=>{v.has(I)&&!f.includes(I)&&v.delete(I)}),B(Array.from(v))},b=y(()=>{const{inverted:l}=e,{common:{cubicBezierEaseInOut:f},self:o}=d.value,{borderRadius:v,borderColorHorizontal:I,fontSize:ke,itemHeight:Ee,dividerColor:Fe}=o,t={"--n-divider-color":Fe,"--n-bezier":f,"--n-font-size":ke,"--n-border-color-horizontal":I,"--n-border-radius":v,"--n-item-height":Ee};return l?(t["--n-group-text-color"]=o.groupTextColorInverted,t["--n-color"]=o.colorInverted,t["--n-item-text-color"]=o.itemTextColorInverted,t["--n-item-text-color-hover"]=o.itemTextColorHoverInverted,t["--n-item-text-color-active"]=o.itemTextColorActiveInverted,t["--n-item-text-color-child-active"]=o.itemTextColorChildActiveInverted,t["--n-item-text-color-child-active-hover"]=o.itemTextColorChildActiveInverted,t["--n-item-text-color-active-hover"]=o.itemTextColorActiveHoverInverted,t["--n-item-icon-color"]=o.itemIconColorInverted,t["--n-item-icon-color-hover"]=o.itemIconColorHoverInverted,t["--n-item-icon-color-active"]=o.itemIconColorActiveInverted,t["--n-item-icon-color-active-hover"]=o.itemIconColorActiveHoverInverted,t["--n-item-icon-color-child-active"]=o.itemIconColorChildActiveInverted,t["--n-item-icon-color-child-active-hover"]=o.itemIconColorChildActiveHoverInverted,t["--n-item-icon-color-collapsed"]=o.itemIconColorCollapsedInverted,t["--n-item-text-color-horizontal"]=o.itemTextColorHorizontalInverted,t["--n-item-text-color-hover-horizontal"]=o.itemTextColorHoverHorizontalInverted,t["--n-item-text-color-active-horizontal"]=o.itemTextColorActiveHorizontalInverted,t["--n-item-text-color-child-active-horizontal"]=o.itemTextColorChildActiveHorizontalInverted,t["--n-item-text-color-child-active-hover-horizontal"]=o.itemTextColorChildActiveHoverHorizontalInverted,t["--n-item-text-color-active-hover-horizontal"]=o.itemTextColorActiveHoverHorizontalInverted,t["--n-item-icon-color-horizontal"]=o.itemIconColorHorizontalInverted,t["--n-item-icon-color-hover-horizontal"]=o.itemIconColorHoverHorizontalInverted,t["--n-item-icon-color-active-horizontal"]=o.itemIconColorActiveHorizontalInverted,t["--n-item-icon-color-active-hover-horizontal"]=o.itemIconColorActiveHoverHorizontalInverted,t["--n-item-icon-color-child-active-horizontal"]=o.itemIconColorChildActiveHorizontalInverted,t["--n-item-icon-color-child-active-hover-horizontal"]=o.itemIconColorChildActiveHoverHorizontalInverted,t["--n-arrow-color"]=o.arrowColorInverted,t["--n-arrow-color-hover"]=o.arrowColorHoverInverted,t["--n-arrow-color-active"]=o.arrowColorActiveInverted,t["--n-arrow-color-active-hover"]=o.arrowColorActiveHoverInverted,t["--n-arrow-color-child-active"]=o.arrowColorChildActiveInverted,t["--n-arrow-color-child-active-hover"]=o.arrowColorChildActiveHoverInverted,t["--n-item-color-hover"]=o.itemColorHoverInverted,t["--n-item-color-active"]=o.itemColorActiveInverted,t["--n-item-color-active-hover"]=o.itemColorActiveHoverInverted,t["--n-item-color-active-collapsed"]=o.itemColorActiveCollapsedInverted):(t["--n-group-text-color"]=o.groupTextColor,t["--n-color"]=o.color,t["--n-item-text-color"]=o.itemTextColor,t["--n-item-text-color-hover"]=o.itemTextColorHover,t["--n-item-text-color-active"]=o.itemTextColorActive,t["--n-item-text-color-child-active"]=o.itemTextColorChildActive,t["--n-item-text-color-child-active-hover"]=o.itemTextColorChildActiveHover,t["--n-item-text-color-active-hover"]=o.itemTextColorActiveHover,t["--n-item-icon-color"]=o.itemIconColor,t["--n-item-icon-color-hover"]=o.itemIconColorHover,t["--n-item-icon-color-active"]=o.itemIconColorActive,t["--n-item-icon-color-active-hover"]=o.itemIconColorActiveHover,t["--n-item-icon-color-child-active"]=o.itemIconColorChildActive,t["--n-item-icon-color-child-active-hover"]=o.itemIconColorChildActiveHover,t["--n-item-icon-color-collapsed"]=o.itemIconColorCollapsed,t["--n-item-text-color-horizontal"]=o.itemTextColorHorizontal,t["--n-item-text-color-hover-horizontal"]=o.itemTextColorHoverHorizontal,t["--n-item-text-color-active-horizontal"]=o.itemTextColorActiveHorizontal,t["--n-item-text-color-child-active-horizontal"]=o.itemTextColorChildActiveHorizontal,t["--n-item-text-color-child-active-hover-horizontal"]=o.itemTextColorChildActiveHoverHorizontal,t["--n-item-text-color-active-hover-horizontal"]=o.itemTextColorActiveHoverHorizontal,t["--n-item-icon-color-horizontal"]=o.itemIconColorHorizontal,t["--n-item-icon-color-hover-horizontal"]=o.itemIconColorHoverHorizontal,t["--n-item-icon-color-active-horizontal"]=o.itemIconColorActiveHorizontal,t["--n-item-icon-color-active-hover-horizontal"]=o.itemIconColorActiveHoverHorizontal,t["--n-item-icon-color-child-active-horizontal"]=o.itemIconColorChildActiveHorizontal,t["--n-item-icon-color-child-active-hover-horizontal"]=o.itemIconColorChildActiveHoverHorizontal,t["--n-arrow-color"]=o.arrowColor,t["--n-arrow-color-hover"]=o.arrowColorHover,t["--n-arrow-color-active"]=o.arrowColorActive,t["--n-arrow-color-active-hover"]=o.arrowColorActiveHover,t["--n-arrow-color-child-active"]=o.arrowColorChildActive,t["--n-arrow-color-child-active-hover"]=o.arrowColorChildActiveHover,t["--n-item-color-hover"]=o.itemColorHover,t["--n-item-color-active"]=o.itemColorActive,t["--n-item-color-active-hover"]=o.itemColorActiveHover,t["--n-item-color-active-collapsed"]=o.itemColorActiveCollapsed),t}),x=r?xe("menu",y(()=>e.inverted?"a":"b"),b,e):void 0,L=De(),_=$(null),Z=$(null);let T=!0;const me=()=>{var l;T?T=!1:(l=_.value)===null||l===void 0||l.sync({showAllItemsBeforeCalculate:!0})};function Se(){return document.getElementById(L)}const Y=$(-1);function Re(l){Y.value=e.options.length-l}function Pe(l){l||(Y.value=-1)}const Ne=y(()=>{const l=Y.value;return{children:l===-1?[]:e.options.slice(l)}}),Ae=y(()=>{const{childrenField:l,disabledField:f,keyField:o}=e;return oe([Ne.value],{getIgnored(v){return ie(v)},getChildren(v){return v[l]},getDisabled(v){return v[f]},getKey(v){var I;return(I=v[o])!==null&&I!==void 0?I:v.name}})}),Te=y(()=>oe([{}]).treeNodes[0]);function He(){var l;if(Y.value===-1)return c(ne,{root:!0,level:0,key:"__ellpisisGroupPlaceholder__",internalKey:"__ellpisisGroupPlaceholder__",title:"···",tmNode:Te.value,domId:L,isEllipsisPlaceholder:!0});const f=Ae.value.treeNodes[0],o=O.value,v=!!(!((l=f.children)===null||l===void 0)&&l.some(I=>o.includes(I.key)));return c(ne,{level:0,root:!0,key:"__ellpisisGroup__",internalKey:"__ellpisisGroup__",title:"···",virtualChildActive:v,tmNode:f,domId:L,rawNodes:f.rawNode.children||[],tmNodes:f.children||[],isEllipsisPlaceholder:!0})}return{mergedClsPrefix:n,controlledExpandedKeys:A,uncontrolledExpanededKeys:p,mergedExpandedKeys:P,uncontrolledValue:R,mergedValue:S,activePath:O,tmNodes:H,mergedTheme:d,mergedCollapsed:u,cssVars:r?void 0:b,themeClass:x==null?void 0:x.themeClass,overflowRef:_,counterRef:Z,updateCounter:()=>{},onResize:me,onUpdateOverflow:Pe,onUpdateCount:Re,renderCounter:He,getCounter:Se,onRender:x==null?void 0:x.onRender,showOption:w,deriveResponsiveState:me}},render(){const{mergedClsPrefix:e,mode:n,themeClass:r,onRender:d}=this;d==null||d();const s=()=>this.tmNodes.map(h=>ve(h,this.$props)),m=n==="horizontal"&&this.responsive,g=()=>c("div",{role:n==="horizontal"?"menubar":"menu",class:[`${e}-menu`,r,`${e}-menu--${n}`,m&&`${e}-menu--responsive`,this.mergedCollapsed&&`${e}-menu--collapsed`],style:this.cssVars},m?c(Xe,{ref:"overflowRef",onUpdateOverflow:this.onUpdateOverflow,getCounter:this.getCounter,onUpdateCount:this.onUpdateCount,updateCounter:this.updateCounter,style:{width:"100%",display:"flex",overflow:"hidden"}},{default:s,counter:this.renderCounter}):s());return m?c(Ue,{onResize:this.onResize},{default:g}):g()}});export{Ro as N,Po as a};
