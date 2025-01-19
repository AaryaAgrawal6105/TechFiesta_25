import { createContext, useContext, useState } from 'react';

const UIContext = createContext({});

export const UIProvider = ({ children }) => {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <UIContext.Provider value={{
      isHistoryOpen,
      setIsHistoryOpen,
      isProfileOpen,
      setIsProfileOpen
    }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => useContext(UIContext);