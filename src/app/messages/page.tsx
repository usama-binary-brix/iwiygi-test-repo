"use client";

import MiniListView from "@/components/generic/MiniListView";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import {
  IoArrowBackCircleOutline,
  IoClose,
  IoPersonCircleOutline,
} from "react-icons/io5";
import { toast } from "sonner";
import BuyerSellerConversation from "../user-listing/seller-messages/[id]/BuyerSellerConversation";
import SellerBuyerConversation from "../listings/search/SellerBuyerConversation";
import Loader from "@/components/Loader";
import SellerWithBuyerConversation from "./SellerWithBuyerConversation";
import BuyerWithSellerConversation from "./BuyerWithSellerConversation";
import Image from "next/image";
import BuyNowPopup from "./Popups/BuyNowPopup";
import CreateInvoicePopup from "./Popups/CreateInvoicePopup";
import Button from "@/components/button/Button";
import { useSelector } from "react-redux";
import {
  useGetListingMessagesByUserIdQuery,
  useGetMessagesConversationSellerQuery,
  useLazyGetMessagesConversationBuyerQuery,
  useLazyGetMessagesConversationSellerQuery,
} from "@/store/api";
import { HiArrowSmRight } from "react-icons/hi";

import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import CounterOfferPrice from "./Popups/CounterOfferPrice";
// import { IoIosArrowUp, IoIosArrowDown, IoPersonCircleOutline } from "react-icons/io5";

interface MessagesProps {
  id: number;
  message: string;
  parent: number;
  isSeller: boolean;
  isBuyer: boolean;
  offerPrice: string;

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
  senderUser?: {
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
    id?:any;
    streetAddress?: string | null;
    invoiceUrl?: string | null;
    invoiceReceipt?: string | null;
    invoiceeEmail?: string | null;
    invoiceeName?: string | null;
    invoiceePrice?: string | null;
    orderStatus?: string | null;
    paymentStatus?: string | null;
  } | null;
}

