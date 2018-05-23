function init(dp1, dp2) {
  // get current date
  const date = new Date();
  // Date client
  // d = new Date()
  // Thu May 10 2018 18:41:41 GMT-0300 (-03)
  // n = d.toUTCString();
  // "Thu, 10 May 2018 21:41:41 GMT"
  //console.log("Date de MERDE! ",date);
  // build hours string
  let str = ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2);
  document.getElementById("starttime").value = str;
  document.getElementById("endtime").value = str;
  // build date String
  const day = ("0" + date.getDate()).slice(-2);
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  str = `${date.getFullYear()}-${month}-${day}`;
  dp1.value = str;
  dp2.value = str;


  const tz = date.getTimezoneOffset();
  const tzm = tz % 60;
  const tzh = tz / 60;

  timezoneh=document.getElementById("timezoneh");
  timezonem=document.getElementById("timezonem");
  if (tzh < 0) {
    if (tzh > -10){
      timezoneh.value = "+0"+tzm;
    }
    timezoneh.value = "+"+tzm;
    
  } else {
    if (tzh < 10) {
      timezoneh.value = `-0${-tzm}`;
    } else {
      timezoneh.value = `-${-tzm}`;
    }
    
  }


}

// function initClockPicker(clockPicker) {
//   if (!clockPicker) return;
//   clockPicker.clockpicker();
//   //.find('input').change(function(){
//   //    console.log(this.value);
//   //});
// }

// function initDatePicker(dp1, dp2) {
//   window.prettyPrint && prettyPrint();
//   const options = {
//     format: "dd/mm/yyyy",
//     disableDblClickSelection: true,
//     language: "fr"
//   };
//   $(dp1).fdatepicker(options);
//   $(dp2).fdatepicker(options);
// }

function addEventForm(dp1, dp2) {
  if (!dp1 || !dp2) return;
  init(dp1, dp2);
  //initClockPicker(clockPicker);
  //initDatePicker(dp1, dp2);
}

export default addEventForm;
