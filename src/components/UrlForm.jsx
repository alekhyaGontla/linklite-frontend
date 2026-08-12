import { useState } from "react";
import api from "../services/api";

function UrlForm() {

    const [originalUrl, setOriginalUrl] = useState("");
    const [customAlias, setCustomAlias] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [shortUrl, setShortUrl] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");



    const handleSubmit = async (e) => {

        e.preventDefault();


        setError("");
        setMessage("");
        setShortUrl("");



        // Expiry validation
        if (expiryDate) {


            const selectedExpiry = new Date(expiryDate);


            const minimumTime = new Date(
                Date.now() + 5 * 60 * 1000
            );



            if (selectedExpiry <= minimumTime) {


                setError(
                    "Expiry date must be at least 5 minutes from now"
                );


                return;


            }

        }






        const requestData = {


            originalUrl,


            customAlias: customAlias || null,


            expiryDate: expiryDate || null


        };







        try {


            const response = await api.post(
                "/urls",
                requestData
            );



            console.log(
                "Response:",
                response.data
            );





            const generatedUrl =

                response.data.shortUrl ||

                `http://localhost:8080/${response.data.shortCode}`;





            setShortUrl(generatedUrl);


            setMessage(
                "Short URL Created Successfully!"
            );





            setOriginalUrl("");

            setCustomAlias("");

            setExpiryDate("");



        }





        catch (err) {


            console.error(
                "Error:",
                err
            );



            if (err.response) {



                if (err.response.data?.messages) {



                    setError(

                        Object.values(
                            err.response.data.messages
                        )[0]

                    );


                }



                else if (err.response.data?.message) {



                    setError(
                        err.response.data.message
                    );


                }



                else {


                    setError(
                        "Invalid URL. Please try again."
                    );


                }



            }



            else {


                setError(
                    "Network error. Please check server."
                );


            }


        }


    };









    return (


        <div className="card shadow p-4">



            <h3>
                Create Short URL
            </h3>





            {message && (

                <div className="alert alert-success">

                    ✅ {message}

                </div>

            )}






            {error && (

                <div className="alert alert-danger">

                    ❌ {error}

                </div>

            )}







            <form onSubmit={handleSubmit}>


                <div className="mb-3">


                    <label className="form-label">

                        Original URL

                    </label>



                    <input

                        type="url"

                        className="form-control"

                        placeholder="https://www.google.com"

                        value={originalUrl}

                        onChange={(e)=>
                            setOriginalUrl(e.target.value)
                        }

                        required

                    />


                </div>









                <div className="mb-3">


                    <label className="form-label">

                        Custom Alias

                    </label>




                    <input

                        type="text"

                        className="form-control"

                        placeholder="google"

                        value={customAlias}

                        onChange={(e)=>
                            setCustomAlias(e.target.value)
                        }

                    />


                </div>









                <div className="mb-3">


                    <label className="form-label">

                        Expiry Date

                    </label>




                    <input


                        type="datetime-local"


                        className="form-control"


                        value={expiryDate}



                        min={

                            new Date(
                                Date.now() + 5 * 60 * 1000
                            )

                            .toISOString()

                            .slice(0,16)

                        }



                        onChange={(e)=>
                            setExpiryDate(e.target.value)
                        }



                    />



                </div>









                <button


                    type="submit"


                    className="btn btn-primary w-100"



                >

                    Generate Short URL


                </button>





            </form>









            {shortUrl && (


                <div className="alert alert-info mt-4">


                    <h5>

                        Generated Short URL

                    </h5>





                    <a


                        href={shortUrl}


                        target="_blank"


                        rel="noreferrer"


                    >

                        {shortUrl}


                    </a>



                </div>


            )}



        </div>


    );


}


export default UrlForm;