import{e0 as H,dY as P,e1 as q,e2 as j,e3 as M,e4 as te,e5 as X,ai as z,r as w,j as i,a7 as $,cd as ot,aD as He,bO as qe,e6 as ie,e7 as Se,e8 as Ce,e9 as Ue,c4 as at,c0 as W,c1 as m,cb as U,c9 as De,c2 as lt,c3 as Be,ea as it,b3 as st,bt as ve,z as ut,ci as Ie,X as ct,bT as dt,aQ as ht,f as pt,h as ft,B as ye,A as vt,i as gt}from"./bOr_GTnX.js";import{o as re,b as ne,u as _e,i as mt,g as bt}from"./ukkFwBbq.js";import{N as xt}from"./Cxkb2c25.js";import{N as kt}from"./C4lLuvY_.js";import{f as wt}from"./C5iqufg4.js";import{u as yt,B as de}from"./qgRQq2sj.js";import{u as St}from"./CFviLt8g.js";import{u as Ct,c as he}from"./CCKL6qZc.js";import{u as $e,B as Ut,V as $t,a as At}from"./CPd99ZHw.js";import{a as Rt}from"./bCtqIfGU.js";import{N as Vt}from"./HwU1aOxM.js";import"./BRa88Pud.js";import"./j6ysTES8.js";import"./Dx-f_hMZ.js";import"./s3hP1Jng.js";import"./BKh5W52n.js";import"./HiGXOwLp.js";import"./Cp9aoDuM.js";function Te(e,t,n){t/=100,n/=100;const r=t*Math.min(n,1-n)+n;return[e,r?(2-2*n/r)*100:0,r*100]}function ge(e,t,n){t/=100,n/=100;const r=n-n*t/2,o=Math.min(r,1-r);return[e,o?(n-r)/o*100:0,r*100]}function F(e,t,n){t/=100,n/=100;let r=(o,l=(o+e/60)%6)=>n-n*t*Math.max(Math.min(l,4-l,1),0);return[r(5)*255,r(3)*255,r(1)*255]}function Ae(e,t,n){e/=255,t/=255,n/=255;let r=Math.max(e,t,n),o=r-Math.min(e,t,n),l=o&&(r==e?(t-n)/o:r==t?2+(n-e)/o:4+(e-t)/o);return[60*(l<0?l+6:l),r&&o/r*100,r*100]}function Re(e,t,n){e/=255,t/=255,n/=255;let r=Math.max(e,t,n),o=r-Math.min(e,t,n),l=1-Math.abs(r+r-o-1),s=o&&(r==e?(t-n)/o:r==t?2+(n-e)/o:4+(e-t)/o);return[60*(s<0?s+6:s),l?o/l*100:0,(r+r-o)*50]}function Ve(e,t,n){t/=100,n/=100;let r=t*Math.min(n,1-n),o=(l,s=(l+e/30)%12)=>n-r*Math.max(Math.min(s-3,9-s,1),-1);return[o(0)*255,o(8)*255,o(4)*255]}function Pt(e,t){switch(e[0]){case"hex":return t?"#000000FF":"#000000";case"rgb":return t?"rgba(0, 0, 0, 1)":"rgb(0, 0, 0)";case"hsl":return t?"hsla(0, 0%, 0%, 1)":"hsl(0, 0%, 0%)";case"hsv":return t?"hsva(0, 0%, 0%, 1)":"hsv(0, 0%, 0%)"}return"#000000"}function se(e){return e===null?null:/^ *#/.test(e)?"hex":e.includes("rgb")?"rgb":e.includes("hsl")?"hsl":e.includes("hsv")?"hsv":null}function Mt(e){return e=Math.round(e),e>=360?359:e<0?0:e}function zt(e){return e=Math.round(e*100)/100,e>1?1:e<0?0:e}const Dt={rgb:{hex(e){return H(P(e))},hsl(e){const[t,n,r,o]=P(e);return q([...Re(t,n,r),o])},hsv(e){const[t,n,r,o]=P(e);return j([...Ae(t,n,r),o])}},hex:{rgb(e){return M(P(e))},hsl(e){const[t,n,r,o]=P(e);return q([...Re(t,n,r),o])},hsv(e){const[t,n,r,o]=P(e);return j([...Ae(t,n,r),o])}},hsl:{hex(e){const[t,n,r,o]=te(e);return H([...Ve(t,n,r),o])},rgb(e){const[t,n,r,o]=te(e);return M([...Ve(t,n,r),o])},hsv(e){const[t,n,r,o]=te(e);return j([...Te(t,n,r),o])}},hsv:{hex(e){const[t,n,r,o]=X(e);return H([...F(t,n,r),o])},rgb(e){const[t,n,r,o]=X(e);return M([...F(t,n,r),o])},hsl(e){const[t,n,r,o]=X(e);return q([...ge(t,n,r),o])}}};function Ne(e,t,n){return n=n||se(e),n?n===t?e:Dt[n][t](e):null}const ee="12px",It=12,O="6px",_t=6,Ft="linear-gradient(90deg,red,#ff0 16.66%,#0f0 33.33%,#0ff 50%,#00f 66.66%,#f0f 83.33%,red)",Ht=z({name:"HueSlider",props:{clsPrefix:{type:String,required:!0},hue:{type:Number,required:!0},onUpdateHue:{type:Function,required:!0},onComplete:Function},setup(e){const t=w(null);function n(l){t.value&&(re("mousemove",document,r),re("mouseup",document,o),r(l))}function r(l){const{value:s}=t;if(!s)return;const{width:u,left:f}=s.getBoundingClientRect(),B=Mt((l.clientX-f-_t)/(u-It)*360);e.onUpdateHue(B)}function o(){var l;ne("mousemove",document,r),ne("mouseup",document,o),(l=e.onComplete)===null||l===void 0||l.call(e)}return{railRef:t,handleMouseDown:n}},render(){const{clsPrefix:e}=this;return i("div",{class:`${e}-color-picker-slider`,style:{height:ee,borderRadius:O}},i("div",{ref:"railRef",style:{boxShadow:"inset 0 0 2px 0 rgba(0, 0, 0, .24)",boxSizing:"border-box",backgroundImage:Ft,height:ee,borderRadius:O,position:"relative"},onMousedown:this.handleMouseDown},i("div",{style:{position:"absolute",left:O,right:O,top:0,bottom:0}},i("div",{class:`${e}-color-picker-handle`,style:{left:`calc((${this.hue}%) / 359 * 100 - ${O})`,borderRadius:O,width:ee,height:ee}},i("div",{class:`${e}-color-picker-handle__fill`,style:{backgroundColor:`hsl(${this.hue}, 100%, 50%)`,borderRadius:O,width:ee,height:ee}})))))}}),le="12px",qt=12,L="6px",Bt=z({name:"AlphaSlider",props:{clsPrefix:{type:String,required:!0},rgba:{type:Array,default:null},alpha:{type:Number,default:0},onUpdateAlpha:{type:Function,required:!0},onComplete:Function},setup(e){const t=w(null);function n(l){!t.value||!e.rgba||(re("mousemove",document,r),re("mouseup",document,o),r(l))}function r(l){const{value:s}=t;if(!s)return;const{width:u,left:f}=s.getBoundingClientRect(),B=(l.clientX-f)/(u-qt);e.onUpdateAlpha(zt(B))}function o(){var l;ne("mousemove",document,r),ne("mouseup",document,o),(l=e.onComplete)===null||l===void 0||l.call(e)}return{railRef:t,railBackgroundImage:$(()=>{const{rgba:l}=e;return l?`linear-gradient(to right, rgba(${l[0]}, ${l[1]}, ${l[2]}, 0) 0%, rgba(${l[0]}, ${l[1]}, ${l[2]}, 1) 100%)`:""}),handleMouseDown:n}},render(){const{clsPrefix:e}=this;return i("div",{class:`${e}-color-picker-slider`,ref:"railRef",style:{height:le,borderRadius:L},onMousedown:this.handleMouseDown},i("div",{style:{borderRadius:L,position:"absolute",left:0,right:0,top:0,bottom:0,overflow:"hidden"}},i("div",{class:`${e}-color-picker-checkboard`}),i("div",{class:`${e}-color-picker-slider__image`,style:{backgroundImage:this.railBackgroundImage}})),this.rgba&&i("div",{style:{position:"absolute",left:L,right:L,top:0,bottom:0}},i("div",{class:`${e}-color-picker-handle`,style:{left:`calc(${this.alpha*100}% - ${L})`,borderRadius:L,width:le,height:le}},i("div",{class:`${e}-color-picker-handle__fill`,style:{backgroundColor:M(this.rgba),borderRadius:L,width:le,height:le}}))))}}),pe="12px",fe="6px",Tt=z({name:"Pallete",props:{clsPrefix:{type:String,required:!0},rgba:{type:Array,default:null},displayedHue:{type:Number,required:!0},displayedSv:{type:Array,required:!0},onUpdateSV:{type:Function,required:!0},onComplete:Function},setup(e){const t=w(null);function n(l){t.value&&(re("mousemove",document,r),re("mouseup",document,o),r(l))}function r(l){const{value:s}=t;if(!s)return;const{width:u,height:f,left:B,bottom:oe}=s.getBoundingClientRect(),T=(oe-l.clientY)/f,K=(l.clientX-B)/u,ue=100*(K>1?1:K<0?0:K),Z=100*(T>1?1:T<0?0:T);e.onUpdateSV(ue,Z)}function o(){var l;ne("mousemove",document,r),ne("mouseup",document,o),(l=e.onComplete)===null||l===void 0||l.call(e)}return{palleteRef:t,handleColor:$(()=>{const{rgba:l}=e;return l?`rgb(${l[0]}, ${l[1]}, ${l[2]})`:""}),handleMouseDown:n}},render(){const{clsPrefix:e}=this;return i("div",{class:`${e}-color-picker-pallete`,onMousedown:this.handleMouseDown,ref:"palleteRef"},i("div",{class:`${e}-color-picker-pallete__layer`,style:{backgroundImage:`linear-gradient(90deg, white, hsl(${this.displayedHue}, 100%, 50%))`}}),i("div",{class:`${e}-color-picker-pallete__layer ${e}-color-picker-pallete__layer--shadowed`,style:{backgroundImage:"linear-gradient(180deg, rgba(0, 0, 0, 0%), rgba(0, 0, 0, 100%))"}}),this.rgba&&i("div",{class:`${e}-color-picker-handle`,style:{width:pe,height:pe,borderRadius:fe,left:`calc(${this.displayedSv[0]}% - ${fe})`,bottom:`calc(${this.displayedSv[1]}% - ${fe})`}},i("div",{class:`${e}-color-picker-handle__fill`,style:{backgroundColor:this.handleColor,borderRadius:fe,width:pe,height:pe}})))}}),Pe=ot("n-color-picker");function Nt(e){return/^\d{1,3}\.?\d*$/.test(e.trim())?Math.max(0,Math.min(parseInt(e),255)):!1}function Et(e){return/^\d{1,3}\.?\d*$/.test(e.trim())?Math.max(0,Math.min(parseInt(e),360)):!1}function Ot(e){return/^\d{1,3}\.?\d*$/.test(e.trim())?Math.max(0,Math.min(parseInt(e),100)):!1}function Lt(e){const t=e.trim();return/^#[0-9a-fA-F]+$/.test(t)?[4,5,7,9].includes(t.length):!1}function jt(e){return/^\d{1,3}\.?\d*%$/.test(e.trim())?Math.max(0,Math.min(parseInt(e)/100,100)):!1}const Xt={paddingSmall:"0 4px"},Fe=z({name:"ColorInputUnit",props:{label:{type:String,required:!0},value:{type:[Number,String],default:null},showAlpha:Boolean,onUpdateValue:{type:Function,required:!0}},setup(e){const t=w(""),{themeRef:n}=He(Pe,null);qe(()=>{t.value=r()});function r(){const{value:s}=e;if(s===null)return"";const{label:u}=e;return u==="HEX"?s:u==="A"?`${Math.floor(s*100)}%`:String(Math.floor(s))}function o(s){t.value=s}function l(s){let u,f;switch(e.label){case"HEX":f=Lt(s),f&&e.onUpdateValue(s),t.value=r();break;case"H":u=Et(s),u===!1?t.value=r():e.onUpdateValue(u);break;case"S":case"L":case"V":u=Ot(s),u===!1?t.value=r():e.onUpdateValue(u);break;case"A":u=jt(s),u===!1?t.value=r():e.onUpdateValue(u);break;case"R":case"G":case"B":u=Nt(s),u===!1?t.value=r():e.onUpdateValue(u);break}}return{mergedTheme:n,inputValue:t,handleInputChange:l,handleInputUpdateValue:o}},render(){const{mergedTheme:e}=this;return i(xt,{size:"small",placeholder:this.label,theme:e.peers.Input,themeOverrides:e.peerOverrides.Input,builtinThemeOverrides:Xt,value:this.inputValue,onUpdateValue:this.handleInputUpdateValue,onChange:this.handleInputChange,style:this.label==="A"?"flex-grow: 1.25;":""})}}),Kt=z({name:"ColorInput",props:{clsPrefix:{type:String,required:!0},mode:{type:String,required:!0},modes:{type:Array,required:!0},showAlpha:{type:Boolean,required:!0},value:{type:String,default:null},valueArr:{type:Array,default:null},onUpdateValue:{type:Function,required:!0},onUpdateMode:{type:Function,required:!0}},setup(e){return{handleUnitUpdateValue(t,n){const{showAlpha:r}=e;if(e.mode==="hex"){e.onUpdateValue((r?H:ie)(n));return}let o;switch(e.valueArr===null?o=[0,0,0,0]:o=Array.from(e.valueArr),e.mode){case"hsv":o[t]=n,e.onUpdateValue((r?j:Ue)(o));break;case"rgb":o[t]=n,e.onUpdateValue((r?M:Ce)(o));break;case"hsl":o[t]=n,e.onUpdateValue((r?q:Se)(o));break}}}},render(){const{clsPrefix:e,modes:t}=this;return i("div",{class:`${e}-color-picker-input`},i("div",{class:`${e}-color-picker-input__mode`,onClick:this.onUpdateMode,style:{cursor:t.length===1?"":"pointer"}},this.mode.toUpperCase()+(this.showAlpha?"A":"")),i(kt,null,{default:()=>{const{mode:n,valueArr:r,showAlpha:o}=this;if(n==="hex"){let l=null;try{l=r===null?null:(o?H:ie)(r)}catch{}return i(Fe,{label:"HEX",showAlpha:o,value:l,onUpdateValue:s=>{this.handleUnitUpdateValue(0,s)}})}return(n+(o?"a":"")).split("").map((l,s)=>i(Fe,{label:l.toUpperCase(),value:r===null?null:r[s],onUpdateValue:u=>{this.handleUnitUpdateValue(s,u)}}))}}))}}),Zt=z({name:"ColorPickerTrigger",props:{clsPrefix:{type:String,required:!0},value:{type:String,default:null},hsla:{type:Array,default:null},disabled:Boolean,onClick:Function},setup(e){const{colorPickerSlots:t,renderLabelRef:n}=He(Pe,null);return()=>{const{hsla:r,value:o,clsPrefix:l,onClick:s,disabled:u}=e,f=t.label||n.value;return i("div",{class:[`${l}-color-picker-trigger`,u&&`${l}-color-picker-trigger--disabled`],onClick:u?void 0:s},i("div",{class:`${l}-color-picker-trigger__fill`},i("div",{class:`${l}-color-picker-checkboard`}),i("div",{style:{position:"absolute",left:0,right:0,top:0,bottom:0,backgroundColor:r?q(r):""}}),o&&r?i("div",{class:`${l}-color-picker-trigger__value`,style:{color:r[2]>50||r[3]<.5?"black":"white"}},f?f(o):o):null))}}});function Gt(e,t){if(t==="hsv"){const[n,r,o,l]=X(e);return M([...F(n,r,o),l])}return e}function Qt(e){const t=document.createElement("canvas").getContext("2d");return t?(t.fillStyle=e,t.fillStyle):"#000000"}const Yt=z({name:"ColorPickerSwatches",props:{clsPrefix:{type:String,required:!0},mode:{type:String,required:!0},swatches:{type:Array,required:!0},onUpdateColor:{type:Function,required:!0}},setup(e){const t=$(()=>e.swatches.map(l=>{const s=se(l);return{value:l,mode:s,legalValue:Gt(l,s)}}));function n(l){const{mode:s}=e;let{value:u,mode:f}=l;return f||(f="hex",/^[a-zA-Z]+$/.test(u)?u=Qt(u):(at("color-picker",`color ${u} in swatches is invalid.`),u="#000000")),f===s?u:Ne(u,s,f)}function r(l){e.onUpdateColor(n(l))}function o(l,s){l.key==="Enter"&&r(s)}return{parsedSwatchesRef:t,handleSwatchSelect:r,handleSwatchKeyDown:o}},render(){const{clsPrefix:e}=this;return i("div",{class:`${e}-color-picker-swatches`},this.parsedSwatchesRef.map(t=>i("div",{class:`${e}-color-picker-swatch`,tabindex:0,onClick:()=>{this.handleSwatchSelect(t)},onKeydown:n=>{this.handleSwatchKeyDown(n,t)}},i("div",{class:`${e}-color-picker-swatch__fill`,style:{background:t.legalValue}}))))}}),Jt=z({name:"ColorPreview",props:{clsPrefix:{type:String,required:!0},mode:{type:String,required:!0},color:{type:String,default:null,validator:e=>{const t=se(e);return!!(!e||t&&t!=="hsv")}},onUpdateColor:{type:Function,required:!0}},setup(e){function t(n){var r;const o=n.target.value;(r=e.onUpdateColor)===null||r===void 0||r.call(e,Ne(o.toUpperCase(),e.mode,"hex")),n.stopPropagation()}return{handleChange:t}},render(){const{clsPrefix:e}=this;return i("div",{class:`${e}-color-picker-preview__preview`},i("span",{class:`${e}-color-picker-preview__fill`,style:{background:this.color||"#000000"}}),i("input",{class:`${e}-color-picker-preview__input`,type:"color",value:this.color,onChange:this.handleChange}))}}),Wt=W([m("color-picker",`
 display: inline-block;
 box-sizing: border-box;
 height: var(--n-height);
 font-size: var(--n-font-size);
 width: 100%;
 position: relative;
 `),m("color-picker-panel",`
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
 `,[wt(),m("input",`
 text-align: center;
 `)]),m("color-picker-checkboard",`
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
 `)]),m("color-picker-slider",`
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
 `)]),m("color-picker-handle",`
 z-index: 1;
 box-shadow: 0 0 2px 0 rgba(0, 0, 0, .45);
 position: absolute;
 background-color: white;
 overflow: hidden;
 `,[U("fill",`
 box-sizing: border-box;
 border: 2px solid white;
 `)]),m("color-picker-pallete",`
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
 `,[De("shadowed",`
 box-shadow: inset 0 0 2px 0 rgba(0, 0, 0, .24);
 `)])]),m("color-picker-preview",`
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
 `)]),m("color-picker-input",`
 display: flex;
 align-items: center;
 `,[m("input",`
 flex-grow: 1;
 flex-basis: 0;
 `),U("mode",`
 width: 72px;
 text-align: center;
 `)]),m("color-picker-control",`
 padding: 12px;
 `),m("color-picker-action",`
 display: flex;
 margin-top: -4px;
 border-top: 1px solid var(--n-divider-color);
 padding: 8px 12px;
 justify-content: flex-end;
 `,[m("button","margin-left: 8px;")]),m("color-picker-trigger",`
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
 `),De("disabled","cursor: not-allowed"),m("color-picker-checkboard",`
 border-radius: var(--n-border-radius);
 `,[W("&::after",`
 --n-block-size: calc((var(--n-height) - 8px) / 3);
 background-size: calc(var(--n-block-size) * 2) calc(var(--n-block-size) * 2);
 background-position: 0 0, 0 var(--n-block-size), var(--n-block-size) calc(-1 * var(--n-block-size)), calc(-1 * var(--n-block-size)) 0px; 
 `)])]),m("color-picker-swatches",`
 display: grid;
 grid-gap: 8px;
 flex-wrap: wrap;
 position: relative;
 grid-template-columns: repeat(auto-fill, 18px);
 margin-top: 10px;
 `,[m("color-picker-swatch",`
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
 `)])])])])]),er=Object.assign(Object.assign({},Be.props),{value:String,show:{type:Boolean,default:void 0},defaultShow:Boolean,defaultValue:String,modes:{type:Array,default:()=>["rgb","hex","hsl"]},placement:{type:String,default:"bottom-start"},to:$e.propTo,showAlpha:{type:Boolean,default:!0},showPreview:Boolean,swatches:Array,disabled:{type:Boolean,default:void 0},actions:{type:Array,default:null},internalActions:Array,size:String,renderLabel:Function,onComplete:Function,onConfirm:Function,"onUpdate:show":[Function,Array],onUpdateShow:[Function,Array],"onUpdate:value":[Function,Array],onUpdateValue:[Function,Array]}),tr=z({name:"ColorPicker",props:er,setup(e,{slots:t}){const n=w(null);let r=null;const o=yt(e),{mergedSizeRef:l,mergedDisabledRef:s}=o,{localeRef:u}=St("global"),{mergedClsPrefixRef:f,namespaceRef:B,inlineThemeDisabled:oe}=lt(e),T=Be("ColorPicker","-color-picker",Wt,it,e,f);st(Pe,{themeRef:T,renderLabelRef:ve(e,"renderLabel"),colorPickerSlots:t});const K=w(e.defaultShow),ue=_e(ve(e,"show"),K);function Z(a){const{onUpdateShow:c,"onUpdate:show":h}=e;c&&he(c,a),h&&he(h,a),K.value=a}const{defaultValue:Me}=e,ze=w(Me===void 0?Pt(e.modes,e.showAlpha):Me),x=_e(ve(e,"value"),ze),G=w([x.value]),R=w(0),me=$(()=>se(x.value)),{modes:Ee}=e,A=w(se(x.value)||Ee[0]||"rgb");function Oe(){const{modes:a}=e,{value:c}=A,h=a.findIndex(p=>p===c);~h?A.value=a[(h+1)%a.length]:A.value="rgb"}let y,S,Q,Y,D,I,_,C;const ae=$(()=>{const{value:a}=x;if(!a)return null;switch(me.value){case"hsv":return X(a);case"hsl":return[y,S,Q,C]=te(a),[...Te(y,S,Q),C];case"rgb":case"hex":return[D,I,_,C]=P(a),[...Ae(D,I,_),C]}}),N=$(()=>{const{value:a}=x;if(!a)return null;switch(me.value){case"rgb":case"hex":return P(a);case"hsv":return[y,S,Y,C]=X(a),[...F(y,S,Y),C];case"hsl":return[y,S,Q,C]=te(a),[...Ve(y,S,Q),C]}}),be=$(()=>{const{value:a}=x;if(!a)return null;switch(me.value){case"hsl":return te(a);case"hsv":return[y,S,Y,C]=X(a),[...ge(y,S,Y),C];case"rgb":case"hex":return[D,I,_,C]=P(a),[...Re(D,I,_),C]}}),Le=$(()=>{switch(A.value){case"rgb":case"hex":return N.value;case"hsv":return ae.value;case"hsl":return be.value}}),ce=w(0),xe=w(1),ke=w([0,0]);function je(a,c){const{value:h}=ae,p=ce.value,v=h?h[3]:1;ke.value=[a,c];const{showAlpha:d}=e;switch(A.value){case"hsv":g((d?j:Ue)([p,a,c,v]),"cursor");break;case"hsl":g((d?q:Se)([...ge(p,a,c),v]),"cursor");break;case"rgb":g((d?M:Ce)([...F(p,a,c),v]),"cursor");break;case"hex":g((d?H:ie)([...F(p,a,c),v]),"cursor");break}}function Xe(a){ce.value=a;const{value:c}=ae;if(!c)return;const[,h,p,v]=c,{showAlpha:d}=e;switch(A.value){case"hsv":g((d?j:Ue)([a,h,p,v]),"cursor");break;case"rgb":g((d?M:Ce)([...F(a,h,p),v]),"cursor");break;case"hex":g((d?H:ie)([...F(a,h,p),v]),"cursor");break;case"hsl":g((d?q:Se)([...ge(a,h,p),v]),"cursor");break}}function Ke(a){switch(A.value){case"hsv":[y,S,Y]=ae.value,g(j([y,S,Y,a]),"cursor");break;case"rgb":[D,I,_]=N.value,g(M([D,I,_,a]),"cursor");break;case"hex":[D,I,_]=N.value,g(H([D,I,_,a]),"cursor");break;case"hsl":[y,S,Q]=be.value,g(q([y,S,Q,a]),"cursor");break}xe.value=a}function g(a,c){c==="cursor"?r=a:r=null;const{nTriggerFormChange:h,nTriggerFormInput:p}=o,{onUpdateValue:v,"onUpdate:value":d}=e;v&&he(v,a),d&&he(d,a),h(),p(),ze.value=a}function Ze(a){g(a,"input"),ht(J)}function J(a=!0){const{value:c}=x;if(c){const{nTriggerFormChange:h,nTriggerFormInput:p}=o,{onComplete:v}=e;v&&v(c);const{value:d}=G,{value:k}=R;a&&(d.splice(k+1,d.length,c),R.value=k+1),h(),p()}}function Ge(){const{value:a}=R;a-1<0||(g(G.value[a-1],"input"),J(!1),R.value=a-1)}function Qe(){const{value:a}=R;a<0||a+1>=G.value.length||(g(G.value[a+1],"input"),J(!1),R.value=a+1)}function Ye(){g(null,"input"),Z(!1)}function Je(){const{value:a}=x,{onConfirm:c}=e;c&&c(a),Z(!1)}const We=$(()=>R.value>=1),et=$(()=>{const{value:a}=G;return a.length>1&&R.value<a.length-1});ut(ue,a=>{a||(G.value=[x.value],R.value=0)}),qe(()=>{if(!(r&&r===x.value)){const{value:a}=ae;a&&(ce.value=a[0],xe.value=a[3],ke.value=[a[1],a[2]])}r=null});const we=$(()=>{const{value:a}=l,{common:{cubicBezierEaseInOut:c},self:{textColor:h,color:p,panelFontSize:v,boxShadow:d,border:k,borderRadius:b,dividerColor:E,[Ie("height",a)]:rt,[Ie("fontSize",a)]:nt}}=T.value;return{"--n-bezier":c,"--n-text-color":h,"--n-color":p,"--n-panel-font-size":v,"--n-font-size":nt,"--n-box-shadow":d,"--n-border":k,"--n-border-radius":b,"--n-height":rt,"--n-divider-color":E}}),V=oe?Ct("color-picker",$(()=>l.value[0]),we,e):void 0;function tt(){var a;const{value:c}=N,{value:h}=ce,{internalActions:p,modes:v,actions:d}=e,{value:k}=T,{value:b}=f;return i("div",{class:[`${b}-color-picker-panel`,V==null?void 0:V.themeClass.value],onDragstart:E=>{E.preventDefault()},style:oe?void 0:we.value},i("div",{class:`${b}-color-picker-control`},i(Tt,{clsPrefix:b,rgba:c,displayedHue:h,displayedSv:ke.value,onUpdateSV:je,onComplete:J}),i("div",{class:`${b}-color-picker-preview`},i("div",{class:`${b}-color-picker-preview__sliders`},i(Ht,{clsPrefix:b,hue:h,onUpdateHue:Xe,onComplete:J}),e.showAlpha?i(Bt,{clsPrefix:b,rgba:c,alpha:xe.value,onUpdateAlpha:Ke,onComplete:J}):null),e.showPreview?i(Jt,{clsPrefix:b,mode:A.value,color:N.value&&ie(N.value),onUpdateColor:E=>{g(E,"input")}}):null),i(Kt,{clsPrefix:b,showAlpha:e.showAlpha,mode:A.value,modes:v,onUpdateMode:Oe,value:x.value,valueArr:Le.value,onUpdateValue:Ze}),((a=e.swatches)===null||a===void 0?void 0:a.length)&&i(Yt,{clsPrefix:b,mode:A.value,swatches:e.swatches,onUpdateColor:E=>{g(E,"input")}})),d!=null&&d.length?i("div",{class:`${b}-color-picker-action`},d.includes("confirm")&&i(de,{size:"small",onClick:Je,theme:k.peers.Button,themeOverrides:k.peerOverrides.Button},{default:()=>u.value.confirm}),d.includes("clear")&&i(de,{size:"small",onClick:Ye,disabled:!x.value,theme:k.peers.Button,themeOverrides:k.peerOverrides.Button},{default:()=>u.value.clear})):null,t.action?i("div",{class:`${b}-color-picker-action`},{default:t.action}):p?i("div",{class:`${b}-color-picker-action`},p.includes("undo")&&i(de,{size:"small",onClick:Ge,disabled:!We.value,theme:k.peers.Button,themeOverrides:k.peerOverrides.Button},{default:()=>u.value.undo}),p.includes("redo")&&i(de,{size:"small",onClick:Qe,disabled:!et.value,theme:k.peers.Button,themeOverrides:k.peerOverrides.Button},{default:()=>u.value.redo})):null)}return{mergedClsPrefix:f,namespace:B,selfRef:n,hsla:be,rgba:N,mergedShow:ue,mergedDisabled:s,isMounted:mt(),adjustedTo:$e(e),mergedValue:x,handleTriggerClick(){Z(!0)},handleClickOutside(a){var c;!((c=n.value)===null||c===void 0)&&c.contains(bt(a))||Z(!1)},renderPanel:tt,cssVars:oe?void 0:we,themeClass:V==null?void 0:V.themeClass,onRender:V==null?void 0:V.onRender}},render(){const{$slots:e,mergedClsPrefix:t,onRender:n}=this;return n==null||n(),i("div",{class:[this.themeClass,`${t}-color-picker`],ref:"selfRef",style:this.cssVars},i(Ut,null,{default:()=>[i($t,null,{default:()=>i(Zt,{clsPrefix:t,value:this.mergedValue,hsla:this.hsla,disabled:this.mergedDisabled,onClick:this.handleTriggerClick},{label:e.label})}),i(At,{placement:this.placement,show:this.mergedShow,containerClass:this.namespace,teleportDisabled:this.adjustedTo===$e.tdkey,to:this.adjustedTo},{default:()=>i(ct,{name:"fade-in-scale-up-transition",appear:this.isMounted},{default:()=>this.mergedShow?dt(this.renderPanel(),[[Rt,this.handleClickOutside,void 0,{capture:!0}]]):null})})]}))}}),kr=pt({props:{modelValue:{type:Object,required:!0},field:{type:Object,required:!0},path:{type:String,required:!0}},setup(e){const t=ft("Loading",()=>({}));t.value.Drawer=!1;const n=ve(e,"modelValue"),r=e.field,o=e.path;return()=>i(Vt,{label:gt(r.key),path:o,rule:{required:r.required,trigger:"change",message:"This field is required"},...r.labelProps?r.labelProps instanceof Function?r.labelProps(ye(n.value,o))??{}:r.labelProps:{}},()=>i(tr,{modes:["hex"],value:ye(n.value,o),onUpdateValue:l=>vt(n.value,o,l),...r.inputProps?r.inputProps instanceof Function?r.inputProps(ye(n.value,o))??{}:r.inputProps:{}}))}},"$9QM4zeh4M8");export{kr as default};
