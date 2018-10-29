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

function addEventForm (dp1, dp2, switchPublishEvent, occurringType) {
  init(dp1, dp2)

  dp1.on('change', (e)=>{
    if (dp2.value < dp1.value) {
      // console.log("la date de fin est avant la date de début")
      dp2.value = dp1.value
      // il faut changer aussi l'heure de fin
      $("#endtime").val(starttime.value)
    }
    
    
  })


  $("#horloge1").change((e)=>{
    if (dp2.value > dp1.value) {
      console.log("on ne change pas l'heure de fin")
    }else{
      console.log("Si la date de fin en plus tot de que la date de début alors on peux changer l'heure de début")
      $("#endtime").val(starttime.value)
    }
  })

  const chooseocc = document.getElementById("chooseocc")
  occurringType.on('change', (e)=>{
    console.log(occurringType.value)
    if (occurringType.value == "weeks") {
      chooseocc.innerHTML= `
      <input type="checkbox" id="monday" name="occurring[days][]" value="monday"> <label for="monday">Lundi</label>
      <input type="checkbox" id="thuesday" name="occurring[days][]" value="thuesday"> <label for="thuesday">Mardi</label>
      <input type="checkbox" id="wednesday" name="occurring[days][]" value="wednesday"> <label for="wednesday">Mercredi</label>
      <input type="checkbox" id="thursday" name="occurring[days][]" value="thursday"> <label for="thursday">Jeudi</label>
      <input type="checkbox" id="friday" name="occurring[days][]" value="friday"> <label for="friday">Vendredi</label>
      <input type="checkbox" id="saturday" name="occurring[days][]" value="saturday"> <label for="saturday">Samedi</label>
      <input type="checkbox" id="sunday" name="occurring[days][]" value="sunday"> <label for="sunday">Dimanche</label>
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
