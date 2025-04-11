'use client'
import { useEffect, useState } from "react";

const Page = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index:any) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  useEffect(()=>(
    window.scrollTo(0,0)
  ),[])

  const faqs = [
    {
      question: "Do I have to be a member to browse listings?",
      answer: `You do NOT have to be a member to browse listings. When you respond to a listing for the first time, you’ll be directed to our Free, Quick & Easy 
      <a className="text-dark-green" href="/sign-up">Sign-Up Page</a>.`,
    },
    {
      question: "Are all listings free?",
      answer:
        "Yes – You can post your wanted items for free. You must visit your profile once a month to keep your listings active.",
    },
    {
      question: "Are there any fees?",
      answer:
        "IWI takes a flat transaction fee of 18% of the actual item cost paid by the Seller of the goods. Shipping is additional which is negotiated between the Buyer and Seller and is added to the final sales. When applicable, tax will also be invoiced.",
    },
    {
      question: "How can I edit my listing?",
      answer: "Edits for listings are self-service. You can edit from your account homepage.",
    },
    {
      question: "How soon does my listing expire?",
      answer:
        "You must visit your profile once a month to keep your listings active.",
    },
    {
      question: "How can I de-activate or delete my listing?",
      answer:
        "De-activate or delete your posting from your account homepage. Please note, you must visit your profile at least once a month to keep your listings active.",
    },
    {
      question: "How can I post anonymously and still receive responses?",
      answer:
        "All listings on IWI are anonymous, and 2-way communication between seeker and owner of items is facilitated exclusively via the IWI Platform. Providing private/personal emails/addresses/phone numbers is prohibited.",
    },
    {
      question: "Can I add a picture to my listing?",
      answer:
        'You are offered the option to "Add Image" during the listing process. Photos can be uploaded by responders to your listings.',
    },
    {
      question: "What kind of postings are prohibited?",
      answer: `Please consult the IWI Terms of Use. For your reference, there is also a non-comprehensive list of Prohibited Items.`,
    },
    {
      question: "Prohibited Use, Content, Items & Materials",
      answer: `Users must comply with all applicable laws, the IWI Terms Of Use, and all posted site rules. Here is a partial list of goods, services, and content prohibited on IWI:
        <ul className="list-disc pl-5">
          <li>Weapons, firearms, ammunition, and explosives.</li>
          <li>Prostitution, sex trafficking, and recalled items.</li>
          <li>Alcohol, tobacco, counterfeit goods, and more.</li>
        </ul>
        Please flag any violations. Thanks for helping keep IWI safe!`,
    },
  ];

  return (
    <div className="p-3">
      <div className="bg-black border-2 border-bright-green p-4 lg:p-8">
        <div className="text-center text-2xl lg:text-4xl font-bold  tracking-wider mb-6 uppercase">
          - FAQ -
        </div>
        {faqs.map((faq, index) => (
          <div key={index} className="mb-4">
            <button
              onClick={() => toggleAccordion(index)}
              className="w-full text-left border border-bright-green text-dark-green font-bold px-4 py-2"
            >
              {faq.question}
            </button>
            {openIndex === index && (
              <div
                className="bg-gray-800 text-white px-4 py-2"
                dangerouslySetInnerHTML={{ __html: faq.answer }}
              ></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
