import React from "react";
import {
  FacebookMessengerIcon,
  FacebookShareButton,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
  FacebookIcon,
  XIcon,
} from "react-share";
import Image from "next/image";
import { FaCopy } from "react-icons/fa";
import { toast } from "sonner";

interface ShareProps {
  slug?: string;
}

export default function Share({ slug }: ShareProps) {
  const baseUrl = "http://dev.iwantityougotit.com/listings/";
  const shareUrl = `${baseUrl}${slug}`;
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };
  return (


  <>

  <h1 className="text-center text-bright-green mb-3">Share Listing</h1>
    <div className="flex gap-3 items-center justify-center">
      <div className="flex gap-2 items-center justify-center">
        <FacebookShareButton url={shareUrl} hashtag="#listing">
          <FacebookIcon
            size={35}
            round
            className="cursor-pointer h-[25px] w-[25px] lg:h-[30px] lg:w-[30px]"
          />
        </FacebookShareButton>

        <WhatsappShareButton url={shareUrl}>
          <WhatsappIcon
            size={35}
            round
            className="cursor-pointer h-[25px] w-[25px] lg:h-[30px] lg:w-[30px]"
          />
        </WhatsappShareButton>
      </div>

      <div className="flex gap-2 items-center justify-center">
        <a
          className="styleImg"
          href={`https://www.instagram.com/direct/new/?text=${encodeURIComponent(
            "Check out this Listing: " + shareUrl
          )}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="h-[25px] w-[25px] lg:h-[30px] lg:w-[30px] flex justify-center items-center rounded-full">
            <Image
              src="/images/insta.jpeg"
              alt="Instagram"
              width={37}
              height={37}
              className="cursor-pointer h-[25px] w-[25px] lg:h-[30px] lg:w-[30px]"
            />
          </div>
        </a>

        <TwitterShareButton
          title="My Listing"
          url={shareUrl}
          hashtags={["listing"]}
        >
          <XIcon
            size={35}
            round
            className="text-white h-[25px] w-[25px] lg:h-[30px] lg:w-[30px]"
          />
        </TwitterShareButton>

        <a
          className="styleImg"
          href={`https://www.messenger.com/new?link=${encodeURIComponent(
            shareUrl
          )}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <FacebookMessengerIcon
            size={35}
            round
            className="cursor-pointer h-[25px] w-[25px] lg:h-[30px] lg:w-[30px]"
          />
        </a>
      </div>

      <div className="flex gap-2 items-center justify-center">
        <div className="flex gap-2 items-center justify-center">
          <button onClick={copyToClipboard} className="styleImg">
            <div className="bg-[#0965fe] h-[25px] w-[25px] lg:h-[35px] lg:w-[35px] flex justify-center items-center rounded-full">
              <FaCopy className="text-white text-xs lg:text-lg" />
            </div>
          </button>
        </div>
        <a
          href={`mailto:?subject=Check%20out%20this%20listing&body=${encodeURIComponent(
            shareUrl
          )}`}
        >
          <Image
            src="/images/mail.png"
            alt="Mail"
            width={35}
            height={35}
            className=" cursor-pointer h-[25px] w-[25px] lg:h-[35px] lg:w-[35px]"
          />
        </a>
      </div>
    </div>
  
  
  </>
  );
}









{/* <div className="flex flex-col">
<div className="flex gap-2 items-center justify-center">
  <FacebookShareButton url={shareUrl} hashtag="#listing">
    <FacebookIcon
      size={35}
      round
      className="cursor-pointer h-[25px] w-[25px] lg:h-[37px] lg:w-[37px]"
    />
  </FacebookShareButton>

  <WhatsappShareButton url={shareUrl}>
    <WhatsappIcon
      size={35}
      round
      className="cursor-pointer h-[25px] w-[25px] lg:h-[37px] lg:w-[37px]"
    />
  </WhatsappShareButton>
</div>

<div className="flex gap-2 items-center justify-center">
  <a
    className="styleImg"
    href={`https://www.instagram.com/direct/new/?text=${encodeURIComponent(
      "Check out this Listing: " + shareUrl
    )}`}
    target="_blank"
    rel="noopener noreferrer"
  >
    <div className="h-[25px] w-[25px] lg:h-[37px] lg:w-[37px] flex justify-center items-center rounded-full">
      <Image
        src="/images/insta.jpeg"
        alt="Instagram"
        width={37}
        height={37}
        className="cursor-pointer h-[25px] w-[25px] lg:h-[37px] lg:w-[37px]"
      />
    </div>
  </a>

  <TwitterShareButton
    title="My Listing"
    url={shareUrl}
    hashtags={["listing"]}
  >
    <XIcon
      size={35}
      round
      className="text-white h-[25px] w-[25px] lg:h-[37px] lg:w-[37px]"
    />
  </TwitterShareButton>

  <a
    className="styleImg"
    href={`https://www.messenger.com/new?link=${encodeURIComponent(
      shareUrl
    )}`}
    target="_blank"
    rel="noopener noreferrer"
  >
    <FacebookMessengerIcon
      size={35}
      round
      className="cursor-pointer h-[25px] w-[25px] lg:h-[37px] lg:w-[37px]"
    />
  </a>
</div>

<div className="flex gap-2 items-center justify-center">
  <div className="flex gap-2 items-center justify-center">
    <button onClick={copyToClipboard} className="styleImg">
      <div className="bg-[#0965fe] h-[25px] w-[25px] lg:h-[40px] lg:w-[40px] flex justify-center items-center rounded-full mb-4">
        <FaCopy className="text-white text-xs lg:text-lg" />
      </div>
    </button>
  </div>
  <a
    href={`mailto:?subject=Check%20out%20this%20listing&body=${encodeURIComponent(
      shareUrl
    )}`}
  >
    <Image
      src="/images/mail.png"
      alt="Mail"
      width={35}
      height={35}
      className="mb-4 cursor-pointer h-[25px] w-[25px] lg:h-[39px] lg:w-[39px]"
    />
  </a>
</div>
</div> */}
