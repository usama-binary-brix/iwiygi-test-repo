import { FC } from "react";
import Listing, { ListingProps } from "@/components/UserListing";

export interface ListingsProps {
  listings: Array<Omit<ListingProps, "index">>;
  listingRefresh: () => void;
  categories:any;
}

const Listings: FC<ListingsProps> = ({ listings,listingRefresh, categories}) => {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-1">
      {listings?.map((listing, index) => {
        return <Listing key={listing?.id} {...listing} index={index} listingRefresh={listingRefresh} categories={categories} />;
      })}
    </div>
  );
};

export default Listings;
