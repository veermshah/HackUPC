"use client";

import { useEffect, useState } from "react";
import Slider from "react-slick";
import { FaLeaf, FaUtensils, FaTicketAlt, FaCity } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { set } from "mongoose";
import GaugeChart from "@/components/GaugeChart";

export default function TripResultPage() {
    const [result, setResult] = useState<any>(null);
    const [photoUrls, setPhotoUrls] = useState<{ [key: number]: string }>({});
    const [carRental, setCarRental] = useState<any>(null);
    const [flightSearch, setFlightSearch] = useState<any>(null);

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
        if (!result?.destinos_sugeridos) return;

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
            setCarRental(data);
            console.log("Car Hire Response:", data);
        };

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
            setFlightSearch(data);
            console.log("Flights", data);
        };

        createCarSearch();
        searchFlights();
        fetchPhotos();
    }, [result]);

    const fetchPhotos = async () => {
        if (!result?.destinos_sugeridos?.length) return;

        const ACCESS_KEY = "vSKfV-0HWtFhhhYwaERpT_O6TqYt2bXnsHM4BingwKU";
        const urls: { [key: number]: string } = {};

        for (let i = 0; i < result.destinos_sugeridos.length; i++) {
            const city = result.destinos_sugeridos[i].nombre;
            try {
                const res = await fetch(
                    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
                        city
                    )}&per_page=1&client_id=${ACCESS_KEY}`
                );
                const data = await res.json();
                if (data.results?.[0]?.urls?.small) {
                    urls[i] = data.results[0].urls.small;
                }
            } catch (err) {
                console.error(`Error fetching photo for ${city}`, err);
            }
        }

        setPhotoUrls(urls);
    };

    if (!result) return <div className="p-6">Loading trip results...</div>;

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    return (
        <div className="mt-10">
            <h1 className="text-3xl font-black ml-12 mb-8">
                Suggested Destinations
            </h1>

            <div className="bg-[#0F3857] p-6 rounded-xl shadow-inner">
                <Slider {...settings}>
                    {result.destinos_sugeridos.map(
                        (destino: any, index: number) => (
                            <div key={index} className="px-4">
                                {/* Layout general en 2 columnas: izquierda (imagen + CO2), derecha (lugares) */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                                    {/* Columna izquierda */}
                                    <div className="items-start gap-4 w-full">
                                        <h2 className="text-2xl ml-5 font-bold w-fit text-[#ffffff] border border-[#ffffff] px-4 py-2 rounded-md cursor-pointer hover:bg-[#ffffff] hover:text-[#0F3857] transition-colors duration-200 mt-5">
                                            {destino.nombre}
                                        </h2>

                                        <div className="mt-5 w-full p-5">
                                            <h3 className="text-xl font-semibold mb-4 text-[#ffffff] flex items-center gap-2">
                                                <FaCity className="text-[#ffffff]" />{" "}
                                                Destination Overview
                                            </h3>

                                            {/* Imagen y CO₂ Info en fila */}
                                            <div className="flex flex-col md:flex-row gap-8 items-start">
                                                {/* Imagen */}
                                                <div className="hover:scale-103 transition-transform duration-200 cursor-pointer rounded-xl shadow-md overflow-hidden w-full h-64 max-w-md shadow-[rgba(0,0,0,0.24)_0px_3px_8px]">
                                                    <img
                                                        src={
                                                            photoUrls[index] ||
                                                            "/placeholder.jpg"
                                                        }
                                                        alt={destino.nombre}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>

                                                {/* CO₂ Info */}
                                                <div className="flex flex-col items-center gap-4">
                                                    <div className="hover:scale-103 transition-transform duration-200 cursor-pointer bg-white rounded-xl shadow-md p-4 min-h-32 w-fit flex items-center gap-3">
                                                        <FaLeaf className="text-green-500 text-2xl" />
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-700">
                                                                Estimated CO₂
                                                                Emissions
                                                            </div>
                                                            <div className="text-xl font-bold text-gray-900">
                                                                {
                                                                    destino.estimacion_co2
                                                                }{" "}
                                                                kg
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <GaugeChart
                                                        value={
                                                            destino.estimacion_co2 /
                                                            1000
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        {carRental?.content?.results
                                            ?.quotes && (
                                            <div className="mx-6 my-6">
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                    {Object.values(
                                                        carRental.content
                                                            .results.quotes
                                                    )
                                                        .slice(0, 9)
                                                        .map(
                                                            (
                                                                car: any,
                                                                idx: number
                                                            ) => (
                                                                <a
                                                                    href={
                                                                        car.deeplinkUrl
                                                                    }
                                                                    key={idx}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition"
                                                                >
                                                                    <img
                                                                        src={
                                                                            car.imageUrl
                                                                        }
                                                                        alt={
                                                                            car.vehicleName
                                                                        }
                                                                        className="w-full min-h-24 object-contain mb-3"
                                                                    />
                                                                    <div className="font-bold text-lg">
                                                                        {
                                                                            car.vehicleName
                                                                        }
                                                                    </div>
                                                                    <div className="text-sm text-gray-700">
                                                                        €
                                                                        {parseFloat(
                                                                            car
                                                                                .price
                                                                                .amount
                                                                        ).toFixed(
                                                                            2
                                                                        )}{" "}
                                                                        total
                                                                    </div>
                                                                    <div className="text-xs text-gray-500">
                                                                        {
                                                                            car
                                                                                .pickupLocation
                                                                                ?.address
                                                                        }
                                                                    </div>
                                                                </a>
                                                            )
                                                        )}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Columna derecha */}
                                    <div className="p-5">
                                        <h3 className="text-xl font-semibold mb-4 text-[#ffffff] flex items-center gap-2">
                                            <FaUtensils className="text-[#ffffff]" />{" "}
                                            Highlights & Restaurants
                                        </h3>

                                        <div className="flex flex-col gap-4">
                                            {destino.lugares_destacados.map(
                                                (lugar: any, idx: number) => (
                                                    <div
                                                        key={idx}
                                                        className="bg-white rounded-xl shadow-md p-4 hover:scale-103 transition-transform duration-200 cursor-pointer shadow-[rgba(0,0,0,0.24)_0px_3px_8px]"
                                                    >
                                                        <h4 className="text-lg font-bold text-[#0F3857]">
                                                            {lugar.nombre}
                                                        </h4>
                                                        <p className="text-sm text-gray-700 mt-1 mb-3">
                                                            {lugar.descripcion}
                                                        </p>
                                                        <ul className="text-sm text-gray-600 space-y-1">
                                                            {lugar.restaurantes.map(
                                                                (
                                                                    rest: any,
                                                                    rIdx: number
                                                                ) => (
                                                                    <li
                                                                        key={
                                                                            rIdx
                                                                        }
                                                                    >
                                                                        <strong>
                                                                            {
                                                                                rest.nombre
                                                                            }
                                                                        </strong>{" "}
                                                                        –{" "}
                                                                        {
                                                                            rest.tipo
                                                                        }{" "}
                                                                        (
                                                                        {
                                                                            rest.ubicacion
                                                                        }
                                                                        )
                                                                    </li>
                                                                )
                                                            )}
                                                        </ul>

                                                        {lugar.evento && (
                                                            <div className="mt-4 bg-gray-100 p-3 rounded-md shadow-sm">
                                                                <h5 className="font-semibold text-[#0F3857]flex items-center gap-2">
                                                                    <FaTicketAlt className="text-[#0F3857]" />{" "}
                                                                    {
                                                                        lugar
                                                                            .evento
                                                                            .nombre
                                                                    }
                                                                </h5>
                                                                <p className="text-sm text-gray-700">
                                                                    {
                                                                        lugar
                                                                            .evento
                                                                            .descripcion
                                                                    }
                                                                </p>
                                                                <p className="text-xs text-gray-500 mt-1">
                                                                    📍{" "}
                                                                    {
                                                                        lugar
                                                                            .evento
                                                                            .ubicacion
                                                                    }{" "}
                                                                    | 🕒{" "}
                                                                    {
                                                                        lugar
                                                                            .evento
                                                                            .hora
                                                                    }
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                )
                                            )}
                                        </div>
                                        <div className="bg-white rounded-2xl mt-6 px-6 py-3">
                                            <div className="font-bold text-2xl mb-2">
                                                Flights
                                            </div>

                                            {/* Flight duration always visible */}
                                            {flightSearch?.content?.stats
                                                ?.itineraries && (
                                                <div className="bg-white rounded-2xl px-6 py-3">
                                                    <div className="flex text-gray-700 space-x-20">
                                                        <div>
                                                            🕒{" "}
                                                            <strong>
                                                                Minimum
                                                                Duration:
                                                            </strong>{" "}
                                                            {
                                                                flightSearch
                                                                    .content
                                                                    .stats
                                                                    .itineraries
                                                                    .minDuration
                                                            }
                                                        </div>
                                                        <div>
                                                            🕓{" "}
                                                            <strong>
                                                                Maximum
                                                                Duration:
                                                            </strong>{" "}
                                                            {
                                                                flightSearch
                                                                    .content
                                                                    .stats
                                                                    .itineraries
                                                                    .maxDuration
                                                            }
                                                        </div>
                                                    </div>
                                                    {flightSearch?.content
                                                        ?.results
                                                        ?.itineraries &&
                                                        Object.values(
                                                            flightSearch.content
                                                                .results
                                                                .itineraries
                                                        )
                                                            .slice(0, 5)
                                                            .map(
                                                                (
                                                                    itinerary: any,
                                                                    idx: number
                                                                ) => {
                                                                    const option =
                                                                        itinerary
                                                                            .pricingOptions?.[0];
                                                                    const item =
                                                                        option
                                                                            ?.items?.[0];

                                                                    return option?.agentIds.map(
                                                                        (
                                                                            agentId: string
                                                                        ) => {
                                                                            const agent =
                                                                                flightSearch
                                                                                    .content
                                                                                    .results
                                                                                    .agents?.[
                                                                                    agentId
                                                                                ];
                                                                            if (
                                                                                !agent ||
                                                                                !item
                                                                            )
                                                                                return null;

                                                                            return (
                                                                                <div
                                                                                    key={
                                                                                        agentId +
                                                                                        idx
                                                                                    }
                                                                                    className="flex items-center gap-4 border border-gray-200 rounded-lg p-4 my-2 bg-gray-50 shadow-sm"
                                                                                >
                                                                                    <img
                                                                                        src={
                                                                                            agent.imageUrl
                                                                                        }
                                                                                        alt={
                                                                                            agent.name
                                                                                        }
                                                                                        className="h-8 w-auto object-contain"
                                                                                    />
                                                                                    <div className="flex-1">
                                                                                        <div className="font-semibold text-[#0F3857]">
                                                                                            {
                                                                                                agent.name
                                                                                            }
                                                                                        </div>
                                                                                        <div className="text-sm text-gray-600">
                                                                                            Rating:{" "}
                                                                                            {agent.rating?.toFixed(
                                                                                                2
                                                                                            )}{" "}
                                                                                            ⭐
                                                                                        </div>
                                                                                    </div>
                                                                                    <a
                                                                                        href={
                                                                                            item.deepLink
                                                                                        }
                                                                                        target="_blank"
                                                                                        rel="noopener noreferrer"
                                                                                        className="text-sm text-white bg-blue-600 px-4 py-1 rounded hover:bg-blue-700 transition"
                                                                                    >
                                                                                        Book
                                                                                        Now
                                                                                    </a>
                                                                                </div>
                                                                            );
                                                                        }
                                                                    );
                                                                }
                                                            )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    )}
                </Slider>
            </div>

            {result.intereses_comunes && (
                <div className="mt-10">
                    <h2 className="text-2xl font-bold text-[#0f3857] mb-4 ml-20">
                        Common Interests
                    </h2>
                    <div className=" rounded-xl p-4 text-center text-lg font-medium text-gray-800">
                        {result.intereses_comunes}
                    </div>
                </div>
            )}
            <div className="h-24"></div>
        </div>
    );
}
