import { createBrowserClient } from "@supabase/ssr";

const DEFAULT_ANON_KEY = "sb_publishable_hGB52K6xuHwyS4sWs512SQ_L1nE4sNU";

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://wizuwacevushwlegfgyu.supabase.co";
  let supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Protect against expired legacy JWTs from old Supabase key rotation
  if (!supabaseAnonKey || supabaseAnonKey.startsWith("eyJhbGci") || supabaseAnonKey.includes("mock-anon-key")) {
    supabaseAnonKey = DEFAULT_ANON_KEY;
  }

  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey
  );
}

