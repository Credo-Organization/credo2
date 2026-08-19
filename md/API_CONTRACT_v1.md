# PRAMAAN — API Contract v1
## Hand this to the frontend dev. Not the taxonomy JSON.

**Freeze this before either of you writes real code.** Both sides build against this document. It is the only thing that has to stay in sync.

---

## 0. Why you are NOT getting the taxonomy file

The taxonomy and opportunities JSON are **backend seed data**. They load into Postgres on startup and never leave the server.

If the frontend hardcodes skill names or opportunity titles from those files, you get two sources of truth. When the backend changes a canonical name, the UI silently shows the old one. Nobody notices until demo day.

**Rule: the frontend renders whatever the API returns and knows nothing about the taxonomy.** Skill names, categories, colours, tier labels — all come down the wire.

The one exception is at the bottom of this document: a small set of enum values the frontend needs for styling.

---

## 1. Conventions

- Base URL: `/api/v1`
- Auth: Supabase JWT in `Authorization: Bearer <token>`
- All timestamps: ISO 8601 UTC (`2026-08-15T09:30:00Z`)
- Errors: consistent shape (§8)
- Long operations return a `job_id` and are polled (§3)

---

## 2. TypeScript types — copy these into the frontend

```typescript
// ─────────── Enums ───────────
export type EvidenceLevel = 0 | 1 | 2 | 3 | 3.5 | 4;

export type VerificationStatus =
  | "issuer_verified"      // L4 — signature valid, issuer in registry
  | "task_demonstrated"    // L3.5
  | "authorship_linked"    // L3 — verified commits over time
  | "corroborated"         // L2 — 2+ independent sources
  | "artefact_backed"      // L1 — file exists, unsigned
  | "self_reported"        // L0
  | "signature_invalid"    // tampered
  | "unrecognised_issuer"  // signature valid, issuer unknown
  | "contradicted";        // claimed, evidence says otherwise

export type ConfidenceBand = "high" | "moderate" | "low" | "insufficient";
export type SourceType     = "resume" | "github" | "credential" | "manual" | "microtask";
export type Independence   = "self" | "observed" | "signed";
export type JobStatus      = "queued" | "running" | "completed" | "failed";

// ─────────── Evidence ───────────
export interface EvidenceItem {
  id: string;
  source_type: SourceType;
  independence: Independence;
  label: string;              // "package.json in ecommerce-api"
  detail: string;             // "react ^18.2.0 in dependencies"
  source_excerpt: string | null;  // verbatim span (resume only)
  source_url: string | null;
  occurred_at: string | null;
  months_ago: number | null;
}

// ─────────── Passport ───────────
export interface PassportSkill {
  skill_id: string;           // "SK-FE-003"
  skill_name: string;         // "React"
  category: string;           // "FE"
  category_label: string;     // "Frontend"
  evidence_level: EvidenceLevel;
  verification_status: VerificationStatus;
  confidence: ConfidenceBand;
  confidence_reason: string;  // human-readable, PRE-COMPOSED by backend
  recency_factor: number;     // 0.5 – 1.0
  last_demonstrated: string | null;
  source_count: number;
  independent_source_count: number;
  evidence: EvidenceItem[];
}

export interface UnmappedSkill {
  raw_text: string;
  source_type: SourceType;
  best_guess: string | null;
  similarity: number | null;
}

export interface Passport {
  user_id: string;
  display_name: string;
  headline: string | null;
  career_goal: string | null;
  generated_at: string;
  last_synced_at: string;
  summary: {
    issuer_verified: number;
    task_demonstrated: number;
    authorship_linked: number;
    corroborated: number;
    self_reported: number;
    total_skills: number;
  };
  skills: PassportSkill[];
  unmapped: UnmappedSkill[];
  connected_sources: {
    github_handle: string | null;
    resume_uploaded: boolean;
    credentials_count: number;
  };
}

// ─────────── Opportunities & matching ───────────
export interface Opportunity {
  id: string;
  title: string;
  org_name: string;
  location: string;
  duration: string;
  description: string;
  is_demo: boolean;
  requirement_count: number;
}

export interface RequirementResult {
  skill_id: string;
  skill_name: string;
  weight: number;              // 0–100
  is_critical: boolean;
  is_gap: boolean;
  evidence_level: EvidenceLevel | null;
  verification_status: VerificationStatus | null;
  confidence: ConfidenceBand;
  contribution: number;        // points earned of `weight`
  explanation: string;         // PRE-COMPOSED by backend
  evidence: EvidenceItem[];
}

export interface MatchResult {
  match_id: string;
  opportunity: Opportunity;
  coverage: number;                    // 0–100, SECONDARY display
  requirements_evidenced: string;      // "6/8"  ← PRIMARY display
  sufficiency: "sufficient" | "insufficient_evidence_to_rank";
  summary: string;                     // PRE-COMPOSED
  requirements: RequirementResult[];
  gaps: RequirementResult[];
  computed_at: string;
  engine_version: string;
}

// ─────────── Jobs ───────────
export interface Job {
  job_id: string;
  kind: "ingest_github" | "ingest_resume" | "ingest_credential" | "rebuild_passport";
  status: JobStatus;
  progress: number;            // 0–100
  message: string | null;
  error: string | null;
  created_at: string;
}
```

