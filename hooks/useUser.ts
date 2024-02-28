import { useState, useEffect } from "react";

import { User } from "@/types";

export default function useUser() {
  const [ user, setUser ] = useState<User | null>(null);

  useEffect(() => {


  }, []);

  return user;
}
