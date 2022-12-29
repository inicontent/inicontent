import{a as T,h as i,f as c,p as I,q as a,m as b,i as Y,y as O,C as B,b as z,w as X,v as j,k as me,l as he,x as re,T as Pe,Q as oe,K as U,de as Ae,P as se,o as pe,A as fe,B as L,G as Ne,I as ke,H as q,J as W,df as Te}from"./entry.328b861b.js";import{u as He,t as J}from"./useLanguage.d2d2312d.js";import"./RenderData.1a6bae2b.js";import{b as ge,f as M}from"./Space.59a4ec5d.js";import{C as _e,b as Me}from"./Trash.f7f2ca5d.js";import{b as $e,c as be,l as Ee,p as Oe,N as Fe,a as Le}from"./LayoutContent.2af2ff96.js";import{u as te,f as Be,N as Ke,d as je}from"./Scrollbar.0c5a84d0.js";import{f as Q,k as ne}from"./format-length.ad42f3fa.js";import{r as K}from"./Scrollbar.ab988cec.js";import{m as Ve,l as De,f as Ue}from"./Upload.0169452e.js";import{b as qe}from"./Image.ee9b4ccc.js";import{s as Z,N as ee}from"./Icon.29c3922e.js";import{E as We}from"./Eye.3da6862a.js";import"./index.ad61f358.js";import"./ColorPicker.73c99446.js";import"./RenderFields.4cf147db.js";import"./fetch.7103049b.js";import"./index.d4f86f82.js";import"./FileText.6114aa05.js";import"./use-is-composing.b03ea0d7.js";import"./text.28dac007.js";import"./use-houdini.a45afe2f.js";import"./Upload.c25d53d7.js";import"./Add.216a72f9.js";import"./Time.07060ce1.js";import"./RenderSchema.758665a5.js";import"./vue.runtime.esm-bundler.6b4d84ea.js";import"./RichEditor.e82d76d5.js";import"./composables.618862be.js";const Ge=T({name:"ChevronDownFilled",render(){return i("svg",{viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg"},i("path",{d:"M3.20041 5.73966C3.48226 5.43613 3.95681 5.41856 4.26034 5.70041L8 9.22652L11.7397 5.70041C12.0432 5.41856 12.5177 5.43613 12.7996 5.73966C13.0815 6.0432 13.0639 6.51775 12.7603 6.7996L8.51034 10.7996C8.22258 11.0668 7.77743 11.0668 7.48967 10.7996L3.23966 6.7996C2.93613 6.51775 2.91856 6.0432 3.20041 5.73966Z",fill:"currentColor"}))}}),Ye=c("layout-sider",`
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
`,[I("bordered",[a("border",`
 content: "";
 position: absolute;
 top: 0;
 bottom: 0;
 width: 1px;
 background-color: var(--n-border-color);
 transition: background-color .3s var(--n-bezier);
 `)]),a("left-placement",[I("bordered",[a("border",`
 right: 0;
 `)])]),I("right-placement",`
 justify-content: flex-start;
 `,[I("bordered",[a("border",`
 left: 0;
 `)]),I("collapsed",[c("layout-toggle-button",[c("base-icon",`
 transform: rotate(180deg);
 `)]),c("layout-toggle-bar",[b("&:hover",[a("top",{transform:"rotate(-12deg) scale(1.15) translateY(-2px)"}),a("bottom",{transform:"rotate(12deg) scale(1.15) translateY(2px)"})])])]),c("layout-toggle-button",`
 left: 0;
 transform: translateX(-50%) translateY(-50%);
 `,[c("base-icon",`
 transform: rotate(0);
 `)]),c("layout-toggle-bar",`
 left: -28px;
 transform: rotate(180deg);
 `,[b("&:hover",[a("top",{transform:"rotate(12deg) scale(1.15) translateY(-2px)"}),a("bottom",{transform:"rotate(-12deg) scale(1.15) translateY(2px)"})])])]),I("collapsed",[c("layout-toggle-bar",[b("&:hover",[a("top",{transform:"rotate(-12deg) scale(1.15) translateY(-2px)"}),a("bottom",{transform:"rotate(12deg) scale(1.15) translateY(2px)"})])]),c("layout-toggle-button",[c("base-icon",`
 transform: rotate(0);
 `)])]),c("layout-toggle-button",`
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
 `,[c("base-icon",`
 transition: transform .3s var(--n-bezier);
 transform: rotate(180deg);
 `)]),c("layout-toggle-bar",`
 cursor: pointer;
 height: 72px;
 width: 32px;
 position: absolute;
 top: calc(50% - 36px);
 right: -28px;
 `,[a("top, bottom",`
 position: absolute;
 width: 4px;
 border-radius: 2px;
 height: 38px;
 left: 14px;
 transition: 
 background-color .3s var(--n-bezier),
 transform .3s var(--n-bezier);
 `),a("bottom",`
 position: absolute;
 top: 34px;
 `),b("&:hover",[a("top",{transform:"rotate(12deg) scale(1.15) translateY(-2px)"}),a("bottom",{transform:"rotate(-12deg) scale(1.15) translateY(2px)"})]),a("top, bottom",{backgroundColor:"var(--n-toggle-bar-color)"}),b("&:hover",[a("top, bottom",{backgroundColor:"var(--n-toggle-bar-color-hover)"})])]),a("border",`
 position: absolute;
 top: 0;
 right: 0;
 bottom: 0;
 width: 1px;
 transition: background-color .3s var(--n-bezier);
 `),c("layout-sider-scroll-container",`
 flex-grow: 1;
 flex-shrink: 0;
 box-sizing: border-box;
 height: 100%;
 opacity: 0;
 transition: opacity .3s var(--n-bezier);
 max-width: 100%;
 `),I("show-content",[c("layout-sider-scroll-container",{opacity:1})]),I("absolute-positioned",`
 position: absolute;
 left: 0;
 top: 0;
 bottom: 0;
 `)]),Xe=T({name:"LayoutToggleButton",props:{clsPrefix:{type:String,required:!0},onClick:Function},render(){const{clsPrefix:e}=this;return i("div",{class:`${e}-layout-toggle-button`,onClick:this.onClick},i(ge,{clsPrefix:e},{default:()=>i(_e,null)}))}}),Je=T({props:{clsPrefix:{type:String,required:!0},onClick:Function},render(){const{clsPrefix:e}=this;return i("div",{onClick:this.onClick,class:`${e}-layout-toggle-bar`},i("div",{class:`${e}-layout-toggle-bar__top`}),i("div",{class:`${e}-layout-toggle-bar__bottom`}))}}),Qe={position:Oe,bordered:Boolean,collapsedWidth:{type:Number,default:48},width:{type:[Number,String],default:272},contentStyle:{type:[String,Object],default:""},collapseMode:{type:String,default:"transform"},collapsed:{type:Boolean,default:void 0},defaultCollapsed:Boolean,showCollapsedContent:{type:Boolean,default:!0},showTrigger:{type:[Boolean,String],default:!1},nativeScrollbar:{type:Boolean,default:!0},inverted:Boolean,scrollbarProps:Object,triggerStyle:[String,Object],collapsedTriggerStyle:[String,Object],"onUpdate:collapsed":[Function,Array],onUpdateCollapsed:[Function,Array],onAfterEnter:Function,onAfterLeave:Function,onExpand:[Function,Array],onCollapse:[Function,Array],onScroll:Function},Ze=T({name:"LayoutSider",props:Object.assign(Object.assign({},Y.props),Qe),setup(e){const n=O($e),r=B(null),l=B(null),u=z(()=>Q(d.value?e.collapsedWidth:e.width)),s=z(()=>e.collapseMode!=="transform"?{}:{minWidth:Q(e.width)}),v=z(()=>n?n.siderPlacement:"left"),h=B(e.defaultCollapsed),d=te(X(e,"collapsed"),h);function C(w,x){if(e.nativeScrollbar){const{value:y}=r;y&&(x===void 0?y.scrollTo(w):y.scrollTo(w,x))}else{const{value:y}=l;y&&y.scrollTo(w,x)}}function P(){const{"onUpdate:collapsed":w,onUpdateCollapsed:x,onExpand:y,onCollapse:p}=e,{value:g}=d;x&&M(x,!g),w&&M(w,!g),h.value=!g,g?y&&M(y):p&&M(p)}let S=0,f=0;const N=w=>{var x;const y=w.target;S=y.scrollLeft,f=y.scrollTop,(x=e.onScroll)===null||x===void 0||x.call(e,w)};Be(()=>{if(e.nativeScrollbar){const w=r.value;w&&(w.scrollTop=f,w.scrollLeft=S)}}),j(be,{collapsedRef:d,collapseModeRef:X(e,"collapseMode")});const{mergedClsPrefixRef:k,inlineThemeDisabled:A}=me(e),H=Y("Layout","-layout-sider",Ye,Ee,e,k);function $(w){var x,y;w.propertyName==="max-width"&&(d.value?(x=e.onAfterLeave)===null||x===void 0||x.call(e):(y=e.onAfterEnter)===null||y===void 0||y.call(e))}const V={scrollTo:C},E=z(()=>{const{common:{cubicBezierEaseInOut:w},self:x}=H.value,{siderToggleButtonColor:y,siderToggleButtonBorder:p,siderToggleBarColor:g,siderToggleBarColorHover:o}=x,m={"--n-bezier":w,"--n-toggle-button-color":y,"--n-toggle-button-border":p,"--n-toggle-bar-color":g,"--n-toggle-bar-color-hover":o};return e.inverted?(m["--n-color"]=x.siderColorInverted,m["--n-text-color"]=x.textColorInverted,m["--n-border-color"]=x.siderBorderColorInverted,m["--n-toggle-button-icon-color"]=x.siderToggleButtonIconColorInverted,m.__invertScrollbar=x.__invertScrollbar):(m["--n-color"]=x.siderColor,m["--n-text-color"]=x.textColor,m["--n-border-color"]=x.siderBorderColor,m["--n-toggle-button-icon-color"]=x.siderToggleButtonIconColor),m}),_=A?he("layout-sider",z(()=>e.inverted?"a":"b"),E,e):void 0;return Object.assign({scrollableElRef:r,scrollbarInstRef:l,mergedClsPrefix:k,mergedTheme:H,styleMaxWidth:u,mergedCollapsed:d,scrollContainerStyle:s,siderPlacement:v,handleNativeElScroll:N,handleTransitionend:$,handleTriggerClick:P,inlineThemeDisabled:A,cssVars:E,themeClass:_==null?void 0:_.themeClass,onRender:_==null?void 0:_.onRender},V)},render(){var e;const{mergedClsPrefix:n,mergedCollapsed:r,showTrigger:l}=this;return(e=this.onRender)===null||e===void 0||e.call(this),i("aside",{class:[`${n}-layout-sider`,this.themeClass,`${n}-layout-sider--${this.position}-positioned`,`${n}-layout-sider--${this.siderPlacement}-placement`,this.bordered&&`${n}-layout-sider--bordered`,r&&`${n}-layout-sider--collapsed`,(!r||this.showCollapsedContent)&&`${n}-layout-sider--show-content`],onTransitionend:this.handleTransitionend,style:[this.inlineThemeDisabled?void 0:this.cssVars,{maxWidth:this.styleMaxWidth,width:Q(this.width)}]},this.nativeScrollbar?i("div",{class:`${n}-layout-sider-scroll-container`,onScroll:this.handleNativeElScroll,style:[this.scrollContainerStyle,{overflow:"auto"},this.contentStyle],ref:"scrollableElRef"},this.$slots):i(Ke,Object.assign({},this.scrollbarProps,{onScroll:this.onScroll,ref:"scrollbarInstRef",style:this.scrollContainerStyle,contentStyle:this.contentStyle,theme:this.mergedTheme.peers.Scrollbar,themeOverrides:this.mergedTheme.peerOverrides.Scrollbar,builtinThemeOverrides:this.inverted&&this.cssVars.__invertScrollbar==="true"?{colorHover:"rgba(255, 255, 255, .4)",color:"rgba(255, 255, 255, .3)"}:void 0}),this.$slots),l?l==="bar"?i(Je,{clsPrefix:n,style:r?this.collapsedTriggerStyle:this.triggerStyle,onClick:this.handleTriggerClick}):i(Xe,{clsPrefix:n,style:r?this.collapsedTriggerStyle:this.triggerStyle,onClick:this.handleTriggerClick}):null,this.bordered?i("div",{class:`${n}-layout-sider__border`}):null)}}),D=re("n-menu"),ie=re("n-submenu"),le=re("n-menu-item-group"),G=8;function ae(e){const n=O(D),{props:r,mergedCollapsedRef:l}=n,u=O(ie,null),s=O(le,null),v=z(()=>r.mode==="horizontal"),h=z(()=>v.value?r.dropdownPlacement:"tmNodes"in e?"right-start":"right"),d=z(()=>{var f;return Math.max((f=r.collapsedIconSize)!==null&&f!==void 0?f:r.iconSize,r.iconSize)}),C=z(()=>{var f;return!v.value&&e.root&&l.value&&(f=r.collapsedIconSize)!==null&&f!==void 0?f:r.iconSize}),P=z(()=>{if(v.value)return;const{collapsedWidth:f,indent:N,rootIndent:k}=r,{root:A,isGroup:H}=e,$=k===void 0?N:k;if(A)return l.value?f/2-d.value/2:$;if(s)return N/2+s.paddingLeftRef.value;if(u)return(H?N/2:N)+u.paddingLeftRef.value}),S=z(()=>{const{collapsedWidth:f,indent:N,rootIndent:k}=r,{value:A}=d,{root:H}=e;return v.value||!H||!l.value?G:(k===void 0?N:k)+A+G-(f+A)/2});return{dropdownPlacement:h,activeIconSize:C,maxIconSize:d,paddingLeft:P,iconMarginRight:S,NMenu:n,NSubmenu:u}}const ce={internalKey:{type:[String,Number],required:!0},root:Boolean,isGroup:Boolean,level:{type:Number,required:!0},title:[String,Function],extra:[String,Function]},xe=Object.assign(Object.assign({},ce),{tmNode:{type:Object,required:!0},tmNodes:{type:Array,required:!0}}),eo=T({name:"MenuOptionGroup",props:xe,setup(e){j(ie,null);const n=ae(e);j(le,{paddingLeftRef:n.paddingLeft});const{mergedClsPrefixRef:r,props:l}=O(D);return function(){const{value:u}=r,s=n.paddingLeft.value,{nodeProps:v}=l,h=v==null?void 0:v(e.tmNode.rawNode);return i("div",{class:`${u}-menu-item-group`,role:"group"},i("div",Object.assign({},h,{class:[`${u}-menu-item-group-title`,h==null?void 0:h.class],style:[(h==null?void 0:h.style)||"",s!==void 0?`padding-left: ${s}px;`:""]}),K(e.title),e.extra?i(Pe,null," ",K(e.extra)):null),i("div",null,e.tmNodes.map(d=>de(d,l))))}}}),Ce=T({name:"MenuOptionContent",props:{collapsed:Boolean,disabled:Boolean,title:[String,Function],icon:Function,extra:[String,Function],showArrow:Boolean,childActive:Boolean,hover:Boolean,paddingLeft:Number,selected:Boolean,maxIconSize:{type:Number,required:!0},activeIconSize:{type:Number,required:!0},iconMarginRight:{type:Number,required:!0},clsPrefix:{type:String,required:!0},onClick:Function,tmNode:{type:Object,required:!0}},setup(e){const{props:n}=O(D);return{menuProps:n,style:z(()=>{const{paddingLeft:r}=e;return{paddingLeft:r&&`${r}px`}}),iconStyle:z(()=>{const{maxIconSize:r,activeIconSize:l,iconMarginRight:u}=e;return{width:`${r}px`,height:`${r}px`,fontSize:`${l}px`,marginRight:`${u}px`}})}},render(){const{clsPrefix:e,tmNode:n,menuProps:{renderIcon:r,renderLabel:l,renderExtra:u,expandIcon:s}}=this,v=r?r(n.rawNode):K(this.icon);return i("div",{onClick:h=>{var d;(d=this.onClick)===null||d===void 0||d.call(this,h)},role:"none",class:[`${e}-menu-item-content`,{[`${e}-menu-item-content--selected`]:this.selected,[`${e}-menu-item-content--collapsed`]:this.collapsed,[`${e}-menu-item-content--child-active`]:this.childActive,[`${e}-menu-item-content--disabled`]:this.disabled,[`${e}-menu-item-content--hover`]:this.hover}],style:this.style},v&&i("div",{class:`${e}-menu-item-content__icon`,style:this.iconStyle,role:"none"},[v]),i("div",{class:`${e}-menu-item-content-header`,role:"none"},l?l(n.rawNode):K(this.title),this.extra||u?i("span",{class:`${e}-menu-item-content-header__extra`}," ",u?u(n.rawNode):K(this.extra)):null),this.showArrow?i(ge,{ariaHidden:!0,class:`${e}-menu-item-content__arrow`,clsPrefix:e},{default:()=>s?s(n.rawNode):i(Ge,null)}):null)}}),ye=Object.assign(Object.assign({},ce),{rawNodes:{type:Array,default:()=>[]},tmNodes:{type:Array,default:()=>[]},tmNode:{type:Object,required:!0},disabled:{type:Boolean,default:!1},icon:Function,onClick:Function}),oo=T({name:"Submenu",props:ye,setup(e){const n=ae(e),{NMenu:r,NSubmenu:l}=n,{props:u,mergedCollapsedRef:s,mergedThemeRef:v}=r,h=z(()=>{const{disabled:f}=e;return l!=null&&l.mergedDisabledRef.value||u.disabled?!0:f}),d=B(!1);j(ie,{paddingLeftRef:n.paddingLeft,mergedDisabledRef:h}),j(le,null);function C(){const{onClick:f}=e;f&&f()}function P(){h.value||(s.value||r.toggleExpand(e.internalKey),C())}function S(f){d.value=f}return{menuProps:u,mergedTheme:v,doSelect:r.doSelect,inverted:r.invertedRef,isHorizontal:r.isHorizontalRef,mergedClsPrefix:r.mergedClsPrefixRef,maxIconSize:n.maxIconSize,activeIconSize:n.activeIconSize,iconMarginRight:n.iconMarginRight,dropdownPlacement:n.dropdownPlacement,dropdownShow:d,paddingLeft:n.paddingLeft,mergedDisabled:h,mergedValue:r.mergedValueRef,childActive:oe(()=>r.activePathRef.value.includes(e.internalKey)),collapsed:z(()=>u.mode==="horizontal"?!1:s.value?!0:!r.mergedExpandedKeysRef.value.includes(e.internalKey)),dropdownEnabled:z(()=>!h.value&&(u.mode==="horizontal"||s.value)),handlePopoverShowChange:S,handleClick:P}},render(){var e;const{mergedClsPrefix:n,menuProps:{renderIcon:r,renderLabel:l}}=this,u=()=>{const{isHorizontal:v,paddingLeft:h,collapsed:d,mergedDisabled:C,maxIconSize:P,activeIconSize:S,title:f,childActive:N,icon:k,handleClick:A,menuProps:{nodeProps:H},dropdownShow:$,iconMarginRight:V,tmNode:E,mergedClsPrefix:_}=this,w=H==null?void 0:H(E.rawNode);return i("div",Object.assign({},w,{class:[`${_}-menu-item`,w==null?void 0:w.class],role:"menuitem"}),i(Ce,{tmNode:E,paddingLeft:h,collapsed:d,disabled:C,iconMarginRight:V,maxIconSize:P,activeIconSize:S,title:f,extra:this.extra,showArrow:!v,childActive:N,clsPrefix:_,icon:k,hover:$,onClick:A}))},s=()=>i(Ve,null,{default:()=>{const{tmNodes:v,collapsed:h}=this;return h?null:i("div",{class:`${n}-submenu-children`,role:"menu"},v.map(d=>de(d,this.menuProps)))}});return this.root?i(Me,Object.assign({size:"large",trigger:"hover"},(e=this.menuProps)===null||e===void 0?void 0:e.dropdownProps,{themeOverrides:this.mergedTheme.peerOverrides.Dropdown,theme:this.mergedTheme.peers.Dropdown,builtinThemeOverrides:{fontSizeLarge:"14px",optionIconSizeLarge:"18px"},value:this.mergedValue,disabled:!this.dropdownEnabled,placement:this.dropdownPlacement,keyField:this.menuProps.keyField,labelField:this.menuProps.labelField,childrenField:this.menuProps.childrenField,onUpdateShow:this.handlePopoverShowChange,options:this.rawNodes,onSelect:this.doSelect,inverted:this.inverted,renderIcon:r,renderLabel:l}),{default:()=>i("div",{class:`${n}-submenu`,role:"menuitem","aria-expanded":!this.collapsed},u(),this.isHorizontal?null:s())}):i("div",{class:`${n}-submenu`,role:"menuitem","aria-expanded":!this.collapsed},u(),s())}}),ze=Object.assign(Object.assign({},ce),{tmNode:{type:Object,required:!0},disabled:Boolean,icon:Function,onClick:Function}),to=T({name:"MenuOption",props:ze,setup(e){const n=ae(e),{NSubmenu:r,NMenu:l}=n,{props:u,mergedClsPrefixRef:s,mergedCollapsedRef:v}=l,h=r?r.mergedDisabledRef:{value:!1},d=z(()=>h.value||e.disabled);function C(S){const{onClick:f}=e;f&&f(S)}function P(S){d.value||(l.doSelect(e.internalKey,e.tmNode.rawNode),C(S))}return{mergedClsPrefix:s,dropdownPlacement:n.dropdownPlacement,paddingLeft:n.paddingLeft,iconMarginRight:n.iconMarginRight,maxIconSize:n.maxIconSize,activeIconSize:n.activeIconSize,mergedTheme:l.mergedThemeRef,menuProps:u,dropdownEnabled:oe(()=>e.root&&v.value&&u.mode!=="horizontal"&&!d.value),selected:oe(()=>l.mergedValueRef.value===e.internalKey),mergedDisabled:d,handleClick:P}},render(){const{mergedClsPrefix:e,mergedTheme:n,tmNode:r,menuProps:{renderLabel:l,nodeProps:u}}=this,s=u==null?void 0:u(r.rawNode);return i("div",Object.assign({},s,{role:"menuitem",class:[`${e}-menu-item`,s==null?void 0:s.class]}),i(qe,{theme:n.peers.Tooltip,themeOverrides:n.peerOverrides.Tooltip,trigger:"hover",placement:this.dropdownPlacement,disabled:!this.dropdownEnabled||this.title===void 0,internalExtraClass:["menu-tooltip"]},{default:()=>l?l(r.rawNode):K(this.title),trigger:()=>i(Ce,{tmNode:r,clsPrefix:e,paddingLeft:this.paddingLeft,iconMarginRight:this.iconMarginRight,maxIconSize:this.maxIconSize,activeIconSize:this.activeIconSize,selected:this.selected,title:this.title,extra:this.extra,disabled:this.mergedDisabled,icon:this.icon,onClick:this.handleClick})}))}}),ro=T({name:"MenuDivider",setup(){const e=O(D),{mergedClsPrefixRef:n,isHorizontalRef:r}=e;return()=>r.value?null:i("div",{class:`${n.value}-menu-divider`})}}),no=ne(xe),io=ne(ze),lo=ne(ye);function we(e){return e.type==="divider"||e.type==="render"}function ao(e){return e.type==="divider"}function de(e,n){const{rawNode:r}=e,{show:l}=r;if(l===!1)return null;if(we(r))return ao(r)?i(ro,Object.assign({key:e.key},r.props)):null;const{labelField:u}=n,{key:s,level:v,isGroup:h}=e,d=Object.assign(Object.assign({},r),{title:r.title||r[u],extra:r.titleExtra||r.extra,key:s,internalKey:s,level:v,root:v===0,isGroup:h});return e.children?e.isGroup?i(eo,Z(d,no,{tmNode:e,tmNodes:e.children,key:s})):i(oo,Z(d,lo,{key:s,rawNodes:r[n.childrenField],tmNodes:e.children,tmNode:e})):i(to,Z(d,io,{key:s,tmNode:e}))}const ue=[b("&::before","background-color: var(--n-item-color-hover);"),a("arrow",`
 color: var(--n-arrow-color-hover);
 `),a("icon",`
 color: var(--n-item-icon-color-hover);
 `),c("menu-item-content-header",`
 color: var(--n-item-text-color-hover);
 `,[b("a",`
 color: var(--n-item-text-color-hover);
 `),a("extra",`
 color: var(--n-item-text-color-hover);
 `)])],ve=[a("icon",`
 color: var(--n-item-icon-color-hover-horizontal);
 `),c("menu-item-content-header",`
 color: var(--n-item-text-color-hover-horizontal);
 `,[b("a",`
 color: var(--n-item-text-color-hover-horizontal);
 `),a("extra",`
 color: var(--n-item-text-color-hover-horizontal);
 `)])],co=b([c("menu",`
 background-color: var(--n-color);
 color: var(--n-item-text-color);
 overflow: hidden;
 transition: background-color .3s var(--n-bezier);
 box-sizing: border-box;
 font-size: var(--n-font-size);
 padding-bottom: 6px;
 `,[I("horizontal",`
 display: inline-flex;
 padding-bottom: 0;
 `,[c("submenu","margin: 0;"),c("menu-item","margin: 0;"),c("menu-item-content",`
 padding: 0 20px;
 border-bottom: 2px solid #0000;
 `,[b("&::before","display: none;"),I("selected","border-bottom: 2px solid var(--n-border-color-horizontal)")]),c("menu-item-content",[I("selected",[a("icon","color: var(--n-item-icon-color-active-horizontal);"),c("menu-item-content-header",`
 color: var(--n-item-text-color-active-horizontal);
 `,[b("a","color: var(--n-item-text-color-active-horizontal);"),a("extra","color: var(--n-item-text-color-active-horizontal);")])]),I("child-active",`
 border-bottom: 2px solid var(--n-border-color-horizontal);
 `,[c("menu-item-content-header",`
 color: var(--n-item-text-color-child-active-horizontal);
 `,[b("a",`
 color: var(--n-item-text-color-child-active-horizontal);
 `),a("extra",`
 color: var(--n-item-text-color-child-active-horizontal);
 `)]),a("icon",`
 color: var(--n-item-icon-color-child-active-horizontal);
 `)]),U("disabled",[U("selected, child-active",[b("&:focus-within",ve)]),I("selected",[F(null,[a("icon","color: var(--n-item-icon-color-active-hover-horizontal);"),c("menu-item-content-header",`
 color: var(--n-item-text-color-active-hover-horizontal);
 `,[b("a","color: var(--n-item-text-color-active-hover-horizontal);"),a("extra","color: var(--n-item-text-color-active-hover-horizontal);")])])]),I("child-active",[F(null,[a("icon","color: var(--n-item-icon-color-child-active-hover-horizontal);"),c("menu-item-content-header",`
 color: var(--n-item-text-color-child-active-hover-horizontal);
 `,[b("a","color: var(--n-item-text-color-child-active-hover-horizontal);"),a("extra","color: var(--n-item-text-color-child-active-hover-horizontal);")])])]),F("border-bottom: 2px solid var(--n-border-color-horizontal);",ve)]),c("menu-item-content-header",[b("a","color: var(--n-item-text-color-horizontal);")])])]),I("collapsed",[c("menu-item-content",[I("selected",[b("&::before",`
 background-color: var(--n-item-color-active-collapsed) !important;
 `)]),c("menu-item-content-header","opacity: 0;"),a("arrow","opacity: 0;"),a("icon","color: var(--n-item-icon-color-collapsed);")])]),c("menu-item",`
 height: var(--n-item-height);
 margin-top: 6px;
 position: relative;
 `),c("menu-item-content",`
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
 `,[b("> *","z-index: 1;"),b("&::before",`
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
 `),I("disabled",`
 opacity: .45;
 cursor: not-allowed;
 `),I("collapsed",[a("arrow","transform: rotate(0);")]),I("selected",[b("&::before","background-color: var(--n-item-color-active);"),a("arrow","color: var(--n-arrow-color-active);"),a("icon","color: var(--n-item-icon-color-active);"),c("menu-item-content-header",`
 color: var(--n-item-text-color-active);
 `,[b("a","color: var(--n-item-text-color-active);"),a("extra","color: var(--n-item-text-color-active);")])]),I("child-active",[c("menu-item-content-header",`
 color: var(--n-item-text-color-child-active);
 `,[b("a",`
 color: var(--n-item-text-color-child-active);
 `),a("extra",`
 color: var(--n-item-text-color-child-active);
 `)]),a("arrow",`
 color: var(--n-arrow-color-child-active);
 `),a("icon",`
 color: var(--n-item-icon-color-child-active);
 `)]),U("disabled",[U("selected, child-active",[b("&:focus-within",ue)]),I("selected",[F(null,[a("arrow","color: var(--n-arrow-color-active-hover);"),a("icon","color: var(--n-item-icon-color-active-hover);"),c("menu-item-content-header",`
 color: var(--n-item-text-color-active-hover);
 `,[b("a","color: var(--n-item-text-color-active-hover);"),a("extra","color: var(--n-item-text-color-active-hover);")])])]),I("child-active",[F(null,[a("arrow","color: var(--n-arrow-color-child-active-hover);"),a("icon","color: var(--n-item-icon-color-child-active-hover);"),c("menu-item-content-header",`
 color: var(--n-item-text-color-child-active-hover);
 `,[b("a","color: var(--n-item-text-color-child-active-hover);"),a("extra","color: var(--n-item-text-color-child-active-hover);")])])]),I("selected",[F(null,[b("&::before","background-color: var(--n-item-color-active-hover);")])]),F(null,ue)]),a("icon",`
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
 `),a("arrow",`
 grid-area: arrow;
 font-size: 16px;
 color: var(--n-arrow-color);
 transform: rotate(180deg);
 opacity: 1;
 transition:
 color .3s var(--n-bezier),
 transform 0.2s var(--n-bezier),
 opacity 0.2s var(--n-bezier);
 `),c("menu-item-content-header",`
 grid-area: content;
 transition:
 color .3s var(--n-bezier),
 opacity .3s var(--n-bezier);
 opacity: 1;
 white-space: nowrap;
 overflow: hidden;
 text-overflow: ellipsis;
 color: var(--n-item-text-color);
 `,[b("a",`
 outline: none;
 text-decoration: none;
 transition: color .3s var(--n-bezier);
 color: var(--n-item-text-color);
 `,[b("&::before",`
 content: "";
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 `)]),a("extra",`
 font-size: .93em;
 color: var(--n-group-text-color);
 transition: color .3s var(--n-bezier);
 `)])]),c("submenu",`
 cursor: pointer;
 position: relative;
 margin-top: 6px;
 `,[c("menu-item-content",`
 height: var(--n-item-height);
 `),c("submenu-children",`
 overflow: hidden;
 padding: 0;
 `,[De({duration:".2s"})])]),c("menu-item-group",[c("menu-item-group-title",`
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
 `)])]),c("menu-tooltip",[b("a",`
 color: inherit;
 text-decoration: none;
 `)]),c("menu-divider",`
 transition: background-color .3s var(--n-bezier);
 background-color: var(--n-divider-color);
 height: 1px;
 margin: 6px 18px;
 `)]);function F(e,n){return[I("hover",e,n),b("&:hover",e,n)]}const so=Object.assign(Object.assign({},Y.props),{options:{type:Array,default:()=>[]},collapsed:{type:Boolean,default:void 0},collapsedWidth:{type:Number,default:48},iconSize:{type:Number,default:20},collapsedIconSize:{type:Number,default:24},rootIndent:Number,indent:{type:Number,default:32},labelField:{type:String,default:"label"},keyField:{type:String,default:"key"},childrenField:{type:String,default:"children"},disabledField:{type:String,default:"disabled"},defaultExpandAll:Boolean,defaultExpandedKeys:Array,expandedKeys:Array,value:[String,Number],defaultValue:{type:[String,Number],default:null},mode:{type:String,default:"vertical"},watchProps:{type:Array,default:void 0},disabled:Boolean,show:{type:Boolean,defalut:!0},inverted:Boolean,"onUpdate:expandedKeys":[Function,Array],onUpdateExpandedKeys:[Function,Array],onUpdateValue:[Function,Array],"onUpdate:value":[Function,Array],expandIcon:Function,renderIcon:Function,renderLabel:Function,renderExtra:Function,dropdownProps:Object,accordion:Boolean,nodeProps:Function,items:Array,onOpenNamesChange:[Function,Array],onSelect:[Function,Array],onExpandedNamesChange:[Function,Array],expandedNames:Array,defaultExpandedNames:Array,dropdownPlacement:{type:String,default:"bottom"}}),uo=T({name:"Menu",props:so,setup(e){const{mergedClsPrefixRef:n,inlineThemeDisabled:r}=me(e),l=Y("Menu","-menu",co,Ae,e,n),u=O(be,null),s=z(()=>{var p;const{collapsed:g}=e;if(g!==void 0)return g;if(u){const{collapseModeRef:o,collapsedRef:m}=u;if(o.value==="width")return(p=m.value)!==null&&p!==void 0?p:!1}return!1}),v=z(()=>{const{keyField:p,childrenField:g,disabledField:o}=e;return Ue(e.items||e.options,{getIgnored(m){return we(m)},getChildren(m){return m[g]},getDisabled(m){return m[o]},getKey(m){var R;return(R=m[p])!==null&&R!==void 0?R:m.name}})}),h=z(()=>new Set(v.value.treeNodes.map(p=>p.key))),{watchProps:d}=e,C=B(null);d!=null&&d.includes("defaultValue")?se(()=>{C.value=e.defaultValue}):C.value=e.defaultValue;const P=X(e,"value"),S=te(P,C),f=B([]),N=()=>{f.value=e.defaultExpandAll?v.value.getNonLeafKeys():e.defaultExpandedNames||e.defaultExpandedKeys||v.value.getPath(S.value,{includeSelf:!1}).keyPath};d!=null&&d.includes("defaultExpandedKeys")?se(N):N();const k=je(e,["expandedNames","expandedKeys"]),A=te(k,f),H=z(()=>v.value.treeNodes),$=z(()=>v.value.getPath(S.value).keyPath);j(D,{props:e,mergedCollapsedRef:s,mergedThemeRef:l,mergedValueRef:S,mergedExpandedKeysRef:A,activePathRef:$,mergedClsPrefixRef:n,isHorizontalRef:z(()=>e.mode==="horizontal"),invertedRef:X(e,"inverted"),doSelect:V,toggleExpand:_});function V(p,g){const{"onUpdate:value":o,onUpdateValue:m,onSelect:R}=e;m&&M(m,p,g),o&&M(o,p,g),R&&M(R,p,g),C.value=p}function E(p){const{"onUpdate:expandedKeys":g,onUpdateExpandedKeys:o,onExpandedNamesChange:m,onOpenNamesChange:R}=e;g&&M(g,p),o&&M(o,p),m&&M(m,p),R&&M(R,p),f.value=p}function _(p){const g=Array.from(A.value),o=g.findIndex(m=>m===p);if(~o)g.splice(o,1);else{if(e.accordion&&h.value.has(p)){const m=g.findIndex(R=>h.value.has(R));m>-1&&g.splice(m,1)}g.push(p)}E(g)}const w=p=>{const g=v.value.getPath(p!=null?p:S.value,{includeSelf:!1}).keyPath;if(!g.length)return;const o=Array.from(A.value),m=new Set([...o,...g]);e.accordion&&h.value.forEach(R=>{m.has(R)&&!g.includes(R)&&m.delete(R)}),E(Array.from(m))},x=z(()=>{const{inverted:p}=e,{common:{cubicBezierEaseInOut:g},self:o}=l.value,{borderRadius:m,borderColorHorizontal:R,fontSize:Ie,itemHeight:Se,dividerColor:Re}=o,t={"--n-divider-color":Re,"--n-bezier":g,"--n-font-size":Ie,"--n-border-color-horizontal":R,"--n-border-radius":m,"--n-item-height":Se};return p?(t["--n-group-text-color"]=o.groupTextColorInverted,t["--n-color"]=o.colorInverted,t["--n-item-text-color"]=o.itemTextColorInverted,t["--n-item-text-color-hover"]=o.itemTextColorHoverInverted,t["--n-item-text-color-active"]=o.itemTextColorActiveInverted,t["--n-item-text-color-child-active"]=o.itemTextColorChildActiveInverted,t["--n-item-text-color-child-active-hover"]=o.itemTextColorChildActiveInverted,t["--n-item-text-color-active-hover"]=o.itemTextColorActiveHoverInverted,t["--n-item-icon-color"]=o.itemIconColorInverted,t["--n-item-icon-color-hover"]=o.itemIconColorHoverInverted,t["--n-item-icon-color-active"]=o.itemIconColorActiveInverted,t["--n-item-icon-color-active-hover"]=o.itemIconColorActiveHoverInverted,t["--n-item-icon-color-child-active"]=o.itemIconColorChildActiveInverted,t["--n-item-icon-color-child-active-hover"]=o.itemIconColorChildActiveHoverInverted,t["--n-item-icon-color-collapsed"]=o.itemIconColorCollapsedInverted,t["--n-item-text-color-horizontal"]=o.itemTextColorHorizontalInverted,t["--n-item-text-color-hover-horizontal"]=o.itemTextColorHoverHorizontalInverted,t["--n-item-text-color-active-horizontal"]=o.itemTextColorActiveHorizontalInverted,t["--n-item-text-color-child-active-horizontal"]=o.itemTextColorChildActiveHorizontalInverted,t["--n-item-text-color-child-active-hover-horizontal"]=o.itemTextColorChildActiveHoverHorizontalInverted,t["--n-item-text-color-active-hover-horizontal"]=o.itemTextColorActiveHoverHorizontalInverted,t["--n-item-icon-color-horizontal"]=o.itemIconColorHorizontalInverted,t["--n-item-icon-color-hover-horizontal"]=o.itemIconColorHoverHorizontalInverted,t["--n-item-icon-color-active-horizontal"]=o.itemIconColorActiveHorizontalInverted,t["--n-item-icon-color-active-hover-horizontal"]=o.itemIconColorActiveHoverHorizontalInverted,t["--n-item-icon-color-child-active-horizontal"]=o.itemIconColorChildActiveHorizontalInverted,t["--n-item-icon-color-child-active-hover-horizontal"]=o.itemIconColorChildActiveHoverHorizontalInverted,t["--n-arrow-color"]=o.arrowColorInverted,t["--n-arrow-color-hover"]=o.arrowColorHoverInverted,t["--n-arrow-color-active"]=o.arrowColorActiveInverted,t["--n-arrow-color-active-hover"]=o.arrowColorActiveHoverInverted,t["--n-arrow-color-child-active"]=o.arrowColorChildActiveInverted,t["--n-arrow-color-child-active-hover"]=o.arrowColorChildActiveHoverInverted,t["--n-item-color-hover"]=o.itemColorHoverInverted,t["--n-item-color-active"]=o.itemColorActiveInverted,t["--n-item-color-active-hover"]=o.itemColorActiveHoverInverted,t["--n-item-color-active-collapsed"]=o.itemColorActiveCollapsedInverted):(t["--n-group-text-color"]=o.groupTextColor,t["--n-color"]=o.color,t["--n-item-text-color"]=o.itemTextColor,t["--n-item-text-color-hover"]=o.itemTextColorHover,t["--n-item-text-color-active"]=o.itemTextColorActive,t["--n-item-text-color-child-active"]=o.itemTextColorChildActive,t["--n-item-text-color-child-active-hover"]=o.itemTextColorChildActiveHover,t["--n-item-text-color-active-hover"]=o.itemTextColorActiveHover,t["--n-item-icon-color"]=o.itemIconColor,t["--n-item-icon-color-hover"]=o.itemIconColorHover,t["--n-item-icon-color-active"]=o.itemIconColorActive,t["--n-item-icon-color-active-hover"]=o.itemIconColorActiveHover,t["--n-item-icon-color-child-active"]=o.itemIconColorChildActive,t["--n-item-icon-color-child-active-hover"]=o.itemIconColorChildActiveHover,t["--n-item-icon-color-collapsed"]=o.itemIconColorCollapsed,t["--n-item-text-color-horizontal"]=o.itemTextColorHorizontal,t["--n-item-text-color-hover-horizontal"]=o.itemTextColorHoverHorizontal,t["--n-item-text-color-active-horizontal"]=o.itemTextColorActiveHorizontal,t["--n-item-text-color-child-active-horizontal"]=o.itemTextColorChildActiveHorizontal,t["--n-item-text-color-child-active-hover-horizontal"]=o.itemTextColorChildActiveHoverHorizontal,t["--n-item-text-color-active-hover-horizontal"]=o.itemTextColorActiveHoverHorizontal,t["--n-item-icon-color-horizontal"]=o.itemIconColorHorizontal,t["--n-item-icon-color-hover-horizontal"]=o.itemIconColorHoverHorizontal,t["--n-item-icon-color-active-horizontal"]=o.itemIconColorActiveHorizontal,t["--n-item-icon-color-active-hover-horizontal"]=o.itemIconColorActiveHoverHorizontal,t["--n-item-icon-color-child-active-horizontal"]=o.itemIconColorChildActiveHorizontal,t["--n-item-icon-color-child-active-hover-horizontal"]=o.itemIconColorChildActiveHoverHorizontal,t["--n-arrow-color"]=o.arrowColor,t["--n-arrow-color-hover"]=o.arrowColorHover,t["--n-arrow-color-active"]=o.arrowColorActive,t["--n-arrow-color-active-hover"]=o.arrowColorActiveHover,t["--n-arrow-color-child-active"]=o.arrowColorChildActive,t["--n-arrow-color-child-active-hover"]=o.arrowColorChildActiveHover,t["--n-item-color-hover"]=o.itemColorHover,t["--n-item-color-active"]=o.itemColorActive,t["--n-item-color-active-hover"]=o.itemColorActiveHover,t["--n-item-color-active-collapsed"]=o.itemColorActiveCollapsed),t}),y=r?he("menu",z(()=>e.inverted?"a":"b"),x,e):void 0;return{mergedClsPrefix:n,controlledExpandedKeys:k,uncontrolledExpanededKeys:f,mergedExpandedKeys:A,uncontrolledValue:C,mergedValue:S,activePath:$,tmNodes:H,mergedTheme:l,mergedCollapsed:s,cssVars:r?void 0:x,themeClass:y==null?void 0:y.themeClass,onRender:y==null?void 0:y.onRender,showOption:w}},render(){const{mergedClsPrefix:e,mode:n,themeClass:r,onRender:l}=this;return l==null||l(),i("div",{role:n==="horizontal"?"menubar":"menu",class:[`${e}-menu`,r,`${e}-menu--${n}`,this.mergedCollapsed&&`${e}-menu--collapsed`],style:this.cssVars},this.tmNodes.map(u=>de(u,this.$props)))}}),vo={xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink",viewBox:"0 0 24 24"},mo=L("g",{fill:"none",stroke:"currentColor","stroke-width":"2","stroke-linecap":"round","stroke-linejoin":"round"},[L("circle",{cx:"12",cy:"12",r:"9"}),L("path",{d:"M9 12h6"}),L("path",{d:"M12 9v6"})],-1),ho=[mo],po=T({name:"CirclePlus",render:function(n,r){return pe(),fe("svg",vo,ho)}}),fo={xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink",viewBox:"0 0 24 24"},go=L("g",{fill:"none",stroke:"currentColor","stroke-width":"2","stroke-linecap":"round","stroke-linejoin":"round"},[L("path",{d:"M9 4h3l2 2h5a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2"}),L("path",{d:"M17 17v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h2"})],-1),bo=[go],xo=T({name:"Folders",render:function(n,r){return pe(),fe("svg",fo,bo)}}),Yo=T({setup:(e,{slots:n})=>{const r=Ne("Language");He({ar:{assets:"\u0627\u0644\u0645\u0644\u0641\u0627\u062A \u0648\u0627\u0644\u0635\u0648\u0631",show_all:"\u0623\u0638\u0647\u0631 \u0627\u0644\u0643\u0644",add_new:"\u0639\u0646\u0635\u0631 \u062C\u062F\u064A\u062F"},en:{assets:"Assets",show_all:"Show All",add_new:"New Item"}});const l=ke(),u=q("Window",()=>({width:0})),s=q("User"),v=q("isMenuOpen",()=>!1),h=q("database");return()=>i(Te,{name:"default"},()=>i(Fe,{position:"absolute",hasSider:!0},()=>[i(Ze,{collapsed:!v.value,onCollapse:()=>v.value=!1,onExpand:()=>v.value=!0,style:"z-index: 999",bordered:!0,showTrigger:"bar",collapseMode:"width",collapsedWidth:u.width<700?0:64,width:240,nativeScrollbar:!1},()=>i(uo,{collapsed:!v.value,collapsedIconSize:22,collapsedWidth:u.width<700?0:64,options:[...h.value.tables.filter(({slug:d,allowed_methods:C})=>s.value.role&&(s.value.role==="admin"||d==="user"||C&&C[s.value.role]&&C[s.value.role].includes("r"))).map(({name:d,slug:C,allowed_methods:P})=>({label:()=>i(W,{to:`/${l.params.db_slug}/tables/${C}`},{default:()=>d}),key:C,icon:()=>d.charAt(0),children:s.value.role==="admin"||C==="user"||P&&P[s.value.role]&&P[s.value.role].includes("c")?[{label:()=>i(W,{to:`/${l.params.db_slug}/tables/${C}`},{default:()=>J("show_all")}),key:C,icon:()=>i(ee,()=>i(We))},{label:()=>i(W,{to:`/${l.params.db_slug}/tables/${C}/new`},{default:()=>J("add_new")}),key:`new-${C}`,icon:()=>i(ee,()=>i(po))}]:null})),{key:"divider-1",type:"divider"},{label:()=>i(W,{to:`/${l.params.db_slug}/tables/asset`},{default:()=>J("assets")}),key:"asset",icon:()=>i(ee,()=>i(xo))}],defaultExpandedKeys:[l.params.slug],value:l.params.slug,accordion:!0})),i(Le,{position:"absolute",contentStyle:{padding:u.width<700?"24px":r.value==="ar"?"24px 88px 24px 24px":"24px 24px 24px 88px"},nativeScrollbar:!1,id:"page_content"},()=>[v.value?i("div",{onClick:()=>v.value=!1,style:{width:"100%",height:"100%",right:"0px",top:"0px",backgroundColor:"#0000006e",position:"absolute",zIndex:99,cursor:"pointer"}}):null,n.default()])]))}});export{Yo as default};
