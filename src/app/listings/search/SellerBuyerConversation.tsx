"use client";
import isAuth from "@/components/auth/isAuth";
import axios from "axios";
import { Textarea } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import Loader from "@/components/Loader";
import { useRouter } from "next/navigation";
import { IoSendSharp } from "react-icons/io5";

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

interface MsgIdProps {
  idd: number;
  conversationloading: any;
  getConversationMessagesById: any;
  conversationMessages: any;
}
// function BuyerSellerConversation({ params: { id: any } }) {

const SellerBuyerConversation: React.FC<MsgIdProps> = ({
  idd,
  getConversationMessagesById,
  conversationloading,
  conversationMessages,
}) => {
  // const [conversationMessages, setConversationMessage] = useState<messagesProps[]>([]);
  const [sendMessage, setSendMessage] = useState<boolean>(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  //   const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const textAreaRef = useRef<HTMLInputElement>(null);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  // const [conversationloading, setConversationLoading] = useState<boolean>(false);
  const messageId = idd;
  const router = useRouter();

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversationMessages]);

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

    const listingId = conversationMessages[0]?.listing?.id;
    const parentId = conversationMessages[0]?.id;
    let accessToken = localStorage.getItem("accessToken");
    const currentMessage = textMessage;
    setSendMessage(false);
    await fetch(
      `${process.env.NEXT_PUBLIC_API}/api/chat/sellerBuyerConversation`,
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
        setSendMessage(true);
        if (response.code == 201) {
          if (textAreaRef.current) {
            textAreaRef.current.value = "";
          }
          toast.success(response.message);
          setTimeout(() => {
            getConversationMessagesById(messageId);
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
    getConversationMessagesById(messageId);
  };
  useEffect(() => {
    intervalRef.current = setInterval(hitMessageApi, 30 * 1000);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div>
      <div>
        {/* <div className="min-h-[14rem] xl:min-h-[26rem] md:min-h-[17rem] lg:min-h-[20rem] overflow-y-auto pe-3 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-300 scroll-smooth"> */}
        <div className="h-[10rem] xl:h-[23rem] md:h-[23rem] lg:h-[23.5rem] overflow-y-auto pe-3 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-300 scroll-smooth">
          <div className="flex justify-end w-full">
            <div className="flex flex-col justify-end ms-auto ">
              <p className={`mb-0 flex justify-end `}>Me</p>
              <div className={`max-w-xs rounded-lg  text-base`}>
                {conversationMessages[0]?.message}
              </div>

              <div className="flex gap-2 mt-2">
                {Array.from({
                  length: conversationMessages[0]?.images?.length,
                }).map((_, index) => (
                  <Image
                    key={index}
                    src={conversationMessages[0]?.images[index]?.imageURL}
                    alt={`Image ${index + 1}`}
                    width={50}
                    height={50}
                    className="w-[50px] h-[50px] cursor-pointer border-bright-green border rounded"
                  />
                ))}
              </div>
            </div>
          </div>
          {conversationMessages.length === 0 ? (
            <div></div>
          ) : (
            conversationMessages.slice(1).map((item: any, key: number) => {
              const isFirstMessageFromSender =
                key === 0 ||
                conversationMessages[key - 1].isBuyer !== item.isBuyer;

              return (
                <div key={key}>
                  <div>
                    {/* Render 'Me' or 'Seller' only if the sender changes */}
                    {isFirstMessageFromSender && (
                      <p
                        className={`mb-0 flex  ${
                          item.isSeller ? "justify-end" : "justify-start"
                        }`}
                      >
                        {item.isSeller
                          ? "Me"
                          : item?.senderUser?.fullname
                          ? item?.senderUser?.fullname
                          : "Buyer"}
                      </p>
                    )}
                    <div
                      className={`mb-3 flex ${
                        item.isSeller ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs px-2  rounded-lg ${
                          item.isSeller
                            ? "bg-bright-green text-black"
                            : "bg-gray-300 text-black"
                        }`}
                      >
                        <p className="text-base  mb-0">{item?.message}</p>
                        <p
                          className={`flex justify-end text-[10px] text-black`}
                        >
                          {item.isSeller ? "12:38" : "1:00"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {conversationMessages.length > 0 && (
          <>
            {/* <div ref={endOfMessagesRef} /> */}
            <div className="grid grid-cols-1">
              <div className=" flex sticky bottom-0 space-x-2 ">
                <input
                  ref={textAreaRef}
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 p-3 border border-black text-black rounded focus:outline-none focus:ring-black"
                />
                <button
                  onClick={handleSendMessage}
                  className="px-4 py-2 bg-bright-green text-black rounded-lg hover:bg-bright-green"
                >
                  <IoSendSharp />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default isAuth(SellerBuyerConversation);

// ------------------------- This code we can use it for seller to buyer BuyerSellerConversation. save this code due to another condition------

//   {item.isBuyer && (
//     <div>
//       <div className="">
//         <div
//           key={key}
//           className={`mb-4 flex  ${
//             key % 2 === 0 ? "justify-start" : "justify-end"
//           }`}
//         >
//           <div
//             className={`max-w-xs p-3 rounded-lg ${
//               key % 2 === 0
//                 ? "bg-bright-green text-black"
//                 : "bg-gray-300 text-black"
//             }`}
//           >
//             {item?.message}
//           </div>
//         </div>
//       </div>
//     </div>
//   )}

//   {item.isSeller && key !== 0 && (
//     <div>
//       <div className="">
//         <div
//           key={key}
//           className={`mb-4 flex ${
//             key % 2 === 0 ? "justify-start" : "justify-end"
//           }`}
//         >
//           <div
//             className={`max-w-xs p-3 rounded-lg ${
//               key % 2 === 0
//                 ? "bg-bright-green text-black"
//                 : "bg-gray-300 text-black"
//             }`}
//           >
//             {item?.message}
//           </div>
//         </div>
//       </div>
//     </div>
//   )}
