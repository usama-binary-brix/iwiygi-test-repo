"use client";

import TextArea from "@/components/Form/TextArea";
import { Dropdown } from "flowbite-react";
import { FaTags } from "react-icons/fa6";
import TextInput from "@/components/Form/TextInput";
import { FC, useCallback, useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "sonner";
import UploadImageForm from "./_components/UploadImageForm";
import isAuth from "@/components/auth/isAuth";
import { useRouter } from "next/navigation";
import BackStep from "@/components/backStep/BackStep";
import ListingButtons from "@/components/generic/ListingButtons";
import { IoAdd, IoHeartOutline, IoListOutline } from "react-icons/io5";
import { CgUserList } from "react-icons/cg";
import ButtonLoading from "@/components/generic/ButtonLoading";
import Button from "@/components/button/Button";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import CameraCapture from "./_components/UploadImageForm/CameraCapture";
import { FiCamera } from "react-icons/fi";

interface Category {
  id: string;
  name: string;
  status: boolean;
}

const CreateListing: FC = () => {
  const [pdfImage, setPdfImage] = useState<File | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCameraOpen, setIsCameraOpen] = useState(false);


  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const User = useSelector((state: RootState) => state.user.user);

  const [searchTerm, setSearchTerm] = useState("");

  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredCategories = categories.filter(
    (item) =>
      item.status === true &&
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
  const handlePdfImageChange = useCallback((files: File | null) => {
    setPdfImage(files);
  }, []);

  useEffect(() => {
    getCategoriesList();
  }, []);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    setLoading(true);
    if (title.length <= 10) {
      toast.error("Title must be more than 15 characters.");
      setLoading(false);
      return;
    }

    if (description.length <= 20) {
      toast.error("Description must be more than 20 characters.");
      setLoading(false);
      return;
    }

    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        console.error("Access token not found");
        return;
      }

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", "222");
      formData.append("category", selectedCategory);
      if (pdfImage) {
        formData.append("featuredImage", pdfImage);
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/api/listings/createlisting`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 201) {
        toast.success(
          <div>
            List Created successfully.
            <a
              href="/user-listing"
              className="underline text-dark-green font-bold"
              onClick={(e) => e.stopPropagation()}
            >
              Review Your Listing
            </a>
          </div>
        );

        setTitle("");
        setDescription("");
        setSelectedCategory("");
        setSelectedCategoryName("");
        setPdfImage(null);
      }
    } catch (error: any) {
      const responseData = error.response?.data;
      if (responseData?.error !== "Forbidden") {
        toast.error(responseData?.message);
      } else {
        toast.error(" Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="p-4 mb-5">
      <div>
        <div className="container-fluid mx-1">
         
   <div className="hidden md:block">
   <div className="text-lg sm:text-2xl font-bold  mb-4  flex gap-3 justify-between items-center mt-3">
            <BackStep href="/" />
            <span className="text-center">Create Your Listing... <br/> For the Item You Want to Buy</span>
            <div className="flex items-center gap-2">
              <ListingButtons
                icon={<IoListOutline />}
                url={"/listings/search"}
              />
              <ListingButtons icon={<CgUserList />} url={"/user-listing"} />
              <ListingButtons
                icon={<IoHeartOutline />}
                url={"/saved-listings"}
              />
              <ListingButtons icon={<IoAdd />} url={"/create-listing"} />
            </div>
          </div>
   </div>
<div className="md:hidden">
  
<span className="text-lg sm:text-2xl font-bold text-center flex items-center justify-center">Create Your Listing... <br/> For the Item You Want to Buy</span>
          <div className="text-lg sm:text-2xl font-bold  mb-4  flex gap-3 justify-between items-center mt-3">
            <BackStep href="/" />

            <div className="flex items-center gap-2">
              <ListingButtons
                icon={<IoListOutline />}
                url={"/listings/search"}
              />
              <ListingButtons icon={<CgUserList />} url={"/user-listing"} />
              <ListingButtons
                icon={<IoHeartOutline />}
                url={"/saved-listings"}
              />
              <ListingButtons icon={<IoAdd />} url={"/create-listing"} />
            </div>
          </div>

</div>




          <form
            className="flex justify-center flex-col items-center"
          >
            <style>
              {`
          .transition-opacity {
            overflow: auto;
            height: 20rem;
          }
        `}
            </style>{" "}
            <div className="flex flex-col gap-6 w-full md:max-w-[70%] lg:max-w-[65%] xl:max-w-[60%]">
              <div>
                <TextInput
                  label={`Item I Want`}
                  placeholder="Enter Item Name"
                  containerClassName="gap-0"
                  className="w-full  text-[18px]"
                  note="Note: "
                  noteText="Use a clear,specific title for what you're looking for."

                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="flex flex-col lg:flex-row lg:items-center lg:gap-9 w-full">
                <label className="flex ml-1 font-bold text-lg sm:text-xl  lg:w-[50%]">
                  Pick your Category
                </label>
                <div className="relative w-full" ref={dropdownRef}>
                  {/* Dropdown Trigger */}
                  <div
                    className="flex items-center bg-white text-black h-[45px] w-full cursor-pointer px-2 border border-gray-300"
                    onClick={() => setIsOpen(!isOpen)}
                  >
                    <div className="text-black text-[14px] font-semibold truncate">
                      {selectedCategoryName
                        ? selectedCategoryName
                        : "Select Item Category"}
                    </div>
                  </div>

                  {/* Dropdown Menu */}
                  {isOpen && (
                    <div className="absolute w-full bg-white shadow-md border border-gray-300 mt-1 z-10">
                      {/* Search Input */}
                      <div className="p-2">
                        <input
                          type="text"
                          placeholder="Search category..."
                          className="w-full border text-black border-gray-300 p-2 rounded"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>

                      {/* Categories List */}
                      <ul className="max-h-48 overflow-y-auto">
                        {filteredCategories.length > 0 ? (
                          filteredCategories.map((item) => (
                            <li
                              key={item.id}
                              className="p-2 cursor-pointer text-black hover:bg-bright-green"
                              onClick={() => {
                                setSelectedCategory(item.id.toString());
                                setSelectedCategoryName(item.name);
                                setIsOpen(false);
                              }}
                            >
                              {item.name}
                            </li>
                          ))
                        ) : (
                          <li className="p-2 text-black">
                            No categories found
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
                {/* <Dropdown
                  label=""
                  renderTrigger={() => (
                    <div className="flex items-center bg-white h-[45px] w-full cursor-pointer px-2 border border-gray-300">
                      <div className="text-black text-[14px] font-semibold truncate">
                        {selectedCategoryName
                          ? selectedCategoryName
                          : "Select Item Category"}
                      </div>
                    </div>
                  )}
                  onChange={(event) => {
                    const selectedValue = (event.target as HTMLInputElement)
                      .value;
                    setSelectedCategory(selectedValue);
                  }}
                >
                  {categories
                    ?.filter((item: any) => item.status == true)
                    .slice() 
                    .sort((a: any, b: any) => a.name.localeCompare(b.name)) 
                  .map((item: any) => (
                    <div
                      key={item.id}
                      className="bg-white font-semibold   text-black hover:bg-bright-green hover:text-black"
                    >
                      <Dropdown.Item
                        onClick={() => {
                          setSelectedCategory(item.id);
                          setSelectedCategoryName(item.name);
                        }}
                      >
                        {" "}
                        {item.name}
                      </Dropdown.Item>
                    </div>
                  ))}
                </Dropdown> */}
              </div>
              <div>
                <TextArea
                  label="Description and Details"
                  className="w-full p-2 text-[15px]"
                  placeholder="Enter Item Description"
                  noteText=" Include detailed requirements and preferences."
                  note="Note: "

                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="flex flex-col lg:flex-row lg:items-center lg:gap-9 w-full">
                <div className=" ml-1 font-bold text-lg sm:text-xl  lg:w-[50%]">
                  <label className="flex ml-1 font-bold text-lg sm:text-xl  lg:w-[50%]">
                    Upload Photo
                  </label> <label className="flex ml-1 text-sm font-normal">

Need a pic of what you want? <br />You can capture an image online. 
{/* <FiCamera onClick={()=>setIsCameraOpen(true)} className="cursor-pointer text-lg"/> */}
                  </label>
      
                </div>
                <div className="w-full">
                  <UploadImageForm
                    onPdfImageChange={handlePdfImageChange}
                    resetTrigger={!pdfImage}
                  />
                  <p className="">
                    <span className="text-bright-green">Note: </span> Upload
                    clear, high-quality images for better clarity.
                  </p>
                </div>
              </div>
              <div className="flex flex-col lg:flex-row lg:items-center lg:gap-9 w-full">
                <div className="lg:w-[33%]"></div>


                <Button
                  text="Submit"
                  loading={loading}
                  type="success"
                  onClick={handleSubmit}
                />
                {/* <CameraCapture
  isOpen={isCameraOpen}
  onClose={() => setIsCameraOpen(false)}
  onCapture={(file:any) => setPdfImage(file)}
/> */}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default isAuth(CreateListing);
