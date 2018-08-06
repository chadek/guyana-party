// OpenLayers imports
// doc : https://github.com/openlayers/openlayers
// doc : https://openlayers.org/en/latest/apidoc/
import { Feature, Map as OlMap, Overlay, View } from 'ol'
import { fromLonLat, transform } from 'ol/proj'
import { Tile, Vector as LayerVector } from 'ol/layer'
import { OSM, Vector as SourceVector, Cluster } from 'ol/source'
import { defaults as ctrlDefaults, ScaleLine, ZoomSlider } from 'ol/control'
import { defaults as interactionDefaults } from 'ol/interaction'
import { Style, Circle, Stroke, Fill, Text } from 'ol/style'
import { Point } from 'ol/geom'
import { toStringHDMS } from 'ol/coordinate'

const ZOOM = 14
const DISTANCE = 10
const MAXZOOM = 20
const MINZOOM = 2
const LON = -52.3009
const LAT = 4.931609

class Map {
  constructor (params) {
    this.map = null
    this.single = params.single
    this.readOnly = params.readOnly
    this.geolocate = params.geolocate
    this.target = params.target || 'map'
    this.zoom = params.zoom || ZOOM
    this.distance = params.distance || DISTANCE
    this.maxZoom = params.maxZoom || MAXZOOM
    this.minZoom = params.minZoom || MINZOOM
    this.mouseWheelZoom = params.mouseWheelZoom
    this.lon = parseFloat(params.lon) || LON
    this.lat = parseFloat(params.lat) || LAT
    this.singlePos =
      this.lon && this.lat ? fromLonLat([this.lon, this.lat]) : null
    this.geolocatePos = null
    this.defaultStyleMark = null
    this.view = new View({
      center: this.singlePos,
      zoom: this.zoom,
      maxZoom: this.maxZoom,
      minZoom: this.minZoom
    })

    this.init()
  }

  init () {
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
        mouseWheelZoom: this.mouseWheelZoom
      })
    })

    // Default marker style (blue circle)
    this.defaultStyleMark = getMarkerStyle(
      7,
      { color: '#2980b9', width: 2 },
      { color: 'rgba(52, 152, 219, 0.5)' }
    )
  }

  singleShowPoint () {
    if (!this.single) return
    startGeolocation(
      pos => {
        const position = fromLonLat([pos.coords.longitude, pos.coords.latitude])
        this.map.addLayer(
          getLayerVector(
            position,
            this.defaultStyleMark,
            'Votre localisation est <br>'
          )
        )
      },
      // Error
      () => {
        this.map.addLayer(getLayerVector(this.singlePos, this.defaultStyleMark))
      }
    )
  }

  singleOnClick (callbackFunc) {
    if (!this.single) return
    this.map.on('click', e => {
      const lonlat = e.coordinate
      const coord = transform(lonlat, 'EPSG:3857', 'EPSG:4326')
      callbackFunc(coord, '')
    })
  }
}

function getMarkerStyle (radius, stroke, fill) {
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

export default Map
