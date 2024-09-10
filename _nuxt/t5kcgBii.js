import{i as d,t as i,av as f,e as n,c as m,b as p,f as o,aa as h,ac as g}from"./CFZop9RU.js";import{i as b}from"./C3M1WvbL.js";const w=d({name:"BaseIconSwitchTransition",setup(a,{slots:t}){const s=b();return()=>i(f,{name:"icon-switch-transition",appear:s.value},t)}}),{cubicBezierEaseInOut:$}=m;function c({originalTransform:a="",left:t=0,top:s=0,transition:r=`all .3s ${$} !important`}={}){return[n("&.icon-switch-transition-enter-from, &.icon-switch-transition-leave-to",{transform:`${a} scale(0.75)`,left:t,top:s,opacity:0}),n("&.icon-switch-transition-enter-to, &.icon-switch-transition-leave-from",{transform:`scale(1) ${a}`,left:t,top:s,opacity:1}),n("&.icon-switch-transition-enter-active, &.icon-switch-transition-leave-active",{transformOrigin:"center",position:"absolute",left:t,top:s,transition:r})]}const v=n([n("@keyframes rotator",`
 0% {
 -webkit-transform: rotate(0deg);
 transform: rotate(0deg);
 }
 100% {
 -webkit-transform: rotate(360deg);
 transform: rotate(360deg);
 }`),p("base-loading",`
 position: relative;
 line-height: 0;
 width: 1em;
 height: 1em;
 `,[o("transition-wrapper",`
 position: absolute;
 width: 100%;
 height: 100%;
 `,[c()]),o("placeholder",`
 position: absolute;
 left: 50%;
 top: 50%;
 transform: translateX(-50%) translateY(-50%);
 `,[c({left:"50%",top:"50%",originalTransform:"translateX(-50%) translateY(-50%)"})]),o("container",`
 animation: rotator 3s linear infinite both;
 `,[o("icon",`
 height: 1em;
 width: 1em;
 `)])])]),l="1.6s",y={strokeWidth:{type:Number,default:28},stroke:{type:String,default:void 0}},N=d({name:"BaseLoading",props:Object.assign({clsPrefix:{type:String,required:!0},show:{type:Boolean,default:!0},scale:{type:Number,default:1},radius:{type:Number,default:100}},y),setup(a){h("-base-loading",v,g(a,"clsPrefix"))},render(){const{clsPrefix:a,radius:t,strokeWidth:s,stroke:r,scale:u}=this,e=t/u;return i("div",{class:`${a}-base-loading`,role:"img","aria-label":"loading"},i(w,null,{default:()=>this.show?i("div",{key:"icon",class:`${a}-base-loading__transition-wrapper`},i("div",{class:`${a}-base-loading__container`},i("svg",{class:`${a}-base-loading__icon`,viewBox:`0 0 ${2*e} ${2*e}`,xmlns:"http://www.w3.org/2000/svg",style:{color:r}},i("g",null,i("animateTransform",{attributeName:"transform",type:"rotate",values:`0 ${e} ${e};270 ${e} ${e}`,begin:"0s",dur:l,fill:"freeze",repeatCount:"indefinite"}),i("circle",{class:`${a}-base-loading__icon`,fill:"none",stroke:"currentColor","stroke-width":s,"stroke-linecap":"round",cx:e,cy:e,r:t-s/2,"stroke-dasharray":5.67*t,"stroke-dashoffset":18.48*t},i("animateTransform",{attributeName:"transform",type:"rotate",values:`0 ${e} ${e};135 ${e} ${e};450 ${e} ${e}`,begin:"0s",dur:l,fill:"freeze",repeatCount:"indefinite"}),i("animate",{attributeName:"stroke-dashoffset",values:`${5.67*t};${1.42*t};${5.67*t}`,begin:"0s",dur:l,fill:"freeze",repeatCount:"indefinite"})))))):i("div",{key:"placeholder",class:`${a}-base-loading__placeholder`},this.$slots)}))}});export{w as N,N as a,c as i};
