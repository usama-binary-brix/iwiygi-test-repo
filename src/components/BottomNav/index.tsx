"use client";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

interface BottomNavProps {
  onFaqClick: () => void;
  onContactUsClick: () => void;
  onTermsofUseClick: () => void;
  onPrivacyPolicyClick: () => void;
}

const BottomNav: FC<BottomNavProps> = ({
  onFaqClick,
  onContactUsClick,
  onTermsofUseClick,
  onPrivacyPolicyClick,
}) => {
  return (
    <footer className="flex flex-col md:flex-row bg-dark-2 px-4 md:px-10 py-4 md:py-10 border-t-2 border-t-black">
      <div className="flex justify-center md:justify-start mb-4 md:mb-0">
        <Image
          src="/images/logo.png"
          alt="logo"
          width={200}
          height={200}
          className="object-contain"
        />
      </div>
      <div className="flex-1" />
      {/* <div className="flex flex-1" /> */}

      <div className="flex flex-col md:flex-row justify-between items-center gap-16">
        <div className="flex flex-col items-start gap-3 mb-6 md:mb-0">
          <div className="flex flex-col items-center md:items-start">
            <div className=" font-bold text-[20px] md:text-[28px]">
              Information
            </div>
            <Image
              src="/images/underline.png"
              alt="underline"
              width={160}
              height={40}
            />
          </div>

          {/* <button onClick={onContactUsClick} className="font-bold">
            Company Contact & Info
          </button> */}
          <Link
            href="/term-of-services"
            // onClick={onTermsofUseClick}
            className="font-bold text-xs xl:text-lg lg:text-lg md:text-md md:font-bold"
          >
            Terms of Service
          </Link>

          <Link
            href="/privacy-policy"
            // onClick={onPrivacyPolicyClick}
            className="font-bold text-xs xl:text-lg lg:text-lg md:text-md md:font-bold"
          >
            Privacy Policy
          </Link>
        </div>

        <div className="flex flex-col items-start gap-3">
          <div className="flex flex-col items-center md:items-start">
            <div className=" font-bold text-[20px] md:text-[28px]">
              Help & Support
            </div>
            <Image
              src="/images/underline.png"
              alt="underline"
              width={160}
              height={40}
            />
          </div>
          <Link
            href="/contact-us"
            // onClick={onContactUsClick}
            className="font-bold text-xs xl:text-lg lg:text-lg md:text-md md:font-bold"
          >
            Contact Us
          </Link>
          <Link
            href="/faq"
            // onClick={onFaqClick}
            className="font-bold text-xs xl:text-lg lg:text-lg md:text-md md:font-bold"
          >
            FAQ & Transaction Fee
          </Link>

          {/* <button onClick={onTermsofUseClick} className="font-bold">
            Terms of Use
          </button> */}
        </div>
      </div>
    </footer>
  );
};

export default BottomNav;
