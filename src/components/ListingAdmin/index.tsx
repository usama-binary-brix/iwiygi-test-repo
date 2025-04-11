import Image from "next/image";
import { FC, useState, ChangeEvent, useEffect } from "react";
import TextInput from "@/components/Form/TextInput";
import TextArea from "@/components/Form/TextArea";
import axios, { AxiosError } from "axios";
import Share from "@/components/Share";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Lightbox from "react-image-lightbox";
import MegaListView from "../generic/MegaListView";
import ConfirmationModal from "../generic/ConfirmationModal";
import UserProfile from "../generic/UserProfile";
import BackStep from "../backStep/BackStep";
import Link from "next/link";
import Button from "../button/Button";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { addSavedListing, removeSavedListing } from "@/store/Slices/listingsSlice";

export interface ListingAdminItem {
  featuredImage: string;
  title: string;
  description: string;
  listingPostedBy: {
    id: string;
    fullname: string;
    username: string;
    email: string;
  };
}

export interface ListingItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  featuredImage: string;
  isSaved: boolean;
  price: string;
  message?: string;
  category: string;
  listingPostedBy: {
    id: string;
    username:string;
  };
}
export interface ListingAdminProps extends ListingAdminItem {
  id: string;
  index: number;
  isEditable: boolean;
  slug: string;
  isApprovedByAdmin?: boolean;
  isSaved?: boolean;
}

interface ErrorResponse {
  message: string;
}
interface LightboxData {
  imageURL: string;
}
const ListingAdmin: FC<ListingAdminProps> = ({
  id,
  title,
  slug,
  description,
  featuredImage,
  listingPostedBy,
  index,
  isEditable = false,
  isApprovedByAdmin,
  isSaved,
}) => {
  var admin: any;
  const admin1 = localStorage.getItem("User");
  if (admin1) {
    admin = JSON.parse(admin1);
  }

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxData, setLightboxData] = useState<LightboxData>({
    imageURL: "",
  });
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedImage1, setSelectedImage1] = useState("");
  const [showEditPopup, setShowEditPopup] = useState<boolean>(false);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [showPayPalPopup, setShowPayPalPopup] = useState<boolean>(false);
  const [listingId, setListingId] = useState<any>("");
  const [showloginPopUp, setShowloginPopUp] = useState<boolean>(false);
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteAction, setDeleteAction] = useState<() => void>(() => () => {});
  const [deleteMessage, setDeleteMessage] = useState<string>("");
  const [modalLoading, setModalLoading] = useState(false);
  const [listingData, setListingData] = useState<ListingItem>({
    title: "",
    description: "",
    featuredImage: "",
    category: "",
    slug: "",
    isSaved: false,
    price: "234",
    id: "",
    listingPostedBy: {
      id: "",
      username:""
    },
  });

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



  const dispatch = useDispatch();
// const savedListings = useSelector(
//   (state: RootState) => (state.savedListing?.savedListings);

  const savedListing = useSelector((state:RootState)=>state.savedListing.savedListings)



