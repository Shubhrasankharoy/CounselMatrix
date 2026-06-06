"use client"
import Navbar from "@/components/Navbar";
import { AUTH } from "@/firebase";
import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";

export default function Home() {
  const user = useSelector((state) => state.user);


  return (
    <div>
      <Navbar/>
      <button>
        <Link href="/login">Login</Link>
      </button>
    </div>
  );
}
