(window.webpackJsonp=window.webpackJsonp||[]).push([[11],{"2EUq":function(e,t,n){"use strict";n.r(t);var a=n("q1tI"),r=n.n(a),o=n("Wbzz"),c=n("YwZP"),i=(n("VRzm"),n("Btvt"),n("f3/d"),n("o0o1")),l=n.n(i),s=(n("pIFo"),n("ls82"),n("vOnD")),m=n("XX3T"),u=n("MPUk"),p=n.n(u),d=n("FrwU"),f=n.n(d),g=n("HUtx"),v=n("XE6F"),b=n("YYs/"),E=n("eMLo"),h=n("nVxu"),O=n("snnE"),j=n("JpnX"),w=n("CO5U");function x(e,t,n,a,r,o,c){try{var i=e[o](c),l=i.value}catch(s){return void n(s)}i.done?t(l):Promise.resolve(l).then(a,r)}var N=s.c.div.withConfig({displayName:"EventPage__Wrapper",componentId:"o0mea1-0"})(["#map,#mobileMap{height:250px;}#mobileMap{display:none;}#title{position:absolute;margin-top:-225px;max-width:500px;background-color:rgb(250,250,250);padding:0.5rem 0.5rem 0;z-index:999;border:1px solid ",";h1{text-align:inherit;margin-bottom:0;span{font-size:1.1rem;}a{color:#0078e7;font-size:25px;}}p.addr{margin:1rem 0;}p.status{margin-bottom:0.5rem;}.controls{position:absolute;bottom:0;right:0;margin-top:0.5rem;text-align:center;button{margin:10px;}}}#content{margin-top:0.5rem;grid-template-columns:60% auto;grid-gap:0.5rem;.desc-content{background-color:#fff;padding:1rem 0.5rem;}.info{margin-left:1rem;.info-date{margin:0.8rem 0;}.address{margin-top:0.8rem;}}}#photos{margin-top:2rem;.photos .slick-track{margin-left:0;img{padding:5px;}}}@media (max-width:","){#map{display:none;}#mobileMap{display:block;}#title{position:relative;margin-top:inherit;max-width:inherit;}#content{grid-template-columns:auto;.info{grid-row:1;}}}"],(function(e){return e.theme.borderColor}),(function(e){return e.theme.sm}));var k=function(e){var t=e.slug,n=Object(a.useState)(null),c=n[0],i=n[1],s=Object(a.useState)(!1),u=s[0],d=s[1],k=Object(a.useState)(!1),z=k[0],S=k[1],y=Object(a.useState)({}),M=y[0],C=y[1],P=Object(a.useState)(""),V=P[0],U=P[1],_=Object(a.useState)(!1),A=_[0],I=_[1],F=Object(b.k)({slug:t}),J=F.loading,T=F.event;return Object(a.useEffect)((function(){(!J&&!T||T&&!Object(b.a)(T))&&(Object(O.o)("L'évènement à l'adresse \""+t+'" est introuvable',"error"),Object(o.navigate)("/"))}),[T,J,t]),Object(a.useEffect)((function(){var e;(e=l.a.mark((function e(){return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!T){e.next=6;break}return e.t0=i,e.next=4,Object(O.l)(T.description.replace(/(?:\r\n|\r|\n)/g,"<br>"));case 4:e.t1=e.sent,(0,e.t0)(e.t1);case 6:case"end":return e.stop()}}),e)})),function(){var t=this,n=arguments;return new Promise((function(a,r){var o=e.apply(t,n);function c(e){x(o,a,r,c,i,"next",e)}function i(e){x(o,a,r,c,i,"throw",e)}c(void 0)}))})()}),[T]),Object(a.useEffect)((function(){T&&(S(Object(E.h)(T.group.community)),C(JSON.parse(T.occurrence)))}),[T]),Object(a.useEffect)((function(){var e="",t=0;j.a.forEach((function(n){var a=n.label,r=n.value;M[r]&&(0===t&&I(!0),e+=(t>0?", ":"")+a,t+=1)})),U(e)}),[M]),r.a.createElement(N,null,!J&&r.a.createElement(h.a,{coords:T&&T.location.coordinates,viewOffset:.006,zoom:16}),r.a.createElement(v.d,{loading:J&&!T},T&&r.a.createElement(r.a.Fragment,null,r.a.createElement(v.e,{title:T.name}),r.a.createElement("section",{className:"grid",id:"title"},r.a.createElement("h1",null,T.name," ",T.group&&r.a.createElement("p",null,r.a.createElement("span",null,"par")," ",r.a.createElement(v.c,{title:"Voir le group",to:"/group/"+T.group.slug},T.group.name))),r.a.createElement("p",{className:"addr text-wrap"},T.location.address),r.a.createElement(v.a,{condition:z},r.a.createElement("p",{className:"status bold"},"archived"===T.status&&r.a.createElement("span",{className:"red"},"Archivé"),"waiting"===T.status&&r.a.createElement("span",{className:"red"},"Hors ligne"),"online"===T.status&&r.a.createElement("span",{className:"green"},"En ligne"),T.isPrivate&&" | Évènement privé"),r.a.createElement("div",{className:"controls"},r.a.createElement(m.a,{"aria-label":"Modifier",className:"edit",onClick:function(){return Object(o.navigate)("/app/event/edit/"+T._id)},size:"small",title:"Modifier"},r.a.createElement(p.a,null)),r.a.createElement(m.a,{"aria-label":"Archiver",className:"archive",color:"secondary",onClick:function(){return d(!0)},size:"small",title:"Archiver"},r.a.createElement(f.a,null))),r.a.createElement(g.a,{action:function(){if(!Object(E.h)(T.group.community))return Object(O.o)("Vous ne pouvez pas archiver cet évènement","error");Object(b.b)(T._id,(function(){Object(O.o)("Évènement archivé avec succès","success"),Object(o.navigate)("/app")}),(function(e){Object(O.o)("Une erreur est survenue","error"),console.log(e)}))},close:function(){return d(!1)},isOpen:u,text:"Cet évènement ne sera pas supprimé.",title:"Voulez-vous vraiment archiver cet évènement ?"}))),r.a.createElement("section",{className:"grid",id:"content"},r.a.createElement("div",{className:"desc-content",dangerouslySetInnerHTML:{__html:c}}),r.a.createElement("div",{className:"info"},r.a.createElement("div",{className:"info-date"},r.a.createElement("p",null,r.a.createElement("strong",null,Object(j.c)(T.startDate))),r.a.createElement("p",null,Object(j.b)(T,!0))),A&&r.a.createElement("p",null,"Répétition de l’évènement : ",r.a.createElement("br",null),"Tous les ",r.a.createElement("em",null,V)),r.a.createElement("p",{className:"address"},"Adresse :",r.a.createElement("br",null),T.location.address))),r.a.createElement(h.a,{coords:T&&T.location.coordinates,id:"mobileMap",zoom:16}),r.a.createElement("section",{id:"photos"},r.a.createElement("p",null,T.photos&&T.photos.length?"Photos ("+T.photos.length+") :":""),r.a.createElement(w.a,{className:"photos",photos:T.photos})))))},z=function(){return Object(a.useEffect)((function(){return Object(o.navigate)("/")}),[]),null};t.default=function(){return r.a.createElement(c.Router,null,r.a.createElement(z,{path:"/event/*"}),r.a.createElement(k,{path:"/event/:slug"}))}},nVxu:function(e,t,n){"use strict";var a=n("q1tI"),r=n.n(a),o=n("SVAT");t.a=function(e){var t=e.id,n=void 0===t?"map":t,c=e.onClick,i=e.coords,l=e.locate,s=e.viewOffset,m=e.zoom,u=Object(a.useState)(null),p=u[0],d=u[1];return Object(a.useEffect)((function(){if(p)p.initSingleMarker(i,s,m);else{var e=new o.a(l,n);e.initSingle(c),d(e)}}),[i,n,l,p,c,s,m]),r.a.createElement("div",{id:n})}}}]);
//# sourceMappingURL=component---src-pages-event-js-ef34664a11f750a67b00.js.map