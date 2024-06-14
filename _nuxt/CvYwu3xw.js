import{j as s,ai as K,c2 as j,r as U,a7 as B,b3 as se,bt as P,cd as be,c0 as h,c1 as c,c9 as S,cb as C,cf as ue,cC as he,aD as fe,cc as ve,c3 as E,dI as ke,ci as _}from"./C62hEcuG.js";import{u as H,a as me,N as xe}from"./Dl_4uhQq.js";import{u as G,o as ge}from"./BwuD1Zq8.js";import{c as i,b as pe,u as Ce,r as ye}from"./Bi-2ogms.js";import{f as we}from"./D1F6uLnh.js";const Re=s("svg",{viewBox:"0 0 64 64",class:"check-icon"},s("path",{d:"M50.42,16.76L22.34,39.45l-8.1-11.46c-1.12-1.58-3.3-1.96-4.88-0.84c-1.58,1.12-1.95,3.3-0.84,4.88l10.26,14.51  c0.56,0.79,1.42,1.31,2.38,1.45c0.16,0.02,0.32,0.03,0.48,0.03c0.8,0,1.57-0.27,2.2-0.78l30.99-25.03c1.5-1.21,1.74-3.42,0.52-4.92  C54.13,15.78,51.93,15.55,50.42,16.76z"})),ze=s("svg",{viewBox:"0 0 100 100",class:"line-icon"},s("path",{d:"M80.2,55.5H21.4c-2.8,0-5.1-2.5-5.1-5.5l0,0c0-3,2.3-5.5,5.1-5.5h58.7c2.8,0,5.1,2.5,5.1,5.5l0,0C85.2,53.1,82.9,55.5,80.2,55.5z"})),V=be("n-checkbox-group"),Se={min:Number,max:Number,size:String,value:Array,defaultValue:{type:Array,default:null},disabled:{type:Boolean,default:void 0},"onUpdate:value":[Function,Array],onUpdateValue:[Function,Array],onChange:[Function,Array]},Fe=K({name:"CheckboxGroup",props:Se,setup(o){const{mergedClsPrefixRef:y}=j(o),g=H(o),{mergedSizeRef:w,mergedDisabledRef:T}=g,b=U(o.defaultValue),R=B(()=>o.value),u=G(R,b),a=B(()=>{var f;return((f=u.value)===null||f===void 0?void 0:f.length)||0}),n=B(()=>Array.isArray(u.value)?new Set(u.value):new Set);function M(f,r){const{nTriggerFormInput:p,nTriggerFormChange:v}=g,{onChange:l,"onUpdate:value":k,onUpdateValue:m}=o;if(Array.isArray(u.value)){const t=Array.from(u.value),A=t.findIndex(F=>F===r);f?~A||(t.push(r),m&&i(m,t,{actionType:"check",value:r}),k&&i(k,t,{actionType:"check",value:r}),p(),v(),b.value=t,l&&i(l,t)):~A&&(t.splice(A,1),m&&i(m,t,{actionType:"uncheck",value:r}),k&&i(k,t,{actionType:"uncheck",value:r}),l&&i(l,t),b.value=t,p(),v())}else f?(m&&i(m,[r],{actionType:"check",value:r}),k&&i(k,[r],{actionType:"check",value:r}),l&&i(l,[r]),b.value=[r],p(),v()):(m&&i(m,[],{actionType:"uncheck",value:r}),k&&i(k,[],{actionType:"uncheck",value:r}),l&&i(l,[]),b.value=[],p(),v())}return se(V,{checkedCountRef:a,maxRef:P(o,"max"),minRef:P(o,"min"),valueSetRef:n,disabledRef:T,mergedSizeRef:w,toggleCheckbox:M}),{mergedClsPrefix:y}},render(){return s("div",{class:`${this.mergedClsPrefix}-checkbox-group`,role:"group"},this.$slots)}}),Te=h([c("checkbox",`
 font-size: var(--n-font-size);
 outline: none;
 cursor: pointer;
 display: inline-flex;
 flex-wrap: nowrap;
 align-items: flex-start;
 word-break: break-word;
 line-height: var(--n-size);
 --n-merged-color-table: var(--n-color-table);
 `,[S("show-label","line-height: var(--n-label-line-height);"),h("&:hover",[c("checkbox-box",[C("border","border: var(--n-border-checked);")])]),h("&:focus:not(:active)",[c("checkbox-box",[C("border",`
 border: var(--n-border-focus);
 box-shadow: var(--n-box-shadow-focus);
 `)])]),S("inside-table",[c("checkbox-box",`
 background-color: var(--n-merged-color-table);
 `)]),S("checked",[c("checkbox-box",`
 background-color: var(--n-color-checked);
 `,[c("checkbox-icon",[h(".check-icon",`
 opacity: 1;
 transform: scale(1);
 `)])])]),S("indeterminate",[c("checkbox-box",[c("checkbox-icon",[h(".check-icon",`
 opacity: 0;
 transform: scale(.5);
 `),h(".line-icon",`
 opacity: 1;
 transform: scale(1);
 `)])])]),S("checked, indeterminate",[h("&:focus:not(:active)",[c("checkbox-box",[C("border",`
 border: var(--n-border-checked);
 box-shadow: var(--n-box-shadow-focus);
 `)])]),c("checkbox-box",`
 background-color: var(--n-color-checked);
 border-left: 0;
 border-top: 0;
 `,[C("border",{border:"var(--n-border-checked)"})])]),S("disabled",{cursor:"not-allowed"},[S("checked",[c("checkbox-box",`
 background-color: var(--n-color-disabled-checked);
 `,[C("border",{border:"var(--n-border-disabled-checked)"}),c("checkbox-icon",[h(".check-icon, .line-icon",{fill:"var(--n-check-mark-color-disabled-checked)"})])])]),c("checkbox-box",`
 background-color: var(--n-color-disabled);
 `,[C("border",`
 border: var(--n-border-disabled);
 `),c("checkbox-icon",[h(".check-icon, .line-icon",`
 fill: var(--n-check-mark-color-disabled);
 `)])]),C("label",`
 color: var(--n-text-color-disabled);
 `)]),c("checkbox-box-wrapper",`
 position: relative;
 width: var(--n-size);
 flex-shrink: 0;
 flex-grow: 0;
 user-select: none;
 -webkit-user-select: none;
 `),c("checkbox-box",`
 position: absolute;
 left: 0;
 top: 50%;
 transform: translateY(-50%);
 height: var(--n-size);
 width: var(--n-size);
 display: inline-block;
 box-sizing: border-box;
 border-radius: var(--n-border-radius);
 background-color: var(--n-color);
 transition: background-color 0.3s var(--n-bezier);
 `,[C("border",`
 transition:
 border-color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier);
 border-radius: inherit;
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 border: var(--n-border);
 `),c("checkbox-icon",`
 display: flex;
 align-items: center;
 justify-content: center;
 position: absolute;
 left: 1px;
 right: 1px;
 top: 1px;
 bottom: 1px;
 `,[h(".check-icon, .line-icon",`
 width: 100%;
 fill: var(--n-check-mark-color);
 opacity: 0;
 transform: scale(0.5);
 transform-origin: center;
 transition:
 fill 0.3s var(--n-bezier),
 transform 0.3s var(--n-bezier),
 opacity 0.3s var(--n-bezier),
 border-color 0.3s var(--n-bezier);
 `),me({left:"1px",top:"1px"})])]),C("label",`
 color: var(--n-text-color);
 transition: color .3s var(--n-bezier);
 user-select: none;
 -webkit-user-select: none;
 padding: var(--n-label-padding);
 font-weight: var(--n-label-font-weight);
 `,[h("&:empty",{display:"none"})])]),ue(c("checkbox",`
 --n-merged-color-table: var(--n-color-table-modal);
 `)),he(c("checkbox",`
 --n-merged-color-table: var(--n-color-table-popover);
 `))]),De=Object.assign(Object.assign({},E.props),{size:String,checked:{type:[Boolean,String,Number],default:void 0},defaultChecked:{type:[Boolean,String,Number],default:!1},value:[String,Number],disabled:{type:Boolean,default:void 0},indeterminate:Boolean,label:String,focusable:{type:Boolean,default:!0},checkedValue:{type:[Boolean,String,Number],default:!0},uncheckedValue:{type:[Boolean,String,Number],default:!1},"onUpdate:checked":[Function,Array],onUpdateChecked:[Function,Array],privateInsideTable:Boolean,onChange:[Function,Array]}),Ne=K({name:"Checkbox",props:De,setup(o){const y=U(null),{mergedClsPrefixRef:g,inlineThemeDisabled:w,mergedRtlRef:T}=j(o),b=H(o,{mergedSize(e){const{size:x}=o;if(x!==void 0)return x;if(a){const{value:d}=a.mergedSizeRef;if(d!==void 0)return d}if(e){const{mergedSize:d}=e;if(d!==void 0)return d.value}return"medium"},mergedDisabled(e){const{disabled:x}=o;if(x!==void 0)return x;if(a){if(a.disabledRef.value)return!0;const{maxRef:{value:d},checkedCountRef:z}=a;if(d!==void 0&&z.value>=d&&!r.value)return!0;const{minRef:{value:$}}=a;if($!==void 0&&z.value<=$&&r.value)return!0}return e?e.disabled.value:!1}}),{mergedDisabledRef:R,mergedSizeRef:u}=b,a=fe(V,null),n=U(o.defaultChecked),M=P(o,"checked"),f=G(M,n),r=ve(()=>{if(a){const e=a.valueSetRef.value;return e&&o.value!==void 0?e.has(o.value):!1}else return f.value===o.checkedValue}),p=E("Checkbox","-checkbox",Te,ke,o,g);function v(e){if(a&&o.value!==void 0)a.toggleCheckbox(!r.value,o.value);else{const{onChange:x,"onUpdate:checked":d,onUpdateChecked:z}=o,{nTriggerFormInput:$,nTriggerFormChange:N}=b,I=r.value?o.uncheckedValue:o.checkedValue;d&&i(d,I,e),z&&i(z,I,e),x&&i(x,I,e),$(),N(),n.value=I}}function l(e){R.value||v(e)}function k(e){if(!R.value)switch(e.key){case" ":case"Enter":v(e)}}function m(e){switch(e.key){case" ":e.preventDefault()}}const t={focus:()=>{var e;(e=y.value)===null||e===void 0||e.focus()},blur:()=>{var e;(e=y.value)===null||e===void 0||e.blur()}},A=pe("Checkbox",T,g),F=B(()=>{const{value:e}=u,{common:{cubicBezierEaseInOut:x},self:{borderRadius:d,color:z,colorChecked:$,colorDisabled:N,colorTableHeader:I,colorTableHeaderModal:L,colorTableHeaderPopover:O,checkMarkColor:W,checkMarkColorDisabled:Y,border:q,borderFocus:J,borderDisabled:Q,borderChecked:X,boxShadowFocus:Z,textColor:ee,textColorDisabled:oe,checkMarkColorDisabledChecked:re,colorDisabledChecked:ce,borderDisabledChecked:ne,labelPadding:ae,labelLineHeight:le,labelFontWeight:ie,[_("fontSize",e)]:te,[_("size",e)]:de}}=p.value;return{"--n-label-line-height":le,"--n-label-font-weight":ie,"--n-size":de,"--n-bezier":x,"--n-border-radius":d,"--n-border":q,"--n-border-checked":X,"--n-border-focus":J,"--n-border-disabled":Q,"--n-border-disabled-checked":ne,"--n-box-shadow-focus":Z,"--n-color":z,"--n-color-checked":$,"--n-color-table":I,"--n-color-table-modal":L,"--n-color-table-popover":O,"--n-color-disabled":N,"--n-color-disabled-checked":ce,"--n-text-color":ee,"--n-text-color-disabled":oe,"--n-check-mark-color":W,"--n-check-mark-color-disabled":Y,"--n-check-mark-color-disabled-checked":re,"--n-font-size":te,"--n-label-padding":ae}}),D=w?Ce("checkbox",B(()=>u.value[0]),F,o):void 0;return Object.assign(b,t,{rtlEnabled:A,selfRef:y,mergedClsPrefix:g,mergedDisabled:R,renderedChecked:r,mergedTheme:p,labelId:we(),handleClick:l,handleKeyUp:k,handleKeyDown:m,cssVars:w?void 0:F,themeClass:D==null?void 0:D.themeClass,onRender:D==null?void 0:D.onRender})},render(){var o;const{$slots:y,renderedChecked:g,mergedDisabled:w,indeterminate:T,privateInsideTable:b,cssVars:R,labelId:u,label:a,mergedClsPrefix:n,focusable:M,handleKeyUp:f,handleKeyDown:r,handleClick:p}=this;(o=this.onRender)===null||o===void 0||o.call(this);const v=ye(y.default,l=>a||l?s("span",{class:`${n}-checkbox__label`,id:u},a||l):null);return s("div",{ref:"selfRef",class:[`${n}-checkbox`,this.themeClass,this.rtlEnabled&&`${n}-checkbox--rtl`,g&&`${n}-checkbox--checked`,w&&`${n}-checkbox--disabled`,T&&`${n}-checkbox--indeterminate`,b&&`${n}-checkbox--inside-table`,v&&`${n}-checkbox--show-label`],tabindex:w||!M?void 0:0,role:"checkbox","aria-checked":T?"mixed":g,"aria-labelledby":u,style:R,onKeyup:f,onKeydown:r,onClick:p,onMousedown:()=>{ge("selectstart",window,l=>{l.preventDefault()},{once:!0})}},s("div",{class:`${n}-checkbox-box-wrapper`}," ",s("div",{class:`${n}-checkbox-box`},s(xe,null,{default:()=>this.indeterminate?s("div",{key:"indeterminate",class:`${n}-checkbox-icon`},ze):s("div",{key:"check",class:`${n}-checkbox-icon`},Re)}),s("div",{class:`${n}-checkbox-box__border`}))),v)}});export{Fe as N,Ne as a};
