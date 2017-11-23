$(document).ready(function(){

	var pos = ol.proj.fromLonLat([-52.300900, 4.931609]) ;
	console.log(pos);

	view = new ol.View({
		center: pos,
		zoom: 13,
		maxZoom: 18,
		minZoom: 2
	});

	var baseLayer = new ol.layer.Tile({
		source: new ol.source.OSM()
	});

	var map = new ol.Map({
		target: 'map',
		controls: ol.control.defaults().extend([
			new ol.control.ScaleLine(),
			new ol.control.ZoomSlider()
		]),
		layers: [baseLayer],
		view: view
	})

	var geolocation = new ol.Geolocation({
		projection: view.getProjection(),
		tracking: true
	});

	var style = new ol.style.Style({
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
			style: style
		});

		map.addLayer(point);
		view.setCenter(position);
		view.setZoom(13);
		return false;
	});

    $.getJSON("/evenement/all", function(external) {
		$.each(external, function(i, result) {
		    
			var position = ol.proj.fromLonLat([result.longitude, result.latitude]);
			console.log(result.longitude);
			console.log(result.latitude);
			console.log(result);
			var point = new ol.layer.Vector({
				source: new ol.source.Vector({
					features: [new ol.Feature({
						geometry: new ol.geom.Point(position),
						id: result._id,
                      	user: result.user,
						name: result.name,
						date: result.date,
						heure: result.heure,
						address: result.address 
					})]
				}),
				style: style
			});
			map.addLayer(point);

		});
	});

	

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
			console.log(element)
			var coordinate = feature.getGeometry().getCoordinates();
			 var hdms = ol.coordinate.toStringHDMS(ol.proj.transform(coordinate, 'EPSG:3857', 'EPSG:4326'));
			$(element).show();
			$(element).html(

			"<div style='font-size:.8em'>"+

             	"<font size=\"4\">" + feature.get('name') +"</font>"+
              	"<br>Organisateur: <a href=\"/users/"+feature.get('user')+"\"> "+ feature.get('user')+" </a>"+
              	"<br>A "+feature.get('heure')+ " le " + feature.get('date')+
              	"<br> <a href=\"/evenement/id/"+feature.get('id')+"\"> Plus d'info </a>"+
            "</div>");
			popup.setPosition(coordinate);
		}else{
			$(element).hide();
		}
	});


});