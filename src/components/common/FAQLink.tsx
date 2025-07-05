import React from "react";
import { MessageCircleQuestion } from "lucide-react";

interface FAQLinkProps {
  isExpanded: boolean;
  isHovered: boolean;
  isMobileOpen: boolean;
}

const FAQLink: React.FC<FAQLinkProps> = ({
  isExpanded,
  isHovered,
  isMobileOpen,
}) => {
  return (
    <div className="mt-6">
      <a
        href="https://peakprofitfunding.com/faq"
        target="_blank"
        rel="noopener noreferrer"
        className="menu-item group menu-item-inactive"
      >
        <span className="menu-item-icon-size menu-item-icon-inactive">
          <MessageCircleQuestion />
        </span>
        {(isExpanded || isHovered || isMobileOpen) && (
          <span className="menu-item-text">FAQ</span>
        )}
      </a>
    </div>
  );
};

export default FAQLink;