const handleSaveListing = async () => {
  try {
    let accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      setShowloginPopUp(true);
      return;
    }

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API}/api/listings/saveListing`,
      { listingId: id },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.status === 200) {
      dispatch(addSavedListing({ listingId: id })); // ✅ Redux Store Update
      toast.success(response?.data?.message);
    }
  } catch (error: any) {
    toast.error(error?.response?.data?.message);
  }
};

  // const handleSaveListing = async () => {
  //   try {
  //     let accessToken = localStorage.getItem("accessToken");
  //     if (!accessToken) {
  //       setShowloginPopUp(true);
  //       return;
  //     }
  //     if (admin && listingPostedBy.id == admin.id) {
  //       toast.error(
  //         "You're the owner of this listing and already searching for this item."
  //       );
  //       return;
  //     }
  //     const response = await axios.post(
  //       `${process.env.NEXT_PUBLIC_API}/api/listings/saveListing`,
  //       {
  //         listingId: id,
  //       },
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${accessToken}`,
  //         },
  //       }
  //     );

  //     if (response.status === 200) {
  //       // window.location.reload();

  //       toast.success(response?.data?.message);
  //     }
  //   } catch (error: any) {
  //     toast.error(error?.response?.data?.message);
  //   }
  // };
  const handleRemoveSaveListing = async () => {

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
        dispatch(removeSavedListing(id))
        toast.success(response?.data?.message);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    }
  };
  const handleMessageChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value); // Update the message state with the new value
  };

  const handleInvoiceFieldChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInvoiceFields((prevFields) => ({
      ...prevFields,
      [name]: value,
    }));
  };

  const handleDelete = async () => {
    try {
      let accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        console.error("Access token not found");
        return;
      }

      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API}/api/listings/deleteListing/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      toast.success("List deleted successfully");
      router.push("/user-listings");
    } catch (error) {
      console.error("Error deleting listing:", error);
      setError(
        "An error occurred while deleting the listing. Please try again later."
      );
    }
  };

  const onImageChange = (e: any) => {
    if (e.target.files && e.target.files[0]) {
      // setSelectedImage1(URL.createObjectURL(e.target.files[0])
      setSelectedImage1(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleUpdateListing = async () => {
    try {
      let accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        console.error("Access token not found");
        return;
      }
      const formData = new FormData();
      formData.append("title", listingData.title);
      formData.append("description", listingData.description);
      formData.append("category ", listingData.category);
      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API}/api/listings/updateListing/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success(response?.data?.message);
        setShowEditPopup(false);
        router.push("/all-listing");
      }
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      setError(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  const handleBindApi = async () => {
    try {
      let accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        console.error("Access token not found");
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
      formData.append(
        "listingInformation",
        listingData?.id + " " + listingData?.category
      );
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

  const handleGotitPopup = (id: any, listingPostedBy: any) => {
    let accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      setShowloginPopUp(true);
      return;
    }
    if (admin && listingPostedBy.id == admin.id) {
      toast.error(
        "You're the owner of this listing and already searching for this item."
      );
      return;
    }
    router.push(`/listings/got-it/${id}`);
  };

  const fetchListingData = async () => {
    try {
      let accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        console.error("Access token not found");
        return;
      }
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API}/api/listings/fetchListing/${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.status === 200) {
        setListingData(response?.data?.data);
      }
    } catch (error) {
      console.error("Error fetching listing data:", error);
      setError(
        "An error occurred while fetching the listing data. Please try again later."
      );
    }
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

  const handleEditButtonClick = () => {
    setShowEditPopup(true);
    fetchListingData();
  };

  const handlePayPalButtonClick = () => {
    setShowPayPalPopup(true);
  };

  const handleClosePopup = () => {
    setShowPayPalPopup(false);
    setShowEditPopup(false);
    setShowPopup(false);
    setShowloginPopUp(false);
  };

  const handleDeleteListing = async () => {
    setModalLoading(true);

    let accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      setModalLoading(false);

      console.error("Access token not found");
      return;
    }
    const admin = JSON.parse(localStorage.getItem("User") || "");
    const checkAdmin = admin.role;
    let api = "";
    if (checkAdmin && checkAdmin === "admin") {
      api = `${process.env.NEXT_PUBLIC_API}/api/admin/deleteListing/${id}`;
    } else {
      api = `${process.env.NEXT_PUBLIC_API}/api/listings/deleteListing/${id}`;
    }
    try {
      await axios.delete(api, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setModalLoading(false);

      toast.success("List deleted successfully");
      router.push("/all-listings");

      window.location.reload();
    } catch (error) {
      console.error("Error deleting listing:", error);
      setModalLoading(false);
    }
  };

  const handleDeleteImage = async () => {
    setModalLoading(true);

    let accessToken = localStorage.getItem("accessToken");
    // if (!accessToken) {
    //   console.error("Access token not found");
    //   return;
    // }

    const api = `${process.env.NEXT_PUBLIC_API}/api/admin/deleteListingImage/${id}`;
    try {
      await axios.delete(api, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setModalLoading(false);

      toast.success("Image deleted successfully");
      router.push("/all-listings");
      window.location.reload();

      // You may need to refresh the page or update the UI accordingly
    } catch (error) {
      setModalLoading(false);

      console.error("Error deleting image:", error);
    }
  };
  const handleSignIn = () => {
    router.push("/sign-in");
  };

  const openLightbox = (attachmentFile: string | undefined) => {
    if (attachmentFile) {
      // For image files, open in the Lightbox
      setLightboxData({ imageURL: attachmentFile });
      setLightboxOpen(true);
    }
  };

  const handleDeleteModal = (type: "listing" | "image") => {
    let deleteAction: any;
    let alertmessage = "";

    if (type === "listing") {
      deleteAction = handleDeleteListing;
      alertmessage = "Are you sure you want to delete this listing?";
    } else if (type === "image") {
      deleteAction = handleDeleteImage;
      alertmessage = "Are you sure you want to delete this image?";
    }

    setDeleteAction(() => deleteAction);
    setDeleteMessage(alertmessage);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    await deleteAction();
    setIsModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleViewList = () => {
    router.push(`/listings/${slug}`);
  };

  const [data, setData] = useState([]);
  const [noFound, setNoFound] = useState("");

  const GetSavedListings = async () => {
    try {
      let accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        console.error("Access token not found");
        return;
      }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/listings/fetchSavedListings`,
        {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (!response.ok) {
        const responseData = await response.json();
        if (responseData.error == "Not Found") {
          setNoFound(responseData.message);
        }
        console.log(responseData);
      } else {
        const Successresponse = await response.json();
        setData(Successresponse?.data);
      }
    } catch (error) {
      // Handle error - show error message to the user, etc.
    }
  };
  const handleAlreadySendMsg = () => {
    toast.error("You have sent message already");
  };
  return (
    <>
      <div className="pb-6">
        <style>
          {`
          .dot {
            height: 10px;
            width: 10px;
            background-color: rgb(244 63 94);
            border-radius: 50%;
            display: inline-block;
          }
          .imgStwidth {
            width: 192px !important;
            height: 180px !important;
          }
          `}
        </style>
        <div className="container-fluid mx-auto antialiased">
          <h1></h1>
          <div>
            <div className="bg-[#212121] mx-auto border-bright-green border rounded-sm text-gray-700 mb-0.5 h-30  w-full md:w-[75%] lg:w-full ">
              <div className="flex lg:flex-row items-center p-3 md:border-l-8 border-bright-green cursor-pointer overflow-x-auto max-w-full">
                {/* old code is available in text file in documents */}
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
                <div onClick={handleViewList} className="flex-1 min-w-[250px]">
                  <div className="ml-3 space-y-1">
                    <div className="leading-6 font-normal capitalize text-bright-green">
                      <span className="text-bright-green">Listing # </span> {id}

                    </div>
                    <div className="leading-6 font-normal capitalize text-white">
                      <span className="text-bright-green">Listing Posted By: </span> {listingPostedBy.username}

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

                {/* Share Icons */}
                <div className="lg:border-r px-3">
                  {admin?.role === "admin" ? (
                    <div>
                      <UserProfile
                        userid={listingPostedBy.id}
                        username={listingPostedBy.username}
                        fullName={listingPostedBy.fullname}
                        email={listingPostedBy.email}
                        showDeleteButton={true}
                      />
                    </div>
                  ) : (
                    <>
                      <div className=" px-3 flex-shrink-0">
                        <Share slug={slug}/>
                      </div>
                    </>
                  )}
                </div>

                {/* Buttons Section */}

                {/* <div
                  className="lg:ml-3 md:my-5 p-1 w-full lg:w-60"
                  onClick={(event) => event.stopPropagation()}
                >
                  {admin?.role === "admin" ? (
                    <div className="flex gap-2 sm:flex-col items-center justify-center">
                      <Button
                        text="Delete Image"
                        onClick={() => handleDeleteModal("image")}
                        type="danger"
                        className="w-full"
                      />
                      <Button
                        text="Delete Listing"
                        onClick={() => handleDeleteModal("listing")}
                        type="danger"
                        className="w-full"
                      />
                    </div>
                  ) : (
                    <div className="flex gap-2 sm:flex-col items-center justify-center">
                      {!isApprovedByAdmin ? (
                        <Button
                          text="Already Sent Message!"
                          onClick={() => handleAlreadySendMsg()}
                          type="success"
                          className="w-full"
                        />
                      ) : (
                        <Button
                          text="I’ve Got it!"
                          onClick={() => handleGotitPopup(id, listingPostedBy)}
                          type="success"
                          className="w-full"
                        />
                      )}

                      {isEditable && (
                        <Button
                          text="Edit"
                          onClick={handleEditButtonClick}
                          type="info"
                          className="w-full"
                        />
                      )}
                      {isEditable && (
                        <Button
                          text="Delete"
                          onClick={handleDelete}
                          type="danger"
                          className="w-full"
                        />
                      )}
                      {admin?.role !== "admin" &&
                        (isSaved ? (
                          <>
                            <Button
                              text="Remove from Profile"
                              onClick={handleRemoveSaveListing}
                              type="danger"
                              className="w-full"
                            />
                          </>
                        ) : (
                          <>
                            <Button
                              text="Save to Profile"
                              onClick={handleSaveListing}
                              type="danger"
                              className="w-full"
                            />
                          </>
                        ))}
                    </div>
                  )}
                </div> */}

                <div
                  className="lg:ml-3 p-1 flex-shrink-0 lg:w-60"
                  onClick={(event) => event.stopPropagation()}
                >
                  {admin?.role === "admin" ? (
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Button
                        text="Delete Image"
                        onClick={() => handleDeleteModal("image")}
                        type="danger"
                        className="w-full"
                      />
                      <Button
                        text="Delete Listing"
                        onClick={() => handleDeleteModal("listing")}
                        type="danger"
                        className="w-full"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-2">
                      {!isApprovedByAdmin ? (
                        <Button
                          text="Already Sent Message!"
                          onClick={() => handleAlreadySendMsg()}
                          type="success"
                          className="w-full"
                        />
                      ) : (
                        <Button
                          text="I’ve Got it!"
                          onClick={() => handleGotitPopup(id, listingPostedBy)}
                          type="success"
                          className="w-full bg-bright-green text-black"
                        />
                      )}
                      {savedListing.some((item) => item.listingId == id) ? (
                        <Button
                          text="Remove from Profile"
                          onClick={handleRemoveSaveListing}
                          type="danger"
                          className="w-full bg-white text-black"
                        />
                      ) : (
                        <Button
                          text="Save to Profile"
                          onClick={handleSaveListing}
                          type="danger"
                          className="w-full bg-white text-black"
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showPopup && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-black p-4 rounded-lg relative cursor-pointer">
            <button
              className="absolute top-2 right-2 text-black font-bold"
              onClick={handleClosePopup}
            >
              X
            </button>
            {!admin ? (
              <>
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
                  Please Log In Or Sign Up{" "}
                </div>
              </>
            ) : (
              <>
                <div style={{ border: "3px solid yellow" }}>
                  <div className="flex flex-1 flex-col gap-2">
                    <TextInput
                      label={`Item I Want #${id}`}
                      containerClassName="gap-0"
                      labelClassName="text-bright-green font-bold"
                      className="w-full"
                      value={title}
                      style={{
                        padding: 0,
                        paddingTop: "2px",
                        paddingBottom: "2px",
                        fontSize: "24px",
                      }}
                    />
                    <div>
                      <TextArea
                        label="Description and Details"
                        // containerClassName="gap-0"
                        labelClassName="text-bright-green font-bold"
                        className="w-full"
                        value={description}
                        style={{
                          padding: 0,
                          paddingTop: "2px",
                          paddingBottom: "2px",
                          fontSize: "16px",
                          height: "140px",
                        }}
                      />
                    </div>
                    <div className="w-32 h-32 md:w-40 md:h-40 relative">
                      <Image
                        src={
                          featuredImage ||
                          "https://iwiygi-assets.s3.amazonaws.com/not_found_image.png"
                        }
                        alt="No Image"
                        className="imgStwidth"
                        layout="fill"
                      />
                    </div>
                  </div>
                </div>
                <label
                  htmlFor="customTextArea"
                  className="text-bright-black font-normal"
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
                  // fontSize: "24px",
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
                  // fontSize: "24px",
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
        <div className="relative">
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-black p-10 rounded-md shadow-lg relative">
              <IoClose
                onClick={handleClosePopup}
                className="text-[2rem] absolute top-0 right-0 cursor-pointer"
              />
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
                className="text-bright-green underline font-bold text-2xl cursor-pointer"
                onClick={handleSignIn}
              >
                Please Login Or Sign Up{" "}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Edit Popup */}
      {showEditPopup && (
        <div
          style={{ transform: "translate(-50%, -50%)", zIndex: "1" }}
          className="fixed bg-black top-1/2 left-1/2 z-1 border-2 border-bright-green"
        >
          <div className="bg-black p-4 rounded-lg relative">
            <button
              className="absolute top-2 right-2 text-white-600 font-bold"
              onClick={handleClosePopup}
            >
              X
            </button>
            <h2 className="text-xl font-semibold mb-4">Edit Listing</h2>
            {/* Form fields to edit listing data */}
            <TextInput
              label="Title"
              labelClassName="text-bright-green font-normal mb-4"
              value={listingData.title}
              onChange={(e) =>
                setListingData({ ...listingData, title: e.target.value })
              }
            />
            <TextArea
              label="Description"
              labelClassName="text-bright-green font-normal mb-4"
              value={listingData.description}
              onChange={(e) =>
                setListingData({ ...listingData, description: e.target.value })
              }
            />
            <div className="mt-2 flex flex-row items-center justify-center">
              <label className="text-bright-green  text-[24px]">Photo</label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setSelectedImage(e.target.files ? e.target.files[0] : null)
                }
                className="hidden"
              />
              <Image
                // onChange={(e) =>
                //   setListingData({ ...listingData, featuredImage: e.target.value })
                // }
                src={
                  listingData.featuredImage !== ""
                    ? listingData.featuredImage
                    : "https://iwiygi-assets.s3.amazonaws.com/not_found_image.png"
                }
                alt="listing"
                width={100}
                height={180}
              />
              <label
                htmlFor="image-upload"
                className="text-bright-green  text-[12px]"
              >
                Choose New Image
              </label>
            </div>
            <button
              className="bg-dark-green text-black rounded-[50%] px-[50px] py-[10px] font-bold text-[24px] "
              onClick={handleUpdateListing}
            >
              Update Listing
            </button>
            {error && <div className="text-red-500">{error}</div>}
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        message={deleteMessage}
        loading={modalLoading}
      />
    </>
  );
};

export default ListingAdmin;
