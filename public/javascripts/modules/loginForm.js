const showConnection = (conn, insc, b_conn, b_insc) => {
  conn.style.display = "block";
  insc.style.display = "none";
  b_conn.classList.remove("secondary");
  b_insc.classList.remove("success");
  b_conn.classList.add("success");
  b_insc.classList.add("secondary");
};

const showInscription = (conn, insc, b_conn, b_insc) => {
  conn.style.display = "none";
  insc.style.display = "block";
  b_conn.classList.remove("success");
  b_insc.classList.remove("secondary");
  b_conn.classList.add("secondary");
  b_insc.classList.add("success");
};

const loginForm = () => {
  const conn = document.getElementById("connection");
  const insc = document.getElementById("inscription");

  if (!conn || !insc) return;

  const b_conn = document.getElementById("b_connection");
  const b_insc = document.getElementById("b_inscription");

  showConnection(conn, insc, b_conn, b_insc);

  b_conn.on("click", () => showConnection(conn, insc, b_conn, b_insc));
  b_insc.on("click", () => showInscription(conn, insc, b_conn, b_insc));
};

export { showConnection, showInscription, loginForm };
