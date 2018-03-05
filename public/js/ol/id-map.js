var PLOTBYID = PLOTBYID || (function(){
	var _args = {}; // private

	function loadMap(eventData){

		//console.log(eventData);
		document.getElementById("name").innerHTML = eventData.name;
		document.getElementById("address").innerHTML = eventData.address;
		document.getElementById("description").innerHTML = eventData.description;
		console.log("/file/"+eventData.flyer);
		var div = document.createElement("div");
		div.style = "background: url('/file/"+ eventData.flyer +"'); background-size: cover; background-position: center; height: 30vh; text-align: center; display: flex; align-items: center; justify-content: center;"

		var src = document.getElementById("flyer");
		src.appendChild(div);

		console.log("Avant QUAND");

		// build date String
		var startdateObj = new Date(eventData.startdate);
		var enddateObj = new Date(eventData.enddate);

		var strDate =  "Le " + ('0' + startdateObj.getDate()).slice(-2) + "-";
		strDate += ('0' + (startdateObj.getMonth()+ 1)).slice(-2) + "-";
		strDate += startdateObj.getFullYear();
		strDate += " à "+ ('0' + startdateObj.getHours()).slice(-2) + ":";
		strDate += ('0' + startdateObj.getMinutes()).slice(-2);
		
		strDate += " jusqu au " + ('0' + enddateObj.getDate()).slice(-2) + "-";
		strDate += ('0' + (enddateObj.getMonth()+ 1)).slice(-2) + "-";
		strDate += enddateObj.getFullYear();
		strDate += " à "+ ('0' + enddateObj.getHours()).slice(-2) + ":";
		strDate += ('0' + enddateObj.getMinutes()).slice(-2);

		console.log("QUAND ? " + strDate);


		document.getElementById("date").innerHTML = strDate;


		// init event position
		var pos = ol.proj.fromLonLat([ eventData.longitude, eventData.latitude ]) ;

		// View declaration (set max/min zoom and init position)
		view = new ol.View({
			center: pos,
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

		// Create point on map
		var point = new ol.layer.Vector({
			source: new ol.source.Vector({
				features: [new ol.Feature({
					geometry: new ol.geom.Point(pos)
				})]
			}),
			style: style_mark
		});

		map.addLayer(point);
	}

	return {
		init : function(Args) {
			_args = Args;


		},
		plotEvent : function() {
			queryUrl = "/evenement/id/"+_args[0]+"/js"
			console.log(queryUrl);
			$.getJSON(queryUrl, function(external) {
				console.log(external);
				loadMap(external);
			});

		}
	};
}());
