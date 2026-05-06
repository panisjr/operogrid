"use client";

import { ConsumptionGroupedByClient, TerminalNode } from "@/lib/types";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";

interface TodoContextType {
  terminalNodeData: TerminalNode[];
  consumptionGroupData: ConsumptionGroupedByClient[];
  isLoading: boolean;
  refreshData: () => Promise<void>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  fvKill: string;
  setFVKill: React.Dispatch<React.SetStateAction<string>>;
  setTerminalNodeData: React.Dispatch<React.SetStateAction<TerminalNode[]>>;
  setConsumptionGroupData: React.Dispatch<
    React.SetStateAction<ConsumptionGroupedByClient[]>
  >;
}

const TodoContex = createContext<TodoContextType | undefined>(undefined);

export function TodoProvider({ children }: { children: React.ReactNode }) {
  const [terminalNodeData, setTerminalNodeData] = useState<TerminalNode[]>([]);
  const [consumptionGroupData, setConsumptionGroupData] = useState<
    ConsumptionGroupedByClient[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fvKill, setFVKill] = useState<string>("");
  const hasFetchedRef = useRef<boolean>(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      const [res1, res2] = await Promise.all([
        // fetch("/data/terminal_nodes.json"),
        // fetch("/data/consumption_data.json"),
        fetch("/data/2026-04-02/filtered_terminal_nodes.json"),
        fetch("/data/2026-04-02/consumption_data.json"),
      ]);

      const [data1, data2] = await Promise.all([res1.json(), res2.json()]);

      setTerminalNodeData(data1);
      setConsumptionGroupData(data2);

      toast.success("Data loaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (hasFetchedRef.current) return;

    fetchData();
    hasFetchedRef.current = true;
  }, []);

  return (
    <TodoContex.Provider
      value={{
        terminalNodeData,
        consumptionGroupData,
        isLoading,
        setIsLoading,
        refreshData: fetchData,
        fvKill,
        setFVKill,
        setTerminalNodeData,
        setConsumptionGroupData,
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