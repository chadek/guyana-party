const layout = document.getElementById("layout");
const menu = document.getElementById("menu");
const menuLink = document.getElementById("menuLink");
const content = document.getElementById("content");
content.innerHTML += `<div id="menu-overlay"></div>`;

function toggleClass(element, className) {
  const classes = element.className.split(/\s+/);
  const length = classes.length;
  for (let i = 0; i < length; i++) {
    if (classes[i] === className) {
      classes.splice(i, 1);
      break;
    }
  }
  // The className is not found
  if (length === classes.length) {
    classes.push(className);
  }
  element.className = classes.join(" ");
}

function toggleAll(e) {
  const active = "active";
  e.preventDefault();
  toggleClass(layout, active);
  toggleClass(menu, active);
  toggleClass(menuLink, active);
  toggleClass(document.getElementById("menu-overlay"), active);
}

menuLink.onclick = function(e) {
  toggleAll(e);
};

content.onclick = function(e) {
  if (menu.className.indexOf("active") !== -1) {
    toggleAll(e);
  }
};
