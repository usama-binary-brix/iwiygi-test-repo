"use client";
import ListingsAdmin from "@/components/ListingsAdmin";
import { FC, useEffect, useState } from "react";
import Loader from "@/components/Loader";
import Image from "next/image";
import TextInput from "@/components/Form/TextInput";
import TextArea from "@/components/Form/TextArea";
import { toast } from "sonner";
import { ListingAdminProps } from "@/components/ListingAdmin";
import isAuth from "@/components/auth/isAuth";
import MegaListView from "@/components/generic/MegaListView";
import ConfirmationModal from "@/components/generic/ConfirmationModal";
import Link from "next/link";
import BackStep from "@/components/backStep/BackStep";
import PageHeading from "@/components/generic/PageHeading";
import ButtonLoading from "@/components/generic/ButtonLoading";

const ListingsForApproval: FC = () => {
  const [listings, setListings] = useState<ListingAdminProps[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [listingsPerPage, setListingsPerPage] = useState<number>(10);
  const [loading, setLoading] = useState(false);
  const options = [10, 30, 50, 70, 100];
  const [modalLoading, setModalLoading] = useState(false);
  const [loadingState, setLoadingState] = useState<{ [key: string]: boolean }>({});
    const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    GetAllListings();
  }, []);

  const handleItemsPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setListingsPerPage(Number(event.target.value));
  };

  const GetAllListings = async () => {
    try {
      setLoading(true);
      let accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        toast.error("You haven't permission to access this section");
        return;
      }
      let api = `${process.env.NEXT_PUBLIC_API}/api/listings/listingsForApproval`;
      await fetch(api, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((data) => data.json())
        .then((data) => {
          if (data.status == 200) setListings(data.data);
          else toast.error(data.message);
        });
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
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
            GetAllListings();
          } else {
            toast.error(data.message);
          }
        });
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  const handleSendWarning = async (id: string, userId: any) => {
    try {
      setLoadingState((prev) => ({ ...prev, [id]: true }));
  
      let current_user = localStorage.getItem("User");
      let accessToken = localStorage.getItem("accessToken");
  
      if (!accessToken || !current_user) {
        toast.error("Unauthorized access");
        return;
      }
  
      // current_user = JSON.parse(current_user);
      // if (current_user.role !== "admin") {
      //   toast.error("You don't have permission to access this section");
      //   return;
      // }
  
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/admin/warningEmail`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            listingId: id,
            userId: userId,
          }),
        }
      );
  
      const data = await response.json();
  
      if (response.ok) {
        toast.success(data.message);
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error sending warning email:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoadingState((prev) => ({ ...prev, [id]: false }));
    }
  };
  

  const handleDeleteUser = async (userId: string) => {
    setModalLoading(true);

    try {
      let current_user: any = localStorage.getItem("User");
      current_user = JSON.parse(current_user);
      let accessToken = localStorage.getItem("accessToken");
      if (!accessToken || (current_user && current_user.role !== "admin")) {
        toast.error("You haven't permission to access this section");
        return;
      }
      await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/admin/deleteUserWithListing/${userId}`,
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
          if (data.status == 200) {
            setModalLoading(false);

            toast.success(data.message);
            GetAllListings();
          } else {
            setModalLoading(false);

            toast.error(data.message);
          }
        });
    } catch (error) {
      setModalLoading(false);

      toast.error("Something Went Wrong");
    }
  };
  const handleDeleteListing = async (id: string) => {
    setModalLoading(true);
    try {
      let accessToken = localStorage.getItem("accessToken");
      let current_user: any = localStorage.getItem("User");
      current_user = JSON.parse(current_user);
      if (!accessToken || (current_user && current_user.role !== "admin")) {
        toast.error("You haven't permission to access this section");
        return;
      }
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
            setModalLoading(false);

            toast.success(data.message);
            GetAllListings();
          } else {
            setModalLoading(false);

            toast.error(data.message);
          }
        });
    } catch (error) {
    } finally {
      setLoading(false);
      setModalLoading(false);
    }
  };

  const indexOfLastListing = currentPage * listingsPerPage;
  const indexOfFirstListing = indexOfLastListing - listingsPerPage;
  const currentListings = listings.slice(
    indexOfFirstListing,
    indexOfLastListing
  );

  const filteredListings = currentListings.filter((list) =>
    list.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNextPage = () => {
    if (currentPage < Math.ceil(listings.length / listingsPerPage)) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteAction, setDeleteAction] = useState<() => void>(() => () => {});
  const [deleteMessage, setDeleteMessage] = useState<string>("");

  const handleDelete = (id: string, type: "listing" | "user") => {
    let deleteAction: any;
    let message = "";

    if (type === "listing") {
      deleteAction = () => handleDeleteListing(id);
      message = "Are you sure you want to delete this listing?";
    } else if (type === "user") {
      deleteAction = () => handleDeleteUser(id);
      message = "Are you sure you want to delete this user?";
    }

    setDeleteAction(() => deleteAction);
    setDeleteMessage(message); // Set the message based on type
    setIsModalOpen(true); // Open the modal
  };

  const handleCloseModal = () => {
    if (!loading) {
      setIsModalOpen(false); // Only close if not loading
    }
  };

  const handleConfirmDelete = async () => {
    await deleteAction(); // Call the appropriate delete action
    setIsModalOpen(false);
  };
  return (
    <div className="p-4">
      <>
        {loading && <Loader />}
        {!loading && (
          <>
            <PageHeading
              backurl={"/"}
              heading={"Pending for Approval"}
              btnurl={"/all-listings"}
              btnheading={"All Listings"}
            />
{listings?.length > 0 && (
          <div className="flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 mt-3">
          <label htmlFor="table-search" className="sr-only">
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 "
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="text"
              id="table-search-users"
              className="block p-2 ps-10 text-sm text-white border border-gray-600 rounded-lg w-80 bg-[#374151]"
              placeholder="Search with Listing Name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

)}
          </>
        )}

        {!loading &&
          filteredListings.map((listing, index) => {
            return (
              <>
                  <div className="mt-4">
                    <MegaListView
                      id={listing.id}
                      img={listing.featuredImage}
                      title={listing.title}
                      listingPostedBy={listing.listingPostedBy}
                      description={listing.description}
                      slug={listing.slug}
                      // isApprovedByAdmin={
                      //   listing?.isApprovedByAdmin ? "Approved" : "Processing"
                      // }
                      buttons={[
                        {
                          onClick: () => handleListingActivation(listing.id), // Wrap the async function
                          title: "Activate Listing",
                          type: "success",
                        },
                        {
                          onClick: () => handleSendWarning(listing.id, listing.listingPostedBy.id), // Wrap the async function
                          title: "Send Warning",
                          type: "warning",
                          loading: loadingState[listing.id] || false,
                        },

                        {
                          onClick: () => handleDelete(listing.id, "listing"), // Wrap the async function
                          title: "Delete Listing",
                          type: "danger",
                        },
                      
                    
                      ]}
                    />
                  </div>
              </>
            );
          })}

        {!loading && listings?.length === 0 && (
          <div className="text-lg sm:text-xl mt-10">
            No Listing Found For Approval.{" "}
          </div>
        )}
        {!loading && listings?.length !== 0 && (
          <div className="flex flex-col md:flex-row justify-center items-center gap-5 mt-4 md:float-right">
            <div className="text-white-700 mr-5">
              <label htmlFor="itemsPerPage" className="mr-2">
                Items per page:
              </label>
              <select
                id="itemsPerPage"
                value={listingsPerPage}
                onChange={handleItemsPerPageChange}
                className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              >
                {options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-dark-green text-black rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                Page {currentPage} of{" "}
                {Math.ceil(listings.length / listingsPerPage)}
              </span>
              <button
                onClick={handleNextPage}
                disabled={
                  currentPage === Math.ceil(listings.length / listingsPerPage)
                }
                className="px-4 py-2 bg-dark-green text-black rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        message={deleteMessage} // Show the appropriate message
        loading={modalLoading}
      />
    </div>
  );
};

export default isAuth(ListingsForApproval);
