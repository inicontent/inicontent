import{b as _,u as H,c as P,l as A,m as O,N as V}from"./Bi-2ogms.js";import{ai as S,j as s,c1 as f,c9 as x,cb as l,c0 as z,ca as W,c2 as T,r as q,a7 as N,c3 as k,b3 as K,cd as Z,dx as G,bt as F,bT as J,bL as Q,cc as X,aD as Y,cO as ee}from"./C62hEcuG.js";import{f as re}from"./BShpbBom.js";import{u as ae,N as te}from"./BwuD1Zq8.js";import{u as oe,f as le}from"./D1F6uLnh.js";import{h as D}from"./CM8LO42l.js";import{C as se}from"./BFxeTbuh.js";const ne=S({name:"ChevronLeft",render(){return s("svg",{viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg"},s("path",{d:"M10.3536 3.14645C10.5488 3.34171 10.5488 3.65829 10.3536 3.85355L6.20711 8L10.3536 12.1464C10.5488 12.3417 10.5488 12.6583 10.3536 12.8536C10.1583 13.0488 9.84171 13.0488 9.64645 12.8536L5.14645 8.35355C4.95118 8.15829 4.95118 7.84171 5.14645 7.64645L9.64645 3.14645C9.84171 2.95118 10.1583 2.95118 10.3536 3.14645Z",fill:"currentColor"}))}}),ie=f("collapse","width: 100%;",[f("collapse-item",`
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
 `)])]),f("collapse-item","margin-left: 32px;"),z("&:first-child","margin-top: 0;"),z("&:first-child >",[l("header","padding-top: 0;")]),x("left-arrow-placement",[l("header",[f("collapse-item-arrow","margin-right: 4px;")])]),x("right-arrow-placement",[l("header",[f("collapse-item-arrow","margin-left: 4px;")])]),l("content-wrapper",[l("content-inner","padding-top: 16px;"),re({duration:"0.15s"})]),x("active",[l("header",[x("active",[f("collapse-item-arrow","transform: rotate(90deg);")])])]),z("&:not(:first-child)","border-top: 1px solid var(--n-divider-color);"),W("disabled",[x("trigger-area-main",[l("header",[l("header-main","cursor: pointer;"),f("collapse-item-arrow","cursor: default;")])]),x("trigger-area-arrow",[l("header",[f("collapse-item-arrow","cursor: pointer;")])]),x("trigger-area-extra",[l("header",[l("header-extra","cursor: pointer;")])])]),l("header",`
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
 `)])])]),de=Object.assign(Object.assign({},k.props),{defaultExpandedNames:{type:[Array,String],default:null},expandedNames:[Array,String],arrowPlacement:{type:String,default:"left"},accordion:{type:Boolean,default:!1},displayDirective:{type:String,default:"if"},triggerAreas:{type:Array,default:()=>["main","extra","arrow"]},onItemHeaderClick:[Function,Array],"onUpdate:expandedNames":[Function,Array],onUpdateExpandedNames:[Function,Array],onExpandedNamesChange:{type:[Function,Array],validator:()=>!0,default:void 0}}),L=Z("n-collapse"),we=S({name:"Collapse",props:de,setup(e,{slots:i}){const{mergedClsPrefixRef:n,inlineThemeDisabled:o,mergedRtlRef:d}=T(e),a=q(e.defaultExpandedNames),h=N(()=>e.expandedNames),v=ae(h,a),w=k("Collapse","-collapse",ie,G,e,n);function c(p){const{"onUpdate:expandedNames":t,onUpdateExpandedNames:m,onExpandedNamesChange:y}=e;m&&P(m,p),t&&P(t,p),y&&P(y,p),a.value=p}function g(p){const{onItemHeaderClick:t}=e;t&&P(t,p)}function r(p,t,m){const{accordion:y}=e,{value:E}=v;if(y)p?(c([t]),g({name:t,expanded:!0,event:m})):(c([]),g({name:t,expanded:!1,event:m}));else if(!Array.isArray(E))c([t]),g({name:t,expanded:!0,event:m});else{const C=E.slice(),I=C.findIndex($=>t===$);~I?(C.splice(I,1),c(C),g({name:t,expanded:!1,event:m})):(C.push(t),c(C),g({name:t,expanded:!0,event:m}))}}K(L,{props:e,mergedClsPrefixRef:n,expandedNamesRef:v,slots:i,toggleItem:r});const u=_("Collapse",d,n),R=N(()=>{const{common:{cubicBezierEaseInOut:p},self:{titleFontWeight:t,dividerColor:m,titlePadding:y,titleTextColor:E,titleTextColorDisabled:C,textColor:I,arrowColor:$,fontSize:B,titleFontSize:U,arrowColorDisabled:j,itemMargin:M}}=w.value;return{"--n-font-size":B,"--n-bezier":p,"--n-text-color":I,"--n-divider-color":m,"--n-title-padding":y,"--n-title-font-size":U,"--n-title-text-color":E,"--n-title-text-color-disabled":C,"--n-title-font-weight":t,"--n-arrow-color":$,"--n-arrow-color-disabled":j,"--n-item-margin":M}}),b=o?H("collapse",void 0,R,e):void 0;return{rtlEnabled:u,mergedTheme:w,mergedClsPrefix:n,cssVars:o?void 0:R,themeClass:b==null?void 0:b.themeClass,onRender:b==null?void 0:b.onRender}},render(){var e;return(e=this.onRender)===null||e===void 0||e.call(this),s("div",{class:[`${this.mergedClsPrefix}-collapse`,this.rtlEnabled&&`${this.mergedClsPrefix}-collapse--rtl`,this.themeClass],style:this.cssVars},this.$slots)}}),ce=S({name:"CollapseItemContent",props:{displayDirective:{type:String,required:!0},show:Boolean,clsPrefix:{type:String,required:!0}},setup(e){return{onceTrue:oe(F(e,"show"))}},render(){return s(te,null,{default:()=>{const{show:e,displayDirective:i,onceTrue:n,clsPrefix:o}=this,d=i==="show"&&n,a=s("div",{class:`${o}-collapse-item__content-wrapper`},s("div",{class:`${o}-collapse-item__content-inner`},this.$slots));return d?J(a,[[Q,e]]):e?a:null}})}}),pe={title:String,name:[String,Number],disabled:Boolean,displayDirective:String},Ce=S({name:"CollapseItem",props:pe,setup(e){const{mergedRtlRef:i}=T(e),n=le(),o=X(()=>{var r;return(r=e.name)!==null&&r!==void 0?r:n}),d=Y(L);d||ee("collapse-item","`n-collapse-item` must be placed inside `n-collapse`.");const{expandedNamesRef:a,props:h,mergedClsPrefixRef:v,slots:w}=d,c=N(()=>{const{value:r}=a;if(Array.isArray(r)){const{value:u}=o;return!~r.findIndex(R=>R===u)}else if(r){const{value:u}=o;return u!==r}return!0});return{rtlEnabled:_("Collapse",i,v),collapseSlots:w,randomName:n,mergedClsPrefix:v,collapsed:c,triggerAreas:F(h,"triggerAreas"),mergedDisplayDirective:N(()=>{const{displayDirective:r}=e;return r||h.displayDirective}),arrowPlacement:N(()=>h.arrowPlacement),handleClick(r){let u="main";D(r,"arrow")&&(u="arrow"),D(r,"extra")&&(u="extra"),h.triggerAreas.includes(u)&&d&&!e.disabled&&d.toggleItem(c.value,o.value,r)}}},render(){const{collapseSlots:e,$slots:i,arrowPlacement:n,collapsed:o,mergedDisplayDirective:d,mergedClsPrefix:a,disabled:h,triggerAreas:v}=this,w=A(i.header,{collapsed:o},()=>[this.title]),c=i["header-extra"]||e["header-extra"],g=i.arrow||e.arrow;return s("div",{class:[`${a}-collapse-item`,`${a}-collapse-item--${n}-arrow-placement`,h&&`${a}-collapse-item--disabled`,!o&&`${a}-collapse-item--active`,v.map(r=>`${a}-collapse-item--trigger-area-${r}`)]},s("div",{class:[`${a}-collapse-item__header`,!o&&`${a}-collapse-item__header--active`]},s("div",{class:`${a}-collapse-item__header-main`,onClick:this.handleClick},n==="right"&&w,s("div",{class:`${a}-collapse-item-arrow`,key:this.rtlEnabled?0:1,"data-arrow":!0},A(g,{collapsed:o},()=>{var r;return[s(V,{clsPrefix:a},{default:(r=e.expandIcon)!==null&&r!==void 0?r:()=>this.rtlEnabled?s(ne,null):s(se,null)})]})),n==="left"&&w),O(c,{collapsed:o},r=>s("div",{class:`${a}-collapse-item__header-extra`,onClick:this.handleClick,"data-extra":!0},r))),s(ce,{clsPrefix:a,displayDirective:d,show:!o},i))}});export{Ce as N,we as a};
