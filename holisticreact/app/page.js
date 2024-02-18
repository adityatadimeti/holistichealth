import Image from "next/image";
import { useSearchParams } from "next/navigation";
import ConnectUser from "./components/ConnectUser";
import { Roboto_Flex } from "next/font/google";
import Login from "./components/Login";

const roboto = Roboto_Flex({ subsets: ["latin"] });

export default function Home() {
  return (
    <main
      className="flex min-h-screen flex-col items-center "
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Login />
    </main>
  );
}
