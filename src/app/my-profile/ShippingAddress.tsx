"use client";
import TextInput from "@/components/Form/TextInput";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { Formik } from "formik";
import ButtonWithLoading from "@/components/button/ButtonWIthLoading";
import Button from "@/components/button/Button";
import { useUpdateShippingAddressMutation } from "@/store/api";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setUser } from "@/store/Slices/userSlice";

interface FormValues {
  streetAddress: String;
  city: String;
  zipCode: String;
  houseNumber: String;
  state: String;
}
interface ErrorResponse {
  message: string;
}

const ShippingAddress = ({ userDetail }: any) => {

  const dispatch = useDispatch();


  const states = {
    Alabama: "AL",
    Alaska: "AK",
    Arizona: "AZ",
    Arkansas: "AR",
    California: "CA",
    Colorado: "CO",
    Connecticut: "CT",
    Delaware: "DE",
    Florida: "FL",
    Georgia: "GA",
    Hawaii: "HI",
    Idaho: "ID",
    Illinois: "IL",
    Indiana: "IN",
    Iowa: "IA",
    Kansas: "KS",
    Kentucky: "KY",
    Louisiana: "LA",
    Maine: "ME",
    Maryland: "MD",
    Massachusetts: "MA",
    Michigan: "MI",
    Minnesota: "MN",
    Mississippi: "MS",
    Missouri: "MO",
    Montana: "MT",
    Nebraska: "NE",
    Nevada: "NV",
    "New Hampshire": "NH",
    "New Jersey": "NJ",
    "New Mexico": "NM",
    "New York": "NY",
    "North Carolina": "NC",
    "North Dakota": "ND",
    Ohio: "OH",
    Oklahoma: "OK",
    Oregon: "OR",
    Pennsylvania: "PA",
    "Rhode Island": "RI",
    "South Carolina": "SC",
    "South Dakota": "SD",
    Tennessee: "TN",
    Texas: "TX",
    Utah: "UT",
    Vermont: "VT",
    Virginia: "VA",
    Washington: "WA",
    "West Virginia": "WV",
    Wisconsin: "WI",
    Wyoming: "WY",
  };

  const [activeTab, setActiveTab] = useState<string>("shippingAddress");
  const [error, setError] = useState("");
  const user = useSelector((state: RootState) => state?.user?.user);

  const initialValues: FormValues = {
    streetAddress: userDetail?.streetAddress || "",
    city: userDetail?.city || "",
    zipCode: userDetail?.zipCode || "",
    houseNumber: userDetail?.houseNumber || "0",
    state: userDetail?.state || "",
  };

  const [updateShippingAddress, { isLoading: loading }] =
    useUpdateShippingAddressMutation();

const handleUpdateProfile = async (values: FormValues) => {
  try {
    const response = await updateShippingAddress(values).unwrap();
    console.log(response, 'response')

    if (response && response?.user) {
      localStorage.setItem("User", JSON.stringify(response.user));
      // dispatch(setUser(response.user));
    }

    toast.success("Shipping address updated successfully!");
  } catch (error: any) {
    toast.error(error?.data?.message || "Failed to update shipping address");
  }
};

  // useEffect(() => {
  //   if (userDetail) {
  //     setInitialValues((prevValues) => ({
  //       ...prevValues,
  //       ...userDetail, // Spread the keys from userDetail into the state
  //     }));
  //   }
  // }, [userDetail]);

  // const handleUpdateProfile = async (values: FormValues) => {
  //   try {
  //     let accessToken = localStorage.getItem("accessToken");
  //     if (!accessToken) {
  //       toast.error("Access token not found");
  //       return;
  //     }
  //     setLoading(true);
  //     const UpdateProfilePostApi = `${process.env.NEXT_PUBLIC_API}/api/auth/updateShippingAddress`;
  //     const response = await fetch(UpdateProfilePostApi, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //       body: JSON.stringify(values),
  //     });

  //     if (!response.ok) {
  //       const responseData = await response.json();
  //       setError(responseData.message);
  //       setLoading(false);
  //     } else {
  //       toast.success("Profile Updated successfully!");
  //       setLoading(false);
  //     }
  //   } catch (err) {
  //     setLoading(false);

  //     const error = err as AxiosError<ErrorResponse>;
  //     setError(
  //       error.response?.data?.message || "An error occurred. Please try again."
  //     );
  //   }
  // };

  return (
    <>
      <Formik<FormValues>
        enableReinitialize={true}
        initialValues={initialValues}
        // validationSchema={validationSchema}
        onSubmit={async (values) => {
          await handleUpdateProfile(values);
        }}
      >
        {({ handleSubmit, handleChange, values }) => (
          <form
            className="flex justify-center flex-col items-center"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col gap-6 w-full md:max-w-[70%] lg:max-w-[65%] xl:max-w-[43%]">
              {/* <TextInput
            name="state"
            label="State"
            onChange={(e) => setHouseNumber(e.target.value)}
            placeholder="ENTER YOUR STATE"
          /> */}

              <TextInput
                name="streetAddress"
                label="Street Address"
                onChange={handleChange}
                value={values?.streetAddress?.toString()}
                placeholder="Enter Your Street Address"
              />
              <TextInput
                type="text"
                name="city"
                label="City"
                onChange={handleChange}
                value={values?.city?.toString()}
                placeholder="Enter Your City"
              />

              <div className="flex flex-col lg:flex-row lg:items-center lg:gap-9 w-full">
                <label
                  className={
                    "flex md:ml-1 font-bold text-lg sm:text-xl  lg:w-[50%] capitalize"
                  }
                >
                  State
                </label>
                <select
                  onChange={handleChange}
                  value={values?.state?.toString()}
                  name="state"
                  className="border border-gray-300 p-2 md:ml-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-black"
                >
                  <option value="" disabled>
                    Select a state
                  </option>
                  {Object.entries(states).map(([stateName]) => (
                    <option key={stateName} value={stateName}>
                      {stateName}
                    </option>
                  ))}
                </select>
              </div>
              {/* <TextInput
                name="houseNumber"
                label="House/Office Number"
                onChange={handleChange}
                value={values?.houseNumber?.toString()}
                placeholder="ENTER YOUR HOUSE/OFFICE NUMBER"
              /> */}

              <TextInput
                name="zipCode"
                label="Zip Code"
                onChange={handleChange}
                value={values?.zipCode?.toString()}
                placeholder="Enter Zip Code"
              />
              {error && <div className="text-red-500">{error}</div>}
              <div className="flex justify-end">
                <Button
                  type="success"
                  text="Submit"
                  loading={loading}
                  onClick={handleSubmit}
                />
              </div>
            </div>
          </form>
        )}
      </Formik>
    </>
  );
};

export default ShippingAddress;
