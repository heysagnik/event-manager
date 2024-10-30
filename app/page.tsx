import { getTokens } from "next-firebase-auth-edge";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { clientConfig, serverConfig } from "../config";
import { CopilotKit } from "@copilotkit/react-core"; 
import "@copilotkit/react-ui/styles.css";

import Page from "./dashboard";
import { CopilotPopup } from "@copilotkit/react-ui";

export default async function Home() {
  const tokens = await getTokens(await cookies(), {
    apiKey: clientConfig.apiKey,
    cookieName: serverConfig.cookieName,
    cookieSignatureKeys: serverConfig.cookieSignatureKeys,
    serviceAccount: serverConfig.serviceAccount,
  });

  if (!tokens) {
    notFound();
  }

  const user = {
    name: tokens.decodedToken.name || "Unknown User",
    email: tokens.decodedToken.email || "unknown@example.com",
    avatar: tokens.decodedToken.picture || "",
  };

  return (
     <CopilotKit runtimeUrl="/api/copilotkit">
      
      <Page user={user} />
      <CopilotPopup/>
      
    </CopilotKit>
  );
}