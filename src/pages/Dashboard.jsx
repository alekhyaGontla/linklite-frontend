import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import RecentActivity from "../components/RecentActivity";

function Dashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState({ totalUrls: 0, totalClicks: 0, activeUrls: 0, expiredUrls: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const userEmail = localStorage.getItem("userEmail");
    const username = userEmail ? userEmail.split("@")[0] : "User";

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                setLoading(true);
                const response = await api.get("/urls");
                const data = response.data;

                const now = new Date();
                const totalClicks = data.reduce((sum, u) => sum + (u.clickCount || 0), 0);
                const activeUrls = data.filter((u) => !u.expiryDate || new Date(u.expiryDate) > now).length;

                setStats({
                    totalUrls: data.length,
                    totalClicks,
                    activeUrls,
                    expiredUrls: data.length - activeUrls,
                });
            } catch (err) {
                console.error("Dashboard load failed:", err);
                setError("Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    if (loading) return <div className="text-center mt-5"><h3>Loading...</h3></div>;

    return (
        <div className="container mt-4">
            {error && <div className="alert alert-danger">{error}</div>}
            <h2>Welcome Back, {username}</h2>
            <div className="row g-4 mt-3">
                <div className="col-lg-8">
                    <div className="row g-4">
                        <div className="col-md-6"><div className="card text-center p-3"><h5>Total URLs</h5><h2>{stats.totalUrls}</h2></div></div>
                        <div className="col-md-6"><div className="card text-center p-3"><h5>Total Clicks</h5><h2>{stats.totalClicks}</h2></div></div>
                        <div className="col-md-6"><div className="card text-center p-3"><h5>Active URLs</h5><h2>{stats.activeUrls}</h2></div></div>
                        <div className="col-md-6"><div className="card text-center p-3"><h5>Expired URLs</h5><h2>{stats.expiredUrls}</h2></div></div>
                    </div>
                    <div className="mt-4">
                        <button className="btn btn-primary me-2" onClick={() => navigate("/urls")}>URL Manager</button>
                        <button className="btn btn-success" onClick={() => navigate("/analytics")}>Analytics</button>
                    </div>
                </div>
                <div className="col-lg-4">
                    <RecentActivity />
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
