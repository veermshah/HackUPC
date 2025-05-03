"use client";

import React, { useEffect, useState } from "react";

interface CityPhoto {
    city: string;
    photoUrl: string;
}

export default function City() {
    const [photos, setPhotos] = useState<CityPhoto[]>([]);
    const cities: string[] = [
        "Barcelona",
        "Madrid",
        "Paris",
        "New York",
        "Tokyo",
    ];
    const perPage = 1;

    useEffect(() => {
        async function fetchPhotoForCities(): Promise<void> {
            const ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;

            if (!ACCESS_KEY) {
                console.error("Missing Unsplash access key");
                return;
            }

            try {
                const results: CityPhoto[] = [];

                for (const city of cities) {
                    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
                        city
                    )}&per_page=${perPage}&client_id=${ACCESS_KEY}`;

                    const response = await fetch(url);

                    if (!response.ok) {
                        throw new Error(`HTTP error ${response.status}`);
                    }

                    const data = await response.json();

                    if (data.results.length === 0) {
                        results.push({ city, photoUrl: "" });
                    } else {
                        results.push({
                            city,
                            photoUrl: data.results[0].urls.small,
                        });
                    }
                }

                setPhotos(results);
            } catch (error) {
                console.error("Error fetching photos from Unsplash:", error);
            }
        }

        fetchPhotoForCities();
    }, []);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
            {photos.map((photo) => (
                <div key={photo.city} className="text-center">
                    <h2 className="font-bold text-lg mb-2">{photo.city}</h2>
                    {photo.photoUrl ? (
                        <img
                            src={photo.photoUrl}
                            alt={photo.city}
                            className="rounded-lg shadow-md w-full h-48 object-cover"
                        />
                    ) : (
                        <p>No image found</p>
                    )}
                </div>
            ))}
        </div>
    );
}
