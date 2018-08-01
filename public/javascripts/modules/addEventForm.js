import { B } from './bling'

function init (dp1, dp2) {
  if (!dp1 || !dp2) return
  const startValue = document.getElementById('start').value
  const endValue = document.getElementById('end').value
  if (!startValue || !endValue) {
    const date = new Date()
    let str = `${`0${date.getHours()}`.slice(-2)}:${`0${date.getMinutes()}`.slice(-2)}`
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

function addEventForm (dp1, dp2, switchPublishEvent) {
  init(dp1, dp2)
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
