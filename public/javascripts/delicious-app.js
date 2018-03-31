import "../sass/style.scss";

import { S, SS } from "./modules/bling";
import { loginForm } from "./modules/loginForm";
import accountForm from "./modules/accountForm";
import makeMap from "./modules/map";

$(document).foundation();

loginForm();
accountForm();
makeMap($("#map"));
