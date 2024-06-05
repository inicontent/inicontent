import{ai as ve,cL as Jt,k as Ke,aU as Zt,aX as en,a7 as z,r as F,cc as je,j as d,aP as tn,aV as yt,aD as xt,X as St,c1 as k,cb as $,c9 as ne,c0 as de,ca as nt,c3 as Te,c2 as it,bt as ee,b_ as nn,z as Re,b3 as st,aQ as Ct,ci as me,dz as on,bO as ln,P as rn,bT as an,bL as sn,dA as dn}from"./DzT9_g3s.js";import{f as Rt}from"./bFMNLnFt.js";import{V as dt,r as ut,S as un,W as cn,u as ct,i as fn,g as hn}from"./IbvWAhpi.js";import{u as vn}from"./Bndh9hU7.js";import{u as gn}from"./BzRWdjSX.js";import{b as bn,u as pn}from"./DJxuMnbR.js";import{h as ot,p as De,N as mn,b as Tt,u as rt,r as ft,d as wn,g as Be,c as se}from"./y-k5cJ7W.js";import{b as yn,i as at,c as xn,N as Sn,u as lt,B as Cn,V as Rn,a as Tn}from"./CuWMyITG.js";import{N as Fn}from"./C_-Dyz5f.js";import{N as Qe}from"./B28C_u_Z.js";import{V as ht}from"./DHfOzDG_.js";import{r as Ce}from"./BuHM2qVd.js";import{g as vt}from"./Cz32yFEB.js";import{a as gt}from"./BB7jz1QX.js";import{c as On,a as Je}from"./B2nRbztc.js";import{b as Mn,c as Pn}from"./DXruQSCb.js";import{h as We}from"./CM8LO42l.js";import{N as kn}from"./DgSUtdLS.js";import{m as zn}from"./DsSU6HIH.js";function Ze(e){const n=e.filter(i=>i!==void 0);if(n.length!==0)return n.length===1?n[0]:i=>{e.forEach(s=>{s&&s(i)})}}function bt(e){return e&-e}class In{constructor(n,i){this.l=n,this.min=i;const s=new Array(n+1);for(let r=0;r<n+1;++r)s[r]=0;this.ft=s}add(n,i){if(i===0)return;const{l:s,ft:r}=this;for(n+=1;n<=s;)r[n]+=i,n+=bt(n)}get(n){return this.sum(n+1)-this.sum(n)}sum(n){if(n===void 0&&(n=this.l),n<=0)return 0;const{ft:i,min:s,l:r}=this;if(n>r)throw new Error("[FinweckTree.sum]: `i` is larger than length.");let c=n*s;for(;n>0;)c+=i[n],n-=bt(n);return c}getBound(n){let i=0,s=this.l;for(;s>i;){const r=Math.floor((i+s)/2),c=this.sum(r);if(c>n){s=r;continue}else if(c<n){if(i===r)return this.sum(i+1)<=n?i+1:r;i=r}else return r}return i}}let Ve;function Bn(){return typeof document>"u"?!1:(Ve===void 0&&("matchMedia"in window?Ve=window.matchMedia("(pointer:coarse)").matches:Ve=!1),Ve)}let et;function pt(){return typeof document>"u"?1:(et===void 0&&(et="chrome"in window?window.devicePixelRatio:1),et)}const _n=Je(".v-vl",{maxHeight:"inherit",height:"100%",overflow:"auto",minWidth:"1px"},[Je("&:not(.v-vl--show-scrollbar)",{scrollbarWidth:"none"},[Je("&::-webkit-scrollbar, &::-webkit-scrollbar-track-piece, &::-webkit-scrollbar-thumb",{width:0,height:0,display:"none"})])]),$n=ve({name:"VirtualList",inheritAttrs:!1,props:{showScrollbar:{type:Boolean,default:!0},items:{type:Array,default:()=>[]},itemSize:{type:Number,required:!0},itemResizable:Boolean,itemsStyle:[String,Object],visibleItemsTag:{type:[String,Object],default:"div"},visibleItemsProps:Object,ignoreItemResize:Boolean,onScroll:Function,onWheel:Function,onResize:Function,defaultScrollKey:[Number,String],defaultScrollIndex:Number,keyField:{type:String,default:"key"},paddingTop:{type:[Number,String],default:0},paddingBottom:{type:[Number,String],default:0}},setup(e){const n=Jt();_n.mount({id:"vueuc/virtual-list",head:!0,anchorMetaName:On,ssr:n}),Ke(()=>{const{defaultScrollIndex:h,defaultScrollKey:b}=e;h!=null?p({index:h}):b!=null&&p({key:b})});let i=!1,s=!1;Zt(()=>{if(i=!1,!s){s=!0;return}p({top:V.value,left:S})}),en(()=>{i=!0,s||(s=!0)});const r=z(()=>{const h=new Map,{keyField:b}=e;return e.items.forEach((m,_)=>{h.set(m[b],_)}),h}),c=F(null),g=F(void 0),a=new Map,P=z(()=>{const{items:h,itemSize:b,keyField:m}=e,_=new In(h.length,b);return h.forEach((E,N)=>{const A=E[m],L=a.get(A);L!==void 0&&_.add(N,L)}),_}),I=F(0);let S=0;const V=F(0),D=je(()=>Math.max(P.value.getBound(V.value-ot(e.paddingTop))-1,0)),B=z(()=>{const{value:h}=g;if(h===void 0)return[];const{items:b,itemSize:m}=e,_=D.value,E=Math.min(_+Math.ceil(h/m+1),b.length-1),N=[];for(let A=_;A<=E;++A)N.push(b[A]);return N}),p=(h,b)=>{if(typeof h=="number"){O(h,b,"auto");return}const{left:m,top:_,index:E,key:N,position:A,behavior:L,debounce:J=!0}=h;if(m!==void 0||_!==void 0)O(m,_,L);else if(E!==void 0)C(E,L,J);else if(N!==void 0){const X=r.value.get(N);X!==void 0&&C(X,L,J)}else A==="bottom"?O(0,Number.MAX_SAFE_INTEGER,L):A==="top"&&O(0,0,L)};let y,H=null;function C(h,b,m){const{value:_}=P,E=_.sum(h)+ot(e.paddingTop);if(!m)c.value.scrollTo({left:0,top:E,behavior:b});else{y=h,H!==null&&window.clearTimeout(H),H=window.setTimeout(()=>{y=void 0,H=null},16);const{scrollTop:N,offsetHeight:A}=c.value;if(E>N){const L=_.get(h);E+L<=N+A||c.value.scrollTo({left:0,top:E+L-A,behavior:b})}else c.value.scrollTo({left:0,top:E,behavior:b})}}function O(h,b,m){c.value.scrollTo({left:h,top:b,behavior:m})}function j(h,b){var m,_,E;if(i||e.ignoreItemResize||re(b.target))return;const{value:N}=P,A=r.value.get(h),L=N.get(A),J=(E=(_=(m=b.borderBoxSize)===null||m===void 0?void 0:m[0])===null||_===void 0?void 0:_.blockSize)!==null&&E!==void 0?E:b.contentRect.height;if(J===L)return;J-e.itemSize===0?a.delete(h):a.set(h,J-e.itemSize);const ie=J-L;if(ie===0)return;N.add(A,ie);const o=c.value;if(o!=null){if(y===void 0){const f=N.sum(A);o.scrollTop>f&&o.scrollBy(0,ie)}else if(A<y)o.scrollBy(0,ie);else if(A===y){const f=N.sum(A);J+f>o.scrollTop+o.offsetHeight&&o.scrollBy(0,ie)}le()}I.value++}const Q=!Bn();let G=!1;function K(h){var b;(b=e.onScroll)===null||b===void 0||b.call(e,h),(!Q||!G)&&le()}function Y(h){var b;if((b=e.onWheel)===null||b===void 0||b.call(e,h),Q){const m=c.value;if(m!=null){if(h.deltaX===0&&(m.scrollTop===0&&h.deltaY<=0||m.scrollTop+m.offsetHeight>=m.scrollHeight&&h.deltaY>=0))return;h.preventDefault(),m.scrollTop+=h.deltaY/pt(),m.scrollLeft+=h.deltaX/pt(),le(),G=!0,yn(()=>{G=!1})}}}function oe(h){if(i||re(h.target)||h.contentRect.height===g.value)return;g.value=h.contentRect.height;const{onResize:b}=e;b!==void 0&&b(h)}function le(){const{value:h}=c;h!=null&&(V.value=h.scrollTop,S=h.scrollLeft)}function re(h){let b=h;for(;b!==null;){if(b.style.display==="none")return!0;b=b.parentElement}return!1}return{listHeight:g,listStyle:{overflow:"auto"},keyToIndex:r,itemsStyle:z(()=>{const{itemResizable:h}=e,b=De(P.value.sum());return I.value,[e.itemsStyle,{boxSizing:"content-box",height:h?"":b,minHeight:h?b:"",paddingTop:De(e.paddingTop),paddingBottom:De(e.paddingBottom)}]}),visibleItemsStyle:z(()=>(I.value,{transform:`translateY(${De(P.value.sum(D.value))})`})),viewportItems:B,listElRef:c,itemsElRef:F(null),scrollTo:p,handleListResize:oe,handleListScroll:K,handleListWheel:Y,handleItemResize:j}},render(){const{itemResizable:e,keyField:n,keyToIndex:i,visibleItemsTag:s}=this;return d(dt,{onResize:this.handleListResize},{default:()=>{var r,c;return d("div",tn(this.$attrs,{class:["v-vl",this.showScrollbar&&"v-vl--show-scrollbar"],onScroll:this.handleListScroll,onWheel:this.handleListWheel,ref:"listElRef"}),[this.items.length!==0?d("div",{ref:"itemsElRef",class:"v-vl-items",style:this.itemsStyle},[d(s,Object.assign({class:"v-vl-visible-items",style:this.visibleItemsStyle},this.visibleItemsProps),{default:()=>this.viewportItems.map(g=>{const a=g[n],P=i.get(a),I=this.$slots.default({item:g,index:P})[0];return e?d(dt,{key:a,onResize:S=>this.handleItemResize(a,S)},{default:()=>I}):(I.key=a,I)})})]):(c=(r=this.$slots).empty)===null||c===void 0?void 0:c.call(r)])}})}});function Ft(e,n){n&&(Ke(()=>{const{value:i}=e;i&&ut.registerHandler(i,n)}),yt(()=>{const{value:i}=e;i&&ut.unregisterHandler(i)}))}const En=ve({name:"Checkmark",render(){return d("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 16 16"},d("g",{fill:"none"},d("path",{d:"M14.046 3.486a.75.75 0 0 1-.032 1.06l-7.93 7.474a.85.85 0 0 1-1.188-.022l-2.68-2.72a.75.75 0 1 1 1.068-1.053l2.234 2.267l7.468-7.038a.75.75 0 0 1 1.06.032z",fill:"currentColor"})))}}),Nn=ve({props:{onFocus:Function,onBlur:Function},setup(e){return()=>d("div",{style:"width: 0; height: 0",tabindex:0,onFocus:e.onFocus,onBlur:e.onBlur})}});function An(e,n){return d(St,{name:"fade-in-scale-up-transition"},{default:()=>e?d(mn,{clsPrefix:n,class:`${n}-base-select-option__check`},{default:()=>d(En)}):null})}const mt=ve({name:"NBaseSelectOption",props:{clsPrefix:{type:String,required:!0},tmNode:{type:Object,required:!0}},setup(e){const{valueRef:n,pendingTmNodeRef:i,multipleRef:s,valueSetRef:r,renderLabelRef:c,renderOptionRef:g,labelFieldRef:a,valueFieldRef:P,showCheckmarkRef:I,nodePropsRef:S,handleOptionClick:V,handleOptionMouseEnter:D}=xt(at),B=je(()=>{const{value:C}=i;return C?e.tmNode.key===C.key:!1});function p(C){const{tmNode:O}=e;O.disabled||V(C,O)}function y(C){const{tmNode:O}=e;O.disabled||D(C,O)}function H(C){const{tmNode:O}=e,{value:j}=B;O.disabled||j||D(C,O)}return{multiple:s,isGrouped:je(()=>{const{tmNode:C}=e,{parent:O}=C;return O&&O.rawNode.type==="group"}),showCheckmark:I,nodeProps:S,isPending:B,isSelected:je(()=>{const{value:C}=n,{value:O}=s;if(C===null)return!1;const j=e.tmNode.rawNode[P.value];if(O){const{value:Q}=r;return Q.has(j)}else return C===j}),labelField:a,renderLabel:c,renderOption:g,handleMouseMove:H,handleMouseEnter:y,handleClick:p}},render(){const{clsPrefix:e,tmNode:{rawNode:n},isSelected:i,isPending:s,isGrouped:r,showCheckmark:c,nodeProps:g,renderOption:a,renderLabel:P,handleClick:I,handleMouseEnter:S,handleMouseMove:V}=this,D=An(i,e),B=P?[P(n,i),c&&D]:[Ce(n[this.labelField],n,i),c&&D],p=g==null?void 0:g(n),y=d("div",Object.assign({},p,{class:[`${e}-base-select-option`,n.class,p==null?void 0:p.class,{[`${e}-base-select-option--disabled`]:n.disabled,[`${e}-base-select-option--selected`]:i,[`${e}-base-select-option--grouped`]:r,[`${e}-base-select-option--pending`]:s,[`${e}-base-select-option--show-checkmark`]:c}],style:[(p==null?void 0:p.style)||"",n.style||""],onClick:Ze([I,p==null?void 0:p.onClick]),onMouseenter:Ze([S,p==null?void 0:p.onMouseenter]),onMousemove:Ze([V,p==null?void 0:p.onMousemove])}),d("div",{class:`${e}-base-select-option__content`},B));return n.render?n.render({node:y,option:n,selected:i}):a?a({node:y,option:n,selected:i}):y}}),wt=ve({name:"NBaseSelectGroupHeader",props:{clsPrefix:{type:String,required:!0},tmNode:{type:Object,required:!0}},setup(){const{renderLabelRef:e,renderOptionRef:n,labelFieldRef:i,nodePropsRef:s}=xt(at);return{labelField:i,nodeProps:s,renderLabel:e,renderOption:n}},render(){const{clsPrefix:e,renderLabel:n,renderOption:i,nodeProps:s,tmNode:{rawNode:r}}=this,c=s==null?void 0:s(r),g=n?n(r,!1):Ce(r[this.labelField],r,!1),a=d("div",Object.assign({},c,{class:[`${e}-base-select-group-header`,c==null?void 0:c.class]}),g);return r.render?r.render({node:a,option:r}):i?i({node:a,option:r,selected:!1}):a}}),Ln=k("base-select-menu",`
 line-height: 1.5;
 outline: none;
 z-index: 0;
 position: relative;
 border-radius: var(--n-border-radius);
 transition:
 background-color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier);
 background-color: var(--n-color);
`,[k("scrollbar",`
 max-height: var(--n-height);
 `),k("virtual-list",`
 max-height: var(--n-height);
 `),k("base-select-option",`
 min-height: var(--n-option-height);
 font-size: var(--n-option-font-size);
 display: flex;
 align-items: center;
 `,[$("content",`
 z-index: 1;
 white-space: nowrap;
 text-overflow: ellipsis;
 overflow: hidden;
 `)]),k("base-select-group-header",`
 min-height: var(--n-option-height);
 font-size: .93em;
 display: flex;
 align-items: center;
 `),k("base-select-menu-option-wrapper",`
 position: relative;
 width: 100%;
 `),$("loading, empty",`
 display: flex;
 padding: 12px 32px;
 flex: 1;
 justify-content: center;
 `),$("loading",`
 color: var(--n-loading-color);
 font-size: var(--n-loading-size);
 `),$("header",`
 padding: 8px var(--n-option-padding-left);
 font-size: var(--n-option-font-size);
 transition: 
 color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 border-bottom: 1px solid var(--n-action-divider-color);
 color: var(--n-action-text-color);
 `),$("action",`
 padding: 8px var(--n-option-padding-left);
 font-size: var(--n-option-font-size);
 transition: 
 color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 border-top: 1px solid var(--n-action-divider-color);
 color: var(--n-action-text-color);
 `),k("base-select-group-header",`
 position: relative;
 cursor: default;
 padding: var(--n-option-padding);
 color: var(--n-group-header-text-color);
 `),k("base-select-option",`
 cursor: pointer;
 position: relative;
 padding: var(--n-option-padding);
 transition:
 color .3s var(--n-bezier),
 opacity .3s var(--n-bezier);
 box-sizing: border-box;
 color: var(--n-option-text-color);
 opacity: 1;
 `,[ne("show-checkmark",`
 padding-right: calc(var(--n-option-padding-right) + 20px);
 `),de("&::before",`
 content: "";
 position: absolute;
 left: 4px;
 right: 4px;
 top: 0;
 bottom: 0;
 border-radius: var(--n-border-radius);
 transition: background-color .3s var(--n-bezier);
 `),de("&:active",`
 color: var(--n-option-text-color-pressed);
 `),ne("grouped",`
 padding-left: calc(var(--n-option-padding-left) * 1.5);
 `),ne("pending",[de("&::before",`
 background-color: var(--n-option-color-pending);
 `)]),ne("selected",`
 color: var(--n-option-text-color-active);
 `,[de("&::before",`
 background-color: var(--n-option-color-active);
 `),ne("pending",[de("&::before",`
 background-color: var(--n-option-color-active-pending);
 `)])]),ne("disabled",`
 cursor: not-allowed;
 `,[nt("selected",`
 color: var(--n-option-text-color-disabled);
 `),ne("selected",`
 opacity: var(--n-option-opacity-disabled);
 `)]),$("check",`
 font-size: 16px;
 position: absolute;
 right: calc(var(--n-option-padding-right) - 4px);
 top: calc(50% - 7px);
 color: var(--n-option-check-color);
 transition: color .3s var(--n-bezier);
 `,[Rt({enterScale:"0.5"})])])]),Dn=ve({name:"InternalSelectMenu",props:Object.assign(Object.assign({},Te.props),{clsPrefix:{type:String,required:!0},scrollable:{type:Boolean,default:!0},treeMate:{type:Object,required:!0},multiple:Boolean,size:{type:String,default:"medium"},value:{type:[String,Number,Array],default:null},autoPending:Boolean,virtualScroll:{type:Boolean,default:!0},show:{type:Boolean,default:!0},labelField:{type:String,default:"label"},valueField:{type:String,default:"value"},loading:Boolean,focusable:Boolean,renderLabel:Function,renderOption:Function,nodeProps:Function,showCheckmark:{type:Boolean,default:!0},onMousedown:Function,onScroll:Function,onFocus:Function,onBlur:Function,onKeyup:Function,onKeydown:Function,onTabOut:Function,onMouseenter:Function,onMouseleave:Function,onResize:Function,resetMenuOnOptionsChange:{type:Boolean,default:!0},inlineThemeDisabled:Boolean,onToggle:Function}),setup(e){const{mergedClsPrefixRef:n,mergedRtlRef:i}=it(e),s=Tt("InternalSelectMenu",i,n),r=Te("InternalSelectMenu","-internal-select-menu",Ln,nn,e,ee(e,"clsPrefix")),c=F(null),g=F(null),a=F(null),P=z(()=>e.treeMate.getFlattenedNodes()),I=z(()=>Mn(P.value)),S=F(null);function V(){const{treeMate:o}=e;let f=null;const{value:W}=e;W===null?f=o.getFirstAvailableNode():(e.multiple?f=o.getNode((W||[])[(W||[]).length-1]):f=o.getNode(W),(!f||f.disabled)&&(f=o.getFirstAvailableNode())),_(f||null)}function D(){const{value:o}=S;o&&!e.treeMate.getNode(o.key)&&(S.value=null)}let B;Re(()=>e.show,o=>{o?B=Re(()=>e.treeMate,()=>{e.resetMenuOnOptionsChange?(e.autoPending?V():D(),Ct(E)):D()},{immediate:!0}):B==null||B()},{immediate:!0}),yt(()=>{B==null||B()});const p=z(()=>ot(r.value.self[me("optionHeight",e.size)])),y=z(()=>Be(r.value.self[me("padding",e.size)])),H=z(()=>e.multiple&&Array.isArray(e.value)?new Set(e.value):new Set),C=z(()=>{const o=P.value;return o&&o.length===0});function O(o){const{onToggle:f}=e;f&&f(o)}function j(o){const{onScroll:f}=e;f&&f(o)}function Q(o){var f;(f=a.value)===null||f===void 0||f.sync(),j(o)}function G(){var o;(o=a.value)===null||o===void 0||o.sync()}function K(){const{value:o}=S;return o||null}function Y(o,f){f.disabled||_(f,!1)}function oe(o,f){f.disabled||O(f)}function le(o){var f;We(o,"action")||(f=e.onKeyup)===null||f===void 0||f.call(e,o)}function re(o){var f;We(o,"action")||(f=e.onKeydown)===null||f===void 0||f.call(e,o)}function h(o){var f;(f=e.onMousedown)===null||f===void 0||f.call(e,o),!e.focusable&&o.preventDefault()}function b(){const{value:o}=S;o&&_(o.getNext({loop:!0}),!0)}function m(){const{value:o}=S;o&&_(o.getPrev({loop:!0}),!0)}function _(o,f=!1){S.value=o,f&&E()}function E(){var o,f;const W=S.value;if(!W)return;const ue=I.value(W.key);ue!==null&&(e.virtualScroll?(o=g.value)===null||o===void 0||o.scrollTo({index:ue}):(f=a.value)===null||f===void 0||f.scrollTo({index:ue,elSize:p.value}))}function N(o){var f,W;!((f=c.value)===null||f===void 0)&&f.contains(o.target)&&((W=e.onFocus)===null||W===void 0||W.call(e,o))}function A(o){var f,W;!((f=c.value)===null||f===void 0)&&f.contains(o.relatedTarget)||(W=e.onBlur)===null||W===void 0||W.call(e,o)}st(at,{handleOptionMouseEnter:Y,handleOptionClick:oe,valueSetRef:H,pendingTmNodeRef:S,nodePropsRef:ee(e,"nodeProps"),showCheckmarkRef:ee(e,"showCheckmark"),multipleRef:ee(e,"multiple"),valueRef:ee(e,"value"),renderLabelRef:ee(e,"renderLabel"),renderOptionRef:ee(e,"renderOption"),labelFieldRef:ee(e,"labelField"),valueFieldRef:ee(e,"valueField")}),st(xn,c),Ke(()=>{const{value:o}=a;o&&o.sync()});const L=z(()=>{const{size:o}=e,{common:{cubicBezierEaseInOut:f},self:{height:W,borderRadius:ue,color:we,groupHeaderTextColor:ye,actionDividerColor:ce,optionTextColorPressed:te,optionTextColor:xe,optionTextColorDisabled:fe,optionTextColorActive:Fe,optionOpacityDisabled:Oe,optionCheckColor:Me,actionTextColor:Pe,optionColorPending:ge,optionColorActive:be,loadingColor:ke,loadingSize:ze,optionColorActivePending:Ie,[me("optionFontSize",o)]:Se,[me("optionHeight",o)]:pe,[me("optionPadding",o)]:Z}}=r.value;return{"--n-height":W,"--n-action-divider-color":ce,"--n-action-text-color":Pe,"--n-bezier":f,"--n-border-radius":ue,"--n-color":we,"--n-option-font-size":Se,"--n-group-header-text-color":ye,"--n-option-check-color":Me,"--n-option-color-pending":ge,"--n-option-color-active":be,"--n-option-color-active-pending":Ie,"--n-option-height":pe,"--n-option-opacity-disabled":Oe,"--n-option-text-color":xe,"--n-option-text-color-active":Fe,"--n-option-text-color-disabled":fe,"--n-option-text-color-pressed":te,"--n-option-padding":Z,"--n-option-padding-left":Be(Z,"left"),"--n-option-padding-right":Be(Z,"right"),"--n-loading-color":ke,"--n-loading-size":ze}}),{inlineThemeDisabled:J}=e,X=J?rt("internal-select-menu",z(()=>e.size[0]),L,e):void 0,ie={selfRef:c,next:b,prev:m,getPendingTmNode:K};return Ft(c,e.onResize),Object.assign({mergedTheme:r,mergedClsPrefix:n,rtlEnabled:s,virtualListRef:g,scrollbarRef:a,itemSize:p,padding:y,flattenedNodes:P,empty:C,virtualListContainer(){const{value:o}=g;return o==null?void 0:o.listElRef},virtualListContent(){const{value:o}=g;return o==null?void 0:o.itemsElRef},doScroll:j,handleFocusin:N,handleFocusout:A,handleKeyUp:le,handleKeyDown:re,handleMouseDown:h,handleVirtualListResize:G,handleVirtualListScroll:Q,cssVars:J?void 0:L,themeClass:X==null?void 0:X.themeClass,onRender:X==null?void 0:X.onRender},ie)},render(){const{$slots:e,virtualScroll:n,clsPrefix:i,mergedTheme:s,themeClass:r,onRender:c}=this;return c==null||c(),d("div",{ref:"selfRef",tabindex:this.focusable?0:-1,class:[`${i}-base-select-menu`,this.rtlEnabled&&`${i}-base-select-menu--rtl`,r,this.multiple&&`${i}-base-select-menu--multiple`],style:this.cssVars,onFocusin:this.handleFocusin,onFocusout:this.handleFocusout,onKeyup:this.handleKeyUp,onKeydown:this.handleKeyDown,onMousedown:this.handleMouseDown,onMouseenter:this.onMouseenter,onMouseleave:this.onMouseleave},ft(e.header,g=>g&&d("div",{class:`${i}-base-select-menu__header`,"data-header":!0,key:"header"},g)),this.loading?d("div",{class:`${i}-base-select-menu__loading`},d(bn,{clsPrefix:i,strokeWidth:20})):this.empty?d("div",{class:`${i}-base-select-menu__empty`,"data-empty":!0},wn(e.empty,()=>[d(kn,{theme:s.peers.Empty,themeOverrides:s.peerOverrides.Empty})])):d(un,{ref:"scrollbarRef",theme:s.peers.Scrollbar,themeOverrides:s.peerOverrides.Scrollbar,scrollable:this.scrollable,container:n?this.virtualListContainer:void 0,content:n?this.virtualListContent:void 0,onScroll:n?void 0:this.doScroll},{default:()=>n?d($n,{ref:"virtualListRef",class:`${i}-virtual-list`,items:this.flattenedNodes,itemSize:this.itemSize,showScrollbar:!1,paddingTop:this.padding.top,paddingBottom:this.padding.bottom,onResize:this.handleVirtualListResize,onScroll:this.handleVirtualListScroll,itemResizable:!0},{default:({item:g})=>g.isGroup?d(wt,{key:g.key,clsPrefix:i,tmNode:g}):g.ignored?null:d(mt,{clsPrefix:i,key:g.key,tmNode:g})}):d("div",{class:`${i}-base-select-menu-option-wrapper`,style:{paddingTop:this.padding.top,paddingBottom:this.padding.bottom}},this.flattenedNodes.map(g=>g.isGroup?d(wt,{key:g.key,clsPrefix:i,tmNode:g}):d(mt,{clsPrefix:i,key:g.key,tmNode:g})))}),ft(e.action,g=>g&&[d("div",{class:`${i}-base-select-menu__action`,"data-action":!0,key:"action"},g),d(Nn,{onFocus:this.onTabOut,key:"focus-detector"})]))}}),Vn=de([k("base-selection",`
 --n-padding-single: var(--n-padding-single-top) var(--n-padding-single-right) var(--n-padding-single-bottom) var(--n-padding-single-left);
 --n-padding-multiple: var(--n-padding-multiple-top) var(--n-padding-multiple-right) var(--n-padding-multiple-bottom) var(--n-padding-multiple-left);
 position: relative;
 z-index: auto;
 box-shadow: none;
 width: 100%;
 max-width: 100%;
 display: inline-block;
 vertical-align: bottom;
 border-radius: var(--n-border-radius);
 min-height: var(--n-height);
 line-height: 1.5;
 font-size: var(--n-font-size);
 `,[k("base-loading",`
 color: var(--n-loading-color);
 `),k("base-selection-tags","min-height: var(--n-height);"),$("border, state-border",`
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 pointer-events: none;
 border: var(--n-border);
 border-radius: inherit;
 transition:
 box-shadow .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 `),$("state-border",`
 z-index: 1;
 border-color: #0000;
 `),k("base-suffix",`
 cursor: pointer;
 position: absolute;
 top: 50%;
 transform: translateY(-50%);
 right: 10px;
 `,[$("arrow",`
 font-size: var(--n-arrow-size);
 color: var(--n-arrow-color);
 transition: color .3s var(--n-bezier);
 `)]),k("base-selection-overlay",`
 display: flex;
 align-items: center;
 white-space: nowrap;
 pointer-events: none;
 position: absolute;
 top: 0;
 right: 0;
 bottom: 0;
 left: 0;
 padding: var(--n-padding-single);
 transition: color .3s var(--n-bezier);
 `,[$("wrapper",`
 flex-basis: 0;
 flex-grow: 1;
 overflow: hidden;
 text-overflow: ellipsis;
 `)]),k("base-selection-placeholder",`
 color: var(--n-placeholder-color);
 `,[$("inner",`
 max-width: 100%;
 overflow: hidden;
 `)]),k("base-selection-tags",`
 cursor: pointer;
 outline: none;
 box-sizing: border-box;
 position: relative;
 z-index: auto;
 display: flex;
 padding: var(--n-padding-multiple);
 flex-wrap: wrap;
 align-items: center;
 width: 100%;
 vertical-align: bottom;
 background-color: var(--n-color);
 border-radius: inherit;
 transition:
 color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 `),k("base-selection-label",`
 height: var(--n-height);
 display: inline-flex;
 width: 100%;
 vertical-align: bottom;
 cursor: pointer;
 outline: none;
 z-index: auto;
 box-sizing: border-box;
 position: relative;
 transition:
 color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 border-radius: inherit;
 background-color: var(--n-color);
 align-items: center;
 `,[k("base-selection-input",`
 font-size: inherit;
 line-height: inherit;
 outline: none;
 cursor: pointer;
 box-sizing: border-box;
 border:none;
 width: 100%;
 padding: var(--n-padding-single);
 background-color: #0000;
 color: var(--n-text-color);
 transition: color .3s var(--n-bezier);
 caret-color: var(--n-caret-color);
 `,[$("content",`
 text-overflow: ellipsis;
 overflow: hidden;
 white-space: nowrap; 
 `)]),$("render-label",`
 color: var(--n-text-color);
 `)]),nt("disabled",[de("&:hover",[$("state-border",`
 box-shadow: var(--n-box-shadow-hover);
 border: var(--n-border-hover);
 `)]),ne("focus",[$("state-border",`
 box-shadow: var(--n-box-shadow-focus);
 border: var(--n-border-focus);
 `)]),ne("active",[$("state-border",`
 box-shadow: var(--n-box-shadow-active);
 border: var(--n-border-active);
 `),k("base-selection-label","background-color: var(--n-color-active);"),k("base-selection-tags","background-color: var(--n-color-active);")])]),ne("disabled","cursor: not-allowed;",[$("arrow",`
 color: var(--n-arrow-color-disabled);
 `),k("base-selection-label",`
 cursor: not-allowed;
 background-color: var(--n-color-disabled);
 `,[k("base-selection-input",`
 cursor: not-allowed;
 color: var(--n-text-color-disabled);
 `),$("render-label",`
 color: var(--n-text-color-disabled);
 `)]),k("base-selection-tags",`
 cursor: not-allowed;
 background-color: var(--n-color-disabled);
 `),k("base-selection-placeholder",`
 cursor: not-allowed;
 color: var(--n-placeholder-color-disabled);
 `)]),k("base-selection-input-tag",`
 height: calc(var(--n-height) - 6px);
 line-height: calc(var(--n-height) - 6px);
 outline: none;
 display: none;
 position: relative;
 margin-bottom: 3px;
 max-width: 100%;
 vertical-align: bottom;
 `,[$("input",`
 font-size: inherit;
 font-family: inherit;
 min-width: 1px;
 padding: 0;
 background-color: #0000;
 outline: none;
 border: none;
 max-width: 100%;
 overflow: hidden;
 width: 1em;
 line-height: inherit;
 cursor: pointer;
 color: var(--n-text-color);
 caret-color: var(--n-caret-color);
 `),$("mirror",`
 position: absolute;
 left: 0;
 top: 0;
 white-space: pre;
 visibility: hidden;
 user-select: none;
 -webkit-user-select: none;
 opacity: 0;
 `)]),["warning","error"].map(e=>ne(`${e}-status`,[$("state-border",`border: var(--n-border-${e});`),nt("disabled",[de("&:hover",[$("state-border",`
 box-shadow: var(--n-box-shadow-hover-${e});
 border: var(--n-border-hover-${e});
 `)]),ne("active",[$("state-border",`
 box-shadow: var(--n-box-shadow-active-${e});
 border: var(--n-border-active-${e});
 `),k("base-selection-label",`background-color: var(--n-color-active-${e});`),k("base-selection-tags",`background-color: var(--n-color-active-${e});`)]),ne("focus",[$("state-border",`
 box-shadow: var(--n-box-shadow-focus-${e});
 border: var(--n-border-focus-${e});
 `)])])]))]),k("base-selection-popover",`
 margin-bottom: -3px;
 display: flex;
 flex-wrap: wrap;
 margin-right: -8px;
 `),k("base-selection-tag-wrapper",`
 max-width: 100%;
 display: inline-flex;
 padding: 0 7px 3px 0;
 `,[de("&:last-child","padding-right: 0;"),k("tag",`
 font-size: 14px;
 max-width: 100%;
 `,[$("content",`
 line-height: 1.25;
 text-overflow: ellipsis;
 overflow: hidden;
 `)])])]),jn=ve({name:"InternalSelection",props:Object.assign(Object.assign({},Te.props),{clsPrefix:{type:String,required:!0},bordered:{type:Boolean,default:void 0},active:Boolean,pattern:{type:String,default:""},placeholder:String,selectedOption:{type:Object,default:null},selectedOptions:{type:Array,default:null},labelField:{type:String,default:"label"},valueField:{type:String,default:"value"},multiple:Boolean,filterable:Boolean,clearable:Boolean,disabled:Boolean,size:{type:String,default:"medium"},loading:Boolean,autofocus:Boolean,showArrow:{type:Boolean,default:!0},inputProps:Object,focused:Boolean,renderTag:Function,onKeydown:Function,onClick:Function,onBlur:Function,onFocus:Function,onDeleteOption:Function,maxTagCount:[String,Number],ellipsisTagPopoverProps:Object,onClear:Function,onPatternInput:Function,onPatternFocus:Function,onPatternBlur:Function,renderLabel:Function,status:String,inlineThemeDisabled:Boolean,ignoreComposition:{type:Boolean,default:!0},onResize:Function}),setup(e){const{mergedClsPrefixRef:n,mergedRtlRef:i}=it(e),s=Tt("InternalSelection",i,n),r=F(null),c=F(null),g=F(null),a=F(null),P=F(null),I=F(null),S=F(null),V=F(null),D=F(null),B=F(null),p=F(!1),y=F(!1),H=F(!1),C=Te("InternalSelection","-internal-selection",Vn,on,e,ee(e,"clsPrefix")),O=z(()=>e.clearable&&!e.disabled&&(H.value||e.active)),j=z(()=>e.selectedOption?e.renderTag?e.renderTag({option:e.selectedOption,handleClose:()=>{}}):e.renderLabel?e.renderLabel(e.selectedOption,!0):Ce(e.selectedOption[e.labelField],e.selectedOption,!0):e.placeholder),Q=z(()=>{const l=e.selectedOption;if(l)return l[e.labelField]}),G=z(()=>e.multiple?!!(Array.isArray(e.selectedOptions)&&e.selectedOptions.length):e.selectedOption!==null);function K(){var l;const{value:v}=r;if(v){const{value:U}=c;U&&(U.style.width=`${v.offsetWidth}px`,e.maxTagCount!=="responsive"&&((l=D.value)===null||l===void 0||l.sync({showAllItemsBeforeCalculate:!1})))}}function Y(){const{value:l}=B;l&&(l.style.display="none")}function oe(){const{value:l}=B;l&&(l.style.display="inline-block")}Re(ee(e,"active"),l=>{l||Y()}),Re(ee(e,"pattern"),()=>{e.multiple&&Ct(K)});function le(l){const{onFocus:v}=e;v&&v(l)}function re(l){const{onBlur:v}=e;v&&v(l)}function h(l){const{onDeleteOption:v}=e;v&&v(l)}function b(l){const{onClear:v}=e;v&&v(l)}function m(l){const{onPatternInput:v}=e;v&&v(l)}function _(l){var v;(!l.relatedTarget||!(!((v=g.value)===null||v===void 0)&&v.contains(l.relatedTarget)))&&le(l)}function E(l){var v;!((v=g.value)===null||v===void 0)&&v.contains(l.relatedTarget)||re(l)}function N(l){b(l)}function A(){H.value=!0}function L(){H.value=!1}function J(l){!e.active||!e.filterable||l.target!==c.value&&l.preventDefault()}function X(l){h(l)}function ie(l){if(l.key==="Backspace"&&!o.value&&!e.pattern.length){const{selectedOptions:v}=e;v!=null&&v.length&&X(v[v.length-1])}}const o=F(!1);let f=null;function W(l){const{value:v}=r;if(v){const U=l.target.value;v.textContent=U,K()}e.ignoreComposition&&o.value?f=l:m(l)}function ue(){o.value=!0}function we(){o.value=!1,e.ignoreComposition&&m(f),f=null}function ye(l){var v;y.value=!0,(v=e.onPatternFocus)===null||v===void 0||v.call(e,l)}function ce(l){var v;y.value=!1,(v=e.onPatternBlur)===null||v===void 0||v.call(e,l)}function te(){var l,v;if(e.filterable)y.value=!1,(l=I.value)===null||l===void 0||l.blur(),(v=c.value)===null||v===void 0||v.blur();else if(e.multiple){const{value:U}=a;U==null||U.blur()}else{const{value:U}=P;U==null||U.blur()}}function xe(){var l,v,U;e.filterable?(y.value=!1,(l=I.value)===null||l===void 0||l.focus()):e.multiple?(v=a.value)===null||v===void 0||v.focus():(U=P.value)===null||U===void 0||U.focus()}function fe(){const{value:l}=c;l&&(oe(),l.focus())}function Fe(){const{value:l}=c;l&&l.blur()}function Oe(l){const{value:v}=S;v&&v.setTextContent(`+${l}`)}function Me(){const{value:l}=V;return l}function Pe(){return c.value}let ge=null;function be(){ge!==null&&window.clearTimeout(ge)}function ke(){e.active||(be(),ge=window.setTimeout(()=>{G.value&&(p.value=!0)},100))}function ze(){be()}function Ie(l){l||(be(),p.value=!1)}Re(G,l=>{l||(p.value=!1)}),Ke(()=>{ln(()=>{const l=I.value;l&&(e.disabled?l.removeAttribute("tabindex"):l.tabIndex=y.value?-1:0)})}),Ft(g,e.onResize);const{inlineThemeDisabled:Se}=e,pe=z(()=>{const{size:l}=e,{common:{cubicBezierEaseInOut:v},self:{borderRadius:U,color:Ue,placeholderColor:qe,textColor:_e,paddingSingle:$e,paddingMultiple:Ee,caretColor:Ge,colorDisabled:Xe,textColorDisabled:Ne,placeholderColorDisabled:he,colorActive:t,boxShadowFocus:u,boxShadowActive:w,boxShadowHover:M,border:R,borderFocus:x,borderHover:T,borderActive:q,arrowColor:ae,arrowColorDisabled:Ye,loadingColor:Mt,colorActiveWarning:Pt,boxShadowFocusWarning:kt,boxShadowActiveWarning:zt,boxShadowHoverWarning:It,borderWarning:Bt,borderFocusWarning:_t,borderHoverWarning:$t,borderActiveWarning:Et,colorActiveError:Nt,boxShadowFocusError:At,boxShadowActiveError:Lt,boxShadowHoverError:Dt,borderError:Vt,borderFocusError:jt,borderHoverError:Wt,borderActiveError:Ht,clearColor:Kt,clearColorHover:Ut,clearColorPressed:qt,clearSize:Gt,arrowSize:Xt,[me("height",l)]:Yt,[me("fontSize",l)]:Qt}}=C.value,Ae=Be($e),Le=Be(Ee);return{"--n-bezier":v,"--n-border":R,"--n-border-active":q,"--n-border-focus":x,"--n-border-hover":T,"--n-border-radius":U,"--n-box-shadow-active":w,"--n-box-shadow-focus":u,"--n-box-shadow-hover":M,"--n-caret-color":Ge,"--n-color":Ue,"--n-color-active":t,"--n-color-disabled":Xe,"--n-font-size":Qt,"--n-height":Yt,"--n-padding-single-top":Ae.top,"--n-padding-multiple-top":Le.top,"--n-padding-single-right":Ae.right,"--n-padding-multiple-right":Le.right,"--n-padding-single-left":Ae.left,"--n-padding-multiple-left":Le.left,"--n-padding-single-bottom":Ae.bottom,"--n-padding-multiple-bottom":Le.bottom,"--n-placeholder-color":qe,"--n-placeholder-color-disabled":he,"--n-text-color":_e,"--n-text-color-disabled":Ne,"--n-arrow-color":ae,"--n-arrow-color-disabled":Ye,"--n-loading-color":Mt,"--n-color-active-warning":Pt,"--n-box-shadow-focus-warning":kt,"--n-box-shadow-active-warning":zt,"--n-box-shadow-hover-warning":It,"--n-border-warning":Bt,"--n-border-focus-warning":_t,"--n-border-hover-warning":$t,"--n-border-active-warning":Et,"--n-color-active-error":Nt,"--n-box-shadow-focus-error":At,"--n-box-shadow-active-error":Lt,"--n-box-shadow-hover-error":Dt,"--n-border-error":Vt,"--n-border-focus-error":jt,"--n-border-hover-error":Wt,"--n-border-active-error":Ht,"--n-clear-size":Gt,"--n-clear-color":Kt,"--n-clear-color-hover":Ut,"--n-clear-color-pressed":qt,"--n-arrow-size":Xt}}),Z=Se?rt("internal-selection",z(()=>e.size[0]),pe,e):void 0;return{mergedTheme:C,mergedClearable:O,mergedClsPrefix:n,rtlEnabled:s,patternInputFocused:y,filterablePlaceholder:j,label:Q,selected:G,showTagsPanel:p,isComposing:o,counterRef:S,counterWrapperRef:V,patternInputMirrorRef:r,patternInputRef:c,selfRef:g,multipleElRef:a,singleElRef:P,patternInputWrapperRef:I,overflowRef:D,inputTagElRef:B,handleMouseDown:J,handleFocusin:_,handleClear:N,handleMouseEnter:A,handleMouseLeave:L,handleDeleteOption:X,handlePatternKeyDown:ie,handlePatternInputInput:W,handlePatternInputBlur:ce,handlePatternInputFocus:ye,handleMouseEnterCounter:ke,handleMouseLeaveCounter:ze,handleFocusout:E,handleCompositionEnd:we,handleCompositionStart:ue,onPopoverUpdateShow:Ie,focus:xe,focusInput:fe,blur:te,blurInput:Fe,updateCounter:Oe,getCounter:Me,getTail:Pe,renderLabel:e.renderLabel,cssVars:Se?void 0:pe,themeClass:Z==null?void 0:Z.themeClass,onRender:Z==null?void 0:Z.onRender}},render(){const{status:e,multiple:n,size:i,disabled:s,filterable:r,maxTagCount:c,bordered:g,clsPrefix:a,ellipsisTagPopoverProps:P,onRender:I,renderTag:S,renderLabel:V}=this;I==null||I();const D=c==="responsive",B=typeof c=="number",p=D||B,y=d(cn,null,{default:()=>d(Fn,{clsPrefix:a,loading:this.loading,showArrow:this.showArrow,showClear:this.mergedClearable&&this.selected,onClear:this.handleClear},{default:()=>{var C,O;return(O=(C=this.$slots).arrow)===null||O===void 0?void 0:O.call(C)}})});let H;if(n){const{labelField:C}=this,O=m=>d("div",{class:`${a}-base-selection-tag-wrapper`,key:m.value},S?S({option:m,handleClose:()=>{this.handleDeleteOption(m)}}):d(Qe,{size:i,closable:!m.disabled,disabled:s,onClose:()=>{this.handleDeleteOption(m)},internalCloseIsButtonTag:!1,internalCloseFocusable:!1},{default:()=>V?V(m,!0):Ce(m[C],m,!0)})),j=()=>(B?this.selectedOptions.slice(0,c):this.selectedOptions).map(O),Q=r?d("div",{class:`${a}-base-selection-input-tag`,ref:"inputTagElRef",key:"__input-tag__"},d("input",Object.assign({},this.inputProps,{ref:"patternInputRef",tabindex:-1,disabled:s,value:this.pattern,autofocus:this.autofocus,class:`${a}-base-selection-input-tag__input`,onBlur:this.handlePatternInputBlur,onFocus:this.handlePatternInputFocus,onKeydown:this.handlePatternKeyDown,onInput:this.handlePatternInputInput,onCompositionstart:this.handleCompositionStart,onCompositionend:this.handleCompositionEnd})),d("span",{ref:"patternInputMirrorRef",class:`${a}-base-selection-input-tag__mirror`},this.pattern)):null,G=D?()=>d("div",{class:`${a}-base-selection-tag-wrapper`,ref:"counterWrapperRef"},d(Qe,{size:i,ref:"counterRef",onMouseenter:this.handleMouseEnterCounter,onMouseleave:this.handleMouseLeaveCounter,disabled:s})):void 0;let K;if(B){const m=this.selectedOptions.length-c;m>0&&(K=d("div",{class:`${a}-base-selection-tag-wrapper`,key:"__counter__"},d(Qe,{size:i,ref:"counterRef",onMouseenter:this.handleMouseEnterCounter,disabled:s},{default:()=>`+${m}`})))}const Y=D?r?d(ht,{ref:"overflowRef",updateCounter:this.updateCounter,getCounter:this.getCounter,getTail:this.getTail,style:{width:"100%",display:"flex",overflow:"hidden"}},{default:j,counter:G,tail:()=>Q}):d(ht,{ref:"overflowRef",updateCounter:this.updateCounter,getCounter:this.getCounter,style:{width:"100%",display:"flex",overflow:"hidden"}},{default:j,counter:G}):B&&K?j().concat(K):j(),oe=p?()=>d("div",{class:`${a}-base-selection-popover`},D?j():this.selectedOptions.map(O)):void 0,le=p?Object.assign({show:this.showTagsPanel,trigger:"hover",overlap:!0,placement:"top",width:"trigger",onUpdateShow:this.onPopoverUpdateShow,theme:this.mergedTheme.peers.Popover,themeOverrides:this.mergedTheme.peerOverrides.Popover},P):null,h=(this.selected?!1:this.active?!this.pattern&&!this.isComposing:!0)?d("div",{class:`${a}-base-selection-placeholder ${a}-base-selection-overlay`},d("div",{class:`${a}-base-selection-placeholder__inner`},this.placeholder)):null,b=r?d("div",{ref:"patternInputWrapperRef",class:`${a}-base-selection-tags`},Y,D?null:Q,y):d("div",{ref:"multipleElRef",class:`${a}-base-selection-tags`,tabindex:s?void 0:0},Y,y);H=d(rn,null,p?d(Sn,Object.assign({},le,{scrollable:!0,style:"max-height: calc(var(--v-target-height) * 6.6);"}),{trigger:()=>b,default:oe}):b,h)}else if(r){const C=this.pattern||this.isComposing,O=this.active?!C:!this.selected,j=this.active?!1:this.selected;H=d("div",{ref:"patternInputWrapperRef",class:`${a}-base-selection-label`,title:this.patternInputFocused?void 0:vt(this.label)},d("input",Object.assign({},this.inputProps,{ref:"patternInputRef",class:`${a}-base-selection-input`,value:this.active?this.pattern:"",placeholder:"",readonly:s,disabled:s,tabindex:-1,autofocus:this.autofocus,onFocus:this.handlePatternInputFocus,onBlur:this.handlePatternInputBlur,onInput:this.handlePatternInputInput,onCompositionstart:this.handleCompositionStart,onCompositionend:this.handleCompositionEnd})),j?d("div",{class:`${a}-base-selection-label__render-label ${a}-base-selection-overlay`,key:"input"},d("div",{class:`${a}-base-selection-overlay__wrapper`},S?S({option:this.selectedOption,handleClose:()=>{}}):V?V(this.selectedOption,!0):Ce(this.label,this.selectedOption,!0))):null,O?d("div",{class:`${a}-base-selection-placeholder ${a}-base-selection-overlay`,key:"placeholder"},d("div",{class:`${a}-base-selection-overlay__wrapper`},this.filterablePlaceholder)):null,y)}else H=d("div",{ref:"singleElRef",class:`${a}-base-selection-label`,tabindex:this.disabled?void 0:0},this.label!==void 0?d("div",{class:`${a}-base-selection-input`,title:vt(this.label),key:"input"},d("div",{class:`${a}-base-selection-input__content`},S?S({option:this.selectedOption,handleClose:()=>{}}):V?V(this.selectedOption,!0):Ce(this.label,this.selectedOption,!0))):d("div",{class:`${a}-base-selection-placeholder ${a}-base-selection-overlay`,key:"placeholder"},d("div",{class:`${a}-base-selection-placeholder__inner`},this.placeholder)),y);return d("div",{ref:"selfRef",class:[`${a}-base-selection`,this.rtlEnabled&&`${a}-base-selection--rtl`,this.themeClass,e&&`${a}-base-selection--${e}-status`,{[`${a}-base-selection--active`]:this.active,[`${a}-base-selection--selected`]:this.selected||this.active&&this.pattern,[`${a}-base-selection--disabled`]:this.disabled,[`${a}-base-selection--multiple`]:this.multiple,[`${a}-base-selection--focus`]:this.focused}],style:this.cssVars,onClick:this.onClick,onMouseenter:this.handleMouseEnter,onMouseleave:this.handleMouseLeave,onKeydown:this.onKeydown,onFocusin:this.handleFocusin,onFocusout:this.handleFocusout,onMousedown:this.handleMouseDown},H,g?d("div",{class:`${a}-base-selection__border`}):null,g?d("div",{class:`${a}-base-selection__state-border`}):null)}});function He(e){return e.type==="group"}function Ot(e){return e.type==="ignored"}function tt(e,n){try{return!!(1+n.toString().toLowerCase().indexOf(e.trim().toLowerCase()))}catch{return!1}}function Wn(e,n){return{getIsGroup:He,getIgnored:Ot,getKey(s){return He(s)?s.name||s.key||"key-required":s[e]},getChildren(s){return s[n]}}}function Hn(e,n,i,s){if(!n)return e;function r(c){if(!Array.isArray(c))return[];const g=[];for(const a of c)if(He(a)){const P=r(a[s]);P.length&&g.push(Object.assign({},a,{[s]:P}))}else{if(Ot(a))continue;n(i,a)&&g.push(a)}return g}return r(e)}function Kn(e,n,i){const s=new Map;return e.forEach(r=>{He(r)?r[i].forEach(c=>{s.set(c[n],c)}):s.set(r[n],r)}),s}const Un=de([k("select",`
 z-index: auto;
 outline: none;
 width: 100%;
 position: relative;
 `),k("select-menu",`
 margin: 4px 0;
 box-shadow: var(--n-menu-box-shadow);
 `,[Rt({originalTransition:"background-color .3s var(--n-bezier), box-shadow .3s var(--n-bezier)"})])]),qn=Object.assign(Object.assign({},Te.props),{to:lt.propTo,bordered:{type:Boolean,default:void 0},clearable:Boolean,clearFilterAfterSelect:{type:Boolean,default:!0},options:{type:Array,default:()=>[]},defaultValue:{type:[String,Number,Array],default:null},keyboard:{type:Boolean,default:!0},value:[String,Number,Array],placeholder:String,menuProps:Object,multiple:Boolean,size:String,filterable:Boolean,disabled:{type:Boolean,default:void 0},remote:Boolean,loading:Boolean,filter:Function,placement:{type:String,default:"bottom-start"},widthMode:{type:String,default:"trigger"},tag:Boolean,onCreate:Function,fallbackOption:{type:[Function,Boolean],default:void 0},show:{type:Boolean,default:void 0},showArrow:{type:Boolean,default:!0},maxTagCount:[Number,String],ellipsisTagPopoverProps:Object,consistentMenuWidth:{type:Boolean,default:!0},virtualScroll:{type:Boolean,default:!0},labelField:{type:String,default:"label"},valueField:{type:String,default:"value"},childrenField:{type:String,default:"children"},renderLabel:Function,renderOption:Function,renderTag:Function,"onUpdate:value":[Function,Array],inputProps:Object,nodeProps:Function,ignoreComposition:{type:Boolean,default:!0},showOnFocus:Boolean,onUpdateValue:[Function,Array],onBlur:[Function,Array],onClear:[Function,Array],onFocus:[Function,Array],onScroll:[Function,Array],onSearch:[Function,Array],onUpdateShow:[Function,Array],"onUpdate:show":[Function,Array],displayDirective:{type:String,default:"show"},resetMenuOnOptionsChange:{type:Boolean,default:!0},status:String,showCheckmark:{type:Boolean,default:!0},onChange:[Function,Array],items:Array}),vo=ve({name:"Select",props:qn,setup(e){const{mergedClsPrefixRef:n,mergedBorderedRef:i,namespaceRef:s,inlineThemeDisabled:r}=it(e),c=Te("Select","-select",Un,dn,e,n),g=F(e.defaultValue),a=ee(e,"value"),P=ct(a,g),I=F(!1),S=F(""),V=z(()=>{const{valueField:t,childrenField:u}=e,w=Wn(t,u);return Pn(b.value,w)}),D=z(()=>Kn(re.value,e.valueField,e.childrenField)),B=F(!1),p=ct(ee(e,"show"),B),y=F(null),H=F(null),C=F(null),{localeRef:O}=vn("Select"),j=z(()=>{var t;return(t=e.placeholder)!==null&&t!==void 0?t:O.value.placeholder}),Q=gn(e,["items","options"]),G=[],K=F([]),Y=F([]),oe=F(new Map),le=z(()=>{const{fallbackOption:t}=e;if(t===void 0){const{labelField:u,valueField:w}=e;return M=>({[u]:String(M),[w]:M})}return t===!1?!1:u=>Object.assign(t(u),{value:u})}),re=z(()=>Y.value.concat(K.value).concat(Q.value)),h=z(()=>{const{filter:t}=e;if(t)return t;const{labelField:u,valueField:w}=e;return(M,R)=>{if(!R)return!1;const x=R[u];if(typeof x=="string")return tt(M,x);const T=R[w];return typeof T=="string"?tt(M,T):typeof T=="number"?tt(M,String(T)):!1}}),b=z(()=>{if(e.remote)return Q.value;{const{value:t}=re,{value:u}=S;return!u.length||!e.filterable?t:Hn(t,h.value,u,e.childrenField)}});function m(t){const u=e.remote,{value:w}=oe,{value:M}=D,{value:R}=le,x=[];return t.forEach(T=>{if(M.has(T))x.push(M.get(T));else if(u&&w.has(T))x.push(w.get(T));else if(R){const q=R(T);q&&x.push(q)}}),x}const _=z(()=>{if(e.multiple){const{value:t}=P;return Array.isArray(t)?m(t):[]}return null}),E=z(()=>{const{value:t}=P;return!e.multiple&&!Array.isArray(t)?t===null?null:m([t])[0]||null:null}),N=pn(e),{mergedSizeRef:A,mergedDisabledRef:L,mergedStatusRef:J}=N;function X(t,u){const{onChange:w,"onUpdate:value":M,onUpdateValue:R}=e,{nTriggerFormChange:x,nTriggerFormInput:T}=N;w&&se(w,t,u),R&&se(R,t,u),M&&se(M,t,u),g.value=t,x(),T()}function ie(t){const{onBlur:u}=e,{nTriggerFormBlur:w}=N;u&&se(u,t),w()}function o(){const{onClear:t}=e;t&&se(t)}function f(t){const{onFocus:u,showOnFocus:w}=e,{nTriggerFormFocus:M}=N;u&&se(u,t),M(),w&&ce()}function W(t){const{onSearch:u}=e;u&&se(u,t)}function ue(t){const{onScroll:u}=e;u&&se(u,t)}function we(){var t;const{remote:u,multiple:w}=e;if(u){const{value:M}=oe;if(w){const{valueField:R}=e;(t=_.value)===null||t===void 0||t.forEach(x=>{M.set(x[R],x)})}else{const R=E.value;R&&M.set(R[e.valueField],R)}}}function ye(t){const{onUpdateShow:u,"onUpdate:show":w}=e;u&&se(u,t),w&&se(w,t),B.value=t}function ce(){L.value||(ye(!0),B.value=!0,e.filterable&&Ee())}function te(){ye(!1)}function xe(){S.value="",Y.value=G}const fe=F(!1);function Fe(){e.filterable&&(fe.value=!0)}function Oe(){e.filterable&&(fe.value=!1,p.value||xe())}function Me(){L.value||(p.value?e.filterable?Ee():te():ce())}function Pe(t){var u,w;!((w=(u=C.value)===null||u===void 0?void 0:u.selfRef)===null||w===void 0)&&w.contains(t.relatedTarget)||(I.value=!1,ie(t),te())}function ge(t){f(t),I.value=!0}function be(t){I.value=!0}function ke(t){var u;!((u=y.value)===null||u===void 0)&&u.$el.contains(t.relatedTarget)||(I.value=!1,ie(t),te())}function ze(){var t;(t=y.value)===null||t===void 0||t.focus(),te()}function Ie(t){var u;p.value&&(!((u=y.value)===null||u===void 0)&&u.$el.contains(hn(t))||te())}function Se(t){if(!Array.isArray(t))return[];if(le.value)return Array.from(t);{const{remote:u}=e,{value:w}=D;if(u){const{value:M}=oe;return t.filter(R=>w.has(R)||M.has(R))}else return t.filter(M=>w.has(M))}}function pe(t){Z(t.rawNode)}function Z(t){if(L.value)return;const{tag:u,remote:w,clearFilterAfterSelect:M,valueField:R}=e;if(u&&!w){const{value:x}=Y,T=x[0]||null;if(T){const q=K.value;q.length?q.push(T):K.value=[T],Y.value=G}}if(w&&oe.value.set(t[R],t),e.multiple){const x=Se(P.value),T=x.findIndex(q=>q===t[R]);if(~T){if(x.splice(T,1),u&&!w){const q=l(t[R]);~q&&(K.value.splice(q,1),M&&(S.value=""))}}else x.push(t[R]),M&&(S.value="");X(x,m(x))}else{if(u&&!w){const x=l(t[R]);~x?K.value=[K.value[x]]:K.value=G}$e(),te(),X(t[R],t)}}function l(t){return K.value.findIndex(w=>w[e.valueField]===t)}function v(t){p.value||ce();const{value:u}=t.target;S.value=u;const{tag:w,remote:M}=e;if(W(u),w&&!M){if(!u){Y.value=G;return}const{onCreate:R}=e,x=R?R(u):{[e.labelField]:u,[e.valueField]:u},{valueField:T,labelField:q}=e;Q.value.some(ae=>ae[T]===x[T]||ae[q]===x[q])||K.value.some(ae=>ae[T]===x[T]||ae[q]===x[q])?Y.value=G:Y.value=[x]}}function U(t){t.stopPropagation();const{multiple:u}=e;!u&&e.filterable&&te(),o(),u?X([],[]):X(null,null)}function Ue(t){!We(t,"action")&&!We(t,"empty")&&t.preventDefault()}function qe(t){ue(t)}function _e(t){var u,w,M,R,x;if(!e.keyboard){t.preventDefault();return}switch(t.key){case" ":if(e.filterable)break;t.preventDefault();case"Enter":if(!(!((u=y.value)===null||u===void 0)&&u.isComposing)){if(p.value){const T=(w=C.value)===null||w===void 0?void 0:w.getPendingTmNode();T?pe(T):e.filterable||(te(),$e())}else if(ce(),e.tag&&fe.value){const T=Y.value[0];if(T){const q=T[e.valueField],{value:ae}=P;e.multiple&&Array.isArray(ae)&&ae.some(Ye=>Ye===q)||Z(T)}}}t.preventDefault();break;case"ArrowUp":if(t.preventDefault(),e.loading)return;p.value&&((M=C.value)===null||M===void 0||M.prev());break;case"ArrowDown":if(t.preventDefault(),e.loading)return;p.value?(R=C.value)===null||R===void 0||R.next():ce();break;case"Escape":p.value&&(zn(t),te()),(x=y.value)===null||x===void 0||x.focus();break}}function $e(){var t;(t=y.value)===null||t===void 0||t.focus()}function Ee(){var t;(t=y.value)===null||t===void 0||t.focusInput()}function Ge(){var t;p.value&&((t=H.value)===null||t===void 0||t.syncPosition())}we(),Re(ee(e,"options"),we);const Xe={focus:()=>{var t;(t=y.value)===null||t===void 0||t.focus()},focusInput:()=>{var t;(t=y.value)===null||t===void 0||t.focusInput()},blur:()=>{var t;(t=y.value)===null||t===void 0||t.blur()},blurInput:()=>{var t;(t=y.value)===null||t===void 0||t.blurInput()}},Ne=z(()=>{const{self:{menuBoxShadow:t}}=c.value;return{"--n-menu-box-shadow":t}}),he=r?rt("select",void 0,Ne,e):void 0;return Object.assign(Object.assign({},Xe),{mergedStatus:J,mergedClsPrefix:n,mergedBordered:i,namespace:s,treeMate:V,isMounted:fn(),triggerRef:y,menuRef:C,pattern:S,uncontrolledShow:B,mergedShow:p,adjustedTo:lt(e),uncontrolledValue:g,mergedValue:P,followerRef:H,localizedPlaceholder:j,selectedOption:E,selectedOptions:_,mergedSize:A,mergedDisabled:L,focused:I,activeWithoutMenuOpen:fe,inlineThemeDisabled:r,onTriggerInputFocus:Fe,onTriggerInputBlur:Oe,handleTriggerOrMenuResize:Ge,handleMenuFocus:be,handleMenuBlur:ke,handleMenuTabOut:ze,handleTriggerClick:Me,handleToggle:pe,handleDeleteOption:Z,handlePatternInput:v,handleClear:U,handleTriggerBlur:Pe,handleTriggerFocus:ge,handleKeydown:_e,handleMenuAfterLeave:xe,handleMenuClickOutside:Ie,handleMenuScroll:qe,handleMenuKeydown:_e,handleMenuMousedown:Ue,mergedTheme:c,cssVars:r?void 0:Ne,themeClass:he==null?void 0:he.themeClass,onRender:he==null?void 0:he.onRender})},render(){return d("div",{class:`${this.mergedClsPrefix}-select`},d(Cn,null,{default:()=>[d(Rn,null,{default:()=>d(jn,{ref:"triggerRef",inlineThemeDisabled:this.inlineThemeDisabled,status:this.mergedStatus,inputProps:this.inputProps,clsPrefix:this.mergedClsPrefix,showArrow:this.showArrow,maxTagCount:this.maxTagCount,ellipsisTagPopoverProps:this.ellipsisTagPopoverProps,bordered:this.mergedBordered,active:this.activeWithoutMenuOpen||this.mergedShow,pattern:this.pattern,placeholder:this.localizedPlaceholder,selectedOption:this.selectedOption,selectedOptions:this.selectedOptions,multiple:this.multiple,renderTag:this.renderTag,renderLabel:this.renderLabel,filterable:this.filterable,clearable:this.clearable,disabled:this.mergedDisabled,size:this.mergedSize,theme:this.mergedTheme.peers.InternalSelection,labelField:this.labelField,valueField:this.valueField,themeOverrides:this.mergedTheme.peerOverrides.InternalSelection,loading:this.loading,focused:this.focused,onClick:this.handleTriggerClick,onDeleteOption:this.handleDeleteOption,onPatternInput:this.handlePatternInput,onClear:this.handleClear,onBlur:this.handleTriggerBlur,onFocus:this.handleTriggerFocus,onKeydown:this.handleKeydown,onPatternBlur:this.onTriggerInputBlur,onPatternFocus:this.onTriggerInputFocus,onResize:this.handleTriggerOrMenuResize,ignoreComposition:this.ignoreComposition},{arrow:()=>{var e,n;return[(n=(e=this.$slots).arrow)===null||n===void 0?void 0:n.call(e)]}})}),d(Tn,{ref:"followerRef",show:this.mergedShow,to:this.adjustedTo,teleportDisabled:this.adjustedTo===lt.tdkey,containerClass:this.namespace,width:this.consistentMenuWidth?"target":void 0,minWidth:"target",placement:this.placement},{default:()=>d(St,{name:"fade-in-scale-up-transition",appear:this.isMounted,onAfterLeave:this.handleMenuAfterLeave},{default:()=>{var e,n,i;return this.mergedShow||this.displayDirective==="show"?((e=this.onRender)===null||e===void 0||e.call(this),an(d(Dn,Object.assign({},this.menuProps,{ref:"menuRef",onResize:this.handleTriggerOrMenuResize,inlineThemeDisabled:this.inlineThemeDisabled,virtualScroll:this.consistentMenuWidth&&this.virtualScroll,class:[`${this.mergedClsPrefix}-select-menu`,this.themeClass,(n=this.menuProps)===null||n===void 0?void 0:n.class],clsPrefix:this.mergedClsPrefix,focusable:!0,labelField:this.labelField,valueField:this.valueField,autoPending:!0,nodeProps:this.nodeProps,theme:this.mergedTheme.peers.InternalSelectMenu,themeOverrides:this.mergedTheme.peerOverrides.InternalSelectMenu,treeMate:this.treeMate,multiple:this.multiple,size:"medium",renderOption:this.renderOption,renderLabel:this.renderLabel,value:this.mergedValue,style:[(i=this.menuProps)===null||i===void 0?void 0:i.style,this.cssVars],onToggle:this.handleToggle,onScroll:this.handleMenuScroll,onFocus:this.handleMenuFocus,onBlur:this.handleMenuBlur,onKeydown:this.handleMenuKeydown,onTabOut:this.handleMenuTabOut,onMousedown:this.handleMenuMousedown,show:this.mergedShow,showCheckmark:this.showCheckmark,resetMenuOnOptionsChange:this.resetMenuOnOptionsChange}),{empty:()=>{var s,r;return[(r=(s=this.$slots).empty)===null||r===void 0?void 0:r.call(s)]},header:()=>{var s,r;return[(r=(s=this.$slots).header)===null||r===void 0?void 0:r.call(s)]},action:()=>{var s,r;return[(r=(s=this.$slots).action)===null||r===void 0?void 0:r.call(s)]}}),this.displayDirective==="show"?[[sn,this.mergedShow],[gt,this.handleMenuClickOutside,void 0,{capture:!0}]]:[[gt,this.handleMenuClickOutside,void 0,{capture:!0}]])):null}})})]}))}});export{Nn as F,vo as N,$n as V,Dn as a,En as b,Wn as c,jn as d,Ze as m,Ft as u};
