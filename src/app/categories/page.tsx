"use client";
import isAuth from "@/components/auth/isAuth";
import { FC, useState, useEffect } from "react";
import axios from "axios";
import React from "react";
import { categories } from "@/utils/categories";
// import { useRouter } from 'next/navigation';
import Loader from "@/components/Loader";
import Image from "next/image";
import { toast } from "sonner";
import TextInput from "@/components/Form/TextInput";
import { IoClose } from "react-icons/io5";
import PageHeading from "@/components/generic/PageHeading";
import BackStep from "@/components/backStep/BackStep";
import Button from "@/components/button/Button";
import { FaEdit } from "react-icons/fa";

interface Categories {
  id: number;
  name: string;
  status: boolean;
  isPopular: boolean;
}
interface Category {
  id: number | null;
  name: string;
  status: boolean;
  isPopular: boolean;
}

const Categories: FC = () => {
  const [loading, setLoading] = useState(true);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [categories, setCategories] = useState<Categories[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [listingsPerPage, setListingsPerPage] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const options = [10, 30, 50, 70, 100];
  const [categoryData, setCategoryData] = useState<Category>({
    id: null,
    name: "",
    status: false,
    isPopular: false,
  });

  const filteredCategories = categories.filter((categories) =>
    categories.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastListing = currentPage * listingsPerPage;
  const indexOfFirstListing = indexOfLastListing - listingsPerPage;
  const currentCategories = filteredCategories.slice(
    indexOfFirstListing,
    indexOfLastListing
  );
  // const currentCategories = categories.slice(
  //   indexOfFirstListing,
  //   indexOfLastListing
  // );

  const handleNextPage = () => {
    if (currentPage < Math.ceil(categories.length / listingsPerPage)) {
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

  const getCategoriesList = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API}/api/categories/categoriesList`
      );
      if (response.data.status === 200) {
        setLoading(false);
        setCategories(response?.data?.data);
      }
    } catch (error) {
      toast.error("Something went wrong please try again after sometime.");
    }
  };

  const handleClosePopup = () => {
    setShowEditPopup(false);
  };
  const editCategory = (category: any) => {
    setIsEdit(true);
    setCategoryData(category);
    setShowEditPopup(true);
  };
  const addCategory = () => {
    setIsEdit(false);
    setCategoryData({
      ...categoryData,
      id: null,
      name: "",
      status: false,
      isPopular: false,
    });
    setShowEditPopup(true);
  };
  const handleCategory = async () => {
    try {
      let accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        toast.error("You don't have permission to Access to section");
        return;
      }
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/api/categories/createCategory`,
        categoryData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data.status === 201) {
        toast.success(response?.data?.message);
        setShowEditPopup(false);
        getCategoriesList();
      } else if (response.data.status === 200) {
        toast.success(response?.data?.message);
        setShowEditPopup(false);
        getCategoriesList();
      }
    } catch (err) {}
  };

  useEffect(() => {
    getCategoriesList();
  }, []);

  return (
    <div className="p-4">
      <>
        <div className="text-2xl sm:text-3xl font-bold  mb-4 flex gap-3 justify-between items-center mt-3">
          <BackStep href="/" />
          <span>All Categories</span>

          <button
            type="button"
            onClick={addCategory}
            className="bg-bright-green flex items-center justify-center gap-2 px-3 text-black text-base  font-bold py-2 w-[fit-content] rounded-md text-center"
          >
            Add New Category
          </button>
        </div>

        <hr className="border-bright-green mt-6 border-2 w-full" />
        {loading && <Loader />}
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
                placeholder="Search with category name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 border">
            <thead className="text-xs text-[#9ca3af] uppercase bg-[#374151]">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Category Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Popular Category
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
                currentCategories.map((category, ind) => {
                  return (
                    <tr
                      key={ind}
                      className=" border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-[#1f2937] dark:hover:bg-gray-600 text-white"
                    >
                      <td className="flex items-center px-6 py-4  whitespace-nowrap text-white">
                        {category.name}
                      </td>

                      <td className="px-6 py-2">
                        <div className="flex items-center">
                          <div
                            className={`h-2.5 w-2.5 rounded-full ${
                              category.isPopular
                                ? "bg-bright-green"
                                : "bg-red-800"
                            } me-2`}
                          ></div>
                          {category.isPopular
                            ? "Popular Category"
                            : "Normal Category"}
                        </div>
                      </td>
                      <td className="px-6 py-2">
                        <div className="flex items-center">
                          <div
                            className={`h-2.5 w-2.5 rounded-full ${
                              category.status ? "bg-bright-green" : "bg-red-800"
                            } me-2`}
                          ></div>
                          {category.status ? "Activated" : "Deactivated"}
                        </div>
                      </td>
                      <td className="px-6 py-2">
                        <div className="flex justify-end items-center gap-2">
                          <Button
                            icon={<FaEdit />}
                            text="Edit Category"
                            type={"success"}
                            onClick={() => editCategory(category)}
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
          currentCategories.map((category: any) => {
            return (
              <div key={category.id} className="mt-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="text-[20px] text-bright-green ">
                    {category.name}
                  </div>

                  <div className="flex flex-row items-center gap-4">
                    <button
                      onClick={() => editCategory(category)}
                      className="flex flex-col items-center bg-green-800 px-[20px] py-[8px]"
                    >
                      <div className=" font-bold text-bright-white">
                        Edit Category
                      </div>
                    </button>

                    <div
                      className={`flex flex-col items-center px-[20px] py-[8px] ${category.status ? "bg-bright-green" : "bg-red-800"
                        }`}
                    >
                      <div
                        className={` font-bold ${category.status ? "text-black" : "text-bright-green"
                          }`}
                      >
                        {category.status ? "Activated" : "Deactivated"}
                      </div>
                    </div>
                    <div
                      className={`flex flex-col items-center rounded px-[20px] py-[8px] ${category.isPopular ? "bg-bright-green" : "bg-red-800"
                        }`}
                    >
                      <div
                        className={` font-bold ${category.isPopular
                          ? "text-black"
                          : "text-bright-green"
                          }`}
                      >
                        {category.isPopular
                          ? "Popular Category"
                          : "Normal Category"}
                      </div>
                    </div>
                  </div>
                </div>

                <hr className="border-bright-green mt-6 border-2 w-full" />


              </div>
            );
          })} */}
        {showEditPopup && (
          <div
            style={{ transform: "translate(-50%, -50%)", zIndex: "1" }}
            className="fixed bg-black top-1/2 left-1/2 border-2 border-bright-green w-[90%] md:w-[40%]"
          >
            <div className="bg-black p-4 rounded-lg relative">
              <button
                className="absolute top-2 right-2 text-white-600 font-bold"
                onClick={handleClosePopup}
              >
                <IoClose className="text-[2rem]" />
              </button>
              <h2 className="text-xl font-semibold mb-4">
                {isEdit ? "Edit" : "Add"} Category
              </h2>
              <TextInput
                label="Title"
                labelClassName=" font-normal mb-4"
                value={categoryData?.name}
                onChange={(e) =>
                  setCategoryData({
                    ...categoryData,
                    name: e.target.value,
                  })
                }
              />
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="mt-4 flex items-center gap-5">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      value=""
                      className="sr-only peer"
                      checked={categoryData?.status}
                      onChange={() =>
                        setCategoryData({
                          ...categoryData,
                          status: !categoryData.status,
                        })
                      }
                    />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                    <span className="ms-3 text-sm font-medium text-bright-green-900 dark:text-gray-300">
                      Status
                    </span>
                  </label>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      value=""
                      className="sr-only peer"
                      checked={categoryData?.isPopular}
                      onChange={() =>
                        setCategoryData({
                          ...categoryData,
                          isPopular: !categoryData.isPopular,
                        })
                      }
                    />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                    <span className="ms-3 text-sm font-medium text-bright-green-900 dark:text-gray-300">
                      Is Popular
                    </span>
                  </label>
                </div>
              </div>
              <div className="flex w-full justify-end">
                {/* <button
                  className="bg-dark-green text-black font-bold py-3 px-5 text-[15px]  mt-1"
                  onClick={handleCategory}
                >
                  {isEdit ? "Update" : "Add"} Category
                </button> */}

                <Button
                  text={`${isEdit ? "Update" : "Add"} Category`}
                  type={"success"}
                  onClick={handleCategory}
                />
              </div>
            </div>
          </div>
        )}

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
                {Math.ceil(filteredCategories.length / listingsPerPage)}
              </span>
              <button
                onClick={handleNextPage}
                disabled={
                  currentPage ===
                  Math.ceil(filteredCategories.length / listingsPerPage)
                }
                className="px-4 py-2 bg-dark-green text-black rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </>
    </div>
  );
};

export default isAuth(Categories);
