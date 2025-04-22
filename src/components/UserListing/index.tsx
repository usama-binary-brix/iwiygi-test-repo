import { FC, useState, useEffect, ChangeEvent } from "react";
import axios, { AxiosError } from "axios";
import TextInput from "@/components/Form/TextInput";
import Image from "next/image";
import { toast } from "sonner";
import imagesold from "../../../public/images/sold.png";
import TextArea from "@/components/Form/TextArea";
import Share from "@/components/Share";
import { useRouter } from "next/navigation";
import { Dropdown } from "flowbite-react";
import { FaTags } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import Lightbox from "react-image-lightbox";
import MegaListView from "../generic/MegaListView";
import ConfirmationModal from "../generic/ConfirmationModal";
import Button from "../button/Button";

export interface ListingItem {
  id: string;
  title: string;
  description: string;
  slug?:string;
  featuredImage: string;
  isSaved: boolean;
  price: string;
  message?: string;
  category: any;
  listingPostedBy: User;
  isApprovedByAdmin: boolean;
}

interface User {
  username: string;
  email: string;
}

export interface ListingProps extends ListingItem {
  id: string;
  index: number;
  listingRefresh: () => void;
  categories: any;
  messageCount: any;
}

interface ErrorResponse {
  message: string;
}
interface LightboxData {
  imageURL: string;
}
const UserListing: FC<ListingProps> = ({
  id,
  title,
  description,
  slug,
  featuredImage,
  isSaved,
  isApprovedByAdmin,
  index,
  listingRefresh,
  categories,
  messageCount,
  listingPostedBy
}) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxData, setLightboxData] = useState<LightboxData>({
    imageURL: "",
  });

  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedImage1, setSelectedImage1] = useState(null);
  const [showEditPopup, setShowEditPopup] = useState<boolean>(false);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [showPayPalPopup, setShowPayPalPopup] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [listingData, setListingData] = useState<ListingItem>({
    id: "",
    title: "",
    description: "",
    featuredImage: "",
    category: "",
    slug:'',
    isSaved: false,
    price: "234",
    isApprovedByAdmin: false,
    listingPostedBy: { username: "", email: "" },
  });
  const router = useRouter();

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteAction, setDeleteAction] = useState<() => void>(() => () => {});
  const [deleteMessage, setDeleteMessage] = useState<string>("");
  const [modalLoading, setModalLoading] = useState(false);
  const handleInvoiceFieldChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInvoiceFields((prevFields) => ({
      ...prevFields,
      [name]: value,
    }));
  };

  const handleMessageChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value); // Update the message state with the new value
  };

  const handlePayPalButtonClick = () => {
    setShowPayPalPopup(true);
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

  useEffect(() => {
    if (listingData && listingData.category) {
      const selectedItem = categories.find(
        (item: any) => item.id == listingData.category
      );
      if (selectedItem) {
        setSelectedCategory(selectedItem.id);
        setSelectedCategoryName(selectedItem.name);
      }
    }
  }, [listingData, categories]);

  const handleEditButtonClick = () => {
    setShowEditPopup(true);
    fetchListingData();
  };

  const handleSeeMessages = (id: any) => {
    router.push(`/user-listing/seller-messages/${id}`);
  };
  const handleClosePopup = () => {
    setShowPayPalPopup(false);
    setShowEditPopup(false);
    setShowPopup(false);
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

  const handleBindApi = async () => {
    try {
      let accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        console.error("Access token not found");
        return;
      }
      const user = JSON.parse(localStorage.getItem("User") || "");
      const formData = new FormData();
      formData.append("senderUsername", user?.username);
      formData.append(
        "recieverUsername",
        listingData?.listingPostedBy?.username
      );
      formData.append("recieverEmail", listingData?.listingPostedBy?.email);
      formData.append(
        "listingInformation",
        listingData?.id + " " + listingData?.category
      );
      formData.append("message", message);
      // if (attachments) {
      if (selectedImage1) {
        formData.append("attachments", selectedImage1);
      }

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

  const onImageChange = (e: any) => {
    if (e.target.files && e.target.files[0]) {
      // setSelectedImage1(URL.createObjectURL(e.target.files[0])
      setSelectedImage1(e.target.files[0]);
    }
  };
  const [loadingUpdateListing, setLoadingUpdateListing] = useState(false);
  const handleUpdateListing = async () => {
    setLoadingUpdateListing(true);

    try {
      let accessToken = localStorage.getItem("accessToken");
      // if (!accessToken) {
      //   console.error("Access token not found");
      //   return;
      // }

      const formData = new FormData();
      formData.append("title", listingData.title);
      formData.append("description", listingData.description);
      formData.append("category", selectedCategory);
      if (selectedImage) {
        formData.append("featuredImage", selectedImage);
      }

      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API}/api/listings/updateListing/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success(response?.data?.message);
        setLoadingUpdateListing(false);

        listingRefresh();
        setShowEditPopup(false);
        router.push("/user-listing");
      }
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      setError(
        error.response?.data?.message || "An error occurred. Please try again."
      );
      setLoadingUpdateListing(false);
    }
  };

  const handleDelete = async () => {
    setModalLoading(true);
    try {
      let accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setModalLoading(false);
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
      setModalLoading(false);
      listingRefresh();
      router.push("/user-listing");
    } catch (error) {
      setModalLoading(false);
      console.error("Error deleting list:", error);
      setError(
        "An error occurred while deleting the listing. Please try again later."
      );
    }
  };
  const openLightbox = (attachmentFile: string | undefined) => {
    if (attachmentFile) {
      // For image files, open in the Lightbox
      setLightboxData({ imageURL: attachmentFile });
      setLightboxOpen(true);
    }
  };

  const handleDeleteModal = () => {
    let deleteAction: any;
    let message = "";

    deleteAction = () => handleDelete;
    message = "Are you sure you want to delete this listing?";

    setDeleteAction(() => deleteAction);
    setDeleteMessage(message); // Set the message based on type
    setIsModalOpen(true); // Open the modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  const handleConfirmDelete = async () => {
    await deleteAction(); // Call the appropriate delete action
    setIsModalOpen(false);
  };

  return (
    <div className="pb-6">
      <style>
        {`.dot {
            height: 10px;
            width: 10px;
            background-color: rgb(244 63 94);
            border-radius: 50%;
            display: inline-block;
          }
          .starburst {
            width: 100px;
            height: 100px;
            background-color: #ffcc00;
            border: 2px solid #000;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-weight: bold;
            color: #fff;
        }
        .transition-opacity {
            overflow: auto;
            height: 18rem;
        }
        /* Text inside the starburst */
        .starburst-text {
            font-size: 16px;
            text-transform: uppercase;
        }`}
      </style>
      <div className="container-fluid mx-auto antialiased">
        <div>
          <MegaListView
            id={id}
            listingPostedBy={listingPostedBy}
            img={featuredImage}
            title={title}
            slug={slug}
            description={description}
            isApprovedByAdmin={isApprovedByAdmin ? "Approved" : "Pending"}
            buttons={[
              {
                onClick: handleEditButtonClick,
                title: "Edit Listing",
                // classes:
                //   "bg-bright-green text-black  font-bold w-full text-center hover:bg-dark-green",
                type: "success",
              },

              {
                onClick: handleDelete,
                title: "Delete Listing",
                // classes:
                //   "bg-[#cf3917] text-white  font-bold w-full text-center hover:bg-red-600",
                type: "danger",
              },
              // {
              //   onClick: () => handleSeeMessages(id),
              //   title: `See Messages (${messageCount})`,
              //   classes:
              //     "bg-dark-green text-black  font-bold border border-bright-green px-1 py-2 w-full text-center",
              // },
            ]}
          />
        </div>
      </div>
      {/* <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex flex-1 flex-col gap-2">
          <TextInput
            label={`Item I Want #${id}`}
            // containerClassName="gap-0"
            labelClassName="text-bright-green font-bold"
            className="w-full"
            value={title}
            style={{
              padding: 5,
              fontSize: "18px",
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
                padding: 10,
                paddingTop: "2px",
                paddingBottom: "2px",
                fontSize: "16px",
                height: "140px",
              }}
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 md:justify-center lg:justify-normal md:mt-10 lg:mt-0">
          <div className="text-center flex flex-col items-center">

            <Image src={featuredImage || "https://iwiygi-assets.s3.amazonaws.com/not_found_image.png"} alt="listing" width={100} height={180} style={{ width: "192px", height: '180px' }} className="" />
          </div>
          <div className="text-center flex flex-col items-center mt-0">
            <button
              className=" border border-bright-green px-1 py-2 bg-blue-dark h-[180px]"
              style={{
                // margin: "auto",
                paddingTop: "15px",
                paddingRight: "6px",
                paddingBottom: "0.5px",
                paddingLeft: "6px",
              }}
            >
              <Share />
            </button>
          </div>
          <div className="flex gap-4 flex-col items-center">
            <button
              onClick={handleEditButtonClick}
              className=" border border-bright-green  bg-blue-dark py-[4px] px-[25px]"
              style={{
                width: '198px',
                height: '38px',
                marginBottom: '-7.5px'
              }}
            >
              Edit Listing
            </button>

            <button
              onClick={handleDelete}
              className=" border border-bright-green px-1 py-2 bg-blue-dark py-[4px] px-[25px]"
              style={{
                width: '198px',
                height: '38px',
                marginBottom: '-7.5px'
              }}
            >
              Delete Listing
            </button>
            <button
              onClick={() => handleSeeMessages(id)}
              className=" border border-bright-green px-1 py-2 bg-bright-green py-[4px] px-[25px]"
              style={{
                fontSize: '16px',
                fontWeight: '700',
                lineHeight: '24px',
                textAlign: 'center',
                color: 'black',
                width: '198px',
                height: '38px',
                marginBottom: '-7.5px'
              }}>See Messages ({messageCount})</button>
            <div className=" border border order-bright-green bg-blue-dark py-[4px] px-[25px] cursor-pointer font-semibold"
              style={{
                width: '198px',
                height: '38px',
                fontSize: '16px',
                fontStyle: '',
                fontWeight: 400,
                lineHeight: '24px',
                textAlign: 'center'
              }}
            >Status: {isApprovedByAdmin ? "Approved" : "Processing"}</div>
          </div>
        </div>
      </div> */}

      {/* <hr className="border-bright-green mt-6 mb-2 border-2 w-full" /> */}

      {showPopup && (
        <div
          style={{ transform: "translate(-50%, -50%)", zIndex: "1" }}
          className="fixed bg-white top-1/2 left-1/2 z-1 border-4 border-bright-green p-4 w-full md:w-auto"
        >
          <button
            className="absolute top-2 right-2 text-black font-bold"
            onClick={handleClosePopup}
          >
            X
          </button>
          <div className="bg-white p-4">
            <div className="flex flex-col items-center bg-black w-fit h-fit rounded-[50%] px-[20px] py-[14px]">
              <div className=" font-bold text-bright-green">
                I&apos;ve Got It !
              </div>
            </div>

            <hr className="border-green-800 mt-2 border-2 w-full" />
            <TextArea
              label="Message" // Label for the text area
              containerClassName="gap-0"
              labelClassName="text-bright-green font-normal"
              className="w-full text-black min-h-40"
              value={message} // Value of the text area is controlled by the message state
              onChange={handleMessageChange} // onChange event handler to update the message state
              style={{
                minHeight: "4rem",
                padding: 0,
                paddingTop: "2px",
                paddingBottom: "2px",
                fontSize: "16px",
                fontWeight: "600",
                fontStyle: "",
              }}
            ></TextArea>
            <div className="flex font-bold flex-row items-center justify-center text-blue-700">
              <span className="dot"></span> Be sure your agreed purchase price
              including shipping <span className="dot"></span>
            </div>
            <div className="mt-2 mb-2 flex flex-row items-center justify-around">
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={onImageChange}
                className="hidden"
              />
              <div className="relative w-40 h-40 border-2 border-green-300 overflow-hidden mb-4 md:mb-0">
                {selectedImage1 ? (
                  <Image
                    src={selectedImage1} // Use URL.createObjectURL to display the selected image
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
            <div className="flex flex-col md:flex-row text-black items-center justify-center text-center">
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
          </div>
        </div>
      )}

      {showPayPalPopup && (
        <div
          style={{ transform: "translate(-50%, -50%)", zIndex: "1" }}
          className="fixed bg-black top-1/2 left-1/2 z-1 p-4 border-4 border-bright-green w-full md:w-auto"
        >
          <button
            className="absolute top-2 right-2 text-white font-bold"
            onClick={handleClosePopup}
          >
            X
          </button>
          <div className="p-4">
            <div className="flex font-bold flex-row items-center justify-center text-blue-700">
              <span className="dot"></span> Be sure your agreed purchase price
              including shipping <span className="dot"></span>
              <br />
              <br />
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
                fontSize: "12x",
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
      )}

      {showEditPopup && (
        <div className="relative">
          <div className="fixed  inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div
              style={{ transform: "translate(-50%, -45%)", zIndex: "10000" }}
              className="fixed h-[440px] xl:h-[540px] overflow-auto bg-black top-1/2 left-1/2 rounded w-[300px] md:w-[500px] lg:w-[600px] xl:w-[600px] p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-white">
                  Edit Listing
                </h2>
                <IoClose
                  onClick={handleClosePopup}
                  className="text-2xl cursor-pointer"
                />
              </div>
              {/* Form fields to edit listing data */}
              <div className="flex flex-col gap-5">
                <TextInput
                  label="Title"
                  // labelClassName="text-bright-green font-normal mb-4"
                  value={listingData.title}
                  onChange={(e) =>
                    setListingData({ ...listingData, title: e.target.value })
                  }
                />
                <TextArea
                  label="Description"
                  // labelClassName="text-bright-green font-normal mb-4"
                  value={listingData.description}
                  onChange={(e) =>
                    setListingData({
                      ...listingData,
                      description: e.target.value,
                    })
                  }
                />

                <div className="flex flex-col lg:flex-row lg:items-center lg:gap-9 w-full">
                  <label className="flex ml-1 font-bold text-lg sm:text-xl  lg:w-[50%] ">
                    Category
                  </label>
                  <Dropdown
                    label=""
                    renderTrigger={() => (
                      <div className="flex items-center bg-white h-[45px] w-full cursor-pointer px-2 border border-gray-300">
                        <FaTags
                          className="text-[16px] text-black"
                          style={{ marginRight: ".5rem" }}
                        />
                        <div className="text-black text-[14px] font-bold truncate">
                          {selectedCategoryName
                            ? selectedCategoryName
                            : "Select Category"}
                        </div>
                      </div>
                    )}
                    onChange={(event) => {
                      const selectedValue = (event.target as HTMLInputElement)
                        .value;
                      setSelectedCategory(selectedValue);
                    }}
                  >
                    {categories.map((item: any) => (
                      <div
                        key={item.id}
                        className="bg-bright-green font-bold text-bright-green hover:bg-bright-green hover:text-black"
                      >
                        <Dropdown.Item
                          onClick={() => {
                            setSelectedCategory(item.id);
                            setSelectedCategoryName(item.name);
                          }}
                        >
                          {item.name}
                        </Dropdown.Item>
                      </div>
                    ))}
                  </Dropdown>
                </div>
                <div className="flex flex-col lg:flex-row lg:items-center lg:gap-9 w-full">
                  <label className="flex ml-1 font-bold text-lg sm:text-xl  lg:w-[50%]">
                    Photo
                  </label>
   <div className="w-full">
                    <div>
                      <label
                        htmlFor="image-upload"
                        className="text-bright-green  text-[12px] cursor-pointer"
                      >
                        Choose New Image
                      </label>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          setSelectedImage(
                            e.target.files ? e.target.files[0] : null
                          )
                        }
                        className="hidden"
                      />
                    </div>
                    <Image
                      src={
                        selectedImage
                          ? URL.createObjectURL(selectedImage)
                          : listingData.featuredImage ||
                            "https://iwiygi-assets.s3.amazonaws.com/not_found_image.png"
                      }
                      alt="listing"
                      width={200}
                      height={280}
                    />
                  </div>
                  {/* <div className="w-full">
                    <div>
                      <label
                        htmlFor="image-upload"
                        className="text-bright-green  text-[12px]"
                      >
                        Choose New Image
                      </label>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          setSelectedImage(
                            e.target.files ? e.target.files[0] : null
                          )
                        }
                        className="hidden"
                      />
                    </div>
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
                      width={200}
                      height={280}
                    />
                  </div> */}
                </div>
                <div className="text-center flex item-center justify-center">
            
                  <Button
                    text="Update Listing"
                    type="success"
                    loading={loadingUpdateListing}
                    className=" text-black w-[fir-content]"
                    onClick={handleUpdateListing}
                  />
                </div>
              </div>
              {error && <div className="text-red-500">{error}</div>}
            </div>
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
    </div>
  );
};

export default UserListing;
