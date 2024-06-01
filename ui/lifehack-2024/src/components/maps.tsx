'use client';

import { useEffect, useRef, useMemo } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

export default function Map() {
  const mapRef = useRef<HTMLDivElement>(null);
  const placeAutocompleteRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const initializeMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
        version: 'weekly',
      });

      const { Map } = await loader.importLibrary('maps');

      const locationInMap = { lat: 1.2984443745959635, lng: 103.7766531745964 };

      const { Marker } = await loader.importLibrary('marker');

      const options: google.maps.MapOptions = {
        center: locationInMap,
        zoom: 12,
        mapId: 'NEXT_LIFEHACK_MAP',
      };

      const map = new Map(mapRef.current as HTMLDivElement, options);

      const marker = new Marker({
        map,
        position: locationInMap,
      });

      const { SearchBox, Autocomplete } = await loader.importLibrary('places');

      // Create the search box and link it to the UI element.
      const input = document.getElementById('pac-input') as HTMLInputElement;
      const searchBox = new SearchBox(input);

      // map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

      // Bias the SearchBox results towards current map's viewport.
      map.addListener('bounds_changed', () => {
        searchBox.setBounds(map.getBounds() as google.maps.LatLngBounds);
      });

      let markers: google.maps.Marker[] = [];

      searchBox.addListener('places_changed', async () => {
        const places =
          searchBox.getPlaces() as google.maps.places.PlaceResult[];

        if (places.length == 0) {
          return;
        }

        markers = [];

        // For each place, get the icon, name and location.
        const bounds = new google.maps.LatLngBounds();

        places.forEach((place) => {
          if (!place.geometry || !place.geometry.location) {
            console.log('Returned place contains no geometry');
            return;
          }

          // Create a marker for each place.
          markers.push(
            new google.maps.Marker({
              map,
              // icon,
              title: place.name,
              position: place.geometry.location,
            })
          );

          if (place.geometry.viewport) {
            // Only geocodes have viewport.
            bounds.union(place.geometry.viewport);
          } else {
            bounds.extend(place.geometry.location);
          }
        });
        map.fitBounds(bounds);
        map.setZoom(12);

        const request: { parent: string; model: any } = {
          parent: 'projects/lifehack2024',
          model: {
            shipments: [
              {
                pickups: [],
              },
            ],
            vehicles: [],
            globalStartTime: '2024-02-13T00:00:00.000Z',
            globalEndTime: '2024-02-14T06:00:00.000Z',
          },
        };

        for (let i = 0; i < markers.length; i++) {
          request.model.shipments[0].pickups.push({
            arrivalLocation: {
              latitude: marker.getPosition()?.lat(),
              longitude: marker.getPosition()?.lng(),
            },
          });
        }
      });
    };

    initializeMap();
  });

  return (
    <div>
      <div className="h-[450px] w-[600px]" ref={mapRef}>
        Google Maps
      </div>
      <div className="px-2 py-3">
        <input
          id="pac-input"
          className="w-full h-[50px] border border-gray-300 rounded-md placeholder:px-2"
          type="text"
          placeholder="Search locations"
        />
      </div>
    </div>
  );
}
