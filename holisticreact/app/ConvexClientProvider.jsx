"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ConvexProviderWithAuth0 } from "convex/react-auth0";
import { Auth0Provider } from "@auth0/auth0-react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);

export default function ConvexClientProvider({ children }) {
  return (
    <Auth0Provider
      domain="dev-7hkhi7jhbzqj0ynv.us.auth0.com"
      clientId="FYELHbBV9KT34K0OUx8lOtZXFt86HMW4"
      authorizationParams={{
        redirect_uri:
          typeof window === "undefined"
            ? undefined
            : "http://localhost:3000/home",
      }}
      useRefreshTokens={true}
      cacheLocation="localstorage"
    >
      <ConvexProviderWithAuth0 client={convex}>
        {children}
      </ConvexProviderWithAuth0>
    </Auth0Provider>
  );
}
