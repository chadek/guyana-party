(window.webpackJsonp=window.webpackJsonp||[]).push([[13],{"1waj":function(e,t,a){"use strict";a("HAE/");var n=a("TqRt");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var i=n(a("q1tI")),r=(0,n(a("8/g6")).default)(i.default.createElement("path",{d:"M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"}),"Add");t.default=r},Dbd8:function(e,t,a){"use strict";a("HAE/");var n=a("TqRt");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var i=n(a("q1tI")),r=(0,n(a("8/g6")).default)(i.default.createElement("path",{d:"M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"}),"Shuffle");t.default=r},O0Pz:function(e,t,a){"use strict";a("HAE/");var n=a("TqRt");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var i=n(a("q1tI")),r=(0,n(a("8/g6")).default)(i.default.createElement("path",{d:"M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"}),"GpsFixed");t.default=r},RXBc:function(e,t,a){"use strict";a.r(t);var n=a("q1tI"),i=a.n(n),r=a("5ZLf"),o=a("Wbzz"),c=a("vOnD"),l=a("Z3vd"),d=a("XX3T"),s=a("1waj"),m=a.n(s),u=a("O0Pz"),p=a.n(u),f=a("Dbd8"),h=a.n(f),g=a("iae6"),v=a("SVAT"),x=a("YYs/"),b=function(e){var t=e.setMarkers,a=e.onMarkerClick,r=e.setActions,o=e.setLoading,c=Object(n.useState)(null),l=c[0],d=c[1];return Object(n.useEffect)((function(){if(!l){var e=new v.a(!0);e.initMarkers({requestMarkers:x.h,setMarkers:t,onMarkerClick:a,setLoading:o}),r(e.actions),d(e)}}),[l,a,r,o,t]),i.a.createElement("div",{id:"map"})},E=a("O2uC"),w=(a("f3/d"),a("XE6F")),k=a("JpnX"),O=c.c.div.withConfig({displayName:"ListItem__Wrapper",componentId:"sc-1vkh46x-0"})(["padding:5px;border:1px solid rgb(239,239,239);background-color:#fff;&.selected{box-shadow:1px 1px 5px blue;}&:hover{box-shadow:1px 1px 5px grey;}a.grid{grid-template-columns:auto 1fr;grid-gap:5px;height:82px;img{width:82px;height:100%;}.content{overflow:hidden;padding:5px;h2,h3{margin-top:inherit;margin-bottom:0.3rem;}h2{font-size:1.2rem;}h3,p{font-size:0.9rem;}p{margin-bottom:0;}}}@media (min-width:",") and (max-width:","),(max-height:","){a.grid{height:75px;img{width:75px;}.content{h2{font-size:1rem;}h3{font-size:0.8rem;}}}}@media (max-width:","){a.grid{height:75px;img{width:75px;}}}"],(function(e){return e.theme.md}),(function(e){return e.theme.lg}),(function(e){return e.theme.sm}),(function(e){return e.theme.xs})),z=i.a.memo((function(e){var t=e.item,a=e.selected;return i.a.createElement(O,{className:a?"selected":""},i.a.createElement(w.c,{className:"grid",to:"/event/"+t.slug},i.a.createElement(w.b,{alt:t.name,className:"cover",src:t.photos.length>0?t.photos[0]:""}),i.a.createElement("div",{className:"content"},i.a.createElement("h2",{className:"text-wrap"},t.name),i.a.createElement("h3",{className:"text-wrap"},t.group&&t.group.name),i.a.createElement("p",null,Object(k.b)(t)))))})),j=a("snnE"),M=c.c.div.withConfig({displayName:"Home__Wrapper",componentId:"sc-1g80y23-0"})(["height:calc(100vh - ",");grid-template-columns:67% auto;#map-section{padding:5px;}#map-section #map{height:100%;}#list-section{overflow:auto;grid-auto-rows:max-content;grid-gap:0.5rem;padding:0 5px 5px;background-color:#fff;#actions{position:fixed;width:100%;background:#fff;padding:5px 0;button:not(:first-of-type){margin-left:5px;}.progress{display:inline-flex;vertical-align:middle;margin-left:0.5rem;div{width:20px !important;height:20px !important;}}}#events{grid-gap:0.5rem;margin-top:2.5rem;}#add-btn{padding:10px;position:absolute;bottom:0;right:0;}}@media (max-width:","){grid-template-columns:auto;grid-template-rows:auto 1fr;#map-section{padding-top:0;#map{height:50vh;}}#list-section{#add-btn{padding:5px 10px;button{width:46px;height:46px;}}}}"],(function(e){return e.theme.headerHeight}),(function(e){return e.theme.md}));var y=function(){var e=Object(n.useState)([]),t=e[0],a=e[1],r=Object(n.useState)(!1),c=r[0],s=r[1],u=Object(n.useState)(""),f=u[0],v=u[1],x=Object(n.useState)({}),w=x[0],k=x[1],O=Object(n.useRef)(!0);return Object(n.useEffect)((function(){return function(){return O.current=!1}}),[]),i.a.createElement(M,{className:"grid"},i.a.createElement("section",{id:"map-section"},i.a.createElement(E.a,{condition:"undefined"!=typeof window},i.a.createElement(b,{onMarkerClick:function(e){return v(e.slug)},setActions:k,setLoading:function(e){return O.current&&s(e)},setMarkers:a}))),i.a.createElement("section",{className:"grid",id:"list-section"},i.a.createElement("div",{id:"actions"},i.a.createElement(l.a,{endIcon:i.a.createElement(p.a,null),onClick:function(){if(w.isDenied())return Object(j.o)("La localisation a été désactivée !");w.locate()},size:"small",variant:"outlined"},"Autour de moi"),i.a.createElement(l.a,{endIcon:i.a.createElement(h.a,null),onClick:function(){return w.random()},size:"small",variant:"outlined"},"AléaTown"),c&&i.a.createElement("span",{className:"progress"},i.a.createElement(g.a,null))),i.a.createElement("div",{className:"grid",id:"events"},t&&t.map((function(e,t){return i.a.createElement(z,{item:e,key:e.slug+t,selected:e.slug===f})}))),i.a.createElement("div",{id:"add-btn"},i.a.createElement(d.a,{"aria-label":"Créer un évènement",color:"primary",onClick:function(){return Object(o.navigate)("/app/event/new")},title:"Créer un évènement"},i.a.createElement(m.a,null)))))};t.default=function(){return i.a.createElement(i.a.Fragment,null,i.a.createElement(r.a,{title:"Liberté Humaine"}),i.a.createElement(y,null))}}}]);
//# sourceMappingURL=component---src-pages-index-js-6a00859668b62792fabf.js.map