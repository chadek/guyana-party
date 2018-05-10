import { B } from "./bling";
import { axiosGet } from "./utils";
import dompurify from "dompurify";

function makeMap(mapDiv) {
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
    zoom: 6,
    maxZoom: MAXZOOM,
    minZoom: MINZOOM
  });

  // set a base layer countaining osm map
  const baseLayer = new ol.layer.Tile({
    source: new ol.source.OSM()
  });

  let point = null; // Default Point
  let pointGMT = null;
  let defaultInteractions = { mouseWheelZoom: false };

  // Events are managed, we can scroll the map
  if (!B(".no-events")) {
    defaultInteractions = { mouseWheelZoom: true };
  }

  // init map with view, layer. Add scale line at left and scale line at bottom left. Target: map div

  var timezones = new ol.layer.Vector({
    source: new ol.source.Vector({
      url: 'https://openlayers.org/en/v4.6.5/examples/data/kml/timezones.kml',
      format: new ol.format.KML({
        extractStyles: false
      })
    })
  });

  const map = new ol.Map({
    target: "map",
    controls: ol.control.defaults().extend([new ol.control.ScaleLine(), new ol.control.ZoomSlider()]),
    layers: [baseLayer,timezones],
    view: view,
    interactions: ol.interaction.defaults(defaultInteractions)
  });

  function getMarkerStyle(radius, stroke, fill) {
    return new ol.style.Style({
      image: new ol.style.Circle({
        radius: radius,
        stroke: new ol.style.Stroke(stroke),
        fill: new ol.style.Fill(fill)
      })
    });
  }

  // default marker style (blue circle)
  const defaultStyleMark = getMarkerStyle(7, { color: "#2980b9", width: 2 }, { color: "rgba(52, 152, 219, 0.5)" });

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
      style: defaultStyleMark
    });
    map.addLayer(point);
  }

  // Events are not managed, we can click the map to add points
  if (B(".no-events")) {
    map.on("click", e => {
      if (B(".readonly")) return; // the map is readonly, too bad :'(
      // get coords of cliked object
      const lonlat = e.coordinate;
      const coord = ol.proj.transform(lonlat, "EPSG:3857", "EPSG:4326");
      // remove old point
      map.removeLayer(point);
      // add new point
      point = new ol.layer.Vector({
        source: new ol.source.Vector({
          features: [
            new ol.Feature({
              geometry: new ol.geom.Point(lonlat)
            })
          ]
        }),
        style: defaultStyleMark
      });
      map.addLayer(point);

      document.getElementById("longitude").value = coord[0];
      document.getElementById("latitude").value = coord[1];

      const feature = map.forEachFeatureAtPixel(map.getEventPixel(e.originalEvent), function(feature) {
        return feature;
      });
      if (feature) {
        console.log("LOGGG OK",feature.get("name"));
        const GMT = feature.get("name").match(/([\-+]\d{2}:\d{2})$/);
        const timezone = document.getElementById("timezone");
        if(timezone) timezone.value = GMT[1];
      }
      

      
      // update coordinate fields
      

      // console.log(coord);
      // get Address from nominatim & update the value
      axiosGet(
        `https://nominatim.openstreetmap.org/reverse?format=json&lon=${coord[0].toString()}&lat=${coord[1].toString()}`,
        data => (document.getElementById("address").value = data.display_name)
      );
    });
  }

  /* ------------------------------------- */
  /* ------------Map with Events---------- */
  /* ------------------------------------- */

  if (B(".no-events")) return; // stop if we do not manage events

  /* Geolocation & search events */

  const search = B(".search__input").value;

  function geolocate() {
    navigator.geolocation.getCurrentPosition(pos => {
      const position = ol.proj.fromLonLat([pos.coords.longitude, pos.coords.latitude]);
      point = new ol.layer.Vector({
        source: new ol.source.Vector({
          features: [
            new ol.Feature({
              geometry: new ol.geom.Point(position),
              text: "Votre localisation est <br>"
            })
          ]
        }),
        style: getMarkerStyle(7, { color: "#339900", width: 2 }, { color: "#bbff99" })
      });
      map.addLayer(point);
      view.setCenter(position);
      // search geolocated events
      searchEvents(`/api/search?q=${search}&lon=${pos.coords.longitude}&lat=${pos.coords.latitude}`);
    });
  }

  const check = B("#around-check");
  if (check && check.checked) {
    geolocate();
  } else {
    searchEvents(`/api/search?q=${search}`);
  }
  check.on("click", function() {
    if (this.checked) {
      geolocate();
    } else {
      B("#around-label").innerHTML = "Autour de moi";
      map.removeLayer(point);
    }
  });

  let clusters = new ol.layer.Vector({});

  function searchEvents(url) {
    axiosGet(url, data => {
      if (data && data.items) {
        loadEvents(data.items);
      }
    });
  }

  function loadEvents(events) {
    console.log(events);
    const features = [];
    for (let i = 0, len = events.length; i < len; i++) {
      features[i] = new ol.Feature({
        geometry: new ol.geom.Point(
          ol.proj.fromLonLat([events[i].location.coordinates[0], events[i].location.coordinates[1]])
        ),
        slug: events[i].slug,
        name: events[i].name,
        author: {
          name: events[i].organism.name,
          slug: events[i].organism.slug
        },
        start: events[i].start
      });
      map.removeLayer(clusters);
      const styleCache = {};
      clusters = new ol.layer.Vector({
        source: new ol.source.Cluster({
          distance: DISTANCE,
          source: new ol.source.Vector({ features: features })
        }),
        style: feature => {
          const size = feature.get("features").length;
          let style = styleCache[size];
          console.log("features size:" + size);
          // if point merged, apply different style and display number of merged point
          if (size > 1) {
            style = getMarkerStyle(10, { color: "#fff" }, { color: "#3399CC" });
            style.setText(
              new ol.style.Text({
                text: size.toString(),
                fill: new ol.style.Fill({
                  color: "#fff"
                })
              })
            );
            styleCache[size] = style;
          } else {
            // apply style for not merged point
            style = defaultStyleMark;
            styleCache[size] = style;
          }
          return style;
        }
      });
      map.addLayer(clusters);
    }
  }

  /* Popup */

  const popupDiv = B("#popup");
  const popup = new ol.Overlay({ element: popupDiv, stopEvent: false });
  map.addOverlay(popup);

  // listen to changes in position
  //geolocation.on("change", () => geolocate());

  /* -----Geolocation button-----*/
  // Create a point with usr location on click on geolocation button.
  // B("#geolocation").on("click", () => {
  //   // geolocation = null;
  //   // // init geolocation (ask permission to usr)
  //   // geolocation = new ol.Geolocation({
  //   //   projection: view.getProjection(),
  //   //   tracking: true
  //   // });
  //   // geolocation.on('change', () => geolocate());
  //   // //geolocate();
  // });

  // generate popup content to display on click on event point
  map.on("click", e => {
    // hide all popup
    popupDiv.style.display = "none";
    // get object cliked
    const feature = map.forEachFeatureAtPixel(e.pixel, feature => feature);
    // if we clicked on some point (feature not empty)
    if (feature) {
      // get cluster
      let events = feature.get("features");
      // if object is cluster
      if (events) {
        // if no point merge display popup
        if (events.length == 1) {
          // start date format
          let start = new Date(events[0].get("start"));
          start = `Le ${("0" + start.getDate()).slice(-2)}/${("0" + start.getMonth()).slice(
            -2
          )}/${start.getFullYear()} à ${("0" + start.getHours()).slice(-2)}:${("0" + start.getMinutes()).slice(-2)}`;
          // show popup
          popup.setPosition(events[0].getGeometry().getCoordinates());
          popupDiv.innerHTML = dompurify.sanitize(`
            <div style="font-size:.8em">
              <font size="4">${events[0].get("name")}</font>
              <br>Organisateur: <a href="/organism/${events[0].get("author").slug}">${events[0].get("author").name}</a>
              <br>${start}
              <br><a href="/event/${events[0].get("slug")}">Plus d'info</a>
            </div>`);
          popupDiv.style.display = "block";
        } else if (view.getZoom() == MAXZOOM) {
          // if max zoom and steal clusterise, display popup with the event list
          let content = '<div style="font-size:.8em">';
          for (let i = 0, len = events.length; i < len; i++) {
            content += `<a href="/event/${event[i].get("slug")}">${event[i].get(
              "name"
            )}</a> organisé par <a href="/organism/${event[i].get("author").slug}">${
              event[i].get("author").name
            }</a><br>`;
          }
          popup.setPosition(event[0].getGeometry().getCoordinates());
          popupDiv.innerHTML = dompurify.sanitize(content + "</div>");
          popupDiv.style.display = "block";
        } else {
          // if point merge, zoom and center on point cluster cliked
          view.setCenter(feature.getGeometry().getCoordinates());
          view.setZoom(view.getZoom() + 3);
          popupDiv.style.display = "none";
        }
      } else {
        // display usr location popup (with coordinates)
        const coordinate = feature.getGeometry().getCoordinates();
        const hdms = ol.coordinate.toStringHDMS(ol.proj.transform(coordinate, "EPSG:3857", "EPSG:4326"));
        popup.setPosition(coordinate);
        popupDiv.innerHTML = dompurify.sanitize(`
          <div style="font-size:.8em">
            <font size="3">Votre localisation (basé sur votre adresse IP)</font>
            <br><code>${hdms}</code>
          </div>`);
        popupDiv.style.display = "block";
      }
    }
  });
}

export default makeMap;
