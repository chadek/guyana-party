'use strict'

import { Feature, Map as OlMap, Overlay, View } from 'ol'
import { fromLonLat, transform } from 'ol/proj'
import { Tile, Vector as LayerVector } from 'ol/layer'
import { OSM, Vector as SourceVector, Cluster } from 'ol/source'
import { defaults as ctrlDefaults, ScaleLine, ZoomSlider } from 'ol/control'
import { defaults as interactionDefaults } from 'ol/interaction'
import { Style, Circle, Stroke, Fill, Text } from 'ol/style'
import { Point } from 'ol/geom'
import { toStringHDMS } from 'ol/coordinate'
import dompurify from 'dompurify'

const ZOOM = 14
const CLUSTER_DISTANCE = 10
const MAXZOOM = 20
const MINZOOM = 2
const RANDOM_POINTS = [
  [-52.3009, 4.931609], // Cayenne
  [-61.05878, 14.616065], // Fort-de-France
  [-61.551, 16.265], // Guadeloupe
  [55.449264, -20.873425], // Réunion
  [2.3522219, 48.856614] // Paris
]

class Map {
  constructor (params) {
    this.map = null
    this.view = null
    this.single = params.single
    this.readOnly = params.readOnly
    this.geolocate = params.geolocate
    this.target = params.target || 'map'
    this.zoom = params.zoom || ZOOM
    this.clusterDistance = params.clusterDistance || CLUSTER_DISTANCE
    this.maxZoom = params.maxZoom || MAXZOOM
    this.minZoom = params.minZoom || MINZOOM
    this.mouseWheelZoom = params.mouseWheelZoom
    this.lon = parseFloat(params.lon)
    this.lat = parseFloat(params.lat)
    this.singlePos =
      this.lon && this.lat ? fromLonLat([this.lon, this.lat]) : null
    this.singlePoint = null
    this.defaultStyleMark = null
    this.defaultPos = null
    this.randomPoints = params.randomPoints || RANDOM_POINTS
    this.init()
  }

  init () {
    // Default position
    if (this.randomPoints.length > 0) {
      this.defaultPos = fromLonLat(
        this.randomPoints[Math.floor(Math.random() * this.randomPoints.length)]
      )
    } else {
      this.defaultPos = fromLonLat(RANDOM_POINTS[0])
    }

    // Instanciate the view
    this.view = new View({
      center: this.singlePos ? this.singlePos : this.defaultPos,
      zoom: this.zoom,
      maxZoom: this.maxZoom,
      minZoom: this.minZoom
    })

    // Instanciate the map
    this.map = new OlMap({
      target: this.target,
      controls: ctrlDefaults().extend([new ScaleLine(), new ZoomSlider()]),
      layers: [
        new Tile({
          source: new OSM()
        })
      ],
      view: this.view,
      interactions: interactionDefaults({
        mouseWheelZoom: !!this.mouseWheelZoom
      })
    })

    // Default marker style (blue circle)
    this.defaultStyleMark = getMarkerStyle(
      { color: '#2980b9', width: 2 },
      { color: 'rgba(52, 152, 219, 0.5)' }
    )
  }

  singleShowPoint (callbackFn) {
    if (!this.singlePos) {
      startGeolocation(
        pos => {
          const lonlat = [pos.coords.longitude, pos.coords.latitude]
          this.addSinglePoint(fromLonLat(lonlat), callbackFn, lonlat)
        },
        // Error
        () => {
          const position = this.defaultPos
          this.addSinglePoint(
            position,
            callbackFn,
            getGPSCoords(position),
            true, // center on point
            false // hidden point
          )
        }
      )
    } else {
      this.addSinglePoint(
        this.singlePos,
        callbackFn,
        getGPSCoords(this.singlePos)
      )
    }
  }

  singleOnClick (callbackFn) {
    if (!this.single || this.readOnly) return
    this.map.on('click', e => {
      this.singlePos = e.coordinate
      // Remove old point
      this.map.removeLayer(this.singlePoint)
      // Add new point
      this.addSinglePoint(
        this.singlePos,
        callbackFn,
        getGPSCoords(this.singlePos),
        false
      )
    })
  }

  addSinglePoint (position, callbackFn, gpsCoord, center = true, show = true) {
    if (show) {
      let styleMark = this.defaultStyleMark
      if (!this.single) {
        styleMark = getMarkerStyle(
          { color: '#339900', width: 2 },
          { color: '#bbff99' }
        )
      }
      this.singlePoint = getLayerVector(position, styleMark)

      this.map.addLayer(this.singlePoint)

      if (center) this.view.setCenter(position)
    }
    callbackFn(gpsCoord, show)
  }

