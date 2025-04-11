import { FC } from "react";

const ContactUs: FC = () => {
  return (
    <div className="modal-content">
      <style jsx>{`
        .modal-content {
          border: 2px solid rgb(3 247 25);
          max-height: 80vh; /* Set maximum height for the modal content */
          overflow-y: auto; /* Enable vertical scroll if content exceeds max height */
          padding: 20px; /* Add padding */
          margin: 1rem; /* Add margin to create space from all sides */
          background-color: black; /* Background color */
          border-radius: 10px; /* Rounded corners */
          box-shadow: 0 0 10px rgba(228, 15, 15, 0.5); /* Box shadow for depth */
        }
      `}</style>
      <div>

        <div className="bg-dark-green text-black font-bold w-fit">
            Email:
          </div>
 
        <div className="mb-2">Contact@IWantItYouGotIt.com </div>
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
          <b>(725) 205-3398</b>
          <br />
          9AM – 5PM PST / Monday – Friday
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
