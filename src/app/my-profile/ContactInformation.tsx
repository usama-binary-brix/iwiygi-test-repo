"use client";
import Button from "@/components/button/Button";
import ButtonWithLoading from "@/components/button/ButtonWIthLoading";
import TextInput from "@/components/Form/TextInput";
import ButtonLoading from "@/components/generic/ButtonLoading";
import { useUpdateContactInformationMutation } from "@/store/api";
import { RootState } from "@/store/store";
import { AxiosError } from "axios";
import { ErrorMessage, Field, Formik } from "formik";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import * as Yup from "yup";

interface FormValues {
  username: string;
  email: string;
  password: string;
  re_password: string;
  fullname: string;
  phonenumber: string;
}

const initialValues: FormValues = {
  username: "",
  email: "",
  password: "",
  re_password: "",
  fullname: "",
  phonenumber: "",
};

const validationSchema = Yup.object({
  username: Yup.string().required("UserName Required"),
  email: Yup.string().email("Invalid email format").required("Email Required"),
 
});

const ContactInformation = ({ userDetail }: any) => {
 
  const user = useSelector((state: RootState) => state.user.user);
  const [updateContactInformation, {isLoading:loading, error}] = useUpdateContactInformationMutation();

  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    email: Yup.string().email("Invalid email format").required("Email is required"),
    password: Yup.string(),
    re_password: Yup.string().oneOf([Yup.ref("password")], "Passwords must match"),
    fullname: Yup.string().required("Full name is required"),
    // phonenumber: Yup.string()
    //   .matches(/^\d+$/, "Phone number must contain only digits")
    //   .required("Phone number is required"),
  });

  const initialValues = {
    username: user?.username || "",
    email: user?.email || "",
    password: "",
    re_password: "",
    fullname: user?.fullname || "",
    phonenumber: user?.phonenumber || "1234567890",
  };

  const handleUpdateProfile = async (values: any) => {
    try {
      await updateContactInformation(values).unwrap();
      toast.success("Contact information updated successfully!");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update contact information");
    }
  };


 
 
  // const [showChangePasswordPopup, setShowChangePasswordPopup] = useState(false);
  // const [error, setError] = useState("");
  // const [loading, setLoading] = useState(false);
  // const [initialValues, setInitialValues] = useState<FormValues>({
  //   username: "",
  //   email: "",
  //   password: "",
  //   re_password: "",
  //   fullname: "",
  //   phonenumber: "",
  // });

  // interface ErrorResponse {
  //   message: string;
  // }

  // useEffect(() => {
  //   if (userDetail) {
  //     setInitialValues((prevValues) => ({
  //       ...prevValues,
  //       ...userDetail, 
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
  //     if (values.password !== values.re_password) {
  //       toast.error("Both Passwords Should be the Same");
  //       return;
  //     }
  //     setLoading(true);

  //     const UpdateProfilePostApi = `${process.env.NEXT_PUBLIC_API}/api/auth/updateContactInformation`;
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
  //       setLoading(false);

  //       toast.success("Profile Updated successfully!");
  //       setShowChangePasswordPopup(false);
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
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          await handleUpdateProfile(values);
        }}
      >
        {({ handleSubmit, handleChange, values }) => (
          <form
            onSubmit={handleSubmit}
            className="flex justify-center flex-col items-center"
          >
            <div className="flex flex-col gap-6 w-full md:max-w-[70%] lg:max-w-[65%] xl:max-w-[43%]">
              <div>
                {/* <label htmlFor="username">FULLNAME:</label> */}
                <Field
                  name="fullname"
                  as={TextInput}
                  label="full name"
                  placeholder='Enter Full Name'
                  value={values.fullname}
                  onChange={handleChange}
                />
                <ErrorMessage
                  name="fullname"
                  component="div"
                  className="text-red-500"
                />
              </div>
              {/* <div>
                <label htmlFor="username">PHONE NO:</label>
                <Field
                  name="phonenumber"
                  as={TextInput}
                  label="PHONE NUMBER"
                  placeholder='Enter Phone Number'

                  value={values.phonenumber}
                  onChange={handleChange}
                />
                <ErrorMessage
                  name="phonenumber"
                  component="div"
                  className="text-red-500"
                />
              </div> */}
              <div>
                {/* <label htmlFor="username">USERNAME:</label> */}
                <Field
                  name="username"
                  as={TextInput}
                  label="USERNAME"
                  readOnly
                  placeholder='Enter Username'

                  value={values.username}
                  onChange={handleChange}
                />
                <ErrorMessage
                  name="username"
                  component="div"
                  className="text-red-500"
                />
              </div>

              <div>
                <Field
                  name="email"
                  type="email"
                  label="EMAIL"
                  placeholder='Enter Email'

                  as={TextInput}
                  value={values.email}
                  onChange={handleChange}
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500"
                />
              </div>

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

export default ContactInformation;
