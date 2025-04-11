"use client";
import { FC } from "react";
import Image from "next/image";


const Loader: FC = () => {
    return (
        <div className="flex justify-center h-screen items-center">
        <Image
        // style={{ width: '10%' }}
        src="/images/loaderLogo.gif"
        alt="logo"
        width={200}
        height={200}
        className="  object-contain w-[150px]"
      />

            <span className="sr-only">Loading...</span>
        </div>
    );
    
};

export default Loader;