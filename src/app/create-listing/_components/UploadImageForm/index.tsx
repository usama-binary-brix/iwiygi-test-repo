import Image from "next/image";
import {
  ChangeEvent,
  FC,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Webcam from "react-webcam";
import { toast } from "sonner";
import { CiTrash } from "react-icons/ci";
import { FaPlus } from "react-icons/fa";
import { FiCamera } from "react-icons/fi";

const MAX_FILE_SIZE = 5120; // 5MB

interface UploadImageFormProps {
  onPdfImageChange: (file: File | null) => void;
  resetTrigger?: boolean;
}

const UploadImageForm: FC<UploadImageFormProps> = ({
  onPdfImageChange,
  resetTrigger,
}) => {
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const webcamRef = useRef<Webcam>(null);

  const handleRemoveImage = useCallback(() => {
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
      setImage(null);
      setPreviewUrl(null);
      onPdfImageChange(null);
    }
  }, [onPdfImageChange]);

  const handleClick = useCallback(() => {
    imageInputRef.current?.click();
    console.log('first')
  }, []);

  const checkImageSize = useCallback((image: File) => {
    const imageSizeInKb = image.size / 1024;
    return imageSizeInKb > MAX_FILE_SIZE;
  }, []);

  const handleImageChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files[0]) {
        const img = event.target.files[0];
        if (checkImageSize(img)) {
          toast.error(`Image should not be greater than 5 MB`);
          return;
        }
        setImage(img);
        onPdfImageChange(img);
      }
    },
    [checkImageSize, onPdfImageChange]
  );

  const captureFromCamera = useCallback(() => {
    const screenshot = webcamRef.current?.getScreenshot();
    if (screenshot) {
      fetch(screenshot)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], "captured_image.jpg", {
            type: "image/jpeg",
          });
          if (checkImageSize(file)) {
            toast.error("Captured image is too large (over 5MB)");
            return;
          }
          setImage(file);
          onPdfImageChange(file);
          setIsCameraOpen(false);
        });
    }
  }, [checkImageSize, onPdfImageChange]);
useEffect(() => {
  if (image) {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(image); 
  } else {
    setPreviewUrl(null);
  }
}, [image]);

  // useEffect(() => {
  //   if (image) {
  //     const url = URL.createObjectURL(image);
  //     setPreviewUrl(url);

  //     return () => {
  //       URL.revokeObjectURL(url);
  //     };
  //   } else {
  //     setPreviewUrl(null);
  //   }
  // }, [image]);

  useEffect(() => {
    if (resetTrigger) {
      handleRemoveImage();
    }
  }, [resetTrigger, handleRemoveImage]);

  return (
    <>
      <div className="flex items-center gap-4">
        {image ? (
          <div className="relative w-fit group" onClick={handleRemoveImage}>
            <Image
              src={previewUrl || ""}
              alt="profile image"
              width={188}
              height={188}
              className="object-cover rounded-md flex self-center w-[188px] h-[188px]"
            />
            <div className="absolute top-0 bottom-0 left-0 right-0 items-center justify-center hidden cursor-pointer group-hover:flex">
              <CiTrash size={30} color="red" />
            </div>
          </div>
        ) : (
          <div
            className="w-[188px] h-[188px] rounded-md flex items-center justify-center cursor-pointer bg-gray-50"
            onClick={handleClick}
          >
            <div className="text-center" style={{ display: "ruby" }}>
              <FaPlus className="text-center" size={18} color="#03F719" />
              <div className="text-black text-center font-bold">
                Upload Photo
              </div>
            </div>
          </div>
        )}

        <FiCamera
          size={30}
          className="cursor-pointer text-dark-green hover:text-green-700"
          onClick={() => setIsCameraOpen(true)}
          title="Capture using Camera"
        />

        <input
          ref={imageInputRef}
          hidden
          type="file"
          name="profileImage"
          accept=".png, .jpg, .jpeg, .heic"
          onChange={handleImageChange}
        />
      </div>

      {/* Camera Modal */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex flex-col items-center justify-center">
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="rounded-lg w-[320px] h-[240px]"
          />
          <div className="flex mt-4 gap-4">
            <button
              onClick={captureFromCamera}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Capture
            </button>
            <button
              onClick={() => setIsCameraOpen(false)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default UploadImageForm;


// import Image from "next/image";
// import { ChangeEvent, FC, useCallback, useEffect, useRef, useState } from "react";
// import { toast } from "sonner";
// import { CiTrash } from "react-icons/ci";
// import { FaPlus } from "react-icons/fa";

// const MAX_FILE_SIZE = 5120; 

// interface UploadImageFormProps {
//   onPdfImageChange: (file: File | null) => void; // Allow null for resets
//   resetTrigger?: boolean; // Optional prop to reset the form
// }
// const UploadImageForm: FC<UploadImageFormProps> = ({ onPdfImageChange, resetTrigger }) => {
//   const [image, setImage] = useState<File | null>(null);

//   const imageInputRef = useRef<HTMLInputElement>(null);

//   const handleRemoveImage = useCallback(() => {
//     if (imageInputRef.current) {
//       imageInputRef.current.value = "";
//       setImage(null);
//       onPdfImageChange(null);
//     }
//   }, []);

//   const handleClick = useCallback(() => {
//     imageInputRef.current?.click();
//   }, []);

//   const checkImageSize = useCallback((image: File) => {
//     const imageSizeInKb = image.size / 1024;
//     if (imageSizeInKb > MAX_FILE_SIZE) {
//       return true;
//     }

//     return false;
//   }, []);

//   const handleImageChange = useCallback(
//     async (event: ChangeEvent<HTMLInputElement>) => {
//       if (event.target.files && event.target.files[0]) {
//         const img = event.target.files[0];

//         // Check if the image size exceeds 5MB
//         const isImageSizeBigger = checkImageSize(img);
//         if (isImageSizeBigger) {
//           toast.error(`Image should not be greater than 5 MB`);
//           return;
//         }

//         // No need to check image dimensions anymore
//         onPdfImageChange(img);

//         setImage(img);
//       }
//     },
//     [checkImageSize, onPdfImageChange]
//   );

//   useEffect(() => {
//     if (resetTrigger) {
//       handleRemoveImage();
//     }
//   }, [resetTrigger, handleRemoveImage]);
  
//   return (
//     <div className="flex items-center">
//       {image ? (
//         <div className="relative w-fit group" onClick={handleRemoveImage}>
//           <Image
//             src={URL.createObjectURL(image)}
//             alt="profile image"
//             width={188}
//             height={188}
//             className="object-cover rounded-md flex self-center w-[188px] h-[188px]"
//           />

//           <div className="absolute top-0 bottom-0 left-0 right-0 items-center justify-center hidden cursor-pointer group-hover:flex">
//             <CiTrash size={30} color="red" />
//           </div>
//         </div>
//       ) : (
//         <div
//           className="w-[188px] h-[188px] rounded-md flex items-center justify-center cursor-pointer bg-gray-50"
//           onClick={handleClick}
//         >
//           <div className="text-center" style={{ display: "ruby" }}>
//             <FaPlus className="text-center" size={18} color="#03F719" />
//             <div className="text-black text-center font-bold">
//               Click Here to Upload Photo
//             </div>
//           </div>
//         </div>
//       )}

//       <input
//         ref={imageInputRef}
//         hidden
//         type="file"
//         name="profileImage"
//         accept=".png, .jpg, .jpeg, .heic"
//         onChange={handleImageChange}
//       />
//     </div>
//   );
// };

// export default UploadImageForm;
