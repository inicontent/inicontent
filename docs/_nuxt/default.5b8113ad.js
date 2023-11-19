import{a as m,h as o,f as b,m as g,p as w,q as x,k as R,i as y,da as me,v as T,w as fe,b as k,l as j,x as be,C as H,e as E,Z as xe,y as F,db as we,z as ye,dc as ke,aH as Ce,T as _e,aw as ze,dd as $e,o as S,A as P,B as p,ad as Be,G as V,I as Ie,H as N,d1 as Re,D as Se,J as Pe,d2 as U}from"./entry.965cbfb6.js";import{u as je,t as M}from"./useLanguage.253ae023.js";import{b as Le}from"./index.d4f86f82.js";import"./RenderData.2b7cc39b.js";import{l as q,p as G,N as Oe,a as Me}from"./LayoutContent.2535d3d7.js";import{j as He,c as Ne,u as J,e as B,b as Y,N as K}from"./Space.f818dfb9.js";import{N as Ae,P as Te}from"./RenderFields.dc20bf3f.js";import{p as Z,q as Ee,N as Fe,b as D}from"./Trash.b33dcf75.js";import{l as Ve,i as Ue,a as Ke,d as De,I as We,S as qe,W as Ge,E as Je,m as Ye,N as A}from"./Upload.38b41102.js";import{r as Ze,N as Qe}from"./Scrollbar.bdc26b9c.js";import{N as Xe}from"./index.32cff159.js";import{o as eo}from"./Add.59e5c432.js";import{c as oo,N as I}from"./Icon.f74efb11.js";import{N as W}from"./text.4d5a7e92.js";import"./format-length.ad42f3fa.js";import"./ColorPicker.1807d23f.js";import"./Time.9226a68e.js";import"./FileText.cd6a6f0c.js";import"./Scrollbar.f1d32ba1.js";import"./use-is-composing.b2f0b09a.js";import"./Image.503ecb01.js";import"./RenderSchema.0fe72e56.js";import"./fetch.eef88911.js";import"./vue.runtime.esm-bundler.7083aaa5.js";import"./RichEditor.cdf03c68.js";import"./Upload.0a12a685.js";import"./composables.afeb471a.js";import"./use-houdini.66c23f06.js";const to=m({name:"ArrowBack",render(){return o("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},o("path",{d:"M0 0h24v24H0V0z",fill:"none"}),o("path",{d:"M19 11H7.83l4.88-4.88c.39-.39.39-1.03 0-1.42-.39-.39-1.02-.39-1.41 0l-6.59 6.59c-.39.39-.39 1.02 0 1.41l6.59 6.59c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L7.83 13H19c.55 0 1-.45 1-1s-.45-1-1-1z"}))}}),ro=b("breadcrumb",`
 white-space: nowrap;
 cursor: default;
 line-height: var(--n-item-line-height);
`,[g("ul",`
 list-style: none;
 padding: 0;
 margin: 0;
 `),g("a",`
 color: inherit;
 text-decoration: inherit;
 `),b("breadcrumb-item",`
 font-size: var(--n-font-size);
 transition: color .3s var(--n-bezier);
 display: inline-flex;
 align-items: center;
 `,[b("icon",`
 font-size: 18px;
 vertical-align: -.2em;
 transition: color .3s var(--n-bezier);
 color: var(--n-item-text-color);
 `),g("&:not(:last-child)",[w("clickable",[x("link",`
 cursor: pointer;
 `,[g("&:hover",`
 background-color: var(--n-item-color-hover);
 `),g("&:active",`
 background-color: var(--n-item-color-pressed); 
 `)])])]),x("link",`
 padding: 4px;
 border-radius: var(--n-item-border-radius);
 transition:
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 color: var(--n-item-text-color);
 position: relative;
 `,[g("&:hover",`
 color: var(--n-item-text-color-hover);
 `,[b("icon",`
 color: var(--n-item-text-color-hover);
 `)]),g("&:active",`
 color: var(--n-item-text-color-pressed);
 `,[b("icon",`
 color: var(--n-item-text-color-pressed);
 `)])]),x("separator",`
 margin: 0 8px;
 color: var(--n-separator-color);
 transition: color .3s var(--n-bezier);
 user-select: none;
 -webkit-user-select: none;
 `),g("&:last-child",[x("link",`
 font-weight: var(--n-font-weight-active);
 cursor: unset;
 color: var(--n-item-text-color-active);
 `,[b("icon",`
 color: var(--n-item-text-color-active);
 `)]),x("separator",`
 display: none;
 `)])])]),Q=be("n-breadcrumb"),no=Object.assign(Object.assign({},y.props),{separator:{type:String,default:"/"}}),so=m({name:"Breadcrumb",props:no,setup(e){const{mergedClsPrefixRef:t,inlineThemeDisabled:a}=R(e),s=y("Breadcrumb","-breadcrumb",ro,me,e,t);T(Q,{separatorRef:fe(e,"separator"),mergedClsPrefixRef:t});const c=k(()=>{const{common:{cubicBezierEaseInOut:u},self:{separatorColor:l,itemTextColor:r,itemTextColorHover:i,itemTextColorPressed:d,itemTextColorActive:h,fontSize:v,fontWeightActive:f,itemBorderRadius:C,itemColorHover:_,itemColorPressed:z,itemLineHeight:$}}=s.value;return{"--n-font-size":v,"--n-bezier":u,"--n-item-text-color":r,"--n-item-text-color-hover":i,"--n-item-text-color-pressed":d,"--n-item-text-color-active":h,"--n-separator-color":l,"--n-item-color-hover":_,"--n-item-color-pressed":z,"--n-item-border-radius":C,"--n-font-weight-active":f,"--n-item-line-height":$}}),n=a?j("breadcrumb",void 0,c,e):void 0;return{mergedClsPrefix:t,cssVars:a?void 0:c,themeClass:n==null?void 0:n.themeClass,onRender:n==null?void 0:n.onRender}},render(){var e;return(e=this.onRender)===null||e===void 0||e.call(this),o("nav",{class:[`${this.mergedClsPrefix}-breadcrumb`,this.themeClass],style:this.cssVars,"aria-label":"Breadcrumb"},o("ul",null,this.$slots))}}),ao=He?window:null,io=(e=ao)=>{const t=()=>{const{hash:c,host:n,hostname:u,href:l,origin:r,pathname:i,port:d,protocol:h,search:v}=(e==null?void 0:e.location)||{};return{hash:c,host:n,hostname:u,href:l,origin:r,pathname:i,port:d,protocol:h,search:v}},a=()=>{s.value=t()},s=H(t());return E(()=>{e&&(e.addEventListener("popstate",a),e.addEventListener("hashchange",a))}),xe(()=>{e&&(e.removeEventListener("popstate",a),e.removeEventListener("hashchange",a))}),s},lo={separator:String,href:String,clickable:{type:Boolean,default:!0},onClick:Function},co=m({name:"BreadcrumbItem",props:lo,setup(e,{slots:t}){const a=F(Q,null);if(!a)return()=>null;const{separatorRef:s,mergedClsPrefixRef:c}=a,n=io(),u=k(()=>e.href?"a":"span"),l=k(()=>n.value.href===e.href?"location":null);return()=>{const{value:r}=c;return o("li",{class:[`${r}-breadcrumb-item`,e.clickable&&`${r}-breadcrumb-item--clickable`]},o(u.value,{class:`${r}-breadcrumb-item__link`,"aria-current":l.value,href:e.href,onClick:e.onClick},t),o("span",{class:`${r}-breadcrumb-item__separator`,"aria-hidden":"true"},Ne(t.separator,()=>{var i;return[(i=e.separator)!==null&&i!==void 0?i:s.value]})))}}}),uo=b("layout-header",`
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 box-sizing: border-box;
 width: 100%;
 background-color: var(--n-color);
 color: var(--n-text-color);
`,[w("absolute-positioned",`
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 `),w("bordered",`
 border-bottom: solid 1px var(--n-border-color);
 `)]),ho={position:G,inverted:Boolean,bordered:{type:Boolean,default:!1}},vo=m({name:"LayoutHeader",props:Object.assign(Object.assign({},y.props),ho),setup(e){const{mergedClsPrefixRef:t,inlineThemeDisabled:a}=R(e),s=y("Layout","-layout-header",uo,q,e,t),c=k(()=>{const{common:{cubicBezierEaseInOut:u},self:l}=s.value,r={"--n-bezier":u};return e.inverted?(r["--n-color"]=l.headerColorInverted,r["--n-text-color"]=l.textColorInverted,r["--n-border-color"]=l.headerBorderColorInverted):(r["--n-color"]=l.headerColor,r["--n-text-color"]=l.textColor,r["--n-border-color"]=l.headerBorderColor),r}),n=a?j("layout-header",k(()=>e.inverted?"a":"b"),c,e):void 0;return{mergedClsPrefix:t,cssVars:a?void 0:c,themeClass:n==null?void 0:n.themeClass,onRender:n==null?void 0:n.onRender}},render(){var e;const{mergedClsPrefix:t}=this;return(e=this.onRender)===null||e===void 0||e.call(this),o("div",{class:[`${t}-layout-header`,this.themeClass,this.position&&`${t}-layout-header--${this.position}-positioned`,this.bordered&&`${t}-layout-header--bordered`],style:this.cssVars},this.$slots)}}),go=b("layout-footer",`
 transition:
 box-shadow .3s var(--n-bezier),
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 color: var(--n-text-color);
 background-color: var(--n-color);
 box-sizing: border-box;
`,[w("absolute-positioned",`
 position: absolute;
 left: 0;
 right: 0;
 bottom: 0;
 `),w("bordered",`
 border-top: solid 1px var(--n-border-color);
 `)]),po=Object.assign(Object.assign({},y.props),{inverted:Boolean,position:G,bordered:Boolean}),mo=m({name:"LayoutFooter",props:po,setup(e){const{mergedClsPrefixRef:t,inlineThemeDisabled:a}=R(e),s=y("Layout","-layout-footer",go,q,e,t),c=k(()=>{const{common:{cubicBezierEaseInOut:u},self:l}=s.value,r={"--n-bezier":u};return e.inverted?(r["--n-color"]=l.footerColorInverted,r["--n-text-color"]=l.textColorInverted,r["--n-border-color"]=l.footerBorderColorInverted):(r["--n-color"]=l.footerColor,r["--n-text-color"]=l.textColor,r["--n-border-color"]=l.footerBorderColor),r}),n=a?j("layout-footer",k(()=>e.inverted?"a":"b"),c,e):void 0;return{mergedClsPrefix:t,cssVars:a?void 0:c,themeClass:n==null?void 0:n.themeClass,onRender:n==null?void 0:n.onRender}},render(){var e;const{mergedClsPrefix:t}=this;return(e=this.onRender)===null||e===void 0||e.call(this),o("div",{class:[`${t}-layout-footer`,this.themeClass,this.position&&`${t}-layout-footer--${this.position}-positioned`,this.bordered&&`${t}-layout-footer--bordered`],style:this.cssVars},this.$slots)}});function fo(){const e=F(we,null);return e===null&&ye("use-loading-bar","No outer <n-loading-bar-provider /> founded."),e}const X={icon:Function,type:{type:String,default:"info"},content:[String,Number,Function],showIcon:{type:Boolean,default:!0},closable:Boolean,keepAliveOnHover:Boolean,onClose:Function,onMouseenter:Function,onMouseleave:Function},bo=g([b("message-wrapper",`
 margin: var(--n-margin);
 z-index: 0;
 transform-origin: top center;
 display: flex;
 `,[Ve({overflow:"visible",originalTransition:"transform .3s var(--n-bezier)",enterToProps:{transform:"scale(1)"},leaveToProps:{transform:"scale(0.85)"}})]),b("message",`
 box-sizing: border-box;
 display: flex;
 align-items: center;
 transition:
 color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 opacity .3s var(--n-bezier),
 transform .3s var(--n-bezier),
 margin-bottom .3s var(--n-bezier);
 padding: var(--n-padding);
 border-radius: var(--n-border-radius);
 flex-wrap: nowrap;
 overflow: hidden;
 max-width: var(--n-max-width);
 color: var(--n-text-color);
 background-color: var(--n-color);
 box-shadow: var(--n-box-shadow);
 `,[x("content",`
 display: inline-block;
 line-height: var(--n-line-height);
 font-size: var(--n-font-size);
 `),x("icon",`
 position: relative;
 margin: var(--n-icon-margin);
 height: var(--n-icon-size);
 width: var(--n-icon-size);
 font-size: var(--n-icon-size);
 flex-shrink: 0;
 `,[["default","info","success","warning","error","loading"].map(e=>w(`${e}-type`,[g("> *",`
 color: var(--n-icon-color-${e});
 transition: color .3s var(--n-bezier);
 `)])),g("> *",`
 position: absolute;
 left: 0;
 top: 0;
 right: 0;
 bottom: 0;
 `,[Ue()])]),x("close",`
 margin: var(--n-close-margin);
 transition:
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 flex-shrink: 0;
 `,[g("&:hover",`
 color: var(--n-close-icon-color-hover);
 `),g("&:active",`
 color: var(--n-close-icon-color-pressed);
 `)])]),b("message-container",`
 z-index: 6000;
 position: fixed;
 height: 0;
 overflow: visible;
 display: flex;
 flex-direction: column;
 align-items: center;
 `,[w("top",`
 top: 12px;
 left: 0;
 right: 0;
 `),w("top-left",`
 top: 12px;
 left: 12px;
 right: 0;
 align-items: flex-start;
 `),w("top-right",`
 top: 12px;
 left: 0;
 right: 12px;
 align-items: flex-end;
 `),w("bottom",`
 bottom: 4px;
 left: 0;
 right: 0;
 justify-content: flex-end;
 `),w("bottom-left",`
 bottom: 4px;
 left: 12px;
 right: 0;
 justify-content: flex-end;
 align-items: flex-start;
 `),w("bottom-right",`
 bottom: 4px;
 left: 0;
 right: 12px;
 justify-content: flex-end;
 align-items: flex-end;
 `)])]),xo={info:()=>o(We,null),success:()=>o(qe,null),warning:()=>o(Ge,null),error:()=>o(Je,null),default:()=>null},wo=m({name:"Message",props:Object.assign(Object.assign({},X),{render:Function}),setup(e){const{inlineThemeDisabled:t,mergedRtlRef:a}=R(e),{props:s,mergedClsPrefixRef:c}=F(Z),n=J("Message",a,c),u=y("Message","-message",bo,ke,s,c),l=k(()=>{const{type:i}=e,{common:{cubicBezierEaseInOut:d},self:{padding:h,margin:v,maxWidth:f,iconMargin:C,closeMargin:_,closeSize:z,iconSize:$,fontSize:L,lineHeight:O,borderRadius:ee,iconColorInfo:oe,iconColorSuccess:te,iconColorWarning:re,iconColorError:ne,iconColorLoading:se,closeIconSize:ae,closeBorderRadius:ie,[B("textColor",i)]:le,[B("boxShadow",i)]:ce,[B("color",i)]:de,[B("closeColorHover",i)]:ue,[B("closeColorPressed",i)]:he,[B("closeIconColor",i)]:ve,[B("closeIconColorPressed",i)]:ge,[B("closeIconColorHover",i)]:pe}}=u.value;return{"--n-bezier":d,"--n-margin":v,"--n-padding":h,"--n-max-width":f,"--n-font-size":L,"--n-icon-margin":C,"--n-icon-size":$,"--n-close-icon-size":ae,"--n-close-border-radius":ie,"--n-close-size":z,"--n-close-margin":_,"--n-text-color":le,"--n-color":de,"--n-box-shadow":ce,"--n-icon-color-info":oe,"--n-icon-color-success":te,"--n-icon-color-warning":re,"--n-icon-color-error":ne,"--n-icon-color-loading":se,"--n-close-color-hover":ue,"--n-close-color-pressed":he,"--n-close-icon-color":ve,"--n-close-icon-color-pressed":ge,"--n-close-icon-color-hover":pe,"--n-line-height":O,"--n-border-radius":ee}}),r=t?j("message",k(()=>e.type[0]),l,{}):void 0;return{mergedClsPrefix:c,rtlEnabled:n,messageProviderProps:s,handleClose(){var i;(i=e.onClose)===null||i===void 0||i.call(e)},cssVars:t?void 0:l,themeClass:r==null?void 0:r.themeClass,onRender:r==null?void 0:r.onRender,placement:s.placement}},render(){const{render:e,type:t,closable:a,content:s,mergedClsPrefix:c,cssVars:n,themeClass:u,onRender:l,icon:r,handleClose:i,showIcon:d}=this;l==null||l();let h;return o("div",{class:[`${c}-message-wrapper`,u],onMouseenter:this.onMouseenter,onMouseleave:this.onMouseleave,style:[{alignItems:this.placement.startsWith("top")?"flex-start":"flex-end"},n]},e?e(this.$props):o("div",{class:[`${c}-message ${c}-message--${t}-type`,this.rtlEnabled&&`${c}-message--rtl`]},(h=yo(r,t,c))&&d?o("div",{class:`${c}-message__icon ${c}-message__icon--${t}-type`},o(Ke,null,{default:()=>h})):null,o("div",{class:`${c}-message__content`},Ze(s)),a?o(Xe,{clsPrefix:c,class:`${c}-message__close`,onClick:i,absolute:!0}):null))}});function yo(e,t,a){if(typeof e=="function")return e();{const s=t==="loading"?o(De,{clsPrefix:a,strokeWidth:24,scale:.85}):xo[t]();return s?o(Y,{clsPrefix:a,key:t},{default:()=>s}):null}}const ko=m({name:"MessageEnvironment",props:Object.assign(Object.assign({},X),{duration:{type:Number,default:3e3},onAfterLeave:Function,onLeave:Function,internalKey:{type:String,required:!0},onInternalAfterLeave:Function,onHide:Function,onAfterHide:Function}),setup(e){let t=null;const a=H(!0);E(()=>{s()});function s(){const{duration:d}=e;d&&(t=window.setTimeout(u,d))}function c(d){d.currentTarget===d.target&&t!==null&&(window.clearTimeout(t),t=null)}function n(d){d.currentTarget===d.target&&s()}function u(){const{onHide:d}=e;a.value=!1,t&&(window.clearTimeout(t),t=null),d&&d()}function l(){const{onClose:d}=e;d&&d(),u()}function r(){const{onAfterLeave:d,onInternalAfterLeave:h,onAfterHide:v,internalKey:f}=e;d&&d(),h&&h(f),v&&v()}function i(){u()}return{show:a,hide:u,handleClose:l,handleAfterLeave:r,handleMouseleave:n,handleMouseenter:c,deactivate:i}},render(){return o(Ye,{appear:!0,onAfterLeave:this.handleAfterLeave,onLeave:this.onLeave},{default:()=>[this.show?o(wo,{content:this.content,type:this.type,icon:this.icon,showIcon:this.showIcon,closable:this.closable,onClose:this.handleClose,onMouseenter:this.keepAliveOnHover?this.handleMouseenter:void 0,onMouseleave:this.keepAliveOnHover?this.handleMouseleave:void 0}):null]})}}),Co=Object.assign(Object.assign({},y.props),{to:[String,Object],duration:{type:Number,default:3e3},keepAliveOnHover:Boolean,max:Number,placement:{type:String,default:"top"},closable:Boolean,containerStyle:[String,Object]}),_o=m({name:"MessageProvider",props:Co,setup(e){const{mergedClsPrefixRef:t}=R(e),a=H([]),s=H({}),c={create(r,i){return n(r,Object.assign({type:"default"},i))},info(r,i){return n(r,Object.assign(Object.assign({},i),{type:"info"}))},success(r,i){return n(r,Object.assign(Object.assign({},i),{type:"success"}))},warning(r,i){return n(r,Object.assign(Object.assign({},i),{type:"warning"}))},error(r,i){return n(r,Object.assign(Object.assign({},i),{type:"error"}))},loading(r,i){return n(r,Object.assign(Object.assign({},i),{type:"loading"}))},destroyAll:l};T(Z,{props:e,mergedClsPrefixRef:t}),T(Ee,c);function n(r,i){const d=oo(),h=ze(Object.assign(Object.assign({},i),{content:r,key:d,destroy:()=>{var f;(f=s.value[d])===null||f===void 0||f.hide()}})),{max:v}=e;return v&&a.value.length>=v&&a.value.shift(),a.value.push(h),h}function u(r){a.value.splice(a.value.findIndex(i=>i.key===r),1),delete s.value[r]}function l(){Object.values(s.value).forEach(r=>{r.hide()})}return Object.assign({mergedClsPrefix:t,messageRefs:s,messageList:a,handleAfterLeave:u},c)},render(){var e,t,a;return o(_e,null,(t=(e=this.$slots).default)===null||t===void 0?void 0:t.call(e),this.messageList.length?o(Ce,{to:(a=this.to)!==null&&a!==void 0?a:"body"},o("div",{class:[`${this.mergedClsPrefix}-message-container`,`${this.mergedClsPrefix}-message-container--${this.placement}`],key:"message-container",style:this.containerStyle},this.messageList.map(s=>o(ko,Object.assign({ref:c=>{c&&(this.messageRefs[s.key]=c)},internalKey:s.key,onInternalAfterLeave:this.handleAfterLeave},eo(s,["destroy"],void 0),{duration:s.duration===void 0?this.duration:s.duration,keepAliveOnHover:s.keepAliveOnHover===void 0?this.keepAliveOnHover:s.keepAliveOnHover,closable:s.closable===void 0?this.closable:s.closable}))))):null)}}),zo=g([b("page-header-header",`
 margin-bottom: 20px;
 `),b("page-header",`
 display: flex;
 align-items: center;
 justify-content: space-between;
 line-height: 1.5;
 font-size: var(--n-font-size);
 `,[x("main",`
 display: flex;
 flex-wrap: nowrap;
 align-items: center;
 `),x("back",`
 display: flex;
 margin-right: 16px;
 font-size: var(--n-back-size);
 cursor: pointer;
 color: var(--n-back-color);
 transition: color .3s var(--n-bezier);
 `,[g("&:hover","color: var(--n-back-color-hover);"),g("&:active","color: var(--n-back-color-pressed);")]),x("avatar",`
 display: flex;
 margin-right: 12px
 `),x("title",`
 margin-right: 16px;
 transition: color .3s var(--n-bezier);
 font-size: var(--n-title-font-size);
 font-weight: var(--n-title-font-weight);
 color: var(--n-title-text-color);
 `),x("subtitle",`
 font-size: 14px;
 transition: color .3s var(--n-bezier);
 color: var(--n-subtitle-text-color);
 `)]),b("page-header-content",`
 font-size: var(--n-font-size);
 `,[g("&:not(:first-child)","margin-top: 20px;")]),b("page-header-footer",`
 font-size: var(--n-font-size);
 `,[g("&:not(:first-child)","margin-top: 20px;")])]),$o=Object.assign(Object.assign({},y.props),{title:String,subtitle:String,extra:String,onBack:Function}),Bo=m({name:"PageHeader",props:$o,setup(e){const{mergedClsPrefixRef:t,mergedRtlRef:a,inlineThemeDisabled:s}=R(e),c=y("PageHeader","-page-header",zo,$e,e,t),n=J("PageHeader",a,t),u=k(()=>{const{self:{titleTextColor:r,subtitleTextColor:i,backColor:d,fontSize:h,titleFontSize:v,backSize:f,titleFontWeight:C,backColorHover:_,backColorPressed:z},common:{cubicBezierEaseInOut:$}}=c.value;return{"--n-title-text-color":r,"--n-title-font-size":v,"--n-title-font-weight":C,"--n-font-size":h,"--n-back-size":f,"--n-subtitle-text-color":i,"--n-back-color":d,"--n-back-color-hover":_,"--n-back-color-pressed":z,"--n-bezier":$}}),l=s?j("page-header",void 0,u,e):void 0;return{rtlEnabled:n,mergedClsPrefix:t,cssVars:s?void 0:u,themeClass:l==null?void 0:l.themeClass,onRender:l==null?void 0:l.onRender}},render(){var e;const{onBack:t,title:a,subtitle:s,extra:c,mergedClsPrefix:n,cssVars:u,$slots:l}=this;(e=this.onRender)===null||e===void 0||e.call(this);const{title:r,subtitle:i,extra:d,default:h,header:v,avatar:f,footer:C,back:_}=l,z=t,$=a||r,L=s||i,O=c||d;return o("div",{style:u,class:[`${n}-page-header-wrapper`,this.themeClass,this.rtlEnabled&&`${n}-page-header-wrapper--rtl`]},v?o("div",{class:`${n}-page-header-header`,key:"breadcrumb"},v()):null,(z||f||$||L||O)&&o("div",{class:`${n}-page-header`,key:"header"},o("div",{class:`${n}-page-header__main`,key:"back"},z?o("div",{class:`${n}-page-header__back`,onClick:t},_?_():o(Y,{clsPrefix:n},{default:()=>o(to,null)})):null,f?o("div",{class:`${n}-page-header__avatar`},f()):null,$?o("div",{class:`${n}-page-header__title`,key:"title"},a||r()):null,L?o("div",{class:`${n}-page-header__subtitle`,key:"subtitle"},s||i()):null),O?o("div",{class:`${n}-page-header__extra`},c||d()):null),h?o("div",{class:`${n}-page-header-content`,key:"content"},h()):null,C?o("div",{class:`${n}-page-header-footer`,key:"footer"},C()):null)}}),Io={xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink",viewBox:"0 0 24 24"},Ro=p("g",{fill:"none",stroke:"currentColor","stroke-width":"2","stroke-linecap":"round","stroke-linejoin":"round"},[p("circle",{cx:"12",cy:"12",r:"9"}),p("path",{d:"M14 9.75a3.016 3.016 0 0 0-4.163.173a2.993 2.993 0 0 0 0 4.154A3.016 3.016 0 0 0 14 14.25"})],-1),So=[Ro],Po=m({name:"Copyright",render:function(t,a){return S(),P("svg",Io,So)}}),jo={xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink",viewBox:"0 0 24 24"},Lo=Be('<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h7"></path><path d="M9 3v2c0 4.418-2.239 8-5 8"></path><path d="M5 9c-.003 2.144 2.952 3.908 6.7 4"></path><path d="M12 20l4-9l4 9"></path><path d="M19.1 18h-6.2"></path></g>',1),Oo=[Lo],Mo=m({name:"Language",render:function(t,a){return S(),P("svg",jo,Oo)}}),Ho={xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink",viewBox:"0 0 24 24"},No=p("g",{fill:"none",stroke:"currentColor","stroke-width":"2","stroke-linecap":"round","stroke-linejoin":"round"},[p("path",{d:"M14 8V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2v-2"}),p("path",{d:"M7 12h14l-3-3m0 6l3-3"})],-1),Ao=[No],To=m({name:"Logout",render:function(t,a){return S(),P("svg",Ho,Ao)}}),Eo={xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink",viewBox:"0 0 24 24"},Fo=p("g",{fill:"none",stroke:"currentColor","stroke-width":"2","stroke-linecap":"round","stroke-linejoin":"round"},[p("path",{d:"M12 3h.393a7.5 7.5 0 0 0 7.92 12.446A9 9 0 1 1 12 2.992z"}),p("path",{d:"M17 4a2 2 0 0 0 2 2a2 2 0 0 0-2 2a2 2 0 0 0-2-2a2 2 0 0 0 2-2"}),p("path",{d:"M19 11h2m-1-1v2"})],-1),Vo=[Fo],Uo=m({name:"MoonStars",render:function(t,a){return S(),P("svg",Eo,Vo)}}),Ko={xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink",viewBox:"0 0 24 24"},Do=p("g",{fill:"none",stroke:"currentColor","stroke-width":"2","stroke-linecap":"round","stroke-linejoin":"round"},[p("circle",{cx:"12",cy:"12",r:"4"}),p("path",{d:"M3 12h1m8-9v1m8 8h1m-9 8v1M5.6 5.6l.7.7m12.1-.7l-.7.7m0 11.4l.7.7m-12.1-.7l-.7.7"})],-1),Wo=[Do],qo=m({name:"Sun",render:function(t,a){return S(),P("svg",Ko,Wo)}}),Go={xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink",viewBox:"0 0 24 24"},Jo=p("g",{fill:"none",stroke:"currentColor","stroke-width":"2","stroke-linecap":"round","stroke-linejoin":"round"},[p("circle",{cx:"12",cy:"12",r:"9"}),p("circle",{cx:"12",cy:"10",r:"3"}),p("path",{d:"M6.168 18.849A4 4 0 0 1 10 16h4a4 4 0 0 1 3.834 2.855"})],-1),Yo=[Jo],Zo=m({name:"UserCircle",render:function(t,a){return S(),P("svg",Go,Yo)}}),$t=m({setup:async(e,{slots:t})=>{const a=V("Language");je({ar:{Edit:"\u062A\u0639\u062F\u064A\u0644",Asset:"\u0627\u0644\u0645\u0644\u0641\u0627\u062A \u0648\u0627\u0644\u0635\u0648\u0631",Tables:"\u062C\u062F\u0627\u0648\u0644",copyright:"\u062C\u0645\u064A\u0639 \u0627\u0644\u062D\u0642\u0648\u0642 \u0645\u062D\u0641\u0648\u0638\u0629",logout:"\u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062E\u0631\u0648\u062C",profile:"\u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u062D\u0633\u0627\u0628"},en:{copyright:"All rights reserved Inicontent",logout:"Logout",profile:"Edit User"}});const s=Ie(),c=N("Window"),n=Re("User"),u=N("User"),l=V("Theme"),r=Se(),i=fo(),d=N("database",()=>({name:"Inicontent",icon:"/inicontent/favicon.ico"}));return r.hook("page:start",()=>i.start()),r.hook("page:finish",()=>i.finish()),r.hook("app:error",()=>i.error()),E(()=>{c.value={width:window.innerWidth},window.addEventListener("resize",()=>c.value={width:window.innerWidth})}),()=>o(_o,()=>o(Oe,{position:"absolute"},()=>[o(Qe,{style:"max-height: 65px",xScrollable:!0,trigger:"none"},()=>o(vo,{style:"height: 64px; padding: 15px 24px",bordered:!0},()=>o(Bo,{},{avatar:()=>o(Fe,{strong:!0,round:!0,bordered:!1},{default:()=>d.value.name,avatar:()=>{var h;return o(Ae,{src:(h=d.value.icon)!=null?h:"/inicontent/favicon.ico"})}}),title:()=>["index","auth","dashboard","db_slug","db_slug-auth"].includes(s.name)?null:o(so,{},()=>s.path.substring(1).split("/").filter(Boolean).map((h,v)=>o(co,()=>o(Pe,{to:s.path.split("/").slice(0,v+2).join("/")},()=>M(h.charAt(0).toUpperCase()+h.slice(1).replaceAll("_"," ")))))),extra:()=>o(K,{inline:!0,wrap:!1},()=>[u.value&&u.value.id?o(D,{options:[{key:"header",type:"render",render:()=>o(K,{justify:"center",style:{padding:"5px 0"}},()=>o(W,{strong:!0},()=>u.value.username.charAt(0).toUpperCase()+u.value.username.slice(1)))},{key:"header-divider",type:"divider"},{label:M("profile"),key:"edit",icon:()=>o(I,()=>o(Te))},{label:M("logout"),key:"logout",icon:()=>o(I,()=>o(To))}],onSelect:async h=>{var v;switch(h){case"edit":U(`${s.name.startsWith("dashboard")?"/dashboard/":"/"}${s.params.db_slug}/tables/user/${u.value.id}/edit`);break;case"logout":await $fetch(`https://api.inicontent.com/${(v=s.params.db_slug)!=null?v:"inicontent"}/auth/logout`,{headers:{Authorization:"Basic "+Le.Buffer.from(`${u.value.username}:${u.value.password}`).toString("base64")}}),n.value=null,u.value=null,await U(s.name.startsWith("dashboard")?"/auth":s.params.db_slug?`/${s.params.db_slug}/auth`:"/auth");break}}},()=>o(A,{size:"small",circle:!0},{icon:()=>o(I,()=>o(Zo))})):null,o(A,{size:"small",circle:!0,onClick:()=>l.value==="dark"?l.value="light":l.value="dark"},{icon:()=>o(I,()=>l.value==="light"?o(Uo):o(qo))}),o(D,{value:a.value,options:[{label:"Arabic",key:"ar"},{label:"English",key:"en"}],onSelect:h=>a.value=h},()=>o(A,{size:"small",round:!0},{icon:()=>o(I,()=>o(Mo)),default:()=>a.value.toUpperCase()}))])}))),o(Me,{id:"container",position:"absolute",style:"top: 64px; bottom: 34px; height: calc(~'100vh - 98px')",nativeScrollbar:!1,contentStyle:{display:"flex",justifyContent:"center",alignItems:"center",padding:"24px",height:"max-content"}},()=>t.default()),o(mo,{position:"absolute",style:{height:"34px",padding:"0 24px",display:"flex",alignItems:"center"},bordered:!0},()=>o(W,{},()=>[M("copyright"),o(I,{size:12},()=>o(Po)),new Date().getFullYear()]))]))}});export{$t as default};
