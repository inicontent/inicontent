import{ah as $,j as e,c0 as C,c9 as p,c2 as S,c1 as R,a6 as j,b$ as m,cb as y,aC as de,cr as ue,ci as b,r as H,k as ge,b2 as B,T as fe,O as he,b5 as ve,cs as me,f as pe,c7 as _,g as be,l as xe,h as N,n as O,i as x,ct as ye,q as Ce}from"./iB-vctTS.js";import{h as ke}from"./TGN3J7SD.js";import{m as D,a as ze}from"./9nGG6-LR.js";import{a as we,N as Ie,b as Se,B as P}from"./CfH0Rfnd.js";import{f as $e}from"./CFSUKVtA.js";import{u as T,b as K,N as q}from"./BIT3B5YX.js";import{r as Ne}from"./DpHtOXnj.js";import{N as Oe}from"./GbP_wQny.js";import{I as Pe,S as je,E as Me}from"./DsbW8gsl.js";import{W as Le}from"./Cf8jYJ5I.js";import{N as Re}from"./Ck_eslmp.js";import{o as He}from"./DbnPTcif.js";import{f as Te,c as A,N as I}from"./CIipnwcZ.js";import{S as Ae}from"./9uNlfC5L.js";import{p as Be,l as _e,N as Ee,a as Fe}from"./j8AJLQ_A.js";import{N as E}from"./BReovrZo.js";import{N as F}from"./IaC6QvTI.js";import{N as Ve,a as We}from"./Bm9ZPXG5.js";import{I as De}from"./EzjKUsmY.js";import{I as Ke}from"./CBIUv50R.js";import{I as qe}from"./DFVrCo9r.js";import{I as Ge}from"./BrGTwq0X.js";import{N as Ue}from"./Bh9gyslK.js";import{N as Je}from"./BiKgPu_f.js";import{N as V}from"./DI0Tl27M.js";import{N as Qe}from"./CJJKRjMT.js";import{N as Xe}from"./CPvx_-EK.js";import{N as W}from"./BZq9mAts.js";import"./l1kigxgp.js";import"./Dhmir_DW.js";import"./CM8LO42l.js";import"./CWG3qmBX.js";import"./DXruQSCb.js";import"./Bk_rJcZu.js";import"./49Fap_OZ.js";import"./Ccw0Pkl3.js";const Ye=$({name:"ArrowBack",render(){return e("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},e("path",{d:"M0 0h24v24H0V0z",fill:"none"}),e("path",{d:"M19 11H7.83l4.88-4.88c.39-.39.39-1.03 0-1.42-.39-.39-1.02-.39-1.41 0l-6.59 6.59c-.39.39-.39 1.02 0 1.41l6.59 6.59c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L7.83 13H19c.55 0 1-.45 1-1s-.45-1-1-1z"}))}}),Ze=C("layout-header",`
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 box-sizing: border-box;
 width: 100%;
 background-color: var(--n-color);
 color: var(--n-text-color);
`,[p("absolute-positioned",`
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 `),p("bordered",`
 border-bottom: solid 1px var(--n-border-color);
 `)]),eo={position:Be,inverted:Boolean,bordered:{type:Boolean,default:!1}},oo=$({name:"LayoutHeader",props:Object.assign(Object.assign({},S.props),eo),setup(n){const{mergedClsPrefixRef:r,inlineThemeDisabled:c}=R(n),a=S("Layout","-layout-header",Ze,_e,n,r),i=j(()=>{const{common:{cubicBezierEaseInOut:d},self:u}=a.value,o={"--n-bezier":d};return n.inverted?(o["--n-color"]=u.headerColorInverted,o["--n-text-color"]=u.textColorInverted,o["--n-border-color"]=u.headerBorderColorInverted):(o["--n-color"]=u.headerColor,o["--n-text-color"]=u.textColor,o["--n-border-color"]=u.headerBorderColor),o}),s=c?T("layout-header",j(()=>n.inverted?"a":"b"),i,n):void 0;return{mergedClsPrefix:r,cssVars:c?void 0:i,themeClass:s==null?void 0:s.themeClass,onRender:s==null?void 0:s.onRender}},render(){var n;const{mergedClsPrefix:r}=this;return(n=this.onRender)===null||n===void 0||n.call(this),e("div",{class:[`${r}-layout-header`,this.themeClass,this.position&&`${r}-layout-header--${this.position}-positioned`,this.bordered&&`${r}-layout-header--bordered`],style:this.cssVars},this.$slots)}}),G={icon:Function,type:{type:String,default:"info"},content:[String,Number,Function],showIcon:{type:Boolean,default:!0},closable:Boolean,keepAliveOnHover:Boolean,onClose:Function,onMouseenter:Function,onMouseleave:Function},to=m([C("message-wrapper",`
 margin: var(--n-margin);
 z-index: 0;
 transform-origin: top center;
 display: flex;
 `,[$e({overflow:"visible",originalTransition:"transform .3s var(--n-bezier)",enterToProps:{transform:"scale(1)"},leaveToProps:{transform:"scale(0.85)"}})]),C("message",`
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
 `,[y("content",`
 display: inline-block;
 line-height: var(--n-line-height);
 font-size: var(--n-font-size);
 `),y("icon",`
 position: relative;
 margin: var(--n-icon-margin);
 height: var(--n-icon-size);
 width: var(--n-icon-size);
 font-size: var(--n-icon-size);
 flex-shrink: 0;
 `,[["default","info","success","warning","error","loading"].map(n=>p(`${n}-type`,[m("> *",`
 color: var(--n-icon-color-${n});
 transition: color .3s var(--n-bezier);
 `)])),m("> *",`
 position: absolute;
 left: 0;
 top: 0;
 right: 0;
 bottom: 0;
 `,[we()])]),y("close",`
 margin: var(--n-close-margin);
 transition:
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 flex-shrink: 0;
 `,[m("&:hover",`
 color: var(--n-close-icon-color-hover);
 `),m("&:active",`
 color: var(--n-close-icon-color-pressed);
 `)])]),C("message-container",`
 z-index: 6000;
 position: fixed;
 height: 0;
 overflow: visible;
 display: flex;
 flex-direction: column;
 align-items: center;
 `,[p("top",`
 top: 12px;
 left: 0;
 right: 0;
 `),p("top-left",`
 top: 12px;
 left: 12px;
 right: 0;
 align-items: flex-start;
 `),p("top-right",`
 top: 12px;
 left: 0;
 right: 12px;
 align-items: flex-end;
 `),p("bottom",`
 bottom: 4px;
 left: 0;
 right: 0;
 justify-content: flex-end;
 `),p("bottom-left",`
 bottom: 4px;
 left: 12px;
 right: 0;
 justify-content: flex-end;
 align-items: flex-start;
 `),p("bottom-right",`
 bottom: 4px;
 left: 0;
 right: 12px;
 justify-content: flex-end;
 align-items: flex-end;
 `)])]),no={info:()=>e(Pe,null),success:()=>e(je,null),warning:()=>e(Le,null),error:()=>e(Me,null),default:()=>null},ao=$({name:"Message",props:Object.assign(Object.assign({},G),{render:Function}),setup(n){const{inlineThemeDisabled:r,mergedRtlRef:c}=R(n),{props:a,mergedClsPrefixRef:i}=de(D),s=K("Message",c,i),d=S("Message","-message",to,ue,a,i),u=j(()=>{const{type:t}=n,{common:{cubicBezierEaseInOut:l},self:{padding:g,margin:f,maxWidth:h,iconMargin:v,closeMargin:k,closeSize:z,iconSize:w,fontSize:M,lineHeight:L,borderRadius:U,iconColorInfo:J,iconColorSuccess:Q,iconColorWarning:X,iconColorError:Y,iconColorLoading:Z,closeIconSize:ee,closeBorderRadius:oe,[b("textColor",t)]:te,[b("boxShadow",t)]:ne,[b("color",t)]:ae,[b("closeColorHover",t)]:re,[b("closeColorPressed",t)]:se,[b("closeIconColor",t)]:ie,[b("closeIconColorPressed",t)]:le,[b("closeIconColorHover",t)]:ce}}=d.value;return{"--n-bezier":l,"--n-margin":f,"--n-padding":g,"--n-max-width":h,"--n-font-size":M,"--n-icon-margin":v,"--n-icon-size":w,"--n-close-icon-size":ee,"--n-close-border-radius":oe,"--n-close-size":z,"--n-close-margin":k,"--n-text-color":te,"--n-color":ae,"--n-box-shadow":ne,"--n-icon-color-info":J,"--n-icon-color-success":Q,"--n-icon-color-warning":X,"--n-icon-color-error":Y,"--n-icon-color-loading":Z,"--n-close-color-hover":re,"--n-close-color-pressed":se,"--n-close-icon-color":ie,"--n-close-icon-color-pressed":le,"--n-close-icon-color-hover":ce,"--n-line-height":L,"--n-border-radius":U}}),o=r?T("message",j(()=>n.type[0]),u,{}):void 0;return{mergedClsPrefix:i,rtlEnabled:s,messageProviderProps:a,handleClose(){var t;(t=n.onClose)===null||t===void 0||t.call(n)},cssVars:r?void 0:u,themeClass:o==null?void 0:o.themeClass,onRender:o==null?void 0:o.onRender,placement:a.placement}},render(){const{render:n,type:r,closable:c,content:a,mergedClsPrefix:i,cssVars:s,themeClass:d,onRender:u,icon:o,handleClose:t,showIcon:l}=this;u==null||u();let g;return e("div",{class:[`${i}-message-wrapper`,d],onMouseenter:this.onMouseenter,onMouseleave:this.onMouseleave,style:[{alignItems:this.placement.startsWith("top")?"flex-start":"flex-end"},s]},n?n(this.$props):e("div",{class:[`${i}-message ${i}-message--${r}-type`,this.rtlEnabled&&`${i}-message--rtl`]},(g=ro(o,r,i))&&l?e("div",{class:`${i}-message__icon ${i}-message__icon--${r}-type`},e(Ie,null,{default:()=>g})):null,e("div",{class:`${i}-message__content`},Ne(a)),c?e(Oe,{clsPrefix:i,class:`${i}-message__close`,onClick:t,absolute:!0}):null))}});function ro(n,r,c){if(typeof n=="function")return n();{const a=r==="loading"?e(Se,{clsPrefix:c,strokeWidth:24,scale:.85}):no[r]();return a?e(q,{clsPrefix:c,key:r},{default:()=>a}):null}}const so=$({name:"MessageEnvironment",props:Object.assign(Object.assign({},G),{duration:{type:Number,default:3e3},onAfterLeave:Function,onLeave:Function,internalKey:{type:String,required:!0},onInternalAfterLeave:Function,onHide:Function,onAfterHide:Function}),setup(n){let r=null;const c=H(!0);ge(()=>{a()});function a(){const{duration:l}=n;l&&(r=window.setTimeout(d,l))}function i(l){l.currentTarget===l.target&&r!==null&&(window.clearTimeout(r),r=null)}function s(l){l.currentTarget===l.target&&a()}function d(){const{onHide:l}=n;c.value=!1,r&&(window.clearTimeout(r),r=null),l&&l()}function u(){const{onClose:l}=n;l&&l(),d()}function o(){const{onAfterLeave:l,onInternalAfterLeave:g,onAfterHide:f,internalKey:h}=n;l&&l(),g&&g(h),f&&f()}function t(){d()}return{show:c,hide:d,handleClose:u,handleAfterLeave:o,handleMouseleave:s,handleMouseenter:i,deactivate:t}},render(){return e(Re,{appear:!0,onAfterLeave:this.handleAfterLeave,onLeave:this.onLeave},{default:()=>[this.show?e(ao,{content:this.content,type:this.type,icon:this.icon,showIcon:this.showIcon,closable:this.closable,onClose:this.handleClose,onMouseenter:this.keepAliveOnHover?this.handleMouseenter:void 0,onMouseleave:this.keepAliveOnHover?this.handleMouseleave:void 0}):null]})}}),io=Object.assign(Object.assign({},S.props),{to:[String,Object],duration:{type:Number,default:3e3},keepAliveOnHover:Boolean,max:Number,placement:{type:String,default:"top"},closable:Boolean,containerClass:String,containerStyle:[String,Object]}),lo=$({name:"MessageProvider",props:io,setup(n){const{mergedClsPrefixRef:r}=R(n),c=H([]),a=H({}),i={create(o,t){return s(o,Object.assign({type:"default"},t))},info(o,t){return s(o,Object.assign(Object.assign({},t),{type:"info"}))},success(o,t){return s(o,Object.assign(Object.assign({},t),{type:"success"}))},warning(o,t){return s(o,Object.assign(Object.assign({},t),{type:"warning"}))},error(o,t){return s(o,Object.assign(Object.assign({},t),{type:"error"}))},loading(o,t){return s(o,Object.assign(Object.assign({},t),{type:"loading"}))},destroyAll:u};B(D,{props:n,mergedClsPrefixRef:r}),B(ze,i);function s(o,t){const l=Te(),g=ve(Object.assign(Object.assign({},t),{content:o,key:l,destroy:()=>{var h;(h=a.value[l])===null||h===void 0||h.hide()}})),{max:f}=n;return f&&c.value.length>=f&&c.value.shift(),c.value.push(g),g}function d(o){c.value.splice(c.value.findIndex(t=>t.key===o),1),delete a.value[o]}function u(){Object.values(a.value).forEach(o=>{o.hide()})}return Object.assign({mergedClsPrefix:r,messageRefs:a,messageList:c,handleAfterLeave:d},i)},render(){var n,r,c;return e(he,null,(r=(n=this.$slots).default)===null||r===void 0?void 0:r.call(n),this.messageList.length?e(fe,{to:(c=this.to)!==null&&c!==void 0?c:"body"},e("div",{class:[`${this.mergedClsPrefix}-message-container`,`${this.mergedClsPrefix}-message-container--${this.placement}`,this.containerClass],key:"message-container",style:this.containerStyle},this.messageList.map(a=>e(so,Object.assign({ref:i=>{i&&(this.messageRefs[a.key]=i)},internalKey:a.key,onInternalAfterLeave:this.handleAfterLeave},He(a,["destroy"],void 0),{duration:a.duration===void 0?this.duration:a.duration,keepAliveOnHover:a.keepAliveOnHover===void 0?this.keepAliveOnHover:a.keepAliveOnHover,closable:a.closable===void 0?this.closable:a.closable}))))):null)}}),co=m([C("page-header-header",`
 margin-bottom: 20px;
 `),C("page-header",`
 display: flex;
 align-items: center;
 justify-content: space-between;
 line-height: 1.5;
 font-size: var(--n-font-size);
 `,[y("main",`
 display: flex;
 flex-wrap: nowrap;
 align-items: center;
 `),y("back",`
 display: flex;
 margin-right: 16px;
 font-size: var(--n-back-size);
 cursor: pointer;
 color: var(--n-back-color);
 transition: color .3s var(--n-bezier);
 `,[m("&:hover","color: var(--n-back-color-hover);"),m("&:active","color: var(--n-back-color-pressed);")]),y("avatar",`
 display: flex;
 margin-right: 12px
 `),y("title",`
 margin-right: 16px;
 transition: color .3s var(--n-bezier);
 font-size: var(--n-title-font-size);
 font-weight: var(--n-title-font-weight);
 color: var(--n-title-text-color);
 `),y("subtitle",`
 font-size: 14px;
 transition: color .3s var(--n-bezier);
 color: var(--n-subtitle-text-color);
 `)]),C("page-header-content",`
 font-size: var(--n-font-size);
 `,[m("&:not(:first-child)","margin-top: 20px;")]),C("page-header-footer",`
 font-size: var(--n-font-size);
 `,[m("&:not(:first-child)","margin-top: 20px;")])]),uo=Object.assign(Object.assign({},S.props),{title:String,subtitle:String,extra:String,onBack:Function}),go=$({name:"PageHeader",props:uo,setup(n){const{mergedClsPrefixRef:r,mergedRtlRef:c,inlineThemeDisabled:a}=R(n),i=S("PageHeader","-page-header",co,me,n,r),s=K("PageHeader",c,r),d=j(()=>{const{self:{titleTextColor:o,subtitleTextColor:t,backColor:l,fontSize:g,titleFontSize:f,backSize:h,titleFontWeight:v,backColorHover:k,backColorPressed:z},common:{cubicBezierEaseInOut:w}}=i.value;return{"--n-title-text-color":o,"--n-title-font-size":f,"--n-title-font-weight":v,"--n-font-size":g,"--n-back-size":h,"--n-subtitle-text-color":t,"--n-back-color":l,"--n-back-color-hover":k,"--n-back-color-pressed":z,"--n-bezier":w}}),u=a?T("page-header",void 0,d,n):void 0;return{rtlEnabled:s,mergedClsPrefix:r,cssVars:a?void 0:d,themeClass:u==null?void 0:u.themeClass,onRender:u==null?void 0:u.onRender}},render(){var n;const{onBack:r,title:c,subtitle:a,extra:i,mergedClsPrefix:s,cssVars:d,$slots:u}=this;(n=this.onRender)===null||n===void 0||n.call(this);const{title:o,subtitle:t,extra:l,default:g,header:f,avatar:h,footer:v,back:k}=u,z=r,w=c||o,M=a||t,L=i||l;return e("div",{style:d,class:[`${s}-page-header-wrapper`,this.themeClass,this.rtlEnabled&&`${s}-page-header-wrapper--rtl`]},f?e("div",{class:`${s}-page-header-header`,key:"breadcrumb"},f()):null,(z||h||w||M||L)&&e("div",{class:`${s}-page-header`,key:"header"},e("div",{class:`${s}-page-header__main`,key:"back"},z?e("div",{class:`${s}-page-header__back`,onClick:r},k?k():e(q,{clsPrefix:s},{default:()=>e(Ye,null)})):null,h?e("div",{class:`${s}-page-header__avatar`},h()):null,w?e("div",{class:`${s}-page-header__title`,key:"title"},c||o()):null,M?e("div",{class:`${s}-page-header__subtitle`,key:"subtitle"},a||t()):null),L?e("div",{class:`${s}-page-header__extra`},i||l()):null),g?e("div",{class:`${s}-page-header-content`,key:"content"},g()):null,v?e("div",{class:`${s}-page-header-footer`,key:"footer"},v()):null)}});var fo=A("logout","IconLogout",[["path",{d:"M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2",key:"svg-0"}],["path",{d:"M9 12h12l-3 -3",key:"svg-1"}],["path",{d:"M18 15l3 -3",key:"svg-2"}]]),ho=A("moon","IconMoon",[["path",{d:"M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z",key:"svg-0"}]]),vo=A("sun","IconSun",[["path",{d:"M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0",key:"svg-0"}],["path",{d:"M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7",key:"svg-1"}]]);const Yo=pe({setup:(n,{slots:r})=>{const c=_("Language");be({ar:{settings:"الإعدادات",toggleTheme:"تغيير الوضع",edit:"تعديل",routeAdmin:"لوحة التحكم",allRightsReserved:"جميع الحقوق محفوظة",logout:"تسجيل الخروج",profile:"تعديل الحساب",session:"سجل الدخول",user:"مستخدم",admin:"مدير",translation:"ترجمة",asset:"ملف",tables:"الجداول"},en:{routeAdmin:"Admin Panel"}});const a=xe(),i=N("user"),s=_("Theme"),d=N("database",()=>({slug:"inicontent",icon:"/favicon.ico"})),u=N("ThemeConfig");return()=>e("div",e(lo,{keepAliveOnHover:!0,closable:!0,containerStyle:{top:"70px"}},()=>e(Ee,{position:"absolute"},()=>[e(Ae,{style:"max-height: 65px",xScrollable:!0,trigger:"none"},()=>e(oo,{style:"height: 64px; padding: 15px 24px",bordered:!0},()=>e(go,{},{avatar:()=>{var o;return(o=a.name)!=null&&o.startsWith("database")?e(E,{onClick:()=>O(`/${d.value.slug}`),strong:!0,round:!0,bordered:!1,style:{cursor:"pointer",fontWeight:600,...u.value.revert?s.value==="light"?{}:{color:"#000",backgroundColor:"#fff"}:s.value==="dark"?{}:{color:"#fff",backgroundColor:"#000"}}},{default:()=>x(d.value.slug),avatar:()=>{var t;return e(F,{fallbackSrc:"/favicon.ico",style:{backgroundColor:"transparent"},src:((t=d.value)==null?void 0:t.icon)??"/favicon.ico"})}}):e(E,{strong:!0,round:!0,bordered:!1},{default:()=>x(d.value.slug),avatar:()=>e(F,{fallbackSrc:"/favicon.ico",src:d.value.icon??"/favicon.ico"})})},title:()=>["index","auth","dashboard","database","database-auth"].includes(a.name)?null:e(Ve,{},()=>a.path.split("/").filter(Boolean).filter((o,t)=>{var l;return!((l=a.name)!=null&&l.startsWith("database"))||t!==0}).map((o,t)=>{var l;return e(We,{href:a.path.split("/").slice(0,t+((l=a.name)!=null&&l.startsWith("database")?3:2)).join("/"),onClick:g=>{var f;g.preventDefault(),O(a.path.split("/").slice(0,t+((f=a.name)!=null&&f.startsWith("database")?3:2)).join("/"))}},()=>ye(o)&&N("itemLabel").value?N("itemLabel").value:x(o==="admin"?"routeAdmin":o))})),extra:()=>e(Ue,()=>{var o,t,l,g,f,h;return[...(o=i.value)!=null&&o.id?[((t=i.value)==null?void 0:t.role)==="d7b3d61a582e53ee29b5a1d02a436d55"?e(Je,{},{trigger:()=>e(P,{round:!0,size:"small"},()=>ke(d.value.size)),default:()=>x("totalDatabaseSize")}):null,e(V,{options:[{key:"header",type:"render",render:()=>e(Qe,{justify:"center",style:{padding:"5px 0"}},()=>e(Xe,{strong:!0},()=>i.value.username.charAt(0).toUpperCase()+i.value.username.slice(1)))},{key:"header-divider",type:"divider"},{label:x("profile"),key:"edit",icon:()=>e(I,()=>e(De)),show:(f=(g=(l=d.value.tables)==null?void 0:l.find(({slug:v})=>v==="user"))==null?void 0:g.allowedMethods)==null?void 0:f.includes("u")},{label:x("logout"),key:"logout",icon:()=>e(I,()=>e(fo))}],onSelect:async v=>{switch(v){case"edit":O(`/${d.value.slug}/admin/tables/user/${i.value.id}/edit`);break;case"logout":await $fetch(`${Ce().public.apiBase}${d.value.slug??"inicontent"}/auth/signout`,{}),i.value=null,await O(d.value.slug?`/${d.value.slug}/auth`:"/auth");break}}},()=>e(P,{size:"small",round:!0},{icon:()=>e(I,()=>e(Ke))})),((h=i.value)==null?void 0:h.role)==="d7b3d61a582e53ee29b5a1d02a436d55"?e(W,{},{trigger:()=>e(P,{size:"small",round:!0,tag:"a",href:`/${d.value.slug}/admin/settings`,onClick:v=>{v.preventDefault(),O(`/${d.value.slug}/admin/settings`)}},{icon:()=>e(I,()=>e(qe))}),default:()=>x("databaseSettings")}):null]:[],e(W,{},{trigger:()=>e(P,{size:"small",round:!0,onClick:()=>{s.value=s.value==="dark"?"light":"dark"}},{icon:()=>e(I,()=>s.value==="light"?e(ho):e(vo))}),default:()=>x("toggleTheme")}),e(V,{value:c.value,options:[{label:"Arabic",key:"ar"},{label:"English",key:"en"}],onSelect:v=>{c.value=v}},()=>e(P,{size:"small",round:!0},{icon:()=>e(I,()=>e(Ge)),default:()=>null}))]})}))),e(Fe,{id:"container",position:"absolute",style:{top:"64px",height:"calc(~'100vh - 98px')"},nativeScrollbar:!1,contentStyle:{display:"flex",justifyContent:"center",alignItems:"center",padding:"24px",height:"max-content"}},()=>r.default?r.default():null)])))}},"$BNtaBIt5wd");export{Yo as default};
