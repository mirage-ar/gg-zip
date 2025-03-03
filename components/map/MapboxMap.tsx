"use client";

import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";

import TradingView from "@/components/sponsor/trade/TradingView";

import "mapbox-gl/dist/mapbox-gl.css";

import type { LocationData, MarkersObject, Player } from "@/types";
import { GAME_API, LOCATION_SOCKET_URL, POLLING_TIME } from "@/utils/constants";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN as string;

interface MapboxMapProps {
  mapRef: React.MutableRefObject<mapboxgl.Map | null>;
  markersRef: React.MutableRefObject<MarkersObject>;
  isHomePage?: boolean;
  playerList?: Player[];
}

const MapboxMap: React.FC<MapboxMapProps> = ({ mapRef, markersRef, isHomePage = false, playerList = [] }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const markersSocket = useRef<WebSocket | null>(null);

  const [showOverlay, setShowOverlay] = useState(false);
  const [tradingViewPlayer, setTradingViewPlayer] = useState<Player | null>(null);
  const playerListRef = useRef(playerList);

  useEffect(() => {
    playerListRef.current = playerList;
  }, [playerList]);

  // SETUP MAP
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current as HTMLElement,
      center: [-71.14373900852445, 42.35727058925982],
      zoom: 2,
      pitch: 0,
      attributionControl: false,
    });

    map.on("style.load", () => {
      // @ts-ignore
      map.setConfigProperty("basemap", "lightPreset", "night");
      // @ts-ignore
      map.setConfigProperty("basemap", "showPointOfInterestLabels", false);
    });

    map.on("load", function () {
      // FETCH INITIAL BOXES
      fetchBoxes();

      map.addSource("boxes-source", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
      });

      map.loadImage("/assets/icons/map/box-closed.png", (error, image) => {
        if (error) throw error;
        map.addImage("boxClosed", image as HTMLImageElement);
      });

      map.loadImage("/assets/icons/map/box-opened.png", (error, image) => {
        if (error) throw error;
        map.addImage("boxOpened", image as HTMLImageElement);
      });

      map.addLayer({
        id: "boxes-layer",
        type: "symbol", // Change the type to symbol to use images
        source: "boxes-source",
        layout: {
          "icon-image": [
            "match",
            ["get", "boxType"], // Use the 'boxType' property
            "opened",
            "boxOpened", // If 'boxType' is 'opened', use 'boxOpened'
            "closed",
            "boxClosed", // If 'boxType' is 'closed', use 'boxClosed'
            "boxClosed", // Default image if 'boxType' doesn't match
          ],
        },
      });
    });

    mapRef.current = map;

    return () => {
      map.remove();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchBoxes = async () => {
    try {
      const response = await fetch(`${GAME_API}/boxes`);
      const data = await response.json();

      // update box markers
      const map = mapRef.current;
      if (map && map.getSource("boxes-source")) {
        const boxesSource = map.getSource("boxes-source") as mapboxgl.GeoJSONSource;
        if (boxesSource) {
          boxesSource.setData(data.boxes);
        }
      }
    } catch (error) {
      console.error("Error fetching boxes:", error);
    }
  };

  useEffect(() => {
    if (isHomePage) return;

    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        fetchBoxes();
      }
    }, POLLING_TIME);

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Markers Socket
  useEffect(() => {
    let watchId: number;
    let reconnectAttempts = 0;

    const connectWebSocket = () => {
      markersSocket.current = new WebSocket(LOCATION_SOCKET_URL);

      markersSocket.current.onopen = () => {
      };

      markersSocket.current.onmessage = (event: MessageEvent) => {
        const message: LocationData = JSON.parse(event.data);
        const map = mapRef.current;
        if (map) updateMarkers(map, message);
      };

      markersSocket.current.onerror = (error) => {
        // console.error("WebSocket Error", error);
      };
    };

    // Initial connection
    if (!isHomePage) {
      connectWebSocket();
    }

    return () => {
      markersSocket.current?.close();
      navigator.geolocation.clearWatch(watchId);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // UPDATE PLAYER MARKERS
  const updateMarkers = (map: mapboxgl.Map, message: LocationData) => {
    if (map && message.id && message.latitude && message.longitude) {
      const existingMarker = markersRef.current[message.id];

      if (existingMarker) {
        // Marker exists, update its position
        existingMarker.setLngLat([message.longitude, message.latitude]);
      } else {
        // Marker doesn't exist, create a new onea
        const el = document.createElement("img");
        el.className = "marker";
        el.src = message.image;
        el.onclick = () => showTradingView(message.id);
        // el.src = `/icons/markers/${rand(1, 5)}.svg`;

        const newMarker = new mapboxgl.Marker(el).setLngLat([message.longitude, message.latitude]).addTo(map);

        markersRef.current[message.id] = newMarker;
      }
    }
  };

  const showTradingView = (id: string) => {
    const player = playerListRef.current.find((player) => player.id === id);
    if (player) {
      setTradingViewPlayer(player);
      setShowOverlay(true);
    }
  };

  return (
    <>
    {showOverlay && tradingViewPlayer && <TradingView player={tradingViewPlayer} setShowOverlay={setShowOverlay} />}
      <div
        ref={mapContainerRef}
        style={{
          height: "100vh",
          width: "100vw",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: "-10",
        }}
      />
    </>
  );
};

export default MapboxMap;
