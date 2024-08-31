import{d as at}from"./s1nzGIlB.js";import{dW as q,dB as P,dX as H,dY as j,dZ as M,d_ as te,d$ as X,f as D,r as w,B as i,D as $,c8 as lt,aA as He,bK as Be,e0 as ie,e1 as Ce,e2 as Ue,e3 as $e,b_ as it,bW as J,bX as m,c6 as U,c4 as _e,bY as st,bZ as Ne,e4 as ut,b0 as ct,bq as ve,E as dt,ce as Ie,Y as ht,bO as pt,aN as ft,g as vt,di as ye,dL as gt,q as Se}from"./b4y72k5A.js";import{o as re,a as ne,i as mt,e as bt}from"./CdkfcTkH.js";import{N as xt}from"./RzOtjQ9K.js";import{N as kt}from"./8FQazlgB.js";import{f as wt}from"./DKG9CMtQ.js";import{u as yt,B as de}from"./xQnQeLtE.js";import{u as St}from"./DqSEKOi2.js";import{u as Fe,i as Ct}from"./DMzQWz3x.js";import{u as Ut,c as he}from"./C1zJybjf.js";import{u as Re,B as $t,V as Rt,a as At}from"./Cmd_S7K8.js";import{N as Vt}from"./DtWCN3R5.js";import"./e_cKu00I.js";import"./Czb91-J3.js";import"./CZXsOwoh.js";import"./CIoqIYrI.js";import"./CJ79uegm.js";import"./HiGXOwLp.js";import"./DxqoMeCY.js";import"./SA_xyCNi.js";function Te(e,r,n){r/=100,n/=100;const t=r*Math.min(n,1-n)+n;return[e,t?(2-2*n/t)*100:0,t*100]}function ge(e,r,n){r/=100,n/=100;const t=n-n*r/2,o=Math.min(t,1-t);return[e,o?(n-t)/o*100:0,t*100]}function F(e,r,n){r/=100,n/=100;let t=(o,l=(o+e/60)%6)=>n-n*r*Math.max(Math.min(l,4-l,1),0);return[t(5)*255,t(3)*255,t(1)*255]}function Ae(e,r,n){e/=255,r/=255,n/=255;let t=Math.max(e,r,n),o=t-Math.min(e,r,n),l=o&&(t==e?(r-n)/o:t==r?2+(n-e)/o:4+(e-r)/o);return[60*(l<0?l+6:l),t&&o/t*100,t*100]}function Ve(e,r,n){e/=255,r/=255,n/=255;let t=Math.max(e,r,n),o=t-Math.min(e,r,n),l=1-Math.abs(t+t-o-1),s=o&&(t==e?(r-n)/o:t==r?2+(n-e)/o:4+(e-r)/o);return[60*(s<0?s+6:s),l?o/l*100:0,(t+t-o)*50]}function Pe(e,r,n){r/=100,n/=100;let t=r*Math.min(n,1-n),o=(l,s=(l+e/30)%12)=>n-t*Math.max(Math.min(s-3,9-s,1),-1);return[o(0)*255,o(8)*255,o(4)*255]}function Pt(e,r){switch(e[0]){case"hex":return r?"#000000FF":"#000000";case"rgb":return r?"rgba(0, 0, 0, 1)":"rgb(0, 0, 0)";case"hsl":return r?"hsla(0, 0%, 0%, 1)":"hsl(0, 0%, 0%)";case"hsv":return r?"hsva(0, 0%, 0%, 1)":"hsv(0, 0%, 0%)"}return"#000000"}function se(e){return e===null?null:/^ *#/.test(e)?"hex":e.includes("rgb")?"rgb":e.includes("hsl")?"hsl":e.includes("hsv")?"hsv":null}function Mt(e){return e=Math.round(e),e>=360?359:e<0?0:e}function Dt(e){return e=Math.round(e*100)/100,e>1?1:e<0?0:e}const zt={rgb:{hex(e){return q(P(e))},hsl(e){const[r,n,t,o]=P(e);return H([...Ve(r,n,t),o])},hsv(e){const[r,n,t,o]=P(e);return j([...Ae(r,n,t),o])}},hex:{rgb(e){return M(P(e))},hsl(e){const[r,n,t,o]=P(e);return H([...Ve(r,n,t),o])},hsv(e){const[r,n,t,o]=P(e);return j([...Ae(r,n,t),o])}},hsl:{hex(e){const[r,n,t,o]=te(e);return q([...Pe(r,n,t),o])},rgb(e){const[r,n,t,o]=te(e);return M([...Pe(r,n,t),o])},hsv(e){const[r,n,t,o]=te(e);return j([...Te(r,n,t),o])}},hsv:{hex(e){const[r,n,t,o]=X(e);return q([...F(r,n,t),o])},rgb(e){const[r,n,t,o]=X(e);return M([...F(r,n,t),o])},hsl(e){const[r,n,t,o]=X(e);return H([...ge(r,n,t),o])}}};function Ee(e,r,n){return n=n||se(e),n?n===r?e:zt[n][r](e):null}const ee="12px",_t=12,O="6px",It=6,Ft="linear-gradient(90deg,red,#ff0 16.66%,#0f0 33.33%,#0ff 50%,#00f 66.66%,#f0f 83.33%,red)",qt=D({name:"HueSlider",props:{clsPrefix:{type:String,required:!0},hue:{type:Number,required:!0},onUpdateHue:{type:Function,required:!0},onComplete:Function},setup(e){const r=w(null);function n(l){r.value&&(re("mousemove",document,t),re("mouseup",document,o),t(l))}function t(l){const{value:s}=r;if(!s)return;const{width:u,left:f}=s.getBoundingClientRect(),B=Mt((l.clientX-f-It)/(u-_t)*360);e.onUpdateHue(B)}function o(){var l;ne("mousemove",document,t),ne("mouseup",document,o),(l=e.onComplete)===null||l===void 0||l.call(e)}return{railRef:r,handleMouseDown:n}},render(){const{clsPrefix:e}=this;return i("div",{class:`${e}-color-picker-slider`,style:{height:ee,borderRadius:O}},i("div",{ref:"railRef",style:{boxShadow:"inset 0 0 2px 0 rgba(0, 0, 0, .24)",boxSizing:"border-box",backgroundImage:Ft,height:ee,borderRadius:O,position:"relative"},onMousedown:this.handleMouseDown},i("div",{style:{position:"absolute",left:O,right:O,top:0,bottom:0}},i("div",{class:`${e}-color-picker-handle`,style:{left:`calc((${this.hue}%) / 359 * 100 - ${O})`,borderRadius:O,width:ee,height:ee}},i("div",{class:`${e}-color-picker-handle__fill`,style:{backgroundColor:`hsl(${this.hue}, 100%, 50%)`,borderRadius:O,width:ee,height:ee}})))))}}),le="12px",Ht=12,L="6px",Bt=D({name:"AlphaSlider",props:{clsPrefix:{type:String,required:!0},rgba:{type:Array,default:null},alpha:{type:Number,default:0},onUpdateAlpha:{type:Function,required:!0},onComplete:Function},setup(e){const r=w(null);function n(l){!r.value||!e.rgba||(re("mousemove",document,t),re("mouseup",document,o),t(l))}function t(l){const{value:s}=r;if(!s)return;const{width:u,left:f}=s.getBoundingClientRect(),B=(l.clientX-f)/(u-Ht);e.onUpdateAlpha(Dt(B))}function o(){var l;ne("mousemove",document,t),ne("mouseup",document,o),(l=e.onComplete)===null||l===void 0||l.call(e)}return{railRef:r,railBackgroundImage:$(()=>{const{rgba:l}=e;return l?`linear-gradient(to right, rgba(${l[0]}, ${l[1]}, ${l[2]}, 0) 0%, rgba(${l[0]}, ${l[1]}, ${l[2]}, 1) 100%)`:""}),handleMouseDown:n}},render(){const{clsPrefix:e}=this;return i("div",{class:`${e}-color-picker-slider`,ref:"railRef",style:{height:le,borderRadius:L},onMousedown:this.handleMouseDown},i("div",{style:{borderRadius:L,position:"absolute",left:0,right:0,top:0,bottom:0,overflow:"hidden"}},i("div",{class:`${e}-color-picker-checkboard`}),i("div",{class:`${e}-color-picker-slider__image`,style:{backgroundImage:this.railBackgroundImage}})),this.rgba&&i("div",{style:{position:"absolute",left:L,right:L,top:0,bottom:0}},i("div",{class:`${e}-color-picker-handle`,style:{left:`calc(${this.alpha*100}% - ${L})`,borderRadius:L,width:le,height:le}},i("div",{class:`${e}-color-picker-handle__fill`,style:{backgroundColor:M(this.rgba),borderRadius:L,width:le,height:le}}))))}}),pe="12px",fe="6px",Nt=D({name:"Pallete",props:{clsPrefix:{type:String,required:!0},rgba:{type:Array,default:null},displayedHue:{type:Number,required:!0},displayedSv:{type:Array,required:!0},onUpdateSV:{type:Function,required:!0},onComplete:Function},setup(e){const r=w(null);function n(l){r.value&&(re("mousemove",document,t),re("mouseup",document,o),t(l))}function t(l){const{value:s}=r;if(!s)return;const{width:u,height:f,left:B,bottom:oe}=s.getBoundingClientRect(),N=(oe-l.clientY)/f,Z=(l.clientX-B)/u,ue=100*(Z>1?1:Z<0?0:Z),K=100*(N>1?1:N<0?0:N);e.onUpdateSV(ue,K)}function o(){var l;ne("mousemove",document,t),ne("mouseup",document,o),(l=e.onComplete)===null||l===void 0||l.call(e)}return{palleteRef:r,handleColor:$(()=>{const{rgba:l}=e;return l?`rgb(${l[0]}, ${l[1]}, ${l[2]})`:""}),handleMouseDown:n}},render(){const{clsPrefix:e}=this;return i("div",{class:`${e}-color-picker-pallete`,onMousedown:this.handleMouseDown,ref:"palleteRef"},i("div",{class:`${e}-color-picker-pallete__layer`,style:{backgroundImage:`linear-gradient(90deg, white, hsl(${this.displayedHue}, 100%, 50%))`}}),i("div",{class:`${e}-color-picker-pallete__layer ${e}-color-picker-pallete__layer--shadowed`,style:{backgroundImage:"linear-gradient(180deg, rgba(0, 0, 0, 0%), rgba(0, 0, 0, 100%))"}}),this.rgba&&i("div",{class:`${e}-color-picker-handle`,style:{width:pe,height:pe,borderRadius:fe,left:`calc(${this.displayedSv[0]}% - ${fe})`,bottom:`calc(${this.displayedSv[1]}% - ${fe})`}},i("div",{class:`${e}-color-picker-handle__fill`,style:{backgroundColor:this.handleColor,borderRadius:fe,width:pe,height:pe}})))}}),Me=lt("n-color-picker");function Tt(e){return/^\d{1,3}\.?\d*$/.test(e.trim())?Math.max(0,Math.min(Number.parseInt(e),255)):!1}function Et(e){return/^\d{1,3}\.?\d*$/.test(e.trim())?Math.max(0,Math.min(Number.parseInt(e),360)):!1}function Ot(e){return/^\d{1,3}\.?\d*$/.test(e.trim())?Math.max(0,Math.min(Number.parseInt(e),100)):!1}function Lt(e){const r=e.trim();return/^#[0-9a-fA-F]+$/.test(r)?[4,5,7,9].includes(r.length):!1}function jt(e){return/^\d{1,3}\.?\d*%$/.test(e.trim())?Math.max(0,Math.min(Number.parseInt(e)/100,100)):!1}const Xt={paddingSmall:"0 4px"},qe=D({name:"ColorInputUnit",props:{label:{type:String,required:!0},value:{type:[Number,String],default:null},showAlpha:Boolean,onUpdateValue:{type:Function,required:!0}},setup(e){const r=w(""),{themeRef:n}=He(Me,null);Be(()=>{r.value=t()});function t(){const{value:s}=e;if(s===null)return"";const{label:u}=e;return u==="HEX"?s:u==="A"?`${Math.floor(s*100)}%`:String(Math.floor(s))}function o(s){r.value=s}function l(s){let u,f;switch(e.label){case"HEX":f=Lt(s),f&&e.onUpdateValue(s),r.value=t();break;case"H":u=Et(s),u===!1?r.value=t():e.onUpdateValue(u);break;case"S":case"L":case"V":u=Ot(s),u===!1?r.value=t():e.onUpdateValue(u);break;case"A":u=jt(s),u===!1?r.value=t():e.onUpdateValue(u);break;case"R":case"G":case"B":u=Tt(s),u===!1?r.value=t():e.onUpdateValue(u);break}}return{mergedTheme:n,inputValue:r,handleInputChange:l,handleInputUpdateValue:o}},render(){const{mergedTheme:e}=this;return i(xt,{size:"small",placeholder:this.label,theme:e.peers.Input,themeOverrides:e.peerOverrides.Input,builtinThemeOverrides:Xt,value:this.inputValue,onUpdateValue:this.handleInputUpdateValue,onChange:this.handleInputChange,style:this.label==="A"?"flex-grow: 1.25;":""})}}),Zt=D({name:"ColorInput",props:{clsPrefix:{type:String,required:!0},mode:{type:String,required:!0},modes:{type:Array,required:!0},showAlpha:{type:Boolean,required:!0},value:{type:String,default:null},valueArr:{type:Array,default:null},onUpdateValue:{type:Function,required:!0},onUpdateMode:{type:Function,required:!0}},setup(e){return{handleUnitUpdateValue(r,n){const{showAlpha:t}=e;if(e.mode==="hex"){e.onUpdateValue((t?q:ie)(n));return}let o;switch(e.valueArr===null?o=[0,0,0,0]:o=Array.from(e.valueArr),e.mode){case"hsv":o[r]=n,e.onUpdateValue((t?j:$e)(o));break;case"rgb":o[r]=n,e.onUpdateValue((t?M:Ue)(o));break;case"hsl":o[r]=n,e.onUpdateValue((t?H:Ce)(o));break}}}},render(){const{clsPrefix:e,modes:r}=this;return i("div",{class:`${e}-color-picker-input`},i("div",{class:`${e}-color-picker-input__mode`,onClick:this.onUpdateMode,style:{cursor:r.length===1?"":"pointer"}},this.mode.toUpperCase()+(this.showAlpha?"A":"")),i(kt,null,{default:()=>{const{mode:n,valueArr:t,showAlpha:o}=this;if(n==="hex"){let l=null;try{l=t===null?null:(o?q:ie)(t)}catch{}return i(qe,{label:"HEX",showAlpha:o,value:l,onUpdateValue:s=>{this.handleUnitUpdateValue(0,s)}})}return(n+(o?"a":"")).split("").map((l,s)=>i(qe,{label:l.toUpperCase(),value:t===null?null:t[s],onUpdateValue:u=>{this.handleUnitUpdateValue(s,u)}}))}}))}}),Kt=D({name:"ColorPickerTrigger",props:{clsPrefix:{type:String,required:!0},value:{type:String,default:null},hsla:{type:Array,default:null},disabled:Boolean,onClick:Function},setup(e){const{colorPickerSlots:r,renderLabelRef:n}=He(Me,null);return()=>{const{hsla:t,value:o,clsPrefix:l,onClick:s,disabled:u}=e,f=r.label||n.value;return i("div",{class:[`${l}-color-picker-trigger`,u&&`${l}-color-picker-trigger--disabled`],onClick:u?void 0:s},i("div",{class:`${l}-color-picker-trigger__fill`},i("div",{class:`${l}-color-picker-checkboard`}),i("div",{style:{position:"absolute",left:0,right:0,top:0,bottom:0,backgroundColor:t?H(t):""}}),o&&t?i("div",{class:`${l}-color-picker-trigger__value`,style:{color:t[2]>50||t[3]<.5?"black":"white"}},f?f(o):o):null))}}});function Yt(e,r){if(r==="hsv"){const[n,t,o,l]=X(e);return M([...F(n,t,o),l])}return e}function Gt(e){const r=document.createElement("canvas").getContext("2d");return r?(r.fillStyle=e,r.fillStyle):"#000000"}const Wt=D({name:"ColorPickerSwatches",props:{clsPrefix:{type:String,required:!0},mode:{type:String,required:!0},swatches:{type:Array,required:!0},onUpdateColor:{type:Function,required:!0}},setup(e){const r=$(()=>e.swatches.map(l=>{const s=se(l);return{value:l,mode:s,legalValue:Yt(l,s)}}));function n(l){const{mode:s}=e;let{value:u,mode:f}=l;return f||(f="hex",/^[a-zA-Z]+$/.test(u)?u=Gt(u):(it("color-picker",`color ${u} in swatches is invalid.`),u="#000000")),f===s?u:Ee(u,s,f)}function t(l){e.onUpdateColor(n(l))}function o(l,s){l.key==="Enter"&&t(s)}return{parsedSwatchesRef:r,handleSwatchSelect:t,handleSwatchKeyDown:o}},render(){const{clsPrefix:e}=this;return i("div",{class:`${e}-color-picker-swatches`},this.parsedSwatchesRef.map(r=>i("div",{class:`${e}-color-picker-swatch`,tabindex:0,onClick:()=>{this.handleSwatchSelect(r)},onKeydown:n=>{this.handleSwatchKeyDown(n,r)}},i("div",{class:`${e}-color-picker-swatch__fill`,style:{background:r.legalValue}}))))}}),Qt=D({name:"ColorPreview",props:{clsPrefix:{type:String,required:!0},mode:{type:String,required:!0},color:{type:String,default:null,validator:e=>{const r=se(e);return!!(!e||r&&r!=="hsv")}},onUpdateColor:{type:Function,required:!0}},setup(e){function r(n){var t;const o=n.target.value;(t=e.onUpdateColor)===null||t===void 0||t.call(e,Ee(o.toUpperCase(),e.mode,"hex")),n.stopPropagation()}return{handleChange:r}},render(){const{clsPrefix:e}=this;return i("div",{class:`${e}-color-picker-preview__preview`},i("span",{class:`${e}-color-picker-preview__fill`,style:{background:this.color||"#000000"}}),i("input",{class:`${e}-color-picker-preview__input`,type:"color",value:this.color,onChange:this.handleChange}))}}),Jt=J([m("color-picker",`
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
 `,[J("&::after",`
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
 `),J("&::after",`
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
 `,[_e("shadowed",`
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
 `),_e("disabled","cursor: not-allowed"),m("color-picker-checkboard",`
 border-radius: var(--n-border-radius);
 `,[J("&::after",`
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
 `),J("&:focus",`
 outline: none;
 `,[U("fill",[J("&::after",`
 position: absolute;
 top: 0;
 right: 0;
 bottom: 0;
 left: 0;
 background: inherit;
 filter: blur(2px);
 content: "";
 `)])])])])]),er=Object.assign(Object.assign({},Ne.props),{value:String,show:{type:Boolean,default:void 0},defaultShow:Boolean,defaultValue:String,modes:{type:Array,default:()=>["rgb","hex","hsl"]},placement:{type:String,default:"bottom-start"},to:Re.propTo,showAlpha:{type:Boolean,default:!0},showPreview:Boolean,swatches:Array,disabled:{type:Boolean,default:void 0},actions:{type:Array,default:null},internalActions:Array,size:String,renderLabel:Function,onComplete:Function,onConfirm:Function,onClear:Function,"onUpdate:show":[Function,Array],onUpdateShow:[Function,Array],"onUpdate:value":[Function,Array],onUpdateValue:[Function,Array]}),tr=D({name:"ColorPicker",props:er,setup(e,{slots:r}){const n=w(null);let t=null;const o=yt(e),{mergedSizeRef:l,mergedDisabledRef:s}=o,{localeRef:u}=St("global"),{mergedClsPrefixRef:f,namespaceRef:B,inlineThemeDisabled:oe}=st(e),N=Ne("ColorPicker","-color-picker",Jt,ut,e,f);ct(Me,{themeRef:N,renderLabelRef:ve(e,"renderLabel"),colorPickerSlots:r});const Z=w(e.defaultShow),ue=Fe(ve(e,"show"),Z);function K(a){const{onUpdateShow:c,"onUpdate:show":h}=e;c&&he(c,a),h&&he(h,a),Z.value=a}const{defaultValue:De}=e,ze=w(De===void 0?Pt(e.modes,e.showAlpha):De),x=Fe(ve(e,"value"),ze),Y=w([x.value]),A=w(0),me=$(()=>se(x.value)),{modes:Oe}=e,R=w(se(x.value)||Oe[0]||"rgb");function Le(){const{modes:a}=e,{value:c}=R,h=a.findIndex(p=>p===c);~h?R.value=a[(h+1)%a.length]:R.value="rgb"}let y,S,G,W,z,_,I,C;const ae=$(()=>{const{value:a}=x;if(!a)return null;switch(me.value){case"hsv":return X(a);case"hsl":return[y,S,G,C]=te(a),[...Te(y,S,G),C];case"rgb":case"hex":return[z,_,I,C]=P(a),[...Ae(z,_,I),C]}}),T=$(()=>{const{value:a}=x;if(!a)return null;switch(me.value){case"rgb":case"hex":return P(a);case"hsv":return[y,S,W,C]=X(a),[...F(y,S,W),C];case"hsl":return[y,S,G,C]=te(a),[...Pe(y,S,G),C]}}),be=$(()=>{const{value:a}=x;if(!a)return null;switch(me.value){case"hsl":return te(a);case"hsv":return[y,S,W,C]=X(a),[...ge(y,S,W),C];case"rgb":case"hex":return[z,_,I,C]=P(a),[...Ve(z,_,I),C]}}),je=$(()=>{switch(R.value){case"rgb":case"hex":return T.value;case"hsv":return ae.value;case"hsl":return be.value}}),ce=w(0),xe=w(1),ke=w([0,0]);function Xe(a,c){const{value:h}=ae,p=ce.value,v=h?h[3]:1;ke.value=[a,c];const{showAlpha:d}=e;switch(R.value){case"hsv":g((d?j:$e)([p,a,c,v]),"cursor");break;case"hsl":g((d?H:Ce)([...ge(p,a,c),v]),"cursor");break;case"rgb":g((d?M:Ue)([...F(p,a,c),v]),"cursor");break;case"hex":g((d?q:ie)([...F(p,a,c),v]),"cursor");break}}function Ze(a){ce.value=a;const{value:c}=ae;if(!c)return;const[,h,p,v]=c,{showAlpha:d}=e;switch(R.value){case"hsv":g((d?j:$e)([a,h,p,v]),"cursor");break;case"rgb":g((d?M:Ue)([...F(a,h,p),v]),"cursor");break;case"hex":g((d?q:ie)([...F(a,h,p),v]),"cursor");break;case"hsl":g((d?H:Ce)([...ge(a,h,p),v]),"cursor");break}}function Ke(a){switch(R.value){case"hsv":[y,S,W]=ae.value,g(j([y,S,W,a]),"cursor");break;case"rgb":[z,_,I]=T.value,g(M([z,_,I,a]),"cursor");break;case"hex":[z,_,I]=T.value,g(q([z,_,I,a]),"cursor");break;case"hsl":[y,S,G]=be.value,g(H([y,S,G,a]),"cursor");break}xe.value=a}function g(a,c){c==="cursor"?t=a:t=null;const{nTriggerFormChange:h,nTriggerFormInput:p}=o,{onUpdateValue:v,"onUpdate:value":d}=e;v&&he(v,a),d&&he(d,a),h(),p(),ze.value=a}function Ye(a){g(a,"input"),ft(Q)}function Q(a=!0){const{value:c}=x;if(c){const{nTriggerFormChange:h,nTriggerFormInput:p}=o,{onComplete:v}=e;v&&v(c);const{value:d}=Y,{value:k}=A;a&&(d.splice(k+1,d.length,c),A.value=k+1),h(),p()}}function Ge(){const{value:a}=A;a-1<0||(g(Y.value[a-1],"input"),Q(!1),A.value=a-1)}function We(){const{value:a}=A;a<0||a+1>=Y.value.length||(g(Y.value[a+1],"input"),Q(!1),A.value=a+1)}function Qe(){g(null,"input");const{onClear:a}=e;a&&a(),K(!1)}function Je(){const{value:a}=x,{onConfirm:c}=e;c&&c(a),K(!1)}const et=$(()=>A.value>=1),tt=$(()=>{const{value:a}=Y;return a.length>1&&A.value<a.length-1});dt(ue,a=>{a||(Y.value=[x.value],A.value=0)}),Be(()=>{if(!(t&&t===x.value)){const{value:a}=ae;a&&(ce.value=a[0],xe.value=a[3],ke.value=[a[1],a[2]])}t=null});const we=$(()=>{const{value:a}=l,{common:{cubicBezierEaseInOut:c},self:{textColor:h,color:p,panelFontSize:v,boxShadow:d,border:k,borderRadius:b,dividerColor:E,[Ie("height",a)]:nt,[Ie("fontSize",a)]:ot}}=N.value;return{"--n-bezier":c,"--n-text-color":h,"--n-color":p,"--n-panel-font-size":v,"--n-font-size":ot,"--n-box-shadow":d,"--n-border":k,"--n-border-radius":b,"--n-height":nt,"--n-divider-color":E}}),V=oe?Ut("color-picker",$(()=>l.value[0]),we,e):void 0;function rt(){var a;const{value:c}=T,{value:h}=ce,{internalActions:p,modes:v,actions:d}=e,{value:k}=N,{value:b}=f;return i("div",{class:[`${b}-color-picker-panel`,V==null?void 0:V.themeClass.value],onDragstart:E=>{E.preventDefault()},style:oe?void 0:we.value},i("div",{class:`${b}-color-picker-control`},i(Nt,{clsPrefix:b,rgba:c,displayedHue:h,displayedSv:ke.value,onUpdateSV:Xe,onComplete:Q}),i("div",{class:`${b}-color-picker-preview`},i("div",{class:`${b}-color-picker-preview__sliders`},i(qt,{clsPrefix:b,hue:h,onUpdateHue:Ze,onComplete:Q}),e.showAlpha?i(Bt,{clsPrefix:b,rgba:c,alpha:xe.value,onUpdateAlpha:Ke,onComplete:Q}):null),e.showPreview?i(Qt,{clsPrefix:b,mode:R.value,color:T.value&&ie(T.value),onUpdateColor:E=>{g(E,"input")}}):null),i(Zt,{clsPrefix:b,showAlpha:e.showAlpha,mode:R.value,modes:v,onUpdateMode:Le,value:x.value,valueArr:je.value,onUpdateValue:Ye}),((a=e.swatches)===null||a===void 0?void 0:a.length)&&i(Wt,{clsPrefix:b,mode:R.value,swatches:e.swatches,onUpdateColor:E=>{g(E,"input")}})),d!=null&&d.length?i("div",{class:`${b}-color-picker-action`},d.includes("confirm")&&i(de,{size:"small",onClick:Je,theme:k.peers.Button,themeOverrides:k.peerOverrides.Button},{default:()=>u.value.confirm}),d.includes("clear")&&i(de,{size:"small",onClick:Qe,disabled:!x.value,theme:k.peers.Button,themeOverrides:k.peerOverrides.Button},{default:()=>u.value.clear})):null,r.action?i("div",{class:`${b}-color-picker-action`},{default:r.action}):p?i("div",{class:`${b}-color-picker-action`},p.includes("undo")&&i(de,{size:"small",onClick:Ge,disabled:!et.value,theme:k.peers.Button,themeOverrides:k.peerOverrides.Button},{default:()=>u.value.undo}),p.includes("redo")&&i(de,{size:"small",onClick:We,disabled:!tt.value,theme:k.peers.Button,themeOverrides:k.peerOverrides.Button},{default:()=>u.value.redo})):null)}return{mergedClsPrefix:f,namespace:B,selfRef:n,hsla:be,rgba:T,mergedShow:ue,mergedDisabled:s,isMounted:Ct(),adjustedTo:Re(e),mergedValue:x,handleTriggerClick(){K(!0)},handleClickOutside(a){var c;!((c=n.value)===null||c===void 0)&&c.contains(mt(a))||K(!1)},renderPanel:rt,cssVars:oe?void 0:we,themeClass:V==null?void 0:V.themeClass,onRender:V==null?void 0:V.onRender}},render(){const{$slots:e,mergedClsPrefix:r,onRender:n}=this;return n==null||n(),i("div",{class:[this.themeClass,`${r}-color-picker`],ref:"selfRef",style:this.cssVars},i($t,null,{default:()=>[i(Rt,null,{default:()=>i(Kt,{clsPrefix:r,value:this.mergedValue,hsla:this.hsla,disabled:this.mergedDisabled,onClick:this.handleTriggerClick},{label:e.label})}),i(At,{placement:this.placement,show:this.mergedShow,containerClass:this.namespace,teleportDisabled:this.adjustedTo===Re.tdkey,to:this.adjustedTo},{default:()=>i(ht,{name:"fade-in-scale-up-transition",appear:this.isMounted},{default:()=>this.mergedShow?pt(this.renderPanel(),[[bt,this.handleClickOutside,void 0,{capture:!0}]]):null})})]}))}}),yr=at({props:{modelValue:{type:Object,required:!0},field:{type:Object,required:!0},path:{type:String,required:!0}},setup(e){const r=vt("Loading",()=>({}));r.value.Drawer=!1;const n=ve(e,"modelValue"),t=e.field,o=e.path;return()=>i(Vt,{label:Se(t.key),path:o,rule:{required:t.required,trigger:"change",message:`${Se(t.key)} ${Se("isRequired")}`},...t.labelProps?t.labelProps instanceof Function?t.labelProps(ye(n.value,o))??{}:t.labelProps:{}},()=>i(tr,{modes:["hex"],value:ye(n.value,o),onUpdateValue:l=>gt(n.value,o,l),...t.inputProps?t.inputProps instanceof Function?t.inputProps(ye(n.value,o))??{}:t.inputProps:{}}))}},"$9QM4zeh4M8");export{yr as default};
