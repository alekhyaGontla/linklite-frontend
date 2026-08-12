import { useEffect, useState, Fragment } from "react";
import api from "../services/api";
import QRCode from "react-qr-code";
import AiSummaryCard from "./AiSummaryCard";

function UrlHistory({ refresh }) {

    const [urls, setUrls] = useState([]);
    const [selectedUrl, setSelectedUrl] = useState("");
    const [expandedId, setExpandedId] = useState(null);

    const fetchUrls = async () => {
        try {
            const response = await api.get("/urls");

            console.log("History:", response.data);

            if (Array.isArray(response.data)) {
                setUrls(response.data);
            } else {
                setUrls([]);
            }
        } catch (error) {
            console.error("Error fetching URLs:", error);
            setUrls([]);
        }
    };

    useEffect(() => {
        fetchUrls();

        const handleFocus = () => {
            fetchUrls();
        };

        window.addEventListener("focus", handleFocus);

        return () => {
            window.removeEventListener("focus", handleFocus);
        };
    }, [refresh]);

    const deleteUrl = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this URL?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            await api.delete(`/urls/${id}`);

            alert("URL Deleted Successfully!");

            fetchUrls();
        } catch (error) {
            console.error("Delete Error:", error);
            alert("Failed to delete URL");
        }
    };
    const copyToClipboard = async (shortUrl) => {
        try {
            await navigator.clipboard.writeText(shortUrl);
            alert("Short URL copied successfully!");
        } catch (error) {
            console.error(error);
            alert("Failed to copy URL.");
        }
    };


    return (
        <div className="card shadow p-4 mt-4">

            <h3>URL History</h3>

            <table className="table table-bordered table-hover">

                <thead className="table-dark">
                    <tr>
                        <th>Original URL</th>
                        <th>Short URL</th>
                        <th>Clicks</th>
                        <th>Copy</th>
                        <th>QR</th>
                        <th>AI</th>
                        <th>Delete</th>
                    </tr>
                </thead>

                <tbody>
                    {urls.length > 0 ? (
                        urls.map((url) => (
                            <Fragment key={url.id}>
                                <tr>
                                    <td>{url.originalUrl}</td>

                                    <td>
                                        <a
                                            href={url.shortUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            {url.shortCode}
                                        </a>
                                    </td>

                                    <td>{url.clickCount}</td>

                                    <td>
                                        <button
                                            className="btn btn-success btn-sm"
                                            onClick={() => copyToClipboard(url.shortUrl)}
                                        >
                                            📋 Copy
                                        </button>
                                    </td>

                                    <td>
                                        <button
                                            className="btn btn-info btn-sm"
                                            onClick={() => setSelectedUrl(url.shortUrl)}
                                        >
                                            📱 QR
                                        </button>
                                    </td>

                                    <td>
                                        <button
                                            className="btn btn-outline-primary btn-sm"
                                            onClick={() => setExpandedId(expandedId === url.id ? null : url.id)}
                                        >
                                            ✨ Insights
                                        </button>
                                    </td>

                                    <td>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => deleteUrl(url.id)}
                                        >
                                            🗑 Delete
                                        </button>
                                    </td>
                                </tr>

                                {expandedId === url.id && (
                                    <tr>
                                        <td colSpan="7" className="bg-light">
                                            <AiSummaryCard linkData={url} />
                                        </td>
                                    </tr>
                                )}
                            </Fragment>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-center">
                                No URLs Available
                            </td>
                        </tr>
                    )}
                </tbody>

            </table>
            {selectedUrl && (
                <div className="text-center mt-4">
                    <h5>QR Code</h5>

                    <div className="border rounded p-3 d-inline-block bg-white">
                        <QRCode
                            value={selectedUrl}
                            size={180}
                        />
                    </div>

                    <p className="mt-2">{selectedUrl}</p>

                    <button
                        className="btn btn-secondary"
                        onClick={() => setSelectedUrl("")}
                    >
                        Close
                    </button>
                </div>
            )}

        </div>
    );
}

export default UrlHistory;
