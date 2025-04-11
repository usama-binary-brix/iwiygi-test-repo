"use client";
import { Dropdown, TextInput } from "flowbite-react";
import { FC, useEffect, useRef, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { FaTags, FaTextWidth } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import Button from "@/components/button/Button";

interface SearchProps {
  categories: any;
}

const Search: FC<SearchProps> = ({ categories }) => {


  console.log(categories, 'categories')
  const [keyword, setKeyword] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");

  const [searchInitiated, setSearchInitiated] = useState<boolean>(false);


  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [description, setDescription] = useState("");
  // const [categories, setCategories] = useState([]);

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter categories based on search input
  const filteredCategories = categories?.data?.filter(
    (item:any) =>
      item.status === true &&
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleUserListing = () => {
    router.push("/listings/search");
  };

  useEffect(() => {
    if (searchInitiated) {
      handleSearch(false);
    }
  }, [searchInitiated]);


  const handleSearch = async (isAllListingShow: boolean) => {
    if (searchInitiated && (selectedCategory || keyword || isAllListingShow)) {


      

      const searchParams = new URLSearchParams();
      // if (keyword) searchParams.set("listingTitle", keyword);
      if (selectedCategoryId) searchParams.set("category", selectedCategoryId.toString());
      if (keyword) searchParams.set("listingTitle", keyword);

      if (isAllListingShow) searchParams.set("allListings", "true");
    
      router.push(`/listings/search?${searchParams.toString()}`);
         
    }
  };

  // const handleSearch = async (isAllListingShow: boolean) => {
  //   if (searchInitiated && (selectedCategory || keyword || isAllListingShow)) {
  //     let apiUrl = `${process.env.NEXT_PUBLIC_API}/api/listings/searchCategoryByTitle`;

  //     await fetch(apiUrl, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         listingTitle: keyword,
  //         // listingCategory: selectedCategoryId, // You can add the category ID here
  //         isAllListingShow,
  //       }),
  //     })
  //       .then((response) => response.json())
  //       .then((data) => {
  //         const searchParams = new URLSearchParams();
  //         if (keyword) searchParams.set("category", keyword);
  //         if (isAllListingShow) searchParams.set("allListings", "true");
    
  //         router.push(`/listings/search?${searchParams.toString()}`);
  //         // localStorage.setItem("data", JSON.stringify(data?.data));
  //         // router.push("listings/search");
  //       })
  //       .catch((error) => {
  //         console.error("Error:", error);
  //       });
  //   }
  // };

  return (
    <>
      <div className="flex flex-wrap w-full justify-center gap-2">
        <div className="flex  justify-center gap-2">
          <style>
            {`
              .transition-opacity {
                overflow: auto;
                height: 20rem;
              }
              input::placeholder {
                // font-weight: bold;
                color:gray;
              }
            `}
          </style>
          {/* <Dropdown
            label=""
            renderTrigger={() => (
              <div className="flex items-center bg-white h-[45px] w-full md:w-[200px] cursor-pointer px-2 border border-gray-300 rounded-md">
                <FaTags className="text-[16px] text-black mr-4" />
                <div
                  className="text-black text-[14px] font-bold truncate"
                  style={{ fontSize: "16px" }}
                >
                  {selectedCategory ? selectedCategory : "Select Category"}
                </div>
              </div>
            )}
            onChange={(event) => {
              const selectedValue = (event.target as HTMLInputElement).value;
              setSelectedCategory(selectedValue); 
            }}
          >
          {categories?.data
  ?.filter((item: any) => item.status == true)
  .slice() // ✅ Create a copy to avoid mutating original data
  .sort((a: any, b: any) => a.name.localeCompare(b.name)) // ✅ Sort alphabetically

  .map((item: any) => (
              <div
                key={item.id}
                className="bg-bright-green font-bold text-bright-green hover:bg-bright-green hover:text-black"
              >
                <Dropdown.Item
                  onClick={() => {
                    setSelectedCategory(item.name); 
                    setSelectedCategoryId(item.id); // Set category ID if necessary
                  }}
                >
                  {item.name}
                </Dropdown.Item>
              </div>
            ))}
          </Dropdown> */}
    <div className="flex flex-col lg:flex-row lg:items-center lg:gap-9 w-full">
               
                <div className="relative w-full" ref={dropdownRef}>
                  {/* Dropdown Trigger */}
                  <div
                    className="flex items-center bg-white rounded-lg text-black h-[45px] w-full cursor-pointer px-2 border border-gray-300"
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
                    <div className="absolute w-full bg-white shadow-md border border-gray-300 mt-2 rounded-md z-10">
                      {/* Search Input */}
                      <div className="p-2">
                        <input
                          type="text"
                          placeholder="Search category..."
                          className="w-full text-xs border text-black border-gray-300 p-2 rounded"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>

                      {/* Categories List */}
                      <ul className="max-h-48 overflow-y-auto">
                        {filteredCategories.length > 0 ? (
                          filteredCategories.map((item:any) => (
                            <li
                              key={item.id}
                              className="p-2 text-xs font-semibold cursor-pointer text-black hover:bg-bright-green"
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
          <TextInput
            type="text"
            icon={() => (
              <FaTextWidth className="text-[16px] text-black font-bold" />
            )}
            placeholder="Enter Keyword here..."
            className="w-full md:w-[250px] border border-gray-300 rounded-lg h-[45px] placeholder:text-black"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button
            type="success"
            text="Search"
            onClick={() => {
              setSearchInitiated(true);
              // handleSearch(false);
            }}
            icon={<FaSearch />}
          />
          <Button
            type="success"
            text="View All Listings"
            onClick={handleUserListing}
          />
        </div>
      </div>
    </>
  );
};

export default Search;
