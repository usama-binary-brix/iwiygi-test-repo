import Link from "next/link";
import React from "react";

const NavDropdown = ({
  parentlink,
  parenticon,
  parenttitle,
  childLinks,
}: {
  parentlink: string;
  parenticon: React.ReactNode;
  parenttitle: string;
  childLinks: {
    url: string;
    icon: React.ReactNode;
    title: string;
    onClickMethod?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  }[];
}) => {
  return (
    <li className="relative group">
      {/* Parent Link */}
      <Link
        href={parentlink}
        className="flex items-center gap-2 py-2 px-3 text-lg lg:text-xl xl:text-xl text-white rounded hover:bg-black hover:text-[rgb(3,247,25)] active:text-[rgb(3,247,25)]"
      >
        {parenticon}
        <span>{parenttitle}</span>
      </Link>

      <ul className="absolute left-0 hidden w-48 bg-black rounded shadow-lg group-hover:block">
        {childLinks.map((link, index) => (
          <li key={index}>
            {link.onClickMethod ? (
              <button
                onClick={link.onClickMethod}
                className="flex items-center gap-2 w-full text-left py-2 px-3 text-lg text-white hover:bg-gray-700"
              >
                {link.icon}
                <span>{link.title}</span>
              </button>
            ) : (
              <Link
                href={link.url}
                className="flex items-center gap-2 py-2 px-3 text-lg text-white hover:bg-gray-700"
              >
                {link.icon}
                <span>{link.title}</span>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </li>
  );
};

export default NavDropdown;