---

## 3. Endpoints

### Onboarding
```
POST /onboarding
body: { display_name, education_level, graduation_year, career_goal }
→ 200 { user_id, onboarded: true }
```
⚠️ **No gender. No country.** If either appears in the form, it's a bug — see the fairness rules.
`career_goal` may be `null` ("not sure yet").

### Ingestion — all async
```
POST /ingest/github        { handle }               → 202 { job_id }
POST /ingest/resume        multipart: file          → 202 { job_id }
POST /ingest/credential    multipart: file          → 202 { job_id }
GET  /jobs/{job_id}                                 → 200 Job
```

**Frontend flow:** POST → get `job_id` → poll `GET /jobs/{id}` every 2s → on `completed`, refetch the passport. Show `progress` and `message`.

Typical `message` values: *"Fetching repositories…"*, *"Analysing 14 repositories…"*, *"Extracting from resume…"*, *"Verifying issuer signature…"*

### Passport
```
GET  /passport/me                    → 200 Passport
POST /passport/refresh               → 202 { job_id }
GET  /passport/{user_id}?token=xyz   → 200 Passport   (consent-scoped, may be partial)
```

### Opportunities & matching
```
GET  /opportunities                  → 200 { opportunities: Opportunity[] }
POST /match                          { opportunity_id }  → 200 MatchResult
GET  /match/{match_id}               → 200 MatchResult
```

### Consent
```
GET    /consents                     → 200 { consents: Consent[] }
POST   /consents                     { scope, expires_in_days } → 201 { consent_id, share_url, qr_payload }
DELETE /consents/{id}                → 204
```
`scope` ∈ `"skills_only" | "skills_and_evidence" | "full"`

---

## 4. Example responses — build against these

