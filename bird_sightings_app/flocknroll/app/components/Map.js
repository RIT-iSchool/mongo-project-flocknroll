import React, { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, GeoJSON, Polygon } from 'react-leaflet';
import { getStateBoundaries } from '../api/request';


function convertData(data) {
  const formattedData = {
    type: "Feature",
    id: data.STUSPS,
    properties: {
      name: data.NAME,
      state_code: data.STUSPS
    },
    geometry: data.geometry,
  };
  return formattedData;
}

function MapStates() {
  const [isLoading, setIsLoading] = useState(true);
  const [stateData, setStateData] = useState([]);
  useEffect(() => {
    if (typeof window !== 'undefined') {
    (async () => { // Wrap fetchData in an async IIFE
      try {
        const stateBoundaries = await getStateBoundaries();
        const formattedData = stateBoundaries.map(convertData);
        const data = {
          type: "FeatureCollection",
          features: formattedData
        };
        setStateData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false); // Set loading to false after successful fetch or error
      }
    })(); // Invoke the IIFE immediately
  }
  }, []);
 

  return (
    <MapContainer center={[39.8283, -98.5795]} zoom={4}
      style={{ width: '50%', height: '100%', position: 'absolute', left: '0' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {isLoading ? (
        <div>Loading data...</div>
      ) : (
        stateData.features.length > 0 && (
          stateData.features.map((state, index) => {
            let coordinates;
            if (state.geometry.type === 'MultiPolygon') {
              coordinates = state.geometry.coordinates.map(polygon => polygon[0]); 
            } else {
              coordinates = state.geometry.coordinates[0];
            }
            coordinates = coordinates.map((item) => [item[1], item[0]]); 

            return (
              <div key={state.id}> 
                {state.geometry.type === 'MultiPolygon' && state.geometry.coordinates.map((polygon, i) => (
                  <Polygon
                    key={`${state.id}-${i}`}
                    pathOptions={{
                      fillColor: '#FD8D3C',
                      fillOpacity: 0.7,
                      weight: 2,
                      opacity: 1,
                      dashArray: 3,
                      color: 'white'
                    }}
                    positions={polygon[0].map((item) => [item[1], item[0]])} 
                    eventHandlers={{
                      mouseover: (e) => {
                        const layer = e.target;
                        layer.bindTooltip(`State: ${state.properties.name} - Code: ${state.properties.state_code}`).openTooltip();
                        layer.setStyle({
                          dashArray: "",
                          fillColor: "#BD0026",
                          fillOpacity: 0.7,
                          weight: 2,
                          opacity: 1,
                          color: "white",
                        })
                      },
                      mouseout: (e) => {
                        const layer = e.target;
                        layer.closeTooltip();
                        layer.setStyle({
                          fillOpacity: 0.7,
                          weight: 2,
                          dashArray: "3",
                          color: 'white',
                          fillColor: '#FD8D3C'
                        });
                      },
                      click: (e) => {
        
                      }
                    }}
                  />
                ))}
                {state.geometry.type !== 'MultiPolygon' && (
                  <Polygon
                    key={state.id || index}
                    pathOptions={{
                      fillColor: '#FD8D3C',
                      fillOpacity: 0.7,
                      weight: 2,
                      opacity: 1,
                      dashArray: 3,
                      color: 'white'
                    }}
                    positions={coordinates}
                    eventHandlers={{
                      mouseover: (e) => {
                        const layer = e.target;
                        layer.bindTooltip(`State: ${state.properties.name} - Code: ${state.properties.state_code}`).openTooltip();
                        layer.setStyle({
                          dashArray: "",
                          fillColor: "#BD0026",
                          fillOpacity: 0.7,
                          weight: 2,
                          opacity: 1,
                          color: "white",
                        })
                      },
                      mouseout: (e) => {
                        const layer = e.target;
                        layer.closeTooltip();
                        layer.setStyle({
                          fillOpacity: 0.7,
                          weight: 2,
                          dashArray: "3",
                          color: 'white',
                          fillColor: '#FD8D3C'
                        });
                      },
                      click: (e) => {
        
                      }
                    }}
                  />
                )}
              </div>
            )
          })
        )
      )}
    </MapContainer>
  );

}

export default MapStates;



