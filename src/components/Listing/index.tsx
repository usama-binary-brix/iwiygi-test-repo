import { FC, useState, ChangeEvent, useEffect } from "react";
import TextArea from "@/components/Form/TextArea";
import TextInput from "@/components/Form/TextInput";
import imagesold from "../../../public/images/sold.png";
import Image from "next/image";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";
import Lightbox from "react-image-lightbox";
import Button from "../button/Button";
import MegaListView from "../generic/MegaListView";
import Share from "../Share";
import {
  useFetchAllListingsQuery,
  useGetSavedListingsQuery,
} from "@/store/api";
import { removeSavedListing } from "@/store/Slices/listingsSlice";
import { useDispatch } from "react-redux";


interface LightboxData {
  imageURL: string;
}
export interface ListingAdminItem {
  featuredImage: string;
  title: string;
  description: string;
  listingPostedBy: {
    id: string;
    username:string;
  };
}

export interface ListingItem {
  id: string;
  title: string;
  description: string;
  featuredImage: string;
  slug?:string;
  isSaved: boolean;
  price: string;
  message?: string;
  category: string;
  listingPostedBy: {
    id: string;
    username:string
  };
  
}
export interface ListingProps extends ListingItem {
  id: string;
  index: number;
  refreshListing: () => void;
}

const Listing: FC<ListingProps> = ({
  id,
  title,
  description,
  featuredImage,
  isSaved,
  index,
  slug,
  refreshListing,
  listingPostedBy,
 
}) => {
console.log(listingPostedBy)
  var admin: any;
  const admin1 = localStorage.getItem("User");
  if (admin1) {
    admin = JSON.parse(admin1);
  }

  const router = useRouter();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxData, setLightboxData] = useState<LightboxData>({
    imageURL: "",
  });
  const [message, setMessage] = useState<string>("");
  const [selectedImage1, setSelectedImage1] = useState("");
  const [listingId, setListingId] = useState<any>("");
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [showPayPalPopup, setShowPayPalPopup] = useState<boolean>(false);

  const [invoiceFields, setInvoiceFields] = useState({
    invoiceeEmail: "",
    invoiceeName: "",
    streetAddress: "",
    city: "",
    adminAreaTwo: "california",
    postalCode: "",
    itemPrice: "",
    itemName: "",
  });

