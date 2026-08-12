function RecentActivity() {

    const activities = [
        {
            icon: "🔗",
            title: "Short URL Created",
            desc: "A new short URL was generated."
        },
        {
            icon: "📋",
            title: "URL Copied",
            desc: "A short URL was copied."
        },
        {
            icon: "📱",
            title: "QR Generated",
            desc: "QR Code generated successfully."
        },
        {
            icon: "🗑️",
            title: "URL Deleted",
            desc: "A URL was removed."
        }
    ];

    return (

        <div className="card shadow border-0">

            <div className="card-header bg-primary text-white">

                <h5 className="mb-0">
                    📜 Recent Activity
                </h5>

            </div>

            <div className="card-body">

                {activities.map((activity, index) => (

                    <div
                        key={index}
                        className="d-flex mb-3"
                    >

                        <div
                            className="fs-3 me-3"
                        >
                            {activity.icon}
                        </div>

                        <div>

                            <h6 className="mb-1">

                                {activity.title}

                            </h6>

                            <small className="text-muted">

                                {activity.desc}

                            </small>

                        </div>

                    </div>

                ))}

            </div>

        </div>

    );

}

export default RecentActivity;