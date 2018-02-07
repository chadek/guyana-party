$(document).ready(function(){
	//CONST

	// init position (centered in cayenne)
	var POS = ol.proj.fromLonLat([-52.300900, 4.931609]) ;
	console.log(POS);
	// Cluster distance (max distance between points before merging)
	var DISTANCE = 10;
	var MAXZOOM = 20;
	var MINZOOM = 2;

	// View declaration (set max/min zoom and init position)
	var view = new ol.View({
		center: POS,
		zoom: 13,
		maxZoom: MAXZOOM,
		minZoom: MINZOOM
	});

	// set a base layer countaining osm map
	var baseLayer = new ol.layer.Tile({
		source: new ol.source.OSM()
	});

	// init map with view, layer. Add scale line at left and scale line at bottom left. Target: map div
	var map = new ol.Map({
		target: 'map',
		controls: ol.control.defaults().extend([
			new ol.control.ScaleLine(),
			new ol.control.ZoomSlider()
		]),
		layers: [baseLayer],
		view: view
	})

	// init geolocation (ask permission to usr)
	var geolocation = new ol.Geolocation({
		projection: view.getProjection(),
		tracking: true
	});

	// style applied to event point
	var style_evt = new ol.style.Style({
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
	})


	// style applied to merged event point
	var style_evt_m = new ol.style.Style({
			 image: new ol.style.Circle({
				 radius: 10,
				 stroke: new ol.style.Stroke({
						 color: '#fff'
				 }),
				 fill: new ol.style.Fill({
						 color: '#3399CC'
				 })
			 })
	 });

	// style applied to usr location point
	var style_geo = new ol.style.Style({
		image: new ol.style.Circle({
			radius: 7,
			stroke: new ol.style.Stroke({
				color: '#339900',
				width: 2
			}),
			fill: new ol.style.Fill({
				color: '#bbff99'
			})
		})
	})

	var clusters = new ol.layer.Vector({});

	// query db to get all event

	$.getJSON("/evenement/all", function(external) {
		var features = [];
		$.each(external, function(i, result) {

			var position = ol.proj.fromLonLat([result.longitude, result.latitude]);
			//console.log(result.longitude);
			//console.log(result.latitude);
			//console.log(result);
			var date = new Date();
			var date

			features[i] = new ol.Feature({
				geometry: new ol.geom.Point(position),
				id: result._id,
        user: result.user,
				name: result.name,
				date: result.date,
				heure: result.heure,
				address: result.address
			})
		});
		// Init map with events features once they are loaded
		initMap(features);
	});

  // use to wait features array to be filled
	function initMap(features){

		map.removeLayer(clusters);

		var source = new ol.source.Vector({
			features: features
		});

		var clusterSource = new ol.source.Cluster({
			distance: DISTANCE,
			source: source
		});

		var styleCache = {};
		clusters = new ol.layer.Vector({
        source: clusterSource,
        style: function(feature) {

          var size = feature.get('features').length;
          var style = styleCache[size];
        	console.log(size);
        	// style applied to cluster points
        	// if point merged, apply different style and display number of merged point
        	if (size>1) {
             	style = style_evt_m;
							style.setText( new ol.style.Text({
                  	text: size.toString(),
                  	fill: new ol.style.Fill({
                    		color: '#fff'
                  	})
                	})
							);
              styleCache[size] = style;
        	} else {
        		// apply style for not merged point
        		style = style_evt;
            styleCache[size] = style;
          }

          return style;
        }
  	});

		map.addLayer(clusters);
  }





/* ------------------------------------- */
/* ------------Event handler------------ */
/* ------------------------------------- */

	/* -----Popup----- */
	// get popup div in html
	var element = $('#popup').get(0);
	var popup = new ol.Overlay({
		element: element,
		stopEvent: false
	});

	// add popup to map
	map.addOverlay(popup);

	// generate popup content to display on click on event point
	map.on('click', function(evt){
		console.log("click")
		// get object cliked
		var feature = map.forEachFeatureAtPixel(evt.pixel,
			function(feature){
				return feature;
		});

		// if we clicked on some point (feature not empty)
		if (feature){
			// get cluster
			var event = feature.get('features');
			console.log(event)
			// if object is cluster
			if (event){
				// if no point merge display popup
				if (event.length==1){
					event = event[0];
					var coordinate = event.getGeometry().getCoordinates();

					// build date String
					var dateObj = new Date(event.get('date'));
					strDate =  "Le " + ('0' + dateObj.getDate()).slice(-2) + "-";
					strDate += ('0' + (dateObj.getMonth()+ 1)).slice(-2) + "-";
					strDate += dateObj.getFullYear();
					strDate += " à "+ ('0' + dateObj.getHours()).slice(-2) + ":";
					strDate += ('0' + dateObj.getMinutes()).slice(-2);

					$(element).show();
					$(element).html(

					"<div style='font-size:.8em'>"+
		             	"<font size=\"4\">" + event.get('name') +"</font>"+
		              	"<br>Organisateur: <a href=\"/users/"+event.get('user')+"\"> "+ event.get('user')+" </a>"+
		              	"<br>" + strDate +
		              	"<br> <a href=\"/evenement/id/"+event.get('id')+"\"> Plus d'info </a>"+
		            "</div>");
					popup.setPosition(coordinate);
				} else if (view.getZoom() == MAXZOOM){
					// if max zoom and steal clusterise, display popup with the event list
					console.log("view 1");
					var html_popup = "<div style='font-size:.8em'>"
					var coordinate = event[0].getGeometry().getCoordinates();
					event.forEach(function(element) {
						html_popup = html_popup + "<a href=\"/evenement/id/"+element.get('id')+"\">"+element.get('name')+"</a> organisé par <a href=\"/users/"+element.get('user')+"\">"+element.get('user')+"</a> <br>";
					});
					html_popup = html_popup + "</div>";
					$(element).show();
					$(element).html(html_popup);
					popup.setPosition(coordinate);

				} else {
					// if point merge, zoom and center on point cluster cliked
					view.setCenter(feature.getGeometry().getCoordinates());
					view.setZoom(view.getZoom()+3);
					$(element).hide();
				}
			} else {
				// display usr location popup (with coordinates)
				var coordinate = feature.getGeometry().getCoordinates();
				var hdms = ol.coordinate.toStringHDMS(ol.proj.transform(coordinate, 'EPSG:3857', 'EPSG:4326'));
				$(element).show();
				$(element).html(
				"<div style='font-size:.8em'>"+
	             	"<font size=\"3\"> Votre localisation (basé sur votre adresse IP)</font>"+
	              	"<br><code>" + hdms + "</code>"+
	            "</div>");
				popup.setPosition(coordinate);
			}
		}else{
			// else hide all popup
			$(element).hide();
		}
	});

	/* -----Geolocation button-----*/
	// Create a point with usr location on click on geolocation button.
	$('#geolocation').click(function(){
		var position = geolocation.getPosition();
		console.log(position)
		var point = new ol.layer.Vector({
			source: new ol.source.Vector({
				features: [new ol.Feature({
					geometry: new ol.geom.Point(position),
					text: 'Votre localisation est <br>'
				})]
			}),
			style: style_geo
		});

		map.addLayer(point);
		view.setCenter(position);
		view.setZoom(13);
		return false;
	});

	/* --------- Search engine  ---------*/
	// display event returned by the engine
	$('#recherche').click(function(){
		var queryUrl = "/evenement/find/" + document.getElementById("input_recherche").value;
		console.log(queryUrl);
		$.getJSON(queryUrl, function(external) {
			var features = [];
			$.each(external, function(i, result) {

				var position = ol.proj.fromLonLat([result.longitude, result.latitude]);
				//console.log(result.longitude);
				//console.log(result.latitude);
				//console.log(result);
				var date = new Date();
				var date

				features[i] = new ol.Feature({
					geometry: new ol.geom.Point(position),
					id: result._id,
	        user: result.user,
					name: result.name,
					date: result.date,
					heure: result.heure,
					address: result.address
				})
			});
			// Init map with events features once they are loaded
			initMap(features);
		});
	});
});
