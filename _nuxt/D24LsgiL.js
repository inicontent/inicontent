import{d as J}from"./BxKmmqIp.js";import{e as j,b as h,d as R,f as y,aO as W,aP as X,i as F,ab as Y,ah as H,q as Z,ae as P,l as V,ai as A,t as e,af as ee,j as re,ay as oe,C as D,P as te,bQ as ae,bw as c,S as v,M as se}from"./BHakqtML.js";import{g as l}from"./DLh1uspc.js";import{g as ie}from"./DzoMa8Ba.js";import{r as L}from"./BesuVgQe.js";import{I as ne}from"./N9pTgUwn.js";import{I as S}from"./q4MOExCQ.js";import{I as le,N as ce}from"./DhrDpcP6.js";import{I as B}from"./DdcVSrdy.js";import{u as de}from"./BAburf3k.js";import{l as ue}from"./CVNyTnHQ.js";import{S as me}from"./Dr62HoJz.js";import{B as u}from"./BuKvTen5.js";import{N as M}from"./CyUpoyd5.js";import{N as k}from"./BVZhlh5-.js";import{N as E}from"./CvY6LUb_.js";import{N as O,a as ve}from"./Chl9CJPf.js";import{N as n}from"./B1XLunR1.js";import{N as w}from"./B7sYoy7v.js";import{N as _}from"./DA-jzpWN.js";import{N as T}from"./CgMJDkRh.js";import{N as pe}from"./rWSeg3r6.js";import"./VHQbORsp.js";import"./_Fjd7p-P.js";import"./C9TD46dL.js";import"./DgnBjct1.js";import"./Cuy9QMLJ.js";import"./CUH8jnoT.js";import"./D98Rse4x.js";import"./pJhFYZal.js";import"./BvlEJc1w.js";import"./zjsengzr.js";import"./DFmn5ob7.js";import"./MDYG9bt7.js";import"./DiNmJ8iC.js";import"./ARpd52Or.js";import"./BtrpEMm5.js";import"./BosuxZz1.js";import"./BHMQSiF3.js";import"./CvVLHJQ-.js";import"./DPTrNFwQ.js";import"./B29Fcz9S.js";import"./DqUusg6t.js";import"./BvhJgjxt.js";import"./iM4_jTAC.js";import"./C2161hUv.js";import"./FuYpmigA.js";import"./CKrsKhuj.js";import"./5fSvgue4.js";import"./Bk_rJcZu.js";import"./h0mJDxlK.js";import"./vcvXIv6N.js";import"./PYyIikNb.js";const ge=j([h("list",`
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
 `,[R("show-divider",[h("list-item",[j("&:not(:last-child)",[y("divider",`
 background-color: var(--n-merged-border-color);
 `)])])]),R("clickable",[h("list-item",`
 cursor: pointer;
 `)]),R("bordered",`
 border: 1px solid var(--n-merged-border-color);
 border-radius: var(--n-border-radius);
 `),R("hoverable",[h("list-item",`
 border-radius: var(--n-border-radius);
 `,[j("&:hover",`
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
 `))]),be=Object.assign(Object.assign({},H.props),{size:{type:String,default:"medium"},bordered:Boolean,clickable:Boolean,hoverable:Boolean,showDivider:{type:Boolean,default:!0}}),K=ee("n-list"),fe=F({name:"List",props:be,setup(o){const{mergedClsPrefixRef:m,inlineThemeDisabled:g,mergedRtlRef:a}=Y(o),$=de("List",a,m),I=H("List","-list",ge,ue,o,m);Z(K,{showDividerRef:P(o,"showDivider"),mergedClsPrefixRef:m});const C=V(()=>{const{common:{cubicBezierEaseInOut:s},self:{fontSize:i,textColor:z,color:t,colorModal:d,colorPopover:b,borderColor:f,borderColorModal:N,borderColorPopover:x,borderRadius:Q,colorHover:U,colorHoverModal:q,colorHoverPopover:G}}=I.value;return{"--n-font-size":i,"--n-bezier":s,"--n-text-color":z,"--n-color":t,"--n-border-radius":Q,"--n-border-color":f,"--n-border-color-modal":N,"--n-border-color-popover":x,"--n-color-modal":d,"--n-color-popover":b,"--n-color-hover":U,"--n-color-hover-modal":q,"--n-color-hover-popover":G}}),r=g?A("list",void 0,C,o):void 0;return{mergedClsPrefix:m,rtlEnabled:$,cssVars:g?void 0:C,themeClass:r==null?void 0:r.themeClass,onRender:r==null?void 0:r.onRender}},render(){var o;const{$slots:m,mergedClsPrefix:g,onRender:a}=this;return a==null||a(),e("ul",{class:[`${g}-list`,this.rtlEnabled&&`${g}-list--rtl`,this.bordered&&`${g}-list--bordered`,this.showDivider&&`${g}-list--show-divider`,this.hoverable&&`${g}-list--hoverable`,this.clickable&&`${g}-list--clickable`,this.themeClass],style:this.cssVars},m.header?e("div",{class:`${g}-list__header`},m.header()):null,(o=m.default)===null||o===void 0?void 0:o.call(m),m.footer?e("div",{class:`${g}-list__footer`},m.footer()):null)}}),p=F({name:"ListItem",setup(){const o=re(K,null);return o||oe("list-item","`n-list-item` must be placed in `n-list`."),{showDivider:o.showDividerRef,mergedClsPrefix:o.mergedClsPrefixRef}},render(){const{$slots:o,mergedClsPrefix:m}=this;return e("li",{class:`${m}-list-item`},o.prefix?e("div",{class:`${m}-list-item__prefix`},o.prefix()):null,o.default?e("div",{class:`${m}-list-item__main`},o):null,o.suffix?e("div",{class:`${m}-list-item__suffix`},o.suffix()):null,this.showDivider&&e("div",{class:`${m}-list-item__divider`}))}}),fr=J({props:{schema:{type:Object,default:[]},modelValue:{type:Object,default:{}}},setup:(o,{emit:m})=>{const g=D("Loading",()=>({}));g.value.Drawer=!1;const a=V({get:()=>o.modelValue,set:r=>m("update:modelValue",r)}),$=D("database"),I=te(),C=(r,s,i)=>{if(!ae(a.value,(s??"")+(i?"":l(o.schema,r.id)))||c(a.value,(s??"")+(i?"":l(o.schema,r.id)))===null){if(r.key==="updatedAt")return;switch(r.subType??r.type){case"boolean":return e(p,{},{prefix:()=>e(u,{text:!0},()=>e(n,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(M,{color:"red",borderRadius:50,size:18},()=>e(w,{size:16},()=>e(B)))});case"array":return e(p,{},{prefix:()=>e(u,{text:!0},()=>e(n,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(u,{circle:!0},{default:()=>e(n,{depth:3},{default:()=>"[--]"})})});case"object":return e(p,{},{prefix:()=>e(u,{text:!0},()=>e(n,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(u,{circle:!0},{default:()=>e(n,{depth:3},{default:()=>"{--}"})})});default:return e(p,{},{prefix:()=>e(u,{text:!0},()=>e(n,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(n,{depth:3},()=>"--")})}}(Array.isArray(r.type)&&r.type.includes("array")||typeof r.type=="string"&&r.type==="array")&&(r.type=r.children);let z=r.subType??r.type;switch(Array.isArray(z)&&(z=ie(r.subType??r.type,c(a.value,(s??"")+(i?"":l(o.schema,r.id)))).key),z){case"select":case"tags":return e(p,{},{prefix:()=>e(u,{text:!0},()=>e(n,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(T,()=>[].concat(c(a.value,(s??"")+(i?"":l(o.schema,r.id)))).map(t=>e(_,{round:!0,bordered:!1},()=>t)))});case"table":return e(p,{},{prefix:()=>e(u,{text:!0},()=>e(n,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(T,()=>[].concat(c(a.value,(s??"")+(i?"":l(o.schema,r.id)))).map(t=>e(u,{tag:"a",href:`/${I.params.database}/admin/tables/${r.table}/${t.id}`,onClick(d){d.preventDefault(),se(`/${I.params.database}/admin/tables/${r.table}/${t.id}`)},size:"small",round:!0},r.image?{icon:()=>e(w,()=>e(ce,{style:{width:"18px",height:"18px"},round:!0,src:[].concat(c(t,r.image)??[]).map(d=>d!=null&&d.includes("inicontent")&&["png","jpg","jpeg","ico","webp","svg","gif"].includes(d.split(".").pop()??"")?`${d}?fit=18`:d)[0]})),default:()=>{var d,b,f,N;return L((b=(d=$.value.tables)==null?void 0:d.find(({slug:x})=>x===r.table))==null?void 0:b.label,(N=(f=$.value.tables)==null?void 0:f.find(({slug:x})=>x===r.table))==null?void 0:N.schema,t)}}:{icon:()=>e(w,()=>e("span",{},r.key.charAt(0).toUpperCase())),default:()=>{var d,b,f,N;return L((b=(d=$.value.tables)==null?void 0:d.find(({slug:x})=>x===r.table))==null?void 0:b.label,(N=(f=$.value.tables)==null?void 0:f.find(({slug:x})=>x===r.table))==null?void 0:N.schema,t)}})))});case"upload":return e(p,{},{prefix:()=>e(u,{text:!0},()=>e(n,{strong:!0},()=>`${v(r.key)}: `)),default:()=>[].concat(c(a.value,(s??"")+(i?"":l(o.schema,r.id)))).length===1?[].concat(c(a.value,(s??"")+(i?"":l(o.schema,r.id)))).map(t=>["png","jpg","jpeg","ico","webp","svg","gif"].includes(t==null?void 0:t.split(".").pop())?e(O,{src:t!=null&&t.includes("inicontent")?`${t}?fit=32`:t,previewSrc:t,width:32}):e(w,()=>e(S))):e(ve,()=>e(T,{align:"center"},()=>[].concat(c(a.value,(s??"")+(i?"":l(o.schema,r.id)))).map(t=>["png","jpg","jpeg","ico","webp","svg","gif"].includes(t==null?void 0:t.split(".").pop())?e(O,{src:t!=null&&t.includes("inicontent")?`${t}?fit=32`:t,previewSrc:t,width:32}):e(w,()=>e(S)))))});case"date":return e(p,{},{prefix:()=>e(u,{text:!0},()=>e(n,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(pe,{},{trigger:()=>e(E,{time:Number(c(a.value,(s??"")+(i?"":l(o.schema,r.id))))}),default:()=>e(E,{time:Number(c(a.value,(s??"")+(i?"":l(o.schema,r.id)))),type:"relative"})})});case"html":return e(p,{},{prefix:()=>e(u,{text:!0},()=>e(n,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(n,{innerHTML:c(a.value,(s??"")+(i?"":l(o.schema,r.id)))??"--"})});case"boolean":return e(p,{},{prefix:()=>e(u,{text:!0},()=>e(n,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(M,{color:c(a.value,(s??"")+(i?"":l(o.schema,r.id)))?"green":"red",borderRadius:50,size:18},()=>e(w,{size:16},()=>e(c(a.value,(s??"")+(i?"":l(o.schema,r.id)))?ne:B)))});case"array":return e(p,{},{prefix:()=>e(u,{text:!0},()=>e(n,{strong:!0},()=>`${v(r.key)}: `)),default:()=>{var t;return(t=c(a.value,(s??"")+(i?"":l(o.schema,r.id)),[]))==null?void 0:t.map((d,b)=>e(p,{},{prefix:()=>e(n,{strong:!0},()=>b+1),default:()=>r.children.map(f=>C(f,`${(s??"")+(i?"":l(o.schema,r.id))}.${b}.${f.key}`,!0))}))}});case"object":return e(p,{},{prefix:()=>e(u,{text:!0},()=>e(n,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(T,{vertical:!0,size:0},()=>r.children.map(t=>C(t)))});case"email":return e(p,{},{prefix:()=>e(u,{text:!0},()=>e(n,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(k,{href:`mailto:${c(a.value,(s??"")+(i?"":l(o.schema,r.id)))}`,_target:"blank"},()=>c(a.value,(s??"")+(i?"":l(o.schema,r.id)))??"--")});case"color":return e(p,{},{prefix:()=>e(u,{text:!0},()=>e(n,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(_,{round:!0,style:{backgroundColor:c(a.value,(s??"")+(i?"":l(o.schema,r.id)))}},()=>e(n,{style:{mixBlendMode:"difference"}},()=>c(a.value,(s??"")+(i?"":l(o.schema,r.id)))))});case"url":return e(p,{},{prefix:()=>e(u,{text:!0},()=>e(n,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(k,{href:c(a.value,(s??"")+(i?"":l(o.schema,r.id)))??"#",_target:"blank"},()=>c(a.value,(s??"")+(i?"":l(o.schema,r.id)))??"--")});case"role":return e(p,{},{prefix:()=>e(u,{text:!0},()=>e(n,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(_,{round:!0},{default:()=>{var t,d;return v((d=(t=$.value.roles)==null?void 0:t.find(({id:b})=>b===c(a.value,(s??"")+(i?"":l(o.schema,r.id)))))==null?void 0:d.name)},icon:()=>e(w,()=>e(le))})});default:return e(p,{},{prefix:()=>e(u,{text:!0},()=>e(n,{strong:!0},()=>`${v(r.key)}: `)),default:()=>e(n,{style:{whiteSpace:"pre-line"},innerHTML:c(a.value,(s??"")+(i?"":l(o.schema,r.id)))??"--"})})}};return()=>e(me,{xScrollable:!0},()=>e(fe,{id:"PRINT_CONTENT",hoverable:!0,bordered:!0},()=>o==null?void 0:o.schema.map(r=>C(r))))}},"$zPFQFJ6Dus");export{fr as default};
