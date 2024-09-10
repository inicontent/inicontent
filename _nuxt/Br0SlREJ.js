import{a as O,m as Q}from"./D7ckqILq.js";import{e as h,b as x,f as y,d as v,i as b,a9 as j,j as X,af as z,l as w,al as f,ag as Y,t as l,am as Z,an as ee,ao as oe,ap as ne,aq as te,A as C,N as re,q as I,aU as ie,a3 as se,az as ae,D as le,E as ce,F as de,I as ue,H as me}from"./CFZop9RU.js";import{i as fe,N as pe,a as ge}from"./t5kcgBii.js";import{f as ve}from"./Coe_IYCU.js";import{u as he}from"./vxBaO5E-.js";import{m as be}from"./BTUgg3iv.js";import{r as xe}from"./DjWqVgbA.js";import{N as ye}from"./C3mGUiDb.js";import{N as Ce}from"./C3M1WvbL.js";import{o as we}from"./DbnPTcif.js";import{c as Ie}from"./BJKaMiZy.js";import"./B0mjHLO2.js";import"./CW__XYtq.js";import"./RUeo6_7w.js";import"./DUYvL-gI.js";import"./C5OcD23B.js";import"./CZwUL1-P.js";import"./BYNkR6eT.js";import"./DSBXb5Ob.js";import"./CMSvwZa9.js";import"./Cq4y_ZhK.js";import"./Bt3ZajGi.js";import"./CNM5l8Dd.js";import"./CbN045wD.js";import"./IlW3-8Qj.js";import"./VBmB2-mK.js";import"./BNYFF44l.js";import"./DPeZyjAX.js";import"./CloYSnuK.js";import"./DH-p-xuy.js";import"./C58JYw9Y.js";import"./ClF6JiFG.js";import"./Co80eD7z.js";import"./DnXtmkNH.js";import"./DgCxdCjL.js";import"./CAqy4rqJ.js";import"./Dlob315O.js";import"./DNKY0VL6.js";import"./C5Tt_c0f.js";import"./DMligQNt.js";import"./5fSvgue4.js";import"./DGISIIJO.js";import"./h0mJDxlK.js";import"./DvTAX7Cb.js";import"./Df1zhGS8.js";import"./0fsVMMB-.js";import"./D9I15Drj.js";import"./B3q5qsxB.js";import"./BOEW-apS.js";import"./gzGFVxr1.js";import"./CtIASumb.js";import"./DP7J1Wdj.js";import"./Cs7iC1eV.js";import"./COm9J_20.js";import"./DMGaTrfY.js";import"./BtrpEMm5.js";const M={icon:Function,type:{type:String,default:"info"},content:[String,Number,Function],showIcon:{type:Boolean,default:!0},closable:Boolean,keepAliveOnHover:Boolean,onClose:Function,onMouseenter:Function,onMouseleave:Function},Oe=h([x("message-wrapper",`
 margin: var(--n-margin);
 z-index: 0;
 transform-origin: top center;
 display: flex;
 `,[ve({overflow:"visible",originalTransition:"transform .3s var(--n-bezier)",enterToProps:{transform:"scale(1)"},leaveToProps:{transform:"scale(0.85)"}})]),x("message",`
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
 `,[["default","info","success","warning","error","loading"].map(n=>v(`${n}-type`,[h("> *",`
 color: var(--n-icon-color-${n});
 transition: color .3s var(--n-bezier);
 `)])),h("> *",`
 position: absolute;
 left: 0;
 top: 0;
 right: 0;
 bottom: 0;
 `,[fe()])]),y("close",`
 margin: var(--n-close-margin);
 transition:
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 flex-shrink: 0;
 `,[h("&:hover",`
 color: var(--n-close-icon-color-hover);
 `),h("&:active",`
 color: var(--n-close-icon-color-pressed);
 `)])]),x("message-container",`
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
 `)])]),je={info:()=>l(ee,null),success:()=>l(oe,null),warning:()=>l(ne,null),error:()=>l(te,null),default:()=>null},ze=b({name:"Message",props:Object.assign(Object.assign({},M),{render:Function}),setup(n){const{inlineThemeDisabled:t,mergedRtlRef:a}=j(n),{props:r,mergedClsPrefixRef:s}=X(O),c=he("Message",a,s),d=z("Message","-message",Oe,be,r,s),u=w(()=>{const{type:e}=n,{common:{cubicBezierEaseInOut:i},self:{padding:m,margin:p,maxWidth:g,iconMargin:k,closeMargin:A,closeSize:P,iconSize:H,fontSize:L,lineHeight:S,borderRadius:_,iconColorInfo:R,iconColorSuccess:$,iconColorWarning:N,iconColorError:T,iconColorLoading:F,closeIconSize:B,closeBorderRadius:E,[f("textColor",e)]:K,[f("boxShadow",e)]:W,[f("color",e)]:V,[f("closeColorHover",e)]:q,[f("closeColorPressed",e)]:D,[f("closeIconColor",e)]:U,[f("closeIconColorPressed",e)]:G,[f("closeIconColorHover",e)]:J}}=d.value;return{"--n-bezier":i,"--n-margin":p,"--n-padding":m,"--n-max-width":g,"--n-font-size":L,"--n-icon-margin":k,"--n-icon-size":H,"--n-close-icon-size":B,"--n-close-border-radius":E,"--n-close-size":P,"--n-close-margin":A,"--n-text-color":K,"--n-color":V,"--n-box-shadow":W,"--n-icon-color-info":R,"--n-icon-color-success":$,"--n-icon-color-warning":N,"--n-icon-color-error":T,"--n-icon-color-loading":F,"--n-close-color-hover":q,"--n-close-color-pressed":D,"--n-close-icon-color":U,"--n-close-icon-color-pressed":G,"--n-close-icon-color-hover":J,"--n-line-height":S,"--n-border-radius":_}}),o=t?Y("message",w(()=>n.type[0]),u,{}):void 0;return{mergedClsPrefix:s,rtlEnabled:c,messageProviderProps:r,handleClose(){var e;(e=n.onClose)===null||e===void 0||e.call(n)},cssVars:t?void 0:u,themeClass:o==null?void 0:o.themeClass,onRender:o==null?void 0:o.onRender,placement:r.placement}},render(){const{render:n,type:t,closable:a,content:r,mergedClsPrefix:s,cssVars:c,themeClass:d,onRender:u,icon:o,handleClose:e,showIcon:i}=this;u==null||u();let m;return l("div",{class:[`${s}-message-wrapper`,d],onMouseenter:this.onMouseenter,onMouseleave:this.onMouseleave,style:[{alignItems:this.placement.startsWith("top")?"flex-start":"flex-end"},c]},n?n(this.$props):l("div",{class:[`${s}-message ${s}-message--${t}-type`,this.rtlEnabled&&`${s}-message--rtl`]},(m=Me(o,t,s))&&i?l("div",{class:`${s}-message__icon ${s}-message__icon--${t}-type`},l(pe,null,{default:()=>m})):null,l("div",{class:`${s}-message__content`},xe(r)),a?l(ye,{clsPrefix:s,class:`${s}-message__close`,onClick:e,absolute:!0}):null))}});function Me(n,t,a){if(typeof n=="function")return n();{const r=t==="loading"?l(ge,{clsPrefix:a,strokeWidth:24,scale:.85}):je[t]();return r?l(Z,{clsPrefix:a,key:t},{default:()=>r}):null}}const ke=b({name:"MessageEnvironment",props:Object.assign(Object.assign({},M),{duration:{type:Number,default:3e3},onAfterLeave:Function,onLeave:Function,internalKey:{type:String,required:!0},onInternalAfterLeave:Function,onHide:Function,onAfterHide:Function}),setup(n){let t=null;const a=C(!0);re(()=>{r()});function r(){const{duration:i}=n;i&&(t=window.setTimeout(d,i))}function s(i){i.currentTarget===i.target&&t!==null&&(window.clearTimeout(t),t=null)}function c(i){i.currentTarget===i.target&&r()}function d(){const{onHide:i}=n;a.value=!1,t&&(window.clearTimeout(t),t=null),i&&i()}function u(){const{onClose:i}=n;i&&i(),d()}function o(){const{onAfterLeave:i,onInternalAfterLeave:m,onAfterHide:p,internalKey:g}=n;i&&i(),m&&m(g),p&&p()}function e(){d()}return{show:a,hide:d,handleClose:u,handleAfterLeave:o,handleMouseleave:c,handleMouseenter:s,deactivate:e}},render(){return l(Ce,{appear:!0,onAfterLeave:this.handleAfterLeave,onLeave:this.onLeave},{default:()=>[this.show?l(ze,{content:this.content,type:this.type,icon:this.icon,showIcon:this.showIcon,closable:this.closable,onClose:this.handleClose,onMouseenter:this.keepAliveOnHover?this.handleMouseenter:void 0,onMouseleave:this.keepAliveOnHover?this.handleMouseleave:void 0}):null]})}}),Ae=Object.assign(Object.assign({},z.props),{to:[String,Object],duration:{type:Number,default:3e3},keepAliveOnHover:Boolean,max:Number,placement:{type:String,default:"top"},closable:Boolean,containerClass:String,containerStyle:[String,Object]}),Pe=b({name:"MessageProvider",props:Ae,setup(n){const{mergedClsPrefixRef:t}=j(n),a=C([]),r=C({}),s={create(o,e){return c(o,Object.assign({type:"default"},e))},info(o,e){return c(o,Object.assign(Object.assign({},e),{type:"info"}))},success(o,e){return c(o,Object.assign(Object.assign({},e),{type:"success"}))},warning(o,e){return c(o,Object.assign(Object.assign({},e),{type:"warning"}))},error(o,e){return c(o,Object.assign(Object.assign({},e),{type:"error"}))},loading(o,e){return c(o,Object.assign(Object.assign({},e),{type:"loading"}))},destroyAll:u};I(O,{props:n,mergedClsPrefixRef:t}),I(Q,s);function c(o,e){const i=Ie(),m=ae(Object.assign(Object.assign({},e),{content:o,key:i,destroy:()=>{var g;(g=r.value[i])===null||g===void 0||g.hide()}})),{max:p}=n;return p&&a.value.length>=p&&a.value.shift(),a.value.push(m),m}function d(o){a.value.splice(a.value.findIndex(e=>e.key===o),1),delete r.value[o]}function u(){Object.values(r.value).forEach(o=>{o.hide()})}return Object.assign({mergedClsPrefix:t,messageRefs:r,messageList:a,handleAfterLeave:d},s)},render(){var n,t,a;return l(se,null,(t=(n=this.$slots).default)===null||t===void 0?void 0:t.call(n),this.messageList.length?l(ie,{to:(a=this.to)!==null&&a!==void 0?a:"body"},l("div",{class:[`${this.mergedClsPrefix}-message-container`,`${this.mergedClsPrefix}-message-container--${this.placement}`,this.containerClass],key:"message-container",style:this.containerStyle},this.messageList.map(r=>l(ke,Object.assign({ref:s=>{s&&(this.messageRefs[r.key]=s)},internalKey:r.key,onInternalAfterLeave:this.handleAfterLeave},we(r,["destroy"],void 0),{duration:r.duration===void 0?this.duration:r.duration,keepAliveOnHover:r.keepAliveOnHover===void 0?this.keepAliveOnHover:r.keepAliveOnHover,closable:r.closable===void 0?this.closable:r.closable}))))):null)}}),_o=b({__name:"preLayout",setup(n){return(t,a)=>(le(),ce(me(Pe),{keepAliveOnHover:"",closable:"",containerStyle:{top:"70px"}},{default:de(()=>[ue(t.$slots,"default")]),_:3}))}});export{_o as default};
