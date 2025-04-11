import React from "react";
import { IoClose } from "react-icons/io5";
import Image from "next/image";
import Button from "../button/Button";

interface ShippingCalculatorProps {
  show: boolean;
  handleClose: () => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleCalculate: () => void;
  loading: boolean;
  shippingRate: number | null;
  packageData: {
    weight: string;
    weightUnit: string;
    length: string;
    width: string;
    height: string;
  };
}

const ShippingCalculationModal: React.FC<ShippingCalculatorProps> = ({
  show,
  handleClose,
  handleInputChange,
  handleCalculate,
  loading,
  shippingRate,
  packageData,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="p-5">
        <div className="bg-black p-4 rounded-lg relative max-w-[40rem] max-h-[90vh] overflow-auto mt-3">
          <button onClick={handleClose} className="absolute top-2 right-2 text-white font-bold">
            <IoClose className="text-[2rem]" />
          </button>

          <div className="flex justify-center">
            <Image
              src="/images/ive-got.png"
              alt="Perfume"
              width={190}
              height={70}
              className="cursor-pointer mb-[12px] max-w-[50%] md:max-w-[100%]"
            />
          </div>

          <h2 className="text-lg font-semibold text-center text-bright-green my-2">
            - Calculate Shipping Charges -
          </h2>

          {/* Package Information Section */}
          <div className="flex justify-center">
            <h2 className="text-lg font-semibold mb-2 text-green-400">Package Information</h2>
          </div>

          <div className="pb-3">
            {/* Weight Input */}
            <div className="flex flex-col md:flex-row items-start md:items-center mb-2">
              <label className="mr-3 w-3/4 text-lg font-semibold">Weight</label>
              <div className="flex w-full">
                <input
                  name="weight"
                  onChange={handleInputChange}
                  type="text"
                  value={packageData.weight}
                  placeholder="Enter Weight"
                  className="border border-gray-300 p-2 focus:outline-none focus:ring-2 w-3/4 text-black"
                />
                <select
                  name="weightUnit"
                  onChange={handleInputChange}
                  value={packageData.weightUnit}
                  className="border border-gray-300 p-2 ml-1 focus:outline-none focus:ring-2 w-1/4 text-black"
                >
                  <option value="kg">kg</option>
                  <option value="g">g</option>
                  <option value="lbs">lbs</option>
                  <option value="oz">oz</option>
                </select>
              </div>
            </div>

            {/* Dimensions Input */}
            <div className="flex flex-col md:flex-row items-start md:items-center mb-2">
              <label className="w-3/4 text-lg font-semibold">
                Dimension <span className="text-sm">(L x W x H) inches</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  name="length"
                  onChange={handleInputChange}
                  value={packageData.length}
                  type="number"
                  placeholder="---"
                  className="border border-gray-300 p-2 focus:outline-none focus:ring-2 w-full text-black"
                />
                X
                <input
                  name="width"
                  onChange={handleInputChange}
                  value={packageData.width}
                  type="number"
                  placeholder="---"
                  className="border border-gray-300 p-2 focus:outline-none focus:ring-2 w-full text-black"
                />
                X
                <input
                  name="height"
                  onChange={handleInputChange}
                  value={packageData.height}
                  type="number"
                  placeholder="---"
                  className="border border-gray-300 p-2 focus:outline-none focus:ring-2 w-full text-black"
                />
              </div>
            </div>

            {/* Calculate Button & Shipping Price Display */}
            <div className="flex flex-col justify-center items-center">
              <Button text="Calculate Shipping Rate" type="success" onClick={handleCalculate} loading={loading} />
              {shippingRate !== null && (
                <p className="mt-3 text-lg font-semibold text-bright-green">
                  Shipping Charges: ${shippingRate}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingCalculationModal;
