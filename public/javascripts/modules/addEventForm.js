import { B } from './bling'

function init (dp1, dp2) {
  if (!dp1 || !dp2) return
  const startValue = document.getElementById('start').value
  const endValue = document.getElementById('end').value
  if (!startValue || !endValue) {
    const date = new Date()
    let str = `${`0${date.getHours()}`.slice(
      -2
    )}:${`0${date.getMinutes()}`.slice(-2)}`
    document.getElementById('starttime').value = str
    document.getElementById('endtime').value = str
    // build date String
    const day = `0${date.getDate()}`.slice(-2)
    const month = `0${date.getMonth() + 1}`.slice(-2)
    str = `${date.getFullYear()}-${month}-${day}`
    dp1.value = str
    dp2.value = str
  } else {
    // Start date
    let date = new Date(startValue)
    document.getElementById('starttime').value = `${`0${date.getHours()}`.slice(
      -2
    )}:${`0${date.getMinutes()}`.slice(-2)}`
    let day = `0${date.getDate()}`.slice(-2)
    let month = `0${date.getMonth() + 1}`.slice(-2)
    let str = `${date.getFullYear()}-${month}-${day}`
    dp1.value = str
    // End date
    date = new Date(endValue)
    document.getElementById('endtime').value = `${`0${date.getHours()}`.slice(
      -2
    )}:${`0${date.getMinutes()}`.slice(-2)}`
    day = `0${date.getDate()}`.slice(-2)
    month = `0${date.getMonth() + 1}`.slice(-2)
    str = `${date.getFullYear()}-${month}-${day}`
    dp2.value = str
  }
}

function addEventForm (dp1, dp2, switchPublishEvent, occurring) {
  init(dp1, dp2)

  dp1.on('change', (e)=>{
    if (dp2.value < dp1.value) {
      console.log("la date de fin est avant la date de début")
    }
    dp2.value = dp1.value
  })

  // const time1 = document.getElementById("horloge1");
  // const time2 = document.getElementById("horloge2");
  $("#horloge1").change((e)=>{
    console.log("Hello time !")
    // console.log($(time1).val())
    $("#endtime").val(starttime.value)

  })

  const chooseocc = document.getElementById("chooseocc")
  occurring.on('change', (e)=>{
    console.log(occurring.value)
    if (occurring.value == "weeks") {
      chooseocc.innerHTML= `
      <input type="checkbox" name="day1" value="monday"> Lundi
      <input type="checkbox" name="day2" value="monday"> Mardi
      <input type="checkbox" name="day3" value="monday"> Mercredi
      <input type="checkbox" name="day4" value="monday"> Jeudi
      <input type="checkbox" name="day5" value="monday"> Vendredi
      <input type="checkbox" name="day6" value="monday"> Samedi
      <input type="checkbox" name="day7" value="monday"> Dimanche
      `
    } else {
      chooseocc.innerHTML = ``
    }
  })



  if (!switchPublishEvent) return
  let eventId = document.getElementById('id')
  if (eventId) {
    eventId = eventId.value
    const publicCheckbox = B('label.form-switch-public input')
    if (publicCheckbox) {
      const span = B('label.form-switch-public span')
      publicCheckbox.on('click', function () {
        span.innerHTML = '<strong>action en cours...</strong>'
        if (this.checked) {
          window.location = `/events/${eventId}/gopublic`
        } else {
          window.location = `/events/${eventId}/gopublic?cancel=true`
        }
      })
    }
    const publishCheckbox = B('label.form-switch-publish input')
    if (publishCheckbox) {
      const span = B('label.form-switch-publish span')
      publishCheckbox.on('click', function () {
        span.innerHTML = '<strong>action en cours...</strong>'
        if (this.checked) {
          window.location = `/events/${eventId}/publish`
        } else {
          window.location = `/events/${eventId}/publish?cancel=true`
        }
      })
    }
  }
}

export default addEventForm
