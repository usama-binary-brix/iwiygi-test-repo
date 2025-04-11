"use client";
import Listings from "@/components/Listings/SavedListing";
import isAuth from "@/components/auth/isAuth";
import BackStep from "@/components/backStep/BackStep";
import CreateListing from "@/components/generic/CreateListing";
import ListingButtons from "@/components/generic/ListingButtons";
import { useGetSavedListingsQuery } from "@/store/api";
import { FC, useEffect, useState } from "react";
import { CgUserList } from "react-icons/cg";
import { IoAdd, IoHeartOutline, IoListOutline } from "react-icons/io5";

const SavedListings: FC = () => {
  // const [data, setData] = useState([]);
  // const [noFound, setNoFound] = useState("");

  // useEffect(() => {
  //   GetSavedListings();
  // }, []);

  // const GetSavedListings = async () => {
  //   try {
  //     let accessToken = localStorage.getItem("accessToken");
  //     if (!accessToken) {
  //       console.error("Access token not found");
  //       return;
  //     }
  //     const response = await fetch(
  //       `${process.env.NEXT_PUBLIC_API}/api/listings/fetchSavedListings`,
  //       {
  //         method: "GET",
  //         mode: "cors",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${accessToken}`,
  //         },
  //       }
  //     );
  //     if (!response.ok) {
  //       const responseData = await response.json();
  //       if (responseData.error == "Not Found") {
  //         setNoFound(responseData.message);
  //       }
  //       console.log(responseData);
  //     } else {
  //       const Successresponse = await response.json();
  //       setData(Successresponse?.data);
  //     }
  //   } catch (error) {
  //     // Handle error - show error message to the user, etc.
  //   }
  // };

  // const refreshListing = () => {
  //   GetSavedListings();
  // };

  const { data, error, isLoading, refetch } = useGetSavedListingsQuery(null);
  useEffect(() => {
    refetch();
  }, [refetch]);
  return (
    <div className="p-4">
      <div className="">
        <div className="mt-3 text-2xl sm:text-3xl font-bold  mb-4 flex gap-3 justify-between items-center">
          <BackStep href="/" />
          <span>Saved Listings</span>
          {/* <div>
            <CreateListing />
          </div> */}
              <div className="flex items-center gap-2">
          <ListingButtons icon={<IoListOutline />} url={"/listings/search"} />
          <ListingButtons icon={<CgUserList />} url={"/user-listing"} />
          <ListingButtons icon={<IoHeartOutline />} url={"/saved-listings"} />
          <ListingButtons icon={<IoAdd />} url={"/create-listing"} />

        </div>
        </div>
        {/* {noFound !== "" ? (
          <div className="text-lg sm:text-xl">No Saved Listing. </div>
        ) : (
          <Listings listings={data} refreshListing={refreshListing} />
        )} */}


           {!isLoading && error  && (
          <div className="text-lg sm:text-xl">No Saved Listing.</div>
        )}
        {!isLoading && !error && data?.data?.length > 0 && (
          <Listings listings={data.data} refreshListing={refetch} />
        )}
      </div>
    </div>
  );
};

export default isAuth(SavedListings);
