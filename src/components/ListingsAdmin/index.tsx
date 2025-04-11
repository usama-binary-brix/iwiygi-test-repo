import { FC, useState } from "react";
import ListingAdmin, { ListingAdminProps } from "@/components/ListingAdmin";
import Link from "next/link";
import BackStep from "../backStep/BackStep";
import PageHeading from "../generic/PageHeading";

export interface ListingsAdminProps {
  listings: Array<Omit<ListingAdminProps, "index">>;
}

const ListingsAdmin: FC<ListingsAdminProps> = ({ listings }) => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredListings = listings.filter((list) =>
    list.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <PageHeading
        backurl={"/"}
        heading={"All Listings "}
        btnurl={"/listings-for-approval"}
        btnheading={"Pending for Approval"}
      />

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
            placeholder="Search with Listing Name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      {filteredListings.map((listing, index) => {
        return <ListingAdmin key={listing.id} index={index} {...listing} />;
      })}
    </div>
  );
};

export default ListingsAdmin;
