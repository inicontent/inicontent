import{c as B,b as V,u as M,r as O}from"./C1zJybjf.js";import{c8 as H,aA as K,r as p,bq as W,c7 as $,bY as _,bX as D,c4 as b,c6 as i,bW as h,c5 as G,f as L,bZ as A,dx as Y,D as I,ce as P,B as v}from"./b4y72k5A.js";import{u as q}from"./xQnQeLtE.js";import{u as X}from"./DMzQWz3x.js";const Z={name:String,value:{type:[String,Number,Boolean],default:"on"},checked:{type:Boolean,default:void 0},defaultChecked:Boolean,disabled:{type:Boolean,default:void 0},label:String,size:String,onUpdateChecked:[Function,Array],"onUpdate:checked":[Function,Array],checkedValue:{type:Boolean,default:void 0}},J=H("n-radio-group");function Q(o){const e=K(J,null),n=q(o,{mergedSize(a){const{size:r}=o;if(r!==void 0)return r;if(e){const{mergedSizeRef:{value:s}}=e;if(s!==void 0)return s}return a?a.mergedSize.value:"medium"},mergedDisabled(a){return!!(o.disabled||e!=null&&e.disabledRef.value||a!=null&&a.disabled.value)}}),{mergedSizeRef:l,mergedDisabledRef:t}=n,c=p(null),x=p(null),g=p(o.defaultChecked),d=W(o,"checked"),m=X(d,g),u=$(()=>e?e.valueRef.value===o.value:m.value),R=$(()=>{const{name:a}=o;if(a!==void 0)return a;if(e)return e.nameRef.value}),f=p(!1);function k(){if(e){const{doUpdateValue:a}=e,{value:r}=o;B(a,r)}else{const{onUpdateChecked:a,"onUpdate:checked":r}=o,{nTriggerFormInput:s,nTriggerFormChange:y}=n;a&&B(a,!0),r&&B(r,!0),s(),y(),g.value=!0}}function w(){t.value||u.value||k()}function C(){w(),c.value&&(c.value.checked=u.value)}function S(){f.value=!1}function z(){f.value=!0}return{mergedClsPrefix:e?e.mergedClsPrefixRef:_(o).mergedClsPrefixRef,inputRef:c,labelRef:x,mergedName:R,mergedDisabled:t,renderSafeChecked:u,focus:f,mergedSize:l,handleRadioInputChange:C,handleRadioInputBlur:S,handleRadioInputFocus:z}}const ee=D("radio",`
 line-height: var(--n-label-line-height);
 outline: none;
 position: relative;
 user-select: none;
 -webkit-user-select: none;
 display: inline-flex;
 align-items: flex-start;
 flex-wrap: nowrap;
 font-size: var(--n-font-size);
 word-break: break-word;
`,[b("checked",[i("dot",`
 background-color: var(--n-color-active);
 `)]),i("dot-wrapper",`
 position: relative;
 flex-shrink: 0;
 flex-grow: 0;
 width: var(--n-radio-size);
 `),D("radio-input",`
 position: absolute;
 border: 0;
 border-radius: inherit;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 opacity: 0;
 z-index: 1;
 cursor: pointer;
 `),i("dot",`
 position: absolute;
 top: 50%;
 left: 0;
 transform: translateY(-50%);
 height: var(--n-radio-size);
 width: var(--n-radio-size);
 background: var(--n-color);
 box-shadow: var(--n-box-shadow);
 border-radius: 50%;
 transition:
 background-color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier);
 `,[h("&::before",`
 content: "";
 opacity: 0;
 position: absolute;
 left: 4px;
 top: 4px;
 height: calc(100% - 8px);
 width: calc(100% - 8px);
 border-radius: 50%;
 transform: scale(.8);
 background: var(--n-dot-color-active);
 transition: 
 opacity .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 transform .3s var(--n-bezier);
 `),b("checked",{boxShadow:"var(--n-box-shadow-active)"},[h("&::before",`
 opacity: 1;
 transform: scale(1);
 `)])]),i("label",`
 color: var(--n-text-color);
 padding: var(--n-label-padding);
 font-weight: var(--n-label-font-weight);
 display: inline-block;
 transition: color .3s var(--n-bezier);
 `),G("disabled",`
 cursor: pointer;
 `,[h("&:hover",[i("dot",{boxShadow:"var(--n-box-shadow-hover)"})]),b("focus",[h("&:not(:active)",[i("dot",{boxShadow:"var(--n-box-shadow-focus)"})])])]),b("disabled",`
 cursor: not-allowed;
 `,[i("dot",{boxShadow:"var(--n-box-shadow-disabled)",backgroundColor:"var(--n-color-disabled)"},[h("&::before",{backgroundColor:"var(--n-dot-color-disabled)"}),b("checked",`
 opacity: 1;
 `)]),i("label",{color:"var(--n-text-color-disabled)"}),D("radio-input",`
 cursor: not-allowed;
 `)])]),oe=Object.assign(Object.assign({},A.props),Z),de=L({name:"Radio",props:oe,setup(o){const e=Q(o),n=A("Radio","-radio",ee,Y,o,e.mergedClsPrefix),l=I(()=>{const{mergedSize:{value:m}}=e,{common:{cubicBezierEaseInOut:u},self:{boxShadow:R,boxShadowActive:f,boxShadowDisabled:k,boxShadowFocus:w,boxShadowHover:C,color:S,colorDisabled:z,colorActive:a,textColor:r,textColorDisabled:s,dotColorActive:y,dotColorDisabled:F,labelPadding:U,labelLineHeight:j,labelFontWeight:E,[P("fontSize",m)]:N,[P("radioSize",m)]:T}}=n.value;return{"--n-bezier":u,"--n-label-line-height":j,"--n-label-font-weight":E,"--n-box-shadow":R,"--n-box-shadow-active":f,"--n-box-shadow-disabled":k,"--n-box-shadow-focus":w,"--n-box-shadow-hover":C,"--n-color":S,"--n-color-active":a,"--n-color-disabled":z,"--n-dot-color-active":y,"--n-dot-color-disabled":F,"--n-font-size":N,"--n-radio-size":T,"--n-text-color":r,"--n-text-color-disabled":s,"--n-label-padding":U}}),{inlineThemeDisabled:t,mergedClsPrefixRef:c,mergedRtlRef:x}=_(o),g=V("Radio",x,c),d=t?M("radio",I(()=>e.mergedSize.value[0]),l,o):void 0;return Object.assign(e,{rtlEnabled:g,cssVars:t?void 0:l,themeClass:d==null?void 0:d.themeClass,onRender:d==null?void 0:d.onRender})},render(){const{$slots:o,mergedClsPrefix:e,onRender:n,label:l}=this;return n==null||n(),v("label",{class:[`${e}-radio`,this.themeClass,this.rtlEnabled&&`${e}-radio--rtl`,this.mergedDisabled&&`${e}-radio--disabled`,this.renderSafeChecked&&`${e}-radio--checked`,this.focus&&`${e}-radio--focus`],style:this.cssVars},v("input",{ref:"inputRef",type:"radio",class:`${e}-radio-input`,value:this.value,name:this.mergedName,checked:this.renderSafeChecked,disabled:this.mergedDisabled,onChange:this.handleRadioInputChange,onFocus:this.handleRadioInputFocus,onBlur:this.handleRadioInputBlur}),v("div",{class:`${e}-radio__dot-wrapper`}," ",v("div",{class:[`${e}-radio__dot`,this.renderSafeChecked&&`${e}-radio__dot--checked`]})),O(o.default,t=>!t&&!l?null:v("div",{ref:"labelRef",class:`${e}-radio__label`},t||l)))}});export{de as N,J as r};
