// Measures what each Agent Router model can actually do, so the model registry
// is configured from evidence instead of assumption.
// Run: node scripts/probe-models.mjs
import { createOpenAI } from "@ai-sdk/openai";
import { generateObject, generateText } from "ai";
import { z } from "zod";
import fs from "node:fs";

const env = Object.fromEntries(
  fs.readFileSync(".env", "utf8").split(/\r?\n/)
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()])
);

// Provider is selectable so a new gateway can be measured without touching the
// credentials of the one that currently works.
//   node scripts/probe-models.mjs                 -> default provider
//   node scripts/probe-models.mjs agentrouter     -> alternate provider
const NL = String.fromCharCode(10);

const PROVIDERS = {
  default: {
    baseURL: env.AI_BASE_URL || env.OPENROUTER_BASE_URL || "https://aicredits.in/v1",
    apiKey: env.OPENROUTER_API_KEY || env.AICREDIT_API_KEY,
    models: (env.PROBE_MODELS || "").split(",").map((m) => m.trim()).filter(Boolean),
  },
  agentrouter: {
    baseURL: env.AGENTROUTER_BASE_URL,
    apiKey: env.AGENTROUTER_API_KEY,
    models: ["claude-opus-5", "claude-opus-4-8", "gpt-5.6-sol", "glm-5.3", "deepseek-v4-flash"],
  },
  nvidia: {
    baseURL: env.NVIDIA_BASE_URL || "https://integrate.api.nvidia.com/v1",
    apiKey: env.NVIDIA_API_KEY,
    // Left empty on purpose: NIM's catalog changes, so the real ids are
    // discovered from /v1/models rather than guessed here.
    models: (env.NVIDIA_PROBE_MODELS || "").split(",").map((m) => m.trim()).filter(Boolean),
  },
};

const which = process.argv[2] || "default";
const cfg = PROVIDERS[which];
if (!cfg) {
  console.error(`Unknown provider "${which}". Options: ${Object.keys(PROVIDERS).join(", ")}`);
  process.exit(1);
}
if (!cfg.apiKey) {
  console.error(`No API key configured for "${which}". Set it in .env and re-run.`);
  process.exit(1);
}
console.log(`provider: ${which}  base: ${cfg.baseURL}
`);

const provider = createOpenAI({
  baseURL: cfg.baseURL,
  apiKey: cfg.apiKey,
  compatibility: "compatible",
});

// Discover real model ids when none are pinned, so the probe never tests
// names that do not exist on the provider.
let MODELS = cfg.models;
if (!MODELS.length) {
  const res = await fetch(`${cfg.baseURL.replace(/\/$/, "")}/models`, {
    headers: { Authorization: `Bearer ${cfg.apiKey}` },
  });
  if (!res.ok) {
    console.error(`Could not list models: HTTP ${res.status} ${(await res.text()).slice(0, 160)}`);
    process.exit(1);
  }
  const all = (await res.json()).data?.map((m) => m.id) ?? [];
  console.log(`discovered ${all.length} models on ${which}`);

  const pick = process.argv[3];
  if (pick === "--all") {
    MODELS = all;
  } else if (pick) {
    MODELS = all.filter((id) => id.toLowerCase().includes(pick.toLowerCase()));
    console.log(`filtered to ${MODELS.length} matching "${pick}"`);
  } else {
    // Default: one candidate per vendor family, which is what an ensemble wants.
    const families = ["meta/", "qwen/", "deepseek-ai/", "mistralai/", "nvidia/", "microsoft/", "google/"];
    MODELS = families
      .map((f) => all.find((id) => id.startsWith(f)))
      .filter(Boolean);
    console.log("probing one model per family; pass --all or a filter to widen" + NL);
  }
  if (!MODELS.length) {
    console.error("No models matched. Re-run with --all to see the full list.");
    process.exit(1);
  }
  console.log(MODELS.map((m) => "  " + m).join(NL) + NL);
}

