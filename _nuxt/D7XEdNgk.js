import{d as ne,a as te,b as ie,N as se,u as re,c as ae}from"./BkLCtUlv.js";import{k as le,h as A}from"./D3rU6aJi.js";import{i as h,A as C,t as d,q as y,a3 as I,am as P,e as b,b as k,f as x,d as v,a9 as L,j as ce,af as S,l as O,aK as p,ag as de,ah as ue,bA as fe,bB as me,ai as pe,bC as ge,N as ve,bm as he,D as be,E as ye,F as j,G as Ce,H as w,I as ke}from"./GicmGKj6.js";import{a as xe,d as Oe,b as je}from"./BNCc5LRc.js";import{o as M}from"./DbnPTcif.js";import{a as z,m as we}from"./DgTO8Wst.js";import{c as Ae,N as Ie,a as Pe}from"./DkfZ8b2U.js";import{f as Le}from"./DrswmiSO.js";import{u as Se}from"./B5x2ntQ_.js";import{m as Me}from"./D8p76WLc.js";import{r as ze}from"./CdrcvSxE.js";import{N as Ee}from"./DTu6_oKm.js";import{N as Ne}from"./CU2JJRiU.js";import"./HiGXOwLp.js";import"./WLse00F4.js";import"./DEL4UD8g.js";import"./CuWLMRRA.js";import"./Dhmybkx6.js";import"./DSbqC9gd.js";import"./BFpz-MMR.js";import"./5CsqxX9Y.js";import"./DsSU6HIH.js";import"./BWGTpkaN.js";import"./Cc9ptzOy.js";import"./OxUSaDC3.js";import"./CN0KqL9F.js";import"./CENcvkU_.js";import"./rtVrmwDn.js";import"./BvPXLEP8.js";import"./Dm8x80dr.js";import"./Bm6oDwS_.js";import"./CZG5aAdZ.js";import"./DScDWwfB.js";import"./BmVtr0Bc.js";import"./CqAcozWi.js";import"./J5afffT2.js";import"./scFboGVs.js";import"./CUGZGxCD.js";import"./C0nknaRS.js";import"./gp2mUz2I.js";import"./CweOwRMt.js";import"./C5Gs3ner.js";import"./COE3bXWg.js";import"./BdlvUn0a.js";import"./CY0c4WHv.js";import"./DECuUKtu.js";import"./DFEbRwvg.js";import"./DaJ2elvc.js";import"./5fSvgue4.js";import"./DGISIIJO.js";import"./h0mJDxlK.js";import"./CGXr1awn.js";import"./Di5MGdNS.js";import"./CrnXoPrW.js";import"./D0azn37i.js";import"./0w004ZTh.js";import"./BrNR9eNA.js";import"./v98MHJKh.js";import"./CtIASumb.js";import"./CIaL31g3.js";import"./CxLKhYDU.js";import"./D2-lr3qT.js";import"./BtrpEMm5.js";const Re=Object.assign(Object.assign({},ne),{onAfterEnter:Function,onAfterLeave:Function,transformOrigin:String,blockScroll:{type:Boolean,default:!0},closeOnEsc:{type:Boolean,default:!0},onEsc:Function,autoFocus:{type:Boolean,default:!0},internalStyle:[String,Object],maskClosable:{type:Boolean,default:!0},onPositiveClick:Function,onNegativeClick:Function,onClose:Function,onMaskClick:Function}),Fe=h({name:"DialogEnvironment",props:Object.assign(Object.assign({},Re),{internalKey:{type:String,required:!0},to:[String,Object],onInternalAfterLeave:{type:Function,required:!0}}),setup(n){const t=C(!0);function r(){const{onInternalAfterLeave:o,internalKey:c,onAfterLeave:m}=n;o&&o(c),m&&m()}function s(o){const{onPositiveClick:c}=n;c?Promise.resolve(c(o)).then(m=>{m!==!1&&e()}):e()}function a(o){const{onNegativeClick:c}=n;c?Promise.resolve(c(o)).then(m=>{m!==!1&&e()}):e()}function u(){const{onClose:o}=n;o?Promise.resolve(o()).then(c=>{c!==!1&&e()}):e()}function f(o){const{onMaskClick:c,maskClosable:m}=n;c&&(c(o),m&&e())}function l(){const{onEsc:o}=n;o&&o()}function e(){t.value=!1}function i(o){t.value=o}return{show:t,hide:e,handleUpdateShow:i,handleAfterLeave:r,handleCloseClick:u,handleNegativeClick:a,handlePositiveClick:s,handleMaskClick:f,handleEsc:l}},render(){const{handlePositiveClick:n,handleUpdateShow:t,handleNegativeClick:r,handleCloseClick:s,handleAfterLeave:a,handleMaskClick:u,handleEsc:f,to:l,maskClosable:e,show:i}=this;return d(se,{show:i,onUpdateShow:t,onMaskClick:u,onEsc:f,to:l,maskClosable:e,onAfterEnter:this.onAfterEnter,onAfterLeave:a,closeOnEsc:this.closeOnEsc,blockScroll:this.blockScroll,autoFocus:this.autoFocus,transformOrigin:this.transformOrigin,internalAppear:!0,internalDialog:!0},{default:()=>d(te,Object.assign({},le(this.$props,ie),{style:this.internalStyle,onClose:s,onNegativeClick:r,onPositiveClick:n}))})}}),_e={injectionKey:String,to:[String,Object]},$e=h({name:"DialogProvider",props:_e,setup(){const n=C([]),t={};function r(l={}){const e=A(),i=P(Object.assign(Object.assign({},l),{key:e,destroy:()=>{var o;(o=t[`n-dialog-${e}`])===null||o===void 0||o.hide()}}));return n.value.push(i),i}const s=["info","success","warning","error"].map(l=>e=>r(Object.assign(Object.assign({},e),{type:l})));function a(l){const{value:e}=n;e.splice(e.findIndex(i=>i.key===l),1)}function u(){Object.values(t).forEach(l=>{l==null||l.hide()})}const f={create:r,destroyAll:u,info:s[0],success:s[1],warning:s[2],error:s[3]};return y(xe,f),y(Oe,{clickedRef:re(64),clickedPositionRef:ae()}),y(je,n),Object.assign(Object.assign({},f),{dialogList:n,dialogInstRefs:t,handleAfterLeave:a})},render(){var n,t;return d(I,null,[this.dialogList.map(r=>d(Fe,M(r,["destroy","style"],{internalStyle:r.style,to:this.to,ref:s=>{s===null?delete this.dialogInstRefs[`n-dialog-${r.key}`]:this.dialogInstRefs[`n-dialog-${r.key}`]=s},internalKey:r.key,onInternalAfterLeave:this.handleAfterLeave}))),(t=(n=this.$slots).default)===null||t===void 0?void 0:t.call(n)])}}),E={icon:Function,type:{type:String,default:"info"},content:[String,Number,Function],showIcon:{type:Boolean,default:!0},closable:Boolean,keepAliveOnHover:Boolean,onClose:Function,onMouseenter:Function,onMouseleave:Function},He=b([k("message-wrapper",`
 margin: var(--n-margin);
 z-index: 0;
 transform-origin: top center;
 display: flex;
 `,[Le({overflow:"visible",originalTransition:"transform .3s var(--n-bezier)",enterToProps:{transform:"scale(1)"},leaveToProps:{transform:"scale(0.85)"}})]),k("message",`
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
 `,[["default","info","success","warning","error","loading"].map(n=>v(`${n}-type`,[b("> *",`
 color: var(--n-icon-color-${n});
 transition: color .3s var(--n-bezier);
 `)])),b("> *",`
 position: absolute;
 left: 0;
 top: 0;
 right: 0;
 bottom: 0;
 `,[Ae()])]),x("close",`
 margin: var(--n-close-margin);
 transition:
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 flex-shrink: 0;
 `,[b("&:hover",`
 color: var(--n-close-icon-color-hover);
 `),b("&:active",`
 color: var(--n-close-icon-color-pressed);
 `)])]),k("message-container",`
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
 `)])]),Be={info:()=>d(fe,null),success:()=>d(me,null),warning:()=>d(pe,null),error:()=>d(ge,null),default:()=>null},Te=h({name:"Message",props:Object.assign(Object.assign({},E),{render:Function}),setup(n){const{inlineThemeDisabled:t,mergedRtlRef:r}=L(n),{props:s,mergedClsPrefixRef:a}=ce(z),u=Se("Message",r,a),f=S("Message","-message",He,Me,s,a),l=O(()=>{const{type:i}=n,{common:{cubicBezierEaseInOut:o},self:{padding:c,margin:m,maxWidth:g,iconMargin:N,closeMargin:R,closeSize:F,iconSize:_,fontSize:$,lineHeight:H,borderRadius:B,iconColorInfo:T,iconColorSuccess:K,iconColorWarning:D,iconColorError:V,iconColorLoading:W,closeIconSize:q,closeBorderRadius:U,[p("textColor",i)]:G,[p("boxShadow",i)]:J,[p("color",i)]:Q,[p("closeColorHover",i)]:X,[p("closeColorPressed",i)]:Y,[p("closeIconColor",i)]:Z,[p("closeIconColorPressed",i)]:ee,[p("closeIconColorHover",i)]:oe}}=f.value;return{"--n-bezier":o,"--n-margin":m,"--n-padding":c,"--n-max-width":g,"--n-font-size":$,"--n-icon-margin":N,"--n-icon-size":_,"--n-close-icon-size":q,"--n-close-border-radius":U,"--n-close-size":F,"--n-close-margin":R,"--n-text-color":G,"--n-color":Q,"--n-box-shadow":J,"--n-icon-color-info":T,"--n-icon-color-success":K,"--n-icon-color-warning":D,"--n-icon-color-error":V,"--n-icon-color-loading":W,"--n-close-color-hover":X,"--n-close-color-pressed":Y,"--n-close-icon-color":Z,"--n-close-icon-color-pressed":ee,"--n-close-icon-color-hover":oe,"--n-line-height":H,"--n-border-radius":B}}),e=t?de("message",O(()=>n.type[0]),l,{}):void 0;return{mergedClsPrefix:a,rtlEnabled:u,messageProviderProps:s,handleClose(){var i;(i=n.onClose)===null||i===void 0||i.call(n)},cssVars:t?void 0:l,themeClass:e==null?void 0:e.themeClass,onRender:e==null?void 0:e.onRender,placement:s.placement}},render(){const{render:n,type:t,closable:r,content:s,mergedClsPrefix:a,cssVars:u,themeClass:f,onRender:l,icon:e,handleClose:i,showIcon:o}=this;l==null||l();let c;return d("div",{class:[`${a}-message-wrapper`,f],onMouseenter:this.onMouseenter,onMouseleave:this.onMouseleave,style:[{alignItems:this.placement.startsWith("top")?"flex-start":"flex-end"},u]},n?n(this.$props):d("div",{class:[`${a}-message ${a}-message--${t}-type`,this.rtlEnabled&&`${a}-message--rtl`]},(c=Ke(e,t,a))&&o?d("div",{class:`${a}-message__icon ${a}-message__icon--${t}-type`},d(Ie,null,{default:()=>c})):null,d("div",{class:`${a}-message__content`},ze(s)),r?d(Ee,{clsPrefix:a,class:`${a}-message__close`,onClick:i,absolute:!0}):null))}});function Ke(n,t,r){if(typeof n=="function")return n();{const s=t==="loading"?d(Pe,{clsPrefix:r,strokeWidth:24,scale:.85}):Be[t]();return s?d(ue,{clsPrefix:r,key:t},{default:()=>s}):null}}const De=h({name:"MessageEnvironment",props:Object.assign(Object.assign({},E),{duration:{type:Number,default:3e3},onAfterLeave:Function,onLeave:Function,internalKey:{type:String,required:!0},onInternalAfterLeave:Function,onHide:Function,onAfterHide:Function}),setup(n){let t=null;const r=C(!0);ve(()=>{s()});function s(){const{duration:o}=n;o&&(t=window.setTimeout(f,o))}function a(o){o.currentTarget===o.target&&t!==null&&(window.clearTimeout(t),t=null)}function u(o){o.currentTarget===o.target&&s()}function f(){const{onHide:o}=n;r.value=!1,t&&(window.clearTimeout(t),t=null),o&&o()}function l(){const{onClose:o}=n;o&&o(),f()}function e(){const{onAfterLeave:o,onInternalAfterLeave:c,onAfterHide:m,internalKey:g}=n;o&&o(),c&&c(g),m&&m()}function i(){f()}return{show:r,hide:f,handleClose:l,handleAfterLeave:e,handleMouseleave:u,handleMouseenter:a,deactivate:i}},render(){return d(Ne,{appear:!0,onAfterLeave:this.handleAfterLeave,onLeave:this.onLeave},{default:()=>[this.show?d(Te,{content:this.content,type:this.type,icon:this.icon,showIcon:this.showIcon,closable:this.closable,onClose:this.handleClose,onMouseenter:this.keepAliveOnHover?this.handleMouseenter:void 0,onMouseleave:this.keepAliveOnHover?this.handleMouseleave:void 0}):null]})}}),Ve=Object.assign(Object.assign({},S.props),{to:[String,Object],duration:{type:Number,default:3e3},keepAliveOnHover:Boolean,max:Number,placement:{type:String,default:"top"},closable:Boolean,containerClass:String,containerStyle:[String,Object]}),We=h({name:"MessageProvider",props:Ve,setup(n){const{mergedClsPrefixRef:t}=L(n),r=C([]),s=C({}),a={create(e,i){return u(e,Object.assign({type:"default"},i))},info(e,i){return u(e,Object.assign(Object.assign({},i),{type:"info"}))},success(e,i){return u(e,Object.assign(Object.assign({},i),{type:"success"}))},warning(e,i){return u(e,Object.assign(Object.assign({},i),{type:"warning"}))},error(e,i){return u(e,Object.assign(Object.assign({},i),{type:"error"}))},loading(e,i){return u(e,Object.assign(Object.assign({},i),{type:"loading"}))},destroyAll:l};y(z,{props:n,mergedClsPrefixRef:t}),y(we,a);function u(e,i){const o=A(),c=P(Object.assign(Object.assign({},i),{content:e,key:o,destroy:()=>{var g;(g=s.value[o])===null||g===void 0||g.hide()}})),{max:m}=n;return m&&r.value.length>=m&&r.value.shift(),r.value.push(c),c}function f(e){r.value.splice(r.value.findIndex(i=>i.key===e),1),delete s.value[e]}function l(){Object.values(s.value).forEach(e=>{e.hide()})}return Object.assign({mergedClsPrefix:t,messageRefs:s,messageList:r,handleAfterLeave:f},a)},render(){var n,t,r;return d(I,null,(t=(n=this.$slots).default)===null||t===void 0?void 0:t.call(n),this.messageList.length?d(he,{to:(r=this.to)!==null&&r!==void 0?r:"body"},d("div",{class:[`${this.mergedClsPrefix}-message-container`,`${this.mergedClsPrefix}-message-container--${this.placement}`,this.containerClass],key:"message-container",style:this.containerStyle},this.messageList.map(s=>d(De,Object.assign({ref:a=>{a&&(this.messageRefs[s.key]=a)},internalKey:s.key,onInternalAfterLeave:this.handleAfterLeave},M(s,["destroy"],void 0),{duration:s.duration===void 0?this.duration:s.duration,keepAliveOnHover:s.keepAliveOnHover===void 0?this.keepAliveOnHover:s.keepAliveOnHover,closable:s.closable===void 0?this.closable:s.closable}))))):null)}}),nn=h({__name:"preLayout",setup(n){return(t,r)=>(be(),ye(w(We),{keepAliveOnHover:"",closable:"",containerStyle:{top:"70px"}},{default:j(()=>[Ce(w($e),null,{default:j(()=>[ke(t.$slots,"default")]),_:3})]),_:3}))}});export{nn as default};
