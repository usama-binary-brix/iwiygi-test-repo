import React, { useState } from 'react'

interface AccordionProps {
    title: string;
    children: React.ReactNode;
  }
  
  export const MessageAccordion = ({ title, children }: AccordionProps) => {
    const [isOpen, setIsOpen] = useState(false);
  
    const toggleAccordion = () => setIsOpen(!isOpen);
  
    return (
      <div className="mb-1">
        <div
          onClick={toggleAccordion}
          className=" cursor-pointer rounded-t"
        >
          <span>{title}</span>
        </div>
        {isOpen && <div className="p-4 rounded-b">{children}</div>}
      </div>
    );
  };
  
export default MessageAccordion