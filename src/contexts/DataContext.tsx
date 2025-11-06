import { createContext, useState, useEffect, use } from "react";
import type { ReactNode } from "react";

const BATTLE_API_URL: string | undefined = import.meta.env
  .VITE_APP_Pokemon_Battle_API_URL as string | undefined;
if (!BATTLE_API_URL)
  throw new Error(
    "VITE_APP_Pokemon_Battle_API_URL is required, are you missing a .env file?"
  );
const baseURL: string = `${BATTLE_API_URL}/pokemon`;

export const DataContext = createContext<DataContextType | undefined>(
  undefined
);

export const DataContextProvider = ({ children }: { children: ReactNode }) => {
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);

  const getTeam = async (userId: string) => {
    try {
      const response = await fetch(`${baseURL}/get/${userId}`);
    } catch (error) {}
  };

  const values: DataContextType = {
    team,
    setTeam,
    loading,
  };

  return <DataContext value={values}>{children}</DataContext>;
};

export function useDataContext() {
  const context = use(DataContext);
  if (!context) {
    throw new Error(
      "useDataContext must be used within an DataContextProvider"
    );
  }
  return context;
}
