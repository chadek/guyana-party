import { S } from "./bling";

const showConnection = (conn, insc, b_conn, b_insc) => {
  S(".forgotForm").style.display = "none";
  conn.style.display = "block";
  insc.style.display = "none";
  b_conn.classList.remove("secondary");
  b_insc.classList.remove("success");
  b_conn.classList.add("success");
  b_insc.classList.add("secondary");
};

const showInscription = (conn, insc, b_conn, b_insc) => {
  S(".forgotForm").style.display = "none";
  conn.style.display = "none";
  insc.style.display = "block";
  b_conn.classList.remove("success");
  b_insc.classList.remove("secondary");
  b_conn.classList.add("secondary");
  b_insc.classList.add("success");

  document.getElementById("fileUpload").on("change", function(e) {
    this.nextSibling.textContent = `Fichier : ${e.srcElement.files[0].name}`;
  });
};

const showForgotForm = conn => {
  conn.style.display = "none";
  S(".forgotForm").style.display = "block";
};

const loginForm = forgotLink => {
  if (!forgotLink) return;

  const conn = document.getElementById("connection");
  const insc = document.getElementById("inscription");
  const b_conn = document.getElementById("b_connection");
  const b_insc = document.getElementById("b_inscription");

  showConnection(conn, insc, b_conn, b_insc);

  b_conn.on("click", () => showConnection(conn, insc, b_conn, b_insc));
  b_insc.on("click", () => showInscription(conn, insc, b_conn, b_insc));
  forgotLink.on("click", () => showForgotForm(conn));
};

export { showConnection, showInscription, loginForm };
