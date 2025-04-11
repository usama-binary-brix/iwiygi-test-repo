"use client";
import React, { FC, useState, useEffect } from "react";
import BottomNav from "@/components/BottomNav";
import TopNav from "@/components/TopNav";
import ContactUs from "@/app/footer/contactus";
import Faqs from "@/app/footer/faq";
import PrivacyPolicy from "@/app/footer/privacypolicy";
import TermsofUse from "@/app/footer/termsofuse";

export interface AppContainerProps {
  children: React.ReactNode;
}

const AppContainer: FC<AppContainerProps> = ({ children }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode | null>(
    null
  );
  const handleFaqClick = () => {
    setShowModal(true);
    setModalContent(<Faqs />);
  };

  const handleContactUsClick = () => {
    setShowModal(true);
    setModalContent(<ContactUs />);
  };

  const handlePrivacyPolicyClick = () => {
    setShowModal(true);
    setModalContent(<PrivacyPolicy />);
  };

  const handleTermsofUseClick = () => {
    setShowModal(true);
    setModalContent(<TermsofUse />);
  };
  useEffect(() => {
    <TopNav />;
  }, []);
  return (
    <div className="flex flex-col h-screen relative">
      <TopNav />
      <div className="flex flex-1 flex-col">{children}</div>
      <BottomNav
        onFaqClick={handleFaqClick}
        onContactUsClick={handleContactUsClick}
        onPrivacyPolicyClick={handlePrivacyPolicyClick}
        onTermsofUseClick={handleTermsofUseClick}
      />
      {showModal && (
        <div className="fixed top-[30px] md:top-[70px] lg:top-[50px] left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="p-4 rounded-lg flex overflow-auto">
            {modalContent}
            <button
              className="bg-dark-green h-fit text-black rounded-[50%] px-[10px] py-[10px] font-bold text-[12px] bold flex justify-end mt-[50px] xl:mt-10 md:mt-[50px] lg:mt-10"
              onClick={() => setShowModal(false)}
            >
              X
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppContainer;
