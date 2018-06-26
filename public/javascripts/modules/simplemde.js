const mdArea = document.getElementById("md");
if (mdArea) {
  if (!mdArea.classList.contains("readonly")) {
    const SimpleMDE = require("simplemde");
    new SimpleMDE({
      element: mdArea,
      placeholder: "Un petit wiki pour décrire proprement l'évènement"
    });
  } else {
    const marked = require("marked");
    mdArea.innerHTML = marked(mdArea.innerHTML);
  }
}
