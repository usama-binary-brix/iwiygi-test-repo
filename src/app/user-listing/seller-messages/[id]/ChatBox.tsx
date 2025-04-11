import TextArea from "@/components/Form/TextArea";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { IoClose, IoSendSharp } from "react-icons/io5";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import BuyerSellerConversation from "./BuyerSellerConversation";
import Loader from "@/components/Loader";
import { toast } from "sonner";
import axios from "axios";
import BackStep from "@/components/backStep/BackStep";
import MiniListView from "@/components/generic/MiniListView";

interface ChatBoxProps {
  message: Message[]; // Update type here
  loading: boolean;
  params: any;
}

type Message = {
  id: string;
};
type User = {
  id: string;
};
interface messagesProps {
  id: number;
  message: string;
  parent: number;
  isSeller: boolean;
  isBuyer: boolean;
  listing: {
    id: number;
    title: string;
    description: string;
    featuredImage: string;
  };
  images: {
    id: number;
    imageURL: string;
  }[];
  recieverUser?: {
    id: number;
    username: string;
    fullname: string | null;
    phonenumber: string | null;
    email: string;
    password: string;
    role: string;
    isVerified: boolean;
    hashedRt: string | null;
    merchantEmail: string | null;
    stripeAccountId: string | null;
    stripeAccountStatus: string | null;
    stripeCustomerAccountId: string | null;
    streetAddress: string | null;
    city: string | null;
    zipCode: string | null;
    houseNumber: string | null;
    state: string | null;
    isActive: boolean;
  } | null;
  invoice?: {
    streetAddress?: string | null;
    invoiceUrl?: string | null;
    invoiceReceipt?: string | null;
  } | null;
}
// const ChatBox: React.FC = () => {
const ChatBox: React.FC<ChatBoxProps> = ({ loading, params }) => {
  const [msgId, setMsgId] = useState<string | null>();
  const [message, setMessage] = useState<any[]>([]);

  const [activeUser, setActiveUser] = useState<User | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [messageId, setMessageId] = useState<any>();
  const [showModal, setShowModal] = useState(false);
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

  // --------------------- Create Invoice Modal Logic with API-----
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
      // setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API}/api/chat/sellerFirstMessages/${listingId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.status === 200) {
        // setLoading(false);
        setMessage(response?.data?.data);
      }
    } catch (error) {
      // setLoading(false);
      toast.error("Something went Wrong Try Again After Sometime.");
    }
  };

  const handleAlreadyAddedInfo = async () => {
    toast.error(
      "Your shipping information has already been added, and you have received the invoice through email. Please make the payment. Thank you!"
    );
    return;
  };
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setBuyerDetailData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [isUserInfoLoaded, setIsUserInfoLoaded] = useState(false);

  // Load user data from localStorage on component mount
  useEffect(() => {
    const userDataString = localStorage.getItem("User");

    if (userDataString) {
      const userData = JSON.parse(userDataString);

      if (userData) {
        setBuyerDetailData((prevData) => ({
          ...prevData,
          buyerName: userData.fullname || "",
          state: userData.state || "",
          streetAddress: userData.streetAddress || "",
          city: userData.city || "",
          zipCode: userData.zipCode || "",
          pinLocation: userData.pinLocation || "",
        }));
        setIsUserInfoLoaded(true);
      }
    } else {
      toast.error("User data is not available.");
    }
  }, []);

  const handleSubmitBuyerInformation = async () => {
    if (buyerDetailData.streetAddress === "") {
      toast.error("Please enter your streetAddress");
      return false;
    }
    if (buyerDetailData.city === "") {
      toast.error("Please enter your city name");
      return false;
    }
    if (buyerDetailData.pinLocation === "") {
      toast.error("Please enter your house Numer/office location");
      return false;
    }

    const payload = {
      buyerName: buyerDetailData.buyerName || "",
      state: buyerDetailData.state || "",
      streetAddress: buyerDetailData.streetAddress || "",
      city: buyerDetailData.city || "",
      zipCode: buyerDetailData.zipCode || "",
      pinLocation: buyerDetailData.pinLocation || "",
      listingId: Number(params), // Add any additional required fields here
      messageId,
    };

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
          // body: JSON.stringify({
          //   ...buyerDetailData,
          //   listingId: Number(params),
          //   messageId,
          // }),
          body: JSON.stringify(payload),
        }
      );
      await response.json();
      if (response.ok) {
        // setCount(false);
        // getMessagesById(params);
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
  const handleshowModal = (messageId: any) => {
    setMessageId(messageId);
    setShowModal(true);
  };

  const handleClosePopup = () => {
    setShowModal(false);
  };
  // ----------------------------------End Invoice Create Modal Logic -----------------

  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);
      if (!isMobileView && message.length > 0) {
        // setActiveUser(message[0]);
        // setMsgId(message[0]?.id);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [message]);

  const [conversationMessages, setConversationMessage] = useState<
    messagesProps[]
  >([]);

  const [conversationloading, setConversationLoading] =
    useState<boolean>(false);

  const getConversationMessagesById = async (messageId: any) => {
    setConversationLoading(true);
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      console.error("Access token not found");
      return;
    }
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API}/api/chat/getMessagesConversationBuyer/${messageId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setConversationLoading(false);
      if (response.status === 200) {
        setConversationMessage(response?.data?.data);
      } else {
        console.error("Unexpected response:", response);
      }
    } catch (error) {
      setConversationLoading(false);
      console.error("Error fetching messages:", error);
    }
  };

  const handleUserClick = (user: any) => {
    getConversationMessagesById(user);
    setActiveUser(user);
    // getMessagesById(params);
    setMsgId(user);
    if (isMobile) {
      setShowChat(true);
    }
  };

  useEffect(() => {
    getMessagesById(params);
  }, [params]);

  return (
    <>
      <div className="">
        <div className="text-2xl sm:text-3xl font-bold  mb-4 uppercase flex gap-3 justify-between items-center mt-3">
          <BackStep href="/user-listing" />
          <span>Messages</span>
          <div></div>
        </div>
        <div className="flex h-[100vh] md:h-[90vh] border border-dark-green">
          <div
            className={`${
              showChat && isMobile ? "hidden" : "w-full md:w-1/4"
            } bg-black border text-white border-gray-950 p-2`}
          >
            <h3 className="text-lg font-bold mb-4">Sellers List</h3>
            <ul className="space-y-2">
              {message.map((user: any, index: any) => (
                <li
                  key={user.id}
                  onClick={() => handleUserClick(user.id)}
                  className={`p-2 rounded cursor-pointer ${
                    activeUser == user.id
                      ? "bg-bright-green text-black"
                      : "hover:bg-bright-green hover:text-black"
                  }`}
                >
                  {user?.senderFullName ? user?.senderFullName : "Seller***"}{" "}
                  {index + 1}
                  {/* <hr
                  style={{
                    marginTop: "10px",
                    height: "1px",
                    border: "1px solid #03F719",
                  }}
                ></hr> */}
                </li>
              ))}
            </ul>
          </div>

          <div
            className={`${
              showChat || !isMobile ? "w-full md:w-3/4" : "hidden"
            } flex flex-col p-3 `}
          >
            {activeUser ? (
              <>
                <div className="">
                  <button
                    className="mb-4 text-bright-green md:hidden"
                    onClick={() => setShowChat(false)}
                  >
                    <IoArrowBackCircleOutline className="text-[2rem]" />
                  </button>
                  <div className="bg-black">
                    {conversationMessages.length > 0 && (
                      <div className="gap-2">
                        <div className="flex flex-col md:flex-row gap-4 items-start justify-between text-white p-3">
                          <div className="flex flex-col md:flex-row gap-4 items-start text-white p-3">
                            {/* <div className="flex flex-col">
                            <div
                              className={`max-w-xs rounded-lg  text-base`}
                            >
                              {conversationMessages[0].message}
                            </div>

                            <div className="grid grid-cols-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 mt-2">
                              {Array.from({
                                length: conversationMessages[0].images.length,
                              }).map((_, index) => (
                                <Image
                                  key={index}
                                  src={
                                    conversationMessages[0].images[index]
                                      ?.imageURL
                                  }
                                  alt={`Image ${index + 1}`}
                                  width={50}
                                  height={50}
                                  className="w-[50px] h-[50px] cursor-pointer border-bright-green border rounded"
                                />
                              ))}
                            </div>
                          </div> */}
                            <MiniListView
                              img={
                                conversationMessages[0]?.listing?.featuredImage
                              }
                              title={conversationMessages[0]?.listing?.title}
                              id={conversationMessages[0]?.id}
                              description={
                                conversationMessages[0]?.listing?.description
                              }
                            />
                            {/* <div className="flex gap-2 w-full">
                              <Image
                                src={
                                  conversationMessages[0]?.listing
                                    ?.featuredImage
                                }
                                alt={`Image`}
                                width={50}
                                height={50}
                                className="w-[50px] h-[50px] cursor-pointer border-bright-green border rounded"
                              />
                              <div>
                                <p>{conversationMessages[0]?.listing?.title}</p>
                                <p>
                                  {
                                    conversationMessages[0]?.listing
                                      ?.description
                                  }
                                </p>
                              </div>
                            </div> */}
                          </div>

                          <div className="flex flex-col justify-center">
                            {conversationMessages[0]?.invoice &&
                            conversationMessages[0]?.invoice?.streetAddress !==
                              null ? (
                              <button
                                onClick={handleAlreadyAddedInfo}
                                className="bg-bright-green text-black rounded-lg px-4 py-2 uppercase font-bold text-base  w-[fit-content]"
                              >
                                Information Added
                              </button>
                            ) : (
                              <button
                                onClick={() =>
                                  handleshowModal(conversationMessages[0]?.id)
                                }
                                className="bg-bright-green text-black rounded-lg px-4 py-2 uppercase font-bold text-base  w-full"
                              >
                                Buy Now
                              </button>
                            )}

                            {conversationMessages[0]?.invoice?.invoiceUrl &&
                              conversationMessages[0]?.invoice
                                ?.invoiceReceipt && (
                                <>
                                  <button
                                    onClick={() => {
                                      const url =
                                        conversationMessages[0]?.invoice
                                          ?.invoiceReceipt ?? "";
                                      if (url) {
                                        window.open(url, "_blank"); // Ensures only valid strings are passed
                                      } else {
                                        toast.error(
                                          "The invoice PDF is not available. Please contact with Seller"
                                        );
                                      }
                                    }}
                                    className="bg-bright-green text-black rounded-lg mt-1 px-4 py-2 uppercase font-bold text-base  w-full"
                                  >
                                    Download Invoice
                                  </button>

                                  <button
                                    onClick={() => {
                                      const url =
                                        conversationMessages[0]?.invoice
                                          ?.invoiceUrl ?? "";
                                      if (url) {
                                        window.open(url, "_blank"); // Ensures only valid strings are passed
                                      } else {
                                        toast.error(
                                          "The invoice URL is not available. Please contact with Seller"
                                        );
                                      }
                                    }}
                                    className="bg-bright-green text-black rounded-lg mt-1 px-4 py-2 uppercase font-bold text-base  w-full"
                                  >
                                    Pay Invoice
                                  </button>
                                </>
                              )}
                          </div>
                        </div>
                      </div>
                    )}

                    <hr
                      style={{ height: "1px", border: "1px solid #03F719" }}
                    ></hr>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto border rounded p-4 bg-black border-black ">
                  <BuyerSellerConversation
                    idd={msgId}
                    conversationloading={conversationloading}
                    getConversationMessagesById={getConversationMessagesById}
                    conversationMessages={conversationMessages}
                  />
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                Please Select a Seller conversation to see the Seller Respond!
              </div>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div
          style={{ transform: "translate(-50%, -45%)", zIndex: "1", width: "" }}
          // className="absolute max-h-[600px] overflow-auto  bg-black top-[57%] left-1/2 w-[90%] md:w-[65%] lg:w-[500px] border-2 border-bright-green rounded"
          className="absolute h-[440px] xl:h-[540px] overflow-auto bg-black top-1/2 left-1/2 border-2 border-bright-green rounded w-[300px] md:w-[500px] lg:w-[600px] xl:w-[600px]"
        >
          <div className="bg-black p-4 rounded-lg relative">
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
                Please check your spam folder if not received.
              </span>
            </p>
            <div>
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

              {/* <p> Want to change the Shipping address? <a className="text-bright-green cursor-pointer" href="/my-profile">Go to Profile</a></p> */}

              <div className="flex justify-center mt-6 gap-2">
                <button
                  onClick={handleSubmitBuyerInformation}
                  className="bg-bright-green text-black rounded-lg px-4 py-2 uppercase font-bold text-base  w-[fit-content]"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBox;
