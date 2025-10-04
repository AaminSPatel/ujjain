//import Home from "../components/home/home"
'use client'
import dynamic from "next/dynamic";

const Home = dynamic(() => import("@/components/home/home"), {
  ssr: false,
});
export default function Page() {
  return <Home />
}
