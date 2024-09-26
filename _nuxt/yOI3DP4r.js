import{dD as H,r as P,dE as q,dF as j,dG as D,dH as te,dI as K,i as A,A as w,t as i,l as $,af as lt,j as Be,aJ as Ne,dJ as ie,dK as Ce,dL as Ue,dM as $e,w as it,e as W,b as g,f as U,d as Ie,ab as st,ah as Ee,q as ut,ae as we,a6 as ct,aQ as _e,ai as dt,aG as ht,bp as pt,ag as ft,bO as mt,bP as vt,S as ye,D as gt,E as bt,F as xt,G as kt,H as Se,aE as Fe}from"./BHakqtML.js";import{o as re,a as oe,g as wt,c as yt}from"./pJhFYZal.js";import{N as St}from"./DhFXkMM1.js";import{N as Ct}from"./B9mSZdDM.js";import{f as Ut}from"./CvVLHJQ-.js";import{u as $t,B as de}from"./BuKvTen5.js";import{u as Rt}from"./BHMQSiF3.js";import{c as At}from"./CHVEmOmI.js";import{u as He}from"./PYyIikNb.js";import{i as Vt}from"./D98Rse4x.js";import{u as Re,B as Mt,a as Pt,V as Dt}from"./BvhJgjxt.js";import{c as he}from"./BAburf3k.js";import{N as zt}from"./BjIF5UJ6.js";import"./BvlEJc1w.js";import"./zjsengzr.js";import"./BbwFPTQ9.js";import"./BMrYdGh8.js";import"./lxAYJypz.js";import"./DFmn5ob7.js";import"./BtrpEMm5.js";import"./iM4_jTAC.js";import"./CZifrpri.js";import"./B7sYoy7v.js";import"./vcvXIv6N.js";import"./DttXmuif.js";import"./D0KRfd1H.js";function Te(e,t,o){t/=100,o/=100;const r=t*Math.min(o,1-o)+o;return[e,r?(2-2*o/r)*100:0,r*100]}function me(e,t,o){t/=100,o/=100;const r=o-o*t/2,n=Math.min(r,1-r);return[e,n?(o-r)/n*100:0,r*100]}function F(e,t,o){t/=100,o/=100;let r=(n,l=(n+e/60)%6)=>o-o*t*Math.max(Math.min(l,4-l,1),0);return[r(5)*255,r(3)*255,r(1)*255]}function Ae(e,t,o){e/=255,t/=255,o/=255;let r=Math.max(e,t,o),n=r-Math.min(e,t,o),l=n&&(r==e?(t-o)/n:r==t?2+(o-e)/n:4+(e-t)/n);return[60*(l<0?l+6:l),r&&n/r*100,r*100]}function Ve(e,t,o){e/=255,t/=255,o/=255;let r=Math.max(e,t,o),n=r-Math.min(e,t,o),l=1-Math.abs(r+r-n-1),s=n&&(r==e?(t-o)/n:r==t?2+(o-e)/n:4+(e-t)/n);return[60*(s<0?s+6:s),l?n/l*100:0,(r+r-n)*50]}function Me(e,t,o){t/=100,o/=100;let r=t*Math.min(o,1-o),n=(l,s=(l+e/30)%12)=>o-r*Math.max(Math.min(s-3,9-s,1),-1);return[n(0)*255,n(8)*255,n(4)*255]}function It(e,t){switch(e[0]){case"hex":return t?"#000000FF":"#000000";case"rgb":return t?"rgba(0, 0, 0, 1)":"rgb(0, 0, 0)";case"hsl":return t?"hsla(0, 0%, 0%, 1)":"hsl(0, 0%, 0%)";case"hsv":return t?"hsva(0, 0%, 0%, 1)":"hsv(0, 0%, 0%)"}return"#000000"}function se(e){return e===null?null:/^ *#/.test(e)?"hex":e.includes("rgb")?"rgb":e.includes("hsl")?"hsl":e.includes("hsv")?"hsv":null}function _t(e){return e=Math.round(e),e>=360?359:e<0?0:e}function Ft(e){return e=Math.round(e*100)/100,e>1?1:e<0?0:e}const Ht={rgb:{hex(e){return H(P(e))},hsl(e){const[t,o,r,n]=P(e);return q([...Ve(t,o,r),n])},hsv(e){const[t,o,r,n]=P(e);return j([...Ae(t,o,r),n])}},hex:{rgb(e){return D(P(e))},hsl(e){const[t,o,r,n]=P(e);return q([...Ve(t,o,r),n])},hsv(e){const[t,o,r,n]=P(e);return j([...Ae(t,o,r),n])}},hsl:{hex(e){const[t,o,r,n]=te(e);return H([...Me(t,o,r),n])},rgb(e){const[t,o,r,n]=te(e);return D([...Me(t,o,r),n])},hsv(e){const[t,o,r,n]=te(e);return j([...Te(t,o,r),n])}},hsv:{hex(e){const[t,o,r,n]=K(e);return H([...F(t,o,r),n])},rgb(e){const[t,o,r,n]=K(e);return D([...F(t,o,r),n])},hsl(e){const[t,o,r,n]=K(e);return q([...me(t,o,r),n])}}};function Oe(e,t,o){return o=o||se(e),o?o===t?e:Ht[o][t](e):null}const ee="12px",qt=12,O="6px",Bt=6,Nt="linear-gradient(90deg,red,#ff0 16.66%,#0f0 33.33%,#0ff 50%,#00f 66.66%,#f0f 83.33%,red)",Et=A({name:"HueSlider",props:{clsPrefix:{type:String,required:!0},hue:{type:Number,required:!0},onUpdateHue:{type:Function,required:!0},onComplete:Function},setup(e){const t=w(null);function o(l){t.value&&(re("mousemove",document,r),re("mouseup",document,n),r(l))}function r(l){const{value:s}=t;if(!s)return;const{width:u,left:f}=s.getBoundingClientRect(),B=_t((l.clientX-f-Bt)/(u-qt)*360);e.onUpdateHue(B)}function n(){var l;oe("mousemove",document,r),oe("mouseup",document,n),(l=e.onComplete)===null||l===void 0||l.call(e)}return{railRef:t,handleMouseDown:o}},render(){const{clsPrefix:e}=this;return i("div",{class:`${e}-color-picker-slider`,style:{height:ee,borderRadius:O}},i("div",{ref:"railRef",style:{boxShadow:"inset 0 0 2px 0 rgba(0, 0, 0, .24)",boxSizing:"border-box",backgroundImage:Nt,height:ee,borderRadius:O,position:"relative"},onMousedown:this.handleMouseDown},i("div",{style:{position:"absolute",left:O,right:O,top:0,bottom:0}},i("div",{class:`${e}-color-picker-handle`,style:{left:`calc((${this.hue}%) / 359 * 100 - ${O})`,borderRadius:O,width:ee,height:ee}},i("div",{class:`${e}-color-picker-handle__fill`,style:{backgroundColor:`hsl(${this.hue}, 100%, 50%)`,borderRadius:O,width:ee,height:ee}})))))}}),le="12px",Tt=12,L="6px",Ot=A({name:"AlphaSlider",props:{clsPrefix:{type:String,required:!0},rgba:{type:Array,default:null},alpha:{type:Number,default:0},onUpdateAlpha:{type:Function,required:!0},onComplete:Function},setup(e){const t=w(null);function o(l){!t.value||!e.rgba||(re("mousemove",document,r),re("mouseup",document,n),r(l))}function r(l){const{value:s}=t;if(!s)return;const{width:u,left:f}=s.getBoundingClientRect(),B=(l.clientX-f)/(u-Tt);e.onUpdateAlpha(Ft(B))}function n(){var l;oe("mousemove",document,r),oe("mouseup",document,n),(l=e.onComplete)===null||l===void 0||l.call(e)}return{railRef:t,railBackgroundImage:$(()=>{const{rgba:l}=e;return l?`linear-gradient(to right, rgba(${l[0]}, ${l[1]}, ${l[2]}, 0) 0%, rgba(${l[0]}, ${l[1]}, ${l[2]}, 1) 100%)`:""}),handleMouseDown:o}},render(){const{clsPrefix:e}=this;return i("div",{class:`${e}-color-picker-slider`,ref:"railRef",style:{height:le,borderRadius:L},onMousedown:this.handleMouseDown},i("div",{style:{borderRadius:L,position:"absolute",left:0,right:0,top:0,bottom:0,overflow:"hidden"}},i("div",{class:`${e}-color-picker-checkboard`}),i("div",{class:`${e}-color-picker-slider__image`,style:{backgroundImage:this.railBackgroundImage}})),this.rgba&&i("div",{style:{position:"absolute",left:L,right:L,top:0,bottom:0}},i("div",{class:`${e}-color-picker-handle`,style:{left:`calc(${this.alpha*100}% - ${L})`,borderRadius:L,width:le,height:le}},i("div",{class:`${e}-color-picker-handle__fill`,style:{backgroundColor:D(this.rgba),borderRadius:L,width:le,height:le}}))))}}),pe="12px",fe="6px",Lt=A({name:"Pallete",props:{clsPrefix:{type:String,required:!0},rgba:{type:Array,default:null},displayedHue:{type:Number,required:!0},displayedSv:{type:Array,required:!0},onUpdateSV:{type:Function,required:!0},onComplete:Function},setup(e){const t=w(null);function o(l){t.value&&(re("mousemove",document,r),re("mouseup",document,n),r(l))}function r(l){const{value:s}=t;if(!s)return;const{width:u,height:f,left:B,bottom:ne}=s.getBoundingClientRect(),N=(ne-l.clientY)/f,G=(l.clientX-B)/u,ue=100*(G>1?1:G<0?0:G),X=100*(N>1?1:N<0?0:N);e.onUpdateSV(ue,X)}function n(){var l;oe("mousemove",document,r),oe("mouseup",document,n),(l=e.onComplete)===null||l===void 0||l.call(e)}return{palleteRef:t,handleColor:$(()=>{const{rgba:l}=e;return l?`rgb(${l[0]}, ${l[1]}, ${l[2]})`:""}),handleMouseDown:o}},render(){const{clsPrefix:e}=this;return i("div",{class:`${e}-color-picker-pallete`,onMousedown:this.handleMouseDown,ref:"palleteRef"},i("div",{class:`${e}-color-picker-pallete__layer`,style:{backgroundImage:`linear-gradient(90deg, white, hsl(${this.displayedHue}, 100%, 50%))`}}),i("div",{class:`${e}-color-picker-pallete__layer ${e}-color-picker-pallete__layer--shadowed`,style:{backgroundImage:"linear-gradient(180deg, rgba(0, 0, 0, 0%), rgba(0, 0, 0, 100%))"}}),this.rgba&&i("div",{class:`${e}-color-picker-handle`,style:{width:pe,height:pe,borderRadius:fe,left:`calc(${this.displayedSv[0]}% - ${fe})`,bottom:`calc(${this.displayedSv[1]}% - ${fe})`}},i("div",{class:`${e}-color-picker-handle__fill`,style:{backgroundColor:this.handleColor,borderRadius:fe,width:pe,height:pe}})))}}),Pe=lt("n-color-picker");function jt(e){return/^\d{1,3}\.?\d*$/.test(e.trim())?Math.max(0,Math.min(Number.parseInt(e),255)):!1}function Kt(e){return/^\d{1,3}\.?\d*$/.test(e.trim())?Math.max(0,Math.min(Number.parseInt(e),360)):!1}function Gt(e){return/^\d{1,3}\.?\d*$/.test(e.trim())?Math.max(0,Math.min(Number.parseInt(e),100)):!1}function Xt(e){const t=e.trim();return/^#[0-9a-fA-F]+$/.test(t)?[4,5,7,9].includes(t.length):!1}function Zt(e){return/^\d{1,3}\.?\d*%$/.test(e.trim())?Math.max(0,Math.min(Number.parseInt(e)/100,100)):!1}const Jt={paddingSmall:"0 4px"},qe=A({name:"ColorInputUnit",props:{label:{type:String,required:!0},value:{type:[Number,String],default:null},showAlpha:Boolean,onUpdateValue:{type:Function,required:!0}},setup(e){const t=w(""),{themeRef:o}=Be(Pe,null);Ne(()=>{t.value=r()});function r(){const{value:s}=e;if(s===null)return"";const{label:u}=e;return u==="HEX"?s:u==="A"?`${Math.floor(s*100)}%`:String(Math.floor(s))}function n(s){t.value=s}function l(s){let u,f;switch(e.label){case"HEX":f=Xt(s),f&&e.onUpdateValue(s),t.value=r();break;case"H":u=Kt(s),u===!1?t.value=r():e.onUpdateValue(u);break;case"S":case"L":case"V":u=Gt(s),u===!1?t.value=r():e.onUpdateValue(u);break;case"A":u=Zt(s),u===!1?t.value=r():e.onUpdateValue(u);break;case"R":case"G":case"B":u=jt(s),u===!1?t.value=r():e.onUpdateValue(u);break}}return{mergedTheme:o,inputValue:t,handleInputChange:l,handleInputUpdateValue:n}},render(){const{mergedTheme:e}=this;return i(St,{size:"small",placeholder:this.label,theme:e.peers.Input,themeOverrides:e.peerOverrides.Input,builtinThemeOverrides:Jt,value:this.inputValue,onUpdateValue:this.handleInputUpdateValue,onChange:this.handleInputChange,style:this.label==="A"?"flex-grow: 1.25;":""})}}),Qt=A({name:"ColorInput",props:{clsPrefix:{type:String,required:!0},mode:{type:String,required:!0},modes:{type:Array,required:!0},showAlpha:{type:Boolean,required:!0},value:{type:String,default:null},valueArr:{type:Array,default:null},onUpdateValue:{type:Function,required:!0},onUpdateMode:{type:Function,required:!0}},setup(e){return{handleUnitUpdateValue(t,o){const{showAlpha:r}=e;if(e.mode==="hex"){e.onUpdateValue((r?H:ie)(o));return}let n;switch(e.valueArr===null?n=[0,0,0,0]:n=Array.from(e.valueArr),e.mode){case"hsv":n[t]=o,e.onUpdateValue((r?j:$e)(n));break;case"rgb":n[t]=o,e.onUpdateValue((r?D:Ue)(n));break;case"hsl":n[t]=o,e.onUpdateValue((r?q:Ce)(n));break}}}},render(){const{clsPrefix:e,modes:t}=this;return i("div",{class:`${e}-color-picker-input`},i("div",{class:`${e}-color-picker-input__mode`,onClick:this.onUpdateMode,style:{cursor:t.length===1?"":"pointer"}},this.mode.toUpperCase()+(this.showAlpha?"A":"")),i(Ct,null,{default:()=>{const{mode:o,valueArr:r,showAlpha:n}=this;if(o==="hex"){let l=null;try{l=r===null?null:(n?H:ie)(r)}catch{}return i(qe,{label:"HEX",showAlpha:n,value:l,onUpdateValue:s=>{this.handleUnitUpdateValue(0,s)}})}return(o+(n?"a":"")).split("").map((l,s)=>i(qe,{label:l.toUpperCase(),value:r===null?null:r[s],onUpdateValue:u=>{this.handleUnitUpdateValue(s,u)}}))}}))}}),Yt=A({name:"ColorPickerTrigger",props:{clsPrefix:{type:String,required:!0},value:{type:String,default:null},hsla:{type:Array,default:null},disabled:Boolean,onClick:Function},setup(e){const{colorPickerSlots:t,renderLabelRef:o}=Be(Pe,null);return()=>{const{hsla:r,value:n,clsPrefix:l,onClick:s,disabled:u}=e,f=t.label||o.value;return i("div",{class:[`${l}-color-picker-trigger`,u&&`${l}-color-picker-trigger--disabled`],onClick:u?void 0:s},i("div",{class:`${l}-color-picker-trigger__fill`},i("div",{class:`${l}-color-picker-checkboard`}),i("div",{style:{position:"absolute",left:0,right:0,top:0,bottom:0,backgroundColor:r?q(r):""}}),n&&r?i("div",{class:`${l}-color-picker-trigger__value`,style:{color:r[2]>50||r[3]<.5?"black":"white"}},f?f(n):n):null))}}});function Wt(e,t){if(t==="hsv"){const[o,r,n,l]=K(e);return D([...F(o,r,n),l])}return e}function er(e){const t=document.createElement("canvas").getContext("2d");return t?(t.fillStyle=e,t.fillStyle):"#000000"}const tr=A({name:"ColorPickerSwatches",props:{clsPrefix:{type:String,required:!0},mode:{type:String,required:!0},swatches:{type:Array,required:!0},onUpdateColor:{type:Function,required:!0}},setup(e){const t=$(()=>e.swatches.map(l=>{const s=se(l);return{value:l,mode:s,legalValue:Wt(l,s)}}));function o(l){const{mode:s}=e;let{value:u,mode:f}=l;return f||(f="hex",/^[a-zA-Z]+$/.test(u)?u=er(u):(it("color-picker",`color ${u} in swatches is invalid.`),u="#000000")),f===s?u:Oe(u,s,f)}function r(l){e.onUpdateColor(o(l))}function n(l,s){l.key==="Enter"&&r(s)}return{parsedSwatchesRef:t,handleSwatchSelect:r,handleSwatchKeyDown:n}},render(){const{clsPrefix:e}=this;return i("div",{class:`${e}-color-picker-swatches`},this.parsedSwatchesRef.map(t=>i("div",{class:`${e}-color-picker-swatch`,tabindex:0,onClick:()=>{this.handleSwatchSelect(t)},onKeydown:o=>{this.handleSwatchKeyDown(o,t)}},i("div",{class:`${e}-color-picker-swatch__fill`,style:{background:t.legalValue}}))))}}),rr=A({name:"ColorPreview",props:{clsPrefix:{type:String,required:!0},mode:{type:String,required:!0},color:{type:String,default:null,validator:e=>{const t=se(e);return!!(!e||t&&t!=="hsv")}},onUpdateColor:{type:Function,required:!0}},setup(e){function t(o){var r;const n=o.target.value;(r=e.onUpdateColor)===null||r===void 0||r.call(e,Oe(n.toUpperCase(),e.mode,"hex")),o.stopPropagation()}return{handleChange:t}},render(){const{clsPrefix:e}=this;return i("div",{class:`${e}-color-picker-preview__preview`},i("span",{class:`${e}-color-picker-preview__fill`,style:{background:this.color||"#000000"}}),i("input",{class:`${e}-color-picker-preview__input`,type:"color",value:this.color,onChange:this.handleChange}))}}),or=W([g("color-picker",`
 display: inline-block;
 box-sizing: border-box;
 height: var(--n-height);
 font-size: var(--n-font-size);
 width: 100%;
 position: relative;
 `),g("color-picker-panel",`
 margin: 4px 0;
 width: 240px;
 font-size: var(--n-panel-font-size);
 color: var(--n-text-color);
 background-color: var(--n-color);
 transition:
 box-shadow .3s var(--n-bezier),
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 border-radius: var(--n-border-radius);
 box-shadow: var(--n-box-shadow);
 `,[Ut(),g("input",`
 text-align: center;
 `)]),g("color-picker-checkboard",`
 background: white; 
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 `,[W("&::after",`
 background-image: linear-gradient(45deg, #DDD 25%, #0000 25%), linear-gradient(-45deg, #DDD 25%, #0000 25%), linear-gradient(45deg, #0000 75%, #DDD 75%), linear-gradient(-45deg, #0000 75%, #DDD 75%);
 background-size: 12px 12px;
 background-position: 0 0, 0 6px, 6px -6px, -6px 0px;
 background-repeat: repeat;
 content: "";
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 `)]),g("color-picker-slider",`
 margin-bottom: 8px;
 position: relative;
 box-sizing: border-box;
 `,[U("image",`
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 `),W("&::after",`
 content: "";
 position: absolute;
 border-radius: inherit;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 box-shadow: inset 0 0 2px 0 rgba(0, 0, 0, .24);
 pointer-events: none;
 `)]),g("color-picker-handle",`
 z-index: 1;
 box-shadow: 0 0 2px 0 rgba(0, 0, 0, .45);
 position: absolute;
 background-color: white;
 overflow: hidden;
 `,[U("fill",`
 box-sizing: border-box;
 border: 2px solid white;
 `)]),g("color-picker-pallete",`
 height: 180px;
 position: relative;
 margin-bottom: 8px;
 cursor: crosshair;
 `,[U("layer",`
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 `,[Ie("shadowed",`
 box-shadow: inset 0 0 2px 0 rgba(0, 0, 0, .24);
 `)])]),g("color-picker-preview",`
 display: flex;
 `,[U("sliders",`
 flex: 1 0 auto;
 `),U("preview",`
 position: relative;
 height: 30px;
 width: 30px;
 margin: 0 0 8px 6px;
 border-radius: 50%;
 box-shadow: rgba(0, 0, 0, .15) 0px 0px 0px 1px inset;
 overflow: hidden;
 `),U("fill",`
 display: block;
 width: 30px;
 height: 30px;
 `),U("input",`
 position: absolute;
 top: 0;
 left: 0;
 width: 30px;
 height: 30px;
 opacity: 0;
 z-index: 1;
 `)]),g("color-picker-input",`
 display: flex;
 align-items: center;
 `,[g("input",`
 flex-grow: 1;
 flex-basis: 0;
 `),U("mode",`
 width: 72px;
 text-align: center;
 `)]),g("color-picker-control",`
 padding: 12px;
 `),g("color-picker-action",`
 display: flex;
 margin-top: -4px;
 border-top: 1px solid var(--n-divider-color);
 padding: 8px 12px;
 justify-content: flex-end;
 `,[g("button","margin-left: 8px;")]),g("color-picker-trigger",`
 border: var(--n-border);
 height: 100%;
 box-sizing: border-box;
 border-radius: var(--n-border-radius);
 transition: border-color .3s var(--n-bezier);
 cursor: pointer;
 `,[U("value",`
 white-space: nowrap;
 position: relative;
 `),U("fill",`
 border-radius: var(--n-border-radius);
 position: absolute;
 display: flex;
 align-items: center;
 justify-content: center;
 left: 4px;
 right: 4px;
 top: 4px;
 bottom: 4px;
 `),Ie("disabled","cursor: not-allowed"),g("color-picker-checkboard",`
 border-radius: var(--n-border-radius);
 `,[W("&::after",`
 --n-block-size: calc((var(--n-height) - 8px) / 3);
 background-size: calc(var(--n-block-size) * 2) calc(var(--n-block-size) * 2);
 background-position: 0 0, 0 var(--n-block-size), var(--n-block-size) calc(-1 * var(--n-block-size)), calc(-1 * var(--n-block-size)) 0px; 
 `)])]),g("color-picker-swatches",`
 display: grid;
 grid-gap: 8px;
 flex-wrap: wrap;
 position: relative;
 grid-template-columns: repeat(auto-fill, 18px);
 margin-top: 10px;
 `,[g("color-picker-swatch",`
 width: 18px;
 height: 18px;
 background-image: linear-gradient(45deg, #DDD 25%, #0000 25%), linear-gradient(-45deg, #DDD 25%, #0000 25%), linear-gradient(45deg, #0000 75%, #DDD 75%), linear-gradient(-45deg, #0000 75%, #DDD 75%);
 background-size: 8px 8px;
 background-position: 0px 0, 0px 4px, 4px -4px, -4px 0px;
 background-repeat: repeat;
 `,[U("fill",`
 position: relative;
 width: 100%;
 height: 100%;
 border-radius: 3px;
 box-shadow: rgba(0, 0, 0, .15) 0px 0px 0px 1px inset;
 cursor: pointer;
 `),W("&:focus",`
 outline: none;
 `,[U("fill",[W("&::after",`
 position: absolute;
 top: 0;
 right: 0;
 bottom: 0;
 left: 0;
 background: inherit;
 filter: blur(2px);
 content: "";
 `)])])])])]),nr=Object.assign(Object.assign({},Ee.props),{value:String,show:{type:Boolean,default:void 0},defaultShow:Boolean,defaultValue:String,modes:{type:Array,default:()=>["rgb","hex","hsl"]},placement:{type:String,default:"bottom-start"},to:Re.propTo,showAlpha:{type:Boolean,default:!0},showPreview:Boolean,swatches:Array,disabled:{type:Boolean,default:void 0},actions:{type:Array,default:null},internalActions:Array,size:String,renderLabel:Function,onComplete:Function,onConfirm:Function,onClear:Function,"onUpdate:show":[Function,Array],onUpdateShow:[Function,Array],"onUpdate:value":[Function,Array],onUpdateValue:[Function,Array]}),ar=A({name:"ColorPicker",props:nr,setup(e,{slots:t}){const o=w(null);let r=null;const n=$t(e),{mergedSizeRef:l,mergedDisabledRef:s}=n,{localeRef:u}=Rt("global"),{mergedClsPrefixRef:f,namespaceRef:B,inlineThemeDisabled:ne}=st(e),N=Ee("ColorPicker","-color-picker",or,At,e,f);ut(Pe,{themeRef:N,renderLabelRef:we(e,"renderLabel"),colorPickerSlots:t});const G=w(e.defaultShow),ue=He(we(e,"show"),G);function X(a){const{onUpdateShow:c,"onUpdate:show":h}=e;c&&he(c,a),h&&he(h,a),G.value=a}const{defaultValue:De}=e,ze=w(De===void 0?It(e.modes,e.showAlpha):De),x=He(we(e,"value"),ze),Z=w([x.value]),V=w(0),ve=$(()=>se(x.value)),{modes:Le}=e,R=w(se(x.value)||Le[0]||"rgb");function je(){const{modes:a}=e,{value:c}=R,h=a.findIndex(p=>p===c);~h?R.value=a[(h+1)%a.length]:R.value="rgb"}let y,S,J,Q,z,I,_,C;const ae=$(()=>{const{value:a}=x;if(!a)return null;switch(ve.value){case"hsv":return K(a);case"hsl":return[y,S,J,C]=te(a),[...Te(y,S,J),C];case"rgb":case"hex":return[z,I,_,C]=P(a),[...Ae(z,I,_),C]}}),E=$(()=>{const{value:a}=x;if(!a)return null;switch(ve.value){case"rgb":case"hex":return P(a);case"hsv":return[y,S,Q,C]=K(a),[...F(y,S,Q),C];case"hsl":return[y,S,J,C]=te(a),[...Me(y,S,J),C]}}),ge=$(()=>{const{value:a}=x;if(!a)return null;switch(ve.value){case"hsl":return te(a);case"hsv":return[y,S,Q,C]=K(a),[...me(y,S,Q),C];case"rgb":case"hex":return[z,I,_,C]=P(a),[...Ve(z,I,_),C]}}),Ke=$(()=>{switch(R.value){case"rgb":case"hex":return E.value;case"hsv":return ae.value;case"hsl":return ge.value}}),ce=w(0),be=w(1),xe=w([0,0]);function Ge(a,c){const{value:h}=ae,p=ce.value,m=h?h[3]:1;xe.value=[a,c];const{showAlpha:d}=e;switch(R.value){case"hsv":v((d?j:$e)([p,a,c,m]),"cursor");break;case"hsl":v((d?q:Ce)([...me(p,a,c),m]),"cursor");break;case"rgb":v((d?D:Ue)([...F(p,a,c),m]),"cursor");break;case"hex":v((d?H:ie)([...F(p,a,c),m]),"cursor");break}}function Xe(a){ce.value=a;const{value:c}=ae;if(!c)return;const[,h,p,m]=c,{showAlpha:d}=e;switch(R.value){case"hsv":v((d?j:$e)([a,h,p,m]),"cursor");break;case"rgb":v((d?D:Ue)([...F(a,h,p),m]),"cursor");break;case"hex":v((d?H:ie)([...F(a,h,p),m]),"cursor");break;case"hsl":v((d?q:Ce)([...me(a,h,p),m]),"cursor");break}}function Ze(a){switch(R.value){case"hsv":[y,S,Q]=ae.value,v(j([y,S,Q,a]),"cursor");break;case"rgb":[z,I,_]=E.value,v(D([z,I,_,a]),"cursor");break;case"hex":[z,I,_]=E.value,v(H([z,I,_,a]),"cursor");break;case"hsl":[y,S,J]=ge.value,v(q([y,S,J,a]),"cursor");break}be.value=a}function v(a,c){c==="cursor"?r=a:r=null;const{nTriggerFormChange:h,nTriggerFormInput:p}=n,{onUpdateValue:m,"onUpdate:value":d}=e;m&&he(m,a),d&&he(d,a),h(),p(),ze.value=a}function Je(a){v(a,"input"),ft(Y)}function Y(a=!0){const{value:c}=x;if(c){const{nTriggerFormChange:h,nTriggerFormInput:p}=n,{onComplete:m}=e;m&&m(c);const{value:d}=Z,{value:k}=V;a&&(d.splice(k+1,d.length,c),V.value=k+1),h(),p()}}function Qe(){const{value:a}=V;a-1<0||(v(Z.value[a-1],"input"),Y(!1),V.value=a-1)}function Ye(){const{value:a}=V;a<0||a+1>=Z.value.length||(v(Z.value[a+1],"input"),Y(!1),V.value=a+1)}function We(){v(null,"input");const{onClear:a}=e;a&&a(),X(!1)}function et(){const{value:a}=x,{onConfirm:c}=e;c&&c(a),X(!1)}const tt=$(()=>V.value>=1),rt=$(()=>{const{value:a}=Z;return a.length>1&&V.value<a.length-1});ct(ue,a=>{a||(Z.value=[x.value],V.value=0)}),Ne(()=>{if(!(r&&r===x.value)){const{value:a}=ae;a&&(ce.value=a[0],be.value=a[3],xe.value=[a[1],a[2]])}r=null});const ke=$(()=>{const{value:a}=l,{common:{cubicBezierEaseInOut:c},self:{textColor:h,color:p,panelFontSize:m,boxShadow:d,border:k,borderRadius:b,dividerColor:T,[_e("height",a)]:nt,[_e("fontSize",a)]:at}}=N.value;return{"--n-bezier":c,"--n-text-color":h,"--n-color":p,"--n-panel-font-size":m,"--n-font-size":at,"--n-box-shadow":d,"--n-border":k,"--n-border-radius":b,"--n-height":nt,"--n-divider-color":T}}),M=ne?dt("color-picker",$(()=>l.value[0]),ke,e):void 0;function ot(){var a;const{value:c}=E,{value:h}=ce,{internalActions:p,modes:m,actions:d}=e,{value:k}=N,{value:b}=f;return i("div",{class:[`${b}-color-picker-panel`,M==null?void 0:M.themeClass.value],onDragstart:T=>{T.preventDefault()},style:ne?void 0:ke.value},i("div",{class:`${b}-color-picker-control`},i(Lt,{clsPrefix:b,rgba:c,displayedHue:h,displayedSv:xe.value,onUpdateSV:Ge,onComplete:Y}),i("div",{class:`${b}-color-picker-preview`},i("div",{class:`${b}-color-picker-preview__sliders`},i(Et,{clsPrefix:b,hue:h,onUpdateHue:Xe,onComplete:Y}),e.showAlpha?i(Ot,{clsPrefix:b,rgba:c,alpha:be.value,onUpdateAlpha:Ze,onComplete:Y}):null),e.showPreview?i(rr,{clsPrefix:b,mode:R.value,color:E.value&&ie(E.value),onUpdateColor:T=>{v(T,"input")}}):null),i(Qt,{clsPrefix:b,showAlpha:e.showAlpha,mode:R.value,modes:m,onUpdateMode:je,value:x.value,valueArr:Ke.value,onUpdateValue:Je}),((a=e.swatches)===null||a===void 0?void 0:a.length)&&i(tr,{clsPrefix:b,mode:R.value,swatches:e.swatches,onUpdateColor:T=>{v(T,"input")}})),d!=null&&d.length?i("div",{class:`${b}-color-picker-action`},d.includes("confirm")&&i(de,{size:"small",onClick:et,theme:k.peers.Button,themeOverrides:k.peerOverrides.Button},{default:()=>u.value.confirm}),d.includes("clear")&&i(de,{size:"small",onClick:We,disabled:!x.value,theme:k.peers.Button,themeOverrides:k.peerOverrides.Button},{default:()=>u.value.clear})):null,t.action?i("div",{class:`${b}-color-picker-action`},{default:t.action}):p?i("div",{class:`${b}-color-picker-action`},p.includes("undo")&&i(de,{size:"small",onClick:Qe,disabled:!tt.value,theme:k.peers.Button,themeOverrides:k.peerOverrides.Button},{default:()=>u.value.undo}),p.includes("redo")&&i(de,{size:"small",onClick:Ye,disabled:!rt.value,theme:k.peers.Button,themeOverrides:k.peerOverrides.Button},{default:()=>u.value.redo})):null)}return{mergedClsPrefix:f,namespace:B,selfRef:o,hsla:ge,rgba:E,mergedShow:ue,mergedDisabled:s,isMounted:Vt(),adjustedTo:Re(e),mergedValue:x,handleTriggerClick(){X(!0)},handleClickOutside(a){var c;!((c=o.value)===null||c===void 0)&&c.contains(wt(a))||X(!1)},renderPanel:ot,cssVars:ne?void 0:ke,themeClass:M==null?void 0:M.themeClass,onRender:M==null?void 0:M.onRender}},render(){const{$slots:e,mergedClsPrefix:t,onRender:o}=this;return o==null||o(),i("div",{class:[this.themeClass,`${t}-color-picker`],ref:"selfRef",style:this.cssVars},i(Mt,null,{default:()=>[i(Pt,null,{default:()=>i(Yt,{clsPrefix:t,value:this.mergedValue,hsla:this.hsla,disabled:this.mergedDisabled,onClick:this.handleTriggerClick},{label:e.label})}),i(Dt,{placement:this.placement,show:this.mergedShow,containerClass:this.namespace,teleportDisabled:this.adjustedTo===Re.tdkey,to:this.adjustedTo},{default:()=>i(ht,{name:"fade-in-scale-up-transition",appear:this.isMounted},{default:()=>this.mergedShow?pt(this.renderPanel(),[[yt,this.handleClickOutside,void 0,{capture:!0}]]):null})})]}))}}),Dr=A({__name:"Color",props:mt({field:{type:Object,required:!0}},{modelValue:{type:String},modelModifiers:{}}),emits:["update:modelValue"],setup(e){const{field:t}=e,o=vt(e,"modelValue"),r={required:t.required,trigger:"change",validator(){if(!o.value&&t.required)return new Error(`${ye(t.key)} ${ye("isRequired")}`)}};return(n,l)=>(gt(),bt(Se(zt),Fe({label:("t"in n?n.t:Se(ye))(t.key),rule:r,path:t.id},t.labelProps?typeof t.labelProps=="function"?t.labelProps(o.value)??{}:t.labelProps:{}),{default:xt(()=>[kt(Se(ar),Fe({modes:["hex"],actions:["clear"],value:o.value,"onUpdate:value":l[0]||(l[0]=s=>o.value=s)},t.inputProps?typeof t.inputProps=="function"?t.inputProps(o.value)??{}:t.inputProps:{}),null,16,["value"])]),_:1},16,["label","path"]))}});export{Dr as default};
