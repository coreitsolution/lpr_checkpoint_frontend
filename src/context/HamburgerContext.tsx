import React, { createContext, useContext, useState } from "react";

interface HamburgerContextType {
  isOpen: boolean;
  toggleMenu: () => void;
}

const HamburgerContext = createContext<HamburgerContextType | undefined>(
  undefined
);

export const HamburgerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <HamburgerContext.Provider value={{ isOpen, toggleMenu }}>
      {children}
    </HamburgerContext.Provider>
  );
};

export const useHamburger = () => {
  const context = useContext(HamburgerContext);
  if (!context) {
    throw new Error("useHamburger must be used within a HamburgerProvider");
  }
  return context;
};
