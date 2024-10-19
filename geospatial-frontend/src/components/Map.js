
import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, GeoJSON, FeatureGroup } from 'react-leaflet'
import { EditControl } from 'react-leaflet-draw'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-draw/dist/leaflet.draw.css'

const iconUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png'
const iconRetinaUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png'
const shadowUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'

const customIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
})

export default function Map({ shapes = [], onShapeCreated, onShapeEdit, editingShape, onShapeUpdate, onShapeDelete }) {
  const [map, setMap] = useState(null)

  useEffect(() => {
    L.Marker.prototype.options.icon = customIcon
  }, [])

  useEffect(() => {
    if (map && shapes.length > 0) {
      const bounds = L.latLngBounds(shapes.map(shape => L.geoJSON(shape.data).getBounds()))
      map.fitBounds(bounds)
    }
  }, [map, shapes])

  const handleCreated = (e) => {
    const { layer } = e
    onShapeCreated(layer.toGeoJSON())
  }

  const handleEdited = (e) => {
    const { layers } = e
    layers.eachLayer((layer) => {
      onShapeUpdate({ ...editingShape, data: layer.toGeoJSON() })
    })
  }

  return (
    <MapContainer 
      center={[0, 0]} 
      zoom={2} 
      style={{ height: '400px', width: '100%' }}
      whenCreated={setMap}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {Array.isArray(shapes) && shapes.map((shape) => (
        <GeoJSON 
          key={shape.id} 
          data={shape.data} 
          onEachFeature={(feature, layer) => {
            layer.on('click', () => onShapeEdit(shape))
            layer.bindPopup(`
              <b>${shape.name || 'Unnamed Shape'}</b><br>
              <button onclick="window.deleteShape(${shape.id})">Delete</button>
            `)
          }}
        />
      ))}
      <FeatureGroup>
        <EditControl
          position="topright"
          onCreated={handleCreated}
          onEdited={handleEdited}
          draw={{
            rectangle: true,
            polygon: true,
            circle: false,
            circlemarker: false,
            marker: false,
            polyline: false,
          }}
        />
      </FeatureGroup>
    </MapContainer>
  )
}