const dispatch = useDispatch()

 

  const handleInvoiceFieldChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInvoiceFields((prevFields) => ({
      ...prevFields,
      [name]: value,
    }));
  };
  const handleClosePopup = () => {
    setShowPayPalPopup(false);
    setShowPopup(false);
  };

  const handleRemoveListing = async () => {
    try {
      let accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        toast.error(
          "Please log in or sign up to save this item to your profile."
        );
        return;
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/api/listings/removeListing`,
        {
          listingId: id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 200) {
        refreshListing();
        dispatch(removeSavedListing(id))

        toast.success(response?.data?.message);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    }
  };
  const handleMessageChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };
  const handleCreateInvoice = async () => {
    try {
      let accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        console.error("Access token not found");
        return;
      }
      const formData = new FormData();
      Object.entries(invoiceFields).forEach(([key, value]) => {
        formData.append(key, value);
      });
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/api/payments/CreateAndSendInvoice`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.status === 201) {
        toast.success("Invoice Sent to Email successfully");
        setShowPayPalPopup(false);
        // setListingData(response?.data?.data);
      }
    } catch (error) {
      console.error("Error fetching listing data:", error);
      setError(
        "An error occurred while fetching the listing data. Please try again later."
      );
    }
  };
  const onImageChange = (e: any) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage1(URL.createObjectURL(e.target.files[0]));
    }
  };
  const handleBindApi = async () => {
    try {
      let accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        toast.error("You don't have permission");
        return;
      }
      const user = JSON.parse(localStorage.getItem("User") || "");
      const listings = JSON.parse(localStorage.getItem("data") || "");
      const selectedListing = listings.find(
        (listing: any) => listing.id === listingId
      );
      const formData = new FormData();
      formData.append("senderUsername", user?.username);
      formData.append(
        "recieverUsername",
        selectedListing?.listingPostedBy?.username
      );
      formData.append("recieverEmail", selectedListing?.listingPostedBy?.email);
      // formData.append(
      //   "listingInformation",
      //   listingData?.id + " " + listingData?.category
      // );
      formData.append("message", message);
      formData.append("attachments", selectedImage1);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/api/mailer/sendBlindEmail`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success("Email Sent Successfully!");
        setShowPopup(false);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    }
  };
  const handlePayPalButtonClick = () => {
    setShowPayPalPopup(true);
  };
  const handleSignIn = () => {
    router.push("/sign-in");
  };
  const [showloginPopUp, setShowloginPopUp] = useState<boolean>(false);
  const handleGotitPopup = (id: any, listingPostedBy: any) => {
    let accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      setShowloginPopUp(true);
      return;
    }
    if (admin && listingPostedBy?.id == admin?.id) {
      toast.error(
        "You're the owner of this listing and already searching for this item."
      );
      return;
    }
    router.push(`/listings/got-it/${id}`);
  };
  const openLightbox = (attachmentFile: string | undefined) => {
    if (attachmentFile) {
      // For image files, open in the Lightbox
      setLightboxData({ imageURL: attachmentFile });
      setLightboxOpen(true);
    }
  };

  const handleViewList = () => {
    router.push(`/listings/${slug}`);
  };

console.log(listingPostedBy, 'posted')

  return (
    <>
      <div>
        <div className="container-fluid mx-auto antialiased">
          <div>
            <div className="bg-[#212121] mx-auto border-bright-green border rounded-sm text-gray-700 mb-0.5 h-30  w-full md:w-[75%] lg:w-full">
              <div className="flex lg:flex-row items-center p-3 md:border-l-8 border-bright-green cursor-pointer overflow-x-auto max-w-full">
                {/* Image Section */}
                <div
                  onClick={handleViewList}
                  className="space-y-1 lg:border-r lg:pr-3 flex-shrink-0"
                >
                  <Image
                    height={100}
                    width={100}
                    src={
                      featuredImage ||
                      "https://iwiygi-assets.s3.amazonaws.com/not_found_image.png"
                    }
                    alt="No Image"
                    className="w-[120px] h-[120px] object-cover rounded-md"
                    onClick={() => openLightbox(featuredImage)}
                  />
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

                {/* Listing Details */}
                <div
                   onClick={handleViewList}
                  className="flex-1 min-w-[250px]"
                >
                  <div className="ml-3 space-y-1">
                    <div className="leading-6 font-normal capitalize text-bright-green">
                      <span className="text-bright-green">Listing # </span> {id}
                    </div>
                    
                    <div className="leading-6 font-normal capitalize">
                      <span className="text-bright-green">Listing Posted By :</span> {listingPostedBy?.username}
                    </div>
                    
                    <div className="leading-6 font-normal capitalize text-white text-xs lg:text-xl whitespace-nowrap">
                      {title}
                    </div>
                    <div className="text-xs lg:text-sm leading-4 capitalize text-white font-[200] truncate">
                      {description.length > 70
                        ? `${description.slice(0, 70)}...`
                        : description}
                    </div>
                  </div>
                </div>

                <div className="lg:border-r px-3 flex-shrink-0">
                  <Share />
                </div>

                <div
                  className="lg:ml-3 p-1 flex-shrink-0 lg:w-60"
                  onClick={(event) => event.stopPropagation()}
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Button
                      text=" I’ve Got it !"
                      type={"success"}
                      className="w-full"
                      onClick={() => handleGotitPopup(id, listingPostedBy)}
                    />

                    <button
                      onClick={handleRemoveListing}
                      className="bg-white text-black hover:bg-gray-400 font-bold px-1 py-3 rounded-lg text-xs lg:text-sm w-full text-center"
                    >
                      Remove from saved Listing
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showPopup && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg relative cursor-pointer">
            <button
              className="absolute top-2 right-2 text-black font-bold"
              onClick={handleClosePopup}
            >
              X
            </button>
            <div className="flex flex-col items-center bg-black w-fit h-fit rounded-[50%] px-[20px] py-[14px]">
              <div className=" font-bold text-bright-green">
                I&apos;ve Got It !
                <Image
                  src="/images/underline.png"
                  alt="underline"
                  width={100}
                  height={40}
                />
              </div>
            </div>
            {!admin ? (
              <div
                className="text-red-500 font-bold text-2xl"
                onClick={handleSignIn}
              >
                Please Login In Or Sign Up{" "}
              </div>
            ) : (
              <>
                <hr className="border-green-800 mt-2 border-2 w-full" />
                <label
                  htmlFor="customTextArea"
                  className="text-bright-green font-normal"
                >
                  Message
                </label>
                <textarea
                  className="w-full text-black min-h-40"
                  value={message}
                  onChange={handleMessageChange}
                  style={{
                    minHeight: "4rem",
                    padding: 0,
                    paddingTop: "2px",
                    paddingBottom: "2px",
                    fontSize: "16px",
                    fontWeight: "600",
                    fontStyle: "",
                  }}
                ></textarea>
                <div className="flex font-bold flex-row items-center justify-center text-blue-700">
                  <span className="dot"></span> Be sure your agreed purchase
                  price including shipping <span className="dot"></span>
                </div>
                <div className="mt-2 mb-2 flex flex-row items-center justify-around">
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={onImageChange}
                    className="hidden"
                  />
                  <div className="relative w-40 h-40 border-2 border-green-300 overflow-hidden">
                    {selectedImage1 ? (
                      <Image
                        src={selectedImage1}
                        alt="selected-image"
                        width={160}
                        height={160}
                      />
                    ) : (
                      <label
                        htmlFor="image-upload"
                        className="absolute inset-0 cursor-pointer flex flex-col items-center justify-center"
                      >
                        <span className="text-black  text-[12px] font-bold">
                          Attach Optional Photo
                        </span>
                      </label>
                    )}
                  </div>
                  <div className="flex flex-col items-center bg-black w-fit h-fit rounded-[50%] px-[20px] py-[14px]">
                    <button
                      className=" font-bold text-bright-green"
                      onClick={handleBindApi}
                    >
                      Send Message
                    </button>
                  </div>
                </div>
                <hr className="border-green-800 mt-2 mb-2 border-2 w-full" />
                <div className="flex flex-row text-black items-center justify-center text-center">
                  <Image alt="imagr" src={imagesold} />
                  <div className="flex flex-col">
                    <div className="font-bold">Create Invoice Now</div>
                    <button
                      onClick={handlePayPalButtonClick}
                      className="p-2 bg-amber-400  font-bold"
                    >
                      <span className="text-sky-950">Pay</span>
                      <span className="text-cyan-500">Pal</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {showPayPalPopup && (
        <div className="fixed overflow-auto inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg relative">
            <button
              className="absolute top-2 right-2 text-black font-bold"
              onClick={handleClosePopup}
            >
              X
            </button>
            <div className="flex flex-1 flex-col gap-4">
              <div className="flex font-bold flex-row items-center justify-center text-blue-700">
                <span className="dot"></span> Be sure your agreed purchase price
                including shipping <span className="dot"></span>
              </div>
              <TextInput
                label={"Invoicee Email"}
                name="invoiceeEmail"
                onChange={handleInvoiceFieldChange}
                containerClassName="gap-0"
                labelClassName="text-[16px] text-bright-green font-normal"
                style={{
                  padding: 0,
                  paddingTop: "2px",
                  paddingBottom: "2px",
                  fontWeight: "bold",
                  fontStyle: "",
                  borderRadius: "4px",
                  border: "1.5px solid",
                }}
              />

              <TextInput
                label={"Invoicee Name"}
                containerClassName="gap-0"
                labelClassName="text-[16px] text-bright-green font-normal"
                name="invoiceeName"
                onChange={handleInvoiceFieldChange}
                style={{
                  padding: 0,
                  paddingTop: "2px",
                  paddingBottom: "2px",
                  // fontSize: "24px",
                  fontWeight: "bold",
                  fontStyle: "",
                  borderRadius: "4px",
                  border: "1.5px solid",
                }}
              />
              <TextInput
                label={"Street Address"}
                containerClassName="gap-0"
                labelClassName="text-[16px] text-bright-green font-normal"
                name="streetAddress"
                onChange={handleInvoiceFieldChange}
                style={{
                  padding: 0,
                  paddingTop: "2px",
                  paddingBottom: "2px",
                  // fontSize: "24px",
                  fontWeight: "bold",
                  fontStyle: "",
                  borderRadius: "4px",
                  border: "1.5px solid",
                }}
              />
              <TextInput
                label={"City"}
                containerClassName="gap-0"
                labelClassName="text-[16px] text-bright-green font-normal"
                name="city"
                onChange={handleInvoiceFieldChange}
                style={{
                  padding: 0,
                  paddingTop: "2px",
                  paddingBottom: "2px",
                  fontWeight: "bold",
                  fontStyle: "",
                  borderRadius: "4px",
                  border: "1.5px solid",
                }}
              />
              <TextInput
                label={"State/Area"}
                containerClassName="gap-0"
                labelClassName="text-[16px] text-bright-green font-normal"
                name="adminAreaTwo"
                onChange={handleInvoiceFieldChange}
                style={{
                  padding: 0,
                  paddingTop: "2px",
                  paddingBottom: "2px",
                  fontWeight: "bold",
                  fontStyle: "",
                  borderRadius: "4px",
                  border: "1.5px solid",
                }}
              />
              <TextInput
                label={"Postal Code"}
                containerClassName="gap-0"
                labelClassName="text-[16px] text-bright-green font-normal"
                name="postalCode"
                onChange={handleInvoiceFieldChange}
                style={{
                  padding: 0,
                  paddingTop: "2px",
                  paddingBottom: "2px",
                  // fontSize: "24px",
                  fontWeight: "bold",
                  fontStyle: "",
                  borderRadius: "4px",
                  border: "1.5px solid",
                }}
              />
              <TextInput
                label={"Item Price"}
                containerClassName="gap-0"
                labelClassName="text-[16px] text-bright-green font-normal"
                name="itemPrice"
                onChange={handleInvoiceFieldChange}
                style={{
                  padding: 0,
                  paddingTop: "2px",
                  paddingBottom: "2px",
                  // fontSize: "24px",
                  fontWeight: "bold",
                  fontStyle: "",
                  borderRadius: "4px",
                  border: "1.5px solid",
                }}
              />
              <TextInput
                label={"Item Name"}
                containerClassName="gap-0"
                labelClassName="text-[16px] text-bright-green font-normal"
                name="itemName"
                onChange={handleInvoiceFieldChange}
                style={{
                  padding: 0,
                  paddingTop: "2px",
                  paddingBottom: "2px",
                  // fontSize: "24px",
                  fontWeight: "bold",
                  fontStyle: "",
                  borderRadius: "4px",
                  border: "1.5px solid",
                }}
              />
            </div>
            <div
              onClick={handleCreateInvoice}
              className="flex mt-4 flex-col items-center bg-bright-green h-fit rounded-[50%] px-[10px] py-[14px]"
            >
              <button className=" font-bold text-black">Create Invoice</button>
            </div>
          </div>
        </div>
      )}
      {showloginPopUp && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg relative cursor-pointer">
            <button
              className="absolute top-2 right-2 text-black font-bold"
              onClick={handleClosePopup}
            >
              X
            </button>
            <div
              className="flex flex-col items-center bg-black w-fit h-fit rounded-[50%] px-[20px] py-[14px]"
              style={{ marginLeft: "4rem", marginBottom: "1rem" }}
            >
              <div className=" font-bold text-bright-green">
                I&apos;ve Got It !
                <Image
                  src="/images/underline.png"
                  alt="underline"
                  width={100}
                  height={40}
                />
              </div>
            </div>
            <div
              className="text-bright-green font-bold text-2xl"
              onClick={handleSignIn}
            >
              Please Login In Or Sign Up{" "}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Listing;
