import axios from "axios";
import dompurify from "dompurify";
import { B } from "./bling";

function init(dp1, dp2) {
  // get current date
  const date = new Date();
  // build hours string
  let str = ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2);
  document.getElementById("starttime").value = str;
  document.getElementById("endtime").value = str;
  // build date String
  const day = ("0" + date.getDate()).slice(-2);
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  str = `${day}/${month}/${date.getFullYear()}`;
  dp1.value = str;
  dp2.value = str;
}

function initClockPicker(clockPicker) {
  if (!clockPicker) return;
  clockPicker.clockpicker();
  //.find('input').change(function(){
  //    console.log(this.value);
  //});
}

function initDatePicker(dp1, dp2) {
  window.prettyPrint && prettyPrint();
  const options = {
    format: "dd/mm/yyyy",
    disableDblClickSelection: true,
    language: "fr"
  };
  $(dp1).fdatepicker(options);
  $(dp2).fdatepicker(options);
}

function data2HTML(data, id) {
  return data.items
    .map(item => {
      if(id && item._id === id)
        return `<option value="${item._id}" selected>${item.name}</option>`;
      return `<option value="${item._id}">${item.name}</option>`;
    }).join('');
}

function initOrgaDropdown(orgasSelect) {
  if(!orgasSelect) return;
  axios
    .get(`/api/organisms`)
    .then(res => {
      if (res.data) {
        orgasSelect.innerHTML = dompurify.sanitize(data2HTML(res.data, B("#orga-id").value));
      }
    })
    .catch(err => {
      console.error(err);
    });
}

function addEventForm(clockPicker, dp1, dp2, orgasSelect) {
  if (!dp1 || !dp2) return;
  init(dp1, dp2);
  initClockPicker(clockPicker);
  initDatePicker(dp1, dp2);
  initOrgaDropdown(orgasSelect);
}

export default addEventForm;
