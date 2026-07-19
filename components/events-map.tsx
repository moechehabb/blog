"use client";

import { useEffect, useRef } from "react";
import type { Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";

export type MapEvent = {
    id: number;
    title: string;
    description: string | null;
    date: string;
    organizer: string;
    address: string;
    lat: number;
    lng: number;
};

export default function EventsMap({ events }: { events: MapEvent[] }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<LeafletMap | null>(null);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            const L = (await import("leaflet")).default;
            if (cancelled || !containerRef.current || mapRef.current) return;

            const map = L.map(containerRef.current);
            mapRef.current = map;

            L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution:
                    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            const icon = L.divIcon({
                className: "",
                html: '<div style="width:14px;height:14px;background:#18181b;border:2px solid #fff;box-shadow:0 0 0 1px #18181b"></div>',
                iconSize: [14, 14],
                iconAnchor: [7, 7]
            });

            const markers = events.map(event => {
                const when = new Date(event.date).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short"
                });
                return L.marker([event.lat, event.lng], { icon })
                    .addTo(map)
                    .bindPopup(
                        `<strong>${escapeHtml(event.title)}</strong><br/>` +
                        `${escapeHtml(when)}<br/>` +
                        (event.description ? `${escapeHtml(event.description)}<br/>` : "") +
                        `${escapeHtml(event.address)}<br/>` +
                        `<span style="color:#71717a">by @${escapeHtml(event.organizer)}</span>`
                    );
            });

            if (markers.length > 0) {
                map.fitBounds(L.featureGroup(markers).getBounds().pad(0.2), { maxZoom: 15 });
            } else {
                map.setView([37.7749, -122.4194], 11);
            }
        })();

        return () => {
            cancelled = true;
            mapRef.current?.remove();
            mapRef.current = null;
        };
    }, [events]);

    return (
        <div
            ref={containerRef}
            className="h-[70vh] w-full border border-zinc-900 dark:border-zinc-700"
        />
    );
}

function escapeHtml(text: string) {
    return text
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;");
}
