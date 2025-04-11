"use client";
import { FC, useState, useRef, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from 'next/navigation';
// ADMIN PAGE

interface Ad {
  id: string;
  adImage: string;
  adSpaceNumber: number;
  adImageUrl: string;
}

const AllAds: FC = () => {
  const [adImages, setAdImages] = useState<(File | null)[]>([null, null, null]);
  const fileInputRefs = useRef<HTMLInputElement[]>([]);
  const [adImageUrls, setAdImageUrls] = useState<string[]>(["", "", ""]);
  const [ads, setAds] = useState<Ad[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      let accessToken = localStorage.getItem("accessToken")
      if (!accessToken) {
        console.error("Access token not found");
        return;
      }
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API}/api/admin/fetchAllAds`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.status === 200) {
        const fetchedAds: Ad[] = response.data.data;
        const newAdImageUrls = [...adImageUrls];
        fetchedAds.forEach((ad) => {
          const index = ad.adSpaceNumber - 1;
          newAdImageUrls[index] = ad.adImageUrl;
        });

        setAdImageUrls(newAdImageUrls);
        setAds(fetchedAds);
      }
    } catch (error) {
      console.error("Error fetching ads:", error);
    }
  };

  const handleFileInputChange =
    (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files && event.target.files[0];
      if (file) {
        setAdImages((prevImages) => {
          const newImages = [...prevImages];
          newImages[index] = file;
          return newImages;
        });

        handleUpload(file, index);
      }
    };

  const handleUpload = async (file: File, index: number) => {
    try {
      let accessToken = localStorage.getItem("accessToken")
      if (!accessToken) {
        console.error("Access token not found");
        return;
      }
      const formData = new FormData();

      formData.append("adImage", file);
      formData.append("adSpaceNumber", String(index + 1));
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/api/admin/postAd`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      router.push("/all-ads")
    } catch (error) {
      console.error("Error uploading ad:", error);
    }
  };

  const handleDelete = async (adId: string) => {
    try {
      let accessToken = localStorage.getItem("accessToken")
      if (!accessToken) {
        console.error("Access token not found");
        return;
      }
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API}/api/admin/deleteAd/${adId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      toast.success("Ad Deleted successfully");
      router.push('/all-ads')
      setAds((prevAds) => prevAds.filter((ad) => ad.id !== adId));
    } catch (error) {
      console.error("Error deleting ad:", error);
    }
  };

  const handleClickUploadButton = (index: number) => {
    fileInputRefs.current[index].click();
  };

  return (
    <div className="p-4 mx-auto flex flex-col gap-8">
      <div className="flex flex-col md:flex-row gap-5 items-center">
        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileInputChange(1)}
          ref={(input) =>
            (fileInputRefs.current[1] = input as HTMLInputElement)
          }
        />
        <div className="flex w-full md:w-[800px] h-[120px] bg-black border-2 border-bright-green">
          {adImageUrls[1] && (
            <Image
              src={adImageUrls[1]}
              alt={`Ad space 2`}
              width={800}
              height={120}
              className="object-cover w-full"
            />
          )}
        </div>
        <div className="flex flex-col ">
          <button
            className=" font-bold text-black bg-bright-green h-fit rounded-[50%] px-4 py-2"
            onClick={() => handleClickUploadButton(1)}
          >
            Upload New 2
          </button>
          {/* <button
            className=" font-bold text-black mt-2 bg-bright-green h-fit rounded-[50%] px-4 py-2"
            onClick={() =>
              handleDelete(
                ads.filter((e) => e.adSpaceNumber === 2)[0]?.id || ""
              )
            }
          >
            Delete
          </button> */}
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-between gap-5">
        {[0, 2].map((adSpaceNumber, index) => (
          <div
            key={adSpaceNumber}
            className="flex flex-col md:flex-row gap-5 items-center"
          >
            <input
              alt="NO FILE"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleFileInputChange(adSpaceNumber)}
              ref={(input) =>
              (fileInputRefs.current[adSpaceNumber] =
                input as HTMLInputElement)
              }
            />
            <div className="flex w-[200px] h-[620px] bg-black border-2 border-bright-green">
              {adImageUrls[adSpaceNumber] && (
                <Image
                  src={adImageUrls[adSpaceNumber]}
                  alt={`Ad space ${adSpaceNumber + 1}`}
                  width={200}
                  height={620}
                />
              )}
            </div>
            <div className="flex flex-col">
              <button
                className=" font-bold text-black bg-bright-green h-fit rounded-[50%] px-4 py-2"
                onClick={() => handleClickUploadButton(adSpaceNumber)}
              >
                Upload New {adSpaceNumber + 1}
              </button>
              {/* <button
                className=" font-bold text-black mt-2 bg-bright-green h-fit rounded-[50%] px-4 py-2"
                onClick={() =>
                  handleDelete(
                    ads.filter((e) => e.adSpaceNumber === adSpaceNumber + 1)[0]
                      ?.id || ""
                  )
                }
              >
                Delete
              </button> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllAds;
