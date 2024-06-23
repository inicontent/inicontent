import{ai as $,j as e,c1 as y,c9 as v,c3 as S,c2 as M,a7 as j,c0 as h,cb as x,aD as de,cr as ue,ci as p,r as L,k as fe,b3 as T,U as ge,P as me,b6 as he,cs as ve,f as pe,c8 as _,g as be,l as xe,h as H,n as N,i as b,q as ye}from"./CxnGVyhp.js";import{h as Ce}from"./TGN3J7SD.js";import{m as D,a as ke}from"./qbCFyPt7.js";import{a as ze,N as we,b as Ie,B as P}from"./pGR6bGz-.js";import{f as Se}from"./DRGq-Nn6.js";import{u as A,b as K,N as U}from"./Dk9DChTO.js";import{r as $e}from"./i7op4SKh.js";import{N as Ne}from"./7VV2SlMV.js";import{I as Pe,S as je,E as Oe}from"./JsPMMp-q.js";import{W as Re}from"./BIFxaSnm.js";import{N as Me}from"./CNETrRH7.js";import{o as He}from"./DbnPTcif.js";import{f as Le,c as B,N as I}from"./B8ML8M37.js";import{S as Ae}from"./9_HLGlw2.js";import{p as Be,l as Te,N as _e,a as Ee}from"./C6lyZKll.js";import{N as Fe,a as Ve}from"./6Bs4u4d6.js";import{I as We}from"./YygoCnYj.js";import{I as De}from"./CNPWhaFI.js";import{I as Ke}from"./Cx63W5eL.js";import{I as Ue}from"./ClsaYaxY.js";import{N as E}from"./B785-Kxg.js";import{N as F}from"./DIuloEtf.js";import{N as qe}from"./B05TBuGD.js";import{N as Ge}from"./DuMr5TNm.js";import{N as V}from"./GVDT1Leh.js";import{N as Je}from"./CByUl5Ic.js";import{N as Qe}from"./BUK1trzW.js";import{N as W}from"./BdMyVQZ0.js";import"./BlqEBakL.js";import"./BG2T0eU0.js";import"./CM8LO42l.js";import"./BLRfiT1v.js";import"./DXruQSCb.js";import"./Bk_rJcZu.js";import"./H--Keu5V.js";import"./YzvmRrfj.js";const Xe=$({name:"ArrowBack",render(){return e("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},e("path",{d:"M0 0h24v24H0V0z",fill:"none"}),e("path",{d:"M19 11H7.83l4.88-4.88c.39-.39.39-1.03 0-1.42-.39-.39-1.02-.39-1.41 0l-6.59 6.59c-.39.39-.39 1.02 0 1.41l6.59 6.59c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L7.83 13H19c.55 0 1-.45 1-1s-.45-1-1-1z"}))}}),Ye=y("layout-header",`
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 box-sizing: border-box;
 width: 100%;
 background-color: var(--n-color);
 color: var(--n-text-color);
`,[v("absolute-positioned",`
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 `),v("bordered",`
 border-bottom: solid 1px var(--n-border-color);
 `)]),Ze={position:Be,inverted:Boolean,bordered:{type:Boolean,default:!1}},eo=$({name:"LayoutHeader",props:Object.assign(Object.assign({},S.props),Ze),setup(a){const{mergedClsPrefixRef:r,inlineThemeDisabled:c}=M(a),t=S("Layout","-layout-header",Ye,Te,a,r),i=j(()=>{const{common:{cubicBezierEaseInOut:u},self:d}=t.value,o={"--n-bezier":u};return a.inverted?(o["--n-color"]=d.headerColorInverted,o["--n-text-color"]=d.textColorInverted,o["--n-border-color"]=d.headerBorderColorInverted):(o["--n-color"]=d.headerColor,o["--n-text-color"]=d.textColor,o["--n-border-color"]=d.headerBorderColor),o}),s=c?A("layout-header",j(()=>a.inverted?"a":"b"),i,a):void 0;return{mergedClsPrefix:r,cssVars:c?void 0:i,themeClass:s==null?void 0:s.themeClass,onRender:s==null?void 0:s.onRender}},render(){var a;const{mergedClsPrefix:r}=this;return(a=this.onRender)===null||a===void 0||a.call(this),e("div",{class:[`${r}-layout-header`,this.themeClass,this.position&&`${r}-layout-header--${this.position}-positioned`,this.bordered&&`${r}-layout-header--bordered`],style:this.cssVars},this.$slots)}}),q={icon:Function,type:{type:String,default:"info"},content:[String,Number,Function],showIcon:{type:Boolean,default:!0},closable:Boolean,keepAliveOnHover:Boolean,onClose:Function,onMouseenter:Function,onMouseleave:Function},oo=h([y("message-wrapper",`
 margin: var(--n-margin);
 z-index: 0;
 transform-origin: top center;
 display: flex;
 `,[Se({overflow:"visible",originalTransition:"transform .3s var(--n-bezier)",enterToProps:{transform:"scale(1)"},leaveToProps:{transform:"scale(0.85)"}})]),y("message",`
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
 `,[["default","info","success","warning","error","loading"].map(a=>v(`${a}-type`,[h("> *",`
 color: var(--n-icon-color-${a});
 transition: color .3s var(--n-bezier);
 `)])),h("> *",`
 position: absolute;
 left: 0;
 top: 0;
 right: 0;
 bottom: 0;
 `,[ze()])]),x("close",`
 margin: var(--n-close-margin);
 transition:
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 flex-shrink: 0;
 `,[h("&:hover",`
 color: var(--n-close-icon-color-hover);
 `),h("&:active",`
 color: var(--n-close-icon-color-pressed);
 `)])]),y("message-container",`
 z-index: 6000;
 position: fixed;
 height: 0;
 overflow: visible;
 display: flex;
 flex-direction: column;
 align-items: center;
 `,[v("top",`
 top: 12px;
 left: 0;
 right: 0;
 `),v("top-left",`
 top: 12px;
 left: 12px;
 right: 0;
 align-items: flex-start;
 `),v("top-right",`
 top: 12px;
 left: 0;
 right: 12px;
 align-items: flex-end;
 `),v("bottom",`
 bottom: 4px;
 left: 0;
 right: 0;
 justify-content: flex-end;
 `),v("bottom-left",`
 bottom: 4px;
 left: 12px;
 right: 0;
 justify-content: flex-end;
 align-items: flex-start;
 `),v("bottom-right",`
 bottom: 4px;
 left: 0;
 right: 12px;
 justify-content: flex-end;
 align-items: flex-end;
 `)])]),to={info:()=>e(Pe,null),success:()=>e(je,null),warning:()=>e(Re,null),error:()=>e(Oe,null),default:()=>null},no=$({name:"Message",props:Object.assign(Object.assign({},q),{render:Function}),setup(a){const{inlineThemeDisabled:r,mergedRtlRef:c}=M(a),{props:t,mergedClsPrefixRef:i}=de(D),s=K("Message",c,i),u=S("Message","-message",oo,ue,t,i),d=j(()=>{const{type:n}=a,{common:{cubicBezierEaseInOut:l},self:{padding:f,margin:g,maxWidth:m,iconMargin:C,closeMargin:k,closeSize:z,iconSize:w,fontSize:O,lineHeight:R,borderRadius:G,iconColorInfo:J,iconColorSuccess:Q,iconColorWarning:X,iconColorError:Y,iconColorLoading:Z,closeIconSize:ee,closeBorderRadius:oe,[p("textColor",n)]:te,[p("boxShadow",n)]:ne,[p("color",n)]:ae,[p("closeColorHover",n)]:re,[p("closeColorPressed",n)]:se,[p("closeIconColor",n)]:ie,[p("closeIconColorPressed",n)]:le,[p("closeIconColorHover",n)]:ce}}=u.value;return{"--n-bezier":l,"--n-margin":g,"--n-padding":f,"--n-max-width":m,"--n-font-size":O,"--n-icon-margin":C,"--n-icon-size":w,"--n-close-icon-size":ee,"--n-close-border-radius":oe,"--n-close-size":z,"--n-close-margin":k,"--n-text-color":te,"--n-color":ae,"--n-box-shadow":ne,"--n-icon-color-info":J,"--n-icon-color-success":Q,"--n-icon-color-warning":X,"--n-icon-color-error":Y,"--n-icon-color-loading":Z,"--n-close-color-hover":re,"--n-close-color-pressed":se,"--n-close-icon-color":ie,"--n-close-icon-color-pressed":le,"--n-close-icon-color-hover":ce,"--n-line-height":R,"--n-border-radius":G}}),o=r?A("message",j(()=>a.type[0]),d,{}):void 0;return{mergedClsPrefix:i,rtlEnabled:s,messageProviderProps:t,handleClose(){var n;(n=a.onClose)===null||n===void 0||n.call(a)},cssVars:r?void 0:d,themeClass:o==null?void 0:o.themeClass,onRender:o==null?void 0:o.onRender,placement:t.placement}},render(){const{render:a,type:r,closable:c,content:t,mergedClsPrefix:i,cssVars:s,themeClass:u,onRender:d,icon:o,handleClose:n,showIcon:l}=this;d==null||d();let f;return e("div",{class:[`${i}-message-wrapper`,u],onMouseenter:this.onMouseenter,onMouseleave:this.onMouseleave,style:[{alignItems:this.placement.startsWith("top")?"flex-start":"flex-end"},s]},a?a(this.$props):e("div",{class:[`${i}-message ${i}-message--${r}-type`,this.rtlEnabled&&`${i}-message--rtl`]},(f=ao(o,r,i))&&l?e("div",{class:`${i}-message__icon ${i}-message__icon--${r}-type`},e(we,null,{default:()=>f})):null,e("div",{class:`${i}-message__content`},$e(t)),c?e(Ne,{clsPrefix:i,class:`${i}-message__close`,onClick:n,absolute:!0}):null))}});function ao(a,r,c){if(typeof a=="function")return a();{const t=r==="loading"?e(Ie,{clsPrefix:c,strokeWidth:24,scale:.85}):to[r]();return t?e(U,{clsPrefix:c,key:r},{default:()=>t}):null}}const ro=$({name:"MessageEnvironment",props:Object.assign(Object.assign({},q),{duration:{type:Number,default:3e3},onAfterLeave:Function,onLeave:Function,internalKey:{type:String,required:!0},onInternalAfterLeave:Function,onHide:Function,onAfterHide:Function}),setup(a){let r=null;const c=L(!0);fe(()=>{t()});function t(){const{duration:l}=a;l&&(r=window.setTimeout(u,l))}function i(l){l.currentTarget===l.target&&r!==null&&(window.clearTimeout(r),r=null)}function s(l){l.currentTarget===l.target&&t()}function u(){const{onHide:l}=a;c.value=!1,r&&(window.clearTimeout(r),r=null),l&&l()}function d(){const{onClose:l}=a;l&&l(),u()}function o(){const{onAfterLeave:l,onInternalAfterLeave:f,onAfterHide:g,internalKey:m}=a;l&&l(),f&&f(m),g&&g()}function n(){u()}return{show:c,hide:u,handleClose:d,handleAfterLeave:o,handleMouseleave:s,handleMouseenter:i,deactivate:n}},render(){return e(Me,{appear:!0,onAfterLeave:this.handleAfterLeave,onLeave:this.onLeave},{default:()=>[this.show?e(no,{content:this.content,type:this.type,icon:this.icon,showIcon:this.showIcon,closable:this.closable,onClose:this.handleClose,onMouseenter:this.keepAliveOnHover?this.handleMouseenter:void 0,onMouseleave:this.keepAliveOnHover?this.handleMouseleave:void 0}):null]})}}),so=Object.assign(Object.assign({},S.props),{to:[String,Object],duration:{type:Number,default:3e3},keepAliveOnHover:Boolean,max:Number,placement:{type:String,default:"top"},closable:Boolean,containerClass:String,containerStyle:[String,Object]}),io=$({name:"MessageProvider",props:so,setup(a){const{mergedClsPrefixRef:r}=M(a),c=L([]),t=L({}),i={create(o,n){return s(o,Object.assign({type:"default"},n))},info(o,n){return s(o,Object.assign(Object.assign({},n),{type:"info"}))},success(o,n){return s(o,Object.assign(Object.assign({},n),{type:"success"}))},warning(o,n){return s(o,Object.assign(Object.assign({},n),{type:"warning"}))},error(o,n){return s(o,Object.assign(Object.assign({},n),{type:"error"}))},loading(o,n){return s(o,Object.assign(Object.assign({},n),{type:"loading"}))},destroyAll:d};T(D,{props:a,mergedClsPrefixRef:r}),T(ke,i);function s(o,n){const l=Le(),f=he(Object.assign(Object.assign({},n),{content:o,key:l,destroy:()=>{var m;(m=t.value[l])===null||m===void 0||m.hide()}})),{max:g}=a;return g&&c.value.length>=g&&c.value.shift(),c.value.push(f),f}function u(o){c.value.splice(c.value.findIndex(n=>n.key===o),1),delete t.value[o]}function d(){Object.values(t.value).forEach(o=>{o.hide()})}return Object.assign({mergedClsPrefix:r,messageRefs:t,messageList:c,handleAfterLeave:u},i)},render(){var a,r,c;return e(me,null,(r=(a=this.$slots).default)===null||r===void 0?void 0:r.call(a),this.messageList.length?e(ge,{to:(c=this.to)!==null&&c!==void 0?c:"body"},e("div",{class:[`${this.mergedClsPrefix}-message-container`,`${this.mergedClsPrefix}-message-container--${this.placement}`,this.containerClass],key:"message-container",style:this.containerStyle},this.messageList.map(t=>e(ro,Object.assign({ref:i=>{i&&(this.messageRefs[t.key]=i)},internalKey:t.key,onInternalAfterLeave:this.handleAfterLeave},He(t,["destroy"],void 0),{duration:t.duration===void 0?this.duration:t.duration,keepAliveOnHover:t.keepAliveOnHover===void 0?this.keepAliveOnHover:t.keepAliveOnHover,closable:t.closable===void 0?this.closable:t.closable}))))):null)}}),lo=h([y("page-header-header",`
 margin-bottom: 20px;
 `),y("page-header",`
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
 `,[h("&:hover","color: var(--n-back-color-hover);"),h("&:active","color: var(--n-back-color-pressed);")]),x("avatar",`
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
 `)]),y("page-header-content",`
 font-size: var(--n-font-size);
 `,[h("&:not(:first-child)","margin-top: 20px;")]),y("page-header-footer",`
 font-size: var(--n-font-size);
 `,[h("&:not(:first-child)","margin-top: 20px;")])]),co=Object.assign(Object.assign({},S.props),{title:String,subtitle:String,extra:String,onBack:Function}),uo=$({name:"PageHeader",props:co,setup(a){const{mergedClsPrefixRef:r,mergedRtlRef:c,inlineThemeDisabled:t}=M(a),i=S("PageHeader","-page-header",lo,ve,a,r),s=K("PageHeader",c,r),u=j(()=>{const{self:{titleTextColor:o,subtitleTextColor:n,backColor:l,fontSize:f,titleFontSize:g,backSize:m,titleFontWeight:C,backColorHover:k,backColorPressed:z},common:{cubicBezierEaseInOut:w}}=i.value;return{"--n-title-text-color":o,"--n-title-font-size":g,"--n-title-font-weight":C,"--n-font-size":f,"--n-back-size":m,"--n-subtitle-text-color":n,"--n-back-color":l,"--n-back-color-hover":k,"--n-back-color-pressed":z,"--n-bezier":w}}),d=t?A("page-header",void 0,u,a):void 0;return{rtlEnabled:s,mergedClsPrefix:r,cssVars:t?void 0:u,themeClass:d==null?void 0:d.themeClass,onRender:d==null?void 0:d.onRender}},render(){var a;const{onBack:r,title:c,subtitle:t,extra:i,mergedClsPrefix:s,cssVars:u,$slots:d}=this;(a=this.onRender)===null||a===void 0||a.call(this);const{title:o,subtitle:n,extra:l,default:f,header:g,avatar:m,footer:C,back:k}=d,z=r,w=c||o,O=t||n,R=i||l;return e("div",{style:u,class:[`${s}-page-header-wrapper`,this.themeClass,this.rtlEnabled&&`${s}-page-header-wrapper--rtl`]},g?e("div",{class:`${s}-page-header-header`,key:"breadcrumb"},g()):null,(z||m||w||O||R)&&e("div",{class:`${s}-page-header`,key:"header"},e("div",{class:`${s}-page-header__main`,key:"back"},z?e("div",{class:`${s}-page-header__back`,onClick:r},k?k():e(U,{clsPrefix:s},{default:()=>e(Xe,null)})):null,m?e("div",{class:`${s}-page-header__avatar`},m()):null,w?e("div",{class:`${s}-page-header__title`,key:"title"},c||o()):null,O?e("div",{class:`${s}-page-header__subtitle`,key:"subtitle"},t||n()):null),R?e("div",{class:`${s}-page-header__extra`},i||l()):null),f?e("div",{class:`${s}-page-header-content`,key:"content"},f()):null,C?e("div",{class:`${s}-page-header-footer`,key:"footer"},C()):null)}});var fo=B("logout","IconLogout",[["path",{d:"M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2",key:"svg-0"}],["path",{d:"M9 12h12l-3 -3",key:"svg-1"}],["path",{d:"M18 15l3 -3",key:"svg-2"}]]),go=B("moon","IconMoon",[["path",{d:"M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z",key:"svg-0"}]]),mo=B("sun","IconSun",[["path",{d:"M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0",key:"svg-0"}],["path",{d:"M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7",key:"svg-1"}]]);const Xo=pe({setup:(a,{slots:r})=>{const c=_("Language");be({ar:{settings:"الإعدادات",toggleTheme:"تغيير الوضع",edit:"تعديل",routeAdmin:"لوحة التحكم",allRightsReserved:"جميع الحقوق محفوظة",logout:"تسجيل الخروج",profile:"تعديل الحساب",session:"سجل الدخول",user:"مستخدم",admin:"مدير",translation:"ترجمة",asset:"ملف",tables:"الجداول"},en:{routeAdmin:"Admin Panel"}});const t=xe(),i=H("user"),s=_("Theme"),u=H("database",()=>({slug:"inicontent",icon:"/favicon.ico"})),d=H("ThemeConfig");return()=>e("div",e(io,{keepAliveOnHover:!0,closable:!0,containerStyle:{top:"70px"}},()=>e(_e,{position:"absolute"},()=>[e(Ae,{style:"max-height: 65px",xScrollable:!0,trigger:"none"},()=>e(eo,{style:"height: 64px; padding: 15px 24px",bordered:!0},()=>e(uo,{},{avatar:()=>{var o;return(o=t.name)!=null&&o.startsWith("database")?e(E,{onClick:()=>N(`/${u.value.slug}`),strong:!0,round:!0,bordered:!1,style:{cursor:"pointer",fontWeight:600,...d.value.revert?s.value==="light"?{}:{color:"#000",backgroundColor:"#fff"}:s.value==="dark"?{}:{color:"#fff",backgroundColor:"#000"}}},{default:()=>b(u.value.slug),avatar:()=>{var n;return e(F,{fallbackSrc:"/favicon.ico",style:{backgroundColor:"transparent"},src:((n=u.value)==null?void 0:n.icon)??"/favicon.ico"})}}):e(E,{strong:!0,round:!0,bordered:!1},{default:()=>b(u.value.slug),avatar:()=>e(F,{fallbackSrc:"/favicon.ico",src:u.value.icon??"/favicon.ico"})})},title:()=>["index","auth","dashboard","database","database-auth"].includes(t.name)?null:e(Fe,{},()=>t.path.split("/").filter(Boolean).filter((o,n)=>{var l;return!((l=t.name)!=null&&l.startsWith("database"))||n!==0}).map((o,n)=>{var l;return e(Ve,{href:t.path.split("/").slice(0,n+((l=t.name)!=null&&l.startsWith("database")?3:2)).join("/"),onClick:f=>{var g;f.preventDefault(),N(t.path.split("/").slice(0,n+((g=t.name)!=null&&g.startsWith("database")?3:2)).join("/"))}},()=>b(o==="admin"?"routeAdmin":o))})),extra:()=>e(qe,()=>{var o,n,l;return[...(o=i.value)!=null&&o.id?[((n=i.value)==null?void 0:n.role)==="d7b3d61a582e53ee29b5a1d02a436d55"?e(Ge,{},{trigger:()=>e(P,{round:!0,size:"small"},()=>Ce(u.value.size)),default:()=>b("totalDatabaseSize")}):null,e(V,{options:[{key:"header",type:"render",render:()=>e(Je,{justify:"center",style:{padding:"5px 0"}},()=>e(Qe,{strong:!0},()=>i.value.username.charAt(0).toUpperCase()+i.value.username.slice(1)))},{key:"header-divider",type:"divider"},{label:b("profile"),key:"edit",icon:()=>e(I,()=>e(We))},{label:b("logout"),key:"logout",icon:()=>e(I,()=>e(fo))}],onSelect:async f=>{switch(f){case"edit":N(`/${t.params.database}/admin/tables/user/${i.value.id}/edit`);break;case"logout":await $fetch(`${ye().public.apiBase}${t.params.database??"inicontent"}/auth/signout`,{}),i.value=null,await N(t.params.database?`/${t.params.database}/auth`:"/auth");break}}},()=>e(P,{size:"small",round:!0},{icon:()=>e(I,()=>e(De))})),((l=i.value)==null?void 0:l.role)==="d7b3d61a582e53ee29b5a1d02a436d55"?e(W,{},{trigger:()=>e(P,{size:"small",round:!0,tag:"a",href:`/${t.params.database}/admin/settings`,onClick:f=>{f.preventDefault(),N(`/${t.params.database}/admin/settings`)}},{icon:()=>e(I,()=>e(Ke))}),default:()=>b("databaseSettings")}):null]:[],e(W,{},{trigger:()=>e(P,{size:"small",round:!0,onClick:()=>{s.value=s.value==="dark"?"light":"dark"}},{icon:()=>e(I,()=>s.value==="light"?e(go):e(mo))}),default:()=>b("toggleTheme")}),e(V,{value:c.value,options:[{label:"Arabic",key:"ar"},{label:"English",key:"en"}],onSelect:f=>{c.value=f}},()=>e(P,{size:"small",round:!0},{icon:()=>e(I,()=>e(Ue)),default:()=>null}))]})}))),e(Ee,{id:"container",position:"absolute",style:{top:"64px",height:"calc(~'100vh - 98px')"},nativeScrollbar:!1,contentStyle:{display:"flex",justifyContent:"center",alignItems:"center",padding:"24px",height:"max-content"}},()=>r.default?r.default():null)])))}},"$BNtaBIt5wd");export{Xo as default};
