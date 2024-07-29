import{ag as $,j as e,b$ as y,c8 as v,c1 as S,c0 as L,a5 as O,b_ as h,ca as x,aB as de,cr as ue,ci as p,r as H,k as ge,b1 as A,T as fe,N as me,b4 as he,cs as ve,f as pe,c6 as _,g as be,l as xe,h as N,n as P,i as b,ct as ye,q as Ce}from"./BTQEsmYp.js";import{h as ke}from"./TGN3J7SD.js";import{S as ze}from"./BaqOUVXD.js";import{p as we,l as Ie,N as Se,a as $e}from"./CHw90_pf.js";import{u as B,b as D,N as K}from"./D0-2sOt0.js";import{N as E}from"./DwBFns6k.js";import{N as F}from"./BZcHH9Ck.js";import{N as Ne,a as Pe}from"./65cgFb_d.js";import{a as je,N as Oe,b as Me,B as j}from"./B8YebtwT.js";import{I as Re}from"./C005uISP.js";import{I as Le}from"./BlFc1j91.js";import{f as He,c as T,N as I}from"./BG4ehpiy.js";import{I as Be}from"./JF272QLo.js";import{I as Te}from"./Deg2tMvJ.js";import{m as q,a as Ae}from"./C3bu0SbA.js";import{f as _e}from"./DMMSRrjo.js";import{r as Ee}from"./C3yc3EA2.js";import{N as Fe}from"./B4LXA_OI.js";import{I as Ve,S as We,E as De}from"./Dytd2cIQ.js";import{W as Ke}from"./BQU-fmio.js";import{N as qe}from"./4EKlgVAE.js";import{o as Ge}from"./DbnPTcif.js";import{N as Ue}from"./BZcXEutX.js";import{N as Je}from"./C_vkgG7k.js";import{N as V}from"./BSEEEEx2.js";import{N as W}from"./7DqEacVG.js";import{N as Qe}from"./jLB6M23E.js";import{N as Xe}from"./Dxjj9nVI.js";import"./CGN1_kAc.js";import"./CcLqpMe6.js";import"./CinWyaZU.js";import"./DyhdXSIL.js";import"./CM8LO42l.js";import"./CRCZbITq.js";import"./DXruQSCb.js";import"./Bk_rJcZu.js";const Ye=$({name:"ArrowBack",render(){return e("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},e("path",{d:"M0 0h24v24H0V0z",fill:"none"}),e("path",{d:"M19 11H7.83l4.88-4.88c.39-.39.39-1.03 0-1.42-.39-.39-1.02-.39-1.41 0l-6.59 6.59c-.39.39-.39 1.02 0 1.41l6.59 6.59c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L7.83 13H19c.55 0 1-.45 1-1s-.45-1-1-1z"}))}}),Ze=y("layout-header",`
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
 `)]),eo={position:we,inverted:Boolean,bordered:{type:Boolean,default:!1}},oo=$({name:"LayoutHeader",props:Object.assign(Object.assign({},S.props),eo),setup(n){const{mergedClsPrefixRef:r,inlineThemeDisabled:c}=L(n),a=S("Layout","-layout-header",Ze,Ie,n,r),l=O(()=>{const{common:{cubicBezierEaseInOut:d},self:u}=a.value,o={"--n-bezier":d};return n.inverted?(o["--n-color"]=u.headerColorInverted,o["--n-text-color"]=u.textColorInverted,o["--n-border-color"]=u.headerBorderColorInverted):(o["--n-color"]=u.headerColor,o["--n-text-color"]=u.textColor,o["--n-border-color"]=u.headerBorderColor),o}),s=c?B("layout-header",O(()=>n.inverted?"a":"b"),l,n):void 0;return{mergedClsPrefix:r,cssVars:c?void 0:l,themeClass:s==null?void 0:s.themeClass,onRender:s==null?void 0:s.onRender}},render(){var n;const{mergedClsPrefix:r}=this;return(n=this.onRender)===null||n===void 0||n.call(this),e("div",{class:[`${r}-layout-header`,this.themeClass,this.position&&`${r}-layout-header--${this.position}-positioned`,this.bordered&&`${r}-layout-header--bordered`],style:this.cssVars},this.$slots)}}),G={icon:Function,type:{type:String,default:"info"},content:[String,Number,Function],showIcon:{type:Boolean,default:!0},closable:Boolean,keepAliveOnHover:Boolean,onClose:Function,onMouseenter:Function,onMouseleave:Function},to=h([y("message-wrapper",`
 margin: var(--n-margin);
 z-index: 0;
 transform-origin: top center;
 display: flex;
 `,[_e({overflow:"visible",originalTransition:"transform .3s var(--n-bezier)",enterToProps:{transform:"scale(1)"},leaveToProps:{transform:"scale(0.85)"}})]),y("message",`
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
 `,[["default","info","success","warning","error","loading"].map(n=>v(`${n}-type`,[h("> *",`
 color: var(--n-icon-color-${n});
 transition: color .3s var(--n-bezier);
 `)])),h("> *",`
 position: absolute;
 left: 0;
 top: 0;
 right: 0;
 bottom: 0;
 `,[je()])]),x("close",`
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
 `)])]),no={info:()=>e(Ve,null),success:()=>e(We,null),warning:()=>e(Ke,null),error:()=>e(De,null),default:()=>null},ao=$({name:"Message",props:Object.assign(Object.assign({},G),{render:Function}),setup(n){const{inlineThemeDisabled:r,mergedRtlRef:c}=L(n),{props:a,mergedClsPrefixRef:l}=de(q),s=D("Message",c,l),d=S("Message","-message",to,ue,a,l),u=O(()=>{const{type:t}=n,{common:{cubicBezierEaseInOut:i},self:{padding:f,margin:m,maxWidth:g,iconMargin:C,closeMargin:k,closeSize:z,iconSize:w,fontSize:M,lineHeight:R,borderRadius:U,iconColorInfo:J,iconColorSuccess:Q,iconColorWarning:X,iconColorError:Y,iconColorLoading:Z,closeIconSize:ee,closeBorderRadius:oe,[p("textColor",t)]:te,[p("boxShadow",t)]:ne,[p("color",t)]:ae,[p("closeColorHover",t)]:re,[p("closeColorPressed",t)]:se,[p("closeIconColor",t)]:ie,[p("closeIconColorPressed",t)]:le,[p("closeIconColorHover",t)]:ce}}=d.value;return{"--n-bezier":i,"--n-margin":m,"--n-padding":f,"--n-max-width":g,"--n-font-size":M,"--n-icon-margin":C,"--n-icon-size":w,"--n-close-icon-size":ee,"--n-close-border-radius":oe,"--n-close-size":z,"--n-close-margin":k,"--n-text-color":te,"--n-color":ae,"--n-box-shadow":ne,"--n-icon-color-info":J,"--n-icon-color-success":Q,"--n-icon-color-warning":X,"--n-icon-color-error":Y,"--n-icon-color-loading":Z,"--n-close-color-hover":re,"--n-close-color-pressed":se,"--n-close-icon-color":ie,"--n-close-icon-color-pressed":le,"--n-close-icon-color-hover":ce,"--n-line-height":R,"--n-border-radius":U}}),o=r?B("message",O(()=>n.type[0]),u,{}):void 0;return{mergedClsPrefix:l,rtlEnabled:s,messageProviderProps:a,handleClose(){var t;(t=n.onClose)===null||t===void 0||t.call(n)},cssVars:r?void 0:u,themeClass:o==null?void 0:o.themeClass,onRender:o==null?void 0:o.onRender,placement:a.placement}},render(){const{render:n,type:r,closable:c,content:a,mergedClsPrefix:l,cssVars:s,themeClass:d,onRender:u,icon:o,handleClose:t,showIcon:i}=this;u==null||u();let f;return e("div",{class:[`${l}-message-wrapper`,d],onMouseenter:this.onMouseenter,onMouseleave:this.onMouseleave,style:[{alignItems:this.placement.startsWith("top")?"flex-start":"flex-end"},s]},n?n(this.$props):e("div",{class:[`${l}-message ${l}-message--${r}-type`,this.rtlEnabled&&`${l}-message--rtl`]},(f=ro(o,r,l))&&i?e("div",{class:`${l}-message__icon ${l}-message__icon--${r}-type`},e(Oe,null,{default:()=>f})):null,e("div",{class:`${l}-message__content`},Ee(a)),c?e(Fe,{clsPrefix:l,class:`${l}-message__close`,onClick:t,absolute:!0}):null))}});function ro(n,r,c){if(typeof n=="function")return n();{const a=r==="loading"?e(Me,{clsPrefix:c,strokeWidth:24,scale:.85}):no[r]();return a?e(K,{clsPrefix:c,key:r},{default:()=>a}):null}}const so=$({name:"MessageEnvironment",props:Object.assign(Object.assign({},G),{duration:{type:Number,default:3e3},onAfterLeave:Function,onLeave:Function,internalKey:{type:String,required:!0},onInternalAfterLeave:Function,onHide:Function,onAfterHide:Function}),setup(n){let r=null;const c=H(!0);ge(()=>{a()});function a(){const{duration:i}=n;i&&(r=window.setTimeout(d,i))}function l(i){i.currentTarget===i.target&&r!==null&&(window.clearTimeout(r),r=null)}function s(i){i.currentTarget===i.target&&a()}function d(){const{onHide:i}=n;c.value=!1,r&&(window.clearTimeout(r),r=null),i&&i()}function u(){const{onClose:i}=n;i&&i(),d()}function o(){const{onAfterLeave:i,onInternalAfterLeave:f,onAfterHide:m,internalKey:g}=n;i&&i(),f&&f(g),m&&m()}function t(){d()}return{show:c,hide:d,handleClose:u,handleAfterLeave:o,handleMouseleave:s,handleMouseenter:l,deactivate:t}},render(){return e(qe,{appear:!0,onAfterLeave:this.handleAfterLeave,onLeave:this.onLeave},{default:()=>[this.show?e(ao,{content:this.content,type:this.type,icon:this.icon,showIcon:this.showIcon,closable:this.closable,onClose:this.handleClose,onMouseenter:this.keepAliveOnHover?this.handleMouseenter:void 0,onMouseleave:this.keepAliveOnHover?this.handleMouseleave:void 0}):null]})}}),io=Object.assign(Object.assign({},S.props),{to:[String,Object],duration:{type:Number,default:3e3},keepAliveOnHover:Boolean,max:Number,placement:{type:String,default:"top"},closable:Boolean,containerClass:String,containerStyle:[String,Object]}),lo=$({name:"MessageProvider",props:io,setup(n){const{mergedClsPrefixRef:r}=L(n),c=H([]),a=H({}),l={create(o,t){return s(o,Object.assign({type:"default"},t))},info(o,t){return s(o,Object.assign(Object.assign({},t),{type:"info"}))},success(o,t){return s(o,Object.assign(Object.assign({},t),{type:"success"}))},warning(o,t){return s(o,Object.assign(Object.assign({},t),{type:"warning"}))},error(o,t){return s(o,Object.assign(Object.assign({},t),{type:"error"}))},loading(o,t){return s(o,Object.assign(Object.assign({},t),{type:"loading"}))},destroyAll:u};A(q,{props:n,mergedClsPrefixRef:r}),A(Ae,l);function s(o,t){const i=He(),f=he(Object.assign(Object.assign({},t),{content:o,key:i,destroy:()=>{var g;(g=a.value[i])===null||g===void 0||g.hide()}})),{max:m}=n;return m&&c.value.length>=m&&c.value.shift(),c.value.push(f),f}function d(o){c.value.splice(c.value.findIndex(t=>t.key===o),1),delete a.value[o]}function u(){Object.values(a.value).forEach(o=>{o.hide()})}return Object.assign({mergedClsPrefix:r,messageRefs:a,messageList:c,handleAfterLeave:d},l)},render(){var n,r,c;return e(me,null,(r=(n=this.$slots).default)===null||r===void 0?void 0:r.call(n),this.messageList.length?e(fe,{to:(c=this.to)!==null&&c!==void 0?c:"body"},e("div",{class:[`${this.mergedClsPrefix}-message-container`,`${this.mergedClsPrefix}-message-container--${this.placement}`,this.containerClass],key:"message-container",style:this.containerStyle},this.messageList.map(a=>e(so,Object.assign({ref:l=>{l&&(this.messageRefs[a.key]=l)},internalKey:a.key,onInternalAfterLeave:this.handleAfterLeave},Ge(a,["destroy"],void 0),{duration:a.duration===void 0?this.duration:a.duration,keepAliveOnHover:a.keepAliveOnHover===void 0?this.keepAliveOnHover:a.keepAliveOnHover,closable:a.closable===void 0?this.closable:a.closable}))))):null)}}),co=h([y("page-header-header",`
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
 `,[h("&:not(:first-child)","margin-top: 20px;")])]),uo=Object.assign(Object.assign({},S.props),{title:String,subtitle:String,extra:String,onBack:Function}),go=$({name:"PageHeader",props:uo,setup(n){const{mergedClsPrefixRef:r,mergedRtlRef:c,inlineThemeDisabled:a}=L(n),l=S("PageHeader","-page-header",co,ve,n,r),s=D("PageHeader",c,r),d=O(()=>{const{self:{titleTextColor:o,subtitleTextColor:t,backColor:i,fontSize:f,titleFontSize:m,backSize:g,titleFontWeight:C,backColorHover:k,backColorPressed:z},common:{cubicBezierEaseInOut:w}}=l.value;return{"--n-title-text-color":o,"--n-title-font-size":m,"--n-title-font-weight":C,"--n-font-size":f,"--n-back-size":g,"--n-subtitle-text-color":t,"--n-back-color":i,"--n-back-color-hover":k,"--n-back-color-pressed":z,"--n-bezier":w}}),u=a?B("page-header",void 0,d,n):void 0;return{rtlEnabled:s,mergedClsPrefix:r,cssVars:a?void 0:d,themeClass:u==null?void 0:u.themeClass,onRender:u==null?void 0:u.onRender}},render(){var n;const{onBack:r,title:c,subtitle:a,extra:l,mergedClsPrefix:s,cssVars:d,$slots:u}=this;(n=this.onRender)===null||n===void 0||n.call(this);const{title:o,subtitle:t,extra:i,default:f,header:m,avatar:g,footer:C,back:k}=u,z=r,w=c||o,M=a||t,R=l||i;return e("div",{style:d,class:[`${s}-page-header-wrapper`,this.themeClass,this.rtlEnabled&&`${s}-page-header-wrapper--rtl`]},m?e("div",{class:`${s}-page-header-header`,key:"breadcrumb"},m()):null,(z||g||w||M||R)&&e("div",{class:`${s}-page-header`,key:"header"},e("div",{class:`${s}-page-header__main`,key:"back"},z?e("div",{class:`${s}-page-header__back`,onClick:r},k?k():e(K,{clsPrefix:s},{default:()=>e(Ye,null)})):null,g?e("div",{class:`${s}-page-header__avatar`},g()):null,w?e("div",{class:`${s}-page-header__title`,key:"title"},c||o()):null,M?e("div",{class:`${s}-page-header__subtitle`,key:"subtitle"},a||t()):null),R?e("div",{class:`${s}-page-header__extra`},l||i()):null),f?e("div",{class:`${s}-page-header-content`,key:"content"},f()):null,C?e("div",{class:`${s}-page-header-footer`,key:"footer"},C()):null)}});var fo=T("logout","IconLogout",[["path",{d:"M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2",key:"svg-0"}],["path",{d:"M9 12h12l-3 -3",key:"svg-1"}],["path",{d:"M18 15l3 -3",key:"svg-2"}]]),mo=T("moon","IconMoon",[["path",{d:"M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z",key:"svg-0"}]]),ho=T("sun","IconSun",[["path",{d:"M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0",key:"svg-0"}],["path",{d:"M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7",key:"svg-1"}]]);const Yo=pe({setup:(n,{slots:r})=>{const c=_("Language");be({ar:{settings:"الإعدادات",toggleTheme:"تغيير الوضع",edit:"تعديل",routeAdmin:"لوحة التحكم",allRightsReserved:"جميع الحقوق محفوظة",logout:"تسجيل الخروج",profile:"تعديل الحساب",session:"سجل الدخول",user:"مستخدم",admin:"مدير",translation:"ترجمة",asset:"ملف",tables:"الجداول",totalDatabaseSize:"حجم قاعدة البيانات",databaseSettings:"إعدادات قاعدة البيانات",isRequired:"إجباري",isNotValid:"غير صالح"},en:{routeAdmin:"Admin Panel"}});const a=xe(),l=N("user"),s=_("Theme"),d=N("database",()=>({slug:"inicontent",icon:"/favicon.ico"})),u=N("ThemeConfig");return()=>e(lo,{keepAliveOnHover:!0,closable:!0,containerStyle:{top:"70px"}},()=>e(Se,{position:"absolute"},()=>[e(ze,{style:"max-height: 65px",xScrollable:!0,trigger:"none"},()=>e(oo,{style:"height: 64px; padding: 15px 24px",bordered:!0},()=>e(go,{},{avatar:()=>{var o;return(o=a.name)!=null&&o.startsWith("database")?e(E,{onClick:()=>P(`/${d.value.slug}`),strong:!0,round:!0,bordered:!1,style:{cursor:"pointer",fontWeight:600,...u.value.revert&&s.value==="dark"?{color:"#000",backgroundColor:"#fff"}:{}}},{default:()=>b(d.value.slug),avatar:()=>{var t;return e(F,{fallbackSrc:"/favicon.ico",style:{backgroundColor:"transparent"},src:((t=d.value)==null?void 0:t.icon)??"/favicon.ico"})}}):e(E,{strong:!0,round:!0,bordered:!1},{default:()=>b(d.value.slug),avatar:()=>e(F,{fallbackSrc:"/favicon.ico",src:d.value.icon??"/favicon.ico"})})},title:()=>["index","auth","dashboard","database","database-auth"].includes(a.name)?null:e(Ne,{},()=>a.path.split("/").filter(Boolean).filter((o,t)=>{var i;return!((i=a.name)!=null&&i.startsWith("database"))||t!==0}).map((o,t)=>{var i;return e(Pe,{href:a.path.split("/").slice(0,t+((i=a.name)!=null&&i.startsWith("database")?3:2)).join("/"),onClick:f=>{var m;f.preventDefault(),P(a.path.split("/").slice(0,t+((m=a.name)!=null&&m.startsWith("database")?3:2)).join("/"))}},()=>ye(o)&&N("itemLabel").value?N("itemLabel").value:b(o==="admin"?"routeAdmin":o))})),extra:()=>e(Ue,()=>{var o,t,i,f,m;return[...(o=l.value)!=null&&o.id?[...((t=l.value)==null?void 0:t.role)==="d7b3d61a582e53ee29b5a1d02a436d55"?[e(Je,{},{trigger:()=>e(j,{round:!0,size:"small"},()=>ke(d.value.size)),default:()=>b("totalDatabaseSize")}),e(V,{},{trigger:()=>e(j,{size:"small",round:!0,tag:"a",href:`/${d.value.slug}/admin/settings`,onClick:g=>{g.preventDefault(),P(`/${d.value.slug}/admin/settings`)}},{icon:()=>e(I,()=>e(Re))}),default:()=>b("databaseSettings")})]:[],e(W,{options:[{key:"header",type:"render",render:()=>e(Qe,{justify:"center",style:{padding:"5px 0"}},()=>e(Xe,{strong:!0},()=>l.value.username.charAt(0).toUpperCase()+l.value.username.slice(1)))},{key:"header-divider",type:"divider"},{label:b("profile"),key:"edit",icon:()=>e(I,()=>e(Le)),show:(m=(f=(i=d.value.tables)==null?void 0:i.find(({slug:g})=>g==="user"))==null?void 0:f.allowedMethods)==null?void 0:m.includes("u")},{label:b("logout"),key:"logout",icon:()=>e(I,()=>e(fo))}],onSelect:async g=>{switch(g){case"edit":P(`/${d.value.slug}/admin/tables/user/${l.value.id}/edit`);break;case"logout":await $fetch(`${Ce().public.apiBase}${d.value.slug??"inicontent"}/auth/signout`,{}),l.value=null,await P(d.value.slug?`/${d.value.slug}/auth`:"/auth");break}}},()=>e(j,{size:"small",round:!0},{icon:()=>e(I,()=>e(Be))}))]:[],e(V,{},{trigger:()=>e(j,{size:"small",round:!0,onClick:()=>{s.value=s.value==="dark"?"light":"dark"}},{icon:()=>e(I,()=>s.value==="light"?e(mo):e(ho))}),default:()=>b("toggleTheme")}),e(W,{value:c.value,options:[{label:"عربي",key:"ar"},{label:"English",key:"en"}],onSelect:g=>{c.value=g}},()=>e(j,{size:"small",round:!0},{icon:()=>e(I,()=>e(Te)),default:()=>null}))]})}))),e($e,{id:"container",position:"absolute",style:{top:"64px",height:"calc(~'100vh - 98px')"},nativeScrollbar:!1,contentStyle:{display:"flex",justifyContent:"center",alignItems:"center",padding:"24px",height:"max-content"}},()=>r.default?r.default():null)]))}},"$BNtaBIt5wd");export{Yo as default};
