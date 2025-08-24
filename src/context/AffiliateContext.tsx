import React, { createContext, useContext, useState } from "react";
import {
  AffiliateDetails,
  affiliateDetailsData,
} from "../pages/AdminPages/Affiliate/ManageAffiliates/AffiliateDetails/components";

interface AffiliatesContextType {
  affiliates: AffiliateDetails[];
  setAffiliates: React.Dispatch<React.SetStateAction<AffiliateDetails[]>>;
}

const AffiliatesContext = createContext<AffiliatesContextType | undefined>(
  undefined
);

export const AffiliatesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [affiliates, setAffiliates] = useState<AffiliateDetails[]>(
    Object.values(affiliateDetailsData)
  );
  return (
    <AffiliatesContext.Provider value={{ affiliates, setAffiliates }}>
      {children}
    </AffiliatesContext.Provider>
  );
};

// Custom hook for consuming context
export const useAffiliates = () => {
  const context = useContext(AffiliatesContext);
  if (!context) {
    throw new Error("useAffiliates must be used within an AffiliatesProvider");
  }
  return context;
};
