import{bW as b,c3 as E,f as _,bX as I,r as p,A as y,i as W,aR as F,s as x,c4 as L,bV as S,c5 as N,aA as D,bp as K,c6 as U,B as V,c7 as X,a$ as J,aN as Q,bY as q,c8 as Z}from"./DB4_Y2V2.js";import{a as ee,u as te}from"./BetiCcM3.js";import{b as oe}from"./BVex7Z5g.js";import{k as G}from"./HiGXOwLp.js";import{u as ne,a as re}from"./DUeZ2j2K.js";import{g as ie}from"./Cz32yFEB.js";import{t as le}from"./DqDxm4Rb.js";import{o as ae}from"./Dakly4Tw.js";import{S as se}from"./DR4zHZYY.js";import{k as M}from"./CzIR7LU3.js";function Y(e){return typeof e=="string"?document.querySelector(e):typeof e=="function"?e():e}function ce(e){return e instanceof HTMLElement?e.scrollTop:window.scrollY}function fe(e){return e instanceof HTMLElement?e.getBoundingClientRect():{top:0,bottom:window.innerHeight}}const ue=b("affix",[E("affixed",{position:"fixed"},[E("absolute-positioned",{position:"absolute"})])]),j={listenTo:[String,Object,Function],top:Number,bottom:Number,triggerTop:Number,triggerBottom:Number,position:{type:String,default:"fixed"},offsetTop:{type:Number,validator:()=>!0,default:void 0},offsetBottom:{type:Number,validator:()=>!0,default:void 0},target:{type:Function,validator:()=>!0,default:void 0}},de=G(j),ve=_({name:"Affix",props:j,setup(e){const{mergedClsPrefixRef:a}=I(e);ee("-affix",ue,a);let n=null;const r=p(!1),l=p(!1),c=p(null),v=p(null),f=y(()=>l.value||r.value),h=y(()=>{var t,o;return(o=(t=e.triggerTop)!==null&&t!==void 0?t:e.offsetTop)!==null&&o!==void 0?o:e.top}),m=y(()=>{var t,o;return(o=(t=e.top)!==null&&t!==void 0?t:e.triggerTop)!==null&&o!==void 0?o:e.offsetTop}),w=y(()=>{var t,o;return(o=(t=e.bottom)!==null&&t!==void 0?t:e.triggerBottom)!==null&&o!==void 0?o:e.offsetBottom}),R=y(()=>{var t,o;return(o=(t=e.triggerBottom)!==null&&t!==void 0?t:e.offsetBottom)!==null&&o!==void 0?o:e.bottom}),k=p(null),B=()=>{const{target:t,listenTo:o}=e;t?n=t():o?n=Y(o):n=document,n&&(n.addEventListener("scroll",u),u())};function u(){oe(d)}function d(){const{value:t}=k;if(!n||!t)return;const o=ce(n);if(f.value){v.value!==null&&o<v.value&&(r.value=!1,v.value=null),c.value!==null&&o>c.value&&(l.value=!1,c.value=null);return}const g=fe(n),T=t.getBoundingClientRect(),A=T.top-g.top,C=g.bottom-T.bottom,s=h.value,i=R.value;s!==void 0&&A<=s?(r.value=!0,v.value=o-(s-A)):(r.value=!1,v.value=null),i!==void 0&&C<=i?(l.value=!0,c.value=o+i-C):(l.value=!1,c.value=null)}return W(()=>{B()}),F(()=>{n&&n.removeEventListener("scroll",u)}),{selfRef:k,affixed:f,mergedClsPrefix:a,mergedstyle:y(()=>{const t={};return r.value&&h.value!==void 0&&m.value!==void 0&&(t.top=`${m.value}px`),l.value&&R.value!==void 0&&w.value!==void 0&&(t.bottom=`${w.value}px`),t})}},render(){const{mergedClsPrefix:e}=this;return x("div",{ref:"selfRef",class:[`${e}-affix`,{[`${e}-affix--affixed`]:this.affixed,[`${e}-affix--absolute-positioned`]:this.position==="absolute"}],style:this.mergedstyle},this.$slots)}}),he=b("anchor",`
 position: relative;
`,[L("block",`
 padding-left: var(--n-rail-width);
 `,[b("anchor-link",[S("+, >",[b("anchor-link",`
 margin-top: .5em;
 `)])]),b("anchor-link-background",`
 max-width: 0;
 border-top-right-radius: 10.5px;
 border-bottom-right-radius: 10.5px;
 `),L("show-rail",[S(">",[b("anchor-link","padding-left: 0;")])])]),E("block",[b("anchor-link",`
 margin-bottom: 4px;
 padding: 2px 8px;
 transition: background-color .3s var(--n-bezier);
 background-color: transparent;
 border-radius: var(--n-link-border-radius);
 `,[E("active",`
 background-color: var(--n-link-color);
 `)])]),b("anchor-link-background",`
 position: absolute;
 left: calc(var(--n-rail-width) / 2);
 width: 100%;
 background-color: var(--n-link-color);
 transition:
 top .15s var(--n-bezier),
 max-width .15s var(--n-bezier),
 background-color .3s var(--n-bezier);
 `),b("anchor-rail",`
 position: absolute;
 left: 0;
 top: 0;
 bottom: 0;
 width: var(--n-rail-width);
 border-radius: calc(var(--n-rail-width) / 2);
 overflow: hidden;
 transition: background-color .3s var(--n-bezier);
 background-color: var(--n-rail-color);
 `,[N("bar",`
 position: absolute;
 left: 0;
 width: var(--n-rail-width);
 height: 21px;
 background-color: #0000;
 transition: 
 top .15s var(--n-bezier),
 background-color .3s var(--n-bezier);
 `,[E("active",{backgroundColor:"var(--n-rail-color-active)"})])]),b("anchor-link",`
 padding: var(--n-link-padding);
 position: relative;
 line-height: 1.5;
 font-size: var(--n-link-font-size);
 min-height: 1.5em;
 display: flex;
 flex-direction: column;
 `,[E("active",[S(">",[N("title",`
 color: var(--n-link-text-color-active);
 `)])]),N("title",`
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
 `,[S("&:hover, &:focus",`
 color: var(--n-link-text-color-hover);
 `),S("&:active",`
 color: var(--n-link-text-color-pressed);
 `)])])]),H=X("n-anchor"),ge={title:String,href:String},$e=_({name:"AnchorLink",props:ge,setup(e,{slots:a}){const n=p(null),r=D(H),l=K(e,"href"),c=U(()=>l.value&&l.value===r.activeHref.value);ne(H,"collectedLinkHrefs",l),re(H,"titleEls",()=>n.value),V(c,f=>{f&&n.value&&r.updateBarPosition(n.value)});function v(){e.href!==void 0&&r.setActiveHref(e.href)}return()=>{var f;const{value:h}=r.mergedClsPrefix;return x("div",{class:[`${h}-anchor-link`,c.value&&`${h}-anchor-link--active`]},x("a",{ref:n,class:[`${h}-anchor-link__title`],href:e.href,title:ie(e.title),onClick:v},e.title),(f=a.default)===null||f===void 0?void 0:f.call(a))}}});function me(e,a){const{top:n,height:r}=e.getBoundingClientRect(),l=a instanceof HTMLElement?a.getBoundingClientRect().top:0;return{top:n-l,height:r}}const z={type:{type:String,default:"rail"},showRail:{type:Boolean,default:!0},showBackground:{type:Boolean,default:!0},bound:{type:Number,default:12},internalScrollable:Boolean,ignoreGap:Boolean,offsetTarget:[String,Object,Function]},pe=G(z),be=_({name:"BaseAnchor",props:Object.assign(Object.assign({},z),{mergedClsPrefix:{type:String,required:!0}}),setup(e){const a=[],n=[],r=p(null),l=p(null),c=p(null),v=p(null),f=y(()=>e.type==="block"),h=y(()=>!f.value&&e.showRail);function m(){const{value:u}=c,{value:d}=l;u&&(u.style.transition="none"),d&&(d.style.transition="none"),n&&n.forEach(t=>{t.style.transition="none"}),Q(()=>{const{value:t}=c,{value:o}=l;t&&(t.offsetWidth,t.style.transition=""),o&&(o.offsetWidth,o.style.transition=""),n&&n.forEach(g=>{g.offsetWidth,g.style.transition=""})})}function w(u,d=!0){const{value:t}=c,{value:o}=l,{value:g}=v;if(!g||!t)return;d||(t.style.transition="none",o&&(o.style.transition="none"));const{offsetHeight:T,offsetWidth:A}=u,{top:C,left:s}=u.getBoundingClientRect(),{top:i,left:$}=g.getBoundingClientRect(),P=C-i,O=s-$;t.style.top=`${P}px`,t.style.height=`${T}px`,o&&(o.style.top=`${P}px`,o.style.height=`${T}px`,o.style.maxWidth=`${A+O}px`),t.offsetHeight,o&&o.offsetHeight,d||(t.style.transition="",o&&(o.style.transition=""))}const R=le(()=>{B(!0)},128);function k(u,d=!0){const t=/^#([^#]+)$/.exec(u);if(!t)return;const o=document.getElementById(t[1]);o&&(r.value=u,o.scrollIntoView(),d||m(),R())}function B(u=!0){var d;const t=[],o=Y((d=e.offsetTarget)!==null&&d!==void 0?d:document);a.forEach(s=>{const i=/#([^#]+)$/.exec(s);if(!i)return;const $=document.getElementById(i[1]);if($&&o){const{top:P,height:O}=me($,o);t.push({top:P,height:O,href:s})}}),t.sort((s,i)=>s.top>i.top?1:(s.top===i.top&&s.height<i.height,-1));const g=r.value,{bound:T,ignoreGap:A}=e,C=t.reduce((s,i)=>i.top+i.height<0?A?i:s:i.top<=T?s===null?i:i.top===s.top?i.href===g?i:s:i.top>s.top?i:s:s,null);u||m(),C?r.value=C.href:r.value=null}return J(H,{activeHref:r,mergedClsPrefix:K(e,"mergedClsPrefix"),updateBarPosition:w,setActiveHref:k,collectedLinkHrefs:a,titleEls:n}),W(()=>{document.addEventListener("scroll",R,!0),k(window.location.hash),B(!1)}),ae(()=>{k(window.location.hash),B(!1)}),F(()=>{document.removeEventListener("scroll",R,!0)}),V(r,u=>{if(u===null){const{value:d}=l;d&&!f.value&&(d.style.maxWidth="0")}}),{selfRef:v,barRef:c,slotRef:l,setActiveHref:k,activeHref:r,isBlockType:f,mergedShowRail:h}},render(){var e;const{mergedClsPrefix:a,mergedShowRail:n,isBlockType:r,$slots:l}=this,c=x("div",{class:[`${a}-anchor`,r&&`${a}-anchor--block`,n&&`${a}-anchor--show-rail`],ref:"selfRef"},n&&this.showBackground?x("div",{ref:"slotRef",class:`${a}-anchor-link-background`}):null,n?x("div",{class:`${a}-anchor-rail`},x("div",{ref:"barRef",class:[`${a}-anchor-rail__bar`,this.activeHref!==null&&`${a}-anchor-rail__bar--active`]})):null,(e=l.default)===null||e===void 0?void 0:e.call(l));return this.internalScrollable?x(se,null,{default:()=>c}):c}}),xe=Object.assign(Object.assign(Object.assign(Object.assign({},q.props),{affix:Boolean}),j),z),Pe=_({name:"Anchor",props:xe,setup(e,{slots:a}){const{mergedClsPrefixRef:n,inlineThemeDisabled:r}=I(e),l=q("Anchor","-anchor",he,Z,e,n),c=p(null),v=y(()=>{const{self:{railColor:h,linkColor:m,railColorActive:w,linkTextColor:R,linkTextColorHover:k,linkTextColorPressed:B,linkTextColorActive:u,linkFontSize:d,railWidth:t,linkPadding:o,borderRadius:g},common:{cubicBezierEaseInOut:T}}=l.value;return{"--n-link-border-radius":g,"--n-link-color":m,"--n-link-font-size":d,"--n-link-text-color":R,"--n-link-text-color-hover":k,"--n-link-text-color-active":u,"--n-link-text-color-pressed":B,"--n-link-padding":o,"--n-bezier":T,"--n-rail-color":h,"--n-rail-color-active":w,"--n-rail-width":t}}),f=r?te("anchor",void 0,v,e):void 0;return{scrollTo(h){var m;(m=c.value)===null||m===void 0||m.setActiveHref(h)},renderAnchor:()=>(f==null||f.onRender(),x(be,Object.assign({ref:c,style:r?void 0:v.value,class:f==null?void 0:f.themeClass.value},M(e,pe),{mergedClsPrefix:n.value}),a))}},render(){return this.affix?x(ve,Object.assign({},M(this,de)),{default:this.renderAnchor}):this.renderAnchor()}});export{Pe as N,$e as a};
