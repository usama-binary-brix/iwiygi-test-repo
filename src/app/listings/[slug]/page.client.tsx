"use client";

import Button from "@/components/button/Button";
import { useGetListingDetailsQuery } from "@/store/api";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import Loader from "@/components/Loader";
import axios from "axios";
import Share from "@/components/Share";

const Page = () => {
  const params = useParams();
  const slug = params?.slug as string | undefined;
  const router = useRouter();
  const { data, isLoading, error } = useGetListingDetailsQuery(slug);
  const [gotItLoading, setGotItLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  if (!slug) {
    return <p>No slug found!</p>;
  }

  const handleGotItPopup = async (id: number, listingPostedBy: any) => {
    setGotItLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setGotItLoading(false);
        return router.push("/sign-in");
      }

      router.push(`/listings/got-it/${id}`);
    } catch (error) {
      toast.error("Something went wrong! Please try again.");
    } finally {
      setGotItLoading(false);
    }
  };

  const handleSaveListing = async (id: any) => {
    setSaveLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setSaveLoading(false);
        return router.push("/sign-in");
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/api/listings/saveListing`,
        { listingId: id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success(response?.data?.message);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong!");
    } finally {
      setSaveLoading(false);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="flex items-center justify-center h-auto my-10 px-5">
      <div className="max-w-lg bg-transparent border border-bright-green rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <div className="w-full h-[300px] relative">
          <Image
            src={
              data?.featuredImage ||
              "https://iwiygi-assets.s3.amazonaws.com/not_found_image.png"
            }
            alt="No Image"
            className="w-full h-[300px] rounded-md"
            layout="fill"
          />
        </div>

        <div className="p-5">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-white dark:text-white">
            {data?.title}
          </h5>
          <p className="mb-3 font-normal text-white">{data?.description}</p>

          <div>
            <Share />
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <Button
              text="I've Got it"
              type={"success"}
              className="w-full"
              loading={gotItLoading}
              onClick={() => handleGotItPopup(data.id, data.listingPostedBy)}
            />
            <Button
              text="Save to Profile"
              type={"success"}
              className="w-full"
              loading={saveLoading}
              onClick={() => handleSaveListing(data.id)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
