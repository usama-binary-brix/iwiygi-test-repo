"Use Client";
import React, { useState } from "react";
import Share from "../Share";
import Image from "next/image";
import Lightbox from "react-image-lightbox";
import UserProfile from "./UserProfile";
import Button from "../button/Button";
import { useRouter } from "next/navigation";

interface LightboxData {
  imageURL: string;
}
interface ButtonProps {
  key?: any;
  onClick: () => void | Promise<void>;
  title: string;
  classes?: string;
  type?: any;
  loading?: any;
}

interface MegaListViewProps {
  id?: string;
  img: string;
  title: string;
  description: string;
  listingPostedBy?: any;
  isApprovedByAdmin?: any;
  type?: any;
  slug?: any;
  buttons?: ButtonProps[];
}

const MegaListView = ({
  id,
  img,
  title,
  description,
  isApprovedByAdmin,
  listingPostedBy,
  type,
  slug,
  buttons,
}: MegaListViewProps) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxData, setLightboxData] = useState<LightboxData>({
    imageURL: "",
  });
  const router = useRouter();

  const openLightbox = (attachmentFile: string | undefined) => {
    if (attachmentFile) {
      setLightboxData({ imageURL: attachmentFile });
      setLightboxOpen(true);
    }
  };

  const handleViewList = () => {
    router.push(`/listings/${slug}`);
  };

  return (
    <div className="bg-[#212121] mx-auto border-bright-green border rounded-sm text-gray-700 mb-0.5 h-30 w-full md:w-[75%] lg:w-full">
      {/* <div className="flex flex-col lg:flex-row p-3 md:border-l-8 border-bright-green items-center cursor-pointer">
        <div
          className="space-y-1 lg:border-r lg:pr-3 w-full lg:w-auto mb-5 lg:mb-0"
          onClick={handleViewList}
        > */}
          <div className="flex lg:flex-row items-center p-3 md:border-l-8 border-bright-green cursor-pointer overflow-x-auto max-w-full">
                {/* old code is available in text file in documents */}
                {/* Image Section */}
                <div
                  onClick={handleViewList}
                  className="space-y-1 lg:border-r lg:pr-3 flex-shrink-0"
                >
          <Image
            width={100}
            height={100}
            src={
              img ||
              "https://iwiygi-assets.s3.amazonaws.com/not_found_image.png"
            }
            alt="No Image"
            // className="w-full h-[250px] lg:w-[120px] lg:h-[120px] object-cover rounded-md"
            className="w-[120px] h-[120px] object-cover rounded-md"

            // layout="fill"
            onClick={() => openLightbox(img)}
          />
          {lightboxOpen && (
            <Lightbox
              mainSrc={lightboxData.imageURL}
              onCloseRequest={() => setLightboxOpen(false)}
              imageCaption="Attachment"
              enableZoom={true}
              imagePadding={50}
            />
          )}
        </div>
        <div onClick={handleViewList} className="flex-1 min-w-[250px]">

        {/* <div className="flex-1 mb-5 lg:mb-0 w-full" onClick={handleViewList}> */}
          <div className="ml-3 space-y-1 pr-3">
            <div className="leading-6 font-normal capitalize text-bright-green text-md">
              Listing # : {id}
            </div>
            <div className="leading-6 font-normal capitalize text-white">
                      <span className="text-bright-green">Listing Posted By: </span> {listingPostedBy?.username}

                    </div>
            <div className="leading-6 font-normal capitalize text-white text-xl">
              {title || ''}
            </div>
            {/* <div className="text-sm leading-4 font-[200] capitalize text-white line-clamp-2 text-ellipsis">
              {description}
            </div> */}
            <div className="text-sm leading-4 break-words capitalize text-white font-[200]">
              {description.length > 50
                ? `${description.slice(0, 70)}...`
                : description || ''}
            </div>
          </div>
        </div>

        {isApprovedByAdmin && (
          <div className="lg:border-r pr-3">
            <div>
              <div className="ml-3 my-3 border-gray-200 border-2 bg-gray-300 p-1">
                <div className="text-xs leading-4 font-medium">
                  Listing Status
                </div>
                <div className="text-center text-xs leading-4 font-semibold text-gray-800">
                  {isApprovedByAdmin}
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="lg:border-r px-3">
          <div>
            {!listingPostedBy || listingPostedBy?.role === "user" ? (
              <Share slug={slug}/>
            ) : (
              // <Share />
              <UserProfile
                userid={listingPostedBy.id}
                username={listingPostedBy.username}
                fullName={listingPostedBy.fullname}
                email={listingPostedBy.email}
                showDeleteButton={true}
              />
            )}
          </div>
        </div>

        {/* <div className="lg:ml-3 md:my-5 p-1 w-full lg:w-60 flex flex-col gap-2"> */}
       <div  className="lg:ml-3 p-1 flex-shrink-0 flex flex-col gap-2 lg:w-60">
          {buttons?.map((button, index) => (
            <Button
              key={index}
              text={`${button.title}`}
              onClick={button.onClick}
              className={button.classes}
              type={button.type}
              loading={button.loading}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MegaListView;
