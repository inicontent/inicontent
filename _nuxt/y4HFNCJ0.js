import{i as _,t as s,b as H,d as W,af as j,a9 as J,l as O,ag as Y,j as Z,aq as ee,e as x,f as R,ah as te,B as U,O as ae,N as oe,C as L,S as w,E as $,F as a,H as e,D as v,G as o,a6 as re,ar as k,L as D,ak as se,a3 as E,M as P,a4 as ne,U as N,V as I,a5 as q,X as G,I as ie,R as le,as as de}from"./GicmGKj6.js";import{_ as ue}from"./4CpeiMrI.js";import{I as ce}from"./DLuVzI69.js";import{c as F,N as B}from"./CJaYANHJ.js";import{I as me}from"./DNVS1uzg.js";import{I as pe}from"./CPfOucDi.js";import{I as ge}from"./D2-yUcPF.js";import{m as he}from"./DgTO8Wst.js";import{N as fe}from"./BwYgWCwO.js";import{p as ve,l as be,N as ke,a as ye}from"./DadywKOU.js";import{p as Se}from"./D0azn37i.js";import{u as Ce}from"./B5x2ntQ_.js";import{N as ze,a as we}from"./GbvTZksO.js";import{N as K}from"./mcMpMs27.js";import{N as Q}from"./iM2ADUk5.js";import{B as M}from"./DkfZ8b2U.js";import{S as $e}from"./DQYWAPtD.js";import{N as Ne}from"./CB-kBD1A.js";import{N as Ie}from"./YFHa8HVa.js";import{N as A}from"./Dc83o4Gi.js";import{N as X}from"./BYR9PTF6.js";import"./Dhmybkx6.js";import"./DiPEGMYL.js";import"./CxLKhYDU.js";import"./D3rU6aJi.js";import"./CU2JJRiU.js";import"./CqAcozWi.js";import"./DTu6_oKm.js";import"./5fSvgue4.js";import"./rTfk-_yH.js";import"./BmVtr0Bc.js";import"./BWGTpkaN.js";import"./DSbqC9gd.js";import"./Bk_rJcZu.js";import"./DGISIIJO.js";import"./D2-lr3qT.js";import"./Cak3IB75.js";import"./DSW-2Z0k.js";import"./Cv8iCZhm.js";import"./BZk9bI-9.js";import"./CN0KqL9F.js";import"./BLWkGjX4.js";import"./OxUSaDC3.js";import"./CdrcvSxE.js";import"./AS_Xn609.js";import"./CM8LO42l.js";import"./5CsqxX9Y.js";import"./CyjfunXy.js";import"./KdGHD0sL.js";import"./CENcvkU_.js";import"./C4J8sofl.js";const Be=_({name:"ArrowBack",render(){return s("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},s("path",{d:"M0 0h24v24H0V0z",fill:"none"}),s("path",{d:"M19 11H7.83l4.88-4.88c.39-.39.39-1.03 0-1.42-.39-.39-1.02-.39-1.41 0l-6.59 6.59c-.39.39-.39 1.02 0 1.41l6.59 6.59c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L7.83 13H19c.55 0 1-.45 1-1s-.45-1-1-1z"}))}}),Te=H("layout-header",`
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 box-sizing: border-box;
 width: 100%;
 background-color: var(--n-color);
 color: var(--n-text-color);
`,[W("absolute-positioned",`
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 `),W("bordered",`
 border-bottom: solid 1px var(--n-border-color);
 `)]),xe={position:ve,inverted:Boolean,bordered:{type:Boolean,default:!1}},Re=_({name:"LayoutHeader",props:Object.assign(Object.assign({},j.props),xe),setup(i){const{mergedClsPrefixRef:c,inlineThemeDisabled:m}=J(i),f=j("Layout","-layout-header",Te,be,i,c),l=O(()=>{const{common:{cubicBezierEaseInOut:b},self:u}=f.value,g={"--n-bezier":b};return i.inverted?(g["--n-color"]=u.headerColorInverted,g["--n-text-color"]=u.textColorInverted,g["--n-border-color"]=u.headerBorderColorInverted):(g["--n-color"]=u.headerColor,g["--n-text-color"]=u.textColor,g["--n-border-color"]=u.headerBorderColor),g}),r=m?Y("layout-header",O(()=>i.inverted?"a":"b"),l,i):void 0;return{mergedClsPrefix:c,cssVars:m?void 0:l,themeClass:r==null?void 0:r.themeClass,onRender:r==null?void 0:r.onRender}},render(){var i;const{mergedClsPrefix:c}=this;return(i=this.onRender)===null||i===void 0||i.call(this),s("div",{class:[`${c}-layout-header`,this.themeClass,this.position&&`${c}-layout-header--${this.position}-positioned`,this.bordered&&`${c}-layout-header--bordered`],style:this.cssVars},this.$slots)}});function Le(){const i=Z(he,null);return i===null&&ee("use-message","No outer <n-message-provider /> founded. See prerequisite in https://www.naiveui.com/en-US/os-theme/components/message for more details. If you want to use `useMessage` outside setup, please check https://www.naiveui.com/zh-CN/os-theme/components/message#Q-&-A."),i}const Pe=x([H("page-header-header",`
 margin-bottom: 20px;
 `),H("page-header",`
 display: flex;
 align-items: center;
 justify-content: space-between;
 line-height: 1.5;
 font-size: var(--n-font-size);
 `,[R("main",`
 display: flex;
 flex-wrap: nowrap;
 align-items: center;
 `),R("back",`
 display: flex;
 margin-right: 16px;
 font-size: var(--n-back-size);
 cursor: pointer;
 color: var(--n-back-color);
 transition: color .3s var(--n-bezier);
 `,[x("&:hover","color: var(--n-back-color-hover);"),x("&:active","color: var(--n-back-color-pressed);")]),R("avatar",`
 display: flex;
 margin-right: 12px
 `),R("title",`
 margin-right: 16px;
 transition: color .3s var(--n-bezier);
 font-size: var(--n-title-font-size);
 font-weight: var(--n-title-font-weight);
 color: var(--n-title-text-color);
 `),R("subtitle",`
 font-size: 14px;
 transition: color .3s var(--n-bezier);
 color: var(--n-subtitle-text-color);
 `)]),H("page-header-content",`
 font-size: var(--n-font-size);
 `,[x("&:not(:first-child)","margin-top: 20px;")]),H("page-header-footer",`
 font-size: var(--n-font-size);
 `,[x("&:not(:first-child)","margin-top: 20px;")])]),Me=Object.assign(Object.assign({},j.props),{title:String,subtitle:String,extra:String,onBack:Function}),He=_({name:"PageHeader",props:Me,setup(i){const{mergedClsPrefixRef:c,mergedRtlRef:m,inlineThemeDisabled:f}=J(i),l=j("PageHeader","-page-header",Pe,Se,i,c),r=Ce("PageHeader",m,c),b=O(()=>{const{self:{titleTextColor:g,subtitleTextColor:y,backColor:S,fontSize:C,titleFontSize:z,backSize:t,titleFontWeight:h,backColorHover:n,backColorPressed:p},common:{cubicBezierEaseInOut:d}}=l.value;return{"--n-title-text-color":g,"--n-title-font-size":z,"--n-title-font-weight":h,"--n-font-size":C,"--n-back-size":t,"--n-subtitle-text-color":y,"--n-back-color":S,"--n-back-color-hover":n,"--n-back-color-pressed":p,"--n-bezier":d}}),u=f?Y("page-header",void 0,b,i):void 0;return{rtlEnabled:r,mergedClsPrefix:c,cssVars:f?void 0:b,themeClass:u==null?void 0:u.themeClass,onRender:u==null?void 0:u.onRender}},render(){var i;const{onBack:c,title:m,subtitle:f,extra:l,mergedClsPrefix:r,cssVars:b,$slots:u}=this;(i=this.onRender)===null||i===void 0||i.call(this);const{title:g,subtitle:y,extra:S,default:C,header:z,avatar:t,footer:h,back:n}=u,p=c,d=m||g,V=f||y,T=l||S;return s("div",{style:b,class:[`${r}-page-header-wrapper`,this.themeClass,this.rtlEnabled&&`${r}-page-header-wrapper--rtl`]},z?s("div",{class:`${r}-page-header-header`,key:"breadcrumb"},z()):null,(p||t||d||V||T)&&s("div",{class:`${r}-page-header`,key:"header"},s("div",{class:`${r}-page-header__main`,key:"back"},p?s("div",{class:`${r}-page-header__back`,onClick:c},n?n():s(te,{clsPrefix:r},{default:()=>s(Be,null)})):null,t?s("div",{class:`${r}-page-header__avatar`},t()):null,d?s("div",{class:`${r}-page-header__title`,key:"title"},m||g()):null,V?s("div",{class:`${r}-page-header__subtitle`,key:"subtitle"},f||y()):null),T?s("div",{class:`${r}-page-header__extra`},l||S()):null),C?s("div",{class:`${r}-page-header-content`,key:"content"},C()):null,h?s("div",{class:`${r}-page-header-footer`,key:"footer"},h()):null)}});/**
 * @license @tabler/icons-vue v3.14.0 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */var Ve=F("outline","logout","IconLogout",[["path",{d:"M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2",key:"svg-0"}],["path",{d:"M9 12h12l-3 -3",key:"svg-1"}],["path",{d:"M18 15l3 -3",key:"svg-2"}]]);/**
 * @license @tabler/icons-vue v3.14.0 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */var je=F("outline","moon","IconMoon",[["path",{d:"M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z",key:"svg-0"}]]);/**
 * @license @tabler/icons-vue v3.14.0 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */var _e=F("outline","sun","IconSun",[["path",{d:"M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0",key:"svg-0"}],["path",{d:"M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7",key:"svg-1"}]]);const Vt=_({__name:"default",setup(i){var y,S,C,z;const c=U("Language",{sameSite:!0});ae({ar:{settings:"الإعدادات",toggleTheme:"تغيير الوضع",edit:"تعديل",routeAdmin:"لوحة التحكم",allRightsReserved:"جميع الحقوق محفوظة",logout:"تسجيل الخروج",profile:"تعديل الحساب",session:"سجل الدخول",user:"مستخدم",admin:"مدير",translation:"ترجمة",asset:"ملف",tables:"الجداول",totalDatabaseSize:"حجم قاعدة البيانات",databaseSettings:"إعدادات قاعدة البيانات",isRequired:"إجباري",isNotValid:"غير صالح"},en:{routeAdmin:"Admin Panel"}}),oe(()=>{window.$message=Le()});const m=L("user"),f=U("Theme",{sameSite:!0}),l=L("database",()=>({slug:"inicontent",icon:"/favicon.ico"})),r=L("ThemeConfig"),b=[{key:"header",type:"render",render:()=>s(Ne,{justify:"center",style:{padding:"5px 0"}},()=>s(fe,{strong:!0},()=>{var t;return(t=m.value)!=null&&t.username?m.value.username.charAt(0).toUpperCase()+m.value.username.slice(1):"--"}))},{key:"header-divider",type:"divider"},{label:w("profile"),key:"edit",icon:()=>s(B,()=>s(me)),show:(z=(C=(S=(y=l.value)==null?void 0:y.tables)==null?void 0:S.find(({slug:t})=>t==="user"))==null?void 0:C.allowedMethods)==null?void 0:z.includes("u")},{label:w("logout"),key:"logout",icon:()=>s(B,()=>s(Ve))}];async function u(t){switch(t){case"edit":P(`/${l.value.slug}/admin/tables/user/${m.value.id}/edit`);break;case"logout":await $fetch(`${le().public.apiBase}${l.value.slug??"inicontent"}/auth/signout`,{}),m.value=null,await P(l.value.slug?`/${l.value.slug}/auth`:"/auth");break}}const g=[{label:"عربي",key:"ar"},{label:"English",key:"en"}];return(t,h)=>(v(),$(e(ye),{position:"absolute"},{default:a(()=>[o(e($e),{style:{"max-height":"65px"},xScrollable:"",trigger:"none"},{default:a(()=>[o(e(Re),{style:{height:"64px",padding:"15px 24px"},bordered:""},{default:a(()=>[o(e(He),null,re({avatar:a(()=>[String((t._.provides[k]||t.$route).matched[0].name).startsWith("database")?(v(),$(e(K),{key:0,onClick:h[0]||(h[0]=n=>{var p;return("navigateTo"in t?t.navigateTo:e(P))(`/${(p=e(l))==null?void 0:p.slug}`)}),strong:"",round:"",bordered:!1,style:ne({cursor:"pointer",fontWeight:600,...e(r).revert&&e(f)==="dark"?{color:"#000",backgroundColor:"#fff"}:{}})},{avatar:a(()=>{var n;return[o(e(Q),{fallbackSrc:"/favicon.ico",style:{backgroundColor:"transparent"},src:((n=e(l))==null?void 0:n.icon)??"/favicon.ico"},null,8,["src"])]}),default:a(()=>{var n;return[N(" "+I(("t"in t?t.t:e(w))((n=e(l))==null?void 0:n.slug)),1)]}),_:1},8,["style"])):(v(),$(e(K),{key:1,strong:"",round:"",bordered:!1},{avatar:a(()=>{var n;return[o(e(Q),{fallbackSrc:"/favicon.ico",src:((n=e(l))==null?void 0:n.icon)??"/favicon.ico"},null,8,["src"])]}),_:1}))]),extra:a(()=>[o(e(Ie),null,{default:a(()=>{var n,p;return[(n=e(m))!=null&&n.id?(v(),D(E,{key:0},[((p=e(m))==null?void 0:p.role)==="d7b3d61a582e53ee29b5a1d02a436d55"?(v(),D(E,{key:0},[o(e(A),{delay:500},{trigger:a(()=>[o(e(M),{round:"",size:"small"},{default:a(()=>{var d;return[N(I(("humanFileSize"in t?t.humanFileSize:e(ue))((d=e(l))==null?void 0:d.size)),1)]}),_:1})]),default:a(()=>[N(" "+I(("t"in t?t.t:e(w))("totalDatabaseSize")),1)]),_:1}),o(e(A),{delay:500},{trigger:a(()=>{var d;return[o(e(M),{round:"",size:"small",tag:"a",href:`/${(d=e(l))==null?void 0:d.slug}/admin/settings`,onClick:h[1]||(h[1]=q(V=>{var T;return("navigateTo"in t?t.navigateTo:e(P))(`/${(T=e(l))==null?void 0:T.slug}/admin/settings`)},["stop","prevent"]))},{icon:a(()=>[o(e(B),null,{default:a(()=>[o(e(pe))]),_:1})]),_:1},8,["href"])]}),default:a(()=>[N(" "+I(("t"in t?t.t:e(w))("databaseSettings")),1)]),_:1})],64)):G("",!0),o(e(X),{options:b,onSelect:u},{default:a(()=>[o(e(M),{round:"",size:"small"},{icon:a(()=>[o(e(B),null,{default:a(()=>[o(e(ge))]),_:1})]),_:1})]),_:1})],64)):G("",!0),o(e(A),{delay:500},{trigger:a(()=>[o(e(M),{round:"",size:"small",onClick:h[2]||(h[2]=d=>f.value=e(f)==="dark"?"light":"dark")},{icon:a(()=>[o(e(B),null,{default:a(()=>[e(f)==="light"?(v(),$(e(je),{key:0})):(v(),$(e(_e),{key:1}))]),_:1})]),_:1})]),default:a(()=>[N(" "+I(("t"in t?t.t:e(w))("toggleTheme")),1)]),_:1}),o(e(X),{value:e(c),options:g,onSelect:h[3]||(h[3]=d=>c.value=d)},{default:a(()=>[o(e(M),{round:"",size:"small"},{icon:a(()=>[o(e(B),null,{default:a(()=>[o(e(ce))]),_:1})]),_:1})]),_:1},8,["value"])]}),_:1})]),_:2},[["index","auth","dashboard","database","database-auth"].includes(String((t._.provides[k]||t.$route).matched[0].name))?void 0:{name:"title",fn:a(()=>[o(e(ze),null,{default:a(()=>[(v(!0),D(E,null,se((t._.provides[k]||t.$route).path.split("/").filter(Boolean).filter((n,p)=>{var d;return!((d=String((t._.provides[k]||t.$route).matched[0].name))!=null&&d.startsWith("database"))||p!==0}),(n,p)=>{var d;return v(),$(e(we),{href:(t._.provides[k]||t.$route).path.split("/").slice(0,p+((d=String((t._.provides[k]||t.$route).matched[0].name))!=null&&d.startsWith("database")?3:2)).join("/"),onClick:q(V=>("navigateTo"in t?t.navigateTo:e(P))((t._.provides[k]||t.$route).path.split("/").slice(0,p+(String((t._.provides[k]||t.$route).matched[0].name).startsWith("database")?3:2)).join("/")),["stop","prevent"])},{default:a(()=>[N(I(e(de)(n)&&("useState"in t?t.useState:e(L))("itemLabel").value?("useState"in t?t.useState:e(L))("itemLabel").value:("t"in t?t.t:e(w))(n==="admin"?"routeAdmin":n)),1)]),_:2},1032,["href","onClick"])}),256))]),_:1})]),key:"0"}]),1024)]),_:1})]),_:1}),o(e(ke),{id:"container",position:"absolute",style:{top:"64px",height:"calc(~'100vh - 98px')"},nativeScrollbar:!1,contentStyle:{display:"flex",justifyContent:"center",alignItems:"center",padding:"24px 0",height:"max-content"}},{default:a(()=>[ie(t.$slots,"default")]),_:3})]),_:3}))}});export{Vt as default};
