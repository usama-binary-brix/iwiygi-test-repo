import Button from "@/components/button/Button";
import { setUser } from "@/store/Slices/userSlice";
import { TextInput } from "flowbite-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { IoArrowBackSharp, IoClose } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
interface PopupProps {
  listingId: number | null;
  messageId: number | null;
  handleClosePopup: () => void;
}

const BuyNowPopup: React.FC<PopupProps> = ({
  listingId,
  messageId,
  handleClosePopup,
}) => {
  const states = {
    Alabama: "AL",
    Alaska: "AK",
    Arizona: "AZ",
    Arkansas: "AR",
    California: "CA",
    Colorado: "CO",
    Connecticut: "CT",
    Delaware: "DE",
    Florida: "FL",
    Georgia: "GA",
    Hawaii: "HI",
    Idaho: "ID",
    Illinois: "IL",
    Indiana: "IN",
    Iowa: "IA",
    Kansas: "KS",
    Kentucky: "KY",
    Louisiana: "LA",
    Maine: "ME",
    Maryland: "MD",
    Massachusetts: "MA",
    Michigan: "MI",
    Minnesota: "MN",
    Mississippi: "MS",
    Missouri: "MO",
    Montana: "MT",
    Nebraska: "NE",
    Nevada: "NV",
    "New Hampshire": "NH",
    "New Jersey": "NJ",
    "New Mexico": "NM",
    "New York": "NY",
    "North Carolina": "NC",
    "North Dakota": "ND",
    Ohio: "OH",
    Oklahoma: "OK",
    Oregon: "OR",
    Pennsylvania: "PA",
    "Rhode Island": "RI",
    "South Carolina": "SC",
    "South Dakota": "SD",
    Tennessee: "TN",
    Texas: "TX",
    Utah: "UT",
    Vermont: "VT",
    Virginia: "VA",
    Washington: "WA",
    "West Virginia": "WV",
    Wisconsin: "WI",
    Wyoming: "WY",
  };
  const [userName, setUserName] = useState<string>("");
  const [userAddress, setUserAddress] = useState<any>(null);
  const [showForm, setShowForm] = useState(true);
  const [loading, setLoading] = useState(false);
  const [buyNowLoading, setBuyNowLoading] = useState(false);
  const [localStorageUpdate, setLocalStorageUpdate] = useState(false);
  const dispatch = useDispatch()

  useEffect(() => {
    const storedAddress = localStorage.getItem("User") || "{}";
    const parsedAddress = JSON.parse(storedAddress);
    // const userData = useSelector((state:any)=>state)
    // console.log(userData, 'user data')
    setUserName(parsedAddress.username || "");

    setBuyerDetailData((prev) => ({
      ...prev,
      buyerName: parsedAddress.username || "",
      state: parsedAddress.state || "",
      streetAddress: parsedAddress.streetAddress || "",
      city: parsedAddress.city || "",
      zipCode: parsedAddress.zipCode || "",
      phone: parsedAddress.phone || "",

      houseNumber: '0'
    }));

    const hasAddress =
      parsedAddress.streetAddress &&
      parsedAddress.city &&
      parsedAddress.state &&
      parsedAddress.phone &&
      parsedAddress.zipCode;

    if (hasAddress) {
      setUserAddress(parsedAddress);
      setShowForm(false);
    }
  }, [localStorageUpdate]);

  const [buyerDetailData, setBuyerDetailData] = useState({
    buyerName: userName,
    state: "",
    streetAddress: "",
    city: "",
    zipCode: "",
    phone:"",


  });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setBuyerDetailData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const validateForm = (data: typeof buyerDetailData) => {
    if (!data.streetAddress) {
      toast.error("Please Enter your Street Address.");
      return false;
    }
    if (!data.city) {
      toast.error("Please Enter your City.");
      return false;
    }

    if (!data.zipCode) {
      toast.error("Please Enter your Zip Code.");
      return false;
    }
    return true;
  };

  const handleSubmitBuyerInformation = async () => {
    if (!validateForm(buyerDetailData)) return;

    const payload = {
      ...buyerDetailData,

    };
    setLoading(true);
    try {
      let accessToken = localStorage.getItem("accessToken");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/auth/updateShippingAddress`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const responseData = await response.json();

      if (response.ok) {
        console.log(responseData, "response data");
        // dispatch(setUser(responseData.user));
        localStorage.setItem("User", JSON.stringify(responseData.user));
        toast.success("Your shipping information has been added successfully.");
        setLocalStorageUpdate((prev) => !prev);
        setShowForm(false);
        setLoading(false);
        // handleClosePopup();
      } else {
        setLoading(false);

        toast.error(responseData?.message || "Something went wrong.");
      }
    } catch (error) {
      setLoading(false);
      toast.error("An error occurred while submitting your information.");
    }
  };
  const [deliveryTime, setDeliveryTime] = useState('');

  const handleBuyNow = async () => {
    const payload = {
      listingId,
      messageId,
      shippingTypeStatus: deliveryTime
    };

    setBuyNowLoading(true);

    try {
      const accessToken = localStorage.getItem("accessToken");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/payments/buyer-buy-now`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const responseBuyNowData = await response.json();

      if (response.ok) {
        toast.success(
          "Congratulations on initiating the request. You will receive an invoice from the seller shortly."
        );
        setBuyNowLoading(false);
        handleClosePopup();
      } else {
        setBuyNowLoading(false);
        toast.error(responseBuyNowData?.message || "Something went wrong.");
      }
    } catch (error) {
      setBuyNowLoading(false);
      toast.error("An error occurred while submitting your information.");
    }
  };


  // const handleBuyNow = async () => {
  //   const payload = {
  //     listingId,
  //     messageId,
  //   };
  //   setBuyNowLoading(true);
  //   try {
  //     let accessToken = localStorage.getItem("accessToken");

  //     const response = await fetch(
  //       `${process.env.NEXT_PUBLIC_API}/api/payments/buyer-buy-now`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${accessToken}`,
  //         },
  //         body: JSON.stringify(payload),
  //       }
  //     );

  //     const responseBuyNowData = await response.json();

  //     if (response.ok) {
  //       toast.success(
  //         "Congratulations on initiating the request. You will receive an invoice from the seller shortly."
  //       );
  //       setBuyNowLoading(false);
  //       handleClosePopup();
  //     } else {
  //       setLoading(false);

  //       toast.error(responseBuyNowData?.message || "Something went wrong.");
  //     }
  //   } catch (error) {
  //     setBuyNowLoading(false);

  //     toast.error("An error occurred while submitting your information.");
  //   }
  // };

  return (
    <>
      {/* <div
        style={{ transform: "translate(-50%, -40%)", zIndex: "1", width: "" }}
        className="absolute h-[440px] xl:h-[500px] overflow-auto bg-black top-1/2 left-1/2 border-2 border-bright-green rounded w-[300px] md:w-[500px] lg:w-[600px] xl:w-[600px]"
      > */}
      <div className="relative">
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="p-5">
            <div
              className="bg-black p-4 rounded-lg relative md:min-w-[30rem]"
            // style={{
            //   boxShadow: "1px 1px 10px 2px green",
            // }}
            >
              <button
                onClick={handleClosePopup}
                className="absolute top-2 right-2 text-white-600 font-bold"
              >
                <IoClose className="text-[2rem]" />
              </button>
              <div className="flex justify-center">
                <Image
                  src="/images/ive-got.png"
                  alt="Perfume"
                  width={190}
                  height={70}
                  className=" cursor-pointer mb-[12px] max-w-[50%] md:max-w-[100%] lg:max-w-[100%] xl:max-w-[100%]"
                />
              </div>
              <h2 className="text-sm md:text-md font-semibold mb-4 text-center">
                <span
                  className="text-black p-2"
                  style={{ backgroundColor: "rgb(7, 248, 24)" }}
                >
                  CONGRATULATIONS -  YOU GOT IT!
                </span>
              </h2>
              <p className="mb-[10px]  items-center text-center text-bright-green text-sm">
                Confirm Your Shipping Address
              </p>

              {showForm ? (
                <>
                  <div className="address-container">
                    <div>
                      {userAddress && (
                        <div>
                          <IoArrowBackSharp
                            onClick={() => setShowForm(false)}
                            className="text-bright-green text-[1.5rem] cursor-pointer"
                          />
                        </div>
                      )}

<div className="flex items-center mb-2">
                        <label
                          className="mr-4 "
                          style={{
                            width: "70%",
                            fontSize: "16px",
                            fontWeight: "600",
                          }}
                        >
                     Phone Number
                        </label>
                        <input
                          onChange={handleInputChange}
                          value={buyerDetailData.phone || ""} // Show an empty string if value is null
                          name="phone"
                          type="text"
                          placeholder="Enter Phone Number" // Sample data
                          className="border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-black"
                        />
                      </div>


                      <div className="flex items-center mb-2">
                        <label
                          className="mr-4 "
                          style={{
                            width: "70%",
                            fontSize: "16px",
                            fontWeight: "600",
                          }}
                        >
                          Street Adress
                        </label>
                        <input
                          onChange={handleInputChange}
                          value={buyerDetailData.streetAddress || ""} // Show an empty string if value is null
                          name="streetAddress"
                          type="text"
                          placeholder="Enter Address" // Sample data
                          className="border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-black"
                        />
                      </div>

                      <div className="flex items-center mb-2">
                        <label
                          className="mr-4 "
                          style={{
                            width: "70%",
                            fontSize: "16px",
                            fontWeight: "600",
                          }}
                        >
                          City
                        </label>
                        <input
                          onChange={handleInputChange}
                          value={buyerDetailData.city || ""} // Show an empty string if value is null
                          name="city"
                          type="text"
                          placeholder="Enter City" // Sample data
                          className="border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-black"
                        />
                      </div>

                      {/* <div className="flex items-center mb-2">
                    <label
                      className="mr-4 "
                      style={{
                        width: "70%",
                        fontSize: "16px",
                        fontWeight: "600",
                      }}
                    >
                      House Number
                    </label>
                    <input
                      onChange={handleInputChange}
                      value={buyerDetailData.houseNumber || ""} // Show an empty string if value is null
                      name="houseNumber"
                      type="text"
                      placeholder="Enter Pin Location" // Sample data
                      className="border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-black"
                    />
                  </div> */}

                      <div className="flex items-center mb-2">
                        <label
                          className="mr-4 "
                          style={{
                            width: "70%",
                            fontSize: "16px",
                            fontWeight: "600",
                          }}
                        >
                          State
                        </label>
                        <select
                          onChange={handleInputChange}
                          value={buyerDetailData.state || ""}
                          name="state"
                          className="border border-gray-300 p-2 ml-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-black"
                        >
                          <option value="" disabled>
                            Select a state
                          </option>
                          {Object.entries(states).map(([stateName]) => (
                            <option key={stateName} value={stateName}>
                              {stateName}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center mb-2">
                        <label
                          className="mr-4 "
                          style={{
                            width: "70%",
                            fontSize: "16px",
                            fontWeight: "600",
                          }}
                        >
                          Zip Code
                        </label>
                        <input
                          onChange={handleInputChange}
                          value={buyerDetailData.zipCode || ""} // Show an empty string if value is null
                          name="zipCode"
                          type="text"
                          placeholder="Enter Zip Code" // Sample data
                          className="border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-black"
                        />
                      </div>

                      {/* <p> Want to change the Shipping address? <a className="text-bright-green cursor-pointer" href="/my-profile">Go to Profile</a></p> */}

                      <div className="flex justify-center mt-6 gap-2">
                        <Button
                          text="Cancel"
                          type="success"
                          className=" text-black flex item-end"
                          onClick={() => setShowForm(false)}
                        />

                        {userAddress ? (
                          <Button
                            loading={loading}
                            text="Update address"
                            type="success"
                            className=" text-black flex item-end"
                            onClick={handleSubmitBuyerInformation}
                          />
                        ) : (
                          <Button
                            loading={loading}
                            text="Add address"
                            type="success"
                            className=" text-black flex item-end"
                            onClick={handleSubmitBuyerInformation}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-col items-center w-full">
                  <div className="flex justify-between items-start w-full border border-white rounded p-3 mb-2">
                      <div>
                        <span>{userAddress?.phone} </span>
                     
                      </div>

                    </div>

                    <div className="flex justify-between items-start w-full border border-white rounded p-3">
                      <div>
                        <span>{userAddress?.streetAddress} </span>
                        <span>{userAddress?.city} </span>
                        <span>{userAddress?.state} </span>
                        <span>{userAddress?.zipCode} </span>
                      </div>

                      <MdEdit
                        onClick={() => setShowForm(true)}
                        className="text-bright-green text-[1.5rem] cursor-pointer"
                      />
                    </div>
                    <select
                      className="w-full border mt-2 border-white rounded p-3 bg-transparent text-white"
                      value={deliveryTime}
                      onChange={(e) => setDeliveryTime(e.target.value)}
                    >
                      <option className="text-black" value="PRIORITY_EXPRESS">PRIORITY EXPRESS</option>
                      <option className="text-black" value="PRIORITY">PRIORITY</option>
                      <option className="text-black" value="GROUND">GROUND</option>
                    </select>



                    <br />


                    <Button
                      loading={buyNowLoading}
                      onClick={handleBuyNow}
                      text="Confirm address"
                      type="success"
                      className=" bg-bright-green text-black flex item-end"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BuyNowPopup;
