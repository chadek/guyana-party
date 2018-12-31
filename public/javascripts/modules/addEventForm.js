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

function addEventForm (dp1, dp2, switchPublishEvent, isrec) {
  init(dp1, dp2)

  const date1 = document.getElementById("dp1")
  const date2 = document.getElementById("dp2")


  date1.addEventListener("change", (e)=>{
    // console.log("Laisse moi toucher ta date de début !")
    if (date2.value < date1.value) {
      // console.log("la date de fin est avant la date de début")
      date2.value = date1.value
      // il faut changer aussi l'heure de fin
      $("#endtime").val(starttime.value)
    } 
  })

  const clock1 = document.getElementById("horloge1")
  clock1.addEventListener("change", (e)=>{
    // console.log("Je te touche enfoiré de clock!")
    if (dp2.value > dp1.value) {
      // console.log("on ne change pas l'heure de fin")
    }else{
      // console.log("Si la date de fin en plus tot de que la date de début alors on peux changer l'heure de début")
      $("#endtime").val(starttime.value)
    }
  })

  

  const checkday = document.getElementById("checkday")

  isrec.on('change', (e)=>{
    console.log(isrec.checked)
    if (isrec.checked) {
      checkday.classList.toggle("hidden")
    } else {
      checkday.classList.toggle("hidden")
      document.getElementById("monday").checked = false
      document.getElementById("thuesday").checked = false
      document.getElementById("wednesday").checked = false
      document.getElementById("thursday").checked = false
      document.getElementById("friday").checked = false
      document.getElementById("saturday").checked = false
      document.getElementById("sunday").checked = false
      // uncheck all days

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
