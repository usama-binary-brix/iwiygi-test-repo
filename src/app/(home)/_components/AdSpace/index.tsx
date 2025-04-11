import { FC, useState } from "react";
import Image from "next/image";

interface Ad {
  id: string;
  adImage: string;
  adSpaceNumber: number;
  adImageUrl: string;
}

interface AdSpaceProps {
  ads: Ad[];
}

const AdSpace: FC<AdSpaceProps> = ({ ads }) => {
  return (
    <>
      {ads.map((ad) => (
        <div key={ad.id} className="flex justify-center items-center p-2">
          {ad.adSpaceNumber === 2 ? (
            <div className="w-full max-w-[800px] h-[140px]">
              <Image
                src={ad.adImageUrl}
                // className="object-contain"
                style={{ maxHeight: "100%" }}
                // layout="responsive"
                // key={ad.id}
                alt={`Ad ${ad.id}`}
                width={800}
                height={140}
              />
            </div>
          ) : (
            <div className="flex md-w-[200px] md-h-auto lg:w-[350px] lg:h-[620px]">
              <Image
                src={ad.adImageUrl}
                // key={ad.id}
                alt={`Ad ${ad.id}`}
                width={200}
                height={620}
                layout="responsive"
              />
            </div>
          )}
        </div>
      ))}
    </>
  );
};

export default AdSpace;
