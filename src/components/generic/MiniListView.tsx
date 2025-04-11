import Image from "next/image";
import React, { useState } from "react";
import Lightbox from "react-image-lightbox";

const MiniListView = ({
  img,
  imgClassName,
  titleClassName,
  id,
  title,
  description,
  mainClassName,
  descriptionClassName,
  parentClassName
}: any) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxData, setLightboxData] = useState({
    imageURL: "",
  });

  const openLightbox = (attachmentFile: string | undefined) => {
    if (attachmentFile) {
      setLightboxData({ imageURL: attachmentFile });
      setLightboxOpen(true);
    }
  };

  return (
    <>
      <div className={`flex items-center gap-2 w-full`}>
        <div
          className={`flex justify-center md:border-r  pr-3 border-gray-200 flex-col items-center ${mainClassName}`}
        >
          <Image
            src={img || ''}
            alt={`Image`}
            width={60}
            height={60}
            className={`w-[60px] h-[60px] cursor-pointer border-bright-green border rounded ${imgClassName}`}
            onClick={() => openLightbox(img)}
          />
          {lightboxOpen && (
            <Lightbox
              mainSrc={lightboxData.imageURL}
              onCloseRequest={() => setLightboxOpen(false)}
              imageCaption="Attachment"
              enableZoom={true}
              imagePadding={50}
            />
          )}
          {id && (
            <div className="w-full">
              <div className=" my-3  bg-gray-300 p-1">
                <div className="text-center text-sm leading-4 font-semibold text-gray-800">
                  {id || ''}
                </div>
              </div>
            </div>
          )}
        </div>
        <div>
          <p className={`${titleClassName} capitalize break-words `}>{title || ''}</p>
          <p className={`${descriptionClassName} break-words`}>{description || ''}</p>
        </div>
      </div>
    </>
  );
};

export default MiniListView;
