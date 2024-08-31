import{i as W,o as M}from"./CcJ6ViLu.js";import{t as N}from"./BVPo1nrW.js";import{c8 as A,bX as T,cb as K,bW as P,cw as V,c6 as k,f as _,bY as G,r as p,aA as w,D as y,bZ as B,i as D,bK as X,aS as Y,E as J,B as O,dJ as U,ce as Z}from"./b4y72k5A.js";import{u as q,d as Q,r as ee}from"./C1zJybjf.js";import{V as re}from"./DMzQWz3x.js";import{e as oe}from"./xQnQeLtE.js";const te=A("n-avatar-group"),ne=T("avatar",`
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
 `),k("text","line-height: 1.25")]),ae=Object.assign(Object.assign({},B.props),{size:[String,Number],src:String,circle:{type:Boolean,default:void 0},objectFit:String,round:{type:Boolean,default:void 0},bordered:{type:Boolean,default:void 0},onError:Function,fallbackSrc:String,intersectionObserverOptions:Object,lazy:Boolean,onLoad:Function,renderPlaceholder:Function,renderFallback:Function,imgProps:Object,color:String}),fe=_({name:"Avatar",props:ae,setup(o){const{mergedClsPrefixRef:l,inlineThemeDisabled:m}=G(o),g=p(!1);let d=null;const c=p(null),s=p(null),x=()=>{const{value:e}=c;if(e&&(d===null||d!==e.innerHTML)){d=e.innerHTML;const{value:r}=s;if(r){const{offsetWidth:t,offsetHeight:a}=r,{offsetWidth:n,offsetHeight:S}=e,R=.9,E=Math.min(t/n*R,a/S*R,1);e.style.transform=`translateX(-50%) translateY(-50%) scale(${E})`}}},b=w(te,null),i=y(()=>{const{size:e}=o;if(e)return e;const{size:r}=b||{};return r||"medium"}),u=B("Avatar","-avatar",ne,U,o,l),z=w(N,null),f=y(()=>{if(b)return!0;const{round:e,circle:r}=o;return e!==void 0||r!==void 0?e||r:z?z.roundRef.value:!1}),v=y(()=>b?!0:o.bordered||!1),F=y(()=>{const e=i.value,r=f.value,t=v.value,{color:a}=o,{self:{borderRadius:n,fontSize:S,color:R,border:E,colorModal:H,colorPopover:$},common:{cubicBezierEaseInOut:I}}=u.value;let j;return typeof e=="number"?j=`${e}px`:j=u.value.self[Z("height",e)],{"--n-font-size":S,"--n-border":t?E:"none","--n-border-radius":r?"50%":n,"--n-color":a||R,"--n-color-modal":a||H,"--n-color-popover":a||$,"--n-bezier":I,"--n-merged-size":`var(--n-avatar-size-override, ${j})`}}),h=m?q("avatar",y(()=>{const e=i.value,r=f.value,t=v.value,{color:a}=o;let n="";return e&&(typeof e=="number"?n+=`a${e}`:n+=e[0]),r&&(n+="b"),t&&(n+="c"),a&&(n+=oe(a)),n}),F,o):void 0,L=p(!o.lazy);D(()=>{if(o.lazy&&o.intersectionObserverOptions){let e;const r=X(()=>{e==null||e(),e=void 0,o.lazy&&(e=M(s.value,o.intersectionObserverOptions,L))});Y(()=>{r(),e==null||e()})}}),J(()=>{var e;return o.src||((e=o.imgProps)===null||e===void 0?void 0:e.src)},()=>{g.value=!1});const C=p(!o.lazy);return{textRef:c,selfRef:s,mergedRoundRef:f,mergedClsPrefix:l,fitTextTransform:x,cssVars:m?void 0:F,themeClass:h==null?void 0:h.themeClass,onRender:h==null?void 0:h.onRender,hasLoadError:g,shouldStartLoading:L,loaded:C,mergedOnError:e=>{if(!L.value)return;g.value=!0;const{onError:r,imgProps:{onError:t}={}}=o;r==null||r(e),t==null||t(e)},mergedOnLoad:e=>{const{onLoad:r,imgProps:{onLoad:t}={}}=o;r==null||r(e),t==null||t(e),C.value=!0}}},render(){var o,l;const{$slots:m,src:g,mergedClsPrefix:d,lazy:c,onRender:s,loaded:x,hasLoadError:b,imgProps:i={}}=this;s==null||s();let u;const z=!x&&!b&&(this.renderPlaceholder?this.renderPlaceholder():(l=(o=this.$slots).placeholder)===null||l===void 0?void 0:l.call(o));return this.hasLoadError?u=this.renderFallback?this.renderFallback():Q(m.fallback,()=>[O("img",{src:this.fallbackSrc,style:{objectFit:this.objectFit}})]):u=ee(m.default,f=>{if(f)return O(re,{onResize:this.fitTextTransform},{default:()=>O("span",{ref:"textRef",class:`${d}-avatar__text`},f)});if(g||i.src){const v=this.src||i.src;return O("img",Object.assign(Object.assign({},i),{loading:W&&!this.intersectionObserverOptions&&c?"lazy":"eager",src:c&&this.intersectionObserverOptions?this.shouldStartLoading?v:void 0:v,"data-image-src":v,onLoad:this.mergedOnLoad,onError:this.mergedOnError,style:[i.style||"",{objectFit:this.objectFit},z?{height:"0",width:"0",visibility:"hidden",position:"absolute"}:""]}))}}),O("span",{ref:"selfRef",class:[`${d}-avatar`,this.themeClass],style:this.cssVars},u,c&&z)}});export{fe as N};