const Page = () => {
  const [selectedOption, setSelectedOption] = useState('');

  // const shippingOptions = [
  //   { id: 1, label: 'Normal', price: 0.00 },
  //   { id: 2, label: 'Next Day Air (UPS)', price: 31.72 },
  //   { id: 3, label: '2nd Day Air (UPS)', price: 20.06 },
  //   { id: 4, label: '2nd Day Air AM (UPS)', price: 21.91 },
  //   { id: 5, label: 'Ground (UPS)', price: 9.43 },

  // ];


  const [msgId, setMsgId] = useState<string | null>(null);
  const [conversationLoading, setConversationLoading] = useState(false);
  const [isSeller, setIsSeller] = useState(true);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [showChat, setShowChat] = useState(false);
  const [messageId, setMessageId] = useState<any>();
  const [listingImage, setListingImage] = useState<string>(""); // State for the image URL
  const [selectedUserId, setSelectedUserId] = useState("");
  const [usersByListing, setUsersByListing] = useState<Record<string, any[]>>(
    {}
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [conversationMessages, setConversationMessage] = useState<
    MessagesProps[]
  >([]);
  const [selectedRateId, setSelectedRateId] = useState<string | null>(null);
  const [labelData, setLabelData] = useState<any>(null);
  const [labelLoading, setLabelLoading] = useState(false);
  const [labelError, setLabelError] = useState<string | null>(null);
  const [sellerMessage, setSellerMessage] = useState<MessagesProps[]>([]);

  const LoggedUser = localStorage.getItem("User")!;
  const LoggedUserId = JSON.parse(LoggedUser)?.id;
  // -----------------fetch all messages-------------
  const {
    data: messageListing,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useGetListingMessagesByUserIdQuery(LoggedUserId);

  useEffect(() => {
    if (messageListing) {
      setListings(isSeller ? messageListing.buyer : messageListing.seller);
    }
  }, [messageListing, isSeller]);

  // ----------------------------get message by Id --------------

  const [
    triggerGetBuyerMessages,
    {
      data: buyerConversation,
      isError: buyerConversationError,
      error: buyerConversationerror,
    },
  ] = useLazyGetMessagesConversationBuyerQuery(messageId) || [];

  const getConversationMessagesById = (messageId: string) => {
    triggerGetBuyerMessages(messageId);
  };

  useEffect(() => {
    if (buyerConversation) {
      setConversationMessage(buyerConversation.data);
    }
  }, [buyerConversation]);

  useEffect(() => {
    if (buyerConversationError && buyerConversationerror) {
      const statusCode = (buyerConversationerror as any)?.data?.statusCode;
      const message = (buyerConversationerror as any)?.data?.message;

      if (statusCode === 404) {
        // toast.error(message || "Message not found");
      }
    }
  }, [buyerConversationError, buyerConversationerror]);

  // --------------------------------------------to get messgs as a seller--------------

  const [
    triggerGetMessages,
    {
      data: sellerConversation,
      isError: SellerConversationError,
      error: SellerConversationerror,
    },
  ] = useLazyGetMessagesConversationSellerQuery(messageId);

  const getMessagesById = (messageId: string) => {
    triggerGetMessages(messageId);
  };
  const getMessagesByIdBuyer = (messageId: string) => {
    triggerGetBuyerMessages(messageId);
  };

  useEffect(() => {
    if (sellerConversation) {
      setSellerMessage(sellerConversation.data);
    }
  }, [sellerConversation]);

  useEffect(() => {
    if (SellerConversationError && SellerConversationerror) {
      const statusCode = (SellerConversationerror as any)?.data?.statusCode;
      const message = (SellerConversationerror as any)?.data?.message;

      if (statusCode === 404) {
        // toast.error(message || "Message not found");
      }
    }
  }, [SellerConversationError, SellerConversationerror]);

  // -------------------end-------------

  const getUsersByListingId = async (listingId: string) => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      console.error("Access token not found");
      return [];
    }
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API}/api/chat/sellerFirstMessages/${listingId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.status === 200 ? response.data.data : [];
    } catch (error) {
      // toast.error("Something went wrong. Try again later.");
      return [];
    }
  };

  const [open, setOpen] = useState<string | null>(null);

  const toggleAccordion = async (listingId: string) => {
    setOpen(open === listingId ? null : listingId);
    if (openAccordion === listingId) {
      setOpenAccordion(null);
      return;
    }

    setLoading(true);
    try {
      const response = await getUsersByListingId(listingId);
      setUsersByListing((prev) => ({
        ...prev,
        [listingId]: response,
      }));
    } catch (error) {
      toast.error("Something went wrong. Try again later.");
    } finally {
      setOpenAccordion(listingId);
      setLoading(false);
    }
  };

  const handleUserClick = (user: { id: string }) => {
    setMsgId(user.id);
    setSelectedUserId(user.id);
    setMessageId(user.id);
    if (isMobile) {
      setShowChat(true);
    }

    getConversationMessagesById(user.id);
  };

  const handleBuyerUserClick = (user: { id: string }) => {
    setMsgId(user.id);
    setSelectedId(user.id);
    setMessageId(user.id);
    if (isMobile) {
      setShowChat(true);
    }
    getMessagesById(user.id);
  };

  const handleToggleChange = async (isSellerSelected: boolean) => {
    if (isSeller === isSellerSelected) return;

    setLoading(true);
    setIsSeller(isSellerSelected);
    setOpenAccordion(null);
    setListings([]);
    setUsersByListing({});

    try {
      await refetch();
    } catch (error) {
      console.error("Error refetching listings:", error);
    } finally {
      setLoading(false);
    }
  };

  const getHeading = () => (isSeller ? "Messages" : "Messages");

  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // ----------------------Buy Now button start----------

  const [showModal, setShowModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerPrice, setOfferPrice] = useState("");

  const [listingId, setListingId] = useState<number | null>(null);
  console.log(messageId, "msg id");
  const openPopup = (listingId: number, messageId: any) => {
    setListingId(listingId);
    setMessageId(messageId);
    setShowModal(true);
  };

  const openCounterOfferPopup = (
    listingId: number,
    messageId: Number,
    offerPrice: any
  ) => {
    setListingId(listingId);
    setOfferPrice(offerPrice);
    setMessageId(messageId);
    setShowOfferModal(true);
  };
  const closePopup = () => {
    setShowModal(false);
    setListingId(null);
    // setMessageId(null);
  };

  const handleAlreadyAddedInfo = async () => {
    toast.error(
      "Your shipping information has already been added, and you have received the invoice through email. Please make the payment. Thank you!"
    );
    return;
  };

  // ------------------buy now button end---------------

  // ------------------- create invoice start--------------
  const [invoiceModal, setInvoiceModal] = useState(false);
  const [itemName, setItemName] = useState<string>("");
  const [listedMessageId, setListedMessageId] = useState<{
    BuyerId: string;
    listingId: string;
    MessageId: string;
  }>({
    BuyerId: "",
    listingId: "",
    MessageId: "",
  });

  const handAlreadyCreated = async () => {
    toast.error("Dear Seller Your Invoice is already Created");
    return;
  };

  const handleshowInvoiceModal = (
    id: number,
    title: string,
    messageId: number,
    buyerId: number,
    listingImg?: string
  ) => {
    setListedMessageId({
      BuyerId: buyerId.toString(),
      MessageId: messageId.toString(),
      listingId: id.toString(),
    });
    const listing_name = `${title}`;

    // setListingName(listing_name);
    // setListingImage(listingImg);
    setItemName(listing_name);
    setInvoiceModal(true);
  };
  const [uspsShippingRate, setUspsShippingRate] = useState([]);
  const [uspsResponseStatus, setUspsResponseStatus] = useState<Boolean>(false);
  const [uspsData, setUspsData] = useState({
    weight: "",
    weightUnit: "lb",
    length: "",
    width: "",
    height: "",
  });
  const [showShippingCalculateModal, setShowShippingCalculateModal] =
    useState(false);
  const [checkRate, setCheckRate] = useState(false);
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setUspsData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClosePopup = () => {
    setShowShippingCalculateModal(false); // Close the modal
  };

  const [invoiceId, setInvoiceId] = useState<any>();
  // const [listId, setListId] = useState<any>();
  const [originZipCodes, SetOriginZipCode] = useState<any>();

  const handleShowShippingModal = (
    invoiceId: any,
    // msgId: any,
    originzipcode: any
  ) => {
    console.log("invoiceId", invoiceId);
    setShowShippingCalculateModal(true);
    setInvoiceId(invoiceId);
    // setListId(listId);
    SetOriginZipCode(originzipcode);
  };

  const today_date = new Date().toISOString();

  const handleUspsPostRequest = async () => {
    setCheckRate(true);

    try {
      // Ensure numeric validation
      // const sanitizedData = {
      //   ...uspsData,
      // };

      if (!uspsData.weight || Number(uspsData.weight) <= 0) {
        setCheckRate(false);
        return toast.error("Please enter the Weight");
      }

      // let weightInKg = Number(uspsData.weight) || 0;

      // switch (uspsData.weightUnit) {

      //   case "lb":
      //     weightInKg = weightInKg; // Convert lbs to kg
      //     break;
      //   case "oz":
      //     weightInKg = weightInKg * 0.0283495; // Convert oz to kg
      //     break;
      // }

      // if (weightInKg > 70) {
      //   setCheckRate(false);
      //   return toast.error("You cannot ship more than 70 kg.");
      // }

      // Remove weightUnit from uspsData and update weight with the converted value
      const { weightUnit, ...sanitizedData } = uspsData;

      const finalData = {
        ...sanitizedData,
        weight: uspsData.weight, // Send weight in kg
        length: Number(uspsData.length) || 0,
        width: Number(uspsData.width) || 0,
        height: Number(uspsData.height) || 0,
      };





      // const sanitizedData = {
      //   ...uspsData,
      //   weight: parseFloat(uspsData.weight) || 0, // Convert weight to a number
      //   length: parseFloat(uspsData.length) || 0,
      //   width: parseFloat(uspsData.width) || 0,
      //   height: parseFloat(uspsData.height) || 0,
      // };
      // const sanitizedData = (({ weightUnit, ...rest }) => rest)(uspsData);
      const invId = invoiceId || 0;
      // const listingId = listId || 0;

      let accessToken = localStorage.getItem("accessToken");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/shipping/create-shippo-shipment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            ...finalData,
            originZIPCode: String(originZipCodes),
            invoiceId: invId,
            mass_unit: uspsData.weightUnit,
            distance_unit: "in",
            shipment_date: today_date,
          }),
        }
      );

      // Check for HTTP response errors
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! Status: ${response.status}`
        );
      }

      const data = await response.json();
      console.log(data, 'shippo data')
      // setUspsResponse(data?.rate?.totalBasePrice);
      setUspsShippingRate(data?.rates);
      // setUspsError(null);
      // setUspsResponseStatus(true);
      setCheckRate(false);
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong while fetching USPS data."
      );
      setCheckRate(false);
    }
  };

  // --------------------create invoice end----------

  const renderMessages = () => (

    <>
      <div className="flex h-[100vh] md:h-[90vh] border border-dark-green">
        <div
          className={`${showChat && isMobile ? "hidden" : "w-full md:w-1/4"
            } w-full md:w-1/4 bg-black text-white border-gray-950 p-4 h-auto overflow-y-auto pe-3 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-300 scroll-smooth`}
        >
          {isSeller
            ? listings?.map((listing) => (
              <Accordion
                className="bg-white mb-2 px-2 rounded-lg"
                placeholder=""
                key={listing.listingId}
                open={open === listing.listingId}
                icon={
                  open === listing.listingId ? (
                    <IoIosArrowUp className="text-black text-[1rem]" />
                  ) : (
                    <IoIosArrowDown className="text-black text-[1rem]" />
                  )
                }
              >
                <AccordionHeader
                  placeholder=""
                  className="py-1 leading-tight border-b-white"
                  onClick={() => toggleAccordion(listing.listingId)}
                >
                  <MiniListView
                    img={listing.featuredImage}
                    title={listing.title}
                    imgClassName="h-[35px] min-w-[55px] max-w-[45px]"
                    titleClassName="text-[12px] font-[400] line-clamp-2 text-ellipsis text-black"
                    mainClassName="border-none"
                  />
                </AccordionHeader>
                <AccordionBody className="py-1">
                  {open === listing.listingId && (
                    <div>
                      {loading ? (
                        <>
                          <div>
                            <div className=" flex items-center justify-center z-10">
                              <svg
                                aria-hidden="true"
                                className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-bright-green"
                                viewBox="0 0 100 101"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                  fill="currentColor"
                                />
                                <path
                                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                  fill="currentFill"
                                />
                              </svg>
                            </div>
                          </div>
                        </>
                      ) : (
                        usersByListing[listing.listingId]?.map((user) => (
                          <div
                            key={user.id}
                            className={`cursor-pointer last:border-none`}
                            onClick={() => handleUserClick(user)}
                          >
                            <div
                              className={`flex items-center space-x-2 border border-gray-300 rounded-md p-1 ${selectedUserId === user.id
                                ? "bg-bright-green"
                                : ""
                                }`}
                            >
                              <IoPersonCircleOutline className="text-[2rem] text-black" />
                              <div className="flex justify-between items-center w-full">
                                <p className="text-[12px] capitalize">
                                  {user?.senderFullName
                                    ? `${user?.senderFullName
                                      .substring(0, 3)
                                      .toLowerCase()}***`
                                    : "Unknown User"}
                                </p>
                                <p
                                  className={`text-[0.7rem] font-semibold capitalize text-black bg-bright-green px-1 py-1 rounded-full shadow-md
                                  ${selectedUserId === user.id
                                      ? "bg-white"
                                      : "bg-bright-green"
                                    }
                                  
                                  `}
                                >
                                  {user?.offerPrice
                                    ? `$${user.offerPrice}`
                                    : "$0.00"}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </AccordionBody>
              </Accordion>
            ))
            : listings?.map((listing) => (
              // <div
              //   key={listing.id}
              //   className="mb-2 rounded-lg overflow-hidden border-2 p-1 cursor-pointer bg-white text-black"
              //   onClick={() => handleBuyerUserClick({ id: listing.id })}
              // >
              <div
                key={listing.id}
                className={`mb-2 rounded-lg overflow-hidden p-1 cursor-pointer text-black ${selectedId === listing.id ? "bg-bright-green " : "bg-white"
                  }`}
                onClick={() => handleBuyerUserClick(listing)}
              >
                <div className="flex items-center">
                  <MiniListView
                    img={listing?.listing?.featuredImage}
                    title={listing?.listing?.title}
                    imgClassName="h-[35px] min-w-[55px]"
                    titleClassName="text-[12px] font-[400] line-clamp-2 text-ellipsis"
                    mainClassName="border-none"
                  />
                  <p
                    className={`text-[0.6rem] font-semibold capitalize text-black bg-bright-green px-1 py-1 rounded-full shadow-md
            ${selectedId === listing.id ? "bg-white" : "bg-bright-green"}
            
      `}
                  >
                    {listing?.offerPrice
                      ? `$${listing?.offerPrice}`
                      : "$0.00"}
                  </p>
                </div>
              </div>
            ))}
        </div>

        <div
          className={`${showChat || !isMobile ? "w-full md:w-3/4" : "hidden"
            } flex flex-col p-4 relative`}
        >
          {isSeller ? (
            <>
              {conversationMessages.length > 0 &&
                conversationMessages[0]?.invoice !== null &&
                conversationMessages[0]?.invoice?.streetAddress !== "" &&
                conversationMessages[0]?.invoice?.invoiceReceipt === null &&
                conversationMessages[0]?.invoice?.invoiceUrl === null && (
                  <div
                    id="alert-additional-content-3"
                    className="p-3 flex justify-between items-center mb-2 text-green-800 border border-bright-green rounded-lg dark:bg-gray-800 dark:text-green-400 dark:border-green-800"
                    role="alert"
                  >
                    <p className="text-sm font-medium text-bright-green">
                      Your BUY NOW request has been sent

                      to the Seller to create your invoice.

                      Please check your SPAM folder if your invoice

                      is not received.
                    </p>
                  </div>
                )}

              {conversationMessages.length > 0 &&
                conversationMessages[0]?.invoice &&
                conversationMessages[0]?.invoice?.invoiceReceipt &&
                conversationMessages[0]?.invoice?.invoiceUrl ? (
                conversationMessages[0]?.invoice?.orderStatus == "COMPLETED" ? (
                  <div
                    id="alert-additional-content-3"
                    className="p-3 flex justify-between items-center mb-2 text-green-800 border border-bright-green rounded-lg dark:bg-gray-800 dark:text-green-400 dark:border-green-800"
                    role="alert"
                  >
                    <p className="text-sm font-medium text-bright-green">
                      {/* Congratulations! You Got It. */}
                      {/* ✅ Congratulations! You got it successfully! */}
                      Congratulations! You got it! This amazing product is now
                      yours.
                    </p>
                  </div>
                ) : (
                  <div
                    id="alert-additional-content-3"
                    className="p-3 flex flex-col lg:flex-row  justify-between lg:items-center mb-2 text-green-800 border border-bright-green rounded-lg dark:bg-gray-800 dark:text-green-400 dark:border-green-800"
                    role="alert"
                  >
                    <p className="text-sm font-medium text-bright-green">
                      Invoice has been created by the seller.
                    </p>

                    <div className="flex">
                      <a
                        href={conversationMessages[0]?.invoice?.invoiceReceipt}
                        rel="noopener noreferrer"
                        className="text-black bg-bright-green hover:bg-transparent hover:text-bright-green hover:border hover:border-bright-green focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-xs px-3 py-1.5 me-2 text-center inline-flex items-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                      >
                        Download Invoice
                      </a>
                      <a
                        href={conversationMessages[0]?.invoice?.invoiceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-bright-green bg-transparent border border-dark-green hover:bg-bright-green hover:text-black font-medium rounded-lg text-xs px-3 py-1.5 text-center"
                      >
                        Pay Invoice
                      </a>
                    </div>
                  </div>
                )
              ) : null}

              <div className="">
                {conversationMessages.length > 0 && (
                  <div className="gap-2 bg-black border rounded-lg border-bright-green">
                    <div className="flex  flex-col md:flex-row gap-4 items-center justify-between text-white py-1">
                      <div className="flex justify-center w-full md:hidden">
                        <div className="flex justify-between w-full items-center p-2">
                          <button
                            className=" text-bright-green md:hidden "
                            onClick={() => setShowChat(false)}
                          >
                            <IoArrowBackCircleOutline className="text-[2rem]" />
                          </button>

                          {conversationMessages[0]?.invoice == null ? (
                            <Button
                              text="Buy Now"
                              type={"success"}
                              onClick={() =>
                                openPopup(
                                  conversationMessages[0]?.listing?.id,
                                  conversationMessages[0]?.id
                                )
                              }
                            />
                          ) : null}

                          {conversationMessages[0]?.invoice == null && (
                            <Button
                              text="Counter Offer"
                              type="success"
                              className="lg:w-[160px]"
                              onClick={() =>
                                openCounterOfferPopup(
                                  conversationMessages[0]?.listing?.id,
                                  conversationMessages[0]?.id,
                                  conversationMessages[0]?.offerPrice
                                )
                              }
                            />
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row gap-4 items-start lg:items-center text-white lg:px-3 lg:py-1">
                        <MiniListView
                          img={conversationMessages[0]?.listing?.featuredImage}
                          title={conversationMessages[0]?.listing?.title}
                          description={
                            !isMobile &&
                            conversationMessages[0]?.listing?.description
                          }
                          imgClassName="h-[40px] min-w-[60px]"
                          descriptionClassName="line-clamp-2 text-ellipsis text-[12px]"
                        />
                      </div>

                      <div className="">
                        <div className="hidden md:block mr-3 ">
                          {conversationMessages[0]?.invoice == null ? (
                            <Button
                              text="Buy Now"
                              type={"success"}
                              className="lg:w-[150px]"
                              onClick={() =>
                                openPopup(
                                  conversationMessages[0]?.listing?.id,
                                  conversationMessages[0]?.id
                                )
                              }
                            />
                          ) : null}

                          {conversationMessages[0]?.invoice == null && (
                            <Button
                              text="Counter Offer"
                              type="success"
                              className="lg:w-[150px] mt-2"
                              onClick={() =>
                                openCounterOfferPopup(
                                  conversationMessages[0]?.listing?.id,
                                  conversationMessages[0]?.id,
                                  conversationMessages[0]?.offerPrice
                                )
                              }
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <br />
              <BuyerWithSellerConversation
                idd={msgId}
                conversationloading={conversationLoading}
                getConversationMessagesById={getConversationMessagesById}
                conversationMessages={conversationMessages}
              />
            </>
          ) : (
            <>
              <div className="bg-black mb-3">
                {sellerMessage.length > 0 && (
                  <div className="gap-2">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between text-white py-1 w-full border border-bright-green rounded-lg">
                      <div className="flex justify-between w-full md:hidden p-2">
                        <button
                          className=" text-bright-green md:hidden"
                          onClick={() => setShowChat(false)}
                        >
                          <IoArrowBackCircleOutline className="text-[2rem]" />
                        </button>

                        {sellerMessage[0]?.invoice == null && (
                          <>
                            <Button
                              text="Counter Offer"
                              type="success"
                              className="text-xs"
                              onClick={() =>
                                openCounterOfferPopup(
                                  sellerMessage[0]?.listing?.id,
                                  sellerMessage[0]?.id,
                                  sellerMessage[0]?.offerPrice
                                )
                              }
                            />


<Button
                                      text="Calculate Shipping"
                                      type="success"
                                      className="w-full mt-1 lg:w-[210px]"
                                      onClick={() =>
                                        // console.log(" sellerMessage[0]", sellerMessage[0].invoice.id)
                                        handleShowShippingModal(
                                          sellerMessage[0]?.invoice?.id,
                                          // sellerMessage[0]?.listing?.id,
                                          // sellerMessage[0]?.id,
                                          sellerMessage[0]?.senderUser?.zipCode
                                        )
                                      }
                                    />

                                    
                          </>
                        )}
                        {sellerMessage[0].invoice !== null
                          ? sellerMessage[0]?.recieverUser?.zipCode !==
                          null && (
                            <div>
                              {
                                // sellerMessage[0]?.invoice?.invoiceeEmail ===
                                //   "" &&
                                // sellerMessage[0]?.invoice?.invoiceeName ===
                                //   "" &&
                                // sellerMessage[0]?.invoice?.invoiceePrice ===
                                //   ""
                                sellerMessage[0]?.invoice?.invoiceUrl !==
                                  null ? (
                                  <Button
                                    text="Invoice Created"
                                    type="success"
                                    className="lg:w-[160px]"
                                    onClick={handAlreadyCreated}
                                  />
                                ) : (
                                  <>
                                    {/* <div className="flex items-center gap-2"> */}
                                    <Button
                                      text="Offer Accepted | SOLD"
                                      type="success"
                                      onClick={() =>
                                        handleshowInvoiceModal(
                                          sellerMessage[0]?.listing.id,
                                          sellerMessage[0]?.listing.title,
                                          sellerMessage[0]?.id,
                                          sellerMessage[0]?.recieverUser
                                            ?.id ?? 0
                                          // sellerMessage[0]?.listing.featuredImage
                                        )
                                      }
                                    />
                                    <Button
                                      text="Calculate Shipping"
                                      type="success"
                                      className="w-full mt-1 lg:w-[180px]"
                                      onClick={() =>
                                        handleShowShippingModal(
                                          sellerMessage[0]?.invoice?.id,
                                          // sellerMessage[0]?.id,
                                          sellerMessage[0]?.senderUser?.zipCode
                                        )
                                      }
                                    />
                                    {/* </div> */}
                                  </>
                                )
                              }
                            </div>
                          )
                          : null}
                      </div>

                      <div className="flex flex-col md:flex-row gap-4 items-center text-white px-3 py-1 w-full">
                        <MiniListView
                          img={sellerMessage[0]?.listing?.featuredImage}
                          title={sellerMessage[0]?.listing?.title}
                          // id={sellerMessage[0]?.id}
                          description={
                            !isMobile && sellerMessage[0]?.listing?.description
                          }
                          imgClassName="h-[40px] min-w-[60px]"
                          descriptionClassName="line-clamp-2 text-ellipsis text-[12px]"
                        />

                        <div className=" hidden md:block">
                          <div className="flex flex-col gap-3 justify-center">
                            {sellerMessage[0]?.invoice == null && (
                              <>
                                <Button
                                  text="Counter Offer"
                                  type="success"
                                  className="w-full mt-1 lg:w-[180px]"
                                  onClick={() =>
                                    openCounterOfferPopup(
                                      sellerMessage[0]?.listing?.id,
                                      sellerMessage[0]?.id,
                                      sellerMessage[0]?.offerPrice
                                    )
                                  }
                                />

                                <Button
                                  text="Calculate Shipping"
                                  type="success"
                                  className="w-full mt-1 lg:w-[180px]"
                                  onClick={() =>
                                    handleShowShippingModal(
                                      sellerMessage[0]?.invoice?.id,
                                      // sellerMessage[0]?.id,
                                      sellerMessage[0]?.senderUser?.zipCode
                                    )
                                  }
                                />
                              </>
                            )}
                            {sellerMessage[0].invoice !== null ? (
                              sellerMessage[0]?.recieverUser?.zipCode !==
                                null ? (
                                sellerMessage[0]?.invoice?.invoiceUrl !==
                                  null ? (
                                  <Button
                                    text="Invoice Created"
                                    type="success"
                                    className="lg:w-[160px]"
                                    onClick={handAlreadyCreated}
                                  />
                                ) : (
                                  <>
                                    <Button
                                      text="Offer Accepted | SOLD"
                                      type="success"
                                      className="lg:w-[210px]"
                                      onClick={() =>
                                        handleshowInvoiceModal(
                                          sellerMessage[0]?.listing.id,
                                          sellerMessage[0]?.listing.title,
                                          sellerMessage[0]?.id,
                                          sellerMessage[0]?.recieverUser?.id ??
                                          0
                                          // sellerMessage[0]?.listing.featuredImage
                                        )
                                      }
                                    />

                                    <Button
                                      text="Calculate Shipping"
                                      type="success"
                                      className="w-full mt-1 lg:w-[210px]"
                                      onClick={() =>
                                        // console.log(" sellerMessage[0]", sellerMessage[0].invoice.id)
                                        handleShowShippingModal(
                                          sellerMessage[0]?.invoice?.id,
                                          // sellerMessage[0]?.listing?.id,
                                          // sellerMessage[0]?.id,
                                          sellerMessage[0]?.senderUser?.zipCode
                                        )
                                      }
                                    />
                                    {/* <Button
                                      text="General Label"
                                      type="success"
                                      className="lg:w-[210px]"
                                      onClick={() =>
                                        handleshowInvoiceModal(
                                          sellerMessage[0]?.listing.id,
                                          sellerMessage[0]?.listing.title,
                                          sellerMessage[0]?.id,
                                          sellerMessage[0]?.recieverUser?.id ??
                                          0
                                          // sellerMessage[0]?.listing.featuredImage
                                        )
                                      }
                                    /> */}
                                  </>
                                )
                              ) : null
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <SellerWithBuyerConversation
                idd={msgId}
                getConversationMessagesById={getMessagesById}
                conversationMessages={sellerMessage}
              />
            </>
          )}
        </div>
      </div>
    </>
  );

  // -------------------genrate label----------------
  const generateShippingLabel = async () => {
    if (!selectedRateId) {
      toast.error("Please select a shipping rate first");
      return;
    }

    setLabelLoading(true);
    setLabelError(null);

    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/shipping/create-shipment-label`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            rate: selectedRateId,
            async: false,
            label_file_type: "PDF_4x6",
            metadata: "",
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setLabelData(data);
      toast.success("Shipping label generated successfully!");
    } catch (error) {
      console.error("Error generating label:", error);
      setLabelError(
        error instanceof Error
          ? error.message
          : "Failed to generate shipping label"
      );
      toast.error("Failed to generate shipping label");
    } finally {
      setLabelLoading(false);
    }
  };

  return (
    <>
      <div className="p-4">
        <div className="text-xl sm:text-3xl font-bold mb-4  flex flex-col lg:flex-row gap-3 justify-between lg:items-center">
          <span className="text-lg md:text-lg">{getHeading()}</span>

          <div className="flex gap-3 items-center">
            <p className="text-sm text-normal">Choose Messages to View</p>
            <HiArrowSmRight className="text-yellow-200" />
            <div className="flex">
              <button
                onClick={() => handleToggleChange(true)}
                disabled={isFetching || isSeller}
                className={`px-4 py-2 cursor-pointer text-sm font-bold italic rounded-tl-lg rounded-bl-lg ${isSeller
                  ? "bg-bright-green text-black border-black"
                  : "bg-white text-black border-transparent"
                  }`}
              >
                Buyer
              </button>

              <button
                disabled={isFetching || !isSeller}
                onClick={() => handleToggleChange(false)}
                className={`px-4 py-2 cursor-pointer text-sm font-bold rounded-tr-lg rounded-br-lg ${!isSeller
                  ? "bg-bright-green text-black border-black"
                  : "bg-white text-black border-transparent"
                  }`}
              >
                Seller
              </button>
            </div>
          </div>
        </div>

        {!messageListing || messageListing.listings?.length === 0 ? (
          <>
            <div className="flex flex-col gap-4 items-center justify-center w-full h-[80vh] border-2 border-bright-green bg-black">
              <h1 className="text-white text-xl">You have no Messages</h1>
              <p className="text-center">
                Messages will appear here when communicating with other Members
              </p>
              <div className="flex gap-3">
                <Button
                  text="Create Listing"
                  type={"success"}
                  navigateTo="/create-listing"
                />
                <Button
                  text="All Listings"
                  type={"success"}
                  navigateTo="/listings/search"
                />
              </div>
            </div>
          </>
        ) : (
          <>
            {isSeller ? (
              messageListing?.buyer?.length === 0 ? (
                <div className="flex flex-col gap-4 items-center justify-center w-full h-[80vh] border-2 border-bright-green bg-black">
                  <h1 className="text-white text-xl">You have no Messages</h1>
                  <p className="text-center">
                    Messages will appear here when communicating with other
                    Members
                  </p>{" "}
                  <div className="flex gap-3">
                    <Button
                      text="Create Listing"
                      type={"success"}
                      navigateTo="/create-listing"
                    />
                    <Button
                      text="All Listings"
                      type={"success"}
                      navigateTo="/listings/search"
                    />
                  </div>
                </div>
              ) : (
                <>{renderMessages()}</>
              )
            ) : messageListing?.seller?.length === 0 ? (
              <div className="flex flex-col gap-4 items-center justify-center w-full h-[80vh] border-2 border-bright-green bg-black">
                <h1 className="text-white">You have no Messages</h1>
                <p className="text-center">
                  Messages will appear here when communicating with other
                  Members
                </p>{" "}
                <div className="flex gap-3">
                  <Button
                    text="Create Listing"
                    type={"success"}
                    navigateTo="/create-listing"
                  />
                  <Button
                    text="All Listings"
                    type={"success"}
                    navigateTo="/listings/search"
                  />
                </div>
              </div>
            ) : (
              <>{renderMessages()}</>
            )}
          </>
        )}

        {/* -------------------------popup for Buy Now as a buyer --------- */}
        {showModal && (
          <BuyNowPopup
            listingId={listingId}
            messageId={messageId}
            handleClosePopup={closePopup}
          />
        )}
        {/* -------------------------popup for buy now as a buyer end----------- */}

        {invoiceModal && (
          <CreateInvoicePopup
            messages={sellerMessage}
            showInvoiceModal={invoiceModal}
            setShowInvoiceModal={setInvoiceModal}
            listedMessageId={listedMessageId}
            itemName={itemName}
            getConversationMessagesById={getMessagesById}
            listingImg={sellerMessage[0].listing.featuredImage}
          />
        )}
        {/* ---------------------------- Counter offer price --------- */}
        {showOfferModal && (
          <CounterOfferPrice
            offerPrice={offerPrice}
            setShowOfferModal={setShowOfferModal}
            listedMessageId={messageId}
            getUsersByListingId={getUsersByListingId}
            listingId={listingId}
            getConversationMessagesById={getMessagesByIdBuyer}
          />
        )}
      </div>

      {showShippingCalculateModal && (
        <>
          <div className="relative">
            <div className="fixed  inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="p-5">
                <div
                  className="bg-black p-4 rounded-lg relative max-w-[40rem] max-h-[90vh] overflow-auto mt-3"
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

                  <h2 className="text-[0.8rem] md:text-lg font-semibold my-1 text-center">
                    <p className="text-bright-green  leading-tight uppercase">
                      - Congratulations -
                    </p>
                    <p className="text-bright-green  leading-tight ">
                      - Your Offer has been accepted -
                    </p>{" "}
                    <p className="text-bright-green  leading-tight ">
                      - Please provide package information -
                    </p>
                  </h2>

                  <>
                    {showShippingCalculateModal && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="p-5">
                          <div className="bg-black p-4 rounded-lg relative max-w-[40rem] max-h-[90vh] overflow-auto mt-3">
                            <button
                              onClick={handleClosePopup}
                              className="absolute top-2 right-2 text-white font-bold"
                            >
                              <IoClose className="text-[2rem]" />
                            </button>

                            <div className="flex justify-center">
                              <Image
                                src="/images/ive-got.png"
                                alt="Perfume"
                                width={190}
                                height={70}
                                className="cursor-pointer mb-[12px] max-w-[50%] md:max-w-[100%] lg:max-w-[100%] xl:max-w-[100%]"
                              />
                            </div>

                            <h2 className="text-[0.8rem] md:text-lg font-semibold my-1 text-center">
                              <p className="text-bright-green leading-tight uppercase">
                                - Calculate Shipping Charges -
                              </p>
                            </h2>

                            {/* Package Information Inputs */}
                            <div className="flex justify-center">
                              <h2
                                className="text-lg font-semibold mb-2"
                                style={{ color: "rgb(7, 248, 24)" }}
                              >
                                Package Information
                              </h2>
                            </div>

                            <div className="pb-3">
                              {/* Item Price */}

                              {/* Weight Input */}
                              <div className="flex flex-col md:flex-row items-start md:items-center mb-2">
                                <label
                                  className="mr-3"
                                  style={{
                                    width: "70%",
                                    fontSize: "16px",
                                    fontWeight: "600",
                                  }}
                                >
                                  Weight
                                </label>
                                <div className="flex w-full">
                                  <input
                                    name="weight"
                                    onChange={handleInputChange}
                                    type="text"
                                    value={uspsData.weight}
                                    placeholder="Enter Weight"
                                    className="border border-gray-300 p-2 focus:outline-none focus:ring-2 w-3/4 text-black"
                                  />
                                  <select
                                    name="weightUnit"
                                    onChange={handleInputChange}
                                    value={uspsData.weightUnit}
                                    className="border border-gray-300 p-2 ml-1 focus:outline-none focus:ring-2 w-1/4 text-black"
                                  >

                                    <option value="lbs">lbs</option>
                                    <option value="oz">oz</option>
                                  </select>
                                </div>
                              </div>

                              {/* Dimensions Input */}
                              <div className="flex flex-col md:flex-row items-start md:items-center mb-2">
                                <label
                                  className=""
                                  style={{
                                    width: "89%",
                                    fontSize: "16px",
                                    fontWeight: "600",
                                  }}
                                >
                                  Dimension{" "}
                                  <span className="text-[10px]">
                                    (L x W x H) inches
                                  </span>
                                </label>
                                <div className="flex items-center gap-2">
                                  <input
                                    name="length"
                                    onChange={handleInputChange}
                                    value={uspsData.length}
                                    type="number"
                                    placeholder="0"
                                    min={0}
                                    className="border border-gray-300 p-2 focus:outline-none focus:ring-2 w-full text-black"
                                  />
                                  X
                                  <input
                                    name="width"
                                    onChange={handleInputChange}
                                    value={uspsData.width}
                                    type="number"
                                    placeholder="0"
                                    min={0}
                                    className="border border-gray-300 p-2 focus:outline-none focus:ring-2 w-full text-black"
                                  />
                                  X
                                  <input
                                    name="height"
                                    onChange={handleInputChange}
                                    value={uspsData.height}
                                    type="number"
                                    placeholder="0"
                                    min={0}
                                    className="border border-gray-300 p-2 focus:outline-none focus:ring-2 w-full text-black"
                                  />
                                </div>
                              </div>

                              {/* Calculate Button & Shipping Price Display */}
                              <div className="flex flex-col justify-center items-center">
                                <div className="flex flex-col md:flex-row items-start md:items-start mb-2 w-full">






                                  <div className="p-4 bg-transparent w-full" style={{ height: '200px', overflowY: 'auto' }}>
                                    <table className="w-full text-white">
                                      <thead className=" bg-gray-800">
                                        <tr>
                                          {/* <th className="text-left py-2 pl-2">Select</th> */}
                                          <th className="text-left py-2">Service</th>
                                          <th className="text-left py-2">Price</th>
                                          <th className="text-left py-2">Delivery Time</th>
                                          <th className="text-left py-2">Carrier</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-gray-700">
                                        {uspsShippingRate?.map((option: any) => (
                                          <tr key={option.object_id} className="hover:bg-gray-800/50">
                                            {/* <td className="py-3 pl-2">
                                              <label className="flex items-center cursor-pointer">
                                                <input
                                                  type="radio"
                                                  name="shipping"
                                                  value={option.object_id}
                                                  checked={selectedOption == option.object_id}
                                                  onChange={() => setSelectedOption(option.object_id)}
                                                  className="accent-orange-500"
                                                />
                                              </label>
                                            </td> */}
                                            <td className="py-3">
                                              <div className="text-base">
                                                {option?.servicelevel?.name}
                                              </div>
                                              {option.duration_terms && (
                                                <div className="text-xs text-gray-400 w-40">
                                                  {option.duration_terms}
                                                </div>
                                              )}
                                            </td>
                                            <td className="py-3 text-base">
                                              ${option?.amount}
                                            </td>
                                            <td className="py-3 text-base">
                                              {option.estimated_days} days
                                            </td>
                                            <td className="py-3">
                                              <div className="flex items-center">

                                                <span>{option.provider}</span>
                                              </div>
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>







                                </div>

                                <Button
                                  text="Calculate Shipping Rate"
                                  type="success"
                                  onClick={handleUspsPostRequest}
                                  loading={checkRate}
                                />
                                {/* 
                                {uspsShippingRate !== null && (
                                  <p className="mt-3 text-lg font-semibold text-bright-green">
                                    Shipping Charges: ${uspsShippingRate}
                                  </p>
                                )} */}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Page;
