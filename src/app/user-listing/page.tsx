"use client";
import Listings from "@/components/Listings/UserListing";
import isAuth from "@/components/auth/isAuth";
import { FC, useEffect, useState } from "react";
import Loader from "@/components/Loader";
import axios from "axios";
import { toast } from "sonner";
import BackStep from "@/components/backStep/BackStep";
import Link from "next/link";
import { FaPlus } from "react-icons/fa";
import CreateListing from "@/components/generic/CreateListing";
import ListingButtons from "@/components/generic/ListingButtons";
import { IoAdd, IoHeartOutline, IoListOutline } from "react-icons/io5";
import { CgUserList } from "react-icons/cg";

const UserListing: FC = () => {
  const [data, setData] = useState([]);
  const [executeResponse, setexecuteResponse] = useState(false);
  const [categories, setCategories] = useState([]);
  const GetUserListings = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("User") || "");
      const userId = user.id;
      let accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        console.error("Access token not found");
        return;
      }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/listings/fetchListingByUserId/${userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setexecuteResponse(true);
      const responseData = await response.json();
      setData(responseData?.data);
    } catch (error) {
      // Handle error - show error message to the user, etc.
    }
  };
  const getCategoriesList = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API}/api/categories/categoriesList`
      );

      if (response.status === 200) {
        setCategories(response?.data?.data);
      }
    } catch (error) {
      toast.error("Something went wrong please try again after sometime.");
    }
  };
  useEffect(() => {
    getCategoriesList();
    GetUserListings();
  }, []);

  const listingRefresh = () => {
    GetUserListings();
  };

  return (
    <div className="p-4">
      <div className="">
        <div className="text-2xl sm:text-3xl font-bold  mb-4 flex gap-3 justify-between items-center mt-3">
          <BackStep href="/" />
          <span>My Listings</span>
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
        {!executeResponse ? (
          <Loader />
        ) : data?.length === 0 ? (
          <div className="text-lg sm:text-xl">No Listing Found. </div>
        ) : (
          <>
            <Listings
              listings={data}
              listingRefresh={listingRefresh}
              categories={categories}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default isAuth(UserListing);
