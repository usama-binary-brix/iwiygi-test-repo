"use client";

import BackStep from "@/components/backStep/BackStep";
import TextInput from "@/components/Form/TextInput";
import React, { useState } from "react";

const Page: React.FC = () => {
  // State for form fields
  const [streetAddress, setStreetAddress] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [zipCode, setZipCode] = useState<string>("");
  const [houseNumber, setHouseNumber] = useState<number | string>("");
  const [activeTab, setActiveTab] = useState<string>("shippingAddress");

  const handleAddress = async () => {
    const addressData = {
      streetAddress,
      city,
      zipCode,
      houseNumber,
    };

    try {
      const response = await fetch("/api/update-address", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(addressData),
      });

      if (!response.ok) {
        throw new Error("Failed to update address.");
      }

      const result = await response.json();
      console.log("Address updated successfully:", result);
    } catch (error) {
      console.error("Error updating address:", error);
    }
  };

  return (
    <div className="p-3">
      <div className="bg-black border-2 border-bright-green p-2 lg:p-8">
        <div className="container-fluid mx-3">
          {/* <h1 className='text-3xl font-bold py-3 '>My Orders</h1> */}
          <div className="text-2xl sm:text-3xl font-bold  mb-4 uppercase flex gap-3 justify-between items-center mt-3">
            <BackStep href="/profile" />
            <span>My Profile Settings</span>
            <div></div>
          </div>
          <div className="flex justify-center">
            <div className="flex mb-4">
              <button
                onClick={() => setActiveTab("contactInformation")}
                className={`px-8 py-2 cursor-pointer bg-gray-800 text-white border-2 border-transparent font-bold  ${
                  activeTab === "contactInformation" ? "active" : ""
                }`}
              >
                Contact Information
              </button>
              <button
                onClick={() => setActiveTab("shippingAddress")}
                className={`px-8 py-2 cursor-pointer bg-gray-800 text-white border-2 border-transparent font-bold  ${
                  activeTab === "shippingAddress" ? "active" : ""
                }`}
              >
                Shipping Addess
              </button>
              <button
                onClick={() => setActiveTab("updatePassword")}
                className={`px-8 py-2 cursor-pointer bg-gray-800 text-white border-2 border-transparent font-bold  ${
                  activeTab === "updatePassword" ? "active" : ""
                }`}
              >
                Update Password
              </button>
              
            </div>
          </div>
        </div>
        {/* <div className="text-2xl sm:text-3xl font-bold  mb-4 uppercase flex gap-3 justify-between items-center">
          <BackStep href="/profile" />
          <span>Your shipping Address</span>
          <div></div>
        </div> */}
        {activeTab === "contactInformation" && <></>}
        {activeTab === "shippingAddress" && (
          <form
            className="flex justify-center flex-col items-center"
            // onSubmit={handleSubmit}
          >
            <div className="flex flex-col gap-6 w-full md:max-w-[70%] lg:max-w-[65%] xl:max-w-[45%]">
              <TextInput
                name="state"
                label="State"
                onChange={(e) => setHouseNumber(e.target.value)}
                placeholder="Enter Your State"
              />

              <TextInput
                name="city"
                label="City"
                onChange={(e) => setCity(e.target.value)}
                placeholder="ENTER YOUR CITY"
              />

              <TextInput
                name="street address"
                label="Street Address"
                onChange={(e) => setStreetAddress(e.target.value)}
                placeholder="ENTER YOUR Street Address"
              />

              <TextInput
                name="zip code"
                label="Zip Code"
                onChange={(e) => setStreetAddress(e.target.value)}
                placeholder="ENTER ZIP CODE"
              />

              <div className="flex justify-end">
                <button
                  onClick={handleAddress}
                  type="submit"
                  className="bg-dark-green text-black rounded-lg px-4 py-2 uppercase font-bold text-lg lg:text-2xl  w-[fit-content]"
                >
                  Update Address
                </button>
              </div>
            </div>
          </form>
        )}
        {activeTab === "updatePassword" && <></>}

      </div>
    </div>
  );
};

export default Page;
