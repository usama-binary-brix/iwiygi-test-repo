"use client";
import isAuth from "@/components/auth/isAuth";
import { FC, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import React from "react";
import Loader from "@/components/Loader";
import { toast } from "sonner";
import BackStep from "@/components/backStep/BackStep";
import Button from "@/components/button/Button";
import { GrFormView } from "react-icons/gr";

interface Contact {
  id: number;
  fullname: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
}

const AdminContacts: FC = () => {
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [listingsPerPage, setListingsPerPage] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const router = useRouter();

  const options = [10, 30, 50, 70, 100];

  const filteredContacts = contacts.filter((contact) =>
    contact.fullname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastListing = currentPage * listingsPerPage;
  const indexOfFirstListing = indexOfLastListing - listingsPerPage;
  const currentContacts = filteredContacts.slice(
    indexOfFirstListing,
    indexOfLastListing
  );

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredContacts.length / listingsPerPage)) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleItemsPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setCurrentPage(1);
    setListingsPerPage(Number(event.target.value));
  };

  const getContactsList = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API}/api/contact`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data, "contacts data");
      setContacts(response.data);
    } catch (error) {
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getContactsList();
  }, []);

  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);

  const handleViewMessage = (message: string) => {
    setSelectedMessage(message);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setSelectedMessage(null);
    setIsPopupOpen(false);
  };

  return (
    <div className="p-4">
      <div className="text-2xl sm:text-3xl font-bold  mb-4 flex gap-3 justify-between items-center mt-3">
        <BackStep href="/" />
        <span>All Contacts</span>
        <div></div>
      </div>
      <hr className="border-bright-green mt-6 border-2 w-full" />
      {loading && <Loader />}
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <div className="flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 mt-3">
          <label htmlFor="table-search" className="sr-only">
            Search
          </label>
          <div className="relative">
            <input
              type="text"
              id="table-search-users"
              className="block p-2 ps-10 text-sm text-white border border-gray-600 rounded-lg w-80 bg-[#374151]"
              placeholder="Search with contact name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 border">
          <thead className="text-xs text-[#9ca3af] uppercase bg-[#374151]">
            <tr>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                Message
              </th>
              <th scope="col" className="px-6 py-3">
                Date
              </th>
              {/* <th scope="col" className="px-6 py-3">
                Actions
              </th> */}
            </tr>
          </thead>
          <tbody>







            
            {!loading &&
              filteredContacts.map((contact) => (
                <tr
                  key={contact.id}
                  className="border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-[#1f2937] dark:hover:bg-gray-600 text-white"
                >
                  <td className="px-6 py-4">{contact.fullname}</td>
                  <td className="px-6 py-4">{contact.email}</td>
                  <td className="px-6 py-4 truncate max-w-xs">
                    {contact.message}
                  </td>
                  <td className="px-6 py-4">
                    {new Date(contact.createdAt).toLocaleDateString()}
                  </td>
                  {/* <td className="px-6 py-4">
                    <button
                      className={`text-black bg-dark-green hover:bg-bright-green focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 `}
                    >
                      <GrFormView className="text-[1.2rem]" /> View
                    </button>
                  </td> */}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default isAuth(AdminContacts);
