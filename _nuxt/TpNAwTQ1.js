import{b as U,u as X,r as i,c as Y}from"./Dari_zsp.js";import{b$ as t,c0 as c,cg as Z,c9 as d,cb as n,cf as ee,cE as oe,ah as re,c2 as x,c1 as te,a6 as u,j as s,cF as ne,ci as h}from"./DJ3poR1r.js";import{g as ae,N as de}from"./BrWYrq9v.js";import{k as se}from"./HiGXOwLp.js";const le=t([c("card",`
 font-size: var(--n-font-size);
 line-height: var(--n-line-height);
 display: flex;
 flex-direction: column;
 width: 100%;
 box-sizing: border-box;
 position: relative;
 border-radius: var(--n-border-radius);
 background-color: var(--n-color);
 color: var(--n-text-color);
 word-break: break-word;
 transition: 
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 `,[Z({background:"var(--n-color-modal)"}),d("hoverable",[t("&:hover","box-shadow: var(--n-box-shadow);")]),d("content-segmented",[t(">",[n("content",{paddingTop:"var(--n-padding-bottom)"})])]),d("content-soft-segmented",[t(">",[n("content",`
 margin: 0 var(--n-padding-left);
 padding: var(--n-padding-bottom) 0;
 `)])]),d("footer-segmented",[t(">",[n("footer",{paddingTop:"var(--n-padding-bottom)"})])]),d("footer-soft-segmented",[t(">",[n("footer",`
 padding: var(--n-padding-bottom) 0;
 margin: 0 var(--n-padding-left);
 `)])]),t(">",[c("card-header",`
 box-sizing: border-box;
 display: flex;
 align-items: center;
 font-size: var(--n-title-font-size);
 padding:
 var(--n-padding-top)
 var(--n-padding-left)
 var(--n-padding-bottom)
 var(--n-padding-left);
 `,[n("main",`
 font-weight: var(--n-title-font-weight);
 transition: color .3s var(--n-bezier);
 flex: 1;
 min-width: 0;
 color: var(--n-title-text-color);
 `),n("extra",`
 display: flex;
 align-items: center;
 font-size: var(--n-font-size);
 font-weight: 400;
 transition: color .3s var(--n-bezier);
 color: var(--n-text-color);
 `),n("close",`
 margin: 0 0 0 8px;
 transition:
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 `)]),n("action",`
 box-sizing: border-box;
 transition:
 background-color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 background-clip: padding-box;
 background-color: var(--n-action-color);
 `),n("content","flex: 1; min-width: 0;"),n("content, footer",`
 box-sizing: border-box;
 padding: 0 var(--n-padding-left) var(--n-padding-bottom) var(--n-padding-left);
 font-size: var(--n-font-size);
 `,[t("&:first-child",{paddingTop:"var(--n-padding-bottom)"})]),n("action",`
 background-color: var(--n-action-color);
 padding: var(--n-padding-bottom) var(--n-padding-left);
 border-bottom-left-radius: var(--n-border-radius);
 border-bottom-right-radius: var(--n-border-radius);
 `)]),c("card-cover",`
 overflow: hidden;
 width: 100%;
 border-radius: var(--n-border-radius) var(--n-border-radius) 0 0;
 `,[t("img",`
 display: block;
 width: 100%;
 `)]),d("bordered",`
 border: 1px solid var(--n-border-color);
 `,[t("&:target","border-color: var(--n-color-target);")]),d("action-segmented",[t(">",[n("action",[t("&:not(:first-child)",{borderTop:"1px solid var(--n-border-color)"})])])]),d("content-segmented, content-soft-segmented",[t(">",[n("content",{transition:"border-color 0.3s var(--n-bezier)"},[t("&:not(:first-child)",{borderTop:"1px solid var(--n-border-color)"})])])]),d("footer-segmented, footer-soft-segmented",[t(">",[n("footer",{transition:"border-color 0.3s var(--n-bezier)"},[t("&:not(:first-child)",{borderTop:"1px solid var(--n-border-color)"})])])]),d("embedded",`
 background-color: var(--n-color-embedded);
 `)]),ee(c("card",`
 background: var(--n-color-modal);
 `,[d("embedded",`
 background-color: var(--n-color-embedded-modal);
 `)])),oe(c("card",`
 background: var(--n-color-popover);
 `,[d("embedded",`
 background-color: var(--n-color-embedded-popover);
 `)]))]),C={title:String,contentClass:String,contentStyle:[Object,String],headerClass:String,headerStyle:[Object,String],headerExtraClass:String,headerExtraStyle:[Object,String],footerClass:String,footerStyle:[Object,String],embedded:Boolean,segmented:{type:[Boolean,Object],default:!1},size:{type:String,default:"medium"},bordered:{type:Boolean,default:!0},closable:Boolean,hoverable:Boolean,role:String,onClose:[Function,Array],tag:{type:String,default:"div"}},ve=se(C),ie=Object.assign(Object.assign({},x.props),C),me=re({name:"Card",props:ie,setup(r){const v=()=>{const{onClose:o}=r;o&&Y(o)},{inlineThemeDisabled:b,mergedClsPrefixRef:e,mergedRtlRef:m}=te(r),l=x("Card","-card",le,ne,r,e),p=U("Card",m,e),g=u(()=>{const{size:o}=r,{self:{color:f,colorModal:z,colorTarget:y,textColor:S,titleTextColor:k,titleFontWeight:$,borderColor:w,actionColor:E,borderRadius:T,lineHeight:B,closeIconColor:P,closeIconColorHover:R,closeIconColorPressed:_,closeColorHover:O,closeColorPressed:j,closeBorderRadius:M,closeIconSize:F,closeSize:I,boxShadow:H,colorPopover:N,colorEmbedded:V,colorEmbeddedModal:K,colorEmbeddedPopover:L,[h("padding",o)]:W,[h("fontSize",o)]:A,[h("titleFontSize",o)]:D},common:{cubicBezierEaseInOut:q}}=l.value,{top:G,left:J,bottom:Q}=ae(W);return{"--n-bezier":q,"--n-border-radius":T,"--n-color":f,"--n-color-modal":z,"--n-color-popover":N,"--n-color-embedded":V,"--n-color-embedded-modal":K,"--n-color-embedded-popover":L,"--n-color-target":y,"--n-text-color":S,"--n-line-height":B,"--n-action-color":E,"--n-title-text-color":k,"--n-title-font-weight":$,"--n-close-icon-color":P,"--n-close-icon-color-hover":R,"--n-close-icon-color-pressed":_,"--n-close-color-hover":O,"--n-close-color-pressed":j,"--n-border-color":w,"--n-box-shadow":H,"--n-padding-top":G,"--n-padding-bottom":Q,"--n-padding-left":J,"--n-font-size":A,"--n-title-font-size":D,"--n-close-size":I,"--n-close-icon-size":F,"--n-close-border-radius":M}}),a=b?X("card",u(()=>r.size[0]),g,r):void 0;return{rtlEnabled:p,mergedClsPrefix:e,mergedTheme:l,handleCloseClick:v,cssVars:b?void 0:g,themeClass:a==null?void 0:a.themeClass,onRender:a==null?void 0:a.onRender}},render(){const{segmented:r,bordered:v,hoverable:b,mergedClsPrefix:e,rtlEnabled:m,onRender:l,embedded:p,tag:g,$slots:a}=this;return l==null||l(),s(g,{class:[`${e}-card`,this.themeClass,p&&`${e}-card--embedded`,{[`${e}-card--rtl`]:m,[`${e}-card--content${typeof r!="boolean"&&r.content==="soft"?"-soft":""}-segmented`]:r===!0||r!==!1&&r.content,[`${e}-card--footer${typeof r!="boolean"&&r.footer==="soft"?"-soft":""}-segmented`]:r===!0||r!==!1&&r.footer,[`${e}-card--action-segmented`]:r===!0||r!==!1&&r.action,[`${e}-card--bordered`]:v,[`${e}-card--hoverable`]:b}],style:this.cssVars,role:this.role},i(a.cover,o=>o&&s("div",{class:`${e}-card-cover`,role:"none"},o)),i(a.header,o=>o||this.title||this.closable?s("div",{class:[`${e}-card-header`,this.headerClass],style:this.headerStyle},s("div",{class:`${e}-card-header__main`,role:"heading"},o||this.title),i(a["header-extra"],f=>f&&s("div",{class:[`${e}-card-header__extra`,this.headerExtraClass],style:this.headerExtraStyle},f)),this.closable?s(de,{clsPrefix:e,class:`${e}-card-header__close`,onClick:this.handleCloseClick,absolute:!0}):null):null),i(a.default,o=>o&&s("div",{class:[`${e}-card__content`,this.contentClass],style:this.contentStyle,role:"none"},o)),i(a.footer,o=>o&&[s("div",{class:[`${e}-card__footer`,this.footerClass],style:this.footerStyle,role:"none"},o)]),i(a.action,o=>o&&s("div",{class:`${e}-card__action`,role:"none"},o)))}});export{me as N,ve as a,C as c};
