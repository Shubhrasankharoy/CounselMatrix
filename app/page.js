"use client"
import Navbar from "@/components/Navbar";
import { AUTH } from "@/firebase";
import { clearUser } from "@/utils/userSlice";
import { signOut } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";

export default function Home() {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);

  const handleSignOut = () => {
    signOut(AUTH).then(() => {
      // Sign-out successful.
      dispatch(clearUser())
    }).catch((error) => {
      // An error happened.
    });
  }

  return (
    <div>
      <Navbar />
    </div>
  );
}
