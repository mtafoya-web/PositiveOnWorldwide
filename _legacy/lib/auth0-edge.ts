import { initAuth0 } from "@auth0/nextjs-auth0/edge";
import { getAuth0Config } from "@/lib/auth0-config";

export const auth0 = initAuth0(getAuth0Config());
