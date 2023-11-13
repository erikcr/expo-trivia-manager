import { useEffect, useState, createContext } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "./supabase";

export const SessionContext = createContext<Session | null>(null);

export default function SessionContextProvider({ children }) {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
}
