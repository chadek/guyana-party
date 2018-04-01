// Because you want the $ of jQuery without the jQuery.
// based on https://gist.github.com/paulirish/12fb951a8b893a454b32

const S = document.querySelector.bind(document);
const SS = document.querySelectorAll.bind(document);

Node.prototype.on = window.on = function(name, fn) {
  this.addEventListener(name, fn);
};

NodeList.prototype.__proto__ = Array.prototype; // eslint-disable-line

NodeList.prototype.on = NodeList.prototype.addEventListener = function(name, fn) {
  this.forEach(elem => {
    elem.on(name, fn);
  });
};

export { S, SS };