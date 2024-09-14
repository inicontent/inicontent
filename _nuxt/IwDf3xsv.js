import{d as Q}from"./DCfSOwj1.js";import{e as j,b as h,d as I,f as y,aI as W,aJ as X,i as H,a9 as Y,af as O,q as Z,ac as P,l as V,ag as A,t as e,ad as ee,j as re,aq as oe,C as D,P as te,bP as ae,bs as c,S as v,M as se}from"./GicmGKj6.js";import{g as l}from"./BiaQdd8p.js";import{g as ie}from"./8ZBolG5t.js";import{r as L}from"./DtLgIVFD.js";import{I as ne}from"./DSmFug1m.js";import{I as S}from"./BLUBM1Tt.js";import{I as le}from"./D2-yUcPF.js";import{I as B}from"./DWJuhVBu.js";import{u as ce}from"./B5x2ntQ_.js";import{l as de}from"./CrnXoPrW.js";import{S as me}from"./DQYWAPtD.js";import{B as m}from"./DkfZ8b2U.js";import{N as M}from"./D_T7c3CR.js";import{N as k}from"./C0UBYqcV.js";import{N as E}from"./DRIgntSq.js";import{N as F,a as ue}from"./D_JDrZjB.js";import{N as n}from"./BwYgWCwO.js";import{N as w}from"./CJaYANHJ.js";import{N as _}from"./mcMpMs27.js";import{N as T}from"./CZ9dZadM.js";import{N as ve}from"./Cak3IB75.js";import{N as pe}from"./iM2ADUk5.js";import"./rtVrmwDn.js";import"./CVmwqCLO.js";import"./DCVII8nU.js";import"./CYXTsx-p.js";import"./D3rU6aJi.js";import"./CU2JJRiU.js";import"./Dhmybkx6.js";import"./BWGTpkaN.js";import"./DSbqC9gd.js";import"./Di5MGdNS.js";import"./CxLKhYDU.js";import"./ARpd52Or.js";import"./BtrpEMm5.js";import"./BosuxZz1.js";import"./D32MADKl.js";import"./rTfk-_yH.js";import"./5CsqxX9Y.js";import"./OxUSaDC3.js";import"./CN0KqL9F.js";import"./Dc83o4Gi.js";import"./Cv8iCZhm.js";import"./BZk9bI-9.js";import"./C2161hUv.js";import"./DiPEGMYL.js";import"./DTu6_oKm.js";import"./5fSvgue4.js";import"./Bk_rJcZu.js";import"./h0mJDxlK.js";import"./DSW-2Z0k.js";import"./BLWkGjX4.js";import"./BmVtr0Bc.js";const ge=j([h("list",`
 --n-merged-border-color: var(--n-border-color);
 --n-merged-color: var(--n-color);
 --n-merged-color-hover: var(--n-color-hover);
 margin: 0;
 font-size: var(--n-font-size);
 transition:
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 padding: 0;
 list-style-type: none;
 color: var(--n-text-color);
 background-color: var(--n-merged-color);
 `,[I("show-divider",[h("list-item",[j("&:not(:last-child)",[y("divider",`
 background-color: var(--n-merged-border-color);
 `)])])]),I("clickable",[h("list-item",`
 cursor: pointer;
 `)]),I("bordered",`
 border: 1px solid var(--n-merged-border-color);
 border-radius: var(--n-border-radius);
 `),I("hoverable",[h("list-item",`
 border-radius: var(--n-border-radius);
 `,[j("&:hover",`
 background-color: var(--n-merged-color-hover);
 `,[y("divider",`
 background-color: transparent;
 `)])])]),I("bordered, hoverable",[h("list-item",`
 padding: 12px 20px;
 `),y("header, footer",`
 padding: 12px 20px;
 `)]),y("header, footer",`
 padding: 12px 0;
 box-sizing: border-box;
 transition: border-color .3s var(--n-bezier);
 `,[j("&:not(:last-child)",`
 border-bottom: 1px solid var(--n-merged-border-color);
 `)]),h("list-item",`
 position: relative;
 padding: 12px 0; 
 box-sizing: border-box;
 display: flex;
 flex-wrap: nowrap;
 align-items: center;
 transition:
 background-color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 `,[y("prefix",`
 margin-right: 20px;
 flex: 0;
 `),y("suffix",`
 margin-left: 20px;
 flex: 0;
 `),y("main",`
 flex: 1;
 `),y("divider",`
 height: 1px;
 position: absolute;
 bottom: 0;
 left: 0;
 right: 0;
 background-color: transparent;
 transition: background-color .3s var(--n-bezier);
 pointer-events: none;
 `)])]),W(h("list",`
 --n-merged-color-hover: var(--n-color-hover-modal);
 --n-merged-color: var(--n-color-modal);
 --n-merged-border-color: var(--n-border-color-modal);
 `)),X(h("list",`
 --n-merged-color-hover: var(--n-color-hover-popover);
 --n-merged-color: var(--n-color-popover);
 --n-merged-border-color: var(--n-border-color-popover);
 `))]),be=Object.assign(Object.assign({},O.props),{size:{type:String,default:"medium"},bordered:Boolean,clickable:Boolean,hoverable:Boolean,showDivider:{type:Boolean,default:!0}}),q=ee("n-list"),fe=H({name:"List",props:be,setup(o){const{mergedClsPrefixRef:u,inlineThemeDisabled:g,mergedRtlRef:a}=Y(o),$=ce("List",a,u),R=O("List","-list",ge,de,o,u);Z(q,{showDividerRef:P(o,"showDivider"),mergedClsPrefixRef:u});const C=V(()=>{const{common:{cubicBezierEaseInOut:s},self:{fontSize:i,textColor:z,color:t,colorModal:d,colorPopover:b,borderColor:f,borderColorModal:N,borderColorPopover:x,borderRadius:J,colorHover:K,colorHoverModal:U,colorHoverPopover:G}}=R.value;return{"--n-font-size":i,"--n-bezier":s,"--n-text-color":z,"--n-color":t,"--n-border-radius":J,"--n-border-color":f,"--n-border-color-modal":N,"--n-border-color-popover":x,"--n-color-modal":d,"--n-color-popover":b,"--n-color-hover":K,"--n-color-hover-modal":U,"--n-color-hover-popover":G}}),r=g?A("list",void 0,C,o):void 0;return{mergedClsPrefix:u,rtlEnabled:$,cssVars:g?void 0:C,themeClass:r==null?void 0:r.themeClass,onRender:r==null?void 0:r.onRender}},render(){var o;const{$slots:u,mergedClsPrefix:g,onRender:a}=this;return a==null||a(),e("ul",{class:[`${g}-list`,this.rtlEnabled&&`${g}-list--rtl`,this.bordered&&`${g}-list--bordered`,this.showDivider&&`${g}-list--show-divider`,this.hoverable&&`${g}-list--hoverable`,this.clickable&&`${g}-list--clickable`,this.themeClass],style:this.cssVars},u.header?e("div",{class:`${g}-list__header`},u.header()):null,(o=u.default)===null||o===void 0?void 0:o.call(u),u.footer?e("div",{class:`${g}-list__footer`},u.footer()):null)}}),p=H({name:"ListItem",setup(){const o=re(q,null);return o||oe("list-item","`n-list-item` must be placed in `n-list`."),{showDivider:o.showDividerRef,mergedClsPrefix:o.mergedClsPrefixRef}},render(){const{$slots:o,mergedClsPrefix:u}=this;return e("li",{class:`${u}-list-item`},o.prefix?e("div",{class:`${u}-list-item__prefix`},o.prefix()):null,o.default?e("div",{class:`${u}-list-item__main`},o):null,o.suffix?e("div",{class:`${u}-list-item__suffix`},o.suffix()):null,this.showDivider&&e("div",{class:`${u}-list-item__divider`}))}}),xr=Q({props:{schema:{type:Object,default:[]},modelValue:{type:Object,default:{}}},setup:(o,{emit:u})=>{const g=D("Loading",()=>({}));g.value.Drawer=!1;const a=V({get:()=>o.modelValue,set:r=>u("update:modelValue",r)}),$=D("database"),R=te(),C=(r,s,i)=>{if(!ae(a.value,(s??"")+(i?"":l(o.schema,r.id)))||c(a.value,(s??"")+(i?"":l(o.schema,r.id)))===null){if(r.key==="updatedAt")return;switch(r.subType??r.type){case"boolean":return e(p,{},{prefix:()=>e(m,{text:!0},()=>e(n,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(M,{color:"red",borderRadius:50,size:18},()=>e(w,{size:16},()=>e(B)))});case"array":return e(p,{},{prefix:()=>e(m,{text:!0},()=>e(n,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(m,{circle:!0},{default:()=>e(n,{depth:3},{default:()=>"[--]"})})});case"object":return e(p,{},{prefix:()=>e(m,{text:!0},()=>e(n,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(m,{circle:!0},{default:()=>e(n,{depth:3},{default:()=>"{--}"})})});default:return e(p,{},{prefix:()=>e(m,{text:!0},()=>e(n,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(n,{depth:3},()=>"--")})}}(Array.isArray(r.type)&&r.type.includes("array")||typeof r.type=="string"&&r.type==="array")&&(r.type=r.children);let z=r.subType??r.type;switch(Array.isArray(z)&&(z=ie(r.subType??r.type,c(a.value,(s??"")+(i?"":l(o.schema,r.id)))).key),z){case"select":case"tags":return e(p,{},{prefix:()=>e(m,{text:!0},()=>e(n,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(T,()=>[].concat(c(a.value,(s??"")+(i?"":l(o.schema,r.id)))).map(t=>e(_,{round:!0,bordered:!1},()=>t)))});case"table":return e(p,{},{prefix:()=>e(m,{text:!0},()=>e(n,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(T,()=>[].concat(c(a.value,(s??"")+(i?"":l(o.schema,r.id)))).map(t=>e(m,{tag:"a",href:`/${R.params.database}/admin/tables/${r.table}/${t.id}`,onClick(d){d.preventDefault(),se(`/${R.params.database}/admin/tables/${r.table}/${t.id}`)},size:"small",round:!0},r.image?{icon:()=>e(w,()=>e(pe,{style:{width:"18px",height:"18px"},round:!0,src:[].concat(c(t,r.image)??[]).map(d=>d!=null&&d.includes("inicontent")&&["png","jpg","jpeg","ico","webp","svg","gif"].includes(d.split(".").pop()??"")?`${d}?fit=18`:d)[0]})),default:()=>{var d,b,f,N;return L((b=(d=$.value.tables)==null?void 0:d.find(({slug:x})=>x===r.table))==null?void 0:b.label,(N=(f=$.value.tables)==null?void 0:f.find(({slug:x})=>x===r.table))==null?void 0:N.schema,t)}}:{icon:()=>e(w,()=>e("span",{},r.key.charAt(0).toUpperCase())),default:()=>{var d,b,f,N;return L((b=(d=$.value.tables)==null?void 0:d.find(({slug:x})=>x===r.table))==null?void 0:b.label,(N=(f=$.value.tables)==null?void 0:f.find(({slug:x})=>x===r.table))==null?void 0:N.schema,t)}})))});case"upload":return e(p,{},{prefix:()=>e(m,{text:!0},()=>e(n,{strong:!0},()=>`${v(r.key)}: `)),default:()=>[].concat(c(a.value,(s??"")+(i?"":l(o.schema,r.id)))).length===1?[].concat(c(a.value,(s??"")+(i?"":l(o.schema,r.id)))).map(t=>["png","jpg","jpeg","ico","webp","svg","gif"].includes(t==null?void 0:t.split(".").pop())?e(F,{src:t!=null&&t.includes("inicontent")?`${t}?fit=32`:t,previewSrc:t,width:32}):e(w,()=>e(S))):e(ue,()=>e(T,{align:"center"},()=>[].concat(c(a.value,(s??"")+(i?"":l(o.schema,r.id)))).map(t=>["png","jpg","jpeg","ico","webp","svg","gif"].includes(t==null?void 0:t.split(".").pop())?e(F,{src:t!=null&&t.includes("inicontent")?`${t}?fit=32`:t,previewSrc:t,width:32}):e(w,()=>e(S)))))});case"date":return e(p,{},{prefix:()=>e(m,{text:!0},()=>e(n,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(ve,{},{trigger:()=>e(E,{time:Number(c(a.value,(s??"")+(i?"":l(o.schema,r.id))))}),default:()=>e(E,{time:Number(c(a.value,(s??"")+(i?"":l(o.schema,r.id)))),type:"relative"})})});case"html":return e(p,{},{prefix:()=>e(m,{text:!0},()=>e(n,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(n,{innerHTML:c(a.value,(s??"")+(i?"":l(o.schema,r.id)))??"--"})});case"boolean":return e(p,{},{prefix:()=>e(m,{text:!0},()=>e(n,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(M,{color:c(a.value,(s??"")+(i?"":l(o.schema,r.id)))?"green":"red",borderRadius:50,size:18},()=>e(w,{size:16},()=>e(c(a.value,(s??"")+(i?"":l(o.schema,r.id)))?ne:B)))});case"array":return e(p,{},{prefix:()=>e(m,{text:!0},()=>e(n,{strong:!0},()=>`${v(r.key)}: `)),default:()=>{var t;return(t=c(a.value,(s??"")+(i?"":l(o.schema,r.id)),[]))==null?void 0:t.map((d,b)=>e(p,{},{prefix:()=>e(n,{strong:!0},()=>b+1),default:()=>r.children.map(f=>C(f,`${(s??"")+(i?"":l(o.schema,r.id))}.${b}.${f.key}`,!0))}))}});case"object":return e(p,{},{prefix:()=>e(m,{text:!0},()=>e(n,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(T,{vertical:!0,size:0},()=>r.children.map(t=>C(t)))});case"email":return e(p,{},{prefix:()=>e(m,{text:!0},()=>e(n,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(k,{href:`mailto:${c(a.value,(s??"")+(i?"":l(o.schema,r.id)))}`,_target:"blank"},()=>c(a.value,(s??"")+(i?"":l(o.schema,r.id)))??"--")});case"color":return e(p,{},{prefix:()=>e(m,{text:!0},()=>e(n,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(_,{round:!0,style:{backgroundColor:c(a.value,(s??"")+(i?"":l(o.schema,r.id)))}},()=>e(n,{style:{mixBlendMode:"difference"}},()=>c(a.value,(s??"")+(i?"":l(o.schema,r.id)))))});case"url":return e(p,{},{prefix:()=>e(m,{text:!0},()=>e(n,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(k,{href:c(a.value,(s??"")+(i?"":l(o.schema,r.id)))??"#",_target:"blank"},()=>c(a.value,(s??"")+(i?"":l(o.schema,r.id)))??"--")});case"role":return e(p,{},{prefix:()=>e(m,{text:!0},()=>e(n,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(_,{round:!0},{default:()=>{var t,d;return v((d=(t=$.value.roles)==null?void 0:t.find(({id:b})=>b===c(a.value,(s??"")+(i?"":l(o.schema,r.id)))))==null?void 0:d.name)},icon:()=>e(w,()=>e(le))})});default:return e(p,{},{prefix:()=>e(m,{text:!0},()=>e(n,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(n,{style:{whiteSpace:"pre-line"},innerHTML:c(a.value,(s??"")+(i?"":l(o.schema,r.id)))??"--"})})}};return()=>e(me,{xScrollable:!0},()=>e(fe,{id:"PRINT_CONTENT",hoverable:!0,bordered:!0},()=>o==null?void 0:o.schema.map(r=>C(r))))}},"$zPFQFJ6Dus");export{xr as default};
