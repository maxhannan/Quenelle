import { type ReactNode, createContext, useState } from "react";

type PingContextType = {
  ping: boolean;
  setPing: React.Dispatch<React.SetStateAction<boolean>>;
};
const PingContext = createContext<PingContextType | undefined>(undefined);

export const PingContextProvider = ({ children }: { children: ReactNode }) => {
  const [ping, setPing] = useState(false);

  return (
    <PingContext.Provider value={{ ping, setPing }}>
      {children}
    </PingContext.Provider>
  );
};

export default PingContext;
