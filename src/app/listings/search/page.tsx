"use client";
import { FC, useState, useEffect, use } from "react";
import ListingAdmin, { ListingAdminProps } from "@/components/ListingAdmin";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { Textarea } from "flowbite-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { log } from "console";
import ListingComponent from "./ListingComponent";
import BackStep from "@/components/backStep/BackStep";
import Link from "next/link";
import SellerChatBox from "./SellerChatBox";
import { IoAdd, IoClose, IoHeartOutline, IoListOutline } from "react-icons/io5";
import ListingButtons from "@/components/generic/ListingButtons";
import { CgUserList } from "react-icons/cg";
import {
  useFetchAllListingsQuery,
  useGetSavedListingsQuery,
} from "@/store/api";
import Button from "@/components/button/Button";

// interface InvoiceData {
//   shipmentAmount: number;
//   itemPrice: number;
// }
interface InvoiceData {
  shipmentAmount: number;
  itemPrice: number;
  invoiceeEmail: string;
  invoiceeName: string;
  itemName: string;
  listingId: number;
  buyerId: number;
  messageId: number;
  stateTaxAmount: number;
}

interface Message {
  id: string;
  images?: [
    {
      id: number;
      imageURL: string;
    }
  ];
  listing: {
    id: string;
    title: string;
    description: string;
    featuredImage: string;
  };
  recieverUser?: {
    id: string;
    email: string;
  };
}

interface Invoice {
  city: string;
  streetAddress: string;
  zipCode: string;
  buyerName: string;
  state: string;
}

interface CreateInvoiceResponse {
  invoice: {
    invoice: Invoice;
  };
}
const SearchByCategoryListings: FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [listings, setListings] = useState<ListingAdminProps[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [listingsPerPage, setListingsPerPage] = useState<number>(15);
  const options = [10, 30, 50, 70, 100];
  const [activeTab, setActiveTab] = useState("all");
  const router = useRouter();
  const [showInvoiceModal, setInvoiceModal] = useState(false);
  const [showInvoiceDetailModal, setInvoiceDetailModal] = useState(false);

  const [listingName, setListingName] = useState<string>("");
  const [zipCODE, setZipCode] = useState<string>("");
  const [houseNumber, setHouseNumber] = useState<string>("");

  const [paypalEmail, setPaypalEmail] = useState<string>("");
  const [invoiceeName, setInvoiceeName] = useState<string>("");
  const [itemName, setItemName] = useState<string>("");
  const [itemPrice, setitemPrice] = useState<string>("");

  const [listingMessageId, setListedMessageId] = useState<{
    BuyerId: string;
    listingId: string;
    MessageId: string;
  }>({
    BuyerId: "",
    listingId: "", // Initial value for listingId
    MessageId: "", // Initial value for MessageId
  });
  const [messages, setMessage] = useState<Message[]>([]);
  const [count, setCount] = useState(false);
  const [onBoardBtn, setOnBoardBtn] = useState<boolean>(true);
  const [onBoardingLinkPre, setOnBoardingLinkPre] = useState<boolean>(false);
  const [checkRate, setCheckRate] = useState<boolean>(false);
  const [upsRate, setUpsRate] = useState<boolean>(false);
  const [invoiceLoading, setInvoiceLoading] = useState<boolean>(false);

  const [radioID, setRadioID] = useState("1");
  const [uspsResponse, setUspsResponse] = useState<string>("");
  // const [uspsError, setUspsError] = useState(null);
  const [uspsError, setUspsError] = useState<string | null>(null);
  const [uspsData, setUspsData] = useState({
    weight: 0,
    originZIPCode: "",
    length: 0,
    height: 0,
    width: 0,
  });
  // ups api state
  const [upsResponse, setUpsResponse] = useState<string>("");
  const [upsError, setUpsError] = useState(null);
  const [upsData, setUpsData] = useState({
    sellerName: "john doe",
    streetAddress: "47 W 13th St, New York, NY 10011, USA",
    city: "New York",
    State: "New York",
    zipCode: "10013",
    length: "10",
    width: "5",
    height: "15",
    weight: "2",
    listingId: 0,
    messageId: 0,
  });

  // create invoice email

  const [createInvoiceResponse, setCreateInvoiceResponse] =
    useState<CreateInvoiceResponse>({
      invoice: {
        invoice: {
          city: "", // Default value
          streetAddress: "", // Default value
          zipCode: "", // Default value
          buyerName: "", // Default value
          state: "", // Default value
        },
      },
    });

  const [createInvoiceError, setCreateInvoiceError] = useState<string | null>(
    null
  );
  const [createInvoiceData, setCreateInvoiceData] = useState<InvoiceData>({
    invoiceeEmail: "",
    invoiceeName: "Invoice",
    itemPrice: 0,
    itemName: "",
    listingId: 0,
    buyerId: 0,
    messageId: 0,
    shipmentAmount: 0,
    stateTaxAmount: 0,
  });

  const handleCloseDetailsModal = () => setInvoiceDetailModal(false);

  // const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // Backend se aayega
  // const listingsPerPage = 10; // Ye backend ke hisaab se set karo

  const getSellerInitiateWithBuyers = async (page = 1) => {
    let accessToken = localStorage.getItem("accessToken");

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API}/api/listings/fetchAllListings?page=${page}&limit=${listingsPerPage}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 200) {
        setListings(response?.data?.data); // Sirf current page ki listings set karo
        setTotalPages(Math.ceil(response?.data?.count / listingsPerPage)); // Backend ka total count use karo
        setCurrentPage(page);
      }
    } catch (error) {
      console.error("Error fetching listings:", error);
    }
  };

  // Component mount hone par API call





  // useEffect(() => {
  //   getSellerInitiateWithBuyers(currentPage);
  // }, []);




  // const getSellerInitaiteWithBuyers = async () => {
  //   let accessToken = localStorage.getItem("accessToken");

  //   try {
  //     const response = await axios.get(
  //       `${process.env.NEXT_PUBLIC_API}/api/listings/fetchAllListings`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //         },
  //       }
  //     );
  //     if (response.status === 200) {
  //       setMessage(response?.data?.data);
  //       setListings(response?.data?.data);

  //       const status = response?.data?.data?.map((val: any) => val.senderUser);
  //       if (
  //         status[0].stripeAccountId &&
  //         Number(status[0].stripeAccountStatus)
  //       ) {
  //         setOnBoardBtn(false);
  //       }
  //     }
  //   } catch (error) {
  //     // toast.error("Something went Wrong Try Again After Sometime.");
  //   }
  // };

  const categoryParam = useSearchParams()?.get("category");
  const searchCategoryParam = useSearchParams()?.get("listingTitle");
