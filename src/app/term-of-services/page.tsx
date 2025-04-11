'use client'
import Head from "next/head";
import React, { useEffect } from "react";

const Page = () => {
  useEffect(()=>{
    window.scrollTo(0,0)

},[])
  return (
  <>
    <div className="p-3">
      <div className="bg-black border-2 border-bright-green p-2 lg:p-8">
        <div className="text-center text-2xl lg:text-4xl text-[30px] font-bold  tracking-wider mb-4 uppercase">
          - Terms of Service | Terms of Use on Website -
        </div>
        <div className="font-bold mb-2">
          Welcome to I WANT IT . . . YOU GOT IT ?{" "}
        </div>
        <div className="font-bold mb-1">All sales are final.</div>
        <div className="mb-2">
          All Buyers and Sellers are encouraged to add shipping insurance in the
          event an item is damaged in shipping. IWI is not responsible for
          damaged goods.
        </div>
        <div className="mb-2">
          Seller will not receive funds until Buyer receives item.
        </div>
        <div className="mb-2">
          IWI takes a flat transaction fee of 18% (eighteen percent) that is paid
          by the Seller out of Seller’s proceeds. This fee is deducted from the
          actual sales price of the item (excludes shipping & insurance).
          Shipping & Insurance is additional and is negotiated between the Buyer
          and Seller and is added to the final sales price. When applicable,
          state sales tax will be added to your invoice.
        </div>
        <div className="bg-dark-green text-black font-bold w-fit my-2">
          Please be advised and take notice:
        </div>
        I Want It…You Got It? is not a store and cannot accept return items.{" "}
        <a href="https://iwantityougotit.com/">IWantItYouGotIt.com</a> is an
        online gateway/platform connecting seekers of specific items with
        potential sellers. Prior to purchase, please be fully informed to your
        satisfaction by the Owner/Seller of the item. Ask all pertinent
        questions about the item and request up to 5 photos for visual
        inspection before purchase. Any “Authentication” required on the part of
        the Buyer should be requested through communications with the Owner of
        the item and satisfied prior to your purchase.
        <div className="bg-dark-green text-black font-bold w-fit my-2 mb-2">
          What should a Buyer do if they don’t receive an item ?
        </div>
        <div className="mb-2">
          You are protected every time you buy an item on IWI.
        </div>
        <div className="mb-2">
          If your item gets lost in transit, never ships or is not marked as
          delivered by the shipping company we'll refund you your payment.
        </div>
        <div className="mb-2">
          Payment is only released to the Seller when the item is received.
        </div>
        <div className="mb-2">
          You can check the status of an item by going to your Member Profile
          where you can view purchases and check the item for current status.
        </div>
        <div className="mb-2">
          Sellers have up to 7 days from the date of purchase to ship an order.
        </div>
        <div className="mb-2">
          If a Seller doesn't ship an order within 7 days of purchase, Buyer has
          the option to cancel the order on the 8th day and get a full refund.
        </div>
        {/* <div className="bg-dark-green text-black font-bold w-fit my-2 mb-2">To cancel your order:</div> */}
        <div className="mb-2">To cancel your order:</div>
        <div className="mb-2">
          1. Go to Member Profile
          <br />
          2. Select the item
          <br />
          3. Select Item Status/Inquiry
          <br />
          4. Select CANCEL ORDER Unshipped Orders will automatically cancel on
          the 14th day to ensure pending payment is reversed.
          <br />
        </div>
        <div className="mb-[10px] bg-dark-green text-black font-bold w-fit">
          If your item has been marked “Delivered” but never arrived . . .
        </div>
        {/* <div className="bg-dark-green text-black font-bold w-fit my-2 mb-2">To cancel your order:</div> */}
        <div className="mb-2">To cancel your order:</div>
        <div className="mb-2">
          1. Go to Member Profile
          <br />
          2. Select the item
          <br />
          3. Go to ACTIONS / Pull Down Menu
          <br />
          4. Select CANCEL ORDER{" "}
        </div>





        <div className="mb-[10px] bg-dark-green text-black font-bold w-fit">
        Prohibited Use, Items & Materials
        </div>
        {/* <div className="bg-dark-green text-black font-bold w-fit my-2 mb-2">To cancel your order:</div> */}
        <div className="mb-2">Users must comply with all applicable laws, the IWI terms of use, and all posted site rules.</div>
        <div className="mb-2">Here is a partial list of goods, services, and content prohibited on IWI:</div>
        <div className="mb-2">
  <div className="mb-1">1. weapons; firearms/guns and components; BB/pellet, stun, and spear guns; etc</div>
  <div className="mb-1">2. offers, solicitation, or facilitation of illegal prostitution and/or sex trafficking</div>
  <div className="mb-1">3. exploitation or endangerment of minors; child pornography</div>
  <div className="mb-1">4. recalled items; hazardous materials; body parts/fluids; unsanitized bedding/clothing</div>
  <div className="mb-1">5. prescription drugs, medical devices; controlled substances and related items</div>
  <div className="mb-1">6. alcohol or tobacco; unpackaged or adulterated food or cosmetics</div>
  <div className="mb-1">7. pet sales, animal parts, stud service</div>
  <div className="mb-1">8. endangered, imperiled and/or protected species and any parts thereof, e.g. ivory</div>
  <div className="mb-1">9. false, misleading, deceptive, or fraudulent content; bait and switch; keyword spam</div>
  <div className="mb-1">10. offensive, obscene, defamatory, threatening, or malicious postings or email</div>
  <div className="mb-1">11. anyone’s personal, identifying, confidential or proprietary information</div>
  <div className="mb-1">12. food stamps, WIC vouchers, SNAP or WIC goods, governmental assistance</div>
  <div className="mb-1">13. stolen property, property with serial number removed/altered, burglary tools, etc</div>
  <div className="mb-1">14. ID cards, licenses, police insignia, government documents, birth certificates, etc</div>
  <div className="mb-1">15. US military items not demilitarized in accord with Defense Department policy</div>
  <div className="mb-1">16. counterfeit, replica, or pirated items; tickets or gift cards that restrict transfer</div>
  <div className="mb-1">17. lottery or raffle tickets, sweepstakes entries, slot machines, gambling items</div>
  <div className="mb-1">18. spam; miscategorized, overposted content</div>
  <div className="mb-1">19. postings or email the primary purpose of which is to drive traffic to a website</div>
  <div className="mb-1">20. postings or email offering, promoting, or linking to unsolicited products or services</div>
  <div className="mb-1">21. affiliate marketing; network, or multi-level marketing; pyramid schemes</div>
  <div className="mb-3">22. any good, service, or content that violates the law or legal rights of others</div>
</div>

        <div className="mb-2 bg-dark-green w-fit text-black">Please don't use IWI for these purposes, and flag anyone else you see doing so.</div>
        <div className="mb-2">Thanks for helping keep <strong className="text-bright-green">I Want It . . .You Got It?</strong> safe and useful for everyone.
        </div>

        


      </div>
    </div>
  
  </>
  );
};

export default Page;

// export function generateMetadata() {
//   return {
//     title: "user page title",
//     description: "user page description 1",
//   };
// }