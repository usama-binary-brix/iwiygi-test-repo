import { FC } from "react";
import Listing, { ListingProps } from "@/components/Listing";

export interface ListingsProps {
  listings: Array<Omit<ListingProps, "index">>;
  refreshListing: () => void;
}

const Listings: FC<ListingsProps> = ({ listings, refreshListing }) => {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-1">
      {listings.map((listing, index) => {
        return <Listing key={listing.id} {...listing} index={index} refreshListing={refreshListing} />;
      })}
    </div>
  );
};

export default Listings;
