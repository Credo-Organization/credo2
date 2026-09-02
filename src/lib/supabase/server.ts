import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const DEFAULT_ANON_KEY = "sb_publishable_hGB52K6xuHwyS4sWs512SQ_L1nE4sNU";

export async function createClient() {
  const cookieStore = await cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://wizuwacevushwlegfgyu.supabase.co";
  let supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Protect against expired legacy JWTs from old Supabase key rotation
  if (!supabaseAnonKey || supabaseAnonKey.startsWith("eyJhbGci") || supabaseAnonKey.includes("mock-anon-key")) {
    supabaseAnonKey = DEFAULT_ANON_KEY;
  }

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method is called from a Server Component.
            // This can be ignored if middleware is refreshing sessions.
          }
        },
      },
    }
  );
}

