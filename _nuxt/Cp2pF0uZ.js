import{b as n,h as d,e as t,d as o,f as s}from"./BHakqtML.js";const r="0!important",l="-1px!important";function i(a){return o(`${a}-type`,[t("& +",[n("button",{},[o(`${a}-type`,[s("border",{borderLeftWidth:r}),s("state-border",{left:l})])])])])}function e(a){return o(`${a}-type`,[t("& +",[n("button",[o(`${a}-type`,[s("border",{borderTopWidth:r}),s("state-border",{top:l})])])])])}const f=n("button-group",`
 flex-wrap: nowrap;
 display: inline-flex;
 position: relative;
`,[d("vertical",{flexDirection:"row"},[d("rtl",[n("button",[t("&:first-child:not(:last-child)",`
 margin-right: ${r};
 border-top-right-radius: ${r};
 border-bottom-right-radius: ${r};
 `),t("&:last-child:not(:first-child)",`
 margin-left: ${r};
 border-top-left-radius: ${r};
 border-bottom-left-radius: ${r};
 `),t("&:not(:first-child):not(:last-child)",`
 margin-left: ${r};
 margin-right: ${r};
 border-radius: ${r};
 `),i("default"),o("ghost",[i("primary"),i("info"),i("success"),i("warning"),i("error")])])])]),o("vertical",{flexDirection:"column"},[n("button",[t("&:first-child:not(:last-child)",`
 margin-bottom: ${r};
 margin-left: ${r};
 margin-right: ${r};
 border-bottom-left-radius: ${r};
 border-bottom-right-radius: ${r};
 `),t("&:last-child:not(:first-child)",`
 margin-top: ${r};
 margin-left: ${r};
 margin-right: ${r};
 border-top-left-radius: ${r};
 border-top-right-radius: ${r};
 `),t("&:not(:first-child):not(:last-child)",`
 margin: ${r};
 border-radius: ${r};
 `),e("default"),o("ghost",[e("primary"),e("info"),e("success"),e("warning"),e("error")])])])]);export{l as n,f as s,r as z};
