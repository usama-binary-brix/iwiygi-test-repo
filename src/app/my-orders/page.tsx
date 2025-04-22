"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { TextInput } from "flowbite-react";
import { FaTextWidth } from "react-icons/fa6";
// import DatePicker from 'react-date-picker';
import "react-date-picker/dist/DatePicker.css";
import BackStep from "@/components/backStep/BackStep";
import { IoClose } from "react-icons/io5";
import MiniListView from "@/components/generic/MiniListView";
import Button from "@/components/button/Button";
import OrderPopups from "./OrderPopups";
import { MdAdd, MdDone, MdFileDownload } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

const Page = () => {
  const [showOrderReceivedPopup, setShowOrderReceivedPopup] =
    useState<boolean>(false);
  const [showOrderCancelPopup, setShowOrderCancelPopup] =
    useState<boolean>(false);
  const [trackingNumberLoading, setTrackingNumberLoading] =
    useState<boolean>(false);


  const [refundLoading, setRefundLoading] = useState<boolean>(false);
  const [orderRecievedLoading, setOrderRecievedLoading] =
    useState<boolean>(false);

  const [showOrderNotReceivedPopup, setShowOrderNotReceivedPopup] =
    useState<boolean>(false);
  const [showAddTrackingNumberPopup, setShowAddTrackingNumberPopup] =
    useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("itemsPurchased");
  const [purchasedOrders, setPurchasedOrders] = useState<any>([]);
  const [soldOrders, setSoldOrders] = useState<any>([]);
  const [isStripeLoginShow, setIsStripeLoginShow] = useState<boolean>(false);
  const [loginBtnLoading, setLoginBtnLoading] = useState<boolean>(false);
  const [trackingNumber, setTrackingNumber] = useState<string>("");
  const [invoiceId, setInvoiceId] = useState<string>("");
  const [refundReason, setRefundReason] = useState<string>("");
  const [shippingMethodModal, setShippingMethodModal] = useState(false);
  const [buyerAdressInfoModal, setBuyerAdressInfoModal] = useState(false);
  const [value, setValue] = useState(new Date());
  const [radioID, setRadioID] = useState("1");

  const handleDateChange = (date: any) => {
    setValue(date);
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleClosePopup = () => {
    setShowOrderReceivedPopup(false);
    setShowOrderNotReceivedPopup(false);
    setShowOrderCancelPopup(false)
  };

  const orderNotReceived = (invoiceId: any) => {
    setInvoiceId(invoiceId);
    setShowOrderNotReceivedPopup(true);
    setShowOrderReceivedPopup(false);
  };
  const orderCancel = (invoiceId: any) => {
    setInvoiceId(invoiceId);
    setShowOrderNotReceivedPopup(false);
    setShowOrderCancelPopup(true)
    setShowOrderReceivedPopup(false);
  };
  const allItems = async () => {
    let accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      console.error("Access token not found");
      return;
    }
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/payments/sold-purchased-orders`,
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
          if (response.statusCode == 200) {
            setSoldOrders(response.data.soldOrders);
            setPurchasedOrders(response.data.purchasedOrders);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  };
  const handleLoginToStripe = async () => {
    setLoginBtnLoading(true);
    let accessToken = localStorage.getItem("accessToken");
    await fetch(
      `${process.env.NEXT_PUBLIC_API}/api/payments/create-sellerlogin-link`,
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
        setLoginBtnLoading(false);
        if (response.statusCode === 400) {
          toast.error(response.message);
        } else if (response.statusCode === 404) {
          toast.error("Something Went Wrong");
        } else {
          window.open(response.data, "_blank");
        }
      })
      .catch((error) => {
        setLoginBtnLoading(false);
        toast.error(error.message);
      });
  };
  useEffect(() => {
    allItems();
    const user: any = localStorage.getItem("User");
    if (
      user.stripeAccountId &&
      (user.stripeAccountStatus !== null || user.stripeAccountStatus !== "")
    ) {
      setIsStripeLoginShow(true);
    }
  }, []);
  const handleReceivedOrder = (invoiceId: any) => {
    setInvoiceId(invoiceId);
    setShowOrderReceivedPopup(true);
    setShowOrderNotReceivedPopup(false);
  };
  // const handleTrackingNumber = (invoiceId: any) => {
  //   setInvoiceId(invoiceId);
  //   setShowAddTrackingNumberPopup(true);
  // };
  const handleTrackingNumber = (
    invoiceId: any,
    existingTrackingNumber: string | null
  ) => {
    setInvoiceId(invoiceId);
    setTrackingNumber(existingTrackingNumber || ""); // If tracking number exists, set it; otherwise, empty string
    setShowAddTrackingNumberPopup(true);
  };

  const handleCloseTrackingNumber = () => {
    setInvoiceId("");
    setShowAddTrackingNumberPopup(false);
  };
  const handleViewInvoice = (invoiceReceipt: any) => {
    window.location.href = invoiceReceipt;
  };
  const handleViewInvoiceUrl = (invoiceReceipt: any) => {
    // window.open(invoicUrl, "_blank");
    window.location.href = invoiceReceipt;
  };

  const handleViewLabelUrl = async (id: any) => {
  


    try {
      const accessToken = localStorage.getItem("accessToken");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/label/generate-labels/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const responseBuyNowData = await response.json();
      if (response.ok) {
        toast.success(
          "Invoice Labels are Generated."
        );
        // setBuyNowLoading(false);
        // handleClosePopup();
      } else {
        // setBuyNowLoading(false);
        // toast.error(responseBuyNowData?.message || "Something went wrong.");
      }
    } catch (error) {
      // setBuyNowLoading(false);
      toast.error("An error occurred while submitting your information.");
    }





  };



  

  const submitTrackingNumber = async () => {
    if (trackingNumber === "") {
      toast.error("Please enter a tracking number before submitting.");
      return false;
    }
    setTrackingNumberLoading(true);
    let accessToken = localStorage.getItem("accessToken");
    let apiUrl = `${process.env.NEXT_PUBLIC_API}/api/payments/add-tracking-number`;
    await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        invoiceId: invoiceId.toString(),
        trackingNumber,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setInvoiceId("");
        setTrackingNumber("");
        setShowAddTrackingNumberPopup(false);
        setTrackingNumberLoading(false);

        if (data.statusCode != 200) {
          toast.error(data.message);
          setTrackingNumberLoading(false);

          return;
        } else {
          toast.error(data.message);
          setTrackingNumberLoading(false);

          allItems();
        }
      })
      .catch((error) => {
        setTrackingNumberLoading(false);

        console.error("Error:", error);
      });
  };
  const submitForRefund = async () => {
    if (refundReason === "") {
      toast.error("Please enter a tracking number before submitting.");
      return false;
    }
    setRefundLoading(true);
    let accessToken = localStorage.getItem("accessToken");
    let apiUrl = `${process.env.NEXT_PUBLIC_API}/api/payments/buyer-refund-request/${invoiceId}`;
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
        setShowOrderNotReceivedPopup(false);
        setRefundLoading(false);

        if (data.statusCode != 200) {
          toast.error(data.message);
          setRefundLoading(false);

          return;
        } else {
          toast.error(data.message);
          setRefundLoading(false);

          allItems();
        }
      })
      .catch((error) => {
        setRefundLoading(false);

        console.error("Error:", error);
      });
  };

  const submitOrderRecieved = async () => {
    setOrderRecievedLoading(true);
    let accessToken = localStorage.getItem("accessToken");
    let apiUrl = `${process.env.NEXT_PUBLIC_API}/api/payments/order-status/${invoiceId}`;
    await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setInvoiceId("");
        setShowOrderReceivedPopup(false);
        setOrderRecievedLoading(false);

        if (data.statusCode != 200) {
          toast.error(data.message);
          setOrderRecievedLoading(false);

          return;
        } else {
          toast.error(data.message);
          setOrderRecievedLoading(false);

          allItems();
        }
      })
      .catch((error) => {
        setOrderRecievedLoading(false);

        console.error("Error:", error);
      });
  };

  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<= shipping method Modal =>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  const handleShippingModal = () => {
    console.log("modal is open");

    setShippingMethodModal(true);
  };

  const handleCloseShippingModal = () => {
    console.log("modal is open");

    setShippingMethodModal(false);
  };

  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<= buyer Adress Info  Modal =>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  const handleByerInfoModal = () => {
    setShippingMethodModal(false);
    setBuyerAdressInfoModal(true);
  };

  const handleCloseByerInfoModal = () => {
    setBuyerAdressInfoModal(false);
  };
  // const currentStatus = "Pending";
  // const [selectedStatus, setSelectedStatus] = useState(currentStatus);

  // const statusOptions = [
  //   "Pending",
  //   "Processing",
  //   "Shipped",
  //   "Delivered",
  //   "Cancelled",
  // ];

  // const handleStatusChange = (event: any) => {
  //   setSelectedStatus(event.target.value);
  // };

  // const [orderStatuses, setOrderStatuses] = useState<{ [key: string]: string }>(
  //   () =>
  //     soldOrders.reduce((acc: any, order: any) => {
  //       acc[order.orderId] = order.orderStatus || "Pending";
  //       return acc;
  //     }, {} as { [key: string]: string })
  // );

  const [orderStatuses, setOrderStatuses] = useState<{ [key: string]: string }>(
    {}
  );

  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  useEffect(() => {
    if (soldOrders.length > 0) {
      const statuses = soldOrders.reduce(
        (acc: { [key: string]: string }, order: any) => {
          acc[order.orderId] = order.orderStatus
            ? capitalize(order.orderStatus)
            : "Pending"; // Default to "Pending" if missing
          return acc;
        },
        {}
      );

      setOrderStatuses(statuses);
    }
  }, [soldOrders]);

  // console.log(soldOrders, 'soldorder')

  const statusOptions = ["Pending", "Shipped", "Completed", "Cancelled"];
  const token = localStorage.getItem("accessToken");

  const handleStatusChange = async (invoiceId: string, orderStatus: string) => {
    setOrderStatuses((prev) => ({ ...prev, [invoiceId]: orderStatus }));
    const lowerCaseStatus = orderStatus.toUpperCase();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/payments/order-status/${invoiceId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ invoiceId }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to update status");
      }
      toast.success(data.message);
    } catch (error: any) {
      toast.error(error.message);
      console.error("Error updating order status:", error);
    }
  };

  return (
    <>
      <div className="container-fluid mx-3">
        {/* {isStripeLoginShow && (
          <button
            className="text-center border-2 border-bright-green rounded-[50%] px-2 py-3 sm:px-3 sm:py-6 w-[206px] float-right  text-base font-bold leading-tight text-[#03F719] mt-[20px]"
            onClick={handleLoginToStripe}
          >
            {loginBtnLoading ? "Loading..." : "Login To Stripe Dashboard"}
          </button>
        )} */}
        {/* <h1 className='text-3xl font-bold py-3 '>My Orders</h1> */}
        <div className="text-2xl sm:text-3xl font-bold  mb-4 flex gap-3 justify-between items-center mt-3">
          <BackStep href="/" />
          <span>My Orders</span>
          <div></div>
        </div>
        <div className="flex flex-col md:flex-row mb-4">
          <button
            onClick={() => setActiveTab("itemsPurchased")}
            className={`px-8 md:min-w-[10rem] py-2 cursor-pointer bg-white text-black border-2 border-transparent font-bold  ${activeTab === "itemsPurchased" ? "active" : ""
              }`}
          >
            Items Purchased
          </button>
          <button
            onClick={() => setActiveTab("itemsSold")}
            className={`px-8 py-2 md:min-w-[12rem] cursor-pointer bg-white text-black border-2 border-transparent font-bold  ${activeTab === "itemsSold" ? "active" : ""
              }`}
          >
            Items Sold
          </button>
        </div>
        {activeTab === "itemsPurchased" && (
          <div className="grid grid-cols-1">
            <div className="overflow-x-auto">
              <table
                className="table border-2 border-[#343434] rounded w-full"
                style={{ borderRadius: 10 }}
              >
                <thead className="text-[#03F719] font-bold  bg-[#343434] rounded">
                  <tr>
                    <th className="text-start text-[16px]  p-2">Order no.</th>
                    <th className="text-start text-[16px]  p-2">Item</th>
                    <th className=" text-sm text-center p-2">
                      Click Box
                      <span className="text-xs block">
                        when order is Received
                      </span>
                    </th>

                    <th className="text-start text-[16px] p-2">Order Status</th>
                    <th className="text-start text-[16px] p-2">
                      Payment Status
                    </th>

                    <th className="text-start text-[16px] p-2">Total Price</th>
                    <th className="text-start text-[16px] p-2">Tracking no.</th>
                    <th className="text-start text-[16px] p-2">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-[#959595] text-base">
                  {purchasedOrders.length == 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center p-3 text-lg">
                        <div>
                          <p>No Item Purchased Yet.</p>
                          <div className="flex items-center justify-center mt-4">
                            <Button
                              text="Create Listings"
                              type={"success"}
                              navigateTo="/create-listing"
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    purchasedOrders.length > 0 &&
                    purchasedOrders.map((value: any, index: any) => {
                      const itemPrice = parseFloat(value?.itemPrice) || 0;
                      const shipmentAmount =
                        parseFloat(value?.shipmentAmount) || 0;
                      const stateTaxAmount =
                        parseFloat(value?.stateTaxAmount) || 0;
                      const totalAmount =
                        itemPrice + shipmentAmount + stateTaxAmount;

                      return (
                        <tr className="border-b border-[#343434]" key={index}>
                          <td className="p-3 text-sm">
                            Order-{value?.orderId}
                          </td>

                          <td className="p-3">
                            <MiniListView
                              img={value?.listingImage || ""}
                              title={value?.listingTitle || ""}
                              imgClassName="h-[35px] min-w-[55px]"
                              titleClassName="text-[13px] font-[400] line-clamp-2 text-ellipsis leading-tight"
                              mainClassName="border-none"
                            />
                          </td>
                          {value.orderStatus == 'COMPLETED' ? (
                            <>
                              <td className="p-3 text-sm capitalize justify-center">
                                <div className=" flex items-center justify-center">
                                  <div className="border-2 border-bright-green p-2 w-[fit-content] text-bright-green font-bold flex items-center">I Got It! <MdDone className="text-bright-green inline text-lg" /> </div>
                                </div>
                              </td>
                            </>
                          ) : (
                            <>
                              <td className="p-3 text-sm capitalize justify-center">
                                <div className="flex items-center justify-center">
                                  <div
                                    className="border border-bright-green p-4 w-[fit-content] cursor-pointer"
                                    onClick={() => {
                                      setShowOrderReceivedPopup(true);
                                      handleReceivedOrder(value.orderId);
                                    }}
                                  ></div>
                                </div>
                              </td>

                            </>
                          )}

                          <td className="p-3 text-sm capitalize">
                            {value.orderStatus.toLowerCase() || "N/A"}
                          </td>
                          <td className="p-3 text-sm capitalize">
                            {value.paymentStatus.toLowerCase() || "N/A"}
                          </td>
                          <td className="p-3 text-sm">
                            ${totalAmount?.toFixed(2) || "0.00"}
                          </td>
                          <td className="p-3 text-sm">
                            {value.trackingNumber || "N/A"}
                          </td>

                          <td className="text-sm">
                            <div className="relative">
                              <select
                                onChange={(e) => {
                                  const action = e.target.value;
                                  if (action === "refund") {
                                    orderNotReceived(value.orderId);
                                  } else if (action === "received") {
                                    handleReceivedOrder(value.orderId);
                                  } else if (action === "cancel") {
                                    orderCancel(value.orderId);
                                  } else if (action === "invoice") {
                                    handleViewInvoiceUrl(value.invoiceReceipt);
                                  }
                                }}
                                className="border-none text-sm bg-transparent text-[#959595] outline-none cursor-pointer appearance-none transition-all duration-500 ease-in-out focus:border-black focus:outline-none focus:ring focus:ring-[#212121]"
                              >
                                <option
                                  className="bg-[#212121] text-[#959595] hover:bg-gray-500 border-none"
                                  value=""
                                  disabled
                                  selected
                                >
                                  Select Option
                                </option>
                                <option
                                  className="bg-[#212121] text-[#959595] hover:bg-gray-500 border-none"
                                  value="invoice"
                                  disabled={!value.invoiceReceipt}
                                >
                                  Download Invoice
                                </option>
                                <option
                                  className="bg-[#212121] text-[#959595] hover:bg-gray-500 border-none"
                                  value="refund"
                                  disabled={
                                    value.orderStatus == "COMPLETED" ||
                                    !(
                                      value.paymentStatus === "PAID" &&
                                      value.trackingNumber
                                    )
                                  }
                                >
                                  Refund Request
                                </option>

                                <option
                                  className="bg-[#212121] text-[#959595] hover:bg-gray-500 border-none"
                                  value="cancel"
                                // disabled={
                                //   !value.trackingNumber ||
                                //   value.orderStatus == "SHIPPING"
                                // }
                                // disabled={!(value.orderStatus === "COMPLETED" && value.trackingNumber)}
                                >
                                  Cancel Order
                                </option>


                              </select>
                            </div>
                          </td>


                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {activeTab === "itemsSold" && (
          <div className="grid grid-cols-1">
            <div className="overflow-x-auto">
              <table
                className="table border-2 border-[#343434] rounded w-full"
                style={{ borderRadius: 10 }}
              >
                <thead className="text-[#03F719] font-bold  bg-[#343434] rounded">
                  <tr>
                    <th className="text-start text-[16px] p-2">Order no.</th>
                    <th className="text-start text-[16px] p-2">Item</th>
                    <th className="text-start text-[16px] p-2">Order Status</th>
                    <th className="text-start text-[16px] p-2">
                      Payment Status
                    </th>
                    <th className="text-start text-[16px] p-2">
                      Shipping Address
                    </th>
                    <th className="text-start text-[16px] p-2">Total Price</th>
                    <th className="text-start text-[16px] p-2">Invoice</th>
                    <th className="text-start text-[16px] p-2">Download Labels</th>


                    <th className="text-start text-[16px] p-2">Tracking no.</th>
                  </tr>
                </thead>
                <tbody className="text-[#959595] text-base">
                  {soldOrders && soldOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center p-3 text-lg">
                        <div>
                          <p>No Item Sold Yet.</p>
                          <div className="flex items-center justify-center mt-4">
                            <Button
                              text="All Listings"
                              type={"success"}
                              navigateTo="/listings/search"
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    soldOrders.length > 0 &&
                    soldOrders.map((value: any, index: any) => {
                      const itemPrice = parseFloat(value?.itemPrice) || 0;
                      const shipmentAmount =
                        parseFloat(value?.shipmentAmount) || 0;
                      const stateTaxAmount =
                        parseFloat(value?.stateTaxAmount) || 0;
                      const totalAmount =
                        itemPrice + shipmentAmount + stateTaxAmount;

                      return (
                        <>
                          <tr className="border-b border-[#343434]" key={index}>
                            <td className="p-3 text-sm">
                              Order-{value.orderId}
                            </td>
                            <td className="p-3">
                              <MiniListView
                                img={value?.listingImage || ""}
                                title={value.listingTitle || ""}
                                imgClassName="h-[35px] min-w-[55px]"
                                titleClassName="text-[12px] font-[400] line-clamp-2 text-ellipsis leading-tight"
                                mainClassName="border-none"
                              />
                            </td>
                            <td className="text-sm capitalize">
                              <td className="p-3 text-sm capitalize">
                                {value.orderStatus.toLowerCase() || "N/A"}
                              </td>
                            </td>

                            <td className="p-3 text-sm capitalize">
                              {value?.paymentStatus?.toLowerCase() || "N/A"}
                            </td>
                            <td className="p-3 text-sm">
                              {value?.fullAddress || "N/A"}
                            </td>

                            <td className="p-3 text-sm">
                              {/* {value?.totalPrice || "N/A"} */}$
                              {totalAmount?.toFixed(2) || "0.00"}
                            </td>
                            <td className="p-3 text-sm">
                              <p className="flex gap-3 items-center ">
                                {/* {value?.invoiceUrl || "N/A"}{" "} */}
                                {value.invoiceReceipt && (
                                  <MdFileDownload
                                    className="text-bright-green text-[1.2rem] cursor-pointer"
                                    onClick={() =>
                                      handleViewInvoiceUrl(value.invoiceReceipt)
                                    }
                                  />
                                )}

                              </p>
                            </td>

                            <td className="p-3 text-sm">



                            
                              <p className="flex gap-3 items-center ">
                                {/* {value?.labels?.invoiceReceipt && (
                                  <MdFileDownload
                                    className="text-bright-green text-[1.2rem] cursor-pointer"
                                    onClick={() =>
                                      handleViewLabelUrl(value.invoiceReceipt)
                                    }
                                  />
                                )} */}



<MdFileDownload
                                    className="text-bright-green text-[1.2rem] cursor-pointer"
                                    onClick={() =>
                                      handleViewLabelUrl(value.orderId)
                                    }
                                  />

                              </p>
                            </td>


                            <td className="p-3 text-sm">
                              <p className="flex gap-3 items-center ">
                                {value?.trackingNumber || "N/A"}{" "}
                                <FaEdit
                                  className="text-bright-green text-[1.2rem] cursor-pointer"
                                  onClick={() =>
                                    handleTrackingNumber(
                                      value.orderId,
                                      value.trackingNumber
                                    )
                                  }
                                />
                              </p>
                            </td>
                          </tr>
                        </>
                      );
                    })
                  )}
                </tbody>

                {shippingMethodModal && (
                  <div className="fixed inset-0  bg-gray-800/50 flex justify-center items-center">
                    <div
                      className="bg-black border-light-green xl:w-[50%]   border-2 p-6 border-bright-green rounded-lg shadow-lg scale-95 
                                        animate-[fadeIn_0.3s_ease-out]"
                    >
                      <div className="mb-3">
                        <h1 className="text-bright-green font-bold text-2xl mb-3">
                          Order-051
                        </h1>
                        <h1 className="text-lightGray font-bold text-2xl">
                          Shipping Method
                        </h1>
                        <p className="text-lg text-lightGray opacity-[0.7] ">
                          Select how you want to proceed
                        </p>
                      </div>
                      <div className="border-b flex gap-8 mb-3 pb-4">
                        <p className="text-lg text-lightGray font-normal opacity-[0.7]">
                          Shipping Method:
                        </p>
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
                              MANUAL
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
                              AUTOMATE SHIPPING
                            </label>
                          </label>
                        </div>
                      </div>

                      {radioID === "1" && (
                        <div>
                          <p className="font-bold text-xl text-white">
                            Are you sure you want to proceed with manual
                            delivery? This Action isn’t reversible!
                          </p>

                          <div className="flex justify-center">
                            <button
                              onClick={handleByerInfoModal}
                              className="border-4 border-bright-green text-bright-green rounded-[70%] my-2 font-semibold bg-darkGray 
                                                      text-bold-800 px-5 py-4 hover:scale-105 transition-transform"
                            >
                              Yes, I'm Sure!
                            </button>
                          </div>
                        </div>
                      )}
                      {radioID === "2" && (
                        <>
                          <div className=" flex gap-8 mb-3">
                            <h1>SELECT DELIEVRY PARTNER</h1>
                            <label className="flex items-center  cursor-pointer">
                              <input
                                id="default-radio-1"
                                type="radio"
                                value=""
                                name="default-radio"
                                className="w-4 h-4 text-bright-green bg-gray-100 border-gray-300 focus:ring-bright-green dark:focus:ring-bright-green dark:ring-birght-green focus:ring-2 dark:bg-birght-green dark:border-bright-green"
                              />
                              <label
                                htmlFor="usps-radio"
                                className="ms-2 text-sm font-medium text-white dark:text-gray-300"
                              >
                                USPS
                              </label>
                            </label>

                            <label className="flex items-center  cursor-pointer">
                              <input
                                id="default-radio-2"
                                type="radio"
                                value=""
                                name="default-radio"
                                className="w-4 h-4 text-bright-green bg-gray-100 border-gray-300 focus:ring-bright-green dark:focus:ring-bright-green dark:ring-birght-green focus:ring-2 dark:bg-birght-green dark:border-bright-green"
                              />
                              <label
                                htmlFor="ups-radio"
                                className="ms-2 text-sm font-medium text-white dark:text-gray-300"
                              >
                                UPS
                              </label>
                            </label>
                          </div>
                          <div className="mb-3">
                            <h1 className="text-xl">YOUR ADRESS INFO:</h1>
                            <p className="text-lg text-lightGray opacity-[0.7]">
                              Where should we pick up the parcel?
                            </p>
                          </div>
                          <div className="mb-3">
                            <div className="flex justify-between mb-2">
                              <p className="w-[35%]"> YOUR STREET ADRESS : </p>
                              <input
                                type="text"
                                className="w-[65%] text-black h-[35px]"
                              />
                            </div>

                            <div className="flex justify-between mb-2">
                              <p className="w-[35%]"> Your City: </p>
                              <input
                                type="text"
                                className="w-[65%] h-[35px] text-black"
                              />
                            </div>

                            <div className="flex justify-between mb-2">
                              <p className="w-[35%]"> Your Postal Code: </p>
                              <input
                                type="text"
                                className="w-[65%] h-[35px] text-black"
                              />
                            </div>

                            <div className="flex justify-between mb-2">
                              <p className="w-[35%]">
                                {" "}
                                Your House / Office Number:
                              </p>
                              <input
                                type="text"
                                className="w-[65%] h-[35px] text-black"
                              />
                            </div>
                          </div>
                          <div className="mb-3">
                            <h1>Set Your Avalaibility:</h1>
                            <p className="text-lg text-lightGray opacity-[0.7]">
                              Set your availability for the delivery company to
                              pick up the parcel!
                            </p>
                          </div>
                          <div className="mb-3">
                            <div className="flex justify-between mb-2">
                              <p className="w-[34%] opacity-[0.7]">
                                {" "}
                                Select Shipping Vendor:{" "}
                              </p>
                              <input
                                type="text"
                                className="w-[66%] text-black h-[35px]"
                              />
                            </div>

                            <div className="flex justify-between mb-2">
                              <p className="w-[34%] opacity-[0.7]">
                                {" "}
                                Select Date:{" "}
                              </p>
                              <input
                                type="text"
                                className="w-[66%] text-black h-[35px]"
                              />
                            </div>
                            <div className="flex  justify-between mb-2">
                              <p className="w-[34%] opacity-[0.7]">
                                {" "}
                                Select time:{" "}
                              </p>
                              <input
                                type="text"
                                className="h-[35px] text-black"
                              />
                              <input
                                type="text"
                                className="h-[35px] text-black"
                              />
                            </div>

                            <div className="flex justify-center mt-3">
                              <button
                                onClick={handleCloseShippingModal}
                                className="border-4 border-bright-green text-bright-green rounded-[70%] my-2 font-semibold bg-darkGray 
                                                      text-bold-800 text-black px-5 py-4 rounded hover:scale-105 transition-transform"
                              >
                                save Info
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* buyer Adress Info Modal */}

                {buyerAdressInfoModal && (
                  <div className="fixed inset-0  bg-gray-800/50 flex justify-center items-center">
                    <div
                      className="bg-black border-light-green xl:w-[40%]   border-2 p-6 border-bright-green rounded-lg shadow-lg scale-95 
                                        animate-[fadeIn_0.3s_ease-out]"
                    >
                      <div className="mb-3">
                        <h1 className="text-bright-green font-bold text-2xl mb-3">
                          Buyer Address info for Order-051:
                        </h1>
                      </div>

                      <div>
                        <div className="flex justify-between mb-2">
                          <p className="w-[35%]"> YOUR STREET ADRESS : </p>
                          <input
                            type="text"
                            value={"11 Bramley St, Plumstead"}
                            className="w-[65%] text-black h-[35px]"
                            disabled
                          />
                        </div>
                        <div className="flex justify-between mb-2">
                          <p className="w-[35%]"> Your City: </p>
                          <input
                            type="text"
                            value={"Cape Town"}
                            className="w-[65%] h-[35px] text-black"
                            disabled
                          />
                        </div>
                        <div className="flex justify-between mb-2">
                          <p className="w-[35%]"> Your Postal Code: </p>
                          <input
                            type="text"
                            value={"7801"}
                            className="w-[65%] h-[35px] text-black"
                            disabled
                          />
                        </div>
                        <div className="flex justify-between mb-2">
                          <p className="w-[35%]">
                            {" "}
                            Your House / Office Number:
                          </p>
                          <input
                            type="text"
                            value={"H 723"}
                            className="w-[65%] h-[35px] text-black"
                            disabled
                          />
                        </div>
                      </div>

                      <div className="flex justify-center">
                        <button
                          onClick={handleCloseByerInfoModal}
                          className="border-4 border-bright-green text-bright-green rounded-[70%] my-2 font-semibold bg-darkGray 
                                                 text-bold-800 text-black px-10 py-4 rounded hover:scale-105 transition-transform"
                        >
                          Done
                        </button>
                      </div>
                    </div>
                    <span
                      onClick={handleCloseByerInfoModal}
                      className="bg-bright-green cursor-pointer relative bottom-[16%] p-3 rounded-full"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="black"
                      >
                        <path
                          d="M0.792969 0.79248L13.2068 13.2064M13.2068 0.79248L0.792969 13.2064"
                          stroke="black"
                          stroke-width="1.37931"
                        />
                      </svg>
                    </span>
                  </div>
                )}
              </table>
            </div>
          </div>
        )}
        {showOrderReceivedPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="p-5">
              <div className="bg-black p-4 rounded-lg relative max-w-[30rem]">
                <div className="flex items-start justify-between">
                  <h2 className="text-2xl font-semibold mb-4 text-white ">
                    Order Received?
                  </h2>
                  <button
                    className=" h-[35px] w-[35px] rounded-full text-white-600 font-bold"
                    onClick={handleClosePopup}
                  >
                    <IoClose className="text-[2rem] text-white" />
                  </button>
                </div>
                <p>
                  Please confirm that you have successfully received the item.
                  By selecting Order Received, the held payment will be released
                  to the seller.
                </p>

                <center className="mt-3 flex gap-3 items-center justify-center">
                  <Button
                    text="Cancel"
                    onClick={handleClosePopup}
                    type={"success"}
                  />

                  <Button
                    text="Order Received"
                    loading={orderRecievedLoading}
                    onClick={() => submitOrderRecieved()}
                    type={"success"}
                  />
                </center>
              </div>
            </div>
          </div>
        )}
        {showOrderNotReceivedPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="p-5">
              <div className="bg-black p-4 rounded-lg relative max-w-[30rem]">
                <div className="flex items-start justify-between">
                  <h2 className="text-3xl font-semibold mb-4 text-white">
                    Order not Received?
                  </h2>
                  <button
                    className=" h-[35px] w-[35px] rounded-full text-white-600 font-bold"
                    onClick={handleClosePopup}
                  >
                    <IoClose className="text-[2rem] text-white" />
                  </button>
                </div>
                <p className="text-[0.9rem]">
                  Please confirm that you have not received the item. By
                  clicking Order Not Received, the order will be canceled, and
                  your payment will be refunded to your bank account.
                </p>

                {/* <TextInput
                  type="text"
                  icon={() => (
                    <FaTextWidth className="text-[16px] text-black font-bold" />
                  )}
                  placeholder="Enter Refund Reason Here..."
                  className="w-full h-[45px] placeholder:text-black mt-[20px]"
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                /> */}
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
                    onClick={submitForRefund}
                    type={"success"}
                  />
                </center>
              </div>
            </div>
          </div>
        )}
        {showOrderCancelPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="p-5">
              <div className="bg-black p-4 rounded-lg relative max-w-[30rem]">
                <div className="flex items-start justify-between">
                  <h2 className="text-3xl font-semibold mb-4 text-white">
                    Want to Cancel Order?
                  </h2>
                  <button
                    className=" h-[35px] w-[35px] rounded-full text-white-600 font-bold"
                    onClick={handleClosePopup}
                  >
                    <IoClose className="text-[2rem] text-white" />
                  </button>
                </div>
                <p className="text-[0.9rem]">
                  Please confirm that you do not want this. By clicking Submit, the order will be canceled.
                </p>

                {/* <TextInput
                  type="text"
                  icon={() => (
                    <FaTextWidth className="text-[16px] text-black font-bold" />
                  )}
                  placeholder="Enter Refund Reason Here..."
                  className="w-full h-[45px] placeholder:text-black mt-[20px]"
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                /> */}
                <textarea
                  placeholder="Enter Refund Reason Here..."
                  rows={5}
                  className="w-full h-auto placeholder:text-gray text-black mt-[20px] hidden"
                  value={'I Want to cancel my order'}
                // onChange={(e: any) => setRefundReason(e.target.value)}
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
                    onClick={submitForRefund}
                    type={"success"}
                  />
                </center>
              </div>
            </div>
          </div>
        )}
        {showAddTrackingNumberPopup && (
          <div className="relative">
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
              <div className="p-5">
                <div className="bg-black p-4 rounded-lg relative md:min-w-[30rem] max-w-[30rem]">
                  <div className="flex justify-between items-start">
                    <h2 className="text-2xl font-semibold mb-2 text-white">
                      Add Delivery Tracking Number
                    </h2>
                    <button
                      className="rounded-full text-white-600 font-bold"
                      onClick={handleCloseTrackingNumber}
                    >
                      <IoClose className="text-[1.5rem]" />
                    </button>
                  </div>

                  <p>Please add your Delivery Tracking number</p>
                  <TextInput
                    type="text"
                    icon={() => (
                      <FaTextWidth className="text-[16px] text-black font-bold" />
                    )}
                    placeholder="Enter Tracking Number Here..."
                    className="w-full md:w-full h-[45px] placeholder:text-black mt-[20px]"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                  />
                  <center className="mt-3 flex gap-3 items-center justify-center">
                    <Button
                      text="Cancel"
                      onClick={handleCloseTrackingNumber}
                      type={"success"}
                    />
                    <Button
                      text="Submit"
                      loading={trackingNumberLoading}
                      onClick={submitTrackingNumber}
                      type={"success"}
                    />
                  </center>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* <OrderPopups
          type="received"
          showPopup={showOrderReceivedPopup}
          onClose={() => setShowOrderReceivedPopup(false)}
          onSubmit={() => {
            submitOrderRecieved
            setShowOrderReceivedPopup(false);
          }}
        />
        <OrderPopups
          type="notReceived"
          showPopup={showOrderNotReceivedPopup}
          onClose={() => setShowOrderNotReceivedPopup(false)}
          onSubmit={() => {
            submitForRefund
            setShowOrderNotReceivedPopup(false);
          }}
          refundReason={refundReason}
          setRefundReason={setRefundReason}
        />
        <OrderPopups
          type="tracking"
          showPopup={showAddTrackingNumberPopup}
          onClose={() => setShowAddTrackingNumberPopup(false)}
          onSubmit={() => {
            submitTrackingNumber;
            setShowAddTrackingNumberPopup(false);
          }}
          trackingNumber={trackingNumber}
          setTrackingNumber={setTrackingNumber}
        /> */}
        <style jsx>{`
          .active {
            background-color: #00ff00;
            color: black;
          }
        `}</style>
      </div>
    </>
  );
};

export default Page;
