"use client";

import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

type CityData = {
    name: string;
    value: number; // 0 to 100
};

const getColor = (value: number): string => {
    if (value < 33) return "#4CAF50"; // Green
    if (value < 66) return "#FFC107"; // Yellow
    return "#F44336"; // Red
};

const GaugeChart: React.FC = () => {
    const cities: CityData[] = [
        { name: "Ciudad A", value: 75 },
        { name: "Ciudad B", value: 45 },
        { name: "Ciudad C", value: 20 },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
            {cities.map((city, index) => {
                const percentage = city.value;
                const remainder = 100 - percentage;

                return (
                    <div key={index} className="text-center">
                        <h2 className="text-lg font-semibold mb-2">
                            {city.name}
                        </h2>
                        <Doughnut
                            data={{
                                labels: ["Valor", "Resto"],
                                datasets: [
                                    {
                                        data: [percentage, remainder],
                                        backgroundColor: [
                                            getColor(percentage),
                                            "#e0e0e0",
                                        ],
                                        borderWidth: 0,
                                        circumference: 180,
                                        rotation: -90,
                                    },
                                ],
                            }}
                            options={{
                                responsive: true,
                                cutout: "70%",
                                plugins: {
                                    legend: { display: false },
                                    tooltip: {
                                        callbacks: {
                                            label: (ctx) =>
                                                ctx.label === "Valor"
                                                    ? `Calidad del aire: ${percentage}`
                                                    : "",
                                        },
                                    },
                                },
                            }}
                        />
                        <div className="mt-2 text-lg font-bold">
                            {percentage}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default GaugeChart;
