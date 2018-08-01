// import { B } from "./bling";
// import { setTimeout } from "timers";

function accountForm (btnOld, btnNew) {
  if (!btnOld || !btnNew) return

  // $("[data-mobile-app-toggle] .button").click(function() {
  //   $(this)
  //     .siblings()
  //     .removeClass("is-active");
  //   $(this).addClass("is-active");
  // });

  btnOld.on('click', function () {
    // TODO
    console.log('show old')
  })

  btnNew.on('click', function () {
    // TODO
    console.log('show new')
  })
}

export default accountForm
