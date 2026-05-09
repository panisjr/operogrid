"use client";

import { UserMeta } from "@/lib/types";
import React, { createContext, useContext, useState } from "react";

interface DataContextType {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}
interface DataProviderProps {
  children: React.ReactNode;
  initialUser: UserMeta | null;
}

const DataContex = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children, initialUser }: DataProviderProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserMeta>(initialUser);

  return (
    <DataContex.Provider
      value={{
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </DataContex.Provider>
  );
}

export function useTodos() {
  const context = useContext(DataContex);

  if (!context) {
    throw new Error("useTodos must be used inside DataProvider");
  }

  return context;
}
