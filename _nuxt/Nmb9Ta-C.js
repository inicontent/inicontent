import{d as at}from"./HxAx17ok.js";import{dV as q,dB as P,dW as H,dX as j,dY as M,dZ as te,d_ as X,f as z,r as w,s as i,a7 as $,c7 as lt,aA as He,bJ as Be,d$ as ie,e0 as Ce,e1 as Ue,e2 as $e,bZ as it,bV as Q,bW as m,c5 as U,c3 as Ie,bX as st,bY as Ne,e3 as ut,a$ as ct,bp as ge,A as dt,cd as _e,X as ht,bN as pt,aN as ft,g as gt,dj as ye,dL as vt,q as Se}from"./BGV9FyjN.js";import{o as re,b as ne,u as Fe,i as mt,g as bt}from"./BBsm-Pzt.js";import{N as xt}from"./DRu1MktH.js";import{N as kt}from"./CJNbvQ33.js";import{f as wt}from"./nPiHzMwB.js";import{u as yt,B as de}from"./B2NL4HPj.js";import{u as St}from"./Cb5ufXnC.js";import{u as Ct,c as he}from"./Cp2dohlU.js";import{u as Ae,B as Ut,V as $t,a as At}from"./RVfKK735.js";import{b as Rt}from"./BUq46F_b.js";import{N as Vt}from"./1lUc1wLV.js";import"./DiwTAkPm.js";import"./D2jW_vyf.js";import"./CRQ17Mct.js";import"./BIN9fJOs.js";import"./DTvVgOWz.js";import"./HiGXOwLp.js";import"./B3Jko2nM.js";function Te(e,r,n){r/=100,n/=100;const t=r*Math.min(n,1-n)+n;return[e,t?(2-2*n/t)*100:0,t*100]}function ve(e,r,n){r/=100,n/=100;const t=n-n*r/2,o=Math.min(t,1-t);return[e,o?(n-t)/o*100:0,t*100]}function F(e,r,n){r/=100,n/=100;let t=(o,l=(o+e/60)%6)=>n-n*r*Math.max(Math.min(l,4-l,1),0);return[t(5)*255,t(3)*255,t(1)*255]}function Re(e,r,n){e/=255,r/=255,n/=255;let t=Math.max(e,r,n),o=t-Math.min(e,r,n),l=o&&(t==e?(r-n)/o:t==r?2+(n-e)/o:4+(e-r)/o);return[60*(l<0?l+6:l),t&&o/t*100,t*100]}function Ve(e,r,n){e/=255,r/=255,n/=255;let t=Math.max(e,r,n),o=t-Math.min(e,r,n),l=1-Math.abs(t+t-o-1),s=o&&(t==e?(r-n)/o:t==r?2+(n-e)/o:4+(e-r)/o);return[60*(s<0?s+6:s),l?o/l*100:0,(t+t-o)*50]}function Pe(e,r,n){r/=100,n/=100;let t=r*Math.min(n,1-n),o=(l,s=(l+e/30)%12)=>n-t*Math.max(Math.min(s-3,9-s,1),-1);return[o(0)*255,o(8)*255,o(4)*255]}function Pt(e,r){switch(e[0]){case"hex":return r?"#000000FF":"#000000";case"rgb":return r?"rgba(0, 0, 0, 1)":"rgb(0, 0, 0)";case"hsl":return r?"hsla(0, 0%, 0%, 1)":"hsl(0, 0%, 0%)";case"hsv":return r?"hsva(0, 0%, 0%, 1)":"hsv(0, 0%, 0%)"}return"#000000"}function se(e){return e===null?null:/^ *#/.test(e)?"hex":e.includes("rgb")?"rgb":e.includes("hsl")?"hsl":e.includes("hsv")?"hsv":null}function Mt(e){return e=Math.round(e),e>=360?359:e<0?0:e}function zt(e){return e=Math.round(e*100)/100,e>1?1:e<0?0:e}const Dt={rgb:{hex(e){return q(P(e))},hsl(e){const[r,n,t,o]=P(e);return H([...Ve(r,n,t),o])},hsv(e){const[r,n,t,o]=P(e);return j([...Re(r,n,t),o])}},hex:{rgb(e){return M(P(e))},hsl(e){const[r,n,t,o]=P(e);return H([...Ve(r,n,t),o])},hsv(e){const[r,n,t,o]=P(e);return j([...Re(r,n,t),o])}},hsl:{hex(e){const[r,n,t,o]=te(e);return q([...Pe(r,n,t),o])},rgb(e){const[r,n,t,o]=te(e);return M([...Pe(r,n,t),o])},hsv(e){const[r,n,t,o]=te(e);return j([...Te(r,n,t),o])}},hsv:{hex(e){const[r,n,t,o]=X(e);return q([...F(r,n,t),o])},rgb(e){const[r,n,t,o]=X(e);return M([...F(r,n,t),o])},hsl(e){const[r,n,t,o]=X(e);return H([...ve(r,n,t),o])}}};function Ee(e,r,n){return n=n||se(e),n?n===r?e:Dt[n][r](e):null}const ee="12px",It=12,O="6px",_t=6,Ft="linear-gradient(90deg,red,#ff0 16.66%,#0f0 33.33%,#0ff 50%,#00f 66.66%,#f0f 83.33%,red)",qt=z({name:"HueSlider",props:{clsPrefix:{type:String,required:!0},hue:{type:Number,required:!0},onUpdateHue:{type:Function,required:!0},onComplete:Function},setup(e){const r=w(null);function n(l){r.value&&(re("mousemove",document,t),re("mouseup",document,o),t(l))}function t(l){const{value:s}=r;if(!s)return;const{width:u,left:f}=s.getBoundingClientRect(),B=Mt((l.clientX-f-_t)/(u-It)*360);e.onUpdateHue(B)}function o(){var l;ne("mousemove",document,t),ne("mouseup",document,o),(l=e.onComplete)===null||l===void 0||l.call(e)}return{railRef:r,handleMouseDown:n}},render(){const{clsPrefix:e}=this;return i("div",{class:`${e}-color-picker-slider`,style:{height:ee,borderRadius:O}},i("div",{ref:"railRef",style:{boxShadow:"inset 0 0 2px 0 rgba(0, 0, 0, .24)",boxSizing:"border-box",backgroundImage:Ft,height:ee,borderRadius:O,position:"relative"},onMousedown:this.handleMouseDown},i("div",{style:{position:"absolute",left:O,right:O,top:0,bottom:0}},i("div",{class:`${e}-color-picker-handle`,style:{left:`calc((${this.hue}%) / 359 * 100 - ${O})`,borderRadius:O,width:ee,height:ee}},i("div",{class:`${e}-color-picker-handle__fill`,style:{backgroundColor:`hsl(${this.hue}, 100%, 50%)`,borderRadius:O,width:ee,height:ee}})))))}}),le="12px",Ht=12,L="6px",Bt=z({name:"AlphaSlider",props:{clsPrefix:{type:String,required:!0},rgba:{type:Array,default:null},alpha:{type:Number,default:0},onUpdateAlpha:{type:Function,required:!0},onComplete:Function},setup(e){const r=w(null);function n(l){!r.value||!e.rgba||(re("mousemove",document,t),re("mouseup",document,o),t(l))}function t(l){const{value:s}=r;if(!s)return;const{width:u,left:f}=s.getBoundingClientRect(),B=(l.clientX-f)/(u-Ht);e.onUpdateAlpha(zt(B))}function o(){var l;ne("mousemove",document,t),ne("mouseup",document,o),(l=e.onComplete)===null||l===void 0||l.call(e)}return{railRef:r,railBackgroundImage:$(()=>{const{rgba:l}=e;return l?`linear-gradient(to right, rgba(${l[0]}, ${l[1]}, ${l[2]}, 0) 0%, rgba(${l[0]}, ${l[1]}, ${l[2]}, 1) 100%)`:""}),handleMouseDown:n}},render(){const{clsPrefix:e}=this;return i("div",{class:`${e}-color-picker-slider`,ref:"railRef",style:{height:le,borderRadius:L},onMousedown:this.handleMouseDown},i("div",{style:{borderRadius:L,position:"absolute",left:0,right:0,top:0,bottom:0,overflow:"hidden"}},i("div",{class:`${e}-color-picker-checkboard`}),i("div",{class:`${e}-color-picker-slider__image`,style:{backgroundImage:this.railBackgroundImage}})),this.rgba&&i("div",{style:{position:"absolute",left:L,right:L,top:0,bottom:0}},i("div",{class:`${e}-color-picker-handle`,style:{left:`calc(${this.alpha*100}% - ${L})`,borderRadius:L,width:le,height:le}},i("div",{class:`${e}-color-picker-handle__fill`,style:{backgroundColor:M(this.rgba),borderRadius:L,width:le,height:le}}))))}}),pe="12px",fe="6px",Nt=z({name:"Pallete",props:{clsPrefix:{type:String,required:!0},rgba:{type:Array,default:null},displayedHue:{type:Number,required:!0},displayedSv:{type:Array,required:!0},onUpdateSV:{type:Function,required:!0},onComplete:Function},setup(e){const r=w(null);function n(l){r.value&&(re("mousemove",document,t),re("mouseup",document,o),t(l))}function t(l){const{value:s}=r;if(!s)return;const{width:u,height:f,left:B,bottom:oe}=s.getBoundingClientRect(),N=(oe-l.clientY)/f,Z=(l.clientX-B)/u,ue=100*(Z>1?1:Z<0?0:Z),K=100*(N>1?1:N<0?0:N);e.onUpdateSV(ue,K)}function o(){var l;ne("mousemove",document,t),ne("mouseup",document,o),(l=e.onComplete)===null||l===void 0||l.call(e)}return{palleteRef:r,handleColor:$(()=>{const{rgba:l}=e;return l?`rgb(${l[0]}, ${l[1]}, ${l[2]})`:""}),handleMouseDown:n}},render(){const{clsPrefix:e}=this;return i("div",{class:`${e}-color-picker-pallete`,onMousedown:this.handleMouseDown,ref:"palleteRef"},i("div",{class:`${e}-color-picker-pallete__layer`,style:{backgroundImage:`linear-gradient(90deg, white, hsl(${this.displayedHue}, 100%, 50%))`}}),i("div",{class:`${e}-color-picker-pallete__layer ${e}-color-picker-pallete__layer--shadowed`,style:{backgroundImage:"linear-gradient(180deg, rgba(0, 0, 0, 0%), rgba(0, 0, 0, 100%))"}}),this.rgba&&i("div",{class:`${e}-color-picker-handle`,style:{width:pe,height:pe,borderRadius:fe,left:`calc(${this.displayedSv[0]}% - ${fe})`,bottom:`calc(${this.displayedSv[1]}% - ${fe})`}},i("div",{class:`${e}-color-picker-handle__fill`,style:{backgroundColor:this.handleColor,borderRadius:fe,width:pe,height:pe}})))}}),Me=lt("n-color-picker");function Tt(e){return/^\d{1,3}\.?\d*$/.test(e.trim())?Math.max(0,Math.min(Number.parseInt(e),255)):!1}function Et(e){return/^\d{1,3}\.?\d*$/.test(e.trim())?Math.max(0,Math.min(Number.parseInt(e),360)):!1}function Ot(e){return/^\d{1,3}\.?\d*$/.test(e.trim())?Math.max(0,Math.min(Number.parseInt(e),100)):!1}function Lt(e){const r=e.trim();return/^#[0-9a-fA-F]+$/.test(r)?[4,5,7,9].includes(r.length):!1}function jt(e){return/^\d{1,3}\.?\d*%$/.test(e.trim())?Math.max(0,Math.min(Number.parseInt(e)/100,100)):!1}const Xt={paddingSmall:"0 4px"},qe=z({name:"ColorInputUnit",props:{label:{type:String,required:!0},value:{type:[Number,String],default:null},showAlpha:Boolean,onUpdateValue:{type:Function,required:!0}},setup(e){const r=w(""),{themeRef:n}=He(Me,null);Be(()=>{r.value=t()});function t(){const{value:s}=e;if(s===null)return"";const{label:u}=e;return u==="HEX"?s:u==="A"?`${Math.floor(s*100)}%`:String(Math.floor(s))}function o(s){r.value=s}function l(s){let u,f;switch(e.label){case"HEX":f=Lt(s),f&&e.onUpdateValue(s),r.value=t();break;case"H":u=Et(s),u===!1?r.value=t():e.onUpdateValue(u);break;case"S":case"L":case"V":u=Ot(s),u===!1?r.value=t():e.onUpdateValue(u);break;case"A":u=jt(s),u===!1?r.value=t():e.onUpdateValue(u);break;case"R":case"G":case"B":u=Tt(s),u===!1?r.value=t():e.onUpdateValue(u);break}}return{mergedTheme:n,inputValue:r,handleInputChange:l,handleInputUpdateValue:o}},render(){const{mergedTheme:e}=this;return i(xt,{size:"small",placeholder:this.label,theme:e.peers.Input,themeOverrides:e.peerOverrides.Input,builtinThemeOverrides:Xt,value:this.inputValue,onUpdateValue:this.handleInputUpdateValue,onChange:this.handleInputChange,style:this.label==="A"?"flex-grow: 1.25;":""})}}),Zt=z({name:"ColorInput",props:{clsPrefix:{type:String,required:!0},mode:{type:String,required:!0},modes:{type:Array,required:!0},showAlpha:{type:Boolean,required:!0},value:{type:String,default:null},valueArr:{type:Array,default:null},onUpdateValue:{type:Function,required:!0},onUpdateMode:{type:Function,required:!0}},setup(e){return{handleUnitUpdateValue(r,n){const{showAlpha:t}=e;if(e.mode==="hex"){e.onUpdateValue((t?q:ie)(n));return}let o;switch(e.valueArr===null?o=[0,0,0,0]:o=Array.from(e.valueArr),e.mode){case"hsv":o[r]=n,e.onUpdateValue((t?j:$e)(o));break;case"rgb":o[r]=n,e.onUpdateValue((t?M:Ue)(o));break;case"hsl":o[r]=n,e.onUpdateValue((t?H:Ce)(o));break}}}},render(){const{clsPrefix:e,modes:r}=this;return i("div",{class:`${e}-color-picker-input`},i("div",{class:`${e}-color-picker-input__mode`,onClick:this.onUpdateMode,style:{cursor:r.length===1?"":"pointer"}},this.mode.toUpperCase()+(this.showAlpha?"A":"")),i(kt,null,{default:()=>{const{mode:n,valueArr:t,showAlpha:o}=this;if(n==="hex"){let l=null;try{l=t===null?null:(o?q:ie)(t)}catch{}return i(qe,{label:"HEX",showAlpha:o,value:l,onUpdateValue:s=>{this.handleUnitUpdateValue(0,s)}})}return(n+(o?"a":"")).split("").map((l,s)=>i(qe,{label:l.toUpperCase(),value:t===null?null:t[s],onUpdateValue:u=>{this.handleUnitUpdateValue(s,u)}}))}}))}}),Kt=z({name:"ColorPickerTrigger",props:{clsPrefix:{type:String,required:!0},value:{type:String,default:null},hsla:{type:Array,default:null},disabled:Boolean,onClick:Function},setup(e){const{colorPickerSlots:r,renderLabelRef:n}=He(Me,null);return()=>{const{hsla:t,value:o,clsPrefix:l,onClick:s,disabled:u}=e,f=r.label||n.value;return i("div",{class:[`${l}-color-picker-trigger`,u&&`${l}-color-picker-trigger--disabled`],onClick:u?void 0:s},i("div",{class:`${l}-color-picker-trigger__fill`},i("div",{class:`${l}-color-picker-checkboard`}),i("div",{style:{position:"absolute",left:0,right:0,top:0,bottom:0,backgroundColor:t?H(t):""}}),o&&t?i("div",{class:`${l}-color-picker-trigger__value`,style:{color:t[2]>50||t[3]<.5?"black":"white"}},f?f(o):o):null))}}});function Gt(e,r){if(r==="hsv"){const[n,t,o,l]=X(e);return M([...F(n,t,o),l])}return e}function Yt(e){const r=document.createElement("canvas").getContext("2d");return r?(r.fillStyle=e,r.fillStyle):"#000000"}const Wt=z({name:"ColorPickerSwatches",props:{clsPrefix:{type:String,required:!0},mode:{type:String,required:!0},swatches:{type:Array,required:!0},onUpdateColor:{type:Function,required:!0}},setup(e){const r=$(()=>e.swatches.map(l=>{const s=se(l);return{value:l,mode:s,legalValue:Gt(l,s)}}));function n(l){const{mode:s}=e;let{value:u,mode:f}=l;return f||(f="hex",/^[a-zA-Z]+$/.test(u)?u=Yt(u):(it("color-picker",`color ${u} in swatches is invalid.`),u="#000000")),f===s?u:Ee(u,s,f)}function t(l){e.onUpdateColor(n(l))}function o(l,s){l.key==="Enter"&&t(s)}return{parsedSwatchesRef:r,handleSwatchSelect:t,handleSwatchKeyDown:o}},render(){const{clsPrefix:e}=this;return i("div",{class:`${e}-color-picker-swatches`},this.parsedSwatchesRef.map(r=>i("div",{class:`${e}-color-picker-swatch`,tabindex:0,onClick:()=>{this.handleSwatchSelect(r)},onKeydown:n=>{this.handleSwatchKeyDown(n,r)}},i("div",{class:`${e}-color-picker-swatch__fill`,style:{background:r.legalValue}}))))}}),Jt=z({name:"ColorPreview",props:{clsPrefix:{type:String,required:!0},mode:{type:String,required:!0},color:{type:String,default:null,validator:e=>{const r=se(e);return!!(!e||r&&r!=="hsv")}},onUpdateColor:{type:Function,required:!0}},setup(e){function r(n){var t;const o=n.target.value;(t=e.onUpdateColor)===null||t===void 0||t.call(e,Ee(o.toUpperCase(),e.mode,"hex")),n.stopPropagation()}return{handleChange:r}},render(){const{clsPrefix:e}=this;return i("div",{class:`${e}-color-picker-preview__preview`},i("span",{class:`${e}-color-picker-preview__fill`,style:{background:this.color||"#000000"}}),i("input",{class:`${e}-color-picker-preview__input`,type:"color",value:this.color,onChange:this.handleChange}))}}),Qt=Q([m("color-picker",`
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
 `,[Q("&::after",`
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
 `),Q("&::after",`
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
 `,[Ie("shadowed",`
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
 `),Ie("disabled","cursor: not-allowed"),m("color-picker-checkboard",`
 border-radius: var(--n-border-radius);
 `,[Q("&::after",`
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
 `),Q("&:focus",`
 outline: none;
 `,[U("fill",[Q("&::after",`
 position: absolute;
 top: 0;
 right: 0;
 bottom: 0;
 left: 0;
 background: inherit;
 filter: blur(2px);
 content: "";
 `)])])])])]),er=Object.assign(Object.assign({},Ne.props),{value:String,show:{type:Boolean,default:void 0},defaultShow:Boolean,defaultValue:String,modes:{type:Array,default:()=>["rgb","hex","hsl"]},placement:{type:String,default:"bottom-start"},to:Ae.propTo,showAlpha:{type:Boolean,default:!0},showPreview:Boolean,swatches:Array,disabled:{type:Boolean,default:void 0},actions:{type:Array,default:null},internalActions:Array,size:String,renderLabel:Function,onComplete:Function,onConfirm:Function,onClear:Function,"onUpdate:show":[Function,Array],onUpdateShow:[Function,Array],"onUpdate:value":[Function,Array],onUpdateValue:[Function,Array]}),tr=z({name:"ColorPicker",props:er,setup(e,{slots:r}){const n=w(null);let t=null;const o=yt(e),{mergedSizeRef:l,mergedDisabledRef:s}=o,{localeRef:u}=St("global"),{mergedClsPrefixRef:f,namespaceRef:B,inlineThemeDisabled:oe}=st(e),N=Ne("ColorPicker","-color-picker",Qt,ut,e,f);ct(Me,{themeRef:N,renderLabelRef:ge(e,"renderLabel"),colorPickerSlots:r});const Z=w(e.defaultShow),ue=Fe(ge(e,"show"),Z);function K(a){const{onUpdateShow:c,"onUpdate:show":h}=e;c&&he(c,a),h&&he(h,a),Z.value=a}const{defaultValue:ze}=e,De=w(ze===void 0?Pt(e.modes,e.showAlpha):ze),x=Fe(ge(e,"value"),De),G=w([x.value]),R=w(0),me=$(()=>se(x.value)),{modes:Oe}=e,A=w(se(x.value)||Oe[0]||"rgb");function Le(){const{modes:a}=e,{value:c}=A,h=a.findIndex(p=>p===c);~h?A.value=a[(h+1)%a.length]:A.value="rgb"}let y,S,Y,W,D,I,_,C;const ae=$(()=>{const{value:a}=x;if(!a)return null;switch(me.value){case"hsv":return X(a);case"hsl":return[y,S,Y,C]=te(a),[...Te(y,S,Y),C];case"rgb":case"hex":return[D,I,_,C]=P(a),[...Re(D,I,_),C]}}),T=$(()=>{const{value:a}=x;if(!a)return null;switch(me.value){case"rgb":case"hex":return P(a);case"hsv":return[y,S,W,C]=X(a),[...F(y,S,W),C];case"hsl":return[y,S,Y,C]=te(a),[...Pe(y,S,Y),C]}}),be=$(()=>{const{value:a}=x;if(!a)return null;switch(me.value){case"hsl":return te(a);case"hsv":return[y,S,W,C]=X(a),[...ve(y,S,W),C];case"rgb":case"hex":return[D,I,_,C]=P(a),[...Ve(D,I,_),C]}}),je=$(()=>{switch(A.value){case"rgb":case"hex":return T.value;case"hsv":return ae.value;case"hsl":return be.value}}),ce=w(0),xe=w(1),ke=w([0,0]);function Xe(a,c){const{value:h}=ae,p=ce.value,g=h?h[3]:1;ke.value=[a,c];const{showAlpha:d}=e;switch(A.value){case"hsv":v((d?j:$e)([p,a,c,g]),"cursor");break;case"hsl":v((d?H:Ce)([...ve(p,a,c),g]),"cursor");break;case"rgb":v((d?M:Ue)([...F(p,a,c),g]),"cursor");break;case"hex":v((d?q:ie)([...F(p,a,c),g]),"cursor");break}}function Ze(a){ce.value=a;const{value:c}=ae;if(!c)return;const[,h,p,g]=c,{showAlpha:d}=e;switch(A.value){case"hsv":v((d?j:$e)([a,h,p,g]),"cursor");break;case"rgb":v((d?M:Ue)([...F(a,h,p),g]),"cursor");break;case"hex":v((d?q:ie)([...F(a,h,p),g]),"cursor");break;case"hsl":v((d?H:Ce)([...ve(a,h,p),g]),"cursor");break}}function Ke(a){switch(A.value){case"hsv":[y,S,W]=ae.value,v(j([y,S,W,a]),"cursor");break;case"rgb":[D,I,_]=T.value,v(M([D,I,_,a]),"cursor");break;case"hex":[D,I,_]=T.value,v(q([D,I,_,a]),"cursor");break;case"hsl":[y,S,Y]=be.value,v(H([y,S,Y,a]),"cursor");break}xe.value=a}function v(a,c){c==="cursor"?t=a:t=null;const{nTriggerFormChange:h,nTriggerFormInput:p}=o,{onUpdateValue:g,"onUpdate:value":d}=e;g&&he(g,a),d&&he(d,a),h(),p(),De.value=a}function Ge(a){v(a,"input"),ft(J)}function J(a=!0){const{value:c}=x;if(c){const{nTriggerFormChange:h,nTriggerFormInput:p}=o,{onComplete:g}=e;g&&g(c);const{value:d}=G,{value:k}=R;a&&(d.splice(k+1,d.length,c),R.value=k+1),h(),p()}}function Ye(){const{value:a}=R;a-1<0||(v(G.value[a-1],"input"),J(!1),R.value=a-1)}function We(){const{value:a}=R;a<0||a+1>=G.value.length||(v(G.value[a+1],"input"),J(!1),R.value=a+1)}function Je(){v(null,"input");const{onClear:a}=e;a&&a(),K(!1)}function Qe(){const{value:a}=x,{onConfirm:c}=e;c&&c(a),K(!1)}const et=$(()=>R.value>=1),tt=$(()=>{const{value:a}=G;return a.length>1&&R.value<a.length-1});dt(ue,a=>{a||(G.value=[x.value],R.value=0)}),Be(()=>{if(!(t&&t===x.value)){const{value:a}=ae;a&&(ce.value=a[0],xe.value=a[3],ke.value=[a[1],a[2]])}t=null});const we=$(()=>{const{value:a}=l,{common:{cubicBezierEaseInOut:c},self:{textColor:h,color:p,panelFontSize:g,boxShadow:d,border:k,borderRadius:b,dividerColor:E,[_e("height",a)]:nt,[_e("fontSize",a)]:ot}}=N.value;return{"--n-bezier":c,"--n-text-color":h,"--n-color":p,"--n-panel-font-size":g,"--n-font-size":ot,"--n-box-shadow":d,"--n-border":k,"--n-border-radius":b,"--n-height":nt,"--n-divider-color":E}}),V=oe?Ct("color-picker",$(()=>l.value[0]),we,e):void 0;function rt(){var a;const{value:c}=T,{value:h}=ce,{internalActions:p,modes:g,actions:d}=e,{value:k}=N,{value:b}=f;return i("div",{class:[`${b}-color-picker-panel`,V==null?void 0:V.themeClass.value],onDragstart:E=>{E.preventDefault()},style:oe?void 0:we.value},i("div",{class:`${b}-color-picker-control`},i(Nt,{clsPrefix:b,rgba:c,displayedHue:h,displayedSv:ke.value,onUpdateSV:Xe,onComplete:J}),i("div",{class:`${b}-color-picker-preview`},i("div",{class:`${b}-color-picker-preview__sliders`},i(qt,{clsPrefix:b,hue:h,onUpdateHue:Ze,onComplete:J}),e.showAlpha?i(Bt,{clsPrefix:b,rgba:c,alpha:xe.value,onUpdateAlpha:Ke,onComplete:J}):null),e.showPreview?i(Jt,{clsPrefix:b,mode:A.value,color:T.value&&ie(T.value),onUpdateColor:E=>{v(E,"input")}}):null),i(Zt,{clsPrefix:b,showAlpha:e.showAlpha,mode:A.value,modes:g,onUpdateMode:Le,value:x.value,valueArr:je.value,onUpdateValue:Ge}),((a=e.swatches)===null||a===void 0?void 0:a.length)&&i(Wt,{clsPrefix:b,mode:A.value,swatches:e.swatches,onUpdateColor:E=>{v(E,"input")}})),d!=null&&d.length?i("div",{class:`${b}-color-picker-action`},d.includes("confirm")&&i(de,{size:"small",onClick:Qe,theme:k.peers.Button,themeOverrides:k.peerOverrides.Button},{default:()=>u.value.confirm}),d.includes("clear")&&i(de,{size:"small",onClick:Je,disabled:!x.value,theme:k.peers.Button,themeOverrides:k.peerOverrides.Button},{default:()=>u.value.clear})):null,r.action?i("div",{class:`${b}-color-picker-action`},{default:r.action}):p?i("div",{class:`${b}-color-picker-action`},p.includes("undo")&&i(de,{size:"small",onClick:Ye,disabled:!et.value,theme:k.peers.Button,themeOverrides:k.peerOverrides.Button},{default:()=>u.value.undo}),p.includes("redo")&&i(de,{size:"small",onClick:We,disabled:!tt.value,theme:k.peers.Button,themeOverrides:k.peerOverrides.Button},{default:()=>u.value.redo})):null)}return{mergedClsPrefix:f,namespace:B,selfRef:n,hsla:be,rgba:T,mergedShow:ue,mergedDisabled:s,isMounted:mt(),adjustedTo:Ae(e),mergedValue:x,handleTriggerClick(){K(!0)},handleClickOutside(a){var c;!((c=n.value)===null||c===void 0)&&c.contains(bt(a))||K(!1)},renderPanel:rt,cssVars:oe?void 0:we,themeClass:V==null?void 0:V.themeClass,onRender:V==null?void 0:V.onRender}},render(){const{$slots:e,mergedClsPrefix:r,onRender:n}=this;return n==null||n(),i("div",{class:[this.themeClass,`${r}-color-picker`],ref:"selfRef",style:this.cssVars},i(Ut,null,{default:()=>[i($t,null,{default:()=>i(Kt,{clsPrefix:r,value:this.mergedValue,hsla:this.hsla,disabled:this.mergedDisabled,onClick:this.handleTriggerClick},{label:e.label})}),i(At,{placement:this.placement,show:this.mergedShow,containerClass:this.namespace,teleportDisabled:this.adjustedTo===Ae.tdkey,to:this.adjustedTo},{default:()=>i(ht,{name:"fade-in-scale-up-transition",appear:this.isMounted},{default:()=>this.mergedShow?pt(this.renderPanel(),[[Rt,this.handleClickOutside,void 0,{capture:!0}]]):null})})]}))}}),wr=at({props:{modelValue:{type:Object,required:!0},field:{type:Object,required:!0},path:{type:String,required:!0}},setup(e){const r=gt("Loading",()=>({}));r.value.Drawer=!1;const n=ge(e,"modelValue"),t=e.field,o=e.path;return()=>i(Vt,{label:Se(t.key),path:o,rule:{required:t.required,trigger:"change",message:`${Se(t.key)} ${Se("isRequired")}`},...t.labelProps?t.labelProps instanceof Function?t.labelProps(ye(n.value,o))??{}:t.labelProps:{}},()=>i(tr,{modes:["hex"],value:ye(n.value,o),onUpdateValue:l=>vt(n.value,o,l),...t.inputProps?t.inputProps instanceof Function?t.inputProps(ye(n.value,o))??{}:t.inputProps:{}}))}},"$9QM4zeh4M8");export{wr as default};
