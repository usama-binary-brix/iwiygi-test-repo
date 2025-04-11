"use client";

import BackStep from "@/components/backStep/BackStep";
import { useEffect, useState } from "react";
import ContactInformation from "./ContactInformation";
import ShippingAddress from "./ShippingAddress";
import UpdatePassword from "./UpdatePassword";
import StripeAndPayout from "./StripeAndPayout";
import StateTaxCreateCustomer from "./StateTaxCreateCustomer";

const Page = () => {
  const [activeTab, setActiveTab] = useState<string>("contactInformation");

  const [userDetail, setuserDetail] = useState({});

  const getUserDetail = async () => {
    const UpdateProfilePostApi = `${process.env.NEXT_PUBLIC_API}/api/auth/getUser`;
    let accessToken = localStorage.getItem("accessToken");

    try {
      const response = await fetch(UpdateProfilePostApi, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json(); // Parse JSON from the response
      setuserDetail(data?.data); // Set the parsed data to state
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };
  useEffect(() => {
    getUserDetail();
  }, []);

  return (
    <>
      <div className="p-3">
        <div className="bg-black border-2 border-bright-green p-2 lg:p-8">
          <div className="container-fluid mx-3">
            <div className="text-2xl sm:text-3xl font-bold  mb-4 flex gap-3 justify-between items-center mt-3">
              <BackStep 
              href="/"
               />
              <span>My Profile Settings</span>
              <div></div>
            </div>
            <div className="flex justify-center">
              <div className="flex flex-col md:flex-row mb-4">
                <button
                  onClick={() => setActiveTab("contactInformation")}
                  className={`px-8 py-2 cursor-pointer border-2 font-bold  lg:rounded-tl-lg lg:rounded-bl-lg ${
                    activeTab === "contactInformation"
                      ? "bg-bright-green text-black border-black"
                      : "bg-gray-800 text-white border-transparent"
                  }`}
                >
                  Contact Information
                </button>

                <button
                  onClick={() => setActiveTab("shippingAddress")}
                  className={`px-8 py-2 cursor-pointer border-2 font-bold  ${
                    activeTab === "shippingAddress"
                      ? "bg-bright-green text-black border-black"
                      : "bg-gray-800 text-white border-transparent"
                  }`}
                >
                  Shipping Address
                </button>
                <button
                  onClick={() => setActiveTab("updatePassword")}
                  className={`px-8 py-2 cursor-pointer border-2 font-bold  ${
                    activeTab === "updatePassword"
                      ? "bg-bright-green text-black border-black"
                      : "bg-gray-800 text-white border-transparent"
                  }`}
                >
                  Update Password
                </button>

                {/* <button
                  onClick={() => setActiveTab("taxCalculate")}
                  className={`px-8 py-2 cursor-pointer border-2 font-bold  ${
                    activeTab === "taxCalculate"
                      ? "bg-bright-green text-black border-black"
                      : "bg-gray-800 text-white border-transparent"
                  }`}
                >
                  Tax Pay Calculation
                </button> */}

                <button
                  onClick={() => setActiveTab("payout")}
                  className={`px-8 py-2 cursor-pointer border-2 font-bold  lg:rounded-tr-lg lg:rounded-br-lg ${
                    activeTab === "payout"
                      ? "bg-bright-green text-black border-black"
                      : "bg-gray-800 text-white border-transparent"
                  }`}
                >
                  Payout / Stripe
                </button>
                
              </div>
            </div>
          </div>
          {activeTab === "contactInformation" && (
            <ContactInformation userDetail={userDetail} />
          )}
          {activeTab === "shippingAddress" && (
            <ShippingAddress userDetail={userDetail} />
          )}
          {activeTab === "updatePassword" && <UpdatePassword />}

          {/* {activeTab === "taxCalculate" && <StateTaxCreateCustomer />} */}
          {activeTab === "payout" && (
            <StripeAndPayout userDetail={userDetail} />
          )}
        </div>
      </div>
    </>
  );
};

export default Page;
