"use client"

import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AUTH } from "@/firebase";
import { setUser, clearUser } from "@/utils/userSlice";

export default function AuthProvider({ children }) {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(AUTH, (user) => {
      if (user) {
        const { uid, displayName, email } = user;
        dispatch(setUser({ uid, email, displayName }));
        router.push("/");
      } else {
        console.log("sign out");
        dispatch(clearUser());
      }
    });

    return unsubscribe;
  }, [dispatch, router]);

  return <>{children}</>;
}
