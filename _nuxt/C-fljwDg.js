import{o as N,i as M}from"./D2ChhGKI.js";import{t as W}from"./fpCCPRpX.js";import{af as A,b as T,aZ as K,e as P,b6 as V,f as k,i as _,ab as G,A as p,j as H,l as y,ah as w,ai as D,N as U,aK as X,ad as Y,a6 as Z,t as O,aT as q}from"./DY8a-ZKd.js";import{r as J,a as Q}from"./16KSqgTs.js";import{a as ee}from"./XYkU9jHF.js";import{e as re}from"./fCZmJS8P.js";import{V as oe}from"./BP3lKFEZ.js";const te=A("n-avatar-group"),ne=T("avatar",`
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
`,[K(P("&","--n-merged-color: var(--n-color-modal);")),V(P("&","--n-merged-color: var(--n-color-popover);")),P("img",`
 width: 100%;
 height: 100%;
 `),k("text",`
 white-space: nowrap;
 display: inline-block;
 position: absolute;
 left: 50%;
 top: 50%;
 `),T("icon",`
 vertical-align: bottom;
 font-size: calc(var(--n-merged-size) - 6px);
 `),k("text","line-height: 1.25")]),ae=Object.assign(Object.assign({},w.props),{size:[String,Number],src:String,circle:{type:Boolean,default:void 0},objectFit:String,round:{type:Boolean,default:void 0},bordered:{type:Boolean,default:void 0},onError:Function,fallbackSrc:String,intersectionObserverOptions:Object,lazy:Boolean,onLoad:Function,renderPlaceholder:Function,renderFallback:Function,imgProps:Object,color:String}),ve=_({name:"Avatar",props:ae,setup(o){const{mergedClsPrefixRef:l,inlineThemeDisabled:h}=G(o),g=p(!1);let d=null;const c=p(null),s=p(null),x=()=>{const{value:e}=c;if(e&&(d===null||d!==e.innerHTML)){d=e.innerHTML;const{value:r}=s;if(r){const{offsetWidth:t,offsetHeight:a}=r,{offsetWidth:n,offsetHeight:j}=e,R=.9,S=Math.min(t/n*R,a/j*R,1);e.style.transform=`translateX(-50%) translateY(-50%) scale(${S})`}}},b=H(te,null),i=y(()=>{const{size:e}=o;if(e)return e;const{size:r}=b||{};return r||"medium"}),u=w("Avatar","-avatar",ne,ee,o,l),z=H(W,null),f=y(()=>{if(b)return!0;const{round:e,circle:r}=o;return e!==void 0||r!==void 0?e||r:z?z.roundRef.value:!1}),v=y(()=>b?!0:o.bordered||!1),F=y(()=>{const e=i.value,r=f.value,t=v.value,{color:a}=o,{self:{borderRadius:n,fontSize:j,color:R,border:S,colorModal:B,colorPopover:$},common:{cubicBezierEaseInOut:I}}=u.value;let E;return typeof e=="number"?E=`${e}px`:E=u.value.self[q("height",e)],{"--n-font-size":j,"--n-border":t?S:"none","--n-border-radius":r?"50%":n,"--n-color":a||R,"--n-color-modal":a||B,"--n-color-popover":a||$,"--n-bezier":I,"--n-merged-size":`var(--n-avatar-size-override, ${E})`}}),m=h?D("avatar",y(()=>{const e=i.value,r=f.value,t=v.value,{color:a}=o;let n="";return e&&(typeof e=="number"?n+=`a${e}`:n+=e[0]),r&&(n+="b"),t&&(n+="c"),a&&(n+=re(a)),n}),F,o):void 0,L=p(!o.lazy);U(()=>{if(o.lazy&&o.intersectionObserverOptions){let e;const r=X(()=>{e==null||e(),e=void 0,o.lazy&&(e=N(s.value,o.intersectionObserverOptions,L))});Y(()=>{r(),e==null||e()})}}),Z(()=>{var e;return o.src||((e=o.imgProps)===null||e===void 0?void 0:e.src)},()=>{g.value=!1});const C=p(!o.lazy);return{textRef:c,selfRef:s,mergedRoundRef:f,mergedClsPrefix:l,fitTextTransform:x,cssVars:h?void 0:F,themeClass:m==null?void 0:m.themeClass,onRender:m==null?void 0:m.onRender,hasLoadError:g,shouldStartLoading:L,loaded:C,mergedOnError:e=>{if(!L.value)return;g.value=!0;const{onError:r,imgProps:{onError:t}={}}=o;r==null||r(e),t==null||t(e)},mergedOnLoad:e=>{const{onLoad:r,imgProps:{onLoad:t}={}}=o;r==null||r(e),t==null||t(e),C.value=!0}}},render(){var o,l;const{$slots:h,src:g,mergedClsPrefix:d,lazy:c,onRender:s,loaded:x,hasLoadError:b,imgProps:i={}}=this;s==null||s();let u;const z=!x&&!b&&(this.renderPlaceholder?this.renderPlaceholder():(l=(o=this.$slots).placeholder)===null||l===void 0?void 0:l.call(o));return this.hasLoadError?u=this.renderFallback?this.renderFallback():J(h.fallback,()=>[O("img",{src:this.fallbackSrc,style:{objectFit:this.objectFit}})]):u=Q(h.default,f=>{if(f)return O(oe,{onResize:this.fitTextTransform},{default:()=>O("span",{ref:"textRef",class:`${d}-avatar__text`},f)});if(g||i.src){const v=this.src||i.src;return O("img",Object.assign(Object.assign({},i),{loading:M&&!this.intersectionObserverOptions&&c?"lazy":"eager",src:c&&this.intersectionObserverOptions?this.shouldStartLoading?v:void 0:v,"data-image-src":v,onLoad:this.mergedOnLoad,onError:this.mergedOnError,style:[i.style||"",{objectFit:this.objectFit},z?{height:"0",width:"0",visibility:"hidden",position:"absolute"}:""]}))}}),O("span",{ref:"selfRef",class:[`${d}-avatar`,this.themeClass],style:this.cssVars},u,c&&z)}});export{ve as N};
