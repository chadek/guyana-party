import { B } from './bling'
// import { setTimeout } from "timers";

function manageOldNewButtons () {
  const btnOld = B('.btn-old')
  const btnNew = B('.btn-new')
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

function account () {
  const events = B('.account #events')
  const orgas = B('.account #orgas')
  if (!events || !orgas) return
  manageOldNewButtons()
}

export default account
