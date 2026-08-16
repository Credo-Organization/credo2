import { createClient } from "@/lib/supabase/server";

export default async function DebugDBPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return <div>Not logged in</div>;

  const { data: evidence, error: evError } = await supabase
    .from("evidence")
    .select(`
      id,
      source_type,
      raw_ref,
      evidence_claims (
        extracted_text,
        unmapped_label,
        skill_id,
        match_confidence
      )
    `)
    .eq("user_id", user.id);

  return (
    <div className="p-8 font-mono text-xs text-white">
      <h1>Debug DB for User: {user.id}</h1>
      <pre>
        {JSON.stringify({ evError, evidence }, null, 2)}
      </pre>
    </div>
  );
}
