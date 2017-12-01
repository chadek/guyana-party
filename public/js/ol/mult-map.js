$(document).ready(function(){
	//CONST

	// init position (centered in cayenne)
	var POS = ol.proj.fromLonLat([-52.300900, 4.931609]) ;
	console.log(POS);
	// Cluster distance (max distance between points before merging)
	var DISTANCE = 10;

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


	var test = new ol.style.Style({
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
			style: test
		});

		map.addLayer(point);
		view.setCenter(position);
		view.setZoom(13);
		return false;
	});

	// query db to get all event then store in features tab 
	var features = [];
    $.getJSON("/evenement/all", function(external) {
		$.each(external, function(i, result) {
		    
			var position = ol.proj.fromLonLat([result.longitude, result.latitude]);
			//console.log(result.longitude);
			//console.log(result.latitude);
			//console.log(result);
			
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
		clusterise()
	});

    function clusterise(){
		var source = new ol.source.Vector({
			features: features
		});

	    console.log(source)
		var clusterSource = new ol.source.Cluster({
			distance: DISTANCE,
			source: source
		});


		var styleCache = {};
		var clusters = new ol.layer.Vector({
	        source: clusterSource,
	        style: function(feature) {
	        	console.log(feature);
	            var size = feature.get('features').length;
	            var style = styleCache[size];
	            if (!style) {
	               	style = new ol.style.Style({
	                  	image: new ol.style.Circle({
	                    	radius: 10,
	                    	stroke: new ol.style.Stroke({
	                      		color: '#fff'
	                    	}),
	                    	fill: new ol.style.Fill({
	                      		color: '#3399CC'
	                    	})
	                  	}),
	                  	text: new ol.style.Text({
	                    	text: size.toString(),
	                    	fill: new ol.style.Fill({
	                      		color: '#fff'
	                    	})
	                  	})
	                });
	                styleCache[size] = style;
	            }
	            return style;
	        }
	  	});

		map.addLayer(clusters);
    }



	var element = $('#popup').get(0);

	var popup = new ol.Overlay({
		element: element,
		stopEvent: false
	});

	map.addOverlay(popup);

	map.on('click', function(evt){
		console.log("click")
		var feature = map.forEachFeatureAtPixel(evt.pixel,
			function(feature){
				return feature;
		});
		
		if (feature){
			var event = feature;
			if (feature.values_.features){

				event = feature.values_.features[0];

				var coordinate = event.getGeometry().getCoordinates();
				$(element).show();
				$(element).html(

				"<div style='font-size:.8em'>"+

	             	"<font size=\"4\">" + event.get('name') +"</font>"+
	              	"<br>Organisateur: <a href=\"/users/"+event.get('user')+"\"> "+ event.get('user')+" </a>"+
	              	"<br>A "+event.get('heure')+ " le " + event.get('date')+
	              	"<br> <a href=\"/evenement/id/"+event.get('id')+"\"> Plus d'info </a>"+
	            "</div>");
				popup.setPosition(coordinate);
			} else {
				var coordinate = event.getGeometry().getCoordinates();
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
			$(element).hide();
		}
	});


});