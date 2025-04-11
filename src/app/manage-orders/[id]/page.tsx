"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import BackStep from "@/components/backStep/BackStep";
import MiniListView from "@/components/generic/MiniListView";
import { BiEdit } from "react-icons/bi";
import Image from "next/image";
import { IoClose, IoArrowBackSharp } from "react-icons/io5";
import Button from "@/components/button/Button";
import { useGetSingleAdminOrderQuery } from "@/store/api";
import { toast } from "sonner";
import { FaTextWidth } from "react-icons/fa";
import TextInput from "@/components/Form/TextInput";

const OrderDetailsPage = () => {
  const params = useParams();
  const id = params?.id as string | undefined;
  const { data: allOrders, error, isLoading } = useGetSingleAdminOrderQuery(id);
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    buyerInfo: false,
    sellerInfo: false,
    shippingInfo: false,
    invoice: false,
  });
  const [orderRecievedLoading, setOrderRecievedLoading] = useState(false);

  const [showPopup, setShowPopup] = useState(false);
  const [showForm, setShowForm] = useState(false);
  useEffect(() => window.scrollTo(0, 0), []);
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

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setShowRefundReasonPopup(false);
    setShowPaymentRelease(false);

  };


  const [shippingAddress, setShippingAddress] = useState({
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
  });

  useEffect(() => {
    if (allOrders?.data) {
      setShippingAddress({
        streetAddress: allOrders.data.streetAddress || "",
        city: allOrders.data.city || "",
        state: allOrders.data.state || "",
        zipCode: allOrders.data.zipCode || "",
      });
    }
  }, [allOrders]);

  const handleDownloadInvoice = (invoiceReceipt: any) => {
    window.location.href = invoiceReceipt;
  };

  const alreadyPayout = () => {
    toast.error("Already Paid to Seller");
  };

  const PayoutToSeller = async () => {
    setOrderRecievedLoading(true);
    let accessToken = localStorage.getItem("accessToken");
    let apiUrl = `${process.env.NEXT_PUBLIC_API}/api/payments/payout-to-seller/${id}`;
    await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setOrderRecievedLoading(false);

        if (data.statusCode != 200) {
          toast.error(data.message);
          setOrderRecievedLoading(false);

          return;
        } else {
          toast.error(data.message);
          setOrderRecievedLoading(false);
        }
      })
      .catch((error) => {
        setOrderRecievedLoading(false);

        console.error("Error:", error);
      });
  };

  const [refundLoading, setRefundLoading] = useState(false);
  const [showRefundReasonPopup, setShowRefundReasonPopup] = useState(false);
  
  const [showPaymentRelease, setShowPaymentRelease] = useState(false);

  const [refundReason, setRefundReason] = useState<string>("");
  const [invoiceId, setInvoiceId] = useState<string>("");

  const RefundToBuyer = async () => {
    if (refundReason === "") {
      toast.error("Please enter a Valid Reason before submitting.");
      return false;
    }
    setRefundLoading(true);
    let accessToken = localStorage.getItem("accessToken");
    let apiUrl = `${process.env.NEXT_PUBLIC_API}/api/payments/refund-order/${invoiceId}`;
    await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        refundReason,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setInvoiceId("");
        setRefundReason("");
        setShowRefundReasonPopup(false);
        setRefundLoading(false);

        if (data.statusCode != 200) {
          toast.error(data.message);
          setRefundLoading(false);

          return;
        } else {
          toast.error(data.message);
          setRefundLoading(false);
        }
      })
      .catch((error) => {
        setRefundLoading(false);

        console.error("Error:", error);
      });
  };

  const orderNotReceived = (invoiceId: any) => {
    setInvoiceId(invoiceId);
    setShowRefundReasonPopup(true);
  };

  console.log(allOrders, "data of all orders");
  console.log(invoiceId, "set in voice id ");

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <BackStep href="/manage-orders" />
        <h1 className="text-2xl sm:text-3xl font-bold">Order Details</h1>
        <div></div>
      </div>

      <div className="px-[1%] lg:px-[20%] mb-6">
        <p className="text-xl font-bold text-bright-green">Order No: {id}</p>

        <div className="space-y-4 mt-3">
          <div className="lg:flex gap-4">
            {/* --------------Buyer info box ---------- */}

            <div className="lg:w-1/2 mb-4 lg:mb-0 rounded-lg shadow-sm border p-3">
              <p className="text-xl text-center w-full font-bold text-bright-green mb-2">
                Buyer Information
              </p>
              <div className="w-full bg-transparent">
                <table className="w-full border-collapse  text-white">
                  <tbody>
                    {" "}
                    <tr className="">
                      <td className=" font-bold text-bright-green">
                        Full Name:
                      </td>
                      <td className="p-1">
                        {allOrders?.data?.buyerUser?.fullname || "N/A"}
                      </td>
                    </tr>
                    <tr className="">
                      <td className=" font-bold text-bright-green">
                        Username:
                      </td>
                      <td className="p-1">
                        {allOrders?.data?.buyerUser?.username || "N/A"}
                      </td>
                    </tr>
                    <tr className="">
                      <td className=" font-bold text-bright-green break-words">Email:</td>
                      <td className="p-1 break-words break-all whitespace-normal">
  {allOrders?.data?.buyerUser?.email || "N/A"}
