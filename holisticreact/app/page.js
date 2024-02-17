import Image from "next/image";
import { useSearchParams } from "next/navigation";
import ConnectUser from "./components/ConnectUser";
import RestAPI from "./components/RestAPI";

export default function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 px-48">
      <div className="grid grid-cols-[1fr_1fr] gap-12 justify-center items-center w-full">
        <ConnectUser />
        <RestAPI />
      </div>
    </main>
  );
}