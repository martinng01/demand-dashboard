'use client';

import { useEffect, useRef, useMemo } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

export default function Map() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initializeMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
        version: 'weekly',
      });

      const { Map } = await loader.importLibrary('maps');

      const locationInMap = { lat: 1.2984443745959635, lng: 103.7766531745964 };

      const options: google.maps.MapOptions = {
        center: locationInMap,
        zoom: 15,
        mapId: 'NEXT_LIFEHACK_MAP',
      };

      const map = new Map(mapRef.current as HTMLDivElement, options);
    };

    initializeMap();
  });

  return (
    <div className="h-[600px]" ref={mapRef}>
      Google Maps
    </div>
  );
}
