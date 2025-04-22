"use client";
import Image from "next/image";
import { FC, useState, useEffect, useRef } from "react";
import axios from "axios";
import Link from "next/link";
import Search from "./_components/Search";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { IoClose } from "react-icons/io5";
import {
  useFetchNormalCategoriesQuery,
  useFetchPopularCategoriesQuery,
  useGetAdsQuery,
} from "@/store/api";
import Loader from "@/components/Loader";
import { useDispatch, useSelector } from "react-redux";
import { setAds } from "@/store/Slices/adsSlice";


interface Ad {
  id: string;
  adImage: string;
  adSpaceNumber: number;
  adImageUrl: string;
}

const Home: FC = () => {
  const [searchData, setSearchData] = useState([]);
  const [showVideo, setShowVideo] = useState(false);
  const [loading, setLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();
const dispatch = useDispatch()
  let User = localStorage.getItem("User")!;
  const parsedUser = JSON.parse(User);
  const UserRole = parsedUser?.role;

  const ads = useSelector((state: any) => state.ads.ads);
  const { data: popularCategories, isLoading:isLoadingPopularCategories, error } = useFetchPopularCategoriesQuery([]);
  const { data: categories, isLoading: isLoadingNormalCategories  } = useFetchNormalCategoriesQuery(null);
  const { data, isLoading } = useGetAdsQuery(undefined, {
    skip: ads.length > 0,
  });


  useEffect(() => {
    if (data && ads.length === 0) {
      dispatch(setAds(data?.data || []));
    }
  }, [data, dispatch, ads]);

  const handleSearch = async (category: string) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API}/api/listings/searchByCategory/${category}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setSearchData(response?.data?.data);
        localStorage.setItem("data", JSON.stringify(response?.data?.data));
        router.push(`/listings/search?category=${category}`);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };


  useEffect(() => {
    if (showVideo && videoRef.current) {
      videoRef.current.play();
    }
  }, [showVideo]);

  const toggleVideo = () => {
    setShowVideo(!showVideo);
  };

  const handleVideoEnd = () => {
    setShowVideo(false);
  };


  if (isLoadingPopularCategories || isLoadingNormalCategories) return <div><Loader/></div>;  

  return (
    <>
      {/* {loading && <Loader />} */}
      <div className="px-4 pt-2 pb-6 md:px-6">
        <div className="flex flex-col md:flex-row">
          {/* <AdSpace ads={adsSpace1} /> */}

          <div className="flex flex-1 items-center flex-col gap-6 md:gap-8">
            {UserRole == "admin" ? (
              <>
                <div className="flex items-center justify-center h-[5rem]">
                  <h1 className="text-bright-green  text-2xl md:text-[30px] font-bold text-center my-3">
                    {" "}
                    Welcome Admin
                  </h1>
                </div>
              </>
            ) : (
              <>
                <div className="text-bright-green  text-2xl md:text-[30px] font-bold text-center my-3">
                  FREE to Join & FREE to Use . . .
                </div>

                <div
                  onClick={toggleVideo}
                  className="text-center bg-black border-2 border-bright-green rounded-[50%] px-8 py-2 md:px-[100px] md:py-[6px] cursor-pointer"
                >
                  <div className=" text-bright-green text-lg md:text-xl font-bold">
                    How does it work ?
                  </div>
                  <div className=" text-bright-green text-lg md:text-xl">
                    - watch video -
                  </div>
                </div>

                {showVideo && (
                  <>
                    <div className="relative w-[100%] lg:w-[70%] xl:w-[50%] mb-2">
                      <IoClose
                        className="absolute cursor-pointer top-0 md:right-5 right-0 xl:right-3  text-[2rem]"
                        onClick={handleVideoEnd}
                      />
                    </div>

                    <div className="relative">
                      <video
                        ref={videoRef}
                        controls
                        className="w-auto border-2 border-bright-green"
                        onEnded={handleVideoEnd}
                      >
                        <source
                          src="https://iwiygi-assets.s3.amazonaws.com/iwiygi-assets/I+Want+It+You+Got+It_Video.mp4"
                          type="video/mp4"
                        />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  </>
                )}

                <hr className="w-full md:w-[600px] bg-white" />

                <Link
                  href="/create-listing"
                  className="text-center bg-black border-2 border-bright-yellow rounded-[50%] px-8 py-3 md:px-[100px] md:py-[10px] cursor-pointer"
                >
                  <div className=" text-bright-yellow text-lg md:text-xl font-bold">
                    - CLICK HERE -
                  </div>
                  <div className=" text-bright-yellow text-lg md:text-xl font-bold">
                    to create listings
                  </div>
                </Link>
              </>
            )}

            <hr className="w-full md:w-[600px] bg-white" />

            <div className="text-center flex flex-col gap-1">
              <div className="text-bright-green  text-2xl md:text-[30px] font-bold">
                Seek / Look / Buy / Sell - in just a few clicks !
              </div>

              <div className=" text-base md:text-lg font-bold ">
                Search
                <span className="underline underline-offset-4 decoration-bright-green">
                  {" "}
                  active{" "}
                </span>
                listings in over 30 Categories
              </div>
            </div>
            <Search categories={categories} />

            <div className="text-center bg-black border-2 border-bright-green rounded-[50%] px-8 py-3 md:px-[100px] md:py-[10px] flex flex-col items-center">
              <div className=" text-lg md:text-xl font-bold">
                Popular Categories
              </div>
              <div className=" text-lg md:text-xl font-bold">
                of Wanted Items
              </div>

              <Image
                src="/images/underline.png"
                alt="underline"
                width={160}
                height={40}
              />
            </div>
          </div>

          {/* <AdSpace ads={adsSpace3} /> */}
        </div>
        <div className="flex flex-col items-center mt-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-y-4 gap-x-4 md:gap-x-6">
              {popularCategories?.data?.length > 0 ? (
                // popularCategories?.data?.map((item: any) => (
                  popularCategories?.data
      .slice() // ✅ Create a copy to avoid mutating original data
      .sort((a: any, b: any) => a.name.localeCompare(b.name)) // ✅ Sort alphabetically
      .map((item: any) => (
                  <button
                    onClick={() => handleSearch(item.id)}
                    key={item.id}
                    className="border-2 min-h-20 border-bright-green bg-black w-full  md:w-[229px] p-3 flex items-center justify-center text-center font-bold"
                  >
                    {item.name}
                  </button>
                ))
              ) : (
                <div>Categories Not Found</div>
              )}
            </div>
          </div>
     
      </div>
    </>
  );
};

export default Home;

  