import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function Profile() {

    const navigate = useNavigate();

    const email = localStorage.getItem("userEmail");

    const logout = () => {

        Swal.fire({
            title: "Logout?",
            text: "Do you want to logout from LinkLite?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#0d6efd",
            cancelButtonColor: "#dc3545",
            confirmButtonText: "Logout"
        }).then((result) => {

            if (result.isConfirmed) {

                localStorage.clear();

                navigate("/login");

                window.location.reload();

            }

        });

    };

    return (

        <div className="container py-5">

            <div className="row justify-content-center">

                <div className="col-lg-6">

                    <div className="card shadow border-0">

                        <div className="card-body text-center">

                            <img
                                src="https://ui-avatars.com/api/?name=Admin&background=0D6EFD&color=fff&size=150"
                                alt="Profile"
                                className="rounded-circle mb-4"
                            />

                            <h2>Admin</h2>

                            <p className="text-muted">

                                {email}

                            </p>

                            <hr />

                            <div className="text-start">

                                <p>

                                    <strong>Email</strong><br />

                                    {email}

                                </p>

                                <p>

                                    <strong>Role</strong><br />

                                    Administrator

                                </p>

                                <p>

                                    <strong>Status</strong><br />

                                    Active

                                </p>

                            </div>

                            <button
                                className="btn btn-danger w-100 mt-3"
                                onClick={logout}
                            >
                                Logout
                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Profile;