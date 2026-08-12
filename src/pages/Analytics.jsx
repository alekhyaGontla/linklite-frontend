import { useEffect, useState, useCallback } from "react";
import api from "../services/api";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";

import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

function Analytics() {

    const [urls, setUrls] = useState([]);

    const [stats, setStats] = useState({
        totalUrls: 0,
        totalClicks: 0,
        activeUrls: 0,
        expiredUrls: 0
    });

    const loadAnalytics = useCallback(async () => {

        try {

            const response = await api.get("/urls");

            const data = response.data;

            setUrls(data);

            const now = new Date();

            const totalClicks = data.reduce(
                (sum, url) => sum + (url.clickCount || 0),
                0
            );

            const activeUrls = data.filter(
                url =>
                    !url.expiryDate ||
                    new Date(url.expiryDate) > now
            ).length;

            const expiredUrls = data.length - activeUrls;

            setStats({
                totalUrls: data.length,
                totalClicks,
                activeUrls,
                expiredUrls
            });

        } catch (error) {

            console.log(error);

        }

    }, []);

    useEffect(() => {
        loadAnalytics();
    }, [loadAnalytics]);

    const barData = {

        labels: [

            "Total URLs",
            "Active URLs",
            "Expired URLs",
            "Total Clicks"

        ],

        datasets: [

            {

                label: "Statistics",

                data: [

                    stats.totalUrls,
                    stats.activeUrls,
                    stats.expiredUrls,
                    stats.totalClicks

                ],

                backgroundColor: [

                    "#0d6efd",
                    "#198754",
                    "#dc3545",
                    "#ffc107"

                ],

                borderColor: [

                    "#0a58ca",
                    "#146c43",
                    "#b02a37",
                    "#d39e00"

                ],

                borderWidth: 2,

                borderRadius: 8

            }

        ]

    };

    const pieData = {

        labels: [

            "Active URLs",
            "Expired URLs"

        ],

        datasets: [

            {

                data: [

                    stats.activeUrls,
                    stats.expiredUrls

                ],

                backgroundColor: [

                    "#198754",
                    "#dc3545"

                ],

                borderColor: [

                    "#ffffff",
                    "#ffffff"

                ],

                borderWidth: 3,

                hoverOffset: 20

            }

        ]

    };

    const barOptions = {

        responsive: true,

        plugins: {

            legend: {

                labels: {

                    color: "#000",

                    font: {

                        size: 14,

                        weight: "bold"

                    }

                }

            }

        }

    };

    const pieOptions = {

        responsive: true,

        plugins: {

            legend: {

                position: "bottom",

                labels: {

                    color: "#000",

                    font: {

                        size: 14

                    }

                }

            }

        }

    };

    return (

        <div className="container py-4">

            <h2 className="text-center text-primary fw-bold mb-5">

                📊 Analytics Dashboard

            </h2>

            <div className="row g-4">

                <div className="col-md-3">

                    <div className="card text-white bg-primary shadow text-center">

                        <div className="card-body">

                            <h5>Total URLs</h5>

                            <h2>{stats.totalUrls}</h2>

                        </div>

                    </div>

                </div>

                <div className="col-md-3">

                    <div className="card text-white bg-success shadow text-center">

                        <div className="card-body">

                            <h5>Total Clicks</h5>

                            <h2>{stats.totalClicks}</h2>

                        </div>

                    </div>

                </div>

                <div className="col-md-3">

                    <div className="card text-dark bg-warning shadow text-center">

                        <div className="card-body">

                            <h5>Active URLs</h5>

                            <h2>{stats.activeUrls}</h2>

                        </div>

                    </div>

                </div>

                <div className="col-md-3">

                    <div className="card text-white bg-danger shadow text-center">

                        <div className="card-body">

                            <h5>Expired URLs</h5>

                            <h2>{stats.expiredUrls}</h2>

                        </div>

                    </div>

                </div>

            </div>

            <div className="row mt-5">

                <div className="col-lg-7">

                    <div className="card shadow-lg p-4">

                        <h4 className="text-center mb-4">

                            📈 URL Statistics

                        </h4>

                        <Bar
                            data={barData}
                            options={barOptions}
                        />

                    </div>

                </div>

                <div className="col-lg-5">

                    <div className="card shadow-lg p-4">

                        <h4 className="text-center mb-4">

                            🥧 Active vs Expired

                        </h4>

                        <Pie
                            data={pieData}
                            options={pieOptions}
                        />

                    </div>

                </div>

            </div>

            <div className="card shadow-lg mt-5">

                <div className="card-header bg-primary text-white">

                    <h4 className="mb-0">

                        Recent URLs

                    </h4>

                </div>

                <div className="table-responsive">

                    <table className="table table-striped table-hover mb-0">

                        <thead className="table-dark">

                            <tr>

                                <th>Original URL</th>

                                <th>Short Code</th>

                                <th>Clicks</th>

                                <th>Expiry</th>

                            </tr>

                        </thead>

                        <tbody>

                            {urls.map((url) => (

                                <tr key={url.id}>

                                    <td>{url.originalUrl}</td>

                                    <td>

                                        <span className="badge bg-primary">

                                            {url.shortCode}

                                        </span>

                                    </td>

                                    <td>

                                        <span className="badge bg-success">

                                            {url.clickCount}

                                        </span>

                                    </td>

                                    <td>

                                        {

                                            url.expiryDate

                                                ? new Date(url.expiryDate).toLocaleDateString()

                                                : "Never"

                                        }

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    );

}

export default Analytics;