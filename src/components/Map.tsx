import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { ClubMeeting } from "@prisma/client";
mapboxgl.accessToken =
  "pk.eyJ1IjoiYnJhbmRvbnlzbGkiLCJhIjoiY2xncmM1ZTlxMDFoMjNkb3h0bHd2OTY1ciJ9.77uFlqrZMGKmBqcmgoqbSQ";

type Marker = {
  lat: number;
  lng: number;
};

type MapProps = {
  meetings: ClubMeeting[];
};

export default function Map({ meetings }: MapProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const lng = -76.4795;
  const lat = 42.45098;
  const zoom = 13;

  const addAllLocations = async () => {
    const uniqueCoordinates = new Set<string>();

    for (const meeting of meetings) {
      const { locationName, latitude, longitude } = meeting;

      if (latitude === null || longitude === null) {
        continue; // Skip this meeting if latitude or longitude is null
      }

      const coordinateKey = `${latitude},${longitude}`;

      if (uniqueCoordinates.has(coordinateKey)) {
        continue; // Skip this meeting if the coordinates are already processed
      }

      uniqueCoordinates.add(coordinateKey);

      const popup = new mapboxgl.Popup({
        className: "popup",
        closeButton: false,
      }).setHTML(`<p>${locationName}</p>`);

      const m = new mapboxgl.Marker({
        color: "#FF6B6B", // Set the marker color to #FFD8D8
      })
        .setLngLat([Number(longitude), Number(latitude)])
        .setPopup(popup);

      if (map.current) {
        m.addTo(map.current);

        m.getElement().addEventListener("mouseenter", () => {
          m.togglePopup();
        });

        m.getElement().addEventListener("mouseleave", () => {
          m.togglePopup();
        });
      }
    }
  };

  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: zoom,
    });

    addAllLocations();
  });

  return (
    <div className="flex rounded-md">
      <div ref={mapContainer} className="w-80 h-[300px] aspect-none mx-auto" />
    </div>
  );
}
