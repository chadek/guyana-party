import axios from "axios";
import { B } from "./bling";

function loadEvents() {}

function makeMap(mapDiv) {
  if (!mapDiv) return;

  // init position (centered in cayenne)
  const POS = ol.proj.fromLonLat([-52.3009, 4.931609]);

  // View declaration (set max/min zoom and init position)
  const view = new ol.View({
    center: POS,
    zoom: 13,
    maxZoom: 18,
    minZoom: 2
  });

  // set a base layer countaining osm map
  const baseLayer = new ol.layer.Tile({
    source: new ol.source.OSM()
  });

  // init map with view, layer. Add scale line at left and scale line at bottom left. Target: map div
  const map = new ol.Map({
    target: "map",
    controls: ol.control.defaults().extend([new ol.control.ScaleLine()]),
    layers: [baseLayer],
    view: view
  });

  // Marker style (blue circle)
  const style_mark = new ol.style.Style({
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

  // Default Point
  let point = null;

  map.on("click", function(e) {
    // get object cliked
    const lonlat = e.coordinate;
    const coord = ol.proj.transform(lonlat, "EPSG:3857", "EPSG:4326");

    // remove all point
    map.removeLayer(point);

    point = new ol.layer.Vector({
      source: new ol.source.Vector({
        features: [
          new ol.Feature({
            geometry: new ol.geom.Point(lonlat)
          })
        ]
      }),
      style: style_mark
    });
    map.addLayer(point);

    // update coordinate fields
    document.getElementById("longitude").value = coord[0];
    document.getElementById("latitude").value = coord[1];
    console.log(coord);

    // get Address from nominatim
    axios
      .get(
        `http://nominatim.openstreetmap.org/reverse?format=json&lon=${coord[0].toString()}&lat=${coord[1].toString()}`
      )
      .then(res => {
        const a = res.data.address;
        document.getElementById("address").value = `${a.house_number}, ${a.road}, ${a.neighbourhood}, ${a.postcode} ${
          a.town
        }, ${a.state}, ${a.country}`;
      })
      .catch(console.error);
  });
}

export default makeMap;
