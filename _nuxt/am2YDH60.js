import{u as U,a as b,c as X,g as Y,e as g}from"./16KSqgTs.js";import{e as n,b as f,a_ as ee,d as s,f as d,aZ as oe,b6 as re,ah as S,i as te,ab as ne,l as y,ai as de,t as i,aT as z}from"./DY8a-ZKd.js";import{c as ae}from"./DmoPv2Xj.js";import{N as se}from"./BtU0ExOh.js";import{k as ie}from"./HiGXOwLp.js";const le=n([f("card",`
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
 `,[ee({background:"var(--n-color-modal)"}),s("hoverable",[n("&:hover","box-shadow: var(--n-box-shadow);")]),s("content-segmented",[n(">",[d("content",{paddingTop:"var(--n-padding-bottom)"})])]),s("content-soft-segmented",[n(">",[d("content",`
 margin: 0 var(--n-padding-left);
 padding: var(--n-padding-bottom) 0;
 `)])]),s("footer-segmented",[n(">",[d("footer",{paddingTop:"var(--n-padding-bottom)"})])]),s("footer-soft-segmented",[n(">",[d("footer",`
 padding: var(--n-padding-bottom) 0;
 margin: 0 var(--n-padding-left);
 `)])]),n(">",[f("card-header",`
 box-sizing: border-box;
 display: flex;
 align-items: center;
 font-size: var(--n-title-font-size);
 padding:
 var(--n-padding-top)
 var(--n-padding-left)
 var(--n-padding-bottom)
 var(--n-padding-left);
 `,[d("main",`
 font-weight: var(--n-title-font-weight);
 transition: color .3s var(--n-bezier);
 flex: 1;
 min-width: 0;
 color: var(--n-title-text-color);
 `),d("extra",`
 display: flex;
 align-items: center;
 font-size: var(--n-font-size);
 font-weight: 400;
 transition: color .3s var(--n-bezier);
 color: var(--n-text-color);
 `),d("close",`
 margin: 0 0 0 8px;
 transition:
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 `)]),d("action",`
 box-sizing: border-box;
 transition:
 background-color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 background-clip: padding-box;
 background-color: var(--n-action-color);
 `),d("content","flex: 1; min-width: 0;"),d("content, footer",`
 box-sizing: border-box;
 padding: 0 var(--n-padding-left) var(--n-padding-bottom) var(--n-padding-left);
 font-size: var(--n-font-size);
 `,[n("&:first-child",{paddingTop:"var(--n-padding-bottom)"})]),d("action",`
 background-color: var(--n-action-color);
 padding: var(--n-padding-bottom) var(--n-padding-left);
 border-bottom-left-radius: var(--n-border-radius);
 border-bottom-right-radius: var(--n-border-radius);
 `)]),f("card-cover",`
 overflow: hidden;
 width: 100%;
 border-radius: var(--n-border-radius) var(--n-border-radius) 0 0;
 `,[n("img",`
 display: block;
 width: 100%;
 `)]),s("bordered",`
 border: 1px solid var(--n-border-color);
 `,[n("&:target","border-color: var(--n-color-target);")]),s("action-segmented",[n(">",[d("action",[n("&:not(:first-child)",{borderTop:"1px solid var(--n-border-color)"})])])]),s("content-segmented, content-soft-segmented",[n(">",[d("content",{transition:"border-color 0.3s var(--n-bezier)"},[n("&:not(:first-child)",{borderTop:"1px solid var(--n-border-color)"})])])]),s("footer-segmented, footer-soft-segmented",[n(">",[d("footer",{transition:"border-color 0.3s var(--n-bezier)"},[n("&:not(:first-child)",{borderTop:"1px solid var(--n-border-color)"})])])]),s("embedded",`
 background-color: var(--n-color-embedded);
 `)]),oe(f("card",`
 background: var(--n-color-modal);
 `,[s("embedded",`
 background-color: var(--n-color-embedded-modal);
 `)])),re(f("card",`
 background: var(--n-color-popover);
 `,[s("embedded",`
 background-color: var(--n-color-embedded-popover);
 `)]))]),k={title:[String,Function],contentClass:String,contentStyle:[Object,String],headerClass:String,headerStyle:[Object,String],headerExtraClass:String,headerExtraStyle:[Object,String],footerClass:String,footerStyle:[Object,String],embedded:Boolean,segmented:{type:[Boolean,Object],default:!1},size:{type:String,default:"medium"},bordered:{type:Boolean,default:!0},closable:Boolean,hoverable:Boolean,role:String,onClose:[Function,Array],tag:{type:String,default:"div"},cover:Function,content:[String,Function],footer:Function,action:Function,headerExtra:Function},me=ie(k),ce=Object.assign(Object.assign({},S.props),k),pe=te({name:"Card",props:ce,setup(o){const p=()=>{const{onClose:t}=o;t&&X(t)},{inlineThemeDisabled:h,mergedClsPrefixRef:e,mergedRtlRef:u}=ne(o),c=S("Card","-card",le,ae,o,e),x=U("Card",u,e),v=y(()=>{const{size:t}=o,{self:{color:r,colorModal:l,colorTarget:C,textColor:m,titleTextColor:$,titleFontWeight:w,borderColor:E,actionColor:T,borderRadius:_,lineHeight:B,closeIconColor:P,closeIconColorHover:R,closeIconColorPressed:F,closeColorHover:O,closeColorPressed:j,closeBorderRadius:M,closeIconSize:I,closeSize:N,boxShadow:V,colorPopover:H,colorEmbedded:K,colorEmbeddedModal:L,colorEmbeddedPopover:W,[z("padding",t)]:A,[z("fontSize",t)]:D,[z("titleFontSize",t)]:Z},common:{cubicBezierEaseInOut:q}}=c.value,{top:G,left:J,bottom:Q}=Y(A);return{"--n-bezier":q,"--n-border-radius":_,"--n-color":r,"--n-color-modal":l,"--n-color-popover":H,"--n-color-embedded":K,"--n-color-embedded-modal":L,"--n-color-embedded-popover":W,"--n-color-target":C,"--n-text-color":m,"--n-line-height":B,"--n-action-color":T,"--n-title-text-color":$,"--n-title-font-weight":w,"--n-close-icon-color":P,"--n-close-icon-color-hover":R,"--n-close-icon-color-pressed":F,"--n-close-color-hover":O,"--n-close-color-pressed":j,"--n-border-color":E,"--n-box-shadow":V,"--n-padding-top":G,"--n-padding-bottom":Q,"--n-padding-left":J,"--n-font-size":D,"--n-title-font-size":Z,"--n-close-size":N,"--n-close-icon-size":I,"--n-close-border-radius":M}}),a=h?de("card",y(()=>o.size[0]),v,o):void 0;return{rtlEnabled:x,mergedClsPrefix:e,mergedTheme:c,handleCloseClick:p,cssVars:h?void 0:v,themeClass:a==null?void 0:a.themeClass,onRender:a==null?void 0:a.onRender}},render(){const{segmented:o,bordered:p,hoverable:h,mergedClsPrefix:e,rtlEnabled:u,onRender:c,embedded:x,tag:v,$slots:a}=this;return c==null||c(),i(v,{class:[`${e}-card`,this.themeClass,x&&`${e}-card--embedded`,{[`${e}-card--rtl`]:u,[`${e}-card--content${typeof o!="boolean"&&o.content==="soft"?"-soft":""}-segmented`]:o===!0||o!==!1&&o.content,[`${e}-card--footer${typeof o!="boolean"&&o.footer==="soft"?"-soft":""}-segmented`]:o===!0||o!==!1&&o.footer,[`${e}-card--action-segmented`]:o===!0||o!==!1&&o.action,[`${e}-card--bordered`]:p,[`${e}-card--hoverable`]:h}],style:this.cssVars,role:this.role},b(a.cover,t=>{const r=this.cover?g([this.cover()]):t;return r&&i("div",{class:`${e}-card-cover`,role:"none"},r)}),b(a.header,t=>{const{title:r}=this,l=r?g(typeof r=="function"?[r()]:[r]):t;return l||this.closable?i("div",{class:[`${e}-card-header`,this.headerClass],style:this.headerStyle,role:"heading"},i("div",{class:`${e}-card-header__main`,role:"heading"},l),b(a["header-extra"],C=>{const m=this.headerExtra?g([this.headerExtra()]):C;return m&&i("div",{class:[`${e}-card-header__extra`,this.headerExtraClass],style:this.headerExtraStyle},m)}),this.closable&&i(se,{clsPrefix:e,class:`${e}-card-header__close`,onClick:this.handleCloseClick,absolute:!0})):null}),b(a.default,t=>{const{content:r}=this,l=r?g(typeof r=="function"?[r()]:[r]):t;return l&&i("div",{class:[`${e}-card__content`,this.contentClass],style:this.contentStyle,role:"none"},l)}),b(a.footer,t=>{const r=this.footer?g([this.footer()]):t;return r&&i("div",{class:[`${e}-card__footer`,this.footerClass],style:this.footerStyle,role:"none"},r)}),b(a.action,t=>{const r=this.action?g([this.action()]):t;return r&&i("div",{class:`${e}-card__action`,role:"none"},r)}))}});export{pe as N,me as a,k as c};
