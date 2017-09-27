<div class="large-6 columns">
          <form action="evenement.php">
            <div class="row">
              <div class="small-12 small-centered columns" style="text-align: center">
                <h2>Créez votre évènement !</h2>
              </div>
            </div>

            <div class="row">
              <div class="large-12 columns input-group">
                <span class="input-group-label">
                  <i class="fi-clipboard-pencil size-36"></i>
                </span>
                <input class="input-group-field" type="text" placeholder="Nom d'évènement">
              </div>
            </div>

            <!-- DATETIME FLYER-->
            <div class="row">
              <div class="large-5 small-5 columns">
                <div class="input-group">
                  <span class="input-group-label">
                    <i class="fi-calendar size-36"></i>
                  </span>
                  <input type="text" class="input-group-field" value="16-06-2017" id="dp1">
                </div>
              </div>
              <div class="large-4 small-4 columns">
                <div class="input-group clockpicker" data-placement="bottom" data-align="top" data-autoclose="true">
                  <span class="input-group-label">
                    <i class="fi-clock size-36"></i>
                  </span>
                  <input type="text" class="input-group-field" value="12:21">
                </div>
              </div>
              <div class="large-3 small-3 columns">
                <label for="exampleFileUpload" class="button expanded">Flyer</label>
                <input type="file" id="exampleFileUpload" class="show-for-sr">
              </div>
            </div>

            <!-- LIEU -->
            <div class="row">
              <div class="large-9 small-8 columns">
                <div class="input-group">
                  <span class="input-group-label">
                    <i class="fi-marker size-36"></i>
                  </span>
                  <input class="input-group-field" type="text" placeholder="Nom du lieu">
                </div>
              </div>
              <div class="large-3 small-4 columns">
                <input type="submit" value="Créer" name="creation_event" class="success button expanded">
                  <!-- <i class="fi-plus size-36"></i> Créer
                </input> -->
              </div>
            </div>

            <!-- MAPS -->

            <div class="row">
              <div class="large-12 columns">
                <div id="basicMap" ></div>
                <button onclick="alert(map.getCenter().transform(projmerc, proj4326).toString())">Show position (map center)</button>
              </div>
            </div>  
          </form>
      </div>

      <script src="js/foundation.min.js"></script>
    <!-- Date Picker -->
    <!-- <script src='js/foundation-datepicker.min.js'></script> -->
    <script>
      $(function () {


        window.prettyPrint && prettyPrint();
        $('#dp1').fdatepicker({
          initialDate: '02-12-1989',
          format: 'mm-dd-yyyy',
          // keyboardNavigation: false,
          disableDblClickSelection: true,
          language : 'fr',
          leftArrow:'<<',
          rightArrow:'>>',
          closeIcon:'X',
          closeButton: true
          // autoShow: false
        });


        // implementation of disabled form fields
        var nowTemp = new Date();
        var now = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0);
        var checkin = $('#dpd1').fdatepicker({
          onRender: function (date) {
            return date.valueOf() < now.valueOf() ? 'disabled' : '';
          }
        }).on('changeDate', function (ev) {
          if (ev.date.valueOf() > checkout.date.valueOf()) {
            var newDate = new Date(ev.date)
            newDate.setDate(newDate.getDate() + 1);
            checkout.update(newDate);
          }
          checkin.hide();
          $('#dpd2')[0].focus();
        }).data('datepicker');
        var checkout = $('#dpd2').fdatepicker({
          onRender: function (date) {
            return date.valueOf() <= checkin.date.valueOf() ? 'disabled' : '';
          }
        }).on('changeDate', function (ev) {
          checkout.hide();
        }).data('datepicker');
      });
    </script>

    <!-- Clock Picker -->
    <script type="text/javascript" src="js/jquery-clockpicker.min.js"></script>
    <script type="text/javascript">
    $('.clockpicker').clockpicker()
      .find('input').change(function(){
        console.log(this.value);
      });

    </script>
    


    <script src="js/index.js"></script>
    <script>
      $(document).foundation();
    </script>