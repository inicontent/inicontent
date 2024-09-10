import{u as _}from"./vxBaO5E-.js";import{i as S,t as s,b as f,d as x,f as l,e as z,h as H,a9 as T,A as V,l as N,af as k,q as W,ag as q,ad as O,ac as F,at as K,au as Z,j as G,aD as J,am as Q}from"./CFZop9RU.js";import{f as X}from"./Coe_IYCU.js";import{u as Y}from"./D2GkMi_I.js";import{c as ee}from"./DH-p-xuy.js";import{c as P,f as A,h as re}from"./Cjrk4TDS.js";import{u as ae}from"./CXaRlF3j.js";import{N as te}from"./C3M1WvbL.js";import{c as oe}from"./BJKaMiZy.js";import{u as le}from"./COm9J_20.js";import{h as D}from"./CM8LO42l.js";import{C as se}from"./Dvm4odUK.js";const ie=S({name:"ChevronLeft",render(){return s("svg",{viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg"},s("path",{d:"M10.3536 3.14645C10.5488 3.34171 10.5488 3.65829 10.3536 3.85355L6.20711 8L10.3536 12.1464C10.5488 12.3417 10.5488 12.6583 10.3536 12.8536C10.1583 13.0488 9.84171 13.0488 9.64645 12.8536L5.14645 8.35355C4.95118 8.15829 4.95118 7.84171 5.14645 7.64645L9.64645 3.14645C9.84171 2.95118 10.1583 2.95118 10.3536 3.14645Z",fill:"currentColor"}))}}),ne=f("collapse","width: 100%;",[f("collapse-item",`
 font-size: var(--n-font-size);
 color: var(--n-text-color);
 transition:
 color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 margin: var(--n-item-margin);
 `,[x("disabled",[l("header","cursor: not-allowed;",[l("header-main",`
 color: var(--n-title-text-color-disabled);
 `),f("collapse-item-arrow",`
 color: var(--n-arrow-color-disabled);
 `)])]),f("collapse-item","margin-left: 32px;"),z("&:first-child","margin-top: 0;"),z("&:first-child >",[l("header","padding-top: 0;")]),x("left-arrow-placement",[l("header",[f("collapse-item-arrow","margin-right: 4px;")])]),x("right-arrow-placement",[l("header",[f("collapse-item-arrow","margin-left: 4px;")])]),l("content-wrapper",[l("content-inner","padding-top: 16px;"),X({duration:"0.15s"})]),x("active",[l("header",[x("active",[f("collapse-item-arrow","transform: rotate(90deg);")])])]),z("&:not(:first-child)","border-top: 1px solid var(--n-divider-color);"),H("disabled",[x("trigger-area-main",[l("header",[l("header-main","cursor: pointer;"),f("collapse-item-arrow","cursor: default;")])]),x("trigger-area-arrow",[l("header",[f("collapse-item-arrow","cursor: pointer;")])]),x("trigger-area-extra",[l("header",[l("header-extra","cursor: pointer;")])])]),l("header",`
 font-size: var(--n-title-font-size);
 display: flex;
 flex-wrap: nowrap;
 align-items: center;
 transition: color .3s var(--n-bezier);
 position: relative;
 padding: var(--n-title-padding);
 color: var(--n-title-text-color);
 `,[l("header-main",`
 display: flex;
 flex-wrap: nowrap;
 align-items: center;
 font-weight: var(--n-title-font-weight);
 transition: color .3s var(--n-bezier);
 flex: 1;
 color: var(--n-title-text-color);
 `),l("header-extra",`
 display: flex;
 align-items: center;
 transition: color .3s var(--n-bezier);
 color: var(--n-text-color);
 `),f("collapse-item-arrow",`
 display: flex;
 transition:
 transform .15s var(--n-bezier),
 color .3s var(--n-bezier);
 font-size: 18px;
 color: var(--n-arrow-color);
 `)])])]),de=Object.assign(Object.assign({},k.props),{defaultExpandedNames:{type:[Array,String],default:null},expandedNames:[Array,String],arrowPlacement:{type:String,default:"left"},accordion:{type:Boolean,default:!1},displayDirective:{type:String,default:"if"},triggerAreas:{type:Array,default:()=>["main","extra","arrow"]},onItemHeaderClick:[Function,Array],"onUpdate:expandedNames":[Function,Array],onUpdateExpandedNames:[Function,Array],onExpandedNamesChange:{type:[Function,Array],validator:()=>!0,default:void 0}}),B=O("n-collapse"),Re=S({name:"Collapse",props:de,setup(e,{slots:n}){const{mergedClsPrefixRef:i,inlineThemeDisabled:o,mergedRtlRef:d}=T(e),a=V(e.defaultExpandedNames),h=N(()=>e.expandedNames),v=Y(h,a),w=k("Collapse","-collapse",ne,ee,e,i);function c(p){const{"onUpdate:expandedNames":t,onUpdateExpandedNames:m,onExpandedNamesChange:b}=e;m&&P(m,p),t&&P(t,p),b&&P(b,p),a.value=p}function g(p){const{onItemHeaderClick:t}=e;t&&P(t,p)}function r(p,t,m){const{accordion:b}=e,{value:E}=v;if(b)p?(c([t]),g({name:t,expanded:!0,event:m})):(c([]),g({name:t,expanded:!1,event:m}));else if(!Array.isArray(E))c([t]),g({name:t,expanded:!0,event:m});else{const C=E.slice(),I=C.findIndex($=>t===$);~I?(C.splice(I,1),c(C),g({name:t,expanded:!1,event:m})):(C.push(t),c(C),g({name:t,expanded:!0,event:m}))}}W(B,{props:e,mergedClsPrefixRef:i,expandedNamesRef:v,slots:n,toggleItem:r});const u=_("Collapse",d,i),R=N(()=>{const{common:{cubicBezierEaseInOut:p},self:{titleFontWeight:t,dividerColor:m,titlePadding:b,titleTextColor:E,titleTextColorDisabled:C,textColor:I,arrowColor:$,fontSize:L,titleFontSize:U,arrowColorDisabled:j,itemMargin:M}}=w.value;return{"--n-font-size":L,"--n-bezier":p,"--n-text-color":I,"--n-divider-color":m,"--n-title-padding":b,"--n-title-font-size":U,"--n-title-text-color":E,"--n-title-text-color-disabled":C,"--n-title-font-weight":t,"--n-arrow-color":$,"--n-arrow-color-disabled":j,"--n-item-margin":M}}),y=o?q("collapse",void 0,R,e):void 0;return{rtlEnabled:u,mergedTheme:w,mergedClsPrefix:i,cssVars:o?void 0:R,themeClass:y==null?void 0:y.themeClass,onRender:y==null?void 0:y.onRender}},render(){var e;return(e=this.onRender)===null||e===void 0||e.call(this),s("div",{class:[`${this.mergedClsPrefix}-collapse`,this.rtlEnabled&&`${this.mergedClsPrefix}-collapse--rtl`,this.themeClass],style:this.cssVars},this.$slots)}}),ce=S({name:"CollapseItemContent",props:{displayDirective:{type:String,required:!0},show:Boolean,clsPrefix:{type:String,required:!0}},setup(e){return{onceTrue:ae(F(e,"show"))}},render(){return s(te,null,{default:()=>{const{show:e,displayDirective:n,onceTrue:i,clsPrefix:o}=this,d=n==="show"&&i,a=s("div",{class:`${o}-collapse-item__content-wrapper`},s("div",{class:`${o}-collapse-item__content-inner`},this.$slots));return d?K(a,[[Z,e]]):e?a:null}})}}),pe={title:String,name:[String,Number],disabled:Boolean,displayDirective:String},Ee=S({name:"CollapseItem",props:pe,setup(e){const{mergedRtlRef:n}=T(e),i=oe(),o=le(()=>{var r;return(r=e.name)!==null&&r!==void 0?r:i}),d=G(B);d||J("collapse-item","`n-collapse-item` must be placed inside `n-collapse`.");const{expandedNamesRef:a,props:h,mergedClsPrefixRef:v,slots:w}=d,c=N(()=>{const{value:r}=a;if(Array.isArray(r)){const{value:u}=o;return!~r.findIndex(R=>R===u)}else if(r){const{value:u}=o;return u!==r}return!0});return{rtlEnabled:_("Collapse",n,v),collapseSlots:w,randomName:i,mergedClsPrefix:v,collapsed:c,triggerAreas:F(h,"triggerAreas"),mergedDisplayDirective:N(()=>{const{displayDirective:r}=e;return r||h.displayDirective}),arrowPlacement:N(()=>h.arrowPlacement),handleClick(r){let u="main";D(r,"arrow")&&(u="arrow"),D(r,"extra")&&(u="extra"),h.triggerAreas.includes(u)&&d&&!e.disabled&&d.toggleItem(c.value,o.value,r)}}},render(){const{collapseSlots:e,$slots:n,arrowPlacement:i,collapsed:o,mergedDisplayDirective:d,mergedClsPrefix:a,disabled:h,triggerAreas:v}=this,w=A(n.header,{collapsed:o},()=>[this.title]),c=n["header-extra"]||e["header-extra"],g=n.arrow||e.arrow;return s("div",{class:[`${a}-collapse-item`,`${a}-collapse-item--${i}-arrow-placement`,h&&`${a}-collapse-item--disabled`,!o&&`${a}-collapse-item--active`,v.map(r=>`${a}-collapse-item--trigger-area-${r}`)]},s("div",{class:[`${a}-collapse-item__header`,!o&&`${a}-collapse-item__header--active`]},s("div",{class:`${a}-collapse-item__header-main`,onClick:this.handleClick},i==="right"&&w,s("div",{class:`${a}-collapse-item-arrow`,key:this.rtlEnabled?0:1,"data-arrow":!0},A(g,{collapsed:o},()=>{var r;return[s(Q,{clsPrefix:a},{default:(r=e.expandIcon)!==null&&r!==void 0?r:()=>this.rtlEnabled?s(ie,null):s(se,null)})]})),i==="left"&&w),re(c,{collapsed:o},r=>s("div",{class:`${a}-collapse-item__header-extra`,onClick:this.handleClick,"data-extra":!0},r))),s(ce,{clsPrefix:a,displayDirective:d,show:!o},n))}});export{Re as N,Ee as a};
