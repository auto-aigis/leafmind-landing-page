"use client";

import { useCallback, useContext } from "react";
import { AuthContext } from "@/app/_components/AuthProvider";

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

export function useRefresh() {
  const { refresh } = useAuth();
  return useCallback(refresh, [refresh]);
}