useEffect(()=>(
window.scrollTo(0,0)
),[currentPage])
  useEffect(() => {
    // Check if category is present in the search params
    if (categoryParam && !searchCategoryParam) {
      // Search based on dynamic categoryId
      localStorage.removeItem("data");

      const fetchCategoryData = async () => {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API}/api/listings/searchByCategory/${categoryParam}`,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (response.status === 200) {
            setListings(response?.data?.data);
            localStorage.setItem("data", JSON.stringify(response?.data?.data));
          }
        } catch (error) {
          console.error("Error fetching category data:", error);
        }
      };

      fetchCategoryData(); // Call the async function
    }
    // If listingTitle is present in the search params
    else if (searchCategoryParam && searchCategoryParam.trim() !== "") {
      localStorage.removeItem("data");
      fetch(
        `${process.env.NEXT_PUBLIC_API}/api/listings/searchCategoryByTitle`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            listingTitle: String(searchCategoryParam), // Searching based on title
            listingCategory: Number(categoryParam), // Searching based on title
          }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          localStorage.setItem("data", JSON.stringify(data?.data));
          setListings(data?.data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else {
      // When neither category nor title is provided
      console.log("No category or title parameter found.");
      // getSellerInitaiteWithBuyers();
      getSellerInitiateWithBuyers(currentPage);
    }

    // Set count flag if it's not set yet
    if (!count) {
      setCount(true);
    }
  }, [searchCategoryParam, categoryParam]);

  // useEffect(() => {
  //   if ((searchCategoryParam && searchCategoryParam !== "") || null) {

  //     localStorage.removeItem("data");
  //     fetch(
  //       `${process.env.NEXT_PUBLIC_API}/api/listings/searchCategoryByTitle`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           listingTitle: String(searchCategoryParam),
  //         }),
  //       }
  //     )
  //       .then((response) => response.json())
  //       .then((data) => {
  //         localStorage.setItem("data", JSON.stringify(data?.data));
  //         setListings(data?.data);
  //       })
  //       .catch((error) => {
  //         console.error("Error:", error);
  //       });
  //   } else {
  //     console.log("usama");
  //     getSellerInitaiteWithBuyers();
  //   }
  //   if (!count) {
  //     setCount(true);
  //   }
  // }, []);

  const indexOfLastListing = currentPage * listingsPerPage;
  const indexOfFirstListing = indexOfLastListing - listingsPerPage;
  const currentListings = listings.slice(
    indexOfFirstListing,
    indexOfLastListing
  );

  const handleshowModal = (
    id: number,
    title: string,
    messageId: number,
    buyerId: number
  ) => {
    setListedMessageId({
      BuyerId: buyerId.toString(), // Convert number to string if required
      MessageId: messageId.toString(), // Convert number to string if required
      listingId: id.toString(),
    });
    const listing_name = `${title}`;

    setListingName(listing_name);
    setItemName(listing_name);
    setInvoiceModal(true);
  };
  const handleClosePopup = () => {
    setInvoiceModal(false);
  };
  const handleNextPage = () => {
    if (currentPage < Math.ceil(listings.length / listingsPerPage)) {
      window.scrollTo({ top: 0 });

      setCurrentPage((prev) => prev + 1);
    }
  };
  const handleRespondToMessage = async (messageId: any) => {
    router.push(`/listings/got-it/seller-buyer-conversation/${messageId}`);
    return;
  };
  const handlePrevPage = () => {
    if (currentPage > 1) {
      window.scrollTo({ top: 0 });

      setCurrentPage((prev) => prev - 1);
    }
  };
  const handleItemsPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setListingsPerPage(Number(event.target.value));
  };

  const handleSubmitInvoice = async () => {
    if (paypalEmail === "") {
      toast.error("Please enter your email email");
      return false;
    }
    if (invoiceeName === "") {
      toast.error("Please enter your name");
      return false;
    }
    if (itemName === "") {
      toast.error("Please enter item name");
      return false;
    }
    if (itemPrice === "") {
      toast.error("Please enter item price");
      return false;
    }

    let accessToken = localStorage.getItem("accessToken");

    await fetch(
      `${process.env.NEXT_PUBLIC_API}/api/payments/seller-invoice-create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          invoiceeEmail: paypalEmail,
          invoiceeName: invoiceeName,
          itemPrice: itemPrice,
          itemName: itemName,
          buyerId: messages[0]?.recieverUser?.id,
          listingId: messages[0]?.listing.id,
          messageId: messages[0]?.id,
        }),
      }
    )
      .then((response) => response.json())
      .then((response) => {
        setCount(false);
        if (response.statusCode === 404) {
          // setOnBoardBtn(false);
          toast.error(response.message);
        } else {
          setCount(false);
          handleClosePopup();
          // getSellerInitaiteWithBuyers();
          getSellerInitiateWithBuyers(currentPage);
          setInvoiceModal(false);

          toast.success("Invoice Successfully Created and Send to Buyer");
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error(error?.message);
      });
  };

  const handleOnBoarding = async () => {
    setOnBoardingLinkPre(true);
    let accessToken = localStorage.getItem("accessToken");
    await fetch(
      `${process.env.NEXT_PUBLIC_API}/api/payments/seller-stripe-onboarding`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
      .then((response) => response.json())
      .then((response) => {
        setOnBoardingLinkPre(false);
        // setOnBoardBtn(true);
        window.open(response.data, "_blank");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  //  usps Api implement
  const handleUspsPostRequest = async () => {
    setCheckRate(true);

    try {
      // Ensure numeric validation
      const sanitizedData = {
        ...uspsData,
      };

      const messageId = messages[0]?.id || 0;
      const listingId = messages[0]?.listing?.id || 0;

      const response = await fetch(
        "http://localhost:3002/api/shipping/delivery-rate-usps",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...sanitizedData,
            messageId,
            listingId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setUspsResponse(data?.rate?.totalBasePrice);
      setUspsError(null);
      setCheckRate(false);
    } catch (error) {
      console.error("Error:", error);
      setUspsError(
        (error as Error).message ||
          "Something went wrong while fetching USPS data."
      );
      setCheckRate(false);
    }
  };

  // usps inputchange
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setUspsData((prev) => ({
      ...prev,
      [name]: name === "originZIPCode" ? value : Number(value),
    }));
  };

  // ups api implement

  const handleUpsPostRequest = async () => {
    setUpsRate(true);
    try {
      const sanitizedData = {
        ...upsData,
      };

      // console.log("Sanitized Data:", sanitizedData);

      const response = await fetch(
        "http://localhost:3002/api/shipping/delivery-rate-ups",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...sanitizedData,

            listingId: messages[0]?.listing?.id,
            messageId: messages[0]?.id,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setUpsResponse(
        data?.rate?.RateResponse?.RatedShipment[0]?.TotalCharges?.MonetaryValue
      );
      setUpsError(null);
      setUpsRate(false);
    } catch (error) {
      console.error("Error:", error);
      setUspsError(
        (error as Error).message ||
          "Something went wrong while fetching USPS data."
      );
      setUpsRate(false);
    }
  };

  // ups input change
  const handleUpsInputChange = (e: any) => {
    const { name, value } = e.target;
    setUpsData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // create invoice api implementation

  const handlecreateInvoicePostRequest = async () => {
    setInvoiceLoading(true);

    try {
      const sanitizedData = {
        ...createInvoiceData,
        shipmentAmount: Number(createInvoiceData.shipmentAmount),
        itemPrice: Number(createInvoiceData.itemPrice),
        buyerId: Number(messages[0]?.recieverUser?.id || 0),
        listingId: Number(messages[0]?.listing?.id || 0),
        messageId: Number(messages[0]?.id || 0),
        stateTaxAmount: Number(createInvoiceData.stateTaxAmount),
      };

      let accessToken = localStorage.getItem("accessToken");

      const response = await fetch(
        "http://localhost:3002/api/payments/seller-invoice-create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            ...sanitizedData,
            itemName: itemName,
            // invoiceeEmail:messages[0]?.recieverUser?.email,
            invoiceeEmail: messages[0]?.recieverUser?.email,
            buyerId: messages[0]?.recieverUser?.id,
            listingId: messages[0]?.listing?.id,
            messageId: messages[0]?.id,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setInvoiceModal(false);

      toast.success("Invoice Successfully Created and Send to Buyer");
      setInvoiceLoading(false);
      setCreateInvoiceResponse(data);
      setCreateInvoiceError(null);
      setInvoiceDetailModal(true);
    } catch (error) {
      console.error("Error:", error);
      setCreateInvoiceError(
        (error as Error).message ||
          "Something went wrong while fetching USPS data."
      );
      setInvoiceLoading(false);
    }
  };

  const handleCreateInvoiceInputChange = (e: any) => {
    const { name, value } = e.target;
    setCreateInvoiceData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handAlreadyCreated = async () => {
    toast.error("Dear Seller Your Invoice is already Created");
    return;
  };

  const filteredListings = currentListings.filter((list) =>
    list.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const {
    data: savedListings,
    error,
    isLoading,
    refetch,
  } = useGetSavedListingsQuery(null);
  useEffect(() => {
    refetch();
  }, [refetch]);

  const currentListingsWithSavedStatus = currentListings.map(
    (listing: ListingAdminProps) => {
      const isSaved = savedListings?.data?.some(
        (savedListing: { id: string }) => savedListing.id === listing.id
      );
      return { ...listing, isSaved: !!isSaved };
    }
  );

  // const allList = () => {
  //   router.push("/listings/search")
  //   window.location.reload();
  // };

  return (
    <div className="p-4">
      <div className="text-2xl sm:text-3xl font-bold  mb-4 flex gap-3 justify-between items-center mt-3">
        <BackStep href="/" />
        <span className="capitalize">
          {searchCategoryParam ? searchCategoryParam : "All Listings"}
        </span>

        <div className="flex items-center gap-2">
          <ListingButtons icon={<IoListOutline />} url={"/listings/search"} />
          <ListingButtons icon={<CgUserList />} url={"/user-listing"} />
          <ListingButtons icon={<IoHeartOutline />} url={"/saved-listings"} />
          <ListingButtons icon={<IoAdd />} url={"/create-listing"} />
        </div>
      </div>

      <>
        {currentListingsWithSavedStatus.length > 0 ? (
          currentListingsWithSavedStatus.map(
            (listing: ListingAdminProps, index: number) => {
              const { slug, index: _, ...rest } = listing;
              return (
                <ListingAdmin
                  key={listing.id}
                  index={index}
                  slug={slug}
                  {...rest}
                />
              );
            }
          )
        ) : (
          <>
            <p className="text-start text-white text-lg">No listings found</p>
          </>
        )}

        {currentListingsWithSavedStatus.length > 0 && (
          <div className="flex flex-col md:flex-row items-center justify-end">
            {/* Items Per Page Dropdown */}
            <div className="text-gray-700 mb-5 xl:mb-0 lg:mb-0 md:mb-0 mr-3">
              <label htmlFor="itemsPerPage" className="mr-2 text-white">
                Items per page: 15
              </label>
              {/* <select
             id="itemsPerPage"
             value={listingsPerPage}
             onChange={(e) => {
               setCurrentPage(1); // Jab limit change ho, first page par chale jao
               getSellerInitiateWithBuyers(1);
             }}
             className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
           >
             {[10, 20, 50].map((option) => (
               <option key={option} value={option}>{option}</option>
             ))}
           </select> */}
            </div>

            {/* Pagination Controls */}
            <div className="text-gray-700 flex items-center">
              <button
                onClick={() => getSellerInitiateWithBuyers(currentPage - 1)}
                disabled={currentPage === 1}
                //  className="px-4 py-2 bg-bright-green hover:bg-dark-green text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
                className="px-4 py-2 bg-dark-green text-black rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-white">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => getSellerInitiateWithBuyers(currentPage + 1)}
                disabled={currentPage >= totalPages}
                //  className="px-4 py-2 bg-green-700 text-black rounded disabled:opacity-50 disabled:cursor-not-allowed"
                className="px-4 py-2 bg-dark-green text-black rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </>

      {activeTab === "al" && (
        <>
          {currentListings.length < 1 ? (
            <div className="text-lg sm:text-xl">No Listing Found. </div>
          ) : (
            <>
              {currentListings.map(
                (listing: ListingAdminProps, index: number) => {
                  const { index: _, ...rest } = listing;
                  return (
                    <ListingAdmin key={listing.id} index={index} {...rest} />
                  );
                }
              )}

              {/* <div className="flex flex-col md:flex-row items-center justify-center">
                <div className="text-white-700 mb-5 xl:mb-0 lg:mb-0 md:mb-0 mr-3">
                  <label htmlFor="itemsPerPage" className="mr-2">
                    Items per page:
                  </label>
                  <select
                    id="itemsPerPage"
                    value={listingsPerPage}
                    onChange={handleItemsPerPageChange}
                    className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  >
                    {options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="text-white-700">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-dark-green text-black rounded disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2">
                    Page {currentPage} of{" "}
                    {Math.ceil(listings.length / listingsPerPage)}
                  </span>
                  <button
                    onClick={handleNextPage}
                    disabled={
                      currentPage ===
                      Math.ceil(listings.length / listingsPerPage)
                    }
                    className="px-4 py-2 bg-dark-green text-black rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div> */}
            </>
          )}
        </>
      )}
      {activeTab === "message" && (
        <>
          <SellerChatBox
            messages={messages}
            handleshowModal={handleshowModal}
            handAlreadyCreated={handAlreadyCreated}
          />

          {/* {messages.length > 0 ? (
            messages.map((item: any, key: any) => (
              <div key={key} className="gap-2">
                <div className="flex flex-col  md:flex-row justify-around gap-4 p-4 text-white ml-4">
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
                    <div className="flex justify-start gap-2 mt-2 overflow-auto">
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
                    <button
                      onClick={() => handleRespondToMessage(item.id)}
                      className="relative bg-black text-bright-green font-bold  px-8 py-3 border-4 border-bright-green hover:shadow-lg"
                      style={{ borderRadius: "100%", padding: "2rem 6rem" }}
                    >
                      Chat with Buyer
                    </button>

                    <br />
                    
                    {item?.invoice?.invoiceeEmail == "" &&
                    item?.invoice?.invoiceeName == "" &&
                    item?.invoice?.invoiceePrice == "" ? (
                      <button
                        onClick={handAlreadyCreated}
                        className="relative bg-bright-green text-black font-bold  px-8 py-3 hover:shadow-lg"
                        style={{ borderRadius: "100%", padding: "2rem 6rem" }}
                      >
                        Invoice ALready Created
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          handleshowModal(
                            item?.listing.id,
                            item?.listing.title,
                            item?.id,
                            item?.recieverUser?.id
                          )
                        }
                        className="relative bg-bright-green text-black font-bold  px-8 py-3 hover:shadow-lg"
                        style={{ borderRadius: "100%", padding: "2rem 6rem" }}
                      >
                        Create Invoice
                      </button>
                    )}
                  </div>
                </div>
                <hr style={{ height: "4px", border: "2px solid #03F719" }}></hr>
              </div>
            ))
          ) : (
            <div>Messages Not Found</div>
          )} */}
        </>
      )}

      {showInvoiceDetailModal && (
        <div
          style={{
            transform: "translate(-50%, -45%)",
            zIndex: "1",
            // width: "615px",
          }}
          className="fixed h-[440px] xl:h-[540px] overflow-auto bg-black top-1/2 left-1/2 border-2 border-bright-green rounded w-[300px] md:w-[500px] lg:w-[600px] xl:w-[600px]"
        >
          <div className="bg-black p-4 rounded-lg relative">
            <button
              onClick={() => handleCloseDetailsModal()}
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
                className="cursor-pointer mb-[12px] max-w-[50%] md:max-w-[100%] lg:max-w-[100%] xl:max-w-[100%]"
              />
            </div>

            <h2 className="text-md my-5 font-semibold mb-2 text-center">
              <span
                className="text-black p-2 rounded text-2xl"
                style={{ backgroundColor: "rgb(7, 248, 24)" }}
              >
                CONGRATULATIONS - YOU SOLD IT!
              </span>
            </h2>

            <h2 className="text-md my-5 font-semibold mb-2 text-center">
              <span
                className="p-2 rounded text-2xl"
                style={{ color: "rgb(7, 248, 24)" }}
              >
                BUYER DETAILS
              </span>
            </h2>

            <br />
            <div>
              <div className="flex items-center mb-4">
                <label
                  className="mr-4"
                  style={{
                    color: "rgb(7, 248, 24)",
                    width: "70%",
                    fontSize: "14px",
                  }}
                >
                  BUYER NAME:
                </label>
                <input
                  value={createInvoiceResponse.invoice.invoice.buyerName}
                  // onChange={(e) => setPaypalEmail(e.target.value)}
                  type="email"
                  placeholder="-----"
                  className="border border-gray-300  p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-black"
                />
              </div>
              <div className="flex items-center mb-4">
                <label
                  className="mr-4"
                  style={{
                    color: "rgb(7, 248, 24)",
                    width: "70%",
                    fontSize: "14px",
                  }}
                >
                  STREET ADDRESS:
                </label>
                <input
                  value={createInvoiceResponse.invoice.invoice.streetAddress}
                  // onChange={(e) => setPaypalEmail(e.target.value)}
                  type="email"
                  placeholder="ENTER STRRET ADDRESS"
                  className="border border-gray-300  p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-black"
                />
              </div>

              <div className="flex items-center mb-4">
                <label
                  className="mr-4"
                  style={{
                    color: "rgb(7, 248, 24)",
                    width: "70%",
                    fontSize: "14px",
                  }}
                >
                  CITY:
                </label>
                <input
                  value={createInvoiceResponse.invoice.invoice.city}
                  // onChange={(e) => setPaypalEmail(e.target.value)}
                  type="email"
                  placeholder="ENTER STRRET ADDRESS"
                  className="border border-gray-300  p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-black"
                />
              </div>

              <div className="flex items-center mb-4">
                <label
                  className="mr-4"
                  style={{
                    color: "rgb(7, 248, 24)",
                    width: "70%",
                    fontSize: "14px",
                  }}
                >
                  STATE:
                </label>
                <input
                  value={createInvoiceResponse.invoice.invoice.state}
                  // onChange={(e) => setPaypalEmail(e.target.value)}
                  type="email"
                  placeholder="ENTER STRRET ADDRESS"
                  className="border border-gray-300  p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-black"
                />
              </div>

              <div className="flex items-center mb-4">
                <label
                  className="mr-4"
                  style={{
                    color: "rgb(7, 248, 24)",
                    width: "70%",
                    fontSize: "14px",
                  }}
                >
                  ZIP CODE:
                </label>
                <input
                  value={createInvoiceResponse.invoice.invoice.zipCode}
                  // onChange={(e) => setPaypalEmail(e.target.value)}
                  type="email"
                  placeholder="ENTER STRRET ADDRESS"
                  className="border border-gray-300  p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-black"
                />
              </div>

              <br />
              <div className="flex justify-center items-center">
                <button
                  onClick={() => handleCloseDetailsModal()}
                  className="bg-dark-green text-black rounded-lg px-4 py-2 uppercase font-bold text-base  w-[fit-content]"
                >
                  DONE
                </button>
              </div>

              <br />
            </div>
          </div>
        </div>
      )}

      {showInvoiceModal && (
        <div
          style={{
            transform: "translate(-50%, -45%)",
            zIndex: "1",
          }}
          className="fixed h-[440px] xl:h-[540px] overflow-auto bg-black top-1/2 left-1/2 border-2 border-bright-green rounded w-[300px] md:w-[500px] lg:w-[600px] xl:w-[600px]"
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

            <h2 className="text-md my-5 font-semibold mb-2 text-center">
              <span
                className="text-black p-2 rounded text-2xl"
                style={{ backgroundColor: "rgb(7, 248, 24)" }}
              >
                CONGRATULATIONS - YOU SOLD IT!
              </span>
            </h2>
            {onBoardBtn && (
              <p className="text-center mt-1 text-bright-green">
                Note: Go to Member Profile for Stripe Account Activation
              </p>
            )}

            <div className="flex justify-center">
              <h2
                className="text-lg my-5 font-semibold mb-4 "
                style={{ color: "rgb(7, 248, 24)" }}
              >
                SELLER INFO{" "}
              </h2>
            </div>

            {/* <div className="flex items-center mb-4">
              <label
                className="mr-4"
                style={{
                  color: "rgb(7, 248, 24)",
                  width: "70%",
                  fontSize: "14px",
                }}
              >
                YOUR STREET ADRESS:
              </label>
              <input
                onChange={(e) => setPaypalEmail(e.target.value)}
                type="email"
                placeholder="ENTER STRRET ADDRESS"
                className="border border-gray-300  p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-black"
              />
            </div>

            <div className="flex items-center mb-4">
              <label
                className="mr-4"
                style={{
                  color: "rgb(7, 248, 24)",
                  width: "70%",
                  fontSize: "14px",
                }}
              >
                YOUR CITY:
              </label>
              <input
                onChange={(e) => setInvoiceeName(e.target.value)}
                type="text"
                placeholder="ENTER YOUR CITY"
                className="border border-gray-300  p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-black"
              />
            </div>

            <div className="flex items-center mb-4">
              <label
                className="mr-4"
                style={{
                  color: "rgb(7, 248, 24)",
                  width: "70%",
                  fontSize: "14px",
                }}
              >
                ZIP CODE:
              </label>
              <input
                onChange={(e) => setZipCode(e.target.value)}
                type="text"
                placeholder="ENTER ZIP CODE"
                className="border border-gray-300  p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-black"
              />
            </div>

            <div className="flex items-center mb-4">
              <label
                className="mr-4"
                style={{
                  color: "rgb(7, 248, 24)",
                  width: "70%",
                  fontSize: "14px",
                }}
              >
                YOUR HOUSE/OFFICE NUMBER:
              </label>
              <input
                onChange={(e) => setHouseNumber(e.target.value)}
                type="number"
                placeholder="ENTER HOUSE/OFFICE NUMBER"
                className="border border-gray-300  p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-black"
              />
            </div> */}

            {/* <div className="flex items-center mb-4">
              <label
                className="mr-4"
                style={{
                  color: "rgb(7, 248, 24)",
                  width: "39%",
                  fontSize: "14px",
                }}
              >
                SELECT DELIVERY:
              </label>
              <div className="flex gap-4">
                <label className="flex items-center  cursor-pointer">
                  <input
                    id="1"
                    type="radio"
                    value="1"
                    name="default-radio"
                    className="w-4 h-4 text-bright-green bg-gray-100 border-gray-300 focus:ring-bright-green dark:focus:ring-bright-green dark:ring-birght-green focus:ring-2 dark:bg-birght-green dark:border-bright-green"
                    onChange={(e) => setRadioID(e.target.value)}
                  />
                  <label
                    htmlFor="default-radio-1"
                    className="ms-2 text-sm font-medium text-white dark:text-gray-300"
                  >
                    USPS
                  </label>
                </label>

                <label className="flex items-center  cursor-pointer">
                  <input
                    id="2"
                    value={"2"}
                    onChange={(e) => setRadioID(e.target.value)}
                    type="radio"
                    name="default-radio"
                    className="w-4 h-4 text-bright-green bg-gray-100 border-gray-300 focus:ring-bright-green dark:focus:ring-bright-green dark:ring-birght-green focus:ring-2 dark:bg-birght-green dark:border-bright-green"
                  />
                  <label
                    htmlFor="default-radio-1"
                    className="ms-2 text-sm font-medium text-white dark:text-gray-300"
                  >
                    UPS
                  </label>
                </label>

                <label className="flex items-center  cursor-pointer">
                  <input
                    id="3"
                    value={"3"}
                    onChange={(e) => setRadioID(e.target.value)}
                    type="radio"
                    name="default-radio"
                    className="w-4 h-4 text-bright-green bg-gray-100 border-gray-300 focus:ring-bright-green dark:focus:ring-bright-green dark:ring-birght-green focus:ring-2 dark:bg-birght-green dark:border-bright-green"
                  />
                  <label
                    htmlFor="default-radio-1"
                    className="ms-2 text-sm font-medium text-white dark:text-gray-300"
                  >
                    others
                  </label>
                </label>
              </div>
            </div> */}
            {radioID === "1" && (
              <>
                <div className="border-b pb-3">
                  <div className="flex items-center  mb-4">
                    <label
                      className="mr-4 "
                      style={{
                        color: "rgb(7, 248, 24)",
                        width: "70%",
                        fontSize: "14px",
                      }}
                    >
                      WEIGHT
                    </label>
                    <input
                      name="weight"
                      onChange={handleInputChange}
                      type="text"
                      value={uspsData.weight}
                      placeholder="Enter Weight"
                      className="border border-gray-300  p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-black"
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
                      ZIP CODE
                    </label>
                    <input
                      name="originZIPCode"
                      onChange={handleInputChange}
                      type="text"
                      value={uspsData.originZIPCode}
                      placeholder="Enter Zip Code"
                      className="border border-gray-300  p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-black"
                    />
                  </div>

                  <div className="flex items-center mb-4">
                    <label
                      className="mr-4 "
                      style={{
                        color: "rgb(7, 248, 24)",
                        width: "89%",
                        fontSize: "14px",
                      }}
                    >
                      DIMENSION (L x W x H) inches
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        name="length"
                        onChange={handleInputChange}
                        value={uspsData.length}
                        type="number"
                        placeholder="---"
                        min="0"
                        className="border border-gray-300  p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-black"
                      />
                      x
                      <input
                        name="width"
                        onChange={handleInputChange}
                        value={uspsData.width}
                        type="number"
                        placeholder="---"
                        min="0"
                        className="border border-gray-300  p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-black"
                      />
                      x
                      <input
                        name="height"
                        onChange={handleInputChange}
                        value={uspsData.height}
                        type="number"
                        placeholder="---"
                        className="border border-gray-300  p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-black"
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <button
                      onClick={handleUspsPostRequest}
                      className="bg-dark-green text-black rounded-lg px-4 py-2 uppercase font-bold text-base  w-[fit-content]"
                    >
                      {/* check total rate */}
                      {checkRate ? "Loading..." : "Check Total Rate"}
                    </button>

                    <div className="flex items-center">
                      <span style={{ color: "rgb(7, 248, 24)" }}>$ </span>
                      <span
                        className="mr-4  py-4 font-bold text-2xl flex"
                        style={{
                          color: "rgb(7, 248, 24)",
                          width: "70%",
                          fontSize: "14px",
                        }}
                      >
                        {` ${uspsResponse || "0.00"}`}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {radioID === "2" && (
              <>
                <div className="flex items-center mb-4">
                  <label
                    className="mr-4 "
                    style={{
                      color: "rgb(7, 248, 24)",
                      width: "70%",
                      fontSize: "14px",
                    }}
                  >
                    Name
                  </label>
                  <input
                    name="sellerName"
                    value={upsData.sellerName}
                    onChange={handleUpsInputChange}
                    type="text"
                    placeholder="---"
                    className="border border-gray-300  p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-black"
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
                    Address
                  </label>
                  <input
                    name="streetAddress"
                    value={upsData.streetAddress}
                    onChange={handleUpsInputChange}
                    type="text"
                    placeholder="---"
                    className="border border-gray-300  p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-black"
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
                    City
                  </label>
                  <input
                    value={upsData.city}
                    name="city"
                    onChange={handleUpsInputChange}
                    type="text"
                    placeholder="---"
                    className="border border-gray-300  p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-black"
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
                    Weight
                  </label>
                  <input
                    value={upsData.weight}
                    name="weight"
                    onChange={handleUpsInputChange}
                    type="text"
                    placeholder="---"
                    className="border border-gray-300  p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-black"
                  />
                </div>
                <div className="flex items-center mb-4">
                  <label
                    className="mr-4 "
                    style={{
                      color: "rgb(7, 248, 24)",
                      width: "89%",
                      fontSize: "14px",
                    }}
                  >
                    DIMENSION (L x W x H)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      name="length"
                      onChange={handleUpsInputChange}
                      value={upsData.length}
                      type="number"
                      min="0"
                      placeholder="---"
                      className="border border-gray-300  p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-black"
                    />
                    x
                    <input
                      name="width"
                      onChange={handleUpsInputChange}
                      value={upsData.width}
                      type="number"
                      min="0"
                      placeholder="---"
                      className="border border-gray-300  p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-black"
                    />
                    x
                    <input
                      name="height"
                      onChange={handleUpsInputChange}
                      value={upsData.height}
                      type="number"
                      min="0"
                      placeholder="---"
                      className="border border-gray-300  p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-black"
                    />
                  </div>
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
                  <input
                    name="state"
                    onChange={handleUpsInputChange}
                    value={upsData.State}
                    type="text"
                    placeholder="---"
                    className="border border-gray-300  p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-black"
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
                    name="zipCode"
                    onChange={handleUpsInputChange}
                    value={upsData.zipCode}
                    type="text"
                    placeholder="---"
                    className="border border-gray-300  p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-black"
                  />
                </div>

                <div className="flex justify-between items-center mt-3">
                  <button
                    onClick={handleUpsPostRequest}
                    className="bg-black px-4 py-2 "
                    style={{
                      border: "3px solid #07f818",
                      color: "rgb(7, 248, 24)",
                      fontSize: "16px",
                      borderRadius: "100%",
                      padding: "1.5rem 4rem",
                    }}
                  >
                    {upsRate ? "Loading..." : "Check Total Rate"}
                  </button>
                  <div className="flex items-center mb-4">
                    <span style={{ color: "rgb(7, 248, 24)" }}>$ </span>
                    <span
                      className="mr-4  py-4 font-bold text-2xl flex"
                      style={{
                        color: "rgb(7, 248, 24)",
                        width: "70%",
                        fontSize: "14px",
                      }}
                    >{` ${upsResponse}`}</span>
                  </div>
                </div>
              </>
            )}

            <div className="flex justify-center">
              <h2
                className="text-lg my-5 font-semibold mb-4 "
                style={{ color: "rgb(7, 248, 24)" }}
              >
                INVOICE TO BUYER
              </h2>
            </div>

            <div className="flex items-center mb-4">
              <label
                className="mr-4"
                style={{
                  color: "rgb(7, 248, 24)",
                  width: "70%",
                  fontSize: "14px",
                }}
              >
                ITEM NAME
              </label>
              <input
                onChange={handleCreateInvoiceInputChange}
                name="itemName"
                value={itemName}
                type="text"
                placeholder="ITEM NAME"
                className="border border-gray-300  p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-black"
              />
            </div>

            {/* <div className="flex items-center mb-4">
              <label
                className="mr-4"
                style={{
                  color: "rgb(7, 248, 24)",
                  width: "70%",
                  fontSize: "14px",
                }}
              >
                invoiceeEmail
              </label>
              <input
                onChange={handleCreateInvoiceInputChange}
                name="invoiceeEmail"
                value={createInvoiceData.invoiceeEmail}
                type="email"
                placeholder=""
                className="border border-gray-300  p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-black"
              />
            </div> */}

            <div className="flex items-center mb-4">
              <label
                className="mr-4"
                style={{
                  color: "rgb(7, 248, 24)",
                  width: "70%",
                  fontSize: "14px",
                }}
              >
                AGREED PRICE:
              </label>
              <input
                onChange={handleCreateInvoiceInputChange}
                name="itemPrice"
                value={createInvoiceData.itemPrice}
                type="text"
                placeholder="$ 0.00"
                className="border border-gray-300  p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-black"
              />
            </div>

            <div className="flex justify-center mb-3">
              <p className="text-bright-green font-normal text-md">
                (STATE SALES TAX - will be added to price of Item when
                applicable)
              </p>
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
                AGREED SHIPPING & INSURANCE:
              </label>
              <input
                onChange={handleCreateInvoiceInputChange}
                name="shipmentAmount"
                value={createInvoiceData.shipmentAmount}
                type="text"
                placeholder="$ 0.00"
                className="border border-gray-300  p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-black"
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
                STATE TAX:
              </label>
              <input
                onChange={handleCreateInvoiceInputChange}
                name="stateTaxAmount"
                value={createInvoiceData.stateTaxAmount}
                type="text"
                placeholder="$ 0.00"
                className="border border-gray-300  p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-black"
              />
            </div>

            <div className="flex items-center mb-4">
              <label
                className="mr-4"
                style={{
                  color: "rgb(7, 248, 24)",
                  width: "70%",
                  fontSize: "14px",
                }}
              >
                TOTAL AMOUNT:
              </label>
              <input
                // onChange={handleCreateInvoiceInputChange}
                // name="itemPrice"
                readOnly
                value={Number(
                  Number(createInvoiceData.shipmentAmount) +
                    Number(createInvoiceData.itemPrice) +
                    Number(createInvoiceData.stateTaxAmount)
                ).toFixed(2)}
                // value={createInvoiceData.itemPrice}
                type="text"
                placeholder="$ 0.00"
                className="border border-gray-300  p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-black"
              />
            </div>

            <div className="flex justify-center mt-6 gap-2">
              <button
                onClick={handlecreateInvoicePostRequest}
                className="bg-dark-green text-black rounded-lg px-4 py-2 uppercase font-bold text-base  w-[fit-content]"

                // className="bg-black px-4 py-2 "
                // style={{
                //   border: "3px solid #07f818",
                //   color: "rgb(7, 248, 24)",
                //   fontSize: "16px",
                //   borderRadius: "100%",
                //   padding: "1.5rem 4rem",
                // }}
              >
                {invoiceLoading ? "Loading..." : "Send to Buyer"}
              </button>

              {/* {onBoardBtn && (
                <button
                  onClick={handleOnBoarding}
                  className="bg-black px-4 py-2 "
                  style={{
                    border: "3px solid #07f818",
                    color: "rgb(7, 248, 24)",
                    fontSize: "16px",
                    borderRadius: "100%",
                    padding: "1.5rem 4rem",
                  }}
                >
                  {onBoardingLinkPre ? "Loading..." : "Click to OnBoard"}
                </button>
              )} */}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .tabs {
          display: flex;
          margin-bottom: 1rem;
          margin-top: 2rem;
        }
        .tab {
          padding: 0.5rem 2rem;
          cursor: pointer;
          background-color: #333;
          color: #fff;
          border: 2px solid transparent;
        }
        .tab.active {
          background-color: #00ff00;
          color: black;
        }
        .tab-content {
          padding: 1rem;
        }
      `}</style>
    </div>
  );
};

export default SearchByCategoryListings;
