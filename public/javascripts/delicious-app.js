import "../sass/style.scss";

import { B, BB } from "./modules/bling";
import { loginForm } from "./modules/loginForm";
import makeMap from "./modules/map";
import loadEventsOrgasList from "./modules/eventsOrgasList";
import initDates from "./modules/date";
import addEventForm from "./modules/addEventForm";
import accountForm from "./modules/accountForm";

$(document).foundation();

B("#fileUpload") &&
  B("#fileUpload").on("change", function(e) {
    e = e || window.event;
    this.nextSibling.textContent = `Fichier : ${(e.target || e.srcElement).files[0].name}`;
  });

loginForm(B(".forgot-link"));
accountForm(B(".btn-old"), B(".btn-new"));
makeMap(B("#map"));
loadEventsOrgasList(B(".events"), B(".orga-events"), B(".orgas"), B("#orga-select"));
initDates(B("#event-start"), B("#event-end"));
addEventForm($(".clockpicker"), B("#dp1"), B("#dp2"));
