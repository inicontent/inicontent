import{o as $,i as N}from"./Cuy9QMLJ.js";import{t as V}from"./DA-jzpWN.js";import{af as W,b as k,aO as A,e as E,aP as _,f as T,i as K,ab as G,A as z,j as I,l as y,ah as H,ai as U,N as D,aJ as J,ad as Q,a6 as X,t as O,aQ as Y}from"./BHakqtML.js";import{r as q,a as Z}from"./BAburf3k.js";import{a as ee}from"./CUH8jnoT.js";import{e as re}from"./BuKvTen5.js";import{V as oe}from"./D98Rse4x.js";import{c as te}from"./B7sYoy7v.js";const ne=W("n-avatar-group"),ae=k("avatar",`
 width: var(--n-merged-size);
 height: var(--n-merged-size);
 color: #FFF;
 font-size: var(--n-font-size);
 display: inline-flex;
 position: relative;
 overflow: hidden;
 text-align: center;
 border: var(--n-border);
 border-radius: var(--n-border-radius);
 --n-merged-color: var(--n-color);
 background-color: var(--n-merged-color);
 transition:
 border-color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
`,[A(E("&","--n-merged-color: var(--n-color-modal);")),_(E("&","--n-merged-color: var(--n-color-popover);")),E("img",`
 width: 100%;
 height: 100%;
 `),T("text",`
 white-space: nowrap;
 display: inline-block;
 position: absolute;
 left: 50%;
 top: 50%;
 `),k("icon",`
 vertical-align: bottom;
 font-size: calc(var(--n-merged-size) - 6px);
 `),T("text","line-height: 1.25")]),se=Object.assign(Object.assign({},H.props),{size:[String,Number],src:String,circle:{type:Boolean,default:void 0},objectFit:String,round:{type:Boolean,default:void 0},bordered:{type:Boolean,default:void 0},onError:Function,fallbackSrc:String,intersectionObserverOptions:Object,lazy:Boolean,onLoad:Function,renderPlaceholder:Function,renderFallback:Function,imgProps:Object,color:String}),he=K({name:"Avatar",props:se,setup(o){const{mergedClsPrefixRef:l,inlineThemeDisabled:h}=G(o),g=z(!1);let d=null;const c=z(null),s=z(null),x=()=>{const{value:e}=c;if(e&&(d===null||d!==e.innerHTML)){d=e.innerHTML;const{value:r}=s;if(r){const{offsetWidth:t,offsetHeight:a}=r,{offsetWidth:n,offsetHeight:j}=e,R=.9,P=Math.min(t/n*R,a/j*R,1);e.style.transform=`translateX(-50%) translateY(-50%) scale(${P})`}}},b=I(ne,null),i=y(()=>{const{size:e}=o;if(e)return e;const{size:r}=b||{};return r||"medium"}),u=H("Avatar","-avatar",ae,ee,o,l),p=I(V,null),f=y(()=>{if(b)return!0;const{round:e,circle:r}=o;return e!==void 0||r!==void 0?e||r:p?p.roundRef.value:!1}),v=y(()=>b?!0:o.bordered||!1),F=y(()=>{const e=i.value,r=f.value,t=v.value,{color:a}=o,{self:{borderRadius:n,fontSize:j,color:R,border:P,colorModal:w,colorPopover:B},common:{cubicBezierEaseInOut:M}}=u.value;let S;return typeof e=="number"?S=`${e}px`:S=u.value.self[Y("height",e)],{"--n-font-size":j,"--n-border":t?P:"none","--n-border-radius":r?"50%":n,"--n-color":a||R,"--n-color-modal":a||w,"--n-color-popover":a||B,"--n-bezier":M,"--n-merged-size":`var(--n-avatar-size-override, ${S})`}}),m=h?U("avatar",y(()=>{const e=i.value,r=f.value,t=v.value,{color:a}=o;let n="";return e&&(typeof e=="number"?n+=`a${e}`:n+=e[0]),r&&(n+="b"),t&&(n+="c"),a&&(n+=re(a)),n}),F,o):void 0,L=z(!o.lazy);D(()=>{if(o.lazy&&o.intersectionObserverOptions){let e;const r=J(()=>{e==null||e(),e=void 0,o.lazy&&(e=$(s.value,o.intersectionObserverOptions,L))});Q(()=>{r(),e==null||e()})}}),X(()=>{var e;return o.src||((e=o.imgProps)===null||e===void 0?void 0:e.src)},()=>{g.value=!1});const C=z(!o.lazy);return{textRef:c,selfRef:s,mergedRoundRef:f,mergedClsPrefix:l,fitTextTransform:x,cssVars:h?void 0:F,themeClass:m==null?void 0:m.themeClass,onRender:m==null?void 0:m.onRender,hasLoadError:g,shouldStartLoading:L,loaded:C,mergedOnError:e=>{if(!L.value)return;g.value=!0;const{onError:r,imgProps:{onError:t}={}}=o;r==null||r(e),t==null||t(e)},mergedOnLoad:e=>{const{onLoad:r,imgProps:{onLoad:t}={}}=o;r==null||r(e),t==null||t(e),C.value=!0}}},render(){var o,l;const{$slots:h,src:g,mergedClsPrefix:d,lazy:c,onRender:s,loaded:x,hasLoadError:b,imgProps:i={}}=this;s==null||s();let u;const p=!x&&!b&&(this.renderPlaceholder?this.renderPlaceholder():(l=(o=this.$slots).placeholder)===null||l===void 0?void 0:l.call(o));return this.hasLoadError?u=this.renderFallback?this.renderFallback():q(h.fallback,()=>[O("img",{src:this.fallbackSrc,style:{objectFit:this.objectFit}})]):u=Z(h.default,f=>{if(f)return O(oe,{onResize:this.fitTextTransform},{default:()=>O("span",{ref:"textRef",class:`${d}-avatar__text`},f)});if(g||i.src){const v=this.src||i.src;return O("img",Object.assign(Object.assign({},i),{loading:N&&!this.intersectionObserverOptions&&c?"lazy":"eager",src:c&&this.intersectionObserverOptions?this.shouldStartLoading?v:void 0:v,"data-image-src":v,onLoad:this.mergedOnLoad,onError:this.mergedOnError,style:[i.style||"",{objectFit:this.objectFit},p?{height:"0",width:"0",visibility:"hidden",position:"absolute"}:""]}))}}),O("span",{ref:"selfRef",class:[`${d}-avatar`,this.themeClass],style:this.cssVars},u,c&&p)}});/**
 * @license @tabler/icons-vue v3.14.0 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */var ge=te("outline","user","IconUser",[["path",{d:"M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0",key:"svg-0"}],["path",{d:"M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2",key:"svg-1"}]]);export{ge as I,he as N};
