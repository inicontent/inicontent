import{c0 as I,c1 as h,c9 as z,cb as $,cf as W,cD as X,ai as k,c2 as q,c3 as H,dP as Y,b3 as Z,bt as P,a7 as V,j as e,cd as A,aD as ee,cP as re,f as oe,h as D,l as te,dO as ae,i as v,B as d,n as se}from"./DxYE6dkH.js";import{g as c}from"./CpF_D_0r.js";import{r as T}from"./CVUimVdr.js";import{b as ne,u as ie}from"./C-zkL6WC.js";import{S as ce}from"./C3CVEywo.js";import{B as u}from"./C2X-Asp5.js";import{I as L}from"./1UZO03vj.js";import{I as le}from"./BSa4uRhb.js";import{I as de}from"./CcamXvRW.js";import{I as B}from"./BbCocxBt.js";import{N as s}from"./BQmTNSJi.js";import{N as S}from"./8z7PgcPd.js";import{N as w}from"./BaWwQizc.js";import{N as j}from"./DPoj8CAe.js";import{a as M,N as E}from"./B87N7kbX.js";import{N as _}from"./DFwGYNeT.js";import{N as ue}from"./B4ydWbZW.js";import{N as O,a as me}from"./BkES3xdl.js";import{N as ve}from"./B_hx2C1D.js";import"./CvCi50gL.js";import"./wZRUUBto.js";import"./DHpXk8Vj.js";import"./BJ0x9kYI.js";import"./BXb9pR5Z.js";import"./Bk_rJcZu.js";import"./8m7y4lsc.js";import"./CefJBc2S.js";import"./CF1pviv9.js";import"./BCsQREDg.js";import"./sglA049O.js";const ge=I([h("list",`
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
 `))]),be=Object.assign(Object.assign({},H.props),{size:{type:String,default:"medium"},bordered:Boolean,clickable:Boolean,hoverable:Boolean,showDivider:{type:Boolean,default:!0}}),F=A("n-list"),pe=k({name:"List",props:be,setup(o){const{mergedClsPrefixRef:m,inlineThemeDisabled:b,mergedRtlRef:a}=q(o),y=ne("List",a,m),R=H("List","-list",ge,Y,o,m);Z(F,{showDividerRef:P(o,"showDivider"),mergedClsPrefixRef:m});const C=V(()=>{const{common:{cubicBezierEaseInOut:n},self:{fontSize:i,textColor:t,color:l,colorModal:p,colorPopover:f,borderColor:N,borderColorModal:x,borderColorPopover:K,borderRadius:U,colorHover:G,colorHoverModal:J,colorHoverPopover:Q}}=R.value;return{"--n-font-size":i,"--n-bezier":n,"--n-text-color":t,"--n-color":l,"--n-border-radius":U,"--n-border-color":N,"--n-border-color-modal":x,"--n-border-color-popover":K,"--n-color-modal":p,"--n-color-popover":f,"--n-color-hover":G,"--n-color-hover-modal":J,"--n-color-hover-popover":Q}}),r=b?ie("list",void 0,C,o):void 0;return{mergedClsPrefix:m,rtlEnabled:y,cssVars:b?void 0:C,themeClass:r==null?void 0:r.themeClass,onRender:r==null?void 0:r.onRender}},render(){var o;const{$slots:m,mergedClsPrefix:b,onRender:a}=this;return a==null||a(),e("ul",{class:[`${b}-list`,this.rtlEnabled&&`${b}-list--rtl`,this.bordered&&`${b}-list--bordered`,this.showDivider&&`${b}-list--show-divider`,this.hoverable&&`${b}-list--hoverable`,this.clickable&&`${b}-list--clickable`,this.themeClass],style:this.cssVars},m.header?e("div",{class:`${b}-list__header`},m.header()):null,(o=m.default)===null||o===void 0?void 0:o.call(m),m.footer?e("div",{class:`${b}-list__footer`},m.footer()):null)}}),g=k({name:"ListItem",setup(){const o=ee(F,null);return o||re("list-item","`n-list-item` must be placed in `n-list`."),{showDivider:o.showDividerRef,mergedClsPrefix:o.mergedClsPrefixRef}},render(){const{$slots:o,mergedClsPrefix:m}=this;return e("li",{class:`${m}-list-item`},o.prefix?e("div",{class:`${m}-list-item__prefix`},o.prefix()):null,o.default?e("div",{class:`${m}-list-item__main`},o):null,o.suffix?e("div",{class:`${m}-list-item__suffix`},o.suffix()):null,this.showDivider&&e("div",{class:`${m}-list-item__divider`}))}}),We=oe({props:{schema:{type:Object,default:[]},modelValue:{type:Object,default:{}}},setup:(o,{emit:m})=>{const b=D("Loading",()=>({}));b.value.Drawer=!1;const a=V({get:()=>o.modelValue,set:r=>m("update:modelValue",r)}),y=D("database"),R=te(),C=(r,n,i)=>{if(!ae(a.value,(n??"")+(i?"":c(o.schema,r.id)))){if(r.key==="updatedAt")return;switch(r.subType??r.type){case"boolean":return e(g,{},{prefix:()=>e(u,{text:!0},()=>e(s,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(S,{color:"red",borderRadius:50,size:18},()=>e(w,{size:16},()=>e(L)))});case"array":return e(g,{},{prefix:()=>e(u,{text:!0},()=>e(s,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(u,{circle:!0},{default:()=>e(s,{depth:3},{default:()=>"[--]"})})});case"object":return e(g,{},{prefix:()=>e(u,{text:!0},()=>e(s,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(u,{circle:!0},{default:()=>e(s,{depth:3},{default:()=>"{--}"})})});default:return e(g,{},{prefix:()=>e(u,{text:!0},()=>e(s,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(s,{depth:3},()=>"--")})}}switch(r.subType??r.type){case"select":case"tags":return e(g,{},{prefix:()=>e(u,{text:!0},()=>e(s,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(_,()=>[].concat(d(a.value,(n??"")+(i?"":c(o.schema,r.id)))).map(t=>e(j,{bordered:!1},()=>t)))});case"table":return e(g,{},{prefix:()=>e(u,{text:!0},()=>e(s,{strong:!0},()=>`${v(r.key)}: `)),default:()=>[].concat(d(a.value,(n??"")+(i?"":c(o.schema,r.id)))).map(t=>e(u,{tag:"a",href:`/${R.params.database}/admin/tables/${r.table}/${t.id}`,onClick(l){l.preventDefault(),se(`/${R.params.database}/admin/tables/${r.table}/${t.id}`)},size:"small",round:!0},r.image?{icon:()=>e(w,()=>e(ve,{style:{width:"18px",height:"18px"},round:!0,src:[].concat(d(t,r.image)??[]).map(l=>l!=null&&l.includes("inicontent")&&["png","jpg","jpeg","ico","webp","svg","gif"].includes(l.split(".").pop()??"")?`${l}?fit=18`:l)[0]})),default:()=>{var l,p,f,N;return T((p=(l=y.value.tables)==null?void 0:l.find(({slug:x})=>x===r.table))==null?void 0:p.label,(N=(f=y.value.tables)==null?void 0:f.find(({slug:x})=>x===r.table))==null?void 0:N.schema,t)}}:{icon:()=>e(w,()=>e("span",{},r.key.charAt(0).toUpperCase())),default:()=>{var l,p,f,N;return T((p=(l=y.value.tables)==null?void 0:l.find(({slug:x})=>x===r.table))==null?void 0:p.label,(N=(f=y.value.tables)==null?void 0:f.find(({slug:x})=>x===r.table))==null?void 0:N.schema,t)}}))});case"upload":return e(g,{},{prefix:()=>e(u,{text:!0},()=>e(s,{strong:!0},()=>`${v(r.key)}: `)),default:()=>[].concat(d(a.value,(n??"")+(i?"":c(o.schema,r.id)))).length===1?[].concat(d(a.value,(n??"")+(i?"":c(o.schema,r.id)))).map(t=>["png","jpg","jpeg","ico","webp","svg","gif"].includes(t==null?void 0:t.split(".").pop())?e(O,{src:t!=null&&t.includes("inicontent")?`${t}?fit=32`:t,previewSrc:t,width:32}):e(w,()=>e(B))):e(me,()=>e(_,{align:"center"},()=>[].concat(d(a.value,(n??"")+(i?"":c(o.schema,r.id)))).map(t=>["png","jpg","jpeg","ico","webp","svg","gif"].includes(t==null?void 0:t.split(".").pop())?e(O,{src:t!=null&&t.includes("inicontent")?`${t}?fit=32`:t,previewSrc:t,width:32}):e(w,()=>e(B)))))});case"date":return e(g,{},{prefix:()=>e(u,{text:!0},()=>e(s,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(ue,{},{trigger:()=>e(E,{time:Number(d(a.value,(n??"")+(i?"":c(o.schema,r.id))))}),default:()=>e(E,{time:Number(d(a.value,(n??"")+(i?"":c(o.schema,r.id)))),type:"relative"})})});case"html":return e(g,{},{prefix:()=>e(u,{text:!0},()=>e(s,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(s,{innerHTML:d(a.value,(n??"")+(i?"":c(o.schema,r.id)))??"--"})});case"boolean":return e(g,{},{prefix:()=>e(u,{text:!0},()=>e(s,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(S,{color:d(a.value,(n??"")+(i?"":c(o.schema,r.id)))?"green":"red",borderRadius:50,size:18},()=>e(w,{size:16},()=>e(d(a.value,(n??"")+(i?"":c(o.schema,r.id)))?de:L)))});case"array":return e(g,{},{prefix:()=>e(u,{text:!0},()=>e(s,{strong:!0},()=>`${v(r.key)}: `)),default:()=>{var t;return(t=d(a.value,(n??"")+(i?"":c(o.schema,r.id)),[]))==null?void 0:t.map((l,p)=>e(g,{},{prefix:()=>e(s,{strong:!0},()=>p+1),default:()=>r.children.map(f=>C(f,`${(n??"")+(i?"":c(o.schema,r.id))}.${p}.${f.key}`,!0))}))}});case"object":return e(g,{},{prefix:()=>e(u,{text:!0},()=>e(s,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(_,{vertical:!0},()=>r.children.map(t=>C(t)))});case"email":return e(g,{},{prefix:()=>e(u,{text:!0},()=>e(s,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(M,{href:`mailto:${d(a.value,(n??"")+(i?"":c(o.schema,r.id)))}`,_target:"blank"},()=>d(a.value,(n??"")+(i?"":c(o.schema,r.id)))??"--")});case"color":return e(g,{},{prefix:()=>e(u,{text:!0},()=>e(s,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(j,{round:!0,style:{backgroundColor:d(a.value,(n??"")+(i?"":c(o.schema,r.id)))}},()=>e(s,{style:{mixBlendMode:"difference"}},()=>d(a.value,(n??"")+(i?"":c(o.schema,r.id)))))});case"url":return e(g,{},{prefix:()=>e(u,{text:!0},()=>e(s,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(M,{href:d(a.value,(n??"")+(i?"":c(o.schema,r.id)))??"#",_target:"blank"},()=>d(a.value,(n??"")+(i?"":c(o.schema,r.id)))??"--")});case"role":return e(g,{},{prefix:()=>e(u,{text:!0},()=>e(s,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(j,{round:!0},{default:()=>{var t,l;return v((l=(t=y.value.roles)==null?void 0:t.find(({id:p})=>p===d(a.value,(n??"")+(i?"":c(o.schema,r.id)))))==null?void 0:l.name)},icon:()=>e(w,()=>e(le))})});default:return e(g,{},{prefix:()=>e(u,{text:!0},()=>e(s,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(s,{style:{whiteSpace:"pre-line"},innerHTML:d(a.value,(n??"")+(i?"":c(o.schema,r.id)))??"--"})})}};return()=>e(ce,{xScrollable:!0},()=>e(pe,{id:"PRINT_CONTENT",hoverable:!0,bordered:!0},()=>o==null?void 0:o.schema.map(r=>C(r))))}},"$zPFQFJ6Dus");export{We as default};
