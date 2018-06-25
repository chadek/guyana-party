function init(dp1, dp2) {
  const startValue = document.getElementById("start").value;
  const endValue = document.getElementById("end").value;
  if (!startValue || !endValue) {
    const date = new Date();
    let str = ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2);
    document.getElementById("starttime").value = str;
    document.getElementById("endtime").value = str;
    // build date String
    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    str = `${date.getFullYear()}-${month}-${day}`;
    dp1.value = str;
    dp2.value = str;
  } else {
    // Start date
    let date = new Date(startValue);
    document.getElementById("starttime").value =
      ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2);
    let day = ("0" + date.getDate()).slice(-2);
    let month = ("0" + (date.getMonth() + 1)).slice(-2);
    let str = `${date.getFullYear()}-${month}-${day}`;
    dp1.value = str;
    // End date
    date = new Date(endValue);
    document.getElementById("endtime").value =
      ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2);
    day = ("0" + date.getDate()).slice(-2);
    month = ("0" + (date.getMonth() + 1)).slice(-2);
    str = `${date.getFullYear()}-${month}-${day}`;
    dp2.value = str;
  }
}

function addEventForm(dp1, dp2) {
  if (!dp1 || !dp2) return;
  init(dp1, dp2);
}

export default addEventForm;
