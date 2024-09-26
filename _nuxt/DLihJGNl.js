import{c as B,u as V,a as M}from"./Dzhi6kJb.js";import{af as O,j as H,A as p,ae as K,ab as _,b as $,d as h,f as d,e as b,h as G,i as L,ah as j,l as D,aQ as I,ai as W,t as v}from"./DtwXQcKw.js";import{u as Q}from"./D9DVsfIe.js";import{u as Y}from"./CLX7D053.js";import{u as P}from"./BaqSRRLV.js";import{r as q}from"./DiSrVYBd.js";const J={name:String,value:{type:[String,Number,Boolean],default:"on"},checked:{type:Boolean,default:void 0},defaultChecked:Boolean,disabled:{type:Boolean,default:void 0},label:String,size:String,onUpdateChecked:[Function,Array],"onUpdate:checked":[Function,Array],checkedValue:{type:Boolean,default:void 0}},X=O("n-radio-group");function Z(o){const e=H(X,null),t=Q(o,{mergedSize(a){const{size:r}=o;if(r!==void 0)return r;if(e){const{mergedSizeRef:{value:s}}=e;if(s!==void 0)return s}return a?a.mergedSize.value:"medium"},mergedDisabled(a){return!!(o.disabled||e!=null&&e.disabledRef.value||a!=null&&a.disabled.value)}}),{mergedSizeRef:l,mergedDisabledRef:n}=t,c=p(null),x=p(null),g=p(o.defaultChecked),i=K(o,"checked"),m=Y(i,g),u=P(()=>e?e.valueRef.value===o.value:m.value),R=P(()=>{const{name:a}=o;if(a!==void 0)return a;if(e)return e.nameRef.value}),f=p(!1);function k(){if(e){const{doUpdateValue:a}=e,{value:r}=o;B(a,r)}else{const{onUpdateChecked:a,"onUpdate:checked":r}=o,{nTriggerFormInput:s,nTriggerFormChange:y}=t;a&&B(a,!0),r&&B(r,!0),s(),y(),g.value=!0}}function w(){n.value||u.value||k()}function C(){w(),c.value&&(c.value.checked=u.value)}function S(){f.value=!1}function z(){f.value=!0}return{mergedClsPrefix:e?e.mergedClsPrefixRef:_(o).mergedClsPrefixRef,inputRef:c,labelRef:x,mergedName:R,mergedDisabled:n,renderSafeChecked:u,focus:f,mergedSize:l,handleRadioInputChange:C,handleRadioInputBlur:S,handleRadioInputFocus:z}}const ee=$("radio",`
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
`,[h("checked",[d("dot",`
 background-color: var(--n-color-active);
 `)]),d("dot-wrapper",`
 position: relative;
 flex-shrink: 0;
 flex-grow: 0;
 width: var(--n-radio-size);
 `),$("radio-input",`
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
 `),d("dot",`
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
 `,[b("&::before",`
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
 `),h("checked",{boxShadow:"var(--n-box-shadow-active)"},[b("&::before",`
 opacity: 1;
 transform: scale(1);
 `)])]),d("label",`
 color: var(--n-text-color);
 padding: var(--n-label-padding);
 font-weight: var(--n-label-font-weight);
 display: inline-block;
 transition: color .3s var(--n-bezier);
 `),G("disabled",`
 cursor: pointer;
 `,[b("&:hover",[d("dot",{boxShadow:"var(--n-box-shadow-hover)"})]),h("focus",[b("&:not(:active)",[d("dot",{boxShadow:"var(--n-box-shadow-focus)"})])])]),h("disabled",`
 cursor: not-allowed;
 `,[d("dot",{boxShadow:"var(--n-box-shadow-disabled)",backgroundColor:"var(--n-color-disabled)"},[b("&::before",{backgroundColor:"var(--n-dot-color-disabled)"}),h("checked",`
 opacity: 1;
 `)]),d("label",{color:"var(--n-text-color-disabled)"}),$("radio-input",`
 cursor: not-allowed;
 `)])]),oe=Object.assign(Object.assign({},j.props),J),le=L({name:"Radio",props:oe,setup(o){const e=Z(o),t=j("Radio","-radio",ee,q,o,e.mergedClsPrefix),l=D(()=>{const{mergedSize:{value:m}}=e,{common:{cubicBezierEaseInOut:u},self:{boxShadow:R,boxShadowActive:f,boxShadowDisabled:k,boxShadowFocus:w,boxShadowHover:C,color:S,colorDisabled:z,colorActive:a,textColor:r,textColorDisabled:s,dotColorActive:y,dotColorDisabled:A,labelPadding:F,labelLineHeight:U,labelFontWeight:E,[I("fontSize",m)]:N,[I("radioSize",m)]:T}}=t.value;return{"--n-bezier":u,"--n-label-line-height":U,"--n-label-font-weight":E,"--n-box-shadow":R,"--n-box-shadow-active":f,"--n-box-shadow-disabled":k,"--n-box-shadow-focus":w,"--n-box-shadow-hover":C,"--n-color":S,"--n-color-active":a,"--n-color-disabled":z,"--n-dot-color-active":y,"--n-dot-color-disabled":A,"--n-font-size":N,"--n-radio-size":T,"--n-text-color":r,"--n-text-color-disabled":s,"--n-label-padding":F}}),{inlineThemeDisabled:n,mergedClsPrefixRef:c,mergedRtlRef:x}=_(o),g=V("Radio",x,c),i=n?W("radio",D(()=>e.mergedSize.value[0]),l,o):void 0;return Object.assign(e,{rtlEnabled:g,cssVars:n?void 0:l,themeClass:i==null?void 0:i.themeClass,onRender:i==null?void 0:i.onRender})},render(){const{$slots:o,mergedClsPrefix:e,onRender:t,label:l}=this;return t==null||t(),v("label",{class:[`${e}-radio`,this.themeClass,this.rtlEnabled&&`${e}-radio--rtl`,this.mergedDisabled&&`${e}-radio--disabled`,this.renderSafeChecked&&`${e}-radio--checked`,this.focus&&`${e}-radio--focus`],style:this.cssVars},v("input",{ref:"inputRef",type:"radio",class:`${e}-radio-input`,value:this.value,name:this.mergedName,checked:this.renderSafeChecked,disabled:this.mergedDisabled,onChange:this.handleRadioInputChange,onFocus:this.handleRadioInputFocus,onBlur:this.handleRadioInputBlur}),v("div",{class:`${e}-radio__dot-wrapper`}," ",v("div",{class:[`${e}-radio__dot`,this.renderSafeChecked&&`${e}-radio__dot--checked`]})),M(o.default,n=>!n&&!l?null:v("div",{ref:"labelRef",class:`${e}-radio__label`},n||l)))}});export{le as N,X as r};
