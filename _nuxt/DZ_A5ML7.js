import{ag as ve,cM as Qt,k as Ke,aS as Zt,aV as en,a5 as I,r as T,cb as We,j as d,aN as tn,aT as wt,aB as yt,V as xt,b$ as k,ca as E,c8 as le,b_ as se,c9 as tt,c1 as Te,c0 as lt,br as Z,bY as nn,z as Re,b1 as at,aO as St,ci as me,dB as on,bM as ln,N as rn,bR as an,bJ as sn,dC as dn}from"./BTQEsmYp.js";import{f as Ct}from"./CRCZbITq.js";import{V as st,r as dt,S as un,W as cn,u as ut,i as fn,g as hn}from"./4EKlgVAE.js";import{u as vn}from"./CinWyaZU.js";import{u as gn}from"./BZP1k2LW.js";import{b as bn,u as pn}from"./B8YebtwT.js";import{h as nt,p as Ve,N as mn,b as Rt,u as it,r as ct,d as wn,g as Be,c as ae}from"./D0-2sOt0.js";import{b as yn,i as rt,c as xn,N as Sn,u as ot,B as Cn,V as Rn,a as Tn}from"./BSEEEEx2.js";import{N as Fn}from"./D4lvRBt2.js";import{N as Xe}from"./DwBFns6k.js";import{V as ft}from"./DuQ5ir8O.js";import{r as Ce}from"./C3yc3EA2.js";import{g as ht}from"./Cz32yFEB.js";import{a as vt}from"./BG4ehpiy.js";import{c as On,a as Je}from"./CcLqpMe6.js";import{h as _e}from"./CM8LO42l.js";import{N as Mn}from"./DpQMzMV1.js";import{b as kn,c as Pn}from"./DXruQSCb.js";import{m as zn}from"./DsSU6HIH.js";function Qe(e){const n=e.filter(i=>i!==void 0);if(n.length!==0)return n.length===1?n[0]:i=>{e.forEach(s=>{s&&s(i)})}}function gt(e){return e&-e}class In{constructor(n,i){this.l=n,this.min=i;const s=new Array(n+1);for(let r=0;r<n+1;++r)s[r]=0;this.ft=s}add(n,i){if(i===0)return;const{l:s,ft:r}=this;for(n+=1;n<=s;)r[n]+=i,n+=gt(n)}get(n){return this.sum(n+1)-this.sum(n)}sum(n){if(n===void 0&&(n=this.l),n<=0)return 0;const{ft:i,min:s,l:r}=this;if(n>r)throw new Error("[FinweckTree.sum]: `i` is larger than length.");let c=n*s;for(;n>0;)c+=i[n],n-=gt(n);return c}getBound(n){let i=0,s=this.l;for(;s>i;){const r=Math.floor((i+s)/2),c=this.sum(r);if(c>n){s=r;continue}else if(c<n){if(i===r)return this.sum(i+1)<=n?i+1:r;i=r}else return r}return i}}let je;function Bn(){return typeof document>"u"?!1:(je===void 0&&("matchMedia"in window?je=window.matchMedia("(pointer:coarse)").matches:je=!1),je)}let Ze;function bt(){return typeof document>"u"?1:(Ze===void 0&&(Ze="chrome"in window?window.devicePixelRatio:1),Ze)}const _n=Je(".v-vl",{maxHeight:"inherit",height:"100%",overflow:"auto",minWidth:"1px"},[Je("&:not(.v-vl--show-scrollbar)",{scrollbarWidth:"none"},[Je("&::-webkit-scrollbar, &::-webkit-scrollbar-track-piece, &::-webkit-scrollbar-thumb",{width:0,height:0,display:"none"})])]),$n=ve({name:"VirtualList",inheritAttrs:!1,props:{showScrollbar:{type:Boolean,default:!0},items:{type:Array,default:()=>[]},itemSize:{type:Number,required:!0},itemResizable:Boolean,itemsStyle:[String,Object],visibleItemsTag:{type:[String,Object],default:"div"},visibleItemsProps:Object,ignoreItemResize:Boolean,onScroll:Function,onWheel:Function,onResize:Function,defaultScrollKey:[Number,String],defaultScrollIndex:Number,keyField:{type:String,default:"key"},paddingTop:{type:[Number,String],default:0},paddingBottom:{type:[Number,String],default:0}},setup(e){const n=Qt();_n.mount({id:"vueuc/virtual-list",head:!0,anchorMetaName:On,ssr:n}),Ke(()=>{const{defaultScrollIndex:h,defaultScrollKey:b}=e;h!=null?w({index:h}):b!=null&&w({key:b})});let i=!1,s=!1;Zt(()=>{if(i=!1,!s){s=!0;return}w({top:W.value,left:x})}),en(()=>{i=!0,s||(s=!0)});const r=I(()=>{const h=new Map,{keyField:b}=e;return e.items.forEach((p,_)=>{h.set(p[b],_)}),h}),c=T(null),g=T(void 0),a=new Map,M=I(()=>{const{items:h,itemSize:b,keyField:p}=e,_=new In(h.length,b);return h.forEach((D,L)=>{const V=D[p],j=a.get(V);j!==void 0&&_.add(L,j)}),_}),B=T(0);let x=0;const W=T(0),P=We(()=>Math.max(M.value.getBound(W.value-nt(e.paddingTop))-1,0)),F=I(()=>{const{value:h}=g;if(h===void 0)return[];const{items:b,itemSize:p}=e,_=P.value,D=Math.min(_+Math.ceil(h/p+1),b.length-1),L=[];for(let V=_;V<=D;++V)L.push(b[V]);return L}),w=(h,b)=>{if(typeof h=="number"){S(h,b,"auto");return}const{left:p,top:_,index:D,key:L,position:V,behavior:j,debounce:J=!0}=h;if(p!==void 0||_!==void 0)S(p,_,j);else if(D!==void 0)z(D,j,J);else if(L!==void 0){const Y=r.value.get(L);Y!==void 0&&z(Y,j,J)}else V==="bottom"?S(0,Number.MAX_SAFE_INTEGER,j):V==="top"&&S(0,0,j)};let $,q=null;function z(h,b,p){const{value:_}=M,D=_.sum(h)+nt(e.paddingTop);if(!p)c.value.scrollTo({left:0,top:D,behavior:b});else{$=h,q!==null&&window.clearTimeout(q),q=window.setTimeout(()=>{$=void 0,q=null},16);const{scrollTop:L,offsetHeight:V}=c.value;if(D>L){const j=_.get(h);D+j<=L+V||c.value.scrollTo({left:0,top:D+j-V,behavior:b})}else c.value.scrollTo({left:0,top:D,behavior:b})}}function S(h,b,p){c.value.scrollTo({left:h,top:b,behavior:p})}function A(h,b){var p,_,D;if(i||e.ignoreItemResize||ne(b.target))return;const{value:L}=M,V=r.value.get(h),j=L.get(V),J=(D=(_=(p=b.borderBoxSize)===null||p===void 0?void 0:p[0])===null||_===void 0?void 0:_.blockSize)!==null&&D!==void 0?D:b.contentRect.height;if(J===j)return;J-e.itemSize===0?a.delete(h):a.set(h,J-e.itemSize);const X=J-j;if(X===0)return;L.add(V,X);const o=c.value;if(o!=null){if($===void 0){const f=L.sum(V);o.scrollTop>f&&o.scrollBy(0,X)}else if(V<$)o.scrollBy(0,X);else if(V===$){const f=L.sum(V);J+f>o.scrollTop+o.offsetHeight&&o.scrollBy(0,X)}ie()}B.value++}const H=!Bn();let N=!1;function te(h){var b;(b=e.onScroll)===null||b===void 0||b.call(e,h),(!H||!N)&&ie()}function ee(h){var b;if((b=e.onWheel)===null||b===void 0||b.call(e,h),H){const p=c.value;if(p!=null){if(h.deltaX===0&&(p.scrollTop===0&&h.deltaY<=0||p.scrollTop+p.offsetHeight>=p.scrollHeight&&h.deltaY>=0))return;h.preventDefault(),p.scrollTop+=h.deltaY/bt(),p.scrollLeft+=h.deltaX/bt(),ie(),N=!0,yn(()=>{N=!1})}}}function de(h){if(i||ne(h.target)||h.contentRect.height===g.value)return;g.value=h.contentRect.height;const{onResize:b}=e;b!==void 0&&b(h)}function ie(){const{value:h}=c;h!=null&&(W.value=h.scrollTop,x=h.scrollLeft)}function ne(h){let b=h;for(;b!==null;){if(b.style.display==="none")return!0;b=b.parentElement}return!1}return{listHeight:g,listStyle:{overflow:"auto"},keyToIndex:r,itemsStyle:I(()=>{const{itemResizable:h}=e,b=Ve(M.value.sum());return B.value,[e.itemsStyle,{boxSizing:"content-box",height:h?"":b,minHeight:h?b:"",paddingTop:Ve(e.paddingTop),paddingBottom:Ve(e.paddingBottom)}]}),visibleItemsStyle:I(()=>(B.value,{transform:`translateY(${Ve(M.value.sum(P.value))})`})),viewportItems:F,listElRef:c,itemsElRef:T(null),scrollTo:w,handleListResize:de,handleListScroll:te,handleListWheel:ee,handleItemResize:A}},render(){const{itemResizable:e,keyField:n,keyToIndex:i,visibleItemsTag:s}=this;return d(st,{onResize:this.handleListResize},{default:()=>{var r,c;return d("div",tn(this.$attrs,{class:["v-vl",this.showScrollbar&&"v-vl--show-scrollbar"],onScroll:this.handleListScroll,onWheel:this.handleListWheel,ref:"listElRef"}),[this.items.length!==0?d("div",{ref:"itemsElRef",class:"v-vl-items",style:this.itemsStyle},[d(s,Object.assign({class:"v-vl-visible-items",style:this.visibleItemsStyle},this.visibleItemsProps),{default:()=>this.viewportItems.map(g=>{const a=g[n],M=i.get(a),B=this.$slots.default({item:g,index:M})[0];return e?d(st,{key:a,onResize:x=>this.handleItemResize(a,x)},{default:()=>B}):(B.key=a,B)})})]):(c=(r=this.$slots).empty)===null||c===void 0?void 0:c.call(r)])}})}});function Tt(e,n){n&&(Ke(()=>{const{value:i}=e;i&&dt.registerHandler(i,n)}),wt(()=>{const{value:i}=e;i&&dt.unregisterHandler(i)}))}const Nn=ve({name:"Checkmark",render(){return d("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 16 16"},d("g",{fill:"none"},d("path",{d:"M14.046 3.486a.75.75 0 0 1-.032 1.06l-7.93 7.474a.85.85 0 0 1-1.188-.022l-2.68-2.72a.75.75 0 1 1 1.068-1.053l2.234 2.267l7.468-7.038a.75.75 0 0 1 1.06.032z",fill:"currentColor"})))}}),En=ve({props:{onFocus:Function,onBlur:Function},setup(e){return()=>d("div",{style:"width: 0; height: 0",tabindex:0,onFocus:e.onFocus,onBlur:e.onBlur})}});function An(e,n){return d(xt,{name:"fade-in-scale-up-transition"},{default:()=>e?d(mn,{clsPrefix:n,class:`${n}-base-select-option__check`},{default:()=>d(Nn)}):null})}const pt=ve({name:"NBaseSelectOption",props:{clsPrefix:{type:String,required:!0},tmNode:{type:Object,required:!0}},setup(e){const{valueRef:n,pendingTmNodeRef:i,multipleRef:s,valueSetRef:r,renderLabelRef:c,renderOptionRef:g,labelFieldRef:a,valueFieldRef:M,showCheckmarkRef:B,nodePropsRef:x,handleOptionClick:W,handleOptionMouseEnter:P}=yt(rt),F=We(()=>{const{value:z}=i;return z?e.tmNode.key===z.key:!1});function w(z){const{tmNode:S}=e;S.disabled||W(z,S)}function $(z){const{tmNode:S}=e;S.disabled||P(z,S)}function q(z){const{tmNode:S}=e,{value:A}=F;S.disabled||A||P(z,S)}return{multiple:s,isGrouped:We(()=>{const{tmNode:z}=e,{parent:S}=z;return S&&S.rawNode.type==="group"}),showCheckmark:B,nodeProps:x,isPending:F,isSelected:We(()=>{const{value:z}=n,{value:S}=s;if(z===null)return!1;const A=e.tmNode.rawNode[M.value];if(S){const{value:H}=r;return H.has(A)}else return z===A}),labelField:a,renderLabel:c,renderOption:g,handleMouseMove:q,handleMouseEnter:$,handleClick:w}},render(){const{clsPrefix:e,tmNode:{rawNode:n},isSelected:i,isPending:s,isGrouped:r,showCheckmark:c,nodeProps:g,renderOption:a,renderLabel:M,handleClick:B,handleMouseEnter:x,handleMouseMove:W}=this,P=An(i,e),F=M?[M(n,i),c&&P]:[Ce(n[this.labelField],n,i),c&&P],w=g==null?void 0:g(n),$=d("div",Object.assign({},w,{class:[`${e}-base-select-option`,n.class,w==null?void 0:w.class,{[`${e}-base-select-option--disabled`]:n.disabled,[`${e}-base-select-option--selected`]:i,[`${e}-base-select-option--grouped`]:r,[`${e}-base-select-option--pending`]:s,[`${e}-base-select-option--show-checkmark`]:c}],style:[(w==null?void 0:w.style)||"",n.style||""],onClick:Qe([B,w==null?void 0:w.onClick]),onMouseenter:Qe([x,w==null?void 0:w.onMouseenter]),onMousemove:Qe([W,w==null?void 0:w.onMousemove])}),d("div",{class:`${e}-base-select-option__content`},F));return n.render?n.render({node:$,option:n,selected:i}):a?a({node:$,option:n,selected:i}):$}}),mt=ve({name:"NBaseSelectGroupHeader",props:{clsPrefix:{type:String,required:!0},tmNode:{type:Object,required:!0}},setup(){const{renderLabelRef:e,renderOptionRef:n,labelFieldRef:i,nodePropsRef:s}=yt(rt);return{labelField:i,nodeProps:s,renderLabel:e,renderOption:n}},render(){const{clsPrefix:e,renderLabel:n,renderOption:i,nodeProps:s,tmNode:{rawNode:r}}=this,c=s==null?void 0:s(r),g=n?n(r,!1):Ce(r[this.labelField],r,!1),a=d("div",Object.assign({},c,{class:[`${e}-base-select-group-header`,c==null?void 0:c.class]}),g);return r.render?r.render({node:a,option:r}):i?i({node:a,option:r,selected:!1}):a}}),Dn=k("base-select-menu",`
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
 `,[E("content",`
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
 `),E("loading, empty",`
 display: flex;
 padding: 12px 32px;
 flex: 1;
 justify-content: center;
 `),E("loading",`
 color: var(--n-loading-color);
 font-size: var(--n-loading-size);
 `),E("header",`
 padding: 8px var(--n-option-padding-left);
 font-size: var(--n-option-font-size);
 transition: 
 color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 border-bottom: 1px solid var(--n-action-divider-color);
 color: var(--n-action-text-color);
 `),E("action",`
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
 `,[le("show-checkmark",`
 padding-right: calc(var(--n-option-padding-right) + 20px);
 `),se("&::before",`
 content: "";
 position: absolute;
 left: 4px;
 right: 4px;
 top: 0;
 bottom: 0;
 border-radius: var(--n-border-radius);
 transition: background-color .3s var(--n-bezier);
 `),se("&:active",`
 color: var(--n-option-text-color-pressed);
 `),le("grouped",`
 padding-left: calc(var(--n-option-padding-left) * 1.5);
 `),le("pending",[se("&::before",`
 background-color: var(--n-option-color-pending);
 `)]),le("selected",`
 color: var(--n-option-text-color-active);
 `,[se("&::before",`
 background-color: var(--n-option-color-active);
 `),le("pending",[se("&::before",`
 background-color: var(--n-option-color-active-pending);
 `)])]),le("disabled",`
 cursor: not-allowed;
 `,[tt("selected",`
 color: var(--n-option-text-color-disabled);
 `),le("selected",`
 opacity: var(--n-option-opacity-disabled);
 `)]),E("check",`
 font-size: 16px;
 position: absolute;
 right: calc(var(--n-option-padding-right) - 4px);
 top: calc(50% - 7px);
 color: var(--n-option-check-color);
 transition: color .3s var(--n-bezier);
 `,[Ct({enterScale:"0.5"})])])]),Ln=ve({name:"InternalSelectMenu",props:Object.assign(Object.assign({},Te.props),{clsPrefix:{type:String,required:!0},scrollable:{type:Boolean,default:!0},treeMate:{type:Object,required:!0},multiple:Boolean,size:{type:String,default:"medium"},value:{type:[String,Number,Array],default:null},autoPending:Boolean,virtualScroll:{type:Boolean,default:!0},show:{type:Boolean,default:!0},labelField:{type:String,default:"label"},valueField:{type:String,default:"value"},loading:Boolean,focusable:Boolean,renderLabel:Function,renderOption:Function,nodeProps:Function,showCheckmark:{type:Boolean,default:!0},onMousedown:Function,onScroll:Function,onFocus:Function,onBlur:Function,onKeyup:Function,onKeydown:Function,onTabOut:Function,onMouseenter:Function,onMouseleave:Function,onResize:Function,resetMenuOnOptionsChange:{type:Boolean,default:!0},inlineThemeDisabled:Boolean,onToggle:Function}),setup(e){const{mergedClsPrefixRef:n,mergedRtlRef:i}=lt(e),s=Rt("InternalSelectMenu",i,n),r=Te("InternalSelectMenu","-internal-select-menu",Dn,nn,e,Z(e,"clsPrefix")),c=T(null),g=T(null),a=T(null),M=I(()=>e.treeMate.getFlattenedNodes()),B=I(()=>kn(M.value)),x=T(null);function W(){const{treeMate:o}=e;let f=null;const{value:K}=e;K===null?f=o.getFirstAvailableNode():(e.multiple?f=o.getNode((K||[])[(K||[]).length-1]):f=o.getNode(K),(!f||f.disabled)&&(f=o.getFirstAvailableNode())),_(f||null)}function P(){const{value:o}=x;o&&!e.treeMate.getNode(o.key)&&(x.value=null)}let F;Re(()=>e.show,o=>{o?F=Re(()=>e.treeMate,()=>{e.resetMenuOnOptionsChange?(e.autoPending?W():P(),St(D)):P()},{immediate:!0}):F==null||F()},{immediate:!0}),wt(()=>{F==null||F()});const w=I(()=>nt(r.value.self[me("optionHeight",e.size)])),$=I(()=>Be(r.value.self[me("padding",e.size)])),q=I(()=>e.multiple&&Array.isArray(e.value)?new Set(e.value):new Set),z=I(()=>{const o=M.value;return o&&o.length===0});function S(o){const{onToggle:f}=e;f&&f(o)}function A(o){const{onScroll:f}=e;f&&f(o)}function H(o){var f;(f=a.value)===null||f===void 0||f.sync(),A(o)}function N(){var o;(o=a.value)===null||o===void 0||o.sync()}function te(){const{value:o}=x;return o||null}function ee(o,f){f.disabled||_(f,!1)}function de(o,f){f.disabled||S(f)}function ie(o){var f;_e(o,"action")||(f=e.onKeyup)===null||f===void 0||f.call(e,o)}function ne(o){var f;_e(o,"action")||(f=e.onKeydown)===null||f===void 0||f.call(e,o)}function h(o){var f;(f=e.onMousedown)===null||f===void 0||f.call(e,o),!e.focusable&&o.preventDefault()}function b(){const{value:o}=x;o&&_(o.getNext({loop:!0}),!0)}function p(){const{value:o}=x;o&&_(o.getPrev({loop:!0}),!0)}function _(o,f=!1){x.value=o,f&&D()}function D(){var o,f;const K=x.value;if(!K)return;const ue=B.value(K.key);ue!==null&&(e.virtualScroll?(o=g.value)===null||o===void 0||o.scrollTo({index:ue}):(f=a.value)===null||f===void 0||f.scrollTo({index:ue,elSize:w.value}))}function L(o){var f,K;!((f=c.value)===null||f===void 0)&&f.contains(o.target)&&((K=e.onFocus)===null||K===void 0||K.call(e,o))}function V(o){var f,K;!((f=c.value)===null||f===void 0)&&f.contains(o.relatedTarget)||(K=e.onBlur)===null||K===void 0||K.call(e,o)}at(rt,{handleOptionMouseEnter:ee,handleOptionClick:de,valueSetRef:q,pendingTmNodeRef:x,nodePropsRef:Z(e,"nodeProps"),showCheckmarkRef:Z(e,"showCheckmark"),multipleRef:Z(e,"multiple"),valueRef:Z(e,"value"),renderLabelRef:Z(e,"renderLabel"),renderOptionRef:Z(e,"renderOption"),labelFieldRef:Z(e,"labelField"),valueFieldRef:Z(e,"valueField")}),at(xn,c),Ke(()=>{const{value:o}=a;o&&o.sync()});const j=I(()=>{const{size:o}=e,{common:{cubicBezierEaseInOut:f},self:{height:K,borderRadius:ue,color:we,groupHeaderTextColor:ye,actionDividerColor:ce,optionTextColorPressed:oe,optionTextColor:xe,optionTextColorDisabled:fe,optionTextColorActive:Fe,optionOpacityDisabled:Oe,optionCheckColor:Me,actionTextColor:ke,optionColorPending:ge,optionColorActive:be,loadingColor:Pe,loadingSize:ze,optionColorActivePending:Ie,[me("optionFontSize",o)]:Se,[me("optionHeight",o)]:pe,[me("optionPadding",o)]:Q}}=r.value;return{"--n-height":K,"--n-action-divider-color":ce,"--n-action-text-color":ke,"--n-bezier":f,"--n-border-radius":ue,"--n-color":we,"--n-option-font-size":Se,"--n-group-header-text-color":ye,"--n-option-check-color":Me,"--n-option-color-pending":ge,"--n-option-color-active":be,"--n-option-color-active-pending":Ie,"--n-option-height":pe,"--n-option-opacity-disabled":Oe,"--n-option-text-color":xe,"--n-option-text-color-active":Fe,"--n-option-text-color-disabled":fe,"--n-option-text-color-pressed":oe,"--n-option-padding":Q,"--n-option-padding-left":Be(Q,"left"),"--n-option-padding-right":Be(Q,"right"),"--n-loading-color":Pe,"--n-loading-size":ze}}),{inlineThemeDisabled:J}=e,Y=J?it("internal-select-menu",I(()=>e.size[0]),j,e):void 0,X={selfRef:c,next:b,prev:p,getPendingTmNode:te};return Tt(c,e.onResize),Object.assign({mergedTheme:r,mergedClsPrefix:n,rtlEnabled:s,virtualListRef:g,scrollbarRef:a,itemSize:w,padding:$,flattenedNodes:M,empty:z,virtualListContainer(){const{value:o}=g;return o==null?void 0:o.listElRef},virtualListContent(){const{value:o}=g;return o==null?void 0:o.itemsElRef},doScroll:A,handleFocusin:L,handleFocusout:V,handleKeyUp:ie,handleKeyDown:ne,handleMouseDown:h,handleVirtualListResize:N,handleVirtualListScroll:H,cssVars:J?void 0:j,themeClass:Y==null?void 0:Y.themeClass,onRender:Y==null?void 0:Y.onRender},X)},render(){const{$slots:e,virtualScroll:n,clsPrefix:i,mergedTheme:s,themeClass:r,onRender:c}=this;return c==null||c(),d("div",{ref:"selfRef",tabindex:this.focusable?0:-1,class:[`${i}-base-select-menu`,this.rtlEnabled&&`${i}-base-select-menu--rtl`,r,this.multiple&&`${i}-base-select-menu--multiple`],style:this.cssVars,onFocusin:this.handleFocusin,onFocusout:this.handleFocusout,onKeyup:this.handleKeyUp,onKeydown:this.handleKeyDown,onMousedown:this.handleMouseDown,onMouseenter:this.onMouseenter,onMouseleave:this.onMouseleave},ct(e.header,g=>g&&d("div",{class:`${i}-base-select-menu__header`,"data-header":!0,key:"header"},g)),this.loading?d("div",{class:`${i}-base-select-menu__loading`},d(bn,{clsPrefix:i,strokeWidth:20})):this.empty?d("div",{class:`${i}-base-select-menu__empty`,"data-empty":!0},wn(e.empty,()=>[d(Mn,{theme:s.peers.Empty,themeOverrides:s.peerOverrides.Empty})])):d(un,{ref:"scrollbarRef",theme:s.peers.Scrollbar,themeOverrides:s.peerOverrides.Scrollbar,scrollable:this.scrollable,container:n?this.virtualListContainer:void 0,content:n?this.virtualListContent:void 0,onScroll:n?void 0:this.doScroll},{default:()=>n?d($n,{ref:"virtualListRef",class:`${i}-virtual-list`,items:this.flattenedNodes,itemSize:this.itemSize,showScrollbar:!1,paddingTop:this.padding.top,paddingBottom:this.padding.bottom,onResize:this.handleVirtualListResize,onScroll:this.handleVirtualListScroll,itemResizable:!0},{default:({item:g})=>g.isGroup?d(mt,{key:g.key,clsPrefix:i,tmNode:g}):g.ignored?null:d(pt,{clsPrefix:i,key:g.key,tmNode:g})}):d("div",{class:`${i}-base-select-menu-option-wrapper`,style:{paddingTop:this.padding.top,paddingBottom:this.padding.bottom}},this.flattenedNodes.map(g=>g.isGroup?d(mt,{key:g.key,clsPrefix:i,tmNode:g}):d(pt,{clsPrefix:i,key:g.key,tmNode:g})))}),ct(e.action,g=>g&&[d("div",{class:`${i}-base-select-menu__action`,"data-action":!0,key:"action"},g),d(En,{onFocus:this.onTabOut,key:"focus-detector"})]))}}),Vn=se([k("base-selection",`
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
 `),k("base-selection-tags","min-height: var(--n-height);"),E("border, state-border",`
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
 `),E("state-border",`
 z-index: 1;
 border-color: #0000;
 `),k("base-suffix",`
 cursor: pointer;
 position: absolute;
 top: 50%;
 transform: translateY(-50%);
 right: 10px;
 `,[E("arrow",`
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
 `,[E("wrapper",`
 flex-basis: 0;
 flex-grow: 1;
 overflow: hidden;
 text-overflow: ellipsis;
 `)]),k("base-selection-placeholder",`
 color: var(--n-placeholder-color);
 `,[E("inner",`
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
 `,[E("content",`
 text-overflow: ellipsis;
 overflow: hidden;
 white-space: nowrap; 
 `)]),E("render-label",`
 color: var(--n-text-color);
 `)]),tt("disabled",[se("&:hover",[E("state-border",`
 box-shadow: var(--n-box-shadow-hover);
 border: var(--n-border-hover);
 `)]),le("focus",[E("state-border",`
 box-shadow: var(--n-box-shadow-focus);
 border: var(--n-border-focus);
 `)]),le("active",[E("state-border",`
 box-shadow: var(--n-box-shadow-active);
 border: var(--n-border-active);
 `),k("base-selection-label","background-color: var(--n-color-active);"),k("base-selection-tags","background-color: var(--n-color-active);")])]),le("disabled","cursor: not-allowed;",[E("arrow",`
 color: var(--n-arrow-color-disabled);
 `),k("base-selection-label",`
 cursor: not-allowed;
 background-color: var(--n-color-disabled);
 `,[k("base-selection-input",`
 cursor: not-allowed;
 color: var(--n-text-color-disabled);
 `),E("render-label",`
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
 `,[E("input",`
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
 `),E("mirror",`
 position: absolute;
 left: 0;
 top: 0;
 white-space: pre;
 visibility: hidden;
 user-select: none;
 -webkit-user-select: none;
 opacity: 0;
 `)]),["warning","error"].map(e=>le(`${e}-status`,[E("state-border",`border: var(--n-border-${e});`),tt("disabled",[se("&:hover",[E("state-border",`
 box-shadow: var(--n-box-shadow-hover-${e});
 border: var(--n-border-hover-${e});
 `)]),le("active",[E("state-border",`
 box-shadow: var(--n-box-shadow-active-${e});
 border: var(--n-border-active-${e});
 `),k("base-selection-label",`background-color: var(--n-color-active-${e});`),k("base-selection-tags",`background-color: var(--n-color-active-${e});`)]),le("focus",[E("state-border",`
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
 `,[se("&:last-child","padding-right: 0;"),k("tag",`
 font-size: 14px;
 max-width: 100%;
 `,[E("content",`
 line-height: 1.25;
 text-overflow: ellipsis;
 overflow: hidden;
 `)])])]),jn=ve({name:"InternalSelection",props:Object.assign(Object.assign({},Te.props),{clsPrefix:{type:String,required:!0},bordered:{type:Boolean,default:void 0},active:Boolean,pattern:{type:String,default:""},placeholder:String,selectedOption:{type:Object,default:null},selectedOptions:{type:Array,default:null},labelField:{type:String,default:"label"},valueField:{type:String,default:"value"},multiple:Boolean,filterable:Boolean,clearable:Boolean,disabled:Boolean,size:{type:String,default:"medium"},loading:Boolean,autofocus:Boolean,showArrow:{type:Boolean,default:!0},inputProps:Object,focused:Boolean,renderTag:Function,onKeydown:Function,onClick:Function,onBlur:Function,onFocus:Function,onDeleteOption:Function,maxTagCount:[String,Number],ellipsisTagPopoverProps:Object,onClear:Function,onPatternInput:Function,onPatternFocus:Function,onPatternBlur:Function,renderLabel:Function,status:String,inlineThemeDisabled:Boolean,ignoreComposition:{type:Boolean,default:!0},onResize:Function}),setup(e){const{mergedClsPrefixRef:n,mergedRtlRef:i}=lt(e),s=Rt("InternalSelection",i,n),r=T(null),c=T(null),g=T(null),a=T(null),M=T(null),B=T(null),x=T(null),W=T(null),P=T(null),F=T(null),w=T(!1),$=T(!1),q=T(!1),z=Te("InternalSelection","-internal-selection",Vn,on,e,Z(e,"clsPrefix")),S=I(()=>e.clearable&&!e.disabled&&(q.value||e.active)),A=I(()=>e.selectedOption?e.renderTag?e.renderTag({option:e.selectedOption,handleClose:()=>{}}):e.renderLabel?e.renderLabel(e.selectedOption,!0):Ce(e.selectedOption[e.labelField],e.selectedOption,!0):e.placeholder),H=I(()=>{const l=e.selectedOption;if(l)return l[e.labelField]}),N=I(()=>e.multiple?!!(Array.isArray(e.selectedOptions)&&e.selectedOptions.length):e.selectedOption!==null);function te(){var l;const{value:v}=r;if(v){const{value:U}=c;U&&(U.style.width=`${v.offsetWidth}px`,e.maxTagCount!=="responsive"&&((l=P.value)===null||l===void 0||l.sync({showAllItemsBeforeCalculate:!1})))}}function ee(){const{value:l}=F;l&&(l.style.display="none")}function de(){const{value:l}=F;l&&(l.style.display="inline-block")}Re(Z(e,"active"),l=>{l||ee()}),Re(Z(e,"pattern"),()=>{e.multiple&&St(te)});function ie(l){const{onFocus:v}=e;v&&v(l)}function ne(l){const{onBlur:v}=e;v&&v(l)}function h(l){const{onDeleteOption:v}=e;v&&v(l)}function b(l){const{onClear:v}=e;v&&v(l)}function p(l){const{onPatternInput:v}=e;v&&v(l)}function _(l){var v;(!l.relatedTarget||!(!((v=g.value)===null||v===void 0)&&v.contains(l.relatedTarget)))&&ie(l)}function D(l){var v;!((v=g.value)===null||v===void 0)&&v.contains(l.relatedTarget)||ne(l)}function L(l){b(l)}function V(){q.value=!0}function j(){q.value=!1}function J(l){!e.active||!e.filterable||l.target!==c.value&&l.preventDefault()}function Y(l){h(l)}const X=T(!1);function o(l){if(l.key==="Backspace"&&!X.value&&!e.pattern.length){const{selectedOptions:v}=e;v!=null&&v.length&&Y(v[v.length-1])}}let f=null;function K(l){const{value:v}=r;if(v){const U=l.target.value;v.textContent=U,te()}e.ignoreComposition&&X.value?f=l:p(l)}function ue(){X.value=!0}function we(){X.value=!1,e.ignoreComposition&&p(f),f=null}function ye(l){var v;$.value=!0,(v=e.onPatternFocus)===null||v===void 0||v.call(e,l)}function ce(l){var v;$.value=!1,(v=e.onPatternBlur)===null||v===void 0||v.call(e,l)}function oe(){var l,v;if(e.filterable)$.value=!1,(l=B.value)===null||l===void 0||l.blur(),(v=c.value)===null||v===void 0||v.blur();else if(e.multiple){const{value:U}=a;U==null||U.blur()}else{const{value:U}=M;U==null||U.blur()}}function xe(){var l,v,U;e.filterable?($.value=!1,(l=B.value)===null||l===void 0||l.focus()):e.multiple?(v=a.value)===null||v===void 0||v.focus():(U=M.value)===null||U===void 0||U.focus()}function fe(){const{value:l}=c;l&&(de(),l.focus())}function Fe(){const{value:l}=c;l&&l.blur()}function Oe(l){const{value:v}=x;v&&v.setTextContent(`+${l}`)}function Me(){const{value:l}=W;return l}function ke(){return c.value}let ge=null;function be(){ge!==null&&window.clearTimeout(ge)}function Pe(){e.active||(be(),ge=window.setTimeout(()=>{N.value&&(w.value=!0)},100))}function ze(){be()}function Ie(l){l||(be(),w.value=!1)}Re(N,l=>{l||(w.value=!1)}),Ke(()=>{ln(()=>{const l=B.value;l&&(e.disabled?l.removeAttribute("tabindex"):l.tabIndex=$.value?-1:0)})}),Tt(g,e.onResize);const{inlineThemeDisabled:Se}=e,pe=I(()=>{const{size:l}=e,{common:{cubicBezierEaseInOut:v},self:{borderRadius:U,color:Ue,placeholderColor:qe,textColor:$e,paddingSingle:Ne,paddingMultiple:Ee,caretColor:Ge,colorDisabled:Ye,textColorDisabled:Ae,placeholderColorDisabled:he,colorActive:t,boxShadowFocus:u,boxShadowActive:m,boxShadowHover:O,border:C,borderFocus:y,borderHover:R,borderActive:G,arrowColor:re,arrowColorDisabled:Ot,loadingColor:Mt,colorActiveWarning:kt,boxShadowFocusWarning:Pt,boxShadowActiveWarning:zt,boxShadowHoverWarning:It,borderWarning:Bt,borderFocusWarning:_t,borderHoverWarning:$t,borderActiveWarning:Nt,colorActiveError:Et,boxShadowFocusError:At,boxShadowActiveError:Dt,boxShadowHoverError:Lt,borderError:Vt,borderFocusError:jt,borderHoverError:Wt,borderActiveError:Ht,clearColor:Kt,clearColorHover:Ut,clearColorPressed:qt,clearSize:Gt,arrowSize:Yt,[me("height",l)]:Xt,[me("fontSize",l)]:Jt}}=z.value,De=Be(Ne),Le=Be(Ee);return{"--n-bezier":v,"--n-border":C,"--n-border-active":G,"--n-border-focus":y,"--n-border-hover":R,"--n-border-radius":U,"--n-box-shadow-active":m,"--n-box-shadow-focus":u,"--n-box-shadow-hover":O,"--n-caret-color":Ge,"--n-color":Ue,"--n-color-active":t,"--n-color-disabled":Ye,"--n-font-size":Jt,"--n-height":Xt,"--n-padding-single-top":De.top,"--n-padding-multiple-top":Le.top,"--n-padding-single-right":De.right,"--n-padding-multiple-right":Le.right,"--n-padding-single-left":De.left,"--n-padding-multiple-left":Le.left,"--n-padding-single-bottom":De.bottom,"--n-padding-multiple-bottom":Le.bottom,"--n-placeholder-color":qe,"--n-placeholder-color-disabled":he,"--n-text-color":$e,"--n-text-color-disabled":Ae,"--n-arrow-color":re,"--n-arrow-color-disabled":Ot,"--n-loading-color":Mt,"--n-color-active-warning":kt,"--n-box-shadow-focus-warning":Pt,"--n-box-shadow-active-warning":zt,"--n-box-shadow-hover-warning":It,"--n-border-warning":Bt,"--n-border-focus-warning":_t,"--n-border-hover-warning":$t,"--n-border-active-warning":Nt,"--n-color-active-error":Et,"--n-box-shadow-focus-error":At,"--n-box-shadow-active-error":Dt,"--n-box-shadow-hover-error":Lt,"--n-border-error":Vt,"--n-border-focus-error":jt,"--n-border-hover-error":Wt,"--n-border-active-error":Ht,"--n-clear-size":Gt,"--n-clear-color":Kt,"--n-clear-color-hover":Ut,"--n-clear-color-pressed":qt,"--n-arrow-size":Yt}}),Q=Se?it("internal-selection",I(()=>e.size[0]),pe,e):void 0;return{mergedTheme:z,mergedClearable:S,mergedClsPrefix:n,rtlEnabled:s,patternInputFocused:$,filterablePlaceholder:A,label:H,selected:N,showTagsPanel:w,isComposing:X,counterRef:x,counterWrapperRef:W,patternInputMirrorRef:r,patternInputRef:c,selfRef:g,multipleElRef:a,singleElRef:M,patternInputWrapperRef:B,overflowRef:P,inputTagElRef:F,handleMouseDown:J,handleFocusin:_,handleClear:L,handleMouseEnter:V,handleMouseLeave:j,handleDeleteOption:Y,handlePatternKeyDown:o,handlePatternInputInput:K,handlePatternInputBlur:ce,handlePatternInputFocus:ye,handleMouseEnterCounter:Pe,handleMouseLeaveCounter:ze,handleFocusout:D,handleCompositionEnd:we,handleCompositionStart:ue,onPopoverUpdateShow:Ie,focus:xe,focusInput:fe,blur:oe,blurInput:Fe,updateCounter:Oe,getCounter:Me,getTail:ke,renderLabel:e.renderLabel,cssVars:Se?void 0:pe,themeClass:Q==null?void 0:Q.themeClass,onRender:Q==null?void 0:Q.onRender}},render(){const{status:e,multiple:n,size:i,disabled:s,filterable:r,maxTagCount:c,bordered:g,clsPrefix:a,ellipsisTagPopoverProps:M,onRender:B,renderTag:x,renderLabel:W}=this;B==null||B();const P=c==="responsive",F=typeof c=="number",w=P||F,$=d(cn,null,{default:()=>d(Fn,{clsPrefix:a,loading:this.loading,showArrow:this.showArrow,showClear:this.mergedClearable&&this.selected,onClear:this.handleClear},{default:()=>{var z,S;return(S=(z=this.$slots).arrow)===null||S===void 0?void 0:S.call(z)}})});let q;if(n){const{labelField:z}=this,S=p=>d("div",{class:`${a}-base-selection-tag-wrapper`,key:p.value},x?x({option:p,handleClose:()=>{this.handleDeleteOption(p)}}):d(Xe,{size:i,closable:!p.disabled,disabled:s,onClose:()=>{this.handleDeleteOption(p)},internalCloseIsButtonTag:!1,internalCloseFocusable:!1},{default:()=>W?W(p,!0):Ce(p[z],p,!0)})),A=()=>(F?this.selectedOptions.slice(0,c):this.selectedOptions).map(S),H=r?d("div",{class:`${a}-base-selection-input-tag`,ref:"inputTagElRef",key:"__input-tag__"},d("input",Object.assign({},this.inputProps,{ref:"patternInputRef",tabindex:-1,disabled:s,value:this.pattern,autofocus:this.autofocus,class:`${a}-base-selection-input-tag__input`,onBlur:this.handlePatternInputBlur,onFocus:this.handlePatternInputFocus,onKeydown:this.handlePatternKeyDown,onInput:this.handlePatternInputInput,onCompositionstart:this.handleCompositionStart,onCompositionend:this.handleCompositionEnd})),d("span",{ref:"patternInputMirrorRef",class:`${a}-base-selection-input-tag__mirror`},this.pattern)):null,N=P?()=>d("div",{class:`${a}-base-selection-tag-wrapper`,ref:"counterWrapperRef"},d(Xe,{size:i,ref:"counterRef",onMouseenter:this.handleMouseEnterCounter,onMouseleave:this.handleMouseLeaveCounter,disabled:s})):void 0;let te;if(F){const p=this.selectedOptions.length-c;p>0&&(te=d("div",{class:`${a}-base-selection-tag-wrapper`,key:"__counter__"},d(Xe,{size:i,ref:"counterRef",onMouseenter:this.handleMouseEnterCounter,disabled:s},{default:()=>`+${p}`})))}const ee=P?r?d(ft,{ref:"overflowRef",updateCounter:this.updateCounter,getCounter:this.getCounter,getTail:this.getTail,style:{width:"100%",display:"flex",overflow:"hidden"}},{default:A,counter:N,tail:()=>H}):d(ft,{ref:"overflowRef",updateCounter:this.updateCounter,getCounter:this.getCounter,style:{width:"100%",display:"flex",overflow:"hidden"}},{default:A,counter:N}):F&&te?A().concat(te):A(),de=w?()=>d("div",{class:`${a}-base-selection-popover`},P?A():this.selectedOptions.map(S)):void 0,ie=w?Object.assign({show:this.showTagsPanel,trigger:"hover",overlap:!0,placement:"top",width:"trigger",onUpdateShow:this.onPopoverUpdateShow,theme:this.mergedTheme.peers.Popover,themeOverrides:this.mergedTheme.peerOverrides.Popover},M):null,h=(this.selected?!1:this.active?!this.pattern&&!this.isComposing:!0)?d("div",{class:`${a}-base-selection-placeholder ${a}-base-selection-overlay`},d("div",{class:`${a}-base-selection-placeholder__inner`},this.placeholder)):null,b=r?d("div",{ref:"patternInputWrapperRef",class:`${a}-base-selection-tags`},ee,P?null:H,$):d("div",{ref:"multipleElRef",class:`${a}-base-selection-tags`,tabindex:s?void 0:0},ee,$);q=d(rn,null,w?d(Sn,Object.assign({},ie,{scrollable:!0,style:"max-height: calc(var(--v-target-height) * 6.6);"}),{trigger:()=>b,default:de}):b,h)}else if(r){const z=this.pattern||this.isComposing,S=this.active?!z:!this.selected,A=this.active?!1:this.selected;q=d("div",{ref:"patternInputWrapperRef",class:`${a}-base-selection-label`,title:this.patternInputFocused?void 0:ht(this.label)},d("input",Object.assign({},this.inputProps,{ref:"patternInputRef",class:`${a}-base-selection-input`,value:this.active?this.pattern:"",placeholder:"",readonly:s,disabled:s,tabindex:-1,autofocus:this.autofocus,onFocus:this.handlePatternInputFocus,onBlur:this.handlePatternInputBlur,onInput:this.handlePatternInputInput,onCompositionstart:this.handleCompositionStart,onCompositionend:this.handleCompositionEnd})),A?d("div",{class:`${a}-base-selection-label__render-label ${a}-base-selection-overlay`,key:"input"},d("div",{class:`${a}-base-selection-overlay__wrapper`},x?x({option:this.selectedOption,handleClose:()=>{}}):W?W(this.selectedOption,!0):Ce(this.label,this.selectedOption,!0))):null,S?d("div",{class:`${a}-base-selection-placeholder ${a}-base-selection-overlay`,key:"placeholder"},d("div",{class:`${a}-base-selection-overlay__wrapper`},this.filterablePlaceholder)):null,$)}else q=d("div",{ref:"singleElRef",class:`${a}-base-selection-label`,tabindex:this.disabled?void 0:0},this.label!==void 0?d("div",{class:`${a}-base-selection-input`,title:ht(this.label),key:"input"},d("div",{class:`${a}-base-selection-input__content`},x?x({option:this.selectedOption,handleClose:()=>{}}):W?W(this.selectedOption,!0):Ce(this.label,this.selectedOption,!0))):d("div",{class:`${a}-base-selection-placeholder ${a}-base-selection-overlay`,key:"placeholder"},d("div",{class:`${a}-base-selection-placeholder__inner`},this.placeholder)),$);return d("div",{ref:"selfRef",class:[`${a}-base-selection`,this.rtlEnabled&&`${a}-base-selection--rtl`,this.themeClass,e&&`${a}-base-selection--${e}-status`,{[`${a}-base-selection--active`]:this.active,[`${a}-base-selection--selected`]:this.selected||this.active&&this.pattern,[`${a}-base-selection--disabled`]:this.disabled,[`${a}-base-selection--multiple`]:this.multiple,[`${a}-base-selection--focus`]:this.focused}],style:this.cssVars,onClick:this.onClick,onMouseenter:this.handleMouseEnter,onMouseleave:this.handleMouseLeave,onKeydown:this.onKeydown,onFocusin:this.handleFocusin,onFocusout:this.handleFocusout,onMousedown:this.handleMouseDown},q,g?d("div",{class:`${a}-base-selection__border`}):null,g?d("div",{class:`${a}-base-selection__state-border`}):null)}});function He(e){return e.type==="group"}function Ft(e){return e.type==="ignored"}function et(e,n){try{return!!(1+n.toString().toLowerCase().indexOf(e.trim().toLowerCase()))}catch{return!1}}function Wn(e,n){return{getIsGroup:He,getIgnored:Ft,getKey(s){return He(s)?s.name||s.key||"key-required":s[e]},getChildren(s){return s[n]}}}function Hn(e,n,i,s){if(!n)return e;function r(c){if(!Array.isArray(c))return[];const g=[];for(const a of c)if(He(a)){const M=r(a[s]);M.length&&g.push(Object.assign({},a,{[s]:M}))}else{if(Ft(a))continue;n(i,a)&&g.push(a)}return g}return r(e)}function Kn(e,n,i){const s=new Map;return e.forEach(r=>{He(r)?r[i].forEach(c=>{s.set(c[n],c)}):s.set(r[n],r)}),s}const Un=se([k("select",`
 z-index: auto;
 outline: none;
 width: 100%;
 position: relative;
 `),k("select-menu",`
 margin: 4px 0;
 box-shadow: var(--n-menu-box-shadow);
 `,[Ct({originalTransition:"background-color .3s var(--n-bezier), box-shadow .3s var(--n-bezier)"})])]),qn=Object.assign(Object.assign({},Te.props),{to:ot.propTo,bordered:{type:Boolean,default:void 0},clearable:Boolean,clearFilterAfterSelect:{type:Boolean,default:!0},options:{type:Array,default:()=>[]},defaultValue:{type:[String,Number,Array],default:null},keyboard:{type:Boolean,default:!0},value:[String,Number,Array],placeholder:String,menuProps:Object,multiple:Boolean,size:String,filterable:Boolean,disabled:{type:Boolean,default:void 0},remote:Boolean,loading:Boolean,filter:Function,placement:{type:String,default:"bottom-start"},widthMode:{type:String,default:"trigger"},tag:Boolean,onCreate:Function,fallbackOption:{type:[Function,Boolean],default:void 0},show:{type:Boolean,default:void 0},showArrow:{type:Boolean,default:!0},maxTagCount:[Number,String],ellipsisTagPopoverProps:Object,consistentMenuWidth:{type:Boolean,default:!0},virtualScroll:{type:Boolean,default:!0},labelField:{type:String,default:"label"},valueField:{type:String,default:"value"},childrenField:{type:String,default:"children"},renderLabel:Function,renderOption:Function,renderTag:Function,"onUpdate:value":[Function,Array],inputProps:Object,nodeProps:Function,ignoreComposition:{type:Boolean,default:!0},showOnFocus:Boolean,onUpdateValue:[Function,Array],onBlur:[Function,Array],onClear:[Function,Array],onFocus:[Function,Array],onScroll:[Function,Array],onSearch:[Function,Array],onUpdateShow:[Function,Array],"onUpdate:show":[Function,Array],displayDirective:{type:String,default:"show"},resetMenuOnOptionsChange:{type:Boolean,default:!0},status:String,showCheckmark:{type:Boolean,default:!0},onChange:[Function,Array],items:Array}),vo=ve({name:"Select",props:qn,setup(e){const{mergedClsPrefixRef:n,mergedBorderedRef:i,namespaceRef:s,inlineThemeDisabled:r}=lt(e),c=Te("Select","-select",Un,dn,e,n),g=T(e.defaultValue),a=Z(e,"value"),M=ut(a,g),B=T(!1),x=T(""),W=vn(e,["items","options"]),P=T([]),F=T([]),w=I(()=>F.value.concat(P.value).concat(W.value)),$=I(()=>{const{filter:t}=e;if(t)return t;const{labelField:u,valueField:m}=e;return(O,C)=>{if(!C)return!1;const y=C[u];if(typeof y=="string")return et(O,y);const R=C[m];return typeof R=="string"?et(O,R):typeof R=="number"?et(O,String(R)):!1}}),q=I(()=>{if(e.remote)return W.value;{const{value:t}=w,{value:u}=x;return!u.length||!e.filterable?t:Hn(t,$.value,u,e.childrenField)}}),z=I(()=>{const{valueField:t,childrenField:u}=e,m=Wn(t,u);return Pn(q.value,m)}),S=I(()=>Kn(w.value,e.valueField,e.childrenField)),A=T(!1),H=ut(Z(e,"show"),A),N=T(null),te=T(null),ee=T(null),{localeRef:de}=gn("Select"),ie=I(()=>{var t;return(t=e.placeholder)!==null&&t!==void 0?t:de.value.placeholder}),ne=[],h=T(new Map),b=I(()=>{const{fallbackOption:t}=e;if(t===void 0){const{labelField:u,valueField:m}=e;return O=>({[u]:String(O),[m]:O})}return t===!1?!1:u=>Object.assign(t(u),{value:u})});function p(t){const u=e.remote,{value:m}=h,{value:O}=S,{value:C}=b,y=[];return t.forEach(R=>{if(O.has(R))y.push(O.get(R));else if(u&&m.has(R))y.push(m.get(R));else if(C){const G=C(R);G&&y.push(G)}}),y}const _=I(()=>{if(e.multiple){const{value:t}=M;return Array.isArray(t)?p(t):[]}return null}),D=I(()=>{const{value:t}=M;return!e.multiple&&!Array.isArray(t)?t===null?null:p([t])[0]||null:null}),L=pn(e),{mergedSizeRef:V,mergedDisabledRef:j,mergedStatusRef:J}=L;function Y(t,u){const{onChange:m,"onUpdate:value":O,onUpdateValue:C}=e,{nTriggerFormChange:y,nTriggerFormInput:R}=L;m&&ae(m,t,u),C&&ae(C,t,u),O&&ae(O,t,u),g.value=t,y(),R()}function X(t){const{onBlur:u}=e,{nTriggerFormBlur:m}=L;u&&ae(u,t),m()}function o(){const{onClear:t}=e;t&&ae(t)}function f(t){const{onFocus:u,showOnFocus:m}=e,{nTriggerFormFocus:O}=L;u&&ae(u,t),O(),m&&ce()}function K(t){const{onSearch:u}=e;u&&ae(u,t)}function ue(t){const{onScroll:u}=e;u&&ae(u,t)}function we(){var t;const{remote:u,multiple:m}=e;if(u){const{value:O}=h;if(m){const{valueField:C}=e;(t=_.value)===null||t===void 0||t.forEach(y=>{O.set(y[C],y)})}else{const C=D.value;C&&O.set(C[e.valueField],C)}}}function ye(t){const{onUpdateShow:u,"onUpdate:show":m}=e;u&&ae(u,t),m&&ae(m,t),A.value=t}function ce(){j.value||(ye(!0),A.value=!0,e.filterable&&Ee())}function oe(){ye(!1)}function xe(){x.value="",F.value=ne}const fe=T(!1);function Fe(){e.filterable&&(fe.value=!0)}function Oe(){e.filterable&&(fe.value=!1,H.value||xe())}function Me(){j.value||(H.value?e.filterable?Ee():oe():ce())}function ke(t){var u,m;!((m=(u=ee.value)===null||u===void 0?void 0:u.selfRef)===null||m===void 0)&&m.contains(t.relatedTarget)||(B.value=!1,X(t),oe())}function ge(t){f(t),B.value=!0}function be(){B.value=!0}function Pe(t){var u;!((u=N.value)===null||u===void 0)&&u.$el.contains(t.relatedTarget)||(B.value=!1,X(t),oe())}function ze(){var t;(t=N.value)===null||t===void 0||t.focus(),oe()}function Ie(t){var u;H.value&&(!((u=N.value)===null||u===void 0)&&u.$el.contains(hn(t))||oe())}function Se(t){if(!Array.isArray(t))return[];if(b.value)return Array.from(t);{const{remote:u}=e,{value:m}=S;if(u){const{value:O}=h;return t.filter(C=>m.has(C)||O.has(C))}else return t.filter(O=>m.has(O))}}function pe(t){Q(t.rawNode)}function Q(t){if(j.value)return;const{tag:u,remote:m,clearFilterAfterSelect:O,valueField:C}=e;if(u&&!m){const{value:y}=F,R=y[0]||null;if(R){const G=P.value;G.length?G.push(R):P.value=[R],F.value=ne}}if(m&&h.value.set(t[C],t),e.multiple){const y=Se(M.value),R=y.findIndex(G=>G===t[C]);if(~R){if(y.splice(R,1),u&&!m){const G=l(t[C]);~G&&(P.value.splice(G,1),O&&(x.value=""))}}else y.push(t[C]),O&&(x.value="");Y(y,p(y))}else{if(u&&!m){const y=l(t[C]);~y?P.value=[P.value[y]]:P.value=ne}Ne(),oe(),Y(t[C],t)}}function l(t){return P.value.findIndex(m=>m[e.valueField]===t)}function v(t){H.value||ce();const{value:u}=t.target;x.value=u;const{tag:m,remote:O}=e;if(K(u),m&&!O){if(!u){F.value=ne;return}const{onCreate:C}=e,y=C?C(u):{[e.labelField]:u,[e.valueField]:u},{valueField:R,labelField:G}=e;W.value.some(re=>re[R]===y[R]||re[G]===y[G])||P.value.some(re=>re[R]===y[R]||re[G]===y[G])?F.value=ne:F.value=[y]}}function U(t){t.stopPropagation();const{multiple:u}=e;!u&&e.filterable&&oe(),o(),u?Y([],[]):Y(null,null)}function Ue(t){!_e(t,"action")&&!_e(t,"empty")&&!_e(t,"header")&&t.preventDefault()}function qe(t){ue(t)}function $e(t){var u,m,O,C,y;if(!e.keyboard){t.preventDefault();return}switch(t.key){case" ":if(e.filterable)break;t.preventDefault();case"Enter":if(!(!((u=N.value)===null||u===void 0)&&u.isComposing)){if(H.value){const R=(m=ee.value)===null||m===void 0?void 0:m.getPendingTmNode();R?pe(R):e.filterable||(oe(),Ne())}else if(ce(),e.tag&&fe.value){const R=F.value[0];if(R){const G=R[e.valueField],{value:re}=M;e.multiple&&Array.isArray(re)&&re.includes(G)||Q(R)}}}t.preventDefault();break;case"ArrowUp":if(t.preventDefault(),e.loading)return;H.value&&((O=ee.value)===null||O===void 0||O.prev());break;case"ArrowDown":if(t.preventDefault(),e.loading)return;H.value?(C=ee.value)===null||C===void 0||C.next():ce();break;case"Escape":H.value&&(zn(t),oe()),(y=N.value)===null||y===void 0||y.focus();break}}function Ne(){var t;(t=N.value)===null||t===void 0||t.focus()}function Ee(){var t;(t=N.value)===null||t===void 0||t.focusInput()}function Ge(){var t;H.value&&((t=te.value)===null||t===void 0||t.syncPosition())}we(),Re(Z(e,"options"),we);const Ye={focus:()=>{var t;(t=N.value)===null||t===void 0||t.focus()},focusInput:()=>{var t;(t=N.value)===null||t===void 0||t.focusInput()},blur:()=>{var t;(t=N.value)===null||t===void 0||t.blur()},blurInput:()=>{var t;(t=N.value)===null||t===void 0||t.blurInput()}},Ae=I(()=>{const{self:{menuBoxShadow:t}}=c.value;return{"--n-menu-box-shadow":t}}),he=r?it("select",void 0,Ae,e):void 0;return Object.assign(Object.assign({},Ye),{mergedStatus:J,mergedClsPrefix:n,mergedBordered:i,namespace:s,treeMate:z,isMounted:fn(),triggerRef:N,menuRef:ee,pattern:x,uncontrolledShow:A,mergedShow:H,adjustedTo:ot(e),uncontrolledValue:g,mergedValue:M,followerRef:te,localizedPlaceholder:ie,selectedOption:D,selectedOptions:_,mergedSize:V,mergedDisabled:j,focused:B,activeWithoutMenuOpen:fe,inlineThemeDisabled:r,onTriggerInputFocus:Fe,onTriggerInputBlur:Oe,handleTriggerOrMenuResize:Ge,handleMenuFocus:be,handleMenuBlur:Pe,handleMenuTabOut:ze,handleTriggerClick:Me,handleToggle:pe,handleDeleteOption:Q,handlePatternInput:v,handleClear:U,handleTriggerBlur:ke,handleTriggerFocus:ge,handleKeydown:$e,handleMenuAfterLeave:xe,handleMenuClickOutside:Ie,handleMenuScroll:qe,handleMenuKeydown:$e,handleMenuMousedown:Ue,mergedTheme:c,cssVars:r?void 0:Ae,themeClass:he==null?void 0:he.themeClass,onRender:he==null?void 0:he.onRender})},render(){return d("div",{class:`${this.mergedClsPrefix}-select`},d(Cn,null,{default:()=>[d(Rn,null,{default:()=>d(jn,{ref:"triggerRef",inlineThemeDisabled:this.inlineThemeDisabled,status:this.mergedStatus,inputProps:this.inputProps,clsPrefix:this.mergedClsPrefix,showArrow:this.showArrow,maxTagCount:this.maxTagCount,ellipsisTagPopoverProps:this.ellipsisTagPopoverProps,bordered:this.mergedBordered,active:this.activeWithoutMenuOpen||this.mergedShow,pattern:this.pattern,placeholder:this.localizedPlaceholder,selectedOption:this.selectedOption,selectedOptions:this.selectedOptions,multiple:this.multiple,renderTag:this.renderTag,renderLabel:this.renderLabel,filterable:this.filterable,clearable:this.clearable,disabled:this.mergedDisabled,size:this.mergedSize,theme:this.mergedTheme.peers.InternalSelection,labelField:this.labelField,valueField:this.valueField,themeOverrides:this.mergedTheme.peerOverrides.InternalSelection,loading:this.loading,focused:this.focused,onClick:this.handleTriggerClick,onDeleteOption:this.handleDeleteOption,onPatternInput:this.handlePatternInput,onClear:this.handleClear,onBlur:this.handleTriggerBlur,onFocus:this.handleTriggerFocus,onKeydown:this.handleKeydown,onPatternBlur:this.onTriggerInputBlur,onPatternFocus:this.onTriggerInputFocus,onResize:this.handleTriggerOrMenuResize,ignoreComposition:this.ignoreComposition},{arrow:()=>{var e,n;return[(n=(e=this.$slots).arrow)===null||n===void 0?void 0:n.call(e)]}})}),d(Tn,{ref:"followerRef",show:this.mergedShow,to:this.adjustedTo,teleportDisabled:this.adjustedTo===ot.tdkey,containerClass:this.namespace,width:this.consistentMenuWidth?"target":void 0,minWidth:"target",placement:this.placement},{default:()=>d(xt,{name:"fade-in-scale-up-transition",appear:this.isMounted,onAfterLeave:this.handleMenuAfterLeave},{default:()=>{var e,n,i;return this.mergedShow||this.displayDirective==="show"?((e=this.onRender)===null||e===void 0||e.call(this),an(d(Ln,Object.assign({},this.menuProps,{ref:"menuRef",onResize:this.handleTriggerOrMenuResize,inlineThemeDisabled:this.inlineThemeDisabled,virtualScroll:this.consistentMenuWidth&&this.virtualScroll,class:[`${this.mergedClsPrefix}-select-menu`,this.themeClass,(n=this.menuProps)===null||n===void 0?void 0:n.class],clsPrefix:this.mergedClsPrefix,focusable:!0,labelField:this.labelField,valueField:this.valueField,autoPending:!0,nodeProps:this.nodeProps,theme:this.mergedTheme.peers.InternalSelectMenu,themeOverrides:this.mergedTheme.peerOverrides.InternalSelectMenu,treeMate:this.treeMate,multiple:this.multiple,size:"medium",renderOption:this.renderOption,renderLabel:this.renderLabel,value:this.mergedValue,style:[(i=this.menuProps)===null||i===void 0?void 0:i.style,this.cssVars],onToggle:this.handleToggle,onScroll:this.handleMenuScroll,onFocus:this.handleMenuFocus,onBlur:this.handleMenuBlur,onKeydown:this.handleMenuKeydown,onTabOut:this.handleMenuTabOut,onMousedown:this.handleMenuMousedown,show:this.mergedShow,showCheckmark:this.showCheckmark,resetMenuOnOptionsChange:this.resetMenuOnOptionsChange}),{empty:()=>{var s,r;return[(r=(s=this.$slots).empty)===null||r===void 0?void 0:r.call(s)]},header:()=>{var s,r;return[(r=(s=this.$slots).header)===null||r===void 0?void 0:r.call(s)]},action:()=>{var s,r;return[(r=(s=this.$slots).action)===null||r===void 0?void 0:r.call(s)]}}),this.displayDirective==="show"?[[sn,this.mergedShow],[vt,this.handleMenuClickOutside,void 0,{capture:!0}]]:[[vt,this.handleMenuClickOutside,void 0,{capture:!0}]])):null}})})]}))}});export{Nn as F,vo as N,$n as V,Ln as a,En as b,Wn as c,jn as d,Qe as m,Tt as u};
