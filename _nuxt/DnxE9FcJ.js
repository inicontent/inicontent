import{B as ke,V as Ne,a as Pe,r as Re,N as Ke,p as ce}from"./B70D4HhP.js";import{p as pe,N as Ie,a as Ce,d as Oe,k as _e}from"./CpQ53R02.js";import{r as F,B as ie,b2 as De,z as $e,aR as ze,b3 as Ae,f as B,s,c7 as de,aA as T,A as m,a$ as H,c6 as X,Y as Fe,aM as fe,bZ as Te,F as Be,bW as N,bV as L,c4 as le,c3 as K,c5 as D,bp as I,bX as je,bY as he,dp as Me,cd as A}from"./DERJ1-ou.js";import{r as Y}from"./DfZqrUf9.js";import{C as Ee}from"./BqANd60g.js";import{h as se}from"./CM8LO42l.js";import{h as Le,b as G,o as V,X as He,u as Ue}from"./SHbevw9V.js";import{f as We}from"./DCK4y3Dk.js";import{c as te,u as qe}from"./BAWSh4kU.js";import{a as Ge,c as Ve}from"./DXruQSCb.js";function Xe(e,n,i){const r=F(e.value);let t=null;return ie(e,o=>{t!==null&&window.clearTimeout(t),o===!0?i&&!i.value?r.value=!0:t=window.setTimeout(()=>{r.value=!0},n):r.value=!1}),r}function Ye(e={},n){const i=De({ctrl:!1,command:!1,win:!1,shift:!1,tab:!1}),{keydown:r,keyup:t}=e,o=d=>{switch(d.key){case"Control":i.ctrl=!0;break;case"Meta":i.command=!0,i.win=!0;break;case"Shift":i.shift=!0;break;case"Tab":i.tab=!0;break}r!==void 0&&Object.keys(r).forEach(y=>{if(y!==d.key)return;const v=r[y];if(typeof v=="function")v(d);else{const{stop:g=!1,prevent:S=!1}=v;g&&d.stopPropagation(),S&&d.preventDefault(),v.handler(d)}})},c=d=>{switch(d.key){case"Control":i.ctrl=!1;break;case"Meta":i.command=!1,i.win=!1;break;case"Shift":i.shift=!1;break;case"Tab":i.tab=!1;break}t!==void 0&&Object.keys(t).forEach(y=>{if(y!==d.key)return;const v=t[y];if(typeof v=="function")v(d);else{const{stop:g=!1,prevent:S=!1}=v;g&&d.stopPropagation(),S&&d.preventDefault(),v.handler(d)}})},f=()=>{(n===void 0||n.value)&&(V("keydown",document,o),V("keyup",document,c)),n!==void 0&&ie(n,d=>{d?(V("keydown",document,o),V("keyup",document,c)):(G("keydown",document,o),G("keyup",document,c))})};return Le()?($e(f),ze(()=>{(n===void 0||n.value)&&(G("keydown",document,o),G("keyup",document,c))})):f(),Ae(i)}const ve=B({name:"DropdownDivider",props:{clsPrefix:{type:String,required:!0}},render(){return s("div",{class:`${this.clsPrefix}-dropdown-divider`})}}),ae=de("n-dropdown-menu"),Z=de("n-dropdown"),ue=de("n-dropdown-option");function re(e,n){return e.type==="submenu"||e.type===void 0&&e[n]!==void 0}function Ze(e){return e.type==="group"}function be(e){return e.type==="divider"}function Je(e){return e.type==="render"}const we=B({name:"DropdownOption",props:{clsPrefix:{type:String,required:!0},tmNode:{type:Object,required:!0},parentKey:{type:[String,Number],default:null},placement:{type:String,default:"right-start"},props:Object,scrollable:Boolean},setup(e){const n=T(Z),{hoverKeyRef:i,keyboardKeyRef:r,lastToggledSubmenuKeyRef:t,pendingKeyPathRef:o,activeKeyPathRef:c,animatedRef:f,mergedShowRef:d,renderLabelRef:y,renderIconRef:v,labelFieldRef:g,childrenFieldRef:S,renderOptionRef:P,nodePropsRef:C,menuPropsRef:j}=n,x=T(ue,null),O=T(ae),U=T(pe),J=m(()=>e.tmNode.rawNode),W=m(()=>{const{value:l}=S;return re(e.tmNode.rawNode,l)}),Q=m(()=>{const{disabled:l}=e.tmNode;return l}),ee=m(()=>{if(!W.value)return!1;const{key:l,disabled:w}=e.tmNode;if(w)return!1;const{value:R}=i,{value:$}=r,{value:ne}=t,{value:z}=o;return R!==null?z.includes(l):$!==null?z.includes(l)&&z[z.length-1]!==l:ne!==null?z.includes(l):!1}),oe=m(()=>r.value===null&&!f.value),q=Xe(ee,300,oe),M=m(()=>!!(x!=null&&x.enteringSubmenuRef.value)),E=F(!1);H(ue,{enteringSubmenuRef:E});function _(){E.value=!0}function a(){E.value=!1}function b(){const{parentKey:l,tmNode:w}=e;w.disabled||d.value&&(t.value=l,r.value=null,i.value=w.key)}function p(){const{tmNode:l}=e;l.disabled||d.value&&i.value!==l.key&&b()}function u(l){if(e.tmNode.disabled||!d.value)return;const{relatedTarget:w}=l;w&&!se({target:w},"dropdownOption")&&!se({target:w},"scrollbarRail")&&(i.value=null)}function k(){const{value:l}=W,{tmNode:w}=e;d.value&&!l&&!w.disabled&&(n.doSelect(w.key,w.rawNode),n.doUpdateShow(!1))}return{labelField:g,renderLabel:y,renderIcon:v,siblingHasIcon:O.showIconRef,siblingHasSubmenu:O.hasSubmenuRef,menuProps:j,popoverBody:U,animated:f,mergedShowSubmenu:m(()=>q.value&&!M.value),rawNode:J,hasSubmenu:W,pending:X(()=>{const{value:l}=o,{key:w}=e.tmNode;return l.includes(w)}),childActive:X(()=>{const{value:l}=c,{key:w}=e.tmNode,R=l.findIndex($=>w===$);return R===-1?!1:R<l.length-1}),active:X(()=>{const{value:l}=c,{key:w}=e.tmNode,R=l.findIndex($=>w===$);return R===-1?!1:R===l.length-1}),mergedDisabled:Q,renderOption:P,nodeProps:C,handleClick:k,handleMouseMove:p,handleMouseEnter:b,handleMouseLeave:u,handleSubmenuBeforeEnter:_,handleSubmenuAfterEnter:a}},render(){var e,n;const{animated:i,rawNode:r,mergedShowSubmenu:t,clsPrefix:o,siblingHasIcon:c,siblingHasSubmenu:f,renderLabel:d,renderIcon:y,renderOption:v,nodeProps:g,props:S,scrollable:P}=this;let C=null;if(t){const U=(e=this.menuProps)===null||e===void 0?void 0:e.call(this,r,r.children);C=s(me,Object.assign({},U,{clsPrefix:o,scrollable:this.scrollable,tmNodes:this.tmNode.children,parentKey:this.tmNode.key}))}const j={class:[`${o}-dropdown-option-body`,this.pending&&`${o}-dropdown-option-body--pending`,this.active&&`${o}-dropdown-option-body--active`,this.childActive&&`${o}-dropdown-option-body--child-active`,this.mergedDisabled&&`${o}-dropdown-option-body--disabled`],onMousemove:this.handleMouseMove,onMouseenter:this.handleMouseEnter,onMouseleave:this.handleMouseLeave,onClick:this.handleClick},x=g==null?void 0:g(r),O=s("div",Object.assign({class:[`${o}-dropdown-option`,x==null?void 0:x.class],"data-dropdown-option":!0},x),s("div",fe(j,S),[s("div",{class:[`${o}-dropdown-option-body__prefix`,c&&`${o}-dropdown-option-body__prefix--show-icon`]},[y?y(r):Y(r.icon)]),s("div",{"data-dropdown-option":!0,class:`${o}-dropdown-option-body__label`},d?d(r):Y((n=r[this.labelField])!==null&&n!==void 0?n:r.title)),s("div",{"data-dropdown-option":!0,class:[`${o}-dropdown-option-body__suffix`,f&&`${o}-dropdown-option-body__suffix--has-submenu`]},this.hasSubmenu?s(Ie,null,{default:()=>s(Ee,null)}):null)]),this.hasSubmenu?s(ke,null,{default:()=>[s(Ne,null,{default:()=>s("div",{class:`${o}-dropdown-offset-container`},s(Pe,{show:this.mergedShowSubmenu,placement:this.placement,to:P&&this.popoverBody||void 0,teleportDisabled:!P},{default:()=>s("div",{class:`${o}-dropdown-menu-wrapper`},i?s(Fe,{onBeforeEnter:this.handleSubmenuBeforeEnter,onAfterEnter:this.handleSubmenuAfterEnter,name:"fade-in-scale-up-transition",appear:!0},{default:()=>C}):C)}))})]}):null);return v?v({node:O,option:r}):O}}),Qe=B({name:"DropdownGroupHeader",props:{clsPrefix:{type:String,required:!0},tmNode:{type:Object,required:!0}},setup(){const{showIconRef:e,hasSubmenuRef:n}=T(ae),{renderLabelRef:i,labelFieldRef:r,nodePropsRef:t,renderOptionRef:o}=T(Z);return{labelField:r,showIcon:e,hasSubmenu:n,renderLabel:i,nodeProps:t,renderOption:o}},render(){var e;const{clsPrefix:n,hasSubmenu:i,showIcon:r,nodeProps:t,renderLabel:o,renderOption:c}=this,{rawNode:f}=this.tmNode,d=s("div",Object.assign({class:`${n}-dropdown-option`},t==null?void 0:t(f)),s("div",{class:`${n}-dropdown-option-body ${n}-dropdown-option-body--group`},s("div",{"data-dropdown-option":!0,class:[`${n}-dropdown-option-body__prefix`,r&&`${n}-dropdown-option-body__prefix--show-icon`]},Y(f.icon)),s("div",{class:`${n}-dropdown-option-body__label`,"data-dropdown-option":!0},o?o(f):Y((e=f.title)!==null&&e!==void 0?e:f[this.labelField])),s("div",{class:[`${n}-dropdown-option-body__suffix`,i&&`${n}-dropdown-option-body__suffix--has-submenu`],"data-dropdown-option":!0})));return c?c({node:d,option:f}):d}}),eo=B({name:"NDropdownGroup",props:{clsPrefix:{type:String,required:!0},tmNode:{type:Object,required:!0},parentKey:{type:[String,Number],default:null}},render(){const{tmNode:e,parentKey:n,clsPrefix:i}=this,{children:r}=e;return s(Be,null,s(Qe,{clsPrefix:i,tmNode:e,key:e.key}),r==null?void 0:r.map(t=>{const{rawNode:o}=t;return o.show===!1?null:be(o)?s(ve,{clsPrefix:i,key:t.key}):t.isGroup?(Te("dropdown","`group` node is not allowed to be put in `group` node."),null):s(we,{clsPrefix:i,tmNode:t,parentKey:n,key:t.key})}))}}),oo=B({name:"DropdownRenderOption",props:{tmNode:{type:Object,required:!0}},render(){const{rawNode:{render:e,props:n}}=this.tmNode;return s("div",n,[e==null?void 0:e()])}}),me=B({name:"DropdownMenu",props:{scrollable:Boolean,showArrow:Boolean,arrowStyle:[String,Object],clsPrefix:{type:String,required:!0},tmNodes:{type:Array,default:()=>[]},parentKey:{type:[String,Number],default:null}},setup(e){const{renderIconRef:n,childrenFieldRef:i}=T(Z);H(ae,{showIconRef:m(()=>{const t=n.value;return e.tmNodes.some(o=>{var c;if(o.isGroup)return(c=o.children)===null||c===void 0?void 0:c.some(({rawNode:d})=>t?t(d):d.icon);const{rawNode:f}=o;return t?t(f):f.icon})}),hasSubmenuRef:m(()=>{const{value:t}=i;return e.tmNodes.some(o=>{var c;if(o.isGroup)return(c=o.children)===null||c===void 0?void 0:c.some(({rawNode:d})=>re(d,t));const{rawNode:f}=o;return re(f,t)})})});const r=F(null);return H(Ce,null),H(Oe,null),H(pe,r),{bodyRef:r}},render(){const{parentKey:e,clsPrefix:n,scrollable:i}=this,r=this.tmNodes.map(t=>{const{rawNode:o}=t;return o.show===!1?null:Je(o)?s(oo,{tmNode:t,key:t.key}):be(o)?s(ve,{clsPrefix:n,key:t.key}):Ze(o)?s(eo,{clsPrefix:n,tmNode:t,parentKey:e,key:t.key}):s(we,{clsPrefix:n,tmNode:t,parentKey:e,key:t.key,props:o.props,scrollable:i})});return s("div",{class:[`${n}-dropdown-menu`,i&&`${n}-dropdown-menu--scrollable`],ref:"bodyRef"},i?s(He,{contentClass:`${n}-dropdown-menu__content`},{default:()=>r}):r,this.showArrow?Re({clsPrefix:n,arrowStyle:this.arrowStyle,arrowClass:void 0,arrowWrapperClass:void 0,arrowWrapperStyle:void 0}):null)}}),no=N("dropdown-menu",`
 transform-origin: var(--v-transform-origin);
 background-color: var(--n-color);
 border-radius: var(--n-border-radius);
 box-shadow: var(--n-box-shadow);
 position: relative;
 transition:
 background-color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier);
`,[We(),N("dropdown-option",`
 position: relative;
 `,[L("a",`
 text-decoration: none;
 color: inherit;
 outline: none;
 `,[L("&::before",`
 content: "";
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 `)]),N("dropdown-option-body",`
 display: flex;
 cursor: pointer;
 position: relative;
 height: var(--n-option-height);
 line-height: var(--n-option-height);
 font-size: var(--n-font-size);
 color: var(--n-option-text-color);
 transition: color .3s var(--n-bezier);
 `,[L("&::before",`
 content: "";
 position: absolute;
 top: 0;
 bottom: 0;
 left: 4px;
 right: 4px;
 transition: background-color .3s var(--n-bezier);
 border-radius: var(--n-border-radius);
 `),le("disabled",[K("pending",`
 color: var(--n-option-text-color-hover);
 `,[D("prefix, suffix",`
 color: var(--n-option-text-color-hover);
 `),L("&::before","background-color: var(--n-option-color-hover);")]),K("active",`
 color: var(--n-option-text-color-active);
 `,[D("prefix, suffix",`
 color: var(--n-option-text-color-active);
 `),L("&::before","background-color: var(--n-option-color-active);")]),K("child-active",`
 color: var(--n-option-text-color-child-active);
 `,[D("prefix, suffix",`
 color: var(--n-option-text-color-child-active);
 `)])]),K("disabled",`
 cursor: not-allowed;
 opacity: var(--n-option-opacity-disabled);
 `),K("group",`
 font-size: calc(var(--n-font-size) - 1px);
 color: var(--n-group-header-text-color);
 `,[D("prefix",`
 width: calc(var(--n-option-prefix-width) / 2);
 `,[K("show-icon",`
 width: calc(var(--n-option-icon-prefix-width) / 2);
 `)])]),D("prefix",`
 width: var(--n-option-prefix-width);
 display: flex;
 justify-content: center;
 align-items: center;
 color: var(--n-prefix-color);
 transition: color .3s var(--n-bezier);
 z-index: 1;
 `,[K("show-icon",`
 width: var(--n-option-icon-prefix-width);
 `),N("icon",`
 font-size: var(--n-option-icon-size);
 `)]),D("label",`
 white-space: nowrap;
 flex: 1;
 z-index: 1;
 `),D("suffix",`
 box-sizing: border-box;
 flex-grow: 0;
 flex-shrink: 0;
 display: flex;
 justify-content: flex-end;
 align-items: center;
 min-width: var(--n-option-suffix-width);
 padding: 0 8px;
 transition: color .3s var(--n-bezier);
 color: var(--n-suffix-color);
 z-index: 1;
 `,[K("has-submenu",`
 width: var(--n-option-icon-suffix-width);
 `),N("icon",`
 font-size: var(--n-option-icon-size);
 `)]),N("dropdown-menu","pointer-events: all;")]),N("dropdown-offset-container",`
 pointer-events: none;
 position: absolute;
 left: 0;
 right: 0;
 top: -4px;
 bottom: -4px;
 `)]),N("dropdown-divider",`
 transition: background-color .3s var(--n-bezier);
 background-color: var(--n-divider-color);
 height: 1px;
 margin: 4px 0;
 `),N("dropdown-menu-wrapper",`
 transform-origin: var(--v-transform-origin);
 width: fit-content;
 `),L(">",[N("scrollbar",`
 height: inherit;
 max-height: inherit;
 `)]),le("scrollable",`
 padding: var(--n-padding);
 `),K("scrollable",[D("content",`
 padding: var(--n-padding);
 `)])]),to={animated:{type:Boolean,default:!0},keyboard:{type:Boolean,default:!0},size:{type:String,default:"medium"},inverted:Boolean,placement:{type:String,default:"bottom"},onSelect:[Function,Array],options:{type:Array,default:()=>[]},menuProps:Function,showArrow:Boolean,renderLabel:Function,renderIcon:Function,renderOption:Function,nodeProps:Function,labelField:{type:String,default:"label"},keyField:{type:String,default:"key"},childrenField:{type:String,default:"children"},value:[String,Number]},ro=Object.keys(ce),io=Object.assign(Object.assign(Object.assign({},ce),to),he.props),wo=B({name:"Dropdown",inheritAttrs:!1,props:io,setup(e){const n=F(!1),i=Ue(I(e,"show"),n),r=m(()=>{const{keyField:a,childrenField:b}=e;return Ve(e.options,{getKey(p){return p[a]},getDisabled(p){return p.disabled===!0},getIgnored(p){return p.type==="divider"||p.type==="render"},getChildren(p){return p[b]}})}),t=m(()=>r.value.treeNodes),o=F(null),c=F(null),f=F(null),d=m(()=>{var a,b,p;return(p=(b=(a=o.value)!==null&&a!==void 0?a:c.value)!==null&&b!==void 0?b:f.value)!==null&&p!==void 0?p:null}),y=m(()=>r.value.getPath(d.value).keyPath),v=m(()=>r.value.getPath(e.value).keyPath),g=X(()=>e.keyboard&&i.value);Ye({keydown:{ArrowUp:{prevent:!0,handler:Q},ArrowRight:{prevent:!0,handler:W},ArrowDown:{prevent:!0,handler:ee},ArrowLeft:{prevent:!0,handler:J},Enter:{prevent:!0,handler:oe},Escape:U}},g);const{mergedClsPrefixRef:S,inlineThemeDisabled:P}=je(e),C=he("Dropdown","-dropdown",no,Me,e,S);H(Z,{labelFieldRef:I(e,"labelField"),childrenFieldRef:I(e,"childrenField"),renderLabelRef:I(e,"renderLabel"),renderIconRef:I(e,"renderIcon"),hoverKeyRef:o,keyboardKeyRef:c,lastToggledSubmenuKeyRef:f,pendingKeyPathRef:y,activeKeyPathRef:v,animatedRef:I(e,"animated"),mergedShowRef:i,nodePropsRef:I(e,"nodeProps"),renderOptionRef:I(e,"renderOption"),menuPropsRef:I(e,"menuProps"),doSelect:j,doUpdateShow:x}),ie(i,a=>{!e.animated&&!a&&O()});function j(a,b){const{onSelect:p}=e;p&&te(p,a,b)}function x(a){const{"onUpdate:show":b,onUpdateShow:p}=e;b&&te(b,a),p&&te(p,a),n.value=a}function O(){o.value=null,c.value=null,f.value=null}function U(){x(!1)}function J(){M("left")}function W(){M("right")}function Q(){M("up")}function ee(){M("down")}function oe(){const a=q();a!=null&&a.isLeaf&&i.value&&(j(a.key,a.rawNode),x(!1))}function q(){var a;const{value:b}=r,{value:p}=d;return!b||p===null?null:(a=b.getNode(p))!==null&&a!==void 0?a:null}function M(a){const{value:b}=d,{value:{getFirstAvailableNode:p}}=r;let u=null;if(b===null){const k=p();k!==null&&(u=k.key)}else{const k=q();if(k){let l;switch(a){case"down":l=k.getNext();break;case"up":l=k.getPrev();break;case"right":l=k.getChild();break;case"left":l=k.getParent();break}l&&(u=l.key)}}u!==null&&(o.value=null,c.value=u)}const E=m(()=>{const{size:a,inverted:b}=e,{common:{cubicBezierEaseInOut:p},self:u}=C.value,{padding:k,dividerColor:l,borderRadius:w,optionOpacityDisabled:R,[A("optionIconSuffixWidth",a)]:$,[A("optionSuffixWidth",a)]:ne,[A("optionIconPrefixWidth",a)]:z,[A("optionPrefixWidth",a)]:ye,[A("fontSize",a)]:ge,[A("optionHeight",a)]:xe,[A("optionIconSize",a)]:Se}=u,h={"--n-bezier":p,"--n-font-size":ge,"--n-padding":k,"--n-border-radius":w,"--n-option-height":xe,"--n-option-prefix-width":ye,"--n-option-icon-prefix-width":z,"--n-option-suffix-width":ne,"--n-option-icon-suffix-width":$,"--n-option-icon-size":Se,"--n-divider-color":l,"--n-option-opacity-disabled":R};return b?(h["--n-color"]=u.colorInverted,h["--n-option-color-hover"]=u.optionColorHoverInverted,h["--n-option-color-active"]=u.optionColorActiveInverted,h["--n-option-text-color"]=u.optionTextColorInverted,h["--n-option-text-color-hover"]=u.optionTextColorHoverInverted,h["--n-option-text-color-active"]=u.optionTextColorActiveInverted,h["--n-option-text-color-child-active"]=u.optionTextColorChildActiveInverted,h["--n-prefix-color"]=u.prefixColorInverted,h["--n-suffix-color"]=u.suffixColorInverted,h["--n-group-header-text-color"]=u.groupHeaderTextColorInverted):(h["--n-color"]=u.color,h["--n-option-color-hover"]=u.optionColorHover,h["--n-option-color-active"]=u.optionColorActive,h["--n-option-text-color"]=u.optionTextColor,h["--n-option-text-color-hover"]=u.optionTextColorHover,h["--n-option-text-color-active"]=u.optionTextColorActive,h["--n-option-text-color-child-active"]=u.optionTextColorChildActive,h["--n-prefix-color"]=u.prefixColor,h["--n-suffix-color"]=u.suffixColor,h["--n-group-header-text-color"]=u.groupHeaderTextColor),h}),_=P?qe("dropdown",m(()=>`${e.size[0]}${e.inverted?"i":""}`),E,e):void 0;return{mergedClsPrefix:S,mergedTheme:C,tmNodes:t,mergedShow:i,handleAfterLeave:()=>{e.animated&&O()},doUpdateShow:x,cssVars:P?void 0:E,themeClass:_==null?void 0:_.themeClass,onRender:_==null?void 0:_.onRender}},render(){const e=(r,t,o,c,f)=>{var d;const{mergedClsPrefix:y,menuProps:v}=this;(d=this.onRender)===null||d===void 0||d.call(this);const g=(v==null?void 0:v(void 0,this.tmNodes.map(P=>P.rawNode)))||{},S={ref:Ge(t),class:[r,`${y}-dropdown`,this.themeClass],clsPrefix:y,tmNodes:this.tmNodes,style:[...o,this.cssVars],showArrow:this.showArrow,arrowStyle:this.arrowStyle,scrollable:this.scrollable,onMouseenter:c,onMouseleave:f};return s(me,fe(this.$attrs,S,g))},{mergedTheme:n}=this,i={show:this.mergedShow,theme:n.peers.Popover,themeOverrides:n.peerOverrides.Popover,internalOnAfterLeave:this.handleAfterLeave,internalRenderBody:e,onUpdateShow:this.doUpdateShow,"onUpdate:show":void 0};return s(Ke,Object.assign({},_e(this.$props,ro),i),{trigger:()=>{var r,t;return(t=(r=this.$slots).default)===null||t===void 0?void 0:t.call(r)}})}});export{wo as N,Ye as u};
