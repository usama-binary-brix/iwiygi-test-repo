import Link from "next/link";
import React from "react";
import { IoArrowBackCircleOutline, IoArrowBackSharp } from "react-icons/io5";

interface BackStepProps {
  href: string;
}

const BackStep: React.FC<BackStepProps> = ({ href }) => {
  return (
    <Link
      href={href}
      className="rounded-md bg-bright-green p-2 border border-transparent text-center text-sm text-black transition-all shadow-sm hover:shadow-lg focus:bg-dark-green focus:shadow-none active:bg-dark-green hover:bg-dark-green active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
    >
      <span className="text-xl">
        {" "}
        <IoArrowBackSharp />
      </span>
    </Link>
  );
};

export default BackStep;
