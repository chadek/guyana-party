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

  const getMarkerStyle = function(radius, stroke, fill) {
    return new ol.style.Style({
      image: new ol.style.Circle({
        radius: radius,
        stroke: new ol.style.Stroke(stroke),
        fill: new ol.style.Fill(fill)
      })
    });
  };

  // default marker style (blue circle)
  const defaultStyleMark = getMarkerStyle(7, { color: "#2980b9", width: 2 }, { color: "rgba(52, 152, 219, 0.5)" });

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
      style: defaultStyleMark
    });
    map.addLayer(point);
  }

  if (B(".no-events")) {
    map.on("click", e => {
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
        style: defaultStyleMark
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

  /* ------------------------------------- */
  /* ------------Map with Events---------- */
  /* ------------------------------------- */

  if (B(".no-events")) return; // stop if we do not manage events

  let clusters = new ol.layer.Vector({});

  const search = B(".search__input").value;
  // query db to get events
  axiosGet(`/api/search?q=${search}&orga=1`, data => {
    if (data && data.items) {
      loadEvents(data.items);
    }
  });

  const loadEvents = function(events) {
    console.log(events);
    const features = [];
    for (let i = 0, len = events.length; i < len; i++) {
      console.log(events[i]);
      axiosGet(`/api/search/orga/${events[i].organism}`, data => {
        if (data) {
          features[i] = new ol.Feature({
            geometry: new ol.geom.Point(
              ol.proj.fromLonLat([events[i].location.coordinates[0], events[i].location.coordinates[1]])
            ),
            slug: events[i].slug,
            name: events[i].name,
            author: {
              name: data.name,
              slug: data.slug
            },
            start: events[i].start,
            end: events[i].end,
            photo: events[i].photo
          });
        }
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
            console.log(size);
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
      });
    }
  };

  /* -----Popup----- */
  const popupDiv = B("#popup");
  const popup = new ol.Overlay({ element: popupDiv, stopEvent: false });
  map.addOverlay(popup);

  /* -----Geolocation button-----*/
  // Create a point with usr location on click on geolocation button.
  B("#geolocation").on("click", () => {
    const position = geolocation.getPosition();
    if (!position) return;
    const point = new ol.layer.Vector({
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
    view.setZoom(13);
  });

  // generate popup content to display on click on event point
  map.on("click", e => {
    // hide all popup
    popupDiv.style.display = "none";
    // get object cliked
    const feature = map.forEachFeatureAtPixel(e.pixel, feature => feature);
    // if we clicked on some point (feature not empty)
    if (feature) {
      // get cluster
      let event = feature.get("features");
      // if object is cluster
      if (event) {
        // if no point merge display popup
        if (event.length == 1) {
          event = event[0];

          // dateObj = new Date(event.get('date'));
          // console.log(dateObj)

          popup.setPosition(event.getGeometry().getCoordinates());
          popupDiv.innerHTML = dompurify.sanitize(`
            <div style="font-size:.8em">
              <font size="4">${event.get("name")}</font>
              <br>Organisateur: <a href="/organism/${event.get("author").slug}">${event.get("author").name}</a>
              <br> date
              <br><a href="/event/${event.get("slug")}">Plus d'info</a>
            </div>`);
          popupDiv.style.display = "block";
        }
      }
    }
  });
}

export default makeMap;
