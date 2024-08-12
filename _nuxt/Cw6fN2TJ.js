import{f as M,s,bW as O,c2 as S,bY as A,bX as D,A as F,bV as z,c4 as N,aA as Ce,dD as ze,cc as I,r as q,i as we,a$ as X,V as Se,F as V,b2 as Ie,dE as $e,ch as Y,j as Ne,k as Oe,g as B,q as $,D as R,w as f,C as e,o as w,b as h,ad as je,c as W,b6 as Pe,H as J,n as _,d as P,t as T,dF as Te,G as Q,E as Z,b7 as Me,m as Le}from"./xEahERNa.js";import{h as Re}from"./TGN3J7SD.js";import{N as He}from"./GrlvwfD7.js";import{I as Ae}from"./df44F1AV.js";import{j as Be,c as U,N as H}from"./FpMhCtPb.js";import{S as _e}from"./BvjQIwAq.js";import{p as Ee,c as Fe,a as Ve,N as De}from"./BeN9aP7I.js";import{u as G,b as ne,N as ae}from"./B9qM5nxZ.js";import{N as We,a as Ke}from"./JBLvtuu5.js";import{N as ee}from"./DcXrDdYc.js";import{N as oe}from"./CJVROegc.js";import{c as qe,N as Ue,a as Ge,B as E}from"./BQS0c8i1.js";import{I as Xe}from"./CcFnkCG7.js";import{I as Ye}from"./sDYkZG_S.js";import{I as Je}from"./6rV-Jya7.js";import{a as re,m as Qe}from"./_vJGojCt.js";import{f as Ze}from"./CNt5qD_t.js";import{r as eo}from"./Bf3K2dna.js";import{N as oo}from"./8NFwruSL.js";import{I as to,S as no,E as ao}from"./ru0alAZN.js";import{W as ro}from"./CNTHke99.js";import{N as so}from"./B0QP0tT1.js";import{o as io}from"./DbnPTcif.js";import{N as lo}from"./D4bigNHj.js";import{N as co}from"./CnAYvyen.js";import{N as K}from"./Ba_0JW1y.js";import{N as te}from"./CbBuwt4R.js";import"./CuQvGAkU.js";import"./lAzok8v0.js";import"./Bk_rJcZu.js";import"./BOQF9-FD.js";import"./Bp_N7X0e.js";import"./CM8LO42l.js";import"./suxEwWrN.js";import"./DXruQSCb.js";const uo=M({name:"ArrowBack",render(){return s("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},s("path",{d:"M0 0h24v24H0V0z",fill:"none"}),s("path",{d:"M19 11H7.83l4.88-4.88c.39-.39.39-1.03 0-1.42-.39-.39-1.02-.39-1.41 0l-6.59 6.59c-.39.39-.39 1.02 0 1.41l6.59 6.59c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L7.83 13H19c.55 0 1-.45 1-1s-.45-1-1-1z"}))}}),fo=O("layout-header",`
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 box-sizing: border-box;
 width: 100%;
 background-color: var(--n-color);
 color: var(--n-text-color);
`,[S("absolute-positioned",`
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 `),S("bordered",`
 border-bottom: solid 1px var(--n-border-color);
 `)]),go={position:Ee,inverted:Boolean,bordered:{type:Boolean,default:!1}},mo=M({name:"LayoutHeader",props:Object.assign(Object.assign({},A.props),go),setup(t){const{mergedClsPrefixRef:a,inlineThemeDisabled:c}=D(t),r=A("Layout","-layout-header",fo,Fe,t,a),d=F(()=>{const{common:{cubicBezierEaseInOut:p},self:g}=r.value,n={"--n-bezier":p};return t.inverted?(n["--n-color"]=g.headerColorInverted,n["--n-text-color"]=g.textColorInverted,n["--n-border-color"]=g.headerBorderColorInverted):(n["--n-color"]=g.headerColor,n["--n-text-color"]=g.textColor,n["--n-border-color"]=g.headerBorderColor),n}),o=c?G("layout-header",F(()=>t.inverted?"a":"b"),d,t):void 0;return{mergedClsPrefix:a,cssVars:c?void 0:d,themeClass:o==null?void 0:o.themeClass,onRender:o==null?void 0:o.onRender}},render(){var t;const{mergedClsPrefix:a}=this;return(t=this.onRender)===null||t===void 0||t.call(this),s("div",{class:[`${a}-layout-header`,this.themeClass,this.position&&`${a}-layout-header--${this.position}-positioned`,this.bordered&&`${a}-layout-header--bordered`],style:this.cssVars},this.$slots)}}),se={icon:Function,type:{type:String,default:"info"},content:[String,Number,Function],showIcon:{type:Boolean,default:!0},closable:Boolean,keepAliveOnHover:Boolean,onClose:Function,onMouseenter:Function,onMouseleave:Function},ho=z([O("message-wrapper",`
 margin: var(--n-margin);
 z-index: 0;
 transform-origin: top center;
 display: flex;
 `,[Ze({overflow:"visible",originalTransition:"transform .3s var(--n-bezier)",enterToProps:{transform:"scale(1)"},leaveToProps:{transform:"scale(0.85)"}})]),O("message",`
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
 `,[N("content",`
 display: inline-block;
 line-height: var(--n-line-height);
 font-size: var(--n-font-size);
 `),N("icon",`
 position: relative;
 margin: var(--n-icon-margin);
 height: var(--n-icon-size);
 width: var(--n-icon-size);
 font-size: var(--n-icon-size);
 flex-shrink: 0;
 `,[["default","info","success","warning","error","loading"].map(t=>S(`${t}-type`,[z("> *",`
 color: var(--n-icon-color-${t});
 transition: color .3s var(--n-bezier);
 `)])),z("> *",`
 position: absolute;
 left: 0;
 top: 0;
 right: 0;
 bottom: 0;
 `,[qe()])]),N("close",`
 margin: var(--n-close-margin);
 transition:
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 flex-shrink: 0;
 `,[z("&:hover",`
 color: var(--n-close-icon-color-hover);
 `),z("&:active",`
 color: var(--n-close-icon-color-pressed);
 `)])]),O("message-container",`
 z-index: 6000;
 position: fixed;
 height: 0;
 overflow: visible;
 display: flex;
 flex-direction: column;
 align-items: center;
 `,[S("top",`
 top: 12px;
 left: 0;
 right: 0;
 `),S("top-left",`
 top: 12px;
 left: 12px;
 right: 0;
 align-items: flex-start;
 `),S("top-right",`
 top: 12px;
 left: 0;
 right: 12px;
 align-items: flex-end;
 `),S("bottom",`
 bottom: 4px;
 left: 0;
 right: 0;
 justify-content: flex-end;
 `),S("bottom-left",`
 bottom: 4px;
 left: 12px;
 right: 0;
 justify-content: flex-end;
 align-items: flex-start;
 `),S("bottom-right",`
 bottom: 4px;
 left: 0;
 right: 12px;
 justify-content: flex-end;
 align-items: flex-end;
 `)])]),vo={info:()=>s(to,null),success:()=>s(no,null),warning:()=>s(ro,null),error:()=>s(ao,null),default:()=>null},po=M({name:"Message",props:Object.assign(Object.assign({},se),{render:Function}),setup(t){const{inlineThemeDisabled:a,mergedRtlRef:c}=D(t),{props:r,mergedClsPrefixRef:d}=Ce(re),o=ne("Message",c,d),p=A("Message","-message",ho,ze,r,d),g=F(()=>{const{type:i}=t,{common:{cubicBezierEaseInOut:u},self:{padding:b,margin:k,maxWidth:x,iconMargin:l,closeMargin:C,closeSize:y,iconSize:m,fontSize:v,lineHeight:L,borderRadius:j,iconColorInfo:ie,iconColorSuccess:le,iconColorWarning:ce,iconColorError:de,iconColorLoading:ue,closeIconSize:fe,closeBorderRadius:ge,[I("textColor",i)]:me,[I("boxShadow",i)]:he,[I("color",i)]:ve,[I("closeColorHover",i)]:pe,[I("closeColorPressed",i)]:be,[I("closeIconColor",i)]:ye,[I("closeIconColorPressed",i)]:xe,[I("closeIconColorHover",i)]:ke}}=p.value;return{"--n-bezier":u,"--n-margin":k,"--n-padding":b,"--n-max-width":x,"--n-font-size":v,"--n-icon-margin":l,"--n-icon-size":m,"--n-close-icon-size":fe,"--n-close-border-radius":ge,"--n-close-size":y,"--n-close-margin":C,"--n-text-color":me,"--n-color":ve,"--n-box-shadow":he,"--n-icon-color-info":ie,"--n-icon-color-success":le,"--n-icon-color-warning":ce,"--n-icon-color-error":de,"--n-icon-color-loading":ue,"--n-close-color-hover":pe,"--n-close-color-pressed":be,"--n-close-icon-color":ye,"--n-close-icon-color-pressed":xe,"--n-close-icon-color-hover":ke,"--n-line-height":L,"--n-border-radius":j}}),n=a?G("message",F(()=>t.type[0]),g,{}):void 0;return{mergedClsPrefix:d,rtlEnabled:o,messageProviderProps:r,handleClose(){var i;(i=t.onClose)===null||i===void 0||i.call(t)},cssVars:a?void 0:g,themeClass:n==null?void 0:n.themeClass,onRender:n==null?void 0:n.onRender,placement:r.placement}},render(){const{render:t,type:a,closable:c,content:r,mergedClsPrefix:d,cssVars:o,themeClass:p,onRender:g,icon:n,handleClose:i,showIcon:u}=this;g==null||g();let b;return s("div",{class:[`${d}-message-wrapper`,p],onMouseenter:this.onMouseenter,onMouseleave:this.onMouseleave,style:[{alignItems:this.placement.startsWith("top")?"flex-start":"flex-end"},o]},t?t(this.$props):s("div",{class:[`${d}-message ${d}-message--${a}-type`,this.rtlEnabled&&`${d}-message--rtl`]},(b=bo(n,a,d))&&u?s("div",{class:`${d}-message__icon ${d}-message__icon--${a}-type`},s(Ue,null,{default:()=>b})):null,s("div",{class:`${d}-message__content`},eo(r)),c?s(oo,{clsPrefix:d,class:`${d}-message__close`,onClick:i,absolute:!0}):null))}});function bo(t,a,c){if(typeof t=="function")return t();{const r=a==="loading"?s(Ge,{clsPrefix:c,strokeWidth:24,scale:.85}):vo[a]();return r?s(ae,{clsPrefix:c,key:a},{default:()=>r}):null}}const yo=M({name:"MessageEnvironment",props:Object.assign(Object.assign({},se),{duration:{type:Number,default:3e3},onAfterLeave:Function,onLeave:Function,internalKey:{type:String,required:!0},onInternalAfterLeave:Function,onHide:Function,onAfterHide:Function}),setup(t){let a=null;const c=q(!0);we(()=>{r()});function r(){const{duration:u}=t;u&&(a=window.setTimeout(p,u))}function d(u){u.currentTarget===u.target&&a!==null&&(window.clearTimeout(a),a=null)}function o(u){u.currentTarget===u.target&&r()}function p(){const{onHide:u}=t;c.value=!1,a&&(window.clearTimeout(a),a=null),u&&u()}function g(){const{onClose:u}=t;u&&u(),p()}function n(){const{onAfterLeave:u,onInternalAfterLeave:b,onAfterHide:k,internalKey:x}=t;u&&u(),b&&b(x),k&&k()}function i(){p()}return{show:c,hide:p,handleClose:g,handleAfterLeave:n,handleMouseleave:o,handleMouseenter:d,deactivate:i}},render(){return s(so,{appear:!0,onAfterLeave:this.handleAfterLeave,onLeave:this.onLeave},{default:()=>[this.show?s(po,{content:this.content,type:this.type,icon:this.icon,showIcon:this.showIcon,closable:this.closable,onClose:this.handleClose,onMouseenter:this.keepAliveOnHover?this.handleMouseenter:void 0,onMouseleave:this.keepAliveOnHover?this.handleMouseleave:void 0}):null]})}}),xo=Object.assign(Object.assign({},A.props),{to:[String,Object],duration:{type:Number,default:3e3},keepAliveOnHover:Boolean,max:Number,placement:{type:String,default:"top"},closable:Boolean,containerClass:String,containerStyle:[String,Object]}),ko=M({name:"MessageProvider",props:xo,setup(t){const{mergedClsPrefixRef:a}=D(t),c=q([]),r=q({}),d={create(n,i){return o(n,Object.assign({type:"default"},i))},info(n,i){return o(n,Object.assign(Object.assign({},i),{type:"info"}))},success(n,i){return o(n,Object.assign(Object.assign({},i),{type:"success"}))},warning(n,i){return o(n,Object.assign(Object.assign({},i),{type:"warning"}))},error(n,i){return o(n,Object.assign(Object.assign({},i),{type:"error"}))},loading(n,i){return o(n,Object.assign(Object.assign({},i),{type:"loading"}))},destroyAll:g};X(re,{props:t,mergedClsPrefixRef:a}),X(Qe,d);function o(n,i){const u=Be(),b=Ie(Object.assign(Object.assign({},i),{content:n,key:u,destroy:()=>{var x;(x=r.value[u])===null||x===void 0||x.hide()}})),{max:k}=t;return k&&c.value.length>=k&&c.value.shift(),c.value.push(b),b}function p(n){c.value.splice(c.value.findIndex(i=>i.key===n),1),delete r.value[n]}function g(){Object.values(r.value).forEach(n=>{n.hide()})}return Object.assign({mergedClsPrefix:a,messageRefs:r,messageList:c,handleAfterLeave:p},d)},render(){var t,a,c;return s(V,null,(a=(t=this.$slots).default)===null||a===void 0?void 0:a.call(t),this.messageList.length?s(Se,{to:(c=this.to)!==null&&c!==void 0?c:"body"},s("div",{class:[`${this.mergedClsPrefix}-message-container`,`${this.mergedClsPrefix}-message-container--${this.placement}`,this.containerClass],key:"message-container",style:this.containerStyle},this.messageList.map(r=>s(yo,Object.assign({ref:d=>{d&&(this.messageRefs[r.key]=d)},internalKey:r.key,onInternalAfterLeave:this.handleAfterLeave},io(r,["destroy"],void 0),{duration:r.duration===void 0?this.duration:r.duration,keepAliveOnHover:r.keepAliveOnHover===void 0?this.keepAliveOnHover:r.keepAliveOnHover,closable:r.closable===void 0?this.closable:r.closable}))))):null)}}),Co=z([O("page-header-header",`
 margin-bottom: 20px;
 `),O("page-header",`
 display: flex;
 align-items: center;
 justify-content: space-between;
 line-height: 1.5;
 font-size: var(--n-font-size);
 `,[N("main",`
 display: flex;
 flex-wrap: nowrap;
 align-items: center;
 `),N("back",`
 display: flex;
 margin-right: 16px;
 font-size: var(--n-back-size);
 cursor: pointer;
 color: var(--n-back-color);
 transition: color .3s var(--n-bezier);
 `,[z("&:hover","color: var(--n-back-color-hover);"),z("&:active","color: var(--n-back-color-pressed);")]),N("avatar",`
 display: flex;
 margin-right: 12px
 `),N("title",`
 margin-right: 16px;
 transition: color .3s var(--n-bezier);
 font-size: var(--n-title-font-size);
 font-weight: var(--n-title-font-weight);
 color: var(--n-title-text-color);
 `),N("subtitle",`
 font-size: 14px;
 transition: color .3s var(--n-bezier);
 color: var(--n-subtitle-text-color);
 `)]),O("page-header-content",`
 font-size: var(--n-font-size);
 `,[z("&:not(:first-child)","margin-top: 20px;")]),O("page-header-footer",`
 font-size: var(--n-font-size);
 `,[z("&:not(:first-child)","margin-top: 20px;")])]),zo=Object.assign(Object.assign({},A.props),{title:String,subtitle:String,extra:String,onBack:Function}),wo=M({name:"PageHeader",props:zo,setup(t){const{mergedClsPrefixRef:a,mergedRtlRef:c,inlineThemeDisabled:r}=D(t),d=A("PageHeader","-page-header",Co,$e,t,a),o=ne("PageHeader",c,a),p=F(()=>{const{self:{titleTextColor:n,subtitleTextColor:i,backColor:u,fontSize:b,titleFontSize:k,backSize:x,titleFontWeight:l,backColorHover:C,backColorPressed:y},common:{cubicBezierEaseInOut:m}}=d.value;return{"--n-title-text-color":n,"--n-title-font-size":k,"--n-title-font-weight":l,"--n-font-size":b,"--n-back-size":x,"--n-subtitle-text-color":i,"--n-back-color":u,"--n-back-color-hover":C,"--n-back-color-pressed":y,"--n-bezier":m}}),g=r?G("page-header",void 0,p,t):void 0;return{rtlEnabled:o,mergedClsPrefix:a,cssVars:r?void 0:p,themeClass:g==null?void 0:g.themeClass,onRender:g==null?void 0:g.onRender}},render(){var t;const{onBack:a,title:c,subtitle:r,extra:d,mergedClsPrefix:o,cssVars:p,$slots:g}=this;(t=this.onRender)===null||t===void 0||t.call(this);const{title:n,subtitle:i,extra:u,default:b,header:k,avatar:x,footer:l,back:C}=g,y=a,m=c||n,v=r||i,L=d||u;return s("div",{style:p,class:[`${o}-page-header-wrapper`,this.themeClass,this.rtlEnabled&&`${o}-page-header-wrapper--rtl`]},k?s("div",{class:`${o}-page-header-header`,key:"breadcrumb"},k()):null,(y||x||m||v||L)&&s("div",{class:`${o}-page-header`,key:"header"},s("div",{class:`${o}-page-header__main`,key:"back"},y?s("div",{class:`${o}-page-header__back`,onClick:a},C?C():s(ae,{clsPrefix:o},{default:()=>s(uo,null)})):null,x?s("div",{class:`${o}-page-header__avatar`},x()):null,m?s("div",{class:`${o}-page-header__title`,key:"title"},c||n()):null,v?s("div",{class:`${o}-page-header__subtitle`,key:"subtitle"},r||i()):null),L?s("div",{class:`${o}-page-header__extra`},d||u()):null),b?s("div",{class:`${o}-page-header-content`,key:"content"},b()):null,l?s("div",{class:`${o}-page-header-footer`,key:"footer"},l()):null)}});var So=U("logout","IconLogout",[["path",{d:"M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2",key:"svg-0"}],["path",{d:"M9 12h12l-3 -3",key:"svg-1"}],["path",{d:"M18 15l3 -3",key:"svg-2"}]]),Io=U("moon","IconMoon",[["path",{d:"M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z",key:"svg-0"}]]),$o=U("sun","IconSun",[["path",{d:"M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0",key:"svg-0"}],["path",{d:"M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7",key:"svg-1"}]]);const ct=M({__name:"default",setup(t){var u,b,k,x;const a=Y("Language",{sameSite:!0});Ne({ar:{settings:"الإعدادات",toggleTheme:"تغيير الوضع",edit:"تعديل",routeAdmin:"لوحة التحكم",allRightsReserved:"جميع الحقوق محفوظة",logout:"تسجيل الخروج",profile:"تعديل الحساب",session:"سجل الدخول",user:"مستخدم",admin:"مدير",translation:"ترجمة",asset:"ملف",tables:"الجداول",totalDatabaseSize:"حجم قاعدة البيانات",databaseSettings:"إعدادات قاعدة البيانات",isRequired:"إجباري",isNotValid:"غير صالح"},en:{routeAdmin:"Admin Panel"}});const c=Oe(),r=B("user"),d=Y("Theme",{sameSite:!0}),o=B("database",()=>({slug:"inicontent",icon:"/favicon.ico"})),p=B("ThemeConfig"),g=[{key:"header",type:"render",render:()=>s(lo,{justify:"center",style:{padding:"5px 0"}},()=>s(He,{strong:!0},()=>{var l;return(l=r.value)!=null&&l.username?r.value.username.charAt(0).toUpperCase()+r.value.username.slice(1):"--"}))},{key:"header-divider",type:"divider"},{label:$("profile"),key:"edit",icon:()=>s(H,()=>s(Ae)),show:(x=(k=(b=(u=o.value)==null?void 0:u.tables)==null?void 0:b.find(({slug:l})=>l==="user"))==null?void 0:k.allowedMethods)==null?void 0:x.includes("u")},{label:$("logout"),key:"logout",icon:()=>s(H,()=>s(So))}];async function n(l){switch(l){case"edit":_(`/${o.value.slug}/admin/tables/user/${r.value.id}/edit`);break;case"logout":await $fetch(`${Le().public.apiBase}${o.value.slug??"inicontent"}/auth/signout`,{}),r.value=null,await _(o.value.slug?`/${o.value.slug}/auth`:"/auth");break}}const i=[{label:"عربي",key:"ar"},{label:"English",key:"en"}];return(l,C)=>(w(),R(e(ko),{keepAliveOnHover:"",closable:"",containerStyle:{top:"70px"}},{default:f(()=>[h(e(De),{position:"absolute"},{default:f(()=>[h(e(_e),{style:{"max-height":"65px"},xScrollable:"",trigger:"none"},{default:f(()=>[h(e(mo),{style:{height:"64px",padding:"15px 24px"},bordered:""},{default:f(()=>[h(e(wo),null,je({avatar:f(()=>{var y;return[(y=e(c).name)!=null&&y.startsWith("database")?(w(),R(e(ee),{key:0,onClick:C[0]||(C[0]=m=>{var v;return("navigateTo"in l?l.navigateTo:e(_))(`/${(v=e(o))==null?void 0:v.slug}`)}),strong:"",round:"",bordered:!1,style:Q({cursor:"pointer",fontWeight:600,...e(p).revert&&e(d)==="dark"?{color:"#000",backgroundColor:"#fff"}:{}})},{avatar:f(()=>{var m;return[h(e(oe),{fallbackSrc:"/favicon.ico",style:{backgroundColor:"transparent"},src:((m=e(o))==null?void 0:m.icon)??"/favicon.ico"},null,8,["src"])]}),default:f(()=>{var m;return[P(" "+T(("t"in l?l.t:e($))((m=e(o))==null?void 0:m.slug)),1)]}),_:1},8,["style"])):(w(),R(e(ee),{key:1,strong:"",round:"",bordered:!1},{avatar:f(()=>{var m;return[h(e(oe),{fallbackSrc:"/favicon.ico",src:((m=e(o))==null?void 0:m.icon)??"/favicon.ico"},null,8,["src"])]}),default:f(()=>{var m;return[P(" "+T(("t"in l?l.t:e($))((m=e(o))==null?void 0:m.slug)),1)]}),_:1}))]}),extra:f(()=>[h(e(co),null,{default:f(()=>{var y,m;return[(y=e(r))!=null&&y.id?(w(),W(V,{key:0},[((m=e(r))==null?void 0:m.role)==="d7b3d61a582e53ee29b5a1d02a436d55"?(w(),W(V,{key:0},[h(e(K),{delay:500},{trigger:f(()=>[h(e(E),{round:"",size:"small"},{default:f(()=>{var v;return[P(T(("humanFileSize"in l?l.humanFileSize:e(Re))((v=e(o))==null?void 0:v.size)),1)]}),_:1})]),default:f(()=>[P(" "+T(("t"in l?l.t:e($))("totalDatabaseSize")),1)]),_:1}),h(e(K),{delay:500},{trigger:f(()=>{var v;return[h(e(E),{round:"",size:"small",tag:"a",href:`/${(v=e(o))==null?void 0:v.slug}/admin/settings`,onClick:C[1]||(C[1]=J(L=>{var j;return("navigateTo"in l?l.navigateTo:e(_))(`/${(j=e(o))==null?void 0:j.slug}/admin/settings`)},["stop","prevent"]))},{icon:f(()=>[h(e(H),null,{default:f(()=>[h(e(Xe))]),_:1})]),_:1},8,["href"])]}),default:f(()=>[P(" "+T(("t"in l?l.t:e($))("databaseSettings")),1)]),_:1})],64)):Z("",!0),h(e(te),{options:g,onSelect:n},{default:f(()=>[h(e(E),{round:"",size:"small"},{icon:f(()=>[h(e(H),null,{default:f(()=>[h(e(Ye))]),_:1})]),_:1})]),_:1})],64)):Z("",!0),h(e(K),{delay:500},{trigger:f(()=>[h(e(E),{round:"",size:"small",onClick:C[2]||(C[2]=v=>d.value=e(d)==="dark"?"light":"dark")},{icon:f(()=>[h(e(H),null,{default:f(()=>[e(d)==="light"?(w(),R(e(Io),{key:0})):(w(),R(e($o),{key:1}))]),_:1})]),_:1})]),default:f(()=>[P(" "+T(("t"in l?l.t:e($))("toggleTheme")),1)]),_:1}),h(e(te),{value:e(a),options:i,onSelect:C[3]||(C[3]=v=>a.value=v)},{default:f(()=>[h(e(E),{round:"",size:"small"},{icon:f(()=>[h(e(H),null,{default:f(()=>[h(e(Je))]),_:1})]),_:1})]),_:1},8,["value"])]}),_:1})]),_:2},[["index","auth","dashboard","database","database-auth"].includes(e(c).name)?void 0:{name:"title",fn:f(()=>[h(e(We),null,{default:f(()=>[(w(!0),W(V,null,Pe(e(c).path.split("/").filter(Boolean).filter((y,m)=>{var v;return!((v=e(c).name)!=null&&v.startsWith("database"))||m!==0}),(y,m)=>{var v;return w(),R(e(Ke),{href:e(c).path.split("/").slice(0,m+((v=e(c).name)!=null&&v.startsWith("database")?3:2)).join("/"),onClick:J(L=>{var j;return("navigateTo"in l?l.navigateTo:e(_))(e(c).path.split("/").slice(0,m+((j=e(c).name)!=null&&j.startsWith("database")?3:2)).join("/"))},["stop","prevent"])},{default:f(()=>[P(T(e(Te)(y)&&("useState"in l?l.useState:e(B))("itemLabel").value?("useState"in l?l.useState:e(B))("itemLabel").value:("t"in l?l.t:e($))(y==="admin"?"routeAdmin":y)),1)]),_:2},1032,["href","onClick"])}),256))]),_:1})]),key:"0"}]),1024)]),_:1})]),_:1}),h(e(Ve),{id:"container",position:"absolute",style:Q({top:"64px",height:"calc(~'100vh - 98px')"}),nativeScrollbar:!1,contentStyle:{display:"flex",justifyContent:"center",alignItems:"center",padding:"24px",height:"max-content"}},{default:f(()=>[Me(l.$slots,"default")]),_:3},8,["style"])]),_:3})]),_:3}))}});export{ct as default};
