import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { SearchContext } from "../context/SearchContext";


function SearchBar() {


    const { search, setSearch } = useContext(SearchContext);


    const navigate = useNavigate();




    const handleSearch = (e) => {


        const value = e.target.value;


        setSearch(value);



        if(value.trim() !== "") {

            navigate("/urls");

        }


    };





    const clearSearch = () => {


        setSearch("");

        navigate("/urls");


    };





    return (


        <div className="input-group">


            <span className="input-group-text">

                🔍

            </span>




            <input


                type="text"


                className="form-control"


                placeholder="Search by URL, Alias or Short Code..."


                value={search}


                onChange={handleSearch}


            />





            {
                search &&


                <button


                    className="btn btn-outline-light"


                    onClick={clearSearch}


                >

                    Clear


                </button>


            }




        </div>


    );


}


export default SearchBar;