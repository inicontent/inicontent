import{u as Z,d as b,f as ee,e as h,k as oe}from"./Space.f818dfb9.js";import{m as n,f as g,bf as re,p as d,q as t,r as ne,s as te,a as ae,k as de,i as y,b as C,l as se,h as l,br as le,H as ie,G as ce}from"./entry.965cbfb6.js";import{N as be,o as ge}from"./index.32cff159.js";import{k as fe}from"./format-length.ad42f3fa.js";const ve=n([g("card",`
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
 `,[re({background:"var(--n-color-modal)"}),d("hoverable",[n("&:hover","box-shadow: var(--n-box-shadow);")]),d("content-segmented",[n(">",[t("content",{paddingTop:"var(--n-padding-bottom)"})])]),d("content-soft-segmented",[n(">",[t("content",`
 margin: 0 var(--n-padding-left);
 padding: var(--n-padding-bottom) 0;
 `)])]),d("footer-segmented",[n(">",[t("footer",{paddingTop:"var(--n-padding-bottom)"})])]),d("footer-soft-segmented",[n(">",[t("footer",`
 padding: var(--n-padding-bottom) 0;
 margin: 0 var(--n-padding-left);
 `)])]),n(">",[g("card-header",`
 box-sizing: border-box;
 display: flex;
 align-items: center;
 font-size: var(--n-title-font-size);
 padding:
 var(--n-padding-top)
 var(--n-padding-left)
 var(--n-padding-bottom)
 var(--n-padding-left);
 `,[t("main",`
 font-weight: var(--n-title-font-weight);
 transition: color .3s var(--n-bezier);
 flex: 1;
 min-width: 0;
 color: var(--n-title-text-color);
 `),t("extra",`
 display: flex;
 align-items: center;
 font-size: var(--n-font-size);
 font-weight: 400;
 transition: color .3s var(--n-bezier);
 color: var(--n-text-color);
 `),t("close",`
 margin: 0 0 0 8px;
 transition:
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 `)]),t("action",`
 box-sizing: border-box;
 transition:
 background-color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 background-clip: padding-box;
 background-color: var(--n-action-color);
 `),t("content","flex: 1; min-width: 0;"),t("content, footer",`
 box-sizing: border-box;
 padding: 0 var(--n-padding-left) var(--n-padding-bottom) var(--n-padding-left);
 font-size: var(--n-font-size);
 `,[n("&:first-child",{paddingTop:"var(--n-padding-bottom)"})]),t("action",`
 background-color: var(--n-action-color);
 padding: var(--n-padding-bottom) var(--n-padding-left);
 border-bottom-left-radius: var(--n-border-radius);
 border-bottom-right-radius: var(--n-border-radius);
 `)]),g("card-cover",`
 overflow: hidden;
 width: 100%;
 border-radius: var(--n-border-radius) var(--n-border-radius) 0 0;
 `,[n("img",`
 display: block;
 width: 100%;
 `)]),d("bordered",`
 border: 1px solid var(--n-border-color);
 `,[n("&:target","border-color: var(--n-color-target);")]),d("action-segmented",[n(">",[t("action",[n("&:not(:first-child)",{borderTop:"1px solid var(--n-border-color)"})])])]),d("content-segmented, content-soft-segmented",[n(">",[t("content",{transition:"border-color 0.3s var(--n-bezier)"},[n("&:not(:first-child)",{borderTop:"1px solid var(--n-border-color)"})])])]),d("footer-segmented, footer-soft-segmented",[n(">",[t("footer",{transition:"border-color 0.3s var(--n-bezier)"},[n("&:not(:first-child)",{borderTop:"1px solid var(--n-border-color)"})])])]),d("embedded",`
 background-color: var(--n-color-embedded);
 `)]),ne(g("card",`
 background: var(--n-color-modal);
 `,[d("embedded",`
 background-color: var(--n-color-embedded-modal);
 `)])),te(g("card",`
 background: var(--n-color-popover);
 `,[d("embedded",`
 background-color: var(--n-color-embedded-popover);
 `)]))]),S={title:String,contentStyle:[Object,String],headerStyle:[Object,String],headerExtraStyle:[Object,String],footerStyle:[Object,String],embedded:Boolean,segmented:{type:[Boolean,Object],default:!1},size:{type:String,default:"medium"},bordered:{type:Boolean,default:!0},closable:Boolean,hoverable:Boolean,role:String,onClose:[Function,Array],tag:{type:String,default:"div"}},Ce=fe(S),me=Object.assign(Object.assign({},y.props),S),ye=ae({name:"Card",props:me,setup(e){const i=()=>{const{onClose:r}=e;r&&ee(r)},{inlineThemeDisabled:s,mergedClsPrefixRef:o,mergedRtlRef:p}=de(e),c=y("Card","-card",ve,le,e,o),u=Z("Card",p,o),v=C(()=>{const{size:r}=e,{self:{color:m,colorModal:k,colorTarget:$,textColor:w,titleTextColor:P,titleFontWeight:T,borderColor:j,actionColor:B,borderRadius:O,lineHeight:R,closeIconColor:_,closeIconColorHover:E,closeIconColorPressed:M,closeColorHover:L,closeColorPressed:H,closeBorderRadius:I,closeIconSize:F,closeSize:N,boxShadow:A,colorPopover:V,colorEmbedded:D,colorEmbeddedModal:G,colorEmbeddedPopover:K,[h("padding",r)]:W,[h("fontSize",r)]:q,[h("titleFontSize",r)]:J},common:{cubicBezierEaseInOut:Q}}=c.value,{top:U,left:X,bottom:Y}=oe(W);return{"--n-bezier":Q,"--n-border-radius":O,"--n-color":m,"--n-color-modal":k,"--n-color-popover":V,"--n-color-embedded":D,"--n-color-embedded-modal":G,"--n-color-embedded-popover":K,"--n-color-target":$,"--n-text-color":w,"--n-line-height":R,"--n-action-color":B,"--n-title-text-color":P,"--n-title-font-weight":T,"--n-close-icon-color":_,"--n-close-icon-color-hover":E,"--n-close-icon-color-pressed":M,"--n-close-color-hover":L,"--n-close-color-pressed":H,"--n-border-color":j,"--n-box-shadow":A,"--n-padding-top":U,"--n-padding-bottom":Y,"--n-padding-left":X,"--n-font-size":q,"--n-title-font-size":J,"--n-close-size":N,"--n-close-icon-size":F,"--n-close-border-radius":I}}),a=s?se("card",C(()=>e.size[0]),v,e):void 0;return{rtlEnabled:u,mergedClsPrefix:o,mergedTheme:c,handleCloseClick:i,cssVars:s?void 0:v,themeClass:a==null?void 0:a.themeClass,onRender:a==null?void 0:a.onRender}},render(){const{segmented:e,bordered:i,hoverable:s,mergedClsPrefix:o,rtlEnabled:p,onRender:c,embedded:u,tag:v,$slots:a}=this;return c==null||c(),l(v,{class:[`${o}-card`,this.themeClass,u&&`${o}-card--embedded`,{[`${o}-card--rtl`]:p,[`${o}-card--content${typeof e!="boolean"&&e.content==="soft"?"-soft":""}-segmented`]:e===!0||e!==!1&&e.content,[`${o}-card--footer${typeof e!="boolean"&&e.footer==="soft"?"-soft":""}-segmented`]:e===!0||e!==!1&&e.footer,[`${o}-card--action-segmented`]:e===!0||e!==!1&&e.action,[`${o}-card--bordered`]:i,[`${o}-card--hoverable`]:s}],style:this.cssVars,role:this.role},b(a.cover,r=>r&&l("div",{class:`${o}-card-cover`,role:"none"},r)),b(a.header,r=>r||this.title||this.closable?l("div",{class:`${o}-card-header`,style:this.headerStyle},l("div",{class:`${o}-card-header__main`,role:"heading"},r||this.title),b(a["header-extra"],m=>m&&l("div",{class:`${o}-card-header__extra`,style:this.headerExtraStyle},m)),this.closable?l(be,{clsPrefix:o,class:`${o}-card-header__close`,onClick:this.handleCloseClick,absolute:!0}):null):null),b(a.default,r=>r&&l("div",{class:`${o}-card__content`,style:this.contentStyle,role:"none"},r)),b(a.footer,r=>r&&[l("div",{class:`${o}-card__footer`,style:this.footerStyle,role:"none"},r)]),b(a.action,r=>r&&l("div",{class:`${o}-card__action`,role:"none"},r)))}}),f=ie("LanguageMessages"),pe=ce("Language"),x=e=>e&&typeof e=="object"&&!Array.isArray(e),z=(e,...i)=>{if(!i.length)return e;const s=i.shift();if(x(e)&&x(s))for(const o in s)x(s[o])?(e[o]||Object.assign(e,{[o]:{}}),z(e[o],s[o])):Object.assign(e,{[o]:s[o]});return z(e,...i)},Se=e=>{f.value?f.value=z(f.value,e):f.value=e},ke=e=>ge.get(f.value,`${pe.value}.${e}`,e);export{ye as N,Ce as a,S as c,ke as t,Se as u};
