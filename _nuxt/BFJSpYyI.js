import{Q as te,i as B,A as M,x as re,N as Ke,av as Ve,bE as qe,ad as Ue,bF as De,t as h,bG as ge,bH as Ge,bI as We,l as p,bJ as ze,bK as pe,bL as Ye,M as Xe,R as Je,bM as Qe,bN as Ze,b as f,d as A,f as v,e as z,aj as we,ah as X,j as K,ae as J,q as U,ab as Ie,ai as Se,af as ce,a7 as eo,h as D,aJ as be}from"./BHakqtML.js";import{C as oo}from"./CaUkvgXm.js";import{b as to,c as Re,p as ro,l as no}from"./C_LmxhMD.js";import{u as ne}from"./PYyIikNb.js";import{n as io,S as lo,k as Z,h as ao}from"./pJhFYZal.js";import{f as ee}from"./B7sYoy7v.js";import{c as L}from"./BAburf3k.js";import{r as q}from"./F1J8iogr.js";import{u as ie}from"./zjsengzr.js";import{N as co}from"./fCeV3L-Y.js";import{N as so,V as uo}from"./D98Rse4x.js";import{N as vo}from"./DqUusg6t.js";import{k as se}from"./HiGXOwLp.js";import{f as ho}from"./H9Fu335t.js";import{u as mo}from"./FuYpmigA.js";import{m as fo}from"./E0k63cBP.js";import{c as oe}from"./KdGHD0sL.js";import{V as go}from"./DS3Pv7cQ.js";async function Pe(e,r=te()){const{path:n,matched:s}=r.resolve(e);if(!s.length||(r._routePreloaded||(r._routePreloaded=new Set),r._routePreloaded.has(n)))return;const t=r._preloadPromises=r._preloadPromises||[];if(t.length>4)return Promise.all(t).then(()=>Pe(e,r));r._routePreloaded.add(n);const l=s.map(d=>{var a;return(a=d.components)==null?void 0:a.default}).filter(d=>typeof d=="function");for(const d of l){const a=Promise.resolve(d()).catch(()=>{}).finally(()=>t.splice(t.indexOf(a)));t.push(a)}await Promise.all(t)}const po=(...e)=>e.find(r=>r!==void 0);function bo(e){const r=e.componentName||"NuxtLink";function n(t,l){if(!t||e.trailingSlash!=="append"&&e.trailingSlash!=="remove")return t;if(typeof t=="string")return xe(t,e.trailingSlash);const d="path"in t&&t.path!==void 0?t.path:l(t).path;return{...t,name:void 0,path:xe(d,e.trailingSlash)}}function s(t){const l=te(),d=Je(),a=p(()=>!!t.target&&t.target!=="_self"),u=p(()=>{const S=t.to||t.href||"";return typeof S=="string"&&ze(S,{acceptRelative:!0})}),P=ge("RouterLink"),O=P&&typeof P!="string"?P.useLink:void 0,w=p(()=>{if(t.external)return!0;const S=t.to||t.href||"";return typeof S=="object"?!1:S===""||u.value}),c=p(()=>{const S=t.to||t.href||"";return w.value?S:n(S,l.resolve)}),I=w.value||O==null?void 0:O({...t,to:c}),N=p(()=>{var S;if(!c.value||u.value)return c.value;if(w.value){const E=typeof c.value=="object"&&"path"in c.value?pe(c.value):c.value,_=typeof E=="object"?l.resolve(E).href:E;return n(_,l.resolve)}return typeof c.value=="object"?((S=l.resolve(c.value))==null?void 0:S.href)??null:n(Ye(d.app.baseURL,c.value),l.resolve)});return{to:c,hasTarget:a,isAbsoluteUrl:u,isExternal:w,href:N,isActive:(I==null?void 0:I.isActive)??p(()=>c.value===l.currentRoute.value.path),isExactActive:(I==null?void 0:I.isExactActive)??p(()=>c.value===l.currentRoute.value.path),route:(I==null?void 0:I.route)??p(()=>l.resolve(c.value)),async navigate(){await Xe(N.value,{replace:t.replace,external:w.value||a.value})}}}return B({name:r,props:{to:{type:[String,Object],default:void 0,required:!1},href:{type:[String,Object],default:void 0,required:!1},target:{type:String,default:void 0,required:!1},rel:{type:String,default:void 0,required:!1},noRel:{type:Boolean,default:void 0,required:!1},prefetch:{type:Boolean,default:void 0,required:!1},prefetchOn:{type:[String,Object],default:void 0,required:!1},noPrefetch:{type:Boolean,default:void 0,required:!1},activeClass:{type:String,default:void 0,required:!1},exactActiveClass:{type:String,default:void 0,required:!1},prefetchedClass:{type:String,default:void 0,required:!1},replace:{type:Boolean,default:void 0,required:!1},ariaCurrentValue:{type:String,default:void 0,required:!1},external:{type:Boolean,default:void 0,required:!1},custom:{type:Boolean,default:void 0,required:!1}},useLink:s,setup(t,{slots:l}){const d=te(),{to:a,href:u,navigate:P,isExternal:O,hasTarget:w,isAbsoluteUrl:c}=s(t),I=M(!1),N=M(null),S=T=>{var k;N.value=t.custom?(k=T==null?void 0:T.$el)==null?void 0:k.nextElementSibling:T==null?void 0:T.$el};function E(T){var k,R;return!I.value&&(typeof t.prefetchOn=="string"?t.prefetchOn===T:((k=t.prefetchOn)==null?void 0:k[T])??((R=e.prefetchOn)==null?void 0:R[T]))&&(t.prefetch??e.prefetch)!==!1&&t.noPrefetch!==!0&&t.target!=="_blank"&&!Co()}async function _(T=re()){if(I.value)return;I.value=!0;const k=typeof a.value=="string"?a.value:O.value?pe(a.value):d.resolve(a.value).fullPath;await Promise.all([T.hooks.callHook("link:prefetch",k).catch(()=>{}),!O.value&&!w.value&&Pe(a.value,d).catch(()=>{})])}if(E("visibility")){const T=re();let k,R=null;Ke(()=>{const b=xo();Ve(()=>{k=qe(()=>{var x;(x=N==null?void 0:N.value)!=null&&x.tagName&&(R=b.observe(N.value,async()=>{R==null||R(),R=null,await _(T)}))})})}),Ue(()=>{k&&De(k),R==null||R(),R=null})}return()=>{var R;if(!O.value&&!w.value){const b={ref:S,to:a.value,activeClass:t.activeClass||e.activeClass,exactActiveClass:t.exactActiveClass||e.exactActiveClass,replace:t.replace,ariaCurrentValue:t.ariaCurrentValue,custom:t.custom};return t.custom||(E("interaction")&&(b.onPointerenter=_.bind(null,void 0),b.onFocus=_.bind(null,void 0)),I.value&&(b.class=t.prefetchedClass||e.prefetchedClass),b.rel=t.rel||void 0),h(ge("RouterLink"),b,l.default)}const T=t.target||null,k=po(t.noRel?"":t.rel,e.externalRelAttribute,c.value||w.value?"noopener noreferrer":"")||null;return t.custom?l.default?l.default({href:u.value,navigate:P,prefetch:_,get route(){if(!u.value)return;const b=new URL(u.value,window.location.href);return{path:b.pathname,fullPath:b.pathname,get query(){return Ge(b.search)},hash:b.hash,params:{},name:void 0,matched:[],redirectedFrom:void 0,meta:{},href:u.value}},rel:k,target:T,isExternal:O.value||w.value,isActive:!1,isExactActive:!1}):null:h("a",{ref:N,href:u.value||null,rel:k,target:T},(R=l.default)==null?void 0:R.call(l))}}})}const Zo=bo(We);function xe(e,r){const n=r==="append"?Qe:Ze;return ze(e)&&!e.startsWith("http")?e:n(e,!0)}function xo(){const e=re();if(e._observer)return e._observer;let r=null;const n=new Map,s=(l,d)=>(r||(r=new IntersectionObserver(a=>{for(const u of a){const P=n.get(u.target);(u.isIntersecting||u.intersectionRatio>0)&&P&&P()}})),n.set(l,d),r.observe(l),()=>{n.delete(l),r.unobserve(l),n.size===0&&(r.disconnect(),r=null)});return e._observer={observe:s}}function Co(){const e=navigator.connection;return!!(e&&(e.saveData||/2g/.test(e.effectiveType)))}const yo=B({name:"ChevronDownFilled",render(){return h("svg",{viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg"},h("path",{d:"M3.20041 5.73966C3.48226 5.43613 3.95681 5.41856 4.26034 5.70041L8 9.22652L11.7397 5.70041C12.0432 5.41856 12.5177 5.43613 12.7996 5.73966C13.0815 6.0432 13.0639 6.51775 12.7603 6.7996L8.51034 10.7996C8.22258 11.0668 7.77743 11.0668 7.48967 10.7996L3.23966 6.7996C2.93613 6.51775 2.91856 6.0432 3.20041 5.73966Z",fill:"currentColor"}))}}),zo=f("layout-sider",`
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
`,[A("bordered",[v("border",`
 content: "";
 position: absolute;
 top: 0;
 bottom: 0;
 width: 1px;
 background-color: var(--n-border-color);
 transition: background-color .3s var(--n-bezier);
 `)]),v("left-placement",[A("bordered",[v("border",`
 right: 0;
 `)])]),A("right-placement",`
 justify-content: flex-start;
 `,[A("bordered",[v("border",`
 left: 0;
 `)]),A("collapsed",[f("layout-toggle-button",[f("base-icon",`
 transform: rotate(180deg);
 `)]),f("layout-toggle-bar",[z("&:hover",[v("top",{transform:"rotate(-12deg) scale(1.15) translateY(-2px)"}),v("bottom",{transform:"rotate(12deg) scale(1.15) translateY(2px)"})])])]),f("layout-toggle-button",`
 left: 0;
 transform: translateX(-50%) translateY(-50%);
 `,[f("base-icon",`
 transform: rotate(0);
 `)]),f("layout-toggle-bar",`
 left: -28px;
 transform: rotate(180deg);
 `,[z("&:hover",[v("top",{transform:"rotate(12deg) scale(1.15) translateY(-2px)"}),v("bottom",{transform:"rotate(-12deg) scale(1.15) translateY(2px)"})])])]),A("collapsed",[f("layout-toggle-bar",[z("&:hover",[v("top",{transform:"rotate(-12deg) scale(1.15) translateY(-2px)"}),v("bottom",{transform:"rotate(12deg) scale(1.15) translateY(2px)"})])]),f("layout-toggle-button",[f("base-icon",`
 transform: rotate(0);
 `)])]),f("layout-toggle-button",`
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
 `,[f("base-icon",`
 transition: transform .3s var(--n-bezier);
 transform: rotate(180deg);
 `)]),f("layout-toggle-bar",`
 cursor: pointer;
 height: 72px;
 width: 32px;
 position: absolute;
 top: calc(50% - 36px);
 right: -28px;
 `,[v("top, bottom",`
 position: absolute;
 width: 4px;
 border-radius: 2px;
 height: 38px;
 left: 14px;
 transition: 
 background-color .3s var(--n-bezier),
 transform .3s var(--n-bezier);
 `),v("bottom",`
 position: absolute;
 top: 34px;
 `),z("&:hover",[v("top",{transform:"rotate(12deg) scale(1.15) translateY(-2px)"}),v("bottom",{transform:"rotate(-12deg) scale(1.15) translateY(2px)"})]),v("top, bottom",{backgroundColor:"var(--n-toggle-bar-color)"}),z("&:hover",[v("top, bottom",{backgroundColor:"var(--n-toggle-bar-color-hover)"})])]),v("border",`
 position: absolute;
 top: 0;
 right: 0;
 bottom: 0;
 width: 1px;
 transition: background-color .3s var(--n-bezier);
 `),f("layout-sider-scroll-container",`
 flex-grow: 1;
 flex-shrink: 0;
 box-sizing: border-box;
 height: 100%;
 opacity: 0;
 transition: opacity .3s var(--n-bezier);
 max-width: 100%;
 `),A("show-content",[f("layout-sider-scroll-container",{opacity:1})]),A("absolute-positioned",`
 position: absolute;
 left: 0;
 top: 0;
 bottom: 0;
 `)]),wo=B({name:"LayoutToggleButton",props:{clsPrefix:{type:String,required:!0},onClick:Function},render(){const{clsPrefix:e}=this;return h("div",{class:`${e}-layout-toggle-button`,onClick:this.onClick},h(we,{clsPrefix:e},{default:()=>h(oo,null)}))}}),Io=B({props:{clsPrefix:{type:String,required:!0},onClick:Function},render(){const{clsPrefix:e}=this;return h("div",{onClick:this.onClick,class:`${e}-layout-toggle-bar`},h("div",{class:`${e}-layout-toggle-bar__top`}),h("div",{class:`${e}-layout-toggle-bar__bottom`}))}}),So={position:ro,bordered:Boolean,collapsedWidth:{type:Number,default:48},width:{type:[Number,String],default:272},contentClass:String,contentStyle:{type:[String,Object],default:""},collapseMode:{type:String,default:"transform"},collapsed:{type:Boolean,default:void 0},defaultCollapsed:Boolean,showCollapsedContent:{type:Boolean,default:!0},showTrigger:{type:[Boolean,String],default:!1},nativeScrollbar:{type:Boolean,default:!0},inverted:Boolean,scrollbarProps:Object,triggerClass:String,triggerStyle:[String,Object],collapsedTriggerClass:String,collapsedTriggerStyle:[String,Object],"onUpdate:collapsed":[Function,Array],onUpdateCollapsed:[Function,Array],onAfterEnter:Function,onAfterLeave:Function,onExpand:[Function,Array],onCollapse:[Function,Array],onScroll:Function},et=B({name:"LayoutSider",props:Object.assign(Object.assign({},X.props),So),setup(e){const r=K(to),n=M(null),s=M(null),t=M(e.defaultCollapsed),l=ne(J(e,"collapsed"),t),d=p(()=>ee(l.value?e.collapsedWidth:e.width)),a=p(()=>e.collapseMode!=="transform"?{}:{minWidth:ee(e.width)}),u=p(()=>r?r.siderPlacement:"left");function P(b,x){if(e.nativeScrollbar){const{value:y}=n;y&&(x===void 0?y.scrollTo(b):y.scrollTo(b,x))}else{const{value:y}=s;y&&y.scrollTo(b,x)}}function O(){const{"onUpdate:collapsed":b,onUpdateCollapsed:x,onExpand:y,onCollapse:$}=e,{value:j}=l;x&&L(x,!j),b&&L(b,!j),t.value=!j,j?y&&L(y):$&&L($)}let w=0,c=0;const I=b=>{var x;const y=b.target;w=y.scrollLeft,c=y.scrollTop,(x=e.onScroll)===null||x===void 0||x.call(e,b)};io(()=>{if(e.nativeScrollbar){const b=n.value;b&&(b.scrollTop=c,b.scrollLeft=w)}}),U(Re,{collapsedRef:l,collapseModeRef:J(e,"collapseMode")});const{mergedClsPrefixRef:N,inlineThemeDisabled:S}=Ie(e),E=X("Layout","-layout-sider",zo,no,e,N);function _(b){var x,y;b.propertyName==="max-width"&&(l.value?(x=e.onAfterLeave)===null||x===void 0||x.call(e):(y=e.onAfterEnter)===null||y===void 0||y.call(e))}const T={scrollTo:P},k=p(()=>{const{common:{cubicBezierEaseInOut:b},self:x}=E.value,{siderToggleButtonColor:y,siderToggleButtonBorder:$,siderToggleBarColor:j,siderToggleBarColorHover:Q}=x,F={"--n-bezier":b,"--n-toggle-button-color":y,"--n-toggle-button-border":$,"--n-toggle-bar-color":j,"--n-toggle-bar-color-hover":Q};return e.inverted?(F["--n-color"]=x.siderColorInverted,F["--n-text-color"]=x.textColorInverted,F["--n-border-color"]=x.siderBorderColorInverted,F["--n-toggle-button-icon-color"]=x.siderToggleButtonIconColorInverted,F.__invertScrollbar=x.__invertScrollbar):(F["--n-color"]=x.siderColor,F["--n-text-color"]=x.textColor,F["--n-border-color"]=x.siderBorderColor,F["--n-toggle-button-icon-color"]=x.siderToggleButtonIconColor),F}),R=S?Se("layout-sider",p(()=>e.inverted?"a":"b"),k,e):void 0;return Object.assign({scrollableElRef:n,scrollbarInstRef:s,mergedClsPrefix:N,mergedTheme:E,styleMaxWidth:d,mergedCollapsed:l,scrollContainerStyle:a,siderPlacement:u,handleNativeElScroll:I,handleTransitionend:_,handleTriggerClick:O,inlineThemeDisabled:S,cssVars:k,themeClass:R==null?void 0:R.themeClass,onRender:R==null?void 0:R.onRender},T)},render(){var e;const{mergedClsPrefix:r,mergedCollapsed:n,showTrigger:s}=this;return(e=this.onRender)===null||e===void 0||e.call(this),h("aside",{class:[`${r}-layout-sider`,this.themeClass,`${r}-layout-sider--${this.position}-positioned`,`${r}-layout-sider--${this.siderPlacement}-placement`,this.bordered&&`${r}-layout-sider--bordered`,n&&`${r}-layout-sider--collapsed`,(!n||this.showCollapsedContent)&&`${r}-layout-sider--show-content`],onTransitionend:this.handleTransitionend,style:[this.inlineThemeDisabled?void 0:this.cssVars,{maxWidth:this.styleMaxWidth,width:ee(this.width)}]},this.nativeScrollbar?h("div",{class:[`${r}-layout-sider-scroll-container`,this.contentClass],onScroll:this.handleNativeElScroll,style:[this.scrollContainerStyle,{overflow:"auto"},this.contentStyle],ref:"scrollableElRef"},this.$slots):h(lo,Object.assign({},this.scrollbarProps,{onScroll:this.onScroll,ref:"scrollbarInstRef",style:this.scrollContainerStyle,contentStyle:this.contentStyle,contentClass:this.contentClass,theme:this.mergedTheme.peers.Scrollbar,themeOverrides:this.mergedTheme.peerOverrides.Scrollbar,builtinThemeOverrides:this.inverted&&this.cssVars.__invertScrollbar==="true"?{colorHover:"rgba(255, 255, 255, .4)",color:"rgba(255, 255, 255, .3)"}:void 0}),this.$slots),s?s==="bar"?h(Io,{clsPrefix:r,class:n?this.collapsedTriggerClass:this.triggerClass,style:n?this.collapsedTriggerStyle:this.triggerStyle,onClick:this.handleTriggerClick}):h(wo,{clsPrefix:r,class:n?this.collapsedTriggerClass:this.triggerClass,style:n?this.collapsedTriggerStyle:this.triggerStyle,onClick:this.handleTriggerClick}):null,this.bordered?h("div",{class:`${r}-layout-sider__border`}):null)}}),G=ce("n-menu"),de=ce("n-submenu"),ue=ce("n-menu-item-group"),Y=8;function ve(e){const r=K(G),{props:n,mergedCollapsedRef:s}=r,t=K(de,null),l=K(ue,null),d=p(()=>n.mode==="horizontal"),a=p(()=>d.value?n.dropdownPlacement:"tmNodes"in e?"right-start":"right"),u=p(()=>{var c;return Math.max((c=n.collapsedIconSize)!==null&&c!==void 0?c:n.iconSize,n.iconSize)}),P=p(()=>{var c;return!d.value&&e.root&&s.value&&(c=n.collapsedIconSize)!==null&&c!==void 0?c:n.iconSize}),O=p(()=>{if(d.value)return;const{collapsedWidth:c,indent:I,rootIndent:N}=n,{root:S,isGroup:E}=e,_=N===void 0?I:N;return S?s.value?c/2-u.value/2:_:l&&typeof l.paddingLeftRef.value=="number"?I/2+l.paddingLeftRef.value:t&&typeof t.paddingLeftRef.value=="number"?(E?I/2:I)+t.paddingLeftRef.value:0}),w=p(()=>{const{collapsedWidth:c,indent:I,rootIndent:N}=n,{value:S}=u,{root:E}=e;return d.value||!E||!s.value?Y:(N===void 0?I:N)+S+Y-(c+S)/2});return{dropdownPlacement:a,activeIconSize:P,maxIconSize:u,paddingLeft:O,iconMarginRight:w,NMenu:r,NSubmenu:t}}const he={internalKey:{type:[String,Number],required:!0},root:Boolean,isGroup:Boolean,level:{type:Number,required:!0},title:[String,Function],extra:[String,Function]},Ae=Object.assign(Object.assign({},he),{tmNode:{type:Object,required:!0},tmNodes:{type:Array,required:!0}}),Ro=B({name:"MenuOptionGroup",props:Ae,setup(e){U(de,null);const r=ve(e);U(ue,{paddingLeftRef:r.paddingLeft});const{mergedClsPrefixRef:n,props:s}=K(G);return function(){const{value:t}=n,l=r.paddingLeft.value,{nodeProps:d}=s,a=d==null?void 0:d(e.tmNode.rawNode);return h("div",{class:`${t}-menu-item-group`,role:"group"},h("div",Object.assign({},a,{class:[`${t}-menu-item-group-title`,a==null?void 0:a.class],style:[(a==null?void 0:a.style)||"",l!==void 0?`padding-left: ${l}px;`:""]}),q(e.title),e.extra?h(eo,null," ",q(e.extra)):null),h("div",null,e.tmNodes.map(u=>me(u,s))))}}}),Ne=B({name:"MenuOptionContent",props:{collapsed:Boolean,disabled:Boolean,title:[String,Function],icon:Function,extra:[String,Function],showArrow:Boolean,childActive:Boolean,hover:Boolean,paddingLeft:Number,selected:Boolean,maxIconSize:{type:Number,required:!0},activeIconSize:{type:Number,required:!0},iconMarginRight:{type:Number,required:!0},clsPrefix:{type:String,required:!0},onClick:Function,tmNode:{type:Object,required:!0},isEllipsisPlaceholder:Boolean},setup(e){const{props:r}=K(G);return{menuProps:r,style:p(()=>{const{paddingLeft:n}=e;return{paddingLeft:n&&`${n}px`}}),iconStyle:p(()=>{const{maxIconSize:n,activeIconSize:s,iconMarginRight:t}=e;return{width:`${n}px`,height:`${n}px`,fontSize:`${s}px`,marginRight:`${t}px`}})}},render(){const{clsPrefix:e,tmNode:r,menuProps:{renderIcon:n,renderLabel:s,renderExtra:t,expandIcon:l}}=this,d=n?n(r.rawNode):q(this.icon);return h("div",{onClick:a=>{var u;(u=this.onClick)===null||u===void 0||u.call(this,a)},role:"none",class:[`${e}-menu-item-content`,{[`${e}-menu-item-content--selected`]:this.selected,[`${e}-menu-item-content--collapsed`]:this.collapsed,[`${e}-menu-item-content--child-active`]:this.childActive,[`${e}-menu-item-content--disabled`]:this.disabled,[`${e}-menu-item-content--hover`]:this.hover}],style:this.style},d&&h("div",{class:`${e}-menu-item-content__icon`,style:this.iconStyle,role:"none"},[d]),h("div",{class:`${e}-menu-item-content-header`,role:"none"},this.isEllipsisPlaceholder?this.title:s?s(r.rawNode):q(this.title),this.extra||t?h("span",{class:`${e}-menu-item-content-header__extra`}," ",t?t(r.rawNode):q(this.extra)):null),this.showArrow?h(we,{ariaHidden:!0,class:`${e}-menu-item-content__arrow`,clsPrefix:e},{default:()=>l?l(r.rawNode):h(yo,null)}):null)}}),Te=Object.assign(Object.assign({},he),{rawNodes:{type:Array,default:()=>[]},tmNodes:{type:Array,default:()=>[]},tmNode:{type:Object,required:!0},disabled:Boolean,icon:Function,onClick:Function,domId:String,virtualChildActive:{type:Boolean,default:void 0},isEllipsisPlaceholder:Boolean}),le=B({name:"Submenu",props:Te,setup(e){const r=ve(e),{NMenu:n,NSubmenu:s}=r,{props:t,mergedCollapsedRef:l,mergedThemeRef:d}=n,a=p(()=>{const{disabled:c}=e;return s!=null&&s.mergedDisabledRef.value||t.disabled?!0:c}),u=M(!1);U(de,{paddingLeftRef:r.paddingLeft,mergedDisabledRef:a}),U(ue,null);function P(){const{onClick:c}=e;c&&c()}function O(){a.value||(l.value||n.toggleExpand(e.internalKey),P())}function w(c){u.value=c}return{menuProps:t,mergedTheme:d,doSelect:n.doSelect,inverted:n.invertedRef,isHorizontal:n.isHorizontalRef,mergedClsPrefix:n.mergedClsPrefixRef,maxIconSize:r.maxIconSize,activeIconSize:r.activeIconSize,iconMarginRight:r.iconMarginRight,dropdownPlacement:r.dropdownPlacement,dropdownShow:u,paddingLeft:r.paddingLeft,mergedDisabled:a,mergedValue:n.mergedValueRef,childActive:ie(()=>{var c;return(c=e.virtualChildActive)!==null&&c!==void 0?c:n.activePathRef.value.includes(e.internalKey)}),collapsed:p(()=>t.mode==="horizontal"?!1:l.value?!0:!n.mergedExpandedKeysRef.value.includes(e.internalKey)),dropdownEnabled:p(()=>!a.value&&(t.mode==="horizontal"||l.value)),handlePopoverShowChange:w,handleClick:O}},render(){var e;const{mergedClsPrefix:r,menuProps:{renderIcon:n,renderLabel:s}}=this,t=()=>{const{isHorizontal:d,paddingLeft:a,collapsed:u,mergedDisabled:P,maxIconSize:O,activeIconSize:w,title:c,childActive:I,icon:N,handleClick:S,menuProps:{nodeProps:E},dropdownShow:_,iconMarginRight:T,tmNode:k,mergedClsPrefix:R,isEllipsisPlaceholder:b,extra:x}=this,y=E==null?void 0:E(k.rawNode);return h("div",Object.assign({},y,{class:[`${R}-menu-item`,y==null?void 0:y.class],role:"menuitem"}),h(Ne,{tmNode:k,paddingLeft:a,collapsed:u,disabled:P,iconMarginRight:T,maxIconSize:O,activeIconSize:w,title:c,extra:x,showArrow:!d,childActive:I,clsPrefix:R,icon:N,hover:_,onClick:S,isEllipsisPlaceholder:b}))},l=()=>h(so,null,{default:()=>{const{tmNodes:d,collapsed:a}=this;return a?null:h("div",{class:`${r}-submenu-children`,role:"menu"},d.map(u=>me(u,this.menuProps)))}});return this.root?h(co,Object.assign({size:"large",trigger:"hover"},(e=this.menuProps)===null||e===void 0?void 0:e.dropdownProps,{themeOverrides:this.mergedTheme.peerOverrides.Dropdown,theme:this.mergedTheme.peers.Dropdown,builtinThemeOverrides:{fontSizeLarge:"14px",optionIconSizeLarge:"18px"},value:this.mergedValue,disabled:!this.dropdownEnabled,placement:this.dropdownPlacement,keyField:this.menuProps.keyField,labelField:this.menuProps.labelField,childrenField:this.menuProps.childrenField,onUpdateShow:this.handlePopoverShowChange,options:this.rawNodes,onSelect:this.doSelect,inverted:this.inverted,renderIcon:n,renderLabel:s}),{default:()=>h("div",{class:`${r}-submenu`,role:"menu","aria-expanded":!this.collapsed,id:this.domId},t(),this.isHorizontal?null:l())}):h("div",{class:`${r}-submenu`,role:"menu","aria-expanded":!this.collapsed,id:this.domId},t(),l())}}),ke=Object.assign(Object.assign({},he),{tmNode:{type:Object,required:!0},disabled:Boolean,icon:Function,onClick:Function}),Po=B({name:"MenuOption",props:ke,setup(e){const r=ve(e),{NSubmenu:n,NMenu:s}=r,{props:t,mergedClsPrefixRef:l,mergedCollapsedRef:d}=s,a=n?n.mergedDisabledRef:{value:!1},u=p(()=>a.value||e.disabled);function P(w){const{onClick:c}=e;c&&c(w)}function O(w){u.value||(s.doSelect(e.internalKey,e.tmNode.rawNode),P(w))}return{mergedClsPrefix:l,dropdownPlacement:r.dropdownPlacement,paddingLeft:r.paddingLeft,iconMarginRight:r.iconMarginRight,maxIconSize:r.maxIconSize,activeIconSize:r.activeIconSize,mergedTheme:s.mergedThemeRef,menuProps:t,dropdownEnabled:ie(()=>e.root&&d.value&&t.mode!=="horizontal"&&!u.value),selected:ie(()=>s.mergedValueRef.value===e.internalKey),mergedDisabled:u,handleClick:O}},render(){const{mergedClsPrefix:e,mergedTheme:r,tmNode:n,menuProps:{renderLabel:s,nodeProps:t}}=this,l=t==null?void 0:t(n.rawNode);return h("div",Object.assign({},l,{role:"menuitem",class:[`${e}-menu-item`,l==null?void 0:l.class]}),h(vo,{theme:r.peers.Tooltip,themeOverrides:r.peerOverrides.Tooltip,trigger:"hover",placement:this.dropdownPlacement,disabled:!this.dropdownEnabled||this.title===void 0,internalExtraClass:["menu-tooltip"]},{default:()=>s?s(n.rawNode):q(this.title),trigger:()=>h(Ne,{tmNode:n,clsPrefix:e,paddingLeft:this.paddingLeft,iconMarginRight:this.iconMarginRight,maxIconSize:this.maxIconSize,activeIconSize:this.activeIconSize,selected:this.selected,title:this.title,extra:this.extra,disabled:this.mergedDisabled,icon:this.icon,onClick:this.handleClick})}))}}),Ao=B({name:"MenuDivider",setup(){const e=K(G),{mergedClsPrefixRef:r,isHorizontalRef:n}=e;return()=>n.value?null:h("div",{class:`${r.value}-menu-divider`})}}),No=se(Ae),To=se(ke),ko=se(Te);function ae(e){return e.type==="divider"||e.type==="render"}function Ho(e){return e.type==="divider"}function me(e,r){const{rawNode:n}=e,{show:s}=n;if(s===!1)return null;if(ae(n))return Ho(n)?h(Ao,Object.assign({key:e.key},n.props)):null;const{labelField:t}=r,{key:l,level:d,isGroup:a}=e,u=Object.assign(Object.assign({},n),{title:n.title||n[t],extra:n.titleExtra||n.extra,key:l,internalKey:l,level:d,root:d===0,isGroup:a});return e.children?e.isGroup?h(Ro,Z(u,No,{tmNode:e,tmNodes:e.children,key:l})):h(le,Z(u,ko,{key:l,rawNodes:n[r.childrenField],tmNodes:e.children,tmNode:e})):h(Po,Z(u,To,{key:l,tmNode:e}))}const Ce=[z("&::before","background-color: var(--n-item-color-hover);"),v("arrow",`
 color: var(--n-arrow-color-hover);
 `),v("icon",`
 color: var(--n-item-icon-color-hover);
 `),f("menu-item-content-header",`
 color: var(--n-item-text-color-hover);
 `,[z("a",`
 color: var(--n-item-text-color-hover);
 `),v("extra",`
 color: var(--n-item-text-color-hover);
 `)])],ye=[v("icon",`
 color: var(--n-item-icon-color-hover-horizontal);
 `),f("menu-item-content-header",`
 color: var(--n-item-text-color-hover-horizontal);
 `,[z("a",`
 color: var(--n-item-text-color-hover-horizontal);
 `),v("extra",`
 color: var(--n-item-text-color-hover-horizontal);
 `)])],Oo=z([f("menu",`
 background-color: var(--n-color);
 color: var(--n-item-text-color);
 overflow: hidden;
 transition: background-color .3s var(--n-bezier);
 box-sizing: border-box;
 font-size: var(--n-font-size);
 padding-bottom: 6px;
 `,[A("horizontal",`
 max-width: 100%;
 width: 100%;
 display: flex;
 overflow: hidden;
 padding-bottom: 0;
 `,[f("submenu","margin: 0;"),f("menu-item","margin: 0;"),f("menu-item-content",`
 padding: 0 20px;
 border-bottom: 2px solid #0000;
 `,[z("&::before","display: none;"),A("selected","border-bottom: 2px solid var(--n-border-color-horizontal)")]),f("menu-item-content",[A("selected",[v("icon","color: var(--n-item-icon-color-active-horizontal);"),f("menu-item-content-header",`
 color: var(--n-item-text-color-active-horizontal);
 `,[z("a","color: var(--n-item-text-color-active-horizontal);"),v("extra","color: var(--n-item-text-color-active-horizontal);")])]),A("child-active",`
 border-bottom: 2px solid var(--n-border-color-horizontal);
 `,[f("menu-item-content-header",`
 color: var(--n-item-text-color-child-active-horizontal);
 `,[z("a",`
 color: var(--n-item-text-color-child-active-horizontal);
 `),v("extra",`
 color: var(--n-item-text-color-child-active-horizontal);
 `)]),v("icon",`
 color: var(--n-item-icon-color-child-active-horizontal);
 `)]),D("disabled",[D("selected, child-active",[z("&:focus-within",ye)]),A("selected",[V(null,[v("icon","color: var(--n-item-icon-color-active-hover-horizontal);"),f("menu-item-content-header",`
 color: var(--n-item-text-color-active-hover-horizontal);
 `,[z("a","color: var(--n-item-text-color-active-hover-horizontal);"),v("extra","color: var(--n-item-text-color-active-hover-horizontal);")])])]),A("child-active",[V(null,[v("icon","color: var(--n-item-icon-color-child-active-hover-horizontal);"),f("menu-item-content-header",`
 color: var(--n-item-text-color-child-active-hover-horizontal);
 `,[z("a","color: var(--n-item-text-color-child-active-hover-horizontal);"),v("extra","color: var(--n-item-text-color-child-active-hover-horizontal);")])])]),V("border-bottom: 2px solid var(--n-border-color-horizontal);",ye)]),f("menu-item-content-header",[z("a","color: var(--n-item-text-color-horizontal);")])])]),D("responsive",[f("menu-item-content-header",`
 overflow: hidden;
 text-overflow: ellipsis;
 `)]),A("collapsed",[f("menu-item-content",[A("selected",[z("&::before",`
 background-color: var(--n-item-color-active-collapsed) !important;
 `)]),f("menu-item-content-header","opacity: 0;"),v("arrow","opacity: 0;"),v("icon","color: var(--n-item-icon-color-collapsed);")])]),f("menu-item",`
 height: var(--n-item-height);
 margin-top: 6px;
 position: relative;
 `),f("menu-item-content",`
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
 `,[z("> *","z-index: 1;"),z("&::before",`
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
 `),A("disabled",`
 opacity: .45;
 cursor: not-allowed;
 `),A("collapsed",[v("arrow","transform: rotate(0);")]),A("selected",[z("&::before","background-color: var(--n-item-color-active);"),v("arrow","color: var(--n-arrow-color-active);"),v("icon","color: var(--n-item-icon-color-active);"),f("menu-item-content-header",`
 color: var(--n-item-text-color-active);
 `,[z("a","color: var(--n-item-text-color-active);"),v("extra","color: var(--n-item-text-color-active);")])]),A("child-active",[f("menu-item-content-header",`
 color: var(--n-item-text-color-child-active);
 `,[z("a",`
 color: var(--n-item-text-color-child-active);
 `),v("extra",`
 color: var(--n-item-text-color-child-active);
 `)]),v("arrow",`
 color: var(--n-arrow-color-child-active);
 `),v("icon",`
 color: var(--n-item-icon-color-child-active);
 `)]),D("disabled",[D("selected, child-active",[z("&:focus-within",Ce)]),A("selected",[V(null,[v("arrow","color: var(--n-arrow-color-active-hover);"),v("icon","color: var(--n-item-icon-color-active-hover);"),f("menu-item-content-header",`
 color: var(--n-item-text-color-active-hover);
 `,[z("a","color: var(--n-item-text-color-active-hover);"),v("extra","color: var(--n-item-text-color-active-hover);")])])]),A("child-active",[V(null,[v("arrow","color: var(--n-arrow-color-child-active-hover);"),v("icon","color: var(--n-item-icon-color-child-active-hover);"),f("menu-item-content-header",`
 color: var(--n-item-text-color-child-active-hover);
 `,[z("a","color: var(--n-item-text-color-child-active-hover);"),v("extra","color: var(--n-item-text-color-child-active-hover);")])])]),A("selected",[V(null,[z("&::before","background-color: var(--n-item-color-active-hover);")])]),V(null,Ce)]),v("icon",`
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
 `),v("arrow",`
 grid-area: arrow;
 font-size: 16px;
 color: var(--n-arrow-color);
 transform: rotate(180deg);
 opacity: 1;
 transition:
 color .3s var(--n-bezier),
 transform 0.2s var(--n-bezier),
 opacity 0.2s var(--n-bezier);
 `),f("menu-item-content-header",`
 grid-area: content;
 transition:
 color .3s var(--n-bezier),
 opacity .3s var(--n-bezier);
 opacity: 1;
 white-space: nowrap;
 color: var(--n-item-text-color);
 `,[z("a",`
 outline: none;
 text-decoration: none;
 transition: color .3s var(--n-bezier);
 color: var(--n-item-text-color);
 `,[z("&::before",`
 content: "";
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 `)]),v("extra",`
 font-size: .93em;
 color: var(--n-group-text-color);
 transition: color .3s var(--n-bezier);
 `)])]),f("submenu",`
 cursor: pointer;
 position: relative;
 margin-top: 6px;
 `,[f("menu-item-content",`
 height: var(--n-item-height);
 `),f("submenu-children",`
 overflow: hidden;
 padding: 0;
 `,[ho({duration:".2s"})])]),f("menu-item-group",[f("menu-item-group-title",`
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
 `)])]),f("menu-tooltip",[z("a",`
 color: inherit;
 text-decoration: none;
 `)]),f("menu-divider",`
 transition: background-color .3s var(--n-bezier);
 background-color: var(--n-divider-color);
 height: 1px;
 margin: 6px 18px;
 `)]);function V(e,r){return[A("hover",e,r),z("&:hover",e,r)]}const Eo=Object.assign(Object.assign({},X.props),{options:{type:Array,default:()=>[]},collapsed:{type:Boolean,default:void 0},collapsedWidth:{type:Number,default:48},iconSize:{type:Number,default:20},collapsedIconSize:{type:Number,default:24},rootIndent:Number,indent:{type:Number,default:32},labelField:{type:String,default:"label"},keyField:{type:String,default:"key"},childrenField:{type:String,default:"children"},disabledField:{type:String,default:"disabled"},defaultExpandAll:Boolean,defaultExpandedKeys:Array,expandedKeys:Array,value:[String,Number],defaultValue:{type:[String,Number],default:null},mode:{type:String,default:"vertical"},watchProps:{type:Array,default:void 0},disabled:Boolean,show:{type:Boolean,default:!0},inverted:Boolean,"onUpdate:expandedKeys":[Function,Array],onUpdateExpandedKeys:[Function,Array],onUpdateValue:[Function,Array],"onUpdate:value":[Function,Array],expandIcon:Function,renderIcon:Function,renderLabel:Function,renderExtra:Function,dropdownProps:Object,accordion:Boolean,nodeProps:Function,dropdownPlacement:{type:String,default:"bottom"},responsive:Boolean,items:Array,onOpenNamesChange:[Function,Array],onSelect:[Function,Array],onExpandedNamesChange:[Function,Array],expandedNames:Array,defaultExpandedNames:Array}),ot=B({name:"Menu",props:Eo,setup(e){const{mergedClsPrefixRef:r,inlineThemeDisabled:n}=Ie(e),s=X("Menu","-menu",Oo,fo,e,r),t=K(Re,null),l=p(()=>{var m;const{collapsed:C}=e;if(C!==void 0)return C;if(t){const{collapseModeRef:o,collapsedRef:g}=t;if(o.value==="width")return(m=g.value)!==null&&m!==void 0?m:!1}return!1}),d=p(()=>{const{keyField:m,childrenField:C,disabledField:o}=e;return oe(e.items||e.options,{getIgnored(g){return ae(g)},getChildren(g){return g[C]},getDisabled(g){return g[o]},getKey(g){var H;return(H=g[m])!==null&&H!==void 0?H:g.name}})}),a=p(()=>new Set(d.value.treeNodes.map(m=>m.key))),{watchProps:u}=e,P=M(null);u!=null&&u.includes("defaultValue")?be(()=>{P.value=e.defaultValue}):P.value=e.defaultValue;const O=J(e,"value"),w=ne(O,P),c=M([]),I=()=>{c.value=e.defaultExpandAll?d.value.getNonLeafKeys():e.defaultExpandedNames||e.defaultExpandedKeys||d.value.getPath(w.value,{includeSelf:!1}).keyPath};u!=null&&u.includes("defaultExpandedKeys")?be(I):I();const N=mo(e,["expandedNames","expandedKeys"]),S=ne(N,c),E=p(()=>d.value.treeNodes),_=p(()=>d.value.getPath(w.value).keyPath);U(G,{props:e,mergedCollapsedRef:l,mergedThemeRef:s,mergedValueRef:w,mergedExpandedKeysRef:S,activePathRef:_,mergedClsPrefixRef:r,isHorizontalRef:p(()=>e.mode==="horizontal"),invertedRef:J(e,"inverted"),doSelect:T,toggleExpand:R});function T(m,C){const{"onUpdate:value":o,onUpdateValue:g,onSelect:H}=e;g&&L(g,m,C),o&&L(o,m,C),H&&L(H,m,C),P.value=m}function k(m){const{"onUpdate:expandedKeys":C,onUpdateExpandedKeys:o,onExpandedNamesChange:g,onOpenNamesChange:H}=e;C&&L(C,m),o&&L(o,m),g&&L(g,m),H&&L(H,m),c.value=m}function R(m){const C=Array.from(S.value),o=C.findIndex(g=>g===m);if(~o)C.splice(o,1);else{if(e.accordion&&a.value.has(m)){const g=C.findIndex(H=>a.value.has(H));g>-1&&C.splice(g,1)}C.push(m)}k(C)}const b=m=>{const C=d.value.getPath(m??w.value,{includeSelf:!1}).keyPath;if(!C.length)return;const o=Array.from(S.value),g=new Set([...o,...C]);e.accordion&&a.value.forEach(H=>{g.has(H)&&!C.includes(H)&&g.delete(H)}),k(Array.from(g))},x=p(()=>{const{inverted:m}=e,{common:{cubicBezierEaseInOut:C},self:o}=s.value,{borderRadius:g,borderColorHorizontal:H,fontSize:Be,itemHeight:je,dividerColor:$e}=o,i={"--n-divider-color":$e,"--n-bezier":C,"--n-font-size":Be,"--n-border-color-horizontal":H,"--n-border-radius":g,"--n-item-height":je};return m?(i["--n-group-text-color"]=o.groupTextColorInverted,i["--n-color"]=o.colorInverted,i["--n-item-text-color"]=o.itemTextColorInverted,i["--n-item-text-color-hover"]=o.itemTextColorHoverInverted,i["--n-item-text-color-active"]=o.itemTextColorActiveInverted,i["--n-item-text-color-child-active"]=o.itemTextColorChildActiveInverted,i["--n-item-text-color-child-active-hover"]=o.itemTextColorChildActiveInverted,i["--n-item-text-color-active-hover"]=o.itemTextColorActiveHoverInverted,i["--n-item-icon-color"]=o.itemIconColorInverted,i["--n-item-icon-color-hover"]=o.itemIconColorHoverInverted,i["--n-item-icon-color-active"]=o.itemIconColorActiveInverted,i["--n-item-icon-color-active-hover"]=o.itemIconColorActiveHoverInverted,i["--n-item-icon-color-child-active"]=o.itemIconColorChildActiveInverted,i["--n-item-icon-color-child-active-hover"]=o.itemIconColorChildActiveHoverInverted,i["--n-item-icon-color-collapsed"]=o.itemIconColorCollapsedInverted,i["--n-item-text-color-horizontal"]=o.itemTextColorHorizontalInverted,i["--n-item-text-color-hover-horizontal"]=o.itemTextColorHoverHorizontalInverted,i["--n-item-text-color-active-horizontal"]=o.itemTextColorActiveHorizontalInverted,i["--n-item-text-color-child-active-horizontal"]=o.itemTextColorChildActiveHorizontalInverted,i["--n-item-text-color-child-active-hover-horizontal"]=o.itemTextColorChildActiveHoverHorizontalInverted,i["--n-item-text-color-active-hover-horizontal"]=o.itemTextColorActiveHoverHorizontalInverted,i["--n-item-icon-color-horizontal"]=o.itemIconColorHorizontalInverted,i["--n-item-icon-color-hover-horizontal"]=o.itemIconColorHoverHorizontalInverted,i["--n-item-icon-color-active-horizontal"]=o.itemIconColorActiveHorizontalInverted,i["--n-item-icon-color-active-hover-horizontal"]=o.itemIconColorActiveHoverHorizontalInverted,i["--n-item-icon-color-child-active-horizontal"]=o.itemIconColorChildActiveHorizontalInverted,i["--n-item-icon-color-child-active-hover-horizontal"]=o.itemIconColorChildActiveHoverHorizontalInverted,i["--n-arrow-color"]=o.arrowColorInverted,i["--n-arrow-color-hover"]=o.arrowColorHoverInverted,i["--n-arrow-color-active"]=o.arrowColorActiveInverted,i["--n-arrow-color-active-hover"]=o.arrowColorActiveHoverInverted,i["--n-arrow-color-child-active"]=o.arrowColorChildActiveInverted,i["--n-arrow-color-child-active-hover"]=o.arrowColorChildActiveHoverInverted,i["--n-item-color-hover"]=o.itemColorHoverInverted,i["--n-item-color-active"]=o.itemColorActiveInverted,i["--n-item-color-active-hover"]=o.itemColorActiveHoverInverted,i["--n-item-color-active-collapsed"]=o.itemColorActiveCollapsedInverted):(i["--n-group-text-color"]=o.groupTextColor,i["--n-color"]=o.color,i["--n-item-text-color"]=o.itemTextColor,i["--n-item-text-color-hover"]=o.itemTextColorHover,i["--n-item-text-color-active"]=o.itemTextColorActive,i["--n-item-text-color-child-active"]=o.itemTextColorChildActive,i["--n-item-text-color-child-active-hover"]=o.itemTextColorChildActiveHover,i["--n-item-text-color-active-hover"]=o.itemTextColorActiveHover,i["--n-item-icon-color"]=o.itemIconColor,i["--n-item-icon-color-hover"]=o.itemIconColorHover,i["--n-item-icon-color-active"]=o.itemIconColorActive,i["--n-item-icon-color-active-hover"]=o.itemIconColorActiveHover,i["--n-item-icon-color-child-active"]=o.itemIconColorChildActive,i["--n-item-icon-color-child-active-hover"]=o.itemIconColorChildActiveHover,i["--n-item-icon-color-collapsed"]=o.itemIconColorCollapsed,i["--n-item-text-color-horizontal"]=o.itemTextColorHorizontal,i["--n-item-text-color-hover-horizontal"]=o.itemTextColorHoverHorizontal,i["--n-item-text-color-active-horizontal"]=o.itemTextColorActiveHorizontal,i["--n-item-text-color-child-active-horizontal"]=o.itemTextColorChildActiveHorizontal,i["--n-item-text-color-child-active-hover-horizontal"]=o.itemTextColorChildActiveHoverHorizontal,i["--n-item-text-color-active-hover-horizontal"]=o.itemTextColorActiveHoverHorizontal,i["--n-item-icon-color-horizontal"]=o.itemIconColorHorizontal,i["--n-item-icon-color-hover-horizontal"]=o.itemIconColorHoverHorizontal,i["--n-item-icon-color-active-horizontal"]=o.itemIconColorActiveHorizontal,i["--n-item-icon-color-active-hover-horizontal"]=o.itemIconColorActiveHoverHorizontal,i["--n-item-icon-color-child-active-horizontal"]=o.itemIconColorChildActiveHorizontal,i["--n-item-icon-color-child-active-hover-horizontal"]=o.itemIconColorChildActiveHoverHorizontal,i["--n-arrow-color"]=o.arrowColor,i["--n-arrow-color-hover"]=o.arrowColorHover,i["--n-arrow-color-active"]=o.arrowColorActive,i["--n-arrow-color-active-hover"]=o.arrowColorActiveHover,i["--n-arrow-color-child-active"]=o.arrowColorChildActive,i["--n-arrow-color-child-active-hover"]=o.arrowColorChildActiveHover,i["--n-item-color-hover"]=o.itemColorHover,i["--n-item-color-active"]=o.itemColorActive,i["--n-item-color-active-hover"]=o.itemColorActiveHover,i["--n-item-color-active-collapsed"]=o.itemColorActiveCollapsed),i}),y=n?Se("menu",p(()=>e.inverted?"a":"b"),x,e):void 0,$=ao(),j=M(null),Q=M(null);let F=!0;const fe=()=>{var m;F?F=!1:(m=j.value)===null||m===void 0||m.sync({showAllItemsBeforeCalculate:!0})};function He(){return document.getElementById($)}const W=M(-1);function Oe(m){W.value=e.options.length-m}function Ee(m){m||(W.value=-1)}const _e=p(()=>{const m=W.value;return{children:m===-1?[]:e.options.slice(m)}}),Fe=p(()=>{const{childrenField:m,disabledField:C,keyField:o}=e;return oe([_e.value],{getIgnored(g){return ae(g)},getChildren(g){return g[m]},getDisabled(g){return g[C]},getKey(g){var H;return(H=g[o])!==null&&H!==void 0?H:g.name}})}),Le=p(()=>oe([{}]).treeNodes[0]);function Me(){var m;if(W.value===-1)return h(le,{root:!0,level:0,key:"__ellpisisGroupPlaceholder__",internalKey:"__ellpisisGroupPlaceholder__",title:"···",tmNode:Le.value,domId:$,isEllipsisPlaceholder:!0});const C=Fe.value.treeNodes[0],o=_.value,g=!!(!((m=C.children)===null||m===void 0)&&m.some(H=>o.includes(H.key)));return h(le,{level:0,root:!0,key:"__ellpisisGroup__",internalKey:"__ellpisisGroup__",title:"···",virtualChildActive:g,tmNode:C,domId:$,rawNodes:C.rawNode.children||[],tmNodes:C.children||[],isEllipsisPlaceholder:!0})}return{mergedClsPrefix:r,controlledExpandedKeys:N,uncontrolledExpanededKeys:c,mergedExpandedKeys:S,uncontrolledValue:P,mergedValue:w,activePath:_,tmNodes:E,mergedTheme:s,mergedCollapsed:l,cssVars:n?void 0:x,themeClass:y==null?void 0:y.themeClass,overflowRef:j,counterRef:Q,updateCounter:()=>{},onResize:fe,onUpdateOverflow:Ee,onUpdateCount:Oe,renderCounter:Me,getCounter:He,onRender:y==null?void 0:y.onRender,showOption:b,deriveResponsiveState:fe}},render(){const{mergedClsPrefix:e,mode:r,themeClass:n,onRender:s}=this;s==null||s();const t=()=>this.tmNodes.map(u=>me(u,this.$props)),d=r==="horizontal"&&this.responsive,a=()=>h("div",{role:r==="horizontal"?"menubar":"menu",class:[`${e}-menu`,n,`${e}-menu--${r}`,d&&`${e}-menu--responsive`,this.mergedCollapsed&&`${e}-menu--collapsed`],style:this.cssVars},d?h(go,{ref:"overflowRef",onUpdateOverflow:this.onUpdateOverflow,getCounter:this.getCounter,onUpdateCount:this.onUpdateCount,updateCounter:this.updateCounter,style:{width:"100%",display:"flex",overflow:"hidden"}},{default:t,counter:this.renderCounter}):t());return d?h(uo,{onResize:this.onResize},{default:a}):a()}});export{Zo as N,et as a,ot as b};
