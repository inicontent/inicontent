import{d as G}from"./HxAx17ok.js";import{bV as I,bW as h,c3 as C,c5 as $,ca as J,cy as Q,f as V,bX as Y,bY as H,dN as Z,a$ as P,bp as A,a7 as O,s as e,c7 as ee,aA as re,cx as oe,g as T,k as te,dK as ae,q as v,dj as d,n as se}from"./BGV9FyjN.js";import{g as l}from"./DBmvlWwy.js";import{r as D}from"./CNX1c_wK.js";import{b as ne,u as ie}from"./Cp2dohlU.js";import{S as le}from"./Dye08h5v.js";import{B as u}from"./B2NL4HPj.js";import{N as L}from"./D4auPh4j.js";import{I as B}from"./BHU3_TlV.js";import{I as ce}from"./BCK7ecAt.js";import{N as S,a as M}from"./bjyvsoVc.js";import{I as de}from"./Bx2XNHa_.js";import{N as k,a as ue}from"./BOPkXU8h.js";import{I as E}from"./DaNNPyl3.js";import{N as s}from"./m3T4YM6h.js";import{N as w}from"./BUq46F_b.js";import{N as _}from"./CP-jx7H5.js";import{N as j}from"./BP9k6SVK.js";import{N as me}from"./RVfKK735.js";import{N as ve}from"./B3OzMg1t.js";import"./DiwTAkPm.js";import"./BBsm-Pzt.js";import"./Dxw9S0O-.js";import"./Cb5ufXnC.js";import"./C2KUxeHG.js";import"./nPiHzMwB.js";import"./CRQ17Mct.js";import"./1V60d7DU.js";import"./C2161hUv.js";import"./BIN9fJOs.js";import"./Bk_rJcZu.js";const ge=I([h("list",`
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
 `,[C("show-divider",[h("list-item",[I("&:not(:last-child)",[$("divider",`
 background-color: var(--n-merged-border-color);
 `)])])]),C("clickable",[h("list-item",`
 cursor: pointer;
 `)]),C("bordered",`
 border: 1px solid var(--n-merged-border-color);
 border-radius: var(--n-border-radius);
 `),C("hoverable",[h("list-item",`
 border-radius: var(--n-border-radius);
 `,[I("&:hover",`
 background-color: var(--n-merged-color-hover);
 `,[$("divider",`
 background-color: transparent;
 `)])])]),C("bordered, hoverable",[h("list-item",`
 padding: 12px 20px;
 `),$("header, footer",`
 padding: 12px 20px;
 `)]),$("header, footer",`
 padding: 12px 0;
 box-sizing: border-box;
 transition: border-color .3s var(--n-bezier);
 `,[I("&:not(:last-child)",`
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
 `,[$("prefix",`
 margin-right: 20px;
 flex: 0;
 `),$("suffix",`
 margin-left: 20px;
 flex: 0;
 `),$("main",`
 flex: 1;
 `),$("divider",`
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
 `))]),be=Object.assign(Object.assign({},H.props),{size:{type:String,default:"medium"},bordered:Boolean,clickable:Boolean,hoverable:Boolean,showDivider:{type:Boolean,default:!0}}),F=ee("n-list"),pe=V({name:"List",props:be,setup(o){const{mergedClsPrefixRef:m,inlineThemeDisabled:b,mergedRtlRef:a}=Y(o),y=ne("List",a,m),R=H("List","-list",ge,Z,o,m);P(F,{showDividerRef:A(o,"showDivider"),mergedClsPrefixRef:m});const z=O(()=>{const{common:{cubicBezierEaseInOut:n},self:{fontSize:i,textColor:t,color:c,colorModal:p,colorPopover:f,borderColor:N,borderColorModal:x,borderColorPopover:K,borderRadius:U,colorHover:W,colorHoverModal:X,colorHoverPopover:q}}=R.value;return{"--n-font-size":i,"--n-bezier":n,"--n-text-color":t,"--n-color":c,"--n-border-radius":U,"--n-border-color":N,"--n-border-color-modal":x,"--n-border-color-popover":K,"--n-color-modal":p,"--n-color-popover":f,"--n-color-hover":W,"--n-color-hover-modal":X,"--n-color-hover-popover":q}}),r=b?ie("list",void 0,z,o):void 0;return{mergedClsPrefix:m,rtlEnabled:y,cssVars:b?void 0:z,themeClass:r==null?void 0:r.themeClass,onRender:r==null?void 0:r.onRender}},render(){var o;const{$slots:m,mergedClsPrefix:b,onRender:a}=this;return a==null||a(),e("ul",{class:[`${b}-list`,this.rtlEnabled&&`${b}-list--rtl`,this.bordered&&`${b}-list--bordered`,this.showDivider&&`${b}-list--show-divider`,this.hoverable&&`${b}-list--hoverable`,this.clickable&&`${b}-list--clickable`,this.themeClass],style:this.cssVars},m.header?e("div",{class:`${b}-list__header`},m.header()):null,(o=m.default)===null||o===void 0?void 0:o.call(m),m.footer?e("div",{class:`${b}-list__footer`},m.footer()):null)}}),g=V({name:"ListItem",setup(){const o=re(F,null);return o||oe("list-item","`n-list-item` must be placed in `n-list`."),{showDivider:o.showDividerRef,mergedClsPrefix:o.mergedClsPrefixRef}},render(){const{$slots:o,mergedClsPrefix:m}=this;return e("li",{class:`${m}-list-item`},o.prefix?e("div",{class:`${m}-list-item__prefix`},o.prefix()):null,o.default?e("div",{class:`${m}-list-item__main`},o):null,o.suffix?e("div",{class:`${m}-list-item__suffix`},o.suffix()):null,this.showDivider&&e("div",{class:`${m}-list-item__divider`}))}}),Je=G({props:{schema:{type:Object,default:[]},modelValue:{type:Object,default:{}}},setup:(o,{emit:m})=>{const b=T("Loading",()=>({}));b.value.Drawer=!1;const a=O({get:()=>o.modelValue,set:r=>m("update:modelValue",r)}),y=T("database"),R=te(),z=(r,n,i)=>{if(!ae(a.value,(n??"")+(i?"":l(o.schema,r.id)))){if(r.key==="updatedAt")return;switch(r.subType??r.type){case"boolean":return e(g,{},{prefix:()=>e(u,{text:!0},()=>e(s,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(L,{color:"red",borderRadius:50,size:18},()=>e(w,{size:16},()=>e(B)))});case"array":return e(g,{},{prefix:()=>e(u,{text:!0},()=>e(s,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(u,{circle:!0},{default:()=>e(s,{depth:3},{default:()=>"[--]"})})});case"object":return e(g,{},{prefix:()=>e(u,{text:!0},()=>e(s,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(u,{circle:!0},{default:()=>e(s,{depth:3},{default:()=>"{--}"})})});default:return e(g,{},{prefix:()=>e(u,{text:!0},()=>e(s,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(s,{depth:3},()=>"--")})}}switch(r.subType??r.type){case"select":case"tags":return e(g,{},{prefix:()=>e(u,{text:!0},()=>e(s,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(j,()=>[].concat(d(a.value,(n??"")+(i?"":l(o.schema,r.id)))).map(t=>e(_,{bordered:!1},()=>t)))});case"table":return e(g,{},{prefix:()=>e(u,{text:!0},()=>e(s,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(j,()=>[].concat(d(a.value,(n??"")+(i?"":l(o.schema,r.id)))).map(t=>e(u,{tag:"a",href:`/${R.params.database}/admin/tables/${r.table}/${t.id}`,onClick(c){c.preventDefault(),se(`/${R.params.database}/admin/tables/${r.table}/${t.id}`)},size:"small",round:!0},r.image?{icon:()=>e(w,()=>e(ve,{style:{width:"18px",height:"18px"},round:!0,src:[].concat(d(t,r.image)??[]).map(c=>c!=null&&c.includes("inicontent")&&["png","jpg","jpeg","ico","webp","svg","gif"].includes(c.split(".").pop()??"")?`${c}?fit=18`:c)[0]})),default:()=>{var c,p,f,N;return D((p=(c=y.value.tables)==null?void 0:c.find(({slug:x})=>x===r.table))==null?void 0:p.label,(N=(f=y.value.tables)==null?void 0:f.find(({slug:x})=>x===r.table))==null?void 0:N.schema,t)}}:{icon:()=>e(w,()=>e("span",{},r.key.charAt(0).toUpperCase())),default:()=>{var c,p,f,N;return D((p=(c=y.value.tables)==null?void 0:c.find(({slug:x})=>x===r.table))==null?void 0:p.label,(N=(f=y.value.tables)==null?void 0:f.find(({slug:x})=>x===r.table))==null?void 0:N.schema,t)}})))});case"upload":return e(g,{},{prefix:()=>e(u,{text:!0},()=>e(s,{strong:!0},()=>`${v(r.key)}: `)),default:()=>[].concat(d(a.value,(n??"")+(i?"":l(o.schema,r.id)))).length===1?[].concat(d(a.value,(n??"")+(i?"":l(o.schema,r.id)))).map(t=>["png","jpg","jpeg","ico","webp","svg","gif"].includes(t==null?void 0:t.split(".").pop())?e(k,{src:t!=null&&t.includes("inicontent")?`${t}?fit=32`:t,previewSrc:t,width:32}):e(w,()=>e(E))):e(ue,()=>e(j,{align:"center"},()=>[].concat(d(a.value,(n??"")+(i?"":l(o.schema,r.id)))).map(t=>["png","jpg","jpeg","ico","webp","svg","gif"].includes(t==null?void 0:t.split(".").pop())?e(k,{src:t!=null&&t.includes("inicontent")?`${t}?fit=32`:t,previewSrc:t,width:32}):e(w,()=>e(E)))))});case"date":return e(g,{},{prefix:()=>e(u,{text:!0},()=>e(s,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(me,{},{trigger:()=>e(M,{time:Number(d(a.value,(n??"")+(i?"":l(o.schema,r.id))))}),default:()=>e(M,{time:Number(d(a.value,(n??"")+(i?"":l(o.schema,r.id)))),type:"relative"})})});case"html":return e(g,{},{prefix:()=>e(u,{text:!0},()=>e(s,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(s,{innerHTML:d(a.value,(n??"")+(i?"":l(o.schema,r.id)))??"--"})});case"boolean":return e(g,{},{prefix:()=>e(u,{text:!0},()=>e(s,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(L,{color:d(a.value,(n??"")+(i?"":l(o.schema,r.id)))?"green":"red",borderRadius:50,size:18},()=>e(w,{size:16},()=>e(d(a.value,(n??"")+(i?"":l(o.schema,r.id)))?de:B)))});case"array":return e(g,{},{prefix:()=>e(u,{text:!0},()=>e(s,{strong:!0},()=>`${v(r.key)}: `)),default:()=>{var t;return(t=d(a.value,(n??"")+(i?"":l(o.schema,r.id)),[]))==null?void 0:t.map((c,p)=>e(g,{},{prefix:()=>e(s,{strong:!0},()=>p+1),default:()=>r.children.map(f=>z(f,`${(n??"")+(i?"":l(o.schema,r.id))}.${p}.${f.key}`,!0))}))}});case"object":return e(g,{},{prefix:()=>e(u,{text:!0},()=>e(s,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(j,{vertical:!0,size:0},()=>r.children.map(t=>z(t)))});case"email":return e(g,{},{prefix:()=>e(u,{text:!0},()=>e(s,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(S,{href:`mailto:${d(a.value,(n??"")+(i?"":l(o.schema,r.id)))}`,_target:"blank"},()=>d(a.value,(n??"")+(i?"":l(o.schema,r.id)))??"--")});case"color":return e(g,{},{prefix:()=>e(u,{text:!0},()=>e(s,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(_,{round:!0,style:{backgroundColor:d(a.value,(n??"")+(i?"":l(o.schema,r.id)))}},()=>e(s,{style:{mixBlendMode:"difference"}},()=>d(a.value,(n??"")+(i?"":l(o.schema,r.id)))))});case"url":return e(g,{},{prefix:()=>e(u,{text:!0},()=>e(s,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(S,{href:d(a.value,(n??"")+(i?"":l(o.schema,r.id)))??"#",_target:"blank"},()=>d(a.value,(n??"")+(i?"":l(o.schema,r.id)))??"--")});case"role":return e(g,{},{prefix:()=>e(u,{text:!0},()=>e(s,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(_,{round:!0},{default:()=>{var t,c;return v((c=(t=y.value.roles)==null?void 0:t.find(({id:p})=>p===d(a.value,(n??"")+(i?"":l(o.schema,r.id)))))==null?void 0:c.name)},icon:()=>e(w,()=>e(ce))})});default:return e(g,{},{prefix:()=>e(u,{text:!0},()=>e(s,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(s,{style:{whiteSpace:"pre-line"},innerHTML:d(a.value,(n??"")+(i?"":l(o.schema,r.id)))??"--"})})}};return()=>e(le,{xScrollable:!0},()=>e(pe,{id:"PRINT_CONTENT",hoverable:!0,bordered:!0},()=>o==null?void 0:o.schema.map(r=>z(r))))}},"$zPFQFJ6Dus");export{Je as default};
