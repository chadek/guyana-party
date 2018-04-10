import { B } from "./bling";
import { axiosGet } from "./utils";

export function makeMap(mapDiv) {
  if (!mapDiv) return;

  // init default positions
  let lon = B("#longitude");
  let lat = B("#latitude");
  let pos = ol.proj.fromLonLat([-52.3009, 4.931609]); // centered in cayenne
  let showDefaultPoint = false;
  if (lon && lat && lon.value && lat.value) {
    lon = parseFloat(lon.value);
    lat = parseFloat(lat.value);
    if (lon && lat) {
      pos = ol.proj.fromLonLat([lon, lat]);
      showDefaultPoint = true;
    }
  }

  const DISTANCE = 10;
  const MAXZOOM = 20;
  const MINZOOM = 2;

  // View declaration (set max/min zoom and init position)
  const view = new ol.View({
    center: pos,
    zoom: 14,
    maxZoom: MAXZOOM,
    minZoom: MINZOOM
  });

  // set a base layer countaining osm map
  const baseLayer = new ol.layer.Tile({
    source: new ol.source.OSM()
  });

  let defaultInteractions = { mouseWheelZoom: false };
  let geolocation = null;

  // Events are managed
  if (!B(".no-events")) {
    defaultInteractions = { mouseWheelZoom: true };

    // init geolocation (ask permission to usr)
    geolocation = new ol.Geolocation({
      projection: view.getProjection(),
      tracking: true
    });
  }

  // init map with view, layer. Add scale line at left and scale line at bottom left. Target: map div
  const map = new ol.Map({
    target: "map",
    controls: ol.control.defaults().extend([new ol.control.ScaleLine(), new ol.control.ZoomSlider()]),
    layers: [baseLayer],
    view: view,
    interactions: ol.interaction.defaults(defaultInteractions)
  });

  //----------------- MARKER STYLES -------------------
  // default marker style (blue circle)
  const default_style_mark = new ol.style.Style({
    image: new ol.style.Circle({
      radius: 7,
      stroke: new ol.style.Stroke({
        color: "#2980b9",
        width: 2
      }),
      fill: new ol.style.Fill({
        color: "rgba(52, 152, 219, 0.5)"
      })
    })
  });
  //-----------

  // Default Point
  let point = null;

  if (showDefaultPoint) {
    // Create point on map
    point = new ol.layer.Vector({
      source: new ol.source.Vector({
        features: [
          new ol.Feature({
            geometry: new ol.geom.Point(pos)
          })
        ]
      }),
      style: default_style_mark
    });
    map.addLayer(point);
  }

  map.on("click", function(e) {
    if (B(".readonly")) return;
    // get object cliked
    const lonlat = e.coordinate;
    const coord = ol.proj.transform(lonlat, "EPSG:3857", "EPSG:4326");

    // remove old point
    map.removeLayer(point);

    point = new ol.layer.Vector({
      source: new ol.source.Vector({
        features: [
          new ol.Feature({
            geometry: new ol.geom.Point(lonlat)
          })
        ]
      }),
      style: default_style_mark
    });
    map.addLayer(point);

    // update coordinate fields
    document.getElementById("longitude").value = coord[0];
    document.getElementById("latitude").value = coord[1];
    console.log(coord);

    // get Address from nominatim
    axiosGet(
      `http://nominatim.openstreetmap.org/reverse?format=json&lon=${coord[0].toString()}&lat=${coord[1].toString()}`,
      data => (document.getElementById("address").value = data.display_name)
    );
  });
}

//export default makeMap;
