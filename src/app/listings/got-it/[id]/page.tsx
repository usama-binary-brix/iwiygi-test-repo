"use client";

import { RootState} from '../../../../store/store'
import Image from "next/image";
import TextArea from "@/components/Form/TextArea";
import TextInput from "@/components/Form/TextInput";
import isAuth from "@/components/auth/isAuth";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import imageCompression from "browser-image-compression";
import Lightbox from "react-image-lightbox";
import BackStep from "@/components/backStep/BackStep";
import Link from "next/link";
import ButtonWithLoading from "@/components/button/ButtonWIthLoading";
import Button from "@/components/button/Button";
import { CiTrash } from "react-icons/ci";
import { IoClose } from "react-icons/io5";
import { useSelector } from "react-redux";

interface ListingProps {
  id: number;
  title: string;
  description: string;
  featuredImage: string;
  listingPostedBy: {
    id: number;
    zipCode: string;
  };
}
interface LightboxData {
  imageURL: string;
}
function GotItItem({ params }: { params: { id: any } }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxData, setLightboxData] = useState<LightboxData>({
    imageURL: "",
  });
  const [listing, setListing] = useState<ListingProps | null>(null);
  // const [images, setImages] = useState<string[]>(["", "", "", "", ""]);
  const [images, setImages] = useState<Array<string | null>>(
    Array(5).fill(null)
  );

  const [rawFiles, setRawFiles] = useState<File[]>([]);

  const [loading, setLoading] = useState(false);
  const [sendLoading, setSendLoading] = useState(false);
  const [offerPrice, setOfferPrice] = useState("");
  const [shippingPrice, setShippingPrice] = useState("");
  const [isFreeShipping, setIsFreeShipping] = useState(false);
  const [showShippingCalculateModal, setShowShippingCalculateModal] =
    useState(false);

  const handleCheckboxChange = () => {
    setIsFreeShipping(!isFreeShipping);
    setShippingPrice(!isFreeShipping ? "0" : "");
  };

  const [message, setMessage] = useState("");
  let count = 1;
  const router = useRouter();
  const listingId = params.id;

  useEffect(() => {
    getListingById();
  }, []);

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const updatedImages = [...images];
        updatedImages[index] = reader.result as string;
        setImages(updatedImages);
      };
      reader.readAsDataURL(file);

      const updatedRawFiles = [...rawFiles];
      updatedRawFiles[index] = file;
      setRawFiles(updatedRawFiles);
    }
  };

  const handleSubmit = async () => {
    if (count === 0) {
      toast.error("Request is Already Processing");
      return;
    }
    count++;
    // if (message === "") {
    //   toast.error("Please enter a message before submitting.");
    //   return false;
    // }
    const formData = new FormData();
    const imageOptions = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1024,
      useWebWorker: true,
    };

    for (let i = 0; i < rawFiles.length; i++) {
      if (rawFiles[i]) {
        let processedImage = rawFiles[i];
        if (
          rawFiles[i].type === "image/svg+xml" ||
          rawFiles[i].type === "image/gif"
        ) {
          const compressedBlob = await imageCompression(
            rawFiles[i],
            imageOptions
          );
          processedImage = new File([compressedBlob], `image${i}.jpg`, {
            type: "image/jpeg",
          });
        }
        formData.append("images", processedImage, `image${i}.jpg`);
      }
    }

    formData.append("message", message);
    formData.append("offerPrice", offerPrice);
    formData.append("shippingPrice", shippingPrice);
    formData.append("listingId", listingId);
    formData.append("parent", String(0));
    formData.append("isSeller", String(true));
    formData.append("isBuyer", String(false));
    formData.append("recieverUserId", String(listing?.listingPostedBy?.id));
    let accessToken = localStorage.getItem("accessToken");

    // fetch(`${process.env.NEXT_PUBLIC_API}/api/chat/initial-message`, {
    //   method: "POST",
    //   headers: {
    //     Authorization: `Bearer ${accessToken}`,
    //   },
    //   body: formData,
    // })
    //   .then((response) => {
    //     if (!response.ok) {
    //       throw new Error(`HTTP error! status: ${response.status}`);
    //     }
    //     count--;
    //     return response.json();
    //   })
    //   .then((data) => {
    //     // console.log(data?.data.id);
    //     toast.success(data?.message);
    //     setTimeout(() => {
    //       // router.push(`/listings/got-it/seller-buyer-conversation/${data?.data?.id}`);
    //       router.push(`/listings/search`);
    //     }, 1000);
    //   })
    //   .catch((error) => {
    //     count--;
    //     console.log(error.message, "error");
    //     toast.error(error.message);
    //     return;
    //     // toast.error("You have already Initiate Message with this Buyer");
    //     // return;
    //   });

    try {
      setSendLoading(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/api/chat/initial-message`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Assuming the response contains a `message` field and data
      toast.success(response?.data?.message);
      setSendLoading(false);

      setTimeout(() => {
        // router.push(`/listings/got-it/seller-buyer-conversation/${response?.data?.data?.id}`);
        router.push(`/listings/search`);
      }, 1000);
    } catch (error: any) {
      count--;
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
      toast.error(error.response ? error.response.data.message : error.message);
      setSendLoading(false);
    } finally {
      count--;
      setSendLoading(false);
    }
  };

  const getListingById = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API}/api/listings/fetchListing/${listingId}`
      );
      if (response.status === 200) {
        setLoading(false);
        setListing(response?.data?.data);
      }
    } catch (error) {
      toast.error("Listing Not Found");
      setTimeout(() => {
        router.push("/listings/search");
      }, 1000);
    }
  };

  const openLightbox = (attachmentFile: string | undefined) => {
    if (attachmentFile) {
      // For image files, open in the Lightbox
      setLightboxData({ imageURL: attachmentFile });
      setLightboxOpen(true);
    }
  };
  const handleRemoveImage = (index: number) => {
    const updatedImages = [...images];
    updatedImages[index] = null;
    setImages(updatedImages);
  };

  const handleShowShippingModal = () => {
    setShowShippingCalculateModal(true);
  };
  const handleClosePopup = () => {
    setShowShippingCalculateModal(false); // Close the modal
  };

  const UserReduxData = useSelector((state: RootState) => state.user?.user);
  
  const [uspsData, setUspsData] = useState({
    weight: "",
    weightUnit: "kg",
    length: "",
    width: "",
    height: "",
  });

  const [createInvoiceData, setCreateInvoiceData] = useState({
    itemPrice: "",
  });

  const [shippingCost, setShippingCost] = useState(null);
  const [uspsShippingRate, setUspsShippingRate] = useState(null);
  const [checkRate, setCheckRate] = useState(false);

  // Handle input changes
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setUspsData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateInvoiceInputChange = (e: any) => {
    const { name, value } = e.target;
    setCreateInvoiceData((prev) => ({ ...prev, [name]: value }));
  };

  // Function to calculate USPS shipping cost from API
  const handleUspsPostRequest = async () => {
    setCheckRate(true);

    try {
      // Remove weightUnit from the data sent to API
      // const sanitizedData = (({ weightUnit, ...rest }) => rest)(uspsData);


      // const messageId = messages[0]?.id || 0;

      let weightInKg = parseFloat(uspsData.weight) || 0;

    switch (uspsData.weightUnit) {
      case "g":
        weightInKg = weightInKg / 1000; // Convert grams to kg
        break;
      case "lbs":
        weightInKg = weightInKg * 0.453592; // Convert lbs to kg
        break;
      case "oz":
        weightInKg = weightInKg * 0.0283495; // Convert oz to kg
        break;
    }

    if (weightInKg > 70) {
      toast.error("You cannot ship more than 70 kg.");
      setCheckRate(false);
      return;
    }

    const sanitizedData = {
      ...uspsData,
      weight: weightInKg, // Send weight in kg
      length: parseFloat(uspsData.length) || 0,
      width: parseFloat(uspsData.width) || 0,
      height: parseFloat(uspsData.height) || 0,
    };

      // const sanitizedData = {
      //   ...uspsData,
      //   weight: parseFloat(uspsData.weight) || 0, // Convert weight to a number
      //   length: parseFloat(uspsData.length) || 0,
      //   width: parseFloat(uspsData.width) || 0,
      //   height: parseFloat(uspsData.height) || 0,
      // };
      

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/shipping/initial-delivery-rate-usps`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...sanitizedData,
            originZIPCode: UserReduxData?.zipCode,
            destinationZIPCode: listing?.listingPostedBy?.zipCode,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! Status: ${response.status}`
        );
      }

      const data = await response.json();
      setUspsShippingRate(data?.rate?.totalBasePrice);
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong while fetching USPS data."
      );
    } finally {
      setCheckRate(false);
    }
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9.]/g, ""); // Sirf numbers aur dot allow kare
    setOfferPrice(value);
  };
  const handleChangeShipping = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9.]/g, ""); // Sirf numbers aur dot allow kare
    setShippingPrice(value);
  };
  return (
    <>
      <div className="p-3">
        <div className="container-fluid mx-3">
          <div className="text-2xl sm:text-3xl font-bold  mb-4  flex gap-3 justify-between items-center mt-3">
            <BackStep href="/listings/search" />
            <span>Create Offer Message</span>

            <button
              className="text-black bg-bright-green p-3 text-sm rounded-lg"
              onClick={handleShowShippingModal}
            >
              Calculate Shipping
            </button>
            {/* <Link
              href="/my-profile"
              className="bg-bright-green flex items-center justify-center gap-2 px-3 text-black text-base  font-bold py-2 w-[fit-content] rounded-md text-center"
            >
              Go To Member Profile
            </Link> */}
          </div>
          {loading && <Loader />}
          {!loading && (
            <div className="flex flex-col items-center p-6 bg-black">
              <div className="container-fluid w-full antialiased">
                <div>
                  <div className="bg-[#212121] mx-auto border-bright-green border rounded-sm text-gray-700 mb-0.5 h-30">
                    <div className="flex flex-col md:flex-row p-3 border-l-8 border-bright-green items-center">
                      <div className="space-y-1 md:border-r pr-3">
                        <div className="w-[120px] h-[120px] relative">
                          <Image
                            src={
                              listing?.featuredImage ||
                              "https://iwiygi-assets.s3.amazonaws.com/not_found_image.png"
                            }
                            alt="No Image"
                            className="w-[120px] h-[120px] rounded-md"
                            layout="fill"
                            onClick={() => openLightbox(listing?.featuredImage)}
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
                      </div>
                      <div className="flex-1 w-full">
                        <div className="ml-3 space-y-1 pr-3 w-full">
                          <div className="leading-6 font-normal capitalize text-white text-xl ">
                            {listing?.title}
                          </div>
                          <div className="text-sm leading-4 font-normal capitalize text-white">
                            {listing?.description}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* <div className="border-4 border-yellow-400 p-4 w-full">
            <div className="flex flex-col md:flex-row gap-6" style={{ paddingTop: '38px', paddingBottom: '38px' }}>
              <div className="flex-1 flex flex-col gap-2">
                <TextInput
                  disabled
                  label="Item I Want"
                  containerClassName="gap-0"
                  labelClassName="text-bright-green font-bold"
                  className="w-full"
                  value={listing?.title}
                  style={{
                    padding: 0,
                    paddingTop: '9px',
                    paddingBottom: '6px',
                    paddingLeft: '9px',
                    fontSize: '24px',
                    marginBottom: '15px',
                  }}
                />
                <TextArea
                  disabled
                  label="Description and Details"
                  // containerClassName="gap-0"
                  labelClassName="text-bright-green font-bold"
                  className="w-full"
                  value={listing?.description}
                  style={{
                    padding: 0,
                    paddingTop: '4px',
                    paddingBottom: '2px',
                    fontSize: '16px',
                    fontWeight: '600',
                  }}
                />
              </div>
              <div className="w-32 h-32 md:w-40 md:h-40 relative flex-shrink-0">
                <Image
                  src={listing?.featuredImage || "https://iwiygi-assets.s3.amazonaws.com/not_found_image.png"}
                  alt="No Image"
                  className="imgStwidth"
                  layout="fill"
                />
              </div>
            </div>
          </div> */}
              <div
                className="mt-4 w-full p-4"
                style={{ border: "3px solid rgb(7, 248, 24)" }}
              >
                {/* <div className="w-full max-w-7xl mt-6 p-4"> */}
                <div className="xl:flex xl:flex-1 lg:flex lg:flex-1 gap-9">
                  <label className="flex ml-1 font-bold text-lg sm:text-xl  lg:w-[50%]">
                    Offer Price{" "}
                  </label>
                  {/* <span className="text-red-500 ml-1">*</span> */}

                  <div className="w-full">
                    <input
                      placeholder="$ 0.00"
                      className="w-full text-black"
                      type="text"
                      value={offerPrice ? `$ ${offerPrice}` : ""} // Dollar sign sirf ek baar show karega
                      onChange={handleChange}  
                      // onChange={(e) => {
                      //   setOfferPrice(e.target.value);
                      //   const value = e.target.value;

                      //   if (/^\d*$/.test(value)) {
                      //     setOfferPrice(value);
                      //   } else {
                      //     toast.error("Offer Price should be a number");
                      //   }
                      // }}
                      style={{
                        // padding: 0,
                        paddingTop: "9px",
                        paddingBottom: "6px",
                        paddingLeft: "9px",
                        fontSize: "15px",
                      }}
                    />
                    <p className="mb-4">
                      <b className=" text-dark-green">Note:</b> Please add your
                      offer price so the buyer knows your proposal.{" "}
                    </p>
                  </div>
                </div>
                {/* -----------------shipping input field ----------- */}
                <div className="xl:flex xl:flex-1 lg:flex lg:flex-1 gap-9">
                  <label className="flex flex-col ml-1 font-bold text-lg sm:text-xl lg:w-[50%] gap-2">
                    <div>
                      Shipping & Insurance{" "}
                      <span className="text-bright-green text-xs font-normal">
                        {listing?.listingPostedBy?.zipCode}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="checkbox"
                        checked={isFreeShipping}
                        onChange={handleCheckboxChange}
                      />
                      <span className="text-sm">
                        Click Here to offer Free Shipping
                      </span>
                    </div>
                  </label>

                  <div className="w-full">
                    <input
                      placeholder="$ 0.00"
                      className="w-full text-black"
                      type="text"
                      value={shippingPrice ? `$ ${shippingPrice}` : ""} // Ensure "$" shows only once
                      disabled={isFreeShipping}
                      onChange={handleChangeShipping}
                      // value={shippingPrice}
                      // disabled={isFreeShipping}
                      // onChange={(e) => {
                      //   // const value = e.target.value;
                      //   setShippingPrice(e.target.value);
                       
                      //   // if (/^\d*$/.test(value)) {
                      //   //   setShippingPrice(value);
                      //   // } else {
                      //   //   toast.error("Shipping Price should be a number");
                      //   // }
                      // }}
                      style={{
                        paddingTop: "9px",
                        paddingBottom: "6px",
                        paddingLeft: "9px",
                        fontSize: "15px",
                      }}
                    />
                    <p className="mb-4">
                      <b className=" text-dark-green">Note:</b> Please add your
                      shipping & insurance price.
                    </p>
                  </div>
                </div>
                {/* ------------------- messages field ------------- */}
                <div className="xl:flex xl:flex-1 lg:flex lg:flex-1 gap-9">
                  <label className="flex ml-1 font-bold text-lg sm:text-xl  lg:w-[50%]">
                    Message
                  </label>
                  <div className="w-full">
                    <textarea
                      placeholder="Enter Your Message"
                      className="w-full text-black"
                      onChange={(e) => setMessage(e.target.value)}
                      style={{
                        // padding: 0,
                        paddingTop: "9px",
                        paddingBottom: "6px",
                        paddingLeft: "9px",
                        fontSize: "14px",
                        height: "135px",
                      }}
                    />
                    <p className="mb-4">
                      <b className=" text-dark-green">Note:</b> Clearly mention
                      key specifications, condition, and included accessories.{" "}
                    </p>
                  </div>
                </div>

                <div className="xl:flex xl:flex-1 lg:flex lg:flex-1 gap-9">
                  <label className="flex ml-1 font-bold text-lg sm:text-xl  lg:w-[50%]">
                    Provide Up to 5 Photos of Your Item
                  </label>
                  <div className="w-full">
                    <div
                      className="flex flex-col md:flex-row gap-4 mt-2 w-full items-center"
                      style={{ margin: "auto" }}
                    >
                      {images.map((image, index) => (
                        <div
                          key={index}
                          className="p-1 relative group"
                          style={{
                            border: "3px dashed rgb(87 87 89)",
                            width: "150px",
                          }}
                        >
                          <label htmlFor={`upload-${index}`}>
                            {image ? (
                              <Image
                                src={image}
                                width={100}
                                height={100}
                                alt={`Uploaded Image ${index + 1}`}
                                className="w-full h-[150px] object-contain"
                              />
                            ) : (
                              <Image
                                width={100}
                                height={100}
                                src="/images/imageplaceholder.png"
                                alt={`Placeholder ${index + 1}`}
                                className="w-full h-[150px] object-cover"
                              />
                            )}
                          </label>

                          {image && (
                            <div
                              className="absolute top-0 bottom-0 left-0 right-0 items-center justify-center hidden cursor-pointer group-hover:flex"
                              onClick={() => handleRemoveImage(index)}
                            >
                              <CiTrash size={30} color="red" />
                            </div>
                          )}

                          <input
                            id={`upload-${index}`}
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={(e) => handleImageChange(e, index)}
                          />
                        </div>
                      ))}
                    </div>
                    <p>
                      <b className="text-dark-green">Note:</b> Upload 5 clear
                      photos of front, back, side, close-up of features, and any
                      imperfections for transparency.
                    </p>
                  </div>

                  {/* <div className="w-full">
                    <div
                      className="flex flex-col md:flex-row  gap-4 mt-2 w-full"
                      style={{ margin: "auto" }}
                    >
                      {images.map((image, index) => (
                        <div
                          key={index}
                          className="p-1"
                          style={{
                            border: "3px dashed rgb(87 87 89)",
                            width: "150px",
                          }}
                        >
                          <label htmlFor={`upload-${index}`}>
                            {image ? (
                              <img
                                src={image}
                                alt={`Uploaded Image ${index + 1}`}
                                className="w-full h-full object-contain h-[150px]"
                              />
                            ) : (
                              <img
                                src="/images/imageplaceholder.png"
                                alt={`Placeholder ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </label>
                          <input
                            id={`upload-${index}`}
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={(e) => handleImageChange(e, index)}
                          />
                        </div>
                      ))}
                    </div>
                    <p>
                      <b className=" text-dark-green">Note:</b> Upload 5 clear
                      photos of front, back, side, close-up of features, and any
                      imperfections for transparency.
                    </p>
                  </div> */}
                </div>

                <div className="flex justify-center mt-6">
                  <Button
                    type="success"
                    text="Send Message"
                    loading={sendLoading}
                    onClick={handleSubmit}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showShippingCalculateModal && (
        <>
          <div className="relative">
            <div className="fixed  inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
              <div className="p-5">
                <div
                  className="bg-black p-4 rounded-lg relative max-w-[40rem] max-h-[90vh] overflow-auto mt-3"
                  // style={{
                  //   boxShadow: "1px 1px 10px 2px green",
                  // }}
                >
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
                      className=" cursor-pointer mb-[12px] max-w-[50%] md:max-w-[100%] lg:max-w-[100%] xl:max-w-[100%]"
                    />
                  </div>

                  <h2 className="text-[0.8rem] md:text-lg font-semibold my-1 text-center">
                    <p className="text-bright-green  leading-tight uppercase">
                      - Congratulations -
                    </p>
                    <p className="text-bright-green  leading-tight ">
                      - Your Offer has been accepted -
                    </p>{" "}
                    <p className="text-bright-green  leading-tight ">
                      - Please provide package information -
                    </p>
                  </h2>

                  <>
                    {showShippingCalculateModal && (
                      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                        <div className="p-5">
                          <div className="bg-black p-4 rounded-lg relative max-w-[40rem] max-h-[90vh] overflow-auto mt-3">
                            <button
                              onClick={handleClosePopup}
                              className="absolute top-2 right-2 text-white font-bold"
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

                            <h2 className="text-[0.8rem] md:text-lg font-semibold my-1 text-center">
                              <p className="text-bright-green leading-tight uppercase">
                             - Calculate Shipping Charges -
                              </p>
                              
                            </h2>

                            {/* Package Information Inputs */}
                            <div className="flex justify-center">
                              <h2
                                className="text-lg font-semibold mb-2"
                                style={{ color: "rgb(7, 248, 24)" }}
                              >
                                Package Information
                              </h2>
                            </div>

                            <div className="pb-3">
                              {/* Item Price */}
                         

                              {/* Weight Input */}
                              <div className="flex flex-col md:flex-row items-start md:items-center mb-2">
                                <label
                                  className="mr-3"
                                  style={{
                                    width: "70%",
                                    fontSize: "16px",
                                    fontWeight: "600",
                                  }}
                                >
                                  Weight
                                </label>
                                <div className="flex w-full">
                                  <input
                                    name="weight"
                                    onChange={handleInputChange}
                                    type="text"
                                    value={uspsData.weight}
                                    placeholder="Enter Weight"
                                    className="border border-gray-300 p-2 focus:outline-none focus:ring-2 w-3/4 text-black"
                                  />
                                  <select
                                    name="weightUnit"
                                    onChange={handleInputChange}
                                    value={uspsData.weightUnit}
                                    className="border border-gray-300 p-2 ml-1 focus:outline-none focus:ring-2 w-1/4 text-black"
                                  >
                                    <option value="kg">kg</option>
                                    <option value="g">g</option>
                                    <option value="lbs">lbs</option>
                                    <option value="oz">oz</option>
                                  </select>
                                </div>
                              </div>

                              {/* Dimensions Input */}
                              <div className="flex flex-col md:flex-row items-start md:items-center mb-2">
                                <label
                                  className=""
                                  style={{
                                    width: "89%",
                                    fontSize: "16px",
                                    fontWeight: "600",
                                  }}
                                >
                                  Dimension{" "}
                                  <span className="text-[10px]">
                                    (L x W x H) inches
                                  </span>
                                </label>
                                <div className="flex items-center gap-2">
                                  <input
                                    name="length"
                                    onChange={handleInputChange}
                                    value={uspsData.length}
                                    type="number"
                                    placeholder="0"
                                    min={0}

                                    className="border border-gray-300 p-2 focus:outline-none focus:ring-2 w-full text-black"
                                  />
                                  X
                                  <input
                                    name="width"
                                    onChange={handleInputChange}
                                    value={uspsData.width}
                                    type="number"
                                    placeholder="0"
                                    min={0}

                                    className="border border-gray-300 p-2 focus:outline-none focus:ring-2 w-full text-black"
                                  />
                                  X
                                  <input
                                    name="height"
                                    onChange={handleInputChange}
                                    value={uspsData.height}
                                    type="number"
                                    placeholder="0"
                                    min={0}
                                    className="border border-gray-300 p-2 focus:outline-none focus:ring-2 w-full text-black"
                                  />
                                </div>
                              </div>

                              {/* Calculate Button & Shipping Price Display */}
                              <div className="flex flex-col justify-center items-center">
                                <Button
                                  text="Calculate Shipping Rate"
                                  type="success"
                                  onClick={handleUspsPostRequest}
                                  loading={checkRate}
                                />
                                {uspsShippingRate !== null && (
                                  <p className="mt-3 text-lg font-semibold text-bright-green">
                                    Shipping Charges: ${uspsShippingRate}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default isAuth(GotItItem);
