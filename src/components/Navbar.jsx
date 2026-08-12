import { Link, useNavigate } from "react-router-dom";


function Navbar() {


    const navigate = useNavigate();



    const logout = () => {


        localStorage.clear();


        navigate("/login");


        window.location.reload();


    };



    return (


        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">


            <div className="container">



                <Link

                    className="navbar-brand fw-bold"

                    to="/dashboard"

                >

                    🔗 LinkLite

                </Link>







                <ul className="navbar-nav ms-auto">



                    <li className="nav-item">

                        <Link

                            className="nav-link"

                            to="/dashboard"

                        >

                            Dashboard

                        </Link>


                    </li>







                    <li className="nav-item">

                        <Link

                            className="nav-link"

                            to="/urls"

                        >

                            URL Manager

                        </Link>


                    </li>







                    <li className="nav-item">

                        <Link

                            className="nav-link"

                            to="/analytics"

                        >

                            Analytics

                        </Link>


                    </li>







                    <li className="nav-item">

                        <Link

                            className="nav-link"

                            to="/profile"

                        >

                            Profile

                        </Link>


                    </li>







                    <li className="nav-item">


                        <button

                            className="btn btn-danger ms-3"

                            onClick={logout}

                        >

                            Logout

                        </button>


                    </li>




                </ul>



            </div>


        </nav>


    );


}


export default Navbar;