// The real anti-cheat schema, so this tests the exact shape production sends.
const integrity = z.object({
  integrity_score: z.number().min(0).max(100),
  integrity_flags: z.array(z.string()),
  integrity_status: z.enum(["verified", "flagged"]),
  verified_skills: z.array(z.string()),
});

const REPO = "Evaluate repo 'my-portfolio': a direct fork of vercel/next.js-examples, 0 personal commits, default Create React App README.";

// 1x1 transparent PNG - enough to detect whether image input is accepted at all.
const PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
  "base64"
);

const CALL_TIMEOUT_MS = Number(env.PROBE_TIMEOUT_MS || 45000);
const BUDGET = Number(env.PROBE_MAX_TOKENS || 2048);

// A hung provider must not hang the probe. Production needs the same guarantee,
// so the timeout budget is measured here rather than assumed.
async function timed(fn) {
  const t0 = Date.now();
  try {
    const r = await Promise.race([
      fn(),
      new Promise((_, rej) =>
        setTimeout(() => rej(new Error(`timeout after ${CALL_TIMEOUT_MS}ms`)), CALL_TIMEOUT_MS)
      ),
    ]);
    return { ok: true, ms: Date.now() - t0, usage: r?.usage, value: r };
  } catch (e) {
    return { ok: false, ms: Date.now() - t0, err: (e?.message || String(e)).slice(0, 110) };
  }
}

// Every probe is independent, so run them concurrently. Sequential probing made
// a 6-model sweep take minutes for no reason.
const results = await Promise.all(
  MODELS.map(async (id) => {
    const model = provider.chat(id);
    const [chat, json, vision] = await Promise.all([
      timed(() => generateText({ model, prompt: "Reply with the single word: ok", maxOutputTokens: BUDGET })),
      timed(() => generateObject({ model, schema: integrity, prompt: REPO, maxOutputTokens: BUDGET })),
      timed(() =>
        generateText({
          model,
          maxOutputTokens: BUDGET,
          messages: [{ role: "user", content: [
            { type: "text", text: "Describe this image in three words." },
            { type: "file", data: PNG, mediaType: "image/png" },
          ]}],
        })
      ),
    ]);
    console.log(`  ${id.padEnd(38)} chat=${chat.ok?"y":"n"} json=${json.ok?"y":"n"} vision=${vision.ok?"y":"n"}`);
    return { id, chat, json, vision };
  })
);

console.log("\n" + "=".repeat(96));
console.log("MODEL".padEnd(20), "CHAT".padEnd(7), "JSON".padEnd(7), "VISION".padEnd(8), "JSON ms".padEnd(9), "TOKENS");
console.log("=".repeat(96));
for (const r of results) {
  const u = r.json.usage;
  const reason = u?.reasoningTokens ? ` (+${u.reasoningTokens} reasoning)` : "";
  const tok = u ? `${u.inputTokens ?? "?"}in/${u.outputTokens ?? "?"}out${reason}` : "-";
  console.log(
    r.id.padEnd(20),
    (r.chat.ok ? "yes" : "NO").padEnd(7),
    (r.json.ok ? "yes" : "NO").padEnd(7),
    (r.vision.ok ? "yes" : "NO").padEnd(8),
    String(r.json.ok ? r.json.ms : "-").padEnd(9),
    tok
  );
}
console.log("=".repeat(96));

console.log("\nVerdict sanity (did the model catch the fake repo?):");
for (const r of results) {
  if (r.json.ok) {
    const o = r.json.value.object;
    console.log(`  ${r.id.padEnd(20)} status=${o.integrity_status.padEnd(9)} score=${String(o.integrity_score).padEnd(4)} flags=${o.integrity_flags.length}`);
  }
}

console.log("\nFailures:");
let any = false;
for (const r of results) {
  for (const [k, v] of Object.entries({ chat: r.chat, json: r.json, vision: r.vision })) {
    if (!v.ok) { console.log(`  ${r.id} ${k}: ${v.err}`); any = true; }
  }
}
if (!any) console.log("  none");
