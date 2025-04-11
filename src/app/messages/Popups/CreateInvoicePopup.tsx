import React, { useEffect, useState } from "react";
import { IoArrowBackSharp, IoClose } from "react-icons/io5";
import Image from "next/image";
import { toast } from "sonner";
import Button from "@/components/button/Button";
import Link from "next/link";
import { MdEdit } from "react-icons/md";
import MiniListView from "@/components/generic/MiniListView";
import { useSelector } from "react-redux";
import CubeBox from "./CubeBox";
import { useLazyGetMessagesConversationBuyerQuery } from "@/store/api";
import { IoMdArrowRoundBack } from "react-icons/io";

interface InvoiceData {
  shipmentAmount: number;
  itemPrice: number;
  invoiceeEmail: string;
  invoiceeName: string;
  itemName: string;
  listingId: number;
  buyerId: number;
  messageId: number;
  // stateTaxAmount: number;
  shippingPrice?: string;
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

const CreateInvoicePopup = ({
  showInvoiceModal,
  setShowInvoiceModal,
  listedMessageId,
  messages,
  itemName,
  listingImg,
  getConversationMessagesById,
}: {
  itemName: string;
  showInvoiceModal: boolean;
  setShowInvoiceModal: React.Dispatch<React.SetStateAction<boolean>>;
  messages: any;
  listingImg: any;
  getConversationMessagesById?: any;
  listedMessageId: { BuyerId: string; MessageId: string; listingId: string };
}) => {
  const handleClosePopup = () => {
    setShowInvoiceModal(false); // Close the modal
  };

  const [showInvoiceDetailModal, setInvoiceDetailModal] = useState(false);
  const [onBoardBtn, setOnBoardBtn] = useState<boolean>(true);
  const [onBoardingLinkPre, setOnBoardingLinkPre] = useState<boolean>(false);
  const [checkRate, setCheckRate] = useState<boolean>(false);
  const [upsRate, setUpsRate] = useState<boolean>(false);
  const [invoiceLoading, setInvoiceLoading] = useState<boolean>(false);
  const [checkstateTaxRate, setCheckstateTaxRate] = useState<boolean>(false);
  const [showTotal, setShowTotal] = useState(false)
  const [stateTax, setStateTax] = useState();
  const [uspsResponse, setUspsResponse] = useState<string>("");
  const [isEditingShipping, setIsEditingShipping] = useState(false);

  // const [uspsError, setUspsError] = useState(null);
  const [uspsError, setUspsError] = useState<string | null>(null);
  const [uspsData, setUspsData] = useState({
    weight: 0,
    originZIPCode: "",
    length: 0,
    height: 0,
    width: 0,
    weightUnit: "kg",
  });
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
  const reduxUser = useSelector((state: any) => state?.user);
  const localStorageUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (messages[0]?.id) {
      setCreateInvoiceData((prev) => ({
        ...prev,
        itemPrice: messages[0]?.offerPrice,
        shippingPrice: messages[0]?.shippingPrice,
      }));
    }
  }, [messages]);
  useEffect(() => {
    if (
      messages[0]?.senderUser?.stripeAccountId !== null 
      // messages[0]?.senderUser?.stripeAccountStatus !== null
    ) {
      setOnBoardBtn(false);
    }
  }, [messages]);

  // create invoice email

  const [createInvoiceResponse, setCreateInvoiceResponse] =
    useState<CreateInvoiceResponse>({
      invoice: {
        invoice: {
          city: "",
          streetAddress: "",
          zipCode: "",
          buyerName: "",
          state: "",
        },
      },
    });

  const [createInvoiceError, setCreateInvoiceError] = useState<string | null>(
    null
  );
  const [uspsShippingRate, setUspsShippingRate] = useState<number>();
  const [uspsResponseStatus, setUspsResponseStatus] = useState<Boolean>(false);
  const [createInvoiceData, setCreateInvoiceData] = useState<InvoiceData>({
    invoiceeEmail: "",
    invoiceeName: "Invoice",
    itemPrice: 0,
    itemName: "",
    listingId: 0,
    buyerId: 0,
    messageId: 0,
    shipmentAmount: 0,
    // stateTaxAmount: 0,
    shippingPrice: "0",
  });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setUspsData((prev) => ({
      ...prev,
      [name]:
        name === "originZIPCode" || name === "weightUnit"
          ? value
          : Number(value),
    }));
  };

  // const handleUspsPostRequest = async () => {
  //   setCheckRate(true);

  //   try {
  //     // Ensure numeric validation
  //     const sanitizedData = {
  //       ...uspsData,
  //     };

  //     const messageId = messages[0]?.id || 0;
  //     const listingId = messages[0]?.listing?.id || 0;

  //     fetch(`${process.env.NEXT_PUBLIC_API}/api/shipping/delivery-rate-usps`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         ...sanitizedData,
  //         originZIPCode: messages[0]?.recieverUser?.zipCode,
  //         // originZIPCode: "10003",
  //         messageId,
  //         listingId,
  //       }),
  //     })
  //       .then((response) => response.json())
  //       .then((data) => {
  //         setUspsResponse(data?.rate?.totalBasePrice);
  //         setUspsShippingRate(data?.rate?.totalBasePrice);
  //         setUspsError(null);
  //         setUspsResponseStatus(true);
  //         setCheckRate(false);
  //       })
  //       .catch((error) => {
  //         console.error("Error:", error);
  //         toast.error(
  //           error instanceof Error
  //             ? error.message
  //             : "Something went wrong while fetching USPS data."
  //         );
  //         setCheckRate(false);
  //       });
  //   } catch (error) {
  //     console.error("Error:", error);
  //     toast.error(
  //       (error as Error).message ||
  //         "Something went wrong while fetching USPS data."
  //     );
  //     setCheckRate(false);
  //   }
  // };

  // --------------------Tax Jar calculatr handle -----------
  const handleUspsPostRequest = async () => {
    setCheckRate(true);

    try {
      if (!uspsData.weight || Number(uspsData.weight) <= 0) {
        setCheckRate(false);
        return toast.error("Please enter the Weight");
      }
  
      let weightInKg = Number(uspsData.weight) || 0;
  
      switch (uspsData.weightUnit) {
        case "g":
          weightInKg = weightInKg / 1000; // Convert grams to kg
          break;
        case "lbs":
          weightInKg = weightInKg * 0.453592; // Convert lbs to kg
          break;
        case "oz":
          weightInKg = weightInKg * 0.0283495; // Convert oz to kg
          break;
      }
  
      if (weightInKg > 70) {
        setCheckRate(false);
        return toast.error("You cannot ship more than 70 kg.");
      }
  
      // Remove weightUnit from uspsData and update weight with the converted value
      const { weightUnit, ...sanitizedData } = uspsData;
  
      const finalData = {
        ...sanitizedData,
        weight: weightInKg, // Send weight in kg
        length: Number(uspsData.length) || 0,
        width: Number(uspsData.width) || 0,
        height: Number(uspsData.height) || 0,
      };
      // const sanitizedData = (({ weightUnit, ...rest }) => rest)(uspsData);
      const messageId = messages[0]?.id || 0;
      const listingId = messages[0]?.listing?.id || 0;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/shipping/delivery-rate-usps`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...finalData,
            originZIPCode: messages[0]?.recieverUser?.zipCode,
            messageId,
            listingId,
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

      setUspsResponse(data?.rate?.totalBasePrice);
      setUspsShippingRate(data?.rate?.totalBasePrice);
      setUspsError(null);
      setUspsResponseStatus(true);
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

  const handleStateTaxCalculate = async () => {
    setCheckRate(true);

    try {
      const buyerId = messages[0]?.recieverUser?.id;
      const taxData = {
        amount: Number(createInvoiceData.itemPrice) || 0,
        unit_price: Number(createInvoiceData.itemPrice) || 0,
        quantity: 1,
      };

      // const token = reduxUser.accessToken;
      const token = localStorage.getItem("accessToken");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/tax/tax-calculate/${buyerId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...taxData,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        if (data.status == 400) {
          toast.error(data?.detail || "Failed to calculate state tax.");
        }
        if (data.status == 500) {
          toast.error(data?.detail || "Failed to calculate state tax.");
        }
        setStateTax(data?.data?.tax?.amount_to_collect);
        setCheckRate(false);
      } else {
        toast.error(data?.message || "Failed to calculate state tax.");
        setCheckRate(false);
      }
    } catch (error) {
      console.error("Error:", error);

      toast.error(
        error instanceof Error
          ? error?.message
          : "Something went wrong while fetching USPS data."
      );
    } finally {
      setCheckRate(false);
    }
  };

  // ----------------- Tax jar calculatr handle end----------

  const handleCreateInvoiceInputChange = (e: any) => {
    const { name, value } = e.target;
    setCreateInvoiceData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // const handleCreateInvoiceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;

  //   setCreateInvoiceData((prev) => ({
  //     ...prev,
  //     [name]: name === "shipmentAmount" || name === "itemPrice"
  //       ? isNaN(parseFloat(value)) ? "0" : parseFloat(value).toFixed(2) // Ensure valid number
  //       : value.trim() === "" ? "0" : value,
  //   }));
  // };

  const messageId = messages?.[0]?.id;

  const handlecreateInvoicePostRequest = async () => {
    setInvoiceLoading(true);

    try {
      const sanitizedData = {
        ...createInvoiceData,
        // shipmentAmount: Number(uspsShippingRate ? uspsShippingRate : uspsShippingRate),
        shipmentAmount: uspsShippingRate
          ? Number(uspsShippingRate)
          : Number(createInvoiceData.shippingPrice || 0),
        itemPrice: createInvoiceData.itemPrice,
        buyerId: Number(messages[0]?.recieverUser?.id || 0),
        listingId: Number(messages[0]?.listing?.id || 0),
        messageId: Number(messages[0]?.id || 0),
        // stateTaxAmount: Number(stateTax),
        // stateTaxAmount: 10,
      };

      let accessToken = localStorage.getItem("accessToken");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/payments/seller-invoice-create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            ...sanitizedData,
            itemName: itemName,
            invoiceeEmail: messages[0]?.recieverUser?.email,
            buyerId: messages[0]?.recieverUser?.id,
            listingId: messages[0]?.listing?.id,
            messageId: messages[0]?.id,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json(); // Parse the error response
        throw new Error(errorData?.message || "An unexpected error occurred.");
      }

      const data = await response.json();
      //   setInvoiceModal(false);

      toast.success("Invoice Successfully Created and Send to Buyer");
      setInvoiceLoading(false);
      setCreateInvoiceResponse(data);
      getConversationMessagesById(messageId);
      setCreateInvoiceError(null);
      setInvoiceDetailModal(true);
      handleClosePopup();
    } catch (error) {
      const errorMessage =
        (error as Error).message ||
        "Something went wrong while creating the invoice.";
      console.error("Error:", errorMessage);
      toast.error(errorMessage); // Show the error message from the backend or default message
      setCreateInvoiceError(errorMessage);
      setInvoiceLoading(false);
    }
  };
  const [accountType, setAccountType] = useState<string>("individual");

  const handleStripeConnect = async () => {
    setOnBoardingLinkPre(true);
    let accessToken = localStorage.getItem("accessToken");
    await fetch(
      `${process.env.NEXT_PUBLIC_API}/api/payments/seller-stripe-onboarding?type=${accountType}`,
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
        window.open(response.data, "_blank");
        setOnBoardingLinkPre(false);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  return (
    <>
      {showInvoiceModal && (
        <div className="relative">
          <div className="fixed  inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="p-5">
              <div
                className="bg-black p-4 rounded-lg relative max-w-[40rem] max-h-[90vh] overflow-auto mt-3"
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

                {onBoardBtn ? (
                  <>
                    <div className="flex flex-col items-center">
                      <p className="text-center mt-1 text-white px-[20%] ">
                        {/* <span className="text-bright-green">Note:</span> */}
                        When buying & Selling you must register with STRIPE to
                        Pay or Recieve funds
                      </p>

                      <div className="flex gap-4 items-center justify-center mt-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="accountType"
              className="text-bright-green ring-0"
              value="individual"
              checked={accountType === "individual"}
              onChange={() => setAccountType("individual")}
            />
            Individual
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="accountType"
              value="company"
              className="text-bright-green ring-0"

              checked={accountType === "company"}
              onChange={() => setAccountType("company")}
            />
           Business
          </label>
        </div>

   
                      <br />

                      <Button
                        // text="Stripe connect"
                        text={`${accountType === "individual" ? "Connect Stripe" : "Connect Business Stripe"}`}
                        type="success"
                        loading={onBoardingLinkPre}
                        onClick={handleStripeConnect}
                      />
                      <p className="mt-2">Or</p>
                      <p className="text-center underline ">
                        Go to your{" "}
                        <Link
                          className="text-bright-green"
                          href={"/my-profile"}
                        >
                          Profile Setting
                        </Link>{" "}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    {uspsResponse ? 
                    // && stateTax ?
                     (
                      <>
                        {/* Pura Section Jab Dono Values Hain */}
                        <div className="flex items-start justify-between mt-3">
                          <div className="flex flex-wrap gap-3">
                            <p className="text-[0.8rem] md:text-sm">
                              Weight: {uspsData.weight} {uspsData.weightUnit}
                            </p>
                            <p className="text-[0.8rem] md:text-sm">
                              Length: {uspsData.length} inches
                            </p>
                            <p className="text-[0.8rem] md:text-sm">
                              Height: {uspsData.height} inches
                            </p>
                            <p className="text-[0.8rem] md:text-sm">
                              Width: {uspsData.width} inches
                            </p>
                          </div>
                          <MdEdit
                            // onClick={() => setUspsResponse("")}
                            onClick={() => {
                              setUspsResponse("");
                              setStateTax(undefined);
                            }}
                            className="text-bright-green text-[1.5rem] cursor-pointer"
                          />
                        </div>

                        {/* Baaki ka invoice calculation */}
                        <div className="flex flex-col items-start md:flex-row md:items-center mb-2">
                          <label
                            className="mr-4"
                            style={{
                              width: "70%",
                              fontSize: "16px",
                              fontWeight: "600",
                            }}
                          >
                            Item Price:
                          </label>
                          <input
                            onChange={handleCreateInvoiceInputChange}
                            name="itemPrice"
                            readOnly
                            value={createInvoiceData.itemPrice}
                            type="text"
                            placeholder="$ 0.00"
                            className="border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-black"
                          />
                        </div>

                        <div className="flex flex-col items-start md:flex-row md:items-center mb-2">
                          <label
                            className="mr-4"
                            style={{
                              width: "70%",
                              fontSize: "16px",
                              fontWeight: "600",
                            }}
                          >
                            Shipping Charges:
                          </label>
                          <input
                            onChange={handleCreateInvoiceInputChange}
                            name="shipmentAmount"
                            value={
                              uspsShippingRate
                                ? uspsShippingRate
                                : createInvoiceData.itemPrice
                            }
                            readOnly
                            type="text"
                            placeholder="$ 0.00"
                            className="border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-black"
                          />
                        </div>

                        {/* <div className="flex flex-col items-start md:flex-row md:items-center mb-2">
                          <label
                            className="mr-4"
                            style={{
                              width: "70%",
                              fontSize: "16px",
                              fontWeight: "600",
                            }}
                          >
                            State Tax:
                          </label>
                          <input
                            onChange={handleCreateInvoiceInputChange}
                            name="stateTaxAmount"
                            value={stateTax || 10}
                            readOnly
                            type="text"
                            placeholder="$ 0.00"
                            className="border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-black"
                          />
                        </div> */}

                        <div className="flex flex-col items-start md:flex-row md:items-center mb-2">
                          <label
                            className="mr-4"
                            style={{
                              width: "70%",
                              fontSize: "16px",
                              fontWeight: "600",
                            }}
                          >
                            Total Amount:
                          </label>
                          <input
                            readOnly
                            value={
                              isNaN(
                                Number(
                                  uspsShippingRate
                                    ? uspsShippingRate
                                    : createInvoiceData.shippingPrice
                                ) +
                                  Number(createInvoiceData.itemPrice) 
                                  // +
                                  // Number(stateTax)
                              )
                                ? "0.00"
                                : (
                                    Number(
                                      uspsShippingRate
                                        ? uspsShippingRate
                                        : createInvoiceData.shippingPrice
                                    ) +
                                    Number(createInvoiceData.itemPrice) 
                                    // +
                                    // Number(stateTax)
                                  ).toFixed(2)
                            }
                            type="text"
                            placeholder="$ 0.00"
                            className="border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-black"
                          />
                        </div>

                        <div className="flex justify-center mt-6 gap-2">
                          <Button
                            text="Submit"
                            loading={invoiceLoading}
                            onClick={handlecreateInvoicePostRequest}
                            type="success"
                          />
                        </div>
                      </>
                    ) : 
                    showTotal
                    ? (
                      <>
                        {/* Yeh section sirf tab dikhe jab stateTax ho magar uspsResponse na ho */}

                        <IoMdArrowRoundBack
                          // onClick={() => setUspsResponse("")}
                          onClick={() => {
                            setUspsResponse("");
                            setStateTax(undefined);
                            setShowTotal(false)
                            
                          }}
                          className="text-bright-green text-[1.5rem] cursor-pointer"
                        />
                        {/* Baaki ka invoice calculation */}
                        <div className="flex flex-col items-start md:flex-row md:items-center mb-2">
                          <label
                            className="mr-4"
                            style={{
                              width: "70%",
                              fontSize: "16px",
                              fontWeight: "600",
                            }}
                          >
                            Item Price:
                          </label>
                          <input
                            onChange={handleCreateInvoiceInputChange}
                            name="itemPrice"
                            readOnly
                            value={createInvoiceData.itemPrice}
                            type="text"
                            placeholder="$ 0.00"
                            className="border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-black"
                          />
                        </div>

                        <div className="flex flex-col items-start md:flex-row md:items-center mb-2">
                          <label
                            className="mr-4"
                            style={{
                              width: "70%",
                              fontSize: "16px",
                              fontWeight: "600",
                            }}
                          >
                            Shipping Charges:
                          </label>
                          <input
                            onChange={handleCreateInvoiceInputChange}
                            name="shipmentAmount"
                            value={createInvoiceData.shippingPrice || 0}
                            readOnly
                            type="text"
                            placeholder="$ 0.00"
                            className="border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-black"
                          />
                        </div>

                        {/* <div className="flex flex-col items-start md:flex-row md:items-center mb-2">
                          <label
                            className="mr-4"
                            style={{
                              width: "70%",
                              fontSize: "16px",
                              fontWeight: "600",
                            }}
                          >
                            State Tax:
                          </label>
                          <input
                            onChange={handleCreateInvoiceInputChange}
                            name="stateTaxAmount"
                            value={stateTax || 10}
                            readOnly
                            type="text"
                            placeholder="$ 0.00"
                            className="border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-black"
                          />
                        </div> */}

                        <div className="flex flex-col items-start md:flex-row md:items-center mb-2">
                          <label
                            className="mr-4"
                            style={{
                              width: "70%",
                              fontSize: "16px",
                              fontWeight: "600",
                            }}
                          >
                            Total Amount:
                          </label>
                          <input
                            readOnly
                            // value={
                            //   isNaN(Number(uspsShippingRate) + Number(createInvoiceData.itemPrice) + 10)
                            //     ? "0.00"
                            //     : (Number(uspsShippingRate) + Number(createInvoiceData.itemPrice) + 10).toFixed(2)
                            // }
                            value={
                              isNaN(
                                Number(
                                  uspsShippingRate
                                    ? uspsShippingRate
                                    : createInvoiceData.shippingPrice
                                ) +
                                  Number(createInvoiceData.itemPrice)
                                  //  +
                                  // Number(stateTax)
                              )
                                ? "0.00"
                                : (
                                    Number(
                                      uspsShippingRate
                                        ? uspsShippingRate
                                        : createInvoiceData.shippingPrice
                                    ) +
                                    Number(createInvoiceData.itemPrice) 
                                    // +
                                    // Number(stateTax)
                                  ).toFixed(2)
                            }
                            type="text"
                            placeholder="$ 0.00"
                            className="border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-black"
                          />
                        </div>

                        <div className="flex justify-center mt-6 gap-2">
                          <Button
                            text="Submit"
                            loading={invoiceLoading}
                            onClick={handlecreateInvoicePostRequest}
                            type="success"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-center">
                          <h2
                            className="text-lg font-semibold mb-2"
                            style={{ color: "rgb(7, 248, 24)" }}
                          >
                            Package Information
                          </h2>
                        </div>

                        <>
                          <div className=" pb-3">
                            {!uspsShippingRate && isEditingShipping && (
                              <IoMdArrowRoundBack
                                onClick={() => setIsEditingShipping(false)} // Enable editing mode
                                className="text-bright-green text-[1.5rem] cursor-pointer"
                              />
                            )}
                            <div className="flex flex-col md:flex-row items-start md:items-center mb-2">
                              <label
                                className="mr-4"
                                style={{
                                  width: "70%",
                                  fontSize: "16px",
                                  fontWeight: "600",
                                }}
                              >
                                Item Price:
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
                            {!uspsShippingRate && !isEditingShipping ? (
                              // Display shipping price with edit icon
                              <>
                                <div className="flex items-start justify-between mt-3 ">
                                  <div className="flex flex-col md:flex-row items-start md:items-center mb-2">
                                    <label
                                      className="mr-4 flex"
                                      style={{
                                        width: "70%",
                                        fontSize: "16px",
                                        fontWeight: "600",
                                      }}
                                    >
                                      Shipping Price:
                                      <MdEdit
                                        onClick={() => {
                                          setIsEditingShipping(true);
                                          // setUspsShippingRate(false);
                                        }}
                                        // Enable editing mode
                                        className="text-bright-green text-[1.5rem] cursor-pointer"
                                      />
                                    </label>
                                    <input
                                      onChange={handleCreateInvoiceInputChange}
                                      name="shippingPrice"
                                      value={createInvoiceData.shippingPrice}
                                      type="text"
                                      placeholder="$ 0.00"
                                      className="border border-gray-300  p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-black"
                                    />
                                  </div>
                                </div>
                                <div className="flex justify-center items-center">
                                  <Button
                                    text={"Continue"}
                                    loading={checkRate}
                                    type="success"
                                    onClick={() => {
                                      // handleUspsPostRequest();
                                      // handleStateTaxCalculate();
                                      setShowTotal(true);

                                      setIsEditingShipping(false);
                                    }}
                                  />
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="pb-3">
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
                                        <option value="kg">kg</option>
                                        <option value="g">g</option>
                                        <option value="lbs">lbs</option>
                                        <option value="oz">oz</option>
                                      </select>
                                    </div>
                                  </div>

                                  <div className="flex flex-col md:flex-row items-start md:items-center mb-2">
                                    <label
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
                                        className="border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-black"
                                      />
                                      X
                                      <input
                                        name="width"
                                        onChange={handleInputChange}
                                        value={uspsData.width}
                                        type="number"
                                        placeholder="0"
                                        min={0}
                                        className="border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-black"
                                      />
                                      X
                                      <input
                                        name="height"
                                        onChange={handleInputChange}
                                        value={uspsData.height}
                                        type="number"
                                        placeholder="0"
                                        className="border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-black"
                                        min={0}
                                      />
                                    </div>
                                  </div>

                                  <div className="flex justify-center items-center">
                                   
                                    <Button
                                      text={"Continue"}
                                      loading={checkRate}
                                      type="success"
                                      onClick={() => {
                                        if (uspsData.weight <= 0) {
                                          toast.error(
                                            "Please Enter the weight."
                                          );
                                          return;
                                        }

                                        handleUspsPostRequest();
                                        // handleStateTaxCalculate();
                                      }}
                                    />
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        </>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateInvoicePopup;
