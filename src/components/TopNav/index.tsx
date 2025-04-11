"use client";

import { IoHeartOutline } from "react-icons/io5";
import Image from "next/image";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { CiMenuFries } from "react-icons/ci";
import {
  IoAdd,
  IoCartOutline,
  IoHomeOutline,
  IoListOutline,
  IoLogOutOutline,
  IoMailUnreadOutline,
  IoPersonCircleOutline,
  IoSettingsOutline,
} from "react-icons/io5";
import { CgUserList } from "react-icons/cg";
import { IoIosLogIn } from "react-icons/io";
import { TbUserPlus } from "react-icons/tb";
import { BiCategory } from "react-icons/bi";
import { MdPendingActions } from "react-icons/md";
import { LuUsers } from "react-icons/lu";
import { FiDollarSign } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { logoutUser } from "@/store/Slices/userSlice";
import { useGetAdsQuery } from "@/store/api";
import { setAds } from "@/store/Slices/adsSlice";

interface Ad {
  id: string;
  adImage: string;
  adSpaceNumber: number;
  adImageUrl: string;
}

interface DropdownItem {
  name: string;
  link: string;
  icon?: React.ReactNode;
  onClick?: (e: React.FormEvent) => Promise<void>;
}

interface MenuItem {
  name: string;
  link: string;
  icon: React.ReactNode;
  onClick?: (e: React.FormEvent) => Promise<void>;
  dropdown?: DropdownItem[];
}

