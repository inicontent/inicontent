import{d as G}from"./Bj3SUfU5.js";import{bW as T,bX as h,c4 as R,c6 as y,cb as J,cw as Q,f as H,bY as Y,bZ as O,dN as Z,b0 as P,bq as A,D as V,B as e,c8 as ee,aA as re,cv as oe,g as D,k as te,dK as ae,di as l,q as v,n as se}from"./BxjnDFbc.js";import{g as c}from"./BSrfsba_.js";import{g as ne}from"./D6hn_wsC.js";import{r as L}from"./0m0OiX_K.js";import{b as ie,u as ce}from"./DMIDmvrD.js";import{S as le}from"./CnbzmUBr.js";import{B as u}from"./SpPUOlij.js";import{N as B}from"./oOvE8my2.js";import{I as S}from"./Dbmk8-IU.js";import{I as de}from"./BQfxHW77.js";import{N as k,a as M}from"./Sz5rPdz8.js";import{I as ue}from"./iOjRb_k1.js";import{N as E,a as me}from"./Bx60_58U.js";import{I as F}from"./DP7egRUb.js";import{N as i}from"./no-toT8l.js";import{N as w}from"./BQvfa85F.js";import{N as j}from"./B3jDIMh4.js";import{N as _}from"./DiitZ3fM.js";import{N as ve}from"./WpXNomnu.js";import{N as ge}from"./DIvfCY4H.js";import"./DL4KdB5o.js";import"./C8wR1Y1M.js";import"./CNubMyRl.js";import"./BezlUg_L.js";import"./C7oM8ktG.js";import"./D2eVXTI9.js";import"./ZpWdN2Iy.js";import"./BzcuLD3P.js";import"./CrDtGidf.js";import"./BAacIP8C.js";import"./DHE-aM53.js";import"./C2161hUv.js";import"./CH9LAfVN.js";import"./Bk_rJcZu.js";import"./C1usR7LY.js";const pe=T([h("list",`
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
 `,[R("show-divider",[h("list-item",[T("&:not(:last-child)",[y("divider",`
 background-color: var(--n-merged-border-color);
 `)])])]),R("clickable",[h("list-item",`
 cursor: pointer;
 `)]),R("bordered",`
 border: 1px solid var(--n-merged-border-color);
 border-radius: var(--n-border-radius);
 `),R("hoverable",[h("list-item",`
 border-radius: var(--n-border-radius);
 `,[T("&:hover",`
 background-color: var(--n-merged-color-hover);
 `,[y("divider",`
 background-color: transparent;
 `)])])]),R("bordered, hoverable",[h("list-item",`
 padding: 12px 20px;
 `),y("header, footer",`
 padding: 12px 20px;
 `)]),y("header, footer",`
 padding: 12px 0;
 box-sizing: border-box;
 transition: border-color .3s var(--n-bezier);
 `,[T("&:not(:last-child)",`
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
 `)])]),J(h("list",`
 --n-merged-color-hover: var(--n-color-hover-modal);
 --n-merged-color: var(--n-color-modal);
 --n-merged-border-color: var(--n-border-color-modal);
 `)),Q(h("list",`
 --n-merged-color-hover: var(--n-color-hover-popover);
 --n-merged-color: var(--n-color-popover);
 --n-merged-border-color: var(--n-border-color-popover);
 `))]),be=Object.assign(Object.assign({},O.props),{size:{type:String,default:"medium"},bordered:Boolean,clickable:Boolean,hoverable:Boolean,showDivider:{type:Boolean,default:!0}}),K=ee("n-list"),fe=H({name:"List",props:be,setup(o){const{mergedClsPrefixRef:m,inlineThemeDisabled:p,mergedRtlRef:a}=Y(o),$=ie("List",a,m),I=O("List","-list",pe,Z,o,m);P(K,{showDividerRef:A(o,"showDivider"),mergedClsPrefixRef:m});const z=V(()=>{const{common:{cubicBezierEaseInOut:s},self:{fontSize:n,textColor:C,color:t,colorModal:d,colorPopover:b,borderColor:f,borderColorModal:N,borderColorPopover:x,borderRadius:q,colorHover:U,colorHoverModal:W,colorHoverPopover:X}}=I.value;return{"--n-font-size":n,"--n-bezier":s,"--n-text-color":C,"--n-color":t,"--n-border-radius":q,"--n-border-color":f,"--n-border-color-modal":N,"--n-border-color-popover":x,"--n-color-modal":d,"--n-color-popover":b,"--n-color-hover":U,"--n-color-hover-modal":W,"--n-color-hover-popover":X}}),r=p?ce("list",void 0,z,o):void 0;return{mergedClsPrefix:m,rtlEnabled:$,cssVars:p?void 0:z,themeClass:r==null?void 0:r.themeClass,onRender:r==null?void 0:r.onRender}},render(){var o;const{$slots:m,mergedClsPrefix:p,onRender:a}=this;return a==null||a(),e("ul",{class:[`${p}-list`,this.rtlEnabled&&`${p}-list--rtl`,this.bordered&&`${p}-list--bordered`,this.showDivider&&`${p}-list--show-divider`,this.hoverable&&`${p}-list--hoverable`,this.clickable&&`${p}-list--clickable`,this.themeClass],style:this.cssVars},m.header?e("div",{class:`${p}-list__header`},m.header()):null,(o=m.default)===null||o===void 0?void 0:o.call(m),m.footer?e("div",{class:`${p}-list__footer`},m.footer()):null)}}),g=H({name:"ListItem",setup(){const o=re(K,null);return o||oe("list-item","`n-list-item` must be placed in `n-list`."),{showDivider:o.showDividerRef,mergedClsPrefix:o.mergedClsPrefixRef}},render(){const{$slots:o,mergedClsPrefix:m}=this;return e("li",{class:`${m}-list-item`},o.prefix?e("div",{class:`${m}-list-item__prefix`},o.prefix()):null,o.default?e("div",{class:`${m}-list-item__main`},o):null,o.suffix?e("div",{class:`${m}-list-item__suffix`},o.suffix()):null,this.showDivider&&e("div",{class:`${m}-list-item__divider`}))}}),er=G({props:{schema:{type:Object,default:[]},modelValue:{type:Object,default:{}}},setup:(o,{emit:m})=>{const p=D("Loading",()=>({}));p.value.Drawer=!1;const a=V({get:()=>o.modelValue,set:r=>m("update:modelValue",r)}),$=D("database"),I=te(),z=(r,s,n)=>{if(!ae(a.value,(s??"")+(n?"":c(o.schema,r.id)))||l(a.value,(s??"")+(n?"":c(o.schema,r.id)))===null){if(r.key==="updatedAt")return;switch(r.subType??r.type){case"boolean":return e(g,{},{prefix:()=>e(u,{text:!0},()=>e(i,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(B,{color:"red",borderRadius:50,size:18},()=>e(w,{size:16},()=>e(S)))});case"array":return e(g,{},{prefix:()=>e(u,{text:!0},()=>e(i,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(u,{circle:!0},{default:()=>e(i,{depth:3},{default:()=>"[--]"})})});case"object":return e(g,{},{prefix:()=>e(u,{text:!0},()=>e(i,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(u,{circle:!0},{default:()=>e(i,{depth:3},{default:()=>"{--}"})})});default:return e(g,{},{prefix:()=>e(u,{text:!0},()=>e(i,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(i,{depth:3},()=>"--")})}}(Array.isArray(r.type)&&r.type.includes("array")||typeof r.type=="string"&&r.type==="array")&&(r.type=r.children);let C=r.subType??r.type;switch(Array.isArray(C)&&(C=ne(r.subType??r.type,l(a.value,(s??"")+(n?"":c(o.schema,r.id)))).key),C){case"select":case"tags":return e(g,{},{prefix:()=>e(u,{text:!0},()=>e(i,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(_,()=>[].concat(l(a.value,(s??"")+(n?"":c(o.schema,r.id)))).map(t=>e(j,{round:!0,bordered:!1},()=>t)))});case"table":return e(g,{},{prefix:()=>e(u,{text:!0},()=>e(i,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(_,()=>[].concat(l(a.value,(s??"")+(n?"":c(o.schema,r.id)))).map(t=>e(u,{tag:"a",href:`/${I.params.database}/admin/tables/${r.table}/${t.id}`,onClick(d){d.preventDefault(),se(`/${I.params.database}/admin/tables/${r.table}/${t.id}`)},size:"small",round:!0},r.image?{icon:()=>e(w,()=>e(ge,{style:{width:"18px",height:"18px"},round:!0,src:[].concat(l(t,r.image)??[]).map(d=>d!=null&&d.includes("inicontent")&&["png","jpg","jpeg","ico","webp","svg","gif"].includes(d.split(".").pop()??"")?`${d}?fit=18`:d)[0]})),default:()=>{var d,b,f,N;return L((b=(d=$.value.tables)==null?void 0:d.find(({slug:x})=>x===r.table))==null?void 0:b.label,(N=(f=$.value.tables)==null?void 0:f.find(({slug:x})=>x===r.table))==null?void 0:N.schema,t)}}:{icon:()=>e(w,()=>e("span",{},r.key.charAt(0).toUpperCase())),default:()=>{var d,b,f,N;return L((b=(d=$.value.tables)==null?void 0:d.find(({slug:x})=>x===r.table))==null?void 0:b.label,(N=(f=$.value.tables)==null?void 0:f.find(({slug:x})=>x===r.table))==null?void 0:N.schema,t)}})))});case"upload":return e(g,{},{prefix:()=>e(u,{text:!0},()=>e(i,{strong:!0},()=>`${v(r.key)}: `)),default:()=>[].concat(l(a.value,(s??"")+(n?"":c(o.schema,r.id)))).length===1?[].concat(l(a.value,(s??"")+(n?"":c(o.schema,r.id)))).map(t=>["png","jpg","jpeg","ico","webp","svg","gif"].includes(t==null?void 0:t.split(".").pop())?e(E,{src:t!=null&&t.includes("inicontent")?`${t}?fit=32`:t,previewSrc:t,width:32}):e(w,()=>e(F))):e(me,()=>e(_,{align:"center"},()=>[].concat(l(a.value,(s??"")+(n?"":c(o.schema,r.id)))).map(t=>["png","jpg","jpeg","ico","webp","svg","gif"].includes(t==null?void 0:t.split(".").pop())?e(E,{src:t!=null&&t.includes("inicontent")?`${t}?fit=32`:t,previewSrc:t,width:32}):e(w,()=>e(F)))))});case"date":return e(g,{},{prefix:()=>e(u,{text:!0},()=>e(i,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(ve,{},{trigger:()=>e(M,{time:Number(l(a.value,(s??"")+(n?"":c(o.schema,r.id))))}),default:()=>e(M,{time:Number(l(a.value,(s??"")+(n?"":c(o.schema,r.id)))),type:"relative"})})});case"html":return e(g,{},{prefix:()=>e(u,{text:!0},()=>e(i,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(i,{innerHTML:l(a.value,(s??"")+(n?"":c(o.schema,r.id)))??"--"})});case"boolean":return e(g,{},{prefix:()=>e(u,{text:!0},()=>e(i,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(B,{color:l(a.value,(s??"")+(n?"":c(o.schema,r.id)))?"green":"red",borderRadius:50,size:18},()=>e(w,{size:16},()=>e(l(a.value,(s??"")+(n?"":c(o.schema,r.id)))?ue:S)))});case"array":return e(g,{},{prefix:()=>e(u,{text:!0},()=>e(i,{strong:!0},()=>`${v(r.key)}: `)),default:()=>{var t;return(t=l(a.value,(s??"")+(n?"":c(o.schema,r.id)),[]))==null?void 0:t.map((d,b)=>e(g,{},{prefix:()=>e(i,{strong:!0},()=>b+1),default:()=>r.children.map(f=>z(f,`${(s??"")+(n?"":c(o.schema,r.id))}.${b}.${f.key}`,!0))}))}});case"object":return e(g,{},{prefix:()=>e(u,{text:!0},()=>e(i,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(_,{vertical:!0,size:0},()=>r.children.map(t=>z(t)))});case"email":return e(g,{},{prefix:()=>e(u,{text:!0},()=>e(i,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(k,{href:`mailto:${l(a.value,(s??"")+(n?"":c(o.schema,r.id)))}`,_target:"blank"},()=>l(a.value,(s??"")+(n?"":c(o.schema,r.id)))??"--")});case"color":return e(g,{},{prefix:()=>e(u,{text:!0},()=>e(i,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(j,{round:!0,style:{backgroundColor:l(a.value,(s??"")+(n?"":c(o.schema,r.id)))}},()=>e(i,{style:{mixBlendMode:"difference"}},()=>l(a.value,(s??"")+(n?"":c(o.schema,r.id)))))});case"url":return e(g,{},{prefix:()=>e(u,{text:!0},()=>e(i,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(k,{href:l(a.value,(s??"")+(n?"":c(o.schema,r.id)))??"#",_target:"blank"},()=>l(a.value,(s??"")+(n?"":c(o.schema,r.id)))??"--")});case"role":return e(g,{},{prefix:()=>e(u,{text:!0},()=>e(i,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(j,{round:!0},{default:()=>{var t,d;return v((d=(t=$.value.roles)==null?void 0:t.find(({id:b})=>b===l(a.value,(s??"")+(n?"":c(o.schema,r.id)))))==null?void 0:d.name)},icon:()=>e(w,()=>e(de))})});default:return e(g,{},{prefix:()=>e(u,{text:!0},()=>e(i,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(i,{style:{whiteSpace:"pre-line"},innerHTML:l(a.value,(s??"")+(n?"":c(o.schema,r.id)))??"--"})})}};return()=>e(le,{xScrollable:!0},()=>e(fe,{id:"PRINT_CONTENT",hoverable:!0,bordered:!0},()=>o==null?void 0:o.schema.map(r=>z(r))))}},"$zPFQFJ6Dus");export{er as default};
