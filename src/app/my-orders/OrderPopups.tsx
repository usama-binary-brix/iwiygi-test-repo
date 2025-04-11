import React from "react";
import { IoClose } from "react-icons/io5";
import { FaTextWidth } from "react-icons/fa";
import Button from "@/components/button/Button";
import TextInput from "@/components/Form/TextInput";

interface OrderPopupsProps {
  type: "received" | "notReceived" | "tracking";
  showPopup: boolean;
  onClose: () => void;
  onSubmit: () => void;
  refundReason?: string;
  setRefundReason?: (value: string) => void;
  trackingNumber?: string;
  setTrackingNumber?: (value: string) => void;
}

const OrderPopups: React.FC<OrderPopupsProps> = ({
  type,
  showPopup,
  onClose,
  onSubmit,
  refundReason,
  setRefundReason,
  trackingNumber,
  setTrackingNumber,
}) => {
  if (!showPopup) return null;

  const renderContent = () => {
    switch (type) {
      case "received":
        return (
          <>
            <h2 className="text-3xl font-semibold mb-4 text-[#03F719] ">
              Order Received?
            </h2>
            <p>
              Please confirm that you have successfully received the item. By
              selecting Order Received, the held payment will be released to
              the seller.
            </p>
            <center>
              <Button text="Order Received" onClick={onSubmit} type="success" />
            </center>
          </>
        );

      case "notReceived":
        return (
          <>
            <h2 className="text-3xl font-semibold mb-4 text-[#03F719] ">
              Order not Received?
            </h2>
            <p>
              Please confirm that you have not received the item. By clicking
              Order Not Received, the order will be canceled, and your payment
              will be refunded to your bank account.
            </p>
            <TextInput
              type="text"
              icon={() => (
                <FaTextWidth className="text-[16px] text-black font-bold" />
              )}
              placeholder="Enter Refund Reason here..."
              className="w-full md:w-[300px] h-[45px] placeholder:text-black mt-[20px]"
              value={refundReason}
              onChange={(e) => setRefundReason?.(e.target.value)}
            />
            <center>
              <Button text="Refund" onClick={onSubmit} type="success" />
            </center>
          </>
        );

      case "tracking":
        return (
          <>
            <h2 className="text-3xl font-semibold mb-4 text-[#03F719] ">
              Add Delivery Tracking Number
            </h2>
            <p>Please add your Delivery Tracking number</p>
            <TextInput
              type="text"
              icon={() => (
                <FaTextWidth className="text-[16px] text-black font-bold" />
              )}
              placeholder="Enter Tracking Number here..."
              className="w-full md:w-full h-[45px] placeholder:text-black mt-[20px]"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber?.(e.target.value)}
            />
            <center>
              <Button text="Submit" onClick={onSubmit} type="success" />
            </center>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div
      style={{ transform: "translate(-50%, -50%)", zIndex: "1" }}
      className="fixed bg-black top-1/2 left-1/2 border-2 border-bright-green w-[70%] md:w-[50%] lg:w-[40%] rounded-xl"
    >
      <div className="bg-black p-4 rounded-lg relative">
        <button
          className="absolute top-0 right-[-45px] bg-[#03F719] h-[35px] w-[35px] rounded-full text-white-600 font-bold"
          onClick={onClose}
        >
          <IoClose className="text-[2rem] text-black" />
        </button>
        {renderContent()}
      </div>
    </div>
  );
};

export default OrderPopups;