const TopNav: FC = () => {
  // const [ads, setAds] = useState<Ad[]>([]);
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState();
  const router = useRouter();
  const [openDropdowns, setOpenDropdowns] = useState<number | null>(null);
  const [openMenu, setOpenMenu] = useState(false);
  const dispatch = useDispatch();

  const User = useSelector((state: RootState) => state?.user?.user);
  const accessToken = useSelector(
    (state: RootState) => state?.user?.accessToken
  );

  const ads = useSelector((state: any) => state.ads.ads);

  const { data, error, isLoading } = useGetAdsQuery(undefined, {
    skip: ads.length > 0,
  });

  useEffect(() => {
    if (data && ads.length === 0) {
      dispatch(setAds(data?.data || []));
    }
  }, [data, dispatch, ads]);

  useEffect(() => {
    try {
      setRole(User?.role || null);
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
  }, []);

  // const fetchAds = async () => {
  //   try {
  //     const response = await axios.get(
  //       `${process.env.NEXT_PUBLIC_API}/api/admin/fetchAllAds`,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );
  //     if (response.status === 200) {
  //       setAds(response?.data?.data);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching ads:", error);
  //   }
  // };

  // const handleLogout = async (e: React.FormEvent) => {
  //   console.error("Logout failed");

  //   e.preventDefault();
  //   try {
  //     let accessToken = localStorage.getItem("accessToken");
  //     if (!accessToken) {
  //       console.error("Access token not found");
  //       return;
  //     }
  //     const response = await fetch(
  //       `${process.env.NEXT_PUBLIC_API}/api/auth/logout`,
  //       {
  //         method: "POST",
  //         mode: "cors",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${accessToken}`,
  //         },
  //       }
  //     );
  //     if (response.ok || !response.ok) {
  //       localStorage.clear();
  //       window.location.href = "/sign-in";
  //     }
  //   } catch (error) {}
  // };

  const handleLogout = async (e: React.FormEvent<Element>) => {
    e.preventDefault(); 
    dispatch(logoutUser()); 
    localStorage.clear();
    router.push("/sign-in"); 
  };


  
  // Inactivity Logout Logic


  // useEffect(() => {
  //   let timeout: NodeJS.Timeout;

  //   const resetTimer = () => {
  //     clearTimeout(timeout);
  //     timeout = setTimeout(() => {
  //       router.push("/sign-in");
  //       dispatch(logoutUser()); 
  //       localStorage.clear();
  //     }, 10000); 
  //   };
  //   const handleActivity = () => {
  //     resetTimer();
  //   };
  //   window.addEventListener("mousemove", handleActivity);
  //   window.addEventListener("keydown", handleActivity);
  //   resetTimer();
  // });


  const adminMenu: MenuItem[] = [
    { name: "Home", link: "/", icon: <IoHomeOutline /> },

    {
      name: "Listings",
      link: "/all-listings",
      icon: <IoListOutline />,
      dropdown: [
        {
          name: "All Listings",
          link: "/all-listings",
          icon: <IoListOutline />,
        },
        {
          name: "Pending Approvals",
          link: "/listings-for-approval",
          icon: <MdPendingActions />,
        },
      ],
    },

    { name: "Categories", link: "/categories", icon: <BiCategory /> },
    { name: "Manage Orders", link: "/manage-orders", icon: <IoCartOutline /> },

    { name: "Contact Us", link: "/admin-contact-us", icon: <BiCategory /> },
    { name: "Users", link: "/all-users", icon: <LuUsers /> },

    { name: "Ads", link: "/all-ads", icon: <FiDollarSign /> },
    {
      name: "Logout",
      link: "#",
      icon: <IoLogOutOutline />,
      onClick: handleLogout,
    },
  ];

  const userMenu: MenuItem[] = [
    { name: "Home", link: "/", icon: <IoHomeOutline /> },
    {
      name: "Listings",
      link: "/listings/search",
      icon: <IoListOutline />,
      dropdown: [
        { name: "All", link: "/listings/search", icon: <IoListOutline /> },
        { name: "My Listings", link: "/user-listing", icon: <CgUserList /> },
        {
          name: "Saved Listings",
          link: "/saved-listings",
          icon: <IoHeartOutline />,
        },
        { name: "Create Listing", link: "/create-listing", icon: <IoAdd /> },
      ],
    },
    { name: "Orders", link: "/my-orders", icon: <IoCartOutline /> },
    { name: "Messages", link: "/messages", icon: <IoMailUnreadOutline /> },
    {
      name: User?.username || "Profile",
      link: "/my-profile",
      icon: <IoPersonCircleOutline />,
      dropdown: [
        { name: "Settings", link: "/my-profile", icon: <IoSettingsOutline /> },
        {
          name: "Logout",
          link: "#",
          icon: <IoLogOutOutline />,
          onClick: handleLogout,
        },
      ],
    },
  ];

  const guestMenu: MenuItem[] = [
    { name: "Home", link: "/", icon: <IoHomeOutline /> },
    {
      name: "Listings",
      link: "/listings/search",
      icon: <IoListOutline />,
      dropdown: [
        { name: "All", link: "/listings/search" },
        { name: "Create Listing", link: "/create-listing", icon: <IoAdd /> },
      ],
    },
    { name: "Log In", link: "/sign-in", icon: <IoIosLogIn /> },
    { name: "Sign Up", link: "/sign-up", icon: <TbUserPlus /> },
  ];

  const menuItems =
    User?.role === "admin" ? adminMenu : User ? userMenu : guestMenu;

  const toggleDropdown = (index: number, event: React.MouseEvent) => {
    event.preventDefault();
    setOpenDropdowns(openDropdowns === index ? null : index);
  };

  const handleMenuToggle = () => {
    setOpenMenu(!openMenu);
  };

  const handleMenuClick = (
    itemHasDropdown: boolean,
    isSubItem: boolean = false
  ) => {
    if (!itemHasDropdown || isSubItem) {
      setOpenMenu(false);
    }
    setOpenDropdowns(null);
  };

  return (
    <nav className="bg-black border-gray-200 dark:bg-gray-900 sticky top-0 z-50">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link
          href="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <Image
            src="/images/logo.png"
            alt="logo"
            width={200}
            height={200}
            className="object-contain w-[150px]"
          />
        </Link>

        <button
          onClick={handleMenuToggle}
          type="button"
          className="inline-flex items-center text-dark-green p-2 w-10 h-10 justify-center text-sm rounded-lg md:hidden focus:outline dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
        >
          <span className="sr-only">Open main menu</span>
          <CiMenuFries className="text-4xl" />
        </button>

        <div
          className={`w-full md:block md:w-auto ${
            openMenu ? "block" : "hidden"
          }`}
          id="navbar-default"
        >
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 bg-black md:flex-row md:mt-0">
            {menuItems.map((item, index) => (
              <li
                key={index}
                className="relative group"
                onMouseEnter={() =>
                  window.innerWidth >= 768 && setOpenDropdowns(index)
                }
                onMouseLeave={() =>
                  window.innerWidth >= 768 && setOpenDropdowns(null)
                }
              >
                {item.link === "#" ? (
                  // Render as a button if link is '#'
                  <button
                    onClick={(e) => {
                      e.preventDefault(); // Prevent any default anchor behavior
                      if (item.onClick) {
                        item.onClick(e); // Trigger the onClick handler, like handleLogout
                      } else {
                        handleMenuClick(false);
                      }
                    }}
                    className="block py-2 px-3 text-lg lg:text-lg xl:text-lg text-white rounded hover:bg-black hover:text-[rgb(3,247,25)] flex items-center space-x-1"
                  >
                    {item.icon} <span>{item.name}</span>
                  </button>
                ) : (
                  <Link
                    href={item.link}
                    onClick={(e) => {
                      if (item.dropdown) {
                        toggleDropdown(index, e);
                      } else {
                        handleMenuClick(false);
                      }
                    }}
                    className="block py-2 px-3 text-lg lg:text-lg xl:text-xl text-white rounded hover:bg-black hover:text-[rgb(3,247,25)] flex items-center space-x-1"
                  >
                    <span className="text-xl">{item.icon}</span>

                    <span>{item.name}</span>
                  </Link>
                )}

                {item.dropdown && (
                  <div
                    className={`absolute left-0 top-full bg-black text-white mt-2 transition-all duration-300 ease-in-out ${
                      openDropdowns === index
                        ? "opacity-100 visible translate-y-0"
                        : "opacity-0 invisible translate-y-2"
                    }`}
                    style={{
                      zIndex: 100,
                      width: index === 1 ? "12rem" : "8rem",
                      
                    }}
                  >
                    <ul className="space-y-2">
                      {item.dropdown.map((dropdownItem, subIndex) => (
                        <li key={subIndex}>
                          {dropdownItem.link === "#" ? (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                if (dropdownItem.onClick) {
                                  dropdownItem.onClick(e);
                                } else {
                                  handleMenuClick(false);
                                }
                              }}
                              className="block py-2 px-2 text-lg lg:text-lg xl:text-xl text-white rounded hover:bg-black hover:text-[rgb(3,247,25)] flex items-center space-x-2"
                            >
                              <span className="text-xl">
                                {dropdownItem.icon}
                              </span>

                              <span>{dropdownItem.name}</span>
                            </button>
                          ) : (
                            <Link
                              href={dropdownItem.link}
                              onClick={(e) => {
                                handleMenuClick(true, true);
                              }}
                              className="block py-2 px-2 text-lg lg:text-md xl:text-md text-white rounded hover:bg-black hover:text-[rgb(3,247,25)] flex items-center space-x-2"
                            >
                              <span className="text-xl">
                                {dropdownItem.icon}
                              </span>
                              <span className="text-md">
                                {dropdownItem.name}
                              </span>
                            </Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default TopNav;
