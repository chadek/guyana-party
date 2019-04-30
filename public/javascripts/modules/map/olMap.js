'use strict'
import 'ol/ol.css'
import './ol-custom.css'
import { Feature, Map as OlMap, Overlay, View } from 'ol'
import { fromLonLat, toLonLat } from 'ol/proj'
import { Tile, Vector as LayerVector } from 'ol/layer'
import { OSM, TileDebug, Vector as SourceVector, Cluster } from 'ol/source'
import { defaults as ctrlDefaults, ScaleLine, ZoomSlider } from 'ol/control'
import { defaults as interactionDefaults } from 'ol/interaction'
import { Style, Circle, Stroke, Fill, Text } from 'ol/style'
import { Point, LineString } from 'ol/geom'
import { toStringHDMS } from 'ol/coordinate'
import dompurify from 'dompurify'

const ZOOM = 14
const CLUSTER_DISTANCE = 10
const MAXZOOM = 20
const MINZOOM = 2
const RANDOM_POINTS = [
  [-52.3009, 4.931609], // Cayenne
  [-61.05878, 14.616065], // Fort-de-France
  [-61.534042, 16.237687], // Point-à-Pitre
  [55.455054, -20.89066], // Saint-Denis (Réunion)
  [2.3522219, 48.856614], // Paris
  [45.2282, -12.7812] // Mamoudzou (Mayotte)
]

class Map {
  constructor (params) {
    this.map = null
    this.view = null
    this.single = params.single
    this.readOnly = params.readOnly
    this.target = params.target || 'map'
    this.zoom = params.zoom || ZOOM
    this.clusterDistance = params.clusterDistance || CLUSTER_DISTANCE
    this.layers = []
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
    this.debug = params.debug
    this.init()
  }

  init () {
    this.setDefaultRandomPosition()

    this.view = new View({
      center: this.singlePos ? this.singlePos : this.defaultPos,
      zoom: this.zoom,
      maxZoom: this.maxZoom,
      minZoom: this.minZoom
    })

    const source = new OSM({ crossOrigin: null })

    // The default layers (add a debug tile layer in debug mode)
    const layers = [new Tile({ source })]
    if (this.debug) {
      layers.push(
        new Tile({
          source: new TileDebug({
            projection: 'EPSG:3857',
            tileGrid: source.getTileGrid()
          })
        })
      )
    }

    // Instanciate the map
    this.map = new OlMap({
      target: this.target,
      controls: ctrlDefaults().extend([new ScaleLine(), new ZoomSlider()]),
      loadTilesWhileInteracting: true, // loading tiles while dragging/zooming
      layers,
      view: this.view,
      interactions: interactionDefaults({
        mouseWheelZoom: !!this.mouseWheelZoom
      })
    })

    if (this.debug) {
      console.log(
        'Default Position:',
        this.singlePos ? this.singlePos : this.defaultPos
      )
      console.log(this.map)
    }

    // Default marker style (blue circle)
    this.defaultStyleMark = getMarkerStyle(
      { color: '#2980b9', width: 2 },
      { color: 'rgba(52, 152, 219, 0.5)' }
    )
  } // Init End

  setDefaultRandomPosition () {
    if (this.randomPoints && this.randomPoints.length > 0) {
      this.defaultPos = fromLonLat(
        this.randomPoints[Math.floor(Math.random() * this.randomPoints.length)]
      )
    } else {
      this.defaultPos = fromLonLat(RANDOM_POINTS[0])
    }
  }

  goAround (callbackFn) {
    startGeolocation(
      pos => {
        const lonlat = [pos.coords.longitude, pos.coords.latitude]
        this.addSinglePoint(fromLonLat(lonlat), callbackFn, lonlat)
      },
      () => callbackFn(toLonLat(this.defaultPos), true, true) // Error
    )
  }

  goRandom (callbackFn) {
    this.setDefaultRandomPosition()
    const position = this.defaultPos
    this.addSinglePoint(
      position,
      callbackFn,
      toLonLat(position),
      true, // center on point
      false // hidden point
    )
    this.view.setCenter(position)
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
            toLonLat(position),
            true, // center on point
            false // hidden point
          )
        }
      )
    } else {
      this.addSinglePoint(this.singlePos, callbackFn, toLonLat(this.singlePos))
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
        toLonLat(this.singlePos),
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
      // this.layers.push(this.singlePoint)

      if (center) this.view.setCenter(position)
    }
    callbackFn(gpsCoord, show)
  }

  onMove (callbackFn) {
    this.map.on('moveend', e => {
      // this.map.getLayers().forEach(layer => {
      //   console.log(layer.getSource().getState(), layer.getVisible())
      // })
      // Remove existing layers
      this.layers.forEach(layer => this.map.removeLayer(layer))
      this.layers = []
      // Get center position
      const center = this.view.getCenter()
      // Get half of the width of the map div and
      //  get the letf border coordinates from pixel position
      const half = document.getElementById(`${this.target}`).offsetWidth / 2
      const border = this.map.getCoordinateFromPixel([half, 0])
      // Calculate the distance between center and border to get approximate radius
      const distance = distanceBetweenPoints(center, border)
      callbackFn(toLonLat(center), distance)
    })
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
    this.layers.push(cluster)

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
          const gpsCoords = toLonLat(coords)
          const hdms = this.getGPSToHDMS(gpsCoords)
          showPopup(popupDiv, popup, coords, userPosHTMLFn(gpsCoords, hdms))
        }
      }
    })
  }

  /** Get a geographic coordinate with the hemisphere, degrees, minutes, and seconds. */
  getGPSToHDMS (gps) {
    return toStringHDMS(gps)
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

function showPopup (popupDiv, popup, coords, html) {
  popupDiv.innerHTML = dompurify.sanitize(html)
  popupDiv.style.display = 'block'
  popup.setPosition(coords)
}

function distanceBetweenPoints (lonlat1, lonlat2) {
  const line = new LineString([lonlat1, lonlat2])
  return Math.round(line.getLength() * 100) / 100
}

export default Map
