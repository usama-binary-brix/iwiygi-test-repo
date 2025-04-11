"use client";
import isAuth from "@/components/auth/isAuth";
import axios from "axios";
import { Textarea } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import Loader from "@/components/Loader";
import { useRouter } from "next/navigation";

interface messagesProps {
  id: number;
  message: string;
  parent: number;
  isSeller: boolean;
  isBuyer: boolean;
  listing: {
    id: number;
  };
}
function BuyerSellerConversation({ params }: { params: { id: any } }) {
  const [messages, setMessage] = useState<messagesProps[]>([]);
  const [sendMessage, setSendMessage] = useState<boolean>(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const messageId = params.id;
  const router = useRouter();

  useEffect(() => {
    getMessagesById(params.id);
  }, [messageId]);

  const getMessagesById = async (messageId: any) => {
    setLoading(true);
    let accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      console.error("Access token not found");
      return;
    }
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API}/api/chat/getMessagesConversationBuyer/${messageId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    setLoading(false);
    if (response.status === 200) {
      setMessage(response?.data?.data);
    }
  };

  const handleSendMessage = async () => {
    if (!sendMessage) {
      toast.error("Request Already In process please wait");
      return;
    }
    const textMessage = textAreaRef.current?.value || "";
    if (textMessage === "") {
      toast.error("Please enter a message before submitting.");
      return false;
    }
    const listingId = messages[0]?.listing?.id;
    const parentId = messages[0]?.id;
    let accessToken = localStorage.getItem("accessToken");
    const currentMessage = textMessage;
    setSendMessage(false);
    await fetch(
      `${process.env.NEXT_PUBLIC_API}/api/chat/buyerSellerConversation`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          listingId,
          parentId,
          message: currentMessage,
        }),
      }
    )
      .then((response) => response.json())
      .then((response) => {
        if (response.statusCode == 201) {
          setSendMessage(true);
          if (textAreaRef.current) {
            console.log("arriving...");
            textAreaRef.current.value = "";
          }
          toast.success(response.message);
          setTimeout(() => {
            getMessagesById(messageId);
          }, 1000);
        } else {
          toast.error(response.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const hitMessageApi = () => {
    getMessagesById(messageId);
  };
  useEffect(() => {
    intervalRef.current = setInterval(hitMessageApi, 30 * 1000);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleBack = () => {
    router.back();
  };
  return (
    <div className="h-100 md:mx-[100px]">
      <div className="flex p-4">
        <button
          onClick={handleBack}
          className=" bg-black  absolute px-4 py-2 "
          style={{
            border: "3px solid #07f818",
            color: "rgb(7, 248, 24)",
            fontSize: "16px",
          }}
        >
          Back
        </button>
      </div>
      {loading && <Loader />}
<div className="mt-10 h-[70vh] overflow-auto">
  {messageId.length === 0 ? (
    <div>Messages Not Found</div>
  ) : (
    messages.map((item: any, key: number) => (
      <div key={key}>
        {/* Seller Section for the First Message */}
        {key === 0 && item.isSeller && (
          <div className="flex flex-col md:flex-row gap-4 p-4 text-white mt-[3rem]">
            <div className="h-[254px] w-full">
              <label className="text-bright-green mb-2 font-bold  text-[24px] leading-[32px] relative -top-[5px]">
                Seller
              </label>
              <div className="gap-2 h-[212px]">
                <Textarea
                  className="gap-2 mb-3 bg-[#F9FAFB]"
                  style={{
                    borderRadius: 0,
                    borderWidth: 0,
                    height: "80px",
                  }}
                  value={item?.message}
                />
                <div className="gap-2 flex overflow-auto h-[112px]">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Image
                      key={index}
                      src={
                        item.images[index]?.imageURL ||
                        "https://iwiygi-assets.s3.amazonaws.com/not_found_image.png"
                      }
                      alt={`Image ${index + 1}`}
                      width={112}
                      height={112}
                      className="mb-4 cursor-pointer"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Buyer Section */}
        {item.isBuyer && (
          <div>
            <div className="flex gap-2 justify-start mb-2">
              <label className="text-bright-green font-bold  text-2xl">
                Me
              </label>
            </div>
            <div className="flex gap-2 justify-center">
              <div className="flex flex-col w-full md:mr-[1rem] md:ml-[20rem] mb-3">
                <Textarea
                  className="w-full bg-gray-100 p-2 rounded"
                  style={{
                    borderRadius: 0,
                    borderWidth: 0,
                    height: "80px",
                  }}
                  value={item?.message}
                />
              </div>
            </div>
          </div>
        )}

        {/* Seller Section for Subsequent Messages */}
        {item.isSeller && key !== 0 && (
          <div>
            <div className="flex gap-2 justify-start mb-2">
              <label className="text-bright-green font-bold  text-2xl">
                Seller
              </label>
            </div>
            <div className="flex gap-2 justify-center">
              <div className="flex flex-col w-full md:mr-[20rem] mb-3">
                <Textarea
                  className="w-full bg-gray-100 p-2 rounded"
                  style={{
                    borderRadius: 0,
                    borderWidth: 0,
                    height: "80px",
                  }}
                  value={item?.message}
                />
              </div>
            </div>
          </div>
        )}

        {/* Divider */}
        <hr className="h-[2px] border border-[#03F719] rounded-[10px] opacity-50 mx-4" />
      </div>
    ))
  )}
</div>

      {messages.length > 0 && (
        <div className="grid grid-cols-1 p-5">
          <label className="text-bright-green mb-2 font-bold  text-[24px] leading-[32px]">
            Message
          </label>
          <Textarea
            ref={textAreaRef}
            className="gap-2 mb-3  bg-[#F9FAFB] mt-[24px] w-full"
            style={{ borderRadius: 0, borderWidth: 0, height: "120px" }}
          />
          <div className="flex justify-center md:justify-center">
            <button
              onClick={handleSendMessage}
              className="bg-black px-4 py-2  w-[170px] h-[80px]"
              style={{
                border: "3px solid #07f818",
                color: "rgb(7, 248, 24)",
                fontSize: "16px",
                borderRadius: "100%",
                marginBottom: "20px",
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default isAuth(BuyerSellerConversation);
