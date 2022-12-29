import{u as L}from"./composables.618862be.js";import{u as V,N as k,t as w}from"./useLanguage.d2d2312d.js";import{a9 as B,av as b,f as s,a as C,k as _,b as u,i as S,l as E,h as n,d7 as X,p as z,m as x,q as c,v as D,x as Z,y as K,z as q,d1 as G,e as Y,d2 as J}from"./entry.328b861b.js";import{e as f,d as P,c as I,N as Q}from"./Space.59a4ec5d.js";import{f as j}from"./format-length.ad42f3fa.js";import{u as N}from"./use-houdini.a45afe2f.js";import"./index.ad61f358.js";const ee=e=>{const{primaryColor:t,successColor:o,warningColor:r,errorColor:i,infoColor:a,fontWeightStrong:d}=e;return{fontWeight:d,rotate:"252deg",colorStartPrimary:b(t,{alpha:.6}),colorEndPrimary:t,colorStartInfo:b(a,{alpha:.6}),colorEndInfo:a,colorStartWarning:b(r,{alpha:.6}),colorEndWarning:r,colorStartError:b(i,{alpha:.6}),colorEndError:i,colorStartSuccess:b(o,{alpha:.6}),colorEndSuccess:o}},te={name:"GradientText",common:B,self:ee},ie=te,ne=s("gradient-text",`
 display: inline-block;
 font-weight: var(--n-font-weight);
 -webkit-background-clip: text;
 background-clip: text;
 color: #0000;
 white-space: nowrap;
 background-image: linear-gradient(var(--n-rotate), var(--n-color-start) 0%, var(--n-color-end) 100%);
 transition:
 --n-color-start .3s var(--n-bezier),
 --n-color-end .3s var(--n-bezier);
`),oe=Object.assign(Object.assign({},S.props),{size:[String,Number],fontSize:[String,Number],type:{type:String,default:"primary"},color:[Object,String],gradient:[Object,String]}),re=C({name:"GradientText",props:oe,setup(e){N();const{mergedClsPrefixRef:t,inlineThemeDisabled:o}=_(e),r=u(()=>{const{type:l}=e;return l==="danger"?"error":l}),i=u(()=>{let l=e.size||e.fontSize;return l&&(l=j(l)),l||void 0}),a=u(()=>{const l=e.color||e.gradient;if(typeof l=="string")return l;if(l){const p=l.deg||0,h=l.from,v=l.to;return`linear-gradient(${p}deg, ${h} 0%, ${v} 100%)`}}),d=S("GradientText","-gradient-text",ne,ie,e,t),g=u(()=>{const{value:l}=r,{common:{cubicBezierEaseInOut:p},self:{rotate:h,[f("colorStart",l)]:v,[f("colorEnd",l)]:$,fontWeight:T}}=d.value;return{"--n-bezier":p,"--n-rotate":h,"--n-color-start":v,"--n-color-end":$,"--n-font-weight":T}}),m=o?E("gradient-text",u(()=>r.value[0]),g,e):void 0;return{mergedClsPrefix:t,compatibleType:r,styleFontSize:i,styleBgImage:a,cssVars:o?void 0:g,themeClass:m==null?void 0:m.themeClass,onRender:m==null?void 0:m.onRender}},render(){const{mergedClsPrefix:e,onRender:t}=this;return t==null||t(),n("span",{class:[`${e}-gradient-text`,`${e}-gradient-text--${this.compatibleType}-type`,this.themeClass],style:[{fontSize:this.styleFontSize,backgroundImage:this.styleBgImage},this.cssVars]},this.$slots)}}),le=e=>{const{textColor3:t,infoColor:o,errorColor:r,successColor:i,warningColor:a,textColor1:d,textColor2:g,railColor:m,fontWeightStrong:l,fontSize:p}=e;return Object.assign(Object.assign({},X),{contentFontSize:p,titleFontWeight:l,circleBorder:`2px solid ${t}`,circleBorderInfo:`2px solid ${o}`,circleBorderError:`2px solid ${r}`,circleBorderSuccess:`2px solid ${i}`,circleBorderWarning:`2px solid ${a}`,iconColor:t,iconColorInfo:o,iconColorError:r,iconColorSuccess:i,iconColorWarning:a,titleTextColor:d,contentTextColor:g,metaTextColor:t,lineColor:m})},se={name:"Timeline",common:B,self:le},ae=se,R=1.25,ce=s("timeline",`
 position: relative;
 width: 100%;
 display: flex;
 flex-direction: column;
 line-height: ${R};
`,[z("horizontal",`
 flex-direction: row;
 `,[x(">",[s("timeline-item",`
 flex-shrink: 0;
 padding-right: 40px;
 `,[z("dashed-line-type",[x(">",[s("timeline-item-timeline",[c("line",`
 background-image: linear-gradient(90deg, var(--n-color-start), var(--n-color-start) 50%, transparent 50%, transparent 100%);
 background-size: 10px 1px;
 `)])])]),x(">",[s("timeline-item-content",`
 margin-top: calc(var(--n-icon-size) + 12px);
 `,[x(">",[c("meta",`
 margin-top: 6px;
 margin-bottom: unset;
 `)])]),s("timeline-item-timeline",`
 width: 100%;
 height: calc(var(--n-icon-size) + 12px);
 `,[c("line",`
 left: var(--n-icon-size);
 top: calc(var(--n-icon-size) / 2 - 1px);
 right: 0px;
 width: unset;
 height: 2px;
 `)])])])])]),z("right-placement",[s("timeline-item",[s("timeline-item-content",`
 text-align: right;
 margin-right: calc(var(--n-icon-size) + 12px);
 `),s("timeline-item-timeline",`
 width: var(--n-icon-size);
 right: 0;
 `)])]),z("left-placement",[s("timeline-item",[s("timeline-item-content",`
 margin-left: calc(var(--n-icon-size) + 12px);
 `),s("timeline-item-timeline",`
 left: 0;
 `)])]),s("timeline-item",`
 position: relative;
 `,[x("&:last-child",[s("timeline-item-timeline",[c("line",`
 display: none;
 `)]),s("timeline-item-content",[c("meta",`
 margin-bottom: 0;
 `)])]),s("timeline-item-content",[c("title",`
 margin: var(--n-title-margin);
 font-size: var(--n-title-font-size);
 transition: color .3s var(--n-bezier);
 font-weight: var(--n-title-font-weight);
 color: var(--n-title-text-color);
 `),c("content",`
 transition: color .3s var(--n-bezier);
 font-size: var(--n-content-font-size);
 color: var(--n-content-text-color);
 `),c("meta",`
 transition: color .3s var(--n-bezier);
 font-size: 12px;
 margin-top: 6px;
 margin-bottom: 20px;
 color: var(--n-meta-text-color);
 `)]),z("dashed-line-type",[s("timeline-item-timeline",[c("line",`
 --n-color-start: var(--n-line-color);
 transition: --n-color-start .3s var(--n-bezier);
 background-color: transparent;
 background-image: linear-gradient(180deg, var(--n-color-start), var(--n-color-start) 50%, transparent 50%, transparent 100%);
 background-size: 1px 10px;
 `)])]),s("timeline-item-timeline",`
 width: calc(var(--n-icon-size) + 12px);
 position: absolute;
 top: calc(var(--n-title-font-size) * ${R} / 2 - var(--n-icon-size) / 2);
 height: 100%;
 `,[c("circle",`
 border: var(--n-circle-border);
 transition:
 background-color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 width: var(--n-icon-size);
 height: var(--n-icon-size);
 border-radius: var(--n-icon-size);
 box-sizing: border-box;
 `),c("icon",`
 color: var(--n-icon-color);
 font-size: var(--n-icon-size);
 height: var(--n-icon-size);
 width: var(--n-icon-size);
 display: flex;
 align-items: center;
 justify-content: center;
 `),c("line",`
 transition: background-color .3s var(--n-bezier);
 position: absolute;
 top: var(--n-icon-size);
 left: calc(var(--n-icon-size) / 2 - 1px);
 bottom: 0px;
 width: 2px;
 background-color: var(--n-line-color);
 `)])])]),me=Object.assign(Object.assign({},S.props),{horizontal:Boolean,itemPlacement:{type:String,default:"left"},size:{type:String,default:"medium"},iconSize:Number}),O=Z("n-timeline"),de=C({name:"Timeline",props:me,setup(e,{slots:t}){const{mergedClsPrefixRef:o}=_(e),r=S("Timeline","-timeline",ce,ae,e,o);return D(O,{props:e,mergedThemeRef:r,mergedClsPrefixRef:o}),()=>{const{value:i}=o;return n("div",{class:[`${i}-timeline`,e.horizontal&&`${i}-timeline--horizontal`,`${i}-timeline--${e.size}-size`,!e.horizontal&&`${i}-timeline--${e.itemPlacement}-placement`]},t)}}}),ge={time:[String,Number],title:String,content:String,color:String,lineType:{type:String,default:"default"},type:{type:String,default:"default"}},y=C({name:"TimelineItem",props:ge,setup(e){const t=K(O);t||q("timeline-item","`n-timeline-item` must be placed inside `n-timeline`."),N();const{inlineThemeDisabled:o}=_(),r=u(()=>{const{props:{size:a,iconSize:d},mergedThemeRef:g}=t,{type:m}=e,{self:{titleTextColor:l,contentTextColor:p,metaTextColor:h,lineColor:v,titleFontWeight:$,contentFontSize:T,[f("iconSize",a)]:W,[f("titleMargin",a)]:A,[f("titleFontSize",a)]:M,[f("circleBorder",m)]:U,[f("iconColor",m)]:F},common:{cubicBezierEaseInOut:H}}=g.value;return{"--n-bezier":H,"--n-circle-border":U,"--n-icon-color":F,"--n-content-font-size":T,"--n-content-text-color":p,"--n-line-color":v,"--n-meta-text-color":h,"--n-title-font-size":M,"--n-title-font-weight":$,"--n-title-margin":A,"--n-title-text-color":l,"--n-icon-size":j(d)||W}}),i=o?E("timeline-item",u(()=>{const{props:{size:a,iconSize:d}}=t,{type:g}=e;return`${a[0]}${d||"a"}${g[0]}`}),r,t.props):void 0;return{mergedClsPrefix:t.mergedClsPrefixRef,cssVars:o?void 0:r,themeClass:i==null?void 0:i.themeClass,onRender:i==null?void 0:i.onRender}},render(){const{mergedClsPrefix:e,color:t,onRender:o,$slots:r}=this;return o==null||o(),n("div",{class:[`${e}-timeline-item`,this.themeClass,`${e}-timeline-item--${this.type}-type`,`${e}-timeline-item--${this.lineType}-line-type`],style:this.cssVars},n("div",{class:`${e}-timeline-item-timeline`},n("div",{class:`${e}-timeline-item-timeline__line`}),P(r.icon,i=>i?n("div",{class:`${e}-timeline-item-timeline__icon`,style:{color:t}},i):n("div",{class:`${e}-timeline-item-timeline__circle`,style:{borderColor:t}}))),n("div",{class:`${e}-timeline-item-content`},P(r.header,i=>i||this.title?n("div",{class:`${e}-timeline-item-content__title`},i||this.title):null),n("div",{class:`${e}-timeline-item-content__content`},I(r.default,()=>[this.content])),n("div",{class:`${e}-timeline-item-content__meta`},I(r.footer,()=>[this.time]))))}}),xe=C({async setup(){L({title:"Inicontent | Homepage",script:[{src:"https://www.paypal.com/sdk/js?client-id=AReVheO6-Eb0Zr34SOutS3lZtcBNXUjuqcdKYHZdpzUYqUE4N1KzSuizSJH2ZN7oLl9wZul1wu6hbZqY&vault=true&intent=subscription",body:!1}]}),V({ar:{pick_a_plan:"\u0625\u062E\u062A\u0631 \u062E\u0637\u0629",monthly_plan:"\u0627\u0644\u062E\u0637\u0629 \u0627\u0644\u0634\u0647\u0631\u064A\u0629",subscription_success:"\u062A\u0645 \u0627\u0644\u0625\u0634\u062A\u0631\u0627\u0643 \u0628\u0646\u062C\u0627\u062D"},en:{pick_a_plan:"Pick a plan",monthly_plan:"Monthly Plan",subscription_success:"Subscribed Successfully"}});const e=G("User");function t(){typeof window.paypal<"u"?window.paypal.Buttons({style:{shape:"pill",color:"white",layout:"vertical",label:"subscribe"},createSubscription:function(o,r){return r.subscription.create({plan_id:"P-940647543A404405XMMTAXAI"})},onApprove:function(o,r){message.success(w("subscription_success")),e.value.subscriptionID=o.subscriptionID,J("/auth?tab=signup")}}).render("#paypal-button-container-P-940647543A404405XMMTAXAI"):setTimeout(t,250)}return Y(()=>t()),()=>n("div",{style:{display:"flex",justifyContent:"center",alignItems:"center",height:"100%"}},n(k,{title:w("pick_a_plan"),hoverable:!0,style:{maxWidth:"300px"}},()=>[n(k,{title:w("monthly_plan"),hoverable:!0},()=>n(Q,{justify:"center"},()=>[n(de,()=>[n(y,{title:"Unlimited Databases"}),n(y,{title:"Unlimited Tables"}),n(y,{title:"Unlimited Users & Roles"}),n(y,{title:"Unlimited Uploads"}),n(y,{title:"Fast CDN"})]),n(re,{type:"error",size:"x-large"},()=>"4.99$"),n("div",{id:"paypal-button-container-P-940647543A404405XMMTAXAI"})]))]))}});export{xe as default};
