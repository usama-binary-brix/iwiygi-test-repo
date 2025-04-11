"use client";
import ListingsAdmin from "@/components/ListingsAdmin";
import { FC, useEffect, useState } from "react";
import Loader from "@/components/Loader";

// ADMIN PAGE
const AllListings: FC = () => {
  const [data, setData] = useState([]);
  const [noFound, setNoFound] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [listingsPerPage, setListingsPerPage] = useState<number>(10);
  const options = [10, 30, 50, 70, 100];

  useEffect(() => {
    GetAllListings();
  }, []);

  const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setListingsPerPage(Number(event.target.value));
  };

  const GetAllListings = async () => {
    try {
      setLoading(true);
      let accessToken = localStorage.getItem("accessToken")
      if (!accessToken) {
        console.error("Access token not found");
        return;
      }
      if (!accessToken) {
        console.error("Access token not found");
        return;
      }

      const admin = JSON.parse(localStorage.getItem("User") || "");
      const checkAdmin = admin?.role;
      let api = "";
      if (checkAdmin && checkAdmin === "admin") {
        api =
          `${process.env.NEXT_PUBLIC_API}/api/admin/fetchAllListings`;
      } else {
        api =
          `${process.env.NEXT_PUBLIC_API}/api/listings/fetchAllListings`;
      }
      const response = await fetch(api, {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const responseData = await response.json();
        if (responseData.error == "Not Found") {
          setNoFound(responseData.message);
        }
      } else {
        const Successresponse = await response.json();
        {
          admin === "iwiygi_admin"
            ? setData(Successresponse?.data?.listings?.data)
            : setData(Successresponse?.data);
        }
      }
    } catch (error) {
      // Handle error - show error message to the user, etc.
    } finally {
      setLoading(false);
    }
  };

  const indexOfLastListing = currentPage * listingsPerPage;
  const indexOfFirstListing = indexOfLastListing - listingsPerPage;
  const currentListings = data.slice(
    indexOfFirstListing,
    indexOfLastListing
  );

  const handleNextPage = () => {

    if (currentPage < Math.ceil(data.length / listingsPerPage)) {
      window.scrollTo({ top: 0});
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      window.scrollTo({ top: 0});

      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className="p-4">
      <>
        {loading && <Loader />}
        {!loading && (
          <>

            <ListingsAdmin listings={currentListings} />
            <div className="flex flex-col md:flex-row gap-5 justify-center items-center mt-4 md:float-right">

              <div className="text-white-700 mr-5">
                <label htmlFor="itemsPerPage" className="mr-2">
                  Items per page:
                </label>
                <select
                  id="itemsPerPage"
                  value={listingsPerPage}
                  onChange={handleItemsPerPageChange}
                  className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                >
                  {options.map(option => (
                    <option
                      key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-dark-green text-black rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2">
                  Page {currentPage} of {Math.ceil(data.length / listingsPerPage)}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === Math.ceil(data.length / listingsPerPage)}
                  className="px-4 py-2 bg-dark-green text-black rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>

          </>
        )}
      </>
    </div>
  );
};

export default AllListings;
