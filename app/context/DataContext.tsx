"use client";

import { UserMeta } from "@/lib/types";
import React, { createContext, useContext, useState } from "react";

interface DataContextType {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  currentUser: UserMeta;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserMeta>>;
}
interface DataProviderProps {
  children: React.ReactNode;
  initialUser: UserMeta;
}

const DataContex = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children, initialUser }: DataProviderProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserMeta>(initialUser);

  return (
    <DataContex.Provider
      value={{
        isLoading,
        currentUser,
        setCurrentUser,
        setIsLoading,
      }}
    >
      {children}
    </DataContex.Provider>
  );
}

export function useData() {
  const context = useContext(DataContex);

  if (!context) {
    throw new Error("useData must be used inside DataProvider");
  }

  return context;
}
