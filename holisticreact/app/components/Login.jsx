"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import JsonView from "@uiw/react-json-view";
import { useAction } from "convex/react";
import { myAPICall } from "../../convex/functions";
import { api } from "../../convex/_generated/api";
import { Roboto_Flex } from "next/font/google";
import { useAuth0 } from "@auth0/auth0-react";
import { useConvexAuth } from "convex/react";

// This is how to use out REST API
const roboto = Roboto_Flex({ subsets: ["latin"] });

export default function Login() {
  const { loginWithRedirect } = useAuth0();
  const { isLoading, isAuthenticated } = useConvexAuth();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        justifyContent: "center",
        letterSpacing: "1px",
        alignItems: "center",
      }}
      className={roboto.className}
    >
      <h1 style={{ color: "white", fontSize: "40px", fontWeight: "bold" }}>
        Holistic Health
      </h1>
      <h2>All your health, one place</h2>

      <div
        className={roboto.className}
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* <input
          type="text"
          placeholder="Username"
          style={{
            height: "24px",
            marginTop: "20px",
            fontSize: "15px",
            padding: "20px",
          }}
          className="px-2 py-4 rounded-full w-fit text-center"
        ></input>

        <input
          type="text"
          placeholder="Password"
          style={{
            height: "24px",
            marginTop: "20px",
            fontSize: "15px",
            padding: "20px",
          }}
          className="px-2 py-4 rounded-full w-fit text-center"
        ></input> */}
      </div>

      <button
        className={roboto.className}
        onClick={() => loginWithRedirect()}
        style={{
          borderRadius: "15px",
          width: "190px",
          marginTop: "20px",
          padding: "10px",
          fontSize: "15px",
          color: "white",
          border: "1px solid white",
        }}
      >
        Login
      </button>
    </div>
  );
}
// ^^ right above is where the data gets outputted
