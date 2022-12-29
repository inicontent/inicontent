import{a as P,H as v,d2 as E,C as A,h as e,J as _}from"./entry.328b861b.js";import{u as I}from"./composables.618862be.js";import{u as U}from"./fetch.7103049b.js";import{b as C}from"./index.d4f86f82.js";import{N as B}from"./RenderData.1a6bae2b.js";import{N as d,P as S,b as h,U as M,g as O}from"./Upload.0169452e.js";import{e as R,f as Z,h as n,N as x,T as V,D as F,j as G,i as W}from"./Trash.f7f2ca5d.js";import{S as j}from"./Settings.9848080c.js";import{A as J}from"./ArrowRight.dcc6f37e.js";import{N as o}from"./Icon.29c3922e.js";import{N as H}from"./RenderSchema.758665a5.js";import{a as K,b as X}from"./Upload.c25d53d7.js";import{N as Q}from"./text.28dac007.js";import{a as k,b as Y,c as ee,d as b}from"./RenderFields.4cf147db.js";import{N as m}from"./Space.59a4ec5d.js";import{N as $}from"./headers.0190276e.js";import{v as ae,w as re}from"./FileText.6114aa05.js";import{N as q}from"./useLanguage.d2d2312d.js";import"./index.ad61f358.js";import"./ColorPicker.73c99446.js";import"./format-length.ad42f3fa.js";import"./Time.07060ce1.js";import"./Scrollbar.ab988cec.js";import"./Scrollbar.0c5a84d0.js";import"./Image.ee9b4ccc.js";import"./RichEditor.e82d76d5.js";import"./use-is-composing.b03ea0d7.js";import"./vue.runtime.esm-bundler.6b4d84ea.js";import"./Add.216a72f9.js";import"./use-houdini.a45afe2f.js";const Le=P({async setup(){const c=v("Loading",()=>({}));c.value.AddNewDatabase=!1;const f=v("database"),w=R(),y=v(()=>[],"$KueNQIvKSb"),T=v("Window",()=>({width:0})),p=v("User"),{data:N}=await U("https://api.inicontent.com/inicontent/db",{headers:{Authorization:"Basic "+C.Buffer.from(`${p.value.username}:${p.value.password}`).toString("base64")},transform:u=>u.result[0]?u.result:E("/auth"),initialCache:!1},"$afZcbyCDbW"),g=A(!1),D=A(null),a=A(),z=async()=>{var u;(u=D.value)==null||u.validate(async r=>{if(r)w.error("The inputs are Invalid");else{c.value.AddNewDatabase=!0;const{data:l}=await U(`https://api.inicontent.com/inicontent/db/${a.value.id?a.value.id+"!":""}`,{headers:{Authorization:"Basic "+C.Buffer.from(`${p.value.username}:${p.value.password}`).toString("base64")},method:a.value.id?"PUT":"POST",body:a.value,initialCache:!1,transform:t=>(t.result&&Array.isArray(t.result)&&(t.result=[].concat(t.result)[0]),t)},"$cX6Wjrl9y7");l.value.result?(f.value=l.value.result,c.value.AddNewDatabase=!1,g.value=!1,w.success(l.value.message.en)):w.error(l.value.message.en),c.value.AddNewDatabase=!1}})};return I({title:`${f.value.name} | Dashboard`,link:[{rel:"icon",href:f.value.icon}]}),()=>e(q,{title:"Databases",style:"background: none",bordered:!1},{"header-extra":()=>e(d,{circle:!0,onClick:()=>(a.value={tables:[{name:"User",slug:"user",schema:[{name:"Username",type:"text",required:!0},{name:"Password",type:"password",required:!0},{name:"Email",type:"email",required:!1},{name:"Role",type:"role",required:!0}]}]},g.value=!0)},{icon:()=>e(o,()=>e(S))}),default:()=>{var u;return[e(H,{show:g.value,"on-update:show":r=>g.value=r,style:{width:T.value.width>600?"600px":"100%"},preset:"card",title:a.value&&a.value.hasOwnProperty("id")?"Update the database":"Create new Database",bordered:!1,size:"huge",segmented:{content:"soft",footer:"soft"}},{default:()=>e(Z,{ref:D,model:a.value,rules:{name:{required:!0,message:"Please give your database a name",trigger:["input","blur"]},slug:{required:!0,message:"Please give your database a unique slug",trigger:["input","blur"]},allowed_domains:{required:!0,validator(r,l){if(l){var t=!0;return l.forEach(s=>{s?s==="*"||s.charAt(0)==="#"?t=!0:/(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/.test(s)||(t=new Error("This is not a valid link")):t=new Error("This field is required")}),t}else return new Error("This field is required")},trigger:["input","blur"]}}},()=>[e(n,{label:"Name",path:"name"},()=>e(h,{value:a.value.name,onUpdateValue:r=>(a.value.name=r,a.value.slug=r.toLowerCase().replace(/ /g,"_").replace(/[^\[a-zA-Zء-ي]-_+/g,""))})),e(n,{label:"Slug",path:"slug"},()=>e(h,{disabled:a.value&&a.value.hasOwnProperty("id"),value:a.value.slug,onUpdateValue:r=>a.value.slug=r.toLowerCase().replace(/ /g,"_").replace(/[^\[a-zA-Zء-ي]-_+/g,"")})),e(n,{label:"Icon",path:"icon"},()=>e(K,{directoryDnd:!0,max:1,multiple:!1,accept:"image/*",action:"https://api.inicontent.com/inicontent/assets",headers:{Authorization:"Basic "+C.Buffer.from(`${p.value.username}:${p.value.password}`).toString("base64")},fileList:a.value.icon?[{id:a.value.icon.split("/").pop().split("#")[0].split("?")[0],name:a.value.icon.split("/").pop().split("#")[0].split("?")[0],status:"finished",url:a.value.icon}]:void 0,onRemove:({file:r})=>(delete a.value.icon,!0),onFinish:({file:r,event:l})=>{const t=JSON.parse(l.target.response).result.public_url;return a.value.icon=t,r.url=t,r.name=t.split("/").pop().split("#")[0].split("?")[0],r},listType:"image"},()=>e(X,()=>[e("div",{style:{"margin-bottom":"12px"}},e(o,{size:48,depth:3},()=>e(M))),e(Q,{style:{"font-size":"16px"}},()=>"Click or drag a file to this area to upload")]))),e(n,{label:"Allowed Domains",path:"allowed_domains"},()=>e(k,{value:a.value.allowed_domains,onUpdateValue:r=>a.value.allowed_domains=r},{input:({submit:r,deactivate:l})=>e(h,{onBlur:l,onChange:r},{suffix:()=>e(o,()=>e(O))})})),e(n,{label:"Roles",path:"roles"},()=>{var r;return e(k,{value:["admin","user","guest",...(r=a.value.roles)!=null?r:[]],onCreate:l=>a.value.roles?a.value.roles.push(l.toLowerCase().replace(/ /g,"_").replace(/[^\[a-zA-Zء-ي]-_+/g,"")):a.value.roles=[l.toLowerCase().replace(/ /g,"_").replace(/[^\[a-zA-Zء-ي]-_+/g,"")],renderTag:(l,t)=>e(x,{type:t>2?"default":"primary",disabled:t<3,closable:t>2,onClose:()=>(a.value.roles.splice(t,1),a.value.roles.length===0?delete a.value.roles:"")},{default:()=>l.charAt(0).toUpperCase()+l.slice(1).replaceAll("_"," ")})})}),e(m,()=>[e($,()=>"Tables"),e(d,{size:"small",circle:!0,onClick:()=>a.value.tables.push({name:"",slug:"",allowed_methods:{}})},{icon:()=>e(o,()=>e(S))})]),e(Y,{columns:[{title:"Name",width:100,key:"name",render(r,l){return e(n,{showLabel:!1,path:`tables.${l}.name`,disabled:r.slug==="user",rule:{required:!0,validator(t,s){return s?!0:new Error("This field is required")},trigger:["input","blur"]}},()=>e(h,{value:r.name,disabled:r.slug==="user",onUpdateValue:t=>(a.value.tables[l].name=t,a.value.tables[l].slug=t.toLowerCase().replace(/ /g,"_").replace(/[^\[a-zA-Zء-ي]-_+/g,""))}))}},{title:"Slug",width:100,key:"slug",render(r,l){return e(n,{disabled:a.value&&a.value.hasOwnProperty("id")||r.slug==="user",showLabel:!1,path:`tables.${l}.slug`,rule:{required:!0,validator(t,s){return s?!0:new Error("This field is required")},trigger:["input","blur"]}},()=>e(h,{disabled:a.value&&a.value.hasOwnProperty("id")||r.slug==="user",value:r.slug,onUpdateValue:t=>a.value.tables[l].slug=["user","assets","session"].includes(t.toLowerCase().replace(/ /g,"_").replace(/[^\[a-zA-Zء-ي]-_+/g,""))?t.toLowerCase().replace(/ /g,"_").replace(/[^\[a-zA-Zء-ي]-_+/g,""):null}))}},{title:"Allowed methods",width:100,key:"allowed_methods",render:(r,l)=>{var t;return["user","guest",...(t=a.value.roles)!=null?t:[]].map(s=>e(n,{label:s.charAt(0).toUpperCase()+s.slice(1).replaceAll("_"," "),path:`tables.${l}.allowed_methods.${s}`},()=>{var i;return e(ee,{disabled:r.slug==="user",value:a.value.tables[l]&&a.value.tables[l].allowed_methods?Array.from((i=a.value.tables[l].allowed_methods[s])!=null?i:""):["c","r","u"],onUpdateValue:L=>a.value.tables[l].allowed_methods[s]=L.join(""),itemStyle:"display: flex"},()=>e(m,()=>[e(b,{value:"c",label:"Create"}),e(b,{value:"r",label:"Read"}),e(b,{value:"u",label:"Update"}),e(b,{value:"d",label:"Delete"})]))}))}},{title:"Actions",fixed:"right",align:"center",width:60,key:"actions",render(r,l){return e(d,{strong:!0,secondary:!0,circle:!0,type:"error",disabled:r.slug==="user",onClick(){delete a.value.tables[l]}},{icon:()=>e(o,()=>e(V))})}}],data:a.value.tables.filter(r=>r.slug==="user").length>0?a.value.tables:[...a.value.tables,{name:"User",slug:"user",schema:[{name:"Username",type:"text",required:!0,key:Date.now().toString(36)+Math.random().toString(36).substring(2)},{name:"Password",type:"password",required:!0,key:Date.now().toString(36)+Math.random().toString(36).substring(2)},{name:"Email",type:"email",required:!1,key:Date.now().toString(36)+Math.random().toString(36).substring(2)},{name:"Role",type:"role",required:!0,key:Date.now().toString(36)+Math.random().toString(36).substring(2)}]}],scrollX:700})]),footer:()=>e(m,{justify:"end"},()=>[e(d,{loading:c.value.AddNewDatabase,onClick:z},{default:()=>"Save",icon:()=>e(o,()=>e(F))})])}),e(G,{defaultExpandedNames:(u=N.value[0])==null?void 0:u.slug,accordion:!0},()=>N.value.map(({name:r,tables:l,slug:t},s)=>e(W,{title:r,name:t,disabled:y.value[s]},{"header-extra":()=>e(m,{},()=>[e(d,{circle:!0,onmouseleave:()=>y.value[s]=!1,onClick:i=>(y.value[s]=!0,a.value=JSON.parse(JSON.stringify(N.value[s])),g.value=!0)},{icon:()=>e(o,()=>e(j))}),e(_,{to:`/${t}`},()=>e(d,{circle:!0,type:"primary"},{icon:()=>e(o,()=>e(J))}))]),default:()=>e(ae,{xGap:12,yGap:12,cols:"1 500:2 800:4"},()=>l.map(i=>e(re,()=>e(_,{to:`/${t}/tables/${i.slug}`},()=>e(q,{style:"height: 100%",headerStyle:"height: 100%",hoverable:!0},{header:()=>e(m,()=>[e(B,{borderRadius:50},()=>e(o,{style:"font-style: normal"},()=>i.name.charAt(0))),e($,{style:"margin-bottom: 0"},()=>i.name)]),"header-extra":()=>e(m,()=>[e(_,{to:`/${t}/tables/${i.slug}/new`},()=>e(d,{circle:!0},{icon:()=>e(o,()=>e(S))}))])})))))})))]}})}});export{Le as default};
