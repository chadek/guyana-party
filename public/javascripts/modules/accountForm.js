import { B } from "./bling";

function accountForm(btn_old, btn_new) {
  if(!btn_old || !btn_new) return;

  $("[data-mobile-app-toggle] .button").click(function() {
    $(this)
      .siblings()
      .removeClass("is-active");
    $(this).addClass("is-active");
  });

  btn_old.on("click", function() {
    // TODO
    console.log("show old");
  });

  btn_new.on("click", function() {
    // TODO
    console.log("show new");
  });
}

export default accountForm;
