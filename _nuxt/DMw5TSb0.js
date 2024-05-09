import{bZ as ce,eb as ue,cY as he,c1 as U,cb as t,c0 as D,c9 as d,ca as L,ai as be,c2 as fe,c3 as q,r as O,bt as E,a7 as F,ci as p,j as r,f as ve,h as ge,B as H,A as me,i as pe}from"./DxYE6dkH.js";import{a as I,u as we,N as ye,b as xe}from"./C2X-Asp5.js";import{u as ke}from"./CvCi50gL.js";import{p as A,h as c,u as Se,i as M,r as w,c as W}from"./C-zkL6WC.js";import{N as Ce}from"./D-Aarf7o.js";import"./BIYwZJXo.js";import"./HiGXOwLp.js";import"./BaWwQizc.js";import"./B4ydWbZW.js";import"./8m7y4lsc.js";import"./wZRUUBto.js";import"./FM9qwLRW.js";const Be=e=>{const{primaryColor:s,opacityDisabled:l,borderRadius:i,textColor3:n}=e;return Object.assign(Object.assign({},ue),{iconColor:n,textColor:"white",loadingColor:s,opacityDisabled:l,railColor:"rgba(0, 0, 0, .14)",railColorActive:s,buttonBoxShadow:"0 1px 4px 0 rgba(0, 0, 0, 0.3), inset 0 0 1px 0 rgba(0, 0, 0, 0.05)",buttonColor:"#FFF",railBorderRadiusSmall:i,railBorderRadiusMedium:i,railBorderRadiusLarge:i,buttonBorderRadiusSmall:i,buttonBorderRadiusMedium:i,buttonBorderRadiusLarge:i,boxShadowFocus:`0 0 0 2px ${he(s,{alpha:.2})}`})},$e={name:"Switch",common:ce,self:Be},Re=U("switch",`
 height: var(--n-height);
 min-width: var(--n-width);
 vertical-align: middle;
 user-select: none;
 -webkit-user-select: none;
 display: inline-flex;
 outline: none;
 justify-content: center;
 align-items: center;
`,[t("children-placeholder",`
 height: var(--n-rail-height);
 display: flex;
 flex-direction: column;
 overflow: hidden;
 pointer-events: none;
 visibility: hidden;
 `),t("rail-placeholder",`
 display: flex;
 flex-wrap: none;
 `),t("button-placeholder",`
 width: calc(1.75 * var(--n-rail-height));
 height: var(--n-rail-height);
 `),U("base-loading",`
 position: absolute;
 top: 50%;
 left: 50%;
 transform: translateX(-50%) translateY(-50%);
 font-size: calc(var(--n-button-width) - 4px);
 color: var(--n-loading-color);
 transition: color .3s var(--n-bezier);
 `,[I({left:"50%",top:"50%",originalTransform:"translateX(-50%) translateY(-50%)"})]),t("checked, unchecked",`
 transition: color .3s var(--n-bezier);
 color: var(--n-text-color);
 box-sizing: border-box;
 position: absolute;
 white-space: nowrap;
 top: 0;
 bottom: 0;
 display: flex;
 align-items: center;
 line-height: 1;
 `),t("checked",`
 right: 0;
 padding-right: calc(1.25 * var(--n-rail-height) - var(--n-offset));
 `),t("unchecked",`
 left: 0;
 justify-content: flex-end;
 padding-left: calc(1.25 * var(--n-rail-height) - var(--n-offset));
 `),D("&:focus",[t("rail",`
 box-shadow: var(--n-box-shadow-focus);
 `)]),d("round",[t("rail","border-radius: calc(var(--n-rail-height) / 2);",[t("button","border-radius: calc(var(--n-button-height) / 2);")])]),L("disabled",[L("icon",[d("rubber-band",[d("pressed",[t("rail",[t("button","max-width: var(--n-button-width-pressed);")])]),t("rail",[D("&:active",[t("button","max-width: var(--n-button-width-pressed);")])]),d("active",[d("pressed",[t("rail",[t("button","left: calc(100% - var(--n-offset) - var(--n-button-width-pressed));")])]),t("rail",[D("&:active",[t("button","left: calc(100% - var(--n-offset) - var(--n-button-width-pressed));")])])])])])]),d("active",[t("rail",[t("button","left: calc(100% - var(--n-button-width) - var(--n-offset))")])]),t("rail",`
 overflow: hidden;
 height: var(--n-rail-height);
 min-width: var(--n-rail-width);
 border-radius: var(--n-rail-border-radius);
 cursor: pointer;
 position: relative;
 transition:
 opacity .3s var(--n-bezier),
 background .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier);
 background-color: var(--n-rail-color);
 `,[t("button-icon",`
 color: var(--n-icon-color);
 transition: color .3s var(--n-bezier);
 font-size: calc(var(--n-button-height) - 4px);
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 display: flex;
 justify-content: center;
 align-items: center;
 line-height: 1;
 `,[I()]),t("button",`
 align-items: center; 
 top: var(--n-offset);
 left: var(--n-offset);
 height: var(--n-button-height);
 width: var(--n-button-width-pressed);
 max-width: var(--n-button-width);
 border-radius: var(--n-button-border-radius);
 background-color: var(--n-button-color);
 box-shadow: var(--n-button-box-shadow);
 box-sizing: border-box;
 cursor: inherit;
 content: "";
 position: absolute;
 transition:
 background-color .3s var(--n-bezier),
 left .3s var(--n-bezier),
 opacity .3s var(--n-bezier),
 max-width .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier);
 `)]),d("active",[t("rail","background-color: var(--n-rail-color-active);")]),d("loading",[t("rail",`
 cursor: wait;
 `)]),d("disabled",[t("rail",`
 cursor: not-allowed;
 opacity: .5;
 `)])]),Ve=Object.assign(Object.assign({},q.props),{size:{type:String,default:"medium"},value:{type:[String,Number,Boolean],default:void 0},loading:Boolean,defaultValue:{type:[String,Number,Boolean],default:!1},disabled:{type:Boolean,default:void 0},round:{type:Boolean,default:!0},"onUpdate:value":[Function,Array],onUpdateValue:[Function,Array],checkedValue:{type:[String,Number,Boolean],default:!0},uncheckedValue:{type:[String,Number,Boolean],default:!1},railStyle:Function,rubberBand:{type:Boolean,default:!0},onChange:[Function,Array]});let B;const _e=be({name:"Switch",props:Ve,setup(e){B===void 0&&(typeof CSS<"u"?typeof CSS.supports<"u"?B=CSS.supports("width","max(1px)"):B=!1:B=!0);const{mergedClsPrefixRef:s,inlineThemeDisabled:l}=fe(e),i=q("Switch","-switch",Re,$e,e,s),n=we(e),{mergedSizeRef:v,mergedDisabledRef:g}=n,k=O(e.defaultValue),$=E(e,"value"),m=ke($,k),S=F(()=>m.value===e.checkedValue),y=O(!1),a=O(!1),u=F(()=>{const{railStyle:o}=e;if(o)return o({focused:a.value,checked:S.value})});function h(o){const{"onUpdate:value":R,onChange:V,onUpdateValue:_}=e,{nTriggerFormInput:z,nTriggerFormChange:P}=n;R&&W(R,o),_&&W(_,o),V&&W(V,o),k.value=o,z(),P()}function Y(){const{nTriggerFormFocus:o}=n;o()}function X(){const{nTriggerFormBlur:o}=n;o()}function Z(){e.loading||g.value||(m.value!==e.checkedValue?h(e.checkedValue):h(e.uncheckedValue))}function G(){a.value=!0,Y()}function J(){a.value=!1,X(),y.value=!1}function Q(o){e.loading||g.value||o.key===" "&&(m.value!==e.checkedValue?h(e.checkedValue):h(e.uncheckedValue),y.value=!1)}function ee(o){e.loading||g.value||o.key===" "&&(o.preventDefault(),y.value=!0)}const K=F(()=>{const{value:o}=v,{self:{opacityDisabled:R,railColor:V,railColorActive:_,buttonBoxShadow:z,buttonColor:P,boxShadowFocus:te,loadingColor:oe,textColor:ae,iconColor:ie,[p("buttonHeight",o)]:b,[p("buttonWidth",o)]:re,[p("buttonWidthPressed",o)]:ne,[p("railHeight",o)]:f,[p("railWidth",o)]:C,[p("railBorderRadius",o)]:le,[p("buttonBorderRadius",o)]:se},common:{cubicBezierEaseInOut:de}}=i.value;let N,j,T;return B?(N=`calc((${f} - ${b}) / 2)`,j=`max(${f}, ${b})`,T=`max(${C}, calc(${C} + ${b} - ${f}))`):(N=A((c(f)-c(b))/2),j=A(Math.max(c(f),c(b))),T=c(f)>c(b)?C:A(c(C)+c(b)-c(f))),{"--n-bezier":de,"--n-button-border-radius":se,"--n-button-box-shadow":z,"--n-button-color":P,"--n-button-width":re,"--n-button-width-pressed":ne,"--n-button-height":b,"--n-height":j,"--n-offset":N,"--n-opacity-disabled":R,"--n-rail-border-radius":le,"--n-rail-color":V,"--n-rail-color-active":_,"--n-rail-height":f,"--n-rail-width":C,"--n-width":T,"--n-box-shadow-focus":te,"--n-loading-color":oe,"--n-text-color":ae,"--n-icon-color":ie}}),x=l?Se("switch",F(()=>v.value[0]),K,e):void 0;return{handleClick:Z,handleBlur:J,handleFocus:G,handleKeyup:Q,handleKeydown:ee,mergedRailStyle:u,pressed:y,mergedClsPrefix:s,mergedValue:m,checked:S,mergedDisabled:g,cssVars:l?void 0:K,themeClass:x==null?void 0:x.themeClass,onRender:x==null?void 0:x.onRender}},render(){const{mergedClsPrefix:e,mergedDisabled:s,checked:l,mergedRailStyle:i,onRender:n,$slots:v}=this;n==null||n();const{checked:g,unchecked:k,icon:$,"checked-icon":m,"unchecked-icon":S}=v,y=!(M($)&&M(m)&&M(S));return r("div",{role:"switch","aria-checked":l,class:[`${e}-switch`,this.themeClass,y&&`${e}-switch--icon`,l&&`${e}-switch--active`,s&&`${e}-switch--disabled`,this.round&&`${e}-switch--round`,this.loading&&`${e}-switch--loading`,this.pressed&&`${e}-switch--pressed`,this.rubberBand&&`${e}-switch--rubber-band`],tabindex:this.mergedDisabled?void 0:0,style:this.cssVars,onClick:this.handleClick,onFocus:this.handleFocus,onBlur:this.handleBlur,onKeyup:this.handleKeyup,onKeydown:this.handleKeydown},r("div",{class:`${e}-switch__rail`,"aria-hidden":"true",style:i},w(g,a=>w(k,u=>a||u?r("div",{"aria-hidden":!0,class:`${e}-switch__children-placeholder`},r("div",{class:`${e}-switch__rail-placeholder`},r("div",{class:`${e}-switch__button-placeholder`}),a),r("div",{class:`${e}-switch__rail-placeholder`},r("div",{class:`${e}-switch__button-placeholder`}),u)):null)),r("div",{class:`${e}-switch__button`},w($,a=>w(m,u=>w(S,h=>r(ye,null,{default:()=>this.loading?r(xe,{key:"loading",clsPrefix:e,strokeWidth:20}):this.checked&&(u||a)?r("div",{class:`${e}-switch__button-icon`,key:u?"checked-icon":"icon"},u||a):!this.checked&&(h||a)?r("div",{class:`${e}-switch__button-icon`,key:h?"unchecked-icon":"icon"},h||a):null})))),w(g,a=>a&&r("div",{key:"checked",class:`${e}-switch__checked`},a)),w(k,a=>a&&r("div",{key:"unchecked",class:`${e}-switch__unchecked`},a)))))}}),Ue=ve({props:{modelValue:{type:Object,required:!0},field:{type:Object,required:!0},path:{type:String,required:!0}},setup(e){const s=ge("Loading",()=>({}));s.value.Drawer=!1;const l=E(e,"modelValue"),i=e.field,n=e.path;return()=>r(Ce,{labelPlacement:"left",label:pe(i.key),path:n,...i.labelProps?i.labelProps instanceof Function?i.labelProps(H(l.value,n))??{}:i.labelProps:{}},()=>r(_e,{value:H(l.value,n),onUpdateValue:v=>me(l.value,n,v)}))}},"$iAAzoZhMFw");export{Ue as default};
