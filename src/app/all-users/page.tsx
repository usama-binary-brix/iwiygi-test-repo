"use client";
import Image from "next/image";
import axios from "axios";
import { FC, useState, useEffect } from "react";
import { toast } from "sonner";
import isAuth from "@/components/auth/isAuth";
import Loader from "@/components/Loader";
import UserProfile from "@/components/generic/UserProfile";
import ConfirmationModal from "@/components/generic/ConfirmationModal";
import PageHeading from "@/components/generic/PageHeading";
import { CgProfile } from "react-icons/cg";
import Button from "@/components/button/Button";
import { IoIosWarning } from "react-icons/io";
import { MdDelete, MdDeleteOutline } from "react-icons/md";

// ADMIN PAGE

interface User {
  id: string;
  name: string;
  fullname: string;
  image: string;
  listingCount: number;
  status: string;
  isActive: boolean;
  username: string;
  email: string;
  phonenumber: string;
  state: string;
}

const AllUsers: FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [listingsPerPage, setListingsPerPage] = useState<number>(10);
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const options = [10, 30, 50, 70, 100];

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      let accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        console.error("Access token not found");
        return;
      }
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API}/api/admin/fetchAllUsers`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.status === 200) {
        setUsers(response?.data?.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAllUsers();
  }, []);
  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const indexOfLastListing = currentPage * listingsPerPage;
  const indexOfFirstListing = indexOfLastListing - listingsPerPage;
  // const currentUsers = users.slice(indexOfFirstListing, indexOfLastListing);
  const currentUsers = filteredUsers.slice(
    indexOfFirstListing,
    indexOfLastListing
  );

  const handleItemsPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setCurrentPage(1);
    setListingsPerPage(Number(event.target.value));
  };
  const handleNextPage = () => {
    if (currentPage < Math.ceil(users.length / listingsPerPage)) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const toggleUserAccount = async (userId: string) => {
    setLoadingUserId(userId);
    try {
      let accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        console.error("Access token not found");
        return;
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API}/api/admin/toggleUserAccount/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.status === 200) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId
              ? {
                  ...user,
                  status: user.status === "active" ? "suspended" : "active",
                }
              : user
          )
        );
        await fetchAllUsers();
      }
    } catch (error) {
      console.error("Error toggling user account:", error);
    } finally {
      setLoadingUserId(null);
    }
  };

  const [warningEmailLoading, setWarningEmailLoading] = useState<{
    [key: string]: boolean;
  }>({});

  const sendWarningEmail = async (receiverEmail: string, username: string) => {
    setWarningEmailLoading((prev) => ({ ...prev, [username]: true })); // Set loading for this specific user

    try {
      let accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        console.error("Access token not found");
        setWarningEmailLoading((prev) => ({ ...prev, [username]: false })); // Reset loading
        return;
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/api/mailer/sendWarningEmail`,
        {
          recieverEmail: receiverEmail,
          username: username,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Warning email sent successfully.");
      }
    } catch (error) {
      console.error("Error sending warning email:", error);
    } finally {
      setWarningEmailLoading((prev) => ({ ...prev, [username]: false })); // Reset loading
    }
  };

  const [modalLoading, setModalLoading] = useState(false);
  const [loadingState, setLoadingState] = useState<{ [key: string]: boolean }>(
    {}
  );

  const handleDeleteUser = async (userId: string) => {
    setLoadingState((prev) => ({ ...prev, [userId]: true }));
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
            setLoadingState((prev) => ({ ...prev, [userId]: false }));
            setModalLoading(false);

            toast.success(data.message);
          } else {
            setLoadingState((prev) => ({ ...prev, [userId]: false }));
            setModalLoading(false);
            toast.error(data.message);
            fetchAllUsers();
          }
        });
    } catch (error) {
      setModalLoading(false);

      setLoadingState((prev) => ({ ...prev, [userId]: true }));

      toast.error("Something Went Wrong");
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteAction, setDeleteAction] = useState<() => void>(() => () => {});
  const [deleteMessage, setDeleteMessage] = useState<string>("");

  const handleDelete = (id: string, type: "listing" | "user") => {
    let deleteAction: any;
    let message = "";

    if (type === "listing") {
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
    setIsModalOpen(false); // Only close if not loading
  };

  const handleConfirmDelete = async () => {
    await deleteAction(); // Call the appropriate delete action
    setIsModalOpen(false);
    fetchAllUsers();
  };

  return (
    <div className="p-4">
      <>
        {loading && <Loader />}
        <PageHeading
          backurl={"/"}
          heading={"All Users"}
          btnurl={"/all-listings"}
          btnheading={"All Listings"}
        />
        <hr className="border-bright-green mt-6 border-2 w-full" />

        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <div className="flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 mt-3">
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
                placeholder="Search with username"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 border">
            <thead className="text-xs text-[#9ca3af] uppercase bg-[#374151]">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Users
                </th>
                {/* <th scope="col" className="px-6 py-3">
                  Phone Number
                </th> */}
                <th scope="col" className="px-6 py-3">
                  State
                </th>
                <th scope="col" className="px-6 py-3">
                  Total Listing
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
                <th scope="col" className="px-8 py-3 text-end">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {!loading &&
                currentUsers.map((user, index) => {
                  return (
                    <tr
                      key={index}
                      className=" border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-[#1f2937] dark:hover:bg-gray-600 text-white"
                    >
                      <th
                        scope="row"
                        className="flex items-center px-6  whitespace-nowrap text-white"
                      >
                        {/* <img className="w-10 h-10 rounded-full" src="/docs/images/people/profile-picture-1.jpg" alt="Jese image" /> */}
                        <UserProfile
                          userid={user.id}
                          username={user.username}
                          // fullName={user.fullname}
                          email={user.email}
                          showDeleteButton={false}
                        />
                      </th>
                      {/* <td className="px-6 py-4">{user?.phonenumber}</td> */}
                      <td className="px-6 py-4">{user?.state}</td>
                      <td className="px-6 py-4">({user.listingCount})</td>
                      <td className="px-6 py-4">
                        <div
                          className="flex items-center"
                          onClick={() => toggleUserAccount(user.id)}
                          style={{
                            cursor:
                              loadingUserId === user.id
                                ? "not-allowed"
                                : "pointer",
                          }}
                        >
                          <div
                            className={`h-2.5 w-2.5 rounded-full ${
                              user.isActive ? "bg-bright-green" : "bg-red-800"
                            } me-2`}
                          ></div>{" "}
                          {user.isActive ? "Activated" : "Restricted"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end items-center gap-2">
                          <Button
                            icon={<IoIosWarning />}
                            text="Send Warning Email"
                            type="danger"
                            loading={warningEmailLoading[user.username]}
                            className="lg:text-sm"
                            onClick={() =>
                              sendWarningEmail(user.email, user.username)
                            }
                          />
                          <Button
                            icon={<MdDelete />}
                            text="Delete"
                            type="danger"
                            loading={loadingState[user.id]}
                            className=" lg:text-sm"
                            onClick={() => handleDelete(user.id, "user")}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        {/* {!loading &&
          currentUsers.map((user) => {
            return (
              <div key={user.id} className="">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="flex flex-row flex-1 items-center gap-4">
                    <UserProfile
                      userid={user.id}
                      username={user.username}
                      fullName={user.fullname}
                      email={user.email}
                      showDeleteButton={false}
                    />

                    <div className="text-[16px] ">
                      Total Listings
                      <span className="text-bright-green">
                        ({user.listingCount})
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-row items-center gap-4">
                    <button
                      onClick={() =>
                        sendWarningEmail(user.email, user.username)
                      }
                      className="flex flex-col items-center bg-red-800 px-[20px] py-[8px]"
                    >
                      <div className=" font-bold text-bright-green">
                        Send Warning Email
                      </div>
                    </button>

                    <div
                      className={`flex flex-col items-center px-[20px] py-[8px] ${user.isActive ? "bg-bright-green" : "bg-red-800"
                        }`}
                      onClick={() => toggleUserAccount(user.id)}
                      style={{
                        cursor:
                          loadingUserId === user.id ? "not-allowed" : "pointer",
                      }}
                    >
                      <div
                        className={` font-bold ${user.isActive ? "text-black" : "text-bright-green"
                          }`}
                      >
                        {user.isActive ? "Activated" : "Restricted"}
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(user.id, "user")}
                      className="flex flex-col items-center bg-red-800 px-[20px] py-[8px]"
                    >
                      <div className=" font-bold text-bright-green">
                        Delete{" "}
                      </div>
                    </button>
                  </div>
                </div>

                <hr className="border-bright-green mt-3 border w-full" />
              </div>
            );
          })} */}

        {!loading && (
          <div className="flex flex-col md:flex-row gap-5 justify-center items-center mt-4 md:float-right">
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
                {Math.ceil(filteredUsers.length / listingsPerPage)}
              </span>
              <button
                onClick={handleNextPage}
                disabled={
                  currentPage ===
                  Math.ceil(filteredUsers.length / listingsPerPage)
                }
                className="px-4 py-2 bg-dark-green text-black rounded disabled:opacity-50"
              >
                Next
              </button>
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
    </div>
  );
};

export default isAuth(AllUsers);
