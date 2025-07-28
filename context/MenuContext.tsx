import React, { createContext, useState, useContext } from 'react';

const MenuContext = createContext({
  isOpen: false,
  toggleMenu: () => {
  },
});

export const useMenu = () => useContext(MenuContext);

export const MenuProvider = ({ children }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(prev => !prev);

  return (
    <MenuContext.Provider value={{ isOpen, toggleMenu }}>
      {children}
    </MenuContext.Provider>
  );
};
