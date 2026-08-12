import { useState, useContext } from "react";

import UrlForm from "../components/UrlForm";
import SearchBar from "../components/SearchBar";
import UrlHistory from "../components/UrlHistory";

import { SearchContext } from "../context/SearchContext";


function UrlList() {


    const [refresh, setRefresh] = useState(false);



    const { search } = useContext(SearchContext);




    return (


        <div className="container py-4">



            <h2 className="mb-4">

                🔗 URL Manager

            </h2>





            <div className="row">





                <div className="col-lg-4">



                    <UrlForm


                        onUrlCreated={() =>

                            setRefresh(!refresh)

                        }


                    />


                </div>








                <div className="col-lg-8">





                    <SearchBar />







                    <div className="mt-3">



                        <UrlHistory


                            refresh={refresh}


                            search={search}


                        />



                    </div>





                </div>






            </div>




        </div>


    );


}


export default UrlList;