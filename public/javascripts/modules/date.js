function initDates (start, end) {
  if (!start || !end) return
  start = new Date(start.value)
  end = new Date(end.value)
  // build hours
  let str =
    ('0' + start.getHours()).slice(-2) +
    ':' +
    ('0' + start.getMinutes()).slice(-2)
  document.getElementById('starttime').value = str
  str =
    ('0' + end.getHours()).slice(-2) + ':' + ('0' + end.getMinutes()).slice(-2)
  document.getElementById('endtime').value = str
  // build dates
  let day = ('0' + start.getDate()).slice(-2)
  let month = ('0' + (start.getMonth() + 1)).slice(-2)
  document.getElementById(
    'startdate'
  ).value = `${day}/${month}/${start.getFullYear()}`
  day = ('0' + end.getDate()).slice(-2)
  month = ('0' + (end.getMonth() + 1)).slice(-2)
  document.getElementById(
    'enddate'
  ).value = `${day}/${month}/${end.getFullYear()}`
}

export default initDates
