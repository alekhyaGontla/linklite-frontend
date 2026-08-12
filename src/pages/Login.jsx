import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../services/api";

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        Swal.fire({
            title: "Signing In...",
            text: "Please wait",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            const response = await api.post("/auth/login", { email, password });

            Swal.close();

            localStorage.setItem("isLoggedIn", "true");

            if (typeof response.data === "object" && response.data !== null) {
                // Future JWT support
                localStorage.setItem("userEmail", response.data.email || email);

                if (response.data.token) {
                    localStorage.setItem("token", response.data.token);
                }
            } else {
                // Current backend response shape
                localStorage.setItem("userEmail", email);
            }

            await Swal.fire({
                icon: "success",
                title: "Login Successful",
                text: "Welcome to LinkLite!",
                timer: 1500,
                showConfirmButton: false
            });

            navigate("/dashboard");
        } catch (error) {
            Swal.close();

            Swal.fire({
                icon: "error",
                title: "Login Failed",
                text: error.response
                    ? (typeof error.response.data === "string"
                        ? error.response.data
                        : error.response.data?.message || "Invalid Email or Password")
                    : "Unable to connect to the server.",
                confirmButtonColor: "#dc3545"
            });
        }
    };

    return (
        <div className="container vh-100 d-flex justify-content-center align-items-center">
            <div className="card shadow-lg p-4" style={{ width: "430px", borderRadius: "20px" }}>
                <div className="text-center mb-4">
                    <h2 className="text-primary fw-bold">🔗 LinkLite</h2>
                    <p className="text-muted">Sign in to continue</p>
                </div>

                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Enter Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-semibold">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Enter Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-100 mt-2">
                        Login
                    </button>
                </form>

                <hr />

                <div className="text-center">
                    <p className="mb-2">Don't have an account?</p>
                    <button
                        type="button"
                        className="btn btn-success w-100"
                        onClick={() => navigate("/register")}
                    >
                        Create New Account
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;
