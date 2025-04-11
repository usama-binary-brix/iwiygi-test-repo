import Link from "next/link";
import React from "react";

const NavLink = ({ navigatelink, icon, title }: any) => {
  return (
    <>
      <Link
        href={`/${navigatelink}`}
        className="flex items-center gap-1 py-2 px-3 text-lg lg:text-xl xl:text-xl text-white rounded hover:bg-black hover:text-[rgb(3,247,25)] active:text-[rgb(3,247,25)]"
      >
        {icon} {title}
      </Link>
    </>
  );
};

export default NavLink;
