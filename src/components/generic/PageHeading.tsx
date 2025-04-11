import React from "react";
import BackStep from "../backStep/BackStep";
import Link from "next/link";

interface PageHeadingProps {
  backurl: string;
  heading: string;
  btnurl?: string;
  btnheading?: string;
}

const PageHeading: React.FC<PageHeadingProps> = ({
  backurl,
  heading,
  btnurl,
  btnheading,
}) => {
  return (
    <div className="text-2xl sm:text-3xl font-bold  mb-4 flex gap-3 justify-between items-center mt-3">
      <BackStep href={backurl} />
      <span>{heading}</span>
      {btnurl && btnheading && (
        <Link
          href={btnurl}
          className="bg-bright-green flex items-center justify-center gap-2 px-3 text-black text-base  font-bold py-2 w-[fit-content] rounded-md text-center"
        >
          {btnheading}
        </Link>
      )}
    </div>
  );
};

export default PageHeading;
