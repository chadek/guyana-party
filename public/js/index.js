$(document).foundation();


window.prettyPrint && prettyPrint();
$('#dp1').fdatepicker({
  format: 'dd-mm-yyyy',
  disableDblClickSelection: true
});
$('#dp2').fdatepicker({
  closeButton: true
});
$('#dp3').fdatepicker();
$('#dpt').fdatepicker({
  format: 'mm-dd-yyyy hh:ii',
  disableDblClickSelection: true,
  language: 'vi',
  pickTime: true
});
// datepicker limited to months
$('#dpMonths').fdatepicker();
// implementation of custom elements instead of inputs
var startDate = new Date(2012, 1, 20);
var endDate = new Date(2012, 1, 25);
$('#dp4').fdatepicker()
  .on('changeDate', function (ev) {
  if (ev.date.valueOf() > endDate.valueOf()) {
    $('#alert').show().find('strong').text('The start date can not be greater then the end date');
  } else {
    $('#alert').hide();
    startDate = new Date(ev.date);
    $('#startDate').text($('#dp4').data('date'));
  }
  $('#dp4').fdatepicker('hide');
});
$('#dp5').fdatepicker()
  .on('changeDate', function (ev) {
  if (ev.date.valueOf() < startDate.valueOf()) {
    $('#alert').show().find('strong').text('The end date can not be less then the start date');
  } else {
    $('#alert').hide();
    endDate = new Date(ev.date);
    $('#endDate').text($('#dp5').data('date'));
  }
  $('#dp5').fdatepicker('hide');
});
