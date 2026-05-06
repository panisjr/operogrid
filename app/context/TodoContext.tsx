"use client";

import React, {
  createContext,
  useContext,
  useState,
} from "react";

interface TodoContextType {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const TodoContex = createContext<TodoContextType | undefined>(undefined);

export function TodoProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <TodoContex.Provider
      value={{
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </TodoContex.Provider>
  );
}

export function useTodos() {
  const context = useContext(TodoContex);

  if (!context) {
    throw new Error("useTodos must be used inside DataProvider");
  }

  return context;
}