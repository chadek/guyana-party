import axios from 'axios'
import dompurify from 'dompurify'

function axiosGet (url, callback) {
  axios
    .get(url)
    .then(res => callback(res.data))
    .catch(err => console.error(err))
}

function data2HTML (data, formatFn, concatFormat) {
  if (!data.items) return ''
  const rawHTML = data.items
    .map(item => formatFn(item))
    .join('')
    .concat(concatFormat)
  return dompurify.sanitize(rawHTML)
}

function formatDateTime (isoDate, fr = true, separator = '/') {
  if (!isoDate) return
  isoDate = new Date(isoDate)
  const time =
    ('0' + isoDate.getHours()).slice(-2) +
    ':' +
    ('0' + isoDate.getMinutes()).slice(-2)
  const day = ('0' + isoDate.getDate()).slice(-2)
  const month = ('0' + (isoDate.getMonth() + 1)).slice(-2)
  let date = ''
  if (fr) {
    date = `${day}${separator}${month}${separator}${isoDate.getFullYear()}`
  } else {
    date = `${isoDate.getFullYear()}${separator}${month}${separator}${day}`
  }
  return { time, date }
}

function toggleClass (element, className) {
  const classes = element.className.split(/\s+/)
  const length = classes.length
  for (let i = 0; i < length; i++) {
    if (classes[i] === className) {
      classes.splice(i, 1)
      break
    }
  }
  // The className is not found
  if (length === classes.length) {
    classes.push(className)
  }
  element.className = classes.join(' ')
}

// left: 37, up: 38, right: 39, down: 40, spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
const scrollKeys = {
  37: 1,
  38: 1,
  39: 1,
  40: 1,
  32: 1,
  33: 1,
  34: 1,
  35: 1,
  36: 1
}

function preventDefault (e) {
  e = e || window.event
  if (e.preventDefault) e.preventDefault()
  e.returnValue = false
}

function preventDefaultForScrollKeys (e) {
  if (scrollKeys[e.keyCode]) {
    preventDefault(e)
    return false
  }
}

function disableScroll () {
  if (window.addEventListener) {
    // older FF
    window.addEventListener('DOMMouseScroll', preventDefault, false)
  }
  window.onwheel = preventDefault // modern standard
  window.onmousewheel = document.onmousewheel = preventDefault // older browsers, IE
  window.ontouchmove = preventDefault // mobile
  document.onkeydown = preventDefaultForScrollKeys
}

function enableScroll () {
  if (window.removeEventListener) {
    window.removeEventListener('DOMMouseScroll', preventDefault, false)
  }
  window.onmousewheel = document.onmousewheel = null
  window.onwheel = null
  window.ontouchmove = null
  document.onkeydown = null
}

function sliceStr (str, limit = 20) {
  return str.length > limit ? `${str.slice(0, limit)} ...` : str
}

export {
  axiosGet,
  data2HTML,
  formatDateTime,
  toggleClass,
  preventDefault,
  preventDefaultForScrollKeys,
  disableScroll,
  enableScroll,
  sliceStr
}
