var PLOTBYID = PLOTBYID || (function(){
  var _args = {}; // private

  function loadMap(eventData){

    //console.log(eventData);
    document.getElementById("name").innerHTML = eventData.name;
    document.getElementById("address").innerHTML = eventData.address;
    document.getElementById("description").innerHTML = eventData.description;
    console.log("/file/"+eventData.flyer);
    var img = document.createElement("img");
    img.src = "/file/"+eventData.flyer;
    img.style = "height: 100%; width: 100%; object-fit: contain"

    var src = document.getElementById("flyer");
    src.appendChild(img);

    // build date String
    var dateObj = new Date(eventData.date);
    strDate =  "Le " + ('0' + dateObj.getDate()).slice(-2) + "-";
    strDate += ('0' + dateObj.getMonth() + 1).slice(-2) + "-";
    strDate += dateObj.getFullYear();
    strDate += " à "+ ('0' + dateObj.getHours()).slice(-2) + ":";
    strDate += ('0' + dateObj.getMinutes()).slice(-2);

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
