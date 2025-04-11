import Link from "next/link";
import React from "react";
import { IoAdd } from "react-icons/io5";

const ListingButtons = ({ url, icon }: any) => {

  // const ListingBtn=[
  //   {
  //     url:'/create-listing',
  //     icon:<IoAdd/>
  //   },
  // ]


  return (
    <>
      <Link
        href={url}
        className="rounded-md bg-bright-green p-2.5 border border-transparent text-center text-sm text-black transition-all shadow-sm hover:shadow-lg focus:bg-dark-green focus:shadow-none active:bg-dark-green hover:bg-dark-green active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
      >
        <span className="text-xl">{icon}</span>
      </Link>
    </>
  );
};

export default ListingButtons;


// import Link from "next/link";
// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/router";

// const ListingButtons = ({ url, icon }: any) => {
//   const { pathname } = useRouter();
//   const [isMounted, setIsMounted] = useState(false);

//   useEffect(() => {
//     setIsMounted(true);
//   }, []);

//   // Prevent rendering before the component mounts
//   if (!isMounted) return null;

//   const isActive = pathname === url; 

//   return (
//     <Link
//       href={url}
//       className={`rounded-md p-2.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow-lg focus:shadow-none active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ${
//         isActive
//           ? "bg-red-500 hover:bg-red-600 focus:bg-red-600 active:bg-red-600"
//           : "bg-slate-800 hover:bg-slate-700 focus:bg-slate-700 active:bg-slate-700"
//       }`}
//     >
//       <span className="text-xl">{icon}</span>
//     </Link>
//   );
// };

// export default ListingButtons;

