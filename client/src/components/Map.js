import L from 'leaflet'
import { MarkerClusterGroup } from 'leaflet.markercluster'
import { gpsCoords } from '../lib/utils'
import { formatPlage } from '../lib/date'
import { showSnack } from './Snack'

const POINTS = [
  [4.931609, -52.3009], // Cayenne
  [14.616065, -61.05878], // Fort-de-France
  [16.237687, -61.534042], // Point-à-Pitre
  [-20.89066, 55.455054], // Saint-Denis (Réunion)
  [48.856614, 2.3522219], // Paris
  [-12.7812, 45.2282] // Mamoudzou (Mayotte)
]

class Map {
  constructor(locate, id) {
    this.mapId = id || 'map'
    this.map = null
    this.markerClusterGroup = new MarkerClusterGroup()
    this.center = [4.931609, -52.3009] // Cayenne
    this.zoom = 14
    this.locateCircle = null
    this.isSingle = false
    this.singleMarker = null
    this.noRandom = false
    this.islocateDenied = false
    this.viewActions = {}
    this.search = ''
    this.init()
    if (locate) this.locate(false)
  }

  init() {
    this.map = L.map(this.mapId, {
      center: this.center,
      zoom: this.zoom,
      zoomControl: false, // remove default zoom control
      layers: [
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://openstreetmap.org/copyright">Contributeurs de OpenStreetMap</a>',
          minZoom: 3,
          maxZoom: 19
        })
      ]
    })
      .on('moveend', () => !this.isSingle && this.showMarkers())
      .on('locationfound', ({ latlng, accuracy }) => {
        console.log('My position:', { lat: latlng.lat, lng: latlng.lng })
        if (this.locateCircle) this.map.removeLayer(this.locateCircle)
        this.locateCircle = L.circle(latlng, {
          color: '#dadce0',
          fillColor: '#fff',
          fillOpacity: 0.3,
          radius: accuracy
        })
        this.map.addLayer(this.locateCircle)
        // .bindPopup('Vous êtes situé(e) approximativement dans cette zone.')
        // .openPopup()
      })
      .on('locationerror', ({ message }) => {
        console.log(message)
        this.islocateDenied = true
        // if (!this.noRandom) this.random()
        this.random()
      })

    L.control.zoom({ zoomInTitle: 'Zoom +', zoomOutTitle: 'Zoom -' }).addTo(this.map)
  }

  locate = (noRandom = true) => {
    this.noRandom = noRandom
    this.map.locate({ setView: true, maxZoom: 16 })
  }

  random = () => {
    const pos = POINTS[Math.floor(Math.random() * POINTS.length)]
    this.map.setView(pos, this.zoom)
    console.log('Random position:', { lat: pos[0], lng: pos[1] })
  }

  initSingle = onClick => {
    this.isSingle = true
    if (typeof onClick !== 'function') return
    this.map.on('click', ({ latlng }) => {
      console.log('Marker position:', { lat: latlng.lat, lng: latlng.lng })
      if (this.singleMarker) this.map.removeLayer(this.singleMarker)
      this.singleMarker = L.marker(latlng, {
        title: `Coordonnées : ${latlng.lat}, ${latlng.lng}`
      })
      this.map.addLayer(this.singleMarker)
      this.map.setView(latlng)
      onClick(latlng)
    })
  }

  initSingleMarker = (coords, viewOffset = 0, zoom = this.zoom) => {
    if (!this.singleMarker && coords && coords.length === 2) {
      console.log('Marker position:', { lat: coords[1], lng: coords[0] })
      this.singleMarker = L.marker(
        { lat: coords[1], lng: coords[0] },
        { title: `Coordonnées : ${coords[1]}, ${coords[0]}` }
      )
      this.map.addLayer(this.singleMarker)
      this.map.setView([coords[1], coords[0] - viewOffset], zoom)
    }
  }

  initMarkers = actions => {
    this.viewActions = actions
    const searchInput = document.querySelector('.search_bg')
    if (searchInput) {
      searchInput.addEventListener('search', ({ target: { value } }) => {
        this.search = value
        this.showMarkers(value)
      })
    }
  }

  showMarkers = (search = this.search) => {
    this.viewActions.setLoading(true)
    this.viewActions.requestMarkers(
      { search, box: this.box },
      markers => {
        try {
          this.viewActions.setMarkers(markers)
          this.viewActions.setLoading(false)
          this.markerClusterGroup.clearLayers()
          markers.forEach(marker => {
            const { name, location, group, startDate, endDate, slug } = marker
            const latlng = {
              lat: location.coordinates[1],
              lng: location.coordinates[0]
            }
            if (!group) return showSnack(`Groupe absent pour ${slug}`, 'error')
            const newMarker = L.marker(latlng, {
              title: `${name} par ${group.name}`
            }).bindPopup(`
              <p>
                <a href='/event/${slug}'><strong>${name}</strong></a><br /><br />
                Organisateur: <a href='/group/${group.slug}'><i>${group.name}</i></a><br /><br />
                <i>${formatPlage({ startDate, endDate }, true)}</i><br /><br />
                <code style="font-size:12px;">${gpsCoords(latlng.lat, latlng.lng)}</code>
              </p>
            `)
            newMarker.on('click', () => {
              this.viewActions.onMarkerClick(marker)
            })
            this.markerClusterGroup.addLayer(newMarker)
          })
          this.map.addLayer(this.markerClusterGroup)
        } catch (error) {
          console.error(error)
          this.viewActions.setLoading(false)
        }
      },
      error => {
        console.log(error)
        this.viewActions.setLoading(false)
        showSnack('Une erreur interne est survenue!', 'error')
      }
    )
  }

  get box() {
    const {
      _southWest: { lng: x1, lat: y1 },
      _northEast: { lng: x2, lat: y2 }
    } = this.map.getBounds()
    return [
      [x1, y1],
      [x2, y2]
    ]
  }

  get actions() {
    return {
      locate: this.locate,
      random: this.random,
      isDenied: () => this.islocateDenied
    }
  }
}

export default Map
