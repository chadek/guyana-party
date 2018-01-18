var PLOTBYID = PLOTBYID || (function(){
  var _args = {}; // private

  return {
    init : function(Args) {
      _args = Args;
      // some other initialising
    },
    plotEvent : function() {
      console.log(_args[0], _args[1]);
    	// init event position
    	var pos = ol.proj.fromLonLat([ _args[0], _args[1] ]) ;

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
  };
}());
/*
// http://harrywood.co.uk/maps/examples/openlayers/marker-array.view.html
var markers = new OpenLayers.Layer.Markers( "Markers" );

map = new OpenLayers.Map("mapdiv");
map.addLayer(markers);
map.addLayer(new OpenLayers.Layer.OSM());

epsg4326 =  new OpenLayers.Projection("EPSG:4326"); //WGS 1984 projection
projectTo = map.getProjectionObject(); //The map projection (Spherical Mercator)

var lonlat = new OpenLayers.LonLat( <%= event.longitude %>, <%= event.latitude %> ).transform(epsg4326, projectTo);

markers.addMarker(new OpenLayers.Marker(lonlat));

var zoom=14;
map.setCenter (lonlat, zoom);*/