  showEvents (events) {
    if (!events || events.length === 0) return
    const features = []
    // Create features from events
    events.forEach(event => {
      features.push(
        new Feature({
          geometry: new Point(
            fromLonLat([
              event.location.coordinates[0],
              event.location.coordinates[1]
            ])
          ),
          slug: event.slug,
          name: event.name,
          author: {
            name: event.organism.name,
            slug: event.organism.slug
          },
          start: event.start
        })
      )
    })

    let maxSize = 0
    let focusPos = null
    const styleCache = {}

    // Create cluster from features
    const cluster = new LayerVector({
      source: new Cluster({
        distance: this.clusterDistance,
        source: new SourceVector({ features: features })
      }),
      style: feature => {
        const size = feature.get('features').length
        if (size > maxSize) {
          focusPos = feature.getGeometry().flatCoordinates
          maxSize = size
          // console.log(focusPos)
        }
        // Apply style for not merged point
        let style = this.defaultStyleMark
        // console.log('features size:' + size)
        // If points merged, apply different styles and display number of merged points
        if (size > 1) {
          style = styleCache[size]
          if (!style) {
            style = getMarkerStyle(
              { color: '#000', width: 2 },
              { color: '#3399CC' },
              10
            )
            style.setText(
              new Text({
                text: size.toString(),
                fill: new Fill({ color: '#fff' })
              })
            )
            styleCache[size] = style
          }
        }
        return style
      }
    })

    this.map.addLayer(cluster)

    // TODO: get the event when cluster is rendered, then center the position
    if (!this.singlePoint) {
      setTimeout(() => {
        this.view.setCenter(focusPos)
      }, 1000)
    }
  }

  eventsOnClick (
    popupDiv,
    onEventHTMLFn,
    onZoomMaxHTMLFn,
    userPosHTMLFn,
    callbackFn
  ) {
    // Create popup containing event info
    const popup = new Overlay({ element: popupDiv, stopEvent: false })
    this.map.addOverlay(popup)
    this.map.on('click', e => {
      // Hide the showing popup
      popupDiv.style.display = 'none'
      // Get feature clicked
      const feature = this.map.forEachFeatureAtPixel(
        e.pixel,
        feature => feature
      )
      // If we clicked on some point (feature not empty)
      if (feature) {
        // Get events from cluster
        const events = feature.get('features')
        // console.log(events)
        // If events are clustered (there are events)
        let coords
        if (events) {
          coords = events[0].getGeometry().getCoordinates()
          // console.log(this.view.getZoom(), MAXZOOM)
          if (events.length === 1) {
            // If no merge
            showPopup(popupDiv, popup, coords, onEventHTMLFn(events[0]))
          } else if (this.view.getZoom() === MAXZOOM) {
            // If max zoom and still clusterised, display popup with the event list
            showPopup(popupDiv, popup, coords, onZoomMaxHTMLFn(events))
          } else {
            // If points merged, zoom and center on point cluster clicked
            this.view.setCenter(feature.getGeometry().getCoordinates())
            this.view.setZoom(this.view.getZoom() + 3)
            popupDiv.style.display = 'none'
          }
        } else {
          // there is no events, display user location popup (with coordinates)
          coords = feature.getGeometry().getCoordinates()
          const gpsCoords = getGPSCoords(coords)
          const hdms = toStringHDMS(gpsCoords)
          showPopup(popupDiv, popup, coords, userPosHTMLFn(gpsCoords, hdms))
        }
      }
    })
  }
} // Class End

function getMarkerStyle (stroke, fill, radius = 7) {
  return new Style({
    image: new Circle({
      radius: radius,
      stroke: new Stroke(stroke),
      fill: new Fill(fill)
    })
  })
}

function getLayerVector (position, markerStyle, text = '') {
  return new LayerVector({
    source: new SourceVector({
      features: [
        new Feature({
          geometry: new Point(position),
          text
        })
      ]
    }),
    style: markerStyle
  })
}

function startGeolocation (successCallback, errorCallback) {
  navigator.geolocation.getCurrentPosition(successCallback, errorCallback)
}

// Get the GPS coordinates from ol event coordinates
function getGPSCoords (coords) {
  return transform(coords, 'EPSG:3857', 'EPSG:4326')
}

function showPopup (popupDiv, popup, coords, html) {
  popupDiv.innerHTML = dompurify.sanitize(html)
  popupDiv.style.display = 'block'
  popup.setPosition(coords)
}

export default Map
