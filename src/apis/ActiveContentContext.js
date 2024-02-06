import React, { createContext, useContext, useState, useEffect } from "react";

const ActiveContentContext = createContext();

export const useActiveContent = () => {
  const context = useContext(ActiveContentContext);
  if (!context) {
    throw new Error(
      "useActiveContent must be used within an ActiveContentProvider"
    );
  }
  return context;
};

export const ActiveContentProvider = ({ children }) => {
  const [activeContent, setActiveContent] = useState(() => {
    // Retrieve the active content from sessionStorage on component mount
    return sessionStorage.getItem("activeContent") || "profil";
  });

  const setNewActiveContent = (content) => {
    setActiveContent(content);
  };

  useEffect(() => {
    // Save the active content to sessionStorage whenever it changes
    sessionStorage.setItem("activeContent", activeContent);
  }, [activeContent]);

  return (
    <ActiveContentContext.Provider
      value={{ activeContent, setNewActiveContent }}
    >
      {children}
    </ActiveContentContext.Provider>
  );
};
