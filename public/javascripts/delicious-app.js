import "../sass/style.scss";

import { B, BB } from "./modules/bling";
import { loginForm } from "./modules/loginForm";
import accountForm from "./modules/accountForm";
import makeMap from "./modules/map";
import addEventForm from "./modules/addEventForm";

$(document).foundation();

B("#fileUpload") && B("#fileUpload").on("change", function(e) {
    e = e || window.event;
    this.nextSibling.textContent = `Fichier : ${(e.target || e.srcElement).files[0].name}`;
});

loginForm(B(".forgot-link"));
accountForm();
makeMap(B("#map"));
addEventForm($(".clockpicker"), B("#dp1"), B("#dp2"));
