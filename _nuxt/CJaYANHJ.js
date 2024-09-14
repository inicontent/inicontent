import{b as C,d as p,e as g,af as w,i as $,a9 as y,l as m,ag as k,w as _,t as a,ax as N}from"./GicmGKj6.js";import{i as R}from"./Dhmybkx6.js";const z=/^(\d|\.)+$/,v=/(\d|\.)+/;function S(e,{c:r=1,offset:i=0,attachPx:o=!0}={}){if(typeof e=="number"){const t=(e+i)*r;return t===0?"0":`${t}px`}else if(typeof e=="string")if(z.test(e)){const t=(Number(e)+i)*r;return o?t===0?"0":`${t}px`:`${t}`}else{const t=v.exec(e);return t?e.replace(v,String((Number(t[0])+i)*r)):e}return e}const P=C("icon",`
 height: 1em;
 width: 1em;
 line-height: 1em;
 text-align: center;
 display: inline-block;
 position: relative;
 fill: currentColor;
 transform: translateZ(0);
`,[p("color-transition",{transition:"color .3s var(--n-bezier)"}),p("depth",{color:"var(--n-color)"},[g("svg",{opacity:"var(--n-opacity)",transition:"opacity .3s var(--n-bezier)"})]),g("svg",{height:"1em",width:"1em"})]),j=Object.assign(Object.assign({},w.props),{depth:[String,Number],size:[Number,String],color:String,component:Object}),O=$({_n_icon__:!0,name:"Icon",inheritAttrs:!1,props:j,setup(e){const{mergedClsPrefixRef:r,inlineThemeDisabled:i}=y(e),o=w("Icon","-icon",P,R,e,r),t=m(()=>{const{depth:s}=e,{common:{cubicBezierEaseInOut:c},self:f}=o.value;if(s!==void 0){const{color:l,[`opacity${s}Depth`]:d}=f;return{"--n-bezier":c,"--n-color":l,"--n-opacity":d}}return{"--n-bezier":c,"--n-color":"","--n-opacity":""}}),n=i?k("icon",m(()=>`${e.depth||"d"}`),t,e):void 0;return{mergedClsPrefix:r,mergedStyle:m(()=>{const{size:s,color:c}=e;return{fontSize:S(s),color:c}}),cssVars:i?void 0:t,themeClass:n==null?void 0:n.themeClass,onRender:n==null?void 0:n.onRender}},render(){var e;const{$parent:r,depth:i,mergedClsPrefix:o,component:t,onRender:n,themeClass:s}=this;return!((e=r==null?void 0:r.$options)===null||e===void 0)&&e._n_icon__&&_("icon","don't wrap `n-icon` inside `n-icon`"),n==null||n(),a("i",N(this.$attrs,{role:"img",class:[`${o}-icon`,s,{[`${o}-icon--depth`]:i,[`${o}-icon--color-transition`]:i!==void 0}],style:[this.cssVars,this.mergedStyle]}),t?a(t):this.$slots)}});/**
 * @license @tabler/icons-vue v3.14.0 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */var b={outline:{xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"},filled:{xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"currentColor",stroke:"none"}};/**
 * @license @tabler/icons-vue v3.14.0 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */const V=(e,r,i,o)=>({color:t="currentColor",size:n,stroke:s,title:c,class:f,...l},{attrs:d,slots:h})=>{let u=[...o.map(x=>a(...x)),...h.default?[h.default()]:[]];return c&&(u=[a("title",c),...u]),a("svg",{...b[e],width:n,height:n,...d,class:["tabler-icon",`tabler-icon-${r}`],...e==="filled"?{fill:t}:{"stroke-width":s??b[e]["stroke-width"],stroke:t},...l},u)};export{O as N,V as c,S as f};
