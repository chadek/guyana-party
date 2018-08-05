import { disableScroll, enableScroll, toggleClass } from '../modules/utils'

const layout = document.getElementById('layout')
const menu = document.getElementById('menu')
const menuLink = document.getElementById('menuLink')
const content = document.getElementById('content')
content.innerHTML += `<div id="menu-overlay"></div>`

function toggleAll (e) {
  e.preventDefault()
  toggleClass(document.getElementById('menu-overlay'), 'active')
  toggleClass(document.body, 'no-scroll')
  toggleClass(layout, 'active')
  toggleClass(menu, 'active')
  toggleClass(menuLink, 'active')
}

menuLink.onclick = e => {
  toggleAll(e)
  disableScroll()
}

content.onclick = e => {
  if (menu.className.indexOf('active') !== -1) {
    toggleAll(e)
    enableScroll()
  }
}
