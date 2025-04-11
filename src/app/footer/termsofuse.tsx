import { FC } from "react";

const TermsofUse: FC = () => {
  return (
    <div className="modal-content ">
      <style jsx>{`
        .modal-content {
          border: 2px solid rgb(3 247 25);
          max-height: 80vh; /* Set maximum height for the modal content */
          overflow-y: auto; /* Enable vertical scroll if content exceeds max height */
          padding: 20px; /* Add padding */
          margin: 1rem; /* Add margin to create space from all sides */
          background-color: black; /* Background color */
          border-radius: 10px; /* Rounded corners */
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.5); /* Box shadow for depth */
          margin-top: 50px;
        }
      `}</style>
      <>
        <div className="font-bold mb-2">
          Welcome to I WANT IT . . . YOU GOT IT ?{" "}
        </div>
        <div className="font-bold mb-1">
            All sales are final.
        </div>
        <div className="mb-2">
          All Buyers and Sellers are encouraged to add shipping insurance in the event an item is damaged in shipping.  IWI is not responsible for damaged goods.
        </div>
        <div className="mb-2">
          Seller will not receive funds until Buyer receives item.
        </div>
        <div className="mb-2">
          IWI takes a flat transaction fee of 18% (Eighteen percent) that is paid by the Seller out of Seller’s proceeds.  This fee is deducted from the actual sales price of the item (excludes shipping & insurance).  Shipping & Insurance is additional and is negotiated between the Buyer and Seller and is added to the final sales price.  When applicable, state sales tax will be added to your invoice.
        </div>
        <div className="bg-dark-green text-black font-bold w-fit my-2">Please be advised and take notice:</div>
        I Want It…You Got It? is not a store and cannot accept return items. {" "}
        <a href="https://iwantityougotit.com/">IWantItYouGotIt.com</a> is an online gateway/platform connecting seekers of specific items with potential sellers.  Prior to purchase, please be fully informed to your satisfaction by the Owner/Seller of the item.  Ask all pertinent questions about the item and request up to 5 photos for visual inspection before purchase.  Any “Authentication” required on the part of the Buyer should be requested through communications with the Owner of the item and satisfied prior to your purchase.
        <div className="bg-dark-green text-black font-bold w-fit my-2 mb-2">What should a Buyer do if they don’t receive an item ?</div>
        <div className="mb-2">
          You are protected every time you buy an item on IWI.
        </div>
        <div className="mb-2">
          If your item gets lost in transit, never ships or is not marked as delivered by the shipping company we'll refund you your payment.
        </div>
        <div className="mb-2">
          Payment is only released to the Seller when the item is received.
        </div>
        <div className="mb-2">
        You can check the status of an item by going to your Member Profile where you can view purchases and check the item for current status.
        </div>
        <div className="mb-2">
        Sellers have up to 7 days from the date of purchase to ship an order.
        </div>
        <div className="mb-2">
        If a Seller doesn't ship an order within 7 days of purchase, Buyer has the option to cancel the order on the 8th day and get a full refund.
        </div>
        {/* <div className="bg-dark-green text-black font-bold w-fit my-2 mb-2">To cancel your order:</div> */}
        <div className="mb-2">
          To cancel your order:
        </div>
        <div className="mb-2">
        1. Go to Member Profile<br/>
        2. Select the item<br/>
        3. Select Item Status/Inquiry<br/>
        4. Select CANCEL ORDER
        Unshipped Orders will automatically cancel on the 14th day to ensure pending payment is reversed.<br/>
        </div>
        <div className="mb-[10px] bg-dark-green text-black font-bold w-fit">
          If your item has been marked “Delivered” but never arrived . . .
        </div>
        {/* <div className="bg-dark-green text-black font-bold w-fit my-2 mb-2">To cancel your order:</div> */}
        <div className="mb-2">
          To cancel your order:
        </div>
        <div className="mb-2">
        1. Go to Member Profile<br/>
        2. Select the item<br/>
        3. Go to ACTIONS / Pull Down Menu<br/>
        4. Select CANCEL ORDER </div>
      </>
    </div>
  );
};

export default TermsofUse;
