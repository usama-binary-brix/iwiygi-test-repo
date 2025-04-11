"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import SellerBuyerConversation from "./SellerBuyerConversation";
import { toast } from "sonner";
import axios from "axios";
import MiniListView from "@/components/generic/MiniListView";

interface messagesProps {
  id: number;
  message: string;
  parent: number;
  isSeller: boolean;
  isBuyer: boolean;
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
  invoice?: {
    streetAddress?: string | null;
    invoiceUrl?: string | null;
    invoiceeEmail?: string; // Added missing property
    invoiceeName?: string; // Added missing property
    invoiceePrice?: string; // Added missing property
  } | null;
}

interface ChatBoxProps {
  messages: Message[];
  handAlreadyCreated: any;
  handleshowModal: (
    id: number,
    title: string,
    messageId: number,
    buyerId: number
  ) => void;
}

type Message = {
  id: string;
};

type User = {
  id: string;
};

const SellerChatBox: React.FC<ChatBoxProps> = ({
  messages,
  handleshowModal,
  handAlreadyCreated,
}) => {
  const [showChat, setShowChat] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeUser, setActiveUser] = useState<User | null>(null);
  const [msgId, setMsgId] = useState<string | null>();
  const [conversationMessages, setConversationMessage] = useState<
    messagesProps[]
  >([]);

  const getConversationMessagesById = async (messageId: any) => {
    let accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      console.error("Access token not found");
      return;
    }
    const response = await axios
      .get(
        `${process.env.NEXT_PUBLIC_API}/api/chat/getMessagesConversationSeller/${messageId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((response) => {
        setConversationMessage(response.data.data);
      })
      .catch((error) => {
        if (error.response.data.statusCode == 404) {
          toast.error(error.response.data.message);
        }
      });
  };

  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);
      if (!isMobileView && messages.length > 0) {
        // setActiveUser(message[0]);
        // setMsgId(message[0]?.id);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [messages]);
  const handleUserClick = (user: any) => {
   
    getConversationMessagesById(user);
   
    setActiveUser(user);
    // getMessagesById(user);
    setMsgId(user);
    if (isMobile) {
      setShowChat(true);
    }
  };
  return (
    <>
      <div>
        <div className="flex h-[100vh] md:h-[90vh] border border-dark-green">
          <div
            className={`${
              showChat && isMobile ? "hidden" : "w-full md:w-1/4"
            } bg-black border text-white border-gray-950 overflow-y-auto p-4`}
          >
            <h3 className="text-lg font-bold mb-4">Buyers List</h3>
            <ul className="space-y-2">
              {messages.map((user: any, index: any) => (
                <li
                  key={user.id}
                  onClick={() => handleUserClick(user.id)}
                  className={`p-2 rounded cursor-pointer ${
                    activeUser == user.id
                      ? "bg-bright-green text-black"
                      : "hover:bg-bright-green hover:text-black"
                  }`}
                >
                  {user.recevierUser?.fullname
                    ? user.recevierUser?.fullname
                    : "Buyer***"}
                  {/* <hr
                      style={{
                        marginTop: "10px",
                        height: "1px",
                        border: "1px solid #03F719",
                      }}
                    ></hr> */}
                </li>
              ))}
            </ul>
          </div>

          <div
            className={`${
              showChat || !isMobile ? "w-full md:w-3/4" : "hidden"
            } flex flex-col p-2`}
          >
            {activeUser ? (
              <>
                <div className="">
                  <button
                    className="mb-4 text-bright-green md:hidden"
                    onClick={() => setShowChat(false)}
                  >
                    <IoArrowBackCircleOutline className="text-[2rem]" />
                  </button>
                  <div className="bg-black">
                    {conversationMessages.length > 0 && (
                      <div className="gap-2">
                        <div className="flex flex-col md:flex-row gap-4 items-start justify-between text-white p-3 w-full">
                          <div className="flex flex-col md:flex-row gap-4 items-center text-white p-3 w-full">
                            {/* <div className="flex flex-col w-full">
                              <div
                                className={`max-w-xs rounded-lg  text-base`}
                              >
                                {conversationMessages[0].message}
                              </div>

                              <div className="flex gap-2 mt-2">
                                {Array.from({
                                  length: conversationMessages[0].images.length,
                                }).map((_, index) => (
                                  <Image
                                    key={index}
                                    src={
                                      conversationMessages[0].images[index]
                                        ?.imageURL
                                    }
                                    alt={`Image ${index + 1}`}
                                    width={50}
                                    height={50}
                                    className="w-[50px] h-[50px] cursor-pointer border-bright-green border rounded"
                                  />
                                ))}
                              </div>
                            </div> */}
                            {/* <div className="flex gap-2 w-full ">
                              <div className="flex justify-center md:border-r pr-3 border-gray-200 flex-col items-center">
                                <Image
                                  src={
                                    conversationMessages[0]?.listing
                                      ?.featuredImage
                                  }
                                  alt={`Image`}
                                  width={60}
                                  height={60}
                                  className="w-[60px] h-[60px] cursor-pointer border-bright-green border rounded"
                                />
                                <div className="w-full">
                                  <div>
                                    <div className=" my-3  bg-gray-300 p-1">
                                      <div className="text-center text-sm leading-4 font-semibold text-gray-800">
                                        {conversationMessages[0]?.id}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <p>{conversationMessages[0]?.listing?.title}</p>
                                <p>
                                  {
                                    conversationMessages[0]?.listing
                                      ?.description
                                  }
                                </p>
                              </div>
                            </div> */}
                            <MiniListView
                              img={
                                conversationMessages[0]?.listing?.featuredImage
                              }
                              title={conversationMessages[0]?.listing?.title}
                              id={conversationMessages[0]?.id}
                              description={
                                conversationMessages[0]?.listing?.description
                              }
                            />

                            <div className="flex flex-col gap-3 justify-center">
                              {conversationMessages[0]?.invoice
                                ?.invoiceeEmail == "" &&
                              conversationMessages[0]?.invoice?.invoiceeName ==
                                "" &&
                              conversationMessages[0]?.invoice?.invoiceePrice ==
                                "" ? (
                                <button
                                  onClick={handAlreadyCreated}
                                  className="bg-bright-green text-black rounded-lg px-4 py-2 uppercase font-bold text-base  w-[fit-content]"
                                >
                                  Invoice ALready Created
                                </button>
                              ) : (
                                <button
                                  onClick={() =>
                                    handleshowModal(
                                      conversationMessages[0]?.listing.id,
                                      conversationMessages[0]?.listing.title,
                                      conversationMessages[0]?.id,
                                      conversationMessages[0]?.recieverUser
                                        ?.id ?? 0
                                    )
                                  }
                                  className="bg-bright-green text-black rounded-lg px-4 py-2 uppercase font-bold text-base  w-[fit-content]"
                                >
                                  Create Invoice
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <hr
                      style={{ height: "1px", border: "1px solid #03F719" }}
                    ></hr>
                  </div>
                </div>

                <div className="flex-1  border rounded p-4 bg-black border-black ">
                  <SellerBuyerConversation
                    idd={msgId}
                    // conversationloading={conversationloading}
                    getConversationMessagesById={getConversationMessagesById}
                    conversationMessages={conversationMessages}
                  />
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                Please Select a Buyer conversation to see the Buyers Respond!
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SellerChatBox;
