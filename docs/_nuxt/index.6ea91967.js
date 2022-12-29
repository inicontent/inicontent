import{f as x,p as S,a as _,k as G,C as p,b as T,e as W,F as K,h as u,K as F,m as A,q as H,y as X,w as D,Q as Z,O as V,x as ee,v as te,U as oe,i as J,d5 as ne,l as re,H as j}from"./entry.328b861b.js";import{u as le}from"./composables.618862be.js";import"./index.d4f86f82.js";import"./RenderData.1a6bae2b.js";import{R as ie}from"./RenderFields.4cf147db.js";import{a as ae,N as se}from"./Space.59a4ec5d.js";import{k as Q}from"./format-length.ad42f3fa.js";import{d as ue,s as I}from"./Icon.29c3922e.js";import{m as ce,n as fe,o as de,e as ve,f as me}from"./Trash.f7f2ca5d.js";import{t as he}from"./throttle.37ad0e3c.js";import{e as pe,N as ge}from"./Scrollbar.0c5a84d0.js";import{w as U,v as be}from"./FileText.6114aa05.js";import{N as O}from"./useLanguage.d2d2312d.js";import"./index.ad61f358.js";import"./ColorPicker.73c99446.js";import"./Time.07060ce1.js";import"./Scrollbar.ab988cec.js";import"./Upload.0169452e.js";import"./text.28dac007.js";import"./use-houdini.a45afe2f.js";import"./Image.ee9b4ccc.js";import"./RenderSchema.758665a5.js";import"./fetch.7103049b.js";import"./vue.runtime.esm-bundler.6b4d84ea.js";import"./use-is-composing.b03ea0d7.js";import"./RichEditor.e82d76d5.js";import"./Upload.c25d53d7.js";import"./Add.216a72f9.js";function Y(e){return typeof e=="string"?document.querySelector(e):typeof e=="function"?e():e}function xe(e){return e instanceof HTMLElement?e.scrollTop:window.scrollY}function ye(e){return e instanceof HTMLElement?e.getBoundingClientRect():{top:0,bottom:window.innerHeight}}const ke=x("affix",[S("affixed",{position:"fixed"},[S("absolute-positioned",{position:"absolute"})])]),L={listenTo:[String,Object,Function],top:Number,bottom:Number,triggerTop:Number,triggerBottom:Number,position:{type:String,default:"fix"},offsetTop:{type:Number,validator:()=>!0,default:void 0},offsetBottom:{type:Number,validator:()=>!0,default:void 0},target:{type:Function,validator:()=>!0,default:void 0}},Te=Q(L),Re=_({name:"Affix",props:L,setup(e){const{mergedClsPrefixRef:a}=G(e);ae("-affix",ke,a);let l=null;const n=p(!1),s=p(!1),i=p(null),f=p(null),r=T(()=>s.value||n.value),h=T(()=>{var t,o;return(o=(t=e.triggerTop)!==null&&t!==void 0?t:e.offsetTop)!==null&&o!==void 0?o:e.top}),b=T(()=>{var t,o;return(o=(t=e.top)!==null&&t!==void 0?t:e.triggerTop)!==null&&o!==void 0?o:e.offsetTop}),B=T(()=>{var t,o;return(o=(t=e.bottom)!==null&&t!==void 0?t:e.triggerBottom)!==null&&o!==void 0?o:e.offsetBottom}),y=T(()=>{var t,o;return(o=(t=e.triggerBottom)!==null&&t!==void 0?t:e.offsetBottom)!==null&&o!==void 0?o:e.bottom}),R=p(null),w=()=>{const{target:t,listenTo:o}=e;t?l=t():o?l=Y(o):l=document,l&&(l.addEventListener("scroll",v),v())};function v(){ue(m)}function m(){const{value:t}=R;if(!l||!t)return;const o=xe(l);if(r.value){o<f.value&&(n.value=!1,f.value=null),o>i.value&&(s.value=!1,i.value=null);return}const g=ye(l),k=t.getBoundingClientRect(),E=k.top-g.top,C=g.bottom-k.bottom,d=h.value,c=y.value;d!==void 0&&E<=d?(n.value=!0,f.value=o-(d-E)):(n.value=!1,f.value=null),c!==void 0&&C<=c?(s.value=!0,i.value=o+c-C):(s.value=!1,i.value=null)}return W(()=>{w()}),K(()=>{!l||l.removeEventListener("scroll",v)}),{selfRef:R,affixed:r,mergedClsPrefix:a,mergedstyle:T(()=>{const t={};return n.value&&h.value!==void 0&&b.value!==void 0&&(t.top=`${b.value}px`),s.value&&y.value!==void 0&&B.value!==void 0&&(t.bottom=`${B.value}px`),t})}},render(){const{mergedClsPrefix:e}=this;return u("div",{ref:"selfRef",class:[`${e}-affix`,{[`${e}-affix--affixed`]:this.affixed,[`${e}-affix--absolute-positioned`]:this.position==="absolute"}],style:this.mergedstyle},this.$slots)}}),we=x("anchor",`
 position: relative;
`,[F("block",`
 padding-left: var(--n-rail-width);
 `,[x("anchor-link",[A("+, >",[x("anchor-link",`
 margin-top: .5em;
 `)])]),x("anchor-link-background",`
 max-width: 0;
 border-top-right-radius: 10.5px;
 border-bottom-right-radius: 10.5px;
 `),F("show-rail",[A(">",[x("anchor-link","padding-left: 0;")])])]),S("block",[x("anchor-link",`
 margin-bottom: 4px;
 padding: 2px 8px;
 transition: background-color .3s var(--n-bezier);
 background-color: transparent;
 border-radius: var(--n-link-border-radius);
 `,[S("active",`
 background-color: var(--n-link-color);
 `)])]),x("anchor-link-background",`
 position: absolute;
 left: calc(var(--n-rail-width) / 2);
 width: 100%;
 background-color: var(--n-link-color);
 transition:
 top .15s var(--n-bezier),
 max-width .15s var(--n-bezier),
 background-color .3s var(--n-bezier);
 `),x("anchor-rail",`
 position: absolute;
 left: 0;
 top: 0;
 bottom: 0;
 width: var(--n-rail-width);
 border-radius: calc(var(--n-rail-width) / 2);
 overflow: hidden;
 transition: background-color .3s var(--n-bezier);
 background-color: var(--n-rail-color);
 `,[H("bar",`
 position: absolute;
 left: 0;
 width: var(--n-rail-width);
 height: 21px;
 background-color: #0000;
 transition: 
 top .15s var(--n-bezier),
 background-color .3s var(--n-bezier);
 `,[S("active",{backgroundColor:"var(--n-rail-color-active)"})])]),x("anchor-link",`
 padding: var(--n-link-padding);
 position: relative;
 line-height: 1.5;
 font-size: var(--n-link-font-size);
 min-height: 1.5em;
 display: flex;
 flex-direction: column;
 `,[S("active",[A(">",[H("title",`
 color: var(--n-link-text-color-active);
 `)])]),H("title",`
 outline: none;
 max-width: 100%;
 text-decoration: none;
 white-space: nowrap;
 text-overflow: ellipsis;
 overflow: hidden;
 cursor: pointer;
 display: inline-block;
 padding-right: 16px;
 transition: color .3s var(--n-bezier);
 color: var(--n-link-text-color);
 `,[A("&:hover, &:focus",`
 color: var(--n-link-text-color-hover);
 `),A("&:active",`
 color: var(--n-link-text-color-pressed);
 `)])])]),P=ee("n-anchor"),Ce={title:String,href:String},z=_({name:"AnchorLink",props:Ce,setup(e,{slots:a}){const l=p(null),n=X(P),s=D(e,"href"),i=Z(()=>s.value&&s.value===n.activeHref.value);ce(P,"collectedLinkHrefs",s),fe(P,"titleEls",()=>l.value),V(i,r=>{r&&l.value&&n.updateBarPosition(l.value)});function f(){e.href!==void 0&&n.setActiveHref(e.href)}return()=>{var r;const{value:h}=n.mergedClsPrefix;return u("div",{class:[`${h}-anchor-link`,i.value&&`${h}-anchor-link--active`]},u("a",{ref:l,class:[`${h}-anchor-link__title`],href:e.href,title:de(e.title),onClick:f},e.title),(r=a.default)===null||r===void 0?void 0:r.call(a))}}});function Be(e,a){const{top:l,height:n}=e.getBoundingClientRect(),s=a instanceof HTMLElement?a.getBoundingClientRect().top:0;return{top:l-s,height:n}}const M={type:{type:String,default:"rail"},showRail:{type:Boolean,default:!0},showBackground:{type:Boolean,default:!0},bound:{type:Number,default:12},internalScrollable:Boolean,ignoreGap:Boolean,offsetTarget:[String,Object,Function]},Ee=Q(M),Se=_({name:"BaseAnchor",props:Object.assign(Object.assign({},M),{mergedClsPrefix:{type:String,required:!0}}),setup(e){const a=[],l=[],n=p(null),s=p(null),i=p(null),f=p(null),r=T(()=>e.type==="block"),h=T(()=>!r.value&&e.showRail);function b(){const{value:v}=i,{value:m}=s;v&&(v.style.transition="none"),m&&(m.style.transition="none"),l&&l.forEach(t=>{t.style.transition="none"}),oe(()=>{const{value:t}=i,{value:o}=s;t&&(t.offsetWidth,t.style.transition=""),o&&(o.offsetWidth,o.style.transition=""),l&&l.forEach(g=>{g.offsetWidth,g.style.transition=""})})}function B(v,m=!0){const{value:t}=i,{value:o}=s,{value:g}=f;if(!g||!t)return;m||(t.style.transition="none",o&&(o.style.transition="none"));const{offsetHeight:k,offsetWidth:E}=v,{top:C,left:d}=v.getBoundingClientRect(),{top:c,left:N}=g.getBoundingClientRect(),$=C-c,q=d-N;t.style.top=`${$}px`,t.style.height=`${k}px`,o&&(o.style.top=`${$}px`,o.style.height=`${k}px`,o.style.maxWidth=`${E+q}px`),t.offsetHeight,o&&o.offsetHeight,m||(t.style.transition="",o&&(o.style.transition=""))}function y(v,m=!0){const t=/^#([^#]+)$/.exec(v);if(!t)return;const o=document.getElementById(t[1]);!o||(n.value=v,o.scrollIntoView(),m||b(),R())}const R=he(()=>w(!0),128);function w(v=!0){var m;const t=[],o=Y((m=e.offsetTarget)!==null&&m!==void 0?m:document);a.forEach(d=>{const c=/#([^#]+)$/.exec(d);if(!c)return;const N=document.getElementById(c[1]);if(N&&o){const{top:$,height:q}=Be(N,o);t.push({top:$,height:q,href:d})}}),t.sort((d,c)=>d.top>c.top?1:(d.top===c.top&&d.height<c.height,-1));const g=n.value,{bound:k,ignoreGap:E}=e,C=t.reduce((d,c)=>c.top+c.height<0?E?c:d:c.top<=k?d===null?c:c.top===d.top?c.href===g?c:d:c.top>d.top?c:d:d,null);v||b(),C?n.value=C.href:n.value=null}return te(P,{activeHref:n,mergedClsPrefix:D(e,"mergedClsPrefix"),updateBarPosition:B,setActiveHref:y,collectedLinkHrefs:a,titleEls:l}),W(()=>{document.addEventListener("scroll",R,!0),y(window.location.hash),w(!1)}),pe(()=>{y(window.location.hash),w(!1)}),K(()=>{document.removeEventListener("scroll",R,!0)}),V(n,v=>{if(v===null){const{value:m}=s;m&&!r.value&&(m.style.maxWidth="0")}}),{selfRef:f,barRef:i,slotRef:s,setActiveHref:y,activeHref:n,isBlockType:r,mergedShowRail:h}},render(){var e;const{mergedClsPrefix:a,mergedShowRail:l,isBlockType:n,$slots:s}=this,i=u("div",{class:[`${a}-anchor`,n&&`${a}-anchor--block`,l&&`${a}-anchor--show-rail`],ref:"selfRef"},l&&this.showBackground?u("div",{ref:"slotRef",class:`${a}-anchor-link-background`}):null,l?u("div",{class:`${a}-anchor-rail`},u("div",{ref:"barRef",class:[`${a}-anchor-rail__bar`,this.activeHref!==null&&`${a}-anchor-rail__bar--active`]})):null,(e=s.default)===null||e===void 0?void 0:e.call(s));return this.internalScrollable?u(ge,null,{default:()=>i}):i}}),Ae=Object.assign(Object.assign(Object.assign(Object.assign({},J.props),{affix:Boolean}),L),M),_e=_({name:"Anchor",props:Ae,setup(e,{slots:a}){const{mergedClsPrefixRef:l,inlineThemeDisabled:n}=G(e),s=J("Anchor","-anchor",we,ne,e,l),i=p(null),f=T(()=>{const{self:{railColor:h,linkColor:b,railColorActive:B,linkTextColor:y,linkTextColorHover:R,linkTextColorPressed:w,linkTextColorActive:v,linkFontSize:m,railWidth:t,linkPadding:o,borderRadius:g},common:{cubicBezierEaseInOut:k}}=s.value;return{"--n-link-border-radius":g,"--n-link-color":b,"--n-link-font-size":m,"--n-link-text-color":y,"--n-link-text-color-hover":R,"--n-link-text-color-active":v,"--n-link-text-color-pressed":w,"--n-link-padding":o,"--n-bezier":k,"--n-rail-color":h,"--n-rail-color-active":B,"--n-rail-width":t}}),r=n?re("anchor",void 0,f,e):void 0;return{scrollTo(h){var b;(b=i.value)===null||b===void 0||b.setActiveHref(h)},renderAnchor:()=>(r==null||r.onRender(),u(Se,Object.assign({ref:i,style:n?void 0:f.value,class:r==null?void 0:r.themeClass.value},I(e,Ee),{mergedClsPrefix:l.value}),a))}},render(){return this.affix?u(Re,Object.assign({},I(this,Te)),{default:this.renderAnchor}):this.renderAnchor()}}),lt=_({async setup(){var s;const e=j("Loading",()=>({}));e.value.UpdateDatabase=!1;const a=j("database");j("User"),ve();const l=p(),n=p(JSON.parse(JSON.stringify(a.value)));return!n.value.tables||n.value.tables.filter(i=>i.slug==="user").length===0?n.value.tables=[...(s=n.value.tables)!=null?s:[],{name:"User",slug:"user",schema:[{name:"Username",type:"text",required:!0},{name:"Password",type:"password",required:!0},{name:"Email",type:"email",required:!1},{name:"Role",type:"role",required:!0}]}]:n.value.tables=n.value.tables.map(i=>({...i,allowed_methods:Object.fromEntries(Object.entries(i.allowed_methods).map(([f,r])=>[f,r.split("")]))})),le({title:`${a.value.name} | Tables`,link:[{rel:"icon",href:a.value.icon}]}),()=>u(be,{xGap:12,cols:12,itemResponsive:!0},()=>[u(U,{span:11},()=>u(O,{title:"Settings",hoverable:!0},{"header-extra":()=>u("span",{},"SSS"),default:()=>[u(O,{title:"General",id:"general",hoverable:!0},()=>u(se,{vertical:!0},()=>[u(O,{title:"Basic",id:"basic",hoverable:!0},()=>[u(me,{ref:l,model:n.value,rules:{name:{required:!0,message:"Please give your database a name",trigger:["input","blur"]},slug:{required:!0,message:"Please give your database a unique slug",trigger:["input","blur"]},allowed_domains:{required:!0,validator(i,f){if(f){var r=!0;return f.forEach(h=>{h?h==="*"||h.charAt(0)==="#"?r=!0:/(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/.test(h)||(r=new Error("This is not a valid link")):r=new Error("This field is required")}),r}else return new Error("This field is required")},trigger:["input","blur"]}}},()=>{var i,f;return u(ie,{modelValue:n.value,"onUpdate:modelValue":r=>n.value=r,schema:[{name:"Name",type:"text",required:!0},{name:"Slug",type:"text",required:!0},{name:"Icon",type:"upload",single:!0,required:!0},{name:"Allowed Domains",type:"tags",content_type:"url",required:!0},{name:"Languages",type:"list",values:[{label:"Arabic",value:"ar"},{label:"English",value:"en"}],single:!1,required:!0},{name:"Roles",type:"tags",content_type:"text",default_value:["admin","user","guest"],required:!0},{name:"Tables",type:"group",duplicatable:!0,disabled_items:[0],children:[{name:"Name",type:"text",required:!0},{name:"Slug",type:"text",required:!0},{name:"Allowed methods",type:"group",children:["user","guest",...(f=(i=n.value.roles)==null?void 0:i.filter(r=>r!=="admin"))!=null?f:[]].map(r=>({name:r.charAt(0).toUpperCase()+r.slice(1).replaceAll("_"," "),type:"list",single:!1,values:[{value:"c",label:"Create"},{value:"r",label:"Read"},{value:"u",label:"Update"},{value:"d",label:"Delete"}],required:!0}))}]}]})})]),u(O,{title:"Email",id:"email",hoverable:!0},()=>[])]))]})),u(U,{span:1},()=>[u(_e,{affix:!0,listenTo:"#container",top:88,style:"z-index: 1",bound:24},()=>[u(z,{title:"General",href:"#general"},()=>[u(z,{title:"Basic",href:"#basic"}),u(z,{title:"Email",href:"#email"})])])])])}});export{lt as default};
