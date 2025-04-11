import Button from "@/components/button/Button";
import axios from "axios";
import Image from "next/image";
import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { toast } from "sonner";

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

const CounterOfferPrice = ({
  setShowOfferModal,
  offerPrice,
  getConversationMessagesById,
  listedMessageId,
  getUsersByListingId,
  listingId
}: {
  offerPrice: string;
  setShowOfferModal: React.Dispatch<React.SetStateAction<boolean>>;
  getConversationMessagesById?: any;
  getUsersByListingId?:any;
  listedMessageId?: string | Number;
  listingId?:any
}) => {
  const [newOfferPrice, setNewOfferPrice] = useState(offerPrice);
  const [loading, setLoading] = useState(false);
  const handleClosePopup = () => {
    setShowOfferModal(false);
  };
  let accessToken = localStorage.getItem("accessToken");
  
  const handleSubmit = async () => {
    if (!newOfferPrice) {
      toast.error("Offer Price must be a valid number!");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/api/chat/counter-offer`,
        {
          messageId: listedMessageId,
          offerPrice: newOfferPrice,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Offer submitted successfully!");
      getConversationMessagesById(listedMessageId);
      getUsersByListingId(listingId)
        setShowOfferModal(false); // Close the modal on success
      } else {
        throw new Error(response.data.message || "Failed to submit offer.");
      }
    } catch (error: any) {
      getConversationMessagesById(listedMessageId);
      getUsersByListingId(listingId)

      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
        <div className="p-5">
          <div className="bg-black p-4 rounded-lg relative max-w-[40rem] max-h-[90vh] overflow-auto mt-3">
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
                className="cursor-pointer mb-[12px] max-w-[50%] md:max-w-[100%] lg:max-w-[100%] xl:max-w-[100%]"
              />
            </div>

            <div className="mb-2 p-5">

<h1 className="text-center text-xl font-bold ">
  Counter Offer Price
</h1>
<p className="text-center">

Please enter the counter offer price that you want to offer back to the seller. 


</p>

            </div>

            <div className="xl:flex xl:flex-1 lg:items-center lg:flex lg:flex-1 gap-9">
              <label className="flex flex-col ml-1 font-bold text-lg sm:text-xl lg:w-[50%] gap-2">
                Offer Price
              </label>

              <div className="w-full">
                <input
                  placeholder="$ 0.00"
                  className="w-full text-black"
                  type="text"
                  value={newOfferPrice}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*\.?\d*$/.test(value)) {
                      setNewOfferPrice(value);
                    } else {
                      toast.error("Offer Price should be a number");
                    }
                  }}
                  style={{
                    paddingTop: "9px",
                    paddingBottom: "6px",
                    paddingLeft: "9px",
                    fontSize: "15px",
                  }}
                />
              </div>
            </div>

            <div className="flex justify-center mt-4">
              <Button
                text={"Submit"}
                loading={loading}
                onClick={handleSubmit}
                type={"success"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounterOfferPrice;
