"use client";
import isAuth from "@/components/auth/isAuth";
import axios from "axios";
import { Textarea } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import Loader from "@/components/Loader";
import { useRouter } from "next/navigation";
import { IoPersonCircleOutline, IoSendSharp } from "react-icons/io5";
import Lightbox from "react-image-lightbox";
import { FaEdit } from "react-icons/fa";

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

const SellerWithBuyerConversation: React.FC<MsgIdProps> = ({
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

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxData, setLightboxData] = useState({
    imageURL: "",
  });
  useEffect(() => {
    // Scroll to the last message whenever the conversationMessages change
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversationMessages]); // Trigger this whenever the messages update

  const openLightbox = (attachmentFile: string | undefined) => {
    if (attachmentFile) {
      setLightboxData({ imageURL: attachmentFile });
      setLightboxOpen(true);
    }
  };

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversationMessages]);

  const handleSendMessage = async () => {
    // if (!sendMessage) {
    //   toast.error("Request Already In process please wait");
    //   return;
    // }
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
    const intervalId = setInterval(hitMessageApi, 5000);

    return () => clearInterval(intervalId);
  }, [messageId]);

  const [offerPrice, setOfferPrice] = useState(
    conversationMessages[0]?.offerPrice || ""
  );

  useEffect(() => {
    setOfferPrice(conversationMessages[0]?.offerPrice || "");
  }, [conversationMessages]);

  const updateOfferPrice = (offerPrice: any) => {
    console.log(offerPrice, "offer price in function");
  };

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setOfferPrice(conversationMessages[0]?.offerPrice || "");
  }, [conversationMessages]);

  const handleSave = () => {
    handleSendMessage();
    updateOfferPrice(offerPrice);
    setIsEditing(false); 
  };

  return (
    <div>
      <div className="mt-3">
        <div className="max-h-[22rem] md:max-h-[23rem] lg:max-h-[23rem] xl:max-h-[27rem] overflow-y-auto pe-3 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-300 scroll-smooth">
          <div className="flex justify-end w-full">
            <div className="flex flex-col justify-end ms-auto ">
              {conversationMessages.length > 0 && (
                <div className="flex items-start gap-1 mt-5">
                  <IoPersonCircleOutline className="text-[2rem]" />

                  <div className="flex flex-col">
                    <div className="flex flex-col w-full max-w-[200px] lg:max-w-[400px] leading-1.5 px-4 py-2 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700">
                      <div className="flex items-start flex-col lg:flex-row justify-between lg:space-x-2 rtl:space-x-reverse">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {conversationMessages[0]?.senderUser?.username
                            ? conversationMessages[0]?.senderUser?.username
                            : "Seller"}
                        </span>
                        <div className="">
                      <div className="flex items-center justify-between mb-2 gap-2">
                          <span className="text-black text-xs font-bold">
                            Offer Price:
                          </span>
                          <p
                            className={`text-[0.6rem] font-semibold capitalize text-black bg-bright-green px-3 py-1 rounded-full shadow-md            `}
                          >
                            ${conversationMessages[0]?.offerPrice}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-black text-xs font-bold">
                            Shipping Charges:
                          </span>
                          <p
                            className={`text-[0.6rem] font-semibold capitalize text-black bg-bright-green px-3 py-1 rounded-full shadow-md            `}
                          >
                            ${conversationMessages[0]?.shippingPrice ? conversationMessages[0]?.shippingPrice : '0.00'}
                          </p>
                        </div>
                      </div>

                      </div>

                      <p className="text-sm font-normal text-gray-900 break-words dark:text-white">
                        {conversationMessages[0]?.message}
                      </p>
                      <div className="">
                        <div className="group relative flex flex-wrap gap-2">
                          {Array.from({
                            length: conversationMessages[0]?.images?.length,
                          }).map((_, index) => (
                            <Image
                              onClick={() =>
                                openLightbox(
                                  conversationMessages[0]?.images[index]
                                    ?.imageURL
                                )
                              }
                              key={index}
                              src={
                                conversationMessages[0]?.images[index]?.imageURL
                              }
                              alt={`Image ${index + 1}`}
                              width={50}
                              height={50}
                              className="w-[50px] h-[50px] cursor-pointer rounded"
                            />
                          ))}
                          {lightboxOpen && (
                            <Lightbox
                              mainSrc={lightboxData.imageURL}
                              onCloseRequest={() => setLightboxOpen(false)}
                              imageCaption="Attachment"
                              enableZoom={true}
                              imagePadding={50}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          {conversationMessages.length === 0 ? (
            <div></div>
          ) : (
            conversationMessages?.slice(1).map((item: any, key: number) => {
              const isFirstMessageFromSender =
                key === 0 ||
                conversationMessages[key - 1].isBuyer !== item.isBuyer;

              return (
                <div key={key}>
                  <div className="mt-4">
                    <div
                      className={`mb-3 flex ${
                        item.isBuyer ? "justify-start" : "justify-end"
                      }`}
                    >
                      <div
                        className={`max-w-xs px-2  rounded-lg ${
                          item.isBuyer ? "" : ""
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          {/* <img className="w-8 h-8 rounded-full" src="/docs/images/people/profile-picture-3.jpg" alt="Jese image"> */}
                          <IoPersonCircleOutline className="text-[2rem]" />
                          <div className="flex flex-col w-full max-w-[200px] lg:max-w-[400px] leading-1.5 px-4 py-2 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700">
                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                {item.isBuyer ? (
                                  <>
                                    {conversationMessages[0]?.recieverUser
                                      ?.username
                                      ? `${conversationMessages[0]?.recieverUser?.username
                                          .substring(0, 3)
                                          .toLowerCase()}***`
                                      : "Unknown User"}
                                  </>
                                ) : (
                                  <>
                                    {
                                      conversationMessages[0]?.senderUser
                                        ?.username
                                    }
                                  </>
                                )}
                              </span>
                              <span className="text-[13px] font-normal text-gray-500 dark:text-gray-400">
                                {item.isBuyer
                                  ? new Date(
                                      new Date(item.createdAt).setHours(
                                        new Date(item.createdAt).getHours()
                                      )
                                    ).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })
                                  : new Date(
                                      new Date(item.createdAt).setHours(
                                        new Date(item.createdAt).getHours()
                                      )
                                    ).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                              </span>
                            </div>
                            <p className="text-sm font-normal py-2.5 text-gray-900 dark:text-white break-words">
                              {item?.message}
                            </p>
                            {/* {item.isSeller && (
                              <span className="text-[10px] text-gray-500 dark:text-gray-400">
                                Delivered
                              </span>
                            )} */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      {conversationMessages.length > 0 && (
        <>
          <div className=" absolute bottom-5 w-full pe-8">
            {/* <div className="flex justify-end items-end mb-1">
              <div className="w-full md:w-[fit-content] bg-[#212121] rounded-lg flex items-center space-x-2">
                {!isEditing ? (
                  <div className="flex items-center space-x-2">
                    <p className="text-white">
                      <span className="text-bright-green">Offer Price : </span>
                      $ {offerPrice}
                    </p>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-gray-400 hover:text-white"
                    >
                      <FaEdit className="text-bright-green" />
                    </button>
                  </div>
                ) : (
                  <div className="flex w-full space-x-2">
                    <input
                      type="text"
                      value={offerPrice}
                      placeholder="Type a message..."
                      className="flex-1 p-2 border border-black text-black rounded focus:outline-none focus:ring-black"
                      onChange={(e) => setOfferPrice(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSave();
                        }
                      }}
                    />
                  
                  </div>
                )}
              </div>
            </div> */}
            <div className="grid grid-cols-1 ">
              <div className=" flex space-x-2 ">
                <input
                  ref={textAreaRef}
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 p-3 border border-black text-black rounded focus:outline-none focus:ring-black"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (sendMessage) {
                        handleSendMessage();
                      }
                    }
                  }}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!sendMessage}
                  className="px-4 py-2 bg-bright-green text-black rounded-lg hover:bg-bright-green"
                >
                  <IoSendSharp />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default isAuth(SellerWithBuyerConversation);
