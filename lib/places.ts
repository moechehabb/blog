import prisma from "./prisma";

// Free OpenStreetMap-based geocoder, designed for autocomplete. No API key needed.
const PHOTON_URL = "https://photon.komoot.io/api/";

type PhotonFeature = {
    geometry: { coordinates: [number, number] };
    properties: {
        osm_type: string;
        osm_id: number;
        name?: string;
        street?: string;
        housenumber?: string;
        city?: string;
        state?: string;
        country?: string;
    };
};

function formatLabel(p: PhotonFeature["properties"]) {
    const street = [p.street, p.housenumber].filter(Boolean).join(" ");
    return [p.name, street, p.city, p.state, p.country]
        .filter((part, i, arr) => part && part !== arr[i - 1])
        .join(", ");
}

export async function autocompletePlaces(query: string) {
    const url = `${PHOTON_URL}?q=${encodeURIComponent(query)}&limit=5`;
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Places autocomplete failed: ${res.status}`);
    }
    const data = await res.json();
    return ((data.features ?? []) as PhotonFeature[]).map(f => ({
        placeId: `${f.properties.osm_type}:${f.properties.osm_id}`,
        text: formatLabel(f.properties),
        lat: f.geometry.coordinates[1],
        lng: f.geometry.coordinates[0]
    }));
}

// Returns the id of a Location row for this place, creating it on first use.
export async function resolveLocationId(place: {
    placeId: string;
    address: string;
    lat?: number;
    lng?: number;
}) {
    const existing = await prisma.location.findUnique({ where: { placeId: place.placeId } });
    if (existing) return existing.id;

    const location = await prisma.location.create({
        data: {
            placeId: place.placeId,
            address: place.address,
            lat: place.lat,
            lng: place.lng
        }
    });
    return location.id;
}