### `GET /passport/me`
```json
{
  "user_id": "u_8f2c",
  "display_name": "Aman Kumar",
  "headline": null,
  "career_goal": "Full Stack Developer",
  "generated_at": "2026-08-15T09:30:00Z",
  "last_synced_at": "2026-08-15T09:30:00Z",
  "summary": {
    "issuer_verified": 1,
    "task_demonstrated": 0,
    "authorship_linked": 5,
    "corroborated": 3,
    "self_reported": 4,
    "total_skills": 13
  },
  "skills": [
    {
      "skill_id": "SK-FE-003",
      "skill_name": "React",
      "category": "FE",
      "category_label": "Frontend",
      "evidence_level": 3,
      "verification_status": "authorship_linked",
      "confidence": "high",
      "confidence_reason": "Found in 4 repositories with 61 authored commits spanning 8 months, plus a resume mention.",
      "recency_factor": 0.94,
      "last_demonstrated": "2026-06-22",
      "source_count": 3,
      "independent_source_count": 2,
      "evidence": [
        {
          "id": "ev_101",
          "source_type": "github",
          "independence": "observed",
          "label": "package.json in shopfront-web",
          "detail": "react ^18.2.0, react-dom ^18.2.0",
          "source_excerpt": null,
          "source_url": "https://github.com/amank/shopfront-web",
          "occurred_at": "2026-06-22",
          "months_ago": 2
        },
        {
          "id": "ev_102",
          "source_type": "resume",
          "independence": "self",
          "label": "Resume — Projects",
          "detail": "Self-reported",
          "source_excerpt": "Built a shopping cart UI in React with Redux state management",
          "source_url": null,
          "occurred_at": null,
          "months_ago": null
        }
      ]
    },
    {
      "skill_id": "SK-OPS-001",
      "skill_name": "Docker",
      "category": "OPS",
      "category_label": "DevOps / Cloud",
      "evidence_level": 0,
      "verification_status": "contradicted",
      "confidence": "insufficient",
      "confidence_reason": "Claimed on resume, but no Dockerfile or docker dependency found across 14 repositories.",
      "recency_factor": 0.5,
      "last_demonstrated": null,
      "source_count": 1,
      "independent_source_count": 0,
      "evidence": [
        {
          "id": "ev_140",
          "source_type": "resume",
          "independence": "self",
          "label": "Resume — Skills",
          "detail": "Self-reported",
          "source_excerpt": "Docker, Kubernetes, CI/CD",
          "source_url": null,
          "occurred_at": null,
          "months_ago": null
        }
      ]
    }
  ],
  "unmapped": [
    { "raw_text": "Blockchain", "source_type": "resume", "best_guess": null, "similarity": 0.31 }
  ],
  "connected_sources": {
    "github_handle": "amank",
    "resume_uploaded": true,
    "credentials_count": 1
  }
}
```

### `POST /match`
```json
{
  "match_id": "m_4471",
  "opportunity": {
    "id": "OPP-004",
    "title": "Full Stack Developer Intern",
    "org_name": "Orbit Labs",
    "location": "Hyderabad (Hybrid)",
    "duration": "6 months",
    "description": "End-to-end feature ownership on a MERN-stack product.",
    "is_demo": true,
    "requirement_count": 8
  },
  "coverage": 71.4,
  "requirements_evidenced": "6/8",
  "sufficiency": "sufficient",
  "summary": "Strongest evidence for React, Node.js and MongoDB. JWT Authentication has moderate evidence. Docker is the main gap.",
  "requirements": [
    {
      "skill_id": "SK-FE-003",
      "skill_name": "React",
      "weight": 18,
      "is_critical": true,
      "is_gap": false,
      "evidence_level": 3,
      "verification_status": "authorship_linked",
      "confidence": "high",
      "contribution": 16.9,
      "explanation": "4 repositories with authored commits over 8 months.",
      "evidence": []
    }
  ],
  "gaps": [
    {
      "skill_id": "SK-OPS-001",
      "skill_name": "Docker",
      "weight": 8,
      "is_critical": false,
      "is_gap": true,
      "evidence_level": null,
      "verification_status": "contradicted",
      "confidence": "insufficient",
      "contribution": 0,
      "explanation": "Claimed on resume but not found in any repository.",
      "evidence": []
    }
  ],
  "computed_at": "2026-08-15T09:31:12Z",
  "engine_version": "coverage-v1.0"
}
```

---

## 5. Rules the frontend must follow

| Rule | Why |
|---|---|
| **Never compute a score client-side.** Render `coverage` and `contribution` as given. | Every number must be reproducible and auditable server-side. |
| **`requirements_evidenced` is the primary display. `coverage` % is secondary and smaller.** | A percentage without the grid is the exact "fake precision" the project argues against. |
| **Never write your own explanation text.** Use `confidence_reason`, `explanation`, `summary` verbatim. | If the UI paraphrases, it can contradict the score on screen. |
| **`sufficiency: "insufficient_evidence_to_rank"` gets its own panel — not the bottom of the list.** | Absence of evidence ≠ low ability. Bottom-of-list is a silent rejection. |
| **Render `unmapped[]` visibly.** | Silently dropping what we can't classify is dishonest. |
| **`contradicted` needs its own visual state**, distinct from "low confidence". | Claimed-but-unsupported ≠ not-enough-data. Different meanings. |
| **Never display gender/country.** They don't exist in the API. | If you see one, it's a bug. |

---

## 6. Suggested visual mapping *(frontend's call, this is a starting point)*

