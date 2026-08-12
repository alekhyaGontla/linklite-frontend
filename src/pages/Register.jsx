import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../services/api";

function Register() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            await api.post("/auth/register", { name, email, password });

            await Swal.fire({
                icon: "success",
                title: "Registration Successful",
                text: "Please login with your new account."
            });

            navigate("/login");
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Registration Failed",
                text: error.response?.data || "Something went wrong."
            });
        }
    };

    return (
        <div className="container vh-100 d-flex justify-content-center align-items-center">
            <div className="card shadow-lg p-4" style={{ width: "420px" }}>
                <h2 className="text-center text-success mb-4">Create Account</h2>

                <form onSubmit={handleRegister}>
                    <input
                        className="form-control mb-3"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />

                    <input
                        type="email"
                        className="form-control mb-3"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        className="form-control mb-3"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button className="btn btn-success w-100">Register</button>
                </form>

                <button className="btn btn-link mt-3" onClick={() => navigate("/login")}>
                    ← Back to Login
                </button>
            </div>
        </div>
    );
}

export default Register;
