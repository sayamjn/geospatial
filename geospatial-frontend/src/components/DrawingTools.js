import { useRef } from 'react';
import { FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';

export default function DrawingTools({ onShapeCreated }) {
  const featureGroupRef = useRef();

  const handleCreated = (e) => {
    const { layer } = e;
    onShapeCreated(layer.toGeoJSON());
  };

  return (
    <FeatureGroup ref={featureGroupRef}>
      <EditControl
        position="topright"
        onCreated={handleCreated}
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
  );
}