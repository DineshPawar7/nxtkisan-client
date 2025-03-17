import { useEffect, useState } from "react";
import axios from "axios";
import Chart from "chart.js/auto";
import { IoIosPricetags } from "react-icons/io";
import { CgSearchLoading } from "react-icons/cg";
import { CiWarning } from "react-icons/ci";




import "./MandiBhav.css";

const MandiBhav = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Filters State
    const [selectedState, setSelectedState] = useState("");
    const [selectedVariety, setSelectedVariety] = useState("");
    const [selectedMarket, setSelectedMarket] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const today = new Date().toISOString().split("T")[0];

                const response = await axios.get(
                    "https://api.data.gov.in/resource/35985678-0d79-46b4-9ed6-6f13308a1d24",
                    {
                        params: {
                            "api-key": "579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b",
                            format: "json",
                            limit: 100,
                            "filters[Arrival_Date]": today,
                        },
                    }
                );

                const sortedData = response.data.records.sort(
                    (a, b) => new Date(b.Arrival_Date) - new Date(a.Arrival_Date)
                );

                setData(sortedData);
                setFilteredData(sortedData);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Filter Logic
    useEffect(() => {
        let filtered = data;
        if (selectedState) {
            filtered = filtered.filter(item => item.State === selectedState);
        }
        if (selectedVariety) {
            filtered = filtered.filter(item => item.Variety === selectedVariety);
        }
        if (selectedMarket) {
            filtered = filtered.filter(item => item.Market === selectedMarket);
        }
        setFilteredData(filtered);
        updateChart(filtered);
    }, [selectedState, selectedVariety, selectedMarket]);

    // Chart Update Function
    const updateChart = (filtered) => {
        if (filtered.length === 0) return;

        const ctx = document.getElementById("priceChart").getContext("2d");

        if (window.myChart) {
            window.myChart.destroy();
        }

        window.myChart = new Chart(ctx, {
            type: "bar",
            data: {
                labels: filtered.map(item => item.Commodity),
                datasets: [
                    {
                        label: "Min Price",
                        data: filtered.map(item => item.Min_Price),
                        backgroundColor: "green",
                    },
                    {
                        label: "Max Price",
                        data: filtered.map(item => item.Max_Price),
                        backgroundColor: "red",
                    },
                    {
                        label: "Avg. Price",
                        data: filtered.map(item => item.Modal_Price),
                        backgroundColor: "blue",
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
            },
        });
    };

    return (
        <div className="mandi-container">
            <div className="mandi-box">
                <h2 className="mandi-heading"><IoIosPricetags /> Mandi Bhav (Today's)</h2>

                {/*  Filters */}
                <div className="filter-container">
                    <select onChange={(e) => setSelectedState(e.target.value)}>
                        <option value="">Select State</option>
                        {[...new Set(data.map(item => item.State))].map(state => (
                            <option key={state} value={state}>{state}</option>
                        ))}
                    </select>

                    <select onChange={(e) => setSelectedVariety(e.target.value)}>
                        <option value="">Choose a Variety</option>
                        {[...new Set(data.map(item => item.Variety))].map(variety => (
                            <option key={variety} value={variety}>{variety}</option>
                        ))}
                    </select>

                    <select onChange={(e) => setSelectedMarket(e.target.value)}>
                        <option value="">Select Market Committee</option>
                        {[...new Set(data.map(item => item.Market))].map(market => (
                            <option key={market} value={market}>{market}</option>
                        ))}
                    </select>
                </div>

                {loading ? (
                    <p className="loading-text"><CgSearchLoading /> Loading...</p>
                ) : (
                    <>
                        <div className="chart-container">
                            <canvas id="priceChart"></canvas>
                        </div>

                        <div className="table-wrapper">
                            <table className="mandi-table">
                                <thead>
                                    <tr>
                                        <th>State</th>
                                        <th>Dist.</th>
                                        <th>Commodity</th>
                                        <th>Variety</th>
                                        <th>Min. Price</th>
                                        <th>Max.Price</th>
                                        <th>Avg. Price</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.length > 0 ? (
                                        filteredData.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.State}</td>
                                                <td>{item.District}</td>
                                                <td>{item.Commodity}</td>
                                                <td>{item.Variety}</td>
                                                <td className="min-price">{item.Min_Price}</td>
                                                <td className="max-price">{item.Max_Price}</td>
                                                <td className="avg-price">{item.Modal_Price}</td>
                                                <td>{item.Arrival_Date}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="8" className="no-data">
                                                <CiWarning /> No fresh data available
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default MandiBhav;
