import{b$ as I,c0 as h,c9 as z,cb as $,cf as W,cE as X,ah as k,c1 as q,c2 as H,dP as Y,b2 as Z,bs as P,a6 as V,j as e,cd as A,aC as ee,cQ as re,f as oe,h as T,l as te,dO as ae,i as v,B as d,n as se}from"./DJ3poR1r.js";import{g as c}from"./Bv0uoQY_.js";import{r as D}from"./CKeXBSlP.js";import{b as ne,u as ie}from"./Dari_zsp.js";import{S as ce}from"./B2Sr3Fqg.js";import{B as u}from"./B2-hmQAT.js";import{I as L}from"./BukC1Z1d.js";import{I as le}from"./C8BwqYVx.js";import{N as B,a as S}from"./CsS13qyp.js";import{I as de}from"./Du0deBXa.js";import{N as E,a as ue}from"./BLStrOu9.js";import{I as M}from"./Conp7FAc.js";import{N as s}from"./C7bbxd-a.js";import{N as O}from"./D7VpyXNl.js";import{N as w}from"./BpQhQjHG.js";import{N as _}from"./DbPIObIq.js";import{N as j}from"./CCvUZWBQ.js";import{N as me}from"./Dq9O_LTn.js";import{N as ve}from"./BW6bV4Jj.js";import"./BwKcinET.js";import"./DEX-JLuS.js";import"./Bud7wgri.js";import"./CaOuiRnH.js";import"./DY_Cim6-.js";import"./BrWYrq9v.js";import"./DE_3aidq.js";import"./sglA049O.js";import"./rSNn_jNv.js";import"./Bk_rJcZu.js";import"./VNDdbXU3.js";const ge=I([h("list",`
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
 `,[z("show-divider",[h("list-item",[I("&:not(:last-child)",[$("divider",`
 background-color: var(--n-merged-border-color);
 `)])])]),z("clickable",[h("list-item",`
 cursor: pointer;
 `)]),z("bordered",`
 border: 1px solid var(--n-merged-border-color);
 border-radius: var(--n-border-radius);
 `),z("hoverable",[h("list-item",`
 border-radius: var(--n-border-radius);
 `,[I("&:hover",`
 background-color: var(--n-merged-color-hover);
 `,[$("divider",`
 background-color: transparent;
 `)])])]),z("bordered, hoverable",[h("list-item",`
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
 `)])]),W(h("list",`
 --n-merged-color-hover: var(--n-color-hover-modal);
 --n-merged-color: var(--n-color-modal);
 --n-merged-border-color: var(--n-border-color-modal);
 `)),X(h("list",`
 --n-merged-color-hover: var(--n-color-hover-popover);
 --n-merged-color: var(--n-color-popover);
 --n-merged-border-color: var(--n-border-color-popover);
 `))]),be=Object.assign(Object.assign({},H.props),{size:{type:String,default:"medium"},bordered:Boolean,clickable:Boolean,hoverable:Boolean,showDivider:{type:Boolean,default:!0}}),F=A("n-list"),pe=k({name:"List",props:be,setup(o){const{mergedClsPrefixRef:m,inlineThemeDisabled:b,mergedRtlRef:a}=q(o),y=ne("List",a,m),R=H("List","-list",ge,Y,o,m);Z(F,{showDividerRef:P(o,"showDivider"),mergedClsPrefixRef:m});const C=V(()=>{const{common:{cubicBezierEaseInOut:n},self:{fontSize:i,textColor:t,color:l,colorModal:p,colorPopover:f,borderColor:N,borderColorModal:x,borderColorPopover:K,borderRadius:Q,colorHover:U,colorHoverModal:G,colorHoverPopover:J}}=R.value;return{"--n-font-size":i,"--n-bezier":n,"--n-text-color":t,"--n-color":l,"--n-border-radius":Q,"--n-border-color":N,"--n-border-color-modal":x,"--n-border-color-popover":K,"--n-color-modal":p,"--n-color-popover":f,"--n-color-hover":U,"--n-color-hover-modal":G,"--n-color-hover-popover":J}}),r=b?ie("list",void 0,C,o):void 0;return{mergedClsPrefix:m,rtlEnabled:y,cssVars:b?void 0:C,themeClass:r==null?void 0:r.themeClass,onRender:r==null?void 0:r.onRender}},render(){var o;const{$slots:m,mergedClsPrefix:b,onRender:a}=this;return a==null||a(),e("ul",{class:[`${b}-list`,this.rtlEnabled&&`${b}-list--rtl`,this.bordered&&`${b}-list--bordered`,this.showDivider&&`${b}-list--show-divider`,this.hoverable&&`${b}-list--hoverable`,this.clickable&&`${b}-list--clickable`,this.themeClass],style:this.cssVars},m.header?e("div",{class:`${b}-list__header`},m.header()):null,(o=m.default)===null||o===void 0?void 0:o.call(m),m.footer?e("div",{class:`${b}-list__footer`},m.footer()):null)}}),g=k({name:"ListItem",setup(){const o=ee(F,null);return o||re("list-item","`n-list-item` must be placed in `n-list`."),{showDivider:o.showDividerRef,mergedClsPrefix:o.mergedClsPrefixRef}},render(){const{$slots:o,mergedClsPrefix:m}=this;return e("li",{class:`${m}-list-item`},o.prefix?e("div",{class:`${m}-list-item__prefix`},o.prefix()):null,o.default?e("div",{class:`${m}-list-item__main`},o):null,o.suffix?e("div",{class:`${m}-list-item__suffix`},o.suffix()):null,this.showDivider&&e("div",{class:`${m}-list-item__divider`}))}}),We=oe({props:{schema:{type:Object,default:[]},modelValue:{type:Object,default:{}}},setup:(o,{emit:m})=>{const b=T("Loading",()=>({}));b.value.Drawer=!1;const a=V({get:()=>o.modelValue,set:r=>m("update:modelValue",r)}),y=T("database"),R=te(),C=(r,n,i)=>{if(!ae(a.value,(n??"")+(i?"":c(o.schema,r.id)))){if(r.key==="updatedAt")return;switch(r.subType??r.type){case"boolean":return e(g,{},{prefix:()=>e(u,{text:!0},()=>e(s,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(O,{color:"red",borderRadius:50,size:18},()=>e(w,{size:16},()=>e(L)))});case"array":return e(g,{},{prefix:()=>e(u,{text:!0},()=>e(s,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(u,{circle:!0},{default:()=>e(s,{depth:3},{default:()=>"[--]"})})});case"object":return e(g,{},{prefix:()=>e(u,{text:!0},()=>e(s,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(u,{circle:!0},{default:()=>e(s,{depth:3},{default:()=>"{--}"})})});default:return e(g,{},{prefix:()=>e(u,{text:!0},()=>e(s,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(s,{depth:3},()=>"--")})}}switch(r.subType??r.type){case"select":case"tags":return e(g,{},{prefix:()=>e(u,{text:!0},()=>e(s,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(j,()=>[].concat(d(a.value,(n??"")+(i?"":c(o.schema,r.id)))).map(t=>e(_,{bordered:!1},()=>t)))});case"table":return e(g,{},{prefix:()=>e(u,{text:!0},()=>e(s,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(j,()=>[].concat(d(a.value,(n??"")+(i?"":c(o.schema,r.id)))).map(t=>e(u,{tag:"a",href:`/${R.params.database}/admin/tables/${r.table}/${t.id}`,onClick(l){l.preventDefault(),se(`/${R.params.database}/admin/tables/${r.table}/${t.id}`)},size:"small",round:!0},r.image?{icon:()=>e(w,()=>e(ve,{style:{width:"18px",height:"18px"},round:!0,src:[].concat(d(t,r.image)??[]).map(l=>l!=null&&l.includes("inicontent")&&["png","jpg","jpeg","ico","webp","svg","gif"].includes(l.split(".").pop()??"")?`${l}?fit=18`:l)[0]})),default:()=>{var l,p,f,N;return D((p=(l=y.value.tables)==null?void 0:l.find(({slug:x})=>x===r.table))==null?void 0:p.label,(N=(f=y.value.tables)==null?void 0:f.find(({slug:x})=>x===r.table))==null?void 0:N.schema,t)}}:{icon:()=>e(w,()=>e("span",{},r.key.charAt(0).toUpperCase())),default:()=>{var l,p,f,N;return D((p=(l=y.value.tables)==null?void 0:l.find(({slug:x})=>x===r.table))==null?void 0:p.label,(N=(f=y.value.tables)==null?void 0:f.find(({slug:x})=>x===r.table))==null?void 0:N.schema,t)}})))});case"upload":return e(g,{},{prefix:()=>e(u,{text:!0},()=>e(s,{strong:!0},()=>`${v(r.key)}: `)),default:()=>[].concat(d(a.value,(n??"")+(i?"":c(o.schema,r.id)))).length===1?[].concat(d(a.value,(n??"")+(i?"":c(o.schema,r.id)))).map(t=>["png","jpg","jpeg","ico","webp","svg","gif"].includes(t==null?void 0:t.split(".").pop())?e(E,{src:t!=null&&t.includes("inicontent")?`${t}?fit=32`:t,previewSrc:t,width:32}):e(w,()=>e(M))):e(ue,()=>e(j,{align:"center"},()=>[].concat(d(a.value,(n??"")+(i?"":c(o.schema,r.id)))).map(t=>["png","jpg","jpeg","ico","webp","svg","gif"].includes(t==null?void 0:t.split(".").pop())?e(E,{src:t!=null&&t.includes("inicontent")?`${t}?fit=32`:t,previewSrc:t,width:32}):e(w,()=>e(M)))))});case"date":return e(g,{},{prefix:()=>e(u,{text:!0},()=>e(s,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(me,{},{trigger:()=>e(S,{time:Number(d(a.value,(n??"")+(i?"":c(o.schema,r.id))))}),default:()=>e(S,{time:Number(d(a.value,(n??"")+(i?"":c(o.schema,r.id)))),type:"relative"})})});case"html":return e(g,{},{prefix:()=>e(u,{text:!0},()=>e(s,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(s,{innerHTML:d(a.value,(n??"")+(i?"":c(o.schema,r.id)))??"--"})});case"boolean":return e(g,{},{prefix:()=>e(u,{text:!0},()=>e(s,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(O,{color:d(a.value,(n??"")+(i?"":c(o.schema,r.id)))?"green":"red",borderRadius:50,size:18},()=>e(w,{size:16},()=>e(d(a.value,(n??"")+(i?"":c(o.schema,r.id)))?de:L)))});case"array":return e(g,{},{prefix:()=>e(u,{text:!0},()=>e(s,{strong:!0},()=>`${v(r.key)}: `)),default:()=>{var t;return(t=d(a.value,(n??"")+(i?"":c(o.schema,r.id)),[]))==null?void 0:t.map((l,p)=>e(g,{},{prefix:()=>e(s,{strong:!0},()=>p+1),default:()=>r.children.map(f=>C(f,`${(n??"")+(i?"":c(o.schema,r.id))}.${p}.${f.key}`,!0))}))}});case"object":return e(g,{},{prefix:()=>e(u,{text:!0},()=>e(s,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(j,{vertical:!0,size:0},()=>r.children.map(t=>C(t)))});case"email":return e(g,{},{prefix:()=>e(u,{text:!0},()=>e(s,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(B,{href:`mailto:${d(a.value,(n??"")+(i?"":c(o.schema,r.id)))}`,_target:"blank"},()=>d(a.value,(n??"")+(i?"":c(o.schema,r.id)))??"--")});case"color":return e(g,{},{prefix:()=>e(u,{text:!0},()=>e(s,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(_,{round:!0,style:{backgroundColor:d(a.value,(n??"")+(i?"":c(o.schema,r.id)))}},()=>e(s,{style:{mixBlendMode:"difference"}},()=>d(a.value,(n??"")+(i?"":c(o.schema,r.id)))))});case"url":return e(g,{},{prefix:()=>e(u,{text:!0},()=>e(s,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(B,{href:d(a.value,(n??"")+(i?"":c(o.schema,r.id)))??"#",_target:"blank"},()=>d(a.value,(n??"")+(i?"":c(o.schema,r.id)))??"--")});case"role":return e(g,{},{prefix:()=>e(u,{text:!0},()=>e(s,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(_,{round:!0},{default:()=>{var t,l;return v((l=(t=y.value.roles)==null?void 0:t.find(({id:p})=>p===d(a.value,(n??"")+(i?"":c(o.schema,r.id)))))==null?void 0:l.name)},icon:()=>e(w,()=>e(le))})});default:return e(g,{},{prefix:()=>e(u,{text:!0},()=>e(s,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(s,{style:{whiteSpace:"pre-line"},innerHTML:d(a.value,(n??"")+(i?"":c(o.schema,r.id)))??"--"})})}};return()=>e(ce,{xScrollable:!0},()=>e(pe,{id:"PRINT_CONTENT",hoverable:!0,bordered:!0},()=>o==null?void 0:o.schema.map(r=>C(r))))}},"$zPFQFJ6Dus");export{We as default};
