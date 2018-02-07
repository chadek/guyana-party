// wait for html to load before execution
$(document).ready(function(){

  	// init position (centered in cayenne)
  	var POS = ol.proj.fromLonLat([-52.300900, 4.931609]) ;

  	// View declaration (set max/min zoom and init position)
  	view = new ol.View({
  		center: POS,
  		zoom: 13,
  		maxZoom: 18,
  		minZoom: 2
  	});

  	// set a base layer countaining osm map
  	var baseLayer = new ol.layer.Tile({
  		source: new ol.source.OSM()
  	});

  	// init map with view, layer. Add scale line at left and scale line at bottom left. Target: map div
  	var map = new ol.Map({
  		target: 'map',
  		controls: ol.control.defaults().extend([
  			new ol.control.ScaleLine()
  		]),
  		layers: [baseLayer],
  		view: view
  	});

    // Marker style (blue circle)
    var style_mark = new ol.style.Style({
      image: new ol.style.Circle({
        radius: 7,
        stroke: new ol.style.Stroke({
          color: '#2980b9',
          width: 2
        }),
        fill: new ol.style.Fill({
          color: 'rgba(52, 152, 219, 0.5)'
        })
      })
    });

    // Point
    var point = new ol.layer.Vector({
      source: new ol.source.Vector({
        features: [new ol.Feature({
          geometry: new ol.geom.Point(POS)
        })]
      }),
      style: style_mark
    });

    map.addLayer(point);


    map.on('click', function(evt){
  		console.log("click")
  		// get object cliked
  		var lonlat = evt.coordinate;
      var coord = ol.proj.transform(lonlat, 'EPSG:3857', 'EPSG:4326');

      // update coordinate fields
      document.getElementById("latitude").value = coord[1];
      document.getElementById("longitude").value = coord[0];
      console.log(coord);

      //geocoding from nominatim
      var queryUrl = "http://nominatim.openstreetmap.org/reverse?format=json&lat="
          queryUrl +=  coord[1].toString();
          queryUrl += "&lon=";
          queryUrl +=  coord[0].toString();

      // get JSON from nominatim
      $.getJSON(queryUrl, function(external) {
          var output = "";
          console.log(external.address);
          $.each(external.address, function(i, result) {
              output = output.concat(result," - ");
          });
          console.log(output);
          document.getElementById("address").value = output;
      });

      // remove all point
      map.removeLayer(point);


      point = new ol.layer.Vector({
        source: new ol.source.Vector({
          features: [new ol.Feature({
            geometry: new ol.geom.Point(lonlat)
          })]
        }),
        style: style_mark
      });
      map.addLayer(point);
    });
});
