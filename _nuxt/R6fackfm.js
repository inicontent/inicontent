import{j as ne,q as Pe,l as B,ab as ie,ad as ae,b as O,i as se,aa as ke,ac as Re,A as R,ae as Ie,t as m,e as f,c as Fe,a as le,d as y,f as c,h as ee,af as de,a9 as He,ag as Ee,al as r,g as j}from"./CFZop9RU.js";import{u as je}from"./vxBaO5E-.js";import{i as Ne,N as Oe,a as De}from"./t5kcgBii.js";import{u as _e}from"./COm9J_20.js";import{r as oe,i as Ke,c as Me}from"./Cjrk4TDS.js";import{N as Ve}from"./C3M1WvbL.js";import{b as Ge}from"./IlW3-8Qj.js";function re(e){return e.replace(/#|\(|\)|,|\s|\./g,"_")}const D=typeof document<"u"&&typeof window<"u",te=ae("n-form-item");function We(e,{defaultSize:h="medium",mergedSize:v,mergedDisabled:d}={}){const n=ne(te,null);Pe(te,null);const _=B(v?()=>v(n):()=>{const{size:p}=e;if(p)return p;if(n){const{mergedSize:I}=n;if(I.value!==void 0)return I.value}return h}),P=B(d?()=>d(n):()=>{const{disabled:p}=e;return p!==void 0?p:n?n.disabled.value:!1}),k=B(()=>{const{status:p}=e;return p||(n==null?void 0:n.mergedValidationStatus.value)});return ie(()=>{n&&n.restoreValidation()}),{mergedSizeRef:_,mergedDisabledRef:P,mergedStatusRef:k,nTriggerFormBlur(){n&&n.handleContentBlur()},nTriggerFormChange(){n&&n.handleContentChange()},nTriggerFormFocus(){n&&n.handleContentFocus()},nTriggerFormInput(){n&&n.handleContentInput()}}}const qe=O("base-wave",`
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 border-radius: inherit;
`),Qe=se({name:"BaseWave",props:{clsPrefix:{type:String,required:!0}},setup(e){ke("-base-wave",qe,Re(e,"clsPrefix"));const h=R(null),v=R(!1);let d=null;return ie(()=>{d!==null&&window.clearTimeout(d)}),{active:v,selfRef:h,play(){d!==null&&(window.clearTimeout(d),v.value=!1,d=null),Ie(()=>{var n;(n=h.value)===null||n===void 0||n.offsetHeight,v.value=!0,d=window.setTimeout(()=>{v.value=!1,d=null},1e3)})}}},render(){const{clsPrefix:e}=this;return m("div",{ref:"selfRef","aria-hidden":!0,class:[`${e}-base-wave`,this.active&&`${e}-base-wave--active`]})}}),{cubicBezierEaseInOut:w}=Fe;function Ae({duration:e=".2s",delay:h=".1s"}={}){return[f("&.fade-in-width-expand-transition-leave-from, &.fade-in-width-expand-transition-enter-to",{opacity:1}),f("&.fade-in-width-expand-transition-leave-to, &.fade-in-width-expand-transition-enter-from",`
 opacity: 0!important;
 margin-left: 0!important;
 margin-right: 0!important;
 `),f("&.fade-in-width-expand-transition-leave-active",`
 overflow: hidden;
 transition:
 opacity ${e} ${w},
 max-width ${e} ${w} ${h},
 margin-left ${e} ${w} ${h},
 margin-right ${e} ${w} ${h};
 `),f("&.fade-in-width-expand-transition-enter-active",`
 overflow: hidden;
 transition:
 opacity ${e} ${w} ${h},
 max-width ${e} ${w},
 margin-left ${e} ${w},
 margin-right ${e} ${w};
 `)]}const Le=D&&"chrome"in window;D&&navigator.userAgent.includes("Firefox");const Xe=D&&navigator.userAgent.includes("Safari")&&!Le;function S(e){return le(e,[255,255,255,.16])}function N(e){return le(e,[0,0,0,.12])}const Ye=ae("n-button-group"),Ue=f([O("button",`
 margin: 0;
 font-weight: var(--n-font-weight);
 line-height: 1;
 font-family: inherit;
 padding: var(--n-padding);
 height: var(--n-height);
 font-size: var(--n-font-size);
 border-radius: var(--n-border-radius);
 color: var(--n-text-color);
 background-color: var(--n-color);
 width: var(--n-width);
 white-space: nowrap;
 outline: none;
 position: relative;
 z-index: auto;
 border: none;
 display: inline-flex;
 flex-wrap: nowrap;
 flex-shrink: 0;
 align-items: center;
 justify-content: center;
 user-select: none;
 -webkit-user-select: none;
 text-align: center;
 cursor: pointer;
 text-decoration: none;
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 opacity .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 `,[y("color",[c("border",{borderColor:"var(--n-border-color)"}),y("disabled",[c("border",{borderColor:"var(--n-border-color-disabled)"})]),ee("disabled",[f("&:focus",[c("state-border",{borderColor:"var(--n-border-color-focus)"})]),f("&:hover",[c("state-border",{borderColor:"var(--n-border-color-hover)"})]),f("&:active",[c("state-border",{borderColor:"var(--n-border-color-pressed)"})]),y("pressed",[c("state-border",{borderColor:"var(--n-border-color-pressed)"})])])]),y("disabled",{backgroundColor:"var(--n-color-disabled)",color:"var(--n-text-color-disabled)"},[c("border",{border:"var(--n-border-disabled)"})]),ee("disabled",[f("&:focus",{backgroundColor:"var(--n-color-focus)",color:"var(--n-text-color-focus)"},[c("state-border",{border:"var(--n-border-focus)"})]),f("&:hover",{backgroundColor:"var(--n-color-hover)",color:"var(--n-text-color-hover)"},[c("state-border",{border:"var(--n-border-hover)"})]),f("&:active",{backgroundColor:"var(--n-color-pressed)",color:"var(--n-text-color-pressed)"},[c("state-border",{border:"var(--n-border-pressed)"})]),y("pressed",{backgroundColor:"var(--n-color-pressed)",color:"var(--n-text-color-pressed)"},[c("state-border",{border:"var(--n-border-pressed)"})])]),y("loading","cursor: wait;"),O("base-wave",`
 pointer-events: none;
 top: 0;
 right: 0;
 bottom: 0;
 left: 0;
 animation-iteration-count: 1;
 animation-duration: var(--n-ripple-duration);
 animation-timing-function: var(--n-bezier-ease-out), var(--n-bezier-ease-out);
 `,[y("active",{zIndex:1,animationName:"button-wave-spread, button-wave-opacity"})]),D&&"MozBoxSizing"in document.createElement("div").style?f("&::moz-focus-inner",{border:0}):null,c("border, state-border",`
 position: absolute;
 left: 0;
 top: 0;
 right: 0;
 bottom: 0;
 border-radius: inherit;
 transition: border-color .3s var(--n-bezier);
 pointer-events: none;
 `),c("border",{border:"var(--n-border)"}),c("state-border",{border:"var(--n-border)",borderColor:"#0000",zIndex:1}),c("icon",`
 margin: var(--n-icon-margin);
 margin-left: 0;
 height: var(--n-icon-size);
 width: var(--n-icon-size);
 max-width: var(--n-icon-size);
 font-size: var(--n-icon-size);
 position: relative;
 flex-shrink: 0;
 `,[O("icon-slot",`
 height: var(--n-icon-size);
 width: var(--n-icon-size);
 position: absolute;
 left: 0;
 top: 50%;
 transform: translateY(-50%);
 display: flex;
 align-items: center;
 justify-content: center;
 `,[Ne({top:"50%",originalTransform:"translateY(-50%)"})]),Ae()]),c("content",`
 display: flex;
 align-items: center;
 flex-wrap: nowrap;
 min-width: 0;
 `,[f("~",[c("icon",{margin:"var(--n-icon-margin)",marginRight:0})])]),y("block",`
 display: flex;
 width: 100%;
 `),y("dashed",[c("border, state-border",{borderStyle:"dashed !important"})]),y("disabled",{cursor:"not-allowed",opacity:"var(--n-opacity-disabled)"})]),f("@keyframes button-wave-spread",{from:{boxShadow:"0 0 0.5px 0 var(--n-ripple-color)"},to:{boxShadow:"0 0 0.5px 4.5px var(--n-ripple-color)"}}),f("@keyframes button-wave-opacity",{from:{opacity:"var(--n-wave-opacity)"},to:{opacity:0}})]),Je=Object.assign(Object.assign({},de.props),{color:String,textColor:String,text:Boolean,block:Boolean,loading:Boolean,disabled:Boolean,circle:Boolean,size:String,ghost:Boolean,round:Boolean,secondary:Boolean,tertiary:Boolean,quaternary:Boolean,strong:Boolean,focusable:{type:Boolean,default:!0},keyboard:{type:Boolean,default:!0},tag:{type:String,default:"button"},type:{type:String,default:"default"},dashed:Boolean,renderIcon:Function,iconPlacement:{type:String,default:"left"},attrType:{type:String,default:"button"},bordered:{type:Boolean,default:!0},onClick:[Function,Array],nativeFocusBehavior:{type:Boolean,default:!Xe}}),Ze=se({name:"Button",props:Je,setup(e){const h=R(null),v=R(null),d=R(!1),n=_e(()=>!e.quaternary&&!e.tertiary&&!e.secondary&&!e.text&&(!e.color||e.ghost||e.dashed)&&e.bordered),_=ne(Ye,{}),{mergedSizeRef:P}=We({},{defaultSize:"medium",mergedSize:t=>{const{size:u}=e;if(u)return u;const{size:x}=_;if(x)return x;const{mergedSize:o}=t||{};return o?o.value:"medium"}}),k=B(()=>e.focusable&&!e.disabled),p=t=>{var u;k.value||t.preventDefault(),!e.nativeFocusBehavior&&(t.preventDefault(),!e.disabled&&k.value&&((u=h.value)===null||u===void 0||u.focus({preventScroll:!0})))},I=t=>{var u;if(!e.disabled&&!e.loading){const{onClick:x}=e;x&&Me(x,t),e.text||(u=v.value)===null||u===void 0||u.play()}},ce=t=>{switch(t.key){case"Enter":if(!e.keyboard)return;d.value=!1}},ue=t=>{switch(t.key){case"Enter":if(!e.keyboard||e.loading){t.preventDefault();return}d.value=!0}},be=()=>{d.value=!1},{inlineThemeDisabled:X,mergedClsPrefixRef:K,mergedRtlRef:fe}=He(e),he=de("Button","-button",Ue,Ge,e,K),ve=je("Button",fe,K),Y=B(()=>{const t=he.value,{common:{cubicBezierEaseInOut:u,cubicBezierEaseOut:x},self:o}=t,{rippleDuration:M,opacityDisabled:F,fontWeight:V,fontWeightStrong:G}=o,g=P.value,{dashed:W,type:$,ghost:q,text:C,color:a,round:U,circle:Q,textColor:z,secondary:me,tertiary:J,quaternary:pe,strong:ge}=e,ye={"font-weight":ge?G:V};let s={"--n-color":"initial","--n-color-hover":"initial","--n-color-pressed":"initial","--n-color-focus":"initial","--n-color-disabled":"initial","--n-ripple-color":"initial","--n-text-color":"initial","--n-text-color-hover":"initial","--n-text-color-pressed":"initial","--n-text-color-focus":"initial","--n-text-color-disabled":"initial"};const H=$==="tertiary",Z=$==="default",i=H?"default":$;if(C){const l=z||a;s={"--n-color":"#0000","--n-color-hover":"#0000","--n-color-pressed":"#0000","--n-color-focus":"#0000","--n-color-disabled":"#0000","--n-ripple-color":"#0000","--n-text-color":l||o[r("textColorText",i)],"--n-text-color-hover":l?S(l):o[r("textColorTextHover",i)],"--n-text-color-pressed":l?N(l):o[r("textColorTextPressed",i)],"--n-text-color-focus":l?S(l):o[r("textColorTextHover",i)],"--n-text-color-disabled":l||o[r("textColorTextDisabled",i)]}}else if(q||W){const l=z||a;s={"--n-color":"#0000","--n-color-hover":"#0000","--n-color-pressed":"#0000","--n-color-focus":"#0000","--n-color-disabled":"#0000","--n-ripple-color":a||o[r("rippleColor",i)],"--n-text-color":l||o[r("textColorGhost",i)],"--n-text-color-hover":l?S(l):o[r("textColorGhostHover",i)],"--n-text-color-pressed":l?N(l):o[r("textColorGhostPressed",i)],"--n-text-color-focus":l?S(l):o[r("textColorGhostHover",i)],"--n-text-color-disabled":l||o[r("textColorGhostDisabled",i)]}}else if(me){const l=Z?o.textColor:H?o.textColorTertiary:o[r("color",i)],b=a||l,E=$!=="default"&&$!=="tertiary";s={"--n-color":E?j(b,{alpha:Number(o.colorOpacitySecondary)}):o.colorSecondary,"--n-color-hover":E?j(b,{alpha:Number(o.colorOpacitySecondaryHover)}):o.colorSecondaryHover,"--n-color-pressed":E?j(b,{alpha:Number(o.colorOpacitySecondaryPressed)}):o.colorSecondaryPressed,"--n-color-focus":E?j(b,{alpha:Number(o.colorOpacitySecondaryHover)}):o.colorSecondaryHover,"--n-color-disabled":o.colorSecondary,"--n-ripple-color":"#0000","--n-text-color":b,"--n-text-color-hover":b,"--n-text-color-pressed":b,"--n-text-color-focus":b,"--n-text-color-disabled":b}}else if(J||pe){const l=Z?o.textColor:H?o.textColorTertiary:o[r("color",i)],b=a||l;J?(s["--n-color"]=o.colorTertiary,s["--n-color-hover"]=o.colorTertiaryHover,s["--n-color-pressed"]=o.colorTertiaryPressed,s["--n-color-focus"]=o.colorSecondaryHover,s["--n-color-disabled"]=o.colorTertiary):(s["--n-color"]=o.colorQuaternary,s["--n-color-hover"]=o.colorQuaternaryHover,s["--n-color-pressed"]=o.colorQuaternaryPressed,s["--n-color-focus"]=o.colorQuaternaryHover,s["--n-color-disabled"]=o.colorQuaternary),s["--n-ripple-color"]="#0000",s["--n-text-color"]=b,s["--n-text-color-hover"]=b,s["--n-text-color-pressed"]=b,s["--n-text-color-focus"]=b,s["--n-text-color-disabled"]=b}else s={"--n-color":a||o[r("color",i)],"--n-color-hover":a?S(a):o[r("colorHover",i)],"--n-color-pressed":a?N(a):o[r("colorPressed",i)],"--n-color-focus":a?S(a):o[r("colorFocus",i)],"--n-color-disabled":a||o[r("colorDisabled",i)],"--n-ripple-color":a||o[r("rippleColor",i)],"--n-text-color":z||(a?o.textColorPrimary:H?o.textColorTertiary:o[r("textColor",i)]),"--n-text-color-hover":z||(a?o.textColorHoverPrimary:o[r("textColorHover",i)]),"--n-text-color-pressed":z||(a?o.textColorPressedPrimary:o[r("textColorPressed",i)]),"--n-text-color-focus":z||(a?o.textColorFocusPrimary:o[r("textColorFocus",i)]),"--n-text-color-disabled":z||(a?o.textColorDisabledPrimary:o[r("textColorDisabled",i)])};let A={"--n-border":"initial","--n-border-hover":"initial","--n-border-pressed":"initial","--n-border-focus":"initial","--n-border-disabled":"initial"};C?A={"--n-border":"none","--n-border-hover":"none","--n-border-pressed":"none","--n-border-focus":"none","--n-border-disabled":"none"}:A={"--n-border":o[r("border",i)],"--n-border-hover":o[r("borderHover",i)],"--n-border-pressed":o[r("borderPressed",i)],"--n-border-focus":o[r("borderFocus",i)],"--n-border-disabled":o[r("borderDisabled",i)]};const{[r("height",g)]:L,[r("fontSize",g)]:xe,[r("padding",g)]:Ce,[r("paddingRound",g)]:we,[r("iconSize",g)]:$e,[r("borderRadius",g)]:ze,[r("iconMargin",g)]:Se,waveOpacity:Be}=o,Te={"--n-width":Q&&!C?L:"initial","--n-height":C?"initial":L,"--n-font-size":xe,"--n-padding":Q||C?"initial":U?we:Ce,"--n-icon-size":$e,"--n-icon-margin":Se,"--n-border-radius":C?"initial":Q||U?L:ze};return Object.assign(Object.assign(Object.assign(Object.assign({"--n-bezier":u,"--n-bezier-ease-out":x,"--n-ripple-duration":M,"--n-opacity-disabled":F,"--n-wave-opacity":Be},ye),s),A),Te)}),T=X?Ee("button",B(()=>{let t="";const{dashed:u,type:x,ghost:o,text:M,color:F,round:V,circle:G,textColor:g,secondary:W,tertiary:$,quaternary:q,strong:C}=e;u&&(t+="a"),o&&(t+="b"),M&&(t+="c"),V&&(t+="d"),G&&(t+="e"),W&&(t+="f"),$&&(t+="g"),q&&(t+="h"),C&&(t+="i"),F&&(t+=`j${re(F)}`),g&&(t+=`k${re(g)}`);const{value:a}=P;return t+=`l${a[0]}`,t+=`m${x[0]}`,t}),Y,e):void 0;return{selfElRef:h,waveElRef:v,mergedClsPrefix:K,mergedFocusable:k,mergedSize:P,showBorder:n,enterPressed:d,rtlEnabled:ve,handleMousedown:p,handleKeydown:ue,handleBlur:be,handleKeyup:ce,handleClick:I,customColorCssVars:B(()=>{const{color:t}=e;if(!t)return null;const u=S(t);return{"--n-border-color":t,"--n-border-color-hover":u,"--n-border-color-pressed":N(t),"--n-border-color-focus":u,"--n-border-color-disabled":t}}),cssVars:X?void 0:Y,themeClass:T==null?void 0:T.themeClass,onRender:T==null?void 0:T.onRender}},render(){const{mergedClsPrefix:e,tag:h,onRender:v}=this;v==null||v();const d=oe(this.$slots.default,n=>n&&m("span",{class:`${e}-button__content`},n));return m(h,{ref:"selfElRef",class:[this.themeClass,`${e}-button`,`${e}-button--${this.type}-type`,`${e}-button--${this.mergedSize}-type`,this.rtlEnabled&&`${e}-button--rtl`,this.disabled&&`${e}-button--disabled`,this.block&&`${e}-button--block`,this.enterPressed&&`${e}-button--pressed`,!this.text&&this.dashed&&`${e}-button--dashed`,this.color&&`${e}-button--color`,this.secondary&&`${e}-button--secondary`,this.loading&&`${e}-button--loading`,this.ghost&&`${e}-button--ghost`],tabindex:this.mergedFocusable?0:-1,type:this.attrType,style:this.cssVars,disabled:this.disabled,onClick:this.handleClick,onBlur:this.handleBlur,onMousedown:this.handleMousedown,onKeyup:this.handleKeyup,onKeydown:this.handleKeydown},this.iconPlacement==="right"&&d,m(Ve,{width:!0},{default:()=>oe(this.$slots.icon,n=>(this.loading||this.renderIcon||n)&&m("span",{class:`${e}-button__icon`,style:{margin:Ke(this.$slots.default)?"0":""}},m(Oe,null,{default:()=>this.loading?m(De,{clsPrefix:e,key:"loading",class:`${e}-icon-slot`,strokeWidth:20}):m("div",{key:"icon",class:`${e}-icon-slot`,role:"none"},this.renderIcon?this.renderIcon():n)})))}),this.iconPlacement==="left"&&d,this.text?null:m(Qe,{ref:"waveElRef",clsPrefix:e}),this.showBorder?m("div",{"aria-hidden":!0,class:`${e}-button__border`,style:this.customColorCssVars}):null,this.showBorder?m("div",{"aria-hidden":!0,class:`${e}-button__state-border`,style:this.customColorCssVars}):null)}}),so=Ze;export{Ze as B,so as X,Xe as a,Ye as b,re as c,te as f,D as i,We as u};
