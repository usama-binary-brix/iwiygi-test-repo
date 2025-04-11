"use client";
import isAuth from "@/components/auth/isAuth";
import axios from "axios";
import { Textarea } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useRouter } from 'next/navigation';
import { error } from "console";
import Image from "next/image";


interface messagesProps {
  id: number,
  message: string,
  parent: number,
  isSeller: boolean,
  isBuyer: boolean,
  listing: {
    id: number,
    title: string
  },
  recieverUser: {
    id: number
  },
  invoice: {
    invoiceeEmail: string,
  }
}
function SellerBuyerConversation({ params }: { params: { id: any } }) {

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [showInvoiceModal, setInvoiceModal] = useState(false);
  const [messages, setMessage] = useState<messagesProps[]>([]);
  const [paypalEmail, setPaypalEmail] = useState<string>("");
  const [invoiceeName, setInvoiceeName] = useState<string>("");
  const [itemName, setItemName] = useState<string>("");
  const [listingName, setListingName] = useState<string>("");
  const [itemPrice, setitemPrice] = useState<string>("");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [sendMessage, setSendMessage] = useState<boolean>(true);
  const [count, setCount] = useState(false);
  const [onBoardBtn, setOnBoardBtn] = useState<boolean>(true)
  const [onBoardingLinkPre, setOnBoardingLinkPre] = useState<boolean>(false)
  const messageId = params.id;
  const router = useRouter();

  const handleshowModal = (id: number, title: string) => {
    const listing_name = `Item#${id} ${title}`;
    setListingName(listing_name)
    setItemName(listing_name)
    setInvoiceModal(!showInvoiceModal)
  }
  const handleClosePopup = () => {
    setInvoiceModal(!showInvoiceModal)
  };
  useEffect(() => {
    if (!count) {
      setCount(true)
      getMessagesById(messageId);
    }
  }, [messageId]);

  const hitMessageApi = () => {
    getMessagesById(messageId);
  }
  useEffect(() => {

    intervalRef.current = setInterval(hitMessageApi, 30 * 1000);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  const getMessagesById = async (messageId: any) => {
    let accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      console.error("Access token not found");
      return;
    }
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API}/api/chat/getMessagesConversationSeller/${messageId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    ).then((response) => {
      setMessage(response.data.data)
    }).catch((error) => {
      if (error.response.data.statusCode == 404) {
        toast.error(error.response.data.message);
      }
    });

  };

  const handleBack = () => {
    router.back();
  }

  const handleSendMessage = async () => {

    if (!sendMessage) {
      toast.error('Request Already In process please wait');
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
    setSendMessage(false)
    await fetch(`${process.env.NEXT_PUBLIC_API}/api/chat/sellerBuyerConversation`, {
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
    }).then(response => response.json()).then(response => {
      console.log(response);
      setSendMessage(true)
      if (response.code == 201) {
        if (textAreaRef.current) {
          textAreaRef.current.value = "";
        }
        toast.success(response.message);
        setTimeout(() => {
          getMessagesById(messageId);
        }, 1000);
      } else {
        toast.error(response.message);
      }
    }).catch((error) => {
      console.log(error)
    });
  };

  const handleAlreadyInvoiceCreatedMessage = async () => {
    toast.error('You have already Create Invoice We are now waiting for the payment thanks');
    return false;
  }

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
      await fetch(`${process.env.NEXT_PUBLIC_API}/api/payments/seller-invoice-create`, {
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
          messageId: messages[0]?.id
        }),
      }).then((response) => response.json()).then((response)=>{
        setCount(false);
        if(response.statusCode === 404){
          setOnBoardBtn(false);
          toast.error(response.message);
        }else{
          setCount(false);
          getMessagesById(messageId);
          handleClosePopup()
          toast.success("Invoice Successfully Created and Send to Buyer");
        }
      }).catch((error)=>{
        console.log(error);
        toast.error(error?.message);
      });
  }

  const handleOnBoarding = async () => {
    setOnBoardingLinkPre(true)
    let accessToken = localStorage.getItem("accessToken");
    await fetch(`${process.env.NEXT_PUBLIC_API}/api/payments/seller-stripe-onboarding`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((response) => response.json()).then((response) => {
      window.open(response.data, "_blank");
      setOnBoardingLinkPre(false)
      setOnBoardBtn(true);
    }).catch((error) => {
      toast.error(error.message);
    });
  }

  return (

    <div className="gap-2 md:m-auto md:mx-16" >
      <div className="p-4 text-white md:ml-4">
        <div className=" flex gap-2 justify-end mb-2 float-left">

        </div>

        {/* {loading && <Loader />} */}
<div className="mt-10 h-[70vh] overflow-auto">
  {messageId.length === 0 ? (
    <div>Messages Not Found</div>
  ) : (
    messages.map((item: any, key: number) => (
      <div key={key}>

      {(key == 0 && item.isSeller) && (
        <>
          <div className="flex gap-2 justify-between items-center mb-5">
            <button
              onClick={handleBack}
              className="bg-black   px-4 py-2 "
              style={{ border: '3px solid #07f818', color: 'rgb(7, 248, 24)', fontSize: '16px' }}
            >
              Back
            </button>
            <label className="text-bright-green font-bold  text-2xl md:mr-[1rem]">Me</label>
          </div>
          <div className="flex gap-2 justify-center md:mr-[1rem]">
            <div className="flex flex-col w-full">
              <Textarea
                className="w-full bg-gray-100 p-2 rounded"
                style={{ borderRadius: 0, borderWidth: 0, height: "80px" }}
                value={item?.message}
              />
              <div className="flex gap-2 mt-2 overflow-auto">
                {item.images?.map((data: any, index: any) => (
                  <Image width={100} height={100} src={data?.imageURL || "https://iwiygi-assets.s3.amazonaws.com/not_found_image.png"} alt="Perfume" key={item.id} className="w-[150.5px] h-[140px] cursor-pointer" />
                ))}
              </div>
            </div>
          </div>
        </>
      )}
      {/* ---------------------- buyer with seller conversation ---------------- */}
      {item.isBuyer && (
        <>
          <div className="flex  gap-2 justify-start mb-2">
            <label className="text-bright-green font-bold  text-2xl">Buyer</label>
          </div>
          <div className="flex  gap-2 justify-center">
            <div className="flex flex-col w-full md:mr-[20rem] ">
              <Textarea
                className="w-full bg-gray-100 p-2 rounded"
                style={{ borderRadius: 0, borderWidth: 0, height: "80px" }}
                value={item?.message}
              />
            </div>
          </div>
        </>
      )}

      {(key != 0 && item.isSeller) && (
        <>
          <div className="flex  gap-2 justify-end mb-2 md:mr-[1rem] ">
            <label className="text-bright-green font-bold  text-2xl md:mr-[1rem]">Me</label>
          </div>
          <div className="flex  gap-2 justify-center md:mr-[1rem]">
            <div className="flex flex-col w-full md:ml-[20rem] ">
              <Textarea
                className="w-full bg-gray-100 p-2 rounded"
                style={{ borderRadius: 0, borderWidth: 0, height: "80px" }}
                value={item?.message}
              />
            </div>
          </div>
        </>
      )}
      <hr style={{ height: '4px', border: '2px solid #03F719', margin: '2rem 0rem' }} />
    </div>
    ))
  )}
</div>






   
        {(messages && messages.length > 0) && <><div className="flex  gap-2 justify-start mb-2 mt-2 ">
          <label className="text-bright-green font-bold  text-2xl">Message</label>
        </div>
          <div className="flex  gap-2 justify-center">
            <div className="flex flex-col w-full">
              <Textarea
                // onChange={(e) => setTextMessage(e.target.value)} 
                ref={textAreaRef}
                className="w-full bg-gray-100 p-2 rounded"
                style={{ borderRadius: 0, borderWidth: 0, height: "80px" }}
              />
            </div>
          </div>

          <div className="flex justify-center mt-6 gap-2">
            <button
              onClick={handleSendMessage}
              className="bg-black px-4 py-2 "
              style={{ border: '3px solid #07f818', color: 'rgb(7, 248, 24)', fontSize: '16px', borderRadius: '100%', padding: '1.5rem 4rem' }}
            >
              Send
            </button>
            {messages.length > 0 && (messages[0].invoice != null && messages[0].invoice.invoiceeEmail) ? <>
              <button
                onClick={handleAlreadyInvoiceCreatedMessage}
                className="bg-black px-4 py-2 "
                style={{ border: '3px solid #07f818', color: '#000', fontSize: '16px', backgroundColor: 'rgb(7, 248, 24)', borderRadius: '100%', padding: '1.5rem 2rem' }}
              >
                Invoice Created Waiting For Payment
              </button>
            </> : <>
              {/* <button
                onClick={() => handleshowModal(messages[0]?.listing?.id, messages[0]?.listing?.title)}
                className="bg-black px-4 py-2 "
                style={{ border: '3px solid #07f818', color: '#000', fontSize: '16px', backgroundColor: 'rgb(7, 248, 24)', borderRadius: '100%', padding: '1.5rem 2rem' }}
              >
                Create Invoice
              </button> */}
            </>}
            </div></>}

        {showInvoiceModal && (
          <div style={{ transform: "translate(-50%, -50%)", zIndex: "1", }} className="fixed bg-black top-1/2 left-1/2 border-2 border-bright-green rounded w-[90%] md:w-[550px]">
            <div className="bg-black p-4 rounded-lg relative">

              <button onClick={handleClosePopup} className="absolute top-2 right-2 text-white-600 font-bold">X</button>

              <h2 className="text-md my-5 font-semibold mb-4 text-center">
                <span className="text-black p-2 rounded" style={{ backgroundColor: 'rgb(7, 248, 24)' }}>Invoice For Sale Items</span>
              </h2>

              <h2 className="text-md my-5 font-semibold mb-4 " style={{ color: 'rgb(7, 248, 24)' }}>YOUR ITEM FOR SALE:</h2>

              <div className="flex flex-col md:flex-row mb-4">
                <label className="mr-4 " style={{ color: 'rgb(7, 248, 24)', width: '70%', fontSize: '14px' }}>YOUR STRIPE EMAIL</label>
                <input
                  onChange={(e) => setPaypalEmail(e.target.value)}
                  type="email"
                  placeholder="Email"
                  className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-black"
                />
              </div>

              <div className="flex flex-col md:flex-row mb-4">
                <label className="mr-4 " style={{ color: 'rgb(7, 248, 24)', width: '70%', fontSize: '14px' }}>YOUR NAME</label>
                <input
                  onChange={(e) => setInvoiceeName(e.target.value)}
                  type="text"
                  placeholder="Your Name"
                  className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-black"
                />
              </div>

              <div className="flex flex-col md:flex-row mb-4">
                <label className="mr-4 " style={{ color: 'rgb(7, 248, 24)', width: '70%', fontSize: '14px' }}>ITEM NAME</label>
                <input
                  onChange={(e) => setItemName(e.target.value)}
                  type="text"
                  placeholder="Item Name"
                  value={listingName}
                  className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-black"
                />
              </div>

              <div className="flex flex-col md:flex-row mb-4">
                <label className="mr-4 " style={{ color: 'rgb(7, 248, 24)', width: '70%', fontSize: '14px' }}>ITEM PRICE (including shipping)</label>
                <input
                  onChange={(e) => setitemPrice(e.target.value)}
                  type="number"
                  placeholder="Item Price"
                  className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-black"
                />
              </div>

              <div className="flex justify-center mt-6 gap-2">
                <button onClick={handleSubmitInvoice} className="bg-black px-4 py-2 " style={{ border: '3px solid #07f818', color: 'rgb(7, 248, 24)', fontSize: '16px', borderRadius: '100%', padding: '1.5rem 4rem' }}>
                  Create Invoice
                </button>
                {!onBoardBtn &&
                <button
                  onClick={handleOnBoarding}
                  className="bg-black px-4 py-2 "
                  style={{ border: '3px solid #07f818', color: 'rgb(7, 248, 24)', fontSize: '16px', borderRadius: '100%', padding: '1.5rem 4rem' }}>
                  {onBoardingLinkPre ? 'Loading...' : 'Click to OnBoard'}
                </button>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>

  );
};

export default isAuth(SellerBuyerConversation);
