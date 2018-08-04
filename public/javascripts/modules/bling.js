// Because you want the $ of jQuery without the jQuery
// based on https://gist.github.com/paulirish/12fb951a8b893a454b32

const B = document.querySelector.bind(document)
const BB = document.querySelectorAll.bind(document)

/* eslint-disable no-undef */
Node.prototype.on = window.on = function (name, fn) {
  this.addEventListener(name, fn)
}

// NodeList.prototype.__proto__ = Array.prototype
Object.setPrototypeOf(NodeList.prototype, Array.prototype)

NodeList.prototype.on = NodeList.prototype.addEventListener = function (
  name,
  fn
) {
  this.forEach(elem => {
    elem.on(name, fn)
  })
}
/* eslint-enable no-undef */

export { B, BB }
