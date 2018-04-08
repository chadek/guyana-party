import "../sass/style.scss";

import { B, BB } from "./modules/bling";
import { loginForm } from "./modules/loginForm";
import makeMap from "./modules/map";
import loadEventsOrgasList from "./modules/eventsOrgasList";
import initDates from "./modules/date";
import addEventForm from "./modules/addEventForm";

$(document).foundation();

B("#fileUpload") && B("#fileUpload").on("change", function(e) {
    e = e || window.event;
    this.nextSibling.textContent = `Fichier : ${(e.target || e.srcElement).files[0].name}`;
});

loginForm(B(".forgot-link"));
makeMap(B("#map"));
loadEventsOrgasList(B(".events"), B(".orga-events"), B(".orgas"), B("#orga-select"));
initDates(B("#start"), B("#end"));
addEventForm($(".clockpicker"), B("#dp1"), B("#dp2"));
