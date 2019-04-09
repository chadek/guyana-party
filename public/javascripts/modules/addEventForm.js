import { b } from './bling'

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

  //- TEST des dates 
  dp1.on('change', e => {
    if(dp2.value < dp1.value){
      dp2.value = dp1.value
      console.log("Endvalue " + endValue)
    }
  })
  
  dp2.on("change", e => {
    if(dp2.value < dp1.value){
      dp1.value = dp2.value
    }
  })
}

function addEventForm (dp1, dp2, switchPublishEvent) {
  init(dp1, dp2)
  const checkday = document.getElementById("checkday")
  if (!checkday)return

  const checkrec = document.getElementById("isrec")
  if (!checkrec)return
  // console.log(checkrec)

  // const chronictime = document.getElementById("chronictime")
  // const pointtime = document.getElementById("pointtime")

  // if (checkrec.checked){
  //   chronictime.classList.remove("hidden")
  //   pointtime.classList.add("hidden")
  // }else{
  //   chronictime.classList.add("hidden")
  //   pointtime.classList.remove("hidden")
  // }



  checkrec.on('change', (e)=>{
    if (checkrec.checked){
      checkday.classList.toggle("hidden")
      // chronictime.classList.toggle("hidden")
      // pointtime.classList.toogle("hidden")
    }else{
      checkday.classList.toggle("hidden")
      // pointtime.classList.toogle("hidden")
      // chronictime.classList.toogle("hidden")
      document.getElementById("monday").checked = false
      document.getElementById("tuesday").checked = false
      document.getElementById("wednesday").checked = false
      document.getElementById("thursday").checked = false
      document.getElementById("friday").checked = false
      document.getElementById("saturday").checked = false
      document.getElementById("sunday").checked = false
      // unchecked all to not save it
    }
  })

  if (!switchPublishEvent) return
  let eventId = document.getElementById('id')
  if (eventId) {
    eventId = eventId.value
    const publicCheckbox = b('label.form-switch-public input')
    if (publicCheckbox) {
      const span = b('label.form-switch-public span')
      publicCheckbox.on('click', function () {
        span.innerHTML = '<strong>action en cours...</strong>'
        if (publicCheckbox.checked) {
          window.location = `/events/${eventId}/gopublic`
        } else {
          window.location = `/events/${eventId}/gopublic?cancel=true`
        }
      })
    }
    const publishCheckbox = b('label.form-switch-publish input')
    if (publishCheckbox) {
      const span = b('label.form-switch-publish span')
      publishCheckbox.on('click', function () {
        span.innerHTML = '<strong>action en cours...</strong>'
        if (publishCheckbox.checked) {
          window.location = `/events/${eventId}/publish`
        } else {
          window.location = `/events/${eventId}/publish?cancel=true`
        }
      })
    }
  }
}

export default addEventForm
