"use client";
import TextInput from "@/components/Form/TextInput";
import { FC, useState, useEffect } from "react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import Button from "@/components/button/Button";

interface FormValues {
  sellerId: string;
  name: string;
  exemption_type: string;
  country: string;
  state: string;
  city: string;
  street: string;
  zip: string;
}

const initialValues: FormValues = {
  sellerId: "",
  name: "",
  exemption_type: "",
  country: "US",
  state: "",
  city: "",
  street: "",
  zip: "",
};

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

const StateTaxCreateCustomer = () => {
  const [formValues, setFormValues] = useState<FormValues>(initialValues);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("User");
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        setFormValues((prevValues) => ({
          ...prevValues,
          sellerId: String(parsedUser.id || ""), // Ensure sellerId is always a string
        }));
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
      }
    }
  }, []);
  

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    setError("");

    try {
      let accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        toast.error("Access token not found");
        setLoading(false);
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/tax/create-customer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            ...formValues,
            exempt_regions: [{ country: "US", state: formValues.state }],
          }),
        }
      );

      if (!response.ok) {
        const responseData = await response.json();
        toast.error(responseData.message);
      } else {
        const responseData = await response.json();
        toast.success(responseData.message);
        setFormValues(initialValues);
      }
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      setError(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
    setLoading(false);
  };
  const exemptionTypes = [
    "WholeSale",
    "Retail",
    "Normal customer",
    "Non Profit",
    "Others",
  ];

  return (
    <form className="flex flex-col items-center gap-16">
      <div className="flex flex-col gap-6 w-full md:max-w-[70%] lg:max-w-[65%] xl:max-w-[43%]">
        <TextInput
          label="Seller ID"
          name="sellerId"
          value={formValues.sellerId}
          disabled
        />
        <TextInput
          label="Name"
          name="name"
          value={formValues.name}
          onChange={handleChange}
          placeholder="Enter Your Name"
        />
        {/* <TextInput label="Exemption Type" name="exemption_type" value={formValues.exemption_type} onChange={handleChange} placeholder="Enter Exemption Type" /> */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-9 w-full">
          <label
            className={
              "flex md:ml-1 font-bold text-lg sm:text-xl  lg:w-[52%] capitalize"
            }
          >
            exemption type
          </label>
          <select
            name="exemption_type"
            value={formValues.exemption_type}
            onChange={handleChange}
            className="border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-black"
          >
            <option value="" disabled>
              Select an exemption type
            </option>
            {exemptionTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
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
            value={formValues?.state?.toString()}
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

        <TextInput
          label="City"
          name="city"
          value={formValues.city}
          onChange={handleChange}
          placeholder="Enter City"
        />
        <TextInput
          label="Street"
          name="street"
          value={formValues.street}
          onChange={handleChange}
          placeholder="Enter Street Address"
        />
        <TextInput
          label="Zip Code"
          name="zip"
          value={formValues.zip}
          onChange={handleChange}
          placeholder="Enter Zip Code"
        />
        <div className="flex justify-end mt-4">
          <Button
            type="success"
            text="Submit"
            loading={loading}
            onClick={handleSubmit}
          />
        </div>
      </div>
      {error && <div className="text-red-500">{error}</div>}
    </form>
  );
};

export default StateTaxCreateCustomer;
