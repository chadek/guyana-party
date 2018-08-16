import "../sass/style.scss";
import accountForm from "./modules/accountForm";
import addEventForm from "./modules/addEventForm";
import { B } from "./modules/bling";
import initDates from "./modules/date";
import loadEventsOrgasList from "./modules/eventsOrgasList";
import makeMap from "./modules/map";
import "./modules/simplemde";
// import "./modules/menu";
import subscriptions from "./modules/subscriptions";

import { axiosGet } from "./modules/utils";

// open popup on click on avatar nav
B(".menu-item-avatar") &&
  B(".menu-item-avatar").on("click", () => {
    const popOver = B(".pop-over");
    popOver.classList.toggle("pop-over--visible");
    B(".pop-over-header-close-btn").on("click", () => {
      popOver.classList.remove("pop-over--visible");
    });
  });

// managing file uploads when needed
B("#fileUpload") &&
  B("#fileUpload").on("change", function(e) {
    e = e || window.event;
    this.nextSibling.textContent = `Fichier : ${(e.target || e.srcElement).files[0].name}`;
  });


accountForm(B(".btn-old"), B(".btn-new"));
subscriptions(B(".freeSubsBtn"), B(".assoSubsBtn"));
makeMap(B("#map"));
loadEventsOrgasList(B(".events"), B(".orga-events"), B(".orgas"), B("#orga-select"));
initDates(B("#event-start"), B("#event-end"));
addEventForm(B("#dp1"), B("#dp2"));
