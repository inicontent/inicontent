const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./CS65qGMu.js","./0vgCQeZq.js","./C5OcD23B.js","./CFZop9RU.js","./entry.-V8RZj7I.css","./DEMT0iSp.js"])))=>i.map(i=>d[i]);
import{d as q}from"./0vgCQeZq.js";import{b as D,h as S,f as k,d as c,i as T,a9 as j,af as E,l as V,ag as F,t as e,a3 as O,J as W,_ as K,B as G,C as A,P as J,A as h,N as X}from"./CFZop9RU.js";import{r as Q}from"./C6RyFxGH.js";import{L as Y}from"./Dmbem21D.js";import{c as l,N as o}from"./CXaRlF3j.js";import{c as Z,b as ee}from"./8j3GDo7C.js";import{I as ae}from"./yHtyiUQE.js";import{S as R}from"./BBlbCD3G.js";import{B as i}from"./R6fackfm.js";import{N as _}from"./D_Qu_yT2.js";import{d as te}from"./C5Tt_c0f.js";import{N as oe,a as le}from"./DRTsXWOY.js";import{N as ne}from"./DhqKmjeS.js";import{N as U}from"./DMbr3jrM.js";import{N as I}from"./ChY8rPYu.js";import{N as z}from"./C1jYYpVn.js";import{N as ie}from"./BqetHKvN.js";import{N as re}from"./CLuYGKCk.js";import"./C5OcD23B.js";import"./DEMT0iSp.js";import"./D2GkMi_I.js";import"./BJKaMiZy.js";import"./vxBaO5E-.js";import"./CMSvwZa9.js";import"./Cjrk4TDS.js";import"./BSF8vB7W.js";import"./t5kcgBii.js";import"./C3M1WvbL.js";import"./COm9J_20.js";import"./IlW3-8Qj.js";import"./BMwUx3Op.js";import"./DgCxdCjL.js";import"./RUeo6_7w.js";import"./DSBXb5Ob.js";import"./Cq4y_ZhK.js";import"./CpGCaLlT.js";import"./dthax2-z.js";import"./-6wSLrES.js";import"./B3kEFUSN.js";import"./DjWqVgbA.js";import"./DaDNm88S.js";import"./Tu0PoXZg.js";import"./BYP_akc1.js";import"./BtrpEMm5.js";import"./KdGHD0sL.js";import"./CM8LO42l.js";import"./HiGXOwLp.js";import"./C4J8sofl.js";import"./DbnPTcif.js";import"./C-x6Iu6X.js";import"./DMligQNt.js";import"./DsSU6HIH.js";import"./C3mGUiDb.js";import"./Co80eD7z.js";import"./Bk_rJcZu.js";import"./DGISIIJO.js";import"./DMGaTrfY.js";import"./tCdn1n2b.js";import"./TZclZtjG.js";import"./DEFgMjJF.js";import"./Bt3ZajGi.js";const de=D("divider",`
 position: relative;
 display: flex;
 width: 100%;
 box-sizing: border-box;
 font-size: 16px;
 color: var(--n-text-color);
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
`,[S("vertical",`
 margin-top: 24px;
 margin-bottom: 24px;
 `,[S("no-title",`
 display: flex;
 align-items: center;
 `)]),k("title",`
 display: flex;
 align-items: center;
 margin-left: 12px;
 margin-right: 12px;
 white-space: nowrap;
 font-weight: var(--n-font-weight);
 `),c("title-position-left",[k("line",[c("left",{width:"28px"})])]),c("title-position-right",[k("line",[c("right",{width:"28px"})])]),c("dashed",[k("line",`
 background-color: #0000;
 height: 0px;
 width: 100%;
 border-style: dashed;
 border-width: 1px 0 0;
 `)]),c("vertical",`
 display: inline-block;
 height: 1em;
 margin: 0 8px;
 vertical-align: middle;
 width: 1px;
 `),k("line",`
 border: none;
 transition: background-color .3s var(--n-bezier), border-color .3s var(--n-bezier);
 height: 1px;
 width: 100%;
 margin: 0;
 `),S("dashed",[k("line",{backgroundColor:"var(--n-color)"})]),c("dashed",[k("line",{borderColor:"var(--n-color)"})]),c("vertical",{backgroundColor:"var(--n-color)"})]),se=Object.assign(Object.assign({},E.props),{titlePlacement:{type:String,default:"center"},dashed:Boolean,vertical:Boolean}),L=T({name:"Divider",props:se,setup(n){const{mergedClsPrefixRef:d,inlineThemeDisabled:s}=j(n),v=E("Divider","-divider",de,te,n,d),p=V(()=>{const{common:{cubicBezierEaseInOut:r},self:{color:u,textColor:a,fontWeight:f}}=v.value;return{"--n-bezier":r,"--n-color":u,"--n-text-color":a,"--n-font-weight":f}}),m=s?F("divider",void 0,p,n):void 0;return{mergedClsPrefix:d,cssVars:s?void 0:p,themeClass:m==null?void 0:m.themeClass,onRender:m==null?void 0:m.onRender}},render(){var n;const{$slots:d,titlePlacement:s,vertical:v,dashed:p,cssVars:m,mergedClsPrefix:r}=this;return(n=this.onRender)===null||n===void 0||n.call(this),e("div",{role:"separator",class:[`${r}-divider`,this.themeClass,{[`${r}-divider--vertical`]:v,[`${r}-divider--no-title`]:!d.default,[`${r}-divider--dashed`]:p,[`${r}-divider--title-position-${s}`]:d.default&&s}],style:m},v?null:e("div",{class:`${r}-divider__line ${r}-divider__line--left`}),!v&&d.default?e(O,null,e("div",{class:`${r}-divider__title`},this.$slots),e("div",{class:`${r}-divider__line ${r}-divider__line--right`})):null)}});/**
 * @license @tabler/icons-vue v3.14.0 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */var ue=l("outline","align-center","IconAlignCenter",[["path",{d:"M4 6l16 0",key:"svg-0"}],["path",{d:"M8 12l8 0",key:"svg-1"}],["path",{d:"M6 18l12 0",key:"svg-2"}]]);/**
 * @license @tabler/icons-vue v3.14.0 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */var me=l("outline","align-left","IconAlignLeft",[["path",{d:"M4 6l16 0",key:"svg-0"}],["path",{d:"M4 12l10 0",key:"svg-1"}],["path",{d:"M4 18l14 0",key:"svg-2"}]]);/**
 * @license @tabler/icons-vue v3.14.0 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */var ve=l("outline","align-right","IconAlignRight",[["path",{d:"M4 6l16 0",key:"svg-0"}],["path",{d:"M10 12l10 0",key:"svg-1"}],["path",{d:"M6 18l14 0",key:"svg-2"}]]);/**
 * @license @tabler/icons-vue v3.14.0 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */var pe=l("outline","arrow-back-up","IconArrowBackUp",[["path",{d:"M9 14l-4 -4l4 -4",key:"svg-0"}],["path",{d:"M5 10h11a4 4 0 1 1 0 8h-1",key:"svg-1"}]]);/**
 * @license @tabler/icons-vue v3.14.0 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */var ce=l("outline","arrow-forward-up","IconArrowForwardUp",[["path",{d:"M15 14l4 -4l-4 -4",key:"svg-0"}],["path",{d:"M19 10h-11a4 4 0 1 0 0 8h1",key:"svg-1"}]]);/**
 * @license @tabler/icons-vue v3.14.0 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */var he=l("outline","bold","IconBold",[["path",{d:"M7 5h6a3.5 3.5 0 0 1 0 7h-6z",key:"svg-0"}],["path",{d:"M13 12h1a3.5 3.5 0 0 1 0 7h-7v-7",key:"svg-1"}]]);/**
 * @license @tabler/icons-vue v3.14.0 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */var ge=l("outline","color-picker","IconColorPicker",[["path",{d:"M11 7l6 6",key:"svg-0"}],["path",{d:"M4 16l11.7 -11.7a1 1 0 0 1 1.4 0l2.6 2.6a1 1 0 0 1 0 1.4l-11.7 11.7h-4v-4z",key:"svg-1"}]]);/**
 * @license @tabler/icons-vue v3.14.0 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */var ye=l("outline","h-1","IconH1",[["path",{d:"M19 18v-8l-2 2",key:"svg-0"}],["path",{d:"M4 6v12",key:"svg-1"}],["path",{d:"M12 6v12",key:"svg-2"}],["path",{d:"M11 18h2",key:"svg-3"}],["path",{d:"M3 18h2",key:"svg-4"}],["path",{d:"M4 12h8",key:"svg-5"}],["path",{d:"M3 6h2",key:"svg-6"}],["path",{d:"M11 6h2",key:"svg-7"}]]);/**
 * @license @tabler/icons-vue v3.14.0 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */var ke=l("outline","h-2","IconH2",[["path",{d:"M17 12a2 2 0 1 1 4 0c0 .591 -.417 1.318 -.816 1.858l-3.184 4.143l4 0",key:"svg-0"}],["path",{d:"M4 6v12",key:"svg-1"}],["path",{d:"M12 6v12",key:"svg-2"}],["path",{d:"M11 18h2",key:"svg-3"}],["path",{d:"M3 18h2",key:"svg-4"}],["path",{d:"M4 12h8",key:"svg-5"}],["path",{d:"M3 6h2",key:"svg-6"}],["path",{d:"M11 6h2",key:"svg-7"}]]);/**
 * @license @tabler/icons-vue v3.14.0 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */var fe=l("outline","h-3","IconH3",[["path",{d:"M19 14a2 2 0 1 0 -2 -2",key:"svg-0"}],["path",{d:"M17 16a2 2 0 1 0 2 -2",key:"svg-1"}],["path",{d:"M4 6v12",key:"svg-2"}],["path",{d:"M12 6v12",key:"svg-3"}],["path",{d:"M11 18h2",key:"svg-4"}],["path",{d:"M3 18h2",key:"svg-5"}],["path",{d:"M4 12h8",key:"svg-6"}],["path",{d:"M3 6h2",key:"svg-7"}],["path",{d:"M11 6h2",key:"svg-8"}]]);/**
 * @license @tabler/icons-vue v3.14.0 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */var Me=l("outline","h-4","IconH4",[["path",{d:"M20 18v-8l-4 6h5",key:"svg-0"}],["path",{d:"M4 6v12",key:"svg-1"}],["path",{d:"M12 6v12",key:"svg-2"}],["path",{d:"M11 18h2",key:"svg-3"}],["path",{d:"M3 18h2",key:"svg-4"}],["path",{d:"M4 12h8",key:"svg-5"}],["path",{d:"M3 6h2",key:"svg-6"}],["path",{d:"M11 6h2",key:"svg-7"}]]);/**
 * @license @tabler/icons-vue v3.14.0 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */var Ce=l("outline","h-5","IconH5",[["path",{d:"M17 18h2a2 2 0 1 0 0 -4h-2v-4h4",key:"svg-0"}],["path",{d:"M4 6v12",key:"svg-1"}],["path",{d:"M12 6v12",key:"svg-2"}],["path",{d:"M11 18h2",key:"svg-3"}],["path",{d:"M3 18h2",key:"svg-4"}],["path",{d:"M4 12h8",key:"svg-5"}],["path",{d:"M3 6h2",key:"svg-6"}],["path",{d:"M11 6h2",key:"svg-7"}]]);/**
 * @license @tabler/icons-vue v3.14.0 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */var be=l("outline","h-6","IconH6",[["path",{d:"M19 14a2 2 0 1 0 0 4a2 2 0 0 0 0 -4z",key:"svg-0"}],["path",{d:"M21 12a2 2 0 1 0 -4 0v4",key:"svg-1"}],["path",{d:"M4 6v12",key:"svg-2"}],["path",{d:"M12 6v12",key:"svg-3"}],["path",{d:"M11 18h2",key:"svg-4"}],["path",{d:"M3 18h2",key:"svg-5"}],["path",{d:"M4 12h8",key:"svg-6"}],["path",{d:"M3 6h2",key:"svg-7"}],["path",{d:"M11 6h2",key:"svg-8"}]]);/**
 * @license @tabler/icons-vue v3.14.0 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */var xe=l("outline","heading","IconHeading",[["path",{d:"M7 12h10",key:"svg-0"}],["path",{d:"M7 5v14",key:"svg-1"}],["path",{d:"M17 5v14",key:"svg-2"}],["path",{d:"M15 19h4",key:"svg-3"}],["path",{d:"M15 5h4",key:"svg-4"}],["path",{d:"M5 19h4",key:"svg-5"}],["path",{d:"M5 5h4",key:"svg-6"}]]);/**
 * @license @tabler/icons-vue v3.14.0 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */var we=l("outline","highlight","IconHighlight",[["path",{d:"M3 19h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4",key:"svg-0"}],["path",{d:"M12.5 5.5l4 4",key:"svg-1"}],["path",{d:"M4.5 13.5l4 4",key:"svg-2"}],["path",{d:"M21 15v4h-8l4 -4z",key:"svg-3"}]]);/**
 * @license @tabler/icons-vue v3.14.0 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */var Ie=l("outline","italic","IconItalic",[["path",{d:"M11 5l6 0",key:"svg-0"}],["path",{d:"M7 19l6 0",key:"svg-1"}],["path",{d:"M14 5l-4 14",key:"svg-2"}]]);/**
 * @license @tabler/icons-vue v3.14.0 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */var Se=l("outline","list-numbers","IconListNumbers",[["path",{d:"M11 6h9",key:"svg-0"}],["path",{d:"M11 12h9",key:"svg-1"}],["path",{d:"M12 18h8",key:"svg-2"}],["path",{d:"M4 16a2 2 0 1 1 4 0c0 .591 -.5 1 -1 1.5l-3 2.5h4",key:"svg-3"}],["path",{d:"M6 10v-6l-2 2",key:"svg-4"}]]);/**
 * @license @tabler/icons-vue v3.14.0 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */var ze=l("outline","list","IconList",[["path",{d:"M9 6l11 0",key:"svg-0"}],["path",{d:"M9 12l11 0",key:"svg-1"}],["path",{d:"M9 18l11 0",key:"svg-2"}],["path",{d:"M5 6l0 .01",key:"svg-3"}],["path",{d:"M5 12l0 .01",key:"svg-4"}],["path",{d:"M5 18l0 .01",key:"svg-5"}]]);/**
 * @license @tabler/icons-vue v3.14.0 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */var Le=l("outline","strikethrough","IconStrikethrough",[["path",{d:"M5 12l14 0",key:"svg-0"}],["path",{d:"M16 6.5a4 2 0 0 0 -4 -1.5h-1a3.5 3.5 0 0 0 0 7h2a3.5 3.5 0 0 1 0 7h-1.5a4 2 0 0 1 -4 -1.5",key:"svg-1"}]]);/**
 * @license @tabler/icons-vue v3.14.0 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */var He=l("outline","text-resize","IconTextResize",[["path",{d:"M5 5m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0",key:"svg-0"}],["path",{d:"M19 5m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0",key:"svg-1"}],["path",{d:"M5 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0",key:"svg-2"}],["path",{d:"M19 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0",key:"svg-3"}],["path",{d:"M5 7v10",key:"svg-4"}],["path",{d:"M7 5h10",key:"svg-5"}],["path",{d:"M7 19h10",key:"svg-6"}],["path",{d:"M19 7v10",key:"svg-7"}],["path",{d:"M10 10h4",key:"svg-8"}],["path",{d:"M12 14v-4",key:"svg-9"}]]);/**
 * @license @tabler/icons-vue v3.14.0 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */var Ne=l("outline","underline","IconUnderline",[["path",{d:"M7 5v5a5 5 0 0 0 10 0v-5",key:"svg-0"}],["path",{d:"M5 19h14",key:"svg-1"}]]);const B=W(()=>K(()=>import("./CS65qGMu.js"),__vite__mapDeps([0,1,2,3,4,5]),import.meta.url).then(n=>n.default||n.default||n));function g(){var n,d,s,v,p;return(d=(n=window==null?void 0:window.getSelection)==null?void 0:n.call(window))!=null&&d.getRangeAt&&((s=window==null?void 0:window.getSelection())!=null&&s.rangeCount)&&!((v=window==null?void 0:window.getSelection())!=null&&v.isCollapsed)?(p=window==null?void 0:window.getSelection())==null?void 0:p.getRangeAt(0):null}function y(n){var d,s;n&&(window.getSelection&&((d=window==null?void 0:window.getSelection())==null||d.removeAllRanges()),(s=window==null?void 0:window.getSelection())==null||s.addRange(n))}const Va=q({props:{modelValue:{type:String,default:void 0}},setup:(n,{emit:d})=>{const s=G("Language"),v=A("Loading",()=>({}));v.value.Upload=!1,J();const p=V({get:()=>n.modelValue,set:t=>d("update:modelValue",t)}),m=h(!1),r=Q(),u=h(!1),a=h(null),f=h(),M=h(!1),b=h(),C=h(!1),x=h(),$=A("user");return X(()=>{var t;document.execCommand("enableObjectResizing",!1,"true");for(const w of["mouseup","keyup","selectionchange"])(t=document.getElementById(r))==null||t.addEventListener(w,()=>{var H,N,P;((P=(N=(H=window==null?void 0:window.getSelection())==null?void 0:H.anchorNode)==null?void 0:N.textContent)==null?void 0:P.length)!==0?a.value=g():a.value=null})}),()=>[e(le,{show:m.value,"on-update:show":t=>{m.value=t},defaultHeight:"50%",placement:"bottom",resizable:!0},()=>e(oe,{id:"assets_modal",nativeScrollbar:!1,bodyContentStyle:{padding:0}},()=>e(Y,{targetID:"assets_modal"},t=>t.type!=="folder"?e(ne,{onUpdateChecked(){document.execCommand("insertimage",void 0,t.publicURL),m.value=!1}}):null))),e(U,{vertical:!0,style:{width:"100%"}},()=>[e(R,{xScrollable:!0},()=>e(U,{wrap:!1},()=>[e(I,{size:"small"},()=>[e(i,{disabled:!a.value,type:document.queryCommandState("bold")?"primary":"default",onClick:()=>document.execCommand("bold")},{icon:()=>e(o,()=>e(he))}),e(i,{disabled:!a.value,type:document.queryCommandState("italic")?"primary":"default",onClick:()=>document.execCommand("italic")},{icon:()=>e(o,()=>e(Ie))}),e(i,{disabled:!a.value,type:document.queryCommandState("underline")?"primary":"default",onClick:()=>document.execCommand("underline")},{icon:()=>e(o,()=>e(Ne))}),e(i,{disabled:!a.value,type:document.queryCommandState("strikeThrough")?"primary":"default",onClick:()=>document.execCommand("strikeThrough")},{icon:()=>e(o,()=>e(Le))}),e(_,{disabled:!u.value,size:"small",scrollable:!0,onUpdateValue(t){document.execCommand("formatBlock",!1,`<${t}>`),a.value=g()},value:a.value?a.value.commonAncestorContainer.parentElement.tagName.toLowerCase():null,options:[{label:()=>e("h1",{style:{margin:0}},"Heading 1"),value:"h1",icon:()=>e(o,()=>e(ye))},{label:()=>e("h2",{style:{margin:0}},"Heading 2"),value:"h2",icon:()=>e(o,()=>e(ke))},{label:()=>e("h3",{style:{margin:0}},"Heading 3"),value:"h3",icon:()=>e(o,()=>e(fe))},{label:()=>e("h4",{style:{margin:0}},"Heading 4"),value:"h4",icon:()=>e(o,()=>e(Me))},{label:()=>e("h5",{style:{margin:0}},"Heading 5"),value:"h5",icon:()=>e(o,()=>e(Ce))},{label:()=>e("h6",{style:{margin:0}},"Heading 6"),value:"h6",icon:()=>e(o,()=>e(be))}]},()=>e(i,{disabled:!u.value,type:a.value&&a.value.commonAncestorContainer.parentElement.tagName.toLowerCase().charAt(0)==="h"?"primary":"default"},{icon:()=>e(o,()=>e(xe))})),e(z,{raw:!0,disabled:!a.value,show:M.value,onUpdateShow(t){t?(M.value=!0,C.value=!1,a.value=g()):(M.value=!1,y(a.value))}},{trigger:()=>e(i,{disabled:!a.value,style:{color:f.value},ghost:!0,size:"small",onClick(){y(a.value),document.execCommand("styleWithCSS",!1,""),document.execCommand("foreColor",!1,f.value)}},{icon:()=>e(o,()=>e(ge))}),default:()=>e(B,{modelValue:f.value,"onUpdate:modelValue"(t){f.value=t,y(a.value),document.execCommand("styleWithCSS",!1,""),document.execCommand("foreColor",!1,t),M.value=!1,a.value=g()}})}),e(z,{raw:!0,disabled:!a.value,show:C.value,onUpdateShow(t){t?(C.value=!0,M.value=!1,a.value=g()):(C.value=!1,y(a.value))}},{trigger:()=>e(i,{disabled:!a.value,color:b.value,size:"small",onClick(){y(a.value),document.execCommand("styleWithCSS",!1,""),document.execCommand("backColor",!1,b.value)}},{icon:()=>e(o,()=>e(we))}),default:()=>e(B,{modelValue:b.value,"onUpdate:modelValue"(t){b.value=t,y(a.value),document.execCommand("styleWithCSS",!1,""),document.execCommand("backColor",!1,t),C.value=!1,a.value=g()}})}),e(_,{disabled:!a.value,size:"small",scrollable:!0,type:document.queryCommandState("fontSize")?"primary":"default",onUpdateValue(t){document.execCommand("styleWithCSS",!1,""),document.execCommand("fontSize",!1,t),a.value=g()},value:a.value?{"xxx-large":7,"xx-large":6,"x-large":5,large:4,medium:3,small:2,"x-small":1}[a.value.commonAncestorContainer.parentElement.style.fontSize]:null,options:[{label:()=>e("span",{style:{fontSize:"xxx-large"}},"Paragraph"),value:7},{label:()=>e("span",{style:{fontSize:"xx-large"}},"Paragraph"),value:6},{label:()=>e("span",{style:{fontSize:"x-large"}},"Paragraph"),value:5},{label:()=>e("span",{style:{fontSize:"large"}},"Paragraph"),value:4},{label:()=>e("span",{style:{fontSize:"medium"}},"Paragraph"),value:3},{label:()=>e("span",{style:{fontSize:"small"}},"Paragraph"),value:2},{label:()=>e("span",{style:{fontSize:"x-small"}},"Paragraph"),value:1}]},()=>e(i,{disabled:!a.value},{icon:()=>e(o,()=>e(He))}))]),e(L,{vertical:!0}),e(I,{size:"small",style:{display:"flex"}},()=>[$.value?e(i,{disabled:!u.value,type:a.value&&a.value.commonAncestorContainer.parentElement.tagName.toLowerCase()==="img"?"primary":"default",onmousedown:()=>{m.value=!0}},{icon:()=>e(o,()=>e(Z))}):null,e(z,{disabled:!u.value,"on-update:show":t=>{t?a.value=g():y(a.value)}},{trigger:()=>e(i,{disabled:!u.value,type:a.value&&a.value.commonAncestorContainer.parentElement.tagName.toLowerCase()==="a"?"primary":"default"},{icon:()=>e(o,()=>e(ee))}),default:()=>e(ie,{},()=>[e(re,{inputProps:{type:"url"},size:"small",value:x.value,"on-update:value":t=>{x.value=t}}),e(i,{type:"primary",onClick(){y(a.value),document.execCommand("createLink",!0,x.value),x.value=void 0}},()=>e(o,()=>e(ae)))])}),e(i,{disabled:!u.value,type:document.queryCommandState("insertOrderedList")?"primary":"default",onClick:()=>document.execCommand("insertOrderedList")},{icon:()=>e(o,()=>e(Se))}),e(i,{disabled:!u.value,type:document.queryCommandState("insertUnorderedList")?"primary":"default",onClick:()=>document.execCommand("insertUnorderedList")},{icon:()=>e(o,()=>e(ze))})]),e(L,{vertical:!0}),e(I,{size:"small"},()=>[e(i,{disabled:!u.value,type:document.queryCommandState("justifyLeft")?"primary":"default",onClick:()=>document.execCommand("justifyLeft")},{icon:()=>e(o,()=>e(me))}),e(i,{disabled:!u.value,type:document.queryCommandState("justifyCenter")?"primary":"default",onClick:()=>document.execCommand("justifyCenter")},{icon:()=>e(o,()=>e(ue))}),e(i,{disabled:!u.value,type:document.queryCommandState("justifyRight")?"primary":"default",onClick:()=>document.execCommand("justifyRight")},{icon:()=>e(o,()=>e(ve))})]),e(L,{vertical:!0}),e(I,{size:"small"},()=>[e(i,{disabled:!document.queryCommandEnabled("undo"),onClick:()=>document.execCommand("undo",!1,"")},{icon:()=>e(o,{style:s.value==="ar"?{transform:"scaleX(-1)"}:null},()=>e(pe))}),e(i,{disabled:!document.queryCommandEnabled("redo"),onClick:()=>document.execCommand("redo",!1,"")},{icon:()=>e(o,{style:s.value==="ar"?{transform:"scaleX(-1)"}:null},()=>e(ce))})])])),e(R,{class:"rich-editor",style:{maxHeight:"250px"}},()=>e("div",{style:{minHeight:"100px",outline:"0px solid transparent"},id:r,innerHTML:p.value,onFocusin:()=>{u.value=!0},onFocusout:()=>{u.value=!1},onKeydown:t=>{t.key==="Enter"&&(t.ctrlKey||t.metaKey)&&(t.preventDefault(),document.execCommand("insertParagraph",!1,""))},onInput:t=>{var w;p.value=(w=t==null?void 0:t.target)==null?void 0:w.innerHTML},contenteditable:!0}))])]}},"$ALhCwpi7JC");export{Va as default};
