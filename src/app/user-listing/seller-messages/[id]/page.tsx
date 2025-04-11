"use client";

import isAuth from "@/components/auth/isAuth";
import { Textarea } from "flowbite-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Loader from "@/components/Loader";
import Image from "next/image";
import { toast } from "sonner";
import ChatBox from "./ChatBox";

function SellerMessages({ params }: { params: { id: any } }) {
  console.log('params----------->',params);
  
  const [loading, setLoading] = useState(false);
  const [messages, setMessage] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [viewInvoiceModal, setViewInvoiceModal] = useState(false);
  const [streetAddress, setStreetAddress] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [url, setURL] = useState<string>("");

  const [houseNumber, setHouseNumber] = useState<string>("");
  const [messageId, setMessageId] = useState<any>();
  const [count, setCount] = useState(false);
  const [buyerDetailResponse, setBuyerDetailResponse] = useState(null);
  const [buyerDetailError, setBuyerDetailError] = useState(null);
  const [buyerDetailData, setBuyerDetailData] = useState({
    buyerName: null,
    state: null,
    streetAddress: null,
    city: null,
    zipCode: null,
    pinLocation: null,
    listingId: 0,
    messageId: 0,
  });

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

  const getMessagesById = async (listingId: any) => {
    let accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      console.error("Access token not found");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API}/api/chat/sellerFirstMessages/${listingId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.status === 200) {
        setLoading(false);
        setMessage(response?.data?.data);
      }
    } catch (error) {
      setLoading(false);
      toast.error("Something went Wrong Try Again After Sometime.");
    }
  };

  const handleshowModal = (messageId: any) => {
    setMessageId(messageId);
    setShowModal(true);
  };
  const handleClosePopup = () => {
    setShowModal(false);
  };
  
  const router = useRouter();
  useEffect(() => {
    if (!count) {
      setCount(true);
      // getMessagesById(params.id);
    }
  }, [params.id]);

  // console.log('iddddd', messages)

  const handleRespondToMessage = (id: any) => {
    router.push(`/user-listing/buyer-seller-conversation/${id}`);
  };
  const handleAlreadyAddedInfo = async () => {
    toast.error(
      "Your Shipping is already Added and you have recieved inovice Email please pay it, thanks"
    );
    return;
  };
  const handleSubmitBuyerInformation = async () => {
    if (buyerDetailData.streetAddress === "") {
      toast.error("Please enter your streetstreetAddress");
      return false;
    }
    if (buyerDetailData.city === "") {
      toast.error("Please enter your city name");
      return false;
    }
    if (buyerDetailData.pinLocation === "") {
      toast.error("Please enter your house Numer  / office location");
      return false;
    }
    try {
      let accessToken = localStorage.getItem("accessToken");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/payments/buyer-shipping-information-store`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            ...buyerDetailData,
            listingId: Number(params.id),
            messageId,
          }),
        }
      );
      await response.json();
      if (response.ok) {
        setCount(false);
        getMessagesById(params.id);
        toast.success(
          "Your personal information has been successfully stored. You will receive invoice shortly."
        );
      } else {
        toast.error("Something went wrong");
      }
      handleClosePopup();
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred.");
    }
  };

  // invoice Modal

  const handleInvoiceModal = () => {
    setViewInvoiceModal(true);
  };

  const handleInvoiceView = () => {
    window.open(url, "_blank");
  };

  const handleCloseInvoiceModal = () => {
    setViewInvoiceModal(false);
  };

  // buyerDetail Api implementation

  const handleBuyerDetailPostRequest = async () => {
    try {
      const response = await fetch(
        "http://localhost:3002/api/payments/buyer-shipping-information-store",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(buyerDetailData),
        }
      );

      const data = await response.json();
      setBuyerDetailResponse(data);
      setBuyerDetailError(null);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setBuyerDetailData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <ChatBox message={messages} loading={loading} params={params?.id}/>

      {/* {loading && <Loader />}
      {messages.length > 0 ? (
        messages.map((item: any, key: any) => (
          <div key={key} className="gap-2">
            <div className="flex flex-col md:flex-row justify-around gap-4 p-4 text-white ml-4">
              <label className="text-bright-green font-bold  text-2xl">
                Message {key + 1}:
              </label>
              <div className="flex flex-col">
                <Textarea
                  className="w-full bg-gray-100 p-2 rounded"
                  value={item.message}
                  style={{
                    borderRadius: 0,
                    borderWidth: 0,
                    height: "80px",
                  }}
                />
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 mt-2">
                  <img
                    src={
                      item.images[0]?.imageURL ||
                      "https://iwiygi-assets.s3.amazonaws.com/not_found_image.png"
                    }
                    alt="Perfume"
                    className="w-[198.5px] h-[140px] cursor-pointer"
                  />
                  <img
                    src={
                      item.images[1]?.imageURL ||
                      "https://iwiygi-assets.s3.amazonaws.com/not_found_image.png"
                    }
                    alt="Perfume"
                    className="w-[198.5px] h-[140px] cursor-pointer"
                  />
                  <img
                    src={
                      item.images[2]?.imageURL ||
                      "https://iwiygi-assets.s3.amazonaws.com/not_found_image.png"
                    }
                    alt="Perfume"
                    className="w-[198.5px] h-[140px] cursor-pointer"
                  />
                  <img
                    src={
                      item.images[3]?.imageURL ||
                      "https://iwiygi-assets.s3.amazonaws.com/not_found_image.png"
                    }
                    alt="Perfume"
                    className="w-[198.5px] h-[140px] cursor-pointer"
                  />
                  <img
                    src={
                      item.images[4]?.imageURL ||
                      "https://iwiygi-assets.s3.amazonaws.com/not_found_image.png"
                    }
                    alt="Perfume"
                    className="w-[198.5px] h-[140px] cursor-pointer"
                  />
                </div>
              </div>
              <div className="flex flex-col justify-center">
                {item.invoice && item.invoice.streetAddress != "" ? (
                  <button
                    onClick={handleAlreadyAddedInfo}
                    className="relative bg-black border-4 border-bright-green text-white font-bold   py-8  hover:shadow-lg"
                    style={{ borderRadius: "100%", padding: "1rem 6rem" }}
                  >
                    Information Added
                  </button>
                ) : (
                  <button
                    onClick={() => handleshowModal(item?.id)}
                    className="relative bg-bright-green text-black font-bold    hover:shadow-lg"
                    style={{ borderRadius: "100%", padding: "1rem 6rem" }}
                  >
                    Buy Now
                  </button>
                )}

                {item?.invoice?.invoiceUrl ? (
                  <button
                    onClick={() => {
                      window.open(item?.invoice?.invoiceUrl, "_blank");
                    }}
                    className="relative bg-bright-green text-black font-bold    hover:shadow-lg mt-2"
                    style={{ borderRadius: "100%", padding: "1rem 6rem" }}
                  >
                    Pay Invoice
                  </button>
                ) : null}

                {viewInvoiceModal && (
                  <div
                    style={{
                      transform: "translate(-50%, -43%)",
                      zIndex: "1",
                      width: "615px",
                    }}
                    className="fixed max-h-[550px] lg:max-h-[550px] md:max-h-[500px] overflow-y-auto scrollbar scrollbar-thin scrollbar-thumb-gray-500 bg-black top-1/2 left-1/2 border-2 border-bright-green rounded"
                  >
                    <div className="bg-black p-4 rounded-lg relative">
                      <button
                        onClick={handleCloseInvoiceModal}
                        className="absolute top-2 right-2 text-white-600 font-bold"
                      >
                        X
                      </button>

                      <div className="flex justify-center">
                        <Image
                          src="/images/ive-got.png"
                          alt="Perfume"
                          width={290}
                          height={113}
                          className=" cursor-pointer mb-[12px] max-w-[50%] md:max-w-[100%] lg:max-w-[100%] xl:max-w-[100%]"
                        />
                      </div>

                      <h2 className="text-md my-5 font-semibold mb-2 text-center">
                        <p
                          className="text-black p-2 rounded text-xl mx-20"
                          style={{ backgroundColor: "rgb(7, 248, 24)" }}
                        >
                          INVOICE from SELLER
                        </p>
                      </h2>

                    
                      <div className="flex justify-center">
                        <h2
                          className="text-lg my-5 font-semibold mb-4 "
                          style={{ color: "rgb(7, 248, 24)" }}
                        >
                          INVOICE TO DETAILS
                        </h2>
                      </div>

                      <div className="flex items-center mb-4">
                        <label
                          className="mr-4 "
                          style={{
                            color: "rgb(7, 248, 24)",
                            width: "70%",
                            fontSize: "14px",
                          }}
                        >
                          ITEM SOLD:
                        </label>
                        <input
                          type="email"
                          placeholder=""
                          value={"Item Name"}
                          className="border border-gray-300  p-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-black"
                        />
                      </div>

                      <div className="flex items-center mb-4">
                        <label
                          className="mr-4 "
                          style={{
                            color: "rgb(7, 248, 24)",
                            width: "70%",
                            fontSize: "14px",
                          }}
                        >
                          AGREED PRICE:
                        </label>
                        <input
                          value={""}
                          type="number"
                          placeholder="$ 0.00"
                          className="border border-gray-300 py-1  p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-black"
                        />
                      </div>

                      <div className="flex items-center mb-4">
                        <label
                          className="mr-4 "
                          style={{
                            color: "rgb(7, 248, 24)",
                            width: "70%",
                            fontSize: "14px",
                          }}
                        >
                          STATE SALES TAX:
                        </label>
                        <input
                          value={""}
                          type="number"
                          placeholder="$ 0.00"
                          className="border border-gray-300 py-1  p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-black"
                        />
                      </div>

                      <div className="flex items-center mb-4">
                        <label
                          className="mr-4 "
                          style={{
                            color: "rgb(7, 248, 24)",
                            width: "70%",
                            fontSize: "14px",
                          }}
                        >
                          Agreed Shipping & Insurance:
                        </label>
                        <input
                          type="number"
                          placeholder="$ 0.00"
                          className="border border-gray-300 py-1 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-black"
                        />
                      </div>

                      <div className="flex items-center mb-4">
                        <label
                          className="mr-4 "
                          style={{
                            color: "rgb(7, 248, 24)",
                            width: "70%",
                            fontSize: "14px",
                          }}
                        >
                          TOTAL INVOICE:
                        </label>
                        <input
                          type="number"
                          placeholder="$ 0.00"
                          className="border border-gray-300 py-1  p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-black"
                        />
                      </div>

                      <div className="flex justify-center mt-6 gap-2">
                        <Image
                          src="/images/paymentMethod.png"
                          alt=""
                          width={290}
                          height={113}
                          className=" cursor-pointer mb-[12px] max-w-[50%] md:max-w-[100%] lg:max-w-[100%] xl:max-w-[100%]"
                        />
                      </div>
                      <div className="flex justify-center">
                        <p className="text-lightyellow text-md">
                          Funds will not be released to Seller until you Confirm
                          Receipt of Item
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                <br />
                <button
                  onClick={() => handleRespondToMessage(item.id)}
                  className=" bg-black text-bright-green font-bold    border-4 border-bright-green hover:shadow-lg"
                  style={{ borderRadius: "100%", padding: "1rem 6rem" }}
                >
                  Respond to Message
                </button>
              </div>
            </div>
            <hr style={{ height: "4px", border: "2px solid #03F719" }}></hr>
          </div>
        ))
      ) : (
        <div>Messages Not Found</div>
      )}
      {showModal && (
        <div
          style={{ transform: "translate(-50%, -50%)", zIndex: "1", width: "" }}
          className="absolute max-h-[600px] overflow-auto  bg-black top-[57%] left-1/2 w-[90%] md:w-[65%] lg:w-[500px] border-2 border-bright-green rounded"
        >
          <div className="bg-black p-4 rounded-lg relative">
            <button
              onClick={handleClosePopup}
              className="absolute top-2 right-2 text-white-600 font-bold"
            >
              X
            </button>
            <div className="flex justify-center">
              <Image
                src="/images/ive-got.png"
                alt="Perfume"
                width={290}
                height={113}
                className=" cursor-pointer mb-[12px] max-w-[50%] md:max-w-[100%] lg:max-w-[100%] xl:max-w-[100%]"
              />
            </div>
            <h2 className="text-md my-5 font-semibold mb-4 text-center">
              <span
                className="text-black p-2"
                style={{ backgroundColor: "rgb(7, 248, 24)" }}
              >
                CONGRATULATIONS -  YOU GOT IT!
              </span>
            </h2>
            <p className="mb-[25px] items-center text-center">
              <span className="text-bright-green text-center p-2 ">
                You’ll receive an INVOICE FOR ITEM SALE SUMMARY from the Seller.
                Please check your spam folder if not received
              </span>
            </p>

            <div className="flex items-center mb-4">
              <label
                className="mr-4 "
                style={{
                  color: "rgb(7, 248, 24)",
                  width: "70%",
                  fontSize: "14px",
                }}
              >
                Buyer Name
              </label>
              <input
                onChange={handleInputChange}
                value={buyerDetailData.buyerName || ""} // Show an empty string if value is null
                name="buyerName"
                type="text"
                placeholder="Enter Your Name" // Sample data
                className="border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-black"
              />
            </div>
            <div className="flex items-center mb-4">
              <label
                className="mr-4 "
                style={{
                  color: "rgb(7, 248, 24)",
                  width: "70%",
                  fontSize: "14px",
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

            <div className="flex items-center mb-4">
              <label
                className="mr-4 "
                style={{
                  color: "rgb(7, 248, 24)",
                  width: "70%",
                  fontSize: "14px",
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
            <div className="flex items-center mb-4">
              <label
                className="mr-4 "
                style={{
                  color: "rgb(7, 248, 24)",
                  width: "70%",
                  fontSize: "14px",
                }}
              >
                city
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

            <div className="flex items-center mb-4">
              <label
                className="mr-4 "
                style={{
                  color: "rgb(7, 248, 24)",
                  width: "70%",
                  fontSize: "14px",
                }}
              >
                zipCode
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

            <div className="flex items-center mb-4">
              <label
                className="mr-4 "
                style={{
                  color: "rgb(7, 248, 24)",
                  width: "70%",
                  fontSize: "14px",
                }}
              >
                pinLocation
              </label>
              <input
                onChange={handleInputChange}
                value={buyerDetailData.pinLocation || ""} // Show an empty string if value is null
                name="pinLocation"
                type="text"
                placeholder="Enter Pin Location" // Sample data
                className="border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-black"
              />
            </div>

            <div className="flex justify-center mt-6 gap-2">
              <button
                onClick={handleSubmitBuyerInformation}
                className="bg-black px-4 py-2 "
                style={{
                  border: "3px solid #07f818",
                  color: "rgb(7, 248, 24)",
                  fontSize: "16px",
                  borderRadius: "100%",
                  padding: "0.5rem 3rem",
                }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )} */}
    </>
  );
}

export default isAuth(SellerMessages);
