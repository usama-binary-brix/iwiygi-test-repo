'use client';
import Button from "@/components/button/Button";
import TextArea from "@/components/Form/TextArea";
import TextInput from "@/components/Form/TextInput";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";


interface FormData {
  fullname: string;
  email: string;
  message: string;
}

interface FormErrors {
  fullname?: string;
  email?: string;
  message?: string;
}

const ContactUs = () => {
  const [formData, setFormData] = useState<FormData>({
    fullname: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState<boolean>(false);
useEffect(()=>(
  window.scrollTo(0,0)
),[])

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.fullname.trim()) {
      newErrors.fullname = "Full Name is required.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required.";
    }

    return newErrors;
  };

  const handleSubmit = async (e: any) => {
    // e.preventDefault();
    const newErrors = validate();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setLoading(true);
      try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API}/api/contact`, formData);

        toast.success("Message sent successfully!");
        console.log("Form submitted successfully:", response.data);

        setFormData({ fullname: "", email: "", message: "" });
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Failed to send the message.");
        console.error("Error submitting form:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="p-4">
      <div className="bg-black border-2 border-bright-green p-2 lg:p-8">
        <div className="text-center text-2xl lg:text-4xl text-[30px] font-bold  tracking-wider mb-4 uppercase">
          - Contact Us -
        </div>
        <div className="flex justify-between flex-col md:flex-row mt-10 gap-10">
          <form className="md:w-[60%]">
            <div className="flex flex-col gap-6 w-full">
              <TextInput
                name="fullname"
                label="FULL NAME"
                placeholder="Enter Your Full Name"
                value={formData.fullname}
                onChange={handleChange}
              />
              {errors.fullname && (
                <p className="text-red-500 text-sm">{errors.fullname}</p>
              )}

              <TextInput
                label="EMAIL"
                name="email"
                type="email"
                placeholder="Enter Your Email Address"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}

              <TextArea
                label="MESSAGE"
                name="message"
                placeholder="Enter message"
                value={formData.message}
                onChange={handleChange}
              />
              {errors.message && (
                <p className="text-red-500 text-sm">{errors.message}</p>
              )}
            </div>
            <div className="flex flex-col md:flex-row">
              <div className="flex justify-end w-full pt-5 pb-2">
                {/* <button
                  type="submit"
                  disabled={loading}
                  className={`bg-dark-green text-black rounded-lg px-4 py-2 uppercase font-bold text-lg lg:text-2xl  w-[fit-content] ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Submitting..." : "Submit"}
                </button> */}

<Button
text="Submit"
type={'success'}
loading={loading}
onClick={handleSubmit}
/>


              </div>
            </div>
          </form>
          <div>
            <div className="bg-dark-green text-black font-bold w-fit">Email:</div>

            <Link href="mailto:Contact@IWantItYouGotIt.com" className="mb-2">
              Contact@IWantItYouGotIt.com{" "}
            </Link>
            <div className="bg-dark-green text-black font-bold w-fit my-1">
              Mailing Address:
            </div>
            <div className="mb-3">
              <b>I Want It, LLC.</b>
              <br />
              9101 W. Sahara Ave Suite 105, #1074 Las Vegas, NV 89117
            </div>

            <div className="bg-dark-green text-black font-bold w-fit my-1">
              Phone:
            </div>
            <div>
              <Link href="tel:(725) 205-3398">(725) 205-3398</Link>
              <br />
              9AM – 5PM PST / Monday – Friday
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
