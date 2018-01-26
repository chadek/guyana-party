$(document).ready(function(){
  //get current date
  var date = new Date();

  //build hours string
  //add 0 before first digit wheras time could look like this 17:1
  var str = ('0' + date.getHours()).slice(-2) + ":";
     str += ('0' + date.getMinutes()).slice(-2);
  document.getElementById("heure").value = str;

  // build date String
  str = date.getFullYear() + "-";
  str += ('0' + date.getMonth() + 1).slice(-2) + "-";
  str +=  ('0' + date.getDate()).slice(-2);

  document.getElementById("dp1").value = str;

  /*TODO verifier les champs remplis par l'utilisateur avant
  envoie vers DB*/
});
