import crypto from "crypto";
import { useSearchParams } from "next/navigation";
import { GoogleClientId } from "../const/config";

export function useGoogleEmail() {
  const searchParams = useSearchParams();
  const scope = searchParams.get("scope");
  const isGoogleAuth = scope?.includes("google");
  const googleCode = isGoogleAuth ? searchParams.get("code") : null;

  function openGoogleAuth() {
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = generateCodeChallenge(codeVerifier);
    const state = crypto.randomBytes(16).toString("hex");
    const redirectUri = window.location.href;

    const authUrl =
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `response_type=code&` +
      `client_id=${GoogleClientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=openid%20email%20profile&` +
      `state=${state}&` +
      `code_challenge=${encodeURIComponent(codeChallenge)}&` +
      `code_challenge_method=S256&` +
      `access_type=offline`;

    window.location.href = authUrl;
  }

  function removeGoogleCodeParams() {
    const url = new URL(window.location.href);
    url.searchParams.forEach((value, key) => {
      url.searchParams.delete(key);
    });
    window.history.replaceState({}, "", url.toString());
  }

  return {
    googleCode,
    openGoogleAuth,
    removeGoogleCodeParams,
  };
}

function generateCodeVerifier() {
  const codeVerifier = crypto.randomBytes(32).toString("hex");
  localStorage.setItem("codeVerifier", codeVerifier);
  return codeVerifier;
}

function generateCodeChallenge(codeVerifier: string) {
  return crypto
    .createHash("sha256")
    .update(codeVerifier)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}
