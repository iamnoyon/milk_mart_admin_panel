"use client";

import { signOut } from "next-auth/react";

export async function performLogout() {
  try {
    if (typeof window !== "undefined") {
      localStorage.removeItem("backendToken");
    }
  } catch {}

  try {
    await signOut({ redirect: false });
  } catch {}

  window.location.replace("/");
}
