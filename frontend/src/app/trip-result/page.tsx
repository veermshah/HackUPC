"use client";
import { useEffect, useState } from "react";
import GaugeChart from "@/components/GaugeChart";

export default function TripResultPage() {
    const [result, setResult] = useState<any>(null);
    const [photoUrl, setPhotoUrl] = useState<string | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem("suggestResult");
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setResult(parsed.result);
            } catch (err) {
                console.error("Failed to parse result:", err);
            }
        }
    }, []);

    useEffect(() => {
        const createCarSearch = async () => {
            const body = {
                query: {
                    market: "UK",
                    locale: "en-GB",
                    currency: "EUR",
                    pickUpLocation: { entityId: "27544008" },
                    pickUpDate: {
                        year: 2025,
                        month: 12,
                        day: 21,
                        hour: 16,
                        minute: 30,
                    },
                    dropOffDate: {
                        year: 2025,
                        month: 12,
                        day: 26,
                        hour: 12,
                        minute: 30,
                    },
                    includedAgentIds: ["vipd", "sixt"],
                    driverAge: 38,
                },
            };

            const res = await fetch("/api/skyscanner", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const data = await res.json();
            console.log("Car Hire Response:", data);
        };
        createCarSearch();

        // In your client component
        const searchFlights = async () => {
            const res = await fetch("/api/flight/search", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    query: {
                        market: "UK",
                        locale: "es-ES",
                        currency: "EUR",
                        query_legs: [
                            {
                                origin_place_id: { iata: "BCN" },
                                destination_place_id: {
                                    iata: result.destinos_sugeridos[0].iata,
                                },
                                date: { year: 2025, month: 12, day: 22 },
                            },
                        ],
                        adults: 1,
                        cabin_class: "CABIN_CLASS_ECONOMY",
                    },
                }),
            });

            const data = await res.json();
            console.log("Flights", data);
        };
        searchFlights();
    }, [result]);

    useEffect(() => {
        const fetchPhoto = async () => {
            if (!result?.destinos_sugeridos?.[0]?.nombre) return;

            const ACCESS_KEY = "vSKfV-0HWtFhhhYwaERpT_O6TqYt2bXnsHM4BingwKU";
            if (!ACCESS_KEY) {
                console.error("Missing Unsplash access key");
                return;
            }

            try {
                const city = result.destinos_sugeridos[0].nombre;
                const url = `https://api.unsplash.com/search/photos?query=${city}&per_page=1&client_id=${ACCESS_KEY}`;

                const response = await fetch(url);
                const data = await response.json();

                if (data.results.length > 0) {
                    setPhotoUrl(data.results[0].urls.small);
                }
            } catch (error) {
                console.error("Error fetching photo:", error);
            }
        };

        fetchPhoto();
    }, [result]);

    if (!result) return <div className="p-6">Loading trip results...</div>;

    return (
        <>
            <div className="p-6 text-3xl font-black">
                {result.destinos_sugeridos[0].nombre}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                {/* Photo Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden h-72 w-full">
                    {photoUrl && (
                        <img
                            src={photoUrl}
                            alt={result.destinos_sugeridos[0].nombre}
                            className="w-full h-full object-cover"
                        />
                    )}
                </div>

                {/* Info Card */}
                <div className="bg-white rounded-2xl shadow-xl p-4 h-72 flex flex-col justify-center">
                    <div className="text-lg font-semibold text-gray-700">
                        Description
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mt-2">
                        {result.destinos_sugeridos[0].nombre}
                    </div>
                </div>

                {/* Gauge Card */}
                <div className="bg-white rounded-2xl shadow-xl h-72 text-center flex items-center justify-center">
                    <GaugeChart
                        value={result.destinos_sugeridos[0].estimacion_co2}
                        label="Air Quality"
                    />
                </div>
            </div>
        </>
    );
}
