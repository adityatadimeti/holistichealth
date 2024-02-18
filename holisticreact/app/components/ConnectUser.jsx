"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

// This is how you can connect a user
async function connectUser() {
  let request = await fetch(
    "https://api.tryterra.co/v2/auth/generateWidgetSession",
    {
      method: "POST",
      headers: {
        "dev-id": process.env.NEXT_PUBLIC_DEV_ID,
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        auth_success_redirect_url: "http://localhost:3000/home",
      }),
    }
  );

  let response = await request.json();
  return response.url;
}

export default function ConnectUser() {
  const searchParams = useSearchParams();

  useEffect(() => {
    setUser({
      userID: searchParams.get("user_id"),
      resource: searchParams.get("resource"),
    });
  }, []);

  const [user, setUser] = useState({
    userID: null,
    resource: null,
  });

  const { loggedUser, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    <div className=" col-span-2 bg-white/20 p-12 rounded-[30px] border-2 border-white flex justify-center items-center flex-col gap-8 w-full">
      {isAuthenticated && console.log("is done")}

      {!user.userID ? (
        <>
          <p className="text-[24px] font-semibold">Choose integrations</p>
          <button
            className="bg-white px-4 py-2 rounded-full border-2 border-black"
            onClick={async (e) => {
              e.currentTarget.innerText = "Connecting...";
              window.location.href = await connectUser();
            }}
          >
            Connect
          </button>
        </>
      ) : (
        <>
          <p className="text-[24px] font-semibold">Connected User</p>
          <p className="text-[18px] font-medium">User ID: {user.userID}</p>
          <p className="text-[18px] font-medium">
            Provider: {user.resource ? user.resource : "Unknown"}
          </p>
        </>
      )}
    </div>
  );
}
