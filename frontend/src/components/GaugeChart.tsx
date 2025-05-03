"use client";

import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

type GaugeChartProps = {
    value: number; // 0 to 100
    label?: string;
};

const getColor = (value: number): string => {
    if (value < 33) return "#4CAF50";
    if (value < 66) return "#FFC107";
    return "#F44336";
};

const GaugeChart: React.FC<GaugeChartProps> = ({
    value,
    label = "Calidad",
}) => {
    const percentage = Math.min(Math.max(value, 0), 100);
    const remainder = 100 - percentage;

    return (
        <div>
            <Doughnut
                data={{
                    labels: ["Valor", "Resto"],
                    datasets: [
                        {
                            data: [percentage, remainder],
                            backgroundColor: [getColor(percentage), "#e0e0e0"],
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
                            enabled: false,
                        },
                    },
                }}
            />
            <h2 className="text-lg font-semibold mb-16">{label}</h2>
        </div>
    );
};

export default GaugeChart;
