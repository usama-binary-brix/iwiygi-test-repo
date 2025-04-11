"use client";

import Button from "@/components/button/Button";
import {
  useGetListingDetailsQuery,
  useGetSavedListingsQuery,
} from "@/store/api";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import Loader from "@/components/Loader";
import axios from "axios";
import Share from "@/components/Share";
import Head from "next/head";
import ConfirmationModal from "@/components/generic/ConfirmationModal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { IoClose } from "react-icons/io5";
import TextInput from "@/components/Form/TextInput";
import TextArea from "@/components/Form/TextArea";
import { Dropdown } from "flowbite-react";
import { FaTags } from "react-icons/fa";
import { addSavedListing, removeSavedListing } from "@/store/Slices/listingsSlice";

export interface ListingItem {
  id: string;
  title: string;
  description: string;
  slug?: string;
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
interface Category {
  id: string; // Or `number` if your IDs are numbers
  name: string;
}

const Page = () => {
  const params = useParams();
  const slug = params?.slug as string | undefined;
  const router = useRouter();
  const { data, isLoading, error, refetch } = useGetListingDetailsQuery(slug);
  const [gotItLoading, setGotItLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const dispatch = useDispatch()
  const [removeSaveLoading, setRemoveSaveLoading] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedImage1, setSelectedImage1] = useState(null);
  const [deleteAction, setDeleteAction] = useState<() => void>(() => () => {});
  const [deleteMessage, setDeleteMessage] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const User = useSelector((state: RootState) => state?.user?.user?.id);
  const role = localStorage.getItem("User");
  const userRole = role ? JSON.parse(role) : null;
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [loadingUpdateListing, setLoadingUpdateListing] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [updateFormData, setFormData] = useState<ListingItem>({
    id: "",
    title: "",
    description: "",
    featuredImage: "",
    category: "",
    slug: "",
    isSaved: false,
    price: "234",
    isApprovedByAdmin: false,
    listingPostedBy: { username: "", email: "" },
  });

  // Jab `data` backend se aaye, toh `formData` update karo
  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]); // Jab `data` change ho, tab update ho

  useEffect(() => {
    if (updateFormData?.category) {
      const category = categories.find(
        (item: any) => item.id == updateFormData.category
      );
      if (category) {
        setSelectedCategory(category.id);
        setSelectedCategoryName(category.name);
      }
    }
  }, [updateFormData, categories]);

  const [listingData, setListingData] = useState<ListingItem>({
    id: "",
    title: "",
    description: "",
    featuredImage: "",
    category: "",
    slug: "",
    isSaved: false,
    price: "234",
    isApprovedByAdmin: false,
    listingPostedBy: { username: "", email: "" },
  });
  const {
    data: savedListings,
    error: savedListingError,
    isLoading: SavedListingLoading,
    refetch: savedListingRefetch,
  } = useGetSavedListingsQuery(null);

  useEffect(() => {
    savedListingRefetch();
  }, [savedListingRefetch]);

  useEffect(() => {
    refetch();
  }, [refetch]);


  const savedListing = useSelector((state:RootState)=>state.savedListing.savedListings)

  

  const handleGotItPopup = async (id: number, listingPostedBy: any) => {
    setGotItLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setGotItLoading(false);
        return router.push("/sign-in");
      }

      router.push(`/listings/got-it/${id}`);
    } catch (error) {
      toast.error("Something went wrong! Please try again.");
    } finally {
      setGotItLoading(false);
    }
  };

  const handleSaveListing = async (id: any) => {
    setSaveLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setSaveLoading(false);
        return router.push("/sign-in");
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
        toast.success(response?.data?.message);
    dispatch(addSavedListing({listingId:id}))
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong!");
    } finally {
      setSaveLoading(false);
    }
  };
  const handleListingActivation = async (id: string) => {
    try {
      let current_user: any = localStorage.getItem("User");
      current_user = JSON.parse(current_user);
      let accessToken = localStorage.getItem("accessToken");
      if (!accessToken || (current_user && current_user.role !== "admin")) {
        toast.error("You haven't permission to access this section");
        return;
      }
      await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/listings/listingApproval/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
        .then((data) => data.json())
        .then((data) => {
          if (data.status == 200) {
            toast.success(data.message);
            router.push("/listings-for-approval");
            // GetAllListings();
          } else {
            toast.error(data.message);
          }
        });
    } catch (error) {
    } finally {
      // setLoading(false);
    }
  };

  const handleDeleteListing = async (id: string) => {
    // setModalLoading(true);
    try {
      let accessToken = localStorage.getItem("accessToken");
      let current_user: any = localStorage.getItem("User");
      current_user = JSON.parse(current_user);
      // if (!accessToken || (current_user && current_user.role !== "admin")) {
      //   toast.error("You haven't permission to access this section");
      //   return;
      // }
      await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/listings/deleteListing/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
        .then((data) => data.json())
        .then((data) => {
          if (data.code == 202) {
            // setModalLoading(false);

            toast.success(data.message);
            router.push("/all-listings");
            // GetAllListings();
          } else {
            // setModalLoading(false);

            toast.error(data.message);
          }
        });
    } catch (error) {
    } finally {
      // setLoading(false);
      // setModalLoading(false);
    }
  };

  
  const handleDeleteModal = (type: "listing" | "image", id: string) => {
    let alertMessage = "";

    if (type === "listing") {
      setDeleteAction(() => () => handleDeleteListing(id)); // Wrap function
      alertMessage = "Are you sure you want to delete this listing?";
    } else if (type === "image") {
      setDeleteAction(() => () => handleDeleteImage(id)); // Wrap function
      alertMessage = "Are you sure you want to delete this image?";
    }

    setDeleteMessage(alertMessage);
    setIsModalOpen(true);
  };

  const handleDeleteImage = async (id: string) => {
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
      // You may need to refresh the page or update the UI accordingly
    } catch (error) {
      setModalLoading(false);

      console.error("Error deleting image:", error);
    }
  };

  const handleConfirmDelete = async () => {
    if (deleteAction) {
      await deleteAction(); // Now deleteAction includes ID
      setIsModalOpen(false);
    } else {
      toast.error("Invalid delete action.");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleRemoveListing = async (id: any) => {
    try {
      setRemoveSaveLoading(true);
      let accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setRemoveSaveLoading(false);
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
        toast.success(response?.data?.message);
    dispatch(removeSavedListing(id))
        setRemoveSaveLoading(false);
      }
    } catch (error: any) {
      setRemoveSaveLoading(false);
      toast.error(error?.response?.data?.message);
    }
  };

  const handleEditListing = () => {
    setShowEditPopup(true);
    // fetchListingData();
  };

  const handleClosePopup = () => {
    setShowEditPopup(false);
  };

  const handleUpdateListing = async (id: string) => {
    setLoadingUpdateListing(true);

    try {
      let accessToken = localStorage.getItem("accessToken");
      // if (!accessToken) {
      //   console.error("Access token not found");
      //   return;
      // }

      const formData = new FormData();
      formData.append("title", updateFormData.title);
      formData.append("description", updateFormData.description);
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

        // listingRefresh();
        setShowEditPopup(false);
        window.location.reload();
        // router.push("/user-listing");
      }
    } catch (err) {
      // const error = err as AxiosError<ErrorResponse>;
      // setError(
      //   error.response?.data?.message || "An error occurred. Please try again."
      // );

      setLoadingUpdateListing(false);
    }
  };

  const getCategoriesList = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API}/api/categories/categoriesList`
      );

      if (response.status === 200) {
        setCategories(response?.data?.data);
      }
    } catch (error) {
      toast.error("Something went wrong please try again after sometime.");
    }
  };
  useEffect(() => {
    getCategoriesList();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <div className="flex items-center justify-center h-auto my-10 px-5">
        <div className="md:w-[70%] lg:w-[50%] xl:w-[30%] bg-transparent border border-bright-green rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <div className="w-auto items-center justify-center flex h-[500px] relative">
            <Image
              src={
                data?.featuredImage ||
                "https://iwiygi-assets.s3.amazonaws.com/not_found_image.png"
              }
              alt="No Image"
              className="items-center max-h-[500px] justify-center rounded-md"
              layout="fill"
              // width={500}
              // height={500}
              // objectFit="cover"
            />
          </div>

          <div className="p-5">
            <a href="#">
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-white dark:text-white">
                {data?.title}
              </h5>
            </a>
            <p className="mb-3 font-normal text-white break-words">
              {data?.description}
            </p>
            {userRole && (
              <div className="border-t mb-4 border-bright-green mt-1">{userRole.role !== "admin" && <Share slug={slug} />}</div>
            )}

            {/* If the user is the listing owner, show Edit/Delete buttons */}
            {User === data?.listingPostedBy?.id ? (
              <div className="flex gap-3">
                <Button
                  text="Edit Listing"
                  type={"success"}
                  className="w-full"
                  onClick={() => handleEditListing()}
                />
                <Button
                  text="Delete Listing"
                  type={"danger"}
                  className="w-full"
                  onClick={() => handleDeleteModal("listing", data.id)}
                  />

                {/* <Button text="Edit Listing" type="success" className="w-full" />
                <Button
                  text="Delete Listing"
                  type="danger"
                  className="w-full"
                /> */}
              </div>
            ) : userRole?.role === "admin" ? (
              // If the user is an Admin, show Admin-specific options
              data?.isApprovedByAdmin === false ? (
                <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                  <Button
                    text="Activate Listing"
                    type="success"
                    className="w-full"
                    loading={gotItLoading}
                    onClick={() => handleListingActivation(data.id)}
                  />
                  <Button
                    text="Delete Listing"
                    type="danger"
                    className="w-full"
                    loading={saveLoading}
                    onClick={() => handleDeleteListing(data.id)}
                  />
                </div>
              ) : (
                <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                  <Button
                    text="Delete Image"
                    type="danger"
                    className="w-full"
                    onClick={() => handleDeleteModal("image", data.id)}
                    loading={gotItLoading}
                  />
                  <Button
                    text="Delete Listing"
                    type="danger"
                    className="w-full"
                    loading={saveLoading}
                    onClick={() => handleDeleteModal("listing", data.id)}
                  />
                </div>
              )
            ) : (
              // Normal user view (not owner & not admin)
              <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                <Button
                  text="I've Got it"
                  type="success"
                  className="w-full"
                  loading={gotItLoading}
                  onClick={() =>
                    handleGotItPopup(data.id, data.listingPostedBy)
                  }
                />
                {/* {savedListings?.data?.some(
                  (listing: any) => listing.id == data.id
                ) ?  */}
                {savedListing.some((item) => item.listingId == data.id) ?
                (
                  <Button
                    text="Remove from Profile"
                    type="danger"
                    className="w-full"
                    loading={removeSaveLoading}
                    onClick={() => handleRemoveListing(data.id)}
                  />
                ) : (
                  <Button
                    text="Save to Profile"
                    type="danger"
                    className="w-full"
                    loading={saveLoading}
                    onClick={() => handleSaveListing(data.id)}
                  />
                )}
              </div>
            )}

            {/* {User === data?.listingPostedBy?.id ? (
              
              <div className="flex gap-3">
                <Button text="Edit Listing" type="success" className="w-full" />
                <Button
                  text="Delete Listing"
                  type="danger"
                  className="w-full"
                />
              </div>
            ) : (
             
              <>
                <Button
                  text="I've Got it"
                  type="success"
                  className="w-full"
                  loading={gotItLoading}
                  onClick={() =>
                    handleGotItPopup(data.id, data.listingPostedBy)
                  }
                />

                {savedListings?.data?.some(
                  (listing: any) => listing.id === data.id
                ) ? (
                  <Button
                    text="Remove from Profile"
                    type="danger"
                    className="w-full"
                    loading={removeSaveLoading}
                    onClick={() => handleRemoveListing(data.id)}
                  />
                ) : (
                  <Button
                    text="Save to Profile"
                    type="success"
                    className="w-full"
                    loading={saveLoading}
                    onClick={() => handleSaveListing(data.id)}
                  />
                )}
              </>
            )}

            {userRole && userRole.role === "admin" ? (
              data?.isApprovedByAdmin === false ? (
                <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                  <Button
                    text="Activate Listing"
                    type={"success"}
                    className="w-full"
                    loading={gotItLoading}
                    onClick={() => handleListingActivation(data.id)}
                  />
                  <Button
                    text="Delete Listing"
                    type={"danger"}
                    className="w-full"
                    loading={saveLoading}
                    onClick={() => handleDeleteListing(data.id)}
                  />
                </div>
              ) : (
                <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                  <Button
                    text="Delete Image"
                    type={"danger"}
                    className="w-full"
                    onClick={() => handleDeleteModal("image", data.id)}
                    loading={gotItLoading}
                  />
                  <Button
                    text="Delete Listing"
                    type={"danger"}
                    className="w-full"
                    loading={saveLoading}
                    onClick={() => handleDeleteModal("listing", data.id)}
                  />
                </div>
              )
            ) : (
              <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                <Button
                  text="I've Got it"
                  type={"success"}
                  className="w-full"
                  loading={gotItLoading}
                  onClick={() =>
                    handleGotItPopup(data.id, data.listingPostedBy)
                  }
                />

                {savedListings?.data?.some(
                  (listing: any) => listing.id === data.id
                ) ? (
                  <Button
                    text="Remove from Profile"
                    type={"danger"}
                    className="w-full"
                    loading={removeSaveLoading}
                    onClick={() => handleRemoveListing(data.id)}
                  />
                ) : (
                  <Button
                    text="Save to Profile"
                    type={"success"}
                    className="w-full"
                    loading={saveLoading}
                    onClick={() => handleSaveListing(data.id)}
                  />
                )}
              </div>
            )} */}
          </div>
        </div>
      </div>
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
                  value={updateFormData.title}
                  onChange={(e) =>
                    setFormData({ ...updateFormData, title: e.target.value })
                  }
                />
                <TextArea
                  label="Description"
                  // labelClassName="text-bright-green font-normal mb-4"
                  value={updateFormData.description}
                  onChange={(e) =>
                    setFormData({
                      ...updateFormData,
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
                          : data.featuredImage ||
                            "https://iwiygi-assets.s3.amazonaws.com/not_found_image.png"
                      }
                      alt="listing"
                      width={200}
                      height={280}
                    />
                  </div>
                </div>
                <div className="text-center flex item-center justify-center">
                  <Button
                    text="Update Listing"
                    type="success"
                    loading={loadingUpdateListing}
                    className=" text-black w-[fir-content]"
                    onClick={() => handleUpdateListing(data.id)}
                  />
                </div>
              </div>
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
    </>
  );
};

export default Page;