| `verification_status` | Badge | Colour |
|---|---|---|
| `issuer_verified` | Issuer verified | strong green |
| `task_demonstrated` | Task demonstrated | green |
| `authorship_linked` | Authorship linked | teal |
| `corroborated` | Corroborated | blue |
| `artefact_backed` | Document only | slate |
| `self_reported` | Self-reported | grey |
| `unrecognised_issuer` | Unrecognised issuer | amber |
| `signature_invalid` | Signature invalid | red |
| `contradicted` | Claimed, unsupported | amber, outlined |

`confidence`: `high` / `moderate` / `low` / `insufficient` — render `insufficient` as neutral grey, **never red**. It is not a failure state.

---

## 7. Mock server — run this today

Frontend builds against this from hour one. No backend logic required.

```python
# mock_server.py   →   pip install fastapi uvicorn
#                      uvicorn mock_server:app --reload --port 8000
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json, uuid, time

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"],
                   allow_methods=["*"], allow_headers=["*"])

FIXTURES = json.load(open("fixtures.json"))   # the example payloads from §4
JOBS = {}

@app.post("/api/v1/ingest/{kind}")
def ingest(kind: str):
    jid = f"job_{uuid.uuid4().hex[:8]}"
    JOBS[jid] = {"job_id": jid, "kind": f"ingest_{kind}", "status": "running",
                 "progress": 0, "message": "Starting…", "error": None,
                 "created_at": "2026-08-15T09:30:00Z", "_t": time.time()}
    return {"job_id": jid}

@app.get("/api/v1/jobs/{job_id}")
def job(job_id: str):
    j = JOBS[job_id]
    elapsed = time.time() - j["_t"]                 # fake 6-second progress
    j["progress"] = min(100, int(elapsed / 6 * 100))
    j["status"] = "completed" if j["progress"] >= 100 else "running"
    j["message"] = "Done" if j["status"] == "completed" else "Analysing repositories…"
    return {k: v for k, v in j.items() if not k.startswith("_")}

@app.get("/api/v1/passport/me")
def passport():        return FIXTURES["passport"]

@app.get("/api/v1/opportunities")
def opportunities():   return {"opportunities": FIXTURES["opportunities"]}

@app.post("/api/v1/match")
def match():           return FIXTURES["match"]
```

**Ship this on Day 1.** Your friend is never blocked, and integration becomes swapping one endpoint at a time instead of a cliff on Day 9.

---

## 8. Errors

```json
{ "error": { "code": "GITHUB_RATE_LIMITED",
             "message": "GitHub rate limit reached. Try again in 12 minutes.",
             "retry_after_seconds": 720 } }
```

Codes the UI must handle with a specific message:

| Code | Meaning |
|---|---|
| `GITHUB_USER_NOT_FOUND` | Handle doesn't exist |
| `GITHUB_RATE_LIMITED` | Show `retry_after_seconds` |
| `GITHUB_NO_PUBLIC_REPOS` | Not an error — offer manual entry |
| `RESUME_UNREADABLE` | Likely scanned image — offer manual entry |
| `RESUME_TOO_LARGE` | >10MB |
| `CREDENTIAL_UNSUPPORTED_FORMAT` | Not an Open Badge or signed VC |
| `EXTRACTION_FAILED` | LLM/parse failure — offer retry |
| `CONSENT_EXPIRED` | Shared link expired |
| `CONSENT_REVOKED` | Owner revoked access |

**Every failure gets a specific message.** For a trust product, a silent failure reads to the user as *"the system rejected my skills"* when actually the system broke.

---

## 9. The 4 enums the frontend may hardcode

Only these. Everything else comes from the API.

```typescript
const CATEGORY_LABELS = {
  LANG: "Languages",   FE:  "Frontend",  BE:  "Backend",
  DB:   "Databases",   AI:  "AI / Data", OPS: "DevOps / Cloud",
  MOB:  "Mobile",      QA:  "Testing",   DES: "Design",
  PRD:  "Product",     SEC: "Security",  TOOL:"Tools",
} as const;
```

The other three (`VerificationStatus`, `ConfidenceBand`, `JobStatus`) are in §2.

---

## 10. Change protocol

This contract changes **only** by agreement between both of you, and the version at the top gets bumped. No silent field renames. If a shape must change, update the mock fixtures in the same commit.