</td>

                    </tr>
                    <tr className="">
                      <td className=" font-bold text-bright-green">Address:</td>
                      <td className="p-1">
                        {allOrders?.data?.buyerUser?.streetAddress || "N/A"},{" "}
                        {allOrders?.data?.buyerUser?.city || "N/A"},{" "}
                        {allOrders?.data?.buyerUser?.state || "N/A"}{" "}
                        {allOrders?.data?.buyerUser?.zipCode || "N/A"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            {/* --------------Seller info box ---------- */}

            <div className=" lg:w-1/2 rounded-lg shadow-sm border p-3">
              <p className="text-xl w-full font-bold text-bright-green mb-2 text-center">
                Seller Information
              </p>

              <table className="w-full border-collapse  text-white">
                <tbody>
                  {" "}
                  <tr className="">
                    <td className=" font-bold text-bright-green">Full Name:</td>
                    <td className="p-1">
                      {allOrders?.data?.sellerUser?.fullname || "N/A"}
                    </td>
                  </tr>
                  <tr className="">
                    <td className=" font-bold text-bright-green">Username:</td>
                    <td className="p-1">
                      {allOrders?.data?.sellerUser?.username || "N/A"}
                    </td>
                  </tr>
                  <tr className="">
                    <td className=" font-bold text-bright-green break-words">Email:</td>
                    <td className="p-1 break-words break-all whitespace-normal">
                      {allOrders?.data?.sellerUser?.email || "N/A"}
                    </td>
                  </tr>
                  <tr className="">
                    <td className=" font-bold text-bright-green">Address:</td>
                    <td className="p-1">
                      {allOrders?.data?.sellerUser?.streetAddress || "N/A"},{" "}
                      {allOrders?.data?.sellerUser?.city || "N/A"},{" "}
                      {allOrders?.data?.sellerUser?.state || "N/A"}{" "}
                      {allOrders?.data?.sellerUser?.zipCode || "N/A"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          {/* --------------Listing box ---------- */}

          <div className="border p-4 rounded-lg shadow-sm">
            <MiniListView
              title={allOrders?.data?.listing?.title}
              description={allOrders?.data?.listing?.description}
              img={allOrders?.data?.listing?.featuredImage}
              imgClassName={"min-w-[70px] h-[70px]"}
              descriptionClassName={"text-[14px] text-gray-400 break-words"}
            />
          </div>

          {/* --------------Shipping info box ---------- */}

          <div className="border p-3 rounded-lg">
            <p className="text-xl w-full font-bold text-bright-green mb-2">
              Shipping Information:
            </p>

            <div className=" items-start w-full bg-transparent">
              <td className=" font-bold text-bright-green">
                Tracking Number:
                <span className="text-white">
                  {" "}
                  {allOrders?.data?.deliveryTrackingNumber || "N/A"}{" "}
                </span>
              </td>
              <tr className="">
                <td className="text-bright-green font-medium p-1">
                  <div className="flex flex-col sm:flex-row">
                    <span className="sm:mr-2 font-bold">Origin Address:</span>
                    <span className="text-white">
                      {allOrders?.data?.sellerUser?.streetAddress || "N/A"},{" "}
                      {allOrders?.data?.sellerUser?.city || "N/A"},{" "}
                      {allOrders?.data?.sellerUser?.state || "N/A"}{" "}
                      {allOrders?.data?.sellerUser?.zipCode || "N/A"}
                    </span>
                  </div>
                </td>
              </tr>

              <tr className="">
                <td className="text-bright-green font-medium p-1">
                  <div className="flex flex-col sm:flex-row">
                    <span className="sm:mr-2 font-bold">
                      Destination Address:
                    </span>
                    <span className="text-white">
                      {shippingAddress.streetAddress}, {shippingAddress.city},{" "}
                      {shippingAddress.state}, {shippingAddress.zipCode}
                    </span>
                  </div>
                </td>
              </tr>

              {/* <div className="flex items-center">
                <BiEdit
                  className="text-xl text-bright-green cursor-pointer"
                  onClick={() => setShowPopup(true)}
                />
              </div> */}
            </div>
          </div>
          {/* --------------Invoice info box ---------- */}

          <div className="border rounded-lg p-3">
            <p className="text-xl text-start w-full font-bold text-bright-green mb-2">
              Invoice Details:
            </p>
            <div className="lg:flex gap-4">
              <div className="lg:w-1/2 mb-4 lg:mb-0 ">
                <div className="w-full bg-transparent">
                  <table className="w-full border-collapse  text-white">
                    <tbody>
                      {" "}
                      <tr className="">
                        <td className=" font-bold text-bright-green">
                          Item Price
                        </td>
                        <td className="p-1">
                          $ {allOrders?.data?.itemPrice || "N/A"}
                        </td>
                      </tr>
                      <tr className="">
                        <td className=" font-bold text-bright-green">
                          Shipping Price:
                        </td>
                        <td className="p-1">
                          $ {allOrders?.data?.shipmentAmount || "N/A"}
                        </td>
                      </tr>
                      <tr className="">
                        <td className=" font-bold text-bright-green">
                          State Tax:{" "}
                        </td>

                        <td className="p-1 break-words">


                          {/* $ {allOrders?.data?.stateTaxAmount || "N/A"} */}
                        
                        $ {allOrders?.invoice?.total_taxes[0]?.amount/100 || 'N/A'}
                        </td>
                      </tr>
                      <tr className="border-t-2">
                        <td className=" font-bold text-bright-green">
                          Total Amount:{" "}
                        </td>
                        <td className="p-1 break-words">
                          ${" "}
                          {(
                            ((allOrders?.invoice?.total_taxes[0]?.amount/100) || 0) +
                            (parseFloat(allOrders?.data?.shipmentAmount) || 0) +
                            (parseFloat(allOrders?.data?.itemPrice) || 0)
                          ).toFixed(2)}{" "}
                          <span className="capitalize">
                            (
                            {allOrders?.data?.paymentStatus.toLowerCase() ||
                              "--"}
                            )
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className=" lg:w-1/2 "></div>
            </div>
          </div>

          {/* ----------------------- Refund Box----------------- */}
          {allOrders?.data?.buyerRequestReason !== null && (
            <div className="border p-3 rounded-lg">
              <p className="text-xl w-full font-bold text-bright-green mb-2">
                Order Refund : 
              </p>

              <div className=" items-start w-full bg-transparent">
                <div className="">
                  <p className="text-bright-green">Refund Reason : <span className="text-white">
                {allOrders?.data?.buyerRequestReason ||
                      "No Any Reason Given by Buyer"}
                </span></p>
                  <p className="text-bright-green">
                    Refund Status : <span className="text-white"> {allOrders?.data?.buyerRequestStatus}</span>
                  </p>
               
                </div>
              </div>
            </div>
          )}

          <div>
            <div className="rounded-lg flex items-center flex-wrap gap-5 bg-transparent">
              {/* <Button text={"Release Payment"} type={"success"} onClick={submitOrderRecieved} loading={orderRecievedLoading}/> */}

              {allOrders?.data?.payoutStatus === "PAID" ? (
                <Button
                  text={"Already Paid to Seller"}
                  type={"success"}
                  onClick={alreadyPayout}
                />
              ) : allOrders?.data?.paymentStatus === "PAID" ? (
                <Button
                  text={"Release Payment"}
                  type={allOrders?.data?.orderStatus !== 'COMPLETED' ? 'disable':"success"}
                  disabled={allOrders?.data?.orderStatus !== 'COMPLETED'}

                  onClick={()=>setShowPaymentRelease(true)}
                />
              ) : null}


              {allOrders?.data?.buyerRequestReason !== null && (
              <Button
              text={"Refund payment"}
              type={allOrders?.data?.buyerRequestStatus == 'APPROVED' ? 'disable':"success"}
                  disabled={allOrders?.data?.buyerRequestStatus == 'APPROVED'}
              onClick={() => orderNotReceived(allOrders?.data?.id)}
            />              )}
              <Button
                text={"Download Invoice"}
                type={"success"}
                onClick={() =>
                  handleDownloadInvoice(allOrders?.data?.invoiceReceipt)
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Popup for shipping addres */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-black p-4 rounded-lg relative md:min-w-[30rem]">
            <button
              onClick={() => setShowPopup(false)}
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
                className="cursor-pointer mb-[12px]"
              />
            </div>
            <div className="address-container">
              <div className="flex items-center mb-2">
                <label className="mr-4 w-[30%] text-lg font-semibold">
                  Street Address
                </label>
                <input
                  className="border border-gray-300 p-2 w-full text-black"
                  value={shippingAddress.streetAddress}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      streetAddress: e.target.value,
                    })
                  }
                />
              </div>

              <div className="flex items-center mb-2">
                <label className="mr-4 w-[30%] text-lg font-semibold">
                  City
                </label>
                <input
                  className="border border-gray-300 p-2 w-full text-black"
                  value={shippingAddress.city}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      city: e.target.value,
                    })
                  }
                />
              </div>

              <div className="flex items-center mb-2">
                <label className="mr-4 w-[30%] text-lg font-semibold">
                  State
                </label>
                <select
                  className="border border-gray-300 p-2 w-full text-black"
                  value={shippingAddress.state}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      state: e.target.value,
                    })
                  }
                >
                  {Object.entries(states).map(([fullName, abbreviation]) => (
                    <option key={abbreviation} value={abbreviation}>
                      {fullName} ({abbreviation})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center mb-2">
                <label className="mr-4 w-[30%] text-lg font-semibold">
                  Zip Code
                </label>
                <input
                  className="border border-gray-300 p-2 w-full text-black"
                  value={shippingAddress.zipCode}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      zipCode: e.target.value,
                    })
                  }
                />
              </div>

              <div className="flex justify-center mt-6 gap-2">
                <Button
                  text="Cancel"
                  type="success"
                  onClick={() => setShowPopup(false)}
                />
                <Button text="Update address" type="success" />
              </div>
            </div>
          </div>
        </div>
      )}
  {showPaymentRelease && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="p-5">
            <div className="bg-black p-4 rounded-lg relative min-w-[30rem]">
              <div className="flex items-start justify-between">
                <h2 className="text-3xl font-semibold mb-4 text-white">
                 Payout to Seller
                </h2>
                <button
                  className=" h-[35px] w-[35px] rounded-full text-white-600 font-bold"
                  onClick={handleClosePopup}
                >
                  <IoClose className="text-[2rem] text-white" />
                </button>
              </div>
              <p className="text-[0.9rem]">
              Are You sure you want to payout the Seller?
              </p>

           

              <center className="mt-3 flex gap-3 items-center justify-center">
                <Button
                  text="Cancel"
                  onClick={handleClosePopup}
                  type={"success"}
                />
                <Button
                  text="Submit"
                  loading={orderRecievedLoading}
                  onClick={PayoutToSeller}
                  type={"success"}
                />
              </center>
            </div>
          </div>
        </div>
      )}
      {showRefundReasonPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="p-5">
            <div className="bg-black p-4 rounded-lg relative max-w-[30rem]">
              <div className="flex items-start justify-between">
                <h2 className="text-3xl font-semibold mb-4 text-white">
                  Refund Payment to Buyer
                </h2>
                <button
                  className=" h-[35px] w-[35px] rounded-full text-white-600 font-bold"
                  onClick={handleClosePopup}
                >
                  <IoClose className="text-[2rem] text-white" />
                </button>
              </div>
              <p className="text-[0.9rem]">
                Please enter a valid reason to proceed the refund to the buyer.
                This action is not reversible so be careful.
              </p>

              <textarea
                placeholder="Enter Refund Reason Here..."
                rows={5}
                className="w-full h-auto placeholder:text-gray text-black mt-[20px]"
                value={refundReason}
                onChange={(e: any) => setRefundReason(e.target.value)}
              />

              <center className="mt-3 flex gap-3 items-center justify-center">
                <Button
                  text="Cancel"
                  onClick={handleClosePopup}
                  type={"success"}
                />
                <Button
                  text="Submit"
                  loading={refundLoading}
                  onClick={RefundToBuyer}
                  type={"success"}
                />
              </center>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetailsPage;
