import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
export default function useAuth() {
  const [isAdmin, setIsAdmin] = useState(false);
  const { admin } = useSelector((store) => {
    return store.user;
  });
  const [checking, setChecking] = useState(true);
  useEffect(() => {
    if (admin) {
      setIsAdmin(true);
    }
    setChecking(false);
  }, [admin]);
  return { isAdmin, checking };
}
